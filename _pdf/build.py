# Genera _pdf/portfolio.html (luego render.js lo convierte en PDF)
import re, io, os, qrcode, qrcode.image.svg
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = open('../js/site.js').read()
def cut(a, b):
    i = src.index(a); j = src.index(b, i); return src[i:j]
PIX = cut('  var PAL = {', '  function drawIcon') + cut('  var GLYPH = {', "  $$('canvas[data-tool]')") + cut('  var MINI = {', '  var lcds =')

def qr(url, col='#221616'):
    q = qrcode.QRCode(border=0, box_size=1, error_correction=qrcode.constants.ERROR_CORRECT_M); q.add_data(url); q.make()
    m = q.get_matrix(); n = len(m)
    rects = ''.join('<rect x="%d" y="%d" width="1" height="1"/>' % (x, y) for y, r in enumerate(m) for x, v in enumerate(r) if v)
    return '<svg class="qr" viewBox="0 0 %d %d" shape-rendering="crispEdges" fill="%s">%s</svg>' % (n, n, col, rects)

def head(n, total, lv, name, who):
    return '<header class="ph"><span>%s · %s</span><span>%s</span><span class="pn">%02d / %02d</span></header>' % (lv, name, who, n, total)

TOTAL = 12
WEB = 'https://paulaurbanog.com/'
MAIL = 'mariaurbanoeu@gmail.com'
LI = 'https://www.linkedin.com/in/paula-urbano-436619332'

def project(n, key, lvl, name, who, title_html, intro, decisions, meta, imgd, imgm, url, urltxt, extra=''):
    dec = ''.join('<li><b>%02d</b><span><strong>%s</strong>%s</span></li>' % (i + 1, d[0], d[1]) for i, d in enumerate(decisions))
    mt = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % m for m in meta)
    return '''<section class="pg pj %s" id="p%d">%s
<div class="pj-g"><div class="pj-l">
<h2 class="pj-t">%s</h2><p class="pj-i">%s</p>
<p class="lab">Lo que pensé</p><ol class="dec">%s</ol>
<dl class="meta">%s</dl>
<a class="go" href="%s">%s<span>%s</span></a>%s
</div><div class="pj-r"><figure class="br"><figcaption><i></i><i></i><i></i><span>%s</span></figcaption><img src="%s" alt=""></figure>%s</div></div></section>''' % (
        key, n, head(n, TOTAL, lvl, name, who), title_html, intro, dec, mt, url, qr(url, 'currentColor'), urltxt, extra, urltxt,
        imgd, ('<figure class="ph-m"><img src="%s" alt=""></figure>' % imgm) if imgm else '')

pages = []
# 1 portada
pages.append('''<section class="pg cover" id="p1">
<p class="k">Portfolio · 2026</p>
<div class="cv-l"><h1>Paula<br>Urbano</h1><p class="script">diseñadora y desarrolladora web</p>
<p class="cv-d">Diseño y programo webs que mis clientes pueden gestionar solos.</p>
<p class="press"><span class="tri"></span>Webs que mis clientes gestionan solos</p></div>
<div class="cv-r"><div class="egg"><div class="lcd-scr"><canvas data-g="happy" width="32" height="32"></canvas></div><div class="egg-b"><i></i><i></i><i></i></div></div><p class="egg-n">Paulagotchi</p></div>
<footer class="cv-f"><a href="%s">paulaurbanog.com</a><a href="mailto:%s">%s</a><a href="%s">LinkedIn · Paula Urbano</a><span>Valencia, España</span></footer>
</section>''' % (WEB, MAIL, MAIL, LI))
# 2 sobre mí
pages.append('''<section class="pg about" id="p2">%s
<div class="ab-g"><div>
<p class="script">sobre mí</p><h2>Vengo del diseño gráfico</h2>
<p class="big">Aprendí a programar porque quería que mis diseños salieran de Figma y funcionaran de verdad.</p>
<p>Estoy en el último año de Multimedia y Artes Digitales en la UCV y desde 2025 hago webs para clientes reales. Vivo en Valencia, hablo español e inglés y busco prácticas a partir de enero, con convenio con la universidad.</p>
<dl class="meta ab-m"><div><dt>Estudios</dt><dd>Multimedia y Artes Digitales · UCV</dd></div><div><dt>Clientes reales</dt><dd>Desde 2025</dd></div><div><dt>Idiomas</dt><dd>Español e inglés</dd></div><div><dt>Busco</dt><dd>Prácticas en Valencia desde enero · con convenio</dd></div></dl>
</div><div class="facts"><p class="lab">3 cosas de mí</p>
<figure><div class="lcd-w"><canvas data-scene="grass" data-t="2000" width="48" height="28"></canvas></div><figcaption><b>No puedo caminar sobre césped.</b></figcaption></figure>
<figure><div class="lcd-w"><canvas data-scene="lemon" data-t="900" width="48" height="28"></canvas></div><figcaption><b>Siempre pido lo mismo: un helado de limón.</b> No soy de probar nada nuevo.</figcaption></figure>
<figure><div class="lcd-w"><canvas data-scene="music" data-t="500" width="48" height="28"></canvas></div><figcaption><b>Escucho todo tipo de música.</b> Mi Spotify no tiene sentido.</figcaption></figure>
</div></div></section>''' % head(2, TOTAL, 'Inicio', 'Sobre mí', 'Paula Urbano'))
# 3 mapa / índice
NODES = [('Nails by MelyG', 'Web con reservas', 4), ('Kronox', 'Web + panel', 5), ('Nácar Estilismo', 'Tienda Shopify', 6), ('Entre Amigos', 'App web', 7),
         ('Portfolios', 'Jairo · ZogueKidd · Catalina', 8), ('Figma', 'Diseños de la uni', 9), ('Marcas', 'Vora · Café del Sur · Nidoo', 10), ('Herramientas', 'Lo que uso', 11), ('Contacto', 'Fin del juego', 12)]
