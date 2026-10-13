/* Paula Urbano · portfolio · sin librerías */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var phone = matchMedia('(max-width: 760px)'), small = matchMedia('(max-width: 899px)');
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
  $$('video[data-poster]').forEach(function (v) { if (!v.closest('.bw')) postIO.observe(v); });
  var FONTS = {
    nails: [['Nails Display', 'nails-display', 'normal'], ['Nails Display', 'nails-display-i', 'italic'], ['Nails Sans', 'nails-sans', 'normal']],
    nacar: [['Nacar Display', 'nacar-display', 'normal'], ['Nacar Display', 'nacar-display-i', 'italic'], ['Nacar Sans', 'nacar-sans', 'normal']],
    kronox: [['Kronox Display', 'kronox-display', 'normal']],
    amigos: [['Amigos Display', 'amigos-display', 'normal'], ['Amigos Sans', 'amigos-sans', 'normal']]
  };
  if (window.FontFace && document.fonts) {
    var fontIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; fontIO.unobserve(e.target);
        (FONTS[e.target.id] || []).forEach(function (f) { var ff = new FontFace(f[0], 'url(fonts/' + f[1] + '.woff2) format("woff2")', { style: f[2], display: 'swap' }); ff.load().then(function (x) { document.fonts.add(x); }).catch(function () {}); });
      });
    }, { rootMargin: '700px 0px' });
    Object.keys(FONTS).forEach(function (id) { var el = $('#' + id); if (el) fontIO.observe(el); });
  }

  /* ---------- videos: se cargan cerca y solo suenan (mudos) a la vista ---------- */
  var vids = $$('video[data-src]').filter(function (v) { return !v.closest('.bw'); });
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
  var figN = $('#figN');
  if (figTrack && figN) figTrack.addEventListener('scroll', function () {
    var cards = $$('.fig-card', figTrack), mid = figTrack.scrollLeft + figTrack.clientWidth / 2, best = 0, d = 1e9;
    cards.forEach(function (c, i) { var dd = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (dd < d) { d = dd; best = i; } });
    figN.textContent = best + 1;
  }, { passive: true });
  function onScroll() {
    if (love && !reduce) {
      var r = love.getBoundingClientRect(), span = love.offsetHeight - innerHeight * .8;
      var p = Math.min(1, Math.max(0, (innerHeight * .35 - r.top) / span));
      var lit = Math.round(p * 1.2 * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
    }
    if (fig && fig.classList.contains('pinned')) {
      var fr = figPin.getBoundingClientRect(), total = figPin.offsetHeight - innerHeight * .9;
      var q = Math.min(1, Math.max(0, -fr.top / Math.max(1, total)));
      figTrack.style.setProperty('--fx', (q * figDist).toFixed(1));
      fig.style.setProperty('--cur', fr.top < innerHeight * .3 && fr.bottom > innerHeight * .8 ? 1 : 0);
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
    STATUS = [n.txt, 'disponible ya', 'ama: figma y ux/ui'];
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
        drawSprite(gx, 0, 4 - bounce, 2, mood);
        /* teclas que brillan mientras programa */
        if (g.jump === 0) { gx.fillStyle = (Math.floor(t / 240) % 2) ? '#eba9bd' : '#d6dcc0'; gx.fillRect(22 + (Math.floor(t / 240) % 5) * 4, 56, 3, 2); }
        if (g.jump > 0) drawIcon(gx, 'heart', 44, 2, 2);
        else if (g.sleep || g.nap) { gx.fillStyle = '#3a2e32'; var zy = 10 - (Math.floor(t / 480) % 3) * 2; gx.fillRect(48, zy, 6, 2); gx.fillRect(52, zy + 2, 2, 2); gx.fillRect(50, zy + 4, 2, 2); gx.fillRect(48, zy + 6, 6, 2); }
        /* mini */
        mx.clearRect(0, 0, 32, 32);
        drawSprite(mx, 0, 1 - (Math.floor(t / 480) % 2), 1, mood);
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
        if (k === 'a') { g.status.textContent = '¡vamos!'; setTimeout(function () { $('#proyectos').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 350); }
        if (k === 'b') { g.status.textContent = '¡a jugar!'; setTimeout(openGame, 300); }
        if (k === 'c') { g.status.textContent = '¡escríbeme!'; setTimeout(function () { $('#contacto').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 350); }
      });
    });
    mini.el.addEventListener('click', openGame);
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

  /* ======================= fichas de marca que se voltean ======================= */
  $$('.card-in').forEach(function (b) {
    var name = $('h3', b.parentNode).textContent;
    var set = function () { var on = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-label', (on ? 'Volver a la portada de ' : 'Dar la vuelta a la ficha de ') + name); };
    set();
    b.addEventListener('click', function () { buzz(10); b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); set(); });
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
      setTimeout(function () { location.href = 'mailto:mariaurbanoeu@gmail.com?subject=' + encodeURIComponent('Hola Paula') + '&body=' + encodeURIComponent(txt); }, 700);
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


  /* ======================= portada: wireframe → diseño ======================= */
  var root = document.documentElement;
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


  /* ======================= mis webs: navegador con pestañas ======================= */
  var bw = $('.bw');
  if (bw) {
    var bwTabs = $$('.bw-tab', bw), bwV = $$('.bw-v', bw), bwP = $$('.bw-p', bw), bwUrl = $('#bwUrl'), bwLoad = $('.bw-load', bw);
    var urls = bwUrl.dataset.urls.split('|'), bwCur = -1, bwVis = false, sticky = !reduce && !small.matches, tyT = null, prog = $$('.bw-prog i', bw);
    $$('.bw-ic', bw).forEach(function (c) { drawIcon(c.getContext('2d'), c.dataset.icon, 1, 0, 1); });
    /* el texto se escribe letra por letra, como un diálogo de videojuego */
    var typeP = function (p) {
      clearInterval(tyT);
      $$('.ty-car', bw).forEach(function (c) { c.remove(); });
      var els = $$('dd, .bw-note', p);
      els.forEach(function (el) {
        if (!el.dataset.t) el.dataset.t = el.textContent;
        el.innerHTML = reduce ? '' : '<span class="ty-done"></span><span class="ty-rest"></span>';
        if (reduce) el.textContent = el.dataset.t; else $('.ty-rest', el).textContent = el.dataset.t;
      });
      if (reduce) return;
      var e = 0, ch = 0, car = document.createElement('span'); car.className = 'ty-car';
      tyT = setInterval(function () {
        var el = els[e]; if (!el) { clearInterval(tyT); car.remove(); return; }
        var t = el.dataset.t, done = $('.ty-done', el), rest = $('.ty-rest', el);
        ch = Math.min(t.length, ch + 2);
        done.textContent = t.slice(0, ch); rest.textContent = t.slice(ch);
        el.insertBefore(car, rest);
        if (ch >= t.length) { e++; ch = 0; }
      }, 16);
    };
    var bwSet = function (i) {
      if (i === bwCur) return; bwCur = i;
      bwTabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
      bwV.forEach(function (v, k) {
        v.classList.toggle('on', k === i);
        var vid = $('video', v);
        if ((k === i || k === i + 1) && vid.dataset.poster) { vid.poster = vid.dataset.poster; vid.removeAttribute('data-poster'); }
        if (k === i && bwVis) { load(vid); if (!reduce) { var pp = vid.play(); if (pp && pp.catch) pp.catch(function () {}); } }
        else if (!vid.paused) vid.pause();
      });
      bwP.forEach(function (p, k) { p.classList.toggle('on', k === i); });
      typeP(bwP[i]);
      prog.forEach(function (p, k) { p.classList.toggle('done', k < i); p.classList.remove('now'); });
      if (prog[i]) { void prog[i].offsetWidth; if (bwVis && !reduce) prog[i].classList.add('now'); }
      bwUrl.textContent = urls[i];
      bwLoad.classList.remove('go'); void bwLoad.offsetWidth; bwLoad.classList.add('go');
    };
    var bwScroll = function () {
      if (!sticky) return;
      var r = bw.getBoundingClientRect(), span = bw.offsetHeight - innerHeight;
      var q = Math.min(.999, Math.max(0, -r.top / Math.max(1, span)));
      bwSet(Math.floor(q * bwTabs.length));
    };
    new IntersectionObserver(function (es) {
      bwVis = es[0].isIntersecting;
      if (prog[bwCur]) prog[bwCur].classList.toggle('now', bwVis && !reduce && !sticky);
      var vid = $('video', bwV[Math.max(0, bwCur)]);
      if (bwVis) { load(vid); if (!reduce) { var pp = vid.play(); if (pp && pp.catch) pp.catch(function () {}); } } else vid.pause();
    }, { rootMargin: '100px 0px' }).observe(bw);
    bwTabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        if (!sticky) { bwSet(i); return; }
        var top = bw.getBoundingClientRect().top + scrollY, span = bw.offsetHeight - innerHeight;
        scrollTo({ top: top + span * (i + .5) / bwTabs.length, behavior: 'smooth' });
      });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        var n = (i + d + bwTabs.length) % bwTabs.length; bwTabs[n].focus(); bwTabs[n].click();
      });
    });
    addEventListener('scroll', function () { requestAnimationFrame(bwScroll); }, { passive: true });
    bwSet(0); bwScroll();
    /* historias: avanzan solas, se tocan los lados o se desliza */
    var go = function (d) { var n = bwCur + d; if (n < 0) n = 0; if (n > bwTabs.length - 1) n = 0; buzz(6); if (document.startViewTransition && !reduce) document.startViewTransition(function () { bwSet(n); }); else bwSet(n); };
    prog.forEach(function (p) { $('b', p).addEventListener('animationend', function () { if (!sticky) go(1); }); });
    var view = $('.bw-view', bw), win = $('.bw-win', bw), sx = 0, sy = 0, st = 0, lock = null;
    win.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now(); lock = null; bw.classList.add('hold'); }, { passive: true });
    /* al deslizar de lado, la página no se mueve hacia abajo */
    win.addEventListener('touchmove', function (e) {
      if (sticky) return;
      var dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
      if (lock === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (lock === 'x' && e.cancelable) e.preventDefault();
    }, { passive: false });
    win.addEventListener('touchend', function (e) {
      bw.classList.remove('hold'); if (sticky) return;
      if (lock === 'y') return;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && Date.now() - st < 350 && view.contains(e.target)) { var r = view.getBoundingClientRect(); if (t.clientX < r.left + r.width * .3) go(-1); else if (t.clientX > r.right - r.width * .3) go(1); }
    }, { passive: true });
    $('.bw-insp', bw).addEventListener('click', function () {
      var p = bwP[bwCur].cloneNode(true); clearInterval(tyT);
      $$('dd, .bw-note', bwP[bwCur]).forEach(function (el) { if (el.dataset.t) el.textContent = el.dataset.t; });
      $$('dd, .bw-note', p).forEach(function (el) { if (el.dataset.t) el.textContent = el.dataset.t; });
      $$('.bw-ic', p).forEach(function (c) { c.remove(); });
      openSheet('Inspeccionar · ' + bwTabs[bwCur].textContent, p);
    });
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
      if (es[0].isIntersecting && !ended) { ended = true; g.mood = 'happy'; g.jump = 30; buzz([15, 40, 15]); toastMsg('¡Llegaste al final! El Paulagotchi está orgulloso :)'); }
    }, { threshold: .6 }).observe(ft);
  }

  /* ======================= tu Spotify sin sentido ======================= */
  var mp = $('#mp');
  if (mp) {
    var SONGS = [['Pink Matter', 'Frank Ocean'], ['El orgullo del barrio', ''], ['Eres más', 'Guaco']], si = 0, mpT0 = 0, mpOn = false;
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
    $('#mpNext').addEventListener('click', function () { buzz(6); playSong(si + 1); });
    playSong(0);
    new IntersectionObserver(function (es) { mpOn = es[0].isIntersecting; }).observe(mp);
    (function tickMp(t) {
      if (mpOn && !reduce) { var p = Math.min(1, (t - mpT0) / 9000); $('#mpBar').style.width = (p * 100) + '%'; if (p >= 1) playSong(si + 1); }
      else mpT0 = t - (parseFloat($('#mpBar').style.width) || 0) * 90;
      requestAnimationFrame(tickMp);
    })(performance.now());
  }

  /* ======================= retos y "entrar en la web" ======================= */
  var ENTER = {
    nails: { n: 'Nails by MelyG', u: 'https://nailsbymelyg.com/', r: 'https://nailsbymelyg.com/#estudio', m: 'Toca «Diseña tu manicura» y prueba colores, formas y acabados.' },
    kronoxweb: { n: 'Kronox', u: 'https://kronoxprod.netlify.app/' },
    kronox: { n: 'el panel de Kronox', u: 'demos/kronox-panel.html', m: 'En «Vídeos», usa las flechas para cambiar el orden de sus videoclips.' },
    nacar: { n: 'Nácar Estilismo', u: 'demos/nacar.html', m: 'Abre una prenda, añádela a la cesta y mira cómo se abre a un lado.' },
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
    if (entReto) { $('#enterRn').textContent = 'Reto ' + (RETOS.indexOf(k) + 1) + '/4'; $('#enterMt').textContent = c.m; }
    entLoad.classList.remove('off'); entF.onload = function () { entLoad.classList.add('off'); };
    entF.src = url;
    if (entFace) { entFace.clearRect(0, 0, 32, 32); drawSprite(entFace, 0, 0, 1, 'happy'); }
    ent.hidden = false; document.body.style.overflow = 'hidden'; buzz(10);
    $('#enterX').focus();
  }
  function closeEnter() {
    if (!ent || ent.hidden) return;
    ent.hidden = true; entF.src = 'about:blank'; document.body.style.overflow = '';
    if (entOpener && entOpener.focus) entOpener.focus({ preventScroll: true });
  }
  if (ent) {
    $$('[data-enter]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openEnter(b.dataset.enter, b.dataset.mode === 'reto'); }); });
    $('#enterX').addEventListener('click', closeEnter);
    $('#enterDone').addEventListener('click', function () {
      var k = entKey; done[k] = 1; try { localStorage.setItem('retos', JSON.stringify(done)); } catch (e) {}
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
    trash: ["...XXX...","XXXXXXXXX",".........",".XXXXXXX.",".X.X.X.X.",".X.X.X.X.",".X.X.X.X.",".X.X.X.X.","..XXXXX.."]
  };
  function drawPx(c, name, col) { var x = c.getContext('2d'), m = PX9[name]; if (!m) return; x.clearRect(0, 0, 9, 9); x.fillStyle = col || '#EBA9BD'; m.forEach(function (r, y) { for (var i = 0; i < 9; i++) if (r[i] === 'X') x.fillRect(i, y, 1, 1); }); }
  $$('canvas[data-px]').forEach(function (c) { if (PX9[c.dataset.px]) drawPx(c, c.dataset.px); });

  /* ======================= celular: la cabecera dice dónde estás ======================= */
  var here = $('#here');
  if (here) {
    var SEC = [['top', 'Inicio', 'home'], ['proyectos', 'Mis webs', 'web'], ['nails', 'Nails by MelyG', 'nail', 1], ['kronox', 'Kronox', 'cam', 1], ['nacar', 'Nácar', 'bag', 1], ['amigos', 'Entre Amigos', 'heart', 1], ['creativos', 'Portfolios', 'film', 1], ['figma', 'Figma', 'pen'], ['marcas', 'Marcas', 'star'], ['sobre', 'Sobre mí', 'me'], ['herramientas', 'Herramientas', 'tool'], ['contacto', 'Escríbeme', 'mail']];
    var hereC = $('canvas', here), hereT = $('#hereT'), hereId = 'top';
    drawPx(hereC, 'home');
    window.hereMark = function (el) {
      var s = SEC.filter(function (x) { return x[0] === el.id; })[0]; if (!s || s[0] === hereId) return;
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
        a.addEventListener('click', function (e) { e.preventDefault(); closeSheet(); setTimeout(function () { $('#' + s[0]).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 250); });
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
    tb.hidden = false;
    var chip = $('#toolChip'), tBox = $('#toolBox'), refBox = $('#toolRef'), lines = $('#toolLines'), cform = $('#toolCmt');
    var tool = 'move', ref = null, hov = null, pmx = 0, pmy = 0, cmtAt = null;
    var hint = $('#tbHint'); try { if (localStorage.getItem('tbh')) hint.classList.add('off'); else setTimeout(function () { hint.classList.add('off'); try { localStorage.setItem('tbh', '1'); } catch (e) {} }, 8000); } catch (e) {}
    var setTool = function (t) {
      tool = t; hint.classList.add('off');
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
    var samplePx = function (el, x, y) {
      try {
        var r = el.getBoundingClientRect(), nw = el.naturalWidth || el.videoWidth || el.width, nh = el.naturalHeight || el.videoHeight || el.height; if (!nw || !nh) return null;
        var cs = getComputedStyle(el), fit = cs.objectFit, k = fit === 'contain' ? Math.min(r.width / nw, r.height / nh) : fit === 'cover' ? Math.max(r.width / nw, r.height / nh) : r.width / nw;
        var dw = nw * k, dh = nh * k, pos = cs.objectPosition.split(' ').map(function (p) { return parseFloat(p) / 100; });
        var ox = (r.width - dw) * (isNaN(pos[0]) ? .5 : pos[0]), oy = (r.height - dh) * (isNaN(pos[1]) ? .5 : pos[1]);
        var sx = (x - r.left - ox) / k, sy = (y - r.top - oy) / k; if (sx < 0 || sy < 0 || sx >= nw || sy >= nh) return null;
        pcx.clearRect(0, 0, 1, 1); pcx.drawImage(el, sx, sy, 1, 1, 0, 0, 1, 1); var d = pcx.getImageData(0, 0, 1, 1).data;
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
        if (el.tagName === 'IFRAME') { chip.innerHTML = '<span>Web externa<small>no se puede leer su color</small></span>'; }
        else { if (media && hex) src = 'Pixel'; else hex = bgOf(el); var te = textEl(el), th = te ? toHex(getComputedStyle(te).color) : null;
          chip.innerHTML = '<i style="background:' + hex + '"></i><span>' + hex + '<small>' + src + (th ? ' · texto ' + th : '') + ' · clic para copiar</small></span>'; chip.dataset.hex = hex; }
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
      if (tool === 'pick' && chip.dataset.hex) copy(chip.dataset.hex, '<i style="background:' + chip.dataset.hex + '"></i>Copiado ' + chip.dataset.hex);
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
      location.href = 'mailto:mariaurbanoeu@gmail.com?subject=' + encodeURIComponent('Comentario en tu portfolio: ' + cmtAt.sec) + '&body=' + encodeURIComponent(txt + '\n\n— Sobre: «' + cmtAt.sec + '»' + (cmtAt.what ? ' (' + cmtAt.what + ')' : ''));
    });
    addEventListener('keydown', function (e) {
      var t = e.target; if (e.metaKey || e.ctrlKey || e.altKey || (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable))) return;
      if (!game.hidden || !mv.hidden || (sheet && !sheet.hidden) || (ent && !ent.hidden)) return;
      var k = e.key.toLowerCase(), map = { v: 'move', i: 'pick', t: 'text', m: 'measure', c: 'comment' };
      if (desk && !desk.hidden) { if (e.key === 'Escape') closeDesk(); return; }
      if (map[k]) { setTool(map[k]); e.preventDefault(); }
      else if (k === 'd') { openDesk(); e.preventDefault(); }
      else if (e.key === 'Escape' && tool !== 'move') { if (ref) { ref = null; refBox.style.display = 'none'; lines.innerHTML = ''; } else setTool('move'); }
    });
    $('#deskBtn').addEventListener('click', function () { openDesk(); });
  }

  /* ======================= el escritorio de Paula ======================= */
  var deskOpener = null, deskT = null, zTop = 5;
  function openDesk() {
    if (!desk) return;
    deskOpener = document.activeElement; desk.hidden = false; desk.classList.remove('in'); void desk.offsetWidth; desk.classList.add('in');
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
    $('.dw-mail', desk).addEventListener('submit', function (e) { e.preventDefault(); var t = $('textarea', e.target).value.trim(); if (!t) return; location.href = 'mailto:mariaurbanoeu@gmail.com?subject=' + encodeURIComponent('Hola Paula') + '&body=' + encodeURIComponent(t); });
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
    var data = { title: 'Paula Urbano · Diseñadora web', text: 'Diseña y programa webs con mucho cariño por los detalles.', url: 'https://paulaurbanog.com/' };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var done = function () { shareBtn.firstChild.textContent = '¡Link copiado! '; setTimeout(function () { shareBtn.firstChild.textContent = 'Compartir mi portfolio '; }, 2200); };
    if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(done).catch(function () {}); else prompt('Copia el link:', data.url);
  });

  /* ======================= funciona sin conexión ======================= */
  if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });

  /* ---------- si te vas a otra pestaña ---------- */
  var title = document.title;
  var fav = $('link[rel=icon]'); new Image().src = 'favicon-sad.png';
  document.addEventListener('visibilitychange', function () { document.title = document.hidden ? 'vuelve :(' : title; if (fav) fav.href = document.hidden ? 'favicon-sad.png' : 'favicon.png'; });

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
