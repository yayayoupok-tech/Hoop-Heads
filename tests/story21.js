// 2.1 (§4): the main story in chapters. W7: the engine (chapters in order, a version each, scenes at hooks, one big
// decision with a flag that lasts, a closing scene), chapter 1 over a freshman year, the cast (your sibling, Coach
// Adeyinka, the best friend met at tryouts), the pacing (two story screens in a row at most, a season's 3–5 scenes,
// every scene with a choice), the title card and "This will be remembered", the cutscene backgrounds, "Previously on
// Hoop Heads", the Story screen as chapters, save and reload, old saves, Sim ahead. W8: chapters 2–6 over simulated
// careers (high school, Signing Day's paths, college, their pro versions), the side arcs they absorb, old saves. W9:
// chapters 7–12 (the Decision's versions, Rookie, a whole career to its ending, the paths to the endings, an early
// retirement, old pro saves). (Chapters reached, scenes per season, endings and paths over many careers:
// tests/careersim.js.) Usage: node tests/story21.js
const { launch, openPage, runner } = require('./lib');
const fs = require('fs'), path = require('path');
(async () => {
  const browser = await launch(); const R = runner('story 2.1'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  // a new career (its chapter 1 already opened: the night before tryouts is in the queue)
  const mk = `(seed => amCreate(defaultSave(), { name: 'Chapter Test', look: PRESET_LOOKS[seed % 16], number: 9, style: 'slasher', seed, seasonLength: 11, gameLength: 120 }))`;
  // answers the queue (each card's default, or pick(e) → its index), keeping what was told
  const drain = `((a, seen, pick) => { const q = chQueued(a); /* (an official visit's three cards are one scene) */ if (q > 2) throw new Error(q + ' story screens in a row: ' + a.events.filter(e => !e.answered && (e.kind === 'dialog' || e.kind === 'rival')).map(e => e.kind + ':' + (e.id || e.moment) + ':' + e.title).join(', ')); for (const e of a.events) if (e.kind === 'dialog') { seen.push(e); if (e.choice && e.answered == null) { const i = pick ? pick(e) : -1; if (i >= 0) stChoose(a, e, i); else stAutoChoose(a, e); } } a.events.length = 0; })`;
  const year = `((a, seen, pick) => { const d = eval(DR); d(a, seen, pick); let g = 0; while (a.tryout && a.tryout.step !== 'done' && g++ < 5) hsSimTryout(a); d(a, seen, pick); const s0 = a.season; g = 0; while (a.season === s0 && g++ < 80) { if (a.decision || (a.summer && a.summer.pending)) break; const r = amSimGame(a); d(a, seen, pick); if (!r && !amNext(a)) break; } return a; })`.replace('DR', JSON.stringify(drain).slice(1, -1).replace(/\\"/g, '"'));
  const drawTexts = `(s => { const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'); const texts = []; const ft = ctx.fillText.bind(ctx); ctx.fillText = (t, x, y, w) => { texts.push(String(t)); return ft(t, x, y, w); }; s.draw(ctx, HH.game.ui); return texts; })`;
  // a career run: seasons, tryouts, summers, a commitment to the best offer from junior year (o.commit false: none),
  // Signing Day (o.sign, else the simulators' pick), the declare decision (o.declare), until o.until(a) or the combine;
  // answers the queue as drain does
  const life = `((a, seen, pick, o) => { o = o || {}; const d = eval(__DRAIN__); let g = 0;
    while (!a.handedOff && g++ < 900) { d(a, seen, pick); if (o.until && o.until(a)) break; if (a.stage === 'combine') break;
      if (a.tryout && a.tryout.step !== 'done') { hsSimTryout(a); continue; } if (a.summer && a.summer.pending) { hsSummerChoose(a, 'camp'); continue; }
      if (a.decision) { const dd = a.decision; if (dd.kind === 'college') { if (o.sign) o.sign(a, dd); else if (!recSimSign(a)) break; } else if (dd.kind === 'declare') amDeclare(a, !!(o.declare && o.declare(a))); else if (dd.kind === 'portal') { if (o.declare && o.declare(a)) amDeclare(a, true); else colPortalChoose(a, null); } else break; continue; }
      if (o.commit !== false && a.stage === 'hs' && !a.prep && a.stageYear >= 3 && !recOf(a).commit) { const L = hsLiveOffers(a).filter(x => x.pid); if (L.length && !recCommitWhyNot(a, L[0].pid)) recCommit(a, L[0].pid); } /* (a recruit commits to the best offer: the programs fill their classes by Signing Day) */
      const r = amSimGame(a); if (!r && !amNext(a) && !a.decision && a.stage !== 'combine') break; }
    d(a, seen, pick); return a; })`.replace('__DRAIN__', JSON.stringify(drain).slice(1, -1).replace(/\\"/g, '"'));
  // a pro season, simmed week by week to the offseason (the queue answered; trait picks and the All-Star game too); the
  // offseason, automatic, into the next season
  const proDrain = `((c, seen, pick) => { for (const e of (c.events || [])) { if (e.kind === 'dialog') { seen.push(e); if (e.choice && e.answered == null) { const i = pick ? pick(e) : -1; if (i >= 0) stChoose(c, e, i); else stAutoChoose(c, e); } } else if (e.kind === 'traitpick') trPickAuto(c.me); else if (e.kind === 'rebuild' && !e.answered) proRebuildAnswer(c, e, true); } c.events.length = 0; })`;
  const proYear = `((g, c, seen, pick) => { const d = eval(__PD__); let k = 0; d(c, seen, pick); while (c.phase !== 'offseason' && c.phase !== 'retired' && k++ < 90) { if (c.allStar && c.allStar.invited && !c.allStar.done) finishAllStar(c, 12); const r = simOneWeek(g, c); d(c, seen, pick); if (!r) break; } if (c.phase !== 'offseason') throw new Error('the pro season never ended: ' + c.phase + ' week ' + c.week); return c; })`.replace('__PD__', JSON.stringify(proDrain).slice(1, -1).replace(/\\"/g, '"'));
  const proNext = `(c => { if (!lgOffseasonAuto(c, { rebuild: true })) throw new Error('no 2.1 offseason'); for (const e of (c.events || []).slice()) if (e.kind === 'rebuild' && !e.answered) proRebuildAnswer(c, e, true); c.events.length = 0; newSeason(c); return c; })`;

  await step('twelve chapters in order (each a title; chapter 1 written); a new career opens chapter 1 with its title card first in the queue, your school in its title', () => ev(mk => {
    if (CH_TITLES.length !== 13 || CH_TITLES[11] !== 'Finals' || CH_TITLES[12] !== 'Legacy') throw new Error('titles ' + CH_TITLES);
    const D1 = CHAPTERS[1]; if (!D1 || D1.n !== 1 || D1.scenes.length < 3 || D1.scenes.length > 6) throw new Error('chapter 1: ' + (D1 && D1.scenes.length) + ' scenes');
    if (D1.scenes.filter(s => s.big).length !== 1) throw new Error('one big decision'); for (const s of D1.scenes) if (!s.choice) throw new Error('a scene without a choice: ' + s.id);
    const a = eval(mk)(11), e = a.events[0]; if (!e || !e.ch || e.ch.n !== 1 || !e.chapter.open) throw new Error('first in the queue: ' + (e && (e.id || e.kind)));
    if (!new RegExp('^The Kid from ' + a.school + '$').test(chTitle(a, 1))) throw new Error('title ' + chTitle(a, 1)); if (e.chapter.title !== chTitle(a, 1) || e.chapter.sub !== 'Freshman year') throw new Error('card ' + JSON.stringify(e.chapter));
    const Q = chOf(a); if (Q.n !== 1 || !Q.list[1] || Q.list[1].st !== 'on') throw new Error('state ' + JSON.stringify(Q));
    return chTitle(a, 1) + ' · ' + D1.scenes.length + ' scenes · first card ' + e.title;
  }, mk));

  await step('chapter 1 over a simulated freshman year: 3–5 scenes in its season with every one a choice; the tryout scene tells the list (varsity or JV: its version); the big decision is remembered (ch1, for good); the closing scene at the season\'s end; nothing told twice', () => ev(([mk, year]) => {
    const out = [];
    for (const seed of [21, 22, 23, 24, 25, 26]) { const seen = [], a = eval(year)(eval(mk)(seed), seen, e => e.chapter && e.chapter.big ? seed % 2 : -1), S = sagaOf(a), Q = chOf(a), R1 = Q.list[1];
      const ch = seen.filter(e => e.ch && e.ch.n === 1); if (!R1 || R1.st !== 'done' || R1.end.s !== R1.s0) throw new Error(seed + ': not closed in its season ' + JSON.stringify(R1));
      if (ch.length < 3 || ch.length > 5) throw new Error(seed + ': ' + ch.length + ' scenes'); if (ch.some(e => !(e.choice && e.choice.length))) throw new Error(seed + ': a scene without a choice');
      const ids = ch.map(e => e.ch.scene); if (new Set(ids).size !== ids.length) throw new Error(seed + ': told twice ' + ids); if (ids[0] !== 'night' || ids[ids.length - 1] !== 'year' || !ids.includes('list') || !ids.includes('choice')) throw new Error(seed + ': scenes ' + ids);
      const big = ch.find(e => e.chapter.big); if (!/This will be remembered/.test((big.outcome || []).join(' '))) throw new Error(seed + ': not remembered ' + big.outcome); if (S.flags.ch1 !== R1.k || !['late', 'home'].includes(R1.k) || R1.pick !== big.choice[seed % 2].label) throw new Error(seed + ': the flag ' + S.flags.ch1 + ' ' + R1.pick);
      if (R1.v !== (a.seasonJv || a.squad === 'jv' ? 'jv' : 'varsity') && R1.v !== 'jv' && R1.v !== 'varsity') throw new Error(seed + ': version ' + R1.v); const list = ch.find(e => e.ch.scene === 'list'); if (!/JUNIOR VARSITY|VARSITY/.test(list.title)) throw new Error(seed + ': the list ' + list.title);
      const n = (a.arcLog || []).find(l => l.s === R1.s0); if (!n || n.n < 3 || n.n > 5) throw new Error(seed + ': season scenes ' + JSON.stringify(a.arcLog));
      out.push(R1.v + '/' + R1.k + ' ' + ch.length + ' of ' + n.n); }
    return out.join(' · ');
  }, [mk, year]));

  await step('the cast (§4.1): a younger sibling (your surname, six years younger (W9), a kid\'s portrait, their own meter), Coach Adeyinka (a new career\'s high school coach), the best friend met at tryouts; nine people', () => ev(([mk, year]) => {
    const a = eval(mk)(31), S = sagaOf(a), sib = sagaWho(a, 'sibling'), last = a.name.split(' ').slice(1).join(' ');
    if (SAGA_CAST.length !== 9 || !SAGA_CAST.includes('sibling')) throw new Error('cast ' + SAGA_CAST); if (!sib.name.endsWith(' ' + last) || sib.age !== Math.max(9, a.age - CONFIG.chapters.sibGap) || ageStageOf(sib.age) !== 0) throw new Error('sibling ' + sib.name + ' ' + sib.age);
    if (S.cast.sibling.m !== CONFIG.chapters.sibStart) throw new Error('sibling meter ' + S.cast.sibling.m); if (sagaWho(a, 'sibling').name !== sib.name) throw new Error('a new sibling each time'); if (stFirst(sib.name) === stFirst(a.name) || stFirst(sib.name) === stFirst(a.family.name)) throw new Error('the same first name');
    if (a.coach !== 'Coach Adeyinka') throw new Error('coach ' + a.coach); const seen = []; eval(year)(a, seen); const co = sagaWho(a, 'coach'); if (co.name !== 'Coach Adeyinka' || !co.look || !co.age) throw new Error('the coach in the cast ' + co.name);
    if (!S.cast.friend.name || !S.cast.friend.mate) throw new Error('no best friend at tryouts'); const P = sagaPeople(a).map(p => p.cast); if (!P.includes('sibling') || !P.includes('friend') || !P.includes('coach')) throw new Error('people ' + P);
    return sib.name + ' (' + sib.age + ') · ' + co.name + ' · best friend ' + S.cast.friend.name;
  }, [mk, year]));

  await step('pacing (§4.3): never more than two story screens in a row (a third waits for the next moment, in order); a chapter in progress keeps its room in the season (the other beats wait); the offseason\'s scenes count in the season they lead into', () => ev(mk => {
    const a = eval(mk)(41); a.events.length = 0; const B = holderOf(a); const mkEv = i => ({ kind: 'dialog', id: 'p' + i, title: 'P' + i, who: 'family', lines: ['x'], choice: null });
    for (let i = 0; i < 5; i++) chQueue(a, mkEv(i)); if (a.events.length !== 2 || B.later.length !== 3) throw new Error('queued ' + a.events.length + ' / waiting ' + B.later.length);
    a.events.length = 0; chRelease(a); if (a.events.map(e => e.id).join() !== 'p2,p3' || B.later.length !== 1) throw new Error('released ' + a.events.map(e => e.id)); a.events.length = 0; chRelease(a, true); if (B.later.length) throw new Error('all');
    // the reserve: chapter 1 in progress with its scenes still to come keeps the room; once it's done, none
    const A = stFill(a); A.beats = 2; A.w = -99; if (chReserve(a) < 3) throw new Error('reserve ' + chReserve(a)); if (stBeat(a, 'side-test', 'family', 'SIDE', ['y'], {})) throw new Error('a side beat took the chapter\'s room');
    const Q = chOf(a); Q.list[1].st = 'done'; Q.n = 2; if (chReserve(a) !== 0) throw new Error('reserve after ' + chReserve(a)); if (!stBeat(a, 'side-test2', 'family', 'SIDE', ['y'], {})) throw new Error('the room is free');
    // the offseason: after stSeasonEnd, a scene counts in the next season
    a.events.length = 0; A.ended = null; const s0 = a.season, b0 = A.beats; stSeasonEnd(a); const logged = a.arcLog[a.arcLog.length - 1].n; stBeat(a, 'off-test', 'family', 'OFF', ['z'], { crit: true }); a.season++; const A2 = stFill(a); a.season = s0;
    if (A2.beats !== 1) throw new Error('the offseason scene in the next season: ' + A2.beats + ' (logged ' + logged + ' from ' + b0 + ')');
    return 'two in a row, three waited · reserve ' + 3 + '+ · the offseason counts forward';
  }, mk));

  await step('every scene has a choice (§4.3): a card without one gets two answers, a warm one (the speaker\'s meter, the default) and a focused one (practice XP); a saga beat without a choice still does what it did once', () => ev(mk => {
    const a = eval(mk)(51), Q = chOf(a); for (let n = 1; n < CH_TITLES.length; n++) Q.list[n] = { st: 'past' }; Q.n = CH_TITLES.length; a.events.length = 0; const A = stFill(a); A.beats = 0; A.w = -99;
    const e = stBeat(a, 'react-test', 'family', 'A CALL FROM HOME', ['"Are you eating?"'], { fill: true }); if (!e || !e.react || e.choice.length !== 2 || !e.choice[0].def || !e.choice[0].saga || !e.choice[0].saga.meter.family || !e.choice[1].fx.xp) throw new Error('the answers ' + JSON.stringify(e && e.choice));
    const m0 = sagaMeter(a, 'family'); stAutoChoose(a, e); if (sagaMeter(a, 'family') !== m0 + CONFIG.chapters.react) throw new Error('the warm answer ' + sagaMeter(a, 'family'));
    const c2 = stBeat(a, 'react-coach', 'coach', 'THE COACH\'S OFFICE', ['"Close the door."'], { fill: true }); if (!c2 || c2.choice[0].saga || c2.choice[0].fx.fatigue !== -2) throw new Error('your team\'s coach is not the cast\'s ' + JSON.stringify(c2 && c2.choice[0]));
    // a saga beat with no choice: its fx and after() once, at the telling (the card's answer adds the meter only)
    const S = sagaOf(a); S.arcs.mentor = { st: 'on', b: 3, s0: a.season, stage: 'hs', picks: [] }; S.order.push('mentor'); S.flags.mentorLast = a.season; let after = 0; const b = SAGA_ARCS.mentor.beats[3], af = b.after; b.after = (...x) => { after++; return af(...x); };
    try { A.beats = 0; const se = sagaTell(a, 'mentor', 3, {}); if (!se || !se.react) throw new Error('no answers on the mentor\'s last card'); stChoose(a, se, 0); } finally { b.after = af; } if (after !== 1) throw new Error('after() ran ' + after + ' times');
    return 'warm: ' + e.choice[0].label + ' / focused: ' + e.choice[1].label;
  }, mk));

  await step('flags survive a save and a reload, and the handoff to the pros (the chapter, its pick, the recap, the cast)', () => ev(([mk, year]) => {
    const g = HH.game, a = eval(mk)(61); g.save.data.c1 = a; g.save.data.career = null; eval(year)(a, [], e => e.chapter && e.chapter.big ? 0 : -1); const k = sagaFlag(a, 'ch1'), pick = chOf(a).list[1].pick, sib = sagaWho(a, 'sibling').name; g.save.save();
    const fresh = new SaveSystem(), b = fresh.data.c1; if (!b || sagaFlag(b, 'ch1') !== k || chOf(b).list[1].pick !== pick || chOf(b).n !== 2 || sagaWho(b, 'sibling').name !== sib) throw new Error('after a reload ' + JSON.stringify(b && b.saga && b.saga.ch));
    const r = chRecap(b); if (!r || r.lines.length !== 3 || !/^Chapter 1: The Kid from /.test(r.lines[0])) throw new Error('recap ' + JSON.stringify(r));
    const save = defaultSave(); save.c1 = b; b.stage = 'combine'; createCareerFromAmateur(save, b); const c = save.career; if (sagaFlag(c, 'ch1') !== k || chOf(c).list[1].st !== 'done' || sagaWho(c, 'coach').name !== 'Coach Adeyinka') throw new Error('the pros ' + sagaFlag(c, 'ch1'));
    return 'ch1 = ' + k + ' (' + pick + ') after a reload and in the pros';
  }, [mk, year]));

  await step('old saves: a career past its freshman year passes chapter 1 by ("Before this save"); one in the middle of it starts it where the career is; a pro career with an unfinished high school chapter closes it quietly', async () => {
    const raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'save_w5_highschool_teamleague.json'), 'utf8');
    return ev(([raw, mk]) => {
      const d = JSON.parse(raw); const s = new SaveSystem(); s.data = s.migrate ? s.migrate(d) : d; const a = s.data.c1 || d.c1; if (!a) throw new Error('no career in the fixture');
      a.events = a.events || []; const n0 = a.events.length; sagaTick(a, 'game', {}); const Q = chOf(a); if (a.stageYear > 1 && (!Q.list[1] || Q.list[1].st !== 'past')) throw new Error('chapter 1 should be past: ' + JSON.stringify(Q.list[1]) + ' y' + a.stageYear);
      if (a.events.slice(n0).some(e => e.ch && e.ch.n === 1)) throw new Error('a chapter 1 scene for an old save past it'); /* (W8: the chapter of its year may open) */ const rows = chapterRows(a); if (rows[0].mark !== '—' || rows[0].sub !== 'Before this save') throw new Error('row ' + JSON.stringify(rows[0]));
      // a 2.0 freshman: no chapter state, mid-season: chapter 1 starts now (the opening's version for after tryouts)
      const f = eval(mk)(71); while (f.tryout && f.tryout.step !== 'done') hsSimTryout(f); f.events.length = 0; delete f.saga.ch; f.seasonStats.g = 4; sagaTick(f, 'game', {}); const e = f.events.find(x => x.ch); if (!e || e.ch.scene !== 'night' || !/^Freshman year at /.test(e.lines[0])) throw new Error('mid-season start ' + JSON.stringify(e && e.lines));
      // a pro career (the dev jump, an old pro save) whose chapter 1 never closed: it closes without telling
      const save = defaultSave(), c = testProLeague(72, save), Q2 = chOf(c); Q2.list[1] = { st: 'on', v: '', i: 1, told: 1, s0: 1, stage: 'hs', age: 14 }; Q2.n = 1; c.events.length = 0; sagaTick(c, 'game', {}); if (Q2.list[1].st !== 'done' || !Q2.list[1].cut || c.events.some(x => x.ch)) throw new Error('quiet close ' + JSON.stringify(Q2.list[1]));
      return 'w5 fixture y' + a.stageYear + ': chapter 1 past' + (Q.list[Q.n] ? ', chapter ' + Q.n + ' ' + Q.list[Q.n].st : '') + ' · a 2.0 freshman starts it mid-season · a stale chapter closes quietly';
    }, [raw, mk]);
  });

  await step('the Story screen (§4.3) is the chapters: a mark each (✓ done, ● now, · ahead, — missed), the choice in each, your people and their meters; the side stories one press away; a phone shows one view at a time', () => ev(([mk, year, drawTexts]) => {
    const g = HH.game, a = eval(mk)(81); g.save.data.c1 = a; eval(year)(a, []); g.ui.clearTo(amHub(g)); g.ui.push(storySoFarScreen(g, a)); const t = eval(drawTexts)(g.ui.screen);
    for (const want of ['✓', '1 · ' + chTitle(a, 1).toUpperCase(), '12 · LEGACY', 'Your people']) if (!t.some(x => x.toUpperCase() === want.toUpperCase())) throw new Error('missing ' + want + ' in ' + t.slice(0, 14));
    if (!t.some(x => /^You chose: /.test(x))) throw new Error('the choice'); if (!t.includes(sagaWho(a, 'sibling').name)) throw new Error('the sibling\'s meter');
    g.ui.screen.widgets.find(w => w.label === 'Side stories').onPress(); const t2 = eval(drawTexts)(g.ui.screen); if (t2.includes('12 · LEGACY')) throw new Error('side stories view');
    return t.filter(x => /^\d+ · /.test(x)).length + ' chapter rows';
  }, [mk, year, drawTexts]));

  await step('"Previously on Hoop Heads" (§4.3): CONTINUE CAREER opens with three lines (the chapter, what happened, your last choice) over the last scene; an old save recaps its last saga choice; a career with nothing yet goes straight to the hub', () => ev(([mk, year]) => {
    const g = HH.game, a = eval(mk)(91); g.save.data.c1 = a; g.save.data.career = null; eval(year)(a, []); g.ui.clearTo(mainMenu(g)); g.ui.screen.widgets.find(w => /CONTINUE CAREER/.test(w.label || '')).onPress(); if (g.ui.screen.name !== 'recap') throw new Error('screen ' + g.ui.screen.name);
    const r = chRecap(a); if (r.lines.length !== 3 || !/^Your (last choice|choice, and it will be remembered): /.test(r.lines[2])) throw new Error('lines ' + JSON.stringify(r.lines)); g.ui.screen.widgets.find(w => w.label === 'CONTINUE').onPress(); if (g.ui.screen.name !== 'amhub') throw new Error('then ' + g.ui.screen.name);
    const o = eval(mk)(92); o.events.length = 0; delete o.saga.ch; const S = sagaOf(o); S.log.push({ arc: 'bills', beat: 'ask', title: 'FAMILY BILLS', s: 1, stage: 'hs', age: 14, pick: 'Take a weekend job' }); const r2 = chRecap(o); if (!r2 || !/Take a weekend job/.test(r2.lines[2])) throw new Error('old save ' + JSON.stringify(r2));
    const n = eval(mk)(93); n.saga.ch.last = null; n.saga.log = []; if (chRecap(n)) throw new Error('nothing yet');
    return r.lines.join(' / ');
  }, [mk, year]));

  await step('the cutscenes (§4.3): twelve backgrounds (the bus, the dorm, a college arena, the owner\'s box, the retirement stage new), each painted once; a chapter\'s first scene starts with its title card (CHAPTER n, the title), a tap skips it; a big decision shows "This will be remembered"', () => ev(([mk, drawTexts]) => {
    for (const k of ['kitchen', 'gym', 'bus', 'quad', 'dorm', 'arena', 'press', 'tunnel', 'box', 'finals', 'stage']) if (!SAGA_BG_KINDS.includes(k)) throw new Error('no ' + k); if (SAGA_BG_KINDS.length !== 12) throw new Error(SAGA_BG_KINDS.length + ' kinds');
    for (const k of SAGA_BG_KINDS) { const cv = sagaBgCanvas(k); if (cv.width !== 320 || sagaBgCanvas(k) !== cv) throw new Error(k + ' painted again'); }
    const g = HH.game, a = eval(mk)(101); g.save.data.c1 = a; g.ui.clearTo(amHub(g)); const e = a.events.find(x => x.ch); g.ui.push(storyEventScreen(g, a, e, () => {})); const s = g.ui.screen; const t1 = eval(drawTexts)(s); if (!t1.includes('CHAPTER 1') || !t1.some(x => /THE KID FROM/.test(x)) && !t1.length) throw new Error('card ' + t1);
    if (s.widgets.some(w => !w.hidden)) throw new Error('buttons on the card'); s.onTap(); s.finish(); if (!s.widgets.some(w => !w.hidden)) throw new Error('the scene after the card');
    while (a.tryout && a.tryout.step !== 'done') hsSimTryout(a); a.events.length = 0; const R1 = chOf(a).list[1]; R1.i = 2; a.seasonStats.g = 3; const big = chTell(a, CHAPTERS[1], R1, CHAPTERS[1].scenes[2], {}, 'game'); g.ui.clearTo(amHub(g)); g.ui.push(storyEventScreen(g, a, big, () => {})); const s2 = g.ui.screen;
    for (let i = 0; i < 6; i++) { s2.finish(); const nx = s2.widgets.find(w => !w.hidden && w.label === '▼'); if (nx) nx.onPress(); } s2.finish(); const t2 = eval(drawTexts)(s2); if (!t2.some(x => /THIS WILL BE REMEMBERED/.test(x))) throw new Error('the banner: ' + t2.slice(0, 10));
    return SAGA_BG_KINDS.length + ' backgrounds · the card · the banner';
  }, [mk, drawTexts]));

  // ---------------- W8: chapters 2–6 ----------------
  await step('chapters 2–6 (§4.2): 3–6 scenes each with a choice on every one, one big decision, a closing scene; a version for every path (sophomore: the first varsity season, a second one or JV · junior: letters or none yet · Signing Day: kept, changed, a prep year, a walk-on, the pros · Freshman Wall: a scholarship, a walk-on, the pros · March: college or the pros)', () => ev(() => {
    const out = [];
    for (let n = 2; n <= 6; n++) { const D = CHAPTERS[n]; if (!D || D.n !== n || !D.scenes) throw new Error('chapter ' + n + ' is not written');
      if (D.scenes.length < 3 || D.scenes.length > 6) throw new Error(n + ': ' + D.scenes.length + ' scenes'); if (D.scenes.filter(x => x.big).length !== 1) throw new Error(n + ': one big decision');
      for (const x of D.scenes) if (!x.choice || !x.lines || !x.sum) throw new Error(n + ': ' + x.id + ' without a choice, lines or a recap line');
      if (!D.past || !D.open || !D.over) throw new Error(n + ': past, open, over'); out.push(n + ' ' + CH_TITLES[n] + ' ' + D.scenes.length); }
    if (!CHAPTERS[2].variant || !CHAPTERS[3].variant || !CHAPTERS[5].variant || !CHAPTERS[6].variant) throw new Error('versions');
    return out.join(' · ');
  }));

  await step('high school over three simulated seasons, chapters 2–4: each in its own season (sophomore, junior, senior) with 3–5 scenes in that season, every one a choice, nothing told twice; the big decisions remembered (ch2: shake hands or talk trash · ch3: a weekend job or the help · ch4: home, the dream or your friend); Signing Day\'s closing scene comes with the signing (what you said, what you signed)', () => ev(([mk, life]) => {
    const out = [], keys = { 2: ['hand', 'talk'], 3: ['job', 'friend', 'coach'], 4: ['home', 'dream', 'friend'] };
    const sign = (a, dd) => { const R4 = chOf(a).list[4] || {}, V = R4.voices || {}, want = V[R4.k], live = dd.offers.filter(o => !o.draft), o = live.find(x => x.pid === want) || live[0]; if (o) amChooseCollege(a, o); else recSimSign(a); };
    for (const seed of [201, 202, 203]) { const seen = [], a = eval(life)(eval(mk)(seed), seen, e => e.chapter && e.chapter.big ? seed % e.choice.length : -1, { until: a => a.stage !== 'hs', sign });
      const S = sagaOf(a), Q = chOf(a), yrs = {};
      for (let n = 2; n <= 4; n++) { const R = Q.list[n], D = CHAPTERS[n]; if (!R || R.st !== 'done' || R.cut) throw new Error(seed + ': chapter ' + n + ' ' + JSON.stringify(R));
        if (!keys[n].includes(R.k) || S.flags['ch' + n] !== R.k) throw new Error(seed + ': ch' + n + ' = ' + S.flags['ch' + n] + ' / ' + R.k);
        const L = S.log.filter(l => l.ch === n), ids = L.map(l => l.beat); if (new Set(ids).size !== ids.length) throw new Error(seed + ': told twice ' + ids);
        if (L.some(l => l.s !== R.s0 && l.beat !== 'signed')) throw new Error(seed + ': chapter ' + n + ' outside its season ' + JSON.stringify(L.map(l => l.beat + '@' + l.s)) + ' s0 ' + R.s0);
        if (L.length < 3 || ids[ids.length - 1] !== D.scenes[D.scenes.length - 1].id || !L.some(l => l.big)) throw new Error(seed + ': chapter ' + n + ' scenes ' + ids); yrs[n] = R.s0; }
      if (!(yrs[2] < yrs[3] && yrs[3] < yrs[4])) throw new Error(seed + ': seasons ' + JSON.stringify(yrs));
      for (const n of [2, 3]) { const lg = (a.arcLog || []).find(l => l.s === yrs[n] && l.st === 'hs'); if (!lg || lg.n < 3 || lg.n > 5) throw new Error(seed + ': season ' + yrs[n] + ' scenes ' + JSON.stringify(a.arcLog)); }
      if (seen.filter(e => e.ch && e.ch.n >= 2).some(e => !(e.choice && e.choice.length))) throw new Error(seed + ': a scene without a choice');
      const R4 = Q.list[4], sg = seen.find(e => e.ch && e.ch.n === 4 && e.ch.scene === 'signed'); if (!sg || !['kept', 'changed', 'prep', 'walkon', 'pro'].includes(R4.v)) throw new Error(seed + ': the signing ' + R4.v);
      if ((R4.v === 'kept' || R4.v === 'changed') && !sg.lines.map(l => typeof l === 'string' ? l : l.t).join(' ').includes(a.college)) throw new Error(seed + ': the school in ' + JSON.stringify(sg.lines));
      out.push(seed + ': ' + [2, 3, 4].map(n => n + '=' + Q.list[n].k + (Q.list[n].v ? '/' + Q.list[n].v : '')).join(' ') + ' · ' + a.college); }
    return out.join(' · ');
  }, [mk, life]));

  await step('the side arcs a chapter tells wait for it: no Family Bills or Best Friend arc in a chapter career\'s high school, and the rival\'s first handshake is chapter 2\'s (the old arc\'s buzzer beat is skipped); a career whose chapters were passed by keeps them', () => ev(([mk, life]) => {
    const a = eval(life)(eval(mk)(211), [], null, { until: a => a.stage !== 'hs' }), S = sagaOf(a);
    if (S.arcs.bills) throw new Error('Family Bills opened ' + JSON.stringify(S.arcs.bills)); if (S.arcs.friend) throw new Error('the Best Friend arc opened'); if (S.log.some(l => l.arc === 'rival' && l.beat === 'buzzer')) throw new Error('the old handshake');
    if (!S.flags.ch2 || !S.cast.friend.name) throw new Error('chapter 2 and the friend'); if (!chOwns(a, 2) || !chOwns(a, 3) || !chOwns(a, 4)) throw new Error('the chapters own their arcs');
    const b = eval(mk)(212), Q = chOf(b); for (const n of [1, 2, 3, 4]) Q.list[n] = { st: 'past' }; Q.n = 5; if (chOwns(b, 2) || chOwns(b, 3) || chOwns(b, 4)) throw new Error('a passed chapter still owns its arc');
    b.stageYear = 2; b.seasonStats.g = 3; if (!SAGA_ARCS.bills.open(b, sagaOf(b), {})) throw new Error('the bills arc can open in an old save');
    return 'bills, friend: none · rival: ' + (S.arcs.rival ? S.arcs.rival.st + ' (after chapter 2)' : 'not yet') + ' · an old save keeps them';
  }, [mk, life]));

  await step('Signing Day\'s versions (§4.2): what you said at the kitchen table and what you signed (kept or changed; following your friend makes you teammates), a prep year, a walk-on, straight to the pros (a flag the chapters after it read)', () => ev(([mk, life, drain]) => {
    const a = eval(life)(eval(mk)(221), [], null, { until: a => !!(a.decision && a.decision.kind === 'college') }); if (!a.decision || a.decision.kind !== 'college') throw new Error('no Signing Day: ' + a.stage + ' y' + a.stageYear);
    const R0 = chOf(a).list[4]; if (!R0 || R0.st !== 'on' || !R0.voices || !R0.k) throw new Error('the kitchen table first ' + JSON.stringify(R0));
    const base = JSON.stringify(a), out = [], text = e => e.lines.map(l => typeof l === 'string' ? l : l.t).join(' ');
    const run = (f, k) => { const b = JSON.parse(base); b.events.length = 0; if (k) { chOf(b).list[4].k = k; sagaOf(b).flags.ch4 = k; } f(b); const seen = []; eval(drain)(b, seen); const R4 = chOf(b).list[4], e = seen.find(x => x.ch && x.ch.n === 4 && x.ch.scene === 'signed'); if (!e || R4.st !== 'done') throw new Error('no signing scene ' + JSON.stringify(R4)); return { b, R4, e, t: text(e) }; };
    const V = R0.voices, said = V[R0.k] ? R0.k : V.dream ? 'dream' : 'home', offerOf = (b, P) => b.decision.offers.find(o => o.pid === P.id) || (o => (b.decision.offers.push(o), o))(colOfferFrom(b, P, 'x')); /* (the school named, or another: an offer from it if it has none) */
    if (!V[said]) throw new Error('no school named at the kitchen table ' + JSON.stringify(V));
    { const P = colProg(V[said]), r = run(b => amChooseCollege(b, offerOf(b, P)), said); if (r.R4.v !== 'kept' || !r.t.includes(P.name)) throw new Error('kept: ' + r.R4.v + ' ' + r.t); out.push('kept (' + said + ': ' + P.name + ')'); }
    { const P = COLLEGES.find(q => !Object.values(V).includes(q.id)), r = run(b => amChooseCollege(b, offerOf(b, P)), said); if (r.R4.v !== 'changed' || !r.t.includes(P.name) || !r.t.includes(colProg(V[said]).name)) throw new Error('changed: ' + r.R4.v + ' ' + r.t); out.push('changed'); }
    { const r = run(b => { const F = colProg(sagaOf(b).cast.friend.pid) || COLLEGES.find(P => P.tier <= 1); sagaOf(b).cast.friend.pid = F.id; chOf(b).list[4].voices.friend = F.id; let o = b.decision.offers.find(x => x.pid === F.id); if (!o) { o = colOfferFrom(b, F, 'x'); b.decision.offers.push(o); } amChooseCollege(b, o); }, 'friend');
      if (r.R4.v !== 'kept' || sagaOf(r.b).flags.friendWay !== 'teammate' || !/Teammates/.test(r.t)) throw new Error('following the friend: ' + r.R4.v + ' ' + sagaOf(r.b).flags.friendWay + ' ' + r.t); out.push('friend: teammates'); }
    { const r = run(b => { for (const o of b.offers || []) o.pulled = true; b.decision = null; recSigningDay(b, amRng(b)); if (!b.decision.prepOk) throw new Error('no prep year offered'); recPrepYear(b, amRng(b)); }); if (r.R4.v !== 'prep' || !/prep year/.test(r.t) || !r.b.prep) throw new Error('prep: ' + r.R4.v + ' ' + r.t); out.push('prep'); }
    { const r = run(b => { b.gpa = Math.max(b.gpa || 0, 3.9); const P = COLLEGES.find(P => !recWalkOnWhyNot(b, P.id)); if (!recWalkOn(b, P.id)) throw new Error('no walk-on'); }); if (r.R4.v !== 'walkon' || !/walk-on/.test(r.t) || r.b.scholarship !== 'walkon') throw new Error('walk-on: ' + r.R4.v + ' ' + r.t); out.push('walk-on'); }
    { const r = run(b => amChooseCollege(b, { name: 'Skip college: turn pro', tier: -1, draft: true })); if (r.R4.v !== 'pro' || !/No college/.test(r.t) || sagaOf(r.b).flags.noCollege !== 1) throw new Error('the pros: ' + r.R4.v + ' ' + r.t); out.push('the pros'); }
    if (out.length < 5) throw new Error('paths ' + out); return out.join(' · ');
  }, [mk, life, drain]));

  await step('college (§4.2): Freshman Wall in year one (a scholarship or a walk-on) and March in year two (Coach Adeyinka\'s health scare; the knee in the tournament: play through it or sit), each in its season and remembered; the flags of chapters 1–6 survive a save and a reload', () => ev(([mk, life, drain]) => {
    const g = HH.game, seen = [], a = eval(life)(eval(mk)(231), seen, e => e.chapter && e.chapter.big && e.ch.n >= 5 ? 1 : -1, { until: a => a.stage === 'college' && a.stageYear >= 3, declare: () => false }), S = sagaOf(a), Q = chOf(a), R5 = Q.list[5], R6 = Q.list[6];
    if (a.stage !== 'college' || a.stageYear !== 3) throw new Error('not in college year three: ' + a.stage + ' y' + a.stageYear);
    if (!R5 || R5.st !== 'done' || R5.cut || !['college', 'walkon'].includes(R5.v) || R5.k !== 'home' || S.flags.ch5 !== 'home' || !S.flags.sibMentor) throw new Error('chapter 5 ' + JSON.stringify(R5));
    if (!R6 || R6.st !== 'done' || R6.cut || R6.v !== 'college' || R6.k !== 'sit' || !S.flags.coachScare) throw new Error('chapter 6 ' + JSON.stringify(R6) + ' scare ' + S.flags.coachScare);
    const L5 = S.log.filter(l => l.ch === 5), L6 = S.log.filter(l => l.ch === 6); if (L5.some(l => l.s !== R5.s0) || L6.some(l => l.s !== R6.s0) || R6.s0 !== R5.s0 + 1) throw new Error('seasons ' + JSON.stringify([L5.map(l => l.s), L6.map(l => l.s)]));
    if (!L6.some(l => l.beat === 'scare') || !L6.some(l => l.beat === 'knee')) throw new Error('March ' + L6.map(l => l.beat));
    for (const s0 of [R5.s0, R6.s0]) { const lg = (a.arcLog || []).find(l => l.s === s0 && l.st === 'college'); if (!lg || lg.n < 3 || lg.n > 5) throw new Error('season ' + s0 + ' scenes ' + JSON.stringify(a.arcLog)); }
    if (seen.filter(e => e.ch && e.ch.n >= 5).some(e => !(e.choice && e.choice.length))) throw new Error('a scene without a choice');
    g.save.data.c1 = a; g.save.data.career = null; g.save.save(); const b = new SaveSystem().data.c1; for (let n = 1; n <= 6; n++) if (!b || sagaFlag(b, 'ch' + n) !== S.flags['ch' + n] || chOf(b).list[n].st !== 'done') throw new Error('after a reload: ch' + n);
    return '5 ' + R5.v + '=' + R5.k + ' · 6 ' + R6.v + '=' + R6.k + ' (scare: ' + S.flags.coachScare + ') · ' + [1, 2, 3, 4, 5, 6].map(n => S.flags['ch' + n]).join('/') + ' after a reload';
  }, [mk, life, drain]));

  await step('the pro versions (§4.2): leaving college after one year gets March in the first pro season (the playoff race); no college at all gets Freshman Wall in the first pro season and March in the second', () => ev(([mk, life, proYear, proNext]) => {
    const g = HH.game, out = [];
    { const a = eval(life)(eval(mk)(241), [], null, { until: a => a.stage === 'college' && a.stageYear >= 2 || a.stage === 'combine', declare: a => a.stageYear >= 1 }); if (a.stage !== 'combine') throw new Error('not one-and-done: ' + a.stage + ' y' + a.stageYear);
      const R5 = chOf(a).list[5]; if (!R5 || R5.st !== 'done' || R5.v === 'pro') throw new Error('chapter 5 in college ' + JSON.stringify(R5));
      const save = g.save.data; save.c1 = a; save.career = null; createCareerFromAmateur(save, a); const c = save.career; save.c1 = null; const seen = []; eval(proYear)(g, c, seen); const R6 = chOf(c).list[6];
      if (!R6 || R6.st !== 'done' || R6.v !== 'pro' || !R6.k) throw new Error('March in the pros ' + JSON.stringify(R6)); if (seen.some(e => e.ch && e.ch.n === 6 && e.ch.scene === 'whiteboard')) throw new Error('the whiteboard in the pros');
      const card = seen.find(e => e.ch && e.ch.n === 6 && e.chapter.open); if (!card || card.chapter.sub !== '') { /* (the card's line comes with the version's first scene) */ } out.push('one-and-done: March (' + R6.v + ', ' + R6.k + ')'); }
    { const a = eval(life)(eval(mk)(242), [], null, { until: a => !!(a.decision && a.decision.kind === 'college') }); amChooseCollege(a, { name: 'Skip college: turn pro', tier: -1, draft: true }); eval(life)(a, [], null, {}); if (a.stage !== 'combine' || sagaOf(a).flags.noCollege !== 1) throw new Error('no college ' + a.stage);
      const save = g.save.data; save.c1 = a; save.career = null; createCareerFromAmateur(save, a); const c = save.career; save.c1 = null; const seen = []; eval(proYear)(g, c, seen); const Q = chOf(c), R5 = Q.list[5];
      if (!R5 || R5.st !== 'done' || R5.v !== 'pro' || !R5.k) throw new Error('Freshman Wall in the pros ' + JSON.stringify(R5)); if (Q.list[6]) throw new Error('March in the same season');
      eval(proNext)(c); eval(proYear)(g, c, seen); const R6 = Q.list[6] || chOf(c).list[6]; if (!R6 || R6.st !== 'done' || R6.v !== 'pro' || R6.s0 !== R5.s0 + 1) throw new Error('March in the second pro season ' + JSON.stringify(R6));
      out.push('no college: Freshman Wall (' + R5.k + ') and March (' + R6.k + ') in pro seasons 1 and 2'); }
    return out.join(' · ');
  }, [mk, life, proYear, proNext]));

  await step('old saves: a junior with no chapters yet passes chapters 1–2 by and opens chapter 3 at its moment; a college sophomore passes 1–5 and opens March', () => ev(([mk, life]) => {
    const a = eval(life)(eval(mk)(251), [], null, { until: a => a.stage === 'hs' && a.stageYear === 3 && !(a.tryout && a.tryout.step !== 'done') }); delete a.saga.ch; a.events.length = 0; a.league.week = Math.max(1, a.league.week || 0); sagaTick(a, 'game', {}); const Q = chOf(a);
    if (Q.list[1].st !== 'past' || Q.list[2].st !== 'past' || !Q.list[3] || Q.list[3].st !== 'on') throw new Error('a junior ' + JSON.stringify(Q.list)); if (!a.events.some(e => e.ch && e.ch.n === 3 && e.chapter.open)) throw new Error('chapter 3 opens with its card');
    const b = eval(life)(eval(mk)(252), [], null, { until: b => b.stage === 'college' && b.stageYear === 2, declare: () => false }); if (b.stage !== 'college') throw new Error('no college ' + b.stage); delete b.saga.ch; b.events.length = 0; b.league.week = Math.max(1, b.league.week || 0); sagaTick(b, 'game', {}); const Q2 = chOf(b);
    for (let n = 1; n <= 5; n++) if (!Q2.list[n] || Q2.list[n].st !== 'past') throw new Error('a college sophomore: ' + n + ' ' + JSON.stringify(Q2.list[n])); if (!Q2.list[6] || Q2.list[6].st !== 'on') throw new Error('March ' + JSON.stringify(Q2.list[6]));
    return 'junior: 1–2 passed, 3 on · college sophomore: 1–5 passed, 6 on';
  }, [mk, life]));

  await step('Sim ahead stops at a chapter\'s scene in both modes (the main story is never answered for you); other story cards stay routine in a season run', () => ev(() => {
    const ch = { kind: 'dialog', ch: { n: 1, scene: 'x' }, title: 'X' }, side = { kind: 'dialog', title: 'Y' };
    if (simEventClass(ch, 'season') !== 'stop' || simEventClass(ch, 'big') !== 'stop') throw new Error('a chapter scene'); if (simEventClass(side, 'season') !== 'auto' || simEventClass(side, 'big') !== 'stop') throw new Error('a side card');
    return 'chapter: stop/stop · side: auto/stop';
  }));

  // ---------------- W9: chapters 7–12 and the endings ----------------
  // the pro helpers, in the page: into the pros (the handoff); a pro career season by season (the queue answered) until
  // o.until(c) after a season, or a retirement (o.retireAt, or when it must: the retirement's queue is answered too,
  // chapter 12's decision and then the ending's cutscene); picks([[chapter, scene, key or index]]) answers those scenes
  await ev(([proYear, proNext, proDrain, life, mk]) => { window.W9 = { year: eval(proYear), next: eval(proNext), drain: eval(proDrain), life: eval(life), mk: eval(mk),
    toPro: a => { const save = HH.game.save.data; save.c1 = a; save.career = null; createCareerFromAmateur(save, a); const c = save.career; save.c1 = null; return c; },
    run: (c, seen, pick, o) => { o = o || {}; const g = HH.game, W = window.W9; let k = 0; while (c.phase !== 'retired' && k++ < 30) { W.year(g, c, seen, pick); if (o.until && o.until(c)) break; if (mustRetire(c) || (canRetire(c) && meOf(c).age >= (o.retireAt || 35))) { retireCareer(g.save.data); for (let j = 0; j < 4; j++) { chRelease(c, true); W.drain(c, seen, pick); } break; } W.next(c); } return c; },
    picks: rules => e => { for (const [n, scene, k] of rules) if (e.ch && e.ch.n === n && e.ch.scene === scene) { const i = typeof k === 'number' ? k : (e.choice || []).findIndex(ch => ch.k === k); if (i >= 0 && e.choice && e.choice[i]) return i; } return -1; },
    told: (c, n) => sagaOf(c).log.filter(l => l.ch === n).map(l => l.beat) }; return 'ok'; }, [proYear, proNext, proDrain, life, mk]);

  await step('chapters 7–12 (§4.2): 3–6 scenes each with a choice on every one, one big decision and a closing scene, a version for every path; the six endings (§4.3), each a cutscene with your sibling\'s last line', () => ev(() => {
    const out = [];
    for (let n = 7; n <= 12; n++) { const D = CHAPTERS[n]; if (!D || D.n !== n || D.scenes.length < 3 || D.scenes.length > 6) throw new Error(n + ': ' + (D && D.scenes.length) + ' scenes');
      if (D.scenes.filter(s => s.big).length !== 1) throw new Error(n + ': one big decision'); for (const s of D.scenes) if (!s.choice) throw new Error(n + ': no choice in ' + s.id);
      out.push(n + ' ' + CH_TITLES[n] + ' (' + D.scenes.map(s => s.id + (s.big ? '*' : '')).join(' ') + ')'); }
    const ids = SAGA_ENDINGS.map(E => E.id); if (ids.slice().sort().join() !== 'coach,fallen,family,hometown,mercenary,owner') throw new Error('endings ' + ids);
    for (const E of SAGA_ENDINGS) if (typeof E.lines !== 'function' || typeof E.sib !== 'function' || !E.title || !E.bg) throw new Error('ending ' + E.id);
    return out.join(' · ') + ' · endings: ' + ids.join(', ');
  }));

  await step('The Decision, then Rookie: declaring after college year two tells chapter 7 at the declare (the scouts; who speaks for you, the honest agent, the big agency or your best friend; the pen); the big agency is your agent in the pros and your friend goes to work for your rival; Rookie opens the first pro season with the first contract (no draft, and R9\'s Signing Day and First Contract step aside), learn or demand minutes, its closing scene on the next season\'s first day; 3–5 scenes in the first pro season', () => ev(() => {
    const W = window.W9, seen = [], pick = W.picks([[7, 'agents', 'shady'], [8, 'minutes', 'demand']]), a = W.life(W.mk(301), seen, pick, { declare: a => a.stageYear >= 2 }), S = sagaOf(a), R7 = chOf(a).list[7];
    if (a.stage !== 'combine') throw new Error('not at the combine: ' + a.stage + ' y' + a.stageYear);
    if (!R7 || R7.st !== 'done' || R7.v !== 'declare' || R7.k !== 'shady' || S.flags.agent !== 'shady') throw new Error('chapter 7 ' + JSON.stringify(R7));
    const L7 = W.told(a, 7); if (L7.join() !== 'scouts,agents,pen') throw new Error('scenes ' + L7); if (!['rival', 'teammate'].includes(S.flags.friendWay)) throw new Error('friend ' + S.flags.friendWay);
    const c = W.toPro(a), ids = c.events.concat(c.me.later || []).filter(e => e.kind === 'dialog').map(e => e.id); if (ids.includes('draft') || ids.includes('first-contract')) throw new Error('R9 beats ' + ids);
    const e8 = c.events.concat(c.me.later || []).find(e => e.ch && e.ch.n === 8); /* (it can wait for the next moment: two story screens in a row at most) */ if (!e8 || e8.title !== 'THE FIRST CONTRACT' || !e8.chapter.open) throw new Error('chapter 8 opens ' + (e8 && e8.title));
    const St = staffOf(c); if (!St.agent || St.agent.pers !== 'shady' || St.agent.name !== chAgents(c).shady) throw new Error('agent ' + JSON.stringify(St.agent && [St.agent.name, St.agent.pers]));
    const s1 = c.season; W.run(c, seen, pick, { until: () => true }); const R8 = chOf(c).list[8]; if (!R8 || R8.k !== 'demand' || R8.st !== 'on' || R8.v === 'later') throw new Error('chapter 8 after a season ' + JSON.stringify(R8));
    const lg = (c.me.arcLog || []).find(l => l.s === s1 && l.st === 'pro'); if (!lg || lg.n < 3 || lg.n > 5) throw new Error('pro season 1 scenes ' + JSON.stringify(c.me.arcLog));
    W.next(c); const yr = c.events.find(e => e.ch && e.ch.n === 8 && e.ch.scene === 'year'); if (!yr || chOf(c).list[8].st !== 'done') throw new Error('the closing on the next season\'s first day: ' + (yr && yr.title));
    if (!sagaOf(c).flags.ownerBacks) throw new Error('the owner\'s flag');
    return '7 declare=shady (' + L7.join(', ') + '), your friend: ' + S.flags.friendWay + ' · agent ' + St.agent.name + ' (' + St.agent.pers + ') · 8 ' + R8.v + '=demand, ' + lg.n + ' scenes in pro season 1 · ' + yr.title;
  }));

  await step('The Decision\'s versions: one more year (the stay scene, the agents at the next year\'s declare), four years (who speaks for you comes with the last), one-and-done (the pro version in the second pro season, your next deal); your best friend as your agent', () => ev(() => {
    const W = window.W9, out = [];
    { const a = W.life(W.mk(311), [], null, { declare: a => a.stageYear >= 3 }), R7 = chOf(a).list[7], L = W.told(a, 7), ss = sagaOf(a).log.filter(l => l.ch === 7).map(l => l.s);
      if (a.stage !== 'combine' || !R7 || R7.st !== 'done' || R7.v !== 'declare' || L.join() !== 'scouts,stay,agents,pen') throw new Error('one more year ' + JSON.stringify(R7) + ' ' + L);
      if (ss[1] !== ss[0] || ss[2] !== ss[0] + 1) throw new Error('seasons ' + ss); out.push('one more year: ' + L.join(', ')); }
    { const a = W.life(W.mk(312), [], null, { declare: () => false }), R7 = chOf(a).list[7], L = W.told(a, 7), lg = sagaOf(a).log.filter(l => l.ch === 7); if (a.stage !== 'combine' || a.stageYear !== AMC.stages.college.years || !R7 || R7.st !== 'done' || L.slice(-2).join() !== 'agents,pen' || lg[lg.length - 1].s !== lg[lg.length - 2].s) throw new Error('four years ' + JSON.stringify(R7) + ' ' + L); out.push('four years (' + R7.v + '): ' + L.join(', ')); } /* (a version is set when the chapter opens: the senior one when four years done is its first moment) */
    { const a = W.life(W.mk(313), [], null, { declare: a => a.stageYear >= 1 }); if (a.stage !== 'combine' || chOf(a).list[7]) throw new Error('one-and-done: chapter 7 in college ' + a.stage);
      const c = W.toPro(a), s1 = c.season, pick = W.picks([[7, 'agents', 'friend']]); W.run(c, [], pick, { until: c => !!(chOf(c).list[7] && chOf(c).list[7].st === 'done') }); const R7 = chOf(c).list[7], S = sagaOf(c);
      if (!R7 || R7.st !== 'done' || R7.v !== 'pro' || R7.s0 !== s1 + 1 || R7.k !== (chFriend(c) ? 'friend' : 'honest')) throw new Error('one-and-done ' + JSON.stringify(R7) + ' first pro season ' + s1);
      if (R7.k === 'friend' && (S.flags.friendWay !== 'agent' || staffOf(c).agent.name !== chFriend(c) && staffOf(c).agent.name.indexOf(chFriend(c)) !== 0)) throw new Error('your friend, your agent: ' + S.flags.friendWay + ' ' + staffOf(c).agent.name);
      out.push('one-and-done: the pro version in pro season 2 (' + W.told(c, 7).join(', ') + '), agent ' + R7.k + (R7.k === 'friend' ? ', your friend: ' + S.flags.friendWay : '')); }
    return out.join(' · ');
  }));

  await step('a whole career in chapters: 7–12 each reached and closed in order and at its age (Prime from 25, the Ring Chase from 27, Finals from 29 for a window of seasons, Legacy from 33 to the last day); no scene twice word for word; chapter 12\'s decision tells the ending, its closing cutscene, with your sibling\'s last line', () => ev(() => {
    const W = window.W9, seen = [], a = W.life(W.mk(321), seen, null, { declare: a => a.stageYear >= 2 }), c = W.toPro(a); W.run(c, seen, null, {}); const Q = chOf(c), S = sagaOf(c);
    if (c.phase !== 'retired') throw new Error('not retired: ' + c.phase);
    for (let n = 1; n <= 12; n++) { const R = Q.list[n]; if (!R || R.st !== 'done' || R.cut) throw new Error('chapter ' + n + ' ' + JSON.stringify(R)); }
    const age = n => Q.list[n].age; if (age(9) < CH.primeAge || age(10) < CH.ringAge || age(11) < CH.finalsAge || (age(12) < CH.legacyAge && Q.list[12].v !== 'sudden')) throw new Error('ages ' + [9, 10, 11, 12].map(age));
    for (let n = 8; n <= 12; n++) if (Q.list[n].age < Q.list[n - 1].age || (n > 8 && Q.list[n].s0 < Q.list[n - 1].s0)) throw new Error('order at ' + n); /* (7's season is college's count; the pros count from 1) */
    const keys = seen.filter(e => e.kind === 'dialog').map(e => (e.id || e.title) + '#' + (e.lines || []).map(l => typeof l === 'string' ? l : (l && l.t) || '').join('|')), dup = keys.filter((k, i) => keys.indexOf(k) !== i); if (dup.length) throw new Error('told twice: ' + dup.slice(0, 2).map(k => k.slice(0, 90)));
    const end = seen.find(e => e.epilogue && e.ch && e.ch.n === 12); if (!end || end.ch.scene !== 'stage' || !SAGA_ENDINGS.some(E => E.id === end.epilogue && E.title === end.title) || S.epilogue !== end.epilogue) throw new Error('the ending ' + (end && [end.title, end.epilogue]) + ' ' + S.epilogue);
    const last = end.lines[end.lines.length - 1]; if (!last || last.w !== 'sibling') throw new Error('the sibling\'s last line ' + JSON.stringify(last));
    return [9, 10, 11, 12].map(n => n + ' at ' + age(n) + (Q.list[n].v ? ' (' + Q.list[n].v + ')' : '')).join(' · ') + ' · ending: ' + end.title + ' · ' + keys.length + ' scenes, none twice';
  }));

  await step('the paths: a shady agent\'s scandal in Prime (ride it out), your sibling\'s big night skipped for the sponsor (later they need you), leaving for a contender (traded, or at the next season), buying a team at the end: the Mercenary Champion with a ring since leaving, else the Fallen Star; the flags survive a save and a reload', () => ev(() => {
    const W = window.W9, seen = [], pick = W.picks([[7, 'agents', 'shady'], [9, 'conflict', 'sponsor'], [9, 'scandal', 1], [10, 'call', 'leave'], [12, 'next', 'owner']]);
    const a = W.life(W.mk(331), seen, pick, { declare: a => a.stageYear >= 2 }), c = W.toPro(a); W.run(c, seen, pick, { until: c => !!chOf(c).list[11] }); const S = sagaOf(c), R10 = chOf(c).list[10];
    if (S.flags.agent !== 'shady' || S.flags.scandal !== 'ride' || S.flags.ch9 !== 'sponsor' || S.flags.sibArc !== 'needs') throw new Error('prime ' + JSON.stringify([S.flags.agent, S.flags.scandal, S.flags.ch9, S.flags.sibArc]));
    if (!R10 || R10.k !== 'leave' || S.flags.leftFrom == null || meOf(c).club === S.flags.leftFrom) throw new Error('the ring chase ' + JSON.stringify(R10) + ' club ' + meOf(c).club + ' from ' + S.flags.leftFrom);
    const g = HH.game; g.save.data.career = c; g.save.save(); const b = new SaveSystem().data.career; for (const k of ['ch7', 'ch8', 'ch9', 'ch10', 'agent', 'scandal', 'sibArc', 'friendWay', 'leftFrom', 'leftTitles', 'coachWay']) if (JSON.stringify(sagaFlag(b, k)) !== JSON.stringify(S.flags[k])) throw new Error('after a reload: ' + k);
    W.run(c, seen, pick, {}); const E = sagaOf(c).epilogue, want = chTitlesSinceLeft(c, sagaOf(c)) >= 1 ? 'mercenary' : 'fallen'; if (E !== want || sagaOf(c).flags.ch12 !== 'owner') throw new Error('ending ' + E + ' (want ' + want + ') ' + sagaOf(c).flags.ch12);
    return 'shady, the sponsor, rode it out, left the ' + clubOf(S.flags.leftFrom).name + ' (rings since: ' + chTitlesSinceLeft(c, sagaOf(c)) + '), bought a team · ending: ' + E + ' · flags through a reload';
  }));

  await step('retiring early: the chapters still to come are passed by (one in progress is cut) and Legacy opens on the last day, its sudden version: what comes next (the body says no), then the ending: two story screens', () => ev(() => {
    const W = window.W9, seen = [], a = W.life(W.mk(341), seen, null, { declare: a => a.stageYear >= 2 }), c = W.toPro(a); W.run(c, seen, W.picks([[12, 'next', 'coach']]), { retireAt: 30 }); const Q = chOf(c), R12 = Q.list[12], S = sagaOf(c);
    if (c.phase !== 'retired' || meOf(c).age > 31 || !R12 || R12.st !== 'done' || R12.v !== 'sudden' || R12.k !== 'coach') throw new Error('legacy ' + JSON.stringify(R12) + ' age ' + meOf(c).age);
    for (let n = 1; n < 12; n++) { const R = Q.list[n]; if (!R || (R.st !== 'done' && R.st !== 'past')) throw new Error(n + ' ' + JSON.stringify(R)); }
    const L12 = W.told(c, 12); if (L12.join() !== 'next,stage') throw new Error('scenes ' + L12); /* (the last day: two story screens; what comes next says what the body said) */
    const first = SAGA_ENDINGS.find(E => { try { return E.when(c, S, legacyOf(c)); } catch (e) { return false; } }); if (S.epilogue !== (first ? first.id : 'coach')) throw new Error('ending ' + S.epilogue + ' (first that fits: ' + (first && first.id) + ')');
    return 'retired at ' + meOf(c).age + ' · ' + [9, 10, 11].map(n => n + ' ' + Q.list[n].st + (Q.list[n].cut ? '/cut' : '')).join(', ') + ' · 12 sudden: ' + L12.join(', ') + ' · ending: ' + S.epilogue;
  }));

  await step('old saves: a pro career from before chapters 7–12 (its chapters stop at 6) passes 7 and 8 by when their moment is gone and opens Prime at its age', () => ev(() => {
    const W = window.W9, a = W.life(W.mk(351), [], null, { declare: a => a.stageYear >= 2 }), c = W.toPro(a); W.run(c, [], null, { until: c => meOf(c).age >= CH.primeAge && chProSeason(c) >= 6 });
    const Q = chOf(c); for (let n = 7; n <= 12; n++) delete Q.list[n]; Q.n = 7; c.events.length = 0; W.next(c);
    if (!Q.list[7] || Q.list[7].st !== 'past' || !Q.list[8] || Q.list[8].st !== 'past') throw new Error('7/8 ' + JSON.stringify([Q.list[7], Q.list[8]]));
    if (meOf(c).age < CH.primePastAge && (!Q.list[9] || Q.list[9].st !== 'on' || !c.events.some(e => e.ch && e.ch.n === 9 && e.chapter.open))) throw new Error('Prime ' + JSON.stringify(Q.list[9]));
    return 'pro season ' + chProSeason(c) + ' at ' + meOf(c).age + ': 7 and 8 passed by, 9 ' + (Q.list[9] && Q.list[9].st);
  }));

  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
