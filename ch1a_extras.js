// ============================================================
// CHAPTER 1-A — EXTRAS (ch1a_extras.js)
// The systems wired into the camp, and the pieces of the bible that
// were missing from the first build:
//   - XP from digging, sieving, reading, sneaking, photographing
//   - thirst and hunger: the well, the water barrels, tea, the cooking table
//   - failure states: the old seal's dart (injured); slipping into the
//     tent behind Lena's men (knocked out, robbed of Miriam's page)
//   - the phone: messages, and a call on Miriam's spare phone to "A.S."
//   - Miriam's spare phone (a cache), the quarry mason's marks, Hagg
//     Sayed's horse race for Mina's debt, Hana's appraisal discount,
//     four relics of the 1926 expedition around the old truck
// Loaded after ch1_dog.js and story_systems.js.
// ============================================================

// small helper: run something after a scene choice without replacing it
function afterChoice(sceneId, match, fn) {
    const sc = storyData[sceneId];
    if (!sc || !sc.choices) return;
    const c = sc.choices.find(q => typeof q.text === 'string' ? q.text.includes(match) : true);
    if (!c) return;
    const on = c.onSelect;
    c.onSelect = function () { fn(); if (on) on.apply(this, arguments); };
}

// ============================================================
// XP — learning by doing
// ============================================================
afterChoice('c1a_trenchA_find', 'Fold', () => skillXP('excavation', 45, 'a clean find'));
afterChoice('c1a_trenchC', 'Note', () => { if (!sflag('xp_stake')) { sflag('xp_stake', true); skillXP('coptic', 45, 'reading the stake'); } });
afterChoice('c1a_digshed', 'Photograph', () => skillXP('photography', 10));
afterChoice('puzzle_glyph_solved', 'bronze', () => { skillXP('hieroglyphs', 70, 'the old seal'); skillXP('greek', 20); });
afterChoice('c1a_codex', 'Wrap', () => skillXP('greek', 35, 'the Codex\'s first page'));
afterChoice('c1a_lena_photo', 'Check', () => skillXP('photography', 40, 'photographs in the dark'));
afterChoice('c1a_lena_listen', 'breath', () => skillXP('stealth', 45, 'unseen'));
afterChoice('c1a_hana_done', 'Pocket', () => skillXP('excavation', 25));
OW.sherds.forEach((_, i) => afterChoice('ow_sherd' + i, 'Bag', () => skillXP('excavation', 6)));
OW.caches.forEach((_, i) => afterChoice('ow_cache' + i, 'Take', () => skillXP('excavation', 12)));

// the sieve: XP per find, Hana's appraisal (+20%) and your Excavation (+10% a level above 3)
(function () {
    const _fin = mgSieveFinish;
    mgSieveFinish = function () {
        const S2 = MG.sieve;
        _fin();
        if (!storyOn() || !S2) return;
        const finds = S2.bagged.filter(n => !/key/i.test(n)).length;
        skillXP('excavation', finds * 10);
        const pct = (sflag('hana_q') === 'done' ? 0.2 : 0) + Math.max(0, skillLevel('excavation') - 3) * 0.1;
        const bonus = Math.round(S2.earned * pct);
        if (bonus > 0) {
            storyPay(bonus, 'Appraisal bonus');
            const line = mgEl('mg-result-line');
            line.textContent += `  (+${bonus} EGP: ${sflag('hana_q') === 'done' ? 'Hana\'s valuation' : 'a trained eye'}.)`;
        }
    };
})();
// the sherd set: Hana values them better too
afterChoice('ow_sherds_all', 'Log', () => { if (sflag('hana_q') === 'done') storyPay(60, 'Hana\'s valuation'); skillXP('excavation', 40, 'the ibis set'); });

