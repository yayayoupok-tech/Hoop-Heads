// V5 (Hoop Heads 2.0 §4.1, §4.2, §4.6–4.8, §5): the career flow. Pace in one-minute career games, the sims at the new
// pace, fatigue, fame from performance (3.0: no press room), the depth chart (3.0: it follows form) and playing time,
// Road to the League, Sim to next big moment / Sim the rest of the season, Quick results, the five-tab hub with its
// calendar and red dots, and the league's name (the PBL). Usage: node tests/flow.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('flow'); const D = await openPage(browser, { road: true }); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  const newAm = (seed, style) => ev(([seed, style]) => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Flow Test', look: PRESET_LOOKS[seed % 16], number: 4, style: style || 'slasher', seed, seasonLength: 11, gameLength: 120 }); g.save.data.c1 = a; a.events.length = 0; hsAutoResolve(a); a.events.length = 0; return true; }, [seed, style]);

  await step('pace (§4.7, 2.1 §1.8, 3.0 §0.2): career games score 10–18 a side in a one-minute running-clock game at the gate\'s efficiency (tests/pace.js: 12–18 in real careers); the shot clock waits while the ball is brought up, the game clock only in the last 10 s; Quick Play keeps its rules', () => ev(() => {
    const games = 60, pts = [], poss = []; let sc = 0;
    for (let i = 0; i < games; i++) { const R_ = fullRoster('legends'); const A = teamWithRoster(teamDef('legends')), B = teamWithRoster(teamDef('legends')); A.players = [R_[i % R_.length]]; B.players = [R_[(i * 7 + 3) % R_.length]]; B.abbr += '2';
      const m = new Match({ mode: '1v1', teams: [A, B], difficulty: 'pro', ruleset: 'arcade', format: careerFormat(), seed: 7000 + i, humanTeam: -1, headless: true, dev: true, controlMode: 'lock', adaptive: false, layout: 'legends', pace: true });
      if (i === 0) { m.bus.on('INBOUND', () => { sc = Math.max(sc, m.shotClock); }); } let n = 0; while (!m.ended && n < 120 * 60 * 10) { simStep(m, STEP); n++; }
      if (m.invariantCount) throw new Error('invariants: ' + Object.values(m.invariantFails).join('; ')); pts.push(m.teams[0].score, m.teams[1].score); poss.push(m.teams[0].possessions, m.teams[1].possessions); }
    const avg = a => a.reduce((s, v) => s + v, 0) / a.length, ppS = avg(pts), ppp = avg(pts) / avg(poss);
    if (!(ppS >= 10 && ppS <= 18)) throw new Error('points a side ' + ppS.toFixed(1) + ' (10–18)'); if (!(ppp >= 0.95 && ppp <= 1.5)) throw new Error('PPP ' + ppp.toFixed(3) + ' (0.95–1.5)'); /* 3.0: the half-court restart and the career's make bonus (2.1: 6–10 a side, PPP 0.95–1.25) */
    if (sc !== CONFIG.pace.shotClock) throw new Error('the career shot clock is ' + sc);
    // the shot clock waits while the ball is brought up after an inbound; the game clock runs through it (2.1: the running
    // clock) until the last rules.runningStopS seconds, and waits there
    const R_ = fullRoster('legends'); const A = teamWithRoster(teamDef('legends')), B = teamWithRoster(teamDef('legends')); A.players = [R_[0]]; B.players = [R_[1]];
    const m = new Match({ mode: '1v1', teams: [A, B], difficulty: 'pro', ruleset: 'arcade', format: careerFormat(), seed: 5, humanTeam: -1, headless: true, dev: true, controlMode: 'lock', adaptive: false, layout: 'legends', pace: true });
    let heldSteps = 0, shotMoved = 0, early = 0, earlyStill = 0, late = 0, lateMoved = 0, n = 0; while (!m.ended && n < 120 * 100) { const g0 = m.gameClock, s0 = m.shotClock, ot = m.overtime, held = m.phase === 'live' && m.clockHold; simStep(m, STEP); n++; if (held && m.clockHold && m.phase === 'live' && m.overtime === ot) { heldSteps++; if (m.shotClock !== s0) shotMoved++; if (g0 > CONFIG.rules.runningStopS && !ot) { early++; if (m.gameClock === g0) earlyStill++; } else { late++; if (m.gameClock !== g0) lateMoved++; } } }
    if (!heldSteps || !early) throw new Error('the clocks never waited'); if (shotMoved) throw new Error('a held shot clock moved ' + shotMoved + ' times'); if (earlyStill) throw new Error('the game clock stopped for a hold ' + earlyStill + ' times before the last ' + CONFIG.rules.runningStopS + ' s'); if (lateMoved) throw new Error('a held game clock moved ' + lateMoved + ' times in the last ' + CONFIG.rules.runningStopS + ' s');
    const q = new Match({ mode: '1v1', teams: [A, B], difficulty: 'pro', ruleset: 'arcade', format: careerFormat(), seed: 5, humanTeam: -1, headless: true, dev: true, layout: 'legends' }); if (q.pace || shotClockLen(q) !== CONFIG.rules.shotClock) throw new Error('Quick Play should keep its shot clock');
    for (const o of [amMatchOpts, careerMatchOpts]) if (!/pace: true/.test(String(o))) throw new Error(o.name + ' should set pace');
    return ppS.toFixed(1) + ' a side, PPP ' + ppp.toFixed(3) + '; holds ' + early + ' steps early (the game clock ran), ' + late + ' late (it waited)';
  }));
  await step('the sims at the new pace: an amateur winner scores CR.simWinPts; pro box scores scale with gameScale (×CR.paceMul)', () => ev(() => {
    const rng = new RNG(9); let w = 0, l = 0; const N = 2000; for (let i = 0; i < N; i++) { const s = amSimScore(rng, 60, 60); w += Math.max(s[0], s[1]); l += Math.min(s[0], s[1]); }
    const wa = w / N, la = l / N; if (Math.abs(wa - CR.simWinPts) > 1.5) throw new Error('winner ' + wa.toFixed(2) + ' vs ' + CR.simWinPts); if (!(la > 0.45 * CR.simWinPts && la < 0.8 * CR.simWinPts)) throw new Error('loser ' + la.toFixed(2)); /* 3.0: about two thirds of the winner's (2.1: 4–7.5 at the running clock's scale; 7–12 before) */
    if (Math.abs(gameScale('pro') - careerSecs() * CR.paceMul / CR.simRefSecs.pro) > 1e-9) throw new Error('gameScale');
    const c = testProLeague(17); const r2 = careerRng(c); let p = 0, k = 0; for (let i = 0; i < 300; i++) { const ids = c.active; const a = ids[i % ids.length], b = ids[(i * 5 + 1) % ids.length]; if (a === b) continue; const r = simBox(c, a, b, r2); p += r.hs + r.as; k += 2; }
    const pa = p / k; if (!(pa >= 9 && pa <= 20)) throw new Error('pro sim points a side ' + pa.toFixed(1)); /* 3.0 (§0.2): 12–18 a side at the new pace (2.1's running clock: 5–13; 9–22 before) */ return 'amateur ' + wa.toFixed(1) + '/' + la.toFixed(1) + ' · pro ' + pa.toFixed(1);
  }));
  await step('fatigue (§4.2; 3.0 §3): it builds half as fast; over 70 the week rests on its own, and the standing plan comes back under it; a standing Rest stays until you change it', () => ev(() => {
    if (WK.fatiguePerGame !== 5 || WK.fatigueOt !== 1.5) throw new Error('builders not halved');
    const B = { fatigue: 75, wk: {}, plan: 'focus' }; if (wkPlanNow(B) !== 'rest' || !wkAutoRest(B)) throw new Error('over 70: rest');
    B.fatigue = 60; if (wkPlanNow(B) !== 'focus') throw new Error('60: the standing plan'); B.plan = 'rest'; B.fatigue = 10; if (wkPlanNow(B) !== 'rest') throw new Error('a standing Rest stays until you change it'); B.plan = 'auto'; if (wkPlanNow(B) !== 'auto') throw new Error('Auto');
  }));
  await step('no press room (3.0 §1): fame comes from performance; a simmed high school season asks no questions and queues no story or rival cards', () => ev(() => {
    if (typeof pressFor === 'function' || typeof pressAnswer === 'function') throw new Error('the press room is still here');
    let games = 0, bad = 0; for (const seed of [77, 78, 79]) { const save = defaultSave(); const a = amCreate(save, { name: 'Quiet Count', look: PRESET_LOOKS[2], number: 5, style: 'shooter', seed }); let guard = 0;
      while (guard++ < 400 && a.stage === 'hs') { for (const e of a.events) if (e.kind === 'press' || e.kind === 'rival' || e.ch || e.saga || e.arc) bad++; a.events.length = 0; if (a.decision || a.stage !== 'hs') break; if (a.summer && a.summer.pending) { hsSummerChoose(a, 'rest'); continue; } if (a.tryout && a.tryout.step !== 'done') { hsSimTryout(a); continue; } const r = amSimGame(a); if (!r) break; if (!r.bench) games++; } }
    if (games < 20 || bad) throw new Error(bad + ' press, rival or story cards in ' + games + ' games'); return games + ' games, no press';
  }));
  await step('the depth chart (3.0 §4.3): it follows form, the last 3 games\' points; the best on the bench ahead of the starter 3 weeks running takes the spot (and the starter goes to the league below)', () => ev(() => {
    const save = defaultSave(); const c = amCreate(save, { name: 'Depth X5', look: PRESET_LOOKS[6], number: 9, style: 'lockdown', seed: 1234 }); hsTryoutDrill(c, 30); hsTryoutGame(c, true, 7, 0); ladderInit(c, 1); c.events.length = 0;
    const T = c.team, L = ladderOf(c), m = L[2]; T.form = {}; T.hot = {}; T.trust = 50; const wk = (mine, theirs) => { llForm(c, 'me', mine); llForm(c, m, theirs); for (const id of L) if (id !== 'me' && id !== m) llForm(c, id, 4); return llDepthWeek(c); };
    if (wk(12, 30) || wk(12, 30)) throw new Error('a swap inside 3 weeks'); if (!isStarter(c)) throw new Error('benched early'); const r = wk(12, 30); if (!r || r.up !== m || r.down !== 'me' || isStarter(c) || ladderOf(c)[0] !== m) throw new Error('3 weeks behind: the spot goes: ' + ladderOf(c).join(','));
    if (!(c.events || []).some(e => e.kind === 'depth' && e.title === 'BENCHED')) throw new Error('no BENCHED news'); const nx = amNext(c); if (!nx || !nx.ll) throw new Error('benched: next is the JV game');
  }));
  await step('playing time (3.0 §4.3): not starting, you play the league below every regular-season week; a pro may ask for a trade after 4 weeks without starting', () => ev(() => {
    const save = defaultSave(); const c = amCreate(save, { name: 'JV Weeks', look: PRESET_LOOKS[3], number: 2, style: 'shooter', seed: 4321 }); hsTryoutDrill(c, 30); hsTryoutGame(c, true, 7, 0); c.events.length = 0; ladderInit(c, 3); hsSquadSync(c); c.fatigue = 0;
    let ll = 0, other = 0; for (let i = 0; i < 4; i++) { if (isStarter(c)) { ladderInit(c, 3); hsSquadSync(c); } c.team.hot = {}; const r = amSimGame(c); c.events.length = 0; if (!r) break; if (r.ll) ll++; else other++; } if (ll !== 4) throw new Error('JV weeks ' + ll + ', others ' + other);
    if (benchWeeksOf(c) < 4) throw new Error('the weeks you didn\'t start count: ' + benchWeeksOf(c));
    const p = testProLeague(23); p.phase = 'regular'; p.me.tradeSeason = p.season; p.week = 1; if (proTradeOpen(p)) throw new Error('inside the gap with no bench weeks: closed'); const R_ = benchRunOf(p); R_.weeks = TM.tradeBenchWeeks; p.me.tradeSeason = p.season - 1; if (!proTradeOpen(p)) throw new Error('after ' + TM.tradeBenchWeeks + ' bench weeks a trade request opens');
  }));
  await step('Road to the League (§4.1): fourteen milestones from varsity to the Hall of Fame (V12, Part 2 §6: a franchise player, a ring, Finals MVP, a jersey retired); rewards (cash, a badge level, a free gear level) and a card each; the goal is a 5★ team; old saves mark what they did quietly', () => ev(() => {
    if (ROAD.list.length !== 14 || !roadDef('team5').goal) throw new Error('the list: ' + ROAD.list.length);
    const save = defaultSave(); const c = amCreate(save, { name: 'Road Runner', look: PRESET_LOOKS[5], number: 8, style: 'slasher', seed: 2024 }); c.events.length = 0; if (!c.road || !c.road.init) throw new Error('a new career starts its road');
    c.cash = 0; hsTryoutDrill(c, 60); hsTryoutGame(c, true, 9, 0); ladderInit(c, 1); hsSquadSync(c); roadCheck(c); if (!c.road.done.varsity) throw new Error('varsity: the starting spot (3.0) ' + c.squad); const card = c.events.find(e => e.kind === 'road' && e.id === 'varsity'); if (!card || !(c.cash >= ROAD.list[0].cash)) throw new Error('the varsity card and its cash');
    // a badge level (3.0): top100 levels the badge nearest its next level (here, unlocks it)
    const n0 = badgeNextUp(c, 1)[0]; c.recruit = { nat: 80, stars: 4 }; c.events.length = 0; roadCheck(c); if (!c.road.done.top100) throw new Error('top 100'); if (!n0 || trLvOf(c, n0.id) !== n0.level) throw new Error('the badge level reward: ' + JSON.stringify(n0) + ' → Lv' + (n0 && trLvOf(c, n0.id))); if (!c.events.some(e => e.kind === 'road' && e.id === 'top100')) throw new Error('its card');
    // gear: a college offer gives a free level of court shoes (3.0: Lv1 when they're new; worn)
    { const s0 = gearOf(c).owned.courtShoes || 0; c.offers = [{ name: 'Test U', tier: 1 }]; roadCheck(c); const G = gearOf(c); if (G.owned.courtShoes !== s0 + 1 || G.eq.shoes !== 'courtShoes') throw new Error('the court shoes ' + JSON.stringify(G)); }
    // the stage passes: what's left at high school is missed
    const c2 = amCreate(defaultSave(), { name: 'Late Start', look: PRESET_LOOKS[7], number: 1, style: 'shooter', seed: 7 }); c2.road = null; c2.stage = 'college'; c2.squad = 'jv'; c2.offers = []; c2.recruit = { nat: 900, stars: 2 }; c2.events.length = 0; roadCheck(c2); if (c2.events.length) throw new Error('an old save marks quietly'); if (!c2.road.missed.top100 || !c2.road.done.offer) throw new Error('missed/done for an old save: ' + JSON.stringify(c2.road));
    // pro: stars, the banner, the screen
    const p = testProLeague(31); p.me.road = null; const hit = roadCheck(p); if (!hit.includes('prooffer')) throw new Error('a pro has a pro offer'); const B = roadBanner(p); if (!B.next || B.total !== ROAD.list.length || !/value/.test(B.line + (B.next.id === 'rotation' ? ' value' : ''))) throw new Error('banner ' + JSON.stringify(B));
    return Object.keys(c.road.done).join(',');
  }));
  await step('Sim to next event (§4.2/§4.8; 3.0 §2.2): it stops before a Boss or playoff game, a spot start or the TV game; Sim to end of season stops for injuries, urgent messages and moments, and the playoffs (news and badges go to the headlines)', () => ev(() => {
    const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Sim Ahead', look: PRESET_LOOKS[1], number: 3, style: 'slasher', seed: 99 }); g.save.data.c1 = a; a.events.length = 0;
    const fix = c => { for (let k = 0; k < 30 && c.events.length; k++) { const e = c.events.shift(); if (e.kind === 'dialog') msgAutoChoose(c, e); else if (e.kind === 'nil') colNilAnswer(c, e, true); else if (e.kind === 'agent') colAgentAnswer(c, e, true); } if (c.decision) { const d = c.decision; if (d.kind === 'portal') colPortalChoose(c, null); else if (d.kind === 'college' && d.signing) recSimSign(c); else if (d.kind === 'college') amChooseCollege(c, d.offers[0]); else amDeclare(c, false); } if (c.summer && c.summer.pending) hsSummerChoose(c, 'rest'); if (c.tryout && c.tryout.step !== 'done') hsSimTryout(c); };
    const stops = {}; let weeks = 0, runs = 0;
    for (let i = 0; i < 30; i++) { fix(a); const before = simNext(a); const S = simAhead(g, 'big'); runs++; weeks += S.weeks; stops[S.stop] = (stops[S.stop] || 0) + 1;
      if (/^next: /.test(S.stop) && !simNext(a).big) throw new Error('stopped for "' + S.stop + '" but the next game is not big');
      if (S.weeks > 1 && a.events.length && simEventClass(a.events[0], 'big') !== 'stop') throw new Error('a routine card left at the front'); if (S.weeks === 0 && !a.events.length && before.kind === 'game') throw new Error('a run that did nothing'); }
    if (!stops['next: the Boss'] && !stops['next: a playoff game'] && !stops['next: a spot start']) throw new Error('no big-game stop in 30 runs: ' + JSON.stringify(stops));
    const S2 = (() => { fix(a); let s = null; for (let i = 0; i < 6; i++) { fix(a); s = simAhead(g, 'season'); if (s.weeks > 1) break; } return s; })(); if (!/playoffs|season|injury|offer|decision|commitment|tryouts|summer|trait|combine|run/.test(S2.stop)) throw new Error('a season run stopped for ' + S2.stop);
    return runs + ' runs, ' + weeks + ' weeks: ' + JSON.stringify(stops);
  }));
  await step('Sim ahead in the pros and the offseason (one press to the next contract or season)', () => ev(() => {
    const g = HH.game; const c = testProLeague(21, g.save.data); g.save.data.career = c; g.save.data.c1 = null; c.events = []; let guard = 0;
    while (c.phase !== 'offseason' && guard++ < 60) { const S = simAhead(g, 'season'); for (const e of c.events.splice(0)) { if (e.kind === 'allstar') finishAllStar(c, 12); } if (S.stop === 'a sim error') throw new Error('sim error'); }
    if (c.phase !== 'offseason') throw new Error('never reached the offseason'); c.events = []; g.ui.clearTo(offseasonScreen(g)); const b = g.ui.screen.widgets.find(w => w.label === 'Sim to next big moment'); if (!b) throw new Error('no sim button in the offseason'); b.onPress();
    const sn = g.ui.screen && g.ui.screen.name; if (!(c.phase === 'regular' || (sn === 'offseason' && c.offseason && c.offseason.step === 3))) throw new Error('the offseason sim stopped at ' + sn + ' step ' + (c.offseason && c.offseason.step)); return sn + ' · season ' + c.season;
  }));
  await step('SIM (3.0 §2.2): a simmed week is a toast, then HOME (2.0\'s Quick results, now always)', async () => {
    await newAm(55); const r = await ev(() => { const g = HH.game, a = g.save.data.c1; g.hubTab = 'home'; g.ui.clearTo(amHub(g)); let tries = 0;
      while (tries++ < 12) { const nx = amNext(a); if (!nx || !nx.opp) return 'no game'; a.events.length = 0; if (a.league) a.league.exMid = a.league.exFin = true; g.ui.clearTo(amHub(g)); const big = simNext(a).big; const sim = g.ui.screen.widgets.find(w => /^SIM( THE GAME)?$/.test(w.label || '')); if (!sim) return 'no SIM'; sim.onPress(); const sn = g.ui.screen.name; if (!big && sn === 'amhub' && g.ui.toast) return 'toast: ' + g.ui.toast; }
      return 'never a toast'; }); if (!/^toast: ([A-Za-z ]+: )?[WL] /.test(r)) throw new Error(r); return r; /* (3.0 §4.3: a game in the league below says so first) */
  });
  await step('the hub (3.0 §2.1): five tabs along the bottom (HOME · LEAGUE · EVENTS · CAREER · STORE), keys 1–5, every tab draws; HOME has PLAY, SIM, the scouting report, the sims ahead and the plan; red dots; the calendar', async () => {
    await newAm(77); const r = await ev(() => { const g = HH.game, a = g.save.data.c1; a.cash = 300; for (let i = 0; i < 3; i++) { amSimGame(a); a.events.length = 0; } roadCheck(a); a.events.length = 0; a.inbox = []; const L = ladderOf(a); if (L && L.indexOf('me') > 0) { L.splice(L.indexOf('me'), 1); L.unshift('me'); } g.hubTab = 'home'; g.ui.clearTo(amHub(g)); const s = g.ui.screen; if (s.name !== 'amhub') throw new Error('screen ' + s.name);
      const tabs = s.widgets.filter(w => w.hubTab).map(w => w.label); if (tabs.join(',') !== 'Tab: Home,Tab: League,Tab: Events,Tab: Career,Tab: Store') throw new Error('tabs ' + tabs);
      if (s.widgets.filter(w => w.hubTab).some(w => w.y < UI_H - 140)) throw new Error('the tabs are not along the bottom');
      const seen = {}; for (const id of s.ids) { g.hubTab = id; s.build(); seen[id] = s.widgets.filter(w => !w.hubTab).map(w => w.label).join('|'); }
      if (!/^PLAY\|SIM\|Scout report\|Sim to next event\|Sim to end of season\|AUTO\|FOCUS\|REST\|STUDY/.test(seen.home) || !/Recruiting/.test(seen.home)) throw new Error('home: ' + seen.home); if (!/^Rankings\|Leaders\|Standings\|Brackets\|Team\|My charts\|Colleges/.test(seen.league)) throw new Error('league: ' + seen.league); /* X4 (§4.2): the charts first */ if (!/Road to the League/.test(seen.events)) throw new Error('events: ' + seen.events); if (!/^Train\|Crew\|Stats\|Badges\|Items\|Trophies\|Timeline\|Records\|News/.test(seen.career)) throw new Error('career: ' + seen.career); /* X8 (§7): the crew */ if (!/^Shop\|Your locker\|Extras/.test(seen.store)) throw new Error('store: ' + seen.store); /* V11: the store's three doors */
      if (hubBadges(g, a).store) throw new Error('3.0: the store is the same every week (no new-stock dot)');
      const cal = amCalendar(a); if (!cal || cal.tiles.length !== a.league.schedule.length + 1 || cal.tiles.filter(t => t.result).length !== 3 || !cal.tiles.some(t => t.current)) throw new Error('calendar ' + JSON.stringify(cal && cal.tiles.map(t => t.wk + (t.result || ''))));
      const D = homeData(a); if (!/^WEEK 4 OF \d+$/.test(D.week) || !D.rec || !(D.teamRank >= 1) || !(D.meRank >= 1) || D.mini.length < 5 || !D.mini.some(m => m.me) || !D.next || !/PLAYOFFS|SEASON/.test(D.next.label)) throw new Error('HOME data ' + JSON.stringify(D).slice(0, 300));
      { const S = g.save.data.settings, keep = S.tipsSeen; S.tipsSeen = {}; const t0 = tipFor(g, s); S.tipsSeen = { 'hs-week': 1 }; const t1 = tipFor(g, s); S.tipsSeen = keep; if (t0 !== 'hs-week' || t1 !== 'hub') throw new Error('tips ' + t0 + ' ' + t1); if (Object.values(TIPS).some(([h, ls]) => ls.some(l => /undefined|NaN/.test(l)))) throw new Error('a tip has undefined text'); } // first-time tips: the hub tip for a save that saw the old week tip
      g.hubTab = 'home'; s.build(); return seasonLineText(D); });
    for (let i = 1; i <= 5; i++) { await D.page.keyboard.press('Digit' + i); await D.page.waitForTimeout(120); const t = await ev(() => HH.game.ui.screen.tab); if (t !== ['home', 'league', 'events', 'career', 'store'][i - 1]) throw new Error('key ' + i + ' → ' + t); await D.page.waitForTimeout(150); }
    await D.press(/^Standings$/); if ((await D.screen()) !== 'standings') throw new Error('Standings from the League tab'); await ev(() => HH.game.ui.pop()); /* X4 (§4.2): the standings chart */
    const pro = await ev(() => { const g = HH.game; const c = testProLeague(21, g.save.data); g.save.data.career = c; g.save.data.c1 = null; c.events = []; simAhead(g, 'big'); c.events = []; c.inbox = []; g.hubTab = 'league'; g.ui.clearTo(careerHub(g)); const s = g.ui.screen; const labels = s.widgets.map(w => w.label).join('|'); if (!/Rankings\|Leaders\|Standings\|Brackets\|Team\|My charts\|League/.test(labels)) throw new Error('pro league tab: ' + labels); g.hubTab = 'career'; s.build(); if (!/Office/.test(s.widgets.map(w => w.label).join('|'))) throw new Error('3.0: the Office is on CAREER'); const cal = proCalendar(c); if (!cal || cal.tiles.length !== c.schedule.length + Math.round(Math.log2(CR.playoffSeeds))) throw new Error('pro calendar: ' + (cal && cal.tiles.length)); /* V12: a tile a playoff round */ g.hubTab = 'home'; s.build(); return cal.tiles.filter(t => t.result).length; });
    if (await ev(() => (window.HH_ERRORS || []).length)) throw new Error('frame errors: ' + JSON.stringify(await D.frameErrors()));
    return r + ' · pro calendar results ' + pro;
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
