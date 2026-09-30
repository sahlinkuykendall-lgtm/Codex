# Area 1 (the Giza dig camp, poke-style): what's left

Written 2026-09-30 at P0.6. **Area 1 is not finished.** The map, the art, the people and
the menus are done, and so are the intro, the backgrounds and the character creator. The
**story is not wired up.** Right now every person and object says only its first line of
text (from `poke/map_ch1.js`). There are no choices, no flags, no quests, no minigames and
no midnight event.

**Source of truth:** `story/regions/ch01_opening_archaeologist.md` (the beats, the side
quests, the places) and `story/03_CHOICES_AND_FLAGS.md` (the flags).

**Port the logic, don't reinvent it.** The 3D build already implements all of Chapter 1-A,
and those files are on this branch:
- `story_core.js`: story state, flags, affinity, the clock
- `ch1a_story.js` (1,100 lines): every beat, conversation and choice
- `ch1a_extras.js`: skills, XP, phone, thirst
- `ch1_minigames.js`: sieve, tea, darts, seal
- `ch1a_places.js`, `ch1a_finds.js`, `ch1_dog.js`

The poke build loads none of these; it only has the text export. The job is to bring their
state and dialogue logic into `poke/`, replacing the 3D calls with the poke UI (`Dlg`,
`Toast`, `Banner`, `Menu`).

Rules:
- Crisp pixel art only: no blur, gradients or smoothing.
- **Keep Area 1's look exactly as it is (P0.6).** The map, the layout, the art, the people
  and the interiors are finished and approved. Story work adds conversations and systems on
  top; it doesn't move, redraw or restyle what's there. New things from step 7 go on free
  ground in the same style. Before each commit, render the camp at every place (day and
  night) and the three rooms, and compare them pixel for pixel with the previous commit.
- Each update gets a POKE-STYLE P0.x entry in `UPDATE_LOG.md` and a bump of the title
  version in `poke/ui.js`.
- Commit and push `poke-style` after each step.
- Test with the Playwright scripts in `%TEMP%/codex_tests` (`poke_play.js`, `poke_audit.js`,
  `poke_camp.js`, `poke_bg.js`).

---

## 1. Story engine (do this first; everything else needs it) — ✅ DONE in P0.7
> Done: `poke/story.js` (the engine) and `poke/ch1_scenes.js` (the scenes). Scenes use
> the 3D format (`scene(key, { speaker, text, choices })`), and `STORY_SCRIPTS[id]` points
> an entity at one. Ported so far: the arrival (beat 1) and Hana with her sherd quest.
> When porting, swap `gameState.funds` for `money()`/`storyPay()` and `gameState.inventory`
> for `hasItem()`/`pocket()`/`dropItem()`.

Add a `poke/story.js` that holds `Game.story`:
- the flags
- `rel_*` affinity and `rep_*` reputation
- money (8,000 EGP to start)
- key items
- the tasks list

Save and load it with the game. Add a choice box to `Dlg` (a DS-style list of 2–4 options)
and a way for a conversation to run a script: a series of lines, a choice, and flag
changes. Hook `examine()` in `game.js` so a person or object with a script runs that script
instead of its single line.

## 2. The story clock — ✅ DONE in P0.8
> Done: `clockTick`/`clockAdvance`/`storyHour` in `poke/story.js`; the "Story clock" light
> setting (the default); rest/wait at `rest_brazier` and `tent_cot`; `storyClockPassed()` in
> `poke/ch1_scenes.js` sets `lena_event = 'coming'` at midnight (the car and the search are 3.5).

Chapter 1-A is one night, 20:30 to 04:40, with one story minute for every 2 real seconds of
play. Resting at the fire or in the camp bed skips an hour, or straight to midnight. After
the chapter-end card, the clock runs free. The poke game already has hours and day/night
tints (`Game.hour`, `light()`), so tie them to the story clock.

