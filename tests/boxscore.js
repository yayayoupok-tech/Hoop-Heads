// 2.0 §1.6 box-score invariants over simulated games: 1,000 of your simmed amateur games (high school seasons) and 1,000
// simmed pro games (both players' lines). Every line: 3PM ≤ 3PA ≤ FGA, 3PM ≤ FGM ≤ FGA, the two-point attempts cover the
// two-point makes, points = 2 × (FGM − 3PM) + 3 × 3PM + FTM, and the points match the game's score.  node tests/boxscore.js
const { launch, openPage, runner } = require('./lib');
const CHECK = `(b, score) => { const bad = [], n = k => b[k] == null ? 0 : b[k];
  for (const k of ['pts', 'fgm', 'fga', 'tpm', 'tpa']) if (!Number.isInteger(b[k]) || b[k] < 0) bad.push(k + ' = ' + b[k]);
  if (n('tpa') > n('fga')) bad.push('3PA ' + b.tpa + ' > FGA ' + b.fga); if (n('tpm') > n('fgm')) bad.push('3PM ' + b.tpm + ' > FGM ' + b.fgm);
  if (n('tpm') > n('tpa')) bad.push('3PM > 3PA'); if (n('fgm') > n('fga')) bad.push('FGM > FGA'); if (n('fga') - n('tpa') < n('fgm') - n('tpm')) bad.push('2PA < 2PM');
  if (n('ftm') > n('fta')) bad.push('FTM > FTA'); const pts = 2 * (n('fgm') - n('tpm')) + 3 * n('tpm') + n('ftm'); if (pts !== b.pts) bad.push('points ' + b.pts + ' ≠ 2×(FGM−3PM)+3×3PM+FTM = ' + pts);
  if (score != null && b.pts !== score) bad.push('points ' + b.pts + ' ≠ score ' + score); return bad; }`;
(async () => {
  const b = await launch(); const R = runner('boxscore'); const P = await openPage(b);
  await R.step('1,000 simmed amateur games: every box score adds up', async () => {
    const r = await P.ev(src => { const check = eval(src); let games = 0, s = 0; const fails = [], tot = { fgm: 0, fga: 0, tpm: 0, tpa: 0, pts: 0 };
      while (games < 1000 && s < 2000) { const save = defaultSave(); const a = amCreate(save, { name: 'Box ' + s, look: PRESET_LOOKS[s % PRESET_LOOKS.length], number: 2, style: Object.keys(AM_STYLES)[s % 5], seed: 31337 + s * 7 }); s++;
        for (let k = 0; k < 16 && games < 1000; k++) { hsAutoResolve(a); if (a.decision || a.stage !== 'hs') break; const res = amSimGame(a); if (!res) break; a.events.length = 0; if (res.bench || !res.line || res.line.fga == null) continue;
          games++; for (const q in tot) tot[q] += res.line[q] || 0; const bad = check(res.line, res.my); if (bad.length && fails.length < 6) fails.push(bad.join('; ') + ' ' + JSON.stringify(res.line)); else if (bad.length) fails.push(''); } }
      return { games, fails: fails.filter(Boolean), nFail: fails.length, tot }; }, CHECK);
    console.log('  ' + r.games + ' games · ' + (r.tot.pts / r.games).toFixed(1) + ' pts · FG ' + r.tot.fgm + '/' + r.tot.fga + ' · 3PT ' + r.tot.tpm + '/' + r.tot.tpa + ' · failures ' + r.nFail);
    if (r.games < 1000) throw new Error('only ' + r.games + ' simmed games'); if (r.nFail) throw new Error(r.nFail + ' bad lines: ' + r.fails.join(' | '));
  }, P);
  await R.step('1,000 simmed pro games: both box scores add up', async () => {
    const r = await P.ev(src => { const check = eval(src); const c = { seed: 4711, players: {}, active: [], me: null, meId: 'nobody', phase: 'regular' }, rng = new RNG(4711), used = new Set();
      for (let i = 0; i < 40; i++) { const p = genProspect(c, rng, used, 'p' + i); p.r = genProRatings(p.arch, p.h, clamp(CR.proMean + CR.proSd * rng.gauss(), 62, 93), rng); c.players[p.id] = p; c.active.push(p.id); } proEnsureTraits(c);
      const fails = []; let games = 0; const tot = { fgm: 0, fga: 0, tpm: 0, tpa: 0, pts: 0 };
      for (; games < 1000; games++) { const ids = c.active, h = ids[rng.int(ids.length)]; let a = h; while (a === h) a = ids[rng.int(ids.length)]; c.phase = games % 5 ? 'regular' : 'playoffs'; const g = simBox(c, h, a, rng);
        for (const [id, sc] of [[h, g.hs], [a, g.as]]) { const bx = g.box[id]; for (const q in tot) tot[q] += bx[q] || 0; const bad = check(bx, g.ot ? null : sc); if (bad.length) fails.push(bad.join('; ') + ' ' + JSON.stringify(bx)); } }
      return { games, fails: fails.slice(0, 6), nFail: fails.length, tot }; }, CHECK);
    console.log('  ' + r.games + ' games · ' + (r.tot.pts / r.games / 2).toFixed(1) + ' pts a side · FG ' + r.tot.fgm + '/' + r.tot.fga + ' · 3PT ' + r.tot.tpm + '/' + r.tot.tpa + ' · failures ' + r.nFail);
    if (r.nFail) throw new Error(r.nFail + ' bad lines: ' + r.fails.join(' | '));
  }, P);
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
