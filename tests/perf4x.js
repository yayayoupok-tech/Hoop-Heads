// 2.0 §1.2 performance at 4× CPU throttling (about a mid-range phone): a live pro-arena 1v1, AI against AI, with 5
// forced dunks (each followed by its celebration: the made basket, the crowd, the callouts) and 3 forced blocks. Every
// frame is timed back to back (a 1-pixel readback makes the canvas rasterize inside the timing). It reports the median,
// p95 and max frame time over the whole run, and the max inside the dunk and block windows.
// Two clocks:
//   device: frames run as on a phone's 60 Hz screen: a frame that takes 20 ms shows on the second vsync, so the game
//           sees 33.3 ms go by and advances by that, and the frame guard and the pixel guard see the slow frames and
//           shed cost. The CPU is slow before the match opens, so the run also times how fast the frame guard reacts
//           once the match's opening bakes are past and its frames run slow (§1.2: "within 0.5 s"): from its frame
//           average going over CONFIG.perf.slowFrameMs (a spell that ends, back under fastFrameMs, starts over). Pass/fail.
//   fixed:  every frame advances exactly 1/60 s: the guards see 60 fps and never shed, so this is full quality on a
//           slow CPU (reported, not a pass condition).
// Targets: median ≤ 25 ms; no frame over 50 ms during dunks, blocks or celebrations; the frame guard sheds within 0.5 s
// of its frame average running slow (over CONFIG.perf.slowFrameMs).
// Usage: node tests/perf4x.js [--phone-only] [--desktop-only] [--rate=4] [--clock=device|fixed|both]
const { launch, openPage } = require('./lib');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const rate = +arg('rate', 4), clocks = arg('clock', 'both') === 'both' ? ['device', 'fixed'] : [arg('clock')];
const sizes = [['phone 844×390 @2x', { phone: true }], ['desktop 1280×720', {}]].filter(([l]) => !(process.argv.includes('--phone-only') && !/phone/.test(l)) && !(process.argv.includes('--desktop-only') && !/desktop/.test(l)));
(async () => {
  const b = await launch(); let fails = 0; const lines = [];
  for (const [label, o] of sizes) for (const clock of clocks) {
    const P = await openPage(b, Object.assign({ wait: 800 }, o));
    const cdp = await P.context.newCDPSession(P.page); await cdp.send('Emulation.setCPUThrottlingRate', { rate }); // the phone is slow from the start: the match opens (and bakes) at this speed
    const r = await P.ev(device => {
      const g = HH.game, G0 = g.guard; G0.level = 0; G0.slowT = G0.fastT = 0; G0.avg = 16.7; G0.sticky = false; G0.restoredAt = 0; // the guard as on a phone whose menus kept up: the match is where it slows
      g.startMatch({ mode: '1v1', teams: [teamWithRoster(TEAMS[0]), teamWithRoster(TEAMS[1])], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 99 }, court: 'arena', seed: 5, controlMode: 'ball' }, { kind: 'quick' });
      const m = g.match, F = { all: [], dunk: [], block: [], plain: [] }, log = [], G = g.guard, hold = CONFIG.perf.holdSeconds || 0;
      let now = performance.now(), held = null, slowAt = null; const react = { guard: null, pixel: null, slow: null }; let maxG = 0, maxP = 0; // held: when the guard's opening hold ran out (the match's bakes take a few seconds at 4×); slowAt: when its frame average first ran slow
      const frame = tag => { for (const p of m.players) p.controlled = false; const a = performance.now(); g.frameBody(now); g.ctx.getImageData(0, 0, 1, 1); const ms = performance.now() - a; now += device ? Math.max(1, Math.ceil(ms / 16.667)) * 16.667 : 16.667; // (device: the next vsync after the frame's work)
        F.all.push(ms); F[tag].push(ms); if (held == null && !(G.holdT > 0)) held = now; const el = held == null ? 0 : (now - held) / 1000; if (G.level > 0 && react.guard == null) { react.guard = el; react.slow = slowAt == null ? 0 : (now - slowAt) / 1000; } /* (first: a shed restarts the guard's average, which would read as the spell ending) */ if (held != null && react.guard == null) { if (slowAt == null && G.avg > CONFIG.perf.slowFrameMs) slowAt = now; else if (slowAt != null && !(G.slowT > 0) && !(G.avg > CONFIG.perf.slowFrameMs)) slowAt = null; } /* a slow spell the guard saw end (it counts slow time from the average going over slowFrameMs until it is back under fastFrameMs) starts over */ if (RT.level > 0 && react.pixel == null) react.pixel = el; maxG = Math.max(maxG, G.level); maxP = Math.max(maxP, RT.level); return ms; };
      const waitLive = () => { for (let i = 0; i < 900; i++) { if (m.phase === 'live' && m.ball.owner && m.ball.owner.grounded && !m.ball.owner.busy) return true; frame('plain'); } return false; };
      for (let i = 0; i < 150; i++) frame('plain'); // warm-up: the guards settle; the sprites, the faces and the crowd at speed
      const settled = { guard: G.level, pixel: RT.level }; F.all.length = 0; F.plain.length = 0;
      let dunks = 0, blocks = 0;
      for (let k = 0; k < 5; k++) { // a dunk: the ball handler right at the rim, running at it (a setup the play didn't take, e.g. a handler caught mid-move, is tried again: at most 3 times)
        let seen = false, why = ''; for (let tries = 0; tries < 3 && !seen; tries++) { if (!waitLive()) { why = 'never live'; continue; } const p = m.ball.owner, d = m.opponentsOf(p)[0], hoop = p.hoop, dir = sgn(hoop.x - p.x) || 1;
          p.attrs.jmp = Math.max(p.attrs.jmp, 9); p.setState('move'); p.x = hoop.x - dir * SH.dunkRange * 0.75; p.vx = dir * SH.dunkMinSpeed * 2; p.grounded = true; p.y = 0; d.x = hoop.x - dir * 6; d.vx = 0; // (the layout scales the dunk range)
          startShot(p); if (p.state === 'gather' && p.sd && p.sd.type === 'dunk') launchShotJump(p); /* straight off the floor (an AI hand on the button could fake) */ for (let i = 0; i < 200; i++) { frame('dunk'); if (p.state === 'dunk') seen = true; } if (!seen) why = p.state; }
        if (seen) dunks++; else log.push('dunk ' + k + ': ' + why);
      }
      for (let k = 0; k < 3; k++) { // a block: a jumper in flight, swatted
        if (!waitLive()) { log.push('block ' + k + ': never live'); continue; } const p = m.ball.owner, d = m.opponentsOf(p)[0], hoop = p.hoop, dir = sgn(hoop.x - p.x) || 1;
        p.x = hoop.x - dir * 4.5; p.vx = 0; p.grounded = true; p.y = 0; p.setState('move'); d.x = hoop.x - dir * 6.5; startShot(p); if (p.state === 'gather') launchShotJump(p);
        let done = false; for (let i = 0; i < 150 && !done; i++) { frame('block'); if (p.state === 'jumpshot' && p.hasBall && p.stateT > 0.25) releaseShot(p, 0, true); const s = m.ball.shot; if (s && !s.resolved && !m.ball.owner && m.ball.y > 2.4) { d.x = m.ball.x - dir * 0.3; d.z = m.ball.z; d.y = 1; d.grounded = false; d.setState('jump'); doBlock(m, d, p); done = true; } }
        if (done) blocks++; else log.push('block ' + k + ': no flight'); for (let i = 0; i < 150; i++) frame('block');
      }
      for (let i = 0; i < 240; i++) frame('plain'); // plain play after
      const st = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? { n: s.length, med: s[Math.floor(s.length / 2)], p95: s[Math.min(s.length - 1, Math.floor(s.length * 0.95))], max: s[s.length - 1], over50: s.filter(x => x > 50).length } : null; };
      return { all: st(F.all), dunk: st(F.dunk), block: st(F.block), plain: st(F.plain), dunks, blocks, log, react, hold, settled, guard: G.level, pixel: RT.level, maxG, maxP, W: g.canvas.width, H: g.canvas.height, rows: RT.H };
    }, clock === 'device').catch(e => ({ err: String(e.message || e).split('\n')[0] }));
    await P.context.close();
    const name = label + ', ' + clock + ' clock';
    if (r.err) { lines.push('FAIL ' + name + ': ' + r.err); fails++; continue; }
    const f = s => s ? 'median ' + s.med.toFixed(1) + ' · p95 ' + s.p95.toFixed(1) + ' · max ' + s.max.toFixed(1) + ' ms' + (s.over50 ? ' · ' + s.over50 + ' over 50' : '') + ' (' + s.n + ' frames)' : '—';
    const worst = Math.max(r.dunk ? r.dunk.max : 0, r.block ? r.block.max : 0), reactOk = r.react.guard != null && r.react.slow <= 0.5; // §1.2: the frame guard, once the match's opening bakes are past (the pixel guard sheds on its own budget, and follows the frame guard's level)
    const ok = r.all.med <= 25 && worst <= 50 && r.dunks === 5 && r.blocks === 3 && (clock === 'fixed' || reactOk);
    if (!ok && clock === 'device') fails++;
    lines.push((clock === 'fixed' ? 'info ' : ok ? 'PASS ' : 'FAIL ') + name + ' at ' + rate + '× CPU (' + r.W + '×' + r.H + ' px, ' + r.rows + ' world rows): ' + r.dunks + ' dunks, ' + r.blocks + ' blocks' + (r.log.length ? ' (' + r.log.join('; ') + ')' : ''));
    if (clock === 'device') lines.push('     the guards: frame guard first sheds ' + (r.react.guard == null ? 'never' : r.react.slow.toFixed(2) + ' s after the frames ran slow (' + r.react.guard.toFixed(2) + ' s after its opening hold of ' + r.hold + ' s: the bakes it ignores)') + ', pixel guard ' + (r.react.pixel == null ? 'never' : r.react.pixel.toFixed(2) + ' s after it') + ' · settled at levels ' + r.settled.guard + ' / ' + r.settled.pixel + ', at most ' + r.maxG + ' / ' + r.maxP + ', ending ' + r.guard + ' / ' + r.pixel);
    else lines.push('     the guards held at 0 (they see 60 fps): full quality');
    lines.push('     every frame    ' + f(r.all)); lines.push('     plain play     ' + f(r.plain)); lines.push('     dunks + celebrations ' + f(r.dunk)); lines.push('     blocks         ' + f(r.block));
  }
  for (const l of lines) console.log(l);
  console.log('targets: median ≤ 25 ms; no frame over 50 ms during dunks, blocks or celebrations; the frame guard sheds within 0.5 s (device clock) · headless Chromium paints canvas on the CPU');
  await b.close(); process.exit(fails ? 1 : 0);
})();
