// 2.0 must-fix bugs (§1) that need a page: one step per bug. node tests/fixes.js  (ONLY=<regex> runs matching steps)
const { launch, openPage, runner } = require('./lib');

// §1.3: nothing covers the player in the 3-Point Contest or the tryout shootout. The known-good frame is the same frame
// drawn without the racks; the player's area is the inside of the player's own opaque pixels (their sprite, less its outer edge). Pixels that change between
// two identical renders (the crowd's own animation) are left out.
async function racksStep(R, P, label) {
  for (const gfx of ['retro', 'smooth']) for (const kind of ['contest', 'tryout']) {
    await R.step('3-point racks never cover the player (' + kind + ', ' + gfx + ', ' + label + ')', async () => {
      const r = await P.ev(([kind, gfx]) => {
        localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); g.save.data.settings.graphics = gfx;
        if (kind === 'contest') { g.ui.clearTo(mainMenu(g)); g.ui.push(threePointScreen(g)); g.ui.screen.widgets[0].onPress(); }
        else { const a = amCreate(g.save.data, { name: 'Rack Check', look: PRESET_LOOKS[5], number: 3, style: 'shooter', seed: 4242 }); a.events.length = 0; g.save.save(); startTryoutDrill(g); }
        const m = g.match; if (!m || !m.contest3) return { err: 'no contest match' };
        for (let i = 0; i < 900 && !(m.human.hasBall && m.human.grounded && contest3AtRack(m, 0.3)); i++) simStep(m, STEP);
        if (!m.human.hasBall) return { err: 'the shooter never got a ball at the rack' };
        const c = g.ctx, W = c.canvas.width, H = c.canvas.height, saved = g.drawRacks, lvl = RT.level;
        // every grab renders the same instant; the retro guard's level is held and the face cache warmed first, so only the racks differ.
        // Your-player markers are off: the arrow over the head bobs on the wall clock, so it moves between two grabs
        m.human.controlled = false; for (const p of m.players) p.controlled = false;
        const grab = (racks, hide) => { c.setTransform(g.dpr, 0, 0, g.dpr, 0, 0); RT.level = lvl; RT.over = RT.under = RT.overT = RT.underT = 0; if (!racks) g.drawRacks = () => {}; m.human.hidden = hide; try { g.renderSceneAny(c, m, 1, 0); } finally { g.drawRacks = saved; m.human.hidden = false; } return c.getImageData(0, 0, W, H).data; };
        for (let i = 0; i < 400 && faceWarmTick() > 0; i++); for (let i = 0; i < 4; i++) { grab(true, false); grab(false, true); }
        // V14 (#127): the grabs and the player's own draw happen at one frozen wall-clock instant. Hanging hair strands run a
        // verlet sim on performance.now() (and the held ball eases on it); under load its 50 ms step clamp can flip the strands
        // between two poses on alternate renders, which lined up with the A-C-A-C-A order below as a false "rack" (1 run in ~5)
        const realNow = performance.now, T0 = realNow.call(performance); performance.now = () => T0;
        let A1, rec, C, A2, C2, A3; const own = new Uint8Array(W * H);
        try {
        A1 = grab(false, false); rec = gfx === 'smooth' ? null : RT.last.get(m.human); C = grab(true, false); A2 = grab(false, false); C2 = grab(true, false); A3 = grab(false, false);
        // the player's own pixels: the retro sprite's opaque pixels, or the player drawn alone on a clear canvas (smooth)
        if (rec) { const sc = document.createElement('canvas'); sc.width = rec.spr.width; sc.height = rec.spr.height; const sg = sc.getContext('2d'); sg.drawImage(rec.spr, 0, 0); const d = sg.getImageData(0, 0, sc.width, sc.height).data, k = RT.k;
          for (let y = 0; y < sc.height; y++) for (let x = 0; x < sc.width; x++) if (d[(y * sc.width + x) * 4 + 3] > 0) for (let yy = 0; yy < k; yy++) for (let xx = 0; xx < k; xx++) { const X = (rec.X + x) * k + xx, Y = (rec.Y + y) * k + yy; if (X >= 0 && Y >= 0 && X < W && Y < H) own[Y * W + X] = 1; } }
        else { const oc = document.createElement('canvas'); oc.width = W; oc.height = H; const og = oc.getContext('2d'); og.setTransform(g.dpr, 0, 0, g.dpr, 0, 0); const p = m.human, b = m.ball;
          drawPlayer(og, g.cam, p, 1, b, m.teams[p.team], { noShadow: true, depth: p._depth || 0, ballPaint: b.owner === p ? () => drawBallNew(og, g.cam, b, 1, b.skin, false, {}) : null });
          const d = og.getImageData(0, 0, W, H).data; for (let i = 0; i < W * H; i++) if (d[i * 4 + 3] === 255) own[i] = 1; } // fully opaque only: an anti-aliased edge blends with whatever is behind it
        } finally { performance.now = realNow; }
        { const er = gfx === 'smooth' ? 2 : 1, e = new Uint8Array(W * H); // the player's solid inside: their outer 1–2 px (anti-aliased edges, a held ball's rim) can shift a hair between draws
          for (let y = er; y < H - er; y++) for (let x = er; x < W - er; x++) { const i = y * W + x; if (!own[i]) continue; let ok = 1; for (let d = 1; d <= er && ok; d++) ok = own[i - d] && own[i + d] && own[i - d * W] && own[i + d * W]; e[i] = ok ? 1 : 0; } own.set(e); }
        let mask = 0, covered = 0, rackPx = 0, x0 = W, y0 = H, x1 = 0, y1 = 0;
        for (let i = 0; i < A1.length; i += 4) {
          const same = (X, Y) => X[i] === Y[i] && X[i + 1] === Y[i + 1] && X[i + 2] === Y[i + 2], far = (X, Y) => Math.max(Math.abs(X[i] - Y[i]), Math.abs(X[i + 1] - Y[i + 1]), Math.abs(X[i + 2] - Y[i + 2])) > 20;
          if (!same(A1, A2) || !same(A2, A3)) continue; const rack = far(C, A1) && far(C2, A1) && same(C, C2); if (rack) rackPx++; // a real difference repeats on every rack render (the smooth face cache paints on a time budget) and is a clear one: a rack over a player changes its color outright (a smooth draw can shade a brow 3–5 levels apart)
          if (!own[i / 4]) continue; mask++; if (rack) { covered++; const p = i / 4, x = p % W, y = (p - x) / W; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
        }
        g.quitToMenu && g.quitToMenu();
        return { mask, covered, rackPx, box: covered ? [x0, y0, x1, y1] : null };
      }, [kind, gfx]);
      if (r.err) throw new Error(r.err);
      if (r.mask < 300) throw new Error('the player covers only ' + r.mask + ' px (the test found no player)');
      if (r.rackPx < 50) throw new Error('the rack draws only ' + r.rackPx + ' px (no rack on screen)');
      if (r.covered) throw new Error(r.covered + ' of the player\'s ' + r.mask + ' px change when the racks are drawn (box ' + r.box.join(',') + ')');
    }, P);
  }
}