// ============================================================
// THIRST AND HUNGER
// ============================================================
afterChoice('ow_well', 'Haul', () => { if (!(gameState.flags.ow_well_used && Date.now() - gameState.flags.ow_well_used < 90000)) drink(70, 'COLD WELL WATER'); });
scene('flavor_water', {
    speaker: 'System',
    text: `Water barrels, blue plastic, a tin cup on a string. Two workmen stop talking when you come close, then start again in a lower voice about their wages.`,
    choices: [
        { text: 'Drink a cup or two.', onSelect: () => { drink(45, 'A CUP OF WATER'); end(); } },
        { text: 'Move on.', onSelect: end },
    ],
});
scene('flavor_cooking_table', {
    speaker: 'System',
    text: () => (S().ateAt != null && S().clock - S().ateAt < 180)
        ? `The cook sees you coming and laughs. "Again? You ate an hour ago. Come back later, habibi."`
        : `The cooking table: a gas ring, a vast pot of lentils, a crate of tomatoes, bread wrapped in cloth. The cook waves a ladle at you like a threat and a promise.\n\n"Sit. Eat. Nobody on this site goes hungry — not even the Swiss."`,
    get choices() {
        const c = [];
        if (!(S().ateAt != null && S().clock - S().ateAt < 180)) c.push({ text: 'Eat a bowl of lentils with bread.', onSelect: () => { S().ateAt = S().clock; eat(65, 'LENTILS AND BREAD'); rel('workmen', 2, true); clockAdvance(15); end(); } });
        c.push({ text: 'Move on.', onSelect: end });
        return c;
    },
});
(function () {
    const _fin = mgTeaFinish;
    mgTeaFinish = function (kind) { _fin(kind); if (storyOn() && kind !== 'over') drink(kind === 'perfect' ? 18 : 10); };
})();

// ============================================================
// FAILURE STATES
// ============================================================
// the old seal's dart
scene('puzzle_glyph_fail', {
    speaker: 'System',
    text: `Wrong stone. The core flashes red and something hisses out of the rock — a cedar dart that opens a hot line across your calf before it buries itself in the timber brace.\n\nThen, grinding, the four stones shift round the ring into new places. The seal remembers being touched wrongly. It's the order of the animals that matters, not where they sit.`,
    choices: [{ text: 'Grit your teeth and step back.', onSelect: () => { setInjured(true, 'A cedar dart grazed your calf'); end(); } }],
});
// resting heals; Hana has a first-aid kit
(function () {
    const _w = c1aWaitChoices;
    c1aWaitChoices = function (where) {
        const c = _w(where);
        const rest = c.find(q => /Rest a while|Wait until/.test(q.text));
        for (const q of c) if (/Rest a while|Wait until/.test(q.text)) {
            const on = q.onSelect;
            q.onSelect = function () { const inj = S().injured; on.apply(this, arguments); if (inj) setInjured(false, 'Rest took the worst of it'); };
        }
        return c;
    };
})();
(function () {
    const base = Object.getOwnPropertyDescriptor(storyData['c1a_hana'], 'choices').get;
    Object.defineProperty(storyData['c1a_hana'], 'choices', {
        get() {
            const c = base.call(this);
            if (S().injured) c.unshift({ text: '"Hana — have you got a first-aid kit?"', onSelect: () => { setInjured(false, 'Hana cleaned and bound it'); rel('hana', 4, true); skillXP('firstAid', 20); startDialogue('c1a_hana_aid'); } });
            return c;
        }, configurable: true,
    });
})();
scene('c1a_hana_aid', { speaker: 'Hana', text: `She has you sit on a crate under the lamp and cleans the cut with a professional's lack of sympathy.\n\n"Cedar. Old cedar." She holds up the splinter she's pulled out, interested despite herself. "Where on earth did you get shot with an antique?"`, choices: [{ text: '"Long story."', onSelect: end }] });