## 3. Main beats, in order (bible §MAIN BEATS) — ✅ DONE in P0.9
> Done in `poke/ch1_scenes.js`. `storyFrame()` runs the midnight car (lena_event coming →
> searching → gone) and `storySync()` makes the world match (the chained dig gate, the Lena
> trio, the parked car). The chapter-end card is `EndCard` in `ui.js`. Still stand-ins:
> `playMinigame()` for the sieve (step 5), and the glyph seal is pressed from the choice box
> (step 5 redraws it). The shaft is text for now (its interior map is step 7). The dig zone
> fence doesn't reach the cliffs, so the dig shed and the shaft are padlocked in the story too.

1. **Arrival.** Rais Abdallah meets you at the gate with a lantern ("Doctor Miriam did not
   leave for family reasons"). He walks you in. You sleep in Miriam's tent.
2. **The payroll** at the Rais's fire. The site account is 6,000 EGP short. You can:
   - **pay** it yourself
   - **confront** Lindqvist, who admits Vasse paid the whole season
   - **delay**

   Each has its affinity changes. Asking Lindqvist first gets "Friday, the transfer's
   coming Friday." Any of these gets you **Miriam's key ring** and **opens the dig gate**
   (`dig_gate` is currently just scenery).
3. **The trenches:**
   - **Trench A:** a moved stake hides Miriam's notebook page (owl, eye, serpent, lion).
     Digging takes 20 minutes with the men, or 45 alone.
   - **Trench B:** the dig-shed clipboard, then the spoil field, then **sieve** under the
     red stake to find the **MAG key**.
   - **Trench C:** the red stake with Coptic ⲡⲏⲓ on it.
4. **Uncle Farouk** saw the black Land Cruiser: "The other car comes at midnight." Give him
   Saber's mint tea or 500 EGP to set `farouk_bribed`.
5. **The midnight car.** At 00:00 a black Land Cruiser drives up the east road, and Lena
   Brandt and two men search Miriam's tent for about 90 story minutes. (The Lena trio is
   already placed but hidden: `HIDDEN` in `world.js`.) You can:
   - **listen** from the shadows (`lena_overheard`)
   - **photograph** them (`lena_photos`)
   - **confront** them (`met_lena`; she gives you her card)
   - **miss** it

   If you slip into the tent behind them, you're knocked out and wake at the fire, and they
   take the notebook page (`lena_has_page`).
6. **The find store.** Use the MAG key, then **slit** or **break** the seal. Inside is
   **the Codex** in Miriam's green scarf, with her note ("Father Bishoy, El-Fishawy,
   Thursday"). With Hana's wax you can reseal it (`store_resealed`).
7. **Optional: the Osiris Shaft.** Go down the tunnel mouth to level 3 (the niche is empty).
   On the shaft approach is the **glyph-seal minigame**: owl, eye, serpent, lion. A wrong
   stone fires a dart and injures you. Behind it is the **bronze seal of Petamun**
   (`petamun_seal`).
8. **Headlights**, once you have the Codex. The exit choice `c1_exit`:
   - **Quiet:** on foot through the quarry to a watermelon truck
   - **Legal:** call Amira (Amira +15, Ministry +10)
   - **Deal:** the Foundation's car, 5,000 EGP and Vasse's card
9. **The chapter-end card** lists the choices that carry forward. Then you can keep
   exploring, or go to the title.

## 4. Side quests (bible §SIDE QUESTS, SQ-01A-01 to 11) — ✅ DONE in P0.12
> Done in `poke/ch1_side.js` and `poke/bosta.js` (Hana's sherds are in `ch1_scenes.js`, the
> caches and relics in `detector.js`). Bosta follows as a new sprite; at home she's the
> original fire sprite. Tea and darts call `playMinigame()` stand-ins until step 5.

