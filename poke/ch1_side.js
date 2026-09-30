// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-A SIDE QUESTS (poke/ch1_side.js)
// The bible's SQ-01A-01 to 11 (story/regions/ch01_opening_archaeologist.md), ported
// from the 3D build (ch1a_story.js, ch1a_extras.js, ch1a_places.js):
//   01 The Rais's Son: pay, the darts winnings, or race Hagg Sayed (here)
//   02 Hana's Conservation: the sherds (ch1_scenes.js), Hana's valuation, the sherd set (here)
//   03 The Tea Boy's Secret: Saber and the kettle (here), the burn bin (ch1_scenes.js)
//   04 The Truck of 1926: the glovebox diary (here), the four relics (detector.js)
//   05 Supply Line Blues: Uncle Hamid and the coupling pin (here)
//   06 Miriam's Caches: dug with the detector (detector.js), calling "A.S." (here)
//   07 Darts Night (here)
//   08 Bosta (bosta.js)
//   09 Pharaoh's Lentils: the five fossils (here)
//   10 The Lamp at the Tomb: the old woman, and the saint's tomb (here)
//   11 The Looters' Pit (here)
// The minigames (tea, darts, the sieve) are stand-ins until step 5 (playMinigame in story.js).
// ============================================================

Object.assign(ITEM_INFO, {
    'Painted tile: a lamp in a doorway': { key: 1, desc: 'From the old woman at the saint\'s tomb: a little painted tile, a lamp inside a doorway. "Where you see one, you may rest."' },
    'Faience amulet (Eye of Horus)': { key: 1, desc: 'A tiny blue-green faience wedjat, the Eye of Horus, the glaze still bright after four thousand years. The looters missed it.' },
    'Fossil': { desc: 'Nummulites: coin-shaped fossils from the limestone the pyramids are built of. Herodotus thought they were the builders\' lentils.' },
});

// ---- things you pick up off the ground (Game.examine calls this) ----
function storyPickup(kind) {
    const count = pre => Object.keys(Game.taken).filter(k => k.startsWith(pre)).length;
    if (kind === 'Painted sherd') {
        const n = count('ow_sherd');
        if (sflag('hana_q') === 'open' && hasItem('Painted sherd', 3) && !sflag('sherd_hint')) { sflag('sherd_hint', true); storyNotice('That\'s three. Hana wanted three.'); }
        if (n >= 8 && !sflag('sherd_set')) {
            sflag('sherd_set', true);
            const pay = sflag('hana_valuation') ? 300 : 250;
            storyPay(pay, sflag('hana_valuation') ? 'The sherd set (Hana\'s valuation)' : 'The register\'s bounty for the set');
            storyNote('The painted sherds', 'All eight. Laid out on your field table they fit: not one pot, but one hand. The same black flick, the same curve. Together the flicks become a bird: a long curved beak, one leg raised. An ibis. Somebody on this plateau spent a lifetime painting Thoth\'s bird.');
            storyNotice('All eight sherds: one painter, one ibis.');
        } else Toast.show('Painted sherd ' + n + ' of 8');
    }
    if (kind === 'Fossil') {
        const n = count('c1p_fossil');
        skillXP('excavation', 6);
        if (n >= 5 && !sflag('fossils_done')) {
            sflag('fossils_done', true); taskDone('fossils');
            storyNote('Pharaoh\'s lentils (side quest)', 'Five nummulites from the fossil pavement: "pharaoh\'s lentils". Herodotus was told they were the pyramid workers\' food turned to stone. They\'re 45-million-year-old sea creatures, and the pyramids are made of them.');
            storyNotice('Pharaoh\'s lentils: all five.');
        } else if (n < 5) { Toast.show('Nummulite ' + n + ' of 5'); if (n === 1) task('fossils', 'Find all five nummulite fossils on the fossil pavement.'); }
    }
}

