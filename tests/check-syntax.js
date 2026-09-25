// Syntax check: extract the game's <script> from index.html and run node --check on it.
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const a = html.indexOf('<script>'), b = html.lastIndexOf('</script>');
if (a < 0 || b < a) { console.error('no inline <script> found'); process.exit(1); }
const file = path.join(os.tmpdir(), 'hoopheads-check-' + process.pid + '.js');
fs.writeFileSync(file, html.slice(a + 8, b));
// Two top-level functions with one name are legal JavaScript, and the later one silently wins (M8's career practice
// screen once replaced the Extras one that way), so they fail the check.
const seen = new Map(), dups = []; html.slice(a + 8, b).split('\n').forEach((line, i) => { const m = /^(?:async\s+)?function\s*\*?\s*([A-Za-z0-9_$]+)\s*\(/.exec(line); if (!m) return; if (seen.has(m[1])) dups.push(m[1] + ' (lines ' + seen.get(m[1]) + ' and ' + (i + 1) + ')'); else seen.set(m[1], i + 1); });
if (dups.length) { console.error('duplicate top-level functions: ' + dups.join(', ')); process.exitCode = 1; }
try { execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' }); console.log('syntax OK (' + (b - a - 8) + ' chars of script, ' + seen.size + ' top-level functions, ' + dups.length + ' duplicates)'); }
catch (e) { process.exitCode = 1; }
finally { fs.unlinkSync(file); }
