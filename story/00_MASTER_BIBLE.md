# THE CODEX OF GIZA — MASTER STORY BIBLE

**Status: authoritative.** This replaces the old `MASTER_LORE_BIBLE.md` and `NEW_CHARACTERS.md`.
Every other file in `story/` hangs off this one. If a region file needs a fact that isn't
here, add it here first and then reference it.

| File | What it holds |
|---|---|
| `00_MASTER_BIBLE.md` | Premise, real history, the Codex, the Book, the timeline, tone, writing rules |
| `01_CHARACTERS.md` | Every named character: voice, agenda, arc, relationship hooks |
| `02_FACTIONS.md` | The six factions, reputation tiers, what each unlocks and locks |
| `03_CHOICES_AND_FLAGS.md` | The master map: every big choice, key small choices, flags and consequences |
| `04_ENDINGS.md` | 7 endings and their variations, and exactly what decides each |
| `05_ECONOMY.md` | Money, prices per region, jobs, shops, property, selling finds |
| `06_SYSTEMS.md` | Skills, languages, failure states, day/night, food and water, the phone, the Book's pull |
| `07_ASSETS.md` | Downloaded 3D models: where each goes, budgets, and the per-chapter wishlist |
| `regions/*.md` | One file per chapter: beats, places, NPCs, side quests, jobs, secrets |
| `SIDE_QUESTS_INDEX.md` | Every side quest in the game in one table |

---

## 1. THE GAME IN ONE BREATH

A modern-day open-world adventure across Egypt, in 14 regional chapters. The player chooses
a name, gender and one of four backgrounds, and gets pulled into the hunt for **the Codex**:
a 1,600-year-old book that is the only key to the scrolls saved from the Library of
Alexandria. Choices matter at three levels:

1. **Big choices (3).** They change the road the story takes and, from mid-game on, which
   endings are possible.
2. **Relationship choices (hundreds).** They change who helps you, who's waiting at the
   end, and which doors, shops, safehouses and quests are open to you.
3. **Local choices.** They change a region and its people: a shopkeeper who remembers you,
   a village that thrives or empties, a kid who ends up in school or in a gang.

**Target length:** 20–30 hours of main story, plus 30–60 hours of side content.
**Feel:** mostly a grounded archaeology thriller (Uncharted, Indiana Jones). If the player
chooses, it turns into a slow-burn supernatural horror (House of Ashes). The open world and
economy play like GTA V: main missions, side missions, jobs, property and money pressure.

---

## 2. THE PREMISE

In the present day, **Dr. Miriam Hale**, a British-Egyptian archaeologist, is running a
restoration survey in the **Osiris Shaft** beneath the Giza causeway. In a sealed niche on
the lowest level she finds a storage jar, and in it a leather-bound book of papyrus leaves:
**the Codex**.

She reads enough of it to understand what it is, and enough to be frightened. Within a
week she's gone. Her camp is quiet and her phone is dead. Four very different people are
each, in their own way, left holding her trail. The player is one of them.

---

## 3. THE REAL HISTORY (fiction is layered on top)

**Rule:** real history is presented accurately. Fiction fills the gaps history left open
(lost things, unexplained things), and never contradicts a well-known fact. Real
archaeologists and living people are **never** named as characters. Real historical
figures from before 1950 can be referenced.

