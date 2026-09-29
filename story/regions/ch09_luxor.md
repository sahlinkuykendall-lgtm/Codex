# CH9 — LUXOR (ancient Thebes)

| | |
|---|---|
| Act | II (finale) |
| Biome | The temple city on the East Bank; on the West Bank, green fields, then the bare Theban hills honeycombed with tombs |
| Size | **Huge.** The second hub of the game |
| Main / side hours | 3.5 / 8+ |
| Revisit | ↺ Always |
| Home base | **The dahabiya *Hathor***: Miriam's family's old sailing houseboat, crewed by **Captain Ramzi**. Upgradeable (`05_ECONOMY.md` §3) |
| Real places | **Karnak**, **Luxor Temple**, the **Avenue of Sphinxes**, the **Valley of the Kings**, the **Valley of the Queens**, **Deir el-Bahari** (Hatshepsut's temple, and the 1881 royal cache), **Qurna** and its hillside, **Deir el-Medina** (the tomb-builders' village), **Medinet Habu**, the **Colossi of Memnon**, **Carter House**, dawn balloons |

---

## ARRIVAL
You arrive by the sleeper train at dawn, or by boat. **Hassan** the calèche driver explains
Luxor's prices (see `05_ECONOMY.md` §1).

**Captain Ramzi** finds you on the corniche. He crewed Miriam's family dahabiya for twenty
years: *"The doctor would want you aboard. The boat is yours while you look for her, or
for what she was looking for."* **The Hathor becomes home base 2.**

**Qurna access by `bc1_side`:**

| `bc1_side` | Qurna |
|---|---|
| Gebali | Sabah el-Gebali opens Qurna and the outer tomb to you |
| Ministry | Permits open the West Bank officially, but Sabah is wary (SQ-09-01 helps) |
| Vasse | Vasse's men "clear" Qurna by force. **Hagg Mahmoud becomes an enemy**, and the tomb is reached through Foundation muscle |
| Alone | **SQ-09-01 is required** to win Sabah over |

---

## MAIN BEATS

