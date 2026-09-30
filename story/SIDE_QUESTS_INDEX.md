# SIDE QUESTS INDEX

Every side quest in the game, by chapter. **Built from the region files**: if you add or
change a quest, edit the region file, then regenerate this index. The full summaries live
in the region files.

**Total: 141 side quests.** At about 30–60 minutes each, plus jobs, collectibles and
optional tombs, that's the 30–60 hour side-content target.

**ID format:** `SQ-<chapter>-<number>`. `SQ-01A…01D` are the background openings.
`-M` marks a main-adjacent auto-quest, and `-W` is the Weighing.

## LONG CHAINS (they cross chapters)

| Chain | Steps | Flags |
|---|---|---|
| **Ibrahim's fate** | SQ-02-02 → SQ-03-06 → SQ-09-07 (+ `ch9_ibrahim_job`) → epilogue | `ch2_ibrahim`, `ibrahim_fate` |
| **Alexander the Great** | SQ-03-09 + SQ-06-09 + SQ-06-03 (any two) → SQ-07-01 | `alexander_found`, `ch7_alexander` |
| **The Lost Army of Cambyses** | SQ-06-03 → SQ-07-06 | `cambyses_found`, `ch6_cambyses` |
| **Radwan's conscience** | SQ-02-09, the Ch2 truth, Ch4 spare/proof (SQ-01A-03, SQ-03-04, `ch1d_magdy_paid`, `ch8_medical_file`) → locks in Ch10 | `radwan_path` |
| **The Fixer's debt** | Ch1-C → SQ-04-06 → Gebali Trusted or paid | debt |
| **The drowned villages** | SQ-11-02 → Ch12 (SQ-12-06) | `ch12_memory`, `house_6b` |
| **Youssef and family** | SQ-02-01 → SQ-02-05 → SQ-02-11 → the Ch10 raid → Ch14 | `ch2_wedding`, `youssef_state` |
| **The Keepers' trust** | Ch5 warning → SQ-05-02 → SQ-08-05 (Wael) → Ch10 Kom Ombo → Ch14 | `rep_keepers`, `ch8_wael` |
| **Petamun's letters** | Collectibles in every region → Ch14 | lore |

## CH1-A — THE GIZA DIG CAMP (Archaeologist opening)
_Source: `regions/ch01_opening_archaeologist.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-01A-01 | The Rais's Son | Rais Abdallah | Rais +15, and the Qufti family owes you (Ch10). Riding XP |
| SQ-01A-02 | Hana's Conservation | Hana | Hana +15, **conservation wax** (reseals the find store), and **Hana's valuation** (+20% on sieve finds and the sherd set) |
| SQ-01A-03 | The Tea Boy's Secret | Saber | **Half-burned papers**: Vasse transfers, and "Dr. Hale's cooperation is no longer required" (a Radwan proof item in Ch4) |
| SQ-01A-04 | The Truck of 1926 | Exploration | 600 EGP, Ministry +5, and showing the Rais the photo (Rais +12) |
| SQ-01A-05 | Supply Line Blues | Uncle Hamid | 1,500 EGP, workmen +10 |
| SQ-01A-06 | Miriam's Caches | The detector | Money and gear. **Calling "A.S." from the phone** reaches Amira early (Amira +12, and the legal exit remembers the promise) |
| SQ-01A-07 | Darts Night | The dartboard | 2,000 EGP, and a nickname ("Abu Ramy") |
| SQ-01A-08 | Bosta | The camp dog | A companion for the night, who barks at the midnight car and growls at Lena |
| SQ-01A-09 | Pharaoh's Lentils | The fossil pavement | Excavation XP, lore |
| SQ-01A-10 | The Lamp at the Tomb | The old woman at the sheikh's tomb (night only) | Keepers +5. The first Keeper shrine tile (shrine travel in later chapters) |
| SQ-01A-11 | The Looters' Pit | The workers' cemetery | An amulet, or Ministry +3 |

## CH1-C — MARSA TARFA, RED SEA COAST (Fixer opening)
_Source: `regions/ch01_opening_fixer.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-01C-01 | Rana's Reef | Rana | Diving XP, and Rana's gift of a Ch3 dive kit discount |
| SQ-01C-02 | The Fort's Cannon | Old man at the fort | Rare find (an Ottoman coin hoard) |
| SQ-01C-03 | Fish for the Hotel | Hotel cook | Fishing unlocked, and the cook's discount |
| SQ-01C-04 | The Coast Guard's Cousin | Fisherman | Moral smuggling: rep, and a Bedouin contact who pays off in Ch6 |
| SQ-01C-05 | Bassem's Nephew | Bassem's sister | `rel_rana` +, and a small debt cut |