// ============================================================
// SQ-01A-01 — HAGG SAYED'S HORSE RACE (the other way to clear Mina's debt)
// ============================================================
STORY_SCRIPTS.c1a_sayed = 'c1a_sayed';
scene('c1a_sayed', {
    speaker: 'Hagg Sayed',
    text: () => {
        if (sflag('mina') === 'done') return `Hagg Sayed touches his chest. "The boy's debt is settled. God is generous, and so, it seems, is the new doctor."`;
        if (sflag('race') === 'lost') return `"You rode well enough," Hagg Sayed says, which is a lie. "The debt is still fifteen hundred. Friday."`;
        if (sflag('mina') === 'open') return `A heavy man in a dark galabeya, holding two horses at the camp gate as if he owns the road, which, round Nazlet el-Samman, he more or less does.\n\n"You are the doctor who talks for Mina? Good. Fifteen hundred pounds, Friday. Or..." he pats the grey's neck "...you race me. To the quarry markers and back. You win, the boy owes nothing. You lose, the boy owes me the same, and I have had a nice evening."`;
        return `A heavy man in a dark galabeya, holding two horses by the camp gate. He nods to you, and goes back to watching the road. "Hagg Sayed. I keep horses under the pyramids. Tourists, weddings, films." He smiles. "And loans."`;
    },
    get choices() {
        const c = [];
        if (sflag('mina') === 'open' && !sflag('race')) c.push({ text: '"You\'re on. Which horse is mine?"', onSelect: () => sflag('race_pts', 0), nextScene: 'c1a_race1' });
        c.push({ text: '"Good night, Hagg."' });
        return c;
    },
});
function raceScore(n) { sflag('race_pts', (sflag('race_pts') || 0) + n); }
scene('c1a_race1', {
    speaker: 'System',
    text: `He gives you the grey ("she's old, she's wise, she's slower than my bay; that is fair") and swings up onto the bay himself. Half the camp has come to the gate. Somebody is taking bets. Saber is taking bets.\n\nThe Rais drops his handkerchief.`,
    choices: [
        { text: 'Kick hard off the line.', onSelect: () => raceScore(1), nextScene: 'c1a_race2' },
        { text: 'Let the grey find her own pace.', onSelect: () => raceScore(2), nextScene: 'c1a_race2' },
        { text: 'Tuck in behind the bay and let him break the wind.', onSelect: () => raceScore(1), nextScene: 'c1a_race2' },
    ],
});
scene('c1a_race2', {
    speaker: 'System',
    text: () => ((sflag('race_pts') || 0) >= 2 ? `The grey settles into a long, easy gallop that eats the sand. The bay is half a length ahead and working much harder.` : `The bay is away and two lengths clear; the grey is fighting you for her head.`) +
        `\n\nThe quarry markers come up out of the dark: pale blocks, the turn around them tight and rough with chips.`,
    choices: [
        { text: 'Take the turn tight, on the inside.', onSelect: () => raceScore(Math.random() < 0.6 ? 2 : 0), nextScene: 'c1a_race3' },
        { text: 'Swing wide where the footing is sure.', onSelect: () => raceScore(1), nextScene: 'c1a_race3' },
    ],
});
scene('c1a_race3', {
    speaker: 'System',
    text: `Out of the turn and home: the camp lamps, the crowd at the gate, the bay's hooves right beside you. Hagg Sayed is grinning and using his whip.`,
    choices: [
        { text: 'Ask her for everything, now.', onSelect: () => raceScore(skillLevel('riding') >= 1 ? 2 : 1), nextScene: 'c1a_race_end' },
        { text: 'Hold her till the last fifty metres, then go.', onSelect: () => raceScore(2), nextScene: 'c1a_race_end' },
    ],
});
scene('c1a_race_end', {
    speaker: 'System',
    text: () => sflag('race') === 'won'
        ? `The grey puts her nose in front at the gate by the width of a hand. The camp goes up like a wedding. Saber is paying out bets with the face of a ruined man.\n\nHagg Sayed slides down, breathing hard, and laughs until he has to hold the bay's saddle. "Mina's debt is nothing. Nothing! God is great. Next time you ride for me."\n\nThe Rais says nothing at all. He just takes your hand in both of his.`
        : `The bay is a length clear at the gate. The camp groans. Hagg Sayed slides down, delighted with himself, and pats your knee.\n\n"You rode well. She is old. So am I." He considers. "Fifteen hundred, still. I am not a monster."`,
    choices: [{ text: 'Get down off the grey.' }],
});
// the race is decided before its last scene shows (so the words match)
(function () {
    const c = STORY.c1a_race3.choices;
    c.forEach(ch => { const on = ch.onSelect; ch.onSelect = () => { on(); c1aRaceResult(); }; });
})();
function c1aRaceResult() {
    const won = (sflag('race_pts') || 0) >= 5;
    sflag('race', won ? 'won' : 'lost');
    skillXP('riding', won ? 90 : 60);
    clockAdvance(15);
    if (won) {
        sflag('mina', 'done'); rel('abdallah', 15); rel('workmen', 10, true); taskDone('mina');
        storyNote('The Rais\'s son (side quest)', 'Done. You beat Hagg Sayed on his own old grey mare, and Mina\'s debt is forgiven. The camp will talk about it for years.');
    } else storyNote('The Rais\'s son (side quest)', 'You lost the race to Hagg Sayed. Mina\'s debt is still 1,500 EGP (the Rais can take it from you, or the darts winnings, any time).');
}

