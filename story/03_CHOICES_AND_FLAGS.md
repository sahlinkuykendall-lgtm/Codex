# CHOICES & FLAGS — THE MASTER MAP

This is the wiring diagram of the game: every big choice, every small choice that echoes
later, and the flags they set. **Region files describe scenes. This file is the authority
on what a choice does.** If they ever disagree, this file wins, and the region file gets
fixed.

---

## 1. STATE THE GAME TRACKS

| Kind | Name pattern | Values | Notes |
|---|---|---|---|
| Background | `bg` | `archaeologist` `inspector` `fixer` `journalist` | Set at New Game |
| Player identity | `pc_name`, `pc_pronouns` | text | Used in dialogue tokens |
| Big choices | `bc1_side`, `bc2_book_opened`, `bc3_library` | see §3–5 | |
| Affinity | `rel_<name>` | -100..100 | Characters in `01_CHARACTERS.md` |
| Reputation | `rep_<faction>` | -100..100 | Factions in `02_FACTIONS.md` |
| Police heat | `heat` | 0..5 | `06_SYSTEMS.md` §6 |
| Chapter flags | `chNN_<name>` | bool / enum | Set by scenes, listed per chapter below |
| Character fates | `miriam_state`, `ibrahim_fate`, `radwan_path`, `lena_choice`, `claimed`, `youssef_state` | enum | Final values feed endings |
| Houses found | `house_1` … `house_7`, `house_6b` | bool | 6b is optional |
| Big optional finds | `alexander_found`, `cambyses_found` | bool | |
| Book track | `book_pull` | 0..100 | Only rises after `bc2_book_opened` |
| Setting | `opt_choice_notices` | bool | Chosen at New Game: shows "*___ will remember that.*" |

**Choice notices.** When `opt_choice_notices` is on, any choice that changes affinity by 10
or more, changes reputation by 10 or more, or sets a flag marked ★ in this file shows a
small corner notice, like *"Youssef will remember that."* or *"Something has changed in
Qurna."* **The notice never says how.** Quiet ending locks (§6) **never** show a notice.

---

## 2. CH1 EXIT CHOICE — `c1_exit` (every background)

Every opening ends with the same three-way shape. **It changes your Cairo starting
situation, never your ending.**

| Option | Archaeologist | Inspector | Fixer | Journalist | Effect in Ch2 |
|---|---|---|---|---|---|
| **`quiet`**: slip away | Walk out through the quarry at night with the Codex | Steal it back from Samy's locker and vanish | Refuse the handoff and ghost Bassem | Take the Codex from the container and disappear | Nobody knows you have it. Heat 0. Vasse's watchers only find you at El-Fishawy. There's no early ally. |
| **`legal`**: go official | Call the Ministry, and Amira meets you | Log it properly and report Samy | Hand it to the coast guard *(Bassem now hunts you, +10 debt pressure)* | Publish a teaser and alert the Ministry | `rel_amira` +15, `rep_ministry` +10. **But** Radwan's office leaks it, so Lena tails you from day one in Cairo |
| **`deal`**: take the stranger's offer | Lindqvist's "Foundation car" (Vasse) | Samy's contact (Gebali) | Bassem's buyer (Gebali) | Dieter Kern's "interview" (Vasse) | +5,000 EGP and +10 with that faction. You start Ch2 *owing* them a favor, which they collect in Ch2 |

---

## 3. BIG CHOICE 1 — "WHOSE SIDE ARE YOU ON?" (Ch4, Tanis) ★

`bc1_side` = `ministry` | `vasse` | `gebali` | `alone`

