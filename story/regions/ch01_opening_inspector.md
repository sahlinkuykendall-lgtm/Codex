# CH1-B — SAQQARA INSPECTORATE (Inspector opening)

| | |
|---|---|
| Act | I (prologue) |
| Background | Inspector only |
| Biome | The Saqqara necropolis on the desert edge, palm groves and villages below, and the Step Pyramid |
| Size | Medium–large: the inspectorate compound, the necropolis, Mit Rahina village (ancient Memphis) |
| Main / side hours | 1.5 / 2 |
| Revisit | No. Saqqara returns only in **The Return** ending |
| Real places | The Step Pyramid of Djoser, the Serapeum of Saqqara (the Apis bull galleries), Mit Rahina's colossus of Ramesses II, the Teti pyramid area |

---

## PREMISE

You're a junior inspector at the Saqqara inspectorate: underpaid, overworked, and good at
noticing things. Five days ago, the day before she disappeared, Dr. Miriam Hale logged an
object into Saqqara's secure evidence store for "safekeeping pending Ministry review": *one
leather codex, Late Antique*. (Why: the inspectorate is the Ministry of Antiquities, a civilian
body, and the review she meant was her friend Dr. Amira Sayed's, in Manuscripts. Her note warns
against the antiquities *police*, who she knew would come to claim it for Vasse, as Colonel
Radwan does in beat 5.) This morning, the log line has been scratched out, and the object is
gone. Your boss, **Director Fathi**, tells you to "file it as a clerical error."

---

## MAIN BEATS

1. **Morning at the inspectorate.** Tea with **Umm Sabry**, who knows everything. She
   tells you **Samy Ragab** stayed late last night. *The tips teach movement, the phone,
   and the notebook.*
2. **The inspection round** (the tutorial for your job). Check three tomb seals on your
   beat. At the third (**the Serapeum galleries**), you find Samy's cigarettes by a
   service door that should be locked. The **seal minigame** is reused: reading seals, and
   spotting a forged one.
3. **Follow Samy.** A daytime tail through Mit Rahina's market (a stealth tutorial). He
   meets a young man in sharp trainers: **Karim el-Gebali**.
4. **The evidence store.** At night, Samy moves the Codex from his locker to the Serapeum
   service room for pickup. The Serapeum galleries at night are a stealth section among
   the huge granite bull sarcophagi. You find the Codex in a cooler bag.
5. **The staged arrival.** Umm Sabry warned that "a black car comes for Fathi on Tuesdays."
   It's Tuesday. Headlights at the gate: **Colonel Radwan** arrives to "collect evidence"
   for Vasse. Fathi hands over an empty box. Nobody knows yet that you have the real
   thing.
6. **Samy's panic.** Samy realizes the Codex is gone and comes looking for it with a torch
   and a knife. It's a tense standoff in the galleries. You can talk him down (he
   confesses everything: Karim paid him, Vasse wanted it, and Karim was going to sell
   it), tranquilize him, or run.
   - **Expose him to Fathi** → `ch1b_samy_exposed` ★: Karim's crews are Cold to you in Ch2.
   - **Let him flee** → Samy becomes a small Ch2 informant (he owes you).
7. **Miriam's note.** Inside the Codex's flap: *"Father Bishoy, El-Fishawy, Thursday. Don't
   trust the police."*

**Inspector-only lore seed:** Umm Sabry tells an old Saqqara story about a tomb "where the
magician's wife and son are painted by the river." It's Naneferkaptah's tomb from the
Setne tale. **For Inspectors this sets `ch10_tomb_known` automatically after Ch9**, which
unlocks The Return without the Coptos quest (`03_CHOICES_AND_FLAGS.md` §6).

**Exit choice** (`c1_exit`):
- **Quiet:** you take the Codex home and vanish on leave.
- **Legal:** you take it straight to the Ministry in Cairo, to Dr. Amira Sayed
  (`rel_amira` +15).
- **Deal:** Samy's contact (Karim) offers 5,000 EGP to "hold it for a week," and you owe
  the Gebali.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-01B-01 | Umm Sabry's Price | Umm Sabry | She trades gossip for gossip. Find out who's romancing the accountant | Umm Sabry's network: tips about Fathi, and a Return-ending cameo |
| SQ-01B-02 | The Camel Men | Village | Unlicensed camel rides are scamming tourists. Fine them, let them go, or organize them | Local rep, and the camel men give you rides later |
| SQ-01B-03 | Rais Gad's Tunnel | Rais Gad | Robbers dug a tunnel into a closed mastaba. Stake it out at night | A good find, Ministry rep, and it introduces the Qurna robbing families |
| SQ-01B-04 | The Colossus | Tourist child | A lost child at Mit Rahina's Ramesses colossus museum. Find the parents | Small reward, and a guiding job unlocked |
| SQ-01B-05 | The Forged Seal | Fathi | Someone forged tomb seals across the site. Compare them (seal minigame) | It's Samy. Evidence for the Radwan conscience track |
| SQ-01B-06 | The Serdab's Eyes | The serdab | Djoser has looked out of his sealed box for 4,650 years. Photograph him through the two eye holes (any time of day: the Inspector's day runs 08:30 Tuesday to 04:40 Wednesday) | Photography XP, and the photo on your phone |
| SQ-01B-07 | The Café's Backgammon | The café champion | An old man at the ahwa has not lost at tawla since the 1990s. Beat him (the tawla minigame; Madame Samira's tawla café in Ch2 reuses it) | A small purse and village rep. It doesn't affect SQ-02-07 |
| SQ-01B-08 | The Well Girls | Two girls at the village well | They've lost the cap of their jerrycan and will be scolded. Find it (it's in the market) | Village rep, and a piece of gossip for Umm Sabry's Price |
| SQ-01B-09 | The Mechanic's Receipt | The mechanic | He knows Samy paid cash for the new motorbike, from Cairo. Get the receipt | Extra proof when you expose Samy in beat 6: it changes what Fathi and Samy say, not the outcome. It is not a Radwan conscience point |

## JOBS
- Seal inspections (a paid shift)
- Guiding tourists (on the Step Pyramid complex)
- Sieving at the Teti excavation

## SECRETS
- The Serapeum's **sealed 26th gallery** (fiction), with a Late Period Thoth statuette (a
  deniable hint) and a Rare find
- Naneferkaptah's tomb **is visible but sealed** in a corner of the necropolis. You can't
  enter, only notice it. Players see it again in The Return

## LEAVING
All exits go to **Ch2 Cairo**. Inspector-unique Ch2 hooks: Fathi calls demanding you come
back. Radwan recognizes your name.
