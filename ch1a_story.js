// ============================================================
// THE CODEX OF GIZA — CHAPTER 1-A: THE GIZA DIG CAMP
// (the Archaeologist's opening — story/regions/ch01_opening_archaeologist.md)
//
// Rewires the built Chapter 1 map for the new story:
//   - new people: Rais Abdallah, Dr. Lindqvist, Hana, Uncle Farouk,
//     Saber the tea boy, Uncle Hamid on the supply line, Lena Brandt
//   - the three trenches, the payroll, the find store, the Osiris Shaft
//     and Petamun's seal, the midnight car, the exit choice
//   - every old flavour node gets new words; the old story's objects
//     (satphone, the ministry inspector, Sam's gear) are retired
// The old Chapter 1 scenes in dialogue.js are left in place but nothing
// points at them any more.
// Loaded after story_core.js.
// ============================================================

// ---- people ----
Object.assign(PERSON_STYLES, {
    rais:      { skin: '#7a5230', shirt: '#d8cfbc', pants: '#cfc5b0', robe: true, headwear: 'wrap', wrapColor: '#f0ece0' },
    lindqvist: { skin: '#e0c0a0', shirt: '#8aa0b0', pants: '#4a4a44', hair: '#d8c8a0' },
    hana:      { skin: '#b08058', shirt: '#6a3a4a', pants: '#2a2a34', headwear: 'hood', hoodColor: '#7a4a5a' },
    farouk:    { skin: '#6a4a2c', shirt: '#4a4a3e', pants: '#3a3a30', robe: true, headwear: 'wrap', wrapColor: '#9a9080', gaunt: true },
    saber:     { skin: '#8a5a32', shirt: '#b86a2a', pants: '#3a2f20', scale: 0.8 },
    hamid:     { skin: '#7a5230', shirt: '#3a4a5a', pants: '#2a2a2a', headwear: 'cap', capColor: '#6a5a40' },
    lena:      { skin: '#e4c8a8', shirt: '#1e2226', pants: '#16181a', hair: '#e0d0a0' },
    lenaman:   { skin: '#c8a888', shirt: '#22262a', pants: '#16181a', headwear: 'cap', capColor: '#16181a' },
});
Object.assign(PERSON_OBJECTS, {
    tariq_talk: 'rais', c1a_lindqvist: 'lindqvist', c1a_hana: 'hana', c1a_farouk: 'farouk',
    c1a_saber: 'saber', c1a_hamid: 'hamid', c1a_lena: 'lena', c1a_lenaman1: 'lenaman', c1a_lenaman2: 'lenaman',
    dorm_awake: 'worker',
});
window.CH1_CAR_LABEL = 'Black Land Cruiser';

// ---- the map, rewired ----
(function c1aRewire() {
    const objs = mapObjects[1];
    const get = id => objs.find(o => o.id === id);
    const set = (id, props) => { const o = get(id); if (!o) return; if (props.label && !o.modelLabel) o.modelLabel = o.label; Object.assign(o, props); };
    const hide = id => set(id, { c1aHidden: true });
    ['sams_gear', 'satphone', 'inspector'].forEach(hide);

    set('tent_bldg', { label: "The Director's Tent" });
    set('tent_door', { label: "Enter Miriam's Tent" });
    set('foreman_bldg', { label: 'Site Office' });
    set('foreman_door', { label: 'Enter Site Office' });
    set('tariq_talk', { label: 'Rais Abdallah', interactScene: 'c1a_rais' });
    set('trench', { label: 'Trench A', interactScene: 'c1a_trenchA' });
    set('carts', { label: 'Supply Line', interactScene: 'c1a_hamid' });
    set('generator', { label: 'Generator', interactScene: 'c1a_generator' });
    set('perimeter', { label: 'The Quarry Path', interactScene: 'c1a_perimeter' });
    set('rest_brazier', { label: 'Brazier (Rest / Wait)' });
    set('dig_gate', { label: 'Dig Zone Gate — LOCKED' });
    set('puzzle_glyph', { label: 'The Old Seal' });
    set('tunnel_mouth', { label: 'The Shaft', interactScene: 'c1a_shaft' });
    set('fl_stake_sam', { label: 'Red Survey Stake', interactScene: 'c1a_trenchC' });
    set('fl_toolshed', { label: 'Find Store', interactScene: 'c1a_store' });
    set('fl_digshed', { label: 'Dig Shed Clipboard', interactScene: 'c1a_digshed' });
    set('fl_trailer', { label: 'Site Trailer' });
    set('fl_palm', { label: 'Date Palm' });
    set('fl_cactus', { label: 'Lone Date Palm' });
    set('fl_guard_booth', { label: 'Guard Booth' });
    set('fl_ministry_post', { label: 'Old Ministry Post' });
    set('fl_crates', { label: 'Sorted Crates', interactScene: 'c1a_crates' });
    set('ow_wreck', { label: 'Old Expedition Truck' });
    set('ow_sieve', { interactScene: 'c1a_sieve' });
    set('ow_tea', { interactScene: 'c1a_tea' });

    // new people, stood next to the places they belong to
    const person = (id, label, scene, x, z, extra) => objs.push(Object.assign({ id, x: x - 24, y: z - 24, w: 48, h: 48, color: '#888', label, interactScene: scene, zone: 'open' }, extra || {}));
    person('c1a_lindqvist', 'Dr. Lindqvist', 'c1a_lindqvist', 7820, 3300);
    person('c1a_hana', 'Hana', 'c1a_hana', 5860, 5070);
    person('c1a_farouk', 'Uncle Farouk', 'c1a_farouk', 9150, 5345);
    person('c1a_saber', 'Saber', 'c1a_saber', 1930, 4925);
    person('c1a_hamid', 'Uncle Hamid', 'c1a_hamid', 3780, 7335);
    // place names for the new story
    const names = { hub: "THE DIRECTOR'S CAMP", ministry: 'THE OLD MINISTRY POST', trench: 'TRENCH A', wreck: 'THE 1926 TRUCK', dig: 'THE DIG ZONE' };
    for (const pl of OW.places) if (names[pl.id]) pl.name = names[pl.id];
    // the midnight visitors (only there while they're searching)
    person('c1a_lena', 'The Woman in Black', 'c1a_lena', 5470, 5085, { lenaEvent: true });
    person('c1a_lenaman1', 'A Man with a Torch', 'c1a_lena', 5290, 5060, { lenaEvent: true });
    person('c1a_lenaman2', 'A Man by the Tent', 'c1a_lena', 5700, 4960, { lenaEvent: true });

    // interiors
    const iset = (key, id, props) => { const o = (mapObjects[key] || []).find(q => q.id === id); if (o) Object.assign(o, props); };
    iset('INT_TENT', 'tent_codex', { label: "Miriam's Desk", interactScene: 'c1a_tent_desk' });
    iset('INT_TENT', 'tent_journal', { label: 'Her Books', interactScene: 'c1a_tent_books' });
    iset('INT_TENT', 'tent_cot', { label: 'Camp Bed (Rest / Wait)', interactScene: 'c1a_tent_cot' });
    iset('INT_TENT', 'tent_photos', { label: 'Photographs', interactScene: 'c1a_tent_photos' });
    iset('INT_DORM', 'dorm_awake', { label: 'Gamal (Night Shift)', interactScene: 'c1a_dorm_worker' });
    iset('INT_DORM', 'dorm_talisman', { label: 'Blue Eye on a Cot', interactScene: 'c1a_dorm_charm' });
    iset('INT_DORM', 'dorm_graffiti', { label: 'Chalk Tally', interactScene: 'c1a_dorm_tally' });
    iset('INT_FOREMAN', 'for_desk', { label: 'Office Desk', interactScene: 'c1a_office_desk' });
    iset('INT_FOREMAN', 'for_manifest', { label: 'Payroll Ledger', interactScene: 'c1a_office_ledger' });
    iset('INT_FOREMAN', 'for_sams_notes', { label: 'Burn Bin', interactScene: 'c1a_office_bin' });
    iset('INT_FOREMAN', 'for_corkboard', { label: 'Corkboard', interactScene: 'c1a_office_cork' });

    // the compass follows the new story
    OW_MISSIONS.length = 0;
    OW_MISSIONS.push(
        { obj: 'tariq_talk', label: 'Rais Abdallah', when: () => storyOn() && !sflag('payroll') },
        { obj: 'c1a_lindqvist', label: 'Dr. Lindqvist', when: () => storyOn() && (!sflag('met_lindqvist') || sflag('payroll') === 'confront_pending') },
        { obj: 'trench', label: 'Trench A', when: () => storyOn() && sflag('payroll') && sflag('payroll') !== 'confront_pending' && !sflag('trenchA') },
        { obj: 'fl_digshed', label: 'Dig Shed', when: () => storyOn() && gameState.flags.scene3Triggered && !sflag('trenchB_known') },
        { obj: 'ow_sieve', label: 'Trench B Spoil', when: () => storyOn() && sflag('trenchB_known') && !sflag('mag_key') },
        { obj: 'fl_toolshed', label: 'Find Store', when: () => storyOn() && sflag('mag_key') && !sflag('codex') },
        { obj: 'tent_bldg', label: 'Your Tent', when: () => storyOn() && sflag('lena_event') === 'searching' },
    );

    // tips for the new story
    TIPS.splice(6, 1, { keys: ['J'], text: 'opens your notes and the people you know · ', keys2: ['TAB'], text2: 'hides the HUD' });
    TIPS.push({ keys: [], text: 'The clock (top right) is the time of night. Some things only happen at certain hours — the fire lets you wait.' });

    // the title screen already built the camp before this file loaded:
    // build it again with the new people and labels
    builtSignature = null;
})();

// hide what the new story retired, and who isn't there yet
(function wrapResolved() {
    const _r = isObjectResolved;
    isObjectResolved = function (o) {
        if (storyOn() && currentMapKey === 1) {
            if (o.c1aHidden) return true;
            if (o.lenaEvent) return sflag('lena_event') !== 'searching';
        }
        return _r(o);
    };
})();

// no patrols in the new opening (the old story's guards are gone)
spawnChapterOneHostiles = function () {};

// ---- helpers ----
function end() { closeDialogue(); } // (local helper: close the conversation)
function pocket(item) { if (!gameState.inventory.includes(item)) gameState.inventory.push(item); if (typeof bpRefresh === 'function') bpRefresh(); }
function scene(key, def) { storyData[key] = def; }
function gateOpen() { gameState.flags.scene3Triggered = true; }
const R = () => 'Rais Abdallah';

