// V7 (Part 2 §2): the saga. Arcs open once a career at most, by act and by chance; beats wait for their conditions and
// the flags earlier choices set; every choice trades one thing for another; meters and flags survive a save and a
// reload and the handoff to the pros; old saves get an empty saga; the arcs' effects (a suspension, a flare-up, the
// mentor's clutch edge) land where they should; a saga card is a cutscene. V8: the nine arcs after them, every
// epilogue reachable, the Story so far, the ceremonies, the record book and the 60+ templates. (Arcs per career and
// how often each plays: tests/careersim.js.) Usage: node tests/story.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('story'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  const mk = `(seed => { const a = amCreate(defaultSave(), { name: 'Story Test', look: PRESET_LOOKS[seed % 16], number: 3, style: 'slasher', seed, seasonLength: 11, gameLength: 120 }); hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; return a; })`;

  await step('the cast: eight people with meters from −100 to 100; the family starts warm; meters clamp; flags set and read', () => ev(mk => {
    const a = eval(mk)(101), S = sagaOf(a); if (SAGA_CAST.some(r => !S.cast[r])) throw new Error('cast ' + Object.keys(S.cast)); if (S.cast.family.m !== SG.familyStart || S.cast.coach.m !== 0) throw new Error('start meters');
    sagaMeterAdd(a, 'coach', 250); if (sagaMeter(a, 'coach') !== 100) throw new Error('clamp up'); sagaMeterAdd(a, 'coach', -500); if (sagaMeter(a, 'coach') !== -100) throw new Error('clamp down');
    sagaSet(a, 'x', 'y'); if (sagaFlag(a, 'x') !== 'y') throw new Error('flags'); if (!(S.quota >= SG.perCareer[0] && S.quota <= SG.perCareer[1])) throw new Error('quota ' + S.quota);
    for (const r of ['friend', 'mentor', 'journalist']) { const w = sagaWho(a, r); if (!w.name || !w.look) throw new Error('no ' + r); if (sagaWho(a, r).name !== w.name) throw new Error(r + ' changed name'); }
    return 'quota ' + S.quota + ' · mentor ' + sagaWho(a, 'mentor').name + ' · journalist ' + sagaWho(a, 'journalist').name;
  }, mk));

  await step('every arc: 3–6 beats; every choice says what it costs and what it gains; no arc opens twice', () => ev(mk => {
    const ids = Object.keys(SAGA_ARCS); if (ids.length < 5) throw new Error(ids.length + ' arcs'); const bad = [];
    for (const id of ids) { const A = SAGA_ARCS[id]; if (A.beats.length < 3 || A.beats.length > 6) bad.push(id + ' has ' + A.beats.length + ' beats'); }
    // the choices: build each beat's options on a career that fits it, and read their notes
    const a = eval(mk)(202), S = sagaOf(a); S.cast.friend.name = 'Pat Doe'; S.cast.friend.look = PRESET_LOOKS[2]; S.arcs.injury = { st: 'on', b: 0, inj: { name: 'Ankle sprain', games: 3 } }; let n = 0;
    for (const id of ids) for (const b of SAGA_ARCS[id].beats) { if (!b.choice) continue; const list = typeof b.choice === 'function' ? b.choice(a, S, S.arcs[id] || { inj: { name: 'x', games: 3 } }, {}) : b.choice; for (const ch of list || []) { n++; const parts = String(ch.note || '').split('·').map(x => x.trim()).filter(Boolean); if (parts.length < 2 && !/·/.test(ch.note || '')) bad.push(id + '/' + b.id + ' "' + ch.label + '": one-sided note "' + ch.note + '"'); } if ((list || []).filter(ch => ch.def).length !== 1) bad.push(id + '/' + b.id + ': one default'); }
    if (bad.length) throw new Error(bad.slice(0, 4).join(' | '));
    // opening: the same arc never opens again
    const c = eval(mk)(303), T = sagaOf(c); T.quota = 99; const first = []; for (let i = 0; i < 40; i++) { c.seasonStats = { g: 2 + i }; const id = sagaOpen(c, 'game', {}); if (id) first.push(id); } if (new Set(first).size !== first.length) throw new Error('reopened: ' + first);
    return ids.length + ' arcs, ' + n + ' choices';
  }, mk));

  await step('beats wait for their conditions and flags: the coach\'s favor only after asking the coach; the booster comes out only if you kept it', () => ev(mk => {
    const a = eval(mk)(404), S = sagaOf(a); S.arcs.bills = { st: 'on', b: 1, s0: a.season, stage: 'hs', picks: [] }; S.order.push('bills'); S.flags.billsPath = 'job';
    a.seasonStats = { g: 9 }; const before = a.events.length; sagaTick(a, 'game', {}); const told = a.events.slice(before).map(e => e.id); if (told.some(id => /favor/.test(id))) throw new Error('the favor without asking the coach');
    if (!told.some(id => /shifts/.test(id))) throw new Error('the job path should tell its own beat: ' + told);
    const b = eval(mk)(505), T = sagaOf(b); T.arcs.bills = { st: 'on', b: 1, s0: b.season, stage: 'hs', picks: [] }; T.order.push('bills'); T.flags.billsPath = 'coach'; b.seasonStats = { g: 9 }; const b0 = b.events.length; sagaTick(b, 'game', {}); if (!b.events.slice(b0).some(e => /favor/.test(e.id))) throw new Error('the favor should come due');
    return 'job → shifts · coach → favor';
  }, mk));

  await step('a choice lands: meters, flags, cash and practice weeks; the log keeps it; the card says what happened', () => ev(mk => {
    const a = eval(mk)(606), S = sagaOf(a); S.arcs.bills = { st: 'on', b: 0, s0: a.season, stage: 'hs', picks: [] }; S.order.push('bills'); a.seasonStats = { g: 3 }; const cash0 = a.cash || 0;
    const e = sagaTell(a, 'bills', 0, {}); if (!e || !e.saga || !e.bg || !e.who || e.who.cast !== 'family') throw new Error('the card'); stChoose(a, e, 0);
    if ((a.cash || 0) !== cash0 + SG.billsJob) throw new Error('cash ' + a.cash); if (S.flags.billsPath !== 'job') throw new Error('flag'); if (sagaMeter(a, 'family') !== SG.familyStart + SG.m.big) throw new Error('family ' + sagaMeter(a, 'family'));
    if (Math.abs(sagaXpMul(a) - (1 - SG.billsXpCut)) > 1e-9) throw new Error('practice ' + sagaXpMul(a)); for (let i = 0; i < SG.billsWeeks; i++) sagaWeekSpent(a); if (sagaXpMul(a) !== 1) throw new Error('the weeks should run out');
    const L = S.log[S.log.length - 1]; if (!L || L.pick !== 'Take a weekend job') throw new Error('log ' + JSON.stringify(L)); if (!e.outcome || !e.outcome.some(l => /\+\$/.test(l))) throw new Error('outcome ' + e.outcome);
    return e.outcome.join(' · ');
  }, mk));

  await step('flags and meters survive a save and a reload, and the handoff to the pros', () => ev(mk => {
    const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Reload Test', look: PRESET_LOOKS[4], number: 4, style: 'shooter', seed: 707, seasonLength: 11, gameLength: 120 }); g.save.data.c1 = a;
    const S = sagaOf(a); sagaSet(a, 'billsPath', 'coach'); sagaMeterAdd(a, 'coach', 17); S.order.push('bills'); S.arcs.bills = { st: 'on', b: 1, s0: 1, stage: 'hs', picks: [2] }; g.save.save();
    const fresh = new SaveSystem(); const b = fresh.data.c1; if (!b || !b.saga) throw new Error('no saga after reload'); if (b.saga.flags.billsPath !== 'coach' || b.saga.cast.coach.m !== 17 || b.saga.arcs.bills.b !== 1) throw new Error('reloaded ' + JSON.stringify(b.saga.flags));
    a.age = 20; a.height = a.heightFinal; a.stage = 'combine'; a.events = []; const c = createCareerFromAmateur(g.save.data, a); if (!c.me.saga || c.me.saga.flags.billsPath !== 'coach' || sagaMeter(c, 'coach') !== 17) throw new Error('handoff');
    // an old save: no saga at all, and an old pro save
    delete b.saga; sagaOf(b); if (!b.saga.cast.family) throw new Error('old amateur save'); const p = testProLeague(19); delete p.me.saga; repairCareer(p); sagaOf(p); if (!p.me.saga.order) throw new Error('old pro save');
    return 'reloaded and handed off';
  }, mk));

  await step('the arcs\' effects: the booster\'s suspension sits you; a rushed return can flare up and cost Speed; the mentor\'s last lesson is a clutch edge in the last 15 s', () => ev(mk => {
    const a = eval(mk)(808); a.stage = 'college'; a.stageYear = 2; const S = sagaOf(a); S.arcs.booster = { st: 'on', b: 1, s0: 1, stage: 'college', picks: [0] }; S.order.push('booster'); S.flags.booster = 'took';
    let e = null; for (let s = 1; s <= 40 && !e; s++) { a.season = s; a.seasonStats = { g: 1 }; S.arcs.booster.ts = -1; const n0 = a.events.length; sagaTick(a, 'game', {}); e = a.events.slice(n0).find(x => /surfaces/.test(x.id)); } if (!e) throw new Error('it never came out in 40 seasons'); stChoose(a, e, 1); if (!(a.ineligible >= SG.boosterSit + 1)) throw new Error('not suspended: ' + a.ineligible);
    // the flare-up: find a career whose roll flares, rush, then come back
    let hit = null; for (let s = 900; s < 960 && !hit; s++) { const c = eval(mk)(s), T = sagaOf(c); T.arcs.injury = { st: 'on', b: 2, s0: c.season, stage: 'hs', inj: { name: 'Ankle sprain', games: 3 } }; T.order.push('injury'); T.flags.injury = 'rush'; if (sgFlare(c)) hit = c; }
    if (!hit) throw new Error('no flare in 60 careers'); const spd = hit.r.spd; hit.injury = null; hit.seasonStats = { g: 6 }; sagaTick(hit, 'game', {}); if (hit.r.spd !== spd - SG.rushLoss || !hit.injury) throw new Error('the flare: Speed ' + spd + ' → ' + hit.r.spd);
    // the mentor's edge
    const m = eval(mk)(1001); sagaSet(m, 'mentorClutch', 1); const def = amPlayerDef(m); if (def.sagaClutch !== SG.mentorClutch) throw new Error('def ' + def.sagaClutch); if (!(trSimEdge(m, false) >= SG.mentorClutchSim)) throw new Error('sim edge');
    return 'suspended ' + a.ineligible + ' games · Speed ' + spd + ' → ' + hit.r.spd + ' · clutch ×' + (1 + SG.mentorClutch);
  }, mk));

  await step('a saga card is a cutscene: its background, both portraits, the meter; three answers fit (a phone gives them their own page)', async () => {
    const r = await ev(mk => { const g = HH.game, a = eval(mk)(1111); g.save.data.c1 = a; const S = sagaOf(a); S.arcs.bills = { st: 'on', b: 0, s0: a.season, stage: 'hs', picks: [] }; S.order.push('bills'); a.seasonStats = { g: 3 };
      const e = sagaTell(a, 'bills', 0, {}); g.ui.clearTo(amHub(g)); g.ui.push(storyEventScreen(g, a, e, () => {})); const s = g.ui.screen; if (s.name !== 'dialog') throw new Error('screen ' + s.name); s.finish(); for (let i = 0; i < 5; i++) { const nx = s.widgets.find(w => !w.hidden && w.label === '▼'); if (nx) { nx.onPress(); s.finish(); } }
      const shown = s.widgets.filter(w => !w.hidden && w.note).map(w => w.label); if (shown.length !== 3) throw new Error('choices ' + shown); const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'); const texts = []; const ft = ctx.fillText.bind(ctx); ctx.fillText = (t, x, y, w) => { texts.push(String(t)); return ft(t, x, y, w); }; s.draw(ctx, g.ui);
      if (!texts.includes('YOU')) throw new Error('your portrait'); if (!SAGA_BG_KINDS.includes(e.bg)) throw new Error('bg ' + e.bg); return shown.join(' / '); }, mk);
    return r;
  });

  // ---- V8 (Part 2 §2.3–2.4, 2.0 §4.9) ----
  const mkPro = `(seed => { const save = defaultSave(); const c = testProLeague(seed, save); c.events.length = 0; return { save, c }; })`;
  const drawTexts = `(s => { const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'); const texts = []; const ft = ctx.fillText.bind(ctx); ctx.fillText = (t, x, y, w) => { texts.push(String(t)); return ft(t, x, y, w); }; s.draw(ctx, HH.game.ui); return texts; })`;

  await step('V8: fourteen arcs; the Trade Demand tells the UNHAPPY card (quietly: traded); Contract Year (the bag\'s game XP, the raise); Father Time (Speed for Shooting, for good); the Finals Rematch stands in for R9\'s final card', () => ev(([mkPro]) => {
    const ids = Object.keys(SAGA_ARCS); if (ids.length < 14) throw new Error(ids.length + ' arcs');
    const { c } = eval(mkPro)(301), S = sagaOf(c); for (const id of ids) if (id !== 'trade') S.arcs[id] = { st: 'skip' }; const ch0 = SAGA_ARCS.trade.chance; SAGA_ARCS.trade.chance = 1; c.me.benchSeason = PR.tradeMinGames + 1; stFill(c).beats = 0;
    let why; try { why = proTradeCheck(c); } finally { SAGA_ARCS.trade.chance = ch0; }
    if (why !== 'bench') throw new Error('unhappy: ' + why); if (c.events.some(e => e.kind === 'trade')) throw new Error('R7\'s card was told as well'); const e = c.events.find(x => x.saga && x.saga.arc === 'trade'); if (!e || e.choice.length !== 3) throw new Error('the demand');
    const club0 = meOf(c).club; stChoose(c, e, 1); if (meOf(c).club === club0 || S.flags.trade !== 'quiet' || !c.events.some(x => x.title === 'TRADED')) throw new Error('quietly: not traded');
    // Contract Year: the bag
    const { c: k } = eval(mkPro)(302), K = sagaOf(k); K.flags.contract = 'bag'; K.flags.contractSeason = k.season; if (Math.abs(sagaBagMul(k) - (1 + SG.bagXp)) > 1e-9) throw new Error('bag ×' + sagaBagMul(k)); K.flags.contractRaise = { s: k.season, kind: 'bag' }; if (sagaRaise(k) !== SG.bagRaise) throw new Error('raise');
    if (!/contract year ×/.test(xpMulText('B', false, sagaBagMul(k)))) throw new Error('the result screen says it');
    // Father Time: the swap
    const { c: f } = eval(mkPro)(303), me = meOf(f), sp0 = me.r.spd, sh0 = me.r.sho, out = sagaApply(f, { rate: { spd: -SG.agingSwap, sho: SG.agingSwap } }); if (me.r.spd !== sp0 - SG.agingSwap || me.r.sho !== Math.min(CR.ratingMax, sh0 + SG.agingSwap) || !out.some(l => /for good/.test(l))) throw new Error('the swap ' + out);
    // the Finals Rematch: R9's card stands down this season
    const { c: r } = eval(mkPro)(304), Rs = sagaOf(r); Rs.arcs.finals = { st: 'on', b: 0, s0: r.season, stage: 'pro', picks: [] }; if (!sagaFinalsNow(r)) throw new Error('finals now'); Rs.arcs.finals.s0 = r.season - 1; if (sagaFinalsNow(r)) throw new Error('a past season\'s');
    return ids.length + ' arcs · traded to the ' + clubOf(meOf(c).club).name + ' · bag ×' + sagaBagMul(k) + ' · Speed ' + sp0 + ' → ' + me.r.spd;
  }, [mkPro]));

  await step('V8: every epilogue is reachable (six, the first that fits); retiring tells it as a cutscene, the saga keeps it through a save and a reload; Passing the Torch leaves a Legacy Start', () => ev(([mkPro]) => {
    const got = {}, ep = (seed, f, L) => { const { c } = eval(mkPro)(seed); sagaMeterAdd(c, 'family', -60); f(c); return sagaEpilogue(c, Object.assign({}, legacyOf(c), L || {})).id; };
    got.torch = ep(311, c => sagaSet(c, 'torch', 'kid')); got.legend = ep(312, () => {}, { hof: true, titles: 2, seasons: 15 }); got.rivals = ep(313, c => { sagaSet(c, 'rivalPeace', 1); sagaMeterAdd(c, 'rival', SG.respectAt + 5); });
    got.home = ep(314, c => sagaMeterAdd(c, 'family', 120)); got.road = ep(315, c => { const ids = frIds().filter(id => id !== meOf(c).club); c.me.seasonLog = ids.slice(0, SG.roadClubs).map(club => ({ club })); }); got.work = ep(316, () => {});
    const miss = SAGA_EPILOGUES.map(E => E.id).filter(id => got[id] !== id); if (SAGA_EPILOGUES.length < 4 || miss.length) throw new Error('unreached: ' + miss + ' ' + JSON.stringify(got));
    const { save, c } = eval(mkPro)(317); sagaMeterAdd(c, 'family', 60); retireCareer(save); const e = c.events.find(x => x.epilogue); if (!e || e.epilogue !== 'home' || e.bg !== 'kitchen' || !(e.lines || []).length) throw new Error('the cutscene ' + JSON.stringify(e && { id: e.epilogue, bg: e.bg }));
    const back = JSON.parse(JSON.stringify(save)); if (back.career.me.saga.epilogue !== 'home') throw new Error('kept');
    const t = eval(mkPro)(318); sagaSet(t.c, 'torch', 'kid'); retireCareer(t.save); if (!t.save.legacyStart || !t.save.legacyStart.torch || t.save.legacyStart.caps !== SG.torchCaps) throw new Error('the torch\'s Legacy Start');
    return SAGA_EPILOGUES.map(E => E.id).join(', ');
  }, [mkPro]));

  await step('V8: THE STORY SO FAR: the arcs by act, each beat and what you chose, your people and their meters (desktop and phone)', () => ev(([mk, drawTexts]) => {
    const g = HH.game, a = eval(mk)(321); g.save.data.c1 = a; const S = sagaOf(a); S.arcs.bills = { st: 'on', b: 0, s0: a.season, stage: 'hs', picks: [] }; S.order.push('bills'); a.seasonStats = { g: 3 }; stFill(a).beats = 0; const e = sagaTell(a, 'bills', 0, {}); stChoose(a, e, 0);
    const rows = sagaTimelineRows(a); if (!rows.some(r => r.t === 'act' && /ACT I/.test(r.text)) || !rows.some(r => r.t === 'arc' && r.text === 'FAMILY BILLS') || !rows.some(r => r.t === 'beat' && /You chose: Take a weekend job/.test(r.b))) throw new Error('rows ' + JSON.stringify(rows));
    const P = sagaPeople(a); if (!P.some(p => p.cast === 'family')) throw new Error('family');
    g.ui.clearTo(amHub(g)); g.ui.push(storySoFarScreen(g, a)); const t1 = eval(drawTexts)(g.ui.screen); if (!t1.includes('FAMILY BILLS') || !t1.some(t => /^Age \d+ · /.test(t))) throw new Error('drawn ' + t1.slice(0, 12));
    return rows.length + ' rows · ' + P.length + ' people';
  }, [mk, drawTexts]));

  await step('V8: the ceremonies: awards night (a pro season you won something in; a school season with awards), the All-Star reveal before the weekend, the Hall of Fame induction', () => ev(([mk, mkPro, drawTexts]) => {
    const g = HH.game, { save, c } = eval(mkPro)(331); g.save.data = save; for (const id of c.active) c.stats[id].g = 10; c.stats[c.meId].pts = 9999; c.phase = 'playoffs'; c.playoffs = c.playoffs || { series: [] }; endSeason(c); const ce = c.events.find(x => x.kind === 'ceremony'); if (!ce || !ce.rows.some(r => r.mine && /Most Valuable/.test(r.award))) throw new Error('awards night ' + JSON.stringify(ce && ce.rows));
    g.ui.clearTo(mainMenu(g)); g.ui.push(storyEventScreen(g, c, ce, () => {})); if (g.ui.screen.name !== 'ceremony') throw new Error('screen ' + g.ui.screen.name); g.ui.screen.onTap(); const t1 = eval(drawTexts)(g.ui.screen); if (!t1.includes('MOST VALUABLE PLAYER')) throw new Error('drawn ' + t1.slice(0, 8));
    const A = { week: c.week }; c.events.length = 0; c.me.fame = 100; setupAllStar1v1(c, A); const pick = c.events.findIndex(x => x.kind === 'allstarpick'); if (A.invited1 && pick < 0) throw new Error('no reveal'); if (pick >= 0) { g.ui.push(storyEventScreen(g, c, c.events[pick], () => {})); g.ui.screen.onTap(); const t2 = eval(drawTexts)(g.ui.screen); if (!t2.some(x => /^OVR \d+$/.test(x))) throw new Error('reveal drawn ' + t2.slice(0, 8)); }
    const a = eval(mk)(332); a.events.length = 0; a.league.done = false; const n0 = a.events.length; amEndSeason(a, careerRng(a), true); const ai = a.events.findIndex(x => x.kind === 'ceremony'), ri = a.events.findIndex(x => x.kind === 'recap'); if (ai < 0 || ri < 0 || ai > ri) throw new Error('school awards night before the recap ' + ai + ' ' + ri);
    c.legacy = Object.assign(legacyOf(c), { hof: true, titles: 1, mvps: 1, seasons: 12, score: 120 }); c.phase = 'retired'; g.ui.clearTo(hofInductionScreen(g)); const t3 = eval(drawTexts)(g.ui.screen); if (!t3.includes('CAREER HIGHLIGHTS')) throw new Error('induction drawn ' + t3.slice(0, 8));
    return ce.rows.length + ' awards · All-Star ' + (pick >= 0 ? 'revealed' : '(not picked)') + ' · school ' + a.events[ai].rows.length;
  }, [mk, mkPro, drawTexts]));

  await step('V8: the record book: your best game at each level, the level records (a gold toast when one falls, your name in the book), career highs, an old save\'s highs, the handoff', () => ev(([mk, mkPro, drawTexts]) => {
    const a = eval(mk)(341); REC_TOASTS.length = 0; recordsAfterGame(a, { pts: 10, reb: 4, stl: 1, blk: 1, tpm: 1 }, true); if (REC_TOASTS.length) throw new Error('a first game is no toast'); recordsAfterGame(a, { pts: 15, reb: 5, stl: 1, blk: 1, tpm: 1 }, true); if (!REC_TOASTS.some(t => /^CAREER HIGH: 15 points/.test(t))) throw new Error('career high ' + REC_TOASTS);
    const rec = CONFIG.records.levels.hs.pts[0]; REC_TOASTS.length = 0; const out = recordsAfterGame(a, { pts: rec + 1, reb: 1 }, true); if (!out.some(o => o.kind === 'level') || !REC_TOASTS.some(t => /^STATE RECORD/.test(t)) || !recLevelRecord(a, 'hs', 'pts').mine) throw new Error('state record ' + JSON.stringify(out));
    REC_TOASTS.length = 0; recordsAfterGame(a, { pts: rec, reb: 1 }, true); if (REC_TOASTS.some(t => /RECORD/.test(t))) throw new Error('tying your own record is no record');
    const old = JSON.parse(JSON.stringify(a)); delete old.recBook; old.records = { pts: 17, reb: 6 }; const R = recBookOf(old); if (!R.best.hs.pts || R.best.hs.pts.v !== 17) throw new Error('an old save\'s highs');
    const save = defaultSave(); a.stage = 'combine'; a.age = 20; const c = createCareerFromAmateur(save, a); if (!c.me.recBook || !c.me.recBook.broke.hs.pts) throw new Error('the handoff');
    const g = HH.game; g.save.data = save; g.ui.clearTo(mainMenu(g)); g.ui.push(recordsBookScreen(g, c)); const t0 = eval(drawTexts)(g.ui.screen); if (!t0.includes('YOUR BEST GAMES') || !t0.includes('PBL RECORD')) throw new Error('drawn ' + t0.slice(0, 20)); g.ui.screen.widgets.find(w => w.label === '▶').onPress(); const t = eval(drawTexts)(g.ui.screen); if (!t.includes('STATE RECORD') || !t.some(x => /^YOU · season/.test(x))) throw new Error('the state page ' + t.slice(0, 20));
    g.ui.clearTo(careerHub(g)); g.ui.trans = null; g.ui.toastMsg('STATE RECORD: test', 'record'); /* 2.1 (W1, §1.11): a record's toast shows on a hub */ const t2 = (() => { const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'); const xs = []; const ft = ctx.fillText.bind(ctx); ctx.fillText = (s, x, y, w) => { xs.push(String(s)); return ft(s, x, y, w); }; g.ui.drawToast(ctx); return xs; })(); if (!t2.some(x => /NEW RECORD/.test(x))) throw new Error('the gold toast');
    return 'state record ' + rec + ' → ' + (rec + 1) + ' · ' + REC_LEVELS.length + ' levels';
  }, [mk, mkPro, drawTexts]));

  await step('V8 (2.0 §4.9): 60+ story templates; events react to your traits, your rival, your team\'s stars and your hype', () => ev(([mkPro]) => {
    const src = [...document.scripts].map(x => x.text).join('\n'), r9 = new Set((src.match(/stBeat\(c, '([a-z0-9-]+)'/g) || []).map(x => x.slice(11, -1))), traitB = Object.keys(TRAIT_BEATS).length, saga = Object.values(SAGA_ARCS).reduce((n, A) => n + A.beats.length, 0), total = r9.size + traitB + saga + SAGA_EPILOGUES.length;
    if (total < 60) throw new Error(total + ' templates');
    for (const id of ['spotlight', 'trait', 'stars-up', 'stars-down']) if (!r9.has(id)) throw new Error('no ' + id);
    const { c } = eval(mkPro)(351); stTeamStars(c); c.events.length = 0; c.me.starsWas = frMine(c) - 1; stFill(c).beats = 0; stFill(c).w = -99; stTeamStars(c); if (!c.events.some(e => e.id === 'stars-up')) throw new Error('the big stage');
    c.events.length = 0; c.me.starsWas = frMine(c) + 1; stFill(c).fired = {}; stFill(c).w = -99; stTeamStars(c); if (!c.events.some(e => e.id === 'stars-down')) throw new Error('the rebuild');
    return total + ' templates: R9 ' + r9.size + ' · traits ' + traitB + ' · saga ' + saga + ' · epilogues ' + SAGA_EPILOGUES.length;
  }, [mkPro]));

  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
