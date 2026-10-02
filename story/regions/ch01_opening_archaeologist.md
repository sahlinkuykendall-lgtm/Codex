# CH1-A — THE GIZA DIG CAMP (Archaeologist opening)

**Status: built (V4.0.0 → V4.1.0)** in `ch1a_story.js`, with shared state in `story_core.js`.
This file matches the build. If you change the chapter, change both.

| | |
|---|---|
| Act | I (prologue) |
| Background | Archaeologist only (no other background can visit this area) |
| Biome | The desert plateau and dig camp on the western edge of the Giza necropolis, with the pyramids on the skyline |
| Size | Large (the existing built Chapter 1 map) |
| Main / side hours | 1–1.5 / 1.5–2 |
| Time | **One night.** The story clock runs from 20:30 to 04:40 (an in-game minute every 2 real seconds while you play). Resting at the fire or the camp bed skips an hour, or straight to midnight |
| Revisit | No (it's the opening). Giza returns in Ch14. After the chapter ends you can keep exploring the camp |
| Real places | The Giza plateau, the causeway of Khafre, the **Osiris Shaft** (three levels, the lowest flooded, cleared in 1999), the ancient limestone quarries, the Harvard–Boston Expedition (worked at Giza 1902–42) |
| Built assets reused | The whole existing Ch1: tents, dorm, site office (formerly the foreman's office), trenches, the supply line, oasis, the old truck, guard booth, sherds, caches, the detector, backpack, tips; the sieve, tea, darts and seal minigames |

---

## PREMISE

You've been hired to take over the **Giza Western Field Survey**, because its director,
Dr. Miriam Hale, "left for family reasons" four days ago. Nobody at camp believes that.

---

## CHARACTERS HERE

| Character | Where | Role |
|---|---|---|
| **Rais Abdallah** | The workers' fire (west) | The foreman, from Quft. The heart of the camp |
| **Dr. Peter Lindqvist** | The site trailer (east, by Trench A) | The deputy. Kind, frightened, lying badly. Took Vasse money |
| **Hana Mostafa** | Her conservation table by the director's tent | The conservator, Miriam's student |
| **Uncle Farouk** | The guard booth (the old Ministry post, east) | The night guard (*ghafir*) |
| **Saber** | The tea kettle at the workers' fire | The tea boy. Knows everything |
| **Uncle Hamid** | The supply line (south) | The rail foreman |
| **Gamal** | The dormitory | A night-shift worker |
| **Lena Brandt** and two men | Miriam's tent, at midnight only | Vasse's security |

---

## MAIN BEATS

1. **Arrival** (20:30). The taxi drops you at the gate. Rais Abdallah meets you with a
   lantern: *"Doctor Miriam did not leave for family reasons."* The men are owed eleven
   days of wages. You sleep in the director's tent, where her things are untouched.
2. **The payroll** (at the Rais's fire). The site account is **6,000 EGP** short. →
   `payroll`:
   - **`paid`**: you pay it from your own 8,000. Rais +15, workmen +25.
   - **`confronted`**: *"Lindqvist is going to explain where that money went."* At his
     trailer he admits the Vasse Foundation has paid the whole season since spring and
     stopped when Miriam left. He pays from the Foundation's "emergency float." Lindqvist
     -15, Rais +10, workmen +20.
   - **`delayed`**: the men wait. Rais -10, workmen -20. You dig alone. (You can still
     pay later.)

   **If you ask Lindqvist first** (before the payroll is settled, or while it's `delayed`):
   *"The Rais says the men haven't been paid in eleven days."* He dodges: *"Friday. The
   transfer's coming Friday. Geneva is slow."* You can press him, since he said Friday
   last Friday too: Lindqvist -3 (`lq_wages`), and the Rais repeats "Friday" at the fire.
   He only tells the truth through the `confronted` route. (Added V4.1.5.)

   Any of these gets you Miriam's key ring and **opens the dig-zone gate**. The find-store
   key isn't on the ring: *"She kept that key on her."*
3. **The trenches mean something now:**
   - **Trench A** (the east trench). A moved survey stake hides a zip-lock bag holding
     **Miriam's notebook page**: *"Osiris Shaft, level 3. The niche was behind the
     plaster. I have put it somewhere safer. The find store key is in B, under the red
     stake — Trench B spoil went to the old field by the village. There is an older seal
     on the shaft approach. Owl, eye, serpent, lion. I opened it once. I closed it again.
     Don't."* Digging costs 20 minutes with the men's help, or 45 alone.
   - **Trench B.** The dig-shed clipboard: *"14th — Trench B backfilled (M.H. alone).
     Spoil to old field by village ruins. Red stake."* At the old spoil field, sieving the
     heap under the red stake (**sieve minigame**) turns up a **brass key tagged MAG**,
     for the find store.
   - **Trench C.** Miriam's red survey stake by the dig gate, with ⲡⲏⲓ scratched in it
     (Coptic for "the house"). It lines up with the causeway and the Sphinx. It pays off
     in Ch2.
4. **Uncle Farouk** (optional, but it sets up the midnight scene). He saw a black Land
   Cruiser come without lights the night Miriam left, with a woman in the back "like an
   old woman at a funeral." Miriam got in by herself. *"The other car comes at
   midnight."* Give him Saber's mint tea or 500 EGP → `farouk_bribed` (he has the old
   causeway gate key, which pays off in Ch14).
5. **The midnight car** (the staged event). At **00:00** on the story clock, a black Land
   Cruiser drives up the east road (the built car drive-in). When it parks, **Lena Brandt**
   and two men search Miriam's tent for about 90 minutes of story time.
   - **Listen from the shadows** (`lena_overheard`): *"She moved it before she left... Mr.
     Vasse will want the deputy's phone records."*
   - **Photograph them** (`lena_photos`, with the plate: diplomatic green).
   - **Confront them** (`met_lena`): *"Lena Brandt. Security, Vasse Foundation... a book.
     Old. Leather."* She gives you her card.
   - **Miss it** (`lena_missed`): the tent is gone through.
6. **The find store** (a steel-doored magazine in the dig zone, with a Ministry paper-and-
   wax seal on the hasp). With the MAG key:
   - **Slit the seal cleanly**, or **break it**.
   - Inside, a crate marked "LATE PERIOD POTTERY — SHERDS" holds, wrapped in Miriam's
     green scarf, **the Codex**, and her note: *"Don't give it to Vasse. Take it to Father
     Bishoy — Café El-Fishawy, Cairo, Thursday."*
   - If you slit the seal and have Hana's wax, you reseal the store (`store_resealed`).
7. **Optional: the Osiris Shaft and Petamun's seal.**
   - The survey shaft (the tunnel mouth) goes down to level 3, where Miriam's cut niche is
     empty.
   - On the shaft approach is **the old seal** (the glyph-seal minigame). The order is owl,
     eye, serpent, lion (from the notebook page), and a wrong stone fires a dart.
   - Behind it, in a small floor niche Miriam missed, is the **bronze seal of Petamun**
     (`petamun_seal`, a Ch14 key item).
8. **Headlights** (as soon as you have the Codex). A car on the plateau road, and Lindqvist
   on the phone in his trailer. **Exit choice** (`c1_exit`):
   - **Quiet:** out through the old quarry on foot to the Cairo road (a watermelon truck).
   - **Legal:** call Dr. Amira Sayed. She drives out herself. Amira +15, Ministry +10.
   - **Deal:** take the Foundation's car. An envelope with 5,000 EGP and a card: CONRAD
     VASSE — WITH COMPLIMENTS. Vasse +10.
9. **The chapter-end card** lists the choices that will carry forward. You can then keep
   exploring the camp, or return to the title.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-01A-01 | The Rais's Son | Rais Abdallah | Mina owes Hagg Sayed, a Nazlet el-Samman stable owner, 1,500 EGP. Pay it, hand over the darts winnings, or **race Hagg Sayed** on his old grey mare at the camp gate (three choices during the race decide it) | Rais +15, and the Qufti family owes you (Ch10). Riding XP |
| SQ-01A-02 | Hana's Conservation | Hana | Bring her three painted sherds. The flicks join into an ibis | Hana +15, **conservation wax** (reseals the find store), and **Hana's valuation** (+20% on sieve finds and the sherd set) |
| SQ-01A-03 | The Tea Boy's Secret | Saber | Pour a perfect glass (**tea minigame**), and he tells you Lindqvist burned papers in the site-office bin | **Half-burned papers**: Vasse transfers, and "Dr. Hale's cooperation is no longer required" (a Radwan proof item in Ch4) |
| SQ-01A-04 | The Truck of 1926 | Exploration | The Harvard–Boston Expedition truck: a diary in the glovebox (an old woman with a lamp at the shaft, "one of the Keepers"), and **four relics** round it for the detector: a Kodak camera, a trowel, a brass find tag, and a glass-plate photo of the crew with a boy who is the Rais's grandfather | 600 EGP, Ministry +5, and showing the Rais the photo (Rais +12) |
| SQ-01A-05 | Supply Line Blues | Uncle Hamid | The skip line's coupling pin sheared. There's a spare in the sorted crates | 1,500 EGP, workmen +10 |
| SQ-01A-06 | Miriam's Caches | The detector | Some of the buried caches are Miriam's (orange survey tape): 1,200 EGP, **her spare phone** (one number: "A.S."), field glasses, her old rucksack (16 space) | Money and gear. **Calling "A.S." from the phone** reaches Amira early (Amira +12, and the legal exit remembers the promise) |
| SQ-01A-07 | Darts Night | The dartboard | A 200 EGP stake. Beat the Rais's 132 (**darts minigame**) | 2,000 EGP, and a nickname ("Abu Ramy") |
| SQ-01A-08 | Bosta | The camp dog | Win the camp dog over (ear scratches, dates) and she follows you. Teach her to sit and give a paw | A companion for the night, who barks at the midnight car and growls at Lena |
| SQ-01A-09 | Pharaoh's Lentils | The fossil pavement | Five nummulite fossils ("the lentils of the pyramid workers", Herodotus) | Excavation XP, lore |
| SQ-01A-10 | The Lamp at the Tomb | The old woman at the sheikh's tomb (night only) | She knows where Miriam is ("somewhere safe") and gives you a painted tile: a lamp in a doorway, the Keepers' sign | Keepers +5. The first Keeper shrine tile (shrine travel in later chapters) |
| SQ-01A-11 | The Looters' Pit | The workers' cemetery | Fresh robbers' digging. Take the faience Eye of Horus they missed, or leave it for the Ministry | An amulet, or Ministry +3 |

## PLACES (discovered on first visit; the watchtower reveals them all)

| Place | What's there |
|---|---|
| The Director's Camp | Miriam's tent, Hana's table, the date palm, Bosta's home by the fire |
| The Workers' Camp | The Rais at the fire (**the brazier's fire and its sound**), the dorm, the site office, the kettle, the cooking table, darts, water barrels |
| The Dig Zone | The dig shed, the find store, the survey shaft, Petamun's old seal |
| Trench A | Lindqvist's trailer, the trench, the scaffold |
| The Old Ministry Post | Uncle Farouk, the guard booth, the generator |
| Camp Gate | The gate, Hagg Sayed and his horses, the loading bay. **The supply line's turning loop**: the train comes in loco-first, rounds the loop and leaves loco-first |
| The Oasis | Pool, well (drink), canteen |
| The Old Village | Mud-brick ruins, the fallen lintel |
| The Spoil Field | The sieve (Trench B's key) |
| The Dry Wadi | Acacias, camel bones |
| The Lookout | The cairn |
| The 1926 Truck | The Harvard–Boston truck and its relics |
| Bedouin Shelter | A goat-hair tent, a hearth with brass coffee pots, and a couched camel |
| **The Old Quarry** | The limestone knobs, and **the mason's marks**: "The Drunkards of Menkaure" in red ochre (a real Giza gang name), and a later eye-in-a-house mark that matches the Codex's margin (pays off with Bishoy in Ch2) |
| **The Workers' Cemetery** | The pyramid builders' tomb chapels (found 1990), a false door with Petety's real curse (needs Hieroglyphs 2), and the looters' pit |
| **The Sheikh's Tomb** | A whitewashed village saint's shrine. At night, the old woman with the lamp |
| **The Watchtower** | An old antiquities-police tower. Climb it (Climbing XP) and every place goes on your map. With the field glasses, you see a car waiting by the Osiris Shaft |
| **The Builders' Ramp** | A construction ramp with sledge ruts, and the history of the ramp debate (Hatnub, 2018) |
| **The Fossil Pavement** | Five nummulites |
| **The Mess Tent** (V4.1.2) | An army marquee north of the director's camp: trestle table, benches, tea urn |
| **Hana's Tent** (V4.1.2) | A round canvas tent with an awning |
| **Miriam's Camp Kitchen** (V4.1.2) | Stove, gas bottle, cooler and mugs on a kilim beside her tent |
| **The Tool Rack** (V4.1.2) | In front of the dig shed; a wheelbarrow kit at the east trench |

## PEOPLE (besides the main cast above)
- **Bosta**, the camp dog: a sandy baladi dog, one ear up and one flopped, named for the
  post van she arrived in. She has her own routine and can follow you.
- **Hagg Sayed**: horse and camel owner from Nazlet el-Samman, and moneylender. He holds
  Mina's debt.
- **The old woman with the lamp**: at the sheikh's tomb, at night. Kind and unafraid. A
  Keeper, though nothing on screen says so.
- **The cook**, **Gamal** (night shift), the workmen.
- **Sergeant Hamdi Tawfik** *(addition, P0.53, at the owner's request)*: the man by the white
  Ministry Land Cruiser at the guard post. Ministry plates, police boots: Tourist and Antiquities
  Police, writing down who comes and goes from Miriam's tent for "a colonel in Cairo" (Radwan,
  never named here: "not a bad man, a tired one"). Bring him a glass of tea and he reads his log of
  the night Miriam left (23:40 to the find store with the green-scarf bundle, out without it;
  00:30 the black Land Cruiser, a woman in the back, Miriam got in by herself), which backs up
  Hana and Farouk (`c1a_watcher_log`). You can photograph him (`c1a_watcher_photo`, an item).
  **For Ch2 to use** (a suggestion, not yet a rule): in the Radwan interview, the photo shows him
  you know his men were watching Miriam. It doesn't change his conscience points unless the
  owner decides it should.

## SYSTEMS HERE (see `06_SYSTEMS.md`)
- **The clock:** the chapter runs one night, 20:30 to 04:40. After the chapter-end card, the
  clock runs free (a 48-minute day): dawn, full day with a moving sun, and dusk.
- **Skills and XP:**
  - Excavation (digging, sieving, finds, fossils, relics)
  - Hieroglyphs (the seal, the false door, the mason's marks)
  - Coptic (the red stake)
  - Greek (the seal's name, the Codex)
  - Arabic (every real conversation with an Egyptian speaker)
  - Photography, Stealth, Climbing, Riding, First aid
- **Thirst and hunger:**
  - Water comes from the well, the water barrels, the canteen and tea.
  - Food comes from the cooking table (lentils) and dates.
  - At empty you can't sprint.
- **Failure states:**
  - The old seal's dart **injures** you, so you limp until Hana patches you or you rest.
  - Slipping into the tent behind Lena's men gets you **knocked out**. You wake by the
    workers' fire 1.5 hours later, injured. **They take the cash in your wallet** (up to 1,000
    EGP, so it looks like thieves, never so much you can't pay the men's wages) and **photograph Miriam's notebook page, but leave it with you**
    (`lena_has_page`: whoever they work for now knows about the shaft). They never take
    anything you need for a task.
- **The phone (P):**
  - Map, with tasks and places found
  - Messages (the department's welcome; an unknown number at midnight, from the people in the black car: "Stay in your tent tonight, Doctor. Whatever you hear.")
  - Contacts and calls
  - Bank, with a ledger
  - Skills
  - Notes (J also opens the notes)

## JOBS
- Sieving at the spoil field (3 heaps; Excavation and Hana raise the pay)
- Detector sweeps (caches and relics)
- Painted sherds (8, with a bounty for the set)
- The darts tournament

## SECRETS
- The bronze seal of Petamun (step 7)
- The painted sherds form an ibis (a deniable Thoth hint)
- Miriam's bookmarked Setne story in her tent: *"Coptos. The river. Why always the river?"*
  It pays off in Ch10
- The mason's eye-in-a-house mark (Ch2)
- The car by the Osiris Shaft, seen from the watchtower through the field glasses

## VISUALS
- **The old quarry (V4.0.1).** The rock knobs are the limestone the pyramids were cut from:
  weathered crowns, and cut faces stepping down in terraces with half-cut blocks, wedge
  sockets and spoil.
- **The 1926 truck (V4.0.1)**, **the find store (V4.0.1)**, **the brazier's fire (V4.0.3)**,
  **Bosta, the turning loop, the Bedouin camp, the site office front (V4.0.4)**.
- **The new places (V4.1.0):** tomb chapels, the maqam, the watchtower, the ramp, the fossil
  pavement.

## LEAVING
Every exit leads to **Ch2 Cairo** (not built yet). The chapter-end card says so. Your choices
are saved in `gameState.story` and will carry into Ch2.
