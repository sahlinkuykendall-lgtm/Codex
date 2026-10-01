// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-C, BEAT 7: BACK ON SHORE, AND THE EXIT (poke/ch1c_exit.js)
// story/regions/ch01_opening_fixer.md, beat 7 and the exit choice:
//   "Back on shore, you have Vasse's package, Bassem's debt, and a tracker. Dump the tracker
//   (the reef, a passing bus, or Bassem's own car, which is the funny option)."
//   - the reef: from the green harbour light at the end of the north breakwater
//   - a passing bus: the night bus south to Marsa Alam, at the truck stop 01:30–02:45
//   - Bassem's own car: his black Mercedes, parked where the road ends by his villa
//   Exit (c1_exit, story/03_CHOICES_AND_FLAGS.md §2):
//   - quiet: ghost Bassem; the debt stays and grows (a collector event in Ch2)
//   - legal: the coast guard post; the officer calls the Ministry, Dr. Amira Sayed asks you to
//     bring it to Cairo yourself (rel_amira +15, rep_ministry +10); Bassem hunts you (debt +10,000)
//   - deal: Bassem's double-cross, the Gebali in Cairo: 20,000 off the debt, 5,000 cash,
//     Gebali +10, and you owe them a favour
//   Leaving: the lorry driver ("empty to Cairo") or the night bus north (from 03:00); the
//   chapter-end card. Goodbyes, if you like: Zaki on his dhow, Rana at her shop.
// ============================================================

// ---- new things on the map: Bassem's car, the harbour light ----
(function () {
    const L0 = marsaLayout;
    marsaLayout = function () { const L = L0(); L.things.push(['c1c_bcar', 52, 47, 3, 2], ['c1c_bwlight', 67, 20, 1, 1]); return L; };
})();
POKE_MAP_1C.objects.push(
    { id: 'c1c_bcar', label: "Bassem's Mercedes", model: 'mercedes' },
    { id: 'c1c_bwlight', label: 'Harbour Light', model: 'harbour light' },
);
SPR_L['mercedes'] = (w, d) => fit(carSprite(w, d, ['#5a5e68', '#2a2e36', '#1c1e24', '#101214'], { tint: '#18202c', hub: '#dfe6ea' }));
SPR_L['harbour light'] = (w, d) => {                               // a green harbour light on a striped post at the end of the breakwater
    const frames = [0, 1].map(f => { const st = propStage(w, d, 14, 44), { A } = st, x = st.x, y = st.y;
        A.r(x + 3, y + 30, 8, 14, '#c8ccd0'); A.r(x + 5, y + 8, 4, 24, '#2e8a4a'); for (let j = 10; j < 32; j += 8) A.r(x + 5, y + j, 4, 3, '#f4f4f0');
        A.r(x + 3, y + 2, 8, 7, '#20242c'); A.r(x + 4, y + 3, 6, 5, f ? '#60ff90' : '#2e8a4a'); A.r(x + 2, y, 10, 2, '#20242c');
        return propFit(st, w, d, { solid: [(w - 10) / 2, d - 10, 10, 8], light: { x: 0, y: -38, r: 30, c: '#60ff90' } }); });
    return { c: frames[0].c, frames: frames.map(q => q.c), fps: 0.6, ox: frames[0].ox, oy: frames[0].oy, solid: frames[0].solid, light: frames[0].light };
};
SPR.c1c_bus = (south) => {                                          // a long-distance coach, nose-on: blue and white, the destination in the window
    const st = stage(64, 96, 26), { A } = st, x = st.x, y = st.y - 24;
    A.soft(x + 4, y + 110, 58, 8, '#000000', 0.25);
    A.r(x + 4, y, 56, 84, '#e8ecef'); A.hl(x + 4, y, 56, '#ffffff'); A.vl(x + 59, y, 84, '#b8c0c8'); A.r(x + 10, y + 8, 44, 6, '#c8d0d8'); A.r(x + 26, y + 30, 12, 8, '#a8b0b8');   // the roof, its vents
    A.r(x + 4, y + 84, 56, 34, south ? '#2a6aa8' : '#2a8a5a'); A.hl(x + 4, y + 84, 56, south ? '#4a8ac8' : '#4aaa7a');
    A.r(x + 8, y + 86, 48, 16, '#2c3c4c'); A.line(x + 12, y + 100, x + 24, y + 88, '#6a8aa8'); A.r(x + 14, y + 87, 36, 4, '#20242c'); for (let i = 0; i < 6; i++) A.r(x + 17 + i * 5, y + 88, 3, 2, '#f0a030');   // the windscreen, the destination board
    A.r(x + 9, y + 106, 8, 5, '#fff8d0'); A.r(x + 47, y + 106, 8, 5, '#fff8d0'); A.r(x + 24, y + 108, 16, 6, '#3a3e48'); A.r(x + 6, y + 116, 52, 2, '#5a6068');
    A.r(x + 1, y + 88, 4, 8, '#20242c'); A.r(x + 59, y + 88, 4, 8, '#20242c');
    return fit(st, { light: { x: 0, y: -4, r: 30, c: '#fff8d0' } });
};

