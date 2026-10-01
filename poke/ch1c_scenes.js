// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-C, MARSA TARFA (poke/ch1c_scenes.js)
// The Fixer's opening (story/regions/ch01_opening_fixer.md). Who's here
// follows the bible (story/01_CHARACTERS.md §Ch1-C): Bassem "the Shark"
// Nassar, Captain Zaki, Rana Fouad. Lena Brandt comes with the truck in
// beat 4. Everyone else is nameless: Bassem's men, the fishermen, the café.
// Step 1 (this file so far): the area, the cast on the map, and beat 1:
// the debt collectors at your door, the bank app, Zaki at his dhow, Rana at
// her dive shop, and Bassem's summons for five o'clock.
// ============================================================

// ---- the cast's looks (new people: nobody from Giza or Saqqara) ----
Object.assign(LOOKS, {
    c1c_zaki: { skinCol: SKINS[7], top: ['#7a9ac0', '#5a7aa0', '#405c80'], topKind: 'shirt', legs: CLOTH.linen, botKind: 'sirwal', head: 'cap', headCol: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], face: 'beard', beard: '#e8e8e0', shoeKind: 'sandals', shoe: '#5c3418', wide: true },
    c1c_rana: { skinCol: SKINS[5], top: ['#3aa8c8', '#2888a8', '#1a6888'], topKind: 'tee', legs: CLOTH.black, botKind: 'shorts', hairStyle: 'long', hairCol: HAIRS[4], shoeKind: 'sandals', shoe: '#3a3e48', slim: true },
    c1c_heavy1: { skinCol: SKINS[5], top: CLOTH.black, topKind: 'jacket', legs: ['#3a3e48', '#2a2e36', '#1c1e24'], hairStyle: 'buzz', hairCol: HAIRS[0], face: 'shades', wide: true, shoe: '#1c1814' },
    c1c_heavy2: { skinCol: SKINS[4], top: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], topKind: 'shirt', legs: CLOTH.black, hairStyle: 'short', hairCol: HAIRS[0], face: 'tache', tache: '#2a2424', shoe: '#1c1814' },
    c1c_vguard: { skinCol: SKINS[6], top: ['#5a6068', '#40464e', '#2c3036'], topKind: 'tee', legs: ['#3a3e48', '#2a2e36', '#1c1e24'], head: 'cap', headCol: CLOTH.black, face: 'stubble', wide: true, shoe: '#1c1814' },
    c1c_fisherman: { skinCol: SKINS[8], robe: ['#8a9aa0', '#6c7c82', '#4e5e64'], head: 'turban', headCol: ['#f0f0e8', '#d8d8d0', '#b8b8b0'], face: 'beard', beard: '#c8c8c0', shoeKind: 'barefoot', shoe: '' },
    c1c_griller: { skinCol: SKINS[6], top: ['#f4ecd8', '#dcd0b8', '#b8ac90'], topKind: 'tank', legs: CLOTH.indigo, botKind: 'rolled', hairStyle: 'short', hairCol: HAIRS[0], face: 'tache', tache: '#2a2424', shoeKind: 'sandals', shoe: '#5c3418' },
    c1c_fishseller: { skinCol: SKINS[6], robe: ['#3a4a6a', '#2c3a54', '#1e2a40'], head: 'hijab', headCol: ['#c8a040', '#a88020', '#806010'], shoeKind: 'sandals', shoe: '#1c1814', wide: true },
    c1c_cafeman: { skinCol: SKINS[5], top: ['#e8e0c8', '#ccc4ac', '#aaa28a'], topKind: 'vest', legs: ['#4a4038', '#38302a', '#28221e'], hairStyle: 'bald', hairCol: HAIRS[8], face: 'tache', tache: '#d8d8d0', wide: true, shoe: '#1c1814' },
    c1c_kioskman: { skinCol: SKINS[4], top: ['#d04838', '#a83828', '#802818'], topKind: 'football', legs: CLOTH.indigo, botKind: 'jeans', hairStyle: 'curls', hairCol: HAIRS[0], shoeKind: 'sneakers', shoe: '#d04838' },
    c1c_tapwoman: { skinCol: SKINS[5], robe: ['#a04a6a', '#803a54', '#602a40'], head: 'hijab', headCol: ['#2e2824', '#1c1814', '#100c0a'], shoeKind: 'babouche', shoe: '#1c1814', slim: true },
    c1c_kid1: { skinCol: SKINS[6], top: ['#58a848', '#3e8a30', '#2a6420'], topKind: 'football', legs: CLOTH.linen, botKind: 'shorts', hairCol: HAIRS[0], kid: true, shoeKind: 'barefoot', shoe: '' },
    c1c_kid2: { skinCol: SKINS[5], top: ['#f0c040', '#c89820', '#a07818'], topKind: 'tee', legs: CLOTH.indigo, botKind: 'shorts', hairCol: HAIRS[2], kid: true, shoeKind: 'sneakers', shoe: '#ffffff' },
    c1c_oldman: { skinCol: SKINS[7], robe: ['#c8b890', '#a89870', '#887850'], head: 'keffiyeh', headCol: ['#f4f4f0', '#d8d8d0', '#b8b8b0'], stripes: '#c84830', face: 'beard', beard: '#f0f0e8', shoeKind: 'sandals', shoe: '#5c3418' },
    c1c_cgofficer: { skinCol: SKINS[4], top: ['#f8f8f4', '#e0e0d8', '#c0c0b8'], topKind: 'shirt', legs: ['#2a3a5a', '#1e2c48', '#141e34'], head: 'cap', headCol: ['#2a3a5a', '#1e2c48', '#141e34'], face: 'tache', tache: '#2a2424', shoe: '#1c1814' },
    c1c_truckman: { skinCol: SKINS[6], top: ['#c8a878', '#a88858', '#886838'], topKind: 'tee', legs: ['#5a5048', '#443c36', '#2e2824'], head: 'skullcap', headCol: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], face: 'stubble', wide: true, shoeKind: 'sandals', shoe: '#5c3418' },
    c1c_driver: { skinCol: SKINS[6], robe: ['#5a7a5a', '#46604a', '#324632'], head: 'turban', headCol: ['#e8e0c8', '#c8c0a8', '#a8a088'], face: 'tache', tache: '#2a2424', shoeKind: 'sandals', shoe: '#5c3418' },
    c1c_hotelman: { skinCol: SKINS[4], top: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], topKind: 'vest', legs: CLOTH.black, hairStyle: 'short', hairCol: HAIRS[0], face: 'tache', tache: '#2a2424', slim: true, shoe: '#1c1814' },
    c1c_imam: { skinCol: SKINS[5], robe: ['#fbf8f0', '#ece6da', '#d4ccbc'], head: 'skullcap', headCol: ['#fbf8f0', '#ece6da', '#d4ccbc'], face: 'beard', beard: '#5a4a40', shoeKind: 'babouche', shoe: '#f4ecd8' },
});
Object.assign(CAST, {
    c1c_zaki: 'c1c_zaki', c1c_vguard: 'c1c_vguard', c1c_fisherman: 'c1c_fisherman', c1c_griller: 'c1c_griller', c1c_fishseller: 'c1c_fishseller', c1c_cafeman: 'c1c_cafeman',
    c1c_kioskman: 'c1c_kioskman', c1c_tapwoman: 'c1c_tapwoman', c1c_kid1: 'c1c_kid1', c1c_kid2: 'c1c_kid2', c1c_oldman: 'c1c_oldman', c1c_cgofficer: 'c1c_cgofficer',
    c1c_truckman: 'c1c_truckman', c1c_driver: 'c1c_driver', c1c_hotelman: 'c1c_hotelman', c1c_imam: 'c1c_imam',
});
Object.assign(REL_NAMES, { zaki: 'Captain Zaki', rana: 'Rana Fouad', bassem: 'Bassem Nassar' });
Object.assign(ITEM_INFO, {
    'Lockpicks': { key: 1, desc: 'A roll of lockpicks in a strip of oilcloth: rakes, hooks, a tension wrench made from a windscreen wiper. They open most things in Marsa Tarfa. Most people in Marsa Tarfa know it.' },
    'Knife': { key: 1, desc: 'A folding fisherman\'s knife, good for rope, nets, and looking like you mean it.' },
    'Phone': { key: 1, desc: 'Your phone. The screen is cracked, the case is held on with tape, and the bank app has a red number in it you try not to look at. (P)' },
    'Harbour pass': { key: 1, desc: 'PORT OF MARSA TARFA, HARBOUR PASS: boat work. It gets you onto the quays and past the harbour master, if the harbour master is in a good mood.' },
});

