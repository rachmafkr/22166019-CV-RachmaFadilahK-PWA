// Nama cache, tambahkan versi baru setiap kali ada perubahan
const cacheName = 'teluk-randai-cache-v4';

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
  '/sw.js',
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(assetsToCache);
      })
      .catch(err => {
        console.error('[Service Worker] Caching failed:', err);
      })
  );
  self.skipWaiting(); // Aktifkan service worker baru langsung
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
  self.clients.claim(); // Pastikan service worker langsung mengontrol halaman
});

// Fetch event handler dengan strategi berbeda untuk HTML dan aset statis
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Untuk file HTML, ambil dari jaringan dengan fallback ke cache
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(cacheName).then(cache => {
            if (networkResponse.ok && (event.request.url.startsWith('http://') || event.request.url.startsWith('https://'))) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request)) // Fallback ke cache jika jaringan gagal
    );
  } else {
    // Untuk aset statis, gunakan cache-first
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          return caches.open(cacheName).then(cache => {
            if (networkResponse.ok && (event.request.url.startsWith('http://') || event.request.url.startsWith('https://'))) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
});