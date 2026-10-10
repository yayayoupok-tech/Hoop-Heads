// Difficulty (V6, Part 2 §1.1 and §7; 3.0's bands at X11): the §1.1 table from the career simulator, 600 careers across
// 3 seeds (200 a seed), with the "typical" policy (sensible choices, mostly simmed) and the "great" one (plays every
// game well: each game counts as played, with an edge in the box score). Usage: node tests/difficulty.js
// [careersPerSeed=200] [--seeds=1,2,3] [--jobs=4] [--edge=2.5] [--set path=JSON ...] (passed on to careersim.js).
// Exits 1 when a row misses its 3.0 band (Part 2's targets are printed beside them).
const { spawn } = require('child_process');
const path = require('path');
const argv = process.argv.slice(2), sets = [];
for (let i = 0; i < argv.length; i++) if (argv[i] === '--set') { sets.push('--set', argv[i + 1]); argv.splice(i, 2); i--; }
const opt = k => ((argv.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1]);
const per = +(argv.find(a => !a.startsWith('--')) || 200), seeds = (opt('seeds') || '1,2,3').split(',').map(Number), jobs = +(opt('jobs') || 4), edge = opt('edge');
const t0 = Date.now();

function runOne(policy, seed) {
  return new Promise(resolve => {
    const args = [path.join(__dirname, 'careersim.js'), String(per), String(seed), '--policy=' + policy, '--json', ...(edge ? ['--edge=' + edge] : []), ...(opt('staffBudget') ? ['--staffBudget=' + opt('staffBudget')] : []), ...(opt('spend') ? ['--spend=' + opt('spend')] : []), ...(opt('staff') ? ['--staff=' + opt('staff')] : []), ...sets]; /* V10: --staffBudget= (the smart spender's share of the salary) */
    const p = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('close', code => {
      const line = out.split('\n').find(l => l.startsWith('JSON '));
      let d = null; try { d = line ? JSON.parse(line.slice(5)) : null; } catch (e) { d = null; }
      const errs = (out.split('\n').find(l => l.startsWith('errors ')) || '').slice(7);
      resolve({ policy, seed, code, d, errs, err: err.slice(-400) });
    });
  });
}

async function pool(tasks, n) {
  const res = []; let i = 0;
  async function worker() { while (i < tasks.length) { const k = i++; res[k] = await tasks[k](); process.stdout.write('  ran ' + res[k].policy + ' seed ' + res[k].seed + (res[k].d ? ' (' + res[k].d.n + ' careers)' : ' FAILED') + '\n'); } }
  await Promise.all(Array.from({ length: Math.min(n, tasks.length) }, worker));
  return res;
}

