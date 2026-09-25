# M9 screenshots: the final build

`round-1/`: the Art Lab and in-match frames on the final build (`node tests/artlab.js m9-final 1`): faces at phone size
and 250 px, poses, hair, the crowd atlas, venues, the body close-up, every animation clip, the UI kit, and a live match
in each venue (plus the arena at phone size). No errors.

`phone/`: screens after the phone pass at 844×390 with touch, from the last run of the audit script
(`node tests/phoneaudit.js`), which checked 65 screens and found no tap target under 64 px, nothing off the screen, no
overlaps and no text running out of its button. `--desktop` runs the same checks at 1280×720: also clean.

- `menu`: the main menu (the Extras sub-label now shrinks to fit its button).
- `settings`: page 1 of 2 (Gameplay) in two columns of tall rows; ◀ ▶, Reset and Back in the bar.
- `quickplay`: page 1 of 2 beside the matchup.
- `customize-face`: the face editor, page 1 of 3 (Look).
- `howto`: the touch controls and one tip at a time.
- `extras`, `free-practice`, `tour-bracket`, `declare`, `pause`: 64 px buttons in grids and bars.
- `keyboard`: the name keyboard with 64 px keys.
- `halloffame`, `hof-full`: the empty Hall of Fame, and five cards a page with seven entries.
- `league`, `player`, `management-tab1/2/4`: View and Back in the bottom bar; the sponsors, staff and shop tabs.
- `offseason-contract`: free agency with 64 px offers (the facilities on a second line).
- `allstar`: the All-Star weekend with its buttons in the bar (the old "Sim the contest" button sat below the screen).
- `postgame-quick-later`: the quick 1v1 result.
- `am-standings`: the amateur standings with a 64 px Back.
- `team-league`, `tc-create-p3`, `tc-choose-team`, `tc-hub`, `tc-shop-moves`, `tc-strategy`: the classic team league
  (faces in pages of eight, the menu in pages, lists as 64 px rows; team blurbs fit their cards).
