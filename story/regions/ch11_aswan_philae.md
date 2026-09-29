# CH11 — ASWAN & PHILAE

| | |
|---|---|
| Act | III |
| Biome | Granite cataracts and islands in a fast blue river, golden dunes on the west bank, colorful Nubian villages, and two dams |
| Size | Large (city, islands, villages, and a big underwater zone) |
| Main / side hours | 3 / 6 |
| Revisit | ↺ |
| Home base | The Hathor (moored at the corniche), or the **Nubian guest room** (buy, or free at Nubian Sworn) |
| Real places | The Aswan corniche, **Elephantine Island** (the Nilometer, the Khnum temple), **Gharb Soheil** and other Nubian villages, **Qubbet el-Hawa** (the Tombs of the Nobles), the **Unfinished Obelisk**, the **Old Cataract Hotel**, the **Monastery of St. Simeon**, the **Nubian Museum**, **Philae (the temple of Isis, rebuilt on Agilkia island)** and the **Graffito of Esmet-Akhom** (24 August 394 AD, the last hieroglyphic inscription), the **drowned original Philae island**, the **Aswan High Dam**, the Daraw camel market |

---

## ARRIVAL
The Hathor sails into Aswan through the granite boulders of the cataract. It's the most
beautiful arrival in the game. A felucca with a blue-and-yellow sail cuts across your bow,
and a woman at the tiller shouts something in Nobiin, laughing. It's **Nour**.

---

## MAIN BEATS

1. **The last hieroglyph.** At **Philae** (Agilkia), in the Gate of Hadrian, is the real
   **Graffito of Esmet-Akhom**, the last hieroglyphic inscription ever carved, dated 394 AD.
   Beside it, only visible with the Codex's cipher, is a mark: *"The house is on the island
   the goddess left."* The temple was moved in the 1970s, so the island the goddess left is
   **the original Philae island, now underwater** behind the dam (real).
2. **You need Nour** (the language gate; see `06_SYSTEMS.md` §3).
   - Nour won't take you past the First Cataract until **Nubian ≥ 1**. You learn through
     SQ-11-01 (Ustaz Karam's lessons), jobs with Nubian speakers, and songs at the
     guesthouse. **It's a 1–2 hour loop by design.**
   - She won't take you to the drowned island until **Nubian ≥ 2 and `rel_nour` ≥ 20**.
     You earn her trust through the Nubian side quests, and by respecting Hajja Fatma.
   - **Fallback (if Nubia is hostile, or you skip her):** a Gebali smuggler's boat at
     night, with no guide, stronger currents and more hazards. It's harder, but it works.
3. **The night sail** (romance-eligible). Nour sails you to the site under the stars and
   sings in Nobiin. If `rel_nour` is Bonded → `rom_nour`.
4. **House 6: the drowned island** (a big dive). The original Philae's foundations lie in
   murky water: toppled columns, the stubs of pylons, and a submerged priest's house.
   - **Puzzle:** a **mirror and light** chain. Carry a dive lamp to reflect off polished
     bronze mirrors the Philae priests left, and open a sealed chamber in an air pocket
     under the old temple platform.
   - **Inside, dry, by a miracle of engineering:** **80 scrolls** (the Philae priests' own
     records, the last centuries of the old religion), **Esmet-Akhom's letter**, and **one
     half of the final lock** (a bronze plate).
   - **On the opened track**, Petamun's margin notes in the Codex have *changed*. They now
     describe how to save the Claimed (`04_ENDINGS.md` §4).
5. **The Philae scrolls choice** → `ch11_philae`: give them to the **Nubian Museum**
   (Nubian +25, the Ch12 gate), the Ministry, or keep them.
6. **The Claimed, stage 2 (Sickness):** cold hands, water on the floor where they sleep,
   and they forget your name once.
7. **Vasse takes Miriam** (the staged end of chapter). Wael or Lena (if she's warm to you)
   warns: *"He needs someone who has read the Book's line aloud."* That night, Vasse's men
   take **Miriam**, from your boat if she's with you, or from the Keepers' Minya hall.
   - **Unless** she stayed with the Keepers **and** Keepers ≥ Trusted: then they hid her,
     and Vasse's men come up empty (`miriam_state` stays safe).
   - Otherwise `miriam_taken` = true, and her rescue happens in Ch13.

**Leaving:**
- **Nubian ≥ Trusted and Nour's trust:** Nour takes you south across the lake to **Ch12
  Lake Nasser**.
- **Otherwise:** a flight to Sharm el-Sheikh, then a road up to **Ch13 Sinai** (Ch12
  RESTRICTED).

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-11-01 | Speak Nobiin | Ustaz Karam | Nubian lessons: words, then songs, then a whole conversation with Hajja Fatma | Nubian skill (the Nour gate) |
| SQ-11-02 | **The Drowned Village** | Hajja Fatma (Nour's grandmother) | A memory project: record her memories of Old Ballana (drowned 1964), photograph the old family photos, and find her mother's lost house key in the museum stores | Nubian +25, the Ch12 gate, and `ch12_memory` groundwork |
| SQ-11-03 | The Nilometer | An Elephantine guard | The real **Nilometer** measured the flood that set taxes. Read the old marks and settle a modern land dispute with them | Ministry +, a history lesson |
| SQ-11-04 | The Unfinished Obelisk | A quarry guide | The biggest obelisk ever attempted, abandoned when it cracked (real). Find the ancient workers' tally marks | Hieroglyphs XP, collectibles |
| SQ-11-05 | Tea at the Old Cataract | A hotel guest | A murder-mystery weekend at the hotel where Agatha Christie stayed (real) goes wrong: a real theft. Solve it in true Poirot style | Money, and a fun detective quest |
| SQ-11-06 | The Dancing Dwarf | A tomb guard at **Qubbet el-Hawa** | The real letter of the boy-king Pepi II to the explorer Harkhuf, begging him to bring home a dancer safely. Recreate the journey's route | Lore, and a great sweet story |
| SQ-11-07 | Daraw Camels | A camel trader | The real Daraw camel market: buy, sell, and race | Money, a camel |
| SQ-11-08 | A Nubian Wedding | Nour's cousin | (Nubian Sworn) Help with a three-day Nubian wedding: henna night, songs, the feast | Huge Nubian and `rel_nour` gain, and an epilogue photo |
| SQ-11-09 | St. Simeon's Walls | A monk (visiting) | Restore a fresco fragment in the desert monastery (real ruins) | Coptic XP, and `rel_bishoy` + |
| SQ-11-10 | The House Crocodile | Nubian kids | A family keeps a pet Nile crocodile (a real Aswan curiosity). It's escaped | A funny chase, and village +10 |

## JOBS
- Felucca fares
- Diving salvage (the dam lake shallows)
- Nubian guesthouse help
- Guiding (Philae, the Tombs of the Nobles)
- The Daraw camel market
- Fishing

## SECRETS
- **The Isis temple's hidden roof room** (real rooftop Osiris chapels): Keeper shrine tile #9
- **Sunken Philae collectibles:** 12 underwater carved blocks with priestly names
- **Kitchener's Island rare trees:** a botany collectible set

## DAY / NIGHT
- Philae has a Sound and Light show at night, and entering during it is easy.
- The Nubian villages are liveliest at sunset.
- Currents are gentlest before dawn.
