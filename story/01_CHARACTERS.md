# CHARACTERS

Every named character. Relationship numbers use the affinity system in `06_SYSTEMS.md` §2:
`rel_<name>` runs from -100 to +100, split into these tiers:

| Tier | Affinity range |
|---|---|
| Hostile | ≤ -50 |
| Cold | -49 to -10 |
| Neutral | -9 to 19 |
| Warm | 20 to 49 |
| Trusted | 50 to 79 |
| Bonded | 80 and up |

**Romance** needs Bonded plus the character's romance flag. The romanceable characters are
**Amira, Lena and Nour** (open to every player character).

**Allies** can join you for big fights and heists, one at a time (§ `06_SYSTEMS.md` §9).
Anyone marked *can be Claimed* can be taken by the Book on the opened track.

---

## THE PLAYER CHARACTER

The player chooses a name, gender (pronouns follow it) and background. Personality comes
from dialogue picks.

| Background | Who they are | Starting skills and languages | Starting money and gear | Starting relationships |
|---|---|---|---|---|
| **Archaeologist** | A foreign field archaeologist, 30s. Good at their job, bad at politics. Hired to replace Miriam. | English, Hieroglyphs 2, Excavation 3, French 1 | 8,000 EGP, trowel, notebook, dig permit | Amira +10, Ministry rep +10, Gebali rep -10 |
| **Inspector** | An Egyptian junior antiquities inspector, late 20s. Idealistic, underpaid, noticed something wrong. | Egyptian Arabic (native), Arabic reading (native), Hieroglyphs 2, Investigation 2 | 3,000 EGP, Ministry ID, service phone | Amira +20, Ministry rep +20, Gebali rep -20, Radwan -10 |
| **Fixer** | A smuggler and fixer who works the Red Sea coast, 30s. Egyptian or foreign (player picks). Owes money. | Egyptian Arabic 3 (street), Lockpicking 2, Haggling 3, Diving 1 | 500 EGP, **debt of 60,000 EGP** to Bassem Nassar, lockpicks, a knife | Gebali rep +20, Ministry rep -15, police heat starts at 1 |
| **Journalist** | A foreign investigative reporter, 30s. Stubborn, charming, allergic to being lied to. | English, French 2, Photography 3, Investigation 2 | 12,000 EGP (expense account), camera, press card | Amira 0, Vasse Foundation rep -10, Ministry rep 0 |

If a Fixer is Egyptian, they start with Egyptian Arabic 5 and Arabic reading 2, but no
French and less money. The Fixer's debt drives a money subplot through Act I, and paying it
off is a side-quest chain (§ `regions/ch01_opening_fixer.md`).

---

## MAJOR CAST

### DR. MIRIAM HALE — the missing archaeologist
- **44, British-Egyptian.** Her mother is from Alexandria and her father is a Yorkshire
  engineer. Short grey-streaked hair, burn scar on one hand from a lab fire.
- **Voice:** quick, dry, self-mocking. She talks in half-finished thoughts when excited.
- **What happened:**
  1. She found the Codex and read the index.
  2. She realized Vasse, her funder, would know within days.
  3. She sent the Codex (or its trail) toward the player, depending on the background.
  4. She drove south chasing House 4 alone.
  5. At Hermopolis she read aloud the Book's first line, carved there as a warning.
  6. The Keepers took her.
- **When found (Ch8):** hiding with the Keepers, gaunt and brilliant, sometimes talking to
  ibises. On the sealed track it's trauma, dehydration and obsession. On the opened track
  it's real, and she heard the Book first.
- **Arc:** she's the person the player is chasing for half the game, then a partner who
  may be losing herself. Her flag is `miriam_state`, with these values:
  - `saved`: back with her family and credited.
  - `keeper`: joins the Keepers by choice.
  - `lost`: taken by the Book (opened track only).
  - `dead`: can die in Ch13 if the player fails her rescue quest and has low trust.
- **Not romanceable.** She's an ally from Ch8, and can be Claimed.

### DR. AMIRA SAYED ♥ — the Egyptologist
- **36, Egyptian (Cairo, Heliopolis).** Ministry of Tourism and Antiquities, Department of
  Manuscripts. Miriam's closest friend.
- **Voice:** precise, warm, quick to laugh, and quicker to anger when foreigners assume
  Egypt can't look after its own history. She swears in French when stressed.
