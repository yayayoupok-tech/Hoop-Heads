// Match reel: plays a real bot-vs-bot 1v1 with rendering on and saves a screenshot the first time each key animation
// shows up (dribble, crossover, spin, step-back, jump shot follow-through, dunk, rim hang, block, landing, celebration,
// stumble, defensive slide). Usage: node tests/reel.js <milestone> <round> [court=arena] [seconds=240]
const path = require('path'), fs = require('fs');
const { ROOT, launch, openPage } = require('./lib');
const MOMENTS = [
  ['dribble', 'p.hasBall && p.state === "move" && Math.abs(p.vx) > 3 && p.grounded'],
  ['crossover', 'p.state === "crossover" && p.stateT > 0.1'],
  ['spin', 'p.state === "spin" && p.stateT > 0.12'],
  ['stepback', 'p.state === "stepback" && p.stateT > 0.08'],
  ['jumpshot-release', 'p.state === "jumpshot" && p.sd.released && p.stateT - (p.sd.relT || 0) > 0.05'],
  ['layup', 'p.state === "layup" && p.stateT > 0.12'],
  ['dunk', 'p.state === "dunk" && p.stateT > 0.04'],
  ['rimhang', 'p.state === "rimhang" && p.stateT > 0.12'],
  ['block', '(p.state === "jump" || p.state === "fall") && !p.hasBall && p.anim.rigClip === "block" && p.stateT > 0.12'],
  ['land', 'p.state === "land" && p.stateT > 0.03'],
  ['celebrate', 'p.state === "celebrate" && p.stateT > 0.35'],
  ['stumble', '(p.state === "stumble" || p.state === "knocked") && p.stateT > 0.3'],
  ['slide', 'p.anim.rigClip === "slide" && Math.abs(p.vx) > 1.2'],
];
(async () => {
  const milestone = process.argv[2] || 'reel', round = process.argv[3] || '1', court = process.argv[4] || 'arena', seconds = +(process.argv[5] || 240);
  const out = path.join(ROOT, 'shots', milestone, 'round-' + round); fs.mkdirSync(out, { recursive: true });
  const browser = await launch(); const P = await openPage(browser, { wait: 800 }); const { page, ev } = P;
  await ev(court => { const g = HH.game; g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 21 }, court, seed: 9, controlMode: 'lock' }, { kind: 'quick' }); for (const p of g.match.players) p.controlled = false; }, court);
  await page.waitForTimeout(600);
  const got = new Set(); let n = 0;
  await ev(M => { window.__reelConds = M.map(([name, cond]) => [name, new Function('p', 'return ' + cond)]); window.__reelGot = {}; }, MOMENTS);
  for (let frames = 0; frames < seconds * 60 && got.size < MOMENTS.length;) {
    // run frames (sim + render, 60 per second of match time) until one of the moments shows up, then screenshot it
    const r = await ev(() => { const g = HH.game, m = g.match; if (!m) return { k: 1e9 }; let k = 0; g.paused = false; g.last = performance.now(); // run on a synthetic 60 fps clock; pause on a hit so the page loop can't move on before the screenshot
      for (; k < 900; k++) { for (const p of m.players) p.controlled = false; const now = g.last + 1000 / 60; g.frameBody(now);
        for (const [name, fn] of window.__reelConds) { if (window.__reelGot[name]) continue; for (const p of m.players) { let ok = false; try { ok = fn(p); } catch (e) { ok = false; } if (ok) { window.__reelGot[name] = 1; g.paused = true; return { k: k + 1, hit: name }; } } } }
      return { k }; });
    frames += r.k; if (r.hit) { await P.shot(path.join(out, 'reel-' + String(++n).padStart(2, '0') + '-' + r.hit + '.jpg')); got.add(r.hit); }
  }
  const errs = P.errors.concat((await P.frameErrors()).map(e => '[frame] ' + e));
  console.log('saved ' + n + ' reel shots to ' + path.relative(ROOT, out) + ' · missing: ' + (MOMENTS.map(m => m[0]).filter(k => !got.has(k)).join(', ') || 'none'));
  console.log(errs.length ? 'ERRORS:\n  ' + errs.join('\n  ') : 'no errors');
  await browser.close(); process.exitCode = errs.length ? 1 : 0;
})();
