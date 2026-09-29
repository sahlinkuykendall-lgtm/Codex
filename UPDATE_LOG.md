# UPDATE LOG — THE CODEX OF GIZA

What changed in each update, newest first. The version number matches
`GAME_VERSION` in `data.js` (shown on both title screens).

**Rule:** every game-changing update bumps `GAME_VERSION` and adds an entry
here *in the same commit*.

Other docs:
- `story/` — **the story bible** (source of truth). Start at `story/00_MASTER_BIBLE.md`.
- `3D_CONVERSION_NOTES.md` — what the 3D branch is, how it's built, quirks.

---

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
