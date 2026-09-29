# CH5 — THE FAIYUM

| | |
|---|---|
| Act | II |
| Biome | An oasis basin: a huge salt lake, farmland watered by ancient canals and creaking waterwheels, desert escarpments, a fossil valley |
| Size | Large |
| Main / side hours | 2.5 / 4 |
| Revisit | ↺ |
| Real places | Faiyum's **waterwheels** (sakias), **Lake Qarun**, the **pyramid of Amenemhat III at Hawara** (site of Herodotus's Labyrinth), **Tunis pottery village**, **Qasr Qarun** temple, **Karanis** (Kom Aushim), **Wadi el-Hitan** (the Valley of the Whales, a UNESCO fossil site) |

---

## ARRIVAL
The Act II opening cinematic: the road off the desert drops into a green bowl, and the
waterwheels groan. The state depends on `bc1_side`:

| `bc1_side` | Who's in the Faiyum |
|---|---|
| Ministry | Amira travels with you on permits. Vasse's hit squad is already in the region |
| Vasse | A Foundation Land Cruiser and stipend. The Keepers are watching and hostile |
| Gebali | A Gebali safehouse in Faiyum city. Police patrols looking for you |
| Alone | Everyone, a little |

---

## MAIN BEATS

1. **Miriam's car.** A tip leads to her rental car, abandoned at the desert edge south of
   the lake. Inside: fuel receipts from **Bahariya** dated *after* she vanished, and a
   drawing of an ibis. *(This sets up Ch6.)*
2. **The Keeper warning** (the staged event). In **Tunis village**, the potter **Sayed**
   invites you in for tea and, while shaping a pot, tells you plainly: *"Stop. You don't
   know what's in the last box. We've kept it closed for sixteen hundred years."* This is
   the Keepers' first contact.
   **`ch5_keeper_warning`** ★: listen (Keeper shrine fast travel unlocks now), threaten
   him, or report him.
3. **Finding the Labyrinth.** At Hawara, the mud-brick pyramid of Amenemhat III stands
   beside a waterlogged field of limestone chips. That's all that's left of what Herodotus
   called greater than the pyramids (real). The cipher grid, laid over the field, marks
   an entrance under a canal culvert.
4. **THE LABYRINTH OF HAWARA** (the biggest puzzle dungeon of Act II):
   - **Structure:** twelve courts, like Herodotus described, laid out in three water
     levels. The whole place is a **water-level machine**: opening sluices floods some
     courts and drains others.
   - **The player must:**
     - Map the courts (the phone drawing tool)
     - Route water to raise floating stone platforms
     - Read Hieroglyphs-2 plaques naming the old nomes
     - Avoid "the crocodile rooms," where sacred-crocodile mummies stand in the shallows
       (Sobek was the Faiyum's god, which is real)
   - **Enemies by `bc1_side`:** Vasse's squad (stealth), Keeper saboteurs (they flood your
     route), or police.
   - **An optional wing** with Dr. Rania's trapped student (SQ-05-03).
5. **House 3.** In the central court: **110 scrolls** of mathematics and astronomy (the
   narration names lost works, such as Eratosthenes's lost geography). Petamun's second
   letter says the next House *"opens only to the Word of Amun, where the son of Amun was
   named."* That means **Siwa**, where Alexander was named son of Amun.
6. **Petamun's Coptic notes** (need Coptic 1, or Bishoy by phone at Warm): the Word of Amun
   is **spoken, not written**. You must *hear* it at the Oracle.
7. **The lake night** (romance-eligible). At Lake Qarun at sunset, if `rel_amira` is
   Bonded: `rom_amira`. Otherwise it's a quiet talk about Miriam with whoever is with you.

**Leaving:** the road southwest to **Ch6 the Western Desert** (Bahariya). It needs a 4×4 or
a jeep hire, or Youssef refuses to take Nefertiti into the desert (a funny scene).

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-05-01 | The Singing Wheels | A farmer | Repair three waterwheels (carpentry) before the irrigation day | Village rep, and free food and lodging |
| SQ-05-02 | Sayed's Kiln | Sayed (if you listened) | Fire a pot the Keeper way: your pot bears a Keeper sign | Keepers +10, and a **Keeper hall** under the workshop (Trusted) |
| SQ-05-03 | The Student in the Water | Dr. Rania Khalil | Her student went into the Labyrinth's flooded wing. Find him | `ch5_student`: Rania's fossil jobs, and she appears at *The Discovery* |
| SQ-05-04 | Whale Valley | Dr. Rania | Map fossil whale skeletons at **Wadi el-Hitan** (real) and stop fossil poachers | Photography and Excavation XP, and a big reward |
| SQ-05-05 | The Crocodile Priest | Echo quest (**opened track only** on revisit) / a sealed-track legend | A priest of Sobek's ghost at **Qasr Qarun**. On the sealed track it's a museum audio guide bug that "talks back" (deniable) | A Rare find |
| SQ-05-06 | Karanis Granary | Ministry archaeologist | Stop grain-store looting at **Karanis** (a Roman town, real) | Ministry +, and the looter joins your informants |
| SQ-05-07 | The Salt Harvest | A lake fisherman | Lake Qarun is saltier than the sea (real). Help with the salt harvest, and fish at night | Fishing, money |
| SQ-05-08 | Pots for the Market | Tunis potters | Sell pottery at the Faiyum Thursday market (a haggling minigame) | Money, Haggling XP |

## JOBS
- Fishing (Lake Qarun)
- Waterwheel carpentry
- Fossil survey (with Rania)
- Pottery market selling
- Guiding (desert-lake tours)

## SECRETS
- **The Labyrinth's hidden 13th court** (Herodotus says 12): the best loot in Act II, a
  gold Sobek crown (Major)
- **Medinet Madi's** crocodile nursery (real site): a Keeper shrine tile
- **Karanis coins:** 8 collectibles

## DAY / NIGHT
- The Labyrinth's water levels change at dawn and dusk (tides from the canal sluices).
- The Tunis market is on Thursdays.
