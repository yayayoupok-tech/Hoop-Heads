# Before and after

Every screen of the M0 audit tour (`shots/audit/`, taken on the build this project started from) next to the same
screen on the final M9 build. Both sides come from the same script, `node tests/shots.js <dir>`, which walks a new
career from the title screen to the pros and then visits the other modes. Desktop shots are 1280×720; phone shots are
844×390 with touch at 2×. The pairs were composed by `node tests/beforeafter.js <dir>`.

Each run plays a new career, so names, ratings, heights and moments differ between the two sides. `d30` was the old
TRAIN screen; M8 replaced it with the week's Practice screen.

| Pair | Before (M0) | After (M9) |
| --- | --- | --- |
| `d01_title` | stick-limbed players on a flat blue stage | spotlit arena, painted faces, a face-off with the ball between them |
| `d02_menu`, `d31_menu_with_career` | nine buttons | the other modes moved under Extras; painted players; your card when a career exists |
| `d03_create` | preset grid and rows | a turning model on a platform, swatch rows for skin, hair and eyes, "height unknown" |
| `d04_customize_face` | a small body and a list | a large painted face with shape sliders and accessories |
| `d05_genes_reveal` | a text card | the doctor's growth chart with your silhouette and the projected height |
| `d06_hs_hub`, `d16_hs_hub_year2`, `d18_college_hub`, `d20_combine_hub` | three flat panels | your model on a height ruler, both trading cards, the week (Practice / Rest / Film), fatigue, links |
| `d07`–`d10`, `d19` | a flat gym and rubber-hose players | venues with bleachers, banners, a wall scoreboard and crowds; the painted body and mitten hands |
| `d11_pause` | a list | the same list on a glass overlay |
| `d12_hs_result`, `d29_pro_result` | text lines | stat tiles, how you scored, progression bars, the week line |
| `d13_hs_standings`, `d14_hs_history` | tables | the same tables in the new panels |
| `d15_season_recap` | a text recap | stat tiles, OVR by season, and last summer's you beside this one |
| `d17_college_offers` | a list of buttons | the recruiting board: program banners, facts, visits, commit |
| `d21_combine` | measurements beside a tape | the same layout with the painted model |
| `d22_draft` | a list of picks | the draft podium, the board and your card |
| `d23_pro_hub`, `d24_pregame` | panels; the tale of the tape | the pro hub; the tale of the tape with painted players |
| `d25`–`d28` | a night skyline court | the pro arena: crowd, jumbotron, ribbon boards, glass backboard, reflections |
| `d30_training` → `d30_practice` | the old training screen | Practice: focus, intensity, scout bands on ceilings, the playable drill |
| `d32`–`d34` | quick 1v1 and a night court | the half-court rows; the blacktop with graffiti and the city behind the fence |
| `d35`–`d38` | the Extras setups | the same setups in the new panels |
| `d39_team_league`, `d43_team_hub`, `d44_team_5v5_match` | the classic team league | kept under Extras, on the new art |
| `d40_hall_of_fame` | "Finish a career" | a hanging jersey waits for your name (finished careers show as trading cards) |
| `d41_how_to_play`, `d42_settings` | text and rows | the same content in the new panels; settings gained charges, career games and injuries |
| `p01`–`p08` (phone) | the desktop layout shrunk | phone layouts: tabs on the create screen, the phone hub, the touch stick and buttons, the phone score bug |
