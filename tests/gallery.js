// Before/after gallery for the Legends look (L10): the same short tour on any build, then triptychs.
//   node tests/gallery.js shoot <outDir> [pixel|smooth]   (HH_ROOT=<dir with index.html> shoots another build)
//   node tests/gallery.js compose <beforeDir> <smoothDir> <pixelDir> <outDir>
// The tour sets each scene up directly (title, menu, create, a quick 1v1 at tip-off, a jumper, an attack at the rim,
// defense, pause, settings; the match and pause again on a phone), so it runs the same on the pre-L1 build and now.
const fs = require('fs'), path = require('path');
const { loadPlaywright } = require('./lib'); const { chromium } = loadPlaywright();
const [, , mode, a1, a2, a3, a4] = process.argv;
const ROOT = path.resolve(process.env.HH_ROOT || path.join(__dirname, '..'));
async function shoot(OUT, gfx) {
  fs.mkdirSync(OUT, { recursive: true }); const b = await chromium.launch(); const errors = [];
  for (const [dev, opts] of [['d', { viewport: { width: 1280, height: 720 } }], ['p', { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }]]) {
    const ctx = await b.newContext(opts); const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
    await page.goto('file://' + path.join(ROOT, 'index.html')); await page.waitForFunction(() => window.HH && HH.game); await page.waitForTimeout(500);
    const ev = (f, x) => page.evaluate(f, x); const shot = async n => { await page.waitForTimeout(350); await page.screenshot({ path: path.join(OUT, dev + n + '.jpg'), type: 'jpeg', quality: 86 }); console.log('shot', dev + n); };
    await ev(g => { localStorage.clear(); const G = HH.game; G.save = new SaveSystem(); const S = G.save.data.settings; if (g) S.graphics = g; S.tutorialDone = true; G.ui.clearTo(titleScreen(G)); }, gfx || null);
    if (dev === 'd') {
      await page.waitForTimeout(1200); await shot('01_title');
      await ev(() => HH.game.ui.replace(mainMenu(HH.game))); await page.waitForTimeout(400); await shot('02_menu');
      await ev(() => HH.game.ui.replace(createPlayerScreen(HH.game))); await page.waitForTimeout(500); await shot('03_create');
      await ev(() => HH.game.ui.replace(settingsScreen(HH.game))); await page.waitForTimeout(400); await shot('04_settings');
    }
    await ev(() => { const G = HH.game; G.startMatch({ mode: '1v1', teams: [Object.assign({}, TEAMS[2], { players: [ROSTER.legends[1]] }), Object.assign({}, TEAMS[5], { players: [ROSTER.nephews[2]] })], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 21 }, court: COURTS.legends ? 'legends' : 'arena', seed: 9 }, { kind: 'quick' }); });
    await page.waitForTimeout(2600); await shot('05_match_tipoff');
    const moment = async (pred, label) => { await ev(src => { const g = HH.game, m = g.match, P = new Function('m', 'return ' + src); for (const p of m.players) p.controlled = false; let n = 0; while (!P(m) && n < 120 * 240 && !m.ended) { simStep(m, STEP); n++; } g.paused = true; g.acc = 0; }, pred); await page.waitForTimeout(600); await shot(label); await ev(() => { HH.game.paused = false; }); };
    await moment("m.players.some(p => p.state === 'jumpshot' && p.stateT > 0.12)", '06_match_jumper');
    await moment("m.players.some(p => (p.state === 'dunk' || p.state === 'layup') && p.stateT > 0.15)", '07_match_rim');
    if (dev === 'd') await moment("m.ball.owner && m.players.some(p => p.state === 'stance') && Math.abs(m.players[0].x - m.players[1].x) < 1.6", '08_match_defense');
    await ev(() => HH.game.pause()); await page.waitForTimeout(500); await shot('09_pause');
    await ctx.close();
  }
  console.log(errors.length ? 'page errors:\n' + errors.join('\n') : 'no page errors'); await b.close();
}
async function compose(B, S, P, OUT) {
  fs.mkdirSync(OUT, { recursive: true }); const b = await chromium.launch(); const page = await (await b.newContext({ viewport: { width: 1960, height: 480 } })).newPage(); let n = 0;
  const img = p => 'data:image/jpeg;base64,' + fs.readFileSync(p).toString('base64');
  for (const f of fs.readdirSync(P).filter(f => f.endsWith('.jpg')).sort()) {
    const cols = [['BEFORE · M9 (pre-Legends)', path.join(B, f), '#C9CCE0'], ['AFTER · Smooth', path.join(S, f), '#5EE0FF'], ['AFTER · Pixel (default)', path.join(P, f), '#FFD23F']].filter(c => fs.existsSync(c[1]));
    const phone = f.startsWith('p'), w = 620, h = phone ? Math.round(w * 390 / 844) : Math.round(w * 720 / 1280), label = f.replace(/\.jpg$/, '').replace(/^([dp])(\d+)_/, (m, k, d) => (k === 'd' ? 'Desktop ' : 'Phone ') + d + ' · ').replace(/_/g, ' ');
    await page.setViewportSize({ width: cols.length * (w + 20) + 20, height: h + 64 });
    await page.setContent(`<html><body style="margin:0;background:#0B1030;font-family:Arial,Helvetica,sans-serif;color:#F3F0FF"><div style="display:flex;gap:20px;padding:10px 20px 0 20px">${cols.map(([cap, p, col]) => `<div style="width:${w}px"><div style="font-weight:900;font-size:16px;color:${col};margin-bottom:6px">${cap}</div><img src="${img(p)}" style="width:${w}px;height:${h}px;display:block;border-radius:6px;object-fit:cover"></div>`).join('')}</div><div style="position:absolute;right:22px;top:10px;font-size:14px;color:#9FB0FF">${label}</div></body></html>`);
    await page.waitForTimeout(60); await page.screenshot({ path: path.join(OUT, f), type: 'jpeg', quality: 82 }); n++;
  }
  console.log('triptychs', n); await b.close();
}
(mode === 'compose' ? compose(path.resolve(a1), path.resolve(a2), path.resolve(a3), path.resolve(a4)) : shoot(path.resolve(a1 || 'gallery'), a2)).catch(e => { console.error(e); process.exit(1); });
