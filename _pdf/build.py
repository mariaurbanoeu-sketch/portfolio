# Genera _pdf/portfolio.html (español) o _pdf/portfolio-en.html (python3 build.py en)
# Luego render.js lo convierte en PDF. Estilo: el modo juego de la web.
import re, os, sys, qrcode
os.chdir(os.path.dirname(os.path.abspath(__file__)))
EN = len(sys.argv) > 1 and sys.argv[1] == 'en'
def t(es, en): return en if EN else es

src = open('../js/site.js').read()
def cut(a, b):
    i = src.index(a); j = src.index(b, i); return src[i:j]
PIX = (cut('  var PAL = {', '  function drawIcon') + cut('  var GLYPH = {', "  $$('canvas[data-tool]')") + cut('  var MINI = {', '  var lcds =')
       + cut('  var PX9 = {', "  $$('canvas[data-px]')"))

def qr(url, col='#221616'):
    q = qrcode.QRCode(border=0, box_size=1, error_correction=qrcode.constants.ERROR_CORRECT_M); q.add_data(url); q.make()
    m = q.get_matrix(); n = len(m)
    rects = ''.join('<rect x="%d" y="%d" width="1" height="1"/>' % (x, y) for y, r in enumerate(m) for x, v in enumerate(r) if v)
    return '<svg class="qr" viewBox="0 0 %d %d" shape-rendering="crispEdges" fill="%s">%s</svg>' % (n, n, col, rects)

WEB = 'https://paulaurbanog.com/' + ('en/' if EN else '')
MAIL = 'mariaurbanoeu@gmail.com'
LI = 'https://www.linkedin.com/in/paula-urbano-436619332'
TOTAL = 13
NLV = 6   # niveles con moneda: 4 webs + 2 portfolios, como en la web
STAGES = [t('Paula estudiante', 'Paula the student'), t('Paula diseñadora web', 'Paula the web designer'), t('Paula contratada', 'Paula, hired')]
COIN = '<canvas data-coin width="8" height="8"></canvas>'
FACE = '<canvas class="face" data-g="happy" width="32" height="32"></canvas>'

def hud(n, stage, lvtxt, coins, prog):
    return ('<header class="hud">%s<div class="hud-s"><b>%s</b><small>%s</small></div><div class="hud-pb"><i style="width:%d%%"></i></div>'
            '<span class="hud-c">%s%d/%d</span><a class="hud-l" href="#p3">%s</a><span class="hud-p">%02d / %02d</span></header>') % (
        FACE, STAGES[stage], lvtxt, prog, COIN, coins, NLV, t('Mapa', 'Map'), n, TOTAL)

def lt(lvl, title, who, dots=None):
    d = '<span class="dots"></span>'
    if dots: d = '<span class="dots">%s</span>' % ''.join('<i class="f"></i>' if i < dots[0] else '<i></i>' for i in range(dots[1]))
    return '<div class="lt"><a class="chip" href="#p3">%s</a><p class="lt-n"><span>%s</span><b>%s</b><small>%s</small></p>%s</div>' % (t('Mapa', 'Map'), lvl, title, who, d)

def lt0(lvl, title, who):
    return '<div class="lt"><span class="chip" style="visibility:hidden">.</span><p class="lt-n"><span>%s</span><b>%s</b><small>%s</small></p><span class="dots"></span></div>' % (lvl, title, who)

def dlg(txt, who='Paulagotchi'):
    return '<div class="dlg"><canvas data-g="happy" width="32" height="32"></canvas><p><span class="who">%s</span>%s</p></div>' % (who, txt)

def card(meta, ups, url, urltxt):
    mt = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % m for m in meta)
    up = ''.join('<li><span><strong>%s</strong>%s</span></li>' % u for u in ups)
    return '<aside class="card"><p class="k">%s</p><dl>%s</dl><ul class="pu"><li class="pu-h">%s</li>%s</ul><a class="qrb" href="%s">%s<span>%s<b>%s</b></span></a></aside>' % (
        t('Ficha del cartucho', 'Cartridge stats'), mt, t('Lo que pensé', 'What I planned'), up, url, qr(url), t('Escanéalo y juégala en vivo', 'Scan it and play it live'), urltxt)

