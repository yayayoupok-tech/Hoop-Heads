// V9 (Part 2 §3): GPA and school. Offers have GPA lines (no offer under one, and a report card under it pulls it);
// the report cards (the midterm and before the last game), at both levels; eligibility (under 2.0 you sit 2 games);
// academic probation in college (under 1.5) and the scholarship it can cost; tuition (a full ride, partial, lost), the
// student loan and how it's paid back; the degree; summer classes in the pros; old saves. 3.0 (§1) took out the exam
// weeks (Cram, Balanced, Skip: the report card comes on its own), the majors, probation's story arc (a line on the
// report card now) and the endings the degree picked (now OWNER or RETIRED, whatever the degree). (The §1.1 table with
// all of it: tests/difficulty.js.) Usage: node tests/school.js
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

  await step('report cards (high school; 3.0 §1: no exam week, so no MIDTERMS or FINALS WEEK card and no Cram, Balanced or Skip): the midterm\'s after the fifth game and the year\'s before the last, twice a season and never in the playoffs; no choice on them, and their week moves the GPA like any game week', () => ev(([mkHs]) => {
    const c = eval(mkHs)(3001); for (const k of RATING_KEYS) c.r[k] = 85; ladderInit(c, 1); c.gpa = 3; const L = c.league; let n = 0, mid = null, fin = null, seen = 0, g0 = 0;
    const card = () => c.events.find(e => e.title === 'REPORT CARD'), exams = () => c.events.concat(c.inbox || []).filter(e => e && (e.exam || /^(MIDTERMS|FINALS WEEK)$/.test(e.title))).map(e => e.title);
    while (!mid && n++ < 30) { c.events.length = 0; c.fatigue = 0; g0 = c.gpa; amSimGame(c); mid = card(); if (exams().length) throw new Error('3.0: no exam week: ' + exams()); }
    if (!mid || L.week !== HS.reportWeek || !/ at midterm\.$/.test(mid.lines[0])) throw new Error('the midterm after week ' + HS.reportWeek + ': week ' + L.week + ' · ' + (mid && mid.lines[0])); seen++;
    if (mid.choice || !mid.lines[0].startsWith('GPA ' + c.gpa.toFixed(2))) throw new Error('one card with the GPA, no choice: ' + mid.lines.join(' / ')); if (Math.abs(g0 - c.gpa - HS.gpaDrift) > 1e-9) throw new Error('the midterm\'s week: ' + g0 + '→' + c.gpa + ' (a game week is −' + HS.gpaDrift + ')');
    while (!fin && n++ < 40) { c.events.length = 0; c.fatigue = 0; g0 = c.gpa; amSimGame(c); const k = card(); if (k && / at midterm\.$/.test(k.lines[0])) throw new Error('a second midterm'); fin = k; }
    if (!fin || L.week !== L.schedule.length - 1 || !/ for the year\.$/.test(fin.lines[0]) || fin.choice) throw new Error('the year\'s before the last game: week ' + L.week + ' of ' + L.schedule.length + ' · ' + (fin && fin.lines[0])); seen++; if (Math.abs(g0 - c.gpa - HS.gpaDrift) > 1e-9) throw new Error('the finals\' week: ' + g0 + '→' + c.gpa);
    while (c.season === 1 && n++ < 60) { c.events.length = 0; c.fatigue = 0; if (c.summer && c.summer.pending) break; amSimGame(c); if (card()) seen++; }
    if (seen !== 2) throw new Error(seen + ' report cards in a season (playoffs included)');
    return 'midterm after week ' + HS.reportWeek + ' · the year\'s after week ' + (L.schedule.length - 1) + ' · −' + HS.gpaDrift + ' those weeks, like any game week';
  }, B));

  await step('college: the midterm report card after week ' + 5 + ' and the semester\'s before the last game; a game week costs 0.05 (3.0: no majors, so no 0.01 more for classes); eligibility: under 2.0 at a report card sits 2 games at both levels, and the bench weeks play on', () => ev(([mkHs, mkCol]) => {
    const out = [];
    for (const lvl of ['hs', 'college']) {
      const c = lvl === 'hs' ? eval(mkHs)(4001) : eval(mkCol)(4002, 3, 3, 2); c.events.length = 0; for (const k of RATING_KEYS) c.r[k] = 80; ladderInit(c, 1); let n = 0, ex = null; const card = () => c.events.find(e => e.title === 'REPORT CARD');
      while (!ex && n++ < 30) { c.events.length = 0; c.fatigue = 0; c.gpa = 1.5; amSimGame(c); ex = card(); } /* (a Study week by the coach's rule: 1.8 at the card) */
      if (!ex || c.league.week !== (lvl === 'hs' ? HS.reportWeek : SCH.collegeMidWeek) || ex.choice) throw new Error(lvl + ': the midterm at week ' + (c.league && c.league.week));
      const gc = c.gpa; if (!(gc < HS.gpaMin) || c.ineligible !== HS.ineligibleGames) throw new Error(lvl + ': ' + gc + ' should sit ' + HS.ineligibleGames + ', sits ' + c.ineligible);
      const x1 = amSimGame(c); if (!x1 || !x1.ineligible) throw new Error(lvl + ': the next game is on the bench'); out.push(lvl + ' sits ' + HS.ineligibleGames + ' at ' + gc.toFixed(2));
      if (lvl === 'college') { let fin = null; while (!fin && n++ < 40) { c.events.length = 0; c.fatigue = 0; amSimGame(c); fin = card(); } if (!fin || c.league.week !== c.league.schedule.length - 1 || !/ for the semester\.$/.test(fin.lines[0])) throw new Error('college: the semester\'s card before the last game: week ' + c.league.week + ' of ' + c.league.schedule.length); }
    }
    const c = eval(mkCol)(4003, 3, 3, 1); c.gpa = 3; schoolGradeWeek(c); if (Math.abs(c.gpa - (3 - HS.gpaDrift)) > 1e-9) throw new Error('a game week: ' + c.gpa); c.degree.major = 'business'; c.gpa = 3; schoolGradeWeek(c); if (Math.abs(c.gpa - (3 - HS.gpaDrift)) > 1e-9 || 'major' in c.degree) throw new Error('3.0: an old save\'s major is dropped and costs nothing: ' + c.gpa + ' · ' + JSON.stringify(c.degree));
    return out.join(' · ') + ' · drift ' + HS.gpaDrift + ' (no major)';
  }, B));

  await step('academic probation (college, under 1.5; 3.0 §1: a line on the report card, no story arc, so no study sprint to pick): a second report card under 1.5 in a row costs the scholarship (full tuition) with the 2 games of any card under 2.0; back over 1.5: off probation; no probation in high school', () => ev(([mkHs, mkCol]) => {
    const out = [], last = c => c.events.filter(e => e.title === 'REPORT CARD').pop(), says = (c, re) => { const k = last(c); return !!k && k.lines.some(l => re.test(l)); };
    const h = eval(mkHs)(5001); h.gpa = 1.3; amReportCard(h, 'mid'); amReportCard(h, 'end'); if (h.probation || says(h, /probation|scholarship/i)) throw new Error('no probation in high school');
    for (const path of ['twice', 'back']) {
      const c = eval(mkCol)(path === 'twice' ? 5002 : 5003, 3, 3, 2); c.events.length = 0; const sch = c.scholarship; c.gpa = 1.6; amReportCard(c, 'mid'); if (c.probation || says(c, /probation/i)) throw new Error('1.6 is not probation');
      c.gpa = 1.4; amReportCard(c, 'mid'); if (!c.probation || !says(c, /academic probation/) || last(c).choice || c.events.some(e => e.choice || e.kind === 'dialog')) throw new Error('the probation line (no choice): ' + c.events.map(e => e.title + ': ' + (e.lines || []).join(' / ')).join(' | '));
      c.events.length = 0; c.ineligible = 0; c.gpa = path === 'twice' ? 1.4 : 1.8; amReportCard(c, 'end');
      if (path === 'twice') { if (c.scholarship !== 'lost' || c.probation || !says(c, /lose your scholarship/) || c.ineligible !== HS.ineligibleGames || schoolTuitionOf(c) !== SCH.tuition) throw new Error('twice under 1.5: ' + c.scholarship + ' · sits ' + c.ineligible + ' · ' + last(c).lines.join(' / ')); out.push('twice: the ' + sch + ' scholarship goes, $' + SCH.tuition.toLocaleString() + ' a season'); }
      else { if (c.probation || c.scholarship !== sch || says(c, /probation|scholarship/i)) throw new Error('back over 1.5: probation ' + c.probation + ' · ' + c.scholarship); out.push('back over 1.5: off probation'); }
    }
    return out.join(' · ');
  }, B));

  await step('tuition: a full ride (3.5 and four stars) pays nothing; partial pays half of $12,000 at every college season\'s start, the first included; short of cash, a student loan; at the draft what you have pays it, and your first paychecks pay the rest; the degree comes along (3.0: no major)', () => ev(([mkHs, mkCol]) => {
    const f = eval(mkCol)(6001, 3.6, 4, 2); if (f.scholarship !== 'full' || f.tuitionPaid || f.loan) throw new Error('a full ride: ' + f.scholarship + ' · paid ' + f.tuitionPaid);
    const g = eval(mkCol)(6002, 3.6, 3, 2); if (g.scholarship !== 'partial') throw new Error('three stars: partial'); const h = eval(mkCol)(6003, 3.4, 5, 2); if (h.scholarship !== 'partial') throw new Error('3.4: partial');
    const half = Math.round(SCH.tuition * SCH.partialShare); if (h.tuitionPaid !== half) throw new Error('the first season\'s tuition is due at commitment: ' + h.tuitionPaid);
    const p = eval(mkCol)(6004, 3, 3, 2); p.cash = 10000; p.loan = 0; schoolTuition(p); if (p.cash !== 10000 - half || p.loan !== 0) throw new Error('paid from cash: ' + p.cash + ' · loan ' + p.loan);
    p.cash = 2000; schoolTuition(p); if (p.cash !== 0 || p.loan !== half - 2000) throw new Error('short: a loan ' + p.loan); p.scholarship = 'lost'; p.cash = 0; schoolTuition(p); if (p.loan !== half - 2000 + SCH.tuition) throw new Error('no scholarship: full tuition');
    // the draft: what you have pays the loan, then your pay does
    const save = defaultSave(); const a = eval(mkCol)(6005, 3, 3, 2); a.loan = 40000; a.cash = 0; a.degree.years = 3; a.age = 22; a.stage = 'combine'; a.events = []; const c = createCareerFromAmateur(save, a);
    const start = defaultMeShape().money; if (c.me.loanPaid !== Math.min(40000, start) || c.me.money !== Math.max(0, start - 40000) || c.me.loan !== Math.max(0, 40000 - start)) throw new Error('at the draft: paid ' + c.me.loanPaid + ' · money ' + c.me.money + ' · owed ' + c.me.loan);
    const owed = c.me.loan, m0 = c.me.money; earn(c, 100000); if (c.me.loan !== 0 || c.me.money !== m0 + 100000 - owed) throw new Error('the paycheck pays the rest: owed ' + c.me.loan + ' · money ' + c.me.money);
    if (!c.me.degree || c.me.degree.years !== 3 || c.me.degree.school !== a.college || 'major' in c.me.degree) throw new Error('the degree comes along (3.0: no major): ' + JSON.stringify(c.me.degree));
    return 'partial $' + half.toLocaleString() + ' a season · lost $' + SCH.tuition.toLocaleString() + ' · a $40,000 loan: $' + Math.min(40000, start).toLocaleString() + ' at the draft, $' + owed.toLocaleString() + ' from pay';
  }, B));

  await step('the degree (3.0 §1: no majors, so no card at commitment, and an old save\'s major is dropped and moves no NIL or practice XP): 4 college seasons; summer classes in the pros ($20,000, once an offseason, practice XP −10% for 4 weeks); the ending (3.0: OWNER with the stake, else RETIRED, whatever the degree)', () => ev(([mkHs, mkCol]) => {
    const c = eval(mkCol)(7001, 3, 3, 2); const card = c.events.find(e => e.major || e.id === 'major' || /MAJOR/.test(e.title || '')); if (card || 'major' in c.degree) throw new Error('3.0: no major at commitment: ' + (card ? card.title : JSON.stringify(c.degree)));
    const nilOf = (major) => { const x = eval(mkCol)(7002, 3, 3, 2); if (major) x.degree.major = major; x.events.length = 0; const e = colNilOffer(x, { next: () => 0, int: () => 2, pick: a => a[0] }, 'game'); return e ? e.amount : 0; };
    const nb = nilOf('business'), nu = nilOf(null); if (!(nu > 0) || nb !== nu) throw new Error('an old save\'s Business major: NIL $' + nb + ', $' + nu + ' without');
    const k = eval(mkCol)(7003, 3, 3, 2); k.degree.major = 'kinesiology'; if (schoolXpMul(k) !== 1) throw new Error('an old save\'s Kinesiology major: XP ×' + schoolXpMul(k));
    const d = eval(mkCol)(7004, 3, 3, 2); d.degree.years = 0; for (let i = 0; i < 5; i++) schoolYearDone(d); if (d.degree.years !== SCH.degreeYears || !schoolDegree(d)) throw new Error('four seasons, a degree: ' + d.degree.years);
    // the pros: summer classes
    const save = defaultSave(); const p = testProLeague(7005, save); p.me.degree = { years: 3, academic: false }; p.me.money = 100000; if (!schoolSummerOpen(p)) throw new Error('summer classes open');
    schoolSummerClasses(p); if (p.me.money !== 100000 - SCH.summerCost || p.me.degree.years !== 4 || !p.me.classXp || p.me.classXp.mul !== SCH.summerXp[0] || p.me.classXp.weeks !== SCH.summerXp[1]) throw new Error('summer classes: ' + p.me.money + ' · ' + p.me.degree.years + ' · ' + JSON.stringify(p.me.classXp));
    if (schoolSummerOpen(p) || schoolSummerClasses(p) !== null) throw new Error('graduated: no more classes'); p.me.degree.years = 2; if (schoolSummerOpen(p)) throw new Error('once an offseason');
    if (Math.abs(schoolXpMul(p.me) - (1 + SCH.summerXp[0])) > 1e-9) throw new Error('the summer\'s practice: ×' + schoolXpMul(p.me)); for (let i = 0; i < SCH.summerXp[1]; i++) schoolWeekSpent(p.me); if (p.me.classXp || schoolXpMul(p.me) !== 1) throw new Error('back to normal after ' + SCH.summerXp[1] + ' weeks');
    // the endings: 3.0 (§1) has two, and the degree picks neither
    const vers = []; for (const [deg, ending] of [[{ years: 4 }, 'coach'], [{ years: 1, academic: true }, 'booth'], [{ major: 'kinesiology', years: 4 }, 'coach'], [{ major: 'comms', years: 4 }, 'booth']]) {
      const s2 = defaultSave(), q = testProLeague(7100 + vers.length, s2); s2.career = q; q.me.degree = deg; const E = proEpilogue(s2, { ending }); const t = proEndingText(E)[0]; if (t !== 'RETIRED') throw new Error(JSON.stringify(deg) + ' → ' + t + ', not RETIRED'); vers.push(t); }
    const s3 = defaultSave(), o = testProLeague(7200, s3); s3.career = o; o.me.degree = { years: 4 }; o.me.money = PR.stakeCost + 1; const E3 = proEpilogue(s3, { stake: true }); if (proEndingText(E3)[0] !== 'OWNER') throw new Error('the stake: ' + proEndingText(E3)[0]);
    if (proEndingText({ ending: 'booth' })[0] !== 'RETIRED' || proEndingText({ ending: 'coach' })[0] !== 'RETIRED') throw new Error('an epilogue from before 3.0 (the booth, coaching) reads RETIRED');
    return 'NIL $' + nu.toLocaleString() + ' with or without an old major · degree in ' + SCH.degreeYears + ' · summer classes $' + SCH.summerCost.toLocaleString() + ' · endings ' + vers.length + '× RETIRED, OWNER with the stake';
  }, B));

  await step('old saves: a college career from before V9 gets a GPA, a scholarship (grandfathered: a full ride) and its seasons toward the degree (3.0 §1: no major\'s card; a 2.x save\'s major and its waiting major and exam cards are dropped); a pro save counts its college seasons; the hub and ME lines draw', () => ev(([mkHs, mkCol]) => {
    const c = eval(mkCol)(8001, 3, 3, 2); delete c.gpa; delete c.degree; delete c.scholarship; delete c.loan; c.stageYear = 3; c.events.length = 0; schoolFill(c);
    if (!(c.gpa >= 0 && c.gpa <= 4) || c.scholarship !== 'full' || c.degree.years !== 2 || 'major' in c.degree || c.events.length) throw new Error('an old college save: ' + JSON.stringify({ gpa: c.gpa, sch: c.scholarship, deg: c.degree, cards: c.events.map(e => e.title) }));
    const x = eval(mkCol)(8003, 3, 3, 2); x.degree = { major: 'comms', years: 2 }; x.events = [{ kind: 'dialog', id: 'major', major: true, title: 'PICK A MAJOR', who: 'coach', lines: ['The registrar needs a form from you.'], choice: [{ label: 'Communications', major: 'comms' }, { label: 'Undecided', major: 'undecided', def: true }] }, { kind: 'dialog', id: 'exam-mid', exam: 'mid', title: 'MIDTERMS', who: 'coach', lines: ['Midterms this week.'], choice: [{ label: 'Cram' }, { label: 'Balanced', def: true }, { label: 'Skip' }] }, { kind: 'story', icon: 'book', title: 'REPORT CARD', lines: ['GPA 3.00 (B) at midterm.'] }];
    x30Migrate({ c1: x }); schoolFill(x); if ('major' in x.degree || x.degree.years !== 2 || x.events.map(e => e.title).join() !== 'REPORT CARD') throw new Error('a 2.x college save: ' + JSON.stringify({ deg: x.degree, cards: x.events.map(e => e.title) }));
    const save = defaultSave(), p = testProLeague(8002, save); delete p.me.degree; p.amateur = p.amateur || {}; p.amateur.log = [{ stage: 'hs' }, { stage: 'college' }, { stage: 'college' }]; const D = schoolDegreeOf(p); if (!D || D.years !== 2 || 'major' in D) throw new Error('an old pro save: ' + JSON.stringify(D));
    p.me.degree = { major: 'kinesiology', years: 3, academic: false }; if ('major' in schoolDegreeOf(p) || schoolDegreeOf(p).years !== 3) throw new Error('a 2.x pro save\'s major: ' + JSON.stringify(p.me.degree)); p.me.degree = D;
    const lines = [schoolDegreeLine(c), schoolDegreeLine(p), hubWeekLine(c)]; if (lines.some(l => !l || /undefined|NaN/.test(l))) throw new Error('lines: ' + lines.join(' | '));
    return lines.join(' | ');
  }, B));

  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
