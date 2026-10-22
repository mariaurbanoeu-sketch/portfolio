# Genera _pdf/portfolio.html; luego render.js lo convierte en Paula-Urbano-Portfolio.pdf
# Versión profesional: cada web a lo grande y lo que la hace especial.
import re, os, qrcode
os.chdir(os.path.dirname(os.path.abspath(__file__)))

src = open('../js/site.js').read()
def cut(a, b):
    i = src.index(a); j = src.index(b, i); return src[i:j]
PIX = cut('  var GLYPH = {', "  $$('canvas[data-tool]')")

def qr(url, col='currentColor'):
    q = qrcode.QRCode(border=0, box_size=1, error_correction=qrcode.constants.ERROR_CORRECT_M); q.add_data(url); q.make()
    m = q.get_matrix(); n = len(m)
    rects = ''.join('<rect x="%d" y="%d" width="1" height="1"/>' % (x, y) for y, r in enumerate(m) for x, v in enumerate(r) if v)
    return '<svg class="qr" viewBox="0 0 %d %d" shape-rendering="crispEdges" fill="%s">%s</svg>' % (n, n, col, rects)

WEB = 'https://paulaurbanog.com/'
MAIL = 'mariaurbanoeu@gmail.com'
LI = 'https://www.linkedin.com/in/paula-urbano-436619332'
TOTAL = 15

def ft(n): return '<footer class="ft"><span>Paula Urbano · Portfolio 2026</span><span>%02d / %02d</span></footer>' % (n, TOTAL)
def br(img, url, cls=''): return '<figure class="br %s"><figcaption class="bar"><u></u><u></u><u></u><s>%s</s></figcaption><img src="%s" alt=""></figure>' % (cls, url, img)
def ph(img, cls=''): return '<figure class="ph %s"><img src="%s" alt=""></figure>' % (cls, img)
def go(url, label, txt): return '<a class="go" href="%s">%s<span>%s<b>%s</b></span></a>' % (url, qr(url), label, txt)
def meta(rows): return '<dl class="meta">%s</dl>' % ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % r for r in rows)

pages = []
# 1 · portada
pages.append('''<section class="pg cover" id="p1"><p class="k">Portfolio · 2026</p>
<div class="cv-g"><div><h1>Paula<br>Urbano</h1><p class="sc">diseñadora y desarrolladora web</p>
<p class="cv-d">Diseño y programo webs que mis clientes pueden gestionar solos.</p></div>
<div class="cv-col">%s%s%s</div></div>
<footer class="cv-f"><a href="%s">paulaurbanog.com</a><a href="mailto:%s">%s</a><a href="%s">LinkedIn · Paula Urbano</a><span>Valencia, España</span></footer></section>''' % (
    br('../img/nacar-d.webp', 'nacar estilismo', 'b1'), br('../img/nails-d.webp', 'nailsbymelyg.com', 'b3'), ph('../img/nails-m.webp'),
    WEB, MAIL, MAIL, LI))

# 2 · sobre mí + índice
IX = [('Nails by MelyG', 'Web con reservas, simulador y gift cards', 3), ('Kronox', 'Web y panel de administración', 5), ('Nácar Estilismo', 'Tienda online en Shopify, en seis idiomas', 7),
      ('Entre Amigos por Venezuela', 'App web que funciona sin conexión', 9), ('WordPress', 'Temas propios en PHP', 10), ('Portfolios para creativos', 'Jairo Azogue · ZogueKidd · Catalina Silva', 11),
      ('Figma', 'Diseños de la universidad', 12), ('Identidades de marca', 'Vora · Café del Sur · Nidoo', 13), ('Herramientas', 'Lo que uso', 14), ('Contacto', '', 15)]
