/* Paula Urbano · portfolio · sin librerías */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- menú en celular ---------- */
  var menuBtn = $('.hd-menu'), nav = $('#nav');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () {
      menuBtn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); document.body.style.overflow = '';
    }); });
  }

  /* ---------- color de fondo según la sección ---------- */
  var bgIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) {
      document.body.dataset.bg = e.target.dataset.bg;
      if (e.target.dataset.icon) mini.icon = e.target.dataset.icon;
    } });
  }, { rootMargin: '-48% 0px -48% 0px' });
  $$('[data-bg]').forEach(function (el) { bgIO.observe(el); });

  /* ---------- entradas al hacer scroll ---------- */
  var revIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  $$('[data-reveal]').forEach(function (el) { revIO.observe(el); });

  /* ---------- videos: se cargan cerca y solo suenan (mudos) a la vista ---------- */
  var vids = $$('video[data-src]');
  function load(v) { if (!v.src) { v.src = v.dataset.src; v.load(); } }
  var vIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { load(v); if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
      else if (!v.paused) v.pause();
    });
  }, { rootMargin: '200px 0px' });
  vids.forEach(function (v) {
    vIO.observe(v);
    if (reduce) v.addEventListener('click', function () { load(v); v.paused ? v.play() : v.pause(); });
  });

  /* ---------- "lo que más me gusta" crece hasta el video ---------- */
  var zoom = $('.zoom'), zStick = zoom && $('.zoom-stick', zoom);
  /* ---------- Figma en carrete horizontal (escritorio) ---------- */
  var fig = $('.fig'), figPin = fig && $('.fig-pin', fig), figTrack = fig && $('.fig-track', fig);
  var figDist = 0;
  function setupFig() {
    if (!fig) return;
    var wide = innerWidth >= 900 && !reduce;
    fig.classList.toggle('pinned', wide);
    if (!wide) { figTrack.style.removeProperty('--fx'); return; }
    figDist = Math.max(0, figTrack.scrollWidth - figPin.clientWidth);
    fig.style.setProperty('--pin-h', (figDist + innerHeight * .9) + 'px');
  }
  function onScroll() {
    if (zStick && !reduce) {
      var r = zoom.getBoundingClientRect(), span = zoom.offsetHeight - zStick.offsetHeight;
      var p = Math.min(1, Math.max(0, -r.top / span));
      zStick.style.setProperty('--p', p.toFixed(4));
    }
    if (fig && fig.classList.contains('pinned')) {
      var fr = figPin.getBoundingClientRect(), total = figPin.offsetHeight - innerHeight * .9;
      var q = Math.min(1, Math.max(0, -fr.top / Math.max(1, total)));
      figTrack.style.setProperty('--fx', (q * figDist).toFixed(1));
    }
    mini.el.classList.toggle('show', scrollY > innerHeight * .8);
  }
  var ticking = false;
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  addEventListener('resize', function () { setupFig(); onScroll(); });
  addEventListener('load', function () { setupFig(); onScroll(); });

  /* ======================= Paulagotchi ======================= */
  var PAL = { H:'#34221c', h:'#80583a', c:'#b08054', y:'#deb67c', s:'#d69670', S:'#b87a5a', e:'#1e1212', b:'#e68082',
    l:'#aa3a54', w:'#fffaf5', n:'#e8bc50', t:'#28201e', f:'#d67482', g:'#d4aa54', L:'#705c62', D:'#54444a', K:'#3a2e32', p:'#eba9bd' };
  var BASE = ["................................","............HHHHHHHH............","..........HHHHHHHHHHHH..........",".........HHHHHHHsHHHHHH.........","........HHHHHssssssHHHHH........","........hHHssssssssssHHh........","........hhsssssssssssshh........","........hhseesssssseeshh........","........hcsbssssssssbsch........",".......cchsssssSSsnssshcc.......",".......cccsslwwwwwwlssccc.......",".......ycccssllllllsscccy.......",".......yycsssssssssssscyy.......",".......yycccsssssssscccyy.......","......yyyy...ssssss...yyyy......","......yyyssssssnnssssssyyy......",".....yyysssssssnnsssssssyyy.....",".....yyssttttttttttttttssyy.....","......sstftgttfttfttgtftss......","......sttgtftgttttgtftgtts......",".....sstttttftgttgtftttttss.....",".....sDDDDDDDDDDDDDDDDDDDDs.....",".....sLLLLLLLLLLLLLLLLLLLLs.....","......LLLLLLLLLLLLLLLLLLLL......","......LLLLLLLLLppLLLLLLLLL......","......LLLLLLLLppppLLLLLLLL......","......LLLLLLLLLppLLLLLLLLL......","......LLLLLLLLLLLLLLLLLLLL......","....KKKKKKKKKKKKKKKKKKKKKKKK....","................................","................................","................................"];
  var ICONS = {
    nail: ["..pp..",".pppp.",".pppp.",".pppp.","..LL..","..LL..",".LLLL."],
    cam:  ["......","LLLLLL","LwwLLL","LLppLL","LLppLL","LLLLLL","......"],
    bag:  ["..LL..",".L..L.","pppppp","pppppp","pppppp","pppppp","......"],
    heart:["......",".pp.pp","pppppp","pppppp",".pppp.","..pp..","......"],
    pen:  [".....L","....LL","...pp.","..pp..",".pp...","LL....","......"],
    star: ["..p...","..p...","ppppp.","..p...",".p.p..","p...p.","......"]
  };
  function drawSprite(ctx, ox, oy, scale, mood) {
    for (var y = 0; y < 32; y++) for (var x = 0; x < 32; x++) {
      var c = BASE[y][x];
      if (mood === 'blink' && y === 7 && c === 'e') c = 'S';
      if (mood === 'happy' && y === 7 && c === 'e') c = (x === 10 || x === 21) ? 's' : 'e';
      if (c === '.' || !PAL[c]) continue;
      ctx.fillStyle = PAL[c]; ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
    }
  }
  function drawIcon(ctx, name, ox, oy, scale) {
    var ic = ICONS[name]; if (!ic) return;
    for (var y = 0; y < ic.length; y++) for (var x = 0; x < ic[y].length; x++) {
      var c = ic[y][x]; if (c === '.' || !PAL[c]) continue;
      ctx.fillStyle = PAL[c]; ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
    }
  }

  var g = { el: $('#gotchi'), cv: $('#gCanvas'), status: $('#gStatus'), mood: 'idle', jump: 0, t: 0 };
  var mini = { el: $('#miniG'), cv: $('#miniCanvas'), icon: null };
  var STATUS = ['disponible ya', 'ánimo: feliz', 'hambre: proyectos', 'nivel: diseñadora web', 'ama: figma y ux/ui'];
  var sIdx = 0;
  if (g.cv) {
    var gx = g.cv.getContext('2d'), mx = mini.cv.getContext('2d');
    var last = 0, blinkAt = 2500;
    var loop = function (t) {
      g.t = t;
      if (t - last > 120) {
        last = t;
        var mood = g.mood;
        if (mood === 'idle' && (t % 3200) > 3000) mood = 'blink';
        var bounce = g.jump > 0 ? Math.round(Math.sin(g.jump / 8 * Math.PI) * 4) : (Math.floor(t / 480) % 2);
        if (g.jump > 0) g.jump--; else if (g.mood === 'happy') g.mood = 'idle';
        gx.clearRect(0, 0, 64, 64);
        drawSprite(gx, 0, 4 - bounce, 2, mood);
        /* teclas que brillan mientras programa */
        if (g.jump === 0) { gx.fillStyle = (Math.floor(t / 240) % 2) ? '#eba9bd' : '#d6dcc0'; gx.fillRect(22 + (Math.floor(t / 240) % 5) * 4, 56, 3, 2); }
        if (g.jump > 0) drawIcon(gx, 'heart', 44, 2, 2);
        /* mini */
        mx.clearRect(0, 0, 32, 32);
        drawSprite(mx, 0, 1 - (Math.floor(t / 480) % 2), 1, mood);
        if (mini.icon) drawIcon(mx, mini.icon, 25, 1, 1);
      }
      if (!reduce) requestAnimationFrame(loop);
    };
    if (reduce) { drawSprite(gx, 0, 4, 2, 'idle'); drawSprite(mx, 0, 1, 1, 'idle'); }
    else requestAnimationFrame(loop);
    setInterval(function () { sIdx = (sIdx + 1) % STATUS.length; g.status.textContent = STATUS[sIdx]; }, 2600);

    /* se inclina siguiendo el mouse */
    if (!reduce && matchMedia('(hover:hover)').matches) {
      addEventListener('pointermove', function (e) {
        var r = g.el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 600)), dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 600));
        g.el.style.setProperty('--ry', (dx * 18) + 'deg'); g.el.style.setProperty('--rx', (-dy * 14) + 'deg');
      }, { passive: true });
    }
    $$('[data-g]', g.el).forEach(function (b) {
      b.addEventListener('click', function () {
        g.mood = 'happy'; g.jump = 16;
        var k = b.dataset.g;
        if (k === 'a') { g.status.textContent = '¡vamos!'; setTimeout(function () { $('#proyectos').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 350); }
        if (k === 'b') { g.status.textContent = '¡a jugar!'; setTimeout(openGame, 300); }
        if (k === 'c') { g.status.textContent = '¡escríbeme!'; setTimeout(function () { $('#contacto').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 350); }
      });
    });
    mini.el.addEventListener('click', openGame);
  }

  /* ======================= minijuego: atrapa los bugs ======================= */
  var game = $('#game'), gc = $('#gameCanvas'), gctx = gc && gc.getContext('2d');
  var BUG = ["..K..K..","...KK...",".KppppK.","KpKppKpK",".pppppp.","K.pppp.K",".K....K."];
  var st = null, opener = null;
  function openGame() {
    opener = document.activeElement;
    game.hidden = false; document.body.style.overflow = 'hidden';
    $('#gClose').focus(); start();
  }
  function closeGame() {
    if (st) cancelAnimationFrame(st.raf); st = null;
    game.hidden = true; document.body.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  }
  function start() {
    $('#gEnd').hidden = true;
    st = { bugs: [], score: 0, t0: performance.now(), last: performance.now(), spawn: 0, splats: [], raf: 0 };
    st.raf = requestAnimationFrame(step);
  }
  function step(now) {
    if (!st) return;
    var dt = Math.min(50, now - st.last); st.last = now;
    var left = Math.max(0, 20 - (now - st.t0) / 1000);
    $('#gTime').textContent = Math.ceil(left) + ' s'; $('#gScore').textContent = st.score + ' bugs';
    st.spawn -= dt;
    if (st.spawn <= 0 && left > 0) {
      st.bugs.push({ x: 16 + Math.random() * 256, y: -30, v: .05 + Math.random() * .05 + (20 - left) * .004, w: Math.random() * 6 });
      st.spawn = 520 - (20 - left) * 16;
    }
    gctx.fillStyle = '#c8cdb0'; gctx.fillRect(0, 0, 320, 400);
    gctx.fillStyle = 'rgba(58,46,50,.12)';
    for (var i = 0; i < 400; i += 8) gctx.fillRect(0, i, 320, 1);
    st.splats = st.splats.filter(function (s) { s.t -= dt; gctx.fillStyle = 'rgba(214,116,130,' + Math.max(0, s.t / 500) + ')'; gctx.fillRect(s.x - 10, s.y - 4, 36, 4); gctx.fillRect(s.x, s.y - 12, 16, 20); return s.t > 0; });
    st.bugs = st.bugs.filter(function (b) {
      b.y += b.v * dt; var wob = Math.sin((now / 160) + b.w) * 3;
      for (var y = 0; y < BUG.length; y++) for (var x = 0; x < 8; x++) {
        var c = BUG[y][x]; if (c === '.') continue; gctx.fillStyle = PAL[c]; gctx.fillRect(b.x + wob + x * 4, b.y + y * 4, 4, 4);
      }
      return b.y < 400;
    });
    /* Paula abajo, animándote */
    drawSprite(gctx, 248, 334, 2, 'happy');
    if (left <= 0) { end(); return; }
    st.raf = requestAnimationFrame(step);
  }
  function hit(e) {
    if (!st) return;
    var r = gc.getBoundingClientRect(), x = (e.clientX - r.left) * 320 / r.width, y = (e.clientY - r.top) * 400 / r.height;
    for (var i = st.bugs.length - 1; i >= 0; i--) {
      var b = st.bugs[i];
      if (x > b.x - 10 && x < b.x + 42 && y > b.y - 10 && y < b.y + 38) { st.bugs.splice(i, 1); st.score++; st.splats.push({ x: b.x, y: b.y + 14, t: 500 }); break; }
    }
  }
  function end() {
    var n = st.score; cancelAnimationFrame(st.raf); st = null;
    $('#gEndTxt').textContent = n === 0 ? 'Ningún bug esta vez. ¿Otra?' : 'Arreglaste ' + n + (n === 1 ? ' bug' : ' bugs') + ' en 20 segundos. Imagínate lo que hago con tu web :)';
    $('#gEnd').hidden = false; $('#gAgain').focus();
  }
  if (gc) {
    gc.addEventListener('pointerdown', hit);
    $('#gClose').addEventListener('click', closeGame);
    $('#gAgain').addEventListener('click', start);
    $('#gTalk').addEventListener('click', closeGame);
    game.addEventListener('click', function (e) { if (e.target === game) closeGame(); });
  }

  /* ======================= visor de manuales ======================= */
  var mv = $('#mv'), mvImg = $('#mvImg'), man = null, mvOpener = null;
  function page(i) { return 'img/manual/' + man.k + '/p' + String(i + 1).padStart(2, '0') + '.webp'; }
  function show(i) {
    man.i = (i + man.n) % man.n; mvImg.src = page(man.i); mvImg.alt = man.name + ', página ' + (man.i + 1);
    $('#mvCount').textContent = (man.i + 1) + ' / ' + man.n;
    new Image().src = page((man.i + 1) % man.n);
  }
  $$('[data-manual]').forEach(function (b) { b.addEventListener('click', function () {
    mvOpener = b; man = { k: b.dataset.manual, n: +b.dataset.n, i: 0, name: b.dataset.name };
    $('#mvName').textContent = man.name; mv.hidden = false; document.body.style.overflow = 'hidden'; show(0); $('#mvClose').focus();
  }); });
  function closeMv() { mv.hidden = true; document.body.style.overflow = ''; if (mvOpener) mvOpener.focus(); }
  if (mv) {
    $('#mvClose').addEventListener('click', closeMv);
    $('#mvPrev').addEventListener('click', function () { show(man.i - 1); });
    $('#mvNext').addEventListener('click', function () { show(man.i + 1); });
    mvImg.addEventListener('click', function () { show(man.i + 1); });
    var sx = null;
    mv.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    mv.addEventListener('touchend', function (e) { if (sx === null) return; var d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) show(man.i + (d < 0 ? 1 : -1)); sx = null; });
  }
  addEventListener('keydown', function (e) {
    if (mv && !mv.hidden) { if (e.key === 'Escape') closeMv(); if (e.key === 'ArrowRight') show(man.i + 1); if (e.key === 'ArrowLeft') show(man.i - 1); }
    else if (game && !game.hidden && e.key === 'Escape') closeGame();
  });
})();