| Date | Real event | Fiction layered on it |
|---|---|---|
| c. 1250 BC | **Prince Khaemwaset**, son of Ramesses II, restores ancient monuments. Later called "the first Egyptologist." | The priests believed he really did find the Book of Thoth. |
| c. 300–100 BC (tales written down in Ptolemaic times) | **The Setne Khamwas tales** (Demotic papyri). Prince Setne (Khaemwaset) steals the Book of Thoth from the tomb of **Naneferkaptah** at Memphis. In the tale the Book's first finder lost his wife and son to the river. Setne is punished and returns the Book. | The game's supernatural rule comes straight from this: **the Book takes from the people closest to its reader.** |
| — | **Hermopolis (Khemenu)** was Thoth's cult city. Its necropolis, **Tuna el-Gebel**, has underground galleries holding millions of mummified ibises and baboons, and the tomb of **Petosiris**, high priest of Thoth. | After Setne returned it, the priests of Thoth kept the Book sealed at Hermopolis for over a thousand years. |
| 331 BC | **Alexander the Great** visits the **Oracle of Amun at Siwa** and is hailed as son of Amun. | Petamun hid one of the Codex keys at the Oracle temple. |
| 323 BC → | Alexander dies. His body is taken to Egypt and buried at Memphis, then in Alexandria (the **Soma**). The tomb has been lost since late antiquity. | Optional side-quest chain: the player can find it (§ Siwa). |
| c. 246 BC | Ptolemy III builds the **Serapeum** of Alexandria, which houses the "daughter library." | Where the Book ends up by the 3rd century AD. |
| 272 AD | Emperor Aurelian's war wrecks the Brucheion palace quarter, and much of the great Library is likely lost. | The Hermopolis priests move the Book to the Serapeum for safety (a mistake). |
| **391 AD** | Bishop Theophilus's followers **destroy the Serapeum**. | **The night the Codex story begins.** The priest-librarian **Petamun** gets about 600 scrolls and one sealed box out through the underground galleries. |
| **24 Aug 394 AD** | The **last known hieroglyphic inscription** is carved at Philae (the *Graffito of Esmet-Akhom*). | (Fiction:) Esmet-Akhom was one of Petamun's circle. Cut into the stone beside his inscription is a cipher mark, and it's the key to House 6. |
| c. 395 AD | — | Petamun seals the Codex in the Osiris Shaft at Giza, near the entrance to the final House, and founds **the Keepers of the House of Life**. |
| 1799–1822 | The French expedition, the Rosetta Stone, and Champollion's decipherment. | The Keepers watch Europeans learn to read what they had kept secret. |
| 1871–1881 | The **Abd el-Rassul** family of Qurna secretly sells objects from the **Deir el-Bahari royal cache** for a decade before it's exposed. | (Fiction:) a second Qurna family, the **Gebali**, found the outer rooms of House 5 in the 1890s. They made a pact with the Keepers: *take the gold, never open the inner door.* |
| 1904–05 | Flinders Petrie excavates **Serabit el-Khadim** (Sinai), home of the **Proto-Sinaitic** inscriptions, the earliest alphabet. | Petamun built the last lock around those first letters. The Gebali family owns a stolen 1905 paper squeeze (a copy) of the key inscription. |
| 1939 | Pierre Montet finds the intact royal tombs of **Tanis**. | House 2 lies deeper, under Tanis's sacred lake. |
| 1960s–70s | The **Aswan High Dam**. Lake Nasser drowns Nubia, and some 50,000 Nubians are moved. Abu Simbel and **Philae** are cut up and rebuilt on higher ground, and the original Philae island is left underwater. | House 6 is on the **drowned original Philae island**. House 6b is in a drowned Nubian village temple. |
| 1999 | The **Osiris Shaft** at Giza is excavated and opened. | Its lowest level holds a niche no one found, until Miriam. |
| 2020s | The modern antiquities-trafficking trade moves through freeports and "cultural foundations." | Conrad Vasse's operation. |

---

## 4. PETAMUN AND THE SEVEN HOUSES

**Petamun, called Philon** (fiction) was an Egyptian priest and librarian of the Serapeum.
He was trained in Greek and could read hieroglyphs, a skill almost nobody alive still had.

On the night the Serapeum fell, he took about **600 scrolls** and **one sealed cedar box**
out through the temple's underground galleries. Over the next four years, with a handful
of priests from Hermopolis and Philae, he hid them in **seven Houses**. Each House holds
part of the scrolls **and the key to the next House**. He did it that way so that no single
find could give away the whole collection, and so that anyone who reached the end would
have had to *earn* it, and understand it, by then.

