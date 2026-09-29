# CH10 — THE RIVER (Qena to Kom Ombo)

| | |
|---|---|
| Act | III (opening) |
| Biome | The Nile itself: a long river corridor of fields, villages, sandstone cliffs and temple towns. Most travel is by the Hathor |
| Size | Large, but linear (a river strip with stops you can land at) |
| Main / side hours | 2.5 / 4 |
| Revisit | ↺ (the Hathor sails the whole river) |
| Home base | The Hathor (mobile) |
| Real places | **Quft (ancient Coptos)**, where in the Setne tale the Book was first found at the bottom of the river. **Dendera** (the Hathor temple, a Coptos side trip), the **Esna lock and temple** (boat vendors row up to sell to passing ships, which is real), **Edfu** (the best-preserved temple in Egypt, with its real **"House of Books"** whose walls list the titles of the temple library), **Gebel el-Silsila** (sandstone quarries where the Nile narrows), **Kom Ombo** (the double temple, and the **Crocodile Museum**) |

---

## CHAPTER OPENING: THE FRAME

**`radwan_path` locks now:** `honest` if he has 2 or more conscience points
(`01_CHARACTERS.md`).

| `radwan_path` | What happens |
|---|---|
| **Corrupt** | Vasse frames you for the Qurna night. **Heat jumps to 4 nationwide**, your account freezes, and Amira is suspended pending a hearing in Cairo. You must go to Cairo for her hearing (a **Cairo interlude mission**), and **Radwan raids your hideouts** |
| **Honest** | Radwan meets you secretly on the Luxor corniche at night. He clears your record (heat 0), tells you Vasse has chartered a cruise ship to shadow you, and gives you the ambush point: **Gebel el-Silsila**. No raid |

### The Cairo interlude (corrupt only): where can you hide?

| Hideout | Needs | Result |
|---|---|---|
| The Fahmy family flat, Shubra | `ch2_wedding` | Safe. Samah feeds you and scolds you. Youssef +10 |
| Umm Hassan's rooftop | `ch2_umm_hassan` | Safe. She lies to the police's faces |
| The Gebali safehouse | Gebali Trusted | Safe, for a price |
| The Foundation villa | Vasse Trusted | Safe, but Vasse knows exactly where you are |
| The City of the Dead family | SQ-02-03 done | Safe, among the tombs |
| **None of the above** | — | **Arrested.** Jail at Abdeen (`06_SYSTEMS.md` §7: bail, lawyer, ally, or breakout) |

**Youssef's risk:** if Youssef drives you during the raid and you get caught, he's
**arrested instead of you** (the "ally takes the fall" failure). Bail him out within two
in-game days, or `youssef_state` = `jailed`.

At the hearing, you can speak for Amira (Ministry +10, `rel_amira` +15), or stay hidden.

---

## MAIN BEATS

1. **North to Coptos first.** The Codex's margin (Petamun's Coptic note) says: *"Before you
   go south, go where the Book came out of the river."* So you sail north from Luxor to
   **Quft**.
   - **Rais Abdallah's family** (the Quftis, Egypt's hereditary dig foremen, which is
     real) keep an archive of every dig their grandfathers worked since the 1890s. Their
     1912 papers record a Saqqara tomb "where the magician's wife and son are painted by
     the river": **Naneferkaptah's tomb.** → `ch10_tomb_known`.
     (It's easier if the Archaeologist did SQ-01A-01. For the Inspector it's already known.)
   - **Opened track:** at the river's edge at night, the dead speak (**echo quest**). A
     drowned woman and boy, Ahwere and Merib from the tale, ask you to take the Book "home
     to him." This also sets `ch10_tomb_known`, and it's the first time the opened-track
     player hears the Return idea spoken aloud.
   - **The Claimed, stage 1 (Dreams):** your Claimed ally tells you about a river dream.
     It's funny at first.
