/* Yaman Şener — service worker
   Repeat visits load from cache instantly; the network still decides what's current.
   Bump CACHE_VERSION whenever index.html or styles.css change. */

const CACHE_VERSION = 'v2';
const SHELL_CACHE = `shell-${CACHE_VERSION}`;
const ASSET_CACHE = `assets-${CACHE_VERSION}`;
const CDN_CACHE = `cdn-${CACHE_VERSION}`;

const SHELL_FILES = [
    './',
    './index.html',
    './styles.css',
    './profile.webp',
    './favicon.svg',
];

/* Third-party origins worth caching: fonts and the icon set. */
const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE)
            .then((cache) => cache.addAll(SHELL_FILES))
            .then(() => self.skipWaiting())
            .catch(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    const keep = [SHELL_CACHE, ASSET_CACHE, CDN_CACHE];
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(names.filter((n) => !keep.includes(n)).map((n) => caches.delete(n))))
            .then(() => self.clients.claim())
    );
});

/* Network first: always try for fresh content, fall back to cache when offline. */
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) cache.put(request, fresh.clone());
        return fresh;
    } catch (err) {
        const cached = await cache.match(request) || await cache.match('./index.html');
        if (cached) return cached;
        throw err;
    }
}

/* Cache first with background refresh: instant paint, quietly updated for next time. */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const network = fetch(request)
        .then((response) => {
            if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
            return response;
        })
        .catch(() => cached);
    return cached || network;
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    const sameOrigin = url.origin === self.location.origin;

    if (request.mode === 'navigate' || (sameOrigin && url.pathname.endsWith('.html'))) {
        event.respondWith(networkFirst(request, SHELL_CACHE));
        return;
    }

    if (sameOrigin) {
        event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
        return;
    }

    if (CDN_HOSTS.includes(url.hostname)) {
        event.respondWith(staleWhileRevalidate(request, CDN_CACHE));
    }
});
