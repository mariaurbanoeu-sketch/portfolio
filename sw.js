/* Paula Urbano · funciona sin conexión una vez visitada
   Siempre se pide primero lo último a la red; la copia guardada solo se usa sin conexión.
   Al publicar, el nombre de la caché cambia solo (ver .github/workflows/pages.yml). */
var C = 'pu-dev';
var CORE = ['/', '/css/site.css', '/js/site.js', '/fonts/montserrat.woff2', '/fonts/pixelify.woff2', '/favicon.png', '/favicon-sad.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(CORE.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || r.headers.has('range') || /\.(mp4|pdf)$/.test(u.pathname)) return;
  /* las fuentes no cambian nunca: de la copia, al instante */
  if (/\.woff2$/.test(u.pathname)) {
    e.respondWith(caches.open(C).then(function (c) { return c.match(r).then(function (hit) { return hit || fetch(r).then(function (res) { if (res.ok) c.put(r, res.clone()); return res; }); }); }));
    return;
  }
  /* páginas: primero la red, comprobando que sea lo último; sin conexión, la portada guardada */
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (res) {
      if (res.ok && (u.pathname === '/' || u.pathname === '/index.html')) { var cp = res.clone(); caches.open(C).then(function (c) { c.put('/', cp); }); }
      return res;
    }).catch(function () { return caches.match('/'); }));
    return;
  }
  /* lo demás (estilos, código, imágenes, demos): también primero la red; la copia, solo sin conexión */
  e.respondWith(fetch(r, { cache: 'no-cache' }).then(function (res) {
    if (res.ok) { var cp = res.clone(); caches.open(C).then(function (c) { c.put(r, cp); }); }
    return res;
  }).catch(function () { return caches.match(r).then(function (hit) { return hit || Response.error(); }); }));
});
