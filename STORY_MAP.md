# THE CODEX OF GIZA — Full Story & Branching Map

A reference document for all story content, branching choices, and state across chapters.
Keep this alongside dialogue.js when writing new scenes — cross-reference flag names here.

---

## SETUP

**Ellis Vance**, a British-educated archaeologist, has been granted permission to examine a black basalt tablet — *The Codex* — at a Giza dig site. The dig is 22 days in. Ellis has not slept properly in weeks. His research partner **Sam Okafor** died on the last season's dig, cause officially "heart failure," unofficially contested by everyone who knew him.

Present-day **Day 22** opens with Ellis in his tent, examining the Codex at night.

---

## CORE CHARACTERS

| Name | Role | Arc |
|------|------|-----|
| **Dr. Ellis Vance** | Player character | Burned-out archaeologist hunting the truth of Sam's death via the Codex |
| **Tariq** | Local foreman, dig site | Lost grandfather to a similar dig in 1954. Opens up if trusted. Can translate Arabic, but refuses if trust is low |
| **Sam Okafor** | Ellis's dead partner | Appears via found objects, notes, tool shed files, photos. He was watching people. His second, secret dig location is marked on a hidden map |
| **Mr. Halberd** | Private intelligence operative | Appears Ch5. Offers a way out. Possibly sinister. |
| **Samir** | Hostile in Ch2 TRAP route | Can be turned into companion or stays hostile |
| **Maren** | Cutthroat route ally | Ch2 CUTTHROAT only |
| **Boros** | Cutthroat route antagonist | Ch2 CUTTHROAT only |
| **Yusra** | Cairo market occultist | Ch3, gateway to underground city knowledge |
| **Iry** | Ch4 underground companion | Non-human. Offers to guide Ellis through the city. |
| **Helena** | Ellis's ex-wife | Phone call only (Ch1 satphone) |
| **Ayo** | Sam's sister | Phone call only (Ch1 satphone) |
| **Camberleigh** | Appears in visions. Ellis's daughter. | Deepest cut; sanity-linked |

---

## CORE MECHANICS

**Sanity (0–10)**: CALM (8+) / STRAINED (5–7) / FRACTURED (<5). Controls screen effects and phantom spawns.
**Stamina (0–10)**: Drains on sprint, regenerates when walking.
**Trust tracks**: trustTariq, trustMaren, trustIry, trustYusra — gates dialogue and companion routes.
**Knowledge tracks**: knowledgeCodex, knowledgeHermetic, knowledgeAtlantean — unlocks dialogue choices across the game.
**Reputation**: repLocal (workers/foreman), repAcademic (Oxford/university), repMinistry (govt. authorities).
**Funds (EGP)**: Ellis starts with 2000 EGP. Spending affects pay-for-risk choices.
**Body count**: Tracked across ch2–ch6.

---

## CHAPTER 1 — GIZA SURFACE

**Opening scene**: `scene1_start` — Ellis in tent examining the Codex.

### 1A. Codex Examination (choose one)
- **Touch bare-handed** → `s1_touch_result` (flag: `Codex_Pulse_Felt`, -1 sanity, +1 knowledgeCodex)
- **Loupe inspection** → `s1_loupe_result` (flag: `Crystalline_Structure_Noted`, -1 sanity, +2 knowledgeCodex)
- **Sketch every glyph** → `s1_sketch_result` (flag: `Codex_Sketch_Captured`, -1 sanity, +3 knowledgeCodex, adds `Codex_Sketch` to inventory)

### 1B. The Sound Event (`scene1_sound`)
- **Log it scientifically** → `s1_log_result` (flag: `Sound_Logged`, +1 knowledgeCodex)
- **Call out to Tariq** → `s1_call_result` (flag: `Tariq_Primed`)
- **Ignore / address the tablet** → `s1_ignore_result` (flag: `Codex_Addressed`, `Codex_Is_Watching`, -1 sanity)

