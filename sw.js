/* Quest Log — service worker (precache shell). Bump CACHE when precache list changes. */
const CACHE = 'questlog-shell-v36';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/css/theme.css',
  '/css/motion.css',
  '/js/main.js',
  '/js/king.js',
  '/js/modal.js',
  '/js/state.js',
  '/js/storage.js',
  '/js/strings.js',
  '/js/torch.js',
  '/js/dom/render-list.js',
  '/js/dom/render-empty.js',
  '/js/dom/render-chrome.js',
  '/js/dom/render-toast.js',
  '/js/pwa/register-sw.js',
  '/assets/sprites/logo.png',
  '/assets/sprites/stone-tile.png',
  '/assets/sprites/torch-spritesheet.png',
  '/assets/sprites/king.png',
  '/assets/sprites/alternative-king.png',
  '/assets/sprites/jester.png',
  '/assets/sprites/hacker.png',
  '/assets/ui/wood-tile.png',
  '/assets/ui/nail.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
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
    ).then(() => clients.claim())
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
