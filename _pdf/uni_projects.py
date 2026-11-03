# Proyectos del PDF para la uni (versión corregida con el profesor):
# fondo blanco · 2 páginas por proyecto (Vora aparte) · en cada web, lo que hice explicado y una página con 4 mockups.
# Lo carga uni.py (usa page, flat y os de allí). Las imágenes viven en uni/w/ (mockups ya sobre blanco) y mock/n-*.png.
import qrcode

W, INK = '#FFFFFF', '#221616'

def qr(url):
    q = qrcode.QRCode(border=0, box_size=1); q.add_data(url); q.make(); m = q.get_matrix(); n = len(m)
    return '<svg class="qr" viewBox="0 0 %d %d" shape-rendering="crispEdges">%s</svg>' % (n, n, ''.join('<rect x="%d" y="%d" width="1" height="1"/>' % (x, y) for y, r in enumerate(m) for x, v in enumerate(r) if v))

def link(url, txt):
    return '<a class="go" href="%s">%s<span>Ver en vivo<b>%s</b></span></a>' % (url, qr(url), txt)

def src(s):
    return flat(s, W) if s.startswith('mock/') else s

def A(name, cat, desc, hice, rows, img, url=None, box=None, cap=''):
    """Página 1 del proyecto: qué es y qué hice yo, y la imagen principal."""
    li = ''.join('<li>%s</li>' % x for x in hice)
    r = ''.join('<dl><dt>%s</dt><dd>%s</dd></dl>' % x for x in rows)
    g = link(url, url.split('//')[1].rstrip('/')) if url else ''
    lg = img.endswith('.svg')
    fig = '<figure class="a2-i%s"%s><img src="%s" alt="">%s</figure>' % (
        ' lg' if lg else '', ' style="background:%s"' % box if box else '', src(img),
        '<figcaption>%s</figcaption>' % cap if cap else '')
    page('<div class="a2"><div class="a2-t"><h2>%s</h2><p class="cat">%s</p><i class="rule"></i><p class="desc">%s</p>'
         '<div class="hice"><p class="k">Lo que hice</p><ul>%s</ul></div><div class="rows">%s</div>%s</div>%s</div>'
         % (name, cat, desc, li, r, g, fig), 'proj white', W, INK)

def G(items, cls='g4'):
    """Página de mockups: cada uno en su sitio, sin encimarse, con su pie."""
    page('<div class="%s">%s</div>' % (cls, ''.join(
        '<figure><div class="fr"><img src="%s" alt=""></div><figcaption>%s</figcaption></figure>' % (src(s), c) for s, c in items)),
         'proj white', W, INK)

w = lambda n: 'uni/w/%s.jpg' % n

# ---------------- WEB ----------------
A('Nails by MelyG', 'Diseño web / UX/UI / Desarrollo · Katy, Texas',
  'Estudio de manicura rusa. Las clientas diseñan sus uñas y su gift card antes de reservar.',
  ['Diseño en Figma, UX/UI y desarrollo de toda la web.',
   'Un simulador: la clienta elige color, forma y acabado.',
   'Gift cards que se diseñan en la web y se envían por WhatsApp.',
   'Reservas conectadas con Square.',
   'En inglés o en español, según el teléfono.'],
  [('Su marca', 'Logo, tipografía, colores y fotos (de la clienta)'), ('Técnicas', 'Figma · HTML · CSS · JavaScript · GSAP · Square')],
  w('nails-pag04-1'), 'https://nailsbymelyg.com/')
G([(w('nails-pag05-1'), 'Simulador: color, forma y acabado antes de reservar.'),
   (w('nails-pag06-1'), 'Gift card: se diseña en la web y se envía por WhatsApp.'),
   (w('nails-pag07-1'), 'Todo pensado primero para el celular.'),
   (w('nails-pag09-1'), 'Cursos de manicura rusa.')])

