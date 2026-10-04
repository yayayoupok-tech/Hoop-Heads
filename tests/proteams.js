// V12 (Part 2 §6, 2.0 §4.4/4.5): the pro teams and championships (2.1 W5: sixteen franchises, the conference playoffs;
// tests/pbl21.js has the rest of the 2.1 league). Franchises with an identity (city, crest,
// owner, coach, market, fans, rival, history); team strength and title odds; the top 8 in best-of-3 rounds and the
// Finals; the Finals MVP; a title's parade, ring and banner; dynasties; the 5★ spots' scarcity; the owners' moves and a
// rebuild's offer; the Road's new goals and jerseys retired; the offers as team cards (an axis each), the plain-words
// bar, the combine's stock tags; every new screen on a desktop and a phone. Usage: node tests/proteams.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('pro teams'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  const mkPro = `(seed => { const save = defaultSave(), c = testProLeague(seed, save); save.career = c; c.events.length = 0; c.me.money = 2e7; return { save, c }; })`;
  // a game as the career simulator plays it (simBox for your slot), and a season of them
  const fake = `((c, g) => { const r = simBox(c, g.h, g.a, careerRng(c)); const toP = id => { const s = r.box[id]; return Object.assign({ name: c.players[id].name }, makeStats(), { pts: s.pts, fgm: s.fgm, fga: s.fga, tpm: s.tpm, tpa: s.tpa, reb: s.reb, stl: s.stl, blk: s.blk, to: s.to, dunkM: s.dunk, dunkA: s.dunk, layM: 0, layA: 0, ankles: s.ank, moves: 20 }); }; const meH = g.h === c.meId, opp = meH ? g.a : g.h; return { teams: [{ score: meH ? r.hs : r.as, players: [toP(c.meId)] }, { score: meH ? r.as : r.hs, players: [toP(opp)] }], overtime: r.ot }; })`;
  const season = `((save, fake) => { const c = save.career; let n = 0; while (c.phase !== 'offseason' && n++ < 90) { const g = userGame(c); if (!g) break; proStartGame(c); if (!playsThisWeek(c)) proSimBenchGame(c); else careerAfterGame(save, eval(fake)(c, g), 0, true); } return c; })`;
  const star = `(c => { for (const k of RATING_KEYS) { meOf(c).r[k] = 99; meOf(c).caps[k] = 99; } const L = ladderOf(c); if (L && L[0] !== 'me') { L.splice(L.indexOf('me'), 1); L.unshift('me'); } return c; })`;
  const A = [mkPro, fake, season, star];

  await step('sixteen franchises with an identity: a city, a 10×10 mark on a pixel shield in their colors, an owner (four win-now, five patient, four cheap, three meddlers), a market (five big, six mid, five small), a fan base, a rival (in pairs), titles before your career (one champion a season from ' + 1979 + '; the four newest have none), retired jerseys', () => ev(() => {
    const bad = [], kinds = {}, mk = {}, ids = frIds(); if (ids.length !== 16) bad.push(ids.length + ' franchises');
    for (const id of ids) { const I = FR_INFO[id]; if (!I || !I.city || !I.legends.length) { bad.push(id + ' info'); continue; } kinds[I.owner[1]] = (kinds[I.owner[1]] || 0) + 1; mk[I.market] = (mk[I.market] || 0) + 1; if (FR_INFO[I.rival].rival !== id || I.rival === id) bad.push(id + ' rival ' + I.rival); const M = FR_CREST_MARK[id]; if (!M || M.length !== 10 || M.some(r => r.length !== 10)) bad.push(id + ' mark');
      const cv = frCrestCanvas(id), px = cv.getContext('2d').getImageData(0, 0, 16, 18).data; let ink = 0; for (let i = 3; i < px.length; i += 4) if (px[i] > 0) ink++; if (cv.width !== 16 || cv.height !== 18 || ink < 150) bad.push(id + ' crest ' + ink); if (!frFullName(id).startsWith(I.city)) bad.push(id + ' full name'); }
    if (kinds.winnow !== 4 || kinds.patient !== 5 || kinds.cheap !== 4 || kinds.meddler !== 3) bad.push('owners ' + JSON.stringify(kinds)); if (mk.big !== 5 || mk.mid !== 6 || mk.small !== 5) bad.push('markets ' + JSON.stringify(mk));
    const H = frHistory(), years = Object.keys(H.years).map(Number); if (years.length !== FRN.year1 - FRN.founded || Math.min(...years) !== FRN.founded || Math.max(...years) !== FRN.year1 - 1) bad.push('history ' + years.length); for (const id of ids) if (H.byId[id].length !== FR_INFO[id].titles) bad.push(id + ' titles');
    if (bad.length) throw new Error(bad.join(' | ')); return ids.length + ' franchises · owners ' + JSON.stringify(kinds) + ' · ' + years.length + ' seasons of history · the Pilots: ' + H.byId.pilots.length + ' titles';
  }));

  await step('a career\'s franchises: each row gets its coach, owner, fans and history on first look (an old save keeps the coach it has and its story\'s owner); your team\'s coach is the franchise\'s; its bench is the one its card shows (the same seed, season and stars)', () => ev(([mkPro]) => {
    const { c } = eval(mkPro)(5), bad = []; const T = frxAll(c); for (const id of frIds()) { const F = T[id]; if (!F.ix || !F.coach || !F.coach.name || !F.owner || !(F.fans > 0) || !Array.isArray(F.titles)) bad.push(id); }
    const me = meOf(c); if (c.team.coach.name !== T[me.club].coach.name) bad.push('your coach ' + c.team.coach.name + ' vs ' + T[me.club].coach.name);
    const card = frBestMates(c, me.club, c.season, frMine(c), c.seed, 3).map(m => m.name).sort(), team = c.team.mates.map(m => m.name); if (!card.every(n => team.includes(n))) bad.push('card ' + card + ' vs bench ' + team);
    const old = eval(mkPro)(6).c; delete old.fr[meOf(old).club].ix; old.team.coach = { name: 'Coach Keepme', style: 'fiery' }; if (frx(old, meOf(old).club).coach.name !== 'Coach Keepme') bad.push('an old save\'s coach changed');
    if (bad.length) throw new Error(bad.join(' | ')); return 'your coach ' + c.team.coach.name + ' (' + coachStyle(c.team.coach).label + '); the card\'s best: ' + card.join(', ');
  }, A));

  await step('team strength: a simulated game counts the league player (strengthOf) and its team edge (2.1: the bench, chemistry and its owner\'s moves: LG.starEdge × the boost); the title odds use the same numbers: they add to 1, hold still for the week, favor the stronger team, and an eliminated team has none', () => ev(([mkPro, fake, season, star]) => {
    const { save, c } = eval(mkPro)(9), bad = []; const id = c.active.find(x => x !== c.meId), club = c.players[id].club, F = frx(c, club); const s0 = pblSlotEdge(c, id); F.boost = 0.35; F.boostS = c.season; if (Math.abs(pblSlotEdge(c, id) - s0 - 0.35 * LG.starEdge) > 1e-9) bad.push('the boost'); F.boost = 0;
    const O = frOdds(c), sum = Object.values(O.p).reduce((a, b) => a + b, 0); if (Math.abs(sum - 1) > 1e-9) bad.push('odds add to ' + sum); if (JSON.stringify(frOdds(c).p) !== JSON.stringify(O.p)) bad.push('the odds moved');
    eval(star)(c); const O2 = frOdds(c); if (!(O2.me > O.me + 0.05) || O2.rank > O.rank) bad.push('a 99 player: ' + O.me + ' → ' + O2.me + ' rank ' + O2.rank); const top = frRank(frTable(c))[0], O3 = frOdds(c, { club: top, next: true }); if (!(O3.me > O2.me)) bad.push('at the best franchise: ' + O3.me + ' vs ' + O2.me);
    const nx = frOdds(c, { club: frIds().find(k => k !== meOf(c).club), next: true }); if (!(nx.me >= 0 && nx.me <= 1)) bad.push('an offer\'s odds');
    let n = 0; while (c.phase === 'regular' && n++ < 40) { const g = userGame(c); proStartGame(c); careerAfterGame(save, eval(fake)(c, g), 0, true); } if (c.phase !== 'playoffs') bad.push('no playoffs: ' + c.phase); else { const P_ = frOdds(c).p, out = c.active.filter(x => !c.playoffs.seeds.includes(x)); if (out.some(x => P_[x] > 0)) bad.push('a team out of the playoffs has odds'); }
    if (bad.length) throw new Error(bad.join(' | ')); return 'your odds ' + oddsPct(O.me) + ' → ' + oddsPct(O2.me) + ' with 99s → ' + oddsPct(O3.me) + ' at the top franchise next season';
  }, A));

  await step('the season (2.1): the top 4 of each conference make the playoffs; conference semifinals and finals best of 3, the Finals best of 5 (the higher seed hosts games 1, 3 and 5); the champion wins the Finals; your result reads the round; the hub\'s calendar has a tile a round', () => ev(([mkPro, fake, season, star]) => {
    const bad = []; let champs = 0, lines = [];
    for (const seed of [11, 12, 13]) { const { save, c } = eval(mkPro)(seed); if (seed === 11) eval(star)(c); eval(season)(save, fake); const h = c.history[0], P_ = c.playoffs; if (!P_ || P_.seeds.length !== 8) { bad.push(seed + ': seeds ' + (P_ && P_.seeds.length)); continue; }
      const sizes = P_.rounds.map(r => r.length).join(','); if (sizes !== '4,2,1') bad.push(seed + ': rounds ' + sizes); P_.rounds.forEach((r, ri) => { for (const s of r) { const bo = ri === 2 ? 5 : 3; if (s.bestOf !== bo || Math.max(s.wa, s.wb) !== Math.ceil(bo / 2) || !s.done) bad.push(seed + ': a series ' + s.wa + '-' + s.wb + ' of ' + s.bestOf); } }); if (P_.fmt !== 2 || PBL_CONFS.some(k => P_.conf[k].length !== 4)) bad.push(seed + ': the conferences');
      const fin = P_.rounds[2][0]; if (P_.champion !== fin.winner || h.champion !== P_.champion || h.champClub !== c.players[P_.champion].club) bad.push(seed + ': the champion');
      const r = c.me.seasonLog[0].playoff; if (!/^(Champion|Lost in the (Finals|conference finals|conference semifinals)|Missed playoffs)$/.test(r)) bad.push(seed + ': result ' + r); lines.push(r); if (P_.champion === c.meId) champs++; }
    { const { c } = eval(mkPro)(14); for (const id of c.active) c.standings[id] = { w: 3, l: 3, pf: 0, pa: 0, strk: 0 }; c.standings[c.meId].w = 9; c.week = c.schedule.length; startPlayoffs(c); const tiles = proCalendar(c).tiles.filter(t => /^(CS|CF|FIN)$/.test(t.wk)); if (tiles.map(t => t.wk).join() !== 'CS,CF,FIN' || !tiles[0].def) bad.push('calendar ' + tiles.map(t => t.wk)); }
    if (bad.length) throw new Error(bad.join(' | ')); return lines.join(' · ') + (champs ? ' · the 99 player won it' : '');
  }, A));

  await step('the Finals MVP: the champion\'s top scorer in the Finals; when you won it from the bench, the teammate who started the Finals takes it (you keep the ring); awards night lists it', () => ev(([mkPro]) => {
    const bad = [], { c } = eval(mkPro)(21), me = meOf(c), o = c.active.find(x => x !== c.meId);
    const mk = (slot) => { c.playoffs = { round: 2, seeds: [c.meId, o], series: [], rounds: [[{ a: c.meId, b: o, wa: 2, wb: 1, bestOf: 3, done: true, winner: c.meId, slot }]], champion: c.meId }; c.playoffs.series = c.playoffs.rounds[0]; };
    mk({ [me.name]: 40, 'Ty Bench': 12 }); let F = poFinalsMvp(c, c.meId); if (F.id !== c.meId) bad.push('you scored most: ' + JSON.stringify(F));
    mk({ [me.name]: 8, 'Ty Bench': 41 }); F = poFinalsMvp(c, c.meId); if (F.id || F.name !== 'Ty Bench' || !F.mate) bad.push('the teammate: ' + JSON.stringify(F));
    c.me.careerStats.titles++; c.phase = 'playoffs'; for (const id of c.active) c.stats[id].g = 10; endSeason(c); const h = c.history[0]; if (h.finalsMvp || h.names.finalsMvp !== 'Ty Bench' || !(c.me.awards.some(a => a.name === 'Champion')) || c.me.awards.some(a => a.name === 'Finals MVP')) bad.push('endSeason ' + JSON.stringify(h.names));
    const cer = (c.events || []).find(e => e.kind === 'ceremony'); if (!cer || !cer.rows.some(r => r.award === 'Finals MVP' && /Ty Bench/.test(r.name))) bad.push('awards night');
    if (bad.length) throw new Error(bad.join(' | ')); return 'a bench title: the ring, and the Finals MVP is ' + h.names.finalsMvp;
  }, A));

  await step('winning a title: the parade, the ring ceremony and the banner (in that order, before awards night); the banner joins the franchise\'s history in your arena; the ring goes in your trophy case; the fans grow', () => ev(([mkPro]) => {
    const bad = [], { c } = eval(mkPro)(22), me = meOf(c), o = c.active.find(x => x !== c.meId), club = me.club, fans0 = frFans(c, club), n0 = frTitlesOf(c, club).length;
    c.playoffs = { round: 2, seeds: [c.meId, o], series: [], rounds: [[{ a: c.meId, b: o, wa: 2, wb: 0, bestOf: 3, done: true, winner: c.meId, slot: { [me.name]: 30 } }]], champion: c.meId }; c.playoffs.series = c.playoffs.rounds[0]; c.me.careerStats.titles++; c.phase = 'playoffs'; for (const id of c.active) c.stats[id].g = 10; endSeason(c);
    const kinds = c.events.map(e => e.kind), ip = kinds.indexOf('parade'), ir = kinds.indexOf('ring'), ib = kinds.indexOf('banner'), ic = kinds.indexOf('ceremony'); if (!(ip >= 0 && ip < ir && ir < ib && ib < ic)) bad.push('order ' + kinds.join(','));
    const T = frTitlesOf(c, club); if (T.length !== n0 + 1 || !T[T.length - 1].mine || T[T.length - 1].year !== frYear(c.history[0].season)) bad.push('banner ' + JSON.stringify(T.slice(-1)));
    const tr = trophiesOf(c).filter(t => t.kind === 'ring'); if (tr.length !== 1 || tr[0].club !== club) bad.push('trophy case ' + JSON.stringify(tr)); if (ringsOf(c).length !== 1) bad.push('rings'); if (!(frFans(c, club) > fans0)) bad.push('fans ' + fans0 + ' → ' + frFans(c, club));
    const ev0 = c.events.find(e => e.kind === 'ring'); if (!ev0.fmvp || ev0.rings !== 1 || ev0.year !== frYear(c.history[0].season)) bad.push('the ring event ' + JSON.stringify(ev0));
    if (bad.length) throw new Error(bad.join(' | ')); return kinds.slice(ip, ic + 1).join(' → ') + ' · banner ' + T[T.length - 1].year + ' · fans ' + frFansText(fans0) + ' → ' + frFansText(frFans(c, club));
  }, A));

  await step('dynasties: titles in a row are a run (yours across franchises, and the franchise\'s): back-to-back, then a three-peat; a season without one ends it; another franchise\'s title ends theirs', () => ev(([mkPro]) => {
    const bad = [], { c } = eval(mkPro)(23), me = meOf(c), o = c.active.find(x => x !== c.meId), club = me.club, runs = [];
    const win = who => { c.playoffs = { round: 2, seeds: [c.meId, o], series: [], rounds: [[{ a: c.meId, b: o, wa: 2, wb: 1, bestOf: 3, done: true, winner: who, slot: { [me.name]: 30 } }]], champion: who }; c.playoffs.series = c.playoffs.rounds[0]; if (who === c.meId) c.me.careerStats.titles++; c.phase = 'playoffs'; for (const id of c.active) c.stats[id].g = 10; endSeason(c); runs.push((c.me.titleRun || 0) + '/' + (c.fr[club].streak || 0)); c.events.length = 0; newSeason(c); };
    win(c.meId); win(c.meId); win(c.meId); if (c.me.titleRun !== 3 || c.fr[club].streak !== 3 || frStreakWord(3) !== 'THREE-PEAT' || frStreakWord(2) !== 'BACK-TO-BACK') bad.push('a three-peat: ' + runs);
    const R = ringsOf(c); if (R.map(r => r.streak).join() !== '1,2,3') bad.push('rings ' + JSON.stringify(R.map(r => r.streak)));
    win(o); if (c.me.titleRun !== 0 || c.fr[club].streak !== 0 || c.me.titleBest !== 3) bad.push('the run ends: ' + runs);
    if (bad.length) throw new Error(bad.join(' | ')); return 'runs (yours/the franchise\'s) ' + runs.join(' → ') + ' · best ' + c.me.titleBest;
  }, A));

  await step('scarcity (§1.3): each offseason at most one 5★ spot opens per 5★ team (about FRN.spot5Odds of them do); a 5★ offer, trade or rebuild move needs that open spot', () => ev(([mkPro]) => {
    const bad = []; let opened = 0, teams = 0;
    for (let seed = 1; seed <= 60; seed++) { const { c } = eval(mkPro)(400 + seed); for (let s = 1; s <= 4; s++) { c.season = s; c.frSpots = null; const S = frSpots5(c), T = frTable(c), five = frIds().filter(id => T[id].stars === 5); teams += five.length; for (const id of Object.keys(S.open)) { if (T[id].stars !== 5) bad.push('a ' + T[id].stars + '★ spot'); opened++; } if (Object.keys(S.open).length > five.length) bad.push('more spots than 5★ teams'); } }
    const share = opened / Math.max(1, teams); if (Math.abs(share - FRN.spot5Odds) > 0.12) bad.push('share ' + share.toFixed(2));
    { const { c } = eval(mkPro)(77), me = meOf(c), T = frTable(c); frxAll(c); T[me.club].mode = 'rebuild'; me.age = 31; c.me.contract.years = 3; for (const k of RATING_KEYS) me.r[k] = 99; c.me.fame = 100; CONFIG.franchise.rebuildOdds = 1; c.frSpots = { season: frSpotSeason(c), open: {} }; const ev = frRebuildOffer(c, new RNG(3)); CONFIG.franchise.rebuildOdds = 0.45; if (ev && T[ev.dest].stars === 5) bad.push('a rebuild sent you to a 5★ team with no open spot'); }
    if (bad.length) throw new Error(bad.join(' | ')); return opened + ' spots opened for ' + teams + ' 5★ team-seasons (' + Math.round(100 * share) + '%; never more than one a team)';
  }, A));

  await step('the owners\' moves (§6): win-now owners at ' + 3 + '★+ trade for a rebuilding franchise\'s veteran (28+) or sign a free agent (+FRN.ownerEdge stars next season); patient and cheap owners at 2★ or less rebuild; cheap owners let a veteran walk; one league player a franchise after it all; the news says so', () => ev(([mkPro]) => {
    const bad = [], seen = { trade: 0, sign: 0, walk: 0 };
    for (let seed = 1; seed <= 12; seed++) { const { c } = eval(mkPro)(500 + seed); const ages = {}; for (const id of c.active) ages[id] = c.players[id].age; c.phase = 'offseason'; c.offseason = { step: 2 }; const out = offseasonMoves(c), T = c.fr;
      for (const m of out.owners || []) { seen[m.kind]++; if (!c.news.some(n => n.t === m.text)) bad.push('no news'); }
      for (const id of frIds()) { const F = T[id], n = c.active.filter(x => c.players[x].club === id).length; if (n !== 1) bad.push(seed + ' ' + id + ': ' + n + ' league players'); if (F.boostS !== c.season + 1 || Math.abs(F.boost) > FRN.ownerEdge + 1e-9) bad.push(seed + ' boost'); const want = F.owner.kind === 'meddler' ? F.mode : F.owner.kind === 'winnow' && F.stars >= FRN.contendAt ? 'contend' : F.owner.kind !== 'winnow' && F.stars <= 2 ? 'rebuild' : 'steady'; if (F.mode !== want || !FR_GM_WORD[F.mode]) bad.push(seed + ' ' + id + ' mode ' + F.mode); } /* (2.1: a meddler picks any plan) */
      for (const m of (out.owners || []).filter(m => m.kind === 'trade')) { const vet = c.active.find(x => c.players[x].club === m.to); if (vet && ages[vet] < 28) bad.push('a trade for a ' + ages[vet] + '-year-old'); } }
    { const { c } = eval(mkPro)(531), T = frxAll(c), mine = meOf(c).club, ids = frIds().filter(id => id !== mine), b = ids[0], s = ids[1]; T[b].owner = { name: 'Win Now', kind: 'winnow' }; T[b].stars = 4; T[s].owner = { name: 'Slow Build', kind: 'patient' }; T[s].stars = 1; for (const id of ids.slice(2)) { T[id].owner = { name: 'Steady', kind: 'patient' }; T[id].stars = 3; }
      const V = c.players[frLeaguePlayer(c, s)], Y = c.players[frLeaguePlayer(c, b)]; V.age = 31; Y.age = 23; for (const k of RATING_KEYS) { V.r[k] = 95; Y.r[k] = 60; } const mv = frOwnerMoves(c, new RNG(5)); if (!mv.some(m => m.kind === 'trade' && m.to === b && m.from === s) || V.club !== b || Y.club !== s) bad.push('the forced trade: ' + JSON.stringify(mv.map(m => m.kind))); }
    if (!seen.sign) bad.push('moves ' + JSON.stringify(seen)); if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return '12 offseasons: ' + JSON.stringify(seen) + ' · a contender takes a rebuilding team\'s veteran';
  }, A));

  await step('a rebuild\'s offer (a story beat): your patient or cheap owner at 2★ or less offers a veteran on a contract to a contender; go (your contract comes along, their league player takes your old club) or stay (coach trust +10, fame +2)', () => ev(([mkPro]) => {
    const bad = [], setup = seed => { const { c } = eval(mkPro)(seed), me = meOf(c), T = frxAll(c); c.phase = 'offseason'; c.offseason = { step: 2 }; T[me.club].owner = { name: 'Pat Owner', kind: 'patient' }; T[me.club].stars = 2; me.age = 30; c.me.contract.years = 3; for (const k of RATING_KEYS) me.r[k] = Math.max(me.r[k], 85); c.me.fame = 60; return c; };
    CONFIG.franchise.rebuildOdds = 1; let c = setup(601), out = offseasonMoves(c), ev1 = out.rebuild; CONFIG.franchise.rebuildOdds = 0.45;
    if (!ev1 || ev1.kind !== 'rebuild' || !c.events.includes(ev1)) { bad.push('no offer: ' + JSON.stringify(out.owners && out.owners.length)); }
    else { const from = meOf(c).club, dest = ev1.dest, mate = c.active.find(x => x !== c.meId && c.players[x].club === dest), sal = c.me.contract.salary; if (!(c.fr[dest].stars > 2)) bad.push('a contender? ' + c.fr[dest].stars); proRebuildAnswer(c, ev1, true); if (meOf(c).club !== dest || c.me.contract.salary !== sal || (mate && c.players[mate].club !== from)) bad.push('the move'); }
    CONFIG.franchise.rebuildOdds = 1; c = setup(601); out = offseasonMoves(c); CONFIG.franchise.rebuildOdds = 0.45; if (out.rebuild) { const club = meOf(c).club, tr = c.team.trust, f = c.me.fame; proRebuildAnswer(c, out.rebuild, false); if (meOf(c).club !== club || c.team.trust !== Math.min(100, tr + 10) || c.me.fame !== Math.min(100, f + 2)) bad.push('staying'); }
    if (bad.length) throw new Error(bad.join(' | ')); return 'the offer: to the ' + clubOf(ev1.dest).name + ' (' + frStars(c, ev1.dest) + '★)';
  }, A));

  await step('the Road\'s goals (§6): a franchise player (a whole season started and an All-League team), a ring, Finals MVP, a jersey retired (6+ seasons at a franchise with a title or 3 All-League teams) at retirement; a save from before marks what it already did quietly', () => ev(([mkPro]) => {
    const bad = [], row = (s, club, aw, bench) => ({ season: s, club, g: 11, awards: aw, bench: bench || 0, ovr: 80, w: 6, l: 5 });
    const jersey = (n, titles, allL) => { const { save, c } = eval(mkPro)(700 + n * 10 + titles + allL), me = meOf(c); c.me.seasonLog = []; for (let s = 1; s <= n; s++) c.me.seasonLog.unshift(row(s, me.club, [].concat(s <= titles ? ['Champion'] : []).concat(s <= allL ? ['All-League 2nd Team'] : []))); c.season = n; c.events.length = 0; retireCareer(save); return (c.me.jerseys || []).length > 0 && frRetiredOf(c, me.club).some(r => r.me); };
    if (!jersey(6, 1, 0)) bad.push('6 seasons + a title'); if (jersey(5, 1, 0)) bad.push('5 seasons + a title'); if (!jersey(6, 0, 3)) bad.push('6 seasons + 3 All-League'); if (jersey(6, 0, 2)) bad.push('6 seasons + 2 All-League');
    const { c } = eval(mkPro)(780), me = meOf(c); c.me.seasonLog = [row(1, me.club, ['All-League 1st Team'], 0)]; c.me.awards.push({ s: 1, name: 'Finals MVP' }); let T = roadTests(c); if (!T.franchise || !T.fmvp || T.jersey) bad.push('tests ' + JSON.stringify({ f: T.franchise, m: T.fmvp, j: T.jersey }));
    c.me.seasonLog = [row(1, me.club, ['All-League 1st Team'], 3)]; if (roadTests(c).franchise) bad.push('a franchise player with bench weeks');
    const R = roadOf(c); R.init = true; delete R.v12; for (const k in R.done) delete R.done[k]; c.me.seasonLog = [row(1, me.club, ['All-League 1st Team'], 0)]; c.events.length = 0; roadCheck(c); if (!R.done.franchise || !R.done.fmvp || c.events.some(e => e.kind === 'road' && /FRANCHISE|FINALS/.test(e.title))) bad.push('the quiet migration');
    const labels = ROAD.list.map(r => r.id).join(','); if (!/team5,franchise,title,fmvp,jersey,hof$/.test(labels)) bad.push('order ' + labels);
    if (bad.length) throw new Error(bad.join(' | ')); return ROAD.list.slice(-6).map(r => r.label).join(' → ');
  }, A));

  await step('the offers (2.0 §4.4/4.5): out of school each offer wins on a different axis (the best title odds, the most money, the start); its title odds as a rookie; the plain-words bar ("5★ teams want overall X + fame 40. You: a / b"); free agency\'s cards; a trade side by side', () => ev(([mkPro]) => {
    const bad = []; let line = '';
    for (const seed of [77, 78, 79, 80]) { const save = defaultSave(), a = amCreate(save, { name: 'Offer Test', look: PRESET_LOOKS[3], number: 23, style: 'shooter', seed }); for (const k in a.r) a.r[k] = Math.min(85, a.r[k] + 30); a.age = 20; a.stage = 'combine'; const O = proEntryOffers(a), odds = proEntryOdds(a);
      if (odds.length !== O.offers.length || odds.some(p => !(p >= 0 && p <= 1))) bad.push(seed + ' odds ' + odds); const rb = O.offers.find(o => o.kind === 'rebuild'); if (rb && O.offers.some(o => o !== rb && o.salary >= rb.salary)) bad.push(seed + ': the rebuild doesn\'t pay the most');
      const cards = O.offers.map((o, i) => ({ club: o.club, stars: o.stars, odds: odds[i], salary: o.salary, start: !!o.promised, kindLabel: frKindLabel(o), fameMul: frFameMul(null, o.club, o.stars) })), ax = offerAxes(cards); if (new Set(ax).size !== ax.length || ax.some(x => !x)) bad.push(seed + ' axes ' + ax); if (seed === 77) line = O.offers.map((o, i) => clubOf(o.club).abbr + ' ' + o.stars + '★ ' + ax[i] + ' ' + oddsPct(odds[i])).join(' · '); }
    const { c } = eval(mkPro)(81); const w = frWantLine(c, 5); if (!/^5★ teams want overall \d+ \+ fame 40( \+ a playoff series won)?\. You: \d+ \/ \d+\.$/.test(w)) bad.push('want line: ' + w); const ovr = frWantOvr(c, 5), M = c.me; if (ovr + 40 / FRN.fameDiv + (M.hype || 0) / FRN.hypeDiv + Math.min(FRN.playoffMax, FRN.playoffVal * frPoWins(c, 2)) < FRN.bar[4] - 1e-9) bad.push('the overall misses the bar');
    c.me.contract.years = 1; for (const id of c.active) c.stats[id].g = 10; c.phase = 'regular'; endSeason(c); offseasonProgression(c); offseasonMoves(c); c.events.length = 0; const offers = offseasonContract(c) || []; const fa = faOfferCards(c, offers); if (fa.length !== offers.length || fa.some(d => d.odds == null || !d.mates.length)) bad.push('free agency cards');
    if (bad.length) throw new Error(bad.join(' | ')); return line + ' · ' + w;
  }, A));

  // the screens, on a desktop and a phone: no page errors, nothing cut or off the screen
  const screens = async (Dx, tag) => Dx.ev(([mkPro, fake, season, star, tag]) => {
    const g = HH.game, bad = [], cut = []; const ok = (name, open) => { try { open(); const s = g.ui.screen; if (s && s.onTap && /^(title-|combine|draft|commitday)/.test(s.name)) s.onTap(0, 0); for (let i = 0; i < 3; i++) g.ui.update(0.5, g.input); RBF.boxes = []; g.drawUI(g.ctx, g.W, g.H); for (const b of RBF.boxes || []) if (b.cut && b.a >= 0.35) cut.push(name + ': "' + String(b.cut).slice(0, 40) + '"'); RBF.boxes = null; } catch (e) { bad.push(name + ': ' + e.message); } };
    localStorage.clear(); g.save = new SaveSystem(); const c = testProLeague(31, g.save.data); g.save.data.career = c; c.events.length = 0; g.save.data.c1.handedOff = true; const me = meOf(c);
    ok('franchise', () => { g.ui.clearTo(careerHub(g)); g.ui.push(franchiseScreen(g, me.club)); }); ok('franchise-other', () => { g.ui.clearTo(careerHub(g)); g.ui.push(franchiseScreen(g, frIds().find(k => k !== me.club))); });
    ok('league-franchises', () => { g.leagueTab = { tab: 1, player: 0 }; g.ui.clearTo(careerHub(g)); g.ui.push(leagueScreen(g)); });
    ok('trade', () => { g.ui.clearTo(careerHub(g)); g.ui.push(tradeCompareScreen(g, frIds().find(k => k !== me.club))); }); ok('moving-up', () => { g.mgmtTab = { tab: 0 }; g.ui.clearTo(careerHub(g)); g.ui.push(managementScreen(g)); });
    for (const kind of ['parade', 'ring', 'banner']) ok(kind, () => { c.events = [{ kind, club: me.club, season: 2, year: frYear(2), run: 2, frRun: 2, rings: 2, fans: frFans(c, me.club), oppName: 'Sam Ray', score: '2-1', fmvp: kind !== 'ring', fmvpName: 'Ty Bench' }]; g.ui.clearTo(careerHub(g)); g.ui.update(0.1, g.input); });
    c.events.length = 0; for (const id of c.active) c.standings[id] = { w: 3, l: 3, pf: 0, pa: 0, strk: 0 }; c.standings[c.meId].w = 9; c.week = c.schedule.length; startPlayoffs(c); c.events.length = 0;
    ok('bracket', () => { g.ui.clearTo(careerHub(g)); g.ui.push(bracketScreen(g)); }); ok('hub-team-playoffs', () => { g.hubTab = 'team'; g.ui.clearTo(careerHub(g)); }); ok('hub-play-playoffs', () => { g.hubTab = 'play'; g.ui.clearTo(careerHub(g)); });
    const c2 = testProLeague(32, g.save.data); g.save.data.career = c2; c2.events.length = 0; g.save.data.c1.handedOff = true; c2.me.contract.years = 1; for (const id of c2.active) c2.stats[id].g = 10; endSeason(c2); c2.offseason.step = 1; offseasonProgression(c2); c2.offseason.step = 2; offseasonMoves(c2); c2.events.length = 0;
    ok('offseason-moves', () => g.ui.clearTo(offseasonScreen(g))); c2.offseason.step = 3; ok('free-agency', () => g.ui.clearTo(offseasonScreen(g)));
    const m2 = meOf(c2); c2.me.seasonLog = []; for (let s = 1; s <= 7; s++) c2.me.seasonLog.unshift({ season: s, club: m2.club, g: 11, awards: s === 2 ? ['Champion', 'All-League 1st Team'] : [], bench: 0 }); c2.me.awards.push({ s: 2, name: 'Champion' }, { s: 2, name: 'Finals MVP' }); c2.me.careerStats.titles = 1; c2.season = 7; c2.events.length = 0;
    ok('trophies', () => { g.ui.clearTo(careerHub(g)); g.ui.push(trophyCaseScreen(g)); }); retireCareer(g.save.data); c2.events.length = 0; ok('legacy', () => g.ui.clearTo(legacyScreen(g)));
    localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Jordan Vale', look: PRESET_LOOKS[3], number: 23, style: 'shooter', seed: 77 }); a.events.length = 0; for (const k in a.r) a.r[k] = Math.min(80, a.r[k] + 26); a.age = 19; a.stage = 'combine'; g.save.data.c1 = a; g.save.data.career = null;
    ok('combine', () => { g.ui.clearTo(amHub(g)); g.ui.push(amCombineScreen(g)); }); ok('offers', () => g.ui.clearTo(proOffersScreen(g))); createCareerFromAmateur(g.save.data, a, proEntryOffers(a).offers[0]); ok('signing', () => g.ui.clearTo(signingScreen(g)));
    return { bad, cut };
  }, [mkPro, fake, season, star, tag]);
  await step('the screens on a desktop: the franchise pages, the franchises tab, a trade side by side, Moving up, the parade, ring and banner, the bracket and the hub in the playoffs, the owners\' moves, free agency, the trophy case\'s ring, the legacy, the combine, the offers, signing day; no errors, nothing cut', async () => { const r = await screens(D, 'desk'); if (r.bad.length || r.cut.length) throw new Error(r.bad.concat(r.cut.map(x => 'CUT ' + x)).slice(0, 8).join(' | ')); return 'ok'; });
  await step('the same screens on a phone', async () => { const Pd = await openPage(browser, { phone: true }); try { const r = await screens(Pd, 'phone'); if (r.bad.length || r.cut.length) throw new Error(r.bad.concat(r.cut.map(x => 'CUT ' + x)).slice(0, 8).join(' | ')); if (Pd.errors.length) throw new Error(Pd.errors.slice(0, 3).join(' | ')); return 'ok'; } finally { await Pd.page.close(); } });

  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
