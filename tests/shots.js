// Screenshot tour: every screen plus match moments, desktop 1280×720 and phone 844×390 (touch). Used for the baseline audit
// (shots/audit) and the before/after gallery. Usage: node tests/shots.js <outdir>
const { ROOT, loadPlaywright } = require('./lib'); const { chromium } = loadPlaywright();
const fs = require('fs'), path = require('path');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'shots', 'tour'));
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const mk = async (opts) => { const ctx = await browser.newContext(opts); const page = await ctx.newPage(); await page.addInitScript(() => { window.HH_NO_TIPS = true; }); /* R10: no first-time tips in the tour */ page.on('pageerror', e => errors.push('[pageerror] ' + e.message)); page.on('console', m => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)/.test((m.location() || {}).url || '')) errors.push('[console] ' + m.text()); }); await page.goto('file://' + path.join(ROOT, 'index.html')); await page.waitForTimeout(600); return page; };
  const page = await mk({ viewport: { width: 1280, height: 720 } });
  const ev = (f, a) => page.evaluate(f, a);
  const shot = async (n) => { await page.waitForTimeout(250); await page.screenshot({ path: path.join(OUT, n + '.jpg'), type: 'jpeg', quality: 88 }); console.log('shot', n); };
  const press = re => ev(re => { const s = HH.game.ui.screen; const w = s.widgets.find(w => !w.hidden && w.label && new RegExp(re).test(w.label)); if (!w) throw new Error('no widget /' + re + '/ on ' + s.name + ': ' + s.widgets.filter(w => !w.hidden).map(w => w.label).filter(Boolean).join('|')); w.onPress(); }, re.source);
  const name = () => ev(() => HH.game.ui.screen ? HH.game.ui.screen.name : '(none)');
  // M8 story cards, the press room and rival cards come between screens: answer and move on
  const dialogThrough = () => ev(() => { const s = HH.game.ui.screen; if (!s || s.name !== 'dialog') return false; for (let i = 0; i < 12 && HH.game.ui.screen === s; i++) { if (s.finish) s.finish(); /* type the page out: a choice shows once its text is done */ const vis = s.widgets.filter(w => !w.hidden); const nx = vis.find(w => w.label === '▼'); if (nx) { nx.onPress(); continue; } const co = vis.find(w => w.label === 'CONTINUE'); if (co) { co.onPress(); break; } const ch = vis[vis.length - 1]; if (ch) ch.onPress(); } return true; }); // R9: a dialogue card
  const drain = async () => { for (let i = 0; i < 16; i++) { const s = await name(); if (s === 'dialog') { await dialogThrough(); await page.waitForTimeout(150); continue; } if (s === 'press') { await press(/^TEAM FIRST$/); await press(/^CONTINUE$/); continue; } /* R4 */ if (!/^(amevent|rivalmoment|commitday)$/.test(s)) return; await press(/^(Continue|CONTINUE)$/); await page.waitForTimeout(150); } };
  // step the live match until pred(m) holds, then freeze it for a screenshot
  const moment = async (predSrc, max, label) => { const ok = await ev(({ predSrc, max }) => { const g = HH.game, m = g.match; if (!m) return 'no match'; const pred = new Function('m', 'return ' + predSrc); for (const p of m.players) p.controlled = false; let n = 0; while (!pred(m) && n < max && !m.ended) { simStep(m, STEP); n++; } g.paused = true; g.acc = 0; return pred(m) ? 'ok after ' + n : 'pred not met after ' + n; }, { predSrc, max }); console.log('  moment', label, ok); await page.waitForTimeout(700); await shot(label); await ev(() => { HH.game.paused = false; }); };
  await ev(() => { localStorage.clear(); HH.game.save = new SaveSystem(); HH.game.ui.clearTo(titleScreen(HH.game)); });
  await page.waitForTimeout(400); await shot('d01_title');
  await page.keyboard.press('Enter'); await page.waitForTimeout(300); await shot('d02_menu');
  await press(/START YOUR CAREER/); await page.waitForTimeout(300); await shot('d03_create');
  try { await press(/Face shape|Customize face/); await page.waitForTimeout(250); await shot('d04_customize_face'); await ev(() => HH.game.ui.pop()); } catch (e) { console.log('no customize', e.message.slice(0, 120)); }
  await press(/START HIGH SCHOOL/); await page.waitForTimeout(1600); await shot('d05_genes_reveal');
  await drain(); await page.waitForTimeout(400); await shot('d06_hs_hub');
  await press(/^TRYOUTS$/); await page.waitForTimeout(300); await shot('d06b_tryouts'); await press(/^SIM IT$/); await page.waitForTimeout(200); await press(/^SIM IT$/); await page.waitForTimeout(400); await drain(); await ev(() => { const g = HH.game, a = g.save.data.c1; ladderInit(a, 1); a.events.length = 0; g.ui.clearTo(amHub(g)); }); await page.waitForTimeout(300); /* R5: tryouts; the starter plays the match below */
  await press(/^PLAY( GAME)?$/); await page.waitForTimeout(2600); await shot('d07_hs_match_start');
  await moment("m.players.some(p => p.state === 'jumpshot' && p.stateT > 0.12)", 120 * 90, 'd08_hs_match_jumpshot');
  await moment("m.players.some(p => (p.state === 'dunk' || p.state === 'layup') && p.stateT > 0.15)", 120 * 240, 'd09_hs_match_rim');
  await moment("m.players.some(p => p.state === 'stance' || (p.anim && p.anim.defStance)) && m.ball.owner && Math.abs(m.players[0].x - m.players[1].x) < 1.6", 120 * 90, 'd10_hs_match_defense');
  await page.keyboard.press('Escape'); await page.waitForTimeout(300); await shot('d11_pause');
  await press(/Sim the rest/); await page.waitForTimeout(1500); await shot('d12_hs_result');
  await press(/CONTINUE/); await page.waitForTimeout(400); await drain();
  await press(/Standings/); await page.waitForTimeout(250); await shot('d13_hs_standings'); await ev(() => HH.game.ui.pop());
  await press(/^Stats/); await page.waitForTimeout(250); await shot('d14_hs_history'); await ev(() => HH.game.ui.pop());
  for (let i = 0; i < 80; i++) { const s = await name(); if (s === 'amevent' && await ev(() => { const e = HH.game.save.data.c1.events[0]; return !!e && e.kind === 'recap'; })) break; if (s === 'amresult') { await press(/CONTINUE/); await page.waitForTimeout(100); continue; }
    if (s === 'dialog') { await dialogThrough(); await page.waitForTimeout(150); continue; } if (s === 'press') { await press(/^TEAM FIRST$/); await press(/^CONTINUE$/); continue; } if (s === 'summer') { await press(/^CHOOSE$/); continue; } if (s === 'tryout') { await press(/^SIM IT$/); continue; } if (s !== 'amhub') { await press(/^(Continue|CONTINUE)$/); await page.waitForTimeout(150); continue; } await press(/^(SIM( THE GAME)?|YOUR SUMMER|TRYOUTS)$/); await page.waitForTimeout(100); } // one card at a time: stop on the recap (R4: a teammate's challenge; a benched week)
  await page.waitForTimeout(1500); await shot('d15_season_recap');
  await drain(); await page.waitForTimeout(250);
  await shot('d16_hs_hub_year2');
  await ev(() => { const g = HH.game, a = g.save.data.c1; let guard = 0; while (!a.decision && a.stage === 'hs' && guard++ < 200) { a.events.length = 0; if (!amSimGame(a)) break; } a.events.length = 0; g.ui.clearTo(amHub(g)); });
  await page.waitForTimeout(300); await press(/SIGNING DAY|CHOOSE YOUR COLLEGE/); /* 2.1: Signing Day */ await page.waitForTimeout(300); await shot('d17_college_offers');
  await ev(() => { const s = HH.game.ui.screen; s.widgets.find(w => w.primary).onPress(); }); await page.waitForTimeout(300); await press(/^Yes$/); await page.waitForTimeout(600);
  await drain(); await page.waitForTimeout(300);
  await shot('d18_college_hub');
  await ev(() => { const g = HH.game, a = g.save.data.c1; ladderInit(a, 1); a.events.length = 0; g.ui.clearTo(amHub(g)); }); await page.waitForTimeout(300); /* R4: a big program starts you on the bench; the match below needs the starter */
  await press(/^PLAY( GAME)?$/); await page.waitForTimeout(2600);
  await moment("m.players.some(p => p.state === 'jumpshot' && p.stateT > 0.1)", 120 * 90, 'd19_college_match');
  await ev(() => { const m = HH.game.match; let n = 0; while (!m.ended && n < 120 * 60 * 15) { simStep(m, STEP); n++; } }); await page.waitForTimeout(1500);
  for (let i = 0; i < 4; i++) { const s = await name(); if (s === 'amresult') { await press(/CONTINUE/); await page.waitForTimeout(300); } } await drain();
  await ev(() => { const g = HH.game, a = g.save.data.c1; let guard = 0; while (a.stage !== 'combine' && guard++ < 300) { a.events.length = 0; if (a.decision) { if (a.decision.kind === 'declare' || a.decision.kind === 'portal') amDeclare(a, true); else if (a.decision.signing) recSimSign(a); /* 2.1 */ else amChooseCollege(a, a.decision.offers[0]); continue; } /* R6: the portal too */ if (!amSimGame(a)) break; } a.events.length = 0; g.ui.clearTo(amHub(g)); });
  await page.waitForTimeout(300); await shot('d20_combine_hub');
  await press(/PRO COMBINE|DRAFT COMBINE/); await page.waitForTimeout(6500); await shot('d21_combine');
  await press(/PRO OFFERS/); await page.waitForTimeout(700); await shot('d22_pro_offers'); await press(/^SIGN WITH THE /); await page.waitForTimeout(7000); await shot('d22_signing');
  await press(/START YOUR PRO CAREER/); await page.waitForTimeout(500); await drain(); await page.waitForTimeout(300); await ev(() => { const g = HH.game, c = g.save.data.career; ladderInit(c, 1); c.events.length = 0; g.ui.clearTo(careerHub(g)); }); await page.waitForTimeout(300); await shot('d23_pro_hub'); /* R4: a later pick starts a rung down */
  await press(/^PLAY( GAME)?$/); await page.waitForTimeout(400); await shot('d24_pregame');
  await press(/TIP OFF/); await page.waitForTimeout(2600); await shot('d25_pro_match_start');
  await moment("m.players.some(p => p.state === 'jumpshot' && p.stateT > 0.12)", 120 * 90, 'd26_pro_match_jumpshot');
  await moment("m.players.some(p => (p.state === 'dunk' || p.state === 'rimhang'))", 120 * 300, 'd27_pro_match_dunk');
  await moment("!m.ball.owner && m.ball.shot && m.ball.rimTouched && m.players.some(p => !p.grounded)", 120 * 300, 'd28_pro_match_rebound');
  await ev(() => { const m = HH.game.match; let n = 0; while (!m.ended && n < 120 * 60 * 15) { simStep(m, STEP); n++; } }); await page.waitForTimeout(2500); await shot('d29_pro_result');
  for (let i = 0; i < 4; i++) { const s = await name(); if (s === 'result' || s === 'postgame') { try { await press(/CONTINUE/); } catch (e) { break; } await page.waitForTimeout(300); } } await drain();
  await ev(() => { const g = HH.game, c = g.save.data.career; if (c && c.events) c.events.length = 0; g.ui.clearTo(careerHub(g)); }); await page.waitForTimeout(300);
  await press(/^PRACTICE/); await page.waitForTimeout(300); await shot('d30_practice'); await ev(() => HH.game.ui.pop());
  // other screens from the menu
  const toMenu = () => ev(() => { HH.game.quitToMenu && HH.game.mode === 'match' && HH.game.quitToMenu(); HH.game.ui.clearTo(mainMenu(HH.game)); });
  await toMenu(); await page.waitForTimeout(300); await shot('d31_menu_with_career');
  await press(/Quick 1v1/); await page.waitForTimeout(300); await shot('d32_quick_setup');
  await ev(() => { const s = HH.game.ui.screen; const w = s.widgets.find(w => w.primary); w.onPress(); }); await page.waitForTimeout(2600); await shot('d33_quick_match');
  await moment("m.players.some(p => p.state === 'jumpshot' && p.stateT > 0.12)", 120 * 90, 'd34_quick_match_shot');
  await toMenu(); await page.waitForTimeout(300);
  await press(/^Practice$/); await page.waitForTimeout(250); await shot('d35_practice_menu'); await ev(() => HH.game.ui.pop()); /* F1: Practice replaces Extras */
  await toMenu(); await page.waitForTimeout(250); await press(/^Practice$/); await page.waitForTimeout(250); await press(/3-Point Contest/); await page.waitForTimeout(300); await shot('d36_threept_setup'); await ev(() => { const s = HH.game.ui.screen; s.widgets.find(w => w.primary).onPress(); }); await page.waitForTimeout(2500); await shot('d37_threept_contest'); await toMenu(); await page.waitForTimeout(300);
  await press(/^Practice$/); await page.waitForTimeout(250); await press(/^Shooting practice$/); await page.waitForTimeout(300); await shot('d38_practice_setup'); await ev(() => HH.game.ui.pop());
  await toMenu(); await page.waitForTimeout(300);
  await press(/Hall of Fame/); await page.waitForTimeout(300); await shot('d40_hall_of_fame'); await ev(() => HH.game.ui.pop());
  await press(/How to play/); await page.waitForTimeout(300); await shot('d41_how_to_play'); await ev(() => HH.game.ui.pop());
  await press(/Settings/); await page.waitForTimeout(300); await shot('d42_settings'); await ev(() => HH.game.ui.pop());
  // phone, touch
  const ph = await mk({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const pev = (f, a) => ph.evaluate(f, a); const pshot = async n => { await ph.waitForTimeout(300); await ph.screenshot({ path: path.join(OUT, n + '.jpg'), type: 'jpeg', quality: 85 }); console.log('shot', n); };
  await pev(() => { localStorage.clear(); HH.game.save = new SaveSystem(); HH.game.ui.clearTo(titleScreen(HH.game)); }); await ph.waitForTimeout(300);
  await pshot('p01_title'); await ph.tap('canvas', { position: { x: 422, y: 300 } }); await ph.waitForTimeout(400); await pshot('p02_menu');
  await pev(() => { const s = HH.game.ui.screen; s.widgets.find(w => /START YOUR CAREER/.test(w.label)).onPress(); }); await ph.waitForTimeout(300); await pshot('p03_create');
  await pev(() => { const s = HH.game.ui.screen; s.widgets.find(w => /START HIGH SCHOOL/.test(w.label || '')).onPress(); }); await ph.waitForTimeout(1500); await pshot('p04_genes');
  await pev(() => { const a = HH.game.save.data.c1; a.events.length = 0; hsSimTryout(a); ladderInit(a, 1); a.events.length = 0; HH.game.ui.clearTo(amHub(HH.game)); }); await ph.waitForTimeout(300); await pshot('p05_hub'); /* R5: tryouts (simmed) first */
  await pev(() => { const s = HH.game.ui.screen; s.widgets.find(w => /^PLAY( GAME)?$/.test(w.label || '')).onPress(); }); await ph.waitForTimeout(2600); await pshot('p06_match_touch');
  await pev(() => { const g = HH.game, m = g.match; for (const p of m.players) p.controlled = false; let n = 0; while (!m.players.some(p => p.state === 'jumpshot' && p.stateT > 0.12) && n < 120 * 90) { simStep(m, STEP); n++; } g.paused = true; }); await ph.waitForTimeout(700); await pshot('p07_match_moment'); await pev(() => { HH.game.paused = false; });
  await pev(() => HH.game.pause()); await ph.waitForTimeout(300); await pshot('p08_pause');
  console.log('ERRORS', errors.length, errors.slice(0, 10));
  await browser.close();
})();