pages = []
# 1 · pantalla de inicio
pages.append('''<section class="pg ts" id="p1"><div class="ts-in">
<p class="ts-k">Paula Urbano · %s</p>
<canvas class="ts-cv" data-g="happy" width="32" height="32"></canvas>
<h1 class="ts-t">%s</h1>
<p class="ts-d">%s</p>
<div class="ts-b"><a class="btn on" href="#p2">▶ %s<small>%s</small></a><a class="btn sec" href="%s">%s<small>%s</small></a></div>
<p class="ts-pr">%s</p>
</div><footer class="ts-f"><a href="%s">paulaurbanog.com</a><a href="mailto:%s">%s</a><a href="%s">LinkedIn · Paula Urbano</a><span>Valencia, %s</span></footer></section>''' % (
    t('Diseñadora y desarrolladora web', 'Web designer &amp; developer'), t('Hola, soy Paula', 'Hi, I’m Paula'),
    t('Diseño y programo webs que mis clientes pueden gestionar solos. Este es mi portfolio, en versión juego.', 'I design and build websites that clients can manage themselves. This is my portfolio, game edition.'),
    t('Ver portfolio', 'View portfolio'), t('Pasa la página para empezar', 'Turn the page to start'), WEB, t('Modo juego', 'Play mode'), t('Juégalo en la web · unos 4 min', 'Play it on the website · about 4 min'),
    'Portfolio · 2026', WEB, MAIL, MAIL, LI, t('España', 'Spain')))

# 2 · el personaje
pages.append('''<section class="pg" id="p2">%s%s
<div class="ch"><div class="ch-c"><canvas class="big" data-g="happy" width="32" height="32"></canvas><h2>Paula Urbano</h2><p class="cls">%s</p>
<dl><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div><div><dt>%s</dt><dd>%s</dd></div></dl></div>
<div class="ch-r"><p class="k">%s</p><h3>%s</h3><p class="big">%s</p>
<div class="facts">
<figure><div class="lcd-w"><canvas data-scene="grass" data-t="2000" width="48" height="28"></canvas></div><figcaption><b>%s</b></figcaption></figure>
<figure><div class="lcd-w"><canvas data-scene="lemon" data-t="900" width="48" height="28"></canvas></div><figcaption><b>%s</b>%s</figcaption></figure>
<figure><div class="lcd-w"><canvas data-scene="music" data-t="500" width="48" height="28"></canvas></div><figcaption><b>%s</b>%s</figcaption></figure>
</div></div></div>%s</section>''' % (
    hud(2, 0, t('Elige personaje', 'Choose your character'), 0, 4), lt0(t('Jugadora 1', 'Player 1'), t('Elige personaje', 'Choose your character'), t('Sobre mí', 'About me')),
    t('Diseñadora y desarrolladora web', 'Web designer &amp; developer'),
    'Base', t('Valencia, España', 'Valencia, Spain'), t('Estudios', 'Studies'), t('Multimedia y Artes Digitales · UCV · último año', 'Multimedia and Digital Arts · UCV · final year'),
    t('Clientes reales', 'Real clients'), t('Desde 2025', 'Since 2025'), t('Idiomas', 'Languages'), t('Español e inglés', 'Spanish and English'),
    t('Habilidad', 'Skill'), t('Diseño en Figma y lo programo yo', 'I design in Figma and code it myself'),
    t('Vengo del diseño gráfico', 'I come from graphic design'), t('Aprendí a programar para que mis diseños funcionaran de verdad', 'I learned to code so my designs would actually work'),
    t('Quería que mis diseños salieran de Figma y funcionaran de verdad. Por eso hago las dos cosas: diseño la web y la programo, así lo que ves en el diseño es lo que sale publicado.',
      'I wanted my designs to leave Figma and actually work. That’s why I do both: I design the website and I build it, so what you see in the design is what goes live.'),
    t('No puedo caminar sobre césped.', 'I can’t walk on grass.'),
    t('Siempre pido lo mismo: un helado de limón.', 'I always order the same thing: lemon ice cream.'), t(' No soy de probar nada nuevo.', ' I’m not one to try new things.'),
    t('Escucho todo tipo de música.', 'I listen to every kind of music.'), t(' Mi Spotify no tiene sentido.', ' My Spotify makes no sense.'),
    dlg(t('¡Hola! Soy el Paulagotchi. Paula está en el último año de la carrera y busca prácticas a partir de enero, con convenio con la universidad. Mientras tanto, ya hace webs para clientes reales.',
          'Hi! I’m the Paulagotchi. Paula is in her final year of university and is looking for an internship starting in January, through a university agreement. Meanwhile, she already builds websites for real clients.'))))

