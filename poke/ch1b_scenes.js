// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-B, SAQQARA (poke/ch1b_scenes.js)
// The Inspector's opening (story/regions/ch01_opening_inspector.md). Who's
// here follows the bible (story/01_CHARACTERS.md §Ch1-B): Director Fathi
// Mansour, Inspector Samy Ragab, Umm Sabry, Rais Gad. Karim el-Gebali and
// Colonel Radwan come in their beats. Everyone else is nameless: the
// ghaffir, the camel man, the market, the tourists.
// Step 1 (this file so far): the area, the cast on the map, and beat 1:
// the morning, tea with Umm Sabry, the Director, the scratched-out ledger.
// ============================================================

// ---- the cast's looks (new people, nobody from Giza) ----
Object.assign(LOOKS, {
    umsabry: { skin: 4, robe: ['#5a4a6a', '#40344e', '#2a2236'], head: 'hijab', headCol: ['#2e2824', '#1c1814', '#100c0a'], shoeKind: 'babouche', shoe: '#1c1814', wide: true },
    fathi: { skin: 3, top: ['#a8acb4', '#86909a', '#646c78'], topKind: 'jacket', legs: ['#86909a', '#646c78', '#4a5058'], hairStyle: 'bald', hairCol: HAIRS[8], face: 'tache', tache: '#a8a8ac', wide: true, shoe: '#1c1814' },
    samy: { skin: 4, top: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], topKind: 'tee', legs: CLOTH.indigo, hairStyle: 'short', hairCol: HAIRS[0], face: 'stubble', shoeKind: 'sneakers', shoe: '#f4f4f0' },
    gad: { skin: 3, robe: ['#a88a68', '#8a6c4c', '#6a5034'], head: 'turban', headCol: CLOTH.linen, face: 'tache', tache: '#4a4040', shoeKind: 'sandals', shoe: '#5c3418', wide: true },
    ghaffir: { skin: 4, robe: ['#8a8c80', '#6c6e62', '#4e5046'], head: 'turban', headCol: ['#d8c8a0', '#b8a880', '#988860'], face: 'beard', beard: '#d8d8d0', shoeKind: 'sandals', shoe: '#5c3418' },
    digman1: { skin: 5, robe: ['#c8b890', '#a89870', '#887850'], head: 'skullcap', headCol: ['#c8b890', '#a89870', '#887850'], shoeKind: 'sandals', shoe: '#5c3418' },
    digman2: { skin: 4, top: ['#6a8ab0', '#4c6c90', '#344e70'], topKind: 'tee', legs: CLOTH.sand, botKind: 'sirwal', head: 'turban', headCol: CLOTH.linen, shoeKind: 'sandals', shoe: '#5c3418' },
    cameleer: { skin: 5, robe: ['#b8c8e0', '#98a8c0', '#7888a0'], stripes: '#5a6a88', head: 'keffiyeh', headCol: CLOTH.linen, face: 'tache', shoeKind: 'sandals', shoe: '#5c3418' },
    tpolice: { skin: 3, top: ['#f8f8f4', '#e0e0d8', '#c0c0b8'], topKind: 'jacket', legs: ['#f8f8f4', '#e0e0d8', '#c0c0b8'], head: 'cap', headCol: CLOTH.black, face: 'shades', shoe: '#1c1814' },
    cafeowner: { skin: 4, top: CLOTH.linen, topKind: 'vest', legs: ['#5a4a3a', '#44382c', '#302820'], hairStyle: 'short', hairCol: HAIRS[8], face: 'tache', tache: '#c0c0c8', wide: true, shoe: '#1c1814' },
    baker: { skin: 3, top: ['#fffaf0', '#ece4d4', '#c8c0b0'], topKind: 'tank', legs: ['#fffaf0', '#ece4d4', '#c8c0b0'], botKind: 'sirwal', head: 'skullcap', headCol: CLOTH.linen, shoeKind: 'barefoot', shoe: '' },
    fruitseller: { skin: 5, robe: ['#8a6a48', '#6e5236', '#523a26'], head: 'skullcap', headCol: ['#f0f0e8', '#d8d8d0', '#b8b8b0'], face: 'stubble', shoeKind: 'sandals', shoe: '#5c3418' },
    spiceseller: { skin: 4, robe: CLOTH.black, head: 'hijab', headCol: ['#c84830', '#a03020', '#781c14'], shoe: '#1c1814', slim: true },
    mechanic: { skin: 4, top: ['#6a7480', '#4e5864', '#3a424c'], topKind: 'tee', legs: CLOTH.indigo, head: 'cap', headCol: ['#c83828', '#a02820', '#701c14'], face: 'stubble', shoe: '#1c1814' },
    tourist1: { skin: 0, top: ['#f08870', '#d86850', '#b04c38'], topKind: 'tee', legs: CLOTH.khaki, botKind: 'shorts', head: 'straw', hairCol: HAIRS[7], acc: 'camera', shoeKind: 'sandals', shoe: '#804c28' },
    tourist2: { skin: 1, top: ['#a8d8f0', '#80b8d8', '#5a94b8'], topKind: 'tunic', legs: CLOTH.linen, botKind: 'skirt', head: 'straw', hairCol: HAIRS[4], hairStyle: 'long', shoeKind: 'sandals', shoe: '#804c28', slim: true },
    guide: { skin: 3, top: CLOTH.khaki, topKind: 'shirt', legs: ['#5a5048', '#443c36', '#2e2824'], hairStyle: 'short', hairCol: HAIRS[0], face: 'shades', acc: 'satchel', shoe: '#4c3020' },
});
Object.assign(CAST, {
    c1b_umsabry: 'umsabry', c1b_samy: 'samy', c1b_gad: 'gad', c1b_ghaffir: 'ghaffir', c1b_digman1: 'digman1', c1b_digman2: 'digman2', c1b_cameleer: 'cameleer', c1b_tpolice: 'tpolice',
    c1b_cafeowner: 'cafeowner', c1b_baker: 'baker', c1b_fruitseller: 'fruitseller', c1b_spiceseller: 'spiceseller', c1b_mechanic: 'mechanic', c1b_tourist1: 'tourist1', c1b_tourist2: 'tourist2', c1b_guide: 'guide',
});
Object.assign(REL_NAMES, { umsabry: 'Umm Sabry', fathi: 'Director Fathi', samy: 'Samy Ragab', gad: 'Rais Gad' });
Object.assign(ITEM_INFO, {
    'Ministry ID': { key: 1, desc: 'Your inspector\'s identity card: MINISTRY OF TOURISM AND ANTIQUITIES, Saqqara. It opens gates, silences souvenir sellers, and impresses nobody at the Ministry itself.' },
    'Service phone': { key: 1, desc: 'The inspectorate\'s phone, which you have to sign for. The screen is cracked in the shape of the Nile Delta.' },
    'Key ring': { key: 1, desc: 'Your ring of site keys: the Serapeum gate, the storerooms on your beat, and three keys nobody has ever identified.' },
});

