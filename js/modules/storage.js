/**
 * Storage Module
 * Handles IndexedDB storage with request queuing for data integrity
 */

/**
 * IndexedDB Storage Manager
 */
export class Storage {
    constructor() {
        this.dbName = 'MarkdownEditorDB';
        this.dbVersion = 1;
        this.db = null;
        this.isReady = false;

        // Request queue to serialize database operations
        this.requestQueue = Promise.resolve();

        this.readyPromise = this.init();
    }

    /**
     * Initialize IndexedDB
     */
    async init() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                console.error('IndexedDB not supported');
                return reject(new Error('IndexedDB not supported'));
            }

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                reject(request.error);
            };

            request.onblocked = () => {
                console.warn('IndexedDB blocked. Please close other tabs.');
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.isReady = true;

                // Handle connection closing
                this.db.onversionchange = () => {
                    this.db.close();
                    this.isReady = false;
                    console.warn('Database version changed. Connection closed.');
                };

                console.log('IndexedDB initialized successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Documents store
                if (!db.objectStoreNames.contains('documents')) {
                    const docStore = db.createObjectStore('documents', { keyPath: 'id' });
                    docStore.createIndex('title', 'title', { unique: false });
                    docStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                    docStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Snapshots store
                if (!db.objectStoreNames.contains('snapshots')) {
                    const snapshotStore = db.createObjectStore('snapshots', { keyPath: 'id' });
                    snapshotStore.createIndex('documentId', 'documentId', { unique: false });
                    snapshotStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * Enqueue a database operation
     * @param {Function} operation - async function returning a promise
     * @returns {Promise}
     */
    async enqueue(operation) {
        this.requestQueue = this.requestQueue.then(() => operation().catch(err => {
            console.error('Database operation failed:', err);
            throw err;
        }));
        return this.requestQueue;
    }

    /**
     * Wait for DB to be ready
     */
    async ready() {
        if (!this.isReady) {
            await this.readyPromise;
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    // ==================== DOCUMENT OPERATIONS ====================

    async saveDocument(document) {
        return this.enqueue(async () => {
            await this.ready();

            // Input validation
            if (!document || typeof document !== 'object') {
                throw new Error('Invalid document object');
            }
            if (document.title && document.title.length > 200) {
                throw new Error('Title too long (max 200 characters)');
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['documents'], 'readwrite');
                const store = transaction.objectStore('documents');

                const doc = {
                    ...document,
                    id: document.id || this.generateId(),
                    updatedAt: new Date().toISOString(),
                    createdAt: document.createdAt || new Date().toISOString()
                };

                const request = store.put(doc);
                request.onsuccess = () => resolve(doc);
                request.onerror = () => reject(request.error);
            });
        });
    }

    async getDocument(id) {
        return this.enqueue(async () => {
            await this.ready();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['documents'], 'readonly');
                const store = transaction.objectStore('documents');
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        });
    }

    async getAllDocuments() {
        return this.enqueue(async () => {
            await this.ready();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['documents'], 'readonly');
                const store = transaction.objectStore('documents');
                const request = store.openCursor();
                const docs = [];

                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const { content, ...metadata } = cursor.value;
                        docs.push(metadata);
                        cursor.continue();
                    } else {
                        docs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                        resolve(docs);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        });
    }

    async deleteDocument(id) {
        return this.enqueue(async () => {
            await this.ready();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['documents', 'snapshots'], 'readwrite');

                // Delete document
                transaction.objectStore('documents').delete(id);

                // Delete associated snapshots
                const snapshotStore = transaction.objectStore('snapshots');
                const index = snapshotStore.index('documentId');
                const request = index.openCursor(IDBKeyRange.only(id));

                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    }
                };

                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            });
        });
    }

    // ==================== SNAPSHOT OPERATIONS ====================

    async saveSnapshot(documentId, content, encrypted = false) {
        // We don't necessarily need to queue this strictly if performance is key, 
        // but for safety, let's queue it.
        return this.enqueue(async () => {
            await this.ready();

            // Check limit first (within same transaction ideally, but for now separated is okay as queue serializes it)
            const snapshots = await this._getSnapshotsInternal(documentId);
            if (snapshots.length >= 50) {
                const oldest = snapshots.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
                if (oldest) await this._deleteSnapshotInternal(oldest.id);
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['snapshots'], 'readwrite');
                const store = transaction.objectStore('snapshots');

                const snapshot = {
                    id: this.generateId(),
                    documentId,
                    content,
                    encrypted,
                    createdAt: new Date().toISOString(),
                    size: content.length
                };

                const request = store.put(snapshot);
                request.onsuccess = () => resolve(snapshot);
                request.onerror = () => reject(request.error);
            });
        });
    }

    // Internal helper to avoid double-queuing when called from saveSnapshot
    async _getSnapshotsInternal(documentId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['snapshots'], 'readonly');
            const store = transaction.objectStore('snapshots');
            const index = store.index('documentId');
            const request = index.getAll(IDBKeyRange.only(documentId));
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async _deleteSnapshotInternal(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['snapshots'], 'readwrite');
            const store = transaction.objectStore('snapshots');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getSnapshots(documentId) {
        return this.enqueue(async () => this._getSnapshotsInternal(documentId).then(res => {
            return res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }));
    }

    async getSnapshot(id) {
        return this.enqueue(async () => {
            await this.ready();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['snapshots'], 'readonly');
                const store = transaction.objectStore('snapshots');
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        });
    }

    async restoreSnapshot(documentId, snapshotId) {
        // Logic handled in app controller, this just fetches
        return this.getSnapshot(snapshotId);
    }

    // ==================== SETTINGS OPERATIONS ====================

    async saveSetting(key, value) {
        return this.enqueue(async () => {
            await this.ready();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['settings'], 'readwrite');
                const store = transaction.objectStore('settings');
                store.put({ key, value });
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            });
        });
    }

    async getSetting(key, defaultValue = null) {
        return this.enqueue(async () => {
            await this.ready();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['settings'], 'readonly');
                const store = transaction.objectStore('settings');
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result ? request.result.value : defaultValue);
                request.onerror = () => reject(request.error);
            });
        });
    }

    async getAllSettings() {
        return this.enqueue(async () => {
            await this.ready();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['settings'], 'readonly');
                const store = transaction.objectStore('settings');
                const request = store.getAll();
                request.onsuccess = () => {
                    const settings = {};
                    (request.result || []).forEach(item => settings[item.key] = item.value);
                    resolve(settings);
                };
                request.onerror = () => reject(request.error);
            });
        });
    }

    /**
     * Prune old snapshots, keeping only the most recent ones
     * @param {string} documentId - Document ID
     * @param {number} maxSnapshots - Maximum snapshots to keep
     */
    async pruneSnapshots(documentId, maxSnapshots) {
        return this.enqueue(async () => {
            await this.ready();

            const snapshots = await this._getSnapshotsInternal(documentId);

            if (snapshots.length <= maxSnapshots) {
                return; // Nothing to prune
            }

            // Sort by creation date (oldest first)
            const sorted = snapshots.sort((a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
            );

            // Delete oldest snapshots
            const toDelete = sorted.slice(0, snapshots.length - maxSnapshots);

            for (const snapshot of toDelete) {
                await this._deleteSnapshotInternal(snapshot.id);
            }

            console.log(`Pruned ${toDelete.length} old snapshots for document ${documentId}`);
        });
    }

    // ==================== UTILITY OPERATIONS ====================

    async exportAllData() {
        // No strict queue needed for read-only gather, but consistency helps
        const docs = await this.getAllDocuments();
        const settings = await this.getAllSettings();
        const snapshots = [];

        for (const doc of docs) {
            const snaps = await this.getSnapshots(doc.id);
            snapshots.push(...snaps);
        }

        return {
            version: 1,
            exportDate: new Date().toISOString(),
            documents: docs,
            snapshots: snapshots,
            settings: settings
        };
    }

    async clearAllData() {
        return this.enqueue(async () => {
            await this.ready();
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['documents', 'snapshots', 'settings'], 'readwrite');
                transaction.objectStore('documents').clear();
                transaction.objectStore('snapshots').clear();
                transaction.objectStore('settings').clear();
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            });
        });
    }
}