ix = ''.join('<li><a href="#p%d"><em>%02d</em><b>%s%s</b><span>pág. %d</span></a></li>' % (p, i + 1, n, ('<small>%s</small>' % d) if d else '', p) for i, (n, d, p) in enumerate(IX))
pages.append('''<section class="pg ab" id="p2"><div class="ab-g"><div>
<p class="k">Sobre mí</p><h2>Vengo del diseño gráfico</h2>
<p class="big">Aprendí a programar porque quería que mis diseños salieran de Figma y funcionaran de verdad.</p>
<p>Diseño cada web en Figma y la programo yo, así lo que se aprueba en el diseño es lo que sale publicado. Desde 2025 hago webs para clientes reales, y pienso cada una para que el cliente pueda actualizarla sin depender de mí.</p>
<p>Estoy en el último año de Multimedia y Artes Digitales en la UCV. Vivo en Valencia, hablo español e inglés y busco prácticas a partir de enero, con convenio con la universidad.</p>
<dl><div><dt>Hago</dt><dd>Diseño UX/UI y desarrollo web</dd></div><div><dt>Clientes reales</dt><dd>Desde 2025</dd></div><div><dt>Estudios</dt><dd>Multimedia y Artes Digitales · UCV</dd></div><div><dt>Idiomas</dt><dd>Español e inglés</dd></div></dl>
</div><div><p class="k">Contenido</p><ul class="ix">%s</ul></div></div>%s</section>''' % (ix, ft(2)))

# proyectos: página de la web + página de lo especial
def pa(n, cls, num, kind, title, who, intro, rows, right, url, urltxt):
    return '''<section class="pg %s" id="p%d"><div class="pa-g"><div class="pa-l"><p class="k">%s · %s</p><h2 class="pa-t">%s</h2><p class="pa-w">%s</p><p class="pa-i">%s</p>%s%s</div>%s</div>%s</section>''' % (
        cls, n, num, kind, title, who, intro, meta(rows), go(url, 'Verla en vivo', urltxt), right, ft(n))
def pb(n, cls, name, feats):
    f = ''
    for i, (shot, t, d) in enumerate(feats):
        f += '<figure><div class="shot">%s</div><figcaption><em>%d</em><b>%s</b><span>%s</span></figcaption></figure>' % (shot, i + 1, t, d)
    cols = ' '.join('.62fr' if 'class="ph' in x[0] else '1.3fr' for x in feats)
    return '<section class="pg %s" id="p%d"><div class="pb-h"><b>%s</b><span class="k">Lo especial de esta web</span></div><div class="fx" style="grid-template-columns:%s">%s</div>%s</section>' % (cls, n, name, cols, f, ft(n))

# 3-4 · Nails by MelyG
pages.append(pa(3, 'nails', '01', 'Web con reservas', 'Nails by <i>MelyG</i>', 'Mely G. · Manicurista en Katy, Texas',
    'Mely tiene un estudio de manicura rusa. Diseñé su web en Figma y la programé: sus clientas se prueban colores y formas antes de reservar, ven sus trabajos y compran gift cards. La web se abre sola en español o en inglés, según el idioma del teléfono.',
    [('Qué hice', 'Diseño en Figma, UX/UI y desarrollo'), ('Hecha con', 'HTML · CSS · JavaScript · GSAP · Square'), ('Idiomas', 'Español e inglés'), ('Año', '2026')],
    '<div class="pa-r">%s%s</div>' % (br('../img/nails-d.webp', 'nailsbymelyg.com'), ph('../img/nails-m.webp')), 'https://nailsbymelyg.com/', 'nailsbymelyg.com'))
pages.append(pb(4, 'nails', 'Nails by MelyG', [
    (ph('shots/nails-m-sim.png'), 'Probar antes de reservar', 'Un simulador para elegir tono, forma y acabado. La clienta llega a la cita sabiendo lo que quiere, y Mely lo tiene en cuenta al prepararla.'),
    (br('shots/nails-gift.png', 'nailsbymelyg.com/#giftcards'), 'Gift cards en un minuto', 'Se diseña con nombre, mensaje y color favorito, se paga con Square y se envía por WhatsApp o por correo.'),
    (br('shots/nails-fichas.png', 'nailsbymelyg.com/#galeria'), 'Fichas del look', 'Sus trabajos reales, ordenados como fichas: cada look abre su detalle, así las clientas eligen con ejemplos de verdad.')]))