// slipping into the tent behind Lena's men
(function () {
    const sc = storyData['c1a_lena'];
    sc.choices.splice(2, 0, { text: 'Slip into the back of the tent while they\'re busy, and see what they\'ve found.', nextScene: 'c1a_lena_slip' });
})();
scene('c1a_lena_slip', {
    speaker: 'System',
    text: `You work round to the back of the tent, lift the canvas, and get one knee inside —\n\n— and a hand you never saw closes on your collar. The last thing you hear is the woman's voice, bored: "Gently. We're not animals."`,
    choices: [{ text: '…', onSelect: () => {
        sflag('lena_knocked', true);
        const had = gameState.inventory.includes("Miriam's notebook page");
        if (had) sflag('lena_has_page', true);
        c1aLenaLeave(false);
        const [bx, bz] = ch1At('rest_brazier');
        knockOut({ wakeAt: [bx + 60, bz + 70], hours: 1.5, take: ["Miriam's notebook page"], injure: true, scene: 'c1a_woke' });
    } }],
});
scene('c1a_woke', {
    speaker: R(),
    text: () => `Firelight. A glass of tea being held against your lips. The Rais's face, very close, very calm.\n\n"Farouk found you behind the director's tent. They were gone. They left you by our fire — polite people." He puts the glass in your hand. "They went through your pockets."` +
        (sflag('lena_has_page') ? `\n\nMiriam's notebook page is gone. You remember every word of it — but now so do they.` : ''),
    choices: [{ text: 'Drink the tea.', onSelect: () => {
        drink(15);
        storyNote('The midnight car', 'You tried to slip into Miriam\'s tent behind the searchers and were knocked out. You woke by the workers\' fire an hour and a half later.' + (sflag('lena_has_page') ? ' They took Miriam\'s notebook page — whoever they work for now knows about the shaft and the find store.' : ''));
        rel('abdallah', 3, true);
        end();
    } }],
});

// ============================================================
// THE PHONE — messages and calls
// ============================================================
(function () {
    const _start = storyChapterStart;
    storyChapterStart = function () {
        _start();
        storyMessage('Dept. of Egyptology', 'Advance of 8,000 EGP paid into your account for the Giza Western Field Survey. The Ministry expects the season report by the 30th. Good luck — and do try to keep the Swiss happy.');
        S().messages.forEach(m => m.unread = true);
    };
    // midnight: an unknown number
    const _mid = c1aLenaArrive;
    c1aLenaArrive = function () {
        const was = sflag('lena_event');
        _mid();
        if (!was && sflag('lena_event')) setTimeout(() => storyMessage('Unknown number', 'Go to bed, Doctor. She would want you to.'), 2500);
    };
})();
phoneAddCall({ name: 'A.S. (on Miriam\'s phone)', when: () => gameState.inventory.includes("Miriam's spare phone") && !sflag('called_amira') && !S().c1_exit, scene: 'c1a_call_amira' });
scene('c1a_call_amira', {
    speaker: 'Dr. Amira Sayed',
    text: `It rings once.\n\n"Miriam?" A woman's voice, wide awake at this hour, and afraid. "Miriam, where are you, I've been —"\n\nYou tell her who you are. The silence goes on long enough that you check the signal.\n\n"Sayed. Amira Sayed, Ministry of Antiquities. I'm her friend." Another silence. "Why do you have her emergency phone?"`,
    choices: [
        { text: 'Tell her everything you know.', onSelect: () => { sflag('called_amira', true); rel('amira', 12); rep('ministry', 5, true); }, nextScene: 'c1a_call_amira2' },
        { text: '"I found it. I thought you should know. That\'s all, for now."', onSelect: () => { sflag('called_amira', true); rel('amira', 4, true); }, nextScene: 'c1a_call_amira2' },
    ],
});
scene('c1a_call_amira2', {
    speaker: 'Dr. Amira Sayed',
    text: `"Listen to me. Don't tell anyone at the camp you've called me. Not Lindqvist. Especially not Lindqvist." Her voice steadies. "If you find what she found — anything she left — you call me before you call anybody else. Before the police. Before my own Ministry. Promise."`,
    choices: [{ text: '"I promise."', onSelect: () => { storyNote('Dr. Amira Sayed', 'Miriam\'s friend at the Ministry — "A.S." on Miriam\'s emergency phone. "If you find what she found, call me before anybody else. Especially not Lindqvist."'); end(); } }],
});
(function () {
    const def = storyData['c1a_exit_legal'];
    const base = def.text;
    def.text = () => sflag('called_amira')
        ? `She answers before it's finished ringing. She's had the phone in her hand since you called her earlier.\n\n"You found it." Not a question. "Stay where you are. I'm coming myself."\n\nShe makes it in twenty-six minutes, in a dusty Hyundai, still in her house clothes. The headlights on the plateau road see her Ministry badge in their beams — and turn back.\n\nAmira looks at the Codex in the scarf for a long time without touching it. Then at you.\n\n"Miriam's scarf," she says. "Right. ${PC.doctor} — you kept your promise. You're coming to Cairo."`
        : base();
})();

