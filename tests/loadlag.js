// V15: load lag. Walks the game's screen changes and game loads in one browser, at 4× CPU throttle (Chrome's "4x
// slowdown", about a mid-range phone) and at 1×, with the browser's long-task observer (every main-thread task over
// 50 ms), and prints a table: for each step, how long until its first frame, its longest task and its total blocked
// time (the long tasks' sum).
//   startup     navigation → the title screen's first frame; then Enter → the menu
//   screens     creation, events, a message, tips, HOME's five tabs, the scouting report, LEAGUE's standings, the
//               Season review and its awards night, the league, a franchise, the crew, the offers, signing day, the
//               Codex, the main menu's screens (3.0: no story cards, no press room, no staff)
//   game loads  the tryout shootout, the tryout 1v1, a high school game (HOME's PLAY: 3.0 goes straight to the game), a
//               pro game (TIP OFF on the scouting report), a Quick 1v1: the press → the first frame of the game (not a
//               "Warming up..." frame), then 2.5 s of play
// Targets:
//   4×  no task over 100 ms on a screen change · a game's first frame within 300 ms of the press, no task over 100 ms
//       after it · the title within 1.5 s of navigation, under 1.5 s of long tasks before the menu responds
//   1×  no task over 50 ms anywhere
// A press runs at the start of a frame, as a click or a key does in the game (the press, the new screen and its first
// draw land in the same task). A step's window runs from its press to the next step's press, and a task counts in the
// window where it ends. The player dwells on a screen as a person would (1.2 s on most; 2.5 s on the screen before a game:
// HOME, the scouting card, the tryout card, the Quick 1v1 setup), and the dwell is part of the step. The test's own work
// (fast-forwarding a game to its end, Jump to pro, forcing a starting spot) is marked and left out. Fails on any miss.
// Usage: node tests/loadlag.js [--rate=4,1] [--phone] [--only=startup|career|pro|quick]
const { launch, openPage } = require('./lib');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const RATES = arg('rate', '4,1').split(',').map(Number), PHONE = process.argv.includes('--phone'), ONLY = arg('only', '');
const LIMIT = { screen4: 100, load4: 300, after4: 100, title4: 1500, boot4: 1500, any1: 50 };

// Installed before the page's own script: the long-task observer, key times, and a hook on the game's frame that runs
// a pending press first and logs which screen each frame showed.
const INIT = () => {
  window.__LT = []; window.__FR = []; window.__X = []; window.__F = 0; window.__press = null;
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__LT.push([e.startTime, e.duration]); }).observe({ type: 'longtask', buffered: true }); } catch (e) { window.__noLT = String(e); }
  window.addEventListener('keydown', () => { window.__keyAt = performance.now(); }, true);
  const raf = window.requestAnimationFrame.bind(window); let hooked = false, last = '';
  window.requestAnimationFrame = cb => raf(t => {
    if (!hooked && window.HH && window.HH.game) { hooked = true; const g = window.HH.game, orig = g.frame;
      g.frame = function (n) {
        const p = window.__press; if (p && !p.at) { p.at = performance.now(); try { p.fn(g); } catch (e) { p.err = String(e && e.message || e); } }
        orig.call(this, n);
        const now = performance.now(); window.__F++; const s = g.mode === 'match' ? (g.warming ? 'warming' : 'match') : ((g.ui.screen && g.ui.screen.name) || '-');
        if (s !== last) { window.__FR.push([now, s]); last = s; } window.__lastFrame = now;
        if (p && p.at && !p.first && now > p.at) p.first = now; /* the first frame drawn after the press */
        if (p && p.at && p.want && !p.firstWant && (p.want === s)) p.firstWant = now;
      }; }
    cb(t);
  });
};

