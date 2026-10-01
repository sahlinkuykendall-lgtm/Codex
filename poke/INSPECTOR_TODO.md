# The Inspector's opening (Saqqara, Chapter 1-B, poke-style): what's left

Started 2026-09-30 at P0.23. **Source of truth:** `story/regions/ch01_opening_inspector.md`
(the beats, side quests, jobs, secrets) and `story/01_CHARACTERS.md` §Ch1-B (who's in it).
The flags are in `story/03_CHOICES_AND_FLAGS.md`.

**The aim:** the same size as the Archaeologist's Giza camp, and about as much to do, but
its own place, its own people and its own story. Only the Inspector ever plays it.

Rules (the same as Area 1's, plus two):
- Crisp pixel art only. Every update gets a POKE-STYLE P0.x entry in `UPDATE_LOG.md` and a
  bump of the title version in `poke/ui.js`. Commit and push `poke-style` after each step.
- **Don't touch the Giza area's look.** `poke_look.js` must show Giza's 33 views identical
  unless a change was meant for Giza.
- **Only the bible's people.** The named cast of Ch1-B is Director Fathi Mansour, Inspector
  Samy Ragab, Umm Sabry and Rais Gad. Karim el-Gebali and Colonel Radwan arrive in their
  beats, and Dr. Amira Sayed is on the phone. Nobody from the Giza story appears (Rais Gad
  can *mention* his cousin Abdallah; the bible says they're cousins). Everyone else is a
  nameless local: the ghaffir, the camel man, the market, the tourists.
- **Every map gets water and food** (see `AREA1_TODO.md`): here the village well, water
  jars at the inspectorate, the Teti dig and the Serapeum, the bakery, the café, the fruit
  stall, and Umm Sabry's tea.
- **Every building you can see has an inside** unless the story keeps you out.
- Test with `tools/poke_checks/`. The audit now checks every area. Add an Inspector
  playthrough to `poke_playthrough.js` when the beats are in.

**How it's built:** `poke/areas.js` says which map, objects, start time and story hooks each
background uses. Saqqara is `poke/saqqara.js` (the layout), `poke/map_ch1b.js` (what things
say), `poke/sprites_ch1b.js` (the art) and `poke/ch1b_scenes.js` (the story). The day starts
at 08:30 on Tuesday. The story runs through the night, and the clock ends at 04:40 like
Giza's.

---

## 1. The area, the cast, beat 1 — ✅ DONE in P0.23
> Done:
> - the area framework, and the Saqqara map (80×58, the same as Giza's 78×58) with 11
>   places and 66 things to look at
> - new ground: fields and asphalt roads
> - a new sprite for every building and landmark; the inspectorate interior (the
>   Director, the ledger, Shelf 4B)
> - the cast placed with first lines; water and food
> - beat 1 (tea with Umm Sabry, the Director, the ledger)
> - the Inspector is playable from the intro, with the bible's Investigation skill added
>   to the skills

## 2. Beat 2: the inspection round (the job tutorial) — ✅ DONE in P0.27
> Done in `poke/ch1b_seals.js`:
> - **the seal check minigame**: the register's stamp beside the clay on the door; mark
>   what's wrong (eight ring signs, the emblem, three digits), then sign. Old clay is worn,
>   not forged.
> - **three sealed doors on the map**: the South Tomb's stairway, the Mastaba of Kagemni
>   (Teti cemetery), and a service door in the cliff by the Serapeum; the last one is
>   forged (a ring sign and the last digit, the clay still damp)
> - **Samy's Cleopatra cigarettes** by the service door
> - lines for the ghaffir (a motorbike with no light last night), Fathi ("in triplicate",
>   "go home early") and Samy (who rides off to Mit Rahina)
> - the compass leads round the beat
>
> Beat 3 (the tail) picks up from the `c1b_tail` task.

Check three tomb seals on your beat: the Step Pyramid complex, the Teti cemetery, and the
Serapeum. At the Serapeum you find Samy's cigarettes by a service door that should be
locked. **The seal minigame is reused** (`MINIS.seal` in `poke/minigames.js`), reworked for
reading seals and **spotting a forged one**.

## 3. Beat 3: follow Samy (the stealth tutorial) — ✅ DONE in P0.29
> Done in `poke/ch1b_tail.js`:
> - Samy at the Mit Rahina café (his bike at the garage); come near and he sets off
>   through the market to the museum garden, looking back at three corners and glancing
>   round at the spice stall
> - **view cones** on the ground (yellow; red while he sees you), cut short by stalls,
>   carts, the tuk-tuk and buildings; standing among people hides you in the crowd
> - a **suspicion meter** over his head: it fills while he sees you (faster up close), on
>   his heels, and when you run near him. Full, or too far behind, and he goes back to the
>   café to try again
> - **the meeting** by the alabaster sphinx: get within earshot unseen and hear Karim
>   el-Gebali pay Samy, and give the order for tonight (the locker, the service room, "my
>   man comes after midnight")
>
> Beat 4 picks up from the `c1b_night` task.

A daytime tail through Mit Rahina's market. Stay in sight but out of his line of view: the
stalls, the tuk-tuk and the crowd are cover. He meets **Karim el-Gebali** (sharp trainers).
A new mechanic: view cones for the people you're tailing.

## 4. Beat 4: the evidence store and the Serapeum at night — ✅ DONE in P0.31
> Done in `poke/ch1b_serapeum.js`:
> - wait for night on the bench at the ghaffir's hut (the gate sends you there if it's early)
> - after eleven, the old ghaffir opens the tourist gate and "sees nothing"; his son does
>   the night rounds inside
> - **the galleries** (`INT_SERAPEUM`, dark): the main gallery, seven granite Apis coffins
>   in their chambers, rock between them, dim emergency lights, the steps up
> - **the night ghaffir's patrol**, with a lantern and a view cone (the tail's rules):
>   seen, and his shouting sends you back to the steps
> - **the service room** at the east end: pumps, a workbench, the steel cabinet and the
>   service door. Reach it and Samy comes in seven seconds later with a torch, puts a
>   cooler bag in the cabinet, sweeps the room and goes. Seen, and he runs with the bag
>   (try again)
> - **the Codex** in the bag (tag SAQ/EV/0419, Shelf 4B): you leave a brick in its place;
>   Miriam's note stays for beat 7
> - outside: a black car turning in at the inspectorate, which sets up beat 5
>
> Beat 5 picks up from the `c1b_blackcar` task.

At night, Samy moves the Codex from his locker to the Serapeum's service room for pickup.
- **The Serapeum galleries:** a new interior. Huge granite bull sarcophagi in long dark
  galleries, a torch, a stealth section.
- You find the Codex in a cooler bag.

## 5. Beat 5: the staged arrival — ✅ DONE in P0.32
> Done in `poke/ch1b_radwan.js`:
> - after the Serapeum, a black Mercedes (police plates, lights on) in the inspectorate yard;
>   Director Fathi and **Colonel Khaled Radwan** at the office door; the driver smoking in
>   the gateway; Umm Sabry has gone home; the office door is off limits while they're there
> - their view cones (the driver watches the road and the wall, the Colonel the yard, the
>   Director over his shoulder); seen, and you back off into the dark and try again
> - listen from behind the compound wall or the Peugeot: Fathi hands over a sealed evidence
>   box "from Shelf 4B"; Radwan weighs it, doesn't open it: "The Foundation thanks you.
>   Mr. Vasse will be—". It's empty; nobody knows you have the Codex
> - the car goes; new task `c1b_panic`

Umm Sabry warned that "a black car comes for Fathi on Tuesdays." Headlights at the gate:
**Colonel Radwan** arrives to "collect evidence" for Vasse, and Fathi hands over an empty
box. Nobody knows yet that you have the real thing. (A timed event, like Giza's midnight
car.)

## 6. Beat 6: Samy's panic — ✅ DONE in P0.33
> Done in `poke/ch1b_panic.js`:
> - a while after the black car, a message from the old ghaffir: Samy is in the galleries
>   with a torch and a knife; the night ghaffir is hiding in the pump room
> - at the gate, the vet's dart pistol (Ministry issue, for rabid dogs, one dart): take it
>   or not
> - in the galleries Samy tears the chambers apart, his torch a jerking cone. If he finds
>   you it's a standoff; get right up behind him first and you take the knife
> - **talk** (he confesses: Karim paid him twenty thousand to take it before Radwan came
>   for it; Vasse wanted it the proper way; Karim meant to sell it to Vasse for ten times
>   as much; "Fathi knows only how not to know"), with an extra line if you bagged his
>   cigarettes; **dart** him; or **run**. Push him ("you're finished") and he lunges
> - then **expose him to Fathi** (`ch1b_samy_exposed` ★; Fathi thinks Karim's man has the
>   Codex) or **let him flee** (`ch1b_samy_informant`: he owes you). Running leaves him
>   gone by morning. `ch1b_samy_fate` = exposed / fled / ran
> - nobody learns you have the Codex

Samy comes looking for the Codex with a torch and a knife: a standoff in the galleries.
- **Talk him down:** he confesses. Karim paid him, Vasse wanted it, Karim was going to sell it.
- **Tranquilize him**, or **run**.
- **Expose him to Fathi** → `ch1b_samy_exposed` ★ (Karim's crews are Cold to you in Ch2).
- **Let him flee** → Samy becomes a small Ch2 informant (he owes you).

## 7. Beat 7: Miriam's note, and the exit — ✅ DONE in P0.34 (the main story is complete)
> Done in `poke/ch1b_exit.js`:
> - look at the Codex somewhere nobody can see you (SPACE on it in the bag, or the
>   ghaffir's bench): in the flap, Miriam's note, "Father Bishoy, El-Fishawy, Thursday.
>   Don't trust the police."
> - a message from an unknown number: Karim, who can count bricks, offering 5,000 to hold it
> - `c1_exit`: **quiet** (leave, a microbus to Cairo, the Codex in a bag of oranges),
>   **legal** (Dr. Amira Sayed comes herself; the Codex logged back in with her signature;
>   rel_amira +15, rep_ministry +10; Karim's name given, and Samy's too unless you let him
>   flee, so the two choices don't fight), **deal** (5,000 EGP by a boy on a scooter; rep
>   Gebali +10; you owe them)
> - the chapter-end card (SAQQARA), with what carries forward
> - **the lore seed:** Umm Sabry's Saqqara story (after the tea, by day): Setne and the
>   tomb of Naneferkaptah, "the magician's wife and son are painted on the wall by the
>   river" (`ch1b_tomb_story`; the sealed tomb in the far corner matches)

Inside the Codex's flap: *"Father Bishoy, El-Fishawy, Thursday. Don't trust the police."*
Then the exit choice `c1_exit`:
- **Quiet:** take it home and vanish on leave.
- **Legal:** take it straight to Dr. Amira Sayed at the Ministry in Cairo (`rel_amira` +15).
- **Deal:** Karim offers 5,000 EGP to "hold it for a week", and you owe the Gebali.

Then the chapter-end card. **Inspector-only lore seed:** Umm Sabry's story of the tomb
"where the magician's wife and son are painted by the river" (Naneferkaptah, from the
Setne tale) sets `ch10_tomb_known` after Ch9.

## 8. Side quests (bible §SIDE QUESTS, SQ-01B-01 to 09) — ✅ DONE in P0.35
> Done in `poke/ch1b_side.js` (and the tawla minigame in `poke/ch1b_tawla.js`):
> - **01 Umm Sabry's Price:** the well girls' gossip (the baker and Madame Nadia, the
>   accountant) pays it; her tip (Fathi's second phone that only rings on Tuesdays) and her
>   network (`ch1b_umsabry_network`, for the Return-ending cameo)
> - **02 The Camel Men:** "twenty to get on, two hundred to get down": fine them, let them
>   go, or organize them (a price board, a licence form); organized, they give you camel
>   rides (the Serapeum, Mit Rahina, the inspectorate, the Teti dig)
> - **03 Rais Gad's Tunnel:** a night stakeout at the robbers' hole; two Qurna men ("Hagg
>   Mahmoud won't like this"); photograph them or not; a faience wedjat to log with the Rais
>   (Ministry rep)
> - **04 The Colossus:** Léo, lost at the colossus; his parents at the coach park; 150 EGP
>   and the guiding job unlocked (`c1b_guide_job`; the job itself is step 9)
> - **05 The Forged Seal:** Fathi, after the round: "check them, quietly"; three mastabas in
>   the mastaba field, two forged with the service door's faulty stamp, S.R. in the
>   register (`ch1b_forged_seals`, evidence for Radwan's conscience track)
> - **06 The Serdab's Eyes:** look through the holes (a picture), photograph him (C)
> - **07 The Café's Backgammon:** the champion, unbeaten since 1994; 5 EGP a game, 100 if
>   you win, village rep
> - **08 The Well Girls:** their jerrycan cap is under the cloth stall
> - **09 The Mechanic's Receipt:** in the red Fiat's glovebox; in beat 6 it adds lines for
>   Samy and Fathi, not a different outcome, not a Radwan point
> - by day only: the children, the old men, the tourists, the guide, the camel man

| Quest | Giver | What happens |
|---|---|---|
| Umm Sabry's Price | Umm Sabry | Gossip for gossip: who's romancing the accountant? (Already a task.) Unlocks her network: tips about Fathi, and a Return-ending cameo |
| The Camel Men | The camel man | Unlicensed rides scamming tourists: fine them, let them go, or organize them. Local rep; they give you rides later |
| Rais Gad's Tunnel | Rais Gad | Robbers dug into the closed mastaba (the fresh hole is on the map). Stake it out at night. A good find, Ministry rep, and it introduces the Qurna robbing families |
| The Colossus | A lost tourist child | At the Ramesses colossus, find the parents (the two tourists are there). Small reward, and a guiding job unlocked |
| The Forged Seal | Fathi | Forged tomb seals across the site: compare them (the seal minigame). It's Samy; evidence for the Radwan conscience track |
| The Serdab's Eyes | The serdab | Photograph Djoser through the eye holes (C, the camera). Photography XP |
| The Café's Backgammon | The café champion | Beat him at tawla (a new minigame, kept for Madame Samira's café in Ch2). A small purse, village rep |
| The Well Girls | The girls at the well | Find their jerrycan's cap in the market. Village rep, and gossip for Umm Sabry |
| The Mechanic's Receipt | The mechanic | The receipt for Samy's bike (cash, from Cairo). Extra proof in beat 6: new lines, same outcome, not a Radwan conscience point |

**The same amount to do as Giza:** Area 1 has 11 side quests. Ch1-B has nine (the bible's
five, plus four added to the bible on 2026-09-30 after checking they conflict with nothing),
plus three jobs, two secrets and the seal register.

## 9. Jobs, the collection, minigames — ✅ DONE in P0.36
> Done in `poke/ch1b_jobs.js`:
> - **the seal register and the seal shift:** the duty roster on the inspectorate wall;
>   eight sealed tomb shafts across the necropolis (each with the seal minigame), 40 EGP a
>   seal, 100 for the shift; two forged with Samy's faulty stamp (60 EGP each for reporting
>   them; they start The Forged Seal if it isn't started). The register is in the bag
> - **guiding:** after Léo's father vouches for you, the tour group at the coach park bus;
>   the guide's quiz (new): six of nine questions about the complex, 120 EGP + 30 per right
>   answer, one tour every two hours, by day
> - **sieving at the Teti dig:** three heaps a day for Rais Gad, paid by the finds

- **Jobs (bible §JOBS):**
  - seal inspections (a paid shift)
  - guiding tourists round the Step Pyramid complex (a quiz-style minigame)
  - sieving at the Teti excavation (the sieve minigame, reused)
- **The seal register** (the Inspector's counterpart to Miriam's metal detector): tomb seals
  all over the necropolis, each checked and logged for pay. A few are forged (they lead
  into The Forged Seal).
- **Minigames:** the seal (reused, reworked), the sieve (reused), the tail (new, beat 3),
  and the guide's quiz (new).

## 10. Secrets (bible §SECRETS)
- **The Serapeum's sealed 26th gallery** (fiction): a Late Period Thoth statuette (a
  deniable hint) and a Rare find.
- **Naneferkaptah's tomb:** already on the map, the sealed doorway in the far south-west
  corner ("a river, a woman and a small boy"). You can notice it but not enter; players
  see it again in The Return.

## 11. Rooms and the rest
- **Interiors:** the café, the bakery, the mosque, the garage, a village house, the ghaffir's
  hut and the museum's kiosk, plus the Serapeum (beat 4). The Serapeum's gate is story-locked
  until the round.
- **The phone:** Inspector messages and calls (Amira; Fathi calling in Ch2).
- **Rest:** wait or sleep somewhere (Umm Sabry's corner by day, the ghaffir's bench by night).
- **The checks:** an Inspector playthrough with each exit, save and load mid-night, and the
  speed check.