// ---- the night buses at the truck stop ----
const BUS_S = [25 * 60 + 30, 26 * 60 + 45], BUS_N = 27 * 60;            // south to Marsa Alam 01:30–02:45; north to Cairo from 03:00
const Bus = {
    e: null, kind: null, map: null,
    want() { if (!sflag('c1c_ship_done')) return null; const c = Story.s.clock; return c >= BUS_N ? 'north' : c >= BUS_S[0] && c < BUS_S[1] ? 'south' : null; },
    frame() {
        const m = Game.maps.ch1; if (!m) return;
        if (this.map !== m) { this.map = m; this.e = null; this.kind = null; }
        const k = this.want();
        if (k === this.kind) return;
        if (this.e) { World.removeEnt(m, this.e); this.e = null; }
        this.kind = k; if (!k) return;
        const [px, py] = TRUCK.park;
        this.e = World.addEnt(m, { x: px * TILE, y: py * TILE, w: 64, d: 96, id: 'c1c_bus', label: k === 'south' ? 'The Night Bus South' : 'The Night Bus to Cairo', spr: SPR.c1c_bus(k === 'south'), sortY: py * TILE + 96 });
        World.addSolid(m, this.e.x + 4, this.e.y + 4, 56, 90, this.e);
        if (Game.map === m) Notice.show(k === 'south' ? 'At the truck stop: the night bus south to Marsa Alam, stopping for ten minutes.' : 'At the truck stop: the night bus to Cairo, its engine running.');
    },
};

