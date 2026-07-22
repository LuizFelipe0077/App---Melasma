/**
 * sw.js — minimal offline shell cache.
 * Navigation requests (the HTML shell) go network-first: Vite gives every
 * build's JS/CSS a new content hash, but index.html itself is never renamed,
 * so a cache-first index.html would keep pointing at a hash the server no
 * longer has after the next deploy, permanently freezing returning visitors
 * on the build that was live on their first visit. Hashed static assets stay
 * cache-first (safe — a changed file is always a new URL). The GAS API is
 * always network-only (never cache mutations/dashboard data).
 */
const CACHE_NAME = 'clinical-tracking-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => caches.open(CACHE_NAME).then((cache) => cache.match(request)))
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch (err) {
        return cached || Promise.reject(err);
      }
    })
  );
});
