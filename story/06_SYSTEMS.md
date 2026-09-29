# GAME SYSTEMS (the ones that shape the story)

---

## 1. SKILLS & XP

You earn XP by *doing*: every action trains its skill, like Skyrim, plus quest rewards.
Each skill runs from level 0 to 5. Skills open dialogue options, shortcuts, areas and
cheaper prices.

| Skill | Trained by | What it opens |
|---|---|---|
| **Excavation** | Digging, sieving, detector finds | Better finds, spotting fakes, reading dig stratigraphy (puzzle hints) |
| **Hieroglyphs** | Reading inscriptions, lessons from Amira, puzzles | Codex cipher marks, House puzzles, tomb texts become readable |
| **Greek** | Lessons from Bishoy or Wassef, reading scrolls | The Codex index, Alexandria texts |
| **Coptic** | Lessons from Bishoy, monastery work | Petamun's notes, Ch13 monastery library |
| **Egyptian Arabic** | Talking, jobs, lessons, living in Cairo | NPC lines, signs, fair prices, rumors |
| **Arabic reading** | Signs, newspapers, lessons | Maps, documents, police files |
| **Nubian** (Nobiin) | Nour, Ustaz Karam, Nubian jobs | Nour's boat, Ch12 access, Hajja Fatma's stories |
| **Siwi** | Sheikh Yahya | Hearing the Word of Amun cleanly (Ch7) |
| **Bedouin dialect** | Salem, Aisha, desert jobs | Desert guides, well locations, Cambyses clues |
| **Stealth** | Sneaking, night entries | Quieter movement, and at 4+ you reach Vasse first (Usurper counter) |
| **Lockpicking** | Locks | Doors, cases, cars, handcuffs (jail escape) |
| **Climbing** | Climbing routes, date harvests | Shortcuts, hidden ledges in tombs and cliffs |
| **Diving** | Dives | Longer air, deeper wrecks (Ch3, Ch11, Ch12) |
| **Haggling** | Buying, selling, bribing | Prices, bribe success |
| **Driving / Riding / Sailing** | Using vehicles | Chases, races, fares |
| **First aid** | Treating yourself or others | Fewer hospital visits, saving NPCs in scenes |
| **Photography** | Photos | Evidence (the Radwan proof), commissions |
| **Desert survival** | Desert travel | Water lasts longer, sandstorm survival |

**Background head start:** see `01_CHARACTERS.md`.

---

## 2. RELATIONSHIPS

- `rel_<name>` runs -100..100, in the tiers from `01_CHARACTERS.md`.
- **Visible?** No numbers are ever shown. The phone's contact list shows a one-word mood
  (Hostile, Cold, Neutral, Warm, Trusted, Bonded), plus the choice notices if that setting
  is on.
- **Gifts:** each major character has one loved gift type. For example: Amira (old books),
  Youssef (football shirts of Al Ahly), Lena (good coffee), Nour (music cassettes), Bishoy
  (chemistry curiosities).
- **Time together:** allies you bring on jobs and missions gain +1 per mission, and
  comment on what you do.
- **Ally texts:** allies text you on the phone. Answering quickly is a small affinity
  boost, and ignoring texts has a small cost.

---

## 3. LANGUAGES (progression gates)

- **Unlearned speech** appears in its own script (Arabic, or Latin-letter Nobiin shown
  garbled) with no subtitle. At level 1 you see keywords, at level 2 simple lines, and at
  level 3 or more everything.
- **Signs, menus, maps and documents** follow the reading skills.
- **Hard gates** (you *must* learn something, with alternatives listed):