### 1C. Tariq Enters (`scene1_tariq`)
- **Concede immediately** → `tariq_concede` (+1 trustTariq)
- **Negotiate** → `tariq_negotiate`
- **Pull rank** → `tariq_rank` (-3 trustTariq, -2 repLocal, flag: `Tariq_Rank_Pulled`)
- **Confess unease** → `tariq_honest` (+3 trustTariq, +1 knowledgeCodex, flag: `Tariq_Confessed_Unease`)

### 1D. Three Site Problems (must resolve all three)

#### Trench (`scene2_trench`)
- **Cross yourself** → `trench_cross_result` (+2 repLocal, -2.5 sanity, flags: `East_Trench_Crossed`, `Subsurface_Vibration_Felt`, `eastTrenchResolved`)
- **Pay worker (500 EGP)** → `trench_pay_result` (-1 repLocal, flag: `Paid_For_Risk`)
- **Reroute around** → `trench_reroute_result` (+3 repLocal, flag: `East_Trench_Avoided`)
- **Ask Tariq (if confessed unease)** → `trench_ask_result` (+2 knowledgeCodex, +1 atlantean, +2 trustTariq, flag: `Tariq_Grandfather_Story`)

#### Supply Carts (`scene2_carts`)
- **Fix yourself** → `carts_fix_result` (+3 repLocal, +Wrench, flag: `Ellis_Worked_Hands`)
- **Offer bonus (300 EGP)** → `carts_bonus_result` (-2 repLocal, flag: `Bonus_Offered`)
- **Instruct from distance** → `carts_instruct_result` (+1 trustTariq)

#### The Stranger (`scene2_stranger`)
- **Approach the figure** → `stranger_approach_result` (flag: `Watched_By_Stranger`)
- **Press for identification** → `stranger_press_result`
- **Ignore / drop it** → `stranger_drop_result` (-0.5 sanity)

### 1E. Post-Mission Investigations (Phase 3, unlocked after each base mission)

Each resolution scene offers "investigate properly" → one of three mission routes per problem:

#### Mission 1 — Trench Investigation (`ch1_m1_entry`)
- **Walls approach** — Measure fractures (flag: `Subsurface_Pressure_Mapped`), Touch bare-handed (flag: `Trench_Heat_Felt`, -1 sanity)
- **Workers approach** — Honest ask (flag: `Workers_Told_Truth`), via Tariq if trust ≥2 (flag: `Trench_Voices_Confirmed`, -1.5 sanity)
- **Descend approach** — Listen (flag: `Trench_Pulse_Heard`, -2 sanity), Dig test (flag: `Trench_Substrate_Sampled`), Soil sample (flag: `Non_Human_Architect_Suspected`, +Soil_Sample)
- **Completion**: sets `ch1_mission1_complete`

#### Mission 2 — Supply Path Investigation (`ch1_m2_entry`)
- **Axle analysis** — Map epicenter (flag: `Supply_Epicenter_Mapped`), Take fragment (+Axle_Fragment)
- **Survey route** — Finds pre-marked Codex glyphs (flag: `Supply_Markers_Found`, optionally +Marked_Stone)
- **Night crew** — Amber light + bell-tone witnessed (flag: `Supply_Amber_Light_Witnessed`)
- **Completion**: sets `ch1_mission2_complete`

#### Mission 3 — The Watcher (`ch1_m3_entry`)
- **Physical search** — No footprints on warm sand, kyphi incense (flag: `Watcher_No_Prints`)
- **Press Tariq** — High trust: grandfather story 1954 (flag: `Watcher_Confirmed_Real`); Medium: admits lying; Low: stonewalls
- **Wait in the dark** — 23:07 temperature drop; Hold still (flag: `Watcher_Watched_Codex`) / Raise hand (flag: `Watcher_Acknowledged_Ellis`)
- **Completion**: sets `ch1_mission3_complete`

When all three missions complete → `ch1_all_missions_complete` scene → adds The Codex to inventory → sets `scene3Triggered = true` → tunnel unlocks.