POS = [(6, 70), (17, 30), (28, 70), (39, 30), (50, 70), (61, 30), (72, 70), (83, 30), (94, 70)]
pts = ' '.join('%d,%d' % p for p in POS)
nodes = ''.join('<a class="nd%s" href="#p%d" style="left:%d%%;top:%d%%"><span class="nd-i">%s</span><span class="nd-l"><small>%s</small>%s<em>%s</em></span></a>' % (
    ' fin' if i == 8 else '', pg, POS[i][0], POS[i][1], '%d' % (i + 1) if i < 8 else '★', ('Nivel %d · pág. %d' % (i + 1, pg)) if i < 8 else 'Final · pág. %d' % pg, nm, sub)
    for i, (nm, sub, pg) in enumerate(NODES))
pages.append('''<section class="pg map" id="p3">%s
<div class="map-h"><p class="script">el mapa</p><h2>Lo que vas a ver</h2><p>Cada parada es un proyecto. Pulsa una para ir a su página.</p></div>
<div class="map-w"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="%s"/></svg>%s
<div class="map-g"><canvas data-g="happy" width="32" height="32"></canvas></div></div></section>''' % (head(3, TOTAL, 'Mapa', 'Índice', 'Toca un nivel'), pts, nodes))
# 4-7 proyectos
pages.append(project(4, 'nails', 'Nivel 1', 'Nails by MelyG', '01 / 04 · Manicurista · Katy, Texas',
    'Nails by <i>MelyG</i>', 'Mely tiene un estudio de manicura rusa. Diseñé su web en Figma y la programé: las clientas se prueban colores y formas antes de reservar, ven sus trabajos y compran gift cards.',
    [('Probar antes de reservar', 'Un simulador para elegir color, forma y acabado. La clienta llega a la cita sabiendo lo que quiere.'),
     ('En su idioma sin pedirlo', 'La web detecta si el teléfono está en español o en inglés y se abre así.'),
     ('Regalar en un minuto', 'La gift card se diseña en la web y se envía por WhatsApp.')],
    [('Tipo', 'Web con reservas y gift cards'), ('Qué hice', 'Diseño en Figma, UX/UI y desarrollo'), ('Hecha con', 'Figma · HTML · CSS · JavaScript · GSAP · Square'), ('Idiomas', 'Español e inglés')],
    '../img/nails-d.webp', '../img/nails-m.webp?v=2', 'https://nailsbymelyg.com/', 'nailsbymelyg.com'))
