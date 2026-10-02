// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MARSA TARFA'S SECRETS (poke/ch1c_secrets.js)
// The bible's §SECRETS for Chapter 1-C, and one addition (poke/FIXER_TODO.md §10), found, noted
// and counted like Giza's and Saqqara's (a notice, a journal page, a line on the end card):
//   - a wrecked Roman trade ship on the outer reef off Lighthouse Island (real: Roman ships ran the
//     Red Sea to India from Myos Hormos, just up this coast). Dive it (the dive minigame, with the
//     wreck mound) once you have Rana's dive card: the boatman keeps her spare tank. An amphora and
//     coins: a Rare find
//   - a tiny shrine in the fort wall: a lamp painted inside a doorway, a candle stub. The first one
//     the player might notice. Nothing on screen says whose it is
//   - (addition) the smugglers' cave up the wadi: names and dates scratched by the coast's
//     smugglers since the 1940s, a British army tin, and initials you know
// ============================================================

const SECRETS_1C = [
    ['c1c_sec_wreck', 'On the outer reef off Lighthouse Island, under the coral: the long mound of a Roman ship, her amphorae still stacked in rows, two thousand years out of Myos Hormos for India.'],
    ['c1c_sec_shrine', 'In the west wall of the fort, a niche no bigger than a book: a lamp painted inside a doorway, and a candle stub that somebody lights.'],
    ['c1c_sec_cave', 'Up the wadi, behind a fallen slab, the smugglers\' cave: names and dates scratched into the rock since the 1940s, and initials you know.'],
];
function c1cSecretsSync() {
    const found = SECRETS_1C.filter(([k]) => sflag(k)), s = Story.s;
    if (found.length === (s.secretsN1C || 0)) return;
    const more = found.length > (s.secretsN1C || 0); s.secretsN1C = found.length;
    Game.note('Secrets of Marsa Tarfa', 'Found ' + found.length + ' of ' + SECRETS_1C.length + ':\n\n' + found.map(([, t]) => '• ' + t).join('\n\n') + (found.length < SECRETS_1C.length ? '\n\nThe coast is older than it looks.' : ''));
    if (more) { Notice.show('A secret of Marsa Tarfa (' + found.length + ' of ' + SECRETS_1C.length + ').'); Sfx.tone(988, 0.12, 'triangle', 0.05); setTimeout(() => Sfx.tone(1319, 0.2, 'triangle', 0.05), 130); }
}
function c1cSecret(k, title, text) { if (sflag(k)) return; sflag(k, true); storyNote(title, text); c1cSecretsSync(); }
(function () {
    const _show = EndCard.show;
    EndCard.show = function (title, sub, lines, next) {
        if (area() === AREAS.fixer && Array.isArray(lines)) { const n = SECRETS_1C.filter(([k]) => sflag(k)).length; lines = lines.concat(['Secrets of Marsa Tarfa: ' + n + ' of ' + SECRETS_1C.length + ' found.' + (n === SECRETS_1C.length ? ' All of them.' : '')]); }
        return _show.call(this, title, sub, lines, next);
    };
})();
Object.assign(ITEM_INFO, {
    'Roman amphora': { key: 1, desc: 'A Roman wine amphora, two-handled, crusted with coral, still stoppered with pitch. Made in Italy, shipped down the Nile and across the desert to the Red Sea, and lost two thousand years ago on the way to India. A Rare find.' },
    'Roman coins': { key: 1, desc: 'A lump of silver denarii fused together by the sea, the face of the emperor Tiberius on the top one. Pay for the crew, or for pepper in India. A Rare find.' },
    'Rusted army tin': { key: 1, desc: 'A British army tin from the Second World War, rusted almost through. Inside: a packet of Egyptian cigarettes from 1942, a brass button, and a folded paper with a tide table on it in pencil.' },
});