### 1F. Tunnel Gate (`ch1_tunnel_gate`)
- Before all missions: "Not yet. You have things to resolve on the surface."
- After `scene3Triggered`: "Step forward. Let the ground decide." → `scene3_start` (the collapse) → branches to Ch2 route selection.

### 1G. Ch1 Optional Content
- **Satphone** (`ch1_satphone`, at compound) — Call Helena, Oxford dept chair, or Sam's sister Ayo. Each affects sanity/knowledge differently.
- **Tariq Talk** (`ch1_tariq_talk`, at camp brazier) — Probes into Tariq's grandfather's story if trust ≥ 3.
- **Inspector** (`ch1_inspector`, ministry car east) — Paperwork demands; bribe 800 EGP or stonewall or appeal to Tariq's reputation (flag: `inspector_dealt`)
- **Night Watch** (`ch1_night_watch`, south perimeter) — Optional watch shift; can grant the flag `night_watch_done`
- **Brazier (Rest)** — Restores 5 sanity, one-time.

### 1H. Ch1 Flavor Nodes (NEW)
Minor lore moments scattered across the map:
- `flavor_sam` — Sam's half-buried transit level (west of dig zone)
- `flavor_sand` — The howling dune (east)
- `flavor_stars` — The stars over Orion's belt (south, open sky)
- `flavor_ruins_fragment` — Ancient limestone wall fragment
- `flavor_boulder` — Sam's "+ in circle" waypoint marker
- `flavor_cactus` — Sam's cactus-water story
- `flavor_survey_stake` — Sam's last survey stake (14 months ago)
- `flavor_cooking_table` — Communal food; carved eye symbol on edge
- `flavor_crates` — Secret French-labeled "bâti atlante" crates
- `flavor_spoil_mound` — Glass shard in excavated earth
- `flavor_tool_shed` — Locked inner door; opens if `sam_waypoint_found`, reveals Sam's surveillance files
- `flavor_ministry_post` — Cigarette butts; someone watching
- `flavor_fuel_drums` — Hollow drum; opens to Sam's map of a second dig site
- `flavor_guard_booth` — 42 tally marks
- `flavor_scaffolding` — Worker's red-thread protective charm
- `flavor_site_trailer` — Locked; occupied but pretending empty
- `flavor_palm_tree` — Sam's date palm with brass plaque; water it for +1 sanity
- `flavor_gate_post` — Season 4 camp; Sam's name scraped off the arch
- `flavor_digshed` — Daily roster; three names crossed out as "did not report"

---

## CHAPTER 2 — UNDERGROUND LABYRINTH

After the tunnel collapse (`scene3_start`), Ellis falls. Three routes diverge based on `scene4_*` choice:

### Route A — TRAP (`ch2_start_trap`)
Dangerous tunnels with booby traps. Primary hostile: panicked worker, then Samir.
Key scenes:
- `ch2_mural` — Reveals the city's fall
- `trap_pressure_1/2` — Pressure plate traps
- `trap_whispers` — Whispering room; sanity drain
- `ch2_samir` — Meet Samir; can turn him companion
- `puzzle_start_plates` — Sequence puzzle (plates: serpent, eye, bird, hand)
- `ch2_gate` — Exit to Ch3 once `gateUnlocked`

### Route B — SECRET (`ch2_start_secret`)
Hidden passage discovered via Sam's clue. Fewer hostiles, more lore.
Key scenes:
- `ch2_amber` — Living amber formation (flag: `ch2AmberTouched`, sets `Tablets_Resonated`)
- `ch2_chasm` — The Chasm; optional look (flag: `ch2ChasmLooked`)
- `ch2_statue` — Guardian statue that isn't a statue
- `ch2_secret_altar` — Altar puzzle (`puzzle_start_resonance`)
- Route-specific flag: `Secret_Route_Entered = true`