// ============================================================
// SQ-01A-07 — DARTS NIGHT
// ============================================================
STORY_SCRIPTS.camp_darts = 'fun_dartboard';
scene('fun_dartboard', {
    speaker: 'System',
    text: () => sflag('darts_won')
        ? `The dartboard on the dormitory post. Your name is chalked on the plank now, above the Rais's 132. Somebody has drawn a crown on it.`
        : `A dartboard nailed to the dormitory post, and a plank with the camp record chalked on it: RAIS, 132. The Rais will tell you about it whether you ask or not.\n\nThe men run a tournament on Wednesday nights. It is Wednesday night.`,
    get choices() {
        const c = [];
        if (!sflag('darts_won')) c.push({ text: money() >= 200 ? 'Enter the tournament. (200 EGP stake: beat 132 to win)' : 'Enter the tournament. (you need 200 EGP)', onSelect: () => {
            if (money() < 200) return;
            storyPay(-200, 'Tournament stake');
            playMinigame('darts', { best: 132 }, r => { clockAdvance(20); c1aDartsResult(r.score, true); });
        } });
        c.push({ text: 'Throw a few for fun.', onSelect: () => playMinigame('darts', { best: 132 }, r => { clockAdvance(10); c1aDartsResult(r.score, false); }) });
        c.push({ text: 'Leave it.' });
        return c;
    },
});
function c1aDartsResult(score, tourney) {
    if (tourney && score > 132) {
        sflag('darts_won', true);
        rel('abdallah', 5, true); rel('workmen', 10, true);
        storyPay(2000, 'Tournament winnings');
        storyNote('Darts night (side quest)', 'You beat the Rais\'s 132 with ' + score + '. The men call you "Abu Ramy" now, the father of throwing. Nobody will explain the joke.' + (sflag('mina') === 'open' ? '\n\nThe stable owner who holds Mina\'s debt bet against you. The Rais might want to hear about that.' : ''));
        Dlg.open('System', `${score}. The Rais's chalk number falls. From the fire, a roar, and 2,000 pounds in crumpled notes. They're calling you "Abu Ramy" now.`);
    } else Dlg.open('System', `You score ${score}.` + (tourney ? ` The tournament goes on without you. (Beat 132 to win.)` : score > 132 ? ` Better than the Rais. Nobody saw.` : ''));
}

