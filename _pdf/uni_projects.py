# Proyectos del PDF para la uni: textos muy cortos, mucha imagen y un QR + enlace a la web en cada uno.
# Lo carga uni.py (usa page, flat y os de allí).
import qrcode

def qr(url):
    q = qrcode.QRCode(border=0, box_size=1); q.add_data(url); q.make(); m = q.get_matrix(); n = len(m)
    return '<svg class="qr" viewBox="0 0 %d %d" shape-rendering="crispEdges">%s</svg>' % (n, n, ''.join('<rect x="%d" y="%d" width="1" height="1"/>' % (x, y) for y, r in enumerate(m) for x, v in enumerate(r) if v))

def link(url, txt):
    return '<a class="go" href="%s">%s<span>Ver en vivo<b>%s</b></span></a>' % (url, qr(url), txt)

def proj(name, cat, desc, rows, img, bg, ink, url=None, dark=False):
    r = ''.join('<dl><dt>%s</dt><dd>%s</dd></dl>' % x for x in rows)
    g = link(url, url.split('//')[1].rstrip('/')) if url else ''
    html = ('<div class="pa"><div class="pa-t"><h2>%s</h2><p class="cat">%s</p><i class="rule"></i><p class="desc">%s</p><div class="rows">%s</div>%s</div>'
            '<figure class="pa-i"><img src="%s" alt=""></figure></div>') % (name, cat, desc, r, g, flat(img, bg))
    page(html, 'proj' + (' dark' if dark else ''), bg, ink)

def full(img, cap, bg, ink, dark=False):
    page('<figure class="fu"><img src="%s" alt=""><figcaption>%s</figcaption></figure>' % (flat(img, bg, 1300), cap), 'proj' + (' dark' if dark else ''), bg, ink)

def imgs(items, bg, ink, dark=False):
    f = ''.join('<figure><img src="%s" alt=""><figcaption>%s</figcaption></figure>' % (flat(a, bg), b) for a, b in items)
    page('<div class="pb n%d">%s</div>' % (len(items), f), 'proj' + (' dark' if dark else ''), bg, ink)

# WEB
B = '#F3ECE8', '#3A1A21'
proj('Nails by MelyG', 'Diseño web / UX/UI / Desarrollo', 'Las clientas diseñan sus uñas y su gift card antes de reservar.',
     [('Mi trabajo', 'UX/UI y código'), ('Su marca', 'Logo, tipografía, colores y fotos'), ('Técnicas', 'Figma · JavaScript · GSAP · Square')],
     'mock/nails-5.png', *B, 'https://nailsbymelyg.com/')
full('mock/nails-2.png', 'Simulador: color, forma y acabado.', *B)
imgs([('mock/nails-3.png', 'Gift card y simulador en el celular.'), ('mock/nails-6.png', 'Cursos, técnica y estudio.')], *B)
full('mock/nails-4.png', 'Trabajos reales para inspirarse.', *B)

B = '#0B0B0A', '#EDE6DA'
proj('Kronox', 'Diseño web / Panel de administración / Desarrollo', 'Videos, reseñas y condiciones en un sitio. Y un panel para gestionarla solo.',
     [('Mi trabajo', 'UX/UI y código'), ('Su marca', 'Logo, tipografía, colores y videos'), ('Técnicas', 'JavaScript · Firebase')],
     'mock/kronox-6.png', *B, 'https://kronoxprod.netlify.app/', True)
full('mock/kronox-7.png', 'Videoclips, rodaje y contacto.', *B, True)
imgs([('mock/kronox-4.png', 'El panel.'), ('mock/kronox-2.png', 'Tarifas y condiciones.')], *B, True)
imgs([('mock/kronox-3.png', 'En rodaje.'), ('mock/kronox-5.png', 'Opiniones.')], *B, True)

B = '#EFE7DC', '#2B231C'
proj('Nácar Estilismo', 'Tienda online / Tema de Shopify / Desarrollo', 'Tienda de ropa en Sevilla. Seis idiomas.',
     [('Mi trabajo', 'UX/UI y tema de Shopify'), ('Su marca', 'Logo, tipografía y colores'), ('Técnicas', 'Shopify · Liquid')],
     'mock/nacar-3.png', *B)
full('mock/nacar-4.png', 'Novedades, producto y cesta.', *B)
imgs([('mock/nacar-5.png', 'La compra en el celular.'), ('mock/nacar-2.png', 'Selector de idioma.')], *B)

