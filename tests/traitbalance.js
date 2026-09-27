// Trait balance (R3 §3.1): the career simulator run with every career's signature trait forced to one trait (and no
// hidden trait), N careers per trait. Prints the median legacy of each trait against the median of all of them
// together: a Common, Uncommon or Rare trait must land within ±20% of it, a Legendary one within +40% (and not under
// −20%). Usage: node tests/traitbalance.js [careers per trait=200] [seed=1] [parallel=4]
const { spawn } = require('child_process'); const path = require('path');
const N = +(process.argv[2] || 200), SEED = +(process.argv[3] || 1), PAR = +(process.argv[4] || 4);
const TRAITS = ['gymrat', 'streaky', 'glueguy', 'fasttwitch', 'quickstudy', 'clutch', 'ironman', 'floorgeneral', 'showman', 'paintprotector', 'latebloomer', 'microwave', 'filmjunkie', 'freak', 'generational', 'unbreakable', 'iceveins'];
const RAR = { gymrat: 'C', streaky: 'C', glueguy: 'C', fasttwitch: 'C', quickstudy: 'C', clutch: 'U', ironman: 'U', floorgeneral: 'U', showman: 'U', paintprotector: 'U', latebloomer: 'R', microwave: 'R', filmjunkie: 'R', freak: 'R', generational: 'L', unbreakable: 'L', iceveins: 'L' };
const run = id => new Promise(res => { const p = spawn('node', [path.join(__dirname, 'careersim.js'), String(N), String(SEED), '0', '--trait=' + id, '--json']); let out = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d); p.on('close', () => { const line = out.split('\n').find(l => l.startsWith('JSON ')); res(line ? JSON.parse(line.slice(5)) : { trait: id, error: out.slice(-400) }); }); });
(async () => {
  const t0 = Date.now(); const queue = TRAITS.slice(), results = {};
  await Promise.all(Array.from({ length: PAR }, async () => { while (queue.length) { const id = queue.shift(); results[id] = await run(id); } }));
  const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0; };
  const all = [].concat(...TRAITS.map(id => (results[id] && results[id].legacy) || [])); const M = med(all);
  console.log('Trait balance · ' + N + ' careers per trait (signature forced, no hidden trait) · seed ' + SEED + ' · overall median legacy ' + M);
  console.log('trait            rarity  median  vs all   titles  earned ($M)  HOF   stuck  target');
  let fails = 0;
  for (const id of TRAITS) { const r = results[id]; if (!r || r.error) { fails++; console.log(id.padEnd(16) + ' ERROR ' + (r && r.error)); continue; }
    const m = med(r.legacy), d = M ? (m - M) / M : 0, lo = -0.2, hi = RAR[id] === 'L' ? 0.4 : 0.2, ok = d >= lo - 1e-9 && d <= hi + 1e-9 && !r.stuck; if (!ok) fails++;
    const titles = r.titles.reduce((a, b) => a + b, 0) / r.n, earned = med(r.money) / 1e6;
    console.log(id.padEnd(16) + ' ' + RAR[id].padEnd(7) + ' ' + String(m).padStart(6) + '  ' + ((d >= 0 ? '+' : '') + Math.round(100 * d) + '%').padStart(6) + '  ' + titles.toFixed(2).padStart(6) + '  ' + earned.toFixed(1).padStart(11) + '  ' + String(Math.round(100 * r.hof / r.n) + '%').padStart(4) + '  ' + String(r.stuck).padStart(5) + '  ' + (RAR[id] === 'L' ? '−20…+40%' : '±20%') + ' ' + (ok ? '✓' : '✗'));
  }
  console.log((fails ? fails + ' trait(s) out of range' : 'every trait in range') + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); process.exitCode = fails ? 1 : 0;
})();