// §1.11: Signing Day's "Around the league" panel appears with its first signing (it sat empty through the reveal).
async function signingStep(R, P, label) {
  await R.step('signing day: no empty "Around the league" panel (' + label + ')', async () => {
    const r = await P.ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Sign Check', look: PRESET_LOOKS[3], number: 9, style: 'slasher', seed: 77 }); a.events.length = 0; const c = testProLeague(12, g.save.data); g.save.data.c1.handedOff = true; c.events.length = 0;
      const s = signingScreen(g); g.ui.clearTo(s); g.ui.trans = null; const texts = t => { s.update(t - (s._t || 0)); s._t = t; RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { var B = RBF.boxes || []; RBF.boxes = null; } return B.map(b => b.t); };
      const early = texts(0.3), later = texts(3.5); return { early: early.filter(t => /around the league/i.test(t)).length, later: later.filter(t => /around the league/i.test(t)).length, board: (c.signing && c.signing.board || []).length }; });
    if (r.early) throw new Error('the panel shows before any signing (t = 0.3 s)'); if (r.board && !r.later) throw new Error('the panel never shows (' + r.board + ' signings)');
  }, P);
}

// §1.12: a season on the bench: the recap says what you did instead of 0.0 tiles (3.0 §4.3: your season in the league
// below, JV: its points a game, games, record and rank).
async function benchStep(R, P, label) {
  await R.step('a season off the top rung: the recap shows the JV season (' + label + ')', async () => {
    const r = await P.ev(() => { localStorage.clear(); const g = HH.game; g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Bench Check', look: PRESET_LOOKS[4], number: 12, style: 'shooter', seed: 909 }); a.events.length = 0; hsAutoResolve(a); amEnsureTeam(a); ladderInit(a, 3);
      let n = 0, played = 0; hsSquadSync(a); while (a.league && !a.league.done && n++ < 40) { if (isStarter(a)) { const L = ladderOf(a); L.splice(L.indexOf('me'), 1); L.splice(2, 0, 'me'); } a.team.hot = {}; /* (kept off the top rung all season) */ const res = amSimGame(a); if (!res) break; if (!res.bench && !res.ll) played++; a.events = a.events.filter(e => e.kind === 'recap'); if (a.decision || (a.tryout && a.tryout.step !== 'done')) break; }
      const row = a.log[a.log.length - 1]; if (!row) return { err: 'the season never ended (' + n + ' sims)' }; if (row.g) return { skip: 'played ' + row.g + ' games' };
      const s = amRecapScreen(g, a, { kind: 'recap', title: 'SEASON RECAP', lines: [] }, () => {}); g.ui.clearTo(s); g.ui.trans = null; s.update(9); RBF.boxes = []; try { g.drawUI(g.ctx, g.W, g.H); } finally { var B = RBF.boxes || []; RBF.boxes = null; }
      const t = B.map(b => b.t); return { played, row, benched: t.some(x => /^JV PPG$/.test(x.trim())) && t.some(x => /^RANK$/.test(x.trim())) && t.some(x => /PRACTICE/.test(x)) && !!(row.ll && row.ll.g >= 8), zeros: t.filter(x => /^0\.0$|^0%$/.test(x.trim())), cut: B.filter(b => b.cut).map(b => b.cut) }; });
    if (r.err) throw new Error(r.err); if (r.skip) throw new Error('the scripted season was not benched: ' + r.skip);
    if (!r.benched) throw new Error('recap tiles: the JV season ' + JSON.stringify(r.row && r.row.ll)); if (r.zeros.length) throw new Error('zero tiles still drawn: ' + r.zeros.join(', ')); if (r.cut.length) throw new Error('cut: ' + r.cut.join(' | '));
  }, P);
}

(async () => {
  const b = await launch(); const R = runner('fixes');
  for (const phone of [false, true]) {
    const P = await openPage(b, { phone }); const label = phone ? 'phone' : 'desktop';
    await racksStep(R, P, label);
    await signingStep(R, P, label);
    if (!phone) await benchStep(R, P, label);
    await P.context.close();
  }
  await b.close(); process.exit(R.done() ? 1 : 0);
})();