// ---- the area ----
AREAS.inspector = {
    name: 'SAQQARA', clock: 8 * 60 + 30, giza: false,
    layout: () => saqqaraLayout(), objects: () => window.POKE_MAP_1B,
    newGame() {
        Game.bag = { 'Field journal': 1, 'Ministry ID': 1, 'Service phone': 1, 'Key ring': 1, Canteen: 1 }; sflag('canteen', 3);
        Story.s.messages = [{ from: 'Director Fathi', t: '07:52', unread: true, text: 'Come to my office when you arrive. Not before tea. — F.M.' }];
        Story.s.ledger = [{ t: '08:30', a: money(), why: 'Balance (a junior inspector\'s salary, the 1st of the month)' }];
        skillsState();
        task('c1b_tea', 'Tea with Umm Sabry, in her corner of the inspectorate yard.');
        setTimeout(() => startDialogue('c1b_start'), 700);
    },
    frame() { }, sync() { }, clockPassed() { },
    door() { return false; },
    onEnter(room) { if (room === 'INT_INSPECTORATE') taskDone('c1b_enter'); },
    watch() { return Story.s.clock < 24 * 60 ? ' Tuesday.' : ' Wednesday, very early.'; },
};

// ============================================================
// BEAT 1: MORNING AT THE INSPECTORATE
// ============================================================
scene('c1b_start', {
    speaker: 'System',
    text: () => `Half past eight, Tuesday, and already hot. The inspectorate yard: the Director's dusty Peugeot in the only shade, Samy Ragab's new red motorbike, and in the corner, the kettle, and Umm Sabry, who knows everything.\n\nThe Codex is gone from Shelf 4B. The ledger line is scratched out. And the Director wants you, "not before tea."`,
    choices: [{ text: 'Go and get your tea.', onSelect: () => { Toast.show('Walk: the arrow keys or WASD.   Look and talk: SPACE.   The phone: P.', 6); } }],
});
STORY_SCRIPTS.c1b_umsabry = 'c1b_umsabry';
scene('c1b_umsabry', {
    speaker: 'Umm Sabry',
    text: () => sflag('c1b_tea')
        ? `Umm Sabry refills a glass nobody asked her to refill. "Go on. The Director is waiting, and a waiting director is a director who remembers things."`
        : `Umm Sabry has your glass poured before you reach her: black tea, three sugars, the way your mother made it. She looks at you over the kettle like a hawk looks at a field.\n\n"You look like somebody who has seen a shelf with nothing on it." She sets the glass down. "Sit. Drink. Then I tell you something, and you owe me something."`,
    get choices() {
        if (sflag('c1b_tea')) return [{ text: '"Shukran, Umm Sabry."' }];
        return [
            { text: '"What do you know?"', nextScene: 'c1b_umsabry2' },
            { text: 'Drink your tea first. Politely.', onSelect: () => rel('umsabry', 3, true), nextScene: 'c1b_umsabry2' },
        ];
    },
});
scene('c1b_umsabry2', {
    speaker: 'Umm Sabry',
    text: `She leans in. The kettle ticks.\n\n"Samy Ragab stayed late last night. Samy, who leaves at two every day to sell insurance to his cousins. The light in the store room was on until eleven, my nephew saw it from the road."\n\nShe sits back. "And a black car comes for the Director on Tuesdays. It is Tuesday."`,
    choices: [
        { text: '"What do I owe you?"', nextScene: 'c1b_umsabry3' },
        { text: '"Why tell me?"', nextScene: 'c1b_umsabry3' },
    ],
});
scene('c1b_umsabry3', {
    speaker: 'Umm Sabry',
    text: `"Gossip." She says it like a merchant naming a price. "Not money. Money I have. Somebody on this site is romancing the accountant, and I don't know who. I don't like not knowing who."\n\nShe hands you a second glass for the Director. "Take him this. He drinks it and he forgets to be angry."`,
    choices: [{ text: 'Take the Director\'s tea.', onSelect: () => {
        sflag('c1b_tea', true); taskDone('c1b_tea'); drink(15, 'Umm Sabry\'s tea');
        storyNote('Umm Sabry', 'Samy Ragab stayed late last night: the store-room light was on until eleven. And "a black car comes for the Director on Tuesdays." It is Tuesday.\n\nHer price is gossip: who is romancing the accountant?');
        task('c1b_fathi', 'Take Director Fathi his tea: his office is inside the inspectorate.'); task('c1b_accountant', '(Umm Sabry\'s price) Find out who is romancing the accountant.');
        storyNotice('Umm Sabry will remember that you listened.');
    } }],
});

