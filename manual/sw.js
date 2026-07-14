const CACHE_NAME = 'manual-docs-cache-v2';
const ASSETS = [
  './index.html',
  './arquitetura.html',
  './psicologia.html',
  './gamificacao.html',
  './seguranca.html',
  './checklist.html',
  './admin.html',
  './api.html',
  './styles.css',
  './scripts.js',
  './manifest.json',
  './sw.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