**Setup:** House 2 is open, and the scrolls are lying on the floor of a flooding chamber.
Amira (with Radwan's police), Lena (for Vasse) and Karim (for the Gebali) all arrive. You
have the Codex. Each one makes an offer, and you can only take one, or none.

| | **Ministry** | **Vasse** | **Gebali** | **Alone** |
|---|---|---|---|---|
| Offer | Legal protection, the scrolls go to Egypt, and you become an official consultant | 250,000 EGP now, a stipend, the villa, top gear | A share of any sale, safehouses, the Qurna door | Nothing. You run with the Codex |
| Immediate effect | Reputation per `02_FACTIONS.md` §7, `rel_amira` +15 | Reputation, `rel_lena` +10, `rel_amira` -30 | Reputation, `rel_amira` -15 | `rel_amira` -5, and Keepers impressed (+5) |
| **Who hunts you in Act II** | Vasse (hit squads) and Karim's crews | Nobody officially, but the Keepers sabotage you | Vasse and the police | Everyone, a little |
| **Friendly hubs** | Ministry archive, police armory access | Foundation villa, yacht | Safehouses, black market | Only home bases |
| **Who helps at Luxor (Ch9)** | Amira and Ministry permits open the West Bank officially | Vasse's men clear Qurna by force (Hagg Mahmoud becomes an enemy) | Sabah opens Qurna and House 5's outer tomb | You have to win Sabah over yourself (SQ-09-01) |
| **Tanis** | You save the scrolls, and Amira files them | Lena's team takes them, and the site is flooded to cover it | Karim's men take them and the site floods | You take what you can carry, and the site floods |

**It never locks an ending.** You can switch sides once in Ch9 (see `02_FACTIONS.md` §7).
**Tanis becomes one-way** after this scene in every branch (the sacred lake chamber
floods). The Lake Burullus half of the region stays open.

---

## 4. BIG CHOICE 2 — "OPEN THE BOOK?" (Ch9, Luxor, House 5) ★ — THE ONE OBVIOUS LOCK

`bc2_book_opened` = `true` | `false`

**Setup:** in House 5's inner chamber, the cedar box sits on a basalt table. Hieroglyphs
around it read: *"Who opens this pays the river's price."* Miriam (if present) begs you
both ways, depending on her state. The Keepers (if present) beg you not to. Vasse's
people are minutes away.

**The screen states plainly:** *"This decision will change what kind of story this is."*
This is the one ending lock the game shows openly.

| | **Keep it sealed** | **Open it** |
|---|---|---|
| Track | Sealed (grounded) | Opened (supernatural) |
| Endings still possible | Discovery, Sale, Burial | Scribe, Return, Fire (and the Usurper can happen) |
| Immediate | You carry the sealed box (it's heavy and slows sprinting). `rep_keepers` +10 | The first spell. The world *sounds* different, and the ibises on the hill turn to look at you. `rep_keepers` -30. **`claimed`** is set (highest-affinity eligible ally, `01_CHARACTERS.md`) |
| Act III changes | Vasse is desperate: more raids, and bribery attempts on your allies | Echo quests appear (the dead in tombs). You understand animals. `book_pull` rises. The Claimed starts to fade (§ `04_ENDINGS.md` §4) |

**If Vasse holds the Book at this moment** (you sided with Vasse and never switched), the
choice is made **by Vasse's team**: he orders it sealed and shipped. You can steal it back
in Ch10 (SQ-10-M "The River Heist"). If you don't, `vasse_has_book` = true going into
Ch13 (an Usurper risk).

---

## 5. BIG CHOICE 3 — "WHAT HAPPENS TO THE LIBRARY?" (Ch14) ★

`bc3_library`, set by the track:

| Track | Options | Ending |
|---|---|---|
| Sealed | `reveal`: bring the world in (Ministry) | 1. The Discovery |
| Sealed | `sell`: hand it to Vasse or the Gebali | 2. The Sale |
| Sealed | `reseal`: give it back to the Keepers | 3. The Burial |
| Opened | `read`: finish the Book | 4. The Scribe |
| Opened | `return`: carry the Book to Naneferkaptah's tomb | 5. The Return |
| Opened | `burn`: burn the Book and the Library | 6. The Fire |
| Either | Vasse holds the Book and you fail to take it back | 7. The Usurper (not a choice) |

Details, requirements and variations are in `04_ENDINGS.md`.

---

## 6. QUIET ENDING LOCKS (mid–late game, no notice ever shown)

| Ending | Quietly locked if… | When it locks |
|---|---|---|
| The Discovery | `rep_ministry` ≤ Hostile **and** `rel_amira` ≤ Cold **and** `radwan_path` = corrupt (nobody official will stand with you) | End of Ch13 |
| The Sale | Vasse is arrested or dead **and** `rep_gebali` ≤ Cold (no buyer) | End of Ch13 |
| The Burial | `rep_keepers` ≤ Hostile (they won't take it back) | End of Ch13 |
| The Return | You never learned where Naneferkaptah's tomb is (`ch10_tomb_known` = false). You learn it at Coptos (Ch10, echo quest), or the Inspector knows it from Saqqara (`bg` = inspector gives it automatically after Ch9) | End of Ch12 |
| The Scribe / The Fire | Never locked (always possible on the opened track) | — |

Because at least one option per track is always open, **the story can never dead-end.**

---

## 7. KEY SMALL CHOICES BY CHAPTER (the ones that echo)

Format: **choice** → flag → **where it pays off**. ★ = shows a choice notice.

### Ch1 (per background, see each opening file)
- The exit choice above.
- Background-specific: Archaeologist `ch1a_farouk_bribed` (the night guard) → Ch14, Farouk lets you into the Osiris Shaft without a fight. Inspector `ch1b_samy_exposed` ★ → Ch2, Karim's crew hostile. Fixer `ch1c_zaki_saved` ★ → Ch3, Zaki's boat for the harbor dive. Journalist `ch1d_magdy_paid` → Ch4, Magdy's photos are the proof that turns Radwan honest.

### Ch2 Cairo
| Choice | Flag | Pays off |
|---|---|---|
| Catch Ibrahim and hand him to police / let him go / pay him / recruit him | `ch2_ibrahim` = `police`/`free`/`paid`/`recruited` ★ | Ibrahim's arc (SQ-02-02). If `police`, Karim is Cold to you all game. If `recruited`, he warns you of the Ch9 raid |
| Tell Radwan the truth or lie at the first interview | `ch2_radwan_truth` | Truth: Radwan's conscience +1 (needed for `honest`). Lie: he trusts you less but can't prove anything |
| Who reads the Codex: Bishoy / Wassef / Foundation scholars | `ch2_reader` | Foundation: Vasse gets a full photographic copy, and **is a step ahead at every House in Act I**. Bishoy: `rel_bishoy` +15 (Sinai gate). Wassef: costs 12,000 EGP, slower |
| Attend Youssef's daughter's wedding (SQ-02-05) | `ch2_wedding` ★ | **Ch10:** when Radwan (corrupt) raids your base, the Fahmy family flat in Shubra is open as a hideout. If you skipped the wedding, the door stays shut: *"Samah says you're not family."* |
| Help Umm Hassan's nephew with the police (SQ-02-04) | `ch2_umm_hassan` | Ch10: the rooftop isn't searched, because she lies for you |
| Karim's package: deliver unopened / open it / hand it to police | `ch2_package` ★ | Unopened: `rep_gebali` +10. Opened: you learn Karim is selling to Vasse (Ch9 leverage). Police: Gebali Cold, Ministry +10 |
| Pay off Omar Radwan's debt, expose it, or ignore it (SQ-02-09) | `ch2_omar` | Paid or exposed-to-father: Radwan's conscience +1 |

### Ch3 Alexandria
| Choice | Flag | Pays off |
|---|---|---|
| Free Lena from the collapsed catacomb shaft, or leave her | `ch3_lena_freed` ★ | Freed: `rel_lena` +25 (the start of her defection path). Left: she gets out herself, `rel_lena` -20, and remembers |
| House 1 scrolls: report to Dr. Hoda / hide them / sell one to Sabri | `ch3_scrolls` | Report: Ministry +10. Sell: +40,000 EGP, Keepers -10, and **that scroll turns up in Vasse's vault in Ch14** (an epilogue detail) |
| Dive with Yannis (legal, paid) or Sabri's boat (cheap, illegal) | `ch3_dive_boat` | Sabri: the coast guard incident (heat +1), and Sabri sells your location to Lena in Ch4 |

### Ch4 The Delta
| Choice | Flag | Pays off |
|---|---|---|
| **Big Choice 1** | `bc1_side` | §3 |
| The Radwan standoff at the Tanis checkpoint: spare / expose on camera / blackmail | `ch4_radwan` ★ | Spare: conscience +1. Expose: `radwan_path` locks `corrupt` early, but Ministry +15. Blackmail: he's a reluctant tool (police backup in Ch14 regardless of path, but he hates you) |
| Save guard Mahrous or the last scroll crate as the chamber floods | `ch4_mahrous` ★ | Saved: Mahrous testifies (Ministry +10), and he appears at *The Discovery* ending. Crate: +30 scrolls to House 2's count |
| Hide in Abu Ali's reeds, or run the checkpoint | `ch4_reeds` | Reeds: `rel_abuali` +, and he's a Ch10 river contact. Run: heat +2 |

### Ch5 The Faiyum
| Choice | Flag | Pays off |
|---|---|---|
| The Keeper warning from Sayed the potter: listen / threaten him / report him | `ch5_keeper_warning` ★ | Listen: Keepers +15, **shrine fast travel unlocks now**. Threaten: Keepers -20. Report: Keepers -30 and Ministry +5 |
| Save Dr. Rania's student in the Labyrinth's flooded wing (SQ-05-03) | `ch5_student` | Saved: Rania's whale-valley jobs, and she appears at *The Discovery* |
| The lake night with Amira | `rom_amira` (if Bonded) | Romance |

### Ch6 Western Desert
| Choice | Flag | Pays off |
|---|---|---|
| The stranded Bedouin boy: carry him (costs water) or leave him | `ch6_boy` ★ | Carry: Bedouin +25, and Salem rescues you in the storm. Leave: Bedouin -30, and the storm is a solo survival sequence |
| Cambyses finds: return them to the clan / report / sell | `ch6_cambyses` | Clan: Bedouin Sworn path. Sell: +150,000 EGP, Bedouin -20 |

### Ch7 Siwa (missable)
| Choice | Flag | Pays off |
|---|---|---|
| Learn some Siwi from Sheikh Yahya (or not) | `ch7_siwi` | Needed to hear the Word of Amun properly. Without it, a longer puzzle |
| Alexander's tomb: announce / keep secret / sell to Vasse | `ch7_alexander` ★ | Announce: Ministry +25, and world fame in the epilogue. Secret: Keepers +20. Sell: +5,000,000 EGP, Ministry -40, Keepers -30, and changes several endings' epilogues |

### Ch8 Hermopolis
| Choice | Flag | Pays off |
|---|---|---|
| How you get Miriam from the Keepers: negotiate / sneak her out / let her stay | `ch8_miriam` ★ | Negotiate (needs Keepers ≥ Neutral): `miriam_state` stays open, Keepers +10. Sneak: Keepers -20, and Miriam joins you now. Stay: she re-enters in Ch13 |
| Turn Wael into an informant | `ch8_wael` | Warnings before every Keeper move in Act III, and Keeper-hostile branches get easier |
| Steal Vasse's medical file from the Foundation's Minya clinic contact | `ch8_medical_file` | Radwan's proof item. Journalist bonus: it becomes a published story (Vasse -20) |

### Ch9 Luxor
| Choice | Flag | Pays off |
|---|---|---|
| Qurna: back Hagg Mahmoud or Karim in the family split | `ch9_gebali_heir` ★ | Hagg Mahmoud: the pact stands, the Serabit squeeze is available, and Karim may die in the raid. Karim: the Gebali side with Vasse, and Hagg Mahmoud is exiled |
| Bring Ibrahim on the Qurna job | `ch9_ibrahim_job` | If the job goes loud and he's there, `ibrahim_fate` = `dead` (the only way it happens) |
| **Switch sides** (once) | `bc1_switched` | `02_FACTIONS.md` §7 |
| **Big Choice 2** | `bc2_book_opened` | §4 |

### Ch10 The River
| Choice | Flag | Pays off |
|---|---|---|
| Radwan's decision (automatic from his conscience points) | `radwan_path` ★ | Locks here: two or more points = `honest` |
| The home base raid (if `corrupt`): where you hide | uses `ch2_wedding`, `ch2_umm_hassan`, Gebali Trusted | No hideout means arrest, then jail (see `06_SYSTEMS.md` §7) |
| Coptos echo quest (opened track only), or the Qufti family papers | `ch10_tomb_known` | Unlocks *The Return* |
| If Youssef was arrested and you didn't bail him out | `youssef_state` | `jailed`: he misses Ch14, and his family epilogue is bitter |

### Ch11 Aswan
| Choice | Flag | Pays off |
|---|---|---|
| Philae scrolls: give to the Nubian Museum / Ministry / keep | `ch11_philae` | Nubian Museum: Nubian +25 (Ch12 gate) |
| The night sail with Nour | `rom_nour` | Romance |

### Ch12 Lake Nasser (missable)
| Choice | Flag | Pays off |
|---|---|---|
| Record Hajja Fatma's memories for the village project | `ch12_memory` | *Return* and *Discovery* epilogues include the drowned village restored in a museum |
| House 6b: raise the scrolls / leave them in place | `house_6b`, `ch12_left_in_place` | Raised: a Library completeness bonus. Left: Nubian Sworn, and Hajja Fatma's blessing (an epilogue line) |

### Ch13 Sinai (missable, with a fallback)
| Choice | Flag | Pays off |
|---|---|---|
| Lena's choice (automatic from `rel_lena`) | `lena_choice` = `defect`/`neutral`/`betray` ★ | Betray: she takes the Book (opened track) or the Codex's final key (sealed track). You can chase her: SQ-13-M "The Monastery Road" |
| Miriam's rescue (if Vasse took her in Ch12's aftermath) | `miriam_state` | Fail and low trust: `dead`. Success: `saved` or `keeper` (her pick, based on your earlier talks) |
| The Serabit key or the Gebali squeeze | `ch13_key_source` | Both work. The squeeze route means Vasse also has the key (he ambushes you in Ch14) |

### Ch14 Beneath Giza
- The final confrontation (see the region file), then **Big Choice 3**.

---

## 8. TYPICAL VALUE SCALE (for writers)

| Action | Affinity change |
|---|---|
| A small kindness or joke that lands | +2 to +5 |
| Keeping a promise, defending them | +10 |
| Saving their life, a major sacrifice | +25 |
| A small lie they catch, or rudeness | -5 |
| A broken promise, abandoning them | -15 |
| Betrayal, getting them hurt or arrested | -30 |

**Reputation** changes run about 1.5× these numbers for faction-wide acts, and quarter-size
for small personal acts witnessed by a member.