// ---- the inspectorate, inside: the Director's office, the evidence store ----
ROOMS.INT_INSPECTORATE = {
    name: 'THE INSPECTORATE', tw: 13, th: 8, style: 'office',
    enter: ['System', 'The inspectorate, inside: a corridor of filing cabinets, a ceiling fan losing its argument with the heat, the Director\'s desk at the back under a portrait of the Minister, and in the corner, the evidence store: a steel cage with a ledger on a stand at its door.'],
    build({ map, A, put, wall, pw, ph, W }) {
        WALLART.poster(A, (pw >> 1) - 13, 10); wall((pw >> 1) - 15, 30, null, { label: 'Portrait', say: ['System', 'The Minister of Tourism and Antiquities, in a gilt frame, smiling the smile of a man who has never been inside a tomb in August.'] });
        WALLART.clock(A, (pw >> 1) + 40, 22); WALLART.map(A, 40, 12); wall(38, 48, null, { label: 'Site Map', say: ['System', 'The Saqqara site map, every tomb numbered, your beat outlined in green marker: the Step Pyramid complex, the Teti cemetery, the Serapeum. Three seals to check today, and every day.'] });
        put((pw >> 1) - 40, W + 20, FURN.bigDesk(), 'c1b_fathidesk', { label: "The Director's Desk", say: ['System', 'The Director\'s desk: a newspaper, a phone, a stamp for every occasion, and a glass of tea going cold. A notepad by the phone has one word written on it and underlined: TUESDAY.'] });
        put((pw >> 1) - 8, W + 4, FURN.chair(true));
        const fx = (pw >> 1) + 0, fy = W + 18, fe = World.addEnt(map, { x: fx, y: fy, w: 0, d: 0, id: 'c1b_fathi', label: 'Director Fathi', person: { sheet: personSheet(LOOKS.fathi), dir: 0, frame: 0 }, sortY: fy });
        map.people.push(fe);
        // the evidence store: a cage in the corner, shelves, Shelf 4B empty, the ledger on its stand
        const cx = pw - 136, cy = W + 4;
        put(cx + 4, cy, FURN.shelf(), null, { label: 'Evidence Shelves', say: ['System', 'Evidence shelves, every box tagged in the inspectorate\'s red ink: a faience amulet, a stela fragment, a lot of pottery from the Teti dig. Every box where the ledger says it should be.'] });
        put(cx + 46, cy, FURN.shelf(), 'c1b_shelf4b', { label: 'Shelf 4B', script: 'c1b_shelf4b' });
        put(cx + 88, cy, FURN.cabinet(false), null, { label: 'Filing Cabinet', say: ['System', 'Inspection reports going back to 1985, alphabetised by a filing clerk who retired in 2003. Nothing after that is alphabetised.'] });
        A.r(cx - 4, W - 2, 2, 110, PAL.metal[3]); for (let y = W; y < W + 108; y += 6) A.hl(cx - 4, y, 3, PAL.metal[2]);                              // the cage's mesh, its side
        put(cx - 30, W + 70, FURN.radioTable(), 'c1b_ledger', { label: 'The Evidence Ledger', script: 'c1b_ledger' });
        put(14, W + 4, FURN.cabinet(true)); put(44, W + 4, FURN.cabinet(false)); put(16, ph - 64, FURN.fan()); put(pw - 36, ph - 78, FURN.cooler(), null, { label: 'Water Cooler', script: 'c1b_cooler' });
        put(80, ph - 96, FURN.desk(70, false), null, { label: "Samy's Desk", say: ['System', 'Samy Ragab\'s desk: tidy for once. Too tidy. A carton of Cleopatra cigarettes in the drawer, and a receipt from a phone shop in Mit Rahina for a phone he doesn\'t carry.'] });
        put((pw >> 1) - 56, W + 70, FURN.rug(112, 60, PAL.red));
    },
};
STORY_SCRIPTS.c1b_fathi = 'c1b_fathi';
scene('c1b_fathi', {
    speaker: 'Director Fathi',
    text: () => sflag('c1b_fathi')
        ? `Director Fathi turns a page of his newspaper. "Clerical error. I said it once. I am a busy man, I don't like to say things twice."`
        : `Director Fathi Mansour doesn't look up from his newspaper. ${sflag('c1b_tea') ? 'He takes the tea without looking at it, and drinks, and some of the stiffness goes out of his shoulders. ' : ''}\n\n"The ledger. Yes. I saw." A page turns. "File it as a clerical error."\n\nYou say that Dr. Hale logged it in person five days ago, the day before she disappeared, that her signature is in the book.\n\n"Then Dr. Hale made a clerical error." The newspaper lowers two centimetres. "Inspector. I have been in this service thirty-one years. I would like to finish them. Do your round. Check your seals. Go home."`,
    get choices() {
        if (sflag('c1b_fathi')) return [{ text: 'Leave him to his paper.' }];
        return [
            { text: '"Yes, Director."', onSelect: () => { rel('fathi', 3, true); c1bFathiDone(); } },
            { text: '"A codex is not a clerical error."', onSelect: () => { rel('fathi', -3, true); c1bFathiDone(); }, nextScene: 'c1b_fathi_push' },
        ];
    },
});
scene('c1b_fathi_push', { speaker: 'Director Fathi', text: `The newspaper goes back up. From behind it: "Everything is a clerical error, Inspector, until someone decides it isn't. Make sure that someone is not you."`, choices: [{ text: 'Go.' }] });
function c1bFathiDone() {
    sflag('c1b_fathi', true); taskDone('c1b_fathi');
    storyNote('Director Fathi Mansour', '"File it as a clerical error." He had already seen the ledger. His notepad by the phone says TUESDAY, underlined.');
    task('c1b_round', 'Your inspection round: check the three tomb seals on your beat (the Step Pyramid complex, the Teti cemetery, the Serapeum).');
}
scene('c1b_ledger', {
    speaker: 'System',
    text: `The evidence ledger, open on its stand. Faience amulet, Saite. Limestone stela fragment. Pottery lot, Teti extension. And then a line scratched out so hard the pen went through the paper: "1 leather codex, Late Antique", and beside it, still perfectly readable, Dr. Miriam Hale's signature and the date, five days ago.\n\nWhoever scratched it out used the inspectorate's red pen. There are only three of those. One is on the Director's desk. One is on Samy's.`,
    choices: [{ text: 'Photograph the page with the service phone.', onSelect: () => { if (!sflag('c1b_ledger')) { sflag('c1b_ledger', true); skillXP('investigation', 20, 'the ledger'); storyNote('The evidence ledger', '"1 leather codex, Late Antique", logged in by Dr. Miriam Hale five days ago, the day before she disappeared, then scratched out in the inspectorate\'s red pen. Only three people have those pens: the Director, Samy Ragab, and you.'); } } }, { text: 'Leave it.' }],
});
scene('c1b_shelf4b', {
    speaker: 'System',
    text: `Shelf 4B. The label is there in red ink, in Samy's round handwriting: "4B: M. HALE, CODEX, HOLD PENDING REVIEW." Under it, nothing. A clean rectangle in the dust, the size of a large book, and a crumb of green-glazed faience someone kicked into the corner.`,
    choices: [{ text: 'Note it.', onSelect: () => { if (!sflag('c1b_shelf')) { sflag('c1b_shelf', true); skillXP('investigation', 10, 'Shelf 4B'); storyNote('Shelf 4B', 'The label is in Samy\'s handwriting. The dust shows the Codex sat there until very recently.'); } } }],
});
scene('c1b_cooler', { speaker: 'System', text: 'The water cooler, with a paper cone dispenser that has been empty since the spring.', choices: [{ text: 'Drink from your hands.', onSelect: () => { const r = refill(); drink(35, 'Cold water'); if (r) Notice.show(r.trim()); } }, { text: 'Leave it.' }] });

