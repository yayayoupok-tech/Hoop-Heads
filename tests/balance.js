// Balance harness: a scripted "human" plays real 1v1 matches against the bots. Prints points per possession by strategy
// against Pro and Legend, plus Legend vs Pro (bot vs bot). Usage: node tests/balance.js [gamesPerCell=12] [target=21]
const { launch, openPage } = require('./lib');
(async () => {
  const n = +(process.argv[2] || 12), target = +(process.argv[3] || 21);
  const browser = await launch(); const P = await openPage(browser);
  const t0 = Date.now();
  const rows = await P.ev(({ n, target }) => runBalanceHarness({ n, target }), { n, target });
  const table = await P.ev(rows => formatHarnessTable(rows), rows);
  console.log('Scripted-human balance harness · 1v1 · first to ' + target + ' · mirrored ratings (all 6s, 1.93 m) · ' + n + ' games per cell');
  for (const l of table) console.log(l);
  const lvp = await P.ev(n => { const a = runSims({ n, mode: '1v1', difficulty: 'legend', difficulty2: 'pro', format: { type: 'first', target: 21 }, teamA: 'legends', teamB: 'legends' }); return { wins: a.wins, games: a.games, ppp: [a.teams[0].ppp, a.teams[1].ppp] }; }, Math.max(20, n * 3));
  console.log('Legend vs Pro (bot vs bot, 1v1, first to 21): Legend wins ' + lvp.wins[0] + ' of ' + lvp.games + ' (' + Math.round(100 * lvp.wins[0] / lvp.games) + '%) · PPP ' + lvp.ppp.map(v => v.toFixed(2)).join(' vs '));
  const brute = rows.find(r => r.strategy === 'brute' && r.difficulty === 'pro'), best = rows.filter(r => r.difficulty === 'pro' && (r.strategy === 'sniper' || r.strategy === 'reader')).reduce((a, r) => Math.max(a, r.ppp), 0);
  console.log('targets: brute force vs Pro ≤ 1.30 PPP → ' + brute.ppp.toFixed(2) + (brute.ppp <= 1.3 ? ' ✓' : ' ✗') + ' · timing/reads beat brute force → ' + best.toFixed(2) + ' vs ' + brute.ppp.toFixed(2) + (best > brute.ppp ? ' ✓' : ' ✗') + ' · Legend beats Pro 75–95% → ' + Math.round(100 * lvp.wins[0] / lvp.games) + '%' + (lvp.wins[0] / lvp.games >= 0.75 && lvp.wins[0] / lvp.games <= 0.95 ? ' ✓' : ' ✗'));
  console.log('(' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)' + (P.errors.length ? '\nERRORS: ' + P.errors.join(' | ') : ''));
  await browser.close();
})();
