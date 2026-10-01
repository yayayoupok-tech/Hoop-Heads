// 2.0 §1.1 steal consistency: 500 scripted steal attempts (a defender pokes a live dribble), then both AIs play it out.
// Every STEAL callout and every steal stat must match a real change of possession within 1 s of the poke; every other
// poke shows POKED with no steal stat. Also checks the split: a clean steal 60% (+3% per Defense point above 5), else a
// loose ball that pops toward the stealer 70% of the time.  node tests/steals.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const b = await launch(); const R = runner('steals'); const P = await openPage(b);
  for (const def of [6, 9]) {
    await R.step('500 scripted steals at Defense ' + def + ': zero mismatches', async () => {
      const r = await P.ev(def => stealLab({ n: 500, def }), def);
      const loose = r.toward + r.away, cleanP = r.clean / r.pokes, towardP = loose ? r.toward / loose : 0, want = 0.6 + 0.03 * (def - 5);
      console.log('  Defense ' + def + ': ' + r.pokes + ' pokes · clean ' + (100 * cleanP).toFixed(1) + '% (target ' + (100 * want).toFixed(0) + '%) · loose toward the stealer ' + (100 * towardP).toFixed(1) + '% (target 70%) · STEAL ' + r.steals + ' · POKED ' + r.poked + ' · late turnovers ' + r.lateTO + ' · mismatches ' + r.mismatchCount);
      if (r.pokes < 500) throw new Error('only ' + r.pokes + ' pokes in ' + r.tries + ' tries');
      if (r.mismatchCount) throw new Error(r.mismatchCount + ' mismatches: ' + r.mismatchList.map(x => '#' + x.i + ' ' + x.why).join('; '));
      if (r.unresolved) throw new Error(r.unresolved + ' pokes never resolved');
      if (r.steals + r.poked !== r.pokes) throw new Error('STEAL ' + r.steals + ' + POKED ' + r.poked + ' ≠ ' + r.pokes + ' pokes');
      if (Math.abs(cleanP - want) > 0.07) throw new Error('clean steals ' + (100 * cleanP).toFixed(1) + '%, want ' + (100 * want).toFixed(0) + '% ± 7');
      if (Math.abs(towardP - 0.7) > 0.12) throw new Error('loose balls toward the stealer ' + (100 * towardP).toFixed(1) + '%, want 70% ± 12');
    }, P);
  }
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