// ---- the map ----
(function () {
    const L0 = marsaLayout;
    marsaLayout = function () { const L = L0(); L.things.push(['c1c_outerreef', 77, 28, 1, 1], ['c1c_shrine', 54, 3, 1, 1], ['c1c_cave', 6, 8, 2, 1]); return L; };
})();
POKE_MAP_1C.objects.push(
    { id: 'c1c_outerreef', label: 'The Outer Reef', model: 'reef edge', say: null },
    { id: 'c1c_shrine', label: 'A Niche in the Wall', model: 'wall niche', say: null },
    { id: 'c1c_cave', label: 'A Fallen Slab', model: 'cave mouth', say: null },
);
SPR_L['reef edge'] = (w, d) => {
    const st = propStage(w, d, 30, 14), { A } = st, x = st.x, y = st.y;
    for (let i = 0; i < 7; i++) A.ell(x + 3 + i * 4, y + 8 + (i % 2) * 2, 3, 2, i % 3 ? '#e8e0cc' : '#c8b890');   // white coral rubble at the water's edge
    A.r(x + 10, y + 2, 2, 6, '#c8a060'); A.r(x + 8, y + 1, 6, 2, '#86949e');                                          // a marker stick with a tin can on it
    return propFit(st, w, d, { noShadow: true, solid: [4, d - 8, w - 8, 6] });
};
SPR_L['wall niche'] = (w, d) => {
    const st = propStage(w, d, 16, 24), { A } = st, x = st.x, y = st.y;
    A.r(x + 2, y + 2, 12, 16, '#c8b090'); A.r(x + 3, y + 3, 10, 14, '#f0e8d4');                                       // a whitewashed niche
    A.r(x + 5, y + 6, 6, 9, '#3a5a8a'); A.r(x + 6, y + 7, 4, 8, '#f0e8d4');                                           // a doorway painted in blue, and in it,
    A.r(x + 7, y + 10, 2, 3, '#e8a030'); A.px(x + 7, y + 9, '#ffe060');                                               // a lamp
    A.r(x + 3, y + 15, 3, 2, '#f4f4f0'); A.px(x + 4, y + 14, '#ffb040');                                              // the candle stub
    return propFit(st, w, d, { noShadow: true, solid: [2, d - 6, w - 4, 6], light: { x: 0, y: -12, r: 14, c: '#ffc060' } });
};
SPR_L['cave mouth'] = (w, d) => {
    const st = propStage(w, d, 60, 30), { A } = st, x = st.x, y = st.y;
    A.poly([[x + 4, y + 28], [x + 10, y + 6], [x + 26, y], [x + 46, y + 4], [x + 56, y + 28]], '#8a7058');            // the cliff face
    A.poly([[x + 18, y + 28], [x + 22, y + 12], [x + 34, y + 10], [x + 40, y + 28]], '#1c140e');                       // the cave mouth
    A.poly([[x + 12, y + 28], [x + 16, y + 14], [x + 30, y + 16], [x + 34, y + 28]], '#a8906c');                       // the slab fallen half across it
    A.line(x + 16, y + 20, x + 30, y + 22, '#7a6248');
    return propFit(st, w, d, { solid: [0, d - 12, w, 12] });
};

