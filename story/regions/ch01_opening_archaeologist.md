# CH1-A — THE GIZA DIG CAMP (Archaeologist opening)

**Status: built (V4.0.0)** in `ch1a_story.js`, with shared state in `story_core.js`.
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
| SQ-01A-01 | The Rais's Son | Rais Abdallah | Mina owes a Nazlet el-Samman stable owner 1,500 EGP. Pay it, or hand over the darts tournament winnings | Rais +15, and the Qufti family owes you (Ch10) |
| SQ-01A-02 | Hana's Conservation | Hana | Bring her three painted sherds. The flicks join into an ibis | Hana +15, and **conservation wax** (reseals the find store) |
| SQ-01A-03 | The Tea Boy's Secret | Saber | Pour a perfect glass (**tea minigame**), and he tells you Lindqvist burned papers in the site-office bin | **Half-burned papers**: Vasse transfers, and "Dr. Hale's cooperation is no longer required" (a Radwan proof item in Ch4) |
| SQ-01A-04 | The Truck of 1926 | Exploration | The Harvard–Boston Expedition truck's glovebox: a 1926 diary about an old woman with a lamp at the shaft, "one of the Keepers" | Lore, and 40 EGP |
| SQ-01A-05 | Supply Line Blues | Uncle Hamid | The skip line's coupling pin sheared. There's a spare in the sorted crates | 1,500 EGP, workmen +10 |
| SQ-01A-06 | Miriam's Caches | The detector | Some of the 12 buried caches are Miriam's (orange survey tape): 1,200 EGP, a spare phone with "A.S." saved, field glasses, her old rucksack (16 space) | Money, gear |
| SQ-01A-07 | Darts Night | The dartboard | A 200 EGP stake. Beat the Rais's 132 (**darts minigame**) | 2,000 EGP, and a nickname ("Abu Ramy") |

## JOBS
- Sieving at the spoil field (3 heaps)
- Detector sweeps (caches)
- Painted sherds (8, with a bounty for the set)

## SECRETS
- The bronze seal of Petamun (step 7)
- The painted sherds form an ibis (a deniable Thoth hint)
- Miriam's bookmarked Setne story in her tent: *"Coptos. The river. Why always the river?"*
  It pays off in Ch10

## NOT YET DONE (visual follow-ups)
- The chalk formations are still White Desert "mushrooms." The bible calls this area the
  old limestone quarry, so they should be re-modelled as quarried blocks.
- The old truck's model is a buried Land Rover with a Ministry roundel. It should become a
  1920s expedition truck.
- The find store uses the tool-shed model and its "TOOLS" sign.

## LEAVING
Every exit leads to **Ch2 Cairo** (not built yet). The chapter-end card says so. Your choices
are saved in `gameState.story` and will carry into Ch2.
