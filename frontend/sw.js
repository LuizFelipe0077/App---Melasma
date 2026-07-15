const CACHE_NAME = 'clinical-tracking-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/presentation/index.css',
  './src/presentation/app.js',
  './src/presentation/pages/LoginPage.js',
  './src/presentation/pages/DashboardAdminPage.js',
  './src/presentation/pages/DashboardPacientePage.js',
  './src/presentation/components/CardSuplemento.js',
  './src/infrastructure/api/ApiClient.js',
  './src/shared/config/SystemConfiguration.js'
];

// Install Event - Pre-cache static shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve static shell offline (Cache-first for static, Network-only/fallback for API)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Check if it's a request to Google Apps Script (API base endpoint)
  if (url.hostname.includes('script.google.com') || e.request.method === 'POST') {
    // API calls should never be cached - Network Only
    e.respondWith(
      fetch(e.request).catch(() => {
        return new Response(JSON.stringify({
          statusCode: 503,
          data: { message: 'Você está offline. Verifique sua conexão para salvar alterações.' }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Cache-first strategy for static assets
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback for html
      if (e.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