// ============================================================
// SQ-01A-03 — SABER, THE TEA BOY
// ============================================================
STORY_SCRIPTS.c1a_saber = 'c1a_saber';
STORY_SCRIPTS.ow_tea = 'c1a_tea';
scene('c1a_saber', {
    speaker: 'Saber',
    text: () => {
        const q = sflag('saber');
        if (q === 'told') return `"Did you look in the bin?" Saber whispers, delighted. "Did you?"`;
        if (q === 'poured') return `Saber inspects your glass against the lamp, very serious. Then he nods, once, like a judge.`;
        if (q === 'pour') return `"Well? Pour me a proper glass and I'll tell you. From high up. The foam is the whole point."`;
        return `A boy of maybe thirteen in an orange football shirt, tending the kettle like it's the most important job on the site, which, according to the men, it is.\n\n"Tea, doctor? Everyone has tea. Even the Swiss."`;
    },
    get choices() {
        const c = [], q = sflag('saber');
        if (q === 'poured') return [{ text: '"Well? That was a proper glass."', nextScene: 'c1a_saber_told' }];
        if (!q) c.push({ text: '"You know everything that happens here, don\'t you?"', nextScene: 'c1a_saber_know' });
        if (q === 'pour') c.push({ text: 'Pour a glass.', onSelect: c1aPourTea });
        c.push({ text: '"Later, Saber."' });
        return c;
    },
});
scene('c1a_saber_know', {
    speaker: 'Saber',
    text: `He grins. "Everything. But I don't tell anybody who can't pour tea. That's the rule. The Rais made it."\n\nIt is very obviously not the Rais's rule.`,
    choices: [{ text: '"Fine. Show me the kettle."', onSelect: () => { sflag('saber', 'pour'); storyNote('Saber (side quest)', 'The tea boy knows something, but only tells people who can pour a proper glass of tea: high, with foam. The kettle is by the workers\' fire.'); task('saber', 'Pour Saber a proper glass of tea (the kettle by the workers\' fire).'); } }],
});
scene('c1a_saber_told', {
    speaker: 'Saber',
    text: `Saber looks both ways like a spy in a film.\n\n"The night after she left, Doctor Lindqvist burned papers. In the bin in the site office. At two in the morning! But the wind was blowing and he's a very bad fire-maker. Not everything burned."\n\n"I didn't touch it. I'm not stupid."`,
    choices: [{ text: '"You\'re not stupid at all." (The site office is by the dormitory.)', onSelect: () => { sflag('saber', 'told'); rel('saber', 10, true); storyNote('Saber (side quest)', 'Lindqvist burned papers in the site office bin the night after Miriam left. Not everything burned.'); task('saber', 'Look in the burn bin in the site office (the workers\' camp).'); } }],
});
scene('c1a_tea', {
    speaker: 'System',
    text: () => `A blackened kettle on the brazier's edge, a tray of little glasses, a bunch of fresh mint. The workers pour from a height: the foam is the whole point.`,
    choices: [{ text: 'Pour a glass.', onSelect: c1aPourTea }, { text: 'Leave it.' }],
});
function c1aPourTea() {
    playMinigame('tea', {}, r => {
        clockAdvance(5);
        if (!r.ok) { Dlg.open('System', 'Mostly on the tray. Saber pretends not to have seen.'); return; }
        if (!hasItem('Mint Tea')) pocket('Mint Tea', 1, true);
        if (sflag('saber') === 'pour') { sflag('saber', 'poured'); Dlg.open('System', 'You pour from as high as you dare. The tea lands with a hiss and a proper head of foam.\n\nAcross the fire, Saber has stopped pretending not to watch. He nods. Go and talk to him.'); }
        else Dlg.open('System', 'You pour from as high as you dare. A proper head of foam. You keep the glass: somebody will appreciate it.');
    });
}

