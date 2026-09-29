# CH2 — CAIRO

| | |
|---|---|
| Act | I |
| Biome | A megacity: medieval Islamic Cairo, downtown, Coptic Old Cairo, the City of the Dead, the islands, the Nile |
| Size | **Huge.** The main hub of the game |
| Main / side hours | 3 / 8+ |
| Revisit | ↺ Always (train, plane, road, shrines) |
| Home base | **Umm Hassan's rooftop room** (Darb al-Ahmar). Later the **Zamalek flat** (bought) |
| Real places | Khan el-Khalili, **Café El-Fishawy**, Al-Azhar, Bab Zuweila, Darb al-Ahmar, the Egyptian Museum (Tahrir), Coptic Cairo (the Hanging Church, Ben Ezra Synagogue), the City of the Dead, Zamalek, Shubra, Azbakeya book market |

---

## DISTRICTS

| District | Feel | Key places |
|---|---|---|
| **Islamic Cairo** | Medieval lanes, minarets, markets | El-Fishawy, the Khan, Al-Azhar, Bab Zuweila (climbable), **Umm Hassan's rooftop**, the **Gebali house** and warehouse |
| **Downtown** | Belle-époque buildings, traffic, cafés | Tahrir, the Egyptian Museum, Azbakeya books (**Wassef**), **Nabil's law office**, Abdeen **police HQ and jail** |
| **Coptic Cairo** | Walled Roman fortress quarter | The Hanging Church, Ben Ezra, **Bishoy's Library of St. Mercurius** (fiction) |
| **City of the Dead** | Mamluk tombs where families really live | A Keeper shrine, a Mamluk mausoleum secret, a caretaker family |
| **Zamalek** | A leafy island of embassies | The **Vasse Foundation villa**, the Ministry archive room, the Zamalek flat (for sale) |
| **Shubra** | Crowded working-class north | **Youssef's family flat**, the wedding hall, Madame Samira's tawla café |
| **The Nile corniche** | Feluccas, bridges, night lights | Felucca rides, the hospital (Dr. Sherif) |

---

## ARRIVAL (by background and `c1_exit`)
- **Everyone** arrives on a Wednesday night, a day before Miriam's Thursday appointment.
  **Youssef** is the taxi driver at the station or bus stop. He talks, overcharges, and
  then refuses the tip when he sees you're in trouble. He takes you to his friend Umm
  Hassan's rooftop room (rent 1,200/week).