- **Agenda:** the Library must belong to Egypt and to the world, not a freeport vault.
  She'll bend rules, but never sell.
- **Arc:** she starts wary of the player (unless Inspector or Archaeologist), becomes the
  scholarly partner who reads hieroglyphs with you, and has to choose between her job and
  you when the Ministry's top brass cave to Vasse (Ch9).
- **Leaves you if:** you sell to Vasse (Big Choice 1 = Vasse and never betray), or you sell
  more than 5 finds illegally after Ch3 while she's Trusted or less.
- **Romance:** Ch5 onward. Her romance flag triggers on the Faiyum lake-night scene.
- **Ally type:** knowledge. She auto-solves one puzzle step per dungeon, and talks you out
  of police trouble. **Can be Claimed.**
- **Ending weight:** she's central to *The Discovery*.

### YOUSSEF "JOE" FAHMY — the taxi driver
- **52, Egyptian (Shubra, Cairo).** Drives a white 1998 Lada he calls **"Nefertiti."**
  Five daughters and a wife, Samah, who terrifies him.
- **Voice:** constant talk, proverbs, bad English he's proud of, sudden seriousness. He
  calls the player *ya basha* or *ya hanem*.
- **Agenda:** get paid, keep his family safe, and secretly be part of something great.
- **Arc:** he starts as a hired driver (Ch2) and becomes the game's heart, the one who
  shows up. He can be arrested because of you (Ch4 or Ch10). His daughter's wedding is a
  side quest (SQ-02-05), and if you attend, the whole family becomes a safe haven in Cairo.
- **Leaves you if:** you get him arrested **and** don't bail him out within two in-game
  days, or you hurt his family's safety twice.
- **Not romanceable** (happily married, and says so loudly).
- **Ally type:** a getaway driver. Chases become escapable and he picks you up anywhere
  in a region. **Can be Claimed.** His loss is the game's most painful, and is written to
  be.

### LENA BRANDT ♥ — Vasse's security chief
- **39, German.** Ex-army (Bundeswehr), then private security. Tall, cropped blond hair,
  a knee that hurts in the cold.
- **Voice:** clipped, dry, very direct. She never threatens twice.
- **Agenda:** do the job, get paid, retire to a lake in Bavaria. She's starting to see
  what Vasse really is.
- **Arc:** a recurring enemy in Acts I and II (she's the one always one step behind or
  ahead). How the player treats her people decides her path: sparing them, not killing,
  and keeping their word. In Ch13 **she chooses**:
  - **defect** (`lena_defected`) if `rel_lena` ≥ 50,
  - **stay neutral** (walk away) if 0–49,
  - **betray you and take the Book to Vasse** if below 0. This is one route to the
    Usurper ending.
- **Romance:** only if she defects. The romance flag triggers in the Ch13 monastery guest
  house.
- **Ally type (after she defects):** combat. Fights are winnable, and stealth kills are
  quieter. **Can be Claimed.** She can die in the Ch14 final assault if unprepared (see
  that file).

### NOUR ABDELRAHIM ♥ — the felucca captain
- **31, Nubian (Gharb Soheil, Aswan).** Runs the felucca *Amanirenas*, named for the
  Kushite queen who fought Rome.
- **Voice:** calm, teasing, speaks Nobiin (Nubian) first, Arabic second, English only to
  people she likes. She sings on the water.
- **Agenda:** to keep her grandmother's drowned village from being forgotten.
- **Language gate:** she won't take you out past the First Cataract until **Nubian ≥ 1**,
  and she won't take you to the drowned island until **Nubian ≥ 2** and `rel_nour` ≥ 20.
- **Arc:** she guides you through Nubia (Ch11–12) and carries the game's quiet grief about
  displacement. She's the key to the missable Lake Nasser chapter.
- **Closes Nubia if:** `rel_nour` ≤ -20, or you sell any Nubian find illegally. Ch12
  becomes RESTRICTED.
- **Romance:** Ch11 onward. The romance flag triggers on the night sail to the drowned
  island.
- **Ally type:** a boat and diving partner. She doubles your air time and can lead you
  around underwater hazards. **Can be Claimed.**

### CONRAD VASSE — the collector (main antagonist)
- **71, Swiss.** Founder of the **Vasse Foundation for Cultural Heritage** in Geneva.
  Silver hair, beautiful suits, the manners of a diplomat. He is **dying of pancreatic
  cancer** (secret until Ch9, or Ch8 if the Journalist finds his medical file).