| Quest | What happens |
|---|---|
| The Rais's Son | Mina's 1,500 EGP debt to Hagg Sayed: pay it, hand over the darts winnings, or race Hagg Sayed on horseback (three choices during the race) |
| Hana's Conservation | Bring her three painted sherds (they form an ibis). Rewards: conservation wax, and +20% on your finds |
| The Tea Boy's Secret | The **tea minigame**, then the half-burned papers from Lindqvist's bin |
| The Truck of 1926 | The diary in the glovebox, and four detector relics, one of which is a photo of the Rais's grandfather |
| Supply Line Blues | Find a spare coupling pin for Uncle Hamid |
| Miriam's Caches | Detector caches: 1,200 EGP, her spare phone ("A.S." reaches Amira early), field glasses, a bigger rucksack |
| Darts Night | The **darts minigame**: beat 132 for a 200 EGP stake. Rewards: 2,000 EGP and the nickname "Abu Ramy" |
| Bosta | Win the camp dog over and she follows you, barks at the midnight car and growls at Lena. **Bosta isn't in the poke build yet.** |
| Pharaoh's Lentils | Five nummulite fossils on the fossil pavement |
| The Lamp at the Tomb | The old woman at night (already placed, `NIGHT_ONLY`). She gives you the Keepers' tile |
| The Looters' Pit | The faience Eye of Horus in the cemetery: take it, or leave it for the Ministry |

## 5. Minigames (redraw them in the pixel style) — ✅ DONE in P0.13
> Done in `poke/minigames.js`: `playMinigame(kind, opts, done)` opens `Mini`. Darts uses a real board
> (the 3D scoring couldn't reach 126–149). The race keeps the bible's three choices inside it.

- **Sieve:** 3 heaps at the spoil field, plus the MAG key.
- **Tea:** pour a perfect glass.
- **Darts.**
- **Glyph seal:** press the stones in order.
- **The race** with Hagg Sayed (simple).

## 6. Systems — ✅ DONE in P0.14
> Done in `poke/systems.js`: skills/XP (`skillXP`, `skillLevel`, `afterChoice` hooks), needs (`drink`, `eat`,
> `canRun`), injury (`setInjured`, `healInjury`), the phone (`Phone`, P), the camera (`takePhoto`, C), the
> ledger and messages. The detector was done in P0.10.

Build each of these into the poke UI:
- **The phone** (P):
  - map
  - tasks
  - messages ("Go to bed, Doctor." at midnight)
  - contacts and calls (Amira)
  - bank with a ledger
  - skills
  - notes
- **Skills and XP:** Excavation, Hieroglyphs, Coptic, Greek, Arabic, Photography, Stealth,
  Climbing, Riding and First aid, with level-up toasts. Background start levels are in
  `story/01_CHARACTERS.md`.
- **Thirst and hunger:** drink from the well, the barrels, the canteen or tea; eat lentils
  and dates. When empty, you can't run.
- **The metal detector:** ✅ DONE in P0.10 (`poke/detector.js`): 40 buried finds, the signal, metal readout, dig. Miriam's caches and the 1926 relics are found with it; bringing the relics to the Rais (SQ-01A-04) is step 4.
- **The camera:** photograph Lena.
- **Injury** (limp until Hana patches you or you rest) and **knockout**.

## 7. Missing things in the world
Check each against the bible's PLACES table and add what's missing:
- Bosta (the dog), with her routine
- Hagg Sayed and his horses at the camp gate
- the find store's steel door with its seal
- the red stakes (Trench B's, and Trench C's by the dig gate)
- the spoil field's heaps
- the mason's marks in the old quarry
- the false door with Petety's curse in the cemetery
- the builders' ramp
- the supply train actually moving round its turning loop

Also:
- **The Osiris Shaft** needs an interior map: three levels, the lowest flooded, with the
  niche.
- **The watchtower:** climbing it should reveal every place on the map, and with the field
  glasses you see the car waiting by the shaft.

## 8. Secrets and lore (bible §SECRETS)
- Miriam's bookmarked Setne story in her tent ("Coptos. The river. Why always the river?")
- The ibis made by the sherds
- The eye-in-a-house mason's mark
- The car by the shaft seen from the watchtower

## 9. Last
- Run a playthrough of the whole night, with each exit choice.
- Check the save and load in the middle of the night.
- Run `poke_audit.js` again after adding things to the map.
- Then start on the other three openings: the Inspector (Saqqara), the Fixer (Marsa Tarfa)
  and the Journalist (Port Said). Their cutscenes and data are already in
  `poke/backgrounds.js`; set `ready: true` when each map exists.
