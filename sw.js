/**
 * Service worker — app shell cache for digital business card.
 * Bump CACHE_NAME when shell assets change.
 */
const CACHE_NAME = 'dbc-shell-v4';

const SHELL = [
  './',
  './index.html',
  './site.webmanifest',
  './styles/main.css',
  './styles/variables.css',
  './styles/base.css',
  './styles/components.css',
  './styles/utilities.css',
  './styles/rtl.css',
  './scripts/app.js',
  './data/card.json',
  './assets/site.webmanifest',
  './assets/favicon.svg',
  './assets/favicon.ico',
  './assets/favicon-16x16.png',
  './assets/favicon-32x32.png',
  './assets/apple-touch-icon.png',
  './assets/android-chrome-192x192.png',
  './assets/android-chrome-512x512.png',
  './assets/owner.webp',
  './assets/bacground.png',
  './assets/MYQR.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
