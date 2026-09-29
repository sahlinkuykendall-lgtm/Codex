# CH14 — BENEATH GIZA (finale)

| | |
|---|---|
| Act | III (finale) |
| Biome | The Giza plateau at night, then deep underground: the Osiris Shaft and Petamun's final House, the Lesser Library |
| Size | Medium (dense and scripted) |
| Main hours | 2–3 |
| Revisit | **⟶ One-way.** A warning screen before the descent: *"Past this point there is no going back. Finish anything you want to finish first."* |
| Real places | The Giza plateau and pyramids at night, the causeway of Khafre, the Sphinx enclosure, the **Osiris Shaft** (real: three levels beneath the causeway, the lowest partly flooded, with a granite sarcophagus) |

---

## ARRIVAL: THE PLATEAU AT NIGHT
The Foundation has taken over the causeway under cover of a "privately funded restoration."
There are floodlights, a generator, a perimeter fence, and Vasse's security.

**Police depend on `radwan_path`:**
- **Honest:** Radwan's units wait at the Sphinx enclosure for your signal (a backup event
  in step 5).
- **Corrupt:** Radwan's men guard Vasse's perimeter.

**Ways in** (the player picks; several may be open):

| Entry | Needs |
|---|---|
| Uncle Farouk opens the old guard gate | Archaeologist + `ch1a_farouk_bribed` |
| Rais Gad's workers' path | Inspector |
| The Gebali robbers' tunnel from Nazlet el-Samman village | Gebali ≥ Trusted |
| The Keeper passage under the Sphinx enclosure | Keepers ≥ Trusted |
| The official way (with Amira's Ministry pass) | Ministry ≥ Sworn, or Radwan honest |
| Stealth past the perimeter | Always available (hardest) |

---

## MAIN BEATS

1. **Choose your team.** Bring **one ally** into the shaft (`06_SYSTEMS.md` §9). The others
   hold the surface: they distract, jam radios and cut the generator. Every ally still
   with you does *something*, and their surface actions play as intercut shots.
   - **Ally survival:** allies you **equipped** at Sinai (bought gear for) and allies at
     ≥ Trusted always survive. Others risk injury.
   - **Only three characters can die here:** Lena (defected but unequipped), Karim (if
     present), and Radwan (honest, if you didn't signal the backup in time). Youssef never
     dies in Ch14. His loss belongs to the Book alone.
2. **The Osiris Shaft.** Down the real levels. Level 1 is an empty chamber. Level 2 holds
   the stone sarcophagi. Level 3 is half flooded, with a granite sarcophagus on an island
   in black water. In the back wall is Miriam's cut, the first niche, and beyond the
   plaster, a door no one has opened since 395 AD.
3. **The seven-key door.** Every key from the journey, in order:
   1. The Codex (a page pressed to a recess)
   2. The star disk
   3. The Tanis cipher grid
   4. The Word of Amun (spoken)
   5. House 5's sign (from the box's bronze band, or its rubbing)
   6. The Philae half of the final lock
   7. The Serabit half of the final lock

   Petamun's bronze seal (the Ch1-A secret) makes the lock forgive one mistake. It's the
   final puzzle, and it uses everything you've learned.
4. **The Lesser Library.** A vast rock-cut hall of cedar shelves and sealed jars, more than
   300 scrolls, dry and perfect. At the far end, at a table, sits **Petamun**, mummified at
   his post with his last letter in his hands:
   > *"If you are reading this, you have walked the whole of Egypt to reach a room of
   > books. Good. Now you know what they are worth."*
   - **Opened track:** he's an **echo**. He speaks, and he knows about your Claimed.
5. **Vasse.** He arrives with Lena's team (unless she defected), or his own mercenaries.
   Miriam is with him if she was recaptured. He's gaunt and dying, and he's still charming.
   - **The fight** is stealth and set-piece: generators, flooding water, collapsing
     shelving. You defend the Library and try not to burn it down by accident.
   - **The signal:** call Radwan's backup (honest), or Hagg Mahmoud's men (Gebali Sworn).
   - **If `vasse_has_book` = true:** he's already begun to read. Stop him using any **one**
     of these (`04_ENDINGS.md` §3): Lena defected, Radwan honest, Gebali Sworn, Miriam
     `saved`, or Stealth 4. **Fail, and the game moves to Ending 7, The Usurper.**
   - **The Claimed** (opened track) appears at the water gate if they were lost in the
     Weighing. Talking them through the water is a last relationship check.
6. **Vasse's last scene** (sealed track). You decide how he leaves the room:
   - **Arrested** (Radwan honest)
   - **Let go** to die abroad
   - **Left in the dark** when the shaft floods
   - **Bargained with** (the Sale path)

   The endings reflect it.
7. > **BIG CHOICE 3: "WHAT HAPPENS TO THE LIBRARY?"** → `bc3_library`
   > - **Sealed:** reveal, sell, or reseal.
   > - **Opened:** read, return, or burn.
   > Quiet locks apply (`03_CHOICES_AND_FLAGS.md` §6). At least one option is always open.
8. **The ending** plays (`04_ENDINGS.md`), then the epilogue slides, then the last shot.

---

## AFTER THE CREDITS
- **Post-game free roam:** every revisitable region stays open, with the epilogue state
  applied (for example, Discovery shows museum crowds, and Burial shows Keeper shrines
  glowing). Side quests you haven't finished stay available.
- **New Game+:** choose another background. Your skills are kept at half, and your money
  is reset.