// ---- the debt: in the bank app, under the balance (story/06_SYSTEMS.md §7) ----
function debt() { return Story.s.debt || 0; }
function debtAdd(n, why) { Story.s.debt = Math.max(0, debt() + n); Toast.show('Debt ' + (n > 0 ? '+' : '−') + Math.abs(n).toLocaleString('en') + ' EGP' + (why ? '   ' + why : '')); }

// ---- the area ----
AREAS.fixer = {
    name: 'MARSA TARFA', clock: 8 * 60, giza: false,
    layout: () => marsaLayout(), objects: () => window.POKE_MAP_1C,
    newGame() {
        const eg = !!Game.player.egyptian, p = Game.player, m = Game.maps.ch1;
        Game.bag = { 'Phone': 1, 'Lockpicks': 1, 'Knife': 1, 'Harbour pass': 1, Canteen: 1 }; sflag('canteen', 3);
        if (eg) Story.s.money = 350;
        Story.s.debt = 60000; Story.s.heat = 1;
        Story.s.messages = [{ from: 'B. Nassar', t: '07:58', unread: true, text: 'Good morning, habibi. My boys will pass by. Be nice to them. — B.' }];
        Story.s.ledger = [{ t: '08:00', a: money(), why: 'Balance (what\'s left)' }, { t: 'March', a: -60000, why: 'Owed to B. Nassar: the Shahd, sunk, and her cargo' }];
        const sk = skillsState(); if (eg) { sk.arabic = SKILL_XP[5]; sk.arabicRead = SKILL_XP[2]; }
        p.dir = DIR.down;
        // Bassem's two men, waiting at your door
        C1C.heavies = [['c1c_heavy1', -18], ['c1c_heavy2', 18]].map(([look, dx], i) => {
            const e = World.addEnt(m, { x: p.x + dx, y: p.y + 40, w: 0, d: 0, id: 'c1c_collector' + (i + 1), label: "Bassem's Man", say: ["Bassem's Man", '"Five o\'clock. The villa."'], person: { sheet: personSheet(LOOKS[look]), dir: DIR.up, frame: 0 }, sortY: p.y + 40 });
            m.people.push(e); return e;
        });
        task('c1c_door', 'Answer the door.');
        setTimeout(() => startDialogue('c1c_start'), 700);
    },
    frame() { }, sync() { }, clockPassed() { },
    door() { return false; },
    onEnter(room) { },
    watch() { return Story.s.clock < 24 * 60 ? ' Tuesday.' + (Story.s.clock < 17 * 60 && sflag('c1c_summoned') ? ' Bassem at five.' : '') : ' Wednesday, very early.'; },
};
const C1C = { heavies: [] };