# 3 · mapa
NODES = [('Nails by MelyG', 'nail', 4, 1), ('Kronox', 'cam', 5, 2), ('Nácar Estilismo', 'bag', 6, 3), ('Entre Amigos', 'heart', 7, 4), ('WordPress', 'web', 8, 0),
         ('Portfolios', 'film', 9, 5), ('Figma', 'pen', 10, 0), (t('Marcas', 'Brands'), 'star', 11, 0), (t('Herramientas', 'Tools'), 'tool', 12, 0), (t('Contrátame', 'Hire me'), 'mail', 13, -1)]
POS = [(6, 74), (16, 30), (26, 74), (36, 30), (46, 74), (56, 30), (66, 74), (76, 30), (86, 74), (94, 30)]
nodes = ''
for i, (nm, ic, pg, lv) in enumerate(NODES):
    sm = (t('Nivel %d', 'Level %d') % lv) if lv > 0 else (t('Final', 'Final') if lv < 0 else 'Bonus')
    nodes += '<a class="nd%s" href="#p%d" style="left:%d%%;top:%d%%"><span class="nd-i"><canvas data-px="%s" data-c="%s" width="9" height="9"></canvas></span><span class="nd-l"><small>%s · %s %d</small>%s</span></a>' % (
        ' fin' if lv < 0 else '', pg, POS[i][0], POS[i][1], ic, '#221616' if lv < 0 else '#EBA9BD', sm, t('pág.', 'p.'), pg, nm)
pages.append('''<section class="pg" id="p3">%s%s
<div class="mapw"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="%s"/></svg>%s<canvas class="mapg" data-g="happy" width="32" height="32" style="left:calc(6%% - 15mm);top:calc(74%% - 22mm)"></canvas></div>
%s</section>''' % (hud(3, 0, t('Nivel 1 de 6', 'Level 1 of 6'), 0, 8), lt0(t('Mundo 1', 'World 1'), t('El mapa', 'The map'), t('Cada parada es un proyecto. Toca una para ir a su página.', 'Each stop is a project. Tap one to go to its page.')),
    ' '.join('%d,%d' % p for p in POS), nodes,
    dlg(t('Cada parada del mapa es una web que hizo Paula. En su web puedes jugarlo de verdad: entras en cada web, buscas la moneda escondida y cumples una misión.',
          'Each stop on the map is a website Paula made. On her website you can actually play it: you open each site, find the hidden coin and complete a mission.'))))

# 4-6 · niveles
def level(n, lv, name, who, img_d, img_m, tg, coin, ups, meta, url, urltxt, say):
    tgt = '<span class="tg" style="left:%s%%;top:%s%%"><b>%s</b><i></i></span>' % tg
    st = ('<figure class="br"><figcaption><i></i><i></i><i></i><span>%s</span></figcaption><div class="sc"><img src="%s" alt="">%s<span class="coin" style="left:%s%%;top:%s%%">%s</span></div></figure><figure class="phm over%s"><img src="%s" alt=""></figure>' % (
        urltxt, img_d, tgt, coin[0], coin[1], COIN, ' l' if lv == 2 else '', img_m))
    return '''<section class="pg" id="p%d">%s%s<div class="lv"><div class="stage"><p class="got">%s %s</p>%s</div>%s</div>%s</section>''' % (
        n, hud(n, 1 if lv > 3 else 0, t('Nivel %d de 6', 'Level %d of 6') % lv, lv, int(lv / 6 * 100)), lt(t('Nivel %d', 'Level %d') % lv, name, who, (lv, 4)),
        COIN, t('Moneda conseguida', 'Coin collected'), st, card(meta, ups, url, urltxt), dlg(say))

pages.append(level(4, 1, 'Nails by MelyG', t('Manicurista · Katy, Texas', 'Nail artist · Katy, Texas'), '../img/nails-d.webp', '../img/nails-m.webp?v=2',
    (34, 74, t('Empieza aquí', 'Start here')), (20, 14),
    [(t('Probar antes de reservar.', 'Try before booking.'), t(' Un simulador para elegir color, forma y acabado.', ' A simulator to pick color, shape and finish.')),
     (t('En su idioma sin pedirlo.', 'In their language, without asking.'), t(' Se abre en español o inglés según el teléfono.', ' It opens in Spanish or English depending on the phone.')),
     (t('Regalar en un minuto.', 'A gift in one minute.'), t(' La gift card se diseña en la web y se envía por WhatsApp.', ' The gift card is designed on the site and sent by WhatsApp.'))],
    [(t('Tipo', 'Type'), t('Web con reservas y gift cards', 'Website with booking and gift cards')), (t('Qué hice', 'What I did'), t('Diseño en Figma, UX/UI y desarrollo', 'Figma design, UX/UI and development')),
     (t('Hecha con', 'Made with'), 'Figma · HTML · CSS · JavaScript · GSAP · Square'), (t('Idiomas', 'Languages'), t('Español e inglés', 'Spanish and English'))],
    'https://nailsbymelyg.com/', 'nailsbymelyg.com',
    t('<b>Misión:</b> entra en la web de Mely y prueba el simulador como haría una clienta. Mely tiene un estudio de manicura rusa: diseñé su web en Figma y la programé para que sus clientas se prueben colores y formas antes de reservar.',
      '<b>Mission:</b> open Mely’s website and try the simulator like a client would. Mely runs a Russian manicure studio: I designed her website in Figma and built it so her clients can try on colors and shapes before booking.')))
