// V6 (Hoop Heads 2.0, Part 2 §1.2–§1.3): the rules of the climb. The XP curve and the soft ceiling of your hidden
// potential, game XP by grade (simmed games pay half), the weekly practice load cap, injuries that cost rating points
// for good, slumps, the competition at each level, the depth chart's takeover gap and the 5★ scarcity (bars, one open
// spot a season, named rivals). The §1.1 outcomes are tests/difficulty.js. Usage: node tests/climb.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('climb'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);

  await step('the XP curve (§1.2): each +1 costs 20 × 1.11^(rating − 40); 40 → 60 is quick, 80 → 90 costs 8× the 60 → 70 stretch; past your potential ×3', () => ev(() => {
    const X = CR.xpCurve; if (X.base !== 20 || X.growth !== 1.11 || X.from !== 40) throw new Error('curve ' + JSON.stringify(X));
    const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
    for (const p of [40, 55, 63, 80, 94]) if (!near(xpPointCost(p, null), 20 * Math.pow(1.11, p - 40))) throw new Error('cost at ' + p);
    const span = (a, b, pot) => { let t = 0; for (let p = a; p < b; p++) t += xpPointCost(p, pot); return t; };
    const quick = span(40, 60), mid = span(60, 70), top = span(80, 90), ratio = top / mid; if (!(ratio > 7.9 && ratio < 8.2)) throw new Error('80→90 vs 60→70: ' + ratio.toFixed(2));
    if (!(quick < mid)) throw new Error('40→60 (' + Math.round(quick) + ') should cost less than 60→70 (' + Math.round(mid) + ')');
    if (!near(xpPointCost(70, 70), CR.potMul * xpPointCost(70, null)) || !near(xpPointCost(69, 70), xpPointCost(69, null)) || CR.potMul !== 3) throw new Error('past potential ×3');
    let s = 0; for (let i = 0; i < CR.xpStep; i++) s += xpPointCost(62 + i, null); if (!near(xpNeed(62, null), s)) throw new Error('a step sums its points');
    // the same XP buys a third as much past the ceiling
    const caps = Object.fromEntries(RATING_KEYS.map(k => [k, 99])); const r1 = Object.fromEntries(RATING_KEYS.map(k => [k, 70])), r2 = Object.assign({}, r1);
    const add = { sho: xpNeed(70, null) + xpNeed(70 + CR.xpStep, null) + 1 }, pots = Object.fromEntries(RATING_KEYS.map(k => [k, null])); spendXp(r1, {}, caps, add, pots); spendXp(r2, {}, caps, add, Object.assign({}, pots, { sho: 70 }));
    if (!(r1.sho === 70 + 2 * CR.xpStep && r2.sho === 70)) throw new Error('two steps of XP: ' + r1.sho + ' under no ceiling, ' + r2.sho + ' past it (want 80 and 70)');
    return '40→60 ' + Math.round(quick) + ' XP · 60→70 ' + Math.round(mid) + ' · 80→90 ' + Math.round(top) + ' (' + ratio.toFixed(1) + '×)';
  }));

  await step('potential (§1.2): a hidden soft ceiling for each skill, rolled from the seed, never under a rating; the body keeps its genetic caps; old saves get one', () => ev(() => {
    const P = AMC.pot, sk = ['sho', 'fin', 'han', 'def'], all = [];
    for (let s = 1; s <= 200; s++) { const a = amCreate(defaultSave(), { name: 'Pot ' + s, look: PRESET_LOOKS[s % 16], number: 1, style: 'slasher', seed: s * 7919 });
      if (!a.pot) throw new Error('no potential (seed ' + s + ')'); for (const k of PHYS_KEYS) if (a.pot[k] != null) throw new Error('the body has no potential: ' + k);
      for (const k of sk) { const v = a.pot[k]; if (!(v >= P.min && v <= P.max) || v < a.r[k]) throw new Error('pot ' + k + ' ' + v + ' (rating ' + a.r[k] + ')'); all.push(v); }
      if (JSON.stringify(potRoll(a.seed, a.r)) !== JSON.stringify(a.pot)) throw new Error('the roll should come from the seed'); }
    const mean = all.reduce((x, y) => x + y, 0) / all.length; if (Math.abs(mean - P.mean) > 2) throw new Error('mean potential ' + mean.toFixed(1) + ' vs ' + P.mean);
    // Late Bloomer's head raises it; potsOf respects the caps
    const a = amCreate(defaultSave(), { name: 'Bloomer', look: PRESET_LOOKS[2], number: 2, style: 'shooter', seed: 77 }); const base = potsOf(a, a.caps); a.tr = { sig: 'latebloomer', lv: { latebloomer: 1 } }; const up = potsOf(a, a.caps);
    if (!(up.sho > base.sho || up.sho === a.caps.sho)) throw new Error('Late Bloomer should lift the ceiling'); if (up.spd != null) throw new Error('no skill potential for Speed');
    // an old amateur save and an old pro save roll one, the same as a fresh roll
    const o = amCreate(defaultSave(), { name: 'Old', look: PRESET_LOOKS[5], number: 5, style: 'post', seed: 4242 }); const want = JSON.stringify(potRoll(o.seed, o.r)); delete o.pot; amRepair(o); if (JSON.stringify(o.pot) !== want) throw new Error('amateur migration');
    const c = testProLeague(41); delete c.me.pot; repairCareer(c); if (!c.me.pot || Object.keys(c.me.pot).length !== sk.length) throw new Error('pro migration: ' + JSON.stringify(c.me.pot));
    return 'mean ' + mean.toFixed(1) + ' (' + Math.min(...all) + '–' + Math.max(...all) + '), grade ' + potGrade(mean);
  }));

  await step('game XP (§1.2): × the grade (A 1.5 · B 1.2 · C 1 · D 0.6 · F 0.3); a simmed game × 0.5', () => ev(() => {
    const G = CR.gradeXp, want = { 'A+': 1.5, A: 1.5, 'B+': 1.2, B: 1.2, C: 1, D: 0.6, F: 0.3 }; for (const k in want) if (G[k] !== want[k]) throw new Error('grade ' + k + ' pays ' + G[k]); if (CR.xpGame.simmed !== 0.5) throw new Error('simmed ' + CR.xpGame.simmed);
    const caps = Object.fromEntries(RATING_KEYS.map(k => [k, 99])), st = { pts: 12, reb: 4, stl: 1, blk: 1, fgm: 6, tpm: 2, dunkM: 1 };
    const pool = (grade, simmed) => developFromGame(Object.fromEntries(RATING_KEYS.map(k => [k, 50])), {}, caps, null, 20, st, true, simmed, 1, 1, null, 1, grade).pool;
    const c0 = pool('C', false); for (const k in want) if (Math.abs(pool(k, false) / c0 - want[k]) > 1e-9) throw new Error('pool × ' + (pool(k, false) / c0) + ' for ' + k);
    if (Math.abs(pool('C', true) / c0 - 0.5) > 1e-9) throw new Error('simmed pool × ' + pool('C', true) / c0);
    if (xpMulText('A', true) !== 'grade A ×1.5 · simmed ×0.5') throw new Error('result line: ' + xpMulText('A', true));
    return 'C pool ' + c0.toFixed(1) + ' · A ' + pool('A', false).toFixed(1) + ' · F ' + pool('F', false).toFixed(1) + ' · simmed C ' + pool('C', true).toFixed(1);
  }));

  await step('the practice load cap (§1.2): a week pays at most 1.25 × a normal week; past it, practice turns into fatigue', () => ev(() => {
    const a = wkLoadCap(100, 100), b = wkLoadCap(200, 100); if (a.xp !== 100 || a.fatigue !== 0) throw new Error('under the cap'); if (b.xp !== 125 || Math.abs(b.fatigue - WK.loadFatigue * 0.75) > 1e-9) throw new Error('over: ' + JSON.stringify(b));
    const c = amCreate(defaultSave(), { name: 'Grinder', look: PRESET_LOOKS[1], number: 8, style: 'shooter', seed: 515 }); c.fatigue = 0;
    const normal = amSessionXp(c, 'normal'), hard = amSessionXp(c, 'hard'); const r1 = amPractice(c, 'shooting', 'normal', normal); if (r1.loadFatigue) throw new Error('a normal session is under the cap');
    c.wk = {}; c.fatigue = 0; const r2 = amPractice(c, 'shooting', 'hard', hard); const capX = WK.loadCap * normal; if (!(r2.loadFatigue > 0 && Math.abs(r2.xp - capX) < 1)) throw new Error('a hard session: ' + r2.xp + ' XP (cap ' + capX.toFixed(1) + '), +' + r2.loadFatigue + ' fatigue');
    // a played drill is measured against a drill played to an average score, not the simmed session
    c.wk = {}; c.fatigue = 0; const avg = amDrillXp(c, 'shooting', 'normal', WK.drillGreat.shooting * WK.loadDrillRef); const r3 = amPractice(c, 'shooting', 'normal', avg, true); if (r3.loadFatigue) throw new Error('an average drill is under the cap');
    c.wk = {}; c.fatigue = 0; const great = amDrillXp(c, 'shooting', 'hard', 999); const r4 = amPractice(c, 'shooting', 'hard', great, true); if (!(r4.loadFatigue > 0 && r4.loadFatigue < 15)) throw new Error('a great hard drill: +' + r4.loadFatigue + ' fatigue');
    const p = testProLeague(43); p.me.fatigue = 0; const pn = proSessionXp(p, 'shooting', 'normal'), r5 = proPractice(p, 'shooting', 'hard', proSessionXp(p, 'shooting', 'hard')); if (!(r5.loadFatigue > 0)) throw new Error('the pro cap');
    if (Math.abs(r5.xp - WK.loadCap * pn) > 1) throw new Error('pro capped XP ' + r5.xp + ' vs ' + (WK.loadCap * pn).toFixed(1));
    return 'hard session +' + r2.loadFatigue + ' fatigue · great hard drill ' + Math.round(great) + ' → ' + Math.round(r4.xp) + ' XP, +' + r4.loadFatigue + ' fatigue';
  }));

  await step('setbacks (§1.2): an injury can cost 1–3 rating points for good, longer ones more often; nutrition & physio cut the odds', () => ev(() => {
    const L = WK.injuryLoss; if (JSON.stringify(L.odds) !== '[0.25,0.5,0.85]') throw new Error('odds ' + JSON.stringify(L.odds));
    const rng = new RNG(5), by = {}, pts = new Set(); for (let i = 0; i < 6000; i++) { const B = {}; const inj = wkInjure(B, rng); const g = inj.games; const b = by[g] || (by[g] = [0, 0]); b[0]++; if (inj.loss) { b[1]++; pts.add(inj.loss.pts); const [lo, hi] = L.pts[clamp(g - 1, 0, 2)]; if (inj.loss.pts < lo || inj.loss.pts > hi) throw new Error(g + ' games: ' + inj.loss.pts + ' points'); if (!['spd', 'jmp'].includes(inj.loss.k)) throw new Error('the loss hits ' + inj.loss.k); } }
    for (const g in by) { const want = L.odds[clamp(g - 1, 0, 2)], got = by[g][1] / by[g][0]; if (Math.abs(got - want) > 0.04) throw new Error(g + '-game injuries cost points ' + (100 * got).toFixed(0) + '% (want ' + 100 * want + '%)'); }
    if (Math.min(...pts) !== 1 || Math.max(...pts) !== 3) throw new Error('points ' + [...pts]);
    let n0 = 0, n1 = 0; const r2 = new RNG(6), r3 = new RNG(6); for (let i = 0; i < 4000; i++) { if (wkInjure({}, r2).loss) n0++; if (wkInjure({ staff: { nutrition: 1 } }, r3).loss) n1++; } if (!(n1 < n0 * (PR.nutritionInjury + 0.1))) throw new Error('nutrition: ' + n1 + ' vs ' + n0);
    // it comes off the rating once, and says so
    const c = amCreate(defaultSave(), { name: 'Hurt', look: PRESET_LOOKS[3], number: 3, style: 'slasher', seed: 616 }); c.injury = { name: 'Knee sprain', games: 3, loss: { k: 'jmp', pts: 2 } }; const before = c.r.jmp; const got = injuryLossApply(c);
    if (!got || c.r.jmp !== before - 2 || injuryLossApply(c)) throw new Error('applied once: ' + before + ' → ' + c.r.jmp); if (injLossText(c.injury) !== ', and −2 Hops for good') throw new Error('text: ' + injLossText(c.injury));
    return Object.keys(by).map(g => g + ' game' + (g > 1 ? 's' : '') + ' ' + (100 * by[g][1] / by[g][0]).toFixed(0) + '%').join(' · ') + ' · nutrition ' + n1 + ' vs ' + n0;
  }));

  await step('a slump (§1.2): 3 games graded D or F drop confidence and Shooting until a game graded B or better; Ice Veins never slumps', () => ev(() => {
    const M = MD.slump; const c = amCreate(defaultSave(), { name: 'Cold', look: PRESET_LOOKS[8], number: 8, style: 'shooter', seed: 717 }); c.confidence = 3; c.events = [];
    const sho0 = wkEff(c.r, c.height, c).sho; const seq = ['D', 'F', 'C', 'D', 'F']; const out = seq.map(g => slumpAfterGame(c, g)); if (out.some(x => x)) throw new Error('a C breaks the run: ' + out);
    if (slumpAfterGame(c, 'D') !== 'start' || !c.slump.on) throw new Error('the third straight D/F starts it'); if (c.confidence > M.conf) throw new Error('confidence ' + c.confidence);
    const sho1 = wkEff(c.r, c.height, c).sho; if (Math.abs(sho1 - (sho0 + M.sho + confShoOf(c) - confShoOf({ confidence: 3 }))) > 1e-9) throw new Error('Shooting ' + sho0 + ' → ' + sho1);
    if (slumpAfterGame(c, 'C') || !c.slump.on) throw new Error('a C does not end it'); if (slumpAfterGame(c, 'B') !== 'end' || c.slump.on) throw new Error('a B ends it');
    const iv = amCreate(defaultSave(), { name: 'Ice', look: PRESET_LOOKS[9], number: 9, style: 'shooter', seed: 818 }); iv.tr = { sig: 'iceveins', lv: {} }; iv.confidence = 2; for (let i = 0; i < 5; i++) if (slumpAfterGame(iv, 'F')) throw new Error('Ice Veins slumped'); if (iv.confidence !== 2) throw new Error('Ice Veins lost confidence');
    if (!/SLUMP/.test(slumpText('start')) || !slumpText('end')) throw new Error('the result lines');
    return 'Shooting ' + sho0.toFixed(1) + ' → ' + sho1.toFixed(1) + ' in the slump';
  }));

  await step('the competition (§1.2): high school about 50, college about 63, the pros about 74, the stars about 8 above', () => ev(() => {
    const med = xs => { const s = xs.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; }, hs = [], top = [], col = [];
    for (let s = 1; s <= 40; s++) { const a = amCreate(defaultSave(), { name: 'League ' + s, look: PRESET_LOOKS[s % 16], number: 1, style: 'slasher', seed: 999 + s * 31 }); hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); const y0 = a.stageYear; for (let y = 1; y <= 4; y++) { a.stageYear = y; hs.push(amStageMean(a)); } a.stageYear = y0;
      const o = (a.league.opps || []).map(x => ovrOf(x.r, x.height)).sort((x, y) => y - x); if (o.length) top.push(o[0] - med(o)); }
    for (let y = 1; y <= 2; y++) for (const t of [1, 2]) col.push(AMC.stageMean.college + AMC.stageMean.collegePerYear * (y - 1) + AMC.stageMean.collegePerTier * t);
    const H = hs.reduce((x, y) => x + y, 0) / hs.length, C = col.reduce((x, y) => x + y, 0) / col.length, T = top.reduce((x, y) => x + y, 0) / top.length;
    if (Math.abs(H - 50) > 3) throw new Error('high school ' + H.toFixed(1)); if (Math.abs(C - 63) > 3) throw new Error('college ' + C.toFixed(1)); if (!(T > 4 && T < 12)) throw new Error('the best high school opponent is ' + T.toFixed(1) + ' over the middle');
    let pro = [], best = []; for (let sd = 1; sd <= 20; sd++) { const c = testProLeague(sd * 97); const o = c.active.filter(id => id !== c.meId).map(id => recOvr(c.players[id])).sort((x, y) => y - x); pro = pro.concat(o); best.push((o[0] + o[1] + o[2]) / 3); }
    const P = med(pro), B = best.reduce((x, y) => x + y, 0) / best.length; if (Math.abs(P - 74) > 3) throw new Error('the pros: median ' + P); if (!(B >= 80 && B <= 90)) throw new Error('the pro stars (each league\'s top three) ' + B.toFixed(1));
    return 'high school ' + H.toFixed(1) + ' (best +' + T.toFixed(1) + ') · college ' + C.toFixed(1) + ' · pros ' + P + ', each league\'s top three ' + B.toFixed(1);
  }));

  await step('scarcity (§1.3): bars 72 · 78 · 84, and a 5★ team also wants a playoff series won or All-League in the last two seasons; each 5★ team opens at most one spot a season, chased by 2–3 named rivals', () => ev(() => {
    if (JSON.stringify(FRN.bar.slice(2)) !== '[72,78,84]') throw new Error('bars ' + FRN.bar); if (frCap(71.9) !== 2 || frCap(72) !== 3 || frCap(77.9) !== 3 || frCap(78) !== 4 || frCap(84) !== 5) throw new Error('frCap');
    const c = testProLeague(47); const me = meOf(c); for (const k of RATING_KEYS) me.r[k] = 88; c.me.fame = 60; c.me.hype = 0; c.me.awards = []; c.me.poWins = {};
    if (frCap(frValue(c)) !== 5 || frCapOf(c) !== 4) throw new Error('value ' + frValue(c).toFixed(1) + ' without the condition: cap ' + frCapOf(c));
    c.me.poWins[c.season] = 1; if (frCapOf(c) !== 5) throw new Error('a playoff series won opens 5★'); c.me.poWins = {}; c.me.awards.push({ s: c.season - 1, name: 'All-League 1st Team' }); if (frCapOf(c) !== 5) throw new Error('All-League last season opens 5★'); c.me.awards = [{ s: c.season - 2, name: 'All-League 1st Team' }]; if (frCapOf(c) !== 4) throw new Error('only the last two seasons count');
    const leagueNames = new Set(c.active.map(id => c.players[id].name)); let teamSeasons = 0, open = 0; const s0 = c.season;
    for (let s = s0; s < s0 + 150; s++) { c.season = s; c.frSpots = null; const S = frSpots5(c), fives = frByStars(frTable(c), 5); teamSeasons += fives.length;
      for (const id of Object.keys(S.open)) { if (!fives.includes(id)) throw new Error('a spot on a ' + frStars(c, id) + '★ team'); const sp = S.open[id]; open++; if (sp.rivals.length < FRN.spot5Rivals[0] || sp.rivals.length > FRN.spot5Rivals[1]) throw new Error(sp.rivals.length + ' rivals'); const names = sp.rivals.map(r => r.name); if (new Set(names).size !== names.length || names.some(n => !n || leagueNames.has(n))) throw new Error('rival names ' + names); }
      if (Object.keys(S.open).length > fives.length) throw new Error('more spots than 5★ teams'); }
    c.season = s0; c.frSpots = null; const rate = open / teamSeasons; if (Math.abs(rate - FRN.spot5Odds) > 0.08) throw new Error('spots open ' + (100 * rate).toFixed(0) + '% of 5★ team-seasons (want ' + 100 * FRN.spot5Odds + '%)');
    // you get a spot only by beating its best rival; the rest go to the rivals, with the news
    let S = frSpots5(c); let k = 0; while (!Object.keys(S.open).length && k++ < 40) { c.season++; c.frSpots = null; S = frSpots5(c); } const id = Object.keys(S.open)[0], best = S.open[id].rivals[0].val;
    const v0 = frValue(c); for (const kk of RATING_KEYS) me.r[kk] = 50; const low = frValue(c); if (frSpotWin(c)) throw new Error('value ' + low.toFixed(1) + ' won a spot over ' + best);
    for (const kk of RATING_KEYS) me.r[kk] = 99; c.me.fame = 100; if (frValue(c) > best && frSpotWin(c) !== id) throw new Error('value ' + frValue(c).toFixed(1) + ' should win the spot over ' + best);
    const line = frSpotsLine(c) || ''; if (!line.includes(clubOf(id).name) || !line.includes(S.open[id].rivals[0].name)) throw new Error('the free agency line should name the team and its best rival: ' + line);
    const n0 = c.news.length; frSpotsSettle(c, null); if (!S.open[id].taken || S.open[id].taken === 'me') throw new Error('settled to ' + S.open[id].taken); if (!c.news.slice(0, c.news.length - n0 + 1).some(n => /fill their open spot with/.test(n.t))) throw new Error('no news of the signing');
    return 'spots open in ' + (100 * rate).toFixed(0) + '% of 5★ team-seasons · rivals ' + S.open[id].rivals.map(r => r.name + ' ' + r.val).join(', ') + ' · value ' + v0.toFixed(1);
  }));

  await step('the depth chart: a won challenge takes the spot only within team.takeGap (2) OVR of the teammate; further off, the teammate keeps it for now', () => ev(() => {
    const c = amCreate(defaultSave(), { name: 'Takeover', look: PRESET_LOOKS[6], number: 6, style: 'lockdown', seed: 2468 }); hsTryoutDrill(c, 30); hsTryoutGame(c, true, 7, 0); c.events.length = 0;
    ladderInit(c, 2); const st = ladderOf(c)[0], m = ladderMate(c, st), myO = myChallengeOvr(c); const setOvr = v => { const d = v - tmMateOvr(m); for (const k of RATING_KEYS) m.r[k] = clamp(m.r[k] + d, 1, 99); };
    setOvr(myO + TM.takeGap + 3); let r = ladderResolve(c, st, true, 'you'); if (!r || !r.held || ladderRank(c) !== 2) throw new Error('3 past the gap: the starter keeps it (' + JSON.stringify(r && { held: r.held, rank: ladderRank(c) }) + ')');
    setOvr(myO + TM.takeGap - 1); r = ladderResolve(c, st, true, 'you'); if (!r || r.held || ladderRank(c) !== 1) throw new Error('within the gap: the start is yours (rank ' + ladderRank(c) + ')');
    return 'takeGap ' + TM.takeGap;
  }));

  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
