# UPDATE LOG — THE CODEX OF GIZA

What changed in each update, newest first. The version number matches
`GAME_VERSION` in `data.js` (shown on both title screens).

**Rule:** every game-changing update bumps `GAME_VERSION` and adds an entry
here *in the same commit*.

Other docs:
- `story/` — **the story bible** (source of truth). Start at `story/00_MASTER_BIBLE.md`.
- `3D_CONVERSION_NOTES.md` — what the 3D branch is, how it's built, quirks.

---

## POKE-STYLE P0.26 — 2026-09-30 — (branch `poke-style`) A leftover from the old story removed
- **The half-buried transit level** by Lindqvist's trailer said it belonged to "Sam Okafor,
  your dead research partner", left there 14 months ago. That's text from the old 3D story:
  the bible retires Sam (`story/00_MASTER_BIBLE.md` §11, with Ellis, Tariq, Iry, the
  Uarha, the Heart, the Order of the Unshut Eye and the Perennial Concern). In the new
  canon you've never been here before. It's now **Miriam's level**, left in the sand four
  days ago, with "M.H." scratched into the brass.
- **A sweep of everything else you can read found nothing more:** every Giza object, room
  and scene, checked for the retired names.

## POKE-STYLE P0.25 — 2026-09-30 — (branch `poke-style`) The game explains digging, and what water and food do
- **Digging with the detector:**
  - when you pick it up, the text and the toast now say how it works: Q switches it on,
    walk slowly, and when the screen says DIG HERE, press SPACE to dig (five minutes)
  - the readout says **SPACE: DIG** instead of just DIG HERE
  - the first time you're standing right on something, a notice says "Right under your
    feet. Press SPACE to dig."
- **Water and food, explained:**
  - the first time either drops to half, a short scene explains it: they run down as time
    passes, the bars are in the corner and blink red below a fifth, and at nothing you
    can't run (walking is fine). It lists where to drink and eat in the area you're in:
    Giza or Saqqara. It shows once per game.
  - the cook at the workers' cooking table gives the same advice the first time you visit
    ("A man who runs dry out here can't run at all")
  - at Saqqara, the café owner gives it too
- The audit and the three playthroughs are clean.

## POKE-STYLE P0.24 — 2026-09-30 — (branch `poke-style`) Area 1 fixes: a task tracker, needs on screen, the tea game redrawn, darts, lamps, the oasis
- **A task tracker** (`poke/tracker.js`):
  - a compass in the bottom-right corner points to the task you're tracking, with the
    distance above it (indoors it points to the door)
  - it tracks your newest task until you pick another: in **TASKS** (Esc), SPACE on a task
    tracks it, marked TRACKING
  - **T** flashes a big arrow over your head for three seconds, pointing the way
  - every Giza task has a destination, and it follows where the task has got to (Saber's
    kettle, then the burn bin; the nearest sherd, then Hana)
- **Water and food on the main screen:** two bars beside the compass, a drop and a loaf.
  Each blinks red below 20%.
- **The survey map in Miriam's tent** opens full screen when you look at it: the concession
  with the escarpment, the Osiris Shaft, the causeway, the fence, and trenches A, B and C in
  red pencil, with the Coptic ⲡⲏⲓ beside C underlined twice. SPACE puts it down, then her
  note appears as before. (Any wall picture can do this now.)
- **The tea minigame is redrawn;** the mechanics are unchanged:
  - the workers' fire at night, with coals glowing in the corner and stars overhead
  - a brass tray with two glasses already poured, a sugar bowl and a bunch of mint
  - a clear tea glass with a gold rim, the tea darker at the bottom, foam, bubbles, mint,
    steam, and gold lines to pour between
  - a blackened teapot in a hand, tipping as you pour a thick amber stream from high or low
  - the gauges in a brass frame
- **Darts no longer throws by itself** when you start again. The SPACE press that chose
  "play" was being read as a throw. Every minigame now waits for you to let go of SPACE
  first.
- **The painted sherds** stand up out of the sand at a tilt, heaped round their foot, and
  the glint now shines on the find itself (for fossils too). Before, it glinted at the top
  of the tile.
- **The lamps:**
  - the brightness is back to how it was
  - the four camp lanterns (two in each camp) used the same sprite as the street lamps, so
    they looked like lamps put in odd places; they're hurricane lamps on crooked wooden
    poles now, with a flickering light
  - two more street lamps on the footpath south, on the same kerb rule
- **The oasis:**
  - six more palms round the pool
  - a grove of palms from the cliff down to the fence's west end, with a solid line behind
    them, so you can't walk round the fence into the dig zone that way any more
- The audit and the three playthroughs are clean. The look check shows every view
  different now, because the new corner panel is on screen.

