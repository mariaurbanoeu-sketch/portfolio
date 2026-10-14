/* Paula Urbano · funciona sin conexión una vez visitada */
var C = 'pu-v4';
var CORE = ['/', '/index.html', '/css/site.css', '/js/site.js', '/fonts/montserrat.woff2', '/fonts/pinyon.woff2', '/fonts/bodoni.woff2', '/favicon.png', '/favicon-sad.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || r.headers.has('range') || /\.(mp4|pdf)$/.test(u.pathname)) return;
  /* páginas: primero la red (para ver siempre lo último), si no hay conexión, la copia guardada */
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (res) { var cp = res.clone(); caches.open(C).then(function (c) { c.put('/', cp); }); return res; }).catch(function () { return caches.match('/'); }));
    return;
  }
  /* lo demás: la copia guardada al instante y se actualiza por detrás */
  e.respondWith(caches.open(C).then(function (c) {
    return c.match(r).then(function (hit) {
      var net = fetch(r).then(function (res) { if (res.ok) c.put(r, res.clone()); return res; }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