// ============================================================
// BEAT 1: MORNING IN MARSA TARFA
// ============================================================
scene('c1c_start', {
    speaker: 'System',
    text: () => `Eight o'clock, Tuesday, and the sun already off the sea like a slap. Somebody is knocking on your door: politely, the way a dentist is polite.\n\nYou open it. Two of Bassem's men, one in a leather jacket in this heat, one with a moustache, standing far enough back to be friendly and close enough to make the point.\n\n${Game.player.egyptian ? 'You were born in a street like this one. You know exactly what this is.' : 'Ten years on this coast and you still know exactly what this is.'}`,
    choices: [{ text: '"Gentlemen."', nextScene: 'c1c_heavy1' }],
});
scene('c1c_heavy1', {
    speaker: "Bassem's Man",
    text: `The big one smiles. "Good morning. Mr. Bassem says good morning." A pause, like a man laying down a card. "Mr. Bassem says sixty thousand pounds."\n\nThe one with the moustache nods at the phone in your hand. "You can check. It's in your bank. Under the part you don't like to look at."`,
    choices: [{ text: 'Check your phone. (P opens it; the BANK app has your money, and your debt.)', onSelect: () => { Toast.show('The phone: P.   BANK: your balance, and what you owe.', 6); }, nextScene: 'c1c_heavy2' }],
});
scene('c1c_heavy2', {
    speaker: "Bassem's Man",
    text: () => `${money().toLocaleString('en')} pounds in the account. Sixty thousand owed to B. Nassar, in red.\n\n"And something for our trouble," says the moustache. "The walk. The heat. Three hundred."`,
    get choices() {
        const c = [];
        if (money() >= 300) c.push({ text: 'Pay them the 300.', onSelect: () => { storyPay(-300, 'For their trouble'); sflag('c1c_heavies', 'paid'); }, nextScene: 'c1c_heavy3' });
        c.push({ text: '[Haggling] "Fifty. And I don\'t tell Mr. Bassem you asked."', onSelect: () => { storyPay(-50, 'For their trouble (haggled)'); skillXP('haggling', 15, 'the collectors'); sflag('c1c_heavies', 'haggled'); }, nextScene: 'c1c_heavy_haggle' });
        c.push({ text: '"Nothing. You walked here on Bassem\'s time."', onSelect: () => { sflag('c1c_heavies', 'nothing'); }, nextScene: 'c1c_heavy_none' });
        return c;
    },
});
scene('c1c_heavy_haggle', {
    speaker: "Bassem's Man",
    text: `The moustache opens his mouth, sees your face, and closes it again. The big one laughs, once. "Fifty." He takes the note. "That's why he likes you. You'd haggle with the angel of death."\n\n(Haggling: you can halve most prices on this coast, and bribes cost you less. People see it in your face.)`,
    choices: [{ text: '"What does he want?"', nextScene: 'c1c_heavy3' }],
});
scene('c1c_heavy_none', {
    speaker: "Bassem's Man",
    text: `The moustache takes a step forward. The big one puts a hand on his arm, gently, the way you'd stop a dog. "Next time," he says, to you, still smiling. "We'll remember the walk."`,
    choices: [{ text: '"What does he want?"', nextScene: 'c1c_heavy3' }],
});
scene('c1c_heavy3', {
    speaker: "Bassem's Man",
    text: `"Mr. Bassem doesn't want Friday, or next week, or your mother's gold." The big one buttons his jacket. "Mr. Bassem wants to see you. At the villa, at five. He has a job for you. A small job." He holds up one finger. "One night, and you are even."\n\n"Be early," says the moustache. "He likes early."`,
    choices: [{ text: 'Watch them go.', onSelect: () => c1cDoorDone() }],
});
function c1cDoorDone() {
    sflag('c1c_summoned', true); taskDone('c1c_door');
    const m = Game.maps.ch1, g = m.ents.find(e => e.id === 'c1c_vgate');
    for (const e of C1C.heavies) if (e && g) { e.walkTo = [g.x + 30 + (e.id.endsWith('2') ? 20 : 0), g.y - 10]; e.ghost = true; }
    C1C.heavies = [];
    storyNote('Bassem Nassar', 'His men came to the door: sixty thousand, and "a small job, one night, and you are even." The villa on the south point, at five.');
    task('c1c_zaki', 'Find Captain Zaki at the harbour. Whatever Bassem wants, it will need a boat.');
    task('c1c_rana', 'Rana\'s dive shop, by the harbour. She\'ll have heard.');
    task('c1c_bassem', 'Bassem\'s villa on the south point, at five.');
    Toast.show('Your bag: Esc → BAG. Lockpicks, a knife, a phone, and not much else.', 6);
}

