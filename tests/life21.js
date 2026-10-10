// 2.1 §3.3–3.6 (W6), on the 3.0 build: the offseason in eight screens (3.0 §5 added the Summer), contracts and the free
// agency week, league life, media and the owners. The steps: Awards Night, aging, retirements (tributes), the free agency
// week (offers by day: accept, counter or wait; over-cap offers; a cheap owner lets you walk; win-now owners chase), the
// trade window (a rebuild may trade you; a no-trade clause makes it your call), the Summer, training camp (two goals that
// pay), the preseason power rankings; contracts (years, options, the no-trade clause, incentives) and the negotiation
// (cap room, advice, risk; 3.0 §7: the agent is on your crew, each level a safer counter); the other fifteen sign, trade,
// cut, extend, age and retire; rookies from the college system with your old teammates; title windows and hunger; the
// GOAT ladder and the records; PBL Tonight, the power rankings and the national TV game; a meddler's beats (3.0 §2.3:
// messages; the press room is gone); the value meter in the hub's header (3.0 §2.1: on HOME and every tab); old saves;
// the screens (desktop and phone: HOME's five tabs, the meddler's three messages).
// node tests/life21.js   (ONLY=<regex> runs the matching steps)
const fs = require('fs'), path = require('path');
const { launch, openPage, runner } = require('./lib');

// Installed on each page: a pro league (you start), a season simmed to a point, the offseason walked step by step, the
// strings one synchronous UI draw shows and its cut or overlapping text, small tap targets.
const LIB = `
window.tPro = (seed, star) => { const g = HH.game, save = g.save.data, c = testProLeague(seed, save); save.career = c; save.c1 = null; c.events.length = 0; if (star) { const me = meOf(c); for (const k of RATING_KEYS) { me.r[k] = Math.max(me.r[k], star); me.caps[k] = Math.max(me.caps[k], star); } } return c; };
window.tSim = (save, until) => { const c = save.career; let n = 0; while (n++ < 90 && !until(c)) { if (c.events) c.events.length = 0; if (c.phase === 'regular' || c.phase === 'playoffs') { if (!simUserGame(save)) { if (c.phase === 'playoffs') simPlayoffsToEnd(c); else break; } continue; } break; } if (c.events) c.events.length = 0; return c; };
window.tStep = (c, k, opt) => { opt = opt || {}; const O = c.offseason; while (O.step < k) { if (O.step === 3) { let gd = 0; while (!O.faDone && gd++ < 10) { if (lgUserFaPending(c) && lgUserFaLive(c).length && (O.day | 0) >= (opt.signDay || 2)) lgUserAccept(c, lgUserFaLive(c)[lgUserFaDefault(c)]); off2Day(c); } } if (O.step === 4 && O.rebuild && O.rebuild.ntc && !O.rebuild.answered) proRebuildAnswer(c, O.rebuild, false); if (O.step === 5) tnSummerAuto(c, true); /* 3.0 (§5): the Summer step */ if (O.step === 6 && !(c.me.camp && c.me.camp.s === c.season + 1)) lgCampPick(c, lgCampSuggest(c).slice(0, LIFE.campGoals).map(x => x.id)); O.step++; off2Enter(c); } if (c.events) c.events.length = 0; return O; };
window.tTexts = g => { g.ui.trans = null; g.ui.toastT = 0; RBF.boxes = []; let X = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { X = RBF.boxes || []; RBF.boxes = null; } return X; };
window.tSaid = g => tTexts(g).map(x => String(x.t)).join(' | ');
window.tFaults = g => { const B = tTexts(g), out = B.filter(x => x.cut).map(x => 'CUT ' + String(x.cut).slice(0, 40)); const T = B.filter(x => String(x.t).trim() && x.a >= 0.35 && x.w >= 1); for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const p = T[i], q = T[j]; if (p.t === q.t) continue; const px = Math.max(p.s, q.s), ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y); if (ix > px && iy > px) out.push('OVERLAP "' + String(p.t).slice(0, 24) + '" x "' + String(q.t).slice(0, 24) + '"'); } return out.concat((window.HH_ERRORS || []).splice(0).map(e => 'ERROR ' + e)); };
window.tSmall = g => { const ui = g.ui, s = ui.screen; return (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && w.kind !== 'text' && (w.w * ui.scale < 63.5 || w.h * ui.scale < 63.5)).map(w => (w.label || w.kind) + ' ' + Math.round(w.w * ui.scale) + '×' + Math.round(w.h * ui.scale)); };
window.ok = (bad, msg) => bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : msg; /* (the steps' verdict, in the page) */
window.tRng = v => ({ next: () => v, int: n => 0, pick: a => a[0], shuffle: a => a, gauss: () => 0 });
// Every W6 screen (3.0: HOME's five tabs, the meddler's beats as messages), drawn once each: [name, faults].
window.tScreens = (g, phone) => { const bad = [], save = g.save.data; const c = tPro(641, 86); const me = meOf(c); c.me.awards.push({ s: 0, name: 'All-League 1st Team' }, { s: 0, name: 'All-League 2nd Team' });
  const look = (name, open) => { g.ui.clearTo(careerHub(g)); open(); const s = g.ui.screen; if (s.update) s.update(0.016, {}); if (g.ui.screen && g.ui.screen.finish) g.ui.screen.finish(); const F = tFaults(g).concat(phone ? tSmall(g).map(x => 'SMALL ' + x) : []); if (F.length) bad.push(name + ': ' + F.slice(0, 3).join(' | ')); };
  tSim(save, c => c.week >= 5); for (const t of HUB_TAB_IDS) { g.hubTab = t; look('hub ' + t, () => {}); } /* 3.0 (§2.1): HOME and its tabs */
  for (const [i, pg] of [[1, 0], [9, 0], [9, 1], [10, 0], [10, 1], [11, 0]]) look('league tab ' + i + '/' + pg, () => { g.leagueTab = { tab: i, player: 0, pow: pg, goat: pg }; g.ui.push(leagueScreen(g)); });
  look('franchise page', () => { g.frTab = { tab: 0 }; g.ui.push(franchiseScreen(g, me.club)); });
  for (const t of ['league', 'team']) { const s0 = statsGuideScreen(g, t); g.ui.clearTo(careerHub(g)); g.ui.push(s0); tTexts(g); /* (measured the way the game draws it: inside the UI's transform) */ const opts = s0.widgets[0].options.map((o, i) => [o, i]).filter(([o]) => o.indexOf(t === 'league' ? 'The PBL' : 'Team & pro value') === 0); for (const [o, i] of opts) look('codex ' + o, () => { g.ui.push(s0); s0.widgets[0].set(i); }); }
  { const club = me.club, st = c.standings[c.meId], K = JSON.stringify([st, c.week, c.me.benchSeason || 0, c.fr[club].coach, c.team.coach, c.team.trust]), back = () => { const k = JSON.parse(K); Object.assign(st, k[0]); c.week = k[1]; c.me.benchSeason = k[2]; c.fr[club].coach = k[3]; c.team.coach = k[4]; c.team.trust = k[5]; c.me.meddle = null; }; c.fr[club].owner = { name: 'Dex Calloway', kind: 'meddler' }; /* 3.0 (§2.3): each beat is a message (the press beat is gone): its conditions, its card, then the career as it was */
    for (const [beat, set] of [['minutes', () => { c.me.benchSeason = 2; }], ['shop', () => { st.w = 1; st.l = 4; }], ['coach', () => { c.week = PBL.deadlineWeek; st.w = 1; st.l = 6; }]]) { c.me.meddle = null; set(); const ev = lgMeddleWeek(c, tRng(0)); c.events.length = 0; if (ev && ev.beat === beat) look('meddler (' + beat + ')', () => g.ui.push(eventScreen(g, c, ev, () => {}))); else bad.push('no meddler beat (' + beat + ': ' + (ev && ev.beat) + ')'); back(); } }
  tSim(save, c => c.phase === 'offseason'); c.me.contract.years = 1;
  look('offseason 0 awards', () => g.ui.push(offseasonScreen(g)));
  for (const k of [1, 2, 3]) { tStep(c, k, { signDay: 9 }); look('offseason ' + k + ' ' + LG_OFF_STEPS[k], () => g.ui.push(offseasonScreen(g))); }
  off2Day(c); c.events.length = 0; look('free agency day 2', () => g.ui.push(offseasonScreen(g)));
  { const L = lgUserFaLive(c); if (L.length) { look('negotiation', () => { g.ui.push(offseasonScreen(g)); g.ui.push(negotiate2Screen(g, L[0].id)); }); } }
  for (const k of [4, 5, 6, 7]) { tStep(c, k); if (k === 6) c.me.camp = null; look('offseason ' + k + ' ' + LG_OFF_STEPS[k], () => g.ui.push(offseasonScreen(g))); }
  if (phone) look('offseason 7, rankings 9–16', () => { g.offPow = { page: 1 }; g.ui.push(offseasonScreen(g)); });
  g.offPow = null; return bad; };
`;

