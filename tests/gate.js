// The §2 Legends View gate: runSims 1v1 (Pro mirror, Legend vs Pro) and the balance harness in a court layout, with the
// Classic numbers beside them. Usage: node tests/gate.js [mirrorGames=300] [harnessGamesPerCell=12]
// Targets (Legends): mirror PPP 0.9–1.25 · Legend beats Pro 75–95% · brute force (sprint + Shoot) ≤ 1.3 PPP vs Pro ·
// mirrored matchups 45–55%. The mirror is played both ways round (half the games each side attacks right), because the
// engine has a small side-and-order bias of its own (about 53–54% in Classic too).
const { launch, openPage } = require('./lib');
(async () => {
  const n = +(process.argv[2] || 300), hn = +(process.argv[3] || 12);
  const browser = await launch(); const P = await openPage(browser); const t0 = Date.now();
  const sims = await P.ev(({ n }) => {
    const out = {};
    for (const layout of ['legends', 'classic']) {
      const mirror = (flip) => { let wA = 0, pts = [0, 0], poss = [0, 0], g = 0; for (let i = 0; i < n / 2; i++) { const tA = teamWithRoster(teamDef('legends')), tB = teamWithRoster(teamDef('legends')); tB.abbr += '2'; const b = simulateMatch({ mode: '1v1', difficulty: 'pro', teams: [tA, tB], seed: (1 + i * 7919 + (flip ? 104729 : 0)) >>> 0, format: { type: 'first', target: 21 }, humanTeam: -1, layout, rightTeam: flip ? 1 : 0 }, {}); g++; if (b.winner === 0) wA++; for (let t = 0; t < 2; t++) { pts[t] += b.teams[t].score; poss[t] += b.teams[t].possessions; } } return { wA, g, pts, poss }; };
      const a = mirror(false), b = mirror(true);
      const lvp = runSims({ n: Math.round(n * 2 / 3), mode: '1v1', difficulty: 'legend', difficulty2: 'pro', format: { type: 'first', target: 21 }, teamA: 'legends', teamB: 'legends', layout });
      out[layout] = { mirrorPPP: (a.pts[0] + a.pts[1] + b.pts[0] + b.pts[1]) / (a.poss[0] + a.poss[1] + b.poss[0] + b.poss[1]), mirrorA: (a.wA + b.wA) / (a.g + b.g), rightWins: (a.wA + (b.g - b.wA)) / (a.g + b.g), games: a.g + b.g, lvpWins: lvp.wins[0] / lvp.games, lvpGames: lvp.games, lvpPPP: [lvp.teams[0].ppp, lvp.teams[1].ppp] };
    }
    return out;
  }, { n });
  const harness = {};
  for (const layout of ['legends', 'classic']) harness[layout] = await P.ev(({ hn, layout }) => runBalanceHarness({ n: hn, target: 21, layout }), { hn, layout });
  const pct = v => Math.round(100 * v) + '%', ok = b => b ? ' ✓' : ' ✗';
  console.log('§2 gate · 1v1 first to 21 · ' + n + ' mirror games (both ways round), ' + Math.round(n * 2 / 3) + ' Legend-vs-Pro games, harness ' + hn + ' games per cell\n');
  console.log('                              Legends        Classic       Legends target');
  const L = sims.legends, C = sims.classic;
  console.log('Pro mirror PPP                ' + L.mirrorPPP.toFixed(2).padEnd(15) + C.mirrorPPP.toFixed(2).padEnd(14) + '0.90–1.25' + ok(L.mirrorPPP >= 0.9 && L.mirrorPPP <= 1.25));
  console.log('Pro mirror: team A wins       ' + pct(L.mirrorA).padEnd(15) + pct(C.mirrorA).padEnd(14) + '45–55%' + ok(L.mirrorA >= 0.45 && L.mirrorA <= 0.55));
  console.log('  (the side attacking right)  ' + pct(L.rightWins).padEnd(15) + pct(C.rightWins));
  console.log('Legend beats Pro              ' + pct(L.lvpWins).padEnd(15) + pct(C.lvpWins).padEnd(14) + '75–95%' + ok(L.lvpWins >= 0.75 && L.lvpWins <= 0.95));
  console.log('  PPP Legend vs Pro           ' + (L.lvpPPP.map(v => v.toFixed(2)).join(' / ')).padEnd(15) + C.lvpPPP.map(v => v.toFixed(2)).join(' / '));
  const hrow = (layout, strat, diff) => harness[layout].find(r => r.strategy === strat && r.difficulty === diff);
  console.log('\nScripted human vs bot (harness PPP)     Legends: vs Pro / vs Legend     Classic: vs Pro / vs Legend');
  for (const s of HARNESS_KEYS) { const a = hrow('legends', s, 'pro'), b = hrow('legends', s, 'legend'), c = hrow('classic', s, 'pro'), d = hrow('classic', s, 'legend'); console.log(s.padEnd(40) + (a.ppp.toFixed(2) + ' / ' + b.ppp.toFixed(2)).padEnd(32) + c.ppp.toFixed(2) + ' / ' + d.ppp.toFixed(2)); }
  const brute = hrow('legends', 'brute', 'pro').ppp, best = Math.max(hrow('legends', 'sniper', 'pro').ppp, hrow('legends', 'reader', 'pro').ppp);
  console.log('\nbrute force vs Pro ≤ 1.30 → ' + brute.toFixed(2) + ok(brute <= 1.3) + ' · timing/reads beat brute force → ' + best.toFixed(2) + ok(best > brute));
  console.log('(' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)' + (P.errors.length ? '\nERRORS: ' + P.errors.join(' | ') : ''));
  await browser.close();
})();
const HARNESS_KEYS = ['brute', 'spam', 'drives', 'threes', 'sniper', 'reader'];