// ============================================================
// START
// ============================================================
function storyChapterStart() {
    gameState.funds = 8000;
    gameState.flags.inspector_dealt = true;   // the old ministry-car scene is retired
    S().rep.ministry = 10; S().rep.gebali = -10; S().rel.amira = 10;
    storyNote('Chapter 1 — The Giza Dig Camp', 'You have been hired to take over the Giza Western Field Survey. Its director, Dr. Miriam Hale, "left for family reasons" four days ago.');
    updateHUD();
}
// startGame opens this scene
scene('scene1_start', {
    speaker: 'System',
    text: () => `Half past eight at night. The taxi from Cairo drops you at the camp gate and is gone before the dust settles.\n\nTo the east, the pyramids stand against the city glow, bigger than photographs ever let them be. Around you: tents, work lamps, the smell of a charcoal fire and diesel. Somewhere a radio is playing Umm Kulthum.\n\nAn old man in a white galabeya is waiting at the gate with a lantern, as if he has been standing there for four days.`,
    choices: [{ text: 'Walk up to him.', nextScene: 'c1a_arr1' }],
});
scene('c1a_arr1', {
    speaker: R(),
    text: () => `"${PC.doctor}? Ahlan wa sahlan. Welcome. I am Abdallah — the rais, the foreman. Twenty-six seasons at Giza. My father before me, and his father, from Quft."\n\nHe looks at you for a long moment, the lantern steady.\n\n"Before anybody tells you anything else, I will tell you one thing. Doctor Miriam did not leave for family reasons."`,
    choices: [
        { text: '"What makes you so sure?"', onSelect: () => rel('abdallah', 5, true), nextScene: 'c1a_arr_why' },
        { text: '"Family reasons is what the Ministry told me."', nextScene: 'c1a_arr_why' },
        { text: '"It\'s late. Can this wait until the morning?"', onSelect: () => rel('abdallah', -5, true), nextScene: 'c1a_arr_late' },
    ],
});
scene('c1a_arr_late', {
    speaker: R(),
    text: `"It has waited four days." He doesn't move. "One more minute will not kill it."`,
    choices: [{ text: '"Go on, then."', nextScene: 'c1a_arr_why' }],
});
scene('c1a_arr_why', {
    speaker: R(),
    text: `"She left her tea on the table and her boots by the door. Twenty years I know her. She does not go anywhere without her boots."\n\n"Doctor Lindqvist — the deputy — he will tell you about family. Hana will tell you about the finds. I will tell you the truth, when you ask me for it."\n\nHe lowers the lantern. "Also: the men are owed eleven days of wages."`,
    choices: [
        { text: '"Eleven days? Why?"', nextScene: 'c1a_arr_wages' },
        { text: '"Where do I sleep?"', nextScene: 'c1a_arr_tent' },
    ],
});
scene('c1a_arr_wages', {
    speaker: R(),
    text: `"Doctor Lindqvist says Friday. He said Friday last Friday." A shrug with forty men in it. "They are good men. They will not leave. But they will not dig for promises either. Come to the fire when you have seen your tent. We will talk about it."`,
    choices: [{ text: '"I will."', onSelect: () => rel('abdallah', 3, true), nextScene: 'c1a_arr_tent' }],
});
scene('c1a_arr_tent', {
    speaker: R(),
    text: `"You sleep in the director's tent. Her things are still inside. Nobody has touched them — I made sure."\n\nHe turns toward the fire, then stops.\n\n"One more thing, ${PC.honor}. At night, if you hear a car on the east road — do not go and say hello."`,
    choices: [{ text: 'Watch him walk back to the fire.', onSelect: () => {
        sflag('met_rais', true);
        storyNote('Rais Abdallah', 'The foreman. From Quft, like his father and grandfather. Says Miriam "did not leave for family reasons" — she left her boots. The men are owed eleven days of wages. He\'ll talk at the workers\' fire.');
        storyNote('What to do', 'Look around Miriam\'s tent. Meet Dr. Lindqvist (site trailer, east) and Hana (by the tent). Talk to the Rais about the wages at the workers\' fire (west).');
        end();
    } }],
});

// ============================================================
// RAIS ABDALLAH — the hub of the camp
// ============================================================
scene('c1a_rais', {
    speaker: R(),
    text: () => {
        const p = sflag('payroll');
        if (!p) return `The Rais pours you tea without asking. "So. The wages."`;
        if (p === 'confront_pending') return `"Doctor Lindqvist is in his trailer," the Rais says, not looking up from the fire. "He is always in his trailer."`;
        if (p === 'delayed') return `The Rais nods at you — polite, no more. Around the fire the men don't look up.`;
        return `The Rais makes room for you by the fire. "Sit, ${PC.honor}. Tea?"`;
    },
    get choices() {
        const c = [];
        const p = sflag('payroll');
        if (!p || p === 'delayed') c.push({ text: p === 'delayed' ? '"About the wages — I\'ve thought again."' : '"Tell me about the wages."', nextScene: 'c1a_pay' });
        if (!sflag('rais_miriam')) c.push({ text: '"What do you think happened to Miriam?"', nextScene: 'c1a_rais_miriam' });
        if (gameState.flags.scene3Triggered) c.push({ text: '"Tell me about the trenches."', nextScene: 'c1a_rais_trenches' });
        if (!sflag('mina')) c.push({ text: '"You look like a man with two worries, not one."', nextScene: 'c1a_mina' });
        else if (sflag('mina') === 'open') c.push({ text: '"About Mina\'s debt."', nextScene: 'c1a_mina_resolve' });
        c.push({ text: 'Drink your tea. "Later, Rais."', onSelect: end });
        return c;
    },
});
scene('c1a_pay', {
    speaker: R(),
    text: `"Forty men. Eleven days. The site account is six thousand pounds short, and the Swiss money that pays the season comes through Doctor Lindqvist."\n\n"Doctor Miriam paid them from her own pocket last month. I am not asking you to do that. I am telling you what she did."`,
    get choices() {
        const c = [];
        c.push({ text: gameState.funds >= 6000 ? 'Pay the six thousand yourself. (−6,000 EGP)' : 'Pay the six thousand yourself. (you don\'t have it)', onSelect: () => {
            if (gameState.funds < 6000) { startDialogue('c1a_pay_cant'); return; }
            storyPay(-6000, 'The men\'s wages');
            const was = sflag('payroll');
            sflag('payroll', 'paid');
            rel('abdallah', was === 'delayed' ? 10 : 15); rel('workmen', was === 'delayed' ? 20 : 25, true);
            gateOpen();
            startDialogue('c1a_pay_paid');
        } });
        if (sflag('payroll') !== 'delayed') c.push({ text: '"Lindqvist is going to explain where that money went."', onSelect: () => { sflag('payroll', 'confront_pending'); startDialogue('c1a_pay_confront'); } });
        if (!sflag('payroll')) c.push({ text: '"They\'ll have to wait a few more days."', onSelect: () => {
            sflag('payroll', 'delayed'); rel('abdallah', -10); rel('workmen', -20, true); gateOpen();
            startDialogue('c1a_pay_delay');
        } });
        c.push({ text: '"Let me think about it."', onSelect: end });
        return c;
    },
});
scene('c1a_pay_cant', { speaker: R(), text: `He glances at your wallet and, kindly, away. "No. That is not your burden. Talk to the deputy."`, choices: [{ text: 'Back.', nextScene: 'c1a_pay' }] });
scene('c1a_pay_paid', {
    speaker: R(),
    text: `He counts it twice, the way you count money that isn't yours, and stands. Around the fire the talk stops, then starts again louder.\n\nSomeone laughs. Someone says your name wrong and three people correct him.\n\n"Tomorrow they dig for you," the Rais says. He unhooks a ring of keys from his belt. "Her keys. The dig gate, the trenches, the shaft. All but one — the find store. She kept that key on her. It is not on the ring."`,
    choices: [{ text: 'Take the keys.', onSelect: c1aKeysNote }],
});
scene('c1a_pay_confront', {
    speaker: R(),
    text: `A small smile, the first. "Then he will explain it to both of us. He is in his trailer on the east side. He is always in his trailer."`,
    choices: [{ text: 'Go and find Lindqvist.', onSelect: end }],
});
scene('c1a_pay_delay', {
    speaker: R(),
    text: `He is quiet for a while. Then he unhooks a ring of keys from his belt and puts it in your hand.\n\n"The dig gate. The trenches. The shaft. All but the find store — she kept that key on her.\n\nThe gate is yours, ${PC.doctor}. The men are not. Tomorrow you dig alone."`,
    choices: [{ text: 'Take the keys.', onSelect: c1aKeysNote }],
});
function c1aKeysNote() {
    pocket("Miriam's keys");
    storyNote('The keys', 'Miriam\'s key ring: the dig gate, the trenches, the shaft. The find-store key is missing — she kept it on her. Her survey has three trenches: A (east of camp), B and C. The dig shed inside the gate has the records.');
    storyNotice('The dig zone gate is open.');
    end();
}
scene('c1a_rais_miriam', {
    speaker: R(),
    text: `"The last week she did not sleep. She went down the shaft at night, alone. She came up with plaster on her hands and would not say why."\n\n"The night she left, Farouk at the guard booth saw a car. Not the Ministry. Ask him. Farouk sees everything and tells nothing, unless you are polite."`,
    choices: [{ text: '"Thank you, Rais."', onSelect: () => { sflag('rais_miriam', true); storyNote('Miriam\'s last week', 'She went down the shaft alone at night and came back with plaster on her hands. Uncle Farouk at the guard booth (east, by the old Ministry post) saw a car the night she left.'); end(); } }],
});
scene('c1a_rais_trenches', {
    speaker: R(),
    text: () => `"Three trenches this season. A is east, past the trailer — she had it re-opened the week before she left, then made me rope it off. B is inside the dig zone; she backfilled it herself, which a director does not do. C is not a trench — only her red stake by the gate. She would stand by it and look at the pyramids.\n\nThe dig shed has the records. Doctor Miriam wrote everything down. Everything."` +
        (sflag('payroll') === 'delayed' ? `\n\nHe adds, flatly: "Trench A is roped. The men will not open it for you."` : ''),
    choices: [{ text: '"I\'ll start with them."', onSelect: () => { storyNote('The trenches', 'A: east, past the site trailer — re-opened, then roped off. B: inside the dig zone — Miriam backfilled it herself. C: her red survey stake by the dig gate. The dig shed has the records.'); end(); } }],
});

// SQ-01A-01 — The Rais's Son
scene('c1a_mina', {
    speaker: R(),
    text: `He laughs, once, without much in it. "My son Mina. He looks after horses at a stable in Nazlet el-Samman, under the pyramids. He borrowed from the stable owner for a motorbike. Now the man wants it back with interest — fifteen hundred pounds by Friday — or Mina works the tourist camels for a year for nothing."\n\n"He is a good boy. He is a stupid boy. Both."`,
    choices: [
        { text: '"Maybe I can help."', onSelect: () => { sflag('mina', 'open'); storyNote('The Rais\'s son (side quest)', 'Mina owes a stable owner in Nazlet el-Samman 1,500 EGP. Pay it, or win it at the camp darts (the stable owner bets on the tournament too), or stay out of it.'); rel('abdallah', 3, true); end(); } },
        { text: '"That\'s hard. I\'m sorry."', onSelect: () => { sflag('mina', 'declined'); end(); } },
    ],
});
scene('c1a_mina_resolve', {
    speaker: R(),
    text: () => `"Mina's debt," the Rais says. "Friday."` + (sflag('darts_won') ? `\n\nHe has already heard about the darts. Everybody has.` : ''),
    get choices() {
        const c = [];
        if (gameState.funds >= 1500) c.push({ text: 'Give him 1,500 EGP for Mina. (−1,500 EGP)', onSelect: () => { storyPay(-1500, 'Mina\'s debt'); c1aMinaDone('paid'); } });
        if (sflag('darts_won')) c.push({ text: '"Take the darts winnings. The stable owner lost his bet anyway."', onSelect: () => c1aMinaDone('darts') });
        c.push({ text: '"Not yet."', onSelect: end });
        return c;
    },
});
function c1aMinaDone(how) {
    sflag('mina', 'done');
    rel('abdallah', 15);
    storyNote('The Rais\'s son (side quest)', 'Done. Mina\'s debt is paid' + (how === 'darts' ? ' with the darts winnings.' : '.') + ' The Rais says his family in Quft will not forget it.');
    startDialogue('c1a_mina_thanks');
}
scene('c1a_mina_thanks', {
    speaker: R(),
    text: `He takes it with both hands and doesn't say thank you — he says your name, properly, the way people from Quft say the names of people they owe.\n\n"My cousins in Quft keep every paper our family ever touched. One day you will need a paper. You will have it."`,
    choices: [{ text: 'Finish your tea.', onSelect: end }],
});

