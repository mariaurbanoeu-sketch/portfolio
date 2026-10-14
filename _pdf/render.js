// node _pdf/render.js  → Paula-Urbano-Portfolio.pdf (necesita un servidor en :8794 desde la raíz)
const { chromium } = require(process.env.PW || 'playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8794/_pdf/portfolio.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: process.argv[2] || 'Paula-Urbano-Portfolio.pdf', width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
