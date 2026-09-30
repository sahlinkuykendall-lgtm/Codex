# The Codex of Giza — Poke-Style Build (branch `poke-style`)

A 2D remake of Chapter 1 in the style of the DS Pokémon games (HeartGold / SoulSilver).
It uses 32×32 pixel tiles and the three-quarter top-down view. Movement is free, in any
direction, pixel by pixel, not stuck to the grid. Every piece of art is drawn in code;
there are no image files.

**To play:** open `poke.html` in a browser (a double-click works; no server needed).

| Key | Does |
|---|---|
| WASD / arrows | Walk (8 directions, free movement) |
| SHIFT | Run (or turn on "Always run" in Settings) |
| SPACE / ENTER / Z | Look at what you're facing, talk, next page |
| ESC / M | The menu (Map, Journal, Bag, Settings, Save, Title) · back |
| Walk up into a door | Go inside (Miriam's tent, the dormitory, the site office) |

## What's in it

- **The same map as the 3D Chapter 1.** `tools/export_poke_map.js` boots the 3D build and
  exports every object, wall, road, the rail line, the named places and a terrain grid to
  `poke/map_ch1.js`, at 64 world units per tile. What each thing says when you look at it
  comes from the 3D story too.
- **Changed to suit this style (the layout pass):**
  - The outside of the map is a raised rock plateau with cliff faces, where the 3D build
    has an invisible dune wall. This is the Pokémon border.
  - The three buildings you can enter are drawn shallower than their 3D footprints, as DS
    buildings are.
  - The dig-zone gate stands open, since the story logic isn't wired in yet.
  - The fence, which the 3D data lists twice, is drawn once.
  - Three workmen stand by the fire and walk around a little.
- **The opening** (from the story bible): Alexandria in 391 AD with the Serapeum burning,
  Petamun's seven Houses on a map of Egypt, Miriam finding the Codex in the Osiris Shaft,
  and the black car four nights ago. Then the Ministry letter. ESC skips it.
- **Character creation, Pokémon-style.** On your permit you choose male or female, then
  build your look in 11 categories with 10–13 options each, many Egyptian-themed:
  - skin (10)
  - hair (13, including the sidelock of youth and a Cleopatra cut)
  - hair colour (11)
  - headwear (13: field hat, pith helmet, straw hat, turban, keffiyeh, headscarf, skullcap,
    fez, cap, bandana, nemes, gold circlet)
  - face (11, including kohl eyes)
  - top (11, including galabeyas, a kaftan and a pleated kalasiris)
  - top colour (12)
  - bottoms (10, including a shendyt kilt)
  - bottoms colour (12)
  - shoes (10)
  - accessory (12: ankh, scarab, Eye of Horus, broad collar…)

  "Surprise me" picks at random. Then you pick your name on a DS-style letter grid, or just
  type it, and check the finished permit.
- **Day and night:** dawn, day, dusk and night tints, or a moving clock (a day in twelve
  minutes). Lamps, the fire and the old woman's lamp light up after dark; she only appears
  at night.
- **Interiors:** Miriam's tent, the dormitory and the site office, furnished, with
  everything examinable.
- **Menus:** a pause menu with your permit card, a map (places you've found), a journal
  (everything you've looked at), a bag (collect the painted sherds and fossils), settings,
  and save/continue.

## Files (load order, see `poke.html`)

| File | What it does |
|---|---|
| `map_ch1.js` | The exported Chapter 1 map (generated; don't edit) |
| `art.js` | Palette, pixel drawing helpers, outline pass, the ground painter (256-px chunks, on demand) |
| `text.js` | Crisp pixel text, DS window frames, place plaques, sound blips, the Egyptian frieze, menu icons |
| `sprites.js` | Every building, tent, vehicle, prop, plant, animal, fence and rock wall |
| `people.js` | Characters built from parts; the creator's options; the cast |
| `world.js` | Builds the outdoor map: entities, collision, trees, scattered plants, doors |
| `interiors.js` | The three rooms and their furniture |
| `ui.js` | Text box, place banner, title screen, pause menu |
| `intro.js` | The opening scenes, male/female, the character creator, the name grid, the permit |
| `game.js` | The loop: input, movement and collision, camera, drawing, day/night, doors, saving |

To re-export the map after changing the 3D layout, run
`node tools/export_poke_map.js` (it needs Playwright and Chrome, like the other tools).

## Not in it yet

- The story's choices and flags. You can look at everything, but conversations are the
  opening line of each scene, not the branching dialogue.
- The minigames (sieve, tea, darts), the supply train moving, and the midnight event.
- Other chapters.
