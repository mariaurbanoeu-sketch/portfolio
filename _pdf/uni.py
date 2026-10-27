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
    if not os.path.exists(out) and not os.path.exists(out[:-4] + '.png'):
        im = Image.open(src).convert('RGBA')
        if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        if src.endswith('.png') and src.startswith('mock/'):
            import numpy as np
            a = np.asarray(im).astype(float); h, w = a.shape[:2]; e = 70
            fx = np.clip(np.minimum(np.arange(w), w - 1 - np.arange(w)) / e, 0, 1)
            fy = np.clip(np.minimum(np.arange(h), h - 1 - np.arange(h)) / e, 0, 1)
            al = a[..., 3]; al[al < 14] = 0; al *= np.minimum.outer(fy, fx); a[..., 3] = al
            im = Image.fromarray(a.astype('uint8'), 'RGBA')
        base = Image.new('RGBA', im.size, bg); base.alpha_composite(im)
        (base.convert('RGB').save(out[:-4] + '.png', optimize=True, dpi=(72, 72)) if src.startswith('mock/') else base.convert('RGB').save(out, quality=88, optimize=True, progressive=True, dpi=(72, 72)))
    return out if os.path.exists(out) else out[:-4] + '.png'

pages = []
def page(html, cls='', bg=None, ink=None):
    st = ''
    if bg:
        st += '--bg:%s;' % bg
        sw = 'uni/flat/bg-%s.png' % bg.strip('#').lower()
        if not os.path.exists(sw): Image.new('RGB', (8, 8), bg).save(sw)
        st += 'background-image:url(%s);background-size:100%% 100%%;' % sw
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

exec(open('uni_projects.py').read())

# contraportada
page('<div class="bk"><a class="blk" href="https://paulaurbanog.com/">%s</a>%s<div class="bk-t"><p class="bk-n">Paula<br>Urbano</p><p><a href="mailto:%s">%s</a><br><a href="https://paulaurbanog.com/">%s</a><br><a href="https://www.%s">LinkedIn</a></p></div></div>' % (qr('https://paulaurbanog.com/'), chev(), MAIL, MAIL, WEB, LI), 'back', '#221616', '#FAF6F0')

N = len(pages)
out = []
for i, p in enumerate(pages):
    if 1 <= i < N - 1:
        p = p.replace('</section>', '<footer class="num">%02d</footer></section>' % (i + 1))
    out.append(p)
html = open('uni-template.html').read().replace('<!--PAGES-->', '\n'.join(out))
open('uni.html', 'w').write(html)
print(N, 'páginas')
