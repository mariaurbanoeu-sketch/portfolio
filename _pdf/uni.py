# Genera _pdf/uni.html (portfolio para la uni, con la estructura del ejemplo del profesor);
# luego: node _pdf/render.js Paula-Urbano-Portfolio-Uni.pdf uni.html  (con el servidor en :8794 desde la raíz)
# 1920 × 1080 · solo Montserrat en pesos medios · imágenes de 1300 px · colores de la web
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

MAIL = 'mariaurbanoeu@gmail.com'
WEB = 'paulaurbanog.com'
LI = 'linkedin.com/in/paula-urbano-436619332'

from PIL import Image
os.makedirs('uni/flat', exist_ok=True)
def flat(src, bg, w=1300):
    if src.endswith('.svg'): return src
    out = 'uni/flat/%s-%s.jpg' % (os.path.splitext(os.path.basename(src))[0], bg.strip('#').lower())
    if not os.path.exists(out):
        im = Image.open(src).convert('RGBA')
        if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        base = Image.new('RGBA', im.size, bg); base.alpha_composite(im)
        base.convert('RGB').save(out, quality=86, optimize=True, progressive=True, dpi=(72, 72))
    return out

pages = []
def page(html, cls='', bg=None, ink=None):
    st = ''
    if bg: st += '--bg:%s;' % bg
    if ink: st += '--ink:%s;' % ink
    pages.append('<section class="pg %s" style="%s">%s</section>' % (cls, st, html))

def chev(): return '<span class="chev" aria-hidden="true"><i></i><i></i><i></i></span>'

# 1 · portada
page('''<div class="cv">
  <p class="cv-n">Paula<br>Urbano</p>
  <i class="cv-r"></i>
  <h1>Portfolio</h1>
  %s
</div>''' % chev(), 'cover')

# 2 · sobre mí + CV  (la foto: guárdala como _pdf/uni/foto.jpg y vuelve a generar)
FOTO = '<figure class="ph-me"><img src="uni/foto.jpg" alt=""></figure>' if os.path.exists('uni/foto.jpg') else '<figure class="ph-me empty"><span>Tu foto aquí</span></figure>'
page('''<div class="ab">
  <div class="ab-l">
    <h2>Sobre mí</h2>
    <p>Vengo del diseño gráfico. Aprendí a programar porque quería que mis diseños salieran de Figma y funcionaran de verdad.</p>
    <p>Diseño cada web y la programo yo, para que lo que se aprueba en el diseño sea lo que sale publicado. Desde 2025 hago webs para clientes reales, pensadas para que puedan gestionarlas solos.</p>
    %s
    %s
  </div>
  <div class="ab-r">
    <h3>CV</h3>
    <div class="cvg">
      <dl><dt>Contacto</dt><dd>%s<br>%s<br>Valencia, España</dd></dl>
      <dl><dt>Hago</dt><dd>Diseño UX/UI<br>Desarrollo web</dd></dl>
      <dl><dt>Estudios</dt><dd>Multimedia y Artes Digitales<br>UCV · último año</dd></dl>
      <dl><dt>Experiencia</dt><dd>Webs para clientes reales<br>desde 2025</dd></dl>
      <dl><dt>Idiomas</dt><dd>Español<br>Inglés</dd></dl>
      <dl><dt>Busco</dt><dd>Prácticas desde enero,<br>con convenio</dd></dl>
      <dl><dt>Diseño</dt><dd>Figma · Illustrator · Photoshop<br>InDesign · Affinity · Canva</dd></dl>
      <dl><dt>Web</dt><dd>HTML y CSS · JavaScript<br>Shopify · WordPress · PHP<br>Firebase · Git</dd></dl>
    </div>
  </div>
</div>''' % (FOTO, chev(), MAIL, WEB), 'about')

