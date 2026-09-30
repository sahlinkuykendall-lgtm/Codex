// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-A SCENES (poke/ch1_scenes.js)
// The Archaeologist's night at the Giza dig camp
// (story/regions/ch01_opening_archaeologist.md), ported from the 3D build's
// ch1a_story.js: the same scenes, words and choices, with the 3D calls
// swapped for the poke engine (poke/story.js).
//   gameState.funds          → money() / storyPay()
//   gameState.inventory      → hasItem() / pocket() / dropItem()
//   bpFind('sherd').qty      → Game.bag['Painted sherd']
//   interactScene on objects → STORY_SCRIPTS[id]
// ============================================================

const R = () => 'Rais Abdallah';

// ---- canon fixes to the 3D export (map_ch1.js is generated, so they're made here) ----
// The old story's Sam Okafor is retired (story/00_MASTER_BIBLE.md §11): the half-buried level is Miriam's.
(function () {
    const o = POKE_MAP.objects.find(q => q.id === 'sams_gear');
    if (o) { o.label = "Miriam's Level"; o.say = ['System', 'A brass surveyor\'s level on a snapped tripod, half-buried where the wind has drifted sand over it. "M.H." is scratched into the brass. Miriam\'s.\n\nFour days in the sand, and nobody has picked it up. On this site, nobody touches the Doctor\'s things.']; }
})();

// things that happen when you walk into a room
function storyOnEnter(room) {
    if (room === 'INT_TENT') taskDone('tent');
}

// ============================================================
// ARRIVAL (beat 1): the Rais meets you at the gate with a lantern
// ============================================================
scene('scene1_start', {
    speaker: 'System',
    text: () => `Half past eight at night. The taxi from Cairo drops you at the camp gate and is gone before the dust settles.\n\nTo the east, the pyramids stand against the city glow, bigger than photographs ever let them be. Around you: tents, work lamps, the smell of a charcoal fire and diesel. Somewhere a radio is playing Umm Kulthum.\n\nAn old man in a white galabeya is waiting at the gate with a lantern, as if he has been standing there for four days.`,
    choices: [{ text: 'Walk up to him.', nextScene: 'c1a_arr1' }],
});
scene('c1a_arr1', {
    speaker: R,
    text: () => `"${PC.doctor}? Ahlan wa sahlan. Welcome. I am Abdallah, the rais, the foreman. Twenty-six seasons at Giza. My father before me, and his father, from Quft."\n\nHe looks at you for a long moment, the lantern steady.\n\n"Before anybody tells you anything else, I will tell you one thing. Doctor Miriam did not leave for family reasons."`,
    choices: [
        { text: '"What makes you so sure?"', onSelect: () => rel('abdallah', 5, true), nextScene: 'c1a_arr_why' },
        { text: '"Family reasons is what the Ministry told me."', nextScene: 'c1a_arr_why' },
        { text: '"It\'s late. Can this wait until the morning?"', onSelect: () => rel('abdallah', -5, true), nextScene: 'c1a_arr_late' },
    ],
});
scene('c1a_arr_late', {
    speaker: R,
    text: `"It has waited four days." He doesn't move. "One more minute will not kill it."`,
    choices: [{ text: '"Go on, then."', nextScene: 'c1a_arr_why' }],
});
scene('c1a_arr_why', {
    speaker: R,
    text: `"She left her tea on the table and her boots by the door. Twenty years I know her. She does not go anywhere without her boots."\n\n"Doctor Lindqvist, the deputy, he will tell you about family. Hana will tell you about the finds. I will tell you the truth, when you ask me for it."\n\nHe lowers the lantern. "Also: the men are owed eleven days of wages."`,
    choices: [
        { text: '"Eleven days? Why?"', nextScene: 'c1a_arr_wages' },
        { text: '"Where do I sleep?"', nextScene: 'c1a_arr_tent' },
    ],
});
scene('c1a_arr_wages', {
    speaker: R,
    text: `"Doctor Lindqvist says Friday. He said Friday last Friday." A shrug with forty men in it. "They are good men. They will not leave. But they will not dig for promises either. Come to the fire when you have seen your tent. We will talk about it."`,
    choices: [{ text: '"I will."', onSelect: () => rel('abdallah', 3, true), nextScene: 'c1a_arr_tent' }],
});
scene('c1a_arr_tent', {
    speaker: R,
    text: () => `"You sleep in the director's tent, the big one behind me. Her things are still inside. Nobody has touched them. I made sure."\n\nHe turns toward the fire, then stops.\n\n"One more thing, ${PC.honor}. At night, if you hear a car on the east road, do not go and say hello."`,
    choices: [{ text: 'Watch him walk back to the fire.', onSelect: () => {
        sflag('met_rais', true);
        storyNote('Rais Abdallah', 'The foreman. From Quft, like his father and grandfather. Says Miriam "did not leave for family reasons": she left her boots. The men are owed eleven days of wages. He\'ll talk at the workers\' fire.');
        storyNote('Chapter 1: The Giza Dig Camp', 'You have been hired to take over the Giza Western Field Survey. Its director, Dr. Miriam Hale, "left for family reasons" four days ago.');
        Story.s.tasks.push(
            { id: 'tent', text: 'Look around Miriam\'s tent (just north of the gate).', done: false },
            { id: 'lindqvist', text: 'Meet Dr. Lindqvist, the deputy, at the site trailer (east).', done: false },
            { id: 'hana', text: 'Meet Hana, the conservator (by the director\'s tent).', done: false },
            { id: 'wages', text: 'Talk to the Rais about the wages at the workers\' fire (west).', done: false });
        storyNotice('New tasks: see TASKS in the menu (Esc).');
        Game.raisLeaves();
    } }],
});

// ============================================================
// HANA — the conservator (and SQ-01A-02: Hana's Conservation)
// ============================================================
STORY_SCRIPTS.c1a_hana = 'c1a_hana';
function c1aMetHana() { if (!sflag('met_hana')) { sflag('met_hana', true); taskDone('hana'); } }
scene('c1a_hana', {
    speaker: 'Hana',
    text: () => sflag('met_hana')
        ? `Hana looks up from a tray of pot sherds under a lamp. "${PC.doctor}."`
        : `A young woman at a folding table under a work lamp, gluing a pot back together with the patience of a surgeon. She doesn't stop.\n\n"You're the replacement." A beat. "Sorry. That sounded... I'm Hana. Conservation. I was Miriam's student, before I was her staff. I'm not being very professional this week."`,
    get choices() {
        const c = [];
        if (!sflag('hana_miriam')) c.push({ text: '"What was Miriam like, the last week?"', nextScene: 'c1a_hana_miriam' });
        if (!sflag('hana_q')) c.push({ text: '"Is there anything I can do for you?"', nextScene: 'c1a_hana_q' });
        else if (sflag('hana_q') === 'open') {
            const n = Game.bag['Painted sherd'] || 0;
            c.push({ text: n >= 3 ? 'Give her three painted sherds.' : '"Still looking for your sherds." (you have ' + n + ' of 3)', onSelect: () => {
                if (!hasItem('Painted sherd', 3)) return;
                dropItem('Painted sherd', 3);
                sflag('hana_q', 'done'); sflag('hana_valuation', true); rel('hana', 15); taskDone('hana_sherds');
                storyNote('Hana\'s conservation (side quest)', 'Done. Hana joined the sherds: one potter, one ibis. She gave you a stick of conservation wax, "for anything you need to close again without anyone knowing."');
                startDialogue('c1a_hana_done');
            } });
        }
        if (sflag('injured')) c.push({ text: '"Hana, have you got a first-aid kit?"', nextScene: 'c1a_hana_aid' });
        if (hasItem('Faience amulet (Eye of Horus)')) c.push({ text: 'Show her the Eye of Horus from the looters\' pit.', nextScene: 'c1a_hana_amulet' });
        c.push({ text: '"Goodnight, Hana."', onSelect: c1aMetHana });
        return c;
    },
});
scene('c1a_hana_miriam', {
    speaker: 'Hana',
    text: `She finally puts the glue down.\n\n"Scared. Miriam's never scared. She stopped sleeping. She kept saying 'it isn't ours to keep', about what, she wouldn't say."\n\n"The night she left, I saw her go into the find store with something wrapped in her scarf. The green one. She came out without it. Then the car came, and in the morning she was gone."`,
    choices: [{ text: '"The find store is locked. Lindqvist says the key is lost."', onSelect: () => { sflag('hana_miriam', true); c1aMetHana(); storyNote('Hana', 'Miriam\'s student. The night Miriam left, Hana saw her take something wrapped in her green scarf INTO the find store, and come out without it.'); }, nextScene: 'c1a_hana_key' }],
});
scene('c1a_hana_key', {
    speaker: 'Hana',
    text: `"Lost." Hana smiles for the first time. "Miriam never lost anything in her life. If the key's gone, she put it somewhere. She'd put it in the ground. That's the only place she trusted."`,
    choices: [{ text: '"In the ground."' }],
});
scene('c1a_hana_q', {
    speaker: 'Hana',
    text: `"Actually, yes. Somebody on this site painted pots with the same black flick for a whole village's worth of jars. The pieces are scattered all over the camp; the wind turns them up. Bring me three and I can show you something."`,
    choices: [{ text: '"I\'ll keep my eyes open."', onSelect: () => {
        sflag('hana_q', 'open'); c1aMetHana();
        storyNote('Hana\'s conservation (side quest)', 'Bring Hana three painted sherds. They glint in the sand.');
        task('hana_sherds', 'Bring Hana three painted sherds (they glint in the sand).');
    } }],
});
scene('c1a_hana_done', {
    speaker: 'Hana',
    text: `She fits them edge to edge under the lamp, and the black flicks become a line, and the line becomes a bird: long curved beak, one leg raised. An ibis.\n\n"Thoth's bird. Ptolemaic, I think. Pretty." She presses a stick of dark wax into your hand. "Conservation wax. For anything you need to close again without anyone knowing." She doesn't explain, and you don't ask.`,
    choices: [{ text: 'Pocket the wax.', onSelect: () => pocket('Conservation wax') }],
});