pages.append(project(5, 'kronox', 'Nivel 2', 'Kronox', '02 / 04 · Director de videoclips · Sevilla',
    'Kronox', 'Me pidió una web para su trabajo. Tiene dos partes: la web que ven sus clientes y un panel para que él cambie videos, fotos y precios sin depender de mí.',
    [('Sin malentendidos', 'Antes de escribirle por WhatsApp, el cliente acepta las condiciones del rodaje.'),
     ('Él lo cambia todo', 'Sube videos, cambia precios y aprueba reseñas desde el panel. También desde el celular.'),
     ('Subir un video es pegar un enlace', 'Pega el enlace de YouTube y el título se pone solo. Con flechas cambia el orden en la web.')],
    [('Tipo', 'Web + panel de administración'), ('Qué hice', 'UX/UI y desarrollo'), ('Hecha con', 'HTML · CSS · JavaScript · Firebase'), ('Año', '2026')],
    '../img/kpanel-d.webp', '../img/kpanel-m.webp?v=2', 'https://kronoxprod.netlify.app/', 'kronoxprod.netlify.app', '<p class="note">En las imágenes: el panel que usa él.</p>'))
pages.append(project(6, 'nacar', 'Nivel 3', 'Nácar Estilismo', '03 / 04 · Tienda online · Sevilla',
    'Nácar <i>Estilismo</i>', 'Una tienda de ropa en Sevilla. Diseñé y programé su tema de Shopify desde cero, en seis idiomas, y sigo encargándome de subir los productos nuevos.',
    [('Seguir mirando', 'La cesta se abre a un lado, así nadie pierde la página en la que estaba.'),
     ('Para todas', 'Seis idiomas desde el primer día.'),
     ('Mantenimiento', 'Sigo subiendo yo los productos nuevos.')],
    [('Tipo', 'Tienda online'), ('Qué hice', 'Diseño y desarrollo del tema'), ('Hecha con', 'Shopify · Liquid'), ('Idiomas', 'Seis')],
    '../img/nacar-d.webp', '../img/nacar-m.webp?v=2', 'https://paulaurbanog.com/demos/nacar.html', 'paulaurbanog.com · demo de la tienda'))
steps = [('Se publica la necesidad', 'Qué hace falta, cuánto y dónde. Quien la publica pone un PIN de 4 dígitos.'), ('Match automático', 'Si un local cercano tiene eso disponible, la app lo avisa.'),
         ('Comprado', 'Un donante lo compra y lo marca.'), ('En tránsito', 'Un conductor se ofrece a llevarlo y se ve quién fue a buscarlo.'), ('Recibido + PIN', 'Se confirma con el PIN, así quien donó sabe que llegó.')]
st = ''.join('<figure><div class="ea-ph"><img src="../img/ea/s%d.webp" alt=""></div><figcaption><b>%d · %s</b>%s</figcaption></figure>' % (i + 1, i + 1, t, d) for i, (t, d) in enumerate(steps))
pages.append('''<section class="pg pj amigos" id="p7">%s
<div class="ea-g"><div class="pj-l">
<h2 class="pj-t">Entre Amigos por Venezuela</h2>
<p class="pj-i">Después de los terremotos en Venezuela hice en una semana una app para organizar donaciones, transporte y voluntarios. Funciona sin conexión, porque en una emergencia la señal falla.</p>
<p class="pj-i sm">No llegó a usarse porque ya había otra herramienta parecida, pero es de lo que más aprendí.</p>
<dl class="meta"><div><dt>Tipo</dt><dd>App web</dd></div><div><dt>Qué hice</dt><dd>Investigación · UX/UI · Desarrollo</dd></div><div><dt>Idiomas</dt><dd>7</dd></div><div><dt>Sin conexión</dt><dd>Sí</dd></div></dl>
<a class="go" href="https://paulaurbanog.com/demos/entre-amigos.html">%s<span>paulaurbanog.com · probar la app</span></a>
</div><div class="ea-r"><p class="lab">El camino de una ayuda</p><div class="ea-steps">%s</div></div></div></section>''' % (
    head(7, TOTAL, 'Nivel 4', 'Entre Amigos', '04 / 04 · Proyecto personal'), qr('https://paulaurbanog.com/demos/entre-amigos.html', 'currentColor'), st))
# 8 portfolios creativos
def crea(nm, role, txt, body, url, ut):
    return '<article><div class="cr-v">%s</div><p class="lab">%s</p><h3>%s</h3><p>%s</p><a class="go sm" href="%s">%s<span>%s</span></a></article>' % (body, role, nm, txt, url, qr(url, 'currentColor'), ut)