2. **Esna lock** (the staged set piece). Ramzi says: *"At Esna the ships wait in line for
   the lock. The vendors row out and throw galabeyas up onto the decks."* That's real and
   delightful.
   - **If Vasse has the Book** (you sided with him), this is **SQ-10-M "The River Heist"**:
     Vasse's chartered cruise ship, the *Sobek Queen*, is in the lock queue beside you.
     Board it disguised as a vendor, find the box in the purser's safe, and get off before
     the lock opens. Succeed and `vasse_has_book` = false. Fail and it stays true (an
     Usurper risk).
   - **Otherwise:** a tense wait beside the Sobek Queen, where Lena watches you from her
     deck. `rel_lena` ≥ 30 → she sends a note: *"Silsila. Tomorrow. Don't be on deck."*
3. **Edfu's House of Books.** In the real temple library room, the walls list the titles of
   sacred books. Among them is one Petamun's Codex refers to, and a chisel mark hides
   Esmet-Akhom's sign: the priests of Philae added to the list. It's the next clue:
   *"Philae, below the waters that came after."*
   (Petamun could not have known of the dam. The Keepers later added the clue, and that's
   a Keeper reveal.)
4. **The Silsila ambush.** Where the Nile narrows between sandstone quarry cliffs, Vasse's
   men strike from speedboats. It's a **river chase**: Ramzi steers the Hathor while you
   fight fires, cut a grappling line, and use an ally (Nour isn't met yet, so this is
   Youssef, Lena or Amira).
   - **With Lena's warning:** you're ready, and it's an easy escape.
   - **Honest Radwan:** a police boat arrives at the end.
5. **Kom Ombo.** A crocodile-god temple and its Crocodile Museum (real). **Ghaffar**, the
   museum keeper, is the last Keeper before Aswan. He gives you the Keepers' Philae
   password (Keepers ≥ Neutral), or tries to take the Codex (Keepers Hostile, a stealth
   defense).
   - **Opened track:** the mummified crocodiles' echo gives an extra piece of the Claimed's
     cure (§ `04_ENDINGS.md` §4).

**Leaving:** sail on to **Ch11 Aswan**.

---

## SIDE QUESTS

| ID | Name | Giver | Summary | Outcome |
|---|---|---|---|---|
| SQ-10-M | **The River Heist** | Auto (if Vasse has the Book) | See step 2 | `vasse_has_book` |
| SQ-10-01 | Dendera's Zodiac | A Dendera guard | The famous zodiac ceiling was taken to Paris in 1821 (real). Photograph the replica and the scar where it was cut | Photography, a history lesson, Ministry + |
| SQ-10-02 | Esna's Vendors | A vendor family | Row and sell with them at the lock for a day (a throwing minigame) | Money, and a fun scene |
| SQ-10-03 | The Quft Archive | The Qufti family | Catalogue their 130 years of dig papers | Lore, `ch10_tomb_known` (if not already), and Excavation XP |
| SQ-10-04 | The Silsila Quarry Marks | A quarry guard | Photograph the ancient quarry marks and graffiti | Hieroglyphs XP, collectibles |
| SQ-10-05 | Ramzi's Son | Ramzi | His son wants to leave the river for Dubai. Help him decide | `rel_ramzi` +, and the Hathor's crew bonus |
| SQ-10-06 | Crocodile Farm | Ghaffar | Nile crocodiles are back below the dam (real). Help rescue one from a fisherman's net | A funny, tense rescue. Ghaffar + |
| SQ-10-07 | Sugar Train | A cane farmer | Race the cane train along the riverbank on horseback | Riding XP, money |
| SQ-10-08 | Abu Ali's Visit | Abu Ali (if `ch4_reeds`) | Your Delta friend comes upriver to sell fish. He brings a warning from a Vasse boat crew | Intel, and `rel_abuali` + |

## JOBS
- Felucca fares
- River fishing
- Boat repair
- Guiding at Edfu and Kom Ombo
- Photography

## SECRETS
- **Edfu's hidden crypt** (fiction): a sealed room below the House of Books, with a Rare
  find
- **Silsila's shrine of Horemheb** (real rock-cut shrine): Keeper shrine tile #8
- **River collectibles:** 10 Nile-flood marks carved on old quays
