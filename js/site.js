/* Paula Urbano · portfolio · sin librerías */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var phone = matchMedia('(max-width: 760px)'), small = matchMedia('(max-width: 899px)');
  var root = document.documentElement;
  /* el aviso de las herramientas no aparece hasta que bajas */
  var onScrolled = function () { root.classList.toggle('scrolled', scrollY > innerHeight * .5); };
  addEventListener('scroll', onScrolled, { passive: true }); onScrolled();
  /* idioma: el diccionario (js/en.js) solo se carga en inglés */
  var T = window.T || function (s) { return s; };
  $$('[data-lang]').forEach(function (b) {
    var en = root.lang === 'en'; b.textContent = en ? 'ES' : 'EN'; b.setAttribute('lang', en ? 'es' : 'en'); b.setAttribute('aria-label', en ? 'Ver en español' : 'View in English');
    b.addEventListener('click', function () { try { localStorage.setItem('lang', en ? 'es' : 'en'); } catch (e) {} if (/lang=/.test(location.search)) location.replace(location.pathname + location.hash); else location.reload(); });
  });
  /* vibración corta en Android (iPhone no la permite) */
  var buzz = function (ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 8); } catch (e) {} };
  /* la barra del navegador toma el color de cada sección */
  var THEME = { wine: '#221616', plum: '#381A17', olive: '#36321F', milk: '#E8D9C9', nails: '#F3ECE8', kronox: '#0B0B0A', nacar: '#EFE7DC', amigos: '#0F1E3D', film: '#141210', figma: '#1E1E1E' };
  var metaTheme = $('meta[name="theme-color"]');

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
      if (metaTheme && THEME[e.target.dataset.bg]) metaTheme.content = THEME[e.target.dataset.bg];
      if (window.dockMark) dockMark(e.target);
      if (window.hereMark) hereMark(e.target);
      window.curSec = e.target.dataset.here || e.target.id;
      if (window.PG) PG.ev('visit', window.curSec);
      if (window.autoSay) autoSay();
      if (e.target.dataset.icon) mini.icon = e.target.dataset.icon;
    } });
  }, { rootMargin: '-48% 0px -48% 0px' });
  $$('[data-bg]').forEach(function (el) { bgIO.observe(el); });

  /* ---------- entradas al hacer scroll ---------- */
  var revIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  $$('[data-reveal]').forEach(function (el) { revIO.observe(el); });


  /* ---------- carga perezosa: portadas de video y tipografías de cada cliente ---------- */
  var postIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { var v = e.target; if (v.dataset.poster) { v.poster = v.dataset.poster; v.removeAttribute('data-poster'); } postIO.unobserve(v); } });
  }, { rootMargin: '900px 0px' });
  $$('video[data-poster]').forEach(function (v) { if (!v.closest('.bw,.cs')) postIO.observe(v); });
  var FONTS = {
    nails: [['Nails Display', 'nails-display', 'normal'], ['Nails Display', 'nails-display-i', 'italic'], ['Nails Sans', 'nails-sans', 'normal']],
    nacar: [['Nacar Display', 'nacar-display', 'normal'], ['Nacar Display', 'nacar-display-i', 'italic'], ['Nacar Sans', 'nacar-sans', 'normal']],
    kronox: [['Kronox Display', 'kronox-display', 'normal']],
    proyectos: [['Nails Display', 'nails-display', 'normal'], ['Kronox Display', 'kronox-display', 'normal'], ['Nacar Display', 'nacar-display', 'normal'], ['Amigos Display', 'amigos-display', 'normal']],
    amigos: [['Amigos Display', 'amigos-display', 'normal'], ['Amigos Sans', 'amigos-sans', 'normal']]
  };
  if (window.FontFace && document.fonts) {
    var fontIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; fontIO.unobserve(e.target);
        (FONTS[e.target.dataset.fk || e.target.id] || []).forEach(function (f) { var ff = new FontFace(f[0], 'url(fonts/' + f[1] + '.woff2) format("woff2")', { style: f[2], display: 'swap' }); ff.load().then(function (x) { document.fonts.add(x); }).catch(function () {}); });
      });
    }, { rootMargin: '700px 0px' });
    Object.keys(FONTS).forEach(function (id) { ['#' + id, '#r-' + id].forEach(function (q) { var el = $(q); if (el) { el.id && (el.dataset.fk = id); fontIO.observe(el); } }); });
  }

  /* ---------- videos: se cargan cerca y solo suenan (mudos) a la vista ---------- */
  var vids = $$('video[data-src]').filter(function (v) { return !v.closest('.bw,.cs'); });
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

  /* ---------- "lo que más me gusta": las palabras se encienden al bajar ---------- */
  var love = $('.love'), words = [];
  if (love) {
    var split = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
            var w = document.createElement('span'); w.className = 'w'; w.textContent = t; frag.appendChild(w); words.push(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) split(n);
      });
    };
    split($('#loveTxt'));
  }
  /* ---------- Figma: carrete que se desliza con el dedo, se arrastra con el ratón o con las flechas ---------- */
  var fig = $('.fig'), figTrack = fig && $('.fig-track', fig);
  if (figTrack) {
    var figCards = $$('.fig-card', figTrack), figN = $('#figN'), figDots = $('#figDots'), figPrev = $('.fig-nav.prev', fig), figNext = $('.fig-nav.next', fig), figCur = 0;
    figCards.forEach(function (c, i) { var d = document.createElement('i'); d.addEventListener('click', function () { figGo(i); }); figDots.appendChild(d); });
    var figAt = function () { var mid = figTrack.scrollLeft + figTrack.clientWidth / 2, best = 0, d = 1e9; figCards.forEach(function (c, i) { var dd = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (dd < d) { d = dd; best = i; } }); return best; };
    var figPaint = function () {
      figCur = figAt(); figN.textContent = figCur + 1;
      $$('i', figDots).forEach(function (d, i) { d.classList.toggle('on', i === figCur); });
      figPrev.disabled = figTrack.scrollLeft < 4; figNext.disabled = figTrack.scrollLeft > figTrack.scrollWidth - figTrack.clientWidth - 4;
    };
    var figGo = function (i) { i = Math.max(0, Math.min(figCards.length - 1, i)); var c = figCards[i]; figTrack.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - figTrack.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); };
    figTrack.addEventListener('scroll', function () { requestAnimationFrame(figPaint); }, { passive: true });
    $$('.fig-nav', fig).forEach(function (b) { b.addEventListener('click', function () { buzz(6); figGo(figCur + +b.dataset.d); }); });
    figTrack.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); figGo(figCur + (e.key === 'ArrowRight' ? 1 : -1)); } });
    /* con el ratón se arrastra como en Figma */
    var fdx = null, fsl = 0, fmoved = false;
    figTrack.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; fdx = e.clientX; fsl = figTrack.scrollLeft; fmoved = false; figTrack.classList.add('drag'); });
    addEventListener('pointermove', function (e) { if (fdx === null) return; var d = e.clientX - fdx; if (Math.abs(d) > 4) fmoved = true; figTrack.scrollLeft = fsl - d; });
    addEventListener('pointerup', function () { if (fdx === null) return; fdx = null; figTrack.classList.remove('drag'); if (fmoved) figGo(figAt()); });
    figTrack.addEventListener('click', function (e) { if (fmoved) { e.preventDefault(); e.stopPropagation(); fmoved = false; } }, true);
    figTrack.addEventListener('dragstart', function (e) { e.preventDefault(); });
    addEventListener('load', figPaint); addEventListener('resize', figPaint); figPaint();
    $$('img', figTrack).forEach(function (im) { im.addEventListener('load', figPaint); });
    /* al acercarse, se cargan todas para que el carrete mida bien */
    new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; $$('img', figTrack).forEach(function (im) { im.loading = 'eager'; }); figPaint(); }, { rootMargin: '600px 0px' }).observe(figTrack);
  }
  function onScroll() {
    if (love && !reduce) {
      var r = love.getBoundingClientRect(), span = love.offsetHeight - innerHeight * .8;
      var p = Math.min(1, Math.max(0, (innerHeight * .35 - r.top) / span));
      var lit = Math.round(p * 1.2 * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
    }
    mini.el.classList.toggle('show', scrollY > innerHeight * .8);
  }
  var ticking = false;
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('load', onScroll);

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

  var g = { el: $('#gotchi'), cv: $('#gCanvas'), status: $('#gStatus'), mood: 'idle', jump: 0, t: 0, sleep: false };
  var mini = { el: $('#miniG'), cv: $('#miniCanvas'), icon: null };
  /* su día de verdad, con la hora de Valencia */
  var ROUTINE = [
    [0, 'durmiendo zzz', 'sleep'], [7 * 60, 'corriendo a la uni. tarde, como siempre'], [8 * 60 + 30, 'en clase adelantando cosas mías'],
    [14 * 60, 'almorzando'], [15 * 60, 'trabajando en webs'], [19 * 60, 'recogiendo y limpiando'], [19 * 60 + 45, 'en la ducha'],
    [20 * 60 + 30, 'cenando'], [21 * 60 + 15, 'llamando a mi familia, que está lejos'], [22 * 60, 'una cosita más (un poco workaholic)'], [23 * 60 + 45, 'durmiendo zzz', 'sleep']
  ];
  function madrid() {
    try {
      var parts = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var h = 0, m = 0; parts.forEach(function (x) { if (x.type === 'hour') h = +x.value % 24; if (x.type === 'minute') m = +x.value; });
      return { h: h, m: m };
    } catch (e) { var d = new Date(); return { h: d.getHours(), m: d.getMinutes() }; }
  }
  function now() {
    var t = madrid(), mins = t.h * 60 + t.m, cur = ROUTINE[0];
    ROUTINE.forEach(function (r) { if (mins >= r[0]) cur = r; });
    return { txt: cur[1], sleep: cur[2] === 'sleep', clock: ('0' + t.h).slice(-2) + ':' + ('0' + t.m).slice(-2) };
  }
  var STATUS = [], sIdx = 0;
  function refresh() {
    var n = now(), clk = $('#gClock');
    if (clk) clk.innerHTML = '<span>valencia</span><span>' + n.clock + '</span>';
    STATUS = [n.txt, 'diseño + código', 'ama: figma y ux/ui'];
    g.sleep = n.sleep;
    $('.g-screen').classList.toggle('zz', n.sleep);
  }
  if (g.cv) {
    var gx = g.cv.getContext('2d'), mx = mini.cv.getContext('2d');
    var last = 0, blinkAt = 2500;
    var loop = function (t) {
      if ((typeof game !== 'undefined' && game && !game.hidden) || document.hidden) { if (!reduce) requestAnimationFrame(loop); return; }
      g.t = t;
      if (t - last > 120) {
        last = t;
        var mood = g.mood;
        if (mood === 'idle' && (t % 3200) > 3000) mood = 'blink';
        if (mood === 'idle' && (g.sleep || g.nap)) mood = 'blink';
        var bounce = g.jump > 0 ? Math.round(Math.sin(g.jump / 8 * Math.PI) * 4) : (Math.floor(t / 480) % 2);
        if (g.jump > 0) g.jump--; else if (g.mood === 'happy') g.mood = 'idle';
        gx.clearRect(0, 0, 64, 64);
        drawSprite(gx, 0, 4 - bounce, 2, mood); if (window.PG) PG.dress(gx, 0, 4 - bounce, 2);
        /* teclas que brillan mientras programa */
        if (g.jump === 0) { gx.fillStyle = (Math.floor(t / 240) % 2) ? '#eba9bd' : '#d6dcc0'; gx.fillRect(22 + (Math.floor(t / 240) % 5) * 4, 56, 3, 2); }
        if (g.jump > 0) drawIcon(gx, 'heart', 44, 2, 2);
        else if (g.sleep || g.nap) { gx.fillStyle = '#3a2e32'; var zy = 10 - (Math.floor(t / 480) % 3) * 2; gx.fillRect(48, zy, 6, 2); gx.fillRect(52, zy + 2, 2, 2); gx.fillRect(50, zy + 4, 2, 2); gx.fillRect(48, zy + 6, 6, 2); }
        /* mini */
        mx.clearRect(0, 0, 32, 32);
        drawSprite(mx, 0, 1 - (Math.floor(t / 480) % 2), 1, mood); if (window.PG) PG.dress(mx, 0, 1 - (Math.floor(t / 480) % 2), 1);
        if (g.nap && g.jump === 0) { mx.fillStyle = '#3a2e32'; var zz = 2 - (Math.floor(t / 480) % 2); mx.fillRect(25, zz, 4, 1); mx.fillRect(27, zz + 1, 1, 1); mx.fillRect(26, zz + 2, 1, 1); mx.fillRect(25, zz + 3, 4, 1); }
        if (mini.icon) drawIcon(mx, mini.icon, 25, 1, 1);
      }
      if (!reduce) requestAnimationFrame(loop);
    };
    refresh(); g.status.textContent = STATUS[0];
    if (reduce) { drawSprite(gx, 0, 4, 2, 'idle'); drawSprite(mx, 0, 1, 1, 'idle'); }
    else requestAnimationFrame(loop);
    setInterval(function () { if (g.nap) return; if (sIdx === 0) refresh(); sIdx = (sIdx + 1) % STATUS.length; g.status.textContent = STATUS[sIdx]; }, 3400);

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
        g.mood = 'happy'; g.jump = 16; buzz(12);
        var k = b.dataset.g;
        if (k === 'a') { g.status.textContent = '¡vamos!'; setTimeout(function () { goTo('proyectos'); }, 350); }
        if (k === 'b') { g.status.textContent = '¡a jugar!'; setTimeout(openGame, 300); }
        if (k === 'c') { g.status.textContent = '¡escríbeme!'; setTimeout(function () { $('#contacto').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 350); }
      });
    });
    mini.el.addEventListener('click', function () { sayHi(); });
  }


  /* ======================= Kronox: código de tiempo ======================= */
  var tcs = $$('.kronox .tc, .crea .tc'), tcOn = false, tc0 = 0;
  if (tcs.length && !reduce) {
    var tcIO = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target._v = e.isIntersecting; }); tcOn = $('#kronox')._v || $('#creativos')._v; if (tcOn && !tc0) tc0 = performance.now(); });
    tcIO.observe($('#kronox')); tcIO.observe($('#creativos'));
    setInterval(function () {
      if (!tcOn) return;
      var f = Math.floor((performance.now() - tc0) / (1000 / 24)), pad = function (n) { return ('0' + n).slice(-2); };
      var txt = pad(Math.floor(f / 86400)) + ':' + pad(Math.floor(f / 1440) % 60) + ':' + pad(Math.floor(f / 24) % 60) + ':' + pad(f % 24);
      tcs.forEach(function (el) { el.textContent = txt; });
    }, 42);
  }

  /* las webs de los creativos, en vivo */
  var lives = $$('iframe.live');
  var fitLive = function (f) { var b = f.parentNode, k = b.clientWidth / 1280; f.style.transform = 'scale(' + k + ')'; f.style.height = (b.clientHeight / k) + 'px'; };
  if (lives.length) {
    var liveIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var f = e.target;
        if (e.isIntersecting && !f.src && !small.matches) { f.addEventListener('load', function () { f.classList.add('ok'); }); f.src = f.dataset.live; fitLive(f); }
        if (!e.isIntersecting) f.parentNode.classList.remove('nav');
      });
    }, { rootMargin: '300px 0px' });
    lives.forEach(function (f) { liveIO.observe(f); });
    addEventListener('resize', function () { lives.forEach(fitLive); });
    $$('.live-go').forEach(function (b) {
      b.addEventListener('click', function () { var on = b.parentNode.classList.toggle('nav'); b.textContent = on ? 'Listo' : 'Navegar aquí'; });
    });
  }

  /* visor 3D: el plano sigue un poco al ratón */
  var b3 = $('.b3-view');
  if (b3 && !reduce && matchMedia('(hover:hover)').matches) {
    var obj = $('.b3-obj', b3);
    b3.addEventListener('pointermove', function (e) { var r = b3.getBoundingClientRect(); obj.style.animation = 'none'; obj.style.setProperty('--ty', ((e.clientX - r.left) / r.width - .5) * 50 + 'deg'); obj.style.setProperty('--tx', (-(e.clientY - r.top) / r.height + .5) * 30 + 'deg'); });
    b3.addEventListener('pointerleave', function () { obj.style.animation = ''; obj.style.removeProperty('--tx'); });
  }

  /* ======================= logos de marca: de pixel a vector, cada uno con su gesto ======================= */
  var lgs = $$('.lg-b');
  if (lgs.length && !reduce && window.fetch) {
    var SPRING = 'cubic-bezier(.34,1.56,.64,1)', SOFT = 'cubic-bezier(.22,1,.36,1)';
    var STEAM = '<svg class="vapor" viewBox="0 0 60 50" aria-hidden="true"><path d="M15 48c-6-8 6-12 0-22"/><path d="M30 48c-6-8 6-12 0-22"/><path d="M45 48c-6-8 6-12 0-22"/></svg>';
    var part = function (b) { return b.dataset.logo === 'vora' ? $('#sol', b) : b.dataset.logo === 'nidoo' ? $('#simbolo', b) : $('.hoja', b); };
    /* el vapor del café sube en tres hilos */
    var puff = function (b) { $$('.vapor path', b).forEach(function (p, i) { p.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: .85, offset: .35 }, { opacity: 0, transform: 'translateY(-22px)' }], { duration: 1500, delay: i * 140, easing: 'ease-out' }); }); };
    /* el sol de Vora sale como un amanecer: un barrido de izquierda a derecha */
    var sunrise = function (b) {
      var sol = $('#sol', b), svg = $('svg', b); if (!sol || !svg) return;
      var ns = 'http://www.w3.org/2000/svg', cp = document.createElementNS(ns, 'clipPath'), pa = document.createElementNS(ns, 'path');
      cp.setAttribute('id', 'vsweep'); cp.setAttribute('clipPathUnits', 'objectBoundingBox'); cp.appendChild(pa);
      var defs = $('defs', svg) || svg.insertBefore(document.createElementNS(ns, 'defs'), svg.firstChild); defs.appendChild(cp);
      sol.setAttribute('clip-path', 'url(#vsweep)');
      var t0 = 0, D = 1100;
      (function f(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3), a = Math.PI * (1 - e), pts = ['.5 1.05'];
        for (var x = Math.PI; x >= a - 1e-6; x -= Math.PI / 36) pts.push((.5 + Math.cos(x) * 1.3).toFixed(3) + ' ' + (1.05 - Math.sin(x) * 1.3).toFixed(3));
        pts.push((.5 + Math.cos(a) * 1.3).toFixed(3) + ' ' + (1.05 - Math.sin(a) * 1.3).toFixed(3));
        pa.setAttribute('d', 'M' + pts.join('L') + 'Z');
        if (k < 1) requestAnimationFrame(f); else sol.removeAttribute('clip-path'); })(performance.now());
    };
    var intro = function (b) {
      var k = b.dataset.logo, p = part(b);
      b._v.animate([{ transform: 'scale(.96)', filter: 'blur(3px)' }, { transform: 'scale(1)', filter: 'blur(0)' }], { duration: 650, easing: SOFT });
      if (k === 'vora') sunrise(b);
      if (k === 'cafe') { puff(b); p.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-9deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0)' }], { duration: 1300, easing: SOFT }); }
      if (k === 'nidoo') p.animate([{ transform: 'rotate(-180deg) scale(.85)' }, { transform: 'rotate(0) scale(1)' }], { duration: 1200, easing: SPRING });
    };
    /* pixel a vector: el SVG se dibuja cada vez con más resolución */
    var pixelIn = function (b, svgText) {
      var cv = document.createElement('canvas'); b.appendChild(cv); b.classList.add('px');
      var r = b._v.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.max(2, Math.round(r.width * dpr)); cv.height = Math.max(2, Math.round(r.height * dpr));
      var x = cv.getContext('2d'), im = new Image(), tmp = document.createElement('canvas');
      im.onload = function () {
        var steps = [3, 5, 8, 13, 21, 34, 55], i = 0;
        (function step() {
          if (i >= steps.length) { b.classList.remove('px'); intro(b); setTimeout(function () { cv.remove(); }, 300); return; }
          var w = Math.max(2, Math.round(cv.width * steps[i] / 100)), h = Math.max(2, Math.round(cv.height * steps[i] / 100)); tmp.width = w; tmp.height = h;
          var t = tmp.getContext('2d'); t.clearRect(0, 0, w, h); t.drawImage(im, 0, 0, w, h);
          x.clearRect(0, 0, cv.width, cv.height); x.imageSmoothingEnabled = false; x.drawImage(tmp, 0, 0, cv.width, cv.height);
          i++; setTimeout(step, 85 - i * 5);
        })();
      };
      im.onerror = function () { b.classList.remove('px'); cv.remove(); };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
    };
    var lgLoad = function (b) {
      var img = $('img', b); if (!img || b._v) return;
      fetch(img.getAttribute('src')).then(function (r) { return r.text(); }).then(function (t) {
        var v = document.createElement('div'); v.className = 'lg-v';
        v.innerHTML = b.dataset.logo === 'cafe' ? '<div class="hoja">' + t + '</div><div class="resto">' + t + '</div>' + STEAM : t;
        $$('svg', v).forEach(function (s) { s.removeAttribute('width'); s.removeAttribute('height'); s.setAttribute('aria-hidden', 'true'); });
        b.replaceChild(v, img); b._v = v; pixelIn(b, t);
      }).catch(function () {});
    };
    var lgIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { lgIO.unobserve(e.target); lgLoad(e.target); } }); }, { threshold: .55 });
    lgs.forEach(function (b) { lgIO.observe(b); });
    /* con el ratón encima, cada marca hace su gesto */
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) lgs.forEach(function (b) {
      var card = b.closest('.card-in'), loop = null, spin = 0;
      card.addEventListener('mouseenter', function () {
        var p = b._v && part(b); if (!p) return; var k = b.dataset.logo;
        if (k === 'vora') loop = p.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-5deg) scale(1.07)' }, { transform: 'rotate(5deg) scale(1.07)' }, { transform: 'rotate(0) scale(1)' }], { duration: 2600, iterations: Infinity, easing: 'ease-in-out' });
        if (k === 'cafe') { puff(b); loop = p.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg) translateY(-2%)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0)' }], { duration: 1800, iterations: Infinity, easing: 'ease-in-out' }); b._puff = setInterval(function () { puff(b); }, 1800); }
        if (k === 'nidoo') { p.animate([{ transform: 'rotate(' + spin + 'deg)' }, { transform: 'rotate(' + (spin + 180) + 'deg)' }], { duration: 1000, easing: SPRING, fill: 'forwards' }); spin += 180; }
      });
      card.addEventListener('mouseleave', function () { if (loop) { loop.cancel(); loop = null; } clearInterval(b._puff); });
    });
    /* en el celular siguen la inclinación del teléfono */
    if (matchMedia('(pointer:coarse)').matches && window.DeviceOrientationEvent) {
      var tg = 0, cur = 0, lgRaf = 0;
      var lgTick = function () { cur += (tg - cur) * .12; lgs.forEach(function (b) { var p = b._v && part(b); if (!p || !b.getClientRects().length) return; var k = b.dataset.logo;
          p.style.transform = 'rotate(' + (k === 'vora' ? cur * .35 : k === 'cafe' ? cur * .45 : cur * .9).toFixed(2) + 'deg)'; });
        lgRaf = Math.abs(tg - cur) > .05 ? requestAnimationFrame(lgTick) : 0; };
      addEventListener('deviceorientation', function (e) { if (e.gamma == null) return; tg = Math.max(-25, Math.min(25, e.gamma)); if (!lgRaf) lgRaf = requestAnimationFrame(lgTick); }, { passive: true });
    }
  }

  /* ======================= fichas de marca que se voltean ======================= */
  $$('.card-in').forEach(function (b) {
    var name = $('h3', b.parentNode).textContent;
    var set = function () { var on = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-label', (on ? 'Volver a la portada de ' : 'Dar la vuelta a la ficha de ') + name); };
    set();
    b.addEventListener('click', function () { buzz(10); b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); set(); if (window.PG) PG.ev('flip', name); });
  });

  /* ======================= sobre mí: yo en pixel y 3 iconos ======================= */
  var ab = $('#aboutCanvas');
  if (ab) { var ax = ab.getContext('2d'); ax.fillStyle = '#e9dccd'; ax.fillRect(0, 0, 64, 64); drawSprite(ax, 0, 2, 2, 'happy'); }
  var PX = {
    grass: { c: { r: '#c0392b', g: '#7d9a45', G: '#4f6b2a' }, m: ["r..........r",".r........r.","..r......r..","...r....r...","....r..r....",".....rr.....",".....rr.....","....r..r....","g..r.g..r.g.","g.rg.gg.gr.g","gGrgGggGgrGg","GGGGGGGGGGGG"] },
    plate: { c: { o: '#c9b29a', w: '#fffaf5', y: '#e8bc50', R: '#c0392b' }, m: ["............","...oooooo...","..owwwwwwo..",".owwyyRRwwo.",".owyyyRRRwo.",".owyyyyRRwo.",".owwyyyywwo.","..owwwwwwo..","...oooooo...","............","............","............"] },
    music: { c: { n: '#2A1714', p: '#a34a68' }, m: ["............","......nnnnnn","......nnnnnn","......n....n","......n....n","......n....n","......n....n","....nnn..ppn","...nnnn.pppp","...nnnn.pppp","....nn...pp.","............"] }
  };
  $$('canvas[data-px]').forEach(function (c) {
    var d = PX[c.dataset.px], x = c.getContext('2d'); if (!d) return;
    d.m.forEach(function (row, y) { for (var i = 0; i < row.length; i++) { var k = row[i]; if (d.c[k]) { x.fillStyle = d.c[k]; x.fillRect(i, y, 1, 1); } } });
  });

  /* ======================= contacto: mensaje al Paulagotchi ======================= */
  var mf = $('#msgForm'), mc = $('#msgCanvas');
  if (mf && mc) {
    var mcx = mc.getContext('2d'); drawSprite(mcx, 0, 0, 1, 'idle');
    mf.addEventListener('submit', function (e) {
      e.preventDefault();
      var txt = $('#msgTxt').value.trim(); if (!txt) return;
      mcx.clearRect(0, 0, 32, 32); drawSprite(mcx, 0, 0, 1, 'happy');
      mc.classList.remove('hop'); void mc.offsetWidth; mc.classList.add('hop');
      $('#msgSay').textContent = '¡gracias! abriendo tu correo…';
      setTimeout(function () { location.href = 'mailto:mariaurbanoeu@gmail.com?subject=' + encodeURIComponent(T('Hola Paula')) + '&body=' + encodeURIComponent(txt); }, 700);
    });
  }


  /* ======================= herramientas: iconos en pixel ======================= */
  var GLYPH = {
    A: ['.X.', 'X.X', 'XXX', 'X.X', 'X.X'], B: ['XX.', 'X.X', 'XX.', 'X.X', 'XX.'], C: ['.XX', 'X..', 'X..', 'X..', '.XX'],
    D: ['XX.', 'X.X', 'X.X', 'X.X', 'XX.'], F: ['XXX', 'X..', 'XX.', 'X..', 'X..'], G: ['.XX', 'X..', 'X.X', 'X.X', '.XX'],
    H: ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'], I: ['XXX', '.X.', '.X.', '.X.', 'XXX'], J: ['..X', '..X', '..X', 'X.X', '.X.'],
    P: ['XX.', 'X.X', 'XX.', 'X..', 'X..'], Q: ['.X.', 'X.X', 'X.X', 'XX.', '.XX'], S: ['.XX', 'X..', '.X.', '..X', 'XX.'],
    T: ['XXX', '.X.', '.X.', '.X.', '.X.'], L: ['X..', 'X..', 'X..', 'X..', 'XXX'], E: ['XXX', 'X..', 'XX.', 'X..', 'XXX'], W: ['X.X', 'X.X', 'XXX', 'XXX', 'X.X']
  };
  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g2 = (n >> 8) & 255, b = n & 255;
    return 'rgb(' + Math.round(r * k) + ',' + Math.round(g2 * k) + ',' + Math.round(b * k) + ')';
  }
  $$('canvas[data-tool]').forEach(function (cv) {
    var x = cv.getContext('2d'), c = cv.dataset.c, ab = cv.dataset.tool;
    /* ficha con esquinas en escalón, como los botones del Paulagotchi */
    x.fillStyle = shade(c, .28); x.fillRect(2, 1, 12, 14); x.fillRect(1, 2, 14, 12);
    x.fillStyle = c; x.fillRect(2, 1, 12, 1); x.fillRect(1, 2, 1, 12); x.fillRect(2, 14, 12, 1); x.fillRect(14, 2, 1, 12);
    x.fillStyle = shade(c, .55); x.fillRect(3, 13, 11, 1); x.fillRect(13, 3, 1, 10);
    x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(3, 3, 2, 1); x.fillRect(3, 4, 1, 1);
    x.fillStyle = c;
    for (var k = 0; k < 2; k++) {
      var gl = GLYPH[ab[k]]; if (!gl) continue;
      for (var y = 0; y < 5; y++) for (var i = 0; i < 3; i++) if (gl[y][i] === 'X') x.fillRect(4 + k * 5 + i, 6 + y, 1, 1);
    }
  });



  /* ======================= intro: la web diseñándose en Figma, en pixel ======================= */
  (function () {
    var box = $('#intro'); if (!box || !root.classList.contains('intro-on')) return;
    var cv = $('#introCv'), x = cv.getContext('2d'), step = $('#introStep');
    var W = innerWidth > innerHeight ? 128 : 76, H = Math.round(W * innerHeight / innerWidth); cv.width = W; cv.height = H;
    var land = W > H, fx = Math.round(W * (land ? .14 : .1)), fy = Math.round(H * (land ? .16 : .12)), fw = W - fx * 2, fh = H - fy - Math.round(H * (land ? .14 : .12));
    var R = function (c, a, b, w, h) { x.fillStyle = c; x.fillRect(Math.round(a), Math.round(b), Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); };
    var O = function (c, a, b, w, h) { R(c, a, b, w, 1); R(c, a, b + h - 1, w, 1); R(c, a, b, 1, h); R(c, a + w - 1, b, 1, h); };
    /* bloques de la portada: [x, y, w, h, color final] relativos al frame */
    var B = land ? [[.07, .12, .44, .1, '#FAF6F0'], [.07, .25, .38, .1, '#FAF6F0'], [.07, .38, .3, .1, '#FAF6F0'], [.07, .52, .22, .06, '#EBA9BD'], [.07, .63, .36, .025, '#cdbfb2'], [.07, .68, .32, .025, '#cdbfb2'], [.07, .78, .16, .08, '#FAF6F0'], [.25, .78, .08, .08, '#3a2626'], [.64, .16, .26, .68, 'egg']]
      : [[.08, .06, .7, .06, '#FAF6F0'], [.08, .14, .58, .06, '#FAF6F0'], [.08, .22, .46, .06, '#FAF6F0'], [.08, .3, .4, .035, '#EBA9BD'], [.08, .37, .8, .015, '#cdbfb2'], [.08, .4, .7, .015, '#cdbfb2'], [.08, .46, .42, .045, '#FAF6F0'], [.54, .46, .2, .045, '#3a2626'], [.22, .56, .56, .38, 'egg']];
    var cur = [Math.round(W / 2), Math.round(H / 2)], t0 = performance.now(), done = false, DUR = 1750;
    var cursor = function (a, b) { var C = ["X....", "XX...", "XPX..", "XPPX.", "XPPPX", "XPXX.", "X..X."]; C.forEach(function (r, y) { for (var i = 0; i < 5; i++) { if (r[i] === 'X') R('#ffffff', a + i, b + y, 1, 1); if (r[i] === 'P') R('#EBA9BD', a + i, b + y, 1, 1); } }); };
    var frame = function (t) {
      R('#1E1E1E', 0, 0, W, H);
      for (var gy = 6; gy < H; gy += 6) for (var gx = 3; gx < W; gx += 6) R('#2c2c2c', gx, gy, 1, 1);
      R('#2C2C2C', 0, 0, W, 4); R('#0D99FF', 2, 1, 2, 2); R('#B3B3B3', 6, 1, 10, 2);
      var k = Math.min(1, Math.max(0, (t - 100) / 220)), w = fw * k, h = fh * Math.min(1, k * 1.3);
      if (k <= 0) return;
      var paint = Math.min(1, Math.max(0, (t - 1000) / 260));
      R('#3a3a3a', fx, fy, w, h);
      if (paint > 0) R('#221616', fx, fy, w, h * paint);
      R('#B3B3B3', fx, fy - 3, Math.min(w, 16), 1);
      var n = Math.floor(Math.max(0, t - 330) / 75);
      for (var i = 0; i < B.length && i < n; i++) {
        var b = B[i], bx = fx + b[0] * fw, by = fy + b[1] * fh, bw = b[2] * fw, bh = b[3] * fh, colored = paint > b[1] + .05;
        if (b[4] === 'egg') {
          var ew = Math.min(bw, bh * .8), ex = bx + (bw - ew) / 2;
          R(colored ? '#5a2731' : '#555', ex, by, ew, bh); R(colored ? '#5a2731' : '#555', ex - 1, by + 2, ew + 2, bh - 4);
          var sw = ew * .62, sh = Math.min(bh * .5, sw), sx = ex + (ew - sw) / 2, sy = by + bh * .2;
          R(colored ? '#c4c9aa' : '#777', sx, sy, sw, sh);
          if (t > 1250) { var sc = Math.max(1, Math.floor(Math.min(sw, sh) / 32)); var cvs = Math.round(32 * sc); var ox = Math.round(sx + (sw - cvs) / 2), oy = Math.round(sy + (sh - cvs) / 2); if (sc >= 1 && cvs <= sw + 1) drawSprite(x, ox, oy, sc, 'happy'); else R('#d69670', sx + sw * .35, sy + sh * .25, sw * .3, sh * .5); }
          for (var q = 0; q < 3; q++) R(colored ? '#EBA9BD' : '#666', ex + ew * (.22 + q * .22), by + bh * .8, Math.max(2, ew * .1), Math.max(2, ew * .1));
        } else R(colored ? b[4] : '#5a5a5a', bx, by, bw, bh);
        if (i === n - 1 && t < 1000) { O('#0D99FF', bx - 1, by - 1, bw + 2, bh + 2); cur = [bx + bw, by + bh]; }
      }
      if (t < 1000 && k >= 1) O('#0D99FF', fx - 1, fy - 1, fw + 2, fh + 2);
      cursor(cur[0], cur[1]);
      step.textContent = t < 1000 ? 'wireframe' : t < 1250 ? 'color' : t < 1500 ? 'paulagotchi' : 'código';
    };
    var finish = function () {
      if (done) return; done = true; box.classList.add('out');
      setTimeout(function () { root.classList.remove('intro-on'); }, 260);
    };
    (function loop(now) {
      if (done) return; var t = now - t0;
      frame(t);
      if (t > 1450) { var z = 1 + Math.pow((t - 1450) / 300, 2) * 2.4; cv.style.transform = 'scale(' + z + ')'; cv.style.transformOrigin = ((fx + fw / 2) / W * 100) + '% ' + ((fy + fh / 2) / H * 100) + '%'; }
      if (t > DUR) { finish(); return; }
      requestAnimationFrame(loop);
    })(t0);
    $('#introSkip').addEventListener('click', finish);
    box.addEventListener('click', finish);
    addEventListener('keydown', function () { if (root.classList.contains('intro-on')) finish(); }, { once: true });
  })();

  /* ======================= portada: wireframe → diseño ======================= */
  if (root.classList.contains('wire')) {
    var wf = $('.wf');
    setTimeout(function () {
      if (wf) wf.classList.add('out');
      root.classList.remove('wire');
      setTimeout(function () { if (wf) wf.remove(); }, 700);
    }, 1250);
  }

  /* ======================= "ver cómo está hecho" ======================= */
  var insp = $('#insp');
  if (insp) {
    var grid = document.createElement('div'); grid.className = 'insp-grid'; grid.setAttribute('aria-hidden', 'true');
    grid.innerHTML = '<div>' + new Array(13).join('<i></i>') + '</div>';
    var box = document.createElement('div'); box.className = 'insp-box'; box.innerHTML = '<i></i><i></i><i></i><i></i><b></b>';
    var pad = document.createElement('div'); pad.className = 'insp-pad';
    var panel = document.createElement('div'); panel.className = 'insp-panel'; panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = '<span class="t">Pasa el ratón o toca cualquier cosa</span><p><span>Columnas</span>12 escritorio · 4 celular</p><p><span>Margen lateral</span>' + Math.round(parseFloat(getComputedStyle($('.hero')).paddingLeft)) + ' px</p>';
    document.body.append(grid, pad, box, panel);
    var on = false, cur = null;
    var hex = function (c) {
      var m = c.match(/\d+(\.\d+)?/g); if (!m) return c;
      if (m.length > 3 && +m[3] === 0) return 'transparente';
      return '#' + m.slice(0, 3).map(function (n) { return ('0' + (+n).toString(16)).slice(-2); }).join('').toUpperCase();
    };
    var fam = function (f) { return f.split(',')[0].replace(/["']/g, ''); };
    var name = function (el) {
      var t = el.tagName.toLowerCase();
      var map = { h1: 'Título H1', h2: 'Título H2', h3: 'Título H3', p: 'Texto', a: 'Enlace', button: 'Botón', img: 'Imagen', video: 'Video', canvas: 'Canvas (pixel)', li: 'Elemento de lista', figure: 'Marco', b: 'Texto en negrita', span: 'Texto', textarea: 'Campo de texto' };
      return (map[t] || 'Bloque') + (el.classList[0] ? ' · .' + el.classList[0] : '');
    };
    var inspShow = function (el) {
      if (!el || el === cur) return; cur = el;
      var r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      box.style.cssText = 'display:block;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
      $('b', box).textContent = Math.round(r.width) + ' × ' + Math.round(r.height);
      var pt = parseFloat(cs.paddingTop), pr = parseFloat(cs.paddingRight), pb = parseFloat(cs.paddingBottom), pl = parseFloat(cs.paddingLeft);
      pad.style.cssText = 'display:' + (pt + pr + pb + pl ? 'block' : 'none') + ';left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;border-width:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px';
      var txt = el.textContent.trim().length && !/^(img|video|canvas)$/i.test(el.tagName);
      var html = '<span class="t">' + name(el) + '</span>';
      if (txt) {
        html += '<p><span>Fuente</span>' + fam(cs.fontFamily) + ' ' + cs.fontWeight + (cs.fontStyle === 'italic' ? ' itálica' : '') + '</p>';
        html += '<p><span>Tamaño / interlineado</span>' + Math.round(parseFloat(cs.fontSize)) + ' / ' + (cs.lineHeight === 'normal' ? 'normal' : Math.round(parseFloat(cs.lineHeight))) + ' px</p>';
        html += '<p><span>Color</span><b><i class="sw" style="background:' + cs.color + '"></i>' + hex(cs.color) + '</b></p>';
      }
      var bg = hex(cs.backgroundColor);
      if (bg !== 'transparente') html += '<p><span>Fondo</span><b><i class="sw" style="background:' + cs.backgroundColor + '"></i>' + bg + '</b></p>';
      if (pt + pr + pb + pl) html += '<p><span>Padding</span>' + [pt, pr, pb, pl].map(Math.round).join(' · ') + '</p>';
      if (cs.borderRadius !== '0px') html += '<p><span>Esquinas</span>' + cs.borderRadius + '</p>';
      panel.innerHTML = html;
    };
    var pick = function (e) {
      var el = e.target;
      if (!on || !el || el.closest('.insp-panel,.hd-insp')) return;
      if (el.closest('.hd')) el = el.closest('a,button,.hd-logo') || el;
      inspShow(el);
    };
    var guard = function (e) {
      if (!on || e.target.closest('.hd-insp,.insp-panel')) return;
      e.preventDefault(); e.stopPropagation(); pick(e);
    };
    var toggle = function () {
      on = !on; insp.setAttribute('aria-pressed', String(on)); root.classList.toggle('inspect', on);
      if (!on) { box.style.display = 'none'; pad.style.display = 'none'; cur = null; }
      $$('[data-frame]').forEach(function (f) {
        var base = f.dataset.frameName || (f.dataset.frameName = f.dataset.frame);
        f.dataset.frame = on ? base + '  ' + Math.round(f.offsetWidth) + ' × ' + Math.round(f.offsetHeight) : base;
      });
    };
    insp.addEventListener('click', toggle);
    document.addEventListener('mouseover', pick, true);
    document.addEventListener('click', guard, true);
    addEventListener('scroll', function () { if (on && cur) { var c = cur; cur = null; inspShow(c); } }, { passive: true });
  }

  /* ======================= comentarios sobre la web ======================= */
  $$('.vbox').forEach(function (vb) {
    var v = $('video', vb), pinsEl = $$('.pin', vb);
    pinsEl.forEach(function (pin) {
      var c = pin.nextElementSibling;
      pin.addEventListener('click', function () {
        if (phone.matches) { buzz(8); var cc = c.cloneNode(true); cc.className = ''; openSheet('Comentario ' + pin.textContent, cc); if (v) { load(v); v.pause(); try { v.currentTime = 0; } catch (e) {} } return; }
        var open = pin.getAttribute('aria-expanded') !== 'true';
        pinsEl.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); o.nextElementSibling.classList.remove('open'); });
        if (open) {
          var x = parseFloat(pin.style.getPropertyValue('--x')) / 100 * vb.clientWidth, y = parseFloat(pin.style.getPropertyValue('--y')) / 100 * vb.clientHeight;
          var cw = Math.min(240, vb.clientWidth - 16), ch = c.offsetHeight || 80;
          c.style.width = cw + 'px';
          var W = vb.clientWidth, H = vb.clientHeight, cx, cy;
          if (x + 30 + cw <= W - 8) { cx = x + 30; cy = y - 10; }
          else if (x - cw - 10 >= 8) { cx = x - cw - 10; cy = y - 10; }
          else { cx = (W - cw) / 2; cy = y < H / 2 ? y + 10 : y - 34 - ch; }
          c.style.setProperty('--cx', Math.max(8, Math.min(W - cw - 8, cx)) + 'px');
          c.style.setProperty('--cy', Math.max(-ch, Math.min(H - 8, cy)) + 'px');
          pin.setAttribute('aria-expanded', 'true'); c.classList.add('open');
          if (v) { load(v); v.pause(); try { v.currentTime = 0; } catch (e) {} }
        } else if (v && !reduce) { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); }
      });
    });
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('.pin,.cmt')) return;
    $$('.pin[aria-expanded="true"]').forEach(function (p) { p.click(); });
  });

  /* ======================= la demo en escritorio, tablet o celular ======================= */
  $$('.devbar').forEach(function (bar) {
    var sec = bar.closest('.pj'), vb = $('.vbox[data-demo]', sec), stage = bar.parentNode.querySelector('.kx-stage') || vb, fr = null, w = 'video';
    var fit = function () {
      if (!fr || w === 'video') { vb.style.height = ''; return; }
      vb.style.height = '';
      var bw = vb.clientWidth, bh = vb.clientHeight, W = +w, H, k;
      if (W === 390) {
        H = 844; k = Math.min(1, bw / W, innerHeight * .72 / H);
        if (bh < H * k) { vb.style.height = (H * k) + 'px'; bh = H * k; }
        k = Math.min(k, bh / H);
      } else { k = Math.min(1, bw / W); H = bh / k; }
      fr.style.width = W + 'px'; fr.style.height = H + 'px';
      fr.style.transform = 'translateX(' + Math.max(0, (bw - W * k) / 2) + 'px) scale(' + k + ')';
    };
    $$('button', bar).forEach(function (b) {
      b.addEventListener('click', function () {
        w = b.dataset.w;
        $$('button', bar).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        var demo = w !== 'video';
        var url = b.dataset.url || vb.dataset.demo;
        if (demo && (!fr || fr.dataset.u !== url)) {
          if (!fr) { fr = document.createElement('iframe'); fr.loading = 'lazy'; vb.appendChild(fr); }
          fr.dataset.u = url; fr.src = url; fr.title = b.dataset.url ? 'Web de Kronox en vivo' : vb.dataset.title;
        }
        if (fr) fr.hidden = !demo;
        vb.classList.toggle('demo', demo);
        var ks = sec.querySelector('.kx-stage'); if (ks) ks.classList.toggle('demo', demo);
        var v = $('video', vb); if (v) { if (demo) v.pause(); else if (!reduce) { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } }
        fit();
      });
    });
    addEventListener('resize', fit);
  });

  /* ======================= la web en computadora, tablet o celular (la de verdad, adaptándose en vivo) ======================= */
  var DVW = { pc: [1280, 800], tab: [820, 1180], cel: [390, 844] }, dvSeen = false;
  try { dvSeen = !!localStorage.getItem('dvSeen'); } catch (e) {}
  if (dvSeen) root.classList.add('dv-seen');
  var dvMark = function () { if (dvSeen) return; dvSeen = true; root.classList.add('dv-seen'); try { localStorage.setItem('dvSeen', '1'); } catch (e) {} };
  var dvDemoDone = false;
  $$('.dv').forEach(function (dv) {
    var fr = $('.dv-frame', dv), stg = $('.dv-stage', dv), ifr = $('iframe', fr), poster = $('.dv-poster', fr), tabs = $$('.dv-tabs button', dv);
    var mode = dv.dataset.mode, vw = DVW[mode][0], fw = 0, fh = 0, anim = 0, vis = false, loaded = false, demoT = [];
    var src = fr.dataset.src, pcP = fr.dataset.pc, celP = fr.dataset.cel;
    /* el menú plegable: Ver en ▾ */
    var mn = $('.dv-menu', dv), tog = $('.dv-tog', dv), now = $('.dv-now', dv);
    var menu = function (o) { if (!mn) return; mn.classList.toggle('open', o); tog.setAttribute('aria-expanded', String(o)); };
    if (tog) {
      tog.addEventListener('click', function (e) { e.stopPropagation(); menu(!mn.classList.contains('open')); });
      document.addEventListener('click', function (e) { if (!mn.contains(e.target)) menu(false); });
      mn.addEventListener('keydown', function (e) { if (e.key === 'Escape') { menu(false); tog.focus(); } });
    }
    /* tamaño del marco: lo más grande que quepa en el ancho del visor y en la pantalla, con la proporción de cada aparato */
    var target = function (m) { var d = DVW[m], W = stg.clientWidth; if (m === 'pc') return [W, W * d[1] / d[0]]; var h = Math.min(innerHeight * .74, W * d[1] / d[0]); return [h * d[0] / d[1], h]; };
    var paint = function (w, h, v) {
      var k = w / v; fw = w; fh = h; vw = v;
      fr.style.width = w + 'px'; fr.style.height = h + 'px';
      ifr.style.width = v + 'px'; ifr.style.height = (h / k) + 'px'; ifr.style.transform = 'scale(' + k + ')';
    };
    var setPoster = function () { var p = mode === 'cel' ? celP : mode === 'pc' ? pcP : ''; poster.hidden = !p || loaded; if (p && poster.getAttribute('src') !== p) poster.src = p; };
    var go = function (m, user) {
      if (user) { demoT.forEach(clearTimeout); demoT = []; dvMark(); }
      mode = m; dv.dataset.mode = m;
      tabs.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.d === m)); if (b.dataset.d === m && now) now.innerHTML = b.querySelector('svg').outerHTML + '<span>' + b.querySelector('span').innerHTML + '</span>'; });
      menu(false);
      $$('.pin[aria-expanded="true"]', fr).forEach(function (p) { p.click(); });
      setPoster();
      var t1 = target(m), w0 = fw || t1[0], h0 = fh || t1[1], v0 = vw, v1 = DVW[m][0], t0 = performance.now(), D = reduce ? 0 : 750;
      cancelAnimationFrame(anim);
      (function step(t) {
        var p = D ? Math.min(1, (t - t0) / D) : 1, e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        paint(w0 + (t1[0] - w0) * e, h0 + (t1[1] - h0) * e, Math.round(v0 + (v1 - v0) * e));
        if (p < 1) anim = requestAnimationFrame(step);
      })(t0);
    };
    tabs.forEach(function (b) { b.addEventListener('click', function () { buzz(8); go(b.dataset.d, true); }); });
    /* Kronox: su web o su panel */
    $$('.dv-src button', dv).forEach(function (b, i, all) {
      b.addEventListener('click', function () {
        buzz(8); dvMark(); all.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        src = b.dataset.src; pcP = b.dataset.pc; celP = b.dataset.cel; ifr.title = b.dataset.title;
        dv.classList.toggle('dv-nopins', b !== all[all.length - 1]);
        loaded = false; fr.classList.remove('ok'); setPoster(); load();
      });
    });
    var load = function () { if (ifr.dataset.u === src) return; ifr.dataset.u = src; loaded = false; fr.classList.remove('ok'); ifr.src = src; };
    ifr.addEventListener('load', function () { if (!ifr.getAttribute('src') || ifr.src === 'about:blank') return; loaded = true; fr.classList.add('ok'); setPoster(); if (dv._wantDemo && vis) { dv._wantDemo = false; setTimeout(demo, 400); } });
    var unload = function () { if (!ifr.dataset.u) return; ifr.dataset.u = ''; ifr.removeAttribute('src'); loaded = false; fr.classList.remove('ok'); setPoster(); };
    /* la primera vez, el visor se enseña solo una vez: tablet, celular y vuelta */
    var demo = function () {
      if (dvDemoDone || dvSeen || reduce) return;
      if (!loaded) { dv._wantDemo = true; return; }
      dvDemoDone = true;
      var seq = mode === 'cel' ? ['tab', 'pc', 'cel'] : ['tab', 'cel', mode];
      seq.forEach(function (m, i) { demoT.push(setTimeout(function () { if (vis) go(m); }, 900 + i * 1700)); });
      demoT.push(setTimeout(dvMark, 900 + seq.length * 1700));
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) load(); else unload(); }); }, { rootMargin: '60% 0px' }).observe(stg);
      new IntersectionObserver(function (es) { es.forEach(function (e) { vis = e.isIntersecting; if (e.intersectionRatio >= .6) demo(); }); }, { threshold: [0, .6] }).observe(stg);
    } else load();
    /* detalles: al pasar por una nota, se ilumina esa parte de la web (la busca dentro de la web real) */
    var notes = $$('.dv-notes li', dv), hl = null;
    var spot = function (li) {
      notes.forEach(function (o) { o.classList.toggle('on', o === li); });
      if (!hl) { hl = document.createElement('span'); hl.className = 'dv-hl'; fr.appendChild(hl); }
      var el = null; try { el = li && loaded && ifr.contentDocument && ifr.contentDocument.querySelector(li.dataset.sel); } catch (e) {}
      var r = el && el.getBoundingClientRect(), k = fw / vw, p = 6;
      if (!r || !r.width || !r.height) { hl.classList.remove('on'); return; }
      hl.style.left = (r.left * k - p) + 'px'; hl.style.top = (r.top * k - p) + 'px';
      hl.style.width = (r.width * k + p * 2) + 'px'; hl.style.height = (r.height * k + p * 2) + 'px';
      hl.classList.add('on');
    };
    notes.forEach(function (li) {
      li.addEventListener('mouseenter', function () { spot(li); });
      li.addEventListener('focus', function () { spot(li); });
      li.addEventListener('click', function () { spot(li); });
      li.addEventListener('mouseleave', function () { spot(null); });
      li.addEventListener('blur', function () { spot(null); });
    });
    var t = target(mode); setPoster(); paint(t[0], t[1], vw);
    tabs.forEach(function (b) { if (b.dataset.d === mode && now) now.innerHTML = b.querySelector('svg').outerHTML + '<span>' + b.querySelector('span').innerHTML + '</span>'; });
    addEventListener('resize', function () { cancelAnimationFrame(anim); var t = target(mode); paint(t[0], t[1], DVW[mode][0]); });
  });

  /* ======================= Entre Amigos: el camino paso a paso ======================= */
  var ea = $('.ea-route');
  if (ea) {
    var eaOl = $('ol', ea), eaLis = $$('li', eaOl), eaScr = $$('.ea-scr'), eaBox = $('.ea-box', ea);
    if (eaBox) {
      var bx = eaBox.getContext('2d'), BOX = ["..........",".kkkkkkkk.",".kccccccck",".kcCCCCcck",".kccccccck",".kkkkkkkkk",".kccccccck",".kccttccck",".kccccccck",".kkkkkkkk."];
      var BP = { k: '#5a3b22', c: '#c8935a', C: '#e8b77a', t: '#FFD23F' };
      BOX.forEach(function (row, y) { for (var i = 0; i < 10; i++) { var k = row[i]; if (BP[k]) { bx.fillStyle = BP[k]; bx.fillRect(i, y, 1, 1); } } });
    }
    var eaStep = -1;
    var eaScroll = function () {
      var r = eaOl.getBoundingClientRect(), mark = innerHeight * .55;
      var p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
      eaOl.style.setProperty('--p', p.toFixed(3));
      if (eaBox) eaBox.style.setProperty('--by', (eaOl.offsetTop + p * (eaOl.offsetHeight - 20)) + 'px');
      var step = 0;
      eaLis.forEach(function (li, i) { var on = li.getBoundingClientRect().top < mark; li.classList.toggle('on', on); if (on) step = i + 1; });
      if (step !== eaStep) { eaStep = step; eaScr.forEach(function (im) { im.classList.toggle('on', +im.dataset.step === step); }); }
    };
    addEventListener('scroll', function () { requestAnimationFrame(eaScroll); }, { passive: true });
    addEventListener('resize', eaScroll); eaScroll();
  }


  /* ======================= mis webs: cartuchos y una tele ======================= */
  var cs = $('.cs');
  if (cs) {
    var carts = $$('.cart', cs), tvV = $$('.tv-v', cs), csP = $$('.cs-p', cs), tvUrl = $('#tvUrl'), tvUrls = tvUrl.dataset.urls.split('|');
    var tvScr = $('#tvScr'), tvCart = $('#tvCart'), tvOsd = $('#tvOsd'), csCur = -1, csVis = false, csTy = null;
    var CSE = ['nails', 'kronoxweb', 'nacar', 'amigos'], CSN = ['NAILS', 'KRONOX', 'NÁCAR', 'AMIGOS'];
    $$('.bw-ic', cs).forEach(function (c) { drawIcon(c.getContext('2d'), c.dataset.icon, 1, 0, 1); });
    /* la ficha se escribe letra por letra */
    var csType = function (p) {
      clearInterval(csTy); var els = $$('dd', p);
      els.forEach(function (el) { if (!el.dataset.t) el.dataset.t = el.textContent; el.textContent = reduce ? el.dataset.t : ''; });
      if (reduce) return; var e = 0, ch = 0;
      csTy = setInterval(function () { var el = els[e]; if (!el) { clearInterval(csTy); return; } ch = Math.min(el.dataset.t.length, ch + 2); el.textContent = el.dataset.t.slice(0, ch); if (ch >= el.dataset.t.length) { e++; ch = 0; } }, 16);
    };
    var csPlay = function () { var v = $('video', tvV[csCur]); if (!v) return; if (csVis) { load(v); if (!reduce) { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } } else v.pause(); };
    var csShow = function (i) {
      tvV.forEach(function (v, k) { v.classList.toggle('on', k === i); var vid = $('video', v); if (k !== i && !vid.paused) vid.pause(); if (k === i && vid.dataset.poster) { vid.poster = vid.dataset.poster; vid.removeAttribute('data-poster'); } });
      csPlay(); if (window.lvRefresh) setTimeout(lvRefresh, 60);
    };
    var csSet = function (i, anim) {
      if (i === csCur) return; var first = csCur < 0; csCur = i;
      carts.forEach(function (c, k) { c.classList.toggle('on', k === i); c.setAttribute('aria-selected', String(k === i)); c.tabIndex = k === i ? 0 : -1; });
      csP.forEach(function (p, k) { p.classList.toggle('on', k === i); }); csType(csP[i]);
      tvUrl.textContent = tvUrls[i]; cs.classList.remove('nav'); $('#tvNav').textContent = 'Navegar aquí';
      tvCart.style.setProperty('--c', carts[i].style.getPropertyValue('--c')); tvCart.style.setProperty('--a', carts[i].style.getPropertyValue('--a'));
      tvOsd.textContent = 'CH 0' + (i + 1) + ' · ' + CSN[i];
      if (first || !anim || reduce) { csShow(i); return; }
      /* el cartucho vuela a la consola, entra y la tele se enciende con estática */
      var from = $('.cart-b', carts[i]).getBoundingClientRect(), to = tvCart.getBoundingClientRect(), fly = $('.cart-b', carts[i]).cloneNode(true);
      fly.className = 'cart-b cart-fly'; fly.style.cssText = 'left:' + from.left + 'px;top:' + from.top + 'px;width:' + from.width + 'px;height:' + from.height + 'px;--c:' + carts[i].style.getPropertyValue('--c') + ';--a:' + carts[i].style.getPropertyValue('--a');
      document.body.appendChild(fly); buzz(10);
      var dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top - from.top, k = to.width / from.width;
      fly.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + dx + 'px,' + (dy - 60) + 'px) scale(' + k + ')', offset: .7 }, { transform: 'translate(' + dx + 'px,' + (dy + to.height * .2) + 'px) scale(' + k + ')' }], { duration: 520, easing: 'steps(8)' }).onfinish = function () {
        fly.remove(); cs.classList.remove('ins'); void cs.offsetWidth; cs.classList.add('ins'); buzz([6, 30, 6]);
        tvScr.classList.add('st'); setTimeout(function () { csShow(i); }, 180); setTimeout(function () { tvScr.classList.remove('st'); }, 420);
      };
    };
    carts.forEach(function (c, i) {
      c.addEventListener('click', function () { csSet(i, true); });
      c.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        e.preventDefault(); var n = (i + d + carts.length) % carts.length; carts[n].focus(); csSet(n, true);
      });
    });
    new IntersectionObserver(function (es) { csVis = es[0].isIntersecting; if (csCur >= 0) csPlay(); }, { rootMargin: '100px 0px' }).observe(cs);
    $('#tvNav').addEventListener('click', function () {
      var f = $('iframe.lv', tvV[csCur]);
      if (!f || !f.classList.contains('ok')) { openEnter(CSE[csCur]); return; }
      var on = cs.classList.toggle('nav'); this.textContent = on ? 'Dejar de navegar' : 'Navegar aquí'; buzz(8);
    });
    $('#tvFull').addEventListener('click', function () { openEnter(CSE[csCur]); });
    csSet(0);
  }

  /* ======================= WordPress: lo rellenas aquí, sale aquí ======================= */
  var wpx = $('.wpx');
  if (wpx) {
    var WPV = {
      qs: { img: 'img/wp/robotika-qs.webp', h: 1918, url: 'robotika.local/quienes-somos', t: 'Editar página: Quiénes somos', on: 'Páginas', menu: ['Robots', 'Equipo'],
        g: [['Bloques de contenido · se repiten', [['titulo', 'Título', 'Nuestra historia', [4.69, 19.74, 42.97, 2.29]], ['texto', 'Texto', 'RobotiKa nació en 2018 en un pequeño garaje de Madrid…', [4.69, 19.74, 42.97, 13.48]], ['imagen', 'Imagen', '', [52.34, 18.64, 42.97, 15.67]], ['invertido', 'Imagen a la izquierda', 'sí', [4.69, 37.9, 90.63, 15.67]]]],
          ['Equipo · tipo de contenido propio', [['nombre', 'Nombre', 'Carlos Ruiz', [6.25, 94.29, 17.77, 1.2]], ['cargo', 'Cargo', 'CEO y Cofundador', [10.39, 95.94, 9.5, .67]], ['foto', 'Foto', '', [10.45, 88.02, 9.38, 5.37]]]]] },
      ct: { img: 'img/wp/robotika-ct.webp', h: 1212, url: 'robotika.local/contacto', t: 'Editar página: Contacto', on: 'Páginas', menu: ['Robots', 'Equipo'],
        g: [['Datos de contacto', [['dir', 'Dirección', 'Calle de la Innovación 42, Madrid', [4.69, 43.07, 42.97, 3.66]], ['tel', 'Teléfono y horario', '+34 912 345 678', [4.69, 48.5, 42.97, 5.38]], ['mail', 'Correos', 'hola@robotika.es', [4.69, 55.66, 42.97, 5.38]], ['hor', 'Horario de visitas', 'Martes y jueves, 10:00 a 14:00', [4.69, 62.81, 42.97, 5.38]], ['map', 'Mapa (Google Maps)', 'google.com/maps/embed…', [4.69, 71.03, 42.97, 21.88]], ['cf7', 'Formulario (Contact Form 7)', 'ID del formulario', [52.34, 30.18, 42.97, 62.73]]]]] },
      nf: { img: 'img/wp/nerflis.webp', h: 536, url: 'nerflis.local/pelicula/spider-man', t: 'Editar película', on: 'Películas', menu: ['Películas'],
        g: [['Película · tipo de contenido propio', [['tit', 'Título', 'Spider-Man: Cruzando el Multiverso', [20.25, 20.51, 28.92, 11.11]], ['dir', 'Director', 'Joaquim Dos Santos', [20.25, 37.61, 8.92, 4.79]], ['act', 'Actores principales', 'Shameik Moore, Hailee Steinfeld…', [20.25, 44.44, 34.75, 7.86]], ['ano', 'Año', '2023', [20.25, 53.85, 3.92, 5.64]], ['sin', 'Sinopsis', 'Miles Morales se une a Gwen Stacy…', [20.25, 60.68, 33.92, 9.91]], ['pos', 'Imagen destacada (póster)', '', [2.75, 25.3, 15.25, 46.84]]]]] }
    };
    var wpxPg = $('#wpxPg'), wpxImg = $('#wpxImg'), wpxHl = $('#wpxHl'), wpxF = $('#wpxF'), wpxVp = $('.wpx-vp', wpx), wpxCur = null, wpxAuto = null, wpxTouched = false, wpxIn = false;
    var wpxShow = function (b) {
      $$('.wpx-fld', wpxF).forEach(function (x) { x.classList.toggle('on', x === b); });
      var r = JSON.parse(b.dataset.hs), pw = wpxVp.clientWidth, ph = pw * WPV[wpxCur].h / 1100, vh = wpxVp.clientHeight;
      wpxHl.style.cssText = 'left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%';
      $('b', wpxHl).textContent = $('.wpx-l', b).textContent; wpxHl.classList.remove('go'); void wpxHl.offsetWidth; wpxHl.classList.add('go');
      var cy = (r[1] + r[3] / 2) / 100 * ph, y = Math.max(0, Math.min(ph - vh, cy - vh / 2));
      wpxPg.style.transform = 'translateY(' + (-y) + 'px)';
    };
    var wpxSet = function (k) {
      wpxCur = k; var v = WPV[k];
      $$('.wpx-tabs button', wpx).forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.v === k)); });
      wpxImg.src = v.img; wpxImg.height = v.h; $('#wpxUrl').textContent = v.url; $('#wpxT').textContent = v.t;
      wpxPg.style.transform = ''; wpxHl.style.cssText = 'opacity:0';
      wpxVp.style.aspectRatio = v.h / 1100 < .69 ? '1100 / ' + v.h : '';
      $('#wpxSide').innerHTML = ['Escritorio', 'Entradas', 'Medios', 'Páginas'].concat(v.menu).concat(['Apariencia', 'Plugins', 'Ajustes']).map(function (m) { return '<span' + (m === v.on ? ' class="on"' : '') + (v.menu.indexOf(m) >= 0 ? ' data-new' : '') + '>' + m + '</span>'; }).join('');
      wpxF.innerHTML = v.g.map(function (g) { return '<fieldset><legend>' + g[0] + '</legend>' + g[1].map(function (f) {
        var val = f[2] === 'sí' ? '<i class="wpx-sw" aria-hidden="true"></i>' : f[2] ? '<span class="wpx-in">' + f[2] + '</span>' : '<span class="wpx-img" aria-hidden="true"></span>';
        return '<button type="button" class="wpx-fld" data-hs="' + JSON.stringify(f[3]) + '"><span class="wpx-l">' + f[1] + '</span>' + val + '</button>'; }).join('') + '</fieldset>'; }).join('');
      $$('.wpx-fld', wpxF).forEach(function (b) {
        var go = function () { wpxTouched = true; clearInterval(wpxAuto); wpxShow(b); };
        b.addEventListener('mouseenter', go); b.addEventListener('focus', go); b.addEventListener('click', go);
      });
    };
    $$('.wpx-tabs button', wpx).forEach(function (t) { t.addEventListener('click', function () { buzz(6); wpxSet(t.dataset.v); wpxStart(); }); });
    /* mientras nadie toca nada, se enseña solo campo por campo */
    var wpxStart = function () {
      clearInterval(wpxAuto); if (wpxTouched || reduce || !wpxIn) return; var i = 0;
      var step = function () { var fs = $$('.wpx-fld', wpxF); if (!fs.length) return; wpxShow(fs[i % fs.length]); i++; };
      step(); wpxAuto = setInterval(step, 2400);
    };
    new IntersectionObserver(function (es) { wpxIn = es[0].isIntersecting; if (wpxIn) wpxStart(); else clearInterval(wpxAuto); }, { threshold: .35 }).observe(wpx);
    wpxSet('qs');
  }

  /* ======================= hoja que sube desde abajo ======================= */
  var sheet = $('#sheet'), sheetP = sheet && $('.sheet-p', sheet), sheetOpener = null;
  function openSheet(title, node) {
    if (!sheet) return;
    sheetOpener = document.activeElement;
    $('#sheetT').textContent = title; var c = $('#sheetC'); c.innerHTML = ''; c.appendChild(node);
    sheet.hidden = false; void sheet.offsetWidth; sheet.classList.add('open'); document.body.style.overflow = 'hidden';
    $('.sheet-x', sheet).focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('open'); sheetP.style.removeProperty('--dy'); document.body.style.overflow = '';
    setTimeout(function () { sheet.hidden = true; }, 380);
    if (sheetOpener && sheetOpener.focus) sheetOpener.focus({ preventScroll: true });
  }
  if (sheet) {
    $$('[data-close]', sheet).forEach(function (b) { b.addEventListener('click', closeSheet); });
    var dy0 = null, h = $('.sheet-h', sheet);
    h.addEventListener('pointerdown', function (e) { dy0 = e.clientY; sheet.classList.add('drag'); h.setPointerCapture(e.pointerId); });
    h.addEventListener('pointermove', function (e) { if (dy0 === null) return; sheetP.style.setProperty('--dy', Math.max(0, e.clientY - dy0) + 'px'); });
    h.addEventListener('pointerup', function (e) { if (dy0 === null) return; var d = e.clientY - dy0; dy0 = null; sheet.classList.remove('drag'); if (d > 90) closeSheet(); else sheetP.style.setProperty('--dy', '0px'); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  }




  /* ======================= el Paulagotchi reacciona a lo que haces ======================= */
  if (g.cv) {
    var napT = null, ended = false;
    var wake = function () {
      clearTimeout(napT);
      if (g.nap) { g.nap = false; g.mood = 'happy'; g.jump = 18; if (g.status) g.status.textContent = '¡volviste!'; toastMsg('¡Volviste! El Paulagotchi se había dormido esperándote'); }
      napT = setTimeout(function () { if (document.hidden) return; g.nap = true; if (g.status) g.status.textContent = 'me dormí esperando… zzz'; }, 40000);
    };
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) { addEventListener(ev, wake, { passive: true }); });
    addEventListener('scroll', function () { if (!g.nap) { clearTimeout(napT); napT = setTimeout(function () { g.nap = true; if (g.status) g.status.textContent = 'me dormí esperando… zzz'; }, 40000); } }, { passive: true });
    wake();
    /* si llegas al final, celebra */
    var ft = $('#contacto');
    if (ft) new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && window.PG) PG.ev('end');
      if (es[0].isIntersecting && !ended) { ended = true; g.mood = 'happy'; g.jump = 30; buzz([15, 40, 15]); toastMsg('¡Llegaste al final! El Paulagotchi está orgulloso :)'); }
    }, { threshold: .6 }).observe(ft);
  }


  /* ======================= 3 cosas de mí: escenas en pixel ======================= */
  var MINI = { a: ["...HHHHHH...","..HHHHHHHH..","..HssssssH..","..yseSSesy..","..yssllssy..","..yyssssyy..","..tttttttt..",".stfttgtfts.",".sttttttttS.","..tttttttt..","..LLLLLLLL..","..LLL..LLL..","..ss....ss..","..ss....ss..",".KKK....KKK."],
    b: ["...HHHHHH...","..HHHHHHHH..","..HssssssH..","..yseSSesy..","..yssllssy..","..yyssssyy..","..tttttttt..",".stfttgtfts.",".sttttttttS.","..tttttttt..","..LLLLLLLL..","...LLLLLL...","...ss..ss...","....ss.ss...","...KKKKKK..."] };
  var MP = { H: '#34221c', s: '#d69670', S: '#b87a5a', e: '#1e1212', l: '#aa3a54', y: '#deb67c', t: '#28201e', f: '#d67482', g: '#d4aa54', L: '#705c62', K: '#3a2e32' };
  var mini2 = function (x, ctx, ox, oy, fr, flip) { var m = MINI[fr]; m.forEach(function (r, y) { for (var i = 0; i < 12; i++) { var k = r[flip ? 11 - i : i]; if (MP[k]) { x.fillStyle = MP[k]; x.fillRect(ox + i, oy + y, 1, 1); } } }); };
  var px = function (x, c, a, b, w, h) { x.fillStyle = c; x.fillRect(a, b, w || 1, h || 1); };
  var SCN = {
    grass: function (x, t) {
      var cyc = t % 3600, gx = 31;
      px(x, '#9aa07f', 0, 26, 48, 1);
      for (var i = 0; i < 16; i++) { px(x, i % 3 ? '#5f8a3a' : '#7db04a', gx + i, 23 + (i % 2), 1, 3 - (i % 2)); }
      var px0, py = 11, fr = Math.floor(t / 160) % 2 ? 'a' : 'b';
      if (cyc < 1800) px0 = 1 + Math.floor(cyc / 1800 * 19);
      else if (cyc < 2300) { px0 = 20; fr = 'a'; px(x, '#c0392b', 25, 2, 2, 5); px(x, '#c0392b', 25, 8, 2, 1); px(x, '#5aa0d6', 19, 9, 1, 2); }
      else { var k = (cyc - 2300) / 1300; px0 = 20 - Math.floor(k * 19); py = 11 - Math.round(Math.sin(Math.min(1, k * 2.4) * Math.PI) * 5); }
      mini2(x, x, px0, py, fr, cyc >= 2300);
    },
    lemon: function (x, t) {
      var cyc = t % 4000, bites = Math.min(3, Math.floor(cyc / 900));
      px(x, '#9aa07f', 0, 26, 48, 1);
      mini2(x, x, 9, 11 - (Math.floor(t / 400) % 2), 'a');
      for (var r = 0; r < 6; r++) px(x, r % 2 ? '#c99a5b' : '#b5833f', 23 + (r >> 1), 17 + r, Math.max(1, 5 - r), 1);
      var sc = 3 - bites;
      if (cyc > 3400) { if (Math.floor(t / 120) % 2) { px(x, '#f6ef7a', 22, 11, 7, 6); px(x, '#e3d43f', 22, 16, 7, 1); px(x, '#fffbd0', 23, 12, 2, 1); } }
      else if (sc > 0) { px(x, '#f6ef7a', 22, 17 - sc * 2, 7, sc * 2); px(x, '#fffbd0', 23, 17 - sc * 2, 2, 1); px(x, '#e3d43f', 22, 16, 7, 1); }
      var hb = Math.floor(t / 500) % 2;
      px(x, '#e68082', 35, 6 - hb, 2, 2); px(x, '#e68082', 38, 6 - hb, 2, 2); px(x, '#e68082', 35, 8 - hb, 5, 2); px(x, '#e68082', 36, 10 - hb, 3, 1); px(x, '#e68082', 37, 11 - hb, 1, 1);
    },
    music: function (x, t) {
      var b = Math.floor(t / 300) % 2;
      px(x, '#9aa07f', 0, 26, 48, 1);
      mini2(x, x, 18, 11 + b, b ? 'a' : 'b');
      px(x, '#eba9bd', 19, 10 + b, 10, 1); px(x, '#eba9bd', 18, 12 + b, 2, 3); px(x, '#eba9bd', 28, 12 + b, 2, 3);
      var cols = ['#aa3a54', '#3a2e32', '#d4aa54', '#5aa0d6'];
      for (var n = 0; n < 4; n++) {
        var p = ((t / 1600) + n / 4) % 1, nx = [4, 37, 9, 42][n], ny = 24 - Math.floor(p * 20);
        if (p < .9) { px(x, cols[n], nx, ny, 2, 2); px(x, cols[n], nx + 1, ny - 4, 1, 4); px(x, cols[n], nx + 2, ny - 4, 2, 1); }
      }
    }
  };
  var lcds = $$('canvas.lcd'), lcdOn = [];
  if (lcds.length) {
    var lio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target._on = e.isIntersecting; }); }, { rootMargin: '100px 0px' });
    lcds.forEach(function (c) { lio.observe(c); c._x = c.getContext('2d'); });
    var lcdT = 0;
    (function lcdLoop(t) {
      if (t - lcdT > 90) { lcdT = t; lcds.forEach(function (c) { if (!c._on && c._done) return; c._done = 1; c._x.clearRect(0, 0, 48, 28); SCN[c.dataset.scene](c._x, reduce ? 0 : t); }); }
      if (!reduce) requestAnimationFrame(lcdLoop);
    })(0);
  }

  /* ======================= tu Spotify sin sentido ======================= */
  var mp = $('#mp');
  if (mp) {
    var SONGS = [['Pink Matter', 'Frank Ocean'], ['Orgullo', 'El Barrio'], ['Eres más', 'Guaco'], ['Neo Romeo', 'Rusowsky']], si = 0, mpT0 = 0, mpOn = false;
    var list = $('#mpList');
    SONGS.forEach(function (s2, k) { var li = document.createElement('li'); li.textContent = s2[0] + (s2[1] ? ' · ' + s2[1] : ''); li.addEventListener('click', function () { playSong(k); }); list.appendChild(li); });
    var playSong = function (k) {
      si = (k + SONGS.length) % SONGS.length; var s2 = SONGS[si];
      $('#mpT').textContent = s2[0]; $('#mpA').textContent = s2[1];
      $('#mpGo').href = 'https://open.spotify.com/search/' + encodeURIComponent(s2[0] + (s2[1] ? ' ' + s2[1] : ''));
      $$('li', list).forEach(function (l, n) { l.classList.toggle('on', n === si); });
      mpT0 = performance.now();
    };
    $('#mpPrev').addEventListener('click', function () { buzz(6); playSong(si - 1); });
    $('#mpNext').addEventListener('click', function () { buzz(6); playSong(si + 1); if (window.PG) PG.ev('music'); });
    playSong(0);
    new IntersectionObserver(function (es) { mpOn = es[0].isIntersecting; }).observe(mp);
    (function tickMp(t) {
      if (mpOn && !reduce) { var p = Math.min(1, (t - mpT0) / 9000); $('#mpBar').style.width = (p * 100) + '%'; if (p >= 1) playSong(si + 1); }
      else mpT0 = t - (parseFloat($('#mpBar').style.width) || 0) * 90;
      requestAnimationFrame(tickMp);
    })(performance.now());
  }



  /* ======================= webs en vivo (cargadas solo cuando se miran) ======================= */
  var lvs = $$('iframe.lv'), lvMax = small.matches ? 1 : 2, lvOn = [];
  var lvVideo = function (f) { return $('video', f.parentNode); };
  var lvFit = function (f) {
    var v = lvVideo(f), W = +f.dataset.w; if (!v) return;
    var w = v.offsetWidth, h = v.offsetHeight; if (!w || !h) return;
    var k = w / W, op = f.offsetParent || f.parentNode, r = v.getBoundingClientRect(), pr = op.getBoundingClientRect(); f.style.left = (r.left - pr.left - op.clientLeft) + 'px'; f.style.top = (r.top - pr.top - op.clientTop) + 'px';
    f.style.width = f.style.minWidth = f.style.maxWidth = W + 'px'; f.style.height = (h / k) + 'px'; f.style.transform = 'scale(' + k + ')'; f.setAttribute('scrolling', 'no');
    f.style.borderRadius = (parseFloat(getComputedStyle(v).borderTopLeftRadius) / k) + 'px';
  };
  var lvShown = function (f) { var bv = f.closest('.bw-v,.tv-v'); return !bv || bv.classList.contains('on'); };
  var lvUnload = function (f) { f.classList.remove('ok'); f.removeAttribute('src'); f._t = 0; lvOn = lvOn.filter(function (x) { return x !== f; }); var v = lvVideo(f); if (v && v.src && !reduce && f._vis) { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } };
  var lvLoad = function (f) {
    if (f.getAttribute('src') || !lvShown(f)) return;
    while (lvOn.length >= lvMax) lvUnload(lvOn[0]);
    lvFit(f); f.onload = function () { if (!f.getAttribute('src')) return; f.classList.add('ok'); var v = lvVideo(f); if (v) v.pause(); };
    f.src = f.dataset.live; lvOn.push(f);
  };
  if (lvs.length && 'IntersectionObserver' in window) {
    var lvIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var f = e.target._lv; f._vis = e.isIntersecting && e.intersectionRatio >= .35;
        clearTimeout(f._t);
        if (f._vis) f._t = setTimeout(function () { if (f._vis) lvLoad(f); }, 500);
        else if (!e.isIntersecting && f.getAttribute('src')) lvUnload(f);
      });
    }, { threshold: [0, .35] });
    lvs.forEach(function (f) { var box = f.parentNode; box._lv = f; lvIO.observe(box); });
    addEventListener('resize', function () { lvOn.forEach(lvFit); });
    window.lvRefresh = function () { lvs.forEach(function (f) { if (!lvShown(f) && f.getAttribute('src')) lvUnload(f); else if (f._vis && lvShown(f)) lvLoad(f); }); };
  }

  /* ======================= celular: proyectos a pantalla completa ======================= */
  var reels = $('#reels');
  function goTo(id) {
    var onReels = reels && reels.offsetParent !== null, t = null;
    if (onReels) { if (id === 'proyectos') t = reels; else if ($('#r-' + id)) t = $('#r-' + id); }
    t = t || $('#' + id); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  if (reels) {
    $$('[data-more]', reels).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.more, src = $('#' + k + ' .pj-in'); if (!src) return;
        var cl = src.cloneNode(true); cl.removeAttribute('id');
        $$('video,iframe,.pins', cl).forEach(function (x) { x.remove(); });
        $$('[id]', cl).forEach(function (x) { x.removeAttribute('id'); });
        $$('canvas[data-px]', cl).forEach(function (c) { drawPx(c, c.dataset.px); });
        buzz(8); openSheet($('.reel-h', b.closest('.reel')).textContent, cl);
      });
    });
    /* mantener presionado: la web en grande */
    var peek = $('#peek'), pv = $('video', peek), pt = null;
    $$('.reel-ph', reels).forEach(function (f) {
      var v = $('video', f);
      var close = function () { clearTimeout(pt); f.classList.remove('press'); if (peek.classList.contains('on')) { peek.classList.remove('on'); setTimeout(function () { pv.pause(); }, 200); } };
      f.addEventListener('touchstart', function () {
        f.classList.add('press');
        pt = setTimeout(function () {
          load(v); if (pv.getAttribute('src') !== v.src) pv.src = v.src;
          try { pv.currentTime = v.currentTime || 0; } catch (e) {}
          var pp = pv.play(); if (pp && pp.catch) pp.catch(function () {});
          peek.classList.add('on'); buzz(12); if (window.PG) PG.ev('desk');
        }, 280);
      }, { passive: true });
      ['touchend', 'touchcancel', 'touchmove'].forEach(function (ev) { f.addEventListener(ev, close, { passive: true }); });
      f.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });
  }

  /* ======================= el Paulagotchi te habla ======================= */
  var SAY = {
    top: '¡Hola! Soy Paula, en pixel.', proyectos: 'Desliza: cada web es una pantalla.', nails: 'Mely tiene un simulador de manicura. Pruébalo.',
    kronox: 'Él cambia su web solo, sin llamarme.', nacar: 'Seis idiomas. Sí, seis.', amigos: 'Esta la hice en una semana.',
    creativos: 'Mis favoritos, la verdad.', figma: 'Aquí todavía no hay código.', marcas: 'Toca las fichas y dales la vuelta.',
    sobre: 'Por favor, no me hagas caminar por el césped.', herramientas: 'Figma para diseñar, código para que funcione.', contacto: '¡Escríbeme!'
  };
  var say = $('#gSay'), sayT = null;
  function sayHi() {
    if (!say) { openGame(); return; }
    var k = window.curSec || 'top';
    $('#gSayT').textContent = SAY[k] || SAY.top;
    say.hidden = false; g.mood = 'happy'; g.jump = 14; buzz(8);
    clearTimeout(sayT); sayT = setTimeout(function () { say.hidden = true; }, 5000);
  }
  /* aparecen solos al llegar a cada sección (una vez por sección) */
  var said = {}, lastSay = 0, autoT = null;
  window.autoSay = function () {
    var k = window.curSec; if (!say || !k || said[k] || k === 'top' || !SAY[k] || !root.classList.contains('m-game')) return;
    clearTimeout(autoT);
    autoT = setTimeout(function () {
      if (window.curSec !== k || said[k]) return;
      var busy = !game.hidden || (sheet && !sheet.hidden) || (ent && !ent.hidden) || (desk && !desk.hidden) || !mini.el.classList.contains('show');
      if (busy || Date.now() - lastSay < 6000) return;
      said[k] = 1; lastSay = Date.now();
      $('#gSayT').textContent = SAY[k]; say.hidden = false; say._t = Date.now() + 1500; g.mood = 'happy'; g.jump = 12;
      clearTimeout(sayT); sayT = setTimeout(function () { say.hidden = true; }, 4500);
    }, 900);
  };
  if (say) {
    $('#gSayPlay').addEventListener('click', function () { say.hidden = true; openGame(); });
    new MutationObserver(function () { if (!say.hidden) say._t = Date.now(); }).observe(say, { attributes: true, attributeFilter: ['hidden'] });
  }

  /* ======================= retos y "entrar en la web" ======================= */
  var ENTER = {
    nails: { n: 'Nails by MelyG', u: 'https://nailsbymelyg.com/?vista=portfolio', r: 'https://nailsbymelyg.com/?vista=portfolio#estudio', m: 'Toca «Diseña tu manicura» y prueba colores, formas y acabados.' },
    kronoxweb: { n: 'Kronox', u: 'https://kronoxprod.netlify.app/' },
    kronox: { n: 'el panel de Kronox', u: 'demos/kronox-panel.html', m: 'En «Vídeos», usa las flechas para cambiar el orden de sus videoclips.' },
    nacar: { n: 'Nácar Estilismo', u: 'demos/nacar.html', m: 'Abre una prenda, añádela a la cesta y mira cómo se abre a un lado.' },
    jairo: { n: 'la web de Jairo Azogue', u: 'https://jairoazogue.com/', m: 'Mira cómo ordené su trabajo por tipo de pieza y abre el que más te guste.' },
    cata: { n: 'la web de Catalina Silva', u: 'https://catalinasilva.netlify.app/', m: 'Recorre su web como lo haría un estudio de 3D que busca a alguien en prácticas.' },
    amigos: { n: 'Entre Amigos por Venezuela', u: 'demos/entre-amigos.html', m: 'Ve a «Necesidades» y publica una. Si un local cercano la tiene, sale el match.' }
  };
  var RETOS = ['nails', 'kronox', 'nacar', 'amigos'], done = {};
  try { done = JSON.parse(localStorage.getItem('retos') || '{}'); } catch (e) {}
  var retoPaint = function () {
    var n = RETOS.filter(function (k) { return done[k]; }).length;
    $$('.reto').forEach(function (r) {
      r.classList.toggle('done', !!done[r.dataset.reto]);
      $$('.reto-bar i', r).forEach(function (i, k) { i.classList.toggle('f', k < n); });
      $('.reto-cn', r).textContent = n === 4 ? '¡Las 4 webs probadas!' : 'Webs probadas: ' + n + '/4';
    });
    return n;
  };
  retoPaint();
  var ent = $('#enter'), entF = $('#enterFrame'), entLoad = $('#enterLoad'), entOpener = null, entKey = null, entReto = false;
  var entFace = $('#enterFace') && $('#enterFace').getContext('2d');
  function openEnter(k, reto) {
    var c = ENTER[k]; if (!c || !ent) return;
    entOpener = document.activeElement; entKey = k; entReto = !!reto && !!c.m;
    $('#enterName').textContent = c.n;
    var url = entReto && c.r ? c.r : c.u;
    $('#enterOut').href = url;
    $('#enterMis').hidden = !entReto; $('#enterDone').hidden = !entReto;
    if (entReto) { $('#enterRn').textContent = RETOS.indexOf(k) < 0 ? 'Misión' : 'Reto ' + (RETOS.indexOf(k) + 1) + '/4'; $('#enterMt').textContent = c.m; }
    entLoad.classList.remove('off'); egStop(); entF.onload = function () { entLoad.classList.add('off'); if (entReto) setTimeout(function () { egStart(k, c.m); }, 400); };
    entF.src = url;
    if (entFace) { entFace.clearRect(0, 0, 32, 32); drawSprite(entFace, 0, 0, 1, 'happy'); }
    ent.hidden = false; document.body.style.overflow = 'hidden'; buzz(10);
    $('#enterX').focus();
  }
  /* ======================= el Paulagotchi te guía dentro de la web ======================= */
  var egVis = function (d, q) { var e = d.querySelector(q); if (!e || !e.getClientRects().length) return false; var cs = d.defaultView.getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0; };
  var GUIDE = {
    kronox: [{ s: '#videoList button.ghost:not([disabled])', t: 'Toca una flecha ↑ para subir un videoclip.', c: 1 }],
    nacar: [
      { s: '.product-card', t: 'Toca una prenda para abrirla.', ok: function (d) { return egVis(d, '.prod-add-btn'); } },
      { s: '.prod-add-btn', t: 'Ahora pulsa «Añadir a la cesta».', ok: function (d) { return ['cartHeaderCount', 'mobileTabCartBadge'].some(function (id) { var n = d.getElementById(id); return n && !n.hidden && +n.textContent > 0; }); } },
      { s: '#cartHeaderBtn, .mobile-tab[data-mtab="cart"]', t: 'Abre la cesta: se abre a un lado, sin sacarte de la página.', c: 1 }],
    amigos: [
      { s: '.welcome-btn--necesito', t: 'Toca «Necesito ayuda».', ok: function (d) { return !egVis(d, '#welcomeScreen'); } },
      { s: '#tabNecesidades .btn-primary', t: 'Ahora «+ Publicar necesidad».', ok: function (d) { var m = d.getElementById('modalNuevaNecesidad'); return m && !m.classList.contains('hidden'); } },
      { s: '#modalNuevaNecesidad button[type=submit]', t: 'Rellena categoría, descripción, cantidad, ciudad y un PIN de 4 números. Luego «Publicar».', ok: function (d) { var m = d.getElementById('modalNuevaNecesidad'); return m && m.classList.contains('hidden'); } }]
  };
  var eg = $('#eg'), egPt = $('#egPt'), egT = null, egSteps = null, egI = 0, egDoc = null, egClicked = false, egScrolled = -1;
  var egFace = function (mood) { var c = $('#egCv').getContext('2d'); c.clearRect(0, 0, 32, 32); drawSprite(c, 0, 0, 1, mood || 'happy'); };
  var egMinT = null;
  /* el cartel se encoge solo a los pocos segundos para no tapar la web */
  var egSay = function (n, t, mood) { $('#egN').textContent = n; $('#egT').textContent = t; egFace(mood); eg.classList.remove('pop', 'min'); void eg.offsetWidth; eg.classList.add('pop'); clearTimeout(egMinT); egMinT = setTimeout(function () { if (egT) eg.classList.add('min'); }, 4500); };
  var egStop = function () { clearInterval(egT); egT = null; egSteps = null; egPt.hidden = true; eg.hidden = true; };
  var egStep = function () {
    var st = egSteps[egI]; egClicked = false; egScrolled = -1;
    var real = egSteps.filter(function (x) { return !x.q; }), n = real.indexOf(st);
    egSay(st.q ? 'Antes de empezar' : 'Paso ' + (n + 1) + ' de ' + real.length, st.t);
  };
  var egStart = function (k, mis) {
    egStop(); eg.hidden = false; egSteps = GUIDE[k] || null; egI = 0;
    var d = null; try { d = entF.contentDocument; } catch (e) {}
    if (!egSteps || !d || !d.body) { egSteps = null; egSay('Tu misión', mis); return; }
    egDoc = d;
    /* el aviso de cookies de la demo no es parte de la misión: se acepta solo */
    var ck = d.getElementById('cookieAcceptBtn'); if (ck && ck.getClientRects().length) ck.click();
    d.addEventListener('click', function (e) { var st = egSteps && egSteps[egI]; if (st && st.c && e.target.closest && e.target.closest(st.s)) egClicked = true; }, true);
    egStep();
    egT = setInterval(function () {
      if (!egSteps) return; var st = egSteps[egI], el = null;
      try { el = [].filter.call(egDoc.querySelectorAll(st.s), function (x) { return x.getClientRects().length; })[0] || null; } catch (e) {}
      if (st.c ? egClicked : st.ok(egDoc)) {
        egI++; if (st.q && egI < egSteps.length) { egStep(); return; } buzz([8, 20, 8]);
        if (egI >= egSteps.length) { egPt.hidden = true; clearInterval(egT); egT = null; egSay('¡Misión cumplida!', '¡Eso es! Así funciona. Te devuelvo al juego…', 'happy'); setTimeout(function () { if (!ent.hidden && entReto) $('#enterDone').click(); }, 1800); return; }
        egSay('¡Bien!', '¡Eso es!', 'happy'); setTimeout(function () { if (egSteps) egStep(); }, 700); return;
      }
      if (!el || !el.getClientRects().length) { egPt.hidden = true; return; }
      var r = el.getBoundingClientRect(), fr = entF.getBoundingClientRect();
      if ((r.top < 0 || r.bottom > fr.height) && egScrolled !== egI) { egScrolled = egI; el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      var up = r.top + r.height / 2 > fr.height * .55; eg.classList.toggle('up', up); eg.style.top = up ? (fr.top + 12) + 'px' : '';
      egPt.hidden = false; egPt.style.left = (fr.left + r.left + r.width / 2) + 'px'; egPt.style.top = (fr.top + r.top) + 'px';
      egPt.style.setProperty('--w', Math.max(36, r.width + 12) + 'px'); egPt.style.setProperty('--h', Math.max(36, r.height + 12) + 'px');
    }, 200);
  };
  function closeEnter() {
    if (!ent || ent.hidden) return;
    egStop(); ent.hidden = true; entF.src = 'about:blank'; document.body.style.overflow = '';
    if (entOpener && entOpener.focus) entOpener.focus({ preventScroll: true });
  }
  if (ent) {
    document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-enter]'); if (!b) return; e.preventDefault(); closeSheet(); openEnter(b.dataset.enter, b.dataset.mode === 'reto'); });
    $('#enterX').addEventListener('click', closeEnter);
    $('#enterDone').addEventListener('click', function () {
      var k = entKey; done[k] = 1; try { localStorage.setItem('retos', JSON.stringify(done)); } catch (e) {}
      if (window.PG) PG.ev('reto', k);
      closeEnter(); var n = retoPaint(); buzz([12, 40, 12]);
      var card = $('.reto[data-reto="' + k + '"]'); if (card) { card.classList.remove('cheer'); void card.offsetWidth; card.classList.add('cheer'); }
      g.mood = 'happy'; g.jump = 24;
      if (n === 4) { if (g.status) g.status.textContent = '¡probaste todas!'; toastMsg('¡Probaste las 4 webs! El Paulagotchi está feliz :)'); }
      else toastMsg('Reto superado · ' + n + '/4 webs probadas');
    });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ent.hidden) closeEnter(); });
  }
  function toastMsg(t) { var el = $('#toast'); if (!el) return; el.textContent = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('show'); }, 2600); }

  /* ======================= iconos en pixel (9 × 9) ======================= */
  var PX9 = {
    home: ["....X....","...XXX...","..XXXXX..",".XXXXXXX.","XXXXXXXXX",".X.....X.",".X.XX..X.",".X.XX..X.",".XXXXXXX."],
    web: ["XXXXXXXXX","X.X.X...X","XXXXXXXXX","X.......X","X.XXX...X","X.......X","X.XXXXX.X","X.......X","XXXXXXXXX"],
    nail: ["...XXX...","...XXX...","..XXXXX..","..X...X..",".XXXXXXX.",".XXXXXXX.",".XXXXXXX.",".XXXXXXX.","..XXXXX.."],
    cam: [".........","XXXXXX...","X....XX.X","X.XX.XXXX","X.XX.XXXX","X....XX.X","XXXXXX...",".........","........."],
    bag: ["...XXX...","..X...X..","..X...X..","XXXXXXXXX","XXXXXXXXX","XXXXXXXXX","XXXXXXXXX","XXXXXXXXX","XXXXXXXXX"],
    heart: [".........",".XX...XX.","XXXX.XXXX","XXXXXXXXX","XXXXXXXXX",".XXXXXXX.","..XXXXX..","...XXX...","....X...."],
    film: ["XXXXXXXXX","X.X.X.X.X","XXXXXXXXX","X.......X","X.......X","X.......X","XXXXXXXXX","X.X.X.X.X","XXXXXXXXX"],
    pen: [".......XX","......XXX",".....XXX.","....XXX..","...XXX...","..XXX....",".XXX.....","XX.......","X........"],
    star: ["....X....","....X....","...XXX...","XXXXXXXXX",".XXXXXXX.","..XXXXX..","..XX.XX..",".XX...XX.","X.......X"],
    me: ["...XXX...","..XXXXX..","..XXXXX..","...XXX...",".........","..XXXXX..",".XXXXXXX.","XXXXXXXXX","XXXXXXXXX"],
    tool: ["XX.....XX","XXX...XXX",".XXX.XXX.","..XXXXX..","...XXX...","..XXXXX..",".XXX.XXX.","XXX...XXX","XX.....XX"],
    mail: ["XXXXXXXXX","XX.....XX","X.X...X.X","X..X.X..X","X...X...X","X.......X","X.......X","XXXXXXXXX","........."],
    note: ["XXXXXXX..","X.....XX.","X.XXX..X.","X......X.","X.XXXX.X.","X......X.","X.XXX..X.","X......X.","XXXXXXXX."],
    doc: [".XXXXX...",".X...XX..",".X....XX.",".X.XX..X.",".X.....X.",".X.XXX.X.",".X.....X.",".X.XXX.X.",".XXXXXXX."],
    lock: ["...XXX...","..X...X..","..X...X..",".XXXXXXX.",".XXXXXXX.",".XXX.XXX.",".XXX.XXX.",".XXXXXXX.","........."],
    cube: ["....X....","..XX.XX..","XX.....XX","X.XX.XX.X","X...X...X","X...X...X","X...X...X",".XX.X.XX.","...XXX..."],
    trash: ["...XXX...","XXXXXXXXX",".........",".XXXXXXX.",".X.X.X.X.",".X.X.X.X.",".X.X.X.X.",".X.X.X.X.","..XXXXX.."]
  };
  function drawPx(c, name, col) { var x = c.getContext('2d'), m = PX9[name]; if (!m) return; x.clearRect(0, 0, 9, 9); x.fillStyle = col || '#EBA9BD'; m.forEach(function (r, y) { for (var i = 0; i < 9; i++) if (r[i] === 'X') x.fillRect(i, y, 1, 1); }); }
  $$('canvas[data-px]').forEach(function (c) { if (PX9[c.dataset.px]) drawPx(c, c.dataset.px); });

  /* ======================= celular: la cabecera dice dónde estás ======================= */
  var here = $('#here');
  if (here) {
    var SEC = [['top', 'Inicio', 'home'], ['proyectos', 'Mis webs', 'web'], ['nails', 'Nails by MelyG', 'nail', 1], ['kronox', 'Kronox', 'cam', 1], ['nacar', 'Nácar', 'bag', 1], ['amigos', 'Entre Amigos', 'heart', 1], ['wordpress', 'WordPress', 'web'], ['creativos', 'Portfolios', 'film', 1], ['figma', 'Figma', 'pen'], ['marcas', 'Marcas', 'star'], ['sobre', 'Sobre mí', 'me'], ['herramientas', 'Herramientas', 'tool'], ['contacto', 'Escríbeme', 'mail']];
    var hereC = $('canvas', here), hereT = $('#hereT'), hereId = 'top';
    drawPx(hereC, 'home');
    window.hereMark = function (el) {
      var key = el.dataset.here || el.id, s = SEC.filter(function (x) { return x[0] === key; })[0]; if (!s || s[0] === hereId) return;
      hereId = s[0]; hereT.textContent = s[1]; drawPx(hereC, s[2]);
      here.classList.remove('pop'); void here.offsetWidth; here.classList.add('pop');
    };
    here.addEventListener('click', function () {
      buzz(8);
      var ul = document.createElement('ul'); ul.className = 'sec-list'; var n = 0;
      SEC.forEach(function (s) {
        var li = document.createElement('li'); if (s[3]) li.className = 'sub';
        var a = document.createElement('a'); a.href = '#' + s[0]; if (s[0] === hereId) a.className = 'on';
        var c = document.createElement('canvas'); c.width = 9; c.height = 9; drawPx(c, s[2]);
        var t = document.createElement('span'); t.textContent = s[1];
        var em = document.createElement('em'); em.textContent = s[3] ? '' : ('0' + (n++)).slice(-2);
        a.append(c, t, em);
        a.addEventListener('click', function (e) { e.preventDefault(); closeSheet(); setTimeout(function () { goTo(s[0]); }, 250); });
        li.appendChild(a); ul.appendChild(li);
      });
      openSheet('¿A dónde vamos?', ul);
    });
  }

  /* ======================= computadora: el cursor es tu herramienta ======================= */
  var tb = $('#toolsBar'), desk = $('#desk');
  var fine = matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
  var toast = function (html) { var t = $('#toast'); t.innerHTML = html; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 1800); };
  var copy = function (txt, html) { if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast(html); }).catch(function () { toast(html); }); else toast(html); };
  var toHex = function (c) { var m = (c || '').match(/[\d.]+/g); if (!m || (m.length > 3 && +m[3] === 0)) return null; return '#' + m.slice(0, 3).map(function (n) { return ('0' + Math.round(+n).toString(16)).slice(-2); }).join('').toUpperCase(); };
  if (tb && fine.matches) {
    var tbOpen = $('#tbOpen'), guide = $('#tbGuide'), gT = $('#tbGuideT'), gGo = $('#tbGuideGo'), gStep = 0, gDone = false;
    try { gDone = !!localStorage.getItem('tbg'); } catch (e) {}
    tbOpen.hidden = false;
    var chip = $('#toolChip'), tBox = $('#toolBox'), refBox = $('#toolRef'), lines = $('#toolLines'), cform = $('#toolCmt');
    var tool = 'move', ref = null, hov = null, pmx = 0, pmy = 0, cmtAt = null;
    /* una mini guía la primera vez: probar el cuentagotas */
    var guideEnd = function () { guide.hidden = true; gDone = true; try { localStorage.setItem('tbg', '1'); } catch (e) {} };
    var guideSay = function (t, btn) { gT.textContent = t; gGo.hidden = !btn; if (btn) gGo.textContent = btn; };
    var openTools = function () {
      tb.hidden = false; tbOpen.hidden = true; buzz(8);
      if (!gDone) { var gc = $('#tbGuideCv').getContext('2d'); gc.clearRect(0, 0, 32, 32); drawSprite(gc, 0, 0, 1, 'happy'); guide.hidden = false; gStep = 0; guideSay('Así diseño yo, en Figma. Prueba a copiar un color de esta web.', 'Probar'); }
    };
    var closeTools = function () { setTool('move'); tb.hidden = true; tbOpen.hidden = false; guide.hidden = true; };
    tbOpen.addEventListener('click', openTools);
    $('#tbX').addEventListener('click', closeTools);
    gGo.addEventListener('click', function () { if (gStep === 0) { gStep = 1; setTool('pick'); guideSay('Ahora toca cualquier parte de la web: un fondo, un botón, una foto…'); } else guideEnd(); });
    $('#tbGuideX').addEventListener('click', guideEnd);
    var setTool = function (t) {
      tool = t;
      $$('[data-tool]', tb).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.tool === t)); });
      if (t === 'move') root.removeAttribute('data-tool'); else root.dataset.tool = t;
      chip.classList.remove('show'); tBox.style.display = 'none'; lines.innerHTML = ''; if (t !== 'measure') { ref = null; refBox.style.display = 'none'; }
      cform.hidden = true;
    };
    $$('[data-tool]', tb).forEach(function (b) { b.addEventListener('click', function () { setTool(b.dataset.tool); }); });
    var safe = function (el) { return !el || el.closest('#toolsBar,#toolCmt,#desk,#sheet,#game,#mv,#enter,.toast'); };
    var place = function (el, x, y) { var w = el.offsetWidth, h = el.offsetHeight; el.style.left = Math.min(innerWidth - w - 8, x + 16) + 'px'; el.style.top = Math.min(innerHeight - h - 8, y + 18) + 'px'; };
    var outline = function (el, b) { var r = el.getBoundingClientRect(); b.style.cssText = 'display:block;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px'; return r; };
    /* el color exacto del pixel cuando es una imagen o un video de esta web */
    var cv = document.createElement('canvas'); cv.width = cv.height = 1; var pcx = cv.getContext('2d', { willReadFrequently: true });
    var posters = {}, posterImg = function (u) { if (!posters[u]) { posters[u] = new Image(); posters[u].src = u; } return posters[u]; };
    var EYE = 'EyeDropper' in window;
    var samplePx = function (el, x, y) {
      try {
        var r = el.getBoundingClientRect(), src = el;
        if (el.tagName === 'VIDEO' && !el.videoWidth && el.poster) { src = posterImg(el.poster); if (!src.naturalWidth) return null; }
        var nw = src.naturalWidth || src.videoWidth || src.width, nh = src.naturalHeight || src.videoHeight || src.height; if (!nw || !nh) return null;
        var cs = getComputedStyle(el), fit = cs.objectFit, k = fit === 'contain' ? Math.min(r.width / nw, r.height / nh) : fit === 'cover' ? Math.max(r.width / nw, r.height / nh) : r.width / nw;
        var dw = nw * k, dh = nh * k, pos = cs.objectPosition.split(' ').map(function (p) { return parseFloat(p) / 100; });
        var ox = (r.width - dw) * (isNaN(pos[0]) ? .5 : pos[0]), oy = (r.height - dh) * (isNaN(pos[1]) ? .5 : pos[1]);
        var sx = (x - r.left - ox) / k, sy = (y - r.top - oy) / k; if (sx < 0 || sy < 0 || sx >= nw || sy >= nh) return null;
        pcx.clearRect(0, 0, 1, 1); pcx.drawImage(src, sx, sy, 1, 1, 0, 0, 1, 1); var d = pcx.getImageData(0, 0, 1, 1).data;
        return d[3] ? toHex('rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')') : null;
      } catch (e) { return null; }
    };
    var bgOf = function (el) { while (el && el !== document.documentElement) { var h = toHex(getComputedStyle(el).backgroundColor); if (h) return h; el = el.parentElement; } return toHex(getComputedStyle(document.body).backgroundColor); };
    var textEl = function (el) { while (el && el !== document.body) { if (Array.prototype.some.call(el.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })) return el; el = el.parentElement; } return null; };
    var secName = function (el) { var s = el.closest('[data-frame]'); return s ? (s.dataset.frameName || s.dataset.frame) : 'la web'; };
    var measure = function (a, b) {
      var A = a.getBoundingClientRect(), B = b.getBoundingClientRect(), out = '';
      var L = function (x1, y1, x2, y2) { var v = x1 === x2, len = Math.round(v ? Math.abs(y2 - y1) : Math.abs(x2 - x1)); if (len < 1) return; out += '<i style="left:' + Math.min(x1, x2) + 'px;top:' + Math.min(y1, y2) + 'px;' + (v ? 'width:1px;height:' + len : 'height:1px;width:' + len) + 'px"></i><b style="left:' + (x1 + x2) / 2 + 'px;top:' + (y1 + y2) / 2 + 'px">' + len + '</b>'; };
      var inside = function (o, i) { return i.left >= o.left && i.right <= o.right && i.top >= o.top && i.bottom <= o.bottom; };
      if (inside(A, B) || inside(B, A)) {
        var o = inside(A, B) ? A : B, i = o === A ? B : A, cxm = i.left + i.width / 2, cym = i.top + i.height / 2;
        L(cxm, o.top, cxm, i.top); L(cxm, i.bottom, cxm, o.bottom); L(o.left, cym, i.left, cym); L(i.right, cym, o.right, cym);
      } else {
        var ym = (Math.max(A.top, B.top) + Math.min(A.bottom, B.bottom)) / 2, xm = (Math.max(A.left, B.left) + Math.min(A.right, B.right)) / 2;
        if (Math.max(A.top, B.top) > Math.min(A.bottom, B.bottom)) ym = A.top + A.height / 2;
        if (Math.max(A.left, B.left) > Math.min(A.right, B.right)) xm = A.left + A.width / 2;
        if (B.left >= A.right) L(A.right, ym, B.left, ym); else if (B.right <= A.left) L(B.right, ym, A.left, ym);
        if (B.top >= A.bottom) L(xm, A.bottom, xm, B.top); else if (B.bottom <= A.top) L(xm, B.bottom, xm, A.top);
      }
      lines.innerHTML = out;
    };
    var hover = function () {
      if (tool === 'move') return;
      var el = document.elementFromPoint(pmx, pmy); if (safe(el)) { chip.classList.remove('show'); tBox.style.display = 'none'; return; }
      hov = el;
      if (tool === 'pick') {
        var media = /^(IMG|VIDEO|CANVAS)$/.test(el.tagName), hex = media ? samplePx(el, pmx, pmy) : null, src = 'Fondo';
        chip.dataset.eye = '';
        if (el.tagName === 'IFRAME') {
          /* una web en vivo: Chrome y Edge tienen cuentagotas propio; si no, el color de su captura */
          var under = $('video', el.parentNode), uh = under ? samplePx(under, pmx, pmy) : null;
          if (EYE) { chip.dataset.eye = '1'; chip.dataset.hex = uh || ''; chip.innerHTML = (uh ? '<i style="background:' + uh + '"></i>' : '') + '<span>Web en vivo<small>clic para tomar su color exacto</small></span>'; }
          else if (uh) { chip.dataset.hex = uh; chip.innerHTML = '<i style="background:' + uh + '"></i><span>' + uh + '<small>color de la web · clic para copiar</small></span>'; }
          else { chip.dataset.hex = ''; chip.innerHTML = '<span>Web en vivo<small>pasa por otra parte para copiar un color</small></span>'; }
        } else {
          var te = textEl(el), th = te ? toHex(getComputedStyle(te).color) : null, onText = te && te === el && th;
          if (onText) { hex = th; src = 'Letra'; } else if (media && hex) src = 'Imagen'; else hex = bgOf(el);
          chip.innerHTML = '<i style="background:' + hex + '"></i><span>' + hex + '<small>' + src + ' · clic para copiar</small></span>'; chip.dataset.hex = hex; }
        chip.classList.add('show'); place(chip, pmx, pmy); tBox.style.display = 'none';
      } else if (tool === 'text') {
        var t = textEl(el); if (!t) { chip.classList.remove('show'); tBox.style.display = 'none'; return; }
        var cs = getComputedStyle(t), lh = cs.lineHeight === 'normal' ? 'normal' : Math.round(parseFloat(cs.lineHeight));
        var fam = cs.fontFamily.split(',')[0].replace(/["']/g, '');
        chip.innerHTML = '<span>' + fam + ' ' + cs.fontWeight + (cs.fontStyle === 'italic' ? ' itálica' : '') + '<small>' + Math.round(parseFloat(cs.fontSize)) + ' / ' + lh + ' px · ' + toHex(cs.color) + ' · clic para copiar</small></span>';
        chip.dataset.css = 'font: ' + (cs.fontStyle === 'italic' ? 'italic ' : '') + cs.fontWeight + ' ' + Math.round(parseFloat(cs.fontSize)) + 'px/' + (lh === 'normal' ? 'normal' : lh + 'px') + ' "' + fam + '"; color: ' + toHex(cs.color) + ';';
        chip.classList.add('show'); place(chip, pmx, pmy); outline(t, tBox); $('b', tBox).textContent = 'Texto';
      } else if (tool === 'measure') {
        var r = outline(el, tBox); $('b', tBox).textContent = Math.round(r.width) + ' × ' + Math.round(r.height);
        if (ref && ref !== el) { measure(ref, el); outline(ref, refBox); } else lines.innerHTML = '';
        chip.innerHTML = '<span>' + (ref ? 'Distancias en px' : 'Haz clic para fijar un elemento') + '<small>' + (ref ? 'Esc para soltarlo' : 'y pasa por otro para medir') + '</small></span>'; chip.classList.add('show'); place(chip, pmx, pmy);
      } else if (tool === 'comment') {
        chip.innerHTML = '<span>Clic para dejar un comentario<small>en «' + secName(el) + '»</small></span>'; chip.classList.add('show'); place(chip, pmx, pmy); tBox.style.display = 'none';
      }
    };
    var raf = 0;
    document.addEventListener('mousemove', function (e) { pmx = e.clientX; pmy = e.clientY; if (tool !== 'move' && !raf) raf = requestAnimationFrame(function () { raf = 0; hover(); }); }, { passive: true });
    addEventListener('scroll', function () { if (tool !== 'move') hover(); if (ref && tool === 'measure') outline(ref, refBox); }, { passive: true });
    document.addEventListener('click', function (e) {
      if (tool === 'move' || safe(e.target)) return;
      e.preventDefault(); e.stopPropagation();
      if (tool === 'pick' && chip.dataset.eye && EYE) {
        new window.EyeDropper().open().then(function (r) { var hx = r.sRGBHex.toUpperCase(); chip.dataset.hex = hx; copy(hx, '<i style="background:' + hx + '"></i>Copiado ' + hx); if (!guide.hidden && gStep === 1) { gStep = 2; guideSay('¡Copiado! ' + hx + ' es un color de esta web. Así reviso cada detalle. Prueba también medir o ver la letra.', 'Entendido'); } }).catch(function () {});
      } else if (tool === 'pick' && chip.dataset.hex) { copy(chip.dataset.hex, '<i style="background:' + chip.dataset.hex + '"></i>Copiado ' + chip.dataset.hex); if (!guide.hidden && gStep === 1) { gStep = 2; guideSay('¡Copiado! ' + chip.dataset.hex + ' es un color de esta web. Así reviso cada detalle. Prueba también medir o ver la letra.', 'Entendido'); } }
      else if (tool === 'text' && chip.dataset.css) copy(chip.dataset.css, 'Estilo de texto copiado');
      else if (tool === 'measure') { ref = ref === e.target ? null : e.target; if (ref) outline(ref, refBox); else { refBox.style.display = 'none'; lines.innerHTML = ''; } hover(); }
      else if (tool === 'comment') {
        cmtAt = { x: e.pageX, y: e.pageY, sec: secName(e.target), what: (textEl(e.target) || e.target).textContent.trim().slice(0, 60) };
        cform.hidden = false; place(cform, e.clientX, e.clientY - 20); $('textarea', cform).value = ''; $('textarea', cform).focus(); chip.classList.remove('show');
      }
    }, true);
    $('[data-x]', cform).addEventListener('click', function () { cform.hidden = true; });
    cform.addEventListener('submit', function (e) {
      e.preventDefault(); var txt = $('textarea', cform).value.trim(); if (!txt || !cmtAt) return;
      var dot = document.createElement('i'); dot.className = 'cmt-dot'; dot.style.left = cmtAt.x + 'px'; dot.style.top = cmtAt.y + 'px'; document.body.appendChild(dot);
      cform.hidden = true; toast('Abriendo tu correo…');
      location.href = 'mailto:mariaurbanoeu@gmail.com?subject=' + encodeURIComponent(T('Comentario en tu portfolio: ') + cmtAt.sec) + '&body=' + encodeURIComponent(txt + '\n\n— Sobre: «' + cmtAt.sec + '»' + (cmtAt.what ? ' (' + cmtAt.what + ')' : ''));
    });
    addEventListener('keydown', function (e) {
      var t = e.target; if (e.metaKey || e.ctrlKey || e.altKey || (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable))) return;
      if (!game.hidden || !mv.hidden || (sheet && !sheet.hidden) || (ent && !ent.hidden)) return;
      var k = e.key.toLowerCase(), map = { v: 'move', i: 'pick', t: 'text', m: 'measure', c: 'comment' };
      if (desk && !desk.hidden) { if (e.key === 'Escape') closeDesk(); return; }
      if (map[k]) { if (tb.hidden) openTools(); setTool(map[k]); e.preventDefault(); }
      else if (k === 'd') { openDesk(); e.preventDefault(); }
      else if (e.key === 'Escape' && !tb.hidden && tool === 'move') closeTools();
      else if (e.key === 'Escape' && tool !== 'move') { if (ref) { ref = null; refBox.style.display = 'none'; lines.innerHTML = ''; } else setTool('move'); }
    });
    $('#deskBtn').addEventListener('click', function () { openDesk(); });
  }

  /* ======================= el escritorio de Paula ======================= */
  var deskOpener = null, deskT = null, zTop = 5;
  function openDesk() {
    if (!desk) return;
    deskOpener = document.activeElement; desk.hidden = false; if (window.PG) PG.ev('desk'); desk.classList.remove('in'); void desk.offsetWidth; desk.classList.add('in');
    document.body.style.overflow = 'hidden';
    $$('img[data-src]', desk).forEach(function (im) { if (im.closest('.win:not([hidden])') || im.closest('.dw-view')) { im.src = im.dataset.src; im.removeAttribute('data-src'); } });
    var fx = $('#deskFace').getContext('2d'), gx2 = $('#deskG').getContext('2d'), tick = 0;
    var upd = function () {
      var n = now(); $('#deskClock').textContent = 'Valencia ' + n.clock; $('#deskStatus').textContent = n.txt; $('#deskGs').textContent = n.txt;
      tick++; fx.clearRect(0, 0, 32, 32); drawSprite(fx, 0, 0, 1, 'idle');
      gx2.clearRect(0, 0, 64, 64); drawSprite(gx2, 0, 4 - (tick % 2), 2, n.sleep ? 'blink' : (tick % 7 === 0 ? 'blink' : 'idle'));
    };
    upd(); clearInterval(deskT); deskT = setInterval(upd, 480);
    $('#deskX').focus();
  }
  function closeDesk() {
    if (!desk || desk.hidden) return;
    desk.hidden = true; document.body.style.overflow = ''; clearInterval(deskT);
    if (deskOpener && deskOpener.focus) deskOpener.focus({ preventScroll: true });
  }
  if (desk) {
    $('#deskX').addEventListener('click', closeDesk);
    var front = function (w) { w.style.zIndex = ++zTop; };
    var openWin = function (k) {
      if (k === 'bugs') { openGame(); return; }
      var w = $('.win[data-win="' + k + '"]', desk); if (!w) return;
      w.hidden = false; front(w);
      $$('img[data-src]', w).forEach(function (im) { im.src = im.dataset.src; im.removeAttribute('data-src'); });
    };
    $$('[data-open]', desk).forEach(function (b) { b.addEventListener('click', function () { openWin(b.dataset.open); }); });
    $$('.win', desk).forEach(function (w) {
      var t = $('.win-t', w), sx, sy, ox, oy, on = false;
      w.addEventListener('pointerdown', function () { front(w); });
      $('[data-x]', w).addEventListener('click', function (e) { e.stopPropagation(); w.hidden = true; });
      t.addEventListener('pointerdown', function (e) {
        if (e.target.closest('[data-x]')) return;
        on = true; w.classList.add('drag'); t.setPointerCapture(e.pointerId);
        var r = w.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top;
      });
      t.addEventListener('pointermove', function (e) {
        if (!on) return;
        var x = Math.max(-w.offsetWidth + 80, Math.min(innerWidth - 80, ox + e.clientX - sx)), y = Math.max(32, Math.min(innerHeight - 40, oy + e.clientY - sy));
        w.style.setProperty('--x', x + 'px'); w.style.setProperty('--y', y + 'px');
      });
      t.addEventListener('pointerup', function () { on = false; w.classList.remove('drag'); });
    });
    $$('.dw-tabs button', desk).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.dataset.v, ids = ['nails', 'kronox', 'nacar', 'amigos'];
        $$('.dw-tabs button', desk).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        $$('.dw-view img', desk).forEach(function (im) { if (im.dataset.src && im.dataset.v === v) { im.src = im.dataset.src; im.removeAttribute('data-src'); } im.classList.toggle('on', im.dataset.v === v); });
        var go = $('.dw-webs [data-goto]', desk); go.dataset.goto = ids[v]; go.href = '#' + ids[v];
      });
    });
    $$('[data-goto]', desk).forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var id = a.dataset.goto; closeDesk(); setTimeout(function () { $('#' + id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 60); }); });
    $('.dw-mail', desk).addEventListener('submit', function (e) { e.preventDefault(); var t = $('textarea', e.target).value.trim(); if (!t) return; location.href = 'mailto:mariaurbanoeu@gmail.com?subject=' + encodeURIComponent(T('Hola Paula')) + '&body=' + encodeURIComponent(t); });
  }

  /* ======================= barra de abajo (celular) ======================= */
  var dock = $('#dock');
  if (dock) {
    var dk = { web: ["XXXXXXXXX","X.X.X...X","XXXXXXXXX","X.......X","X.XXX...X","X.......X","X.XXXXX.X","X.......X","XXXXXXXXX"],
      pen: [".......XX","......XXX",".....XXX.","....XXX..","...XXX...","..XXX....",".XXX.....","XX.......","X........"],
      me: ["...XXX...","..XXXXX..","..XXXXX..","...XXX...",".........","..XXXXX..",".XXXXXXX.","XXXXXXXXX","XXXXXXXXX"],
      mail: ["XXXXXXXXX","XX.....XX","X.X...X.X","X..X.X..X","X...X...X","X.......X","X.......X","XXXXXXXXX","........."] };
    $$('canvas[data-dk]', dock).forEach(function (c) { var x = c.getContext('2d'); x.fillStyle = '#EBA9BD'; dk[c.dataset.dk].forEach(function (r, y) { for (var i = 0; i < 9; i++) if (r[i] === 'X') x.fillRect(i, y, 1, 1); }); });
    var dcx = $('#dockCanvas').getContext('2d');
    drawSprite(dcx, 0, 1, 1, 'idle');
    $('#dockG').addEventListener('click', function () { buzz(14); openGame(); });
    $$('a', dock).forEach(function (a) { a.addEventListener('click', function () { buzz(6); }); });
    var map = { proyectos: 'proyectos', nails: 'proyectos', kronox: 'proyectos', nacar: 'proyectos', amigos: 'proyectos', creativos: 'proyectos', figma: 'figma', marcas: 'figma', sobre: 'sobre', herramientas: 'sobre', contacto: 'contacto' };
    window.dockMark = function (sec) { var k = map[sec.id]; $$('a', dock).forEach(function (a) { a.classList.toggle('on', a.dataset.to === k); }); };
    var lastY = scrollY;
    addEventListener('scroll', function () {
      var y = scrollY, d = y - lastY; if (Math.abs(d) < 8) return;
      dock.classList.toggle('hide', d > 0 && y > innerHeight * .6 && !(innerHeight + y > document.documentElement.scrollHeight - 40)); lastY = y;
    }, { passive: true });
  }

  /* ======================= inclinar y agitar el teléfono ======================= */
  var tiltBtn = $('#gTilt');
  if (tiltBtn && ('ontouchstart' in window) && window.DeviceMotionEvent && !reduce) {
    tiltBtn.hidden = false;
    /* un teléfono en pixel que se agita */
    var sc = $('#shakeCv').getContext('2d'), PH = ["XXXXXXXXXXXX","X..........X","X.XXXXXXXX.X","X.XPPPPPPX.X","X.XPWPPWPX.X","X.XPPPPPPX.X","X.XPPWWPPX.X","X.XPPPPPPX.X","X.XPPPPPPX.X","X.XPPPPPPX.X","X.XPPPPPPX.X","X.XPPPPPPX.X","X.XPPPPPPX.X","X.XXXXXXXX.X","X..........X","X....XX....X","X..........X","XXXXXXXXXXXX"], PC = { X: '#FAF6F0', P: '#EBA9BD', W: '#221616' };
    PH.forEach(function (r, y) { for (var i = 0; i < 12; i++) if (PC[r[i]]) { sc.fillStyle = PC[r[i]]; sc.fillRect(i, y, 1, 1); } });
    $$('.shake-bugs canvas', tiltBtn).forEach(function (cv) { var x = cv.getContext('2d'); ["..K..K..","...KK...",".KppppK.","KpKppKpK",".pppppp.","K.pppp.K",".K....K."].forEach(function (r, y) { for (var i = 0; i < 8; i++) { var k = r[i]; if (k !== '.') { x.fillStyle = PAL[k]; x.fillRect(i, y, 1, 1); } } }); });
    var b3o = $('.b3-obj'), peaks = [], lastPeak = 0;
    var onTilt = function (e) {
      var gx = Math.max(-1, Math.min(1, (e.gamma || 0) / 30)), gy = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30));
      if (g.el) { g.el.style.setProperty('--ry', (gx * 22) + 'deg'); g.el.style.setProperty('--rx', (-gy * 16) + 'deg'); }
      if (b3o) { b3o.style.animation = 'none'; b3o.style.setProperty('--ty', (gx * 30) + 'deg'); b3o.style.setProperty('--tx', (8 - gy * 14) + 'deg'); }
    };
    var onShake = function (e) {
      var a = e.acceleration, m;
      if (a && a.x !== null) m = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0);
      else { a = e.accelerationIncludingGravity; if (!a) return; m = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0) - 10; }
      var t = Date.now();
      if (m > 16 && t - lastPeak > 90) { lastPeak = t; peaks.push(t); peaks = peaks.filter(function (x) { return t - x < 1000; });
        if (peaks.length >= 3 && game.hidden && (!ent || ent.hidden)) { peaks = []; buzz([20, 30, 20]); tiltBtn.classList.remove('hit'); void tiltBtn.offsetWidth; tiltBtn.classList.add('hit'); openGame(); } }
    };
    var started = false;
    var startTilt = function () {
      if (started) return; started = true;
      addEventListener('deviceorientation', onTilt); addEventListener('devicemotion', onShake);
      tiltBtn.classList.add('on'); $('#shakeS').textContent = 'Agita el teléfono para sacarlos'; $('#shakeE').textContent = 'o toca aquí para jugar';
    };
    var needsAsk = typeof DeviceMotionEvent.requestPermission === 'function';
    if (!needsAsk) startTilt();   /* Android: se activa solo, al momento */
    else { $('#shakeS').textContent = 'Toca aquí y después agita el teléfono para sacarlos'; $('#shakeE').textContent = 'un toque y listo'; }
    var ask = function () {
      if (started) return;
      var asks = [DeviceMotionEvent.requestPermission()];
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') asks.push(DeviceOrientationEvent.requestPermission());
      Promise.all(asks).then(function (r) { if (r[0] === 'granted') { startTilt(); $('#shakeS').textContent = '¡Listo! Agítalo ahora'; } else { $('#shakeB').textContent = 'Sin permiso'; $('#shakeS').textContent = 'Actívalo en Ajustes de Safari si quieres jugar así'; } }).catch(function () {});
    };
    tiltBtn.addEventListener('click', function () { buzz(10); if (started) openGame(); else ask(); });
  }

  /* ======================= compartir ======================= */
  var shareBtn = $('#shareBtn');
  if (shareBtn) shareBtn.addEventListener('click', function () {
    buzz(8);
    var en = root.lang === 'en', data = { title: T('Paula Urbano · Diseñadora y desarrolladora web'), text: T('Diseña y programa webs que sus clientes pueden gestionar solos.'), url: 'https://paulaurbanog.com/' + (en ? 'en/' : '') };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () { shareBtn.firstChild.textContent = '¡Link copiado! '; setTimeout(function () { shareBtn.firstChild.textContent = 'Compartir mi portfolio '; }, 2200); };
    if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(done).catch(function () {}); else prompt(T('Copia el link:'), data.url);
  });

  /* ======================= funciona sin conexión ======================= */
  if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });


  /* ======================= modo juego: el mapa de Paula ======================= */
  (function () {
    var KEY = 'pg1', S = { mode: null, ach: {}, bugs: 0, flips: {}, coins: {}, lv: {}, t0: 0, t1: 0, hi: 0 };
    try { var sv = JSON.parse(localStorage.getItem(KEY) || 'null'); if (sv) for (var k in sv) S[k] = sv[k]; } catch (e) {}
    try { S.mode = sessionStorage.getItem('pm'); } catch (e) { S.mode = null; }
    if (!S.lv) S.lv = {}; if (!S.coins || Array.isArray(S.coins)) S.coins = {};
    var save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
    var game = function () { return S.mode === 'game'; };
    var STAGES = ['Paula estudiante', 'Paula diseñadora web', 'Paula contratada'];
    /* los niveles: una web por parada y al final, contratarla */
    var LVS = [
      { k: 'nails', n: 'Nails by MelyG', ic: 'nail', who: 'Manicurista · Katy, Texas', img: 'img/nails-m.webp?v=2', d: 'img/nails-d.webp', url: 'nailsbymelyg.com',
        hi: 'Mely tiene un estudio de manicura rusa. Diseñé su web en Figma y la programé.',
        why: 'Necesitaba que sus clientas se probaran colores y formas antes de reservar.',
        fact: 'Un detalle: la web se abre sola en español o en inglés, según el idioma del teléfono.',
        c: [[20, 14]], ca: ['#662E3A', '#F3ECE8'], t: { m: [73, 48.5], d: [34, 78], l: 'Diseña tu manicura' } },
      { k: 'kronox', n: 'Kronox', ic: 'cam', who: 'Director de videoclips · Sevilla', img: 'img/kpanel-m.webp?v=2', d: 'img/kpanel-d.webp', url: 'panel · kronox',
        hi: 'Kronox hace videoclips. Su web tiene dos partes: la que ven sus clientes y un panel solo para él.',
        why: 'Con el panel cambia videos, fotos y precios sin depender de mí.',
        fact: 'Un detalle: para subir un video solo pega el enlace de YouTube y el título se pone solo.',
        c: [[20, 78]], ca: ['#0B0B0A', '#e5322d'], t: { m: [73, 48], d: [92, 67], l: 'las flechas' } },
      { k: 'nacar', n: 'Nácar Estilismo', ic: 'bag', who: 'Tienda online · Sevilla', img: 'img/nacar-m.webp?v=2', d: 'img/nacar-d.webp', url: 'nacar estilismo',
        hi: 'Nácar es una tienda de ropa en Sevilla. Diseñé y programé su tema de Shopify desde cero.',
        why: 'Está en seis idiomas, y sigo subiendo yo los productos nuevos.',
        fact: 'Un detalle: la cesta se abre a un lado, así nadie pierde la página en la que estaba.',
        c: [[26, 86]], ca: ['#EFE7DC', '#8c7a63'], t: { m: [50, 46], d: [50, 75], l: 'Ver colección' } },
      { k: 'amigos', n: 'Entre Amigos', ic: 'heart', who: 'Proyecto personal', img: 'img/ea-m.webp?v=2',
        hi: 'Después de los terremotos en Venezuela hice en una semana una app para organizar donaciones.',
        why: 'Funciona sin conexión, porque en una emergencia la señal falla.',
        fact: 'Un detalle: quien recibe la ayuda la confirma con un PIN, así quien donó sabe que llegó.',
        c: [[80, 74]], ca: ['#0F1E3D', '#FFD23F'], t: { m: [50, 35], l: 'Necesito ayuda' } },
      { k: 'jairo', n: 'Jairo Azogue', ic: 'film', who: 'Director y editor de video', live: 'https://jairoazogue.com/', url: 'jairoazogue.com',
        hi: 'Jairo es director y editor de video. Le hice su web, y ya está en su propio dominio.',
        why: 'Su trabajo va ordenado por tipo de pieza, y sus herramientas salen como si fueran su escritorio.',
        fact: 'Un detalle: antes de diseñar miré qué busca la gente de su sector en un portfolio.',
        c: [[80, 18]], ca: ['#141210', '#FF4B00'] },
      { k: 'cata', n: 'Catalina Silva', ic: 'cube', who: '3D y animación', live: 'https://catalinasilva.netlify.app/', url: 'catalinasilva.netlify.app',
        hi: 'Catalina hace 3D y animación.',
        why: 'Hicimos su web para que pudiera pedir prácticas en estudios de 3D.',
        fact: 'Un detalle: antes de diseñar miré qué buscan los estudios de 3D cuando revisan un portfolio.',
        c: [[26, 24]], ca: ['#3d3d3d', '#f39a3a'] }
    ];
    var NC = LVS.length;
    var ACH = [['webs4', 'Probaste todas las webs'], ['coins', 'Monedera: las ' + NC + ' monedas'], ['bugs20', 'Cazabugs'], ['desk', 'Curiosidad'], ['brands', 'Marquista'], ['music', 'Spotify sin sentido'], ['hired', '¡Contratada!']];
    var nDone = function () { return LVS.filter(function (l) { return S.lv[l.k]; }).length; };
    var stage = function () { return S.lv.fin ? 2 : nDone() >= 3 ? 1 : 0; };
    var nCoins = function () { return Object.keys(S.coins).filter(function (c) { return /-0$/.test(c); }).length; };
    var achT = $('#achT'), achQ = [], achBusy = false;
    var showAch = function () {
      if (achBusy || !achQ.length) return; achBusy = true;
      $('#achTt').textContent = achQ.shift(); achT.classList.add('on'); buzz([10, 30, 10]);
      setTimeout(function () { achT.classList.remove('on'); setTimeout(function () { achBusy = false; showAch(); }, 400); }, 2400);
    };
    var unlock = function (id) {
      if (S.ach[id]) return; S.ach[id] = 1; save(); if (!game()) return;
      var a = ACH.filter(function (x) { return x[0] === id; })[0]; if (a) { achQ.push(a[1]); showAch(); }
    };
    /* ropa según la etapa: birrete de estudiante, y taza de café al estar contratada */
    var dress = function (ctx, ox, oy, sc) {
      if (!game()) return; var s = stage(), P = function (c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(ox + x * sc, oy + y * sc, w * sc, h * sc); };
      if (s === 0) { P('#1e1414', 8, 0, 16, 2); P('#1e1414', 12, 2, 8, 1); P('#e8bc50', 23, 1, 1, 4); P('#e8bc50', 22, 5, 2, 1); }
      if (s === 2) { P('#FAF6F0', 26, 21, 5, 6); P('#FAF6F0', 31, 22, 1, 3); P('#eba9bd', 27, 23, 3, 2); P('#b9b0a8', 27, 18, 1, 2); P('#b9b0a8', 29, 17, 1, 3); }
    };
    var COIN = ["..XXXX..", ".XYYYYX.", "XYYWYYYX", "XYWYYYYX", "XYYYYYYX", "XYYYYYOX", ".XYYYOX.", "..XXXX.."], CC = { X: '#8a5a12', Y: '#FFD23F', W: '#fff7c2', O: '#e0a91f' };
    var drawCoin = function (cv) { var x = cv.getContext('2d'); COIN.forEach(function (r, y) { for (var i = 0; i < 8; i++) if (CC[r[i]]) { x.fillStyle = CC[r[i]]; x.fillRect(i, y, 1, 1); } }); };
    var face = function (cv, mood) { if (!cv) return; var x = cv.getContext('2d'); x.clearRect(0, 0, 32, 32); drawSprite(x, 0, 0, 1, mood || 'happy'); dress(x, 0, 0, 1); };

    var gw = $('#gw'), map = $('#gwMap'), lvBox = $('#gwLv'), back = $('#gwBack');
    if (!gw) return;
    $$('canvas.coin-ic', gw).forEach(drawCoin);
    /* texto que se escribe solo, como en los juegos; un toque lo completa */
    var typer = function (el) {
      var t = null, full = '';
      var api = {
        say: function (txt, cb) {
          clearInterval(t); full = txt = T(txt); var i = 0; el.textContent = ''; api.busy = true;
          if (reduce) { el.textContent = txt; api.busy = false; if (cb) cb(); return; }
          t = setInterval(function () { i += 2; el.textContent = full.slice(0, i); if (i >= full.length) { clearInterval(t); api.busy = false; if (cb) cb(); } }, 22);
          api.cb = cb;
        },
        skip: function () { if (!api.busy) return false; clearInterval(t); el.textContent = full; api.busy = false; if (api.cb) api.cb(); return true; }
      };
      return api;
    };

    /* ---------- el mapa ---------- */
    var NODES = [{ k: 'start', n: 'Inicio', ic: 'home' }].concat(LVS).concat([{ k: 'fin', n: 'Contrátame', ic: 'mail' }]);
    var POS = { v: [[20, 91], [70, 80], [28, 68], [72, 56], [28, 44], [72, 32], [28, 20], [68, 8]], h: [[5, 72], [18, 32], [31, 70], [44, 32], [57, 70], [70, 32], [83, 70], [91, 30]] };
    var nodeEls = [], mapSay = typer($('#gwMapT')), gwG = $('#gwG');
    NODES.forEach(function (nd, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'gw-n' + (i === 0 ? ' start' : '') + (nd.k === 'fin' ? ' fin' : '');
      b.dataset.i = i;
      b.innerHTML = '<span class="gw-ic"><canvas width="9" height="9" aria-hidden="true"></canvas></span><span class="gw-l"><small>' + (i === 0 ? '' : nd.k === 'fin' ? 'Final' : 'Nivel ' + i) + '</small>' + nd.n + '</span>';
      map.appendChild(b); nodeEls.push(b);
      if (i > 0) b.addEventListener('click', function () { if (b.classList.contains('lock')) { buzz(30); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); mapSay.say('Ese nivel todavía está cerrado. Primero termina el que parpadea.'); return; } openLevel(i); });
    });
    var cur = function () { for (var i = 0; i < LVS.length; i++) if (!S.lv[LVS[i].k]) return i + 1; return NODES.length - 1; };
    var horiz = function () { return innerWidth > innerHeight && innerWidth >= 700; };
    var place = function () {
      var P = POS[horiz() ? 'h' : 'v'];
      nodeEls.forEach(function (b, i) { b.style.left = P[i][0] + '%'; b.style.top = P[i][1] + '%'; });
      $('#gwPath').setAttribute('points', P.map(function (p) { return p.join(','); }).join(' '));
      var c = cur(), d = c - 1 + (S.lv.fin ? 1 : 0); $('#gwPathDone').setAttribute('points', P.slice(0, Math.max(1, d + 1)).map(function (p) { return p.join(','); }).join(' '));
    };
    var gAt = 0;
    var moveG = function (i, instant) {
      var P = POS[horiz() ? 'h' : 'v'][i]; gAt = i;
      gwG.classList.toggle('walk', !instant); gwG.style.left = P[0] + '%'; gwG.style.top = P[1] + '%';
      if (!instant) setTimeout(function () { gwG.classList.remove('walk'); }, 900);
    };
    var gwFrame = 0;
    (function gLoop(t) { if (!gw.hidden && t - gwFrame > 380) { gwFrame = t; var x = $('canvas', gwG).getContext('2d'); x.clearRect(0, 0, 32, 32); var up = Math.floor(t / 380) % 2; drawSprite(x, 0, up, 1, gwG.classList.contains('walk') ? 'happy' : (Math.floor(t / 380) % 9 === 0 ? 'blink' : 'happy')); dress(x, 0, up, 1); } requestAnimationFrame(gLoop); })(0);
    var paintMap = function () {
      var c = cur();
      nodeEls.forEach(function (b, i) {
        var nd = NODES[i], ok = i === 0 || S.lv[nd.k], lock = i > c && !(nd.k === 'fin' && S.lv.fin);
        b.classList.toggle('ok', !!ok && i > 0); b.classList.toggle('lock', lock); b.classList.toggle('now', i === c && !S.lv.fin);
        b.setAttribute('aria-label', (i === 0 ? 'Inicio' : nd.n) + (lock ? ', cerrado' : ok ? ', completado' : i === c ? ', toca para jugar' : ''));
        drawPx($('canvas', b), lock ? 'lock' : nd.ic, lock ? '#7a6a66' : ok && i > 0 ? '#221616' : '#EBA9BD');
      });
      $('#gwStage').textContent = STAGES[stage()];
      $('#gwProg').textContent = S.lv.fin ? '¡Juego completado!' : (c > LVS.length ? 'Nivel final' : 'Nivel ' + c + ' de ' + LVS.length);
      $('#gwCoins').textContent = nCoins() + '/' + NC; $('#gwPbF').style.width = (nDone() / LVS.length * 100) + '%';
      face($('#gwFace')); if (rs) rs.hidden = !nDone() && !S.lv.fin;
      place();
    };
    var mapLine = function () {
      var c = cur();
      if (S.lv.fin) return '¡Lo lograste! Puedes repetir cualquier nivel, o ver el portfolio completo.';
      if (c === 1) return '¡Hola! Soy el Paulagotchi. Cada parada del mapa es una web que hizo Paula. Empezamos por la primera.';
      if (c === NODES.length - 1) return '¡Probaste las ' + LVS.length + ' webs! Solo queda el final.';
      if (c === 5) return '¡Las 4 webs listas! Ahora vienen dos portfolios que hizo Paula.';
      return '¡Bien! Siguiente parada: ' + NODES[c].n + '.';
    };
    /* un solo botón que te lleva a lo siguiente */
    var mapAct = function () {
      var a = $('#gwMapAct'), c = cur(); a.innerHTML = ''; if (S.lv.fin) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'gl-b';
      b.innerHTML = '<span class="gl-cur" aria-hidden="true"></span>' + (c === NODES.length - 1 ? 'Ir al final' : 'Jugar nivel ' + c + ': ' + NODES[c].n);
      b.addEventListener('click', function (e) { e.stopPropagation(); buzz(10); openLevel(c); }); a.appendChild(b);
    };
    var opener = null, gwY = 0;
    var openWorld = function () {
      if (!gw.hidden) return; opener = document.activeElement;
      gw.hidden = false; gwY = scrollY; root.classList.add('gw-on'); document.body.style.top = -gwY + 'px';
      lvBox.hidden = true; $('#gwWin').hidden = true; map.parentNode.hidden = false;
      paintMap(); moveG(cur() > NODES.length - 1 ? NODES.length - 1 : (S.lv.fin ? NODES.length - 1 : cur() - 1), true);
      $('#gwMapAct').innerHTML = '';
      setTimeout(function () { if (nDone() && !S.lv.fin) askRestart(true); else mapGo(); }, 250);
      /* la primera vez el juego arranca solo: camina y entra al nivel 1 */
      if (!S.t0 && cur() === 1) setTimeout(function () { if (!gw.hidden && lvBox.hidden && !S.t0) openLevel(1); }, 3200);
      var n = nodeEls[cur()]; if (n) setTimeout(function () { n.focus({ preventScroll: true }); }, 60);
    };
    /* partida guardada: seguir donde lo dejaste o empezar de nuevo */
    var mapGo = function () { mapSay.say(mapLine(), mapAct); if (!S.lv.fin) { var c = cur(); setTimeout(function () { moveG(c); }, 300); } };
    var restart = function () { S.lv = {}; S.coins = {}; S.t0 = 0; S.t1 = 0; save(); paintMap(); moveG(0, true); mapGo(); };
    var askRestart = function (saved) {
      var a = $('#gwMapAct'), c = cur(); a.innerHTML = '';
      var mk = function (txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = txt; b.addEventListener('click', function (e) { e.stopPropagation(); buzz(10); fn(); }); a.appendChild(b); return b; };
      mapSay.say(saved ? 'Tienes una partida guardada: ibas por el ' + (c > LVS.length ? 'nivel final' : 'nivel ' + c + ' de ' + LVS.length) + '.' : '¿Empezar de cero? Se borra tu avance del mapa.', function () {
        var f = mk('<span class="gl-cur" aria-hidden="true"></span>' + (saved ? 'Seguir donde lo dejé' : 'No, seguir jugando'), mapGo, 'gl-b');
        mk('Empezar de nuevo', restart, 'gl-b link');
        if (!small.matches) f.focus({ preventScroll: true });
      });
    };
    var rs = $('#gwRs'); if (rs) rs.addEventListener('click', function () { buzz(10); if (!lvBox.hidden || !$('#gwWin').hidden) backToMap(); askRestart(false); });
    var closeWorld = function () {
      var wasOn = root.classList.contains('gw-on'); gw.hidden = true; root.classList.remove('gw-on'); document.body.style.top = ''; if (wasOn) scrollTo({ top: gwY, behavior: 'instant' });
      if (back) back.hidden = !game();
    };
    addEventListener('resize', function () { if (!gw.hidden) { place(); moveG(gAt, true); } });
    $('#gwOut').addEventListener('click', function () { closeWorld(); toastMsg('Para volver al juego, toca «Volver al mapa» abajo'); });
    if (back) back.addEventListener('click', function () { buzz(10); openWorld(); });
    $('#gwMapBox').addEventListener('click', function () { mapSay.skip(); });

    /* ---------- dentro de un nivel ---------- */
    var L = null, step = 0, say = typer($('#glTxt')), stg = $('#glStage'), act = $('#glAct'), dots = $('#glDots');
    var btn = function (txt, fn, cls) { var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'gl-b'; b.innerHTML = txt; b.addEventListener('click', function (e) { e.stopPropagation(); buzz(8); fn(); }); act.appendChild(b); return b; };
    var go = function (txt) { return '<span class="gl-cur" aria-hidden="true"></span>' + txt; };
    var showAct = function (fn) { act.innerHTML = ''; act.classList.remove('in'); fn(); void act.offsetWidth; act.classList.add('in'); var f = $('button', act); if (f && !small.matches) f.focus({ preventScroll: true }); };
    var setDots = function (n, tot) { dots.innerHTML = ''; for (var i = 0; i < tot; i++) { var d = document.createElement('i'); if (i < n) d.className = 'f'; dots.appendChild(d); } };
    var phoneHTML = function (l) {
      if (l.live) return horiz() ? '<figure class="gl-ph gl-br"><figcaption><i></i><i></i><i></i><span>' + l.url + '</span></figcaption><div class="gl-sc gl-live" data-w="1280"><iframe src="' + l.live + '" title="La web de ' + l.n + ' en vivo" tabindex="-1"></iframe></div></figure>' : '<figure class="gl-ph gl-live" data-w="390"><iframe src="' + l.live + '" title="La web de ' + l.n + ' en vivo" tabindex="-1"></iframe></figure>';
      if (l.d && horiz()) return '<figure class="gl-ph gl-br"><figcaption><i></i><i></i><i></i><span>' + l.url + '</span></figcaption><div class="gl-sc"><img src="' + l.d + '" alt="La web de ' + l.n + ' en el ordenador"></div></figure>'; return '<figure class="gl-ph"><img src="' + l.img + '" alt="La web de ' + l.n + ' en el celular" width="390" height="844"></figure>'; };
    /* la web en vivo cabe en el marco como si fuera su tamaño real */
    var fitLive = function () { $$('.gl-live', stg).forEach(function (b) { var f = $('iframe', b), w = +b.dataset.w, k = b.clientWidth / w; f.style.width = f.style.minWidth = f.style.maxWidth = w + 'px'; f.style.height = (b.clientHeight / k) + 'px'; f.setAttribute('scrolling', 'no'); f.style.transform = 'scale(' + k + ')'; }); };
    addEventListener('resize', function () { if (L) fitLive(); });
    var talk = function (txt, mood, then) { face($('#glFace'), mood); act.innerHTML = ''; say.say(txt, function () { showAct(then); }); };
    var STEPS = 4, hintT = null;
    var run = function () {
      setDots(step, L.fin ? 2 : STEPS);
      if (L.fin) return runFin();
      var l = L;
      if (step === 0) {
        stg.innerHTML = phoneHTML(l); stg.className = 'gl-stage'; fitLive();
        if (!reduce && l.ca) {
          var ci = document.createElement('span'); ci.className = 'gl-cartin'; ci.style.setProperty('--c', l.ca[0]); ci.style.setProperty('--a', l.ca[1]); ci.innerHTML = '<i>' + l.n + '</i>'; stg.appendChild(ci);
          var fr = $('.gl-ph', stg); setTimeout(function () { if (fr) fr.classList.add('st'); buzz([6, 30, 6]); }, 520); setTimeout(function () { ci.remove(); if (fr) fr.classList.remove('st'); }, 900);
        }
        talk(l.hi + ' ' + l.why, 'happy', function () { btn(go('Siguiente'), function () { step++; run(); }); });
      } else if (step === 1) {
        stg.className = 'gl-stage hunt';
        if (!$('.gl-ph', stg)) { stg.innerHTML = phoneHTML(l); fitLive(); } var ph = $('.gl-sc', stg) || $('.gl-ph', stg);
        var got = 0, need = 0;
        l.c.forEach(function (p, j) {
          var id = l.k + '-' + j; need++;
          if (S.coins[id]) { got++; return; }
          var b = document.createElement('button'); b.type = 'button'; b.className = 'gl-coin'; b.style.left = p[0] + '%'; b.style.top = p[1] + '%'; b.setAttribute('aria-label', 'Moneda escondida');
          b.innerHTML = '<canvas width="8" height="8" aria-hidden="true"></canvas>'; drawCoin($('canvas', b));
          b.addEventListener('click', function (e) {
            e.stopPropagation(); if (b.classList.contains('got')) return; b.classList.add('got'); S.coins[id] = 1; save(); got++; buzz([8, 20, 8]);
            var pl = document.createElement('span'); pl.className = 'coin-plus gl-plus'; pl.textContent = '+1'; pl.style.left = p[0] + '%'; pl.style.top = p[1] + '%'; ph.appendChild(pl);
            setTimeout(function () { pl.remove(); }, 800);
            $('#gwCoins').textContent = nCoins() + '/' + NC; var hc = $('.gw-coins'); hc.classList.remove('pop'); void hc.offsetWidth; hc.classList.add('pop');
            if (nCoins() >= NC) unlock('coins');
            clearTimeout(hintT); say.say('¡La tienes! Llevas ' + nCoins() + ' de ' + NC + ' monedas.', function () { setTimeout(function () { step++; run(); }, 700); });
          });
          ph.appendChild(b);
        });
        if (got >= need) { step++; run(); return; }
        talk('Escondí una moneda en su web. ¡Encuéntrala y tócala!', 'happy', function () { btn('¿Dónde está?', function () { stg.classList.add('hint'); say.say('¡Ahí! Donde apunta la flecha.'); }, 'gl-b link'); });
        clearTimeout(hintT); hintT = setTimeout(function () { if (L === l && step === 1) stg.classList.add('hint'); }, 4500);
      } else if (step === 2) {
        stg.className = 'gl-stage mis';
        $$('.gl-coin', stg).forEach(function (c) { c.remove(); });
        var m = ENTER[l.k] && ENTER[l.k].m, tp = l.t && (horiz() && l.d ? l.t.d : l.t.m);
        if (tp) { var tg = document.createElement('span'); tg.className = 'gl-tg'; tg.style.left = tp[0] + '%'; tg.style.top = tp[1] + '%'; tg.innerHTML = '<i></i><b>Empieza aquí: «' + l.t.l + '»</b>'; ($('.gl-sc', stg) || $('.gl-ph', stg)).appendChild(tg); if (tp[0] > 60) tg.classList.add('r'); else if (tp[0] < 40) tg.classList.add('l'); }
        talk('Tu misión: ' + m + (tp ? ' Te marqué dónde empezar.' : ''), 'happy', function () {
          btn(go('Entrar en la web'), function () { openEnter(l.k, true); });
          btn('Saltar misión', function () { step++; run(); }, 'gl-b link');
        });
      } else if (step === 3) {
        stg.className = 'gl-stage'; $$('.gl-tg', stg).forEach(function (t) { t.remove(); });
        talk(l.fact, 'happy', function () { btn(go('Terminar nivel'), function () { win(); }); });
      }
    };
    var openLevel = function (i) {
      var nd = NODES[i]; L = nd.k === 'fin' ? { fin: true, n: 'Contrátame', k: 'fin' } : nd; step = 0;
      if (!S.t0) { S.t0 = Date.now(); save(); }
      $('#glN').textContent = L.fin ? 'Final' : 'Nivel ' + i; $('#glT').textContent = L.n; $('#glW').textContent = L.fin ? '' : L.who;
      map.parentNode.hidden = true; lvBox.hidden = false; lvBox.classList.remove('in'); void lvBox.offsetWidth; lvBox.classList.add('in');
      buzz(14); run();
    };
    var backToMap = function () { stg.innerHTML = ''; lvBox.hidden = true; $('#gwWin').hidden = true; map.parentNode.hidden = false; L = null; paintMap(); $('#gwMapAct').innerHTML = ''; mapSay.say(mapLine(), mapAct); };
    $('#glBack').addEventListener('click', function () { buzz(8); backToMap(); moveG(Math.min(cur(), NODES.length - 1) - (S.lv.fin ? 0 : 1), true); setTimeout(function () { if (!S.lv.fin) moveG(cur()); }, 200); });
    $('.gl-box').addEventListener('click', function () { say.skip(); });
    /* ganaste el nivel */
    var win = function () {
      var was = stage(), idx = NODES.indexOf(L);
      S.lv[L.k] = 1; save();
      if (nDone() >= LVS.length) unlock('webs4');
      var w = $('#gwWin'), coinsL = S.coins[L.k + '-0'] ? 1 : 0;
      $('#gwWinK').textContent = 'Nivel ' + idx + ' completado';
      $('#gwWinC').textContent = coinsL + ' / 1';
      var ev = stage() > was; $('#gwWinE').hidden = !ev; if (ev) $('#gwWinE').textContent = '¡Tu Paulagotchi evolucionó! Ahora es ' + STAGES[stage()];
      /* las reseñas de verdad se desbloquean al pasar su nivel */
      var REV = { nails: ['Superó todas mis expectativas. Un trabajo de 10/10.', 'Mely G. · Nails by MelyG'], cata: ['Un portfolio que de verdad me representa. La recomiendo sin dudarlo.', 'Catalina Silva · 3D y animación'] }, rv = REV[L.k];
      $('#gwWinR').hidden = !rv; if (rv) { $('#gwWinRq').textContent = rv[0]; $('#gwWinRn').textContent = rv[1]; }
      face($('#gwWinCv')); lvBox.hidden = true; w.hidden = false; w.classList.remove('on'); void w.offsetWidth; w.classList.add('on'); buzz([20, 50, 20]);
      if (g) { g.mood = 'happy'; g.jump = 24; }
      $('#gwWinGo').focus({ preventScroll: true });
    };
    $('#gwWinGo').addEventListener('click', function () {
      buzz(10); var from = NODES.indexOf(L); backToMap(); moveG(from, true);
      setTimeout(function () { moveG(cur()); }, 350);
    });
    /* el final: resumen y contratarla */
    var mmss = function (ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); };
    var runFin = function () {
      stg.className = 'gl-stage fin';
      if (!S.t1) { S.t1 = Date.now(); }
      if (!S.lv.fin) { S.lv.fin = 1; save(); unlock('hired'); }
      var t = S.t1 - (S.t0 || S.t1);
      stg.innerHTML = '<div class="gl-sum"><canvas id="glBig" width="32" height="32" aria-hidden="true"></canvas><p class="gl-st">' + STAGES[2] + '</p><dl><div><dt>Webs probadas</dt><dd>' + nDone() + '/' + LVS.length + '</dd></div><div><dt>Monedas</dt><dd>' + nCoins() + '/' + NC + '</dd></div><div><dt>Tiempo</dt><dd>' + mmss(t) + '</dd></div></dl></div>';
      face($('#glBig')); save();
      if (step === 0) talk('¡Llegaste al final! Viste las ' + LVS.length + ' webs y el Paulagotchi ya está contratado. Tiene hasta taza de café.', 'happy', function () { btn(go('Siguiente'), function () { step++; run(); }); });
      else talk('Ahora te toca a ti. Si te gustó cómo trabaja Paula, escríbele. Contesta rápido.', 'happy', function () {
        var a = document.createElement('a'); a.className = 'gl-b'; a.href = 'mailto:mariaurbanoeu@gmail.com?subject=Vi%20tu%20portfolio'; a.innerHTML = go('Escribirle a Paula'); act.appendChild(a);
        var v = document.createElement('a'); v.className = 'gl-b ghost'; v.href = 'Paula-Urbano.vcf'; v.setAttribute('download', ''); v.textContent = 'Guardar su contacto'; act.appendChild(v);
        btn('Ver el portfolio completo', function () { closeWorld(); goTo('proyectos'); }, 'gl-b ghost');
        btn('Jugar otra vez', function () { S.lv = {}; S.coins = {}; S.t0 = 0; S.t1 = 0; save(); backToMap(); moveG(0, true); setTimeout(function () { moveG(1); }, 300); }, 'gl-b link');
      });
    };
    addEventListener('keydown', function (e) {
      if (gw.hidden || (ent && !ent.hidden)) return;
      if (e.key === 'Escape') { if (!lvBox.hidden) $('#glBack').click(); else closeWorld(); }
    });

    var setMode = function (m) {
      S.mode = m; save(); try { sessionStorage.setItem('pm', m); } catch (e) {} root.classList.toggle('m-game', m === 'game'); root.classList.toggle('m-fast', m === 'fast');
      var mp = $('#modePick'); if (mp) mp.hidden = true;
      var sw = $('#modeSwap'); if (sw) sw.textContent = m === 'game' ? 'Cambiar a modo rápido (sin juego)' : 'Cambiar a modo juego';
      if (m === 'game') { buzz(14); openWorld(); }
      else { closeWorld(); if (back) back.hidden = true; toastMsg('Modo rápido: solo el portfolio'); if (g && g.status) g.status.textContent = '¿jugamos luego?'; }
    };
    var sw0 = $('#modeSwap'); if (sw0) { sw0.textContent = game() ? 'Cambiar a modo rápido (sin juego)' : 'Cambiar a modo juego'; sw0.addEventListener('click', function () { setMode(game() ? 'fast' : 'game'); }); }
    var gl = $('#gLater'); if (gl) gl.addEventListener('click', function () { setMode('game'); });
    /* si vuelves en modo juego, entras directo al mapa (después de la intro) */
    if (game() && !root.classList.contains('ts-on')) setTimeout(function () { if (!root.classList.contains('intro-on')) openWorld(); else { var iv = setInterval(function () { if (!root.classList.contains('intro-on')) { clearInterval(iv); openWorld(); } }, 120); } }, 60);

    /* pantalla de inicio: primera visita */
    var ts = $('#ts');
    if (ts && root.classList.contains('ts-on')) {
      var tc = $('#tsCv').getContext('2d'), tsT = 0, opts = $$('.ts-o', ts);
      (function tsLoop(t) { if (!root.classList.contains('ts-on')) return; if (t - tsT > 400) { tsT = t; tc.clearRect(0, 0, 32, 32); drawSprite(tc, 0, 1 - (Math.floor(t / 400) % 2), 1, Math.floor(t / 400) % 7 === 0 ? 'blink' : 'happy'); } requestAnimationFrame(tsLoop); })(0);
      var sel = function (b) { opts.forEach(function (o) { o.classList.toggle('on', o === b); }); };
      var pick = function (b) {
        if (ts.dataset.busy) return; ts.dataset.busy = 1; sel(b); b.classList.add('chosen'); buzz([10, 40, 10]);
        setTimeout(function () { ts.classList.add('out'); }, 500);
        setTimeout(function () { root.classList.remove('ts-on'); setMode(b.dataset.ts); }, 1200);
      };
      opts.forEach(function (b) { b.addEventListener('mouseenter', function () { sel(b); }); b.addEventListener('focus', function () { sel(b); }); b.addEventListener('click', function () { pick(b); }); });
      addEventListener('keydown', function (e) {
        if (!root.classList.contains('ts-on')) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') { var i = opts.findIndex(function (o) { return o.classList.contains('on'); }); var n = opts[(i + 1) % opts.length]; sel(n); n.focus(); e.preventDefault(); }
        if (e.key === 'Enter') { var on = opts.filter(function (o) { return o.classList.contains('on'); })[0]; if (on) { pick(on); e.preventDefault(); } }
      });
      setTimeout(function () { opts[0].focus({ preventScroll: true }); }, 100);
      /* si nadie elige en 5 segundos, entra al portfolio normal */
      var tsBar = $('#tsBar'), tsLeft = 5000, tsLast = 0, tsStop = false;
      (function tsTick(t) {
        if (!root.classList.contains('ts-on') || ts.dataset.busy || tsStop) return;
        if (!root.classList.contains('intro-on') && !document.hidden) { if (tsLast) tsLeft -= t - tsLast; tsLast = t; } else tsLast = 0;
        tsBar.style.transform = 'scaleX(' + Math.max(0, 1 - tsLeft / 5000) + ')';
        if (tsLeft <= 0) { pick(opts[0]); return; }
        requestAnimationFrame(tsTick);
      })(0);
      addEventListener('keydown', function (e) { if (!root.classList.contains('ts-on')) return; if (e.key === 'Escape') pick(opts[0]); else if (/Arrow|Tab/.test(e.key)) { tsStop = true; ts.classList.add('hold'); } });
      ts.addEventListener('click', function (e) { if (!e.target.closest('.ts-o')) pick(opts[0]); });
    }
    /* créditos con cuenta atrás de arcade */
    var cr = $('#credits'), crT = null;
    if (cr) {
      new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting || crT || !game()) return;
        var n = 10, el = $('#crN');
        crT = setInterval(function () { n--; if (n >= 0) el.textContent = n; if (n < 0) { clearInterval(crT); $('.cr-c', cr).textContent = 'Fin de la partida. ¿Hablamos?'; } }, 1000);
      }, { threshold: .5 }).observe(cr);
      $('#crGo').addEventListener('click', function () { var t = $('#msgTxt'); if (t) { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); setTimeout(function () { t.focus({ preventScroll: true }); }, 450); } });
    }
    window.PG = {
      dress: dress,
      ev: function (type, v) {
        if (type === 'reto') { if (L && !L.fin && L.k === v && step === 2) { step++; setTimeout(run, 350); } }
        if (type === 'bugs') { S.bugs += v || 0; save(); if (S.bugs >= 20) unlock('bugs20'); }
        if (type === 'desk') unlock('desk');
        if (type === 'flip') { S.flips[v] = 1; save(); if (Object.keys(S.flips).length >= 3) unlock('brands'); }
        if (type === 'music') unlock('music');
      }
    };
  })();

  /* ---------- lo que pesa esta visita, medido de verdad ---------- */
  addEventListener('load', function () {
    setTimeout(function () {
      var el = $('#ftKb'); if (!el || !performance.getEntriesByType) return;
      var n = performance.getEntriesByType('navigation')[0], tot = n ? n.transferSize || 0 : 0;
      performance.getEntriesByType('resource').forEach(function (r) { tot += r.transferSize || 0; });
      var kb = Math.round(tot / 1024);
      if (kb > 20 && kb < 2048) el.textContent = 'Al entrar, esta web ha cargado ' + kb + ' KB: menos que una foto de tu celular. ';
    }, 1500);
  });

  /* ---------- si te vas a otra pestaña ---------- */
  var title = document.title;
  var fav = $('link[rel=icon]'); new Image().src = 'favicon-sad.png';
  document.addEventListener('visibilitychange', function () { document.title = document.hidden ? T('vuelve :(') : title; if (fav) fav.href = document.hidden ? 'favicon-sad.png' : 'favicon.png'; });

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
    step(performance.now());
  }
  function step(now) {
    if (!st) return;
    if (!st.first) { st.first = 1; st.t0 = now; st.last = now; }
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
      if (x > b.x - 10 && x < b.x + 42 && y > b.y - 10 && y < b.y + 38) { buzz(18); st.bugs.splice(i, 1); st.score++; st.splats.push({ x: b.x, y: b.y + 14, t: 500 }); break; }
    }
  }
  function end() {
    var n = st.score; cancelAnimationFrame(st.raf); st = null; if (window.PG) PG.ev('bugs', n);
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
  function page(i) { return 'img/identidad/' + man.k + '/p' + String(i + 1).padStart(2, '0') + '.webp'; }
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