pages.append(level(5, 2, 'Kronox', t('Director de videoclips · Sevilla', 'Music video director · Seville'), '../img/kpanel-d.webp', '../img/kpanel-m.webp?v=2',
    (92, 64, t('Las flechas', 'The arrows')), (20, 78),
    [(t('Sin malentendidos.', 'No misunderstandings.'), t(' Antes de escribirle, el cliente acepta las condiciones del rodaje.', ' Before messaging him, clients accept the shoot terms.')),
     (t('Él lo cambia todo.', 'He changes everything.'), t(' Videos, precios y reseñas desde el panel, también en el celular.', ' Videos, prices and reviews from the panel, on his phone too.')),
     (t('Subir un video es pegar un enlace.', 'Adding a video is pasting a link.'), t(' El título de YouTube se pone solo.', ' The YouTube title fills itself in.'))],
    [(t('Tipo', 'Type'), t('Web + panel de administración', 'Website + admin panel')), (t('Qué hice', 'What I did'), t('UX/UI y desarrollo', 'UX/UI and development')),
     (t('Hecha con', 'Made with'), 'HTML · CSS · JavaScript · Firebase'), (t('Año', 'Year'), '2026')],
    'https://kronoxprod.netlify.app/', 'kronoxprod.netlify.app',
    t('<b>Misión:</b> entra en su panel y cambia el orden de sus videoclips con las flechas. Es lo que él hace sin llamarme. En las imágenes ves el panel; su web pública está en el código QR.',
      '<b>Mission:</b> open his admin panel and reorder his music videos with the arrows. It’s what he does without calling me. The images show the panel; his public website is behind the QR code.')))
pages.append(level(6, 3, 'Nácar Estilismo', t('Tienda online · Sevilla', 'Online store · Seville'), '../img/nacar-d.webp', '../img/nacar-m.webp?v=2',
    (50, 71, t('Empieza aquí', 'Start here')), (26, 86),
    [(t('Seguir mirando.', 'Keep browsing.'), t(' La cesta se abre a un lado, así nadie pierde la página en la que estaba.', ' The bag slides in from the side, so nobody loses their page.')),
     (t('Para todas.', 'For everyone.'), t(' Seis idiomas desde el primer día.', ' Six languages from day one.')),
     (t('Mantenimiento.', 'Maintenance.'), t(' Sigo subiendo yo los productos nuevos.', ' I still upload the new products.'))],
    [(t('Tipo', 'Type'), t('Tienda online', 'Online store')), (t('Qué hice', 'What I did'), t('Diseño y desarrollo del tema', 'Theme design and development')),
     (t('Hecha con', 'Made with'), 'Shopify · Liquid'), (t('Idiomas', 'Languages'), t('Seis', 'Six'))],
    'https://paulaurbanog.com/demos/nacar.html', t('paulaurbanog.com · demo de la tienda', 'paulaurbanog.com · store demo'),
    t('<b>Misión:</b> añade una prenda a la cesta y mira cómo se abre a un lado sin sacarte de la página. Diseñé y programé su tema de Shopify desde cero, en seis idiomas.',
      '<b>Mission:</b> add an item to the bag and watch it slide in from the side without leaving the page. I designed and built this Shopify theme from scratch, in six languages.')))
# 7 · Entre Amigos: el camino de una ayuda
steps = [(t('Se publica', 'Posted'), t('Qué hace falta, cuánto y dónde, con un PIN de 4 dígitos.', 'What’s needed, how much and where, with a 4-digit PIN.')),
         (t('Match', 'Match'), t('Si un local cercano lo tiene, la app avisa.', 'If a nearby place has it, the app says so.')),
         (t('Comprado', 'Bought'), t('Un donante lo compra y lo marca.', 'A donor buys it and marks it.')),
         (t('En tránsito', 'In transit'), t('Un conductor se ofrece a llevarlo.', 'A driver offers to take it.')),
         (t('Recibido', 'Received'), t('Se confirma con el PIN.', 'It’s confirmed with the PIN.'))]
