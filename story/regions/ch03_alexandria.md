# CH3 — ALEXANDRIA

| | |
|---|---|
| Act | I |
| Biome | The Mediterranean coast city: the corniche, harbors, Greco-Roman ruins, underwater ruins |
| Size | Large (city and harbor, plus a big underwater zone) |
| Main / side hours | 2.5 / 5 |
| Revisit | ↺ (train from Cairo) |
| Home base | None (hotels, or the Vasse yacht at Sworn) |
| Real places | **Pompey's Pillar and the Serapeum ruins** (the real underground galleries), the **Catacombs of Kom el-Shoqafa**, the Eastern Harbour and sunken royal quarter (Antirhodos), the Qaitbay Citadel on the site of the Pharos, the Bibliotheca Alexandrina, the Cavafy House, the Nabi Daniel Mosque, the old trams |

---

## ARRIVAL
The train from Cairo, the sea air, and the long curve of the corniche. The price line comes
from **Captain Yannis**, whose dive boat is at the Eastern Harbour.

Depending on `c1_exit`/`bc` state, Lena's team is already in town (always, if
`ch2_reader` = Foundation: *"Vasse is a step ahead"*). Her yacht **Theodora** is anchored
in the harbor.

---

## MAIN BEATS

1. **The Serapeum by day.** Tour the real ruins at Pompey's Pillar: the sphinxes, and the
   underground galleries where the daughter library's scrolls were once shelved (real).
   A Codex cipher mark matches a carving in the gallery wall.
2. **Petamun's way out.** At night (a stealth entry, or with a Ministry night permit), you
   follow the cipher to a false wall. Behind it is a narrow tunnel Petamun used in 391 AD.
   It runs west.
3. **The catacomb link.** The tunnel comes out in a sealed lower level of the **Kom
   el-Shoqafa catacombs** (fiction built on the real site, with its strange Egyptian-Roman
   carvings). It's the first real **tomb puzzle**, a hieroglyph cipher: Anubis dressed as
   a Roman legionary (a real carving) points the way.
4. **Lena in the dark.** Lena's team came in from the other end. There's a collapse, and
   Lena is pinned in a shaft, with water rising. She asks for nothing.
   **`ch3_lena_freed`** ★: free her (a timed sequence) or leave her.
5. **House 1, part one.** In a dry chamber: **40 scrolls** in jars, lost Greek plays (the
   narration names real lost works, such as lost plays of Sophocles), and **Petamun's first
   letter**. Read in Greek, it tells the story of the night the Serapeum burned.
   *This is the player's first proof the Codex is real.*
6. **The scrolls choice** → `ch3_scrolls`: report to **Dr. Hoda** (Ministry), hide them in
   a safe place, or sell one to **Sabri** (40,000 EGP).
7. **House 1, part two: the harbor.** Petamun's letter says the key lies *"where the
   lighthouse fell into the sea."* That's a dive at the **Qaitbay Citadel's** underwater
   Pharos blocks and the sunken royal quarter.
   - **Choose a boat** → `ch3_dive_boat`: Yannis (legal, 3,000 EGP), Sabri (cheap,
     illegal), or Zaki (if `ch1c_zaki_saved`, free).
   - **The dive:** a big underwater zone with colossal statues, sphinxes and granite
     blocks (all real features of the harbor). Currents, bad visibility, and a
     Theodora-launched diver team hunting the same thing.
   - In a sunken Isis shrine: the **bronze star disk**.
8. **The star disk.** Back on shore, Bishoy (by phone) or Amira reads it: a star map of the
   Delta sky, pointing northeast to **Tanis**. The Delta microbus unlocks.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-03-01 | The Poet's Room | Yannis | Visit the **Cavafy House** (real) and find Yannis's grandfather's letter to the poet in a bookshop | `rel_yannis` +, and a free dive boat for later dives. Lore about Greek Alexandria |
| SQ-03-02 | The New Library | Librarian at the **Bibliotheca Alexandrina** | A rare-manuscript room research task. Match a House 1 scroll to a known title | Greek XP, and the Ministry's reward doubled if you report |
| SQ-03-03 | Sabri's Nets | Sabri | Fence runs from the fish market (illegal) | Money, Gebali +, Ministry - |
| SQ-03-04 | The Theodora | Anonymous tip (Keepers) | **Break into Vasse's yacht** at night: find the Foundation's shipping records | Radwan proof item, Vasse -, Keepers + |
| SQ-03-05 | The King's Coins | A retired jeweler | Recover coins stolen in 1954 from King Farouk's famous collection (real collector) | A Major find. Sell it or return it |
| SQ-03-06 | Ibrahim's Cousin | Ibrahim (phone) | Ibrahim's cousin runs away to Alexandria. Find him at the tram depot | Continues Ibrahim's arc (`ibrahim_fate` branches) |
| SQ-03-07 | Hoda's Survey | Dr. Hoda | Legal underwater salvage: map three sites | The diving salvage job, Ministry +, and Hoda's friendship |
| SQ-03-08 | The Tram Race | Tram driver | A bet: get across town faster than the 1860s-era tram line (real old trams) | Money, and driving XP |
| SQ-03-09 | Under the Prophet Daniel | A mosque caretaker | The **Nabi Daniel Mosque** legend says Alexander's tomb lies beneath it (a real legend). Explore the cellar | Begins the **Alexander chain**: a clue that the body was moved "to his father's oracle" (→ Siwa) |
| SQ-03-10 | Rana's Wreck | Rana (Fixer only) | A wreck dive for a sunk WWII plane off Abu Qir | Diving XP, a Rare find |

## JOBS
- Diving salvage (legal or illegal)
- Taxi fares
- Fishing off the Corniche (from the rocks)
- Photography
- Darts in a Greek bar

## SECRETS
- **The Serapeum's cistern:** a flooded optional puzzle room with a Rare find
- **Kom el-Shoqafa's "Hall of Caracalla"** (real): a bone pit, and a Petamun letter
  fragment
- **Pharos coins:** 10 underwater collectibles

## DAY / NIGHT
- The Serapeum closes at 4 pm; night entry is a stealth section.
- Harbor currents are calmer in the morning.
- The fish market is at dawn.

## LEAVING
Microbus to **Ch4 The Delta** (Tanis).
