# Proyectos del PDF para la uni: textos muy cortos, mucha imagen y un QR + enlace a la web en cada uno.
# Lo carga uni.py (usa page, flat y os de allí).
import qrcode

def qr(url):
    q = qrcode.QRCode(border=0, box_size=1); q.add_data(url); q.make(); m = q.get_matrix(); n = len(m)
    return '<svg class="qr" viewBox="0 0 %d %d" shape-rendering="crispEdges">%s</svg>' % (n, n, ''.join('<rect x="%d" y="%d" width="1" height="1"/>' % (x, y) for y, r in enumerate(m) for x, v in enumerate(r) if v))

def link(url, txt):
    return '<a class="go" href="%s">%s<span>Ver en vivo<b>%s</b></span></a>' % (url, qr(url), txt)

def tint(bg, ink, k=.06):
    h = lambda c: [int(c.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)]
    x, y = h(bg), h(ink)
    return '#%02x%02x%02x' % tuple(round(x[i] + (y[i] - x[i]) * k) for i in range(3))

def hi(src, w=1920):
    """Foto original a buena resolución (sin pasar por 1300 px: llena la página sin verse borrosa)."""
    out = 'uni/flat/hi-' + os.path.basename(src)
    if not os.path.exists(out):
        im = Image.open(src).convert('RGB')
        if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(out, quality=90, optimize=True, progressive=True, dpi=(72, 72))
    return out

def tile(src, bg, ink, cap='', cls='', tbg=None):
    """Un recuadro de imagen. Fotos: llenan el recuadro. Mockups: enteros, sobre un tono del fondo. Logos: centrados sobre el color de la marca."""
    t = tbg or tint(bg, ink)
    if src.endswith('.svg'):
        mode, im = 'lg', src
    elif src.startswith('uni/hi/') and not tbg:
        mode, im = 'cv', hi(src)
    elif src.startswith('uni/hi/'):
        mode, im = 'ct', hi(src, 1300)
    else:
        mode, im = 'ct', flat(src, t)
    c = '<figcaption>%s</figcaption>' % cap if cap else ''
    return '<figure class="tl %s %s" style="background:%s"><img src="%s" alt="">%s</figure>' % (mode, cls, t, im, c)

def proj(name, cat, desc, rows, img, bg, ink, url=None, dark=False, tbg=None):
    r = ''.join('<dl><dt>%s</dt><dd>%s</dd></dl>' % x for x in rows if x[0] in ('Mi trabajo', 'Técnicas'))
    g = link(url, url.split('//')[1].rstrip('/')) if url else ''
    html = ('<div class="pa"><div class="pa-t"><h2>%s</h2><p class="cat">%s</p><i class="rule"></i><p class="desc">%s</p><div class="rows">%s</div>%s</div>%s</div>'
            ) % (name, cat, desc, r, g, tile(img, bg, ink, '', 'pa-i', tbg))
    page(html, 'proj' + (' dark' if dark else ''), bg, ink)

def full(img, cap, bg, ink, dark=False, tbg=None):
    page('<div class="pb n1">%s</div>' % tile(img, bg, ink, cap, '', tbg), 'proj' + (' dark' if dark else ''), bg, ink)

def imgs(items, bg, ink, dark=False):
    page('<div class="pb n%d">%s</div>' % (len(items), ''.join(tile(*((x[0], bg, ink, x[1], '') + tuple(x[2:]))) for x in items)), 'proj' + (' dark' if dark else ''), bg, ink)

# ---------------- WEB ----------------
B = '#F3ECE8', '#3A1A21'
proj('Nails by MelyG', 'Diseño web / UX/UI / Desarrollo', 'Las clientas diseñan sus uñas y su gift card antes de reservar.',
     [('Mi trabajo', 'UX/UI y código'), ('Técnicas', 'Figma · JavaScript · GSAP · Square')],
     'mock/nails-5.png', *B, 'https://nailsbymelyg.com/')
full('mock/nails-2.png', 'Simulador: color, forma y acabado.', *B)
imgs([('mock/nails-3.png', 'Gift card y simulador en el celular.'), ('mock/nails-4.png', 'Trabajos reales para inspirarse.')], *B)

B = '#0B0B0A', '#EDE6DA'
proj('Kronox', 'Diseño web / Panel de administración / Desarrollo', 'Videos, reseñas y condiciones en un sitio. Y un panel para gestionarla solo.',
     [('Mi trabajo', 'UX/UI y código'), ('Técnicas', 'JavaScript · Firebase')],
     'mock/kronox-6.png', *B, 'https://kronoxprod.netlify.app/', True)
imgs([('mock/kronox-4.png', 'El panel.'), ('mock/kronox-2.png', 'Tarifas y condiciones.')], *B, True)
imgs([('mock/kronox-3.png', 'En rodaje.'), ('mock/kronox-5.png', 'Opiniones.')], *B, True)

B = '#EFE7DC', '#2B231C'
proj('Nácar Estilismo', 'Tienda online / Tema de Shopify / Desarrollo', 'Tienda de ropa en Sevilla. Seis idiomas.',
     [('Mi trabajo', 'UX/UI y tema de Shopify'), ('Técnicas', 'Shopify · Liquid')],
     'mock/nacar-3.png', *B)
