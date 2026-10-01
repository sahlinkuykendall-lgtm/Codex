# UPDATE LOG — THE CODEX OF GIZA

What changed in each update, newest first. The version number matches
`GAME_VERSION` in `data.js` (shown on both title screens).

**Rule:** every game-changing update bumps `GAME_VERSION` and adds an entry
here *in the same commit*.

Other docs:
- `story/` — **the story bible** (source of truth). Start at `story/00_MASTER_BIBLE.md`.
- `3D_CONVERSION_NOTES.md` — what the 3D branch is, how it's built, quirks.

---

## POKE-STYLE P0.50 — 2026-10-01 — (branch `poke-style`) The Inspector's story made consistent (a tester's report)
- **The dates:** the shared intro says Miriam vanished four nights ago, but the Inspector's story said
  she logged the Codex three days ago, after she'd gone. Now it's **five days ago, the day before she
  disappeared**, everywhere: the Inspector's intro card and its ledger, the Director, the ledger page,
  Samy's confession, and the motorbike receipt (now "a week ago today", still two days before she
  brought the Codex in). The bible (`story/regions/ch01_opening_inspector.md`) changed to match.
- **Why she logged it:** reading Miriam's note now says it plainly. She didn't hide the Codex from
  the Ministry: she brought it *to* the Ministry's locked store, to wait for review by someone in
  Cairo she trusted. Her warning is about the antiquities **police**, who come with papers to
  "collect evidence" (and if you watched Colonel Radwan come for it: "She was right."). On the
  phone, Dr. Amira Sayed now says "Then she meant it for me... Especially not the police."

## POKE-STYLE P0.49 — 2026-10-01 — (branch `poke-style`) The Fixer, step 7: back on shore, and the way out (Chapter 1-C playable to the end)
- **The tracker** (`poke/ch1c_exit.js`): get rid of it before you go, three ways:
  - throw it onto the reef from the new **green harbour light** at the end of the north breakwater
    ("Let them think you went down with it")
  - drop it in the luggage hold of the **night bus south** to Marsa Alam (at the truck stop
    01:30–02:45), between the onions
  - tape it inside the bumper of **Bassem's own black Mercedes**, parked by his villa (the Swiss
    will be very interested in Bassem's lawyer, barber and cousin's wedding tomorrow)
- **The exit** (`c1_exit`):
  - **legal:** the coast guard post; the officer phones the Ministry and **Dr. Amira Sayed** asks you
    to bring it to Cairo yourself, not the police courier. `rel_amira` +15, `rep_ministry` +10, and
    **Bassem hunts you**: debt +10,000
  - **deal:** Bassem comes out to his gate in a silk dressing gown with a better idea: sell it to the
    **Gebali** in Cairo. 20,000 off the debt, 5,000 for the road, Gebali +10, a favour owed
  - **quiet:** just leave without a word; the debt stays and grows