// ---- Captain Zaki, at his dhow ----
STORY_SCRIPTS.c1c_zaki = 'c1c_zaki';
scene('c1c_zaki', {
    speaker: 'Captain Zaki',
    text: () => sflag('c1c_zaki')
        ? `Zaki raises his glass to you from the quay. "The Umm Kalthoum is ready when you are, habibi. Bring diesel. Bring cigarettes. Bring yourself back."`
        : `Captain Zaki is sitting on an upturned crate beside his dhow, splicing a rope with fingers like old roots, a tea glass balanced on a bollard. He doesn't look up.\n\n"The Shark's boys were at your door. The whole harbour knows." He pulls the splice tight. "The fish know."\n\nHe pours a second glass from a blackened pot without asking and holds it out. "Sit."`,
    get choices() {
        if (sflag('c1c_zaki')) return [{ text: '"Shukran, ya Rais."' }];
        return [{ text: 'Sit. "He wants to see me at five."', nextScene: 'c1c_zaki2' }, { text: '"I\'m fine, Zaki."', nextScene: 'c1c_zaki_fine' }];
    },
});
scene('c1c_zaki_fine', { speaker: 'Captain Zaki', text: `"You are fine like my engine is fine." He keeps holding out the glass until you take it. "Sit."`, choices: [{ text: 'Sit. "He wants to see me at five."', nextScene: 'c1c_zaki2' }] });
scene('c1c_zaki2', {
    speaker: 'Captain Zaki',
    text: `Zaki spits over the side, accurately, into the harbour. "Then he has a job. Bassem doesn't forgive debts, habibi. He trades them."\n\nHe looks along the quay at the boats, at the breakwater, at the sea going out flat and blue to the edge of the world. "Whatever it is, it goes by sea, at night. And nobody has a boat but me, and nobody is stupid enough but me." He grins: three gold teeth. "The Umm Kalthoum is yours. Bring her back, and buy the diesel."`,
    choices: [{ text: '"I owe you, Zaki."', onSelect: () => c1cZakiDone(), nextScene: 'c1c_zaki3' }],
});
scene('c1c_zaki3', { speaker: 'Captain Zaki', text: `"You owe Bassem. Me, you only owe the truth." He goes back to his rope. "Go and see Rana. Don't make that face. Go."`, choices: [{ text: 'Finish your tea.' }] });
function c1cZakiDone() {
    sflag('c1c_zaki', true); taskDone('c1c_zaki'); rel('zaki', 5, true); drink(20, 'Zaki\'s tea, black and sweet');
    storyNote('Captain Zaki', '"Bassem doesn\'t forgive debts. He trades them." His dhow, the Umm Kalthoum, is yours for the job, if you buy the diesel.');
    c1cBeatOneCheck();
}

// ---- Rana, in her dive shop ----
STORY_SCRIPTS.c1c_rana = 'c1c_rana';
scene('c1c_rana', {
    speaker: 'Rana Fouad',
    text: () => sflag('c1c_rana')
        ? `Rana doesn't look up from the tank log. "Still here? Go and get yourself killed somewhere I can't see it." A pause. "And come back."`
        : `Rana Fouad is behind the counter filling in a tank log, her hair tied back, salt still in it from the morning dive. She sees you in the doorway and goes on writing.\n\n"If you came for the regulator, I sold it. If you came for your key, I changed the lock." The pen stops. "The whole town heard. Sixty thousand."\n\nShe looks up at last. "What does he want?"`,
    get choices() {
        if (sflag('c1c_rana')) return [{ text: 'Leave her to it.' }];
        return [{ text: '"A job. I don\'t know what yet."', nextScene: 'c1c_rana2' }, { text: '"I came to see you."', onSelect: () => rel('rana', 3, true), nextScene: 'c1c_rana_soft' }];
    },
});
scene('c1c_rana_soft', { speaker: 'Rana Fouad', text: `"No, you didn't." But the corner of her mouth moves, and she puts the pen down. "What does he want?"`, choices: [{ text: '"A job. I don\'t know what yet."', nextScene: 'c1c_rana2' }] });
scene('c1c_rana2', {
    speaker: 'Rana Fouad',
    text: `"It's Bassem, so it's a boat, at night, and something you're not supposed to look at." She caps the pen. "Don't do it."\n\nYou don't say anything. She sighs. "You'll do it."\n\nShe comes round the counter, close enough that you can smell the neoprene. "If it goes wrong in the water, you come here first. Not to him. Here." She taps the counter. "I'll have a kit for you. In case."`,
    choices: [{ text: '"Thank you, Rana."', onSelect: () => c1cRanaDone() }],
});
function c1cRanaDone() {
    sflag('c1c_rana', true); taskDone('c1c_rana'); rel('rana', 5, true);
    storyNote('Rana Fouad', '"It\'s Bassem, so it\'s a boat, at night, and something you\'re not supposed to look at." If it goes wrong in the water, go to her first. She\'ll have a diving kit ready.');
    c1cBeatOneCheck();
}
function c1cBeatOneCheck() { if (sflag('c1c_zaki') && sflag('c1c_rana')) storyNotice('A boat, and a way out of the water. Bassem at five.'); }

// ---- Bassem's gate (the villa is beat 2: until then, five o'clock) ----
STORY_SCRIPTS.c1c_vguard = STORY_SCRIPTS.c1c_vgate = 'c1c_vguard';
scene('c1c_vguard', {
    speaker: "Bassem's Man",
    text: () => Story.s.clock < 17 * 60
        ? `Bassem's man at the gate looks at you, at his watch, and at you again. "Five o'clock. Not before. Mr. Bassem is eating, and when Mr. Bassem is eating, the sea waits."`
        : `"Wait." He talks into a radio, listens, frowns. "Mr. Bassem is on the phone to Cairo. Cairo talks a lot. Wait."`,
    choices: [{ text: 'Go.' }],
});

