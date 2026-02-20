import test from 'node:test';
import assert from 'node:assert/strict';
import { Storage } from '../js/modules/storage.js';
import { History } from '../js/modules/history.js';
import { Encryption } from '../js/modules/encryption.js';
import { Tabs } from '../js/modules/tabs.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createLocalStorageMock() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };
}

test('Storage queue recovers after a rejected operation', async (t) => {
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;

  globalThis.window = { indexedDB: null };
  globalThis.localStorage = createLocalStorageMock();

  t.after(() => {
    globalThis.window = originalWindow;
    globalThis.localStorage = originalLocalStorage;
  });

  const storage = new Storage();
  await storage.ready();

  await assert.rejects(() => storage.saveDocument(null), /Invalid document object/);

  const saved = await storage.saveDocument({ id: 'doc-1', title: 'Recovered', content: 'ok' });
  const loaded = await storage.getDocument('doc-1');

  assert.equal(saved.id, 'doc-1');
  assert.equal(loaded?.title, 'Recovered');
  assert.equal(loaded?.content, 'ok');
});

test('History auto-snapshot switches timers on tab/document switch', async () => {
  const captured = [];
  const storage = {
    async saveSnapshot(documentId, content, encrypted) {
      captured.push({ documentId, content, encrypted, at: Date.now() });
      return { id: `${documentId}-${captured.length}`, documentId, content, encrypted, createdAt: new Date().toISOString(), size: content.length };
    },
    async pruneSnapshots() { }
  };

  const history = new History(storage, null);
  history.setSnapshotInterval(30);

  history.startAutoSnapshot('doc-1', () => 'from-doc-1');
  await sleep(40);
  const doc1CountBeforeSwitch = captured.filter(x => x.documentId === 'doc-1').length;

  history.startAutoSnapshot('doc-2', () => 'from-doc-2');
  assert.equal(history.timers.size, 1);
  assert.ok(history.timers.has('doc-2'));
  await sleep(70);

  history.stopAllAutoSnapshots();

  const doc1CountAfterSwitch = captured.filter(x => x.documentId === 'doc-1').length;
  const doc2Count = captured.filter(x => x.documentId === 'doc-2').length;

  assert.equal(doc1CountAfterSwitch, doc1CountBeforeSwitch);
  assert.ok(doc2Count >= 1);
});

test('History snapshots and restore preserve encryption for encrypted documents', async () => {
  const encryption = new Encryption();
  await encryption.setPassphrase('very-secure-passphrase');

  const savedSnapshots = [];
  let persistedDocument = null;

  const storage = {
    async saveSnapshot(documentId, content, encrypted) {
      savedSnapshots.push({ documentId, content, encrypted });
      return { id: 'snap-1', documentId, content, encrypted, createdAt: new Date().toISOString(), size: content.length };
    },
    async pruneSnapshots() { },
    async getSnapshot() {
      return { id: 'snap-restore', documentId: 'doc-enc', content: 'restored plain text', encrypted: false };
    },
    async getDocument() {
      return {
        id: 'doc-enc',
        title: 'Encrypted',
        content: 'old-cipher',
        encrypted: true,
        createdAt: new Date().toISOString()
      };
    },
    async saveDocument(doc) {
      persistedDocument = doc;
      return doc;
    }
  };

  const history = new History(storage, encryption);

  await history.createSnapshot('doc-enc', 'super secret', true);

  assert.equal(savedSnapshots.length, 1);
  assert.equal(savedSnapshots[0].encrypted, true);
  assert.notEqual(savedSnapshots[0].content, 'super secret');
  assert.equal(await encryption.decrypt(savedSnapshots[0].content), 'super secret');

  const restored = await history.restoreSnapshot('doc-enc', 'snap-restore');
  assert.equal(restored, 'restored plain text');
  assert.equal(persistedDocument?.encrypted, true);
  assert.notEqual(persistedDocument?.content, 'restored plain text');
  assert.equal(await encryption.decrypt(persistedDocument.content), 'restored plain text');
});

test('Closing a tab deletes the underlying persisted document', async (t) => {
  const deleted = [];
  const removableTabEl = {
    removed: false,
    remove() {
      this.removed = true;
    }
  };

  const container = {
    addEventListener() { },
    querySelector(selector) {
      if (selector.includes('doc-a')) {
        return removableTabEl;
      }
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };

  const originalDocument = globalThis.document;
  globalThis.document = {
    getElementById() {
      return null;
    }
  };
  t.after(() => {
    globalThis.document = originalDocument;
  });

  const tabs = new Tabs({
    container,
    storage: {
      async deleteDocument(id) {
        deleted.push(id);
      }
    }
  });

  tabs.tabs = [
    { id: 'doc-a', title: 'A', content: 'a', unsaved: false, createdAt: new Date().toISOString() },
    { id: 'doc-b', title: 'B', content: 'b', unsaved: false, createdAt: new Date().toISOString() }
  ];
  tabs.activeTabId = 'doc-a';

  await tabs.closeTab('doc-a');

  assert.deepEqual(deleted, ['doc-a']);
  assert.equal(tabs.tabs.some(tab => tab.id === 'doc-a'), false);
  assert.equal(removableTabEl.removed, true);
});
