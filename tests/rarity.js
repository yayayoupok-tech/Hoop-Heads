// 2.0 §1.5 trait rarity: every generated player (teammates, league opponents, the rival, pros) carries one trait rolled
// with the same odds as yours: Common 55%, Uncommon 28%, Rare 13%, Legendary 4%. Over 1,000 generated players
// Legendary lands between 3% and 5%; a 20,000-player run checks every rarity closely.  node tests/rarity.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const b = await launch(); const R = runner('rarity'); const P = await openPage(b);
  const sample = n => P.ev(n => {
    const out = [], src = { teammate: 0, opponent: 0, rival: 0, pro: 0 }; let s = 0; const amN = Math.round(n * 0.7);
    while (out.length < amN) { // amateur careers: the rival, the league's opponents and your team's roster, from the real generators
      const save = defaultSave(); const c = amCreate(save, { name: 'Gen ' + s, look: PRESET_LOOKS[s % PRESET_LOOKS.length], number: 1 + (s % 50), style: Object.keys(AM_STYLES)[s % 5], seed: 7001 + s * 13 }); s++;
      hsAutoResolve(c); if (!c.league) hsBuildLeague(c, amRng(c), 0); amEnsureTeam(c); // the tryout settles your squad and builds its district
      out.push(['rival', c.rival.tr]); for (const o of c.league.opps) if (o !== c.rival && !o.rival) out.push(['opponent', o.tr]); for (const m of c.team.mates) out.push(['teammate', m.tr]);
    }
    out.length = amN; const pc = { seed: 99173, players: {} }; for (let i = 0; out.length + Object.keys(pc.players).length < n; i++) pc.players['p' + i] = { id: 'p' + i }; proEnsureTraits(pc); // the pro league's players
    for (const id in pc.players) out.push(['pro', pc.players[id].tr]);
    const cnt = { C: 0, U: 0, R: 0, L: 0 }, bad = []; for (const [k, tr] of out) { src[k]++; const ids = tr ? [tr.sig, tr.hidden].filter(Boolean) : []; if (ids.length !== 1 || !TR.list[ids[0]]) { bad.push(k); continue; } cnt[TR.list[ids[0]].r]++; }
    return { n: out.length, cnt, src, bad: bad.length, badKinds: [...new Set(bad)] };
  }, n);
  const pct = (r, k) => 100 * r.cnt[k] / r.n;
  await R.step('1,000 generated players: Legendary between 3% and 5%', async () => {
    const r = await sample(1000);
    console.log('  1,000 players (' + Object.entries(r.src).map(([k, v]) => v + ' ' + k + (v === 1 ? '' : 's')).join(', ') + '): Common ' + pct(r, 'C').toFixed(1) + '% · Uncommon ' + pct(r, 'U').toFixed(1) + '% · Rare ' + pct(r, 'R').toFixed(1) + '% · Legendary ' + pct(r, 'L').toFixed(1) + '%');
    if (r.bad) throw new Error(r.bad + ' players without exactly one trait (' + r.badKinds.join(', ') + ')');
    if (pct(r, 'L') < 3 || pct(r, 'L') > 5) throw new Error('Legendary ' + pct(r, 'L').toFixed(1) + '%');
  }, P);
  await R.step('20,000 generated players: every rarity within 1.5 points of 55/28/13/4', async () => {
    const r = await sample(20000);
    console.log('  20,000 players: Common ' + pct(r, 'C').toFixed(1) + '% · Uncommon ' + pct(r, 'U').toFixed(1) + '% · Rare ' + pct(r, 'R').toFixed(1) + '% · Legendary ' + pct(r, 'L').toFixed(2) + '%');
    if (r.bad) throw new Error(r.bad + ' players without exactly one trait');
    const want = { C: 55, U: 28, R: 13, L: 4 }; for (const k in want) if (Math.abs(pct(r, k) - want[k]) > (k === 'L' ? 0.6 : 1.5)) throw new Error(k + ' ' + pct(r, k).toFixed(2) + '%, want ' + want[k] + '%');
  }, P);
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
