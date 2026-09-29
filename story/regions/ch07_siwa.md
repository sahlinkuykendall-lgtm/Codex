# CH7 — SIWA OASIS (missable)

| | |
|---|---|
| Act | II |
| Biome | A deep-desert oasis: palm and olive groves, salt lakes you float in, mud-and-salt ruined towns, dunes on all sides |
| Size | Large |
| Main / side hours | 1.5 (optional path) / 5 |
| Revisit | ↺ once unlocked (the army road via Marsa Matruh, or shrine travel) |
| **Access (⊘)** | `rel_salem` ≥ 25 **or** `rep_bedouin` ≥ Warm **or** a Ministry desert permit. Otherwise **RESTRICTED** ("Military zone: permit required"). The main path continues via the Bahariya fallback (Ch6) |
| Home base | **Siwa mud-brick house** (buy, 400,000) |
| Real places | **Shali** (the ruined mud-salt fortress town), **Aghurmi and the Temple of the Oracle of Amun** (where Alexander came in 331 BC), the **Temple of Umm Ubayda**, **Cleopatra's Spring**, **Gebel al-Mawta** (the Mountain of the Dead, with the painted tomb of Si-Amun), the salt lakes, **Gebel Dakrur**, and the Siwan language (**Siwi**, an Amazigh language) |

---

## ARRIVAL
You come in by Salem's caravan over the last dunes at sunset, or by the army road from the
Mediterranean coast. **Siwa is its own world:** Siwi is the first language, customs are
conservative, and hospitality is deep. **Sheikh Yahya** receives you, and **Mona** runs
the eco-lodge and knows every piece of gossip.

**Writing note:** show Siwan culture with respect and specificity (the silver jewelry,
the embroidered wedding dresses, the date economy, the Siyaha festival). Don't make it
exotic.

---

## MAIN BEATS

1. **Sheikh Yahya's welcome.** He's heard of you from Salem (if you came that way). He
   agrees to take you to the Oracle, but warns: *"Amun speaks. You must know how to
   listen."*
2. **Learn some Siwi** (optional) → `ch7_siwi`. Yahya's grandson teaches you Siwan songs.
   The melody of one old wedding song **is** the Word of Amun, preserved in folk music for
   2,000 years without anyone knowing. Learning it makes step 4 easy.
3. **Aghurmi at night.** The Temple of the Oracle sits on a rock above the village ruins.
   A real theory says the priests spoke the oracle through a hidden passage in the
   sanctuary wall. You find that passage.
4. **The Word of Amun** (a sound puzzle). At moonrise, wind moves through the passage. You
   tune it by opening and closing stone vents to make a sequence of notes.
   - **With `ch7_siwi`:** you recognize the wedding song and play it.
   - **Without it:** a longer puzzle of trial and echo.

   When it's right, a carved panel in the sanctuary floor answers: the Word of Amun, **a
   name spoken in seven tones**, the key to House 4.
5. **The chase at Shali** (depends on `bc1_side`). Vasse's squad, Keeper saboteurs or border
   police catch up to you. It's a night chase through the maze of Shali's crumbling
   mud-salt lanes (real ruins) with collapsing walls.
6. **Alexander** (optional, the end of the chain; see SQ-07-01).

**Leaving:** the army road to the coast (Marsa Matruh), then Cairo, then south to **Ch8
Hermopolis**. Or Keeper shrine travel.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-07-01 | **The Tomb of Alexander** | Built from SQ-03-09 (Nabi Daniel clue), SQ-06-09 (Almásy's map), and SQ-06-03 (the Cambyses officer's trail) | Needs **any two** of those three clues. Under the Temple of Umm Ubayda, a sealed chamber holds a glass-and-gold sarcophagus with Macedonian insignia. **Alexander the Great** | `alexander_found`. `ch7_alexander` ★: announce (Ministry +25, world fame), keep secret (Keepers +20), sell to Vasse (+5,000,000 EGP, Ministry -40, Keepers -30) |
| SQ-07-02 | The Siyaha Festival | Sheikh Yahya | The real Siwan reconciliation festival on **Gebel Dakrur**: settle a feud between two families before the festival meal | Siwan rep, and a festival night (+ affinity with your ally) |
| SQ-07-03 | Shali After Rain | A restoration architect | Rain melts salt-mud (real). Help restore a house in Shali using the traditional *kershef* technique | Carpentry XP, and a free room |
| SQ-07-04 | Si-Amun's Colors | A tomb guard at **Gebel al-Mawta** | The painted tomb of Si-Amun (real) is being damaged by tourists touching it. Photograph and document it | A Ministry photo job, and Photography XP |
| SQ-07-05 | Cleopatra's Spring | Mona | A tourist lost a ring in the famous spring. Dive for it | Money, and Mona + |
| SQ-07-06 | The Last Soldier | Aisha (from SQ-06-03) | The end of the Cambyses chain: the Persian officer's diary in a cave on the Great Sand Sea's edge | The chain completes. `ch6_cambyses` choice |
| SQ-07-07 | Olive Oil | Farmer | The olive-press season: carry, press, sell | Money, and a gift of oil (Youssef's wife loves it) |
| SQ-07-08 | Border Runners | A smuggler | Illegal runs toward the Libyan border | Big money, heat +2, Bedouin - |
| SQ-07-09 | The Salt Lake | Kids at the lake | Float in the salt lake, and race to the salt-block island | A fun rest spot, and a collectible |

## JOBS
- Date harvest (Siwa is famous for dates)
- Olive pressing
- Guiding tourists (dunes and spring)
- Salt-block cutting
- Photography

## SECRETS
- **The Oracle's second passage:** a hidden priest's room with Ptolemaic offerings (Rare)
- **Gebel al-Mawta's unfinished tomb:** Keeper shrine tile #5
- **Siwan silver:** 6 collectible jewelry pieces (bought or found)
