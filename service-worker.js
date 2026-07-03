const CACHE_NAME = 'venn-quest-v1.1.0';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/venn-quest-icon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    event.respondWith(
return fetch(request).then(response => {
  const url = new URL(request.url);

  const isAudio =
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.m4a') ||
    url.pathname.endsWith('.wav') ||
    url.pathname.endsWith('.ogg');

  // ไม่ cache ไฟล์เสียง และไม่ cache partial response 206
  if (
    response &&
    response.status === 200 &&
    request.method === 'GET' &&
    !isAudio
  ) {
    cache.put(request, response.clone());
  }

  return response;
});
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