// ============================================================
// THE ROMAN WRECK
// ============================================================
STORY_SCRIPTS.c1c_outerreef = 'c1c_outerreef';
scene('c1c_outerreef', {
    speaker: 'System',
    text: () => sflag('c1c_sec_wreck') ? `The outer reef off the island's seaward side, where the coral drops away into blue. Down there, under the fish, the Roman ship's long mound, and the gap in her rows where her amphora was.`
        : `On the seaward side of the island, past the fishing rocks, the reef drops away from turquoise into ink. Somebody has wedged a stick in the coral rubble with a tin can on it: a fisherman's mark for a good spot.\n\nLooking down through the clear water you can see, maybe fifteen metres under, a long low mound overgrown with coral, too straight for a reef. Rows of rounded shapes along it, like loaves on a baker's tray.` + (hasItem("Rana's dive card") || hasItem('Diving kit') ? '' : `\n\nYou'd need a tank. The boatman says Rana keeps a spare one in his boat, for divers she trusts.`),
    get choices() {
        if (sflag('c1c_sec_wreck')) return [{ text: 'Move on.' }];
        const can = hasItem("Rana's dive card") || hasItem('Diving kit');
        return can ? [{ text: hasItem("Rana's dive card") ? 'Borrow Rana\'s spare tank from the boatman\'s boat, and dive. (minigame)' : 'Put on Rana\'s kit and dive. (minigame)', onSelect: () => playMinigame('roman', { diving: skillLevel('diving') }, r => c1cRomanResult(r)) }, { text: 'Not now.' }] : [{ text: 'Move on.' }];
    },
});
function c1cRomanResult(r) {
    if (r.unstarted) return;
    clockAdvance(40); if (Game.set.time === 5) Game.hour = storyHour();
    const got = r.got || [];
    for (const n of got) pocket(n);
    if (got.length) { skillXP('diving', 40, 'the Roman wreck'); c1cSecret('c1c_sec_wreck', 'The Roman ship', 'Fifteen metres down off Lighthouse Island\'s seaward side: the coral-covered mound of a Roman trading ship, amphorae still in rows. You brought up ' + got.map(n => n.toLowerCase()).join(' and ') + '. Ships like her sailed from Myos Hormos, just up this coast, for India, with wine and silver, and came back with pepper.'); }
}
MINIS.roman = Object.assign({}, MINIS.salvage, {
    title: 'THE OUTER REEF', keys: '◄►▲▼ swim    hold SPACE: work it loose    ESC: surface',
    howto: [
        'Something old lies on the outer reef. Find it, bring up what you can, and swim back up to the boat.',
        ['◄►▲▼', 'Swim. Water drifts: you glide on after you let go.'],
        ['SPACE', 'Hold it beside something that glints to work it loose. You can carry two things.'],
        ['AIR', 'Runs down, faster the deeper you go. Out of air, and you drop what you\'re carrying.'],
        'Fire coral stings, and the reef has its moray too.',
    ],
    start(o) {
        const S = MINIS.salvage.start({ diving: o.diving, left: [['Roman amphora', 0, 760, 0.8], ['Roman coins', 0, 900, 0.9]] });
        S.site = 'roman'; S.fire = [{ x: 480, y: 0.86, w: 60 }, { x: 640, y: 0.88, w: 40 }]; S.moray = { x: 980, y: 0.8, lunge: 0 }; S.msg = 'The reef wall drops away east. The mound is down there.';
        return S;
    },
    drawWreck(S, g, A, X, Y) {
        const x0 = X(700), y0 = Y(0.84);                                                    // the long coral-covered mound of the hull
        A.ell(x0 + 140, y0 + 18, 190, 26, '#6a7a5a'); A.ell(x0 + 140, y0 + 14, 180, 20, '#7a8a62');
        for (let k = 0; k < 9; k++) { const ax = x0 + 10 + k * 30, ay = y0 + 2 + (k % 2) * 3; A.ell(ax, ay, 7, 5, '#a8784a'); A.ell(ax, ay - 1, 5, 3, '#c8946a'); A.r(ax - 1, ay - 9, 3, 5, '#a8784a'); }   // amphorae in rows
        for (let k = 0; k < 12; k++) A.r(x0 + 20 + k * 22, y0 - 6 - (k % 3) * 4, 3, 8, ['#e86a8a', '#f0c040', '#7ac8a0'][k % 3]);                                                                  // coral growing on it
        A.r(x0 + 300, y0 - 10, 6, 20, '#5a4a3a'); A.r(x0 + 296, y0 - 12, 14, 3, '#5a4a3a');                                                                                                            // a timber of the stern
        for (const it of S.items) {
            if (it.done) continue;
            const ix = X(it.x), iy = Y(it.y), tw = (S.t * 3 + it.x) % 2 < 0.25;
            A.r(ix - 4, iy - 3, 8, 6, it.name === 'Roman coins' ? '#c8c8d0' : '#d8945a'); A.px(ix - 2, iy - 2, '#ffffff'); if (tw) { A.px(ix + 5, iy - 6, '#ffffff'); A.px(ix + 6, iy - 7, '#ffffff'); }
            if (it.cut > 0) { A.r(ix - 14, iy - 14, 28, 4, '#102030'); A.r(ix - 13, iy - 13, Math.round(26 * it.cut), 2, '#f0f0e0'); }
        }
    },
});