# 5-6 · Kronox
pages.append(pa(5, 'kronox', '02', 'Web + panel de administración', 'Kronox', 'Director de videoclips · Sevilla',
    'Me pidió una web para su trabajo. Tiene dos partes: la web que ven sus clientes y un panel solo para él, para cambiar videos, fotos, textos, tarifas y reseñas sin depender de mí. Antes de escribirle por WhatsApp, el cliente acepta las condiciones del rodaje.',
    [('Qué hice', 'UX/UI y desarrollo'), ('Hecha con', 'HTML · CSS · JavaScript · Firebase'), ('El cliente', 'Lo actualiza solo, también desde el celular'), ('Año', '2026')],
    '<div class="pa-r" style="margin-right:0">%s</div>' % br('../img/kpanel-d.webp', 'kronox · panel · videoclips'), 'https://kronoxprod.netlify.app/', 'kronoxprod.netlify.app'))
pages.append(pb(6, 'pb', 'Kronox · el panel', [
    (br('shots/kp-tarifas.png', 'kronox · panel · tarifas'), 'Sus precios, en sus manos', 'Cada paquete tiene nombre, precio, qué incluye y el texto del botón. Lo cambia él y se actualiza en la web.'),
    (br('shots/kp-resenas.png', 'kronox · panel · reseñas'), 'Reseñas que se publican solas', 'Las reseñas de sus clientes salen solas en la web. Desde el panel solo borra las que no quiere.'),
    (ph('../img/kpanel-m.webp'), 'También desde el celular', 'Subir un video es pegar el enlace de YouTube: el título se pone solo, y con flechas cambia el orden en que salen.')]))

# 7-8 · Nácar
pages.append(pa(7, 'nacar', '03', 'Tienda online', 'Nácar <i>Estilismo</i>', 'Tienda de ropa · Sevilla',
    'Una tienda de ropa en Sevilla. Diseñé y programé su tema de Shopify desde cero, en seis idiomas, y sigo encargándome de subir los productos nuevos.',
    [('Qué hice', 'Diseño y desarrollo del tema'), ('Hecha con', 'Shopify · Liquid'), ('Idiomas', 'Seis'), ('Mantenimiento', 'Subo los productos nuevos')],
    '<div class="pa-r">%s%s</div>' % (br('../img/nacar-d.webp', 'nacar estilismo'), ph('../img/nacar-m.webp')), 'https://paulaurbanog.com/demos/nacar.html', 'Demo de la tienda'))
pages.append(pb(8, 'pb', 'Nácar Estilismo', [
    (br('shots/nacar-lang.png', 'nacar estilismo'), 'Seis idiomas desde el primer día', 'Español, catalán, gallego, euskera, portugués e inglés, con un selector siempre a mano en la cabecera.'),
    (br('shots/nacar-nov.png', 'nacar estilismo · novedades'), 'Novedades que se ven solas', 'Las prendas nuevas y las rebajas salen marcadas en la portada, para que se vea qué cambió desde la última visita.'),
    (ph('shots/nacar-m-prod.png'), 'Comprar desde el celular', 'En el celular, el botón de añadir a la cesta queda siempre a la vista y el menú está abajo, al alcance del pulgar.')]))

# 9 · Entre Amigos
steps = [('Se publica la necesidad', 'Qué hace falta, cuánto y dónde, con un PIN de 4 dígitos.'), ('Match automático', 'Si un local cercano lo tiene, la app avisa.'),
         ('Comprado', 'Un donante lo compra y lo marca.'), ('En tránsito', 'Un conductor se ofrece a llevarlo.'), ('Recibido + PIN', 'Se confirma con el PIN: quien donó sabe que llegó.')]
