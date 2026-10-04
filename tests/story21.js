// 2.1 (§4): the main story in chapters. W7: the engine (chapters in order, a version each, scenes at hooks, one big
// decision with a flag that lasts, a closing scene), chapter 1 over a freshman year, the cast (your sibling, Coach
// Adeyinka, the best friend met at tryouts), the pacing (two story screens in a row at most, a season's 3–5 scenes,
// every scene with a choice), the title card and "This will be remembered", the cutscene backgrounds, "Previously on
// Hoop Heads", the Story screen as chapters, save and reload, old saves, Sim ahead. (Chapters reached and scenes per
// season over whole careers: tests/careersim.js.) Usage: node tests/story21.js
const { launch, openPage, runner } = require('./lib');
const fs = require('fs'), path = require('path');
(async () => {
  const browser = await launch(); const R = runner('story 2.1'); const D = await openPage(browser); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  // a new career (its chapter 1 already opened: the night before tryouts is in the queue)
  const mk = `(seed => amCreate(defaultSave(), { name: 'Chapter Test', look: PRESET_LOOKS[seed % 16], number: 9, style: 'slasher', seed, seasonLength: 11, gameLength: 120 }))`;
  // answers the queue (each card's default, or pick(e) → its index), keeping what was told
  const drain = `((a, seen, pick) => { const q = a.events.filter(e => !e.answered && (e.kind === 'dialog' || e.kind === 'rival')).length; if (q > 2) throw new Error(q + ' story screens in a row'); for (const e of a.events) if (e.kind === 'dialog') { seen.push(e); if (e.choice && e.answered == null) { const i = pick ? pick(e) : -1; if (i >= 0) stChoose(a, e, i); else stAutoChoose(a, e); } } a.events.length = 0; })`;
  const year = `((a, seen, pick) => { const d = eval(DR); d(a, seen, pick); let g = 0; while (a.tryout && a.tryout.step !== 'done' && g++ < 5) hsSimTryout(a); d(a, seen, pick); const s0 = a.season; g = 0; while (a.season === s0 && g++ < 80) { if (a.decision || (a.summer && a.summer.pending)) break; const r = amSimGame(a); d(a, seen, pick); if (!r && !amNext(a)) break; } return a; })`.replace('DR', JSON.stringify(drain).slice(1, -1).replace(/\\"/g, '"'));
  const drawTexts = `(s => { const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; const ctx = cv.getContext('2d'); const texts = []; const ft = ctx.fillText.bind(ctx); ctx.fillText = (t, x, y, w) => { texts.push(String(t)); return ft(t, x, y, w); }; s.draw(ctx, HH.game.ui); return texts; })`;

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

  await step('the cast (§4.1): a younger sibling (your surname, four years younger, a kid\'s portrait, their own meter), Coach Adeyinka (a new career\'s high school coach), the best friend met at tryouts; nine people', () => ev(([mk, year]) => {
    const a = eval(mk)(31), S = sagaOf(a), sib = sagaWho(a, 'sibling'), last = a.name.split(' ').slice(1).join(' ');
    if (SAGA_CAST.length !== 9 || !SAGA_CAST.includes('sibling')) throw new Error('cast ' + SAGA_CAST); if (!sib.name.endsWith(' ' + last) || sib.age !== a.age - CONFIG.chapters.sibGap || ageStageOf(sib.age) !== 0) throw new Error('sibling ' + sib.name + ' ' + sib.age);
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
      if (a.events.slice(n0).some(e => e.ch)) throw new Error('a chapter scene for an old save past it'); const rows = chapterRows(a); if (rows[0].mark !== '—' || rows[0].sub !== 'Before this save') throw new Error('row ' + JSON.stringify(rows[0]));
      // a 2.0 freshman: no chapter state, mid-season: chapter 1 starts now (the opening's version for after tryouts)
      const f = eval(mk)(71); while (f.tryout && f.tryout.step !== 'done') hsSimTryout(f); f.events.length = 0; delete f.saga.ch; f.seasonStats.g = 4; sagaTick(f, 'game', {}); const e = f.events.find(x => x.ch); if (!e || e.ch.scene !== 'night' || !/^Freshman year at /.test(e.lines[0])) throw new Error('mid-season start ' + JSON.stringify(e && e.lines));
      // a pro career (the dev jump, an old pro save) whose chapter 1 never closed: it closes without telling
      const save = defaultSave(), c = testProLeague(72, save), Q2 = chOf(c); Q2.list[1] = { st: 'on', v: '', i: 1, told: 1, s0: 1, stage: 'hs', age: 14 }; Q2.n = 1; c.events.length = 0; sagaTick(c, 'game', {}); if (Q2.list[1].st !== 'done' || !Q2.list[1].cut || c.events.some(x => x.ch)) throw new Error('quiet close ' + JSON.stringify(Q2.list[1]));
      return 'w5 fixture y' + a.stageYear + ': chapter 1 past · a 2.0 freshman starts it mid-season · a stale chapter closes quietly';
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

  await step('Sim ahead stops at a chapter\'s scene in both modes (the main story is never answered for you); other story cards stay routine in a season run', () => ev(() => {
    const ch = { kind: 'dialog', ch: { n: 1, scene: 'x' }, title: 'X' }, side = { kind: 'dialog', title: 'Y' };
    if (simEventClass(ch, 'season') !== 'stop' || simEventClass(ch, 'big') !== 'stop') throw new Error('a chapter scene'); if (simEventClass(side, 'season') !== 'auto' || simEventClass(side, 'big') !== 'stop') throw new Error('a side card');
    return 'chapter: stop/stop · side: auto/stop';
  }));

  console.log(D.errors.length ? 'page errors: ' + D.errors.slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
