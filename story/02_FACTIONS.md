# FACTIONS & REPUTATION

There are six factions. Each has a reputation score `rep_<faction>` from -100 to +100,
using the same tiers as affinity:

| Tier | Score range |
|---|---|
| Hostile | ≤ -50 |
| Cold | -49 to -10 |
| Neutral | -9 to 19 |
| Warm | 20 to 49 |
| Trusted | 50 to 79 |
| Sworn | 80 and up |

**Reputation mostly changes the world, not the ending.** It opens and closes places,
prices, safehouses, armories, quests and NPCs. **Only the Ministry vs. Vasse balance feeds
the endings** (who's in the room, and who goes to prison). See `04_ENDINGS.md`.

**Police heat** is a separate 0–5 wanted level (§ `06_SYSTEMS.md` §6). It's not a faction.

---

## 1. THE MINISTRY & THE TOURIST AND ANTIQUITIES POLICE — `rep_ministry`

The Egyptian state: the Ministry of Tourism and Antiquities, and the police unit that
guards sites. Honest people inside a slow, sometimes corruptible system.

| Tier | You get |
|---|---|
| Warm | Official site permits (legal entry to closed sites by day), and the Ministry pays a small reward for reported finds |
| Trusted | Night permits, the **Ministry archive room** in Cairo (research speeds up Codex reading), and police let minor offenses slide (heat decays faster) |
| Sworn | The **police armory** in Cairo (tranquilizer darts, flashbangs, a lockpick gun), a Ministry car, and Amira's full access letter (checkpoints wave you through) |
| Cold | Checkpoints search you (illegal finds get confiscated) |
| Hostile | Permits revoked, an arrest warrant (heat never drops below 2), and Ministry sites guarded at night |

**Raised by:** reporting finds legally, returning stolen artifacts, helping Amira, testifying
(Ch4), exposing Vasse.
**Lowered by:** selling finds illegally, breaking into sites, being arrested, siding with
Vasse or the Gebali at Big Choice 1.

---

## 2. THE GEBALI NETWORK — `rep_gebali`

A 130-year-old smuggling family from Qurna. Cairo street crews under Karim, the Qurna
heartland under Sabah, and Hagg Mahmoud above both. They have a code: family first, never
cheat a partner, and honor the Keepers' pact.

| Tier | You get |
|---|---|
| Warm | The **black market** (fences pay about 70% of Vasse prices; forged permits), and Karim's crews stop robbing you in Cairo |
| Trusted | **Safehouses** in Cairo (Darb al-Ahmar), Luxor (Qurna) and Aswan: no-questions rest and save, and hide from heat. Smuggling jobs open up |
| Sworn | The **Gebali armory** (smoke bombs, a silenced tranquilizer pistol, climbing gear), the Serabit squeeze handed over freely (the Sinai fallback), and Hagg Mahmoud's men as Ch14 backup |
| Cold | Pickpocketing and muggings in Cairo and Luxor double |
| Hostile | **A price on your head:** bounty hunters in cities, and Qurna closed (House 5 needs the hard route, see Ch9) |

**Raised by:** smuggling jobs, selling to Gebali fences, keeping Ibrahim out of trouble
*with* Karim's blessing, respecting the pact.
**Lowered by:** turning finds over to police, getting crew arrested, backing Karim against
Hagg Mahmoud (Hagg Mahmoud's side), backing Hagg Mahmoud against Karim (Karim's side,
tracked as `rep_karim`, a sub-score).

---

## 3. THE VASSE FOUNDATION — `rep_vasse`

A Geneva "cultural heritage" foundation that fronts a private collection supplied through
freeports. It's staffed by lawyers, logistics people and Lena's security contractors.

| Tier | You get |
|---|---|
| Warm | The best prices for finds (100%), and Foundation "research grants" (a weekly stipend of 2,000 EGP) |
| Trusted | The **Foundation villa** in Zamalek (a luxury safehouse with a gear locker), top gear (rebreather, drone, thermal camera), and legal trouble "handled" (heat drops by 2) |
| Sworn | The **yacht** in Alexandria, the **private jet** (fast travel between any unlocked airports from Act III), and Lena's men as escorts |
| Cold | Watchers follow you in cities, and your home base gets searched while you're away |
| Hostile | **Hit squads** join stealth sections, your bank account is frozen once (Ch10, a recovery quest), and you get framed for a crime (heat +2, once per act) |

**Raised by:** siding with Vasse at Big Choice 1, selling to him, completing Foundation jobs.
**Lowered by:** stealing from the Foundation, exposing Vasse, sparing or helping Lena
against orders (this *raises* `rel_lena` while lowering `rep_vasse`).

---

## 4. THE KEEPERS OF THE HOUSE OF LIFE — `rep_keepers`

The hidden heirs of Petamun's circle. They're ordinary people (a potter, a tea-seller, a
retired teacher, a tour guide) spread through Egypt and bound by one promise.

| Tier | You get |
|---|---|
| Warm | **Keeper shrines** (small painted niches in real-world style) act as **fast-travel points** between regions you've visited, and they warn you before ambushes |
| Trusted | **Hidden temple passages:** shortcuts in every House, and traps in the Houses are marked for you |
| Sworn | The Keepers' own knowledge. Codex reading jumps one level. Sitt Meret tells you the full truth (on the opened track, what the Book costs, and how to save the Claimed) |
| Cold | Keepers sabotage you: guides give wrong directions, and one key item goes missing per act (a recovery quest) |
| Hostile | Traps in the Houses are armed harder, and the Keepers try to take the Codex from you in Act II (a stealth defense event) |

**Raised by:** heeding warnings, not selling House finds, protecting Miriam, respecting
sealed doors.
**Lowered by:** selling scrolls, opening the Book (-30 at once), bringing Vasse to a House.

---

## 5. THE BEDOUIN — `rep_bedouin`

The Western Desert clans (Sheikh Salem's Awlad Zeid) and, in Sinai, the **Jebeliya**
(tracked on the same score, since word travels).

| Tier | You get |
|---|---|
| Warm | Desert guides, a camel market (you can buy one), desert wells marked on your map, and **Siwa access** (one of two ways) |
| Trusted | The Great Sand Sea routes, and Bedouin camps as rest and save points. A Jebeliya escort in Sinai (the Sinai fallback) |
| Sworn | Sheikh Salem's poem about you (an epilogue line), a free camel, and desert rescue is always guaranteed |
| Cold | Guides charge double and desert wells are "dry" for you |
| Hostile | No rescue in the desert. The sandstorm in Ch6 becomes a survival sequence with no help |

**Raised by:** respecting hospitality (accept the tea, don't refuse bread), helping Aisha,
returning the Cambyses finds to the clan, not bringing police into the desert.
**Lowered by:** stealing from camps, guiding police or Vasse's men into the desert, the
Ch6 choice to abandon a stranded guide.

---

## 6. THE NUBIAN COMMUNITY — `rep_nubian`

The villages of Aswan and the resettled communities around Lake Nasser.

| Tier | You get |
|---|---|
| Warm | A **Nubian tutor** (Hajja Fatma's neighbor, Ustaz Karam), guesthouses, and cheap food and boats |
| Trusted | Nour's full trust (needed for the Philae dive), and **Lake Nasser access** (the Ch12 gate, together with Nour) |
| Sworn | House 6b's location is given freely, and a Nubian wedding invitation (a side quest, and a big relationship boost) |
| Cold | Prices go to "tourist price" and boats refuse you |
| Hostile | **Nubia is RESTRICTED:** Ch12 is locked, and Ch11's Philae dive needs the hard fallback (see Ch11) |

**Raised by:** learning Nubian, helping the drowned-village memory project (SQ-11-02),
treating Nubian finds with respect.
**Lowered by:** selling any Nubian artifact, disrespecting Hajja Fatma, bringing Vasse's men
to the lake.

---

## 7. HOW FACTIONS CONFLICT

| When you… | Ministry | Gebali | Vasse | Keepers | Bedouin | Nubian |
|---|---|---|---|---|---|---|
| Report a find legally | +5 | -2 | -3 | +2 | 0 | 0 |
| Sell to a Gebali fence | -3 | +4 | -1 | -3 | 0 | 0 (-10 if Nubian find) |
| Sell to Vasse | -5 | -2 | +5 | -4 | 0 | 0 (-10 if Nubian find) |
| **Big Choice 1 = Ministry** | +30 | -20 | -30 | +10 | 0 | 0 |
| **Big Choice 1 = Vasse** | -30 | -10 | +40 | -20 | 0 | 0 |
| **Big Choice 1 = Gebali** | -20 | +40 | -30 | +10 | 0 | 0 |
| **Big Choice 1 = Alone** | -5 | -5 | -20 | +5 | 0 | 0 |
| Open the Book | 0 | 0 | 0 | -30 | 0 | 0 |

**Switching sides later** (possible once, in Ch9 before Big Choice 2) costs the old side
-40 and gives the new side +20. The old side sends one "punishment" event in Ch10.

---

## 8. FACTION INTERIORS (the secret buildings and armories)

| Place | Region | Opens at |
|---|---|---|
| Ministry archive room, Zamalek | Ch2 Cairo | Ministry Trusted |
| Police armory, Abdeen | Ch2 Cairo | Ministry Sworn |
| Gebali warehouse and black market, Darb al-Ahmar | Ch2 Cairo | Gebali Warm |
| Gebali safehouses: Cairo / Qurna / Aswan | Ch2 / Ch9 / Ch11 | Gebali Trusted |
| Gebali armory, Qurna | Ch9 Luxor | Gebali Sworn |
| Foundation villa, Zamalek | Ch2 Cairo | Vasse Trusted |
| Vasse yacht *Theodora*, Eastern Harbour | Ch3 Alexandria | Vasse Sworn (or break in for SQ-03-04) |
| Keeper shrines (fast travel), every region | All | Keepers Warm |
| Keeper hall under a Faiyum potter's workshop | Ch5 | Keepers Trusted |
| Bedouin camps | Ch6, Ch7, Ch13 | Bedouin Warm |
| Nubian guesthouses | Ch11, Ch12 | Nubian Warm |
