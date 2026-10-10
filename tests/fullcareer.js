// R10 §4 QA: one whole career through the real screens, from the title to the Hall of Fame. 3.0: player creation,
// tryouts, four high school seasons from HOME (PLAY, SIM and Sim to next event; the weekly plan's Auto, Focus, Rest and
// Study in turn; a crew member hired the first time a role opens), a summer each (its events: the AAU circuit's
// tournaments on their own screen), Signing Day (an offer, or the roads without one), college (NIL, the decision to turn
// pro), the combine and the franchises' offers, then pro seasons (the PBL Cup, All-Star weekend, the playoffs, the Office,
// the offseason's eight steps: every other one step by step, its Summer's Blacktop Kings and the World Cup or the
// Olympics on screen) until retirement, the epilogue and the Hall of Fame. One game at each level is played as a real
// match (the bots finish it through the real simulation), and one tournament game and one weekly drill; the rest are
// simmed. Every message (its answers in turn), Season review (its awards night and parade watched), tournament and
// offseason decision is answered on screen; a phone reaches the sims, the scouting report and the drill through MORE….
// Fails on any page error, frame exception, NaN in the save, or a screen the driver can't move past (a dead end).
// V14 (2.0 §7): --jump plays the first high school game for real, then opens the dev menu with the backtick key and
// presses "Jump to pro" (the rest of high school and college simmed), and plays the pro phase through the screens from
// the combine to the Hall of Fame (a real pro game and the drill included).
// Usage: node tests/fullcareer.js [maxActions, default 5000] [--phone] [--seed=N] [--jump]
const { launch, openPage, runner } = require('./lib');
(async () => {
  const MAX = +process.argv.slice(2).find(a => /^\d+$/.test(a)) || 5000, phone = process.argv.includes('--phone'), JUMP = process.argv.includes('--jump'), seed = +((process.argv.find(a => a.startsWith('--seed=')) || '--seed=2024').slice(7));
  const browser = await launch(); const P = await openPage(browser, { phone, road: true }); const R = runner('full career' + (JUMP ? ' with Jump to pro' : '') + (phone ? ' (phone)' : '')); const { ev, page } = P; const wait = ms => page.waitForTimeout(ms);
  const seen = new Set(), levels = { hs: 0, college: 0, pro: 0, tourney: 0, drill: 0 }; let steps = 0;
  // one action on the current screen, the way a player would move forward; returns what happened
  const act = (i, played) => ev(([i, played, seed, JUMP]) => {
    const g = HH.game; g.ui.update(1 / 60, g.input); const s = g.ui.screen; if (!s) return { name: g.mode === 'match' ? 'match' : '(none)' };
    const at = s.name; window.__fcSeen = window.__fcSeen || {}; window.__fcSeen[at] = (window.__fcSeen[at] || 0) + 1;
    if (/^(combine|draft|commitday|title-parade|title-ring|title-banner)$/.test(s.name) && s.onTap) { s.onTap(0, 0); s.update(0.1, {}); } // skip the reveal (V12: commitment day, a title's parade, ring and banner)
    if (s.build && s.tab && s.tab !== 'home') { g.hubTab = 'home'; s.build(); } // 3.0 (§2.1): back to HOME's tab
    const W = (s.widgets || []).filter(w => !w.hidden && w.enabled !== false && (w.kind === 'button' || (w.kind === 'custom' && w.onPress))); const by = re => W.find(w => re.test(w.label || ''));
    const pr = w => { if (!w) throw new Error('dead end on ' + s.name + ' [' + W.map(x => x.label).join(' | ') + ']'); w.onPress(); };
    const d = g.save.data, a = d.c1 && !d.c1.handedOff ? d.c1 : null, c = d.career, plans = ['auto', 'focus', 'auto', 'rest', 'study'];
    // 3.0 (§2.1): HOME's doors. A phone keeps PLAY, SIM and MORE… there (the sims ahead, the scouting report and the drill
    // are behind MORE…); a door MORE… turns out not to hold isn't asked for again that week
    const wk = a ? a.stage + a.season + '.' + (a.league ? a.league.week : '-') : c ? c.season + '.' + c.week + c.phase : '', more = by(/^MORE…$/);
    const door = (re, tag) => by(re) || (more && !(g._fcMiss && g._fcMiss.re === re.source && g._fcMiss.wk === wk) ? (g._fcMore = { re: re.source, tag, wk }, more) : null);
    // 3.0 (§3): the weekly plan, one row on HOME that stays until you change it: every fourth action the next of Auto,
    // Focus, Rest and Study (FOCUS opens the picker; Study only at school: the pros take Auto)
    const plan = B => { const want = plans[(i >> 2) % plans.length], b = W.find(w => w.plan === want) || W.find(w => w.plan === 'auto'); if (i % 4 || !b || !B || B.plan === b.plan) return false; b.onPress(); return b.plan === 'focus'; };
    // 3.0 (§7): the crew replaced the staff: the first time a role opens, CAREER → Crew → its candidates → HIRE
    const crew = H => { if (g._crew || !H || !CREW_ROLES.some(r => crewCanHire(H, r))) return null; g._crew = 'hire'; g.hubTab = 'career'; s.build(); return (s.widgets || []).find(w => !w.hidden && w.label === 'Crew'); };
    const drill = B => { if (g._drill || !played.hs || !B || !by(/^(PLAY|SIM)$/) || !wkDrillOpen(B)) return null; const w = door(/^DRILL$/, 'drill'); if (!w) return null; w.onPress(); if (w === more) return { name: s.name }; g._drill = true; return { name: s.name, played: 'drill' }; }; // 3.0 (§3): the optional 30 s drill, once
    switch (s.name) {
      case 'title': g.ui.clearTo(mainMenu(g)); break;
      case 'whatsnew': pr(by(/^Got it$/)); break;
      case 'menu': if (c && c.phase === 'retired' && c.epilogue) return { name: 'menu', done: true }; pr(by(/^(CONTINUE CAREER|START YOUR CAREER|YOUR RETIREMENT)$/)); break;
      case 'create': { const sb = by(/START HIGH SCHOOL/); if (!sb) throw new Error('no START HIGH SCHOOL'); if (g.newCareer) g.newCareer.seed = seed; pr(sb); break; }
      case 'amhub': { // 3.0 (§2.2): PLAY is the game, SIM a toast; a stage's door comes first (tryouts, the summer, Signing Day, turning pro, the combine)
        if (a && plan(a)) return { name: s.name }; const cw = crew(a); if (cw) { pr(cw); break; }
        const lvl = a && a.stage, play = by(/^PLAY$/), stage = by(/^(CHOOSE YOUR COLLEGE|SIGNING DAY|TRANSFER OFFERS|TURN PRO\?|TRANSFER PORTAL|PRO COMBINE|YOUR SUMMER|TRYOUTS)$/);
        if (lvl && !played[lvl] && play && !stage) { if (lvl === 'hs') { pr(play); return { name: s.name, played: lvl }; } const sr = door(/^Scout report$/); if (sr) { pr(sr); break; } } /* high school: PLAY; college: the scouting report, then its TIP OFF */
        if (JUMP && played.hs && !g._jumped && a && a.stage === 'hs') { g._jumped = true; return { name: s.name, devKey: true }; } /* V14: the dev menu (the backtick key), then Jump to pro */
        { const dr = drill(a); if (dr) return dr; }
        pr(stage || door(/^Sim to next event$/) || by(/^SIM( THE GAME)?$/)); break; } // 3.0 (§2.2): routine weeks in one press
      case 'career': { // the pros' HOME: the same doors; the Office and the crew are on CAREER
        if (c && c.me && plan(c.me)) return { name: s.name }; const cw = crew(c); if (cw) { pr(cw); break; }
        if (c && c.phase === 'regular' && c.season >= 2 && !g._office) { g._office = true; g.hubTab = 'career'; s.build(); const of = (s.widgets || []).find(w => !w.hidden && w.label === 'Office'); if (of) { of.onPress(); break; } } // money: the Office, once
        const play = by(/^PLAY$/); if (c && c.phase === 'regular' && !played.pro && play) { const sr = playsThisWeek(c) && door(/^Scout report$/); if (sr) { pr(sr); break; } pr(play); return { name: s.name, played: 'pro' }; } /* a pro game for real: you start: the scouting report (the pregame), then TIP OFF; else PLAY (3.0 §4.3: the Development League's game) */
        { const dr = drill(c && c.me); if (dr) return dr; }
        pr(door(/^Sim to next event$/) || by(/^SIM( THE GAME)?$/)); break; }
      case 'homemore': { const M = g._fcMore, w = M && by(new RegExp(M.re)); g._fcMore = null; if (!w) { if (M) g._fcMiss = M; pr(by(/^Back$/)); break; } pr(w); if (M.tag === 'drill') { g._drill = true; return { name: s.name, played: 'drill' }; } break; } // 3.0 (§2.1): the phone's MORE…: the door HOME asked for
      case 'focuspick': { const rows = W.filter(w => w.f); pr(rows[(i >> 2) % Math.max(1, rows.length)] || by(/^Back$/)); break; } // 3.0 (§3): Focus: one rating every week
      case 'dev': { const before = a ? a.stage + ' year ' + a.stageYear : 'none'; pr(by(/^Jump to pro$/)); const d2 = g.save.data.c1; window.__fcJump = { before, after: d2 ? d2.stage : 'none', msg: (g.devOpts && g.devOpts.lines || []).join(' ') }; break; } // V14 (2.0 §7)
      case 'pregame': pr(by(/^TIP OFF$/)); return { name: s.name, played: 'pro' };
      case 'ampregame': pr(by(/^TIP OFF$/)); return { name: s.name, played: a ? a.stage : 'hs' }; // V4 (2.0 §3): the amateur scouting report
      case 'management': pr(by(/^Back$/)); break; // the Office (3.0: no staff to hire there)
      case 'crew': case 'crewrole': { // 3.0 (§7): hire the first role that opens (a desktop picks its row, then See the candidates; a phone opens the role)
        const H = a || c, want = g._crew === 'hire' && (g._crewN = (g._crewN || 0) + 1) < 6, see = want && by(/^See the candidates$/), role = want && s.name === 'crew' && CREW_ROLES.find(r => crewCanHire(H, r)), row = role && W.find(w => w.label === crewRoleName(role));
        if (see || row) { pr(see || row); break; } g._crew = 'done'; pr(by(/^Back$/)); break; }
      case 'crewhire': { const hire = g._crew === 'hire' && by(/^HIRE /); g._crew = 'done'; pr(hire || by(/^Back$/)); break; } // the first candidate
      case 'crewrecap': pr(by(/^CONTINUE$/)); break; // 3.0 (§7): the season's crew grades
      case 'recruit': pr(!g._visited && by(/^VISIT$/) ? (g._visited = true, by(/^VISIT$/)) : by(/^COMMIT$/)); break; // (a decision from before 2.1) the first time: a visit
      case 'visit': pr(by(/^COMMIT HERE$/)); break;
      case 'signing': pr(by(/^Sign: /) || (g._noWalk && by(/^(Play abroad|Abroad)$/)) || W.find(w => w.primary) || by(/^Walk on/) || by(/^Skip college/)); break; // 2.1 (§2.5): Signing Day: the first offer (the commitment); X9 (3.0 §8): without one, the roads (the prep year, junior college, a walk-on, a club abroad)
      case 'recwalkon': { const w = by(/^Walk on: /); if (!w) g._noWalk = true; pr(w || by(/^Back$/)); break; } // 2.1 (§2.6): the first program whose GPA line you meet (none: back to the other roads)
      case 'ovsoffers': pr(by(/^SIGN WITH THE /)); break; // X9 (3.0 §8): a club abroad: the first offer
      case 'confirm': pr(by(/^Yes$/)); break;
      case 'amdecision': pr(W.find(w => w.primary) || W[0]); break;
      case 'combine': case 'draft': pr(by(/^(PRO OFFERS|DRAFT NIGHT|START YOUR PRO CAREER)$/)); break;
      case 'prooffers': pr(by(/^SIGN WITH THE /)); break; // F7: the first offer
      case 'message': pr(W[i % Math.max(1, W.length)]); break; // 3.0 (§2.3): a message's two or three answers, in turn
      case 'tip': pr(by(/^GOT IT$/)); break;
      case 'amevent': case 'commitday': case 'amresult': case 'result': case 'allstarres': case 'allstar1v1res': case 'postgame': case 'drillpost': case 'roadcard':
        pr(by(/^(Continue|CONTINUE|BACK TO THE HUB|BACK TO THE WEEKEND)$/) || W.find(w => w.primary)); break; // 3.0 (§2.2): the one result screen; the drill's
      case 'seasonreview': { // 3.0 (§2.2): the season's end in one screen; awards night and the parade are a tap away (watched once each)
        const aw = !s._fcAw && by(/^Awards night$/), pa = !s._fcPa && by(/^The parade$/); if (aw) { s._fcAw = true; pr(aw); } else if (pa) { s._fcPa = true; pr(pa); } else pr(by(/^CONTINUE$/)); break; }
      case 'tourney': { // 3.0 (§5): a tournament's screen: the first game you can play is played for real, the rest simmed; DONE at the end
        const play = !played.tourney && by(/^PLAY$/); if (play) { pr(play); return { name: s.name, played: 'tourney' }; }
        pr(by(/^DONE$/) || (i % 3 ? by(/^Sim the rest$/) : by(/^SIM$/)) || by(/^(Sim the rest|SIM)$/)); break; }
      case 'tnresult': pr(by(/^BACK TO THE /)); break; // 3.0 (§5): your tournament game's result
      case 'allstarweekend': pr(by(/^Sim the contest$/) || by(/^Sim it$/) || by(/^DONE$/)); break;
      case 'simsummary': pr(by(/^CONTINUE$/)); break; // V5
      case 'offseason': { const step = c && c.season % 2 === 0; // 2.1 (W6), 3.0 (§5): the eight steps, every other offseason step by step (its Summer's Blacktop Kings message and tournaments on screen), else simmed to your next decision (an offer, an option, a no-trade call)
        pr((!step && by(/^Sim to next big moment$/)) || by(/^CONTINUE$/) || W.find(w => w.fa || /^(Re-sign|Sign with|Your club|Big market|Starts you|Offer)|★ · −?\$/.test(w.label || '')) /* F7: a free-agency offer reads 'Club 4★ · $5M × 4' */ || by(/^Opt in · /) || by(/^Skip to the end$/) || by(/^(Last day: take the best|Wait a day|Next day)$/) || by(/^Stay$/) || W.find(w => w.camp && !w.primary) || by(/^START SEASON/) || by(/^RETIRE/)); break; }
      case 'ladder': case 'lowerleague': case 'overseas': pr(by(/^Back$/)); break;
      case 'recruiting': case 'statebracket': case 'amstandings': case 'draftstock': case 'confbracket': case 'natbracket': case 'moneybuilt': case 'networth': pr(by(/^Back$/)); break;
      case 'tryout': pr(by(/^SIM IT$/)); break;
      case 'tryoutpost': pr(by(/^CONTINUE$/)); break;
      case 'summer': { // 3.0 (§5): the summer's events (each a tournament; the first summer adds the open Summer Jam) and the rest of it (Camp, Rest or Job in turn), then GO
        const rest = W.filter(w => /^(✓ )?(Camp|Rest|Job)$/.test(w.label || '')); if (rest.length) rest[i % rest.length].onPress(); const jam = !g._jam && by(/^Summer Jam$/); if (jam) { g._jam = true; jam.onPress(); } pr(by(/^GO$/)); break; }
      case 'colchoice': pr(W[i % 2] || W[0]); break;
      case 'negotiate': pr(by(/^SIGN$/)); break;
      case 'epilogue': { const f = (s.widgets || []).find(w => w.kind === 'select' && w.label === 'Foundation'); if (f && !g._epi) { g._epi = true; f.set(1); return { name: s.name }; } pr(by(/^FINISH$/)); break; } // what your money builds: a foundation, then FINISH
      case 'ceremony': case 'allstarpick': case 'hofinduction': case 'title-parade': case 'title-ring': case 'title-banner': pr(by(/^CONTINUE$/)); break; // V8: awards night, the All-Star reveal, the Hall of Fame induction; V12: a title's parade, ring and banner
      case 'franchise': case 'bracket': case 'brackets': case 'tnchart': case 'records': pr(by(/^Back$/)); break; // V12; 3.0 (§5): the Brackets chart
      case 'tradecompare': pr(by(/^Stay$/)); break; // V12
      case 'legacy': case 'hof': return { name: s.name, done: !!(c && c.phase === 'retired') };
      default: throw new Error('the driver does not know screen ' + s.name + ' [' + W.map(x => x.label).join(' | ') + ']');
    }
    return { name: g.ui.screen ? g.ui.screen.name : g.mode === 'match' ? 'match' : '(none)' };
  }, [i, played, seed, JUMP]);
  const finishMatch = () => ev(() => { const m = HH.game.match; if (!m) return 0; for (const p of m.players) if (p.controlled) { p.controlled = false; p.input.reset(); } let n = 0; while (!m.ended && n < 120 * 60 * 30) { simStep(m, STEP); n++; } return n; });
  const where = () => ev(() => { const d = HH.game.save.data, a = d.c1, c = d.career; return a && !a.handedOff ? a.stage + ' y' + a.stageYear + ' s' + a.season + ' g' + ((a.totals || {}).g || 0) : c ? 'pro s' + c.season + ' w' + c.week + ' ' + c.phase : 'no career'; });
  const nanScan = () => ev(() => { const bad = []; const walk = (o, p, dd) => { if (!o || typeof o !== 'object' || dd > 9 || bad.length > 4) return; for (const k in o) { const v = o[k]; if (typeof v === 'number' && !Number.isFinite(v)) bad.push(p + '.' + k + '=' + v); else if (v && typeof v === 'object') walk(v, p + '.' + k, dd + 1); } }; const d = HH.game.save.data; walk(d.c1, 'c1', 0); walk(d.career, 'career', 0); return bad; });
  await R.step('a whole career, title to Hall of Fame' + (phone ? ' (phone)' : ''), async () => {
    await ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); g.applySettings(); g.ui.clearTo(titleScreen(g)); window.HH_ERRORS = []; });
    const played = {}; let last = '', same = 0, done = false, lastWhere = '', idle = 0;
    for (let i = 0; i < MAX && !done; i++) {
      const r = await act(i, played); steps++; seen.add(r.name); if (!r.played) idle = 0;
      if (r.devKey) { await page.keyboard.press('Backquote'); await wait(400); continue; } // V14: the game loop opens the dev menu
      if (r.played) { await wait(1600); const n = await finishMatch(); if (n) { idle = 0; played[r.played] = true; levels[r.played] = (levels[r.played] || 0) + 1; await wait(2600); } else if (++idle > 40) throw new Error('stuck: ' + r.name + ' starts no game (' + r.played + ') at ' + await where()); continue; } // (no match: benched this week; try another week) (X9: junior college and a club abroad are levels too)
      if (r.name === 'match') { await finishMatch(); await wait(1200); continue; }
      if (r.done) { done = true; break; }
      const w = await where(); const key = r.name + '|' + w; same = key === last ? same + 1 : 0; last = key; if (same > 40) throw new Error('stuck on ' + r.name + ' at ' + w);
      if (w !== lastWhere) { lastWhere = w; if (i % 25 === 0) { const bad = await nanScan(); if (bad.length) throw new Error('NaN in the save: ' + bad.join(', ')); } }
      if (r.name === 'menu' || r.name === 'title') await wait(60);
    }
    const tour = await ev(() => { const d = HH.game.save.data, a = d.c1 || {}, c = d.career || {}, M = c.me || {}, me = c.players && c.players[c.meId] || {}; return { screens: window.__fcSeen, went: { college: !!a.college, juco: !!a.juco, overseas: !!a.ovs }, hs: { titles: a.titles, mvps: a.mvps }, college: a.college || null, signed: me.signed ? clubOf(me.signed.club).abbr + ' ' + me.signed.stars + '★' : null, earned: Math.round((M.earned || 0) / 1e6) + 'M', tournaments: tnRowsAll(c).length, crew: crewList(M).map(x => x.role), awards: (M.awards || []).map(x => x.name).filter(n => !/trait/i.test(n)).slice(0, 14), tl: (c.timeline || []).length }; }); // (F7: no draft pick: the franchise you signed with)
    const fin = await ev(() => { const d = HH.game.save.data, c = d.career; return { retired: !!(c && c.phase === 'retired'), epi: !!(c && c.epilogue), hof: (d.hallOfFame || []).map(h => h.name), me: c && c.players && c.players[c.meId] ? c.players[c.meId].name : '', seasons: c ? c.season : 0, age: c && c.players && c.players[c.meId] ? c.players[c.meId].age : 0 }; });
    if (!done || !fin.retired || !fin.epi) throw new Error('did not finish: ' + JSON.stringify(fin) + ' after ' + steps + ' actions at ' + await where());
    if (!fin.hof.includes(fin.me)) throw new Error('not in the Hall of Fame list: ' + JSON.stringify(fin));
    const what = { hs: 'a high school game', juco: 'a junior college game', college: 'a college game', overseas: 'an Overseas League game', pro: 'a pro game', tourney: 'a tournament game', drill: 'the weekly drill' };
    for (const l of JUMP ? ['hs', 'pro', 'drill'] : ['hs', 'juco', 'college', 'overseas', 'pro', 'tourney', 'drill'].filter(l => !(l in tour.went) || tour.went[l])) if (!levels[l]) throw new Error('never played ' + what[l] + ' for real'); // (--jump sims college and the high school summers; X9: junior college and a club abroad only on the roads that go there)
    const jump = JUMP ? await ev(() => window.__fcJump || null) : null; if (JUMP && !(jump && jump.after === 'combine')) throw new Error('Jump to pro did not reach the combine: ' + JSON.stringify(jump));
    const fe = await P.frameErrors(); if (fe.length) throw new Error('frame errors: ' + fe.join(' | ')); const bad = await nanScan(); if (bad.length) throw new Error('NaN in the save: ' + bad.join(', '));
    if (jump) console.log('  Jump to pro from ' + jump.before + ': ' + jump.msg);
    console.log('  ' + steps + ' actions · retired after ' + fin.seasons + ' pro seasons at ' + fin.age + ' · real games ' + JSON.stringify(levels) + '\n  career: ' + JSON.stringify({ hs: tour.hs, college: tour.college, signed: tour.signed, earned: tour.earned, tournaments: tour.tournaments, crew: tour.crew, awards: tour.awards }) + '\n  screens acted on: ' + Object.keys(tour.screens).sort().map(k => k + ' ' + tour.screens[k]).join(' · '));
  });
  const fails = R.done(); await browser.close(); process.exitCode = fails ? 1 : 0;
})();
