// Shared helpers for the test scripts. Playwright comes from node_modules (npm i -D playwright && npx playwright install
// chromium) or from a global install. Every page records page errors, console errors, recovered frame exceptions and any
// network request other than the optional Google Font (the game's only allowed request).
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const FILE = 'file://' + path.join(ROOT, 'index.html');
function loadPlaywright() {
  for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) { try { return require(id); } catch (e) { /* try the next one */ } }
  throw new Error('Playwright not found. Run: npm i -D playwright && npx playwright install chromium');
}
async function launch() { const { chromium } = loadPlaywright(); const o = {}; if (process.env.CHROMIUM_PATH) o.executablePath = process.env.CHROMIUM_PATH; return chromium.launch(o); }
const isFont = u => /^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u || '');
async function openPage(browser, opts = {}) {
  const phone = !!opts.phone;
  const context = await browser.newContext(phone ? { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : { viewport: { width: 1280, height: 720 } });
  const page = await context.newPage(); const errors = []; const notes = new Set();
  page.on('pageerror', e => errors.push('[pageerror] ' + e.message + ' ' + String(e.stack || '').split('\n').slice(1, 3).join(' | ')));
  page.on('console', m => {
    const t = m.text(), url = (m.location() || {}).url || '';
    if (m.type() === 'error') { if (isFont(url) || /ERR_CERT|ERR_NAME|ERR_INTERNET|ERR_PROXY|ERR_TUNNEL/.test(t) && isFont(url)) notes.add('font request failed (allowed; falls back to system fonts)'); else errors.push('[console.error] ' + t + (url ? ' @ ' + url : '')); }
    else if (m.type() === 'warning' && /^\[(frame|art lab|invariant)\]/.test(t)) errors.push('[warning] ' + t);
  });
  page.on('request', r => { const u = r.url(); if (!u.startsWith('file:') && !u.startsWith('data:') && !u.startsWith('blob:') && !isFont(u)) errors.push('[network] unexpected request ' + u); });
  await page.goto(FILE + (opts.query || '')); await page.waitForTimeout(opts.wait || 600);
  const ev = (f, a) => page.evaluate(f, a);
  const api = {
    page, context, errors, notes, ev,
    screen: () => ev(() => (HH.game.ui.screen ? HH.game.ui.screen.name : '(none)')),
    async press(re) { await ev(src => { const s = HH.game.ui.screen; if (!s) throw new Error('no screen'); const w = (s.widgets || []).find(w => !w.hidden && w.label && new RegExp(src).test(w.label)); if (!w) throw new Error('no widget /' + src + '/ on ' + s.name + ': ' + (s.widgets || []).filter(w => !w.hidden && w.label).map(w => w.label).join(' | ')); (w.onPress || (() => w.set && w.set(!w.get())))(); }, re.source); await page.waitForTimeout(opts.stepWait || 200); },
    async expectScreen(name) { const n = await api.screen(); if (n !== name) throw new Error('expected screen ' + name + ', got ' + n); },
    async shot(file, type) { await page.screenshot({ path: file, type: type || (file.endsWith('.png') ? 'png' : 'jpeg'), quality: file.endsWith('.png') ? undefined : 88 }); },
    frameErrors: () => ev(() => (window.HH_ERRORS || []).slice()),
  };
  return api;
}
// A tiny step runner: prints one line per step and counts failures.
function runner(title) {
  const r = { title, ok: 0, fail: 0, lines: [] };
  r.step = async (name, fn, pageApi) => {
    const before = pageApi ? pageApi.errors.length : 0; let err = null;
    try { await fn(); } catch (e) { err = e; }
    const newErr = pageApi ? pageApi.errors.slice(before) : [];
    const good = !err && !newErr.length; good ? r.ok++ : r.fail++;
    const line = (good ? 'PASS ' : 'FAIL ') + name + (err ? '  — ' + String(err.message).split('\n')[0] : '') + (newErr.length ? '  — ' + newErr.slice(0, 3).join(' || ') : '');
    r.lines.push(line); console.log(line); return good;
  };
  r.done = () => { console.log(title + ': ' + r.ok + ' passed, ' + r.fail + ' failed'); return r.fail; };
  return r;
}
module.exports = { ROOT, FILE, loadPlaywright, launch, openPage, runner };
