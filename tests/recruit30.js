// 3.0 §8 (X9): recruiting like real life, and the 2.1 recruiting game it keeps (it replaces tests/recruit21.js, whose
// film, emails, monthly actions, visit scenes and press storm 3.0 §1 removed). Interest from how you play (your
// rating, titles, the tournaments, points and the player ranking); scouts at big games; the programs at each summer
// event and your scout's read of them (AAU invites at Lv3); offers that come by themselves (from the junior year, at
// 70+, a spot open, the GPA line met), held through Signing Day for a top target, and a deadline before a filled
// spot pulls one; the camps, unofficial and official visits (five, one summary each); commit, flip, the carousel,
// Signing Day; with no offer a walk-on, a prep year, junior college or a club abroad; the College test; the ranked
// college list; the screens and the Codex; old saves; and the §8 table across 600 careers (the career simulator,
// --hsOnly --spread=12, four seeds at once).
// node tests/recruit30.js   (ONLY=<regex> runs the matching steps; REC8=0 skips the table)
const { spawn } = require('child_process');
const { launch, openPage, runner } = require('./lib');
const { rec8 } = require('./careersim');

// Installed on each page: a high school player (a junior by default, ratings +plus, a GPA) with a team and a league
// in its second week; a junior played into the season (tJunior: the starter, the league's real state); an offer
// from a program; the strings one synchronous UI draw shows, and its cut or overlapping text.
const LIB = `
window.tRec = (seed, year, plus, gpa) => { const g = HH.game, a = amCreate(defaultSave(), { name: 'Recruit Test', look: PRESET_LOOKS[seed % 16], number: 4, style: 'slasher', seed }); hsSimTryout(a); a.events.length = 0; a.stageYear = year || 3; a.gpa = gpa == null ? 3.0 : gpa; for (const k of RATING_KEYS) { a.r[k] = clamp(a.r[k] + (plus || 0), CR.ratingMin, CR.ratingMax); a.caps[k] = Math.max(a.caps[k], a.r[k]); } g.save.data.c1 = a; g.save.data.career = null; if (a.league) a.league.week = 2; hsUpdateRank(a, 'test'); a.events.length = 0; return a; };
window.tJunior = (seed, plus) => { const g = HH.game, a = amCreate(defaultSave(), { name: 'Scout Test', look: PRESET_LOOKS[seed % 16], number: 4, style: 'slasher', seed }); for (const k of RATING_KEYS) { a.r[k] = clamp(a.r[k] + (plus || 0), CR.ratingMin, CR.ratingMax); a.caps[k] = Math.max(a.caps[k], a.r[k]); } g.save.data.c1 = a; g.save.data.career = null;
  let guard = 0; const ready = () => (a.stageYear || 1) >= 3 && a.league && !a.league.done && !a.league.playoffs && a.league.week >= 1 && !(a.summer && a.summer.pending) && !(a.tryout && a.tryout.step !== 'done');
  while (guard++ < 400 && !ready()) { a.events.length = 0; if (a.summer && a.summer.pending) { hsSummerChoose(a, 'rest'); continue; } if (a.tryout && a.tryout.step !== 'done') { hsSimTryout(a); continue; } if (a.decision) break; amSimGame(a); }
  a.events.length = 0; ladderInit(a, 1); a.squad = 'varsity'; a.ineligible = 0; a.gpa = Math.max(a.gpa || 0, 3.0); return a; };
window.tOffer = (a, id) => { const o = colOfferFrom(a, colProg(id), 'test'); o.t = recOf(a).t; if (colProg(id).academic) o.cond = { gpa: colGpaReq(colProg(id)) }; a.offers.push(o); recBump(a); return o; };
window.tTexts = g => { g.ui.trans = null; g.ui.toastT = 0; RBF.boxes = []; let X = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { X = RBF.boxes || []; RBF.boxes = null; } return X; };
window.tStr = g => tTexts(g).map(x => String(x.t)).join(' | ');
window.tFaults = g => { const B = tTexts(g), out = B.filter(x => x.cut).map(x => 'CUT ' + String(x.cut).slice(0, 40)); const T = B.filter(x => String(x.t).trim() && x.a >= 0.35 && x.w >= 1); for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const p = T[i], q = T[j]; if (p.t === q.t) continue; const px = Math.max(p.s, q.s), ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y); if (ix > px && iy > px) out.push('OVERLAP "' + String(p.t).slice(0, 20) + '" x "' + String(q.t).slice(0, 20) + '"'); } return out.concat((window.HH_ERRORS || []).splice(0)); };
window.tSmall = g => { const ui = g.ui, s = ui.screen; return (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && w.kind !== 'text' && (w.w * ui.scale < 63.5 || w.h * ui.scale < 63.5)).map(w => (w.label || w.kind) + ' ' + Math.round(w.w * ui.scale) + '×' + Math.round(w.h * ui.scale)); };
window.tWeeks = (a, n, plan) => { const out = []; for (let i = 0; i < n; i++) { if (a.league) a.league.week = Math.min((a.league.week || 0) + 1, (a.league.schedule || []).length || 11); recWeek(a, amRng(a), plan || 'practice'); out.push(...a.events.splice(0)); } return out; };
window.tNone = (seed, plus, gpa) => { const a = tRec(seed, 4, plus == null ? -14 : plus, gpa == null ? 2.2 : gpa); a.offers = []; recSigningDay(a, amRng(a)); return a; };
window.tSeason = a => { let guard = 0; const st = a.stage; while (a.stage === st && !a.decision && guard++ < 80) { a.events.length = 0; amSimGame(a); } return a; };
// A scene: the screen open, finished, updated; its faults (and, on a phone, small targets).
window.tLook = (g, name, open, bad, phone) => { g.ui.clearTo(amHub(g)); open(); const s = g.ui.screen; if (s.finish) s.finish(); if (s.update) s.update(0.016, {}); const F = tFaults(g).concat(phone ? tSmall(g).map(x => 'SMALL ' + x) : []); if (F.length) bad.push(name + ': ' + F.slice(0, 3).join(' | ')); return s; };
// The screens both passes draw: [name, setup → open()].
window.tScreens = () => [
  ['recruit tab', () => { const a = tRec(120, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; HH.game.hubTab = 'recruit'; return () => {}; }],
  ['program page', () => { const a = tRec(121, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; const o = a.offers[0]; return () => HH.game.ui.push(collegeProgramScreen(HH.game, o.pid)); }],
  ['action sheet', () => { const a = tRec(122, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; const o = a.offers.find(x => !recHeld(a, x.pid)) || a.offers[0]; return () => HH.game.ui.push(recActionScreen(HH.game, o.pid)); }],
  ['offers & rank', () => { const a = tRec(123, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; return () => HH.game.ui.push(recruitingScreen(HH.game)); }],
  ['recruiting log', () => { const a = tRec(124, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; return () => HH.game.ui.push(recLogScreen(HH.game)); }],
  ['college list', () => { tRec(125, 3, 18, 3.0); return () => HH.game.ui.push(collegeBrowserScreen(HH.game)); }],
  ['signing day', () => { const a = tRec(126, 4, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; recSigningDay(a, amRng(a)); a.events.length = 0; return () => HH.game.ui.push(amDecisionScreen(HH.game)); }],
  ['signing day, no offer', () => { const a = tNone(127); a.events.length = 0; return () => HH.game.ui.push(amDecisionScreen(HH.game)); }],
  ['walk-on', () => { const a = tNone(128, -14, 2.6); a.events.length = 0; return () => HH.game.ui.push(recWalkOnScreen(HH.game)); }],
  ['play abroad', () => { const a = tNone(129); a.events.length = 0; return () => HH.game.ui.push(ovsOffersScreen(HH.game, true)); }],
  ['junior college home', () => { const a = tNone(130); jucoGo(a); a.events.length = 0; HH.game.hubTab = 'home'; return () => {}; }],
  ['junior college league', () => { const a = tNone(131); jucoGo(a); a.events.length = 0; HH.game.hubTab = 'league'; return () => {}; }],
  ['transfer offers', () => { const a = tNone(132); jucoGo(a); tSeason(a); a.events.length = 0; return () => HH.game.ui.push(amDecisionScreen(HH.game)); }],
  ['home with scouts', () => { const a = tJunior(133, 12); a.league.seniorNight = a.league.week; HH.game.hubTab = 'home'; return () => {}; }],
  ['pregame with scouts', () => { const a = tJunior(134, 12); a.league.seniorNight = a.league.week; return () => HH.game.ui.push(amPregameScreen(HH.game)); }],
  ['result with scouts', () => { const a = tJunior(135, 12); a.league.seniorNight = a.league.week; const r = amSimGame(a); a.events.length = 0; return () => HH.game.ui.push(gameResultScreen(HH.game, a, Object.assign({}, r, { us: r.my, them: r.their }), null, 'amresult', () => HH.game.ui.pop())); }],
  ['summer with a scout', () => { const a = tJunior(136, 12); a.cash = 1e5; a.credits = 100; const cs = crewCandidates(a, 'scout'); crewHire(a, cs[0]); crewMember(a, 'scout').lv = 3; hsSummerStart(a); HH.game.sumPick = null; return () => HH.game.ui.push(summerScreen(HH.game)); }],
  ['summer without one', () => { const a = tJunior(137, 6); hsSummerStart(a); HH.game.sumPick = null; return () => HH.game.ui.push(summerScreen(HH.game)); }],
];
`;

