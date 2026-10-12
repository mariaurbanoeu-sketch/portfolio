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
      g.t = t;
      if (t - last > 120) {
        last = t;
        var mood = g.mood;
        if (mood === 'idle' && (t % 3200) > 3000) mood = 'blink';
        if (mood === 'idle' && g.sleep) mood = 'blink';
        var bounce = g.jump > 0 ? Math.round(Math.sin(g.jump / 8 * Math.PI) * 4) : (Math.floor(t / 480) % 2);
        if (g.jump > 0) g.jump--; else if (g.mood === 'happy') g.mood = 'idle';
        gx.clearRect(0, 0, 64, 64);
        drawSprite(gx, 0, 4 - bounce, 2, mood);
        /* teclas que brillan mientras programa */
        if (g.jump === 0) { gx.fillStyle = (Math.floor(t / 240) % 2) ? '#eba9bd' : '#d6dcc0'; gx.fillRect(22 + (Math.floor(t / 240) % 5) * 4, 56, 3, 2); }
        if (g.jump > 0) drawIcon(gx, 'heart', 44, 2, 2);
        else if (g.sleep) { gx.fillStyle = '#3a2e32'; var zy = 10 - (Math.floor(t / 480) % 3) * 2; gx.fillRect(48, zy, 6, 2); gx.fillRect(52, zy + 2, 2, 2); gx.fillRect(50, zy + 4, 2, 2); gx.fillRect(48, zy + 6, 6, 2); }
        /* mini */
        mx.clearRect(0, 0, 32, 32);
        drawSprite(mx, 0, 1 - (Math.floor(t / 480) % 2), 1, mood);
        if (mini.icon) drawIcon(mx, mini.icon, 25, 1, 1);
      }
      if (!reduce) requestAnimationFrame(loop);
    };
    refresh(); g.status.textContent = STATUS[0];
    if (reduce) { drawSprite(gx, 0, 4, 2, 'idle'); drawSprite(mx, 0, 1, 1, 'idle'); }
    else requestAnimationFrame(loop);
    setInterval(function () { if (sIdx === 0) refresh(); sIdx = (sIdx + 1) % STATUS.length; g.status.textContent = STATUS[sIdx]; }, 3400);

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
        if (e.isIntersecting && !f.src) { f.addEventListener('load', function () { f.classList.add('ok'); }); f.src = f.dataset.live; fitLive(f); }
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
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); set(); });
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
    var d = PX[c.dataset.px], x = c.getContext('2d');
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
    var show = function (el) {
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
      show(el);
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
    addEventListener('scroll', function () { if (on && cur) { var c = cur; cur = null; show(c); } }, { passive: true });
  }

  /* ======================= comentarios sobre la web ======================= */
  $$('.vbox').forEach(function (vb) {
    var v = $('video', vb), pinsEl = $$('.pin', vb);
    pinsEl.forEach(function (pin) {
      var c = pin.nextElementSibling;
      pin.addEventListener('click', function () {
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
    var urls = bwUrl.dataset.urls.split('|'), bwCur = -1, bwVis = false, sticky = !reduce, tyT = null;
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
        if (k === i && bwVis) { load(vid); if (!reduce) { var pp = vid.play(); if (pp && pp.catch) pp.catch(function () {}); } }
        else if (!vid.paused) vid.pause();
      });
      bwP.forEach(function (p, k) { p.classList.toggle('on', k === i); });
      typeP(bwP[i]);
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
  }

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
