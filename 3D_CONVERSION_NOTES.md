# 3D CONVERSION — BRANCH NOTES

**Branch:** `3d-conversion` · **Status:** V4.0.0: new story, with Chapter 1-A (the Archaeologist opening) rebuilt on the art-directed camp. Walkable full-game graybox + a fully art-directed Chapter 1 camp (V3.2–3.4: visuals, in-world minigames, title screen, settings, ambience)

## Entry points (renamed)

- `index.html` is now the **3D build** (the default way to play).
- `index2d.html` is the original 2D build, unchanged.

## Script layout (V3.4)

`index.html` loads, in order: `three.min.js`, `data.js`, `dialogue.js`,
`engine.js` (shared with 2D), `settings.js`, `ambience.js`, `ch1_layout.js`,
`ch1_world.js`, `ch1_props.js`, `ch1_minigames.js`, `ch1_openworld.js`,
`cine3d.js`, `engine3d.js`, `title3d.js`, plus `ui3d.css`. See `UPDATE_LOG.md` for what changed in each version.

- `ch1_world.js`: Chapter 1 terrain (`ch1Height`, trench cut, site berm,
  escarpment), materials/textures, the rock and cliff generators, the shader
  sky, moon, pyramids and city lights, the moonlight shadow rig, instanced
  scatter, and FX (fire/embers/smoke, dust, moths, sway), updated by
  `updateCh1FX()`.
- `ch1_props.js`: every Ch1 building/prop builder (`CH1_BUILDERS` by id,
  `CH1_LABEL_BUILDERS` by label), wall styling (`ch1BuildWall`, fences,
  gate, outcrops) and extra dressing. Builders may set `userData.keep` so
  a physical thing stays visible after its story beat resolves.
- `ch1_minigames.js`: the Tunnel Gate Seal and Camp Darts played in 3D.
  It reuses engine.js's PUZZLES rules (`handlePuzzleClick`, `dartsScoreAt`).
  The 2D build keeps the 2D cards.
- `settings.js`: stored options and the settings screen. `ambience.js`:
  the synthesized Ch1 soundscape. `title3d.js`: the splash, menu, prologue
  and the cinematic menu camera.
- `ch1_layout.js`: the open-world Ch1 map (3D only). It rewrites mapWalls[1] /
  mapObjects[1] in place (moves each area by an offset, tags walls with `kind`,
  adds the dune boundary blocks), defines the tracks, spawn, car route and
  patrols, and wraps startGame/loadGame/saveGame for the new size.
- `ch1_openworld.js`: side places, sherds, detector caches, compass,
  place-name toasts; tea and sieve minigames live in ch1_minigames.js.
- `cine3d.js`: conversation camera shots, letterbox, typewriter text.
- `backpack.js`: size-based backpack, inventory UI, held tools (detector, field
  glasses), canteen/dates; the Ch3 tea vendor sells a 16-unit rucksack.
- `tips3d.js`: timed first-steps tips on a new game (hold X to disable).
- `ch1_supply.js`: the animated supply-line train and worker (visual only).
- `ch1_interiors.js`: art-directed tent / dorm / foreman office interiors.
- **Load order (V4.1.0)** after `title3d.js`: `story_core.js`, then `story_systems.js`
  (skills/XP, thirst and hunger, injury and knock-out, the phone on P), `ch1a_story.js`,
  `ch1_dog.js`, `ch1a_extras.js` (systems wired into Ch1: XP, needs, failures, phone
  messages and calls, Miriam's phone, the mason's marks, Hagg Sayed's race, the 1926
  relics), `ch1a_places.js` (the workers' cemetery, sheikh's tomb, watchtower, builders'
  ramp, old quarry, fossil pavement), then the model loader.
- **Day and night:** `ch1DayState()` / `ch1ApplyDay()` in `ch1_world.js` drive the sky
  shader's `uDay` / `uSunDir`, the hemi and sun lights, fog, lamps and exposure from the
  story clock. The clock is capped at 04:40 until `ch1_complete`, then runs free.
  - V4.1.4 lighting pass:
    - The shadow light is the sun whenever `D.alt > 0.02`, and the moon otherwise.
    - The sun runs amber (0xff9a50) when low. The day hemisphere light is lower (0.38 + 0.42k)
      and the day sun higher.
    - Moonlight is 0.34 at 0x86a0d8, and exposure is `0.95 * b * (1 - 0.17k)`.
