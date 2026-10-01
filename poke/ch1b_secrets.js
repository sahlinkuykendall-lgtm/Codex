// ============================================================
// THE CODEX OF GIZA — POKE STYLE: SAQQARA'S SECRETS (poke/ch1b_secrets.js)
// The bible's §SECRETS for Chapter 1-B, found, noted and counted (they pay
// off later):
//   - the Serapeum's sealed 26th gallery (fiction): under the coffin whose lid
//     the robbers pushed aside, a cut through its floor and footholds down.
//     A Late Period bronze Thoth in a niche (a deniable hint), and a Rare find
//   - Naneferkaptah's tomb: visible but sealed in the far corner. Notice it;
//     you can't go in (players see it again in The Return)
// Also: after the round the Serapeum is open, by day as well as by night
// (the bible locks it only until the round); outside the story's nights it's
// just the galleries, with nobody patrolling.
// ============================================================

const SECRETS_1B = [
    ['c1b_sec_gallery', 'Under a robbed Apis coffin in the Serapeum, a cut through its floor, and a gallery nobody has catalogued: the twenty-sixth.'],
    ['c1b_sec_thoth', 'A bronze Thoth in a niche in the twenty-sixth gallery, set there to watch a coffin that was never used.'],
    ['c1b_sec_tomb', 'A sealed doorway in the far corner of the necropolis, and above it, faint paint: a river, a woman and a small boy.'],
];
function c1bSecretsSync() {
    const found = SECRETS_1B.filter(([k]) => sflag(k)), s = Story.s;
    if (found.length === (s.secretsN1B || 0)) return;
    const more = found.length > (s.secretsN1B || 0); s.secretsN1B = found.length;
    Game.note('Secrets of Saqqara', 'Found ' + found.length + ' of ' + SECRETS_1B.length + ':\n\n' + found.map(([, t]) => '• ' + t).join('\n\n') + (found.length < SECRETS_1B.length ? '\n\nSaqqara is keeping the rest.' : '\n\nAll of them.'), 'secrets1b');
    if (more) { Notice.show('A secret of Saqqara (' + found.length + ' of ' + SECRETS_1B.length + ').'); Sfx.tone(988, 0.12, 'triangle', 0.05); setTimeout(() => Sfx.tone(1319, 0.2, 'triangle', 0.05), 120); }
}
(window.C1B_END_LINES = window.C1B_END_LINES || []).push(f => 'Secrets of Saqqara: ' + SECRETS_1B.filter(([k]) => f[k]).length + ' of ' + SECRETS_1B.length + ' found.' + (SECRETS_1B.every(([k]) => f[k]) ? ' All of them.' : ''), f => f.c1b_rare_apis && 'You found the gilded bronze Apis in the twenty-sixth gallery.');

// ---- Naneferkaptah's tomb ----
STORY_SCRIPTS.c1b_oldtomb = 'c1b_oldtomb';
scene('c1b_oldtomb', {
    speaker: 'System',
    text: () => `A doorway cut into the rock of the far corner, where the sand comes in, blocked with ancient masonry. A rope and a clay seal across it, older than the Ministry, older than anybody's register: the stamp is worn smooth.\n\nAbove the lintel, so faint you might be imagining it, paint: a band of blue that could be a river, and beside it a woman, and a small boy holding her hand.` +
        (sflag('ch1b_tomb_story') ? `\n\nUmm Sabry's grandmother's story. The magician's wife and son, painted on the wall by the river.` : '') + `\n\nIt isn't on your register. It isn't on any map you've seen. You can't go in, and something tells you that you shouldn't try.`,
    choices: [{ text: 'Remember it.', onSelect: () => { if (!sflag('c1b_sec_tomb')) { sflag('c1b_sec_tomb', true); storyNote('A sealed tomb', 'In the far south-west corner of the necropolis, where the sand comes in: a doorway blocked with ancient masonry, a seal older than the Ministry, and faint paint above it: a river, a woman, a small boy.' + (sflag('ch1b_tomb_story') ? ' Umm Sabry\'s story: Naneferkaptah\'s tomb.' : '') + ' Not on any register.'); c1bSecretsSync(); } } }],
});

