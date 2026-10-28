/* SIAMIS Computer Lesson Plan — service worker (2026-10-28).
   Network-first for pages/code so lesson data is never stale;
   cache-first for images/fonts so the site still opens on weak Wi-Fi. */
var CACHE = 'siamis-cache-v2';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  var isCode = e.request.mode === 'navigate' || /\.(?:html|js|css|json)$/.test(url.pathname);
  if (isCode) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return r;
      }).catch(function () { return caches.match(e.request); })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (r) {
          var copy = r.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          return r;
        });
      })
    );
  }
});