- **Narration (V4.1.6):** `narration.js` loads last. It uses the Web Speech API.
  - It wraps `startDialogue` and reads the whole line from `CINE.type.full`, because the
    typewriter empties the box. It reads the speaker with `textContent`, because `innerText`
    comes back in CSS capitals.
  - It splits the text on `"`: quotes go to the speaker's voice, and the rest to the narrator.
  - `NARR_CAST` lists the characters: speaker names, gender, default pitch and rate, and a test
    line. A new speaker in a later chapter needs adding there, or it falls to "other men/women".
  - Player choices are saved in settings as `voiceCast[id] = {voice, pitch}`. The VOICES tab is
    added to `SETTINGS_TABS` and drawn by a `renderSettings` wrapper.
  - Chrome's online voices stop after about 15 s, so lines are queued in chunks of about
    180 characters.
- **Photographed textures:**
  - `tools/pack_texture.js <name> <folder>` writes `textures/<name>.js` (`window.CODEX_TEX`,
    data URIs; file:// can't feed image files to WebGL). `ch1PhotoSet(name, repeat)` turns
    it into textures.
  - The Ch1 ground uses `sand` (Ground089) at repeat 3.25 per 260-unit UV, which is about
    80 units per tile.
  - `sandGain` pulls its average colour toward the drawn sand's (#b89c74), so vertex
    colours and the lighting stay tuned.
  - `textures/sand.js` loads just before `ch1_world.js`.
- `ch1_dog.js` (loads after `ch1a_story.js`): Bosta the camp dog. It has a rigged model
  (poses: stand, sit, lie, sleep, roll; a trot gait), a behaviour loop (sleep, wander, idle,
  home, or follow the player's breadcrumb trail), synthesized bark, growl and whimper, and
  her dialogue. Her interaction box and label move with her every frame.
- **Downloaded 3D models.**
  - `tools/convert_models.js` (Node + Playwright) converts .fbx/.glb/.gltf into a compact
    .glb. It merges in Mixamo animations (`--anim walk=Walking.fbx`), `--inplace` strips
    root motion, and `--tex` caps texture size. It writes `models/<name>.js`, the .glb as
    base64, which loads from file:// and from GitHub Pages. Run it with
    `NODE_PATH=<dir with playwright>`.
  - `models3d.js`: `modelSpawn(name, {height, clip})` gives an independent, skinned,
    animated copy scaled to world units; `.play(clip)` crossfades. It uses
    `lib/GLTFLoader.js` and `lib/SkeletonUtils.js` (three r147 examples/js).
  - Source files go in `avatars/`. The web uploader caps files at 25 MB, but the converter
    reads them from anywhere.
  - **Art direction (chosen V4.0.7): realistic.** Characters are realistic, rigged in Mixamo and animated with Mixamo animations (download them "Without Skin"; they share one skeleton, so each animation works on every Mixamo-rigged character). `models/remy.js` (Remy, with walk and dodge) is packed and ready but not loaded yet.
  - **Props from the library (V4.1.2):** `ch1a_finds.js` and then `ch1a_models.js` load
    after `models3d.js` and their `models/<name>.js` packs. `ch1a_models.js` holds the
    dartboard, radios, Codex viewer, mess tent, Hana's tent, Miriam's kitchen, the tool rack
    and the trench kit.
    - Its helpers are `c1mBox` (a model's box in its group's space) and `c1mCentre`
      (centre it and seat it on the ground).
    - The builders run before the models parse, so always measure a model in its group's
      space, never in world space.
    - Packs with no textures get a material per mesh name (see `KIT` for the camp kitchen).
    - `ch1a_crates.js` (V4.1.3) loads after `ch1a_models.js`. It reassigns `subCrate`, `subDrum`
      and the 'crates' / 'sorted crates' label builders, so every crate and drum picks a model by
      a steady hash of its spot (`c1cPick`). Singles still fill exactly s × 0.8s × s, because
      callers stack things on them.
    - Prepare models with `tools/prepare_model.js`. It takes `--keep`, `--keepmat`, `--drop`,
      `--tris`, `--tex` and `--error`.
  - The first realistic-character pass may push the download size up. Plan to wrap the game as a Windows .exe with Electron (GitHub Releases for hosting) when it gets heavy.
- The supply line runs one forward-only route: in from the desert, round the balloon loop
  (`CH1_RAIL_LOOP` in `ch1_layout.js`), and back out. So the loco always leads.
- **The new story (V4.0.0+).** `story_core.js` and `ch1a_story.js` load LAST (after
  `title3d.js`), with `story.css`. The story bible in `story/` is the source of truth.
  - `story_core.js`: `gameState.story` holds the player (name, gender, pronouns, background),
    `rel`/`rep`/`heat`, story flags (`sflag`), the story clock (`clockAdvance`, `onClockPassed`),
    choice notices, and the New Game character-creation screen (it wraps `titleBeginIntro`).
    The HUD shows Time instead of Sanity.
  - `ch1a_story.js`: the Archaeologist opening. It relabels and re-scenes the built Ch1
    objects by id, adds the new people (`PERSON_OBJECTS`), hides retired objects
    (`c1aHidden`), and holds every scene, the midnight car, the exit choice, the chapter-end
    card and the J notes panel. It sets `builtSignature = null`, because the title screen
    builds the camp before this file loads.
  - A renamed object keeps its model through `modelLabel` (`ch1LabelBuilder` reads it first).
  - Saves use the key `codexOfGiza_save_v2`, so old-story saves are ignored.
  - The old Ch1 scenes in `dialogue.js` and chapters 2–7 are still in the code, but the new
    game never reaches them. They get replaced chapter by chapter.
- Ch1 is tone-mapped (ACES) and shadowed; other maps still use the old
  untone-mapped graybox path. `buildWorld()` branches on `isCh1`.

## Character figures (step 7)

- NPCs and hostiles are procedural humanoids (`makeHumanoid` in
  engine3d.js) built from primitives — no external assets, still no
  build step. Shared rig: hip/shoulder pivots for walk/idle swings.
- Looks are grounded in the lore docs: Tariq's head wrap, Samir/Yusra/
  Layla robed, Lei at 14-year-old scale, Kostas gaunt with the faint
  underground glow, Halberd in a charcoal suit with a shirt front, the
  dark figure black with faint amber eye-pinpricks, the Ch2 SECRET
  statue an elongated stone Uarha Custodian in the set-down posture
  (bowed head, hands met). `PERSON_OBJECTS` maps object ids → styles;
  the Ch5 hangar standoff renders one figure per faction.
- NPCs breathe and turn to watch Ellis when he comes near (the
  Custodian never turns — its cone of attention is fixed). Hostiles
  walk with limb swing, face their movement direction, and their
  clothes flush red while chasing (same pulse rhythm as 2D).

## Save / load (step 8)

- Single-slot save in `localStorage` (`codexOfGiza_save_v1`), engine.js
  so both builds get it. The blob: full `gameState` (flags, stats,
  inventory, trust, route, journal, rest cooldowns), player position,
  map key + world size, interior state, ministry car. Transient UI
  state (dialogue, pause, fades) is stripped on write, so loading is
  always a clean resume standing in the world.
- **Autosave** on every dialogue close (story progress = flags set),
  chapter load, and interior enter/exit. **Manual save** from the pause
  menu ("Save Game", with "Saved." feedback); Return to Menu and Quit
  save first.
- **Load:** the 3D menu shows a CONTINUE button when a save exists; the
  2D start screen accepts C ("press C to continue"). Loading restores
  the map context directly — chapter intro dialogue does not re-fire —
  and respawns patrols via `spawnHostilesForLocation()` (the hostile
  spawns were factored out of the chapter loaders for this; exiting an
  interior now respawns patrols in every chapter, not just Ch1).
- Old saves stay forward-compatible: flags merge into the current flag
  table, so flags added later keep their defaults.

## Chapter 1 art pass (step 8 vertical slice)

- The Ch1 camp is fully de-grayboxed using canvas-generated textures
  and primitive geometry (still asset-free): sand ground with wind
  ripples, ridge tent with poles/guy ropes, dorm + foreman cabins with
  lit windows, the tunnel mouth as a timber-framed opening in a jagged
  rock face, glyph stela, mine carts on rails, animated brazier flame,
  trucks/trailer/scaffolding/palms/cacti/ruins/drums/lamps and more
  (~40 builders in `CH1_BUILDERS` / `CH1_LABEL_BUILDERS`).
- Ch1 walls restyle by role: camp fences → post-and-rail, compound
  rope line → posts + rope, trench → walk planks + spoil berms, dig
  shed built from its collision rect, building shells hidden inside
  their cabin props, rocky outcrops rock-textured with jagged crowns.
  Collision is untouched — visuals only.
- Ambient scatter (`addCh1Scatter`): ~80 deterministic pebbles, sand
  humps, dry grass tufts and pottery shards on open ground.
- Three zero-stakes fun interactions (in both builds, via data.js +
  dialogue.js): **Dust the camp dog** (pet him), a **dartboard** by
  the dorm, and a **shortwave radio** that catches three seconds of
  Umm Kulthum. Tiny one-time sanity touches, no flags that matter.
- **Terrain:** `ch1Height(x,z)` — layered sine dunes flattened near
  every structure (camps level their ground) with a 30-unit climb to
  the north escarpment. The ground is a displaced 96×88 plane; the
  camera, props, NPCs, hostiles, fences, lights, car, scatter and
  hallucinations all sample the same function. Collision stays 2D.
- The glyph lock is now the **Tunnel Gate Seal** minigame (circular
  seal, resonance timer, wrong press = dart + the stones reshuffle —
  Sam's animal order owl/eye/serpent/lion is the durable key).
- Dialogue UI (3D build): amber glass panel, floating speaker chip,
  animated text/choice entrances, keycap interaction prompt.
- Pattern for the Ch2+ art passes: builders keyed by object id/label,
  per-map gate on `currentMapKey`, textures via `makeTex` cache.

## Sanity system (overhauled)

- Four tiers: CALM ≥7.5, UNEASY 5–7.5 (subtle), STRAINED 2.5–5,
  FRACTURED <2.5 (the genuinely bad place). Dialogue only ever writes
  sanity, so retiering is story-safe.
- Decline softened: 0.65× global damage scale; slow ambient recovery
  (≈1 point/17s) up to 6.0 when nothing is chasing. Rest and story
  beats still restore CALM.
- 3D effects ramp continuously (eased ~1s): desaturation/contrast
  filter, fog squeeze, slow camera sway. FRACTURED adds the heartbeat
  (FOV pump + red vignette pulse) and a fine tremor.
- 2D dot phantoms are gone in 3D — replaced by world-space dark-figure
  hallucinations in the middle distance that dissolve when stared at,
  on E (clarity), or after a few seconds.

## Pause menu (overhauled) & stamina tuning

- The pause menu is data-driven: `drawPauseMenu` registers each
  button's rect in `pauseButtons` and the pointerdown handler
  hit-tests the same rects — layout and click targets can't drift.
  Hover and the arrow-key cursor (↑/↓ + ENTER) share one highlight;
  SPACE resumes; ESC backs out of the chapter-select sub-menu before
  unpausing. Subtitle shows where you are (chapter title or interior
  label); footer shows when the game last saved. The DOM HUD boxes
  hide while paused (`#game-container.is-paused` CSS). Trust panel now
  lists Yusra and Iry.
- Stamina tuning lives in one `STAMINA` table in data.js, shared by
  both engine loops: pool 20 (was 10), drain 0.025/frame (~13s of
  sprint), regen 0.02/frame (~17s refill; tea/karkadeh faster).
  loadGame migrates older saves to the new pool.

## Jump (step 7)

- SPACE jumps when no interactable is in range; near an interactable
  SPACE still interacts (the two handlers are mutually exclusive on
  `gameState.activeInteractableId`). Costs 0.4 stamina; blocked while
  exhausted. Peak ~1.5m, ~0.5s airtime; the carried lantern rises with
  the camera. The jump is vertical only — wall collision stays
  identical to the 2D build, so nothing can be sequence-broken.

## Map expansion & layout changes (affects 2D build too)

- All maps scale up via `MAP_SCALE` in data.js (Ch1 1.6x … final chamber
  2.5x). Uniform scaling keeps walls/objects/door-gaps aligned; engine
  spawn/patrol/world-size literals were updated to match. Walk speed and
  hostile speeds/ranges retuned so pacing feels the same.
- **Bug fix:** Ch4's inner sanctum (The Heart) was walled off and
  unreachable — the great hall's north wall now has a doorway.
- **Bug fix:** building exits used stale hardcoded coordinates; you now
  exit where you entered.
- New story-grounded light props: Ch1 work lamps, market lanterns, city
  amber channels + sanctum braziers, Gate colonnade + braziers, airfield
  floodlights, final-chamber braziers.

## Main menu & backdrops

- The 3D build's menu is a DOM overlay (title / Begin / Controls) over a
  live orbiting vista of the night camp. Space or Enter also starts.
- Exteriors have gradient sky domes, a moon, and horizon silhouettes:
  Giza pyramids (Ch1), Old Cairo skyline + minarets (market), control
  tower (airfield). Underground darkness is tinted per area.

## Story audit (full cross-reference, see commit aede628)

- All 396 dialogue scenes checked: no missing references, all puzzles
  fire their reward scenes, chapter chain Ch1→Ch7 fully wired, all six
  implemented endings reachable.
- 5 orphaned finished scenes were wired into maps (water barrels, TRAP
  false door, CUTTHROAT blood/radio, market coffeehouse).
- **Content gaps closed (commit 096dd06):** Father Matthias + the Order
  archive (Ch3), Inspector Nadia Kareem (Ch3 + Indictment echo), Iry's
  other-Hearts/dimming/chant branches (Ch4), and the Severance and
  Departure secret endings (Ch7, 8 endings total). Deep lore now in
  game: Tibesti/Nazca/Aksum, Zep Tepi, the Perennial Concern, the
  dimming, the Fayyum Papyrus.
- **Kostas Lemaire added (commit cf9af07):** Ch4 discovery + three-
  outcome rescue side quest, the second Heart-node secret, Ch5 standoff
  presence, Ch7 Departure echoes.
- **Lei Mansour added (commit 15f24b5):** Ch3 services + Khaled thread
  + surveillance ripple + exercise-book secret, Ch5 fence note, Ch7
  letter echoes.
- **Still absent from the lore docs:** the minor NPCs (Omar el-Dib
  tea-vendor expansion, Sayeda Mariam's chant thread, Ngozi's Ch7
  letters, Layla Hassan, an on-screen Khaled) and the second Heart-node
  area (awaits the undelivered SIDE_MAPS.md / CH3_EXPANSION.md /
  CH5_EXPANSION.md). ~44 superseded draft scenes remain (harmless).

## Atmosphere (engine3d.js, `MAP_ATMOS`)

- Underground chapters get rock ceilings, tunnel-height walls, dense fog;
  exteriors get moon + hemisphere + star field; interiors a warm ceiling lamp.
- Light props become real point lights (≤14/map, flame flicker on warm
  ones); amber objects glow emissively; Ellis carries a lantern
  underground/indoors.
- The Heart: Ch7 cathedral-dome sphere pulsing on the Codex's 8-second
  rhythm above the pedestal; Ch4 sanctum orb breathes slowly.
- Fog closes in as sanity drops (CALM → STRAINED → FRACTURED).

## How to run

- **3D build:** open `index.html` in a browser. No server or build step needed.
- **2D build:** open `index2d.html` — completely unchanged, still works.

## Controls (3D)

| Input | Action |
|---|---|
| Click the world | Capture mouse for free look (released automatically when any menu/dialogue opens) |
| W / S | Forward / back (camera-relative) |
| A / D | Strafe |
| ← / → | Turn (mouse-free fallback) |
| SHIFT | Sprint (same stamina rules as 2D) |
| SPACE | Interact when a prompt is shown; otherwise Jump |
| E | Focus / clear phantoms |
| TAB | Toggle stats |
| ESC | Pause (may need two presses while mouse is captured — the first exits mouse look, a browser rule) |

## Architecture

`index3d.html` loads `data.js`, `dialogue.js`, and `engine.js` **unchanged**
(two `window.RENDER_MODE_3D` guards keep the 2D render loop off), then
`engine3d.js` drives its own loop:

- **All story/game logic is reused, not ported**: dialogue trees, flags,
  trust/sanity/stamina, chapter loaders, interiors, rest sites, puzzles,
  hostile AI, phantoms. `player.x/y` stays the source of truth; the 3D
  camera just lives at eye height above it.
- **Graybox generation**: `mapWalls` rectangles are extruded into boxes
  (gates hide when their flag sets, exactly like 2D collision), and
  `mapObjects` become labeled boxes. Every chapter, route, and interior
  gray-boxes automatically from the same data tables.
- **The 2D canvas is kept as a transparent overlay** on top of the WebGL
  canvas. The start screen, pause menu (incl. dev chapter jump), puzzle
  mini-games, interior fades, vignette, dust, and phantom hallucinations
  all render there using the existing engine.js functions, with the
  existing click handlers — zero duplicated UI code.

## Verified

Headless-browser smoke test (Playwright): boot → start menu → opening
dialogue chain → movement with wall collision → interaction prompt →
hostiles spawned → pause menu, with zero console errors.

## Known graybox quirks (intentional, polish later)

- The dig-gate label stays "LOCKED" in 3D (labels are static textures);
  the gate itself opens correctly.
- Ministry car is a two-box stand-in. Character figures are stylized
  primitive humanoids (no faces except the dark figure's eyes); fine
  for graybox, replaceable later without touching the rig hooks.
- Layouts were authored top-down; some spaces will feel sparse at eye
  level and want re-spacing during the art pass.

## Next steps (per the approved plan)

1. Asset replacement chapter by chapter (Ch1 camp first); shader
   silhouette for Iry if she ever gets an on-map presence