// ---- the Serapeum, open after the round ----
(function () {
    const f = STORY_SCRIPTS.c1b_serapeum;
    STORY_SCRIPTS.c1b_serapeum = e => { const k = f(e); return k || (sflag('c1b_round_done') && !serOn() && !panicOn() ? 'c1b_ser_free' : null); };
})();
scene('c1b_ser_free', {
    speaker: 'System',
    text: () => dayNow() ? `The Serapeum, open: tourists coming up the steps blinking, the ghaffir selling them postcards he shouldn't be selling. Your Ministry card gets you in without a ticket.` : `The Serapeum's gate in the dark. The old ghaffir unlocks it for you without a word. Nobody does night rounds tonight.`,
    choices: [{ text: 'Go down.', onSelect: () => serGoIn() }, { text: 'Not now.' }],
});
// outside the story's nights, nobody patrols and nobody comes: just the galleries
const serFree = () => !serOn() && !panicOn();
(function () {
    const _f = Ser.frame, _d = Ser.draw, _e = Ser.enter;
    Ser.enter = function (m) {
        _e.call(this, m);
        const robbed = m.ents.find(e => e.say && /lid of this one is pushed aside/.test(e.say[1])); if (robbed) robbed.script = 'c1b_ser26';
        if (serFree()) { const g = m.ents.find(e => e.id === 'c1b_nightghaf'); if (g) g.gone = true; }
    };
    Ser.frame = function (dt) { if (Game.map.key === 'INT_SERAPEUM' && serFree()) { if (this.map !== Game.map) this.enter(Game.map); return; } return _f.call(this, dt); };
    Ser.draw = function (g, cx, cy) { if (Game.map.key === 'INT_SERAPEUM' && serFree()) return; return _d.call(this, g, cx, cy); };
})();
ROOMS.INT_SERAPEUM.enter = ['System', 'Down the steps and through the gate, into the dark. The Serapeum: galleries cut into the rock of the desert, and off them, in chambers of their own, the great granite coffins of the Apis bulls, each heavier than a house. The air is cold and still and smells of stone.'];