- **Voice:** soft, generous, persuasive. He quotes Cavafy and pays compliments that feel
  like hooks.
- **Agenda:** the Book's second spell promises life after death. He'll tell everyone the
  Library needs "rescuing." He means himself.
- **Arc:** a generous patron in Act I (offers you money, safety, a job). In Act II he
  becomes a steady pressure (hit squads, bribes, framing you to the police). In Act III
  he's desperate and increasingly cruel.
  - **On the opened track**, if he gets the Book, he reads it (Usurper ending).
  - **On the sealed track**, his fate varies: prison, escape, dead, or your partner
    (Sale ending).
- **Never** personally violent until the very end. Lena and hired men do his violence.

### HAGG MAHMOUD EL-GEBALI — the smuggler patriarch
- **68, Egyptian, from Qurna (Luxor West Bank). Lives in Cairo (Darb al-Ahmar).** Cane,
  prayer beads, a perfectly pressed galabeya. He's made the Hajj three times.
- **Voice:** slow, old-fashioned, proverbs from the Qur'an and his grandmother. Never
  raises his voice.
- **Agenda:** protect the family business, and honor the family's 1890s pact with the
  Keepers (take the gold, never open the inner door).
- **Arc:** a dangerous businessman in Cairo, and then, if trusted, the man who opens
  Qurna and House 5's secrets in Luxor (Ch9). He can be your patron (Big Choice 1 =
  Gebali), a neutral power, or an enemy who puts a price on your head.
- **Key item:** the family owns the stolen 1905 Serabit squeeze, which is the Sinai
  fallback key.
- **Not an ally in fights.** He sends men instead.

### KARIM EL-GEBALI — the grandson
- **27.** Runs the family's Cairo street crews: pickpockets, fences, scooter couriers.
  Sharp trainers, sharper temper.
- **Agenda:** to modernize the family business (sell to Vasse, forget the pact).
- **Arc:** a foil to his grandfather. If the player backs Karim over Hagg Mahmoud (Ch2 or
  Ch9 choices), the Gebali network turns toward Vasse. He's Ibrahim's boss.
- **Can die** in Ch9 (Qurna raid) depending on choices.

### COLONEL KHALED RADWAN — the police colonel
- **55, Egyptian.** Tourist and Antiquities Police, Cairo. Tired eyes, pressed uniform,
  chain-smoker.
- **Agenda:** he's paying off his son **Omar's** gambling debts, which Vasse bought.
  He hates himself for it.
- **Arc:** the player decides him. His flag `radwan_path` is `corrupt` or `honest`, and it
  locks at Ch10. Radwan turns **honest** with **two or more conscience points**. Each of
  these is worth one:
  1. SQ-02-09: Omar's debt paid, or exposed to his father.
  2. Telling him the truth in the Ch2 interview (`ch2_radwan_truth`).
  3. Showing him proof of Vasse's crimes before Ch10. The proof can be Lindqvist's papers
     (SQ-01A-03), Magdy's photos (`ch1d_magdy_paid`), the Theodora records (SQ-03-04), or
     the medical file (`ch8_medical_file`).
  4. Sparing him in the Ch4 standoff.

  Exposing him on camera in Ch4 locks him `corrupt` immediately, whatever his points.

  **Honest Radwan** clears your record, gives police backup in Ch14, and arrests Vasse in
  *The Discovery*. **Corrupt Radwan** hunts you, raids your home base in Ch10, and escorts
  Vasse in Ch14.
- **Not an ally** in fights, but police backup is an event in Ch14.

### FATHER BISHOY — the Coptic monk-scholar
- **58, Egyptian Copt.** Monk of St. Catherine's Monastery (Sinai), on long assignment at
  a Coptic manuscript library in Old Cairo (fictional *Library of St. Mercurius*).
  Round glasses, huge beard, laughs at his own jokes.
- **Voice:** gentle, curious, surprisingly worldly. He used to be a chemist before
  taking vows.
- **Agenda:** knowledge should be read. He's the one scholar who wants the scrolls *read*
  more than *owned*.
- **Role:** the **Coptic and Greek tutor**. The Codex can't be read without him or a paid
  alternative (§ Economy). He's Miriam's appointment at El-Fishawy.