### Route C — CUTTHROAT (`ch2_start_cutthroat`)
Player encounters other descenders. Human threat > supernatural.
Key scenes:
- `ch2_maren` — Ally potential
- `ch2_boros` — Antagonist
- `ch2_scaffolding` — Climbing sequence
- `ch2_cutthroat_tariq` — Find Tariq tied up (flag: `tariqUntied`)

All three routes converge at `ch2_gate` → Ch3.

---

## CHAPTER 3 — CAIRO MARKET

Starting scene: `ch3_start`. Ellis emerges in Cairo's old market district. Must find **Yusra** and her safehouse.

### 3A. Primary Objectives
- **Find Yusra** (`ch3_yusra_meet`) — Requires `marketPassword` flag (obtained via vendor or hookah scenes)
- **The Hub safehouse** — Enter via `door_safehouse` with password
- **Hookah Lounge** (`door_hookah`) — Informant contact

### 3B. Puzzle
- `puzzle_start_cipher` — Vendor's Code ("three birds, one eye, two hands" → `[3, 1, 2]`)

### 3C. Flavor
- `flavor_ch3_fountain`, `flavor_ch3_spice`, `flavor_ch3_graffiti`, `flavor_ch3_cat` (flag: `Market_Cat_Pet`), `flavor_ch3_alley`, `flavor_ch3_prayer`, `flavor_plaza_bench`

### 3D. Hostile
- Ministry informant guard patrols market. Catch scene → bluff with inspector deal or get caught.

---

## CHAPTER 4 — UNDERGROUND CITY

Starting: `ch4_start`. The actual city beneath Giza. Living, amber-channeled, non-human architecture.

### 4A. Primary Objectives
- **Reach the Heart** (`ch4_heart`) — Opens after `heart_altar_solved`
- **Meet Iry** (`ch4_prison`) — The Temple. Iry offers companion status.
  - Accept: flag `iryQuestionAccepted`, `iryCompanionUsed` later
  - Refuse: flag `iryQuestionRefused`
  - Push: flag `iryRevealedNature`

### 4B. Puzzle
- `puzzle_start_heart_altar` — Four-panel symbol alignment `[3, 2, 1, 4]`

### 4C. Flavor
- `flavor_ch4_pillar`, `flavor_ch4_channel`, `flavor_ch4_glyph`, `flavor_ch4_fountain`
- `ch4_rest_hearth` — Rest site (one-time)

### 4D. Hostiles
- Two `figure_dark` patrols on city outskirts. Higher chase range, higher sanity damage.

---

## CHAPTER 5 — AIRFIELD

Starting: `ch5_start`. Ellis surfaces at an abandoned airfield. Multiple factions converge.

### 5A. Primary Objectives
- **Meet Halberd** (`ch5_halberd`) — Private intelligence; offers extraction
- **Four-Faction Standoff** (`ch5_standoff`) — Climax resolution (flag: `standoffResolved`)
- **Tariq's Flat** (`door_tariq_flat`) — Requires trustTariq ≥ 5

### 5B. Interiors
- `INT_HANGAR` — Four factions meet here
- `INT_TARIQ_FLAT` — Personal scene with Tariq
- `INT_HALBERD` — Halberd's office

### 5C. Flavor
- `flavor_ch5_plane`, `flavor_ch5_crates`
- `ch5_hangar_rest` — Rest site

### 5D. Hostiles
- Ministry guards patrol perimeter.

---

## CHAPTER 6 — THE GATE

Starting: `ch6_start`. Hermetic gate approach. Puzzle-heavy.

### 6A. Primary Objectives
- **The Gate** (`ch6_gate`) — Opens with `gateUnlocked` flag
- **Halberd Farewell** (`ch6_halberd_farewell`) — Closure scene (flag: `halberdFarewellDone`)

### 6B. Flavor
- `flavor_ch6_inscriptions` — Hermetic script
- `flavor_ch6_eye` — The Unshut Eye
- `ch6_antechamber_rest` — Rest site

### 6C. Hostiles
- Two dark figures flank the approach.

---

## CHAPTER 7 — FINAL CHOICE

