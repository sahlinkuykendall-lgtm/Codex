# CH1-A — THE GIZA DIG CAMP (Archaeologist opening)

| | |
|---|---|
| Act | I (prologue) |
| Background | Archaeologist only (no other background can visit this area) |
| Biome | Desert plateau and dig camp on the western edge of the Giza necropolis, with the pyramids on the skyline |
| Size | Large (the existing built Chapter 1 map) |
| Main / side hours | 1.5 / 2 |
| Revisit | No (it's the opening). Giza returns as Ch14, seen from underground and the plateau at night |
| Real places | The Giza plateau, the Western Cemetery mastabas, the causeway of Khafre, the **Osiris Shaft** |
| Built assets reused | The whole existing Ch1: camp tents, dorm, foreman's house, dig plateau trenches, the supply rail line, oasis, wreck, guard house, sherds, caches, detector, backpack, tips; the sieve, tea, darts and seal minigames |

---

## PREMISE

You've been flown in to take over the **Giza Western Field Survey** because its director,
Dr. Miriam Hale, "left for family reasons." Nobody at camp believes that. The Ministry wants
the season finished. Her deputy, Lindqvist, wants you not to ask questions. And the
workmen want to know if they'll be paid.

**The rework of the built map:**
- The White Desert chalk formations become a **limestone quarry field** (ancient quarries
  south of the plateau are real).
- The wreck becomes a **1920s expedition truck**.
- The oasis becomes **the camp's water point and date garden**.
- Everything that was busywork now pays off (§ Main beats).

---

## ARRIVAL

A night drive in from Cairo, with the pyramids appearing through the haze, is the loading
sequence. **Rais Abdallah Qufti** meets you at the camp gate with a lamp and tells you,
before anything else: *"Doctor Miriam did not leave for family reasons."*

---

## MAIN BEATS

1. **Take over the camp.** Meet Rais Abdallah, Dr. Lindqvist and Hana Mostafa. Lindqvist
   gives you Miriam's keys, **minus one**: the find-store key is "lost."
   *Tip system teaches movement, the backpack and the detector here.*
2. **Pay the workmen** (the first money choice). The payroll is 12,000 EGP short:
   Lindqvist spent it.
   - **Pay from your own money:** `rel_abdallah` +15, and the workmen will help you later.
   - **Confront Lindqvist:** he confesses Foundation money paid the season, and he's
     scared.
   - **Delay:** the workmen strike for a day, and the trenches close until paid.
3. **The trenches mean something now.** Miriam's survey stakes are laid out in a pattern.
   Digging each of the **three trenches** gives one piece:
   - **Trench A:** her dropped field notebook page, with the words *"Osiris Shaft, level 3,
     niche behind the plaster."*
   - **Trench B:** the find-store key, which she buried on purpose and marked with a red
     stake. **Sieving** the spoil finds it.
   - **Trench C:** a survey stake with a Coptic word scratched on it, meaning "*house*".
     It's the player's first taste of the Codex's language, and it pays off in Ch2.
4. **Uncle Farouk's story** (the night guard, at the guard house). He saw a black Land
   Cruiser come the night Miriam left, and someone in the back seat who "sat like an old
   woman at a funeral" (a Keeper).
   - Bribe him with tea and cigarettes, or pay 500 EGP → `ch1a_farouk_bribed`. It pays off
     in Ch14: he lets you into the shaft without a fight.
5. **The staged night event.** Farouk warns that "the car always comes at midnight." At
   midnight, **a car does pull up**, and Lena Brandt's team searches Miriam's tent. You
   can hide and watch (learning Lena's name and "Vasse"), photograph them (evidence), or
   confront them (a short stealth escape).
6. **The find store.** It's sealed with a Ministry seal (the **seal minigame** reused):
   break it cleanly and reseal it so nobody knows. Inside, in a crate labeled "Late Period
   pottery, sherds," you find **the Codex**, wrapped in Miriam's scarf, with a note:
   *"Whoever finds this: don't give it to Vasse. Take it to Father Bishoy, El-Fishawy,
   Thursday."*
7. **The Osiris Shaft** (optional, but gives a big reward). Go down at night to the
   niche on level 3 where Miriam found it. There's a fresh cut in the plaster, and a
   **second, smaller niche** she missed, holding a bronze seal with Petamun's name. Keep
   it and it becomes a Ch14 key item (it makes the final door easier).
8. **Someone tries to take it.** As you leave the store, Lindqvist has called someone.
   Headlights on the plateau road.

**Exit choice** (`c1_exit`, see `03_CHOICES_AND_FLAGS.md` §2):
- **Quiet:** out through the quarry field on foot to the Cairo road.
- **Legal:** call the Ministry. Amira drives out herself, and the headlights turn back.
- **Deal:** Lindqvist's "Foundation car" offers you a lift and 5,000 EGP.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-01A-01 | The Rais's Son | Rais Abdallah | His son Mina works at a Nazlet el-Samman stable and owes a debt. Help him (race the horse, darts bet at camp) | `rel_abdallah` +, and the Qufti family helps in Ch10 |
| SQ-01A-02 | Hana's Conservation | Hana | Stabilize three fragile finds (seal minigame, pottery joins) | Hana becomes a Cairo contact (appraisal discounts) |
| SQ-01A-03 | The Tea Boy's Secret | Tea boy Saber | The **tea minigame**. Saber saw Lindqvist burning papers. Recover the half-burned ones from the trash pit | Proof of the Foundation payments (a Radwan proof item in Ch4) |
| SQ-01A-04 | The Truck of 1926 | Collectible trail | The old expedition truck: the detector finds four expedition relics (a camera, a diary) | The diary is a 1920s Keeper sighting (lore), plus good finds |
| SQ-01A-05 | Supply Line Blues | Rail foreman | Fix the jammed supply skip line (a timing minigame) | 1,500 EGP, and the workmen like you |
| SQ-01A-06 | Twelve Caches | Tips and exploration | The existing 12 caches become **Miriam's emergency caches** (water, cash, a spare phone, her backpack upgrade) | Rucksack, 3,000 EGP, a spare phone |
| SQ-01A-07 | Darts Night | Workmen | Win the camp darts tournament | 2,000 EGP and a nickname |

## JOBS
- Sieving spoil (Excavation XP)
- Hauling baskets
- Tea runs
- Detector sweeps of the old spoil heaps

## SECRETS
- The bronze Petamun seal (step 7)
- A painted sherd at the truck wreck (the existing painted sherd), which is a Ptolemaic
  ibis, the first deniable Thoth hint
- A limestone quarry mason's mark that matches a Codex cipher mark (Ch2 payoff)

## LEAVING
All exits go to **Ch2 Cairo**, arriving at night. Background-unique Ch2 lines: Hana texts
you, and Rais Abdallah's cousin runs a café in Cairo.