A('Kronox', 'Diseño web / Panel de administración / Desarrollo · Sevilla',
  'Director de videoclips. Sus videos, reseñas y condiciones en un sitio, y un panel para cambiarla él solo.',
  ['UX/UI y código de la web y del panel.',
   'Un panel propio: él cambia videos, fotos, tarifas y reseñas sin llamarme.',
   'Tarifas y condiciones claras antes de que le escriban.',
   'Reseñas de sus clientes en la propia web.'],
  [('Su marca', 'Logo, tipografía, colores y videos (del cliente)'), ('Técnicas', 'HTML · CSS · JavaScript · Firebase')],
  w('kronox-pag11-1'), 'https://kronoxprod.netlify.app/')
G([(w('kronox-pag12-1'), 'El panel: él mismo cambia videos, fotos, tarifas y reseñas.'),
   (w('kronox-pag13-1'), 'Tarifas y condiciones claras.'),
   (w('kronox-pag14-1'), 'En rodaje.'),
   (w('kronox-pag15-1'), 'Opiniones de sus clientes.')])

A('Nácar Estilismo', 'Tienda online / Tema de Shopify / Desarrollo · Sevilla',
  'Tienda de ropa. Un tema de Shopify hecho desde cero, en seis idiomas.',
  ['Diseño y desarrollo del tema de Shopify desde cero.',
   'Seis idiomas.',
   'La cesta se abre a un lado, sin sacarte de donde estabas.',
   'Pensada primero para el celular.'],
  [('Su marca', 'Logo, tipografía y colores (de la clienta)'), ('Técnicas', 'Shopify · Liquid')],
  w('nacar-pag16-1'))
G([('mock/n-nacar-prod.png', 'Ficha de producto.'),
   ('mock/n-nacar-cart.png', 'La cesta se abre a un lado.'),
   (w('nacar-pag17-1'), 'La compra en el celular: producto, cesta y pedido.'),
   ('mock/n-nacar-lang.png', 'Seis idiomas.')])

A('Entre Amigos por Venezuela', 'App web / Investigación / UX/UI / Desarrollo',
  'App para organizar la ayuda de un grupo de amigos tras los terremotos. Ligera, para que cargue rápido aunque la conexión sea mala.',
  ['Investigación, UX/UI y desarrollo.',
   'El camino de una ayuda: publicar, match, comprar, llevar y confirmar.',
   'Un PIN de 4 dígitos para que quien donó sepa que llegó.',
   'Ligera, para conexiones malas.'],
  [('Su marca', 'Logo, tipografía y colores (del grupo)'), ('Técnicas', 'HTML · CSS · JavaScript')],
  w('entre-amigos-pag18-1'))
G([('mock/n-ea-12.png', 'Se publica la necesidad y, si un local cercano la tiene, sale el match.'),
   ('mock/n-ea-34.png', 'Un donante lo compra y un conductor se ofrece a llevarlo.'),
   ('mock/n-ea-5.png', 'Se confirma con el PIN.'),
   (w('entre-amigos-pag19-1'), 'Todo el camino, de principio a fin.')])

# ---------------- PORTFOLIOS ----------------
A('Jairo Azogue', 'Diseño web / Portfolio',
  'Director y editor de video. Su trabajo ordenado por tipo de pieza, y sus herramientas como si fueran su escritorio.',
  ['Diseño y desarrollo de su web.',
   'Videoclips ordenados por tipo de pieza.',
   'Sus herramientas, presentadas como su escritorio.',
   'Publicada en su propio dominio.'],
  [('Técnicas', 'HTML · CSS · JavaScript')],
  w('jairo-pag20-1'), 'https://jairoazogue.com/')
G([('mock/n-jairo.png', 'Inicio.'),
   (w('jairo-pag21-1'), 'Herramientas, como su escritorio.'),
   (w('jairo-pag22-1'), 'Videoclips por tipo de pieza.'),
   (w('jairo-pag23-1'), 'La pieza destacada, a pantalla completa.')])

A('Catalina Silva', 'Diseño web / Portfolio',
  '3D y animación. La hicimos para que pudiera pedir prácticas en estudios de 3D.',
  ['Diseño y desarrollo de su web.',
   'Se lee como una hoja de animación: escenas, planos y fotogramas.',
   'Su personaje y su ficha, como una hoja de modelo.'],
  [('Técnicas', 'HTML · CSS · JavaScript')],
  w('catalina-pag24-1'), 'https://catalinasilva.netlify.app/')