cube = '<div class="b3"><span>catalina_silva.blend</span><canvas data-cube width="24" height="24"></canvas><small>Escanea el código para verla en vivo</small></div>'
pages.append('''<section class="pg crea" id="p8">%s
<div class="cr-h"><p class="script">mis favoritos</p><h2>Portfolios para creativos</h2><p>Webs para tres personas que también crean. Antes de diseñar, miré qué busca cada uno en su sector.</p></div>
<div class="cr-g">%s%s%s</div></section>''' % (head(8, TOTAL, 'Nivel 5', 'Portfolios', 'Extra · 3 portfolios'),
    crea('Jairo Azogue', 'Director y editor de video', 'Su trabajo ordenado por tipo de pieza y sus herramientas como si fueran su escritorio. Ya está en su propio dominio.', '<img src="../img/jairo.webp" alt="">', 'https://jairoazogue.com/', 'jairoazogue.com'),
    crea('ZogueKidd', 'Videoclips', 'Usa la misma base que la web de Kronox, con una estética totalmente distinta.', '<img src="../img/zk-d.webp" alt="">', 'https://zoguekidd.netlify.app/', 'zoguekidd.netlify.app'),
    crea('Catalina Silva', '3D y animación', 'La hicimos para que pudiera pedir prácticas en estudios de 3D.', cube, 'https://catalinasilva.netlify.app/', 'catalinasilva.netlify.app')))
# 9 figma
FG = [('DTR', 'Tienda online de una marca de ropa inventada: home, colecciones, producto, carrito, favoritos y login.', ['dtr-home', 'dtr-producto'], 'https://www.figma.com/proto/O1BYlgEZKLjiQEM1RxontS/Web-Detroit?node-id=13-2&starting-point-node-id=534%3A1999'),
      ('Coldculture', 'Ejercicio de clase: rediseño de la tienda online de una marca que ya existe.', ['cold-home', 'cold-shop'], 'https://www.figma.com/proto/zeYWEDgQy5vbrUZvUGmheu/Untitled?node-id=1-2&starting-point-node-id=1%3A2'),
      ('Estilo Vivo', 'Práctica de componentes y variantes: tarjetas, valoraciones y botones con estados.', ['ev-inicio', 'ev-producto'], 'https://www.figma.com/proto/P8oK1mFGqyMTF5QIxZDxtT/Pra%CC%81ctica-3.-Introduccio%CC%81n-a-_Modos_?node-id=1-4&starting-point-node-id=1%3A4')]
fg = ''.join('<article><div class="fg-f"><span class="fg-l">%s / Página 1</span><div class="fg-i">%s</div></div><h3>%s</h3><p>%s</p><a class="lnk" href="%s">Abrir prototipo en Figma</a></article>' % (
    n, ''.join('<img src="../img/figma/%s.webp" alt="">' % i for i in ims), n, d, u) for n, d, ims, u in FG)
pages.append('''<section class="pg figma" id="p9">%s
<div class="cr-h"><p class="script">diseñado en Figma</p><h2>Diseños de la uni</h2><p>Proyectos de la universidad que viven en Figma, con su prototipo navegable. Sin programar todavía.</p></div>
<div class="fg-g">%s</div></section>''' % (head(9, TOTAL, 'Nivel 6', 'Figma', 'Sin programar todavía'), fg))
# 10 marcas
BR = [('Vora', 'Beach club en El Saler. «Vora» significa orilla en valenciano: hice el nombre, el logo, la carta, la señalética y el merch.', 'brand-vora.webp', '#AB4729', [('Oliva', '#8B8635'), ('Teja', '#D06222'), ('Arena', '#EAC892')], 'Moret · Brandon Grotesque', 29, 'vora-1.webp'),
      ('Café del Sur', 'Una marca de café con una imagen muy anticuada. La rediseñé para que pareciera un café de especialidad.', 'cafe-logo.webp', '#FBE9D6', [('Rojo', '#E63837'), ('Crema', '#FBE9D6')], 'ITC Avant Garde · Brandon', 36, 'cafe-1.webp'),
      ('Nidoo', 'Un estudio de diseño digital: la marca, los personajes, la papelería y la web.', 'brand-nidoo.webp', '#2D1B7F', [('Índigo', '#2D1B7F'), ('Naranja', '#FF4B00'), ('Negro', '#191A1A'), ('Gris', '#E6E6E6')], 'Articulat CF · Tenon', 43, 'nidoo-1.webp')]
