// ============================================
// EMPRESA SAN LUIS - Service Worker
// Static asset caching + offline support
// ============================================

const CACHE_NAME = 'san-luis-v1';

// En desarrollo (Vite) desactivamos el caché del Service Worker para que los cambios se vean inmediato.
const IS_DEV = (self.location && self.location.hostname) && (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1');
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', function (event) {
    // En desarrollo no cacheamos para ver cambios inmediatos.
    if (IS_DEV) {
        return self.skipWaiting();
    }

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Cache abierto');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function (cacheName) {
                            return cacheName !== CACHE_NAME;
                        })
                        .map(function (cacheName) {
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function (event) {
    // En desarrollo: dejamos que todo vaya directo a la red.
    if (IS_DEV) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension and other non-http requests
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then(function (cachedResponse) {
                if (cachedResponse) {
                    // Return cached version and update cache in background
                    event.waitUntil(
                        fetch(event.request)
                            .then(function (networkResponse) {
                                if (networkResponse && networkResponse.status === 200) {
                                    caches.open(CACHE_NAME)
                                        .then(function (cache) {
                                            cache.put(event.request, networkResponse);
                                        });
                                }
                            })
                            .catch(function () {
                                // Network failed, that's okay - we have cache
                            })
                    );
                    return cachedResponse;
                }

                // Not in cache - fetch from network
                return fetch(event.request)
                    .then(function (networkResponse) {
                        // Cache successful responses for future use
                        if (networkResponse && networkResponse.status === 200) {
                            var responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(function () {
                        // Both cache and network failed
                        // Return offline fallback for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});