(async () => {
  const b = await launch(); const R = runner('life21');
  const P = await openPage(b, { wait: 900 }); const { ev } = P; await ev(src => { (0, eval)(src); }, LIB);
  const ok = (bad, msg) => bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : msg;

  await R.step('the offseason in eight steps (Awards Night, aging, retirements, the free agency week, the trade window, the summer (3.0 §5), training camp, the preseason power rankings), then a new season with sixteen starters and five on every franchise', () => ev(() => {
    const bad = [], g = HH.game, save = g.save.data, c = tPro(601); tSim(save, c => c.phase === 'offseason'); const O = c.offseason;
    if (!O || O.v !== 2 || O.step !== 0 || !O.awards || LG_OFF_STEPS.length !== 8) bad.push('the offseason ' + JSON.stringify(O && { v: O.v, step: O.step }));
    const ages = {}; for (const id of c.active) ages[id] = c.players[id].age;
    tStep(c, 1); if (!O.prog) bad.push('no aging'); for (const id of c.active) if (ages[id] != null && c.players[id].age !== ages[id] + 1) { bad.push('age ' + c.players[id].name); break; }
    tStep(c, 2); if (!O.ret || !Array.isArray(O.ret.list) || !O.ret.tributes.every(t => t.score >= LIFE.legendScore || t.mvp >= 1 || t.titles >= 2)) bad.push('retirements ' + JSON.stringify(O.ret && O.ret.tributes.map(t => t.score)));
    tStep(c, 3); if (!Array.isArray(O.pool) || !O.ticker.length || !O.fa) bad.push('free agency did not open');
    tStep(c, 4); if (!O.faDone || !Array.isArray(O.trades)) bad.push('the week did not close / no trade window');
    tStep(c, 5); tStep(c, 6); tStep(c, 7); if (!(c.me.camp && c.me.camp.goals.length === LIFE.campGoals)) bad.push('camp goals ' + JSON.stringify(c.me.camp)); if (!c.power || c.power.order.length !== 16) bad.push('power rankings');
    for (const id of frIds()) if (lgCount(c, id) !== 5) bad.push(id + ' has ' + lgCount(c, id));
    newSeason(c); if (c.phase !== 'regular' || c.active.length !== 16 || !pblReady(c)) bad.push('season 2: ' + c.phase + ' ' + c.active.length);
    return ok(bad, O.ret.list.length + ' retired (' + O.ret.tributes.length + ' tributes), ' + O.signed.length + ' signings, ' + O.trades.length + ' trades in the window, camp: ' + c.me.camp.goals.map(x => x.label).join(' + '));
  }), P);

  await R.step('the free agency week: your team on day 1, the others from day 2 (a title shot on day 4); offers last their days and expire; Accept signs the terms (years, options, the incentives); the last day takes the best one left', () => ev(() => {
    const bad = [], g = HH.game, save = g.save.data, seen = [];
    for (const seed of [611, 612, 613, 614]) { const c = tPro(seed, 80); tSim(save, c => c.phase === 'offseason'); c.me.contract.years = 1; tStep(c, 3, { signDay: 99 }); const O = c.offseason, F = O.fa;
      if (!F.free) { bad.push(seed + ' not free'); continue; } const mine = meOf(c).club, offers = F.offers;
      for (const o of offers) { if (!(o.day >= 1 && o.day <= LIFE.faDays && o.exp >= o.day)) bad.push(seed + ' offer days ' + o.day + '–' + o.exp); if (o.club === mine && o.day !== 1) bad.push(seed + ' your team on day ' + o.day); if (o.kind === 'ring' && o.day !== 4 && !o.chase) bad.push('title shot on day ' + o.day); }
      for (const o of lgUserFaLive(c)) if (o.day > Math.max(1, O.day | 0)) bad.push('a live offer from the future');
      if (seed === 611) { let gd = 0; while ((O.day | 0) < LIFE.faDays && gd++ < 8) off2Day(c); const exp = offers.filter(o => o.gone === 'expired'); if (!exp.length || exp.some(o => o.exp >= (O.day | 0))) bad.push('nothing expired by day ' + O.day); off2Day(c); if (!F.done || !c.me.contract || c.me.contract.s0 !== c.season + 1) bad.push('the last day did not sign'); seen.push('expired ' + exp.length + ', last day: the ' + frNick(c.me.contract.club)); continue; }
      const L = lgUserFaLive(c); if (!L.length) { bad.push(seed + ' no live offer'); continue; } const o = L[L.length - 1], K = lgUserAccept(c, o);
      if (!K || K.salary !== o.salary || K.years !== o.years || K.club !== o.club || meOf(c).club !== o.club || !F.done || K.inc.allLeague !== LIFE.incentives.allLeague || K.inc.mvp !== LIFE.incentives.mvp || K.opt !== (o.opt || null)) bad.push(seed + ' accept ' + JSON.stringify(K));
      if (offers.some(x => x !== o && !x.gone)) bad.push(seed + ' other offers stayed'); seen.push(o.kind + ' ' + o.stars + '★ day ' + o.day);
      if (c.active.filter(id => c.players[id].club === o.club).length !== 1) bad.push(seed + ' two starters at the ' + o.club); }
    return ok(bad, seen.join(' · '));
  }), P);

  await R.step('the agent\'s negotiation: their most (cap room), the asks with their risk (it grows with the ask, the day and the extra terms), your crew\'s agent (3.0 §7: each level takes CREW.roles.agent.odds off the risk, a level more once they know your game), the advice in their name with the odds in words; a yes signs the asked salary, a no and the team walks', () => ev(() => {
    const bad = [], g = HH.game, save = g.save.data, out = [];
    const c = tPro(621, 82); tSim(save, c => c.phase === 'offseason'); c.me.contract.years = 1; tStep(c, 3, { signDay: 99 }); const O = c.offseason; let o = lgUserFaLive(c)[0]; if (!o) return Promise.reject(new Error('no offer'));
    const A = lgCounterAsks(c, o); for (let i = 1; i < A.length; i++) if (A[i].risk + 1e-9 < A[i - 1].risk) bad.push('risk falls ' + A.map(a => a.risk.toFixed(2)).join(' '));
    if (A[0].ask !== Math.round(o.salary / 1000) * 1000) bad.push('the +0 ask ' + A[0].ask + ' vs ' + o.salary); const max = lgTeamMax(c, o); if (A.some(a => a.ask > max)) bad.push('an ask over their most'); if (lgCounterRisk(c, o, max + 5e6) < 0.95) bad.push('over their most is not refused');
    const r1 = lgCounterRisk(c, o, A[2].ask), d0 = O.day; O.day = 4; const r4 = lgCounterRisk(c, o, A[2].ask); O.day = d0; if (!(r4 > r1)) bad.push('the day: ' + r1 + ' → ' + r4);
    const rt = lgCounterRisk(c, o, A[1].ask, { ntc: true, opt: 'player', promise: true }); if (!(rt > lgCounterRisk(c, o, A[1].ask))) bad.push('extra terms');
    /* 3.0 (§7): the agent is a crew member; the biggest ask's risk (clear of the 3% floor) by the agent's level at work */
    const top = A[A.length - 1].ask, ag0 = lgCounterRisk(c, o, top), gut = lgAgentAdvice(c, o).line; if (crewMember(c.me, 'agent') || c.me.agent) bad.push('an agent before one was hired'); if (!(ag0 - CREW.roles.agent.odds[CREW.maxLv] > 0.03)) bad.push('the ask is too safe to read the agent: ' + ag0);
    if (!crewHire(c, crewCandidates(c, 'agent')[0])) bad.push('no agent hired'); const Ag = crewMember(c.me, 'agent') || { lv: 0 }, lv0 = Ag.lv, byLv = [];
    for (let lv = 1; lv <= CREW.maxLv + 1; lv++) { Ag.lv = Math.min(lv, CREW.maxLv); Ag.yrs = lv > CREW.maxLv ? CREW.knows : 0; const r = lgCounterRisk(c, o, top); byLv.push(r); if (Math.abs(ag0 - r - CREW.roles.agent.odds[lv - 1]) > 1e-9) bad.push('Lv' + lv + ': ' + ag0.toFixed(3) + ' → ' + r.toFixed(3)); } Ag.lv = lv0; Ag.yrs = 0;
    const adv = lgAgentAdvice(c, o); if (!/^Your gut: /.test(gut) || !adv || adv.line.indexOf(crewFirst(Ag) + ', your agent: ') !== 0 || !(adv.i >= 0 && adv.i < A.length) || (adv.i > 0 && !/\d+% they accept, \d+% they walk/.test(adv.line))) bad.push('advice ' + JSON.stringify([gut, adv])); out.push(adv.line);
    const yes = lgUserCounter(c, o, A[1].ask, {}, tRng(0.999)); if (!yes || !yes.ok || c.me.contract.salary !== A[1].ask) bad.push('a yes: ' + JSON.stringify(yes) + ' ' + (c.me.contract && c.me.contract.salary));
    const c2 = tPro(622, 82); tSim(save, c => c.phase === 'offseason'); c2.me.contract.years = 1; tStep(c2, 3, { signDay: 99 }); const o2 = lgUserFaLive(c2)[0]; const no = o2 && lgUserCounter(c2, o2, lgCounterAsks(c2, o2)[3].ask, {}, tRng(0));
    if (!no || no.ok || o2.gone !== 'walked' || c2.offseason.fa.done || !c2.news.some(n => /Talks break down/.test(n.t))) bad.push('a no: ' + JSON.stringify(no) + ' ' + (o2 && o2.gone));
    return ok(bad, 'risks ' + A.map(a => '+' + Math.round(a.p * 100) + '% ' + Math.round(a.risk * 100) + '%').join(', ') + ' · +' + Math.round(A[A.length - 1].p * 100) + '% with an agent at Lv1–' + CREW.maxLv + ' (and knowing your game) ' + byLv.map(r => Math.round(r * 100) + '%').join('/') + ' · ' + out[0]);
  }), P);

  await R.step('over the cap a team offers less (×LIFE.overCapMul, at least the exception); win-now owners chase on day 1 and pay more; a cheap owner of yours lets you walk past LIFE.cheapWalk', () => ev(() => {
    const bad = [], c = tPro(631, 84), mine = meOf(c).club, rng = careerRng(c); c.phase = 'offseason'; c.offseason = { v: 2, step: 3, day: 1, ticker: [], fa: { v: 2, offers: [], free: true } };
    const val = lgUserValue(c);
    for (const id of frIds()) if (id !== mine) { for (const m of frBenchOf(c, id)) m.contract.salary = 40e6; c.fr[id].owner = Object.assign({}, c.fr[id].owner, { kind: 'winnow' }); }
    const L = lgUserOffers(c, careerRng(c), val), other = L.filter(o => o.club !== mine);
    if (!other.length) bad.push('no other offers'); for (const o of other) { if (!o.overCap || o.base < LIFE.capException - 1) bad.push(o.club + ' over the cap: ' + o.overCap + ' ' + o.base); if (!o.chase || (o.kind !== 'ring' && o.day !== 1)) bad.push(o.club + ' win-now: chase ' + o.chase + ' day ' + o.day); }
    c.fr[mine].owner = Object.assign({}, c.fr[mine].owner, { kind: 'cheap' }); c.offseason.fa = { v: 2, offers: [], free: true }; c.offseason.ticker = []; const W = lgUserOffers(c, careerRng(c), LIFE.cheapWalk + 1e6);
    if (W.some(o => o.current) || !c.offseason.fa.walked || !c.offseason.ticker.some(t => /cheap/.test(t.t))) bad.push('the cheap owner kept you');
    const c2 = tPro(632, 70), m2 = meOf(c2).club; c2.fr[m2].owner = Object.assign({}, c2.fr[m2].owner, { kind: 'cheap' }); c2.phase = 'offseason'; c2.offseason = { v: 2, step: 3, day: 1, ticker: [], fa: { v: 2, offers: [], free: true } }; const W2 = lgUserOffers(c2, careerRng(c2), LIFE.cheapWalk - 1e6); if (!W2.some(o => o.current)) bad.push('a cheap owner let a cheaper player walk');
    return ok(bad, other.length + ' offers over the cap from win-now owners (' + other.map(o => frNick(o.club) + ' ' + fmtMoney(o.salary)).join(', ') + ')');
  }), P);

  await R.step('contracts: a player option (opt in for a season, or out to free agency), a team option (kept when you are worth 85% of it), the no-trade clause from LIFE.ntcAt All-League teams, the incentives paid at Awards Night', () => ev(() => {
    const bad = [], out = [], mk = (K) => { const c = tPro(651, 78); c.phase = 'offseason'; c.offseason = { v: 2, step: 3, day: 0, ticker: [] }; c.me.contract = Object.assign({ club: meOf(c).club, salary: 5e6, years: 2, s0: 1, total: 3 }, K); return c; };
    let c = mk({ opt: 'player' }); lgUserFaOpen(c); if (!c.offseason.fa.opt || !c.offseason.fa.opt.pending) bad.push('no player option'); lgUserOption(c, false); if (!c.offseason.fa.done || c.me.contract.years !== 1 || c.me.contract.opt) bad.push('opt in: ' + JSON.stringify(c.me.contract));
    c = mk({ opt: 'player' }); lgUserFaOpen(c); lgUserOption(c, true); if (!c.offseason.fa.free || !c.offseason.fa.offers.length || c.me.contract.years !== 0) bad.push('opt out'); else out.push('opt out: ' + c.offseason.fa.offers.length + ' offers');
    c = mk({ opt: 'team', salary: 1e5 }); lgUserFaOpen(c); if (!c.offseason.fa.done || c.me.contract.years !== 1) bad.push('team option kept'); c = mk({ opt: 'team', salary: 9e8 }); lgUserFaOpen(c); if (!c.offseason.fa.free) bad.push('team option declined');
    c = mk({}); if (lgNtcEligible(c)) bad.push('a no-trade clause without All-League teams'); c.me.awards.push({ s: 1, name: 'All-League 1st Team' }); if (LIFE.ntcAt > 1 && lgNtcEligible(c)) bad.push('one All-League team'); for (let i = 1; i < LIFE.ntcAt; i++) c.me.awards.push({ s: 1 + i, name: 'All-League 2nd Team' }); if (!lgNtcEligible(c)) bad.push('no clause at ' + LIFE.ntcAt);
    c.me.contract = { club: meOf(c).club, salary: 10e6, years: 2, inc: Object.assign({}, LIFE.incentives) }; const m0 = c.me.money || 0, pay = lgIncentivesPay(c, { mine: ['All-League 1st Team', 'MVP'] }), want = Math.round(10e6 * LIFE.incentives.allLeague) + Math.round(10e6 * LIFE.incentives.mvp); if (Math.abs((c.me.money || 0) - m0 - want) > 1 || pay.length !== 2) bad.push('incentives ' + JSON.stringify(pay) + ' ' + ((c.me.money || 0) - m0)); else out.push('incentives ' + fmtMoney(want));
    return ok(bad, out.join(' · '));
  }), P);

  await R.step('the trade window: a rebuilding owner trades you (a TRADED card) unless you have a no-trade clause (then it is your call: go or stay)', () => ev(() => {
    const bad = [], out = [], keep = CONFIG.franchise.rebuildOdds; CONFIG.franchise.rebuildOdds = 1;
    try { for (const ntc of [false, true]) { const c = tPro(661, 88), me = meOf(c), club = me.club; me.age = Math.max(me.age, FRN.rebuildAge); c.fr[club].mode = 'rebuild'; c.fr[club].stars = 1; c.me.contract = { club, salary: 2e6, years: 3, ntc }; c.phase = 'offseason'; c.offseason = { v: 2, step: 4, ticker: [] }; c.events.length = 0;
        const e = lgUserRebuild(c, careerRng(c), null); if (!e) { bad.push('no rebuild offer (ntc ' + ntc + ')'); continue; }
        if (!ntc && (meOf(c).club !== e.dest || !c.events.some(x => x.title === 'TRADED'))) bad.push('not traded: ' + meOf(c).club + ' → ' + e.dest);
        if (ntc) { if (meOf(c).club !== club || !e.ntc || !c.events.includes(e)) bad.push('the clause did not hold'); proRebuildAnswer(c, e, false); if (meOf(c).club !== club) bad.push('stayed but moved'); }
        out.push((ntc ? 'with the clause: your call' : 'traded to the ' + frNick(e.dest))); } } finally { CONFIG.franchise.rebuildOdds = keep; }
    return ok(bad, out.join(' · '));
  }), P);

  await R.step('training camp: goals that fit you (wins, the playoffs, points, All-League, All-Star, the MVP race, a starting spot); a goal done pays LIFE.campXp and LIFE.campPay of your salary when the season ends', () => ev(() => {
    const bad = [], g = HH.game, save = g.save.data, c = tPro(671, 80); tSim(save, c => c.phase === 'offseason'); tStep(c, 5); const S = lgCampSuggest(c);
    if (S.length < 3 || !S.some(x => x.id === 'wins') || !S.some(x => x.id === 'playoffs')) bad.push('suggestions ' + S.map(x => x.id).join(','));
    lgCampPick(c, [S[0].id, S[1].id, S[2].id]); if (c.me.camp.goals.length !== LIFE.campGoals) bad.push('picked ' + c.me.camp.goals.length);
    tStep(c, 6); newSeason(c); c.events.length = 0; c.me.camp.goals = [{ id: 'wins', n: 0, label: 'Win 0 games', done: false }, { id: 'ppg', n: 999, label: 'Average 999 points a game', done: false }];
    const m0 = c.me.money || 0, xp0 = JSON.stringify(meOf(c).r); tSim(save, c => c.phase === 'offseason'); const G = c.me.camp.goals;
    if (!G[0].done || G[1].done) bad.push('goals ' + JSON.stringify(G.map(x => x.done))); if (!c.news.some(n => /Season goal done: win 0 games/.test(n.t))) bad.push('no news');
    const done = c.offseason && c.offseason.awards && c.offseason.awards.camp; if (!done || done.length !== 1 || done[0].pay < LIFE.campPayMin) bad.push('paid ' + JSON.stringify(done));
    return ok(bad, 'suggested: ' + S.map(x => x.label).join(', ') + ' · paid ' + fmtMoney(done ? done[0].pay : 0));
  }), P);

  await R.step('league life over six seasons: AI teams sign, trade (8–15 a season), cut and extend; players age and retire (the greats get a tribute and the Hall); rookies come every year; rosters stay five a franchise', () => ev(() => {
    const bad = [], g = HH.game, save = g.save.data, c = tPro(681); const T = [], R = [], Rk = [], moves = { ext: 0, resign: 0, cut: 0 };
    for (let s = 0; s < 6; s++) { tSim(save, c => c.phase === 'offseason'); const O = lgOffseasonAuto(c, {}); if (!O) { bad.push('no offseason'); break; }
      T.push(lgTradesIn(c, c.season)); R.push(O.ret.list.length); Rk.push(O.signed.filter(x => x.why === 'rookie').length); for (const k of Object.keys(moves)) moves[k] += (O.moves[k] || []).length;
      for (const id of frIds()) if (lgCount(c, id) !== 5) bad.push(c.season + ' ' + id + ' ' + lgCount(c, id));
      newSeason(c); c.events.length = 0; if (c.active.some(id => !c.players[id].isMe && c.players[id].age > LIFE.retire[LIFE.retire.length - 1][0])) bad.push('a player past ' + LIFE.retire[LIFE.retire.length - 1][0]); }
    const tr = (c.tradeLog || []).filter(t => t.s >= 2); if (T.slice(1).some(t => t < 8 || t > 15) || T[0] < 6) bad.push('trades a season ' + T.join(',')); /* (the first season had no trade window before it) */ if (!R.some(x => x > 0)) bad.push('nobody retired'); if (Rk.some(x => x < 1)) bad.push('rookies ' + Rk.join(','));
    if (!moves.ext || !moves.resign) bad.push('moves ' + JSON.stringify(moves)); if (!c.news.some(n => /^Trade: /.test(n.t)) && !tr.length) bad.push('no trade news');
    return ok(bad, 'trades ' + T.join('/') + ' · retired ' + R.join('/') + ' · rookies signed ' + Rk.join('/') + ' · ' + JSON.stringify(moves) + ' · the Hall ' + (c.hall || []).length);
  }), P);

  await R.step('your past in the rookie classes: old teammates (and rivals) old enough and good enough come up from the college system, in the rookie class and the news when they sign ("Your high school teammate … signs with the …")', () => ev(() => {
    const bad = [], g = HH.game, save = g.save.data, c = tPro(691); c.pastPeople = [{ name: 'Nadia Sato', rel: 'hs', school: 'Eastside High', age: 18, ovr: 66, style: 'slasher', h: 1.8, look: null, st: 0, s0: 1 }, { name: 'Ruben Okoye', rel: 'col', school: 'State', age: 19, ovr: 68, style: 'lockdown', h: 1.96, look: null, st: 0, s0: 1 }, { name: 'Tiny Benchwarmer', rel: 'hs', school: 'Eastside High', age: 18, ovr: 40, style: 'slasher', h: 1.7, look: null, st: 0, s0: 1 }];
    const said = [], signed = []; for (let s = 0; s < 6 && c.pastPeople.some(e => !e.st); s++) { tSim(save, c => c.phase === 'offseason'); lgOffseasonAuto(c, {}); for (const t of c.offseason.ticker) if (/^Your (high school|college) teammate /.test(t.t)) said.push(t.t); for (const n of c.news) if (/^Your (high school|college) teammate .* signs with the /.test(n.t) && !signed.includes(n.t)) signed.push(n.t); newSeason(c); c.events.length = 0; } /* (the news keeps the latest CR.newsMax: read it each offseason) */
    const st = Object.fromEntries(c.pastPeople.map(e => [e.name, e.st])); if (st['Nadia Sato'] !== 1 || st['Ruben Okoye'] !== 1 || st['Tiny Benchwarmer'] !== -1) bad.push('came up: ' + JSON.stringify(st));
    if (!said.some(t => /Nadia Sato is in the rookie class/.test(t))) bad.push('no rookie class line'); if (!signed.length) bad.push('no signing news');
    return ok(bad, said.slice(0, 3).join(' · '));
  }), P);

  await R.step('title windows on every franchise (the top LIFE.window[0] Contenders, the bottom LIFE.window[1] and every rebuild Rebuilding, the rest Rising); hunger: the LIFE.hungerN longest droughts of LIFE.hungerAt+ seasons get the edge (the longest, more from LIFE.hungerLong[0] seasons) and shop first', () => ev(() => {
    const bad = [], c = tPro(701), order = lgWindows(c), W = {}; for (const id of frIds()) { const w = lgWindowOf(c, id); W[w] = (W[w] || 0) + 1; if (!LG_WINDOW_WORD[w]) bad.push(id + ' ' + w); if (c.fr[id].mode === 'rebuild' && w !== 'rebuilding') bad.push(id + ' rebuilds as ' + w); }
    order.slice(0, LIFE.window[0]).forEach(id => { if (c.fr[id].mode !== 'rebuild' && lgWindowOf(c, id) !== 'contender') bad.push(id + ' top but ' + lgWindowOf(c, id)); }); if ((W.contender || 0) > LIFE.window[0] || (W.rebuilding || 0) < LIFE.window[1]) bad.push(JSON.stringify(W));
    const H = lgHungerSet(c), D = Object.fromEntries(frIds().map(id => [id, lgDrought(c, id)])); if (H.length > LIFE.hungerN || H.some(id => D[id] < LIFE.hungerAt)) bad.push('hungry ' + H.map(id => id + ' ' + D[id]).join(','));
    const minH = Math.min(...H.map(id => D[id])); if (H.length === LIFE.hungerN && frIds().some(id => !H.includes(id) && D[id] > minH)) bad.push('a longer drought left out');
    for (const id of frIds()) if (lgHungerEdge(c, id) !== (H.includes(id) ? (H[0] === id && D[id] >= LIFE.hungerLong[0] ? LIFE.hungerLong[1] : LIFE.hungerEdge) : 0)) bad.push('edge ' + id); /* (LIFE.hungerLong: the longest drought, more) */
    const so = lgShopOrder(c, careerRng(c)); if (H.length && !H.every(id => so.indexOf(id) < H.length)) bad.push('shop order ' + so.slice(0, 5).join(','));
    return ok(bad, JSON.stringify(W) + ' · hungry: ' + H.map(id => frNick(id) + ' ' + D[id]).join(', '));
  }), P);

  await R.step('the GOAT ladder (the top LIFE.goatN, your rank and score) and the league records (a new one is broken: the record book and the news)', () => ev(() => {
    const bad = [], c = tPro(711), G = lgGoatList(c); if (G.top.length !== LIFE.goatN || G.top.some((e, i) => i && e.score > G.top[i - 1].score) || !(G.rank >= 1) || !G.me || G.n < LIFE.goatN) bad.push('ladder ' + G.top.length + ' rank ' + G.rank);
    const R = lgRecords(c); for (const [k] of LG_REC_KEYS) if (!R[k] || !(R[k].v > 0) || !R[k].name || !R[k].year) bad.push('record ' + k);
    c.stats[c.meId] = Object.assign(c.stats[c.meId] || {}, { g: 15, pts: Math.ceil(R.spts.v) + 40 }); const broke = lgRecordsCheck(c); if (!broke.some(x => x.k === 'spts' && x.me) || !lgRecords(c).spts.me || !c.news.some(n => /A league record!/.test(n.t))) bad.push('no record: ' + JSON.stringify(broke.map(x => x.k)));
    return ok(bad, 'top ' + G.top[0].name + ' ' + G.top[0].score + ' · you #' + G.rank + ' of ' + G.n + ' · records ' + LG_REC_KEYS.length + ' (you broke ' + broke.filter(x => x.me).map(x => x.k).join(', ') + ')');
  }), P);

  await R.step('media: PBL Tonight every week (the hub\'s headline), the power rankings (1–16, a line each, arrows), the national TV game (its own intro: the match knows it)', () => ev(() => {
    const bad = [], g = HH.game, save = g.save.data, c = tPro(721); tSim(save, c => c.week >= 6); const T = c.tonight;
    if (!T || T.s !== c.season || !T.head || !c.news.some(n => /^PBL TONIGHT: /.test(n.t))) bad.push('PBL Tonight ' + JSON.stringify(T)); const H = proHubData(g, c); if (!/PBL TONIGHT: /.test(H.headline || '')) bad.push('hub headline ' + H.headline);
    const P_ = lgPower(c); if (P_.length !== 16 || P_.some((r, i) => r.rank !== i + 1 || !r.line || r.prev == null)) bad.push('power ' + JSON.stringify(P_.slice(0, 2)));
    tSim(save, c => c.week >= PBL.tvWeek - 1); const o = careerMatchOpts(c, save, (c.schedule[c.week] || []).find(x => x.h === c.meId || x.a === c.meId)); if (!o || !o.tv) bad.push('the TV game ' + JSON.stringify(o && o.tv));
    return ok(bad, '"' + T.head + '" · #1 the ' + frNick(P_[0].id) + ': ' + P_[0].line);
  }), P);

  await R.step('owners react (3.0 §2.3: the press room is gone, the beats are messages): a slide alone makes no news; a meddler tells the coach to play you (thank the owner or back the coach), shops you before the deadline (a trade call comes easier), fires the coach (a new system, the trust starts over); each beat a message in the inbox (one a week, dropped past its season); two beats a season at most', () => ev(() => {
    const bad = [], out = [], g = HH.game, c = tPro(731), club = meOf(c).club; c.fr[club].owner = { name: 'Dex Calloway', kind: 'meddler' }; c.week = 5; const st = c.standings[c.meId] || (c.standings[c.meId] = { w: 0, l: 0, strk: 0 });
    st.strk = -3; st.w = 3; st.l = 3; const e0 = lgMeddleWeek(c, tRng(0)); if (e0) bad.push('a slide alone: ' + e0.beat + ' (2.x: the press)');
    c.me.benchSeason = 3; const e1 = lgMeddleWeek(c, tRng(0)); if (!e1 || e1.beat !== 'minutes') bad.push('minutes ' + (e1 && e1.beat)); else { const s1 = eventScreen(g, c, e1, () => {}), L = (s1 ? s1.widgets : []).map(w => w.label), O1 = lgMeddleOptions(c, e1);
      if (evClass(e1, c) !== 'message' || !c.events.includes(e1) || !c.news.some(n => /tells the coach to play/.test(n.t)) || !O1.every(o => L.includes(o.label))) bad.push('the minutes message: ' + evClass(e1, c) + ' ' + L.join(' / '));
      const t0 = c.team.trust, f0 = c.me.fame || 0; O1[0].pick(); if (c.team.trust !== clamp(t0 - 5, 0, 100) || c.me.fame !== clamp(f0 + 3, 0, 100)) bad.push('thank the owner: trust ' + t0 + ' → ' + c.team.trust + ', fame ' + f0 + ' → ' + c.me.fame); out.push(e1.beat + ' (' + O1.map(o => o.label).join(' / ') + ')'); }
    evRoute(c, null, null); if (!(c.inbox || []).includes(e1) || evNextMessage(c) !== e1) bad.push('not in the inbox');
    st.w = 1; st.l = 4; if (lgMeddleWeek(c, tRng(0.99))) bad.push('the odds'); const e2 = lgMeddleWeek(c, tRng(0)); if (!e2 || e2.beat !== 'shop') bad.push('shop ' + (e2 && e2.beat)); else { lgMeddleOptions(c, e2)[1].pick(); if (c.me.shopped !== c.season) bad.push('shopped'); out.push('shop'); }
    evRoute(c, null, null); if (evNextMessage(c)) bad.push('two messages in a week');
    c.week = PBL.deadlineWeek; st.w = 1; st.l = 6; if (lgMeddleWeek(c, tRng(0))) bad.push('a third beat');
    c.season++; if (evNextMessage(c) || (c.inbox || []).includes(e2)) bad.push('last season\'s message stayed'); c.me.benchSeason = 0; st.strk = 0; const co0 = frCoachOf(c, club).name, e3 = lgMeddleWeek(c, tRng(0)), t3 = clamp(TM.trustStart.pro + PBL.sysTrust[frSysFit(c, club).tier], 0, 100);
    if (!e3 || e3.beat !== 'coach' || frCoachOf(c, club).name === co0 && !e3.forced || c.team.trust !== t3 || lgMeddleOptions(c, e3).length !== 1) bad.push('coach ' + (e3 && e3.beat) + ' trust ' + c.team.trust); else out.push('coach: ' + co0 + ' → ' + frCoachOf(c, club).name + ' (trust ' + t3 + ')');
    c.fr[club].owner.kind = 'patient'; c.me.meddle = null; if (lgMeddleWeek(c, tRng(0))) bad.push('a patient owner meddled');
    return ok(bad, out.join(' · '));
  }), P);

  await R.step('the value meter in the hub\'s header strip (3.0 §2.1: on HOME and every tab: VALUE and your value against every star bar, a tick each for 2★–5★, green up to your franchise, gold the bars you pass), the title window on the franchise page, the franchises list and the offers; past LIFE.starContend\'s bar your club builds around you (it contends; LIFE.starEdge the season after)', () => ev(() => {
    const bad = [], g = HH.game, save = g.save.data, c = tPro(741, 80); tSim(save, c => c.week >= 2); const club = meOf(c).club, w = LG_WINDOW_WORD[lgWindowOf(c, club)];
    /* the meter's bars are ticks (their 2★–5★ labels only when they fit apart): drawValueMeter is watched for its value, its width and its 2×14 ticks */
    const V = 'VALUE ' + Math.round(frValue(c)), dvm = window.drawValueMeter, seen = []; let M = null, tk = ''; window.drawValueMeter = function (ctx, ui, v) { const T = [], fr = ctx.fillRect; ctx.fillRect = function (x, y, tw, th) { if (tw === 2 && th === 14) T.push(String(this.fillStyle).toLowerCase()); return fr.apply(this, arguments); }; let r = 0; try { r = dvm.apply(this, arguments); } finally { delete ctx.fillRect; } M = { v: v.v, now: v.now, r, T }; return r; };
    try { for (const t of HUB_TAB_IDS) { g.hubTab = t; g.ui.clearTo(careerHub(g)); M = null; const hub = tSaid(g), want = [2, 3, 4, 5].map(s => s <= frMine(c) ? 'g' : frValue(c) >= FRN.bar[s - 1] ? 'y' : '-').join(''), got = M ? M.T.map(x => x === UI_GREEN.toLowerCase() ? 'g' : x === UI_GOLD.toLowerCase() ? 'y' : '-').join('') : '';
        if (!hub.includes(V) || !M || !(M.r > 0) || M.v !== frValue(c) || M.now !== frMine(c) || got !== want) bad.push('no meter on ' + t + ': ' + JSON.stringify(M) + ' ' + hub.slice(0, 100)); else { seen.push(t); tk = got; } } } finally { window.drawValueMeter = dvm; }
    g.frTab = { tab: 0 }; g.ui.clearTo(careerHub(g)); g.ui.push(franchiseScreen(g, club)); if (!tSaid(g).includes(w)) bad.push('franchise page lacks ' + w);
    g.leagueTab = { tab: 1, player: 0 }; g.ui.clearTo(careerHub(g)); g.ui.push(leagueScreen(g)); const L = tSaid(g); if (!['Contender', 'Rising', 'Rebuilding'].every(x => L.includes(x))) bad.push('franchises list');
    tSim(save, c => c.phase === 'offseason'); c.me.contract.years = 1; const sc = LIFE.starContend, Fm = c.fr[club]; if (Fm.owner.kind === 'cheap') Fm.owner.kind = 'patient'; LIFE.starContend = 1; /* teams act at bars: past the bar (here every value), your club builds around you */
    try { tStep(c, 3, { signDay: 99 }); } finally { LIFE.starContend = sc; } g.ui.clearTo(careerHub(g)); g.ui.push(offseasonScreen(g)); const F = tSaid(g); if (!/Contender|Rising|Rebuilding/.test(F)) bad.push('offers lack the window');
    if (Fm.starC !== c.season || Fm.mode !== 'contend' || !lgStarClub(c, club) || frIds().some(id => id !== club && lgStarClub(c, id))) bad.push('your club does not build around you: ' + JSON.stringify([Fm.starC, Fm.mode, c.season]));
    { const ph = c.phase; c.phase = 'regular'; c.season++; const e = lgHungerEdge(c, club), want = lgHungry(c, club) ? (lgHungerSet(c)[0] === club && lgDrought(c, club) >= LIFE.hungerLong[0] ? LIFE.hungerLong[1] : LIFE.hungerEdge) : LIFE.starEdge; c.season--; c.phase = ph; if (e !== want) bad.push('the season after: edge ' + e); }
    return ok(bad, V + ' on ' + seen.join('/') + ' (2★–5★ ticks ' + tk + ': g reached, y passed), the franchise page (' + w + '), the list and the offers; your club builds around you (' + Fm.mode + ', +' + LIFE.starEdge + ' the season after)');
  }), P);

  // old saves: the W5 build (the PBL before W6): in the offseason (finishes the old way) and mid-season (ends in the new one)
  const FIX = path.join(__dirname, 'fixtures');
  await R.step('old saves (the W5 build): an offseason in progress finishes the old way and the next one is the new; a season in progress ends in the new offseason', async () => {
    const out = [];
    for (const f of ['save_w5_pro_offseason.json', 'save_w5_pro_midseason.json']) { const fp = path.join(FIX, f); if (!fs.existsSync(fp)) throw new Error('no fixture ' + f); const raw = fs.readFileSync(fp, 'utf8'); await P.ev(raw => { localStorage.setItem(CONFIG.save.key, raw); }, raw); await P.page.reload(); await P.page.waitForTimeout(700); await P.ev(src => { (0, eval)(src); }, LIB);
      const r = await P.ev(() => { const bad = [], g = HH.game, s = g.save.data, c = s.career, was = c.phase, v0 = c.offseason && c.offseason.v;
        if (was === 'offseason') { if (v0 === 2) bad.push('the old offseason became v2'); g.ui.clearTo(offseasonScreen(g)); tFaults(g); if (!c.offseason.prog) offseasonProgression(c); if (!c.offseason.moves) offseasonMoves(c); const offers = offseasonContract(c); if (offers) acceptContract(c, 0); newSeason(c); c.events.length = 0; }
        tSim(s, c => c.phase === 'offseason'); if (!c.offseason || c.offseason.v !== 2) bad.push('the next offseason is not the new one'); const O = lgOffseasonAuto(c, {}); if (!O) bad.push('no auto'); else { for (const id of frIds()) if (lgCount(c, id) !== 5) bad.push(id + ' ' + lgCount(c, id)); newSeason(c); if (c.active.length !== 16 || !pblReady(c)) bad.push('season ' + c.season); }
        const G = lgGoatList(c); if (!G.top.length) bad.push('no ladder');
        return bad.length ? 'BAD ' + bad.join('; ') : was + (v0 ? ' v' + v0 : '') + ' → season ' + c.season + ' (' + (c.tradeLog || []).length + ' trades logged, GOAT #' + G.rank + ')'; });
      if (r.startsWith('BAD')) throw new Error(f + ': ' + r); if (P.errors.length) throw new Error(f + ': page ' + P.errors.slice(0, 2).join(' | ')); out.push(f.replace('save_w5_pro_', '').replace('.json', '') + ': ' + r); }
    return out.join(' · ');
  }, P);

  await R.step('screens (desktop): HOME and its tabs (3.0), the League (franchises, power, GOAT, records), the franchise page, the Codex, the meddler\'s messages (3.0: minutes, shop, coach), the eight offseason steps, the free agency week and the negotiation: no cut or overlapping text', () => ev(() => { const bad = tScreens(HH.game, false); return ok(bad, 'all clean'); }), P);
  if (P.errors.length) console.log('page errors:', P.errors.slice(0, 5));
  const Q = await openPage(b, { wait: 900, phone: true }); await Q.ev(src => { (0, eval)(src); }, LIB);
  await R.step('screens (phone): the same, with 64 px targets', () => Q.ev(() => { const bad = tScreens(HH.game, true); return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : 'all clean'; }), Q);
  if (Q.errors.length) console.log('phone page errors:', Q.errors.slice(0, 5));
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
