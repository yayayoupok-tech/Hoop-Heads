# M6 visual rounds: effects and UI kit

Each round has four parts:

- `tour/`: the full screen tour, `tests/shots.js`. `d` files are desktop at 1280×720; `p` files are phone at 844×390 with touch.
- `key/`: the key screens through a real career. The `-phone` files are the phone versions.
- `fx/`: every §5 effect, captured in a paused arena scene. The `-zoom` files are 2× crops.
- `lab-ui-kit.jpg`: the Art Lab UI kit sheet.

## Round 0: the baseline before M6

Taken with the M5 build. It has the old orange/blue buttons, the 10 px panels and the old score bug, which the jumbotron hides at midcourt. Keyboard hints show on phones, and the menus are walls of text.

## Before round 1, found while building

- The jumbotron hung behind the new score bug. It now hangs at least 10 px below it.
- Button sub-labels overlapped their labels. Labels now move left; tall buttons put the sub-label on a second line.
- Create screen:
  - The "PLAYER" header overlapped the facial-hair row.
  - The fifth phone row ran off the screen. The phone layout now has three tabs.
- Recap: the height chips floated far above the heads.
- Genes chart: the ruler stopped at 4′6″. It now runs to the floor.
- Draft night: the pick stamp touched the big screen, and a rival's name was cut off.
- Retirement: the verdict ran under the stats panel.
- Height rulers read about 10% too high everywhere. They were calibrated for the pre-M3 body; the crown was re-measured.

## Round 1 → fixed for round 2

- The high-school result screen was mostly empty. It now has count-up stat tiles and an OVR badge.
- The Hall of Fame was a bare list. It is now a wall of trading cards; legacy sets the tier.
- The How-to-play buttons ran past the panel edge.
- The card portrait sat too high, so tall hair was clipped at the top.
- The tour's phone section stopped at the hub. The test looked for the old "PLAY GAME" label; the test was fixed.

## Round 2 → fixed for round 3

- Phone recap: the tall CONTINUE button covered the before/after platform. On phones the figures now stand higher and smaller.
- Phone retirement: the MAIN MENU button hid the caption. The caption moved up.
- `round-3/fix/` holds both screens after these two fixes.

## Still worse than it should be (left for M8 and M9)

- On phones, the dense screens still use the desktop layout, with rows under 64 CSS px. Taps count up to 64 px where there is room. The screens are settings, league tables, quick-play setup, training, management and the face editor.
- On phones, swatch chips are about 34 px circles inside a 64 px row.
- The hub's "this week" slot shows the existing training focus or session. M8 adds Practice, Rest and Film.
- The Trophies link opens the awards page until M8 adds the trophy case.
- With a small draft class, the draft board is mostly empty.