- **Goodbyes**, if you want them: Zaki on his dhow (saved: "If you ever need a boat, any boat, on any
  sea, you call me"; not saved: "You're good at going"), and Rana at her shop (give back her kit).
- **Leaving:** the lorry driver from the truck stop ("Cairo? Empty, at four. Or now, for you.") or
  the **night bus north** (from 03:00). Bassem's last text, and **the chapter-end card**: your exit,
  Zaki, the tracker, the debt, your word to Brandt, the seal, the diesel and the route, Rana, the
  lighthouse, your catch, and "In Cairo, a young man called Karim el-Gebali already knows your name."

## POKE-STYLE P0.48 — 2026-10-01 — (branch `poke-style`) The Fixer, step 6: the ship and the betrayal
- **Alongside** (`poke/ch1c_ship.js`): the green lamp becomes a rusty coaster with her name painted out.
  "Hamburg." Up the rope ladder, the case still in your bag.
- **The ship's deck at night** (a new steel-deck room): rusting containers, a cargo hatch, dim deck
  lamps, two deckhands on their rounds with torches (view cones; the containers block them). Creep
  close to the captain and the mate by the wheelhouse and **listen**: "A courier is a loose end with
  a mouth." Then back down the ladder unseen. Spotted first, and you hear it shouted instead, and
  the launch is already in the water.
- **The boat chase** (new minigame): Zaki at the wheel steering where you call (◄►), you on the lamp
  (SPACE) and the lines (▲: a net astern to foul the launch's propeller). The searchlight sweeps
  from the ship; the launch follows your wake. The dhow draws nothing and goes over the shallows;
  the launch doesn't, **if they can't see the reef**: cross it with the lamp out (with it lit, they
  swerve round). Coral heads hole your hull. Hold them off a minute and they give up.
- **Zaki is shot** in the last spiteful burst. **Save him** (new **first aid** minigame: find the wound,
  hold the pressure in the band, bind it with the arrows, while his blood runs down) while the dhow
  drifts and the ship gets away: `ch1c_zaki_saved` = true, Zaki +20. Or **keep running**: he lives,
  just, ties it up himself, and won't forgive you ("I'd have stopped for you"), Zaki −30.
- **Home** at half past one in the morning, the dhow creeping in with no lights. (Back on shore is
  step 7.)

## POKE-STYLE P0.47 — 2026-10-01 — (branch `poke-style`) Marsa Tarfa's houses, each with its own character
- **Every house in town is different now** (`poke/sprites_ch1c.js`, from the Red Sea's own harbour
  towns, Quseir above all):
  - walls in whitewash or a coloured wash (ochre, rose, sky, mint), or old **coral stone** with the
    plaster falling away in patches
  - one, two or three storeys; arched windows on some, iron bars on some ground-floor windows
  - **wooden lattice bay windows** (rawashin, the mashrabiya Quseir is famous for) on corbels
  - iron **balconies** with pots of bougainvillea and basil, one with a bird cage
  - shops on the ground floor: **a barber's** (the striped pole, the mirror, the red chair) and
    **a tailor's** (a dress form, bolts of cloth), shutters rolled half up
  - bougainvillea climbing a corner, the hand of Fatima, the Hajj mural
  - on the roofs: concrete with the parapet painted to match, a **palm-frond shade** with a mat
    under it, a little **rooftop room**, a **pigeon coop**, a **solar heater**, a domed stair-head,
    nets, washing, the dish from the Gulf, rebar for the floor they'll add one day
- The lighthouse's 360° view draws the town from the same sprites, so it shows the new houses too.

## POKE-STYLE P0.46 — 2026-10-01 — (branch `poke-style`) The Fixer, step 5: you open it
- **Cast off** (`poke/ch1c_open.js`): once the package is aboard and the diesel, route and kit are
  sorted, tell Zaki to cast off. The Umm Kalthoum slides out of the harbour on the real map with no
  lights, you and Zaki on deck: between the moored boats, past the coast guard post (lit windows,
  the crew at dinner), out between the island and the breakwater, and south round Bassem's point,
  a wake behind her and the lighthouse beam sweeping past.
- **The deck at sea**, a place you can walk about: the hooded hurricane lamp, the thumping engine
  hatch, the furled lateen sail, Zaki at the wheel with his back to you ("The locker key is on the
  nail. In case you need a rope."), tea and bread on a brazier, Rana's kit bag, the stars and the
  moon on the water.
- **The case:** cut the wire with your knife, or (Lockpicking) work it out of the lead seal so it
  could all go back as it was. Inside, in a green silk scarf: **the Codex**. Taped in the lining: a
  **GPS tracker**, blinking. In the flap: **the note**, in a woman's hand: "If you're reading this,
  they stole it from me. Father Bishoy, El-Fishawy, Thursday. Please." If you gave Brandt your word,
  the game remembers that you broke it.
- Zaki: "That is not a package. That is a curse." Far off on the black water, a green lamp, twice:
  the ship. (The meeting, the betrayal and the escape are step 6.)
- A new `deck` room style (planks, the night sea over the gunwale, no way off).

## POKE-STYLE P0.45 — 2026-10-01 — (branch `poke-style`) The Fixer, step 4: the truck stop at ten
- **The truck** (`poke/ch1c_truck.js`): at ten a white box truck with Cairo plates comes down the coast
  highway with its headlights on and pulls up at the truck stop, engine running. Wait for it at the
  truck stop café ("Sit with a tea and wait for the truck"), or come when you like: it waits, and
  Bassem texts if you're late. Being there when it pulls in counts as early.
- **Lena Brandt** gets out: tall, cropped blond hair, a knee she won't give in to. She checks you over
  ("Bassem's courier." "Brandt."), you can bring up Bassem's camel joke ("It is not a good joke"),
  and she hands over **the package**: a waxed canvas document case with a leather flap, wired and
  sealed. The ship will show a green lamp twice; the man will say "Hamburg." **"Don't open it."**
  Give her your word, ask what's in it, or say nothing; your word counts with her (`rel_lena`).
- **Get it to the dhow:** Zaki is waiting at the edge of the lot in his cousin's pickup. Ride down to
  the harbour with him, or carry it yourself down the main street. Brandt watches you go, then the
  truck turns round and heads back north.
- Zaki stows it in the locker under the wheel and hangs the key round his neck. He'll sail once the
  diesel, the route and Rana's kit are sorted (the sailing itself is step 5).

## POKE-STYLE P0.44 — 2026-10-01 — (branch `poke-style`) The lighthouse turns, and the view from the lamp
- **The lighthouse's light turns** like a real one: two beams sweeping round once every eleven
  seconds over the island, the sea and the harbour, brighter the darker it gets, and the lamp
  flares when a beam swings round towards you.
- **The lamp room: a 360° view** when you climb to the top. It's built from the real map: the
  ground is Marsa Tarfa's own tiles projected out to the horizon from the lamp's height, and every
  building, boat, palm and person stands where it really is, drawn from its own sprite, smaller the
  farther it is. You see the actual harbour, fish market, the dhow, the town and its mosque, the
  hotel, the fort, the coast guard post, Bassem's villa, the mountains behind, and the open sea
  with a ship waiting on the horizon. The view turns by itself (◄► to look round yourself) with the
  place names coming round as you pass them, the lamp room's iron frame and the gallery rail in
  front. Lit by the hour: dawn, day, dusk, and at night stars, street lamps, lit windows, and the
  beam turning with you over the water.

## POKE-STYLE P0.43 — 2026-10-01 — (branch `poke-style`) Marsa Tarfa: Lighthouse Island, and fishing
- **Lighthouse Island** (`poke/ch1c_island.js`, an addition the owner asked for: not in the bible's
  map, nothing in it touches the story), offshore past the harbour mouth, sheltering the harbour.
  A **boatman** on the quay takes you over by day (20 EGP there and back, or haggle him to 10) and
  waits at the island's jetty to bring you back. He won't go out after dark.
- On the island:
  - **the lighthouse**, red and white, its lamp glowing at night. Inside, the keeper's room: the
    keepers' logbook (1921 to the last night in 1998), the calendar, the keeper's photograph, the
    old radio, a spare lens from Paris, the water tank. Climb the 91 steps to the lamp for the
    view over the whole town (different by day and by night).
  - the last keeper's roofless hut, a rain cistern (water), an osprey on its nest, turtle tracks
    up the beach to the rangers' ring of stones, white-eyed gulls, a crate of washed-up left
    flip-flops, and a driftwood fire where you can **grill your catch** (food)
- **The fishing minigame** (the bible's fishing job, built early): on the island's fishing rocks.
  SPACE on the swinging bar to cast (near for reef fish, far for the big ones), SPACE when the
  float goes under, then hold SPACE to keep the green band on the fish as it fights. Parrotfish,
  spangled emperor, red snapper, bluefin trevally, coral grouper, and the odd flip-flop.
  **Sell the catch** to the fish seller on the quay (20–70 EGP each). It's a way to make money.
- The audit can now flood from extra starting points (`auditSeeds`) for places you reach by boat.

## POKE-STYLE P0.42 — 2026-10-01 — (branch `poke-style`) The Fixer, step 3: prep the job (three new minigames)
- **Diesel for Zaki's dhow** (`poke/ch1c_prep.js`), three ways:
  - **pay the fuel man** by day at the fuel store, with the new **haggling minigame**: ◄► your price,
    OFFER or WALK AWAY. He counters, his patience drains (glasses of tea), insulting offers cost
    double, and walking away while he's above his last price makes him call you back, once. With
    Haggling 3 you can tell when he's near his limit.
  - **steal it after dark** with the new **lockpicking minigame**: hold SPACE to lift each pin, let
    go when the gap is on the shear line; only the binding pin sets (Lockpicking 2 lets you feel
    which). A **night watchman** walks the quay with a torch and a view cone and rattles the padlock
    twice a round. The minigame lasts exactly as long as his back is turned, so start just after he
    walks on. Caught: bribe him (and then he offers you the key), or run (police heat +1).
  - **pay the watchman** for "a long walk to the end of the breakwater" (haggle him).
- **A route past the coast guard**, two ways:
  - **buy the patrol times** from the old fisherman (his wife's cousin is on the patrol boat), haggling
  - **watch the patrol boat from the fort** at dusk with the new **scouting minigame**: new steps
    up the fort's wall to the rampart; press SPACE as its lights pass each mark to note the times.
    Either way: out at dusk, north to the buoy line, back by 19:40, nothing until after midnight;
    go south, round the villa's point.
- **Rana's diving kit:** tell her the job or don't, check the kit in front of her (Diving) or say you
  trust her. "If you go in, swim for the reef. Not for the boat."
- Zaki talks about the diesel and the route as you sort them. When all three are done: "Diesel, a
  route, a way out of the water. The truck at ten."

## POKE-STYLE P0.41 — 2026-10-01 — (branch `poke-style`) The Fixer, step 2: Bassem's offer at the villa
- **The villa gate opens at half past four.** Before that, Bassem's man sends you away ("when Mr.
  Bassem is eating, the sea waits"). Once Zaki and Rana have heard, you can **sit in the shade of
  the wall and wait for five**. Come early and Bassem likes it; come after six and he notices.
- **The garden and the villa** (`poke/ch1c_bassem.js`): walk in through the gate, past the pool, to
  the arches. Inside: white marble and white leather, a television the size of a garage door, a
  tiger shark's jaw in a glass case, a white Persian cat on a velvet cushion, a gold bar cart with
  nothing stronger than mango on it, and the whole back of the house open onto **the terrace over
  the sea** (a brass telescope pointed at the coast guard post, a cargo ship on the horizon).
- **Bassem "the Shark" Nassar**, polite and terrifying: the juice, the phone face down, his sister's
  boy bringing the ice ("he's learning the business"). **The job:** a truck from Cairo at ten, the
  package to a ship offshore on Zaki's dhow, a Swiss foundation, their security chief "a German
  woman who doesn't laugh", and **nobody opens the package**. Ask what's in it, who the client is,
  what happens if you say no (photographs of Rana's shop and Zaki's dhow), or haggle him for the
  diesel (500 EGP).
- **After the offer:** his man walks you out, the gate shuts behind you, and beat 3's tasks go up:
  diesel for the dhow, a way past the coast guard, Rana's diving kit, and the truck stop at ten.
  (The tasks themselves are step 3.) Bassem texts you if you're late, and again before ten.
- The villa's pool now says something. The audit lets an area open its story gates (`auditOpen`),
  so what's behind them counts as reachable.

## POKE-STYLE P0.40 — 2026-10-01 — (branch `poke-style`) The Fixer's opening begins: Marsa Tarfa on the Red Sea (Chapter 1-C, step 1)
- **The Fixer is playable.** Pick them in the intro (Egyptian or foreign: an Egyptian Fixer has
  Egyptian Arabic 5 and Arabic reading 2, and even less money).
- **Marsa Tarfa** (`poke/marsa.js`), the same size as Giza and Saqqara:
  - the town: whitewashed houses with blue doors and shutters (nets drying on the roofs, washing,
    dishes, rebar for the next floor), the mosque, the café, the kiosk, the square with its tap
  - the harbour: quays and two breakwaters, the fish market, the fish grill, the fuel store,
    Captain Zaki's dhow the Umm Kalthoum, fishing boats, the coast guard post and its patrol boat
  - the north beach and the Beach Hotel, the old Ottoman fort on the headland with its cannon
  - Bassem's villa on the south point behind a wall of broken glass and cameras (the gate stays
    shut until beat 2)
  - the reef offshore with a dive boat, the coast highway, the truck stop (café, pumps, painted
    lorries), the wadi going up into the mountains
- **New ground:** the Red Sea (foam where it meets the beach), the reef (coral showing through
  turquoise water), beach and concrete quays.
- **Beat 1:** eight in the morning, two of Bassem's men at your door: sixty thousand pounds,
  and "something for our trouble" (pay 300, haggle them down to 50, or pay nothing and be
  remembered). Your debt is in the phone's bank app, in red. Bassem wants you at his villa at
  five. Find Captain Zaki at his dhow (his boat is yours for the job, if you buy the diesel) and
  Rana at her dive shop (your ex: she'll have a diving kit ready if it goes wrong in the water).
- **Water and food:** the public tap, water jars by the tap, on the quay and at the truck stop,
  grilled fish on the quay (haggle it down), the ful cart, the café, the kiosk, the truck stop
  café; the cooler in Rana's shop and the sink in your flat.
- **Rooms:** your flat (the mattress, the unopened envelopes, the Shahd's lifebuoy, a
  photograph of you and Rana) and Rana's dive shop (tanks, wetsuits, the compressor, a
  clownfish named Bassem).
- Tested: the beat from the door to the summons, every person and food stop, both rooms, save,
  and night. The audit is clean (every area reachable), the Giza playthroughs and the three
  Inspector runs pass, and Giza's 33 views are identical.

## POKE-STYLE P0.39 — 2026-10-01 — (branch `poke-style`) Saqqara redrawn: the Step Pyramid, the colossus, the sphinx, the animals, the stalls; and a secret at the sphinx
- **The Step Pyramid** no longer looks like a beehive: six battered steps, each shorter than
  the one below and much wider than tall, built of staggered blocks (no more stripes), with
  the casing fallen away in patches to show the rubble core, sunlit ledges with sand and
  stones on them, the east corners turning into shade.
- **The colossus of Ramesses II** redone from scratch: lying on his back seen from above, his
  face turned on its side to you (brow, eyes, nose, smile, false beard), the nemes and its
  striped lappets, arms down his sides with the fists round two scrolls, a cartouche on his
  shoulder and his belt, the dagger in the belt, the pleated kilt, the legs broken at the
  knees; the stone's thickness shown along his side, on a plinth inside an iron rail (the
  heavy shade roof is gone).
- **The alabaster sphinx** in profile: the nemes and lappet, the face with its broken
  uraeus and beard, forepaws out with toes, the hind paw tucked, the tail curled round the
  haunch, honey-and-milk calcite with veins, on a low base.
- **The pigeon towers:** a mud-brick base with a blue door, a whitewashed band, the tower
  studded with clay pot mouths and rows of perching sticks, a crown of little domes, pigeons
  sitting and two circling.
- **The water buffalo** stands now, slate black, crescent horns swept back, muddy hooves,
  chewing, its tail swishing, the egret riding on its back. **The goats:** a black one
  grazing and a brown one watching, long floppy ears, Roman noses, beards, tethered apart.
  **The cat:** a ginger tabby curled up asleep with its tail round its paws, the tip flicking.
- **The market stalls:** posts and a sagging scalloped awning, crates and sacks under the
  counter, brass scales, price cards, and goods to match: bananas on hooks, mangoes and
  watermelons; aubergines, garlic strings, onions in a net; spice cones in rolled sacks, jars
  on a shelf, chilli strings; bolts of cloth, folded stacks, a galabeya on a hanger. **The
  souvenir stall:** papyrus prints and scarves on a line, alabaster pyramids, a gold mask, a
  black Bastet, a basket of scarabs.
- **The Fiat in the garage:** a proper boxy old saloon, its bonnet up, one door in grey
  primer, up on a jack stand with the front wheel off, and its engine in pieces on cardboard.
- **A secret** (new file `poke/ch1b_egg.js`): stand in front of the alabaster sphinx and
  press UP three times, quickly. Someone comes out from behind it. Turn the music on.
- Tested: the audit is clean (287 scenes), the Giza playthroughs and the three Inspector
  runs pass, the secret triggers only at the sphinx (and not with a gap between presses),
  plays out, and leaves the world as it was. Giza's 33 views are identical.

## POKE-STYLE P0.38 — 2026-10-01 — (branch `poke-style`) Saqqara's rooms, the phone, resting, and an Inspector playthrough in the checks (Chapter 1-B, step 11 — the Inspector level is done)
- **Every building you can see has an inside** (except the Serapeum, which the story keeps
  locked until the round):
  - **the café:** tables, shishas, the counter (the old café scene) and the champion's table
  - **the bakery:** the oven, the dough table, flour sacks; buy bread
  - **the mosque:** the minbar and carpets, the imam; rest a while by day
  - **the garage:** the old Fiat on blocks, tools on the wall; look in the glovebox
  - **seven village houses,** each with its own family (new faces, nobody from the story
    reused), their own furniture (a kanaba, a tabliya, a cot, an ironing board…) and a line
    of talk; sit and eat with them
  - **the ghaffir's hut:** the bench (the night wait now happens here)
  - **the museum's kiosk:** cold drinks and postcards
  - **the Step Pyramid's shaft:** down to a corridor of blue faience tiles
- **The phone:** Fathi and Umm Sabry call; the Ministry texts at noon and your mother at 19:30.
- **Resting:** the tea corner and the ghaffir's bench by night, the mosque by day, a meal in a
  house.
- **The checks:** a new `tools/poke_checks/poke_inspector.js` plays the Inspector from the
  morning to the chapter-end card three times, once per exit (quiet, legal, deal), with a
  save and load mid-night in each, and times a frame by day and by night.
- Tested: the three Inspector runs pass (quiet with Samy exposed; legal with the dart and
  Samy fleeing; the deal with the run), a frame takes about 0.7 ms by day and 3 ms at night,
  the audit is clean (286 scenes, no unreachable ones, every room builds), the Giza
  playthroughs, side quests, jobs and secrets pass, and Giza's 33 views are identical.

## POKE-STYLE P0.37 — 2026-10-01 — (branch `poke-style`) Saqqara's secrets: the twenty-sixth gallery and the painted tomb (Chapter 1-B, step 10)
- **The bible's two secrets,** counted as three like Giza's five (a chime, a notice, a
  "Secrets of Saqqara" page in the journal, and a line on the end card):
  - **the twenty-sixth gallery** (fiction): in the Serapeum, the Apis coffin whose lid the
    robbers pushed aside ("the dark goes down further than it should"). Lean in with the
    torch: the robbers cut through the coffin's floor and the rock under it, and there are
    footholds down into a new room, a short, rough gallery that isn't on any plan, with an
    unfinished granite coffin at the end
  - **the bronze Thoth:** in a niche in the rough wall, a hand-length Late Period bronze of
    Thoth, ibis-headed, a scribe's palette against his chest, set there to watch over the
    coffin. Not yours to take; you leave him watching
  - **a Rare find:** in the unfinished coffin's dust, a finger-length bronze Apis bull, the
    sun disc between its horns still gilded (an item; excavation XP)
  - **Naneferkaptah's tomb:** the sealed doorway in the far corner of the necropolis, where
    the sand comes in, with a river, a woman and a small boy painted faintly above it. You
    can notice it, not enter it. If Umm Sabry has told you her grandmother's story, you know
    whose tomb it is
- **The Serapeum is open after the round** (the bible keeps it locked only until then): by
  day, tourists and your Ministry card; by night the old ghaffir lets you in. Outside the
  story's nights nobody patrols and nobody comes, so you can explore the galleries and
  find the way down.
- Tested: noticing the tomb, the gate before and after the round, a daytime visit with no
  patrol and no Samy, down to the twenty-sixth gallery, the Thoth, the Apis, back up,
  and saving and loading. The audit is clean (269 scenes), the playthroughs and the
  Inspector story flows pass, and Giza's 33 views are identical.

## POKE-STYLE P0.36 — 2026-10-01 — (branch `poke-style`) The Inspector's jobs: the seal shift, guiding, sieving (Chapter 1-B, step 9)
- **The seal register and the seal shift** (the Inspector's answer to Miriam's metal
  detector): a duty roster on the inspectorate wall offers today's seal shift. Write your
  name against it and the seal register goes in your bag. Eight sealed tomb shafts across
  the necropolis (new: a limestone slab, a rope, the clay seal and a tin tag), each checked
  with the seal minigame: 40 EGP a seal logged, and 100 more when the shift's done. Two of
  them are forged with the same faulty stamp as the Serapeum's service door: 60 EGP for
  reporting each, and they start The Forged Seal if you haven't already. The compass
  points to the nearest shaft left.
- **Guiding** (once Léo's father has vouched for you, SQ-01B-04): a group from Lyon at the
  tour bus in the coach park. The guide's quiz, new: six questions from the tourists, on
  Djoser, Imhotep, the steps, the serdab, the Heb-Sed court, the false doors, the Serapeum,
  and one about aliens. Pick the answer, watch the group's mood. 120 EGP plus 30 for each
  right answer; one tour every two hours, by day.
- **Sieving at the Teti dig** for Rais Gad: three heaps a day, the sieve minigame, paid by
  what you find.
- The licensed guide tells you how to get guiding work, and the end card lists a seal
  shift and your tours.
- Tested: taking the shift, all eight seals with both forgeries, the pay (540 EGP for the
  whole shift), a full tour, and sieving. The audit is clean (263 scenes; Saqqara has 107
  things, all reachable), the playthroughs and the earlier Inspector flows pass, and
  Giza's 33 views are identical.

## POKE-STYLE P0.35 — 2026-10-01 — (branch `poke-style`) Saqqara's nine side quests, and tawla (Chapter 1-B, step 8)
- **All nine of the bible's side quests for the Inspector (SQ-01B-01 to 09):**
  - **Umm Sabry's Price:** she wants to know who's romancing the accountant. The well girls
    know (the baker: an extra loaf in Madame Nadia's bag every morning). Tell her, and she
    pays you back with a tip about the Director (a second, old telephone in his desk that
    only rings on Tuesdays) and her network: anyone on the site, anyone in Mit Rahina,
    anyone's cousin in Cairo
  - **The Camel Men:** a tourist stuck on a camel: "twenty to get on, madame, two hundred
    to get down". Fine him, let it go, or organize the camel men (a price board, fifty
    pounds up and down, and a licence form with your name on it). Organized, they give you
    free camel rides to the Serapeum, Mit Rahina, the inspectorate or the Teti dig
  - **Rais Gad's Tunnel:** after Gad mentions the footprints, offer to watch. At night, lie
    in a hollow by the robbers' hole: two young men from Qurna come with a lamp ("Hagg
    Mahmoud won't like this. We're not supposed to be up here at all"). Photograph them or
    not, shout "Ministry!", and they run, dropping a faience wedjat amulet. Log it with the
    Rais for Ministry rep: "Qurna men. The old families. Someone paid them to come this far
    north"
  - **The Colossus:** Léo, seven, lost by the fallen colossus; his French parents frantic
    at the coach park. Reunite them: 150 pounds from his father, and the guide mentions
    that the Inspector does Step Pyramid tours (the guiding job, step 9)
  - **The Forged Seal:** after the round, ask Fathi about the other seals: "Check them.
    Quietly. Nothing in writing until you're sure." Three sealed mastabas in the mastaba
    field (their seals now drawn on): two forged with the same faulty stamp as the
    Serapeum's service door, and the register has S.R. against every renewal. Evidence
    for Colonel Radwan's conscience, one day
  - **The Serdab's Eyes:** look through the two eye holes at Djoser (a close-up picture of
    the statue's face) and photograph him with the camera (C)
  - **The Café's Backgammon:** an old man at the café, unbeaten at tawla since 1994. Five
    pounds a game; win, and the café pays you a hundred and the whole village hears
  - **The Well Girls:** two girls at the well have lost their jerrycan's cap; it's under
    the cloth stall
  - **The Mechanic's Receipt:** the receipt for Samy's motorbike is in the glovebox of the
    red Fiat in the garage: cash, a Shubra dealer, dated two days before the Codex came. In
    the standoff it adds lines (Samy: "That was a present too"; Fathi pockets it "like a
    winning ticket"), but nothing turns on it
- **Tawla,** a new minigame: backgammon as the café plays it, cut down to a quick race.
  Four checkers each, two dice (doubles play four times), round the inlaid board and off;
  land on a lone checker and it goes back to the start, two on a point block it. ◄► picks
  a checker, ▲▼ the die, SPACE moves; the champion plays a sensible game with a little luck
  of the hand. (Ch2's Madame Samira will reuse it.)
- **By day only:** the children, the old men at dominoes, the well girls, the tourists, the
  guide and the camel man go home at nine in the evening.
- The end card lists the side quests you finished.
- Tested: every quest start to finish, the camel ride, a full game of tawla played to the
  end, the receipt's lines in beat 6, the end card, and saving and loading. The audit is
  clean (256 scenes), the playthroughs and the earlier Inspector flows pass, and Giza's 33
  views are identical.

## POKE-STYLE P0.34 — 2026-09-30 — (branch `poke-style`) Miriam's note and the way out: the Inspector's opening can be finished (Chapter 1-B, step 7)
- **Beat 7** (from the bible), the end of the Inspector's story.
- **Look at the Codex properly,** somewhere nobody can see you: SPACE on it in your bag, or
  "Sit on the bench, and look at the Codex properly" at the ghaffir's hut. Leaves of papyrus
  in a leather cover with a long flap, like the Nag Hammadi books; Greek, with little marks
  in the margin that look like hieroglyphs and aren't. Inside the flap, folded small, a note
  in pencil, in the same hand as the logbook entry three days ago, Dr. M. Hale:
  *"Father Bishoy. El-Fishawy. Thursday. Don't trust the police."* She logged it into a
  police-and-Ministry evidence store, and hid a note in it saying not to trust the police.
- **A message from an unknown number:** "Inspector. We both know where the brick came from.
  5,000 pounds to hold it for a week, somewhere safe, and nobody gets hurt. Then we talk. K."
- **The exit choice** (`c1_exit`):
  - **quiet:** a leave form the Director signs without reading; by noon, a microbus to
    Cairo with the Codex at the bottom of a bag of oranges. Nobody knows you have it
  - **legal:** Dr. Amira Sayed (Manuscripts, from the Ministry directory on your service
    phone) comes herself; with the Director watching "like a man at his own funeral", you
    log the Codex back in properly, her signature beside yours, and give her Karim's name
    (and Samy's, unless you let him flee). rel Amira +15, rep Ministry +10
  - **deal:** "A week." At dawn a boy on a scooter hands you 5,000 pounds in used fifties.
    Rep Gebali +10. The Gebali always collect
- **The chapter-end card** (END OF CHAPTER ONE · SAQQARA) lists what carries forward: the
  exit, what happened to Samy, Karim by the sphinx, Radwan and the empty box, the forged
  seal, the cigarettes, Umm Sabry's story, the night ghaffir. Then "Thursday, Café
  El-Fishawy, Cairo. Father Bishoy is waiting for someone who isn't coming." Keep exploring
  Saqqara, or back to the title (the button no longer says "the camp" at Saqqara).
- **Umm Sabry's Saqqara story** (the Inspector-only lore seed from the bible): after the
  tea, by day, ask her for one. Setne, son of Ramesses, and the tomb of the magician
  Naneferkaptah, where the magician's drowned wife and son sat beside him: "That book cost us
  everything. Leave it." The tomb is somewhere at the edge where the sand comes in, "the
  magician's wife and son painted on the wall by the river" (the sealed tomb in the far
  corner has that paint).
- **The Inspector's main story is complete,** from tea with Umm Sabry to the end card.
  Next on the list: the side quests, the jobs, the seal register, the secrets, and the
  rooms (steps 8 to 11 of `poke/INSPECTOR_TODO.md`).
- Tested: reading from the bag and from the bench, all three exits (each after a different
  end for Samy), the end card, and Umm Sabry's story. The audit is clean (227 scenes), the
  playthroughs and the earlier Inspector flows pass, and Giza's 33 views are identical.

## POKE-STYLE P0.33 — 2026-09-30 — (branch `poke-style`) Samy's panic: the standoff in the galleries (Chapter 1-B, step 6); softer fields
- **Beat 6, Samy's panic** (from the bible). Karim's man opened the cooler bag and found a
  brick. A while after the black car has gone, your phone buzzes: the old ghaffir. "Samy
  is here. He came past me like a mad dog and went down into the galleries with a torch
  and a knife. My son is hiding in the pump room. Please come."
- **At the gate** the old ghaffir offers you the vet's dart pistol the Ministry gave them
  for rabid dogs, one dart ("For dogs. Samy is a kind of dog tonight"). Take it or not.
- **In the galleries** Samy is tearing the chambers apart, his torch jerking about (its
  cone on the floor, as before). The night ghaffir is crouched behind the pump room's
  bench, shaking. Let Samy find you and it's a standoff. Get right up behind him first and
  you grab his wrist and the knife goes skidding under a sarcophagus.
- **The standoff:**
  - talk him down ("Put the knife down, Samy. Nobody gets hurt tonight"), and he confesses
    everything: Karim el-Gebali paid him twenty thousand pounds, three days ago, the night
    Dr. Hale brought it in, to take it out before the Colonel came for it. Vasse wanted it
    the proper way, with papers; Karim meant to sell it to Vasse the other way, for ten
    times as much. "Fathi knows nothing. Fathi knows only how not to know." If you bagged
    his cigarettes, you can show him you already know
  - push him ("you're finished") and he comes at you: dart him, get a sarcophagus between
    you and talk, or run
  - dart him: he sits down against the granite "like a man lowering himself into a hot
    bath", and snores
  - run: up the steps, the old ghaffir locks the gate behind you; by morning Samy is gone
- **Then the choice:**
  - **expose him to Fathi:** Fathi arrives in a coat over his pyjamas and suspends him in
    about four seconds. "And the... item?" You say Karim's man took it. Samy looks at your
    jacket and says nothing. "Then it's Karim's problem. And the Colonel's. Not ours."
    (`ch1b_samy_exposed` ★: Karim's crews will be Cold to you in Ch2)
  - **let him flee** to his cousin in Alexandria: "If you ever need anything. Anything. I
    owe you." (`ch1b_samy_informant`: a small informant in Ch2)
  - either way, nobody learns you have the Codex
- Next task: somewhere quiet, look at the Codex properly. That's beat 7, Miriam's note and
  the way out, the last step of the opening, in the next update.
- **The fields are softer on the eye.** The crops were drawn as bright and dark stripes
  every four pixels, which shimmered. Now each field is one flat colour (clover green,
  wheat gold, onion green) with faint rows and a few tufts.
- Tested: every branch of the standoff (talk and expose, dart and let go, from behind with
  the cigarettes and let go, no dart then run), and saving and loading after each. The
  audit is clean (220 scenes), the playthroughs and the earlier Inspector flows pass, and
  Giza's 33 views are identical.

## POKE-STYLE P0.32 — 2026-09-30 — (branch `poke-style`) The black car: Colonel Radwan and the empty box (Chapter 1-B, step 5)
- **Beat 5, the staged arrival** (from the bible). "A black car comes for the Director on
  Tuesdays," Umm Sabry said, and it's Tuesday. Coming up out of the Serapeum with the
  Codex, you see its headlights turn in at the inspectorate.
- **In the yard:** a black Mercedes with Cairo police plates, engine running, headlights
  on. At the office door, Director Fathi and **Colonel Khaled Radwan** of the Tourist and
  Antiquities Police (new: a pressed dark uniform, a cap, a grey moustache, a cigarette
  lit from the last one). In the gateway, his driver, smoking, watching the road. Umm
  Sabry has gone home for the night, and the office door is off limits while they're
  there ("Not now. You'd walk straight into them").
- **Listen in without being seen:** each of them has a view cone. The driver watches the
  road and now and then looks along the wall; the Colonel looks over the yard; the
  Director keeps glancing over his shoulder. The compound wall and the Director's Peugeot
  are cover. Get within earshot unseen and the bar fills. If they notice you, you drop
  behind the wall and back off into the dark to try again.
- **The handover:** Fathi hands over a sealed grey evidence box, "everything from Shelf
  4B, sealed and signed for". Radwan weighs it in his hands, something crosses his face,
  and he doesn't open it. "The Foundation thanks you. Mr. Vasse will be—" He stops. Fathi:
  "The ledger has been corrected. A clerical error. It was never here." Radwan: "Then I
  was never here either." The box is empty. The Codex is inside your jacket, and nobody
  in the yard knows it.
- The car's lights swing away toward Cairo, the Director goes back inside, and the notes
  get the Colonel and what the Director did. New task: Karim's man will find a brick in the
  cooler bag, and Samy will come looking. That's beat 6, Samy's panic, in the next update.
- Tested: the scene setting itself up, being seen and backing off, listening from behind
  the west wall, the handover, the car leaving, and saving and loading. The audit is clean
  (209 scenes), the playthroughs and the earlier Inspector flows pass, and Giza's 33 views
  are identical.

## POKE-STYLE P0.31 — 2026-09-30 — (branch `poke-style`) The Serapeum at night: the galleries, the patrol, the Codex (Chapter 1-B, step 4)
- **Beat 4** (from the bible): Samy moves the Codex from his locker to the Serapeum's
  service room for Karim's man to collect after midnight. Get there first.
- **Waiting for night:** the task sends you to the bench at the ghaffir's hut by the
  Serapeum. "Wait on the bench until eleven at night" skips there (water and food run
  down as the hours pass; the text says to eat and drink first). The gate sends you to the
  bench if it's still daylight.
- **The gate:** after eleven the old ghaffir is sitting in the dark, listening. He unlocks
  the gate without asking. "My son does the night rounds down there. He has good ears and
  a very big mouth. I, on the other hand, am old, and asleep."
- **The galleries,** a new underground room, lit only by your torch and a few dim
  emergency lights: a long main gallery, and off it, in chambers cut into the rock, seven
  great granite coffins of the Apis bulls (niched like palace fronts; one with a band of
  hieroglyphs; one with its lid pushed aside by robbers, two thousand years ago). Stone
  steps up to the gate.
- **The night ghaffir** walks the gallery with a lantern, stopping to look into the
  chambers. His view is a cone on the floor, as in the tail. Hide behind the coffins
  (there's room behind every one). If he sees you, he shouts "Inspector! At this hour!"
  loud enough to wake the dead, and you go back to the steps to try again.
- **The service room** at the east end: pumps, a workbench, a steel cabinet, and the steel
  service door. Get there, and a motorbike stops up above with no light: seven seconds
  to hide. Samy comes in with a torch, puts a red cooler bag in the cabinet, sweeps the
  torch round the room, and leaves. Hide behind the pumps or the bench. If his torch
  finds you, he runs off with the bag, and you try again.
- **The Codex:** in the bag, in a torn Ministry evidence envelope: a leather-bound papyrus
  codex, its tag SAQ/EV/0419, SHELF 4B, in your own office's hand. You take it and leave
  the bag with a brick in it. (Miriam's note inside the flap is for beat 7.)
- **Getting out:** back through the galleries. If the night ghaffir sees you now, you bluff
  ("Checking the seals") and he goes.
- **Outside:** headlights. A big black car turning in at the inspectorate's gate. New
  task: go and see, without being seen. That's beat 5, the staged arrival, in the next
  update.
- Tested: waiting, the gate, being seen by the ghaffir, hiding while Samy drops the bag,
  taking the Codex, getting out, and saving and loading. The cabinet, the hiding places
  and the space behind all seven coffins can all be reached. The audit is clean (206
  scenes), the playthroughs and the tail tests pass, and Giza's 33 views are identical.

## POKE-STYLE P0.30 — 2026-09-30 — (branch `poke-style`) Saqqara's buildings fixed, and Mit Rahina comes alive
- **The village houses are rebuilt.** They were mostly roof with a thin strip of wall, and
  windows were drawn over doors, and the painted Hajj murals over shutters. Now each is
  two storeys on a shorter roof, and the front is laid out on a grid of slots: one door
  (with a lamp over it, a house number and sometimes a potted plant), shuttered windows
  upstairs, a balcony with basil in one, barred windows downstairs, and the Hajj mural
  (the Kaaba, a plane, a ship, a line of green writing) in a slot of its own. Nothing
  overlaps. Brick-in-concrete-frame houses and pastel ones alternate, and the roofs differ:
  a stair-head, washing, a pigeon loft, an old chair and sacks.
- **The garage:** the flat red car shape is gone. Inside the dark bay there's an old red
  Fiat seen from the front with its bonnet propped up (headlamps, grille, chrome bumper,
  number plate, the engine), a pegboard of tools and a work lamp; a tyre sign above, old
  tyres and a drum on the roof, a jerrycan and an oil drum outside.
- **The mosque's minaret:** a square base, an octagonal shaft in two stages, two balconies
  on carved brackets, loudspeakers, a green cap and the crescent (it looked like a ladder).
- **The inspectorate** had the same problems: the Ministry sign was drawn over two
  windows, the chairs over a barred window, the notice board clipped another, and an air
  conditioner hung across the floor line. Its front is now on the same slot grid: the
  sign (with a proper eagle) across the middle upstairs, the porch and door below it, the
  notice board and the chairs in slots of their own. A street lamp that stood inside the
  building's footprint is out in the yard.
- **More life around town** (new, all nameless locals):
  - wires and a bare bulb across the lane by the café; paper bunting over the market
  - a **ful cart** (a ful sandwich, 2 EGP), a **sugarcane juice** stand (3 EGP), and
    **qullas**, clay water jars outside a house (free): more food and water
  - a butane cart, hens pecking (two flocks), a ginger cat asleep, a bicycle with a basket
    of bread, crates of tomatoes and onions, kilims airing on a line
  - two old men at dominoes on a bench by the well, and two boys with a football who run
    about ("Ahly or Zamalek?")
  - out in the fields: two pigeon towers, a water buffalo with an egret on its back, goats
- The mechanic stands in front of his garage now (he was standing on a house's roof).
- The audit is clean (194 scenes; Saqqara has 92 things, all reachable), the playthroughs
  and the tail tests pass, and Giza's 33 views are identical.

## POKE-STYLE P0.29 — 2026-09-30 — (branch `poke-style`) Following Samy through Mit Rahina (Chapter 1-B, step 3)
- **Beat 3, the stealth tutorial** (from the bible): Samy rode down to Mit Rahina after the
  round. His red motorbike is outside the garage; he's at the café, on the phone. Come
  near and he gets up and walks: down the market lane, a stop at the spice stall, past the
  tuk-tuk, and into the museum garden. At three corners he stops and looks back.
- **How the tail plays:**
  - where Samy is looking is a cone on the ground: yellow, red while he can see you. When
    he stops to look back it's longer and wider
  - market stalls, carts, the tuk-tuk and buildings block his view (the cone stops at
    them), and standing close to other people hides you in the crowd
  - the meter over his head fills while he sees you, faster the closer you are, and also
    if you walk right on his heels or run near him
  - fall more than twelve tiles behind for a few seconds and you lose him
  - seen: he gives you an orange ("You like oranges too?") and goes back to the café.
    Lost: he's back at the café ten minutes later. Walk away and come back to try again
  - the compass points at Samy all the way
- **The meeting:** by the alabaster sphinx, a young man leaning on a black scooter with a
  Cairo plate: black tracksuit, trainers so white they hurt. Get within earshot without
  either of them seeing you (the sphinx is good cover) and listen. Samy calls him Karim.
  Karim pays him in an envelope and gives the order: "Out of your locker, into the service
  room. My man comes after midnight." Samy mentions the Director's black car on Tuesdays;
  Karim's grandfather "thinks it's still 1950". You know the name from the police files:
  **Karim el-Gebali**.
- Then Karim rides off west toward the Cairo road and Samy goes back the long way. New
  task: be at the Serapeum's service room tonight, first. That's beat 4, the Serapeum at
  night, in the next update.
- Tested: the tail start, being seen, being lost, trying again, the meeting, finishing,
  and saving and loading. A bot following him along his path is seen at five tiles behind
  and gets through at seven and a half or more, so it can be done without any cover, and
  cover lets you follow closer. The audit is clean (187 scenes; Saqqara has 70 things, all
  reachable), the playthroughs pass, and Giza's 33 views are identical.

## POKE-STYLE P0.28 — 2026-09-30 — (branch `poke-style`) Giza camp fixes: compass letters, building light, the survey map, Miriam's food, the radio, darts, the fence
- **The compass** (bottom right) now has N, E, S and W on a brass bezel (north is up the
  screen), and the line above it gives the heading in words: "NE  16 m".
- **Buildings glow at night**, differently from the lamps: a low, wide amber band along
  the foot of the walls, the light of rooms, and a fan of light on the ground from each
  door. The lamps keep their round pools.
- **The survey map in Miriam's tent**, shown big, is redrawn at half as big again, traced
  from the camp itself: the plateau's edge with hachures, the oasis, paths, palms, every
  building, the fence and the gate, the rails, the cemetery and the old village; her
  trenches in red pencil (A reopened, B backfilled, C with the Coptic word underlined
  twice and an arrow to it); the Osiris Shaft circled with a question mark; a grid, a
  title block (GIZA W. FIELD, DIR. M. HALE), a compass rose, a scale bar and a key.
- **Miriam's camp kitchen:** you can eat what she left, three meals, one at a time (a tin
  of ful warmed on her stove, cheese and olives from the cooler, halva and biscuits). The
  last one has something under it: her shopping list, with *plaster* underlined.
- **The shortwave radio** in the workers' camp: turn it up (Umm Kulthum, strings and a
  qanun, in maqam Bayati with its quarter-tone), or turn the dial (a Saidi wedding band).
  For a minute, near the radio, that's the music: tinny, through the radio's little
  speaker, with a crackle of static, louder the closer you stand. Walk away and the camp's
  own tune comes back.
- **The painted sherds' sparkle** is a star now, swelling and fading with a halo, and a
  pinprick of light between flashes. Glints draw after the night's darkness, so they show
  at night too. (One sherd sat behind the Old Ministry Post where you couldn't see it; it's
  moved into the open.)
- **Darts are harder:** the blue ring (how far your hand sways) is bigger, it sways
  faster, holding steady gives you less time, and the dart lands anywhere up to half the
  ring off the crosshair.
- **No way round the fence:** the gap was at the fence's east end, between the site
  trailer and Trench A, then along the trench. A chain-link run now goes north from the
  fence's end to the cliff (Trench A, the watchtower and the lookout stay outside). The
  grove from the oasis to the fence has four more palms, so it looks as solid as it is.
- The audit is clean (180 scenes, nothing reachable behind the locked gate), the three
  playthroughs pass, and the look check shows only the intended changes in Giza's 33
  views: the bigger compass box and its heading on every view, and the night glow, the
  palms and the fence where they are.

## POKE-STYLE P0.27 — 2026-09-30 — (branch `poke-style`) The Inspector's round: three tomb seals, one forged (Chapter 1-B, step 2)
- **Beat 2, the inspection round** (the job tutorial, from the bible). After the Director,
  check the three tomb seals on your beat; the compass leads you round:
  - **the South Tomb** in the Step Pyramid complex: a barrier and a rope seal across its
    stairway
  - **the Mastaba of Kagemni** in the Teti cemetery (a new tomb on the map, north of the
    inspectorate), sealed since spring, its clay old and crumbling
  - **the Serapeum's service door**, a steel door in the cliff beside the steps, the
    engineers' way down to the pumps, that nobody should use
- **The seal check** (the seal minigame reworked for inspectors):
  - the stamp from the register on the left, in blue ink; the clay seal on the door on the
    right
  - move part by part (◄►) through the eight signs round the ring, the emblem and the
    three digits of the number; the same part is highlighted on both sides
  - SPACE marks a part that's wrong on the door; then sign SEAL INTACT or SEAL FORGED
  - wear and cracks in old clay aren't forgery (Kagemni's teaches that)
  - a wrong call can be tried again: it tells you whether you marked something the
    register agrees with, or signed past a difference
- **The service door is forged:** the sixth sign and the last digit are wrong (114 in the
  register, 117 on the door), and the clay is still damp. Beside it, trodden into the
  sand: four fresh **Cleopatra cigarette ends** and a crushed packet. That's Samy's brand,
  and he always crushes the packet.
- **The people:**
  - the ghaffir heard a motorbike come up the road last night with its light off
  - Samy, shown the evidence bag: "Everybody smokes Cleopatra." He rides off to Mit
    Rahina and his motorbike is gone from the yard
  - Fathi: "Write it up. In triplicate. File it. Today is Tuesday, Inspector. Go home
    early."
- **Next:** the new task is to follow Samy to Mit Rahina. That's beat 3, the tail, in the
  next update.
- Saved games keep all of it. The audit is clean (178 scenes; Saqqara has 69 things to
  look at, all reachable). Giza's look check is 33 of 33 identical, and its playthroughs
  are clean.

## POKE-STYLE P0.26 — 2026-09-30 — (branch `poke-style`) A leftover from the old story removed
- **The half-buried transit level** by Lindqvist's trailer said it belonged to "Sam Okafor,
  your dead research partner", left there 14 months ago. That's text from the old 3D story:
  the bible retires Sam (`story/00_MASTER_BIBLE.md` §11, with Ellis, Tariq, Iry, the
  Uarha, the Heart, the Order of the Unshut Eye and the Perennial Concern). In the new
  canon you've never been here before. It's now **Miriam's level**, left in the sand four
  days ago, with "M.H." scratched into the brass.
- **A sweep of everything else you can read found nothing more:** every Giza object, room
  and scene, checked for the retired names.

## POKE-STYLE P0.25 — 2026-09-30 — (branch `poke-style`) The game explains digging, and what water and food do
- **Digging with the detector:**
  - when you pick it up, the text and the toast now say how it works: Q switches it on,
    walk slowly, and when the screen says DIG HERE, press SPACE to dig (five minutes)
  - the readout says **SPACE: DIG** instead of just DIG HERE
  - the first time you're standing right on something, a notice says "Right under your
    feet. Press SPACE to dig."
- **Water and food, explained:**
  - the first time either drops to half, a short scene explains it: they run down as time
    passes, the bars are in the corner and blink red below a fifth, and at nothing you
    can't run (walking is fine). It lists where to drink and eat in the area you're in:
    Giza or Saqqara. It shows once per game.
  - the cook at the workers' cooking table gives the same advice the first time you visit
    ("A man who runs dry out here can't run at all")
  - at Saqqara, the café owner gives it too
- The audit and the three playthroughs are clean.

## POKE-STYLE P0.24 — 2026-09-30 — (branch `poke-style`) Area 1 fixes: a task tracker, needs on screen, the tea game redrawn, darts, lamps, the oasis
- **A task tracker** (`poke/tracker.js`):
  - a compass in the bottom-right corner points to the task you're tracking, with the
    distance above it (indoors it points to the door)
  - it tracks your newest task until you pick another: in **TASKS** (Esc), SPACE on a task
    tracks it, marked TRACKING
  - **T** flashes a big arrow over your head for three seconds, pointing the way
  - every Giza task has a destination, and it follows where the task has got to (Saber's
    kettle, then the burn bin; the nearest sherd, then Hana)
- **Water and food on the main screen:** two bars beside the compass, a drop and a loaf.
  Each blinks red below 20%.
- **The survey map in Miriam's tent** opens full screen when you look at it: the concession
  with the escarpment, the Osiris Shaft, the causeway, the fence, and trenches A, B and C in
  red pencil, with the Coptic ⲡⲏⲓ beside C underlined twice. SPACE puts it down, then her
  note appears as before. (Any wall picture can do this now.)
- **The tea minigame is redrawn;** the mechanics are unchanged:
  - the workers' fire at night, with coals glowing in the corner and stars overhead
  - a brass tray with two glasses already poured, a sugar bowl and a bunch of mint
  - a clear tea glass with a gold rim, the tea darker at the bottom, foam, bubbles, mint,
    steam, and gold lines to pour between
  - a blackened teapot in a hand, tipping as you pour a thick amber stream from high or low
  - the gauges in a brass frame
- **Darts no longer throws by itself** when you start again. The SPACE press that chose
  "play" was being read as a throw. Every minigame now waits for you to let go of SPACE
  first.
- **The painted sherds** stand up out of the sand at a tilt, heaped round their foot, and
  the glint now shines on the find itself (for fossils too). Before, it glinted at the top
  of the tile.
- **The lamps:**
  - the brightness is back to how it was
  - the four camp lanterns (two in each camp) used the same sprite as the street lamps, so
    they looked like lamps put in odd places; they're hurricane lamps on crooked wooden
    poles now, with a flickering light
  - two more street lamps on the footpath south, on the same kerb rule
- **The oasis:**
  - six more palms round the pool
  - a grove of palms from the cliff down to the fence's west end, with a solid line behind
    them, so you can't walk round the fence into the dig zone that way any more
- The audit and the three playthroughs are clean. The look check shows every view
  different now, because the new corner panel is on screen.

## POKE-STYLE P0.23 — 2026-09-30 — (branch `poke-style`) The Inspector's opening begins: Saqqara (Chapter 1-B, step 1)
- **The Inspector is playable.** Pick the Inspector and their three intro scenes play (the
  ledger, the Director's office, Saqqara). Then you arrive at the inspectorate at 08:30 on
  a Tuesday morning. The plan for the rest is in `poke/INSPECTOR_TODO.md`, taken from the
  bible's Ch1-B.
- **Each background has its own place** (`poke/areas.js`): its own map, what things say,
  when its clock starts, and its story hooks. The Archaeologist's Giza is unchanged, pixel
  for pixel.
- **Saqqara** (`poke/saqqara.js`) is 80×58 tiles, the same size as the Giza camp:
  - **the desert necropolis:**
    - the Step Pyramid of Djoser inside its panelled enclosure wall, entered by the one
      real gate
    - the Heb-Sed chapels, the serdab (Djoser looks out through its holes) and the South
      Tomb's cobra frieze
    - the Serapeum's steps down to its locked gate in the cliff, and the ghaffir's hut
    - the Teti pyramid (a hill of its own rubble) and its dig with Rais Gad
    - a field of mastabas, one with a fresh robbers' hole
    - the sealed tomb in the far corner, with a faint painted river, a woman and a boy
  - **the inspectorate compound** on the escarpment's edge
  - **the coach park:** a tour coach, camels, a souvenir stall
  - **Mit Rahina, down in the green:**
    - fields and canals, and palm groves
    - village houses, some with the Hajj painted by the door
    - the mosque and its minaret, the café, the bakery, the village well
    - the market stalls, the garage, a tuk-tuk, a donkey cart
    - the museum garden with the fallen colossus of Ramesses II and the alabaster sphinx
  - new ground: fields of clover, wheat and onions, and asphalt roads
- **The people follow the bible.** Umm Sabry, Samy Ragab and Rais Gad are on the map, and
  Director Fathi is in his office. All of them have new looks, and nobody comes over from
  Giza. Everyone else is a nameless local.
- **Beat 1:**
  - tea with Umm Sabry: Samy stayed late, and "a black car comes for the Director on
    Tuesdays"; her price is gossip, so there's a task to find who's romancing the
    accountant
  - the Director: "File it as a clerical error."
  - inside the inspectorate: the scratched-out ledger line (Miriam's signature) and Shelf
    4B, empty, the label in Samy's hand
- **Water and food, as the rule says:**
  - water: the village well, water jars at the inspectorate, the Teti dig and the
    Serapeum, the office cooler
  - food: bread at the bakery, ful and ta'ameya at the café, oranges from the fruit stall
- **The Inspector's Investigation skill** (from the bible) is added to the skills.
- **The audit checks every area now.** Saqqara: 11 places, 66 things to look at, all
  reachable; its door and room are fine; 167 scenes, no errors. Giza's look check: 33 of 33
  views identical. The Giza playthroughs are clean.

## POKE-STYLE P0.22 — 2026-09-30 — (branch `poke-style`) The road lamps, evenly placed
- **One rule for every road lamp:** exactly eight tiles apart and always on the same side.
  - main road: the west kerb, from the dig gate to the way out (5 lamps)
  - the roads off it: the north kerb, 3 west to the workers' camp, 3 east to the trench
    path, 1 on the road to the guard post
- **Lamps stand exactly where they're listed.** The old code nudged a lamp down the road
  when its spot was taken, which is what made the spacing uneven. That's gone.
- **Two small moves:**
  - Miriam's metal detector stand moved one tile west, next to the finds table, to make
    room for a lamp
  - the director's camp's second lantern moved to the yard's south-west corner, so it no
    longer pokes out from behind the midnight car
- **The look check:** only lamp positions (and the lighting at night) changed. The audit
  (the midnight car still covers nothing) and the three playthroughs are clean.

## POKE-STYLE P0.21 — 2026-09-30 — (branch `poke-style`) The shaft, the old seal, the builders' ramp, the sherds and the workers' kitchen redrawn
- **The shaft entrance** stands out now:
  - a portal of big dressed limestone blocks with a keystone lintel set into the cliff, and
    a heavy timber frame inside it
  - the ladder going down into the dark, and the steel grille swung open with its padlock
    hanging
  - a timber A-frame with a pulley over the top, a yellow danger sign and sandbags
  - a lantern on a hook that glows at night
- **Petamun's seal:**
  - a round panel sunk in the rock, with a ring of pale stone round a glossy amber core
  - four glyph stones at its compass points: the owl, the eye, the serpent and the lion
  - the name cut small above it, and a timber brace across it
  - the amber glows faintly at night
- **The builders' ramp:**
  - a long mound rising east to the cliff, with a front wall of coursed mud brick
  - where the wall has tumbled, the rubble fill spills out in a fan of chips
  - on top: packed rubble, a trackway of timber sleepers and the two sledge ruts
  - a survey string on red pegs with a label tag, because it's being dug
- **The painted sherds** are curved terracotta shards with a red ochre band, a black line
  and pale broken edges, not dots.
- **The workers' kitchen** is a long trestle table under a reed-mat awning:
  - a big aluminium pot of lentils steaming on a gas ring, and the blue gas bottle
  - stacks of bread, a tray of tea glasses and a kettle
  - a chopping board with a half-cut onion, enamel plates and a basket of tomatoes
- **The vegetable crates** are proper slatted crates heaped with tomatoes, onions,
  cucumbers, aubergines and oranges, each with a burlap sack of potatoes slumped beside it.
- **The look check:** only the views with these things changed. The audit and the three
  playthroughs are clean.

## POKE-STYLE P0.20 — 2026-09-30 — (branch `poke-style`) Music; fewer lamps that reach further
- **Music** (`poke/music.js`): little chiptune loops made on the fly, with no sound files.
  Each has a square-wave lead, a triangle bass, soft arpeggios and a darbuka (doum and tak).
  Most are in maqam Hijaz, one in a minor Nahawand. Each place has its own tune:
  - **title:** slow and grand, for the title screen and the chapter-end card
  - **camp by night:** bell-like, unhurried, 16 bars (most of the story is at night)
  - **camp by day:** a walking tune over the maqsum rhythm, 16 bars (also the minigames)
  - **indoors:** a small plucked tune
  - **down the shaft:** a low drone, a slow line and water dripping

  It fades between tunes as you go in and out or the night comes on. A new **Music**
  setting (Off / Low / Normal / Loud) sits next to Sound in the menu. Browsers only allow
  sound after a key or a click, so the music starts on your first key press.
- **Road lamps:**
  - 11 instead of 18, about eight tiles apart on the kerbs, taking turns side to side
  - one at each junction's corner, none bunched up
  - the bright pool of light is the same size, but a dim glow now reaches about three
    times as far, so the road between lamps isn't dark
  - the yard lanterns got the same longer glow
- **The look check:** by day, only the lamp positions changed; by night, the lighting did.
  The audit and the three playthroughs are clean.

## POKE-STYLE P0.19 — 2026-09-30 — (branch `poke-style`) Seven buildings open up; the guard post, the trailer and the scaffold redrawn
- **You can go inside seven more buildings.** The first time you step in, you read what the
  building used to say when you examined it. What used to happen at the door now happens at
  the thing inside it belongs to.
  - **The guard booth:**
    - Farouk's chair (nobody sits in it), his radio and thermos
    - his Qur'an on its own shelf and an out-of-date calendar
    - a kettle of his tea you can pour yourself (water +15)
  - **The old Ministry post:**
    - a dusty 1998 ticket book on the desk and a 1996 plateau map ("NOT ALL")
    - Farouk's Friday galabeya on a hook and his camp bed ("never sleeps on duty")
    - a fan that shouldn't still work
  - **Lindqvist's trailer:**
    - the rattling air conditioner and a laptop of red cells ("RING THE FOUNDATION")
    - the unopened Ministry letters and photos of home
    - a fridge with bottled water (water +35, fills the canteen)
  - **The dig shed:** padlocked until the Rais opens the dig zone, and the door tells you
    so. Inside are the tool rack, the sieves, the finds trays and rubber buckets, and
    **Miriam's clipboard**. Trench B's clue is now photographed in here.
  - **The mess tent:** the long table and benches, a four-day-old newspaper. The **bread**
    (food +30, every 2 hours) and the **urn** (water +35) moved in here from the doorway.
  - **Hana's tent:**
    - her conservation table, the chemicals shelf and the first-aid tin
    - a cot with hospital corners and her photos from other digs
  - **The sheikh's tomb:**
    - the cenotaph under its green cloth, inside a railing hung with wish rags
    - **the lamp niche**, where you light a candle now
    - a patch of rock in front of its door opened up so you can stand there

  The find store stays sealed: the story opens it.
- **Redrawn from outside:**
  - **The old Ministry post** is now a real abandoned concrete hut instead of a white
    cabin:
    - render peeling to the breeze blocks, rust stains, one barred window, a rusty air
      conditioner
    - a green steel door under a slab porch, and a faded MINISTRY OF ANTIQUITIES sign
    - a bench and sand drifted against the walls
    - on the roof: a frayed flag, a guyed mast, the tank and dish, sandbags, a pigeon loft,
      old tyres, a roof hatch, a broken chair, and a washing line with Farouk's galabeya
  - **The guard booth** is a little whitewashed sentry box with a blue fascia:
    - through its window: the chair, the radio, the thermos and the Qur'an
    - basil in a tin, a lamp over the door, a plastic chair, a kettle on a gas ring
  - **Lindqvist's trailer** is a ribbed aluminium caravan up on blocks:
    - a window air conditioner, dripping
    - a Swedish flag sticker on the door and the letters piled on the wooden steps
    - a tow hitch, wheels, a solar panel, roof vents, a dish, and a cable to the generator
  - **The trench scaffold** is a real tube-and-coupler tower:
    - two bays and two lifts, braces, couplers, plank decks with toe boards, and a ladder
    - a green shade cloth, hazard tape, and a gin wheel hauling a bucket
    - sandbags on the base plates
- **The audit now checks the rooms too:** every door can be reached, every room builds, and
  everything in it that has a name has something to say. It's clean, with 134 scenes. The
  three playthroughs pass (Trench B's clue is photographed in the shed now). The look check
  shows only the views with these buildings.

## POKE-STYLE P0.18 — 2026-09-30 — (branch `poke-style`) The big boulder, the fossil pavement, water and food all over the camp
- **The big boulder** is redrawn as it's described: a car-sized limestone block with its
  front cut flat. The quarrymen's row of wedge slots and the split that never ran true are
  still in it, with pick marks, a sunlit top, a shadowed east side and chips at its foot.
  The palm beside it moved one tile east to give it room.
- **The fossil pavement** is now a real shelf of bedrock instead of beige blobs:
  - a ragged edge with sand blown back over it
  - joints splitting it into slabs, lit on the upper left
  - nummulites in drifts, two ammonites and a sea urchin
  - the loose fossils you pick up are little ammonites now

  The army crates that sat on top of it moved to the edge of the guard post yard.
- **Water and food wherever you go** (each spot fills the canteen too):
  - **a second well**, the Bedouin well by the shelter (drink 70)
  - **water jars (a zeer)** by the sieve in the dig zone, by Trench A, and at Farouk's post
    (drink 40)
  - **a sabil** by the sheikh's tomb: a stone niche with a water jar that somebody always
    keeps full (drink 40)
  - **the mess tent:** bread (+30 food, every 2 hours) and water from the urn
  - **date palms in fruit** at the oasis and by the old village: pick a handful (3 dates)
    every 4 hours
- **Thirst and hunger hints** and the canteen's description now name these places.
- **A new rule in `AREA1_TODO.md`:** every map gets a well, water jars and a food source.
- **The look check:** only the views with these changes differ. The audit (131 scenes) and
  the three playthroughs are clean.

## POKE-STYLE P0.17 — 2026-09-30 — (branch `poke-style`) Area 1 checked from end to end (step 9, part 1)
- **Area 1 (the Archaeologist's night at Giza) is complete.** Steps 1–8 of `AREA1_TODO.md`
  are done, and this update is the final check.
- **The audit:** all 124 scenes. Every conversation link and every scripted object points at
  a scene that exists. Every scene's words and choices work under 60 rounds of random story
  states. Everything you can examine can be walked to. The story's first people can be
  reached while the dig gate is still locked. The midnight car covers no door, road or
  person, and the tent door stays reachable.
- **Three full nights played on the game's own clock**, so midnight, the car and thirst and
  hunger all happen as they do in play:
  - **the quiet exit:** save and load mid-search (the car and all three searchers come back),
    and the clock running free after the chapter-end card with no second car
  - **the legal exit:** Amira called early, the shaft, save and load down it (you're back at
    the top), knocked out and robbed of the page, Amira remembering the promise
  - **the deal:** the Codex taken before midnight so the car never comes, Bosta at your heel
    across a save and load

  Money, flags and each chapter-end card came out right. No errors.
- **Speed:** 0.5–5 ms a frame at night in the busiest parts of the camp, against 16.7 ms.
- **The checks are in the repo** (`tools/poke_checks/`), to run after any change:
  - `poke_audit.js`
  - `poke_playthrough.js`
  - `poke_look.js <older build>`: the pixel-for-pixel look check

  No gameplay changed in this update.

## POKE-STYLE P0.16 — 2026-09-30 — (branch `poke-style`) Real spoil heaps; secrets and lore (Area 1, step 8)
- **The spoil heaps are real piles of earth now**, not flat ovals (you asked for this).
  - Each heap's surface is modelled with a rounded top, a soft skirt and a few lumps. It's
    drawn a pixel at a time and shaded in four flat tones by its slope, lit from the upper
    left like everything else in the camp, with pebbles and an outline.
  - **Four sizes:** the big heap by the find store down to the two small ones. Trench B's
    heap (the one with the red stake) is darker: fresh earth, as the story says.
  - **The shadow is fixed.** A soft shadow sits at each heap's foot, in place of the boxy
    building shadow they used to get.
  - A heap is solid only where it's drawn.
  - These two dig-zone views are the only things that look different; the camp's other
    31 views are pixel-identical to P0.15.
- **The secrets of the plateau** (bible §SECRETS), with a **Secrets of the plateau** page in
  the journal that counts them (and a notice as each one turns up):
  1. the bronze seal of Petamun
  2. the painted sherds that join into an ibis (and Petamun's seal has an ibis too)
  3. Miriam's bookmarked Setne story: "Coptos. The river. Why always the river?"
  4. the eye-in-a-house mark on the quarry block
  5. the car by the Osiris Shaft, from the watchtower through the field glasses

  The chapter-end card says how many you found. They pay off in later chapters.
- **Lore, ported from the 3D build:**
  - **The mason's marks:** "The Drunkards of Menkaure" in red ochre, and the much later
    eye in a house. If you've seen the block, the Codex's first page shows the same mark
    in its margin (and the other way round).
  - **The false door** in the workers' cemetery: Petety's curse, readable at Hieroglyphs 2
    (crocodiles in the water, snakes on land).
  - **The builders' ramp:** its sledge ruts, and the long argument about how the stones
    went up (Hatnub, 2018).

## POKE-STYLE P0.15 — 2026-09-30 — (branch `poke-style`) The shaft, the watchtower, the train (Area 1, step 7)
- **Inside the Osiris Shaft** (`poke/ch1_places.js`): climb down from the survey shaft at the
  foot of the cliff. There are three levels of cut limestone, each lit only by work lamps
  and your torch:
  - **Level 1:** a bare chamber, the 1999 clearance mark, the ladder down.
  - **Level 2:** three sarcophagi in their niches, lids long gone. One is granite, with a
    Greek name scratched on it and scratched out.
  - **Level 3:** flooded. Two black pools either side of a causeway of rock, the granite
    sarcophagus on its island, and **the niche** in the back wall where Miriam found the
    Codex.

  Each ladder costs five story minutes. Walk onto the ladder at the bottom to climb back up
  a level, and from level 1 back out into the night. Saving down there saves you at the top.
- **The watchtower:** climb it (Climbing XP) and every place on the plateau goes on your
  map. With Miriam's **field glasses** (one of her caches) you see a car with no lights by
  the Osiris Shaft, someone sitting very still inside. It goes in the journal.
- **The supply train runs** once Uncle Hamid has his coupling pin. The loco and its two
  skips go up and down the line, pausing at each end, with the chug of the engine when
  you're near. It doesn't block you while it's moving.
- **Trench B's red stake** stands on its spoil heap by the sieve until you've sifted out the
  MAG key.
- **The find store's Ministry seal** (paper and red wax) is on its steel door. It shows
  whether it's whole, slit cleanly, broken, or resealed with Hana's dark wax.
- Already on the map from before, and checked: Hagg Sayed and his horses, the spoil heaps,
  the mason's marks, the false door, the builders' ramp, and Bosta's home by the fire.
- **What's new to look at:** only the stake and the seal. They're small, both in the dig
  zone, and both change with the story. The camp's 33 views without them are
  pixel-identical to P0.14.

## POKE-STYLE P0.14 — 2026-09-30 — (branch `poke-style`) The phone, skills, needs, injury and the camera (Area 1, step 6)
- **Skills and XP** (`poke/systems.js`), from `story/06_SYSTEMS.md`:
  - Fifteen skills, levels 0–5 (100, 250, 450, 700 and 1,000 XP). Each background starts
    with its own levels; the Archaeologist has Excavation 3, Hieroglyphs 2, and Greek,
    Coptic, Photography and First aid 1.
  - **You learn by doing.** Excavation comes from digging, the sieve, the detector and the
    sherds. Coptic from reading the red stake; Hieroglyphs and Greek from the seal and the
    Codex; Photography from photos; Stealth from listening unseen; First aid from being
    patched up; Riding from the race. A little Egyptian Arabic comes from every real
    conversation with someone who speaks it.
  - A notice when a skill goes up.
- **Thirst and hunger** drain slowly with the story clock and are never deadly. At empty you
  can't run until you drink or eat.
  - To drink: the well at the oasis, the water barrels, tea, your **canteen** (three swigs;
    refill it at the well or the barrels).
  - To eat: lentils at the cooking table (once every three hours), dates.
  - Water and food show on the menu card and the phone, with a notice when you're thirsty
    or hungry.
- **Using things in the bag:** SPACE on the canteen, dates, the thermos of karkadeh or a
  glass of mint tea.
- **Injury:** the seal's dart, or a knock on the head behind Miriam's tent, and you limp:
  slower, and no running. Hana patches you up, or resting takes the worst of it. The menu
  card says LIMPING.
- **The phone (P):** ◄► switches app, ▲▼ scrolls.
  - MAP: open tasks, and the places you've found, with distances.
  - MESSAGES: the department's advance at 20:30, and "Go to bed, Doctor. She would want you
    to." from an unknown number at midnight.
  - CONTACTS: everyone you've met and how they feel about you. Once you have Miriam's spare
    phone you can call "A.S." from here.
  - BANK: your balance and a ledger of every payment.
  - SKILLS: dots and XP bars.
  - NOTES: the journal.
  - PHOTOS: your gallery.
- **The camera (C):** photograph whatever you're facing (with a flash). New subjects train
  Photography: the mason's marks, the false door, the red stake, the seal and more.
  Photographing the midnight visitors is the evidence scene. The old woman won't be
  photographed.
- The camp's 33 views are pixel-identical to P0.13. The story, side quests and minigames
  still play through.

## POKE-STYLE P0.13 — 2026-09-30 — (branch `poke-style`) The minigames (Area 1, step 5)
- **Five minigames in the pixel style** (`poke/minigames.js`), in place of the stand-ins:
  - **The sieve:** press ◄ and ► in turn to shake the heap. The earth drains through the
    mesh and the finds come up: sherds, faience beads, copper coins, bone, worked flint, and
    plenty of stones. ▲▼ picks one and SPACE bags it, with 25 seconds a heap. Trench B's heap
    under the red stake has **the MAG key** in it; lose it in the sand and you sift again.
    There are three more old heaps for the register (Hana's valuation adds 20%).
  - **Mint tea:** ▲▼ raises and lowers the kettle; hold SPACE to pour. Pour from a height
    for foam, but too high and it splashes. Stop at the gold line with a proper head of
    foam. The results are perfect, short, flat, messy or spilled. A perfect glass wins Saber
    over, and it's what Farouk would rather have than money.
  - **Darts on a real board:** 20 segments, doubles, trebles, the outer bull and the bull.
    Aim with the arrows. Your hand sways, and holding SPACE steadies it for about a second
    before your arm starts to shake. Let go to throw; three darts. Beating the Rais's 132
    takes two trebles. (The 3D darts could only score 125 or 150 near there, so "beat 132"
    really meant three bullseyes. The real board fixes that.)
  - **Petamun's seal:** the ring of pale stone, the amber core and four glyph stones,
    drawn as glyphs: owl, eye, serpent, lion. Pick a stone with the arrows and press it
    with SPACE. The first press wakes it, and the resonance (the beads round the ring)
    drains in about ten seconds. A wrong stone fires the cedar dart and the stones move
    round.
  - **The race:** the old grey against Hagg Sayed's bay, side-on under the pyramids. Press
    SPACE as her stride marker crosses the gold to keep her going. The three moments from
    the bible (off the line, the turn at the quarry markers, the run home) are choices
    during the race, and they change how she runs.
- **Tuned by playing them automatically:**
  - Darts: a bot with perfect aim beats 132 in about two rounds out of three. Aiming by eye
    and timing the release, a person will do worse.
  - The race: you can't win without timing your taps; decent timing wins about 30% of
    races, and good timing wins nearly all of them.
- The camp's 33 views are pixel-identical to P0.12, and the story and side quests still
  play through.

## POKE-STYLE P0.12 — 2026-09-30 — (branch `poke-style`) The side quests (Area 1, step 4)
- **All eleven side quests from the bible**, ported from the 3D build with its words and
  rewards (`poke/ch1_side.js`, `poke/bosta.js`):
  1. **The Rais's Son:** pay Mina's 1,500 EGP, hand over the darts winnings, or **race Hagg
     Sayed** on his old grey mare at the camp gate. Three choices during the race decide
     it. Win and the debt is gone (Rais +15).
  2. **Hana's Conservation:** the three sherds give you the wax and now **Hana's
     valuation**: +20% on the sherd set. Find **all eight sherds** and the register pays
     for the set (250 EGP, 300 with her valuation), and they join into Thoth's ibis.
  3. **The Tea Boy's Secret:** Saber only talks to someone who pours a proper glass (the
     kettle by the fire), then tells you about Lindqvist's burn bin. A glass of mint tea
     is also what Farouk would rather have than money.
  4. **The Truck of 1926:** the glovebox diary (the old woman with a lamp, "one of the
     Keepers"). The four relics dug with the detector get logged with the Ministry
     (600 EGP, Ministry +5), and showing the Rais the glass plate of his grandfather is
     Rais +12.
  5. **Supply Line Blues:** Uncle Hamid's coupling pin, in the sorted crates (1,500 EGP,
     workmen +10). Dig up his lost multitool and he'll be glad of it (50 EGP).
  6. **Miriam's Caches:** dig up her spare phone and you can **call "A.S."**, then or
     later from Miriam's desk. That's Amira, early (Amira +12), and the legal exit
     remembers that you kept your promise.
  7. **Darts Night:** a 200 EGP stake; beat the Rais's 132 for 2,000 EGP and the nickname
     "Abu Ramy".
  8. **Bosta:** wake the camp dog, scratch her ears, give her dates (Miriam's cache, the
     Bedouin shelter) and **she follows you**. She trots along the way you walked, sits
     when you stop, and lies down if you wait. Teach her to sit three times and she gives
     you her paw. At midnight she barks at the car and growls at Lena. She has new
     walking and sitting frames in the camp's style. While she's at home she's the same
     dog by the fire as before.
  9. **Pharaoh's Lentils:** the five fossils on the fossil pavement.
  10. **The Lamp at the Tomb:** the old woman at the sheikh's tomb (at night) knows Miriam
      is "somewhere safe" and gives you the Keepers' tile (Keepers +5). You can also light a
      candle at the tomb.
  11. **The Looters' Pit:** take the faience Eye of Horus the robbers missed, or leave it
      for the Ministry. Show it to Hana and she'll log it for the inspectorate.
- Also: Hana's finds tray, and dates at the Bedouin shelter.
- **Skills** have their starting levels by background now (the Archaeologist: Excavation 3,
  Hieroglyphs 2), with XP building up for step 6.
- **Stand-ins until step 5:** pouring tea always works, and darts is a random score that
  beats the Rais about half the time, so the 2,000 EGP isn't free. The race is choices, as
  the bible has it.
- Tested: every quest start to finish, Bosta following, sitting, pawing and growling, and
  save and load with her following. The main story still plays through, and the camp's
  33 views are pixel-identical to P0.11.

## POKE-STYLE P0.11 — 2026-09-30 — (branch `poke-style`) The detector, rebalanced
- **The detector is no longer a money printer.** Digging up all 40 spots paid about
  3,350 EGP (42% of your starting money), enough to make the payroll choice free. It now
  pays **2,041 EGP**, most of it Miriam's 1,200 EGP emergency tin, as the bible has it.
  - The 16 finds from the 3D chapter are unchanged.
  - **The seven antiquities** go to the Ministry's **finds register**: the silver
    tetradrachm, the Napoleonic button, the Mamluk fals, the Camel Corps badge, the Persian
    arrowhead, the silver ring and the quarryman's chisel. "It belongs to Egypt, not to you."
    Each pays a flat 50 EGP finder's fee (they paid 120–400 before).
  - Each one goes into a **Finds register** page in the journal with its history: the
    Ptolemies and the Library, Napoleon's savants, the Mamluks' Cairo, the Persian
    conquest…
  - Completing the register (7 of 7) gives the Ministry +5 reputation.
  - Each antiquity gives 15 Excavation XP. It's kept now, for skills in step 6.
  - The junk still pays pocket change for scrap (about 110 EGP in all).
- **Fixed:** the Napoleonic button and the Camel Corps badge used to pay you *and* let you
  keep them.
- Digging up all 40 costs about 3 hours 20 minutes of the night (5 minutes a dig), not
  counting the walking.

## POKE-STYLE P0.10 — 2026-09-30 — (branch `poke-style`) Miriam's metal detector
- **The detector is a real tool now** (`poke/detector.js`). Take it from beside Hana's table,
  then press **Q** outdoors to switch it on:
  - **The coil** swings in front of you as you walk.
  - **The tick** gets faster and higher as you close in. Its note tells you the metal: iron
    growls low, silver sings.
  - **Face the signal:** it reads loudest straight ahead, so turn on the spot to find the
    direction.
  - **Its own little screen** (bottom left) has eight signal bars. Close in and it reads the
    **metal** (IRON, FOIL, TIN, ALLOY, BRASS, COIN, SILVER) and **how deep** it is.
  - **Right on top of it**, the screen says DIG HERE, with a ring round your feet and an
    arrow over your head. **SPACE digs**: dirt flies, five story minutes pass, and you leave
    a hole.
- **40 things to find:**
  - The 16 finds from the 3D chapter now give what they say:
    - **Miriam's caches** (a side quest): her emergency tin (1,200 EGP), her spare phone,
      her field glasses, her old rucksack. Found X of 4.
    - **The four 1926 relics** (a side quest): the Kodak, the Harvard trowel, the brass tag,
      and the glass plate with the Rais's grandfather on it.
    - Eight others: coins, scrap, a thermos, a compass, Hamid's multitool…
  - 24 new ones on open sand. Most are junk: ring-pulls, bottle caps, nails, a tin spoon.
    Some are history: a silver tetradrachm of Ptolemy II, a Napoleonic button, a Persian
    arrowhead, a Mamluk fals, a Camel Corps badge, a silver ring. The site register pays a
    finder's fee for the old ones.
  - FOIL is always junk and IRON nearly always, but not quite. Brass and silver are worth
    digging.
- **What changed on the map:** the 16 small "something buried" bumps are gone. The finds are
  under the sand now, so only the detector hears them. Nothing else moved: in the pixel
  check, the only differences are those bumps (107 pixels each).
- Everything you dig is saved. The journal keeps a "Detector finds" count, and the screen
  shows how many are left.

## POKE-STYLE P0.9 — 2026-09-30 — (branch `poke-style`) The main story, and a watch in the bag (Area 1, step 3)
- **Chapter 1-A can be played from the gate to the chapter-end card.** Every main beat from
  the bible is in, ported from the 3D `ch1a_story.js` with the same words and choices:
  1. **The payroll** at the Rais's fire. The site account is 6,000 EGP short. Pay it
     yourself, send him to **confront Lindqvist** (the Foundation's "emergency float"), or
     **delay**. Each changes how people feel about you, and all three get you **Miriam's key
     ring** and open the dig gate. Lindqvist has his whole conversation: "Friday", the mother
     who died years ago, the Vasse Foundation, the "lost" key.
  2. **The trenches:**
     - **Trench A:** dig where the stake was moved, 20 minutes with the men or 45 alone, and
       find Miriam's notebook page.
     - **The dig shed clipboard:** Trench B's spoil went to the heaps by the sieve.
     - **The sieve:** under the red stake is the **MAG key**.
     - **Trench C:** the red stake with Coptic ⲡⲏⲓ on it.
  3. **Uncle Farouk** at the guard booth: the black Land Cruiser, and "the other car comes
     at midnight." Pay him 500 EGP (or give him Saber's tea, once the tea is in) and he
     owes you.
  4. **The midnight car.** At midnight, headlights on the road in. A few minutes later a black
     Land Cruiser is parked by the director's camp, and Lena Brandt and her two men are
     searching Miriam's tent for 90 story minutes. You can:
     - **listen** from the shadows
     - **photograph** them
     - **step into the light** and meet Lena (she gives you her card)
     - **slip into the tent** behind them: you're knocked out, wake at the workers' fire,
       and they take Miriam's page
     - **miss it**, and they're gone when you get back

     Walking up to the tent door while they're inside counts as finding them.
  5. **The find store:** the MAG key. Slit the seal cleanly or break it. **The Codex** is in
     Miriam's green scarf, with her note. With Hana's wax you reseal the store.
  6. **The Osiris Shaft (optional):** climb down to the empty niche on level 3. **The old
     seal** on the shaft approach: press owl, eye, serpent, lion in order from the choice
     box. A wrong stone fires a cedar dart, grazes you, and moves the stones round; Hana
     patches you up. Behind it is the **bronze seal of Petamun**. (Step 5 redraws this as a
     pixel minigame.)
  7. **Headlights**, once you have the Codex, and the exit choice: **quiet** (on foot through
     the quarry), **legal** (call Amira), or **deal** (the Foundation's car, 5,000 EGP).
  8. **The chapter-end card:** everything that carries forward (the list scrolls if it's
     long), then keep exploring the camp with the clock running free, or go back to the title.
- **The dig gate** is chained and padlocked until you have Miriam's keys, and you can't walk
  through it. The fence doesn't reach the cliffs, so the dig shed and the shaft are padlocked
  too, and the find store needs the MAG key. The chain is the only new drawing, and it goes
  once the gate opens.
- **Also ported:** the Rais's son Mina (pay his 1,500 EGP debt), Miriam's desk, books and
  photographs, Gamal and the chalk tally in the dormitory, the payroll ledger, and the burn
  bin in the site office.
- **Tasks** follow the story as you go.
- **A watch in the bag.** It's always the first thing in your BAG: a pixel watch face at the
  story time, how long until midnight, and the time in the bag's title bar.
- "New task" notices are one short line now; the full text is in TASKS.
- The minigames (the sieve, the tea) have stand-ins until step 5: sifting finds the key
  straight away.
- Tested: all three payroll choices, all three exits, every midnight outcome, and saving and
  loading at midnight. The camp's 33 views (every place, day and night, and the three rooms)
  are pixel-identical to P0.8.

## POKE-STYLE P0.8 — 2026-09-30 — (branch `poke-style`) The story clock (Area 1, step 2)
- **Chapter 1-A is one night.** You arrive at 20:30. A story minute passes for every 2 real
  seconds, so midnight comes after about seven minutes of play. The clock only runs while
  you're walking about, not during a conversation or in a menu. It stops at 04:40, and after
  the chapter-end card it runs free.
- **The light follows the story clock.** "Time of day" in Settings has a new option,
  **Story clock**, and it's now the default. The camp starts at night, and the lamps and the
  old woman come out with it. Saved settings from before this update move onto it once.
  Dawn, Day, Dusk, Night and Moving clock are still there if you want to hold the light.
- **The menu clock** on the permit card shows the story time.
- **Resting:** at the workers' fire, or on Miriam's camp bed in her tent:
  - **Rest a while:** the screen goes dark and an hour passes.
  - **Wait until midnight:** there after you've met the Rais, until the midnight car.
  - At 04:40 there's no more night left to wait out.
- **Midnight:** headlights on the east road, with a low rumble. The car arriving and Lena's
  search of the tent come in step 3.
- The camp's look hasn't changed: 33 views (every place, day and night, and the three rooms)
  are pixel-identical to P0.7.

## POKE-STYLE P0.7 — 2026-09-30 — (branch `poke-style`) The story engine (Area 1, step 1)
- **The story now has state.** A new `poke/story.js` keeps the story in `Game.story`, and it
  saves and loads with the game:
  - flags
  - affinity with people (`rel`) and reputation with factions (`rep`)
  - money: 8,000 EGP for the Archaeologist, and each background's own amount
  - tasks
  - the story clock (it's stored now; step 2 makes it run)
  - Key items go in the bag, marked with a ★ and listed first.
- **Choice boxes.** After the last page of text, a DS-style box of answers opens on the
  right, above the text box. ▲▼ picks an answer and SPACE chooses it. ESC picks the last
  answer, which is usually "leave". There's a short pause before it takes an answer, so
  mashing through the text can't pick one by accident.
- **Scripted conversations.** People and things can run a scene (lines, choices, flag
  changes) instead of their single line. Scenes use the same format as the 3D build's
  `ch1a_story.js`, so the rest of Chapter 1-A can be ported almost as it is. The new
  `poke/ch1_scenes.js` holds them.
- **Ported so far:**
  - **The arrival.** The Rais's full conversation at the gate, with its choices.
    It leaves you four tasks.
  - **Hana.** Her whole conversation, and her side quest: bring her three painted sherds.
    She gives you the conservation wax.
- **"… will remember that."** A quiet notice in the top right when a choice matters to
  someone. It never says how. You can turn it off in Settings ("Choice notices").
- **TASKS** in the menu: open tasks first, finished ones ticked off below them.
- **The permit card** in the menu shows your money.

## POKE-STYLE P0.6 — 2026-09-30 — (branch `poke-style`) Four backgrounds, each with its own opening
- **Who are you?** After the story so far, you now pick one of the four backgrounds from the
  bible (`story/01_CHARACTERS.md`).
  - Each one shows where it starts (a little painting of the place), who you are, what has
    happened to you, your skills and languages, your starting money and gear, and an
    **ONLY YOU** panel: what this background has that the other three don't.
  - **The Archaeologist** starts at the Giza dig camp. Excavation 3: the only one who can run
    a dig.
  - **The Inspector** starts at the Saqqara inspectorate. The only native Arabic speaker and
    reader, and the best start with the Ministry.
  - **The Fixer** starts at Marsa Tarfa on the Red Sea. Picks locks, haggles, dives, and owes
    Bassem "the Shark" 60,000 EGP. You choose whether they're Egyptian (Arabic 5, reads
    Arabic) or foreign (street Arabic).
  - **The Journalist** starts in Port Said. Photography 3, the best French, the most money.
  - All four roads meet in Cairo in Chapter 2.
- **Your papers match your background:** a permit to excavate, an inspector's identity card,
  a harbour pass (with the debt written on it), or a press card.
- **Each background has its own opening cutscenes** after the papers, from its region file
  in the bible, ending with you standing in your starting place:
  - The Archaeologist: the Ministry's letter of appointment, then the taxi at the dig gate.
  - The Inspector: the ledger with the Codex's line scratched out, then Director Fathi
    behind his newspaper, then Saqqara.
  - The Fixer: the note on your door, then Bassem's offer on his terrace, then the harbour.
  - The Journalist: Miriam's email, then the waterfront hotel in Port Said.
- **Only the Archaeologist's opening can be played so far.** The other three can be picked:
  you make your character and watch their cutscenes, and then it says their opening is being
  built and takes you back to the choice. Their starting areas come next.
- The shared story now ends on the bible's line: four very different people are left
  holding Miriam's trail, and you are one of them.
- **The M map follows your background:** your own opening is on it (nobody else's), and
  Giza comes back as Chapter 14.
- The pause-menu card uses your title: "Dr." only for the Archaeologist.
- The page asks browsers for the new files, so an old cached copy won't load.

## POKE-STYLE P0.5 — 2026-09-30 — (branch `poke-style`) Layout audit, solid props, a real trench
- **A layout audit of the whole camp.** Nothing stands on a road any more (except the dig
  gate and the roadblock, which are meant to), nothing overlaps, and everything you can
  look at can be reached.
  - The workers' camp, the director's camp, the guard post and the booth each sit in a
    yard of trodden sand with footprints, so each area reads as a place.
  - The roads are straight, with clean corners.
  - Buildings and props that sat on a road or in the rock were moved to where they make
    sense: the dormitory, the guard booth and Farouk's radio, the antenna, the dartboard,
    the military crates, a rock pile.
  - The wadi moved east, out of the way. A fence runs along the dig zone, with a gap for
    the gate. Planks cross Trench A.
  - Lamps step aside when something already stands on their spot.
- **Every main prop is redrawn solid and crisp:** a lit top, a shaded front and a dark side.
  - Crates have battens and a brace. Barrels and drums have lit sides, rolling hoops, a lid
    with a rim and bung, and a round end when lying down.
  - Sandbags come in two tied courses. Rocks have a lit crown and a crack.
  - Lamps have a stone foot and a glowing lantern.
  - The long tables are planked, with bowls, bread, tea glasses and greens on them.
  - The generator has vents, a panel with lights and an exhaust. The well has its frame,
    its bucket and water far down. The wheelbarrow is full of spoil with a shovel in it,
    and the vegetable crates are heaped.
- **Trench A** has a dug floor with clods, and the excavators' string grid pegged across it.
- Long tables cast a shadow at their feet, not a wall down one side.

## POKE-STYLE P0.4 — 2026-09-30 — (branch `poke-style`) A fresh camp, crisp art, real cars, the M map
- **The camp is laid out fresh, like a DS town:** a compact tile map with straight roads
  between the areas.
  - The director's camp is in the middle, the workers' camp to the west, and the dig zone
    under the escarpment to the north. The Osiris Shaft and the sealed door are cut into the
    cliff face.
  - Trench A is to the east, the guard post on the road in. The oasis, supply line,
    cemetery, sheikh's tomb, Bedouin shelter and watchtower are all a short walk away.
  - Every person and thing from Chapter 1 is still there, with their story text.
- **Crisp and solid, like the reference:** flat sand with tufts and ripples; clean paths
  with ragged edges; the oasis with a pale rim and light streaks; stepped cliffs with strata.
  No gradients or blur.
- **Cars that look like cars:**
  - The midnight Land Cruiser: black, with tinted glass and a roof rack.
  - The white Ministry cars: a blue stripe, a badge, a light bar.
  - The supply trucks: a canvas tilt and a cab with a grille.
  - The 1926 expedition truck: spoked wheels, a canvas cab and a wooden bed, half buried.
- **New: the M map.** It shows your area with the places you've found named on it; press M
  again to zoom out to Egypt. Every chapter region from the bible is there, locked until the
  story takes you there, each with a teaser. ESC is now the menu, and M the map.

## POKE-STYLE P0.3 — 2026-09-30 — (branch `poke-style`) A cleaner look, buildings with character
- **The grain is gone.** The checkerboard dithering that read as dust or noise is replaced by
  smooth blends and flat colour, and the sand has smooth dune shading.
- **Softer outlines:** each outline is a darker shade of the colour it borders, not near-black.
- **Soft shadows** under buildings, props, trees and people.
- **Closer, and more tilted:** the camera is zoomed in (about 270 pixels tall on most
  screens), and the ground is seen at a steeper angle, so front walls show more.
- **Every building redrawn with its own character:**
  - Miriam's tent: striped canvas, a sunlit roof, a khayamiya-coloured valance, a fly sheet
    over the door, a red lining inside, and her name board.
  - The dorm: a blue tin roof with a water tank, stove pipe and rust, plank walls, a porch
    roof and bench.
  - The site office: whitewashed, with blue shutters and door, a sign, rebar, and a rug
    airing on the roof.
  - The sheds: ribbed tin with double doors and padlocks.
  - The cabins: siding, stripes, window grilles and metal steps.
  - The Ministry post: a flag, a radio mast and sandbags on the roof.
  - The mess tent: patches, a stencilled number, sandbags.
  - The gear store: a striped canopy.
- **Palms redrawn** with clean tapered fronds.

## POKE-STYLE P0.2 — 2026-09-30 — (branch `poke-style`) Chapter 1 as a DS Pokémon-style game
This lives on its own branch and doesn't change the 3D game (still V4.1.6). Open
`poke.html` to play it; `poke/README.md` has the details.
- **The whole Chapter 1 map in 32×32 pixel art,** three-quarter top-down, with free
  movement in any direction. The layout is exported from the 3D build, so every building,
  prop, road, the rail loop and the 19 named places are where they are in 3D.
  - Everything is drawn in code: sand and dunes, roads, the trench, the oasis, the cliffs,
    tents, huts, trucks, the train, palms, people, and the interiors.
- **Pokémon conventions:**
  - A rock-plateau border around the map.
  - Walk up into a door to enter; a mat at the bottom of each room takes you out.
  - SPACE to look at things and talk.
  - A place-name plaque appears when you arrive somewhere.
  - A pause menu with a map, journal, bag, settings and save.
- **Interiors:** Miriam's tent, the dormitory and the site office, fully furnished, with
  new things to examine (her tea tray, her boots, the work table, the safe).
- **The opening:** five illustrated scenes of the backstory from the story bible, to hook
  new players:
  - Alexandria in 391 AD, the Serapeum burning
  - Petamun's seven Houses on a map of Egypt
  - Miriam finding the Codex
  - the black car four nights ago
  - the Ministry's letter
- **Character creation:** male or female, then 11 categories with 10–13 options each
  (skin, hair, hair colour, headwear, face, top and colour, bottoms and colour, shoes,
  accessory), many Egyptian: nemes, kohl eyes, broad collar, kalasiris, shendyt kilt,
  sidelock of youth. There's also a DS-style name grid and your finished permit.
- **Day and night:** dawn, day, dusk, night or a moving clock, with lamps and fires lighting
  the dark.
- New tool: `tools/export_poke_map.js`.

## V4.1.6 — 2026-09-30 — Narration: the text boxes read aloud, with a voice for every character
- **Text boxes are now read aloud** using the voices built into your browser, so there's
  nothing to download.
  - The **narrator** reads the story text.
  - When a character's line has "quoted speech", the quotes are spoken in **that
    character's voice**, and the narration around them in the narrator's.
  - Speech stops when a text box closes, and moves on when you pick a choice.
- **New settings tab: SETTINGS → VOICES.**
  - Turn narration on or off, and set its volume and speed.
  - A voice list for each character: the narrator, Rais Abdallah, Dr. Lindqvist, Hana, Uncle
    Farouk, Saber, Uncle Hamid, Gamal, Hagg Sayed, Lena Brandt, Dr. Amira Sayed, the old woman,
    plus "other men" and "other women" for everyone else.
  - A **pitch** slider for each character, and a **▶** button that plays a test line in their
    voice (it also plays when you change the voice or pitch).
  - **Reset voices** restores the defaults.
- **Default voices:** each character starts with a voice of their gender, spread so neighbours
  sound different, and with their own pitch and pace (the Rais slow and deep, Saber quick and
  high, Farouk slowest of all). The most natural voices are picked first.
- **Getting better voices:** Microsoft Edge has the most natural free voices (marked ★ in the
  list). In Windows you can add more under Settings → Time & Language → Speech → Add voices.
  The VOICES tab says how many voices your browser has.

## V4.1.5 — 2026-09-29 — Lindqvist can be asked about the wages
- **Meeting Dr. Lindqvist before settling the payroll** now gives you *"The Rais says the
  men haven't been paid in eleven days."* He dodges: "Friday. The transfer's coming
  Friday. Geneva is slow." You can press him (he said Friday last Friday too). That costs a
  little of his goodwill (Lindqvist -3) and goes in your notes.
- When you then talk wages at the Rais's fire, you tell him what Lindqvist said, and he
  just repeats "Friday."
- The real answer still comes the bible's way: choose *"Lindqvist is going to explain where
  that money went"* at the fire, then confront him at his trailer. All three payroll
  outcomes are unchanged. The bible's Ch1-A beat 2 now includes the dodge.

## V4.1.4 — 2026-09-29 — Chapter 1: real sand, and a lighting pass through the whole day
**The sand**
- The ground is now your photographed sand (Ground089, from ambientCG), with its colour,
  surface relief, roughness and shading. Each tile covers about 2.5 m, and a second, larger
  sample breaks up the repeat.
- Its colour is balanced toward the old palette, so the level doesn't turn orange. The
  old wind ripples are still there as a light shading pattern about 8 m apart.
- The drawn sand is still the fallback if the texture file is missing.
- New tool: `tools/pack_texture.js` packs any ambientCG / Poly Haven texture folder into
  `textures/<name>.js` (1024 px JPEGs as data URIs, 0.44 MB for the sand). This is needed
  because browsers won't let WebGL use image files from a double-clicked `index.html`.

**The lighting (Chapter 1)**
- **Sunrise fixed:** the sun now casts the light and shadows as soon as it clears the
  horizon. Before, dawn was lit from the moon's side until mid-morning, and the dunes had
  a white glare lit from below the horizon.
- **Golden hour:** the low sun now turns deep amber, with long shadows across the sand, and
  there's still some warm light right at sunrise and sunset.
- **Noon:** more sunlight against less sky light, and slightly lower exposure. The midday
  scene had very little contrast; now shadows and sand detail read.
- **Night:** moonlight is softer and bluer, so the dunes no longer shine white under the moon.
  Lamps and fires carry the camp.
- The brightness setting still scales everything as before.

## V4.1.3 — 2026-09-29 — Crates, drums and barrels: mixed, not the same box everywhere
- **Every crate in the world now picks a look.** The same spot always gets the same one:
  - Single crates are the nailed wooden crate (with FRAGILE sticker) or the old SCA-stencilled box.
    They keep their size, so radios, tools and lamps still sit on them.
  - Crate stacks are strapped shipping crates, a pile of crates with one fallen off, or
    a hand-stacked mix of singles.
- **Drums:** the blue water drums are the real plastic drums, with caps; one lies on
  its cradle with a tap. Fuel drums are red and black oil drums, and the rusty oil drum
  is the black one. Every drum is turned a different way.
- **New set dressing:**
  - **Vegetable crates** at both ends of the camp kitchen table: the slatted crates with
    tomatoes, onions, cucumbers and aubergines.
  - **A wooden water barrel** with a dipper in the mess tent.
  - **Army crates** (one open) against the old Ministry post.
- `prepare_model.js` now converts old "specular-glossiness" materials, which this Three.js
  version can't read and draws white. The crate pile needed it.
- Mess tent collision now matches the canvas (the model's width includes its guy ropes).
- Saved for later chapters: the bourbon-barrel row (Ch2/Ch3 cafés and cellars) and the
  untextured "crates" kit.

## V4.1.2 — 2026-09-29 — Your new models in the camp: dartboard, radio, the Codex, tents, camp kitchen, dig tools
- **The dartboard** in the worker camp is now the real Winmau board. It's sized so its
  double ring sits exactly on the game's scoring edge, so darts score the same as before.
- **The radio** is the Philips portable, on its crate in the worker camp. A second one sits
  on a crate beside **Uncle Farouk** at the guard booth, with his thermos (new: "Farouk's Radio").
- **The Codex:** when you unwrap it in the find store, the book appears above the text
  and turns slowly in the lamplight.
- **New: the Mess Tent**, north of the director's camp. It's the military marquee, open to
  the camp, with a trestle table, benches, a tea urn, bread and a lamp. You can look inside.
- **New: Hana's Tent**, the round canvas tent with its awning, beside the mess tent.
- **New: Miriam's Camp Kitchen** beside her tent. It's the camping set: stove, blue gas
  bottle, red cooler, enamel mugs and a folding table, all on a kilim. The set arrived all white,
  so every piece is given its own colour and finish in the game.
- **A fourth find on Hana's table:** the pottery strainer (the "sieve" model). It's an
  ancient perforated bowl of the kind used to strain beer mash in the workers' town. The
  finds tray text mentions it.
- **New: the Tool Rack** in front of the dig shed: shovels, picks, a broom, a hoe, a
  folding army spade and rubber buckets. A **wheelbarrow, shovel, pick and buckets** now sit at the
  north end of the east trench.
- **Model tools:** `prepare_model.js` gained `--drop` (throw away a piece, like the
  fishing rod), `--keepmat` (keep parts by material, for packs grouped that way) and
  `--error` (how far simplifying may go).
- Downloaded props are now skipped when off-screen. Only animated characters are always drawn.

## V4.1.1 — 2026-09-29 — Your downloaded models: the first ones in the game, and a plan for the rest
- **Hana's table now holds real scanned artefacts** from your model library:
  - The seated limestone statuette of Steward Au, cut out of the statue pack.
  - The leather sandal.
  - The papyrus fragment.
  - A new **"Hana's Finds Tray"** to examine: Excavation XP, and Hana's line that Miriam
    wouldn't let the statuette go into the find store.
- **Model tools:**
  - `tools/preview_models.js` renders a picture of every model and reads its triangles,
    textures, size and animations. The contact sheets are in `models/previews/`.
  - `tools/prepare_model.js` picks one piece from a pack, cuts it down to a triangle budget
    while keeping its textures, and shrinks textures. The papyrus went from 193k to 5k
    triangles, and the statue from 65k to 9k.
  - Draco-compressed models (the Ramesses III statue, the spice stand, one temple) are now
    supported.
- **Matte option for scans:** scanned models often arrive marked as metal, which renders
  black at night. The loader's `matte` option makes them stone, leather and papyrus.
- **New asset guide, `story/07_ASSETS.md`:**
  - Where each of your 31 models belongs (Cairo museum, Alexandria, Tanis, Karnak, the
    Houses and so on), with the triangle budget for each.
  - A **Chapter 1 wishlist** of everything in the camp you could find models for, with
    search terms: characters, animals, vehicles, buildings, props, small finds.

## V4.1.0 — 2026-09-29 — Chapter 1 completed against the bible: systems, missing content, new places
**New systems (story/06_SYSTEMS.md):**
- **Skills and XP.** 16 skills, levels 0–5. You start with your background's levels
  (Archaeologist: Excavation 3, Hieroglyphs 2, Greek, Coptic, Photography and First aid 1).
  You learn by doing:
  - digging, sieving and finding things
  - reading the seal, the stake, the false door and the Codex
  - talking with Egyptian speakers (Arabic)
  - sneaking, photographing, climbing, riding

  Level-ups show on screen. Excavation and Hana's valuation raise sieve pay.
- **Thirst and hunger.** Two small meters under your money. Refill them at the well, the
  water barrels, your canteen, the tea, the cooking table's lentils, or dates. At empty you
  can't sprint, but it's never deadly.
- **Failure states.**
  - The old seal's dart injures you, so you limp until you rest or Hana patches you up.
  - Slipping into the tent behind Lena's men gets you knocked out. You wake by the fire 1.5
    hours later, injured, and they've taken Miriam's notebook page.
- **The phone (P).** Map (tasks and places found), Messages, Contacts (with calls), Bank
  (a ledger of every payment), Skills and Notes.
- **Day and night.** Chapter 1 stays one night. After the chapter-end card, time runs on
  (a 48-minute day): dawn, a moving sun and blue sky at noon, dusk, then night again. Lamps
  dim by day, and the old woman at the tomb is only there at night.

**Missing bible content, now in:**
- **Miriam's spare phone** (a cache) with "A.S." saved. Calling it reaches Amira early,
  and the Ministry exit remembers your promise.
- **The quarry mason's marks:** "The Drunkards of Menkaure" (a real gang name), and an
  eye-in-a-house mark that matches the Codex.
- **Hagg Sayed and his horses** at the camp gate. **Race him** for Mina's debt; three
  choices during the race decide it.
- **Hana's valuation:** +20% on sieve finds and the sherd set.
- **Four 1926 expedition relics** round the old truck (detector). The glass-plate photo
  shows the Rais's grandfather, and you can show him.

**The layout audit filled the empty stretches with new places:**
- **The Workers' Cemetery:** the pyramid builders' tombs, a false door with Petety's real
  curse, and a looters' pit.
- **The Sheikh's Tomb:** a whitewashed shrine, and an old woman with a lamp at night who
  gives you the Keepers' tile.
- **The Watchtower:** climb it to put every place on your map. With field glasses, you see
  a car by the Osiris Shaft.
- **The Builders' Ramp.**
- **The Old Quarry:** the rock field, now a named place.
- **The Fossil Pavement:** five nummulites, "pharaoh's lentils".

**The story bible is updated to match:** the region file (side quests SQ-01A-01 to 11,
places, people, systems), characters (Saber, Hamid, Gamal, Hagg Sayed, the old woman,
Bosta), a build-status table in `06_SYSTEMS.md`, and the side-quest index (141 quests).

## V4.0.7 — 2026-09-29 — Realistic style chosen; test characters removed
- **Art direction decided: realistic.** Characters will be realistic, rigged and animated with Mixamo. The model pipeline (converter, loader) stays.
- The two test people in front of the tent are gone. The low-poly test model is deleted. Remy (realistic, with walk and dodge) stays packed in `models/`, ready for casting, but isn't loaded, so the game loads as fast as before.

## V4.0.6 — 2026-09-29 — Remy dodges
- The realistic test character (Remy) now has a second Mixamo animation, **Dodging Right**. He walks his beat in front of the tent, and at each end dodges to the right, then walks back. The new animation added only 0.05 MB, because it was downloaded without a skin.

## V4.0.5 — 2026-09-29 — Downloaded 3D models: a pipeline and two test characters
- **The game can now use downloaded 3D models.** A converter (`tools/convert_models.js`)
  takes .fbx, .glb or .gltf files, merges in Mixamo animations, shrinks textures, and packs
  the result into `models/`, so it works when index.html is opened from your folder and
  on GitHub Pages.
- **Two test people stand in front of Miriam's tent:**
  - **Low-poly:** "Man in Suit" by Quaternius (0.7 MB, 11 built-in animations). He idles
    and claps now and then.
  - **Realistic:** "Remy" from Mixamo, with Mixamo's Walking animation (11 MB after
    shrinking from 28 MB). He walks up and down in front of the tent.
- The test people are temporary, so you can compare the two styles.

## V4.0.4 — 2026-09-29 — Bosta the camp dog, the turning loop, the Bedouin camp, office fixes
- **Bosta, the camp dog.** She's a sandy baladi dog: one ear up, one flopped, a curled
  tail. She arrived in the back of the post van, hence the name, and she's now fully
  rigged and alive.
  - **Her own routine:** she sleeps by the fire (paws paddling in dreams), wakes, and
    wanders the camp. She begs at the cooking table, lies at the Rais's feet, sniffs
    about, and goes home to sleep again.
  - **Around you:** she watches you as you pass. Her tail wags more the more she likes
    you, and once she likes you she comes over to say hello.
  - **Talk to her:**
    - Scratch her ears and she flops over for a belly rub.
    - Give her dates. Win her over and she **follows you**: she trots along your trail,
      sits when you stop, and lies down if you wait.
    - "Stay" sends her home.
    - Ask her to sit three times and she learns to give a paw.
  - **At midnight** she barks at the black car and growls at the woman in black. Lena
    notices her if she's with you.
  - **Sounds:** synthesized barks, growl and whimper. She also appears in the J notes.
- **The supply train turns round properly.** A balloon (turning) loop has been added at
  the camp end. The train comes in loco-first, runs round the loop past a switch lever,
  and stops at the bay already facing out. It loads, then leaves loco-first. It no longer
  reverses back in. Uncle Hamid has moved beside the bay.
- **The Bedouin camp:** a real goat-hair tent (*bayt al-sha'r*). The woven strips sag
  between the poles, with a back wall, guy ropes and stakes, a patterned partition
  curtain, kilims and a row of cushions, and a camel saddle. Out front, water skins
  hang on the poles, and the hearth has glowing coals, three brass *dallah* coffee pots
  and cups. The dates are covered on a stone. There's firewood, and a camel couched
  beside the tent, hobbled, chewing its cud side to side and flicking its tail.
- **Site office front fixed:**
  - The sign now sits over the lit window (it used to butt into the door lintel).
  - The second window moved in from the corner.
  - The shutters hinge open from the window edge (they used to poke into the wall).
  - The air-conditioning unit moved to the back wall (it hung over a window).
- **Water barrels fixed:** three drums stand in a row, with a tap drum lying on a wooden
  cradle and a tin cup below. The shared drum helper spaced drums closer than their own
  width, so the fuel drums were overlapping too. That's fixed everywhere.

## V4.0.3 — 2026-09-29 — A proper fire at the workers' brazier
- **The flames live now.** Eighteen flame tongues, in three hand-shaped variants, are born
  at the coals, lick upward, narrow and redden, and die. That replaces five sprites that
  only stretched in place. There's a warm white-hot heart over the coals.
- **The coal bed:** a pile of cracked lumps glowing from inside, pulsing with the flames.
  Charred logs with glowing ends lie in the basket.
- **Sparks** are small and quick. Most wink out within a hand's breadth, and now and then
  a log settles and throws a burst up past the kettle. They replace the big orange blobs.
- **The kettle is a real Egyptian teapot:** blackened, with a round body, domed lid, knob,
  curved spout and handle. It used to look like a black top hat.
- **The firelight** on the camp now flickers in step with the flames.
- **The sound of the fire:**
  - A low rolling roar that swells and opens up as the flames rise.
  - A soft hiss.
  - Three kinds of crackle: dry ticks, resonant woody snaps, and a low knock when a log
    settles, which sets off a quick run of crackles.

  Before, it was only faint high clicks. The sound grows as you walk closer.

## V4.0.2 — 2026-09-29 — Gender: male or female
- The character-creation screen now offers only **Male** or **Female** (the Non-binary
  option is removed), and the row is labelled GENDER. Pronouns and forms of address follow
  the choice ("ya basha" / "ya hanem"). The default is Male.

## V4.0.1 — 2026-09-29 — Quarry, 1926 truck, find store (Chapter 1 visuals)
- **The chalk towers are now the old limestone quarry** where the pyramids' stone was cut.
  Each knob of bedrock has a rough, weathered crown and cut faces stepping down in
  terraces. Half-cut blocks still stand in their separation channels, with wedge sockets
  under the ledges and chip spoil and abandoned blocks at the foot. Collision and
  sightlines are unchanged. Each knob is merged into a few meshes, so it still runs at 60 fps.
- **The buried Land Rover is now the Harvard–Boston Expedition's 1926 truck:** a brass
  radiator, spoked wheels, a roof on posts, a slatted bed, and a stencilled tailboard
  hanging open, half swallowed by a dune.
- **The find store looks like one:** a steel door, a padlock under a Ministry seal of paper
  and red wax, a FIND STORE sign, and crates of finds outside. It's no longer the tool
  shed with a "TOOLS" sign.

## V4.0.0 — 2026-09-29 — The new story begins: Chapter 1 rebuilt (the Archaeologist)
- **New Game now opens a character-creation screen.** You pick a name, gender (pronouns
  and how people address you) and background. Only the Archaeologist is playable: the
  Inspector, Fixer and Journalist show as "coming in a later update." Choice notices can
  be turned on or off here.
- **Chapter 1 is the new story's Archaeologist opening** (`story/regions/ch01_opening_archaeologist.md`),
  built on the existing camp. The old story (Ellis, Sam, Tariq, the Codex pulse, sanity)
  is gone from it.
  - **New people:** Rais Abdallah, Dr. Lindqvist, Hana, Uncle Farouk, Saber the tea boy,
    Uncle Hamid and Gamal, plus Lena Brandt's team at midnight.
  - **Main path:** the payroll choice (pay / make Lindqvist pay / make the men wait) opens
    the dig zone. Trench A holds Miriam's notebook page, Trench B's spoil (sieve) holds the
    find-store key, and Trench C is the Coptic stake. The find store holds the Codex. The
    exit choice (quiet / call Amira / the Foundation's car) leads to a chapter-end card.
  - **The midnight car:** at 00:00 on the new story clock, a black Land Cruiser drives in,
    and three people search Miriam's tent. You can listen, photograph them, confront
    them, or miss it.
  - **Optional:** the Osiris Shaft, and Petamun's seal (the glyph-seal minigame) with the
    bronze seal behind it.
  - **Side quests:** the Rais's son, Hana's sherds, Saber's tea and the burn bin, the
    1926 truck, the supply line's coupling pin, Miriam's buried caches, and the darts
    tournament.
- **New systems:**
  - The HUD clock replaces sanity. Waiting at the fire or bed skips time.
  - Relationships and faction reputation, with "___ will remember that." notices.
  - **J** opens your notes and the people you know.
  - Old saves don't load (new save key).
- Retired: the satphone, the Ministry inspector, Sam's gear, and the old patrols.
- Still to do: re-model the chalk towers as quarried limestone, turn the buried Land
  Rover into a 1920s truck, and put a find-store sign on the shed.

## Story bible rewrite — 2026-09-29 — docs only (no version bump)
- **The whole story has been replaced.** The old bible (`MASTER_LORE_BIBLE.md`,
  `NEW_CHARACTERS.md`) and its story are retired: Ellis, Sam, the Uarha, the Heart, and
  the Order of the Unshut Eye are gone. The new bible lives in `story/`:
  - `00_MASTER_BIBLE.md` covers the premise: the Codex, the lost Library of Alexandria,
    and the Book of Thoth. It also has the real history underneath, the three acts,
    tone and writing rules.
  - `01_CHARACTERS` · `02_FACTIONS` · `03_CHOICES_AND_FLAGS` (the master choice map) ·
    `04_ENDINGS` (7 endings with variations) · `05_ECONOMY` · `06_SYSTEMS` (skills,
    language gates, 18 failure states, day/night, the phone).
  - `regions/`: 4 background openings and chapters 2–14, each with beats, places, NPCs,
    side quests, jobs and secrets.
  - `SIDE_QUESTS_INDEX.md`: 137 side quests, generated from the region files.
- The game code is unchanged. The next step is rebuilding the game chapter by chapter
  against the new bible, starting with the Archaeologist opening (the built Giza camp).

## V3.8.2 — 2026-09-29 — Rougher chalk formations
- The White Desert chalk is now weathered rock instead of smooth. A ridged "crag" noise
  breaks up the silhouettes, and wind-eaten pockets gouge into the sides. Fine chips
  roughen the surface and the wind-cut ledges are deeper and sharper. The stone is
  flat-shaded, so every facet catches the light. Shapes (mushroom and whaleback) and
  collision are unchanged.

## V3.8.1 — 2026-09-29 — Chalk formations reshaped
- The White Desert rock formations looked like dark "post and slab" blocks. They're now
  smooth, wind-sculpted chalk: bright pale stone with faint wind-cut banding, pits
  and dark flint nodules. **Mushrooms** have a flared foot, a neck undercut by the wind
  and a lumpy overhanging cap. **Whaleback yardangs** are streamlined north–south, with a
  blunt nose and a long tapering tail. Each sits in a skirt of fallen chalk. Collision is unchanged.

## V3.8.0 — 2026-09-29 — Chapter 1 interiors; vegetation where the water is
- **Interiors** (`ch1_interiors.js`): the three Chapter 1 buildings are fully built
  rooms now instead of grey boxes, lit by warm lamps (tone mapped, and the Brightness
  setting applies). All collision and interactables are exactly where they were.
  - **Ellis' tent:** a canvas roof on a ridge pole, groundsheet and kilims, the Codex
    glowing faintly on the work table under a hanging hurricane lamp (loupe, notes),
    the cot with a camp chest and lamp, trunks and crates, a bookshelf, the journal
    desk and chair, the photographs pinned to an easel, boots, a jerrycan, a coat on
    a peg, and the doorway open onto the night.
  - **Workers' dormitory:** plank floor and walls, a corrugated roof on rafters, ten
    bunks with mismatched blankets, boots, washing on a line, moonlight through three
    windows, one lantern still burning low by the sleepless worker, the blue-eye
    talisman over its cot, and tally scratches on the wall.
  - **Foreman's office:** plaster walls, a tiled floor, a slowly turning ceiling fan,
    shelves of files, the corkboard with notes and red string, the desk with ledgers,
    telephone and lamp, the counter, the manifest on its hook, Sam's box of notes,
    a site map, a heater, a water cooler, shuttered windows, and a bare bulb over the door.
- **Vegetation placed by water:** a dry wadi channel (gravel bed, soft banks) now
  runs down the valley between two ridges, with acacias along both banks. Plants
  grow in clumps where water would be:
  - dense tamarisk and greener grass round the oasis
  - tamarisk and camel-thorn along the wadi
  - scattered camel-thorn tussocks with grass in their lee at the dune feet
  - nothing on dune crests or bare flats

  This replaces the even random scatter. Two chalk clusters that sat in the wadi
  moved aside.

## V3.7.0 — 2026-09-29 — Paths, living supply line, backpack, tips
- **Paths are clearly defined now:** every track is its own surface laid over the sand.
  Roads are compacted dirt with gravel and two dark tyre ruts, and footpaths are packed
  sand with footprints. Both feather into the desert at the edges and follow the ground
  exactly, and the bed under them is levelled a little wider than the track. Footpaths
  are lined with whitewashed stones, the way Egyptian camps and posts mark theirs.
- **The supply line is alive:** a narrow-gauge line runs from a loading bay by the camp
  gate, south-west through its own cutting in the dunes and out of the site. A worker
  (not interactive) shovels spoil into three tipping skips. When they're full the little
  yellow diesel sounds its horn and hauls them away (smoke, rolling wheels) until they're
  gone in the haze, then brings them back empty and the cycle repeats. You can watch it
  leave, but the dunes won't let you follow. The Supply Line story interaction is
  unchanged, and the bay has a sign, a lamp and crates.
- **Painted sherds:** now curved pieces of a jar's shoulder with a red-ochre band and
  black lines, half-buried at an angle, with a bright halo and a slowly turning cross flare.
  The one at the wreck (and two others) were buried in props; they're in the open now.
- **The horizon pyramids** have limestone block courses, block-to-block tone, weathering
  streaks and missing blocks, with Khafre's white casing surviving at the top. They're
  larger now too, so they rise above the new dunes.
- **Backpack** (`backpack.js`): 10 units of space. The metal detector takes 4, the canteen
  and field glasses 2, small things 1, and sherds and dates stack. Story items ride in your
  pockets and never take space. **I** opens it (hold, use, drop), **G** holds or puts away
  a tool, **Q** drinks from the canteen.
  - **Metal detector:** moved off the tent door to a crate by the equipment table, with a real
    model (S-shaft, control box with LCD, search coil, coiled cable). It must be held
    (G): you see it in first person, the coil sweeping as you walk, and it only ticks and
    reveals caches while it's in your hands.
  - **More to find:** a canteen at the oasis well (3 drinks, refilled at the well), dates at
    the Bedouin shelter, 4 new buried caches (field glasses, a signal mirror, a date tin,
    coins), and the tin compass is now a keepsake item. **Field glasses:** hold them,
    then right-click to look far.
- **Cairo (Chapter 3):** the tea vendor also sells a canvas rucksack (350 EGP) that raises
  backpack space to 16. Nothing else in that chapter changed.
- **First-steps tips** on a new game: 8 tips in the bottom-left corner, each shown for ~10 s,
  a 5 s rest, then the next (paused during conversations, menus and minigames). Hold
  **X** to switch them off for that game.
- **Fixes:** the rock that looked like it sat on the guard booth (a chalk formation behind
  it) and the ridge crowding the ministry post were moved back, and the ministry area has
  more level ground. Cliff rocks no longer land on the dig fence line.

---

## V3.6.0 — 2026-09-29 — Chapter 1: breaking the sightlines
Before this, you could see about 10 of the other 11 areas from any area (the camp sat in a flat bowl),
so the map read as one small space. Using open-world level-design practice (block
sightlines at several terrain scales, screen with rock and tree lines, let places reveal
themselves as you come over a rise), with things you'd actually find in Egypt:
- **Seif dunes:** 9 long knife-edged ridges (up to ~5 m) running roughly north–south
  between the areas, with a steep slip face on one side and a long back on the other. You can walk
  over them, and cresting one gives you a view. Where a track crosses, the ridge dips to a saddle
  you walk over but can't see through. They lie down near anything built.
- The general dunes are also taller, so there are three scales of terrain everywhere.
- **White Desert chalk formations:** 10 clusters of wind-carved mushroom and fin rocks
  (yardangs), streamlined north–south. They block the view, glow under the moon, work as
  landmarks, and are solid.
- **Vegetation:** a date-palm plantation west of the oasis, more palms round the oasis
  itself, acacia trees in the dry wadi, and feathery tamarisk thickets along the wadi, the
  oasis and the ridge feet. Palms and tamarisk are instanced, so they cost little to draw.
- **Result:** from each area you now see only its neighbours plus the raised dig plateau
  (on purpose — it's the landmark). Measured by a terrain line-of-sight check,
  before counting the rocks and trees.

---

## V3.5.0 — 2026-09-29 — Chapter 1 goes open world; cinematic conversations
**The map (3D build only; the 2D build keeps the old map)** — `ch1_layout.js`
- Chapter 1 is now an open desert of about 330 × 275 m (it was about 120 m square). Each
  area keeps its layout, objects, scenes and flags, but the areas are pulled apart and
  linked by trodden tracks: Ellis' camp in the middle, the workers' camp to the west,
  the ministry post east (the car drives up its own road), the east trench to the
  north-east, the camp gate south, and the dig zone up on a plateau to the north with
  a switchback climb to its gate. Travel is about 15–30 s between areas on foot.
- Level-design principles from open-world games:
  - **Hidden boundaries:** a ring of dunes rears up at the edge, too steep to climb.
    The collision sits on that slope and the desert rolls on to the horizon beyond.
    Rock outcrops and old sand fences mark the dune foot. Cliffs close the dig
    plateau's sides and the escarpment backs it.
  - **Roads never just stop:** both leave through a cut in the dunes to a closed
    Antiquities Police barrier.
  - **Guidance:** landmarks you can see from afar (the tunnel cliff, the radio mast,
    the lookout ridge). Leading lines: telegraph poles and wires along the roads,
    lamp posts along the footpaths. Fingerposts at the junctions.
  - **Tracks:** worn flat and sunk into the sand, following the terrain.
- A light pool gives the nearest lamps real light, so there can be many more lamps
  without costing frame rate. The whole map is filled with pebbles, stones, grass
  and camel-thorn.
- Old saves from the boxed map load fine: you resume at the tents.

**Open-world content** (`ch1_openworld.js`; own ow_* flags, no story changes)
- New places, each with its own interaction: the Oasis and its well (drink: stamina
  refill), the Old Village ruins, the Lookout ridge and its cairn (sanity), a
  Wrecked Land Rover (a little cash), a Bedouin Shelter, the Spoil Field, and camel
  bones in the dry wadi. Each place's name appears the first time you walk in.
- **Mint Tea** minigame at the kettle by the workers' brazier: hold the mouse to
  pour, and move the mouse up and down for pour height (high for foam, too high splashes).
  A perfect glass gives Mint Tea (faster stamina recovery), which had no source
  until now.
- **The Sieve** minigame at the spoil field: shake the sieve with the mouse,
  and click the finds to bag them (stones are just stones). It pays a little EGP, 3 heaps.
- **Sam's metal detector** (in the camp): once you carry it, it ticks faster near
  8 buried caches (EGP, Karkadeh, Mint Tea, a sanity keepsake).
- **8 painted sherds** hidden round the map (15 EGP each, with a 250 EGP bounty for the set).
- **Compass** at the top of the screen showing your open missions with distances,
  and faint "?" marks for places you haven't found.

**Cinematic conversations** (`cine3d.js`)
- Talking to someone eases the camera into an over-the-shoulder shot, and they gesture
  as they talk. Examining a thing moves in close on it; for big things you turn to
  face them. Letterbox bars slide in and the HUD steps aside. Story-triggered scenes
  keep your view and only get the bars.
- Dialogue restyled as film subtitles. Lines type out (SPACE or a click finishes them),
  choices are numbered and 1–9 picks them. New setting: Text speed (Normal / Fast / Instant).

---

## V3.4.0 — 2026-09-29 — Title screen, prologue, settings, ambience, feel
- **New title screen** (`title3d.js`, `ui3d.css`): it opens on a letterboxed
  "PRESS ANY KEY" splash over slow cinematic shots of the night camp that cut
  through black (the festooned tent, the tunnel seal, the brazier, the pyramids,
  the trench). There's a seal emblem (the Tunnel Gate Seal's four stones round a
  core) whose core pings every 8 seconds with a low tone, like the Codex in
  Ellis's tent. The menu is a left-aligned PC-style list you can use with the
  mouse or ↑/↓ + Enter: Continue (shows chapter and when you saved), New
  Excavation (asks before overwriting a save), Settings, Site Overview.
- **Prologue on a new game:** place/time cards over black ("Giza Plateau,
  Egypt / Autumn, 2023 / The twenty-second night of the excavation."), then one
  establishing shot descending onto the lamplit tent, then the game's own
  opening fades in as before. ESC or Enter skips it. No story text changed.
- **Settings screen** (`settings.js`), from the title and from the pause menu,
  saved in the browser. Graphics: quality preset (Low/Medium/High/Ultra —
  resolution, shadows, dust), brightness, field of view. Controls: mouse
  sensitivity, invert Y, key list. Audio: master, ambience, footsteps.
  Gameplay: object labels (nearby/always/off), controls reminder, head bob,
  reduce motion (calms the low-sanity camera sway/tremor).
- **Ambient sound** (`ambience.js`, Ch1): synthesized gusting desert wind, the
  brazier crackling as you get close, the generator's diesel hum, crickets.
- **Mechanics / feel:**
  - Interaction now picks what you're looking at when several things are in
    reach. The prompt names it ("SPACE  TARIQ"), and there's a small crosshair
    that lights up on a target. **F** also interacts.
  - Fixed: pressing SPACE during a minigame could re-open its dialogue.
  - Walking eases in and out (same top speed), with a small sprint FOV kick
    and a camera dip when you land a jump.
  - HUD restyled: a compact sanity/funds panel, and a thin stamina bar at the
    bottom centre that fades out when it's full and turns red when you're low.
  - The ministry car is now a proper black saloon facing the way it drives,
    with its headlights on.
- Pause menu: new Settings button, and the footer shows the real version.

## V3.3.0 — 2026-09-29 — Ch1 minigames played in the world
Both Chapter 1 minigames now play in 3D in the actual place, like a PC game
instead of a flat pop-up card. Rules, flags, records and story scenes are unchanged.
- **The Tunnel Gate Seal:** the camera steps up to the stela. Mouse over the real
  glyph stones and click to press them (or use keys 1–4). Pressed stones sink and light up.
  The resonance timer is a ring of beads around the seal, and the core pings every
  8 seconds like the Codex. A wrong stone fires the cedar trap dart out of the rock into
  the timber brace, the screen shakes, and the stones grind round to new positions.
  Solving it spins the ring. Right-click or ESC steps back.
- **Camp Darts:** first person at the throwing line. Aim with the mouse against
  natural hand sway. Hold the left button to steady your breath (the view tightens
  and a breath bar shows how steady you are), but hold too long and your arm shakes.
  Release to throw. Darts fly, stick in the board and stay there. Score popups appear
  at the board. The result panel has Throw Again (R) / Walk Away (ESC).
- The seal stela was rebuilt to match its description: a pale ring, a dark amber core,
  four glyph stones at the compass points, and a timber brace for the trap.
- The dartboard's rings now match the scoring zones. Sam's chalk "S — 132" is on the plank.
- The 2D build still uses the original 2D versions.

## V3.2.0 — 2026-09-29 — Chapter 1 camp visual overhaul
The first open area (the Giza dig camp, up to the Tunnel Gate Seal) was
rebuilt visually from scratch. No story, dialogue, flags or collision changed.
- New files: `ch1_world.js` (terrain, sky, lighting, FX) and `ch1_props.js`
  (buildings, props, fences, vehicles). The old Ch1 art code was removed
  from `engine3d.js`.
- Lighting: moonlight with soft shadows, tone mapping, warm lamp pools with
  glow halos. It reads as night but you can still see where you're going.
- Sky: a shader sky with twinkling stars, the Milky Way, thin moonlit cloud
  and Cairo's glow on the horizon. The moon has craters. The Giza pyramids
  and distant city lights sit on the horizon.
- Terrain: rolling dunes out to the horizon, trodden paths and tyre-rutted
  roads, a bulldozed berm around the site edge (so the invisible border
  walls have a visible reason), and a rock escarpment across the north.
  The east trench is now actually dug, with ramps, shoring, planks and spoil.
- Buildings: a canvas wall tent with a porch and a lit interior, a timber
  bunkhouse with a water tank and a washing line, a plastered mud-brick site
  office, and ministry portakabins. The Tunnel is now a timbered portal cut
  into the rock, with a rock-cut approach.
- Props: every prop was remade (trucks, SUVs, generator, mine carts, braziers,
  scaffolding, palms, cacti, ruins, etc.). Added festoon lights, pennant rope
  fences, chain-link fences with signs, and a wheelbarrow, bowser and survey grid.
- FX: a real brazier fire with embers and smoke, drifting sand, moths
  around the work lamps, swaying palms and flags, and a sleeping, breathing Dust.
- Characters (all chapters): rounded limbs, faces, boots and better headwear.
  Same rig and animations as before.
- Labels: restyled as small gold-trimmed tags. In Ch1 they only show up close.
- Physical things (trench, generator, carts, stela…) no longer vanish once
  their story beat is done. Only the label and the interaction go away.

## V3.1.1 — 2026-08-03
- WebGL startup now retries with lighter settings (no antialias, etc.)
  before giving up, so weaker GPUs/browsers can still run the 3D build.

## V3.1.0 — 2026-08-03
- Added a shared `GAME_VERSION`, shown on both the 3D and 2D title screens.
- Boot guard: if startup fails, the game explains why instead of showing
  a silent black screen.
- Main menu overhauled into a cinematic title screen.
- Menu "Site Overview" drone viewer; fixed tent roof; dig-gate label repaint.

---

## Before versioning (history summary)

### 2026-06-11 — 3D playable + Ch1 polish
- 3D build became the default (`index.html`); 2D moved to `index2d.html`.
- Character figures for NPCs/hostiles, jumping, chasm pits.
- Save/load (localStorage, single slot, both builds).
- Stamina rebalance; sanity overhaul (4 tiers, world-space hallucinations).
- New pause menu; restyled amber-glass dialogue UI.
- Ch1 art pass: dig-camp props, heightfield dunes, escarpment climb,
  ambient scatter, fun interactions, Tunnel Gate Seal minigame.
- Terrain-aware footstep audio; Camp Darts minigame.
- Fixes: Ch2 pressure-plate hint, dig-shed clipboard, Ch1 visuals.

### 2026-06-10 — 3D conversion begins + story expansion
- Vendored Three.js; built 3D engine scaffold, graybox generator,
  first-person controller, hostiles, atmosphere, lighting pass.
- Expanded all maps for first-person scale; per-area skies; menu overhaul.
- Story: added Father Matthias, Inspector Kareem, Kostas Lemaire,
  Lei Mansour, deep lore, 2 endings; rewired orphaned scenes.

### 2026-04 / 2026-05 — 2D game
- Ch1 pixel visual overhaul and many bug-fix passes (NPC spawning,
  ministry car, gates, sanity balance, dialogue clarity).
- Title screen tweaks.
