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
        this.useLocalStorageFallback = false;
        this.fallbackKeys = {
            documents: 'md-editor-documents',
            snapshots: 'md-editor-snapshots',
            settings: 'md-editor-settings'
        };

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
                console.error('IndexedDB not supported, using localStorage fallback');
                this.useLocalStorageFallback = true;
                this.isReady = true;
                return resolve();
            }

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                this.useLocalStorageFallback = true;
                this.isReady = true;
                resolve();
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
        this.requestQueue = this.requestQueue
            .catch(() => { })
            .then(() => operation().catch(err => {
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

    hasLocalStorage() {
        return typeof localStorage !== 'undefined';
    }

    getFallbackStore(key, defaultValue) {
        if (!this.hasLocalStorage()) return defaultValue;
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return defaultValue;
            const parsed = JSON.parse(raw);
            return parsed ?? defaultValue;
        } catch {
            return defaultValue;
        }
    }

    setFallbackStore(key, value) {
        if (!this.hasLocalStorage()) return;
        localStorage.setItem(key, JSON.stringify(value));
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

            if (this.useLocalStorageFallback || !this.db) {
                const docs = this.getFallbackStore(this.fallbackKeys.documents, []);
                const doc = {
                    ...document,
                    id: document.id || this.generateId(),
                    updatedAt: new Date().toISOString(),
                    createdAt: document.createdAt || new Date().toISOString()
                };
                const existingIndex = docs.findIndex(d => d.id === doc.id);
                if (existingIndex >= 0) {
                    docs[existingIndex] = doc;
                } else {
                    docs.push(doc);
                }
                this.setFallbackStore(this.fallbackKeys.documents, docs);
                return doc;
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

            if (this.useLocalStorageFallback || !this.db) {
                const docs = this.getFallbackStore(this.fallbackKeys.documents, []);
                return docs.find(doc => doc.id === id) || null;
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['documents'], 'readonly');
                const store = transaction.objectStore('documents');
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        });
    }

    async getAllDocuments(includeContent = false) {
        return this.enqueue(async () => {
            await this.ready();

            if (this.useLocalStorageFallback || !this.db) {
                const docs = this.getFallbackStore(this.fallbackKeys.documents, []);
                const mapped = docs.map(doc => {
                    if (includeContent) return doc;
                    const { content, ...metadata } = doc;
                    return metadata;
                });
                return mapped.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            }

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['documents'], 'readonly');
                const store = transaction.objectStore('documents');
                const request = store.openCursor();
                const docs = [];

                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        if (includeContent) {
                            docs.push(cursor.value);
                        } else {
                            const { content, ...metadata } = cursor.value;
                            docs.push(metadata);
                        }
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

            if (this.useLocalStorageFallback || !this.db) {
                const docs = this.getFallbackStore(this.fallbackKeys.documents, []);
                const snapshots = this.getFallbackStore(this.fallbackKeys.snapshots, []);
                this.setFallbackStore(this.fallbackKeys.documents, docs.filter(doc => doc.id !== id));
                this.setFallbackStore(this.fallbackKeys.snapshots, snapshots.filter(snapshot => snapshot.documentId !== id));
                return;
            }

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

            if (this.useLocalStorageFallback || !this.db) {
                const snapshots = this.getFallbackStore(this.fallbackKeys.snapshots, []);
                const perDoc = snapshots
                    .filter(snapshot => snapshot.documentId === documentId)
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                if (perDoc.length >= 50) {
                    const oldest = perDoc[0];
                    const pruned = snapshots.filter(snapshot => snapshot.id !== oldest.id);
                    this.setFallbackStore(this.fallbackKeys.snapshots, pruned);
                }

                const latestSnapshots = this.getFallbackStore(this.fallbackKeys.snapshots, []);
                const snapshot = {
                    id: this.generateId(),
                    documentId,
                    content,
                    encrypted,
                    createdAt: new Date().toISOString(),
                    size: content.length
                };
                latestSnapshots.push(snapshot);
                this.setFallbackStore(this.fallbackKeys.snapshots, latestSnapshots);
                return snapshot;
            }

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
        if (this.useLocalStorageFallback || !this.db) {
            const snapshots = this.getFallbackStore(this.fallbackKeys.snapshots, []);
            return snapshots.filter(snapshot => snapshot.documentId === documentId);
        }

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
        if (this.useLocalStorageFallback || !this.db) {
            const snapshots = this.getFallbackStore(this.fallbackKeys.snapshots, []);
            this.setFallbackStore(this.fallbackKeys.snapshots, snapshots.filter(snapshot => snapshot.id !== id));
            return;
        }

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

            if (this.useLocalStorageFallback || !this.db) {
                const snapshots = this.getFallbackStore(this.fallbackKeys.snapshots, []);
                return snapshots.find(snapshot => snapshot.id === id) || null;
            }

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

            if (this.useLocalStorageFallback || !this.db) {
                const settings = this.getFallbackStore(this.fallbackKeys.settings, {});
                settings[key] = value;
                this.setFallbackStore(this.fallbackKeys.settings, settings);
                return;
            }

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

            if (this.useLocalStorageFallback || !this.db) {
                const settings = this.getFallbackStore(this.fallbackKeys.settings, {});
                return Object.prototype.hasOwnProperty.call(settings, key) ? settings[key] : defaultValue;
            }

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

            if (this.useLocalStorageFallback || !this.db) {
                return this.getFallbackStore(this.fallbackKeys.settings, {});
            }

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
        const docs = await this.getAllDocuments(true);
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

            if (this.useLocalStorageFallback || !this.db) {
                if (this.hasLocalStorage()) {
                    localStorage.removeItem(this.fallbackKeys.documents);
                    localStorage.removeItem(this.fallbackKeys.snapshots);
                    localStorage.removeItem(this.fallbackKeys.settings);
                }
                return;
            }

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