// ============================================================
// THE OTHERS (lines for now: their stories come in their beats and side quests)
// ============================================================
const LINES_1C = {
    c1c_fisherman: ['Fisherman', 'An old fisherman mending a net with a wooden needle, faster than you can follow. "The fish are deeper this year. Everything is deeper this year." He looks at you. "Even the debts."'],
    c1c_fishseller: ['Fish Seller', '"Grouper! Parrotfish! Snapper, still blinking!" She sees who it is. "For you, habibi: cash. The whole harbour knows."'],
    c1c_kid1: ['Boy', '"Is it true you sank Bassem\'s boat? My brother says you did it on purpose, for the insurance." He looks at you with enormous respect.'],
    c1c_kid2: ['Boy', '"Can you really open any lock?" He thinks. "Can you open the school? Not to go in. To lock it."'],
    c1c_oldman: ['Old Man', 'An old man sitting in the shade of the fort wall with his eyes half shut. "My grandfather said the Turks hid their pay chest under the cannon when the French ships came. Every boy in Marsa Tarfa has dug under that cannon." He opens one eye. "Every boy found nothing. But they were looking in the wrong place."'],
    c1c_cgofficer: ['Coast Guard', 'A coast guard in white shirtsleeves, drinking tea in the shade of the post. "Morning. Papers in order? Boat in order? Debts in order?" He smiles into his glass. "Two out of three, eh."'],
    c1c_driver: ['Lorry Driver', '"Cement to Quseir, then empty to Cairo. If you need anything taken to Cairo that doesn\'t want to talk about it..." He winks. "I\'m joking. Mostly."'],
    c1c_hotelman: ['Hotel Porter', '"Rooms? We have forty. Guests? We have one, and he is the cook\'s cousin." He straightens his waistcoat. "In the winter, the Germans come. They dive, they burn, they go home happy."'],
    c1c_imam: ['The Imam', 'The imam, sweeping the mosque step. "Peace be upon you." He leans on the broom. "Pay your debts, my son, before they come and pay you a visit." He has clearly heard. Everyone has.'],
    c1c_tapwoman: ['Woman at the Tap', 'A woman filling a jerrycan at the tap. "Free, God be thanked. It comes by truck from Safaga twice a week, and it tastes of the truck." She lifts the jerrycan onto her head without spilling a drop.'],
};
for (const id in LINES_1C) { STORY_SCRIPTS[id] = id; const [who, text] = LINES_1C[id]; scene(id, { speaker: who, text, choices: [{ text: 'Move on.' }] }); }