B = '#0F1E3D', '#F4F1EA'
proj('Entre Amigos por Venezuela', 'App web / Investigación / UX/UI', 'Ayuda organizada tras los terremotos. Ligera para conexiones malas.',
     [('Mi trabajo', 'Investigación, UX/UI y código'), ('Su marca', 'Logo, tipografía y colores'), ('Técnicas', 'HTML · CSS · JavaScript')],
     'mock/amigos-2.png', *B, None, True)
full('mock/amigos-1.png', 'Publicar, match, comprar, llevar, confirmar con PIN.', *B, True)

# PORTFOLIOS
B = '#141210', '#EDE3D3'
proj('Jairo Azogue', 'Diseño web / Portfolio', 'Director y editor de video. Su trabajo, como su escritorio.',
     [('Mi trabajo', 'UX/UI y código')], 'mock/jairo-3.png', *B, 'https://jairoazogue.com/', True)
imgs([('mock/jairo-4.png', 'Herramientas, videoclips y 3D.'), ('mock/jairo-2.png', 'Cada pieza, a pantalla completa.')], *B, True)

B = '#F6E7EA', '#2A1714'
proj('Catalina Silva', 'Diseño web / Portfolio', '3D y animación. Se lee como una hoja de animación: escenas, planos y fotogramas.',
     [('Mi trabajo', 'UX/UI y código')], 'mock/cata-4.png', *B, 'https://catalinasilva.netlify.app/')
imgs([('mock/cata-5.png', 'Sobre mí, personal y video.'), ('mock/cata-2.png', 'Animación.')], *B)

B = '#111111', '#EDE6DA'
proj('ZogueKidd', 'Diseño web / Portfolio', 'Videoclips. La base de Kronox con otra estética.',
     [('Mi trabajo', 'UX/UI y código')], 'mock/zk-2.png', *B, 'https://zoguekidd.netlify.app/', True)
full('mock/zk-3.png', 'Servicios y trabajos.', *B, True)

# UNIVERSIDAD
B = '#36321F', '#FAF6F0'
proj('WordPress', 'Tema propio / PHP / Universidad', 'El panel se rellena y la web se actualiza sola.',
     [('Técnicas', 'PHP · ACF')], 'mock/wp-3.png', *B, None, True)
B = '#1E1E1E', '#FFFFFF'
proj('Figma', 'UX/UI / Prototipos / Universidad', 'DTR, Coldculture y Estilo Vivo, con su prototipo navegable.',
     [('Técnicas', 'Componentes · variantes · prototipo')], 'mock/figma-3.png', *B, None, True)
imgs([('mock/figma-1.png', 'DTR.'), ('mock/figma-2.png', 'Estilo Vivo.')], *B, True)

# BRANDING
B = '#F1E6D6', '#3A1D12'
proj('Vora', 'Branding / Naming', 'Beach club en El Saler. «Vora» es orilla en valenciano.',
     [('Técnicas', 'Illustrator · Photoshop')], 'uni/id/vora-p01.png', *B)
full('uni/id/vora-p02.png', 'Señalética.', *B)
imgs([('uni/id/vora-p03.png', 'Interior.'), ('uni/id/vora-p06.png', 'Carta.'), ('uni/id/vora-p08.png', 'Delantal.')], *B)
imgs([('uni/id/vora-p09.png', 'Merch.'), ('uni/id/vora-p10.png', 'Para llevar.')], *B)
B = '#FBE9D6', '#5A1A18'
proj('Café del Sur', 'Rediseño de marca / Packaging', 'De café anticuado a café de especialidad.',
     [('Técnicas', 'Illustrator · Photoshop')], '../img/logos/cafe.svg', *B)
imgs([('uni/id/cafe-p03.png', 'Packaging.'), ('uni/id/cafe-p04.png', 'Lata.')], *B)
imgs([('uni/id/cafe-p02.png', 'Papelería y vasos.'), ('uni/id/cafe-p05.png', 'Delantal.')], *B)
B = '#2D1B7F', '#F2F0FA'
proj('Nidoo', 'Branding / Identidad digital', 'Estudio de diseño digital.',
     [('Técnicas', 'Illustrator · Photoshop · Figma')], 'uni/id/nidoo-p01.png', *B, None, True)
full('uni/id/nidoo-p11.png', 'La web.', *B, True)
imgs([('uni/id/nidoo-p02.png', 'Tarjetas.'), ('uni/id/nidoo-p03.png', 'Sobres.'), ('uni/id/nidoo-p04.png', 'Carpeta.')], *B, True)
imgs([('uni/id/nidoo-p06.png', 'Credenciales.'), ('uni/id/nidoo-p07.png', 'Pósters.')], *B, True)
