// Trait balance (2.0 §2.1: rarer means stronger): the career simulator with every career's signature trait forced to
// one trait (no hidden trait, no third), N careers per trait, and the same N careers with no trait at all (the
// baseline: what the career is worth on its own). Prints each trait's median legacy against the baseline's median and,
// by rarity (the rarity's careers together), the targets: Common +0–8%, Uncommon +6–15%, Rare +15–30%, Legendary
// +35–60%, rising with rarity. Also how far each trait levelled up by retirement (V3 §2.2: Bronze → Silver → Gold).
// V6: the careers run the career simulator's great policy (--policy=typical for the other). Under Part 2's harder climb a
// typical career's legacy is its seasons and points (half of all careers score 29–36, whatever the trait), so its median
// can't see a trait; the great policy's careers spread over titles, MVPs and All-League teams, as V5's did.
// Usage: node tests/traitbalance.js [careers per trait=200] [seed=1] [parallel=4] [--policy=great|typical]
const { spawn } = require('child_process'); const path = require('path');
const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--')), N = +(ARGS[0] || 200), SEED = +(ARGS[1] || 1), PAR = +(ARGS[2] || 4), POLICY = ((process.argv.find(a => a.startsWith('--policy=')) || '').split('=')[1]) || 'great';
const TRAITS = ['gymrat', 'streaky', 'glueguy', 'fasttwitch', 'quickstudy', 'clutch', 'ironman', 'floorgeneral', 'showman', 'paintprotector', 'latebloomer', 'microwave', 'filmjunkie', 'freak', 'generational', 'unbreakable', 'iceveins'];
const RAR = { gymrat: 'C', streaky: 'C', glueguy: 'C', fasttwitch: 'C', quickstudy: 'C', clutch: 'U', ironman: 'U', floorgeneral: 'U', showman: 'U', paintprotector: 'U', latebloomer: 'R', microwave: 'R', filmjunkie: 'R', freak: 'R', generational: 'L', unbreakable: 'L', iceveins: 'L' };
const BAND = { C: [0, 0.08], U: [0.06, 0.15], R: [0.15, 0.30], L: [0.35, 0.60] }, NAME = { C: 'Common', U: 'Uncommon', R: 'Rare', L: 'Legendary' };
const run = id => new Promise(res => { const p = spawn('node', [path.join(__dirname, 'careersim.js'), String(N), String(SEED), '0', '--trait=' + id, '--policy=' + POLICY, '--json', '--set', 'traits.thirdAt=1e12']); let out = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d); p.on('close', () => { const line = out.split('\n').find(l => l.startsWith('JSON ')); if (!line) return res({ error: out.split('\n').slice(-5).join(' | ') }); res(JSON.parse(line.slice(5))); }); });
(async () => {
  const t0 = Date.now(); const queue = ['none'].concat(TRAITS), results = {};
  await Promise.all(Array.from({ length: PAR }, async () => { while (queue.length) { const id = queue.shift(); results[id] = await run(id); } }));
  const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0; };
  const base = results.none; if (!base || base.error) { console.log('baseline ERROR ' + (base && base.error)); process.exit(1); }
  const ageOf = a => { const v = (a || []).filter(x => x != null); return v.length ? String(med(v)) : '–'; }; // the median age at the level, among the careers that got there
  const M0 = med(base.legacy), pct = d => ((d >= 0 ? '+' : '') + Math.round(100 * d) + '%');
  console.log('Trait balance · ' + N + ' careers per trait (signature forced, no hidden or third trait) · seed ' + SEED + ' · the ' + POLICY + ' policy · baseline (no trait) median legacy ' + M0);
  console.log('trait            rarity  median  vs none  titles  HOF   Silver (age)  Gold (age)  deeds   stuck');
  let fails = 0;
  for (const id of TRAITS) { const r = results[id]; if (!r || r.error) { fails++; console.log(id.padEnd(16) + ' ERROR ' + (r && r.error)); continue; }
    const m = med(r.legacy), d = M0 ? (m - M0) / M0 : 0, titles = r.titles.reduce((a, b) => a + b, 0) / r.n, lv = r.lv || [], sil = lv.filter(x => x >= 2).length / Math.max(1, lv.length), gold = lv.filter(x => x >= 3).length / Math.max(1, lv.length); if (r.stuck) fails++;
    console.log(id.padEnd(16) + ' ' + RAR[id].padEnd(7) + ' ' + String(m).padStart(6) + '  ' + pct(d).padStart(7) + '  ' + titles.toFixed(2).padStart(6) + '  ' + String(Math.round(100 * r.hof / r.n) + '%').padStart(4) + '  ' + (String(Math.round(100 * sil) + '%').padStart(4) + ' (' + ageOf(r.ageS) + ')').padEnd(12) + '  ' + (RAR[id] === 'C' ? '—' : String(Math.round(100 * gold) + '%').padStart(4) + ' (' + ageOf(r.ageG) + ')').padEnd(10) + '  ' + String(r.deedTot && r.deedTot.some(x => x != null) ? med(r.deedTot.filter(x => x != null)) : '—').padStart(5) + '   ' + (r.stuck ? 'STUCK' : '0')); }
  console.log('by rarity (its careers together)   median  vs none   target');
  let prev = -Infinity;
  for (const k of ['C', 'U', 'R', 'L']) { const all = [].concat(...TRAITS.filter(id => RAR[id] === k).map(id => (results[id] && results[id].legacy) || [])), m = med(all), d = M0 ? (m - M0) / M0 : 0, [lo, hi] = BAND[k], ok = d >= lo - 1e-9 && d <= hi + 1e-9 && m >= prev; if (!ok) fails++; prev = m;
    console.log(('  ' + NAME[k]).padEnd(34) + ' ' + String(m).padStart(6) + '  ' + pct(d).padStart(7) + '   ' + pct(lo) + '…' + pct(hi).slice(1) + (ok ? ' ✓' : ' ✗')); }
  console.log((fails ? fails + ' check(s) out of range' : 'every rarity in its band, rising with rarity') + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); process.exitCode = fails ? 1 : 0;
})();