// ---- the way down to the twenty-sixth gallery ----
scene('c1b_ser26', {
    speaker: 'System',
    text: () => sflag('c1b_sec_gallery') ? `The robbed coffin, its lid pushed aside, and in its floor the robbers' cut and the footholds going down into the twenty-sixth gallery.` : `The lid of this one is pushed aside, just enough for a thin man with a lamp. You lean in with the torch.\n\nThe coffin's floor isn't a floor. The robbers cut through it, two thousand years ago, and through the rock under it, and there are footholds going down into the dark. Cold air comes up out of the hole, and it smells of a room nobody has breathed in for a very long time.`,
    choices: [{ text: 'Climb down. (5 minutes)', onSelect: () => ser26Down() }, { text: 'Not now.' }],
});
function ser26Down() {
    const from = Game.map, e = Game.target;
    clockAdvance(5); Sfx.door();
    Game.fadeTo(() => {
        const m = Game.maps.ch1, gate = m.ents.find(q => q.id === 'c1b_serapeum'), back = [gate.x + gate.w / 2, gate.y + gate.d + 18];
        const room = Game.maps.INT_SER26 || (Game.maps.INT_SER26 = buildRoom('INT_SER26', window.POKE_MAP, back));
        room.back = back; room.up = { key: 'INT_SERAPEUM', at: [e ? e.x + 42 : from.spawn[0], e ? e.y + e.d + 14 : from.spawn[1]] };
        Game.player.x = room.spawn[0]; Game.player.y = room.spawn[1] - 12; Game.player.dir = DIR.up;
        Game.enter(room);
        if (!sflag('c1b_sec_gallery')) { sflag('c1b_sec_gallery', true); storyNote('The twenty-sixth gallery', 'Under the robbed Apis coffin in the Serapeum, a cut through the coffin\'s floor and footholds down to a gallery that isn\'t on any plan: the twenty-sixth.'); c1bSecretsSync(); }
    });
}
ROOMS.INT_SER26 = {
    name: 'THE SERAPEUM · THE TWENTY-SIXTH GALLERY', tw: 14, th: 8, style: 'rock',
    enter: ['System', 'Down the footholds and into a gallery that isn\'t on any plan. Shorter than the others, lower, the walls left rough where the masons stopped. At the far end, in a chamber of its own, one more granite coffin. Nobody has been down here since the robbers, and the robbers didn\'t stay.'],
    build({ map, A, put, wall, pw, ph, W }) {
        const R = PAL.rock, E = ROOM.EDGE;
        // the footholds you came down, over the shell's ladder
        const dx = (pw >> 1) - 22; A.r(dx + 8, ph - E - 40, 28, 40 + E, R[3]); for (let j = ph - E - 36; j < ph; j += 8) { A.r(dx + 14, j, 6, 3, R[4]); A.r(dx + 24, j + 4, 6, 3, R[4]); }
        // rough walls: the masons stopped here
        for (let i = 0; i < 40; i++) { const x = E + hash2(i, 7) * (pw - 2 * E), y = W + hash2(7, i) * 20; A.r(x, y, 6 + hash2(i, 8) * 8, 3, R[3]); }
        // the coffin that was never used: rough granite, no polish, no lid
        const st = stage(96, 46, 40), S = st.A, x = st.x, y = st.y - 38;
        S.r(x, y + 12, 96, 60, '#7a7480'); S.r(x, y + 12, 96, 3, '#a8a2ae'); S.vl(x + 95, y + 12, 60, '#4a4650'); S.r(x + 6, y + 14, 84, 30, '#2a2630'); S.r(x + 8, y + 16, 80, 26, '#1c1820');
        for (let i = 0; i < 30; i++) S.px(x + 2 + hash2(i, 3) * 92 | 0, y + 46 + hash2(3, i) * 24 | 0, '#5a5460');
        put((pw >> 1) - 48, W + 10, fit(st, { solid: [0, 0, 96, 46] }), null, { label: 'Unfinished Sarcophagus', script: 'c1b_ser26_box' });
        // the niche, and Thoth in it
        const nx = 46, ny = 10; A.r(nx - 2, ny - 2, 30, 38, R[4]); A.r(nx, ny, 26, 34, '#141016'); A.r(nx, ny, 26, 3, '#0a080c');
        const tx = nx + 13, ty = ny + 6; A.r(tx - 3, ty + 8, 6, 14, '#6a5030'); A.r(tx - 4, ty + 21, 8, 4, '#4a3820'); A.r(tx - 2, ty + 2, 4, 6, '#7a5c38'); A.line(tx + 1, ty + 3, tx + 6, ty + 7, '#7a5c38'); A.px(tx - 1, ty + 3, '#e8c060');   // the ibis head, the long beak
        A.r(tx - 6, ty + 12, 4, 6, '#b89048'); A.r(tx - 6, ty + 12, 4, 1, '#e8c070');                                                                    // the scribe's palette in his hands
        A.r(nx - 4, ny + 34, 34, 3, R[1]);
        wall(nx - 4, 34, null, { label: 'A Bronze Figure', script: 'c1b_ser26_thoth' });
        // a little light of its own: your torch, and the cold
        map.ents.push({ x: nx + 13, y: ny + 20, w: 0, d: 0, sortY: 0, light: { x: 0, y: 0, r: 28, c: '#c8b880' } });
    },
};
scene('c1b_ser26_thoth', {
    speaker: 'System',
    text: `In a niche cut into the rough wall, a bronze figure the length of your hand: a man with the head of an ibis, a scribe's palette held against his chest. Thoth, who invented writing, the scribe of the gods. Late Period by the look of the casting, two and a half thousand years old, give or take.\n\nSomebody set him here on purpose, facing the coffin, as if to keep an eye on it. Or on whatever was meant to go in it.\n\nHe's not yours to take. He's not anybody's. You leave him where he is, watching.`,
    choices: [{ text: 'Leave him watching.', onSelect: () => { if (!sflag('c1b_sec_thoth')) { sflag('c1b_sec_thoth', true); storyNote('The bronze Thoth', 'In a niche in the twenty-sixth gallery, a Late Period bronze Thoth, ibis-headed, a scribe\'s palette in his hands, set to watch over a granite coffin that was never used. I left him there.'); c1bSecretsSync(); } } }],
});
scene('c1b_ser26_box', {
    speaker: 'System',
    text: () => sflag('c1b_rare_apis') ? `The unfinished coffin: rough granite, no lid, empty but for dust. Whatever it was cut for never came.` : `A granite coffin never finished: the outside left rough, no polish, no niches, and no lid ever made for it. Inside, nothing but two thousand years of dust.\n\nNothing but dust, and, when your torch slides over a corner, a glint.`,
    get choices() { return sflag('c1b_rare_apis') ? [{ text: 'Move on.' }] : [{ text: 'Brush the dust away.', nextScene: 'c1b_ser26_apis' }, { text: 'Leave it.' }]; },
});
scene('c1b_ser26_apis', {
    speaker: 'System',
    text: `A bull, in bronze, the length of your finger, standing four-square, a sun disc between its horns with the gilding still on it, and the triangle on its forehead that marks the living god: the Apis. Somebody's offering, dropped in the dark and never found.\n\nA Rare find. The kind an inspector writes up, or the kind that goes in a pocket and never gets written up at all.`,
    choices: [{ text: 'Wrap it carefully and take it.', onSelect: () => { sflag('c1b_rare_apis', true); pocket('Gilded bronze Apis'); skillXP('excavation', 50, 'a rare find'); storyNote('A rare find', 'A finger-length bronze Apis bull, the sun disc between its horns still gilded, in the dust of an unfinished coffin in the twenty-sixth gallery.'); } }],
});
ITEM_INFO['Gilded bronze Apis'] = { desc: 'RARE. A bronze Apis bull the length of your finger, the sun disc between its horns still gilded, the god\'s triangle on its forehead. From the dust of an unfinished coffin in the Serapeum\'s twenty-sixth gallery.' };
