// Converts every .png in a folder to a .jpg (quality 85) through the headless browser and removes the .png, so milestone
// screenshot folders stay small. Usage: node tests/tojpeg.js <dir> [quality]
const fs = require('fs'), path = require('path');
const { launch } = require('./lib');
(async () => {
  const dir = process.argv[2], q = +(process.argv[3] || 85); if (!dir) { console.log('usage: node tests/tojpeg.js <dir> [quality]'); return; }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')); const b = await launch(); const ctx = await b.newContext({ viewport: { width: 100, height: 100 } }); const page = await ctx.newPage(); let n = 0, before = 0, after = 0;
  for (const f of files) {
    const src = path.join(dir, f), buf = fs.readFileSync(src); before += buf.length;
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20); await page.setViewportSize({ width: w, height: h });
    await page.setContent('<html><body style="margin:0;background:#000"><img style="display:block" src="data:image/png;base64,' + buf.toString('base64') + '"></body></html>'); await page.waitForTimeout(30);
    const out = src.replace(/\.png$/, '.jpg'); await page.screenshot({ path: out, type: 'jpeg', quality: q }); after += fs.statSync(out).size; fs.unlinkSync(src); n++;
  }
  console.log(n + ' files · ' + (before / 1e6).toFixed(1) + ' MB → ' + (after / 1e6).toFixed(1) + ' MB'); await b.close();
})();
