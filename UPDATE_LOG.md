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
