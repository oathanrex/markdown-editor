/**
 * Service Worker for Markdown Editor
 * Enables offline functionality and caching
 * Hardened: Comprehensive precaching of all modular assets and pinned CDNs.
 */

const CACHE_NAME = 'md-editor-v2.0.0';
const OFFLINE_URL = './404.html';

// Explicit dep versioning to ensure singelton instances
const CM_DEPS = '?deps=@codemirror/state@6.4.0,@codemirror/view@6.23.0';

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './404.html',
    './manifest.json',
    './robots.txt',
    './css/main.css',
    './css/editor.css',
    './css/preview.css',
    './css/themes.css',
    './js/app.js',
    './js/core/editor.js',
    './js/core/preview.js',
    './js/core/state.js',
    './js/editor/shortcuts.js',
    './js/editor/toolbar-actions.js',
    './js/editor/search-replace.js',
    './js/storage/storage-manager.js',
    './js/ui/modals.js',
    './js/ui/sidebar.js',
    './js/ui/toast.js',
    './js/export/export-manager.js',
    // Pinned CDN Dependencies
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js',
    'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js',
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js',
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css',
    'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
    'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    'https://cdn.jsdelivr.net/npm/docx@8.2.4/build/index.umd.js',
    'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js',
    'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js',
    // CodeMirror Pinned Modules with Shared Deps
    'https://esm.sh/@codemirror/state@6.4.0',
    'https://esm.sh/@codemirror/view@6.23.0?deps=@codemirror/state@6.4.0',
    'https://esm.sh/@codemirror/lang-markdown@6.2.3' + CM_DEPS,
    'https://esm.sh/@codemirror/theme-one-dark@6.1.2' + CM_DEPS,
    'https://esm.sh/@codemirror/commands@6.6.0' + CM_DEPS,
    'https://esm.sh/@codemirror/search@6.5.6' + CM_DEPS,
    'https://esm.sh/@codemirror/autocomplete@6.16.3' + CM_DEPS
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(event.request)
                    .then((response) => {
                        // Cache successful responses from CDN or local
                        if (!response || response.status !== 200 || response.type !== 'basic' && !response.ok) {
                            return response;
                        }

                        // Strict check for CDN caching to avoid caching weird redirects
                        const url = new URL(event.request.url);
                        const isCDN = url.hostname === 'esm.sh' || url.hostname === 'cdn.jsdelivr.net';
                        const isLocal = url.origin === self.location.origin;

                        if (isLocal || isCDN) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        }
                        return response;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});
