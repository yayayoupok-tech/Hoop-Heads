// Syntax check: extract the game's <script> from index.html and run node --check on it.
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const a = html.indexOf('<script>'), b = html.lastIndexOf('</script>');
if (a < 0 || b < a) { console.error('no inline <script> found'); process.exit(1); }
const file = path.join(os.tmpdir(), 'hoopheads-check-' + process.pid + '.js');
fs.writeFileSync(file, html.slice(a + 8, b));
try { execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' }); console.log('syntax OK (' + (b - a - 8) + ' chars of script)'); }
catch (e) { process.exitCode = 1; }
finally { fs.unlinkSync(file); }