st = ''.join('<figure><div class="phm"><img src="../img/ea/s%d.webp" alt=""></div><figcaption><b>%d · %s</b>%s</figcaption></figure>' % (i + 1, i + 1, a, b) for i, (a, b) in enumerate(steps))
EAU = 'https://paulaurbanog.com/demos/entre-amigos.html'
pages.append('''<section class="pg" id="p7">%s%s<div class="lv"><div class="stage"><p class="got">%s %s</p><div class="ea">%s</div></div>%s</div>%s</section>''' % (
    hud(7, 1, t('Nivel 4 de 6', 'Level 4 of 6'), 4, 66), lt(t('Nivel 4', 'Level 4'), 'Entre Amigos por Venezuela', t('Proyecto personal', 'Personal project'), (4, 4)), COIN, t('Moneda conseguida', 'Coin collected'), st,
    card([(t('Tipo', 'Type'), t('App web', 'Web app')), (t('Qué hice', 'What I did'), t('Investigación · UX/UI · Desarrollo', 'Research · UX/UI · Development')), (t('Idiomas', 'Languages'), '7'), (t('Sin conexión', 'Offline'), t('Sí', 'Yes'))],
         [(t('Hecha en una semana.', 'Built in a week.'), t(' Después de los terremotos en Venezuela.', ' After the earthquakes in Venezuela.')),
          (t('Funciona sin conexión.', 'Works offline.'), t(' En una emergencia la señal falla.', ' In an emergency the signal fails.')),
          (t('Lo que aprendí.', 'What I learned.'), t(' No llegó a usarse porque ya había otra herramienta parecida, pero es de lo que más aprendí.', ' It was never used because a similar tool already existed, but I learned a lot from it.'))],
         EAU, t('paulaurbanog.com · probar la app', 'paulaurbanog.com · try the app')),
    dlg(t('<b>Misión:</b> ve a «Necesidades» y publica una. Si un local cercano la tiene, sale el match. Así sigue una ayuda desde que alguien la pide hasta que llega.',
          '<b>Mission:</b> go to «Necesidades» (Needs) and post one. If a nearby place has it, you get a match. This is how help travels from the request to the delivery.'))))

# 8 · WordPress (bonus)
fields = [(t('Título', 'Title'), 'Nuestra historia', True), (t('Texto', 'Text'), 'RobotiKa nació en 2018…', False), (t('Imagen a la izquierda', 'Image on the left'), t('sí', 'yes'), False)]
team = [(t('Nombre', 'Name'), 'Carlos Ruiz'), (t('Cargo', 'Role'), t('CEO y Cofundador', 'CEO and Co-founder'))]
wpa = '''<div class="wpa"><nav><span>%s</span><span>%s</span><span>%s</span><span class="on">%s</span><span class="nw">Robots</span><span class="nw">%s</span><span>%s</span><span>Plugins</span><span>%s</span></nav>
<main><h4>%s</h4><fieldset><legend>%s</legend>%s</fieldset><fieldset><legend>%s</legend>%s</fieldset></main></div>''' % (
    t('Escritorio', 'Dashboard'), t('Entradas', 'Posts'), t('Medios', 'Media'), t('Páginas', 'Pages'), t('Equipo', 'Team'), t('Apariencia', 'Appearance'), t('Ajustes', 'Settings'),
    t('Editar página: Quiénes somos', 'Edit page: About us'), t('Bloques de contenido · se repiten', 'Content blocks · repeater'),
    ''.join('<span class="f%s">%s<u>%s</u></span>' % (' hl' if hl else '', a, b) for a, b, hl in fields),
    t('Equipo · tipo de contenido propio', 'Team · custom post type'), ''.join('<span class="f">%s<u>%s</u></span>' % x for x in team))
