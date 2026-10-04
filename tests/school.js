// V9 (Part 2 §3): GPA and school. Offers have GPA lines (no offer under one, and a report card under it pulls it);
// exam weeks (Cram, Balanced, Skip) with the report card after the pick, at both levels; eligibility (under 2.0 you sit
// 2 games); academic probation in college (under 1.5) and the scholarship it can cost; tuition (a full ride, partial,
// lost), the student loan and how it's paid back; the major and the degree; summer classes in the pros; the ending's
// versions; old saves. (The §1.1 table with all of it: tests/difficulty.js.) Usage: node tests/school.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('school'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  // A high-school varsity player, and a college freshman (gpa and stars at commitment, the program's tier).
  const mkHs = `(seed => { const a = amCreate(defaultSave(), { name: 'School Test', look: PRESET_LOOKS[seed % 16], number: 4, style: 'slasher', seed }); hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; return a; })`;
  const mkCol = `((seed, gpa, stars, tier) => { const c = amCreate(defaultSave(), { name: 'College Test', look: PRESET_LOOKS[seed % 16], number: 23, style: 'slasher', seed }); c.events.length = 0; hsSimTryout(c); for (const k of RATING_KEYS) c.r[k] = Math.max(c.r[k], 66); c.age = 18; c.stageYear = 4; c.decision = null; c.gpa = gpa; c.recruit = { score: 60, nat: 100, stars }; c.events.length = 0; amChooseCollege(c, { name: 'Test State', tier, colors: ['#224', '#EEE'], coach: 'Coach Test', focus: 'shooting', fac: 2 }); return c; })`;
  const B = [mkHs, mkCol];

  await step('offers have GPA lines (blue blood 2.5, elite academic 3.3, the rest 2.0) and none comes under its floor; elite academic programs offer from 3.0, on condition of their 3.3 by the senior finals (2.1 §2.2); with no offer, Signing Day has a walk-on or a prep year', () => ev(([mkHs]) => {
    const n = { offers: 0, blue: 0, academic: 0, byG: {} }, bad = [];
    for (let seed = 1; seed <= 40; seed++) for (const g of [1.7, 2.1, 2.4, 2.6, 2.9, 3.1, 3.3, 3.8]) {
      const c = eval(mkHs)(1000 + seed); const lvl = 52 + (seed % 6) * 7; for (const k of RATING_KEYS) c.r[k] = lvl; c.stageYear = 4; c.offers = []; c.gpa = g; hsOfferCheck(c, amRng(c), 'final');
      for (const o of c.offers) { n.offers++; const line = o.academic ? SCH.gpaReq.academic : o.tier >= 3 ? SCH.gpaReq.blue : SCH.gpaReq.other; if (o.gpaReq !== line) bad.push(o.name + ': line ' + o.gpaReq); if (g < schoolOfferReq(o)) bad.push(o.name + ' offered at ' + g); if (o.tier >= 3) n.blue++; if (o.academic) { n.academic++; const q = colProg(o.pid); if (!q || !q.academic || q.name !== o.name || o.tier !== q.tier) bad.push('elite academic ' + o.name + ' tier ' + o.tier); if (!o.cond || o.cond.gpa !== SCH.gpaReq.academic || g < RCG.academicFrom) bad.push('elite academic ' + o.name + ' at ' + g + ': ' + JSON.stringify(o.cond)); } /* 2.1: a Laurel League program (64 colleges), on condition */ }
      n.byG[g] = (n.byG[g] || 0) + c.offers.length;
    }
    if (bad.length) throw new Error(bad.slice(0, 4).join(' | ')); if (!n.blue || !n.academic) throw new Error('no blue blood or no elite academic offer: ' + JSON.stringify(n)); if (n.byG[1.7]) throw new Error('offers under 2.0');
    const z = eval(mkHs)(999); z.stageYear = 4; z.offers = []; z.gpa = 1.6; z.events.length = 0; amStartRecruiting(z, amRng(z)); const live = z.decision.offers.filter(o => !o.draft); if (live.length || !z.decision.none || !z.decision.prepOk || !z.events.some(e => e.title === 'NO OFFERS')) throw new Error('no offer: ' + JSON.stringify({ live: live.length, none: z.decision.none, prepOk: z.decision.prepOk }));
    const t = hsOfferLineText([{ name: 'A', tier: 3, gpaReq: 2.5 }, { name: 'B', tier: 1, gpaReq: 2 }]); if (!/A: 2\.5/.test(t) || !/the rest 2\.0/.test(t)) throw new Error('the offer card names the lines: ' + t);
    return n.offers + ' offers · ' + n.blue + ' blue blood · ' + n.academic + ' elite academic (conditional) · offers by GPA ' + JSON.stringify(n.byG);
  }, B));

  await step('a report card under a program\'s line warns, and the next one pulls its offer and only its (the blue blood at 2.4, everyone under 2.0); an elite academic offer\'s 3.3 is checked at the senior midterm (a warning) and the finals; the card says why', () => ev(([mkHs]) => {
    const c = eval(mkHs)(2001); for (const k of RATING_KEYS) c.r[k] = 82; c.stageYear = 4; c.offers = []; c.gpa = 3.6; hsOfferCheck(c, amRng(c), 'final');
    const ac = c.offers.find(o => o.academic), bb = c.offers.find(o => o.tier === 3); if (!ac || !bb) throw new Error('a 3.6 star gets an elite academic and a blue-blood offer: ' + c.offers.map(o => o.name + ' ' + o.tier));
    c.events.length = 0; c.gpa = 3.2; amReportCard(c, 'mid'); if (c.offers.some(o => o.pulled)) throw new Error('3.2 at the midterm pulled ' + c.offers.filter(o => o.pulled).map(o => o.name));
    const card = c.events.find(e => e.title === 'REPORT CARD'); if (!card || !card.lines.some(l => l.includes(ac.name) && /conditional/.test(l))) throw new Error('the card names the condition: ' + (card && card.lines.join(' / ')));
    c.gpa = 2.4; amReportCard(c, 'mid'); if (c.offers.some(o => o.pulled)) throw new Error('2.4: a warning first'); amReportCard(c, 'end'); if (!bb.pulled || bb.why !== 'gpa' || !ac.pulled || c.offers.some(o => o.tier < 3 && !o.academic && o.pulled)) throw new Error('2.4 twice pulls the blue blood and the academic offer only'); if (c.ineligible) throw new Error('2.4 is eligible');
    c.gpa = 1.9; amReportCard(c, 'mid'); amReportCard(c, 'end'); if (c.offers.some(o => !o.pulled) || c.ineligible !== HS.ineligibleGames) throw new Error('1.9: every offer pulled (after a warning), and ineligible');
    return c.offers.map(o => o.name + ' (' + schoolOfferReq(o).toFixed(1) + (o.cond ? ', 3.3 by the finals' : '') + ')').join(', ');
  }, B));

  await step('exam weeks (high school): MIDTERMS after the fifth game, FINALS WEEK before the last, twice a season and never in the playoffs; Cram, Balanced (the default) and Skip do what they say; the report card follows the pick', () => ev(([mkHs]) => {
    const c = eval(mkHs)(3001); for (const k of RATING_KEYS) c.r[k] = 85; ladderInit(c, 1); c.gpa = 3; const L = c.league, E = SCH.exam; let n = 0, mid = null, fin = null, seen = 0;
    const r2 = x => Math.round(x * 100) / 100;
    while (!mid && n++ < 30) { c.events.length = 0; c.fatigue = 0; amSimGame(c); mid = c.events.find(e => e.exam === 'mid'); }
    if (!mid || L.week !== HS.reportWeek || mid.title !== 'MIDTERMS') throw new Error('the midterm after week ' + HS.reportWeek + ': week ' + L.week); seen++;
    if (c.events.some(e => e.title === 'REPORT CARD')) throw new Error('the report card waits for the pick'); if (mid.choice.length !== 3 || mid.choice.findIndex(x => x.def) !== 1) throw new Error('three choices, Balanced the default');
    const g0 = c.gpa; c.fatigue = 10; c.storyXp = 0; stChoose(c, mid, 0); if (Math.abs(c.gpa - r2(g0 + E.cram[0])) > 1e-9 || c.fatigue !== 10 + E.cram[1] || Math.abs(c.storyXp - E.cram[2]) > 1e-9) throw new Error('cram: ' + c.gpa + ' · fatigue ' + c.fatigue + ' · xp ' + c.storyXp);
    if (c.events[c.events.length - 1].title !== 'REPORT CARD') throw new Error('the report card follows the pick'); if (!mid.outcome.some(l => /^GPA \+/.test(l))) throw new Error('the outcome says the GPA: ' + mid.outcome);
    while (!fin && n++ < 40) { c.events.length = 0; c.fatigue = 0; amSimGame(c); if (c.events.some(e => e.exam === 'mid')) throw new Error('a second midterm'); fin = c.events.find(e => e.exam === 'end'); }
    if (!fin || L.week !== L.schedule.length - 1 || fin.title !== 'FINALS WEEK') throw new Error('finals before the last game: week ' + L.week + ' of ' + L.schedule.length); seen++;
    const g1 = c.gpa; c.storyXp = 0; stChoose(c, fin, 2); if (Math.abs(c.gpa - r2(g1 + E.skip[0])) > 1e-9 || Math.abs(c.storyXp - E.skip[2]) > 1e-9) throw new Error('skip: ' + c.gpa + ' · xp ' + c.storyXp);
    const x = schoolExamCard(c, 'mid'), g2 = c.gpa; stAutoChoose(c, x); if (Math.abs(c.gpa - r2(g2 + E.balanced[0])) > 1e-9) throw new Error('the default is Balanced: ' + c.gpa);
    while (c.season === 1 && n++ < 60) { c.events.length = 0; c.fatigue = 0; if (c.summer && c.summer.pending) break; amSimGame(c); if (c.events.some(e => e.exam)) seen++; }
    if (seen !== 2) throw new Error(seen + ' exam weeks in a season (playoffs included)');
    return 'midterm after week ' + HS.reportWeek + ' · finals after week ' + (L.schedule.length - 1) + ' · cram ' + g0 + '→' + r2(g0 + E.cram[0]) + ' · skip ' + g1 + '→' + r2(g1 + E.skip[0]);
  }, B));

  await step('college: midterms after week ' + 5 + ' and finals; a game week costs 0.05, a major\'s classes 0.01 more; eligibility: under 2.0 at a report card sits 2 games at both levels, and the bench weeks play on', () => ev(([mkHs, mkCol]) => {
    const out = [];
    for (const lvl of ['hs', 'college']) {
      const c = lvl === 'hs' ? eval(mkHs)(4001) : eval(mkCol)(4002, 3, 3, 2); c.events.length = 0; for (const k of RATING_KEYS) c.r[k] = 80; ladderInit(c, 1); let n = 0, ex = null;
      while (!ex && n++ < 30) { c.events.length = 0; c.fatigue = 0; c.gpa = 2.1; amSimGame(c); ex = c.events.find(e => e.exam); }
      if (!ex || c.league.week !== (lvl === 'hs' ? HS.reportWeek : SCH.collegeMidWeek)) throw new Error(lvl + ': the midterm at week ' + (c.league && c.league.week));
      c.gpa = 2.1; stChoose(c, ex, 2); if (c.ineligible !== HS.ineligibleGames) throw new Error(lvl + ': 1.9 should sit ' + HS.ineligibleGames + ', sits ' + c.ineligible);
      const x1 = amSimGame(c); if (!x1 || !x1.ineligible) throw new Error(lvl + ': the next game is on the bench'); out.push(lvl + ' sits ' + HS.ineligibleGames);
    }
    const c = eval(mkCol)(4003, 3, 3, 1); c.gpa = 3; schoolGradeWeek(c); if (Math.abs(c.gpa - (3 - HS.gpaDrift)) > 1e-9) throw new Error('undecided: ' + c.gpa); c.degree.major = 'business'; c.gpa = 3; schoolGradeWeek(c); if (Math.abs(c.gpa - Math.round((3 - HS.gpaDrift - SCH.majorDrift) * 100) / 100) > 1e-9) throw new Error('a major: ' + c.gpa);
    return out.join(' · ') + ' · drift ' + HS.gpaDrift + ' (+' + SCH.majorDrift + ' with a major)';
  }, B));

  await step('academic probation (college, under 1.5): the arc opens after the report card; a study sprint or risk it; still under 2.0 at the next report card: the scholarship goes (full tuition) and 2 more games; back over 2.0: off probation; no probation in high school', () => ev(([mkHs, mkCol]) => {
    const keep = SAGA_ARCS.probation.chance; SAGA_ARCS.probation.chance = 1; const out = [];
    try {
      const h = eval(mkHs)(5001); sagaOf(h).quota = 99; h.gpa = 1.3; amReportCard(h, 'mid'); if (sagaOf(h).arcs.probation) throw new Error('no probation in high school');
      for (const path of ['risk', 'sprint']) {
        const c = eval(mkCol)(path === 'risk' ? 5002 : 5003, 3, 3, 2); c.events.length = 0; const S = sagaOf(c); S.quota = 99; c.gpa = 1.6; amReportCard(c, 'mid'); if (S.arcs.probation) throw new Error('1.6 is not probation');
        c.gpa = 1.4; amReportCard(c, 'mid'); const note = c.events.find(e => e.saga && e.saga.arc === 'probation'); if (!note || note.title !== 'ACADEMIC PROBATION' || !note.choice || note.choice.length !== 2) throw new Error('the probation card: ' + (note && note.title));
        if (c.events.indexOf(note) < c.events.findIndex(e => e.title === 'REPORT CARD')) throw new Error('probation comes after the report card');
        const g0 = c.gpa; stChoose(c, note, path === 'risk' ? 1 : 0); if (sagaFlag(c, 'probation') !== path) throw new Error('the flag: ' + sagaFlag(c, 'probation'));
        if (path === 'sprint') { if (Math.abs(c.gpa - Math.round((g0 + SG.probSprint) * 100) / 100) > 1e-9 || !c.sagaXp || c.sagaXp.mul !== SG.probSprintXp[0] || c.sagaXp.weeks !== SG.probSprintXp[1]) throw new Error('the sprint: ' + c.gpa + ' ' + JSON.stringify(c.sagaXp)); c.gpa = 2.2; }
        else c.gpa = 1.8;
        c.events.length = 0; c.ineligible = 0; amReportCard(c, 'end'); const hear = c.events.find(e => e.saga && e.saga.arc === 'probation');
        if (path === 'risk') { if (!hear || hear.title !== 'THE SCHOLARSHIP' || c.scholarship !== 'lost' || c.ineligible !== HS.ineligibleGames + SG.probGames || schoolTuitionOf(c) !== SCH.tuition) throw new Error('risked and still under 2.0: ' + (hear && hear.title) + ' · ' + c.scholarship + ' · sits ' + c.ineligible); }
        else if (!hear || hear.title !== 'OFF PROBATION' || c.scholarship === 'lost') throw new Error('the sprint worked: ' + (hear && hear.title) + ' · ' + c.scholarship);
        out.push(path + ': ' + hear.title.toLowerCase());
      }
    } finally { SAGA_ARCS.probation.chance = keep; }
    return out.join(' · ');
  }, B));

  await step('tuition: a full ride (3.5 and four stars) pays nothing; partial pays half of $12,000 at every college season\'s start, the first included; short of cash, a student loan; at the draft what you have pays it, and your first paychecks pay the rest', () => ev(([mkHs, mkCol]) => {
    const f = eval(mkCol)(6001, 3.6, 4, 2); if (f.scholarship !== 'full' || f.tuitionPaid || f.loan) throw new Error('a full ride: ' + f.scholarship + ' · paid ' + f.tuitionPaid);
    const g = eval(mkCol)(6002, 3.6, 3, 2); if (g.scholarship !== 'partial') throw new Error('three stars: partial'); const h = eval(mkCol)(6003, 3.4, 5, 2); if (h.scholarship !== 'partial') throw new Error('3.4: partial');
    const half = Math.round(SCH.tuition * SCH.partialShare); if (h.tuitionPaid !== half) throw new Error('the first season\'s tuition is due at commitment: ' + h.tuitionPaid);
    const p = eval(mkCol)(6004, 3, 3, 2); p.cash = 10000; p.loan = 0; schoolTuition(p); if (p.cash !== 10000 - half || p.loan !== 0) throw new Error('paid from cash: ' + p.cash + ' · loan ' + p.loan);
    p.cash = 2000; schoolTuition(p); if (p.cash !== 0 || p.loan !== half - 2000) throw new Error('short: a loan ' + p.loan); p.scholarship = 'lost'; p.cash = 0; schoolTuition(p); if (p.loan !== half - 2000 + SCH.tuition) throw new Error('no scholarship: full tuition');
    // the draft: what you have pays the loan, then your pay does
    const save = defaultSave(); const a = eval(mkCol)(6005, 3, 3, 2); a.loan = 40000; a.cash = 0; a.degree.major = 'comms'; a.degree.years = 3; a.age = 22; a.stage = 'combine'; a.events = []; const c = createCareerFromAmateur(save, a);
    const start = defaultMeShape().money; if (c.me.loanPaid !== Math.min(40000, start) || c.me.money !== Math.max(0, start - 40000) || c.me.loan !== Math.max(0, 40000 - start)) throw new Error('at the draft: paid ' + c.me.loanPaid + ' · money ' + c.me.money + ' · owed ' + c.me.loan);
    const owed = c.me.loan, m0 = c.me.money; earn(c, 100000); if (c.me.loan !== 0 || c.me.money !== m0 + 100000 - owed) throw new Error('the paycheck pays the rest: owed ' + c.me.loan + ' · money ' + c.me.money);
    if (!c.me.degree || c.me.degree.major !== 'comms' || c.me.degree.years !== 3) throw new Error('the degree comes along: ' + JSON.stringify(c.me.degree));
    return 'partial $' + half.toLocaleString() + ' a season · lost $' + SCH.tuition.toLocaleString() + ' · a $40,000 loan: $' + Math.min(40000, start).toLocaleString() + ' at the draft, $' + owed.toLocaleString() + ' from pay';
  }, B));

  await step('the major (a card at commitment; Undecided the default): Business NIL +10%, Communications hype +5, Kinesiology practice XP +3%; the degree (4 college seasons); summer classes in the pros ($20,000, once an offseason, practice XP −10% for 4 weeks); the ending\'s versions', () => ev(([mkHs, mkCol]) => {
    const c = eval(mkCol)(7001, 3, 3, 2); const card = c.events.find(e => e.major); if (!card || card.choice.length !== 4 || card.choice[card.choice.findIndex(x => x.def)].major !== 'undecided') throw new Error('the major\'s card');
    const h0 = c.hype || 0; stChoose(c, card, 1); if (c.degree.major !== 'comms' || Math.round(c.hype - h0) !== Math.min(SCH.majorHype, MD.hypeMax - h0)) throw new Error('communications: hype ' + h0 + '→' + c.hype);
    const nilOf = (major) => { const x = eval(mkCol)(7002, 3, 3, 2); x.degree.major = major; x.events.length = 0; const e = colNilOffer(x, { next: () => 0, int: () => 2, pick: a => a[0] }, 'game'); return e ? e.amount : 0; };
    const nb = nilOf('business'), nu = nilOf('undecided'); if (!(nb > 0) || Math.abs(nb / nu - (1 + SCH.majorNil)) > 0.02) throw new Error('business NIL ×' + (nb / nu).toFixed(3));
    const k = eval(mkCol)(7003, 3, 3, 2); k.degree.major = 'kinesiology'; if (Math.abs(schoolXpMul(k) - (1 + SCH.majorXp)) > 1e-9) throw new Error('kinesiology XP ×' + schoolXpMul(k)); k.degree.major = 'business'; if (schoolXpMul(k) !== 1) throw new Error('others: ×1');
    const d = eval(mkCol)(7004, 3, 3, 2); d.degree.years = 0; for (let i = 0; i < 5; i++) schoolYearDone(d); if (d.degree.years !== SCH.degreeYears || !schoolDegree(d)) throw new Error('four seasons, a degree: ' + d.degree.years);
    // the pros: summer classes
    const save = defaultSave(); const p = testProLeague(7005, save); p.me.degree = { major: 'kinesiology', years: 3, academic: false }; p.me.money = 100000; if (!schoolSummerOpen(p)) throw new Error('summer classes open');
    schoolSummerClasses(p); if (p.me.money !== 100000 - SCH.summerCost || p.me.degree.years !== 4 || !p.me.classXp || p.me.classXp.mul !== SCH.summerXp[0] || p.me.classXp.weeks !== SCH.summerXp[1]) throw new Error('summer classes: ' + p.me.money + ' · ' + p.me.degree.years + ' · ' + JSON.stringify(p.me.classXp));
    if (schoolSummerOpen(p) || schoolSummerClasses(p) !== null) throw new Error('graduated: no more classes'); p.me.degree.years = 2; if (schoolSummerOpen(p)) throw new Error('once an offseason');
    if (Math.abs(schoolXpMul(p.me) - (1 + SCH.summerXp[0])) > 1e-9) throw new Error('the summer\'s practice: ×' + schoolXpMul(p.me)); for (let i = 0; i < SCH.summerXp[1]; i++) schoolWeekSpent(p.me); if (p.me.classXp || schoolXpMul(p.me) !== 1) throw new Error('back to normal after ' + SCH.summerXp[1] + ' weeks');
    // the endings: the major and the degree pick the version
    const vers = []; for (const [deg, ending, want] of [[{ major: 'kinesiology', years: 4 }, 'coach', 'HEAD COACH'], [{ major: 'kinesiology', years: 3 }, 'coach', 'COACH'], [{ major: 'comms', years: 4 }, 'booth', 'IN THE BOOTH'], [{ major: 'business', years: 4 }, 'booth', 'ON THE RADIO'], [{ major: 'undecided', years: 1, academic: true }, 'booth', 'IN THE BOOTH']]) {
      const s2 = defaultSave(), q = testProLeague(7100 + vers.length, s2); s2.career = q; q.me.degree = deg; const E = proEpilogue(s2, { ending }); const t = proEndingText(E)[0]; if (t !== want) throw new Error(JSON.stringify(deg) + ' → ' + t + ', not ' + want); vers.push(t); }
    const s3 = defaultSave(), o = testProLeague(7200, s3); s3.career = o; o.me.degree = { major: 'business', years: 4 }; o.me.money = PR.stakeCost + 1; const E3 = proEpilogue(s3, { stake: true }); if (proEndingText(E3)[0] !== 'TEAM PRESIDENT') throw new Error('business and the stake: ' + proEndingText(E3)[0]);
    if (proEndingText({ ending: 'booth' })[0] !== 'IN THE BOOTH' || proEndingText({ ending: 'coach' })[0] !== 'COACH') throw new Error('an epilogue from before V9 keeps its version');
    return 'NIL ×' + (nb / nu).toFixed(2) + ' · XP ×' + (1 + SCH.majorXp) + ' · endings ' + vers.concat('TEAM PRESIDENT').join(', ');
  }, B));

  await step('old saves: a college career from before V9 gets a GPA, a scholarship (grandfathered: a full ride), its seasons toward the degree and the major\'s card; a pro save counts its college seasons; the hub and ME lines draw', () => ev(([mkHs, mkCol]) => {
    const c = eval(mkCol)(8001, 3, 3, 2); delete c.gpa; delete c.degree; delete c.scholarship; delete c.loan; c.stageYear = 3; c.events.length = 0; schoolFill(c);
    if (!(c.gpa >= 0 && c.gpa <= 4) || c.scholarship !== 'full' || c.degree.years !== 2 || c.degree.major !== null || !c.events.some(e => e.major)) throw new Error('an old college save: ' + JSON.stringify({ gpa: c.gpa, sch: c.scholarship, deg: c.degree, cards: c.events.map(e => e.title) }));
    schoolFill(c); if (c.events.filter(e => e.major).length !== 1) throw new Error('the major\'s card once');
    const save = defaultSave(), p = testProLeague(8002, save); delete p.me.degree; p.amateur = p.amateur || {}; p.amateur.log = [{ stage: 'hs' }, { stage: 'college' }, { stage: 'college' }]; const D = schoolDegreeOf(p); if (!D || D.years !== 2 || D.major !== 'undecided') throw new Error('an old pro save: ' + JSON.stringify(D));
    const lines = [schoolDegreeLine(c), schoolDegreeLine(p), hubWeekLine(c)]; if (lines.some(l => !l || /undefined|NaN/.test(l))) throw new Error('lines: ' + lines.join(' | '));
    return lines.join(' | ');
  }, B));

  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
