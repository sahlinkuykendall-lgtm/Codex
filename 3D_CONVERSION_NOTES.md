# 3D CONVERSION — BRANCH NOTES

**Branch:** `3d-conversion` · **Status:** walkable full-game graybox with lighting/atmosphere pass

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
- **Still absent from the lore docs:** Kostas Lemaire (Ch4 trapped
  scholar — a full side-quest's worth of content) and any minor NPCs
  beyond him in NEW_CHARACTERS.md. ~44 superseded draft scenes remain
  in dialogue.js (harmless).

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

- **3D build:** open `index3d.html` in a browser. No server or build step needed.
- **2D build:** open `index.html` — completely unchanged, still works.

## Controls (3D)

| Input | Action |
|---|---|
| Click the world | Capture mouse for free look (released automatically when any menu/dialogue opens) |
| W / S | Forward / back (camera-relative) |
| A / D | Strafe |
| ← / → | Turn (mouse-free fallback) |
| SHIFT | Sprint (same stamina rules as 2D) |
| SPACE | Interact |
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
- Hostiles/NPCs are colored boxes; ministry car is a two-box stand-in.
- Layouts were authored top-down; some spaces will feel sparse at eye
  level and want re-spacing during the art pass.

## Next steps (per the approved plan)

1. Lighting/atmosphere pass per chapter (lantern point lights, fog tuning)
2. Mixamo characters for NPCs, shader silhouette for Iry
3. Asset replacement chapter by chapter (Ch1 camp first)
4. Save/load (`gameState` → localStorage)