// ============================================================
// MIRIAM'S SPARE PHONE (one of her buried caches)
// ============================================================
OW.caches[5].text = 'Under a flat stone, wrapped in orange survey tape: a cheap phone, charged and switched off, and 150 EGP. Miriam\'s emergency kit. One number saved in it: "A.S."\n\n(Open your phone with P — you can call it from Contacts.)';
OW.caches[5].reward = { funds: 150, miriamPhone: true };
storyData['ow_cache5'].text = 'The detector shrieks. You dig with your hands.\n\n' + OW.caches[5].text;
(function () {
    const _r = owReward;
    owReward = function (r) {
        if (r && r.miriamPhone) { pocket("Miriam's spare phone"); storyNote('Miriam\'s spare phone', 'From one of Miriam\'s buried caches: an emergency phone with one number saved — "A.S." (Call it from your phone\'s Contacts.)'); }
        if (r && r.relic) c1aRelicFound(r.relic);
        return _r(r);
    };
})();

// ============================================================
// THE QUARRY MASON'S MARKS
// ============================================================
mapObjects[1].push({ id: 'c1a_mason', x: 4380 - 22, y: 4335 - 18, w: 44, h: 36, color: '#b8862a', label: 'Mason\'s Marks', interactScene: 'c1a_mason', zone: 'open' });
CH1_BUILDERS.c1a_mason = function (o, M, rng) {
    // an abandoned quarry block with the gang's marks in red ochre
    const g = new THREE.Group();
    const Q = ch1QuarryMats();
    const tex = makeTex('c1masonMarks', 256, 128, 1, 1, (cc, w, h) => {
        cc.fillStyle = '#d9c7a2'; cc.fillRect(0, 0, w, h);
        speckle(cc, w, h, null, ['#8a7454', '#f0e4c8'], 600, 0.6, 2);
        cc.strokeStyle = 'rgba(150,40,20,0.85)'; cc.fillStyle = 'rgba(150,40,20,0.85)'; cc.lineWidth = 4; cc.lineCap = 'round';
        // a cartouche-like ring with a few signs, a levelling line, and one small mark set apart
        cc.beginPath(); cc.ellipse(80, 60, 50, 26, 0, 0, 7); cc.stroke();
        cc.lineWidth = 3;
        cc.beginPath(); cc.moveTo(52, 60); cc.lineTo(70, 44); cc.lineTo(70, 76); cc.stroke();
        cc.beginPath(); cc.arc(92, 60, 8, 0, 7); cc.stroke();
        cc.beginPath(); cc.moveTo(108, 46); cc.lineTo(108, 74); cc.moveTo(102, 50); cc.lineTo(114, 50); cc.stroke();
        cc.beginPath(); cc.moveTo(10, 104); cc.lineTo(170, 104); cc.stroke();
        // the odd one: an eye inside a house outline
        cc.lineWidth = 3;
        cc.beginPath(); cc.moveTo(196, 86); cc.lineTo(196, 50); cc.lineTo(216, 34); cc.lineTo(236, 50); cc.lineTo(236, 86); cc.closePath(); cc.stroke();
        cc.beginPath(); cc.ellipse(216, 66, 10, 6, 0, 0, 7); cc.stroke();
        cc.beginPath(); cc.arc(216, 66, 3, 0, 7); cc.fill();
    });
    const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.93 });
    const blk = new THREE.Mesh(gBox(62, 30, 34), [Q.cut, Q.cut, Q.cut, Q.cut, face, Q.cut]);   // plain UVs: the painted face shows whole
    blk.position.y = 13; blk.rotation.y = 0.15; blk.castShadow = true;
    g.add(blk);
    for (let i = 0; i < 4; i++) ch1AddRock(g, (rng() - 0.5) * 80, 0, (rng() - 0.3) * 50, 3 + rng() * 5, rng, Q.rough);
    g.userData.h = 44;
    return g;
};
scene('c1a_mason', {
    speaker: 'System',
    text: () => `A block the ancient quarrymen cut and never took, lying where it was levered out four and a half thousand years ago. On its face, in red ochre, their marks: a levelling line, and inside an oval the name of the work gang — "The Drunkards of Menkaure". (Real gangs signed their blocks with names like that; one at Giza was called exactly this.)\n\nOff to one side, painted by another hand and much later, a small mark on its own: an eye inside the outline of a house.` +
        (sflag('codex') ? `\n\nYou know that mark. It's in the margin of the Codex's first page, beside the first line of the list.` : `\n\nIt's not Old Kingdom. It isn't anything you know. You sketch it.`),
    choices: [{ text: 'Sketch the marks.', onSelect: () => {
        if (!sflag('mason_mark')) { sflag('mason_mark', true); skillXP('hieroglyphs', 25); storyNote('The mason\'s marks', 'On an abandoned quarry block: the Old Kingdom gang name "The Drunkards of Menkaure" in red ochre — and, painted much later, an eye inside a house. The same mark is in the Codex\'s margin. (Father Bishoy will want to see it.)'); }
        end();
    } }],
});

