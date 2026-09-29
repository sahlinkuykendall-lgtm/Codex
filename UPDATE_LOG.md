# UPDATE LOG — THE CODEX OF GIZA

What changed in each update, newest first. The version number matches
`GAME_VERSION` in `data.js` (shown on both title screens).

**Rule:** every game-changing update bumps `GAME_VERSION` and adds an entry
here *in the same commit*.

Other docs:
- `MASTER_LORE_BIBLE.md` — the story / world lore (source of truth).
- `NEW_CHARACTERS.md` — voice + agenda for the expansion NPCs.
- `3D_CONVERSION_NOTES.md` — what the 3D branch is, how it's built, quirks.

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
