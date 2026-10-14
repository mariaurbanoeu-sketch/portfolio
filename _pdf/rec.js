// graba clips con el screencast de Chrome (nítido a 2x) → carpeta de frames + lista para ffmpeg
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs'), path = require('path');
const OUT = process.argv[2];
async function rec(ctx, page, name, fn) {
  const dir = path.join(OUT, name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(page); const frames = [];
  cdp.on('Page.screencastFrame', async f => { frames.push(f.metadata.timestamp); fs.writeFileSync(path.join(dir, String(frames.length).padStart(5, '0') + '.jpg'), Buffer.from(f.data, 'base64')); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, everyNthFrame: 1 });
  const t0 = Date.now() / 1000; await fn(); const t1 = Date.now() / 1000;
  await cdp.send('Page.stopScreencast');
  let txt = '';
  frames.forEach((t, i) => { const nx = i + 1 < frames.length ? frames[i + 1] : t1; txt += "file '" + String(i + 1).padStart(5, '0') + ".jpg'\nduration " + Math.max(0.001, nx - t).toFixed(3) + '\n'; });
  txt += "file '" + String(frames.length).padStart(5, '0') + ".jpg'\n";
  fs.writeFileSync(path.join(dir, 'list.txt'), txt); console.log(name, frames.length, 'frames', (t1 - t0).toFixed(1) + 's');
}
const scrollTo = async (p, y, ms) => p.evaluate(([y, ms]) => new Promise(r => { const s = scrollY, d = y - s, t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; scrollTo(0, s + d * e); if (k < 1) requestAnimationFrame(f); else r(); })(t0); }), [y, ms]);
(async () => {
  const b = await chromium.launch();
  if (process.argv[3] !== 'desk') {
  // celular: intro → ¿ver o jugar? → mapa → nivel 1
  const cm = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await cm.route(/nailsbymelyg|netlify|jairoazogue|youtube/, r => r.abort());
  const pm = await cm.newPage();
  await rec(cm, pm, 'mob', async () => {
    await pm.goto('http://localhost:8794/'); await pm.waitForTimeout(2900);
    await pm.click('.ts-o[data-ts="game"]'); await pm.waitForTimeout(3600);
    await pm.click('.gw-n.now'); await pm.waitForTimeout(2600);
    await pm.click('.gw-lv .gl-box', { position: { x: 80, y: 8 } }); await pm.waitForTimeout(300);
    await pm.click('#glAct .gl-b'); await pm.waitForTimeout(1600);
    for (const c of await pm.$$('.gl-coin')) { await c.click(); await pm.waitForTimeout(700); }
    await pm.waitForTimeout(1500);
  });
  }
  // computadora: portada y recorrido por las webs
  const cd = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await cd.route(/nailsbymelyg|netlify|jairoazogue|youtube/, r => r.abort());
  await cd.addInitScript(() => { try { sessionStorage.setItem('intro', '1'); sessionStorage.setItem('pm', 'fast'); } catch (e) {} document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = 'iframe.lv,iframe.live{display:none!important}'; document.head.appendChild(st); }); });
  const pd = await cd.newPage(); await pd.goto('http://localhost:8794/'); await pd.waitForTimeout(400);
  const Y = await pd.evaluate(() => { const y = s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY - 70 : 0; }; return { p: y('#proyectos'), n: y('#nails'), f: y('#figma'), m: y('#marcas'), h: y('#herramientas') }; });
  await pd.reload(); await pd.waitForTimeout(100);
  await rec(cd, pd, 'desk', async () => {
    await pd.waitForTimeout(3200);
    await scrollTo(pd, Y.p, 1300); await pd.waitForTimeout(2400);
    await scrollTo(pd, Y.n, 1200); await pd.waitForTimeout(2400);
    await scrollTo(pd, Y.m, 1400); await pd.waitForTimeout(2200);
    await scrollTo(pd, Y.h, 1300); await pd.waitForTimeout(2200);
  });
  await b.close();
})();
