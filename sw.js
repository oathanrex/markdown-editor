/**
 * Service Worker
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'md-editor-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/themes.css',
    '/css/editor.css',
    '/css/preview.css',
    '/css/components.css',
    '/css/print.css',
    '/js/app.js',
    '/js/modules/parser.js',
    '/js/modules/storage.js',
    '/js/modules/encryption.js',
    '/js/modules/history.js',
    '/js/modules/diff.js',
    '/js/modules/editor.js',
    '/js/modules/preview.js',
    '/js/modules/search.js',
    '/js/modules/export.js',
    '/js/modules/tabs.js',
    '/js/modules/toc.js',
    '/js/modules/minimap.js',
    '/js/modules/shortcuts.js',
    '/js/modules/themes.js',
    '/js/modules/accessibility.js',
    '/js/modules/performance.js',
    '/manifest.json'
];

// External CDN resources to cache
const CDN_ASSETS = [
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching app assets');
            // Cache local assets
            const localPromise = cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn('Failed to cache some local assets:', err);
            });

            // Cache CDN assets (best effort)
            const cdnPromise = Promise.all(
                CDN_ASSETS.map(url =>
                    fetch(url)
                        .then(response => cache.put(url, response))
                        .catch(err => console.warn('Failed to cache CDN asset:', url))
                )
            );

            return Promise.all([localPromise, cdnPromise]);
        })
    );

    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );

    // Take control immediately
    self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached response and update cache in background
                event.waitUntil(
                    fetch(event.request)
                        .then((response) => {
                            if (response.ok) {
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, response);
                                });
                            }
                        })
                        .catch(() => { })
                );
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(event.request)
                .then((response) => {
                    // Cache successful responses
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Return offline fallback for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return new Response('Offline - resource not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });
        })
    );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});