- **Sinai gate:** Ch13 needs `rel_bishoy` ≥ 30 **or** the Jebeliya escort (SQ-13 fallback).
  Otherwise it's RESTRICTED and the key comes via the Gebali squeeze.

### SHEIKH SALEM ABU ZEID — the Bedouin elder
- **70s. Western Desert Bedouin** (fictional clan, the Awlad Zeid). Lives between
  Bahariya and the Great Sand Sea.
- **Voice:** few words, a lot of silence, poetry at night.
- **Role:** the sandstorm rescue (Ch6), the guide to Siwa, and the gatekeeper of Siwa
  access (`rel_salem` ≥ 25 or `rep_bedouin` ≥ Warm).
- **His daughter Aisha** (24) is a desert guide and the co-lead of the Lost Army of
  Cambyses chain (SQ-06-03).

### SITT MERET — the Keeper
- **Looks about 60.** She's actually over 90 on the opened track (the Keepers' secret). The
  leader of the **Keepers of the House of Life**. She dresses like any Cairo grandmother.
- **Voice:** patient, loving, absolutely ruthless. She calls everyone "my child."
- **Agenda:** keep the Book sealed, keep the Houses hidden, and keep a 1,600-year promise.
- **The Keepers' secret:**
  - **Sealed track:** a very old, very secretive family society that has quietly killed
    to protect the Houses. Including, in 1974, a treasure hunter, and she ordered it.
  - **Opened track:** each generation, one Keeper reads a single line of the Book and is
    Claimed. That's how they know it's real, and how the Keepers' leaders live so long.
- **Arc:** a warning (Ch5), a captor and protector (Ch8), then an ally or enemy (Act III).
  She's essential to *The Burial*, and the final judge in *The Return*.

### IBRAHIM — the pickpocket
- **12, Cairo street kid.** Works for Karim's crew. Steals your bag at El-Fishawy (Ch2).
- **Voice:** fast, cocky, very funny, and then suddenly twelve.
- **His arc is the game's longest side thread:** SQ-02-02 → SQ-03-06 → SQ-09-07 →
  epilogue. His flag `ibrahim_fate` can end as:

  | Fate | How it happens |
  |---|---|
  | `school` | You pay his school fees and get him out of Karim's crew. |
  | `apprentice` | He becomes your assistant; you can bring him on jobs and heists. |
  | `crew` | He stays with Karim, and rises. |
  | `prison` | He's arrested in a job you pulled him into. |
  | `dead` | Only if you use him in the Ch9 Qurna raid **and** it goes loud. The game's cruelest outcome, and avoidable. |

  He appears in every ending's epilogue, reflecting his fate.

---

## SECONDARY CAST (by region)

### Ch1-A — Giza dig camp (Archaeologist)
- **Rais Abdallah Qufti:** 64, the dig foreman. He comes from **Quft (ancient Coptos)**, and
  that's a real tradition: Quftis have been Egypt's hereditary dig foremen since Petrie
  trained them in the 1890s. He knew Miriam 20 years and suspects everything. His family
  in Quft matter in Ch10.
- **Dr. Peter Lindqvist:** Swedish deputy director. Weak and kind, he took Vasse Foundation
  money and is terrified.
- **Hana Mostafa:** 25, conservator, Miriam's protégée, sharp. She becomes a Cairo contact.
- **Uncle Farouk:** the night guard (*ghafir*). He saw a car on the night Miriam left.

### Ch1-B — Saqqara (Inspector)
- **Director Fathi Mansour:** the player's boss. A careful bureaucrat who protects himself.
- **Inspector Samy Ragab:** a corrupt colleague who "lost" the Codex from evidence. He
  works for Karim el-Gebali, and is terrified of Vasse.
- **Umm Sabry:** the inspectorate tea lady. She knows everything and has a price (gossip,
  not money).
- **Rais Gad:** the Saqqara foreman and Rais Abdallah's cousin.

### Ch1-C — Red Sea harbor, Marsa Tarfa (Fixer)
- **Bassem "the Shark" Nassar:** the player's creditor. A Red Sea smuggling boss, polite
  and terrifying.
- **Captain Zaki:** an old dhow captain and the player's only real friend on the coast.
- **Rana Fouad:** a dive-shop owner and the Fixer's ex. She can be a Ch3 diving contact.

