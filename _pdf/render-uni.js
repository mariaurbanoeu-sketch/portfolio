// node _pdf/render-uni.js → Paula-Urbano-Portfolio-Uni.pdf (servidor en :8794 desde la raíz)
const { chromium } = require(process.env.PW || 'playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8794/_pdf/uni.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  /* 1920 × 1080 puntos, como el ejemplo: el diseño en px se escala ×4/3 */
  await p.pdf({ path: process.argv[2] || 'Paula-Urbano-Portfolio-Uni.pdf', width: '26.6666667in', height: '15in', scale: 4 / 3, printBackground: true });
  await b.close();
})();