Starting: `ch7_start`. Luminous amber chamber. Three tablets.

### 7A. Primary Objectives
- **Examine the Codex** (`ch7_examine_codex`, flag: `ch7CodexRead`)
- **Examine the Second Tablet** (`ch7_examine_second`, flag: `ch7SecondRead`)
- **Face the Pedestal** (`ch7_pedestal`) — Final choice

### 7B. Endings
Determined by:
- Knowledge track totals (Codex, Hermetic, Atlantean)
- `The_City_Is_Awake` flag (from Ch4 path)
- `Tablets_Resonated` flag (from Ch2 SECRET or convergent lore)
- Companion status (Iry, Tariq, Samir, Maren)
- Body count
- `standoffResolved` outcome

Endings are gated through `ch7_pedestal` → multiple terminal scenes.

---

## KEY CROSS-CHAPTER FLAGS

These flags originate in Ch1/Ch2 but affect outcomes later:

| Flag | Origin | Affects |
|------|--------|---------|
| `Codex_Pulse_Felt` | Ch1 tablet touch | Ch7 ending variants |
| `Codex_Is_Watching` | Ch1 ignoring sound | Ch4, Ch7 |
| `Tariq_Grandfather_Story` | Ch1 if unease confessed + ask | Ch5 flat scene depth |
| `Tariq_Confessed_Unease` | Ch1 honest response | Unlocks many Tariq options across game |
| `Non_Human_Architect_Suspected` | Ch1 M1 soil sample | Ch4 Iry dialogue options |
| `Watcher_Acknowledged_Ellis` | Ch1 M3 raise hand | Ch4 first figure_dark encounter |
| `Secret_Route_Entered` | Ch2 SECRET | Ch4/Ch7 hermetic endings |
| `The_City_Is_Awake` | Ch4 main path | Ch7 endings |
| `Tablets_Resonated` | Ch2 amber or Ch4 heart | Ch7 endings |
| `iryCompanionUsed` | Ch4 accept | Ch5/Ch6/Ch7 companion dialogue |
| `memorializedPartner` | Various (Sam-related flavor) | Ch7 "peace" ending branch |
| `sams_second_dig_known` | Ch1 fuel drum flavor | Ch3 vendor conversation (new path) |
| `watered_sams_tree` | Ch1 palm tree flavor | Ch7 "peace" branch |

---

## INVENTORY ITEMS

| Item | Where obtained | Use |
|------|----------------|-----|
| Field Journal | Starting | Always in inventory |
| Codex_Sketch | Ch1 sketch choice | Reference in later chapters |
| The Codex | Ch1 all missions complete | Ch2+ carried |
| Wrench | Ch1 fix carts yourself | — |
| Soil_Sample | Ch1 M1 descend | Ch4 Iry shows interest |
| Axle_Fragment | Ch1 M2 axles | Ch4 amber comparison |
| Marked_Stone | Ch1 M2 survey | — |
| Ruin Fragment Photos | Ch1 flavor ruins | Oxford contact (ch3) |
| Sam's Survey Stake | Ch1 flavor survey stake | Memorial item |
| Sam's Surveillance File | Ch1 tool shed (gated) | Ch3+ Ministry info |
| Glass Shard | Ch1 spoil mound | Ch4 amber channel |
| Sam's Notebook | Ch1 fuel drum | Ch2/Ch3 reveals |
| Undeveloped Film | Ch1 fuel drum | Ch3 reveal (needs dev) |
| Sam's Marked Map | Ch1 fuel drum | Ch2 shortcut |
| Mint Tea | Ch3 vendor | Stamina regen boost |

---

## SANITY EVENTS SUMMARY

### Ch1 major sanity losses
- Touching Codex (-1), ignoring the sound (-1), crossing trench (-2.5)
- M1 listen to floor (-2), M1 voices confirmed (-1.5), M1 heat felt (-1)
- M3 temperature drop (-1.5 variable)

