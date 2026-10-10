// 4.0 (§0.2): what grew between two heap snapshots of the page (tests/memory.js --snap=5,30 writes them). Groups the
// nodes by type and constructor name and prints the groups that grew most, by count and by size, and the canvases,
// images and bitmaps alive in each (their pixels live outside the JS heap, so the count is the clue).
// Usage: node tests/heapdiff.js before.heapsnapshot after.heapsnapshot [top=25]
const fs = require('fs');
function groups(file) {
  const snap = JSON.parse(fs.readFileSync(file, 'utf8')), M = snap.snapshot.meta, NF = M.node_fields, nfN = NF.length, NT = M.node_types[0], S = snap.strings, N = snap.nodes;
  const iType = NF.indexOf('type'), iName = NF.indexOf('name'), iSize = NF.indexOf('self_size'), G = new Map(); let total = 0;
  for (let i = 0; i < N.length; i += nfN) { const type = NT[N[i + iType]], name = type === 'string' || type === 'concatenated string' || type === 'sliced string' ? '(string)' : type === 'code' ? '(code)' : S[N[i + iName]], key = type + ' · ' + String(name).slice(0, 80), g = G.get(key) || { n: 0, size: 0 }; g.n++; g.size += N[i + iSize]; total += N[i + iSize]; G.set(key, g); }
  return { G, total };
}
const [a, b] = [process.argv[2], process.argv[3]], TOP = +(process.argv[4] || 25);
if (!a || !b) { console.log('usage: node tests/heapdiff.js before.heapsnapshot after.heapsnapshot [top]'); process.exit(2); }
const A = groups(a), B = groups(b), rows = [];
for (const [k, g] of B.G) { const o = A.G.get(k) || { n: 0, size: 0 }; rows.push({ k, dn: g.n - o.n, ds: g.size - o.size, n: g.n, size: g.size }); }
for (const [k, o] of A.G) if (!B.G.has(k)) rows.push({ k, dn: -o.n, ds: -o.size, n: 0, size: 0 });
const mb = x => (x / 1048576).toFixed(2) + ' MB';
console.log('heap: ' + mb(A.total) + ' → ' + mb(B.total) + ' (' + (B.total >= A.total ? '+' : '') + mb(B.total - A.total) + ')');
console.log('grew most by size:'); rows.slice().sort((x, y) => y.ds - x.ds).slice(0, TOP).forEach(r => console.log('  ' + (r.ds >= 0 ? '+' : '') + mb(r.ds).padStart(10) + '  ' + (r.dn >= 0 ? '+' : '') + String(r.dn).padStart(6) + '  ' + r.k));
console.log('grew most by count:'); rows.slice().sort((x, y) => y.dn - x.dn).slice(0, TOP).forEach(r => console.log('  ' + (r.dn >= 0 ? '+' : '') + String(r.dn).padStart(6) + '  ' + (r.ds >= 0 ? '+' : '') + mb(r.ds).padStart(10) + '  ' + r.k));
const pix = /HTMLCanvasElement|OffscreenCanvas|ImageBitmap|HTMLImageElement|ImageData|CanvasRenderingContext2D|CanvasPattern|CanvasGradient|Path2D/;
console.log('pictures (count before → after):'); rows.filter(r => pix.test(r.k)).sort((x, y) => y.n - x.n).forEach(r => console.log('  ' + String(r.n - r.dn).padStart(6) + ' → ' + String(r.n).padEnd(6) + r.k));
