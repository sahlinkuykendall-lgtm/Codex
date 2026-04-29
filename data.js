let WORLD = { width: 2400, height: 2200 };

// currentMapKey drives wall & object lookups. Set by each loadChapter function.
let currentMapKey = 1;

const gameState = {
    currentScreen: 'START_MENU', chapter: 1, sanity: 10.0, maxSanity: 10.0, sanityState: 'CALM', isResting: false, restTimer: 0,
    // Reputation tracks (all three from the Bible)
    repLocal: 0, repAcademic: 0, repMinistry: 0,
    // Knowledge tracks
    knowledgeCodex: 0, knowledgeHermetic: 0, knowledgeAtlantean: 0,
    // Economy & body count
    funds: 2000, bodyCount: 0,
    // Route & companions
    currentRoute: null,
    trustTariq: 0, trustMaren: 0, trustIry: 0, trustYusra: 0,
    // Inventory & consumables
    inventory: ['Field Journal'], mintTeaCount: 0, usedRestSites: [],
    // Stamina system
    stamina: 10.0, maxStamina: 10.0, isSprinting: false,
    // Walking bob (animation)
    walkBobPhase: 0,
    // Pause menu state
    isPaused: false,
    flags: {
        // --- Chapter 1 ---
        eastTrenchResolved: false, cartsResolved: false, watcherResolved: false, scene3Triggered: false,
        memorializedPartner: false, readManifest: false, heardSand: false,
        Codex_Pulse_Felt: false, Crystalline_Structure_Noted: false, Codex_Sketch_Captured: false,
        Sound_Logged: false, Tariq_Primed: false, Codex_Addressed: false, Codex_Is_Watching: false,
        Tariq_Rank_Pulled: false, Tariq_Confessed_Unease: false,
        East_Trench_Crossed: false, Subsurface_Vibration_Felt: false, Paid_For_Risk: false,
        East_Trench_Avoided: false, Tariq_Grandfather_Story: false, Ellis_Worked_Hands: false,
        Bonus_Offered: false, Watched_By_Stranger: false, Watcher_Confirmed_Real: false,
        Tariq_Lied_About_Watcher: false, Watcher_Logged: false, Someone_Knew_To_Listen: false,
        Took_The_Risk: false,
        // New Ch1 expansion flags
        satphone_used: false, called_ex_wife: false, called_department: false, called_sams_sister: false,
        flashback_sam_done: false, inspector_dealt: false, inspector_bribed: false,
        tariq_grandfather_full: false, night_watch_done: false,
        // Flavor/lore flags
        stars_watched: false, sam_waypoint_found: false, cooking_ate: false,
        crates_investigated: false, ministry_watching: false, drum_searched: false,
        sams_second_dig_known: false, workers_afraid: false, watered_sams_tree: false,
        crew_missing: false,
        // --- Chapter 2 discovery flags ---
        sam_was_here_first: false, city_sequence_known: false, city_mirror_known: false,
        city_chose_vance: false, samir_promised_out: false, ch2StashLooted: false, ch2BonesChecked: false, tariqUntied: false,
        trapPlate1Sprung: false, trapPlate2Sprung: false, trapDoorChecked: false,
        trapWhispersHeard: false, trapMuralRead: false,
        samirTalked: false, samirCompanionUsed: false,
        borosTalked: false,
        ch2AmberTouched: false, ch2ChasmLooked: false,
        altarSolved: false, gateUnlocked: false,
        ch2_statue_seen: false, ch2_urn_seen: false,
        // --- Chapter 3 ---
        marketPassword: false, samirAlive: true,
        Saqqara_Was_Arranged: false, Asked_About_Sam: false, Market_Cat_Pet: false,
        // --- Chapter 4 ---
        iryQuestionAccepted: false, iryQuestionRefused: false, iryRevealedNature: false,
        iryCompanionUsed: false,
        ch4HeartVisited: false, ch4CodexRead: false,
        // --- Chapter 5 ---
        halberdMet: false, standoffResolved: false, Ellis_Attacked_Halberd: false,
        tariqFlatVisited: false,
        // --- Chapter 6 ---
        halberdFarewellDone: false,
        // --- Chapter 7 ---
        ch7CodexRead: false, ch7SecondRead: false,
        // --- Story Flags (Bible) ---
        Non_Human_Architect_Suspected: false, Secret_Route_Entered: false,
        Tablets_Resonated: false, The_City_Is_Awake: false,
        Tariq_Grandfather_Story_Told: false
    },
    isDialogueActive: false, activeInteractableId: null
};


// ============================================================
// MAP WALLS
// All maps are much larger now (3200-4000px across).
// Ch1 = Giza dig site. Ch3 = Cairo market district.
// Other chapters retain structure but are also enlarged.
// Zone gates (locked areas) defined as wall objects with
// a 'gate' property — engine checks mission flags before
// allowing passage.
// ============================================================