### Ch1-D — Port Said (Journalist)
- **Claire Fontaine:** the player's editor in Paris. Phone only. Pushy, loyal.
- **Magdy Hanna:** a Port Said stringer and photographer. The Journalist's local partner,
  and funny.
- **Dieter Kern:** a Vasse Foundation logistics manager. A dangerous paper-pusher.

### Ch2 — Cairo
- **Umm Hassan:** the rooftop landlady (home base 1). She feeds you if she likes you.
- **Mr. Wassef:** an elderly bookseller in Azbakeya. An alternative (paid, slower)
  Coptic/Greek tutor.
- **Madame Samira:** runs the tawla (backgammon) café and does gambling jobs.
- **Nabil Shawky:** a lawyer. Bail, fines and papers, for a fee.
- **Dr. Sherif Adly:** an emergency doctor at a Cairo hospital. Discounts at `rel` ≥ 20.
- **Omar Radwan:** the colonel's son, 24. A gambler, a mess, not a bad kid.
- **Hana Mostafa** (from Ch1-A if the Archaeologist; otherwise met here).

### Ch3 — Alexandria
- **Captain Yannis Kouris:** 60, Greek-Egyptian dive boat owner. One of the last of
  Alexandria's Greeks. He tells stories about the old cosmopolitan city.
- **Dr. Hoda Nasr:** a Ministry underwater archaeologist, rival and ally to Amira.
- **Sabri:** a fish-market fence.

### Ch4 — The Delta
- **Abu Ali:** a Lake Manzala fisherman. Teaches fishing and hides you in the reeds.
- **Site guard Mahrous:** the Tanis guard. Bribable, or loyal to Amira.

### Ch5 — The Faiyum
- **Sayed the potter:** Tunis village (real pottery village). The Keepers' first messenger.
- **Dr. Rania Khalil:** a paleontologist at Wadi el-Hitan (whale fossils). Side quests.

### Ch6–7 — Western Desert and Siwa
- **Sheikh Salem and Aisha** (above).
- **Lt. Tamer Saad:** a border-guard officer. Checkpoints, permits, suspicion.
- **Sheikh Yahya:** a Siwan elder. Speaks **Siwi** (an Amazigh language, and a real one).
  He's the gate to the Oracle's secret.
- **Mona:** runs the eco-lodge. Siwa's gossip hub, and date-harvest jobs.

### Ch8 — Hermopolis and Middle Egypt
- **Wael:** a young Keeper. Doubts his elders, and can become your informant.
- **Dr. Kamal Aziz:** the Minya antiquities inspector. Honest and underfunded.

### Ch9 — Luxor
- **Sabah el-Gebali:** Hagg Mahmoud's sister, who runs Qurna. The real power on the
  West Bank.
- **Hassan:** a calèche (horse carriage) driver. Horse-buying and racing.
- **Mustafa:** a hot-air-balloon pilot. Aerial scouting at dawn.
- **Captain Ramzi:** the dahabiya captain (home base 2).

### Ch10 — The River
- **The Qufti family** (Rais Abdallah's relatives), at Quft/Coptos.
- **Ghaffar:** a Kom Ombo crocodile-museum keeper, and an echo-quest giver (opened track).

### Ch11–12 — Aswan and Lake Nasser
- **Nour** (above). **Hajja Fatma:** Nour's grandmother, 88, born in the drowned village of
  Old Ballana. She holds the House 6b secret.
- **Uncle Idris:** runs a Lake Nasser fishing camp.

### Ch13 — Sinai
- **Sheikh Mousa of the Jebeliya:** the Jebeliya are a real Bedouin tribe who have
  guarded St. Catherine's for 1,400 years. He's a mountain guide and the Sinai fallback
  escort.
- **Father Bishoy** returns home here.

### Ch14 — Beneath Giza
- **Petamun:** mummified, seated at the Library's door with his last letter in his hands.
  He speaks only through his letters (sealed track), or as an echo (opened track).

---

## WHO CAN BE CLAIMED (opened track)

When the Book is opened, the ally with the **highest affinity** among Amira, Youssef, Lena
(if defected), Nour, Miriam and Ibrahim (if apprentice) becomes **Claimed**
(`claimed = <name>`). Ties go to the romance partner, then to Youssef. See
`04_ENDINGS.md` §4 for how the Claimed can be saved.