// ============================================================
// THE OTHERS (lines for now: their stories come in their beats and side quests)
// ============================================================
STORY_SCRIPTS.c1b_samy = 'c1b_samy';
scene('c1b_samy', {
    speaker: 'Samy Ragab',
    text: () => `Samy Ragab is leaning on his new motorbike, smoking, and he flicks the cigarette away when he sees you coming, as if you were the Director.\n\n"Ya salaam, early bird." He grins too wide. ${sflag('c1b_ledger') ? '"You look at me like I owe you money. Clerical error, the Director says. Happens every week in this place, no?"' : '"Hot already. They say forty-two today. Me, I stay in the shade, you should too."'}`,
    choices: [{ text: '"Nice bike, Samy."', nextScene: 'c1b_samy_bike' }, { text: 'Leave him.' }],
});
scene('c1b_samy_bike', { speaker: 'Samy Ragab', text: `"My cousin's." Too fast. "He lends it. Family, you know how it is." He looks at the gate, at the road, at anything but you.`, choices: [{ text: '"Sure."', onSelect: () => { if (!sflag('c1b_samybike')) { sflag('c1b_samybike', true); storyNote('Samy Ragab', 'A brand-new motorbike he says is his cousin\'s. He couldn\'t look at me.'); } } }] });
STORY_SCRIPTS.c1b_gad = 'c1b_gad';
scene('c1b_gad', {
    speaker: 'Rais Gad',
    text: `Rais Gad, the Saqqara foreman, broad as a door, a white turban and a voice like gravel going down a chute. He is watching three men and a sieve the way a hawk watches three mice and a field.\n\n"Inspector. Good. Tell the Director my men want Thursday's pay on Wednesday, for the wedding. He will say no. Tell him anyway." He spits neatly into the spoil. "My cousin Abdallah is rais at Giza, you know. Twenty-six seasons. He says the foreigners over there have troubles too."`,
    choices: [{ text: '"I\'ll tell him."' }, { text: '"Anything new at the dig?"', nextScene: 'c1b_gad_dig' }],
});
scene('c1b_gad_dig', { speaker: 'Rais Gad', text: `"Beads. A lot of beads. And someone has been walking about the mastaba field at night, leaving footprints like a clumsy goat." He shrugs. "Not my mastabas. Not my business. Unless the Inspector makes it my business."`, choices: [{ text: '"Maybe I will."' }] });
const LINES_1B = {
    c1b_ghaffir: ['The Ghaffir', 'The Serapeum\'s ghaffir takes his time getting up, and more time pointing at the gate. "Locked, Inspector. Locked since the last tour. I locked it myself." A pause. "Mostly I lock it myself."'],
    c1b_digman1: ['Workman', '"Beads, beads, beads. My grandfather found a gold mask here, they say. Me, I find beads."'],
    c1b_digman2: ['Workman', '"The Rais is in a mood. Ask about the wedding and he\'ll be in a better one."'],
    c1b_cameleer: ['Camel Man', 'The camel man sees your ID and his smile gets bigger, not smaller. "Inspector! My camel, very licensed. Very. The licence is at home, with my other camel."'],
    c1b_tpolice: ['Tourist Policeman', 'A tourist policeman in summer white, sunglasses, sweating. "Forty people from Lyon and one from Belgium who wants to climb the pyramid. Every day, one wants to climb the pyramid."'],
    c1b_cafeowner: ['Café Owner', '"Inspector! Sit, sit. Tea? Ful? The ta\'ameya is fresh, the oil is only yesterday\'s." He wipes a table that did not need it.\n\n"And drink, eh? In this heat a man who forgets to drink or eat can\'t even run from his wife. The well is free, my ful is not."'],
    c1b_baker: ['The Baker', 'The baker, floury to the elbows, doesn\'t stop slapping dough onto the paddle. "Fresh in two minutes. Everything is fresh in two minutes."'],
    c1b_fruitseller: ['Fruit Seller', '"Oranges from Menoufia, sweet like honey. For the Ministry, a Ministry price." He means double.'],
    c1b_spiceseller: ['Spice Seller', '"Karkadeh for the heat, cumin for the stomach, and for your mother, I have something for the knees." She is already wrapping it.'],
    c1b_mechanic: ['Mechanic', 'The mechanic slides out from under a Fiat on a board. "Samy\'s bike? Brand new, cash, from Cairo. Where does an inspector get cash, eh? Not from me, I know that."'],
    c1b_tourist1: ['Tourist', '"Excuse me, is this Ramesses? The big one? Our guide says forty minutes but the bus says twenty." He photographs you, just in case you are important.'],
    c1b_tourist2: ['Tourist', '"It\'s lying down," she says, a little disappointed, as if Ramesses might get up for her.'],
    c1b_guide: ['Guide', 'A licensed guide with a clipboard and a voice worn thin. "Memphis! Capital of Egypt for three thousand years! Please do not touch Memphis."'],
};
for (const id in LINES_1B) { STORY_SCRIPTS[id] = id; const [who, text] = LINES_1B[id]; scene(id, { speaker: who, text, choices: [{ text: 'Move on.' }] }); }