const mapWalls = {

    // ============================================================
    // CHAPTER 1 — GIZA DIG SITE  (4000 x 3600)
    // Layout: player starts south-center. North = dig tunnels.
    // West = worker camp. East = ministry road + perimeter.
    // Paths cut between buildings and terrain features.
    // ============================================================
    1: [
        // Dig zone gate — blocks north access until all missions complete
        { x: 40,   y: 1045, w: 955,  h: 30                                       },
        { x: 1205, y: 1045, w: 1155, h: 30                                       },
        { x: 1000, y: 1045, w: 200,  h: 30, isGate: true, gateFlag: 'scene3Triggered' },

        // World border
        { x: 0,    y: 0,    w: 2400, h: 40   },
        { x: 0,    y: 0,    w: 40,   h: 2200 },
        { x: 0,    y: 2160, w: 2400, h: 40   },
        { x: 2360, y: 0,    w: 40,   h: 2200 },

        // === SOUTH: Entry road fence (pushed south for walking room) ===
        { x: 40,   y: 2020, w: 580,  h: 20   }, // west fence (ends at x:620)
        { x: 820,  y: 2020, w: 560,  h: 20   }, // mid fence (starts at x:820, gap x:620-820 = 200px)
        { x: 1520, y: 2020, w: 600,  h: 20   }, // mid-east fence
        { x: 2260, y: 2020, w: 100,  h: 20   }, // east fence
        // Gate posts flanking the entry — 200px gap between them
        { x: 600,  y: 1990, w: 30,   h: 60   }, // left post
        { x: 820,  y: 1990, w: 30,   h: 60   }, // right post
        // Supply trucks / ministry vehicles (solid, south of fence)
        { x: 200,  y: 2070, w: 180,  h: 80   },
        { x: 450,  y: 2070, w: 180,  h: 80   },
        { x: 1600, y: 2070, w: 180,  h: 80   },
        { x: 1900, y: 2070, w: 120,  h: 80   },

        // === WEST ZONE: Worker Camp (x:40–680, y:1150–1850) ===
        { x: 40,   y: 1150, w: 640,  h: 20   }, // north fence
        { x: 40,   y: 1150, w: 20,   h: 700  }, // west fence
        { x: 660,  y: 1150, w: 20,   h: 700  }, // east fence
        // No south fence — open

        // Dormitory building walls
        { x: 70,   y: 1200, w: 220,  h: 20   },
        { x: 70,   y: 1200, w: 20,   h: 140  },
        { x: 270,  y: 1200, w: 20,   h: 140  },
        { x: 70,   y: 1340, w: 80,   h: 20   }, // gap x:150-230
        { x: 230,  y: 1340, w: 60,   h: 20   },

        // Foreman's office walls
        { x: 340,  y: 1200, w: 200,  h: 20   },
        { x: 340,  y: 1200, w: 20,   h: 140  },
        { x: 520,  y: 1200, w: 20,   h: 140  },
        { x: 340,  y: 1340, w: 70,   h: 20   }, // gap x:410-480
        { x: 480,  y: 1340, w: 60,   h: 20   },

        // Camp obstacles (inside worker camp compound only)
        { x: 70,   y: 1480, w: 250,  h: 20   }, // cooking table
        { x: 560,  y: 1270, w: 70,   h: 70   }, // water barrels (inside camp NE corner)

        // === CENTRAL: Ellis Tent Compound (x:780–1330, y:1250–1750) ===
        // Rope fence (visible brown strips) — 3 sides, XL south gap for entry
        { x: 780,  y: 1250, w: 550,  h: 12   }, // north rope
        { x: 780,  y: 1250, w: 12,   h: 500  }, // west rope
        { x: 1318, y: 1250, w: 12,   h: 500  }, // east rope
        // South rope: 350px gap at x:875-1225 — wide open for walking
        { x: 780,  y: 1750, w: 95,   h: 12   },
        { x: 1225, y: 1750, w: 105,  h: 12   },

        // Ellis tent building
        { x: 870,  y: 1280, w: 220,  h: 18   }, // north
        { x: 870,  y: 1280, w: 18,   h: 160  }, // west
        { x: 1072, y: 1280, w: 18,   h: 160  }, // east
        // South wall with wide door gap x:940-1020
        { x: 870,  y: 1440, w: 70,   h: 18   },
        { x: 1020, y: 1440, w: 70,   h: 18   },

        // Gear storage (solid shed in compound, pushed to NE corner)
        { x: 1140, y: 1290, w: 160,  h: 70   },

        // Site office trailer (east of compound, moved east)
        { x: 1500, y: 1290, w: 160,  h: 80   },
        // Generator moved to x:2000 — wall moved too
        { x: 2000, y: 1500, w: 55,   h: 55   },

        // === EAST: Trench ===
        { x: 1750, y: 1200, w: 25,   h: 450  },
        { x: 1950, y: 1200, w: 25,   h: 450  },
        // Trench cross-braces (can step on them between trench walls)
        { x: 1775, y: 1280, w: 175,  h: 18   },
        { x: 1775, y: 1420, w: 175,  h: 18   },
        { x: 1775, y: 1560, w: 175,  h: 18   },

        // === NORTH DIG PERIMETER FENCE ===
        // Main fence at y:1050, gap x:980-1160
        { x: 40,   y: 1050, w: 940,  h: 20   },
        { x: 1160, y: 1050, w: 1200, h: 20   },

        // Dig shed (solid)
        { x: 900,  y: 880,  w: 140,  h: 90   },

        // === TUNNEL ENTRY ZONE (far north) ===
        // Rocky outcrops (large natural walls)
        { x: 40,   y: 400,  w: 350,  h: 180  },
        { x: 40,   y: 650,  w: 260,  h: 130  },
        { x: 1980, y: 400,  w: 380,  h: 180  },
        { x: 2060, y: 640,  w: 300,  h: 140  },
        // Tunnel mouth surround (blocks until Ch2)
        { x: 900,  y: 280,  w: 600,  h: 70   },
        { x: 900,  y: 350,  w: 70,   h: 180  },
        { x: 1430, y: 350,  w: 70,   h: 180  },
        // North boundary rubble
        { x: 40,   y: 220,  w: 2320, h: 35   },

        // === EAST: Ministry perimeter ===
        { x: 2100, y: 1420, w: 160,  h: 120  }, // ministry post
        { x: 2250, y: 1490, w: 90,   h: 70   }, // guard booth

        // NOTE: Cacti, boulders, small ruins, crates, brazier, stakes, palm trees
        // are all DECORATIVE ONLY (rendered via mapObjects deco, no wall collision).
        // This keeps sand areas walkable and prevents invisible-wall frustration.
    ],

    // ============================================================
    // CHAPTER 2 ROUTES — Underground Labyrinth (unchanged structurally)
    // ============================================================
    'TRAP': [
        { x: 0,    y: 0,    w: 3000, h: 50   }, { x: 0,    y: 0,    w: 50,   h: 3000 },
        { x: 0,    y: 2950, w: 3000, h: 50   }, { x: 2950, y: 0,    w: 50,   h: 3000 },
        { x: 500,  y: 0,    w: 100,  h: 2000 }, { x: 1200, y: 500,  w: 100,  h: 2000 },
        { x: 1900, y: 0,    w: 100,  h: 2000 }, { x: 2500, y: 500,  w: 100,  h: 2000 },
        { x: 100,  y: 1000, w: 300,  h: 100  }, { x: 700,  y: 1200, w: 300,  h: 100  },
        { x: 1300, y: 800,  w: 300,  h: 100  }
    ],
    'SECRET': [
        { x: 0,    y: 0,    w: 2500, h: 50   }, { x: 0,    y: 0,    w: 50,   h: 2500 },
        { x: 0,    y: 2450, w: 2500, h: 50   }, { x: 2450, y: 0,    w: 50,   h: 2500 },
        { x: 400,  y: 400,  w: 200,  h: 200  }, { x: 1800, y: 400,  w: 200,  h: 200  },
        { x: 400,  y: 1100, w: 200,  h: 200  }, { x: 1800, y: 1100, w: 200,  h: 200  },
        { x: 400,  y: 1800, w: 200,  h: 200  }, { x: 1800, y: 1800, w: 200,  h: 200  }
    ],
    'CUTTHROAT': [
        { x: 0,    y: 0,    w: 2500, h: 50   }, { x: 0,    y: 0,    w: 50,   h: 2500 },
        { x: 0,    y: 2450, w: 2500, h: 50   }, { x: 2450, y: 0,    w: 50,   h: 2500 },
        { x: 50,   y: 50,   w: 950,  h: 2400 }, { x: 1450, y: 50,   w: 950,  h: 2400 },
        { x: 1050, y: 400,  w: 100,  h: 100  }, { x: 1150, y: 800,  w: 100,  h: 150  },
        { x: 1050, y: 1300, w: 80,   h: 200  }
    ],

    // ============================================================
    // CHAPTER 3 — CAIRO MARKET DISTRICT  (3600 x 3200)
    // Layout: narrow winding alleys, a central plaza with fountain,
    // market stalls creating natural corridors, residential blocks
    // to the north. The Hub (safehouse entry) is north-west.
    // Hookah lounge is east. Yusra's safehouse is behind The Hub.
    // ============================================================
    'MARKET': [
        // World border
        { x: 0,    y: 0,    w: 3600, h: 50   },
        { x: 0,    y: 0,    w: 50,   h: 3200 },
        { x: 0,    y: 3150, w: 3600, h: 50   },
        { x: 3550, y: 0,    w: 50,   h: 3200 },

        // === SOUTH ENTRY — Main road in from tunnel exit ===
        // Road walls / shopfront facades
        { x: 50,   y: 2700, w: 500,  h: 30   }, // south-west block face
        { x: 700,  y: 2700, w: 500,  h: 30   },
        { x: 1400, y: 2700, w: 400,  h: 30   },
        { x: 2000, y: 2700, w: 500,  h: 30   },
        { x: 2700, y: 2700, w: 400,  h: 30   },
        { x: 3250, y: 2700, w: 300,  h: 30   },

        // === CENTRAL PLAZA AREA (around 1600, 2000) ===
        // Fountain surround (player walks around it, can't walk through)
        { x: 1520, y: 1920, w: 160,  h: 20   }, // north wall
        { x: 1520, y: 2060, w: 160,  h: 20   }, // south wall
        { x: 1520, y: 1920, w: 20,   h: 160  }, // west wall
        { x: 1660, y: 1920, w: 20,   h: 160  }, // east wall
        // Benches around plaza
        { x: 1400, y: 1980, w: 80,   h: 30   }, // west bench
        { x: 1720, y: 1980, w: 80,   h: 30   }, // east bench
        { x: 1560, y: 1840, w: 80,   h: 30   }, // north bench
        { x: 1560, y: 2090, w: 80,   h: 30   }, // south bench
        // Plaza pillar posts (four corners)
        { x: 1360, y: 1840, w: 30,   h: 30   },
        { x: 1810, y: 1840, w: 30,   h: 30   },
        { x: 1360, y: 2120, w: 30,   h: 30   },
        { x: 1810, y: 2120, w: 30,   h: 30   },

        // === MARKET STALLS — create natural corridor paths ===
        // West stall row (N-S corridor on left side of market)
        { x: 300,  y: 1400, w: 180,  h: 80   }, // stall 1
        { x: 300,  y: 1600, w: 180,  h: 80   }, // stall 2
        { x: 300,  y: 1800, w: 180,  h: 80   }, // stall 3
        { x: 300,  y: 2000, w: 180,  h: 80   }, // stall 4
        { x: 300,  y: 2200, w: 180,  h: 80   }, // stall 5
        { x: 300,  y: 2400, w: 180,  h: 80   }, // stall 6

        // Inner west stall row
        { x: 700,  y: 1500, w: 160,  h: 70   },
        { x: 700,  y: 1720, w: 160,  h: 70   },
        { x: 700,  y: 1940, w: 160,  h: 70   },
        { x: 700,  y: 2160, w: 160,  h: 70   },
        { x: 700,  y: 2380, w: 160,  h: 70   },

        // East stall row
        { x: 2900, y: 1400, w: 180,  h: 80   },
        { x: 2900, y: 1600, w: 180,  h: 80   },
        { x: 2900, y: 1800, w: 180,  h: 80   },
        { x: 2900, y: 2000, w: 180,  h: 80   },
        { x: 2900, y: 2200, w: 180,  h: 80   },
        { x: 2900, y: 2400, w: 180,  h: 80   },

        // Inner east stall row
        { x: 2500, y: 1500, w: 160,  h: 70   },
        { x: 2500, y: 1720, w: 160,  h: 70   },
        { x: 2500, y: 1940, w: 160,  h: 70   },
        { x: 2500, y: 2160, w: 160,  h: 70   },
        { x: 2500, y: 2380, w: 160,  h: 70   },

        // Cross-alley stalls (E-W corridor breaks)
        { x: 900,  y: 1200, w: 140,  h: 70   },
        { x: 1150, y: 1200, w: 140,  h: 70   },
        { x: 1400, y: 1200, w: 140,  h: 70   },
        { x: 2000, y: 1200, w: 140,  h: 70   },
        { x: 2250, y: 1200, w: 140,  h: 70   },
        { x: 2500, y: 1200, w: 140,  h: 70   },

        // === NORTH DISTRICT — Residential blocks ===
        // Block A (NW)
        { x: 100,  y: 400,  w: 400,  h: 300  },
        // Block B
        { x: 600,  y: 400,  w: 300,  h: 300  },
        // Block C — has internal courtyard (The Hub is here)
        { x: 1000, y: 300,  w: 600,  h: 200  }, // north face
        { x: 1000, y: 300,  w: 30,   h: 300  }, // west face
        { x: 1570, y: 300,  w: 30,   h: 300  }, // east face
        // Block D
        { x: 1750, y: 400,  w: 400,  h: 300  },
        // Block E
        { x: 2250, y: 400,  w: 300,  h: 300  },
        // Block F (NE) — Hookah lounge is here
        { x: 2700, y: 300,  w: 500,  h: 250  }, // north face
        { x: 2700, y: 300,  w: 30,   h: 350  }, // west face
        { x: 3170, y: 300,  w: 30,   h: 350  }, // east face

        // Narrow alley walls (character must walk single-file)
        { x: 550,  y: 700,  w: 20,   h: 400  }, // alley W wall
        { x: 630,  y: 700,  w: 20,   h: 400  }, // alley E wall
        { x: 1700, y: 700,  w: 20,   h: 400  },
        { x: 1780, y: 700,  w: 20,   h: 400  },
        { x: 2600, y: 700,  w: 20,   h: 400  },
        { x: 2680, y: 700,  w: 20,   h: 400  },

        // === DECORATIVE FILL ===
        // Palm trees (south plaza)
        { x: 1300, y: 2600, w: 25,   h: 25   },
        { x: 1900, y: 2600, w: 25,   h: 25   },
        { x: 2200, y: 2550, w: 25,   h: 25   },
        { x: 1100, y: 2550, w: 25,   h: 25   },
        // Small shrine / prayer nook (decorative alcove)
        { x: 200,  y: 1900, w: 60,   h: 60   },
        { x: 200,  y: 2100, w: 60,   h: 60   },
        // Alley dumpsters / debris
        { x: 870,  y: 2500, w: 60,   h: 40   },
        { x: 2200, y: 2500, w: 60,   h: 40   },
        { x: 3300, y: 2000, w: 60,   h: 40   },
        // Parked motorbikes
        { x: 1280, y: 2680, w: 40,   h: 20   },
        { x: 1340, y: 2680, w: 40,   h: 20   },
        { x: 2260, y: 2680, w: 40,   h: 20   },
        // Hanging awning posts
        { x: 480,  y: 1500, w: 15,   h: 15   },
        { x: 480,  y: 1700, w: 15,   h: 15   },
        { x: 480,  y: 1900, w: 15,   h: 15   },
        { x: 2680, y: 1500, w: 15,   h: 15   },
        { x: 2680, y: 1700, w: 15,   h: 15   },
        { x: 2680, y: 1900, w: 15,   h: 15   },
    ],

    // ============================================================
    // CHAPTER 4 — UNDERGROUND CITY  (4000 x 4000)
    // ============================================================
    'CITY': [
        { x: 0,    y: 0,    w: 4000, h: 80   }, { x: 0,    y: 0,    w: 80,   h: 4000 },
        { x: 0,    y: 3920, w: 4000, h: 80   }, { x: 3920, y: 0,    w: 80,   h: 4000 },
        // Central district walls
        { x: 800,  y: 800,  w: 2400, h: 80   },
        { x: 800,  y: 800,  w: 80,   h: 2400 },
        { x: 3120, y: 800,  w: 80,   h: 2400 },
        { x: 800,  y: 3120, w: 1160, h: 80   },
        { x: 2040, y: 3120, w: 1160, h: 80   },
        // Inner sanctum corridor
        { x: 1500, y: 280,  w: 1000, h: 80   },
        { x: 1500, y: 280,  w: 80,   h: 800  },
        { x: 2420, y: 280,  w: 80,   h: 800  },
        // Pillars in great hall (decorative blockers in 4x4 grid)
        { x: 1200, y: 1200, w: 80,   h: 80   }, { x: 1600, y: 1200, w: 80,   h: 80   },
        { x: 2000, y: 1200, w: 80,   h: 80   }, { x: 2400, y: 1200, w: 80,   h: 80   },
        { x: 1200, y: 1600, w: 80,   h: 80   }, { x: 1600, y: 1600, w: 80,   h: 80   },
        { x: 2000, y: 1600, w: 80,   h: 80   }, { x: 2400, y: 1600, w: 80,   h: 80   },
        { x: 1200, y: 2000, w: 80,   h: 80   }, { x: 1600, y: 2000, w: 80,   h: 80   },
        { x: 2000, y: 2000, w: 80,   h: 80   }, { x: 2400, y: 2000, w: 80,   h: 80   },
        // Side alcoves
        { x: 160,  y: 600,  w: 300,  h: 400  }, { x: 2100, y: 600,  w: 300,  h: 400  },
        { x: 3220, y: 600,  w: 300,  h: 400  },
        // Rubble piles (decorative)
        { x: 400,  y: 1400, w: 100,  h: 80   }, { x: 600,  y: 1600, w: 80,   h: 100  },
        { x: 3300, y: 1400, w: 100,  h: 80   }, { x: 3500, y: 1600, w: 80,   h: 100  },
        { x: 400,  y: 2400, w: 100,  h: 80   }, { x: 3500, y: 2400, w: 80,   h: 100  },
    ],

    // ============================================================
    // CHAPTER 5 — CAIRO AIRFIELD  (3600 x 3200)
    // ============================================================
    'AIRFIELD': [
        { x: 0,    y: 0,    w: 3600, h: 50   }, { x: 0,    y: 0,    w: 50,   h: 3200 },
        { x: 0,    y: 3150, w: 3600, h: 50   }, { x: 3550, y: 0,    w: 50,   h: 3200 },
        // Runway edge (can't cross without going around)
        { x: 600,  y: 800,  w: 2400, h: 40   },
        { x: 600,  y: 1600, w: 2400, h: 40   },
        // Terminal building (non-enterable filler)
        { x: 100,  y: 600,  w: 300,  h: 600  },
        // Fence line east
        { x: 3200, y: 200,  w: 30,   h: 2400 },
        // Perimeter outbuildings
        { x: 200,  y: 200,  w: 200,  h: 150  },
        { x: 500,  y: 200,  w: 150,  h: 150  },
        { x: 3300, y: 2600, w: 200,  h: 150  },
        // Taxiway markings (low curbs)
        { x: 800,  y: 2200, w: 1800, h: 20   },
        // Fuel tanks
        { x: 3050, y: 900,  w: 80,   h: 80   }, { x: 3150, y: 900,  w: 80,   h: 80   },
        // Ground crew equipment
        { x: 900,  y: 1700, w: 120,  h: 60   }, { x: 1200, y: 1700, w: 80,   h: 60   },
        // Parked small aircraft (decorative)
        { x: 1000, y: 900,  w: 300,  h: 80   },
        { x: 1500, y: 1700, w: 300,  h: 80   },
        { x: 2000, y: 900,  w: 300,  h: 80   },
        // Hangar building (enterable via door node)
        { x: 1400, y: 200,  w: 800,  h: 500  },
        { x: 1400, y: 200,  w: 40,   h: 500  },
        { x: 2160, y: 200,  w: 40,   h: 500  },
        // Tariq flat block (enterable)
        { x: 200,  y: 1800, w: 300,  h: 200  },
        // Halberd office block (enterable)
        { x: 3000, y: 2400, w: 300,  h: 200  },
        // Debris / crates
        { x: 700,  y: 2400, w: 100,  h: 80   }, { x: 900,  y: 2400, w: 80,   h: 80   },
        { x: 2600, y: 2400, w: 100,  h: 80   }, { x: 2800, y: 2400, w: 80,   h: 80   },
    ],

    // ============================================================
    // CHAPTER 6 — THE GATE  (3200 x 3200)
    // ============================================================
    'GATE': [
        { x: 0,    y: 0,    w: 3200, h: 80   }, { x: 0,    y: 0,    w: 80,   h: 3200 },
        { x: 0,    y: 3120, w: 3200, h: 80   }, { x: 3120, y: 0,    w: 80,   h: 3200 },
        // Antechamber outer walls
        { x: 400,  y: 1600, w: 400,  h: 100  }, { x: 2400, y: 1600, w: 400,  h: 100  },
        // Corridor walls flanking path north
        { x: 1200, y: 400,  w: 80,   h: 600  }, { x: 1920, y: 400,  w: 80,   h: 600  },
        // Side alcoves
        { x: 200,  y: 600,  w: 300,  h: 400  }, { x: 2100, y: 600,  w: 300,  h: 400  },
        { x: 2700, y: 600,  w: 300,  h: 400  },
        // Pillar grid
        { x: 600,  y: 1000, w: 80,   h: 80   }, { x: 1000, y: 1000, w: 80,   h: 80   },
        { x: 2000, y: 1000, w: 80,   h: 80   }, { x: 2400, y: 1000, w: 80,   h: 80   },
        { x: 600,  y: 1400, w: 80,   h: 80   }, { x: 1000, y: 1400, w: 80,   h: 80   },
        { x: 2000, y: 1400, w: 80,   h: 80   }, { x: 2400, y: 1400, w: 80,   h: 80   },
        // Rubble
        { x: 300,  y: 1100, w: 120,  h: 80   }, { x: 2800, y: 1100, w: 120,  h: 80   },
        { x: 300,  y: 1800, w: 80,   h: 100  }, { x: 2800, y: 1800, w: 80,   h: 100  },
    ],

    // ============================================================
    // CHAPTER 7 — FINAL CHAMBER  (1280 x 720 — fits canvas exactly)
    // ============================================================
    'FINAL': [
        { x: 0,   y: 0,   w: 1280, h: 60  }, { x: 0,   y: 0,   w: 60,  h: 720 },
        { x: 0,   y: 660, w: 1280, h: 60  }, { x: 1220,y: 0,   w: 60,  h: 720 },
        { x: 120, y: 80,  w: 80,   h: 80  }, { x: 1080,y: 80,  w: 80,  h: 80  },
        { x: 120, y: 560, w: 80,   h: 80  }, { x: 1080,y: 560, w: 80,  h: 80  },
        { x: 400, y: 80,  w: 480,  h: 40  }, // altar back wall
    ],

    // ============================================================
    // INTERIOR MAPS — small rooms, fit within canvas view
    // ============================================================
    'INT_TENT': [
        // 500 x 520 world. South wall at y:500 with gap at x:180-320 for exit.
        { x: 0, y: 0, w: 500, h: 20 },    // north
        { x: 0, y: 0, w: 20, h: 520 },    // west
        { x: 480, y: 0, w: 20, h: 520 },  // east
        { x: 0, y: 500, w: 180, h: 20 },  // south-west
        { x: 320, y: 500, w: 180, h: 20 },// south-east (gap x:180-320)
        // Interior furniture
        { x: 40, y: 40, w: 150, h: 100 },
        { x: 300, y: 40, w: 160, h: 100 },
        { x: 40, y: 190, w: 70, h: 18 },
    ],
    'INT_FOREMAN': [
        // 600 x 520 world. South gap at x:250-350.
        { x: 0, y: 0, w: 600, h: 20 }, { x: 0, y: 0, w: 20, h: 520 },
        { x: 0, y: 500, w: 250, h: 20 }, { x: 350, y: 500, w: 250, h: 20 },
        { x: 580, y: 0, w: 20, h: 520 },
        { x: 40, y: 40, w: 220, h: 60 }, { x: 340, y: 40, w: 220, h: 60 },
        { x: 200, y: 250, w: 200, h: 20 },
    ],
    'INT_DORM': [
        // 700 x 520 world. South gap at x:280-420.
        { x: 0, y: 0, w: 700, h: 20 }, { x: 0, y: 0, w: 20, h: 520 },
        { x: 0, y: 500, w: 280, h: 20 }, { x: 420, y: 500, w: 280, h: 20 },
        { x: 680, y: 0, w: 20, h: 520 },
        { x: 40, y: 60, w: 90, h: 50 }, { x: 170, y: 60, w: 90, h: 50 }, { x: 300, y: 60, w: 90, h: 50 }, { x: 430, y: 60, w: 90, h: 50 }, { x: 560, y: 60, w: 90, h: 50 },
        { x: 40, y: 190, w: 90, h: 50 }, { x: 170, y: 190, w: 90, h: 50 }, { x: 300, y: 190, w: 90, h: 50 }, { x: 430, y: 190, w: 90, h: 50 }, { x: 560, y: 190, w: 90, h: 50 },
    ],
    'INT_SAFEHOUSE': [
        // 600 x 620 world. South gap at x:250-350.
        { x: 0, y: 0, w: 600, h: 20 }, { x: 0, y: 0, w: 20, h: 620 },
        { x: 0, y: 600, w: 250, h: 20 }, { x: 350, y: 600, w: 250, h: 20 },
        { x: 580, y: 0, w: 20, h: 620 },
        { x: 40, y: 40, w: 520, h: 20 },
        { x: 40, y: 250, w: 120, h: 120 }, { x: 440, y: 250, w: 120, h: 120 },
        { x: 200, y: 350, w: 200, h: 60 },
    ],
    'INT_HOOKAH': [
        // 600 x 520 world. South gap at x:250-350.
        { x: 0, y: 0, w: 600, h: 20 }, { x: 0, y: 0, w: 20, h: 520 },
        { x: 0, y: 500, w: 250, h: 20 }, { x: 350, y: 500, w: 250, h: 20 },
        { x: 580, y: 0, w: 20, h: 520 },
        { x: 100, y: 80, w: 70, h: 70 }, { x: 260, y: 80, w: 70, h: 70 }, { x: 420, y: 80, w: 70, h: 70 },
        { x: 100, y: 260, w: 70, h: 70 }, { x: 260, y: 260, w: 70, h: 70 }, { x: 420, y: 260, w: 70, h: 70 },
    ],
    'INT_HANGAR': [
        // 800 x 720 world. South gap at x:330-470.
        { x: 0, y: 0, w: 800, h: 20 }, { x: 0, y: 0, w: 20, h: 720 },
        { x: 0, y: 700, w: 330, h: 20 }, { x: 470, y: 700, w: 330, h: 20 },
        { x: 780, y: 0, w: 20, h: 720 },
        { x: 40, y: 40, w: 250, h: 100 }, { x: 510, y: 40, w: 250, h: 100 },
        { x: 250, y: 250, w: 300, h: 20 },
        { x: 40, y: 480, w: 120, h: 80 }, { x: 640, y: 480, w: 120, h: 80 },
    ],
    'INT_TARIQ_FLAT': [
        // 600 x 520 world. South gap at x:250-350.
        { x: 0, y: 0, w: 600, h: 20 }, { x: 0, y: 0, w: 20, h: 520 },
        { x: 0, y: 500, w: 250, h: 20 }, { x: 350, y: 500, w: 250, h: 20 },
        { x: 580, y: 0, w: 20, h: 520 },
        { x: 40, y: 40, w: 200, h: 20 }, { x: 360, y: 40, w: 200, h: 20 },
        { x: 40, y: 240, w: 200, h: 70 }, { x: 360, y: 200, w: 80, h: 120 },
        { x: 240, y: 340, w: 120, h: 20 },
    ],
    'INT_HALBERD': [
        // 500 x 520 world. South gap at x:200-300.
        { x: 0, y: 0, w: 500, h: 20 }, { x: 0, y: 0, w: 20, h: 520 },
        { x: 0, y: 500, w: 200, h: 20 }, { x: 300, y: 500, w: 200, h: 20 },
        { x: 480, y: 0, w: 20, h: 520 },
        { x: 40, y: 40, w: 420, h: 20 },
        { x: 180, y: 220, w: 140, h: 70 },
        { x: 40, y: 300, w: 70, h: 70 }, { x: 390, y: 300, w: 70, h: 70 },
    ],
};