G([('mock/n-cata.png', 'Inicio.'),
   (w('catalina-pag25-1'), 'Sobre mí: su personaje y su ficha.'),
   (w('catalina-pag26-1'), 'Personal: hecho a mano, como un cuaderno.'),
   (w('catalina-pag27-1'), 'Identidad visual.')])

A('ZogueKidd', 'Diseño web / Portfolio',
  'Videoclips. Usa la misma base que la web de Kronox, con una estética totalmente distinta.',
  ['Diseño y desarrollo de su web.',
   'La base de Kronox, con otra estética.',
   'Cada videoclip con su portada y su dirección.'],
  [('Técnicas', 'HTML · CSS · JavaScript')],
  w('zoguekidd-pag28-1'), 'https://zoguekidd.netlify.app/')
G([('mock/n-zk.png', 'Inicio.'),
   (w('zoguekidd-pag29-1'), 'Videoclips: cada pieza con su portada.'),
   (w('zoguekidd-pag30-1'), 'Quién soy.'),
   (w('zoguekidd-pag31-1'), 'Qué hago.')])

# ---------------- UNIVERSIDAD ----------------
A('WordPress', 'Tema propio / PHP / Universidad',
  'Dos webs con un tema de WordPress hecho por mí: el panel se rellena y la web se actualiza sola.',
  ['Tema propio en PHP, con campos personalizados (ACF).',
   'Cada dato de contacto se cambia desde el panel, sin tocar código.',
   'Al rellenar la ficha de una película, su página se monta sola.'],
  [('Técnicas', 'PHP · ACF · WordPress')],
  w('wordpress-pag32-1'))
G([(w('wordpress-pag33-1'), 'Robotika · Contacto. En amarillo: el campo del panel y dónde aparece en la web.'),
   (w('wordpress-pag34-1'), 'Cada dato se cambia desde el panel.'),
   (w('wordpress-pag35-1'), 'La ficha de la película monta su página.'),
   ('uni/w/wp-extra.jpg', 'Título, director y actores, desde el panel.')], 'g4 flatshots')

A('Figma', 'UX/UI / Prototipos / Universidad',
  'Dos tiendas online diseñadas en Figma, con su prototipo navegable.',
  ['DTR: tienda de ropa, con componentes y variantes.',
   'Coldculture: rediseño de la tienda de una marca que ya existe.',
   'Prototipo navegable de principio a fin: producto, login y carrito.'],
  [('Técnicas', 'Figma · componentes · variantes · prototipo')],
  w('figma-pag36-1'))
G([(w('figma-pag37-1'), 'DTR · ficha de producto.'),
   (w('figma-pag38-1'), 'DTR · inicio de sesión.'),
   (w('figma-pag39-1'), 'DTR · carrito y resumen del pedido.'),
   (w('figma-pag40-1'), 'Coldculture · rediseño de la tienda.')])

A('Chía', 'App / UX/UI / Universidad',
  'App de hábitos: cuidas a tu perrita cumpliendo los tuyos (agua, paseo, comida y estudio).',
  ['Diseño de la app en Figma, en tamaño Android.',
   'Cada hábito cumplido da semillas.',
   'Con las semillas se viste a Chía en su armario.'],
  [('Técnicas', 'Figma · componentes · prototipo')],
  w('chia-pag42-1'))
G([(w('chia-pag43-1'), 'De paseo y armario: cada hábito da semillas para vestir a Chía.')], 'g1')

# Hojas del storyboard: (número de hoja, [(plano, imagen)]). Las imágenes sueltas no venían en orden de plano.
ORDEN = {1: [(1, 3), (2, 2), (3, 1)], 2: [(4, 6), (5, 5), (6, 4)], 4: [(10, 12), (11, 11), (12, 10)],
         5: [(13, 13), (14, 15), (15, 14)], 7: [(19, 21), (20, 19), (21, 20)]}
