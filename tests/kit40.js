// 4.0 (§1): the Retro Bowl kit. A career's screens draw on its level's color (high school deep red, college green, the
// PBL royal blue) with the watermark, the menus keep the arena; five stars with halves in the right colors; mood faces
// by their thresholds; a panel's title sits in a gap in its top border; the credits counter; the bottom row (square
// icons, the main action at the bottom right, nothing overlapping, tap-sized on a phone); the header's "i" opens the
// screen's Codex page; the season as a year; the Art Lab's Kit 4.0 pages.
// Usage: node tests/kit40.js [--phone]   (ONLY=<regex> runs some steps)
const { launch, openPage, runner } = require('./lib');
(async () => {
  const PHONE = process.argv.includes('--phone');
  const browser = await launch(); const R = runner('kit40' + (PHONE ? ' (phone)' : '')); const D = await openPage(browser, { phone: PHONE }); const { ev } = D; const step = (n, f) => R.step(n, f, D);
  await ev(() => {
    window.__px = (c, x, y) => { const d = c.getContext('2d').getImageData(Math.round(x), Math.round(y), 1, 1).data; return [d[0], d[1], d[2], d[3]]; };
    window.__near = (a, hex, tol) => { const n = parseInt(hex.slice(1), 16), b = [(n >> 16) & 255, (n >> 8) & 255, n & 255]; return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) <= (tol || 60); };
    window.__cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    window.__hs = seed => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Kit Test', look: PRESET_LOOKS[seed % 16], number: 9, style: 'slasher', seed }); g.save.data.c1 = a; hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; return a; };
  });

  await step('the background (§1): a career\'s screens on its level\'s color with the watermark; the menus keep the arena', () => ev(() => {
    const bad = [], g = HH.game, seen = [], sample = () => { g.ui.trans = null; g.drawUI(g.ctx, g.W, g.H); return __px(g.ctx.canvas, 3, Math.round(g.ctx.canvas.height / 2)); };
    g.ui.clearTo(titleScreen(g)); if (rbUiLevel(g.ui)) bad.push('the title screen has a level: ' + rbUiLevel(g.ui));
    const a = __hs(501); g.hubTab = 'home'; g.ui.clearTo(amHub(g)); if (rbUiLevel(g.ui) !== 'hs') bad.push('high school: ' + rbUiLevel(g.ui)); let p = sample(); if (!__near(p, RBK.colors.hs[0], 120) && !__near(p, RBK.colors.hs[1], 120)) bad.push('high school\'s edge is ' + p.slice(0, 3)); seen.push('hs ' + p.slice(0, 3));
    a.stage = 'college'; g.ui.clearTo(amHub(g)); if (rbUiLevel(g.ui) !== 'college') bad.push('college: ' + rbUiLevel(g.ui)); p = sample(); if (!__near(p, RBK.colors.college[0], 120) && !__near(p, RBK.colors.college[1], 120)) bad.push('college\'s edge is ' + p.slice(0, 3)); seen.push('college ' + p.slice(0, 3)); a.stage = 'hs';
    const c = testProLeague(502, g.save.data); g.save.data.career = c; c.events.length = 0; g.ui.clearTo(careerHub(g)); if (rbUiLevel(g.ui) !== 'pro') bad.push('the pros: ' + rbUiLevel(g.ui)); p = sample(); if (!__near(p, RBK.colors.pro[0], 120) && !__near(p, RBK.colors.pro[1], 120)) bad.push('the pros\' edge is ' + p.slice(0, 3)); seen.push('pro ' + p.slice(0, 3));
    g.ui.push(statsGuideScreen(g)); if (rbUiLevel(g.ui) !== 'pro') bad.push('a screen over the hub lost the level'); g.ui.clearTo(titleScreen(g)); if (rbUiLevel(g.ui)) bad.push('back at the title, still ' + rbUiLevel(g.ui));
    const t = rbTile('pro', 2034, 1); if (!t || t.width < 100) bad.push('no watermark tile');
    if (bad.length) throw new Error(bad.join(' · ')); return 'edges ' + seen.join(' · ');
  }));

  await step('stars (§1): five with halves; offense cyan, defense red, players and the crew gold; a player\'s stars from the level\'s middle', () => ev(() => {
    const bad = [], c = __cv(400, 60), x = c.getContext('2d'), s = 40, gap = s * 0.12, R = s / 2;
    for (const [v, kind, col] of [[3.5, 'off', RBK.off], [2, 'def', RBK.def], [5, 'gold', RBK.gold], [0.5, 'gold', RBK.gold]]) { x.clearRect(0, 0, 400, 60); rbStars(x, 0, 30, v, s, kind);
      for (let i = 0; i < 5; i++) { const cx = R + i * (s + gap), L = __px(c, cx - R * 0.25, 30), Rr = __px(c, cx + R * 0.25, 30), wantL = v >= i + 0.5, wantR = v >= i + 1; if (__near(L, col, 90) !== wantL) bad.push(kind + ' ' + v + ': star ' + (i + 1) + '\'s left half ' + (wantL ? 'empty' : 'filled')); if (__near(Rr, col, 90) !== wantR) bad.push(kind + ' ' + v + ': star ' + (i + 1) + '\'s right half ' + (wantR ? 'empty' : 'filled')); } }
    const sv = [rbStarVal(80, 80), rbStarVal(84, 80), rbStarVal(99, 80), rbStarVal(40, 80), rbStarVal(78, 80)]; if (sv.join() !== '2.5,3.5,5,0.5,2') bad.push('rbStarVal ' + sv.join());
    if (bad.length) throw new Error(bad.slice(0, 6).join(' · ')); return 'halves right in four rows; OVR 80/84/99/40/78 against 80: ' + sv.join(' / ') + ' stars';
  }));

  await step('mood faces (§1): a yellow smile from 67%, an orange so-so from 34%, a red frown under', () => ev(() => {
    const bad = [], c = __cv(80, 80), x = c.getContext('2d');
    for (const [p, k, col] of [[90, 'smile', RBK.mood[0][1]], [67, 'smile', RBK.mood[0][1]], [66, 'meh', RBK.mood[1][1]], [34, 'meh', RBK.mood[1][1]], [33, 'frown', RBK.mood[2][1]], [0, 'frown', RBK.mood[2][1]]]) { x.clearRect(0, 0, 80, 80); const got = rbMood(x, 40, 40, 30, p); if (got !== k) bad.push(p + '%: ' + got); if (!__near(__px(c, 40 + 18, 40 - 4), col, 60)) bad.push(p + '%: not ' + col); }
    if (bad.length) throw new Error(bad.join(' · ')); return 'six thresholds right';
  }));

  await step('panels (§1): dark navy with a thick light outline; the title in a gap in the top border', () => ev(() => {
    const bad = [], c = __cv(500, 200), x = c.getContext('2d'); x.fillStyle = '#2B54CE'; x.fillRect(0, 0, 500, 200); rbPanel(x, 20, 40, 460, 140, 'Salary');
    const inGap = __px(c, 20 + 6 + 18 + 4, 40), border = __px(c, 400, 40), body = __px(c, 250, 150); if (!__near(border, RBK.line, 80)) bad.push('the border isn\'t light: ' + border.slice(0, 3)); if (__near(inGap, RBK.line, 40) && __near(__px(c, 20 + 6 + 18 + 8, 40), RBK.line, 40)) bad.push('no gap for the title');
    if (!(body[2] < 90 && body[0] < 40)) bad.push('the body isn\'t navy: ' + body.slice(0, 3));
    if (bad.length) throw new Error(bad.join(' · ')); return 'border ' + border.slice(0, 3) + ', navy ' + body.slice(0, 3);
  }));

  await step('the header and the bottom row (§1): the credits, the title between the logos and stars, the "i" opens this screen\'s Codex page; square icons, the main action at the bottom right, nothing overlapping', () => ev(() => {
    const bad = [], g = HH.game, ui = g.ui, P = ui.phone, row = rbBottomRow(ui, [{ icon: 'gear', onPress() {} }, { icon: 'home', onPress() {} }, { label: 'Front\noffice', onPress() {} }, { label: 'Team', onPress() {} }, { label: 'Hall of\nfame', onPress() {} }, { label: 'Continue', main: true, onPress() {} }]);
    if (row.length !== 6) bad.push(row.length + ' buttons'); const main = row.find(w => w.main), icons = row.filter(w => w.icon); if (!main || main.x + main.w < UI_W - 30) bad.push('the main action isn\'t at the right'); if (icons.some(w => Math.abs(w.w - w.h) > 1)) bad.push('an icon button isn\'t square');
    for (let i = 0; i < row.length; i++) for (let j = i + 1; j < row.length; j++) { const a = row[i], b = row[j]; if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) bad.push(a.label + ' overlaps ' + b.label); }
    if (row.some(w => w.x < 0 || w.x + w.w > UI_W || w.y + w.h > UI_H)) bad.push('a button off the screen'); if (P && row.some(w => w.h * ui.scale < CONFIG.ui.touchMinPx - 0.5)) bad.push('a button under the tap size');
    const c = testProLeague(503, g.save.data); g.save.data.career = c; c.events.length = 0; g.ui.clearTo(careerHub(g)); const host = { name: 'kittest', ownHelp: true, widgets: [rbInfoWidget(g)].concat(row), draw(ctx) { rbHeader(ctx, ui, { credits: 71, title: 'PBL ' + rbYearShort(rbYearOf(g.save.data)), lv: 'pro' }); } }; g.ui.push(host);
    RBF.boxes = []; let T = []; try { g.ui.trans = null; g.drawUI(g.ctx, g.W, g.H); } finally { T = (RBF.boxes || []).map(b => b.t); RBF.boxes = null; } if (!T.includes('71')) bad.push('no credits counter: ' + T.slice(0, 8).join(' | ')); if (!T.some(t => /^PBL '\d\d$/.test(t))) bad.push('no title');
    host.widgets[0].onPress(); const s = g.ui.screen; if (!s || s.name !== 'guide') bad.push('the "i" opened ' + (s && s.name));
    if (bad.length) throw new Error(bad.join(' · ')); return 'row ' + row.map(w => (w.icon || w.label.replace('\n', ' ')) + ' ' + Math.round(w.w)).join(', ') + ' · the "i" opens the Codex';
  }));

  await step('the season as a year: the first pro season is ' + 2031 + ', an amateur\'s freshman year eight before it', () => ev(() => {
    const bad = [], g = HH.game, a = __hs(504); const y0 = rbYearOf(g.save.data); a.season = 4; const y3 = rbYearOf(g.save.data); const c = testProLeague(505, g.save.data); g.save.data.career = c; const yp = rbYearOf(g.save.data);
    if (y0 !== FRN.year1 - 8) bad.push('freshman ' + y0); if (y3 !== FRN.year1 - 5) bad.push('senior ' + y3); if (yp !== FRN.year1 + (c.season || 1) - 1) bad.push('pro ' + yp); if (rbYearShort(2031) !== '\'31') bad.push(rbYearShort(2031));
    if (bad.length) throw new Error(bad.join(' · ')); return 'freshman ' + y0 + ', senior ' + y3 + ', pro season ' + (c.season || 1) + ' ' + yp;
  }));

  await step('the Art Lab\'s Kit 4.0 pages: each level draws without a fault', () => ev(() => {
    const bad = [], g = HH.game, i = LAB_VIEWS.indexOf('Kit 4.0'); if (i < 0) throw new Error('no Kit 4.0 view'); const errs0 = (window.HH_ERRORS || []).length;
    for (let pg = 0; pg < 3; pg++) { g.labOpts = { view: i, ch: 0, page: pg }; g.ui.clearTo(artLabScreen(g)); g.ui.trans = null; g.drawUI(g.ctx, g.W, g.H); }
    const errs = (window.HH_ERRORS || []).slice(errs0); if (errs.length) bad.push(errs.slice(0, 3).join(' | ')); if (bad.length) throw new Error(bad.join(' · ')); return 'three pages';
  }));

  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