// ============================================================
// SQ-01A-05 — SUPPLY LINE BLUES
// ============================================================
STORY_SCRIPTS.c1a_hamid = STORY_SCRIPTS.carts = 'c1a_hamid';
STORY_SCRIPTS.fl_crates = 'c1a_crates';
scene('c1a_hamid', {
    speaker: 'Uncle Hamid',
    text: () => {
        const q = sflag('hamid');
        if (q === 'fixed') return `Uncle Hamid waves from the skip line, which is running beautifully and very loudly.`;
        if (q === 'open') return `"Any luck with the coupling pin? Sorted crates, by the site office. If the boys didn't sell it."`;
        return `A broad man in a flat cap, glaring at a line of rail skips that is not moving.\n\n"Doctor. The line is jammed. The coupling pin sheared on the third skip and we have no spare. No line, no spoil moved. No spoil moved, no dig. No dig..." he spreads his hands at the universe.`;
    },
    get choices() {
        const q = sflag('hamid'), c = [];
        if (!q) c.push({ text: '"Where would a spare be?"', onSelect: () => { sflag('hamid', 'open'); storyNote('Supply line (side quest)', 'Uncle Hamid\'s skip line is jammed: a sheared coupling pin. There might be a spare in the sorted crates by the site office.'); task('hamid', 'Find a spare coupling pin for Uncle Hamid (the sorted crates by the site office).'); }, nextScene: 'c1a_hamid' });
        if (q === 'open' && hasItem('Coupling pin')) c.push({ text: 'Hand him the coupling pin.', onSelect: () => {
            dropItem('Coupling pin'); sflag('hamid', 'fixed'); rel('workmen', 10); rel('hamid', 10, true); storyPay(1500, 'Supply line fixed'); taskDone('hamid');
            storyNote('Supply line (side quest)', 'Done. The line runs. Uncle Hamid paid you from the site\'s repair money and the workmen noticed.');
            startDialogue('c1a_hamid_fixed');
        } });
        if (hasItem("Hamid's multitool")) c.push({ text: 'Show him the multitool with HAMID scratched on it.', onSelect: () => { dropItem("Hamid's multitool"); rel('hamid', 5, true); storyPay(50, 'Hamid\'s thanks'); startDialogue('c1a_hamid_tool'); } });
        c.push({ text: q ? 'Later.' : '"Good luck with it."' });
        return c;
    },
});
scene('c1a_hamid_fixed', {
    speaker: 'Uncle Hamid',
    text: `He hammers it home in four blows, and the whole line lurches, groans, and starts to crawl. He slaps your shoulder hard enough to hurt.\n\n"Fifteen hundred from the repair money. Don't tell the Swiss."`,
    choices: [{ text: '"Tell them what?"' }],
});
scene('c1a_hamid_tool', {
    speaker: 'Uncle Hamid',
    text: `"My multitool!" He turns it over like a lost child. "Two years! Where?" You tell him. "In the sand. Of course in the sand." He presses fifty pounds on you and won't hear no.`,
    choices: [{ text: '"Keep it out of the sand."' }],
});
scene('c1a_crates', {
    speaker: 'System',
    text: () => sflag('hamid') === 'open' && !sflag('pin_found')
        ? `Crates sorted by someone who cared: brushes, trowels, rope, a crate of rusted rail fittings. Under the fittings, greased and wrapped in newspaper: a coupling pin.`
        : `Crates sorted by someone who cared: brushes by size, trowels by wear, labels in Miriam's square capitals. SMALL FINDS BAGS. PHOTO SCALES. DO NOT SELL. THIS MEANS YOU, SABER.`,
    get choices() {
        if (sflag('hamid') === 'open' && !sflag('pin_found')) return [{ text: 'Take the coupling pin.', onSelect: () => { sflag('pin_found', true); pocket('Coupling pin'); task('hamid', 'Take the coupling pin to Uncle Hamid at the supply line.'); } }];
        return [{ text: 'Leave them tidy.' }];
    },
});

// ============================================================
// SQ-01A-04 — THE TRUCK OF 1926 (the relics are dug with the detector)
// ============================================================
STORY_SCRIPTS.ow_wreck = 'c1a_wreck';
scene('c1a_wreck', {
    speaker: 'System',
    text: `An expedition truck from the 1920s, buried to the doors, the paint sandblasted back to bare metal. You can just read the stencil on the tailgate: HARVARD–BOSTON EXPEDITION, 1926.`,
    get choices() {
        return [{ text: sflag('wreck_glovebox') ? 'Look in the glovebox again.' : 'Check the glovebox.', onSelect: () => {
            if (sflag('wreck_glovebox')) { startDialogue('c1a_wreck_empty'); return; }
            sflag('wreck_glovebox', true); storyPay(40, 'Coins in the glovebox');
            storyNote('The truck of 1926 (side quest)', 'A 1926 expedition diary: an old woman with a lamp sitting by the shaft at night, "as if she were waiting for someone". The workmen called her one of the Keepers.' + ((sflag('relics_1926') || 0) < 4 ? '\n\nThe expedition camped round this truck. The detector might find what they left.' : ''));
            if ((sflag('relics_1926') || 0) < 4) task('relics', 'Find the four relics of the 1926 expedition with the detector.');
            startDialogue('c1a_wreck_found');
        } }, { text: 'Leave it to the sand.' }];
    },
});
scene('c1a_wreck_found', { speaker: 'System', text: `Maps of a Cairo that no longer exists, 40 EGP in coins someone lost later, and a diary in a tin box, the pages foxed but readable. The last entry, 1926:\n\n"Saw the old woman again at the causeway tonight, sitting with a lamp by the shaft as if she were waiting for someone. The workmen will not go near her. They call her one of the Keepers."`, choices: [{ text: 'Close the diary.' }] });
scene('c1a_wreck_empty', { speaker: 'System', text: `Only the maps now. You leave them for the next archaeologist.`, choices: [{ text: 'Fair.' }] });
// all four relics: the Ministry logs them (the bible's reward), and the photo is for the Rais
function c1aRelicsDone() {
    if (sflag('relics_done')) return;
    sflag('relics_done', true); taskDone('relics');
    storyPay(600, 'Relics logged with the Ministry'); rep('ministry', 5, true); skillXP('excavation', 40);
    storyNote('The truck of 1926 (side quest)', 'Done. All four relics of the 1926 Harvard–Boston expedition: a Kodak camera, a trowel, a brass find tag, and a glass plate photograph of the dig crew, with a boy who has the Rais\'s face. (Show the Rais.)');
    if (!sflag('rais_photo')) task('photo', 'Show the Rais the glass plate photograph from 1926.');
}
scene('c1a_rais_photo', {
    speaker: R,
    text: `He holds the plate up to the fire and doesn't say anything for a long time.\n\n"My grandfather," he says finally, and touches the boy with one fingertip. "He told us about this. The Americans with the camera. He said they paid in silver and never lied." He hands it back very carefully. "No. You keep it. Put it in your museum, with his name. Abdallah Mahmoud Qufti."`,
    choices: [{ text: '"I will."', onSelect: () => { sflag('rais_photo', true); rel('abdallah', 12); taskDone('photo'); } }],
});