## POKE-STYLE P0.23 — 2026-09-30 — (branch `poke-style`) The Inspector's opening begins: Saqqara (Chapter 1-B, step 1)
- **The Inspector is playable.** Pick the Inspector and their three intro scenes play (the
  ledger, the Director's office, Saqqara). Then you arrive at the inspectorate at 08:30 on
  a Tuesday morning. The plan for the rest is in `poke/INSPECTOR_TODO.md`, taken from the
  bible's Ch1-B.
- **Each background has its own place** (`poke/areas.js`): its own map, what things say,
  when its clock starts, and its story hooks. The Archaeologist's Giza is unchanged, pixel
  for pixel.
- **Saqqara** (`poke/saqqara.js`) is 80×58 tiles, the same size as the Giza camp:
  - **the desert necropolis:**
    - the Step Pyramid of Djoser inside its panelled enclosure wall, entered by the one
      real gate
    - the Heb-Sed chapels, the serdab (Djoser looks out through its holes) and the South
      Tomb's cobra frieze
    - the Serapeum's steps down to its locked gate in the cliff, and the ghaffir's hut
    - the Teti pyramid (a hill of its own rubble) and its dig with Rais Gad
    - a field of mastabas, one with a fresh robbers' hole
    - the sealed tomb in the far corner, with a faint painted river, a woman and a boy
  - **the inspectorate compound** on the escarpment's edge
  - **the coach park:** a tour coach, camels, a souvenir stall
  - **Mit Rahina, down in the green:**
    - fields and canals, and palm groves
    - village houses, some with the Hajj painted by the door
    - the mosque and its minaret, the café, the bakery, the village well
    - the market stalls, the garage, a tuk-tuk, a donkey cart
    - the museum garden with the fallen colossus of Ramesses II and the alabaster sphinx
  - new ground: fields of clover, wheat and onions, and asphalt roads
- **The people follow the bible.** Umm Sabry, Samy Ragab and Rais Gad are on the map, and
  Director Fathi is in his office. All of them have new looks, and nobody comes over from
  Giza. Everyone else is a nameless local.
- **Beat 1:**
  - tea with Umm Sabry: Samy stayed late, and "a black car comes for the Director on
    Tuesdays"; her price is gossip, so there's a task to find who's romancing the
    accountant
  - the Director: "File it as a clerical error."
  - inside the inspectorate: the scratched-out ledger line (Miriam's signature) and Shelf
    4B, empty, the label in Samy's hand
- **Water and food, as the rule says:**
  - water: the village well, water jars at the inspectorate, the Teti dig and the
    Serapeum, the office cooler
  - food: bread at the bakery, ful and ta'ameya at the café, oranges from the fruit stall
- **The Inspector's Investigation skill** (from the bible) is added to the skills.
- **The audit checks every area now.** Saqqara: 11 places, 66 things to look at, all
  reachable; its door and room are fine; 167 scenes, no errors. Giza's look check: 33 of 33
  views identical. The Giza playthroughs are clean.

## POKE-STYLE P0.22 — 2026-09-30 — (branch `poke-style`) The road lamps, evenly placed
- **One rule for every road lamp:** exactly eight tiles apart and always on the same side.
  - main road: the west kerb, from the dig gate to the way out (5 lamps)
  - the roads off it: the north kerb, 3 west to the workers' camp, 3 east to the trench
    path, 1 on the road to the guard post
- **Lamps stand exactly where they're listed.** The old code nudged a lamp down the road
  when its spot was taken, which is what made the spacing uneven. That's gone.
- **Two small moves:**
  - Miriam's metal detector stand moved one tile west, next to the finds table, to make
    room for a lamp
  - the director's camp's second lantern moved to the yard's south-west corner, so it no
    longer pokes out from behind the midnight car
- **The look check:** only lamp positions (and the lighting at night) changed. The audit
  (the midnight car still covers nothing) and the three playthroughs are clean.

## POKE-STYLE P0.21 — 2026-09-30 — (branch `poke-style`) The shaft, the old seal, the builders' ramp, the sherds and the workers' kitchen redrawn
- **The shaft entrance** stands out now:
  - a portal of big dressed limestone blocks with a keystone lintel set into the cliff, and
    a heavy timber frame inside it
  - the ladder going down into the dark, and the steel grille swung open with its padlock
    hanging
  - a timber A-frame with a pulley over the top, a yellow danger sign and sandbags
  - a lantern on a hook that glows at night
- **Petamun's seal:**
  - a round panel sunk in the rock, with a ring of pale stone round a glossy amber core
  - four glyph stones at its compass points: the owl, the eye, the serpent and the lion
  - the name cut small above it, and a timber brace across it
  - the amber glows faintly at night
- **The builders' ramp:**
  - a long mound rising east to the cliff, with a front wall of coursed mud brick
  - where the wall has tumbled, the rubble fill spills out in a fan of chips
  - on top: packed rubble, a trackway of timber sleepers and the two sledge ruts
  - a survey string on red pegs with a label tag, because it's being dug
- **The painted sherds** are curved terracotta shards with a red ochre band, a black line
  and pale broken edges, not dots.
- **The workers' kitchen** is a long trestle table under a reed-mat awning:
  - a big aluminium pot of lentils steaming on a gas ring, and the blue gas bottle
  - stacks of bread, a tray of tea glasses and a kettle
  - a chopping board with a half-cut onion, enamel plates and a basket of tomatoes
- **The vegetable crates** are proper slatted crates heaped with tomatoes, onions,
  cucumbers, aubergines and oranges, each with a burlap sack of potatoes slumped beside it.
- **The look check:** only the views with these things changed. The audit and the three
  playthroughs are clean.

## POKE-STYLE P0.20 — 2026-09-30 — (branch `poke-style`) Music; fewer lamps that reach further
- **Music** (`poke/music.js`): little chiptune loops made on the fly, with no sound files.
  Each has a square-wave lead, a triangle bass, soft arpeggios and a darbuka (doum and tak).
  Most are in maqam Hijaz, one in a minor Nahawand. Each place has its own tune:
  - **title:** slow and grand, for the title screen and the chapter-end card
  - **camp by night:** bell-like, unhurried, 16 bars (most of the story is at night)
  - **camp by day:** a walking tune over the maqsum rhythm, 16 bars (also the minigames)
  - **indoors:** a small plucked tune
  - **down the shaft:** a low drone, a slow line and water dripping

  It fades between tunes as you go in and out or the night comes on. A new **Music**
  setting (Off / Low / Normal / Loud) sits next to Sound in the menu. Browsers only allow
  sound after a key or a click, so the music starts on your first key press.
- **Road lamps:**
  - 11 instead of 18, about eight tiles apart on the kerbs, taking turns side to side
  - one at each junction's corner, none bunched up
  - the bright pool of light is the same size, but a dim glow now reaches about three
    times as far, so the road between lamps isn't dark
  - the yard lanterns got the same longer glow
- **The look check:** by day, only the lamp positions changed; by night, the lighting did.
  The audit and the three playthroughs are clean.

## POKE-STYLE P0.19 — 2026-09-30 — (branch `poke-style`) Seven buildings open up; the guard post, the trailer and the scaffold redrawn
- **You can go inside seven more buildings.** The first time you step in, you read what the
  building used to say when you examined it. What used to happen at the door now happens at
  the thing inside it belongs to.
  - **The guard booth:**
    - Farouk's chair (nobody sits in it), his radio and thermos
    - his Qur'an on its own shelf and an out-of-date calendar
    - a kettle of his tea you can pour yourself (water +15)
  - **The old Ministry post:**
    - a dusty 1998 ticket book on the desk and a 1996 plateau map ("NOT ALL")
    - Farouk's Friday galabeya on a hook and his camp bed ("never sleeps on duty")
    - a fan that shouldn't still work
  - **Lindqvist's trailer:**
    - the rattling air conditioner and a laptop of red cells ("RING THE FOUNDATION")
    - the unopened Ministry letters and photos of home
    - a fridge with bottled water (water +35, fills the canteen)
  - **The dig shed:** padlocked until the Rais opens the dig zone, and the door tells you
    so. Inside are the tool rack, the sieves, the finds trays and rubber buckets, and
    **Miriam's clipboard**. Trench B's clue is now photographed in here.
  - **The mess tent:** the long table and benches, a four-day-old newspaper. The **bread**
    (food +30, every 2 hours) and the **urn** (water +35) moved in here from the doorway.
  - **Hana's tent:**
    - her conservation table, the chemicals shelf and the first-aid tin
    - a cot with hospital corners and her photos from other digs
  - **The sheikh's tomb:**
    - the cenotaph under its green cloth, inside a railing hung with wish rags
    - **the lamp niche**, where you light a candle now
    - a patch of rock in front of its door opened up so you can stand there

  The find store stays sealed: the story opens it.
- **Redrawn from outside:**
  - **The old Ministry post** is now a real abandoned concrete hut instead of a white
    cabin:
    - render peeling to the breeze blocks, rust stains, one barred window, a rusty air
      conditioner
    - a green steel door under a slab porch, and a faded MINISTRY OF ANTIQUITIES sign
    - a bench and sand drifted against the walls
    - on the roof: a frayed flag, a guyed mast, the tank and dish, sandbags, a pigeon loft,
      old tyres, a roof hatch, a broken chair, and a washing line with Farouk's galabeya
  - **The guard booth** is a little whitewashed sentry box with a blue fascia:
    - through its window: the chair, the radio, the thermos and the Qur'an
    - basil in a tin, a lamp over the door, a plastic chair, a kettle on a gas ring
  - **Lindqvist's trailer** is a ribbed aluminium caravan up on blocks:
    - a window air conditioner, dripping
    - a Swedish flag sticker on the door and the letters piled on the wooden steps
    - a tow hitch, wheels, a solar panel, roof vents, a dish, and a cable to the generator
  - **The trench scaffold** is a real tube-and-coupler tower:
    - two bays and two lifts, braces, couplers, plank decks with toe boards, and a ladder
    - a green shade cloth, hazard tape, and a gin wheel hauling a bucket
    - sandbags on the base plates
- **The audit now checks the rooms too:** every door can be reached, every room builds, and
  everything in it that has a name has something to say. It's clean, with 134 scenes. The
  three playthroughs pass (Trench B's clue is photographed in the shed now). The look check
  shows only the views with these buildings.

## POKE-STYLE P0.18 — 2026-09-30 — (branch `poke-style`) The big boulder, the fossil pavement, water and food all over the camp
- **The big boulder** is redrawn as it's described: a car-sized limestone block with its
  front cut flat. The quarrymen's row of wedge slots and the split that never ran true are
  still in it, with pick marks, a sunlit top, a shadowed east side and chips at its foot.
  The palm beside it moved one tile east to give it room.
- **The fossil pavement** is now a real shelf of bedrock instead of beige blobs:
  - a ragged edge with sand blown back over it
  - joints splitting it into slabs, lit on the upper left
  - nummulites in drifts, two ammonites and a sea urchin
  - the loose fossils you pick up are little ammonites now

  The army crates that sat on top of it moved to the edge of the guard post yard.
- **Water and food wherever you go** (each spot fills the canteen too):
  - **a second well**, the Bedouin well by the shelter (drink 70)
  - **water jars (a zeer)** by the sieve in the dig zone, by Trench A, and at Farouk's post
    (drink 40)
  - **a sabil** by the sheikh's tomb: a stone niche with a water jar that somebody always
    keeps full (drink 40)
  - **the mess tent:** bread (+30 food, every 2 hours) and water from the urn
  - **date palms in fruit** at the oasis and by the old village: pick a handful (3 dates)
    every 4 hours
- **Thirst and hunger hints** and the canteen's description now name these places.
- **A new rule in `AREA1_TODO.md`:** every map gets a well, water jars and a food source.
- **The look check:** only the views with these changes differ. The audit (131 scenes) and
  the three playthroughs are clean.

## POKE-STYLE P0.17 — 2026-09-30 — (branch `poke-style`) Area 1 checked from end to end (step 9, part 1)
- **Area 1 (the Archaeologist's night at Giza) is complete.** Steps 1–8 of `AREA1_TODO.md`
  are done, and this update is the final check.
- **The audit:** all 124 scenes. Every conversation link and every scripted object points at
  a scene that exists. Every scene's words and choices work under 60 rounds of random story
  states. Everything you can examine can be walked to. The story's first people can be
  reached while the dig gate is still locked. The midnight car covers no door, road or
  person, and the tent door stays reachable.
- **Three full nights played on the game's own clock**, so midnight, the car and thirst and
  hunger all happen as they do in play:
  - **the quiet exit:** save and load mid-search (the car and all three searchers come back),
    and the clock running free after the chapter-end card with no second car
  - **the legal exit:** Amira called early, the shaft, save and load down it (you're back at
    the top), knocked out and robbed of the page, Amira remembering the promise
  - **the deal:** the Codex taken before midnight so the car never comes, Bosta at your heel
    across a save and load

  Money, flags and each chapter-end card came out right. No errors.
- **Speed:** 0.5–5 ms a frame at night in the busiest parts of the camp, against 16.7 ms.
- **The checks are in the repo** (`tools/poke_checks/`), to run after any change:
  - `poke_audit.js`
  - `poke_playthrough.js`
  - `poke_look.js <older build>`: the pixel-for-pixel look check

  No gameplay changed in this update.

## POKE-STYLE P0.16 — 2026-09-30 — (branch `poke-style`) Real spoil heaps; secrets and lore (Area 1, step 8)
- **The spoil heaps are real piles of earth now**, not flat ovals (you asked for this).
  - Each heap's surface is modelled with a rounded top, a soft skirt and a few lumps. It's
    drawn a pixel at a time and shaded in four flat tones by its slope, lit from the upper
    left like everything else in the camp, with pebbles and an outline.
  - **Four sizes:** the big heap by the find store down to the two small ones. Trench B's
    heap (the one with the red stake) is darker: fresh earth, as the story says.
  - **The shadow is fixed.** A soft shadow sits at each heap's foot, in place of the boxy
    building shadow they used to get.
  - A heap is solid only where it's drawn.
  - These two dig-zone views are the only things that look different; the camp's other
    31 views are pixel-identical to P0.15.
- **The secrets of the plateau** (bible §SECRETS), with a **Secrets of the plateau** page in
  the journal that counts them (and a notice as each one turns up):
  1. the bronze seal of Petamun
  2. the painted sherds that join into an ibis (and Petamun's seal has an ibis too)
  3. Miriam's bookmarked Setne story: "Coptos. The river. Why always the river?"
  4. the eye-in-a-house mark on the quarry block
  5. the car by the Osiris Shaft, from the watchtower through the field glasses

  The chapter-end card says how many you found. They pay off in later chapters.
- **Lore, ported from the 3D build:**
  - **The mason's marks:** "The Drunkards of Menkaure" in red ochre, and the much later
    eye in a house. If you've seen the block, the Codex's first page shows the same mark
    in its margin (and the other way round).
  - **The false door** in the workers' cemetery: Petety's curse, readable at Hieroglyphs 2
    (crocodiles in the water, snakes on land).
  - **The builders' ramp:** its sledge ruts, and the long argument about how the stones
    went up (Hatnub, 2018).

## POKE-STYLE P0.15 — 2026-09-30 — (branch `poke-style`) The shaft, the watchtower, the train (Area 1, step 7)
- **Inside the Osiris Shaft** (`poke/ch1_places.js`): climb down from the survey shaft at the
  foot of the cliff. There are three levels of cut limestone, each lit only by work lamps
  and your torch:
  - **Level 1:** a bare chamber, the 1999 clearance mark, the ladder down.
  - **Level 2:** three sarcophagi in their niches, lids long gone. One is granite, with a
    Greek name scratched on it and scratched out.
  - **Level 3:** flooded. Two black pools either side of a causeway of rock, the granite
    sarcophagus on its island, and **the niche** in the back wall where Miriam found the
    Codex.

  Each ladder costs five story minutes. Walk onto the ladder at the bottom to climb back up
  a level, and from level 1 back out into the night. Saving down there saves you at the top.
- **The watchtower:** climb it (Climbing XP) and every place on the plateau goes on your
  map. With Miriam's **field glasses** (one of her caches) you see a car with no lights by
  the Osiris Shaft, someone sitting very still inside. It goes in the journal.
- **The supply train runs** once Uncle Hamid has his coupling pin. The loco and its two
  skips go up and down the line, pausing at each end, with the chug of the engine when
  you're near. It doesn't block you while it's moving.
- **Trench B's red stake** stands on its spoil heap by the sieve until you've sifted out the
  MAG key.
- **The find store's Ministry seal** (paper and red wax) is on its steel door. It shows
  whether it's whole, slit cleanly, broken, or resealed with Hana's dark wax.
- Already on the map from before, and checked: Hagg Sayed and his horses, the spoil heaps,
  the mason's marks, the false door, the builders' ramp, and Bosta's home by the fire.
- **What's new to look at:** only the stake and the seal. They're small, both in the dig
  zone, and both change with the story. The camp's 33 views without them are
  pixel-identical to P0.14.

## POKE-STYLE P0.14 — 2026-09-30 — (branch `poke-style`) The phone, skills, needs, injury and the camera (Area 1, step 6)
- **Skills and XP** (`poke/systems.js`), from `story/06_SYSTEMS.md`:
  - Fifteen skills, levels 0–5 (100, 250, 450, 700 and 1,000 XP). Each background starts
    with its own levels; the Archaeologist has Excavation 3, Hieroglyphs 2, and Greek,
    Coptic, Photography and First aid 1.
  - **You learn by doing.** Excavation comes from digging, the sieve, the detector and the
    sherds. Coptic from reading the red stake; Hieroglyphs and Greek from the seal and the
    Codex; Photography from photos; Stealth from listening unseen; First aid from being
    patched up; Riding from the race. A little Egyptian Arabic comes from every real
    conversation with someone who speaks it.
  - A notice when a skill goes up.
- **Thirst and hunger** drain slowly with the story clock and are never deadly. At empty you
  can't run until you drink or eat.
  - To drink: the well at the oasis, the water barrels, tea, your **canteen** (three swigs;
    refill it at the well or the barrels).
  - To eat: lentils at the cooking table (once every three hours), dates.
  - Water and food show on the menu card and the phone, with a notice when you're thirsty
    or hungry.
- **Using things in the bag:** SPACE on the canteen, dates, the thermos of karkadeh or a
  glass of mint tea.
- **Injury:** the seal's dart, or a knock on the head behind Miriam's tent, and you limp:
  slower, and no running. Hana patches you up, or resting takes the worst of it. The menu
  card says LIMPING.
- **The phone (P):** ◄► switches app, ▲▼ scrolls.
  - MAP: open tasks, and the places you've found, with distances.
  - MESSAGES: the department's advance at 20:30, and "Go to bed, Doctor. She would want you
    to." from an unknown number at midnight.
  - CONTACTS: everyone you've met and how they feel about you. Once you have Miriam's spare
    phone you can call "A.S." from here.
  - BANK: your balance and a ledger of every payment.
  - SKILLS: dots and XP bars.
  - NOTES: the journal.
  - PHOTOS: your gallery.
- **The camera (C):** photograph whatever you're facing (with a flash). New subjects train
  Photography: the mason's marks, the false door, the red stake, the seal and more.
  Photographing the midnight visitors is the evidence scene. The old woman won't be
  photographed.
- The camp's 33 views are pixel-identical to P0.13. The story, side quests and minigames
  still play through.

## POKE-STYLE P0.13 — 2026-09-30 — (branch `poke-style`) The minigames (Area 1, step 5)
- **Five minigames in the pixel style** (`poke/minigames.js`), in place of the stand-ins:
  - **The sieve:** press ◄ and ► in turn to shake the heap. The earth drains through the
    mesh and the finds come up: sherds, faience beads, copper coins, bone, worked flint, and
    plenty of stones. ▲▼ picks one and SPACE bags it, with 25 seconds a heap. Trench B's heap
    under the red stake has **the MAG key** in it; lose it in the sand and you sift again.
    There are three more old heaps for the register (Hana's valuation adds 20%).
  - **Mint tea:** ▲▼ raises and lowers the kettle; hold SPACE to pour. Pour from a height
    for foam, but too high and it splashes. Stop at the gold line with a proper head of
    foam. The results are perfect, short, flat, messy or spilled. A perfect glass wins Saber
    over, and it's what Farouk would rather have than money.
  - **Darts on a real board:** 20 segments, doubles, trebles, the outer bull and the bull.
    Aim with the arrows. Your hand sways, and holding SPACE steadies it for about a second
    before your arm starts to shake. Let go to throw; three darts. Beating the Rais's 132
    takes two trebles. (The 3D darts could only score 125 or 150 near there, so "beat 132"
    really meant three bullseyes. The real board fixes that.)
  - **Petamun's seal:** the ring of pale stone, the amber core and four glyph stones,
    drawn as glyphs: owl, eye, serpent, lion. Pick a stone with the arrows and press it
    with SPACE. The first press wakes it, and the resonance (the beads round the ring)
    drains in about ten seconds. A wrong stone fires the cedar dart and the stones move
    round.
  - **The race:** the old grey against Hagg Sayed's bay, side-on under the pyramids. Press
    SPACE as her stride marker crosses the gold to keep her going. The three moments from
    the bible (off the line, the turn at the quarry markers, the run home) are choices
    during the race, and they change how she runs.
- **Tuned by playing them automatically:**
  - Darts: a bot with perfect aim beats 132 in about two rounds out of three. Aiming by eye
    and timing the release, a person will do worse.
  - The race: you can't win without timing your taps; decent timing wins about 30% of
    races, and good timing wins nearly all of them.
- The camp's 33 views are pixel-identical to P0.12, and the story and side quests still
  play through.

## POKE-STYLE P0.12 — 2026-09-30 — (branch `poke-style`) The side quests (Area 1, step 4)
- **All eleven side quests from the bible**, ported from the 3D build with its words and
  rewards (`poke/ch1_side.js`, `poke/bosta.js`):
  1. **The Rais's Son:** pay Mina's 1,500 EGP, hand over the darts winnings, or **race Hagg
     Sayed** on his old grey mare at the camp gate. Three choices during the race decide
     it. Win and the debt is gone (Rais +15).
  2. **Hana's Conservation:** the three sherds give you the wax and now **Hana's
     valuation**: +20% on the sherd set. Find **all eight sherds** and the register pays
     for the set (250 EGP, 300 with her valuation), and they join into Thoth's ibis.
  3. **The Tea Boy's Secret:** Saber only talks to someone who pours a proper glass (the
     kettle by the fire), then tells you about Lindqvist's burn bin. A glass of mint tea
     is also what Farouk would rather have than money.
  4. **The Truck of 1926:** the glovebox diary (the old woman with a lamp, "one of the
     Keepers"). The four relics dug with the detector get logged with the Ministry
     (600 EGP, Ministry +5), and showing the Rais the glass plate of his grandfather is
     Rais +12.
  5. **Supply Line Blues:** Uncle Hamid's coupling pin, in the sorted crates (1,500 EGP,
     workmen +10). Dig up his lost multitool and he'll be glad of it (50 EGP).
  6. **Miriam's Caches:** dig up her spare phone and you can **call "A.S."**, then or
     later from Miriam's desk. That's Amira, early (Amira +12), and the legal exit
     remembers that you kept your promise.
  7. **Darts Night:** a 200 EGP stake; beat the Rais's 132 for 2,000 EGP and the nickname
     "Abu Ramy".
  8. **Bosta:** wake the camp dog, scratch her ears, give her dates (Miriam's cache, the
     Bedouin shelter) and **she follows you**. She trots along the way you walked, sits
     when you stop, and lies down if you wait. Teach her to sit three times and she gives
     you her paw. At midnight she barks at the car and growls at Lena. She has new
     walking and sitting frames in the camp's style. While she's at home she's the same
     dog by the fire as before.
  9. **Pharaoh's Lentils:** the five fossils on the fossil pavement.
  10. **The Lamp at the Tomb:** the old woman at the sheikh's tomb (at night) knows Miriam
      is "somewhere safe" and gives you the Keepers' tile (Keepers +5). You can also light a
      candle at the tomb.
  11. **The Looters' Pit:** take the faience Eye of Horus the robbers missed, or leave it
      for the Ministry. Show it to Hana and she'll log it for the inspectorate.
- Also: Hana's finds tray, and dates at the Bedouin shelter.
- **Skills** have their starting levels by background now (the Archaeologist: Excavation 3,
  Hieroglyphs 2), with XP building up for step 6.
- **Stand-ins until step 5:** pouring tea always works, and darts is a random score that
  beats the Rais about half the time, so the 2,000 EGP isn't free. The race is choices, as
  the bible has it.
- Tested: every quest start to finish, Bosta following, sitting, pawing and growling, and
  save and load with her following. The main story still plays through, and the camp's
  33 views are pixel-identical to P0.11.

## POKE-STYLE P0.11 — 2026-09-30 — (branch `poke-style`) The detector, rebalanced
- **The detector is no longer a money printer.** Digging up all 40 spots paid about
  3,350 EGP (42% of your starting money), enough to make the payroll choice free. It now
  pays **2,041 EGP**, most of it Miriam's 1,200 EGP emergency tin, as the bible has it.
  - The 16 finds from the 3D chapter are unchanged.
  - **The seven antiquities** go to the Ministry's **finds register**: the silver
    tetradrachm, the Napoleonic button, the Mamluk fals, the Camel Corps badge, the Persian
    arrowhead, the silver ring and the quarryman's chisel. "It belongs to Egypt, not to you."
    Each pays a flat 50 EGP finder's fee (they paid 120–400 before).
  - Each one goes into a **Finds register** page in the journal with its history: the
    Ptolemies and the Library, Napoleon's savants, the Mamluks' Cairo, the Persian
    conquest…
  - Completing the register (7 of 7) gives the Ministry +5 reputation.
  - Each antiquity gives 15 Excavation XP. It's kept now, for skills in step 6.
  - The junk still pays pocket change for scrap (about 110 EGP in all).
- **Fixed:** the Napoleonic button and the Camel Corps badge used to pay you *and* let you
  keep them.
- Digging up all 40 costs about 3 hours 20 minutes of the night (5 minutes a dig), not
  counting the walking.

## POKE-STYLE P0.10 — 2026-09-30 — (branch `poke-style`) Miriam's metal detector
- **The detector is a real tool now** (`poke/detector.js`). Take it from beside Hana's table,
  then press **Q** outdoors to switch it on:
  - **The coil** swings in front of you as you walk.
  - **The tick** gets faster and higher as you close in. Its note tells you the metal: iron
    growls low, silver sings.
  - **Face the signal:** it reads loudest straight ahead, so turn on the spot to find the
    direction.
  - **Its own little screen** (bottom left) has eight signal bars. Close in and it reads the
    **metal** (IRON, FOIL, TIN, ALLOY, BRASS, COIN, SILVER) and **how deep** it is.
  - **Right on top of it**, the screen says DIG HERE, with a ring round your feet and an
    arrow over your head. **SPACE digs**: dirt flies, five story minutes pass, and you leave
    a hole.
- **40 things to find:**
  - The 16 finds from the 3D chapter now give what they say:
    - **Miriam's caches** (a side quest): her emergency tin (1,200 EGP), her spare phone,
      her field glasses, her old rucksack. Found X of 4.
    - **The four 1926 relics** (a side quest): the Kodak, the Harvard trowel, the brass tag,
      and the glass plate with the Rais's grandfather on it.
    - Eight others: coins, scrap, a thermos, a compass, Hamid's multitool…
  - 24 new ones on open sand. Most are junk: ring-pulls, bottle caps, nails, a tin spoon.
    Some are history: a silver tetradrachm of Ptolemy II, a Napoleonic button, a Persian
    arrowhead, a Mamluk fals, a Camel Corps badge, a silver ring. The site register pays a
    finder's fee for the old ones.
  - FOIL is always junk and IRON nearly always, but not quite. Brass and silver are worth
    digging.
- **What changed on the map:** the 16 small "something buried" bumps are gone. The finds are
  under the sand now, so only the detector hears them. Nothing else moved: in the pixel
  check, the only differences are those bumps (107 pixels each).
- Everything you dig is saved. The journal keeps a "Detector finds" count, and the screen
  shows how many are left.

## POKE-STYLE P0.9 — 2026-09-30 — (branch `poke-style`) The main story, and a watch in the bag (Area 1, step 3)
- **Chapter 1-A can be played from the gate to the chapter-end card.** Every main beat from
  the bible is in, ported from the 3D `ch1a_story.js` with the same words and choices:
  1. **The payroll** at the Rais's fire. The site account is 6,000 EGP short. Pay it
     yourself, send him to **confront Lindqvist** (the Foundation's "emergency float"), or
     **delay**. Each changes how people feel about you, and all three get you **Miriam's key
     ring** and open the dig gate. Lindqvist has his whole conversation: "Friday", the mother
     who died years ago, the Vasse Foundation, the "lost" key.
  2. **The trenches:**
     - **Trench A:** dig where the stake was moved, 20 minutes with the men or 45 alone, and
       find Miriam's notebook page.
     - **The dig shed clipboard:** Trench B's spoil went to the heaps by the sieve.
     - **The sieve:** under the red stake is the **MAG key**.
     - **Trench C:** the red stake with Coptic ⲡⲏⲓ on it.
  3. **Uncle Farouk** at the guard booth: the black Land Cruiser, and "the other car comes
     at midnight." Pay him 500 EGP (or give him Saber's tea, once the tea is in) and he
     owes you.
  4. **The midnight car.** At midnight, headlights on the road in. A few minutes later a black
     Land Cruiser is parked by the director's camp, and Lena Brandt and her two men are
     searching Miriam's tent for 90 story minutes. You can:
     - **listen** from the shadows
     - **photograph** them
     - **step into the light** and meet Lena (she gives you her card)
     - **slip into the tent** behind them: you're knocked out, wake at the workers' fire,
       and they take Miriam's page
     - **miss it**, and they're gone when you get back

     Walking up to the tent door while they're inside counts as finding them.
  5. **The find store:** the MAG key. Slit the seal cleanly or break it. **The Codex** is in
     Miriam's green scarf, with her note. With Hana's wax you reseal the store.
  6. **The Osiris Shaft (optional):** climb down to the empty niche on level 3. **The old
     seal** on the shaft approach: press owl, eye, serpent, lion in order from the choice
     box. A wrong stone fires a cedar dart, grazes you, and moves the stones round; Hana
     patches you up. Behind it is the **bronze seal of Petamun**. (Step 5 redraws this as a
     pixel minigame.)
  7. **Headlights**, once you have the Codex, and the exit choice: **quiet** (on foot through
     the quarry), **legal** (call Amira), or **deal** (the Foundation's car, 5,000 EGP).
  8. **The chapter-end card:** everything that carries forward (the list scrolls if it's
     long), then keep exploring the camp with the clock running free, or go back to the title.
- **The dig gate** is chained and padlocked until you have Miriam's keys, and you can't walk
  through it. The fence doesn't reach the cliffs, so the dig shed and the shaft are padlocked
  too, and the find store needs the MAG key. The chain is the only new drawing, and it goes
  once the gate opens.
- **Also ported:** the Rais's son Mina (pay his 1,500 EGP debt), Miriam's desk, books and
  photographs, Gamal and the chalk tally in the dormitory, the payroll ledger, and the burn
  bin in the site office.
- **Tasks** follow the story as you go.
- **A watch in the bag.** It's always the first thing in your BAG: a pixel watch face at the
  story time, how long until midnight, and the time in the bag's title bar.
- "New task" notices are one short line now; the full text is in TASKS.
- The minigames (the sieve, the tea) have stand-ins until step 5: sifting finds the key
  straight away.
- Tested: all three payroll choices, all three exits, every midnight outcome, and saving and
  loading at midnight. The camp's 33 views (every place, day and night, and the three rooms)
  are pixel-identical to P0.8.

## POKE-STYLE P0.8 — 2026-09-30 — (branch `poke-style`) The story clock (Area 1, step 2)
- **Chapter 1-A is one night.** You arrive at 20:30. A story minute passes for every 2 real
  seconds, so midnight comes after about seven minutes of play. The clock only runs while
  you're walking about, not during a conversation or in a menu. It stops at 04:40, and after
  the chapter-end card it runs free.
- **The light follows the story clock.** "Time of day" in Settings has a new option,
  **Story clock**, and it's now the default. The camp starts at night, and the lamps and the
  old woman come out with it. Saved settings from before this update move onto it once.
  Dawn, Day, Dusk, Night and Moving clock are still there if you want to hold the light.
- **The menu clock** on the permit card shows the story time.
- **Resting:** at the workers' fire, or on Miriam's camp bed in her tent:
  - **Rest a while:** the screen goes dark and an hour passes.
  - **Wait until midnight:** there after you've met the Rais, until the midnight car.
  - At 04:40 there's no more night left to wait out.
- **Midnight:** headlights on the east road, with a low rumble. The car arriving and Lena's
  search of the tent come in step 3.
- The camp's look hasn't changed: 33 views (every place, day and night, and the three rooms)
  are pixel-identical to P0.7.

## POKE-STYLE P0.7 — 2026-09-30 — (branch `poke-style`) The story engine (Area 1, step 1)
- **The story now has state.** A new `poke/story.js` keeps the story in `Game.story`, and it
  saves and loads with the game:
  - flags
  - affinity with people (`rel`) and reputation with factions (`rep`)
  - money: 8,000 EGP for the Archaeologist, and each background's own amount
  - tasks
  - the story clock (it's stored now; step 2 makes it run)
  - Key items go in the bag, marked with a ★ and listed first.
- **Choice boxes.** After the last page of text, a DS-style box of answers opens on the
  right, above the text box. ▲▼ picks an answer and SPACE chooses it. ESC picks the last
  answer, which is usually "leave". There's a short pause before it takes an answer, so
  mashing through the text can't pick one by accident.
- **Scripted conversations.** People and things can run a scene (lines, choices, flag
  changes) instead of their single line. Scenes use the same format as the 3D build's
  `ch1a_story.js`, so the rest of Chapter 1-A can be ported almost as it is. The new
  `poke/ch1_scenes.js` holds them.
- **Ported so far:**
  - **The arrival.** The Rais's full conversation at the gate, with its choices.
    It leaves you four tasks.
  - **Hana.** Her whole conversation, and her side quest: bring her three painted sherds.
    She gives you the conservation wax.
- **"… will remember that."** A quiet notice in the top right when a choice matters to
  someone. It never says how. You can turn it off in Settings ("Choice notices").
- **TASKS** in the menu: open tasks first, finished ones ticked off below them.
- **The permit card** in the menu shows your money.

## POKE-STYLE P0.6 — 2026-09-30 — (branch `poke-style`) Four backgrounds, each with its own opening
- **Who are you?** After the story so far, you now pick one of the four backgrounds from the
  bible (`story/01_CHARACTERS.md`).
  - Each one shows where it starts (a little painting of the place), who you are, what has
    happened to you, your skills and languages, your starting money and gear, and an
    **ONLY YOU** panel: what this background has that the other three don't.
  - **The Archaeologist** starts at the Giza dig camp. Excavation 3: the only one who can run
    a dig.
  - **The Inspector** starts at the Saqqara inspectorate. The only native Arabic speaker and
    reader, and the best start with the Ministry.
  - **The Fixer** starts at Marsa Tarfa on the Red Sea. Picks locks, haggles, dives, and owes
    Bassem "the Shark" 60,000 EGP. You choose whether they're Egyptian (Arabic 5, reads
    Arabic) or foreign (street Arabic).
  - **The Journalist** starts in Port Said. Photography 3, the best French, the most money.
  - All four roads meet in Cairo in Chapter 2.
- **Your papers match your background:** a permit to excavate, an inspector's identity card,
  a harbour pass (with the debt written on it), or a press card.
- **Each background has its own opening cutscenes** after the papers, from its region file
  in the bible, ending with you standing in your starting place:
  - The Archaeologist: the Ministry's letter of appointment, then the taxi at the dig gate.
  - The Inspector: the ledger with the Codex's line scratched out, then Director Fathi
    behind his newspaper, then Saqqara.
  - The Fixer: the note on your door, then Bassem's offer on his terrace, then the harbour.
  - The Journalist: Miriam's email, then the waterfront hotel in Port Said.
- **Only the Archaeologist's opening can be played so far.** The other three can be picked:
  you make your character and watch their cutscenes, and then it says their opening is being
  built and takes you back to the choice. Their starting areas come next.
- The shared story now ends on the bible's line: four very different people are left
  holding Miriam's trail, and you are one of them.
- **The M map follows your background:** your own opening is on it (nobody else's), and
  Giza comes back as Chapter 14.
- The pause-menu card uses your title: "Dr." only for the Archaeologist.
- The page asks browsers for the new files, so an old cached copy won't load.

## POKE-STYLE P0.5 — 2026-09-30 — (branch `poke-style`) Layout audit, solid props, a real trench
- **A layout audit of the whole camp.** Nothing stands on a road any more (except the dig
  gate and the roadblock, which are meant to), nothing overlaps, and everything you can
  look at can be reached.
  - The workers' camp, the director's camp, the guard post and the booth each sit in a
    yard of trodden sand with footprints, so each area reads as a place.
  - The roads are straight, with clean corners.
  - Buildings and props that sat on a road or in the rock were moved to where they make
    sense: the dormitory, the guard booth and Farouk's radio, the antenna, the dartboard,
    the military crates, a rock pile.
  - The wadi moved east, out of the way. A fence runs along the dig zone, with a gap for
    the gate. Planks cross Trench A.
  - Lamps step aside when something already stands on their spot.
- **Every main prop is redrawn solid and crisp:** a lit top, a shaded front and a dark side.
  - Crates have battens and a brace. Barrels and drums have lit sides, rolling hoops, a lid
    with a rim and bung, and a round end when lying down.
  - Sandbags come in two tied courses. Rocks have a lit crown and a crack.
  - Lamps have a stone foot and a glowing lantern.
  - The long tables are planked, with bowls, bread, tea glasses and greens on them.
  - The generator has vents, a panel with lights and an exhaust. The well has its frame,
    its bucket and water far down. The wheelbarrow is full of spoil with a shovel in it,
    and the vegetable crates are heaped.
- **Trench A** has a dug floor with clods, and the excavators' string grid pegged across it.
- Long tables cast a shadow at their feet, not a wall down one side.

## POKE-STYLE P0.4 — 2026-09-30 — (branch `poke-style`) A fresh camp, crisp art, real cars, the M map
- **The camp is laid out fresh, like a DS town:** a compact tile map with straight roads
  between the areas.
  - The director's camp is in the middle, the workers' camp to the west, and the dig zone
    under the escarpment to the north. The Osiris Shaft and the sealed door are cut into the
    cliff face.
  - Trench A is to the east, the guard post on the road in. The oasis, supply line,
    cemetery, sheikh's tomb, Bedouin shelter and watchtower are all a short walk away.
  - Every person and thing from Chapter 1 is still there, with their story text.
- **Crisp and solid, like the reference:** flat sand with tufts and ripples; clean paths
  with ragged edges; the oasis with a pale rim and light streaks; stepped cliffs with strata.
  No gradients or blur.
- **Cars that look like cars:**
  - The midnight Land Cruiser: black, with tinted glass and a roof rack.
  - The white Ministry cars: a blue stripe, a badge, a light bar.
  - The supply trucks: a canvas tilt and a cab with a grille.
  - The 1926 expedition truck: spoked wheels, a canvas cab and a wooden bed, half buried.
- **New: the M map.** It shows your area with the places you've found named on it; press M
  again to zoom out to Egypt. Every chapter region from the bible is there, locked until the
  story takes you there, each with a teaser. ESC is now the menu, and M the map.

## POKE-STYLE P0.3 — 2026-09-30 — (branch `poke-style`) A cleaner look, buildings with character
- **The grain is gone.** The checkerboard dithering that read as dust or noise is replaced by
  smooth blends and flat colour, and the sand has smooth dune shading.
- **Softer outlines:** each outline is a darker shade of the colour it borders, not near-black.
- **Soft shadows** under buildings, props, trees and people.
- **Closer, and more tilted:** the camera is zoomed in (about 270 pixels tall on most
  screens), and the ground is seen at a steeper angle, so front walls show more.
- **Every building redrawn with its own character:**
  - Miriam's tent: striped canvas, a sunlit roof, a khayamiya-coloured valance, a fly sheet
    over the door, a red lining inside, and her name board.
  - The dorm: a blue tin roof with a water tank, stove pipe and rust, plank walls, a porch
    roof and bench.
  - The site office: whitewashed, with blue shutters and door, a sign, rebar, and a rug
    airing on the roof.
  - The sheds: ribbed tin with double doors and padlocks.
  - The cabins: siding, stripes, window grilles and metal steps.
  - The Ministry post: a flag, a radio mast and sandbags on the roof.
  - The mess tent: patches, a stencilled number, sandbags.
  - The gear store: a striped canopy.
- **Palms redrawn** with clean tapered fronds.

## POKE-STYLE P0.2 — 2026-09-30 — (branch `poke-style`) Chapter 1 as a DS Pokémon-style game
This lives on its own branch and doesn't change the 3D game (still V4.1.6). Open
`poke.html` to play it; `poke/README.md` has the details.
- **The whole Chapter 1 map in 32×32 pixel art,** three-quarter top-down, with free
  movement in any direction. The layout is exported from the 3D build, so every building,
  prop, road, the rail loop and the 19 named places are where they are in 3D.
  - Everything is drawn in code: sand and dunes, roads, the trench, the oasis, the cliffs,
    tents, huts, trucks, the train, palms, people, and the interiors.
- **Pokémon conventions:**
  - A rock-plateau border around the map.
  - Walk up into a door to enter; a mat at the bottom of each room takes you out.
  - SPACE to look at things and talk.
  - A place-name plaque appears when you arrive somewhere.
  - A pause menu with a map, journal, bag, settings and save.
- **Interiors:** Miriam's tent, the dormitory and the site office, fully furnished, with
  new things to examine (her tea tray, her boots, the work table, the safe).
- **The opening:** five illustrated scenes of the backstory from the story bible, to hook
  new players:
  - Alexandria in 391 AD, the Serapeum burning
  - Petamun's seven Houses on a map of Egypt
  - Miriam finding the Codex
  - the black car four nights ago
  - the Ministry's letter
- **Character creation:** male or female, then 11 categories with 10–13 options each
  (skin, hair, hair colour, headwear, face, top and colour, bottoms and colour, shoes,
  accessory), many Egyptian: nemes, kohl eyes, broad collar, kalasiris, shendyt kilt,
  sidelock of youth. There's also a DS-style name grid and your finished permit.
- **Day and night:** dawn, day, dusk, night or a moving clock, with lamps and fires lighting
  the dark.
- New tool: `tools/export_poke_map.js`.

## V4.1.6 — 2026-09-30 — Narration: the text boxes read aloud, with a voice for every character
- **Text boxes are now read aloud** using the voices built into your browser, so there's
  nothing to download.
  - The **narrator** reads the story text.
  - When a character's line has "quoted speech", the quotes are spoken in **that
    character's voice**, and the narration around them in the narrator's.
  - Speech stops when a text box closes, and moves on when you pick a choice.
- **New settings tab: SETTINGS → VOICES.**
  - Turn narration on or off, and set its volume and speed.
  - A voice list for each character: the narrator, Rais Abdallah, Dr. Lindqvist, Hana, Uncle
    Farouk, Saber, Uncle Hamid, Gamal, Hagg Sayed, Lena Brandt, Dr. Amira Sayed, the old woman,
    plus "other men" and "other women" for everyone else.
  - A **pitch** slider for each character, and a **▶** button that plays a test line in their
    voice (it also plays when you change the voice or pitch).
  - **Reset voices** restores the defaults.
- **Default voices:** each character starts with a voice of their gender, spread so neighbours
  sound different, and with their own pitch and pace (the Rais slow and deep, Saber quick and
  high, Farouk slowest of all). The most natural voices are picked first.
- **Getting better voices:** Microsoft Edge has the most natural free voices (marked ★ in the
  list). In Windows you can add more under Settings → Time & Language → Speech → Add voices.
  The VOICES tab says how many voices your browser has.

## V4.1.5 — 2026-09-29 — Lindqvist can be asked about the wages
- **Meeting Dr. Lindqvist before settling the payroll** now gives you *"The Rais says the
  men haven't been paid in eleven days."* He dodges: "Friday. The transfer's coming
  Friday. Geneva is slow." You can press him (he said Friday last Friday too). That costs a
  little of his goodwill (Lindqvist -3) and goes in your notes.
- When you then talk wages at the Rais's fire, you tell him what Lindqvist said, and he
  just repeats "Friday."
- The real answer still comes the bible's way: choose *"Lindqvist is going to explain where
  that money went"* at the fire, then confront him at his trailer. All three payroll
  outcomes are unchanged. The bible's Ch1-A beat 2 now includes the dodge.

## V4.1.4 — 2026-09-29 — Chapter 1: real sand, and a lighting pass through the whole day
**The sand**
- The ground is now your photographed sand (Ground089, from ambientCG), with its colour,
  surface relief, roughness and shading. Each tile covers about 2.5 m, and a second, larger
  sample breaks up the repeat.
- Its colour is balanced toward the old palette, so the level doesn't turn orange. The
  old wind ripples are still there as a light shading pattern about 8 m apart.
- The drawn sand is still the fallback if the texture file is missing.
- New tool: `tools/pack_texture.js` packs any ambientCG / Poly Haven texture folder into
  `textures/<name>.js` (1024 px JPEGs as data URIs, 0.44 MB for the sand). This is needed
  because browsers won't let WebGL use image files from a double-clicked `index.html`.

**The lighting (Chapter 1)**
- **Sunrise fixed:** the sun now casts the light and shadows as soon as it clears the
  horizon. Before, dawn was lit from the moon's side until mid-morning, and the dunes had
  a white glare lit from below the horizon.
- **Golden hour:** the low sun now turns deep amber, with long shadows across the sand, and
  there's still some warm light right at sunrise and sunset.
- **Noon:** more sunlight against less sky light, and slightly lower exposure. The midday
  scene had very little contrast; now shadows and sand detail read.
- **Night:** moonlight is softer and bluer, so the dunes no longer shine white under the moon.
  Lamps and fires carry the camp.
- The brightness setting still scales everything as before.

## V4.1.3 — 2026-09-29 — Crates, drums and barrels: mixed, not the same box everywhere
- **Every crate in the world now picks a look.** The same spot always gets the same one:
  - Single crates are the nailed wooden crate (with FRAGILE sticker) or the old SCA-stencilled box.
    They keep their size, so radios, tools and lamps still sit on them.
  - Crate stacks are strapped shipping crates, a pile of crates with one fallen off, or
    a hand-stacked mix of singles.
- **Drums:** the blue water drums are the real plastic drums, with caps; one lies on
  its cradle with a tap. Fuel drums are red and black oil drums, and the rusty oil drum
  is the black one. Every drum is turned a different way.
- **New set dressing:**
  - **Vegetable crates** at both ends of the camp kitchen table: the slatted crates with
    tomatoes, onions, cucumbers and aubergines.
  - **A wooden water barrel** with a dipper in the mess tent.
  - **Army crates** (one open) against the old Ministry post.
- `prepare_model.js` now converts old "specular-glossiness" materials, which this Three.js
  version can't read and draws white. The crate pile needed it.
- Mess tent collision now matches the canvas (the model's width includes its guy ropes).
- Saved for later chapters: the bourbon-barrel row (Ch2/Ch3 cafés and cellars) and the
  untextured "crates" kit.

## V4.1.2 — 2026-09-29 — Your new models in the camp: dartboard, radio, the Codex, tents, camp kitchen, dig tools
- **The dartboard** in the worker camp is now the real Winmau board. It's sized so its
  double ring sits exactly on the game's scoring edge, so darts score the same as before.
- **The radio** is the Philips portable, on its crate in the worker camp. A second one sits
  on a crate beside **Uncle Farouk** at the guard booth, with his thermos (new: "Farouk's Radio").
- **The Codex:** when you unwrap it in the find store, the book appears above the text
  and turns slowly in the lamplight.
- **New: the Mess Tent**, north of the director's camp. It's the military marquee, open to
  the camp, with a trestle table, benches, a tea urn, bread and a lamp. You can look inside.
- **New: Hana's Tent**, the round canvas tent with its awning, beside the mess tent.
- **New: Miriam's Camp Kitchen** beside her tent. It's the camping set: stove, blue gas
  bottle, red cooler, enamel mugs and a folding table, all on a kilim. The set arrived all white,
  so every piece is given its own colour and finish in the game.
- **A fourth find on Hana's table:** the pottery strainer (the "sieve" model). It's an
  ancient perforated bowl of the kind used to strain beer mash in the workers' town. The
  finds tray text mentions it.
- **New: the Tool Rack** in front of the dig shed: shovels, picks, a broom, a hoe, a
  folding army spade and rubber buckets. A **wheelbarrow, shovel, pick and buckets** now sit at the
  north end of the east trench.
- **Model tools:** `prepare_model.js` gained `--drop` (throw away a piece, like the
  fishing rod), `--keepmat` (keep parts by material, for packs grouped that way) and
  `--error` (how far simplifying may go).
- Downloaded props are now skipped when off-screen. Only animated characters are always drawn.

## V4.1.1 — 2026-09-29 — Your downloaded models: the first ones in the game, and a plan for the rest
- **Hana's table now holds real scanned artefacts** from your model library:
  - The seated limestone statuette of Steward Au, cut out of the statue pack.
  - The leather sandal.
  - The papyrus fragment.
  - A new **"Hana's Finds Tray"** to examine: Excavation XP, and Hana's line that Miriam
    wouldn't let the statuette go into the find store.
- **Model tools:**
  - `tools/preview_models.js` renders a picture of every model and reads its triangles,
    textures, size and animations. The contact sheets are in `models/previews/`.
  - `tools/prepare_model.js` picks one piece from a pack, cuts it down to a triangle budget
    while keeping its textures, and shrinks textures. The papyrus went from 193k to 5k
    triangles, and the statue from 65k to 9k.
  - Draco-compressed models (the Ramesses III statue, the spice stand, one temple) are now
    supported.
- **Matte option for scans:** scanned models often arrive marked as metal, which renders
  black at night. The loader's `matte` option makes them stone, leather and papyrus.
- **New asset guide, `story/07_ASSETS.md`:**
  - Where each of your 31 models belongs (Cairo museum, Alexandria, Tanis, Karnak, the
    Houses and so on), with the triangle budget for each.
  - A **Chapter 1 wishlist** of everything in the camp you could find models for, with
    search terms: characters, animals, vehicles, buildings, props, small finds.

## V4.1.0 — 2026-09-29 — Chapter 1 completed against the bible: systems, missing content, new places
**New systems (story/06_SYSTEMS.md):**
- **Skills and XP.** 16 skills, levels 0–5. You start with your background's levels
  (Archaeologist: Excavation 3, Hieroglyphs 2, Greek, Coptic, Photography and First aid 1).
  You learn by doing:
  - digging, sieving and finding things
  - reading the seal, the stake, the false door and the Codex
  - talking with Egyptian speakers (Arabic)
  - sneaking, photographing, climbing, riding

  Level-ups show on screen. Excavation and Hana's valuation raise sieve pay.
- **Thirst and hunger.** Two small meters under your money. Refill them at the well, the
  water barrels, your canteen, the tea, the cooking table's lentils, or dates. At empty you
  can't sprint, but it's never deadly.
- **Failure states.**
  - The old seal's dart injures you, so you limp until you rest or Hana patches you up.
  - Slipping into the tent behind Lena's men gets you knocked out. You wake by the fire 1.5
    hours later, injured, and they've taken Miriam's notebook page.
- **The phone (P).** Map (tasks and places found), Messages, Contacts (with calls), Bank
  (a ledger of every payment), Skills and Notes.
- **Day and night.** Chapter 1 stays one night. After the chapter-end card, time runs on
  (a 48-minute day): dawn, a moving sun and blue sky at noon, dusk, then night again. Lamps
  dim by day, and the old woman at the tomb is only there at night.

**Missing bible content, now in:**
- **Miriam's spare phone** (a cache) with "A.S." saved. Calling it reaches Amira early,
  and the Ministry exit remembers your promise.
- **The quarry mason's marks:** "The Drunkards of Menkaure" (a real gang name), and an
  eye-in-a-house mark that matches the Codex.
- **Hagg Sayed and his horses** at the camp gate. **Race him** for Mina's debt; three
  choices during the race decide it.
- **Hana's valuation:** +20% on sieve finds and the sherd set.
- **Four 1926 expedition relics** round the old truck (detector). The glass-plate photo
  shows the Rais's grandfather, and you can show him.

**The layout audit filled the empty stretches with new places:**
- **The Workers' Cemetery:** the pyramid builders' tombs, a false door with Petety's real
  curse, and a looters' pit.
- **The Sheikh's Tomb:** a whitewashed shrine, and an old woman with a lamp at night who
  gives you the Keepers' tile.
- **The Watchtower:** climb it to put every place on your map. With field glasses, you see
  a car by the Osiris Shaft.
- **The Builders' Ramp.**
- **The Old Quarry:** the rock field, now a named place.
- **The Fossil Pavement:** five nummulites, "pharaoh's lentils".

**The story bible is updated to match:** the region file (side quests SQ-01A-01 to 11,
places, people, systems), characters (Saber, Hamid, Gamal, Hagg Sayed, the old woman,
Bosta), a build-status table in `06_SYSTEMS.md`, and the side-quest index (141 quests).

## V4.0.7 — 2026-09-29 — Realistic style chosen; test characters removed
- **Art direction decided: realistic.** Characters will be realistic, rigged and animated with Mixamo. The model pipeline (converter, loader) stays.
- The two test people in front of the tent are gone. The low-poly test model is deleted. Remy (realistic, with walk and dodge) stays packed in `models/`, ready for casting, but isn't loaded, so the game loads as fast as before.

## V4.0.6 — 2026-09-29 — Remy dodges
- The realistic test character (Remy) now has a second Mixamo animation, **Dodging Right**. He walks his beat in front of the tent, and at each end dodges to the right, then walks back. The new animation added only 0.05 MB, because it was downloaded without a skin.

## V4.0.5 — 2026-09-29 — Downloaded 3D models: a pipeline and two test characters
- **The game can now use downloaded 3D models.** A converter (`tools/convert_models.js`)
  takes .fbx, .glb or .gltf files, merges in Mixamo animations, shrinks textures, and packs
  the result into `models/`, so it works when index.html is opened from your folder and
  on GitHub Pages.
- **Two test people stand in front of Miriam's tent:**
  - **Low-poly:** "Man in Suit" by Quaternius (0.7 MB, 11 built-in animations). He idles
    and claps now and then.
  - **Realistic:** "Remy" from Mixamo, with Mixamo's Walking animation (11 MB after
    shrinking from 28 MB). He walks up and down in front of the tent.
- The test people are temporary, so you can compare the two styles.

## V4.0.4 — 2026-09-29 — Bosta the camp dog, the turning loop, the Bedouin camp, office fixes
- **Bosta, the camp dog.** She's a sandy baladi dog: one ear up, one flopped, a curled
  tail. She arrived in the back of the post van, hence the name, and she's now fully
  rigged and alive.
  - **Her own routine:** she sleeps by the fire (paws paddling in dreams), wakes, and
    wanders the camp. She begs at the cooking table, lies at the Rais's feet, sniffs
    about, and goes home to sleep again.
  - **Around you:** she watches you as you pass. Her tail wags more the more she likes
    you, and once she likes you she comes over to say hello.
  - **Talk to her:**
    - Scratch her ears and she flops over for a belly rub.
    - Give her dates. Win her over and she **follows you**: she trots along your trail,
      sits when you stop, and lies down if you wait.
    - "Stay" sends her home.
    - Ask her to sit three times and she learns to give a paw.
  - **At midnight** she barks at the black car and growls at the woman in black. Lena
    notices her if she's with you.
  - **Sounds:** synthesized barks, growl and whimper. She also appears in the J notes.
- **The supply train turns round properly.** A balloon (turning) loop has been added at
  the camp end. The train comes in loco-first, runs round the loop past a switch lever,
  and stops at the bay already facing out. It loads, then leaves loco-first. It no longer
  reverses back in. Uncle Hamid has moved beside the bay.
- **The Bedouin camp:** a real goat-hair tent (*bayt al-sha'r*). The woven strips sag
  between the poles, with a back wall, guy ropes and stakes, a patterned partition
  curtain, kilims and a row of cushions, and a camel saddle. Out front, water skins
  hang on the poles, and the hearth has glowing coals, three brass *dallah* coffee pots
  and cups. The dates are covered on a stone. There's firewood, and a camel couched
  beside the tent, hobbled, chewing its cud side to side and flicking its tail.
- **Site office front fixed:**
  - The sign now sits over the lit window (it used to butt into the door lintel).
  - The second window moved in from the corner.
  - The shutters hinge open from the window edge (they used to poke into the wall).
  - The air-conditioning unit moved to the back wall (it hung over a window).
- **Water barrels fixed:** three drums stand in a row, with a tap drum lying on a wooden
  cradle and a tin cup below. The shared drum helper spaced drums closer than their own
  width, so the fuel drums were overlapping too. That's fixed everywhere.

## V4.0.3 — 2026-09-29 — A proper fire at the workers' brazier
- **The flames live now.** Eighteen flame tongues, in three hand-shaped variants, are born
  at the coals, lick upward, narrow and redden, and die. That replaces five sprites that
  only stretched in place. There's a warm white-hot heart over the coals.
- **The coal bed:** a pile of cracked lumps glowing from inside, pulsing with the flames.
  Charred logs with glowing ends lie in the basket.
- **Sparks** are small and quick. Most wink out within a hand's breadth, and now and then
  a log settles and throws a burst up past the kettle. They replace the big orange blobs.
- **The kettle is a real Egyptian teapot:** blackened, with a round body, domed lid, knob,
  curved spout and handle. It used to look like a black top hat.
- **The firelight** on the camp now flickers in step with the flames.
- **The sound of the fire:**
  - A low rolling roar that swells and opens up as the flames rise.
  - A soft hiss.
  - Three kinds of crackle: dry ticks, resonant woody snaps, and a low knock when a log
    settles, which sets off a quick run of crackles.

  Before, it was only faint high clicks. The sound grows as you walk closer.

## V4.0.2 — 2026-09-29 — Gender: male or female
- The character-creation screen now offers only **Male** or **Female** (the Non-binary
  option is removed), and the row is labelled GENDER. Pronouns and forms of address follow
  the choice ("ya basha" / "ya hanem"). The default is Male.

## V4.0.1 — 2026-09-29 — Quarry, 1926 truck, find store (Chapter 1 visuals)
- **The chalk towers are now the old limestone quarry** where the pyramids' stone was cut.
  Each knob of bedrock has a rough, weathered crown and cut faces stepping down in
  terraces. Half-cut blocks still stand in their separation channels, with wedge sockets
  under the ledges and chip spoil and abandoned blocks at the foot. Collision and
  sightlines are unchanged. Each knob is merged into a few meshes, so it still runs at 60 fps.
- **The buried Land Rover is now the Harvard–Boston Expedition's 1926 truck:** a brass
  radiator, spoked wheels, a roof on posts, a slatted bed, and a stencilled tailboard
  hanging open, half swallowed by a dune.
- **The find store looks like one:** a steel door, a padlock under a Ministry seal of paper
  and red wax, a FIND STORE sign, and crates of finds outside. It's no longer the tool
  shed with a "TOOLS" sign.

## V4.0.0 — 2026-09-29 — The new story begins: Chapter 1 rebuilt (the Archaeologist)
- **New Game now opens a character-creation screen.** You pick a name, gender (pronouns
  and how people address you) and background. Only the Archaeologist is playable: the
  Inspector, Fixer and Journalist show as "coming in a later update." Choice notices can
  be turned on or off here.
- **Chapter 1 is the new story's Archaeologist opening** (`story/regions/ch01_opening_archaeologist.md`),
  built on the existing camp. The old story (Ellis, Sam, Tariq, the Codex pulse, sanity)
  is gone from it.
  - **New people:** Rais Abdallah, Dr. Lindqvist, Hana, Uncle Farouk, Saber the tea boy,
    Uncle Hamid and Gamal, plus Lena Brandt's team at midnight.
  - **Main path:** the payroll choice (pay / make Lindqvist pay / make the men wait) opens
    the dig zone. Trench A holds Miriam's notebook page, Trench B's spoil (sieve) holds the
    find-store key, and Trench C is the Coptic stake. The find store holds the Codex. The
    exit choice (quiet / call Amira / the Foundation's car) leads to a chapter-end card.
  - **The midnight car:** at 00:00 on the new story clock, a black Land Cruiser drives in,
    and three people search Miriam's tent. You can listen, photograph them, confront
    them, or miss it.
  - **Optional:** the Osiris Shaft, and Petamun's seal (the glyph-seal minigame) with the
    bronze seal behind it.
  - **Side quests:** the Rais's son, Hana's sherds, Saber's tea and the burn bin, the
    1926 truck, the supply line's coupling pin, Miriam's buried caches, and the darts
    tournament.
- **New systems:**
  - The HUD clock replaces sanity. Waiting at the fire or bed skips time.
  - Relationships and faction reputation, with "___ will remember that." notices.
  - **J** opens your notes and the people you know.
  - Old saves don't load (new save key).
- Retired: the satphone, the Ministry inspector, Sam's gear, and the old patrols.
- Still to do: re-model the chalk towers as quarried limestone, turn the buried Land
  Rover into a 1920s truck, and put a find-store sign on the shed.

## Story bible rewrite — 2026-09-29 — docs only (no version bump)
- **The whole story has been replaced.** The old bible (`MASTER_LORE_BIBLE.md`,
  `NEW_CHARACTERS.md`) and its story are retired: Ellis, Sam, the Uarha, the Heart, and
  the Order of the Unshut Eye are gone. The new bible lives in `story/`:
  - `00_MASTER_BIBLE.md` covers the premise: the Codex, the lost Library of Alexandria,
    and the Book of Thoth. It also has the real history underneath, the three acts,
    tone and writing rules.
  - `01_CHARACTERS` · `02_FACTIONS` · `03_CHOICES_AND_FLAGS` (the master choice map) ·
    `04_ENDINGS` (7 endings with variations) · `05_ECONOMY` · `06_SYSTEMS` (skills,
    language gates, 18 failure states, day/night, the phone).
  - `regions/`: 4 background openings and chapters 2–14, each with beats, places, NPCs,
    side quests, jobs and secrets.
  - `SIDE_QUESTS_INDEX.md`: 137 side quests, generated from the region files.
- The game code is unchanged. The next step is rebuilding the game chapter by chapter
  against the new bible, starting with the Archaeologist opening (the built Giza camp).

## V3.8.2 — 2026-09-29 — Rougher chalk formations
- The White Desert chalk is now weathered rock instead of smooth. A ridged "crag" noise
  breaks up the silhouettes, and wind-eaten pockets gouge into the sides. Fine chips
  roughen the surface and the wind-cut ledges are deeper and sharper. The stone is
  flat-shaded, so every facet catches the light. Shapes (mushroom and whaleback) and
  collision are unchanged.

## V3.8.1 — 2026-09-29 — Chalk formations reshaped
- The White Desert rock formations looked like dark "post and slab" blocks. They're now
  smooth, wind-sculpted chalk: bright pale stone with faint wind-cut banding, pits
  and dark flint nodules. **Mushrooms** have a flared foot, a neck undercut by the wind
  and a lumpy overhanging cap. **Whaleback yardangs** are streamlined north–south, with a
  blunt nose and a long tapering tail. Each sits in a skirt of fallen chalk. Collision is unchanged.

## V3.8.0 — 2026-09-29 — Chapter 1 interiors; vegetation where the water is
- **Interiors** (`ch1_interiors.js`): the three Chapter 1 buildings are fully built
  rooms now instead of grey boxes, lit by warm lamps (tone mapped, and the Brightness
  setting applies). All collision and interactables are exactly where they were.
  - **Ellis' tent:** a canvas roof on a ridge pole, groundsheet and kilims, the Codex
    glowing faintly on the work table under a hanging hurricane lamp (loupe, notes),
    the cot with a camp chest and lamp, trunks and crates, a bookshelf, the journal
    desk and chair, the photographs pinned to an easel, boots, a jerrycan, a coat on
    a peg, and the doorway open onto the night.
  - **Workers' dormitory:** plank floor and walls, a corrugated roof on rafters, ten
    bunks with mismatched blankets, boots, washing on a line, moonlight through three
    windows, one lantern still burning low by the sleepless worker, the blue-eye
    talisman over its cot, and tally scratches on the wall.
  - **Foreman's office:** plaster walls, a tiled floor, a slowly turning ceiling fan,
    shelves of files, the corkboard with notes and red string, the desk with ledgers,
    telephone and lamp, the counter, the manifest on its hook, Sam's box of notes,
    a site map, a heater, a water cooler, shuttered windows, and a bare bulb over the door.
- **Vegetation placed by water:** a dry wadi channel (gravel bed, soft banks) now
  runs down the valley between two ridges, with acacias along both banks. Plants
  grow in clumps where water would be:
  - dense tamarisk and greener grass round the oasis
  - tamarisk and camel-thorn along the wadi
  - scattered camel-thorn tussocks with grass in their lee at the dune feet
  - nothing on dune crests or bare flats

  This replaces the even random scatter. Two chalk clusters that sat in the wadi
  moved aside.

## V3.7.0 — 2026-09-29 — Paths, living supply line, backpack, tips
- **Paths are clearly defined now:** every track is its own surface laid over the sand.
  Roads are compacted dirt with gravel and two dark tyre ruts, and footpaths are packed
  sand with footprints. Both feather into the desert at the edges and follow the ground
  exactly, and the bed under them is levelled a little wider than the track. Footpaths
  are lined with whitewashed stones, the way Egyptian camps and posts mark theirs.
- **The supply line is alive:** a narrow-gauge line runs from a loading bay by the camp
  gate, south-west through its own cutting in the dunes and out of the site. A worker
  (not interactive) shovels spoil into three tipping skips. When they're full the little
  yellow diesel sounds its horn and hauls them away (smoke, rolling wheels) until they're
  gone in the haze, then brings them back empty and the cycle repeats. You can watch it
  leave, but the dunes won't let you follow. The Supply Line story interaction is
  unchanged, and the bay has a sign, a lamp and crates.
- **Painted sherds:** now curved pieces of a jar's shoulder with a red-ochre band and
  black lines, half-buried at an angle, with a bright halo and a slowly turning cross flare.
  The one at the wreck (and two others) were buried in props; they're in the open now.
- **The horizon pyramids** have limestone block courses, block-to-block tone, weathering
  streaks and missing blocks, with Khafre's white casing surviving at the top. They're
  larger now too, so they rise above the new dunes.
- **Backpack** (`backpack.js`): 10 units of space. The metal detector takes 4, the canteen
  and field glasses 2, small things 1, and sherds and dates stack. Story items ride in your
  pockets and never take space. **I** opens it (hold, use, drop), **G** holds or puts away
  a tool, **Q** drinks from the canteen.
  - **Metal detector:** moved off the tent door to a crate by the equipment table, with a real
    model (S-shaft, control box with LCD, search coil, coiled cable). It must be held
    (G): you see it in first person, the coil sweeping as you walk, and it only ticks and
    reveals caches while it's in your hands.
  - **More to find:** a canteen at the oasis well (3 drinks, refilled at the well), dates at
    the Bedouin shelter, 4 new buried caches (field glasses, a signal mirror, a date tin,
    coins), and the tin compass is now a keepsake item. **Field glasses:** hold them,
    then right-click to look far.
- **Cairo (Chapter 3):** the tea vendor also sells a canvas rucksack (350 EGP) that raises
  backpack space to 16. Nothing else in that chapter changed.
- **First-steps tips** on a new game: 8 tips in the bottom-left corner, each shown for ~10 s,
  a 5 s rest, then the next (paused during conversations, menus and minigames). Hold
  **X** to switch them off for that game.
- **Fixes:** the rock that looked like it sat on the guard booth (a chalk formation behind
  it) and the ridge crowding the ministry post were moved back, and the ministry area has
  more level ground. Cliff rocks no longer land on the dig fence line.

---

## V3.6.0 — 2026-09-29 — Chapter 1: breaking the sightlines
Before this, you could see about 10 of the other 11 areas from any area (the camp sat in a flat bowl),
so the map read as one small space. Using open-world level-design practice (block
sightlines at several terrain scales, screen with rock and tree lines, let places reveal
themselves as you come over a rise), with things you'd actually find in Egypt:
- **Seif dunes:** 9 long knife-edged ridges (up to ~5 m) running roughly north–south
  between the areas, with a steep slip face on one side and a long back on the other. You can walk
  over them, and cresting one gives you a view. Where a track crosses, the ridge dips to a saddle
  you walk over but can't see through. They lie down near anything built.
- The general dunes are also taller, so there are three scales of terrain everywhere.
- **White Desert chalk formations:** 10 clusters of wind-carved mushroom and fin rocks
  (yardangs), streamlined north–south. They block the view, glow under the moon, work as
  landmarks, and are solid.
- **Vegetation:** a date-palm plantation west of the oasis, more palms round the oasis
  itself, acacia trees in the dry wadi, and feathery tamarisk thickets along the wadi, the
  oasis and the ridge feet. Palms and tamarisk are instanced, so they cost little to draw.
- **Result:** from each area you now see only its neighbours plus the raised dig plateau
  (on purpose — it's the landmark). Measured by a terrain line-of-sight check,
  before counting the rocks and trees.

---

## V3.5.0 — 2026-09-29 — Chapter 1 goes open world; cinematic conversations
**The map (3D build only; the 2D build keeps the old map)** — `ch1_layout.js`
- Chapter 1 is now an open desert of about 330 × 275 m (it was about 120 m square). Each
  area keeps its layout, objects, scenes and flags, but the areas are pulled apart and
  linked by trodden tracks: Ellis' camp in the middle, the workers' camp to the west,
  the ministry post east (the car drives up its own road), the east trench to the
  north-east, the camp gate south, and the dig zone up on a plateau to the north with
  a switchback climb to its gate. Travel is about 15–30 s between areas on foot.
- Level-design principles from open-world games:
  - **Hidden boundaries:** a ring of dunes rears up at the edge, too steep to climb.
    The collision sits on that slope and the desert rolls on to the horizon beyond.
    Rock outcrops and old sand fences mark the dune foot. Cliffs close the dig
    plateau's sides and the escarpment backs it.
  - **Roads never just stop:** both leave through a cut in the dunes to a closed
    Antiquities Police barrier.
  - **Guidance:** landmarks you can see from afar (the tunnel cliff, the radio mast,
    the lookout ridge). Leading lines: telegraph poles and wires along the roads,
    lamp posts along the footpaths. Fingerposts at the junctions.
  - **Tracks:** worn flat and sunk into the sand, following the terrain.
- A light pool gives the nearest lamps real light, so there can be many more lamps
  without costing frame rate. The whole map is filled with pebbles, stones, grass
  and camel-thorn.
- Old saves from the boxed map load fine: you resume at the tents.

**Open-world content** (`ch1_openworld.js`; own ow_* flags, no story changes)
- New places, each with its own interaction: the Oasis and its well (drink: stamina
  refill), the Old Village ruins, the Lookout ridge and its cairn (sanity), a
  Wrecked Land Rover (a little cash), a Bedouin Shelter, the Spoil Field, and camel
  bones in the dry wadi. Each place's name appears the first time you walk in.
- **Mint Tea** minigame at the kettle by the workers' brazier: hold the mouse to
  pour, and move the mouse up and down for pour height (high for foam, too high splashes).
  A perfect glass gives Mint Tea (faster stamina recovery), which had no source
  until now.
- **The Sieve** minigame at the spoil field: shake the sieve with the mouse,
  and click the finds to bag them (stones are just stones). It pays a little EGP, 3 heaps.
- **Sam's metal detector** (in the camp): once you carry it, it ticks faster near
  8 buried caches (EGP, Karkadeh, Mint Tea, a sanity keepsake).
- **8 painted sherds** hidden round the map (15 EGP each, with a 250 EGP bounty for the set).
- **Compass** at the top of the screen showing your open missions with distances,
  and faint "?" marks for places you haven't found.

**Cinematic conversations** (`cine3d.js`)
- Talking to someone eases the camera into an over-the-shoulder shot, and they gesture
  as they talk. Examining a thing moves in close on it; for big things you turn to
  face them. Letterbox bars slide in and the HUD steps aside. Story-triggered scenes
  keep your view and only get the bars.
- Dialogue restyled as film subtitles. Lines type out (SPACE or a click finishes them),
  choices are numbered and 1–9 picks them. New setting: Text speed (Normal / Fast / Instant).

---

## V3.4.0 — 2026-09-29 — Title screen, prologue, settings, ambience, feel
- **New title screen** (`title3d.js`, `ui3d.css`): it opens on a letterboxed
  "PRESS ANY KEY" splash over slow cinematic shots of the night camp that cut
  through black (the festooned tent, the tunnel seal, the brazier, the pyramids,
  the trench). There's a seal emblem (the Tunnel Gate Seal's four stones round a
  core) whose core pings every 8 seconds with a low tone, like the Codex in
  Ellis's tent. The menu is a left-aligned PC-style list you can use with the
  mouse or ↑/↓ + Enter: Continue (shows chapter and when you saved), New
  Excavation (asks before overwriting a save), Settings, Site Overview.
- **Prologue on a new game:** place/time cards over black ("Giza Plateau,
  Egypt / Autumn, 2023 / The twenty-second night of the excavation."), then one
  establishing shot descending onto the lamplit tent, then the game's own
  opening fades in as before. ESC or Enter skips it. No story text changed.
- **Settings screen** (`settings.js`), from the title and from the pause menu,
  saved in the browser. Graphics: quality preset (Low/Medium/High/Ultra —
  resolution, shadows, dust), brightness, field of view. Controls: mouse
  sensitivity, invert Y, key list. Audio: master, ambience, footsteps.
  Gameplay: object labels (nearby/always/off), controls reminder, head bob,
  reduce motion (calms the low-sanity camera sway/tremor).
- **Ambient sound** (`ambience.js`, Ch1): synthesized gusting desert wind, the
  brazier crackling as you get close, the generator's diesel hum, crickets.
- **Mechanics / feel:**
  - Interaction now picks what you're looking at when several things are in
    reach. The prompt names it ("SPACE  TARIQ"), and there's a small crosshair
    that lights up on a target. **F** also interacts.
  - Fixed: pressing SPACE during a minigame could re-open its dialogue.
  - Walking eases in and out (same top speed), with a small sprint FOV kick
    and a camera dip when you land a jump.
  - HUD restyled: a compact sanity/funds panel, and a thin stamina bar at the
    bottom centre that fades out when it's full and turns red when you're low.
  - The ministry car is now a proper black saloon facing the way it drives,
    with its headlights on.
- Pause menu: new Settings button, and the footer shows the real version.

## V3.3.0 — 2026-09-29 — Ch1 minigames played in the world
Both Chapter 1 minigames now play in 3D in the actual place, like a PC game
instead of a flat pop-up card. Rules, flags, records and story scenes are unchanged.
- **The Tunnel Gate Seal:** the camera steps up to the stela. Mouse over the real
  glyph stones and click to press them (or use keys 1–4). Pressed stones sink and light up.
  The resonance timer is a ring of beads around the seal, and the core pings every
  8 seconds like the Codex. A wrong stone fires the cedar trap dart out of the rock into
  the timber brace, the screen shakes, and the stones grind round to new positions.
  Solving it spins the ring. Right-click or ESC steps back.
- **Camp Darts:** first person at the throwing line. Aim with the mouse against
  natural hand sway. Hold the left button to steady your breath (the view tightens
  and a breath bar shows how steady you are), but hold too long and your arm shakes.
  Release to throw. Darts fly, stick in the board and stay there. Score popups appear
  at the board. The result panel has Throw Again (R) / Walk Away (ESC).
- The seal stela was rebuilt to match its description: a pale ring, a dark amber core,
  four glyph stones at the compass points, and a timber brace for the trap.
- The dartboard's rings now match the scoring zones. Sam's chalk "S — 132" is on the plank.
- The 2D build still uses the original 2D versions.

## V3.2.0 — 2026-09-29 — Chapter 1 camp visual overhaul
The first open area (the Giza dig camp, up to the Tunnel Gate Seal) was
rebuilt visually from scratch. No story, dialogue, flags or collision changed.
- New files: `ch1_world.js` (terrain, sky, lighting, FX) and `ch1_props.js`
  (buildings, props, fences, vehicles). The old Ch1 art code was removed
  from `engine3d.js`.
- Lighting: moonlight with soft shadows, tone mapping, warm lamp pools with
  glow halos. It reads as night but you can still see where you're going.
- Sky: a shader sky with twinkling stars, the Milky Way, thin moonlit cloud
  and Cairo's glow on the horizon. The moon has craters. The Giza pyramids
  and distant city lights sit on the horizon.
- Terrain: rolling dunes out to the horizon, trodden paths and tyre-rutted
  roads, a bulldozed berm around the site edge (so the invisible border
  walls have a visible reason), and a rock escarpment across the north.
  The east trench is now actually dug, with ramps, shoring, planks and spoil.
- Buildings: a canvas wall tent with a porch and a lit interior, a timber
  bunkhouse with a water tank and a washing line, a plastered mud-brick site
  office, and ministry portakabins. The Tunnel is now a timbered portal cut
  into the rock, with a rock-cut approach.
- Props: every prop was remade (trucks, SUVs, generator, mine carts, braziers,
  scaffolding, palms, cacti, ruins, etc.). Added festoon lights, pennant rope
  fences, chain-link fences with signs, and a wheelbarrow, bowser and survey grid.
- FX: a real brazier fire with embers and smoke, drifting sand, moths
  around the work lamps, swaying palms and flags, and a sleeping, breathing Dust.
- Characters (all chapters): rounded limbs, faces, boots and better headwear.
  Same rig and animations as before.
- Labels: restyled as small gold-trimmed tags. In Ch1 they only show up close.
- Physical things (trench, generator, carts, stela…) no longer vanish once
  their story beat is done. Only the label and the interaction go away.

## V3.1.1 — 2026-08-03
- WebGL startup now retries with lighter settings (no antialias, etc.)
  before giving up, so weaker GPUs/browsers can still run the 3D build.

## V3.1.0 — 2026-08-03
- Added a shared `GAME_VERSION`, shown on both the 3D and 2D title screens.
- Boot guard: if startup fails, the game explains why instead of showing
  a silent black screen.
- Main menu overhauled into a cinematic title screen.
- Menu "Site Overview" drone viewer; fixed tent roof; dig-gate label repaint.

---

## Before versioning (history summary)

### 2026-06-11 — 3D playable + Ch1 polish
- 3D build became the default (`index.html`); 2D moved to `index2d.html`.
- Character figures for NPCs/hostiles, jumping, chasm pits.
- Save/load (localStorage, single slot, both builds).
- Stamina rebalance; sanity overhaul (4 tiers, world-space hallucinations).
- New pause menu; restyled amber-glass dialogue UI.
- Ch1 art pass: dig-camp props, heightfield dunes, escarpment climb,
  ambient scatter, fun interactions, Tunnel Gate Seal minigame.
- Terrain-aware footstep audio; Camp Darts minigame.
- Fixes: Ch2 pressure-plate hint, dig-shed clipboard, Ch1 visuals.

### 2026-06-10 — 3D conversion begins + story expansion
- Vendored Three.js; built 3D engine scaffold, graybox generator,
  first-person controller, hostiles, atmosphere, lighting pass.
- Expanded all maps for first-person scale; per-area skies; menu overhaul.
- Story: added Father Matthias, Inspector Kareem, Kostas Lemaire,
  Lei Mansour, deep lore, 2 endings; rewired orphaned scenes.

### 2026-04 / 2026-05 — 2D game
- Ch1 pixel visual overhaul and many bug-fix passes (NPC spawning,
  ministry car, gates, sanity balance, dialogue clarity).
- Title screen tweaks.
