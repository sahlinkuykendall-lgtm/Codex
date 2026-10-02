# THE CODEX OF GIZA — PROJECT NOTES (read this first in a new session)

The working memory for the poke-style build: **what the owner wants, how to work, what's
been done, and what's next.** Keep it current: update the "Where we are" and "What's next"
sections at the end of every step. Last updated 2026-10-02, at P0.51.

---

## 1. The owner's requirements (standing rules)

**How to work**
- Work on the branch **`poke-style`** (repo `sahlinkuykendall-lgtm/Codex`). Commit and push
  after every step: `git push -u origin poke-style`. **Never open a pull request** unless asked.
- **Every update:** a `POKE-STYLE P0.x` entry at the top of `UPDATE_LOG.md`, a bump of the
  title (`POKE-STYLE BUILD  P0.xx` in `poke/ui.js`) and of every `?v=N` in `poke.html`.
  (Docs-only changes don't bump the version.)
- The owner **tests along the way**. After each step, tell them plainly what was done and
  what to try, then ask before starting the next step. When they say "do all the rest of
  the steps", go step by step, committing each, without stopping to ask.
- **Look at the result before calling it done:** render screenshots with Playwright
  (Chromium is at `/opt/pw-browsers/chromium`) and check the art yourself.
- **Run the checks before every commit** (section 4). Report failures honestly.

**The story**
- **Follow the story bible** (`story/00_MASTER_BIBLE.md` and the files it lists). The bible is
  the source of truth; the region files (`story/regions/*.md`) give each chapter's beats,
  side quests, jobs and secrets.
- **Don't reuse characters** unless the bible says they're in both stories. Each chapter uses
  only its own named cast; everyone else is a nameless local with a new look (don't reuse a
  named character's look for a stranger either).
- **Starter maps match each other:** every Chapter 1 opening is about the same size (Giza and
  Saqqara are ~80×58 tiles) and has about the same amount to do (Giza: 11 side quests, Saqqara:
  9, plus jobs and 3–5 secrets each). Follow the bible first; **where the bible has fewer
  missions, add some of your own**, as long as they don't conflict with the story or the bible
  (no new named characters, nothing that changes a beat, a flag or what someone knows). Mark
  added ones as additions in the plan.
- Easter eggs are allowed when the owner asks for them (the sphinx one is in `poke/ch1b_egg.js`).
- No copyrighted music or lyrics: write original tunes "in the spirit of" instead.

**The art and the world**
- **Crisp pixel art only:** flat colours, a light edge toward the sun (upper left), a dark edge
  away, a 1-px outline. No blur, smoothing or noisy gradients.
- **Don't change Giza's look** unless the change is meant for Giza: `poke_look.js` must show
  Giza's **33 views identical**.
- **Every map gets water and food** (a well or tap, water jars where people work, food).
- **Every building you can see has an inside**, unless the story locks it (then say why).
- The owner dislikes busy patterns: **no harsh stripes** (field tiles are flat colour with
  faint rows since P0.33). Things must read clearly at 1× scale.
- Players must not be able to slip past story gates (block gaps with fences or trees).

---

## 2. What the game is

`poke.html` is a DS-Pokémon-style pixel version of the game (canvas, no build step). The
older 3D build (`index.html`, the root `*.js` files) is separate and not being worked on.
The player picks one of **four backgrounds**, and each has its own Chapter 1 opening:

| Background | Chapter 1 | Status |
|---|---|---|
| Archaeologist | 1-A, the Giza dig camp (one night) | **Done** (P0.7–P0.28; `poke/AREA1_TODO.md`) |
| Inspector | 1-B, Saqqara and Mit Rahina | **Done** (P0.23–P0.39; `poke/INSPECTOR_TODO.md`) |
| Fixer | 1-C, Marsa Tarfa on the Red Sea | **In progress** (`poke/FIXER_TODO.md`): **Playable to the end** (P0.40–P0.49); still to do: side quests, jobs, secrets, rooms (steps 8–11) |
| Journalist | 1-D, Port Said | Not planned yet (only the opening cutscenes exist) |

All four meet in **Chapter 2, Cairo** (`story/regions/ch02_cairo.md`). Each opening ends with
the same exit choice, `c1_exit` = quiet / legal / deal (`story/03_CHOICES_AND_FLAGS.md` §2).

---

## 3. How the code is laid out (poke/)

See `poke/README.md` for the file-by-file table. The essentials:
- **Areas:** `AREAS[background]` (per-background map, objects and hooks: `frame`, `sync`,
  `door`, `onEnter`, `overlay`). New features wrap the hooks in an IIFE that chains to the
  previous one.
- **Maps:** the layout file (`camp.js` for Giza, `saqqara.js` for Saqqara), the text file
  (`map_ch1.js`, `map_ch1b.js`), the sprites (`sprites.js`, `sprites_ch1b.js`).
  Sprites are `SPR[id]` or `SPR_L[model]`, drawn with `stage/fit` or `propStage/propFit`
  and the `pa(g)` pixel helpers (`r, px, hl, vl, ell, poly, line, soft`).
- **Story:** `scene(key, {speaker, text, choices})`, `STORY_SCRIPTS` (side-effect free),
  `sflag`, `task/taskDone`, `storyNote`, the clock (`clockAt`, the night ends at 04:40),
  `rel`/`rep`, the phone (`storyMessage`, `PHONE_CALLS`), the end card (`EndCard.show`).
- **Rooms:** `ROOMS[key] = {name, tw, th, style, enter, build(...)}`; doors are listed in the
  area's layout.
- **Minigames:** `MINIS.x = {title, keys, start, update, draw}`; `playMinigame(kind, opts, cb)`.
  So far: sieve, tea, darts, seal, race (rebuilt in P0.51: lanes, stride, breath), fossil, tawla, the guide's quiz, and for the Fixer: haggle,
  lockpick, scout (`ch1c_prep.js`), fish (`ch1c_island.js`), lamproom, chase and firstaid
  (`ch1c_island.js`, `ch1c_ship.js`). Don't name a minigame's state field `done`: `Mini` keeps the
  callback there.
- **Leaving an area:** `poke/leaving.js` adds "N main tasks and N side quests still open here" to
  each opening's leaving scene (`area().sideQuests` / `sideIds`, or "(Name) ..." task texts). The
  chapter end settles main tasks; side quests stay open for KEEP EXPLORING, so don't tick them off.
- **Music:** `poke/music.js`, chiptune tunes synthesised on the fly (`TUNES`).
- Script order matters: new files go in `poke.html` after what they depend on.

---

## 4. The checks (run before every commit)

```
node tools/poke_checks/poke_audit.js          # every scene, script, room and area; must be clean
node tools/poke_checks/poke_playthrough.js    # Giza start to finish; errors []
node tools/poke_checks/poke_inspector.js      # Saqqara with each exit, save/load, speed
git worktree add -f /tmp/old HEAD && node tools/poke_checks/poke_look.js /tmp/old   # 33 identical
```
Add a playthrough file for each new opening (next: `poke_fixer.js`). An area can define
`auditOpen()` to open its story gates for the audit (the Fixer's villa gate does), and
`auditSeeds()` for places reached another way (Lighthouse Island, by boat).

---

## 5. Where we are (history in brief)

- **P0.2–P0.6:** the poke-style build: the Giza camp map, crisp art, the M map of Egypt,
  four backgrounds with opening cutscenes, the character creator.
- **P0.7–P0.28: Area 1, the Archaeologist at Giza.** The story engine and clock, the main
  story, Miriam's metal detector, side quests, minigames (sieve, tea, darts), the phone,
  skills, needs, the camera, the shaft, the watchtower, the train, secrets, music, every
  building opened up, water and food everywhere. P0.28 was a round of the owner's fixes
  (compass letters, building light, the survey map, Miriam's kitchen, the radio, harder
  darts, the oasis gap closed).
- **P0.23–P0.38: the Inspector at Saqqara**, in 11 steps: the area; the seal round (one
  forged); tailing Samy through the market (view cones, a suspicion meter); the Serapeum
  at night (patrol, the Codex); Colonel Radwan's empty box; Samy's panic and the standoff;
  Miriam's note and the three exits; nine side quests and tawla; jobs (the seal shift,
  guiding, sieving); secrets (the twenty-sixth gallery, Naneferkaptah's tomb); every
  building's inside, the phone, resting, and an automatic Inspector playthrough.
- **P0.39:** Saqqara redrawn at the owner's request (the Step Pyramid no longer a beehive,
  the colossus lying on his back seen from above, the sphinx in profile, pigeon towers,
  the buffalo, goats, cat, the market and souvenir stalls, the garage Fiat), and the
  sphinx easter egg: UP three times in front of it and a long-haired rocker with a red
  guitar walks out to an original riff, says "Rock on, dude! I gotta go save
  Peachessssss!" and runs off.
- **After P0.39:** `poke/FIXER_TODO.md` written (11 steps for Chapter 1-C).
- **P0.40: the Fixer, step 1.** Marsa Tarfa (`marsa.js`, `map_ch1c.js`, `sprites_ch1c.js`,
  `ch1c_scenes.js`): the map with new sea, reef, beach and quay ground; the cast; beat 1 (the debt
  collectors, the debt in the bank app, Zaki, Rana, the summons to Bassem's at five); water and
  food; your flat and Rana's dive shop. The Fixer is playable. The villa gate stays shut until step 2.
- **After P0.40:** the matching-starter-maps rule; four side quests and a secret added to the Fixer
  plan (marked as additions).
- **P0.41: the Fixer, step 2** (`ch1c_bassem.js`): Bassem's gate opens at 16:30 (or wait for five);
  the villa inside; Bassem's offer (the truck at ten, the dhow, the ship, the Swiss foundation, the
  German woman who doesn't laugh, nobody opens the package); the beat 3 tasks set. New: the
  `villa` room style, the `chain` accessory, and `auditOpen` (an area's story gates opened for the
  audit).
- **P0.42: the Fixer, step 3** (`ch1c_prep.js`): three new minigames (haggling, lockpicking,
  scouting the patrol boat); diesel paid, stolen past the night watchman's view cone, or bribed;
  the coast guard route bought from the fisherman or scouted from the fort's rampart; Rana's kit.
- **P0.43: Lighthouse Island** (`ch1c_island.js`), the owner's idea instead of widening the map's
  west side: a boatman takes you over by day; the lighthouse and its room, flavour (osprey, turtle
  tracks, gulls, flotsam), water and food, and the fishing minigame (sell the catch on the quay).
  The audit now takes `auditSeeds()` for places reached by boat.
- **P0.44:** the lighthouse beam turns (two beams, every eleven seconds, at night), and the climb to
  the lamp opens a 360° view built from the real map (`panoBuild` in `ch1c_island.js`: the map's
  tiles projected to the horizon, every sprite at its true bearing and distance, lit by the hour).
  The same trick could give other high places a view (the fort's rampart, a minaret, the Cairo
  Tower in Ch2).
- **P0.45: the Fixer, step 4** (`ch1c_truck.js`): the truck at ten, Lena Brandt's handover ("Don't
  open it"), the pickup or carrying it, the package aboard Zaki's dhow.
- **P0.46: the Fixer, step 5** (`ch1c_open.js`): casting off and the voyage out on the map, the dhow's
  deck at sea, opening the case (the Codex, the tracker, the note), the green lamp.
- **P0.47:** Marsa Tarfa's houses each given their own character (`HSTY` and `HOUSE_BITS` in
  `sprites_ch1c.js`: washes, coral stone, lattice bay windows, balconies, a barber's and a tailor's,
  roof clutter). The lighthouse view uses the same sprites, so it follows automatically.
- **P0.48: the Fixer, step 6** (`ch1c_ship.js`): the ship, the stealth listen on its deck, the boat
  chase, Zaki shot and the first aid (or keep running): `ch1c_zaki_saved`; home at 01:30.
- **P0.49: the Fixer, step 7** (`ch1c_exit.js`): the tracker dumped (reef, bus south, Bassem's car), the
  exit (legal / deal / quiet), goodbyes, leaving by lorry or night bus, the end card. The Fixer's
  opening plays start to finish.
- **P0.50:** a tester's report on the Inspector: the dates fixed (Miriam logged the Codex five days ago,
  the day before she vanished, matching the shared intro's "four nights ago"; the bible changed too)
  and her reason made plain (she trusted the Ministry, feared the antiquities police). Still open, not
  done by the owner's choice: a line telling players the four starts are separate stories.
- **P0.51: the owner's Giza list** (a tester's playthrough of Chapter 1-A): the male and female starting
  looks made clearly different; notices drawn over the phone and kept up longer; Lena's men at midnight
  carry torch cones (`ch1_search.js`: walk into the light, or up to them, and you're seen); the
  knockout takes wallet cash (never what you need for a task, never the wages) and photographs
  Miriam's page instead of taking it (bible changed, at the owner's request); Hana's sherds and wax
  made clear; the "still open here" line before leaving any opening (`leaving.js`); the horse race
  rebuilt as a real minigame, one try; the supply train kept on its rails and out of the old
  village's stones; the fossils dug out in a new minigame; Miriam's palm made to stand out; the site
  office's burn bin cold; the camel, kitchen and inspector-car lines rewritten. Answered, not
  changed yet: the "Go to bed, Doctor" text and the inspector car with no purpose.

## 6. What's next

0. **Waiting on the owner:** whether to reword the midnight "Go to bed, Doctor" text, and whether to
   give the Giza inspector car a purpose (both answered in P0.51, not changed).
1. **The Fixer's opening, Chapter 1-C (Marsa Tarfa):** follow `poke/FIXER_TODO.md`; next is
   step 8 (the side quests: the bible's five, Rana's Reef, the Fort's Cannon, Fish for the Hotel,
   the Coast Guard's Cousin, Bassem's Nephew, and the four additions). Then jobs (9), secrets (10),
   rooms and the `poke_fixer.js` playthrough check (11). Waiting on the owner's go-ahead.
2. Then the Journalist's opening, Chapter 1-D (Port Said): write `JOURNALIST_TODO.md` the
   same way first.
3. Then Chapter 2, Cairo, where the four backgrounds meet.
