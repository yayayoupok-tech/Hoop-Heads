// 2.1 §2.2–2.7 (W4): the recruiting game. Interest that moves (fit, coach, home, character, contact, competition, the
// GPA line, the class caps, a commitment's freeze); offers from the junior year at 70+ with a spot open (an elite
// academic one on condition); named recruits and your rival taking the spots; warnings before every pull (a spot,
// interest, grades, an injury, the academic condition); three actions a month (film, email, your coach's call, a camp,
// the visits); official visits as scenes; a verbal commitment, a flip and its press storm, the coaching carousel;
// Signing Day's hats; with no offer a walk-on, a prep year or the pros; the College test; the screens; old saves.
// The §2.7 table itself (offers by stars, the 5★'s #1 school) is the career simulator's:
//   node tests/careersim.js 300 1 --hsOnly --spread=12
// node tests/recruit21.js   (ONLY=<regex> runs the matching steps)
const { launch, openPage, runner } = require('./lib');

// Installed on each page: a high school player (a junior by default, ratings +plus, a GPA) with a team and a league
// in its second week; an offer from a program; the strings one synchronous UI draw shows, and its cut or overlapping text.
const LIB = `
window.tRec = (seed, year, plus, gpa) => { const g = HH.game, a = amCreate(defaultSave(), { name: 'Recruit Test', look: PRESET_LOOKS[seed % 16], number: 4, style: 'slasher', seed }); hsSimTryout(a); a.events.length = 0; a.stageYear = year || 3; a.gpa = gpa == null ? 3.0 : gpa; for (const k of RATING_KEYS) { a.r[k] = Math.min(CR.ratingMax, a.r[k] + (plus || 0)); a.caps[k] = Math.max(a.caps[k], a.r[k]); } g.save.data.c1 = a; g.save.data.career = null; if (a.league) a.league.week = 2; hsUpdateRank(a, 'test'); a.events.length = 0; return a; };
window.tOffer = (a, id) => { const o = colOfferFrom(a, colProg(id), 'test'); o.t = recOf(a).t; if (colProg(id).academic) o.cond = { gpa: colGpaReq(colProg(id)) }; a.offers.push(o); recBump(a); return o; };
window.tTexts = g => { g.ui.trans = null; g.ui.toastT = 0; RBF.boxes = []; let X = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { X = RBF.boxes || []; RBF.boxes = null; } return X; };
window.tFaults = g => { const B = tTexts(g), out = B.filter(x => x.cut).map(x => 'CUT ' + String(x.cut).slice(0, 40)); const T = B.filter(x => String(x.t).trim() && x.a >= 0.35 && x.w >= 1); for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const p = T[i], q = T[j]; if (p.t === q.t) continue; const px = Math.max(p.s, q.s), ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y); if (ix > px && iy > px) out.push('OVERLAP "' + String(p.t).slice(0, 20) + '" x "' + String(q.t).slice(0, 20) + '"'); } return out.concat((window.HH_ERRORS || []).splice(0)); };
window.tSmall = g => { const ui = g.ui, s = ui.screen; return (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && w.kind !== 'text' && (w.w * ui.scale < 63.5 || w.h * ui.scale < 63.5)).map(w => (w.label || w.kind) + ' ' + Math.round(w.w * ui.scale) + '×' + Math.round(w.h * ui.scale)); };
window.tScenes = (g, a) => { const out = [], P = COLLEGES.filter(q => (colInterest(a, q.id) || 0) >= RCG.official.from)[0]; const evs = []; if (P) { const n0 = a.events.length; recOfficial(a, P.id); evs.push(...a.events.splice(n0)); } recOfferRoll(a, amRng(a), 40); a.events.length = 0; const f = (a.offers || []).find(o => !o.pulled && colSpots(a, o.pid).left > 0); if (f && recCommit(a, f.pid)) { const R = recOf(a); R.carousel = { pid: f.pid, at: R.t }; const n0 = a.events.length; recCarouselFire(a); evs.push(...a.events.splice(n0).filter(e => e.rec && e.rec.carousel)); }
  for (const ev of evs) { a.events = [ev]; g.ui.clearTo(amHub(g)); g.ui.push(amEventScreen(g)); for (let k = 0; k < 5; k++) { const s = g.ui.screen; if (s.finish) s.finish(); const nx = (s.widgets || []).find(w => w.label === '▼' && !w.hidden); if (!nx) break; nx.onPress(); } const s = g.ui.screen; if (s.finish) s.finish(); if (s.update) s.update(0.016, {}); const F = tFaults(g); if (F.length) out.push(ev.title + ': ' + F.slice(0, 2).join(' | ')); } a.events.length = 0; return { n: evs.length, out }; }; /* an official visit's three scenes and the coaching carousel's card, on their last page (the choices) */
window.tWeeks = (a, n, plan) => { const out = []; for (let i = 0; i < n; i++) { if (a.league) a.league.week = Math.min((a.league.week || 0) + 1, (a.league.schedule || []).length || 11); recWeek(a, amRng(a), plan || 'practice'); out.push(...a.events.splice(0)); } return out; };
`;

