// 3.0 (§2.2, §11): the weekly loop. A scripted season at each level (high school, college, the pros) through the real
// screens, PLAY and SIM weeks in turn: PLAY is the game (no pregame), its one result screen and HOME; SIM is a toast
// and HOME. Counts the screens between one game and the next (the match itself and toasts aside; a message HOME owes
// you counts). Targets: at most 2 on a PLAY week, at most 1 on a SIM week, ever. Also checks §3's practice: the plan
// sticks, training runs by itself every week, Rest takes over over fatigue 70, ratings rise in +1 steps, the drill
// adds up to +50%, a Focus rating at its ceiling hands over to Auto's pick and says so, and "+1 in about N weeks".
// Usage: node tests/loop.js [weeks per level=12]
const { launch, openPage, runner } = require('./lib');
(async () => {
  const WEEKS = +process.argv[2] || 12; const browser = await launch(); const P = await openPage(browser); const R = runner('loop'); const { ev, page } = P; const wait = ms => page.waitForTimeout(ms);
  const HOME = /^(amhub|career)$/;
  // one press on the current screen toward HOME (the result's CONTINUE, a message's first button, a review's CONTINUE)
  const advance = () => ev(() => { const g = HH.game, s = g.ui.screen; if (!s) return { name: g.mode === 'match' ? 'match' : '(none)' }; if (/^(amhub|career)$/.test(s.name)) return { name: s.name, home: true };
    const W = (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && (w.kind === 'button' || (w.kind === 'custom' && w.onPress))); const w = W.find(x => /^(CONTINUE|Continue|OK)$/.test(x.label || '')) || W.find(x => x.primary) || W[0]; if (!w) return { name: s.name, stuck: true, labels: (s.widgets || []).map(x => x.label) }; w.onPress(); return { name: s.name }; });
  const finish = () => ev(() => { const m = HH.game.match; if (!m) return 0; for (const p of m.players) if (p.controlled) { p.controlled = false; p.input.reset(); } let n = 0; while (!m.ended && n < 120 * 60 * 30) { simStep(m, STEP); n++; } return n; });
  const top = () => ev(() => { const g = HH.game, s = g.ui.screen; return g.mode === 'match' && !(g.match && g.match.ended && s && s.overlay) ? 'match' : s ? s.name : '(none)'; }); // (the result screen is an overlay on the ended match)
  // HOME's state: { kind: 'game' | 'stage' | 'none', play, sim, label }
  const homeState = () => ev(() => { const g = HH.game, s = g.ui.screen; if (!s || !/^(amhub|career)$/.test(s.name)) return { kind: 'away', name: s && s.name }; g.hubTab = 'home'; s.build(); const W = (s.widgets || []).filter(w => !w.hidden && w.enabled !== false); const by = re => W.find(w => re.test(w.label || '')); const play = by(/^PLAY$/), sim = by(/^SIM( THE GAME)?$/), stage = by(/^(CHOOSE YOUR COLLEGE|SIGNING DAY|TURN PRO\?|TRANSFER PORTAL|PRO COMBINE|YOUR SUMMER|TRYOUTS)$/); return { kind: play || sim ? 'game' : stage ? 'stage' : 'none', play: !!play, sim: !!sim, stage: stage && stage.label }; });
  const press = re => ev(src => { const s = HH.game.ui.screen; const w = (s.widgets || []).find(x => !x.hidden && x.enabled !== false && new RegExp(src).test(x.label || '')); if (!w) throw new Error('no ' + src + ' on ' + s.name); w.onPress(); return true; }, re.source);
  // a stage step (tryouts, a summer, a decision): the sims' way, so the season can go on
  const stageStep = () => ev(() => { const g = HH.game, a = g.save.data.c1; if (!a) return 'pro'; if (a.summer && a.summer.pending) hsSummerChoose(a, 'rest'); else if (a.tryout && a.tryout.step !== 'done') hsSimTryout(a); else if (a.decision) { const d = a.decision; if (d.kind === 'portal') colPortalChoose(a, null); else if (d.kind === 'college' && d.signing) recSimSign(a); else if (d.kind === 'college') amChooseCollege(a, d.offers[0]); else amDeclare(a, false); } a.events = (a.events || []).filter(e => evClass(e, a) !== 'moment'); g.ui.clearTo(amHub(g)); return 'stage'; });
  // one week from HOME: returns { mode, screens: [names], ok }
  const week = async (mode) => {
    const h = await homeState(); if (h.kind !== 'game') return null; const useP = mode === 'play' && h.play; await press(useP ? /^PLAY$/ : /^SIM( THE GAME)?$/); await wait(120);
    // 3.0 (§5): a tournament's games are games too: each match ends a gap; a gap after a game you played is a PLAY gap
    const rows = []; let seen = [], played = useP, homeFor = 0;
    for (let i = 0; i < 160; i++) { const t = await top(); if (t === 'match') { const was = seen.length || rows.length; if (was || !useP) { rows.push({ mode: played ? 'play' : 'sim', screens: seen }); seen = []; } played = true; await wait(200); await finish(); await wait(900); continue; }
      if (HOME.test(t)) { homeFor++; if (homeFor >= 3) break; await wait(150); continue; } homeFor = 0; if (t !== 'tourney' && (!seen.includes(t) || seen[seen.length - 1] !== t)) seen.push(t); /* (a tournament's screen is its HOME: PLAY and SIM are there) */ const r = await advance(); if (r.stuck) throw new Error('stuck on ' + r.name + ' ' + JSON.stringify(r.labels)); await wait(150); }
    rows.push({ mode: played ? 'play' : 'sim', screens: seen }); return rows;
  };
  const starter = () => ev(() => { const g = HH.game, c = g.save.data.career || g.save.data.c1; const L = c && ladderOf(c); if (L && L.indexOf('me') > 0) { L.splice(L.indexOf('me'), 1); L.unshift('me'); } if (c && !isPro(c)) c.ineligible = 0; }); // you start: PLAY weeks to count
  const levelRun = async (label, setup, weeks) => {
    await ev(setup); await wait(400); const rows = []; let stages = 0;
    for (let i = 0; rows.length < weeks && i < weeks * 3; i++) { await starter(); const h = await homeState(); if (h.kind === 'stage' || h.kind === 'none') { if (++stages > 12) break; await stageStep(); await wait(200); continue; } if (h.kind !== 'game') { await advance(); await wait(150); continue; } const r = await week(rows.length % 2 ? 'sim' : 'play'); if (r) rows.push(...r); }
    const play = rows.filter(r => r.mode === 'play'), sim = rows.filter(r => r.mode === 'sim'), maxP = Math.max(0, ...play.map(r => r.screens.length)), maxS = Math.max(0, ...sim.map(r => r.screens.length)), kinds = {}; for (const r of rows) for (const s of r.screens) kinds[s] = (kinds[s] || 0) + 1;
    console.log('     ' + label.padEnd(12) + ' weeks ' + rows.length + ' (play ' + play.length + ', sim ' + sim.length + ') · screens on a PLAY week: max ' + maxP + ', mean ' + (play.length ? (play.reduce((a, r) => a + r.screens.length, 0) / play.length).toFixed(2) : '–') + ' · on a SIM week: max ' + maxS + ', mean ' + (sim.length ? (sim.reduce((a, r) => a + r.screens.length, 0) / sim.length).toFixed(2) : '–') + ' · ' + JSON.stringify(kinds));
    return { rows, maxP, maxS, play: play.length, sim: sim.length };
  };
  const T = {};
  await R.step('the weekly loop, high school: at most 2 screens between games on PLAY, 1 on SIM', async () => {
    const r = await levelRun('high school', () => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Loop Tester', look: PRESET_LOOKS[2], number: 5, style: 'shooter', seed: 4242 }); g.save.data.c1 = a; a.events.length = 0; if (a.tryout) hsSimTryout(a); g.hubTab = 'home'; g.ui.clearTo(amHub(g)); }, WEEKS); T.hs = r;
    if (r.play < 3 || r.sim < 3) throw new Error('too few weeks: ' + r.play + ' played, ' + r.sim + ' simmed'); if (r.maxP > 2 || r.maxS > 1) throw new Error('screens between games: PLAY ' + r.maxP + ', SIM ' + r.maxS);
  }, P);
  await R.step('the weekly loop, college', async () => {
    const r = await levelRun('college', () => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Loop Tester', look: PRESET_LOOKS[2], number: 5, style: 'slasher', seed: 777 }); g.save.data.c1 = a; a.events.length = 0; let k = 0; while (a.stage === 'hs' && k++ < 400) { a.events.length = 0; if (a.summer && a.summer.pending) hsSummerChoose(a, 'rest'); else if (a.tryout && a.tryout.step !== 'done') hsSimTryout(a); else if (a.decision) { const d = a.decision; if (d.kind === 'college' && d.signing) recSimSign(a); else if (d.kind === 'college') amChooseCollege(a, d.offers[0]); else amDeclare(a, false); } else amSimGame(a); } a.events = []; a.inbox = []; g.hubTab = 'home'; g.ui.clearTo(amHub(g)); }, WEEKS); T.col = r;
    if (r.play < 3 || r.sim < 3) throw new Error('too few weeks: ' + r.play + ' played, ' + r.sim + ' simmed'); if (r.maxP > 2 || r.maxS > 1) throw new Error('screens between games: PLAY ' + r.maxP + ', SIM ' + r.maxS);
  }, P);
  await R.step('the weekly loop, the pros', async () => {
    const r = await levelRun('the pros', () => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const c = testProLeague(31, g.save.data); g.save.data.career = c; g.save.data.c1 = null; c.events = []; g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); }, WEEKS); T.pro = r;
    if (r.play < 3 || r.sim < 3) throw new Error('too few weeks: ' + r.play + ' played, ' + r.sim + ' simmed'); if (r.maxP > 2 || r.maxS > 1) throw new Error('screens between games: PLAY ' + r.maxP + ', SIM ' + r.maxS);
  }, P);
  await R.step('practice (§3): the plan sticks, training runs by itself, Rest over 70, +1 steps, the drill, the ceiling hands over, "+1 in about N weeks"', () => ev(() => {
    const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Plan Tester', look: PRESET_LOOKS[1], number: 9, style: 'sharpshooter', seed: 99 }); g.save.data.c1 = a; a.events.length = 0; if (a.tryout) hsSimTryout(a); const bad = [];
    if (a.plan !== 'auto') bad.push('a new career\'s plan is ' + a.plan);
    if (CR.xpStep !== 1) bad.push('ratings rise in steps of ' + CR.xpStep);
    // Focus: Handles, and it sticks for three weeks; every week trains without a practice screen
    a.plan = 'focus'; a.focus = 'handles'; const h0 = a.r.han; let trained = 0; for (let i = 0; i < 3; i++) { a.fatigue = 0; const r = amSimGame(a); a.events.length = 0; if (r && r.wk && r.wk.plan === 'practice' && r.wk.k === 'handles') trained++; } if (a.plan !== 'focus' || trained < 3) bad.push('Focus: Handles trained ' + trained + ' of 3 weeks (plan ' + a.plan + ')');
    // +1 steps: one point of XP at a time
    const k = 'def', r0 = a.r[k]; a.xp[k] = 0; spendXp(a.r, a.xp, a.caps, { [k]: xpNeed(a.r[k], (potsOf(a, a.caps) || {})[k]) + 0.01 }, potsOf(a, a.caps)); if (a.r[k] !== r0 + 1) bad.push('one +1 of XP gave ' + (a.r[k] - r0));
    // Rest over 70, on its own; back to the plan under it
    a.fatigue = 75; if (wkPlanNow(a) !== 'rest') bad.push('fatigue 75 runs ' + wkPlanNow(a)); a.fatigue = 60; if (wkPlanNow(a) !== 'focus') bad.push('fatigue 60 runs ' + wkPlanNow(a));
    // the drill: up to +50% of the week's training, once a week
    wkNew(a); a.fatigue = 0; const D = wkDrillDone(a, 'shooting', 999), D2 = wkDrillDone(a, 'shooting', 999); const sx = amSessionXp(a), res = amPractice(a, 'shooting', sx); if (!D || D.bonus !== WK.drill.bonus || D2) bad.push('the drill: ' + JSON.stringify(D) + ' then ' + JSON.stringify(D2)); if (!res || Math.abs(res.xp - Math.round(sx * 1.5)) > 1) bad.push('a great drill paid ' + (res && res.xp) + ' of ' + Math.round(sx * 1.5));
    // the ceiling: Focus at its cap hands over to Auto's pick, with a note
    wkNew(a); a.plan = 'focus'; a.focus = 'shooting'; a.r.sho = a.caps.sho; const note = wkCeilingCheck(a); if (!note || a.focus === 'shooting' || !/ceiling/.test(note)) bad.push('the ceiling: "' + note + '" focus ' + a.focus);
    // "+1 in about N weeks"
    const RR = wkRatingsOf(a), n = wkEta(a, RR, focusRating(a.focus), a.focus, amSessionXp(a)), txt = wkEtaText(n); if (!(n >= 1) || !/\+1/.test(txt)) bad.push('the ETA: ' + n + ' ' + txt); if (wkEta(a, RR, 'sho', null, 0) !== null) bad.push('a capped rating has an ETA');
    // Film weeks are gone; a save's Practice plan keeps its focus
    const old = { plan: 'film', focus: 'defense', fatigue: 0, wk: { done: 'film' } }; wkFill(old); if (old.plan !== 'auto' || old.wk.done !== 'practice') bad.push('a Film save: ' + JSON.stringify(old)); const o2 = { plan: 'practice', focus: 'handles', fatigue: 0 }; wkFill(o2); if (o2.plan !== 'focus' || o2.focus !== 'handles') bad.push('a Practice save: ' + JSON.stringify(o2));
    if (bad.length) throw new Error(bad.join(' · ')); return 'Focus held 3 weeks, +1 steps, Rest over ' + WK.restAt + ', the drill +' + Math.round(WK.drill.bonus * 100) + '% (' + res.xp + ' XP), the ceiling note: "' + note + '", ETA ' + txt;
  }), P);
  await R.step('messages (§2.3): info is a reward and a headline, a decision waits in the inbox, one a week', () => ev(() => {
    const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Inbox Tester', look: PRESET_LOOKS[1], number: 9, style: 'slasher', seed: 5 }); g.save.data.c1 = a; a.events.length = 0; if (a.tryout) hsSimTryout(a); a.events.length = 0; const bad = [];
    a.events.push({ kind: 'traitlevel', trait: 'clutch', level: 1, title: 'NEW BADGE: CLUTCH', lines: ['x'] }, { kind: 'nil', title: 'NIL OFFER', amount: 500, lines: ['A deal'] }, { kind: 'agent', title: 'AN AGENT CALLS', agent: 'Al Pine', lines: ['Hi'] }, { kind: 'story', title: 'CALLED UP', lines: ['You are on varsity.'] });
    const rec = {}; evRoute(a, rec); if ((rec.rewards || []).length !== 2) bad.push('rewards ' + JSON.stringify(rec.rewards)); if (a.events.length) bad.push('left in the queue: ' + a.events.map(e => e.kind)); if ((a.inbox || []).length !== 2) bad.push('inbox ' + (a.inbox || []).length);
    if (!(a.news || []).some(n => /Clutch/.test(n.t))) bad.push('no headline for the badge');
    const m1 = evNextMessage(a), m2 = evNextMessage(a); if (!m1 || m2) bad.push('one a week: ' + (m1 && m1.kind) + ', then ' + (m2 && m2.kind));
    a.league.week++; const m3 = evNextMessage(a); if (!m3) bad.push('nothing the next week');
    a.events.push({ kind: 'tradeoffer', title: 'A TRADE OFFER', lines: ['x'] }); if (evClass(a.events[0], a) !== 'urgent') bad.push('a trade offer isn\'t urgent'); a.events.length = 0;
    if (bad.length) throw new Error(bad.join(' · ')); return 'rewards ' + rec.rewards.map(r => r.text).join(' | ') + ' · inbox: ' + m1.kind + ' this week, ' + m3.kind + ' the next';
  }), P);
  const fe = await P.frameErrors(); if (fe.length) console.log('frame errors: ' + fe.join(' | '));
  const fails = R.done(); await browser.close(); process.exitCode = fails || fe.length ? 1 : 0;
})();