st = ''.join('<figure><div class="ph"><img src="../img/ea/s%d.webp" alt=""></div><figcaption><b>%d · %s</b>%s</figcaption></figure>' % (i + 1, i + 1, a, b) for i, (a, b) in enumerate(steps))
EAU = 'https://paulaurbanog.com/demos/entre-amigos.html'
pages.append('''<section class="pg amigos" id="p9"><div class="am-h"><div><p class="k">04 · App web · proyecto personal</p><h2 class="pa-t">Entre Amigos<br>por Venezuela</h2></div>
<p class="pa-i">Después de los terremotos en Venezuela hice en una semana una app para organizar donaciones, transporte y voluntarios. Funciona sin conexión, porque en una emergencia la señal falla. No llegó a usarse porque ya había otra herramienta parecida, pero es de lo que más aprendí.</p>
<div class="am-m">%s%s</div></div><p class="k" style="margin:6mm 0 3mm">El camino de una ayuda</p><div class="ea">%s</div>%s</section>''' % (
    meta([('Qué hice', 'Investigación · UX/UI · Desarrollo'), ('Idiomas', 'Siete'), ('Sin conexión', 'Sí'), ('Año', '2026')]), go(EAU, 'Probar la app', 'Demo en mi web'), st, ft(9)))

# 10 · WordPress
wpa = '''<div class="wpa"><nav><span>Escritorio</span><span>Entradas</span><span>Medios</span><span class="on">Páginas</span><span class="nw">Robots</span><span class="nw">Equipo</span><span>Apariencia</span><span>Plugins</span><span>Ajustes</span></nav>
<main><h4>Editar página: Quiénes somos</h4><fieldset><legend>Bloques de contenido · se repiten</legend><span class="f">Título<u>Nuestra historia</u></span><span class="f">Texto<u>RobotiKa nació en 2018…</u></span><span class="f">Imagen a la izquierda<u>sí</u></span></fieldset>
<fieldset><legend>Equipo · tipo de contenido propio</legend><span class="f">Nombre<u>Carlos Ruiz</u></span><span class="f">Cargo<u>CEO y Cofundador</u></span></fieldset></main></div>'''
pages.append('''<section class="pg" id="p10"><div class="sh"><p class="sc">también en</p><h2>WordPress</h2><p>Temas que programé desde cero en la universidad. Quien gestiona la web rellena el panel y la página se actualiza sola.</p></div>
<div class="wp-g"><figure class="br"><figcaption class="bar"><u></u><u></u><u></u><s>robotika.local/quienes-somos</s></figcaption><div class="sc"><img src="../img/wp/robotika-qs.webp" alt=""></div></figure>
<div>%s<p class="k" style="margin-top:4mm">El panel de Robotika</p><p style="font-size:8.2pt;margin-top:1.6mm">Robots y Equipo son apartados propios. Los datos de contacto, el mapa y el formulario (Contact Form 7) se editan sin tocar código.</p></div>
<div class="wp-n"><div><p class="k">Web corporativa</p><h3>Robotika</h3><p>Una empresa ficticia de robots: inicio, quiénes somos, qué hacemos, noticias y contacto, todo editable desde WordPress.</p></div>
<div>%s<p class="k" style="margin-top:3mm">Catálogo de películas</p><h3>Nerflis</h3><p>Un tipo de contenido «Películas» con sus campos: director, año, actores y sinopsis.</p></div></div></div>
<p class="k" style="margin-top:5mm">Proyectos de la universidad · tema propio en PHP · tipos de contenido personalizados · campos con ACF</p>%s</section>''' % (wpa, br('../img/wp/nerflis.webp', 'nerflis.local'), ft(10)))

# 11 · portfolios para creativos
def cr(vis, role, nm, txt, url, ut):
    return '<article>%s<p class="k">%s</p><h3>%s</h3><p>%s</p>%s</article>' % (vis, role, nm, txt, go(url, 'Verla en vivo', ut))