// ============================================================
// HAGG SAYED'S HORSE RACE (SQ-01A-01 — the other way to clear Mina's debt)
// ============================================================
PERSON_OBJECTS.c1p_oldwoman = 'oldwoman';
Object.assign(PERSON_STYLES, { oldwoman: { skin: '#8a6a4a', shirt: '#141210', pants: '#141210', robe: true, headwear: 'hood', hoodColor: '#141210', scale: 0.84 }, sayed: { skin: '#7a5230', shirt: '#3a2e24', pants: '#2a2218', robe: true, headwear: 'wrap', wrapColor: '#e8e0cc' } });
PERSON_OBJECTS.c1a_sayed = 'sayed';
mapObjects[1].push({ id: 'c1a_sayed', x: 5260 - 24, y: 7180 - 24, w: 48, h: 48, color: '#888', label: 'Hagg Sayed', interactScene: 'c1a_sayed', zone: 'open' });
mapObjects[1].push({ id: 'c1a_horses', x: 5350 - 40, y: 7170 - 30, w: 80, h: 60, color: '#888', label: 'Horses', interactScene: null, decorative: true, zone: 'open' });
function c1aHorse(M, coat) {
    const h = new THREE.Group();
    const hide = new THREE.MeshStandardMaterial({ color: coat, roughness: 0.8 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.9 });
    const body = put(h, new THREE.CapsuleGeometry(8, 22, 6, 12), hide, 0, 34, 0); body.rotation.x = Math.PI / 2;
    for (const [x, z] of [[-4.5, 11], [4.5, 11], [-4.5, -11], [4.5, -11]]) {
        put(h, new THREE.CapsuleGeometry(2, 20, 4, 8), hide, x, 17, z);
        put(h, gCyl(2.3, 2.6, 4, 8), dark, x, 2, z);                                    // hooves
    }
    const neck = put(h, new THREE.CapsuleGeometry(4.6, 14, 4, 10), hide, 0, 46, 20); neck.rotation.x = 0.7;
    const head = put(h, new THREE.CapsuleGeometry(3.4, 12, 4, 10), hide, 0, 54, 29); head.rotation.x = 1.9;
    put(h, gBox(1.6, 14, 12), dark, 0, 49, 17).rotation.x = 0.7;                        // mane
    for (const s of [-1, 1]) put(h, new THREE.ConeGeometry(1.2, 4, 5), hide, s * 2, 59, 25);
    const tail = put(h, new THREE.CapsuleGeometry(2, 14, 4, 6), dark, 0, 30, -20); tail.rotation.x = -0.5;
    const saddle = put(h, gBox(15, 3, 16), new THREE.MeshStandardMaterial({ color: 0x8a1f1a, roughness: 0.9 }), 0, 42.5, 2);
    h.traverse(m => { if (m.isMesh) m.castShadow = true; });
    ch1FX.sway.push({ obj: tail, axis: 'z', base: 0, amp: 0.3, speed: 1.1, phase: coat % 7 });
    ch1FX.sway.push({ obj: head, axis: 'x', base: 1.9, amp: 0.08, speed: 0.5, phase: coat % 5 });
    return h;
}
CH1_BUILDERS.c1a_horses = function (o, M, rng) {
    const g = new THREE.Group();
    const a = c1aHorse(M, 0x6a3a1c); a.position.set(-22, 0, 0); a.rotation.y = 1.3; g.add(a);
    const b = c1aHorse(M, 0xd8d0c0); b.position.set(24, 0, 10); b.rotation.y = 1.7; g.add(b);
    put(g, gCyl(1.4, 1.8, 40, 6), M.woodDark, 0, 20, -24);                              // tethering post
    subBeam(g, M.rope, new THREE.Vector3(0, 30, -24), new THREE.Vector3(-14, 50, 16), 0.35, 4);
    subBeam(g, M.rope, new THREE.Vector3(0, 30, -24), new THREE.Vector3(30, 50, 26), 0.35, 4);
    g.userData.h = 0;
    return g;
};
scene('c1a_sayed', {
    speaker: 'Hagg Sayed',
    text: () => {
        if (sflag('mina') === 'done') return `Hagg Sayed touches his chest. "The boy's debt is settled. God is generous — and so, it seems, is the new doctor."`;
        if (sflag('race') === 'lost') return `"You rode well enough," Hagg Sayed says, which is a lie. "The debt is still fifteen hundred. Friday."`;
        if (sflag('mina') === 'open') return `A heavy man in a dark galabeya, holding two horses at the camp gate as if he owns the road — which, round Nazlet el-Samman, he more or less does.\n\n"You are the doctor who talks for Mina? Good. Fifteen hundred pounds, Friday. Or —" he pats the grey's neck "— you race me. To the quarry markers and back. You win, the boy owes nothing. You lose, the boy owes me two thousand."`;
        return `A heavy man in a dark galabeya, holding two horses at the camp gate. He nods to you, and goes back to watching the road. "Hagg Sayed. I keep horses under the pyramids. Tourists, weddings, films." He smiles. "And loans."`;
    },
    get choices() {
        const c = [];
        if (sflag('mina') === 'open' && !sflag('race')) c.push({ text: '"You\'re on. Which horse is mine?"', nextScene: 'c1a_race1' });
        c.push({ text: '"Good night, Hagg."', onSelect: end });
        return c;
    },
});
function raceScore(n) { sflag('race_pts', (sflag('race_pts') || 0) + n); }
scene('c1a_race1', {
    speaker: 'System',
    text: `He gives you the grey — "she's old, she's wise, she's slower than my bay; that is fair" — and swings up onto the bay himself. Half the camp has come to the gate. Somebody is taking bets. Saber is taking bets.\n\nThe Rais drops his handkerchief.`,
    choices: [
        { text: 'Kick hard off the line.', onSelect: () => raceScore(1), nextScene: 'c1a_race2' },
        { text: 'Let the grey find her own pace.', onSelect: () => raceScore(2), nextScene: 'c1a_race2' },
        { text: 'Tuck in behind the bay and let him break the wind.', onSelect: () => raceScore(1), nextScene: 'c1a_race2' },
    ],
});
scene('c1a_race2', {
    speaker: 'System',
    text: () => ((sflag('race_pts') || 0) >= 2 ? `The grey settles into a long, easy gallop that eats the sand. The bay is half a length ahead and working much harder.` : `The bay is away and two lengths clear; the grey is fighting you for her head.`) +
        `\n\nThe quarry markers come up out of the dark — pale blocks, the turn around them tight and rough with chips.`,
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
    text: () => {
        const won = (sflag('race_pts') || 0) >= 5;
        sflag('race', won ? 'won' : 'lost');
        skillXP('riding', won ? 90 : 60, 'the race');
        if (won) {
            sflag('mina', 'done'); rel('abdallah', 15); rel('workmen', 10, true);
            storyNote('The Rais\'s son (side quest)', 'Done. You beat Hagg Sayed on his own old grey mare, and Mina\'s debt is forgiven. The camp will talk about it for years.');
            return `The grey puts her nose in front at the gate by the width of a hand. The camp goes up like a wedding. Saber is paying out bets with the face of a ruined man.\n\nHagg Sayed slides down, breathing hard, and laughs until he has to hold the bay's saddle. "Mina's debt is nothing. Nothing! God is great. Next time you ride for me."\n\nThe Rais says nothing at all. He just takes your hand in both of his.`;
        }
        storyNote('The Rais\'s son (side quest)', 'You lost the race to Hagg Sayed. Mina\'s debt is still 1,500 EGP (the Rais can take it from you, or the darts winnings, any time).');
        return `The bay is a length clear at the gate. The camp groans. Hagg Sayed slides down, delighted with himself, and pats your knee.\n\n"You rode well. She is old. So am I." He considers. "Fifteen hundred, still. I am not a monster."`;
    },
    choices: [{ text: 'Get down off the grey.', onSelect: end }],
});

