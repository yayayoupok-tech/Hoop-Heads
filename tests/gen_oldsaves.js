// Old-save fixtures (M9): runs older builds straight from git history (before M0, M0, M5 and M7) and saves what they
// write: a high-school career in its second season with a classic team league on the side, and a pro career in the middle
// of its first season (for M7 also one in the playoffs and one in the offseason). tests/oldsaves.js then loads each one in
// this build and plays on. R3 adds the R2 build (a v2 amateur career and a v4 pro career, from before traits, genes and
// teams); W5 adds the W4 build (2.0's twelve-franchise PBL: mid-season, the playoffs, the offseason); R5 adds the R4 build (a v3 amateur career from before tryouts, districts, recruiting ranks, summers and grades); R6 adds the R5 build (also a v4 college career three games into its first season, from before the conference, the national tournament, NIL and the draft stock); R9 adds the R8 build (story cards from before dialogue boxes, with no speaker, waiting on the hub; a pro's trade request waiting; no story arcs, family or social feed yet); R8 adds the R7 build (hype on the old 0–10 scale, a rival fired up by trash talk, a press question waiting: R8 moves hype to 0–100 and answers with four choices); R7 adds the R6 build (pro careers with the old four-role staff and fixed four-season deals, mid-season, in the playoffs and in the offseason); F10 adds the R10 build, the game as it was before the F pass (a pro career that came through the draft, and an amateur career waiting at the pro combine for a draft F7 removed: now three franchises make offers). Needs the git history. Usage: node tests/gen_oldsaves.js [outDir] [tag]  (default tests/fixtures/; tag: one build)
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const { ROOT, launch } = require('./lib');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'tests', 'fixtures')), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'hoopheads-old-')); fs.mkdirSync(OUT, { recursive: true });
const BUILDS = [['d3c2eae', 'premerge'], ['f9d991e', 'm0'], ['38b2c05', 'm5'], ['6cfa017', 'm7'], ['5eef835', 'r2'], ['f037d96', 'r4'], ['d14751c', 'r5'], ['4645e3a', 'r6'], ['e151440', 'r7'], ['9a5d31f', 'r8'], ['ac7463e', 'r10'], ['7e1b411', 'w4']].filter(b => !process.argv[3] || b[1] === process.argv[3]);
(async () => {
  const browser = await launch();
  for (const [commit, tag] of BUILDS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } }); const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const file = path.join(TMP, 'build_' + commit + '.html'); fs.writeFileSync(file, execFileSync('git', ['show', commit + ':index.html'], { cwd: ROOT, maxBuffer: 1 << 26 }));
    await page.goto('file://' + file); await page.waitForTimeout(800);
    const ev = (f, a) => page.evaluate(f, a);
    // 1) high school, season 2, plus a team-league career with two games and changed settings
    const hs = await ev(() => {
      localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data;
      s.settings.difficulty = 'allstar'; s.settings.shake = 0.5; s.settings.meter = 'minimal';
      const a = amCreate(s, { name: 'Old Save Kid', look: PRESET_LOOKS[5], number: 23, style: 'shooter', seed: 77 });
      let guard = 0; while ((a.season || 1) < 2 && guard++ < 400) { a.events.length = 0; if (a.decision) { if (a.decision.kind === 'declare') amDeclare(a, false); else if (a.decision.signing) recSimSign(a); else amChooseCollege(a, a.decision.offers[0]); continue; } if (!amSimGame(a)) break; }
      for (let i = 0; i < 3; i++) { a.events.length = 0; amSimGame(a); }
      const player = { name: 'Old Team Guy', nick: 'Old', arch: 'slasher', height: 1.93, attrs: { sho: 4, fin: 6, han: 5, spd: 5, jmp: 5, def: 4, str: 3 }, look: Object.assign({}, PRESET_LOOKS[3], { number: 9, sleeves: false, shoes: null }), moves: { crossover: true, spin: false, stepback: false, hesitation: false, euro: false, dunk360: false, windmill: false } };
      const tc = typeof tcCreateCareer === 'function' ? tcCreateCareer(s, player, TEAMS[2].id, '3v3') : { results: [] }; /* (the classic team league is gone from builds after F1) */
      for (let i = 0; i < 2 && tc.league; i++) { const L = tc.league; const gm = tcUserGame(tc); if (!gm) break; const opts = tcMatchOptsFor(tc, s, gm, false); const r = simulateMatch(Object.assign({}, opts, { humanTeam: -1 }), { render: false }); tcAfterGame(s, r, 0); }
      g.save.save(); return { raw: localStorage.getItem(CONFIG.save.key), season: a.season, stage: a.stage, games: (a.totals || {}).g, tcGames: tc.results.length };
    });
    if (tag === 'r7') { const d = JSON.parse(hs.raw), a = d.c1; a.hype = 4.5; a.rivalFire = 2; a.events = (a.events || []).filter(e => e.kind !== 'press'); a.events.unshift({ kind: 'press', title: 'THE PRESS ROOM', q: 'Big win tonight. How are you feeling?', x: { name: a.name, won: true, us: 15, them: 9, opp: 'Old Opponent', rival: false, recs: [] } }); hs.raw = JSON.stringify(d); } // R8: the old scale, the old fire, a question from before R8
    if (tag === 'r8') { const d = JSON.parse(hs.raw), a = d.c1; a.events = (a.events || []).filter(e => e.kind !== 'press'); a.events.unshift({ kind: 'story', title: 'A NOTE FROM HOME', lines: ['A note on the fridge when you get home.', '"Proud of you. Eat something green."'] }); hs.raw = JSON.stringify(d); } // R9: a story card from before dialogue boxes (no speaker)
    fs.writeFileSync(path.join(OUT, 'save_' + tag + '_highschool_teamleague.json'), hs.raw); console.log(tag, 'high school', JSON.stringify({ season: hs.season, stage: hs.stage, games: hs.games, tcGames: hs.tcGames, bytes: hs.raw.length }));
    // 2) the amateur career played through to the pros, then half a pro season
    const pro = await ev(() => {
      localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data;
      const a = amCreate(s, { name: 'Old Save Pro', look: PRESET_LOOKS[8], number: 4, style: 'slasher', seed: 91 });
      const jump = typeof devJumpToPro === 'function'; /* (builds with the dev jump: it answers the summers, tryouts, Signing Day and the transfer portal; the plain loop below re-enrolls a portal player as a freshman every year) */
      let guard = 0; while (!jump && a.stage !== 'combine' && guard++ < 600) { a.events.length = 0; if (a.decision) { if (a.decision.kind === 'declare') amDeclare(a, true); else if (a.decision.signing) recSimSign(a); else amChooseCollege(a, a.decision.offers[0]); continue; } if (!amSimGame(a)) break; }
      if (jump) { const J = devJumpToPro(g, 91); if (!J.ok) return { err: 'jump: ' + J.msg }; }
      else if (a.stage !== 'combine') return { err: 'no combine: ' + a.stage };
      if (!s.career) createCareerFromAmateur(s, a); const c = s.career; if (c.me.staff && c.me.staff.shooting != null) { c.me.staff.shooting = 2; c.me.staff.physio = 1; c.me.money = Math.max(c.me.money, 2e6); } /* the old four staff roles (R7 migrates them) */ for (let i = 0; i < 6; i++) { if (c.events) c.events.length = 0; if (!simUserGame(s)) break; }
      g.save.save(); return { raw: localStorage.getItem(CONFIG.save.key), season: c.season, week: c.week, phase: c.phase, age: (c.players[c.meId] || {}).age };
    });
    if (!pro.err && tag === 'r7') { const d = JSON.parse(pro.raw), M = d.career.me; M.hype = 6.5; M.rivalFire = 2; M.boast = true; pro.raw = JSON.stringify(d); } // R8: hype 0–10, a trash-talked rival, a confident answer waiting on the next game
    if (!pro.err && tag === 'r8') { const d = JSON.parse(pro.raw), c = d.career; c.events = (c.events || []).filter(e => e.kind !== 'press'); c.events.unshift({ kind: 'trade', title: 'UNHAPPY', why: 'bench', lines: ['You have watched 4 of the 6 games from the bench.', 'Your agent can ask for a trade: to a club that starts you, your contract comes with you.', 'Or stay and fight for it.'] }); pro.raw = JSON.stringify(d); } // R9: a trade request from before dialogue boxes
    if (pro.err) console.log(tag, 'pro FAILED', pro.err); else { fs.writeFileSync(path.join(OUT, 'save_' + tag + '_pro_midseason.json'), pro.raw); console.log(tag, 'pro', JSON.stringify({ season: pro.season, week: pro.week, phase: pro.phase, age: pro.age, bytes: pro.raw.length })); }
    // 2b) R5 only: a college career three games into its first season (the old college league)
    if (tag === 'r5') { const col = await ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data; const a = amCreate(s, { name: 'Old Save College', look: PRESET_LOOKS[2], number: 12, style: 'slasher', seed: 133 });
        let guard = 0; while (!(a.stage === 'college' && a.league && a.league.week >= 3) && guard++ < 600) { a.events.length = 0; if (a.decision) { if (a.decision.kind === 'declare') amDeclare(a, false); else if (a.decision.signing) recSimSign(a); else amChooseCollege(a, a.decision.offers[0]); continue; } if (!amSimGame(a)) break; }
        g.save.save(); return { raw: localStorage.getItem(CONFIG.save.key), stage: a.stage, week: a.league && a.league.week, season: a.season, v: a.v }; });
      if (col.stage !== 'college') console.log(tag, 'college NOT REACHED: ' + col.stage); else { fs.writeFileSync(path.join(OUT, 'save_' + tag + '_college_midseason.json'), col.raw); console.log(tag, 'college', JSON.stringify({ season: col.season, week: col.week, v: col.v, bytes: col.raw.length })); } }
    // 2c) R10 only: an amateur career that has declared and waits at the pro combine (R10 drafted next; F7 has three franchises make offers)
    if (tag === 'r10') { const cmb = await ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data; const a = amCreate(s, { name: 'Old Save Prospect', look: PRESET_LOOKS[6], number: 30, style: 'slasher', seed: 91 }); /* a seed that declares after one college season (205 loops in R10's transfer portal) */
        let guard = 0; while (a.stage !== 'combine' && guard++ < 600) { a.events.length = 0; if (a.decision) { if (a.decision.kind === 'declare') amDeclare(a, true); else if (a.decision.signing) recSimSign(a); else amChooseCollege(a, a.decision.offers[0]); continue; } if (!amSimGame(a)) break; }
        g.save.save(); return { raw: localStorage.getItem(CONFIG.save.key), stage: a.stage, season: a.season, age: a.age }; });
      if (cmb.stage !== 'combine') console.log(tag, 'combine NOT REACHED: ' + cmb.stage); else { fs.writeFileSync(path.join(OUT, 'save_' + tag + '_amateur_combine.json'), cmb.raw); console.log(tag, 'combine', JSON.stringify({ season: cmb.season, age: cmb.age, bytes: cmb.raw.length })); } }
    // 3) M7 only: the same pro career in the playoffs, then in the offseason
    if (tag === 'm7' || tag === 'r2' || tag === 'r6' || tag === 'w4') for (const want of ['playoffs', 'offseason']) { /* (2.1 W5: the W4 build's twelve-franchise PBL, before the sixteen) */
      const r = await ev(want => { const g = HH.game; const s = g.save.data, c = s.career; let n = 0; if (want === 'playoffs') { const me = c.players[c.meId]; for (const k in me.r) me.r[k] = Math.max(me.r[k], 92); } /* good enough to make the playoffs */ while (c.phase !== want && n++ < 80) { if (c.events) c.events.length = 0; if (!simUserGame(s)) break; } g.save.save(); return { raw: localStorage.getItem(CONFIG.save.key), phase: c.phase, season: c.season, week: c.week }; }, want);
      if (r.phase !== want) { console.log(tag, want, 'NOT REACHED: ' + r.phase); continue; } fs.writeFileSync(path.join(OUT, 'save_' + tag + '_pro_' + want + '.json'), r.raw); console.log(tag, want, JSON.stringify({ phase: r.phase, season: r.season, week: r.week, bytes: r.raw.length }));
    }
    console.log(tag, 'page errors:', errors.length ? errors.slice(0, 5).join(' | ') : 'none'); await ctx.close();
  }
  await browser.close();
})();