// ============================================================
// THE SHRINE IN THE FORT WALL
// ============================================================
STORY_SCRIPTS.c1c_shrine = 'c1c_shrine';
scene('c1c_shrine', {
    speaker: 'System',
    text: () => `In the fort's west wall, at the height of a child's eyes, a little niche has been cut and whitewashed: no bigger than a book.\n\nSomebody has painted inside it, carefully, in blue: a doorway, and in the doorway, a lamp. A candle stub stands in front of it on a shard of tile, and the wax is soft. Somebody lit it this morning.` + (sflag('c1c_sec_shrine') ? '' : `\n\nThe old man at the fort, when you look round, has his eyes shut.`),
    choices: [{ text: 'Leave it as it is.', onSelect: () => { rep('keepers', 3, true); c1cSecret('c1c_sec_shrine', 'The niche in the fort wall', 'A whitewashed niche in the fort\'s west wall with a lamp painted inside a doorway, and a candle stub somebody lights every morning. It isn\'t a mosque\'s and it isn\'t a church\'s. Somebody in Marsa Tarfa keeps it.'); } }],
});

// ============================================================
// THE SMUGGLERS' CAVE (an addition)
// ============================================================
STORY_SCRIPTS.c1c_cave = 'c1c_cave';
scene('c1c_cave', {
    speaker: 'System',
    text: () => {
        const n = (Game.player.name || 'X').trim(), ini = n.split(/\s+/).map(w => w[0].toUpperCase()).join('.') + '.';
        return sflag('c1c_sec_cave') ? `The smugglers' cave behind the fallen slab: the names, the dates, the cold, and the dark at the back.`
            : `A slab has fallen half across a hollow in the wadi wall, and behind it, if you turn sideways, there's room. A cave, cold after the sun, smelling of dust and old smoke.\n\nThe walls are covered in scratched names and dates. HASSAN 1943. A ship's outline with three masts. J.W. ROYAL NAVY 1944 (a British sailor who knew exactly what this place was). A list of tide times. 1967, 1973, 1988, a row of little boats, each with a date. The coast's smugglers, sixty years of them, leaving their marks where the coast guard would never look.\n\n` +
            (Game.player.egyptian ? `And low down by the entrance, where a boy would have to crouch to reach: ${ini} and a year, in letters you cut yourself, the summer you were fifteen and stupid.` : `And low down by the entrance: A.M. 1979, the initials of the old man who taught you the trade your first year on this coast. He brought you here once. "Everyone who works this sea signs the wall," he said, and gave you his knife. You never signed.`) +
            `\n\nAt the back, wedged in a crack, a rusted army tin.`;
    },
    get choices() {
        if (sflag('c1c_sec_cave')) return [{ text: 'Go back out into the sun.' }];
        const c = [{ text: 'Take the tin.', onSelect: () => c1cCaveFound() }];
        if (!Game.player.egyptian) c.push({ text: 'Scratch your initials next to his, with his knife. Then take the tin.', onSelect: () => { sflag('c1c_cave_signed', true); c1cCaveFound(); } });
        return c;
    },
});
function c1cCaveFound() {
    pocket('Rusted army tin');
    c1cSecret('c1c_sec_cave', 'The smugglers\' cave', 'Behind a fallen slab in the wadi wall: a cave where this coast\'s smugglers have scratched their names since the 1940s. HASSAN 1943. A Royal Navy sailor in 1944. ' + (Game.player.egyptian ? 'Your own initials, from the summer you were fifteen.' : 'The initials of the old man who taught you the trade' + (sflag('c1c_cave_signed') ? ', and now yours beside them.' : '.')) + ' A rusted British army tin from 1942 at the back.');
}