imgs([('mock/nacar-5.png', 'La compra en el celular.'), ('mock/nacar-2.png', 'Selector de idioma.')], *B)

B = '#0F1E3D', '#F4F1EA'
proj('Entre Amigos por Venezuela', 'App web / Investigación / UX/UI', 'Ayuda organizada tras los terremotos. Ligera para conexiones malas.',
     [('Mi trabajo', 'Investigación, UX/UI y código'), ('Técnicas', 'HTML · CSS · JavaScript')],
     'mock/amigos-2.png', *B, None, True)
full('mock/amigos-1.png', 'Publicar, match, comprar, llevar, confirmar con PIN.', *B, True)

# ---------------- PORTFOLIOS ----------------
B = '#141210', '#EDE3D3'
proj('Jairo Azogue', 'Diseño web / Portfolio', 'Director y editor de video. Su trabajo, como su escritorio.',
     [('Mi trabajo', 'UX/UI y código')], 'mock/jairo-3.png', *B, 'https://jairoazogue.com/', True)
full('mock/jairo-2.png', 'Cada pieza, a pantalla completa.', *B, True)

B = '#F6E7EA', '#2A1714'
proj('Catalina Silva', 'Diseño web / Portfolio', '3D y animación. Se lee como una hoja de animación: escenas, planos y fotogramas.',
     [('Mi trabajo', 'UX/UI y código')], 'mock/cata-4.png', *B, 'https://catalinasilva.netlify.app/')
imgs([('mock/cata-2.png', 'Animación.'), ('mock/cata-3.png', 'Identidad visual.')], *B)

B = '#111111', '#EDE6DA'
proj('ZogueKidd', 'Diseño web / Portfolio', 'Videoclips. La base de Kronox con otra estética.',
     [('Mi trabajo', 'UX/UI y código')], 'mock/zk-2.png', *B, 'https://zoguekidd.netlify.app/', True)

# ---------------- UNIVERSIDAD ----------------
B = '#36321F', '#FAF6F0'
proj('WordPress', 'Tema propio / PHP / Universidad', 'El panel se rellena y la web se actualiza sola.',
     [('Técnicas', 'PHP · ACF')], 'mock/wp-3.png', *B, None, True)
B = '#1E1E1E', '#FFFFFF'
proj('Figma', 'UX/UI / Prototipos / Universidad', 'DTR, Coldculture y Estilo Vivo, con su prototipo navegable.',
     [('Técnicas', 'Componentes · variantes · prototipo')], 'mock/figma-1.png', *B, None, True)
full('mock/figma-2.png', 'Estilo Vivo.', *B, True)

# ---------------- BRANDING ----------------
B = '#F1E6D6', '#3A1D12'
proj('Vora', 'Branding / Naming', 'Beach club en El Saler. «Vora» es orilla en valenciano.',
     [('Técnicas', 'Illustrator · Photoshop')], '../img/logos/vora.svg', *B, tbg='#AB4729')
full('uni/hi/vora-21-0.jpg', 'Señalética de la entrada.', *B)
imgs([('uni/hi/vora-22-0.jpg', 'Interior.'), ('uni/hi/vora-26-0.jpg', 'La carta.')], *B)
imgs([('uni/hi/vora-23-0.jpg', 'Mesa.'), ('uni/hi/vora-24-1.jpg', 'Mantel.'), ('uni/hi/vora-28-0.jpg', 'Merch.')], *B)
full('uni/hi/vora-25-0.jpg', 'La carta en la playa.', *B)
imgs([('uni/hi/vora-27-0.jpg', 'Delantal.', '#FFFFFF'), ('uni/hi/vora-29-0.jpg', 'Para llevar.', '#FFFFFF')], *B)

B = '#FBE9D6', '#5A1A18'
proj('Café del Sur', 'Rediseño de marca / Packaging', 'De café anticuado a café de especialidad.',
     [('Técnicas', 'Illustrator · Photoshop')], '../img/logos/cafe.svg', *B, tbg='#FBE9D6')
imgs([('uni/hi/cafe-34-0.jpg', 'Packaging.'), ('uni/hi/cafe-35-0.jpg', 'Lata.')], *B)
imgs([('uni/hi/cafe-33-1.jpg', 'Vasos para llevar.'), ('uni/hi/cafe-36-0.jpg', 'Delantal.')], *B)

B = '#2D1B7F', '#F2F0FA'
proj('Nidoo', 'Branding / Identidad digital', 'Estudio de diseño digital.',
     [('Técnicas', 'Illustrator · Photoshop · Figma')], '../img/logos/nidoo.svg', *B, None, True, '#2D1B7F')
full('uni/hi/nidoo-43-0.jpg', 'La web.', *B, True)
imgs([('uni/hi/nidoo-34-0.jpg', 'Tarjetas.'), ('uni/hi/nidoo-36-0.jpg', 'Carpeta.')], *B, True)
imgs([('uni/hi/nidoo-39-0.jpg', 'Póster.'), ('uni/hi/nidoo-39-1.jpg', 'Póster.')], *B, True)
full('uni/hi/nidoo-38-0.jpg', 'Credenciales.', *B, True)
