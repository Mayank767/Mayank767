// ZeroApiTools Service Worker — Offline Support
const CACHE_NAME = 'zeroapitools-v1';

// Install: Cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
      ]);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch: Stale-while-revalidate strategy
// Serve from cache instantly, then update cache in background
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (fonts, analytics, etc.) except Google Fonts CSS
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    // Cache Google Fonts for offline
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
      event.respondWith(
        caches.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          }).catch(() => cached);

          return cached || fetchPromise;
        })
      );
    }
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      // Return cached version immediately
      const fetchPromise = fetch(request).then((response) => {
        // Only cache valid responses
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // If fetch fails (offline) and no cache, serve offline fallback for navigation
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return cached;
      });

      // Serve cached first, update in background
      return cached || fetchPromise;
    })
  );
});