// ============================================================
// BACK ON SHORE
// ============================================================
const trackerGone = () => !!sflag('c1c_tracker');
function c1cShoreTasks() {
    if (sflag('c1c_shore_tasks')) return; sflag('c1c_shore_tasks', true);
    taskDone('c1c_shore');
    task('c1c_tracker', 'The tracker, blinking in your pocket: get rid of it. Throw it on the reef from the harbour light, drop it on the night bus south, or slip it into Bassem\'s own car.');
    task('c1c_exit', 'Then decide: the coast guard post (go legal), Bassem\'s gate (his deal), or just the highway north and away (ghost him).');
}
(function () {                                                        // the moment you step onto the quay
    const sc = STORY.c1c_home, ch = sc.choices;
    sc.choices = [{ text: ch[0].text, onSelect: () => { c1cShoreTasks(); const z = Game.maps.ch1.ents.find(e => e.id === 'c1c_zaki'); if (z) z.gone = false; } }];
})();
function c1cDump(where, line) {
    delete Game.bag['GPS tracker']; sflag('c1c_tracker', where); taskDone('c1c_tracker');
    storyNote('The tracker', line);
}
// the reef, from the harbour light
STORY_SCRIPTS.c1c_bwlight = 'c1c_bwlight';
scene('c1c_bwlight', {
    speaker: 'System',
    text: () => `The green harbour light at the end of the north breakwater, blinking slowly to itself. Beyond it, in the dark, the reef: you can hear the sea breaking on it, a long hush, over and over.` + (Game.bag['GPS tracker'] ? `\n\nIn your pocket, the tracker blinks back at it, green for green.` : ''),
    get choices() { return Game.bag['GPS tracker'] ? [{ text: 'Throw the tracker as far as you can, out onto the reef.', onSelect: () => { c1cDump('reef', 'Thrown onto the reef from the end of the breakwater, into two metres of water and coral. On somebody\'s screen the dot stopped dead on the reef. Let them think you went down with it.'); Dlg.open('System', 'A good throw. A tiny splash, white in the dark, right where the waves break. Somewhere, on a screen, a dot stops moving, on the reef, in the sea, where a courier and an old man and their boat were supposed to end up.\n\nLet them think so.'); } }, { text: 'Not yet.' }] : [{ text: 'Move on.' }]; },
});
// the night bus south
STORY_SCRIPTS.c1c_bus = () => Bus.kind === 'south' ? 'c1c_bus_south' : 'c1c_bus_north';
scene('c1c_bus_south', {
    speaker: 'System',
    text: () => `The night bus south: Safaga, Quseir, Marsa Alam, Berenice, and on to the end of the road. Ten minutes for the driver's tea. The luggage hold is open, full of sacks of onions, a crate of chickens and somebody's wedding presents in gold paper.` + (Game.bag['GPS tracker'] ? '' : `\n\nThe driver finishes his tea and climbs back in.`),
    get choices() { return Game.bag['GPS tracker'] ? [{ text: 'Drop the tracker into the luggage hold, between the onions.', onSelect: () => { c1cDump('bus', 'Dropped into the luggage hold of the night bus south, between the sacks of onions. By morning the dot will be in Berenice, at the far end of the road, near the Sudan border. Let them chase it.'); Dlg.open('System', 'It drops between two sacks of onions without a sound. A minute later the driver slams the hold, honks twice at nobody, and the bus pulls out onto the highway south, its tail lights getting smaller and smaller.\n\nBy morning the dot on somebody\'s screen will be in Berenice, five hundred kilometres away, at the end of the road. Let them chase onions.'); } }, { text: 'Not yet.' }] : [{ text: 'Move on.' }]; },
});
// Bassem's own car
STORY_SCRIPTS.c1c_bcar = 'c1c_bcar';
scene('c1c_bcar', {
    speaker: 'System',
    text: () => `Bassem's black Mercedes, parked where the road ends by his villa, washed this evening by somebody who isn't Bassem. It's the only car in Marsa Tarfa without dust on it.` + (Game.bag['GPS tracker'] ? `\n\nBassem's man at the gate is looking at his phone, its light on his face.` : sflag('c1c_tracker') === 'bassem' ? `\n\nSomewhere under the rear bumper, a little green light is blinking.` : ''),
    get choices() { return Game.bag['GPS tracker'] ? [{ text: 'Crouch down and tape the tracker up inside the rear bumper.', onSelect: () => { c1cDump('bassem', 'Taped up inside the rear bumper of Bassem\'s own black Mercedes. Tomorrow the Swiss foundation\'s security people will watch the dot go to Bassem\'s lawyer, Bassem\'s barber, Bassem\'s bank, and Bassem\'s cousin\'s wedding in Hurghada.'); Dlg.open('System', 'You tear a strip off the tape from Rana\'s kit, lie on your back on the warm sand, and fix the tracker up inside the bumper, its little green light winking at you.\n\nTomorrow some very serious people in Switzerland will watch their dot go to Bassem\'s lawyer, Bassem\'s barber, Bassem\'s bank and Bassem\'s cousin\'s wedding in Hurghada, and wonder what on earth he\'s doing. So will Bassem, when they come and ask him.\n\nYou slide out from under the car. The man at the gate hasn\'t looked up from his phone.'); } }, { text: 'Not yet.' }] : [{ text: 'Move on.' }]; },
});