## CH1-B — SAQQARA INSPECTORATE (Inspector opening)
_Source: `regions/ch01_opening_inspector.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-01B-01 | Umm Sabry's Price | Umm Sabry | Umm Sabry's network: tips about Fathi, and a Return-ending cameo |
| SQ-01B-02 | The Camel Men | Village | Local rep, and the camel men give you rides later |
| SQ-01B-03 | Rais Gad's Tunnel | Rais Gad | A good find, Ministry rep, and it introduces the Qurna robbing families |
| SQ-01B-04 | The Colossus | Tourist child | Small reward, and a guiding job unlocked |
| SQ-01B-05 | The Forged Seal | Fathi | It's Samy. Evidence for the Radwan conscience track |
| SQ-01B-06 | The Serdab's Eyes | The serdab (Step Pyramid) | Photograph Djoser through the serdab's eye holes. Photography XP, and a photo for the phone |
| SQ-01B-07 | The Café's Backgammon | The café champion, Mit Rahina | A tawla game (the tawla minigame, reused later at Madame Samira's in Ch2). A small purse and village rep; it doesn't touch SQ-02-07 |
| SQ-01B-08 | The Well Girls | Two girls at the village well | Find their jerrycan's lost cap. Village rep, and gossip Umm Sabry wants |
| SQ-01B-09 | The Mechanic's Receipt | The mechanic, Mit Rahina | The receipt for Samy's motorbike (paid cash, from Cairo). Extra proof when you expose him in beat 6: it changes what Fathi and Samy say, not the outcome, and it is **not** a Radwan conscience point |

## CH1-D — PORT SAID (Journalist opening)
_Source: `regions/ch01_opening_journalist.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-01D-01 | The Empty Pedestal | Old waterfront barber | Photography XP, a small fee from Claire |
| SQ-01D-02 | Magdy's Wedding Photos | Magdy | `rel_magdy` +, and the photo job type unlocked |
| SQ-01D-03 | The Fish Market Fraud | Fish seller | Local rep, and a free-fish perk |
| SQ-01D-04 | Canal Pilot's Tale | Retired canal pilot | Lore, and a lead: the Foundation shipped "cultural items" through the canal in the 1990s too |
| SQ-01D-05 | The Stolen Press Card | Pickpocket | Teaches the robbery recovery system |

## CH2 — CAIRO
_Source: `regions/ch02_cairo.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-02-01 | Nefertiti's Engine | Youssef | Youssef's **getaway ally** unlocked, `rel_youssef` +10 |
| SQ-02-02 | The Boy from the Khan | Ibrahim | Leads to SQ-03-06 → SQ-09-07. `ibrahim_fate` |
| SQ-02-03 | The Tomb-Dwellers | A caretaker family in the City of the Dead | Keeper shrine revealed (the first fast-travel point), and a family who hide you later |
| SQ-02-04 | Umm Hassan's Nephew | Umm Hassan | `ch2_umm_hassan`: free rent, and she lies for you in Ch10 |
| SQ-02-05 | Youssef's Daughter's Wedding | Youssef | `ch2_wedding` ★: the Fahmy family flat becomes a Ch10 hideout. A huge `rel_youssef` gain |
| SQ-02-06 | Pigeons of Darb al-Ahmar | A rooftop pigeon racer | A pigeon coop at home, and message pigeons as collectibles |
| SQ-02-07 | Madame Samira's Table | Madame Samira | A café share (4,000/week passive), and the loan system unlocked |
| SQ-02-08 | The Papyrus Factory | A tourist couple | Teaches **spotting fakes**. The ring leader becomes a recurring con man |
| SQ-02-09 | Omar's Debt | Omar Radwan | `ch2_omar`: **Radwan conscience +1** (paid or exposed) |
| SQ-02-10 | The Azbakeya Hunt | Wassef | Greek XP, and Wassef's discount |
| SQ-02-11 | Derby Day | Youssef | Youssef's loved-gift source, and a day of joy (+10) |
| SQ-02-12 | Bab Zuweila's Top | A minaret keeper | Climbing XP, and a view that marks every Cairo side quest on the map |
| SQ-02-13 | Hana's Lab | Hana | Appraisal perk, and a cheaper Ministry sale price |
| SQ-02-14 | The Night Delivery | Karim | Gebali +, and the delivery job unlocked |

## CH3 — ALEXANDRIA
_Source: `regions/ch03_alexandria.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-03-01 | The Poet's Room | Yannis | `rel_yannis` +, and a free dive boat for later dives. Lore about Greek Alexandria |
| SQ-03-02 | The New Library | Librarian at the **Bibliotheca Alexandrina** | Greek XP, and the Ministry's reward doubled if you report |
| SQ-03-03 | Sabri's Nets | Sabri | Money, Gebali +, Ministry - |
| SQ-03-04 | The Theodora | Anonymous tip (Keepers) | Radwan proof item, Vasse -, Keepers + |
| SQ-03-05 | The King's Coins | A retired jeweler | A Major find. Sell it or return it |
| SQ-03-06 | Ibrahim's Cousin | Ibrahim (phone) | Continues Ibrahim's arc (`ibrahim_fate` branches) |
| SQ-03-07 | Hoda's Survey | Dr. Hoda | The diving salvage job, Ministry +, and Hoda's friendship |
| SQ-03-08 | The Tram Race | Tram driver | Money, and driving XP |
| SQ-03-09 | Under the Prophet Daniel | A mosque caretaker | Begins the **Alexander chain**: a clue that the body was moved "to his father's oracle" (→ Siwa) |
| SQ-03-10 | Rana's Wreck | Rana (Fixer only) | Diving XP, a Rare find |

