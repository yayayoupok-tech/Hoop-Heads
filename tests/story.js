// V7 (Part 2 §2): the saga. Arcs open once a career at most, by act and by chance; beats wait for their conditions and
// the flags earlier choices set; every choice trades one thing for another; meters and flags survive a save and a
// reload and the handoff to the pros; old saves get an empty saga; the arcs' effects (a suspension, a flare-up, the
// mentor's clutch edge) land where they should; a saga card is a cutscene. Usage: node tests/story.js
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

  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
