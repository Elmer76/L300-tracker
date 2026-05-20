const CACHE_NAME = 'triplog-v5'; 
const FILES_TO_CACHE = [ 
  './', 
  './index.html',
  './manifest.json',
  './gps-192.png', 
  './gps-512.png' 
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE).catch(err => {
        console.log('Cache addAll failed:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => { 
  evt.waitUntil(caches.keys().then((keyList) => { 
    return Promise.all(keyList.map((key) => { 
      if (key !== CACHE_NAME) return caches.delete(key); 
    }));
  })); 
  self.clients.claim(); 
});

self.addEventListener('fetch', (evt) => { 
  const url = new URL(evt.request.url);
  if (url.hostname.includes('script.google.com')) {
    evt.respondWith(fetch(evt.request));
    return;
  }
  evt.respondWith(caches.match(evt.request).then(r => r || fetch(evt.request))); 
});
