# The Fixer's opening (Marsa Tarfa, Chapter 1-C, poke-style): what's left

Started 2026-10-01 after P0.39. **Source of truth:** `story/regions/ch01_opening_fixer.md`
(the beats, side quests, jobs, secrets), `story/01_CHARACTERS.md` §Ch1-C (who's in it) and
§Backgrounds (the Fixer's skills and gear). The flags are in `story/03_CHOICES_AND_FLAGS.md`;
the debt collectors in `story/06_SYSTEMS.md` §7.

**The aim:** the same size as Giza and Saqqara, and about as much to do, but its own
place: a Red Sea harbour, sea and reef instead of sand. Only the Fixer ever plays it.

Rules (the same as the Inspector's):
- Crisp pixel art only. Every update gets a POKE-STYLE P0.x entry in `UPDATE_LOG.md`, a bump
  of the title version in `poke/ui.js` and of `?v=` in `poke.html`. Commit and push
  `poke-style` after each step.
- **Don't touch Giza's or Saqqara's look.** `poke_look.js` must show Giza's 33 views
  identical unless a change was meant for Giza.
- **Only the bible's people.** The named cast of Ch1-C is **Bassem "the Shark" Nassar**,
  **Captain Zaki** and **Rana Fouad** (the Fixer's ex). **Lena Brandt** arrives with the
  truck in beat 4 (the bible puts her here). **Dr. Amira Sayed** is on the phone if you go
  legal. Nobody from the Giza or Saqqara stories appears (Karim only *knows your name* in
  Ch2). Everyone else is a nameless local: Bassem's two collectors, the fisherman, the old
  man at the fort, the hotel cook, Bassem's sister and her boy, the coast guard officer, the
  truck driver, the ship's crew.
- **Every map gets water and food:** a public tap and water jars, the fish grill on the
  harbour, a ful and ta'ameya cart, the truck stop café, the hotel kitchen, tea on Zaki's
  dhow.
- **Every building you can see has an inside** unless the story keeps you out.
- Test with `tools/poke_checks/`: the audit checks every area; add `poke_fixer.js` (a
  Fixer playthrough, like `poke_inspector.js`) once the beats are in.

**How it'll be built** (like Saqqara): `poke/marsa.js` (the layout), `poke/map_ch1c.js`
(what things say), `poke/sprites_ch1c.js` (the art), `poke/ch1c_scenes.js` (the story), and
one file per beat after that. The day starts in the morning; the truck comes at ten at
night; the clock ends at 04:40 like the others.

**The Fixer's own skills get used here first:** Haggling 3 (prices and bribes), Lockpicking 2,
Diving 1, Egyptian Arabic (street). New minigames: **haggling**, **lockpicking**, **diving**,
**the boat chase**, **first aid** and **fishing**.

---

## 1. The area, the cast, beat 1: morning in Marsa Tarfa — ✅ DONE in P0.40
> Done in `poke/marsa.js` (the layout), `poke/map_ch1c.js` (what things say), `poke/sprites_ch1c.js`
> (the art) and `poke/ch1c_scenes.js` (the story):
> - **the map** (80×58): the town (thirteen houses, the mosque, the café, the kiosk, the square with
>   its tap), the harbour (quays, breakwaters, the fish market and grill, the fuel store, Zaki's
>   dhow, fishing boats, the coast guard post and its patrol boat), the north beach and the hotel,
>   the Ottoman fort on the headland, Bassem's walled villa on the south point (locked until beat
>   2), the reef offshore, the coast highway, the truck stop, the wadi
> - **new ground:** sea (foam at the beach), the reef (coral under the water), beach, quays
> - **the cast:** Captain Zaki, Rana Fouad, Bassem's men, and sixteen nameless locals with first
>   lines; water and food (the tap, three sets of water jars, the grill, the ful cart, the café,
>   the kiosk, the truck stop café, Rana's cooler, your sink)
> - **beat 1:** Bassem's two collectors at your door (pay, haggle or refuse "something for our
>   trouble"), the debt in the phone's bank app, Zaki at his dhow, Rana in her shop, the
>   summons to the villa at five
> - **rooms:** your flat and Rana's dive shop
> - **the Fixer is playable** from the intro (Egyptian or foreign: Egyptian Arabic 5 and reading
>   2, and less money)
- **The map** (about 80×58, like Giza and Saqqara), the sea on the east:
  - the harbour: quays, fishing boats, **Captain Zaki's dhow**, the fish market and grill
  - the town: whitewashed houses with blue doors, **your flat**, a café, a mosque, a
    kiosk, **Rana's dive shop**
  - **Bassem's seafront villa** on the point (a wall, a gate, a terrace over the water)
  - **the coast guard post** at the harbour mouth
  - **the reef** offshore (shallows you can see into, a buoy line, a dive boat)
  - **the coast highway** behind the town, with **the truck stop** (a café, fuel pumps,
    lorries)
  - **the old Ottoman fort** on the headland (Quseir's, seen from the coast), and **the
    wadi** going up into the mountains
  - a beach hotel (for the cook's side quest)
- **New ground:** sea, reef and shallows, quays, beach, asphalt (reused), wadi gravel.
- **A sprite for every building and landmark**, and the cast placed with first lines.
- **Beat 1:** Bassem's two collectors at your door (polite, the first time): the debt system's
  tutorial. **The bank app** on the phone shows 500 EGP and a debt of 60,000 to B. Nassar.
  Meet Captain Zaki at the dhow, and Rana at her dive shop (cool with you: you're her ex).
  The tips teach movement, haggling, the backpack and the bank app.
- The Fixer becomes playable from the intro (`ready: true`); Egyptian or foreign changes the
  lines in places (the bible's `skillsEg`).

## 2. Beat 2: Bassem's offer — ✅ DONE in P0.41
> Done in `poke/ch1c_bassem.js`: the gate opens at 16:30 (wait for five in the shade of the wall once
> Zaki and Rana know; early or late changes his greeting); the garden; the villa inside (marble, the
> terrace over the sea, the telescope on the coast guard, the shark's jaw, the white cat); Bassem, his
> nephew with the ice (a seed for SQ-01C-05) and his man; the job and four questions (what's in it,
> the client and the German woman, "and if I say no?", haggling 500 for diesel); his man walks you
> out and the gate shuts; the beat 3 tasks set; his texts if you're late and before ten.
- **Bassem's villa** (an interior): the terrace, the juice, the phone face down. He's polite
  and terrifying. One night job and you're even: a truck brings a package from Cairo at ten,
  Zaki's dhow takes it out to a cargo ship offshore, the client is a Swiss foundation, and
  their security chief is "a German woman who doesn't laugh." "Nobody opens the package."
- Sets the three prep tasks of beat 3.

## 3. Beat 3: prep the job (your choice of how) — ✅ DONE in P0.42
> Done in `poke/ch1c_prep.js`: the **haggling**, **lockpicking** and **scouting** minigames; diesel
> paid (haggle the fuel man by day), stolen (pick the padlock after dark while the night watchman's
> back is turned; caught: bribe or run, heat +1) or bribed (pay the watchman for a long walk); the
> route bought from the fisherman (his wife's cousin is on the patrol boat) or scouted from the fort's
> rampart at dusk (new steps up the wall); Rana's kit (with a look); Zaki's lines as you go. Flags:
> `c1c_fuel` (paid/stolen/bribed), `c1c_route` (bought/scouted), `c1c_route_good`, `c1c_kit`, `c1c_prep`.
Three tasks, each with more than one way to do it:
- **Fuel for the dhow:** steal it from the harbour fuel store at dusk (**the lockpicking
  minigame**, new, plus a watchman's view cone) or pay for a fill (**the haggling
  minigame**, new: offer, counter-offer, walk away).
- **A route past the coast guard:** buy the patrol schedule from a fisherman (haggling) or
  scout it yourself from the fort at dusk (watch the patrol boat's lights and mark its
  times).
- **A diving kit from Rana,** in case you have to ditch the cargo: she lends it, with a
  look.
- The compass leads round the prep; the day passes as you do it.

## 4. Beat 4: the truck stop (the staged event) — ✅ DONE in P0.45
> Done in `poke/ch1c_truck.js`: the truck down the highway at ten (wait at the truck stop café, or come
> late: it waits; Bassem texts); Lena Brandt's handover (the camel joke, the green lamp twice and
> "Hamburg", "Don't open it", your word or not: `c1c_lena_word`, `rel_lena` +1 to +4); Zaki's cousin's
> pickup or carry it yourself; she watches you go, the truck goes north; the package stowed in the
> dhow's locker (`c1c_package` = aboard). Task `c1c_sail` set for beat 5.
- At ten the truck pulls in at the truck stop, and **Lena Brandt** gets out with it: tall,
  cropped blond hair, clipped. She checks you over. *"Don't open it."*
- You load the package into Zaki's pickup (or carry it to the dhow); she watches you go.

## 5. Beat 5: you open it — ✅ DONE in P0.46
> Done in `poke/ch1c_open.js`: "Cast off" (once the package is aboard and the prep is done); the voyage on
> the map (no lights, past the coast guard post, round Bassem's point); the deck at sea (`INT_DHOW`, a
> `deck` room you can't leave); the locker key "in case you need a rope"; cut the wire or keep the seal
> whole (`c1c_seal` = cut/intact); the Codex, the GPS tracker, the note in the flap (the Fixer doesn't
> know Miriam: it's unsigned); Zaki's "That is a curse"; the green lamp, twice. `c1c_opened`, `c1c_at_sea`.
- On the dhow, in the dark, out past the reef (a deck scene: the lamp, the engine, Zaki at
  the wheel pretending not to look).
- Inside: **the Codex**, **a GPS tracker**, and a note in the flap in Miriam's handwriting:
  *"If you're reading this, they stole it from me. Father Bishoy, El-Fishawy, Thursday.
  Please."*

## 6. Beat 6: the ship and the betrayal — ✅ DONE in P0.48
> Done in `poke/ch1c_ship.js`: "Hamburg"; the ship's deck (`INT_SHIP`, a `steel` room) with two deckhands'
> torch cones and the captain and the mate to overhear (or be spotted: `c1c_ship_seen`, a harder chase);
> the **chase** minigame (call the turns, the lamp, the nets; lure the launch onto the reef with the lamp
> out; a minute and they give up); Zaki shot; the **first aid** minigame or keep running →
> `ch1c_zaki_saved` ★ (rel_zaki +20 / −30); home at 01:30 (`c1c_ship_done`).
- The offshore meet: the cargo ship's crew mean to kill the courier (you) to cut loose ends.
  Overhear it, then get away: **the boat chase** (new: Zaki at the wheel, you on the lamp
  and the lines; dodge the searchlight and the launch, use the reef) with a stealth part.
- **Zaki is shot** in the escape. **Save him** (**the first aid minigame**, new, while the
  dhow drifts, and you lose the ship) or **keep running** (he survives, just, and won't
  forgive you) → `ch1c_zaki_saved` ★ (in Ch3 his boat takes you to the harbour dive).

## 7. Beat 7: back on shore, and the exit — ✅ DONE in P0.49
> Done in `poke/ch1c_exit.js`: the tracker (`c1c_tracker` = reef / bus / bassem: the harbour light, the night
> bus south 01:30–02:45, Bassem's Mercedes); the exit (`c1_exit` = legal at the coast guard post with Amira on
> the phone, `ch1c_bassem_hunts`; deal at Bassem's gate, `ch1c_owe_gebali`; quiet, `ch1c_debt_grows`); the debt
> carried in `Story.s.debt`; goodbyes with Zaki and Rana; leaving by the lorry or the night bus north; Bassem's
> parting text; the end card. **The Fixer's opening can be played start to finish.**
- You have Vasse's package, Bassem's debt and a tracker. **Dump the tracker:** on the reef,
  on a passing bus, or in Bassem's own car (the funny option).
- **The exit choice** (`c1_exit`):
  - **Quiet:** ghost Bassem. The debt stays and grows (a collector event in Ch2), and
    nobody knows where the package went.
  - **Legal:** walk into the coast guard post. The officer calls the Ministry, and Amira asks
    you to bring it to Cairo yourself (`rel_amira` +15). Bassem now hunts you: debt +10,000,
    and a Ch2 goon event.
  - **Deal:** Bassem's double-cross: sell it to the Gebali in Cairo. You carry it; he takes
    20,000 off the debt and gives you 5,000 cash, and you owe the Gebali a favour.
- **The debt thread** carried forward: the amount, whether Bassem hunts you, the Ch2 hooks
  (Bassem texts threats; Karim already knows your name).
- **Leaving:** the night bus or a truck up the coast highway; the chapter-end card.

## 8. Side quests (bible §SIDE QUESTS) — the bible's five ✅ DONE in P0.54–P0.55 (`ch1c_side.js`, `ch1c_side2.js`); the additions next
| ID | Name | Giver | What |
|---|---|---|---|
| SQ-01C-01 | Rana's Reef | Rana | Clear ghost nets off the reef (diving): diving XP, a Ch3 dive kit discount |
| SQ-01C-02 | The Fort's Cannon | Old man at the fort | A treasure legend; a detector hunt: a rare find (an Ottoman coin hoard) |
| SQ-01C-03 | Fish for the Hotel | Hotel cook | A fishing job, done well three times: fishing unlocked, the cook's discount |
| SQ-01C-04 | The Coast Guard's Cousin | Fisherman | Smuggle medicine (not drugs) to a mountain village up the wadi: rep, and a Bedouin contact for Ch6 |
| SQ-01C-05 | Bassem's Nephew | Bassem's sister | Get her boy out of Bassem's crew: `rel_rana` +, a small debt cut |
- **Additions** (not in the bible: the bible gives Marsa Tarfa 5 side quests, against Giza's 11
  and Saqqara's 9, so these bring it up to 9; nameless locals only, nothing that touches the main
  story):

| ID | Name | Giver | What |
|---|---|---|---|
| SQ-01C-06 | The One Guest | Hotel porter | The hotel's only guest (the cook's cousin) has jammed his room safe with his passport inside: open it with your lockpicks (the lockpicking minigame, first used here) |
| SQ-01C-07 | Tawla at the Truck Stop | Café man | The truck stop's tawla champion, a long-haul driver who has never lost on this road (the tawla minigame, reused) |
| SQ-01C-08 | The Imam's Loudspeaker | The imam | The minaret's loudspeaker crackles and cuts out mid-call: find the loose wire up the minaret, and the boy who has been "borrowing" the batteries |
| SQ-01C-09 | Goats in the Wadi | A boy | His family's goats have strayed up the wadi: bring them back down before dark (the wadi explored) |

- Like the Inspector's: the people who are only about by day, the compass for each, and a
  line each on the end card.

## 9. Jobs (bible §JOBS)
- **Fishing** off the reef and the harbour (the fishing minigame, new; reused by SQ-01C-03). ✅ The
  minigame is done (P0.43), on Lighthouse Island's fishing rocks; selling to the fish seller works.
  Fishing from the end of the north breakwater, with the hotel cook's rod, and his side quest: ✅ P0.55.
- **Diving salvage** on a sunk yacht (the diving minigame, reused by SQ-01C-01)
- **Truck-stop loading** (a timed loading job)
- **Small smuggling runs** (cigarettes): pay against the debt, with risk (police heat)
- Paying the debt down from any of them through the bank app.

## 9b. Lighthouse Island — ✅ DONE in P0.43 (an addition the owner asked for)
> `poke/ch1c_island.js`: an island past the harbour mouth, reached with a nameless boatman by day.
> The lighthouse (its room inside, the climb to the lamp), the keeper's ruined hut, a cistern, an
> osprey's nest, turtle tracks, gulls, flotsam, a driftwood fire to grill your catch, and the
> fishing rocks. P0.44: the beam turns at night, and the climb to the lamp is a 360° view built from
> the real map. Not in the bible's map; no named people, no story flags. Later steps may use it
> (the diving jobs, Rana's reef, the boat chase in beat 6) only where that doesn't change a beat.

## 10. Secrets (bible §SECRETS)
- **A wrecked Roman trade ship on the reef** (real Roman Red Sea trade): found diving, an
  amphora and coins (a Rare find)
- **A tiny Keeper shrine in the fort wall:** the first one the player might notice
- **Addition** (not in the bible): **the smugglers' cave** up the wadi: a hollow in the rock with
  names and dates scratched by the coast's smugglers going back to the 1940s, a rusted British
  army tin, and your own initials from when you were young and stupid (or, if you're foreign, the
  initials of the man who taught you the trade). Three secrets, like Saqqara.
- Counted like Giza's and Saqqara's (a notice, a journal page, a line on the end card).

## 11. Rooms and the rest
- **Interiors:** your flat, Rana's dive shop, Bassem's villa (beat 2), the café, the mosque,
  the kiosk, the coast guard post, the hotel kitchen, the truck stop café, the fort, Zaki's
  dhow (the deck and the little cabin), and the houses you can see.
- **The phone:** Bassem's messages (polite, then not), Zaki, Rana; Amira if you go legal.
- **Rest:** wait or sleep somewhere (your flat by day, the dhow by night).
- **The checks:** a Fixer playthrough with each exit and each choice for Zaki, save and load
  mid-night, and the speed check; Giza's look unchanged.