# 3 · índice
IX = [('01', 'Web', 'mock/nails-1.png', ['Nails by MelyG', 'Kronox', 'Nácar Estilismo', 'Entre Amigos']),
      ('02', 'Portfolios', 'mock/jairo-1.png', ['Jairo Azogue', 'Catalina Silva', 'ZogueKidd']),
      ('03', 'Universidad', 'mock/figma-1.png', ['WordPress', 'Figma']),
      ('04', 'Branding', 'uni/id/vora-p03.png', ['Vora', 'Café del Sur', 'Nidoo'])]
tiles = ''.join('<div class="tile"><div class="th"><img src="%s" alt=""><b>%s</b></div><p class="tc">%s</p><ul>%s</ul></div>' % (flat(img, '#3a2626', 900), n, c, ''.join('<li>/ %s</li>' % x for x in xs)) for n, c, img, xs in IX)
page('<div class="ix">%s</div><p class="sig">Paula Urbano<b>Portfolio</b></p>' % tiles, 'index', '#221616', '#FAF6F0')

# proyectos: página A (texto + imagen grande) y, si hace falta, página B (imágenes)
def proj(name, cat, desc, rows, img, bg, ink, cap='', dark=False):
    r = ''.join('<dl><dt>%s</dt><dd>%s</dd></dl>' % x for x in rows)
    c = '<figcaption>%s</figcaption>' % cap if cap else ''
    page('''<div class="pa">
  <div class="pa-t"><h2>%s</h2><p class="cat">%s</p><i class="rule"></i><p class="desc">%s</p><div class="rows">%s</div></div>
  <figure class="pa-i"><img src="%s" alt="">%s</figure>
</div>''' % (name, cat, desc, r, flat(img, bg), c), 'proj' + (' dark' if dark else ''), bg, ink)

def imgs(items, bg, ink, dark=False):
    f = ''.join('<figure><img src="%s" alt=""><figcaption>%s</figcaption></figure>' % (flat(a, bg), b) for a, b in items)
    page('<div class="pb n%d">%s</div>' % (len(items), f), 'proj' + (' dark' if dark else ''), bg, ink)

# WEB
proj('Nails by MelyG', 'Diseño web / UX/UI / Desarrollo / Reservas online',
     'Estudio de manicura en Katy, Texas. Las clientas diseñan sus uñas y su gift card antes de reservar: una experiencia que la diferencia de la competencia.',
     [('Mi trabajo', 'UX/UI y código'), ('Su marca', 'Logo, tipografía, colores y fotos'), ('Técnicas', 'Figma · HTML · CSS · JavaScript · GSAP · Square'),
      ('Proceso', 'Diseño en Figma y desarrollo a medida, conectado a Square para reservas, pagos y gift cards.')],
     'mock/nails-1.png', '#F3ECE8', '#3A1A21', 'nailsbymelyg.com')
imgs([('mock/nails-2.png', 'El simulador: color, forma y acabado antes de reservar.'),
      ('mock/nails-3.png', 'En el celular, con la gift card que se diseña y se envía por WhatsApp.')], '#F3ECE8', '#3A1A21')
imgs([('mock/nails-4.png', 'Fichas del look: trabajos reales para inspirarse antes de reservar.')], '#F3ECE8', '#3A1A21')

proj('Kronox', 'Diseño web / Panel de administración / Desarrollo',
     'Director de videoclips en Sevilla. Sus videos, reseñas y condiciones en un solo sitio, y un panel propio para gestionarla sin depender de mí.',
     [('Mi trabajo', 'UX/UI y código de la web y del panel'), ('Su marca', 'Logo, tipografía, colores y videos'), ('Técnicas', 'HTML · CSS · JavaScript · Firebase'),
      ('Proceso', 'Diseño de la web y del panel, y desarrollo con Firebase para que la gestione también desde el celular.')],
     'mock/kronox-1.png', '#0B0B0A', '#EDE6DA', 'kronoxprod.netlify.app', True)
imgs([('mock/kronox-4.png', 'El panel: cambia videos, fotos, tarifas y reseñas él solo.'),
      ('mock/kronox-2.png', 'Tarifas y condiciones claras antes de escribirle.')], '#0B0B0A', '#EDE6DA', True)
