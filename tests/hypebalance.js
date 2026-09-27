// Hype balance (R8 §3.8: hype is not pure upside): two scripted policies, N careers each (the same careers): chase hype
// (trash talk after a win, Confident after a loss) and stay quiet (No comment after a win, Team first after a loss).
// Final legacy, career earnings and pro titles must be within ±10% of each other (the difference over their mean).
// Usage: node tests/hypebalance.js [careers per policy=200] [seed=1] [parallel=4]
const { runPolicies, pct } = require('./policyrun');
const SETS = []; { const a = process.argv; for (let i = 2; i < a.length; i++) if (a[i] === '--set') { SETS.push('--set', a[i + 1]); a.splice(i, 2); i--; } } // --set path=value (a tuning run)
const N = +(process.argv[2] || 200), SEED = +(process.argv[3] || 1), PAR = +(process.argv[4] || 4), TOL = 0.10;
const POL = [{ id: 'chase', label: 'Chase hype' }, { id: 'quiet', label: 'Stay quiet' }].map(p => Object.assign(p, { args: ['--hype=' + p.id].concat(SETS) }));
(async () => {
  const t0 = Date.now(); const R = await runPolicies(POL, N, SEED, PAR); const a = R.chase, b = R.quiet; let fails = 0;
  console.log('Hype balance · ' + N + ' careers per policy (the same careers) · seed ' + SEED + ' · within ±' + Math.round(TOL * 100) + '% of each other');
  for (const r of [a, b]) if (r.errors.length || !r.n) { fails++; console.log('ERROR ' + r.errors.join(' | ').slice(0, 300)); }
  if (!fails) {
    console.log('                     chase hype   stay quiet   difference');
    for (const [k, lab, f] of [['legacy', 'legacy', v => v.toFixed(1)], ['money', 'earned $M', v => (v / 1e6).toFixed(1)], ['titles', 'pro titles', v => v.toFixed(2)]]) { const d = (a[k] - b[k]) / ((a[k] + b[k]) / 2), ok = Math.abs(d) <= TOL + 1e-9; if (!ok) fails++; console.log(lab.padEnd(20) + ' ' + f(a[k]).padStart(10) + '   ' + f(b[k]).padStart(10) + '   ' + pct(d).padStart(9) + ' ' + (ok ? '✓' : '✗')); }
    console.log('Hall of Fame'.padEnd(20) + ' ' + (Math.round(100 * a.hof) + '%').padStart(10) + '   ' + (Math.round(100 * b.hof) + '%').padStart(10)); console.log('pro hype (mean)'.padEnd(20) + ' ' + a.hype.toFixed(1).padStart(10) + '   ' + b.hype.toFixed(1).padStart(10)); if (a.stuck || b.stuck) { fails++; console.log('stuck careers: ' + a.stuck + ' / ' + b.stuck); }
  }
  console.log((fails ? 'out of range' : 'within range') + ' (' + Math.round((Date.now() - t0) / 1000) + ' s)'); process.exitCode = fails ? 1 : 0;
})();