## CH4 — THE DELTA: TANIS & LAKE MANZALA
_Source: `regions/ch04_delta.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-04-01 | Abu Ali's Nets | Abu Ali | Fishing unlocked, `rel_abuali` + |
| SQ-04-02 | The Pigeon Towers | A village boy | A pigeon collectible, and Climbing XP |
| SQ-04-03 | The Moulid | Village sheikh | A festival night (+rep with villagers), and a hidden Keeper shrine behind the saint's tomb |
| SQ-04-04 | Montet's Notebook | An old man in San el-Hagar | Lore (Montet saw the sacred lake chamber and said nothing), and a Rare find |
| SQ-04-05 | The Lost Buffalo | A farmer | A small reward, and a funny scene |
| SQ-04-06 | The Shark's Tail | (Fixer only) | Resolves or worsens the Fixer's debt |
| SQ-04-07 | The Birds of Manzala | A birdwatcher | Photography XP, Nature collectibles |
| SQ-04-08 | Canal Runners | A Gebali contact | Money, Gebali + |
| SQ-04-09 | Mahrous's Pension | Mahrous (if saved) | Ministry +, and Mahrous at *The Discovery* |

## CH5 — THE FAIYUM
_Source: `regions/ch05_faiyum.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-05-01 | The Singing Wheels | A farmer | Village rep, and free food and lodging |
| SQ-05-02 | Sayed's Kiln | Sayed (if you listened) | Keepers +10, and a **Keeper hall** under the workshop (Trusted) |
| SQ-05-03 | The Student in the Water | Dr. Rania Khalil | `ch5_student`: Rania's fossil jobs, and she appears at *The Discovery* |
| SQ-05-04 | Whale Valley | Dr. Rania | Photography and Excavation XP, and a big reward |
| SQ-05-05 | The Crocodile Priest | Echo quest (**opened track only** on revisit) / a sealed-track legend | A Rare find |
| SQ-05-06 | Karanis Granary | Ministry archaeologist | Ministry +, and the looter joins your informants |
| SQ-05-07 | The Salt Harvest | A lake fisherman | Fishing, money |
| SQ-05-08 | Pots for the Market | Tunis potters | Money, Haggling XP |

