// Difficulty (V6, Part 2 §1.1 and §7): the §1.1 table from the career simulator, 600 careers across 3 seeds (200 a
// seed), with the "typical" policy (sensible choices, mostly simmed) and the "great" one (plays every game well: each
// game counts as played, with an edge in the box score). Usage: node tests/difficulty.js [careersPerSeed=200]
// [--seeds=1,2,3] [--jobs=4] [--edge=2.5] [--set path=JSON ...] (passed on to careersim.js). Exits 1 when a row misses.
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
// Each row: what it measures for a list of careers (the diff records), its text and the target's test.
// A career record: v (the year you made varsity, 1–4, or null), st (stars at signing), cs (the college year you first
// started, or null), of (the best first pro offer's stars), a3 (age at the first 3★ team, or null), b5 (the best
// franchise's stars), t (titles), h (Hall of Fame).
const ROWS = [
  { k: 'varsity', label: 'Makes varsity',
    typical: { want: 'soph or junior (fr 20–25%)', val: D => { const fr = pct(D.filter(r => r.v === 1).length, D.length), y = median(D.map(r => r.v == null ? 9 : r.v)); return { txt: 'fr ' + fr.toFixed(0) + '% · median yr ' + y, ok: fr >= 20 && fr <= 25 && (y === 2 || y === 3) }; } },
    great: { want: 'freshman', val: D => { const fr = pct(D.filter(r => r.v === 1).length, D.length); return { txt: 'fr ' + fr.toFixed(0) + '%', ok: fr >= 50 }; } } },
  { k: 'stars', label: 'Recruit stars at graduation',
    typical: { want: '2–3★', val: D => { const s = pct(D.filter(r => r.st === 2 || r.st === 3).length, D.length), m = median(D.map(r => r.st)); return { txt: '2–3★ ' + s.toFixed(0) + '% · median ' + m + '★', ok: m >= 2 && m <= 3 && s >= 50 }; } },
    great: { want: '4–5★', val: D => { const s = pct(D.filter(r => r.st >= 4).length, D.length), m = median(D.map(r => r.st)); return { txt: '4–5★ ' + s.toFixed(0) + '% · median ' + m + '★', ok: m >= 4 && s >= 50 }; } } },
  { k: 'colstart', label: 'Starts in college',
    typical: { want: 'year 2–3', val: D => { const s = pct(D.filter(r => r.cs === 2 || r.cs === 3).length, D.length), m = median(D.map(r => r.cs == null ? 9 : r.cs)); return { txt: 'yr 2–3 ' + s.toFixed(0) + '% · median yr ' + m, ok: m >= 2 && m <= 3 }; } },
    great: { want: 'year 1', val: D => { const s = pct(D.filter(r => r.cs === 1).length, D.length); return { txt: 'yr 1 ' + s.toFixed(0) + '%', ok: s >= 50 }; } } },
  { k: 'offer', label: 'First pro offer',
    typical: { want: '1–2★ or undrafted', val: D => { const s = pct(D.filter(r => (r.of || 0) <= 2).length, D.length); return { txt: '1–2★ ' + s.toFixed(0) + '% · median ' + median(D.map(r => r.of || 0)) + '★', ok: s >= 50 }; } },
    great: { want: '3★', val: D => { const m = median(D.map(r => r.of || 0)), s = pct(D.filter(r => r.of === 3).length, D.length); return { txt: 'median ' + m + '★ · 3★ ' + s.toFixed(0) + '%', ok: m === 3 }; } } },
  { k: 'team3', label: 'Reaches a 3★ team',
    typical: { want: 'by 26–28 in 50%', val: D => { const b28 = pct(D.filter(r => r.a3 != null && r.a3 <= 28).length, D.length), b25 = pct(D.filter(r => r.a3 != null && r.a3 <= 25).length, D.length), m = median(D.map(r => r.a3 == null ? 99 : r.a3)); return { txt: 'by 28 ' + b28.toFixed(0) + '% · median age ' + (m === 99 ? 'never' : m), ok: m >= 26 && m <= 28 && b28 >= 50 && b25 < 50 }; } },
    great: { want: 'by 24', val: D => { const b24 = pct(D.filter(r => r.a3 != null && r.a3 <= 24).length, D.length); return { txt: 'by 24 ' + b24.toFixed(0) + '%', ok: b24 >= 50 }; } } },
  { k: 'team5', label: 'Reaches a 5★ team',
    typical: { want: '15–25%', val: D => { const s = pct(D.filter(r => r.b5 >= 5).length, D.length); return { txt: s.toFixed(1) + '%', ok: s >= 15 && s <= 25 }; } },
    great: { want: 'about 60% (52–68)', val: D => { const s = pct(D.filter(r => r.b5 >= 5).length, D.length); return { txt: s.toFixed(1) + '%', ok: s >= 52 && s <= 68 }; } } },
  { k: 'titles', label: 'Championships per career',
    typical: { want: 'about 0.3 (0.2–0.4)', val: D => { const m = D.reduce((x, r) => x + (r.t || 0), 0) / Math.max(1, D.length); return { txt: m.toFixed(2), ok: m >= 0.2 && m <= 0.4 }; } },
    great: { want: '1–3', val: D => { const m = D.reduce((x, r) => x + (r.t || 0), 0) / Math.max(1, D.length); return { txt: m.toFixed(2), ok: m >= 1 && m <= 3 }; } } },
  { k: 'hof', label: 'Hall of Fame',
    typical: { want: '3–8%', val: D => { const s = pct(D.filter(r => r.h).length, D.length); return { txt: s.toFixed(1) + '%', ok: s >= 3 && s <= 8 }; } },
    great: { want: 'about 35% (30–40)', val: D => { const s = pct(D.filter(r => r.h).length, D.length); return { txt: s.toFixed(1) + '%', ok: s >= 30 && s <= 40 }; } } },
];

