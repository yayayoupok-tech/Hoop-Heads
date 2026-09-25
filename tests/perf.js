// Performance: CPU time per frame at phone size (844×390, DPR 2, touch) in the pro arena, measured by timing back-to-back
// frames of a live AI-vs-AI match (each frame advances 1/60 s). A 1-pixel readback after each frame forces the canvas to
// rasterize inside the timing. Each performance-guard level is measured separately (0 = everything on; 1 = crowd at 15 Hz
// and fewer particles; 2 = also no floor reflections; 3 = also no bloom or beam dust), at 1× and 4× CPU throttling (about a
// mid-range phone). Then real frames run for a few seconds at 4× to check that the guard engages by itself.
// Usage: node tests/perf.js [frames=300]
const { launch, openPage } = require('./lib');
(async () => {
  const frames = +(process.argv[2] || 300); const browser = await launch(); const rows = []; let engaged = null;
  for (const throttle of [1, 4]) {
    const P = await openPage(browser, { phone: true, wait: 800 });
    if (throttle > 1) { const cdp = await P.context.newCDPSession(P.page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle }); }
    await P.ev(() => { const g = HH.game; g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 21 }, court: 'arena', seed: 3, controlMode: 'lock' }, { kind: 'quick' }); for (const p of g.match.players) p.controlled = false; });
    await P.page.waitForTimeout(1200);
    for (const level of [0, 1, 2, 3]) {
      const n = throttle > 1 ? Math.max(60, Math.round(frames / 3)) : frames;
      const r = await P.ev(([n, level]) => { const g = HH.game; g.guard.force = level; let now = g.last + 16.667; const pf = []; for (let i = 0; i < n; i++) { for (const p of g.match.players) p.controlled = false; const t0 = performance.now(); g.frameBody(now); g.ctx.getImageData(0, 0, 1, 1); pf.push(performance.now() - t0); now += 16.667; } const a = pf.slice(10).sort((x, y) => x - y); const q = f => a[Math.min(a.length - 1, Math.floor(a.length * f))]; return { frames: a.length, med: q(0.5), p95: q(0.95), max: a[a.length - 1], level: g.guard.level, court: g.match.courtId, dpr: g.dpr }; }, [n, level]);
      r.throttle = throttle; rows.push(r);
    }
    if (throttle > 1) { // real frames: release the pin and let the page run for a while
      await P.ev(() => { const g = HH.game; g.guard.force = null; g.guard.lock = false; g.guard.level = 0; g.guard.slowT = 0; }); await P.page.waitForTimeout(8000);
      engaged = await P.ev(() => ({ level: HH.game.guard.level, avg: HH.game.guard.avg }));
    }
    await P.context.close();
  }
  for (const r of rows) console.log('844×390 @' + r.dpr + 'x · ' + r.court + ' · CPU ' + r.throttle + '× · guard level ' + r.level + ' · ' + r.frames + ' frames · median ' + r.med.toFixed(1) + ' ms · p95 ' + r.p95.toFixed(1) + ' ms · max ' + r.max.toFixed(1) + ' ms');
  if (engaged) console.log('real frames at 4×: average interval ' + engaged.avg.toFixed(1) + ' ms → the guard went to level ' + engaged.level + (engaged.level > 0 ? ' (engaged)' : ' (did not engage)'));
  console.log('budget: 16.7 ms per frame for 60 fps (headless Chromium renders canvas on the CPU, so these are CPU costs, not a real phone)');
  await browser.close();
})();
