# 3D CONVERSION — BRANCH NOTES

**Branch:** `3d-conversion` · **Status:** walkable full-game graybox with lighting/atmosphere pass + character figures + jump + save/load

## Entry points (renamed)

- `index.html` is now the **3D build** (the default way to play).
- `index2d.html` is the original 2D build, unchanged.

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
