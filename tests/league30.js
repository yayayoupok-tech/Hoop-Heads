// League life over 30 seasons (2.1 §3.7, W6): a pro league simulated season after season with the offseason run the
// way the career simulator runs it (lgOffseasonAuto). You are a league-average player each season (your ratings set to
// the other starters' mean at 26), so your franchise is like any other. Prints, per league and in all: AI trades a
// season (target 8–15), the share of seasons with a new champion (60%+), how many franchises won a title within the 30
// seasons (all 16), the most titles one franchise won, and the league's talent (starters, benches). Fails on a broken
// invariant (16 starters, five a franchise, a rating out of range) or a page error.
// Usage: node tests/league30.js [leagues=3] [seasons=30] [seed=1]
const { launch, openPage, runner } = require('./lib');
(async () => {
  const N = +(process.argv[2] || 3), SEASONS = +(process.argv[3] || 30), SEED = +(process.argv[4] || 1);
  const browser = await launch(); const P = await openPage(browser, { wait: 500 }); const R = runner('league30'); const all = [];
  for (let k = 0; k < N; k++) {
    await R.step('league ' + (k + 1) + ' (seed ' + (SEED + k) + '): ' + SEASONS + ' seasons', async () => {
      const out = await P.ev(({ SEED, SEASONS }) => { const g = HH.game, save = defaultSave(); g.save.data = save; const c = testProLeague(SEED * 7919 + 13, save); save.career = c; save.c1 = null; const bad = [], seasons = [];
        const neutral = () => { const me = meOf(c), o = c.active.filter(id => id !== c.meId).map(id => recOvr(c.players[id])), mean = o.reduce((a, b) => a + b, 0) / o.length; me.age = 26; for (let i = 0; i < 6; i++) { const d = Math.round(mean - recOvr(me)); if (!d) break; for (const kk of RATING_KEYS) me.r[kk] = clamp(me.r[kk] + d, CR.ratingMin, skillMaxOf(kk, 99)); } };
        const check = tag => { if (c.active.length !== CR.leagueSize || !pblReady(c)) bad.push(tag + ': ' + c.active.length + ' starters'); for (const id of frIds()) if (lgCount(c, id) !== 5) bad.push(tag + ': ' + id + ' has ' + lgCount(c, id)); for (const pid of c.active) for (const kk of RATING_KEYS) { const v = c.players[pid].r[kk]; if (!isFinite(v) || v < CR.ratingMin - 0.01 || v > CR.ratingMax + 0.01) bad.push(tag + ': rating ' + kk + ' ' + v); } };
        neutral(); let pre = lgPowerUpdate(c).order.slice();
        for (let s = 0; s < SEASONS && !bad.length; s++) {
          let n = 0; while (c.phase === 'regular' && n++ < 40) { c.events.length = 0; if (!simUserGame(save)) break; }
          n = 0; while (c.phase === 'playoffs' && n++ < 60) { c.events.length = 0; if (!simUserGame(save)) simPlayoffsToEnd(c); }
          c.events.length = 0; if (c.phase !== 'offseason') { bad.push('season ' + c.season + ': phase ' + c.phase); break; }
          const champ = c.history[0] && c.history[0].champClub, trades = lgTradesIn(c, c.season), rk = pre ? pre.indexOf(champ) + 1 : 0, dr = champ ? (() => { let last = 0; for (const h of c.history.slice(1)) if (h.champClub === champ && h.season > last) last = h.season; return c.season - last; })() : 0;
          const O = lgOffseasonAuto(c, {}); if (!O) { bad.push('season ' + c.season + ': no offseason'); break; } check('offseason ' + c.season);
          const st = c.active.filter(id => id !== c.meId).map(id => recOvr(c.players[id])), bn = []; for (const id of frIds()) for (const m of frBenchOf(c, id)) bn.push(tmMateOvr(m));
          seasons.push({ champ, rk, dr, trades, st: st.reduce((a, b) => a + b, 0) / st.length, bn: bn.reduce((a, b) => a + b, 0) / bn.length });
          newSeason(c); c.events.length = 0; neutral(); check('season ' + c.season); pre = lgPowerUpdate(c).order.slice();
        }
        return { seasons, bad: bad.slice(0, 6), errs: (window.HH_ERRORS || []).splice(0, 3) };
      }, { SEED: SEED + k, SEASONS });
      if (out.bad.length) throw new Error(out.bad.join(' | ')); if (out.errs.length) throw new Error('errors: ' + out.errs.join(' | ')); if (P.errors.length) throw new Error('page: ' + P.errors.slice(0, 3).join(' | '));
      const S = out.seasons, ch = S.map(x => x.champ), cnt = {}; for (const x of ch) cnt[x] = (cnt[x] || 0) + 1; let rep = 0; for (let i = 1; i < ch.length; i++) if (ch[i] === ch[i - 1]) rep++;
      const L = { rk: S.map(x => x.rk), dr: S.map(x => x.dr), trades: S.map(x => x.trades), newChamp: 1 - rep / Math.max(1, ch.length - 1), distinct: Object.keys(cnt).length, most: Math.max(...Object.values(cnt)), st: S.map(x => x.st), bn: S.map(x => x.bn), champs: ch }; all.push(L);
      const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
      console.log('     champions: ' + ch.join(' ') + '\n     their preseason power rank: ' + L.rk.join(' ') + '\n     seasons since their last title: ' + L.dr.join(' '));
      return 'trades a season ' + Math.min(...L.trades) + '–' + Math.max(...L.trades) + ' (mean ' + avg(L.trades).toFixed(1) + ') · a new champion ' + Math.round(L.newChamp * 100) + '% · ' + L.distinct + ' of 16 franchises won · most titles ' + L.most + ' · starters ' + avg(L.st.slice(0, 5)).toFixed(1) + ' → ' + avg(L.st.slice(-5)).toFixed(1) + ' · benches ' + avg(L.bn.slice(0, 5)).toFixed(1) + ' → ' + avg(L.bn.slice(-5)).toFixed(1);
    });
  }
  if (all.length) {
    const tr = [].concat(...all.map(L => L.trades)), inBand = tr.filter(t => t >= 8 && t <= 15).length / tr.length, nc = all.reduce((s, L) => s + L.newChamp, 0) / all.length, full = all.filter(L => L.distinct === 16).length;
    console.log('\n§3.7 (league): AI trades a season ' + (tr.reduce((a, b) => a + b, 0) / tr.length).toFixed(1) + ' (8–15 in ' + Math.round(inBand * 100) + '% of seasons) · a new champion in ' + Math.round(nc * 100) + '% of seasons (60%+) · every franchise a title within ' + SEASONS + ' seasons in ' + full + ' of ' + all.length + ' leagues (franchises with a title: ' + all.map(L => L.distinct).join(', ') + ')');
  }
  const fails = R.done(); await browser.close(); process.exitCode = fails ? 1 : 0;
})();