br = ''.join('<article><div class="bc" style="background:%s"><img class="logo" src="../img/%s" alt=""><img class="app" src="../img/%s" alt=""></div><div class="sw">%s</div><p class="ty">%s</p><h3>%s</h3><p>%s</p><p class="lab">Manual de marca · %d págs.</p></article>' % (
    bc, lg, ap, ''.join('<i style="background:%s"><small>%s</small></i>' % (c, n) for n, c in sw), ty, n, d, pgs, ) for n, d, lg, bc, sw, ty, pgs, ap in BR)
pages.append('''<section class="pg marcas" id="p10">%s
<div class="cr-h"><p class="script">y también</p><h2>Identidades de marca</h2><p>Antes de la web viene la marca.</p></div>
<div class="br-g">%s</div></section>''' % (head(10, TOTAL, 'Nivel 7', 'Marcas', 'Vora · Café del Sur · Nidoo'), br))
# 11 herramientas
h = open('../index.html').read()
tools = re.findall(r'data-tool="(\w+)" data-c="(#\w+)"[^>]*></canvas><b>([^<]+)</b><span>([^<]+)</span>', h)
groups = [('Diseño', tools[:7]), ('Web y desarrollo', tools[7:15]), ('Y también', tools[15:])]
tg = ''.join('<div class="tg"><p class="lab">%s <span>%02d</span></p><ul>%s</ul></div>' % (g, len(t), ''.join(
    '<li><canvas data-tool="%s" data-c="%s" width="16" height="16"></canvas><b>%s</b><span>%s</span></li>' % x for x in t)) for g, t in groups)
pages.append('''<section class="pg tools" id="p11">%s
<div class="cr-h"><p class="script">lo que uso</p><h2>Herramientas</h2><p>Lo que uso para diseñar y para programar.</p></div>
<div class="tl-g">%s</div></section>''' % (head(11, TOTAL, 'Nivel 8', 'Herramientas', '19 programas'), tg))
# 12 final
pages.append('''<section class="pg end" id="p12">
<p class="k">Fin del juego</p>
<div class="end-g"><div class="end-l"><canvas data-g="hired" width="32" height="32"></canvas><p class="end-st">Paula contratada</p></div>
<div class="end-r"><p class="cont">¿Continuar?</p><p class="end-d">Si te gustó cómo trabajo, escríbeme. Contesto rápido.</p>
<ul class="ct"><li><span>Correo</span><a href="mailto:%s">%s</a></li><li><span>Web</span><a href="%s">paulaurbanog.com</a></li><li><span>LinkedIn</span><a href="%s">linkedin.com/in/paula-urbano-436619332</a></li><li><span>Ciudad</span><b>Valencia, España</b></li></ul>
<div class="end-q"><a href="%s">%s</a><span>Escanea para ver mi portfolio en vivo<br>(y jugar con el Paulagotchi)</span></div></div></div>
<p class="credits">Diseño · Paula Urbano &nbsp; Código · Paula Urbano &nbsp; Paulagotchi · Paula Urbano &nbsp; Gracias por jugar</p></section>''' % (MAIL, MAIL, WEB, LI, WEB, qr(WEB, '#FAF6F0')))

from PIL import Image
os.makedirs('img', exist_ok=True)
def jpg(m):
    p = m.group(1).split('?')[0]; out = 'img/' + p.replace('../img/', '').replace('/', '_').replace('.webp', '.jpg')
    if not os.path.exists(out):
        im = Image.open(p); bg = Image.new('RGB', im.size, '#ffffff'); im = im.convert('RGBA'); bg.paste(im, mask=im.split()[3])
        bg.thumbnail((1100, 1100)); bg.save(out, quality=78, optimize=True, progressive=True)
    return 'src="%s"' % out
pages = [re.sub(r'src="(\.\./img/[^"]+)"', jpg, x) for x in pages]
html = open('template.html').read().replace('<!--PAGES-->', '\n'.join(pages)).replace('/*PIX*/', PIX)
open('portfolio.html', 'w').write(html)
print('ok', len(html))
