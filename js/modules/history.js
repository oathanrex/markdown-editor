/**
 * History Module
 * Manages document version history and snapshots
 */

/**
 * History Manager
 */
export class History {
    constructor(storage, encryption) {
        this.storage = storage;
        this.encryption = encryption;
        this.snapshotInterval = 300000; // 5 minutes default
        this.maxSnapshots = 50;
        this.timers = new Map();
    }

    /**
     * Set snapshot interval
     * @param {number} interval - Interval in milliseconds
     */
    setSnapshotInterval(interval) {
        this.snapshotInterval = interval;
    }

    /**
     * Start automatic snapshots for a document
     * @param {string} documentId - Document ID
     * @param {Function} getContent - Function to get current content
     */
    startAutoSnapshot(documentId, getContent, options = {}) {
        const { encrypt = false } = options;
        this.stopAllAutoSnapshots();

        const timer = setInterval(async () => {
            try {
                const content = getContent();
                if (content && content.trim()) {
                    await this.createSnapshot(documentId, content, encrypt);
                }
            } catch (error) {
                console.error('Auto-snapshot failed:', error);
            }
        }, this.snapshotInterval);

        this.timers.set(documentId, timer);
    }

    /**
     * Stop automatic snapshots for a document
     * @param {string} documentId - Document ID
     */
    stopAutoSnapshot(documentId) {
        const timer = this.timers.get(documentId);
        if (timer) {
            clearInterval(timer);
            this.timers.delete(documentId);
        }
    }

    /**
     * Stop all automatic snapshots
     */
    stopAllAutoSnapshots() {
        this.timers.forEach((timer, documentId) => {
            clearInterval(timer);
        });
        this.timers.clear();
    }

    /**
     * Create a snapshot of document content
     * @param {string} documentId - Document ID
     * @param {string} content - Document content
     * @param {boolean} encrypt - Whether to encrypt the snapshot
     * @returns {Promise<Object>}
     */
    async createSnapshot(documentId, content, encrypt = false) {
        let saveContent = content;
        let isEncrypted = false;

        // Encrypt if requested and encryption is available
        if (encrypt && this.encryption && this.encryption.isUnlocked) {
            try {
                saveContent = await this.encryption.encrypt(content);
                isEncrypted = true;
            } catch (error) {
                console.error('Encryption failed, saving unencrypted:', error);
            }
        }

        const snapshot = await this.storage.saveSnapshot(documentId, saveContent, isEncrypted);

        // Prune old snapshots
        await this.storage.pruneSnapshots(documentId, this.maxSnapshots);

        return snapshot;
    }

    /**
     * Get all snapshots for a document
     * @param {string} documentId - Document ID
     * @returns {Promise<Array>}
     */
    async getSnapshots(documentId) {
        return this.storage.getSnapshots(documentId);
    }

    /**
     * Get snapshot content (decrypted if necessary)
     * @param {string} snapshotId - Snapshot ID
     * @param {string} passphrase - Passphrase for decryption (optional)
     * @returns {Promise<string>}
     */
    async getSnapshotContent(snapshotId, passphrase = null) {
        const snapshot = await this.storage.getSnapshot(snapshotId);

        if (!snapshot) {
            throw new Error('Snapshot not found');
        }

        if (snapshot.encrypted) {
            if (!this.encryption) {
                throw new Error('Encryption module not available');
            }
            return this.encryption.decrypt(snapshot.content, passphrase);
        }

        return snapshot.content;
    }

    /**
     * Restore a snapshot to the document
     * @param {string} documentId - Document ID
     * @param {string} snapshotId - Snapshot ID to restore
     * @param {string} passphrase - Passphrase for decryption (optional)
     * @returns {Promise<string>} - Restored content
     */
    async restoreSnapshot(documentId, snapshotId, passphrase = null) {
        const content = await this.getSnapshotContent(snapshotId, passphrase);

        // Update the document with restored content
        const document = await this.storage.getDocument(documentId);
        if (document) {
            if (document.encrypted) {
                if (!this.encryption) {
                    throw new Error('Encryption module not available');
                }
                if (passphrase && !this.encryption.isUnlocked) {
                    await this.encryption.setPassphrase(passphrase);
                }
                if (!this.encryption.isUnlocked) {
                    throw new Error('Encryption key is locked');
                }
                document.content = await this.encryption.encrypt(content);
                document.encrypted = true;
            } else {
                document.content = content;
                document.encrypted = false;
            }
            await this.storage.saveDocument(document);
        }

        return content;
    }

    /**
     * Format snapshot date for display
     * @param {string} isoDate - ISO date string
     * @returns {Object} - Formatted date and time
     */
    formatSnapshotDate(isoDate) {
        const date = new Date(isoDate);
        const now = new Date();

        // Create yesterday date properly
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        let dateStr;
        if (date.toDateString() === now.toDateString()) {
            dateStr = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            dateStr = 'Yesterday';
        } else {
            dateStr = date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }

        const timeStr = date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        });

        return { date: dateStr, time: timeStr };
    }

    /**
     * Format file size for display
     * @param {number} bytes - Size in bytes
     * @returns {string}
     */
    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}

