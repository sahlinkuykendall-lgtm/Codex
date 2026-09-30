// ============================================================
// THE CODEX OF GIZA — POKE STYLE: WHAT SAQQARA SAYS (poke/map_ch1b.js)
// Chapter 1-B's objects, in the same shape as the 3D export for Giza
// (map_ch1.js): an id, a label, a model (the sprite it's drawn as), and
// what it says when you look at it. Scripted things (the people, the
// story) get their scenes in poke/ch1b_scenes.js; `say` is the fallback.
// ============================================================
window.POKE_MAP_1B = {
    interiors: {},
    objects: [
        // --- the inspectorate compound ---
        { id: 'c1b_office', label: 'The Inspectorate', model: 'inspectorate', say: ['System', 'The Saqqara inspectorate: two storeys of government whitewash, bars on the ground floor, air conditioners weeping down the front. The sign says MINISTRY OF TOURISM AND ANTIQUITIES. The flag on the roof has seen better decades.'] },
        { id: 'c1b_cwall_n', label: 'Compound Wall', model: 'compound wall' }, { id: 'c1b_cwall_w', label: 'Compound Wall', model: 'compound wall' }, { id: 'c1b_cwall_e', label: 'Compound Wall', model: 'compound wall' },
        { id: 'c1b_cwall_s1', label: 'Compound Wall', model: 'compound wall' }, { id: 'c1b_cwall_s2', label: 'Compound Wall', model: 'compound wall' },
        { id: 'c1b_fathicar', label: "The Director's Car", model: 'car', say: ['System', 'Director Fathi\'s Peugeot, cream under the dust, parked in the only shade in the compound. On the dashboard, a box of tissues, a string of prayer beads, and a parking permit for the Ministry in Cairo that expired in 2019.'] },
        { id: 'c1b_bike', label: "Samy's Motorbike", model: 'motorbike', say: ['System', 'Samy Ragab\'s motorbike: red, new, and far too expensive for a junior inspector\'s pay. The helmet on the seat still has the shop\'s sticker on it.'] },
        { id: 'c1b_teacorner', label: "Umm Sabry's Corner", model: 'tea corner', say: ['System', 'Umm Sabry\'s kingdom: a table, a gas ring, a kettle that has never once been cold, a tray of glasses. Every piece of news on the plateau passes through here first.'] },
        { id: 'c1w_zeer_insp', label: 'Water Jars', model: 'water jars' },
        { id: 'c1b_umsabry', label: 'Umm Sabry', model: 'person' }, { id: 'c1b_samy', label: 'Samy Ragab', model: 'person' },
        // --- the Step Pyramid ---
        { id: 'c1b_wall_n', label: 'Enclosure Wall', model: 'niched wall', say: ['System', 'The enclosure wall of Djoser\'s pyramid complex: pale limestone panelled like the front of a palace, bastions every few paces. It ran for a mile and a half. Most of it is a stump now; the Ministry has rebuilt a stretch to show what it was.'] },
        { id: 'c1b_wall_w', label: 'Enclosure Wall', model: 'niched wall' }, { id: 'c1b_wall_e', label: 'Enclosure Wall', model: 'niched wall' }, { id: 'c1b_wall_s1', label: 'Enclosure Wall', model: 'niched wall' }, { id: 'c1b_wall_s2', label: 'Enclosure Wall', model: 'niched wall' },
        { id: 'c1b_entrance', label: 'The Entrance', model: 'entrance colonnade', say: ['System', 'The only real way into Djoser\'s enclosure, of the fifteen carved on its walls: a narrow gate, and beyond it a colonnade of ribbed columns, stone carved to look like bundles of reeds. Beside the gate, a stone door is carved standing open, forever.'] },
        { id: 'c1b_steppyramid', label: 'The Step Pyramid', model: 'step pyramid', say: ['System', 'The Step Pyramid of Djoser: six steps of limestone, sixty metres high, and forty-six centuries old. The first building in the world made entirely of cut stone. Imhotep designed it, and was made a god for it.\n\nYou walk past it every morning. You still look up.'] },
        { id: 'c1b_hebsed', label: 'Heb-Sed Court', model: 'heb-sed chapels', say: ['System', 'A row of chapels for the king\'s jubilee, every one a dummy: solid inside, their doors carved shut. They were built so Djoser could celebrate his thirty-year festival for eternity, running between the markers in the court.'] },
        { id: 'c1b_serdab', label: 'The Serdab', model: 'serdab', say: ['System', 'A sealed stone box against the pyramid\'s side, with two holes drilled at eye height. Inside, Djoser sits on his throne and looks out, as he has since 2650 BC. (The one in there is a copy. The real one is in the museum in Cairo. The eyes still get you.)'] },
        { id: 'c1b_southtomb', label: 'The South Tomb', model: 'south tomb', say: ['System', 'The South Tomb: a second, empty burial for the king, under a wall topped with a frieze of cobras. Nobody agrees what it was for. Your professor in Cairo thought it was for the king\'s ka. Your professor in Cairo thought a lot of things.'] },
        // --- the coach park ---
        { id: 'c1b_bus', label: 'Tour Coach', model: 'bus', say: ['System', 'A tour coach, engine running for the air conditioning, driver asleep with the seat tipped back. Forty people from Lyon are inside the pyramid complex with fifty minutes to see it.'] },
        { id: 'c1b_souvenirs', label: 'Souvenir Stall', model: 'souvenir stall', say: ['System', 'Papyrus prints (banana leaf, mostly), alabaster pyramids (resin, mostly), scarabs by the kilo. The stallholder sees your Ministry ID and suddenly finds something to do in his cash box.'] },
        { id: 'c1b_camel1', label: 'Camel', model: 'camel', say: ['System', 'A camel in a red saddle blanket, chewing, looking at the Step Pyramid as if it had seen better.'] },
        { id: 'c1b_camel2', label: 'Camel', model: 'camel', say: ['System', 'Another camel, a tassel over one eye like a lady\'s veil. Its owner is not licensed. Its owner is also not here.'] },
        { id: 'c1b_cameleer', label: 'Camel Man', model: 'person' }, { id: 'c1b_tpolice', label: 'Tourist Policeman', model: 'person' },
        // --- the Serapeum ---
        { id: 'c1b_serapeum', label: 'The Serapeum', model: 'serapeum entrance', say: ['System', 'Steps cut down into the rock, and at the bottom a stone doorway with an iron gate: the Serapeum, where the sacred Apis bulls of Memphis were buried, each in a granite box heavier than a house, in galleries four hundred metres long. The gate is locked. Your key ring has the key.'] },
        { id: 'c1b_ghafhut', label: "Guard's Hut", model: 'ghaffir hut', say: ['System', 'The ghaffir\'s hut: mud brick, a lean-to of palm fronds, a bench along the wall, a kettle. The man who guards the Serapeum has guarded it since before you were born.'] },
        { id: 'c1b_ghaffir', label: 'The Ghaffir', model: 'person' }, { id: 'c1w_zeer_ser', label: 'Water Jars', model: 'water jars' },
        // --- the Teti pyramid and its dig ---
        { id: 'c1b_teti', label: 'The Teti Pyramid', model: 'teti pyramid', say: ['System', 'The pyramid of Teti: from out here, a heap of rubble the size of a hill. Its casing was stripped for building stone a thousand years ago. Inside, the burial chamber walls are covered in the Pyramid Texts, the oldest religious writing in the world, perfect as the day they were cut.'] },
        { id: 'c1b_tetispoil', label: 'Spoil Heap', model: 'spoil', say: ['System', 'The Teti excavation\'s spoil heap, still dark from being dug. Every bucket of it goes through the sieve before it comes here. Rais Gad sees to that.'] },
        { id: 'c1b_tetisieve', label: 'Sieve', model: 'sieve', say: ['System', 'A sieve on trestles at the Teti dig. Mostly sand. Sometimes a bead. Once, famously, a gold ring, and the boy who found it still talks about it.'] },
        { id: 'c1b_gad', label: 'Rais Gad', model: 'person' }, { id: 'c1b_digman1', label: 'Workman', model: 'person' }, { id: 'c1b_digman2', label: 'Workman', model: 'person' }, { id: 'c1w_zeer_teti', label: 'Water Jars', model: 'water jars' },
        // --- the mastabas ---
        { id: 'c1b_mastaba1', label: 'Mastaba', model: 'mastaba', say: ['System', 'A mastaba: an official\'s tomb, a flat-topped bench of stone with the burial shaft deep inside. The false door on the front is where his spirit was meant to come out for the offerings. The offering table is still there, empty.'] },
        { id: 'c1b_mastaba2', label: 'Mastaba', model: 'mastaba', say: ['System', 'A mud-brick mastaba, melting slowly back into the desert it was made from. Your predecessor\'s notes call it "unexcavated, unremarkable". Your predecessor retired to Alexandria.'] },
        { id: 'c1b_mastaba3', label: 'Mastaba', model: 'mastaba', say: ['System', 'A stone mastaba, its corner fallen in. Through the gap you can see the rubble fill the builders packed inside, four and a half thousand years ago, and a scorpion who has opinions about you.'] },
        { id: 'c1b_mastaba4', label: 'Closed Mastaba', model: 'mastaba', say: ['System', 'A mud-brick mastaba on the register as CLOSED: NOT FOR VISITS. A strip of Ministry tape across the false door, faded pink by the sun.'] },
        { id: 'c1b_robtunnel', label: 'A Fresh Hole', model: "robbers' hole", say: ['System', 'A hole dug under the closed mastaba\'s edge, the spoil still dark: dug last night, or the night before. A crowbar thrown down beside it. Somebody means to come back.'] },
        { id: 'c1b_oldtomb', label: 'A Sealed Tomb', model: 'sealed tomb', say: ['System', 'A doorway cut into the rock of the far corner, blocked with ancient masonry, a rope and a clay seal across it older than the Ministry. Above it, so faint you might be imagining it, paint: a river, and beside it a woman and a small boy.'] },
        // --- Mit Rahina ---
        { id: 'c1b_house1', label: 'House', model: 'village house', say: ['System', 'A house of red brick in a concrete frame, rebar sticking out of the roof for the second floor, when there is money. There is never money. The rebar is optimistic.'] },
        { id: 'c1b_house2', label: 'House', model: 'village house', say: ['System', 'A plastered house with a blue door. Someone inside is frying onions, and someone else is losing an argument about it.'] },
        { id: 'c1b_house3', label: 'House', model: 'village house', say: ['System', 'A house with the Hajj painted beside the door: the Kaaba, an aeroplane, a date, a name. The man who lives here went to Mecca in 1998 and the whole village knows it.'] },
        { id: 'c1b_house4', label: 'House', model: 'village house', say: ['System', 'A house with washing on the roof and a pigeon loft. The pigeons are for eating, the washing is not, and the children are told this often.'] },
        { id: 'c1b_house5', label: 'House', model: 'village house', say: ['System', 'A house built, like half the village, on top of Memphis: every time somebody digs a new foundation here, they find a wall of Ramesses the Great and call the Ministry, or don\'t.'] },
        { id: 'c1b_house6', label: 'House', model: 'village house', say: ['System', 'A shuttered house. A grandmother on the step shells beans into a bowl and watches everything in the lane without appearing to look up.'] },
        { id: 'c1b_house7', label: 'House', model: 'village house', say: ['System', 'A house with a satellite dish bigger than its front door. Through the window, a football match and six men giving the referee advice.'] },
        { id: 'c1b_mosque', label: 'The Mosque', model: 'mosque', say: ['System', 'The village mosque: cream walls, a green dome, a minaret with loudspeakers wired to its balcony. Shoes in a row by the door. The muezzin has a good voice and knows it.'] },
        { id: 'c1b_cafe', label: 'The Café', model: 'café', say: ['System', 'The ahwa: tin tables out front, a television showing football, the clack of backgammon, the bubble of a shisha. Men who have been sitting here since dawn will be sitting here at midnight.'] },
        { id: 'c1b_well', label: 'The Village Well', model: 'village well', say: ['System', 'The village well, with an old iron hand pump over it and a stone trough. The water comes up cold from the same water table that floods the Serapeum\'s lowest gallery.'] },
        { id: 'c1b_bakery', label: 'The Bakery', model: 'bakery', say: ['System', 'The baladi bakery: a queue at the hatch, the oven roaring inside, round loaves of aish cooling on palm-rib racks. The smell reaches the inspectorate on a north wind.'] },
        { id: 'c1b_cafeowner', label: 'Café Owner', model: 'person' }, { id: 'c1b_baker', label: 'The Baker', model: 'person' },
        { id: 'c1b_stall_fruit', label: 'Fruit Stall', model: 'market stall', say: ['System', 'Oranges in pyramids, bananas on a hook, tomatoes heaped red. The fruit seller builds the pyramids better than Djoser did, and says so.'] },
        { id: 'c1b_stall_cloth', label: 'Cloth Stall', model: 'market stall', say: ['System', 'Bolts of cloth hung like flags: galabeya cotton, satin for weddings, a football-shirt polyester in every club\'s colours.'] },
        { id: 'c1b_stall_spice', label: 'Spice Stall', model: 'market stall', say: ['System', 'Sacks rolled open: cumin, chilli, dried hibiscus for karkadeh, coriander, a sack of something the seller will only describe as "for the stomach."'] },
        { id: 'c1b_stall_veg', label: 'Vegetable Stall', model: 'market stall', say: ['System', 'Tomatoes, onions, bunches of molokhia and dill. A cat sleeps in the empty crate underneath, paid in scraps.'] },
        { id: 'c1b_fruitseller', label: 'Fruit Seller', model: 'person' }, { id: 'c1b_spiceseller', label: 'Spice Seller', model: 'person' },
        { id: 'c1b_garage', label: 'The Garage', model: 'garage', say: ['System', 'A mechanic\'s: a car\'s nose in the dark, tyres stacked like coins, a hand-painted sign promising everything. On the wall inside, a calendar of a Swiss mountain, which is the only snow this village has seen.'] },
        { id: 'c1b_mechanic', label: 'Mechanic', model: 'person' },
        { id: 'c1b_tuktuk', label: 'Tuk-Tuk', model: 'tuk-tuk', say: ['System', 'A red tuk-tuk with a fringe on its canopy and a sticker on the back: "Don\'t envy me, pray for me." The driver is in the café.'] },
        { id: 'c1b_donkey', label: 'Donkey Cart', model: 'donkey cart', say: ['System', 'A donkey asleep standing up in its harness, the cart behind it piled with clover. It opens one eye at you, decides you are not food, and closes it.'] },
        // --- the museum garden ---
        { id: 'c1b_colossus', label: 'Colossus of Ramesses II', model: 'fallen colossus', say: ['System', 'Ramesses the Great, ten metres of limestone, lying on his back where he fell: the nemes, the false beard, a scroll in each fist, broken off at the knees. He stood at the gate of the temple of Ptah in Memphis, the capital of Egypt for three thousand years. That was here. All of it, under the palms and the onion fields.'] },
        { id: 'c1b_sphinx', label: 'Alabaster Sphinx', model: 'alabaster sphinx', say: ['System', 'The alabaster sphinx: eighty tonnes of calcite the colour of honey and milk, a pharaoh\'s face on a lion\'s body. Nobody is sure which pharaoh. It doesn\'t seem to mind.'] },
        { id: 'c1b_kiosk', label: 'Ticket Kiosk', model: 'ticket kiosk', say: ['System', 'The open-air museum\'s ticket kiosk. The ticket man waves your Ministry ID through without looking up from his phone.'] },
        { id: 'c1b_statues', label: 'Statue Fragments', model: 'statue fragments', say: ['System', 'Bits of Memphis on plinths: a granite head with no body, a column capital carved like a bundle of papyrus, a stela worn smooth. Labelled in Arabic, English, and a French that stopped being correct in 1950.'] },
        { id: 'c1b_tourist1', label: 'Tourist', model: 'person' }, { id: 'c1b_tourist2', label: 'Tourist', model: 'person' }, { id: 'c1b_guide', label: 'Guide', model: 'person' },
    ],
};
// the road lamps (the layout says where; they only need to exist)
for (let i = 0; i < 24; i++) window.POKE_MAP_1B.objects.push({ id: 'ow_pathlamp' + i, label: 'Street Lamp', model: 'path lamp', say: null });