const pct = (a, n) => n ? 100 * a / n : 0;
const median = xs => { const s = xs.slice().sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
// A career record: v (the year you made varsity, 1–4, or null), st (stars at signing), cs (the college year you first
// started, or null), of (the best first pro offer's stars), a3 (age at the first 3★ team, or null), b5 (the best
// franchise's stars), t (titles), h (Hall of Fame). M measures a list of them once; each row reads M.
const M = D => { const n = D.length, P = f => pct(D.filter(f).length, n);
  return { n, fr: P(r => r.v === 1), vMed: median(D.map(r => r.v == null ? 9 : r.v)),
    st23: P(r => r.st === 2 || r.st === 3), st45: P(r => r.st >= 4), stMed: median(D.map(r => r.st)),
    cs1: P(r => r.cs === 1), cs23: P(r => r.cs === 2 || r.cs === 3), csMed: median(D.map(r => r.cs == null ? 9 : r.cs)),
    of12: P(r => (r.of || 0) <= 2), of3: P(r => r.of === 3), of45: P(r => r.of >= 4), ofMed: median(D.map(r => r.of || 0)),
    a24: P(r => r.a3 != null && r.a3 <= 24), a25: P(r => r.a3 != null && r.a3 <= 25), a28: P(r => r.a3 != null && r.a3 <= 28), a3Med: median(D.map(r => r.a3 == null ? 99 : r.a3)),
    b5: P(r => r.b5 >= 5), t: D.reduce((x, r) => x + (r.t || 0), 0) / Math.max(1, n), hof: P(r => r.h) };
};
const IN = (x, lo, hi) => x >= lo && x <= hi;
// Each row, for each policy: the measured text, Part 2 §1.1's target (p2: its words, its test) and 3.0's band (x3).
// 3.0 (X11): Part 2's table described a 2.0 career in which a typical player rarely won and a great one won a title or
// two. 3.0 changed that on purpose (the spec's §9: effort matters, no flat decade, a ceiling that tournaments, the crew,
// a facility and badges raise; X5: your 1v1 record is your team's, and team stars follow the team rankings), so its
// rows are judged against 3.0's bands: the 600-career measurement at X11 with room for the seeds' noise. They guard
// against a regression; Part 2's targets stay in the table for comparison (CHANGES.md, X11, has both).
const ROWS = [
  { label: 'Makes varsity',
    typical: { txt: m => 'fr ' + m.fr.toFixed(0) + '% · median yr ' + m.vMed, p2: ['soph or junior (fr 20–25%)', m => IN(m.fr, 20, 25) && IN(m.vMed, 2, 3)], x3: ['fr 30–60% · median yr 1–2', m => IN(m.fr, 30, 60) && IN(m.vMed, 1, 2)] },
    great: { txt: m => 'fr ' + m.fr.toFixed(0) + '%', p2: ['freshman (50%+)', m => m.fr >= 50], x3: ['fr 50%+', m => m.fr >= 50] } },
  { label: 'Recruit stars at graduation',
    typical: { txt: m => '2–3★ ' + m.st23.toFixed(0) + '% · median ' + m.stMed + '★', p2: ['2–3★', m => IN(m.stMed, 2, 3) && m.st23 >= 50], x3: ['2–3★ (median, 50%+)', m => IN(m.stMed, 2, 3) && m.st23 >= 50] },
    great: { txt: m => '4–5★ ' + m.st45.toFixed(0) + '% · median ' + m.stMed + '★', p2: ['4–5★', m => m.stMed >= 4 && m.st45 >= 50], x3: ['4–5★ (median, 50%+)', m => m.stMed >= 4 && m.st45 >= 50] } },
  { label: 'Starts in college',
    typical: { txt: m => 'yr 2–3 ' + m.cs23.toFixed(0) + '% · median yr ' + m.csMed, p2: ['year 2–3', m => IN(m.csMed, 2, 3)], x3: ['year 2–3 (median)', m => IN(m.csMed, 2, 3)] },
    great: { txt: m => 'yr 1 ' + m.cs1.toFixed(0) + '% · median yr ' + (m.csMed === 9 ? 'none' : m.csMed), p2: ['year 1 (50%+)', m => m.cs1 >= 50], x3: ['year 1 in 20%+', m => m.cs1 >= 20] } }, /* 3.0: a 5★ recruit at a blue blood starts when the depth chart says so (X5), and about half leave for the pros before they start (median: none) */
  { label: 'First pro offer',
    typical: { txt: m => '1–2★ ' + m.of12.toFixed(0) + '% · median ' + m.ofMed + '★', p2: ['1–2★ or undrafted', m => m.of12 >= 50], x3: ['median 2–3★', m => IN(m.ofMed, 2, 3)] },
    great: { txt: m => 'median ' + m.ofMed + '★ · 3★ ' + m.of3.toFixed(0) + '% · 4–5★ ' + m.of45.toFixed(0) + '%', p2: ['3★', m => m.ofMed === 3], x3: ['median 3–4★', m => IN(m.ofMed, 3, 4)] } },
  { label: 'Reaches a 3★ team',
    typical: { txt: m => 'by 28 ' + m.a28.toFixed(0) + '% · median age ' + (m.a3Med === 99 ? 'never' : m.a3Med), p2: ['by 26–28 in 50%', m => IN(m.a3Med, 26, 28) && m.a28 >= 50 && m.a25 < 50], x3: ['by 28 in 75%+', m => m.a28 >= 75] },
    great: { txt: m => 'by 24 ' + m.a24.toFixed(0) + '%', p2: ['by 24', m => m.a24 >= 50], x3: ['by 24 in 75%+', m => m.a24 >= 75] } },
  { label: 'Reaches a 5★ team',
    typical: { txt: m => m.b5.toFixed(1) + '%', p2: ['15–25%', m => IN(m.b5, 15, 25)], x3: ['30–60%', m => IN(m.b5, 30, 60)] },
    great: { txt: m => m.b5.toFixed(1) + '%', p2: ['35–55% (2.1 §3.7)', m => IN(m.b5, 35, 55)], x3: ['85%+', m => m.b5 >= 85] } }, /* 2.1 §3.7 (the plays-well policy) replaced Part 2's 52–68% */
  { label: 'Championships per career',
    typical: { txt: m => m.t.toFixed(2), p2: ['about 0.3 (0.2–0.4)', m => IN(m.t, 0.2, 0.4)], x3: ['0.3–1.2 (4.0)', m => IN(m.t, 0.3, 1.2)] },
    great: { txt: m => m.t.toFixed(2), p2: ['1–2 (2.1 §3.7)', m => IN(m.t, 1, 2)], x3: ['1–3 (4.0)', m => IN(m.t, 1, 3)] } }, /* 2.1 §3.7 replaced Part 2's 1–3; 4.0 (§0.1): the league's stars bring a play-well career back to 1–3 titles (3.0's band was 4–7) */
  { label: 'Hall of Fame',
    typical: { txt: m => m.hof.toFixed(1) + '%', p2: ['3–8%', m => IN(m.hof, 3, 8)], x3: ['3–12%', m => IN(m.hof, 3, 12)] }, /* 4.0: the line moved to 225 with the titles */
    great: { txt: m => m.hof.toFixed(1) + '%', p2: ['about 35% (30–40)', m => IN(m.hof, 30, 40)], x3: ['55–85%', m => IN(m.hof, 55, 85)] } },
];

(async () => {
  console.log('difficulty (Part 2 §1.1 and 3.0): ' + per + ' careers × ' + seeds.length + ' seeds (' + seeds.join(', ') + ') per policy' + (sets.length ? ' · overrides ' + sets.filter((x, i) => i % 2).join(', ') : ''));
  const tasks = [];
  for (const policy of ['typical', 'great']) for (const s of seeds) tasks.push(() => runOne(policy, s));
  const res = await pool(tasks, jobs);
  const failed = res.filter(r => !r.d);
  for (const f of failed) console.log('FAIL careersim ' + f.policy + ' seed ' + f.seed + ' exit ' + f.code + ': ' + f.err);
  const by = { typical: [], great: [] }, stuck = { typical: 0, great: 0 }, errs = [];
  for (const r of res) if (r.d) { by[r.policy].push(...r.d.diff); stuck[r.policy] += r.d.diff.filter(x => x.stuck).length; if (r.errs && r.errs !== '[]') errs.push(r.policy + ' ' + r.seed + ': ' + r.errs); }
  const seedCols = policy => seeds.map(s => (res.find(r => r.policy === policy && r.seed === s) || {}).d);
  const W = [28, 28, 28, 32];
  const row = cells => cells.map((c, i) => String(c).padEnd(W[i] || 20)).join(' │ ');
  const mm = { typical: M(by.typical), great: M(by.great) };
  let misses = 0, p2miss = 0; const perSeed = [];
  for (const policy of ['typical', 'great']) {
    console.log('');
    console.log(row([policy === 'typical' ? 'Typical' : 'Great', 'Part 2 §1.1: target', '3.0: band', 'Measured (Part 2 · 3.0)']));
    console.log(W.map(w => '─'.repeat(w)).join('─┼─'));
    for (const R of ROWS) { const C = R[policy], m = mm[policy], o2 = C.p2[1](m), o3 = C.x3[1](m);
      if (!o3) misses++; if (!o2) p2miss++;
      console.log(row([R.label, C.p2[0], C.x3[0], (o2 ? '✓' : '✗') + ' ' + (o3 ? '✓' : '✗') + ' ' + C.txt(m)])); }
  }
  for (const R of ROWS) perSeed.push(R.label + ': typical ' + seedCols('typical').map(d => d ? R.typical.txt(M(d.diff)) : '—').join(' | ') + ' · great ' + seedCols('great').map(d => d ? R.great.txt(M(d.diff)) : '—').join(' | '));
  console.log('');
  console.log('by seed (' + seeds.join(' | ') + '):');
  for (const l of perSeed) console.log('  ' + l);
  const xp = (r => { let s6 = 0, s8 = 0; for (let p = 60; p < 70; p++) s6 += 20 * Math.pow(1.11, p - 40); for (let p = 80; p < 90; p++) s8 += 20 * Math.pow(1.11, p - 40); return s8 / s6; })();
  console.log('the XP curve (§1.2): 20 × 1.11^(rating − 40) a point; 80→90 costs ' + xp.toFixed(1) + '× the 60→70 stretch');
  { const L = policy => res.filter(r => r.policy === policy && r.d && Array.isArray(r.d.legacy)).reduce((a, r) => a.concat(r.d.legacy), []), at = (xs, t) => xs.length ? (100 * xs.filter(x => x >= t).length / xs.length).toFixed(1) + '%' : '—'; /* 2.1 (W6): where the Hall of Fame line could go (career.hofScore; a legacy at or over it) */
    console.log('the Hall of Fame at other lines (a legacy at the line or over it): ' + [175, 200, 225, 250, 275].map(t => t + ' typical ' + at(L('typical'), t) + ' great ' + at(L('great'), t)).join(' · ')); }
  console.log('careers ' + by.typical.length + ' typical, ' + by.great.length + ' great · stuck ' + (stuck.typical + stuck.great) + ' · ' + Math.round((Date.now() - t0) / 1000) + ' s');
  if (errs.length) console.log('page errors: ' + errs.join(' ; '));
  const ok = !failed.length && !misses && !(stuck.typical + stuck.great) && !errs.length;
  console.log('Part 2 §1.1: ' + (16 - p2miss) + ' of 16 rows in their band (for comparison; 3.0 judges by its own)');
  console.log(ok ? 'PASS the table: every row in its 3.0 band, both policies' : 'FAIL ' + misses + ' row' + (misses === 1 ? '' : 's') + ' outside the 3.0 band' + (failed.length ? ', ' + failed.length + ' runs failed' : '') + (stuck.typical + stuck.great ? ', stuck careers' : ''));
  process.exit(ok ? 0 : 1);
})();
