// ============================================================
// THE CODEX OF GIZA — POKE STYLE: WHAT MARSA TARFA SAYS (poke/map_ch1c.js)
// Chapter 1-C's objects, in the same shape as Saqqara's (map_ch1b.js): an
// id, a label, a model (the sprite it's drawn as), and what it says when
// you look at it. The people and the story get their scenes in
// poke/ch1c_scenes.js; `say` is the fallback. say: null is scenery.
// ============================================================
window.POKE_MAP_1C = {
    interiors: {},
    objects: [
        // --- the town ---
        { id: 'c1c_flat', label: 'Your Flat', model: 'harbour house', say: ['System', 'Your flat: two rooms over a net-mender\'s, a blue door, a view of the harbour if you lean out of the window far enough.'] },
        { id: 'c1c_house1', label: 'A House', model: 'harbour house', say: ['System', 'A whitewashed house with blue shutters. A fishing net hangs drying over the roof parapet like a lace curtain.'] },
        { id: 'c1c_house2', label: 'A House', model: 'harbour house', say: ['System', 'A house the colour of the sea at noon, the paint flaking in the salt wind. A boy\'s bicycle leans by the door, its chain rusted solid.'] },
        { id: 'c1c_house3', label: 'A House', model: 'harbour house', say: ['System', 'A house with a half-built second floor: the rebar sticks up from the roof like the bones of a hand, waiting for the money.'] },
        { id: 'c1c_house4', label: 'A House', model: 'harbour house', say: ['System', 'A whitewashed house, a pot of basil on every windowsill. Somebody inside is frying fish, and has been since dawn.'] },
        { id: 'c1c_house5', label: 'A House', model: 'harbour house', say: ['System', 'The house of a man who went to work in the Gulf and came back with a satellite dish the size of a wedding table.'] },
        { id: 'c1c_house6', label: 'A House', model: 'harbour house', say: ['System', 'A blue door with a hand of Fatima painted on it, to keep off the evil eye. It has not kept off the salt.'] },
        { id: 'c1c_house7', label: 'A House', model: 'harbour house', say: ['System', 'Your neighbours\'. The wife waves from the roof, where she is hanging out washing, and then remembers what everyone knows about your debts, and stops waving.'] },
        { id: 'c1c_house8', label: 'A House', model: 'harbour house', say: ['System', 'A low house with a courtyard wall. Over the wall, the top of a lemon tree, and the sound of a radio playing the Qur\'an very quietly.'] },
        { id: 'c1c_house9', label: 'A House', model: 'harbour house', say: ['System', 'A fisherman\'s house: floats and coils of rope stacked against the wall, and an outboard motor in bits on a sheet of cardboard.'] },
        { id: 'c1c_house10', label: 'A House', model: 'harbour house', say: ['System', 'A house with green shutters, the only green in the street. The owner is from Aswan and will tell you so.'] },
        { id: 'c1c_house11', label: 'A House', model: 'harbour house', say: ['System', 'Whitewash, a blue door, a cat on the step. The cat looks at you the way the whole town looks at you this week.'] },
        { id: 'c1c_house12', label: 'A House', model: 'harbour house', say: ['System', 'A house with its door painted for the Hajj: the Kaaba, a plane, a ship, and the owner\'s name and the year, in green.'] },
        { id: 'c1c_house13', label: 'A House', model: 'harbour house', say: ['System', 'A house with washing on the roof: overalls, a galabeya, six small white school shirts in a row like gulls.'] },
        { id: 'c1c_mosque', label: 'The Mosque', model: 'harbour mosque', say: ['System', 'The town\'s mosque: white, a small green dome, a minaret with a loudspeaker strapped to it. The fishermen pray here at dawn before they go out, and the smugglers at dusk before they do.'] },
        { id: 'c1c_cafe', label: 'The Café', model: 'harbour café', say: null },
        { id: 'c1c_kiosk', label: 'The Kiosk', model: 'street kiosk', say: null },
        { id: 'c1c_tap', label: 'The Public Tap', model: 'public tap', say: null },
        { id: 'c1c_jars_sq', label: 'Water Jars', model: 'water jars' }, { id: 'c1c_jars_q', label: 'Water Jars', model: 'water jars' }, { id: 'c1c_jars_ts', label: 'Water Jars', model: 'water jars' },
        { id: 'c1c_fulcart', label: 'Ful Cart', model: 'ful cart', say: null },
        { id: 'c1c_diveshop', label: "Rana's Dive Shop", model: 'dive shop', say: ['System', 'RED SEA DIVERS, the sign says, in English and Arabic, and under it, smaller, RANA FOUAD, PADI INSTRUCTOR. Air tanks racked by the door, wetsuits drying on a line, the diver-down flag. You used to have a key.'] },
        { id: 'c1c_nets1', label: 'Fishing Nets', model: 'nets', say: ['System', 'Fishing nets spread out to dry on poles, green and orange, with the floats still on. An old man mends them in the mornings with a wooden needle, faster than you can follow.'] },
        { id: 'c1c_tuktuk', label: 'Tuk-Tuk', model: 'tuk-tuk', say: ['System', 'A tuk-tuk with a fringe round its canopy and a sticker on the back: "Don\'t envy me, pray for me." It runs between the harbour and the hotel for anyone who can\'t face the heat.'] },
        { id: 'c1c_moto', label: 'Motorbike', model: 'motorbike', say: ['System', 'A motorbike with a fish box strapped on the back where a passenger should be. It smells exactly like you\'d expect.'] },
        { id: 'c1c_pickup', label: 'Pickup', model: 'pickup', say: ['System', 'Zaki\'s cousin\'s pickup: white once, a crack across the windscreen, an outboard motor in the back under a blanket. It goes. That\'s all anyone has ever asked of it.'] },
        { id: 'c1c_crates2', label: 'Fish Crates', model: 'fish crates', say: ['System', 'Fish crates waiting by the dive shop, half of them full of Rana\'s weights and the other half of somebody\'s onions.'] },
        { id: 'c1c_boattrailer', label: 'Boat on a Trailer', model: 'beached boat', say: ['System', 'A boat up on bricks behind the houses, being repainted blue by a man who started in 2021.'] },
        { id: 'c1c_cat', label: 'Cat', model: 'cat', say: ['System', 'A harbour cat, grey and scarred, one ear torn. It has eaten better than you this week: every fisherman in Marsa Tarfa pays it in heads and tails.'] },
        { id: 'c1c_pots', label: 'Pots of Basil', model: 'basil pots', say: ['System', 'Pots of basil and a geranium in old olive-oil tins by a doorstep, watered every evening by somebody\'s grandmother.'] },
        { id: 'c1c_goats', label: 'Goats', model: 'goats', say: ['System', 'Two goats tethered by the square, eating a cardboard box with real enthusiasm.'] },
        { id: 'c1c_wadisign', label: 'Signpost', model: 'town sign', say: ['System', 'A signpost at the mouth of the wadi, the paint sandblasted half off: a mountain village, twelve kilometres, and an arrow pointing up into the rocks. There used to be a road. The flood took it in 1996, and nobody has asked for it back.'] },
        { id: 'c1c_wadirock1', label: 'Boulders', model: 'boulder', say: ['System', 'Boulders the size of a car, rolled down the wadi by a flash flood and left where the water got bored of them.'] },
        { id: 'c1c_wadirock2', label: 'Boulder', model: 'boulder', say: null }, { id: 'c1c_acacia', label: 'Acacia', model: 'acacia', say: ['System', 'An acacia growing out of the wadi bed, flat-topped and thorny, a goat\'s idea of paradise. Its roots go down further than the well in town.'] },
        { id: 'c1c_sign', label: 'Town Sign', model: 'town sign', say: ['System', 'A blue road sign by the highway: MARSA TARFA, in Arabic and English, shot through twice, years ago, by somebody who had opinions about Marsa Tarfa.'] },
        // --- the harbour ---
        { id: 'c1c_fishmarket', label: 'The Fish Market', model: 'fish market', say: ['System', 'The fish market: a corrugated roof on poles, tables of crushed ice, the night\'s catch laid out by the kilo: grouper, parrotfish, red snapper, a heap of silver sardines, a moray eel nobody wants. The gulls are waiting for the end of the morning.'] },
        { id: 'c1c_grill', label: 'The Fish Grill', model: 'fish grill', say: null },
        { id: 'c1c_fuelstore', label: 'The Fuel Store', model: 'fuel store', say: ['System', 'The harbour\'s fuel store: a block shed, a steel door with a padlock as big as your fist, oil drums stacked along the wall. Diesel for the boats, sold by the harbour master by the litre, at a price the harbour master decides each morning.'] },
        { id: 'c1c_crates', label: 'Fish Crates', model: 'fish crates', say: ['System', 'Blue plastic fish crates stacked higher than your head, smelling of yesterday.'] },
        { id: 'c1c_nets2', label: 'Fishing Nets', model: 'nets', say: ['System', 'Nets heaped on the quay, being sorted by two boys who argue about every float.'] },
        { id: 'c1c_dhow', label: "Captain Zaki's Dhow", model: 'dhow', say: ['System', 'Captain Zaki\'s dhow, the Umm Kalthoum: an old wooden boat with a blue and white hull, a red stripe, a wheelhouse like a garden shed, old tyres hung along her side, and her name painted on the bow in curling white Arabic. She is older than you are. She is in better shape than you are.'] },
        { id: 'c1c_boat1', label: 'Fishing Boat', model: 'fishing boat', say: ['System', 'A small wooden fishing boat, painted yellow and blue, an outboard tipped up out of the water. Its name is "Thank God", which is what its owner says every time it starts.'] },
        { id: 'c1c_boat2', label: 'Fishing Boat', model: 'fishing boat', say: ['System', 'A fishing boat with an eye painted on the bow, so it can see where it\'s going in the dark.'] },
        { id: 'c1c_boat3', label: 'Fishing Boat', model: 'fishing boat', say: null }, { id: 'c1c_boat4', label: 'Fishing Boat', model: 'fishing boat', say: null },
        { id: 'c1c_coastguard', label: 'The Coast Guard Post', model: 'coast guard post', say: ['System', 'The coast guard post at the end of the breakwater: a white block with a blue stripe, a radio mast, a radar that turns when it feels like it, and the flag. Everybody in Marsa Tarfa knows the patrol boat\'s schedule except, officially, the coast guard.'] },
        { id: 'c1c_patrol', label: 'Patrol Boat', model: 'patrol boat', say: ['System', 'The coast guard\'s patrol boat: grey, fast, a machine gun on the bow under a canvas cover. It goes out at the same times every night. Nearly every night.'] },
        { id: 'c1c_bollards', label: 'Bollards', model: 'bollards', say: ['System', 'Iron bollards along the quay, worn shiny where a hundred years of ropes have run round them.'] },
        // --- the north beach, the hotel, the fort ---
        { id: 'c1c_hotel', label: 'The Beach Hotel', model: 'beach hotel', say: ['System', 'The Beach Hotel: two storeys of white arches, a dry fountain, a sign with three stars on it, and two of them are true. German divers in the winter, Egyptian families in the summer, and in between, nobody, and the cook.'] },
        { id: 'c1c_parasol1', label: 'Beach Parasol', model: 'parasol', say: ['System', 'A palm-thatch parasol on the hotel\'s beach and two plastic loungers, one with a towel left on it to keep the place since 2019.'] },
        { id: 'c1c_parasol2', label: 'Beach Parasol', model: 'parasol', say: ['System', 'A palm-thatch parasol, a bucket and a plastic spade, and footprints going down to the water.'] },
        { id: 'c1c_beachboat', label: 'Boat on the Beach', model: 'beached boat', say: ['System', 'A rowing boat pulled up on the sand, turned over, its bottom freshly tarred. A crab lives under it and has opinions about you.'] },
        { id: 'c1c_fort', label: 'The Ottoman Fort', model: 'ottoman fort', say: ['System', 'The old fort on the headland: square walls of coral stone, a round tower at each corner, a gate with a pointed arch. The Ottomans built it in the 1500s, like the one at Quseir down the coast, to guard the harbour and the pilgrims\' road to Mecca. Now it guards goats, and courting couples, and the view.'] },
        { id: 'c1c_cannon', label: 'Old Cannon', model: 'old cannon', say: ['System', 'An old iron cannon on a stone block, rusted the colour of a dried date, pointing out to sea at ships that went by three hundred years ago. Somebody has painted a heart on it.'] },
        // --- the south point: Bassem's villa ---
        { id: 'c1c_vwall_n1', label: 'Villa Wall', model: 'villa wall', say: ['System', 'A high white wall with broken glass set along the top and a camera every ten metres. Bassem likes his privacy, and other people\'s.\n\nOver it, the villa: white and new, arches and blue glass, a terrace hanging over the water, more air conditioners than windows, and a swimming pool twenty metres from the sea that nobody ever swims in. Everyone in Marsa Tarfa knows what paid for it, and everyone in Marsa Tarfa says it was fish.'] },
        { id: 'c1c_vwall_n2', label: 'Villa Wall', model: 'villa wall' }, { id: 'c1c_vwall_w', label: 'Villa Wall', model: 'villa wall' },
        { id: 'c1c_vgate', label: "The Villa's Gate", model: 'villa gate', say: null },
        { id: 'c1c_villa', label: "Bassem's Villa", model: 'villa', say: null },   // (behind the wall until beat 2: the wall says what it looks like)
        { id: 'c1c_vpool', label: 'Swimming Pool', model: 'villa pool', say: null },
        // --- the highway and the truck stop ---
        { id: 'c1c_truckcafe', label: 'The Truck Stop Café', model: 'truck stop café', say: null },
        { id: 'c1c_pumps', label: 'Fuel Pumps', model: 'fuel pumps', say: ['System', 'Two fuel pumps under a tin canopy, one for diesel and one for "petrol, sometimes." The attendant sits between them in a plastic chair with a newspaper over his face.'] },
        { id: 'c1c_lorry1', label: 'Lorry', model: 'lorry', say: ['System', 'A long-distance lorry, painted all over with flowers and eyes and the words GOD PROTECT US in red, loaded with cement for Quseir. The driver is asleep in the cab with his feet out of the window.'] },
        { id: 'c1c_lorry2', label: 'Lorry', model: 'lorry', say: ['System', 'A lorry with a tarpaulin over its load and a chain round the tarpaulin. Whatever it is, it is going to Cairo and doesn\'t want to talk about it.'] },
        // --- out on the reef ---
        { id: 'c1c_diveboat', label: 'Dive Boat', model: 'dive boat', say: null },
        { id: 'c1c_buoy1', label: 'Buoy', model: 'buoy', say: null }, { id: 'c1c_buoy2', label: 'Buoy', model: 'buoy', say: null }, { id: 'c1c_buoy3', label: 'Buoy', model: 'buoy', say: null },
        // --- the people (their scenes: poke/ch1c_scenes.js) ---
        { id: 'c1c_zaki', label: 'Captain Zaki', model: 'person' }, { id: 'c1c_fisherman', label: 'Fisherman', model: 'person' }, { id: 'c1c_griller', label: 'Fish Griller', model: 'person' },
        { id: 'c1c_fishseller', label: 'Fish Seller', model: 'person' }, { id: 'c1c_cafeman', label: 'Café Owner', model: 'person' }, { id: 'c1c_kioskman', label: 'Kiosk Man', model: 'person' },
        { id: 'c1c_tapwoman', label: 'Woman at the Tap', model: 'person' }, { id: 'c1c_kid1', label: 'Boy', model: 'person' }, { id: 'c1c_kid2', label: 'Boy', model: 'person' },
        { id: 'c1c_oldman', label: 'Old Man', model: 'person' }, { id: 'c1c_vguard', label: "Bassem's Man", model: 'person' }, { id: 'c1c_cgofficer', label: 'Coast Guard', model: 'person' },
        { id: 'c1c_truckman', label: 'Café Man', model: 'person' }, { id: 'c1c_driver', label: 'Lorry Driver', model: 'person' }, { id: 'c1c_hotelman', label: 'Hotel Porter', model: 'person' },
        { id: 'c1c_imam', label: 'The Imam', model: 'person' },
    ],
};
// the street lamps (the layout says where; they only need to exist)
for (let i = 0; i < 24; i++) window.POKE_MAP_1C.objects.push({ id: 'ow_pathlamp' + i, label: 'Street Lamp', model: 'path lamp', say: null });
