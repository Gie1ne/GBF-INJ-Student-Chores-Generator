const CACHE_NAME = 'chores-gen-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(() => {
          // If addAll fails, we'll just cache what we can
          console.log('Some resources could not be cached');
        });
      })
      .catch(error => {
        console.log('Cache open failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            return response || new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Push Notification Handler
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%232563EB" width="192" height="192"/><text x="96" y="110" font-size="80" fill="white" text-anchor="middle" font-weight="bold">SCG</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle fill="%232563EB" cx="96" cy="96" r="96"/></svg>',
    tag: 'chores-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Chores Generator', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Background Sync for data submission
self.addEventListener('sync', event => {
  if (event.tag === 'sync-chores-data') {
    event.waitUntil(
      // Sync data when connection is restored
      Promise.resolve()
    );
  }
});