(async () => {
  const b = await launch(); let fails = 0; const tables = [];
  for (const rate of RATES) {
    const rows = []; let err = null;
    const P = await openPage(b, { tips: true, wait: 50, phone: PHONE, before: async (page, ctx) => { const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate }); await page.addInitScript(INIT); } });
    const { ev, page } = P; const wait = ms => page.waitForTimeout(ms);
    const now = () => ev(() => performance.now());
    const until = async (f, ms, a) => { const t0 = Date.now(); for (;;) { const v = await ev(f, a); if (v) return v; if (Date.now() - t0 > ms) return null; await wait(25); } };
    // in-page helpers: press a widget by its label, mark the test's own work
    const helpers = () => ev(() => {
      window.__H = {
        P(src) { const g = HH.game, s = g.ui.screen; if (!s) throw new Error('no screen'); if (s.finish) s.finish(); const re = new RegExp(src); const w = (s.widgets || []).find(w => !w.hidden && w.enabled !== false && w.label && re.test(w.label)); if (!w) throw new Error('no /' + src + '/ on ' + s.name + ': ' + (s.widgets || []).filter(w => !w.hidden && w.label).map(w => w.label).join(' | ')); (w.onPress || (() => w.set && w.set(!w.get())))(); },
        has(src) { const s = HH.game.ui.screen, re = new RegExp(src); return !!(s && (s.widgets || []).find(w => !w.hidden && w.enabled !== false && w.label && re.test(w.label))); },
        work(f) { const t0 = performance.now(); try { return f(); } finally { window.__X.push([t0, performance.now()]); } }, // the test's own work: its tasks are left out
      };
    });
    // One step: the press runs at the start of the next frame; then the dwell. want: the screen (or 'match') that should show.
    const step = async (name, cat, code, o = {}) => {
      await ev(([code, want]) => { window.__press = { fn: g => (0, eval)('(g => { ' + code + ' })')(g), want }; }, [code, o.want || null]);
      const p = await until(() => window.__press && window.__press.at ? { at: window.__press.at, err: window.__press.err || null } : null, 20000);
      if (!p) throw new Error(name + ': the press never ran');
      if (p.err) throw new Error(name + ': ' + p.err);
      if (o.want) { const ok = await until(() => !!window.__press.firstWant, o.wantMs || 30000); if (!ok) throw new Error(name + ': ' + o.want + ' never showed (at ' + await ev(() => HH.game.ui.screen ? HH.game.ui.screen.name : HH.game.mode) + ')'); }
      else await until(() => !!window.__press.first, 20000);
      await wait(o.dwell != null ? o.dwell : 1200);
      const r = await ev(() => ({ at: window.__press.at, first: window.__press.firstWant || window.__press.first }));
      rows.push({ name, cat, at: r.at, first: r.first, load: !!o.load });
      return r;
    };
    const work = (f, a) => ev(([src, a]) => __H.work(() => (0, eval)('(' + src + ')')(a)), [f.toString(), a]);
    const screen = () => ev(() => { const g = HH.game; return g.ui.screen ? g.ui.screen.name : g.mode === 'match' ? 'match' : '(none)'; });
    // the screens a career puts up on its own (tips, the genes, a message, the Season review, awards...), each pressed through as a step
    const CATS = { tip: 'tips', whatsnew: 'dialogs', confirm: 'dialogs', message: 'messages', amevent: 'events', genes: 'events', recap: 'events', seasonreview: 'events', ceremony: 'awards', roadcard: 'events', traitevent: 'events', commitday: 'events', crewrecap: 'events', allstarweekend: 'events', tourney: 'events' }; // (3.0: a message for 2.x's dialogs and story cards; no press room, rivals or trait picks)
    const through = async (hubName, label) => {
      for (let i = 0; i < 40; i++) {
        const s = await screen(); if (s === hubName) return;
        const key = await ev(() => { const s = HH.game.ui.screen; if (!s) return null; if (s.finish) s.finish(); const L = ['^▼$', '^GOT IT$', '^Got it$', '^(Continue|CONTINUE)$', '^BACK TO THE HUB$', '^Take ', '^Sim it$', '^SIM IT$', '^Back$']; for (const re of L) if (__H.has(re)) return re; const w = (s.widgets || []).find(w => !w.hidden && w.enabled !== false && w.primary && w.label); if (w) return '^' + w.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'; const any = (s.widgets || []).find(w => !w.hidden && w.enabled !== false && w.onPress); return any ? '#first' : null; }); /* (the press: an answer, the first one) */
        if (!key) { if (s === 'title-parade' || s === 'title-ring' || s === 'title-banner' || s === 'ceremony') { await ev(() => { const s = HH.game.ui.screen; if (s.onTap) s.onTap(0, 0); }); await wait(200); continue; } throw new Error('stuck on ' + s + ' on the way to ' + hubName); }
        await step(label + ': ' + s + ' ' + key.replace(/[\^$\\]/g, ''), CATS[s] || 'events', key === '#first' ? "const s = g.ui.screen; s.widgets.find(w => !w.hidden && w.enabled !== false && w.onPress).onPress();" : '__H.P(' + JSON.stringify(key) + ')');
      }
      throw new Error('never reached ' + hubName);
    };
    // a game load: PLAY → the first game frame, 2.5 s of play, then the test fast-forwards it (left out) and the result
    // screens are pressed through as steps
    const game = async (name, code, hubName) => {
      await step(name, 'game load', code, { want: 'match', load: true, dwell: 2500 });
      await work(() => { const g = HH.game, m = g.match; if (!m) return 0; for (const p of m.players) if (p.controlled) { p.controlled = false; p.input.reset(); } let n = 0; while (!m.ended && n < 120 * 60 * 30) { simStep(m, STEP); n++; if (m.contest3 && m.contest3.done && m.phaseT > 0) m.ended = true; } return n; });
      await step(name + ' → its result', 'screens', '/* the frame after the end opens the result */', { dwell: 1400 });
      if (hubName) await through(hubName, name);
    };
    try {
      // ---- startup ----
      const boot = await until(() => { const f = window.__FR.find(x => x[1] === 'title'); return f ? f[0] : null; }, 60000);
      if (!boot) throw new Error('the title never showed');
      const firstAny = await ev(() => window.__FR.length ? window.__FR[0] : null);
      await helpers(); await wait(1000);
      await page.keyboard.press('Enter');
      const menu = await until(() => { const f = window.__FR.find(x => x[1] === 'menu'); return f ? f[0] : null; }, 20000);
      if (!menu) throw new Error('the menu never showed');
      const keyAt = await ev(() => window.__keyAt);
      await wait(1200);
      rows.push({ name: 'startup: navigation → title (first frame: ' + firstAny[1] + ' at ' + Math.round(firstAny[0]) + ' ms)', cat: 'startup', at: 0, first: boot, title: true });
      rows.push({ name: 'startup: title → menu (Enter)', cat: 'startup', at: keyAt, first: menu });
      const bootBlock = await ev(m => window.__LT.filter(t => t[0] + t[1] <= m + 1).reduce((s, t) => s + t[1], 0), menu);
      rows.bootBlock = bootBlock;
      if (!ONLY || /career|pro/.test(ONLY) || ONLY === 'startup') {
        if (ONLY !== 'startup') {
          // ---- a new career: creation, tips, events, HOME's five tabs (3.0 §2.1) ----
          await step('menu → creation', 'creation', "__H.P('^START YOUR CAREER$')", { want: 'create' });
          await step('creation: a preset face', 'creation', "const s = g.ui.screen, w = s.widgets.find(w => w.kind === 'custom' && w.onPress && !w.hidden) || s.widgets.find(w => w.label === 'PLAYER'); w.onPress(); /* (a phone has no preset faces: its PLAYER page) */");
          await step('creation → face & accessories', 'creation', "__H.P('^Face shape')", { want: 'customize' }).catch(async e => { rows.push({ name: 'creation → face & accessories (skipped: ' + e.message.split(':')[1] + ')', cat: 'info' }); });
          if (await screen() !== 'create') await step('face & accessories → creation', 'creation', "g.ui.pop()", { want: 'create' });
          await step('creation → the hub (START HIGH SCHOOL)', 'creation', "if (g.newCareer) g.newCareer.seed = 2024; __H.P('^START HIGH SCHOOL$')");
          await through('amhub', 'new career');
          for (const t of ['League', 'Events', 'Career', 'Store', 'Home']) { await step('tab → ' + t, 'tabs', "__H.P('^Tab: " + t + "$')"); if (await screen() !== 'amhub') await through('amhub', 'tab ' + t); }
          await step('HOME → the Codex', 'screens', "g.ui.push(statsGuideScreen(g))");
          await step('Codex → HOME', 'screens', "g.ui.pop()", { want: 'amhub' });
          await step('HOME → a message', 'messages', "const a = g.save.data.c1; a.inbox = [{ kind: 'dialog', title: 'A SUMMER CAMP INVITE', icon: 'mail', inS: a.season, lines: ['The Elite 100 camp wants you in July: three days against the best juniors in the country, and every college coach in the stands.', 'It costs $400 and a week of rest before the season.'], choice: [{ label: 'Go to the camp', note: 'Fame +4 · fatigue +12 · −$400', fx: { fame: 4, fatigue: 12, money: -400 } }, { label: 'Rest at home', note: 'Fatigue −10', fx: { fatigue: -10 }, def: true }] }]; holderOf(a).msgWk = null; /* 3.0 (§2.3): HOME shows the inbox's message (2.x's story cards) */", { want: 'message' });
          await through('amhub', 'message');
          // ---- the tryouts: the shootout and the 1v1 ----
          await step('HOME → tryouts', 'screens', "__H.P('^TRYOUTS$')", { want: 'tryout', dwell: 2500 });
          await game('tryout shootout', "__H.P('^PLAY THE SHOOTOUT$')", null);
          if (await screen() === 'tryoutpost') await step('shootout result → tryouts', 'screens', "__H.P('^CONTINUE$')");
          if (await screen() !== 'tryout') await through('tryout', 'shootout');
          await wait(1300); /* the tryout card, before the 1v1 */
          await game('tryout 1v1', "__H.P('^PLAY THE 1V1')", null);
          for (let i = 0; i < 6 && await screen() !== 'amhub'; i++) { const s = await screen(); if (s === 'tryoutpost') await step('tryout result: CONTINUE', 'screens', "__H.P('^CONTINUE$')"); else await through('amhub', 'tryouts'); }
          // ---- a high school game: the scouting card (HOME's Scout report; a phone's MORE…), back on HOME, then PLAY (3.0 §2.2: straight to the game) ----
          await work(() => { const a = HH.game.save.data.c1; if (a && a.team && !isStarter(a)) { const L = ladderOf(a); L.splice(L.indexOf('me'), 1); L.unshift('me'); } if (a) a.ineligible = 0; /* (3.0: you start; the depth chart follows form) */ HH.game.hubTab = 'home'; HH.game.ui.screen.build && HH.game.ui.screen.build(); });
          await step('HOME → scouting card', 'screens', "if (__H.has('^Scout report$')) __H.P('^Scout report$'); else g.ui.push(amPregameScreen(g));", { want: 'ampregame' });
          await step('scouting card → HOME', 'screens', "g.ui.pop()", { want: 'amhub', dwell: 2500 });
          await game('high school game', "__H.P('^PLAY$')", 'amhub');
          await step('HOME → standings', 'league', "g.ui.push(standingsChartScreen(g))", { want: 'standings' }).catch(e => rows.push({ name: 'HOME → standings (skipped: ' + e.message + ')', cat: 'info' })); /* 3.0 (§4.2): LEAGUE's standings */
          if (await screen() !== 'amhub') await step('standings → HOME', 'league', "g.ui.pop()", { want: 'amhub' });
          await step('HOME → the Season review', 'awards', "const a = g.save.data.c1; a.events = [{ kind: 'ceremony', title: 'AWARDS NIGHT', sub: (a.school || 'Your school') + ' · season ' + a.season, rows: ['District MVP', 'All-District 1st team', 'District champion'].map(x => ({ award: x, name: a.name, mine: true })) }]; /* 3.0 (§2.2): the season's end is one screen (HOME shows it); awards night is its button */", { want: 'seasonreview' });
          await step('Season review → awards night', 'awards', "__H.P('^Awards night$')", { want: 'ceremony' });
          await through('amhub', 'awards');
        }
      }
      if (!ONLY || ONLY === 'pro') {
        // ---- the pros: Jump to pro (the test's work), the combine, the offers, signing day, the pros' HOME ----
        if (ONLY === 'pro') await work(() => { const g = HH.game; g.save.data.c1 = amCreate(g.save.data, { name: 'Lag Test', look: PRESET_LOOKS[3], number: 7, style: 'slasher', seed: 2024 }); });
        const j = await work(() => { const g = HH.game; const r = devJumpToPro(g, 2024); g.ui.clearTo(amHub(g)); g.ui.push(amCombineScreen(g)); return r; });
        if (!j || !j.ok) throw new Error('Jump to pro: ' + JSON.stringify(j));
        await wait(1500); await ev(() => { const s = HH.game.ui.screen; if (s && s.onTap) s.onTap(0, 0); }); await wait(600);
        await step('combine → offers', 'offers', "__H.P('^PRO OFFERS$')", { want: 'prooffers' });
        await step('offers → signing day', 'signing day', "__H.P('^SIGN WITH THE ')", { want: 'draft', dwell: 1500 });
        await ev(() => { const s = HH.game.ui.screen; if (s && s.onTap) s.onTap(0, 0); }); await wait(400);
        await step('signing day → HOME', 'signing day', "__H.P('^START YOUR PRO CAREER$')");
        await through('career', 'pro');
        for (const t of ['League', 'Events', 'Career', 'Store', 'Home']) { await step('pro tab → ' + t, 'tabs', "__H.P('^Tab: " + t + "$')"); if (await screen() !== 'career') await through('career', 'pro tab ' + t); }
        await step('HOME → the league', 'league', "g.ui.push(leagueScreen(g))", { want: 'league' });
        await step('league → HOME', 'league', "g.ui.pop()", { want: 'career' });
        await step('HOME → your franchise', 'franchise', "const c = g.save.data.career; g.ui.push(franchiseScreen(g, meOf(c).club))", { want: 'franchise' });
        await step('franchise → HOME', 'franchise', "g.ui.pop()", { want: 'career' });
        await step('HOME → the crew', 'crew', "g.ui.push(crewScreen(g))", { want: 'crew' }); /* 3.0 (§7): the crew (2.x's staff) */
        await step('crew → HOME', 'crew', "g.ui.pop()", { want: 'career' });
        await work(() => { const c = HH.game.save.data.career; if (c && c.team && !isStarter(c)) { const L = ladderOf(c); L.splice(L.indexOf('me'), 1); L.unshift('me'); } /* (3.0: you start; the depth chart follows form) */ HH.game.hubTab = 'home'; HH.game.ui.screen.build && HH.game.ui.screen.build(); });
        await step('HOME → pregame', 'screens', "if (__H.has('^Scout report$')) __H.P('^Scout report$'); else g.ui.push(pregameScreen(g, userGame(g.save.data.career)));", { want: 'pregame', dwell: 2500 }); /* 3.0: HOME's Scout report (a phone's MORE…); PLAY would go straight to the game */
        await game('pro game', "__H.P('^TIP OFF$')", 'career');
        await step('HOME → the Season review', 'awards', "const c = g.save.data.career; const ids = c.active; const aw = { mvp: c.meId, dpoy: ids[1], roy: ids[2], mip: ids[3], scoring: c.meId, finalsMvp: ids[4], allLeague: [c.meId, ids[5], ids[6]] }; c.events = [{ kind: 'ceremony', title: 'AWARDS NIGHT', sub: 'The PBL · season ' + c.season, rows: proCeremonyRows(c, aw) }]; /* 3.0 (§2.2): HOME shows the Season review; awards night is its button */", { want: 'seasonreview' });
        await step('Season review → awards night', 'awards', "__H.P('^Awards night$')", { want: 'ceremony' });
        await through('career', 'pro awards');
        await step('HOME → main menu', 'screens', "g.ui.clearTo(mainMenu(g))", { want: 'menu' });
      }
      if (!ONLY || ONLY === 'quick') {
        if (await screen() !== 'menu') await step('→ main menu', 'screens', "g.ui.clearTo(mainMenu(g))", { want: 'menu' });
        for (const [lbl, nm] of [['Settings', 'settings'], ['How to play', 'howto'], ['Hall of Fame', 'halloffame'], ['Save slots', 'slots']]) {
          await step('menu → ' + lbl, 'screens', "__H.P('^" + lbl + "$')");
          await step(lbl + ' → menu', 'screens', "g.ui.pop()", { want: 'menu' });
        }
        await step('menu → Quick 1v1 setup', 'screens', "__H.P('^Quick 1v1$')", { want: 'quick', dwell: 2500 });
        await game('Quick 1v1', "__H.P('^PLAY$')", null);
      }
    } catch (e) { err = e; }
    // ---- the table ----
    const data = await ev(() => ({ LT: window.__LT, X: window.__X, FR: window.__FR, noLT: window.__noLT || null, end: performance.now(), errors: window.HH_ERRORS || [] }));
    await P.context.close();
    const isX = t => data.X.some(x => t[0] < x[1] + 1 && t[0] + t[1] > x[0] - 1); // a task of the test's own work
    const LT = data.LT.filter(t => !isX(t)), skipped = data.LT.length - LT.length;
    const timed = rows.filter(r => r.at != null).sort((a, b) => a.at - b.at);
    const out = [], miss = []; let worst1 = 0;
    for (let i = 0; i < timed.length; i++) {
      const r = timed[i], t0 = r.title ? -1e9 : r.at, t1 = i + 1 < timed.length && !timed[i + 1].title ? timed[i + 1].at : data.end + 1; // a task counts where it ends
      const mine = LT.filter(t => t[0] + t[1] > t0 && t[0] + t[1] <= t1), longest = mine.reduce((m, t) => Math.max(m, t[1]), 0), blocked = mine.reduce((s, t) => s + t[1], 0);
      const firstMs = r.first != null ? r.first - (r.title ? 0 : r.at) : null;
      const after = r.load && r.first != null ? mine.filter(t => t[0] >= r.first - 1).reduce((m, t) => Math.max(m, t[1]), 0) : null;
      let ok = true, why = '';
      if (rate >= 4) {
        if (r.title) { ok = firstMs <= LIMIT.title4 && rows.bootBlock <= LIMIT.boot4; why = ok ? '' : 'title ' + Math.round(firstMs) + ' ms (≤ ' + LIMIT.title4 + '), blocked before the menu ' + Math.round(rows.bootBlock) + ' ms (≤ ' + LIMIT.boot4 + ')'; }
        else if (r.load) { ok = firstMs != null && firstMs <= LIMIT.load4 && after <= LIMIT.after4; why = ok ? '' : 'first frame ' + (firstMs == null ? 'never' : Math.round(firstMs) + ' ms') + ' (≤ ' + LIMIT.load4 + '), longest task after it ' + Math.round(after) + ' ms (≤ ' + LIMIT.after4 + ')'; }
        else { ok = longest <= LIMIT.screen4; why = ok ? '' : 'a ' + Math.round(longest) + ' ms task (≤ ' + LIMIT.screen4 + ')'; }
      } else { ok = longest <= LIMIT.any1; why = ok ? '' : 'a ' + Math.round(longest) + ' ms task (no task over ' + LIMIT.any1 + ')'; }
      worst1 = Math.max(worst1, longest); if (!ok) miss.push(r.name + ': ' + why);
      out.push([ok ? 'ok' : 'MISS', r.cat, r.name, firstMs == null ? '—' : Math.round(firstMs) + '', Math.round(longest) + '', Math.round(blocked) + '', mine.length + '', after == null ? '' : Math.round(after) + '']);
    }
    for (const r of rows.filter(r => r.at == null)) out.push(['', r.cat, r.name, '', '', '', '', '']);
    const W = [4, 12, 58, 7, 8, 8, 6, 7], pad = (s, w, right) => { s = String(s); if (s.length > w) s = s.slice(0, w - 1) + '…'; return right ? s.padStart(w) : s.padEnd(w); };
    const lines = ['', 'load lag at ' + rate + '× CPU' + (PHONE ? ' (phone 844×390 @2x)' : ' (desktop 1280×720)') + ' — ms from the press; a task counts in the step where it ends' + (skipped ? ' · ' + skipped + ' long tasks of the test\'s own work left out' : '') + (data.noLT ? ' · NO LONG-TASK OBSERVER: ' + data.noLT : ''),
      [pad('', W[0]), pad('kind', W[1]), pad('step', W[2]), pad('first', W[3], 1), pad('longest', W[4], 1), pad('blocked', W[5], 1), pad('tasks', W[6], 1), pad('after', W[7], 1)].join(' ')];
    for (const o of out) lines.push(o.map((s, i) => pad(s, W[i], i >= 3)).join(' '));
    lines.push('startup: long tasks before the menu responded: ' + Math.round(rows.bootBlock || 0) + ' ms (' + LT.filter(t => t[0] + t[1] <= (timed[1] ? timed[1].first : 0) + 1).length + ' tasks)');
    if (err) { lines.push('ERROR: ' + String(err.message || err).split('\n')[0]); fails++; }
    if (data.errors.length) { lines.push('frame errors: ' + data.errors.join(' | ')); fails++; }
    if (P.errors.length) { lines.push('page errors: ' + P.errors.slice(0, 4).join(' | ')); fails++; }
    lines.push(miss.length ? miss.length + ' MISSES at ' + rate + '×:' : 'every step met its target at ' + rate + '×'); for (const m of miss) lines.push('  ' + m);
    if (miss.length) fails++;
    for (const l of lines) console.log(l); tables.push(lines);
  }
  console.log('\ntargets: 4× — screen changes ≤ ' + LIMIT.screen4 + ' ms a task; a game\'s first frame ≤ ' + LIMIT.load4 + ' ms after PLAY and no task over ' + LIMIT.after4 + ' ms after it; the title ≤ ' + LIMIT.title4 + ' ms, ≤ ' + LIMIT.boot4 + ' ms of long tasks before the menu · 1× — no task over ' + LIMIT.any1 + ' ms');
  await b.close(); process.exit(fails ? 1 : 0);
})();