// ============================================================
// THE NIGHT (step 2): rest / wait, and what happens at set times
// ============================================================
STORY_SCRIPTS.rest_brazier = 'rest_brazier';
STORY_SCRIPTS.tent_cot = 'c1a_tent_cot';
function c1aWaitChoices() {
    const c = [], s = Story.s, done = sflag('ch1_complete');
    if (done || s.clock < CLOCK_END) c.push({ text: 'Rest a while. (an hour passes)', onSelect: () => c1aRest(60, 'c1a_rested') });
    if (s.clock < 24 * 60 && sflag('met_rais') && !sflag('lena_event') && !sflag('codex')) c.push({ text: 'Wait until midnight.', onSelect: () => c1aRest(24 * 60 - s.clock + 1) });
    c.push({ text: 'Get up.' });
    return c;
}
// the screen goes dark, the clock jumps, the screen comes back
function c1aRest(mins, then) { Game.fadeTo(() => { clockAdvance(mins); healInjury('rest took the worst of it'); if (Game.set.time === 5) Game.hour = storyHour(); if (then) startDialogue(then); }); }
scene('rest_brazier', {
    speaker: 'System',
    text: () => `The workers' fire. Somebody has left a plastic chair for you. The coals tick; the men talk about football and the price of onions. It is ${clockStr()}.` +
        (Story.s.clock >= CLOCK_END && !sflag('ch1_complete') ? `\n\nThe sky over the Nile is going grey. There's no more night left to wait out.` : ''),
    get choices() { return c1aWaitChoices(); },
});
scene('c1a_tent_cot', {
    speaker: 'System',
    text: () => `Miriam's camp bed, the blanket folded with military corners. It feels wrong to lie on it and you're too tired to care. It is ${clockStr()}.` +
        (Story.s.clock >= CLOCK_END && !sflag('ch1_complete') ? `\n\nThe sky over the Nile is going grey. There's no more night left to wait out.` : ''),
    get choices() { return c1aWaitChoices(); },
});
scene('c1a_rested', { speaker: 'System', text: () => `You close your eyes for what feels like a minute. It is ${clockStr()}.`, choices: [{ text: 'Get up.' }] });

// the clock passed from `before` to `after` (story minutes)
function storyClockPassed(before, after) {
    const mid = 24 * 60;
    if (before < mid && after >= mid && sflag('met_rais') && !sflag('lena_event')) c1aLenaArrive();
    if (before < CLOCK_END && after >= CLOCK_END && !sflag('ch1_complete')) storyNotice('04:40. The sky over the Nile is going grey.');
}
// MIDNIGHT (beat 5 begins): the black car on the road in. It parks at the tent (storyFrame, below).
function c1aLenaArrive() {
    if (sflag('codex') || sflag('lena_event')) return;
    sflag('lena_event', 'coming'); sflag('lena_arrive_at', 24 * 60 + 8);        // parked at the tent a few minutes later (storyFrame)
    Toast.show(sflag('warned_midnight') ? 'MIDNIGHT. Headlights on the road in. Farouk was right.' : 'MIDNIGHT. Headlights on the road in.', 4.5);
    Sfx.tone(70, 1.8, 'sawtooth', 0.03); Sfx.tone(92, 1.4, 'sine', 0.04);
}

// ============================================================
// STEP 3: THE MAIN STORY
// ============================================================
// every frame you're free to walk about (after the clock ticks)
function storyFrame(dt) {
    const ev = sflag('lena_event'), s = Story.s;
    if (ev === 'coming' && s.clock >= (sflag('lena_arrive_at') || 0) && Game.map.key !== 'INT_TENT') {
        sflag('lena_event', 'searching'); sflag('lena_until', s.clock + 90);
        Toast.show('Torches at Miriam\'s tent. Three people are searching it.', 5);
        task('lena', 'Someone is searching Miriam\'s tent. Go and see (quietly).');
    }
    if (ev === 'searching' && s.clock >= (sflag('lena_until') || 1e9)) c1aLenaLeave(true);
    Train.update(dt);
    storySync();
}
// make the world match the story: the dig gate, the midnight visitors and their car
function storySync() {
    const m = Game.maps.ch1; if (!m) return;
    const gate = m.ents.find(e => e.id === 'dig_gate');
    if (gate) {
        if (!gate.sprOpen) {
            gate.sprOpen = gate.spr; gate.sprLocked = digGateLocked(gate.w, gate.d); gate.lock = { gateLock: true };
            const [a, b] = m.camp.fences;                                      // the gap between the two runs of fence
            World.addSolid(m, a[1] * TILE, gate.y + 10, (b[0] - a[1]) * TILE, 8, gate.lock);
        }
        const open = !!sflag('gate_open');
        if (gate.isOpen !== open) { gate.isOpen = open; gate.spr = open ? gate.sprOpen : gate.sprLocked; World.setSolid(m, gate.lock, !open); }
    }
    Bosta.sync(); placesSync(); secretsSync();
    const here = sflag('lena_event') === 'searching';
    for (const e of m.ents) if (e.lenaEvent) e.gone = !here;
    if (here && !Game.lenaCar) {
        const w = 3 * TILE, d = 2 * TILE, x = 43 * TILE, y = 31 * TILE;
        Game.lenaCar = World.addEnt(m, { x, y, w, d, spr: SPR.inspector(w, d), label: 'Black Land Cruiser', say: ['System', 'A black Land Cruiser, engine ticking as it cools, parked with its lights off. Diplomatic green plates. The seats are leather and the back is empty.'] });
    } else if (!here && Game.lenaCar) { World.removeEnt(m, Game.lenaCar); Game.lenaCar = null; }
}
// walking up to a door: return true to stop you going in
function storyDoor(d) {
    if (d.to === 'INT_TENT' && sflag('lena_event') === 'searching') { startDialogue('c1a_lena'); return true; }
    return false;
}
function gateOpen() { sflag('gate_open', true); storySync(); taskDone('wages'); }
function c1aTask(id, text) { task(id, text); }

// ---- the dig gate ----
STORY_SCRIPTS.dig_gate = 'zone_dig_gate';
scene('zone_dig_gate', {
    speaker: 'System',
    text: () => sflag('gate_open')
        ? `The dig zone gate stands open. Beyond it: the dig shed on the west side, the find store on the east, the spoil heaps and the sieve, and at the foot of the cliff, the shaft.`
        : `The dig zone gate: chain-link, a chain and a padlock, Miriam's handwriting on a laminated sign: ACTIVE EXCAVATION, AUTHORISED STAFF ONLY.\n\nThe Rais has the keys. The Rais, at the moment, has a problem with wages.`,
    choices: [{ text: 'Step back.' }],
});