(async () => {
  console.log('difficulty (Part 2 §1.1): ' + per + ' careers × ' + seeds.length + ' seeds (' + seeds.join(', ') + ') per policy' + (sets.length ? ' · overrides ' + sets.filter((x, i) => i % 2).join(', ') : ''));
  const tasks = [];
  for (const policy of ['typical', 'great']) for (const s of seeds) tasks.push(() => runOne(policy, s));
  const res = await pool(tasks, jobs);
  const failed = res.filter(r => !r.d);
  for (const f of failed) console.log('FAIL careersim ' + f.policy + ' seed ' + f.seed + ' exit ' + f.code + ': ' + f.err);
  const by = { typical: [], great: [] }, stuck = { typical: 0, great: 0 }, errs = [];
  for (const r of res) if (r.d) { by[r.policy].push(...r.d.diff); stuck[r.policy] += r.d.diff.filter(x => x.stuck).length; if (r.errs && r.errs !== '[]') errs.push(r.policy + ' ' + r.seed + ': ' + r.errs); }
  const seedCols = policy => seeds.map(s => (res.find(r => r.policy === policy && r.seed === s) || {}).d);
  const W = [30, 26, 30, 26, 34];
  const row = cells => cells.map((c, i) => String(c).padEnd(W[i] || 20)).join(' │ ');
  console.log('');
  console.log(row(['Milestone', 'Typical: target', 'Typical: measured', 'Great: target', 'Great: measured']));
  console.log(W.map(w => '─'.repeat(w)).join('─┼─'));
  let misses = 0; const perSeed = [];
  for (const R of ROWS) {
    const ty = R.typical.val(by.typical), gr = R.great.val(by.great);
    if (!ty.ok) misses++; if (!gr.ok) misses++;
    console.log(row([R.label, R.typical.want, (ty.ok ? '✓ ' : '✗ ') + ty.txt, R.great.want, (gr.ok ? '✓ ' : '✗ ') + gr.txt]));
    perSeed.push(R.label + ': typical ' + seedCols('typical').map(d => d ? R.typical.val(d.diff).txt : '—').join(' | ') + ' · great ' + seedCols('great').map(d => d ? R.great.val(d.diff).txt : '—').join(' | '));
  }
  console.log('');
  console.log('by seed (' + seeds.join(' | ') + '):');
  for (const l of perSeed) console.log('  ' + l);
  const xp = (r => { let s6 = 0, s8 = 0; for (let p = 60; p < 70; p++) s6 += 20 * Math.pow(1.11, p - 40); for (let p = 80; p < 90; p++) s8 += 20 * Math.pow(1.11, p - 40); return s8 / s6; })();
  console.log('the XP curve (§1.2): 20 × 1.11^(rating − 40) a point; 80→90 costs ' + xp.toFixed(1) + '× the 60→70 stretch');
  console.log('careers ' + by.typical.length + ' typical, ' + by.great.length + ' great · stuck ' + (stuck.typical + stuck.great) + ' · ' + Math.round((Date.now() - t0) / 1000) + ' s');
  if (errs.length) console.log('page errors: ' + errs.join(' ; '));
  const ok = !failed.length && !misses && !(stuck.typical + stuck.great) && !errs.length;
  console.log(ok ? 'PASS the §1.1 table: every row in its band, both policies' : 'FAIL ' + misses + ' row' + (misses === 1 ? '' : 's') + ' outside the band' + (failed.length ? ', ' + failed.length + ' runs failed' : '') + (stuck.typical + stuck.great ? ', stuck careers' : ''));
  process.exit(ok ? 0 : 1);
})();