// ============================================================
// SQ-01A-06 — MIRIAM'S SPARE PHONE: calling "A.S."
// ============================================================
scene('c1a_phone_found', {
    speaker: 'System',
    text: `You switch it on. One bar of signal, a battery two-thirds full, and one number in the contacts: "A.S."`,
    choices: [{ text: 'Call "A.S." now.', nextScene: 'c1a_call_amira' }, { text: 'Not yet. (You can call from Miriam\'s desk, in her tent.)' }],
});
STORY_SCRIPTS.tent_codex = () => hasItem("Miriam's spare phone") && !sflag('called_amira') && !sflag('c1_exit') ? 'c1a_desk_phone' : 'c1a_tent_desk';
scene('c1a_desk_phone', {
    speaker: 'System',
    text: `Miriam's desk. Her spare phone is warm in your pocket, the one number in it: "A.S."`,
    choices: [{ text: 'Call "A.S."', nextScene: 'c1a_call_amira' }, { text: 'Look at the desk.', nextScene: 'c1a_tent_desk' }, { text: 'Not yet.' }],
});
scene('c1a_call_amira', {
    speaker: 'Dr. Amira Sayed',
    text: `It rings once.\n\n"Miriam?" A woman's voice, wide awake at this hour, and afraid. "Miriam, where are you, I've been..."\n\nYou tell her who you are. The silence goes on long enough that you check the signal.\n\n"Sayed. Amira Sayed, Ministry of Antiquities. I'm her friend." Another silence. "Why do you have her emergency phone?"`,
    choices: [
        { text: 'Tell her everything you know.', onSelect: () => { sflag('called_amira', true); rel('amira', 12); rep('ministry', 5, true); }, nextScene: 'c1a_call_amira2' },
        { text: '"I found it. I thought you should know. That\'s all, for now."', onSelect: () => { sflag('called_amira', true); rel('amira', 4, true); }, nextScene: 'c1a_call_amira2' },
    ],
});
scene('c1a_call_amira2', {
    speaker: 'Dr. Amira Sayed',
    text: `"Listen to me. Don't tell anyone at the camp you've called me. Not Lindqvist. Especially not Lindqvist." Her voice steadies. "If you find what she found, anything she left, you call me before you call anybody else. Before the police. Before my own Ministry. Promise."`,
    choices: [{ text: '"I promise."', onSelect: () => storyNote('Dr. Amira Sayed', 'Miriam\'s friend at the Ministry: "A.S." on Miriam\'s emergency phone. "If you find what she found, call me before anybody else. Especially not Lindqvist."') }],
});
// the legal exit remembers the promise
(function () {
    const def = STORY.c1a_exit_legal, base = def.text;
    def.text = () => sflag('called_amira')
        ? `She answers before it's finished ringing. She's had the phone in her hand since you called her earlier.\n\n"You found it." Not a question. "Stay where you are. I'm coming myself."\n\nShe makes it in twenty-six minutes, in a dusty Hyundai, still in her house clothes. The headlights on the road in see her Ministry badge in their beams, and turn back.\n\nAmira looks at the Codex in the scarf for a long time without touching it. Then at you.\n\n"Miriam's scarf," she says. "Right. ${PC.doctor}, you kept your promise. You're coming to Cairo."`
        : base();
})();

