// Old-save fixtures (M9): runs older builds straight from git history (before M0, M0, M5 and M7) and saves what they
// write: a high-school career in its second season with a classic team league on the side, and a pro career in the middle
// of its first season (for M7 also one in the playoffs and one in the offseason). tests/oldsaves.js then loads each one in
// this build and plays on. Needs the git history. Usage: node tests/gen_oldsaves.js [outDir]  (default tests/fixtures/)
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const { ROOT, launch } = require('./lib');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'tests', 'fixtures')), TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'hoopheads-old-')); fs.mkdirSync(OUT, { recursive: true });
const BUILDS = [['d3c2eae', 'premerge'], ['f9d991e', 'm0'], ['38b2c05', 'm5'], ['6cfa017', 'm7']];
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
      let guard = 0; while ((a.season || 1) < 2 && guard++ < 400) { a.events.length = 0; if (a.decision) { if (a.decision.kind === 'declare') amDeclare(a, false); else amChooseCollege(a, a.decision.offers[0]); continue; } if (!amSimGame(a)) break; }
      for (let i = 0; i < 3; i++) { a.events.length = 0; amSimGame(a); }
      const player = { name: 'Old Team Guy', nick: 'Old', arch: 'slasher', height: 1.93, attrs: { sho: 4, fin: 6, han: 5, spd: 5, jmp: 5, def: 4, str: 3 }, look: Object.assign({}, PRESET_LOOKS[3], { number: 9, sleeves: false, shoes: null }), moves: { crossover: true, spin: false, stepback: false, hesitation: false, euro: false, dunk360: false, windmill: false } };
      const tc = tcCreateCareer(s, player, TEAMS[2].id, '3v3');
      for (let i = 0; i < 2; i++) { const L = tc.league; const gm = tcUserGame(tc); if (!gm) break; const opts = tcMatchOptsFor(tc, s, gm, false); const r = simulateMatch(Object.assign({}, opts, { humanTeam: -1 }), { render: false }); tcAfterGame(s, r, 0); }
      g.save.save(); return { raw: localStorage.getItem(CONFIG.save.key), season: a.season, stage: a.stage, games: (a.totals || {}).g, tcGames: tc.results.length };
    });
    fs.writeFileSync(path.join(OUT, 'save_' + tag + '_highschool_teamleague.json'), hs.raw); console.log(tag, 'high school', JSON.stringify({ season: hs.season, stage: hs.stage, games: hs.games, tcGames: hs.tcGames, bytes: hs.raw.length }));
    // 2) the amateur career played through to the pros, then half a pro season
    const pro = await ev(() => {
      localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const s = g.save.data;
      const a = amCreate(s, { name: 'Old Save Pro', look: PRESET_LOOKS[8], number: 4, style: 'slasher', seed: 91 });
      let guard = 0; while (a.stage !== 'combine' && guard++ < 600) { a.events.length = 0; if (a.decision) { if (a.decision.kind === 'declare') amDeclare(a, true); else amChooseCollege(a, a.decision.offers[0]); continue; } if (!amSimGame(a)) break; }
      if (a.stage !== 'combine') return { err: 'no combine: ' + a.stage };
      createCareerFromAmateur(s, a); const c = s.career; for (let i = 0; i < 6; i++) { if (c.events) c.events.length = 0; if (!simUserGame(s)) break; }
      g.save.save(); return { raw: localStorage.getItem(CONFIG.save.key), season: c.season, week: c.week, phase: c.phase };
    });
    if (pro.err) console.log(tag, 'pro FAILED', pro.err); else { fs.writeFileSync(path.join(OUT, 'save_' + tag + '_pro_midseason.json'), pro.raw); console.log(tag, 'pro', JSON.stringify({ season: pro.season, week: pro.week, phase: pro.phase, bytes: pro.raw.length })); }
    // 3) M7 only: the same pro career in the playoffs, then in the offseason
    if (tag === 'm7') for (const want of ['playoffs', 'offseason']) {
      const r = await ev(want => { const g = HH.game; const s = g.save.data, c = s.career; let n = 0; if (want === 'playoffs') { const me = c.players[c.meId]; for (const k in me.r) me.r[k] = Math.max(me.r[k], 92); } /* good enough to make the playoffs */ while (c.phase !== want && n++ < 80) { if (c.events) c.events.length = 0; if (!simUserGame(s)) break; } g.save.save(); return { raw: localStorage.getItem(CONFIG.save.key), phase: c.phase, season: c.season, week: c.week }; }, want);
      if (r.phase !== want) { console.log(tag, want, 'NOT REACHED: ' + r.phase); continue; } fs.writeFileSync(path.join(OUT, 'save_' + tag + '_pro_' + want + '.json'), r.raw); console.log(tag, want, JSON.stringify({ phase: r.phase, season: r.season, week: r.week, bytes: r.raw.length }));
    }
    console.log(tag, 'page errors:', errors.length ? errors.slice(0, 5).join(' | ') : 'none'); await ctx.close();
  }
  await browser.close();
})();
