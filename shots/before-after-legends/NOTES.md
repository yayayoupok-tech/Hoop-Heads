# Before and after: the Legends look

Each image puts the same scene side by side on three builds:

- **Before**: the last build before the graphics overhaul (M9, commit `55d1542`).
- **After · Smooth**: this build with Settings → Graphics → Smooth.
- **After · Pixel**: this build as it ships (Pixel is the default).

All three come from one script, `node tests/gallery.js shoot <dir> [pixel|smooth]` (with `HH_ROOT` pointing at the
older build for the left column), which sets every scene up directly: the title, the main menu, the create screen,
Settings, then a quick 1v1 (Dez vs Big Ted, seed 9) at tip-off, the first jumper, the first attack at the rim, a
defensive stance and the pause menu; on a phone (844×390, touch, @2x) the match and pause again. The triptychs were
composed with `node tests/gallery.js compose <before> <smooth> <pixel> <out>`.

The quick 1v1 plays in each build's own default venue: the pro arena before, the Legends Arena after. The simulation
did not change, but the Legends View court is shorter, so the same seed plays out differently.

| Image | What changed |
| --- | --- |
| `d01_title` | the logo: arched 900-weight letters on a yellow → orange ramp, the first O a basketball; in Pixel it is set in the pixel font with a pixel ball |
| `d02_menu`, `d04_settings` | chunky buttons with a 3 px outline and a darker lip, gold → orange primary, blue secondary; arched gradient headings; notched panels in Pixel |
| `d03_create` | the select wall: the hovered head bobbles and grins, the chosen one is 1.15× with a gold ring |
| `d05`–`d08` | Legends View: the whole short court on one screen with players 1.3× taller; new faces, hair, bodies and sneakers; the Legends Arena; the bigger score with bold digits (7×11 pixel digits in Pixel); Pixel renders the scene at about 240 rows with a 1-px outline on every character |
| `d09_pause`, `p09_pause` | the chunky buttons and the pop-in overlay over the match |
| `p05`–`p07` | the phone: the same, with the thumb controls |