// ============================================================
// SQ-01A-10 — THE LAMP AT THE TOMB (the old woman is there at night)
// ============================================================
STORY_SCRIPTS.c1p_oldwoman = 'c1p_oldwoman';
STORY_SCRIPTS.c1p_maqam = 'c1p_maqam';
scene('c1p_oldwoman', {
    speaker: 'An Old Woman',
    text: () => {
        if (sflag('codex')) return `The old woman looks at your pack, not at you, for a long moment.\n\n"So. You have it." Her voice is soft, kind, and absolutely unafraid. "Take it to the old man at the café, my child. He reads. He doesn't keep." She goes back to her lamp.`;
        if (sflag('oldwoman')) return `She's trimming the lamp's wick with her fingers. "Still here, my child? The night is long."`;
        return `A small old woman in black sitting on a mat by the tomb door, a brass lamp in her lap. She could be anybody's grandmother. She looks at you as if she's been expecting you, and not especially pleased about it.\n\n"You're the new one. At the dig." She tilts the lamp. "The last one went down into the ground and came up with plaster on her hands. Be careful what you bring up, my child. Some things are only sleeping."`;
    },
    get choices() {
        if (sflag('codex') || sflag('oldwoman')) return [{ text: 'Leave her with her lamp.' }];
        return [
            { text: '"Do you know where Dr. Hale went?"', onSelect: () => sflag('oldwoman', true), nextScene: 'c1p_oldwoman2' },
            { text: '"Good night, Hajja."', onSelect: () => { sflag('oldwoman', true); rep('keepers', 2, true); } },
        ];
    },
});
scene('c1p_oldwoman2', {
    speaker: 'An Old Woman',
    text: `"Somewhere safe." She says it as if it's the end of the matter. "Safer than here."\n\nShe hands you something from her lap: a little tile, painted, a lamp inside a doorway. "For your pocket. You'll see more of these. Where you see one, you may rest."`,
    choices: [{ text: 'Take the tile.', onSelect: () => { pocket('Painted tile: a lamp in a doorway'); rep('keepers', 5, true); storyNote('The old woman with the lamp', 'At the sheikh\'s tomb, at night: an old woman in black who knew about Miriam ("somewhere safe") and about the plaster on her hands. She gave you a painted tile, a lamp in a doorway: "Where you see one, you may rest." (The 1926 diary mentions an old woman with a lamp at the shaft.)'); storyNotice('Something about her will matter.'); } }],
});
scene('c1p_maqam', {
    speaker: 'System',
    text: `A village saint's tomb, a maqam: a whitewashed cube under a dome, a green door, rag flags on a pole snapping in the wind. Somebody holy is buried here, long enough ago that nobody agrees who. People still come: there are candle stubs by the door, and a lamp burning in the niche.`,
    choices: [
        { text: 'Light a candle stub from the lamp.', onSelect: () => { if (!sflag('maqam_candle')) { sflag('maqam_candle', true); rep('keepers', 3, true); } } },
        { text: 'Leave it in peace.' },
    ],
});

