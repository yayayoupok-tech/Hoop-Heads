// 2.1 §1 (W2): the playtest's improvements, one step each, on the 3.0 build. GPA (§1.5): Study is a plan of its own (3.0:
// one of the four standing plans, Auto / Focus / Rest / Study, run at the game), the hub warns under 2.3, the drift stops
// at a C+ (a player who never studies ends near 2.0-2.5), college AUTO studies too, and academic probation's push is worth
// 0.4+ by the next report card (3.0: the story's study sprint is gone; under 2.3 the coach makes every week a Study week).
// Leaving college (§1.7): the agent's advice and the projected offers before the choice; ready (OVR 70+ or 5-star
// interest) -> "Teams would sign you now" and Turn pro is the default, else Return. Teams come to you (§1.1): free
// agency's default is the move up; an in-season trade offer once you cross a better franchise's bar (3.0: an urgent
// message on HOME, and hype is fame). Money (§1.4): the six big buys. Old saves. (The policy tables: tests/effort.js;
// parity: tests/parity.js.)
// node tests/improve21.js   (ONLY=<regex> runs the matching steps)
const { launch, openPage, runner } = require('./lib');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');

(async () => {
  const b = await launch(); const R = runner('improve21');
  const P = await openPage(b, { wait: 900 }); const { ev, page } = P;
  const mkHs = `(seed => { const a = amCreate(defaultSave(), { name: 'Improve Test', look: PRESET_LOOKS[seed % 16], number: 4, style: 'slasher', seed }); hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; return a; })`;
  const mkCol = `((seed, gpa, lvl) => { const c = amCreate(defaultSave(), { name: 'Improve College', look: PRESET_LOOKS[seed % 16], number: 23, style: 'slasher', seed }); c.events.length = 0; hsSimTryout(c); for (const k of RATING_KEYS) c.r[k] = Math.max(c.r[k], 66); c.age = 18; c.stageYear = 4; c.decision = null; c.gpa = gpa; c.recruit = { score: 60, nat: 100, stars: 3 }; c.events.length = 0; amChooseCollege(c, { name: 'Test State', tier: 2, colors: ['#224', '#EEE'], coach: 'Coach Test', focus: 'shooting', fac: 2 }); c.events.length = 0; if (lvl) for (const k of RATING_KEYS) c.r[k] = lvl; return c; })`;
  const mkPro = `(seed => { const save = defaultSave(), c = testProLeague(seed, save); save.career = c; c.events.length = 0; return { save, c }; })`;
  const B = [mkHs, mkCol, mkPro];
  const texts = `(g => { g.ui.trans = null; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { var X = RBF.boxes || []; RBF.boxes = null; } return X.map(x => x.t).join(' | '); })`;

  // ---------------- GPA (§1.5) ----------------
  await R.step('GPA (§1.5): Study is the fourth plan in high school and college (3.0: Auto / Focus / Rest / Study) and not in the pros; pressing it makes Study the standing plan, and every week then studies at the game (GPA +0.3, fatigue −10) until you change it', () => ev(([mkHs, mkCol, mkPro]) => {
    const g = HH.game, labels = c => { g.save.data.c1 = c; g.save.data.career = null; return planButtons(g, careerKit(g)).map(w => w.label); };
    const h = eval(mkHs)(101), hs = labels(h), col = labels(eval(mkCol)(102, 3.0)); if (hs.join().toLowerCase() !== 'auto,focus,rest,study' || col.join() !== hs.join()) throw new Error('high school ' + hs + ' · college ' + col);
    const { save, c } = eval(mkPro)(103); g.save.data.career = c; g.save.data.c1 = null; const pro = planButtons(g, careerKit(g)).map(w => w.label); if (pro.some(l => /^study$/i.test(l)) || pro.length !== 3) throw new Error('the pros: ' + pro);
    g.save.data.c1 = h; g.save.data.career = null; h.gpa = 2.5; h.fatigue = 30; h.wk = null; h.plan = 'auto'; const st = planButtons(g, careerKit(g)).find(w => w.plan === 'study'); st.onPress(); if (h.plan !== 'study' || h.gpa !== 2.5) throw new Error('pressing Study: plan ' + h.plan + ', GPA ' + h.gpa + ' (the week runs at the game)');
    const wks = []; for (let i = 0; i < 2; i++) { const g0 = h.gpa, f0 = h.fatigue; amStartGame(h); /* the week's plan at tip-off */ if (Math.abs(h.gpa - Math.min(4, g0 + HS.studyGpa)) > 1e-6 || Math.abs(h.fatigue - Math.max(0, f0 - HS.studyRest)) > 1e-6 || (h.wk && h.wk.done) !== 'study' || h.plan !== 'study') throw new Error('Study week ' + (i + 1) + ': GPA ' + g0 + ' → ' + h.gpa + ', fatigue ' + f0 + ' → ' + h.fatigue + ', week ' + JSON.stringify(h.wk && h.wk.done) + ', plan ' + h.plan); wks.push(g0.toFixed(2) + ' → ' + h.gpa.toFixed(2)); wkNew(h); }
    return 'high school and college: ' + hs.join(' / ') + ' · pros: ' + pro.join(' / ') + ' · two Study weeks: GPA ' + wks.join(', ');
  }, B), P);

  await R.step('GPA (§1.5): the hub warns under 2.3 (orange "STUDY", red under 2.0), not at 2.3 or in the pros; the pill is drawn on the hub, desktop and phone', async () => {
    const r = await ev(([mkHs, texts]) => { const g = HH.game, h = eval(mkHs)(111), w = v => { h.gpa = v; return schoolGpaWarn(h); };
      const a = w(2.25), bb = w(1.9), c0 = w(2.3), d = w(3.1); if (!a || !/^GPA 2\.25 · STUDY$/.test(a[0]) || !bb || !/UNDER 2\.0/.test(bb[0]) || c0 || d) throw new Error(JSON.stringify([a, bb, c0, d]));
      if (schoolGpaWarn({ stage: 'pro', gpa: 1.5 })) throw new Error('no warning in the pros');
      h.gpa = 2.1; g.save.data.c1 = h; g.save.data.career = null; g.hubTab = 'play'; g.ui.clearTo(amHub(g)); const t = eval(texts)(g); if (!/GPA 2\.10 · STUDY/.test(t)) throw new Error('the desktop hub has no GPA pill: ' + t.slice(0, 300));
      return a[0] + ' · ' + bb[0]; }, [mkHs, texts]);
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
    const ph = await ev(([texts]) => { const g = HH.game; g.ui.clearTo(amHub(g)); return eval(texts)(g); }, [texts]); await page.setViewportSize({ width: 1280, height: 720 }); await page.waitForTimeout(300);
    if (!/GPA 2\.10 · STUDY/.test(ph)) throw new Error('the phone hub has no GPA pill: ' + ph.slice(0, 300));
    return r + ' · on both hubs';
  }, P);

  await R.step('GPA (§1.5): the drift stops at a C+ (2.2) for a player who never studies; college AUTO makes the week a Study week under 2.3 (it said so, and practiced)', () => ev(([mkHs, mkCol]) => {
    const h = eval(mkHs)(121); h.gpa = 3.4; for (let i = 0; i < 300; i++) schoolGradeWeek(h); if (Math.abs(h.gpa - HS.gpaFloor) > 1e-9) throw new Error('high school drift ends at ' + h.gpa);
    const c = eval(mkCol)(122, 3.6); for (let i = 0; i < 300; i++) schoolGradeWeek(c); if (Math.abs(c.gpa - HS.gpaFloor) > 1e-9) throw new Error('college drift ends at ' + c.gpa);
    c.gpa = 1.9; for (let i = 0; i < 5; i++) schoolGradeWeek(c); if (c.gpa !== 1.9) throw new Error('under the floor the drift waits: ' + c.gpa);
    c.gpa = 2.1; c.wk = null; c.plan = 'practice'; if (autoPlan(c) !== 'study') throw new Error('AUTO in college under 2.3: ' + autoPlan(c)); amStartGame(c); if (!(c.wk && c.wk.done === 'study') || Math.abs(c.gpa - (2.1 + HS.studyGpa)) > 1e-6) throw new Error('college AUTO studied: ' + JSON.stringify(c.wk && c.wk.done) + ' GPA ' + c.gpa);
    return 'drift ends at ' + HS.gpaFloor + ' (from 3.4 and 3.6) · college AUTO: Study, GPA 2.10 → ' + c.gpa.toFixed(2);
  }, B), P);

  await R.step('GPA (§1.5): academic probation\'s push (3.0: the story\'s study sprint is gone; the coach\'s rule instead): a college midterm under 1.5 is probation, every week under 2.3 after it is a Study week on its own (the plan stays Focus), and the GPA is up 0.4+ at the next report card, which lifts the probation', () => ev(([mkHs, mkCol]) => {
    const c = eval(mkCol)(131, 3, 0), L = c.league; c.plan = 'focus'; c.focus = 'shooting';
    const sim = () => { c.events.length = 0; const g0 = c.gpa, r = amSimGame(c); if (!r) throw new Error('no game in week ' + (L.week + 1)); return { g0, plan: r.wk && r.wk.plan }; }; // a week through the real loop: the plan at tip-off, the game, the grades' drift, a report card
    for (let i = 0; i < 12 && L.week < SCH.collegeMidWeek - 1; i++) sim(); if (L.week !== SCH.collegeMidWeek - 1 || L.exMid) throw new Error('the week before the midterm: week ' + L.week);
    c.gpa = 1.1; sim(); /* the midterm week: a Study week on its own (1.10 → 1.40), then the report card */ const card = c.events.find(e => e.title === 'REPORT CARD');
    if (!L.exMid || c.probation !== 1 || !card || !card.lines.some(l => /academic probation/.test(l))) throw new Error('the midterm at GPA ' + c.gpa + ': probation ' + c.probation + ' · ' + JSON.stringify(card && card.lines));
    const g0 = c.gpa, W = []; while (!L.exFin && W.length < 12) W.push(sim()); const g2 = c.gpa, off = W.filter(w => w.g0 < HS.autoStudyAt && w.plan !== 'study');
    if (!L.exFin || off.length || W[0].plan !== 'study' || c.plan !== 'focus') throw new Error('the weeks to the next report card (GPA at tip-off, the week): ' + W.map(w => w.g0 + ' ' + w.plan).join(', ') + ' · plan ' + c.plan);
    if (g2 - g0 < 0.4 - 1e-9 || c.probation !== 0 || c.scholarship === 'lost') throw new Error('GPA ' + g0 + ' → ' + g2 + ' at the next report card · probation ' + c.probation + ' · scholarship ' + c.scholarship);
    return 'GPA ' + g0.toFixed(2) + ' at the midterm (probation) → ' + W.filter(w => w.plan === 'study').length + ' of ' + W.length + ' weeks Study on their own (plan: Focus) → ' + g2.toFixed(2) + ' at the next report card: probation lifted, ' + c.scholarship + ' scholarship kept';
  }, B), P);

  await R.step('GPA (§1.5): careers that never study end high school and college near 2.0-2.5 (the career simulator, --week=nostudy, 24 careers)', () => new Promise((res, rej) => {
    const p = spawn('node', [path.join(__dirname, 'careersim.js'), '24', '21', '0', '--week=nostudy', '--json']); let out = ''; p.stdout.on('data', d => { out += d; }); p.stderr.on('data', d => { out += d; });
    p.on('close', () => { const L = out.split('\n').find(l => l.startsWith('JSON ')); if (!L) return rej(new Error('no JSON: ' + out.slice(-400))); const D = JSON.parse(L.slice(5)).diff, G = D.map(d => d.g).filter(v => v != null).sort((a, b) => a - b), H = D.map(d => d.gl).filter(v => v != null).sort((a, b) => a - b);
      const med = A => A[Math.floor(A.length / 2)], inBand = G.filter(v => v >= 2.0 && v <= 2.5).length / Math.max(1, G.length);
      if (G.length < 20 || med(G) < 2.0 || med(G) > 2.5 || inBand < 0.8) return rej(new Error('GPA at the draft ' + JSON.stringify(G))); if (med(H) < 2.0) return rej(new Error('lowest high school GPA ' + JSON.stringify(H)));
      res('GPA at the draft: median ' + med(G).toFixed(2) + ' (' + G[0].toFixed(2) + '–' + G[G.length - 1].toFixed(2) + ', ' + Math.round(100 * inBand) + '% in 2.0–2.5) · lowest in high school: median ' + med(H).toFixed(2)); }); }), P);

  // ---------------- leaving college (§1.7) ----------------
  await R.step('leaving college (§1.7): ready (OVR 70+) -> "Teams would sign you now", Turn pro is the default (first, gold), and the projected offers show', () => ev(([mkCol, texts]) => {
    const g = HH.game, c = eval(mkCol)(141, 3.0, 78); c.stageYear = 2; c.decision = { kind: 'declare' }; g.save.data.c1 = c; g.save.data.career = null;
    if (!colProReady(c) || !/^Teams would sign you now/.test(colAgentAdvice(c))) throw new Error('OVR ' + amOvr(c) + ' · ready ' + colProReady(c) + ' · ' + colAgentAdvice(c));
    const pv = proEntryPreview(c); if (!pv || !pv.offers || !pv.offers.length || c.proOffers) throw new Error('the projected offers: ' + JSON.stringify(pv && pv.offers) + ' (and the preview leaves none behind)');
    const s = amDecisionScreen(g); g.ui.clearTo(s); const W = s.widgets.filter(w => w.kind === 'button' && !w.hidden); if (W[0].label !== 'Turn pro' || !W[0].primary || W.filter(w => w.primary).length !== 1) throw new Error('buttons: ' + W.map(w => w.label + (w.primary ? '*' : '')).join(', '));
    const t = eval(texts)(g); if (!/Teams would sign you now/.test(t)) throw new Error('the advice is not on the screen'); const shown = pv.offers.slice(0, 3).filter(o => t.includes(clubOf(o.club).name)).length; if (!shown) throw new Error('no projected offer on the screen: ' + t.slice(0, 400));
    return 'OVR ' + amOvr(c) + ', ' + amProStars(c) + '★: ' + W.map(w => w.label + (w.primary ? ' (default)' : '')).join(' · ') + ' · ' + shown + ' projected offer(s) drawn';
  }, [mkCol, texts]), P);

  await R.step('leaving college (§1.7): not ready (under OVR 70, no 5★ interest) -> the agent says stay, Return is the default, Turn pro still there, the offers still shown', () => ev(([mkCol, texts]) => {
    const g = HH.game, c = eval(mkCol)(151, 3.0, 56); c.stageYear = 2; c.decision = { kind: 'declare' }; g.save.data.c1 = c; g.save.data.career = null;
    if (colProReady(c) || /^Teams would sign you now/.test(colAgentAdvice(c))) throw new Error('OVR ' + amOvr(c) + ', ' + amProStars(c) + '★ should not be ready: ' + colAgentAdvice(c));
    const s = amDecisionScreen(g); g.ui.clearTo(s); const W = s.widgets.filter(w => w.kind === 'button' && !w.hidden); if (!/^Return to /.test(W[0].label) || !W[0].primary || !W.some(w => w.label === 'Turn pro' && !w.primary)) throw new Error('buttons: ' + W.map(w => w.label + (w.primary ? '*' : '')).join(', '));
    const pv = proEntryPreview(c), t = eval(texts)(g); if (pv && pv.offers && pv.offers.length && !pv.offers.slice(0, 3).some(o => t.includes(clubOf(o.club).name))) throw new Error('the projected offers are not drawn');
    return 'OVR ' + amOvr(c) + ', ' + amProStars(c) + '★: ' + W.map(w => w.label + (w.primary ? ' (default)' : '')).join(' · ') + ' · "' + colAgentAdvice(c).slice(0, 60) + '…"';
  }, [mkCol, texts]), P);

  // ---------------- teams come to you (§1.1) ----------------
  const setValue = `((c, lo, hi, fame) => { const me = meOf(c); for (let x = 30; x <= 99; x++) { for (const k of RATING_KEYS) me.r[k] = x; c.me.fame = fame || 0; const v = frValue(c); if (v >= lo && v < hi) return v; } throw new Error('no ratings give a value in ' + lo + '-' + hi); })`; // (3.0: hype is fame, and fame counts in the value)
  const onClub = `((c, s) => { const me = meOf(c), T = frTable(c), id = frByStars(T, s).find(x => x !== me.club) || frByStars(T, s)[0]; const mate = c.active.find(x => x !== c.meId && c.players[x].club === id); if (mate) c.players[mate].club = me.club; me.club = id; if (c.me.contract) c.me.contract.club = id; tmSyncPro(c); return id; })`;
  await R.step('teams come to you (§1.1): free agency brings 3 offers with the best franchise your value reaches, and its default (first, gold) is that move up', () => ev(([mkPro, setValue, onClub]) => {
    const g = HH.game, { save, c } = eval(mkPro)(161); g.save.data.career = c; eval(onClub)(c, 2); const v = eval(setValue)(c, FRN.bar[3] + 0.5, FRN.bar[4] - 0.5);
    const O = proFreeAgency(c, careerRng(c), 2e6), stars = O.map(o => o.stars), df = faDefaultIdx(c, O); if (O.length < 3 || Math.max(...stars) !== 4 || O[df].stars !== 4 || O[0].kind !== 'yours') throw new Error('value ' + v.toFixed(1) + ' on a 2★: ' + O.map(o => o.kind + ' ' + o.stars + '★').join(', ') + ' · default ' + df);
    c.offseason = { step: 3, fa: { offers: O }, contractDone: true, prog: true, moves: true }; c.phase = 'offseason'; const s = offseasonScreen(g); const fa = s.widgets.filter(w => w.fa); if (!fa.length || fa[0].fa !== df + 1 || !fa[0].primary || fa.filter(w => w.primary).length !== 1) throw new Error('the buttons: ' + fa.map(w => w.label + (w.primary ? '*' : '')).join(', '));
    const same = O.map(o => Object.assign({}, o, { stars: 2 })); if (faDefaultIdx(c, same) !== 0) throw new Error('no move up: yours stays the default');
    return 'value ' + v.toFixed(1) + ' on a 2★: ' + O.map(o => o.kind + ' ' + o.stars + '★').join(', ') + ' · default: ' + fa[0].label;
  }, [mkPro, setValue, onClub]), P);

  await R.step('teams come to you (§1.1): crossing a better franchise\'s bar (3+ over yours) brings an in-season trade offer, once a season; HOME shows it at once as a message (3.0 §2.3: urgent) with ACCEPT THE TRADE its default; accepting moves you up with no fame lost (3.0: hype is fame)', () => ev(([mkPro, setValue, onClub]) => {
    const g = HH.game, { save, c } = eval(mkPro)(171); g.save.data.career = c; const from = eval(onClub)(c, 2); c.phase = 'regular'; c.week = 1; c.me.offerSeason = null;
    eval(setValue)(c, FRN.bar[1] + FRN.offerBy, FRN.bar[2]); if (proTradeOfferCheck(c)) throw new Error('3 over the 2★ bar but under the 3★ bar: no call yet');
    const v = eval(setValue)(c, FRN.bar[2] + 0.3, FRN.bar[3] - 0.5, 30); const dest = proTradeOfferCheck(c), ev0 = c.events.find(e => e.kind === 'tradeoffer');
    if (!dest || !ev0 || frStars(c, dest) !== 3 || ev0.dest !== dest) throw new Error('value ' + v.toFixed(1) + ': ' + dest + ' · ' + JSON.stringify(ev0 && ev0.title));
    if (proTradeOfferCheck(c)) throw new Error('a second call the same season');
    g.hubTab = 'home'; g.ui.clearTo(careerHub(g)); const hub = g.ui.screen; hub.update(1 / 60, {}); /* HOME's queue: an urgent message shows at once */ const s = g.ui.screen; if (evClass(ev0, c) !== 'urgent' || !s || s.name !== 'message') throw new Error('HOME showed ' + (s && s.name) + ' (the offer is ' + evClass(ev0, c) + ')');
    const W = (s.widgets || []).filter(w => !w.hidden && w.label && w.onPress && w.enabled !== false); if (!/^ACCEPT/.test(W[0].label) || !W[0].primary || W.filter(w => w.primary).length !== 1 || s.focus !== 0) throw new Error('the message: ' + W.map(w => w.label + (w.primary ? '*' : '')).join(', ') + ' · focus ' + s.focus);
    const f0 = c.me.fame, goal = frGoals(c).s3 ? 0 : FRN.goalFame[0]; /* (a first 3★ team is a goal that pays fame) */ W[0].onPress(); if (meOf(c).club !== dest || Math.abs(c.me.fame - Math.min(MD.fameMax, f0 + goal)) > 1e-9 || g.ui.screen !== hub) throw new Error('accepted: club ' + meOf(c).club + ' (want ' + dest + '), fame ' + f0 + ' → ' + c.me.fame + ' (want +' + goal + ', the 3★ goal), back on ' + (g.ui.screen && g.ui.screen.name));
    if (!c.news.some(n => /made the call/.test(n.text || n.t || n))) throw new Error('the news: ' + JSON.stringify(c.news.slice(-2)));
    return 'value ' + v.toFixed(1) + ' on a 2★ (' + clubOf(from).name + ') → the ' + clubOf(dest).name + ' (3★) called · ' + W.map(w => w.label + (w.primary ? ' (default)' : '')).join(' / ') + ' · fame ' + f0 + ' → ' + c.me.fame + (goal ? ' (the 3★ goal +' + goal + ')' : '') + ', none lost';
  }, [mkPro, setValue, onClub]), P);

  await R.step('teams come to you (§1.1): a 5★ franchise calls only with the 5★ condition (a playoff series or an All-League team) and an open spot you\'d win; after the deadline nobody calls', () => ev(([mkPro, setValue, onClub]) => {
    const g = HH.game, { save, c } = eval(mkPro)(181); g.save.data.career = c; eval(onClub)(c, 4); c.phase = 'regular'; c.week = 1; c.me.offerSeason = null; c.me.poWins = {}; c.me.awards = [];
    const v = eval(setValue)(c, FRN.bar[4] + 1, 120); if (FRN.need5 && !frElite(c) && proTradeOfferCheck(c)) throw new Error('a 5★ call without the 5★ condition');
    c.me.poWins = { [c.season]: 1 }; const sp = frSpots5(c), open = Object.keys(sp.open).length, d = proTradeOfferCheck(c); if (d && (frStars(c, d) !== 5 || !sp.open[d])) throw new Error('a 5★ call outside an open spot: ' + d);
    const { c: c2 } = eval(mkPro)(182); eval(onClub)(c2, 2); c2.phase = 'regular'; c2.me.offerSeason = null; eval(setValue)(c2, FRN.bar[2] + 0.5, FRN.bar[3]); c2.week = Math.ceil(c2.schedule.length * PR.tradeDeadline) + 1; if (proTradeOfferCheck(c2)) throw new Error('a call after the deadline');
    return 'value ' + v.toFixed(1) + ' on a 4★: no call without a series or an All-League team; with one: ' + (d ? 'the ' + clubOf(d).name + ' (an open spot)' : 'no open 5★ spot this season (' + open + ' open)') + ' · no call after the deadline';
  }, [mkPro, setValue, onClub]), P);

  // ---------------- money (§1.4) ----------------
  await R.step('money (§1.4): the six big buys: a stake (from season 4: a dividend, a share that grows), a facility (+8% practice XP, upkeep), sneaker shares (move, sell), a family home (confidence), charity (fame; once a season; 3.0: no hype), the arena (fame, legacy); net worth counts the assets', () => ev(([mkHs, mkCol, mkPro]) => {
    const g = HH.game, { save, c } = eval(mkPro)(191); g.save.data.career = c; const M = c.me; M.money = 2e8; c.season = 2; const out = [];
    const [okS, why] = bigCan(c, 'stake'); if (okS || !/season 4/.test(why)) throw new Error('a stake before season 4: ' + why); c.season = 4;
    const nw0 = proNetWorth(c), xp0 = proTrainMul(c, 'shooting'), conf0 = M.confidence || 0, fame0 = M.fame || 0, leg0 = legacyOf(c).score;
    for (const id of BIG_IDS) { const m0 = M.money; if (!bigBuy(c, id)) throw new Error('could not buy ' + id + ': ' + bigCan(c, id)[1]); if (M.money !== m0 - bigCost(c, id) && id !== 'stake') throw new Error(id + ' cost ' + (m0 - M.money)); out.push(id + ' ' + fmtMoney(m0 - M.money)); }
    if (Math.abs(proTrainMul(c, 'shooting') - xp0 - BIG.facility.xp * proXpMul(c) * pblSysXpMul(c, 'shooting')) > 1e-6) /* (2.1: × the coach's system for a fit) */ throw new Error('practice XP × ' + xp0.toFixed(3) + ' → ' + proTrainMul(c, 'shooting').toFixed(3) + ' (+' + BIG.facility.xp + ' × the XP base)');
    if ((M.confidence || 0) < Math.min(MD.confMax, conf0 + BIG.family.conf) - 1e-6) throw new Error('family: confidence ' + conf0 + ' → ' + M.confidence); const cf = M.confidence; M.confidence = 0; bigWeekly(c); if (Math.abs(M.confidence - BIG.family.weeklyConf) > 1e-9) throw new Error('family: a week\'s confidence ' + M.confidence); M.confidence = cf;
    if ((M.fame || 0) < Math.min(100, fame0 + BIG.charity.fame + BIG.arena.fame) - 1e-6) throw new Error('fame ' + fame0 + ' → ' + M.fame); /* 3.0: no hype (fame is the one meter) */
    if (bigCan(c, 'charity')[0]) throw new Error('a second charity event the same season'); if (legacyOf(c).score !== leg0 + BIG.arena.legacy) throw new Error('legacy ' + leg0 + ' → ' + legacyOf(c).score);
    if (!(bigWorth(c) > 0) || Math.abs(proNetWorth(c) - (nw0 - (BIG.stake.costPerStar * frMine(c) + BIG.facility.cost + BIG.sneaker.share + BIG.family.cost + BIG.charity.cost + BIG.arena.cost)) - bigWorth(c)) > 1) throw new Error('net worth ' + nw0 + ' → ' + proNetWorth(c) + ' (assets ' + bigWorth(c) + ')');
    bigBuy(c, 'sneaker'); bigBuy(c, 'sneaker'); if (bigCan(c, 'sneaker')[0] || bigOf(c).sneaker.shares !== BIG.sneaker.max) throw new Error('sneaker shares stop at ' + BIG.sneaker.max);
    const S0 = bigOf(c).stake.value, m1 = M.money, rep = bigSeason(c, new RNG(5)); if (rep.dividend !== Math.round(bigOf(c).stake.cost * BIG.stake.divPct) || M.money !== m1 + rep.dividend - BIG.facility.upkeep || bigOf(c).stake.value <= S0) throw new Error('the season: ' + JSON.stringify(rep) + ' money ' + (M.money - m1));
    if (!(rep.sneaker >= BIG.sneaker.ret[0] && rep.sneaker <= BIG.sneaker.ret[1])) throw new Error('the shares moved ' + rep.sneaker); const sv = bigOf(c).sneaker.value, m2 = M.money; if (bigSellSneaker(c) !== Math.round(sv) || M.money !== m2 + Math.round(sv) || bigOf(c).sneaker) throw new Error('selling the shares');
    for (const id of BIG_IDS) if (typeof bigLine(c, id) !== 'string') throw new Error('bigLine ' + id);
    return out.join(' · ') + ' · dividend ' + fmtMoney(rep.dividend) + ', shares ' + (rep.sneaker >= 0 ? '+' : '') + Math.round(rep.sneaker * 100) + '%';
  }, B), P);

  await R.step('money (§1.4): the Front office\'s Big buys tab lists the six with what each does and buys one; nothing to buy without the money (it says what it costs)', () => ev(([mkPro, texts]) => {
    const g = HH.game, { save, c } = eval(mkPro)(201); g.save.data = save; g.save.data.career = c; c.season = 5; c.me.money = 3e6; g.ui.clearTo(careerHub(g)); g.mgmtTab = { tab: 8 }; const s = managementScreen(g); g.ui.push(s); g.ui.trans = null; const t = eval(texts)(g);
    for (const id of BIG_IDS) if (!t.includes(BIG[id].name)) throw new Error('the tab is missing ' + BIG[id].name + ': ' + t.slice(0, 500));
    const buy = (g.ui.screen.widgets || []).find(w => (w.label || '').startsWith(BIG.charity.name)); if (!buy || buy.enabled === false) throw new Error('no charity button: ' + (g.ui.screen.widgets || []).map(w => w.label).join(', ')); const f0 = c.me.fame || 0; buy.onPress();
    if (!bigOf(c).charity[c.season] || (c.me.fame || 0) <= f0) throw new Error('the charity button did not buy one');
    c.me.money = 1000; const [ok, why] = bigCan(c, 'arena'); if (ok || !/Costs \$40/.test(why)) throw new Error('without the money: ' + why);
    return 'six rows; the charity event bought from the tab (fame ' + f0 + ' → ' + c.me.fame + ') · short of money: "' + why + '"';
  }, [mkPro, texts]), P);

  // ---------------- old saves ----------------
  await R.step('old saves: a 2.0 pro save and an R5 college save load with the 2.1 systems (big buys, trade offers, free agency\'s default, the GPA warning, Study, the declare screen) and every screen draws', async () => {
    const out = [];
    for (const file of ['save_v4_pro.json', 'save_r5_college_midseason.json']) {
      const raw = fs.readFileSync(path.join(__dirname, 'fixtures', file), 'utf8'); await ev(raw => { localStorage.setItem(CONFIG.save.key, raw); }, raw); await page.reload(); await page.waitForTimeout(900); P.errors.length = 0;
      out.push(await ev(([file]) => { const g = HH.game, s = g.save.data, c = s.career, a = s.c1, r = [];
        if (c && c.me) { for (const id of BIG_IDS) { bigCan(c, id); bigLine(c, id); } bigWorth(c); bigXp(c); bigLegacy(c); bigWeekly(c); proTradeOfferCheck(c); faDefaultIdx(c, proFreeAgency(c, careerRng(c), 1e6)); g.ui.clearTo(careerHub(g)); g.mgmtTab = { tab: 8 }; g.ui.push(managementScreen(g)); g.drawUI(g.ctx, g.W, g.H); r.push('pro: big buys ' + JSON.stringify(Object.keys(bigOf(c)))); }
        if (a && !a.handedOff) { schoolGpaWarn(a); g.ui.clearTo(amHub(g)); g.drawUI(g.ctx, g.W, g.H); const K = careerKit(g); if (K) r.push(a.stage + ': plans ' + planButtons(g, K).map(w => w.label).join('/')); if (a.stage === 'college') { const d0 = a.decision; a.decision = { kind: 'declare' }; g.ui.push(amDecisionScreen(g)); g.ui.trans = null; g.drawUI(g.ctx, g.W, g.H); r.push('declare: ' + g.ui.screen.widgets.filter(w => w.primary).map(w => w.label).join()); a.decision = d0; } }
        return file + ' → ' + r.join(' · '); }, [file]));
      if (P.errors.length) throw new Error(file + ': ' + P.errors.slice(0, 3).join(' | '));
    }
    return out.join(' || ');
  }, P);

  const fails = R.done(); await b.close(); process.exit(fails ? 1 : 0);
})();