imgs([('mock/kronox-3.png', 'En rodaje: las fotos que él sube desde el panel.'),
      ('mock/kronox-5.png', 'Opiniones de sus clientes, aprobadas por él.')], '#0B0B0A', '#EDE6DA', True)

proj('Nácar Estilismo', 'Tienda online / Tema de Shopify / Desarrollo',
     'Tienda de ropa en Sevilla que vende con Shopify. Llamativa, intuitiva y en seis idiomas.',
     [('Mi trabajo', 'UX/UI y tema de Shopify desde cero'), ('Su marca', 'Logo, tipografía y colores'), ('Técnicas', 'Shopify · Liquid'),
      ('Proceso', 'Diseño y desarrollo del tema a medida, y mantenimiento: subo los productos nuevos.')],
     'mock/nacar-1.png', '#EFE7DC', '#2B231C', 'La portada en el ordenador y en el celular.')
imgs([('mock/nacar-2.png', 'El selector de idioma: seis idiomas desde arriba.')], '#EFE7DC', '#2B231C')

proj('Entre Amigos por Venezuela', 'App web / Investigación / UX/UI / Desarrollo',
     'App para un grupo de amigos que organizaba ayuda tras los terremotos en Venezuela. Ligera, para que cargue rápido aunque la conexión sea mala.',
     [('Mi trabajo', 'Investigación, UX/UI y código'), ('Su marca', 'Logo, tipografía y colores'), ('Técnicas', 'HTML · CSS · JavaScript'),
      ('Proceso', 'Investigación, diseño y desarrollo en una semana.')],
     'mock/amigos-1.png', '#0F1E3D', '#F4F1EA', 'El camino de una ayuda: se publica, hay match, se compra, se lleva y se confirma con un PIN.', True)

# PORTFOLIOS
proj('Jairo Azogue', 'Diseño web / Portfolio / Desarrollo',
     'Director y editor de video. Su trabajo ordenado por tipo de pieza, y sus herramientas presentadas como si fueran su escritorio. Ya está en su propio dominio.',
     [('Mi trabajo', 'UX/UI y código'), ('Proceso', 'Antes de diseñar miré qué busca la gente de su sector en un portfolio.')],
     'mock/jairo-1.png', '#141210', '#EDE3D3', 'jairoazogue.com', True)
imgs([('mock/jairo-2.png', 'Cada pieza, con su vídeo a pantalla completa.')], '#141210', '#EDE3D3', True)
proj('Catalina Silva', 'Diseño web / Portfolio / Desarrollo',
     '3D y animación. La hicimos para que pudiera pedir prácticas en estudios de 3D.',
     [('Mi trabajo', 'UX/UI y código'), ('Proceso', 'La web se lee como una hoja de animación: cada sección es una escena con sus planos (ESC. / PL.) y un contador de fotogramas (F.).')],
     'mock/cata-1.png', '#F6E7EA', '#2A1714', 'catalinasilva.netlify.app')
imgs([('mock/cata-2.png', 'Animación: cada trabajo, en su escena.'),
      ('mock/cata-3.png', 'Identidad visual, la otra parte de su trabajo.')], '#F6E7EA', '#2A1714')
proj('ZogueKidd', 'Diseño web / Portfolio / Desarrollo',
     'Videoclips. Usa la misma base que la web de Kronox, con una estética totalmente distinta.',
     [('Mi trabajo', 'UX/UI y código')],
     'mock/zk-1.png', '#111111', '#EDE6DA', 'zoguekidd.netlify.app', True)

# UNIVERSIDAD
proj('WordPress', 'Tema de WordPress / PHP / Universidad',
     'Temas que programé desde cero en la universidad. Quien gestiona la web rellena el panel y la página se actualiza sola.',
     [('Técnicas', 'PHP · tipos de contenido personalizados · campos con ACF')],
     'mock/wp-1.png', '#36321F', '#FAF6F0', 'Robotika: la página «Quiénes somos», editable desde el panel.', True)
