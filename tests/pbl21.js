// 2.1 §3.1–3.2 (W5): the PBL, engineered. Sixteen franchises in two conferences (the four newest with their identity);
// owners (win-now, patient, cheap, meddlers), the GM's style, the coach's system and your fit; rosters (a starter and
// four on the bench with contracts), payroll against the soft cap and the tax line, chemistry, team strength in the
// simulated games and the odds; the fifteen-week calendar (rivalry week, the All-Star break, the trade deadline, the
// national TV game); the conference playoffs (best of 3, the Finals best of 5); the award races (the weekly MVP ladder,
// the Sixth Man); the benches' offseason; a 2.0 save's expansion; the screens.
// node tests/pbl21.js   (ONLY=<regex> runs the matching steps)
const fs = require('fs'), path = require('path');
const { launch, openPage, runner } = require('./lib');

// Installed on each page: a pro league (you start), a season simmed to its end, the strings one synchronous UI draw
// shows and its cut or overlapping text, small tap targets.
const LIB = `
window.tPro = (seed, star) => { const g = HH.game, save = g.save.data, c = testProLeague(seed, save); save.career = c; save.c1 = null; c.events.length = 0; if (star) { const me = meOf(c); for (const k of RATING_KEYS) { me.r[k] = Math.max(me.r[k], star); me.caps[k] = Math.max(me.caps[k], star); } } return c; };
window.tSim = (save, until) => { const c = save.career; let n = 0; while (n++ < 80 && !until(c)) { if (c.events) c.events.length = 0; if (c.phase === 'regular' || c.phase === 'playoffs') { if (!simUserGame(save)) { if (c.phase === 'playoffs') simPlayoffsToEnd(c); else break; } continue; } break; } if (c.events) c.events.length = 0; return c; };
window.tTexts = g => { g.ui.trans = null; g.ui.toastT = 0; RBF.boxes = []; let X = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { X = RBF.boxes || []; RBF.boxes = null; } return X; };
window.tFaults = g => { const B = tTexts(g), out = B.filter(x => x.cut).map(x => 'CUT ' + String(x.cut).slice(0, 40)); const T = B.filter(x => String(x.t).trim() && x.a >= 0.35 && x.w >= 1); for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const p = T[i], q = T[j]; if (p.t === q.t) continue; const px = Math.max(p.s, q.s), ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y); if (ix > px && iy > px) out.push('OVERLAP "' + String(p.t).slice(0, 20) + '" x "' + String(q.t).slice(0, 20) + '"'); } return out.concat((window.HH_ERRORS || []).splice(0).map(e => 'ERROR ' + e)); };
window.tSmall = g => { const ui = g.ui, s = ui.screen; return (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && w.kind !== 'text' && (w.w * ui.scale < 63.5 || w.h * ui.scale < 63.5)).map(w => (w.label || w.kind) + ' ' + Math.round(w.w * ui.scale) + '×' + Math.round(w.h * ui.scale)); };
// Every new or changed PBL screen, drawn once each: [name, faults].
window.tScreens = (g, phone) => { const bad = [], save = g.save.data; const c = tPro(77, 92); tSim(save, c => c.week >= 3);
  const look = (name, open) => { g.ui.clearTo(careerHub(g)); open(); const s = g.ui.screen; if (s.update) s.update(0.016, {}); const F = tFaults(g).concat(phone ? tSmall(g).map(x => 'SMALL ' + x) : []); if (F.length) bad.push(name + ': ' + F.slice(0, 3).join(' | ')); };
  g.hubTab = 'play'; look('hub play (rivalry week next)', () => {}); g.hubTab = 'team'; look('hub team', () => {});
  for (const [i, nm] of [[0, 'standings'], [1, 'franchises'], [3, 'schedule'], [6, 'history'], [8, 'races']]) look('league ' + nm, () => { g.leagueTab = { tab: i, player: 0 }; g.ui.push(leagueScreen(g)); });
  look('bracket (projected)', () => g.ui.push(bracketScreen(g))); look('codex', () => g.ui.push(statsGuideScreen(g, 'team')));
  for (const id of ['monarchs', 'foxes', 'falcons', meOf(c).club]) { look('franchise ' + id, () => { g.frTab = { tab: 0 }; g.ui.push(franchiseScreen(g, id)); }); look('franchise ' + id + ' history', () => { g.frTab = { tab: 1 }; g.ui.push(franchiseScreen(g, id)); }); }
  tSim(save, c => c.week >= PBL.tvWeek - 1); g.hubTab = 'play'; look('hub play (TV week)', () => {});
  const r = simUserGame(save); c.events.length = 0; if (r && !r.bench) look('result (TV)', () => g.ui.push(careerResultScreen(g, r, null)));
  tSim(save, c => c.phase !== 'regular'); if (c.phase === 'playoffs') { look('bracket (playoffs)', () => g.ui.push(bracketScreen(g))); g.hubTab = 'play'; look('hub play (playoffs)', () => {}); }
  tSim(save, c => c.phase === 'offseason'); look('bracket (done)', () => g.ui.push(bracketScreen(g))); look('league history', () => { g.leagueTab = { tab: 6, player: 0 }; g.ui.push(leagueScreen(g)); });
  const h = c.history[0], rows = proCeremonyRows(c, h).concat([{ award: 'PBL Champion', name: 'Test · Test', mine: true }]); look('awards night (' + rows.length + ' rows)', () => { g.ui.push(awardsCeremonyScreen(g, c, { title: 'AWARDS NIGHT', sub: 'The PBL', rows }, () => {})); g.ui.screen.onTap(); });
  return bad; };
`;

