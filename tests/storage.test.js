import test from 'node:test';
import assert from 'node:assert/strict';
import { Storage } from '../js/modules/storage.js';

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

function setupBrowserStubs(t) {
    const originalWindow = globalThis.window;
    const originalLocalStorage = globalThis.localStorage;

    globalThis.window = { indexedDB: null };
    globalThis.localStorage = createLocalStorageMock();

    t.after(() => {
        globalThis.window = originalWindow;
        globalThis.localStorage = originalLocalStorage;
    });
}

test('Storage saves and retrieves a document', async (t) => {
    setupBrowserStubs(t);

    const storage = new Storage();
    await storage.ready();

    const doc = { title: 'Test', content: 'Hello', id: 'test-id' };
    await storage.saveDocument(doc);
    const loaded = await storage.getDocument('test-id');

    assert.equal(loaded.title, 'Test');
    assert.equal(loaded.content, 'Hello');
});

test('Storage rejects invalid documents and the queue keeps working', async (t) => {
    setupBrowserStubs(t);

    const storage = new Storage();
    await storage.ready();

    await assert.rejects(() => storage.saveDocument(null), /Invalid document object/);

    // Queue must recover after a rejected operation
    const saved = await storage.saveDocument({ id: 'after-error', title: 'Still works', content: 'ok' });
    assert.equal(saved.id, 'after-error');
    const loaded = await storage.getDocument('after-error');
    assert.equal(loaded.title, 'Still works');
});