pages.append('''<section class="pg" id="p8">%s%s<div class="wp">
<figure class="br"><figcaption><i></i><i></i><i></i><span>robotika.local/quienes-somos</span></figcaption><div class="sc"><div class="wpi"><img src="../img/wp/robotika-qs.webp" alt=""><span class="hlb" style="left:3.7%%;top:19.2%%;width:45%%;height:3.2%%"></span></div></div></figure>
%s
<div class="wpn"><div class="it"><p class="k">%s</p><h3>Robotika</h3><p>%s</p></div><div class="it"><div class="v" style="aspect-ratio:1100/536"><img src="../img/wp/nerflis.webp" alt=""></div><p class="k">%s</p><h3>Nerflis</h3><p>%s</p></div></div>
</div>%s</section>''' % (hud(8, 1, 'Bonus', 4, 70), lt('Bonus', t('También en WordPress', 'Also in WordPress'), t('Proyectos de la uni · tema propio en PHP · ACF', 'University projects · custom PHP theme · ACF')),
    wpa,
    t('Web corporativa', 'Corporate website'), t('Robots y Equipo son apartados propios del panel. Los datos de contacto, el mapa y el formulario (Contact Form 7) se editan sin tocar código.', 'Robots and Team are custom sections in the dashboard. Contact details, the map and the form (Contact Form 7) are edited without touching code.'),
    t('Catálogo de películas', 'Movie catalog'), t('Un tipo de contenido «Películas» con sus campos: director, año, actores y sinopsis.', 'A «Movies» post type with its own fields: director, year, cast and synopsis.'),
    dlg(t('Temas que Paula programó desde cero en la universidad. Quien gestiona la web rellena el panel y la página se actualiza sola: el campo «Título» marcado en amarillo es el titular marcado en la web.',
          'Themes Paula coded from scratch at university. Whoever runs the site fills in the dashboard and the page updates itself: the «Title» field marked in yellow is the heading marked on the page.'))))

# 9 · portfolios para creativos
def it(img, k, nm, txt, url, ut):
    return '<div class="it"><div class="v" style="aspect-ratio:16/10">%s</div><p class="k">%s</p><h3>%s</h3><p>%s</p><a class="qrb" href="%s">%s<span>%s<b>%s</b></span></a></div>' % (img, k, nm, txt, url, qr(url), t('Escanéalo', 'Scan it'), ut)
cube = '<div class="b3"><span>catalina_silva.blend</span><canvas data-cube width="24" height="24"></canvas><small></small></div>'
pages.append('''<section class="pg" id="p9">%s%s<div class="room">%s%s%s</div>%s</section>''' % (
    hud(9, 1, t('Niveles 5 y 6', 'Levels 5 and 6'), 6, 100), lt(t('Niveles 5 y 6', 'Levels 5 and 6'), t('Portfolios para creativos', 'Portfolios for creatives'), t('Mis favoritos · 3 portfolios', 'My favorites · 3 portfolios'), (6, 6)),
    it('<img src="../img/jairo.webp" alt="">', t('Nivel 5 · Director y editor de video', 'Level 5 · Video director and editor'), 'Jairo Azogue', t('Su trabajo ordenado por tipo de pieza y sus herramientas como si fueran su escritorio. Ya está en su propio dominio.', 'His work sorted by type of piece, and his tools laid out like his desk. It’s already on his own domain.'), 'https://jairoazogue.com/', 'jairoazogue.com'),
    it('<img src="../img/zk-d.webp" alt="">', t('Extra · Videoclips', 'Extra · Music videos'), 'ZogueKidd', t('Usa la misma base que la web de Kronox, con una estética totalmente distinta.', 'Built on the same base as the Kronox website, with a completely different look.'), 'https://zoguekidd.netlify.app/', 'zoguekidd.netlify.app'),
    it(cube, t('Nivel 6 · 3D y animación', 'Level 6 · 3D and animation'), 'Catalina Silva', t('La hicimos para que pudiera pedir prácticas en estudios de 3D.', 'We made it so she could apply for internships at 3D studios.'), 'https://catalinasilva.netlify.app/', 'catalinasilva.netlify.app'),
    dlg(t('Webs para tres personas que también crean. Antes de diseñar, Paula miró qué busca cada uno en su sector. Fíjate: tres estilos totalmente distintos.',
          'Websites for three people who also make things. Before designing, Paula looked at what each of their industries looks for. Notice: three completely different styles.'))))

# 10 · Figma: los diseños enteros, sin recortar
FG = [('DTR', t('Tienda online de una marca de ropa inventada: home, colecciones, producto, carrito, favoritos y login.', 'Online store for a made-up clothing brand: home, collections, product, cart, favorites and login.'), ['dtr-producto', 'dtr-carrito', 'dtr-login'], 'https://www.figma.com/proto/O1BYlgEZKLjiQEM1RxontS/Web-Detroit?node-id=13-2&starting-point-node-id=534%3A1999'),
      ('Coldculture', t('Ejercicio de clase: rediseño de la tienda online de una marca que ya existe.', 'Class exercise: a redesign of the online store of a real brand.'), ['cold-home', 'cold-shop'], 'https://www.figma.com/proto/zeYWEDgQy5vbrUZvUGmheu/Untitled?node-id=1-2&starting-point-node-id=1%3A2'),
      ('Estilo Vivo', t('Práctica de componentes y variantes: tarjetas, valoraciones y botones con estados.', 'Components and variants practice: cards, ratings and buttons with states.'), ['ev-inicio', 'ev-producto'], 'https://www.figma.com/proto/P8oK1mFGqyMTF5QIxZDxtT/Pra%CC%81ctica-3.-Introduccio%CC%81n-a-_Modos_?node-id=1-4&starting-point-node-id=1%3A4')]
