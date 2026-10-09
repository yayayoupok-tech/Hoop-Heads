// Badge balance (3.0 §6.3; was 2.0 §2.1's trait balance by rarity): the career simulator with every career starting with
// one badge at Lv1 (it levels on by its deed from there; the others are earned as usual), N careers per badge, against
// the same N careers as they are (every badge earned: the baseline) and with no badges at all (what badges are worth
// together). Prints each badge's median legacy against the baseline's, how far it levelled up by retirement (Lv2 and Lv3, and the median age there),
// and its deed's total. Target: no badge costs a career anything (every median at or above the baseline's, −3% for
// noise). V6: the careers run the career simulator's great policy (--policy=typical for the other).
// Usage: node tests/traitbalance.js [careers per badge=200] [seed=1] [parallel=4] [--policy=great|typical] [--seeds=1]
const { spawn } = require('child_process'); const path = require('path');
const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--')), N = +(ARGS[0] || 200), SEED = +(ARGS[1] || 1), PAR = +(ARGS[2] || 4), POLICY = ((process.argv.find(a => a.startsWith('--policy=')) || '').split('=')[1]) || 'great', SEEDS = Math.max(1, +(((process.argv.find(a => a.startsWith('--seeds=')) || '').split('=')[1]) || 1));
const BADGES = ['gymrat', 'streaky', 'glueguy', 'fasttwitch', 'quickstudy', 'clutch', 'ironman', 'floorgeneral', 'showman', 'paintprotector', 'latebloomer', 'microwave', 'filmjunkie', 'freak', 'generational', 'unbreakable', 'iceveins'];
const runOne = (id, seed) => new Promise(res => { const p = spawn('node', [path.join(__dirname, 'careersim.js'), String(N), String(seed), '0'].concat(id === 'earned' ? [] : ['--trait=' + id]).concat(['--policy=' + POLICY, '--json'])); let out = ''; p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d); p.on('close', () => { const line = out.split('\n').find(l => l.startsWith('JSON ')); if (!line) return res({ error: out.split('\n').slice(-5).join(' | ') }); res(JSON.parse(line.slice(5))); }); });
// V7: --seeds=K pools seeds SEED … SEED+K−1 (K × N careers a badge)
const run = async id => { const parts = []; for (let k = 0; k < SEEDS; k++) parts.push(await runOne(id, SEED + k)); const bad = parts.find(r => r.error); if (bad) return bad; const cat = key => [].concat(...parts.map(r => r[key] || [])); return { n: parts.reduce((a, r) => a + r.n, 0), legacy: cat('legacy'), titles: cat('titles'), lv: cat('lv'), ageS: cat('ageS'), ageG: cat('ageG'), deedTot: cat('deedTot'), hof: parts.reduce((a, r) => a + r.hof, 0), stuck: parts.reduce((a, r) => a + (r.stuck || 0), 0) }; };
(async () => {
  const t0 = Date.now(); const queue = ['earned', 'none'].concat(BADGES), results = {};
  await Promise.all(Array.from({ length: PAR }, async () => { while (queue.length) { const id = queue.shift(); results[id] = await run(id); } }));
  const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0; };
  const base = results.earned, none = results.none; if (!base || base.error || !none || none.error) { console.log('baseline ERROR ' + ((base && base.error) || (none && none.error))); process.exit(1); }
  const ageOf = a => { const v = (a || []).filter(x => x != null); return v.length ? String(med(v)) : '–'; }; // the median age at the level, among the careers that got there
  const M0 = med(base.legacy), pct = d => ((d >= 0 ? '+' : '') + Math.round(100 * d) + '%');
  console.log('Badge balance · ' + N + ' careers per badge (each starts with it at Lv1) · seed' + (SEEDS > 1 ? 's ' + SEED + '–' + (SEED + SEEDS - 1) + ' (' + N * SEEDS + ' careers a badge)' : ' ' + SEED) + ' · the ' + POLICY + ' policy · baseline (every badge earned) median legacy ' + M0 + ' · no badges at all ' + med(none.legacy) + ' (' + pct(M0 ? (med(none.legacy) - M0) / M0 : 0) + ')');
  console.log('badge            median  vs base  titles  HOF   Lv2 (age)    Lv3 (age)    deeds   stuck  target');
  let fails = 0;
  for (const id of BADGES) { const r = results[id]; if (!r || r.error) { fails++; console.log(id.padEnd(16) + ' ERROR ' + (r && r.error)); continue; }
    const m = med(r.legacy), d = M0 ? (m - M0) / M0 : 0, titles = r.titles.reduce((a, b) => a + b, 0) / r.n, lv = r.lv || [], l2 = lv.filter(x => x >= 2).length / Math.max(1, lv.length), l3 = lv.filter(x => x >= 3).length / Math.max(1, lv.length), ok = d >= -0.03; if (!ok || r.stuck) fails++;
    console.log(id.padEnd(16) + ' ' + String(m).padStart(6) + '  ' + pct(d).padStart(7) + '  ' + titles.toFixed(2).padStart(6) + '  ' + String(Math.round(100 * r.hof / r.n) + '%').padStart(4) + '  ' + (String(Math.round(100 * l2) + '%').padStart(4) + ' (' + ageOf(r.ageS) + ')').padEnd(12) + ' ' + (String(Math.round(100 * l3) + '%').padStart(4) + ' (' + ageOf(r.ageG) + ')').padEnd(12) + ' ' + String(med((r.deedTot || []).filter(x => x != null))).padStart(6) + '  ' + String(r.stuck || 0).padStart(5) + '  ' + (ok ? '✓' : '✗ under the baseline')); }
  console.log((fails ? fails + ' check(s) out of range' : 'no badge costs a career anything') + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); process.exitCode = fails ? 1 : 0;
})();
