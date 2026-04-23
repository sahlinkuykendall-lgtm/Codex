const storyData = {
    // --- SCENE 1.1: FIRST EXAMINATION ---
    'scene1_start': { speaker: "Ellis", text: "Day 22. Still can't pin the dynasty. The pharaoh determinative in the third register is pre-dynastic, but the cartouche style below it is Middle Kingdom. That's fifteen hundred years of difference on a single stone.\n\nEither I'm wrong about everything I've been taught, or this thing was made by someone showing off.", choices: [
        { text: "Touch it, bare hand, feel the grooves.", onSelect: () => { decreaseSanity(1.0); gameState.flags.Codex_Pulse_Felt = true; gameState.knowledgeCodex += 1; }, nextScene: 's1_touch_result' },
        { text: "Use magnifying loupe, careful, no contact.", onSelect: () => { decreaseSanity(1.0); gameState.flags.Crystalline_Structure_Noted = true; gameState.knowledgeCodex += 2; }, nextScene: 's1_loupe_result' },
        { text: "Sketch it in the field journal - every glyph, every position.", onSelect: () => { decreaseSanity(1.0); gameState.flags.Codex_Sketch_Captured = true; gameState.knowledgeCodex += 3; if (!gameState.inventory.includes('Codex_Sketch')) gameState.inventory.push('Codex_Sketch'); }, nextScene: 's1_sketch_result' }
    ]},
    's1_touch_result': { speaker: "System", text: "The stone is warm. Not ambient-warm. Body-warm. The grooves of the hieroglyphs are rougher on one diagonal than the other - like the stone has a grain, except stone doesn't have a grain.\n\nA faint, almost subsonic vibration travels up through your wrist. It stops the moment you lift your hand. Your palm is tingling.", choices: [{ text: "Keep examining.", onSelect: () => startDialogue('scene1_sound') }] },
    's1_loupe_result': { speaker: "System", text: "Under 10x magnification, the incision marks aren't tool marks. They're crystalline. Like the glyphs grew out of the stone rather than being carved into it.\n\nYou blink. The loupe slips fractionally. When you re-focus, three of the glyphs have moved. Just enough that the cartouche now reads a different name.", choices: [{ text: "Blink again.", onSelect: () => startDialogue('scene1_sound') }] },
    's1_sketch_result': { speaker: "System", text: "The process is meditative. Eye to stone, pencil to paper. Half an hour disappears.\n\nWhen you finish and compare the sketch to the tablet, four glyphs don't match what you just drew. A pattern emerges: the glyphs that shifted are all determinatives for motion. As if the stone is describing something that won't hold still.", choices: [{ text: "Set pen down.", onSelect: () => startDialogue('scene1_sound') }] },

    // --- SCENE 1.2: THE SOUND ---
    'scene1_sound': { speaker: "System", text: "Before you can fully process what you are seeing, a sound happens. Not outside. Not exactly inside either.\n\nA sound like a stone door dragging open in a room that isn't there. It lasts half a second. The lamp flickers. The Codex's surface ripples - actually ripples, a visible shimmer across the basalt like heat off summer asphalt.\n\nThen: silence. The lamp is steady. The Codex is still.", choices: [
        { text: "Log it. Time, duration, observable effects. Scientific method.", onSelect: () => { gameState.flags.Sound_Logged = true; gameState.knowledgeCodex += 1; }, nextScene: 's1_log_result' },
        { text: "Call out - 'Tariq? Did you hear that?'", onSelect: () => { gameState.flags.Tariq_Primed = true; }, nextScene: 's1_call_result' },
        { text: "Ignore it. Return to the tablet.", onSelect: () => { decreaseSanity(1.0); gameState.flags.Codex_Addressed = true; gameState.flags.Codex_Is_Watching = true; }, nextScene: 's1_ignore_result' }
    ]},
    's1_log_result': { speaker: "System", text: "You write: '22:47 local. Duration ~0.6s. Auditory: subsonic-to-audible, origin indeterminate. Visual: surface shimmer on specimen, possibly thermal.'\n\nThen, in smaller handwriting: 'Could be auditory hallucination. Sleep deprivation at 34 hours. Noted.'", choices: [{ text: "Look up.", onSelect: () => startDialogue('scene1_tariq') }] },
    's1_call_result': { speaker: "System", text: "Your voice carries. Outside the tent, footsteps approach. Tariq ducks his head in, eyes narrowed.\n\nTARIQ: 'Hear what?'\n\nYou tell him never mind. He studies you for a beat - the look of a man counting how many weeks of desert an academic has left in them - then nods.", choices: [{ text: "Look at him.", onSelect: () => startDialogue('scene1_tariq') }] },
    's1_ignore_result': { speaker: "System", text: "You stare at the Codex. The name shifts again, incrementally, as if the stone is aware it's being watched and has decided to perform.\n\nELLIS: 'I see you.'\n\nThe tablet does not respond. Of course it doesn't. Stone doesn't respond. You realize you've been talking to a rock, and your hands are shaking.", choices: [{ text: "Look up.", onSelect: () => startDialogue('scene1_tariq') }] },

    // --- SCENE 1.3: TARIQ ENTERS ---
    'scene1_tariq': { speaker: "Tariq", text: "Doctor. We have a problem. The carts are dead on the supply path. Night shift walked off without a word. Dig authority inspects at dawn.\n\nIf the path is blocked, your permit is reviewed. If your permit is reviewed, your donor's name gets typed into a government database. That is very bad for your donor. Which is very bad for you.\n\nCome outside. Deal with this.", choices: [
        { text: "Concede immediately. 'You're right. Show me.'", onSelect: () => { gameState.trustTariq += 1; }, nextScene: 'tariq_concede' },
        { text: "Negotiate. 'Five minutes. I'm onto something.'", onSelect: () => {}, nextScene: 'tariq_negotiate' },
        { text: "Pull rank. 'I hired you. I'll come when I'm ready.'", onSelect: () => { gameState.trustTariq -= 3; gameState.flags.Tariq_Rank_Pulled = true; gameState.repLocal -= 2; }, nextScene: 'tariq_rank' },
        { text: "Be honest about the fear. 'Tariq - I don't think I'm okay.'", onSelect: () => { gameState.trustTariq += 3; gameState.flags.Tariq_Confessed_Unease = true; gameState.knowledgeCodex += 1; }, nextScene: 'tariq_honest' }
    ]},
    'tariq_concede': { speaker: "System", text: "Tariq blinks, surprised you didn't argue. He holds the flap open respectfully.\n\nTARIQ: 'Good.'", choices: [{ text: "Step outside.", onSelect: () => closeDialogue() }] },
    'tariq_negotiate': { speaker: "System", text: "Tariq waits, radiating the specific patience of a man who has outlasted three British academics, two German ones, and a Swiss who turned out to be a fraud.\n\nYou cave after 90 seconds and follow him.", choices: [{ text: "Step outside.", onSelect: () => closeDialogue() }] },
    'tariq_rank': { speaker: "System", text: "The tent goes very quiet. Tariq's expression does not change, but something behind his eyes goes flat, distant, like a door closing.\n\nTARIQ: 'Of course, Doctor. You are the expert.'\n\nHe leaves. That was stupid.", choices: [{ text: "Follow him out.", onSelect: () => closeDialogue() }] },
    'tariq_honest': { speaker: "Tariq", text: "He closes the tent flap behind him and sits on the camp stool. His voice drops.\n\n'Every man on this crew has felt it. We do not speak of it. Because to speak of it is to lose the work. But the ground here is not right. My grandmother would say the land is listening. What I know is that we have worked three weeks and no one has had a full night of sleep.'", choices: [{ text: "Follow him out.", onSelect: () => closeDialogue() }] },

    // --- SCENE 2: LOGISTICS ---
    'scene2_trench': { speaker: "Tariq", text: "The local men have stopped here, Doctor. Carts three and five are past the east trench. The men say the ground there has 'softened.'\n\nThey refuse to push across it in the dark. You can walk the path yourself. See it. Decide.", choices: [ 
        { text: "Cross it yourself. Lead by example.", onSelect: () => { decreaseSanity(2.5); gameState.repLocal += 2; gameState.flags.East_Trench_Crossed = true; gameState.flags.Subsurface_Vibration_Felt = true; gameState.flags.eastTrenchResolved = true; }, nextScene: 'trench_cross_result' }, 
        { text: "Pay a worker to cross it first (500 EGP).", onSelect: () => { if(gameState.funds >= 500) { gameState.funds -= 500; gameState.repLocal -= 1; gameState.flags.eastTrenchResolved = true; gameState.flags.Paid_For_Risk = true; startDialogue('trench_pay_result'); } else { alert("Not enough funds!"); } } },
        { text: "Reroute around the trench. Longer path, but safer.", onSelect: () => { gameState.repLocal += 3; gameState.flags.eastTrenchResolved = true; gameState.flags.East_Trench_Avoided = true; }, nextScene: 'trench_reroute_result' },
        { text: "Ask Tariq what he personally thinks is down there.", onSelect: () => { if (gameState.flags.Tariq_Confessed_Unease) { gameState.knowledgeCodex += 2; gameState.knowledgeAtlantean += 1; gameState.trustTariq += 2; gameState.flags.Tariq_Grandfather_Story = true; startDialogue('trench_ask_result'); } else { alert("Tariq isn't willing to open up to you about this yet."); } } }
    ]},
    'trench_cross_result': { speaker: "System", text: "You walk across the trench. The ground feels subtly wrong—a vibration rising through your boots. Halfway across, you feel a distinct give in the earth, like stepping on a frozen lake just barely holding.\n\nSeeing you survive the crossing, the workers slowly stand and push their carts.", choices: [{ text: "Examine the trench properly.", onSelect: () => startDialogue('ch1_m1_entry') }, { text: "Keep moving.", onSelect: () => closeDialogue() }] },
    'trench_pay_result': { speaker: "System", text: "You hold up the 500 EGP note. A young worker takes it without meeting your eyes and walks the trench. He survives.\n\nTARIQ (low): 'He will not forget that.'", choices: [{ text: "Keep moving.", onSelect: () => { updateHUD(); closeDialogue(); } }] },
    'trench_reroute_result': { speaker: "System", text: "Tariq relays the order. The workers stand with the relief of men who had expected to be asked to die for a stranger's paperwork. They gladly take the thirty-minute detour.", choices: [{ text: "Examine the trench now that the path is clear.", onSelect: () => startDialogue('ch1_m1_entry') }, { text: "Keep moving.", onSelect: () => closeDialogue() }] },
    'trench_ask_result': { speaker: "Tariq", text: "Long pause. Tariq looks at the trench. At the stars. At you.\n\n'My grandfather worked the Cairo digs in the 1950s. Before the tourists. He told me a story once. That the old priests did not build tombs at Giza. They built lids. The pyramids were not for the dead kings. The pyramids were signs that said, do not dig here.'", choices: [{ text: "Return to the issue of the Trench.", onSelect: () => startDialogue('scene2_trench') }] },
    
    'scene2_carts': { speaker: "Worker", text: "Dr. Vance! The axles on these three carts didn't just break. They look like they were turned to glass and then shattered.\n\nWe cannot move them.", choices: [ 
        { text: "Fix them yourself. Hands-on.", onSelect: () => { gameState.repLocal += 3; if (!gameState.inventory.includes('Wrench')) gameState.inventory.push('Wrench'); gameState.flags.cartsResolved = true; gameState.flags.Ellis_Worked_Hands = true; }, nextScene: 'carts_fix_result' }, 
        { text: "Offer a bonus to whoever finishes first (300 EGP).", onSelect: () => { if(gameState.funds >= 300) { gameState.funds -= 300; gameState.repLocal -= 2; gameState.flags.cartsResolved = true; gameState.flags.Bonus_Offered = true; startDialogue('carts_bonus_result'); } else { alert("Not enough funds!"); } } },
        { text: "Instruct the team from a distance. Stay supervisory.", onSelect: () => { gameState.trustTariq += 1; gameState.flags.cartsResolved = true; }, nextScene: 'carts_instruct_result' } 
    ]},
    'carts_fix_result': { speaker: "System", text: "You roll up your sleeves. The problem is leverage. You use a winch shaft as a pry bar. Two workers drift over to help, unasked. The carts are fixed.\n\nTARIQ: 'First time I have seen an archaeologist do real work.'", choices: [{ text: "Look at the broken axles.", onSelect: () => startDialogue('ch1_m2_entry') }, { text: "Wipe your hands.", onSelect: () => closeDialogue() }] },
    'carts_bonus_result': { speaker: "System", text: "You offer the money. The workers go from lethargic to competitive in ninety seconds. They fight each other to finish first. One worker cuts his hand on the wrench and does not stop.\n\nTARIQ: 'You made them fight each other for scraps. They will hate you for this.'", choices: [{ text: "Pay the winner.", onSelect: () => { updateHUD(); closeDialogue(); } }] },
    'carts_instruct_result': { speaker: "System", text: "You direct. They execute. Tariq translates your instructions, cutting some of your more pedantic demands because he knows the workers and you do not. The job gets done safely.", choices: [{ text: "Examine the failed axles.", onSelect: () => startDialogue('ch1_m2_entry') }, { text: "Nod to Tariq.", onSelect: () => closeDialogue() }] },
    
    'scene2_stranger': { speaker: "Ellis", text: "Tariq. Look. Behind the pallet by the generator. Who is that? That's not one of our men.\n\nTARIQ: I see no one, Doctor.", choices: [ 
        { text: "Approach the figure directly.", onSelect: () => { decreaseSanity(1.5); gameState.flags.Watched_By_Stranger = true; gameState.flags.watcherResolved = true; }, nextScene: 'stranger_approach_result' }, 
        { text: "Press Tariq. 'You saw him. You looked right at him.'", onSelect: () => { gameState.trustTariq -= 1; gameState.flags.Tariq_Lied_About_Watcher = true; gameState.knowledgeHermetic += 1; gameState.flags.watcherResolved = true; }, nextScene: 'stranger_press_result' },
        { text: "Drop it. Note it in the journal.", onSelect: () => { gameState.flags.Watched_By_Stranger = true; gameState.flags.Watcher_Logged = true; gameState.flags.watcherResolved = true; }, nextScene: 'stranger_drop_result' } 
    ]},
    'stranger_approach_result': { speaker: "System", text: "You walk toward the generator. As you close to within ten meters, the figure turns slowly, deliberately - and walks behind the pallet. You follow.\n\nNo one is there. Only the rumble of the generator and a faint smell of something spiced and old, like incense burned in an empty house.", choices: [{ text: "Investigate this properly.", onSelect: () => startDialogue('ch1_m3_entry') }, { text: "Return to Tariq.", onSelect: () => closeDialogue() }] },
    'stranger_press_result': { speaker: "Tariq", text: "'I looked where you pointed. I saw a generator. You are tired, Doctor. Please return to the tent.'\n\nHe holds your gaze. Something passes between you—a recognition that Tariq's denial is performative. His loyalty is not as simple as his paycheck.", choices: [{ text: "Investigate the generator compound yourself.", onSelect: () => startDialogue('ch1_m3_entry') }, { text: "Back down.", onSelect: () => closeDialogue() }] },
    'stranger_drop_result': { speaker: "System", text: "You pull out your journal and write: 'Figure observed at generator pallet... Tariq claims no observation. Possible sleep-deprivation artifact. Possible real stranger. Investigate.'", choices: [{ text: "Investigate now.", onSelect: () => startDialogue('ch1_m3_entry') }, { text: "Close the journal.", onSelect: () => closeDialogue() }] },
    
    // --- FLAVOR OBJECTS & REST SITE ---
    'rest_brazier': { speaker: "System", text: "The workers' fire provides a small pocket of normal world. The flames cast dancing shadows, but they feel warm and grounded in reality.", choices: [ { text: "Rest.", onSelect: () => attemptRest('rest_brazier') }, { text: "Leave.", onSelect: () => closeDialogue() } ]},
    'rest_cooling_down': { speaker: "System", text: "You sat here not long ago. The warmth is still in your bones. Wait a while longer before resting again.", choices: [{ text: "Leave.", onSelect: () => closeDialogue() }]},
    'rest_already_used': { speaker: "System", text: "You've already rested here this chapter. The site holds no more comfort for you tonight.", choices: [{ text: "Leave.", onSelect: () => closeDialogue() }]},
    
    'flavor_sam': { speaker: "System", text: "A half-buried brass transit level belonging to Sam Okafor. Your dead research partner. It's half-buried in the sand where they left it 14 months ago.", choices: [ { text: "Wipe the dust from it.", onSelect: () => { increaseSanity(1.5); gameState.flags.memorializedPartner = true; }, nextScene: 'sam_wipe_result' }, { text: "Leave it in the dirt.", onSelect: () => { decreaseSanity(0.5); }, nextScene: 'sam_leave_result' } ]},
    'sam_wipe_result': { speaker: "System", text: "You clear the dust from the brass. A small act of memory. It helps steady your racing heart.", choices: [{ text: "Step away.", onSelect: () => closeDialogue() }] },
    'sam_leave_result': { speaker: "System", text: "You turn your back on it. A profound pang of guilt hits you. Sam wouldn't have left you.", choices: [{ text: "Walk away.", onSelect: () => closeDialogue() }] },
    
    'flavor_desk': { speaker: "System", text: "The foreman's makeshift desk. Scattered across it are unpaid invoices, logistical maps, and a heavily redacted letter from the Ministry of Antiquities.", choices: [ { text: "Read the manifest.", onSelect: () => { if (!gameState.flags.readManifest) { gameState.knowledgeCodex += 1; gameState.flags.readManifest = true; } }, nextScene: 'desk_read_result' }, { text: "Leave it.", onSelect: () => closeDialogue() } ]},
    'desk_read_result': { speaker: "System", text: "You find a notation about a 'thermal anomaly' detected deep beneath the bedrock of the dig site. Interesting. The Ministry knows something is down there.", choices: [{ text: "Put it down.", onSelect: () => closeDialogue() }] },
    
    'flavor_water': { speaker: "System", text: "Workers are huddled around the water barrels. They are speaking in hushed, frightened tones. They stop muttering as soon as you approach.", choices: [ { text: "Ask what they were talking about.", onSelect: () => { gameState.repLocal -= 1; }, nextScene: 'water_ask_result' }, { text: "Take a drink and nod silently.", onSelect: () => { gameState.repLocal += 1; }, nextScene: 'water_drink_result' } ]},
    'water_ask_result': { speaker: "System", text: "They refuse to meet your eyes, murmuring apologies in Arabic before scattering back to their posts. You shouldn't have pried.", choices: [{ text: "Leave.", onSelect: () => closeDialogue() }] },
    'water_drink_result': { speaker: "System", text: "You share the water in total silence. A quiet, mutual respect is established in the shared dread of the dark.", choices: [{ text: "Leave.", onSelect: () => closeDialogue() }] },
    
    'flavor_sand': { speaker: "System", text: "The wind whips across this dune in a bizarre, geometric pattern. If you close your eyes, the howling sounds exactly like a choir.", choices: [ { text: "Listen closely.", onSelect: () => { if (!gameState.flags.heardSand) { gameState.knowledgeAtlantean += 1; decreaseSanity(1.0); gameState.flags.heardSand = true; } }, nextScene: 'sand_listen_result' }, { text: "Leave.", onSelect: () => closeDialogue() } ]},
    'sand_listen_result': { speaker: "System", text: "The choir isn't wind. It's breathing. Massive, slow, subterranean breathing. Your head begins to pound as the sound vibrates against your skull.", choices: [{ text: "Step back.", onSelect: () => closeDialogue() }] },

    // ---- NEW Ch1 flavor nodes ----
    'flavor_stars': {
        speaker: "System",
        text: "You tilt your head back. The sky over Giza has no light pollution — you can see the Milky Way clear as a chalk line. Orion is high. The three stars of his belt align almost exactly with the three great pyramids. Sam used to call that 'the joke that took ten thousand years to land.'",
        choices: [
            { text: "Stay a moment longer.", onSelect: () => { gameState.flags.stars_watched = true; increaseSanity(0.5); updateHUD(); closeDialogue(); } },
            { text: "Get back to work.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_ruins_fragment': {
        speaker: "System",
        text: "A low stretch of weathered limestone, partly buried. The dressed face still shows faint tool marks. Eighteenth-dynasty, maybe earlier. Not part of any catalogued structure — just a wall from a building nobody remembers.\n\nYou run your hand along the top. The stone is warm where the moon has touched it.",
        choices: [
            { text: "Photograph it.", onSelect: () => { gameState.knowledgeCodex += 1; if (!gameState.inventory.includes('Ruin Fragment Photos')) gameState.inventory.push('Ruin Fragment Photos'); closeDialogue(); } },
            { text: "Leave it.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_boulder': {
        speaker: "System",
        text: "A boulder, half the size of a truck, worn smooth by centuries of wind. On the lee side, someone has carved a small mark — more recent than the stone's erosion. A plus sign inside a circle. Sam's field notation for 'worth coming back to.'",
        choices: [
            { text: "Note the location.", onSelect: () => { gameState.flags.sam_waypoint_found = true; gameState.knowledgeCodex += 1; closeDialogue(); } },
            { text: "Move on.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_cactus': {
        speaker: "System",
        text: "A lone date cactus. Drought-stressed, barely holding on. The fruit at the top is purple-black and split — bird-pecked. You remember Sam once tried to drink cactus water on a dare and spent the next six hours vomiting behind a Land Cruiser.\n\nYou smile despite yourself. It lasts about two seconds.",
        choices: [{ text: "Walk on.", onSelect: () => closeDialogue() }]
    },
    'flavor_survey_stake': {
        speaker: "System",
        text: "A wooden stake driven into the sand. Yellow flagging tape, faded orange now. Sam's handwriting on the stake in black marker: '1.2m subsurface anomaly. GPR confirm req.'\n\nThe date on the stake is 14 months ago. Two weeks before he died.",
        choices: [
            { text: "Leave it standing.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } },
            { text: "Pull it up. Take it with you.", onSelect: () => { if (!gameState.inventory.includes("Sam's Survey Stake")) gameState.inventory.push("Sam's Survey Stake"); gameState.flags.memorializedPartner = true; increaseSanity(0.5); updateHUD(); closeDialogue(); } }
        ]
    },
    'flavor_cooking_table': {
        speaker: "System",
        text: "The camp's communal cooking table. A propane burner, a half-empty sack of rice, a pot of cold ful medames. A half-drunk glass of tea, still warm — someone was here a minute ago.\n\nOn the edge of the table, carved with a knife: a small eye symbol. Not Arabic. Not Coptic. Older.",
        choices: [
            { text: "Eat.", onSelect: () => { increaseSanity(1.0); if (!gameState.flags.cooking_ate) { gameState.flags.cooking_ate = true; } updateHUD(); closeDialogue(); } },
            { text: "Photograph the carving.", onSelect: () => { gameState.knowledgeAtlantean += 1; closeDialogue(); } },
            { text: "Walk on.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_crates': {
        speaker: "System",
        text: "A pile of supply crates. Ministry stamps on three of them, UNESCO tags on two, unlabeled on the rest. The ones with no labels are heavier than they look. The tops are pried open and resealed. Someone's been sorting these at night.",
        choices: [
            { text: "Pry one open.", onSelect: () => { decreaseSanity(0.5); gameState.flags.crates_investigated = true; startDialogue('flavor_crates_opened'); } },
            { text: "Leave them.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_crates_opened': {
        speaker: "System",
        text: "Inside: cylindrical cases padded with foam. Six of them. The cases are labeled in French — 'échantillons minéralogiques, bâti atlante, ne pas ouvrir.'\n\n'Atlantean stratum mineral samples. Do not open.'\n\nYou close the crate carefully. You never saw this.",
        choices: [{ text: "Walk away.", onSelect: () => closeDialogue() }]
    },
    'flavor_spoil_mound': {
        speaker: "System",
        text: "A spoil mound — earth excavated from the dig and dumped here for later sifting. You kick it idly. A bone comes loose. Goat. Modern. Probably lunch.\n\nBut deeper in, something catches the moonlight. A shard of something that isn't earth.",
        choices: [
            { text: "Dig out the shard.", onSelect: () => { gameState.knowledgeCodex += 1; if (!gameState.inventory.includes('Glass Shard')) gameState.inventory.push('Glass Shard'); decreaseSanity(0.5); closeDialogue(); } },
            { text: "Let it be.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_tool_shed': {
        speaker: "System",
        text: "The tool shed. Padlocked. Through the gap in the door you can see picks, shovels, GPR equipment, a portable generator, spare bracing timber. Normal dig-site tools.\n\nWhat's not normal: a second padlock, newer, on the interior door that leads to the back half. Sam had the only key. You never asked what he kept back there.",
        choices: [
            { text: "Try the padlock.", onSelect: () => { if (gameState.flags.sam_waypoint_found) startDialogue('flavor_tool_shed_opened'); else { alert("You don't have the key."); closeDialogue(); } }},
            { text: "Walk away.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_tool_shed_opened': {
        speaker: "System",
        text: "Sam's key — you've had it all along, in the bottom of your field pack. It fits. The padlock clicks.\n\nInside: a cork board covered in photographs. Not of the dig. Of people. Faces photographed at distance, without their knowledge. Workers. Ministry officials. A man you don't recognize but who appears in eleven of the shots. Each photo has a date and a location on the back.\n\nSam was watching someone. Sam was watching everyone.",
        choices: [
            { text: "Take the photographs.", onSelect: () => { if (!gameState.inventory.includes("Sam's Surveillance File")) gameState.inventory.push("Sam's Surveillance File"); gameState.knowledgeCodex += 3; decreaseSanity(2.0); closeDialogue(); } }
        ]
    },
    'flavor_ministry_post': {
        speaker: "System",
        text: "The Ministry observation post. A prefab guard shack with a satellite uplink on the roof. The radio inside is on — you can hear a muffled Arabic voice every few minutes. Check-ins.\n\nOn the window ledge outside: three cigarette butts. Same brand. All lit within the last hour. Someone has been waiting here, watching the camp.",
        choices: [
            { text: "Note it and leave.", onSelect: () => { gameState.flags.ministry_watching = true; decreaseSanity(0.5); closeDialogue(); } }
        ]
    },
    'flavor_fuel_drums': {
        speaker: "System",
        text: "Fuel drums, stacked two-high. Diesel for the generators and the trucks. The top drum has a small brass padlock that doesn't match the others.\n\nYou crouch. A seam in the sand at the drum's base. This drum has been moved recently. It's hollow.",
        choices: [
            { text: "Investigate the hollow drum.", onSelect: () => { decreaseSanity(0.5); gameState.flags.drum_searched = true; startDialogue('flavor_drum_opened'); } },
            { text: "Leave it alone.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_drum_opened': {
        speaker: "System",
        text: "You work the drum off its base. Inside the hollow: a waxed canvas bag. Inside the bag: a notebook in Sam's handwriting, two rolls of undeveloped 35mm film, and a folded map of the dig site with an X marked at a point two hundred meters west of the tunnel mouth.\n\nX marks the spot. Sam was running his own dig.",
        choices: [
            { text: "Take everything.", onSelect: () => {
                if (!gameState.inventory.includes("Sam's Notebook")) gameState.inventory.push("Sam's Notebook");
                if (!gameState.inventory.includes("Undeveloped Film")) gameState.inventory.push("Undeveloped Film");
                if (!gameState.inventory.includes("Sam's Marked Map")) gameState.inventory.push("Sam's Marked Map");
                gameState.knowledgeCodex += 2;
                gameState.flags.sams_second_dig_known = true;
                closeDialogue();
            }}
        ]
    },
    'flavor_guard_booth': {
        speaker: "System",
        text: "A chain-link enclosure with a folding chair inside. A guard's booth. The chair is empty but the thermos on the floor is still warm.\n\nOn the inside of the door, at eye height for a seated man: tally marks. Forty-two of them. Scratched one per night, by someone counting the days since something began.",
        choices: [{ text: "Step away.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } }]
    },
    'flavor_scaffolding': {
        speaker: "System",
        text: "The trench scaffolding. Galvanized steel poles lashed with wire. Standard dig equipment. One pole has something tied to it at shoulder height — a knot of red thread, seven twists. You recognize it. A worker's protective charm. Cheap, improvised, but taken seriously here.\n\nIt's been retied recently. The knot is fresh.",
        choices: [
            { text: "Leave the charm be.", onSelect: () => { gameState.flags.workers_afraid = true; closeDialogue(); } }
        ]
    },
    'flavor_site_trailer': {
        speaker: "System",
        text: "The main site trailer. Locked. You can hear a radio inside playing soft Arabic pop — someone's in there, pretending not to be. You can see the outline of a head in the window against the lamp inside.\n\nYou decide not to knock. Whoever they are, they'd rather you didn't.",
        choices: [{ text: "Walk past.", onSelect: () => closeDialogue() }]
    },
    'flavor_palm_tree': {
        speaker: "System",
        text: "A date palm. Date palms aren't native to this stretch of the Giza Plateau — someone planted this one. The trunk has a brass plaque, tarnished black: 'PLANTED BY S. OKAFOR, SEASON 1, IN HONOR OF THE FIRST DIG.'\n\nSam used to water it every night. No one has watered it since.",
        choices: [
            { text: "Water it.", onSelect: () => { gameState.flags.watered_sams_tree = true; increaseSanity(1.0); gameState.trustTariq += 1; updateHUD(); closeDialogue(); } },
            { text: "Walk past.", onSelect: () => closeDialogue() }
        ]
    },
    'flavor_gate_post': {
        speaker: "System",
        text: "The main gate post of the camp perimeter. A rusted metal arch, unlit. Two names were painted on it once. One has been scraped off. The remaining one is 'OKAFOR / VANCE GIZA INVESTIGATION — SEASON 3.'\n\nYou are season 4. The paint has been scraped every time.",
        choices: [{ text: "Walk through.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } }]
    },
    'flavor_digshed': {
        speaker: "System",
        text: "The primary dig shed — three days from expired permits, a week from a Ministry audit, a thousand years from anything you understand. The clipboard on the door lists today's crew. Three names are crossed out in the same handwriting. The Arabic marginalia next to them translates roughly as 'did not report. Not expected to.'",
        choices: [
            { text: "Read carefully.", onSelect: () => { gameState.flags.crew_missing = true; decreaseSanity(0.5); closeDialogue(); } },
            { text: "Move on.", onSelect: () => closeDialogue() }
        ]
    },

    // =========================================================
    // ========= CH1 EXPANSION — emotional/stakes content =======
    // =========================================================

    // ---- SATPHONE — Ellis can call three people, each with different weight ----
    'ch1_satphone': { speaker: "System", text: "The Iridium satphone sits on its charger beside your cot. Three bars. Expensive per-minute rates. You've been using it sparingly.\n\nYou know three numbers by heart.\n\nWhich one you call tonight will decide something about who you are in this tent, 4,000 kilometers from anyone who knows your name.", choices: [
        { text: "Call your ex-wife, Helena.", onSelect: () => startDialogue('ch1_call_helena') },
        { text: "Call the department chair at Oxford.", onSelect: () => startDialogue('ch1_call_dept') },
        { text: "Call Sam's sister, Ayo.", onSelect: () => startDialogue('ch1_call_ayo') },
        { text: "Put it back. Not tonight.", onSelect: () => closeDialogue() }
    ]},

    'ch1_call_helena': { speaker: "Helena", text: () => {
        if (gameState.flags.called_ex_wife) return "The line rings. She doesn't pick up this time. You listen to her voicemail for a moment — her recorded voice, saying her name the way she said it on their first date — and hang up without speaking.";
        return "Three rings. Then her voice, flat:\n\n'Ellis. It's two in the morning in England.'\n\n'I know. I'm sorry.'\n\nA pause. You can hear a kettle in the background. She's not sleeping either.\n\n'Are you safe?'\n\n'I'm in Giza.'\n\n'That's not what I asked.'";
    }, choices: [
        { text: "'I think I found something real.'", onSelect: () => {
            if (gameState.flags.called_ex_wife) { closeDialogue(); return; }
            gameState.flags.called_ex_wife = true;
            gameState.flags.satphone_used = true;
            startDialogue('ch1_call_helena_real');
        }},
        { text: "'I'm sorry I called. Go back to sleep.'", onSelect: () => {
            if (!gameState.flags.called_ex_wife) {
                gameState.flags.called_ex_wife = true;
                gameState.flags.satphone_used = true;
                decreaseSanity(1.0);
            }
            startDialogue('ch1_call_helena_hangup');
        }},
        { text: "'I need to tell you about Sam.'", onSelect: () => {
            if (gameState.flags.called_ex_wife) { closeDialogue(); return; }
            gameState.flags.called_ex_wife = true;
            gameState.flags.satphone_used = true;
            startDialogue('ch1_call_helena_sam');
        }}
    ]},

    'ch1_call_helena_real': { speaker: "Helena", text: "A long silence. The kettle clicks off in England.\n\n'You said that about Saqqara too.'\n\nShe isn't trying to hurt you. She's trying to make you hear yourself.\n\n'Ellis. You haven't called in six months. You don't call to tell me you found something. You call because you want someone to tell you that you're allowed to keep looking. I'm not going to do that anymore. Please take care of yourself.'\n\nShe hangs up. Gently. No anger in it.\n\nYou stare at the silent phone for a long time.", choices: [
        { text: "Put it down.", onSelect: () => { decreaseSanity(1.5); gameState.knowledgeCodex += 1; closeDialogue(); } }
    ]},

    'ch1_call_helena_sam': { speaker: "Helena", text: "A softer pause.\n\n'Ellis.'\n\n'I think the report was wrong. The one from Saqqara. I think someone — '\n\n'Ellis. Stop.'\n\nAnother pause. When she speaks again her voice is different — the voice she used when you were both younger and not yet broken.\n\n'Whatever you're about to say to me at two in the morning from a tent in Egypt, you're going to regret in the daylight. Call Ayo. Not me. I was never part of that friendship. Call his sister. Say it to her.'\n\n'I haven't called her in fourteen months.'\n\n'I know.'", choices: [
        { text: "'Thank you.'", onSelect: () => { increaseSanity(1.0); closeDialogue(); } }
    ]},

    'ch1_call_helena_hangup': { speaker: "Helena", text: "'Ellis — '\n\nYou hang up. The line goes dead.\n\nYou know her well enough to know she will be awake for another hour wondering if you're okay. You know yourself well enough to know you will not call back to say you are.", choices: [
        { text: "Set the phone down.", onSelect: () => closeDialogue() }
    ]},

    'ch1_call_dept': { speaker: "Prof. Wellesley", text: () => {
        if (gameState.flags.called_department) return "The chair's secretary picks up. The chair is in a meeting. She takes a message in clipped Oxbridge tones. You hang up feeling no different.";
        return "The line picks up on the first ring. Of course it does. He was waiting for this call.\n\n'Doctor Vance. Good of you to remember us.'\n\n'Sir. I need to report — '\n\n'You're going to tell me you've found something.'\n\nHis voice has the specific disappointed patience of a man who has spent forty years watching brilliant students become embarrassments.\n\n'The Ministry of Antiquities have been in touch. They are aware you are in country. They are not aware you are digging. I am containing this at some personal cost. What, specifically, have you found?'";
    }, choices: [
        { text: "'A tablet. Unlike anything in the literature.'", onSelect: () => {
            if (gameState.flags.called_department) { closeDialogue(); return; }
            gameState.flags.called_department = true;
            gameState.flags.satphone_used = true;
            startDialogue('ch1_call_dept_tablet');
        }},
        { text: "'Nothing. False alarm. Clearing camp.'", onSelect: () => {
            if (gameState.flags.called_department) { closeDialogue(); return; }
            gameState.flags.called_department = true;
            gameState.flags.satphone_used = true;
            gameState.repAcademic -= 2;
            startDialogue('ch1_call_dept_lie');
        }},
        { text: "'I need to know who my donor really is.'", onSelect: () => {
            if (gameState.flags.called_department) { closeDialogue(); return; }
            gameState.flags.called_department = true;
            gameState.flags.satphone_used = true;
            startDialogue('ch1_call_dept_donor');
        }}
    ]},

    'ch1_call_dept_tablet': { speaker: "Prof. Wellesley", text: "A long beat.\n\n'Doctor Vance. Listen to me very carefully. If you have found something genuine, you do not have permission to dig it up. You do not have permission to move it. You do not even have permission to photograph it.\n\n'If you want to save your career — what is left of it — you will abandon the site at first light and come home. I will tell the Ministry the excavation was unauthorized and conducted by a junior researcher operating outside our authority. I will not protect you a second time.\n\n'Do you understand?'\n\n'I understand.'\n\n'I hope so.'", choices: [
        { text: "Put the phone down.", onSelect: () => { gameState.repAcademic += 1; closeDialogue(); } }
    ]},

    'ch1_call_dept_lie': { speaker: "Prof. Wellesley", text: "'Good.'\n\nHe believes you. He does not want to believe you, because believing you means dealing with you, and he is tired of dealing with you.\n\n'Book a flight home. We will discuss your sabbatical upon your return.'\n\nHe hangs up. You have bought yourself twelve hours, maybe twenty-four, before he checks whether you actually went to the airport.", choices: [
        { text: "Put the phone down.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } }
    ]},

    'ch1_call_dept_donor': { speaker: "Prof. Wellesley", text: "A pause. The kind of pause that answers the question before he speaks.\n\n'Doctor Vance. You did not ask that question when the funding was offered. You do not get to ask it now.'\n\n'Sir — '\n\n'The answer, for what it's worth, is that I don't know either. The grant was routed through three holding companies. I made inquiries. The inquiries stopped being productive after the second shell.\n\n'Whoever wrote your check does not want to be known. Which, I have learned in forty years, is a piece of information.'\n\nHe hangs up.", choices: [
        { text: "Stare at the phone.", onSelect: () => { gameState.knowledgeHermetic += 2; closeDialogue(); } }
    ]},

    'ch1_call_ayo': { speaker: "Ayo", text: () => {
        if (gameState.flags.called_ayo || gameState.flags.called_sams_sister) return "The line goes to voicemail. You hang up without speaking. You have nothing new to say.";
        return "The line rings. Four times. Five. You're about to hang up when she picks up.\n\n'Ellis?'\n\nHer voice still stops you. She sounds like him. The cadence. The laugh even when she isn't laughing.\n\n'Ayo. I'm — I'm in Egypt.'\n\n'I know. I saw the paper from the University.'\n\n'I should have called before I came.'\n\n'Yes. You should have.'\n\nBut her voice has no anger in it. It has something worse — it has patience. She has been waiting for you to be ready to have this conversation for fourteen months.";
    }, choices: [
        { text: "'I'm going down into a tunnel tomorrow. I wanted someone to know.'", onSelect: () => {
            if (gameState.flags.called_sams_sister) { closeDialogue(); return; }
            gameState.flags.called_sams_sister = true;
            gameState.flags.satphone_used = true;
            startDialogue('ch1_call_ayo_tunnel');
        }},
        { text: "'I think about him every day. I wanted to say that.'", onSelect: () => {
            if (gameState.flags.called_sams_sister) { closeDialogue(); return; }
            gameState.flags.called_sams_sister = true;
            gameState.flags.satphone_used = true;
            gameState.flags.memorializedPartner = true;
            startDialogue('ch1_call_ayo_every_day');
        }},
        { text: "'I'm sorry I didn't come to the funeral.'", onSelect: () => {
            if (gameState.flags.called_sams_sister) { closeDialogue(); return; }
            gameState.flags.called_sams_sister = true;
            gameState.flags.satphone_used = true;
            startDialogue('ch1_call_ayo_funeral');
        }}
    ]},

    'ch1_call_ayo_tunnel': { speaker: "Ayo", text: "A long quiet. You can hear Lagos traffic behind her — it is morning there.\n\n'Ellis. He wouldn't want you to die down there to make up for what happened at Saqqara. That is not what he would want. Do you understand me? He wouldn't want that.'\n\n'I don't want to die, Ayo.'\n\n'Good. Then call me when you come back up. Not before. When you come back up.'\n\n'I will.'\n\n'Ellis. Promise me.'\n\n'I promise.'\n\nShe hangs up first. You sit with the phone for a long time.", choices: [
        { text: "Set it down carefully.", onSelect: () => { increaseSanity(2.0); gameState.flags.memorializedPartner = true; gameState.flags.flashback_sam_done = true; closeDialogue(); } }
    ]},

    'ch1_call_ayo_every_day': { speaker: "Ayo", text: "She doesn't say anything for a while. You can hear her breathing. You can hear Lagos traffic — a car horn, a woman calling a name, a kettle.\n\nWhen she speaks, her voice is very quiet.\n\n'Thank you for saying that. He knew. He always knew. But thank you for saying it out loud.'\n\n'Ayo — '\n\n'Go do whatever you came out there to do. Come back to me. Tell me about it.'\n\nShe hangs up.\n\nYou realize, holding the phone, that you are crying. You haven't cried since the call about Sam.", choices: [
        { text: "Sit with this.", onSelect: () => { increaseSanity(3.0); gameState.flags.flashback_sam_done = true; closeDialogue(); } }
    ]},

    'ch1_call_ayo_funeral': { speaker: "Ayo", text: "She laughs. Not cruelly. The way her brother used to laugh — sudden and tired.\n\n'Ellis. Nobody was mad you didn't come. We were mad you didn't call. The funeral was a formality. The call would have been for us.\n\n'You can still call. You are calling now. Late, but calling. I'll take it.'\n\nA pause.\n\n'He talked about you constantly, you know. You were his best friend. He never stopped saying so. Even after Saqqara. Even on the phone an hour before.'\n\nYou realize you have stopped breathing.", choices: [
        { text: "'An hour before?'", onSelect: () => startDialogue('ch1_call_ayo_hour_before') }
    ]},

    'ch1_call_ayo_hour_before': { speaker: "Ayo", text: "'He called me an hour before the collapse. Said he was worried about the substrate reading. Said you had pushed back and he thought you were right to. Said the numbers didn't match the previous week's.\n\n'I told him to trust his instincts. I told him if it felt wrong he should call off the shift.\n\n'He didn't. He was about to. He was writing the email. Then the collapse happened.'\n\nShe says this flat. She has been carrying this for fourteen months. She is giving it to you now because she thinks you are strong enough to carry a piece of it.\n\n'The report was wrong, Ellis. He knew. I've been waiting to tell you until you were sober enough to hear it. I think you are sober now.'", choices: [
        { text: "Close your eyes.", onSelect: () => { decreaseSanity(2.0); gameState.knowledgeHermetic += 3; gameState.flags.Saqqara_Was_Arranged = true; gameState.flags.memorializedPartner = true; gameState.flags.flashback_sam_done = true; closeDialogue(); } }
    ]},

    // ---- TARIQ GRANDFATHER STORY — full scene, not just a flag ----
    'ch1_tariq_talk': { speaker: "Tariq", text: () => {
        if (gameState.flags.Tariq_Confessed_Unease || gameState.trustTariq >= 3) {
            return "He is sitting on an upturned crate by the brazier, a cigarette in his hand, the pack on his knee. He nods at the crate next to him.\n\n'Sit. The logistics can wait ten minutes. I want to tell you a thing about this ground.'";
        }
        return "Tariq sits on a crate, smoking. He glances up as you approach, unreadable.\n\n'Something on your mind, Doctor?'";
    }, choices: [
        { text: "Sit with him.", onSelect: () => {
            if (gameState.flags.Tariq_Confessed_Unease || gameState.trustTariq >= 3) {
                startDialogue('ch1_tariq_grandfather');
            } else {
                startDialogue('ch1_tariq_cold');
            }
        }},
        { text: "'Just checking on you.'", onSelect: () => {
            gameState.trustTariq += 1;
            startDialogue('ch1_tariq_checkin');
        }},
        { text: "Leave him alone.", onSelect: () => closeDialogue() }
    ]},

    'ch1_tariq_cold': { speaker: "Tariq", text: "He looks at you for a beat.\n\n'You have not earned this seat yet, Doctor. Pull rank, give orders, get results — fine. But do not sit with me and pretend we are the same kind of man at three in the morning when we are not. Not yet.'\n\nHe's not angry. He's honest. He goes back to his cigarette.", choices: [
        { text: "Walk away.", onSelect: () => { gameState.trustTariq -= 1; closeDialogue(); } }
    ]},

    'ch1_tariq_checkin': { speaker: "Tariq", text: "A small smile.\n\n'Doctor. In twelve years of working digs I have never been checked on by the academic. This is a new experience for me. I will remember it.'\n\nHe offers you a cigarette. You wave it off. He puts the pack away.\n\n'Go do whatever you were going to do. Come find me later.'", choices: [
        { text: "Nod.", onSelect: () => closeDialogue() }
    ]},

    'ch1_tariq_grandfather': { speaker: "Tariq", text: "He lights his cigarette from the brazier with the old trick of holding the tip against the coal instead of the flame.\n\n'My grandfather worked on the Giza team in 1954. Before the current boundaries. Before the ministry cared as much as they do now. He was a foreman, like me. He worked for a British archaeologist — a woman — who was, he said, the only foreigner on the plateau who called him by his name and not \"boy.\"\n\n'They opened a tunnel in the eastern quadrant. My grandfather told me the story of what was in that tunnel exactly one time, when I was fourteen. He never told it again. He said telling it once had been enough to satisfy the obligation.'", choices: [
        { text: "'What was in the tunnel?'", onSelect: () => startDialogue('ch1_tariq_grandfather_tunnel') },
        { text: "'What happened to the archaeologist?'", onSelect: () => startDialogue('ch1_tariq_grandfather_her') }
    ]},

    'ch1_tariq_grandfather_tunnel': { speaker: "Tariq", text: "He looks at the fire.\n\n'He said there was a room. In the room there was a stone. On the stone there were marks. He said the marks moved when no one looked. He said he watched the British woman try for three days to sketch them accurately and on the third day she broke her pencil in half and cried, and then laughed, and then did not speak for the rest of the week.\n\n'He said they sealed the tunnel on the fourth day. The British woman wrote a report that said it was an empty antechamber. She made my grandfather sign as witness that the report was accurate. He said he understood why.'\n\nHe takes a long drag. The coal flares.\n\n'He told me this story the day before I started university. He said: \"If you ever find this room again, do not trust what the stone tells you. But do not lie about what you saw, either. Write the truth in a place only you can find it. That is the compromise I made. It is a good compromise.\"'", choices: [
        { text: "Stare into the fire.", onSelect: () => { decreaseSanity(1.0); gameState.knowledgeCodex += 3; gameState.knowledgeAtlantean += 1; gameState.flags.Tariq_Grandfather_Story = true; gameState.flags.Tariq_Grandfather_Story_Told = true; gameState.flags.tariq_grandfather_full = true; gameState.trustTariq += 2; startDialogue('ch1_tariq_grandfather_close'); } }
    ]},

    'ch1_tariq_grandfather_her': { speaker: "Tariq", text: "'She went back to England. She stopped publishing. She died in 1972 in a hospice in Cornwall. My grandfather visited her three times in those eighteen years. He never explained to my grandmother why he was flying to England.\n\n'He said she was the only person on the surface who also knew, and she needed to be visited by someone who knew.'\n\nHe taps ash into the fire.\n\n'When she died, he did not go to the funeral. He said the funeral would be full of people who did not understand her. He sat on her grave a month later, alone, for an afternoon. He told me this is what you do when someone else has carried the same weight with you.\n\n'I thought about this a lot after Doctor Okafor died in Saqqara. I considered flying to Lagos. I did not. I regret that I did not.'", choices: [
        { text: "'It's not too late.'", onSelect: () => { gameState.trustTariq += 2; gameState.flags.Tariq_Grandfather_Story = true; gameState.flags.Tariq_Grandfather_Story_Told = true; gameState.flags.tariq_grandfather_full = true; startDialogue('ch1_tariq_grandfather_close'); } },
        { text: "Don't say anything. Just listen.", onSelect: () => { gameState.trustTariq += 1; gameState.flags.Tariq_Grandfather_Story = true; gameState.flags.Tariq_Grandfather_Story_Told = true; gameState.flags.tariq_grandfather_full = true; startDialogue('ch1_tariq_grandfather_close'); } }
    ]},

    'ch1_tariq_grandfather_close': { speaker: "Tariq", text: "He stubs out the cigarette on the rim of the brazier. The ember vanishes.\n\n'I tell you this because I think you are about to find my grandfather's room again. Or one like it. The ground has that feeling.\n\n'Do not trust what the stone tells you. But do not lie about what you saw.'\n\nHe stands up.\n\n'Back to work.'", choices: [
        { text: "Stand up with him.", onSelect: () => closeDialogue() }
    ]},

    // ---- MINISTRY INSPECTOR — external pressure before the collapse ----
    'ch1_inspector': { speaker: "System", text: "A white Land Cruiser with Ministry plates is parked at the edge of the site. A man in a pressed khaki uniform is standing beside it, smoking, watching the camp. He has been there for at least an hour.\n\nInspectors do not drive out to illegal digs in the desert at 2 AM unless someone told them to.", choices: [
        { text: "Approach him directly.", onSelect: () => startDialogue('ch1_inspector_approach') },
        { text: "Hide in the tent and wait him out.", onSelect: () => startDialogue('ch1_inspector_hide') },
        { text: "Send Tariq to talk to him.", onSelect: () => {
            if (gameState.trustTariq >= 3) { startDialogue('ch1_inspector_tariq'); }
            else { startDialogue('ch1_inspector_tariq_refuses'); }
        }}
    ]},

    'ch1_inspector_approach': { speaker: "Inspector Mahfouz", text: "He watches you cross the sand. He does not offer his hand.\n\n'Doctor Vance. Ibrahim Mahfouz, Ministry of Antiquities.'\n\nHe knows your name. That is the first bad sign.\n\n'I have been asked to verify whether the survey permit you filed for this site in March covers active excavation. It does not. It covers ground-penetrating radar survey only.'\n\nHe lets that hang.\n\n'I am prepared to make a judgment call about what I am willing to have seen here tonight. Help me make it.'", choices: [
        { text: "Offer 1000 EGP.", onSelect: () => {
            if (gameState.funds >= 1000) {
                gameState.funds -= 1000;
                gameState.flags.inspector_bribed = true;
                gameState.flags.inspector_dealt = true;
                startDialogue('ch1_inspector_bribe');
            } else { alert("You don't have 1000 EGP."); }
        }},
        { text: "'We found nothing. Just sand.'", onSelect: () => { gameState.flags.inspector_dealt = true; startDialogue('ch1_inspector_lie'); } },
        { text: "'The permit was filed under my donor's name, not mine. Take it up with him.'", onSelect: () => { gameState.flags.inspector_dealt = true; startDialogue('ch1_inspector_donor'); } },
        { text: "Tell him the truth.", onSelect: () => { gameState.flags.inspector_dealt = true; startDialogue('ch1_inspector_truth'); } }
    ]},

    'ch1_inspector_bribe': { speaker: "Inspector Mahfouz", text: "The notes disappear into his jacket without being counted.\n\n'I did not drive out here. You did not dig this week. We understand each other.'\n\nHe crushes his cigarette in the sand.\n\n'I would advise you to find what you are looking for tonight. I cannot come out here a second time.'\n\nHe gets in the Land Cruiser and leaves. You have bought yourself exactly one night.", choices: [
        { text: "Watch him drive off.", onSelect: () => { updateHUD(); decreaseSanity(0.5); closeDialogue(); } }
    ]},

    'ch1_inspector_lie': { speaker: "Inspector Mahfouz", text: "He looks at you. He looks at the generator. He looks at the tracks in the sand leading to the east trench. He looks back at you.\n\n'Doctor Vance. You are an educated man. Please do not waste my time pretending I am not one also.'\n\nHe sighs.\n\n'I will file my report in the morning. It will be processed in approximately seventy-two hours. Use the time.'\n\nHe gets in the Land Cruiser and leaves.", choices: [
        { text: "Watch him drive off.", onSelect: () => { gameState.repMinistry -= 2; closeDialogue(); } }
    ]},

    'ch1_inspector_donor': { speaker: "Inspector Mahfouz", text: "A very long pause. He looks at you differently now.\n\n'Doctor. You do not know who your donor is. If you did, you would not have offered me that name.'\n\nHe gets in his vehicle. He does not drive away immediately. He sits for a minute, looking at the steering wheel.\n\nThen he leaves.\n\nYou have the distinct impression that he has gone to file a very different kind of report than the one he was intending to file.", choices: [
        { text: "Stare after him.", onSelect: () => { gameState.knowledgeHermetic += 2; decreaseSanity(1.0); closeDialogue(); } }
    ]},

    'ch1_inspector_truth': { speaker: "Inspector Mahfouz", text: "He listens. He does not interrupt. When you finish, he does not respond for a long time.\n\nThen:\n\n'My father was Ministry also. He died in 1998. He once told me that the plateau has more secrets than the Ministry has files. He also told me that most of the secrets are not ours to keep, but that we keep them anyway.\n\n'I am not going to stop you tonight. But I am going to file a report tomorrow, because that is my job. You have until I file. Use the time well.'\n\nHe walks back to his vehicle. Before he gets in, he looks back once.\n\n'Doctor. Be careful what you bring up.'", choices: [
        { text: "Nod.", onSelect: () => { gameState.repMinistry += 1; gameState.knowledgeCodex += 1; closeDialogue(); } }
    ]},

    'ch1_inspector_hide': { speaker: "System", text: "You duck into the tent. The inspector finishes his cigarette, grinds it into the sand, and waits another twenty minutes.\n\nThen he knocks on the tent flap.\n\n'Doctor Vance. I know you are inside. This is unprofessional of both of us. Please come out.'", choices: [
        { text: "Go out.", onSelect: () => startDialogue('ch1_inspector_approach') }
    ]},

    'ch1_inspector_tariq': { speaker: "System", text: "Tariq walks out to the Land Cruiser without asking you what to say. He speaks with the inspector in Arabic for approximately four minutes. You cannot hear the words.\n\nAt one point they both laugh.\n\nThen Tariq walks back. The Land Cruiser leaves.\n\n'He is my cousin's wife's brother. We have reached an understanding. You owe him a bottle of Scotch next time you are in Cairo, and you owe me three hours of sleep, which I will collect on Saturday.'", choices: [
        { text: "'Thank you, Tariq.'", onSelect: () => { gameState.trustTariq += 2; gameState.flags.inspector_dealt = true; increaseSanity(1.0); closeDialogue(); } }
    ]},

    'ch1_inspector_tariq_refuses': { speaker: "Tariq", text: "Tariq looks at you like you have just asked him to carry your bags.\n\n'Doctor. I am your foreman. I am not your bagman. You want the Ministry handled, you handle the Ministry. Or you pay me thirty percent more and we have a new arrangement.'\n\nHe walks back to the brazier.", choices: [
        { text: "Go deal with the inspector yourself.", onSelect: () => startDialogue('ch1_inspector_approach') }
    ]},

    // ---- NIGHT WATCH — quiet perimeter moment, foreshadowing ----
    'ch1_night_watch': { speaker: "System", text: "The far edge of the site. Past the floodlights. The sand here is cold enough to see your breath.\n\nThe sky is so clear that the horizon looks fake — too clean a line between the desert and the stars. Orion is high. The Pleiades are where they should be. The moon is a fingernail.\n\nFor a second, standing here, the whole thing feels manageable. Just a job. Just a site.\n\nThen you notice the sand at your feet has a pattern in it. Not wind-made. Deliberate. Three concentric circles. Something walked out here earlier tonight and drew them.", choices: [
        { text: "Crouch and examine the pattern.", onSelect: () => { decreaseSanity(1.5); gameState.knowledgeAtlantean += 2; gameState.flags.night_watch_done = true; startDialogue('ch1_night_watch_examine'); } },
        { text: "Sweep it smooth with your boot.", onSelect: () => { gameState.flags.night_watch_done = true; startDialogue('ch1_night_watch_sweep'); } },
        { text: "Photograph it and leave it.", onSelect: () => { gameState.knowledgeCodex += 2; gameState.flags.night_watch_done = true; startDialogue('ch1_night_watch_photo'); } }
    ]},

    'ch1_night_watch_examine': { speaker: "System", text: "Up close, the circles are exact. No compass made these — the lines are too consistent.\n\nAnd they are recent. The edges are still sharp. Within the last hour.\n\nThe innermost circle has a single glyph drawn in its center. You recognize it. It is one of the glyphs on the Codex — specifically, the one that has been shifting most often on the tablet's surface.\n\nSomething in this desert knows what is in your tent.", choices: [
        { text: "Stand up slowly and walk back to camp.", onSelect: () => { decreaseSanity(1.0); closeDialogue(); } }
    ]},

    'ch1_night_watch_sweep': { speaker: "System", text: "You scrape your boot through the circles. The sand smooths. The pattern is gone.\n\nYou tell yourself this was the right thing to do. You tell yourself this three times.\n\nWalking back toward the floodlights, you notice — in your peripheral vision, not quite looking — that the pattern appears to have reformed behind you.\n\nYou do not turn around.", choices: [
        { text: "Keep walking.", onSelect: () => { decreaseSanity(1.5); closeDialogue(); } }
    ]},

    'ch1_night_watch_photo': { speaker: "System", text: "The flash on your phone catches it cleanly. Three circles, center glyph.\n\nWhen you review the photo back at the tent, the glyph in the center is different from the one you thought you saw.\n\nWhen you review it again thirty seconds later, it is different again.\n\nThe photograph is doing it now too.", choices: [
        { text: "Close the app. Don't look again tonight.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } }
    ]},

    // Zone gates — mission-locked passages
    'zone_dig_gate': { speaker: "System", text: "The excavation perimeter rope. A hand-painted sign: 'AUTHORISED PERSONNEL ONLY BEYOND THIS POINT — FOREMAN HASSAN.'\n\nYou haven't dealt with the three site issues yet. The crew is watching.", choices: [
        { text: "Not yet.", onSelect: () => closeDialogue() }
    ]},
    'ch1_tunnel_gate': { speaker: "System", text: () => {
        if (!gameState.flags.scene3Triggered) return "The tunnel mouth. Timber bracing, amber-lit depth below. It pulls at you.\n\nNot yet. You still have things to resolve on the surface.";
        return "The tunnel mouth is open. Sam's notes said the depth was approximately forty meters.\n\nYou feel the vibration through your boots. The same rhythm as the trench, the supply path, the generator. It's stronger here.\n\nThis is the way in.";
    }, choices: [
        { text: () => gameState.flags.scene3Triggered ? "Step forward. Let the ground decide." : "Not yet.", onSelect: () => {
            if (gameState.flags.scene3Triggered) { startDialogue('scene3_start'); }
            else closeDialogue();
        }}
    ]},

    // =========================================================
    // ========= DOOR TRIGGERS & INTERIOR SCENES ===============
    // =========================================================

    // int_exit — universal exit node for all buildings
    'int_exit': { speaker: "System", text: "You step back outside.", choices: [
        { text: "Leave.", onSelect: () => { closeDialogue(); exitBuilding(); } }
    ]},

    // ---- DOOR TRIGGERS (exterior → enterBuilding) ----
    'door_tent':      { speaker: "System", text: "You push aside the tent flap.", choices: [{ text: "Enter.", onSelect: () => { closeDialogue(); enterBuilding('INT_TENT', 960, 1460); } }]},
    'door_foreman':   { speaker: "System", text: "The foreman's office. A converted cargo container, somehow both hot and damp.", choices: [{ text: "Enter.", onSelect: () => { closeDialogue(); enterBuilding('INT_FOREMAN', 420, 1356); } }]},
    'door_dorm':      { speaker: "System", text: "The worker dormitory. Canvas walls, rows of cots. The smell of people not sleeping.", choices: [{ text: "Enter.", onSelect: () => { closeDialogue(); enterBuilding('INT_DORM', 160, 1356); } }]},
    'door_safehouse': { speaker: "System", text: "The old man nods you through. Behind the coffee stall is a low door.", choices: [
        { text: "Give the password.", onSelect: () => {
            if (gameState.flags.marketPassword) { closeDialogue(); enterBuilding('INT_SAFEHOUSE', 1100, 1510); }
            else { startDialogue('ch3_coffee_fail'); }
        }},
        { text: "Rest at the brazier.", onSelect: () => attemptRest('ch3_coffee_stall') },
        { text: "Walk away.", onSelect: () => closeDialogue() }
    ]},
    'door_hookah':    { speaker: "System", text: "Warm air and apple smoke drift through the curtain.", choices: [{ text: "Enter.", onSelect: () => { closeDialogue(); enterBuilding('INT_HOOKAH', 1825, 530); } }]},
    'door_hangar':    { speaker: "System", text: "The hangar doors are cracked open just enough.", choices: [{ text: "Slip through.", onSelect: () => { closeDialogue(); enterBuilding('INT_HANGAR', 1000, 560); } }]},
    'door_tariq_flat':{ speaker: "System", text: "The flat is on the ground floor of a 1960s block. The door is unlocked.", choices: [
        { text: "Enter.", onSelect: () => {
            if (gameState.trustTariq >= 5) { closeDialogue(); enterBuilding('INT_TARIQ_FLAT', 170, 1630); }
            else { startDialogue('ch5_tariq_flat_locked'); }
        }}
    ]},
    'door_halberd':   { speaker: "System", text: "A nondescript office adjacent to the hangar. No nameplate. A light on inside.", choices: [{ text: "Knock and enter.", onSelect: () => { closeDialogue(); enterBuilding('INT_HALBERD', 1680, 1530); } }]},

    // ---- INTERIOR SCENES: TENT ----
    'int_tent_cot': { speaker: "Ellis", text: "The sleeping bag has been slept in maybe four times in three weeks. You keep falling asleep at the desk.\n\nSam used to say you treated rest like a budget item — something to cut when things got tight.\n\nHe wasn't wrong.", choices: [
        { text: "Lie down for a moment.", onSelect: () => attemptRest('int_tent_cot') },
        { text: "Leave it.", onSelect: () => closeDialogue() }
    ]},
    'int_tent_photos': { speaker: "System", text: "Three photographs tacked to the canvas. One is the Giza plateau from the air, printed from a satellite image. One is a section of the Codex — a photo you took before you understood what you were looking at.\n\nThe third is a candid from a conference in Berlin. You and Sam, both holding glasses of wine, both mid-laugh at something the camera missed.\n\nYou don't remember taking this one down from your office wall.", choices: [
        { text: "Leave them up.", onSelect: () => { increaseSanity(1.0); gameState.flags.memorializedPartner = true; closeDialogue(); } }
    ]},

    // ---- INTERIOR SCENES: FOREMAN'S OFFICE ----
    'int_foreman_desk': { speaker: "System", text: "The desk of a man who has been managing academics in the field for twenty years. Every surface is covered in the specific sediment of organized chaos: supply sheets, crew timesheets, a half-eaten granola bar still in its wrapper.\n\nUnder the granola bar: a handwritten note in Arabic. You can read enough to get the shape of it.\n\n'The British one found it on Day 17. Tell no one until we know what it is. — Hassan'", choices: [
        { text: "Memorize it and replace everything.", onSelect: () => { gameState.knowledgeHermetic += 1; closeDialogue(); } }
    ]},
    'int_foreman_manifest': { speaker: "System", text: "The equipment manifest. Twelve pages. Standard excavation gear, power systems, survey tools.\n\nPage 11: a line item that doesn't fit. 'Containment case: 70cm x 30cm x 20cm, foam-lined, biometric seal.' Not listed under any crew member's name.\n\nSomebody ordered a case to carry something specific before the dig even started.", choices: [
        { text: "Note it.", onSelect: () => { gameState.knowledgeHermetic += 2; closeDialogue(); } }
    ]},
    'int_foreman_sam': { speaker: "System", text: "A manila folder with SAM OKAFOR written in black marker. Inside: printouts of Sam's previous field reports. Saqqara. The 2021 Sudan dig. The Istanbul conference paper on pre-dynastic substrate mapping.\n\nSomebody on this crew pulled Sam's file before the dig started.\n\nSomebody was researching Sam.", choices: [
        { text: "Take the folder.", onSelect: () => { decreaseSanity(1.5); gameState.knowledgeHermetic += 3; if (!gameState.inventory.includes('Sam_File')) { gameState.inventory.push('Sam_File'); updateHUD(); } closeDialogue(); } }
    ]},
    'int_foreman_cork': { speaker: "System", text: "A corkboard with site maps, crew schedules, and a printed photograph pinned to the corner — aerial view of the site at night, taken from height, showing the excavation lit up.\n\nThe timestamp on the photograph is from three days before the dig was authorized.\n\nSomebody was photographing this site before the permit was filed.", choices: [
        { text: "Photograph it.", onSelect: () => { gameState.knowledgeHermetic += 2; decreaseSanity(0.5); closeDialogue(); } }
    ]},

    // ---- INTERIOR SCENES: WORKER DORM ----
    'int_dorm_worker': { speaker: "Worker", text: "He is sitting on the edge of his cot, still fully dressed, boots on. He has not been sleeping.\n\n'Doctor. I am glad you came.'\n\nHis name is Osman. He has worked digs for fifteen years.\n\n'I want to tell you something and I want you to not react in a way that makes the other men lose their nerve. Can you do that?'\n\n'Yes.'\n\n'Three nights ago I heard my mother's voice from below the east trench. My mother has been dead for eleven years. She was singing the song she always sang when she cooked.\n\n'I did not go toward it. I want you to know that I did not go toward it. But some of the younger men have been going toward it. In their sleep.'", choices: [
        { text: "'Thank you for telling me.'", onSelect: () => { decreaseSanity(1.0); gameState.knowledgeAtlantean += 2; gameState.trustTariq += 1; closeDialogue(); } },
        { text: "'Has anyone gone missing?'", onSelect: () => startDialogue('int_dorm_missing') }
    ]},
    'int_dorm_missing': { speaker: "Worker", text: "He looks at you a long time before answering.\n\n'Farid from the night crew. Three nights ago. We found him in the morning at the far edge of the site, asleep sitting up, facing east. He did not remember walking there.\n\n'He quit that day. He said the dig is over a mouth.'\n\nHe pauses.\n\n'He is not a superstitious man, Doctor. That is why I am telling you.'", choices: [
        { text: "Stay with him a moment.", onSelect: () => { decreaseSanity(1.5); gameState.knowledgeAtlantean += 2; closeDialogue(); } }
    ]},
    'int_dorm_talisman': { speaker: "System", text: "A small blue glass eye on a cord, tied to the frame of the cot. Standard protection against the evil eye — you have seen them everywhere in Cairo.\n\nBut this one has been hung so it faces down, toward the ground. Not outward toward people.\n\nToward whatever is below.", choices: [
        { text: "Leave it exactly as it is.", onSelect: () => { gameState.knowledgeAtlantean += 1; closeDialogue(); } }
    ]},
    'int_dorm_graffiti': { speaker: "System", text: "Arabic words scratched into the canvas wall with a knife or tent peg. Your Arabic reaches:\n\n'It listens when you name the dead.'\n\nBelow it, in different handwriting, a response:\n\n'Then do not name them here.'", choices: [
        { text: "Step back.", onSelect: () => { decreaseSanity(1.0); gameState.knowledgeAtlantean += 1; closeDialogue(); } }
    ]},

    // ---- INTERIOR SCENES: HOOKAH LOUNGE ----
    'int_hk_stranger': { speaker: "Stranger", text: "He has been here longer than you. He does not look up when you sit nearby.\n\nOn the table in front of him: a small notebook, open. The page is covered in a symbol repeated over and over — the three-pupil eye from the market graffiti.\n\nWhen he finally looks up, his eyes are ordinary. He is, you judge, in his forties, local, not threatening.\n\n'You are the archaeologist. The one who found something.'\n\nNot a question.\n\n'Many people found things on that site over the years. They did not all know what to do with what they found. You, I think, know.'\n\nHe closes the notebook.\n\n'The woman upstairs has been waiting for someone who knows. Go and see her.'", choices: [
        { text: "'Who are you?'", onSelect: () => startDialogue('int_hk_stranger_who') },
        { text: "Go upstairs.", onSelect: () => { gameState.knowledgeHermetic += 2; closeDialogue(); } }
    ]},
    'int_hk_stranger_who': { speaker: "Stranger", text: "'My name is not important. I am the third layer of the door. There is always a third layer. You passed the first two — the market, the vendor. You are here. That is what matters.'\n\nHe picks up his tea and goes back to the notebook.", choices: [
        { text: "Go find Yusra.", onSelect: () => { gameState.knowledgeHermetic += 1; closeDialogue(); } }
    ]},
    'int_hk_symbol': { speaker: "System", text: "The three-pupil eye, carved directly into the wall plaster rather than painted. Old — predates this building by decades at minimum.\n\nThe Order has been using this location for a long time.", choices: [
        { text: "Trace it with your finger.", onSelect: () => { gameState.knowledgeHermetic += 1; closeDialogue(); } }
    ]},

    // ---- INTERIOR SCENES: HANGAR ----
    'int_hng_note': { speaker: "System", text: "A handwritten note tacked to a support beam, in English:\n\n'If you are reading this, you came from below. If you came from below, you already know what this is about. The question is not what you found. The question is what you are going to do about it.\n\n'Make a decision before you walk into that room. Uncertainty is not a negotiating position.\n\n— R.H.'\n\nThe initials match Halberd's first name. He left this here for you.", choices: [
        { text: "Take it.", onSelect: () => { gameState.knowledgeHermetic += 1; closeDialogue(); } }
    ]},

    // ---- INTERIOR SCENES: TARIQ'S FLAT ----
    'int_tf_sister': { speaker: "Amira", text: "She doesn't speak English. But she puts a plate of eggs and bread in front of you without being asked, and when you try to thank her she waves it off with the specific efficiency of a woman who has been holding a family together since she was old enough to hold things.\n\nShe watches you eat. Once, she says something in Arabic.\n\nTariq translates quietly: 'She says you look like someone who has been very far away for a long time and is still not back yet.'", choices: [
        { text: "Eat slowly.", onSelect: () => { increaseSanity(2.0); closeDialogue(); } }
    ]},
    'int_tf_shoebox': { speaker: "System", text: () => {
        if (gameState.flags.tariqFlatVisited) {
            return "The shoebox is back under the bed. The carved eye is back inside it. Tariq put it away after you gave it back.\n\nYou can see the outline of it through the cardboard.";
        }
        return "Under the bed, half-visible. You don't touch it — that's Tariq's to show you, not yours to take.";
    }, choices: [{ text: "Leave it.", onSelect: () => closeDialogue() }]},
    'int_tf_photos': { speaker: "System", text: "A row of framed photographs above the kitchen counter. Tariq at various ages — teenager, young man, middle-aged — always at the edge of the frame, always slightly turned away from the camera.\n\nIn the middle photo he is standing on a dig site, maybe twenty years ago. He is the only one not smiling. He is looking at the ground.\n\nThe ground, you now recognize, is the Giza plateau.", choices: [
        { text: "Look at the others.", onSelect: () => { gameState.trustTariq += 1; gameState.knowledgeAtlantean += 1; closeDialogue(); } }
    ]},

    // ---- INTERIOR SCENES: HALBERD'S OFFICE ----
    'int_hlb_files': { speaker: "System", text: "The filing cabinet is unlocked. Inside: folders arranged by year going back to 1987.\n\nEach folder contains the same structure — a location (Giza, Saqqara, Memphis, Dashur), a date, a name, and a three-word assessment. You flip through several:\n\n'Did not survive. Unsuitable.'\n'Left immediately. Unsuitable.'\n'Found nothing. Unsuitable.'\n'Saqqara 2022 — OKAFOR, SAMUEL. Assessment: Suitable. Status: Deceased.'\n\nBelow Sam's folder: 'Giza 2024 — VANCE, ELLIS. Assessment: Suitable. Status: Active.'", choices: [
        { text: "Put the folders back exactly as they were.", onSelect: () => { decreaseSanity(2.0); gameState.knowledgeHermetic += 4; gameState.flags.Saqqara_Was_Arranged = true; closeDialogue(); } }
    ]},
    'int_hlb_window': { speaker: "System", text: "Frosted glass. You can see the shape of the hangar through it — the factions moving around inside, guns still technically holstered.\n\nHalberd has been watching the standoff from in here. Waiting for you to come through it.\n\nHe knew you would come through it.", choices: [
        { text: "Turn away from the window.", onSelect: () => closeDialogue() }
    ]},

    // =========================================================
    // ============= END DOOR TRIGGERS & INTERIORS =============
    // =========================================================


    // --- SCENE 3: THE COLLAPSE ---
    'scene3_start': { speaker: "System", text: "A CRACK travels under the tent. A sound like a bone breaking as long as a football field.\n\nThe floor tilts five degrees. Cups shatter. A massive tremor rocks the basin. The ground beneath the entire excavation site is giving way. You have seconds.", choices: [
        { text: "Grab the Codex.", onSelect: () => { if(!gameState.inventory.includes('The Codex')) gameState.inventory.push('The Codex'); gameState.currentRoute = 'SECRET'; }, nextScene: 'scene4_secret' },
        { text: "Grab the Radio.", onSelect: () => { if(!gameState.inventory.includes('Radio')) gameState.inventory.push('Radio'); gameState.currentRoute = 'CUTTHROAT'; gameState.flags.Someone_Knew_To_Listen = true; }, nextScene: 'scene4_cutthroat' },
        { text: "Grab the Journal.", onSelect: () => { if(!gameState.inventory.includes('Field_Journal_Complete')) gameState.inventory.push('Field_Journal_Complete'); gameState.currentRoute = 'TRAP'; }, nextScene: 'scene4_trap' }
    ]},

    // --- SCENE 4: THE BRANCHING FALL ---
    'scene4_secret': { speaker: "System", text: "You lunge, wrap both arms around the tablet, and haul it against your chest. It's heavier than it should be - the weight of a curled-up child. It pulses once against your ribs.\n\nYou fall through pulverized sand and fractured limestone. Your shoulder hits something hard. You black out.\n\nYou wake to an amber light seeping from geometric channels in a stone floor. Pillars are carved with glyphs older than humanity.", choices: [{ text: "Stand up.", onSelect: () => { decreaseSanity(1.0); gameState.flags.Secret_Route_Entered = true; gameState.knowledgeCodex += 3; gameState.flags.Non_Human_Architect_Suspected = true; loadChapterTwo(); } }] },
    'scene4_cutthroat': { speaker: "System", text: "You snatch the radio off the desk and hold down the broadcast button as the floor falls away. You land on a shelf of collapsed limestone ten meters down.\n\nThe radio is live. A woman's voice answers: 'Vance. Stay where you are. We're ninety seconds out.' You did not tell this voice where you are.", choices: [ { text: "Tell her the Codex is gone.", onSelect: () => { gameState.trustTariq += 1; loadChapterTwo(); } }, { text: "Demand she pull Tariq up first.", onSelect: () => { gameState.trustTariq += 2; loadChapterTwo(); } } ]},
    'scene4_trap': { speaker: "System", text: "You grab the journal. All your notes. The Codex sketch. As you clutch it, the east wall of the tent rips open, revealing a stone door carved with glyphs that was not there an hour ago.\n\nYou dive for the exposed door as the floor falls away. It has no handle, only a hand-shaped depression with seven joints per finger.", choices: [{ text: "Press your hand into it.", onSelect: () => { decreaseSanity(1.0); loadChapterTwo(); } }]},

    // --- CHAPTER 2 TRAP ROUTE — FULL ---

    'ch2_start_trap': { speaker: "System", text: () => {
        let text = "You land hard on a steep incline of fractured limestone and slide thirty meters before catching yourself on a rusted iron spike driven into the rock.\n\nYou are underground. The ceiling above is forty meters of collapse — sand and timber and the remains of your camp, compressed into rubble. There is no going up.\n\nThe air smells of wet copper and something older. Burned cedar. Calcite. The smell of a sealed room opened for the first time in centuries.\n\nA dim amber glow comes from somewhere to the north. Everything else is dark.";
        if (gameState.flags.Codex_Sketch_Captured) text += "\n\nYour field journal made it. You instinctively check it — sixty pages of sketches, notations, measurements. The Codex sketch is intact. That is something.";
        if (gameState.trustTariq >= 3) text += "\n\nYou call out for Tariq. Silence. Then, from somewhere distant and up: his voice, faint, saying something in Arabic. He made it to the surface. You think.";
        return text;
    }, choices: [{ text: "Get up.", onSelect: () => closeDialogue() }] },

    'ch2_samir': { speaker: "Samir", text: "A man sits cross-legged at the fork in the tunnel, eating from a tin with his fingers. He's perhaps fifty, wearing a deteriorated safari jacket over a striped galabiya. He has the unhurried bearing of a man who has been somewhere a very long time.\n\n'Another one from the surface. They always come through the east collapse. You are the eighth since the season opened.'\n\nHe doesn't ask if you're hurt. He's past that.", choices: [
        { text: "'Who are you?'", onSelect: () => startDialogue('ch2_samir_who') },
        { text: "'Where are the other seven?'", onSelect: () => startDialogue('ch2_samir_seven') },
        { text: "'How do I get out of here?'", onSelect: () => startDialogue('ch2_samir_exit') }
    ]},
    'ch2_samir_who': { speaker: "Samir", text: "'Samir Khalil. I came down with the French expedition in 2019. Surveying party. We found an entrance the city did not want us to find. Four of us went in. I came out of a different place three weeks later. By then, the expedition had moved on.\n\n'The city is... specific about who it keeps. It kept me long enough to learn it. Now I can move through it. Mostly.'\n\nHe offers you a tin of cold ful medames. You realize you're starving.", choices: [
        { text: "Take the food.", onSelect: () => { increaseSanity(1.0); gameState.trustTariq += 1; startDialogue('ch2_samir_food'); } },
        { text: "'The other seven. Where are they?'", onSelect: () => startDialogue('ch2_samir_seven') },
        { text: "'I need to move. Point me toward the exit.'", onSelect: () => startDialogue('ch2_samir_exit') }
    ]},
    'ch2_samir_food': { speaker: "Samir", text: "You eat standing up. Samir watches with the satisfaction of someone who knew you would.\n\n'The city tests patience. It builds labyrinths for people who rush. If you move slowly and let the light guide you, it mostly leaves you alone.'\n\nHe pauses. 'Mostly.'", choices: [
        { text: "'The other seven?'", onSelect: () => startDialogue('ch2_samir_seven') },
        { text: "'How do you survive down here?'", onSelect: () => startDialogue('ch2_samir_survive') },
        { text: "'I need the exit.'", onSelect: () => startDialogue('ch2_samir_exit') }
    ]},
    'ch2_samir_seven': { speaker: "Samir", text: "His expression doesn't change.\n\n'Three made it to the market level. Two made it to a place I cannot follow them. The other two...' He gestures vaguely at the ceiling, at the stone around them. 'The city has a appetite. It does not eat you. It rearranges you. You are still technically alive, probably. Just filed away somewhere.\n\n'I suggest you do not linger at junctions.'", choices: [
        { text: "Ask him about the city's purpose.", onSelect: () => startDialogue('ch2_samir_purpose') },
        { text: "Ask how to get out.", onSelect: () => startDialogue('ch2_samir_exit') }
    ]},
    'ch2_samir_survive': { speaker: "Samir", text: "'The tinned goods from the French supply cache last about a year. This is year five, so I have moved on to what the city produces. There are lichens in the amber-lit chambers. There is water that runs through a specific channel in the southwest. I have not eaten anything that killed me yet.'\n\n'The city provides for inhabitants. I think it likes having someone who knows it. Like a building likes a caretaker.'\n\nHe says this without irony.", choices: [
        { text: "'You think it's alive.'", onSelect: () => startDialogue('ch2_samir_alive') },
        { text: "Ask about the exit.", onSelect: () => startDialogue('ch2_samir_exit') }
    ]},
    'ch2_samir_purpose': { speaker: "Samir", text: "'I have thought about this for five years. Here is what I know. The city was not built by humans. The architecture does not repeat — every room is unique, and they shift. Not fast. Slowly, over months. Like geological movement, but deliberate.\n\n'It was built to contain something, or to present something, or to test something. After five years I lean toward test. You are not lost in the city. You are being evaluated. The question is: evaluated for what?'\n\nHe looks at you steadily. 'You are more prepared than the other seven. You have been studying the surface-side of this place. That is the right preparation. Whatever it is testing for, knowledge is the credential.'", choices: [
        { text: "Ask about the exit.", onSelect: () => { gameState.knowledgeAtlantean += 2; startDialogue('ch2_samir_exit'); } }
    ]},
    'ch2_samir_alive': { speaker: "Samir", text: "'Yes. Or something adjacent to alive. What I know is this: when you move through the city, it notices. The amber light in the channels brightens slightly when you enter a room for the first time. It dims when you return to a room it has shown you before. It is keeping track of whether you are exploring or circling.\n\n'Circling gets you rearranged. Exploring gets you exits.'\n\nHe stands, brushing stone dust from his trousers. 'I have given you as much as I can without walking you through personally. And I cannot walk you through personally.'", choices: [
        { text: "'Why not?'", onSelect: () => startDialogue('ch2_samir_cant') },
        { text: "Ask about the exit.", onSelect: () => startDialogue('ch2_samir_exit') }
    ]},
    'ch2_samir_cant': { speaker: "Samir", text: "'Because the city will not allow me to leave. I have tried forty-three times over five years. Every route that should exit loops back here. Every tunnel that should surface closes just before I reach it.\n\n'I am the caretaker. The city keeps its caretaker. You are a visitor. Visitors are allowed to leave, if they are worthy of it. I have accepted this.'\n\nThere is no self-pity in this. Just the exhausted calm of a man who finished grieving years ago.", choices: [
        { text: "'I'll find a way to get you out.'", onSelect: () => { gameState.trustTariq += 2; gameState.flags.samirAlive = true; gameState.flags.samir_promised_out = true; startDialogue('ch2_samir_promise'); } },
        { text: "'I'm sorry.'", onSelect: () => { increaseSanity(0.5); startDialogue('ch2_samir_exit'); } }
    ]},
    'ch2_samir_promise': { speaker: "Samir", text: "He looks at you for a long moment.\n\n'Seven people have come through. You are the first to say that.'\n\nHe pulls a small folded map from his jacket — hand-drawn, meticulous, over what looks like years of revisions. He holds it out.\n\n'This is everything I know about the southern corridor. It is more detail than any of your surface instruments could provide. Take it.'\n\nHe adds, quietly: 'If you do find a way — the city's northeast chamber has a specific mechanism. I have drawn it on the back. I have never been able to operate it. You might be able to.'", choices: [
        { text: "Take the map.", onSelect: () => { if(!gameState.inventory.includes("Samir's Map")) gameState.inventory.push("Samir's Map"); gameState.knowledgeAtlantean += 3; gameState.flags.samirTalked = true; updateHUD(); startDialogue('ch2_samir_exit'); } }
    ]},
    'ch2_samir_exit': { speaker: "Samir", text: "'Follow the amber channels. Not the bright ones — those are the city showing you what it wants you to see. The dim ones. The channels the light has almost abandoned.\n\n'When you find a junction where all channels dim equally, stop. There will be a floor stone that rings hollow when struck. That is your way forward.\n\n'Take this chisel. The stone was installed from below and can be leveraged up from below. Do not lose the chisel.'\n\nHe presses a heavy iron chisel into your hand. It's warm, inexplicably. Like it's been held.", choices: [
        { text: "Take the chisel.", onSelect: () => { if(!gameState.inventory.includes('Chisel')) gameState.inventory.push('Chisel'); gameState.flags.samirTalked = true; decreaseSanity(0.5); updateHUD(); closeDialogue(); } }
    ]},

    'ch2_mural': { speaker: "System", text: "The entire south wall of this chamber is painted. Not frescoed — painted, in pigments that should not have survived this long, in colours that should not exist in a pigment made from natural materials.\n\nThe subject is a city — specifically this city — in what appears to be its operational state. Thousands of small figures move through amber-lit corridors. But the scale is wrong. The figures are not human.\n\nThey are using humans. Guiding them, perhaps. Or farming them, perhaps. The ambiguity seems intentional.\n\nAt the bottom of the mural, painted in red ochre over the rest: 'Season 4 — Vance — found it.' Sam's handwriting.", choices: [
        { text: "Study the city's layout in the mural.", onSelect: () => { gameState.knowledgeAtlantean += 3; gameState.knowledgeCodex += 2; gameState.flags.trapMuralRead = true; startDialogue('ch2_mural_study'); } },
        { text: "Focus on Sam's note.", onSelect: () => { gameState.flags.sams_second_dig_known = true; decreaseSanity(1.0); startDialogue('ch2_mural_sam'); } },
        { text: "Photograph it.", onSelect: () => { gameState.knowledgeCodex += 1; if(!gameState.inventory.includes('Mural Photograph')) gameState.inventory.push('Mural Photograph'); closeDialogue(); } }
    ]},
    'ch2_mural_study': { speaker: "System", text: "The city is not a maze. Looking at it from above — which this mural effectively provides — it is a three-dimensional filing system. Every chamber is labeled with a glyph sequence. The amber channels are pneumatic tubes. The 'traps' are sorting mechanisms.\n\nYou are not a person being tested. You are a document being processed.\n\nThe only question is: what category do you end up filed in?", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'ch2_mural_sam': { speaker: "System", text: "'Found it.' Past tense. Sam was here before you — not this season, but in a previous season, in a previous life that he never told you about.\n\nThe paint is dry. The ochre has oxidised slightly at the edges. This was written at least a year ago. Possibly two.\n\nSam came down here, survived, got out, went back to Oxford, and applied for a joint dig permit with you. He knew exactly what was down here. He knew exactly what he was bringing you to find.\n\nHe is dead. He cannot tell you why.", choices: [
        { text: "Try not to spiral.", onSelect: () => { decreaseSanity(0.5); gameState.flags.sam_was_here_first = true; closeDialogue(); } }
    ]},

    'ch2_whispers': { speaker: "System", text: "The chamber is small and entirely smooth — floor, walls, ceiling, all polished basalt. No carvings. No channels. No amber light.\n\nBut there is sound.\n\nNot from the stone. From the air. Or from the space the air occupies. A murmur at the edge of hearing that, when you hold your breath, assembles into recognisable patterns. Not language. Almost language. The shape of language without the specific content.\n\nYour brain begins involuntarily trying to decode it. This hurts.", choices: [
        { text: "Listen harder.", onSelect: () => { decreaseSanity(2.5); gameState.knowledgeAtlantean += 3; startDialogue('ch2_whispers_listen'); } },
        { text: "Block your ears and walk through fast.", onSelect: () => { decreaseSanity(0.5); gameState.flags.trapWhispersHeard = true; closeDialogue(); } },
        { text: "Speak aloud to break the pattern.", onSelect: () => { decreaseSanity(1.0); gameState.knowledgeCodex += 1; gameState.flags.trapWhispersHeard = true; startDialogue('ch2_whispers_speak'); } }
    ]},
    'ch2_whispers_listen': { speaker: "System", text: "You stand still and let it in.\n\nFor perhaps a minute. Then five. You are not sure how long.\n\nWhen you move again, three things have changed: you know — intuitively, without knowing how you know — the specific sequence of glyphs that unlocks the city's northeast chamber. You know it the way you know your own name. You also have a nosebleed, and you have lost approximately forty minutes of time you cannot account for.\n\nThe amber channel near the exit is slightly brighter than when you entered.", choices: [
        { text: "Move on.", onSelect: () => { gameState.flags.trapWhispersHeard = true; gameState.flags.city_sequence_known = true; closeDialogue(); } }
    ]},
    'ch2_whispers_speak': { speaker: "System", text: "Your voice comes out higher than expected — an effect of the smooth walls and the tight space. You say your name and the date and the grid reference of the excavation site, out of force of habit.\n\nThe murmuring stops instantly. Total silence.\n\nThen: one sound. A single soft tone, like a tuning fork struck once, that fades over fifteen seconds. You feel it more than hear it. When it fades, the room feels lighter. Emptier. As if something that had been in the room left when you insisted on being real.", choices: [
        { text: "Collect yourself and keep moving.", onSelect: () => { gameState.flags.trapWhispersHeard = true; closeDialogue(); } }
    ]},

    'ch2_bones': { speaker: "System", text: "A skeleton seated in a carved alcove. Its posture is deliberate — back straight, legs folded, hands resting on its knees. This is not someone who fell here. This is someone who sat down here intentionally.\n\nThe alcove around it is carved with small personal glyphs — not Hermetic notation, not standard dynastic script. Something idiosyncratic. Someone's personal shorthand.\n\nAround the skeleton's wrist: a simple copper band with an ankh and the name 'Fouad' scratched in French and Arabic.", choices: [
        { text: "Examine the glyphs carefully.", onSelect: () => { gameState.knowledgeHermetic += 2; startDialogue('ch2_bones_glyphs'); } },
        { text: "Take the copper band.", onSelect: () => { decreaseSanity(0.5); gameState.flags.ch2BonesChecked = true; if(!gameState.inventory.includes("Fouad's Copper Band")) gameState.inventory.push("Fouad's Copper Band"); startDialogue('ch2_bones_take'); } },
        { text: "Leave him in peace.", onSelect: () => { gameState.flags.ch2BonesChecked = true; closeDialogue(); } }
    ]},
    'ch2_bones_glyphs': { speaker: "System", text: "The personal glyphs are a journal — decades of entries compressed into a 60cm alcove. Fouad was a Hermetic scholar, possibly French-Algerian, who found the entrance to this level in the 1970s and chose never to leave.\n\nThe final entry, scratched over the others: 'The city is not a test. It is a mirror. What you bring down here is what it amplifies. If you brought fear, it gives you traps. If you brought curiosity, it gives you libraries. If you brought grief, it gives you ghosts. I brought devotion. It gave me fifty years.'\n\nFouad died here in devotion. He was not afraid.", choices: [
        { text: "Remember this.", onSelect: () => { increaseSanity(1.5); gameState.flags.city_mirror_known = true; gameState.flags.ch2BonesChecked = true; closeDialogue(); } }
    ]},
    'ch2_bones_take': { speaker: "System", text: "The copper band comes off easily. It is warm — warmer than the stone, warmer than the air. Either the metal holds heat differently, or something else is happening.\n\nAs you hold it, the amber channel in the wall brightens very slightly. Then dims back to its normal level.\n\nYou keep moving. The band goes in your pocket.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},

    'ch2_stash': { speaker: "System", text: "A canvas military pack, half-buried under a collapsed section of wall. Someone left it here — or it landed here when they fell.\n\nInside: two tins of sardines, a hand-crank torch, a waterproof notebook with about thirty pages of diagrams — architectural floor plans of sections of this level, annotated in English — and a photograph of a smiling family outside a house somewhere coastal.", choices: [
        { text: "Take the food and torch.", onSelect: () => { increaseSanity(1.5); gameState.flags.ch2StashLooted = true; updateHUD(); startDialogue('ch2_stash_taken'); } },
        { text: "Take the notebook too.", onSelect: () => { gameState.knowledgeAtlantean += 2; gameState.flags.ch2StashLooted = true; if(!gameState.inventory.includes('Abandoned Floor Plans')) gameState.inventory.push('Abandoned Floor Plans'); updateHUD(); startDialogue('ch2_stash_notebook'); } },
        { text: "Leave the pack — someone may need it more than you.", onSelect: () => { increaseSanity(0.5); closeDialogue(); } }
    ]},
    'ch2_stash_taken': { speaker: "System", text: "You eat a tin standing up. The torch works. The notebook you leave.\n\nThe photograph you set face-up on the wall above the pack. It felt like the right thing to do.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'ch2_stash_notebook': { speaker: "System", text: "The floor plans are detailed and correct — you can verify two chambers against what you've already passed through. Whoever made these survived long enough to survey extensively.\n\nThe final page has a single sentence: 'Follow the cold air. There is always cold air near an exit.'\n\nYou tuck the notebook in your pack. The photograph you leave on the wall, face-up.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},

    'ch2_gate': { speaker: "System", text: () => {
        let text = "A stone threshold. Beyond it: a narrow drainage pipe barely large enough to crawl through, angling upward at about fifteen degrees. A faint smell of open air — diesel, cardamom, exhaust, the particular dust smell of Cairo streets — drifts down.\n\nYou have been underground for ";
        if (gameState.flags.trapWhispersHeard) text += "an indeterminate time. The whisper chamber took something from your sense of duration.";
        else text += "what feels like six to ten hours.";
        text += "\n\nThe pipe is forty meters of claustrophobic limestone. You can fit. You are not sure you will be able to turn around if you start.";
        if (gameState.flags.samir_promised_out) text += "\n\nYou think of Samir, who has been down here five years. Who will be here when the pipe closes behind you. You file that thought away and climb in.";
        return text;
    }, choices: [
        { text: "Climb through.", onSelect: () => { gameState.flags.gateUnlocked = true; startDialogue('ch2_gate_crawl'); } }
    ]},
    'ch2_gate_crawl': { speaker: "System", text: () => {
        let exit = "You drag yourself upward for forty minutes of pure claustrophobic dark. Your elbows are bleeding. Your knees are bleeding. Your torch runs out at the thirty-meter mark and you navigate the last ten by feel.\n\nThen: a rectangle of warm electric orange light. A crack in a stone floor. You push up with both hands and a heavy carpet peels back and you are looking at the underside of a rug in a quiet back room of the Khan el-Khalili market.";
        if (gameState.currentRoute === 'TRAP' && gameState.flags.sam_was_here_first) exit += "\n\nSam came out through here. You are certain of it. This was Sam's exit route. Sam sat in the market above you — possibly at the same tea stall, possibly in the same silence — and planned his return to Oxford and said nothing about any of it.";
        if (gameState.inventory.includes("Samir's Map")) exit += "\n\nSamir's map is still in your pocket. You made a promise. You keep that in mind.";
        exit += "\n\nYou pull yourself up and let the rug fall back and sit against the wall and breathe market air for a full minute before you move.";
        return exit;
    }, choices: [{ text: "Enter the market.", onSelect: () => loadChapterThree() }] },

    'puzzle_glyph_fail': { speaker: "System", text: "The panel rejects the sequence. A low grinding sound — something mechanical cocking somewhere behind the stone wall. A dart, cedar-tipped, punches out of a hole at shin height and clatters across the floor.\n\nIt missed. It was very close.\n\nSam's pencilled sequence is still there on the wall. Look again.", choices: [{ text: "Study the sequence more carefully.", onSelect: () => { gameState.knowledgeCodex += 1; closeDialogue(); } }]},
    'puzzle_glyph_solved': { speaker: "System", text: "The four glyphs flash amber in sequence — your sequence. A deep mechanical sound from within the wall, stone on stone, gears that haven't moved in a long time moving.\n\nA panel in the tunnel wall swings inward. A second passage — narrower, lower than the main tunnel, unlit except for the faintest amber seam along the floor.\n\nSam drew the solution. Sam wanted someone specific to find this. The question you can't answer yet: did he mean you, or did he mean anyone who was paying close enough attention to find his pencil marks?", choices: [
        { text: "Go through the second passage.", onSelect: () => { gameState.flags.glyph_lock_solved = true; gameState.flags.Secret_Route_Entered = true; closeDialogue(); } },
        { text: "Note the passage. Take the main tunnel.", onSelect: () => { gameState.flags.glyph_lock_solved = true; closeDialogue(); } }
    ]},
    'puzzle_glyph_already': { speaker: "System", text: "The lock is already open. The mechanism has disengaged. The second passage sits open in the wall.", choices: [{ text: "Continue.", onSelect: () => closeDialogue() }]},

    // --- CHAPTER 2 SECRET ROUTE — FULL ---

    'ch2_start_secret': { speaker: "System", text: () => {
        let text = "You land — not fall, land — in a high-ceilinged chamber of dressed basalt, lit by amber channels that run through every surface in geometric precision. The light is even and warm and absolutely sourceless by any conventional physics.\n\nThe ceiling is seven meters. The walls are carved with a text you cannot read but that your eye keeps trying to parse, the way you might stare at a word until the letters stop making sense.\n\nThe Codex in your arms is pulsing. Slowly. Once every eight seconds, exactly. Like a resting heartbeat.";
        if (gameState.flags.Non_Human_Architect_Suspected) text += "\n\nYou suspected non-human architecture on the surface. What you're standing in confirms it. The proportions are wrong for human habitation. The ceiling is too high. The corridors, visible through three archways, are too smooth. This was not built for people of your size, at your speed.";
        return text;
    }, choices: [{ text: "Set the Codex down and look around.", onSelect: () => { gameState.knowledgeCodex += 1; closeDialogue(); } }] },

    'ch2_amber': { speaker: "System", text: "The amber channel runs along the base of the wall in a groove no wider than your thumb. You kneel to look closer.\n\nThe amber is not light. Or it is not only light. It has a slow viscosity — it moves the way honey moves, pulled along the channel by something below the surface. And it is warm. Warmer than the stone. Almost body temperature.\n\nWhen you hold your palm above it, it brightens slightly. It knows you're there.", choices: [
        { text: "Touch it.", onSelect: () => { if (!gameState.flags.ch2AmberTouched) { increaseSanity(1.5); gameState.knowledgeAtlantean += 2; gameState.flags.ch2AmberTouched = true; gameState.flags.Tablets_Resonated = true; startDialogue('ch2_amber_touch'); } else closeDialogue(); } },
        { text: "Observe without contact.", onSelect: () => { gameState.knowledgeAtlantean += 1; closeDialogue(); } }
    ]},
    'ch2_amber_touch': { speaker: "System", text: "Your fingertip makes contact.\n\nThe channel flares — once, sharp, the whole length of the visible corridor blazing to near-white — then settles back to its normal warm amber.\n\nSomething heard you. Something noted your arrival in a register you can't see.\n\nThe Codex in your pack pulses twice in rapid succession, then returns to its eight-second rhythm. The Second Tablet, if you've found it, harmonizes at four seconds — the spaces between them perfectly interleaved.\n\nYou have just been recognised by a system that has been running for a very long time.", choices: [{ text: "Stand up carefully.", onSelect: () => closeDialogue() }]},

    'ch2_chasm': { speaker: "System", text: "The corridor ends at a stone balustrade overlooking a vertical shaft approximately twenty meters across. You lean over the rail.\n\nThe shaft goes down further than the amber light reaches. Perhaps a hundred meters. Perhaps more. The walls of the shaft are carved with text — the same unreadable script, in characters that gradually get smaller as the shaft goes deeper, as if the closer you get to whatever is at the bottom, the more precisely the language needed to describe it.\n\nAt the very bottom, barely visible: a soft, steady blue-white light that moves.", choices: [
        { text: "Watch the light at the bottom.", onSelect: () => { decreaseSanity(1.5); gameState.knowledgeAtlantean += 2; gameState.flags.ch2ChasmLooked = true; startDialogue('ch2_chasm_watch'); } },
        { text: "Note its depth and move on.", onSelect: () => { gameState.flags.ch2ChasmLooked = true; closeDialogue(); } }
    ]},
    'ch2_chasm_watch': { speaker: "System", text: "You watch for perhaps ten minutes.\n\nThe blue-white light is not static. It moves in slow patterns — complex, non-repeating orbits. It is not a lamp. It is not a reflection. It is a thing, down there, moving deliberately in a space it has been in for longer than your civilisation has existed.\n\nIt does not look up. Probably it cannot look up. Probably the distinction between 'up' and 'toward you' means nothing to it.\n\nProbably.", choices: [{ text: "Step back from the rail.", onSelect: () => closeDialogue() }]},

    'ch2_statue': { speaker: "System", text: "The statue has fallen from its plinth — which is itself telling, because the plinth is intact and the statue's mounting point is intact. It was not knocked over. It stepped off.\n\nThe figure is approximately three meters tall in a recumbent position. It is carved from a single piece of black basalt. The proportions are not human: the torso is too long, the head too large, the hands —\n\nThe hands are the problem. They have seven joints per finger. This is not a sculptor's error. Every detail of this statue is too precise for errors. The hands are accurate.", choices: [
        { text: "Examine the base inscription.", onSelect: () => { gameState.knowledgeAtlantean += 2; gameState.flags.ch2_statue_seen = true; startDialogue('ch2_statue_inscription'); } },
        { text: "Check the plinth.", onSelect: () => { gameState.knowledgeCodex += 1; gameState.flags.ch2_statue_seen = true; startDialogue('ch2_statue_plinth'); } },
        { text: "Move past it quickly.", onSelect: () => { gameState.flags.ch2_statue_seen = true; closeDialogue(); } }
    ]},
    'ch2_statue_inscription': { speaker: "System", text: "The inscription on the base runs in three scripts: the unreadable city-script, Hermetic notation you can partially decode, and — at the bottom, added much later, in what appears to be medieval Arabic — a single sentence:\n\n'Here lies the Custodian who stayed when the others left. It is not dead. It is deciding.'\n\nThe Arabic was added centuries after the statue was carved. Someone else has been down here. Multiple someones. Multiple centuries.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'ch2_statue_plinth': { speaker: "System", text: "The plinth has two depressions — mounting points for the statue's feet. They are polished smooth by contact, which is correct.\n\nBut they are also polished smooth at the edges. As if the statue has stepped on and off this plinth many times.\n\nThe amber channel in the floor near the plinth runs to the statue's position. Not to the plinth. The channel was rerouted — long ago, precisely — to follow the statue to where it chose to lie down.", choices: [{ text: "Back away slowly.", onSelect: () => { decreaseSanity(1.0); closeDialogue(); } }]},

    // --- CHAPTER 2 CUTTHROAT ROUTE — FULL ---

    'ch2_start_cutthroat': { speaker: "System", text: () => {
        let text = "You land on wooden scaffolding — it gives beneath you, one plank splitting — in a cavern the size of a cathedral. The collapse from above has opened a section of the roof. Searchlights cut through from the surface.\n\nBelow you, on a staging platform sixty meters down, a team in black tactical gear is setting up equipment. They move with professional efficiency. They are not surprised by this place. They knew it was here.\n\nA woman detaches from the group and starts climbing the scaffolding toward you. She's moving fast and clean.";
        if (gameState.trustTariq >= 2) text += "\n\nSomewhere above and to your left, on a collapsed limestone ledge, Tariq is watching you. You can't see him but you know he's there. Forty-eight hours of working together gives you a sense of where he positions himself.";
        return text;
    }, choices: [{ text: "Wait for her to reach you.", onSelect: () => startDialogue('ch2_maren') }] },

    'ch2_maren': { speaker: "Maren", text: "She reaches your level and stops two meters away. Late thirties, dust-stained gear, no insignia. Her rifle is slung across her back, not in her hands — this is deliberate.\n\n'Dr. Vance. Maren. We've been contracted to extract the Codex and any supporting material from this level. You're technically trespassing on our operation, but you have surface knowledge we need and there's no exit route you can reach without going through our staging area.'\n\nShe pauses. 'I'm offering a deal. Not asking for one. What you carry stays yours. You walk with us and answer questions when asked. In return you get out of this hole alive.'", choices: [
        { text: "Accept the deal.", onSelect: () => { gameState.trustMaren = 2; startDialogue('ch2_maren_deal'); } },
        { text: "'Who contracted you?'", onSelect: () => startDialogue('ch2_maren_contractor') },
        { text: "'What happens to Tariq?'", onSelect: () => startDialogue('ch2_maren_tariq') },
        { text: "'I'll find my own exit.'", onSelect: () => startDialogue('ch2_maren_refuse') }
    ]},
    'ch2_maren_deal': { speaker: "Maren", text: "'Good. Follow me down.'\n\nShe clips a line to the scaffolding and rappels before you can ask any more questions. Below, the staging team barely glances up when you arrive.\n\nThe cavern is extraordinary. Maren's team has apparently been in operation here for six days — there are survey stakes, cable runs, and what looks like a portable ground-penetrating radar rig. They have mapped a third of this level already.", choices: [{ text: "Follow her down.", onSelect: () => { closeDialogue(); } }]},
    'ch2_maren_contractor': { speaker: "Maren", text: "'Client confidentiality. But I'll tell you this: they've been expecting the Giza subsurface to open since 2018. Someone did the maths on the subsurface pressure anomaly seven years before your dig team noticed it. They were ready.'\n\nShe watches you process that. 'The same answer to your next three questions is also: client confidentiality. Save the interrogation for when we're on the surface.'", choices: [
        { text: "Accept the deal.", onSelect: () => { gameState.trustMaren = 1; startDialogue('ch2_maren_deal'); } },
        { text: "'What happens to Tariq?'", onSelect: () => startDialogue('ch2_maren_tariq') }
    ]},
    'ch2_maren_tariq': { speaker: "Maren", text: "A pause. Brief but visible.\n\n'The Tariq Situation is already handled. He's on the ledge, he's breathing, and one of my people is making sure he stays that way until we're through with the extraction. He goes home after.'\n\nShe meets your eyes. 'I'm not running a body-count operation, Doctor. That costs more money than the client is paying.'", choices: [
        { text: "Accept the deal.", onSelect: () => { gameState.trustMaren = 2; gameState.trustTariq += 1; startDialogue('ch2_maren_deal'); } },
        { text: "'Let me go to him first.'", onSelect: () => startDialogue('ch2_maren_tariq_go') }
    ]},
    'ch2_maren_tariq_go': { speaker: "Maren", text: "'No. His position is covered. You going to him changes the tactical picture in ways I won't allow.'\n\nHer voice has gone flat. This is a line she won't negotiate.\n\n'You can speak to him at the top. I give you my word — which is the only currency that actually spends down here.'", choices: [
        { text: "Accept this.", onSelect: () => { gameState.trustMaren = 1; startDialogue('ch2_maren_deal'); } }
    ]},
    'ch2_maren_refuse': { speaker: "Maren", text: "'Then you have about four hours before the collapse settles and the amber channel shifts redirect themselves away from the surface. After that, you're looking at a week minimum of underground navigation to find the market exit, assuming you know what you're doing.\n\n'If you don't know what you're doing — and you don't, nobody does their first time — you're looking at considerably longer.'\n\nShe shrugs. 'The offer stays open for the next sixty seconds.'", choices: [
        { text: "Accept the deal.", onSelect: () => { gameState.trustMaren = 1; startDialogue('ch2_maren_deal'); } },
        { text: "Walk away. Find your own path.", onSelect: () => { gameState.trustTariq += 3; decreaseSanity(1.5); closeDialogue(); } }
    ]},

    'ch2_boros': { speaker: "System", text: "The largest member of Maren's team is sitting alone against a pillar, eating from an MRE and reading a paperback — Proust, volume two, dog-eared. His rifle is neatly stowed three meters away. He looks up when you approach.\n\n'Doctor.' A Romanian accent, heavily flattened by years abroad. 'You want to understand the amber light. Everyone does the first time.'", choices: [
        { text: "'You've been here before?'", onSelect: () => startDialogue('ch2_boros_before') },
        { text: "'What does the amber light do?'", onSelect: () => startDialogue('ch2_boros_amber') },
        { text: "'Why are you reading Proust down here?'", onSelect: () => startDialogue('ch2_boros_proust') },
        { text: "Leave him to his book.", onSelect: () => closeDialogue() }
    ]},
    'ch2_boros_before': { speaker: "Boros", text: "'Three previous operations. Different subsurface sites in Egypt, once in Malta. The architecture differs — each city is, as far as we can determine, unique. But the amber light is consistent. The non-human proportion is consistent. The sense that you are being processed is consistent.'\n\n'We are paid to not know too much about why. I find knowing too much makes it hard to sleep.'", choices: [
        { text: "'What does your team know that mine doesn't?'", onSelect: () => { gameState.knowledgeAtlantean += 2; startDialogue('ch2_boros_know'); } },
        { text: "Ask about the amber light.", onSelect: () => startDialogue('ch2_boros_amber') }
    ]},
    'ch2_boros_know': { speaker: "Boros", text: "'The client briefs us on structural information — where the stable zones are, what the danger signs look like, what not to touch. The academic content — what it means — we are explicitly not briefed on. Operational security, they say.\n\n'My own theory: they don't want us to develop opinions about it. Opinions lead to hesitation. Hesitation leads to loss of asset.'\n\nHe returns to his book. 'That is all I will say about that.'", choices: [{ text: "Leave him to it.", onSelect: () => closeDialogue() }]},
    'ch2_boros_amber': { speaker: "Boros", text: "'It is a conveyance medium and an information system simultaneously. The client's technical staff gave us a briefing. Essentially: the builders used it as we use electricity and fibre optic cable combined. Power and data in one channel.\n\n'The specific content of the data — what information runs through it, what it says — is not something any surface instrument can decode. We have tried. The client has tried. It runs at a frequency that is not electromagnetic in the conventional sense.'\n\nHe turns a page. 'What I know is this: when I touch it, I feel briefly as if something is recognising me. It is an unusual feeling for a man in my profession.'", choices: [
        { text: "Thank him.", onSelect: () => { gameState.knowledgeAtlantean += 2; increaseSanity(1.0); closeDialogue(); } }
    ]},
    'ch2_boros_proust': { speaker: "Boros", text: "'Because I have read it seven times and it continues to mean something different each time, and because wherever I bring it, it is clearly the wrong book for the location, and I find this funny.'\n\nHe looks at you steadily. 'Also I find that when I am in places that make no human sense, reading something written by a human for humans about purely human concerns is a good way to stay oriented. I recommend it. Whatever you have that is purely human and purely your own — hold onto it.'", choices: [
        { text: "Think about that.", onSelect: () => { increaseSanity(1.5); closeDialogue(); } }
    ]},

    'ch2_scaffolding': { speaker: "System", text: "The route out runs across thirty meters of wooden scaffolding rigged over a void. Maren's team crosses it with practiced efficiency, one at a time, spaced ten meters apart.\n\nWhen your turn comes, you step onto the first plank. The scaffolding sways gently. Below: black nothing. The scaffolding was assembled from surface materials — modern planks, modern rope — which means someone has been building infrastructure down here for some time.\n\nHalfway across, the plank beneath your left foot cracks.", choices: [
        { text: "Step right quickly.", onSelect: () => { decreaseSanity(0.5); startDialogue('ch2_scaffolding_right'); } },
        { text: "Freeze and redistribute weight slowly.", onSelect: () => { gameState.knowledgeCodex += 1; startDialogue('ch2_scaffolding_freeze'); } },
        { text: "Run for the far end.", onSelect: () => { decreaseSanity(1.5); startDialogue('ch2_scaffolding_run'); } }
    ]},
    'ch2_scaffolding_right': { speaker: "System", text: "You shift right. The plank holds. You cross the remaining fifteen meters with careful, even weight distribution and reach the far platform. Maren nods once — acknowledgment, not approval.\n\n'Nice footwork.'", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'ch2_scaffolding_freeze': { speaker: "System", text: "You stop. Breathe. Shift your weight millimeter by millimeter until you feel the plank stabilize. Then you continue at half speed, testing each step before committing.\n\nIt takes four minutes. It feels like forty.\n\nMaren, on the far platform: 'You've done field work before. That's not a desk archaeologist's crossing.'", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'ch2_scaffolding_run': { speaker: "System", text: "You run. The planks shudder and crack under you — two more give as you cross — and you hit the far platform hard enough to drop to your knees.\n\nYou are intact. The scaffold is not.\n\nMaren looks at the now-compromised structure. 'That was the return route if we needed it. We don't. But still.'", choices: [{ text: "Stand up.", onSelect: () => closeDialogue() }]},

    // Cutthroat exit
    'ch2_cutthroat_maren': { speaker: "Maren", text: "She finds you at the staging area after the crossing.\n\n'You're through. Extraction tunnel is two hundred meters north. It opens under a carpet shop in Khan el-Khalili — the owner is an asset, he'll be asleep. You go through first, alone. My team follows in twelve minutes.'\n\nShe hands you a burner phone. 'One number saved. Use it if you need to. Don't call unless you need to.'\n\nShe pauses, and then adds something she didn't plan to add: 'If you find anything about the Giza subsurface that you're not supposed to find — anything that seems like it was left specifically for you — call the number before you publish. Before you do anything. Client or not, some things need a second opinion.'", choices: [
        { text: "'What do you think I'll find?'", onSelect: () => startDialogue('ch2_maren_final') },
        { text: "Take the phone and go.", onSelect: () => { if(!gameState.inventory.includes("Maren's Burner Phone")) gameState.inventory.push("Maren's Burner Phone"); gameState.trustMaren += 1; startDialogue('ch2_cutthroat_bridge'); } }
    ]},
    'ch2_maren_final': { speaker: "Maren", text: "A long pause.\n\n'I've done three previous sites. At each one, at the deepest accessible level, there is a chamber that appears to have been left specifically for the next visitor. Not the last expedition. Not our team. The next one. Whoever the system identifies as the meaningful visitor.\n\n'At Malta the chamber had been empty for what the client estimated was four thousand years. At the Egyptian site in 2021 — six thousand. They wait.\n\n'At each site we arrived too late. The chamber had already cycled for someone else. Possibly our team triggered the cycle by entering. Possibly not.'\n\nShe looks at you directly. 'This site. You came through the tunnel. That's different from any previous extraction. The system may have chosen you specifically.'\n\nShe gives you the phone. 'Call the number.'", choices: [
        { text: "Take the phone. Go.", onSelect: () => { if(!gameState.inventory.includes("Maren's Burner Phone")) gameState.inventory.push("Maren's Burner Phone"); gameState.trustMaren += 3; gameState.flags.city_chose_vance = true; startDialogue('ch2_cutthroat_bridge'); } }
    ]},
    'ch2_cutthroat_bridge': { speaker: "System", text: "The extraction tunnel is high enough to walk upright. Concrete lining, electric lighting, supply cables along the ceiling.\n\nSomeone has been maintaining this infrastructure for years. It did not appear after the collapse. It was built before the collapse. They knew exactly when the collapse would happen.\n\nYou walk out into the back room of a carpet shop. The owner is asleep in a chair. You step over a cat and out into the market.", choices: [{ text: "Enter the market.", onSelect: () => loadChapterThree() }]},

    // Missing Ch3 flavor/rest stubs
    'ch3_rest_stall': { speaker: "Tea Corner", text: "A weathered wooden bench beside a brazier of coals and a chipped glass of mint tea that someone left and never came back for. The market is loud, but this pocket is quiet.\n\nYou sit down. The tea is cold, but the coals are warm.", choices: [
        { text: "Rest.", onSelect: () => attemptRest('ch3_rest_stall') },
        { text: "Keep moving.", onSelect: () => closeDialogue() }
    ]},
    'flavor_ch3_fountain': { speaker: "System", text: "A stone fountain in the center of the plaza, dry for decades judging by the salt deposits. Someone has left a small lamp in the basin, still lit. Around it, arranged neatly: seven small stones in a circle, each marked with a different symbol.\n\nYou recognize two of the symbols from the Codex. Whoever left this was not a tourist.", choices: [
        { text: "Photograph it.", onSelect: () => { gameState.knowledgeCodex += 1; closeDialogue(); } },
        { text: "Leave it.", onSelect: () => closeDialogue() }
    ]},
    'flavor_ch3_prayer': { speaker: "System", text: "A small nook between two walls where someone has assembled a rough prayer corner — a mat, a qibla indicator scratched into the stone, a single photograph tucked into a crack.\n\nThe photograph shows the Giza plateau at dawn, before development. Before excavation. When it was still just sand and silence and three pyramids that everyone looked at and no one looked under.", choices: [{ text: "Leave it undisturbed.", onSelect: () => { increaseSanity(0.5); closeDialogue(); } }]},
    'flavor_plaza_bench': { speaker: "System", text: "A stone bench worn smooth by a thousand years of people sitting on it and waiting. You sit for a moment.\n\nThe market moves around you. Someone is selling bread. Someone is arguing about a price. A child runs past chasing a dog. A man in a suit checks his phone. Cairo, at 4:00 AM, being entirely itself.\n\nFor a moment, none of what you found underground seems real.", choices: [
        { text: "Let it stay unreal for a moment.", onSelect: () => { increaseSanity(1.0); closeDialogue(); } },
        { text: "Open the journal. Keep it real.", onSelect: () => { gameState.knowledgeCodex += 1; closeDialogue(); } }
    ]},
    'int_sf_archive': { speaker: "System", text: "Floor-to-ceiling shelves of ledgers, journals, and rolled documents. The oldest appear to be late Ottoman — 1870s, possibly earlier. The newest is a spiral-bound notebook dated two years ago.\n\nYusra's order has been documenting the Giza subsurface since the nineteenth century. They have been waiting for the current season's surface dig to breach the upper level for at least forty years.\n\nYou pull the most recent notebook. It is written in five languages and heavily coded. You can read perhaps a third of it.", choices: [
        { text: "Read what you can.", onSelect: () => { gameState.knowledgeHermetic += 3; gameState.knowledgeAtlantean += 1; closeDialogue(); } },
        { text: "Photograph select pages.", onSelect: () => { gameState.knowledgeHermetic += 1; if(!gameState.inventory.includes('Archive Photographs')) gameState.inventory.push('Archive Photographs'); closeDialogue(); } }
    ]},
    'int_sf_map': { speaker: "System", text: "A ritual map on parchment, mounted in a frame. It shows what appears to be Cairo overlaid with a second city — a ghost-city of the same footprint but different geometry, running underneath and alongside the visible one.\n\nThe underground city is labeled at key points in Hermetic notation. You recognize three labels from your knowledgebase: 'The Heart', 'The Custodian's Chamber', 'The Exit That Is Not an Exit.'\n\nYusra's order knows the layout of the underground city. They have known it for a long time. The question is why they haven't gone down there.", choices: [
        { text: "Study it carefully.", onSelect: () => { gameState.knowledgeHermetic += 2; gameState.knowledgeAtlantean += 2; closeDialogue(); } }
    ]},
    'zone_dig_gate': { speaker: "System", text: () => {
        if (gameState.flags.scene3Triggered) return "The dig zone perimeter. The fence is buckled and partially collapsed from the subsurface breach. You could walk through if you wanted to.\n\nThe tunnel mouth is visible to the north. The Codex is in your hands. The ground is still warm under your boots.\n\nThis is the last moment you are on the surface.";
        return "The dig zone perimeter fence. A combination padlock on the main gate, Ministry of Antiquities seal across the latch.\n\nTariq's authorisation is required to enter the active excavation zone after hours. The Ministry inspector runs a check every morning — you have been careful.\n\nThe anomalies from the three site problems are north of this fence. Your permit covers it. The lock is bureaucratic theater.";
    }, choices: [
        { text: () => gameState.flags.scene3Triggered ? "Walk through." : "Check your permit. You have access.", onSelect: () => { if (!gameState.flags.scene3Triggered) { gameState.knowledgeCodex += 1; closeDialogue(); } else closeDialogue(); } }
    ]},
    'zone_locked': { speaker: "System", text: "This area is sealed. You don't have authorisation to proceed past this point yet.", choices: [{ text: "Step back.", onSelect: () => closeDialogue() }]},


    'ch2_trap_samir': { speaker: "Samir", text: "A ragged man holding an oil lamp emerges from the shadows.\n\n'Ah! Another rat in the maze. The city breathes in different rhythms down here.'", choices: [ 
        { text: "'How do I leave?'", onSelect: () => { if(!gameState.flags.samirTalked) { gameState.knowledgeAtlantean += 2; startDialogue('samir_exit'); } else { startDialogue('samir_repeat'); } }},
        { text: "Talk to me for a minute.", onSelect: () => { if(!gameState.flags.samirCompanionUsed) { gameState.flags.samirCompanionUsed = true; increaseSanity(3.0); gameState.knowledgeAtlantean += 2; startDialogue('samir_companion_talk'); } else { alert("You've already spoken to him."); } } }
    ]},
    'samir_companion_talk': { speaker: "Samir", text: "He speaks of his ten years down here, surviving on blind luck and the erratic glow of the shifting stone. The hour passes in a minute.", choices: [{ text: "Listen.", onSelect: () => closeDialogue() }] },
    'samir_repeat': { speaker: "Samir", text: "'I already told you, Doctor. Follow the dim light.'", choices: [{ text: "Right.", onSelect: () => closeDialogue() }] },
    'samir_exit': { speaker: "Samir", text: "'Follow the dim light. The bright ones are just hungry. Here, take this chisel. You will need it.'", choices: [{ text: "Take the chisel.", onSelect: () => { if(!gameState.inventory.includes('Chisel')) { gameState.inventory.push('Chisel'); } gameState.flags.samirTalked = true; updateHUD(); closeDialogue(); } }] },
    
    'trap_false_door': { speaker: "System", text: "A heavy wooden door bound in iron. It looks exactly like the door to your private study back in Oxford. It absolutely does not belong down here.\n\nThrough the keyhole: warm lamplight. The smell of old books. Your chair.", choices: [
        { text: "Open it.", onSelect: () => { decreaseSanity(2.0); gameState.flags.trapDoorChecked = true; }, nextScene: 'trap_false_door_open' },
        { text: "Touch the wood to test if it's real.", onSelect: () => { decreaseSanity(0.5); gameState.knowledgeCodex += 1; gameState.flags.trapDoorChecked = true; }, nextScene: 'trap_false_door_touch' },
        { text: "Walk away. It's an illusion.", onSelect: () => { increaseSanity(0.5); gameState.flags.trapDoorChecked = true; closeDialogue(); } }
    ]},
    'trap_false_door_open': { speaker: "System", text: "You turn the knob. Your hand passes through. The door is not a door — it is an image the city is painting directly onto your vision.\n\nBut for a full second, you smelled your study. You heard the clock on your mantel ticking.\n\nYour hands are shaking when you pull them back.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'trap_false_door_touch': { speaker: "System", text: "Your fingers brush the wood grain. It is stone underneath, the texture painted onto basalt so perfectly that even now — knowing — your brain insists it is oak.\n\nThe city is learning what you remember. That is useful information. It is also terrifying information.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'trap_pressure_1': { speaker: "System", text: "*CLICK*. A pressure plate depresses beneath your boot. The grinding sound of ancient gears echoes off the walls.\n\nYou have maybe two seconds.", choices: [
        { text: "Dive forward!", onSelect: () => { decreaseSanity(1.5); gameState.flags.trapPlate1Sprung = true; }, nextScene: 'trap_plate1_dodge' },
        { text: "Step back carefully — maybe it won't trigger.", onSelect: () => { decreaseSanity(2.5); gameState.flags.trapPlate1Sprung = true; }, nextScene: 'trap_plate1_back' },
        { text: "Hold perfectly still.", onSelect: () => { decreaseSanity(1.0); gameState.flags.trapPlate1Sprung = true; gameState.knowledgeCodex += 1; }, nextScene: 'trap_plate1_still' }
    ]},
    'trap_plate1_dodge': { speaker: "System", text: "A heavy stone slab slams down right where you were standing. Dust fills your lungs. You came through with a twisted ankle and your life.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'trap_plate1_back': { speaker: "System", text: "You step back. The slab falls where you were. Then a second slab falls where you stepped back to.\n\nYou jump forward at the last second. You are covered in limestone dust and sweat.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'trap_plate1_still': { speaker: "System", text: "You freeze. The grinding stops. The plate was listening for motion — not weight.\n\nYou step off it backwards, slowly. The mechanism resets.\n\nSomething down here built a trap designed to catch panicked humans. That is a very specific threat model.", choices: [{ text: "Keep moving, carefully.", onSelect: () => closeDialogue() }]},
    'trap_pressure_2': { speaker: "System", text: "*SNAP*. The tile cracks under your weight. A hissing cloud of thick amber gas vents from the floor directly into your face.", choices: [
        { text: "Hold your breath. Run through it.", onSelect: () => { decreaseSanity(2.0); gameState.flags.trapPlate2Sprung = true; }, nextScene: 'trap_plate2_gas' },
        { text: "Breathe the gas. See what happens.", onSelect: () => { decreaseSanity(3.5); gameState.knowledgeAtlantean += 2; gameState.flags.trapPlate2Sprung = true; }, nextScene: 'trap_plate2_inhale' },
        { text: "Cover your face with your sleeve and back away.", onSelect: () => { decreaseSanity(1.0); gameState.flags.trapPlate2Sprung = true; }, nextScene: 'trap_plate2_retreat' }
    ]},
    'trap_plate2_gas': { speaker: "System", text: "The gas sears your eyes and throat. As your vision blurs, you see shapes moving in the shadows that absolutely aren't there.\n\nYou make it through. Just.", choices: [{ text: "Rub your eyes.", onSelect: () => closeDialogue() }]},
    'trap_plate2_inhale': { speaker: "System", text: "You inhale deliberately.\n\nThe gas is not poison. It is a memory compound — something the Uarha used to preserve knowledge in breathable form. For eighteen seconds, you know things you did not know a minute ago. You know the layout of three floors of this labyrinth. You know a fragment of a language no human has spoken for nine thousand years.\n\nThen it fades. But some of it stays.", choices: [{ text: "Cough. Walk forward.", onSelect: () => closeDialogue() }]},
    'trap_plate2_retreat': { speaker: "System", text: "You pull your sleeve over your face and back away. The gas dissipates after about thirty seconds.\n\nThe corridor the other direction is longer but the gas is gone. You walk around.", choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]},
    'trap_whisper': { speaker: "System", text: "The corridor narrows. You clearly hear Tariq's voice calling for help from the other side of a solid rock wall.\n\n'Doctor! I'm here. Please. The wall is thin — please—'\n\nIt is definitely his voice. Every inflection. The specific way he says 'please.'", choices: [
        { text: "Call back to him.", onSelect: () => { decreaseSanity(2.5); gameState.flags.trapWhispersHeard = true; }, nextScene: 'trap_whisper_call' },
        { text: "Press your ear to the stone and listen longer.", onSelect: () => { decreaseSanity(1.5); gameState.knowledgeCodex += 1; gameState.flags.trapWhispersHeard = true; }, nextScene: 'trap_whisper_listen' },
        { text: "Ignore it. Tariq is on the surface.", onSelect: () => { increaseSanity(0.5); gameState.flags.trapWhispersHeard = true; closeDialogue(); } }
    ]},
    'trap_whisper_call': { speaker: "System", text: "'Tariq! Can you hear me?'\n\nThe voice on the other side stops mid-sentence. Then, in a slightly different cadence — off by milliseconds — it starts again.\n\n'Doctor. I am here. Please—'\n\nThe same exact sentence. Word for word. The city was recording while you listened.", choices: [{ text: "Back away.", onSelect: () => closeDialogue() }]},
    'trap_whisper_listen': { speaker: "System", text: "You press your ear to the stone. Behind Tariq's voice, underneath it, is something else — the voice slowed down by a factor of ten, played backwards, mixed with a hum that is not a hum.\n\nThe city is teaching itself to speak with his voice. It has not quite learned yet.\n\nYou pull back. The sound stops the moment you are no longer listening for it.", choices: [{ text: "Move on.", onSelect: () => closeDialogue() }]},
    'trap_mural': { speaker: "System", text: "A vast mural depicting the night sky, but the stars are arranged in wrong, impossible constellations that defy human astronomy.\n\nSomething in the pattern is almost readable. As if, given enough time to stare, your mind would force a meaning out of it.", choices: [
        { text: "Study it. Try to decode the pattern.", onSelect: () => { decreaseSanity(2.0); gameState.knowledgeAtlantean += 2; gameState.knowledgeCodex += 1; gameState.flags.trapMuralRead = true; }, nextScene: 'trap_mural_study' },
        { text: "Sketch what you can and move on.", onSelect: () => { decreaseSanity(0.5); gameState.knowledgeAtlantean += 1; gameState.flags.trapMuralRead = true; }, nextScene: 'trap_mural_sketch' },
        { text: "Look away. It hurts your eyes.", onSelect: () => { gameState.flags.trapMuralRead = true; closeDialogue(); } }
    ]},
    'trap_mural_study': { speaker: "System", text: "You stare until the sky resolves. And it does resolve — suddenly, completely, the way a 3D pattern snaps into focus.\n\nYou are not looking at stars. You are looking at a map. The city below Giza, rendered as constellations. Each 'star' is a chamber, each 'connection' a corridor. The mural was built by someone who wanted future visitors to find their way.\n\nYou will see this map behind your eyelids for the next three years.", choices: [{ text: "Step back.", onSelect: () => closeDialogue() }]},
    'trap_mural_sketch': { speaker: "System", text: "You copy a handful of the constellations into your journal. Not enough to read — enough to recognize, later, if you ever see the pattern again.\n\nAs you draw, one of the painted stars shifts slightly on the wall. You pretend not to notice.", choices: [{ text: "Close the journal.", onSelect: () => closeDialogue() }]},
    'flavor_ch2_bones': { speaker: "System", text: "A skeleton slumped against the wall. Its bones are heavily calcified. Its hands are clasped tightly around a sealed bronze cylinder.", choices: [ { text: "Pry the cylinder open.", onSelect: () => { if (gameState.inventory.includes('Chisel')) { if (!gameState.flags.ch2BonesChecked) { gameState.knowledgeHermetic += 2; decreaseSanity(0.5); gameState.flags.ch2BonesChecked = true; } startDialogue('flavor_ch2_bones_success'); } else { startDialogue('flavor_ch2_bones_fail'); } }}, { text: "Leave the dead in peace.", onSelect: () => closeDialogue() } ]},
    'flavor_ch2_bones_success': { speaker: "System", text: "Using Samir's chisel, you pry the cylinder open. Inside are fragile Hermetic star-charts mapping the shifting architecture of the labyrinth.", choices: [{text: "Fascinating.", onSelect: () => closeDialogue()}] },
    'flavor_ch2_bones_fail': { speaker: "System", text: "You pull at the cylinder, but the calcified bone won't budge. You need a tool to pry it loose.", choices: [{text: "Step back.", onSelect: () => closeDialogue()}] },
    
    'ch2_trap_dim': { speaker: "System", text: "The channel here barely glows. It feels heavy and oppressive, but Samir said this was the way out.", choices: [{ text: "Enter the channel.", onSelect: () => startDialogue('ch2_trap_bridge') }] },
    'ch2_trap_bridge': { speaker: "System", text: "You crawl through a narrow, shifting passage for hours. Eventually, you emerge from a forgotten drainage pipe near the Khan el-Khalili in Cairo. The humid market air is a shock to your lungs.", choices: [{ text: "Enter the Market.", onSelect: () => loadChapterThree() }] },

    // --- CHAPTER 2 SECRET ROUTE ---
    'ch2_start_secret': { speaker: "System", text: "[CHAPTER 2: SECRET ROUTE]\n\nYou stand in the vast grand hallway. The air smells of dry stone and something faintly sweet, like honey left too long in a jar.", choices: [{ text: "Explore.", onSelect: () => closeDialogue() }] },
    'flavor_ch2_amber': { speaker: "System", text: "A metallic sconce embedded in the wall. The amber light it emits feels strangely warm, almost liquid to the touch.", choices: [{ text: "Touch the light.", onSelect: () => { if (!gameState.flags.ch2AmberTouched) { increaseSanity(1.5); gameState.knowledgeAtlantean += 1; gameState.flags.ch2AmberTouched = true; } closeDialogue(); } }, { text: "Leave it alone.", onSelect: () => closeDialogue() }] },
    
    // THE HOLLOW KING PUZZLE
    'ch2_secret_altar': { speaker: "System", text: "A massive basalt statue of a 'Hollow King' sits in the center of the antechamber. On his lap, resting perfectly still, is a Second Tablet identical in material to your Codex.", choices: [ 
        { text: "Speak to the king. 'I brought the Codex.'", onSelect: () => { if (gameState.knowledgeCodex >= 4 || gameState.flags.Codex_Is_Watching) { gameState.knowledgeCodex += 5; gameState.knowledgeAtlantean += 3; gameState.flags.Tablets_Resonated = true; gameState.flags.The_City_Is_Awake = true; if(!gameState.inventory.includes('Second Tablet')) gameState.inventory.push('Second Tablet'); startDialogue('ch2_hollow_king_success'); } else { alert("You don't have enough knowledge of the Codex to know what to say."); } } }, 
        { text: "Leave it.", onSelect: () => closeDialogue() } 
    ]},
    'ch2_hollow_king_success': { speaker: "System", text: "The king does not move. But the Second Tablet on his lap flares with light. The glyphs on it settle into a specific configuration and stop.\n\nYour own Codex, resting in your bag, pulses once in response. You take the Second Tablet.", choices: [{ text: "Step back.", onSelect: () => { gameState.flags.altarSolved = true; closeDialogue(); } }]},
    
    'ch2_secret_door_w': { speaker: "System", text: "A heavy stone door blocks the path. It has no keyhole, but it seems to react to the shifting energy in the room.", choices: [ { text: "Approach with both Tablets.", onSelect: () => { if (gameState.flags.Tablets_Resonated) { startDialogue('ch2_secret_bridge'); } else { startDialogue('door_fail'); } } }, { text: "Step away.", onSelect: () => closeDialogue() } ]},
    'door_fail': { speaker: "System", text: "The door remains sealed. It needs the tablets to resonate together.", choices: [{ text: "Step away.", onSelect: () => closeDialogue() }]},
    'ch2_secret_bridge': { speaker: "System", text: "The door grinds open, revealing a vertical shaft with ancient rungs. You climb until your muscles scream, finally pushing aside a heavy rug in a quiet shop at the Khan el-Khalili market.", choices: [{ text: "Enter the Market.", onSelect: () => loadChapterThree() }] },
    
    'flavor_ch2_mural': { speaker: "System", text: "A faded mural depicting figures with silver eyes. Looking at the complex geometry of their hands makes your eyes water.", choices: [{ text: "Look away.", onSelect: () => closeDialogue() }] },
    'flavor_ch2_statue': { speaker: "System", text: "A massive basalt statue of a figure that has fallen from its pedestal. The proportions are wrong—the fingers have far too many joints.", choices: [{ text: "Fascinating.", onSelect: () => closeDialogue() }] },
    'flavor_ch2_urn': { speaker: "System", text: "A cracked clay urn in the corner of the room. It smells faintly of sweet honey and old copper.", choices: [{ text: "Step away.", onSelect: () => closeDialogue() }] },

    // --- CHAPTER 2 CUTTHROAT ROUTE ---
    'ch2_start_cutthroat': { speaker: "System", text: "[CHAPTER 2: CUTTHROAT ROUTE]\n\nYou stand on a narrow wooden scaffolding. Below you is a bottomless chasm. Maren's mercenary team is setting up a staging area.", choices: [{ text: "Walk carefully.", onSelect: () => closeDialogue() }] },
    'ch2_cutthroat_tariq': { speaker: "Ellis", text: "*[whispering]* Tariq, hold still. I'll get you free.", choices: [ { text: "Cut his zip-ties right now.", onSelect: () => { gameState.trustTariq += 5; gameState.flags.tariqUntied = true; }, nextScene: 'tariq_cut_result' }, { text: "Tell him to wait until the guards move.", onSelect: () => { gameState.trustTariq -= 2; }, nextScene: 'tariq_wait_result' } ]},
    'tariq_cut_result': { speaker: "Tariq", text: "'Thank you, Doctor. Watch your back around these mercenaries. They are not here for history.'", choices: [{ text: "Nod.", onSelect: () => closeDialogue() }] },
    'tariq_wait_result': { speaker: "Tariq", text: "'You leave me bound like an animal? Fine. Play your games.'", choices: [{ text: "Walk away.", onSelect: () => closeDialogue() }] },
    
    // CUTTHROAT COMPANION (Boros)
    'flavor_ch2_stash': { speaker: "System", text: "A mercenary supply crate left unguarded. You see stacks of EGP. One of the mercenaries, Boros, is standing nearby, ignoring the cash.", choices: [ 
        { text: "Steal 500 EGP.", onSelect: () => { if (!gameState.flags.ch2StashLooted) { gameState.funds += 500; gameState.trustTariq -= 1; gameState.flags.ch2StashLooted = true; } }, nextScene: 'stash_steal_result' }, 
        { text: "Ask Boros about the Hermetic Order.", onSelect: () => { if(!gameState.flags.borosTalked) { gameState.flags.borosTalked = true; increaseSanity(3.0); startDialogue('boros_companion'); } else { alert("He ignores you."); } } },
        { text: "Leave the crate alone.", onSelect: () => closeDialogue() }
    ]},
    'stash_steal_result': { speaker: "System", text: "You quickly slip the bills into your jacket. (+500 EGP). Tariq notices the theft and shakes his head in disgust.", choices: [{ text: "Move on.", onSelect: () => { updateHUD(); closeDialogue(); } }] },
    'boros_companion': { speaker: "Boros", text: "He looks at you with weary eyes. He recites a brief Hermetic prayer under his breath that he says was taught to him by his grandmother. It inexplicably centers you.", choices: [{ text: "Thank him.", onSelect: () => closeDialogue() }] },
    
    'flavor_ch2_chasm': { speaker: "System", text: "The scaffolding groans under your weight. You look over the edge into the black void below. You drop a pebble, but never hear it hit bottom.", choices: [{ text: "Focus on the path.", onSelect: () => closeDialogue() }] },
    'flavor_ch2_blood': { speaker: "System", text: "A fresh smear of blood on the wooden planks. Maren's team ran into serious trouble down here before they found you.", choices: [{ text: "Step around it.", onSelect: () => closeDialogue() }] },
    'flavor_ch2_gear': { speaker: "System", text: "A dropped tactical radio belonging to one of the mercs. It's crushed completely flat, as if stepped on by something incredibly heavy.", choices: [{ text: "Leave it.", onSelect: () => closeDialogue() }] },
    'ch2_cutthroat_maren': { speaker: "Maren", text: "You made it up the scaffolding.\n\n'You work for me now, Doctor. We leave this cavern immediately. The extraction team is waiting.'", choices: [{ text: "Follow her.", onSelect: () => startDialogue('ch2_cutthroat_bridge') }] },
    'ch2_cutthroat_bridge': { speaker: "System", text: "Maren's team leads you through a series of military-grade extraction tunnels. You are blindfolded for the final leg and violently pushed out of a black van near the Hub. The Cairo market is already awake.", choices: [{ text: "Enter the Market.", onSelect: () => loadChapterThree() }] },

    // --- CHAPTER 3 MARKET ---
    'ch3_start': { speaker: "System", text: () => {
        let intro = "[CHAPTER 3: CONVERGENCE]\n\nYou emerge into the Khan el-Khalili market. It's 3:00 AM, but the bazaar is teeming with shadows, merchants, and strange faces.\n\n";
        if (gameState.currentRoute === 'TRAP') {
            intro += "You are covered in limestone dust. Your knees are bleeding through your trousers. Something in the labyrinth learned your face — you can feel it, faintly, the way you feel someone looking at you across a room.\n\nThe Codex is gone. You have only the journal. Whatever you saw down there will have to be proven from memory.";
        } else if (gameState.currentRoute === 'SECRET') {
            intro += "Your bag is heavy with two tablets now. Your own Codex and the Second Tablet from the Hollow King's lap. They hum against each other, faintly, through the leather.\n\nYou know more than anyone on this surface knows. You also know that makes you a target.";
        } else if (gameState.currentRoute === 'CUTTHROAT') {
            intro += "Maren's team left you here after the extraction tunnels. You are alive because they decided you were still useful.\n\nThat decision is temporary. The Codex — if you can still call it that — is in a crate in an unmarked van somewhere. Tonight you are playing someone else's game.";
        } else {
            intro += "Everything about this market feels wrong. You aren't sure why you came here. You only know that you did.";
        }
        return intro;
    }, choices: [{ text: "Enter the market.", onSelect: () => closeDialogue() }] },
    
    'ch3_coffee_stall': { speaker: "Bouncer", text: "The bouncer crosses his arms. 'We are closed to tourists. But there is heat at the brazier if you need a moment before you walk away.'", choices: [ 
        { text: "Give a password.", onSelect: () => { if (gameState.flags.marketPassword) { startDialogue('ch3_coffee_open'); } else { startDialogue('ch3_coffee_fail'); } } }, 
        { text: "Rest quietly at the brazier.", onSelect: () => attemptRest('ch3_coffee_stall') },
        { text: "Walk away.", onSelect: () => closeDialogue() } 
    ]},
    'ch3_coffee_fail': { speaker: "Bouncer", text: "'I don't know what you're talking about, tourist. Beat it before I break your jaw.'", choices: [{ text: "Leave.", onSelect: () => closeDialogue() }] },
    'ch3_coffee_open': { speaker: "Old Man", text: "The bouncer steps aside, revealing an old man holding a brass kettle.\n\n'Ah, Doctor Vance. She is waiting for you in the Safehouse.'", choices: [{ text: "Enter.", onSelect: () => { activeMapObjects = mapObjects['SAFEHOUSE']; canvas.style.backgroundColor = '#2a1f1a'; closeDialogue(); startDialogue('ch3_yusra_meet'); } }] },
    
    'ch3_vendor': { speaker: "Tea Vendor", text: "A street vendor stirring a pot of boiling water looks up at you.\n\n'Mint tea, effendi? Good for the heat. Good for the nerves.'", choices: [ 
        { text: "'I need to find Madame Yusra.'", onSelect: () => { gameState.flags.marketPassword = true; startDialogue('ch3_vendor_pass'); } }, 
        { text: "Buy a cup of tea (20 EGP).", onSelect: () => { if (gameState.funds >= 20) { gameState.funds -= 20; increaseSanity(3.0); startDialogue('ch3_vendor_tea'); } else { startDialogue('ch3_vendor_broke'); } } }, 
        { text: "Leave.", onSelect: () => closeDialogue() } 
    ]},
    'ch3_vendor_pass': { speaker: "Tea Vendor", text: "He looks around nervously and lowers his voice.\n\n'Tell the bouncer at the Hub: \"The Eye Unshuts.\" Go quickly.'", choices: [{ text: "Nod.", onSelect: () => closeDialogue() }] },
    'ch3_vendor_tea': { speaker: "System", text: "You drink a hot cup of mint tea. The familiarity of the hot ceramic and the sweet mint soothes your frazzled nerves.\n\n(Sanity heavily restored).", choices: [{ text: "Thanks.", onSelect: () => { updateHUD(); closeDialogue(); } }] },
    'ch3_vendor_broke': { speaker: "Tea Vendor", text: "'No money, no tea. Go beg somewhere else, tourist.'", choices: [{ text: "Leave.", onSelect: () => closeDialogue() }] },
    
    'ch3_hookah': { speaker: "Host", text: "A dimly lit lounge smelling of apple tobacco. The host bows slightly.\n\n'Welcome. Find a cushion. Let the smoke clear your mind.'", choices: [
        { text: "Pay for a Hookah Session (100 EGP).", onSelect: () => { if (gameState.funds >= 100) { gameState.funds -= 100; increaseSanity(5.0); startDialogue('ch3_hookah_smoke'); } else { alert("Not enough funds!"); } } },
        { text: "Leave.", onSelect: () => closeDialogue() }
    ]},
    'ch3_hookah_smoke': { speaker: "System", text: "You sit on a velvet cushion and smoke. For half an hour, the horrors below the earth feel like a distant, manageable dream.\n\n(Sanity completely restored).", choices: [{ text: "Stand up.", onSelect: () => { updateHUD(); closeDialogue(); } }] },

    'flavor_ch3_graffiti': { speaker: "System", text: "A chalk drawing on a brick wall depicting an eye with three distinct pupils. Looking directly at it makes your head ache.", choices: [{ text: "Look away.", onSelect: () => closeDialogue() }] },
    'flavor_ch3_cat': { speaker: "System", text: "A feral street cat. It stares intensely at your bag, hisses violently at whatever you are carrying, and backs away into the shadows.", choices: [{ text: "Leave it alone.", onSelect: () => { if(!gameState.flags.Market_Cat_Pet) { decreaseSanity(0.5); gameState.flags.Market_Cat_Pet = true; } closeDialogue(); } }] },
    'flavor_ch3_spice': { speaker: "System", text: "Baskets of turmeric, cumin, and... something else. It smells exactly like the sweet amber light from the ruins.", choices: [{ text: "Step away.", onSelect: () => closeDialogue() }] },
    'flavor_ch3_alley': { speaker: "System", text: "A dead end. The shadows here seem to stretch toward you, unmoored from the streetlamps above.", choices: [{ text: "Turn back.", onSelect: () => closeDialogue() }] },

    'ch3_yusra_meet': { speaker: "Yusra El-Sayed", text: "An elegant woman sitting on a velvet chair. She looks 60, but carries the presence of someone much older.\n\n'I lead the Order of the Unshut Eye. I have been expecting you, Doctor Vance.'", choices: [
        { text: "Demand answers about your dead partner.", onSelect: () => { if (gameState.knowledgeHermetic >= 3 || gameState.flags.Tariq_Confessed_Unease || gameState.flags.Tariq_Grandfather_Story) { gameState.flags.Asked_About_Sam = true; startDialogue('ch3_yusra_sam'); } else { alert("You don't have the context to press her on this yet."); } } },
        { text: "Ask what she wants from you.", onSelect: () => startDialogue('ch3_yusra_demand') }
    ]},
    'ch3_yusra_sam': { speaker: "Yusra El-Sayed", text: "'Doctor Okafor's death in Saqqara was not an accident of geology. I am not going to tell you who arranged it. I am telling you it was arranged. You are here because someone wanted you in this chair.'", choices: [{ text: "Stare in horror.", onSelect: () => { decreaseSanity(2.0); gameState.knowledgeHermetic += 5; gameState.flags.Saqqara_Was_Arranged = true; startDialogue('ch3_yusra_demand'); } }] },
    'ch3_yusra_demand': { speaker: "Yusra El-Sayed", text: () => {
        const route = gameState.currentRoute;
        let demand = '';
        if (route === 'SECRET') {
            demand = "'Give us the Codex. The military police are waiting outside. This is your only warning.'";
        } else if (route === 'TRAP') {
            demand = "'You carry something that does not belong in the hands of outsiders. Give it to us, or the police will take everything. This is your only warning.'";
        } else if (route === 'CUTTHROAT') {
            demand = "'We know what you came looking for. The Codex left the site with Maren's people. But you—you carry something else. Give it to us, or the police will take you. This is your only warning.'";
        }
        return `She stands up slowly.\n\n${demand}`;
    }, choices: [{ text: "Run!", onSelect: () => { loadChapterFour(); } }] },
    

    // ========= CHAPTER 4: THE CITY OF TWO NAMES =========

    'ch4_start': { speaker: "System", text: () => {
        let base = "The city stretches in every direction.\n\nNot ruins. Not excavated stone. A city, intact, sealed against time by something that is not physics. The architecture is wrong in every direction — doorways taller than anything that should need a door, corridors that curve upward against gravity, walls of a material that is simultaneously stone and metal and neither.\n\nThe amber channels run everywhere. Through the floor. Up the walls. Into the ceiling. Pulsing.\n\nYour footsteps echo for three seconds too long.";
        if (gameState.currentRoute === 'TRAP') {
            base += "\n\nYou have no artifact. No Codex. Only a journal full of sketches — and the memory of what it felt like to carry the thing above.";
        } else if (gameState.currentRoute === 'CUTTHROAT') {
            base += "\n\nMaren's team opened the entry for you and stayed behind. They said they would rather die on the surface. You think they were telling the truth.";
        } else if (gameState.currentRoute === 'SECRET') {
            base += "\n\nBoth tablets are humming in your bag. Loud enough that you can feel the vibration in your molars.";
        }
        return base;
    }, choices: [{ text: "Move forward.", onSelect: () => closeDialogue() }] },

    'ch4_rest_hearth': { speaker: "System", text: "A stone hearth set into a recessed alcove — the proportions are wrong for a human kitchen, but the function is unmistakable. The amber channel runs directly beneath it, warming the stone from below.\n\nAn ember is still burning. It has been burning for a very long time.", choices: [
        { text: "Sit. Breathe.", onSelect: () => attemptRest('ch4_rest_hearth') },
        { text: "Keep moving.", onSelect: () => closeDialogue() }
    ]},

    'ch4_prison': { speaker: "Iry", text: "A figure in the corner of the Temple — not chained. Simply there, the way a stone is there. Still for a very long time.\n\nShe looks up. Her eyes are silver. Not metaphorically silver. The color of still water in the dark.\n\n'Another one. Another surface animal who found the way down.'\n\nShe is not unkind. She sounds the way you sound when you are exhausted beyond being surprised.", choices: [
        { text: "'What is this city?'", onSelect: () => { gameState.knowledgeAtlantean += 2; }, nextScene: 'ch4_iry_city' },
        { text: "'Who are you?'", onSelect: () => {}, nextScene: 'ch4_iry_who' },
        { text: "'How long have you been here?'", onSelect: () => { gameState.knowledgeAtlantean += 1; }, nextScene: 'ch4_iry_time' },
        { text: "Back away slowly.", onSelect: () => closeDialogue() }
    ]},

    'ch4_iry_city': { speaker: "Iry", text: () => {
        let base = "'What is this city.'\n\nShe repeats it quietly, as though tasting the words.\n\n'You ask what it is. You are standing inside it. You are already part of the answer. That is how the city works — it does not tell you what it is. It shows you, and then you already know, and then there is no going back.'\n\nShe looks at your bag.";
        if (gameState.inventory.includes('The Codex')) {
            base += "\n\n'You have something. The stone with the moving marks. You found it on the surface.'";
        } else if (gameState.inventory.includes('Codex_Sketch') || gameState.inventory.includes('Field_Journal_Complete')) {
            base += "\n\n'You have something. A record. Pages of something that would not hold still long enough to be written down. Impressive that you tried.'";
        } else {
            base += "\n\n'You know something. You saw it, briefly, before the others took it. The memory alone is enough to bring you here.'";
        }
        return base;
    }, choices: [
        { text: "'Yes. There is something.'", onSelect: () => { gameState.knowledgeAtlantean += 1; gameState.flags.iryRevealedNature = true; }, nextScene: 'ch4_iry_codex_confirm' },
        { text: "'How did you know that?'", onSelect: () => {}, nextScene: 'ch4_iry_how_knew' }
    ]},

    'ch4_iry_codex_confirm': { speaker: "Iry", text: () => {
        let lead;
        if (gameState.inventory.includes('The Codex')) {
            lead = "'It changes because it is looking at you too.'";
        } else if (gameState.inventory.includes('Codex_Sketch') || gameState.inventory.includes('Field_Journal_Complete')) {
            lead = "'The sketches you made are not wrong. The glyphs do move. That you caught as much as you did means the stone was letting you.'";
        } else {
            lead = "'You remember more than you think. That is how the city marks the ones it wants to see again.'";
        }
        return lead + "\n\nShe stands. She moves the way very old people move — not frail, just deliberate. Every motion decided on.\n\n'The record is a question. My people made one. Another people made another. Yours is the third. Which means this city is awake again. Which means—'\n\nShe stops. Looks at the ceiling. Something passes across her face that you recognize as grief.\n\n'Which means it is time again.'";
    }, choices: [
        { text: "'Time for what?'", onSelect: () => { gameState.knowledgeAtlantean += 2; }, nextScene: 'ch4_iry_time_again' },
        { text: "Ask her about the companion talk.", onSelect: () => startDialogue('ch4_iry_companion') }
    ]},

    'ch4_iry_time_again': { speaker: "Iry", text: () => {
        let middle;
        if (gameState.inventory.includes('The Codex')) {
            middle = "My people decided. Our answer is the Codex — the one you carried down here. What you carry is not property, Doctor. It is a promissory note that says: someone will come. Someone will write the next line.";
        } else {
            middle = "My people decided. Our answer is the Codex — the stone that was above, in your tent, until tonight. Wherever it is now, it was a promissory note that said: someone will come. Someone will write the next line.";
        }
        return "'Every civilization that finds this city must decide. The city has been waiting for your people's decision for twelve thousand years. Your species is the slowest tenant we have had.\n\nThe previous people decided. Their answer is the stone on the statue's lap. " + middle + "\n\nYou are the someone.'";
    }, choices: [
        { text: "'What question am I supposed to answer?'", onSelect: () => { gameState.knowledgeAtlantean += 2; }, nextScene: 'ch4_iry_the_question' },
        { text: "'I'm an archaeologist. I dig things up.'", onSelect: () => {}, nextScene: 'ch4_iry_deflect' }
    ]},

    'ch4_iry_who': { speaker: "Iry", text: "'I am Iry. In your language it means approximately: witness.\n\nI am the last of the Uarha. You would say Atlanteans — a word from a story one of your philosophers wrote about us nine thousand years after we were gone, based on echoes and myths and a drawing someone found on a wall.'\n\nShe is not bitter. She is precise.\n\n'We did not drown. We changed. I am what change looks like after nine thousand years of practice.'", choices: [
        { text: "'Changed how?'", onSelect: () => { gameState.knowledgeAtlantean += 2; gameState.flags.iryRevealedNature = true; }, nextScene: 'ch4_iry_changed' },
        { text: "Stare at her eyes.", onSelect: () => { gameState.knowledgeAtlantean += 1; }, nextScene: 'ch4_iry_eyes' }
    ]},

    'ch4_iry_changed': { speaker: "Iry", text: "'Slower. My metabolism runs at a pace your instruments cannot measure. I eat perhaps once a decade. I sleep for what you would call centuries at a time.\n\nThe city maintains me. In exchange I witness. Every tenant who comes, I watch them make their choice. I remember what they wrote. The city cannot remember alone — it needs a living mind to hold the context.'\n\nShe touches the wall. The amber channels brighten where her fingers trace.\n\n'I have been waiting for someone from your surface who could understand what I am about to ask. Most of them run. You are still here.'", choices: [
        { text: "'I'm still here.'", onSelect: () => { gameState.knowledgeAtlantean += 1; gameState.flags.iryRevealedNature = true; }, nextScene: 'ch4_iry_the_question' },
        { text: "Talk to me for a minute.", onSelect: () => startDialogue('ch4_iry_companion') }
    ]},

    'ch4_iry_eyes': { speaker: "Iry", text: "'Yes. That is new. After nine thousand years something changes in the eyes. I stopped being surprised about it roughly eight thousand years ago.'\n\nAlmost amused.\n\n'You are looking at me the way academics look at things they want to publish about. I understand the feeling. When my colleagues and I first found this city, we also looked at it like that. Before we understood what it was asking of us.'", choices: [
        { text: "'What was it asking?'", onSelect: () => { gameState.knowledgeAtlantean += 1; gameState.flags.iryRevealedNature = true; }, nextScene: 'ch4_iry_the_question' }
    ]},

    'ch4_iry_time': { speaker: "Iry", text: "'Since my people made their decision. Nine thousand years, approximately.\n\nIt is not as long as it sounds. The first two thousand years are the worst. After that the mind learns to wait. You become interested in very slow things. The way stone changes. The way the amber light shifts with the seasons above, even here underground. The way languages evolve on the surface — I can hear them change, up through the rock, very faintly.'", choices: [
        { text: "'You can hear the surface?'", onSelect: () => { gameState.knowledgeAtlantean += 1; }, nextScene: 'ch4_iry_hears' },
        { text: "'Who are you?'", onSelect: () => startDialogue('ch4_iry_who') }
    ]},

    'ch4_iry_hears': { speaker: "Iry", text: "'Faintly. The city is a good conductor. I heard the pyramids being built. I heard them being opened the first time by robbers in the eighth century. I heard your excavation camp three weeks ago — the generators, the voices, the carts at night.'\n\nA pause.\n\n'I heard the conversation you had with your translator about the ground being wrong. He was right. The ground has been wrong for twelve thousand years. That is the point.'", choices: [
        { text: "Ask who she is.", onSelect: () => startDialogue('ch4_iry_who') },
        { text: "Ask what the city is.", onSelect: () => startDialogue('ch4_iry_city') }
    ]},

    'ch4_iry_deflect': { speaker: "Iry", text: "She looks at you.\n\nThe look lasts four seconds.\n\nIn those four seconds you become aware that this is a being who has had nine thousand years to practice patience and has decided not to use it on you right now.\n\n'You walked down here. Through a collapse. Past the traps. Past the labyrinth. You stood in front of the Hollow King. And now you are telling me you do not answer questions.'\n\nA beat.\n\n'Try again.'", choices: [
        { text: "'What is the question?'", onSelect: () => { gameState.knowledgeAtlantean += 1; }, nextScene: 'ch4_iry_the_question' }
    ]},

    'ch4_iry_how_knew': { speaker: "Iry", text: () => {
        let tail;
        if (gameState.inventory.includes('The Codex')) {
            tail = "\n\nShe tilts her head.\n\n'Also it is glowing through your bag.'";
        } else if (gameState.inventory.includes('Codex_Sketch') || gameState.inventory.includes('Field_Journal_Complete')) {
            tail = "\n\nShe tilts her head.\n\n'Also there is ink on your hands that is not ink. You have been drawing what the stone showed you. The drawings remember the stone.'";
        } else {
            tail = "\n\nShe tilts her head.\n\n'Also the city has been listening to your breathing since you crossed the outer threshold. It knows who has seen the stone, even briefly.'";
        }
        return "'The city knows. The channels recognize the resonance. When you entered the outer corridor, every amber light in this district shifted a quarter-tone.'" + tail;
    }, choices: [
        { text: "Look down.", onSelect: () => { gameState.knowledgeCodex += 1; }, nextScene: 'ch4_iry_codex_confirm' }
    ]},

    'ch4_iry_the_question': { speaker: "Iry", text: "She folds her hands. The amber channels pulse once, as though the room is listening.\n\n'I have known the question for nine thousand years. I have not known the answer for nine thousand years. The question is this: What is worth remembering?\n\nEvery civilization that finds this place must answer. The Codex is what one people said, long ago. The Second Tablet is what my people said. The blank tablet at the Heart is what your people will say — if your people choose to say anything at all.'\n\nShe looks at you directly.\n\n'You may answer. Or you may walk back into your daylight and let the city wait again. It is patient. I am the one who is tired of waiting.'", choices: [
        { text: "'I don't know if I can answer.'", onSelect: () => {}, nextScene: 'ch4_iry_question_maybe' },
        { text: "'I want to answer it.'", onSelect: () => { gameState.flags.iryQuestionAccepted = true; gameState.knowledgeAtlantean += 2; }, nextScene: 'ch4_iry_question_yes' },
        { text: "'What if my answer is wrong?'", onSelect: () => {}, nextScene: 'ch4_iry_question_wrong' },
        { text: "'I refuse the question.'", onSelect: () => { gameState.flags.iryQuestionRefused = true; }, nextScene: 'ch4_iry_question_no' }
    ]},

    'ch4_iry_question_yes': { speaker: "Iry", text: "The amber light in the room brightens.\n\nNot dramatically. Simply as though the light, which has been waiting as long as she has, exhales.\n\n'Good.'\n\nShe sits back down. The conversation has ended. Something else has begun.\n\n'The Heart is at the end of the north corridor. The blank tablet is waiting. You do not have to write yet — you will know when you are ready. The city will know too.'", choices: [
        { text: "Head north.", onSelect: () => closeDialogue() }
    ]},

    'ch4_iry_question_no': { speaker: "Iry", text: () => {
        const route = gameState.currentRoute;
        let offer;
        if (route === 'SECRET') offer = "'You may take the Codex. You may leave. I will not stop you. I never stop anyone.'";
        else if (route === 'TRAP') offer = "'You may take your journal and go. I will not stop you. I never stop anyone.'";
        else if (route === 'CUTTHROAT') offer = "'You may walk out. What you carry in your head is enough. I will not stop you. I never stop anyone.'";
        else offer = "'You may leave. I will not stop you. I never stop anyone.'";
        return "She nods once.\n\n'Then I will wait for the next one.'\n\nThe room dims slightly. Not in anger. In the way a candle dims when the wind shifts.\n\n" + offer + "\n\nShe closes her eyes.";
    }, choices: [
        { text: "Leave.", onSelect: () => closeDialogue() }
    ]},

    'ch4_iry_question_maybe': { speaker: "Iry", text: "'I don't know if I can' is the most honest thing anyone has said to me in four thousand years.\n\nThe last person said 'yes' immediately. With great confidence. The answer they wrote destroyed their entire civilization within a generation. Not because the city punished them. Because the answer was wrong for them. They knew it was wrong when they wrote it. They wrote it anyway.\n\n'Not knowing whether you can is better than pretending you know when you do not. Think about it. The Heart is at the end of the north corridor.'", choices: [
        { text: "'I want to answer it.'", onSelect: () => { gameState.flags.iryQuestionAccepted = true; gameState.knowledgeAtlantean += 1; }, nextScene: 'ch4_iry_question_yes' },
        { text: "Walk north without committing.", onSelect: () => closeDialogue() }
    ]},

    'ch4_iry_question_wrong': { speaker: "Iry", text: "'There is no wrong. There is only what is recorded.'\n\nShe is quiet for a moment.\n\n'There is a thing I should tell you. The people before my people — the ones whose writing is on the oldest tablet, from before human reckoning — their answer was three symbols. In their language it means approximately: still here.\n\nJust that. Still here.\n\nThe city has been turning that answer over for sixty thousand years. I think it is the most profound thing any tenant has ever written. And they probably just meant it literally. They were trying to say they had survived the previous extinction event.'", choices: [
        { text: "'I want to answer it.'", onSelect: () => { gameState.flags.iryQuestionAccepted = true; gameState.knowledgeAtlantean += 2; }, nextScene: 'ch4_iry_question_yes' },
        { text: "'I'm not ready yet.'", onSelect: () => closeDialogue() }
    ]},

    'ch4_iry_companion': { speaker: "Iry", text: "She is quiet for a moment after you ask. Then:\n\n'There is a constellation visible from your surface in winter — your people call it Orion. My people called it the Walker. The one who moves between worlds.'\n\nShe describes it the way someone describes a thing they have not thought about in a long time and find, upon returning to it, that they missed it.\n\n'When I was young — young by my people's standards, approximately your age — I would stay up all night watching the Walker move across the sky. It seemed important that someone was watching. That the stars had a witness.'\n\nShe looks at you.\n\n'I have been a witness for nine thousand years. I am glad you came down.'", choices: [
        { text: "Sit with this for a moment.", onSelect: () => { if(!gameState.flags.iryCompanionUsed) { gameState.flags.iryCompanionUsed = true; increaseSanity(3.0); gameState.knowledgeAtlantean += 1; gameState.trustIry += 1; } closeDialogue(); } }
    ]},

    'ch4_heart': { speaker: "System", text: "The Heart.\n\nA room smaller than you expected. The amber channels run thicker here — braided together into rivers of light along every surface. The ceiling is high and domed and covered in glyphs that are not moving. These ones have settled. These ones have been answered.\n\nThree tablets on a central pedestal.\n\nThe first: angular, mathematical, clearly the oldest — pre-human.\nThe second: Uarha writing. You can read fragments.\nThe third: blank. Black basalt. Waiting.\n\nThe waiting is not passive. It is active. The room is a held breath.", choices: [
        { text: "Examine the First Tablet.", onSelect: () => { gameState.knowledgeAtlantean += 1; }, nextScene: 'ch4_first_tablet' },
        { text: "Examine the Second Tablet.", onSelect: () => { gameState.knowledgeAtlantean += 1; gameState.knowledgeCodex += 1; }, nextScene: 'ch4_second_tablet' },
        { text: "Touch the Blank Tablet.", onSelect: () => {}, nextScene: 'ch4_blank_tablet' },
        { text: "Leave. Not yet.", onSelect: () => { gameState.flags.ch4HeartVisited = true; closeDialogue(); } }
    ]},

    'ch4_first_tablet': { speaker: "System", text: "Not hieroglyphs. Not Linear A or B. Not Sumerian. Nothing in your training covers this.\n\nBut the pattern is clear: base-12 arithmetic, astronomical charts, and at the very bottom, repeated three times, three angular symbols.\n\nYou cannot translate them. But Iry's words come back to you: 'Still here.'\n\nYou stand with the oldest thing your species has ever touched, and feel, briefly, very young.", choices: [
        { text: "Step back.", onSelect: () => { gameState.knowledgeAtlantean += 2; gameState.knowledgeCodex += 1; closeDialogue(); } }
    ]},

    'ch4_second_tablet': { speaker: "System", text: "The Uarha glyphs. Your accumulated knowledge fills in fragments:\n\n'...the city asks and we answer... the question is the same as it has always been... our answer is: connection. The thread between minds. The reason memory exists...'\n\nAnd then a proper noun, repeated with reverence. A name you recognize — Iry's.\n\nThe last line, in a different hand:\n\n'They will come. After us. Let them be ready.'", choices: [
        { text: "Step back.", onSelect: () => { gameState.knowledgeAtlantean += 2; gameState.knowledgeCodex += 2; closeDialogue(); } }
    ]},

    'ch4_blank_tablet': { speaker: "System", text: "Black basalt. Smooth. Not even a scratch.\n\nYou reach out. Your fingers stop two centimeters from the surface. Not force — gravity. The weight of what writing on this would mean.\n\nYou are not ready. You know you are not ready. The tablet knows it too.\n\nBut it will wait.", choices: [
        { text: "Pull back.", onSelect: () => { gameState.knowledgeCodex += 1; gameState.flags.ch4HeartVisited = true; closeDialogue(); } },
        { text: "Head back to the surface.", onSelect: () => { gameState.flags.ch4HeartVisited = true; loadChapterFive(); } }
    ]},

    // Ch4 flavor
    'flavor_ch4_pillar': { speaker: "System", text: "A pillar the height of a four-story building, carved from a single piece of the same not-quite-basalt as the Codex.\n\nThe carvings are not decorative. They are structural. Load-bearing information. The pillar isn't just holding up the ceiling — it's also describing the ceiling's history, its composition, its relationship to the larger structure.\n\nThe building is a sentence. You are walking through a paragraph.", choices: [{ text: "Move on.", onSelect: () => { gameState.knowledgeCodex += 1; closeDialogue(); } }]},

    'flavor_ch4_channel': { speaker: "System", text: "Up close the amber channel is not light — not exactly. It is something that produces the same effect as light, the way a very good photograph produces the same effect as a face.\n\nYou hold your hand over it. Your shadow doesn't fall the right way. The channel bends it.\n\nYour journal entry: 'Material unknown. Luminescent, thermogenic, apparently responsive to presence. Note: my handwriting looks different next to this. Steadier.'", choices: [{ text: "Stand up.", onSelect: () => { gameState.knowledgeAtlantean += 1; closeDialogue(); } }]},

    'flavor_ch4_glyph': { speaker: "System", text: "A wall covered floor-to-ceiling in glyphs. Three distinct styles, layered chronologically. The oldest at the bottom. The Uarha at the top. Where the scripts overlap, the meanings combine — not translate. Combine. Three different languages using the same wall produce a fourth meaning that none of them could have expressed alone.\n\nYou fill four pages trying to write it down. When you reread them, they don't say what you thought you wrote.", choices: [{ text: "Close the journal.", onSelect: () => { gameState.knowledgeCodex += 2; gameState.knowledgeAtlantean += 1; closeDialogue(); } }]},

    'flavor_ch4_fountain': { speaker: "System", text: "A large circular basin, dry, set flush with the floor at a major intersection of amber channels.\n\nAt the bottom: a fine layer of dust. And in the dust, footprints. Not human. Longer. Seven-toed.\n\nNext to the footprints, incised into the basin wall: the same single symbol you've seen twice before — on the Codex, and on the stone door in the Trap route.\n\nYou photograph it. You don't sleep well thinking about it.", choices: [{ text: "Walk away.", onSelect: () => { gameState.knowledgeAtlantean += 1; gameState.knowledgeCodex += 1; closeDialogue(); } }]},

    // ========= CHAPTER 5: THE LIE OF HISTORY =========

    'ch5_start': { speaker: "System", text: "Surface. Dawn.\n\nCairo is waking up around the airfield perimeter — distant prayer calls, the first horns of morning traffic. The horizon is the specific orange of a city that doesn't get dark.\n\nHalberd is here. The factions are converging. The standoff that was always coming is now minutes away.", choices: [{ text: "Move.", onSelect: () => closeDialogue() }]},

    'ch5_tariq_flat': { speaker: "System", text: "Tariq's family flat in Maadi. Pre-dawn. His mother is asleep. His sister is awake, making tea with the automatic efficiency of someone who has always been the one holding things together.\n\nShe speaks no English. She makes you eat anyway.", choices: [
        { text: "Sit with Tariq.", onSelect: () => {
            if (gameState.trustTariq >= 5) {
                if (!gameState.usedRestSites.includes('ch5_tariq_flat')) { startDialogue('ch5_tariq_flat_scene'); }
                else { alert("You've already rested here."); }
            } else { startDialogue('ch5_tariq_flat_locked'); }
        }},
        { text: "Leave.", onSelect: () => closeDialogue() }
    ]},

    'ch5_tariq_flat_locked': { speaker: "Tariq", text: "'This is my family's home, Doctor. Not everyone gets to come here.'", choices: [{ text: "Leave.", onSelect: () => closeDialogue() }]},

    'ch5_tariq_flat_scene': { speaker: "Tariq", text: "He shows you a shoebox under his bed. Inside: a small carved eye, pale stone, the size of a walnut.\n\n'My grandfather found this at Bubastis. 1957. He never reported it. He said it was the only thing he ever found that felt like it was looking back.'\n\nYou hold it. It is warm.\n\n'He said it meant the place had recognized him. He said that was enough.'", choices: [
        { text: "Give it back carefully.", onSelect: () => { gameState.flags.tariqFlatVisited = true; attemptRest('ch5_tariq_flat'); gameState.knowledgeHermetic += 2; gameState.trustTariq += 1; } }
    ]},

    'ch5_hangar_rest': { speaker: "System", text: "A steel barrel in the corner of an empty hangar bay. Someone lit it hours ago. The wood is half-gone.\n\nYou sit on a packing crate and watch the fire.\n\nFor ten minutes, you are no one from nowhere, and the city below the earth is someone else's problem.", choices: [
        { text: "Rest.", onSelect: () => attemptRest('ch5_hangar_rest') },
        { text: "Keep moving.", onSelect: () => closeDialogue() }
    ]},

    'ch5_halberd': { speaker: "Mr. Halberd", text: "Smaller than you expected. A man in his sixties. A gray suit. Hands that have never worked stone.\n\n'Doctor Vance. You found more than I anticipated. That is gratifying.'\n\n'You want to know why I funded you. You want to know about Saqqara. You want to know what I know about what is below this city.'\n\nHe straightens his jacket.\n\n'I know everything. I have known for forty years. I will explain, and then you will decide what to do with the information.'", choices: [
        { text: "'Tell me about Saqqara.'", onSelect: () => { gameState.flags.Asked_About_Sam = true; gameState.flags.halberdMet = true; }, nextScene: 'ch5_halberd_saqqara' },
        { text: "'What do you actually want?'", onSelect: () => { gameState.flags.halberdMet = true; }, nextScene: 'ch5_halberd_want' },
        { text: "Hit him.", onSelect: () => { gameState.bodyCount += 1; gameState.flags.Ellis_Attacked_Halberd = true; gameState.flags.halberdMet = true; }, nextScene: 'ch5_halberd_hit' }
    ]},

    'ch5_halberd_saqqara': { speaker: "Mr. Halberd", text: "'Doctor Okafor's death was not your fault in the way you think it was.'\n\nHe says it simply. As a fact.\n\n'The substrate was flagged as unstable. You ignored the report. That part is yours to carry. But the report was altered before you saw it. The numbers that made it seem passable were inserted by a third party who needed you to push through that tunnel. Who needed you to find what was on the other side of it.'\n\n'Sam Okafor died because someone wanted you to find the first marker stone at Saqqara. And you did. And that is why you are standing in front of me now.'", choices: [
        { text: "Stand very still.", onSelect: () => { decreaseSanity(2.0); gameState.knowledgeHermetic += 3; gameState.flags.Saqqara_Was_Arranged = true; }, nextScene: 'ch5_halberd_want' }
    ]},

    'ch5_halberd_want': { speaker: "Mr. Halberd", text: "'The city below Cairo has been known to a small group for four hundred years. The Order calls it the Duat. They are wrong about what it is, but right that it must not be opened casually.\n\nI represent a competing interest. We needed an archaeologist brilliant enough to navigate the descent and self-destructive enough to ignore the risks. You were ideal.'\n\nHe reaches into his jacket and produces a small glass vial.\n\n'This is an apology. It won't fix anything. It is extremely effective.'\n\nHe sets it on the crate. 'I will stay here when you go in. I think that is the right thing to do.'", choices: [
        { text: "Take the vial.", onSelect: () => { if(!gameState.inventory.includes('Halberd_Tincture')) { gameState.inventory.push('Halberd_Tincture'); updateHUD(); } startDialogue('ch5_halberd_end'); } },
        { text: "Leave the vial.", onSelect: () => startDialogue('ch5_halberd_end') }
    ]},

    'ch5_halberd_hit': { speaker: "System", text: "He takes it. He does not fall — he stumbles into the crate behind him and stays there, a hand on his nose, looking at you with an expression that is not anger.\n\nIt is the expression of a man who expected this and accepts it as fair.\n\n'I will wait here,' he says, through the hand on his nose. 'Take your time.'", choices: [
        { text: "Stand over him.", onSelect: () => startDialogue('ch5_halberd_want') }
    ]},

    'ch5_halberd_end': { speaker: "Mr. Halberd", text: "'Whatever you write on that tablet — make it honest. The city will know if it isn't. They all knew. That is the one thing every previous tenant had in common. They were honest, when the moment came. Even the ones whose answers were terrible. They meant them.'", choices: [
        { text: "Walk toward the standoff.", onSelect: () => closeDialogue() }
    ]},

    'ch5_standoff': { speaker: "System", text: () => {
        let setup = "The hangar is full.\n\nMaren's extraction team, tactical and loaded. Three Ministry police units in black windbreakers. Yusra and two Order guards. And somewhere in the rafters, at least one person Ellis hasn't seen.\n\nFour factions with four incompatible ideas about what should happen next. Every gun pointed at every other gun.\n\nEllis walks in.";
        return setup;
    }, choices: [
        { text: () => {
            const route = gameState.currentRoute;
            if (route === 'SECRET') return "Hold up the Codex.";
            if (route === 'TRAP')   return "Hold up the journal — every sketch, every page.";
            if (route === 'CUTTHROAT') return "Tell them the Codex is already gone.";
            return "Hold up what you carry.";
        }, onSelect: () => { gameState.flags.standoffResolved = true; }, nextScene: 'ch5_standoff_codex' },
        { text: "Let Iry speak.", onSelect: () => {
            if (gameState.flags.iryRevealedNature) { gameState.flags.standoffResolved = true; startDialogue('ch5_standoff_iry'); }
            else { startDialogue('ch5_standoff_no_iry'); }
        }},
        { text: "Walk past all of them.", onSelect: () => {
            if (gameState.flags.iryQuestionAccepted && gameState.knowledgeCodex >= 15) { gameState.flags.standoffResolved = true; startDialogue('ch5_standoff_walk'); }
            else { startDialogue('ch5_standoff_walk_fail'); }
        }}
    ]},

    'ch5_standoff_codex': { speaker: "System", text: () => {
        const route = gameState.currentRoute;
        if (route === 'SECRET') {
            return "The room holds its breath.\n\nEllis holds the Codex up — both hands, flat, the way you'd hold a sacred object.\n\n'All of you want this. None of you can use it. It isn't for any of you.'\n\nNo one shoots.\n\nMaren speaks first: 'Where did you just come from, Vance?' And in her voice you hear it — the amber pulse. Something changed.\n\n'Down,' Ellis says. 'I came from down. And I'm going back.'";
        }
        if (route === 'TRAP') {
            return "The room holds its breath.\n\nEllis holds the journal open — pages flipping in the breeze from the open hangar door. Every sketch he made. Every page of field notes. Every glyph he copied by hand, by lamplight, while the stone was moving.\n\n'The Codex is gone. The thing below is still there. These pages are the only record. You can shoot me and take them, but you can't read them. You don't know what you're looking at.'\n\nNo one shoots.\n\nMaren speaks first: 'Where did you just come from, Vance?' And in her voice you hear it — the same amber pulse the city makes. Something changed down there.\n\n'Down,' Ellis says. 'I came from down. And I'm going back.'";
        }
        if (route === 'CUTTHROAT') {
            return "The room holds its breath.\n\nEllis holds his empty hands up.\n\n'The Codex left with Maren's team three days ago. It's in a crate on a container ship bound for a private collector in Zurich. None of you are getting it.'\n\nMaren flinches — because Ellis just named the buyer out loud, in a room full of Ministry police. A muscle in her jaw tightens.\n\n'But the thing the Codex came from — the thing the Codex is just a page torn out of — is still down there. I'm the only one in this room who's seen it and come back. You can shoot me, or you can let me walk.'\n\nNo one shoots.\n\n'Down,' Ellis says. 'I came from down. And I'm going back.'";
        }
        return "The room holds its breath.\n\nEllis stands very still, hands visible.\n\nNo one shoots.";
    }, choices: [
        { text: "Walk toward the exit.", onSelect: () => loadChapterSix() }
    ]},

    'ch5_standoff_iry': { speaker: "Iry", text: "She steps forward. Nine thousand years old and looking it in a way that has nothing to do with wrinkles.\n\nShe speaks in a language none of them know. Then Arabic. Then something that might be a very old form of Greek.\n\nThe guns drop.\n\nNot because she threatened anyone. Because when something that old speaks with that kind of authority, the body responds before the mind does. Every person in the room knows, at a level below thought, that they are in the presence of something that was here before their religion, their country, their language.\n\nThe standoff is over.", choices: [
        { text: "Move.", onSelect: () => loadChapterSix() }
    ]},

    'ch5_standoff_no_iry': { speaker: "System", text: "You gesture for Iry to step forward — but she's not here, or doesn't know enough to trust you yet.\n\nThe guns stay up.", choices: [{ text: "Try something else.", onSelect: () => startDialogue('ch5_standoff') }]},

    'ch5_standoff_walk': { speaker: "System", text: "Ellis walks.\n\nStraight through the center of the room, past the drawn weapons, toward the far door.\n\nNo one fires. Because there's something in how Ellis moves that makes it clear the thing about to happen below is larger than all of their factions combined. Shooting the person about to do it would be the smallest act in twelve thousand years of history.\n\nMaren watches. Yusra makes the sign of the Unshut Eye. The Ministry officers look at each other.\n\nEllis doesn't look back.", choices: [
        { text: "Keep walking.", onSelect: () => loadChapterSix() }
    ]},

    'ch5_standoff_walk_fail': { speaker: "System", text: () => {
        const route = gameState.currentRoute;
        let line;
        if (route === 'SECRET') line = "'Stop,' says Maren. Not unkindly. 'Not with what you're carrying.'";
        else if (route === 'TRAP') line = "'Stop,' says Maren. Not unkindly. 'Not with what you know. Not yet.'";
        else if (route === 'CUTTHROAT') line = "'Stop,' says Maren. Not unkindly. 'You're not walking out of my hangar, Vance. Not until we talk.'";
        else line = "'Stop,' says Maren. Not unkindly.";
        return "You walk toward the door. Three guns track you immediately.\n\n" + line + "\n\nThis isn't the moment. Not yet.";
    }, choices: [{ text: "Stop. Try something else.", onSelect: () => startDialogue('ch5_standoff') }]},

    'flavor_ch5_plane': { speaker: "System", text: "A single-engine Cessna with no registration numbers, on flattened tires. Someone has been living in it — takeout containers, an Arabic newspaper from three weeks ago on the copilot seat.\n\nIn the margins of the newspaper, the same symbol drawn over and over. The glyph from the Codex that means motion.", choices: [{ text: "Leave it.", onSelect: () => { gameState.knowledgeCodex += 1; closeDialogue(); } }]},

    'flavor_ch5_crates': { speaker: "System", text: "Cargo crates stenciled in three languages. Contents: equipment. Unspecified.\n\nOne has been opened and resealed. Inside: packing foam cut into the precise shape of a 60cm tablet.\n\nSomebody knew exactly what they were coming for.", choices: [{ text: "Step back.", onSelect: () => closeDialogue() }]},

    // ========= CHAPTER 6: THE HERMETIC GATE =========

    'ch6_start': { speaker: "System", text: "Below the airfield. Below the city. Below everything.\n\nThe Hermetic Gate is the oldest structure in a building full of old structures. Where the city's amber channels are warm, the Gate's light is cold — white, precise, mathematically exact.\n\nYusra, if she is with you, goes quiet when she sees it. She has waited her entire life for this room.", choices: [{ text: "Move forward.", onSelect: () => closeDialogue() }]},

    'ch6_antechamber_rest': { speaker: "System", text: "The amber channels here are different. Braided. Where the ones in the city were rivers, these are circuits.\n\nYou sit next to them. The light is warm in the way that good news is warm — it settles into you slowly, then all at once.\n\nFor a moment the weight of what you're about to do is not lighter. But it is clearer.", choices: [
        { text: "Rest here.", onSelect: () => attemptRest('ch6_antechamber_rest') },
        { text: "Keep moving.", onSelect: () => closeDialogue() }
    ]},

    'ch6_halberd_farewell': { speaker: "Mr. Halberd", text: "He is here somehow. Sitting against the wall, looking exhausted in the way of a man who has been carrying a secret for forty years and has finally set it down.\n\n'I should stay here. This is as far as I get to go. I am not the one who earned the next room.'\n\nHe reaches into his jacket.\n\n'I kept one thing back.'", choices: [
        { text: "Take the vial.", onSelect: () => { gameState.flags.halberdFarewellDone = true; if(!gameState.inventory.includes('Halberd_Tincture')) { gameState.inventory.push('Halberd_Tincture'); updateHUD(); } closeDialogue(); }},
        { text: "Sit with him for a moment.", onSelect: () => { gameState.flags.halberdFarewellDone = true; increaseSanity(2.0); closeDialogue(); } }
    ]},

    'ch6_gate': { speaker: "System", text: () => {
        let tail;
        if (gameState.inventory.includes('The Codex')) {
            tail = "\n\nThe Codex in your bag pulses once.";
        } else if (gameState.inventory.includes('Codex_Sketch') || gameState.inventory.includes('Field_Journal_Complete')) {
            tail = "\n\nThe pages of your journal rustle once — no draft, no wind. The ink on them remembers.";
        } else {
            tail = "\n\nThe amber channels in the floor brighten under your feet. Something down here is responding to something you carry in your memory.";
        }
        return "The Gate.\n\nTwo doors of the same not-basalt as the stone above, each one three meters tall and perfectly fitted. No hinges. No mechanism.\n\nThe glyphs on the surface have stopped moving. These ones have been settled for a very long time.\n\nIn the center of each door: a handprint. Human-sized but with one extra joint on each finger." + tail;
    }, choices: [
        { text: "Place your hands on the prints.", onSelect: () => {
            if (gameState.inventory.includes('The Codex') || gameState.flags.Tablets_Resonated || gameState.flags.ch4HeartVisited) {
                startDialogue('ch6_gate_open');
            } else { startDialogue('ch6_gate_fail'); }
        }},
        { text: "Hold up what you carried from the surface.", onSelect: () => startDialogue('ch6_gate_codex') }
    ]},

    'ch6_gate_codex': { speaker: "System", text: () => {
        if (gameState.inventory.includes('The Codex')) {
            return "You hold the Codex up to the gate.\n\nThe glyphs on its surface run through the fastest change you have seen — a blur, settling finally into a single configuration.\n\nThe same configuration as the bottommost row of glyphs on the left door.\n\nAn introduction. The stone is saying its name.";
        } else if (gameState.inventory.includes('Codex_Sketch') || gameState.inventory.includes('Field_Journal_Complete')) {
            return "You hold the journal open to the sketches.\n\nThe ink on the page shifts — not the drawings themselves, but the space around them, as if the page is also a window.\n\nThe sketch on the lower right matches, exactly, the bottommost row of glyphs on the left door.\n\nAn introduction. Even a record of the stone is enough.";
        } else {
            return "You have nothing physical to hold up. You step forward anyway, empty-handed.\n\nThe channels under your feet brighten. The gate recognizes you — or rather, recognizes what you remember of what you once saw.\n\nThat is enough. Apparently.";
        }
    }, choices: [
        { text: "Approach the doors.", onSelect: () => startDialogue('ch6_gate_open') }
    ]},

    'ch6_gate_open': { speaker: "System", text: "The doors open.\n\nNot with a grind. They simply open — the way a door opens when someone on the other side reaches for the handle.\n\nBeyond them: the Heart.\n\nThe same room you were in before. Except now the three tablets are lit from within. The blank one is brightest.", choices: [
        { text: "Walk in.", onSelect: () => { gameState.flags.gateUnlocked = true; loadChapterSeven(); } }
    ]},

    'ch6_gate_fail': { speaker: "System", text: "Your hands on the stone. Nothing.\n\nThe city is not satisfied. Something is missing — the Codex, the resonance, the knowledge. You are not ready.\n\nYou need to go back.", choices: [{ text: "Step back.", onSelect: () => closeDialogue() }]},

    'flavor_ch6_inscriptions': { speaker: "System", text: "The walls of the approach corridor are dense with Hermetic script — four hundred years of record, carved into stone the Order was not supposed to touch.\n\nThey came this far. Every generation, they came this far, recorded what they knew, and sealed it in the dark.\n\nNone of them made it through the Gate.", choices: [{ text: "Move on.", onSelect: () => { gameState.knowledgeHermetic += 2; closeDialogue(); } }]},

    'flavor_ch6_eye': { speaker: "System", text: "The symbol of the Unshut Eye, carved large into the wall at eye level. Older than the Order — much older. They adopted it because it was already here.\n\nBelow it: a small hollow in the stone. Empty now. The hollow is exactly the right size for a glass vial.", choices: [{ text: "Step back.", onSelect: () => { gameState.knowledgeHermetic += 1; closeDialogue(); } }]},

    // ========= CHAPTER 7: THE WEIGHT OF TRUTH =========

    'ch7_start': { speaker: "System", text: "The Heart.\n\nAgain.\n\nBut different now. Everything that has happened to you is in this room — every choice, every person, every piece of knowledge collected in the dark. It is all here, in the space between you and the tablet.\n\nThe city is entirely awake. The amber channels burning at full intensity.\n\nThe blank tablet is waiting.\n\nYou have your whole life to write one answer. You have about thirty seconds before the weight of the room makes you write anything just to make the waiting stop.", choices: [
        { text: "Approach the pedestal.", onSelect: () => closeDialogue() }
    ]},

    'ch7_examine_codex': { speaker: "System", text: "The Codex is still. For the first time since you found it, the glyphs are not moving.\n\nThey have settled into a final configuration. The cartouche you couldn't read on day 22 reads clearly now.\n\nIt is not a pharaoh's name. It is a question.\n\nThe same question Iry asked you.", choices: [{ text: "Set it down.", onSelect: () => { gameState.flags.ch7CodexRead = true; closeDialogue(); } }]},

    'ch7_examine_second': { speaker: "System", text: "The Second Tablet — the Uarha answer.\n\nYou can read it now. Fully.\n\n'Connection. The thread between minds. The reason memory exists.'\n\nAnd then Iry's name. Over and over, the way you put someone's name on a stone when you want them remembered forever.\n\nShe knows. She has to know. She wrote this, or watched it be written. She has been living next to her own memorial for nine thousand years.\n\nYou put the tablet down gently.", choices: [{ text: "Turn to the blank tablet.", onSelect: () => { gameState.flags.ch7SecondRead = true; closeDialogue(); } }]},

    'ch7_pedestal': { speaker: "System", text: "The blank tablet.\n\nYour hand is on it. The stone is warm.\n\nEverything converges here — Giza, Saqqara, Sam's face in the lamplight, the trench workers' fear, Tariq's grandfather's story, the Hollow King's resonance, Iry's silver eyes, Halberd's vial, the walk through the desert.\n\nWhat is worth remembering?\n\nYou know your answer.", choices: [
        { text: "Take the Codex. Don't write anything.", onSelect: () => startDialogue('ch7_ending_scholar') },
        { text: "Write Sam's name.", onSelect: () => {
            if (gameState.flags.memorializedPartner) { startDialogue('ch7_ending_memorial'); }
            else { startDialogue('ch7_ending_memorial_weak'); }
        }},
        { text: "Write 'I forgive myself.'", onSelect: () => {
            if (gameState.flags.Asked_About_Sam && gameState.flags.Saqqara_Was_Arranged) { startDialogue('ch7_ending_forgiveness'); }
            else { startDialogue('ch7_ending_forgiveness_weak'); }
        }},
        { text: "Write Halberd's true name.", onSelect: () => {
            if (gameState.knowledgeHermetic >= 10 && gameState.flags.Ellis_Attacked_Halberd) { startDialogue('ch7_ending_indictment'); }
            else { startDialogue('ch7_ending_indictment_locked'); }
        }},
        { text: "Let Iry write.", onSelect: () => {
            if (gameState.flags.iryRevealedNature && gameState.flags.iryQuestionAccepted) { startDialogue('ch7_ending_witness'); }
            else { startDialogue('ch7_ending_witness_locked'); }
        }},
        { text: "Merge with the archive.", onSelect: () => startDialogue('ch7_ending_vessel') }
    ]},

    // ---- ENDINGS ----

    'ch7_ending_scholar': { speaker: "System", text: () => {
        const route = gameState.currentRoute;
        let opening;
        if (route === 'SECRET') {
            opening = "You take the Codex under your arm and walk out.\n\nYou've been carrying it since the collapse. It has never felt lighter than it does now.";
        } else if (route === 'TRAP') {
            opening = "You take the Codex from the pedestal — the first time your hands have held it since the night of the collapse, fourteen months ago. It recognizes you. You can feel it.\n\nYou walk out with it under your arm. The journal is in your other hand.";
        } else if (route === 'CUTTHROAT') {
            opening = "The Codex is here, on the pedestal — placed by someone, or by the city itself. Maren's team never actually had it. You understand now that she lied, or was lied to.\n\nYou take it under your arm and walk out.";
        } else {
            opening = "You take the Codex under your arm and walk out.";
        }
        return "ENDING 1 — THE SCHOLAR\n\n" + opening + "\n\nYou call a journal. You write a paper. You are careful about what you claim and more careful about what you leave out, but what you put in is enough to change the academic consensus on pre-dynastic Egypt by roughly twelve thousand years.\n\nYou are disgraced, then vindicated, then celebrated, then footnoted. The normal arc.\n\nThe city re-buries itself over the next three years. The amber channels go dark one district at a time. Iry's final letter arrives six months after you publish. It contains one sentence:\n\n'A good answer. Come back when you know a better one.'\n\nYou keep the letter in the field journal. You keep the field journal on your desk.\n\nYou never stop thinking about the question.";
    }, choices: [{ text: "[ END ]", onSelect: () => alert("ENDING 1: THE SCHOLAR — Complete. Thank you for playing.") }]},

    'ch7_ending_vessel': { speaker: "System", text: "ENDING 2 — THE VESSEL\n\nYou don't write anything.\n\nYou press your palm flat against the blank tablet and let the city read you — all of it. The invoice call. Sam's voice in the shaft. The thirty seconds after. Every choice in the dark.\n\nThe city takes it all and becomes it.\n\nYou become the city.\n\nIry finds your jacket on the floor of the Heart three days later. She folds it carefully and sets it on the pedestal. She sits with it for a long time.\n\n'The loneliest answer,' she says.\n\nThe amber light brightens once. Then holds steady.", choices: [{ text: "[ END ]", onSelect: () => alert("ENDING 2: THE VESSEL — Complete. Thank you for playing.") }]},

    'ch7_ending_memorial': { speaker: "System", text: "ENDING 5b — THE MEMORIAL\n\nYou write Sam Okafor's name.\n\nNot in any language anyone on the surface would recognize — you write it in the glyph-script you've been learning in the dark. Sam's name, in the oldest writing system on earth, on a tablet that will outlast every monument your civilization has ever built.\n\nThe city receives it the way the sea receives a stone: with complete attention, absolute acceptance, and no judgment about the size of the thing you've offered.\n\nThe amber light holds.\n\nYou sit on the floor of the Heart for a long time before you can stand up again. When you do, the weight of the last fourteen months is still there — but it has company now. It is part of the record.\n\nSam is remembered.\n\nThat was always what this was about.", choices: [{ text: "[ END ]", onSelect: () => alert("ENDING 5b: THE MEMORIAL — Complete. Thank you for playing.") }]},

    'ch7_ending_memorial_weak': { speaker: "System", text: () => {
        const route = gameState.currentRoute;
        let closing;
        if (route === 'SECRET') closing = "You take the Codex and walk back into the light.";
        else if (route === 'TRAP') closing = "You take the Codex from the pedestal — the one you lost fourteen months ago, waiting here for you all along — and walk back into the light.";
        else if (route === 'CUTTHROAT') closing = "The Codex on the pedestal is the one Maren's people were supposed to sell. It isn't on that container ship. It's here. You take it, and you walk back into the light.";
        else closing = "You walk back into the light.";
        return "You write a name you haven't spoken aloud in over a year.\n\nThe city receives it. The stone takes the mark.\n\nBut something is incomplete. The tablet knows. The city holds its new answer with care, but something in the amber light suggests it is waiting for more.\n\nMaybe that's enough. Maybe not.\n\n" + closing;
    }, choices: [{ text: "[ END ]", onSelect: () => alert("Ending: Scholar/partial memorial — Complete.") }]},

    'ch7_ending_forgiveness': { speaker: "System", text: "ENDING 5c — THE FORGIVENESS\n\nYou write 'I forgive myself.'\n\nThe stone does not respond the way you expect. No burst of light. The letters sit in the basalt the way all letters sit — marks in stone, already past tense the moment they're made.\n\nSaqqara was arranged. Someone altered the report. Sam died. The call was about an invoice. None of that is erased by what you just wrote.\n\nBut the record now says you were here. That you understood what happened. That you chose to continue living in a world that still has questions worth answering.\n\nIry, from somewhere behind you:\n\n'That one will take the city a long time to understand. Good.'", choices: [{ text: "[ END ]", onSelect: () => alert("ENDING 5c: THE FORGIVENESS — Complete. Thank you for playing.") }]},

    'ch7_ending_forgiveness_weak': { speaker: "System", text: () => {
        const route = gameState.currentRoute;
        let closing;
        if (route === 'SECRET') closing = "You close your eyes. You take the Codex. You walk out.";
        else if (route === 'TRAP') closing = "You close your eyes. You take the Codex from the pedestal — yours now, as much as it was ever anyone's. You walk out.";
        else if (route === 'CUTTHROAT') closing = "You close your eyes. You take the Codex — the real one, not the replica in Maren's crate — and you walk out.";
        else closing = "You close your eyes. You walk out.";
        return "You write 'I forgive myself.'\n\nThe letters are there. Permanent.\n\nBut the full weight of what they mean hasn't landed yet — you haven't learned the whole truth, or asked the question that makes the forgiveness mean something. The answer is real, but incomplete.\n\n" + closing;
    }, choices: [{ text: "[ END ]", onSelect: () => alert("Ending: Scholar/partial forgiveness — Complete.") }]},

    'ch7_ending_indictment': { speaker: "System", text: "ENDING 5d — THE INDICTMENT\n\nYou write Halberd's true name — not the one on his passport, the one in the Hermetic records.\n\nYou write what he did. You write Sam's name. You write the altered report. Every piece of the chain of manipulation that led from a board meeting in Geneva to a tunnel collapse in Saqqara to this room.\n\nYou write it all in glyph-script on a tablet that will outlast every institution that protected the people who made those decisions.\n\nThe city records the indictment.\n\nThe indictment is the first document in human history that cannot be suppressed.", choices: [{ text: "[ END ]", onSelect: () => alert("ENDING 5d: THE INDICTMENT — Complete. Thank you for playing.") }]},

    'ch7_ending_indictment_locked': { speaker: "System", text: "You reach for that answer but it isn't fully formed. You don't have the whole truth yet, or the right to write it.\n\nThe stone waits.", choices: [{ text: "Try something else.", onSelect: () => startDialogue('ch7_pedestal') }]},

    'ch7_ending_witness': { speaker: "System", text: "ENDING 5e — THE WITNESS\n\nYou step back from the pedestal.\n\nIry steps forward.\n\nShe stands in front of the blank tablet for a very long time. You cannot read her face. You don't try.\n\nWhen she writes, she writes in Uarha — her own language — quickly, with the efficiency of someone who has known what they wanted to say for nine thousand years.\n\nShe finishes. She steps back.\n\nYou do not know what she wrote.\n\nBut the city brightens. Every amber channel in every district burns at full intensity for approximately ten seconds. Then settles.\n\nIry looks at you.\n\n'Nine thousand years. And it was worth it. Thank you for coming down.'", choices: [{ text: "[ END ]", onSelect: () => alert("ENDING 5e: THE WITNESS — Complete. Thank you for playing.") }]},

    'ch7_ending_witness_locked': { speaker: "System", text: "You gesture for Iry — but she isn't here, or the trust between you isn't deep enough yet.\n\nThe tablet waits.", choices: [{ text: "Try something else.", onSelect: () => startDialogue('ch7_pedestal') }]},

    // =========================================================
    // ========= PUZZLE TRIGGER SCENES =========================
    // =========================================================

    // puzzle_start_glyph_lock is defined in the Ch1 expansion section below

    'puzzle_start_plates': {
        speaker: "System",
        text: "Four stone pressure plates set into the tunnel floor, each carved with a different symbol. The wall above them shows a frieze — a serpent coiling around an eye, a bird landing on a hand.\n\nThe order matters. You can feel it.",
        choices: [
            { text: "Study the frieze first.", onSelect: () => { gameState.knowledgeAtlantean += 1; updateHUD(); closeDialogue(); setTimeout(() => startPuzzle('puzzle_plates'), 300); } },
            { text: "Step forward carefully.", onSelect: () => { closeDialogue(); startPuzzle('puzzle_plates'); } }
        ]
    },

    'puzzle_start_resonance': {
        speaker: "System",
        text: "Three amber nodes embedded in the wall, each one pulsing at a different brightness — slow, medium, rapid. Above them, carved into the stone: three circles filled to different levels.\n\nThe pattern shows you what they should be.",
        choices: [
            { text: "Attune yourself to them.", onSelect: () => { gameState.knowledgeAtlantean += 1; updateHUD(); closeDialogue(); setTimeout(() => startPuzzle('puzzle_resonance'), 300); } }
        ]
    },

    'puzzle_start_cipher': {
        speaker: "Spice Merchant",
        text: "'You want what I know? Fine. But first you tell me what I told you.' He speaks carefully, watching your eyes. 'Three birds. One eye. Two hands. Say it back to me — not in words. In the dials.' He taps three notched brass dials mounted to his stall counter, each numbered one through five.",
        choices: [
            { text: "Work the dials.", onSelect: () => { closeDialogue(); startPuzzle('puzzle_cipher'); } },
            { text: "Walk away.", onSelect: () => closeDialogue() }
        ]
    },

    'puzzle_start_heart_altar': {
        speaker: "System",
        text: "The altar before the Heart chamber. Four carved panels set in a ring, each with an adjustable symbol — each one representing something Iry named when you asked her about the city's origins.\n\n'Water first. Then fire. Then stone. Then breath. The order is not metaphor. It is a lock.'\n\nThe panels wait.",
        choices: [
            { text: "Adjust the panels.", onSelect: () => { gameState.knowledgeAtlantean += 2; updateHUD(); closeDialogue(); setTimeout(() => startPuzzle('puzzle_heart_altar'), 300); } }
        ]
    },

    // =========================================================
    // ========= PUZZLE OUTCOME SCENES =========================
    // =========================================================

    'puzzle_glyph_solved': {
        speaker: "System",
        text: "A deep mechanical click, felt more than heard. The stone panel recesses by two centimeters. A seam appears in the tunnel wall ahead — a door that wasn't there before.\n\nSomebody built this for someone who knew what they were looking at.",
        choices: [{ text: "Step through.", onSelect: () => closeDialogue() }]
    },

    'puzzle_glyph_fail': {
        speaker: "System",
        text: "Wrong order. The lock resets with a grinding sound. The fine sand on the tunnel floor shivers outward from the panel in a perfect circle.\n\nSomething beneath registered the attempt.",
        choices: [{ text: "Try again.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } }]
    },

    'puzzle_plates_solved': {
        speaker: "System",
        text: "Each plate sinks in sequence with a resonant tone — low, lower, middle, high. The wall to your left grinds sideways on some ancient mechanism, smooth and precise despite nine thousand years of disuse.\n\nA passage. Dark. Warm air coming out of it, as if something inside has been breathing.",
        choices: [{ text: "Enter the passage.", onSelect: () => { gameState.flags.trap_plates_solved = true; closeDialogue(); } }]
    },

    'puzzle_plates_fail': {
        speaker: "System",
        text: "Wrong order. A dart fires from the wall three inches to your left and embeds itself in the stone opposite.\n\nYour hands are shaking. The dart is bone — not metal. Human bone, worked to a fine point.\n\nSomebody was here before you. For a long time.",
        choices: [{ text: "Breathe. Try again.", onSelect: () => { decreaseSanity(1.0); closeDialogue(); } }]
    },

    'puzzle_resonance_solved': {
        speaker: "System",
        text: "The three nodes align. The amber brightens to a single sustained note — not sound exactly, more like pressure behind the eyes.\n\nThe formation cracks open along a seam you hadn't seen. Inside: a hollow chamber. A small clay vessel. Inside the vessel: a rolled document on material that isn't paper or papyrus.\n\nThe writing is in Uarha. You can read about four words of it.",
        choices: [
            { text: "Take the document.", onSelect: () => { gameState.knowledgeAtlantean += 3; if (!gameState.inventory.includes('Uarha Fragment')) { gameState.inventory.push('Uarha Fragment'); updateHUD(); } closeDialogue(); } }
        ]
    },

    'puzzle_cipher_solved': {
        speaker: "Spice Merchant",
        text: "He is quiet for a moment, studying the dials. Then he nods, once, like something has been confirmed rather than decided.\n\n'Good. You were actually listening.'\n\nHe leans across the stall without looking at you and places a folded note in your palm. Small. Thick paper. Still warm.\n\n'The upstairs room. Tonight after the call to prayer. Come alone. Tell no one — and I mean no one — where you are going.'",
        choices: [
            { text: "Take the note.", onSelect: () => { gameState.flags.marketPassword = true; if (!gameState.inventory.includes('Market Note')) { gameState.inventory.push('Market Note'); updateHUD(); } closeDialogue(); } }
        ]
    },

    'puzzle_altar_fail': {
        speaker: "System",
        text: "The panels shudder and reset. A low vibration moves through the floor beneath you — not mechanical. Something deeper.\n\nThe air pressure changes. Your ears pop. The amber channels in the nearest corridor dim by about half and then slowly return.\n\nThe city noticed.",
        choices: [{ text: "Reset and try again.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } }]
    },

    // =========================================================
    // ========= HOSTILE CATCH SCENES ==========================
    // =========================================================

    'hostile_ministry_caught': {
        speaker: "Ministry Guard",
        text: "'This area is restricted. Authorised personnel only beyond the yellow tape. Move back to the approved excavation zone now or I radio for assistance.' His hand rests on his radio, not his belt. Professional.\n\nHe hasn't touched you. He's giving you a way out.",
        choices: [
            { text: "Comply and walk back.", onSelect: () => { gameState.repMinistry -= 1; updateHUD(); closeDialogue(); } },
            { text: "'I'm with the excavation team — Dr. Vance.'", onSelect: () => {
                if (gameState.repMinistry >= 0) startDialogue('hostile_ministry_bluff_success');
                else startDialogue('hostile_ministry_bluff_fail');
            }},
            { text: "Show the inspector's approval.", onSelect: () => {
                if (gameState.flags.inspector_dealt) startDialogue('hostile_ministry_inspector_pass');
                else startDialogue('hostile_ministry_bluff_fail');
            }}
        ]
    },

    'hostile_ministry_bluff_success': {
        speaker: "Ministry Guard",
        text: "He looks at you for a long moment. Checks something on his phone — probably the permit list.\n\n'Dr. Vance. All right.' He steps aside. 'Stay within the flagged perimeter. If I see you past the eastern marker again I won't ask twice.'",
        choices: [{ text: "Understood.", onSelect: () => closeDialogue() }]
    },

    'hostile_ministry_bluff_fail': {
        speaker: "Ministry Guard",
        text: "He doesn't buy it. He keys his radio before you finish the sentence.\n\nYou hear a response — two words in Arabic — and he looks back at you with an expression that has moved from professional to something harder.\n\n'Wait here.'",
        choices: [
            { text: "Wait.", onSelect: () => { decreaseSanity(1.0); gameState.repMinistry -= 1; updateHUD(); closeDialogue(); } },
            { text: "Walk away quickly.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } }
        ]
    },

    'hostile_ministry_inspector_pass': {
        speaker: "Ministry Guard",
        text: "You show him the approval documentation. He reads it properly — takes about twenty seconds.\n\n'Inspector Hassan's sign-off. All right, Doctor.' He hands it back. 'Go ahead.'",
        choices: [{ text: "Thank him and continue.", onSelect: () => { gameState.repMinistry += 1; updateHUD(); closeDialogue(); } }]
    },

    'hostile_figure_caught': {
        speaker: "System",
        text: "Something touches your shoulder.\n\nWhen you turn there is nothing there. The tunnel is empty. The amber channels are burning at their normal low pulse.\n\nBut you felt it — cold, deliberate, with the specific weight of a hand that knew exactly where your shoulder was.\n\nThe sanity cost is not from fear. It is from the recognition: whatever this is, it has been watching you for a long time. And it is curious rather than hostile. That is somehow worse.",
        choices: [{ text: "Keep moving.", onSelect: () => closeDialogue() }]
    },

    'hostile_worker_caught': {
        speaker: "Worker",
        text: () => {
            if (gameState.flags.worker_warned_once) {
                return "He catches your eye again and shakes his head, pointing back toward the camp. He has nothing more to say. He already told you.";
            }
            return "He grabs your arm — then immediately lets go, embarrassed by the contact.\n\n'I'm sorry. I just — please. Do not go further into the north tunnel tonight. I have been on this site six weeks. I have seen four men come back from the deep sections wrong. Wrong in the face. Wrong in the eyes. They don't talk about it. They just stop eating properly and then they go home.'\n\nHe looks at his hands.\n\n'I'm not a superstitious man, Doctor.'";
        },
        choices: [
            { text: "'I know. Thank you for telling me.'", onSelect: () => {
                gameState.flags.worker_warned_once = true;
                gameState.trustTariq += 1;
                decreaseSanity(-0.5);
                updateHUD();
                closeDialogue();
            }},
            { text: "Pull away and continue.", onSelect: () => {
                gameState.flags.worker_warned_once = true;
                closeDialogue();
            }}
        ]
    },

    'hostile_samir_caught': {
        speaker: "Samir",
        text: "He steps out of a side passage directly in front of you — close enough that you nearly walk into him. He doesn't step back.\n\n'You should not be alone down here. If you are alone in the labyrinth you are already lost — you simply haven't registered it yet.'\n\nHe studies you. His eyes are very still.\n\n'You're not afraid of me. That's either good or very bad. I haven't decided which.'",
        choices: [
            { text: "'I'm looking for a way through. Can you help?'", onSelect: () => { gameState.trustTariq += 1; startDialogue('ch2_samir'); } },
            { text: "Say nothing. Wait for him to move.", onSelect: () => { decreaseSanity(0.5); closeDialogue(); } }
        ]
    },

    // =========================================================
    // ========= END PASS 2 ADDITIONS ==========================
    // =========================================================


    // =========================================================
    // ========= GAME INTRO — fires on startGame ===============
    // Black screen. Player steps out of tent into Ch1 world.
    // =========================================================

    'game_intro': {
        speaker: "Ellis",
        text: "Day 22. Giza Plateau, Egypt.\n\nYou have been awake for thirty-four hours. The Codex is on the table in your tent. Outside: generators, sand, twenty-two men who have not been sleeping properly either.\n\nThree problems need resolving before dawn. The east trench. The supply path. The figure you saw at the generator.\n\nYou know you should log the Codex first. You know you should do a lot of things. You step outside.",
        choices: [{
            text: "Step outside.",
            onSelect: () => {
                // Fade in from black as player enters the world
                overlayAlpha = 1.0;
                menuPhase = 'GAMEFADEIN';
                closeDialogue();
            }
        }]
    },
    // =========================================================
    //
    // THREE INVESTIGATIONS that gate scene3Triggered = true
    // and unlock the tunnel to Ch2.
    //
    // Mission 1 — The Trench (what is softening the ground?)
    // Mission 2 — The Supply Line (what crystallized the axles?)
    // Mission 3 — The Generator (who is the figure in the dark?)
    //
    // Each mission: trigger → 3 investigation approaches →
    //   meaningful resolution → completion flag
    //
    // When all 3 complete → ch1_all_missions_check fires
    //   → scene3Triggered = true → tunnel unlocks
    // =========================================================


    // =========================================================
    // MISSION 1: THE TRENCH INVESTIGATION
    // =========================================================

    // Entry gate — fires when player re-examines the trench
    // after eastTrenchResolved but before ch1_mission1_complete
    'ch1_m1_entry': {
        speaker: "System",
        text: () => {
            if (gameState.flags.ch1_mission1_complete) {
                return "The trench. The ground beyond it still carries that low vibration you felt crossing. You've recorded what you need to record. It's done.";
            }
            if (!gameState.flags.eastTrenchResolved) {
                return "The east trench divides the site in two. The men won't cross it. That's a logistics problem before it's anything else. Deal with the carts and the watcher first.";
            }
            return "Now that the crossing is resolved, you can look at this properly.\n\nThe trench is three meters deep and twelve meters long. The eastern wall has been cut by whatever dug down here. The cut is clean — too clean for geology. You have three ways to investigate.";
        },
        choices: [
            {
                text: "Examine the trench walls — bring your loupe.",
                onSelect: () => {
                    if (!gameState.flags.eastTrenchResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission1_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m1_walls');
                }
            },
            {
                text: "Interview the workers who refused to cross.",
                onSelect: () => {
                    if (!gameState.flags.eastTrenchResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission1_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m1_workers');
                }
            },
            {
                text: "Descend into the trench. Physical investigation.",
                onSelect: () => {
                    if (!gameState.flags.eastTrenchResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission1_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m1_descend');
                }
            },
            {
                text: "Leave it for now.",
                onSelect: () => closeDialogue()
            }
        ]
    },

    // APPROACH A: Examine the walls
    'ch1_m1_walls': {
        speaker: "System",
        text: "You drop to one knee at the trench edge and bring the loupe to the eastern wall.\n\nThe cut surface is basalt — standard Giza substrate. But the fracture pattern is wrong. The stone hasn't been excavated. It's been pushed aside. From below. The way ice fractures when something underneath swells and forces it up.\n\nYou count the fracture lines. They radiate from a single point, approximately four meters below the current trench floor. As if something applied sustained upward pressure from that depth.",
        choices: [
            {
                text: "Measure the depth and record it.",
                onSelect: () => {
                    gameState.knowledgeCodex += 2;
                    gameState.knowledgeAtlantean += 1;
                    gameState.flags.ch1_m1_walls_done = true;
                    gameState.flags.Subsurface_Pressure_Mapped = true;
                    startDialogue('ch1_m1_walls_measure');
                }
            },
            {
                text: "Run your bare hand along the fracture. Feel the texture.",
                onSelect: () => {
                    decreaseSanity(1.0);
                    gameState.knowledgeCodex += 3;
                    gameState.knowledgeAtlantean += 2;
                    gameState.flags.ch1_m1_walls_done = true;
                    gameState.flags.Subsurface_Pressure_Mapped = true;
                    gameState.flags.Trench_Heat_Felt = true;
                    startDialogue('ch1_m1_walls_touch');
                }
            }
        ]
    },

    'ch1_m1_walls_measure': {
        speaker: "System",
        text: "You use your field measure and a plumb line. The pressure apex is at 4.2 meters depth, bearing northeast — toward the dig site's center.\n\nYou write in the journal: 'Subsurface structure at ~4m depth. Bearing NE toward primary excavation. Pressure origin, not geological collapse. This is not erosion. Something is pressing up.'\n\nThe writing feels significant in a way you cannot justify scientifically.",
        choices: [{
            text: "Stand up.",
            onSelect: () => {
                updateHUD();
                startDialogue('ch1_m1_resolution_check');
            }
        }]
    },

    'ch1_m1_walls_touch': {
        speaker: "System",
        text: "The stone is warm. Not ambient-warm — the same body-temperature warmth you felt in the Codex on the first night.\n\nAnd the fracture has a texture that stops your fingers cold. The edge of the break is smooth. Not smooth like water-worn stone. Smooth like the edge of a cut made with a blade so fine the material fused behind it.\n\nSomething below the trench is growing. The fracture is not a collapse point. It is a seam. A lid, slightly ajar.",
        choices: [{
            text: "Pull your hand back and stand up.",
            onSelect: () => {
                updateHUD();
                startDialogue('ch1_m1_resolution_check');
            }
        }]
    },

    // APPROACH B: Interview the workers
    'ch1_m1_workers': {
        speaker: "System",
        text: "You find four workers on the western edge of camp — the ones who refused to push the carts across the trench last night. They are sitting together, not speaking, in the specific posture of men performing calmness.\n\nThey look up when you approach. One of them — the oldest, whose name you have never learned — stands.",
        choices: [
            {
                text: "'I want to know what you heard. Not what you think I want to hear.'",
                onSelect: () => {
                    gameState.repLocal += 1;
                    gameState.trustTariq += 1;
                    startDialogue('ch1_m1_workers_honest');
                }
            },
            {
                text: "'Tell me what happened. In sequence.'",
                onSelect: () => {
                    startDialogue('ch1_m1_workers_sequence');
                }
            },
            {
                text: "Ask through Tariq. You need an accurate translation.",
                onSelect: () => {
                    if (gameState.trustTariq >= 2) {
                        gameState.trustTariq += 1;
                        startDialogue('ch1_m1_workers_tariq');
                    } else {
                        startDialogue('ch1_m1_workers_tariq_cold');
                    }
                }
            }
        ]
    },

    'ch1_m1_workers_honest': {
        speaker: "Worker (Osman)",
        text: "He is quiet for a long time. Then he speaks, in clear English you did not know he had.\n\n'The ground sings, Doctor. Not always. Three times in the last week. A low sound, felt in the teeth, not heard with the ears. The first time we thought it was the generator. But the generator was off.\n\nThe second time was at two in the morning, when the generator is always off. I was awake. I put my hand on the sand. The sand moved in circles. Not the wind. The sand was alive.\n\nThe third time was the night the carts stopped. The trench is over the source. We all know this. We were not afraid of the trench. We were afraid of what we would wake up if we walked over it.'",
        choices: [
            {
                text: "'What do you think it is?'",
                onSelect: () => {
                    gameState.knowledgeAtlantean += 2;
                    gameState.flags.ch1_m1_workers_done = true;
                    gameState.flags.Workers_Told_Truth = true;
                    startDialogue('ch1_m1_workers_what');
                }
            },
            {
                text: "'Thank you. That's exactly what I needed.'",
                onSelect: () => {
                    gameState.knowledgeAtlantean += 1;
                    gameState.repLocal += 2;
                    gameState.flags.ch1_m1_workers_done = true;
                    gameState.flags.Workers_Told_Truth = true;
                    updateHUD();
                    startDialogue('ch1_m1_resolution_check');
                }
            }
        ]
    },

    'ch1_m1_workers_what': {
        speaker: "Worker (Osman)",
        text: "A long pause. He looks at the other three men. None of them stop him.\n\n'We have a word in Arabic. Nafas — breath. The land breathes. Old people say the desert breathes once every fifty years and everything changes when it does. We think the land is about to breathe.\n\nWhen the land breathes, things come up. Things that were put down a very long time ago and sealed. You are standing on a seal, Doctor.\n\nIf you dig through a seal, you must be ready for what the seal was keeping in.'",
        choices: [{
            text: "Hold that thought.",
            onSelect: () => {
                decreaseSanity(1.0);
                gameState.knowledgeAtlantean += 2;
                gameState.flags.ch1_m1_workers_done = true;
                updateHUD();
                startDialogue('ch1_m1_resolution_check');
            }
        }]
    },

    'ch1_m1_workers_sequence': {
        speaker: "Worker",
        text: "The younger one does most of the talking, in Arabic. You catch every third word.\n\nThe shape of it: something underground. A sound that is a feeling. Circles drawn in sand. Nobody went near the trench voluntarily. Nobody slept well since the site opened.\n\nAt the end he gestures northeast — toward the dig site — and says a single word several times. You don't know it. You write it phonetically in your journal: 'nafas.'",
        choices: [{
            text: "Note it and find a translation.",
            onSelect: () => {
                gameState.knowledgeAtlantean += 1;
                gameState.flags.ch1_m1_workers_done = true;
                updateHUD();
                startDialogue('ch1_m1_resolution_check');
            }
        }]
    },

    'ch1_m1_workers_tariq': {
        speaker: "Tariq",
        text: "Tariq listens for several minutes. The old worker does most of the talking. Tariq doesn't interrupt once, which is unusual for him.\n\nWhen the worker finishes, Tariq is quiet for a moment before he translates.\n\n'He says: the ground here has been sleeping for a long time. He says the site sits over something that was buried deliberately and he believes your excavation has disturbed whatever was keeping it quiet. He says three men have spoken to him in the last week about hearing their dead relatives calling from below the east trench. He says: the dead are not calling. Something is using their voices to try to bring people closer.'",
        choices: [{
            text: "Stand very still.",
            onSelect: () => {
                decreaseSanity(1.5);
                gameState.knowledgeAtlantean += 3;
                gameState.flags.ch1_m1_workers_done = true;
                gameState.flags.Trench_Voices_Confirmed = true;
                updateHUD();
                startDialogue('ch1_m1_resolution_check');
            }
        }]
    },

    'ch1_m1_workers_tariq_cold': {
        speaker: "Tariq",
        text: "He looks at you across the camp with the unhurried assessment of a man who has been asking to be treated as a partner for three weeks.\n\n'Doctor. I am not your translator. I am your foreman. If you want to speak with the men, speak with them. Learn fifty words of Arabic and earn that conversation.'\n\nHe goes back to what he was doing.",
        choices: [{
            text: "Go speak to them yourself.",
            onSelect: () => startDialogue('ch1_m1_workers_sequence')
        }]
    },

    // APPROACH C: Descend into the trench
    'ch1_m1_descend': {
        speaker: "System",
        text: "You find a section of the trench wall with decent handholds and lower yourself down. Three meters is enough to change the temperature by several degrees. It is colder and quieter down here. The camp sounds — the generator, the murmur of workers — become muffled and distant.\n\nThe trench floor is packed sand. You kneel and place your palm flat against it.\n\nThe vibration is immediate. Not a tremor. A pulse. Regular. Approximately once every four seconds. Like a heartbeat at rest.",
        choices: [
            {
                text: "Press your ear to the floor and listen.",
                onSelect: () => {
                    decreaseSanity(2.0);
                    gameState.knowledgeAtlantean += 3;
                    gameState.knowledgeCodex += 1;
                    gameState.flags.ch1_m1_descend_done = true;
                    gameState.flags.Trench_Pulse_Heard = true;
                    startDialogue('ch1_m1_descend_listen');
                }
            },
            {
                text: "Dig a test hole. Six inches. See what the substrate does.",
                onSelect: () => {
                    decreaseSanity(1.0);
                    gameState.knowledgeCodex += 2;
                    gameState.flags.ch1_m1_descend_done = true;
                    gameState.flags.Trench_Substrate_Sampled = true;
                    startDialogue('ch1_m1_descend_dig');
                }
            },
            {
                text: "Take a soil sample and climb back out.",
                onSelect: () => {
                    gameState.knowledgeCodex += 1;
                    gameState.flags.ch1_m1_descend_done = true;
                    if (!gameState.inventory.includes('Soil_Sample')) gameState.inventory.push('Soil_Sample');
                    startDialogue('ch1_m1_descend_sample');
                }
            }
        ]
    },

    'ch1_m1_descend_listen': {
        speaker: "System",
        text: "You press your ear to the sand.\n\nFor a moment, nothing. The packed grains are cold against your cheek.\n\nThen: a sound. Deep and structural, the way the bass note from a pipe organ is felt in the chest rather than heard by the ears. It comes from below and from a great distance, but it is not ambiguous. It is a resonance. A sustained tone, slightly varying, like a note that has been held for so long it has become a condition of the space rather than a sound.\n\nAnd threaded into it — so faint you might be inventing it — something rhythmic. Not a heartbeat. Something more complex. Three pulses, a pause, two pulses, a pause. Repeating.\n\nYou know that pattern. It is the rhythm of the Codex's surface shimmer on the first night.",
        choices: [{
            text: "Lift your head. Climb out.",
            onSelect: () => {
                updateHUD();
                startDialogue('ch1_m1_resolution_check');
            }
        }]
    },

    'ch1_m1_descend_dig': {
        speaker: "System",
        text: "You use a trowel from your kit. The first two inches are normal packed sand. The third inch is different — the sand is fused. Not rock, not glass, but something in between. The grains have merged at their contact points, the way iron filings orient around a magnetic field.\n\nAt four inches the trowel skids off something hard. You brush the sand clear with your fingers. Stone. Flat, dressed, fitted. A pavement.\n\nSomething built a floor here. Below the trench. Below the dig.\n\nYou photograph it. You fill in the hole. You climb out without telling anyone what you found.",
        choices: [{
            text: "Climb back out.",
            onSelect: () => {
                gameState.knowledgeCodex += 1;
                updateHUD();
                startDialogue('ch1_m1_resolution_check');
            }
        }]
    },

    'ch1_m1_descend_sample': {
        speaker: "System",
        text: "You scrape two inches of sand into a field sample vial and seal it. Scientific. Methodical. You are an archaeologist.\n\nClimbing back out, you notice the handhold you used going down has changed. The indentation your left foot made in the soft clay wall is still there — but beside it, pressed into the same clay at the same depth, is the impression of a hand.\n\nFlat-palmed. Five fingers. The proportions are almost right. Almost.\n\nThe fingers are too long.",
        choices: [{
            text: "Don't mention this to anyone.",
            onSelect: () => {
                decreaseSanity(1.0);
                gameState.flags.Non_Human_Architect_Suspected = true;
                updateHUD();
                startDialogue('ch1_m1_resolution_check');
            }
        }]
    },

    // Mission 1 resolution
    'ch1_m1_resolution_check': {
        speaker: "System",
        text: () => {
            const hadTrenchHeat = gameState.flags.Trench_Heat_Felt;
            const heardWorkers = gameState.flags.Workers_Told_Truth || gameState.flags.Trench_Voices_Confirmed;
            const wentDown = gameState.flags.Trench_Pulse_Heard || gameState.flags.Trench_Substrate_Sampled || gameState.inventory.includes('Soil_Sample');

            let line1 = "You stand at the trench edge and look down at it in the failing light.";

            if (hadTrenchHeat && heardWorkers) {
                return line1 + "\n\nYou know two things now: the stone below is warm and the fracture was made by upward pressure. And the workers have been hearing the dead speak from this direction.\n\nTwo kinds of evidence. One conclusion.\n\nSomething below this trench is not inert. It is active. It has been active for longer than your permit has existed. And it is becoming more active.";
            } else if (wentDown && heardWorkers) {
                return line1 + "\n\nYou felt the pulse from inside the trench. A regular rhythm. Three beats, pause, two beats, pause. The same cadence as the Codex on night one.\n\nAnd the workers say it has been using dead voices to draw people near.\n\nThe two facts do not cancel each other. They compound. This is intelligent. Purposeful. And it is trying to communicate or to feed — you are not yet sure which.";
            } else if (wentDown) {
                return line1 + "\n\nYou found a pavement below the floor. Dressed stone. This is not a natural cavity. This was built.\n\nThat changes the excavation permit entirely, if anyone officially knew about it.\n\nThe only reason nobody officially knows is that whoever designed this site wanted it found by one specific kind of person. You're beginning to suspect you are that person.";
            } else {
                return line1 + "\n\nYou've gathered enough. The trench is over something that was put here on purpose. The ground is reacting to the excavation. The workers are afraid and their fear is warranted.\n\nYou need to record this and move on to the other problems before dawn.";
            }
        },
        choices: [{
            text: "Write it up. Close the trench investigation.",
            onSelect: () => {
                gameState.flags.ch1_mission1_complete = true;
                updateHUD();
                startDialogue('ch1_m1_complete');
            }
        }]
    },

    'ch1_m1_complete': {
        speaker: "Ellis",
        text: () => {
            const deep = gameState.flags.Trench_Pulse_Heard || gameState.flags.Trench_Heat_Felt;
            if (deep) {
                return "You write in the journal. The entry takes longer than usual because you keep stopping to choose different words and then putting back the first ones.\n\nAt the end you write: 'The trench is a threshold. Not a gap in the ground. A door, left slightly open. Investigate supply line and generator before proceeding north.'\n\nYou cap the pen. Your hands are steady. You're not sure if that means you're calm or past caring.";
            }
            return "Journal entry, 22:09: 'East trench investigated. Subsurface structure confirmed at 4m depth. Bearing NE. Site is over something large and deliberate. Supply line and generator still outstanding.'";
        },
        choices: [{
            text: "Continue.",
            onSelect: () => {
                startDialogue('ch1_missions_status');
            }
        }]
    },


    // =========================================================
    // MISSION 2: THE SUPPLY LINE INVESTIGATION
    // =========================================================

    'ch1_m2_entry': {
        speaker: "System",
        text: () => {
            if (gameState.flags.ch1_mission2_complete) {
                return "The broken carts have been dealt with. You've established what crystallized the axles. That chapter is closed.";
            }
            if (!gameState.flags.cartsResolved) {
                return "The carts are still blocking the supply path. Resolve the immediate logistics first.";
            }
            return "The supply path, now cleared. Three broken carts were pulled to the side. Their axles are still lying in the sand where the workers dropped them.\n\nYou pick one up and hold it to the floodlight. The fracture surface is unlike any metal failure you've seen. The steel has gone vitreous. Glass-like. The grain structure has changed at a molecular level.\n\nThis isn't fatigue failure. The supply path needs a proper investigation.";
        },
        choices: [
            {
                text: "Analyze the broken axles in detail.",
                onSelect: () => {
                    if (!gameState.flags.cartsResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission2_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m2_axles');
                }
            },
            {
                text: "Survey the full supply route for other anomalies.",
                onSelect: () => {
                    if (!gameState.flags.cartsResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission2_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m2_survey');
                }
            },
            {
                text: "Find the night-shift workers who abandoned the path.",
                onSelect: () => {
                    if (!gameState.flags.cartsResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission2_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m2_nightshift');
                }
            },
            {
                text: "Leave it for now.",
                onSelect: () => closeDialogue()
            }
        ]
    },

    // APPROACH A: Analyze the axles
    'ch1_m2_axles': {
        speaker: "System",
        text: "You collect all three axles and lay them parallel in the sand.\n\nThe fractures are identical. Not similar — identical. Each axle has failed at precisely the same point relative to its mounting, in precisely the same direction, with the same vitrified surface texture.\n\nSomething doesn't fail like that randomly. Mechanical stress is chaotic. These fractures are patterned. The pattern is radially symmetric around a central point approximately twelve meters northeast of the cart track — toward the trench.",
        choices: [
            {
                text: "Measure the pattern. Find the exact epicenter.",
                onSelect: () => {
                    gameState.knowledgeCodex += 3;
                    gameState.flags.ch1_m2_axles_done = true;
                    gameState.flags.Supply_Epicenter_Mapped = true;
                    startDialogue('ch1_m2_axles_epicenter');
                }
            },
            {
                text: "Take a fragment of the axle for the journal. Physical evidence.",
                onSelect: () => {
                    gameState.knowledgeCodex += 1;
                    gameState.knowledgeHermetic += 1;
                    gameState.flags.ch1_m2_axles_done = true;
                    if (!gameState.inventory.includes('Axle_Fragment')) gameState.inventory.push('Axle_Fragment');
                    startDialogue('ch1_m2_axles_fragment');
                }
            }
        ]
    },

    'ch1_m2_axles_epicenter': {
        speaker: "System",
        text: "You work backward from the fracture vectors using basic trigonometry and a compass. The mathematics take twenty minutes and three pages of the journal.\n\nThe epicenter is beneath the junction of the supply path and the east access road — directly above the subsurface cavity you identified at the trench.\n\nOne structure. Two surface effects. The trench softening and the axle failure are the same event, viewed from different angles.\n\nWhat caused steel to vitrify from twelve meters below without generating heat, without producing sound, without leaving any residue? Not geology. Not physics. Not anything in the literature.",
        choices: [{
            text: "Close the journal. You know enough.",
            onSelect: () => {
                updateHUD();
                startDialogue('ch1_m2_resolution_check');
            }
        }]
    },

    'ch1_m2_axles_fragment': {
        speaker: "System",
        text: "You break a chip off the largest axle fragment and seal it in a sample bag.\n\nHolding it, you notice the vitrified surface has a faint internal light. Not a reflection. An emission — the palest possible amber, barely perceptible, visible only because your eyes have adjusted to the darkness.\n\nYou sit with this for a moment.\n\nThe same color as the subsurface channels you'll see later, if Sam's notes were accurate. The same color as what you'll describe in court, if it ever comes to that.\n\nSomething below the supply path has the same fundamental light signature as whatever is under the dig site.",
        choices: [{
            text: "Seal the bag. File it.",
            onSelect: () => {
                decreaseSanity(0.5);
                gameState.knowledgeAtlantean += 1;
                updateHUD();
                startDialogue('ch1_m2_resolution_check');
            }
        }]
    },

    // APPROACH B: Survey the supply route
    'ch1_m2_survey': {
        speaker: "System",
        text: "You walk the full length of the supply route from the gate to the dig site — six hundred meters. You carry a compass, a notepad, and the loupe.\n\nThe first three hundred meters are unremarkable. Packed sand, cart tracks, standard site infrastructure.\n\nAt meter 340 the sand texture changes. Becomes finer. Becomes almost powder. Like the substrate has been processed.\n\nAt meter 380 you find the first one.",
        choices: [
            {
                text: "First what?",
                onSelect: () => {
                    decreaseSanity(1.0);
                    gameState.knowledgeAtlantean += 2;
                    gameState.flags.ch1_m2_survey_done = true;
                    gameState.flags.Supply_Markers_Found = true;
                    startDialogue('ch1_m2_survey_markers');
                }
            }
        ]
    },

    'ch1_m2_survey_markers': {
        speaker: "System",
        text: "A stone. Half-buried, unremarkable from a distance. But when you crouch over it with the loupe you can see the surface has been incised. A single glyph. Small. Precise.\n\nYou have seen this glyph before. It is on the Codex. The one that appears when the tablet's surface temperature rises.\n\nYou find nine more over the next two hundred meters. Ten markers total, placed at irregular intervals along the supply route, all incised with the same glyph. They were placed here before any modern excavation — the erosion on the incisions indicates decades, possibly centuries.\n\nSomeone marked this path a very long time ago. Marked it for someone who would know what the glyph meant.",
        choices: [
            {
                text: "Photograph all ten. Leave them in place.",
                onSelect: () => {
                    gameState.knowledgeCodex += 2;
                    gameState.knowledgeHermetic += 1;
                    updateHUD();
                    startDialogue('ch1_m2_resolution_check');
                }
            },
            {
                text: "Take the smallest one. Physical evidence trumps photographs.",
                onSelect: () => {
                    gameState.knowledgeCodex += 1;
                    gameState.repLocal -= 1;
                    if (!gameState.inventory.includes('Marked_Stone')) gameState.inventory.push('Marked_Stone');
                    updateHUD();
                    startDialogue('ch1_m2_resolution_check');
                }
            }
        ]
    },

    // APPROACH C: Find the night-shift workers
    'ch1_m2_nightshift': {
        speaker: "System",
        text: "The four men who abandoned the path last night are sleeping in the far corner of the dormitory — or trying to. Their cots are pulled together in a way that looks unconscious but isn't: they positioned themselves so each man has at least one other man in his peripheral vision.\n\nYou've seen this before. Once. In a hospital. After something that should not have happened did.\n\nThe youngest one opens his eyes as you approach. He is not surprised to see you.",
        choices: [
            {
                text: "'What did you see on the supply path last night?'",
                onSelect: () => {
                    startDialogue('ch1_m2_nightshift_saw');
                }
            },
            {
                text: "Sit down nearby and wait for one of them to speak first.",
                onSelect: () => {
                    gameState.repLocal += 2;
                    startDialogue('ch1_m2_nightshift_wait');
                }
            }
        ]
    },

    'ch1_m2_nightshift_saw': {
        speaker: "Worker (Yusuf)",
        text: "He sits up slowly. He has the voice of a man describing a car accident — flat with the effort of staying factual.\n\n'We were at the midpoint junction. Cart three hit something — a rut, I thought. I went to look at the axle. And then the ground lit up. Beneath us. Through the sand. Like amber light. Like someone had lit a lamp under a blanket.\n\n'It was on for maybe four seconds. When it went off, the axle was glass. And there was a sound. A single sound. The way a bell sounds when you stop it with your hand.'\n\nHe pauses.\n\n'After that sound, every man on the path turned around and walked back to camp. Nobody said to. We just did. I have thought about this all day and I do not know why we did.'\n\nHe looks at his hands.\n\n'I want to go home, Doctor. I do not want to go home. This is both things at once.'",
        choices: [
            {
                text: "'I believe you. Every word.'",
                onSelect: () => {
                    gameState.trustTariq += 1;
                    gameState.repLocal += 3;
                    gameState.knowledgeAtlantean += 2;
                    gameState.flags.ch1_m2_nightshift_done = true;
                    gameState.flags.Supply_Amber_Light_Witnessed = true;
                    updateHUD();
                    startDialogue('ch1_m2_nightshift_believe');
                }
            },
            {
                text: "Ask about the bell sound specifically.",
                onSelect: () => {
                    gameState.knowledgeAtlantean += 1;
                    gameState.knowledgeCodex += 1;
                    gameState.flags.ch1_m2_nightshift_done = true;
                    gameState.flags.Supply_Amber_Light_Witnessed = true;
                    startDialogue('ch1_m2_nightshift_bell');
                }
            }
        ]
    },

    'ch1_m2_nightshift_believe': {
        speaker: "Worker (Yusuf)",
        text: "He nods slowly. The controlled flatness in his voice cracks a little, then reseals.\n\n'Most people say we were tired. Or that we were afraid of nothing.'\n\n'You're not afraid of nothing.'\n\nHe nods again. That is all.\n\nHe lies back down on the cot, facing the ceiling, eyes open. He will not sleep again tonight. Neither will you.",
        choices: [{
            text: "Leave them to it.",
            onSelect: () => {
                updateHUD();
                startDialogue('ch1_m2_resolution_check');
            }
        }]
    },

    'ch1_m2_nightshift_bell': {
        speaker: "Worker (Yusuf)",
        text: "'The bell sound.'\n\nHe thinks.\n\n'Have you ever been in a room when a large clock stops? Not ticks — stops. The sound of the silence that comes after the last tick is different from ordinary silence. It has a shape. A weight.\n\n'This was that sound. But the thing that stopped was not a clock. The thing that stopped was something much larger. Something that had been running continuously for a very long time. And it stopped for exactly four seconds while the light was on. And then it started again.'\n\nHe looks at you.\n\n'Four seconds is a long time for something that large to stop. I think it stopped because it heard us.'",
        choices: [{
            text: "Sit with that.",
            onSelect: () => {
                decreaseSanity(1.5);
                gameState.knowledgeAtlantean += 2;
                updateHUD();
                startDialogue('ch1_m2_resolution_check');
            }
        }]
    },

    'ch1_m2_nightshift_wait': {
        speaker: "Worker",
        text: "You sit on an empty cot across from them. You don't speak. After a minute, the youngest one starts talking.\n\nHis Arabic is too fast for your vocabulary but the shape of it reaches you — something about light, something about sound, something about the ground having a pulse like a living thing.\n\nAfter he finishes, the oldest man says something short. The youngest translates, in halting English:\n\n'He says: \"The path was marked. We have known it was marked for years. We never said anything because marked ground is bad luck to discuss. Now we wish we had said something.\"'",
        choices: [{
            text: "'What do you mean, marked?'",
            onSelect: () => {
                gameState.knowledgeHermetic += 2;
                gameState.knowledgeAtlantean += 1;
                gameState.flags.ch1_m2_nightshift_done = true;
                gameState.flags.Supply_Path_Marked = true;
                updateHUD();
                startDialogue('ch1_m2_resolution_check');
            }
        }]
    },

    // Mission 2 resolution
    'ch1_m2_resolution_check': {
        speaker: "System",
        text: () => {
            const axleScience = gameState.flags.Supply_Epicenter_Mapped || gameState.inventory.includes('Axle_Fragment');
            const ambientWitness = gameState.flags.Supply_Amber_Light_Witnessed;
            const markers = gameState.flags.Supply_Markers_Found || gameState.flags.Supply_Path_Marked;

            if (axleScience && ambientWitness) {
                return "Two independent verification tracks. Scientific evidence from the axle geometry, and a credible eyewitness account of the light and the bell sound.\n\nYou don't have a theory yet that fits both. What you have is a pattern: the subsurface structure is reacting to the excavation. The reaction is becoming more demonstrative. Each night, slightly more than the last.\n\nThat is a trajectory. Trajectories end somewhere.";
            } else if (markers && (axleScience || ambientWitness)) {
                return "Someone marked this path before your permit was filed. And the thing that path was marked to lead to has started reacting to your presence.\n\nThe question is whether the markers were a warning — stay away from here — or an invitation — this is the way in.\n\nBased on the Codex, based on Sam's notes, based on Tariq's grandfather's story: you think invitation.";
            } else {
                return "You've documented enough. The supply path failure wasn't mechanical. The equipment was affected by whatever is below the site. You've established a pattern connecting the trench, the supply path, and the generator zone.\n\nDocument it. Move on to the last investigation.";
            }
        },
        choices: [{
            text: "Write it up. Close the supply line investigation.",
            onSelect: () => {
                gameState.flags.ch1_mission2_complete = true;
                updateHUD();
                startDialogue('ch1_m2_complete');
            }
        }]
    },

    'ch1_m2_complete': {
        speaker: "Ellis",
        text: () => {
            if (gameState.flags.Supply_Amber_Light_Witnessed) {
                return "Journal entry, 22:41: 'Supply path anomaly confirmed by worker testimony — amber light emission from substrate, bell-tone resonance preceding mass cart failure. Light consistent with Codex surface shimmer. Working theory: single subsurface source affecting both zones.\n\nThree words I keep avoiding writing: it is awake.'";
            }
            return "Journal entry, 22:41: 'Supply path failure pattern points to same subsurface origin as trench anomaly. Not coincident. One source. It is expanding outward, or the excavation is closing inward toward it.\n\nOne more investigation. Then the tunnel.'";
        },
        choices: [{
            text: "Continue.",
            onSelect: () => startDialogue('ch1_missions_status')
        }]
    },


    // =========================================================
    // MISSION 3: THE GENERATOR INVESTIGATION
    // (Who — or what — is the figure in the dark?)
    // =========================================================

    'ch1_m3_entry': {
        speaker: "System",
        text: () => {
            if (gameState.flags.ch1_mission3_complete) {
                return "The generator. Whatever was standing behind it has not appeared again. You've documented what you could. It's enough.";
            }
            if (!gameState.flags.watcherResolved) {
                return "You saw something behind the generator pallet. Deal with the trench and supply path first — the site needs to be stable before you go looking for figures in the dark.";
            }
            return "The generator compound. Loud, functional, surrounded by fuel cans and cable runs.\n\nYou saw a figure here. Tariq either didn't see it or said he didn't. The question of which one is true is itself significant.\n\nThree ways to investigate.";
        },
        choices: [
            {
                text: "Search the compound for physical evidence of the figure.",
                onSelect: () => {
                    if (!gameState.flags.watcherResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission3_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m3_physical');
                }
            },
            {
                text: "Press Tariq for the truth about what he saw.",
                onSelect: () => {
                    if (!gameState.flags.watcherResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission3_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m3_tariq');
                }
            },
            {
                text: "Wait here in the dark until it comes back.",
                onSelect: () => {
                    if (!gameState.flags.watcherResolved) { closeDialogue(); return; }
                    if (gameState.flags.ch1_mission3_complete) { closeDialogue(); return; }
                    startDialogue('ch1_m3_wait');
                }
            },
            {
                text: "Leave it for now.",
                onSelect: () => closeDialogue()
            }
        ]
    },

    // APPROACH A: Physical search
    'ch1_m3_physical': {
        speaker: "System",
        text: "You start at the pallet where the figure was standing and work outward in a grid.\n\nThe sand here should hold prints well — it's fine-grained and the generator heat keeps it just warm enough to hold impressions. You find worker boots going in every direction. Your own prints from earlier.\n\nBehind the pallet: nothing. Which is the finding. A person standing on fine warm sand for any duration will leave a depression. Even a light person, standing still for thirty seconds, leaves a trace.\n\nNo depression. No disturbed sand. No impression of any kind.\n\nThen you find the smell.",
        choices: [{
            text: "The smell?",
            onSelect: () => {
                decreaseSanity(1.0);
                gameState.knowledgeAtlantean += 2;
                gameState.flags.ch1_m3_physical_done = true;
                gameState.flags.Watcher_No_Prints = true;
                startDialogue('ch1_m3_physical_smell');
            }
        }]
    },

    'ch1_m3_physical_smell': {
        speaker: "System",
        text: "Old incense. Specifically: kyphi — the ancient Egyptian temple blend. Cedar, myrrh, raisins, wine, juniper. You only know this because you spent three weeks at the Cairo Museum reading the New Kingdom temple records with Sam.\n\nKyphi was used for one specific ritual purpose: to facilitate communication between the living and the inhabitants of the Duat. The underworld.\n\nThe scent is not coming from the sand. It is coming from the air at approximately head height, concentrated in the space where the figure was standing. Like someone burning incense has been standing here for a long time and has recently left.\n\nYou look down at the sand one more time. Still no footprints.\n\nSomething was standing here that does not weigh what a person weighs.",
        choices: [{
            text: "Step back. Document it.",
            onSelect: () => {
                gameState.knowledgeHermetic += 2;
                gameState.knowledgeAtlantean += 1;
                updateHUD();
                startDialogue('ch1_m3_resolution_check');
            }
        }]
    },

    // APPROACH B: Press Tariq
    'ch1_m3_tariq': {
        speaker: "System",
        text: () => {
            if (gameState.trustTariq >= 3 || gameState.flags.Tariq_Confessed_Unease || gameState.flags.tariq_grandfather_full) {
                return "You find Tariq at the brazier. He looks up when you approach with the expression of a man who has been expecting this conversation.";
            }
            return "You find Tariq at the camp edge, smoking his third cigarette since you last spoke. He looks up when you approach.";
        },
        choices: [
            {
                text: "'You saw the figure. Tell me what you know about it.'",
                onSelect: () => {
                    if (gameState.trustTariq >= 3 || gameState.flags.tariq_grandfather_full) {
                        startDialogue('ch1_m3_tariq_high_trust');
                    } else {
                        startDialogue('ch1_m3_tariq_low_trust');
                    }
                }
            },
            {
                text: "'I'm not angry. I just need to know if it's real.'",
                onSelect: () => {
                    if (gameState.trustTariq >= 1) {
                        startDialogue('ch1_m3_tariq_gentle');
                    } else {
                        startDialogue('ch1_m3_tariq_low_trust');
                    }
                }
            }
        ]
    },

    'ch1_m3_tariq_high_trust': {
        speaker: "Tariq",
        text: "He puts the cigarette out on the edge of the brazier.\n\n'Yes. I saw it.'\n\nHe is quiet for long enough that you don't fill the silence.\n\n'My grandfather described it. In the same language he used for everything about this site — careful, neutral, the language of a man choosing every word like he's crossing a rope bridge.\n\nHe said a figure appeared three times during the 1954 dig. Always near a heat source. Never leaving prints. Always smelling of temple incense. He said the British archaeologist believed it was a guardian — something the old priests left running, the way you leave a machine running. Not alive in any sense he could define. But present.\n\nHe said the correct response was to neither approach nor flee. To witness it. Let it witness you. Then go back to work.'\n\nTariq looks at you.\n\n'He also said it appeared more frequently as the dig got closer to the chamber. I am telling you this because I think you should know the rate of frequency we are on.'",
        choices: [
            {
                text: "'How many times have you seen it?'",
                onSelect: () => {
                    decreaseSanity(1.0);
                    gameState.knowledgeAtlantean += 3;
                    gameState.knowledgeHermetic += 1;
                    gameState.trustTariq += 1;
                    gameState.flags.ch1_m3_tariq_done = true;
                    gameState.flags.Watcher_Confirmed_Real = true;
                    gameState.flags.Tariq_Lied_About_Watcher = false;
                    startDialogue('ch1_m3_tariq_frequency');
                }
            },
            {
                text: "'Thank you for telling me.'",
                onSelect: () => {
                    gameState.trustTariq += 2;
                    gameState.knowledgeAtlantean += 2;
                    gameState.flags.ch1_m3_tariq_done = true;
                    gameState.flags.Watcher_Confirmed_Real = true;
                    updateHUD();
                    startDialogue('ch1_m3_resolution_check');
                }
            }
        ]
    },

    'ch1_m3_tariq_frequency': {
        speaker: "Tariq",
        text: "He picks up a new cigarette and doesn't light it.\n\n'Tonight was the fifth time. In twenty-two days.'\n\nA pause.\n\n'My grandfather said he saw it three times in six weeks before the tunnel opened. We are ahead of pace.'\n\nHe looks at the generator.\n\n'I will tell you one more thing. The first time I saw it, four days into the dig, I was alone and I spoke to it. I said, in Arabic, \"We mean no harm. We are here to understand.\" It turned toward me for the first time. All four previous appearances, it faced toward the site.\n\nWhen I said that, it turned and looked at me. For three full seconds.\n\nThen it went back to looking at the site.'\n\nHe puts the unlit cigarette behind his ear.\n\n'I believe it understood me. I am not comfortable with that.'",
        choices: [{
            text: "Sit with that for a moment.",
            onSelect: () => {
                decreaseSanity(0.5);
                gameState.trustTariq += 1;
                updateHUD();
                startDialogue('ch1_m3_resolution_check');
            }
        }]
    },

    'ch1_m3_tariq_gentle': {
        speaker: "Tariq",
        text: "He looks at the generator. The generator looks back, indifferently.\n\n'I saw it.'\n\nHe says it with no preface, no lead-up.\n\n'I told you I didn't because there are twelve men on this crew whose nerve I am responsible for. If I confirm the archaeologist is seeing figures in the dark, half of them walk by morning. We need the labor until the tunnel is cleared.'\n\nHe meets your eyes.\n\n'I will not lie to you again about something I have seen. That is the limit of what I'm able to promise. But I need you to understand why I did it once.'",
        choices: [
            {
                text: "'I understand. Thank you.'",
                onSelect: () => {
                    gameState.trustTariq += 2;
                    gameState.knowledgeAtlantean += 1;
                    gameState.flags.ch1_m3_tariq_done = true;
                    gameState.flags.Watcher_Confirmed_Real = true;
                    updateHUD();
                    startDialogue('ch1_m3_resolution_check');
                }
            },
            {
                text: "'What do you think it is?'",
                onSelect: () => {
                    startDialogue('ch1_m3_tariq_what');
                }
            }
        ]
    },

    'ch1_m3_tariq_what': {
        speaker: "Tariq",
        text: "'I think it is a custodian. Something left to watch the site until the right person arrived. I think that is you.'\n\nHe lights the cigarette finally.\n\n'My grandfather's word for it was hafiz — a guardian, a keeper. He said the old priesthoods built things to last. Not buildings. Functions. Patterns that sustain themselves. He believed the custodian was not a ghost. He believed it was a program, running on the logic of the site itself.\n\nHe was a foreman on a dig in 1954. He read no philosophy. He arrived at this independently.'\n\nTariq exhales.\n\n'This is either very interesting or very terrifying. I have not yet determined which.'",
        choices: [{
            text: "'Both, I think.'",
            onSelect: () => {
                gameState.trustTariq += 1;
                gameState.knowledgeHermetic += 2;
                gameState.knowledgeAtlantean += 1;
                gameState.flags.ch1_m3_tariq_done = true;
                gameState.flags.Watcher_Confirmed_Real = true;
                updateHUD();
                startDialogue('ch1_m3_resolution_check');
            }
        }]
    },

    'ch1_m3_tariq_low_trust': {
        speaker: "Tariq",
        text: "He looks at you with the particular patience of a man who has been accused of things before.\n\n'Doctor. I told you what I saw. If you have a different theory about what happened, I would be interested to hear it when you have evidence for it. Until then.'\n\nHe goes back to his cigarette.\n\nHe is not lying. He is protecting something. The distinction is clear in the tilt of his head, the care with which he doesn't look at the generator.",
        choices: [
            {
                text: "Try a different angle.",
                onSelect: () => startDialogue('ch1_m3_entry')
            },
            {
                text: "Let it go for now.",
                onSelect: () => closeDialogue()
            }
        ]
    },

    // APPROACH C: Wait in the dark
    'ch1_m3_wait': {
        speaker: "System",
        text: "You kill your headlamp and find a position behind the water barrel cluster, with a clear sightline to the generator pallet. You have been still long enough that the sand around your boots is cold.\n\nThe site sounds: the generator. Wind from the north. Distant Arabic voices from the dormitory. The creak of the canvas tent.\n\nYou wait.\n\nAt 23:07, by your watch, the temperature drops two degrees in the space of a single breath. Not a gust — a drop, sudden and local, as if the heat has been drawn out of the immediate air by something absorbing it.",
        choices: [{
            text: "Don't move.",
            onSelect: () => {
                decreaseSanity(2.0);
                gameState.flags.ch1_m3_wait_done = true;
                startDialogue('ch1_m3_wait_appear');
            }
        }]
    },

    'ch1_m3_wait_appear': {
        speaker: "System",
        text: "It is there.\n\nNot appearing — already there, as though it stepped out of a fold in the dark rather than crossing the space between not-there and there. Standing in the same position as before, facing northeast, toward the dig site.\n\nYour first thought, embarrassingly, is that it is taller than you expected. Your second thought, more usefully, is that it has mass. The generator light throws a shadow behind it.\n\nIt stands for sixty-three seconds. You count.\n\nThen it turns its head.\n\nNot toward you. Toward the tent. Toward the Codex.",
        choices: [
            {
                text: "Hold completely still. Let it do what it came to do.",
                onSelect: () => {
                    decreaseSanity(1.0);
                    gameState.knowledgeAtlantean += 3;
                    gameState.flags.Watcher_Confirmed_Real = true;
                    gameState.flags.Watcher_Watched_Codex = true;
                    startDialogue('ch1_m3_wait_observe');
                }
            },
            {
                text: "Stand up. Make yourself visible.",
                onSelect: () => {
                    decreaseSanity(1.5);
                    gameState.knowledgeAtlantean += 2;
                    gameState.trustTariq += 1;
                    gameState.flags.Watcher_Confirmed_Real = true;
                    gameState.flags.Watcher_Acknowledged_Ellis = true;
                    startDialogue('ch1_m3_wait_confront');
                }
            }
        ]
    },

    'ch1_m3_wait_observe': {
        speaker: "System",
        text: "You stay behind the barrel.\n\nIt looks at the tent for twenty-two seconds. Then it looks at you.\n\nYou do not know how it knows where you are. You have not moved. You have not made a sound. The wind is moving away from it, not toward it.\n\nIt looks at you with no face — no features you can read — and something passes between you anyway. Not a threat. Not an invitation. Something more like recognition. The way two people in a foreign country recognize each other as speakers of the same language without having spoken yet.\n\nThen it simply isn't there.\n\nThe temperature rises back to ambient in approximately four seconds.\n\nYou sit in the dark behind the barrel for another fifteen minutes before you trust your legs to work.",
        choices: [{
            text: "Stand up. Go back to the tent.",
            onSelect: () => {
                updateHUD();
                startDialogue('ch1_m3_resolution_check');
            }
        }]
    },

    'ch1_m3_wait_confront': {
        speaker: "System",
        text: "You stand up.\n\nIt does not flinch. It does not retreat. It simply turns to face you fully, and for the first time since you arrived at this site you have the thing's complete attention.\n\nYou have no idea what to do with its attention.\n\nYou raise one hand. A completely instinctual gesture. The universal signal that means nothing threatening.\n\nIt holds for three seconds.\n\nThen it raises one of its own limbs. The proportions are almost right. The gesture is almost right. It has learned it from watching you — or from watching someone like you before you.\n\nThen it is gone. The incense smell lingers for ninety seconds. Then that is gone too.",
        choices: [{
            text: "Put your hand down slowly.",
            onSelect: () => {
                gameState.knowledgeAtlantean += 1;
                updateHUD();
                startDialogue('ch1_m3_resolution_check');
            }
        }]
    },

    // Mission 3 resolution
    'ch1_m3_resolution_check': {
        speaker: "System",
        text: () => {
            const tariqConfirmed = gameState.flags.Watcher_Confirmed_Real && gameState.flags.ch1_m3_tariq_done;
            const watched = gameState.flags.Watcher_Watched_Codex;
            const acknowledged = gameState.flags.Watcher_Acknowledged_Ellis;
            const noFootprints = gameState.flags.Watcher_No_Prints;

            if (acknowledged) {
                return "You stood up in the dark and it mirrored you.\n\nThis is either the most important moment in your professional life or evidence that you have been awake for too many consecutive hours. You are aware both interpretations are live.\n\nBut here is what is inarguable: something is maintaining a watch on this site. It has been doing so for longer than this excavation. It responded to contact. It is interested in the Codex.\n\nIf Tariq's grandfather was right — if this is a program, a function running on the logic of the site — then what you just did is equivalent to knocking on the door.\n\nYou knocked. Something knocked back.";
            } else if (watched) {
                return "It looked at the Codex.\n\nNot at the tent. At the specific location of the Codex within the tent, through canvas, at night, from forty meters away.\n\nIt knows what the Codex is. It has been watching the Codex. Its presence on this site correlates not with the excavation permit, not with your arrival, but with the moment the Codex was first exposed on Day 17.\n\nThe Codex is the reason it is here. Which makes the Codex either a key or a beacon.\n\nPossibly both.";
            } else if (tariqConfirmed) {
                return "Tariq has seen it five times. His grandfather saw it three times in 1954 before the tunnel opened. It leaves no physical trace. It responds to direct address.\n\nIt is not a person. It is a function. Something left running by people who understood this site better than anyone currently living — including you.\n\nIts presence is not a threat indicator. It is a threshold indicator. You are close to what it is guarding.";
            } else if (noFootprints) {
                return "No footprints. No physical trace except a scent that has no legitimate business being in a dig site in 2024.\n\nYou know the smell. You know what it was used for. The Egyptians believed kyphi bridged the living world and the Duat — the realm below.\n\nSomething is standing at the generator compound that exists on the boundary of those two things. You have documented it. You cannot explain it within any framework you currently possess.";
            }
            return "You have established that the figure is real, not a fatigue hallucination, and connected to the subsurface structure. It has been watching the site for weeks. It is watching the Codex. Close this investigation and prepare for the tunnel.";
        },
        choices: [{
            text: "Write it up. Close the generator investigation.",
            onSelect: () => {
                gameState.flags.ch1_mission3_complete = true;
                updateHUD();
                startDialogue('ch1_m3_complete');
            }
        }]
    },

    'ch1_m3_complete': {
        speaker: "Ellis",
        text: () => {
            if (gameState.flags.Watcher_Acknowledged_Ellis) {
                return "Journal entry, 23:31. You sit at the desk in the tent and write for a long time.\n\nThe Codex, on the table beside you, pulses three times while you write. You do not note it in the entry. Some things you are keeping off the record until you understand what record they belong to.\n\nYou write the last line: 'Three investigations complete. The site is over a structure. The structure is active. The custodian has acknowledged us. The trench, the supply path, and the generator zone are all aspects of the same event.\n\nTomorrow I go down.'";
            }
            return "Journal entry, 23:31: 'Three investigations complete. Site sits over active subsurface structure. Figure at generator is a custodial function, not human, tied to the Codex and the dig proximity. All three anomalies are one event, expanding.\n\nThe tunnel is next.'";
        },
        choices: [{
            text: "Close the journal.",
            onSelect: () => {
                startDialogue('ch1_missions_status');
            }
        }]
    },


    // =========================================================
    // MISSION STATUS CHECK — fires after each mission closes
    // Checks if all three are done → unlocks tunnel
    // =========================================================

    'ch1_missions_status': {
        speaker: "System",
        text: () => {
            const m1 = gameState.flags.ch1_mission1_complete;
            const m2 = gameState.flags.ch1_mission2_complete;
            const m3 = gameState.flags.ch1_mission3_complete;

            if (m1 && m2 && m3) {
                return "Three sites investigated. Three independent anomalies documented. One source.\n\nThe tunnel has been waiting for someone who understood enough to go down it with their eyes open.\n\nYou are, apparently, that person.";
            }

            let remaining = [];
            if (!m1) remaining.push("the trench");
            if (!m2) remaining.push("the supply line");
            if (!m3) remaining.push("the generator");

            const r = remaining.join(' and ');
            return `Still outstanding: ${r}.\n\nFinish the investigations before you go north. The tunnel will still be there.`;
        },
        choices: [{
            text: () => {
                const m1 = gameState.flags.ch1_mission1_complete;
                const m2 = gameState.flags.ch1_mission2_complete;
                const m3 = gameState.flags.ch1_mission3_complete;
                return (m1 && m2 && m3) ? "Go to the tunnel." : "Continue working.";
            },
            onSelect: () => {
                const m1 = gameState.flags.ch1_mission1_complete;
                const m2 = gameState.flags.ch1_mission2_complete;
                const m3 = gameState.flags.ch1_mission3_complete;
                if (m1 && m2 && m3) {
                    startDialogue('ch1_all_missions_complete');
                } else {
                    closeDialogue();
                }
            }
        }]
    },

    'ch1_all_missions_complete': {
        speaker: "System",
        text: () => {
            let base = "You stand in the tent for a moment before you go.\n\nThe Codex is on the table. The floodlights are cutting their usual geometry through the tent canvas. The camp sounds are the same — workers, generator, wind — and you are not the same person who arrived here twenty-two days ago, but you carry the same name and the same debt to Sam and the same obligation to the truth, however large it turns out to be.";

            if (gameState.flags.tariq_grandfather_full) {
                base += "\n\nTariq's grandfather said: do not trust what the stone tells you, but do not lie about what you saw. Write the truth in a place only you can find it.\n\nYou have been writing. Now you go see what the truth is.";
            } else if (gameState.flags.Watcher_Acknowledged_Ellis) {
                base += "\n\nSomething in the dark acknowledged you. You acknowledged it back. Whatever comes next, you went in with your eyes open. That has to count for something.";
            } else {
                base += "\n\nThe work is what it is. You understand enough to proceed. The tunnel is north.";
            }

            return base;
        },
        choices: [{
            text: "Pick up the Codex. Go north.",
            onSelect: () => {
                gameState.flags.scene3Triggered = true;
                if (!gameState.inventory.includes('The Codex')) gameState.inventory.push('The Codex');
                updateHUD();
                closeDialogue();
            }
        }]
    },


    // =========================================================
    // PUZZLE SCENES (referenced by PUZZLES system in engine.js)
    // =========================================================

    'puzzle_start_glyph_lock': {
        speaker: "System",
        text: "A stone panel is set into the tunnel approach wall. Four glyph symbols are inset into its surface, each capable of being pressed.\n\nBeside the panel, scratched into the stone in faint modern pencil: a sequence of four numbers. Sam's handwriting.\n\nSam was here. Sam knew the sequence.",
        choices: [
            {
                text: "Try the combination. (Opens puzzle)",
                onSelect: () => {
                    if (gameState.flags.glyph_lock_solved) {
                        startDialogue('puzzle_glyph_already');
                    } else {
                        startPuzzle('puzzle_glyph_lock');
                    }
                }
            },
            { text: "Leave it.", onSelect: () => closeDialogue() }
        ]
    },

    'puzzle_glyph_already': {
        speaker: "System",
        text: "The lock is already open. The glyph panel's mechanism has disengaged. The tunnel is clear.",
        choices: [{ text: "Continue.", onSelect: () => closeDialogue() }]
    },

    'puzzle_glyph_solved': {
        speaker: "System",
        text: "The four glyphs flash gold in sequence. A deep mechanical sound — old stone moving on old stone — comes from within the tunnel wall.\n\nA section of rock face beside the main tunnel mouth swings inward, revealing a second passage, narrower, lower.\n\nSam found this. Sam left the solution written down. He wanted someone to follow him.",
        choices: [{
            text: "Go through.",
            onSelect: () => {
                gameState.knowledgeCodex += 2;
                gameState.flags.glyph_lock_solved = true;
                updateHUD();
                closeDialogue();
            }
        }]
    },

    'puzzle_glyph_fail': {
        speaker: "System",
        text: "Wrong sequence. The panel flashes red and something releases with a hiss from the wall — a dart, fired at shin height, that buries itself in the opposite timber brace.\n\nYou stand very still.\n\nThe mechanism resets. The dart is cedar-wood, extremely old. The tip has dried to a dark resin. You do not touch the tip.",
        choices: [{
            text: "Try again more carefully.",
            onSelect: () => {
                decreaseSanity(0.3);
                updateHUD();
                closeDialogue();
            }
        }]
    },

    // =========================================================
    // END PHASE 3
    // =========================================================
};