fg = ''
for n, d, ims, u in FG:
    cls = 'ph' if ims[0].startswith('ev') else 'ds'
    fg += '<div class="it"><span class="fgl">%s / %s 1</span><div class="fgi %s">%s</div><h3>%s</h3><p>%s</p><a class="lnk" href="%s">%s</a></div>' % (
        n, t('Página', 'Page'), cls, ''.join('<img src="../img/figma/%s.webp" alt="">' % i for i in ims), n, d, u, t('Abrir prototipo en Figma', 'Open prototype in Figma'))
pages.append('''<section class="pg" id="p10">%s%s<div class="room">%s</div>%s</section>''' % (
    hud(10, 1, t('Sala extra', 'Extra room'), 6, 100), lt(t('Sala extra', 'Extra room'), t('Diseños de la uni', 'University designs'), t('Diseñado en Figma · sin programar todavía', 'Designed in Figma · not coded yet')), fg,
    dlg(t('Aquí todavía no hay código: son proyectos de la universidad que viven en Figma, con su prototipo navegable. Pulsa el enlace para probarlos.',
          'No code here yet: these are university projects that live in Figma, each with a clickable prototype. Tap the link to try them.'))))

# 11 · marcas
BR = [('Vora', t('Beach club en El Saler. «Vora» significa orilla en valenciano: hice el nombre, el logo, la carta, la señalética y el merch.', 'A beach club in El Saler. «Vora» means shore in Valencian: I made the name, the logo, the menu, the signage and the merch.'), 'brand-vora.webp', '#AB4729', [(t('Oliva', 'Olive'), '#8B8635'), (t('Teja', 'Terracotta'), '#D06222'), (t('Arena', 'Sand'), '#EAC892')], 'Moret · Brandon Grotesque', 29),
      ('Café del Sur', t('Una marca de café con una imagen muy anticuada. La rediseñé para que pareciera un café de especialidad.', 'A coffee brand with a very dated look. I redesigned it to feel like specialty coffee.'), 'cafe-logo.webp', '#FBE9D6', [(t('Rojo', 'Red'), '#E63837'), (t('Crema', 'Cream'), '#FBE9D6')], 'ITC Avant Garde · Brandon', 36),
      ('Nidoo', t('Un estudio de diseño digital: la marca, los personajes, la papelería y la web.', 'A digital design studio: the brand, the characters, the stationery and the website.'), 'brand-nidoo.webp', '#2D1B7F', [(t('Índigo', 'Indigo'), '#2D1B7F'), (t('Naranja', 'Orange'), '#FF4B00'), (t('Negro', 'Black'), '#191A1A'), (t('Gris', 'Gray'), '#E6E6E6')], 'Articulat CF · Tenon', 43)]
br = ''.join('<div class="it"><div class="bc" style="background:%s"><img src="../img/%s" alt=""></div><div class="sw">%s</div><p class="ty">%s</p><h3>%s</h3><p>%s</p><p class="k" style="margin-top:auto;padding-top:2mm">%s · %d %s</p></div>' % (
    bc, lg, ''.join('<i style="background:%s"><small>%s</small></i>' % (c, nn) for nn, c in sw), ty, n, d, t('Manual de marca', 'Brand book'), pgs, t('págs.', 'pp.')) for n, d, lg, bc, sw, ty, pgs in BR)
pages.append('''<section class="pg" id="p11">%s%s<div class="room">%s</div>%s</section>''' % (
    hud(11, 1, t('Sala extra', 'Extra room'), 6, 100), lt(t('Sala extra', 'Extra room'), t('Identidades de marca', 'Brand identities'), 'Vora · Café del Sur · Nidoo'), br,
    dlg(t('Antes de la web viene la marca. Paula también diseña identidades completas, así la web y la marca hablan igual.',
          'Before the website comes the brand. Paula also designs full identities, so the website and the brand speak the same language.'))))