proj('Figma', 'UX/UI / Prototipos / Universidad',
     'Proyectos de la universidad que viven en Figma, con su prototipo navegable: DTR, Coldculture y Estilo Vivo.',
     [('Técnicas', 'Figma · componentes y variantes · prototipo')],
     'mock/figma-1.png', '#1E1E1E', '#FFFFFF', 'DTR: tienda online de una marca de ropa inventada.', True)
imgs([('mock/figma-2.png', 'Estilo Vivo: tarjetas, valoraciones y botones con estados.')], '#1E1E1E', '#FFFFFF', True)

# BRANDING
proj('Vora', 'Branding / Naming / Aplicaciones',
     'Beach club en El Saler. «Vora» significa orilla en valenciano: hice el nombre, el logo, la carta, la señalética y el merch.',
     [('Técnicas', 'Illustrator · Photoshop')],
     'uni/id/vora-p01.png', '#F1E6D6', '#3A1D12')
imgs([('uni/id/vora-p02.png', 'La señalética de la entrada.'), ('uni/id/vora-p09.png', 'La bolsa del merch.')], '#F1E6D6', '#3A1D12')
imgs([('uni/id/vora-p03.png', 'Señalética interior.'), ('uni/id/vora-p06.png', 'La carta en la mesa.'), ('uni/id/vora-p08.png', 'El delantal.')], '#F1E6D6', '#3A1D12')
imgs([('uni/id/vora-p04.png', 'Servilletas y aros.'), ('uni/id/vora-p07.png', 'La carta abierta.'), ('uni/id/vora-p10.png', 'Cajas para llevar.')], '#F1E6D6', '#3A1D12')
proj('Café del Sur', 'Rediseño de marca / Packaging',
     'Una marca de café con una imagen muy anticuada. La rediseñé para que pareciera un café de especialidad.',
     [('Técnicas', 'Illustrator · Photoshop')],
     '../img/logos/cafe.svg', '#FBE9D6', '#5A1A18')
imgs([('uni/id/cafe-p03.png', 'El packaging.'), ('uni/id/cafe-p04.png', 'La lata.')], '#FBE9D6', '#5A1A18')
imgs([('uni/id/cafe-p02.png', 'Tarjetas y vasos para llevar.'), ('uni/id/cafe-p05.png', 'El delantal.')], '#FBE9D6', '#5A1A18')
proj('Nidoo', 'Branding / Identidad digital',
     'Un estudio de diseño digital: la marca, los personajes, la papelería y la web.',
     [('Técnicas', 'Illustrator · Photoshop · Figma')],
     'uni/id/nidoo-p01.png', '#2D1B7F', '#F2F0FA', '', True)
imgs([('uni/id/nidoo-p11.png', 'La web.'), ('uni/id/nidoo-p06.png', 'Las credenciales.')], '#2D1B7F', '#F2F0FA', True)
imgs([('uni/id/nidoo-p02.png', 'Tarjetas de visita.'), ('uni/id/nidoo-p03.png', 'Sobres.'), ('uni/id/nidoo-p04.png', 'Carpeta.')], '#2D1B7F', '#F2F0FA', True)
imgs([('uni/id/nidoo-p07.png', 'Pósters.'), ('uni/id/nidoo-p09.png', 'Redes sociales.')], '#2D1B7F', '#F2F0FA', True)

# contraportada
page('''<div class="bk"><i class="blk"></i>%s<div class="bk-t"><p class="bk-n">Paula<br>Urbano</p><p>%s<br>%s<br>%s</p></div></div>''' % (chev(), MAIL, WEB, LI), 'back', '#221616', '#FAF6F0')

N = len(pages)
out = []
for i, p in enumerate(pages):
    if 1 <= i < N - 1:
        p = p.replace('</section>', '<footer class="num">%02d</footer></section>' % (i + 1))
    out.append(p)
html = open('uni-template.html').read().replace('<!--PAGES-->', '\n'.join(out))
open('uni.html', 'w').write(html)
print(N, 'páginas')
