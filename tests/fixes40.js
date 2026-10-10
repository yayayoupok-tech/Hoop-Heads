// 4.0 (§0): the fixes before the new format. The league keeps its stars (3–5 players at 88–95 a season, none higher);
// a toast sits in the top band, never over a button, and the plan's toast shows only when the plan changes; a crew
// hire costs credits, and only the pros pay salaries; a benched pro who outplays the starter is called up in 3 weeks,
// and after 3 bench weeks the agent brings a trade to a team where you start; Most Improved never goes to the MVP (this
// season's or the reigning one); the PBL ranks on PBL games only (60% of the team's); the 3-Point Contest takes the best
// shooters; HOME and LEAGUE name teams, never abbreviate them; and nothing says "rival" any more.
// Usage: node tests/fixes40.js [--phone]   (ONLY=<regex> runs some steps)
const { launch, openPage, runner } = require('./lib');
(async () => {
  const PHONE = process.argv.includes('--phone');
  const browser = await launch(); const R = runner('fixes40' + (PHONE ? ' (phone)' : '')); const D = await openPage(browser, { phone: PHONE }); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  await ev(() => {
    window.__hs = seed => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Fix Test', look: PRESET_LOOKS[seed % 16], number: 9, style: 'slasher', seed }); g.save.data.c1 = a; hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; return a; };
    window.__pro = seed => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const c = testProLeague(seed, g.save.data); g.save.data.career = c; c.events.length = 0; c.me.money = 5e7; return c; };
    window.__week = c => { const s = HH.game.save.data; let guard = 0; while (!userGame(c) && guard++ < 40) { c.events.length = 0; if (c.phase === 'offseason') { if (c.offseason && c.offseason.v === 2) lgOffseasonAuto(c, { fa: () => lgUserFaDefault(c), rebuild: true }); else { offseasonProgression(c); offseasonMoves(c); } newSeason(c); } else if (!simUserGame(s)) break; } return simUserGame(s); };
    window.__bench = c => { const L = ladderOf(c); if (L && L[0] === 'me') { L.splice(0, 1); L.splice(1, 0, 'me'); } return L; };
    window.__texts = () => { const g = HH.game; g.ui.trans = null; g.ui.toastT = 0; RBF.boxes = []; let X = []; try { for (let k = 0; k < 3; k++) { RBF.boxes = []; g.drawUI(g.ctx, g.W, g.H); } } finally { X = RBF.boxes || []; RBF.boxes = null; } return X.map(b => b.t); };
  });

  await step('the league keeps its stars (§0.1): after each offseason 3–5 league players at 88–95, none higher; the tournament ceiling grants stop at +' + 3 + ' a rating; unbeaten after 8 wins, every opponent brings its best game', () => ev(() => {
    const bad = [], c = __pro(401), counts = []; for (let s = 0; s < 4; s++) { let guard = 0; while (c.phase !== 'offseason' && guard++ < 80) { c.events.length = 0; if (!simUserGame(HH.game.save.data)) break; } if (c.phase !== 'offseason') { bad.push('season ' + s + ' never ended'); break; } if (c.offseason && c.offseason.v === 2) lgOffseasonAuto(c, { fa: () => lgUserFaDefault(c), rebuild: true }); else { offseasonProgression(c); offseasonMoves(c); } newSeason(c);
      const o = c.active.filter(id => id !== c.meId && c.players[id]).map(id => recOvr(c.players[id])), n = o.filter(v => v >= CR.stars.ovr[0]).length; counts.push(n + ' (top ' + Math.max(...o) + ')'); if (n < CR.stars.n[0] || n > CR.stars.n[1]) bad.push('season ' + c.season + ': ' + n + ' stars'); if (Math.max(...o) > CR.stars.ovr[1]) bad.push('season ' + c.season + ': a ' + Math.max(...o)); }
    { const c2 = __pro(413), st = c2.standings[c2.meId], opp = c2.active.find(id => id !== c2.meId); st.w = CR.unbeaten.from; st.l = 0; if (lgUnbeatenEdge(c2, opp, c2.meId) !== CR.unbeaten.edge) bad.push('no edge for an unbeaten run\'s opponent'); if (lgUnbeatenEdge(c2, c2.meId, opp)) bad.push('the edge went to you'); try { finishWeek(c2, null); } catch (e) { /* (the headline comes first; the rest of the week needs a game) */ } if (!(c2.news || []).some(n => /best game/.test(n.t || n.text || n))) bad.push('no headline for the unbeaten run'); st.l = 1; if (lgUnbeatenEdge(c2, opp, c2.meId)) bad.push('the edge outlived the first loss'); }
    if (TNE_CEILMAX() !== 3) bad.push('the ceiling cap is ' + TNE_CEILMAX()); const B = c.me; B.ceilTn = 9; if (ceilTnOf(B) !== 3) bad.push('ceilTnOf ' + ceilTnOf(B));
    if (bad.length) throw new Error(bad.join(' · ')); return 'stars a season: ' + counts.join(', ');
  }));

  await step('toasts (§0.3): in the top band and never over a button, on every HOME tab; the plan\'s toast only when the plan changes', () => ev(() => {
    const bad = [], g = HH.game, c = __pro(402); const seen = [];
    for (const tab of ['home', 'league', 'events', 'career', 'store']) { g.hubTab = tab; g.ui.clearTo(careerHub(g)); g.drawUI(g.ctx, g.W, g.H); for (const [w, h] of [[560, 50], [820, 70]]) { const y = g.ui.toastY(w, h), x = UI_W / 2 - w / 2, hit = (g.ui.screen.widgets || []).filter(b => !b.hidden && b.w > 0 && b.h > 0 && x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y); if (hit.length) bad.push(tab + ': a ' + w + '-wide toast at y ' + y + ' covers ' + hit.map(b => b.label || b.kind).join(', ')); if (y > UI_H * 0.62) bad.push(tab + ': the toast is low (' + y + ')'); seen.push(tab + ' ' + y); } }
    const K = { B: c.me, R: () => meOf(c), focus: () => c.me.focus, sessionXp: () => 0 }; const btns = planButtons(g, K, null), rest = btns.find(b => b.plan === 'rest'); if (!rest) bad.push('no REST button'); else { g.ui.toast = null; g.ui.toastT = 0; c.me.plan = 'rest'; rest.onPress(); if (g.ui.toastT > 0) bad.push('a toast for the plan you already had'); c.me.plan = 'auto'; rest.onPress(); if (!(g.ui.toastT > 0)) bad.push('no toast for a new plan'); }
    if (bad.length) throw new Error(bad.slice(0, 6).join(' · ')); return 'toast rows: ' + seen.join(', ');
  }));

  await step('crew pay (§0.4): a hire costs credits (none without them), no salary before the pros, and the hire screen shows the cost and that there\'s no salary', () => ev(() => {
    const bad = [], g = HH.game, a = __hs(403); a.stageYear = 2; const cand = crewCandidates(a, 'skills')[1]; if (!cand) throw new Error('no candidate'); const cost = crewHireCost(cand); if (!(cost > 0)) bad.push('a hire costs ' + cost + ' credits');
    a.credits = 0; if (crewHire(a, cand)) bad.push('hired with no credits'); a.credits = cost + 3; if (!crewHire(a, cand)) bad.push('couldn\'t hire with ' + (cost + 3) + ' credits'); else if (a.credits !== 3) bad.push('credits left ' + a.credits + ' (want 3)');
    const M = crewMember(a, 'skills'); if (M && crewPay(a, M) !== 0) bad.push('a high school salary of ' + crewPay(a, M)); a.cash = 500; for (let k = 0; k < 3; k++) crewAfterGame(a, false); if (a.cash !== 500) bad.push('three high school weeks cost ' + (500 - a.cash)); if ((crewOf(a) || {}).unpaid) bad.push('unpaid weeks in high school');
    g.ui.clearTo(amHub(g)); g.ui.push(crewHireScreen(g, 'scout')); a.stageYear = 3; g.ui.clearTo(amHub(g)); g.ui.push(crewHireScreen(g, 'scout')); const T = __texts().join(' | '); if (!/credits/i.test(T)) bad.push('the hire screen shows no credit cost'); if (!/no salar/i.test(T)) bad.push('the hire screen doesn\'t say there\'s no salary');
    const c = __pro(404), P = crewCandidates(c, 'physio')[0]; if (!(crewPay(c, P) > 0)) bad.push('a pro physio is unpaid');
    if (bad.length) throw new Error(bad.join(' · ')); return 'a Lv' + cand.lv + ' hire: ' + cost + ' credits, no salary in high school; a pro physio ' + crewMoney(crewPay(c, P)) + ' a season';
  }));

  await step('bench limbo (§0.5): a benched pro whose form beats the starter\'s 3 weeks running starts; one who rates at or over the starter starts after 3 straight bench weeks; behind a better starter, the agent brings a trade to a team where you start', () => ev(() => {
    const bad = [], c = __pro(405), T = c.team; const L = __bench(c); if (!L || L[0] === 'me') throw new Error('no bench'); T.trust = 50; T.form = {}; T.hot = {}; const st = L[0];
    for (let w = 0; w < TM.depth.weeks; w++) { llForm(c, 'me', 20.5); llForm(c, st, 20); const r = llDepthWeek(c); if (w < TM.depth.weeks - 1 && r) bad.push('called up after ' + (w + 1) + ' weeks'); }
    if (!isStarter(c)) bad.push('outplaying the starter ' + TM.depth.weeks + ' weeks running (by half a point) didn\'t get the start');
    const c2 = __pro(406), me2 = meOf(c2); for (const k of RATING_KEYS) me2.r[k] = Math.max(me2.r[k], 72); /* (the fixture's player is a 43: a Development League regular is about 70) */ __bench(c2); const so2 = tmMateOvr(ladderStarterMate(c2)); let up = null, w2 = 0;
    for (let w = 0; w < 6 && !isStarter(c2); w++) { c2.events.length = 0; if (!simUserGame(HH.game.save.data)) break; w2++; up = up || (c2.events || []).find(e => e.kind === 'depth' && e.title === 'YOU START'); }
    if (recOvr(me2) < so2) bad.push('the test player (' + recOvr(me2) + ') doesn\'t out-rate the starter (' + so2 + ')'); else if (!isStarter(c2)) bad.push('rated ' + recOvr(me2) + ' over the starter\'s ' + so2 + ', still on the bench after ' + w2 + ' weeks'); else if (w2 > TM.limbo.weeks) bad.push('the call-up took ' + w2 + ' weeks');
    const c3 = __pro(412), me = meOf(c3); for (const k of RATING_KEYS) me.r[k] = Math.max(me.r[k], 72); __bench(c3); const m3 = ladderStarterMate(c3); for (const k of RATING_KEYS) m3.r[k] = 92; let offer = null, weeks = 0;
    for (let w = 0; w < 8 && !offer; w++) { if (isStarter(c3)) __bench(c3); c3.events.length = 0; if (!simUserGame(HH.game.save.data)) break; weeks++; offer = (c3.events || []).find(e => e.kind === 'tradeoffer' && e.limbo); }
    if (!offer) bad.push('no trade after ' + weeks + ' bench weeks (dest ' + proLimboDest(c3) + ')'); else { const run = (me && c3.me.limboRun) ? c3.me.limboRun.n : 0; if (run !== TM.limbo.weeks) bad.push('the trade came after ' + run + ' straight bench weeks'); /* (the test benches you again when your form wins the start) */ const from = me.club; proTradeOfferAnswer(c3, offer, true); if (me.club === from) bad.push('the trade didn\'t happen'); if (!isStarter(c3)) bad.push('traded but not starting'); }
    if (bad.length) throw new Error(bad.join(' · ')); return 'form: called up after ' + TM.depth.weeks + ' weeks; rated ' + recOvr(me2) + ' over ' + so2 + ': starts after ' + w2 + ' bench weeks (' + (up ? up.lines[0] : 'no card') + '); behind a 92: the agent\'s trade after ' + weeks + ': ' + (offer ? offer.lines[0] : '');
  }));

  await step('Most Improved (§0.6): never this season\'s MVP or the reigning one, over four seasons', () => ev(() => {
    const bad = [], c = __pro(407), rows = []; for (let s = 0; s < 4; s++) { let guard = 0; while (c.phase !== 'offseason' && guard++ < 80) { c.events.length = 0; if (!simUserGame(HH.game.save.data)) break; } const aw = c.history[0]; if (!aw || aw.season !== c.season) { bad.push('no awards for season ' + c.season); break; }
      const prev = c.history[1]; rows.push('S' + aw.season + ' MVP ' + (aw.names.mvp || '-') + ', MIP ' + (aw.names.mip || '-')); if (aw.mip && aw.mip === aw.mvp) bad.push('S' + aw.season + ': the MVP got MIP'); if (aw.mip && prev && aw.mip === prev.mvp) bad.push('S' + aw.season + ': the reigning MVP got MIP');
      if (c.offseason && c.offseason.v === 2) lgOffseasonAuto(c, { fa: () => lgUserFaDefault(c), rebuild: true }); else { offseasonProgression(c); offseasonMoves(c); } newSeason(c); }
    if (bad.length) throw new Error(bad.join(' · ')); return rows.join(' · ');
  }));

  await step('PBL rankings (§0.7): PBL games only: a season on the bench isn\'t ranked, every ranked player has ' + 60 + '% of their team\'s games; the Development League ranks its own', () => ev(() => {
    const bad = [], c = __pro(408); for (let w = 0; w < 6; w++) { __bench(c); c.events.length = 0; if (!simUserGame(HH.game.save.data)) break; }
    const me = rkMeRow(c); if (me && me.r > 0) bad.push('ranked #' + me.r + ' with ' + ((c.stats[c.meId] || {}).g || 0) + ' PBL games'); const X = rkProLines(c);
    for (const p of rkPlayers(c)) { const x = X[p.id]; if (!x) continue; const tg = x.tw + x.tl; if (tg && x.g < Math.ceil(RK.proMin * tg)) bad.push(p.n + ' ranked with ' + x.g + ' of ' + tg); }
    const dev = llPlayerRows(c), mine = dev.find(r => r.me); if (!dev.length) bad.push('no Development League rankings'); else if (!mine) bad.push('you aren\'t in the Development League rankings');
    if (bad.length) throw new Error(bad.slice(0, 5).join(' · ')); return 'benched 6 weeks: unranked in the PBL, #' + (mine ? mine.r : '?') + ' of ' + dev.length + ' in the Development League';
  }));

  await step('the 3-Point Contest (§0.8): the four best shooters by 3P% (a minimum of attempts) and Shooting', () => ev(() => {
    const bad = [], c = __pro(409); for (let w = 0; w < 8; w++) { c.events.length = 0; if (!simUserGame(HH.game.save.data)) break; }
    c.me.fame = 0; const A = setupAllStar(c), sho = id => c.players[id].r.sho, all = c.active.filter(id => c.players[id]).map(sho).sort((a, b) => b - a), med = all[all.length >> 1];
    if (A.field.length !== 4) bad.push('a field of ' + A.field.length); for (const id of A.field) if (sho(id) < med) bad.push(c.players[id].name + ' (Shooting ' + sho(id) + ') under the league\'s median ' + med);
    if (bad.length) throw new Error(bad.join(' · ')); return A.field.map(id => c.players[id].name + ' ' + sho(id) + ' (' + (100 * c.stats[id].tpm / Math.max(1, c.stats[id].tpa)).toFixed(0) + '%)').join(', ') + ' · the median Shooting ' + med;
  }));

  await step('team names (§0.10): HOME and LEAGUE name teams, never by their three letters', () => ev(() => {
    const bad = [], g = HH.game, c = __pro(410); for (let w = 0; w < 3; w++) { c.events.length = 0; simUserGame(g.save.data); } const ab = new RegExp('(^|[^A-Za-z])(' + TEAMS.map(t => t.abbr).join('|') + ')([^A-Za-z]|$)'), hits = [];
    for (const tab of ['home', 'league']) { g.hubTab = tab; g.ui.clearTo(careerHub(g)); for (const t of __texts()) if (ab.test(t)) hits.push(tab + ': ' + t); }
    if (hits.length) bad.push(hits.slice(0, 5).join(' / ')); if (bad.length) throw new Error(bad.join(' · ')); return 'no abbreviations on HOME and LEAGUE';
  }));

  await step('no rivals (§0.11): the standings note, the recruiting cards, the timeline\'s tag and the Art Lab\'s chips; an old save\'s rival timeline entries go', () => ev(() => {
    const bad = [], g = HH.game, c = __pro(411); if (TL_STYLE.rival) bad.push('the timeline still has a RIVAL tag'); g.hubTab = 'league'; g.ui.clearTo(careerHub(g)); for (const t of __texts()) if (/rival/i.test(t)) bad.push('LEAGUE: ' + t);
    g.ui.push(artLabScreen(g)); for (const t of __texts()) if (/^RIVAL/.test(t)) bad.push('Art Lab: ' + t);
    const old = { version: 30, career: { timeline: [{ kind: 'rival', text: 'Beat your rival' }, { kind: 'title', text: 'Won it all' }], me: { timeline: [{ kind: 'rival', text: 'x' }] } } }; y40Migrate(old); if (old.career.timeline.length !== 1 || old.career.me.timeline.length) bad.push('the migration kept rival entries');
    if (bad.length) throw new Error(bad.join(' · ')); return 'nothing says rival';
  }));

  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