### Ch1 major sanity gains
- Flavor stars (+0.5), palm tree watering (+1), cooking ate (+1)
- Sam gear wipe (+1.5), Brazier rest (+5 one-time)
- Sam's stake taken (+0.5)

---

## STYLE NOTES (for future scene writing)

1. **Voice**: Ellis is dry, precise, self-aware. Sarcasm only under stress. Never melodramatic.
2. **Tariq**: Formal English as second language. Reserves full emotion behind professional dignity. Breaks pattern only under honest pressure.
3. **Sam's voice**: Only through artifacts — notes, photos, carved symbols, surveillance files. Never directly. Keep him a ghost through evidence.
4. **The Codex, Watcher, and non-human entities**: No human metaphors. No adjectives describing emotion. Describe ONLY their effects on Ellis and the environment. The moment we describe what they "feel", the horror breaks.
5. **Sanity drops should always have a concrete cause**: a sound, a wrong geometry, a dissolving certainty. Never "you feel afraid."
6. **Branch consequences** must differ by more than tone — they must change what flags / items / NPCs / future scenes are available. Pure "flavor branches" with identical state changes are reserved for very low-stakes moments.

---

## NEXT-SESSION TODO

- Phase 4: Ch2 expansion with more branching within each route
- Ch3 Cairo market depth (vendor relationships, faction tracking)
- Ch5 airfield standoff variants based on carried flags
- Ch7 ending scenes for each combination of major flags
- Companion banter systems (Iry, Tariq) for Ch5/6
- Soundtrack / ambient tags per scene for future audio integration

---

## CHAPTER 2 UPDATE — FULLY WRITTEN (this session)

All three Ch2 routes now have complete scene content. The following was added:

---

### SCENE 3 & 4 (Ch1→Ch2 Transition — already existed, confirmed functional)
- `scene3_start` — The collapse. Three choices:
  - **Grab the Codex** → `scene4_secret` → SECRET route (`gameState.currentRoute = 'SECRET'`)
  - **Grab the Radio** → `scene4_cutthroat` → CUTTHROAT route (flag: `Someone_Knew_To_Listen`)
  - **Grab the Journal** → `scene4_trap` → TRAP route

---

### TRAP ROUTE — Full Scene List

**`ch2_start_trap`** — Dynamic opener. References Field Journal survival if `Codex_Sketch_Captured`. References Tariq's survival call if `trustTariq >= 3`.

**`ch2_samir`** — Full Samir introduction tree:
- `ch2_samir_who` — His background (French expedition 2019, trapped 5 years)
- `ch2_samir_food` — Shares ful medames. Establishes relationship.
- `ch2_samir_seven` — The fate of the other seven. Establishes city's danger.
- `ch2_samir_survive` — How he survives on lichens, city-water, French tins.
- `ch2_samir_purpose` — His 5-year theory: the city is a test. Knowledge is the credential.
- `ch2_samir_alive` — The city is alive. It tracks exploration vs. circling.
- `ch2_samir_cant` — Why he can't leave. The city keeps its caretaker.
- `ch2_samir_promise` — If Ellis promises to free him: gives **Samir's Map** (+3 knowledgeAtlantean). Sets `samir_promised_out = true`. This flag carries to Ch4+ (the NE chamber mechanism).
- `ch2_samir_exit` — Gives the **Chisel** and exit instructions. Required for bones puzzle.

**`ch2_mural`** — Three branches:
- Study city layout (+3 knowledgeAtlantean, +2 knowledgeCodex) → city-as-filing-system reveal
- Focus on Sam's note → **Sam was here before Ellis** (flag: `sam_was_here_first`). -1 sanity. Sam came here in a previous season, got out, said nothing.
- Photograph → +Mural Photograph to inventory

**`ch2_whispers`** — The whispering chamber:
- Listen harder (-2.5 sanity, +3 knowledgeAtlantean) → Ellis unconsciously learns the NE chamber glyph sequence (flag: `city_sequence_known`). Loses 40 minutes.
- Block ears and run (-0.5 sanity)
- Speak aloud (-1 sanity) → drives the murmuring out. Room goes silent, emits one tone.