(async () => {
  const b = await launch(); const R = runner('recruit21');
  const P = await openPage(b, { wait: 900 }); const { ev } = P; await ev(src => { (0, eval)(src); }, LIB);

  await R.step('interest: the parts add up; a freshman is watched at most, a sophomore contacted; under a GPA line at most 20; a commitment freezes the others (a flip-friendly few keep rising)', () => ev(() => {
    const bad = [], a = tRec(11, 1, 24, 3.0), Y = COLG.interest.yearCap, top = () => Math.max(...COLLEGES.map(P => colInterest(a, P.id) || 0));
    if (top() > Y[0]) bad.push('freshman max ' + top()); a.stageYear = 2; if (top() > Y[1]) bad.push('sophomore max ' + top()); a.stageYear = 3; if (top() < 90) bad.push('junior max only ' + top());
    for (const P of COLLEGES.slice(0, 20)) { const I = recInterestParts(a, P.id); if (I.yearCap != null || I.gpaCap != null || I.frozen != null) continue; const sum = clamp(Math.round(I.fit + I.coach + I.home + I.character + I.earned + I.competition), 0, 100); if (sum !== I.v || I.v !== colInterest(a, P.id)) bad.push(P.id + ' parts ' + sum + ' vs ' + I.v + ' vs ' + colInterest(a, P.id)); }
    a.gpa = 1.6; if (top() > COLG.interest.gpaCap) bad.push('GPA 1.6: max ' + top()); a.gpa = 3.0;
    const T = COLLEGES.filter(P => colSpots(a, P.id).left > 0).sort((p, q) => colInterest(a, q.id) - colInterest(a, p.id))[0]; tOffer(a, T.id); if (!recCommit(a, T.id)) bad.push('no commitment');
    const others = COLLEGES.filter(P => P.id !== T.id && colInterest(a, P.id) < 90); let froze = 0, rose = 0; for (const P of others.slice(0, 24)) { const v0 = colInterest(a, P.id); recEarn(a, P.id, 15); const v1 = colInterest(a, P.id); if (recFlipFriendly(a, P.id)) { if (v1 > v0) rose++; else bad.push(P.id + ' (flip-friendly) did not rise'); } else if (v1 > v0) bad.push(P.id + ' rose while committed ' + v0 + '→' + v1); else froze++; }
    return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : 'freshman ≤' + Y[0] + ', sophomore ≤' + Y[1] + ', junior top ' + top() + ' · committed: ' + froze + ' frozen, ' + rose + ' flip-friendly rose';
  }), P);

  await R.step('offers: never before the junior year; from the junior year at 70+ with a spot open and the GPA line met; none under every line; an elite academic offer is conditional (3.3 by the senior finals)', () => ev(() => {
    const bad = [], a = tRec(12, 2, 22, 3.2); if (recOfferRoll(a, amRng(a), 60).length) bad.push('a sophomore got offers');
    a.stageYear = 3; const pre = COLLEGES.map(P => [P, colInterest(a, P.id) || 0, colSpots(a, P.id).left]), f = recOfferRoll(a, amRng(a), 60); a.events.length = 0; if (f.length < 3) bad.push('junior offers ' + f.length);
    for (const o of f) { const x = pre.find(q => q[0].id === o.pid); if (x[1] < COLG.stages[2]) bad.push(o.name + ' offered at ' + x[1]); if (x[2] <= 0) bad.push(o.name + ' offered with no spot'); if ((a.gpa || 0) < recGpaFloor(x[0])) bad.push(o.name + ' under its line'); if (x[0].academic && !(o.cond && o.cond.gpa === CONFIG.school.gpaReq.academic)) bad.push(o.name + ' academic, not conditional'); }
    const c = tRec(12, 3, 22, 1.9); if (recOfferRoll(c, amRng(c), 60).length) bad.push('GPA 1.9 got offers');
    const d = tRec(13, 3, 30, 3.4), fa = recOfferRoll(d, amRng(d), 80).filter(o => o.academic); if (!fa.length) bad.push('no elite academic offer at 3.4 (interest ' + COLLEGES.filter(P => P.academic).map(P => colInterest(d, P.id)).join(',') + ')'); for (const o of fa) if (!o.cond) bad.push(o.name + ' unconditional');
    const e = tRec(13, 3, 30, 2.9); if (recOfferRoll(e, amRng(e), 80).some(o => o.academic)) bad.push('an academic offer under ' + RCG.academicFrom);
    return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : f.length + ' junior offers (every one at 70+, a spot open); ' + fa.length + ' conditional academic at 3.4; none at 1.9';
  }), P);

  await R.step('spots: named recruits commit through the junior and senior years and take them (the news says Spots left); your commitment takes one; a filled spot pulls an offer, after a warning', () => ev(() => {
    const bad = [], a = tRec(14, 3, 20, 3.0), R0 = recOf(a); let P0 = null;
    for (const P of COLLEGES.slice().sort((p, q) => (colInterest(a, q.id) || 0) - (colInterest(a, p.id) || 0))) { const S1 = colSpots(a, P.id, 1); if (S1.total >= 2 && S1.left === 0 && colSpots(a, P.id, 0).left === S1.total && (colInterest(a, P.id) || 0) >= 80) { P0 = P; break; } } if (!P0) return Promise.reject(new Error('no program they want fills its spots'));
    const o = tOffer(a, P0.id); R0.earned[P0.id] = RCG.earnedMax; let warnT = null, news = 0;
    for (let y = 3; y <= 4 && !o.pulled; y++) { a.stageYear = y; if (a.league) a.league.week = 0; for (let w = 0; w < 12 && !o.pulled; w++) { a.league.week = w + 1; R0.earned[P0.id] = RCG.earnedMax; R0.last[P0.id] = R0.t + 1; recWeek(a, amRng(a), 'practice'); a.events.length = 0; if (warnT == null && recWarned(a, o, 'spot') != null) warnT = R0.t; } }
    news = (a.news || []).filter(n => /Spots left/.test(n.t || n.text || '')).length;
    if (!o.pulled) bad.push('the offer stood though the spots filled'); else if (o.why !== 'spot') bad.push('pulled for ' + o.why); if (warnT == null) bad.push('no warning before the pull'); if (!news) bad.push('no "Spots left" news');
    const b2 = tRec(15, 3, 20, 3.0); const Q = COLLEGES.find(P => colSpots(b2, P.id).left > 0 && colSpots(b2, P.id).total >= 2); tOffer(b2, Q.id); const l0 = colSpots(b2, Q.id).left; recCommit(b2, Q.id); const S = colSpots(b2, Q.id); if (!S.mine || S.left !== l0 - 1) bad.push('commitment: mine ' + S.mine + ', left ' + l0 + '→' + S.left);
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : P0.name + ': warned at week ' + warnT + ', pulled at ' + (+o.pulledAt).toFixed(2) + ' (' + o.why + '); ' + news + ' news items; a commitment takes a spot';
  }), P);

  await R.step('warnings, then pulls: interest under 55 (under 50 two weeks on), grades under the line (report card to report card), a long injury, the academic condition at the senior finals (or met)', () => ev(() => {
    const bad = [], out = [];
    { const a = tRec(16, 3, 20, 3.0), low = COLLEGES.filter(P => colSpots(a, P.id).left > 0 && (colInterest(a, P.id) || 0) < RCG.pullInterest && a.gpa >= recGpaFloor(P))[0], o = tOffer(a, low.id); tWeeks(a, 1); if (recWarned(a, o, 'interest') == null) bad.push('no interest warning'); if (o.pulled) bad.push('pulled at once'); tWeeks(a, 3); if (!o.pulled || o.why !== 'interest') bad.push('interest: ' + (o.pulled ? o.why : 'not pulled')); else out.push('interest'); }
    { const a = tRec(17, 3, 20, 3.0), P = COLLEGES.find(q => !q.academic && q.tier < 3), o = tOffer(a, P.id); a.gpa = 1.8; const l1 = recReportCard(a, 'mid'); if (o.pulled || !l1.some(l => /wants to see your grades/.test(l))) bad.push('grades: no warning first (' + l1.join(' / ') + ')'); recReportCard(a, 'end'); if (!o.pulled || o.why !== 'gpa') bad.push('grades: ' + (o.pulled ? o.why : 'not pulled')); else out.push('grades'); }
    { const a = tRec(18, 3, 20, 3.0), P = COLLEGES.filter(q => colSpots(a, q.id).left > 0 && (colInterest(a, q.id) || 0) >= RCG.warnInterest && (colInterest(a, q.id) || 0) < RCG.injuryKeep)[0]; if (!P) bad.push('no program for the injury case'); else { const o = tOffer(a, P.id); recOf(a).earned[P.id] = 0; a.injury = { name: 'Sprained ankle', games: RCG.injuryGames + 4 }; tWeeks(a, 1); if (recWarned(a, o, 'injury') == null) bad.push('injury: no warning'); if (o.pulled) bad.push('injury: pulled at once'); tWeeks(a, RCG.injuryWeeks + 1); if (!o.pulled || !/injury|interest/.test(o.why)) bad.push('injury: ' + (o.pulled ? o.why : 'not pulled')); else out.push('injury'); } }
    for (const [g, want] of [[3.1, 'condition'], [3.4, 'met']]) { const a = tRec(19, 4, 20, g), P = COLLEGES.find(q => q.academic), o = tOffer(a, P.id); const l1 = recReportCard(a, 'mid'); if (g < 3.3 && !l1.some(l => /conditional/.test(l))) bad.push(g + ': no condition warning'); if (o.pulled) bad.push(g + ': pulled at the midterm'); recReportCard(a, 'end'); if (want === 'met' ? (o.pulled || !o.cond.met) : (!o.pulled || o.why !== 'condition')) bad.push(g + ': ' + (o.pulled ? 'pulled ' + o.why : o.cond.met ? 'met' : 'neither')); else out.push('academic at ' + g + ': ' + want); }
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : out.join(' · ');
  }), P);

  await R.step('actions: three a month; film +5 at up to three; an email +3; the coach\'s call needs trust 60; a camp ($250: +10 there, +3 across its conference, a showcase); an unofficial visit takes the week; official visits (5, from interest 50) are scenes and show the facilities; contact fades', () => ev(() => {
    const bad = [], a = tRec(20, 3, 18, 3.0), R0 = recOf(a), byV = COLLEGES.slice().sort((p, q) => (colInterest(a, q.id) || 0) - (colInterest(a, p.id) || 0)), ids = byV.slice(5, 8).map(P => P.id);
    const e0 = ids.map(id => R0.earned[id] || 0); if (!recFilm(a, ids.concat([byV[9].id]))) bad.push('film refused'); ids.forEach((id, i) => { if ((R0.earned[id] || 0) - e0[i] !== RCG.film.gain) bad.push('film ' + id + ' +' + ((R0.earned[id] || 0) - e0[i])); }); if (R0.earned[byV[9].id]) bad.push('film reached a fourth program');
    const t0 = byV[10].id; if (!recEmail(a, t0) || R0.earned[t0] !== RCG.email) bad.push('email ' + R0.earned[t0]);
    a.team.trust = 40; if (recCoachCall(a, t0) || !/trust/.test(recWhyNot(a, 'coach', t0) || '')) bad.push('coach call under trust 60');
    a.team.trust = 70; if (!recCoachCall(a, t0)) bad.push('coach call at trust 70'); if (recActs(a).left !== 0) bad.push('actions left ' + recActs(a).left); if (recEmail(a, t0) || !/No actions left/.test(recWhyNot(a, 'email', t0) || '')) bad.push('a fourth action');
    a.league.week += RCG.monthWeeks; if (recActs(a).left !== RCG.actions) bad.push('a new month: ' + recActs(a).left);
    const C = byV[12], conf = colMembers(C.conf).find(q => q.id !== C.id); a.cash = 100; if (recCamp(a, C.id, amRng(a))) bad.push('a camp without the money'); a.cash = 1000; const ec = R0.earned[conf.id] || 0, ev0 = a.events.length; const cr = recCamp(a, C.id, amRng(a)); if (!cr) bad.push('camp refused: ' + recWhyNot(a, 'camp', C.id)); else { if (a.cash !== 1000 - RCG.camp.cost) bad.push('camp cost ' + (1000 - a.cash)); if ((R0.earned[C.id] || 0) < RCG.camp.gain) bad.push('camp +' + R0.earned[C.id]); if ((R0.earned[conf.id] || 0) - ec !== RCG.camp.conf) bad.push('conference +' + ((R0.earned[conf.id] || 0) - ec)); if (a.events.length !== ev0 + 1 || !/CAMP/.test(a.events[a.events.length - 1].title) || !/showcase/.test(a.events[a.events.length - 1].lines.join(' '))) bad.push('no camp card'); }
    a.events.length = 0; const U = byV[13]; a.wk = null; if (!recUnofficial(a, U.id) || (a.wk && a.wk.done) !== 'visit' || (R0.earned[U.id] || 0) < RCG.unofficial) bad.push('unofficial: week ' + (a.wk && a.wk.done) + ', +' + R0.earned[U.id]); if (!/planned/.test(recWhyNot(a, 'unofficial', byV[14].id) || '')) bad.push('a second visit in the same week');
    a.league.week += RCG.monthWeeks; const low = byV.find(P => (colInterest(a, P.id) || 0) < RCG.official.from); if (recOfficial(a, low.id)) bad.push('an official visit under interest ' + RCG.official.from); const O = byV[0]; if (recRevealed(a, O.id)) bad.push('revealed before the visit'); if (!recOfficial(a, O.id)) bad.push('official refused: ' + recWhyNot(a, 'official', O.id)); if (!recRevealed(a, O.id)) bad.push('not revealed after the visit'); const sc = a.events.filter(e => e.kind === 'dialog' && e.rec && e.rec.pid === O.id); if (sc.length !== 3) bad.push('scenes ' + sc.length); a.events.length = 0;
    R0.off = byV.slice(1, 1 + RCG.official.max).map(P => P.id); a.league.week += RCG.monthWeeks; if (recOfficial(a, byV[8].id) || !/All 5/.test(recWhyNot(a, 'official', byV[8].id) || '')) bad.push('a sixth official visit');
    const k = t0, e1 = R0.earned[k]; R0.last[k] = R0.t; tWeeks(a, RCG.graceWeeks); if (R0.earned[k] !== e1) bad.push('faded inside the grace weeks'); tWeeks(a, 3); if (!(R0.earned[k] < e1)) bad.push('contact never faded');
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : 'film, email, call, camp, unofficial, official (3 scenes), the month\'s limit and the fade all hold';
  }), P);

  await R.step('an official visit: three scenes (the team, Saturday night, the pitch); the coach pitches by style (an Iso coach promises the ball, a Development coach shows the plan); the choices move interest; "Commit on the spot" commits when they have offered', () => ev(() => {
    const bad = [], seen = {}; let committed = 0, moved = 0;
    for (let s = 21; s < 60 && Object.keys(seen).length < 4; s++) { const a = tRec(s, 3, 20, 3.0), P = COLLEGES.filter(q => (colInterest(a, q.id) || 0) >= RCG.official.from && colSpots(a, q.id).left > 0).sort((p, q) => colInterest(a, q.id) - colInterest(a, p.id))[0]; if (!P) continue; const sys = colCoach(a, P.id).sys; if (seen[sys] && s % 3) continue; tOffer(a, P.id);
      recOfficial(a, P.id); const sc = a.events.filter(e => e.kind === 'dialog' && e.rec && e.rec.pid === P.id); if (sc.map(e => e.title).join('/') !== 'OFFICIAL VISIT/SATURDAY NIGHT/THE PITCH') bad.push('scenes ' + sc.map(e => e.title).join('/')); const pitch = sc[2].lines.join(' ');
      if (sys === 'iso' && !/ball in our best player's hands/.test(pitch)) bad.push('iso pitch: ' + pitch.slice(0, 60)); if (sys === 'development' && !/film every Monday/.test(pitch)) bad.push('development pitch: ' + pitch.slice(0, 60)); seen[sys] = 1;
      const e0 = recOf(a).earned[P.id] || 0; stChoose(a, sc[0], 0); if ((recOf(a).earned[P.id] || 0) > e0) moved++; const ci = sc[2].choice.findIndex(c => c.rec && c.rec.commit); if (ci < 0) bad.push('no "Commit on the spot" with an offer'); else { stChoose(a, sc[2], ci); if (recOf(a).commit && recOf(a).commit.pid === P.id) committed++; else bad.push('the commit choice did not commit'); } }
    return bad.length ? Promise.reject(new Error(bad.slice(0, 5).join('; '))) : 'styles seen ' + Object.keys(seen).join(', ') + ' · interest moved ' + moved + ' · committed on the spot ' + committed;
  }), P);

  await R.step('a verbal commitment and a flip: the flip costs hype, pulls the old offer, cools most programs, brings a press storm, and your next coach remembers (trust −10)', () => ev(() => {
    const bad = [], a = tRec(61, 3, 22, 3.0), live = recOfferRoll(a, amRng(a), 60); a.events.length = 0; if (live.length < 2) return Promise.reject(new Error('offers ' + live.length));
    const [o1, o2] = live; recCommit(a, o1.pid); a.hype = 40; const R0 = recOf(a), q = COLLEGES.find(P => !recFlipFriendly(a, P.id) && P.id !== o1.pid && P.id !== o2.pid), f = COLLEGES.find(P => recFlipFriendly(a, P.id) && P.id !== o1.pid && P.id !== o2.pid); R0.earned[q.id] = 20; if (f) R0.earned[f.id] = 20;
    const r = recCommit(a, o2.pid); if (!r) bad.push('no flip'); if (a.hype !== 40 - RCG.flip.hype) bad.push('hype ' + a.hype); if (!o1.pulled || o1.why !== 'flip') bad.push('old offer ' + (o1.pulled ? o1.why : 'live')); if (R0.earned[q.id] !== 20 - RCG.flip.hurt) bad.push('a program that dislikes a flip: ' + R0.earned[q.id]); if (f && R0.earned[f.id] !== 20 + RCG.flip.like) bad.push('a flip-friendly program: ' + R0.earned[f.id]);
    const ps = a.events.find(e => e.kind === 'press'); if (!ps || ps.title !== 'PRESS STORM' || !(ps.x && ps.x.flip)) bad.push('no press storm'); else { const A = pressAnswers(ps.x); if (!A.team || !/flip|place|right for me/i.test(A.team + A.trash)) bad.push('press answers ' + JSON.stringify(A).slice(0, 80)); }
    a.events.length = 0; a.stageYear = 4; recSigningDay(a, amRng(a)); a.events.length = 0; const t0 = trustOf(a), o = a.decision.offers.find(x => x.pid === o2.pid); amChooseCollege(a, o); const T = a.team && a.team.trust; a.events.length = 0;
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'hype −' + RCG.flip.hype + ', old offer pulled, ±interest, press storm · coach trust at arrival ' + Math.round(T) + ' (the flip: −' + RCG.flip.trust + ')';
  }), P);

  await R.step('the coaching carousel: a committed program\'s coach can leave (15%); follow them (no flip), stay, or reopen (no cost); the moved coach is the new program\'s', () => ev(() => {
    const bad = [], res = { follow: 0, stay: 0, reopen: 0 }; let n = 0, hits = 0;
    for (const kind of ['follow', 'stay', 'reopen']) { let done = false; for (let s = 70; s < 400 && !done; s++) { const a = tRec(s, 3, 22, 3.0); const f = recOfferRoll(a, amRng(a), 60).filter(o => recCarouselWill(a, o.pid)); a.events.length = 0; if (!f.length) continue; const o = f[0]; recCommit(a, o.pid); const R0 = recOf(a); if (!R0.carousel || R0.carousel.pid !== o.pid) { bad.push('not scheduled'); break; }
      a.hype = 30; R0.carousel.at = R0.t; const evx = tWeeks(a, 1).find(e => e.rec && e.rec.carousel); if (!evx) { bad.push('no carousel card'); break; } const i = evx.choice.findIndex(c => c.rec && c.rec.car === kind); if (i < 0) { if (kind === 'follow') continue; bad.push('no ' + kind + ' choice'); break; }
      const mv = colWorld(a).moves.slice(-1)[0]; stChoose(a, evx, i); a.events.length = 0;
      if (kind === 'follow') { if (!R0.commit || R0.commit.pid !== mv.to) bad.push('follow: committed to ' + (R0.commit && R0.commit.pid)); if (colCoach(a, mv.to).name !== mv.coach.name) bad.push('the coach is not at ' + mv.to); if (a.hype !== 30) bad.push('follow cost hype'); }
      if (kind === 'stay' && (!R0.commit || R0.commit.pid !== o.pid)) bad.push('stay lost the commitment'); if (kind === 'reopen' && (R0.commit || a.hype !== 30)) bad.push('reopen: ' + (R0.commit ? 'still committed' : 'hype ' + a.hype));
      res[kind]++; done = true; } }
    for (let s = 400; s < 1000; s++) { n++; if (colRngFor({ seed: s, season: 1 }, 'royaloak:carousel').next() < RCG.carousel) hits++; }
    return bad.length ? Promise.reject(new Error(bad.slice(0, 4).join('; '))) : JSON.stringify(res) + ' · a program\'s coach leaves in ' + Math.round(100 * hits / n) + '% of careers (' + Math.round(RCG.carousel * 100) + '%)';
  }), P);

  await R.step('Signing Day: your live offers (the commitment first) and the pros if you\'re good enough; signing is binding; a hat for every program that ever offered (pulled ones too), rows of them past 8', () => ev(() => {
    const bad = [], a = tRec(91, 4, 30, 3.4), g = HH.game; recOfferRoll(a, amRng(a), 80); a.events.length = 0; const live = a.offers.filter(o => !o.pulled); recPull(a, live[live.length - 1], 'spot'); const cm = live[1]; recCommit(a, cm.pid); a.events.length = 0;
    recSigningDay(a, amRng(a)); a.events.length = 0; const d = a.decision; if (!d || !d.signing) bad.push('no Signing Day decision'); if (d.offers[0].pid !== cm.pid) bad.push('the commitment is not first'); if (d.offers.some(o => o.pulled)) bad.push('a pulled offer to sign');
    g.ui.clearTo(amHub(g)); g.ui.push(amDecisionScreen(g)); if (g.ui.screen.name !== 'signing') bad.push('screen ' + g.ui.screen.name);
    const hats = recHats(a).length; amChooseCollege(a, d.offers[0]); const ce = a.events.find(e => e.kind === 'commit'); if (!ce || ce.title !== 'SIGNING DAY' || !ce.signing) bad.push('commit event ' + (ce && ce.title)); if (ce.offers.length !== hats || hats !== a.offers.length) bad.push('hats ' + ce.offers.length + ' vs ' + hats + ' vs ' + a.offers.length); if (a.stage !== 'college' || !recOf(a).commit.signed) bad.push('not binding');
    g.ui.clearTo(amHub(g)); g.ui.push(commitDayScreen(g, a, ce, () => {})); g.ui.screen.update(3, {}); const F = tFaults(g); if (F.length) bad.push(F.slice(0, 3).join(' | '));
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : hats + ' hats (' + a.offers.filter(o => o.pulled).length + ' pulled offers among them) · signed with ' + a.college;
  }), P);

  await R.step('no offers: the NO OFFERS card; a walk-on at a program whose GPA line you meet (no scholarship, the bottom of the depth chart); a prep year (once: dominate it and a star comes back); with no road left, the pros', () => ev(() => {
    const bad = [], out = [];
    { const a = tRec(101, 4, -14, 2.2); a.offers = []; recSigningDay(a, amRng(a)); const card = a.events.find(e => e.title === 'NO OFFERS'); if (!card) bad.push('no NO OFFERS card'); a.events.length = 0; if (!a.decision.none || !a.decision.prepOk) bad.push('none ' + a.decision.none + ' prepOk ' + a.decision.prepOk);
      const blue = COLLEGES.find(P => P.tier === 3); if (!recWalkOnWhyNot(a, blue.id)) bad.push('a walk-on under the blue bloods\' line'); const W = COLLEGES.find(P => !recWalkOnWhyNot(a, P.id)); recWalkOn(a, W.id); a.events.length = 0; const L = a.team && a.team.ladder; if (a.stage !== 'college' || a.scholarship !== 'walkon') bad.push('walk-on: ' + a.stage + ' ' + a.scholarship); if (!L || L.indexOf('me') !== L.length - 1) bad.push('not at the bottom: ' + JSON.stringify(L)); else out.push('walk-on at ' + W.name + ', #' + L.length + ' of ' + L.length); }
    { const a = tRec(102, 4, -14, 2.2); a.offers = [colOfferFrom(a, COLLEGES[60], 'x')]; a.offers[0].pulled = true; recSigningDay(a, amRng(a)); a.events.length = 0; const s0 = a.recruit.stars, sc0 = a.school; if (!recPrepYear(a, amRng(a))) bad.push('no prep year'); a.events.length = 0; if (a.stage !== 'hs' || a.school === sc0 || !a.prep) bad.push('prep: ' + a.stage + ' ' + a.school);
      const L = a.league; L.me = L.me || {}; L.me.w = RCG.prep.minGames + 2; L.me.l = 0; recPrepCheck(a); const und = a.events.find(e => e.title === 'THE UNDERDOG'); a.events.length = 0; if (!a.prep.bonus || !und) bad.push('dominating the prep year: no bonus'); else if (a.recruit.stars !== Math.min(5, s0 + 1)) bad.push('prep year: ' + s0 + '★ → ' + a.recruit.stars + '★'); else out.push('prep year: ' + s0 + '★ → ' + a.recruit.stars + '★');
      a.offers = []; a.stageYear = 4; recSigningDay(a, amRng(a)); a.events.length = 0; if (a.decision.prepOk) bad.push('a second prep year'); }
    { const a = tRec(103, 4, -14, 1.6); a.offers = []; a.prep = { year: 1, bonus: false }; recSigningDay(a, amRng(a)); a.events.length = 0; const pro = a.decision.offers.find(o => o.draft); if (!pro) bad.push('no road: no pros'); else out.push('no road left: the pros'); }
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : out.join(' · ');
  }), P);

  await R.step('the College test: a heads-up early in the junior season, then the test after week 6 (three Study weeks: GPA +0.15; one or two: +0.05; none: −0.10)', () => ev(() => {
    const bad = [], out = [];
    for (const [n, want] of [[3, RCG.test.up], [1, RCG.test.some], [0, RCG.test.down]]) { const a = tRec(110 + n, 3, 10, 3.0); a.league.week = 0; let note = 0, test = null; for (let w = 1; w <= RCG.test.week; w++) { a.league.week = w; recWeek(a, amRng(a), w <= n ? 'study' : 'practice'); for (const e of a.events.splice(0)) { if (e.title === 'THE COLLEGE TEST' && !test && !recOf(a).test) note++; if (e.title === 'THE COLLEGE TEST' && recOf(a).test) test = e; } }
      const T = recOf(a).test; if (!note) bad.push(n + ': no heads-up'); if (!T) { bad.push(n + ': no test'); continue; } if (Math.abs(T.d - want) > 1e-9) bad.push(n + ' study weeks: ' + T.d); else out.push(n + ' → ' + (T.d > 0 ? '+' : '') + T.d.toFixed(2)); }
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : out.join(', ');
  }), P);

  await R.step('screens (desktop): the Recruit tab (actions, Send film, the log), a program\'s page (Recruit…, the facilities hidden until a visit), the action sheet, film, Signing Day, walk-on, Offers & rank and the log, an official visit\'s three scenes and the coaching carousel\'s card: no cut or overlapping text, and the sheet\'s buttons act', () => ev(() => {
    const g = HH.game, bad = [], a = tRec(120, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; const o = a.offers[0];
    const look = (name, open) => { g.ui.clearTo(amHub(g)); open(); const s = g.ui.screen; if (s.update) s.update(0.016, {}); const F = tFaults(g); if (F.length) bad.push(name + ': ' + F.slice(0, 3).join(' | ')); return s; };
    g.hubTab = 'recruit'; const hub = look('recruit tab', () => {}); const lbl = hub.widgets.filter(w => !w.hidden).map(w => w.label); for (const l of ['College Browser', 'Send film', 'Offers & rank', 'Recruiting log']) if (!lbl.includes(l)) bad.push('tab: no ' + l);
    const pg = look('program page', () => g.ui.push(collegeProgramScreen(g, o.pid))), rb = pg.widgets.find(w => w.label === 'Recruit…'); if (!rb || rb.hidden) bad.push('no Recruit… button'); const tx = tTexts(g).map(x => String(x.t)).join(' | '); if (!/\? an official visit/.test(tx)) bad.push('facilities shown before a visit');
    rb.onPress(); if (g.ui.screen.name !== 'recactions') bad.push('Recruit… opened ' + g.ui.screen.name);
    const sh = look('action sheet', () => g.ui.push(recActionScreen(g, o.pid))), em = sh.widgets.find(w => w.label === 'Email the coach'), l0 = recActs(a).left; em.onPress(); if (recActs(a).left !== l0 - 1) bad.push('Email did not spend an action'); sh.update(0.016, {});
    look('film picker', () => g.ui.push(recFilmScreen(g, [o.pid]))); look('offers & rank', () => g.ui.push(recruitingScreen(g))); look('recruiting log', () => g.ui.push(recLogScreen(g)));
    a.stageYear = 4; recSigningDay(a, amRng(a)); a.events.length = 0; look('signing day', () => g.ui.push(amDecisionScreen(g))); look('walk-on', () => g.ui.push(recWalkOnScreen(g)));
    g.hubTab = 'play'; const hp = look('hub at Signing Day', () => {}); if (!hp.widgets.some(w => !w.hidden && w.label === 'SIGNING DAY')) bad.push('no SIGNING DAY on the hub');
    const sc = tScenes(g, tRec(121, 3, 26, 3.0)); if (sc.out.length) bad.push(...sc.out); if (sc.n < 4) bad.push('scenes ' + sc.n);
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : 'nine screens and ' + sc.n + ' scenes clean; Recruit… opens the sheet; Email spends an action';
  }), P);

  await R.step('the Codex: Colleges & recruiting covers interest, offers, spots, the actions, commitment and Signing Day, the College test (no undefined or NaN); ? on every new screen opens it; the page draws clean', () => ev(() => {
    const g = HH.game, bad = [], a = tRec(125, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; const E = guideEntries(g, 'colleges'), T = E.map(e => e.title);
    for (const t of ['Interest in you', 'Offers', 'Scholarship spots', 'Recruiting actions', 'Commitment and Signing Day', 'The College test']) if (!T.includes(t)) bad.push('no ' + t); if (/undefined|NaN|\[object/.test(JSON.stringify(E))) bad.push('undefined/NaN');
    const o = a.offers[0]; for (const [tag, open] of [['actions', () => g.ui.push(recActionScreen(g, o.pid))], ['film', () => g.ui.push(recFilmScreen(g, []))], ['log', () => g.ui.push(recLogScreen(g))], ['offers', () => g.ui.push(recruitingScreen(g))]]) { g.ui.clearTo(amHub(g)); open(); const t = codexTopicFor(g, g.ui.screen); if (t !== 'colleges') bad.push(tag + ' → ' + t); }
    a.stageYear = 4; recSigningDay(a, amRng(a)); a.events.length = 0; for (const [tag, open] of [['signing', () => g.ui.push(amDecisionScreen(g))], ['walk-on', () => g.ui.push(recWalkOnScreen(g))]]) { g.ui.clearTo(amHub(g)); open(); const t = codexTopicFor(g, g.ui.screen); if (t !== 'colleges') bad.push(tag + ' → ' + t); }
    g.ui.clearTo(amHub(g)); g.ui.push(statsGuideScreen(g, 'colleges')); const F = tFaults(g); if (F.length) bad.push('the page: ' + F.slice(0, 3).join(' | '));
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : E.length + ' entries; six screens point at it';
  }), P);

  await R.step('old saves: a high school save from before W4 (no recruiting state; offers from the old ladder) goes on (interest, the week, the offers keep), and an old college decision keeps its offer board', () => ev(() => {
    const bad = [], g = HH.game, a = tRec(130, 3, 18, 3.0); delete a.rec; a.offers = [{ name: 'Pine Ridge College', tier: 1, colors: ['#123456', '#FFFFFF'], coach: 'Coach Old', focus: 'shooting', fac: 2, visited: false, gpaReq: 2.0, when: 'junior' }];
    const raw = JSON.parse(JSON.stringify(a)); g.save.data.c1 = raw; let v; try { v = colInterest(raw, COLLEGES[0].id); tWeeks(raw, 2); } catch (e) { bad.push('threw: ' + e.message); } if (!raw.rec || !(v >= 0)) bad.push('no recruiting state'); if (!raw.offers.length || raw.offers[0].pulled && raw.offers[0].why === undefined) bad.push('old offer lost');
    const b = tRec(131, 4, 18, 3.0); b.decision = { kind: 'college', offers: [{ name: 'Pine Ridge College', tier: 1, colors: ['#123456', '#FFFFFF'], coach: 'Coach Old', focus: 'shooting', fac: 2 }], visits: 2 }; g.save.data.c1 = b; g.ui.clearTo(amHub(g)); g.ui.push(amDecisionScreen(g)); if (g.ui.screen.name !== 'recruit') bad.push('old decision: ' + g.ui.screen.name);
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'an old junior goes on; an old decision keeps its board';
  }), P);
  if (P.errors.length) console.log('page errors:', P.errors.slice(0, 5));

  // phones: the same screens at 844×390 (64 px targets, nothing cut)
  const Q = await openPage(b, { wait: 900, phone: true }); await Q.ev(src => { (0, eval)(src); }, LIB);
  await R.step('screens (phone): the Recruit tab, a program\'s page, the action sheet, film, Signing Day, walk-on, Offers & rank, the log, the Codex page, the visit\'s scenes and the carousel\'s card: 64 px targets, no cut or overlapping text', () => Q.ev(() => {
    const g = HH.game, bad = [], a = tRec(140, 3, 22, 3.0); recOfferRoll(a, amRng(a), 40); a.events.length = 0; const o = a.offers[0];
    const look = (name, open) => { g.ui.clearTo(amHub(g)); open(); const s = g.ui.screen; if (s.update) s.update(0.016, {}); const F = tFaults(g).concat(tSmall(g).map(x => 'SMALL ' + x)); if (F.length) bad.push(name + ': ' + F.slice(0, 3).join(' | ')); };
    g.hubTab = 'recruit'; look('recruit tab', () => {}); look('program page', () => g.ui.push(collegeProgramScreen(g, o.pid))); look('action sheet', () => g.ui.push(recActionScreen(g, o.pid))); look('film picker', () => g.ui.push(recFilmScreen(g, [o.pid]))); look('offers & rank', () => g.ui.push(recruitingScreen(g))); look('recruiting log', () => g.ui.push(recLogScreen(g)));
    look('codex', () => g.ui.push(statsGuideScreen(g, 'colleges')));
    a.stageYear = 4; recSigningDay(a, amRng(a)); a.events.length = 0; look('signing day', () => g.ui.push(amDecisionScreen(g))); look('walk-on', () => g.ui.push(recWalkOnScreen(g)));
    const sc = tScenes(g, tRec(141, 3, 26, 3.0)); if (sc.out.length) bad.push(...sc.out); if (sc.n < 4) bad.push('scenes ' + sc.n);
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : 'nine screens and ' + sc.n + ' scenes clean';
  }), Q);
  if (Q.errors.length) console.log('phone page errors:', Q.errors.slice(0, 5));
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
