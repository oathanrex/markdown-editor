import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

test('Service worker returns cached index for offline navigation', async () => {
  const handlers = new Map();
  let navigationRequest = null;

  const cachesMock = {
    async open() {
      return {
        async addAll() {},
        async put() {}
      };
    },
    async keys() {
      return [];
    },
    async match(request) {
      if (request === navigationRequest) return null;
      if (request === './index.html') {
        return new Response('cached offline page', { status: 200 });
      }
      return null;
    }
  };

  const selfMock = {
    location: { href: 'https://example.com/markdown-editor/sw.js' },
    clients: { claim() {} },
    skipWaiting() {},
    addEventListener(type, handler) {
      handlers.set(type, handler);
    }
  };

  const context = vm.createContext({
    self: selfMock,
    caches: cachesMock,
    fetch: async () => {
      throw new Error('offline');
    },
    Response,
    Promise,
    console
  });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const swPath = path.join(__dirname, '..', 'sw.js');
  const swCode = await fs.readFile(swPath, 'utf8');
  vm.runInContext(swCode, context);

  const fetchHandler = handlers.get('fetch');
  assert.ok(fetchHandler, 'fetch handler should be registered');

  let responsePromise = null;
  navigationRequest = {
    method: 'GET',
    url: 'https://example.com/markdown-editor/docs/page',
    mode: 'navigate'
  };

  const event = {
    request: navigationRequest,
    respondWith(promise) {
      responsePromise = promise;
    },
    waitUntil() {}
  };

  fetchHandler(event);
  const response = await responsePromise;

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'cached offline page');
});