(async () => {
  const b = await launch(); const R = runner('pbl21');
  const P = await openPage(b, { wait: 900 }); const { ev } = P; await ev(src => { (0, eval)(src); }, LIB);

  await R.step('sixteen franchises in two conferences of eight, every rival pair inside one; the four newest (Foxes, Falcons, Tigers, Rockets) have a city, a crest, an owner, a market, a legend and a founding year, and no titles before your career', () => ev(() => {
    const bad = [], ids = frIds(); if (ids.length !== 16) bad.push(ids.length + ' franchises');
    for (const k of PBL_CONFS) { const L = frConfIds(k); if (L.length !== 8) bad.push(k + ' ' + L.length); for (const id of L) if (frConf(frRivalId(id)) !== k) bad.push(id + ' rival in the other conference'); }
    if (new Set(PBL_CONFS.flatMap(k => frConfIds(k))).size !== 16) bad.push('conferences overlap');
    for (const id of ['foxes', 'falcons', 'tigers', 'rockets']) { const I = FR_INFO[id], T = TEAMS.find(t => t.id === id); if (!T || !I || !I.city || !I.founded || !I.legends.length || I.titles !== 0) bad.push(id + ' identity'); const M = FR_CREST_MARK[id]; if (!M || M.length !== 10 || M.some(r => r.length !== 10)) bad.push(id + ' crest'); if (!FR_OWNER_WORD[I.owner[1]]) bad.push(id + ' owner'); if (frHistory().byId[id].length) bad.push(id + ' history'); if (!CLUB_COURT[id]) bad.push(id + ' court'); }
    const kinds = {}; for (const id of ids) kinds[FR_INFO[id].owner[1]] = (kinds[FR_INFO[id].owner[1]] || 0) + 1; if (!kinds.meddler) bad.push('no meddlers');
    const H = frHistory(); if (Object.keys(H.years).length !== FRN.year1 - FRN.founded) bad.push('history ' + Object.keys(H.years).length);
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'East ' + frConfIds('East').map(id => clubOf(id).abbr).join(' ') + ' · West ' + frConfIds('West').map(id => clubOf(id).abbr).join(' ') + ' · owners ' + JSON.stringify(kinds);
  }), P);

  await R.step('a new league: sixteen starters, one a franchise; stars 3/3/4/3/3; each franchise has a GM style, a coach with a system, four on the bench (ratings, age, contract); your bench is your team; payroll grows with the stars, a cheap owner is never over the tax line; a fifteen-week season in the 2.1 format', () => ev(() => {
    const bad = [], pays = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    for (const seed of [3, 4, 5, 6]) { const c = tPro(seed); if (!pblOn(c) || !pblReady(c) || c.active.length !== 16 || c.seasonLength !== 15 || c.schedule.length !== 15) bad.push(seed + ': format ' + c.pbl + ' ' + c.active.length + ' ' + c.seasonLength);
      const st = {}; for (const id of frIds()) { const F = frx(c, id); st[F.stars] = (st[F.stars] || 0) + 1; if (!FR_GM_WORD[F.mode]) bad.push(seed + ' ' + id + ' gm ' + F.mode); if (!PBL_SYS.includes(frSysOf(c, id))) bad.push(id + ' sys'); const B = frBenchOf(c, id); if (B.length !== 4 || B.some(m => !m.r || !(m.age > 18) || !m.contract || !(m.contract.salary > 0) || !(m.contract.years >= 1))) bad.push(seed + ' ' + id + ' bench'); const Pay = frPayroll(c, id); pays[F.stars].push(Pay.total); if (F.owner.kind === 'cheap' && Pay.tax) bad.push(id + ' cheap over the tax'); if (frStarterId(c, id) == null) bad.push(id + ' no starter'); }
      if ([3, 3, 4, 3, 3].some((n, i) => st[i + 1] !== n)) bad.push(seed + ' stars ' + JSON.stringify(st));
      if (frBenchOf(c, meOf(c).club) !== c.team.mates) bad.push('your bench is not your team'); }
    const avg = s => pays[s].reduce((a, v) => a + v, 0) / Math.max(1, pays[s].length); if (!(avg(5) > avg(3) && avg(3) > avg(1))) bad.push('payroll by stars ' + [1, 3, 5].map(s => (avg(s) / 1e6).toFixed(0)).join('/'));
    if (!(avg(5) > 100e6 && avg(5) < PBL.taxLine && avg(1) > 30e6)) bad.push('payroll range ' + [1, 5].map(s => (avg(s) / 1e6).toFixed(0)).join('–'));
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : 'payroll by stars 1★–5★: ' + [1, 2, 3, 4, 5].map(s => '$' + (avg(s) / 1e6).toFixed(0) + 'M').join(' / ') + ' (cap $' + PBL.softCap / 1e6 + 'M, tax $' + PBL.taxLine / 1e6 + 'M)';
  }), P);

  await R.step('team strength = (the starter + the bench\'s average) ÷ 2 + chemistry; a better bench and more chemistry win more simulated games and better odds; chemistry: the same five +1 (up to +3), one change −1, more back to 0', () => ev(() => {
    const bad = [], c = tPro(21), id = frIds().find(k => k !== meOf(c).club), S = frTeamStrength(c, id), sid = frStarterId(c, id);
    const want = Math.round(((recOvr(c.players[sid]) + frBenchAvg(c, id)) / 2 + frChem(c, id)) * 10) / 10; if (Math.abs(S.total - want) > 0.11) bad.push('strength ' + S.total + ' vs ' + want);
    const other = c.active.find(x => x !== sid && x !== c.meId), F = c.fr[id]; F.chem = 0; const e0 = pblSlotEdge(c, sid); for (const m of F.bench) for (const k of RATING_KEYS) m.r[k] = Math.min(95, m.r[k] + 10); const e1 = pblSlotEdge(c, sid); F.chem = 3; const e2 = pblSlotEdge(c, sid);
    if (!(e1 > e0 + 2 && e2 > e1 + 1.2)) bad.push('edges ' + [e0, e1, e2].map(v => v.toFixed(2)).join(' → '));
    const rng = new RNG(5); let w0 = 0, w2 = 0; F.chem = 0; for (const m of F.bench) for (const k of RATING_KEYS) m.r[k] -= 10; for (let i = 0; i < 400; i++) { const r = simBox(c, sid, other, rng); if (r.hs > r.as) w0++; } for (const m of F.bench) for (const k of RATING_KEYS) m.r[k] += 10; F.chem = 3; for (let i = 0; i < 400; i++) { const r = simBox(c, sid, other, rng); if (r.hs > r.as) w2++; } if (!(w2 > w0 + 20)) bad.push('wins ' + w0 + ' → ' + w2);
    const O = frOdds(c); if (Math.abs(Object.values(O.p).reduce((a, v) => a + v, 0) - 1) > 1e-9) bad.push('odds sum');
    const G = frGroupIds(c, id); F.group = G.slice(); F.chem = 1; pblChemSeason(c, id); if (F.chem !== 2) bad.push('same five: ' + F.chem); F.chem = 3; pblChemSeason(c, id); if (F.chem !== 3) bad.push('capped: ' + F.chem); F.group = G.slice(0, 4).concat(['x1']); pblChemSeason(c, id); if (F.chem !== 2) bad.push('one change: ' + F.chem); F.group = ['x1', 'x2', 'x3'].concat(G.slice(0, 2)); pblChemSeason(c, id); if (F.chem !== 0) bad.push('three changes: ' + F.chem);
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'strength ' + S.total + ' (' + S.starter + ' / ' + S.bench + ' / +' + S.chem + ') · bench +10, chemistry +3: wins ' + w0 + ' → ' + w2 + ' of 400';
  }), P);

  await R.step('the coach\'s system and your fit: Pace, Iso, Defense or Development; your fit (0–100) from your ratings in its keys (Development: your age); a great fit starts with more trust and practices faster in its ratings, a poor one starts with less', () => ev(() => {
    const bad = [], c = tPro(31), me = meOf(c), club = me.club, sysSeen = new Set(); for (const id of frIds()) sysSeen.add(frSysOf(c, id)); if (sysSeen.size < 3) bad.push('systems ' + [...sysSeen]);
    const co = c.fr[club].coach; co.sys = 'iso'; for (const k of RATING_KEYS) me.r[k] = 60; me.r.han = 85; me.r.sho = 85; const gr = frSysFit(c, club); me.r.han = 45; me.r.sho = 45; const po = frSysFit(c, club); if (gr.tier !== 2 || po.tier !== 0) bad.push('fit ' + gr.pct + '/' + po.pct);
    co.sys = 'development'; me.age = 21; const y = frSysFit(c, club).pct; me.age = 31; const o = frSysFit(c, club).pct; if (!(y > 90 && o < 20)) bad.push('development by age ' + y + '/' + o); me.age = 22;
    co.sys = 'iso'; me.r.han = 85; me.r.sho = 85; const mulIn = pblSysXpMul(c, 'handles'), mulOut = pblSysXpMul(c, 'defense'); if (!(Math.abs(mulIn - (1 + PBL.sysXp)) < 1e-9 && mulOut === 1)) bad.push('xp ' + mulIn + ' / ' + mulOut);
    c.team = null; const T1 = tmNewPro(c), t1 = T1.trust; me.r.han = 45; me.r.sho = 45; for (const m of T1.mates) c.fr[club].bench.push(m); const T0 = tmNewPro(c), t0 = T0.trust; if (t1 - t0 !== PBL.sysTrust[2] - PBL.sysTrust[0]) bad.push('trust ' + t1 + ' vs ' + t0);
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'systems ' + [...sysSeen].join('/') + ' · Iso fit ' + gr.pct + ' vs ' + po.pct + ' · trust ' + t1 + ' vs ' + t0 + ' · practice ×' + mulIn.toFixed(2);
  }), P);

  await R.step('the calendar: fifteen weeks, everyone plays everyone once, home games 7–8 each; week 4 pairs every rival; the All-Star weekend comes before week 8\'s game; trades, requests and calls close after week 10; the TV game (week 13) doubles the hype; a rivalry-week win adds fame', () => ev(() => {
    const bad = [], save = HH.game.save.data;
    for (const seed of [41, 42]) { const c = tPro(seed); const seen = new Set(), home = {}; for (const wk of c.schedule) { if (wk.length !== 8) bad.push('week of ' + wk.length); for (const g of wk) { const k = [g.h, g.a].sort().join('|'); if (seen.has(k)) bad.push('a repeat'); seen.add(k); home[g.h] = (home[g.h] || 0) + 1; } }
      if (seen.size !== 120) bad.push('pairs ' + seen.size); if (Object.values(home).some(n => n < 7 || n > 8)) bad.push('home ' + JSON.stringify(Object.values(home)));
      if (!c.schedule[PBL.rivalryWeek - 1].every(g => frIsRivalry(c.players[g.h].club, c.players[g.a].club))) bad.push('rivalry week'); }
    const c = tPro(43, 80); c.me.tradeSeason = -9; tSim(save, c => c.week >= PBL.allStarWeek - 1); if (!c.allStar || c.allStar.week !== PBL.allStarWeek - 1) bad.push('All-Star at ' + (c.allStar && c.allStar.week));
    tSim(save, c => c.week >= PBL.deadlineWeek - 1); const openAt10 = pblDeadlineOpen(c); tSim(save, c => c.week >= PBL.deadlineWeek); if (!openAt10 || pblDeadlineOpen(c) || proTradeOpen(c) || proTradeOfferCheck(c)) bad.push('deadline ' + openAt10 + '/' + pblDeadlineOpen(c));
    if (!c.news.some(n => /trade deadline has passed/.test(n.t)) || !c.news.some(n => /Rivalry week/.test(n.t))) bad.push('key-week news');
    tSim(save, c => c.week >= PBL.tvWeek - 1); c.me.hype = 40; const S0 = JSON.stringify(save.career); const r = simUserGame(save); const h1 = save.career.me.hype; save.career = JSON.parse(S0); const keep = PBL.tvWeek; PBL.tvWeek = 99; const r0 = simUserGame(save); const h0 = save.career.me.hype; PBL.tvWeek = keep; save.career.events.length = 0; /* the same game, once on national TV and once not */
    if (!r || r.tv == null || !r0 || r0.tv != null) bad.push('the TV note'); else if (Math.abs((h1 - 40) - 2 * (h0 - 40)) > 0.25 && h1 > 0.5 && h1 < MD.hypeMax - 0.5) bad.push('tv ' + (h1 - 40).toFixed(1) + ' vs twice ' + (h0 - 40).toFixed(1));
    const c2 = tPro(44, 95); tSim(save, c => c.week >= PBL.rivalryWeek - 1); const f0 = c2.me.fame; const r2 = simUserGame(save); c2.events.length = 0; if (r2 && r2.win && !r2.rivalryWin) bad.push('rivalry win without the fame'); if (r2 && r2.rivalryWin && !(c2.me.fame > f0)) bad.push('no fame');
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : '120 pairs a season · the All-Star weekend before week ' + PBL.allStarWeek + ' · the deadline after week ' + PBL.deadlineWeek + ' · the TV game\'s hype ' + (h1 - 40).toFixed(1) + ' (off TV ' + (h0 - 40).toFixed(1) + ') · rivalry win ' + !!(r2 && r2.rivalryWin);
  }), P);

  await R.step('the playoffs: the top four of each conference, 1–4 and 2–3 (best of 3); each conference final hosted by the better seed; the Finals best of 5 hosted by the better record (games 1, 3, 5) with a louder crowd (simulated and played); your result reads the round', () => ev(() => {
    const bad = [], save = HH.game.save.data, lines = [];
    for (const seed of [51, 52, 53]) { const c = tPro(seed, seed === 51 ? 95 : 0); tSim(save, c => c.phase !== 'regular'); const P_ = c.playoffs; if (!P_ || P_.fmt !== 2) { bad.push(seed + ' fmt'); continue; }
      const st = standingsSorted(c); for (const k of PBL_CONFS) { const want = st.filter(id => frConf(c.players[id].club) === k).slice(0, 4); if (JSON.stringify(want) !== JSON.stringify(P_.conf[k])) bad.push(seed + ' ' + k + ' seeds'); }
      const R0 = P_.rounds[0]; if (R0.length !== 4 || R0.some(s => s.bestOf !== 3)) bad.push(seed + ' round 1'); if (!(R0[0].a === P_.conf.East[0] && R0[0].b === P_.conf.East[3] && R0[1].a === P_.conf.East[1])) bad.push(seed + ' pairs');
      if (c.phase === 'playoffs' && userGame(c) && P_.series.length === 4) { const g = userGame(c); const o = careerMatchOpts(c, { settings: defaultSave().settings }, g, false); lines.push('crowd ' + (o.teams[0].players[0].crowd || 0).toFixed(3)); }
      tSim(save, c => c.phase === 'offseason'); if (P_.rounds.length !== 3) { bad.push(seed + ' rounds ' + P_.rounds.length); continue; }
      for (const s of P_.rounds[1]) { const k = PBL_CONFS.find(q => P_.conf[q].includes(s.a)); if (!k || P_.conf[k].indexOf(s.a) > P_.conf[k].indexOf(s.b)) bad.push(seed + ' conf final host'); }
      const f = P_.rounds[2][0]; if (f.bestOf !== 5 || Math.max(f.wa, f.wb) !== 3) bad.push(seed + ' finals ' + f.wa + '-' + f.wb); if (st.indexOf(f.a) > st.indexOf(f.b)) bad.push(seed + ' finals host'); if (frConf(c.players[f.a].club) === frConf(c.players[f.b].club)) bad.push(seed + ' finals same conference');
      const r = c.me.seasonLog[0].playoff; if (!/^(Champion|Lost in the (Finals|conference finals|conference semifinals)|Missed playoffs)$/.test(r)) bad.push(seed + ' result ' + r); lines.push(seed + ': ' + r); }
    const c = tPro(54); c.phase = 'playoffs'; pblStartPlayoffs(c); c.playoffs.series = [c.playoffs.series[0]]; if (pblPoHomeEdge(c) !== PBL.finalsHomeEdge) bad.push('finals home edge'); const g = { h: c.meId, a: 'x', playoff: true }; if (pblFinalsCrowd(c, g) !== PBL.finalsCrowd || pblFinalsCrowd(c, { h: 'x', a: c.meId, playoff: true }) !== 0) bad.push('finals crowd');
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : lines.join(' · ');
  }), P);

  await R.step('the award races: the weekly MVP ladder (the top five, arrows from last week); Rookie of the Year among rookies; Defensive Player from the playoff spots; Most Improved from the second season; the Sixth Man a bench player (you, when you sat half your weeks); awards night lists the Sixth Man and both All-League teams', () => ev(() => {
    const bad = [], save = HH.game.save.data, c = tPro(61); tSim(save, c => c.week >= 5); const Rc = c.races; if (!Rc || Rc.s !== c.season || Rc.mvp.length !== 5 || Rc.w !== c.week - 1) bad.push('ladder ' + JSON.stringify(Rc && { w: Rc.w, n: Rc.mvp.length }));
    const order = c.active.filter(id => c.stats[id].g).sort((a, b) => mvpScore(c, b) - mvpScore(c, a)).slice(0, 5); if (JSON.stringify(order) !== JSON.stringify(Rc.mvp)) bad.push('ladder order'); if (!Rc.mvp.every(id => ['up', 'down', 'same', 'new'].includes(pblTrend(c, id)))) bad.push('trends');
    const R_ = pblRaces(c); if (R_.roy.some(id => !(c.players[id].rookie && c.players[id].since === c.season))) bad.push('roy'); const spots = pblPlayoffSpots(c); if (R_.dpoy.some(id => !spots.includes(id))) bad.push('dpoy'); if (R_.mip.length) bad.push('mip in season 1'); if (!R_.sixth.length || R_.sixth.some(x => !x.me && !frBenchOf(c, x.club).some(m => m.name === x.name))) bad.push('sixth: not a bench player');
    c.me.benchSeason = 8; c.stats[c.meId].g = 3; const six = pblSixthRace(c); if (!six.some(x => x.me)) bad.push('you, benched, not in the race');
    tSim(save, c => c.phase === 'offseason'); const h = c.history[0]; if (!h.v2 || !h.sixth || !h.names.sixth) bad.push('no Sixth Man award'); const rows = proCeremonyRows(c, h).map(r => r.award); if (!rows.includes('Sixth Man of the Year') || !rows.includes('All-League 2nd Team')) bad.push('ceremony ' + rows.join('/'));
    return bad.length ? Promise.reject(new Error(bad.join('; '))) : 'week ' + (Rc.w + 1) + ' ladder ' + Rc.mvp.map(id => c.players[id].name.split(' ').pop() + pblTrendGlyph(pblTrend(c, id))).join(' ') + ' · Sixth Man ' + h.names.sixth;
  }), P);

  await R.step('the offseason: benches age, re-sign (about PBL.benchKeep of the expiring), leave or retire, and fill back to four; a cheap owner never pays the tax; your team\'s bench moves make the news and the depth chart; the next season\'s chemistry follows who stayed', () => ev(() => {
    const bad = [], tot = { exp: 0, left: 0, ret: 0, joined: 0 };
    for (let seed = 71; seed <= 82; seed++) { const c = tPro(seed); for (const id of frIds()) for (const m of frBenchOf(c, id)) if (m.contract.years === 1) tot.exp++; c.phase = 'offseason'; c.offseason = { step: 1 }; const mv = offseasonMoves(c), B = mv.bench; tot.left += B.left.length; tot.ret += B.retired.length; tot.joined += B.joined.length;
      for (const id of frIds()) { if (frBenchOf(c, id).length !== 4) bad.push(seed + ' ' + id + ' bench ' + frBenchOf(c, id).length); const F = frx(c, id); if (F.owner.kind === 'cheap' && frPayroll(c, id).five + frDepthPay(c, id) > PBL.taxLine + 1) bad.push(id + ' cheap over'); }
      const L = ladderOf(c); if (!L || L.length !== 5 || !L.includes('me')) bad.push('ladder ' + (L && L.length)); const mine = meOf(c).club; if ((B.joined.some(x => x.club === mine) || B.left.some(x => x.club === mine)) && !c.news.some(n => / bench\.| leaves the /.test(n.t))) bad.push('no news for your bench');
      if (seed === 71) { const groups = {}; for (const id of frIds()) groups[id] = frGroupIds(c, id).join(); newSeason(c); for (const id of frIds()) { const F = c.fr[id]; if (!(F.chem >= 0 && F.chem <= PBL.chemMax)) bad.push('chem ' + F.chem); } } }
    const keep = 1 - (tot.left + tot.ret) / Math.max(1, tot.exp); if (tot.joined !== tot.left + tot.ret || keep < 0.3 || keep > 0.75) bad.push('turnover ' + JSON.stringify(tot) + ' keep ' + keep.toFixed(2));
    return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : '12 offseasons: ' + tot.exp + ' expiring, ' + tot.left + ' left, ' + tot.ret + ' retired, ' + tot.joined + ' joined (kept ' + Math.round(keep * 100) + '%)';
  }), P);

  // old saves: the W4 build's twelve-franchise PBL, mid-season and in the offseason
  const FIX = path.join(__dirname, 'fixtures');
  await R.step('old saves (2.0, twelve franchises): mid-season keeps its schedule and the old top-8 playoffs; the four new rows join at 1★ with benches; the next season is the 2.1 PBL (sixteen starters, fifteen weeks, conference playoffs); an offseason save expands in its moves', async () => {
    const out = [];
    for (const f of ['save_w4_pro_midseason.json', 'save_w4_pro_offseason.json']) { const raw = fs.readFileSync(path.join(FIX, f), 'utf8'); await P.ev(raw => { localStorage.setItem(CONFIG.save.key, raw); }, raw); await P.page.reload(); await P.page.waitForTimeout(700); await P.ev(src => { (0, eval)(src); }, LIB);
      const r = await P.ev(() => { const bad = [], s = HH.game.save.data, c = s.career, T = frTable(c), was = c.phase;
        if (Object.keys(T).length !== 16 || ['foxes', 'falcons', 'tigers', 'rockets'].some(id => T[id].stars !== 1 || frBenchOf(c, id).length !== 4)) bad.push('the new rows'); if (c.active.length !== 12 || pblOn(c)) bad.push('the season in progress changed: ' + c.active.length + ' ' + c.pbl);
        if (!c.team.mates.every(m => m.contract)) bad.push('your bench contracts');
        if (was === 'regular') { tSim(s, c => c.phase !== 'regular'); if (c.playoffs && (c.playoffs.fmt === 2 || c.playoffs.seeds.length !== 8)) bad.push('old playoffs ' + c.playoffs.seeds.length); }
        tSim(s, c => c.phase === 'offseason'); if (!c.offseason.prog) offseasonProgression(c); const mv = offseasonMoves(c); if ((mv.expansion || []).length !== 4) bad.push('expansion ' + (mv.expansion || []).length); const offers = offseasonContract(c); if (offers) acceptContract(c, 0); newSeason(c);
        if (!pblOn(c) || c.active.length !== 16 || c.seasonLength !== 15 || c.schedule.length !== 15 || !pblReady(c)) bad.push('season 2: ' + c.pbl + ' ' + c.active.length + ' ' + c.seasonLength);
        tSim(s, c => c.phase !== 'regular'); if (c.playoffs && c.playoffs.fmt !== 2) bad.push('season 2 playoffs');
        return bad.length ? 'BAD ' + bad.join('; ') : was + ' → season ' + c.season + ' in the 2.1 format (' + (mv.expansion || []).map(p => clubOf(p.club).abbr + ' ' + p.ovr).join(', ') + ')'; });
      if (r.startsWith('BAD')) throw new Error(f + ': ' + r); out.push(f.replace('save_w4_pro_', '').replace('.json', '') + ': ' + r); }
    return out.join(' · ');
  }, P);

  await R.step('screens (desktop): the hub (calendar on key weeks), the League\'s standings, franchises, schedule, history and races; the franchise page (the club and its history); the bracket (projected, in the playoffs, done); a TV game\'s result; awards night; the Codex: no cut or overlapping text', () => ev(() => { const bad = tScreens(HH.game, false); return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : 'all clean'; }), P);
  if (P.errors.length) console.log('page errors:', P.errors.slice(0, 5));

  const Q = await openPage(b, { wait: 900, phone: true }); await Q.ev(src => { (0, eval)(src); }, LIB);
  await R.step('screens (phone): the same, with 64 px targets', () => Q.ev(() => { const bad = tScreens(HH.game, true); return bad.length ? Promise.reject(new Error(bad.slice(0, 6).join('; '))) : 'all clean'; }), Q);
  if (Q.errors.length) console.log('phone page errors:', Q.errors.slice(0, 5));
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