**`ch2_bones`** — Fouad the devotee:
- Examine glyphs (+2 knowledgeHermetic) → Fouad's 50-year journal. His theory: the city is a mirror. What you bring in, it amplifies. (flag: `city_mirror_known`) +1.5 sanity
- Take the copper band → +Fouad's Copper Band to inventory
- Leave him

**`ch2_stash`** — Abandoned military pack:
- Take food+torch → +1.5 sanity
- Take notebook → +2 knowledgeAtlantean, +Abandoned Floor Plans. Contains the clue: "follow the cold air near an exit"
- Leave it → +0.5 sanity

**`ch2_gate`** — The exit threshold. Dynamic text based on `trapWhispersHeard`, `samir_promised_out`.

**`ch2_gate_crawl`** — The 40-minute crawl. Dynamic text references Sam if `sam_was_here_first`. References Samir promise if `samir_promised_out`. Exits to `loadChapterThree()`.

---

### SECRET ROUTE — Full Scene List

**`ch2_start_secret`** — Dynamic opener. References `Non_Human_Architect_Suspected` flag from Ch1. Establishes Codex pulse rhythm (8 seconds).

**`ch2_amber`** — Living amber channel. Touch it (+1.5 sanity, +2 knowledgeAtlantean, sets `Tablets_Resonated`) → full recognition event. Codex pulses twice, system registers Ellis.

**`ch2_chasm`** — The shaft. Bottom has something living (blue-white moving light):
- Watch (-1.5 sanity, +2 knowledgeAtlantean) → it does not look up. Probably.
- Note and move on.

**`ch2_statue`** — The Custodian. Seven joints per finger. Fell from its plinth deliberately:
- Examine inscription (+2 knowledgeAtlantean) → medieval Arabic addition: "It is not dead. It is deciding."
- Check plinth (+1 knowledgeCodex) → plinth polished at edges. Statue has stepped on/off many times. Amber channel was *rerouted* to follow where it chose to lie.

**Existing scenes confirmed functional:** `ch2_secret_altar` (Hollow King), `ch2_hollow_king_success`, `ch2_secret_door_w`, `ch2_secret_bridge`

---

### CUTTHROAT ROUTE — Full Scene List

**`ch2_start_cutthroat`** — Dynamic opener. References Tariq's position if `trustTariq >= 2`. Maren's team is already staged — they knew this place existed.

**`ch2_maren`** — Full Maren introduction tree:
- Accept deal (trustMaren = 2)
- Ask who contracted her → "They've been expecting this since 2018. Someone did the maths 7 years before your dig team noticed."
- Ask about Tariq → She has him covered. "I'm not running a body-count operation."
  - "Let me go to him first" → She refuses. Gives her word instead.
- Refuse → She gives you 60 seconds to reconsider.

**`ch2_boros`** — Full Boros tree (reading Proust):
- He's been to 3 previous subsurface sites. Each time the architecture differs but amber light is consistent.
- The client knows structural information but withholds academic interpretation — doesn't want operators developing opinions.
- Amber is power+data combined, non-electromagnetic frequency.
- Proust: "When I'm in places that make no human sense, reading something purely human is how I stay oriented." → **Hold onto what is purely your own.** (+1.5 sanity)

**`ch2_scaffolding`** — Three approaches over the void:
- Step right quickly → safe
- Freeze and redistribute weight → safe, Maren notices
- Run → planks break, destroys return route. Maren is not pleased.