cat = '<div class="cat">%s<span>Escanea el código para verla en vivo</span></div>' % qr('https://catalinasilva.netlify.app/', '#141210')
pages.append('''<section class="pg dark" id="p11"><div class="sh"><p class="sc">mis favoritos</p><h2>Portfolios para creativos</h2><p>Webs para tres personas que también crean. Antes de diseñar, miré qué busca cada uno en su sector: tres estilos totalmente distintos.</p></div>
<div class="g3">%s%s%s</div>%s</section>''' % (
    cr(br('../img/jairo.webp', 'jairoazogue.com'), 'Director y editor de video', 'Jairo Azogue', 'Su trabajo ordenado por tipo de pieza y sus herramientas presentadas como su escritorio. Ya está en su propio dominio.', 'https://jairoazogue.com/', 'jairoazogue.com'),
    cr('<div class="v2">%s%s</div>' % (br('../img/zk-d.webp', 'zoguekidd.netlify.app'), ph('../img/zk-m.webp')), 'Videoclips', 'ZogueKidd', 'Usa la misma base que la web de Kronox, con una estética totalmente distinta.', 'https://zoguekidd.netlify.app/', 'zoguekidd.netlify.app'),
    cr(cat, '3D y animación', 'Catalina Silva', 'La hicimos para que pudiera pedir prácticas en estudios de 3D: su trabajo se recorre como lo revisaría un estudio.', 'https://catalinasilva.netlify.app/', 'catalinasilva.netlify.app'), ft(11)))

# 12 · Figma: los diseños enteros
FG = [('DTR', 'Tienda online de una marca de ropa inventada: home, colecciones, producto, carrito, favoritos y login.', ['dtr-producto', 'dtr-carrito', 'dtr-login'], 'ds', 'https://www.figma.com/proto/O1BYlgEZKLjiQEM1RxontS/Web-Detroit?node-id=13-2&starting-point-node-id=534%3A1999'),
      ('Coldculture', 'Ejercicio de clase: rediseño de la tienda online de una marca que ya existe.', ['cold-home', 'cold-shop'], 'ds', 'https://www.figma.com/proto/zeYWEDgQy5vbrUZvUGmheu/Untitled?node-id=1-2&starting-point-node-id=1%3A2'),
      ('Estilo Vivo', 'Práctica de componentes y variantes: tarjetas, valoraciones y botones con estados.', ['ev-inicio', 'ev-producto'], 'pr', 'https://www.figma.com/proto/P8oK1mFGqyMTF5QIxZDxtT/Pra%CC%81ctica-3.-Introduccio%CC%81n-a-_Modos_?node-id=1-4&starting-point-node-id=1%3A4')]
fg = ''.join('<article><p class="fgl">%s / Página 1</p><div class="fgi %s">%s</div><h3>%s</h3><p>%s</p><a class="lnk" href="%s">Abrir prototipo en Figma</a></article>' % (
    n, c, ''.join('<img src="../img/figma/%s.webp" alt="">' % i for i in ims), n, d, u) for n, d, ims, c, u in FG)
pages.append('''<section class="pg figma" id="p12"><div class="sh"><p class="sc">diseñado en Figma</p><h2>Diseños de la uni</h2><p>Proyectos de la universidad que viven en Figma, con su prototipo navegable. Sin programar todavía.</p></div><div class="g3">%s</div>%s</section>''' % (fg, ft(12)))

# 13 · marcas
BR = [('Vora', 'Beach club en El Saler. «Vora» significa orilla en valenciano: hice el nombre, el logo, la carta, la señalética y el merch.', 'brand-vora.webp', '#AB4729', ['#8B8635', '#D06222', '#EAC892'], 'Moret · Brandon Grotesque', ['vora-2', 'vora-3']),
      ('Café del Sur', 'Una marca de café con una imagen muy anticuada. La rediseñé para que pareciera un café de especialidad.', 'cafe-logo.webp', '#FBE9D6', ['#E63837', '#FBE9D6'], 'ITC Avant Garde · Brandon', ['cafe-2', 'cafe-3']),
      ('Nidoo', 'Un estudio de diseño digital: la marca, los personajes, la papelería y la web.', 'brand-nidoo.webp', '#2D1B7F', ['#2D1B7F', '#FF4B00', '#191A1A', '#E6E6E6'], 'Articulat CF · Tenon', ['nidoo-2', 'nidoo-3'])]
