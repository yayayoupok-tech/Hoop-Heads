// V13 (2.0 §5 and §6): the Codex from every screen (the ? key, a "?" chip in a phone's margin, the desktop hint's
// "? Codex", the hub rail's button), opening the page about the screen you're on; every term the spec names on a
// Codex page with its numbers; stat tooltips (hover: a line and the Codex; tap: a card); the hub's red dots and the
// dots on the buttons behind them; What's new in 2.0 once after the update; stacked screens drawn alone; no text under
// the menus' pixel (cards included); six more celebrations (the Road, the shop, yours alone in games); one more arena a
// level; the wider pools of names and looks. Usage: node tests/polish.js
const { launch, openPage, runner } = require('./lib');
(async () => {
  const browser = await launch(); const R = runner('polish'); const D = await openPage(browser); const P = await openPage(browser, { phone: true }); const { ev } = D;
  const step = (n, f, pg) => R.step(n, f, pg || D);
  const AM = `(() => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const a = amCreate(g.save.data, { name: 'Polish Test', look: PRESET_LOOKS[4], number: 8, style: 'shooter', seed: 31 }); hsTryoutDrill(a, 30); hsTryoutGame(a, true, 7, 0); a.events.length = 0; a.fatigue = 20; a.injury = null; g.save.save(); return a; })()`;
  const PRO = `(() => { const g = HH.game; localStorage.clear(); g.save = new SaveSystem(); const c = testProLeague(21, g.save.data); g.save.data.career = c; c.events.length = 0; c.me.money = 6e6; c.me.fame = 40; g.save.save(); return c; })()`;
  // the page the Codex shows (its label), after one draw
  const PAGE = `(() => { const g = HH.game, s = g.ui.screen; if (!s || s.name !== 'guide') return s ? s.name : '(none)'; g.ui.trans = null; g.drawUI(g.ctx, g.W, g.H); const p = s.widgets[0]; return 'guide:' + p.options[p.get()]; })()`;
  const LABEL = `(t => t === 'traits' ? 'Traits' : (GUIDE_TOPICS.find(x => x[0] === t) || ['', '?'])[1])`;

  await step('the ? key opens the Codex from every screen at the page about it (the hub: its tab\'s), and Back returns to that screen; none on the title, the splash or the Codex itself', () => ev(([AM, PRO, PAGE, LABEL]) => {
    const g = HH.game, bad = [], seen = []; const press = () => { g.input.ui.help = (g.input.ui.help || 0) + 1; g.ui.update(0.016, g.input); };
    const check = (tag, open) => { open(); const s = g.ui.screen, name = s.name; const want = eval(LABEL)(codexTopicFor(g, s)); press(); const got = eval(PAGE); if (!got.startsWith('guide:' + want)) bad.push(tag + ': ' + got + ' (wanted ' + want + ')'); else seen.push(tag); g.ui.pop(); if (!g.ui.screen || g.ui.screen.name !== name) bad.push(tag + ': back to ' + (g.ui.screen && g.ui.screen.name)); };
    const a = eval(AM);
    check('menu', () => g.ui.clearTo(mainMenu(g)));
    for (const tab of HUB_TAB_IDS) check('hub ' + tab, () => { g.hubTab = tab; g.ui.clearTo(amHub(g)); });
    for (const [tag, f] of [['team', () => teamScreen(g)], ['news', () => headlinesScreen(g)], ['trophies', () => trophyCaseScreen(g)], ['story', () => storySoFarScreen(g)], ['records', () => recordsBookScreen(g)], ['stats', () => amHistoryScreen(g)], ['standings', () => amStandingsScreen(g)], ['ladder', () => ladderScreen(g)], ['recruiting', () => recruitingScreen(g)], ['shop', () => shopScreen(g, 'stock')], ['celebrations', () => shopScreen(g, 'celebs')], ['settings', () => settingsScreen(g)], ['how to play', () => howToScreen(g)], ['what\'s new', () => whatsNewScreen(g)], ['a stat card', () => statTipScreen(g, 'fatigue')]])
      check(tag, () => { g.hubTab = 'play'; g.ui.clearTo(amHub(g)); g.ui.push(f()); });
    const c = eval(PRO);
    for (const tab of HUB_TAB_IDS) check('pro hub ' + tab, () => { g.hubTab = tab; g.ui.clearTo(careerHub(g)); });
    for (const [tag, f] of [['player', () => playerScreen(g)], ['league', () => leagueScreen(g)], ['office', () => managementScreen(g)], ['staff', () => staffScreen(g)], ['franchise', () => franchiseScreen(g, meOf(c).club)], ['road', () => roadScreen(g)]])
      check(tag, () => { g.hubTab = 'play'; g.ui.clearTo(careerHub(g)); g.ui.push(f()); });
    for (const [tag, f] of [['title', () => titleScreen(g)], ['splash', () => splashScreen(g)]]) { g.ui.clearTo(f()); const n = g.ui.screen.name; press(); if (g.ui.screen.name !== n) bad.push(tag + ' opened ' + g.ui.screen.name); }
    g.ui.clearTo(mainMenu(g)); g.ui.push(statsGuideScreen(g, 'you')); press(); if (g.ui.stack.filter(s => s.name === 'guide').length !== 1) bad.push('the Codex opened over itself');
    g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return seen.length + ' screens';
  }, [AM, PRO, PAGE, LABEL]));

  await step('a desktop: the key hint reads "? Codex · Enter select · Esc back" and a click on "? Codex" opens it; the hub\'s rail has its own "?" (no hint there)', async () => {
    const r = await ev(AM_ => { const g = HH.game; eval(AM_); g.input.lastDevice = 'keyboard'; g.hubTab = 'play'; g.ui.clearTo(amHub(g)); g.ui.push(teamScreen(g)); g.drawUI(g.ctx, g.W, g.H); const h = g.ui._helpHint; return h ? { x: h.x + h.w / 2, y: h.y + h.h / 2, s: !!h.s } : null; }, AM);
    if (!r) throw new Error('no hint box'); await D.page.mouse.click(r.x, r.y); await D.page.waitForTimeout(120);
    const got = await ev(PAGE); if (!/^guide:Team/.test(got)) throw new Error('the click opened ' + got);
    const rail = await ev(() => { const g = HH.game; g.ui.clearTo(amHub(g)); const s = g.ui.screen, w = s.widgets.find(w => w.label === 'Codex' && w.kind === 'custom'); if (!w || !s.ownHelp || !s.noHint) return 'no rail button'; w.onPress(); return g.ui.screen.name; });
    if (rail !== 'guide') throw new Error('the rail: ' + rail); await ev(() => HH.game.ui.clearTo(mainMenu(HH.game))); return 'hint at ' + Math.round(r.x) + ',' + Math.round(r.y) + ' CSS px';
  });

  await step('a phone: every screen shows the "?" chip in the margin beside the 1280×720 area, 64 CSS px to tap, on no widget; a tap on it opens the Codex', async () => {
    const r = await P.ev(AM_ => { const g = HH.game; eval(AM_); const bad = [], out = []; const screens = [['menu', () => mainMenu(g)], ['hub', () => amHub(g)], ['team', () => teamScreen(g)], ['shop', () => shopScreen(g, 'celebs')], ['news', () => headlinesScreen(g)], ['what\'s new', () => whatsNewScreen(g)], ['a stat card', () => statTipScreen(g, 'hype')]];
      for (const [tag, f] of screens) { g.ui.clearTo(amHub(g)); if (tag !== 'hub') g.ui.push(f()); const ui = g.ui, s = ui.screen, rc = uiHelpRect(ui, s); if (!rc) { bad.push(tag + ': no chip'); continue; } if (rc.x < UI_W - 1 && rc.x + rc.w > 1) bad.push(tag + ': not in the margin'); if (rc.w * ui.scale < 63.5) bad.push(tag + ': ' + Math.round(rc.w * ui.scale) + ' px'); for (const w of s.widgets || []) if (!w.hidden && w.x < rc.x + rc.w && rc.x < w.x + w.w && w.y < rc.y + rc.h && rc.y < w.y + w.h) bad.push(tag + ': on ' + w.label); out.push(tag); }
      g.ui.clearTo(amHub(g)); const ui = g.ui, rc = uiHelpRect(ui, ui.screen); return { bad, out, tap: { x: ui.ox + (rc.x + rc.w / 2) * ui.scale, y: ui.oy + (rc.y + rc.h / 2) * ui.scale } }; }, AM);
    if (r.bad.length) throw new Error(r.bad.slice(0, 5).join(' | ')); await P.page.touchscreen.tap(r.tap.x, r.tap.y); await P.page.waitForTimeout(150); const got = await P.ev(PAGE); if (!/^guide:/.test(got)) throw new Error('the tap: ' + got);
    await P.ev(() => HH.game.ui.clearTo(mainMenu(HH.game))); return r.out.length + ' screens · chip at ' + Math.round(r.tap.x) + ',' + Math.round(r.tap.y);
  }, P);

  await step('the Codex has a page for every term the spec names (ratings, traits, hype, fame, confidence, coach trust, fatigue, money, team stars, the shop), each with what it does and its numbers', () => ev(([AM, PRO]) => {
    const g = HH.game, bad = []; const need = { you: ['OVR', 'The seven ratings'], buzz: ['Hype', 'Fame', 'Confidence'], team: ['Coach trust', 'Team stars'], body: ['Fatigue'], shop: ['Gear', 'The shop', 'Celebrations', 'Lifestyle'] }; let n = 0;
    for (const who of ['am', 'pro']) { if (who === 'am') eval(AM); else eval(PRO); const money = who === 'pro' ? 'Money' : 'Cash';
      for (const t of Object.keys(need).concat(['money'])) { const E = guideEntries(g, t), want = t === 'money' ? [money] : need[t]; for (const w of want) { const e = E.find(x => x.title === w); if (!e) { bad.push(who + ' ' + t + ': no ' + w); continue; } const text = e.lines.map(l => l[0]).join(' '); if (!/\d/.test(text)) bad.push(who + ' ' + w + ': no numbers'); n++; } } }
    if (!statsGuideScreen(g, 'traits') || !GUIDE_TOPICS.some(x => x[0] === 'shop')) bad.push('pages'); if (bad.length) throw new Error(bad.join(' | ')); return n + ' entries · topics: traits, ' + GUIDE_TOPICS.map(x => x[0]).join(', ');
  }, [AM, PRO]));

  await step('stat tooltips: the hub\'s meters and chips (hype, fame, confidence, trust, fatigue, OVR, stars, money) are hot spots; hovering one shows its line, a click opens its Codex page', () => ev(([AM, PRO, PAGE, LABEL]) => {
    const g = HH.game, ui = g.ui, bad = [], keys = new Set(); const hots = () => { ui.trans = null; g.drawUI(g.ctx, g.W, g.H); /* (a screen just pushed draws once its transition has shown it) */ return (ui.screen._hots || []).filter(h => h.info && h.info.stat); };
    const tryHot = (tag, h) => { const s = ui.screen, cx = ui.ox + (h.x + h.w / 2) * ui.scale, cy = ui.oy + (h.y + h.h / 2) * ui.scale; if (s.widgets.some(w => !w.hidden && w.kind !== 'text' && (h.x + h.w / 2) >= w.x && (h.x + h.w / 2) <= w.x + w.w && (h.y + h.h / 2) >= w.y && (h.y + h.h / 2) <= w.y + w.h)) return; g.input.hasTouch = false; g.input.mouse.x = cx; g.input.mouse.y = cy; g.input.mouse.moved = true; ui.update(0.016, g.input); if (!(s._hover && s._hover.info.stat === h.info.stat)) { bad.push(tag + ' ' + h.info.stat + ': no hover'); return; } ui.trans = null; g.drawUI(g.ctx, g.W, g.H); const name = s.name; g.input.mouse.clicked = true; ui.update(0.016, g.input); const got = eval(PAGE), want = eval(LABEL)(STAT_TIPS[h.info.stat][1]); if (!got.startsWith('guide:' + want)) bad.push(tag + ' ' + h.info.stat + ': ' + got); ui.pop(); if (ui.screen.name !== name) bad.push('back: ' + ui.screen.name); keys.add(h.info.stat); };
    eval(AM); for (const tab of ['me', 'train', 'team', 'play']) { g.hubTab = tab; ui.clearTo(amHub(g)); const H = hots(); const seen = new Set(); for (const h of H) if (!seen.has(h.info.stat)) { seen.add(h.info.stat); tryHot('am ' + tab, h); } }
    eval(PRO); for (const tab of ['me', 'team', 'play']) { g.hubTab = tab; ui.clearTo(careerHub(g)); const H = hots(); const seen = new Set(); for (const h of H) if (!seen.has(h.info.stat)) { seen.add(h.info.stat); tryHot('pro ' + tab, h); } }
    ui.clearTo(careerHub(g)); ui.push(teamScreen(g)); { const H = hots(); const t = H.find(h => h.info.stat === 'trust'); if (!t) bad.push('the team screen: no trust'); else tryHot('team screen', t); }
    for (const k of ['hype', 'fame', 'confidence', 'trust', 'fatigue', 'ovr', 'stars', 'money']) if (!keys.has(k)) bad.push('no ' + k + ' hot spot'); for (const k in STAT_TIPS) if (!statTipLine(k)) bad.push(k + ': no line');
    ui.clearTo(mainMenu(g)); g.input.mouse.x = g.input.mouse.y = 0; if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return [...keys].join(', ');
  }, [AM, PRO, PAGE, LABEL]));

  await step('a phone: tapping a stat opens its card (the line and a Codex button, 64 px targets); its Codex button opens the page', async () => {
    const r = await P.ev(AM_ => { const g = HH.game, ui = g.ui; eval(AM_); g.hubTab = 'me'; ui.clearTo(amHub(g)); ui.trans = null; g.drawUI(g.ctx, g.W, g.H); const h = (ui.screen._hots || []).find(h => h.info && h.info.stat === 'hype'); return h ? { x: ui.ox + (h.x + h.w / 2) * ui.scale, y: ui.oy + (h.y + h.h / 2) * ui.scale } : null; }, AM);
    if (!r) throw new Error('no hype hot spot on the phone'); await P.page.touchscreen.tap(r.x, r.y); await P.page.waitForTimeout(150);
    const c = await P.ev(() => { const g = HH.game, s = g.ui.screen; if (s.name !== 'stattip') return { err: 'opened ' + s.name }; const small = s.widgets.filter(w => w.h * g.ui.scale < 63.5 || w.w * g.ui.scale < 63.5).map(w => w.label); const cb = s.widgets.find(w => /Codex/.test(w.label)); cb.onPress(); g.ui.trans = null; g.drawUI(g.ctx, g.W, g.H); const q = g.ui.screen; return { small, page: q.name === 'guide' ? q.widgets[0].options[q.widgets[0].get()] : q.name }; });
    if (c.err) throw new Error(c.err); if (c.small.length) throw new Error('small: ' + c.small.join(', ')); if (!/^Hype/.test(c.page)) throw new Error('the Codex button: ' + c.page); await P.ev(() => HH.game.ui.clearTo(mainMenu(HH.game))); return 'card → ' + c.page;
  }, P);

  await step('the hub\'s red dots: a new offer (Team), new gear you can afford (Shop), a trait to pick, unread news or story (Me), a challenge you can take (Train); each button behind one has its dot, and looking clears it', () => ev(AM_ => {
    const g = HH.game, a = eval(AM_), bad = [], ok = []; const B = () => hubBadges(g, a); const btnOf = (tab, label) => { g.hubTab = tab; g.ui.clearTo(amHub(g)); return g.ui.screen.widgets.find(w => w.label === label); }; const dot = w => !!(w && w.dot && w.dot());
    a.offers = a.offers || []; a.offersSeen = a.offers.filter(o => !o.pulled).length; if (B().team) bad.push('a team dot with no new offer'); a.offers.push({ name: 'Test State', tier: 2, colors: ['#123456', '#FFFFFF'], coach: 'Coach Test', focus: 'shooting', fac: 2, visited: false, when: 'early', season: a.season });
    if (!B().team) bad.push('no team dot for an offer'); const rec = btnOf('team', 'Recruiting'); if (!dot(rec)) bad.push('no dot on Recruiting'); rec.onPress(); g.ui.pop(); if (B().team) bad.push('the team dot stays after looking'); else ok.push('offer');
    a.cash = 5000; const S = gearStock(a); S.visited = 0; S.fresh = S.ids.slice(); if (!B().shop) bad.push('no shop dot for new gear you can afford'); else ok.push('gear'); g.ui.push(shopScreen(g)); g.ui.pop(); if (B().shop) bad.push('the shop dot stays after a look');
    hubNewsSeen(a); hubStorySeen(a); if (B().me) bad.push('a me dot with nothing new'); pushNews(a, 'A test headline.'); if (!B().me) bad.push('no me dot for news'); const nw = btnOf('me', 'News'); if (!dot(nw)) bad.push('no dot on News'); nw.onPress(); g.ui.pop(); if (hubNewsUnread(a)) bad.push('news stays unread'); else ok.push('news');
    sagaOf(a).log.push({ arc: 'test', b: 0, pick: 'x', s: a.season }); if (!B().me || !hubStoryUnread(a)) bad.push('no me dot for story'); const st = btnOf('me', 'Story'); if (!dot(st)) bad.push('no dot on Story'); st.onPress(); g.ui.pop(); if (hubStoryUnread(a)) bad.push('the story stays unread'); else ok.push('story'); sagaOf(a).log.pop();
    const T = traitsOf(a); if (T) { T.offer = { ids: ['clutch', 'gymRat'] }; T.third = null; if (!B().me) bad.push('no me dot for a trait to pick'); else ok.push('trait'); T.offer = null; }
    const ch = hubChallengeOpen(a); if (B().train !== ch) bad.push('the train dot (' + B().train + ') ≠ a challenge you can take (' + ch + ')'); const db = btnOf('train', 'Depth chart'); if (db && dot(db) !== ch) bad.push('the Depth chart dot'); ok.push('challenge ' + ch);
    g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.join(' | ')); return ok.join(', ');
  }, AM));

  await step('What\'s new in 2.0: a save from before the update sees it once on the main menu (Got it saves that); a new player never does; the main menu\'s button reopens it', () => ev(() => {
    const g = HH.game, bad = []; localStorage.clear(); const d = defaultSave(); delete d.settings.whatsNewSeen; d.version = 5; localStorage.setItem(slotKey(1), JSON.stringify(d)); g.save = new SaveSystem(1);
    if (!whatsNewDue(g)) bad.push('an old save: not due'); g.ui.clearTo(mainMenu(g)); g.ui.update(0.016, g.input); if (g.ui.screen.name !== 'whatsnew') bad.push('not shown: ' + g.ui.screen.name);
    g.drawUI(g.ctx, g.W, g.H); g.ui.screen.widgets.find(w => w.label === 'Got it').onPress(); if (g.ui.screen.name !== 'menu') bad.push('Got it → ' + g.ui.screen.name); const saved = JSON.parse(localStorage.getItem(slotKey(1))).settings.whatsNewSeen; if (saved !== CONFIG.ui.whatsNew) bad.push('saved ' + saved);
    g.ui.clearTo(mainMenu(g)); g.ui.update(0.016, g.input); if (g.ui.screen.name !== 'menu') bad.push('shown twice');
    const b = g.ui.screen.widgets.find(w => /^What/.test(w.label)); if (!b) bad.push('no menu button'); else { b.onPress(); if (g.ui.screen.name !== 'whatsnew') bad.push('the button: ' + g.ui.screen.name); }
    localStorage.clear(); g.save = new SaveSystem(1); if (whatsNewDue(g)) bad.push('a new player: due'); if (WHATS_NEW.length < 10) bad.push(WHATS_NEW.length + ' items');
    g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.join(' | ')); return WHATS_NEW.length + ' items';
  }));

  await step('stacked screens: an overlay in the menus (a stat card, a confirm, a trait card) draws over the backdrop alone: the screen under it never draws', () => ev(AM_ => {
    const g = HH.game, a = eval(AM_), bad = []; const over = [['a stat card', () => statTipScreen(g, 'trust')], ['a confirm', () => confirmScreen(g, 'Sure?', () => {})], ['a trait card', () => traitCardScreen(g, 'clutch', null, 1)]];
    for (const [tag, f] of over) { g.hubTab = 'me'; g.ui.clearTo(amHub(g)); const hub = g.ui.screen, d0 = hub.draw; let drew = 0; hub.draw = function () { drew++; return d0.apply(this, arguments); }; g.ui.push(f()); g.ui.trans = null; g.drawUI(g.ctx, g.W, g.H); hub.draw = d0; if (drew) bad.push(tag + ': the hub drew under it'); if (!g.ui.screen.overlay) bad.push(tag + ': not an overlay'); }
    g.ui.clearTo(mainMenu(g)); if (bad.length) throw new Error(bad.join(' | ')); return over.length + ' overlays';
  }, AM));

  for (const [tag, pg] of [['a desktop', D], ['a phone', P]]) await step('legibility (' + tag + '): every string the hub and the main menu draw, the trading cards\' baked text included, is at the menus\' pixel or bigger (10 internal pixels a glyph)', () => pg.ev(AM_ => {
    const g = HH.game; eval(AM_); const out = []; for (const [n, f] of [['menu', () => g.ui.clearTo(mainMenu(g))], ['hub play', () => { g.hubTab = 'play'; g.ui.clearTo(amHub(g)); }], ['hub me', () => { g.hubTab = 'me'; g.ui.clearTo(amHub(g)); }], ['team', () => { g.ui.clearTo(amHub(g)); g.ui.push(teamScreen(g)); }]]) { f(); g.ui.trans = null; try { _cards.clear(); } catch (e) {} RBF.audit = []; g.drawUI(g.ctx, g.W, g.H); const s = RBF.audit; RBF.audit = null; const min = Math.min(...s); out.push(n + ' ' + min + '/' + RBF.kUI); if (min < RBF.kUI) throw new Error(n + ': a glyph at ' + min + ' < ' + RBF.kUI); }
    g.ui.clearTo(mainMenu(g)); return out.join(' · ');
  }, AM), pg);

  await step('celebrations: 14 (the 8 and 6 new); four unlock on the Road (an old save\'s milestones count), two are sold in the shop at the stage\'s price; your player does yours (or a mix of yours), the league\'s players the 8', () => ev(([AM, PRO]) => {
    const g = HH.game, bad = []; if (CELEB_ALL.length !== 14 || RIG_CELEBS_NEW.length !== 6) bad.push('counts'); for (const id of CELEB_ALL) if (!CELEB_NAMES[id]) bad.push(id + ' has no name');
    const roadOnes = ROAD.list.filter(r => r.celeb).map(r => r.celeb); if (roadOnes.length !== 4 || CONFIG.celebs.shop.length !== 2 || roadOnes.concat(CONFIG.celebs.shop).sort().join() !== RIG_CELEBS_NEW.slice().sort().join()) bad.push('unlocks: ' + roadOnes + ' + ' + CONFIG.celebs.shop);
    const a = eval(AM); if (celebOwnedList(a).length !== 8) bad.push('a new player owns ' + celebOwnedList(a).length);
    roadReward(a, roadDef('varsity')); if (!celebOwns(a, 'raiseRoof')) bad.push('the varsity milestone'); delete a.celebs; roadOf(a).done.colstart = { season: 1 }; if (!celebOwns(a, 'shush')) bad.push('an old save\'s milestone'); delete roadOf(a).done.colstart;
    a.cash = 100; if (celebBuy(a, 'earCup')) bad.push('bought without the money'); a.cash = 1000; const p = celebPrice(a); if (!celebBuy(a, 'earCup') || a.cash !== 1000 - p || p !== CONFIG.celebs.price.hs) bad.push('the buy: cash ' + a.cash); if (celebBuy(a, 'robot')) bad.push('bought a Road one'); if (celebBuy(a, 'earCup')) bad.push('bought twice');
    celebUse(a, 'earCup'); let d = amPlayerDef(a); if (d.celeb !== 'earCup' || !d.celebs.includes('earCup') || !d.celebs.includes('flex') || d.celebs.includes('robot')) bad.push('the def: ' + d.celeb + ' / ' + d.celebs);
    const pick = def => { const c = { a: { expr: 'hyped', exprT: 0 }, p: { def, name: 'T', stats: { pts: 4, fga: 3 } } }; rigEnter(c, 'celebrate'); return c.a.celeb; };
    if (pick(d) !== 'earCup') bad.push('the rig picked ' + pick(d)); celebUse(a, 'mix'); d = amPlayerDef(a); const mixed = new Set(); for (let i = 0; i < 40; i++) { const c = { a: { expr: 'hyped', exprT: 0 }, p: { def: d, name: 'T' + i, stats: { pts: i } } }; rigEnter(c, 'celebrate'); mixed.add(c.a.celeb); } for (const m of mixed) if (!d.celebs.includes(m)) bad.push('mixed in ' + m); if (![...mixed].some(m => RIG_CELEBS_NEW.includes(m))) bad.push('the mix never did a new one');
    const ai = new Set(); for (let i = 0; i < 60; i++) { const c = { a: { expr: 'hyped', exprT: 0 }, p: { def: { name: 'AI' }, name: 'AI' + i, stats: { pts: i } } }; rigEnter(c, 'celebrate'); ai.add(c.a.celeb); } for (const m of ai) if (!RIG_CELEBS.includes(m)) bad.push('the league did ' + m);
    const O = proEntryOffers(a), save = g.save.data; createCareerFromAmateur(save, a, O.offers[0]); const c = save.career; if (!celebOwns(c.me, 'earCup') || celebsOf(c.me).pick !== 'mix') bad.push('not carried to the pros'); const ed = engineDef(c, c.meId, {}); if (!ed.celebs || !ed.celebs.includes('earCup')) bad.push('the pro def'); const opp = engineDef(c, c.active.find(id => id !== c.meId), {}); if (opp.celebs) bad.push('an opponent has celebrations');
    const cv = document.createElement('canvas'); cv.width = 200; cv.height = 200; const cx = cv.getContext('2d'); for (const id of CELEB_ALL) for (const t of [0, 0.3, 0.7, 1.4]) drawMannequin(cx, amDrawDef(a), amKit(a), 100, 190, 160, 'hyped', 1, t, 'celebrate:' + id, { smooth: true });
    if (bad.length) throw new Error(bad.slice(0, 6).join(' | ')); return 'mix did ' + mixed.size + ' · price ' + gearMoney(p);
  }, [AM, PRO]));

  await step('arenas: one more a level, each its own palette and banners; high school and college play at home in their gym and away (and in the playoffs) in the other; six PBL franchises play in the Foundry', () => ev(([AM, PRO]) => {
    const g = HH.game, bad = []; const pairs = [['gym', 'fieldhouse', 'hs'], ['college', 'pavilion', 'college'], ['arena', 'foundry', 'pro']];
    for (const [a0, b0, k] of pairs) { if (!COURTS[b0] || venueKind(b0) !== k || venueKind(a0) !== k) bad.push(b0 + ': kind'); if (!COURT_ORDER.includes(b0)) bad.push(b0 + ': not in the court list'); const S = VENUE_STYLE[b0]; if (!S || !S.floor) bad.push(b0 + ': no style'); if (k !== 'hs' && !(S.banners && S.banners.length === 4)) bad.push(b0 + ': banners'); if (k === 'hs' && !(S.pennants && S.wall)) bad.push(b0 + ': pennants'); }
    const a = eval(AM), L = a.league; if (!L || !Array.isArray(L.home)) bad.push('no home/away schedule'); else { const w = L.week; const was = L.home[w]; L.home[w] = true; if (amCourtFor(a, false) !== 'gym') bad.push('home: ' + amCourtFor(a, false)); L.home[w] = false; if (amCourtFor(a, false) !== 'fieldhouse') bad.push('away: ' + amCourtFor(a, false)); if (amCourtFor(a, true) !== 'fieldhouse') bad.push('playoffs: ' + amCourtFor(a, true)); L.home[w] = was; }
    const n = frIds().filter(id => frArena(id) === 'foundry').length; if (n !== 6) bad.push(n + ' in the Foundry');
    const c = eval(PRO), ug = userGame(c); if (ug) { const o = careerMatchOpts(c, g.save.data, ug, true), hc = c.players[ug.h].club; if (o.court !== frArena(hc)) bad.push('pro court ' + o.court + ' for ' + hc); }
    for (const id of ['fieldhouse', 'pavilion', 'foundry']) { const img = labVenueShot(id, 640, 360); if (!img || !img.width) bad.push(id + ': no shot'); }
    if (bad.length) throw new Error(bad.join(' | ')); return 'the Foundry: ' + frIds().filter(id => frArena(id) === 'foundry').join(', ');
  }, [AM, PRO]));

  await step('names and looks: 150+ first and 170+ last names (invented, no repeats); 500 generated names never repeat; every hairstyle shows up for every skin tone; a quarter of the accessories come in their own color', () => ev(() => {
    const bad = []; if (GEN_FIRST.length < 150 || GEN_LAST.length < 170) bad.push(GEN_FIRST.length + ' / ' + GEN_LAST.length); if (new Set(GEN_FIRST).size !== GEN_FIRST.length || new Set(GEN_LAST).size !== GEN_LAST.length) bad.push('a repeat in the pools'); if (GEN_FIRST.concat(GEN_LAST).some(n => /NBA|Lakers|Celtics/i.test(n))) bad.push('a real name');
    const rng = new RNG(77), used = new Set(); for (let i = 0; i < 500; i++) genName(rng, used, null); if (used.size !== 500) bad.push(used.size + ' unique of 500');
    const hair = { dark: new Set(), light: new Set() }; let bands = 0, colored = 0; for (let i = 0; i < 3000; i++) { const L = randomLook(rng, { teen: i % 3 === 0 }); (L.skin >= 6 ? hair.dark : hair.light).add(L.hair); normLook(L, 'x' + i); if (L.acc.headband) { bands++; if (L.acc.headbandColor) colored++; } }
    for (const k of ['dark', 'light']) if (hair[k].size !== 14) bad.push(k + ' skin: ' + hair[k].size + ' hairstyles'); const share = colored / Math.max(1, bands); if (share < 0.15 || share > 0.35) bad.push('colored headbands ' + share.toFixed(2));
    if (bad.length) throw new Error(bad.join(' | ')); return GEN_FIRST.length + ' × ' + GEN_LAST.length + ' names · headbands in color ' + Math.round(share * 100) + '%';
  }));

  console.log(D.errors.length || P.errors.length ? 'page errors: ' + D.errors.concat(P.errors).slice(0, 5).join(' | ') : 'no page errors');
  const f = R.done(); await browser.close(); process.exit(f ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
