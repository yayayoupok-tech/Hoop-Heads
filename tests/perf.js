// Performance: CPU time per frame at phone size (844×390, DPR 2, touch) in the pro arena with the full crowd, measured by
// timing back-to-back frames of a live AI-vs-AI match (each frame advances 1/60 s). Also runs with 4× CPU throttling to
// approximate a mid-range phone. A 1-pixel readback after each frame forces the canvas to rasterize inside the timing. Usage: node tests/perf.js [frames=600]
const { launch, openPage } = require('./lib');
(async () => {
  const frames = +(process.argv[2] || 600); const browser = await launch(); const results = [];
  for (const throttle of [1, 4]) {
    const P = await openPage(browser, { phone: true, wait: 800 });
    if (throttle > 1) { const cdp = await P.context.newCDPSession(P.page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle }); }
    await P.ev(() => { const g = HH.game; const court = COURTS.pro ? 'pro' : 'arena'; g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 99 }, court, seed: 3, controlMode: 'lock' }, { kind: 'quick' }); for (const p of g.match.players) p.controlled = false; });
    await P.page.waitForTimeout(1200);
    const r = await P.ev(frames => { const g = HH.game; let now = g.last + 16.667; const pf = []; for (let i = 0; i < frames; i++) { const t0 = performance.now(); g.frameBody(now); g.ctx.getImageData(0, 0, 1, 1); pf.push(performance.now() - t0); now += 16.667; } const a = pf.slice(20).sort((x, y) => x - y); const q = f => a[Math.min(a.length - 1, Math.floor(a.length * f))]; return { frames: a.length, med: q(0.5), p95: q(0.95), max: a[a.length - 1], degraded: HH.game.perf.degraded, court: HH.game.match.courtId, dpr: HH.game.dpr }; }, frames);
    r.throttle = throttle; r.errors = P.errors.length; results.push(r); await P.context.close();
  }
  for (const r of results) console.log('844×390 @' + r.dpr + 'x · ' + r.court + ' · CPU throttle ' + r.throttle + '× · frames ' + r.frames + ' · frame cost median ' + r.med.toFixed(2) + ' ms · p95 ' + r.p95.toFixed(2) + ' ms · max ' + r.max.toFixed(1) + ' ms · quality guard ' + (r.degraded ? 'engaged' : 'off') + (r.errors ? ' · ERRORS ' + r.errors : ''));
  console.log('budget: 16.7 ms per frame for 60 fps (headless Chromium renders canvas on the CPU, so these are CPU costs, not a real phone)');
  await browser.close();
})();
