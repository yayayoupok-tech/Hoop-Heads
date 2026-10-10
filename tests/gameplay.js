// 2.0 §3 (V4): gameplay, on the 3.0 build. Opponent scouting (every career opponent's personality, four tendencies,
// weakness and tip; the card before a game: 3.0's PLAY goes straight to the game and HOME's Scout report opens the card;
// with no Film weeks or film room (3.0 §1), reading the report studies that opponent), bots that play to their card
// (bot-vs-bot games with and without each tendency and personality), the signature moves (Behind-the-back, Snatch-back,
// Euro-step, Reverse dunk, Pull-up three) and the move list, shot feedback, the contest ring, the block's swat and
// hit-stop, the POKED sound, the phone controls (bigger buttons, the layout editor, auto-sprint, vibration), overtime's
// next basket, and the season's Boss (3.0: a top badge at Lv3, and beating them adds fame).   node tests/gameplay.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const b = await launch(); const R = runner('gameplay'); const D = await openPage(b); const { ev, page } = D; const step = (n, f) => R.step(n, f, D);

  await step('scouting (§3): every opponent has one of the four personalities and four different tendencies (two with the ball, two on defense, never both sagger and presser); the card shows one of each, all four after a Film week or with Film Junkie; its tip answers the tendency it shows; the weakness is the rating furthest under their average; the same opponent always reads the same', async () => {
    const r = await ev(() => {
      const bad = [], pers = {}, tend = {}; let shortPost = 0, posts = 0;
      for (let i = 0; i < 600; i++) {
        const o = { id: 'q' + i, name: 'Player ' + i, style: Object.keys(AM_STYLES)[i % 6], height: 1.78 + (i % 11) * 0.04, r: {} }; for (const k of RATING_KEYS) o.r[k] = 35 + ((i * 7 + k.charCodeAt(0) * 13) % 45);
        const S = scoutOf(o); pers[S.pers] = (pers[S.pers] || 0) + 1; for (const t of S.tend) tend[t] = (tend[t] || 0) + 1;
        if (!SC.pers[S.pers]) bad.push('no personality'); if (S.tend.length !== 4 || new Set(S.tend).size !== 4) bad.push(o.id + ' tendencies ' + S.tend);
        const sides = S.tend.map(t => SC.tend[t].side).join(''); if (sides !== 'odod') bad.push(o.id + ' sides ' + sides);
        if (S.tend.includes('sagger') && S.tend.includes('presser')) bad.push(o.id + ' sags and presses');
        if (S.tend.includes('post')) { posts++; if (o.height < SC.tend.post.minH) shortPost++; }
        const again = scoutOf(Object.assign({}, o, { scout: null })); if (JSON.stringify(again) !== JSON.stringify(S)) bad.push(o.id + ' reads differently');
        const C = scoutCard(o, o.r, o.height, {}), F = scoutCard(o, o.r, o.height, { film: true }), J = scoutCard(o, o.r, o.height, { junkie: true });
        if (C.tend.length !== SC.shown || C.more !== 2 || F.tend.length !== 4 || F.more !== 0 || J.tend.length !== 4) bad.push(o.id + ' shown ' + C.tend.length + '/' + F.tend.length);
        if (C.tip !== SC.tend[C.tend.find(t => SC.tend[t].side === 'o')].tip) bad.push(o.id + ' tip');
        const e = effRatings(o.r, o.height), avg = RATING_KEYS.reduce((a, k) => a + e[k], 0) / RATING_KEYS.length, low = RATING_KEYS.slice().sort((a, b2) => e[a] - e[b2])[0];
        if (avg - e[low] >= SC.weakGap ? C.weak !== low : C.weak !== null) bad.push(o.id + ' weakness ' + C.weak + ' vs ' + low);
      }
      return { bad: bad.slice(0, 6), n: bad.length, pers, tend, posts, shortPost };
    });
    console.log('     personalities ' + JSON.stringify(r.pers) + ' · tendencies ' + JSON.stringify(r.tend) + ' · post-ups rolled ' + r.posts + ' (short players ' + r.shortPost + ')');
    if (r.n) throw new Error(r.n + ' problems: ' + r.bad.join('; '));
    for (const k of ['lockdown', 'gunner', 'showman', 'bully']) if (!(r.pers[k] > 60)) throw new Error('personality ' + k + ' too rare: ' + r.pers[k]);
    if (r.shortPost > r.posts * 0.25) throw new Error('short players post up too often');
  });

  await step('the card before a game (§3): 3.0\'s PLAY on HOME goes straight to the game (§2.2) with the opponent\'s personality and tendencies in the engine; HOME\'s Scout report opens the scouting report (the personality, their badges, the tendencies, the weakness, a tip) and its TIP OFF starts the same game; the pro tale of the tape carries the same card; no film room (3.0 §1): reading the report studies that opponent instead (Film Junkie\'s deed, once a week)', async () => {
    const r = await ev(() => {
      const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save, { name: 'Scout Test', look: PRESET_LOOKS[3], number: 7, style: 'shooter', seed: 4242, seasonLength: 11, gameLength: 120 }); g.save.data.c1 = a; a.events.length = 0; hsAutoResolve(a); a.events.length = 0; if (a.team && !isStarter(a)) ladderInit(a, 1); /* V6: a harder tryout can leave you on the bench (no PLAY): start this one */ g.hubTab = 'home'; g.ui.clearTo(amHub(g));
      const o = amNext(a).opp, S = scoutOf(o), W = () => (g.ui.screen.widgets || []).filter(w => !w.hidden && w.label), film = () => (trDeeds(a) || {}).film || 0;
      const engine = () => { const m = g.match, q = m && m.teams[1].players[0]; return !!q && q.pers === S.pers && JSON.stringify(q.tend) === JSON.stringify(S.tend) && !!(q.brain && q.brain.tm); }; // the bot plays all four, shown or not
      const play = W().find(w => w.label === 'PLAY'); if (!play) throw new Error('no PLAY on HOME'); play.onPress(); if (g.mode !== 'match' || g.ui.screen) throw new Error('PLAY opened ' + (g.ui.screen ? g.ui.screen.name : 'no game')); const out = { play: engine(), noFilm: typeof filmRoomScreen === 'undefined' }; g.quitToMenu();
      const rep = W().find(w => w.label === 'Scout report'); if (!rep) throw new Error('no Scout report on HOME: ' + W().map(w => w.label).join(' | ')); const f0 = film(); rep.onPress(); const s = g.ui.screen; if (!s || s.name !== 'ampregame') throw new Error('Scout report opened ' + (s && s.name));
      const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'); const texts = []; const ft = ctx.fillText.bind(ctx); ctx.fillText = (t, x, y, mw) => { texts.push(String(t)); return ft(t, x, y, mw); }; s.draw(ctx, g.ui);
      const want = [SC.tend[S.tend[0]].text, SC.tend[S.tend[1]].text, scoutPersName(S.pers).toUpperCase(), 'WEAKNESS', 'TIP'].concat(trActive(o).map(id => traitName(id).toUpperCase())); out.miss = want.filter(w => !texts.some(t => t.includes(w)));
      out.studied = !!a.wk && a.wk.studied === o.id && film() === f0 + 1; g.ui.pop(); W().find(w => w.label === 'Scout report').onPress(); out.once = film() === f0 + 1; // the same opponent read twice in a week counts once
      g.ui.screen.widgets.find(w => w.label === 'TIP OFF').onPress(); if (!g.match) throw new Error('TIP OFF started no game'); out.tipoff = engine(); g.quitToMenu();
      const c = testProLeague(21, g.save.data); g.save.data.career = c; g.save.data.c1 = null; g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); const gm = userGame(c), opp = c.players[opponentOf(c, gm)], S2 = scoutOf(opp, c.seed);
      const pr = W().find(w => w.label === 'Scout report'); if (!pr) throw new Error('no Scout report on the pro HOME'); pr.onPress(); const ps = g.ui.screen; if (!ps || ps.name !== 'pregame') throw new Error('the pro Scout report opened ' + (ps && ps.name));
      const t2 = []; const ctx2 = cv.getContext('2d'); ctx2.fillText = (t, x, y, mw) => { t2.push(String(t)); }; ps.draw(ctx2, g.ui); out.pro = t2.some(t => t.includes(SC.tend[S2.tend[0]].text)); const def = engineDef(c, opp.id); out.proDef = def.pers === S2.pers && JSON.stringify(def.tend) === JSON.stringify(S2.tend); out.proStudied = !!c.me.wk && c.me.wk.studied === opp.id; g.ui.pop();
      out.line = scoutPersName(S.pers).toUpperCase() + ' · ' + S.tend.join('/');
      return out;
    });
    if (r.play !== true) throw new Error('PLAY: the engine did not get the personality and tendencies');
    if (r.miss.length) throw new Error('the card is missing ' + r.miss.join(', '));
    if (!r.tipoff) throw new Error('TIP OFF: the engine did not get the personality and tendencies'); if (!r.pro || !r.proDef) throw new Error('the pro card or def');
    if (!r.noFilm || !r.studied || !r.once || !r.proStudied) throw new Error('no film room, reading the report studies them (once a week): ' + JSON.stringify([r.noFilm, r.studied, r.once, r.proStudied]));
    return 'PLAY and TIP OFF: ' + r.line + ' in the engine · the card and the pro tape show it · a read studies them once';
  });

  // bot-vs-bot games, the subject with and without one tendency (the same seeds): the subject's action rate per game
  const ab = async (label, subject, opp, tend, pers, metric, minRel, games) => {
    const r = await ev(([subject, opp, tend, pers, metric, games]) => {
      const pick = name => { for (const k in ROSTER) for (const d of ROSTER[k]) if (d.name === name) return d; throw new Error('no ' + name); };
      const run = (withIt) => { let total = 0, aux = 0, auxN = 0;
        for (let i = 0; i < games; i++) {
          const A = teamWithRoster(TEAMS[0]), B = teamWithRoster(TEAMS[1]); A.players = [Object.assign({}, pick(subject), withIt ? { tend: tend.slice(), pers: pers } : { tend: [], pers: null })]; B.players = [Object.assign({}, pick(opp), { tend: [], pers: null })];
          const m = new Match({ mode: '1v1', teams: [A, B], humanTeam: -1, difficulty: 'allstar', ruleset: 'arcade', format: { type: 'timed', half: 60, periods: 1, ot: 30 }, court: 'arena', seed: 9001 + i * 7919, controlMode: 'lock', headless: true, dev: true });
          const sub = m.teams[0].players[0], oth = m.teams[1].players[0]; let c = 0;
          m.bus.on('MOVE', e => { if (e.player === sub && (metric === 'moves' || metric === 'move:' + e.move)) c++; });
          m.bus.on('PUMP_FAKE', e => { if (e.player === sub && metric === 'pumpfake') c++; });
          m.bus.on('SWIPE', e => { if (e.player === sub && metric === 'swipes') c++; });
          m.bus.on('SHOT_RELEASED', s => { if (s.shooter !== sub) return; if (metric === 'fades' && s.fade) c++; if (metric === 'threes' && s.points === 3) c++; if (metric === 'rim' && (s.type === 'layup' || s.type === 'dunk')) c++; if (metric === 'stepback3' && s.stepback && s.points === 3) c++; if (metric === 'mid' && s.zone === 'mid' && s.type === 'jumper') c++; });
          let bite0 = 0, n = 0; while (!m.ended && n++ < 60 * 60 * 3) { simStep(m, STEP);
            if (metric === 'bites') { if (sub.biteT > 0 && bite0 <= 0) c++; bite0 = sub.biteT; }
            if (metric === 'gap') { const h = m.ball.owner; if (h === oth && h.grounded && Math.abs(h.x - h.hoop.x) > SH.zoneThree && Math.abs(h.x - h.hoop.x) < SH.zoneDeep + LR(1)) { aux += Math.abs(sub.x - h.x); auxN++; } } }
          if (metric === 'post') c = (m.intentCounts && m.intentCounts.post) || 0;
          total += c; }
        return metric === 'gap' ? aux / Math.max(1, auxN) : total / games; };
      return { off: run(false), on: run(true) };
    }, [subject, opp, tend, pers, metric, games || 24]);
    const rel = r.off > 0 ? r.on / r.off - 1 : (r.on > 0 ? 9 : 0);
    console.log('     ' + label.padEnd(44) + ' ' + metric.padEnd(10) + ' without ' + r.off.toFixed(2).padStart(6) + ' · with ' + r.on.toFixed(2).padStart(6) + ' · ' + (rel >= 0 ? '+' : '') + Math.round(rel * 100) + '% (needs ' + (minRel >= 0 ? '+' : '') + Math.round(minRel * 100) + '%)');
    if (minRel >= 0 ? rel < minRel : rel > minRel) throw new Error(label + ': ' + metric + ' ' + r.off.toFixed(2) + ' → ' + r.on.toFixed(2));
    return r;
  };
  await step('bots play to their card (§3): bot-vs-bot (All-Star, one minute), the same 24 games with and without the tendency: Loves the step-back three, Fadeaway artist, Pump-fakes a lot, Lives at the rim, Pulls up from mid-range, Shakes you with moves, Backs smaller players down; Gambles for steals, Bites on pump fakes; Sags off shooters gives the shooter room, Picks you up close takes it away', async () => {
    await ab('Loves the step-back three (Nova)', 'Nova Reyes', 'Ray Bartolo', ['stepback3'], null, 'move:stepback', 0.4);
    await ab('Fadeaway artist (Nova)', 'Nova Reyes', 'Ray Bartolo', ['fade'], null, 'fades', 0.4);
    await ab('Pump-fakes a lot (Nova)', 'Nova Reyes', 'Ray Bartolo', ['pumpfake'], null, 'pumpfake', 0.4);
    await ab('Lives at the rim (Kiki)', 'Kiki Osei', 'Ray Bartolo', ['rim'], null, 'rim', 0.15);
    await ab('Pulls up from mid-range (Nova)', 'Nova Reyes', 'Ray Bartolo', ['pullup'], null, 'mid', 0.15);
    await ab('Shakes you with moves (Kiki)', 'Kiki Osei', 'Ray Bartolo', ['shake'], null, 'moves', 0.25);
    await ab('Backs smaller players down (Tully on Kiki)', 'Tully Okafor', 'Kiki Osei', ['post'], null, 'post', 0.2); // (a post-up waits out AI.postRetryS after the last one: the count saturates)
    await ab('Gambles for steals (Ray on Kiki)', 'Ray Bartolo', 'Kiki Osei', ['gambler'], null, 'swipes', 0.4);
    await ab('Bites on pump fakes (Ray on Nova)', 'Ray Bartolo', 'Nova Reyes', ['biter'], null, 'bites', 0.3);
    await ab('Sags off shooters (Ray on Nova): more room', 'Ray Bartolo', 'Nova Reyes', ['sagger'], null, 'gap', 0.08);
    await ab('Picks you up close (Ray on Nova): less room', 'Ray Bartolo', 'Nova Reyes', ['presser'], null, 'gap', -0.05);
  });
  await step('personalities (§3): a Gunner shoots more threes, a Bully posts up more, a Showman makes more dribble moves, a Lockdown reaches less (the same 24 games each)', async () => {
    await ab('Gunner (Bishop)', 'Bishop Kwan', 'Ray Bartolo', [], 'gunner', 'threes', 0.15);
    await ab('Bully (Tully on Kiki)', 'Tully Okafor', 'Kiki Osei', [], 'bully', 'post', 0.25);
    await ab('Showman (Bishop)', 'Bishop Kwan', 'Ray Bartolo', [], 'showman', 'moves', 0.2);
    await ab('Lockdown (Ray on Kiki): fewer reaches', 'Ray Bartolo', 'Kiki Osei', [], 'lockdown', 'swipes', -0.15);
  });

  await step('signature moves (§3): they unlock at 7 and 8 (Handles 70 Behind-the-back, 80 Snatch-back; Finishing 70 Euro-step; Hops 80 Reverse dunk; Shooting 80 Pull-up three; Quick Study a step early); the move list explains every move', async () => {
    const r = await ev(() => { const bad = [], base = { sho: 60, fin: 60, han: 60, spd: 60, jmp: 60, def: 60, str: 60 };
      const has = (patch, k, early) => !!movesFor(Object.assign({}, base, patch), early)[k];
      const cases = [['btb', { han: 69 }, false], ['btb', { han: 70 }, true], ['snatch', { han: 79 }, false], ['snatch', { han: 80 }, true], ['euro', { fin: 69 }, false], ['euro', { fin: 70 }, true], ['reverse', { jmp: 79 }, false], ['reverse', { jmp: 80 }, true], ['pullup', { sho: 79 }, false], ['pullup', { sho: 80 }, true]];
      for (const [k, p, want] of cases) if (has(p, k) !== want) bad.push(k + ' ' + JSON.stringify(p));
      if (!has({ han: 65 }, 'btb', 5)) bad.push('Quick Study does not start it early');
      for (const k of MOVE_ORDER) if (!MOVE_NAMES[k] || !MOVE_INFO[k] || !MOVE_INFO[k][0] || !MOVE_INFO[k][1]) bad.push('no list entry for ' + k);
      for (const k of ['btb', 'snatch', 'euro', 'reverse', 'pullup']) if (!MOVE_SIG[k] || !SIG_MOVE_CALLOUT[k]) bad.push(k + ' is not marked');
      const E = guideEntries(HH.game, 'moves'); if (E.length !== MOVE_ORDER.length) bad.push('the Codex lists ' + E.length + ' moves');
      return bad; });
    if (r.length) throw new Error(r.join('; '));
  });
  await step('signature moves in the engine: a Behind-the-back can\'t be poked and bursts longer; a second Move in a crossover\'s burst is a Snatch-back (a spin, a bigger ankle chance, the quick gather); the Euro-step halves the contest; a dunk under a shot-blocker is a Reverse dunk the rim shields; a three at full speed is a Pull-up (the quick gather, a wider window); each says its name', async () => {
    const r = await ev(() => {
      const mk = (moves, oppX) => { const A = teamWithRoster(TEAMS[0]), B = teamWithRoster(TEAMS[1]); A.players = [Object.assign({}, A.players[0], { moves })]; B.players = [Object.assign({}, B.players[2])]; const m = new Match({ mode: '1v1', teams: [A, B], humanTeam: -1, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60, periods: 1, ot: 30 }, court: 'arena', seed: 77, controlMode: 'lock', headless: true, dev: true }); const p = m.teams[0].players[0], d = m.teams[1].players[0]; m.phase = 'live'; m.ball.setOwner(p); p.brain = null; d.brain = null; const dir = sgn(p.hoop.x - 7.5) || 1; p.x = p.hoop.x - dir * LX(6); p.y = 0; p.grounded = true; p.setState('move'); d.x = p.x + dir * (oppX == null ? LX(0.8) : oppX); d.setState('stance'); d.grounded = true; const sig = []; m.bus.on('SIGNATURE', e => sig.push(e.move)); return { m, p, d, dir, sig }; };
      const all = { crossover: true, spin: true, stepback: true, hesitation: true, euro: true, dunk360: true, windmill: true, btb: true, snatch: true, reverse: true, pullup: true };
      const out = {};
      { const T = mk(all); startNamedMove(T.p, 'crossover', -T.dir); out.btb = !!T.p.sd.btb; T.p.s0 = null; T.d.setState('swipe', { phase: 'active' }); T.d.facing = sgn(T.p.x - T.d.x); out.btbPoke = resolveSwipe(T.d); let n = 0; while (T.p.state === 'crossover' && n++ < 200) simStep(T.m, STEP); out.btbBurst = T.p.state === 'burst' ? T.p.sd.ms : 0; out.btbSig = T.sig.includes('btb');
        const U = mk(Object.assign({}, all, { btb: false })); startNamedMove(U.p, 'crossover', -U.dir); out.noBtb = !U.p.sd.btb; n = 0; while (U.p.state === 'crossover' && n++ < 200) simStep(U.m, STEP); out.plainBurst = U.p.state === 'burst' ? U.p.sd.ms : 0; }
      { const T = mk(all, LX(0.7)); startNamedMove(T.p, 'crossover', -T.dir); let n = 0; while (T.p.state === 'crossover' && n++ < 200) simStep(T.m, STEP); T.p.actionBuf = 0.1; simStep(T.m, STEP); out.snatch = T.p.state === 'spin' && !!T.p.sd.snatch; out.snatchSig = T.sig.includes('snatch'); n = 0; while (T.p.state === 'spin' && n++ < 300) simStep(T.m, STEP); out.quick = T.m.time - T.p.stepbackT < SH.stepbackWindowS; }
      { const T = mk(all, LX(30)); T.p.x = T.p.hoop.x - T.dir * (SH.layupRange * 0.8); T.p.vx = T.dir * Math.min(LX(1), SH.dunkMinSpeed * 0.5); startShot(T.p); out.euroType = T.p.sd.type; /* (slow: a layup, not a dunk) */ T.p.input.moveX = -T.dir; T.p.sd.moveX0 = T.dir; let n = 0; while (T.p.state === 'gather' && n++ < 100) { T.p.input.moveX = -T.dir; T.p.input.set('shoot', true); simStep(T.m, STEP); } out.euro = T.p.sd.euro === true || T.sig.includes('euro'); }
      { const T = mk(all, LX(30)); T.d.x = T.p.hoop.x - T.dir * LX(0.5); T.p.x = T.p.hoop.x - T.dir * (SH.dunkRange * 0.8); T.p.vx = T.dir * LX(6); T.p.attrs.jmp = 9; if (!canDunk(T.p)) { out.reverse = 'cannot dunk'; } else { startShot(T.p); T.p.input.set('shoot', true); let n = 0; while (T.p.state === 'gather' && n++ < 100) { T.p.input.set('shoot', true); simStep(T.m, STEP); } out.reverse = T.p.state === 'dunk' ? T.p.sd.style : T.p.state; out.reverseSig = T.sig.includes('reverse'); } }
      { const T = mk(all, LX(30)); T.p.x = T.p.hoop.x - T.dir * ((SH.zoneThree + SH.zoneDeep) / 2); T.p.vx = T.dir * LX(MV.pullupMinSpeed + 0.5); startShot(T.p); out.pullup = !!T.p.sd.pullup; out.pullGather = T.p.sd.gatherMs; out.pullSig0 = T.sig.slice();
        const U = mk(Object.assign({}, all, { pullup: false }), LX(30)); U.p.x = T.p.x; U.p.vx = T.p.vx; startShot(U.p); out.plainGather = U.p.sd.gatherMs; out.noPull = !U.p.sd.pullup;
        let n = 0; while (T.p.state === 'gather' && n++ < 100) { T.p.input.set('shoot', true); simStep(T.m, STEP); } out.pullSig = T.sig.includes('pullup'); while (T.p.state === 'jumpshot' && !T.p.sd.released && n++ < 300) { T.p.input.set('shoot', T.p.stateT < T.p.sd.tApex); simStep(T.m, STEP); } out.pullWin = T.m.lastShot && T.m.lastShot.pullup ? T.m.lastShot.window : 0;
        n = 0; while (U.p.state === 'gather' && n++ < 100) { U.p.input.set('shoot', true); simStep(U.m, STEP); } while (U.p.state === 'jumpshot' && !U.p.sd.released && n++ < 300) { U.p.input.set('shoot', U.p.stateT < U.p.sd.tApex); simStep(U.m, STEP); } out.plainWin = U.m.lastShot ? U.m.lastShot.window : 0; }
      { // the rim's shield on a Reverse dunk: the dunk-protect chance is halved
        const T = mk(all, LX(30)); const p = T.p, d = T.d; p.x = p.hoop.x - T.dir * LX(0.4); p.y = 1.2; p.grounded = false; T.m.ball.x = p.x + T.dir * 0.3; T.m.ball.y = p.y + p.reach; /* (the ball in the dunker's hand) */ p.setState('dunk', { style: 0, wasAir: true, tApex: 0.4 }); d.x = p.hoop.x; d.y = p.y + 0.3; d.grounded = false; d.setState('jump', { wasAir: true, tApex: 0.3 }); d.s0 = null; let tally0 = 0, tally5 = 0; const keep = trBlockTally; window.trBlockTally = (dd, ch) => { if (p.sd.style === 5) tally5 = ch; else tally0 = ch; }; T.m.rng = { next: () => 0.999, int: () => 0, range: (a) => a, pick: v => v[0], gauss: () => 0 };
        try { dunkProtect(p); p.sd.style = 5; dunkProtect(p); } finally { window.trBlockTally = keep; } out.shield = tally0 > 0 ? tally5 / tally0 : -1; out.shieldWant = MV.reverseShield; }
      return out;
    });
    console.log('     ' + JSON.stringify(r));
    if (!r.btb || r.btbPoke || !(r.btbBurst > r.plainBurst) || !r.noBtb || !r.btbSig) throw new Error('Behind-the-back: ' + JSON.stringify([r.btb, r.btbPoke, r.btbBurst, r.plainBurst, r.btbSig]));
    if (!r.snatch || !r.snatchSig || !r.quick) throw new Error('Snatch-back');
    if (!r.euro) throw new Error('Euro-step');
    if (r.reverse !== 5 || !r.reverseSig) throw new Error('Reverse dunk: ' + r.reverse);
    if (Math.abs(r.shield - r.shieldWant) > 1e-9) throw new Error('the rim shield ×' + r.shield);
    if (!r.pullup || !r.noPull || !(r.pullGather < r.plainGather) || !r.pullSig || !(r.pullWin > 0)) throw new Error('Pull-up three: ' + JSON.stringify([r.pullup, r.pullGather, r.plainGather, r.pullSig, r.pullWin]));
  });
  await step('the bots use them (§3): All-Star and Legend bots with the moves Euro-step around shot-blockers and Snatch-back out of crossovers in bot-vs-bot games', async () => {
    const r = await ev(() => { const cnt = {}; for (let i = 0; i < 30; i++) { const A = teamWithRoster(TEAMS[0]), B = teamWithRoster(TEAMS[1]); A.players = [Object.assign({}, A.players[1], { tend: ['shake'], pers: 'showman' })]; B.players = [Object.assign({}, B.players[0])]; const m = new Match({ mode: '1v1', teams: [A, B], humanTeam: -1, difficulty: i % 2 ? 'legend' : 'allstar', ruleset: 'arcade', format: { type: 'timed', half: 60, periods: 1, ot: 30 }, court: 'arena', seed: 300 + i * 31, controlMode: 'lock', headless: true, dev: true }); m.bus.on('SIGNATURE', e => { cnt[e.move] = (cnt[e.move] || 0) + 1; }); let n = 0; while (!m.ended && n++ < 60 * 60 * 3) simStep(m, STEP); } return cnt; });
    console.log('     signature moves by bots in 30 games: ' + JSON.stringify(r));
    if (!(r.euro > 0) || !(r.snatch > 0) || !(r.btb > 0)) throw new Error('the bots never used ' + ['euro', 'snatch', 'btb'].filter(k => !(r[k] > 0)).join(', '));
  });

  await step('shot feedback (§3): after a jumper, EARLY / GOOD / PERFECT / LATE and the make chance, with the meter off too; a Settings toggle turns it off; the meter knows the contest at the gather; Minimal draws the sweet spot only', async () => {
    const r = await ev(() => {
      const out = { labels: [feedbackLabel(0, 0), feedbackLabel(1, -0.01), feedbackLabel(2, -0.02), feedbackLabel(3, 0.03), feedbackLabel(2, 0.02)] };
      const A = teamWithRoster(TEAMS[0]), B = teamWithRoster(TEAMS[1]); const m = new Match({ mode: '1v1', teams: [A, B], humanTeam: -1, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60, periods: 1, ot: 30 }, court: 'arena', seed: 5, controlMode: 'lock', headless: true, dev: true }); const p = m.teams[0].players[0], d = m.teams[1].players[0]; m.phase = 'live'; m.ball.setOwner(p); p.brain = null; d.brain = null; const dir = sgn(p.hoop.x - 7.5) || 1; p.x = p.hoop.x - dir * LX(5); p.setState('move'); d.x = p.x + dir * LX(0.8); d.setState('stance');
      startShot(p); out.guess = p.sd.contestGuess; let n = 0; while (p.state === 'gather' && n++ < 100) { p.input.set('shoot', true); simStep(m, STEP); } out.carried = p.sd.contestGuess; while (!p.sd.released && n++ < 300) { p.input.set('shoot', p.stateT < p.sd.tApex - 0.04); simStep(m, STEP); }
      const shot = m.lastShot; out.shot = shot ? { grade: shot.grade, P: shot.P } : null; const lbl = shot ? feedbackLabel(shot.grade, shot.err) : '';
      const cam = new Camera(); cam.resize(1280, 720); const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'); let seen = []; ctx.fillText = t => seen.push(String(t)); ctx.strokeText = () => {};
      drawShotMeter(ctx, cam, p, 1, 'off', shot, shot.t + 0.2, true); out.offFeedback = seen.slice(); seen = []; drawShotMeter(ctx, cam, p, 1, 'off', shot, shot.t + 0.2, false); out.offNone = seen.slice(); seen = []; drawShotMeter(ctx, cam, p, 1, 'on', shot, shot.t + 2, true); out.late = seen.slice(); out.lbl = lbl;
      // minimal: the sweet spot only (one zone fill), on: three zones
      p.setState('jumpshot', { type: 'jumper', tApex: 0.3, released: false, contestGuess: 0.2 }); p.stateT = 0.1; let fills = 0; ctx.fillRect = () => { fills++; }; drawShotMeter(ctx, cam, p, 1, 'minimal', null, 0, false); const fMin = fills; fills = 0; drawShotMeter(ctx, cam, p, 1, 'on', null, 0, false); out.fills = [fMin, fills];
      const S = HH.game.save.data.settings; out.setting = S.shotFeedback === true; const scr = settingsScreen(HH.game, 3); out.row = !!scr.widgets.find(w => w.label === 'Shot feedback');
      return out; });
    if (JSON.stringify(r.labels) !== JSON.stringify(['PERFECT', 'GOOD', 'EARLY', 'LATE', 'LATE'])) throw new Error('labels ' + r.labels);
    if (!(r.guess > 0) || r.carried !== r.guess) throw new Error('the contest at the gather: ' + r.guess + ' / ' + r.carried);
    if (!r.shot || !r.offFeedback.includes(r.lbl) || !r.offFeedback.some(t => /%$/.test(t))) throw new Error('feedback with the meter off: ' + JSON.stringify(r.offFeedback));
    if (r.offNone.length) throw new Error('feedback off still draws ' + r.offNone); if (r.late.length) throw new Error('the label stays too long');
    if (!(r.fills[1] - r.fills[0] === 2)) throw new Error('minimal meter fills ' + r.fills); if (!r.setting || !r.row) throw new Error('the setting');
  });
  await step('defense feel (§3): a contest ring around the shooter for 0.6 s after the release, its color by the contest; a block plays the swat and stops play for a moment (hit-stop); a poke plays its own tick, a steal its own sound; a perfect release chimes', async () => {
    const r = await ev(() => {
      const g = HH.game; g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60, periods: 1, ot: 30 }, court: 'arena', seed: 3, controlMode: 'lock' }, { kind: 'quick' }); const m = g.match, p = m.teams[0].players[0], d = m.teams[1].players[0];
      const calls = []; const au = g.audio; const keep = {}; for (const k of ['swat', 'steal', 'poked', 'perfect', 'block']) { keep[k] = au[k]; au[k] = function () { calls.push(k); }; }
      try {
        const shot = { shooter: p, type: 'jumper', zone: 'three', grade: 0, err: 0, window: 0.03, contest: 0.8, P: 0.3, make: false, points: 3, t: m.time, d: 5, x0: p.x, y0: 2 };
        m.bus.emit('SHOT_RELEASED', shot); const ring = m.ring ? { c: m.ring.c, p: m.ring.p === p } : null;
        const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'); let ell = 0, col = null; ctx.ellipse = function () { ell++; }; const desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'strokeStyle'); Object.defineProperty(ctx, 'strokeStyle', { set(v) { col = v; desc.set.call(this, v); }, get() { return desc.get.call(this); } });
        drawContestRing(ctx, g.cam, m, 1); const drawn = ell, red = col; ell = 0; m.time += CONFIG.fx.contestRingS + 0.05; drawContestRing(ctx, g.cam, m, 1); const gone = ell === 0; m.time -= CONFIG.fx.contestRingS + 0.05;
        const hs0 = g.fx.hitStopMs || 0; m.bus.emit('BLOCK', { player: d, shooter: p, caught: false }); const hit = (g.fx.hitStopMs || 0) > hs0 || g.fx.reduceMotion;
        m.bus.emit('POKED', { player: d, victim: p }); m.bus.emit('STEAL', { player: d, victim: p });
        return { ring, drawn, red, gone, hit, calls, want: contestColor(0.8) };
      } finally { for (const k in keep) au[k] = keep[k]; g.quitToMenu(); } });
    if (!r.ring || !r.ring.p || Math.abs(r.ring.c - 0.8) > 1e-9) throw new Error('no ring'); if (!(r.drawn >= 2) || r.red !== r.want || !r.gone) throw new Error('the ring draws ' + r.drawn + ' in ' + r.red + ', gone ' + r.gone);
    for (const k of ['perfect', 'swat', 'poked', 'steal']) if (!r.calls.includes(k)) throw new Error('no ' + k + ' sound: ' + r.calls); if (r.calls.includes('block')) throw new Error('the old block thud still plays'); if (!r.hit) throw new Error('no hit-stop on the block');
  });

  await step('overtime (§3): next basket wins in every ruleset (Street Sim too), so a tie ends on the first score', async () => {
    const r = await ev(() => { const out = {}; for (const rs of ['arcade', 'street', 'half']) { const m = new Match({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: -1, difficulty: 'pro', ruleset: rs, format: { type: 'timed', half: 60, periods: 1, ot: 30 }, court: 'arena', seed: 4, controlMode: 'lock', headless: true }); m.overtime = 1; m.teams[0].score = 10; m.teams[1].score = 10; const tie = checkWin(m); m.teams[0].score = 12; out[rs] = [tie, checkWin(m)]; } return out; });
    for (const k in r) if (r[k][0] !== false || r[k][1] !== true) throw new Error(k + ': ' + r[k]);
  });

  await step('the Boss (§3): once a season the best regular-season opponent on your schedule (not in the first two weeks; 3.0: no rivals) plays with a top badge at its top level (3.0: Lv3, no Legendary rarity); the hub, the card and tip-off say BOSS; beating them adds fame (3.0: hype is fame); the next season has a new Boss and the old one plays as themselves', async () => {
    const r = await ev(() => {
      const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save, { name: 'Boss Test', look: PRESET_LOOKS[2], number: 5, style: 'slasher', seed: 777, seasonLength: 11, gameLength: 120 }); g.save.data.c1 = a; a.events.length = 0; hsAutoResolve(a); a.events.length = 0;
      amBossEnsure(a); const L = a.league, out = { boss: L.boss }; if (!L.boss) return out; const o = amOppById(a, L.boss), w = L.schedule.indexOf(L.boss), T = traitsOf(o); out.week = w; out.badge = T && T.boss; out.top = !!T && SC.boss.badges.includes(T.boss) && trLvOf(o, T.boss) === trTop(T.boss) && badgeShow(o) === T.boss;
      let best = -1; for (let i = SC.boss.minWeek; i < L.schedule.length; i++) { const q = amOppById(a, L.schedule[i]); if (q) best = Math.max(best, ovrOf(q.r, q.height)); } out.best = ovrOf(o.r, o.height) === best;
      const d = amOppDef(o); out.def = d.traits.includes(T.boss) && d.traitLv[T.boss] === trTop(T.boss); const once = L.boss; amBossEnsure(a); out.once = L.boss === once;
      L.week = w; if (a.team && !isStarter(a)) ladderInit(a, 1); /* you start: HOME's next game is the Boss's */ out.hub = amHubData(g, a).opp.boss === true; g.hubTab = 'home'; g.ui.clearTo(amHub(g));
      const rep = g.ui.screen.widgets.find(x => x.label === 'Scout report'); if (rep) { rep.onPress(); const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'), texts = []; ctx.fillText = t => { texts.push(String(t)); }; g.ui.screen.draw(ctx, g.ui); out.card = texts.includes('BOSS'); g.ui.pop(); }
      const opts = amMatchOpts(g, a, o, 0); out.optsBoss = opts.boss === true;
      const line = () => ({ pts: 20, fgm: 9, fga: 15, tpm: 2, tpa: 4, reb: 3, stl: 1, blk: 0 }), twin = JSON.parse(JSON.stringify(a)); twin.league.boss = null; /* the same win against them as a plain opponent */
      const f0 = a.fame || 0, res = amApplyResult(a, o, 20, 10, line(), true), t0 = twin.fame || 0; amApplyResult(twin, amOppById(twin, o.id), 20, 10, line(), true); out.bossWon = res.bossWon; out.fame = Math.round(((a.fame || 0) - f0 - ((twin.fame || 0) - t0)) * 1e6) / 1e6; out.want = SC.boss.fame;
      const c = testProLeague(33, g.save.data); proBossEnsure(c); out.pro = !!(c.boss && c.boss.id); if (c.boss && c.boss.id) { const old = c.boss.id, p = c.players[old], PT = traitsOf(p); out.proTop = SC.boss.badges.includes(c.boss.trait) && PT.boss === c.boss.trait && trLvOf(p, PT.boss) === trTop(PT.boss); out.proIs = proIsBoss(c, old) && engineDef(c, old).traits.includes(PT.boss);
        for (const k of RATING_KEYS) p.r[k] = 30; /* last season's Boss slips: someone else is the best next season */ c.season++; c.phase = 'regular'; c.week = 0; proBossEnsure(c); out.newSeason = c.boss.season === c.season && !!c.boss.id && c.boss.id !== old && proIsBoss(c, c.boss.id); out.oldClean = !traitsOf(p).boss && !proIsBoss(c, old) && !engineDef(c, old).traits.some(id => SC.boss.badges.includes(id)); }
      return out; });
    console.log('     ' + JSON.stringify(r));
    if (!r.boss || !(r.week >= SC_minWeek()) || !r.top || !r.best || !r.def || !r.once || !r.hub || !r.card || !r.optsBoss) throw new Error('amateur Boss: ' + JSON.stringify(r));
    if (!r.bossWon || Math.abs(r.fame - r.want) > 1e-6) throw new Error('beating the Boss: ' + r.bossWon + ' fame +' + r.fame + ' over the same win against a plain opponent (want +' + r.want + ')');
    if (!r.pro || !r.proTop || !r.proIs || !r.newSeason || !r.oldClean) throw new Error('pro Boss: ' + JSON.stringify(r));
    return 'week ' + (r.week + 1) + ', ' + r.badge + ' at its top level · beating them: fame +' + r.fame + ' · a new pro Boss next season';
    function SC_minWeek() { return 2; }
  });

  await step('phones (§3): bigger buttons (the smallest in-game button 80 px across); the layout editor moves a button and the match uses it; auto-sprint off brings a SPRINT button and a full push no longer sprints; vibrations on steals, blocks and dunks (and none with the setting off)', async () => {
    const P = await openPage(b, { phone: true }); try {
      const r = await P.ev(() => {
        const g = HH.game, S = g.save.data.settings, out = {}; g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'timed', half: 60, periods: 1, ot: 30 }, court: 'legends', seed: 3, controlMode: 'lock' }, { kind: 'quick' }); g.fitTouch();
        const tc = g.input.touch, L = tc.layout; out.minR = Math.min(...L.buttons.filter(x => x.key !== 'super').map(x => x.r)); out.stickR = L.stick.r;
        S.touchLayout = { jump: [0.5, 0.55] }; g.applySettings(); g.fitTouch(); const jb = tc.layout.buttons.find(x => x.key === 'jump'); out.moved = [Math.round(jb.x), Math.round(g.W * 0.5), Math.round(jb.y), Math.round(g.H * 0.55)];
        S.touchLayout = null; S.autoSprint = false; g.applySettings(); g.fitTouch(); out.sprintBtn = !!tc.layout.buttons.find(x => x.key === 'sprint'); tc.stickId = 1; tc.stickDX = tc.layout.stick.r; tc.stickDY = 0; tc.recompute(); out.fullPush = tc.sprint; S.autoSprint = true; g.applySettings(); g.fitTouch(); tc.stickId = 1; tc.stickDX = tc.layout.stick.r; tc.recompute(); out.autoPush = tc.sprint; tc.clearAll();
        const calls = []; const keep = navigator.vibrate; navigator.vibrate = p => { calls.push(JSON.stringify(p)); return true; }; g.input.lastDevice = 'touch'; const m = g.match, p = m.teams[0].players[0], d = m.teams[1].players[0];
        try { m.bus.emit('STEAL', { player: d, victim: p }); m.bus.emit('BLOCK', { player: d, shooter: p, caught: false }); m.bus.emit('SCORE', { team: 0, player: p, points: 2, shot: { type: 'dunk', flavor: 'dunk', poster: false }, buzzer: false, clutch: false, hoop: p.hoop, reason: 'shot', dunk: true, three: false }); out.vib = calls.slice(); calls.length = 0; S.vibrate = false; m.bus.emit('STEAL', { player: d, victim: p }); out.vibOff = calls.slice(); S.vibrate = true; } finally { navigator.vibrate = keep; }
        const ed = touchLayoutScreen(g); out.editor = ed.name === 'touchlayout'; g.quitToMenu(); return out; });
      console.log('     ' + JSON.stringify(r));
      if (!(r.minR >= CONFIG_touch() / 2 - 1e-6)) throw new Error('the smallest button r ' + r.minR);
      if (Math.abs(r.moved[0] - r.moved[1]) > 2 || Math.abs(r.moved[2] - r.moved[3]) > 2) throw new Error('the layout editor\'s place is not used: ' + r.moved);
      if (!r.sprintBtn || r.fullPush || !r.autoPush) throw new Error('auto-sprint: ' + JSON.stringify([r.sprintBtn, r.fullPush, r.autoPush]));
      if (r.vib.length !== 3 || r.vib[0] !== '35' || r.vib[1] !== '50' || r.vib[2] !== '[30,40,60]' || r.vibOff.length) throw new Error('vibrations ' + JSON.stringify(r.vib) + ' off ' + JSON.stringify(r.vibOff));
      if (!r.editor) throw new Error('no editor');
      function CONFIG_touch() { return 80; }
    } finally { await P.context.close(); }
  });

  const fe = await D.frameErrors(); if (fe.length) R.fail++, console.log('FAIL recovered frame exceptions: ' + fe.slice(0, 3).join(' | '));
  if (D.errors.length) { R.fail++; console.log('FAIL page errors: ' + D.errors.slice(0, 3).join(' | ')); }
  await b.close(); process.exit(R.done() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