| House | Where | Region | What's there | Key to the next |
|---|---|---|---|---|
| 1 | Beneath the Serapeum's foundations, with the second half in the sunken royal harbor | Ch3 Alexandria | 40 scrolls (lost plays), and Petamun's first letter | A bronze disk engraved with a star map (points to Tanis) |
| 2 | Under the sacred lake of Tanis | Ch4 Delta | 70 scrolls (lost histories, including Manetho's complete *Aegyptiaca*) | A cipher grid (points to Hawara) |
| 3 | Inside the Labyrinth of Hawara | Ch5 Faiyum | 110 scrolls (mathematics and astronomy) | A statement that the next door "opens to the Word of Amun" |
| — | *The Word of Amun*, a spoken key cut in the Oracle temple | Ch7 Siwa (missable; fallback in Ch6 Bahariya) | Alexander's trail (optional) | The phrase that opens House 4 |
| 4 | The ibis galleries of Tuna el-Gebel, beside the tomb of Petosiris | Ch8 Hermopolis | 90 scrolls (medicine), and the first line of the Book, carved as a warning | The name of the Qurna tomb |
| 5 | A hidden tomb in the Theban hills, on Gebali land | Ch9 Luxor | 120 scrolls (geography and maps of the ancient world), **and the sealed box: the Book of Thoth** | Directions to Philae's drowned island |
| 6 | The **drowned original Philae island** | Ch11 Aswan | 80 scrolls (the Philae priests' own records) | Half of the final lock |
| 6b | A drowned Nubian village temple in Lake Nasser (optional) | Ch12 Lake Nasser (missable) | 60 scrolls (Nubian history and Kushite royal annals) | Improves several ending variations |
| — | *The First Letters* (Proto-Sinaitic inscription) | Ch13 Sinai (missable; fallback via the Gebali squeeze in Luxor) | — | The other half of the final lock |
| 7 | Beneath Giza, past the Osiris Shaft | Ch14 | **The Lesser Library** (the rest of the collection), and Petamun himself, mummified at his post | — |

**Why the Codex was at Giza:** Petamun sealed the index at the doorstep of the final House
on purpose. Whoever started the journey would have to come back to where it began.

---

## 5. THE CODEX (the object)

- It's a single-quire papyrus codex in a leather cover with a wrap-around flap, like the
  real **Nag Hammadi codices** (found 1945). It has 48 leaves.
- **Languages:** the index is in **Greek**, Petamun's private notes are in **Coptic**, and
  the House locations are hidden under **hieroglyphic cipher marks**.
- The player reads it bit by bit as their **Greek, Coptic and Hieroglyph** skills grow
  (§ `06_SYSTEMS.md`). Each new level makes more pages readable. Pages are journal
  entries in the in-game Codex viewer.
- It is **not magic**. On the grounded track it's a book. On the supernatural track, after
  the Book is opened, its margins show marks that weren't there before. The Codex itself
  never does anything.

---

## 6. THE BOOK OF THOTH

- It's a sealed cedar box, bound in bronze bands, and inside it a papyrus scroll written
  in a script that is *almost* hieroglyphic.
- **What the legend says it does** (from the real Setne tale): the first spell lets the
  reader understand the speech of birds and beasts and enchant the heavens, earth and
  sea. The second lets the reader see the gods, and grants life in death.
- **The cost, also from the legend:** Naneferkaptah's wife and son drowned. Setne was
  tormented until he gave it back. **The Book takes from the people closest to whoever
  reads it.**

### Is it real? — The two tracks

| | **Sealed track** (the Book never opened) | **Opened track** (the player opens the Book at Big Choice 2) |
|---|---|---|
| Genre | Grounded thriller | Thriller turning into supernatural horror |
| Strange events | Always deniable: heat, exhaustion, carbon monoxide in tombs, grief, coincidence | Undeniable. The game stops explaining them away |
| New content | — | You understand animals (ibises, cats, dogs, the hawks of Philae). The dead speak in tombs and give **"echo" quests**. New hidden areas appear, and the Book's pull affects what you see (§ `06_SYSTEMS.md`) |
| The cost | — | Your **closest bond** (highest-affinity ally) is **Claimed**. In Act III you must find a way to save them, or lose them |
| Endings | Discovery, Sale, Burial | Scribe, Return, Fire |

Early foreshadowing (before Big Choice 2) must **always be deniable**. For example:
- An ibis that watches too long.
- A radio that picks up something like chanting.
- Miriam talking to birds.

This rule matters. A player who never opens the Book should finish believing it was
probably just a very old scroll.

---

## 7. THE PRESENT-DAY SITUATION (what's already in motion at the start)

- **Conrad Vasse** (Swiss billionaire collector, 71) has a secret terminal diagnosis.
  **Why he wants the Book:** the second spell promises life in death. **What he says in
  public:** his foundation will "rescue" the Library from Egyptian bureaucracy. His
  foundation part-funded Miriam's survey, which is how he heard about the Codex within
  hours.
- **The Keepers of the House of Life**, led by **Sitt Meret**, have watched the Osiris
  Shaft for 1,600 years. Miriam's find is their worst nightmare. **They took Miriam**, to
  protect her or to silence her. Even they aren't sure which.
- **The Gebali network**, Cairo's biggest antiquities-smuggling family, sees the find of
  the millennium and a threat to its 130-year pact with the Keepers.
- **The Ministry of Tourism and Antiquities** doesn't officially know the Codex exists.
  Miriam's friend **Dr. Amira Sayed** suspects.
- **Colonel Khaled Radwan** of the Tourist and Antiquities Police is in Vasse's pocket
  through his son's gambling debt. Whether he stays there depends on the player.

---

## 8. STORY SPINE (three acts, 14 chapters)

Full beats are in each `regions/` file. Big choices are in `03_CHOICES_AND_FLAGS.md`.

**ACT I — THE CODEX** (about 7–9 hours of main story)
1. **Opening** (one of four, by background). The Codex reaches you, someone tries to take
   it, and you leave for Cairo. There's a three-way exit choice.
2. **Cairo.** All paths converge at the Café El-Fishawy, where Miriam had an appointment.
   Every faction arrives, Ibrahim steals your bag, and you learn the Codex is a map.
3. **Alexandria.** House 1, the Serapeum and the sunken harbor. You prove the Codex is real.
4. **The Delta.** House 2, Tanis. Everyone corners you. **BIG CHOICE 1: whose side are you on?**

**ACT II — THE ROAD SOUTH** (about 8–11 hours)
5. **The Faiyum.** House 3, the Labyrinth of Hawara. The Keepers make first contact.
6. **The Western Desert.** Miriam's trail, a sandstorm, and the Bedouin.
7. **Siwa** (missable). The Word of Amun, and optionally Alexander's tomb.
8. **Hermopolis.** House 4. You find **Miriam**, and learn what's in the sealed box.
9. **Luxor.** House 5 and the Book. **BIG CHOICE 2: open it or not.**

**ACT III — THE LAST PRIESTS** (about 7–10 hours)
10. **The River.** South by boat, Coptos, and Vasse strikes.
11. **Aswan and Philae.** House 6, the drowned island. Learning Nubian gets you Nour's boat.
12. **Lake Nasser and Abu Simbel** (missable). House 6b and the drowned villages.
13. **Sinai** (missable). The First Letters. Every thread converges. Lena chooses.
14. **Beneath Giza.** House 7, the Lesser Library, Vasse. **BIG CHOICE 3.**

---

## 9. TONE

- **Base tone:** adventurous, warm, funny in the quiet moments, tense in the big ones.
  People joke in Egypt, and the game should too.
- **The horror** (opened track) is slow, intimate and personal. It's never jump-scare
  spam. It's about losing people.
- **Rating:** mature. Violence has weight and death can happen on screen. Strong language
  is allowed but not constant. Themes include grief, greed, colonial looting, poverty and
  displacement. No sexual content beyond romance scenes that cut away.
- **Egypt is not a backdrop.** Egyptians are the experts, the heroes, the villains, the
  comic relief and the conscience, never just guides or set dressing. Cairo is a modern
  megacity with traffic and phones and delivery bikes. It is not "exotic."

---

## 10. WRITING RULES (for everyone writing dialogue or quests)

1. **Everything you can interact with pays off.** No filler interactions. If a trench can
   be dug, something is found in it that matters: a clue, money, a relationship beat, a
   later unlock. (The old story's biggest problem was busywork that led nowhere.)
2. **Stage the world.** Make things *happen* in front of the player: a car pulls up when
   someone warns one will, a guard changes shift at the time the notebook says, the market
   empties before a raid. Tell the player something, then show it happening.
3. **Choices must feel different on the spot, and pay off later.** Every meaningful choice
   gets an immediate reaction (a line, a look, a door closing) and at least one later echo.
4. **The main story can never break.** Every critical item or piece of information has a
   fallback route (harder, costlier, or through a different person). Missed regions,
   dead allies and hostile factions change *how* you progress, never *whether* you can.
5. **Endings don't lock before Act II's end.** Big Choice 2 (Ch9) is the first ending
   lock, and the only obvious one. Later locks are quiet (§ `04_ENDINGS.md`).
6. **The player character speaks.** They're not voiced, but in cinematic conversations
   their chosen line is shown in full as a subtitle. Options are short intents
   ("Lie about the Codex") and the full line plays out. Their personality is whatever the
   player picks. The four backgrounds get their own flavored lines.
7. **Pronouns and gender:** all dialogue uses the player's chosen pronouns (tokens
   `{they}`, `{them}`, `{their}`). All romances are open to every player character.
8. **Arabic in dialogue:** use real Egyptian Arabic for greetings and interjections
   (*yalla*, *khalas*, *inshallah*, *ya basha*, *ma'lesh*), written in Latin letters. When
   the player lacks the language, lines show as untranslated Arabic script until they
   learn it (§ Languages).
9. **Real history, stated accurately.** When an NPC teaches history it must be true. The
   fiction lives in what was lost and what was hidden.
10. **Nobody is purely evil except by choice.** Vasse is dying and afraid. Radwan is
    protecting his son. The Keepers have killed to keep a promise. Only Vasse can end up
    unambiguously monstrous, and only on the opened track.

---

## 11. NAMING AND STYLE

- **Currency:** Egyptian pounds, written **EGP** (NPCs say "pounds" or *geneh*).
- **Places:** use real names with common English spellings (Khan el-Khalili, Tuna el-Gebel,
  Serabit el-Khadim).
- **Flags:** `chNN_short_name` for chapter flags, `bcN_*` for big choices, `rel_<name>` for
  affinity, `rep_<faction>` for reputation (§ `03_CHOICES_AND_FLAGS.md`).
- **Side quests:** `SQ-NN-MM`, meaning chapter NN, quest MM (§ `SIDE_QUESTS_INDEX.md`).
- **Retired from the old story:** Ellis, Sam, Tariq, Iry, the Uarha, the Heart, the Order of
  the Unshut Eye and the Perennial Concern. None of them exist in the new canon.

---

## 12. WHAT THE BUILT GAME KEEPS

- The 3D engine and all the systems already built: the backpack and inventory, the metal
  detector and equipping items, cinematic conversations, the tips system, minigames
  (sieve, tea, darts, seal), ambience and settings.
- **The Giza dig camp** becomes the **Archaeologist's opening** (Ch1-A). It's reworked to
  fit (§ `regions/ch01_opening_archaeologist.md`). Its White Desert chalk formations move
  in spirit to Ch6. The camp area can keep them as "a limestone quarry field" or trade them
  for Giza-appropriate scenery.
- Existing minigames get reused across regions (listed in each region file).