// ============================================================
// WATER AND FOOD (a tap, water jars where people work, food)
// ============================================================
const JARS_1C = {
    c1c_jars_sq: `Clay water jars in a wooden stand by the tap, a tin cup on a chain. Somebody's grandmother fills them every morning, for the love of God and the gossip.`,
    c1c_jars_q: `Water jars on the quay for the fishermen, sweating in the shade of the grill. The water is cold and tastes faintly of clay and diesel.`,
    c1c_jars_ts: `Water jars by the truck stop café, a sign on the stand in three languages: FREE, GRATUIT, and in Arabic, FOR THE SAKE OF GOD.`,
};
for (const id in JARS_1C) { STORY_SCRIPTS[id] = id; scene(id, { speaker: 'System', text: JARS_1C[id], choices: [{ text: 'Drink.', onSelect: () => { const r = refill(); drink(40, 'Cool water from the jar'); if (r) Notice.show(r.trim()); } }, { text: 'Move on.' }] }); }
STORY_SCRIPTS.c1c_tap = 'c1c_tap';
scene('c1c_tap', {
    speaker: 'System',
    text: `The public tap in the little square: a whitewashed block, a brass tap worn bright by every hand in town, a stone trough below. The water comes out warm, then cool, then cold.`,
    choices: [{ text: 'Drink, and wash the salt off your face.', onSelect: () => { const r = refill(); drink(70, 'Water from the tap'); if (r) Notice.show(r.trim()); } }, { text: 'Move on.' }],
});
const fed1C = (k, mins) => sflag(k) != null && Story.s.clock - sflag(k) < mins;
STORY_SCRIPTS.c1c_grill = STORY_SCRIPTS.c1c_griller = 'c1c_grill';
scene('c1c_grill', {
    speaker: 'Fish Griller',
    text: () => fed1C('c1c_fish_at', 180) ? `"Again? You'll turn into a fish. Come back tonight, the grouper will be better."` : `The griller turns four fish on the grate with his fingers, the skin blistering over the coals. "Grouper, this morning's. Bread, salad, tahina, lemon. Forty." He sees your face. "For you, forty. For a German, a hundred."`,
    get choices() {
        const c = [];
        if (!fed1C('c1c_fish_at', 180)) {
            if (money() >= 40) c.push({ text: 'Eat grilled fish. (40 EGP, 20 minutes)', onSelect: () => { storyPay(-40, 'Grilled fish, the quay'); sflag('c1c_fish_at', Story.s.clock); eat(75, 'Grilled grouper, bread and tahina'); drink(10); clockAdvance(20); } });
            if (money() >= 20) c.push({ text: '[Haggling] "Twenty, and I\'ll tell the Germans."', onSelect: () => { storyPay(-20, 'Grilled fish (haggled)'); sflag('c1c_fish_at', Story.s.clock); eat(75, 'Grilled grouper, bread and tahina'); skillXP('haggling', 5); clockAdvance(20); } });
        }
        c.push({ text: 'Move on.' });
        return c;
    },
});
STORY_SCRIPTS.c1c_fulcart = 'c1c_ful';
scene('c1c_ful', {
    speaker: 'Ful Cart',
    text: () => fed1C('c1c_ful_at', 120) ? `"Another? A man who eats two ful sandwiches before noon is a man with problems."` : `A ful cart: a copper pot of beans simmering on a gas ring, a stack of bread, pickles in jars. The man mashes beans with oil and cumin into a pocket of bread without being asked. "Five."`,
    get choices() { const c = []; if (!fed1C('c1c_ful_at', 120) && money() >= 5) c.push({ text: 'Buy a ful sandwich. (5 EGP)', onSelect: () => { storyPay(-5, 'Ful sandwich'); sflag('c1c_ful_at', Story.s.clock); eat(35, 'Ful in hot bread'); } }); c.push({ text: 'Move on.' }); return c; },
});
STORY_SCRIPTS.c1c_cafe = STORY_SCRIPTS.c1c_cafeman = 'c1c_cafe';
scene('c1c_cafe', {
    speaker: 'Café Owner',
    text: () => `"Sit, sit." The café owner wipes a table that didn't need it. "Tea? Ta'ameya? The football is on, the fan works, mostly." He lowers his voice. "And I don't ask anybody what they owe. It's bad for business."`,
    get choices() {
        const c = [];
        if (!fed1C('c1c_cafe_at', 180) && money() >= 15) c.push({ text: 'Ta\'ameya, bread and tea. (15 EGP, 15 minutes)', onSelect: () => { storyPay(-15, 'Breakfast, the café'); sflag('c1c_cafe_at', Story.s.clock); eat(55, 'Ta\'ameya, hot from the oil'); drink(15); clockAdvance(15); } });
        if (money() >= 3) c.push({ text: 'Just a tea. (3 EGP)', onSelect: () => { storyPay(-3, 'Tea, the café'); drink(20, 'Tea at the café'); } });
        c.push({ text: 'Move on.' });
        return c;
    },
});
STORY_SCRIPTS.c1c_kiosk = STORY_SCRIPTS.c1c_kioskman = 'c1c_kiosk';
scene('c1c_kiosk', {
    speaker: 'Kiosk Man',
    text: `The kiosk man doesn't take his eyes off the phone propped against the till, where a football match is being lost. "Water, Pepsi, crisps, cigarettes, phone credit, batteries, chewing gum, God's blessing. The last one is free."`,
    get choices() {
        const c = [];
        if (money() >= 5) c.push({ text: 'A cold bottle of water. (5 EGP)', onSelect: () => { storyPay(-5, 'Water, the kiosk'); drink(35, 'Cold bottled water'); } });
        if (money() >= 5) c.push({ text: 'A bag of crisps. (5 EGP)', onSelect: () => { storyPay(-5, 'Crisps, the kiosk'); eat(12, 'Crisps, chilli and lemon'); } });
        c.push({ text: 'Move on.' });
        return c;
    },
});
STORY_SCRIPTS.c1c_truckcafe = STORY_SCRIPTS.c1c_truckman = 'c1c_truckcafe';
scene('c1c_truckcafe', {
    speaker: 'Café Man',
    text: `The truck stop café: plastic chairs, a television showing a film from 1974, drivers eating with the concentration of men with six hundred kilometres still to go. "Tea, ful, ta'ameya, eggs, whatever's left. Sit."`,
    get choices() {
        const c = [];
        if (!fed1C('c1c_truck_at', 180) && money() >= 20) c.push({ text: 'Eggs, ful and bread. (20 EGP, 20 minutes)', onSelect: () => { storyPay(-20, 'The truck stop café'); sflag('c1c_truck_at', Story.s.clock); eat(65, 'Eggs and ful, a driver\'s breakfast'); drink(10); clockAdvance(20); } });
        if (money() >= 3) c.push({ text: 'A tea. (3 EGP)', onSelect: () => { storyPay(-3, 'Tea, the truck stop'); drink(20, 'Tea, strong enough to drive on'); } });
        c.push({ text: 'Move on.' });
        return c;
    },
});

