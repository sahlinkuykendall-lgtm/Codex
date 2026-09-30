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
                sflag('hana_q', 'done'); rel('hana', 15); taskDone('hana_sherds');
                storyNote('Hana\'s conservation (side quest)', 'Done. Hana joined the sherds: one potter, one ibis. She gave you a stick of conservation wax, "for anything you need to close again without anyone knowing."');
                startDialogue('c1a_hana_done');
            } });
        }
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
