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
| M | The map: your area; M again zooms out to all of Egypt |
| ESC | The menu (Map, Journal, Bag, Settings, Save, Title) · back |
| Walk up into a door | Go inside (Miriam's tent, the dormitory, the site office) |

## What's in it

- **A fresh camp, laid out like a DS town** (`poke/camp.js`): a 78×58 tile map, compact,
  with straight roads between the areas, and a yard of trodden sand for each camp. It has been
  audited so that nothing stands on a road, nothing overlaps and everything can be reached. The director's camp is in the middle, the workers' camp
  to the west, the dig zone under the escarpment to the north (the Osiris Shaft and the sealed
  door are cut into its cliff), trench A to the east, the guard post on the road in, the oasis,
  the supply line, the cemetery, the sheikh's tomb and more. It has a rock plateau all round.
  Every person and thing from the 3D chapter is here, and what each says comes from the 3D
  story (`tools/export_poke_map.js` → `poke/map_ch1.js`, looked up by id).
- **The look:** crisp and solid, with flat colours and hard edges. Things look 3D because the
  light is consistent: lit tops, shaded sides, a contact shadow under each thing. Buildings,
  vehicles and props (crates, barrels, the generator, the well, the wheelbarrow) each have
  their own character.
- **The M map:** your area with the places you've found; M again zooms out to Egypt, with
  every chapter region from the bible, locked until the story takes you there, each with a teaser.
- **The opening** (from the story bible): Alexandria in 391 AD with the Serapeum burning,
  Petamun's seven Houses on a map of Egypt, Miriam finding the Codex in the Osiris Shaft,
  and the black car four nights ago. ESC skips it.
- **Four backgrounds** (`poke/backgrounds.js`, from `story/01_CHARACTERS.md`): the
  Archaeologist (Giza), the Inspector (Saqqara), the Fixer (Marsa Tarfa, Egyptian or
  foreign) and the Journalist (Port Said). Each has its own skills, gear, papers and
  opening cutscenes, and an "only you" strength. Only the Archaeologist's opening is
  playable yet; the others play their cutscenes and then return you to the choice.
- **Character creation, Pokémon-style.** On your papers you choose male or female, then
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
  type it, and check your finished papers (a permit, an inspector's ID, a harbour pass or a
  press card, by background).
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
| `map_ch1.js` | What everything says, and the interiors, exported from the 3D build (generated; don't edit) |
| `camp.js` | The camp's tile layout (where everything goes) and the crisp tile ground |
| `art.js` | Palette, pixel drawing helpers, colour mixing, the outline pass |
| `text.js` | Crisp pixel text, DS window frames, place plaques, sound blips, the Egyptian frieze, menu icons |
| `sprites.js` | Every building, tent, vehicle, prop, plant, animal, fence and rock wall |
| `people.js` | Characters built from parts; the creator's options; the cast |
| `world.js` | Builds the camp from the layout: entities, collision, trees, plants, doors |
| `worldmap.js` | The M map: the area, and Egypt with the chapter regions |
| `interiors.js` | The three rooms and their furniture |
| `ui.js` | Text box, place banner, title screen, pause menu |
| `backgrounds.js` | The four backgrounds: skills, gear, papers, their paintings and opening cutscenes |
| `intro.js` | The opening scenes, the background choice, male/female, the character creator, the name grid, your papers |
| `game.js` | The loop: input, movement and collision, camera, drawing, day/night, doors, saving |

To re-export the map after changing the 3D layout, run
`node tools/export_poke_map.js` (it needs Playwright and Chrome, like the other tools).

## Not in it yet

- The story's choices and flags. You can look at everything, but conversations are the
  opening line of each scene, not the branching dialogue.
- The minigames (sieve, tea, darts), the supply train moving, and the midnight event.
- The Inspector's, Fixer's and Journalist's starting areas (their cutscenes are in).
- Other chapters.