// The §8 table: the career simulator's high school careers (--hsOnly --spread=12: every star level sampled), four
// seeds at once; the rows by the national rank at signing.
function runTable(n, seeds) {
  return Promise.all(seeds.map(s => new Promise(res => { let out = ''; const ch = spawn('node', [__dirname + '/careersim.js', String(n), String(s), '--hsOnly', '--spread=12', '--json'], { cwd: __dirname + '/..' }); ch.stdout.on('data', d => { out += d; }); ch.on('close', () => { const L = out.split('\n').find(l => l.startsWith('JSON ')); res(L ? JSON.parse(L.slice(5)).hs.filter(Boolean) : []); }); }))).then(R => [].concat(...R));
}

(async () => {
  const b = await launch(); const R = runner('recruit30');
  const P = await openPage(b, { wait: 900 }); const { ev } = P; await ev(src => { (0, eval)(src); window.HH_NO_TIPS = true; }, LIB);

  await R.step('interest: the parts add up; a freshman is watched at most, a sophomore contacted; under a GPA line at most 20; a commitment freezes the others (a flip-friendly few keep rising)', () => ev(() => {
    const bad = [], a = tRec(11, 1, 24, 3.0), Y = COLG.interest.yearCap, top = () => Math.max(...COLLEGES.map(P => colInterest(a, P.id) || 0));
    if (top() > Y[0]) bad.push('freshman max ' + top()); a.stageYear = 2; if (top() > Y[1]) bad.push('sophomore max ' + top()); a.stageYear = 3; if (top() < 90) bad.push('junior max only ' + top());
    for (const P of COLLEGES.slice(0, 20)) { const I = recInterestParts(a, P.id); if (I.yearCap != null || I.gpaCap != null || I.frozen != null) continue; const sum = clamp(Math.round(I.fit + I.coach + I.home + I.earned + I.competition), 0, 100); if (sum !== I.v || I.v !== colInterest(a, P.id)) bad.push(P.id + ' parts ' + sum + ' vs ' + I.v + ' vs ' + colInterest(a, P.id)); }
    a.gpa = 1.6; if (top() > COLG.interest.gpaCap) bad.push('GPA 1.6: max ' + top()); a.gpa = 3.0;
    const T = COLLEGES.filter(P => colSpots(a, P.id).left > 0).sort((p, q) => colInterest(a, q.id) - colInterest(a, p.id))[0]; tOffer(a, T.id); if (!recCommit(a, T.id)) bad.push('no commitment');
    const others = COLLEGES.filter(P => P.id !== T.id && colInterest(a, P.id) < 90); let froze = 0, rose = 0; for (const P of others.slice(0, 24)) { const v0 = colInterest(a, P.id); recEarn(a, P.id, 15); const v1 = colInterest(a, P.id); if (recFlipFriendly(a, P.id)) { if (v1 > v0) rose++; else bad.push(P.id + ' (flip-friendly) did not rise'); } else if (v1 > v0) bad.push(P.id + ' rose while committed ' + v0 + '→' + v1); else froze++; }
    return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : 'freshman ≤' + Y[0] + ', sophomore ≤' + Y[1] + ', junior top ' + top() + ' · committed: ' + froze + ' frozen, ' + rose + ' flip-friendly rose';
  }), P);

  await R.step('how you play (§8): the recruiting score is its parts (rating, titles, tournaments, points, the player ranking: #1 +3, #100 about 0, unranked 0); Offers & rank shows them', () => ev(() => {
    const bad = [], g = HH.game, a = tJunior(15, 8), P0 = hsRecruitParts(a), sum = P0.ovr + P0.titles + P0.districts + P0.mvps + P0.fame + P0.trust + P0.exposure + P0.ppg + P0.rank + P0.prep;
    if (Math.abs(sum - hsRecruitScore(a)) > 1e-9) bad.push('parts ' + sum.toFixed(2) + ' vs score ' + hsRecruitScore(a).toFixed(2));
    const me = a.rk && a.rk.P && a.rk.P.me, last = a.log[a.log.length - 1]; if (!me) bad.push('no ranking state'); else { const r0 = me.r, p0 = last && last.prk; if (last) last.prk = 0; /* (unranked this season: last season's rank counts, as for the camp invite) */ for (const [r, want] of [[1, RCG.play.rank], [50, RCG.play.rank * 51 / RK.top], [RK.top, RCG.play.rank / RK.top], [RK.top + 5, 0]]) { me.r = r; const v = hsRecruitParts(a).rank; if (Math.abs(v - want) > 1e-9) bad.push('rank #' + r + ': ' + v.toFixed(2) + ' (want ' + want.toFixed(2) + ')'); } me.r = r0; if (last) { last.prk = 7; me.r = 0; const v = hsRecruitParts(a).rank, w = RCG.play.rank * (RK.top - 6) / RK.top; if (Math.abs(v - w) > 1e-9) bad.push('unranked this week, #7 last season: ' + v.toFixed(2)); last.prk = p0; me.r = r0; } }
    a.exposure = 5; const s0 = hsRecruitScore(a); a.exposure = 9; if (Math.abs(hsRecruitScore(a) - s0 - 4) > 1e-9) bad.push('tournaments do not count one for one');
    g.ui.clearTo(amHub(g)); g.ui.push(recruitingScreen(g)); const tx = tStr(g); if (!/What the scouts count/i.test(tx)) bad.push('no "What the scouts count"'); if (!/OVR \d+/.test(tx) || !/tournaments \+/.test(tx)) bad.push('the parts are not shown: ' + (hsRecruitPartsText(a) || '').slice(0, 80));
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : hsRecruitPartsText(a);
  }), P);

  await R.step('offers come by themselves: never before the junior year; from the junior year at 70+ with a spot open and the GPA line met (GPA gates them; Study is on the weekly plan); an elite academic offer is conditional', () => ev(() => {
    const bad = [], a = tRec(12, 2, 22, 3.2); if (recOfferRoll(a, amRng(a), 60).length) bad.push('a sophomore got offers');
    a.stageYear = 3; const pre = COLLEGES.map(P => [P, colInterest(a, P.id) || 0, colSpots(a, P.id).left]), f = recOfferRoll(a, amRng(a), 60); a.events.length = 0; if (f.length < 3) bad.push('junior offers ' + f.length);
    for (const o of f) { const x = pre.find(q => q[0].id === o.pid); if (x[1] < COLG.stages[2]) bad.push(o.name + ' offered at ' + x[1]); if (x[2] <= 0) bad.push(o.name + ' offered with no spot'); if ((a.gpa || 0) < recGpaFloor(x[0])) bad.push(o.name + ' under its line'); if (x[0].academic && !(o.cond && o.cond.gpa === CONFIG.school.gpaReq.academic)) bad.push(o.name + ' academic, not conditional'); }
    const c = tRec(12, 3, 22, 1.9); if (recOfferRoll(c, amRng(c), 60).length) bad.push('GPA 1.9 got offers');
    const d = tRec(13, 3, 30, 3.4), fa = recOfferRoll(d, amRng(d), 80).filter(o => o.academic); if (!fa.length) bad.push('no elite academic offer at 3.4'); for (const o of fa) if (!o.cond) bad.push(o.name + ' unconditional');
    if (!WEEK_PLAN_LABEL.study || typeof wkStudy !== 'function') bad.push('no Study on the weekly plan');
    return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : f.length + ' junior offers (every one at 70+, a spot open, over its GPA line); ' + fa.length + ' conditional academic at 3.4; none at 1.9';
  }), P);

  await R.step('held offers (§8): a top target\'s offer holds a spot through Signing Day (colSpots counts it; the recruits can\'t take it; never pulled for a spot; you can commit with none left); a pulled offer frees it', () => ev(() => {
    const bad = [], a = tRec(14, 3, 30, 3.2); recOfferRoll(a, amRng(a), 60); a.events.length = 0; const R0 = recOf(a), x = Math.log10(recProjRank(a)), held = (a.offers || []).filter(o => !o.pulled && recHeld(a, o.pid));
    if (!held.length) return Promise.reject(new Error('no held offer for a top recruit (' + a.offers.length + ' offers)'));
    for (const o of held) { const P = colProg(o.pid), S = colSpots(a, o.pid); if (S.held !== 1) bad.push(o.name + ' held ' + S.held); if (!(x <= recLevel(P) || colInterest(a, o.pid) >= RCG.hold.int - 10)) bad.push(o.name + ' held, not a top target'); const S1 = colSpots(a, o.pid, 1); if (S1.recruits.filter(r => r.status === 'committed').length > S1.total - 1) bad.push(o.name + ': the recruits took the held spot'); }
    for (let y = 3; y <= 4; y++) { a.stageYear = y; a.league.week = 0; tWeeks(a, 11); } const lost = held.filter(o => o.pulled && o.why === 'spot'); if (lost.length) bad.push('held offers pulled for a spot: ' + lost.map(o => o.name).join(', '));
    const H = held.find(o => !o.pulled); if (H) { const S = colSpots(a, H.pid); if (S.left === 0 && recCommitWhyNot(a, H.pid)) bad.push('cannot commit to a held spot: ' + recCommitWhyNot(a, H.pid)); recPull(a, H, 'gpa'); if (R0.hold[H.pid] != null || colSpots(a, H.pid).held) bad.push('a pulled offer kept its hold'); }
    const card = (() => { const c = tRec(16, 3, 30, 3.2), n0 = c.events.length; recOfferRoll(c, amRng(c), 60); return c.events.slice(n0).map(e => (e.lines || []).join(' ')).join(' '); })(); if (!/hold[s]? a spot for you through Signing Day/.test(card)) bad.push('the offer card does not say so');
    return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : held.length + ' of ' + a.offers.length + ' offers held; none lost to a filled spot; a pulled one frees its spot';
  }), P);

  await R.step('deadlines (§8): a program whose last spot is about to go warns first, with the game it goes after; the deadline is true (the offer goes that week, not before)', () => ev(() => {
    const bad = [], out = []; let found = 0;
    for (let s = 20; s < 60 && found < 3; s++) { const a = tRec(s, 3, 16, 3.0), R0 = recOf(a), x = Math.log10(recProjRank(a));
      const P = COLLEGES.find(q => colSpots(a, q.id).left > 0 && colSpots(a, q.id, 1).left === 0 && !recTopTarget(q, x, colInterest(a, q.id) || 0) && (a.gpa || 0) >= recGpaFloor(q)); if (!P) continue; const o = tOffer(a, P.id); if (recHeld(a, P.id)) continue; found++;
      let warn = null, pull = null; a.league.week = 0;
      for (let y = 3; y <= 4 && !o.pulled; y++) { a.stageYear = y; a.league.week = 0; for (let w = 0; w < a.league.schedule.length && !o.pulled; w++) { const evs = tWeeks(a, 1); if (!warn && recWarned(a, o, 'spot') != null) { const l = evs.map(e => (e.lines || []).join(' ')).join(' '), m = l.match(/after game (\d+) of (this season|your (junior|senior) season)/); warn = { y, w: a.league.week, g: m ? +m[1] : null, txt: m ? m[0] : l.slice(0, 80) }; } if (o.pulled) pull = { y, w: a.league.week, why: o.why }; } }
      if (!pull) { out.push(P.name + ': spots never filled'); continue; } if (!warn) { bad.push(P.name + ': pulled with no warning'); continue; } if (pull.why !== 'spot') bad.push(P.name + ': pulled for ' + pull.why); if (warn.g == null) bad.push(P.name + ': a warning with no deadline: ' + warn.txt);
      else if (pull.y !== (warn.txt.includes('senior') ? 4 : warn.txt.includes('junior') ? 3 : warn.y) || pull.w !== warn.g) bad.push(P.name + ': "' + warn.txt + '" but it went after game ' + pull.w + ' (year ' + pull.y + ')');
      if (pull.y === warn.y && pull.w <= warn.w) bad.push(P.name + ': the warning came with the pull'); else out.push(P.name + ': warned at game ' + warn.w + ', "' + warn.txt + '", pulled after game ' + pull.w); }
    if (!found) bad.push('no unheld offer at a program that fills');
    return bad.length ? Promise.reject(new Error(bad.slice(0, 4).join('; '))) : out.join(' · ');
  }), P);

  await R.step('spots: named recruits commit through the junior and senior years and take them (the news says Spots left); your commitment takes one', () => ev(() => {
    const bad = [], a = tRec(24, 3, 20, 3.0); for (let y = 3; y <= 4; y++) { a.stageYear = y; a.league.week = 0; tWeeks(a, 11); } const news = (a.news || []).filter(n => /Spots left/.test(n.t || n.text || '')).length; if (!news) bad.push('no "Spots left" news');
    const b2 = tRec(25, 3, 20, 3.0); const Q = COLLEGES.find(P => colSpots(b2, P.id).left > 0 && colSpots(b2, P.id).total >= 2 && !recHeld(b2, P.id)); tOffer(b2, Q.id); const l0 = colSpots(b2, Q.id).left; recCommit(b2, Q.id); const S = colSpots(b2, Q.id); if (!S.mine || S.left !== l0 - 1) bad.push('commitment: mine ' + S.mine + ', left ' + l0 + '→' + S.left);
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : news + ' news items; a commitment takes a spot';
  }), P);

  await R.step('warnings, then pulls: grades under the line (report card to report card), a long injury, the academic condition at the senior finals (or met)', () => ev(() => {
    const bad = [], out = [];
    { const a = tRec(17, 3, 20, 3.0), P = COLLEGES.find(q => !q.academic && q.tier < 3), o = tOffer(a, P.id); a.gpa = 1.8; const l1 = recReportCard(a, 'mid'); if (o.pulled || !l1.some(l => /wants to see your grades/.test(l))) bad.push('grades: no warning first (' + l1.join(' / ') + ')'); recReportCard(a, 'end'); if (!o.pulled || o.why !== 'gpa') bad.push('grades: ' + (o.pulled ? o.why : 'not pulled')); else out.push('grades'); }
    { const a = tRec(18, 3, 14, 3.0), P = COLLEGES.filter(q => colSpots(a, q.id).left > 0 && (colInterest(a, q.id) || 0) >= 60 && (colInterest(a, q.id) || 0) < RCG.injuryKeep && a.gpa >= recGpaFloor(q))[0]; if (!P) bad.push('no program for the injury case'); else { const o = tOffer(a, P.id); recOf(a).earned[P.id] = 0; a.injury = { name: 'Sprained ankle', games: RCG.injuryGames + 4 }; tWeeks(a, 1); if (recWarned(a, o, 'injury') == null) bad.push('injury: no warning'); if (o.pulled) bad.push('injury: pulled at once'); tWeeks(a, RCG.injuryWeeks + 1); if (!o.pulled || o.why !== 'injury') bad.push('injury: ' + (o.pulled ? o.why : 'not pulled')); else out.push('injury'); } }
    for (const [g, want] of [[3.1, 'condition'], [3.4, 'met']]) { const a = tRec(19, 4, 20, g), P = COLLEGES.find(q => q.academic), o = tOffer(a, P.id); const l1 = recReportCard(a, 'mid'); if (g < 3.3 && !l1.some(l => /conditional/.test(l))) bad.push(g + ': no condition warning'); if (o.pulled) bad.push(g + ': pulled at the midterm'); recReportCard(a, 'end'); if (want === 'met' ? (o.pulled || !o.cond.met) : (!o.pulled || o.why !== 'condition')) bad.push(g + ': ' + (o.pulled ? 'pulled ' + o.why : o.cond.met ? 'met' : 'neither')); else out.push('academic at ' + g + ': ' + want); }
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : out.join(' · ');
  }), P);

  await R.step('scouts at big games (§8): a playoff game, senior night, the Boss or a ranked opponent brings programs (HOME and the pregame name them); the grade moves their interest; regular games and freshmen get none', () => ev(() => {
    const bad = [], out = [], g = HH.game, a = tJunior(31, 12), L = a.league, K = RCG.scouts, nx = amNext(a), opp = nx && nx.opp; if (!opp) return Promise.reject(new Error('no next game'));
    const plain = Object.assign({}, opp, { id: 'zz-plain' }); if (recBigGame(a, { opp: plain, playoff: 0 }, true)) bad.push('a regular game is big');
    for (const [po, kind] of [[1, 'po'], [3, 'state'], [6, 'final']]) { const k = recBigGame(a, { opp, playoff: po }, true); if (k !== kind) bad.push('round ' + po + ': ' + k); L.scouts = null; const S = recScoutsNext(a, { opp, playoff: po }, true); if (!S || S.ids.length !== K.n[kind]) bad.push(kind + ': ' + (S ? S.ids.length : 0) + ' programs (want ' + K.n[kind] + ')'); else if (S.ids.some(id => (colInterest(a, id) || 0) < K.min)) bad.push(kind + ': a program under interest ' + K.min); }
    L.scouts = null; L.seniorNight = L.week; const S = recScoutsNext(a); if (!S || S.kind !== 'senior') return Promise.reject(new Error('senior night: ' + JSON.stringify(S) + ' ' + bad.join('; ')));
    const H = amHubData(g, a); if (!H.opp || !H.opp.scouts || H.opp.scouts.key !== S.key) bad.push('HOME has no scouts');
    g.hubTab = 'home'; g.ui.clearTo(amHub(g)); const th = tStr(g); if (!/Scouts( here)?: /.test(th) || !/SCOUTS \d/.test(th)) bad.push('HOME does not name them');
    g.ui.push(amPregameScreen(g)); const tp = tStr(g); for (const id of S.ids) if (!tp.includes(colProg(id).name)) bad.push('the pregame misses ' + colProg(id).name); if (!/Scouts here/i.test(tp)) bad.push('no "Scouts here" on the pregame');
    const v0 = S.ids.map(id => recOf(a).earned[id] || 0), r = amSimGame(a); a.events.length = 0; const d = (K.byGrade[r.grade] || 0) + (r.won ? K.win : 0);
    S.ids.forEach((id, i) => { const got = (recOf(a).earned[id] || 0) - v0[i], want = clamp(v0[i] + d, 0, RCG.earnedMax) - v0[i]; if (got !== want) bad.push(colProg(id).name + ' +' + got + ' (grade ' + r.grade + ', want ' + want + ')'); });
    if (!r.scouts || !/^Scouts from /.test(r.scouts)) bad.push('the result has no scouts line'); else { g.ui.clearTo(amHub(g)); g.ui.push(gameResultScreen(g, a, Object.assign({}, r, { us: r.my, them: r.their }), null, 'amresult', () => g.ui.pop())); if (!tStr(g).includes('Scouts from')) bad.push('the result screen misses the line'); out.push(r.scouts); }
    const f = tRec(32, 1, 20, 3.0); f.league.seniorNight = f.league.week; ladderInit(f, 1); if (recScoutsNext(f)) bad.push('a freshman got scouts');
    return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : out.join(' · ') + ' · rounds: ' + K.n.po + '/' + K.n.state + '/' + K.n.final + ' programs';
  }), P);

  await R.step('the summer (§8): each event has its programs (the Summer Jam near home, the national ones the top); your scout names them (without one: a scout would know); playing moves their interest by your place; the Grassroots Finals and the Elite Camp invite, and a Lv3 scout gets you in', () => ev(() => {
    const bad = [], out = [], g = HH.game, a = tJunior(41, 4), Sm = RCG.summer;
    for (const key of ['aau1', 'aau2', 'aau3', 'camp']) { const ids = recEventProgs(a, key); if (ids.length !== Sm.n[key]) bad.push(key + ': ' + ids.length + ' programs'); for (const id of ids) { const P = colProg(id); if (key === 'aau1' && !(P.tier <= 1 && colMiles(a, P) <= Sm.nearMi)) bad.push('aau1: ' + P.name + ' tier ' + P.tier + ' at ' + colMiles(a, P) + ' mi'); if ((key === 'aau3' || key === 'camp') && P.tier < 2) bad.push(key + ': ' + P.name + ' tier ' + P.tier); } }
    a.recruit = { stars: 2, nat: 1500, score: 50 }; a.log.forEach(e => { e.prk = 0; }); if (a.rk && a.rk.P && a.rk.P.me) a.rk.P.me.r = 0; hsSummerStart(a); let E = hsSummerEvents(a); const e3 = E.find(e => e.key === 'aau3'), ec = E.find(e => e.key === 'camp'); if (e3.ok) bad.push('a 2★ unranked player invited to the Grassroots Finals: ' + e3.why); if (ec.ok) bad.push('invited to the Elite Camp: ' + ec.why);
    g.sumPick = null; g.ui.clearTo(amHub(g)); g.ui.push(summerScreen(g)); g.sumPick.sel = 'aau1'; let tx = tStr(g); if (!/A scout \(your crew/.test(tx)) bad.push('no "a scout would know" without one');
    a.cash = 1e5; a.credits = 100; /* 4.0 (§0.4): a hire costs credits */ const cs = crewCandidates(a, 'scout'); if (!cs || !cs.length || !crewHire(a, cs[0])) return Promise.reject(new Error('no scout to hire: ' + bad.join('; '))); const M = crewMember(a, 'scout'); M.lv = 2; M.yrs = 0; E = hsSummerEvents(a); if (E.find(e => e.key === 'aau3').ok) bad.push('a Lv2 scout got the invite');
    M.lv = 3; E = hsSummerEvents(a); const e3b = E.find(e => e.key === 'aau3'), ecb = E.find(e => e.key === 'camp'); if (!e3b.ok || !/scout/.test(e3b.why)) bad.push('Lv3: no Grassroots invite (' + e3b.why + ')'); if (!ecb.ok || !/scout/.test(ecb.why)) bad.push('Lv3: no Elite Camp invite (' + ecb.why + ')');
    g.ui.clearTo(amHub(g)); g.ui.push(summerScreen(g)); g.sumPick.sel = 'aau3'; tx = tStr(g).replace(/ \| /g, ' '); /* (a name can wrap) */ for (const id of recEventProgs(a, 'aau3')) if (!tx.includes(colProg(id).name.replace(/ University$/, ''))) bad.push('the scout\'s read misses ' + colProg(id).name);
    const ids = recEventProgs(a, 'aau3'), e0 = ids.map(id => recOf(a).earned[id] || 0); hsSummerGo(a, 'rest', ['aau3']); const T = tnState(a).list.find(t => t.key === 'aau3' && !t.done); if (!T || !Array.isArray(T.prog) || T.prog.join() !== ids.join()) bad.push('the tournament has no programs'); else { tnSimAll(a, T); const row = Sm.byPlace.find(r => T.my.place <= r[0]); ids.forEach((id, i) => { const got = (recOf(a).earned[id] || 0) - e0[i], want = Math.min(RCG.earnedMax, e0[i] + row[1]) - e0[i]; if (got !== want) bad.push(colProg(id).name + ' +' + got + ' (place ' + T.my.place + ', want +' + want + ')'); }); if (!(T.my.rw || []).some(l => /^interest \+\d+ at \d+ programs?$/.test(l))) bad.push('the rewards miss the programs: ' + (T.my.rw || []).join(' · ')); if (!recOf(a).log.some(e => / watched \(interest \+/.test(e.text))) bad.push('the log misses the programs'); out.push('the Grassroots Finals: #' + T.my.place + ', ' + ids.length + ' programs +' + row[1]); }
    a.events.length = 0; return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : out.join(' · ') + ' · invites: none for a 2★, both with a Lv3 scout';
  }), P);

  await R.step('camps and visits: a camp ($250: +10 there, +3 across its conference, a showcase); an unofficial visit takes the week; official visits (5, from interest 50) are one summary each (playing time, NIL, facilities, academics, the coach\'s style; no choices) and show the facilities', () => ev(() => {
    const bad = [], a = tRec(50, 3, 18, 3.0), R0 = recOf(a), byV = COLLEGES.slice().sort((p, q) => (colInterest(a, q.id) || 0) - (colInterest(a, p.id) || 0));
    const C = byV[12], conf = colMembers(C.conf).find(q => q.id !== C.id); a.cash = 100; if (recCamp(a, C.id, amRng(a))) bad.push('a camp without the money'); a.cash = 1000; const ec = R0.earned[conf.id] || 0, ev0 = a.events.length; const cr = recCamp(a, C.id, amRng(a)); if (!cr) bad.push('camp refused: ' + recWhyNot(a, 'camp', C.id)); else { if (a.cash !== 1000 - RCG.camp.cost) bad.push('camp cost ' + (1000 - a.cash)); if ((R0.earned[C.id] || 0) < RCG.camp.gain) bad.push('camp +' + R0.earned[C.id]); if ((R0.earned[conf.id] || 0) - ec !== RCG.camp.conf) bad.push('conference +' + ((R0.earned[conf.id] || 0) - ec)); if (a.events.length !== ev0 + 1 || !/CAMP/.test(a.events[a.events.length - 1].title)) bad.push('no camp card'); }
    a.events.length = 0; const U = byV[13]; a.wk = null; if (!recUnofficial(a, U.id) || (a.wk && a.wk.done) !== 'visit' || (R0.earned[U.id] || 0) < RCG.unofficial) bad.push('unofficial: week ' + (a.wk && a.wk.done) + ', +' + R0.earned[U.id]);
    a.wk = null; const low = byV.find(P => (colInterest(a, P.id) || 0) < RCG.official.from); if (low && recOfficial(a, low.id)) bad.push('an official visit under interest ' + RCG.official.from); const O = byV[0]; if (recRevealed(a, O.id)) bad.push('revealed before the visit'); const n0 = a.events.length; if (!recOfficial(a, O.id)) bad.push('official refused: ' + recWhyNot(a, 'official', O.id)); if (!recRevealed(a, O.id)) bad.push('not revealed after the visit');
    const sc = a.events.slice(n0); if (sc.length !== 1 || sc[0].choice || !/OFFICIAL VISIT/.test(sc[0].title)) bad.push('the visit: ' + sc.length + ' cards ' + (sc[0] && sc[0].title)); else { const t = [sc[0].text].concat(sc[0].lines).join(' '); for (const k of ['Playing time', 'NIL market', 'facilities', 'academics', COL_SYS[colCoach(a, O.id).sys] ? 'Coach' : 'Coach']) if (!t.includes(k)) bad.push('the summary misses ' + k); }
    a.events.length = 0; R0.off = byV.slice(1, 1 + RCG.official.max).map(P => P.id); if (recOfficial(a, byV[8].id) || !/All 5/.test(recWhyNot(a, 'official', byV[8].id) || '')) bad.push('a sixth official visit');
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : 'camp, unofficial, official (one summary), the limit of five all hold';
  }), P);

  await R.step('a verbal commitment and a flip: the flip costs fame, pulls the old offer, cools most programs, and your next coach remembers (trust −10)', () => ev(() => {
    const bad = [], a = tRec(61, 3, 22, 3.0), live = recOfferRoll(a, amRng(a), 60); a.events.length = 0; if (live.length < 2) return Promise.reject(new Error('offers ' + live.length));
    const [o1, o2] = live; recCommit(a, o1.pid); a.fame = 40; const R0 = recOf(a), q = COLLEGES.find(P => !recFlipFriendly(a, P.id) && P.id !== o1.pid && P.id !== o2.pid), f = COLLEGES.find(P => recFlipFriendly(a, P.id) && P.id !== o1.pid && P.id !== o2.pid); R0.earned[q.id] = 20; if (f) R0.earned[f.id] = 20;
    const r = recCommit(a, o2.pid); if (!r) bad.push('no flip'); if (a.fame !== 40 - RCG.flip.fame) bad.push('fame ' + a.fame); if (!o1.pulled || o1.why !== 'flip') bad.push('old offer ' + (o1.pulled ? o1.why : 'live')); if (R0.earned[q.id] !== 20 - RCG.flip.hurt) bad.push('a program that dislikes a flip: ' + R0.earned[q.id]); if (f && R0.earned[f.id] !== 20 + RCG.flip.like) bad.push('a flip-friendly program: ' + R0.earned[f.id]);
    a.events.length = 0; a.stageYear = 4; recSigningDay(a, amRng(a)); a.events.length = 0; const o = a.decision.offers.find(x => x.pid === o2.pid); amChooseCollege(a, o); const T = a.team && a.team.trust; a.events.length = 0;
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'fame −' + RCG.flip.fame + ', old offer pulled, ±interest · coach trust at arrival ' + Math.round(T) + ' (the flip: −' + RCG.flip.trust + ')';
  }), P);

  await R.step('the coaching carousel: a committed program\'s coach can leave (15%); follow them (no flip), stay, or reopen (no cost); the moved coach is the new program\'s', () => ev(() => {
    const bad = [], res = { follow: 0, stay: 0, reopen: 0 }; let n = 0, hits = 0;
    for (const kind of ['follow', 'stay', 'reopen']) { let done = false; for (let s = 70; s < 400 && !done; s++) { const a = tRec(s, 3, 22, 3.0); const f = recOfferRoll(a, amRng(a), 60).filter(o => recCarouselWill(a, o.pid)); a.events.length = 0; if (!f.length) continue; const o = f[0]; recCommit(a, o.pid); const R0 = recOf(a); if (!R0.carousel || R0.carousel.pid !== o.pid) { bad.push('not scheduled'); break; }
      a.fame = 30; R0.carousel.at = R0.t; const evx = tWeeks(a, 1).find(e => e.rec && e.rec.carousel); if (!evx) { bad.push('no carousel card'); break; } const i = evx.choice.findIndex(c => c.rec && c.rec.car === kind); if (i < 0) { if (kind === 'follow') continue; bad.push('no ' + kind + ' choice'); break; }
      const mv = colWorld(a).moves.slice(-1)[0]; msgChoose(a, evx, i); a.events.length = 0;
      if (kind === 'follow') { if (!R0.commit || R0.commit.pid !== mv.to) bad.push('follow: committed to ' + (R0.commit && R0.commit.pid)); if (colCoach(a, mv.to).name !== mv.coach.name) bad.push('the coach is not at ' + mv.to); if (a.fame !== 30) bad.push('follow cost fame'); }
      if (kind === 'stay' && (!R0.commit || R0.commit.pid !== o.pid)) bad.push('stay lost the commitment'); if (kind === 'reopen' && (R0.commit || a.fame !== 30)) bad.push('reopen: ' + (R0.commit ? 'still committed' : 'fame ' + a.fame));
      res[kind]++; done = true; } }
    for (let s = 400; s < 1000; s++) { n++; if (colRngFor({ seed: s, season: 1 }, 'royaloak:carousel').next() < RCG.carousel) hits++; }
    return bad.length ? Promise.reject(new Error(bad.slice(0, 4).join('; '))) : JSON.stringify(res) + ' · a program\'s coach leaves in ' + Math.round(100 * hits / n) + '% of careers (' + Math.round(RCG.carousel * 100) + '%)';
  }), P);

  await R.step('Signing Day: your live offers (the commitment first) and the pros if you\'re good enough; signing is binding; a hat for every program that ever offered (pulled ones too)', () => ev(() => {
    const bad = [], a = tRec(91, 4, 30, 3.4), g = HH.game; recOfferRoll(a, amRng(a), 80); a.events.length = 0; const live = a.offers.filter(o => !o.pulled); recPull(a, live[live.length - 1], 'spot'); const cm = live[1]; recCommit(a, cm.pid); a.events.length = 0;
    recSigningDay(a, amRng(a)); a.events.length = 0; const d = a.decision; if (!d || !d.signing) bad.push('no Signing Day decision'); if (d.offers[0].pid !== cm.pid) bad.push('the commitment is not first'); if (d.offers.some(o => o.pulled)) bad.push('a pulled offer to sign');
    g.ui.clearTo(amHub(g)); g.ui.push(amDecisionScreen(g)); if (g.ui.screen.name !== 'signing') bad.push('screen ' + g.ui.screen.name);
    const hats = recHats(a).length; amChooseCollege(a, d.offers[0]); const ce = a.events.find(e => e.kind === 'commit'); if (!ce || ce.title !== 'SIGNING DAY' || !ce.signing) bad.push('commit event ' + (ce && ce.title)); if (ce.offers.length !== hats || hats !== a.offers.length) bad.push('hats ' + ce.offers.length + ' vs ' + hats + ' vs ' + a.offers.length); if (a.stage !== 'college' || !recOf(a).commit.signed) bad.push('not binding');
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : hats + ' hats (' + a.offers.filter(o => o.pulled).length + ' pulled offers among them) · signed with ' + a.college;
  }), P);

  await R.step('no offer (§8): the NO OFFERS card names the roads; a walk-on (a program whose GPA line you meet, no scholarship, the bottom of the depth chart); a prep year (once: dominate it and a star comes back)', () => ev(() => {
    const bad = [], out = [];
    { const a = tNone(101); const card = a.events.find(e => e.title === 'NO OFFERS'); if (!card) bad.push('no NO OFFERS card'); else { const t = card.lines.join(' '); for (const k of ['walk-on', 'prep year', 'junior college', 'a club abroad']) if (!t.includes(k)) bad.push('the card misses ' + k); } a.events.length = 0; if (!a.decision.none || !a.decision.prepOk) bad.push('none ' + a.decision.none + ' prepOk ' + a.decision.prepOk);
      const blue = COLLEGES.find(P => P.tier === 3); if (!recWalkOnWhyNot(a, blue.id)) bad.push('a walk-on under the blue bloods\' line'); const W = COLLEGES.find(P => !recWalkOnWhyNot(a, P.id)); recWalkOn(a, W.id); a.events.length = 0; const L = a.team && a.team.ladder; if (a.stage !== 'college' || a.scholarship !== 'walkon') bad.push('walk-on: ' + a.stage + ' ' + a.scholarship); if (!L || L.indexOf('me') !== L.length - 1) bad.push('not at the bottom: ' + JSON.stringify(L)); else out.push('walk-on at ' + W.name + ', #' + L.length + ' of ' + L.length); }
    { const a = tRec(102, 4, -14, 2.2); a.offers = [colOfferFrom(a, COLLEGES[60], 'x')]; a.offers[0].pulled = true; recSigningDay(a, amRng(a)); a.events.length = 0; const s0 = a.recruit.stars, sc0 = a.school; if (!recPrepYear(a, amRng(a))) bad.push('no prep year'); a.events.length = 0; if (a.stage !== 'hs' || a.school === sc0 || !a.prep) bad.push('prep: ' + a.stage + ' ' + a.school);
      const L = a.league; L.me = L.me || {}; L.me.w = RCG.prep.minGames + 2; L.me.l = 0; recPrepCheck(a); const und = a.events.find(e => e.title === 'THE UNDERDOG'); a.events.length = 0; if (!a.prep.bonus || !und) bad.push('dominating the prep year: no bonus'); else if (a.recruit.stars !== Math.min(5, s0 + 1)) bad.push('prep year: ' + s0 + '★ → ' + a.recruit.stars + '★'); else out.push('prep year: ' + s0 + '★ → ' + a.recruit.stars + '★');
      a.offers = []; a.stageYear = 4; recSigningDay(a, amRng(a)); a.events.length = 0; if (a.decision.prepOk) bad.push('a second prep year'); if (jucoWhyNot(a)) bad.push('no junior college after the prep year: ' + jucoWhyNot(a)); }
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : out.join(' · ');
  }), P);

  await R.step('junior college (§8): a season in the JUCO Conference (twelve players); transfer offers by the finish (top 3: three, one from a power program; top 6: two; top 9: one; else none); signing makes you a sophomore (a junior after a second season, the last); the credits lift the GPA', () => ev(() => {
    const bad = [], out = [], a = tNone(103, -14, 1.6);
    if (!jucoWhyNot(tRec(104, 4, 20, 3.0)) && tRec(104, 4, 20, 3.0).decision) bad.push('JUCO with offers');
    if (!jucoGo(a)) return Promise.reject(new Error('no junior college: ' + jucoWhyNot(a)));
    const L = a.league; if (a.stage !== 'juco' || !L || L.format !== 'juco' || L.opps.length !== AMC.stages.juco.size - 1) bad.push('the league: ' + a.stage + ' ' + (L && L.format) + ' ' + (L && L.opps.length)); if (amStageMean(a) !== AMC.stageMean.juco) bad.push('the level ' + amStageMean(a)); if (!/^JUCO year 1/.test(amStageLabel(a))) bad.push('label ' + amStageLabel(a)); if ((teamLevel(a) || {}).chip !== 'JUCO') bad.push('chip ' + JSON.stringify(teamLevel(a)));
    a.juco.seasons = 1; for (const [place, n, tier] of [[2, 3, 2], [5, 2, 1], [8, 1, 0], [11, 0, null]]) { const O = jucoOffers(a, { rank: place }); if (O.length !== n) bad.push('#' + place + ': ' + O.length + ' offers'); if (n && Math.max(...O.map(o => o.tier)) !== tier) bad.push('#' + place + ': top tier ' + Math.max(...O.map(o => o.tier))); if (O.some(o => o.juco !== 1 || o.academic)) bad.push('#' + place + ': ' + JSON.stringify(O.map(o => [o.juco, o.academic]))); }
    if (jucoOffers(a, { rank: 9, champ: true }).length !== 3) bad.push('a champion is first');
    a.juco.seasons = 0; tSeason(a); const d = a.decision, e = a.log[a.log.length - 1]; if (!d || !d.juco || !d.signing) return Promise.reject(new Error('no transfer decision: ' + JSON.stringify(d) + ' ' + bad.join('; ')));
    const want = (RCG.juco.offers.find(r => (e.champ ? 1 : e.rank) <= r[0]) || [0, 0])[1]; if (d.offers.filter(o => !o.draft).length !== want) bad.push('a #' + e.rank + ' finish: ' + d.offers.length + ' offers (want ' + want + ')'); if ((a.gpa || 0) < RCG.juco.gpa) bad.push('GPA ' + a.gpa); out.push('#' + e.rank + (e.champ ? ' (champion)' : '') + ': ' + d.offers.filter(o => !o.draft).length + ' offers');
    if (!d.more || jucoWhyNot(a)) bad.push('no second season'); jucoGo(a); if (a.stage !== 'juco' || a.stageYear !== 2) bad.push('second season: ' + a.stage + ' ' + a.stageYear); tSeason(a); const d2 = a.decision; if (!d2 || d2.more || !jucoWhyNot(a)) bad.push('a third JUCO season');
    let list = d2.offers.filter(o => !o.draft); if (!list.length) { a.decision.offers.unshift(Object.assign(colOfferFrom(a, COLLEGES.find(P => P.tier === 0), 'juco'), { juco: 2 })); list = a.decision.offers.filter(o => !o.draft); }
    amChooseCollege(a, list[0]); a.events.length = 0; if (a.stage !== 'college' || a.stageYear !== 3) bad.push('after two JUCO seasons: ' + a.stage + ' year ' + a.stageYear); else out.push('signed after two seasons: college year 3 at ' + a.college);
    const b2 = tNone(105, -14, 1.6); jucoGo(b2); tSeason(b2); b2.decision.offers.unshift(Object.assign(colOfferFrom(b2, COLLEGES.find(P => P.tier === 1), 'juco'), { juco: 1 })); amChooseCollege(b2, b2.decision.offers[0]); b2.events.length = 0; if (b2.stageYear !== 2) bad.push('a one-season JUCO transfer: year ' + b2.stageYear); else out.push('one season: a sophomore');
    return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : out.join(' · ');
  }), P);

  await R.step('a club abroad (§8): from Signing Day with no offer, a youth contract (the youth level, a smaller bonus); a top-3 season or two seasons bring the PBL\'s combine', () => ev(() => {
    const bad = [], g = HH.game, a = tNone(106, -6, 2.2); a.events.length = 0; g.ui.clearTo(amHub(g)); g.ui.push(ovsOffersScreen(g, true)); const s = g.ui.screen; if (!/A youth contract/.test(tStr(g))) bad.push('no youth contract on the screen');
    const signB = s.widgets.find(w => /^SIGN WITH/.test(w.label || '')); if (!signB) return Promise.reject(new Error('no sign button')); const cash0 = a.cash || 0; signB.onPress(); a.events.length = 0;
    if (a.stage !== 'overseas' || !a.ovs || !a.ovs.youth) bad.push('not abroad on a youth contract: ' + a.stage); if (amStageMean(a) !== OVS.youth.mean) bad.push('the level ' + amStageMean(a)); const bonus = (a.cash || 0) - cash0; if (!(bonus > 0 && bonus <= 50000 * OVS.youth.pay)) bad.push('the bonus ' + bonus);
    let guard = 0; while (a.stage === 'overseas' && guard++ < 80) { a.events.length = 0; if (a.decision) break; amSimGame(a); } if (a.stage !== 'combine' || !a.ovs.done) bad.push('after abroad: ' + a.stage + ' (seasons ' + a.ovs.seasons + ')');
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'abroad ' + a.ovs.seasons + ' season' + (a.ovs.seasons > 1 ? 's' : '') + (a.ovs.top ? ' (a top-3 finish)' : '') + ', then the combine · bonus $' + bonus;
  }), P);

  await R.step('the College test: a heads-up early in the junior season, then the test after week 6 (three Study weeks: GPA +0.15; one or two: +0.05; none: −0.10)', () => ev(() => {
    const bad = [], out = [];
    for (const [n, want] of [[3, RCG.test.up], [1, RCG.test.some], [0, RCG.test.down]]) { const a = tRec(110 + n, 3, 10, 3.0); a.league.week = 0; let note = 0, test = null; for (let w = 1; w <= RCG.test.week; w++) { a.league.week = w; recWeek(a, amRng(a), w <= n ? 'study' : 'practice'); for (const e of a.events.splice(0)) { if (e.title === 'THE COLLEGE TEST' && !test && !recOf(a).test) note++; if (e.title === 'THE COLLEGE TEST' && recOf(a).test) test = e; } }
      const T = recOf(a).test; if (!note) bad.push(n + ': no heads-up'); if (!T) { bad.push(n + ': no test'); continue; } if (Math.abs(T.d - want) > 1e-9) bad.push(n + ' study weeks: ' + T.d); else out.push(n + ' → ' + (T.d > 0 ? '+' : '') + T.d.toFixed(2)); }
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : out.join(', ');
  }), P);

  await R.step('the college list (§8): a simple ranked list (rank, stars, conference, interest); tap a row for the program', () => ev(() => {
    const bad = [], g = HH.game, a = tRec(115, 3, 18, 3.0); g.ui.clearTo(amHub(g)); g.ui.push(collegeBrowserScreen(g)); const s = g.ui.screen, tx = tStr(g);
    for (const h of ['PROGRAM', 'CONFERENCE', 'STARS', 'INTEREST']) if (!tx.includes(h)) bad.push('no ' + h + ' column');
    const L = colRankList(); for (let i = 1; i < L.length; i++) if (colStarsNow(L[i]) > colStarsNow(L[i - 1])) { bad.push('not ranked at ' + i); break; }
    const row = (s.widgets || []).find(w => w.kind === 'custom' && w.prog && !w.hidden); if (!row) bad.push('no rows'); else { const id = row.prog.id; row.onPress(); if (g.ui.screen.name !== 'colprogram') bad.push('a row opened ' + g.ui.screen.name); else if (!tStr(g).includes(colProg(id).name)) bad.push('the page is not the program\'s'); }
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : L.length + ' programs by stars; a row opens its page';
  }), P);

  await R.step('screens (desktop): the Recruit tab, a program\'s page, the action sheet, Offers & rank, the log, the college list, Signing Day (offers; none: the roads), walk-on, play abroad, junior college (HOME, the league, the transfer offers), scouts on HOME, the pregame and the result, the summer with a scout and without: no cut or overlapping text', () => ev(() => {
    const g = HH.game, bad = []; let n = 0; for (const [name, setup] of tScreens()) { const open = setup(); tLook(g, name, open, bad, false); n++; }
    return bad.length ? Promise.reject(new Error(bad.slice(0, 8).join('; '))) : n + ' screens clean';
  }), P);

  await R.step('the Codex: Colleges & recruiting covers interest, how you play, offers, holds and deadlines, scouts at big games, the summer events, commitment and Signing Day, junior college and abroad, the College test (no undefined or NaN); ? on the recruiting screens opens it', () => ev(() => {
    const g = HH.game, bad = [], a = tRec(125, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; const E = guideEntries(g, 'colleges'), T = E.map(e => e.title), all = JSON.stringify(E);
    for (const t of ['Interest in you', 'Offers', 'Scholarship spots', 'Scouts at big games', 'Summer events and your scout', 'Camps and visits', 'Commitment and Signing Day', 'Junior college and abroad', 'The College test']) if (!T.includes(t)) bad.push('no ' + t); if (/undefined|NaN|\[object/.test(all)) bad.push('undefined/NaN'); for (const k of ['player rankings', 'holds a spot', 'deadline', 'JUCO']) if (!all.includes(k)) bad.push('the Codex never says ' + k);
    const o = a.offers[0]; for (const [tag, open] of [['actions', () => g.ui.push(recActionScreen(g, o.pid))], ['log', () => g.ui.push(recLogScreen(g))], ['offers', () => g.ui.push(recruitingScreen(g))], ['list', () => g.ui.push(collegeBrowserScreen(g))]]) { g.ui.clearTo(amHub(g)); open(); const t = codexTopicFor(g, g.ui.screen); if (t !== 'colleges') bad.push(tag + ' → ' + t); }
    const b2 = tNone(126); a.events.length = 0; for (const [tag, open] of [['signing', () => g.ui.push(amDecisionScreen(g))], ['walk-on', () => g.ui.push(recWalkOnScreen(g))], ['abroad', () => g.ui.push(ovsOffersScreen(g, true))]]) { g.ui.clearTo(amHub(g)); open(); const t = codexTopicFor(g, g.ui.screen); if (t !== 'colleges') bad.push(tag + ' → ' + t); }
    g.ui.clearTo(amHub(g)); g.ui.push(statsGuideScreen(g, 'colleges')); const F = tFaults(g); if (F.length) bad.push('the page: ' + F.slice(0, 3).join(' | '));
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : E.length + ' entries; seven screens point at it';
  }), P);

  await R.step('old saves: a high school save from before 3.0 (no holds, no scouts, no recruiting state) goes on, and an old college decision keeps its offer board', () => ev(() => {
    const bad = [], g = HH.game, a = tRec(130, 3, 18, 3.0); delete a.rec; a.offers = [{ name: 'Pine Ridge College', tier: 1, colors: ['#123456', '#FFFFFF'], coach: 'Coach Old', focus: 'shooting', fac: 2, visited: false, gpaReq: 2.0, when: 'junior' }];
    const raw = JSON.parse(JSON.stringify(a)); delete raw.league.scouts; g.save.data.c1 = raw; let v; try { v = colInterest(raw, COLLEGES[0].id); tWeeks(raw, 2); recScoutsNext(raw); g.ui.clearTo(amHub(g)); tTexts(g); } catch (e) { bad.push('threw: ' + e.message); } if (!raw.rec || !(v >= 0) || !raw.rec.hold) bad.push('no recruiting state'); if (!raw.offers.length) bad.push('old offer lost');
    const b = tRec(131, 4, 18, 3.0); b.decision = { kind: 'college', offers: [{ name: 'Pine Ridge College', tier: 1, colors: ['#123456', '#FFFFFF'], coach: 'Coach Old', focus: 'shooting', fac: 2 }], visits: 2 }; g.save.data.c1 = b; g.ui.clearTo(amHub(g)); g.ui.push(amDecisionScreen(g)); if (g.ui.screen.name !== 'recruit') bad.push('old decision: ' + g.ui.screen.name);
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'an old junior goes on; an old decision keeps its board';
  }), P);
  if (P.errors.length) console.log('page errors:', P.errors.slice(0, 5));

  // phones: the same screens at 844×390 (64 px targets, nothing cut)
  const Q = await openPage(b, { wait: 900, phone: true }); await Q.ev(src => { (0, eval)(src); window.HH_NO_TIPS = true; }, LIB);
  await R.step('screens (phone): the same screens: 64 px targets, no cut or overlapping text', () => Q.ev(() => {
    const g = HH.game, bad = []; let n = 0; for (const [name, setup] of tScreens()) { const open = setup(); tLook(g, name, open, bad, true); n++; }
    tLook(g, 'codex', () => g.ui.push(statsGuideScreen(g, 'colleges')), bad, true);
    return bad.length ? Promise.reject(new Error(bad.slice(0, 8).join('; '))) : (n + 1) + ' screens clean';
  }), Q);
  if (Q.errors.length) console.log('phone page errors:', Q.errors.slice(0, 5));
  await b.close();

  // the §8 table: 600 careers
  if (process.env.REC8 !== '0') await R.step('the §8 table (600 careers, --hsOnly --spread=12): the Top 50 get 8+ offers including a top program (a blue blood where the GPA allows); a 3★ 2–4; a 1★ may get none, then junior college, a club abroad or a walk-on', async () => {
    const H = await runTable(+(process.env.REC8N || 150), [1, 2, 3, 4]), T = rec8(H), row = b2 => T.rows.find(r => r.band === b2), bad = [], top = row('Top 50'), s3 = row('3★'), s1 = row('1★');
    console.log('  ' + T.rows.map(r => r.band + ': n ' + r.n + ', ' + r.mean.toFixed(1) + ' offers (median ' + r.med + ', none ' + r.none + '%' + (r.band === 'Top 50' ? ', 8+ ' + r.eight + '%, a power or blue blood ' + r.top + '%, a blue blood at GPA 2.5+ ' + r.blue + '% of ' + r.nBlue : '') + (r.band === '3★' ? ', 2–4 ' + r.twoFour + '%' : '') + ')').join('\n  ') + '\n  roads with none: ' + JSON.stringify(T.roads) + ' · held ' + T.held + ' a career · pulled ' + T.pulled + ' ' + JSON.stringify(T.why));
    if (H.length < 500) bad.push('careers ' + H.length); if (!(top.med >= 8) || top.eight < 75) bad.push('Top 50: median ' + top.med + ', 8+ ' + top.eight + '%'); if (top.top < 90) bad.push('Top 50: a top program ' + top.top + '%'); if (top.nBlue >= 20 && top.blue < 50) bad.push('Top 50 at GPA 2.5+: a blue blood ' + top.blue + '%');
    if (!(s3.mean >= 2 && s3.mean <= 4) || !(s3.med >= 2 && s3.med <= 4)) bad.push('3★: ' + s3.mean.toFixed(1) + ' (median ' + s3.med + ')'); if (!(s1.none > 0)) bad.push('1★: every one got an offer'); for (const k of ['juco', 'overseas', 'walkon']) if (!T.roads[k]) bad.push('no ' + k + ' with none');
    if (bad.length) throw new Error(bad.join('; ')); return 'Top 50 median ' + top.med + ' (8+ ' + top.eight + '%) · 3★ ' + s3.mean.toFixed(1) + ' · 1★ none ' + s1.none + '% · roads ' + JSON.stringify(T.roads);
  });
  process.exit(R.done() ? 1 : 0);
})();
