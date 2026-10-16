const { chromium } = require(process.env.PW || 'playwright');
const out = process.argv[2];
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 1400 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8794/_pdf/cards.html', { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  for (const id of ['th', 'og', 'oge', 'v1', 'v2', 'bgm', 'bgd']) await (await p.$('#' + id)).screenshot({ path: (id === 'og' ? 'og.png' : id === 'oge' ? 'og-en.png' : out + id + '.png') });
  await b.close(); })();
