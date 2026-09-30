# ASSETS — DOWNLOADED MODELS: WHERE THEY GO, AND WHAT TO FIND NEXT

Style: **realistic** (Mixamo for characters and animations; photo/scan-based props).
Tools:
- `tools/preview_models.js` renders thumbnails and stats.
- `tools/prepare_model.js` picks one piece from a pack, cuts it down to a triangle budget
  (keeping its textures), shrinks textures, and packs it for the game.
- `tools/convert_models.js` handles FBX, and merges Mixamo animations.

Preview sheets are in `models/previews/`.

**Budgets when a model goes into the game:**

| Kind | Triangles | Textures |
|---|---|---|
| Small prop or find | 2–10k | 512–1024 px |
| Furniture or statue | 10–25k | 1024 px |
| Building or big set piece | 30–80k | 1024–2048 px |
| Character | 20–40k | Rigged in Mixamo |

---

## PART A — YOUR LIBRARY (`models/`) AND WHERE EACH PIECE BELONGS

| Model | What it is | Tris (as downloaded) | Goes in | Notes |
|---|---|---|---|---|
| ancient_egypt_pack | 7 museum statues (Khafre, Khonsu, Ramesses II ×2, Ramesses III with a god, Steward Au, Cleopatra) plus name labels | 449k | **Steward Au: Ch1, Hana's table (DONE, V4.1.1).** Khafre: Ch2 Egyptian Museum (his statue came from Giza). Ramesses II: Ch4 Tanis (fallen colossi), Ch9 Luxor. Cleopatra: Ch3 Alexandria. Khonsu: Ch9 Karnak (his temple is there) | Use `--keep <Name>` for each piece (see `models/previews/ancient_egypt_pack_pieces.png`) |
| cat_egypt | Bastet cat statue | 90k | Ch2 Egyptian Museum; Ch4 Delta (Bubastis, the cat goddess's city) | Reduce to about 10k |
| coffins_of_pa-di-mut… | Three painted coffins (museum scan) | 352k | Ch2 Egyptian Museum; Ch9 Luxor (a tomb cache) | Reduce to about 25k, and drop its "Take 001" anim |
| egypt_chamber_for_ar__vr_games | A whole tomb/temple chamber | 55k (45 textures) | House interiors: Ch3 Serapeum galleries, or Ch5 Labyrinth courts | Huge scale units. Check collision |
| egypt_column / egyptian_column / egyptian_pillar_v1 | Columns (papyrus, lotus, painted) | 1–20k | Ch9 Karnak hypostyle; Ch11 Philae; House interiors | egyptian_column is untextured, so needs a stone texture |
| egypt_obelisk / egyptian_obelisk | Obelisks (one carved, one dark) | tiny | Ch4 Tanis (fallen obelisks); Ch9 Karnak | Very low poly, fine |
| egyptian_door | Painted shrine door with a god figure | 50k | A House doorway (Ch8 Hermopolis, or Ch14 the seven-key door) | Reduce to about 10k |
| egyptian_eye_puzzle_version_02 | Eye-of-Horus puzzle pieces | 21k | A House puzzle (Ch3 or Ch5) | — |
| golden_cross_egyptian_puzzle | Ankh puzzle pieces | 20k | A House puzzle (Ch8) | — |
| egyptian_golden_wine_cup | A golden cup | 27k | Treasure: Ch7 Alexander's tomb, Ch9 House 5 | Reduce to about 5k |
| egyptian_khopesh | A sickle sword | 7k | Treasure/weapon display: Ch9 or Ch14 | — |
| egyptian_lyre | A lyre | 9k | Ch14 Lesser Library, or a tomb's grave goods | — |
| egyptian_sandal | A sandal | 4k | **Ch1, Hana's table (DONE)** | — |
| egyptian_papyrus | A papyrus fragment | 193k | **Ch1, Hana's table (DONE, cut to 5k)**; also the scroll look for the Houses | — |
| egyptian_pedestal | A painted offering stand | 3k | House altars; the Book of Thoth's table (Ch9) | Huge scale units |
| egyptian_people | 5 ancient Egyptians (not rigged) | 103k | Opened-track "echoes" (the dead); murals come to life | Needs a Mixamo rig, one figure at a time |
| egyptian_ruins | A small ruined temple | 66k | Ch5 Faiyum (Qasr Qarun); Ch7 Siwa (Umm Ubayda) | — |
| egyptian_ship | An ancient sailing boat, Eye-of-Horus sail | 26k | Ch10 The River (a model boat in a tomb), or the Ch9 Luxor museum | — |
| egyptian_steps | Stone steps | tiny | Tombs and Houses everywhere | — |
| egyptian_table | A carved wooden table (Islamic style) | 73k | Ch2 Cairo café / Gebali house | Reduce to about 10k |
| egyptian_temple | A small temple layout | 38k | Distant set dressing (Ch9 or Ch11) | — |
| egyptian_temple (1)(1) | A sarcophagus under a purple pall | 266k | Ch14 Petamun's resting place, or a House | Draco; reduce to about 20k |
| egyptian_tomb_asset_pack | Modular tomb pieces (untextured) | 5k | Tomb kit for every House | Needs stone textures |
| istanbul_spice_stand… | A spice stall | 317k | Ch2 Khan el-Khalili | Draco; reduce to about 20k |
| nile | Roman statue of the river god Nile | 300k | Ch3 Alexandria, the Serapeum | Reduce to about 25k |
| offering_bearers_tomb_of_maya_saqqara | A real relief wall from Saqqara | 380k | Ch1-B Saqqara (Inspector); the Return ending | Reduce to about 20k (a flat wall, so it holds up well) |
| plow_scene_tomb_egypt | A tomb relief (ploughing) | 500k | Tomb wall panels: Ch8 Tuna el-Gebel (Petosiris's tomb has farming scenes) | Reduce to about 20k |
| statue_of_ramesses_iii | A seated Ramesses III | 1.47M | Ch9 Luxor (Medinet Habu is his temple) | Draco; reduce to about 25k |
| remy | Mixamo character (walk, dodge) | 35k | Stand-in for any modern NPC | — |
| winmau_blade_5_dart_board | Dartboard | 51k | **Ch1 worker camp dartboard (DONE, V4.1.2)** | Sized so the double ring is the game's scoring edge |
| retro_philips_radio | Portable transistor radio | 188k | **Ch1 camp radio and Farouk's radio (DONE, cut to 10k)**; any Cairo café or taxi later | — |
| old_book_game_ready | Leather book with straps | 0.5k | **The Codex (DONE: the 3D view while you unwrap it)**; the journal/inventory later | — |
| large_militery_tent | Army marquee, one side open | 7k | **Ch1 Mess Tent (DONE)**; Ch6 Western Desert army camp | — |
| realistic_tent | Round canvas tent with awning | 40k | **Ch1 Hana's Tent (DONE, cut to 17k)**; Bedouin/Siwa camps | — |
| fishing_camp_assets | Stove, gas bottle, cooler, mugs, folding table, mat (untextured) | 803k | **Ch1 Miriam's Camp Kitchen (DONE, rod dropped, coloured per piece)** | Colours are in `KIT`, `ch1a_models.js` |
| sieve | Ancient perforated pottery bowl (a strainer, not a dig sieve) | 297k | **Ch1 Hana's table (DONE, cut to 18k)** | A dig sieve on trestles is still on the wishlist |
| dirty_shovel, pickaxe, old_pickaxe, farming_hoe, broom, survival_shovel | Dig tools | 0.4–6k | **Ch1 Tool Rack and trench kit (DONE)**; every later dig | — |
| crate_box, wood_crate, crate_pile | Nailed crate, strapped shipping crates, a pile | 0.2–4k | **Every crate in Ch1 (DONE, V4.1.3)**: `subCrate` and the crate stacks pick one per spot | crate_pile needed its old material converted |
| crate (slatted) | Open fruit/vegetable crate | 6k | **Ch1 vegetable crates (DONE)**; Ch2 markets | — |
| dirty_oil_barrel, plastic_blue_drum | Red and black oil drums; blue water drum | 2–6k | **Every drum in Ch1 (DONE)**: `subDrum` picks by colour | The oil pack is split with `--keep red_all_0` / `black_all_0` |
| barrel (wooden) | Wooden barrel | 2k | **Ch1 mess tent water barrel (DONE)**; Ch2 cafés, Ch3 Alexandria cellars | — |
| military_crates | Green army crates, one open | 9k | **Ch1 by the Ministry post (DONE)**; Ch6 army camp, Lena's people | The paint was marked see-through; fixed in the game |
| old_bourbon_barrels | A row of five old barrels | 8k | Later: a Ch2/Ch3 cellar or café | 20 MB. Reduce textures |
| crates (kit) | Tall, wide and small crates, a barrel, planks (untextured) | 7k | Later, with a wood texture | Normal map only |
| garden_tools_pack | Hose, planter, bucket, wheelbarrow, rakes, shovel | 30k | **Wheelbarrow and bucket: Ch1 (DONE)**. The rest for Ch2 gardens and village farms | Pieces are grouped by material, so use `--keepmat Wheelbarrow` |

---

## PART B — CHAPTER 1 WISHLIST (things in the Giza camp you could find models for)

Everything below is currently built by hand from simple shapes. Search terms are
suggestions; **CC0 or "free for commercial use"** licences are best, and FBX or GLB
formats. ★ = biggest visual payoff.

### People (Mixamo-rig them; one set of animations works for all)
- ★ **Rais Abdallah**: an old Egyptian man in a white galabeya and turban. Search "arab old man galabeya", "egyptian farmer", "middle eastern elder".
- ★ **Hana**: a young Egyptian woman in a headscarf, casual work clothes. Search "hijab woman casual", "middle eastern woman".
- ★ **Dr. Lindqvist**: a tall European man in his 50s, field shirt, glasses.
- **Uncle Farouk**: an old guard in a dark galabeya and wrapped headscarf, with a shotgun.
- **Saber**: a boy of about 13 in a football shirt.
- **Uncle Hamid**: a heavy-set worker with a flat cap.
- **Hagg Sayed**: a heavy man in a dark galabeya.
- **The old woman with the lamp**: a small old woman all in black.
- ★ **Lena Brandt and two security men**: tactical black clothing. Search "female security contractor", "bodyguard".
- **Workmen and the cook**: 2–3 generic Egyptian labourers.
- **Animations to grab ("Without Skin")**: idle, talking (2–3 kinds), sitting on the ground, sitting on a chair, digging with a pick, shovelling, carrying a basket, drinking tea, walking, looking around, leaning, pointing.

### Animals
- ★ **Dog**: a sandy, medium-sized street dog, **rigged**, with walk, sit, lie and sleep animations. Search "rigged dog", "stray dog animated". This would replace Bosta's body; her behaviour stays.
- ★ **Camel**: couched (kneeling), ideally rigged. Search "camel rigged", "dromedary".
- **Horses ×2**: one bay, one grey, rigged. Search "horse rigged".
- Optional: goats, a donkey with a cart, pigeons, a cat.

### Vehicles
- ★ **Black Land Cruiser / big 4x4**: the midnight car. Search "toyota land cruiser" (look for unbranded or "SUV").
- ★ **Narrow-gauge diesel loco and tipping skips**: the supply line. Search "mining locomotive", "decauville", "tipper wagon".
- ★ **1920s truck**: the Harvard–Boston expedition truck (ideally a rusted wreck). Search "ford model TT truck", "1920s truck wreck".
- **Supply trucks ×2**: old Middle Eastern lorries. Search "old truck middle east", "bedford truck".
- Optional: a Hyundai sedan (Amira's car in the Ministry ending), a moped.

### Buildings and structures
- **Canvas wall tents** (Miriam's tent, the dormitory). Search "army tent", "canvas wall tent", "expedition tent".
- ★ **A mud-brick building with a flat roof and rebar**: the site office. Search "middle east house", "mud brick house", "egyptian village house".
- **A portable site cabin/trailer**: Lindqvist's trailer.
- **A guard booth / checkpoint hut**: Farouk.
- **A corrugated-iron shed** (find store, tool shed, dig shed).
- **A metal watchtower**.
- **A village saint's tomb (whitewashed dome)**. Search "islamic tomb", "white dome mausoleum", "maqam".
- ★ **A Bedouin goat-hair tent**. Search "bedouin tent", "nomad tent".
- **A chain-link fence and gate, a road barrier.**
- **Mastaba / mud-brick tomb chapels**: the workers' cemetery.

### Props (camp life)
- ★ **Brazier / fire basket**, a **Middle Eastern teapot**, **tea glasses on a tray**.
- ★ **Hurricane lanterns**, **work floodlights on tripods**, **string lights**.
- **A diesel generator**, **oil drums**, **blue water barrels**, **jerrycans**.
- **Wooden crates** (several sizes), **sandbags**, **wheelbarrows**, **rubber baskets (*quffa*)**.
- **Dig tools**: picks, shovels, trowels, brushes, buckets, a **sieve on trestles**, a **total station on a tripod**, measuring poles.
- **Camp furniture**: folding tables, camp beds/cots, stools, plastic chairs, kilims/rugs.
- **A shortwave radio**, a **dartboard**, a **satellite dish**, an **air-conditioning unit**.
- **Cooking**: a gas ring, big pots, bread baskets, vegetables.
- **Telegraph/electric poles**, **signposts**, **survey stakes**.

### Small finds and story items (close-up in conversations)
- ★ **A leather-bound papyrus codex** (the Codex itself!). Search "ancient book leather", "codex".
- **A bronze seal / signet**, a **faience Eye of Horus amulet**, **painted pottery sherds**, **old coins**.
- **A 1920s folding camera**, a **brass find tag**, a **glass plate photograph**.
- **Nummulite fossils**.
- **A metal detector**, **field glasses**, a **canteen**, a **rucksack**, a **smartphone**.

### Nature and ancient landscape (lower priority; the procedural ones work)
- Date palms, acacia, tamarisk, desert grass. Search "date palm", "acacia tree" (low-poly-ish realistic).
- The **Sphinx** and **the three pyramids** as distant hero models. Search "giza pyramids", "sphinx".
- Limestone **quarry blocks**, **rubble**.

---

## PART C — NEXT CHAPTERS (for later)
Each region file in `story/regions/` will get its own wishlist when that chapter is built.
Cairo (Ch2) will be the biggest: street people, cars and taxis, shopfronts, a café, the
Khan el-Khalili, a mosque, and the Egyptian Museum.
