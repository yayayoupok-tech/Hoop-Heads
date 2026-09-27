// Match HUD text audit (F4, the user: "text overlaps, so we can't read other stuff"): opens match scenes at several window
// sizes (desktop, a square retina panel, 1080p, a phone) and flags any two different strings of the HUD whose ink boxes
// overlap: the score bug, callouts (two at once), the key hints, the dribble-picked-up line, the 3-point contest strip,
// the tutorial panel, the pregame stamp and the replay stamp. Usage: node tests/hudaudit.js [shotsDir]
const path = require('path'), fs = require('fs'); const { launch, openPage } = require('./lib');
const SIZES = [['1280x720', { viewport: { width: 1280, height: 720 } }], ['1000x1000@2', { viewport: { width: 1000, height: 1000 }, dpr: 2 }], ['1920x1080', { viewport: { width: 1920, height: 1080 } }], ['1366x768', { viewport: { width: 1366, height: 768 } }], ['phone', { phone: true }]];
(async () => {
  const dir = process.argv[2]; if (dir) fs.mkdirSync(dir, { recursive: true }); const browser = await launch(); let flags = 0, n = 0;
  for (const [label, o] of SIZES) {
    const P = await openPage(browser, Object.assign({ wait: 700 }, o)); const { ev } = P;
    await ev(() => { window.__hud = () => { const g = HH.game; RBF.boxes = []; try { g.drawHUD(g.ctx, g.match, 1, 0); } catch (e) { /* audit draw */ } const raw = RBF.boxes || []; RBF.boxes = null; const B = [];
      for (const b of raw) { if (!String(b.t).trim() || b.a < 0.35 || b.w < 1) continue; if (B.some(a => a.t === b.t && Math.abs(a.x - b.x) <= 4 * b.s && Math.abs(a.y - b.y) <= 4 * b.s)) continue; B.push(b); }
      const out = []; for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], b = B[j]; if (a.t === b.t) continue; const px = Math.max(a.s, b.s), ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); if (ix > px && iy > px) out.push('"' + String(a.t).slice(0, 26) + '" × "' + String(b.t).slice(0, 26) + '"'); }
      return { out, n: B.length }; }; });
    const scenes = [
      ['quick-live', () => { const g = HH.game; g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 21 }, court: 'arena', seed: 3, controlMode: 'lock' }, { kind: 'quick' }); const m = g.match; for (let i = 0; i < 120 * 4; i++) simStep(m, STEP); }],
      ['callouts', () => { const m = HH.game.match; pushCallout(m, 'GREEN', CALLOUT.make); pushCallout(m, 'MONEY BALL', CALLOUT.make, true); pushCallout(m, 'SPLASH', CALLOUT.make); for (const c of m.callouts) c.t = 0.5; }],
      ['picked-up', () => { const g = HH.game, m = g.match, me = m.controlledPlayer; m.giveBall(me, true); me.pickedUp = true; m.callouts.length = 0; }],
      ['pregame', () => { const g = HH.game; g.quitToMenu(); g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[2]), teamWithRoster(TEAMS[5])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 21 }, court: 'legends', seed: 4, controlMode: 'lock' }, { kind: 'quick' }); pushCallout(g.match, 'TIP-OFF', CALLOUT.make, true); }],
      ['contest', () => { const g = HH.game; g.quitToMenu(); const a = soloTeam(extrasPool(g)[0], false); g.startMatch({ mode: '1v1', teams: [a, Object.assign({}, a)], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 999 }, court: 'arena', seed: 5, controlMode: 'ball', contest3: {} }, { kind: 'contest3' }); pushCallout(g.match, 'GREEN', CALLOUT.make); pushCallout(g.match, 'MONEY BALL', CALLOUT.make, true); }],
      ['contest-started', () => { const m = HH.game.match; m.contest3.started = true; }],
      ['tutorial', () => { const g = HH.game; g.quitToMenu(); g.startTutorial(); }],
    ];
    for (const [name, fn] of scenes) { n++; try { await ev(fn); } catch (e) { console.log('ERROR ' + label + ' ' + name + ': ' + e.message.split('\n')[0]); flags++; continue; } await P.page.waitForTimeout(250); const r = await ev(() => window.__hud()); if (dir) await P.shot(path.join(dir, label.replace(/[@x]/g, '_') + '-' + name + '.jpg')); if (r.out.length) flags++; console.log((r.out.length ? 'FLAG  ' : 'ok    ') + label + ' ' + name + ' (' + r.n + ' strings)' + (r.out.length ? ': ' + r.out.slice(0, 8).join(' | ') : '')); }
    const fx = await P.frameErrors(); if (P.errors.length || fx.length) { console.log('ERRORS ' + label + ': ' + P.errors.concat(fx).slice(0, 3).join(' | ')); flags++; }
    await P.context.close();
  }
  console.log('hud audit: ' + n + ' scenes, ' + flags + ' flagged'); await browser.close(); process.exit(flags ? 1 : 0);
})();