// ============================================================
// THE ROOMS: your flat, Rana's dive shop (the rest come in step 11)
// ============================================================
const FURN1C = {
    mattress() { const st = stage(44, 22, 6), { A } = st, x = st.x, y = st.y - 4; A.r(x, y + 4, 44, 18, '#e8e0cc'); A.hl(x, y + 4, 44, '#fffaf0'); A.r(x + 2, y + 6, 12, 8, '#f4f4f0'); A.r(x + 16, y + 8, 26, 12, '#3a70c8'); A.hl(x + 16, y + 8, 26, '#5a90e0'); A.hl(x, y + 21, 44, '#b8b0a0'); return fit(st, { solid: [0, 4, 44, 18] }); },
    tankRack(n) { const w = n * 9 + 6, st = stage(w, 10, 28), { A } = st, x = st.x, y = st.y - 26; A.r(x, y + 30, w, 4, '#5a6068'); A.hl(x, y + 30, w, '#86949e'); for (let k = 0; k < n; k++) { const tx = x + 3 + k * 9; A.r(tx, y + 6, 7, 24, k % 3 ? '#c8ccd0' : '#f0c040'); A.vl(tx, y + 6, 24, '#ffffff'); A.vl(tx + 6, y + 6, 24, k % 3 ? '#86949e' : '#c89020'); A.r(tx + 1, y + 2, 5, 4, '#3a3e48'); A.r(tx + 2, y, 3, 2, '#20242c'); } return fit(st, { solid: [0, 0, w, 10] }); },
    compressor() { const st = stage(30, 16, 18), { A } = st, x = st.x, y = st.y - 16; A.r(x, y + 6, 30, 22, '#d04838'); A.hl(x, y + 6, 30, '#f07860'); A.ell(x + 10, y + 16, 6, 6, '#3a3e48'); A.ell(x + 10, y + 16, 3, 3, '#86949e'); A.r(x + 20, y + 8, 8, 8, '#20242c'); A.r(x + 21, y + 9, 6, 3, '#58e078'); A.line(x + 26, y + 6, x + 34, y - 2, '#20242c'); return fit(st, { solid: [0, 4, 30, 12] }); },
    fishTank() { const frames = [0, 1].map(f => { const st = stage(36, 14, 26), { A } = st, x = st.x, y = st.y - 24; A.r(x, y + 30, 36, 8, '#6a4a2c'); A.r(x, y + 4, 36, 26, '#3aa8c8'); A.r(x + 1, y + 5, 34, 24, '#58c8e0'); A.r(x + 1, y + 26, 34, 3, '#e8d4a0'); A.r(x + 6, y + 20, 3, 7, '#58a848'); A.r(x + 26, y + 18, 3, 9, '#3e8a30'); A.ell(x + (f ? 14 : 18), y + 12, 3, 2, '#f08030'); A.px(x + (f ? 12 : 21), y + 12, '#ffffff'); A.ell(x + (f ? 24 : 20), y + 18, 2, 1, '#3a70c8'); A.r(x, y + 3, 36, 2, '#20242c'); return outline(st.c); }); return { c: frames[0], frames, fps: 1.5, ox: -1, oy: -27, solid: [0, 0, 36, 14] }; },
    wetsuits() { const st = stage(48, 6, 34), { A } = st, x = st.x, y = st.y - 32; A.hl(x, y + 2, 48, '#86949e'); for (let k = 0; k < 5; k++) { const c = ['#20242c', '#2a3a5a', '#20242c', '#3a2a4a', '#1a4a5a'][k], wx = x + 2 + k * 9; A.r(wx, y + 3, 8, 26, c); A.vl(wx + 1, y + 3, 26, shade(c, 0.3)); A.r(wx - 1, y + 4, 2, 10, c); A.r(wx + 7, y + 4, 2, 10, c); A.r(wx + 1, y + 29, 2, 6, c); A.r(wx + 5, y + 29, 2, 6, c); } return fit(st, { solid: [0, 0, 48, 6] }); },
};
ROOMS.INT_FLAT1C = {
    name: 'YOUR FLAT', tw: 10, th: 7, style: 'concrete',
    enter: ['System', 'Your flat: two rooms, a mattress on the floor, a fan that turns its head away from you like everyone else this week, a fridge with a lemon in it, and on the table, the envelopes you haven\'t opened. Through the window, if you lean, the harbour.'],
    build({ map, A, put, wall, pw, ph, W }) {
        A.r(40, 10, 34, 22, '#9ed2f4'); A.r(40, 22, 34, 10, '#3a8ac8'); A.hl(40, 22, 34, '#ffffff'); A.r(38, 8, 38, 2, '#f4f4f0'); A.r(38, 32, 38, 3, '#f4f4f0'); A.vl(57, 10, 22, '#f4f4f0');   // the window, the sea
        wall(36, 42, null, { label: 'The Window', say: ['System', 'If you lean out far enough, the harbour: Zaki\'s dhow at the quay, the fish market, the breakwater, the sea going out to the edge of the world, flat and blue and full of other people\'s money.'] });
        A.ell(140, 22, 10, 10, '#f4f4f0'); A.ell(140, 22, 6, 6, '#d04838'); A.ell(140, 22, 3, 3, '#f4f4f0'); for (const k of [0, 1, 2, 3]) A.r(139 + [-8, 7, 0, 0][k], 21 + [0, 0, -8, 7][k], 3, 2, '#d04838');   // the old lifebuoy
        wall(128, 26, null, { label: 'A Lifebuoy', say: ['System', 'The lifebuoy from the Shahd, the boat you sank off Safaga in March with Bassem\'s cargo in her hold. SHAHD, in faded red letters. It\'s the only thing that came up. You keep it to remind you. Of what, you haven\'t decided.'] });
        A.r(100, 14, 14, 18, '#c89020'); A.r(102, 16, 10, 14, '#7ab0d8'); A.r(104, 20, 3, 6, '#3a3e48'); A.r(107, 21, 3, 5, '#a04a3a');   // a photo
        wall(98, 18, null, { label: 'A Photograph', say: ['System', 'A photograph in a gilt frame from the market: you and Rana on the dive boat, three summers ago, both laughing at something you can\'t remember now. She left it when she left. Or you kept it when she went. It depends who\'s telling it.'] });
        put(16, W + 4, FURN1C.mattress(), null, { label: 'Your Mattress', say: ['System', 'A mattress on the floor, a sheet, a blue blanket you don\'t need in this heat. You slept four hours. You dreamed of water.'] });
        put(pw - 70, W + 2, FURN.fridge(), null, { label: 'The Fridge', script: 'c1c_fridge' });
        put((pw >> 1) - 20, W + 50, FURN.desk(48, false), null, { label: 'The Envelopes', say: ['System', 'A stack of envelopes on the table: the electricity, the harbour fees, the phone, a wedding invitation from a cousin, and one with no stamp and B.N. written on it in a beautiful hand. You know what it says. You haven\'t opened it. You don\'t need to.'] });
        put(14, ph - 66, FURN.fan()); put(pw - 40, ph - 70, FURN.washstand(), null, { label: 'Sink', script: 'c1c_sink' });
        put((pw >> 1) - 46, W + 34, FURN.rug(92, 50, PAL.blue));
    },
};
scene('c1c_fridge', { speaker: 'System', text: 'The fridge: a lemon, half an onion, a bottle of water, and a jar of white cheese that has been in there long enough to vote.', choices: [{ text: 'Drink the water.', onSelect: () => { if (!sflag('c1c_fridge')) { sflag('c1c_fridge', true); drink(30, 'Cold water from the fridge'); } else Toast.show('The bottle is empty. You put it back anyway.'); } }, { text: 'Close it.' }] });
scene('c1c_sink', { speaker: 'System', text: 'A sink, a cracked mirror, a tap that coughs twice before it decides to work.', choices: [{ text: 'Drink from the tap.', onSelect: () => { const r = refill(); drink(40, 'Tap water'); if (r) Notice.show(r.trim()); } }, { text: 'Leave it.' }] });
ROOMS.INT_DIVESHOP = {
    name: "RANA'S DIVE SHOP", tw: 12, th: 8, style: 'concrete',
    enter: ['System', 'The dive shop smells of neoprene and salt and the compressor\'s oil: tanks racked along the wall, wetsuits hanging like the skins of drowned men, posters of fish you\'ve seen up close, and behind the counter, Rana, who has decided not to notice you yet.'],
    build({ map, A, put, wall, pw, ph, W }) {
        WALLART.poster(A, 40, 10); wall(38, 30, null, { label: 'Dive Poster', say: ['System', 'A poster of the reefs of the southern Red Sea: Elphinstone, the Brothers, Daedalus. Rana has drawn a small heart on the Brothers. That was where the two of you saw the hammerheads.'] });
        A.r(90, 12, 60, 20, '#2466a8'); for (let i = 0; i < 7; i++) A.r(94 + i * 8, 16, 6, 3, '#ffffff'); A.r(94, 24, 40, 2, '#f0c040');   // a sign: PADI
        wall(88, 64, null, { label: 'Certificates', say: ['System', 'Rana\'s certificates in a row of frames: Open Water, Rescue Diver, Instructor, Instructor Trainer. Under them, smaller, a newspaper cutting: LOCAL WOMAN SAVES TWO GERMAN DIVERS AT THE BROTHERS. She told you never to mention it. You mention it every time.'] });
        put(16, W + 4, FURN1C.tankRack(7), null, { label: 'Tanks', say: ['System', 'Air tanks racked along the wall, each with a tag: date filled, pressure, initials. Two are yellow, Nitrox, for the Germans in winter. One has your initials on it, from before, crossed out.'] });
        put(pw - 64, W + 4, FURN1C.wetsuits(), null, { label: 'Wetsuits', say: ['System', 'Wetsuits hanging to dry, still dripping on the concrete: three mediums, a large, and a child\'s small one with a shark on it.'] });
        put(pw - 50, W + 46, FURN1C.compressor(), null, { label: 'The Compressor', say: ['System', 'The compressor that fills the tanks, Italian, older than the shop, louder than the call to prayer. Rana talks to it. It listens to her.'] });
        put(20, W + 60, FURN1C.fishTank(), null, { label: 'Fish Tank', say: ['System', 'A fish tank with one clownfish in it, named Bassem, because, Rana says, he thinks he owns the place.'] });
        put((pw >> 1) - 40, W + 30, FURN.desk(80, false), null, { label: 'The Counter', say: ['System', 'The counter: a tank log, a till, a box of mask straps, a cracked dive computer waiting for a battery, and a jar of sweets for the children of customers who never come.'] });
        put(pw - 36, ph - 78, FURN.cooler(), null, { label: 'Water Cooler', script: 'c1c_cooler' });
        personAt(map, (pw >> 1), W + 22, 'c1c_rana', 'Rana Fouad', 'c1c_rana', 0);
    },
};
scene('c1c_cooler', { speaker: 'System', text: 'Rana\'s water cooler, for divers coming up dry-mouthed. A sign: DRINK. NOT THE TANK WATER.', choices: [{ text: 'Drink.', onSelect: () => { const r = refill(); drink(40, 'Cold water'); if (r) Notice.show(r.trim()); } }, { text: 'Leave it.' }] });

// ---- where the compass points ----
TASK_TARGETS.c1c_door = () => 'c1c_collector1';
TASK_TARGETS.c1c_zaki = () => 'c1c_zaki';
TASK_TARGETS.c1c_rana = () => ({ room: 'INT_DIVESHOP', id: 'c1c_rana', out: 'c1c_diveshop' });
TASK_TARGETS.c1c_bassem = () => 'c1c_vguard';
NEEDS_WHERE.fixer = 'Water: the public tap in the square, the water jars by the tap, on the quay and at the truck stop, the cooler in Rana\'s shop, the sink in your flat, and your canteen (in the bag, three swigs; it refills at any of them). Food: grilled fish on the quay, the ful cart, the café, the kiosk, and the truck stop café.';