1. **The robbers' history.** At Deir el-Bahari, the site of the 1881 royal cache, Hagg
   Mahmoud or Sabah (or a museum placard, if they're hostile) tells the story of the
   Abd el-Rassul family (real), then the secret one: in the 1890s the Gebali found the
   outer rooms of a tomb, and the Keepers came to them with a pact: *take the gold, never
   open the inner door.* For 130 years, they kept it.
2. **The Gebali split.** Karim wants to sell the inner door to Vasse. Hagg Mahmoud wants
   the pact kept. Sabah holds the balance. **`ch9_gebali_heir`** ★: back Hagg Mahmoud or
   Karim (see `03_CHOICES_AND_FLAGS.md` §7).
3. **Switch sides?** Once, now, before the House. `bc1_switched` (`02_FACTIONS.md` §7).
4. **The Qurna night** (the big staged set piece). Wael (if informant) or Ibrahim (if
   recruited) warns you: *"They go in tonight, after the last prayer."* After the last
   prayer:
   - **Vasse's team** (with Karim, if he was backed) storms the Gebali hillside to reach
     the tomb first.
   - **You go in during the chaos.** Stealth through Qurna's hillside houses and tomb
     shafts, with your chosen ally.
   - **`ch9_ibrahim_job`:** bring Ibrahim to crawl through the robbers' gap. If the job goes
     loud while he's there, `ibrahim_fate` = `dead`. This is the only way that happens, and
     the game warns you in a subtle line before you choose.
   - **Karim** can die in the crossfire (if backed against his grandfather, or if the
     player shelters the house).
5. **House 5.** Behind the Gebali outer rooms, the sealed inner door. It needs the Word of
   Amun, the Tanis grid and Hieroglyphs 3 (a combined puzzle using every key so far).
   Inside: **120 scrolls** of geography (lost maps of the ancient world), and on a basalt
   table, **a cedar box bound in bronze**. Carved around it: *"Who opens this pays the
   river's price."*
6. > **BIG CHOICE 2: "OPEN THE BOOK?"** → `bc2_book_opened`
   > The screen says plainly: *"This decision will change what kind of story this is."*
   > Miriam (if present) and the Keepers (if present) plead. Vasse's men are minutes away.
   > See `03_CHOICES_AND_FLAGS.md` §4.
   > **Special case:** if you're with Vasse (and never switched), **his team takes the box
   > sealed.** The choice is theirs. You can steal it back in Ch10 (SQ-10-M).
7. **The escape.** Down the hill with the box (or the Book's first spell in your head) to
   the Hathor. Ramzi casts off in the dark.
   **Act II ends** with a cinematic: the dahabiya slides south under the stars. On the
   opened track, the ibises on the shore are following the boat.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-09-01 | Sabah's Trust | Sabah el-Gebali | Qurna's matriarch tests you: repay a family debt, return a stolen family photo album, and eat at her table | Qurna opens (required for Alone, helpful for Ministry) |
| SQ-09-02 | Dawn Balloon | Mustafa | Fly at dawn and photograph the West Bank from the air: you spot the Gebali tomb's air shaft | An alternative entry route for step 4 |
| SQ-09-03 | Hassan's Horse | Hassan | Buy a horse (haggling), train it, and race on the West Bank track | A horse, riding XP, racing bets |
| SQ-09-04 | The First Strike | A Deir el-Medina guard | The tomb-builders' village held **history's first recorded strike** under Ramesses III (real). Find the strike papyrus fragment a smuggler stole | Ministry +, and a great history lesson |
| SQ-09-05 | Karnak by Night | A Sound and Light technician | Someone is stealing from the Karnak stores during the show. Catch them in the dark | Money, and night-permit access |
| SQ-09-06 | Qurna's Lost Houses | An old Qurnawi | The hillside village was demolished in the 2000s (real). Photograph what's left and record his memories | Gebali +, and a memory project for the epilogue |
| SQ-09-07 | Ibrahim Comes South | Ibrahim | Ibrahim runs to Luxor after you. Decide his future (school, apprentice, or send him back to Karim) | Locks `ibrahim_fate` before Act III |
| SQ-09-08 | Carter's Driver | Carter House caretaker | Howard Carter's chauffeur (fiction, 1920s) left a diary about a tomb Carter never reported | Lore, and a Major find in the Valley of the Kings' side wadi |
| SQ-09-09 | The Cruise Boat Thief | A cruise manager | A thief works the cruise ships. Catch them aboard | Money, and a cruise-guiding job |
| SQ-09-10 | Alabaster | A workshop owner | Carve and sell alabaster vases (a timing minigame) | Money |
| SQ-09-11 | The Singing Colossus | A child at the **Colossi of Memnon** | The ancient legend of the singing statue (real). Wait at dawn with a microphone | A deniable sound hint, and a collectible recording |
| SQ-09-12 | The Hathor's Refit | Captain Ramzi | Upgrade the dahabiya: sails, galley, dive platform, study | Home base upgrades |

## JOBS
- Guiding (the Valley of the Kings, Karnak)
- Calèche fares
- Horse racing
- Felucca fares
- Alabaster carving
- Sieving at the West Bank digs
- Smuggling (Gebali)
- Balloon crew

## SECRETS
- **KV-X** (from Carter's driver): an unrecorded side tomb, and a Major find
- **Hatshepsut's hidden chapel:** Keeper shrine tile #7
- **The Gebali armory** (Gebali Sworn): in Qurna
- **The Serabit squeeze:** the stolen 1905 paper copy of the First Letters, kept in Hagg
  Mahmoud's safe. The **Sinai fallback** (Ch13). He gives it at Gebali Sworn, or you steal
  it (Lockpicking 3)

## DAY / NIGHT
- Balloons fly at dawn only.
- Tombs close at 5 pm, so night entry is illegal (heat).
- The Gebali receive visitors after sunset.