- **`legal`:** Amira meets you Thursday morning at the Ministry. She explains she doesn't
  trust her own building (Radwan's office leaks), so she makes you the Codex's **unofficial
  custodian**: "Keep it. Keep it away from us. Call me." Lena tails you from day one.
- **`deal` (Vasse):** a dinner invitation to the villa arrives on Thursday. **`deal`
  (Gebali):** Karim's boys collect your favor on Friday (the package, see below).
- **`quiet`:** nobody's watching until El-Fishawy.

---

## MAIN BEATS

1. **Settle in** (Wednesday night to Thursday). Umm Hassan's rooftop, the view over the
   minarets, and the call to prayer. Youssef's number is saved in your phone.
   *Teaches: day/night, shops, the tourist price, fast travel by taxi.*
2. **El-Fishawy, Thursday night** (the big staged set piece). Miriam's appointment. You
   meet **Father Bishoy**. The player can spot all the watchers (a perception mini-game,
   optional):
   - Lena's two men at a corner table
   - Karim's scooter boys
   - A plainclothes policeman (Radwan's)
   - An old woman selling tea who is a **Keeper**

   Bishoy says only: *"Not here."*
3. **Ibrahim steals your bag,** with the Codex in it. A **rooftop chase** across the Khan
   (the first big chase). You corner him at Bab Zuweila. Then the choice:
   `ch2_ibrahim` = `police` / `free` / `paid` / `recruited` (see `03_CHOICES_AND_FLAGS.md`
   §7). This starts **SQ-02-02**.
4. **Bishoy's library** (Coptic Cairo, Friday). He reads the Codex's first page with you.
   It's a Greek index of "Houses," and the first is *"the house beneath the Daughter"*
   (the Serapeum was the daughter library). **Greek lessons begin** (the first level is a
   short tutorial).
   - **Who reads the Codex** → `ch2_reader`: Bishoy (free, slow, affinity), Wassef (paid),
     or the Foundation's scholars (fast, but Vasse gets a copy).
5. **The factions come to you** (in any order, over Friday to Sunday). Each is one scene;
   all four happen before you can leave:
   - **Amira** (Ministry): coffee at the Egyptian Museum's garden. She was Miriam's best
     friend. She's angry, scared and brilliant.
   - **Colonel Radwan** (police): you're "invited" to Abdeen police HQ for questions →
     `ch2_radwan_truth`. His son Omar calls him during the interview, and he steps out.
     *(It seeds SQ-02-09.)*
   - **Hagg Mahmoud el-Gebali**: summoned to his house in Darb al-Ahmar. Mint tea,
     prayer beads, and a history lesson about his family and the 1881 royal cache. Then a
     test: **Karim's package**, deliver it across town unopened → `ch2_package`.
   - **Conrad Vasse**: dinner at the Zamalek villa. He's charming, generous, and offers
     250,000 EGP for the Codex, "or simply your friendship." Lena stands at the door.
     Refusing costs nothing yet.
6. **The House 1 key.** With Greek 1 (or a paid reader), the index's first entry becomes
   readable: *"Beneath the Daughter, where Serapis sleeps. Where the lighthouse fell into
   the sea, the other half."* So: **Alexandria**, the Serapeum and the sunken harbor.
   The train station unlocks.

**Leaving:** the train to **Ch3 Alexandria** (250 EGP), or a car. Cairo stays open all game.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome / flags |
|---|---|---|---|---|
| SQ-02-01 | Nefertiti's Engine | Youssef | His Lada breaks down mid-chase. Find parts in the Shubra car market (haggling) | Youssef's **getaway ally** unlocked, `rel_youssef` +10 |
| SQ-02-02 | The Boy from the Khan | Ibrahim | Ibrahim's arc begins: he owes Karim. Help him pay it, get him into school, or use him on jobs | Leads to SQ-03-06 → SQ-09-07. `ibrahim_fate` |
| SQ-02-03 | The Tomb-Dwellers | A caretaker family in the City of the Dead | Their Mamluk tomb-home is being claimed by a developer. Find the family's 1920s deed in the Ministry archive | Keeper shrine revealed (the first fast-travel point), and a family who hide you later |
| SQ-02-04 | Umm Hassan's Nephew | Umm Hassan | Her nephew Hassan was picked up by police for nothing. Get him out (Nabil, a bribe, or Radwan) | `ch2_umm_hassan`: free rent, and she lies for you in Ch10 |
| SQ-02-05 | Youssef's Daughter's Wedding | Youssef | Help plan it (find a band, get a dress back from a crooked tailor), then **attend** (a dance minigame) | `ch2_wedding` ★: the Fahmy family flat becomes a Ch10 hideout. A huge `rel_youssef` gain |
| SQ-02-06 | Pigeons of Darb al-Ahmar | A rooftop pigeon racer | Race your pigeons (collectible pigeons across the game) | A pigeon coop at home, and message pigeons as collectibles |
| SQ-02-07 | Madame Samira's Table | Madame Samira | Win a tawla tournament, then save her café from a loan shark | A café share (4,000/week passive), and the loan system unlocked |
| SQ-02-08 | The Papyrus Factory | A tourist couple | They bought a "genuine ancient papyrus" (banana leaf). Trace the scam ring back to Giza's back streets | Teaches **spotting fakes**. The ring leader becomes a recurring con man |
| SQ-02-09 | Omar's Debt | Omar Radwan | The colonel's son owes a Vasse-owned casino. Pay it, win it back at cards, or expose it to his father | `ch2_omar`: **Radwan conscience +1** (paid or exposed) |
| SQ-02-10 | The Azbakeya Hunt | Wassef | Find a stolen 19th-century Greek grammar across three bookstalls | Greek XP, and Wassef's discount |
| SQ-02-11 | Derby Day | Youssef | Get tickets to Al Ahly vs. Zamalek (scalpers, a rooftop view) | Youssef's loved-gift source, and a day of joy (+10) |
| SQ-02-12 | Bab Zuweila's Top | A minaret keeper | Climb the twin minarets (a climbing tutorial) | Climbing XP, and a view that marks every Cairo side quest on the map |
| SQ-02-13 | Hana's Lab | Hana | Help her date three finds in the Ministry lab | Appraisal perk, and a cheaper Ministry sale price |
| SQ-02-14 | The Night Delivery | Karim | A scooter delivery run through Cairo traffic at night (the delivery job tutorial) | Gebali +, and the delivery job unlocked |

## JOBS
- Taxi fares (with a car)
- Scooter deliveries
- Tea runs
- Tawla hustles
- Guiding tourists at the Khan and the Museum
- Photography
- Mosque restoration volunteering (rep)

## SECRETS & OPTIONAL
- **The Mamluk mausoleum** in the City of the Dead: a sealed crypt with a Rare find and
  one of **Petamun's scattered letters** (copied by a medieval Keeper).
- **The Khan's hidden courtyard:** Keeper shrine tile #1.
- **The Egyptian Museum after hours:** a heist side quest, only with Gebali Trusted (steal
  back a stolen amulet and return it, a good-deed heist).

## DAY / NIGHT
- El-Fishawy is busiest after 10 pm.
- Coptic Cairo opens in the morning.
- The Gebali house receives visitors only after the evening prayer.
- The Khan closes on Sundays.