// ============================================================
// MAP OBJECTS
// All interactive and decorative objects per map.
// Decorative objects have interactScene: null (no interaction).
// Zone gates have interactScene: 'zone_locked' or a flag check.
// ============================================================

// Helper: decorative object (no interaction)
const deco = (id, x, y, w, h, color, label) =>
    ({ id, x, y, w, h, color, label, interactScene: null, decorative: true });

const mapObjects = {
    // ============================================================
    // CHAPTER 1
    // ============================================================
    1: [
        // --- BUILDINGS (enterable) ---
        // Tent compound: x:870-1090, y:1280-1440; door gap at x:940-1000, y:1440
        { id: 'tent_bldg',    x: 870,  y: 1280, w: 220, h: 160, color: '#4a5320', label: "Ellis' Tent",        interactScene: null           },
        { id: 'tent_door',    x: 940,  y: 1444, w: 80,  h: 22,  color: '#6a7340', label: 'Enter Tent',         interactScene: 'door_tent'    },
        // Dorm: x:70, y:1200, w:220, h:140; door gap at x:150-230, y:1340
        { id: 'dorm_bldg',    x: 70,   y: 1200, w: 220, h: 140, color: '#3a3028', label: 'Dormitory',          interactScene: null           },
        { id: 'dorm_door',    x: 155,  y: 1344, w: 75,  h: 18,  color: '#5a5040', label: 'Enter Dormitory',    interactScene: 'door_dorm'    },
        // Foreman: x:340, y:1200, w:200, h:140; door gap at x:410-480, y:1340
        { id: 'foreman_bldg', x: 340,  y: 1200, w: 200, h: 140, color: '#5c4033', label: "Foreman's Office",   interactScene: null           },
        { id: 'foreman_door', x: 415,  y: 1344, w: 65,  h: 18,  color: '#7c6050', label: 'Enter Office',       interactScene: 'door_foreman' },

        // --- MISSION INTERACTABLES ---
        { id: 'trench',       x: 1775, y: 1300, w: 175, h: 120, color: '#3d3024', label: 'East Trench',        interactScene: 'scene2_trench'   },
        { id: 'carts',        x: 120,  y: 1920, w: 180, h: 80,  color: '#5c2c2c', label: 'Supply Line',        interactScene: 'scene2_carts'    },
        { id: 'generator',    x: 1960, y: 1490, w: 65,  h: 65,  color: '#2d3436', label: 'Generator',          interactScene: 'scene2_stranger' },
        { id: 'sams_gear',    x: 1640, y: 870,  w: 28,  h: 28,  color: '#888',    label: 'Half-Buried Gear',   interactScene: 'flavor_sam'      },
        // Satphone: inside compound near south entry
        { id: 'satphone',     x: 990,  y: 1620, w: 28,  h: 28,  color: '#1a1a1a', label: 'Satphone',           interactScene: 'ch1_satphone'    },
        // Tariq: at camp brazier
        { id: 'tariq_talk',   x: 370,  y: 1610, w: 60,  h: 55,  color: '#4a3020', label: 'Tariq',              interactScene: 'ch1_tariq_talk'  },
        { id: 'inspector',    x: 2200, y: 1300, w: 70,  h: 55,  color: '#2a2a4a', label: 'Ministry Car',       interactScene: 'ch1_inspector'   },
        { id: 'perimeter',    x: 1700, y: 1880, w: 70,  h: 35,  color: '#1a1610', label: 'Site Perimeter',     interactScene: 'ch1_night_watch' },

        // --- REST SITE ---
        { id: 'rest_brazier', x: 220,  y: 1605, w: 38,  h: 38,  color: '#d4af37', label: 'Brazier (Rest)',     interactScene: 'rest_brazier'    },

        // --- NORTH DIG GATE ---
        { id: 'dig_gate',     x: 1000, y: 1055, w: 200, h: 28,  color: '#8b6914', label: 'Dig Zone Gate — LOCKED', interactScene: 'zone_dig_gate' },

        // --- PUZZLE & TUNNEL ---
        { id: 'puzzle_glyph', x: 1110, y: 380,  w: 55,  h: 55,  color: '#d4af37', label: 'Glyph Lock',         interactScene: 'puzzle_start_glyph_lock' },
        { id: 'tunnel_mouth', x: 970,  y: 290,  w: 460, h: 70,  color: '#111',    label: 'The Tunnel',         interactScene: 'ch1_tunnel_gate' },

        // --- NEW FLAVOR NODES (interactive lore) ---
        { id: 'fl_sand_east',   x: 1700, y: 750,  w: 60,  h: 60,  color: '#6c5c30', label: 'Howling Dune',       interactScene: 'flavor_sand'           },
        { id: 'fl_stars',       x: 1200, y: 1900, w: 60,  h: 60,  color: '#3a3a50', label: 'Open Sky',           interactScene: 'flavor_stars'          },
        { id: 'fl_ruins',       x: 430,  y: 680,  w: 60,  h: 60,  color: '#5a4a30', label: 'Old Limestone Wall', interactScene: 'flavor_ruins_fragment' },
        { id: 'fl_boulder',     x: 2080, y: 960,  w: 65,  h: 50,  color: '#3a3028', label: 'Big Boulder',        interactScene: 'flavor_boulder'        },
        { id: 'fl_cactus',      x: 60,   y: 550,  w: 30,  h: 50,  color: '#2d5a1b', label: 'Lone Date Cactus',   interactScene: 'flavor_cactus'         },
        { id: 'fl_stake_sam',   x: 700,  y: 1120, w: 30,  h: 45,  color: '#b8860b', label: "Sam's Survey Stake", interactScene: 'flavor_survey_stake'   },
        { id: 'fl_cooking',     x: 150,  y: 1470, w: 60,  h: 30,  color: '#5c3010', label: 'Cooking Table',      interactScene: 'flavor_cooking_table'  },
        { id: 'fl_crates',      x: 95,   y: 1580, w: 60,  h: 60,  color: '#5c4030', label: 'Sorted Crates',      interactScene: 'flavor_crates'         },
        { id: 'fl_spoil',       x: 1095, y: 765,  w: 80,  h: 50,  color: '#5c4a30', label: 'Spoil Mound',        interactScene: 'flavor_spoil_mound'    },
        { id: 'fl_toolshed',    x: 1325, y: 860,  w: 70,  h: 90,  color: '#4a3820', label: "Sam's Tool Shed",    interactScene: 'flavor_tool_shed'      },
        { id: 'fl_ministry_post',x: 2170,y: 1430, w: 60,  h: 60,  color: '#2d3436', label: 'Ministry Post',      interactScene: 'flavor_ministry_post'  },
        { id: 'fl_fuel_drums',  x: 2020, y: 1610, w: 55,  h: 60,  color: '#4a3020', label: 'Fuel Drums',         interactScene: 'flavor_fuel_drums'     },
        { id: 'fl_guard_booth', x: 2270, y: 1505, w: 55,  h: 55,  color: '#3d4446', label: 'Guard Booth',        interactScene: 'flavor_guard_booth'    },
        { id: 'fl_scaffold',    x: 1640, y: 1450, w: 45,  h: 80,  color: '#4a4a4a', label: 'Scaffolding',        interactScene: 'flavor_scaffolding'    },
        { id: 'fl_trailer',     x: 1500, y: 1290, w: 160, h: 107, color: '#3a3430', label: 'Site Trailer',       interactScene: 'flavor_site_trailer'   },
        { id: 'fl_palm',        x: 1000, y: 1690, w: 30,  h: 60,  color: '#2d7a1b', label: "Sam's Date Palm",    interactScene: 'flavor_palm_tree'      },
        { id: 'fl_gate_post',   x: 600,  y: 1990, w: 30,  h: 60,  color: '#5a4a3a', label: 'Camp Gate Post',     interactScene: 'flavor_gate_post'      },
        { id: 'fl_digshed',     x: 885,  y: 860,  w: 75,  h: 90,  color: '#4a3820', label: 'Dig Shed Clipboard', interactScene: 'flavor_digshed'        },

        // --- DECORATIVE (no interaction, green labels) ---
        deco('d_cooking',   90,  1480, 250, 20,  '#5c3010', 'Cooking Table'   ),
        deco('d_barrels1',  560, 1270, 70,  70,  '#1e3f66', 'Water Barrels'   ),
        deco('d_crates1',   70,  1580, 100, 70,  '#5c4030', 'Crates'          ),
        deco('d_truck1',    200, 2070, 180, 80,  '#2d3436', 'Supply Truck'    ),
        deco('d_truck2',    450, 2070, 180, 80,  '#2d3436', 'Supply Truck'    ),
        deco('d_min1',      1600,2070, 180, 80,  '#2d3436', 'Ministry Vehicle'),
        deco('d_min2',      1900,2070, 120, 80,  '#2d3436', 'Ministry Vehicle'),
        deco('d_scaff',     1630,1445, 55,  90,  '#4a4a4a', 'Scaffolding'     ),
        deco('d_spoil2',    1320, 750, 75,  45,  '#5c4a30', 'Spoil Mound'     ),
        deco('d_spoil3',    1500, 780, 90,  55,  '#5c4a30', 'Spoil Mound'     ),
        deco('d_stake1',    800,  1100, 10, 35,  '#b8860b', 'Survey Stake'    ),
        deco('d_stake2',    1000,1080, 10, 35,  '#b8860b', 'Survey Stake'    ),
        deco('d_stake3',    1200,1100, 10, 35,  '#b8860b', 'Survey Stake'    ),
        deco('d_gearstor',  1100,1290, 200, 80,  '#3a3028', 'Gear Storage'    ),
        deco('d_equiptbl',  1120,1490, 170, 30,  '#4a3820', 'Equipment Table' ),
        // Cacti
        deco('d_cact1',  60,  550, 18, 38,  '#2d5a1b', 'Cactus'),
        deco('d_cact2',  100, 530, 18, 55,  '#2d5a1b', 'Cactus'),
        deco('d_cact3',  60,  720, 18, 38,  '#2d5a1b', 'Cactus'),
        deco('d_cact4',  140, 750, 18, 45,  '#2d5a1b', 'Cactus'),
        deco('d_cact5',  2280,500, 18, 40,  '#2d5a1b', 'Cactus'),
        deco('d_cact6',  2290,700, 18, 45,  '#2d5a1b', 'Cactus'),
        // Boulder clusters
        deco('d_bould1', 150, 950, 55, 45,  '#3a3028', 'Boulder'),
        deco('d_bould2', 220, 935, 70, 55,  '#3a3028', 'Boulder'),
        // Ancient ruins
        deco('d_ruin1',  350, 650, 130, 18, '#4a3820', 'Stone Wall'),
        deco('d_ruin2',  550, 610, 18, 110, '#4a3820', 'Stone Wall'),
        deco('d_ruin3',  1650,650, 130, 18, '#4a3820', 'Stone Wall'),
        deco('d_ruin4',  1800,600, 90,  18, '#4a3820', 'Stone Wall'),
        // Palm trees at compound corners (decorative, non-blocking)
        deco('d_palm1',  800, 1270, 24, 24, '#2d5a1b', 'Palm Tree'),
        deco('d_palm2',  1300,1270, 24, 24, '#2d5a1b', 'Palm Tree'),
        // Extra ambient decorations
        deco('d_lantern1',  870, 1435, 8, 12, '#d4af37', 'Lantern'),
        deco('d_lantern2',  1085,1435, 8, 12, '#d4af37', 'Lantern'),
        deco('d_lantern3',  155, 1337, 8, 12, '#d4af37', 'Lantern'),
        deco('d_lantern4',  410, 1337, 8, 12, '#d4af37', 'Lantern'),
        deco('d_sandbag1',  350, 1760, 50, 25, '#8b7540', 'Sandbags'),
        deco('d_sandbag2',  1400,1760, 50, 25, '#8b7540', 'Sandbags'),
        deco('d_sandbag3',  1800,1760, 50, 25, '#8b7540', 'Sandbags'),
        deco('d_rope_coil', 90, 1700, 30, 30, '#6a5530', 'Rope Coil'),
        deco('d_bucket',    420,1700, 25, 25, '#3a3428', 'Tin Bucket'),
        deco('d_tarp',      350, 1840, 100, 35, '#5a4020', 'Tarped Supplies'),
        deco('d_antenna',   1440,1330, 8, 60, '#8b8b8b', 'Radio Antenna'),
        deco('d_dustbin',   620, 1800, 30, 30, '#3a3430', 'Oil Drum'),
        deco('d_toolbox1',  1200,1700, 40, 25, '#6a5530', 'Tool Box'),
        // North zone ambient
        deco('d_rockpile1', 600, 890, 50, 40, '#4a3028', 'Rock Pile'),
        deco('d_rockpile2', 1750,920, 50, 40, '#4a3028', 'Rock Pile'),
        deco('d_rockpile3', 300, 500, 60, 50, '#4a3028', 'Rock Pile'),
        deco('d_driftwood', 1900,500, 70, 15, '#4a3820', 'Driftwood'),
        deco('d_claypot',   1520,650, 20, 25, '#5c3010', 'Broken Clay Pot'),
        deco('d_claypot2',  600, 800, 20, 25, '#5c3010', 'Broken Clay Pot'),
        // More cacti scattered
        deco('d_cact7',  180, 630, 18, 42, '#2d5a1b', 'Cactus'),
        deco('d_cact8',  2200,580, 18, 38, '#2d5a1b', 'Cactus'),
        deco('d_cact9',  2200,800, 18, 45, '#2d5a1b', 'Cactus'),
    ],

    // ============================================================
    // CHAPTER 2 ROUTES
    // ============================================================
    'TRAP': [
        { id: 'trap_mural',        x: 1200, y: 200,  w: 100, h: 100, color: '#4a3010', label: 'The Mural',          interactScene: 'ch2_mural'            },
        { id: 'trap_stash',        x: 400,  y: 600,  w: 80,  h: 80,  color: '#2a2010', label: 'Hidden Stash',       interactScene: 'ch2_stash'            },
        { id: 'trap_amber_pool',   x: 350,  y: 1050, w: 90,  h: 60,  color: '#d4af37', label: 'Amber Pool (Rest)',   interactScene: 'trap_rest'            },
        { id: 'trap_bones',        x: 700,  y: 1400, w: 60,  h: 40,  color: '#aaa',    label: 'Old Bones',          interactScene: 'ch2_bones'            },
        { id: 'trap_samir',        x: 1500, y: 1500, w: 60,  h: 60,  color: '#4b3030', label: 'Samir',              interactScene: 'ch2_samir'            },
        { id: 'trap_inscription',  x: 880,  y: 1720, w: 140, h: 50,  color: '#2a2010', label: 'Wall Inscription',   interactScene: 'trap_inscription'     },
        { id: 'puzzle_plates',     x: 900,  y: 1820, w: 320, h: 60,  color: '#5c4a30', label: 'Stone Plates',       interactScene: 'puzzle_start_plates'  },
        { id: 'trap_whispers',     x: 600,  y: 2200, w: 80,  h: 80,  color: '#0a0a14', label: 'The Whispering',     interactScene: 'ch2_whispers'         },
        { id: 'trap_gate',         x: 1200, y: 2700, w: 200, h: 80,  color: '#d4af37', label: 'The Gate',           interactScene: 'ch2_gate'             },
    ],
    'SECRET': [
        { id: 'secret_amber',   x: 1200, y: 400,  w: 100, h: 100, color: '#d4af37', label: 'Amber Formation',    interactScene: 'ch2_amber'              },
        { id: 'secret_mural',   x: 380,  y: 350,  w: 180, h: 120, color: '#3a2a18', label: "Sam's Mural",         interactScene: 'ch2_mural'              },
        { id: 'secret_altar',   x: 1380, y: 680,  w: 120, h: 140, color: '#1a1a2a', label: 'Hollow King Altar',   interactScene: 'ch2_secret_altar'       },
        { id: 'secret_stash',   x: 1320, y: 1050, w: 80,  h: 60,  color: '#4a3820', label: 'Abandoned Pack',      interactScene: 'ch2_stash'              },
        { id: 'secret_chasm',   x: 1000, y: 1200, w: 200, h: 60,  color: '#050505', label: 'The Chasm',           interactScene: 'ch2_chasm'              },
        { id: 'secret_whispers',x: 380,  y: 1100, w: 100, h: 100, color: '#0a0a14', label: 'Whisper Chamber',     interactScene: 'ch2_whispers'           },
        { id: 'secret_bones',   x: 780,  y: 1480, w: 60,  h: 80,  color: '#2a2520', label: "Fouad's Alcove",      interactScene: 'ch2_bones'              },
        { id: 'secret_statue',  x: 600,  y: 800,  w: 80,  h: 120, color: '#2a2520', label: 'Stone Statue',        interactScene: 'ch2_statue'             },
        { id: 'puzzle_res',     x: 700,  y: 1600, w: 260, h: 60,  color: '#8b6914', label: 'Resonance Nodes',     interactScene: 'puzzle_start_resonance' },
        { id: 'secret_door_w',  x: 350,  y: 2100, w: 120, h: 80,  color: '#3a3050', label: 'West Door',           interactScene: 'ch2_secret_door_w'      },
        { id: 'secret_gate',    x: 1100, y: 2200, w: 200, h: 80,  color: '#d4af37', label: 'The Gate',            interactScene: 'ch2_gate'               },
    ],
    'CUTTHROAT': [
        { id: 'cut_maren',     x: 1050, y: 300,  w: 60,  h: 60,  color: '#8b0000', label: 'Maren',             interactScene: 'ch2_maren'       },
        { id: 'cut_boros',     x: 1060, y: 700,  w: 60,  h: 60,  color: '#1a1a4a', label: 'Boros',             interactScene: 'ch2_boros'       },
        { id: 'cut_tariq',     x: 1100, y: 1200, w: 60,  h: 60,  color: '#3a3a50', label: 'Tariq',             interactScene: 'ch2_cutthroat_tariq' },
        { id: 'cut_scaff',     x: 1020, y: 1400, w: 320, h: 60,  color: '#4a4a4a', label: 'Scaffolding',       interactScene: 'ch2_scaffolding' },
        { id: 'cut_gate',      x: 1050, y: 2200, w: 200, h: 80,  color: '#d4af37', label: 'The Gate',          interactScene: 'ch2_gate'        },
    ],

    // ============================================================
    // CHAPTER 3 — CAIRO MARKET
    // ============================================================
    'MARKET': [
        // --- BUILDINGS (enterable) ---
        { id: 'hub_bldg',       x: 1030, y: 500,  w: 540, h: 200, color: '#5c3010', label: 'The Hub',            interactScene: null               },
        { id: 'hub_door',       x: 1270, y: 698,  w: 60,  h: 20,  color: '#8b6030', label: 'Enter Hub',          interactScene: 'door_safehouse'   },
        { id: 'hookah_bldg',    x: 2730, y: 300,  w: 440, h: 350, color: '#2a0040', label: 'Hookah Lounge',      interactScene: null               },
        { id: 'hookah_door',    x: 2930, y: 648,  w: 60,  h: 20,  color: '#4a0082', label: 'Enter Lounge',       interactScene: 'door_hookah'      },

        // --- MISSION INTERACTABLES ---
        { id: 'yusra_meet',     x: 1270, y: 200,  w: 60,  h: 60,  color: '#4b0082', label: 'Yusra',              interactScene: 'ch3_yusra_meet'   },
        { id: 'ch3_vendor',     x: 200,  y: 1200, w: 80,  h: 80,  color: '#2e8b57', label: 'Tea Vendor',         interactScene: 'ch3_vendor'       },

        // --- CENTRAL PLAZA ---
        { id: 'fountain',       x: 1540, y: 1940, w: 120, h: 120, color: '#1e3f66', label: 'Fountain',           interactScene: 'flavor_ch3_fountain' },
        { id: 'plaza_bench_w',  x: 1400, y: 1990, w: 80,  h: 30,  color: '#5c4030', label: 'Bench',              interactScene: 'flavor_plaza_bench'  },
        { id: 'plaza_bench_e',  x: 1720, y: 1990, w: 80,  h: 30,  color: '#5c4030', label: 'Bench',              interactScene: 'flavor_plaza_bench'  },

        // --- MARKET STALLS (interactable) ---
        { id: 'spice_stall',    x: 300,  y: 1600, w: 180, h: 80,  color: '#b8860b', label: 'Spice Merchant',     interactScene: 'flavor_ch3_spice'    },
        { id: 'graffiti',       x: 700,  y: 1500, w: 60,  h: 20,  color: '#444',    label: 'Strange Graffiti',   interactScene: 'flavor_ch3_graffiti' },
        { id: 'stray_cat',      x: 1100, y: 1800, w: 20,  h: 20,  color: '#d35400', label: 'Stray Cat',          interactScene: 'flavor_ch3_cat'      },
        { id: 'dark_alley',     x: 590,  y: 720,  w: 50,  h: 80,  color: '#0a0a0a', label: 'Dark Alley',         interactScene: 'flavor_ch3_alley'    },
        { id: 'prayer_nook',    x: 200,  y: 1900, w: 60,  h: 60,  color: '#4a3020', label: 'Prayer Nook',        interactScene: 'flavor_ch3_prayer'   },
        { id: 'puzzle_cipher',  x: 650,  y: 1560, w: 60,  h: 60,  color: '#b8860b', label: 'Vendor\'s Code',     interactScene: 'puzzle_start_cipher' },

        // --- REST SITE ---
        { id: 'rest_stall',     x: 1800, y: 2500, w: 80,  h: 80,  color: '#d4af37', label: 'Tea Corner (Rest)',  interactScene: 'ch3_rest_stall'      },

        // --- DECORATIVE ---
        deco('d_palm1', 1300, 2600, 25, 25, '#2d5a1b', 'Palm Tree'    ),
        deco('d_palm2', 1900, 2600, 25, 25, '#2d5a1b', 'Palm Tree'    ),
        deco('d_palm3', 2200, 2550, 25, 25, '#2d5a1b', 'Palm Tree'    ),
        deco('d_palm4', 1100, 2550, 25, 25, '#2d5a1b', 'Palm Tree'    ),
        deco('d_moto1', 1280, 2680, 40, 20, '#555',    'Motorbike'    ),
        deco('d_moto2', 1340, 2680, 40, 20, '#555',    'Motorbike'    ),
        deco('d_moto3', 2260, 2680, 40, 20, '#555',    'Motorbike'    ),
        deco('d_dump1', 870, 2500, 60, 40, '#3a3028', 'Dumpster'     ),
        deco('d_dump2', 2200, 2500, 60, 40, '#3a3028', 'Dumpster'     ),
        deco('d_dump3', 3300, 2000, 60, 40, '#3a3028', 'Dumpster'     ),
        deco('d_awning1', 480, 1500, 15, 15, '#8b4513', 'Awning Post'  ),
        deco('d_awning2', 480, 1700, 15, 15, '#8b4513', 'Awning Post'  ),
        deco('d_awning3', 480, 1900, 15, 15, '#8b4513', 'Awning Post'  ),
        deco('d_awning4', 2680, 1500, 15, 15, '#8b4513', 'Awning Post'  ),
        deco('d_awning5', 2680, 1700, 15, 15, '#8b4513', 'Awning Post'  ),
        deco('d_awning6', 2680, 1900, 15, 15, '#8b4513', 'Awning Post'  ),
    ],
    // Safehouse map (accessed from Hub)
    'SAFEHOUSE': [
        { id: 'yusra', x: 400, y: 200, w: 40, h: 40, color: '#4b0082', label: 'Madame Yusra', interactScene: 'ch3_yusra_meet' }
    ],

    // ============================================================
    // CHAPTER 4 — UNDERGROUND CITY
    // ============================================================
    'CITY': [
        { id: 'rest_hearth',     x: 900,  y: 3000, w: 80,  h: 80,  color: '#8b5e3c', label: 'Stone Hearth',    interactScene: 'ch4_rest_hearth'    },
        { id: 'puzzle_altar',    x: 1760, y: 600,  w: 160, h: 160, color: '#4a0082', label: 'The Heart Altar', interactScene: 'puzzle_start_heart_altar' },
        { id: 'temple',          x: 1800, y: 1300, w: 400, h: 300, color: '#222',    label: 'The Temple',      interactScene: 'ch4_prison'         },
        { id: 'heart_pedestal',  x: 1850, y: 400,  w: 200, h: 200, color: '#4a0082', label: 'The Heart',       interactScene: 'ch4_heart'          },
        { id: 'flavor_pillar',   x: 400,  y: 1800, w: 80,  h: 80,  color: '#2a2520', label: 'Ancient Pillar',  interactScene: 'flavor_ch4_pillar'  },
        { id: 'flavor_channel',  x: 2700, y: 1700, w: 100, h: 20,  color: '#8b6914', label: 'Amber Channel',   interactScene: 'flavor_ch4_channel' },
        { id: 'flavor_glyph',    x: 2200, y: 900,  w: 60,  h: 160, color: '#1a1510', label: 'Glyph Wall',      interactScene: 'flavor_ch4_glyph'   },
        { id: 'flavor_fountain', x: 700,  y: 900,  w: 100, h: 100, color: '#1a2535', label: 'Dry Fountain',    interactScene: 'flavor_ch4_fountain'},
        deco('d_pillar1', 1200, 1200, 80, 80, '#2a2520', 'Pillar'),
        deco('d_pillar2', 1600, 1200, 80, 80, '#2a2520', 'Pillar'),
        deco('d_pillar3', 2000, 1200, 80, 80, '#2a2520', 'Pillar'),
        deco('d_pillar4', 2400, 1200, 80, 80, '#2a2520', 'Pillar'),
        deco('d_pillar5', 1200, 1600, 80, 80, '#2a2520', 'Pillar'),
        deco('d_pillar6', 2400, 1600, 80, 80, '#2a2520', 'Pillar'),
        deco('d_rubble1', 400, 1400, 100, 80, '#3a3028', 'Rubble'),
        deco('d_rubble2', 600, 1600, 80, 100, '#3a3028', 'Rubble'),
        deco('d_rubble3', 3300, 1400, 100, 80, '#3a3028', 'Rubble'),
    ],

    // ============================================================
    // CHAPTER 5 — AIRFIELD
    // ============================================================
    'AIRFIELD': [
        { id: 'tariq_flat_bldg', x: 200,  y: 1800, w: 300, h: 200, color: '#3a2a1a', label: "Tariq's Flat",    interactScene: null              },
        { id: 'tariq_flat_door', x: 320,  y: 1998, w: 60,  h: 20,  color: '#5a4030', label: 'Enter Flat',      interactScene: 'door_tariq_flat' },
        { id: 'hangar_door',     x: 1770, y: 698,  w: 60,  h: 20,  color: '#4d5456', label: 'Enter Hangar',    interactScene: 'door_hangar'     },
        { id: 'halberd_bldg',    x: 3000, y: 2400, w: 300, h: 200, color: '#2d3436', label: "Halberd's Office",interactScene: null              },
        { id: 'halberd_door',    x: 3120, y: 2598, w: 60,  h: 20,  color: '#3d4446', label: 'Enter Office',    interactScene: 'door_halberd'    },
        { id: 'hangar_barrel',   x: 700,  y: 2400, w: 60,  h: 60,  color: '#8b3a3a', label: 'Fire Barrel',     interactScene: 'ch5_hangar_rest' },
        { id: 'flavor_plane',    x: 1000, y: 900,  w: 300, h: 80,  color: '#1a1a2e', label: 'Grounded Plane',  interactScene: 'flavor_ch5_plane'},
        { id: 'flavor_crates',   x: 700,  y: 2400, w: 100, h: 80,  color: '#2d2010', label: 'Cargo Crates',    interactScene: 'flavor_ch5_crates'},
        deco('d_plane2', 2000, 900, 300, 80, '#1a1a2e', 'Grounded Plane'),
        deco('d_plane3', 1500, 1700, 300, 80, '#1a1a2e', 'Grounded Plane'),
        deco('d_fueltank1', 3050, 900, 80, 80, '#4a3028', 'Fuel Tank'),
        deco('d_fueltank2', 3150, 900, 80, 80, '#4a3028', 'Fuel Tank'),
        deco('d_crate_e1', 2600, 2400, 100, 80, '#2d2010', 'Cargo Crates'),
        deco('d_crate_e2', 2800, 2400, 80, 80, '#2d2010', 'Cargo Crates'),
    ],

    // ============================================================
    // CHAPTER 6 — THE GATE
    // ============================================================
    'GATE': [
        { id: 'antechamber_rest', x: 1450, y: 1700, w: 100, h: 60,  color: '#8b6914', label: 'Amber Channels',  interactScene: 'ch6_antechamber_rest' },
        { id: 'halberd_farewell', x: 1650, y: 1800, w: 60,  h: 60,  color: '#2d5a1b', label: 'Halberd',         interactScene: 'ch6_halberd_farewell' },
        { id: 'hermetic_gate',    x: 1360, y: 200,  w: 480, h: 140, color: '#111',    label: 'The Gate',        interactScene: 'ch6_gate'             },
        { id: 'flavor_inscript',  x: 200,  y: 700,  w: 80,  h: 280, color: '#1a1410', label: 'Hermetic Script', interactScene: 'flavor_ch6_inscriptions'},
        { id: 'flavor_eye',       x: 2800, y: 800,  w: 100, h: 100, color: '#0a0a14', label: 'The Unshut Eye',  interactScene: 'flavor_ch6_eye'       },
        deco('d_pillar_g1', 600, 1000, 80, 80, '#1a1410', 'Stone Pillar'),
        deco('d_pillar_g2', 1000, 1000, 80, 80, '#1a1410', 'Stone Pillar'),
        deco('d_pillar_g3', 2000, 1000, 80, 80, '#1a1410', 'Stone Pillar'),
        deco('d_pillar_g4', 2400, 1000, 80, 80, '#1a1410', 'Stone Pillar'),
        deco('d_rubble_g1', 300, 1100, 120, 80, '#2a2018', 'Rubble'),
        deco('d_rubble_g2', 2800, 1100, 120, 80, '#2a2018', 'Rubble'),
    ],

    // ============================================================
    // CHAPTER 7 — FINAL
    // ============================================================
    'FINAL': [
        { id: 'ch7_codex_view',  x: 200,  y: 200, w: 80,  h: 80,  color: '#2a2010', label: 'The Codex',        interactScene: 'ch7_examine_codex'  },
        { id: 'ch7_second_view', x: 1000, y: 200, w: 80,  h: 80,  color: '#1a1a2a', label: 'Second Tablet',    interactScene: 'ch7_examine_second' },
        { id: 'final_pedestal',  x: 555,  y: 280, w: 170, h: 120, color: '#d4af37', label: 'The Blank Tablet', interactScene: 'ch7_pedestal'       },
    ],

    // ============================================================
    // INTERIOR MAPS
    // ============================================================
    'INT_TENT': [
        { id: 'tent_codex',    x: 200, y: 100, w: 80,  h: 50,  color: '#2a2010', label: 'The Codex',        interactScene: 'scene1_start'    },
        { id: 'tent_journal',  x: 60,  y: 230, w: 60,  h: 50,  color: '#4a3820', label: 'Field Journal',    interactScene: 'flavor_desk'     },
        { id: 'tent_cot',      x: 310, y: 100, w: 130, h: 50,  color: '#2a2820', label: 'Your Cot',         interactScene: 'int_tent_cot'    },
        { id: 'tent_photos',   x: 360, y: 280, w: 70,  h: 50,  color: '#1a1810', label: 'Photographs',      interactScene: 'int_tent_photos' },
        { id: 'tent_exit',     x: 180, y: 460, w: 140, h: 28,  color: '#4a5320', label: '[ Exit Tent ]',    interactScene: 'int_exit'        },
    ],
    'INT_FOREMAN': [
        { id: 'for_desk',      x: 200, y: 160, w: 200, h: 70,  color: '#5c4033', label: "Foreman's Desk",   interactScene: 'int_foreman_desk'    },
        { id: 'for_manifest',  x: 60,  y: 290, w: 100, h: 50,  color: '#3a2a1a', label: 'Manifest',         interactScene: 'int_foreman_manifest'},
        { id: 'for_sams_notes',x: 380, y: 290, w: 100, h: 50,  color: '#2a2820', label: "Sam's Old Notes",  interactScene: 'int_foreman_sam'     },
        { id: 'for_corkboard', x: 200, y: 60,  w: 220, h: 50,  color: '#3a2820', label: 'Corkboard',        interactScene: 'int_foreman_cork'    },
        { id: 'for_exit',      x: 250, y: 460, w: 100, h: 28,  color: '#5c4033', label: '[ Exit Office ]',  interactScene: 'int_exit'            },
    ],
    'INT_DORM': [
        { id: 'dorm_awake',    x: 500, y: 155, w: 100, h: 50,  color: '#2a2010', label: 'Sleepless Worker', interactScene: 'int_dorm_worker'  },
        { id: 'dorm_talisman', x: 200, y: 155, w: 100, h: 50,  color: '#4a3010', label: 'Talisman on Cot',  interactScene: 'int_dorm_talisman'},
        { id: 'dorm_graffiti', x: 50,  y: 300, w: 100, h: 50,  color: '#1a1810', label: 'Wall Scratching',  interactScene: 'int_dorm_graffiti'},
        { id: 'dorm_exit',     x: 280, y: 460, w: 140, h: 28,  color: '#3a3020', label: '[ Exit Dorm ]',    interactScene: 'int_exit'         },
    ],
    'INT_SAFEHOUSE': [
        { id: 'sf_yusra',      x: 245, y: 140, w: 120, h: 70,  color: '#4b0082', label: 'Madame Yusra',    interactScene: 'ch3_yusra_meet'  },
        { id: 'sf_archive',    x: 50,  y: 310, w: 100, h: 70,  color: '#2a1a3a', label: 'Order Archive',   interactScene: 'int_sf_archive'  },
        { id: 'sf_map',        x: 460, y: 310, w: 100, h: 70,  color: '#1a1025', label: 'Ritual Map',      interactScene: 'int_sf_map'      },
        { id: 'sf_exit',       x: 250, y: 560, w: 100, h: 28,  color: '#2a1f1a', label: '[ Exit ]',        interactScene: 'int_exit'        },
    ],
    'INT_HOOKAH': [
        { id: 'hk_host',       x: 60,  y: 155, w: 80,  h: 70,  color: '#4a0082', label: 'Host',            interactScene: 'ch3_hookah'      },
        { id: 'hk_stranger',   x: 430, y: 155, w: 80,  h: 70,  color: '#2a1a2a', label: 'Quiet Stranger',  interactScene: 'int_hk_stranger' },
        { id: 'hk_symbol',     x: 265, y: 330, w: 80,  h: 50,  color: '#1a0f1a', label: 'Symbol on Wall',  interactScene: 'int_hk_symbol'   },
        { id: 'hk_exit',       x: 250, y: 460, w: 100, h: 28,  color: '#2a1a2a', label: '[ Exit ]',        interactScene: 'int_exit'        },
    ],
    'INT_HANGAR': [
        { id: 'hng_standoff',  x: 300, y: 250, w: 200, h: 120, color: '#8b0000', label: 'Four Factions',   interactScene: 'ch5_standoff'    },
        { id: 'hng_barrel',    x: 50,  y: 500, w: 60,  h: 50,  color: '#8b3a3a', label: 'Fire Barrel',     interactScene: 'ch5_hangar_rest' },
        { id: 'hng_crates',    x: 690, y: 500, w: 100, h: 50,  color: '#2d2010', label: 'Cargo Crates',    interactScene: 'flavor_ch5_crates'},
        { id: 'hng_note',      x: 690, y: 80,  w: 100, h: 50,  color: '#1a1a2e', label: 'Tacked Note',     interactScene: 'int_hng_note'    },
        { id: 'hng_exit',      x: 330, y: 660, w: 140, h: 28,  color: '#2d3436', label: '[ Exit Hangar ]', interactScene: 'int_exit'        },
    ],
    'INT_TARIQ_FLAT': [
        { id: 'tf_tariq',      x: 50,  y: 260, w: 180, h: 60,  color: '#4a3020', label: 'Tariq',           interactScene: 'ch5_tariq_flat_scene'},
        { id: 'tf_sister',     x: 360, y: 160, w: 180, h: 50,  color: '#3a2a1a', label: "Tariq's Sister",  interactScene: 'int_tf_sister'      },
        { id: 'tf_shoebox',    x: 370, y: 340, w: 80,  h: 40,  color: '#5c4033', label: 'Shoebox',         interactScene: 'int_tf_shoebox'     },
        { id: 'tf_photos',     x: 50,  y: 60,  w: 160, h: 25,  color: '#2a2010', label: 'Family Photos',   interactScene: 'int_tf_photos'      },
        { id: 'tf_exit',       x: 250, y: 460, w: 100, h: 28,  color: '#3a2a1a', label: '[ Exit ]',        interactScene: 'int_exit'           },
    ],
    'INT_HALBERD': [
        { id: 'hlb_halberd',   x: 175, y: 195, w: 150, h: 70,  color: '#2d3436', label: 'Mr. Halberd',     interactScene: 'ch5_halberd'     },
        { id: 'hlb_files',     x: 50,  y: 310, w: 80,  h: 50,  color: '#1a1a2e', label: 'Filed Documents', interactScene: 'int_hlb_files'   },
        { id: 'hlb_window',    x: 360, y: 60,  w: 100, h: 40,  color: '#0e0e14', label: 'Frosted Window',  interactScene: 'int_hlb_window'  },
        { id: 'hlb_exit',      x: 200, y: 460, w: 100, h: 28,  color: '#1a1a2e', label: '[ Exit ]',        interactScene: 'int_exit'        },
    ],
};

let activeMapObjects = mapObjects[1];
