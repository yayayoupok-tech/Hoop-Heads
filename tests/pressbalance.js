// Press balance (R8 §3.9: four answers, none best): the career simulator with every press question answered the same way
// ("always Team first", "always Confident", "always Trash talk", "always No comment"), N careers each (the same careers
// for every policy). Average legacy, career earnings and pro titles must each land within ±8% of the four policies'
// average. Usage: node tests/pressbalance.js [careers per policy=200] [seed=1] [parallel=4]
const { runPolicies, pct } = require('./policyrun');
const SETS = []; { const a = process.argv; for (let i = 2; i < a.length; i++) if (a[i] === '--set') { SETS.push('--set', a[i + 1]); a.splice(i, 2); i--; } } // --set path=value (a tuning run)
const N = +(process.argv[2] || 200), SEED = +(process.argv[3] || 1), PAR = +(process.argv[4] || 4), TOL = 0.08;
const POL = [{ id: 'team', label: 'Always Team first' }, { id: 'confident', label: 'Always Confident' }, { id: 'trash', label: 'Always Trash talk' }, { id: 'nocomment', label: 'Always No comment' }].map(p => Object.assign(p, { args: ['--press=' + p.id].concat(SETS) }));
(async () => {
  const t0 = Date.now(); const R = await runPolicies(POL, N, SEED, PAR); let fails = 0;
  const avg = k => POL.reduce((a, p) => a + R[p.id][k], 0) / POL.length, A = { legacy: avg('legacy'), money: avg('money'), titles: avg('titles') };
  console.log('Press balance · ' + N + ' careers per policy (the same careers) · seed ' + SEED + ' · each within ±' + Math.round(TOL * 100) + '% of the average');
  console.log('policy               legacy (vs avg)      earned $M (vs avg)     pro titles (vs avg)   HOF   pro hype  stuck');
  for (const p of POL) { const r = R[p.id]; if (r.errors.length || !r.n) { fails++; console.log(p.label.padEnd(20) + ' ERROR ' + r.errors.join(' | ').slice(0, 300)); continue; }
    const d = k => (r[k] - A[k]) / A[k], ok = ['legacy', 'money', 'titles'].every(k => Math.abs(d(k)) <= TOL + 1e-9) && !r.stuck; if (!ok) fails++;
    console.log(p.label.padEnd(20) + ' ' + (r.legacy.toFixed(1) + ' (' + pct(d('legacy')) + ')').padEnd(20) + ' ' + ((r.money / 1e6).toFixed(1) + ' (' + pct(d('money')) + ')').padEnd(22) + ' ' + (r.titles.toFixed(2) + ' (' + pct(d('titles')) + ')').padEnd(21) + ' ' + String(Math.round(100 * r.hof) + '%').padStart(4) + '  ' + r.hype.toFixed(1).padStart(8) + '  ' + String(r.stuck).padStart(5) + '  ' + (ok ? '✓' : '✗'));
  }
  console.log('average              ' + A.legacy.toFixed(1).padEnd(20) + ' ' + (A.money / 1e6).toFixed(1).padEnd(22) + ' ' + A.titles.toFixed(2));
  console.log((fails ? fails + ' polic' + (fails > 1 ? 'ies' : 'y') + ' out of range' : 'all four in range') + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); process.exitCode = fails ? 1 : 0;
})();
