const CACHE_NAME = 'emoji-dagplanner-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './images/logo.svg',
  './images/reset-icon.svg',
  './images/cloud-big.svg',
  './images/cloud-medium.svg',
  './images/cloud-small.svg',
  './images/huiswerk_1.svg',
  './images/huiswerk_2.svg',
  './images/left-arrow.svg',
  './images/right-arrow.svg',
  './images/icons/icon-192x192.png',
  './images/icons/icon-512x512.png',
  // Include other assets as needed
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Cache geopend: ' + CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Verwijderen van oude cache: ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