// ============================================================
// SQ-01A-11 — THE LOOTERS' PIT
// ============================================================
STORY_SCRIPTS.c1p_looterpit = 'c1p_looterpit';
scene('c1p_looterpit', {
    speaker: 'System',
    text: () => sflag('looterpit') ? `The looters' pit. Nothing more down there.` : `A fresh hole at the edge of a tomb chapel, spoil thrown back carelessly, a broken shovel. Robbers, and recently. They went down a man's height and gave up.\n\nIn the spoil, something glints that they missed.`,
    get choices() {
        if (sflag('looterpit')) return [{ text: 'Leave it.' }];
        return [
            { text: 'Pick it out of the spoil.', onSelect: () => { sflag('looterpit', 'taken'); pocket('Faience amulet (Eye of Horus)'); skillXP('excavation', 20); storyNote("Looters' pit (side quest)", 'Someone has been digging into the workers\' cemetery at night. You found a faience Eye of Horus amulet they missed. (Report it, or not.)'); startDialogue('c1p_amulet'); } },
            { text: 'Leave it for the Ministry to find.', onSelect: () => { sflag('looterpit', 'left'); rep('ministry', 3, true); storyNote("Looters' pit (side quest)", 'Fresh robbers\' digging in the workers\' cemetery. You left the amulet they missed where it was, for the Ministry\'s inspectors.'); } },
        ];
    },
});
scene('c1p_amulet', { speaker: 'System', text: `A tiny blue-green faience amulet, the wedjat, the Eye of Horus, no bigger than a fingernail, the glaze still bright after four thousand years. Hana would want to see it. So would the men who dug this hole.`, choices: [{ text: 'Keep it safe.' }] });
// Hana will log it for the Ministry, if you let her
scene('c1a_hana_amulet', {
    speaker: 'Hana',
    text: `She goes very still, then reaches for her loupe. "Where did you... the cemetery? Somebody's digging in the cemetery?" She turns the Eye under the lamp. "Twelfth dynasty glaze. Perfect." A breath. "I'll log it tonight and it goes to the inspectorate in the morning. Unless you have a reason it shouldn't."`,
    choices: [
        { text: '"Log it. It belongs in a museum."', onSelect: () => { dropItem('Faience amulet (Eye of Horus)'); sflag('amulet_logged', true); rep('ministry', 3, true); rel('hana', 5, true); storyNote("Looters' pit (side quest)", 'Done. Hana logged the faience Eye of Horus for the inspectorate, and reported the looters\' digging.'); } },
        { text: '"I\'ll hold on to it a while."', onSelect: () => rel('hana', -3, true) },
    ],
});

// ============================================================
// HANA'S FINDS TRAY (by her table)
// ============================================================
STORY_SCRIPTS.c1a_finds = 'c1a_finds';
scene('c1a_finds', {
    speaker: 'System',
    text: () => `Hana's finds tray, under a lamp bent low on its arm, each piece on its own square of acid-free card:\n\n• A seated statuette in painted limestone, the length of your hand: an official on a block seat, hands on his knees, a black wig, a patient face. Old Kingdom: somebody who served a pyramid's owner, and wanted to be remembered sitting down.\n• A leather sandal, the thong still stitched, the sole worn thin at the heel.\n• A scrap of papyrus, curled like a dry leaf: a column of Demotic in faded black, bread and beer, and the names of the men who were owed it.` +
        (sflag('met_hana') ? `\n\n"The statuette came out of Trench B," Hana says without looking up. "Before Miriam backfilled it. She wouldn't let me put it in the store. She said the store wasn't safe any more."` : ''),
    choices: [{ text: 'Look closely, and put everything back exactly.', onSelect: () => { if (!sflag('finds_tray')) { sflag('finds_tray', true); skillXP('excavation', 20); storyNote("Hana's finds", 'A seated Old Kingdom statuette from Trench B, a leather sandal, and a Demotic papyrus of ration accounts. Miriam wouldn\'t let Hana put the statuette in the find store: "the store wasn\'t safe any more."'); } } }],
});

// ============================================================
// THE BEDOUIN SHELTER: dates for the road (and for Bosta)
// ============================================================
STORY_SCRIPTS.ow_shelter = 'c1a_shelter';
scene('c1a_shelter', {
    speaker: 'System',
    text: `Poles and goat-hair cloth, a ring of blackened stones, a water skin hung from the ridge-pole. Bedouin, gone for the season, or just gone for the night. A clay dish of dates sits covered on a flat stone, the way you leave food for a guest.`,
    get choices() {
        if (sflag('shelter_dates')) return [{ text: 'Leave everything as it is.' }];
        return [{ text: 'Take a handful of dates for the road.', onSelect: () => { sflag('shelter_dates', true); pocket('Dates', 3); rep('bedouin', 1, true); } }, { text: 'Leave everything as it is.' }];
    },
});
