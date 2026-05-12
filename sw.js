/* Quest Log — service worker (precache shell). Bump CACHE when precache list changes. */
const CACHE = 'questlog-shell-v2';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/css/theme.css',
  '/css/motion.css',
  '/js/main.js',
  '/js/state.js',
  '/js/storage.js',
  '/js/strings.js',
  '/js/dom/render-list.js',
  '/js/dom/render-empty.js',
  '/js/dom/render-chrome.js',
  '/js/dom/render-toast.js',
  '/js/pwa/register-sw.js',
  '/assets/icons/icon.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE) return caches.delete(key);
          return undefined;
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request, { ignoreSearch: false }).then((cached) => {
      if (cached) return cached;
      return fetch(request).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return Response.error();
      });
    })
  );
});