| Gate | Requirement | Alternative |
|---|---|---|
| The Codex index (Ch2–3) | Greek 1 (Bishoy's first lessons) | Pay Wassef to read it (slower, 12,000 EGP), or Foundation scholars (Vasse gets a copy) |
| Petamun's notes (for House 3 onward) | Coptic 1 | Bishoy reads them aloud if `rel_bishoy` ≥ Warm |
| House puzzles | Hieroglyphs 1–4, rising per House | An ally (Amira) solves one step. Brute-force solutions exist but trigger traps |
| Nour's boat past the First Cataract (Ch11) | Nubian 1 | None, **by design** (your example). A 1–2 hour learning loop: lessons, jobs with Nubian speakers, songs at the guesthouse |
| The Philae dive (Ch11) | Nubian 2 + `rel_nour` ≥ 20 | The hard fallback: a Gebali smuggler's boat at night, with no guide and more hazards |
| The Word of Amun (Ch7) | Siwi 1 | A longer sound puzzle |
| Desert guides (Ch6) | Bedouin 1 | Pay double |
| Ch13 monastery library | Coptic 3 | Bishoy (if he's with you) |

- **Learning loop:** lessons (paid, one step each), immersion (each conversation or job in
  that language gives XP), reading (books from shops), and songs and stories (fun,
  optional). Expect 30–60 minutes of play per language level early on, and more later.

---

## 4. DAY & NIGHT

- A full in-game day is about **48 real minutes**, and it runs everywhere.
- **Schedules:** every named NPC has a daily routine (home, work, café, prayer times). Shops
  close in the heat of the day (1–4 pm) in small towns and open late in cities. Markets
  are busiest after sunset.
- **Night-only content:** heists, tomb entries (fewer guards), Keeper meetings, some echo
  quests (opened track), smuggling, felucca night sails, and romance scenes.
- **Day-only content:** permits, Ministry offices, most tutors, digs.
- **Calls to prayer** mark time audibly in towns. Some NPCs are unavailable during Friday
  noon prayers.
- **Missed appointments** don't fail quests. The NPC moves on and you find them elsewhere,
  sometimes in a worse mood (-5).

---

## 5. THE PHONE (modern-day UI)

- **Map** (regions, unlocked places, pins), **Messages** (ally texts, quest-givers, the
  anonymous tips that start side quests), **Contacts** (mood per character), **Bank**
  (money, debts, passive income), **Camera** (photos are evidence and job deliverables),
  **Notes** (the quest log), and **Codex** (pages you can read).
- Signal is poor in the desert and underground (no calls, no map updates).
- **It can be taken from you** (robbed, arrested). You lose map pins and messages until
  it's recovered or replaced (a cheap phone costs 4,000 and doesn't have old messages).

---

## 6. POLICE HEAT (0–5)

| Heat | Effect |
|---|---|
| 0 | Clean |
| 1 | Police remember your face. Checkpoints ask questions |
| 2 | Checkpoints search you, and illegal finds get confiscated |
| 3 | Patrols try to arrest you on sight in the city where you're hot |
| 4 | Raids on your home base. Your bank account is frozen (bail becomes impossible without a lawyer) |
| 5 | A nationwide warrant: airports and trains are closed to you. Keeper shrines and smuggler routes still work |

- **Raised by:** illegal sales, break-ins seen by witnesses, running checkpoints, fights in
  public, and Vasse framing you.
- **Lowered by:** time (one level per two in-game days if you lie low), lawyers, bribes,
  Ministry favors, Radwan (honest), and the Vasse Foundation "handling it."

---

## 7. FAILURE STATES (instead of game over)

Most failures **branch the story** instead of reloading. Only a few kill you.

| Failure | Happens when | What it costs | How you get out |
|---|---|---|---|
| **Death** | A fall, drowning, a lost fight, a trap | You respawn at the last checkpoint, and lose 10% of your cash (capped at 20,000) | — |
| **Knocked out** | A lost fistfight, a mugging, a trap in a House | You wake somewhere else: an alley, a cell, a Bedouin tent. You may lose items | Depends on where you wake |
| **Robbed / pickpocketed** | Crowds, low Gebali rep, walking alone at night with cash | Cash and one random item (maybe your phone) | A recovery side quest: track the thief (Karim's crews have fences you can buy it back from) |
| **Mugged** | Dark alleys, heat and Gebali Cold | Cash, and injury | Fight, run, or pay. A later chance at payback |
| **Scammed** | Buying "antiquities," fake guides, fake tickets | Money | Spot fakes with Appraisal. Hunting the scammer is a side quest (a fun con-man chase) |
| **Arrested** | Heat 3+, caught in a break-in, a failed bribe | Items confiscated, and time passes | **Jail** (Cairo, Alexandria, Luxor, Aswan): pay bail, call Nabil the lawyer, an ally bails you out (Youssef, Amira, Hagg Mahmoud, depending on relationships), **break out** (a Lockpicking and stealth sequence, heat +2), or serve time (1–3 in-game days: appointments missed, NPCs react) |
| **Injured** | A fall, a fight, an accident | Hospital bill, and slowed movement until treated | Hospital, clinic, Bedouin healer (free at Warm), monastery infirmary (Sinai), Dr. Sherif's discount |
| **Food poisoning / heatstroke** | Street food with a low stomach, the desert at noon without water | Blurred vision, slower, can't sprint | A pharmacy (cheap), rest, or hibiscus tea from a friendly NPC |
| **Kidnapped** | Heat from Vasse or the Gebali, a failed night mission | Held for ransom | Pay the ransom, **escape** (a stealth sequence), or **get rescued**: the ally with the highest affinity comes for you, and who it is shows your relationships. No ally ≥ Warm means you escape alone |
| **Stranded in the desert** | Out of water or fuel, a vehicle breakdown, a sandstorm | Gear lost | Bedouin rescue (rep ≥ Neutral). Otherwise a survival walk-out sequence to a well |
| **Lost underground** | A cave-in, a fall in a tomb | You're trapped on a lower level | You must find another way out, and it often leads to a secret room. Never a dead end |
| **Vehicle stolen / boat sunk / horse bolted** | Parking in bad areas, storms, racing | The vehicle | Track it down (a side quest), or insurance (a paid option in Cairo) |
| **Gear confiscated** | A checkpoint search at heat 2 | Illegal items and tools | Buy them back from the police impound (a bribe), or steal them back (a heist) |
| **Visa trouble** (foreign backgrounds) | Heat 4 or 5, or a Ch10 framing by Vasse or corrupt Radwan | Can't use airports or trains | Forged papers (Gebali), Amira's letter (Ministry Trusted), or hide it out |
| **Blackmailed** | Someone photographs an illegal act (a Journalist rival, a Vasse PI) | A weekly payment demand | Pay, do their job, steal the photos back, or expose them first |
| **Debt collectors** | Unpaid loans (Madame Samira, the Fixer's Bassem) | Harassment and beatings | Pay, negotiate (Haggling), or turn them in |
| **An ally takes the fall** | A failed mission with an ally present | The ally is arrested or injured **instead of you** | A rescue or bail quest. Leaving them costs heavy affinity (this is how Youssef can end up `jailed`) |
| **Exposed in the press** | Journalist rival (Journalist background) or a Vasse smear | Faction rep hit | Counter-story (Journalist), a lawyer, or ride it out |
| **Missed appointment** | Being late | The NPC's mood and position | Find them elsewhere (never a quest failure) |

**Checkpoints (saves)** happen at the start of every mission step, at home bases, Keeper
shrines, Bedouin camps, safehouses and hotel rooms. **Death respawns at the last
checkpoint. The other failure states continue the story from where they happen.**

---

## 8. STEALTH & LIGHT COMBAT

- **Most conflict is stealth:** avoid, distract (thrown stones, phones, noise), hide (crowds,
  reeds, shadows, market stalls), and take down quietly (chokehold, tranquilizer).
- **Combat is rare and short:** fists, improvised objects, a tranquilizer pistol, and
  flashbangs from the armory. Lethal guns belong to enemies. **The player never needs to
  kill anyone**, and killing is only possible in a few scripted moments, with
  consequences (Lena's affinity, heat, the Keepers' view of you).
- **Chases:** on foot (rooftops in Cairo), by car (Youssef), on horseback (Luxor), and by
  boat (the River).

---

## 9. ALLIES IN BIG MISSIONS

For heists, big fights and set pieces, you choose **one** ally from those available:

| Ally | Role | Bonus |
|---|---|---|
| Youssef | Driver | Guaranteed getaway, and he picks you up anywhere |
| Amira | Scholar | Solves one puzzle step, and talks police down |
| Lena (after she defects) | Soldier | Wins fights, quieter takedowns |
| Nour | Boats and diving | Water routes, double air |
| Miriam (from Ch8) | Archaeologist | Finds hidden doors, reads the Book's warning lines |
| Ibrahim (apprentice) | Thief | Pickpockets keys, crawls through small gaps. **Risky:** loud failures endanger him |
| Aisha | Desert guide | Navigation, well-finding |
| Hagg Mahmoud's men (Gebali Sworn) | Muscle | Only in Ch9 and Ch14 |

**Ch14:** the allies you've equipped (bought gear for) are more likely to survive the final
assault (see that region file).

---

## 10. FOOD & WATER (light, never a chore)

- There are two small meters, **Hunger** and **Thirst**. They drop slowly and only matter
  in the desert (about 3× as fast), heat and long tombs.
- **Free sources everywhere:** wells, public water jars (the *zir* outside homes and
  mosques), fruit trees (dates, mango, guava), Bedouin and Nubian hospitality, and your
  home base.
- **At 0:** you're slower and can't sprint, and your screen blurs. There's never instant
  death, but the desert can lead to "Stranded."

---

## 11. THE BOOK'S PULL (opened track only; replaces the old sanity system)

- A hidden value, `book_pull`, runs 0–100. It rises when you:
  - read Book lines,
  - use your animal and echo senses,
  - spend nights in tombs,
  - and as time passes after the Book is opened.
- **It's not a health bar.** It changes the *world*:

| `book_pull` | What changes |
|---|---|
| 20 | Animals speak to you in subtitles |
| 40 | The echoes of the dead appear in tombs (and give quests) |
| 60 | Paintings move at the edges of your vision. Hidden doors show |
| 80 | NPCs sometimes answer things you didn't say. The Claimed is weaker |

- **Lowered by:** time with the Claimed, prayer or rest at a church or mosque, Sitt Meret's
  help. **It never goes to 0 again.**
- **Before Big Choice 2** (and on the sealed track) the same effects appear only as
  deniable hints, a tiny handful, all explainable (§ `00_MASTER_BIBLE.md` §6).

---

## 12. PUZZLES

- **Difficulty is between light and heavy.** Every House has one major puzzle chain (3–5
  steps), plus optional puzzle rooms guarding the best loot.
- **Puzzle types:**
  - Hieroglyph ciphers
  - Star alignment (a bronze disk)
  - Water-level rooms (the Labyrinth)
  - Sound (the Word of Amun)
  - Mirrors and light (Philae)
  - The alphabet lock (Sinai)
  - The final seven-key door (Giza)
- **Hints:** Amira and Miriam give hints, and Hieroglyphs skill adds on-screen hints.
  There's a setting for puzzle hint strength.

---

## 13. COLLECTIBLES (every region)

- **Sherds with stories:** each one is a readable piece of real history.
- **Petamun's scattered letters:** optional notes that deepen the Codex story.
- **Photographs:** a Cairo-to-Aswan photo album, which is a trophy-room wall.
- **Message pigeons:** Cairo rooftop race-pigeon collection (fun).
- **Keeper shrine tiles** (unlock shrine travel sooner).
- **Region-specific:** the Alexandria coins, the Siwa lamps and the Nubian wall paintings
  (photos).
