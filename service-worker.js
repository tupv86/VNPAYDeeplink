const CACHE_NAME = 'shop-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/styles.css',
  '/scripts/app.js',
  '/scripts/cart.js',
  '/scripts/bankDeeplink.js',
  '/data/products.json',
  '/data/bankData.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    // Cho phép request cross-origin chạy bình thường
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});