def sheet(n):
    fr = ''.join('<div class="sf"><img src="uni/sbr/ratatouille-%02d.jpg" alt=""><b>%02d</b></div>' % (im, p) for p, im in ORDEN[n])
    return '<div class="sheet"><p class="sh"><span>Ratatouille · escena final</span><span>Hoja %d / 7</span></p>%s</div>' % (n, fr)

page('<div class="a2"><div class="a2-t"><h2>Storyboard · Ratatouille</h2><p class="cat">Storyboard / Narrativa visual / Universidad</p><i class="rule"></i>'
     '<p class="desc">Mi versión de la escena final de la película (Pixar, 2007). 21 planos, unos 56 segundos.</p>'
     '<div class="hice"><p class="k">Lo que hice</p><ul><li>Cambié la escena: Remy cocina el ratatouille para Ego a través de Linguini, montado en su cabeza.</li>'
     '<li>Dibujé los 21 planos.</li><li>Cada plano lleva encuadre, cámara y acción.</li></ul></div>'
     '<div class="rows"><dl><dt>Técnicas</dt><dd>Dibujo digital · planos y encuadres</dd></dl></div></div>'
     '<div class="sheets k2">%s%s</div></div>' % (sheet(1), sheet(2)), 'proj white', W, INK)
page('<div class="sheets k3">%s%s%s</div>' % (sheet(4), sheet(5), sheet(7)), 'proj white', W, INK)

# ---------------- BRANDING ----------------
def BR(name, cat, desc, hice, tec, logo, bg, ink, h=380):
    """Portada de identidad: a color completo, todo centrado."""
    page('<div class="br"><img src="%s" alt="" style="height:%dpx"><h2>%s</h2><p class="cat">%s</p><p class="desc">%s</p>'
         '<p class="bh"><span>Lo que hice</span>%s</p><p class="bh"><span>Técnicas</span>%s</p></div>'
         % (logo, h, name, cat, desc, ' · '.join(hice), tec), 'proj dark', bg, ink)

BR('Vora', 'Branding / Naming', 'Beach club en El Saler. «Vora» significa orilla en valenciano.',
   ['El nombre', 'el logo', 'la carta', 'la señalética', 'el merch'], 'Illustrator · Photoshop', '../img/logos/vora.svg', '#AB4729', '#F6E9D7')
G([(w('vora-pag49-1'), 'Señalética de la entrada.')], 'g1 photo')
G([(w('vora-pag50-1'), 'Interior.'), (w('vora-pag50-2'), 'La carta.')], 'g2 photo')
G([(w('vora-pag51-1'), 'Mesa.'), (w('vora-pag51-2'), 'Mantel.'), (w('vora-pag51-3'), 'Merch.')], 'g3 photo')
G([(w('vora-pag52-1'), 'La carta en la playa.')], 'g1 photo')

BR('Café del Sur', 'Rediseño de marca', 'Una marca de café con una imagen muy anticuada. La rediseñé para que pareciera un café de especialidad.',
   ['El rediseño del logo', 'la nueva imagen de la marca'], 'Illustrator', '../img/logos/cafe.svg', '#FBE9D6', '#5A1A18', 330)
page('<div class="vers"><figure style="background:#FFFFFF;box-shadow:inset 0 0 0 1px rgba(34,22,22,.1)"><img src="../img/logos/cafe.svg" alt=""><figcaption>Versión en positivo</figcaption></figure>'
     '<figure style="background:#E63837"><img class="neg" src="../img/logos/cafe.svg" alt=""><figcaption>Versión en negativo</figcaption></figure></div>', 'proj white', W, INK)

BR('Nidoo', 'Branding / Identidad digital', 'Un estudio de diseño digital.',
   ['La marca', 'los personajes', 'la papelería', 'la web'], 'Illustrator · Photoshop · Figma', '../img/logos/nidoo.svg', '#2D1B7F', '#F2F0FA', 200)
G([(w('nidoo-pag57-1'), 'Tarjetas.'), (w('nidoo-pag57-2'), 'Carpeta.'), (w('nidoo-pag58-1'), 'Credenciales.')], 'g3 photo')

