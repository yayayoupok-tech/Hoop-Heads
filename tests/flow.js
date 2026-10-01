// V5 (Hoop Heads 2.0 §4.1, §4.2, §4.6–4.8, §5): the career flow. Pace in one-minute career games, the sims at the new
// pace, fatigue, press conferences after big games only, the depth chart's challenges, spot starts and playing time,
// Road to the League, Sim to next big moment / Sim the rest of the season, Quick results, the five-tab hub with its
// calendar and red dots, and the league's name (the PBL). Usage: node tests/flow.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('flow'); const D = await openPage(browser, { road: true }); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  const newAm = (seed, style) => ev(([seed, style]) => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Flow Test', look: PRESET_LOOKS[seed % 16], number: 4, style: style || 'slasher', seed, seasonLength: 11, gameLength: 120 }); g.save.data.c1 = a; a.events.length = 0; hsAutoResolve(a); a.events.length = 0; return true; }, [seed, style]);

  await step('pace (§4.7): career games score 12–20 a side in one minute at the gate\'s efficiency; Quick Play keeps its rules', () => ev(() => {
    const games = 60, pts = [], poss = []; let sc = 0;
    for (let i = 0; i < games; i++) { const R_ = fullRoster('legends'); const A = teamWithRoster(teamDef('legends')), B = teamWithRoster(teamDef('legends')); A.players = [R_[i % R_.length]]; B.players = [R_[(i * 7 + 3) % R_.length]]; B.abbr += '2';
      const m = new Match({ mode: '1v1', teams: [A, B], difficulty: 'pro', ruleset: 'arcade', format: careerFormat(), seed: 7000 + i, humanTeam: -1, headless: true, dev: true, controlMode: 'lock', adaptive: false, layout: 'legends', pace: true });
      if (i === 0) { m.bus.on('INBOUND', () => { sc = Math.max(sc, m.shotClock); }); } let n = 0; while (!m.ended && n < 120 * 60 * 10) { simStep(m, STEP); n++; }
      if (m.invariantCount) throw new Error('invariants: ' + Object.values(m.invariantFails).join('; ')); pts.push(m.teams[0].score, m.teams[1].score); poss.push(m.teams[0].possessions, m.teams[1].possessions); }
    const avg = a => a.reduce((s, v) => s + v, 0) / a.length, ppS = avg(pts), ppp = avg(pts) / avg(poss);
    if (!(ppS >= 12 && ppS <= 20)) throw new Error('points a side ' + ppS.toFixed(1) + ' (12–20)'); if (!(ppp >= 0.95 && ppp <= 1.25)) throw new Error('PPP ' + ppp.toFixed(3) + ' (0.95–1.25)');
    if (sc !== CONFIG.pace.shotClock) throw new Error('the career shot clock is ' + sc);
    // the clocks wait while the ball is brought up after an inbound; the game clock waits while a shot is in the air
    const R_ = fullRoster('legends'); const A = teamWithRoster(teamDef('legends')), B = teamWithRoster(teamDef('legends')); A.players = [R_[0]]; B.players = [R_[1]];
    const m = new Match({ mode: '1v1', teams: [A, B], difficulty: 'pro', ruleset: 'arcade', format: careerFormat(), seed: 5, humanTeam: -1, headless: true, dev: true, controlMode: 'lock', adaptive: false, layout: 'legends', pace: true });
    let heldSteps = 0, heldMoved = 0, n = 0; while (!m.ended && n < 120 * 30) { const g0 = m.gameClock, s0 = m.shotClock, held = m.phase === 'live' && m.clockHold; simStep(m, STEP); n++; if (held && m.clockHold) { heldSteps++; if (m.gameClock !== g0 || m.shotClock !== s0) heldMoved++; } }
    if (!heldSteps) throw new Error('the clocks never waited'); if (heldMoved) throw new Error('a held clock moved ' + heldMoved + ' times');
    const q = new Match({ mode: '1v1', teams: [A, B], difficulty: 'pro', ruleset: 'arcade', format: careerFormat(), seed: 5, humanTeam: -1, headless: true, dev: true, layout: 'legends' }); if (q.pace || shotClockLen(q) !== CONFIG.rules.shotClock) throw new Error('Quick Play should keep its shot clock');
    for (const o of [amMatchOpts, careerMatchOpts]) if (!/pace: true/.test(String(o))) throw new Error(o.name + ' should set pace');
    return ppS.toFixed(1) + ' a side, PPP ' + ppp.toFixed(3);
  }));
  await step('the sims at the new pace: an amateur winner scores CR.simWinPts; pro box scores scale with gameScale (×CR.paceMul)', () => ev(() => {
    const rng = new RNG(9); let w = 0, l = 0; const N = 2000; for (let i = 0; i < N; i++) { const s = amSimScore(rng, 60, 60); w += Math.max(s[0], s[1]); l += Math.min(s[0], s[1]); }
    const wa = w / N, la = l / N; if (Math.abs(wa - CR.simWinPts) > 1.5) throw new Error('winner ' + wa.toFixed(2) + ' vs ' + CR.simWinPts); if (!(la > 7 && la < 12)) throw new Error('loser ' + la.toFixed(2));
    if (Math.abs(gameScale('pro') - careerSecs() * CR.paceMul / CR.simRefSecs.pro) > 1e-9) throw new Error('gameScale');
    const c = testProLeague(17); const r2 = careerRng(c); let p = 0, k = 0; for (let i = 0; i < 300; i++) { const ids = c.active; const a = ids[i % ids.length], b = ids[(i * 5 + 1) % ids.length]; if (a === b) continue; const r = simBox(c, a, b, r2); p += r.hs + r.as; k += 2; }
    const pa = p / k; if (!(pa >= 9 && pa <= 22)) throw new Error('pro sim points a side ' + pa.toFixed(1)); return 'amateur ' + wa.toFixed(1) + '/' + la.toFixed(1) + ' · pro ' + pa.toFixed(1);
  }));
  await step('fatigue (§4.2): it builds half as fast; over 70 the week defaults to Rest; a standing Rest ends once you\'re fresh', () => ev(() => {
    if (WK.fatiguePerGame !== 5 || WK.fatigueOt !== 1.5 || WK.intensity.hard.fatigue !== 3) throw new Error('builders not halved');
    const B = { fatigue: 75, wk: {}, plan: 'practice' }; if (autoPlan(B) !== 'rest') throw new Error('over 70: rest');
    B.fatigue = 60; if (autoPlan(B) !== 'practice') throw new Error('60: the standing plan'); B.plan = 'rest'; B.fatigue = 40; if (autoPlan(B) !== 'practice') throw new Error('a standing rest when fresh should end'); B.fatigue = 55; if (autoPlan(B) !== 'rest') throw new Error('a standing rest while tired holds');
  }));
  await step('press (§4.2): only after big games: the rival, the playoffs, a big night, an upset; never a routine win', () => ev(() => {
    const B = { pressGap: 0 }; const base = { won: true, rival: false, playoff: false, final: false, champ: false, eliminated: false, recs: [], first: true, upsetWin: false, upsetLoss: false, big: false };
    if (pressFor(B, base)) throw new Error('a routine game (even a debut) should get no press');
    if (!pressFor({ pressGap: 5 }, Object.assign({}, base, { rival: true }))) throw new Error('a rival game always gets one');
    if (!pressFor({ pressGap: 0 }, Object.assign({}, base, { playoff: true }))) throw new Error('a playoff game gets one');
    if (pressFor({ pressGap: 2 }, Object.assign({}, base, { big: true }))) throw new Error('big nights respect the gap');
    if (!pressFor({ pressGap: 0 }, Object.assign({}, base, { upsetWin: true }))) throw new Error('an upset gets one');
    // a simmed high school season: presses come after a minority of games
    let games = 0, press = 0; for (const seed of [77, 78, 79]) { const save = defaultSave(); const a = amCreate(save, { name: 'Press Count', look: PRESET_LOOKS[2], number: 5, style: 'shooter', seed }); let guard = 0;
      while (guard++ < 400 && a.stage === 'hs') { for (const e of a.events) if (e.kind === 'press') press++; a.events.length = 0; if (a.decision || a.stage !== 'hs') break; if (a.summer && a.summer.pending) { hsSummerChoose(a, 'rest'); continue; } if (a.tryout && a.tryout.step !== 'done') { hsSimTryout(a); continue; } const r = amSimGame(a); if (!r) break; if (!r.bench) games++; } }
    if (games < 20 || press / games > 0.45) throw new Error('presses ' + press + ' in ' + games + ' games'); return press + ' presses in ' + games + ' games (V4: about one in two)';
  }));
  await step('the depth chart (§4.2, §4.6): no teammate challenges in weeks 1–3, three weeks apart, only within 3 OVR; benched, you challenge the starter', () => ev(() => {
    const save = defaultSave(); const c = amCreate(save, { name: 'Ladder V5', look: PRESET_LOOKS[6], number: 9, style: 'lockdown', seed: 1234 }); hsTryoutDrill(c, 30); hsTryoutGame(c, true, 7, 0); ladderInit(c, 1); c.events.length = 0;
    const rng = { next: () => 0 }; const L = c.league, T = c.team; const mates = T.mates.slice().sort((a, b) => tmMateOvr(b) - tmMateOvr(a)); const below = ladderBelowId(c), m = ladderMate(c, below); const myO = myChallengeOvr(c);
    const setOvr = v => { const d = v - tmMateOvr(m); for (const k of RATING_KEYS) m.r[k] = clamp(m.r[k] + d, 1, 99); };
    setOvr(myO - 1); L.games = [{}, {}]; T.pending = null; T.lastChal = null; ladderMaybeChallenge(c, rng); if (T.pending) throw new Error('a challenge in week 2');
    L.games = [{}, {}, {}, {}]; ladderMaybeChallenge(c, rng); if (T.pending !== below) throw new Error('week 4: the challenge should come (p forced)'); T.pending = null; c.events.length = 0;
    L.games.push({}); ladderMaybeChallenge(c, rng); if (T.pending) throw new Error('one week later: too soon'); L.games.push({}, {}); ladderMaybeChallenge(c, rng); if (T.pending !== below) throw new Error('three weeks later it can come again'); T.pending = null; T.lastChal = null; c.events.length = 0;
    setOvr(myO - 6); L.games.push({}, {}, {}); ladderMaybeChallenge(c, rng); if (T.pending) throw new Error('6 OVR under you: no challenge');
    // benched: the starter is the target; a win takes the start, the rest move down
    ladderInit(c, 4); const st = ladderOf(c)[0], second = ladderOf(c)[1]; if (ladderChallengeId(c) !== st) throw new Error('the target should be the starter'); const r = ladderResolve(c, st, true, 'you'); if (!r || r.rankAfter !== 1 || ladderOf(c)[1] !== st || ladderOf(c)[2] !== second) throw new Error('a win takes the start: ' + ladderOf(c).slice(0, 4).join(','));
  }));
  await step('playing time (§4.6): three bench weeks earn a spot start; A or B moves you up a rung; a pro may ask for a trade after 4 bench weeks', () => ev(() => {
    const save = defaultSave(); const c = amCreate(save, { name: 'Spot Start', look: PRESET_LOOKS[3], number: 2, style: 'shooter', seed: 4321 }); hsTryoutDrill(c, 30); hsTryoutGame(c, true, 7, 0); c.events.length = 0; ladderInit(c, 3); c.fatigue = 0;
    let bench = 0, spotPlayed = null; for (let i = 0; i < 6 && !spotPlayed; i++) { c.team.pending = null; const r = amSimGame(c); c.events.length = 0; if (!r) break; if (r.bench) bench++; else spotPlayed = r; }
    if (!spotPlayed) throw new Error('no spot start after ' + bench + ' bench weeks'); if (bench !== TM.spotAfter) throw new Error('the spot start came after ' + bench + ' bench weeks'); if (!spotPlayed.spot || !spotPlayed.spot.grade) throw new Error('the spot start should be graded');
    if (benchStreakOf(c) !== 0) throw new Error('the streak resets after a game you play');
    const up = spotStartDone, c2 = amCreate(defaultSave(), { name: 'Spot Up', look: PRESET_LOOKS[4], number: 3, style: 'slasher', seed: 99 }); hsTryoutDrill(c2, 30); hsTryoutGame(c2, true, 7, 0); ladderInit(c2, 3); const before = ladderRank(c2); const res = up(c2, true, 'A'); if (!res.up || ladderRank(c2) !== before - 1) throw new Error('an A moves you up a rung'); const res2 = up(c2, true, 'C'); if (res2.up) throw new Error('a C does not');
    const p = testProLeague(23); p.phase = 'regular'; p.me.tradeSeason = p.season; p.week = 1; if (proTradeOpen(p)) throw new Error('inside the gap with no bench weeks: closed'); const R_ = benchRunOf(p); R_.weeks = TM.tradeBenchWeeks; p.me.tradeSeason = p.season - 1; if (!proTradeOpen(p)) throw new Error('after ' + TM.tradeBenchWeeks + ' bench weeks a trade request opens');
  }));
  await step('Road to the League (§4.1): eleven milestones from varsity to the Hall of Fame; rewards (cash, a trait level, gear) and a card each; the goal is a 5★ team; old saves mark what they did quietly', () => ev(() => {
    if (ROAD.list.length !== 11 || !roadDef('team5').goal) throw new Error('the list');
    const save = defaultSave(); const c = amCreate(save, { name: 'Road Runner', look: PRESET_LOOKS[5], number: 8, style: 'slasher', seed: 2024 }); c.events.length = 0; if (!c.road || !c.road.init) throw new Error('a new career starts its road');
    c.cash = 0; hsTryoutDrill(c, 60); hsTryoutGame(c, true, 9, 0); roadCheck(c); if (!c.road.done.varsity) throw new Error('varsity after a varsity tryout: ' + c.squad); const card = c.events.find(e => e.kind === 'road' && e.id === 'varsity'); if (!card || !(c.cash >= ROAD.list[0].cash)) throw new Error('the varsity card and its cash');
    // a trait level: top100 levels the signature trait
    const T = traitsOf(c); const sig = T.sig; const L0 = trLvOf(c, sig); c.recruit = { nat: 80, stars: 4 }; c.events.length = 0; roadCheck(c); if (!c.road.done.top100) throw new Error('top 100'); if (TR.list[sig].r !== 'L' && L0 < trTop(sig) && trLvOf(c, sig) !== L0 + 1) throw new Error('the trait level reward'); if (!c.events.some(e => e.kind === 'road' && e.id === 'top100')) throw new Error('its card');
    // gear: a college offer gives free court shoes
    const g0 = gearLevel(c, 'shoes'); c.offers = [{ name: 'Test U', tier: 1 }]; roadCheck(c); if (gearLevel(c, 'shoes') !== g0 + 1) throw new Error('free shoes');
    // the stage passes: what's left at high school is missed
    const c2 = amCreate(defaultSave(), { name: 'Late Start', look: PRESET_LOOKS[7], number: 1, style: 'shooter', seed: 7 }); c2.road = null; c2.stage = 'college'; c2.squad = 'jv'; c2.offers = []; c2.recruit = { nat: 900, stars: 2 }; c2.events.length = 0; roadCheck(c2); if (c2.events.length) throw new Error('an old save marks quietly'); if (!c2.road.missed.top100 || !c2.road.done.offer) throw new Error('missed/done for an old save: ' + JSON.stringify(c2.road));
    // pro: stars, the banner, the screen
    const p = testProLeague(31); p.me.road = null; const hit = roadCheck(p); if (!hit.includes('prooffer')) throw new Error('a pro has a pro offer'); const B = roadBanner(p); if (!B.next || B.total !== 11 || !/value/.test(B.line + (B.next.id === 'rotation' ? ' value' : ''))) throw new Error('banner ' + JSON.stringify(B));
    return Object.keys(c.road.done).join(',');
  }));
  await step('Sim to next big moment (§4.2/§4.8): it stops before a rival, Boss or playoff game and after a story beat, a level-up or a milestone; Sim the rest of the season stops for injuries, offers and the playoffs', () => ev(() => {
    const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Sim Ahead', look: PRESET_LOOKS[1], number: 3, style: 'slasher', seed: 99 }); g.save.data.c1 = a; a.events.length = 0;
    const fix = c => { for (let k = 0; k < 30 && c.events.length; k++) { const e = c.events.shift(); if (e.kind === 'traitpick') trPickAuto(c); else if (e.kind === 'dialog') stAutoChoose(c, e); else if (e.kind === 'nil') colNilAnswer(c, e, true); else if (e.kind === 'agent') colAgentAnswer(c, e, true); } if (c.decision) { const d = c.decision; if (d.kind === 'portal') colPortalChoose(c, null); else if (d.kind === 'college') amChooseCollege(c, d.offers[0]); else amDeclare(c, false); } if (c.summer && c.summer.pending) hsSummerChoose(c, 'rest'); if (c.tryout && c.tryout.step !== 'done') hsSimTryout(c); };
    const stops = {}; let weeks = 0, runs = 0;
    for (let i = 0; i < 30; i++) { fix(a); const before = simNext(a); const S = simAhead(g, 'big'); runs++; weeks += S.weeks; stops[S.stop] = (stops[S.stop] || 0) + 1;
      if (/^next: /.test(S.stop) && !simNext(a).big) throw new Error('stopped for "' + S.stop + '" but the next game is not big');
      if (S.weeks > 1 && a.events.length && simEventClass(a.events[0], 'big') !== 'stop') throw new Error('a routine card left at the front'); if (S.weeks === 0 && !a.events.length && before.kind === 'game') throw new Error('a run that did nothing'); }
    if (!stops['next: a game against your rival'] && !stops['next: the Boss'] && !stops['next: a playoff game']) throw new Error('no big-game stop in 30 runs: ' + JSON.stringify(stops));
    const S2 = (() => { fix(a); let s = null; for (let i = 0; i < 6; i++) { fix(a); s = simAhead(g, 'season'); if (s.weeks > 1) break; } return s; })(); if (!/playoffs|season|injury|offer|decision|commitment|tryouts|summer|trait|combine|run/.test(S2.stop)) throw new Error('a season run stopped for ' + S2.stop);
    return runs + ' runs, ' + weeks + ' weeks: ' + JSON.stringify(stops);
  }));
  await step('Sim ahead in the pros and the offseason (one press to the next contract or season)', () => ev(() => {
    const g = HH.game; const c = testProLeague(21, g.save.data); g.save.data.career = c; g.save.data.c1 = null; c.events = []; let guard = 0;
    while (c.phase !== 'offseason' && guard++ < 60) { const S = simAhead(g, 'season'); for (const e of c.events.splice(0)) { if (e.kind === 'traitpick') trPickAuto(c.me); else if (e.kind === 'allstar') finishAllStar(c, 12); } if (S.stop === 'a sim error') throw new Error('sim error'); }
    if (c.phase !== 'offseason') throw new Error('never reached the offseason'); c.events = []; g.ui.clearTo(offseasonScreen(g)); const b = g.ui.screen.widgets.find(w => w.label === 'Sim to next big moment'); if (!b) throw new Error('no sim button in the offseason'); b.onPress();
    const sn = g.ui.screen && g.ui.screen.name; if (!(c.phase === 'regular' || (sn === 'offseason' && c.offseason && c.offseason.step === 3))) throw new Error('the offseason sim stopped at ' + sn + ' step ' + (c.offseason && c.offseason.step)); return sn + ' · season ' + c.season;
  }));
  await step('Quick results (§4.2): a routine simmed game is a toast on the hub; a big one still gets the screen', async () => {
    await newAm(55); const r = await ev(() => { const g = HH.game, a = g.save.data.c1; g.save.data.settings.quickResults = true; g.hubTab = 'play'; g.ui.clearTo(amHub(g)); let tries = 0;
      { const Sg = sagaOf(a); for (const id in SAGA_ARCS) Sg.arcs[id] = { st: 'skip' }; } /* V9: a routine week means no cards at all (the story's, the press's, an exam's): this step quiets them, so the seed always has one */ while (tries++ < 12) { const nx = amNext(a); if (!nx || !nx.opp) return 'no game'; a.events.length = 0; stFill(a).beats = SY.beatsMax; a.pressGap = 9; if (a.league) a.league.exMid = a.league.exFin = true; g.ui.clearTo(amHub(g)); const big = simNext(a).big; const sim = g.ui.screen.widgets.find(w => /^SIM( THE GAME)?$/.test(w.label || '')); if (!sim) return 'no SIM'; sim.onPress(); const sn = g.ui.screen.name; if (!big && sn === 'amhub' && g.ui.toast) return 'toast: ' + g.ui.toast; }
      return 'never a toast'; }); if (!/^toast: [WL] /.test(r)) throw new Error(r); await ev(() => { HH.game.save.data.settings.quickResults = false; }); return r;
  });
  await step('the hub (§5): five tabs (Play · Train · Me · Team · Shop), keys 1–5, a rail on desktop, every tab draws; red dots; the calendar', async () => {
    await newAm(77); const r = await ev(() => { const g = HH.game, a = g.save.data.c1; a.cash = 300; for (let i = 0; i < 3; i++) { amSimGame(a); a.events.length = 0; } roadCheck(a); a.events.length = 0; g.hubTab = 'play'; g.ui.clearTo(amHub(g)); const s = g.ui.screen; if (s.name !== 'amhub') throw new Error('screen ' + s.name);
      const tabs = s.widgets.filter(w => w.hubTab).map(w => w.label); if (tabs.join(',') !== 'Tab: Play,Tab: Train,Tab: Me,Tab: Team,Tab: Shop') throw new Error('tabs ' + tabs);
      const seen = {}; for (const id of HUB_TAB_IDS) { g.hubTab = id; s.build(); seen[id] = s.widgets.filter(w => !w.hubTab).map(w => w.label).join('|'); }
      if (!/^Road to the League\|PLAY\|SIM\|Sim to next big moment\|Sim the rest of the season/.test(seen.play)) throw new Error('play: ' + seen.play); if (!/PRACTICE.*REST.*FILM.*Focus.*Depth chart/.test(seen.train)) throw new Error('train: ' + seen.train); if (!/Stats.*News.*Trophies.*Timeline.*Codex/.test(seen.me)) throw new Error('me: ' + seen.me); if (!/Team.*Standings.*Recruiting/.test(seen.team)) throw new Error('team: ' + seen.team); if (!/Court shoes.*Recovery kit/.test(seen.shop)) throw new Error('shop: ' + seen.shop);
      const bd = hubBadges(g, a); if (!bd.shop) throw new Error('$300 buys a Basic piece: the Shop dot'); a.cash = 0; if (hubBadges(g, a).shop) throw new Error('no money, no dot');
      const cal = amCalendar(a); if (!cal || cal.tiles.length !== a.league.schedule.length + 1 || cal.tiles.filter(t => t.result).length !== 3 || !cal.tiles.some(t => t.current)) throw new Error('calendar ' + JSON.stringify(cal && cal.tiles.map(t => t.wk + (t.result || ''))));
      { const S = g.save.data.settings, keep = S.tipsSeen; S.tipsSeen = {}; const t0 = tipFor(g, s); S.tipsSeen = { 'hs-week': 1 }; const t1 = tipFor(g, s); S.tipsSeen = keep; if (t0 !== 'hs-week' || t1 !== 'hub') throw new Error('tips ' + t0 + ' ' + t1); if (Object.values(TIPS).some(([h, ls]) => ls.some(l => /undefined|NaN/.test(l)))) throw new Error('a tip has undefined text'); } // first-time tips: the hub tip for a save that saw the old week tip
      g.hubTab = 'play'; s.build(); return Object.keys(seen).length; });
    for (let i = 1; i <= 5; i++) { await D.page.keyboard.press('Digit' + i); await D.page.waitForTimeout(120); const t = await ev(() => HH.game.ui.screen.tab); if (t !== ['play', 'train', 'me', 'team', 'shop'][i - 1]) throw new Error('key ' + i + ' → ' + t); await D.page.waitForTimeout(150); }
    await D.press(/^Standings$/); if ((await D.screen()) !== 'amstandings') throw new Error('Standings from the Team tab'); await ev(() => HH.game.ui.pop());
    const pro = await ev(() => { const g = HH.game; const c = testProLeague(21, g.save.data); g.save.data.career = c; g.save.data.c1 = null; c.events = []; simAhead(g, 'big'); c.events = []; g.hubTab = 'team'; g.ui.clearTo(careerHub(g)); const s = g.ui.screen; const labels = s.widgets.map(w => w.label).join('|'); if (!/Team\|League\|Office/.test(labels)) throw new Error('pro team tab: ' + labels); const cal = proCalendar(c); if (!cal || cal.tiles.length !== c.schedule.length + 1) throw new Error('pro calendar'); g.hubTab = 'play'; s.build(); return cal.tiles.filter(t => t.result).length; });
    if (await ev(() => (window.HH_ERRORS || []).length)) throw new Error('frame errors: ' + JSON.stringify(await D.frameErrors()));
    return 'pro calendar results ' + pro;
  });
  await step('the league is the Pro Basketball League (PBL): no "ISO League" or "NBA" in the game; old saves\' text is renamed', async () => {
    const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8'); const code = src.replace(/function pblRename[^\n]*\n/, '').replace(/\/\/ [^\n]*\n/g, '\n');
    if (/\bNBA\b/.test(src)) throw new Error('"NBA" in the source'); if (/ISO League|ISO LEAGUE|All-ISO|'ISO'|'HHL'/.test(code.replace(/count\('All-ISO First Team'\)|a\.name === 'All-ISO First Team'|\/ISO League\/g|\/ISO LEAGUE\/g|\/All-ISO\/g/g, ''))) throw new Error('an old league name is left');
    const r = await ev(() => { const old = { version: CONFIG.save.version, settings: {}, career: Object.assign(testProLeague(41), {}), c1: null }; old.career.news = [{ t: 'Sam Ray wins the ISO League championship!' }]; old.career.me.awards = [{ s: 1, name: 'All-ISO First Team' }]; old.career.timeline = [{ kind: 'title', text: 'ISO League champion · Late Bus Legends' }]; pblMigrate(old); return [old.career.news[0].t, old.career.me.awards[0].name, old.career.timeline[0].text]; });
    if (r[0] !== 'Sam Ray wins the PBL championship!' || r[1] !== 'All-PBL First Team' || !/^PBL champion/.test(r[2])) throw new Error(JSON.stringify(r));
  });
  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