// ============================================================
// THE 1926 EXPEDITION — four relics round the old truck (detector)
// ============================================================
const RELICS = [
    { id: 'camera', dx: -150, dz: 90, text: 'A folding Kodak camera, 1920s, leather cracked to the metal. Stamped inside the lid: H.U.–M.F.A. EXPEDITION.', name: 'Kodak camera (1926)' },
    { id: 'trowel', dx: 170, dz: -60, text: 'A mason\'s trowel worn to a crescent, "HARVARD CAMP" burned into the handle.', name: 'Expedition trowel' },
    { id: 'tag', dx: 60, dz: 190, text: 'A brass tag stamped with a find number and a date: 14.III.1926. The find it was tied to is long gone.', name: 'Brass find tag' },
    { id: 'photo', dx: -80, dz: -170, text: 'A tin with a glass photographic plate inside, unbroken. Held to the moon: forty workmen and a foreman in a white turban on the steps of a tomb — and in front, a boy who has exactly the Rais\'s face.', name: 'Glass plate photograph' },
];
(function () {
    const [wx, wz] = ch1At('ow_wreck');
    RELICS.forEach((r, n) => {
        const i = OW.caches.length;
        const at = [wx + r.dx, wz + r.dz];
        OW.caches.push({ at, reward: { relic: r.id }, text: r.text });
        const id = 'ow_cache' + i;
        mapObjects[1].push({ id, x: at[0] - 20, y: at[1] - 20, w: 40, h: 40, color: '#888', label: 'Something Buried', interactScene: id, owFlag: id, cache: true, zone: 'open' });
        CH1_BUILDERS[id] = CH1_BUILDERS.ow_cache0;
        storyData[id] = { speaker: 'System', text: 'The detector shrieks. You dig with your hands.\n\n' + r.text, choices: [{ text: 'Take it.', onSelect: () => { gameState.flags[id] = true; owReward({ relic: r.id }); skillXP('excavation', 15); closeDialogue(); } }] };
    });
})();
function c1aRelicFound(id) {
    const r = RELICS.find(q => q.id === id);
    if (r) pocket(r.name);
    const got = RELICS.filter(q => gameState.inventory.includes(q.name)).length;
    if (typeof owToast === 'function') owToast('1926 EXPEDITION', got + ' of 4 relics');
    if (got === 4 && !sflag('relics_done')) {
        sflag('relics_done', true);
        storyPay(600, 'Relics logged with the Ministry');
        rep('ministry', 5, true);
        skillXP('excavation', 40, 'the 1926 relics');
        storyNote('The truck of 1926 (side quest)', 'Done. All four relics of the 1926 Harvard–Boston expedition round the old truck: a Kodak camera, a trowel, a brass find tag — and a glass plate photograph of the dig crew, with a boy who has the Rais\'s face. (Show the Rais.)');
    }
}
(function () {
    const base = Object.getOwnPropertyDescriptor(storyData['c1a_rais'], 'choices').get;
    Object.defineProperty(storyData['c1a_rais'], 'choices', {
        get() {
            const c = base.call(this);
            if (gameState.inventory.includes('Glass plate photograph') && !sflag('rais_photo')) c.unshift({ text: 'Show him the glass plate photograph from 1926.', nextScene: 'c1a_rais_photo' });
            return c;
        }, configurable: true,
    });
})();
scene('c1a_rais_photo', {
    speaker: R(),
    text: `He holds the plate up to the fire and doesn't say anything for a long time.\n\n"My grandfather," he says finally, and touches the boy with one fingertip. "He told us about this. The Americans with the camera. He said they paid in silver and never lied." He hands it back very carefully. "No. You keep it. Put it in your museum, with his name. Abdallah Mahmoud Qufti."`,
    choices: [{ text: '"I will."', onSelect: () => { sflag('rais_photo', true); rel('abdallah', 12); end(); } }],
});

builtSignature = null;
