// Dev tools: runSims (1v1 Pro mirror, Legend vs Pro, 3v3 Pro mirror), shotLab and tunnelTest, headless in the page.
// Usage: node tests/devtools.js [--quick]
const { launch, openPage } = require('./lib');
(async () => {
  const quick = process.argv.includes('--quick'); const browser = await launch(); const P = await openPage(browser); let bad = 0;
  const sims = async (label, o) => { const r = await P.ev(o => { const a = runSims(o); return { lines: formatSimTable(a), wins: a.wins, games: a.games, soft: a.softlocks, inv: a.invariantFails, blk: [a.teams[0].blk, a.teams[1].blk] }; }, o); console.log('\n' + label); r.lines.forEach(l => console.log('  ' + l)); if (r.soft || r.inv) { bad++; console.log('  FAIL: softlocks ' + r.soft + ', invariant failures ' + r.inv); } return r; };
  await sims('1v1 · Pro mirror · first to 21', { n: quick ? 12 : 40, mode: '1v1', difficulty: 'pro', format: { type: 'first', target: 21 }, seed: 1 });
  const lvp = await sims('1v1 · Legend (A) vs Pro (B) · first to 21', { n: quick ? 16 : 40, mode: '1v1', difficulty: 'legend', difficulty2: 'pro', format: { type: 'first', target: 21 }, seed: 3 });
  console.log('  Legend win rate ' + Math.round(100 * lvp.wins[0] / lvp.games) + '% (target 75–95%)');
  await sims('3v3 · Pro mirror · 2:00 halves', { n: quick ? 4 : 12, mode: '3v3', difficulty: 'pro', format: { type: 'timed', half: 120 }, seed: 5 });
  const lab = await P.ev(() => [['three', 1, 0], ['three', 0, 0], ['mid', 2, 0.3], ['deep', 1, 0.6]].map(([zone, grade, contest]) => shotLab({ zone, grade, contest, n: 200, seed: 9 })));
  console.log('\nshotLab (200 shots each): zone · grade · contest → model P / actual / roll honored');
  for (const r of lab) { console.log('  ' + r.zone.padEnd(5) + ' · ' + r.grade + ' · ' + r.contest + ' → ' + (100 * r.modelP).toFixed(1) + '% / ' + (100 * r.actual).toFixed(1) + '% / ' + (100 * r.rollHonored).toFixed(1) + '%  (fallbacks ' + r.fallbacks + ')'); if (r.rollHonored < 0.97) bad++; }
  const tun = await P.ev(() => tunnelTest(1000)); console.log('\ntunnelTest: ' + tun.n + ' balls · tunneled ' + tun.tunnels + ' · rim hits ' + tun.rimHits + ' · board hits ' + tun.boardHits); if (tun.tunnels) bad++;
  if (P.errors.length) { bad++; console.log('ERRORS: ' + P.errors.join(' | ')); }
  console.log('\ndevtools: ' + (bad ? bad + ' problem(s)' : 'all OK')); await browser.close(); process.exitCode = bad ? 1 : 0;
})();
