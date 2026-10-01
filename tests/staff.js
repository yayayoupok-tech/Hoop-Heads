// V10 (Part 2 §4): your staff. Six roles, one person each, hired from three candidates a role (1–5★ by your fame, a
// personality, a salary a season); contracts that end and re-sign; buyouts; salaries every week and the agent's cut;
// what each role does; a rival's call and a shady agent's scandal; saves from before V10; the staff room on a desktop
// and a phone. (The balance table: tests/careersim.js --spend=smart|none, --staff=only:<role>.) Usage: node tests/staff.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('staff'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  // A pro league with an empty staff, money in the bank and fame 50 (4★ will talk to you).
  const mk = `(seed => { const save = defaultSave(), c = testProLeague(seed, save); save.career = c; c.events.length = 0; c.me.staff = null; c.me.agent = null; staffOf(c); c.me.money = 2e7; c.me.fame = 50; return c; })`;

  await step('six roles; three candidates a role, the best at the tier your fame reaches (1–2★ always, 3★ at 25, 4★ at 45, 5★ at 65); salaries by tier (±10%; Loyal ×0.95, Ambitious ×1.05), none for an agent; a new pool every season', () => ev(mk => {
    const c = eval(mk)(41), S = staffOf(c), bad = [], tiers = {}, pers = {};
    if (STAFF_ROLES.join() !== 'agent,skills,strength,physio,nutrition,mental') bad.push('roles ' + STAFF_ROLES);
    for (const [fame, top] of [[0, 2], [24, 2], [25, 3], [44, 3], [45, 4], [64, 4], [65, 5], [100, 5]]) { c.me.fame = fame; if (staffMaxTier(c) !== top) bad.push('fame ' + fame + ' → ' + staffMaxTier(c) + '★'); }
    c.me.fame = 50; const s0 = c.season;
    for (let k = 0; k < 25; k++) { c.season = s0 + k; for (const r of STAFF_ROLES) { const pool = staffPool(c, r); if (pool.length !== SF.pool) bad.push(r + ': ' + pool.length + ' candidates'); if (pool[0].tier !== 4) bad.push(r + ': the best is ' + pool[0].tier + '★ at fame 50');
      for (const p of pool) { tiers[p.tier] = (tiers[p.tier] || 0) + 1; pers[p.pers] = (pers[p.pers] || 0) + 1; if (p.tier > 4) bad.push('a ' + p.tier + '★ at fame 50'); if (!(r === 'agent' ? STAFF_PERS.agent : STAFF_PERS.other).includes(p.pers)) bad.push(r + ' ' + p.pers);
        if (r === 'agent') { if (p.salary) bad.push('an agent with a salary'); continue; } const base = SF.salary[p.tier] * (p.pers === 'loyal' ? SF.loyalSalary : p.pers === 'ambitious' ? SF.ambitiousSalary : 1); if (p.salary < base * (1 - SF.salaryJitter) - 5000 || p.salary > base * (1 + SF.salaryJitter) + 5000) bad.push(p.tier + '★ ' + p.pers + ' at ' + p.salary); } } }
    c.season = s0; const a = staffPool(c, 'skills').map(p => p.name).join(); c.season++; if (staffPool(c, 'skills').map(p => p.name).join() === a) bad.push('the same skills coaches next season'); c.season = s0;
    if (bad.length) throw new Error(bad.slice(0, 5).join(' | ')); return 'tiers ' + JSON.stringify(tiers) + ' · personalities ' + JSON.stringify(pers);
  }, mk));

  await step('hiring takes a season\'s salary in the bank (an agent takes a cut instead); a hire takes the role (the one before leaves) and refreshes its pool; letting someone go mid-contract costs a quarter of a season\'s salary', () => ev(mk => {
    const c = eval(mk)(42), S = staffOf(c), M = c.me, bad = [];
    const p = staffPool(c, 'physio')[0]; M.money = p.salary - 1; if (staffCanHire(c, p) || staffHire(c, 'physio', 0)) bad.push('hired with ' + M.money + ' for ' + p.salary);
    M.money = p.salary; const h = staffHire(c, 'physio', 0); if (!h || S.physio !== h || h.years !== SF.years || h.up || S.pool.physio) bad.push('the hire');
    if (M.money !== p.salary) bad.push('a hire is paid by the week, not up front');
    M.fame = 10; const top = staffPool(c, 'skills').find(x => x.tier > staffMaxTier(c)); M.fame = 50; const hi = staffPool(c, 'skills')[0]; M.fame = 10; if (staffCanHire(c, hi) && hi.tier > 2) bad.push('a ' + hi.tier + '★ at fame 10'); M.fame = 50;
    M.money = 0; const ag = staffHire(c, 'agent', 0); if (!ag || M.agent !== ag.name) bad.push('an agent needs no money');
    M.money = 1e7; const nxt = staffPool(c, 'physio')[1], buy = staffBuyout(c, 'physio'); if (buy !== Math.round(h.salary * SF.buyout / 1000) * 1000) bad.push('buyout ' + buy);
    staffHire(c, 'physio', 1); if (S.physio.name !== nxt.name || M.money !== 1e7 - buy) bad.push('hiring over a staffer pays their buyout: ' + (1e7 - M.money));
    const m1 = M.money, b2 = staffBuyout(c, 'physio'); staffFire(c, 'physio'); if (S.physio || M.money !== m1 - b2) bad.push('the firing');
    if (staffBuyout(c, 'agent') !== 0) bad.push('an agent has no buyout'); proFireAgent(c); if (S.agent || M.agent) bad.push('part ways with the agent');
    if (bad.length) throw new Error(bad.slice(0, 5).join(' | ')); return 'buyout ' + fmtMoney(buy) + ' on ' + fmtMoney(h.salary);
  }, mk));

  await step('contracts run two seasons; one that\'s up waits for you in the offseason (re-sign at +10% or let them go for free) and re-signs itself at the next season\'s start', () => ev(mk => {
    const c = eval(mk)(43), S = staffOf(c), bad = [], s = staffHire(c, 'skills', 0), pay0 = s.salary;
    staffSeasonEnd(c); if (s.years !== 1 || s.up) bad.push('after one season: ' + s.years + (s.up ? ' up' : ''));
    staffSeasonEnd(c); if (s.years !== 0 || !s.up) bad.push('after two: ' + s.years); if (staffBuyout(c, 'skills') !== 0) bad.push('a contract that\'s up is free to end');
    staffSeasonStart(c); if (s.up || s.years !== SF.years || s.salary !== staffResignPay({ salary: pay0 }) || s.salary !== Math.round(pay0 * (1 + SF.raise) / 10000) * 10000) bad.push('the automatic re-signing: ' + s.salary + ' from ' + pay0);
    staffSeasonEnd(c); staffSeasonEnd(c); const p1 = s.salary; staffResign(c, 'skills'); if (s.up || s.salary !== staffResignPay({ salary: p1 })) bad.push('re-sign by hand');
    staffSeasonEnd(c); staffSeasonEnd(c); const m0 = c.me.money; staffFire(c, 'skills'); if (S.skills || c.me.money !== m0) bad.push('letting them go when it\'s up');
    if (!c.timeline || !c.timeline.some(t => /Re-signed skills coach/.test(t.text || t.t || JSON.stringify(t)))) bad.push('the timeline line');
    if (bad.length) throw new Error(bad.join(' | ')); return fmtMoney(pay0) + ' → ' + fmtMoney(staffResignPay({ salary: pay0 }));
  }, mk));

  await step('salaries come out every week (a season\'s worth over the season); the agent takes a cut of your salary and your sponsors; when the money runs out everyone on a salary goes (the agent stays)', () => ev(mk => {
    const c = eval(mk)(44), S = staffOf(c), M = c.me, bad = [], rng = new RNG(4);
    S.skills = staffMake(c, 'skills', 3, 'oldschool', rng); S.physio = staffMake(c, 'physio', 2, 'players', rng); const season = S.skills.salary + S.physio.salary;
    if (staffSeasonCost(c) !== season || proStaffCost(M, c) !== Math.round(season / c.seasonLength)) bad.push('a week of staff ' + proStaffCost(M, c));
    M.endorsements = [{ brand: 'X', what: 'y', weekly: 10000, weeks: 5 }]; M.sponsorCut = 0; M.hype = 0; const m0 = M.money, rec = {}; weeklyFinance(c, rec); if (rec.staffCost !== proStaffCost(M, c)) bad.push('the week\'s staff line ' + rec.staffCost);
    const e0 = rec.endorse; S.agent = staffMake(c, 'agent', 4, 'straight', rng); M.endorsements = [{ brand: 'X', what: 'y', weekly: 10000, weeks: 5 }]; const rec2 = {}; weeklyFinance(c, rec2);
    if (rec2.endorse !== Math.round(e0 * (1 - SF.agentCut[4]))) bad.push('the agent\'s cut of sponsors: ' + rec2.endorse + ' of ' + e0);
    const sw = salaryWeek(c); if (sw !== Math.round(M.contract.salary / c.seasonLength * (1 - SF.agentCut[4]))) bad.push('the cut of your salary ' + sw);
    S.agent.pers = 'shark'; if (Math.abs(staffAgentCut(c) - (SF.agentCut[4] + SF.sharkCut)) > 1e-9 || Math.abs(staffAgentRaise(c) - (SF.agentRaise[4] + SF.sharkRaise)) > 1e-9) bad.push('a shark');
    S.agent.pers = 'loyal'; if (Math.abs(staffAgentCut(c) - (SF.agentCut[4] - SF.loyalCut)) > 1e-9) bad.push('a loyal agent\'s cut'); S.agent.pers = 'shady'; if (Math.abs(staffAgentRaise(c) - (SF.agentRaise[4] + SF.shadyRaise)) > 1e-9) bad.push('a shady agent');
    M.money = 10; M.endorsements = []; weeklyFinance(c, {}); if (S.skills || S.physio || !S.agent || M.money < 0 || !c.news.some(n => /let the staff go/.test(n.text || n.t || JSON.stringify(n)))) bad.push('money ran out: ' + JSON.stringify([!!S.skills, !!S.physio, !!S.agent, M.money]));
    if (bad.length) throw new Error(bad.join(' | ')); return 'a week ' + fmtMoney(proStaffCost(M, c) || Math.round(season / c.seasonLength)) + ' · the 4★ cut ' + Math.round(SF.agentCut[4] * 100) + '%';
  }, mk));

  await step('the agent: contracts +5–20% by tier (shark and shady more); 3★+ brings a fourth club in free agency (a rebuild that starts you); 4★+ more sponsor offers, and they handle a trade request (no hype lost)', () => ev(mk => {
    const c = eval(mk)(45), S = staffOf(c), M = c.me, bad = []; let four0 = 0, four3 = 0, n = 0; for (const k of RATING_KEYS) meOf(c).r[k] = 82; M.fame = 60; /* a player three or more franchises want */
    for (const t of [1, 2, 3, 4, 5]) { S.agent = staffMake(c, 'agent', t, 'straight', new RNG(t)); if (Math.abs(staffAgentRaise(c) - SF.agentRaise[t]) > 1e-9) bad.push(t + '★ raise'); }
    for (let k = 0; k < 40; k++) { S.agent = null; const a = proFreeAgency(c, new RNG(100 + k), 5e6); S.agent = staffMake(c, 'agent', 3, 'straight', new RNG(k)); const b = proFreeAgency(c, new RNG(100 + k), 5e6); n++; if (a.length > 3) four0++; if (b.length > 3) { four3++; if (!b[3].agent || !b[3].promise) bad.push('the 4th offer starts you'); } if (b.length < a.length) bad.push('fewer offers with an agent'); }
    if (four0) bad.push('a 4th offer without an agent'); if (!four3) bad.push('no 4th offer in 40 offseasons with a 3★ agent');
    const offersMax = t => { S.agent = t ? staffMake(c, 'agent', t, 'straight', new RNG(9)) : null; let mx = 0; M.fame = 80; for (let k = 0; k < 120; k++) { weeklyEndorsementOffers(c); mx = Math.max(mx, M.offers.length); } M.offers = []; return mx; };
    M.offers = []; const o0 = offersMax(0), o4 = offersMax(4); if (o0 > 2 || o4 !== 3) bad.push('sponsor offers on the table: ' + o0 + ' without, ' + o4 + ' with a 4★ agent');
    { M.hype = 50; S.agent = staffMake(c, 'agent', 3, 'straight', new RNG(3)); proTrade(c); const h3 = M.hype; M.hype = 50; S.agent = staffMake(c, 'agent', 4, 'straight', new RNG(4)); proTrade(c); const h4 = M.hype; if (h3 !== 50 - PR.tradeHype * MD.hypeMax || h4 !== 50) bad.push('a trade request: hype ' + h3 + ' with a 3★ agent, ' + h4 + ' with a 4★ (handles it)'); }
    if (bad.length) throw new Error(bad.join(' | ')); return 'a 4th offer in ' + four3 + ' of ' + n + ' offseasons · sponsors on the table ' + o0 + ' → ' + o4;
  }, mk));

  await step('the skills coach: +XP in the two skills you pick (games and practice), signature moves a step sooner (3★+), scouting tips before games; the strength trainer: recovery and the physical ceilings (4★+)', () => ev(mk => {
    const c = eval(mk)(46), S = staffOf(c), M = c.me, me = meOf(c), bad = []; S.picks = ['sho', 'def'];
    const line = { pts: 14, reb: 5, fgm: 6, tpm: 2, stl: 2, blk: 1 }, game = () => developFromGame(Object.assign({}, me.r), {}, me.caps, CR.trainFocus.shooting.split, 25, line, true, false, 1, 1, M, 1, 'B').add;
    const a0 = game(); for (const t of [1, 3, 5]) { S.skills = staffMake(c, 'skills', t, 'analytics', new RNG(t)); const a = game(), k = 1 + SF.skillsXp[t]; for (const r of ['sho', 'def']) if (Math.abs(a[r] / a0[r] - k) > 1e-9) bad.push(t + '★ ' + r + ' ×' + (a[r] / a0[r]).toFixed(3)); for (const r of ['fin', 'han', 'spd']) if (Math.abs(a[r] / a0[r] - 1) > 1e-9) bad.push(t + '★ touches ' + r); }
    S.skills = staffMake(c, 'skills', 4, 'analytics', new RNG(2)); S.picks = ['sho', 'fin']; for (const k of RATING_KEYS) if (staffSkillsMulB(M, k) !== (S.picks.includes(k) ? 1 + SF.skillsXp[4] : 1)) bad.push('practice ×' + staffSkillsMulB(M, k) + ' on ' + k); /* wkPractice's split uses it rating by rating */
    for (const t of [0, 1, 2, 3, 5]) { S.skills = t ? staffMake(c, 'skills', t, 'analytics', new RNG(t)) : null; if (staffMovesEarlyB(M) !== (t >= SF.movesEarlyAt ? SF.movesEarly : 0) || staffTipsB(M) !== (t >= SF.tipsAt)) bad.push(t + '★ moves/tips'); }
    let earlier = 0; for (let lv = 30; lv <= 99; lv++) { const r = {}; for (const k of RATING_KEYS) r[k] = lv; const a = Object.keys(movesFor(r, 0)).filter(k => movesFor(r, 0)[k]).length, b = Object.keys(movesFor(r, SF.movesEarly)).filter(k => movesFor(r, SF.movesEarly)[k]).length; if (b < a) bad.push('fewer moves with the coach at ' + lv); if (b > a) earlier++; } if (!earlier) bad.push('a 3★ coach never unlocks a move sooner');
    S.skills = staffMake(c, 'skills', 3, 'analytics', new RNG(3)); const lm = learnedMoves(me, M), want = movesFor(effRatings(me.r, me.h), trMoveEarly(M) + SF.movesEarly); if (JSON.stringify(lm) !== JSON.stringify(want)) bad.push('learnedMoves uses the coach');
    for (const t of [0, 3, 4, 5]) { S.strength = t ? staffMake(c, 'strength', t, 'drill', new RNG(t)) : null; const pc = proCaps(c); for (const k of RATING_KEYS) { const w = PHYS_KEYS.includes(k) ? Math.min(CR.ratingMax, me.caps[k] + (SF.strengthCaps[t] || 0)) : me.caps[k]; if (pc[k] !== w) bad.push(t + '★ ' + k + ' cap ' + pc[k] + ' (want ' + w + ')'); } if (staffRegenB(M) !== (SF.strengthRegen[t] || 0)) bad.push(t + '★ regen'); }
    S.strength = staffMake(c, 'strength', 5, 'drill', new RNG(1)); M.fatigue = 60; M.wk = null; const f0 = M.fatigue; const B0 = { fatigue: 60 }; wkRest(B0, WK.restGym * (M.gym || 0)); proRest(c); if (f0 - M.fatigue !== (60 - B0.fatigue) + 2 * SF.strengthRegen[5]) bad.push('a Rest week with a 5★ strength trainer: −' + (f0 - M.fatigue) + ' (without −' + (60 - B0.fatigue) + ')');
    if (bad.length) throw new Error(bad.slice(0, 5).join(' | ')); return 'XP ×' + (1 + SF.skillsXp[5]) + ' at 5★ · moves sooner at ' + earlier + ' levels · ceilings +' + SF.strengthCaps[5] + ' at 5★';
  }, mk));

  await step('the physio: fewer injuries, shorter ones, fewer lasting losses; the nutritionist: games tire you less, Speed and Hops fade later (3★+); the mental coach: smaller confidence drops, a clutch edge in the last 15 s, shorter slumps', () => ev(mk => {
    const c = eval(mk)(47), bad = [], B = t => ({ staff: { v: 2, physio: t ? { tier: t } : null, nutrition: t ? { tier: t } : null, mental: t ? { tier: t } : null } });
    for (const t of [0, 1, 3, 5]) { const b = B(t); if (Math.abs(staffInjuryMulB(b) - (1 - (SF.physioInjury[t] || 0))) > 1e-9 || Math.abs(staffLossMulB(b) - (1 - (SF.physioLoss[t] || 0))) > 1e-9 || staffInjuryFasterB(b) !== (SF.physioFaster[t] || 0)) bad.push(t + '★ physio'); }
    { let n0 = 0, n5 = 0; const r0 = new RNG(11), r5 = new RNG(11); for (let i = 0; i < 3000; i++) { const x = { fatigue: 80 }, y = Object.assign({ fatigue: 80 }, B(5)); wkAfterGame(x, r0, {}); wkAfterGame(y, r5, {}); if (x.injury || 0) n0++; if (y.injury || 0) n5++; } if (!(n5 < n0 * (1 - SF.physioInjury[5]) + 30)) bad.push('injuries after games: ' + n5 + ' with a 5★ physio vs ' + n0); }
    { let g0 = 0, g5 = 0; const r0 = new RNG(3), r5 = new RNG(3); for (let i = 0; i < 400; i++) { g0 += wkInjure({}, r0).games; g5 += wkInjure(B(5), r5).games; } if (!(g5 < g0)) bad.push('injury length ' + g5 + ' vs ' + g0); }
    { const x = { fatigue: 30 }, y = Object.assign({ fatigue: 30 }, B(5)), one = { next: () => 1 }; wkAfterGame(x, one, {}); wkAfterGame(y, one, {}); if (Math.abs((y.fatigue - 30) - (x.fatigue - 30) * (1 - SF.nutritionFatigue[5])) > 1e-9) bad.push('fatigue a game: ' + (y.fatigue - 30) + ' vs ' + (x.fatigue - 30)); }
    for (const t of [0, 3, 5]) if (staffAgingDelayB(B(t)) !== (SF.nutritionAging[t] || 0)) bad.push(t + '★ aging');
    { const at = age => { const r = { spd: 80, jmp: 80, fin: 80, def: 80, str: 80, sho: 80, han: 80 }; offseasonDevelop(r, Object.assign({}, r), [], age, staffAgingDelayB(B(5))); return r.spd; }; if (at(31) !== 80 || at(32) !== 75) bad.push('a 5★ nutritionist: the decline at 31 ' + at(31) + ', at 32 ' + at(32)); }
    { const x = { confidence: 0, hype: 0 }, y = Object.assign({ confidence: 0, hype: 0 }, B(5)); mdFill(x); mdFill(y); mdAfterGame(x, false, 10, 21); mdAfterGame(y, false, 10, 21); if (!(y.confidence > x.confidence) || Math.abs(y.confidence - x.confidence * (1 - SF.mentalConf[5])) > 0.6) bad.push('a loss: ' + y.confidence.toFixed(2) + ' vs ' + x.confidence.toFixed(2)); const z0 = { confidence: 5, hype: 0 }, z = Object.assign({ confidence: 5, hype: 0 }, B(5)); mdFill(z0); mdFill(z); mdAfterGame(z0, true, 21, 10); mdAfterGame(z, true, 21, 10); if (z.confidence !== z0.confidence) bad.push('a win: ' + z.confidence + ' vs ' + z0.confidence + ' (only drops shrink)'); }
    for (const t of [0, 1, 4]) { const ccc = eval(mk)(48), S = staffOf(ccc); S.mental = t ? staffMake(ccc, 'mental', t, 'players', new RNG(t)) : null; const H = ccc.me; H.slump = { n: 0, on: true }; const r1 = slumpAfterGame(ccc, 'C+'); H.slump = { n: 0, on: true }; const r2 = slumpAfterGame(ccc, 'C'); const want1 = t >= 1 ? 'end' : null, want2 = t >= 4 ? 'end' : null; if (r1 !== want1 || r2 !== want2) bad.push(t + '★ mental: C+ ' + r1 + ', C ' + r2); if (Math.abs(staffClutchB(H) - (SF.mentalClutch[t] || 0)) > 1e-9) bad.push(t + '★ clutch'); }
    { const S = staffOf(c); S.mental = staffMake(c, 'mental', 5, 'players', new RNG(5)); const d = engineDef(c, c.meId); if (Math.abs((d.staffClutch || 0) - SF.mentalClutch[5]) > 1e-9) bad.push('the engine player gets the clutch edge: ' + d.staffClutch); const other = c.active.find(id => id !== c.meId); if (engineDef(c, other).staffClutch) bad.push('only you'); }
    if (bad.length) throw new Error(bad.slice(0, 5).join(' | ')); return 'ok';
  }, mk));

  await step('story: halfway through a season a rival club may call a 3★+ staffer (Ambitious twice as often, Loyal never, never the agent): match (+25%) or let them go; a shady agent can make the news: stand by them (hype −10) or fire them (hype −5); amateurs have no staff', () => ev(mk => {
    const bad = [], half = c => Math.floor(c.seasonLength / 2); let calls = { ambitious: 0, other: 0, loyal: 0, low: 0, agent: 0 }, seasons = 0;
    for (let seed = 1; seed <= 160; seed++) { const c = eval(mk)(500 + seed), S = staffOf(c), rng = new RNG(seed); c.phase = 'regular'; const kind = ['ambitious', 'other', 'loyal', 'low'][seed % 4];
      S.physio = staffMake(c, 'physio', kind === 'low' ? 2 : 4, kind === 'other' ? 'analytics' : kind === 'low' ? 'analytics' : kind, rng); S.agent = staffMake(c, 'agent', 5, 'straight', rng); c.week = half(c); c.events.length = 0; staffWeek(c); seasons++;
      const ev2 = c.events.find(e => e.staff && e.staff.kind === 'poach'); if (ev2) { calls[kind]++; if (ev2.staff.role === 'agent') calls.agent++; } }
    if (calls.loyal || calls.low || calls.agent) bad.push('calls for a loyal, a 2★ or the agent: ' + JSON.stringify(calls)); if (!(calls.ambitious > calls.other) || !calls.other) bad.push('ambitious twice as often: ' + JSON.stringify(calls));
    const c = eval(mk)(601), S = staffOf(c); S.skills = staffMake(c, 'skills', 4, 'ambitious', new RNG(1)); const pay0 = S.skills.salary; staffPoachCard(c, 'skills', new RNG(2)); const e = c.events.pop();
    if (!e || e.kind !== 'dialog' || e.choice.length !== 2 || !e.choice[0].def || typeof e.who !== 'object' || e.who.name !== S.skills.name) bad.push('the call\'s card');
    staffChoose(c, e, 0); if (S.skills.salary !== Math.round(pay0 * (1 + SF.poachRaise) / 10000) * 10000) bad.push('matched: ' + S.skills.salary); staffPoachCard(c, 'skills', new RNG(3)); const e2 = c.events.pop(); staffChoose(c, e2, 1); if (S.skills) bad.push('let go: still here');
    const c2 = eval(mk)(602), S2 = staffOf(c2); S2.agent = staffMake(c2, 'agent', 4, 'shady', new RNG(4)); c2.me.hype = 50; staffScandalCard(c2); const s1 = c2.events.pop(); staffChoose(c2, s1, 0); if (c2.me.hype !== 50 - SF.scandalHype || !S2.agent) bad.push('stand by them: hype ' + c2.me.hype);
    staffScandalCard(c2); const s2 = c2.events.pop(); staffChoose(c2, s2, 1); if (c2.me.hype !== 50 - SF.scandalHype - Math.round(SF.scandalHype / 2) || S2.agent || c2.me.agent) bad.push('fire them');
    let sc = 0, scSt = 0; for (let seed = 1; seed <= 120; seed++) { const c3 = eval(mk)(700 + seed), S3 = staffOf(c3); c3.phase = 'regular'; S3.agent = staffMake(c3, 'agent', 3, seed % 2 ? 'shady' : 'straight', new RNG(seed)); for (let w = 1; w <= c3.seasonLength; w++) { c3.week = w; staffWeek(c3); } if (c3.events.some(x => x.staff && x.staff.kind === 'scandal')) { if (seed % 2) sc++; else scSt++; } }
    if (scSt || !sc || sc > 45) bad.push('scandals: ' + sc + ' of 60 shady agents, ' + scSt + ' straight');
    const a = amCreate(defaultSave(), { name: 'No Staff', look: PRESET_LOOKS[1], number: 1, style: 'slasher', seed: 77 }); if (staffIsPro(a) || staffT(a, 'physio') || staffInjuryMulB(a) !== 1 || staffFatigueMulB(a) !== 1) bad.push('an amateur with staff');
    if (bad.length) throw new Error(bad.join(' | ')); return 'calls in ' + seasons + ' seasons: ' + JSON.stringify(calls) + ' · scandals ' + sc + ' of 60 shady agents';
  }, mk));

  await step('saves from before V10: R7\'s trainer (1–3), private coach and nutrition & physio, the R6 four roles and the agent\'s name become the six roles; a v2 staff survives a save and a reload', () => ev(mk => {
    const bad = [], c = eval(mk)(49), cases = [
      [{ trainer: 1, coach: 0, nutrition: 0 }, null, { skills: 2 }], [{ trainer: 2, coach: 1, nutrition: 1 }, 'Ana Ruiz', { skills: 4, physio: 3, nutrition: 3, agent: 2 }], [{ trainer: 3, coach: 1, nutrition: 0 }, null, { skills: 4 }],
      [{ trainer: 0, coach: 1, nutrition: 0 }, null, { skills: 2 }], [{ shooting: 2, skills: 1, strength: 3, physio: 1 }, null, { skills: 4, physio: 3, nutrition: 3 }], [null, 'Bo Lin', { agent: 2 }], [{ trainer: 0, coach: 0, nutrition: 0 }, null, {}]];
    for (const [st, agent, want] of cases) { const o = JSON.parse(JSON.stringify(c)); o.me.staff = st; o.me.agent = agent; const F = repairCareer(o).me.staff; const got = {}; for (const r of STAFF_ROLES) if (F[r]) got[r] = F[r].tier; const key = o => JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]])); if (key(got) !== key(want)) bad.push(JSON.stringify(st) + ' → ' + JSON.stringify(got) + ' (want ' + JSON.stringify(want) + ')'); if (agent && (!F.agent || F.agent.name !== agent || F.agent.pers !== 'straight')) bad.push('the agent keeps their name'); if (F.v !== 2 || !Array.isArray(F.picks) || F.picks.length !== 2) bad.push('v2 with two picks'); }
    const S = staffOf(c); S.skills = staffMake(c, 'skills', 3, 'loyal', new RNG(1)); S.picks = ['han', 'def']; S.skills.up = true; const back = repairCareer(JSON.parse(JSON.stringify(c))).me.staff; if (!back.skills || back.skills.name !== S.skills.name || back.skills.tier !== 3 || !back.skills.up || back.picks.join() !== 'han,def') bad.push('a v2 staff round trip');
    const z = JSON.parse(JSON.stringify(c)); z.me.staff = { v: 2, skills: { tier: 9, role: 'skills', name: 'X' }, picks: ['zzz'], pool: 7 }; const Z = repairCareer(z).me.staff; if (staffT(z.me, 'skills') !== 5 || Z.picks.length !== 2 || typeof Z.pool !== 'object') bad.push('a broken v2 staff is mended');
    if (bad.length) throw new Error(bad.join(' | ')); return cases.length + ' old shapes';
  }, mk));

  await step('the staff room (desktop): every role, hire a candidate, a buyout asks first, re-sign a contract that\'s up, the skills coach\'s two skills; the Codex\'s staff page; the hub\'s TEAM tab and the Career menu link to it', () => ev(mk => {
    const g = HH.game, bad = []; g.save.data.career = eval(mk)(50); const c = g.save.data.career, S = staffOf(c); g.staffTab = null; g.ui.clearTo(careerHub(g));
    const draw = () => { const s = g.ui.screen, ctx = g.canvas.getContext('2d'); ctx.save(); s.draw(ctx, g.ui); for (const w of s.widgets) if (!w.hidden) g.ui.drawWidget(ctx, w, false); ctx.restore(); };
    for (const r of STAFF_ROLES) { g.ui.push(staffScreen(g, r)); draw(); const s = g.ui.screen; const hires = s.widgets.filter(w => w.cand); if (hires.length !== SF.pool) bad.push(r + ': ' + hires.length + ' hire buttons'); const b = hires.find(w => w.enabled !== false); if (!b) { bad.push(r + ': nobody to hire'); g.ui.pop(); continue; } const name = b.cand.name; b.onPress(); if (!S[r] || S[r].name !== name) bad.push(r + ': the hire'); g.ui.pop(); }
    g.ui.push(staffScreen(g, 'skills')); const s1 = g.ui.screen, alt = s1.widgets.find(w => w.cand && w.enabled !== false), was = S.skills.name; alt.onPress(); if (g.ui.screen.name !== 'confirm') bad.push('no question before a buyout'); else { g.ui.screen.widgets.find(w => w.label === 'No').onPress(); if (S.skills.name !== was) bad.push('No keeps them'); }
    const s2 = g.ui.screen, sels = s2.widgets.filter(w => w.kind === 'select'); if (sels.length !== 2) bad.push('two skill picks'); else { const before = S.picks.join(); sels[0].set((sels[0].get() + 1) % sels[0].options.length); if (S.picks.join() === before || S.picks[0] === S.picks[1]) bad.push('the pick: ' + S.picks); }
    g.ui.pop(); S.physio.up = true; g.ui.push(staffScreen(g, 'physio')); const rs = g.ui.screen.widgets.find(w => /^Re-sign/.test(w.label || '')); if (!rs) bad.push('no Re-sign'); else { const want = staffResignPay(S.physio); rs.onPress(); if (S.physio.up || S.physio.salary !== want) bad.push('re-signed at ' + S.physio.salary); }
    draw(); g.ui.pop(); g.ui.push(statsGuideScreen(g, 'staff')); draw(); g.ui.pop();
    g.hubTab = 'team'; g.ui.clearTo(careerHub(g)); draw(); const tb = g.ui.screen.widgets.find(w => w.label === 'Staff'); if (!tb) bad.push('no Staff on the TEAM tab'); g.ui.push(careerMenuScreen(g)); const cm = g.ui.screen.widgets.find(w => w.label === 'Staff'); if (!cm) bad.push('no Staff in the Career menu'); else { cm.onPress(); if (g.ui.screen.name !== 'staff') bad.push('the Career menu opens the staff room'); }
    g.hubTab = 'play'; g.ui.clearTo(mainMenu(g)); if ((window.HH_ERRORS || []).length) bad.push('draw faults: ' + window.HH_ERRORS.slice(0, 2).join(' | '));
    if (bad.length) throw new Error(bad.join(' | ')); return 'six hires, a buyout question, a re-signing';
  }, mk));

  const P = await openPage(browser, { phone: true });
  await R.step('the staff room (phone): the six roles, then one role with its three candidates as cards you tap; every target 64 px; nothing overlaps or runs off the screen', () => P.ev(mk => {
    const g = HH.game, bad = []; g.save.data.career = eval(mk)(51); const c = g.save.data.career, S = staffOf(c); g.staffTab = null; g.ui.clearTo(careerHub(g)); if (!g.ui.phone) throw new Error('not a phone');
    const check = tag => { const s = g.ui.screen, ws = s.widgets.filter(w => !w.hidden && w.kind !== 'text'); for (const w of ws) { if (w.h * g.ui.scale < 63.5 || w.w * g.ui.scale < 63.5) bad.push(tag + ': ' + (w.label || w.kind) + ' ' + Math.round(w.w * g.ui.scale) + '×' + Math.round(w.h * g.ui.scale)); if (w.x < 0 || w.y < 0 || w.x + w.w > UI_W || w.y + w.h > UI_H) bad.push(tag + ': off screen ' + w.label); } for (let i = 0; i < ws.length; i++) for (let j = i + 1; j < ws.length; j++) { const a = ws[i], b = ws[j]; if (a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1) bad.push(tag + ': overlap ' + a.label + ' / ' + b.label); } { const s = g.ui.screen, ctx = g.canvas.getContext('2d'); ctx.save(); s.draw(ctx, g.ui); for (const w of s.widgets) if (!w.hidden) g.ui.drawWidget(ctx, w, false); ctx.restore(); } };
    g.ui.push(staffScreen(g)); check('list'); const rb = g.ui.screen.widgets.find(w => w.role === 'physio'); rb.onPress(); if (g.staffTab.view !== 'role' || g.ui.screen.name !== 'staff') bad.push('a role opens'); check('physio');
    const card = g.ui.screen.widgets.find(w => w.cand && w.enabled !== false); card.onPress(); if (!S.physio) bad.push('a tap hires'); check('physio hired');
    g.staffTab = { role: 'skills', view: 'role' }; g.ui.replace(staffScreen(g)); g.ui.screen.widgets.find(w => w.cand && w.enabled !== false).onPress(); check('skills hired'); S.skills.up = true; g.ui.replace(staffScreen(g)); check('skills up');
    g.ui.screen.widgets.find(w => w.label === 'Back').onPress(); if (g.staffTab.view !== 'list') bad.push('Back goes to the list'); check('list again'); g.ui.clearTo(mainMenu(g));
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'ok';
  }, mk), P);

  console.log(D.errors.length || P.errors.length ? 'page errors: ' + D.errors.concat(P.errors).slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