**`ch2_cutthroat_maren`** (exit) — She gives Ellis a burner phone (+Maren's Burner Phone). Hints that the city may have chosen Ellis specifically. References previous sites where the "waiting chamber" had already cycled for someone else. Asks Ellis to call before publishing anything.
- `ch2_maren_final` — Full story of the waiting chambers. Flag: `city_chose_vance`. +3 trustMaren.

---

### NEW FLAGS ADDED (Ch2)
| Flag | Set by | Downstream effect |
|------|--------|-------------------|
| `sam_was_here_first` | Ch2 mural Sam branch | Ch3 Yusra dialogue, Ch7 endings |
| `city_sequence_known` | Ch2 whispers listen | Ch4 NE chamber shortcut |
| `city_mirror_known` | Ch2 bones Fouad | Ch4 Iry dialogue options |
| `samir_promised_out` | Ch2 Samir promise | Ch4 NE mechanism, Ch6/7 gate scenes |
| `city_chose_vance` | Ch2 Maren final | Ch7 "Chosen" ending branch |

---

### PUZZLE SCENES (now fully written)
- `puzzle_glyph_fail` — Dart fires at shin height. Cedar-tipped. Very old.
- `puzzle_glyph_solved` — Second passage revealed. Sam left the solution. He wanted someone to follow him.
- `puzzle_glyph_already` — Lock already open.

---

## NEXT STEPS (in order)

### 1. CH3 CAIRO MARKET — DEPTH (immediate priority)
The market currently has a functional flow (vendor → password → safehouse → Yusra) but is thin. Needs:
- **Yusra full scene tree** (`ch3_yusra_meet` exists but is brief — she should brief Ellis on the Hermetic Order's knowledge, react to what route Ellis came through, and set up the Ch4 city entry)
- **Hookah lounge** (`ch3_hookah`, `int_hk_stranger`, `int_hk_symbol`) — intelligence-gathering scenes
- **Ministry informant hostile** — if caught, gates the market password (currently has no consequence)
- **Route-variant market content** — TRAP Ellis is Codex-less and looks wrong, SECRET Ellis has two tablets and is a target, CUTTHROAT Ellis has Maren's phone and is being watched
- **Cipher puzzle** reward scene
- **Tea vendor relationship** — can become more than one interaction (selling info if you've been generous)

### 2. CH4 UNDERGROUND CITY — STRUCTURE (second priority)
Ch4 has map layout and basic objects but Iry is barely written. Needs:
- **Iry full encounter** — the non-human companion offer. What is she? What does she want? How does she react to different carried flags (`city_mirror_known`, `samir_promised_out`, `city_chose_vance`, `Watcher_Acknowledged_Ellis`)?
- **Heart Altar puzzle reward** — what happens when it's solved?
- **The Heart chamber** (`ch4_heart`) — the core Ch4 scene
- **City ambient scenes** — pillar, channel, glyph wall, fountain — expand these
- **Samir mechanism** (NE chamber) — if `samir_promised_out`: Ellis can operate the mechanism Samir described. What does it do?

### 3. CH5 AIRFIELD STANDOFF — CONSEQUENCE ENGINE (third priority)
Ch5 is where all carried flags collide. Needs:
- **Halberd full scene tree** — who he really is, what he's offering, why Ellis should or shouldn't trust him
- **Four-faction standoff** — the Ch5 climax where TRAP/SECRET/CUTTHROAT routes, trustTariq, and Maren's phone all have consequences
- **Tariq flat scenes** — the `int_tf_sister` and `int_tf_shoebox` scenes give Tariq a life outside the dig
- **Standoff resolution variants** based on: Codex possession, Samir promise, Maren relationship, Tariq trust

### 4. CH6/7 — ENDINGS (final priority)
These are dependent on everything above. Cannot write good endings until Ch3-5 flags are fully established. However:
- The Gate scene (`ch6_gate`) can be written as a pure atmospheric locked door that varies by carried knowledge
- Ch7 endings need at minimum 4 variants: Surrender / Resist / Transcend / Destabilise — each requiring different flag combinations

### ESTIMATED SCOPE
- Ch3 full depth: ~25 new scenes
- Ch4 full depth: ~30 new scenes  
- Ch5 standoff + Halberd + Tariq: ~35 new scenes
- Ch6 atmospheric + gate: ~10 new scenes
- Ch7 four ending variants: ~20 new scenes

**Total remaining**: approximately 120 scenes to complete the game.