# 12 · inventario (herramientas)
h = open('../index.html').read()
tools = re.findall(r'data-tool="(\w+)" data-c="(#\w+)"[^>]*></canvas><b>([^<]+)</b><span>([^<]+)</span>', h)
if EN:
    js = open('../js/en.js').read()
    D = {k.replace("\\'", "'"): v.replace("\\'", "'") for k, v in re.findall(r"^\s*'((?:[^'\\]|\\.)*)': '((?:[^'\\]|\\.)*)',?$", js, re.M)}
    D.update(dict(re.findall(r'^\s*"([^"]*)": "([^"]*)",?$', js, re.M)))
    tools = [(a, c, D.get(b, b), D.get(s, s)) for a, c, b, s in tools]
groups = [(t('Diseño', 'Design'), tools[:7]), (t('Web y desarrollo', 'Web and development'), tools[7:15]), (t('Y también', 'And also'), tools[15:])]
tg = ''.join('<div class="it"><p class="k">%s · %02d</p><ul>%s</ul></div>' % (g, len(tl), ''.join(
    '<li><canvas data-tool="%s" data-c="%s" width="16" height="16"></canvas><b>%s</b><span>%s</span></li>' % x for x in tl)) for g, tl in groups)
pages.append('''<section class="pg" id="p12">%s%s<div class="inv">%s</div><div style="height:8mm"></div></section>''' % (
    hud(12, 1, t('Inventario', 'Inventory'), 6, 100), lt(t('Inventario', 'Inventory'), t('Herramientas', 'Tools'), t('Lo que uso para diseñar y para programar', 'What I use to design and to code')), tg))

# 13 · final
pages.append('''<section class="pg" id="p13">%s%s
<div class="fin-g"><div class="sum"><canvas data-g="hired" width="32" height="32"></canvas><p class="st">%s</p><dl><div><dt>%s</dt><dd>6/6</dd></div><div><dt>%s</dt><dd>6/6</dd></div><div><dt>%s</dt><dd>%s</dd></div></dl></div>
<div><p class="cont">%s</p><p class="fin-d">%s</p>
<ul class="ct"><li><span>%s</span><a href="mailto:%s">%s</a></li><li><span>Web</span><a href="%s">paulaurbanog.com</a></li><li><span>LinkedIn</span><a href="%s">linkedin.com/in/paula-urbano-436619332</a></li><li><span>%s</span><b>%s</b></li></ul>
<div class="fin-q"><a href="%s">%s</a><span>%s</span></div></div></div>
<p class="credits">%s · Paula Urbano &nbsp; %s · Paula Urbano &nbsp; Paulagotchi · Paula Urbano &nbsp; %s</p></section>''' % (
    hud(13, 2, t('¡Juego completado!', 'Game complete!'), 6, 100), lt0(t('Fin del juego', 'Game over'), t('¡Contratada!', 'Hired!'), t('Nivel final', 'Final level')),
    STAGES[2], t('Webs probadas', 'Websites tried'), t('Monedas', 'Coins'), t('Taza de café', 'Coffee mug'), t('Sí', 'Yes'),
    t('¿Continuar?', 'Continue?'), t('Si te gustó cómo trabajo, escríbeme. Contesto rápido.', 'If you liked how I work, write to me. I reply fast.'),
    t('Correo', 'Email'), MAIL, MAIL, WEB, LI, t('Ciudad', 'City'), t('Valencia, España', 'Valencia, Spain'), WEB, qr(WEB), t('Escanéalo para ver mi portfolio en vivo<br>y jugar con el Paulagotchi', 'Scan to see my portfolio live<br>and play with the Paulagotchi'),
    t('Diseño', 'Design'), t('Código', 'Code'), t('Gracias por jugar', 'Thanks for playing')))

from PIL import Image
os.makedirs('img', exist_ok=True)
def jpg(m):
    p = m.group(1).split('?')[0]; out = 'img/' + p.replace('../img/', '').replace('/', '_').replace('.webp', '.jpg')
    if not os.path.exists(out):
        im = Image.open(p); bg = Image.new('RGB', im.size, '#ffffff'); im = im.convert('RGBA'); bg.paste(im, mask=im.split()[3])
        bg.thumbnail((1400, 1400)); bg.save(out, quality=80, optimize=True, progressive=True)
    return 'src="%s"' % out
pages = [re.sub(r'src="(\.\./img/[^"]+)"', jpg, x) for x in pages]
html = open('template.html').read().replace('<!--PAGES-->', '\n'.join(pages)).replace('/*PIX*/', PIX)
if EN: html = html.replace('<html lang="es">', '<html lang="en">')
out = 'portfolio-en.html' if EN else 'portfolio.html'
open(out, 'w').write(html)
print('ok', out, len(html))