// ============================================================
// DR. PETER LINDQVIST — the deputy
// ============================================================
scene('c1a_lindqvist', {
    speaker: 'Dr. Lindqvist',
    text: () => sflag('met_lindqvist')
        ? (sflag('payroll') === 'confront_pending' ? `Lindqvist sees your face and puts his coffee down.` : `"${PC.doctor}. Anything you need. Really."`)
        : `A tall Swede in a sun-bleached shirt, reading glasses pushed up into thinning hair, a coffee he's forgotten about. He shakes your hand too long.\n\n"Peter Lindqvist, deputy director. Thank God you're here. Thank God. The Ministry's been — well. Miriam had a family matter. Her mother, I think. She'll be in touch. In the meantime, the season, the permit, all of it — it's yours."`,
    get choices() {
        const c = [];
        if (sflag('payroll') === 'confront_pending') c.push({ text: '"The payroll is six thousand short. Where did the money go?"', nextScene: 'c1a_lq_confront' });
        if (!sflag('lq_mother')) c.push({ text: '"Her mother? Miriam\'s mother died years ago. It\'s in her file."', onSelect: () => { sflag('lq_mother', true); rel('lindqvist', -5, true); }, nextScene: 'c1a_lq_mother' });
        if (!sflag('vasse_named')) c.push({ text: '"Who\'s paying for this season?"', nextScene: 'c1a_lq_money' });
        if (!sflag('lq_key')) c.push({ text: '"Where\'s the find-store key?"', onSelect: () => sflag('lq_key', true), nextScene: 'c1a_lq_key' });
        c.push({ text: '"Goodnight, Peter."', onSelect: () => { sflag('met_lindqvist', true); end(); } });
        return c;
    },
});
scene('c1a_lq_mother', {
    speaker: 'Dr. Lindqvist',
    text: `A long pause. He takes his glasses off, cleans them on a shirt that makes them dirtier.\n\n"Then — something else. Family can mean a lot of things. She was very private." He puts the glasses back on. "I only know what I was told."`,
    choices: [{ text: '"Who told you?"', nextScene: 'c1a_lq_told' }, { text: 'Let it go. For now.', nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_told', {
    speaker: 'Dr. Lindqvist',
    text: `"The Foundation's office called. They said she'd asked them to pass it on." He hears himself say it and looks miserable. "Which is odd, I suppose. Now that you — yes."`,
    choices: [{ text: '"Odd is one word for it."', onSelect: () => { sflag('vasse_named', true); storyNote('Lindqvist', 'The deputy. Kind, frightened, lying badly. The story that Miriam left for her mother came from "the Foundation\'s office" — the Swiss foundation that pays the season.'); }, nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_money', {
    speaker: 'Dr. Lindqvist',
    text: `"The usual. The university, the Ministry's share — and a private foundation. The Vasse Foundation, in Geneva. Very generous. Very... interested. Mr. Vasse collects. Well — he supports. Heritage."\n\nHe says "heritage" like a word he was given to say.`,
    choices: [{ text: 'Back.', onSelect: () => { sflag('vasse_named', true); storyNote('The Vasse Foundation', 'A private foundation in Geneva pays for most of the season, through Lindqvist. Its founder, Conrad Vasse, "collects".'); }, nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_key', {
    speaker: 'Dr. Lindqvist',
    text: `"Lost. Miriam had it on her. The Ministry's sending a replacement seal and a new lock — eventually. Nothing in there but pottery anyway." He laughs. It isn't a laugh.`,
    choices: [{ text: 'Back.', nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_confront', {
    speaker: 'Dr. Lindqvist',
    text: `He opens his mouth to say Friday and doesn't.\n\n"The Foundation pays the season. Not the university — the Foundation. All of it, since spring. And when Miriam left, the transfers stopped, and they told me they'd resume when the season was — secured. Their word."\n\nHe opens a drawer: an envelope, fat, rubber-banded. "Emergency float. It's theirs. I wasn't supposed to touch it."`,
    choices: [
        { text: '"Pay the men with it. Tonight."', onSelect: () => {
            sflag('payroll', 'confronted'); sflag('vasse_named', true); sflag('met_lindqvist', true);
            rel('lindqvist', -15); rel('abdallah', 10); rel('workmen', 20, true); gateOpen();
            storyNote('The payroll', 'Lindqvist paid the men from the Vasse Foundation\'s "emergency float". The Foundation has paid for the whole season since spring, and stopped paying when Miriam left.');
        }, nextScene: 'c1a_lq_paid' },
    ],
});
scene('c1a_lq_paid', {
    speaker: 'Dr. Lindqvist',
    text: `He counts it out for the Rais with his hands shaking. At the door he catches your sleeve.\n\n"They'll know I did this. I'll tell them it was you. I'm sorry — I'm telling you so it isn't a surprise."\n\nThe Rais hands you Miriam's key ring on the way out. "All but the find store," he says. "She kept that one on her."`,
    choices: [{ text: 'Take the keys.', onSelect: c1aKeysNote }],
});

// ============================================================
// HANA — the conservator
// ============================================================
scene('c1a_hana', {
    speaker: 'Hana',
    text: () => sflag('met_hana')
        ? `Hana looks up from a tray of pot sherds under a lamp. "${PC.doctor}."`
        : `A young woman at a folding table under a work lamp, gluing a pot back together with the patience of a surgeon. She doesn't stop.\n\n"You're the replacement." A beat. "Sorry. That sounded — I'm Hana. Conservation. I was Miriam's student, before I was her staff. I'm not being very professional this week."`,
    get choices() {
        const c = [];
        if (!sflag('hana_miriam')) c.push({ text: '"What was Miriam like, the last week?"', nextScene: 'c1a_hana_miriam' });
        if (!sflag('hana_q')) c.push({ text: '"Is there anything I can do for you?"', nextScene: 'c1a_hana_q' });
        else if (sflag('hana_q') === 'open') c.push({ text: bpFind('sherd') && bpFind('sherd').qty >= 3 ? 'Give her three painted sherds.' : '"Still looking for your sherds." (you need 3)', onSelect: () => {
            const s = bpFind('sherd');
            if (!s || s.qty < 3) { end(); return; }
            s.qty -= 3; if (s.qty <= 0) bpRemove('sherd'); else bpRefresh();
            sflag('hana_q', 'done'); rel('hana', 15); pocket('Conservation wax');
            storyNote('Hana\'s conservation (side quest)', 'Done. Hana joined the sherds — one potter, one ibis. She gave you a stick of conservation wax: "for anything you need to close again without anyone knowing."');
            startDialogue('c1a_hana_done');
        } });
        c.push({ text: '"Goodnight, Hana."', onSelect: () => { sflag('met_hana', true); end(); } });
        return c;
    },
});
scene('c1a_hana_miriam', {
    speaker: 'Hana',
    text: `She finally puts the glue down.\n\n"Scared. Miriam's never scared. She stopped sleeping. She kept saying 'it isn't ours to keep' — about what, she wouldn't say."\n\n"The night she left, I saw her go into the find store with something wrapped in her scarf. The green one. She came out without it. Then the car came, and in the morning she was gone."`,
    choices: [{ text: '"The find store is locked. Lindqvist says the key is lost."', onSelect: () => { sflag('hana_miriam', true); sflag('met_hana', true); storyNote('Hana', 'Miriam\'s student. The night Miriam left, Hana saw her take something wrapped in her green scarf INTO the find store, and come out without it.'); }, nextScene: 'c1a_hana_key' }],
});
scene('c1a_hana_key', {
    speaker: 'Hana',
    text: `"Lost." Hana smiles for the first time. "Miriam never lost anything in her life. If the key's gone, she put it somewhere. She'd put it in the ground — that's the only place she trusted."`,
    choices: [{ text: '"In the ground."', onSelect: end }],
});
scene('c1a_hana_q', {
    speaker: 'Hana',
    text: `"Actually — yes. Somebody on this site painted pots with the same black flick for a whole village's worth of jars. The pieces are scattered all over the camp; the wind turns them up. Bring me three and I can show you something."`,
    choices: [{ text: '"I\'ll keep my eyes open."', onSelect: () => { sflag('hana_q', 'open'); sflag('met_hana', true); storyNote('Hana\'s conservation (side quest)', 'Bring Hana three painted sherds (they glint in the sand at night).'); end(); } }],
});
scene('c1a_hana_done', {
    speaker: 'Hana',
    text: `She fits them edge to edge under the lamp, and the black flicks become a line, and the line becomes a bird: long curved beak, one leg raised. An ibis.\n\n"Thoth's bird. Ptolemaic, I think. Pretty." She presses a stick of dark wax into your hand. "Conservation wax. For anything you need to close again without anyone knowing." She doesn't explain, and you don't ask.`,
    choices: [{ text: 'Pocket the wax.', onSelect: end }],
});

// ============================================================
// UNCLE FAROUK — the night guard (ghafir)
// ============================================================
scene('c1a_farouk', {
    speaker: 'Uncle Farouk',
    text: () => sflag('met_farouk')
        ? `Farouk lifts two fingers from his stick. "${PC.honor}."`
        : `An old guard on a plastic chair outside the booth, a shotgun older than you across his knees and a transistor radio on the ground. He doesn't get up.\n\n"Masa' el-kheir. You are the new doctor." It isn't a question.`,
    get choices() {
        const c = [];
        if (!sflag('farouk_car')) c.push({ text: '"The Rais says you saw a car, the night Miriam left."', nextScene: 'c1a_farouk_car' });
        if (sflag('farouk_car') && !sflag('farouk_bribed')) {
            if (gameState.inventory.includes('Mint Tea')) c.push({ text: 'Offer him a glass of Saber\'s mint tea.', onSelect: () => c1aFaroukBribe('tea') });
            c.push({ text: gameState.funds >= 500 ? '"For your trouble." (500 EGP)' : '"For your trouble." (you don\'t have 500 EGP)', onSelect: () => { if (gameState.funds < 500) { end(); return; } storyPay(-500, 'For Uncle Farouk'); c1aFaroukBribe('money'); } });
        }
        c.push({ text: '"Goodnight, Uncle."', onSelect: () => { sflag('met_farouk', true); end(); } });
        return c;
    },
});
scene('c1a_farouk_car', {
    speaker: 'Uncle Farouk',
    text: `He considers you a while.\n\n"A black Land Cruiser. Big. Came in without lights, left without lights. In the back seat, a woman sat like an old woman at a funeral — straight, hands in her lap. Doctor Miriam got in by herself. Nobody pushed."\n\n"And the other car. Also black. It comes at midnight. Twice this week. They walk around her tent with torches. They do not see me. Nobody sees the ghafir."`,
    choices: [{ text: '"Midnight."', onSelect: () => {
        sflag('farouk_car', true); sflag('met_farouk', true); sflag('warned_midnight', true);
        storyNote('Uncle Farouk', 'The night guard. The night Miriam left, a black Land Cruiser came without lights; a woman sat in the back "like an old woman at a funeral". Miriam got in by herself.\n\nANOTHER black car comes at MIDNIGHT and searches her tent with torches. (The fire lets you wait.)');
    }, nextScene: 'c1a_farouk' }],
});
function c1aFaroukBribe(how) {
    sflag('farouk_bribed', true);
    rel('farouk', 15);
    startDialogue(how === 'tea' ? 'c1a_farouk_tea' : 'c1a_farouk_money');
}
scene('c1a_farouk_tea', {
    speaker: 'Uncle Farouk',
    text: `He drinks it in three careful sips and nods at the foam. "Saber made this. No — you made this. Saber taught you." Something in his face settles.\n\n"The old gate on the causeway road. I have the key. If you ever need to go into the shaft at night and the gate is — difficult — you ask Farouk."`,
    choices: [{ text: '"I\'ll remember."', onSelect: () => { storyNote('Uncle Farouk', 'He has the key to the old causeway gate. "If you ever need to go into the shaft at night, ask Farouk."'); end(); } }],
});
scene('c1a_farouk_money', {
    speaker: 'Uncle Farouk',
    text: `The notes disappear into his galabeya without him appearing to move.\n\n"The old gate on the causeway road. I have the key. One day, maybe, you need it."`,
    choices: [{ text: '"Maybe."', onSelect: () => { storyNote('Uncle Farouk', 'He has the key to the old causeway gate, and now he owes you.'); end(); } }],
});

// ============================================================
// SABER — the tea boy (SQ-01A-03: The Tea Boy's Secret)
// ============================================================
scene('c1a_saber', {
    speaker: 'Saber',
    text: () => {
        const q = sflag('saber');
        if (q === 'told') return `"Did you look in the bin?" Saber whispers, delighted. "Did you?"`;
        if (q === 'poured') return `Saber inspects your glass against the lamp, very serious. Then he nods, once, like a judge.`;
        if (q === 'pour') return `"Well? Pour me a proper glass and I'll tell you. From high up. The foam is the whole point."`;
        return `A boy of maybe thirteen in an orange football shirt, tending the kettle like it's the most important job on the site — which, according to the men, it is.\n\n"Tea, doctor? Everyone has tea. Even the Swiss."`;
    },
    get choices() {
        const c = [];
        const q = sflag('saber');
        if (q === 'poured') return [{ text: '"Well? That was a proper glass."', nextScene: 'c1a_saber_told' }];
        if (!q) c.push({ text: '"You know everything that happens here, don\'t you?"', nextScene: 'c1a_saber_know' });
        if (q === 'pour') c.push({ text: 'Pour a glass. (minigame)', onSelect: () => { closeDialogue(); startPuzzle('ow_tea'); } });
        c.push({ text: '"Later, Saber."', onSelect: end });
        return c;
    },
});
scene('c1a_saber_know', {
    speaker: 'Saber',
    text: `He grins. "Everything. But I don't tell anybody who can't pour tea. That's the rule. The Rais made it."\n\nIt is very obviously not the Rais's rule.`,
    choices: [{ text: '"Fine. Show me the kettle."', onSelect: () => { sflag('saber', 'pour'); storyNote('Saber (side quest)', 'The tea boy knows something, but only tells people who can pour a proper glass of tea — high, with foam. The kettle is by the workers\' fire.'); end(); } }],
});
scene('c1a_saber_told', {
    speaker: 'Saber',
    text: `Saber looks both ways like a spy in a film.\n\n"The night after she left, Doctor Lindqvist burned papers. In the bin in the site office. At two in the morning! But the wind was blowing and he's a very bad fire-maker. Not everything burned."\n\n"I didn't touch it. I'm not stupid."`,
    choices: [{ text: '"You\'re not stupid at all." (The site office is by the dormitory.)', onSelect: () => { sflag('saber', 'told'); rel('saber', 10, true); storyNote('Saber (side quest)', 'Lindqvist burned papers in the site office bin the night after Miriam left. Not everything burned.'); end(); } }],
});
scene('c1a_tea', {
    speaker: 'System',
    text: () => `A blackened kettle on the brazier's edge, a tray of little glasses, a bunch of fresh mint. The workers pour from a height — the foam is the whole point.`,
    choices: [
        { text: 'Pour a glass. (minigame)', onSelect: () => { closeDialogue(); startPuzzle('ow_tea'); } },
        { text: 'Leave it.', onSelect: end },
    ],
});
(function wrapTea() {
    const _fin = mgTeaFinish;
    mgTeaFinish = function (kind) {
        _fin(kind);
        if (kind === 'perfect' && storyOn() && sflag('saber') === 'pour') {
            sflag('saber', 'poured');
            setTimeout(() => { if (typeof owToast === 'function') owToast('SABER IS WATCHING', 'He nods. Go and talk to him.'); }, 400);
        }
    };
})();
// ============================================================
// UNCLE HAMID — the supply line (SQ-01A-05: Supply Line Blues)
// ============================================================
scene('c1a_hamid', {
    speaker: 'Uncle Hamid',
    text: () => {
        const q = sflag('hamid');
        if (q === 'fixed') return `Uncle Hamid waves from the skip line, which is running beautifully and very loudly.`;
        if (q === 'open') return `"Any luck with the coupling pin? Sorted crates, by the dormitory. If the boys didn't sell it."`;
        return `A broad man in a flat cap, glaring at a line of rail skips that is not moving.\n\n"Doctor. The line is jammed. The coupling pin sheared on the third skip and we have no spare. No line, no spoil moved. No spoil moved, no dig. No dig —" he spreads his hands at the universe.`;
    },
    get choices() {
        const q = sflag('hamid');
        if (!q) return [{ text: '"Where would a spare be?"', onSelect: () => { sflag('hamid', 'open'); storyNote('Supply line (side quest)', 'Uncle Hamid\'s skip line is jammed: a sheared coupling pin. There might be a spare in the sorted crates by the dormitory.'); }, nextScene: 'c1a_hamid' }, { text: '"Good luck with it."', onSelect: end }];
        if (q === 'open' && gameState.inventory.includes('Coupling pin')) return [{ text: 'Hand him the coupling pin.', onSelect: () => {
            gameState.inventory.splice(gameState.inventory.indexOf('Coupling pin'), 1);
            sflag('hamid', 'fixed'); rel('workmen', 10); storyPay(1500, 'Supply line fixed');
            storyNote('Supply line (side quest)', 'Done. The line runs. Uncle Hamid paid you from the site\'s repair money and the workmen noticed.');
            startDialogue('c1a_hamid_fixed');
        } }, { text: 'Later.', onSelect: end }];
        return [{ text: 'Later.', onSelect: end }];
    },
});
scene('c1a_hamid_fixed', {
    speaker: 'Uncle Hamid',
    text: `He hammers it home in four blows, and the whole line lurches, groans, and starts to crawl. He slaps your shoulder hard enough to hurt.\n\n"Fifteen hundred from the repair money. Don't tell the Swiss."`,
    choices: [{ text: '"Tell them what?"', onSelect: end }],
});
scene('c1a_crates', {
    speaker: 'System',
    text: () => sflag('hamid') === 'open' && !sflag('pin_found')
        ? `Crates sorted by someone who cared: brushes, trowels, rope, a crate of rusted rail fittings. Under the fittings, greased and wrapped in newspaper: a coupling pin.`
        : `Crates sorted by someone who cared: brushes by size, trowels by wear, labels in Miriam's square capitals. SMALL FINDS BAGS. PHOTO SCALES. DO NOT SELL — THIS MEANS YOU, SABER.`,
    get choices() {
        if (sflag('hamid') === 'open' && !sflag('pin_found')) return [{ text: 'Take the coupling pin.', onSelect: () => { sflag('pin_found', true); pocket('Coupling pin'); if (typeof owToast === 'function') owToast('COUPLING PIN', 'Take it to Uncle Hamid at the supply line'); end(); } }];
        return [{ text: 'Leave them tidy.', onSelect: end }];
    },
});

// ============================================================
// THE TRENCHES
// ============================================================
scene('c1a_trenchA', {
    speaker: 'System',
    text: () => sflag('trenchA')
        ? `Trench A, open to the stars. You found what Miriam left here.`
        : `Trench A: a long cut in the gravel, re-opened recently and then roped off, the rope knotted the way a person knots things in a hurry. Miriam's survey stakes run along the lip — and one, halfway down, has been moved: the old hole is still there beside it.\n\n` +
          (sflag('payroll') === 'paid' || sflag('payroll') === 'confronted' ? `Two of the men have followed you over with picks and a lamp, uninvited. "The Rais said," one of them says.` :
           sflag('payroll') === 'delayed' ? `Nobody comes to help. You find a spare trowel.` : `The men are at the fire, waiting to hear about their wages. You could dig it yourself.`),
    get choices() {
        if (sflag('trenchA')) return [{ text: 'Leave it.', onSelect: end }];
        const help = sflag('payroll') === 'paid' || sflag('payroll') === 'confronted';
        return [
            { text: help ? 'Dig where the moved stake was. (with help — about 20 minutes)' : 'Dig where the moved stake was, yourself. (about 45 minutes)', onSelect: () => { clockAdvance(help ? 20 : 45); startDialogue('c1a_trenchA_find'); } },
            { text: 'Not now.', onSelect: end },
        ];
    },
});
scene('c1a_trenchA_find', {
    speaker: 'System',
    text: `A hand's depth down, where no season's work would ever put it: a zip-lock bag, folded twice. Inside, one page torn from a field notebook, in Miriam's quick square hand:\n\n"If you are reading this, you think like me — God help you.\n\nOsiris Shaft, level 3. The niche was behind the plaster. I have put it somewhere safer. The find store key is in B, under the red stake — Trench B spoil went to the old field by the village.\n\nThere is an older seal on the shaft approach. Owl, eye, serpent, lion. I opened it once. I closed it again. Don't.\n\n— M.H."`,
    choices: [{ text: 'Fold the page into your pocket.', onSelect: () => {
        sflag('trenchA', true); pocket("Miriam's notebook page");
        storyNote("Miriam's notebook page (Trench A)", '"Osiris Shaft, level 3. The niche was behind the plaster. I have put it somewhere safer. The find store key is in B, under the red stake — Trench B spoil went to the old field by the village.\n\nThere is an older seal on the shaft approach. Owl, eye, serpent, lion. I opened it once. I closed it again. Don\'t."');
        end();
    } }],
});
scene('c1a_digshed', {
    speaker: 'System',
    text: `A clipboard hanging on a nail in the dig shed, Miriam's daily record in square capitals, every day of the season. The last week the entries get shorter.\n\n"14th — TRENCH B BACKFILLED (M.H. ALONE). SPOIL TO OLD FIELD BY VILLAGE RUINS. RED STAKE."\n\n"15th — SHAFT L3. PLASTER."\n\n"16th —" and then nothing.`,
    choices: [{ text: 'Photograph the page.', onSelect: () => {
        sflag('trenchB_known', true);
        storyNote('Trench B', 'Miriam backfilled Trench B alone on the 14th and sent its spoil to the old spoil field by the village ruins (west, past the workers\' camp). There\'s a sieve there.');
        end();
    } }],
});
scene('c1a_trenchC', {
    speaker: 'System',
    text: () => `A red-painted survey stake, driven in hard, set apart from all the others. Scratched into the wood near the top, small and neat, are three letters that aren't English and aren't Arabic:\n\n    ⲡⲏⲓ\n\nCoptic — the last stage of the Egyptian language, written in Greek letters. You know enough to read it: "the house".\n\nFrom here, in the dark, the stake lines up exactly with the causeway and the Sphinx.`,
    choices: [{ text: 'Note it down.', onSelect: () => {
        if (!sflag('trenchC')) { sflag('trenchC', true); storyNote('Trench C — the red stake', 'Scratched on Miriam\'s red stake: ⲡⲏⲓ — Coptic for "the house". It lines up with the causeway and the Sphinx.'); }
        end();
    } }],
});
// the sieve at the old spoil field — Trench B's spoil hides the key
scene('c1a_sieve', {
    speaker: 'System',
    text: () => sflag('trenchB_known') && !sflag('mag_key')
        ? `The old spoil field. One heap is fresher than the rest, the sand still dark — Trench B's spoil, carted here on the 14th. A red stake leans out of the top of it.`
        : ((gameState.flags.ow_sieve_runs || 0) >= 3
            ? 'The heaps here are sifted to nothing. The finds tray is full of your work.'
            : 'A sieve frame on trestles beside the old spoil — cast-off earth, never properly sifted. The site buys anything you find for the register.\n\n(Heaps left: ' + (3 - (gameState.flags.ow_sieve_runs || 0)) + ')'),
    get choices() {
        const special = sflag('trenchB_known') && !sflag('mag_key');
        const c = [];
        if (special) c.push({ text: 'Sift the heap under the red stake. (minigame)', onSelect: () => { gameState.flags.c1a_sieve_key = true; if ((gameState.flags.ow_sieve_runs || 0) >= 3) gameState.flags.ow_sieve_runs = 2; closeDialogue(); startPuzzle('ow_sieve'); } });
        else if ((gameState.flags.ow_sieve_runs || 0) < 3) c.push({ text: 'Sift a heap. (minigame)', onSelect: () => { closeDialogue(); startPuzzle('ow_sieve'); } });
        c.push({ text: 'Not now.', onSelect: end });
        return c;
    },
});
(function wrapSieve() {
    const _enter = mgSieveEnter;
    mgSieveEnter = function () {
        _enter();
        if (!gameState.flags.c1a_sieve_key) return;
        const V = window.ch1Sieve;
        const mesh = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.45, 6, 12), new THREE.MeshStandardMaterial({ color: 0xb8903a, roughness: 0.35, metalness: 0.8 }));
        const shaft = new THREE.Mesh(gBox(4.2, 0.6, 0.8), mesh.material);
        shaft.position.x = 3.4; mesh.add(shaft);
        mesh.position.set(6, 1.5, 3);
        mesh.rotation.set(-Math.PI / 2, 0, 0.4);
        mesh.visible = false;
        V.frame.add(mesh);
        V.finds.push({ mesh, def: { kind: 'key', value: 0, name: 'Brass key tagged MAG' }, depth: 0.45, taken: false });
    };
    const _fin = mgSieveFinish;
    mgSieveFinish = function () {
        const S2 = MG.sieve;
        const got = S2 && S2.bagged.includes('Brass key tagged MAG');
        _fin();
        if (!gameState.flags.c1a_sieve_key) return;
        if (got) {
            gameState.flags.c1a_sieve_key = false;
            sflag('mag_key', true); pocket('Find-store key (MAG)');
            storyNote('The find-store key', 'A small brass key on a cardboard tag marked MAG — magazine, the find store. It was in Trench B\'s spoil, under Miriam\'s red stake. The find store is in the dig zone, next to the dig shed.');
            mgEl('mg-result-line').textContent = 'In the bottom of the sieve, green with earth: a small brass key on a cardboard tag. MAG — magazine. The find store.';
        } else {
            mgEl('mg-result-line').textContent += '  (Something glinted under the red stake. Sift it again.)';
        }
    };
})();

// ============================================================
// THE FIND STORE — where the Codex is
// ============================================================
scene('c1a_store', {
    speaker: 'System',
    text: () => sflag('codex') ? `The find store, its door pulled to. You've taken what Miriam hid here.`
        : sflag('mag_key')
            ? `The find store: a steel-doored magazine against the rock, padlocked, and across the hasp a Ministry seal — a strip of paper, a blob of red wax, the Ministry's stamp. The brass key is warm from your pocket.`
            : `The find store: a steel-doored magazine against the rock. A padlock, and across the hasp a Ministry seal of paper and red wax. Lindqvist says the key is lost.\n\nMiriam never lost anything in her life.`,
    get choices() {
        if (sflag('codex')) return [{ text: 'Leave it.', onSelect: end }];
        if (!sflag('mag_key')) return [{ text: 'Leave it.', onSelect: end }];
        return [
            { text: 'Slit the seal cleanly along the paper, so it can be closed again.', onSelect: () => { sflag('seal_clean', true); startDialogue('c1a_store_in'); } },
            { text: 'Break the seal. It\'s your site now.', onSelect: () => { sflag('seal_clean', false); startDialogue('c1a_store_in'); } },
            { text: 'Not yet.', onSelect: end },
        ];
    },
});
scene('c1a_store_in', {
    speaker: 'System',
    text: `Inside, it smells of dust and cardboard and old stone. Shelves of finds boxes to the ceiling, every one labelled in Miriam's square capitals, every one exactly where the register says it should be.\n\nExcept one. On the floor, in the corner, a crate that isn't on any shelf, marked in fresh pen: LATE PERIOD POTTERY — SHERDS.\n\nUnder the sherds, wrapped in a green scarf: something the size of a large book.`,
    choices: [{ text: 'Unwrap it.', nextScene: 'c1a_codex' }],
});
scene('c1a_codex', {
    speaker: 'System',
    text: `A book. Not a scroll — a book, a codex: leaves of papyrus folded and stitched into a quire, in a cover of dark leather with a long wrap-around flap and a thong to tie it shut. You have seen exactly this shape once, in a museum case in Cairo: the Nag Hammadi codices, buried in a jar in the fourth century.\n\nYou open the flap with one finger. The first page is Greek — a list, a careful hand. Beside certain lines, small marks that are not Greek at all. Hieroglyphs, or something that wants to be.\n\nTucked inside the cover, a note on modern paper:\n\n"Whoever finds this: don't give it to Vasse. Take it to Father Bishoy — Café El-Fishawy, Cairo, Thursday. — M."`,
    choices: [{ text: 'Wrap it back in the scarf.', onSelect: () => {
        sflag('codex', true); pocket('The Codex'); pocket("Miriam's note");
        storyNote('The Codex', 'A leather-bound papyrus codex, Late Antique — like the Nag Hammadi books. Greek, with hieroglyph-like marks beside some lines. Miriam hid it in the find store in a crate of "Late Period sherds".\n\nHer note: "Don\'t give it to Vasse. Take it to Father Bishoy — Café El-Fishawy, Cairo, Thursday."');
        if (sflag('seal_clean') && gameState.inventory.includes('Conservation wax')) startDialogue('c1a_store_reseal');
        else startDialogue('c1a_headlights');
    } }],
});
scene('c1a_store_reseal', {
    speaker: 'System',
    text: `On the way out you press Hana's wax into the slit seal and smooth it with your thumb. From two steps away, nobody would ever know the find store had been opened.`,
    choices: [{ text: 'Walk away from the store.', onSelect: () => { sflag('store_resealed', true); startDialogue('c1a_headlights'); } }],
});

// ============================================================
// THE SHAFT and PETAMUN'S SEAL (optional)
// ============================================================
scene('c1a_shaft', {
    speaker: 'System',
    text: () => !gameState.flags.scene3Triggered
        ? `The survey shaft, cut into the foot of the escarpment behind the dig fence. The dig gate is locked, and the Rais has the keys.`
        : `The survey shaft Miriam's team cut to reach the lower levels of the Osiris Shaft — the real one, dug under the causeway in the Late Period and cleared in 1999: three levels of rock-cut chambers going down toward the water table.\n\nA ladder, a rope, and the dark.`,
    get choices() {
        if (!gameState.flags.scene3Triggered) return [{ text: 'Leave it.', onSelect: end }];
        return [{ text: sflag('shaft_seen') ? 'Climb down to level 3 again.' : 'Climb down to level 3.', onSelect: () => { clockAdvance(15); startDialogue('c1a_shaft_l3'); } }, { text: 'Not now.', onSelect: end }];
    },
});
scene('c1a_shaft_l3', {
    speaker: 'System',
    text: `Level one: an empty chamber. Level two: stone sarcophagi in their niches, lids long gone. Level three: water, black and still, standing around a granite sarcophagus on a little island of rock, exactly as the photographs from 1999 show it.\n\nIn the back wall, a recess the size of a bread oven, freshly cut through old plaster. Empty. The plaster crumbs on the ledge are still sharp-edged — days old, not years.\n\nThis is where Miriam found it.\n\nThere is nothing else here. Whatever the "older seal" is, it isn't down here — it's on the approach, where the shaft was first cut.`,
    choices: [{ text: 'Climb back up.', onSelect: () => { if (!sflag('shaft_seen')) { sflag('shaft_seen', true); storyNote('The Osiris Shaft, level 3', 'The niche Miriam cut through the plaster is empty. The "older seal" from her note is up on the shaft approach.'); } end(); } }],
});
Object.assign(PUZZLES['puzzle_glyph_lock'], {
    title: 'THE OLD SEAL',
    hint: 'Four glyph stones around a core of dark amber. Wake it, then press the stones in order before the resonance fades.',
});
scene('puzzle_start_glyph_lock', {
    speaker: 'System',
    text: () => `Set into the rock of the shaft approach, half hidden by a timber brace: a ring of pale stone around a core of dark amber, and four glyph stones spaced around it like a compass. It is much older than the shaft.\n\nIn the stone above it, carved small, in Greek letters: ΠΕΤΑΜΟΥΝ.` +
        (sflag('trenchA') ? `\n\nMiriam's page: "Owl, eye, serpent, lion. I opened it once. I closed it again. Don't."` : `\n\nThere are old dart holes in the timber opposite. Whoever made this did not want it guessed.`),
    choices: [
        { text: 'Wake the seal. (puzzle)', onSelect: () => { if (gameState.flags.glyph_lock_solved) startDialogue('puzzle_glyph_already'); else startPuzzle('puzzle_glyph_lock'); } },
        { text: 'Leave it, as she asked.', onSelect: end },
    ],
});
scene('puzzle_glyph_already', { speaker: 'System', text: 'The seal stands open. The side passage behind it is empty now.', choices: [{ text: 'Leave it.', onSelect: end }] });
scene('puzzle_glyph_solved', {
    speaker: 'System',
    text: `The four stones flash gold in turn, and something deep in the rock — old stone moving on old stone — lets go.\n\nA slab beside the seal swings inward on a pivot: a passage, low and dry, three paces long. At the end, a niche Miriam cut open before you, empty — and below it, in the floor, a second, smaller niche she missed, still sealed with a disc of plaster.\n\nInside, on a bed of linen gone to dust: a bronze seal the size of your palm, green with age. Cut into its face, in Greek: ΠΕΤΑΜΟΥΝ — Petamun. And an ibis.`,
    choices: [{ text: 'Take the bronze seal.', onSelect: () => {
        gameState.flags.glyph_lock_solved = true; sflag('petamun_seal', true); pocket('Bronze seal of Petamun');
        storyNote('The bronze seal', 'Behind the old seal on the shaft approach, in a niche Miriam missed: a bronze seal with PETAMUN in Greek, and an ibis. Whoever Petamun was, he sealed the Osiris Shaft niche — and he knew Thoth\'s bird.');
        storyNotice('Something about this will matter.');
        end();
    } }],
});
scene('puzzle_glyph_fail', {
    speaker: 'System',
    text: `Wrong stone. The core flashes red and something hisses out of the rock — a cedar dart that buries itself in the timber brace an inch from your knee.\n\nThen, grinding, the four stones shift around the ring into new places. The seal remembers being touched wrongly. It's the order of the animals that matters, not where they sit.`,
    choices: [{ text: 'Step back and breathe.', onSelect: end }],
});

// ============================================================
// THE MIDNIGHT CAR (the staged event)
// ============================================================
function onClockPassed(before, after) {
    if (!storyOn() || currentMapKey !== 1 && !interiorState.active) return;
    const mid = 24 * 60;
    if (before < mid && after >= mid && sflag('met_rais') && !sflag('lena_event')) c1aLenaArrive();
}
function c1aLenaArrive() {
    if (sflag('codex') || sflag('lena_event')) return;
    sflag('lena_event', 'coming');
    gameState.flags.ministeryCar_called = true;
    if (typeof owToast === 'function') owToast('MIDNIGHT', sflag('warned_midnight') ? 'Headlights on the east road. Farouk was right.' : 'Headlights on the east road');
    if (typeof _tone === 'function') { _tone(70, 1.8, 'sawtooth', 0.02); _tone(92, 1.4, 'sine', 0.03); }
}
function c1aFrame() {
    if (!storyOn()) return;
    const ev = sflag('lena_event');
    if (ev === 'coming' && gameState.flags.ministeryCar_parked) {
        sflag('lena_event', 'searching');
        sflag('lena_until', S().clock + 90);
        if (typeof owToast === 'function') owToast('TORCHES AT YOUR TENT', 'Three people are searching Miriam\'s tent');
    }
    if (ev === 'searching' && S().clock >= (sflag('lena_until') || 1e9) && !gameState.isDialogueActive) c1aLenaLeave(true);
}
function c1aLenaLeave(missed) {
    sflag('lena_event', 'gone');
    if (missed) { sflag('lena_missed', true); storyNote('The midnight car', 'By the time you got back, they were gone. Miriam\'s tent has been gone through carefully by people who did this for a living.'); }
    ministeryCar.parked = false; ministeryCar.active = false;
    gameState.flags.ministeryCar_parked = false; gameState.flags.ministeryCar_called = false;
}
(function wrapFrame() {
    const _ow = owUpdateHud;
    owUpdateHud = function () { _ow(); c1aFrame(); };
})();
scene('c1a_lena', {
    speaker: 'System',
    text: `Three people with torches, working through Miriam's tent the way professionals do: quickly, quietly, putting everything back almost where it was. Two men in dark jackets. The one giving orders is a tall woman with cropped fair hair, who never raises her voice.\n\nNobody has seen you yet.`,
    choices: [
        { text: 'Stay in the shadows and listen.', nextScene: 'c1a_lena_listen' },
        { text: 'Photograph them from the dark.', nextScene: 'c1a_lena_photo' },
        { text: 'Step into the light. "Can I help you with something?"', nextScene: 'c1a_lena_confront' },
    ],
});
scene('c1a_lena_listen', {
    speaker: 'The Woman in Black',
    text: `"Nothing." German accent, flat and tired. "She moved it before she left. Of course she did."\n\nOne of the men says something about the new director.\n\n"Then we watch the new director. Mr. Vasse will want the deputy's phone records, and he'll want them tonight." A pause. "And stop touching her photographs. We're not animals."\n\nThey leave the way they came, torches off.`,
    choices: [{ text: 'Let out your breath.', onSelect: () => { sflag('lena_overheard', true); sflag('vasse_named', true); storyNote('The midnight car', 'A woman with a German accent and two men searched Miriam\'s tent at midnight. "She moved it before she left." They work for Mr. Vasse — and now they\'re going to watch the new director.'); c1aLenaLeave(false); end(); } }],
});
scene('c1a_lena_photo', {
    speaker: 'System',
    text: `You shoot without flash, bracing the phone on a tent pole, and get eleven frames: the woman's face half-lit by a torch, the two men, and — when they walk back to the car — the licence plate, clear as day. Diplomatic green.\n\nThey never know you were there.`,
    choices: [{ text: 'Check the photos are sharp.', onSelect: () => { sflag('lena_photos', true); pocket("Photos: the midnight visitors"); storyNote('The midnight car', 'You photographed the three people who searched Miriam\'s tent — the woman in charge, her two men, and the car\'s plate (diplomatic green). Evidence, if you ever need it.'); c1aLenaLeave(false); end(); } }],
});
scene('c1a_lena_confront', {
    speaker: 'The Woman in Black',
    text: () => `The torches swing onto you. The two men move apart, the way people move who expect trouble. The woman doesn't move at all.\n\n"${PC.doctor}." She knows your name. "Lena Brandt. Security, Vasse Foundation. The Foundation funds this site — we're recovering property belonging to our client."\n\nShe holds out a card between two fingers.`,
    choices: [
        { text: '"Get out of my camp."', onSelect: () => { rel('lena', 5, true); sflag('met_lena', true); }, nextScene: 'c1a_lena_out' },
        { text: '"What property?"', onSelect: () => sflag('met_lena', true), nextScene: 'c1a_lena_book' },
        { text: 'Take the card. Say nothing.', onSelect: () => { sflag('met_lena', true); pocket("Lena Brandt's card"); rel('lena', 3, true); }, nextScene: 'c1a_lena_out' },
    ],
});
scene('c1a_lena_book', {
    speaker: 'Lena Brandt',
    text: `"A book. Old. Leather." She says it like reading a shipping manifest. "Dr. Hale borrowed it from the Foundation's collection. If it turns up, Mr. Vasse pays very well for its return. Very well."\n\nShe puts the card in your shirt pocket herself, and pats it once.\n\n"Don't go looking for Dr. Hale, ${PC.doctor}. People who do this for a living are looking for her. You'll just be in the way."`,
    choices: [{ text: '"Goodnight, Ms. Brandt."', onSelect: () => { pocket("Lena Brandt's card"); sflag('vasse_named', true); storyNote('Lena Brandt', 'Security chief, Vasse Foundation. German. Searched Miriam\'s tent at midnight for "a book, old, leather" that Miriam supposedly "borrowed" from Vasse. Told you not to look for Miriam.'); c1aLenaLeave(false); end(); } }],
});
scene('c1a_lena_out', {
    speaker: 'Lena Brandt',
    text: `A thin smile — a professional appreciating another professional's nerve.\n\n"Of course. It's your camp." She nods to the men and the torches go off. At the edge of the lamplight she looks back. "Lock your tent, ${PC.doctor}."`,
    choices: [{ text: 'Watch them go.', onSelect: () => { storyNote('Lena Brandt', 'Security chief, Vasse Foundation. She and two men searched Miriam\'s tent at midnight. She knew your name.'); c1aLenaLeave(false); end(); } }],
});

// ============================================================
// THE WAY OUT — the exit choice (c1_exit)
// ============================================================
scene('c1a_headlights', {
    speaker: 'System',
    text: () => `You step out into the night with the Codex against your chest — and stop.\n\nHeadlights. On the plateau road, coming fast. Across the camp, the light is on in Lindqvist's trailer, and through the window you can see him on the phone, one hand over his eyes.\n\nHe called someone.` +
        (sflag('lena_event') === 'gone' || sflag('lena_event') === 'searching' ? '' : `\n\n(The black car Farouk talked about. Early.)`),
    choices: [
        { text: 'Out through the quarry field on foot, now, to the Cairo road. Nobody sees you go.', onSelect: () => c1aExit('quiet') },
        { text: 'Call the Ministry — ask for Dr. Amira Sayed, Miriam\'s friend. Make it official.', onSelect: () => c1aExit('legal') },
        { text: 'Walk out to meet the car. Lindqvist said the Foundation would "look after" you.', onSelect: () => c1aExit('deal') },
    ],
});
function c1aExit(kind) {
    S().c1_exit = kind;
    sflag('lena_event', 'gone');
    if (kind === 'legal') { rel('amira', 15); rep('ministry', 10); }
    if (kind === 'deal') { rep('vasse', 10); storyPay(5000, 'An "advance" from the Foundation'); }
    startDialogue('c1a_exit_' + kind);
}
scene('c1a_exit_quiet', {
    speaker: 'System',
    text: `You take nothing but your pack and the book. Past the dark dormitory, past the last lamp, out between the pale blocks of the old quarry where the ancient masons cut the pyramids' stone.\n\nBehind you, the headlights sweep the camp and stop at Miriam's tent.\n\nBy two in the morning you're on the Cairo road with your thumb out and the lights of Giza behind you. A truck full of watermelons stops. The driver asks no questions, which in Egypt is its own kind of kindness.\n\nNobody knows you have it.`,
    choices: [{ text: 'Ride to Cairo.', onSelect: () => c1aChapterEnd() }],
});
scene('c1a_exit_legal', {
    speaker: 'Dr. Amira Sayed',
    text: () => `She answers on the second ring, wide awake.\n\n"Sayed." You tell her. The silence afterwards is long enough to hear her breathing change.\n\n"Stay exactly where you are. Don't give it to anyone — especially not anyone from my own building. I'm coming myself. Forty minutes."\n\nShe makes it in thirty-one, in a dusty Hyundai, still in her house clothes. The headlights on the plateau road see her Ministry badge in their beams — and turn back.\n\nAmira looks at the Codex in the scarf for a long time without touching it. Then at you.\n\n"Miriam's scarf," she says. "Right. ${PC.doctor} — you're coming to Cairo."`,
    choices: [{ text: 'Get in the car.', onSelect: () => c1aChapterEnd() }],
});
scene('c1a_exit_deal', {
    speaker: 'System',
    text: `The car is a black Mercedes, not a Land Cruiser. The driver gets out and opens the back door for you like a hotel doorman.\n\n"Dr. Lindqvist said you might need a lift," he says, in perfect English. "The Foundation looks after its people." There's an envelope on the back seat with your name on it. Five thousand pounds, and a card: CONRAD VASSE — WITH COMPLIMENTS.\n\nThe Codex is at the bottom of your pack, under your dirty shirts. The driver doesn't ask about your pack.\n\nNot yet.`,
    choices: [{ text: 'Ride to Cairo.', onSelect: () => c1aChapterEnd() }],
});

// ============================================================
// CHAPTER END
// ============================================================
function c1aChapterEnd() {
    closeDialogue();
    sflag('ch1_complete', true);
    saveGame();
    const f = S().flags;
    const L = [];
    L.push({ quiet: 'You left on foot through the quarry. Nobody knows you have the Codex.',
             legal: 'You called Dr. Amira Sayed. The Ministry knows — and so will anyone in the Ministry who talks.',
             deal: 'You rode out in the Foundation\'s car, with the Codex under your shirts and Vasse\'s envelope in your pocket.' }[S().c1_exit]);
    L.push({ paid: 'You paid the men\'s wages yourself. Forty men and a foreman from Quft remember that.',
             confronted: 'You made Lindqvist pay the men with the Foundation\'s money. He told you he\'d say it was you.',
             delayed: 'You made the men wait for their wages. They dug nothing for you.' }[f.payroll] || 'The wages were never settled.');
    if (f.lena_overheard) L.push('You heard the woman in black say Vasse\'s name. She doesn\'t know you were there.');
    else if (f.lena_photos) L.push('You photographed the midnight visitors, and their car\'s plate.');
    else if (f.met_lena) L.push('You met Lena Brandt face to face. She knows who you are.');
    else if (f.lena_missed) L.push('You missed the midnight car. Whoever it was went through Miriam\'s tent.');
    if (f.farouk_bribed) L.push('Uncle Farouk owes you. He has the key to the old causeway gate.');
    if (f.petamun_seal) L.push('You opened the old seal and took the bronze seal of Petamun.');
    if (f.mina === 'done') L.push('You paid off Mina\'s debt. The Rais\'s family in Quft owe you.');
    if (f.saber === 'told' && gameState.inventory.includes('Half-burned papers')) L.push('You kept Lindqvist\'s half-burned Foundation papers.');
    if (f.store_resealed) L.push('You resealed the find store with Hana\'s wax. Nobody knows it was opened.');
    let el = document.getElementById('chapter-end');
    if (!el) { el = document.createElement('div'); el.id = 'chapter-end'; document.getElementById('game-container').appendChild(el); }
    el.innerHTML = `<div class="ce-box">
        <h1>END OF CHAPTER ONE</h1>
        <h3>THE GIZA DIG CAMP</h3>
        <ul>${L.map(x => `<li>${x}</li>`).join('')}</ul>
        <p class="ce-next">Thursday night, Café El-Fishawy, Cairo. Father Bishoy is waiting for someone who isn't coming.<br>Chapter Two — Cairo — is being built. Your choices are saved and will carry forward.</p>
        <div class="mg-buttons"><button id="ce-stay">KEEP EXPLORING THE CAMP</button><button id="ce-menu">RETURN TO TITLE</button></div>
    </div>`;
    el.classList.remove('hidden');
    if (document.pointerLockElement) document.exitPointerLock();
    gameState.isDialogueActive = true;   // freezes play under the card (the dialogue box itself stays hidden)
    document.getElementById('ce-stay').onclick = () => { el.classList.add('hidden'); gameState.isDialogueActive = false; };
    document.getElementById('ce-menu').onclick = () => {
        el.classList.add('hidden');
        gameState.isDialogueActive = false;
        saveGame(); resetGameState();
        menuPhase = 'FADEIN'; overlayAlpha = 1.0; gameState.isPaused = false; gameState.currentScreen = 'START_MENU';
    };
}

// ============================================================
// REST / WAIT
// ============================================================
function c1aWaitChoices(where) {
    const c = [];
    const s = S();
    c.push({ text: 'Rest a while. (an hour passes)', onSelect: () => { clockAdvance(60); gameState.stamina = gameState.maxStamina; updateHUD(); startDialogue('c1a_rested'); } });
    if (s.clock < 24 * 60 && sflag('met_rais') && !sflag('lena_event') && !sflag('codex')) c.push({ text: 'Wait until midnight.', onSelect: () => { clockAdvance(24 * 60 - s.clock + 1); gameState.stamina = gameState.maxStamina; updateHUD(); closeDialogue(); } });
    c.push({ text: 'Get up.', onSelect: end });
    return c;
}
scene('rest_brazier', {
    speaker: 'System',
    text: () => `The workers' fire. Somebody has left a plastic chair for you. The coals tick; the men talk about football and the price of onions. It is ${clockStr()}.`,
    get choices() { return c1aWaitChoices('fire'); },
});
scene('c1a_tent_cot', {
    speaker: 'System',
    text: () => `Miriam's camp bed, the blanket folded with military corners. It feels wrong to lie on it and you're too tired to care. It is ${clockStr()}.`,
    get choices() { return c1aWaitChoices('tent'); },
});
scene('c1a_rested', { speaker: 'System', text: () => `You close your eyes for what feels like a minute. It is ${clockStr()}.`, choices: [{ text: 'Get up.', onSelect: end }] });

// ============================================================
// THE DIG GATE
// ============================================================
scene('zone_dig_gate', {
    speaker: 'System',
    text: () => gameState.flags.scene3Triggered
        ? `The dig zone gate stands open. Beyond it, the switchback climbs to the dig shed, the find store and the shaft.`
        : `The dig zone gate: chain-link, a padlock, Miriam's handwriting on a laminated sign — ACTIVE EXCAVATION, AUTHORISED STAFF ONLY.\n\nThe Rais has the keys. The Rais, at the moment, has a problem with wages.`,
    choices: [{ text: 'Step back.', onSelect: end }],
});

// ============================================================
// INTERIORS
// ============================================================
Object.assign(storyData['door_tent'], { text: `Miriam's tent. Her name is still on the flap in marker: DR. M. HALE — DIRECTOR.` });
Object.assign(storyData['door_foreman'], { text: `The site office: a converted shipping container, somehow both hot and damp. The Rais and Lindqvist share it, badly.` });
Object.assign(storyData['door_dorm'], { text: `The workers' dormitory. Canvas walls, rows of cots, a television showing football with the sound off.` });

scene('c1a_tent_desk', {
    speaker: 'System',
    text: `Miriam's desk: a folding table, a laptop with its hard drive taken out (neatly, with the right screwdriver), a mug with a skin of four-day-old tea.\n\nUnder the mug, an invitation card: THE VASSE FOUNDATION REQUESTS THE PLEASURE — a gala at the Egyptian Museum, last spring. On the back, in her hand: "Never again."\n\nAn empty map case, the long kind. Whatever it held, it wasn't a map.`,
    choices: [{ text: 'Leave everything as it is.', onSelect: () => { if (!sflag('desk_seen')) { sflag('desk_seen', true); sflag('vasse_named', true); storyNote('Miriam\'s desk', 'Her laptop\'s hard drive has been taken out, neatly. A Vasse Foundation gala invitation with "Never again." written on the back.'); } end(); } }],
});
scene('c1a_tent_books', {
    speaker: 'System',
    text: `Her books, in a crate on its side: Gardiner's Egyptian Grammar, soft as cloth from use; a Coptic dictionary; Herodotus; and a thin blue volume of Demotic stories in translation, a bookmark halfway through.\n\nThe bookmarked story is about a prince called Setne, who went into an old tomb at Memphis to steal a magic book, and what it cost him.\n\nIn the margin, in pencil: "Coptos. The river. Why always the river?"`,
    choices: [{ text: 'Put it back.', onSelect: () => { if (!sflag('books_seen')) { sflag('books_seen', true); storyNote('Miriam\'s books', 'Bookmarked: the ancient story of Prince Setne, who stole a magic book from a tomb at Memphis and paid for it. Her pencil note: "Coptos. The river. Why always the river?"'); } end(); } }],
});
scene('c1a_tent_photos', {
    speaker: 'System',
    text: `Photographs pinned to the tent wall. Miriam — sun-burned, laughing, a scar across the back of one hand — at a dozen digs. Miriam and a sharp-eyed Egyptian woman her own age, arms around each other outside the Egyptian Museum; on the back, "Amira & me — still the only two who read the footnotes."\n\nAnd one of the Rais, twenty years younger, holding up a small statue and grinning like a boy.`,
    choices: [{ text: 'Leave them.', onSelect: () => { if (!sflag('photos_seen')) { sflag('photos_seen', true); storyNote('Photographs', 'Miriam\'s closest friend: Dr. Amira Sayed, of the Ministry — "the only two who read the footnotes".'); } end(); } }],
});
scene('c1a_dorm_worker', {
    speaker: 'Gamal',
    text: () => {
        const p = sflag('payroll');
        if (p === 'paid') return `Gamal, on the night shift, sits up on his cot. "Doctor. Thank you for the money. Doctor Miriam did the same. From her own pocket. You are two of a kind." He lies down again. "Ask the Rais about his son. He will not ask you."`;
        if (p === 'confronted') return `Gamal, on the night shift, props himself up. "They say you made the Swede pay. Good." He grins. "Ask the Rais about his son, Mina. He will not ask you himself."`;
        if (p === 'delayed') return `Gamal, on the night shift, looks at you and turns over to face the canvas.`;
        return `Gamal, on the night shift, opens one eye. "The new doctor. Are we being paid, doctor?"`;
    },
    choices: [{ text: 'Leave him to sleep.', onSelect: end }],
});
scene('c1a_dorm_charm', { speaker: 'System', text: `A blue glass eye hung from a cot frame against envy, and a photograph of a baby tucked behind it. Somebody's whole reason for being here.`, choices: [{ text: 'Leave it.', onSelect: end }] });
scene('c1a_dorm_tally', {
    speaker: 'System',
    text: () => `Chalk marks on a tent pole, in groups of five: the days since the men were last paid.` + (sflag('payroll') && sflag('payroll') !== 'delayed' && sflag('payroll') !== 'confront_pending' ? ` Somebody has rubbed them all out, and drawn a smiling face.` : ` Eleven.`),
    choices: [{ text: 'Leave it.', onSelect: end }],
});
scene('c1a_office_desk', {
    speaker: 'System',
    text: `The site office desk: permits, the Ministry inspector's sign-in book, a tin of pens, and a laminated contact list. Under "EMERGENCY", in Miriam's hand: RAIS ABDALLAH. Under that, crossed out: P. LINDQVIST.`,
    choices: [{ text: 'Leave it.', onSelect: end }],
});
scene('c1a_office_ledger', {
    speaker: 'System',
    text: `The payroll ledger. Every page since spring shows the same line: TRANSFER — VASSE FDN, GENEVA. The university's name stops appearing in April.\n\nThe last transfer came in the day before Miriam left. Nothing since.`,
    choices: [{ text: 'Close it.', onSelect: () => { if (!sflag('ledger_seen')) { sflag('ledger_seen', true); sflag('vasse_named', true); storyNote('The payroll ledger', 'Since April the Vasse Foundation has paid for the whole season. The transfers stopped the day Miriam left.'); } end(); } }],
});
scene('c1a_office_bin', {
    speaker: 'System',
    text: () => sflag('saber') === 'told' && !gameState.inventory.includes('Half-burned papers')
        ? `The burn bin behind the desk, a steel drum with a grille. Most of it is ash. But the bottom of the drum was wet, and the fire didn't reach it: a wad of papers, brown at the edges.\n\nBank transfer slips from the Vasse Foundation. An email printout: "...security team will attend site to recover the item. Dr. Hale's cooperation is no longer required..." And a page of phone numbers with a Geneva code.`
        : `A steel drum with a grille, full of ash. It smells of burned paper.`,
    get choices() {
        if (sflag('saber') === 'told' && !gameState.inventory.includes('Half-burned papers')) return [{ text: 'Take the papers.', onSelect: () => {
            pocket('Half-burned papers'); sflag('lindqvist_papers', true);
            storyNote('Saber (side quest)', 'Done. From Lindqvist\'s burn bin: Vasse Foundation transfer slips, and an email — "security team will attend site to recover the item. Dr. Hale\'s cooperation is no longer required." Proof, one day, for someone who wants proof.');
            storyNotice('Someone, someday, will want to see these.');
            end();
        } }];
        return [{ text: 'Leave it.', onSelect: end }];
    },
});
scene('c1a_office_cork', {
    speaker: 'System',
    text: `The corkboard: the season plan in coloured pins, a tide table for the Nile nobody needs any more, and a site photograph with every trench outlined. Someone — Miriam — has drawn a small circle in red pen on the causeway, well outside the site boundary, over the Osiris Shaft.`,
    choices: [{ text: 'Leave it.', onSelect: end }],
});

// ============================================================
// THE CAMP — every other place gets new words
// ============================================================
const FLAV = {
    flavor_sand: `A dune that sings when the wind comes over it — a low hum you feel in your teeth. The workmen call it "the old man clearing his throat".`,
    flavor_stars: `No city in the sky out here, only in the east where Cairo glows orange. The rest is stars, more than you've seen since you were a child, and the pale smudge of the Milky Way standing on the pyramids.`,
    flavor_ruins_fragment: `An old limestone wall, a single course of blocks, dressed square with copper tools four and a half thousand years ago. There are still masons' marks on one face: a gang's name, in red ochre, like graffiti. "Friends of Khufu".`,
    flavor_boulder: `A limestone boulder the size of a car, one face cut flat and abandoned mid-job. You can see where the quarrymen drove their wedges, and gave up.`,
    flavor_cactus: `A lone date palm, hundreds of metres from any water you can see. Its roots know something you don't.`,
    flavor_cooking_table: `The cooking table: a gas ring, a vast pot of lentils, a crate of tomatoes, a stack of bread wrapped in cloth. Nobody on this site goes hungry. The cook waves a ladle at you like a threat and a promise.`,
    flavor_spoil_mound: `A spoil mound from the dig — the earth that has already been through the sieve, waiting to be put back when the season ends.`,
    flavor_ministry_post: `An old Ministry of Antiquities post, a concrete hut with one window, abandoned when the new visitors' centre was built. Farouk keeps his spare galabeya in it.`,
    flavor_fuel_drums: `Diesel drums for the generator, each one painted with a number and each number written in the fuel log. Miriam counted everything.`,
    flavor_guard_booth: `The guard booth: a chair, a transistor radio, a thermos, a Qur'an with a cloth cover, and a view of every road onto the site. Uncle Farouk's kingdom.`,
    flavor_scaffolding: `Scaffolding along the trench wall, for photographing the section. Somebody has hung a lamp on it and a pair of socks.`,
    flavor_site_trailer: `Lindqvist's trailer: an air conditioner rattling in the window, a Swedish flag sticker, and a stack of unopened Ministry letters on the step.`,
    flavor_palm_tree: `A young date palm by the director's tent, watered daily — the ground around it is still damp. The Rais says Miriam planted it her first season, twenty years ago. "It is older than my son," he says. "And better behaved."`,
    flavor_gate_post: `The camp gate on the south road, a painted post and a chain. Beyond it, the road runs to the Cairo ring road. That way is out.`,
    flavor_water: `Water barrels, blue plastic, each with a tin cup on a string. Two workmen stop talking when you come close, then start again in a lower voice about their wages.`,
};
for (const [k, text] of Object.entries(FLAV)) scene(k, { speaker: 'System', text, choices: [{ text: 'Move on.', onSelect: end }] });
scene('c1a_generator', { speaker: 'System', text: `The site generator, thudding away inside a cage of chain-link, feeding the work lamps. The fuel log on its door is in Miriam's hand until four days ago, then in nobody's.`, choices: [{ text: 'Move on.', onSelect: end }] });
scene('c1a_perimeter', { speaker: 'System', text: `The site edge, where the camp gives way to the old quarry field: pale limestone blocks the masons cut and never took, lying where they fell four thousand years ago. A path winds through them toward the Cairo road. On foot, in the dark, nobody would see you go.`, choices: [{ text: 'Remember the path.', onSelect: end }] });
scene('fun_dog', { speaker: 'System', text: `The camp dog: sandy, one ear up, one ear down, and the air of an animal that has decided who the real director is. She leans her whole weight against your leg.`, choices: [{ text: 'Scratch behind the down ear.', onSelect: end }] });
scene('fun_radio', { speaker: 'System', text: `A battered shortwave radio. Umm Kulthum, live from 1967, singing the same line for the ninth time while an audience in Cairo loses its mind. Nobody would dream of changing the station.`, choices: [{ text: 'Listen a while.', onSelect: end }] });

// SQ-01A-07 — Darts Night
scene('fun_dartboard', {
    speaker: 'System',
    text: () => sflag('darts_won')
        ? `The dartboard on the dormitory post. Your name is chalked on the plank now, above the Rais's 132. Somebody has drawn a crown on it.`
        : `A dartboard nailed to the dormitory post, and a plank with the camp record chalked on it: RAIS — 132. The Rais will tell you about it whether you ask or not.\n\nThe men run a tournament on Wednesday nights. It is Wednesday night.`,
    get choices() {
        const c = [];
        if (!sflag('darts_won')) c.push({ text: gameState.funds >= 200 ? 'Enter the tournament. (200 EGP stake — beat 132 to win)' : 'Enter the tournament. (you need 200 EGP)', onSelect: () => {
            if (gameState.funds < 200) { end(); return; }
            storyPay(-200, 'Tournament stake'); sflag('darts_tourney', true); closeDialogue(); startPuzzle('minigame_darts');
        } });
        c.push({ text: 'Throw a few for fun.', onSelect: () => { sflag('darts_tourney', false); closeDialogue(); startPuzzle('minigame_darts'); } });
        c.push({ text: 'Leave it.', onSelect: end });
        return c;
    },
});
PUZZLES['minigame_darts'].samBest = 132;
(function wrapDarts() {
    const _show = mgDartsShowResult;
    mgDartsShowResult = function () {
        _show();
        const p = MG.puzzle;
        if (!p || !storyOn() || !sflag('darts_tourney')) return;
        sflag('darts_tourney', false);
        if (p.score >= 132) {
            sflag('darts_won', true);
            rel('abdallah', 5, true); rel('workmen', 10, true);
            storyPay(2000, 'Tournament winnings');
            storyNote('Darts night (side quest)', 'You beat the Rais\'s 132. The men call you "Abu Ramy" now — the father of throwing. Nobody will explain the joke.' + (sflag('mina') === 'open' ? '\n\nThe stable owner who holds Mina\'s debt bet against you. The Rais might want to hear about that.' : ''));
            mgEl('mg-result-line').textContent = 'The Rais\'s chalk number falls. From the fire, a roar — and 2,000 pounds in crumpled notes. They\'re calling you "Abu Ramy" now.';
        } else {
            mgEl('mg-result-line').textContent += '  (The tournament goes on without you. Beat 132 to win.)';
        }
    };
})();

// ============================================================
// OPEN WORLD — new words for the old places
// ============================================================
storyData['ow_ruins'].speaker = 'System';
storyData['ow_detector'] = {
    speaker: 'System',
    text: `A metal detector leaning on a crate, tape round the handle, "M.H." scratched into the housing. Miriam's. The battery light still comes on.\n\nWith it in your hands you'll hear a tick that quickens near anything buried — and Miriam, the Rais says, buried things.`,
    choices: [{ text: 'Take it.', onSelect: () => { if (bpAdd('metal_detector')) { gameState.flags.ow_detector = true; owReward({}); owToast('METAL DETECTOR', 'In your pack · press G to hold it'); } closeDialogue(); } },
              { text: 'Leave it.', onSelect: () => closeDialogue() }],
};
BP_ITEMS.metal_detector.desc = "Miriam's detector — tape on the handle, M.H. scratched in the housing. Hold it (G) and it ticks faster near anything buried.";
// SQ-01A-06 — Miriam's emergency caches (some of the buried things are hers)
OW.caches[0].text = 'A biscuit tin wrapped in orange survey tape — Miriam\'s tape. Inside, folded tight in plastic: 1,200 EGP and a note: "EMERGENCY. PUT IT BACK IF YOU DON\'T NEED IT. — M." You need it.';
OW.caches[0].reward = { funds: 1200 };
OW.caches[6].text = 'A lost multitool with "HAMID" scratched in the grip. Uncle Hamid will pay 50 EGP to have it back — or just be happy.';
OW.caches[8].text = 'Orange survey tape again — Miriam\'s. A leather case, and in it a pair of brass-bound field glasses and a note: "For watching the road." The lenses are clean.\n\n(Hold them with G, look with the right mouse button.)';
OW.caches[5].text = 'Under a flat stone, orange tape: a spare phone, charged and switched off, with one number saved. Miriam\'s emergency kit. The number is "A.S." You don\'t call it — yet. There\'s 150 EGP in the case too.';
OW.caches[3].text = 'A brass belt buckle and a coil of copper wire. The camp buys scrap: 60 EGP.';
OW.caches[10].text = 'Orange tape: a tin of dates packed in their own sugar, and a rucksack folded into its own lid — Miriam\'s old field pack, bigger than yours.\n\n(Backpack space: 16.)';
OW.caches[10].reward = { bp: 'dates', qty: 4, rucksack: true };
OW.caches.forEach((c, i) => { if (storyData['ow_cache' + i]) storyData['ow_cache' + i].text = 'The detector shrieks. You dig with your hands.\n\n' + c.text; });
(function wrapReward() {
    const _r = owReward;
    owReward = function (r) {
        if (r && r.rucksack) { const b = bpState(); b.capacity = Math.max(b.capacity || BP_CAPACITY_BASE, 16); if (typeof bpRefresh === 'function') bpRefresh(); }
        if (r && r.sanity) r = Object.assign({}, r, { sanity: 0 });  // the new story has no sanity meter
        return _r(r);
    };
})();
storyData['ow_sherds_all'].text = 'Eight sherds. Laid out on your field table they fit — not one pot, but one hand: the same black flick, the same curve. Together the flicks become a bird: a long curved beak, one leg raised. An ibis. Somebody on this plateau spent a lifetime painting Thoth\'s bird.\n\nThe register pays a bounty for a set. (+250 EGP)';
// SQ-01A-04 — The Truck of 1926
storyData['ow_wreck'].text = 'An expedition truck from the 1920s, buried to the doors, the paint sandblasted back to bare metal. You can just read the stencil on the tailgate: HARVARD–BOSTON EXPEDITION, 1926.';
storyData['ow_wreck_found'].text = 'Maps of a Cairo that no longer exists, 40 EGP in coins someone lost later — and a diary in a tin box, the pages foxed but readable. The last entry, 1926: "Saw the old woman again at the causeway tonight, sitting with a lamp by the shaft as if she were waiting for someone. The workmen will not go near her. They call her one of the Keepers."';
(function wrapWreck() {
    const def = storyData['ow_wreck'];
    const c0 = def.choices[0], on = c0.onSelect;
    c0.onSelect = () => { const first = !gameState.flags.ow_wreck_glovebox; on(); if (first) storyNote('The truck of 1926 (side quest)', 'A 1926 expedition diary: an old woman with a lamp sitting by the shaft at night, "as if she were waiting for someone". The workmen called her one of the Keepers.'); };
})();

// ============================================================
// NOTES (J)
// ============================================================
function storyJournalToggle(force) {
    let el = document.getElementById('story-journal');
    if (!el) { el = document.createElement('div'); el.id = 'story-journal'; el.className = 'hidden'; document.getElementById('game-container').appendChild(el); }
    const open = force !== undefined ? force : el.classList.contains('hidden');
    if (!open) { el.classList.add('hidden'); return; }
    const s = S();
    const people = Object.keys(REL_NAMES).filter(k => s.rel[k] !== undefined || (k === 'abdallah' && sflag('met_rais')) || (k === 'lindqvist' && sflag('met_lindqvist')) || (k === 'hana' && sflag('met_hana')) || (k === 'farouk' && sflag('met_farouk')) || (k === 'lena' && sflag('met_lena')));
    const notes = s.journal.slice().reverse();
    el.innerHTML = `<h2>NOTES</h2><div style="font-size:11px;letter-spacing:0.2em;color:#8f8060">${s.name.toUpperCase()} · ${clockStr()} · ${gameState.funds.toLocaleString()} EGP</div>
        <h4>PEOPLE</h4><div class="sj-people">${people.map(k => `<div><span>${REL_NAMES[k]}</span><em>${relTier(relGet(k)).toUpperCase()}</em></div>`).join('') || '<div><span>Nobody yet</span></div>'}</div>
        <h4>WHAT YOU KNOW</h4>${notes.map(n => `<div class="sj-note"><b>${n.title}</b><span>${n.text}</span></div>`).join('')}
        <div class="sj-close">J OR ESC TO CLOSE</div>`;
    el.classList.remove('hidden');
    if (document.pointerLockElement) document.exitPointerLock();
}
window.addEventListener('keydown', e => {
    if (!storyOn() || gameState.currentScreen !== 'GAME') return;
    const el = document.getElementById('story-journal');
    const open = el && !el.classList.contains('hidden');
    if (e.code === 'KeyJ' && !gameState.isDialogueActive && !activePuzzle) { e.preventDefault(); storyJournalToggle(); }
    else if (e.key === 'Escape' && open) { e.preventDefault(); e.stopImmediatePropagation(); storyJournalToggle(false); }
}, true);