// ============================================================
// THE EXIT
// ============================================================
const exitOpen = () => sflag('c1c_ship_done') && !sflag('c1_exit');
// legal: the coast guard post
(function () { const prev = STORY_SCRIPTS.c1c_cgofficer; STORY_SCRIPTS.c1c_cgofficer = () => exitOpen() ? 'c1c_legal1' : sflag('c1_exit') === 'legal' ? 'c1c_legal_after' : prev; })();
scene('c1c_legal1', {
    speaker: 'Coast Guard',
    text: `The coast guard on night duty is in his white shirtsleeves with his feet on the desk and a glass of tea going cold, watching football on his phone. He sees your face, and your clothes, and the blood on your hands that isn't yours, and his feet come down off the desk.\n\n"Sit," he says. "Sit. What happened?"`,
    choices: [
        { text: 'Put the Codex on his desk. Tell him everything.', nextScene: 'c1c_legal2' },
        { text: '"Nothing. Wrong door."' },
    ],
});
scene('c1c_legal2', {
    speaker: 'Coast Guard',
    text: `You tell him: Bassem, the truck, the German woman, the ship with her name painted out, the captain, the launch, Zaki. He listens without a word, and when you open the case and unwrap the green scarf, he stands up.\n\n"This isn't a coast guard thing," he says. "This is a Ministry thing." He picks up the desk phone, an old grey one, and asks for a number in Cairo, and waits, and says your name, and waits again. Then he holds the phone out to you. "A doctor. At the Ministry of Antiquities. She wants you."`,
    choices: [{ text: 'Take the phone.', nextScene: 'c1c_legal3' }],
});
scene('c1c_legal3', {
    speaker: 'Dr. Amira Sayed',
    text: `A woman's voice, wide awake at three in the morning. "This is Amira Sayed. Describe it to me. Exactly."\n\nYou do: the leather boards, the flap, the papyrus leaves, the Greek, the little pictures in the margins. Then the note: Father Bishoy. El-Fishawy. Thursday. Please.\n\nThe silence on the line is long enough for the football on the officer's phone to score a goal.\n\n"Listen to me," she says. "They'll want to send a police courier for it in the morning. Don't give it to him. Don't give it to anyone. I don't trust the police with this, and I don't trust half of my own building." A breath. "Bring it to me yourself. Here, in Cairo. Can you do that?"`,
    choices: [{ text: '"I can do that."', onSelect: () => c1cExit('legal') }],
});
scene('c1c_legal_after', { speaker: 'Coast Guard', text: `"Go," says the coast guard. "Before morning, before the courier, before Bassem hears. I never saw you." He picks up his tea. "Good luck, eh."`, choices: [{ text: '"Thank you."' }] });
// deal: Bassem's gate
(function () { const prev = STORY_SCRIPTS.c1c_vguard; STORY_SCRIPTS.c1c_vguard = STORY_SCRIPTS.c1c_vgate = () => exitOpen() ? 'c1c_deal1' : sflag('c1_exit') === 'deal' ? 'c1c_deal_after' : prev; })();
scene('c1c_deal1', {
    speaker: "Bassem's Man",
    text: `Bassem's man at the gate looks up from his phone and goes very still. Then he talks into his radio, low and fast.\n\nA minute later the gate opens, and Bassem himself comes out in a silk dressing gown and slippers, a glass of something in his hand, looking at you the way a man looks at a horse that has come back from the knacker's on its own.\n\n"Habibi," he says softly. "The Swiss called me. The ship called me. Everybody is calling me tonight." He tilts his head. "And here you are. With my package."`,
    choices: [{ text: '"Your package tried to kill me, Bassem."', nextScene: 'c1c_deal2' }],
});
scene('c1c_deal2', {
    speaker: 'Bassem Nassar',
    text: `"Not my package. Theirs." He sips. "And that, habibi, is very interesting. A Swiss foundation, very respectable, with a website, hires a ship to kill one courier and one old fisherman to get a book back." He smiles. "What kind of book is worth that?"\n\nHe answers himself. "A book worth more than sixty thousand pounds. A book worth a great deal to some people I know in Cairo. Old people. The Gebali. They pay what things are worth, and they don't send ships."\n\n"You take it to them. Twenty thousand off what you owe me, tonight. Five thousand in your hand for the road." He holds out his empty hand, palm up. "And the Swiss can look for their book in the sea."`,
    choices: [
        { text: '"Deal."', onSelect: () => c1cExit('deal') },
        { text: '"I\'ll think about it."', nextScene: 'c1c_deal_no' },
    ],
});
scene('c1c_deal_no', { speaker: 'Bassem Nassar', text: `"Think," he says pleasantly. "Think quickly. In the morning, the Swiss will be here, and I'll be thinking too." He goes back in. The gate closes.`, choices: [{ text: 'Go.' }] });
scene('c1c_deal_after', { speaker: "Bassem's Man", text: `"Mr. Bassem says go with God," says the man at the gate. "And go now."`, choices: [{ text: 'Go.' }] });