## CH6 — THE WESTERN DESERT
_Source: `regions/ch06_western_desert.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-06-01 | The Golden Mummies | A Bawiti museum guard | Ministry + or money. A Keeper shrine tile |
| SQ-06-02 | Crystal Mountain | Aisha | A photo job, and Aisha + |
| SQ-06-03 | **The Lost Army of Cambyses** | Aisha | `cambyses_found`. `ch6_cambyses`: return it to the clan, report, or sell (+150,000, Bedouin -20) |
| SQ-06-04 | Salem's Stars | Sheikh Salem | Bedouin dialect XP, and Salem + |
| SQ-06-05 | Bir Sitta | A spring keeper | Rep, and a free rest point |
| SQ-06-06 | The Mushroom and the Chicken | A tourist guide | Money, and the guide becomes a jeep-hire discount |
| SQ-06-07 | Tamer's Dilemma | Lt. Tamer | Ministry +, and Tamer waves you through forever |
| SQ-06-08 | The Camel Market | A camel trader | A camel, and riding XP |
| SQ-06-09 | The Hungarian's Cache | A 1930s logbook in the refuge | A Rare find: his map, which marks a Siwa secret (Alexander chain) |
| SQ-06-10 | Hamdi's Bike | Hamdi (if carried) | Bedouin +, and Hamdi becomes a messenger |

## CH7 — SIWA OASIS (missable)
_Source: `regions/ch07_siwa.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-07-01 | **The Tomb of Alexander** | Built from SQ-03-09 (Nabi Daniel clue), SQ-06-09 (Almásy's map), and SQ-06-03 (the Cambyses officer's trail) | `alexander_found`. `ch7_alexander` ★: announce (Ministry +25, world fame), keep secret (Keepers +20), sell to Vasse (+5,000,000 EGP, Ministry -40, Keepers -30) |
| SQ-07-02 | The Siyaha Festival | Sheikh Yahya | Siwan rep, and a festival night (+ affinity with your ally) |
| SQ-07-03 | Shali After Rain | A restoration architect | Carpentry XP, and a free room |
| SQ-07-04 | Si-Amun's Colors | A tomb guard at **Gebel al-Mawta** | A Ministry photo job, and Photography XP |
| SQ-07-05 | Cleopatra's Spring | Mona | Money, and Mona + |
| SQ-07-06 | The Last Soldier | Aisha (from SQ-06-03) | The chain completes. `ch6_cambyses` choice |
| SQ-07-07 | Olive Oil | Farmer | Money, and a gift of oil (Youssef's wife loves it) |
| SQ-07-08 | Border Runners | A smuggler | Big money, heat +2, Bedouin - |
| SQ-07-09 | The Salt Lake | Kids at the lake | A fun rest spot, and a collectible |

## CH8 — HERMOPOLIS & MIDDLE EGYPT
_Source: `regions/ch08_hermopolis.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-08-01 | The Boundary Stelae | Dr. Kamal | Photography XP, Ministry +. The history of the heretic king |
| SQ-08-02 | The Wrestlers of Beni Hasan | A village wrestling coach | A fighting skill bump, and village rep |
| SQ-08-03 | The Holy Family Road | A Coptic priest | Coptic XP, and `rel_bishoy` + (he hears about it) |
| SQ-08-04 | Kamal's Storeroom | Dr. Kamal | Ministry +, and Kamal's gratitude (cheaper permits) |
| SQ-08-05 | Wael's Doubt | Wael (young Keeper) | `ch8_wael`: warnings before Keeper moves in Act III |
| SQ-08-06 | The Baboon's Nose | Kamal | Excavation XP, and a funny ceremony |
| SQ-08-07 | Cane Season | A farmer | Money, and a cane-train fast-travel line |
| SQ-08-08 | The Island Farm | A Nile island family | Sailing XP, and money |
| SQ-08-09 | Petosiris's Garden | Echo (**opened track only**, on revisit) / a museum audio guide (sealed track) | A Rare find, and on the opened track, a Petamun hint |

## CH9 — LUXOR (ancient Thebes)
_Source: `regions/ch09_luxor.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-09-01 | Sabah's Trust | Sabah el-Gebali | Qurna opens (required for Alone, helpful for Ministry) |
| SQ-09-02 | Dawn Balloon | Mustafa | An alternative entry route for step 4 |
| SQ-09-03 | Hassan's Horse | Hassan | A horse, riding XP, racing bets |
| SQ-09-04 | The First Strike | A Deir el-Medina guard | Ministry +, and a great history lesson |
| SQ-09-05 | Karnak by Night | A Sound and Light technician | Money, and night-permit access |
| SQ-09-06 | Qurna's Lost Houses | An old Qurnawi | Gebali +, and a memory project for the epilogue |
| SQ-09-07 | Ibrahim Comes South | Ibrahim | Locks `ibrahim_fate` before Act III |
| SQ-09-08 | Carter's Driver | Carter House caretaker | Lore, and a Major find in the Valley of the Kings' side wadi |
| SQ-09-09 | The Cruise Boat Thief | A cruise manager | Money, and a cruise-guiding job |
| SQ-09-10 | Alabaster | A workshop owner | Money |
| SQ-09-11 | The Singing Colossus | A child at the **Colossi of Memnon** | A deniable sound hint, and a collectible recording |
| SQ-09-12 | The Hathor's Refit | Captain Ramzi | Home base upgrades |

## CH10 — THE RIVER (Qena to Kom Ombo)
_Source: `regions/ch10_the_river.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-10-M | **The River Heist** | Auto (if Vasse has the Book) | `vasse_has_book` |
| SQ-10-01 | Dendera's Zodiac | A Dendera guard | Photography, a history lesson, Ministry + |
| SQ-10-02 | Esna's Vendors | A vendor family | Money, and a fun scene |
| SQ-10-03 | The Quft Archive | The Qufti family | Lore, `ch10_tomb_known` (if not already), and Excavation XP |
| SQ-10-04 | The Silsila Quarry Marks | A quarry guard | Hieroglyphs XP, collectibles |
| SQ-10-05 | Ramzi's Son | Ramzi | `rel_ramzi` +, and the Hathor's crew bonus |
| SQ-10-06 | Crocodile Farm | Ghaffar | A funny, tense rescue. Ghaffar + |
| SQ-10-07 | Sugar Train | A cane farmer | Riding XP, money |
| SQ-10-08 | Abu Ali's Visit | Abu Ali (if `ch4_reeds`) | Intel, and `rel_abuali` + |

## CH11 — ASWAN & PHILAE
_Source: `regions/ch11_aswan_philae.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-11-01 | Speak Nobiin | Ustaz Karam | Nubian skill (the Nour gate) |
| SQ-11-02 | **The Drowned Village** | Hajja Fatma (Nour's grandmother) | Nubian +25, the Ch12 gate, and `ch12_memory` groundwork |
| SQ-11-03 | The Nilometer | An Elephantine guard | Ministry +, a history lesson |
| SQ-11-04 | The Unfinished Obelisk | A quarry guide | Hieroglyphs XP, collectibles |
| SQ-11-05 | Tea at the Old Cataract | A hotel guest | Money, and a fun detective quest |
| SQ-11-06 | The Dancing Dwarf | A tomb guard at **Qubbet el-Hawa** | Lore, and a great sweet story |
| SQ-11-07 | Daraw Camels | A camel trader | Money, a camel |
| SQ-11-08 | A Nubian Wedding | Nour's cousin | Huge Nubian and `rel_nour` gain, and an epilogue photo |
| SQ-11-09 | St. Simeon's Walls | A monk (visiting) | Coptic XP, and `rel_bishoy` + |
| SQ-11-10 | The House Crocodile | Nubian kids | A funny chase, and village +10 |

## CH12 — LAKE NASSER & ABU SIMBEL (missable)
_Source: `regions/ch12_lake_nasser.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-12-01 | The Giant Perch | Uncle Idris | Money, fishing trophy |
| SQ-12-02 | The Island Fortress | A guard at Qasr Ibrim | Coptic and Hieroglyphs XP, collectibles |
| SQ-12-03 | Sunrise at Abu Simbel | A Nubian guide | A spectacle, and Nubian + |
| SQ-12-04 | The Moved Temples | A UNESCO veteran (fiction, 80s) | Lore, and an epilogue museum detail |
| SQ-12-05 | Idris's Boat | Uncle Idris | Money, and a free boat on the lake |
| SQ-12-06 | Hajja Fatma's Song | Hajja Fatma | Huge `rel_nour` gain, Nubian Sworn path |

## CH13 — SINAI (missable, with fallback)
_Source: `regions/ch13_sinai.md`_

| ID | Name | Giver | Outcome |
|---|---|---|---|
| SQ-13-M | **The Monastery Road** | Auto (if Lena betrays) | `vasse_has_book`, or you recover the key |
| SQ-13-W | **The Weighing** | Auto (opened track) | Keeps the Claimed alive to Ch14 |
| SQ-13-01 | The Jebeliya Escort | Sheikh Mousa | The Sinai access fallback, and Bedouin + |
| SQ-13-02 | The Bush | A monk | `rel_bishoy` +, and Coptic XP |
| SQ-13-03 | The Lost Leaves | Bishoy | Greek and Coptic XP, and a Petamun letter (collectible) |
| SQ-13-04 | Mountain Gardens | A Jebeliya gardener | Food supply, and Bedouin + |
| SQ-13-05 | The Valley of Inscriptions | A tour guide | Collectibles, and Hieroglyphs XP |
| SQ-13-06 | Turquoise | A Bedouin miner | Money, and a gift for your romance partner |
| SQ-13-07 | Bishoy's Laboratory | Bishoy | Excavation XP, and one line in the Discovery epilogue |
