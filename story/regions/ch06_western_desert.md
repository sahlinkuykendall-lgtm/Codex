# CH6 — THE WESTERN DESERT

| | |
|---|---|
| Act | II |
| Biome | Deep desert: the Bahariya oasis town and palm groves, the Black Desert's volcanic hills, the **White Desert's chalk formations**, Crystal Mountain, hot springs, the dune ocean of the Great Sand Sea |
| Size | **Huge** (the biggest open landscape in the game) |
| Main / side hours | 2.5 / 5 |
| Revisit | **Partial.** Bahariya town and the Black and White Deserts stay ↺ by road from Cairo. **The Great Sand Sea ⟶ closes after the sandstorm** (the dunes bury the track and the lost-army site) |
| Real places | **Bawiti** (Bahariya), the **Valley of the Golden Mummies** (found 1996), the **Temple of Alexander at Bahariya** (the only temple in Egypt with his cartouche), the **Black Desert**, **Crystal Mountain**, the **White Desert** (the "Mushroom and Chicken" formations), **Bir Sitta** hot springs, the **Great Sand Sea** |
| Built assets reused | The **White Desert chalk formations** (V3.8.x) and desert terrain systems from the old Ch1 |

---

## ARRIVAL
Five hours of desert road from Cairo or the Faiyum. **Lt. Tamer Saad's** checkpoint at the
oasis edge checks permits, and foreigners need one for the deep desert (a real
requirement). Bribe, show a Ministry permit, or talk (Egyptian Arabic 2).
**Aisha** explains why everything costs so much (see `05_ECONOMY.md` §1).

---

## MAIN BEATS

1. **The Keeper refuge.** Miriam's fuel receipts lead to an old mud-brick house in Bawiti's
   abandoned old town. It's a Keeper refuge, and it's empty. The old caretaker says she was
   here "for nine days. Then she said the birds were calling her home, and they took her to
   the river." *(She's at Hermopolis. It pays off in Ch8.)*
   The caretaker also tells you the Word of Amun must be heard at **Siwa**.
2. **Sheikh Salem's camp.** To reach Siwa across the desert you need a guide. You're taken
   to **Sheikh Salem**'s camp in the Black Desert: coffee three times, bread and salt, a
   hospitality test in dialogue (refusing food or rushing to business costs rep). His
   daughter **Aisha** will guide you if he agrees.
3. **The road west.** The caravan route into the Great Sand Sea past the White Desert (the
   chalk formations are the landmarks, and navigation uses them). Water management starts
   to matter here (thirst runs ×3).
4. **The stranded boy.** A Bedouin boy (Aisha's cousin Hamdi), his motorbike broken, is
   alone with no water. **`ch6_boy`** ★: carry him (you share water, which is slower and
   riskier) or leave him with a promise to send help.
5. **The sandstorm** (the staged event). Aisha warned at breakfast: *"The sky will go yellow
   after noon."* After noon the sky goes yellow, and the storm hits.
   - **If `ch6_boy` = carried, or Bedouin ≥ Neutral:** Salem's riders find you. It's a
     scripted rescue with you sheltering among the chalk towers.
   - **Otherwise:** a solo **survival sequence**, where you navigate by chalk landmarks,
     ration water and find a well. Failing means "Stranded" (`06_SYSTEMS.md` §7).
   - The storm buries the track behind you. **The Great Sand Sea closes.**
6. **The lost army.** The storm strips a dune and exposes bronze. Persian arrowheads, a
   sword, a skeleton in armor: **the Lost Army of Cambyses** (524 BC, real legend). This is
   optional, and starts **SQ-06-03** (it continues in Siwa).
7. **Siwa access** (see `02_FACTIONS.md` and `01_CHARACTERS.md`). You get in with
   `rel_salem` ≥ 25 **or** `rep_bedouin` ≥ Warm **or** a Ministry desert permit.
   - **If you have none of these, Siwa is RESTRICTED.** The **fallback**: the Word of Amun
     was also carved, damaged, into the **Temple of Alexander at Bahariya** (a real temple;
     the carving is fiction). A harder sound puzzle there gives the same key.

**Leaving:**
- **With access:** Salem's caravan or the army road to **Ch7 Siwa**.
- **Without access:** back to Cairo, then south to **Ch8 Hermopolis** (Ch7 is skipped).

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-06-01 | The Golden Mummies | A Bawiti museum guard | The **Valley of the Golden Mummies** (real, 1996). Night looters are digging an unexcavated tomb. Stop them, or join them | Ministry + or money. A Keeper shrine tile |
| SQ-06-02 | Crystal Mountain | Aisha | A calcite ridge (real). Photograph it at sunrise for a travel magazine | A photo job, and Aisha + |
| SQ-06-03 | **The Lost Army of Cambyses** | Aisha | A chain: map the storm-exposed sites, then follow a Persian officer's trail to Siwa (continues in Ch7) | `cambyses_found`. `ch6_cambyses`: return it to the clan, report, or sell (+150,000, Bedouin -20) |
| SQ-06-04 | Salem's Stars | Sheikh Salem | A night in the Black Desert: Bedouin star names and a poem. Name three stars correctly | Bedouin dialect XP, and Salem + |
| SQ-06-05 | Bir Sitta | A spring keeper | A hot-springs dispute between a hotel and farmers. Mediate it | Rep, and a free rest point |
| SQ-06-06 | The Mushroom and the Chicken | A tourist guide | Rescue a tour group whose jeep broke down among the famous White Desert formations | Money, and the guide becomes a jeep-hire discount |
| SQ-06-07 | Tamer's Dilemma | Lt. Tamer | He knows a smuggler is moving guns, but his captain is paid. Help him catch the smuggler clean | Ministry +, and Tamer waves you through forever |
| SQ-06-08 | The Camel Market | A camel trader | Buy your first camel (haggling). A race at the oasis edge | A camel, and riding XP |
| SQ-06-09 | The Hungarian's Cache | A 1930s logbook in the refuge | The explorer **László Almásy** (real, 1930s) left a supply cache out in the desert. Find it | A Rare find: his map, which marks a Siwa secret (Alexander chain) |
| SQ-06-10 | Hamdi's Bike | Hamdi (if carried) | Fix his motorbike (carpentry-lite and parts) | Bedouin +, and Hamdi becomes a messenger |

## JOBS
- Camel caravan escort
- Date harvest (Bahariya)
- Desert tour guiding
- Detector hunting (Roman sites)
- Photography

## SECRETS
- **The White Desert "Inselberg"**, the tallest chalk tower: climbable, with Keeper shrine
  tile #4 at the top
- **The Black Desert's lava cave:** a Rare find and a desert fox den (a pet-companion
  easter egg)
- **Star collectibles:** 12 Bedouin star names learned across the desert nights

## DAY / NIGHT
- Travel at dawn and dusk; noon is dangerous (thirst ×5).
- Nights are cold (a fire is needed at camp).
