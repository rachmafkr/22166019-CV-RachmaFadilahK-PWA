const cacheName = 'teluk-randai-cache-v5';

// Daftar file statis yang akan di-cache
const assetsToCache = [
  '/index.html',
  '/archive.html',
  '/ayah.html',
  '/batavia.html',
  '/contact.html',
  '/kegiatan.html',
  '/page.html',
  '/post.html',
  '/manifest.json',
  '/notification.js',
  '/css/style.css',
  '/images/thumbs/1.jpg',
  '/images/thumbs/2.jpg',
  '/images/thumbs/3.jpg',
  '/images/thumbs/Header.png',
  '/images/certificate1.png',
  '/images/certificate2.jpg',
  '/images/certificate3.jpg',
  '/images/certificate4.jpg',
  '/images/certificate5.jpg',
  '/images/hamburger.svg',
  '/images/logo.png',
  '/images/pp2.jpg',
  '/js/firebase-messaging-sw.js',
  '/js/indexdb.js',
  '/js/main.js',
  '/js/notification.js',
];

// Install Service Worker dan caching aset
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return Promise.allSettled(assetsToCache.map(asset =>
          cache.add(asset).catch(err => {
            console.warn('[Service Worker] Failed to cache ${asset}:', err);
          })
        ));
      })
      .catch(err => {
        console.error('[Service Worker] Opening cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker dan hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event handler dengan pengecekan skema URL dan respons valid
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  if (event.request.mode === 'navigate') {
    // Fetch untuk halaman HTML dengan fallback ke cache
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(cacheName).then(cache => {
            // Simpan respons di cache jika sukses dan skema URL valid
            if (networkResponse.ok && (requestURL.protocol === 'http:' || requestURL.protocol === 'https:')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request) || caches.match('/index.html'))
    );
  } else {
    // Fetch untuk aset statis dengan cache-first
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          return caches.open(cacheName).then(cache => {
            // Simpan respons di cache jika sukses dan skema URL valid
            if (networkResponse.ok && (requestURL.protocol === 'http:' || requestURL.protocol === 'https:')) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        }).catch(err => {
          console.error('[Service Worker] Fetch failed:', err);
          // Tambahkan fallback respons jika fetch gagal
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
    );
  }
});
