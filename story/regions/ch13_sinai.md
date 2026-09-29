# CH13 — SINAI (missable, with fallback)

| | |
|---|---|
| Act | III (convergence) |
| Biome | High granite mountains, deep wadis, Bedouin orchards hidden in the ranges, a 1,500-year-old monastery, turquoise-mine plateaus |
| Size | Large |
| Main / side hours | 3 / 4 |
| Revisit | ↺ once unlocked (until Ch14 begins) |
| **Access (⊘)** | `rel_bishoy` ≥ 30 **or** a Jebeliya escort (Bedouin ≥ Trusted, or SQ-13-01). Otherwise **RESTRICTED** ("Checkpoint: foreigners need an approved guide" / "Monastery closed to you"). **Fallback:** the Gebali's stolen **Serabit squeeze** (Ch9) gives the same final-lock half, and the story goes straight to Ch14. Vasse then has a copy too (an ambush in Ch14) |
| Real places | **St. Catherine's Monastery** (founded under Justinian in the 6th century; its library is one of the oldest working libraries on earth; home of the **Codex Sinaiticus** until most of it went abroad in the 1840s–50s; more leaves were found in a sealed room in 1975), the **Jebeliya** Bedouin (the real monastery-guardian tribe), **Mount Sinai (Jebel Musa)** and its night climb to sunrise, **Serabit el-Khadim** (the temple of Hathor, Lady of Turquoise, and the mines with the **Proto-Sinaitic inscriptions**, the ancestor of nearly every alphabet), **Wadi Mukattab** (the Valley of Inscriptions) |

---

## ARRIVAL
By road from Sharm, or the long desert road from Cairo through the Suez tunnel. Father
**Bishoy** is home: in the monastery, he's lighter and happier, and full of jokes. The
Jebeliya's **Sheikh Mousa** runs the guides and the mountain.

---

## MAIN BEATS

1. **The monastery library.** Bishoy (Coptic 3 needed, or Bishoy reads) finds a 6th-century
   letter from **a pupil of Petamun**, a monk who came here when the monastery was new
   (fiction, in a real library). It describes the final lock: *"Two halves. One in the
   goddess's drowned house. One where the miners first wrote to the Lady, in letters
   before letters."* That's **Serabit el-Khadim**.
2. **Miriam's rescue** (if `miriam_taken`). Wael, Lena or Bishoy's Jebeliya contacts find
   Vasse's desert camp in an abandoned manganese-mine town on the Gulf of Suez coast. It's
   a night **rescue mission** with your chosen ally.
   - **Success:** Miriam chooses her own future from your earlier talks: `miriam_state` =
     `saved` or `keeper`.
   - **Failure:** she's lost in the escape if trust is low (`dead`), or recaptured if trust
     is high (she's at Ch14 as Vasse's reader, rescuable there).
   - **Opened track, if she's `claimed` and failed:** `lost`.
3. **The Weighing** (opened track only, SQ-13-W). **The Claimed, stage 3 (Vanishing):** the
   night after you arrive, the Claimed walks out into the mountains. Follow their tracks
   (Bedouin dialect helps, and so do Aisha or Mousa) to the **temple of Hathor at Serabit**,
   where you find them standing in the dark among the stelae, talking to someone who isn't
   there.
   - **Bring them back** (a dialogue built from your shared history; the lines you can say
     depend on events you actually lived together). Success keeps them alive until Ch14,
     but doesn't break the claim. Failure: they're gone into the night and reappear at
     Ch14's water gate, and saving them there is harder.
4. **Serabit el-Khadim** (a big climb and puzzle zone). Climb to the plateau temple of
   Hathor, with turquoise-mine mouths in the cliffs.
   - **THE ALPHABET LOCK:** in a mine gallery are the real Proto-Sinaitic signs (an ox head,
     a house, water, a snake). You must turn pictures into sounds, the same step that
     invented the alphabet, and spell the word Petamun chose. The real inscription *l-b'lt*,
     "to the Lady," is the solution. It's a clever, learnable puzzle.
   - Behind it: **the second half of the final lock.**
