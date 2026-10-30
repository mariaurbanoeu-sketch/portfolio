# Genera mockups realistas (portátil y celular) como PNG de 1300 px de ancho a 72 ppp.
# python3 mockups.py  → _pdf/mock/*.png   (necesita PW y un servidor en :8794 desde la raíz)
import os, json, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
H = 'shots/hd/'
CSS = '''
*{box-sizing:border-box;margin:0;padding:0}
body{width:1300px;background:transparent}
.sc{position:relative;width:1300px;display:flex;align-items:flex-end;justify-content:center;padding:40px 0 60px}
/* portátil */
.lap{position:relative;width:1040px;filter:drop-shadow(0 40px 40px rgba(0,0,0,.22)) drop-shadow(0 10px 12px rgba(0,0,0,.18))}
.lid{position:relative;margin:0 auto;width:930px;padding:14px 14px 20px;border-radius:26px 26px 6px 6px;background:#0b0b0d;box-shadow:inset 0 0 0 2px #2a2a2e,inset 0 0 0 3px #111}
.lid::before{content:"";position:absolute;left:50%;top:0;width:120px;height:13px;transform:translateX(-50%);background:#0b0b0d;border-radius:0 0 8px 8px;z-index:2}
.lid::after{content:"";position:absolute;left:50%;top:4px;width:5px;height:5px;transform:translateX(-50%);background:#1d2533;border-radius:50%;z-index:3}
.scr{position:relative;aspect-ratio:16/10;overflow:hidden;border-radius:6px;background:#000}
.scr img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.base{position:relative;height:20px;margin-top:-2px;border-radius:2px 2px 14px 14px;background:linear-gradient(#e8e9eb,#c9cbcf 45%,#9ea1a6);box-shadow:inset 0 1px 0 #fff}
.base::before{content:"";position:absolute;left:50%;top:0;width:150px;height:8px;transform:translateX(-50%);background:linear-gradient(#b9bcc1,#d7d9dc);border-radius:0 0 10px 10px}
/* celular */
.ph{position:relative;width:250px;aspect-ratio:390/844;padding:10px;border-radius:46px;background:linear-gradient(135deg,#55575c,#1c1d20 30%,#3b3d41 60%,#151618);filter:drop-shadow(0 30px 30px rgba(0,0,0,.25)) drop-shadow(0 8px 10px rgba(0,0,0,.2))}
.ph::before{content:"";position:absolute;inset:3px;border-radius:43px;background:#050505}
.ph .s{position:relative;width:100%;height:100%;border-radius:37px;overflow:hidden;background:#fff}
.ph .s img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.ph .di{position:absolute;left:50%;top:21px;width:74px;height:21px;transform:translateX(-50%);background:#000;border-radius:12px;z-index:3}
.ph i{position:absolute;right:-3px;width:4px;border-radius:0 3px 3px 0;background:#2a2b2e}
.ph i.a{top:22%;height:13%}.ph i.b{left:-3px;right:auto;border-radius:3px 0 0 3px;top:18%;height:6%}.ph i.c{left:-3px;right:auto;border-radius:3px 0 0 3px;top:27%;height:9%}
/* composiciones */
.duo .lap{margin-right:110px}
.duo .ph{position:absolute;right:70px;bottom:55px;width:230px}
.row{gap:44px;align-items:center;padding:50px 0 70px}
.row .ph{width:300px}
.row5{gap:22px;padding:40px 0 60px}.row5 .ph{width:236px;padding:9px;border-radius:40px}.row5 .ph::before{border-radius:37px}.row5 .ph .s{border-radius:32px}.row5 .ph .di{width:64px;height:18px;top:19px}

/* tablet */
.tab{position:relative;width:400px;aspect-ratio:820/1180;padding:16px;border-radius:34px;background:linear-gradient(135deg,#5a5c61,#1c1d20 30%,#3b3d41 60%,#151618);filter:drop-shadow(0 34px 34px rgba(0,0,0,.24)) drop-shadow(0 8px 10px rgba(0,0,0,.18))}
.tab::before{content:"";position:absolute;inset:3px;border-radius:31px;background:#050505}
.tab .s{position:relative;width:100%;height:100%;border-radius:18px;overflow:hidden;background:#fff}
.tab .s img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.tab .cam{position:absolute;left:50%;top:7px;width:6px;height:6px;transform:translateX(-50%);border-radius:50%;background:#1d2533;z-index:3}
/* trío: portátil al centro, tablet detrás a la izquierda y celular delante a la derecha */
.trio{height:760px;padding:0}
.trio .lap{position:absolute;left:190px;bottom:70px;width:960px}
.trio .tab{position:absolute;left:40px;bottom:46px;width:330px;z-index:2}
.trio .ph{position:absolute;right:60px;bottom:46px;width:200px;z-index:3}
/* pantallas flotando en perspectiva */
.float{height:760px;padding:0;perspective:2600px;overflow:hidden}
.float .iso{position:absolute;left:50%;top:50%;width:1000px;height:620px;transform:translate(-50%,-50%) rotateX(50deg) rotateZ(-32deg);transform-style:preserve-3d}
.float .card{position:absolute;width:600px;aspect-ratio:16/10;border-radius:12px;overflow:hidden;background:#000;box-shadow:0 0 0 1px rgba(255,255,255,.06),-30px 50px 60px rgba(0,0,0,.35)}
.float .card img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.float .c1{left:0;top:0;transform:translateZ(0)}
.float .c2{left:220px;top:180px;transform:translateZ(70px)}
.float .c3{left:440px;top:360px;transform:translateZ(140px)}
/* tablet + celulares */
.tabrow{gap:50px;align-items:flex-end;padding:40px 0 60px}
.tabrow .tab{width:420px}.tabrow .ph{width:240px}
'''
def lap(img): return '<div class="lap"><div class="lid"><div class="scr"><img src="../%s"></div></div><div class="base"></div></div>' % img
def tab(img): return '<div class="tab"><div class="s"><img src="../%s"></div><div class="cam"></div></div>' % img
def fl(*imgs): return '<div class="iso">%s</div>' % ''.join('<div class="card c%d"><img src="../%s"></div>' % (i + 1, im) for i, im in enumerate(imgs))
def ph(img): return '<div class="ph"><i class="a"></i><i class="b"></i><i class="c"></i><div class="s"><img src="../%s"></div><div class="di"></div></div>' % img
S = {
 'nails-1': ('duo', lap(H+'nails-d-hero.png') + ph(H+'nails-m-hero.png')),
 'nails-2': ('duo', lap(H+'nails-d-simulador.png') + ph(H+'nails-m-simulador.png')),
 'nails-3': ('row', ph(H+'nails-m-regalo.png') + ph(H+'nails-m-simulador.png') + ph(H+'nails-m-hero.png')),
 'nails-4': ('one', lap(H+'nails-d-looks.png')),
 'kronox-1': ('duo', lap(H+'kronox-d-hero.png') + ph(H+'kronox-m-hero.png')),
 'kronox-2': ('duo', lap(H+'kronox-d-tarifas.png') + ph(H+'kronox-m-tarifas.png')),
 'kronox-3': ('one', lap(H+'kronox-d-rodaje.png')),
 'kronox-5': ('one', lap(H+'kronox-d-opiniones.png')),
 'kronox-4': ('duo', lap('shots/kp-tarifas.png') + ph('../img/kpanel-m.webp')),
 'nacar-1': ('duo', lap('shots/hd/nacar-d-hero.png') + ph('shots/hd/nacar-m-hero.png')),
 'nacar-2': ('duo', lap('shots/hd/nacar-d-lang.png') + ph('shots/hd/nacar-m-prod.png')),
 'amigos-1': ('row5', ''.join(ph('../img/ea/s%d.webp' % i) for i in range(1, 6))),
 'wp-1': ('one', lap('shots/hd/robotika.png')),
 'jairo-1': ('duo', lap(H+'jairo-d-hero.png') + ph(H+'jairo-m-hero.png')),
 'jairo-2': ('one', lap(H+'jairo-d-destacado.png')),
 'zk-1': ('duo', lap(H+'zk-d-hero.png') + ph(H+'zk-m-hero.png')),
 'cata-1': ('duo', lap(H+'cata-d-hero.png') + ph(H+'cata-m-hero.png')),
 'cata-2': ('duo', lap(H+'cata-d-animacion.png') + ph(H+'cata-m-animacion.png')),
 'cata-3': ('one', lap(H+'cata-d-identidad.png')),
 'figma-1': ('one', lap('../img/figma/dtr-producto.webp')),
 'figma-2': ('row', ph('../img/figma/ev-inicio.webp') + ph('../img/figma/ev-producto.webp')),
 'nails-5': ('trio', lap(H+'nails-d-hero.png') + tab(H+'nails-t-hero.png') + ph(H+'nails-m-hero.png')),
 'nails-6': ('float', fl(H+'nails-d-cursos.png', H+'nails-d-tecnica.png', H+'nails-d-visitanos.png')),
 'kronox-6': ('trio', lap(H+'kronox-d-hero.png') + tab(H+'kronox-t-hero.png') + ph(H+'kronox-m-hero.png')),
 'kronox-7': ('float', fl(H+'kronox-d-videoclips.png', H+'kronox-d-rodaje.png', H+'kronox-d-contacto.png')),
 'nacar-3': ('trio', lap(H+'nacar-d-hero.png') + tab(H+'nacar-t-hero.png') + ph(H+'nacar-m-hero.png')),
 'nacar-4': ('float', fl('shots/nacar-nov.png', 'shots/nacar-prod.png', 'shots/nacar-cart.png')),
 'nacar-5': ('row', ph(H+'nacar-m-hero.png') + ph(H+'nacar-m-prod.png') + ph('shots/nacar-m-cart.png')),
 'amigos-2': ('tabrow', tab(H+'amigos-t-hero.png') + ph('../img/ea/s2.webp') + ph('../img/ea/s5.webp')),
 'jairo-3': ('trio', lap(H+'jairo-d-hero.png') + tab(H+'jairo-t-hero.png') + ph(H+'jairo-m-hero.png')),
 'jairo-4': ('float', fl(H+'jairo-d-herramientas.png', H+'jairo-d-videoclips.png', H+'jairo-d-3d.png')),
 'cata-4': ('trio', lap(H+'cata-d-hero.png') + tab(H+'cata-t-hero.png') + ph(H+'cata-m-hero.png')),
 'cata-5': ('float', fl(H+'cata-d-sobre.png', H+'cata-d-personal.png', H+'cata-d-video-web.png')),
 'zk-2': ('trio', lap(H+'zk-d-hero.png') + tab(H+'zk-t-hero.png') + ph(H+'zk-m-hero.png')),
 'zk-3': ('float', fl(H+'zk-d-servicios.png', H+'zk-d-trabajos.png', H+'zk-d-hero.png')),
 'wp-2': ('duo', lap('img/wp_nerflis.jpg') + ph('img/wp_robotika-qs.jpg')),
 'nails-7': ('duo', lap(H+'nails-d-sim2.png') + ph(H+'nails-m-simulador.png')),
 'nails-8': ('duo', lap(H+'nails-d-regalo.png') + ph(H+'nails-m-regalo.png')),
 'nails-9': ('one', lap(H+'nails-d-cursos.png')),
 'nails-10': ('one', lap(H+'nails-d-visitanos.png')),
 'kronox-8': ('one', lap(H+'kronox-d-videoclips.png')),
 'kronox-9': ('one', lap(H+'kronox-d-contacto.png')),
 'jairo-5': ('one', lap(H+'jairo-d-herramientas.png')),
 'jairo-6': ('one', lap(H+'jairo-d-videoclips.png')),
 'jairo-7': ('one', lap(H+'jairo-d-3d.png')),
 'cata-6': ('one', lap(H+'cata-d-sobre.png')),
 'cata-7': ('one', lap(H+'cata-d-personal.png')),
 'cata-8': ('one', lap(H+'cata-d-3d.png')),
 'zk-4': ('one', lap(H+'zk-d-servicios.png')),
 'zk-5': ('one', lap(H+'zk-d-trabajos.png')),
 'dtr-1': ('one', lap('../img/figma/dtr-home.webp')),
 'dtr-2': ('one', lap('../img/figma/dtr-producto.webp')),
 'dtr-3': ('one', lap('../img/figma/dtr-login.webp')),
 'dtr-4': ('one', lap('../img/figma/dtr-carrito.webp')),
 'cold-1': ('one', lap('../img/figma/cold-home.webp')),
 'cold-2': ('one', lap('../img/figma/cold-shop.webp')),
 'wp-3': ('one', lap('img/wp_nerflis.jpg')),
 'figma-3': ('float', fl('../img/figma/dtr-producto.webp', '../img/figma/cold-home.webp', '../img/figma/cold-shop.webp')),
}
only = os.environ.get('ONLY')
html = '<!doctype html><html><head><meta charset="utf-8"><style>%s</style></head><body>%s</body></html>' % (CSS, ''.join(
    '<div class="sc %s" id="%s">%s</div>' % (c, k, b) for k, (c, b) in S.items() if not only or k.startswith(only)))
open('mock/scenes.html', 'w').write(html)
js = '''const {chromium}=require(process.env.PW);(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});
await p.goto('http://localhost:8794/_pdf/mock/scenes.html',{waitUntil:'networkidle'});await p.waitForTimeout(500);
for(const id of await p.evaluate(()=>[...document.querySelectorAll('.sc')].map(e=>e.id))){const missing=await p.evaluate(i=>[...document.querySelectorAll('#'+i+' img')].filter(m=>!m.naturalWidth).map(m=>m.getAttribute('src')),id);if(missing.length)console.log('FALTA',id,missing);
await (await p.$('#'+id)).screenshot({path:'mock/'+id+'.png',omitBackground:true});}await b.close()})();'''
open('mock/r.js', 'w').write(js)
subprocess.run(['node', 'mock/r.js'], check=True)
from PIL import Image
for k in S:
    f = 'mock/%s.png' % k
    if os.path.exists(f):
        im = Image.open(f); assert im.width == 1300, (k, im.size); im.save(f, dpi=(72, 72), optimize=True)
print('ok')
