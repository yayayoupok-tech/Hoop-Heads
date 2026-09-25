// Height test: a 2.12 m player against a 1.82 m player, bot vs bot (Pro brains), 2:00 halves. Three versions of the
// ratings: "career" (all 60s plus the career's height shifts, how real careers play), "flat" (all 6s, no shifts) and
// "lockdown" (the dev menu's test: the Lockdown archetype's ratings for both).
// Usage: node tests/heighttest.js [games=60] [career|flat|lockdown|all=all]
const { launch, openPage } = require('./lib');
(async () => {
  const n = +(process.argv[2] || 60), which = process.argv[3] || 'all';
  const browser = await launch(); const P = await openPage(browser); const t0 = Date.now();
  const kinds = which === 'all' ? ['career', 'flat', 'lockdown'] : [which];
  for (const kind of kinds) {
    const r = await P.ev(([n, kind]) => {
      const mk = (h, name) => { let attrs; if (kind === 'career') { const e = effRatings({ sho: 60, fin: 60, han: 60, spd: 60, jmp: 60, def: 60, str: 60 }, h); attrs = {}; for (const k of RATING_KEYS) attrs[k] = ratingToAttr(e[k]); } else attrs = Object.assign({}, kind === 'flat' ? { sho: 6, fin: 6, han: 6, spd: 6, jmp: 6, def: 6, str: 6 } : ARCHETYPES.lockdown.base); return { name, nick: name, arch: 'lockdown', height: h, attrs, look: { skin: 3, hair: 0, hairColor: 0, headScale: 1, number: 7 } }; };
      const tall = mk(2.12, 'Tall'), short = mk(1.82, 'Short'); const res = [];
      for (let i = 0; i < n; i++) { const flip = i % 2; const A_ = flip ? short : tall, B_ = flip ? tall : short; const r = simulateMatch({ mode: '1v1', teams: [Object.assign({}, TEAMS[2], { players: [A_] }), Object.assign({}, TEAMS[5], { players: [B_] })], teamDifficulties: ['pro', 'pro'], seed: (1 + i * 7919) >>> 0, ruleset: 'arcade', format: { type: 'timed', half: 120 }, humanTeam: -1 }); if (flip) { r.teams.reverse(); r.winner = r.winner < 0 ? -1 : 1 - r.winner; } res.push(r); }
      const agg = aggregateSims(res); return { wins: agg.wins, games: agg.games, tall: agg.teams[0], short: agg.teams[1] };
    }, [n, kind]);
    const f = t => 'PPP ' + t.ppp.toFixed(2) + ', FG ' + t.fg.toFixed(0) + '%, blk ' + t.blk.toFixed(1) + ', stl ' + t.stl.toFixed(1) + ', reb ' + t.reb.toFixed(1) + ', TO ' + t.to.toFixed(1) + ', ankles ' + t.ankles.toFixed(1);
    console.log(kind.padEnd(8) + ' 2.12 m won ' + r.wins[0] + ' of ' + r.games + ' · 2.12 m: ' + f(r.tall) + ' · 1.82 m: ' + f(r.short));
  }
  console.log('(' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)' + (P.errors.length ? '\nERRORS: ' + P.errors.join(' | ') : ''));
  await browser.close();
})();