// ============================================================
// RAIS ABDALLAH — the hub of the camp (beat 2: the payroll)
// ============================================================
STORY_SCRIPTS.tariq_talk = 'c1a_rais';
scene('c1a_rais', {
    speaker: R,
    text: () => {
        const p = sflag('payroll');
        if (!p) return `The Rais pours you tea without asking. "So. The wages."`;
        if (p === 'confront_pending') return `"Doctor Lindqvist is in his trailer," the Rais says, not looking up from the fire. "He is always in his trailer."`;
        if (p === 'delayed') return `The Rais nods at you: polite, no more. Around the fire the men don't look up.`;
        return `The Rais makes room for you by the fire. "Sit, ${PC.honor}. Tea?"`;
    },
    get choices() {
        const c = [], p = sflag('payroll');
        if (hasItem('Glass plate photograph') && !sflag('rais_photo')) c.push({ text: 'Show him the glass plate photograph from 1926.', nextScene: 'c1a_rais_photo' });
        if (!p || p === 'delayed') c.push({ text: p === 'delayed' ? '"About the wages. I\'ve thought again."' : '"Tell me about the wages."', nextScene: 'c1a_pay' });
        if (!sflag('rais_miriam')) c.push({ text: '"What do you think happened to Miriam?"', nextScene: 'c1a_rais_miriam' });
        if (sflag('gate_open')) c.push({ text: '"Tell me about the trenches."', nextScene: 'c1a_rais_trenches' });
        if (!sflag('mina')) c.push({ text: '"You look like a man with two worries, not one."', nextScene: 'c1a_mina' });
        else if (sflag('mina') === 'open') c.push({ text: '"About Mina\'s debt."', nextScene: 'c1a_mina_resolve' });
        if (sflag('injured')) c.push({ text: '"Is there a first-aid kit?"', nextScene: 'c1a_rais_aid' });
        c.push({ text: 'Drink your tea. "Later, Rais."' });
        return c;
    },
});
scene('c1a_rais_aid', { speaker: R, text: `He looks at the cut and clicks his tongue. "Hana. Hana has the good kit, and the good hands. By the director's tent."`, choices: [{ text: '"Thank you."' }] });
scene('c1a_pay', {
    speaker: R,
    text: () => (sflag('lq_wages') ? `You tell him what Lindqvist said. "Friday," the Rais repeats, and puts another glass on the tray.\n\n` : '') +
        `"Forty men. Eleven days. The site account is six thousand pounds short, and the Swiss money that pays the season comes through Doctor Lindqvist."\n\n"Doctor Miriam paid them from her own pocket last month. I am not asking you to do that. I am telling you what she did."`,
    get choices() {
        const c = [];
        c.push({ text: money() >= 6000 ? 'Pay the six thousand yourself. (−6,000 EGP)' : 'Pay the six thousand yourself. (you don\'t have it)', onSelect: () => {
            if (money() < 6000) { startDialogue('c1a_pay_cant'); return; }
            storyPay(-6000, 'The men\'s wages');
            const was = sflag('payroll');
            sflag('payroll', 'paid');
            rel('abdallah', was === 'delayed' ? 10 : 15); rel('workmen', was === 'delayed' ? 20 : 25, true);
            gateOpen();
            startDialogue('c1a_pay_paid');
        } });
        if (sflag('payroll') !== 'delayed') c.push({ text: '"Lindqvist is going to explain where that money went."', onSelect: () => {
            sflag('payroll', 'confront_pending');
            task('wages', 'Confront Dr. Lindqvist about the missing wages (his site trailer, east).');
            startDialogue('c1a_pay_confront');
        } });
        if (!sflag('payroll')) c.push({ text: '"They\'ll have to wait a few more days."', onSelect: () => {
            sflag('payroll', 'delayed'); rel('abdallah', -10); rel('workmen', -20, true); gateOpen();
            startDialogue('c1a_pay_delay');
        } });
        c.push({ text: '"Let me think about it."' });
        return c;
    },
});
scene('c1a_pay_cant', { speaker: R, text: `He glances at your wallet and, kindly, away. "No. That is not your burden. Talk to the deputy."`, choices: [{ text: 'Back.', nextScene: 'c1a_pay' }] });
scene('c1a_pay_paid', {
    speaker: R,
    text: `He counts it twice, the way you count money that isn't yours, and stands. Around the fire the talk stops, then starts again louder.\n\nSomeone laughs. Someone says your name wrong and three people correct him.\n\n"Tomorrow they dig for you," the Rais says. He unhooks a ring of keys from his belt. "Her keys. The dig gate, the trenches, the shaft. All but one: the find store. She kept that key on her. It is not on the ring."`,
    choices: [{ text: 'Take the keys.', onSelect: c1aKeysNote }],
});
scene('c1a_pay_confront', {
    speaker: R,
    text: `A small smile, the first. "Then he will explain it to both of us. He is in his trailer on the east side. He is always in his trailer."`,
    choices: [{ text: 'Go and find Lindqvist.' }],
});
scene('c1a_pay_delay', {
    speaker: R,
    text: () => `He is quiet for a while. Then he unhooks a ring of keys from his belt and puts it in your hand.\n\n"The dig gate. The trenches. The shaft. All but the find store: she kept that key on her.\n\nThe gate is yours, ${PC.doctor}. The men are not. Tomorrow you dig alone."`,
    choices: [{ text: 'Take the keys.', onSelect: c1aKeysNote }],
});
function c1aKeysNote() {
    pocket("Miriam's keys");
    storyNote('The keys', 'Miriam\'s key ring: the dig gate, the trenches, the shaft. The find-store key is missing: she kept it on her. Her survey has three trenches: A (east of camp, past the trailer), B and C (inside the dig zone). The dig shed inside the gate has the records.');
    storyNotice('The dig zone gate is open.');
    task('trenches', 'Look at Miriam\'s three trenches: A (east, past the trailer), B and C (inside the dig zone, north). Her records are in the dig shed.');
}
scene('c1a_rais_miriam', {
    speaker: R,
    text: `"The last week she did not sleep. She went down the shaft at night, alone. She came up with plaster on her hands and would not say why."\n\n"The night she left, Farouk at the guard booth saw a car. Not the Ministry. Ask him. Farouk sees everything and tells nothing, unless you are polite."`,
    choices: [{ text: '"Thank you, Rais."', onSelect: () => {
        sflag('rais_miriam', true);
        storyNote('Miriam\'s last week', 'She went down the shaft alone at night and came back with plaster on her hands. Uncle Farouk at the guard booth (by the road in, south-east) saw a car the night she left.');
        if (!sflag('farouk_car')) task('farouk', 'Ask Uncle Farouk about the car he saw (the guard booth, by the road in).');
    } }],
});
scene('c1a_rais_trenches', {
    speaker: R,
    text: () => `"Three trenches this season. A is east, past the trailer: she had it re-opened the week before she left, then made me rope it off. B is inside the dig zone; she backfilled it herself, which a director does not do. C is not a trench, only her red stake inside the gate. She would stand by it and look at the pyramids.\n\nThe dig shed has the records. Doctor Miriam wrote everything down. Everything."` +
        (sflag('payroll') === 'delayed' ? `\n\nHe adds, flatly: "Trench A is roped. The men will not open it for you."` : ''),
    choices: [{ text: '"I\'ll start with them."', onSelect: () => storyNote('The trenches', 'A: east, past the site trailer. Re-opened, then roped off. B: inside the dig zone. Miriam backfilled it herself. C: her red survey stake just inside the dig gate. The dig shed (west side of the dig zone) has the records.') }],
});

// SQ-01A-01 — The Rais's Son (the start; the race with Hagg Sayed comes with the side quests)
scene('c1a_mina', {
    speaker: R,
    text: `He laughs, once, without much in it. "My son Mina. He looks after horses at a stable in Nazlet el-Samman, under the pyramids. He borrowed from the stable owner for a motorbike. Now the man wants it back with interest, fifteen hundred pounds by Friday, or Mina works the tourist camels for a year for nothing."\n\n"He is a good boy. He is a stupid boy. Both."`,
    choices: [
        { text: '"Maybe I can help."', onSelect: () => { sflag('mina', 'open'); storyNote('The Rais\'s son (side quest)', 'Mina owes a stable owner 1,500 EGP. Pay it, or win it at the camp darts (the stable owner bets on the tournament too), or stay out of it.'); task('mina', 'The Rais\'s son Mina owes 1,500 EGP. Pay it, or find another way.'); rel('abdallah', 3, true); } },
        { text: '"That\'s hard. I\'m sorry."', onSelect: () => sflag('mina', 'declined') },
    ],
});
scene('c1a_mina_resolve', {
    speaker: R,
    text: () => `"Mina's debt," the Rais says. "Friday."` + (sflag('darts_won') ? `\n\nHe has already heard about the darts. Everybody has.` : ''),
    get choices() {
        const c = [];
        if (money() >= 1500) c.push({ text: 'Give him 1,500 EGP for Mina. (−1,500 EGP)', onSelect: () => { storyPay(-1500, 'Mina\'s debt'); c1aMinaDone('paid'); } });
        if (sflag('darts_won')) c.push({ text: '"Take the darts winnings. The stable owner lost his bet anyway."', onSelect: () => c1aMinaDone('darts') });
        c.push({ text: '"Not yet."' });
        return c;
    },
});
function c1aMinaDone(how) {
    sflag('mina', 'done'); rel('abdallah', 15); taskDone('mina');
    storyNote('The Rais\'s son (side quest)', 'Done. Mina\'s debt is paid' + (how === 'darts' ? ' with the darts winnings.' : '.') + ' The Rais says his family in Quft will not forget it.');
    startDialogue('c1a_mina_thanks');
}
scene('c1a_mina_thanks', {
    speaker: R,
    text: `He takes it with both hands and doesn't say thank you. He says your name, properly, the way people from Quft say the names of people they owe.\n\n"My cousins in Quft keep every paper our family ever touched. One day you will need a paper. You will have it."`,
    choices: [{ text: 'Finish your tea.' }],
});

