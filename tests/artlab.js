// Art Lab screenshots for a visual round: node tests/artlab.js <milestone> <round>
// Saves every Art Lab view plus in-match frames (desktop and phone) to shots/<milestone>/round-<round>/.
const path = require('path'), fs = require('fs');
const { ROOT, launch, openPage } = require('./lib');
(async () => {
  const milestone = process.argv[2] || 'lab', round = process.argv[3] || '1';
  const out = path.join(ROOT, 'shots', milestone, 'round-' + round); fs.mkdirSync(out, { recursive: true });
  const browser = await launch(); const P = await openPage(browser, { query: '?artlab', wait: 900 });
  const { page, ev } = P; let n = 0;
  const views = await ev(() => LAB_VIEWS.slice());
  const shot = async name => { await page.waitForTimeout(350); await P.shot(path.join(out, name + '.jpg')); n++; };
  for (let v = 0; v < views.length; v++) {
    await ev(v => HH.game.ui.screen.setView(v), v);
    if (v === 1) { for (const ch of (process.env.LAB_CHARS || '0,3,7,11').split(',').map(Number)) { await ev(c => HH.game.ui.screen.setChar(c), ch); await shot('lab-' + v + '-faces250-p' + (ch + 1)); } }
    else if (v === 3) { for (const ch of [0, 9]) { await ev(c => HH.game.ui.screen.setChar(c), ch); await shot('lab-' + v + '-hair-p' + (ch + 1)); } }
    else if (views[v] === 'Clips') { const n = await ev(() => labClipPages()); for (let pg = 0; pg < n; pg++) { await ev(q => HH.game.ui.screen.setPage(q), pg); await shot('lab-' + v + '-clips-p' + (pg + 1)); } }
    else await shot('lab-' + v + '-' + views[v].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''));
  }
  // in-match frames: a quick 1v1 in each venue, frozen mid-play
  const venues = await ev(() => labVenueIds());
  for (const id of venues) {
    await ev(id => { const g = HH.game; const a = LAB_CAST[3], b = LAB_CAST[9]; const tA = Object.assign({}, TEAMS[0], { id: 'labA', name: a.name, abbr: 'MAR', colors: a.colors, pattern: 'solid', players: [labDef(a, 3)] }), tB = Object.assign({}, TEAMS[1], { id: 'labB', name: b.name, abbr: 'ASH', colors: b.colors, pattern: 'solid', players: [labDef(b, 9)] }); g.startMatch({ mode: '1v1', teams: [tA, tB], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 21 }, court: id, seed: 5, controlMode: 'lock' }, { kind: 'quick' }); const m = g.match; for (const p of m.players) p.controlled = false; let k = 0; while (k < 120 * 40 && !m.players.some(p => p.state === 'jumpshot' && p.stateT > 0.12)) { simStep(m, STEP); k++; } g.paused = true; }, id);
    await page.waitForTimeout(700); await shot('match-' + id);
    await ev(() => { HH.game.paused = false; HH.game.quitToMenu(); });
  }
  const errs = P.errors.concat((await P.frameErrors()).map(e => '[frame] ' + e));
  // phone: the same moment at 844×390
  const Q = await openPage(browser, { phone: true, wait: 900 });
  await Q.ev(() => { const g = HH.game; const a = LAB_CAST[3], b = LAB_CAST[9]; const tA = Object.assign({}, TEAMS[0], { id: 'labA', name: a.name, abbr: 'MAR', colors: a.colors, pattern: 'solid', players: [labDef(a, 3)] }), tB = Object.assign({}, TEAMS[1], { id: 'labB', name: b.name, abbr: 'ASH', colors: b.colors, pattern: 'solid', players: [labDef(b, 9)] }); g.startMatch({ mode: '1v1', teams: [tA, tB], humanTeam: 0, humanPlayerIndex: 0, difficulty: 'pro', ruleset: 'arcade', format: { type: 'first', target: 21 }, court: 'arena', seed: 5, controlMode: 'lock' }, { kind: 'quick' }); const m = g.match; let k = 0; for (const p of m.players) p.controlled = false; while (k < 120 * 40 && !m.players.some(p => p.state === 'jumpshot' && p.stateT > 0.12)) { simStep(m, STEP); k++; } g.paused = true; });
  await Q.page.waitForTimeout(800); await Q.shot(path.join(out, 'phone-match-arena.jpg')); n++;
  errs.push(...Q.errors);
  console.log('saved ' + n + ' screenshots to ' + path.relative(ROOT, out));
  console.log(errs.length ? 'ERRORS:\n  ' + errs.join('\n  ') : 'no errors');
  await browser.close(); process.exitCode = errs.length ? 1 : 0;
})();