// ============================================================
// WATER AND FOOD (every map has a well; water jars where people work; food)
// ============================================================
const JARS_1B = {
    c1w_zeer_insp: `Two clay jars on a stand in the shade of the inspectorate wall. Umm Sabry fills them every morning and scolds anyone who drinks from the rim.`,
    c1w_zeer_ser: `The ghaffir's water jars, sweating in the shade of his hut. A tin cup on a string. The water tastes of clay and is very cold.`,
    c1w_zeer_teti: `Water jars at the Teti dig, a cup on a nail. Rais Gad's rule, painted on the stand: DRINK BEFORE YOU ARE THIRSTY.`,
};
for (const id in JARS_1B) { STORY_SCRIPTS[id] = id; scene(id, { speaker: 'System', text: JARS_1B[id], choices: [{ text: 'Drink.', onSelect: () => { const r = refill(); drink(40, 'Cool water from the jar'); if (r) Notice.show(r.trim()); } }, { text: 'Move on.' }] }); }
STORY_SCRIPTS.c1b_well = 'c1b_well';
scene('c1b_well', {
    speaker: 'System',
    text: `The village well. You work the pump handle, and after a cough and a gurgle the water comes up cold, into the trough and your cupped hands. Two girls filling a jerrycan wait politely, and giggle at the Ministry ID on your belt.`,
    choices: [{ text: 'Drink, and wash your face.', onSelect: () => { const r = refill(); drink(70, 'Cold well water'); if (r) Notice.show(r.trim()); } }, { text: 'Leave it to the girls.' }],
});
STORY_SCRIPTS.c1b_bakery = 'c1b_bakery';
const fedAt = (k, mins) => sflag(k) != null && Story.s.clock - sflag(k) < mins;
scene('c1b_bakery', {
    speaker: 'The Baker',
    text: () => fedAt('c1b_bread_at', 120) ? `"You again? Come back when you're hungry, not greedy."` : `The baker slides five loaves off the paddle onto the rack, round and puffed and too hot to hold. "One pound. For the Ministry, one pound." (It is one pound for everybody.)`,
    get choices() { const c = []; if (!fedAt('c1b_bread_at', 120)) c.push({ text: 'Buy bread. (1 EGP)', onSelect: () => { storyPay(-1, 'Bread, Mit Rahina'); sflag('c1b_bread_at', Story.s.clock); eat(30, 'Hot aish baladi'); } }); c.push({ text: 'Move on.' }); return c; },
});
STORY_SCRIPTS.c1b_cafe = 'c1b_cafe';
scene('c1b_cafe', {
    speaker: 'Café Owner',
    text: () => fedAt('c1b_cafe_at', 180) ? `"Another tea, at least? Sit, the match is on."` : `"Sit, sit." A plate appears: ful mudammas swimming in oil and cumin, ta'ameya hot from the fryer, bread, pickles, a glass of tea. "Twenty pounds. For the Ministry, twenty pounds."`,
    get choices() {
        const c = [];
        if (!fedAt('c1b_cafe_at', 180)) c.push({ text: 'Eat ful and ta\'ameya. (20 EGP, 20 minutes)', onSelect: () => { storyPay(-20, 'Breakfast, the café, Mit Rahina'); sflag('c1b_cafe_at', Story.s.clock); eat(70, 'Ful and ta\'ameya'); drink(15); clockAdvance(20); } });
        c.push({ text: 'Just a tea. (3 EGP)', onSelect: () => { storyPay(-3, 'Tea, the café'); drink(20, 'Tea at the café'); } });
        c.push({ text: 'Move on.' });
        return c;
    },
});
STORY_SCRIPTS.c1b_stall_fruit = STORY_SCRIPTS.c1b_fruitseller = 'c1b_fruit';
scene('c1b_fruit', {
    speaker: 'Fruit Seller',
    text: `"Oranges from Menoufia, sweet like honey. Five pounds the kilo. For the Ministry..." He looks at your face. "Five pounds the kilo."`,
    choices: [{ text: 'Buy oranges. (5 EGP)', onSelect: () => { storyPay(-5, 'Oranges, the market'); pocket('Oranges', 3); } }, { text: 'Move on.' }],
});
ITEM_USE.Oranges = () => { dropItem('Oranges'); eat(10, 'An orange'); drink(8); };
ITEM_INFO.Oranges = { desc: 'Oranges from Menoufia, sweet. SPACE: eat one (a little food and a little water).' };