function c1cExit(kind) {
    sflag('c1_exit', kind); taskDone('c1c_exit');
    if (kind === 'legal') { rel('amira', 15); rep('ministry', 10); debtAdd(10000, 'Bassem is hunting you'); sflag('ch1c_bassem_hunts', true); storyNote('Dr. Amira Sayed', 'Ministry of Antiquities, Cairo. The coast guard called her. "Don\'t give it to the police courier. Bring it to me yourself, in Cairo."'); }
    if (kind === 'deal') { debtAdd(-20000, 'Bassem\'s deal'); storyPay(5000, 'From Bassem, for the road'); rep('gebali', 10); sflag('ch1c_owe_gebali', true); storyNote('Bassem Nassar', 'The double-cross: take the Codex to the Gebali in Cairo instead of the Swiss. Twenty thousand off the debt, five thousand for the road, and a favour owed to the Gebali.'); }
    task('c1c_leave', 'Leave Marsa Tarfa: the lorry driver at the truck stop is going to Cairo empty, and the night bus north comes at three.');
}

// ============================================================
// GOODBYES
// ============================================================
(function () { const prev = STORY_SCRIPTS.c1c_zaki; STORY_SCRIPTS.c1c_zaki = e => sflag('c1c_ship_done') ? 'c1c_zaki_end' : (typeof prev === 'function' ? prev(e) : prev); })();
scene('c1c_zaki_end', {
    speaker: 'Captain Zaki',
    text: () => sflag('ch1c_zaki_saved')
        ? `Zaki is sitting up on the dhow's deck against the wheel, grey, bandaged, a glass of tea in his good hand, refusing to lie down.\n\n"Go," he says. "Before Bassem's boys come, before the Swiss come, before my wife comes." He looks at your bag. "And habibi. If you ever need a boat, any boat, on any sea, you call me. I'll come." He means it. "I owe you a hole."`
        : `Zaki is sitting on the dhow's deck against the wheel with his shoulder tied up in his own headscarf, smoking, looking at the harbour mouth. He doesn't look at you.\n\n"Go," he says. "You're good at going."`,
    get choices() { return [{ text: sflag('ch1c_zaki_saved') ? '"Shukran, ya Rais."' : '"Zaki —"', onSelect: () => sflag('c1c_zaki_bye', true) }]; },
});
(function () { const prev = STORY_SCRIPTS.c1c_rana; STORY_SCRIPTS.c1c_rana = e => sflag('c1c_ship_done') && !sflag('c1c_rana_bye') ? 'c1c_rana_end' : (typeof prev === 'function' ? prev(e) : prev); })();
scene('c1c_rana_end', {
    speaker: 'Rana Fouad',
    text: () => `Rana opens the shop door before you knock: she's been up all night, you can see it. She looks at you, all of you, the blood on your shirt, and lets out a breath she's been holding since ten o'clock.\n\n` + (sflag('ch1c_zaki_saved') ? `"Zaki?" You tell her. "I'll drive him to the doctor in Safaga at first light. Don't argue." ` : `"Zaki?" You tell her. She doesn't say anything for a long moment. "I'll take him to the doctor in Safaga. You," and she stops. `) + `\n\n"You're leaving." It isn't a question.`,
    get choices() { const c = []; if (Game.bag['Diving kit']) c.push({ text: 'Give her back her kit.', onSelect: () => { delete Game.bag['Diving kit']; rel('rana', 5, true); sflag('c1c_rana_bye', true); }, nextScene: 'c1c_rana_end2' }); c.push({ text: '"I\'m leaving."', onSelect: () => sflag('c1c_rana_bye', true), nextScene: 'c1c_rana_end2' }); return c; },
});
scene('c1c_rana_end2', {
    speaker: 'Rana Fouad',
    text: `She takes your face in both hands, which she hasn't done in three years, and looks at you as if she's trying to memorise it, or check it for damage.\n\n"Come back," she says. "Not for me. For the reef. It misses you." She lets go. "And if you ever need to go down into dark water, somewhere, anywhere, you call me first. Not some idiot with a boat. Me."`,
    choices: [{ text: '"I\'ll call you."' }],
});