// ============================================================
// DR. PETER LINDQVIST — the deputy
// ============================================================
STORY_SCRIPTS.c1a_lindqvist = 'c1a_lindqvist';
function c1aMetLq() { if (!sflag('met_lindqvist')) { sflag('met_lindqvist', true); taskDone('lindqvist'); } }
scene('c1a_lindqvist', {
    speaker: 'Dr. Lindqvist',
    text: () => sflag('met_lindqvist')
        ? (sflag('payroll') === 'confront_pending' ? `Lindqvist sees your face and puts his coffee down.` : `"${PC.doctor}. Anything you need. Really."`)
        : `A tall Swede in a sun-bleached shirt, reading glasses pushed up into thinning hair, a coffee he's forgotten about. He shakes your hand too long.\n\n"Peter Lindqvist, deputy director. Thank God you're here. Thank God. The Ministry's been... well. Miriam had a family matter. Her mother, I think. She'll be in touch. In the meantime, the season, the permit, all of it: it's yours."`,
    get choices() {
        const c = [], p = sflag('payroll');
        if (p === 'confront_pending') c.push({ text: '"The payroll is six thousand short. Where did the money go?"', nextScene: 'c1a_lq_confront' });
        // before the payroll is settled at the Rais's fire he can only dodge (the confrontation goes through the Rais)
        if (!sflag('lq_wages') && (!p || p === 'delayed')) c.push({ text: '"The Rais says the men haven\'t been paid in eleven days."', onSelect: () => sflag('lq_wages', true), nextScene: 'c1a_lq_wages' });
        if (!sflag('lq_mother')) c.push({ text: '"Her mother? Miriam\'s mother died years ago. It\'s in her file."', onSelect: () => { sflag('lq_mother', true); rel('lindqvist', -5, true); }, nextScene: 'c1a_lq_mother' });
        if (!sflag('vasse_named')) c.push({ text: '"Who\'s paying for this season?"', nextScene: 'c1a_lq_money' });
        if (!sflag('lq_key')) c.push({ text: '"Where\'s the find-store key?"', onSelect: () => sflag('lq_key', true), nextScene: 'c1a_lq_key' });
        c.push({ text: '"Goodnight, Peter."' });
        // whatever you say, you've met him now
        return c.map(ch => Object.assign({}, ch, { onSelect: () => { c1aMetLq(); if (ch.onSelect) ch.onSelect(); } }));
    },
});
scene('c1a_lq_mother', {
    speaker: 'Dr. Lindqvist',
    text: `A long pause. He takes his glasses off, cleans them on a shirt that makes them dirtier.\n\n"Then... something else. Family can mean a lot of things. She was very private." He puts the glasses back on. "I only know what I was told."`,
    choices: [{ text: '"Who told you?"', nextScene: 'c1a_lq_told' }, { text: 'Let it go. For now.', nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_told', {
    speaker: 'Dr. Lindqvist',
    text: `"The Foundation's office called. They said she'd asked them to pass it on." He hears himself say it and looks miserable. "Which is odd, I suppose. Now that you... yes."`,
    choices: [{ text: '"Odd is one word for it."', onSelect: () => { sflag('vasse_named', true); storyNote('Lindqvist', 'The deputy. Kind, frightened, lying badly. The story that Miriam left for her mother came from "the Foundation\'s office": the Swiss foundation that pays the season.'); }, nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_wages', {
    speaker: 'Dr. Lindqvist',
    text: `"Friday." It comes out too fast. "The transfer's coming Friday. Geneva is... they're slow, the Swiss, everybody thinks they're punctual but the banks..." He hears himself and stops.\n\n"Friday. Tell the Rais Friday. I'll sort it out."\n\nHe picks up his coffee, finds it cold, and drinks it anyway.`,
    choices: [{ text: '"The Rais says you said Friday last Friday."', onSelect: () => {
        rel('lindqvist', -3, true);
        storyNote('The wages', 'Lindqvist says the men will be paid "Friday", when a transfer comes from Geneva. He said that last Friday too. The Rais is waiting to talk about it at the workers\' fire (west).');
    }, nextScene: 'c1a_lq_wages2' }],
});
scene('c1a_lq_wages2', {
    speaker: 'Dr. Lindqvist',
    text: `He looks at the trailer door, as if someone might come through it. "Then this Friday. I promise." He doesn't say who he's promising for.`,
    choices: [{ text: 'Back.', nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_money', {
    speaker: 'Dr. Lindqvist',
    text: `"The usual. The university, the Ministry's share, and a private foundation. The Vasse Foundation, in Geneva. Very generous. Very... interested. Mr. Vasse collects. Well, he supports. Heritage."\n\nHe says "heritage" like a word he was given to say.`,
    choices: [{ text: 'Back.', onSelect: () => { sflag('vasse_named', true); storyNote('The Vasse Foundation', 'A private foundation in Geneva pays for most of the season, through Lindqvist. Its founder, Conrad Vasse, "collects".'); }, nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_key', {
    speaker: 'Dr. Lindqvist',
    text: `"Lost. Miriam had it on her. The Ministry's sending a replacement seal and a new lock, eventually. Nothing in there but pottery anyway." He laughs. It isn't a laugh.`,
    choices: [{ text: 'Back.', nextScene: 'c1a_lindqvist' }],
});
scene('c1a_lq_confront', {
    speaker: 'Dr. Lindqvist',
    text: `He opens his mouth to say Friday and doesn't.\n\n"The Foundation pays the season. Not the university: the Foundation. All of it, since spring. And when Miriam left, the transfers stopped, and they told me they'd resume when the season was... secured. Their word."\n\nHe opens a drawer: an envelope, fat, rubber-banded. "Emergency float. It's theirs. I wasn't supposed to touch it."`,
    choices: [{ text: '"Pay the men with it. Tonight."', onSelect: () => {
        sflag('payroll', 'confronted'); sflag('vasse_named', true); c1aMetLq();
        rel('lindqvist', -15); rel('abdallah', 10); rel('workmen', 20, true); gateOpen();
        storyNote('The payroll', 'Lindqvist paid the men from the Vasse Foundation\'s "emergency float". The Foundation has paid for the whole season since spring, and stopped paying when Miriam left.');
    }, nextScene: 'c1a_lq_paid' }],
});
scene('c1a_lq_paid', {
    speaker: 'Dr. Lindqvist',
    text: `He counts it out for the Rais with his hands shaking. At the door he catches your sleeve.\n\n"They'll know I did this. I'll tell them it was you. I'm sorry. I'm telling you so it isn't a surprise."\n\nThe Rais hands you Miriam's key ring on the way out. "All but the find store," he says. "She kept that one on her."`,
    choices: [{ text: 'Take the keys.', onSelect: c1aKeysNote }],
});

// ============================================================
// UNCLE FAROUK — the night guard (beat 4)
// ============================================================
STORY_SCRIPTS.c1a_farouk = 'c1a_farouk';
scene('c1a_farouk', {
    speaker: 'Uncle Farouk',
    text: () => sflag('met_farouk')
        ? `Farouk lifts two fingers from his stick. "${PC.honor}."`
        : `An old guard on a plastic chair outside the booth, a shotgun older than you across his knees and a transistor radio on the ground. He doesn't get up.\n\n"Masa' el-kheir. You are the new doctor." It isn't a question.`,
    get choices() {
        const c = [];
        if (!sflag('farouk_car')) c.push({ text: '"The Rais says you saw a car, the night Miriam left."', nextScene: 'c1a_farouk_car' });
        if (sflag('farouk_car') && !sflag('farouk_bribed')) {
            if (hasItem('Mint Tea')) c.push({ text: 'Offer him a glass of Saber\'s mint tea.', onSelect: () => { dropItem('Mint Tea'); c1aFaroukBribe('tea'); } });
            c.push({ text: money() >= 500 ? '"For your trouble." (500 EGP)' : '"For your trouble." (you don\'t have 500 EGP)', onSelect: () => { if (money() < 500) return; storyPay(-500, 'For Uncle Farouk'); c1aFaroukBribe('money'); } });
        }
        c.push({ text: '"Goodnight, Uncle."', onSelect: () => sflag('met_farouk', true) });
        return c;
    },
});
scene('c1a_farouk_car', {
    speaker: 'Uncle Farouk',
    text: `He considers you a while.\n\n"A black Land Cruiser. Big. Came in without lights, left without lights. In the back seat, a woman sat like an old woman at a funeral: straight, hands in her lap. Doctor Miriam got in by herself. Nobody pushed."\n\n"And the other car. Also black. It comes at midnight. Twice this week. They walk around her tent with torches. They do not see me. Nobody sees the ghafir."`,
    choices: [{ text: '"Midnight."', onSelect: () => {
        sflag('farouk_car', true); sflag('met_farouk', true); sflag('warned_midnight', true); taskDone('farouk');
        storyNote('Uncle Farouk', 'The night guard. The night Miriam left, a black Land Cruiser came without lights; a woman sat in the back "like an old woman at a funeral". Miriam got in by herself.\n\nANOTHER black car comes at MIDNIGHT and searches her tent with torches. (The fire and her camp bed let you wait.)');
        if (!sflag('lena_event')) task('midnight', 'A black car comes to Miriam\'s tent at midnight. Be there (the fire or her camp bed let you wait).');
    }, nextScene: 'c1a_farouk' }],
});
function c1aFaroukBribe(how) { sflag('farouk_bribed', true); rel('farouk', 15); startDialogue(how === 'tea' ? 'c1a_farouk_tea' : 'c1a_farouk_money'); }
scene('c1a_farouk_tea', {
    speaker: 'Uncle Farouk',
    text: `He drinks it in three careful sips and nods at the foam. "Saber made this. No, you made this. Saber taught you." Something in his face settles.\n\n"The old gate on the causeway road. I have the key. If you ever need to go into the shaft at night and the gate is... difficult, you ask Farouk."`,
    choices: [{ text: '"I\'ll remember."', onSelect: () => storyNote('Uncle Farouk', 'He has the key to the old causeway gate. "If you ever need to go into the shaft at night, ask Farouk."') }],
});
scene('c1a_farouk_money', {
    speaker: 'Uncle Farouk',
    text: `The notes disappear into his galabeya without him appearing to move.\n\n"The old gate on the causeway road. I have the key. One day, maybe, you need it."`,
    choices: [{ text: '"Maybe."', onSelect: () => storyNote('Uncle Farouk', 'He has the key to the old causeway gate, and now he owes you.') }],
});

// ============================================================
// THE TRENCHES (beat 3)
// ============================================================
STORY_SCRIPTS.trench = 'c1a_trenchA';
STORY_SCRIPTS.fl_digshed = 'c1a_digshed';
STORY_SCRIPTS.fl_stake_sam = 'c1a_trenchC';
STORY_SCRIPTS.ow_sieve = 'c1a_sieve';
const c1aHelped = () => sflag('payroll') === 'paid' || sflag('payroll') === 'confronted';
scene('c1a_trenchA', {
    speaker: 'System',
    text: () => sflag('trenchA')
        ? `Trench A, open to the stars. You found what Miriam left here.`
        : `Trench A: a long cut in the gravel, re-opened recently and then roped off, the rope knotted the way a person knots things in a hurry. Miriam's survey stakes run along the lip, and one, halfway down, has been moved: the old hole is still there beside it.\n\n` +
          (c1aHelped() ? `Two of the men have followed you over with picks and a lamp, uninvited. "The Rais said," one of them says.` :
           sflag('payroll') === 'delayed' ? `Nobody comes to help. You find a spare trowel.` : `The men are at the fire, waiting to hear about their wages. You could dig it yourself.`),
    get choices() {
        if (sflag('trenchA')) return [{ text: 'Leave it.' }];
        const help = c1aHelped();
        return [
            { text: help ? 'Dig where the moved stake was. (with help, about 20 minutes)' : 'Dig where the moved stake was, yourself. (about 45 minutes)', onSelect: () => { clockAdvance(help ? 20 : 45); startDialogue('c1a_trenchA_find'); } },
            { text: 'Not now.' },
        ];
    },
});
scene('c1a_trenchA_find', {
    speaker: 'System',
    text: `A hand's depth down, where no season's work would ever put it: a zip-lock bag, folded twice. Inside, one page torn from a field notebook, in Miriam's quick square hand:\n\n"If you are reading this, you think like me. God help you.\n\nOsiris Shaft, level 3. The niche was behind the plaster. I have put it somewhere safer. The find store key is in B, under the red stake. Trench B spoil went to the heaps by the sieve.\n\nThere is an older seal on the shaft approach. Owl, eye, serpent, lion. I opened it once. I closed it again. Don't.\n\nM.H."`,
    choices: [{ text: 'Fold the page into your pocket.', onSelect: () => {
        sflag('trenchA', true); pocket("Miriam's notebook page");
        storyNote("Miriam's notebook page (Trench A)", '"Osiris Shaft, level 3. The niche was behind the plaster. I have put it somewhere safer. The find store key is in B, under the red stake. Trench B spoil went to the heaps by the sieve.\n\nThere is an older seal on the shaft approach. Owl, eye, serpent, lion. I opened it once. I closed it again. Don\'t."');
        if (!sflag('mag_key')) task('storekey', 'The find-store key is in Trench B\'s spoil, under the red stake: the heaps by the sieve in the dig zone.');
        task('seal', '(Optional) The older seal on the shaft approach, at the foot of the cliff. Owl, eye, serpent, lion.');
    } }],
});
scene('c1a_digshed', {
    speaker: 'System',
    text: () => sflag('gate_open')
        ? `A clipboard hanging on a nail in the dig shed, Miriam's daily record in square capitals, every day of the season. The last week the entries get shorter.\n\n"14th: TRENCH B BACKFILLED (M.H. ALONE). SPOIL TO THE HEAPS BY THE SIEVE. RED STAKE."\n\n"15th: SHAFT L3. PLASTER."\n\n"16th:" and then nothing.`
        : `The dig shed. Its door is padlocked, and the key will be on Miriam's ring. The Rais has the ring, and the Rais wants to talk about wages.`,
    get choices() {
        if (!sflag('gate_open')) return [{ text: 'Leave it.' }];
        return [{ text: 'Photograph the page.', onSelect: () => {
            sflag('trenchB_known', true);
            storyNote('Trench B', 'Miriam backfilled Trench B alone on the 14th and sent its spoil to the heaps by the sieve (the east side of the dig zone). A red stake marks the heap.');
            if (!sflag('mag_key')) task('storekey', 'Trench B\'s spoil is in the heaps by the sieve (the dig zone, east side). Sift the heap under the red stake.');
        } }];
    },
});
scene('c1a_trenchC', {
    speaker: 'System',
    text: () => `A red-painted survey stake, driven in hard, set apart from all the others. Scratched into the wood near the top, small and neat, are three letters that aren't English and aren't Arabic:\n\n    ⲡⲏⲓ\n\nCoptic, the last stage of the Egyptian language, written in Greek letters. You know enough to read it: "the house".\n\nFrom here, in the dark, the stake lines up exactly with the causeway and the Sphinx.`,
    choices: [{ text: 'Note it down.', onSelect: () => {
        if (!sflag('trenchC')) { sflag('trenchC', true); storyNote('Trench C: the red stake', 'Scratched on Miriam\'s red stake: ⲡⲏⲓ, Coptic for "the house". It lines up with the causeway and the Sphinx.'); }
    } }],
});
// the sieve by the spoil heaps: Trench B's spoil hides the key
scene('c1a_sieve', {
    speaker: 'System',
    text: () => sflag('trenchB_known') || sflag('trenchA')
        ? (sflag('mag_key') ? `The sieve on its trestles. Trench B's heap is sifted flat; the red stake lies on top of it.` : `The spoil heaps. One is fresher than the rest, the sand still dark: Trench B's spoil, carted here on the 14th. A red stake leans out of the top of it.`)
        : `A sieve frame on trestles beside the spoil heaps: cast-off earth, never properly sifted.`,
    get choices() {
        const c = [], left = 3 - (sflag('sieve_runs') || 0);
        if ((sflag('trenchB_known') || sflag('trenchA')) && !sflag('mag_key'))
            c.push({ text: 'Sift the heap under the red stake. (minigame, about 30 minutes)', onSelect: () => playMinigame('sieve', { key: true }, r => { if (r.left) return; clockAdvance(30); c1aSievePay(r); startDialogue(r.key ? 'c1a_sieve_key' : 'c1a_sieve_none'); }) });
        if (left > 0) c.push({ text: 'Sift one of the old heaps. (' + left + ' left, about 20 minutes)', onSelect: () => playMinigame('sieve', {}, r => { if (r.left) return; sflag('sieve_runs', 4 - left); clockAdvance(20); c1aSievePay(r); }) });
        c.push({ text: c.length ? 'Not now.' : 'Leave it.' });
        return c;
    },
});
// what the register pays for a heap's finds (Hana's valuation: +20%)
function c1aSievePay(r) { if (r.bagged) skillXP('excavation', r.bagged.length * 10); if (r.earned) storyPay(Math.round(r.earned * (sflag('hana_valuation') ? 1.2 : 1)), 'Sieve finds' + (sflag('hana_valuation') ? ' (Hana\'s valuation)' : '')); }
scene('c1a_sieve_key', {
    speaker: 'System',
    text: `A small brass key on a cardboard tag, green with earth. MAG. Magazine. The find store. Miriam put it in the ground, the only place she trusted.`,
    choices: [{ text: 'Pocket the key.', onSelect: () => {
        sflag('mag_key', true); pocket('Find-store key (MAG)'); taskDone('storekey'); taskDone('trenches');
        storyNote('The find-store key', 'A small brass key on a cardboard tag marked MAG: magazine, the find store. It was in Trench B\'s spoil, under Miriam\'s red stake. The find store is the steel-doored shed on the east side of the dig zone.');
        task('store', 'Open the find store (the east side of the dig zone) with the MAG key.');
    } }],
});
scene('c1a_sieve_none', { speaker: 'System', text: `Something glinted under the red stake, and you lost it in the sand. Sift it again.`, choices: [{ text: 'Step back.' }] });

// ============================================================
// THE FIND STORE — where the Codex is (beat 6)
// ============================================================
STORY_SCRIPTS.fl_toolshed = 'c1a_store';
scene('c1a_store', {
    speaker: 'System',
    text: () => sflag('codex') ? `The find store, its door pulled to. You've taken what Miriam hid here.`
        : sflag('mag_key')
            ? `The find store: a steel-doored magazine against the rock, padlocked, and across the hasp a Ministry seal: a strip of paper, a blob of red wax, the Ministry's stamp. The brass key is warm from your pocket.`
            : `The find store: a steel-doored magazine against the rock. A padlock, and across the hasp a Ministry seal of paper and red wax. Lindqvist says the key is lost.\n\nMiriam never lost anything in her life.`,
    get choices() {
        if (sflag('codex') || !sflag('mag_key')) return [{ text: 'Leave it.' }];
        return [
            { text: 'Slit the seal cleanly along the paper, so it can be closed again.', onSelect: () => { sflag('seal_clean', true); startDialogue('c1a_store_in'); } },
            { text: 'Break the seal. It\'s your site now.', onSelect: () => { sflag('seal_clean', false); startDialogue('c1a_store_in'); } },
            { text: 'Not yet.' },
        ];
    },
});
scene('c1a_store_in', {
    speaker: 'System',
    text: `Inside, it smells of dust and cardboard and old stone. Shelves of finds boxes to the ceiling, every one labelled in Miriam's square capitals, every one exactly where the register says it should be.\n\nExcept one. On the floor, in the corner, a crate that isn't on any shelf, marked in fresh pen: LATE PERIOD POTTERY, SHERDS.\n\nUnder the sherds, wrapped in a green scarf: something the size of a large book.`,
    choices: [{ text: 'Unwrap it.', nextScene: 'c1a_codex' }],
});
scene('c1a_codex', {
    speaker: 'System',
    text: `A book. Not a scroll: a book, a codex, leaves of papyrus folded and stitched into a quire, in a cover of dark leather with a long wrap-around flap and a thong to tie it shut. You have seen exactly this shape once, in a museum case in Cairo: the Nag Hammadi codices, buried in a jar in the fourth century.\n\nYou open the flap with one finger. The first page is Greek, a list, a careful hand. Beside certain lines, small marks that are not Greek at all. Hieroglyphs, or something that wants to be.\n\nTucked inside the cover, a note on modern paper:\n\n"Whoever finds this: don't give it to Vasse. Take it to Father Bishoy, Café El-Fishawy, Cairo, Thursday. M."`,
    choices: [{ text: 'Wrap it back in the scarf.', onSelect: () => {
        sflag('codex', true); pocket('The Codex'); pocket("Miriam's note", 1, true); taskDone('store');
        storyNote('The Codex', 'A leather-bound papyrus codex, Late Antique, like the Nag Hammadi books. Greek, with hieroglyph-like marks beside some lines. Miriam hid it in the find store in a crate of "Late Period sherds".\n\nHer note: "Don\'t give it to Vasse. Take it to Father Bishoy, Café El-Fishawy, Cairo, Thursday."');
        if (sflag('seal_clean') && hasItem('Conservation wax')) startDialogue('c1a_store_reseal');
        else startDialogue('c1a_headlights');
    } }],
});
scene('c1a_store_reseal', {
    speaker: 'System',
    text: `On the way out you press Hana's wax into the slit seal and smooth it with your thumb. From two steps away, nobody would ever know the find store had been opened.`,
    choices: [{ text: 'Walk away from the store.', onSelect: () => { sflag('store_resealed', true); startDialogue('c1a_headlights'); } }],
});

// ============================================================
// THE SHAFT and PETAMUN'S SEAL (beat 7, optional)
// ============================================================
STORY_SCRIPTS.tunnel_mouth = 'c1a_shaft';
STORY_SCRIPTS.puzzle_glyph = 'puzzle_start_glyph_lock';
scene('c1a_shaft', {
    speaker: 'System',
    text: () => !sflag('gate_open') ? `The survey shaft, cut into the foot of the escarpment. A steel grille is padlocked over the ladder. The key will be on Miriam's ring, and the Rais has the ring.` : `The survey shaft Miriam's team cut to reach the lower levels of the Osiris Shaft, the real one, dug under the causeway in the Late Period and cleared in 1999: three levels of rock-cut chambers going down toward the water table.\n\nA ladder, a rope, and the dark.`,
    get choices() { if (!sflag('gate_open')) return [{ text: 'Leave it.' }]; return [{ text: 'Climb down into the shaft. (5 minutes)', onSelect: () => c1aShaftDown('INT_SHAFT1', null) }, { text: 'Not now.' }]; },
});
// the old seal: press the four stones in the right order (owl, eye, serpent, lion): the seal
// minigame in poke/minigames.js. A wrong stone moves them round (seal_pos).
const SEAL_ORDER = ['owl', 'eye', 'serpent', 'lion'], SEAL_AT = ['north', 'east', 'south', 'west'];
function c1aSealShuffle() { const a = SEAL_ORDER.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } sflag('seal_pos', a); }
scene('puzzle_start_glyph_lock', {
    speaker: 'System',
    text: () => sflag('petamun_seal') ? `The seal stands open. The side passage behind it is empty now.`
        : `Set into the rock of the shaft approach, half hidden by a timber brace: a ring of pale stone around a core of dark amber, and four glyph stones spaced around it like a compass. It is much older than the shaft.\n\nIn the stone above it, carved small, in Greek letters: ΠΕΤΑΜΟΥΝ.` +
          (sflag('trenchA') ? `\n\nMiriam's page: "Owl, eye, serpent, lion. I opened it once. I closed it again. Don't."` : `\n\nThere are old dart holes in the timber opposite. Whoever made this did not want it guessed.`),
    get choices() {
        if (sflag('petamun_seal')) return [{ text: 'Leave it.' }];
        return [
            { text: 'Wake the seal. (minigame)', onSelect: () => { if (!sflag('seal_pos')) c1aSealShuffle(); playMinigame('seal', {}, r => {
                if (r.ok) startDialogue('puzzle_glyph_solved');
                else if (r.dart) { c1aSealShuffle(); setInjured('dart'); startDialogue('puzzle_glyph_fail'); }
            }); } },
            { text: 'Leave it, as she asked.' },
        ];
    },
});
scene('puzzle_glyph_solved', {
    speaker: 'System',
    text: `The four stones flash gold in turn, and something deep in the rock, old stone moving on old stone, lets go.\n\nA slab beside the seal swings inward on a pivot: a passage, low and dry, three paces long. At the end, a niche Miriam cut open before you, empty. And below it, in the floor, a second, smaller niche she missed, still sealed with a disc of plaster.\n\nInside, on a bed of linen gone to dust: a bronze seal the size of your palm, green with age. Cut into its face, in Greek: ΠΕΤΑΜΟΥΝ. Petamun. And an ibis.`,
    choices: [{ text: 'Take the bronze seal.', onSelect: () => {
        sflag('petamun_seal', true); pocket('Bronze seal of Petamun'); taskDone('seal');
        storyNote('The bronze seal', 'Behind the old seal on the shaft approach, in a niche Miriam missed: a bronze seal with PETAMUN in Greek, and an ibis. Whoever Petamun was, he sealed the Osiris Shaft niche, and he knew Thoth\'s bird.');
        storyNotice('Something about this will matter.');
    } }],
});
scene('puzzle_glyph_fail', {
    speaker: 'System',
    text: `Wrong stone. The core flashes red and something hisses out of the rock: a cedar dart that grazes your leg and buries itself in the timber brace behind you.\n\nThen, grinding, the four stones shift around the ring into new places. The seal remembers being touched wrongly. It's the order of the animals that matters, not where they sit.`,
    choices: [{ text: 'Step back and breathe.', onSelect: () => storyNote('The old seal', 'A wrong stone fires a cedar dart. It grazed your leg. Hana has a first-aid kit.') }],
});
// Hana patches the dart graze
scene('c1a_hana_aid', { speaker: 'Hana', text: `She has you sit on a crate under the lamp and cleans the cut with a professional's lack of sympathy.\n\n"Cedar. Old cedar." She holds up the splinter she's pulled out, interested despite herself. "Where on earth did you get shot with an antique?"`, choices: [{ text: '"Long story."', onSelect: () => { healInjury('Hana cleaned and bound it'); rel('hana', 4, true); } }] });

// ============================================================
// THE MIDNIGHT CAR (beat 5)
// ============================================================
STORY_SCRIPTS.c1a_lena = STORY_SCRIPTS.c1a_lenaman1 = STORY_SCRIPTS.c1a_lenaman2 = () => sflag('lena_event') === 'searching' ? 'c1a_lena' : null;
function c1aLenaLeave(missed) {
    sflag('lena_event', 'gone'); taskDone('lena'); taskDone('midnight');
    if (missed) { sflag('lena_missed', true); storyNote('The midnight car', 'By the time you got back, they were gone. Miriam\'s tent has been gone through carefully by people who did this for a living.'); storyNotice('The car on the road in has gone.'); }
    storySync();
}
scene('c1a_lena', {
    speaker: 'System',
    text: `Three people with torches, working through Miriam's tent the way professionals do: quickly, quietly, putting everything back almost where it was. Two men in dark jackets. The one giving orders is a tall woman with cropped fair hair, who never raises her voice.\n\nNobody has seen you yet.`,
    choices: [
        { text: 'Stay in the shadows and listen.', nextScene: 'c1a_lena_listen' },
        { text: 'Photograph them from the dark.', nextScene: 'c1a_lena_photo' },
        { text: 'Slip into the back of the tent while they\'re busy, and see what they\'ve found.', nextScene: 'c1a_lena_slip' },
        { text: 'Step into the light. "Can I help you with something?"', nextScene: 'c1a_lena_confront' },
    ],
});
scene('c1a_lena_listen', {
    speaker: 'The Woman in Black',
    text: `"Nothing." German accent, flat and tired. "She moved it before she left. Of course she did."\n\nOne of the men says something about the new director.\n\n"Then we watch the new director. Mr. Vasse will want the deputy's phone records, and he'll want them tonight." A pause. "And stop touching her photographs. We're not animals."\n\nThey leave the way they came, torches off.`,
    choices: [{ text: 'Let out your breath.', onSelect: () => { sflag('lena_overheard', true); sflag('vasse_named', true); storyNote('The midnight car', 'A woman with a German accent and two men searched Miriam\'s tent at midnight. "She moved it before she left." They work for Mr. Vasse, and now they\'re going to watch the new director.'); c1aLenaLeave(false); } }],
});
scene('c1a_lena_photo', {
    speaker: 'System',
    text: `You shoot without flash, bracing the phone on a tent pole, and get eleven frames: the woman's face half-lit by a torch, the two men, and, when they walk back to the car, the licence plate, clear as day. Diplomatic green.\n\nThey never know you were there.`,
    choices: [{ text: 'Check the photos are sharp.', onSelect: () => { sflag('lena_photos', true); pocket('Photos: the midnight visitors'); storyNote('The midnight car', 'You photographed the three people who searched Miriam\'s tent: the woman in charge, her two men, and the car\'s plate (diplomatic green). Evidence, if you ever need it.'); c1aLenaLeave(false); } }],
});
scene('c1a_lena_confront', {
    speaker: 'The Woman in Black',
    text: () => `The torches swing onto you. The two men move apart, the way people move who expect trouble. The woman doesn't move at all.\n\n"${PC.doctor}." She knows your name. "Lena Brandt. Security, Vasse Foundation. The Foundation funds this site. We're recovering property belonging to our client."\n\nShe holds out a card between two fingers.` +
        (Bosta.near() ? `\n\nAt your heel, every hair on Bosta's back is standing up, and she is making a sound like an engine that doesn't want to start. The woman looks at the dog, not at you, for a long moment.` : ''),
    choices: [
        { text: '"Get out of my camp."', onSelect: () => { rel('lena', 5, true); sflag('met_lena', true); }, nextScene: 'c1a_lena_out' },
        { text: '"What property?"', onSelect: () => sflag('met_lena', true), nextScene: 'c1a_lena_book' },
        { text: 'Take the card. Say nothing.', onSelect: () => { sflag('met_lena', true); pocket("Lena Brandt's card"); rel('lena', 3, true); }, nextScene: 'c1a_lena_out' },
    ],
});
scene('c1a_lena_book', {
    speaker: 'Lena Brandt',
    text: () => `"A book. Old. Leather." She says it like reading a shipping manifest. "Dr. Hale borrowed it from the Foundation's collection. If it turns up, Mr. Vasse pays very well for its return. Very well."\n\nShe puts the card in your shirt pocket herself, and pats it once.\n\n"Don't go looking for Dr. Hale, ${PC.doctor}. People who do this for a living are looking for her. You'll just be in the way."`,
    choices: [{ text: '"Goodnight, Ms. Brandt."', onSelect: () => { pocket("Lena Brandt's card"); sflag('vasse_named', true); storyNote('Lena Brandt', 'Security chief, Vasse Foundation. German. Searched Miriam\'s tent at midnight for "a book, old, leather" that Miriam supposedly "borrowed" from Vasse. Told you not to look for Miriam.'); c1aLenaLeave(false); } }],
});
scene('c1a_lena_out', {
    speaker: 'Lena Brandt',
    text: () => `A thin smile: a professional appreciating another professional's nerve.\n\n"Of course. It's your camp." She nods to the men and the torches go off. At the edge of the lamplight she looks back. "Lock your tent, ${PC.doctor}."`,
    choices: [{ text: 'Watch them go.', onSelect: () => { storyNote('Lena Brandt', 'Security chief, Vasse Foundation. She and two men searched Miriam\'s tent at midnight. She knew your name.'); c1aLenaLeave(false); } }],
});
scene('c1a_lena_slip', {
    speaker: 'System',
    text: `You work round to the back of the tent, lift the canvas, and get one knee inside...\n\n...and a hand you never saw closes on your collar. The last thing you hear is the woman's voice, bored: "Gently. We're not animals."`,
    choices: [{ text: '…', onSelect: c1aKnockedOut }],
});
// knocked out: they take Miriam's page, and you wake at the workers' fire an hour and a half later
function c1aKnockedOut() {
    sflag('lena_knocked', true);
    if (hasItem("Miriam's notebook page")) { dropItem("Miriam's notebook page"); sflag('lena_has_page', true); }
    setInjured('head');
    c1aLenaLeave(false);
    Game.fadeTo(() => {
        const m = Game.maps.ch1, f = m.ents.find(e => e.id === 'rest_brazier'), p = Game.player;
        if (Game.map !== m) Game.enter(m);
        p.x = f.x + f.w / 2 + 40; p.y = f.y + f.d + 30; p.dir = DIR.left;
        clockAdvance(90); if (Game.set.time === 5) Game.hour = storyHour();
        startDialogue('c1a_woke');
    });
}
scene('c1a_woke', {
    speaker: R,
    text: () => `Firelight. A glass of tea being held against your lips. The Rais's face, very close, very calm.\n\n"Farouk found you behind the director's tent. They were gone. They left you by our fire: polite people." He puts the glass in your hand. "They went through your pockets."` +
        (sflag('lena_has_page') ? `\n\nMiriam's notebook page is gone. You remember every word of it, but now so do they.` : ''),
    choices: [{ text: 'Drink the tea.', onSelect: () => {
        storyNote('The midnight car', 'You tried to slip into Miriam\'s tent behind the searchers and were knocked out. You woke by the workers\' fire an hour and a half later.' + (sflag('lena_has_page') ? ' They took Miriam\'s notebook page: whoever they work for now knows about the shaft and the find store.' : ''));
        rel('abdallah', 3, true);
    } }],
});

// ============================================================
// THE WAY OUT — the exit choice (beat 8) and the chapter-end card (beat 9)
// ============================================================
scene('c1a_headlights', {
    speaker: 'System',
    text: () => `You step out into the night with the Codex against your chest, and stop.\n\nHeadlights. On the road in, coming fast. Across the camp, the light is on in Lindqvist's trailer, and through the window you can see him on the phone, one hand over his eyes.\n\nHe called someone.` +
        (sflag('lena_event') === 'gone' || sflag('lena_event') === 'searching' ? '' : `\n\n(The black car Farouk talked about. Early.)`),
    choices: [
        { text: 'Out through the old quarry on foot, now, to the Cairo road. Nobody sees you go.', onSelect: () => c1aExit('quiet') },
        { text: 'Call the Ministry: ask for Dr. Amira Sayed, Miriam\'s friend. Make it official.', onSelect: () => c1aExit('legal') },
        { text: 'Walk out to meet the car. Lindqvist said the Foundation would "look after" you.', onSelect: () => c1aExit('deal') },
    ],
});
function c1aExit(kind) {
    sflag('c1_exit', kind);
    if (sflag('lena_event') !== 'gone') { sflag('lena_event', 'gone'); storySync(); }
    if (kind === 'legal') { rel('amira', 15); rep('ministry', 10); }
    if (kind === 'deal') { rep('vasse', 10); storyPay(5000, 'An "advance" from the Foundation'); pocket("Vasse's card", 1, true); }
    startDialogue('c1a_exit_' + kind);
}
scene('c1a_exit_quiet', {
    speaker: 'System',
    text: `You take nothing but your pack and the book. Past the dark dormitory, past the last lamp, out between the pale blocks of the old quarry where the ancient masons cut the pyramids' stone.\n\nBehind you, the headlights sweep the camp and stop at Miriam's tent.\n\nBy two in the morning you're on the Cairo road with your thumb out and the lights of Giza behind you. A truck full of watermelons stops. The driver asks no questions, which in Egypt is its own kind of kindness.\n\nNobody knows you have it.`,
    choices: [{ text: 'Ride to Cairo.', onSelect: () => c1aChapterEnd() }],
});
scene('c1a_exit_legal', {
    speaker: 'Dr. Amira Sayed',
    text: () => `She answers on the second ring, wide awake.\n\n"Sayed." You tell her. The silence afterwards is long enough to hear her breathing change.\n\n"Stay exactly where you are. Don't give it to anyone, especially not anyone from my own building. I'm coming myself. Forty minutes."\n\nShe makes it in thirty-one, in a dusty Hyundai, still in her house clothes. The headlights on the road in see her Ministry badge in their beams, and turn back.\n\nAmira looks at the Codex in the scarf for a long time without touching it. Then at you.\n\n"Miriam's scarf," she says. "Right. ${PC.doctor}, you're coming to Cairo."`,
    choices: [{ text: 'Get in the car.', onSelect: () => c1aChapterEnd() }],
});
scene('c1a_exit_deal', {
    speaker: 'System',
    text: `The car is a black Mercedes, not a Land Cruiser. The driver gets out and opens the back door for you like a hotel doorman.\n\n"Dr. Lindqvist said you might need a lift," he says, in perfect English. "The Foundation looks after its people." There's an envelope on the back seat with your name on it. Five thousand pounds, and a card: CONRAD VASSE, WITH COMPLIMENTS.\n\nThe Codex is at the bottom of your pack, under your dirty shirts. The driver doesn't ask about your pack.\n\nNot yet.`,
    choices: [{ text: 'Ride to Cairo.', onSelect: () => c1aChapterEnd() }],
});
function c1aChapterEnd() {
    sflag('ch1_complete', true);
    for (const t of Story.s.tasks) if (!t.done && ['lena', 'midnight', 'store', 'storekey', 'trenches', 'wages', 'farouk', 'lindqvist', 'tent'].includes(t.id)) taskDone(t.id);
    Game.save();
    const f = Story.s.flags, L = [];
    L.push({ quiet: 'You left on foot through the quarry. Nobody knows you have the Codex.',
             legal: 'You called Dr. Amira Sayed. The Ministry knows, and so will anyone in the Ministry who talks.',
             deal: 'You rode out in the Foundation\'s car, with the Codex under your shirts and Vasse\'s envelope in your pocket.' }[f.c1_exit]);
    L.push({ paid: 'You paid the men\'s wages yourself. Forty men and a foreman from Quft remember that.',
             confronted: 'You made Lindqvist pay the men with the Foundation\'s money. He told you he\'d say it was you.',
             delayed: 'You made the men wait for their wages. They dug nothing for you.' }[f.payroll] || 'The wages were never settled.');
    if (f.lena_overheard) L.push('You heard the woman in black say Vasse\'s name. She doesn\'t know you were there.');
    else if (f.lena_photos) L.push('You photographed the midnight visitors, and their car\'s plate.');
    else if (f.met_lena) L.push('You met Lena Brandt face to face. She knows who you are.');
    else if (f.lena_knocked) L.push('You were knocked out behind Miriam\'s tent.' + (f.lena_has_page ? ' They took her notebook page.' : ''));
    else if (f.lena_missed) L.push('You missed the midnight car. Whoever it was went through Miriam\'s tent.');
    if (f.farouk_bribed) L.push('Uncle Farouk owes you. He has the key to the old causeway gate.');
    if (f.petamun_seal) L.push('You opened the old seal and took the bronze seal of Petamun.');
    if (f.mina === 'done') L.push('You paid off Mina\'s debt. The Rais\'s family in Quft owe you.');
    if (f.hana_q === 'done') L.push('Hana joined the painted sherds into Thoth\'s ibis, and gave you her wax.');
    if (f.lindqvist_papers) L.push('You kept Lindqvist\'s half-burned Foundation papers.');
    if (f.store_resealed) L.push('You resealed the find store with Hana\'s wax. Nobody knows it was opened.');
    L.push('Secrets of the plateau: ' + (Story.s.secretsN || 0) + ' of ' + SECRETS_1A.length + ' found.' + ((Story.s.secretsN || 0) === SECRETS_1A.length ? ' All of them.' : ''));
    EndCard.show('END OF CHAPTER ONE', 'THE GIZA DIG CAMP', L, 'Thursday night, Café El-Fishawy, Cairo. Father Bishoy is waiting for someone who isn\'t coming. Chapter Two, Cairo, is being built. Your choices are saved and will carry forward.');
}

// ============================================================
// INTERIORS: Miriam's tent, the dormitory, the site office
// ============================================================
Object.assign(STORY_SCRIPTS, {
    tent_codex: 'c1a_tent_desk', tent_journal: 'c1a_tent_books', tent_photos: 'c1a_tent_photos',
    dorm_awake: 'c1a_dorm_worker', dorm_graffiti: 'c1a_dorm_tally',
    for_manifest: 'c1a_office_ledger', for_sams_notes: 'c1a_office_bin',
});
scene('c1a_tent_desk', {
    speaker: 'System',
    text: `Miriam's desk: a folding table, a laptop with its hard drive taken out (neatly, with the right screwdriver), a mug with a skin of four-day-old tea.\n\nUnder the mug, an invitation card: THE VASSE FOUNDATION REQUESTS THE PLEASURE, a gala at the Egyptian Museum, last spring. On the back, in her hand: "Never again."\n\nAn empty map case, the long kind. Whatever it held, it wasn't a map.`,
    choices: [{ text: 'Leave everything as it is.', onSelect: () => { if (!sflag('desk_seen')) { sflag('desk_seen', true); sflag('vasse_named', true); storyNote('Miriam\'s desk', 'Her laptop\'s hard drive has been taken out, neatly. A Vasse Foundation gala invitation with "Never again." written on the back.'); } } }],
});
scene('c1a_tent_books', {
    speaker: 'System',
    text: `Her books, in a crate on its side: Gardiner's Egyptian Grammar, soft as cloth from use; a Coptic dictionary; Herodotus; and a thin blue volume of Demotic stories in translation, a bookmark halfway through.\n\nThe bookmarked story is about a prince called Setne, who went into an old tomb at Memphis to steal a magic book, and what it cost him.\n\nIn the margin, in pencil: "Coptos. The river. Why always the river?"`,
    choices: [{ text: 'Put it back.', onSelect: () => { if (!sflag('books_seen')) { sflag('books_seen', true); storyNote('Miriam\'s books', 'Bookmarked: the ancient story of Prince Setne, who stole a magic book from a tomb at Memphis and paid for it. Her pencil note: "Coptos. The river. Why always the river?"'); } } }],
});
scene('c1a_tent_photos', {
    speaker: 'System',
    text: `Photographs pinned to the tent wall. Miriam, sun-burned, laughing, a scar across the back of one hand, at a dozen digs. Miriam and a sharp-eyed Egyptian woman her own age, arms around each other outside the Egyptian Museum; on the back, "Amira & me, still the only two who read the footnotes."\n\nAnd one of the Rais, twenty years younger, holding up a small statue and grinning like a boy.`,
    choices: [{ text: 'Leave them.', onSelect: () => { if (!sflag('photos_seen')) { sflag('photos_seen', true); storyNote('Photographs', 'Miriam\'s closest friend: Dr. Amira Sayed, of the Ministry, "the only two who read the footnotes".'); } } }],
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
    choices: [{ text: 'Leave him to sleep.' }],
});
scene('c1a_dorm_tally', {
    speaker: 'System',
    text: () => `Chalk marks on a tent pole, in groups of five: the days since the men were last paid.` + (sflag('payroll') === 'paid' || sflag('payroll') === 'confronted' ? ` Somebody has rubbed them all out, and drawn a smiling face.` : ` Eleven.`),
    choices: [{ text: 'Leave it.' }],
});
scene('c1a_office_ledger', {
    speaker: 'System',
    text: `The payroll ledger. Every page since spring shows the same line: TRANSFER, VASSE FDN, GENEVA. The university's name stops appearing in April.\n\nThe last transfer came in the day before Miriam left. Nothing since.`,
    choices: [{ text: 'Close it.', onSelect: () => { if (!sflag('ledger_seen')) { sflag('ledger_seen', true); sflag('vasse_named', true); storyNote('The payroll ledger', 'Since April the Vasse Foundation has paid for the whole season. The transfers stopped the day Miriam left.'); } } }],
});
scene('c1a_office_bin', {
    speaker: 'System',
    text: () => sflag('saber') === 'told' && !hasItem('Half-burned papers')
        ? `The burn bin behind the desk, a steel drum with a grille. Most of it is ash. But the bottom of the drum was wet, and the fire didn't reach it: a wad of papers, brown at the edges.\n\nBank transfer slips from the Vasse Foundation. An email printout: "...security team will attend site to recover the item. Dr. Hale's cooperation is no longer required..." And a page of phone numbers with a Geneva code.`
        : `A steel drum with a grille, full of ash. It smells of burned paper.`,
    get choices() {
        if (sflag('saber') === 'told' && !hasItem('Half-burned papers')) return [{ text: 'Take the papers.', onSelect: () => {
            pocket('Half-burned papers'); sflag('lindqvist_papers', true); taskDone('saber');
            storyNote('Saber (side quest)', 'Done. From Lindqvist\'s burn bin: Vasse Foundation transfer slips, and an email: "security team will attend site to recover the item. Dr. Hale\'s cooperation is no longer required." Proof, one day, for someone who wants proof.');
            storyNotice('Someone, someday, will want to see these.');
        } }];
        return [{ text: 'Leave it.' }];
    },
});