5. **Lena's choice** (automatic from `rel_lena`) → `lena_choice` ★. That night, in the
   monastery guest house:
   - **Defect (≥ 50):** she walks in unarmed and lays her pistol on the table: *"I'm done."*
     She becomes a combat ally. With romance (Bonded), `rom_lena`.
   - **Neutral (0–49):** she leaves a note (*"Bavaria. Don't write."*) and quits. She's gone
     for the rest of the game.
   - **Betray (< 0):** she takes what matters most. **The Book** (opened track) or **the
     final lock halves** (sealed track). Chase her: **SQ-13-M "The Monastery Road"**, a
     night jeep and camel chase through the wadis. Succeed and you get it back. Fail on the
     opened track and `vasse_has_book` = true (Usurper risk). Fail on the sealed track and
     Vasse has the key (an ambush in Ch14, but still winnable).
6. **Sunrise on Mount Sinai** (the calm before the end). The night climb up the 3,750 Steps
   of Repentance (real) with everyone who's still with you. At the summit at dawn you get
   **the last conversations**: every living ally gets a scene. It's the last chance to
   raise affinity, and to **equip your allies** (buy them gear, see Ch14).
7. **The phone rings.** Amira, Radwan (if honest), Hagg Mahmoud or Sitt Meret: *"Vasse is at
   Giza."*

**Leaving:** straight to **Ch14 Beneath Giza**. A warning screen appears before the descent
(the point of no return).

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-13-M | **The Monastery Road** | Auto (if Lena betrays) | Step 5 | `vasse_has_book`, or you recover the key |
| SQ-13-W | **The Weighing** | Auto (opened track) | Step 3 | Keeps the Claimed alive to Ch14 |
| SQ-13-01 | The Jebeliya Escort | Sheikh Mousa | Earn a Jebeliya escort without Bishoy: bring back a lost goat herd from a high wadi, and share bread | The Sinai access fallback, and Bedouin + |
| SQ-13-02 | The Bush | A monk | The monastery's famous bramble (by tradition, the Burning Bush). A cutting is stolen; find it | `rel_bishoy` +, and Coptic XP |
| SQ-13-03 | The Lost Leaves | Bishoy | In 1975 monks found a sealed room of forgotten manuscripts, including Codex Sinaiticus leaves (real). Help Bishoy catalogue a box never studied | Greek and Coptic XP, and a Petamun letter (collectible) |
| SQ-13-04 | Mountain Gardens | A Jebeliya gardener | The Jebeliya's hidden high orchards (real). Carry water and fix a stone channel | Food supply, and Bedouin + |
| SQ-13-05 | The Valley of Inscriptions | A tour guide | **Wadi Mukattab**'s rock graffiti in many scripts (real). Photograph ten | Collectibles, and Hieroglyphs XP |
| SQ-13-06 | Turquoise | A Bedouin miner | Modern turquoise mining (real, small-scale). Mine and sell a stone | Money, and a gift for your romance partner |
| SQ-13-07 | Bishoy's Laboratory | Bishoy | He was a chemist. Test the Codex's ink with him: the ink dates it, and the grounded story is proved | Excavation XP, and one line in the Discovery epilogue |

## JOBS
- Mountain guiding (the night climb)
- Turquoise mining
- Orchard work
- Photography

## SECRETS
- **The charnel house** (real monastery ossuary): a Keeper shrine tile, #11
- **Serabit's sealed mine:** an Egyptian mining expedition's lamp and tools (Major)
- **Mount Sinai's chapel of Elijah:** a Petamun letter collectible

## DAY / NIGHT
- The night climb starts at 2 am.
- The monastery is open to visitors only in the morning.
- Serabit is hot and exposed by day, and freezing by night.