br3 = ''.join('<article><div class="bc" style="background:%s"><img src="../img/%s" alt=""></div><div class="ap">%s</div><div class="sw">%s</div><p class="ty">%s</p><h3>%s</h3><p>%s</p></article>' % (
    bc, lg, ''.join('<img src="../img/%s.webp" alt="">' % a for a in aps), ''.join('<i style="background:%s"></i>' % c for c in sw), ty, n, d) for n, d, lg, bc, sw, ty, aps in BR)
pages.append('''<section class="pg marcas" id="p13"><div class="sh"><p class="sc">y también</p><h2>Identidades de marca</h2><p>Antes de la web viene la marca. También diseño identidades completas, así la web y la marca hablan igual.</p></div><div class="g3">%s</div>%s</section>''' % (br3, ft(13)))

# 14 · herramientas
h = open('../index.html').read()
tools = re.findall(r'data-tool="(\w+)" data-c="(#\w+)"[^>]*></canvas><b>([^<]+)</b><span>([^<]+)</span>', h)
groups = [('Diseño', tools[:7]), ('Web y desarrollo', tools[7:15]), ('Y también', tools[15:])]
tg = ''.join('<div class="tg"><p class="k">%s <span>%02d</span></p><ul>%s</ul></div>' % (g, len(t), ''.join(
    '<li><canvas data-tool="%s" data-c="%s" width="16" height="16"></canvas><b>%s</b><span>%s</span></li>' % x for x in t)) for g, t in groups)
pages.append('''<section class="pg tools" id="p14"><div class="sh"><p class="sc">lo que uso</p><h2>Herramientas</h2><p>Lo que uso para diseñar y para programar.</p></div><div class="tl-g">%s</div>%s</section>''' % (tg, ft(14)))

# 15 · contacto
pages.append('''<section class="pg end" id="p15"><p class="k">Contacto</p><div class="end-g"><div><p class="sc">¿hablamos?</p><h2>Paula Urbano</h2>
<p class="end-d">Si buscas a alguien que diseñe tu web y también la programe, escríbeme. Contesto rápido.</p>
<ul class="ct"><li><span>Correo</span><a href="mailto:%s">%s</a></li><li><span>Teléfono</span><b>+34 603 758 205</b></li><li><span>Web</span><a href="%s">paulaurbanog.com</a></li><li><span>LinkedIn</span><a href="%s">linkedin.com/in/paula-urbano-436619332</a></li><li><span>Ciudad</span><b>Valencia, España</b></li></ul></div>
<div class="end-q"><a href="%s">%s</a><span>Escanea para ver mi portfolio en vivo</span></div></div></section>''' % (MAIL, MAIL, WEB, LI, WEB, qr(WEB, '#221616')))

from PIL import Image
os.makedirs('img', exist_ok=True)
def jpg(m):
    p = m.group(1).split('?')[0]; out = 'img/' + p.replace('../img/', '').replace('/', '_').rsplit('.', 1)[0] + '.jpg'
    if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(p):
        im = Image.open(p); bg = Image.new('RGB', im.size, '#ffffff'); im = im.convert('RGBA'); bg.paste(im, mask=im.split()[3])
        bg.thumbnail((1400, 1400)); bg.save(out, quality=82, optimize=True, progressive=True)
    return 'src="%s"' % out
pages = [re.sub(r'src="((?:\.\./img|shots)/[^"]+)"', jpg, x) for x in pages]
html = open('template.html').read().replace('<!--PAGES-->', '\n'.join(pages)).replace('/*PIX*/', PIX + cut('  function shade(', "  $$('canvas[data-tool]')"))
open('portfolio.html', 'w').write(html)
print('ok', len(html))