// ============================================================
// LEAVING
// ============================================================
function leaveBlock() { if (Game.bag['GPS tracker']) return 'Not with that thing blinking in your pocket. Get rid of the tracker first.'; return null; }
(function () { const prev = STORY_SCRIPTS.c1c_driver; STORY_SCRIPTS.c1c_driver = () => sflag('c1c_ship_done') ? 'c1c_lorry_leave' : prev; })();
scene('c1c_lorry_leave', {
    speaker: 'Lorry Driver',
    text: () => (leaveBlock() ? `The lorry driver is drinking tea in his cab with the door open. "Cairo? Empty, at four." He looks at you. "Or now, for you. You look like now."\n\n(${leaveBlock()})` : `The lorry driver is drinking tea in his cab with the door open. "Cairo? Empty, at four." He looks at you, and your bag, and your hands. "Or now, for you. You look like now." He shrugs. "Anything taken to Cairo that doesn't want to talk about it, I told you. I'm joking. Mostly."`) + (sflag('c1_exit') ? '' : `\n\n(Leaving without a word to Bassem, the coast guard or anyone: you'll be ghosting him.)`),
    get choices() { return leaveBlock() ? [{ text: '"Not yet."' }] : [{ text: 'Climb up into the cab. "Now."', onSelect: () => c1cLeave('lorry') }, { text: '"Not yet."' }]; },
});
scene('c1c_bus_north', {
    speaker: 'System',
    text: () => `The night bus to Cairo: Safaga, Hurghada, Ras Gharib, Suez, and the city by noon. The driver is drinking tea on the step. "Cairo?" he says. "Fifty. Sit anywhere. Don't wake the chickens."` + (leaveBlock() ? `\n\n(${leaveBlock()})` : '') + (sflag('c1_exit') ? '' : `\n\n(Leaving without a word to Bassem, the coast guard or anyone: you'll be ghosting him.)`),
    get choices() { return leaveBlock() ? [{ text: '"Not yet."' }] : [{ text: 'Board the bus. (50 EGP)', onSelect: () => { storyPay(-Math.min(50, money()), 'The night bus to Cairo'); c1cLeave('bus'); } }, { text: '"Not yet."' }]; },
});
function c1cLeave(how) {
    if (!sflag('c1_exit')) { sflag('c1_exit', 'quiet'); sflag('ch1c_debt_grows', true); taskDone('c1c_exit'); }
    sflag('c1c_left_by', how); taskDone('c1c_leave');
    const k = sflag('c1_exit');
    storyMessage('B. Nassar', k === 'legal' ? 'The coast guard, habibi? The coast guard? I will see you in Cairo. — B.' : k === 'deal' ? 'Go with God. The Gebali are expecting you. Don\'t make me come to Cairo. — B.' : 'You have something of mine, habibi. And I have your address. All of them. — B.');
    startDialogue(how === 'bus' ? 'c1c_leave_bus' : 'c1c_leave_lorry');
}
scene('c1c_leave_lorry', {
    speaker: 'System',
    text: () => `The lorry grinds up through its gears onto the coast highway, north, the empty trailer banging behind. Marsa Tarfa goes by in the dark: the truck stop, the town, the minaret, the harbour, and out past the breakwater the lighthouse turning, every eleven seconds, as if it were looking for you.\n\nThe driver puts a cassette in. Umm Kalthoum, of course. "Sleep," he says. "Six hundred kilometres. I'll wake you at the Suez road."\n\nYou don't sleep. You hold the bag on your knees, the book in its green scarf, the note that says please, and watch the dark go by.`,
    choices: [{ text: 'North, to Cairo.', onSelect: () => c1cChapterEnd() }],
});
scene('c1c_leave_bus', {
    speaker: 'System',
    text: () => `The bus pulls out onto the coast highway, north, half full of sleeping men and one crate of chickens. Marsa Tarfa goes by in the dark: the truck stop, the town, the minaret, the harbour, and out past the breakwater the lighthouse turning, every eleven seconds, as if it were looking for you.\n\nThe television at the front plays a film from 1974 with the sound off. You hold the bag on your knees, the book in its green scarf, the note that says please, and watch the dark go by.`,
    choices: [{ text: 'North, to Cairo.', onSelect: () => c1cChapterEnd() }],
});
function c1cChapterEnd() {
    sflag('ch1_complete', true);
    for (const t of Story.s.tasks) if (!t.done && /^c1c_/.test(t.id)) taskDone(t.id);
    Game.save();
    const f = Story.s.flags, L = [];
    L.push({ quiet: 'You left without a word to anyone, with the Codex in your bag. Bassem doesn\'t know where his package went, and the debt is still growing.',
             legal: 'You walked into the coast guard post and told them everything. Dr. Amira Sayed at the Ministry asked you to bring the Codex to Cairo yourself. Bassem is hunting you now.',
             deal: 'You took Bassem\'s double-cross: the Codex goes to the Gebali in Cairo, not the Swiss. 20,000 off the debt, 5,000 in your pocket, and a favour owed to the Gebali.' }[f.c1_exit]);
    L.push(f.ch1c_zaki_saved ? 'Captain Zaki was shot in the escape. You stopped the boat and saved him, and lost the ship. He owes you, and says so.' : 'Captain Zaki was shot in the escape. You kept running. He lived, just, and he won\'t forgive you.');
    L.push({ reef: 'You threw the tracker onto the reef. They think you went down with it.', bus: 'You put the tracker on the night bus south. By morning it was at the end of the road, near the Sudan border.', bassem: 'You taped the tracker inside Bassem\'s own Mercedes. The Swiss will be very interested in Bassem tomorrow.' }[f.c1c_tracker] || 'You still have the tracker.');
    L.push('You owe Bassem Nassar ' + debt().toLocaleString('en') + ' pounds.' + (f.ch1c_bassem_hunts ? ' And he\'s coming for it.' : ''));
    if (f.c1c_lena_word) L.push('You gave Brandt, the German woman who doesn\'t laugh, your word that you wouldn\'t open it. You opened it.');
    else if (f.c1c_lena_met) L.push('Brandt, the German woman who doesn\'t laugh, told you twice not to open it.');
    L.push(f.c1c_seal === 'intact' ? 'You opened the case without breaking the seal. It could still go back as if nobody had looked.' : 'You cut the seal.');
    L.push({ paid: 'You paid for the diesel, and have the receipt.', stolen: 'You stole the diesel from the harbour fuel store, past the night watchman.', bribed: 'You paid the night watchman to take a long walk.' }[f.c1c_fuel] || '');
    L.push({ bought: 'The fisherman\'s wife\'s cousin on the patrol boat told you the coast guard\'s times.', scouted: 'You watched the coast guard\'s patrol from the fort\'s rampart.' }[f.c1c_route] || '');
    if (f.c1c_ship_seen) L.push('The ship\'s crew saw your face.');
    if ((Story.s.heat || 0) > 1) L.push('Police heat ' + Story.s.heat + '.');
    if (f.c1c_rana_bye) L.push('You said goodbye to Rana. "If you ever need to go down into dark water, you call me first."');
    if (f.c1c_lh_top) L.push('You climbed the ninety-one steps of the lighthouse.');
    if (f.c1c_fish_n) L.push('You caught ' + f.c1c_fish_n + ' fish off Lighthouse Island.');
    L.push('In Cairo, a young man called Karim el-Gebali already knows your name.');
    EndCard.show('END OF CHAPTER ONE', 'MARSA TARFA', L.filter(Boolean), 'Thursday, Café El-Fishawy, Cairo. Father Bishoy is waiting for someone who has never heard of him, and has his book. Chapter Two, Cairo, is being built. Your choices are saved and will carry forward.');
}

// ---- the hooks, the compass ----
(function () {
    const A = AREAS.fixer, _frame = A.frame, _sync = A.sync;
    A.frame = function (dt) { _frame.call(this, dt); Bus.frame(); };
    A.sync = function () { _sync.call(this); Bus.map = null; const m = Game.maps.ch1; if (m && sflag('c1c_ship_done')) { const z = m.ents.find(e => e.id === 'c1c_zaki'); if (z && !sflag('c1c_at_sea')) z.gone = false; } };
})();
TASK_TARGETS.c1c_tracker = () => { const c = Story.s.clock; return c >= BUS_S[0] && c < BUS_S[1] ? 'c1c_bus' : 'c1c_bwlight'; };
TASK_TARGETS.c1c_exit = () => 'c1c_cgofficer';
TASK_TARGETS.c1c_leave = () => Bus.kind === 'north' ? 'c1c_bus' : 'c1c_driver';
