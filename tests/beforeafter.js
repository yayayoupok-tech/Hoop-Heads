// Before/after gallery (M9): pairs every M0 audit shot (shots/audit) with the same shot on this build (first run
// `node tests/shots.js <dir>`), side by side with captions, into shots/before-after/.
// Usage: node tests/beforeafter.js <afterDir>
const fs = require('fs'), path = require('path');
const { ROOT, launch } = require('./lib');
const BEFORE = path.join(ROOT, 'shots', 'audit'), AFTER = path.resolve(process.argv[2] || ''), OUT = path.join(ROOT, 'shots', 'before-after');
(async () => {
  fs.mkdirSync(OUT, { recursive: true }); const names = fs.readdirSync(BEFORE).filter(f => f.endsWith('.jpg')).sort();
  const b = await launch(); const ctx = await b.newContext({ viewport: { width: 1680, height: 600 } }); const page = await ctx.newPage(); let n = 0, missing = [];
  for (const f of names) {
    const aPath = path.join(AFTER, f === 'd30_training.jpg' ? 'd30_practice.jpg' : f); if (!fs.existsSync(aPath)) { missing.push(f); continue; }
    const img = p => 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64'); const phone = f.startsWith('p'); const w = 820, h = phone ? Math.round(820 * 390 / 844) : Math.round(820 * 720 / 1280);
    const label = f.replace(/\.jpg$/, '').replace(/^([dp])(\d+)_/, (m, k, d) => (k === 'd' ? 'Desktop ' : 'Phone ') + d + ' · ').replace(/_/g, ' ');
    await page.setViewportSize({ width: 2 * w + 60, height: h + 76 });
    await page.setContent(`<html><body style="margin:0;background:#0B1030;font-family:Arial,Helvetica,sans-serif;color:#F3F0FF">
      <div style="display:flex;gap:20px;padding:12px 20px 0 20px">${[['BEFORE · M0 audit', BEFORE + '/' + f, '#C9CCE0'], ['AFTER · M9 final build', aPath, '#FFD23F']].map(([cap, p, col]) => `<div style="width:${w}px"><div style="font-weight:900;font-size:17px;color:${col};margin-bottom:6px">${cap}</div><img src="${img(p)}" style="width:${w}px;height:${h}px;display:block;border-radius:6px;object-fit:cover"></div>`).join('')}</div>
      <div style="position:absolute;right:22px;top:12px;font-size:15px;color:#9FB0FF">${label}</div></body></html>`);
    await page.waitForTimeout(60); await page.screenshot({ path: path.join(OUT, f.replace('d30_training', 'd30_training_practice')), type: 'jpeg', quality: 80 }); n++;
  }
  console.log('pairs', n, 'missing', missing.join(', ') || 'none'); await b.close();
})();
