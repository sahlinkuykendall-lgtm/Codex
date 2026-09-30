// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-B, BEAT 2: THE INSPECTION ROUND (poke/ch1b_seals.js)
// The job tutorial (story/regions/ch01_opening_inspector.md, beat 2): check the three tomb seals
// on your beat: the South Tomb in the Step Pyramid complex, Kagemni's mastaba in the Teti
// cemetery, and the Serapeum's service door. The third has been opened and sealed again with a
// forged stamp, and Samy's cigarettes are on the ground by it.
// The seal minigame, reworked for inspectors: the stamp in the register beside the seal on the
// door. Mark what's wrong. Wear and weather are not forgery.
// ============================================================

// ---- the seal minigame: THE SEAL CHECK ----
// opts: { ring: [8 glyphs], center, num: '114', diffs: [{ el: 'ring'|'center'|'num', i, to }], clay: 'dry'|'old'|'fresh', name }
const DIGITS_3x5 = { 0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001111' };
function sealEls() {                                                       // the parts of a stamp you can check: eight glyphs round the ring, the emblem, three digits
    const E = [];
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + i * Math.PI / 4; E.push({ el: 'ring', i, x: Math.round(32 + Math.cos(a) * 22) - 4, y: Math.round(32 + Math.sin(a) * 22) - 6, w: 9, h: 12 }); }
    E.push({ el: 'center', i: 0, x: 24, y: 15, w: 16, h: 22 });
    for (let j = 0; j < 3; j++) E.push({ el: 'num', i: j, x: 25 + j * 5, y: 39, w: 5, h: 7 });
    return E;
}
function sealArt(o, door) {                                                // one impression, 64×64: in the register's blue ink, or pressed into clay on the door
    const [c, g] = mk(64, 64), A = pa(g), R = rng('seal' + (o.name || '') + (door ? 'd' : 'r'));
    const val = (el, i) => { const d = door && (o.diffs || []).find(q => q.el === el && q.i === i); return d ? d.to : el === 'ring' ? o.ring[i] : el === 'center' ? o.center : o.num[i]; };
    const CL = { dry: ['#c89868', '#a87848', '#e8c090', '#7a5430'], old: ['#b8a08a', '#98806a', '#d8c4ac', '#6e5a48'], fresh: ['#8a5a34', '#6a4020', '#b07a48', '#4a2c14'] }[o.clay || 'dry'];
    const ink = door ? CL[3] : '#2c5490', hi = door ? CL[2] : null;
    if (door) {                                                            // the clay: a lump, cracked at the edge, the rope through it
        A.ell(32, 32, 31, 30, CL[1]); A.ell(31, 31, 29, 28, CL[0]);
        for (let i = 0; i < 14; i++) { const a = R() * Math.PI * 2, r = 22 + R() * 7; A.line(32 + Math.cos(a) * r, 32 + Math.sin(a) * r, 32 + Math.cos(a) * (r + 5), 32 + Math.sin(a) * (r + 5), CL[3]); }
        A.r(0, 30, 3, 4, '#c8b888'); A.r(61, 29, 3, 4, '#c8b888');
    } else { A.r(0, 0, 64, 64, '#f4ecd4'); A.ell(32, 32, 29, 29, '#9ab0d8'); A.ell(32, 32, 28, 28, '#f4ecd4'); }
    A.ell(32, 32, 27, 27, ink); A.ell(32, 32, 26, 26, door ? CL[0] : '#f4ecd4'); A.ell(32, 32, 17, 17, ink); A.ell(32, 32, 16, 16, door ? CL[0] : '#f4ecd4');
    const put = (fn) => { if (hi) fn(1, hi); fn(0, ink); };
    for (const e of sealEls()) {
        if (e.el === 'ring') { const k = val('ring', e.i); if (k != null && k >= 0) put((d, col) => GLYPHS[k](A, e.x + 1 + d, e.y + 1 + d, col)); }
        else if (e.el === 'center') {
            const k = val('center', 0), [t, tg] = mk(8, 11); GLYPHS[k](pa(tg), 0, 0, '#000');
            const td = tg.getImageData(0, 0, 8, 11).data;
            put((d, col) => { for (let y = 0; y < 11; y++) for (let x = 0; x < 8; x++) if (td[(y * 8 + x) * 4 + 3] > 128) A.r(e.x + x * 2 + d, e.y + y * 2 + d, 2, 2, col); });
        } else { const n = val('num', e.i), bits = DIGITS_3x5[n]; put((d, col) => { for (let k = 0; k < 15; k++) if (bits[k] === '1') A.px(e.x + 1 + (k % 3) + d, e.y + 1 + Math.floor(k / 3) + d, col); }); }
    }
    if (door && o.clay === 'old') for (let i = 0; i < 180; i++) { const x = Math.floor(R() * 64), y = Math.floor(R() * 64); if (Math.hypot(x - 32, y - 32) < 29) A.px(x, y, R() < 0.5 ? CL[0] : CL[1]); }   // wear: crumbs gone from everywhere
    if (door && o.clay === 'fresh') for (let i = 0; i < 20; i++) A.px(8 + Math.floor(R() * 48), 8 + Math.floor(R() * 48), '#a06a3c');                                          // still damp
    return c;
}
MINIS.sealcheck = {
    title: 'THE SEAL CHECK', keys: '◄► choose    SPACE: mark / sign    ESC: leave',
    start(o) { return { sel: 0, marks: {}, els: sealEls(), ref: sealArt(o, false), door: sealArt(o, true) }; },
    update(S, dt, I) {
        const n = S.els.length + 1;
        if (I.left) { S.sel = (S.sel + n - 1) % n; Sfx.move(); } if (I.right) { S.sel = (S.sel + 1) % n; Sfx.move(); }
        if (I.up) { S.sel = 8; Sfx.move(); } if (I.down) { S.sel = S.els.length; Sfx.move(); }
        if (!I.ok) return;
        if (S.sel < S.els.length) { const e = S.els[S.sel], k = e.el + e.i; S.marks[k] = !S.marks[k]; S.marks[k] ? Sfx.tone(300, 0.08, 'square', 0.05) : Sfx.back(); return; }
        const o = S.opts, want = new Set((o.diffs || []).map(d => d.el + d.i)), got = new Set(Object.keys(S.marks).filter(k => S.marks[k]));
        const missed = [...want].filter(k => !got.has(k)).length, wrong = [...got].filter(k => !want.has(k)).length;
        if (!missed && !wrong) { Sfx.save(); Mini.finish({ ok: true, forged: want.size > 0 }, want.size ? 'Forged. The stamp on the door is not the one in the register: somebody opened this and sealed it again with a stamp of their own.' : o.clay === 'old' ? 'Genuine. Old, worn, crumbling at the edges, and exactly the stamp in the register. Weather isn\'t forgery.' : 'Genuine: the stamp on the door matches the register line for line. Signed, dated, logged.', want.size ? 'FORGED SEAL' : 'SEAL INTACT'); }
        else { Sfx.back(); Mini.finish({ ok: false }, wrong && !missed ? 'You\'ve marked something the register agrees with. Compare the two again, part by part: wear and cracks don\'t count.' : 'Something on the door doesn\'t match the register, and you\'ve signed past it. Look again, part by part.', 'NOT RIGHT'); }
    },
    draw(S, g, A, VW, VH) {
        A.r(0, 0, VW, VH, '#2a2018'); for (let y = 0; y < VH; y += 6) A.hl(0, y, VW, '#32261c');
        const k = Math.max(1, Math.min(3, Math.floor(Math.min((VW - 60) / 2, VH - 110) / 64))), sz = 64 * k, gap = 24, x0 = (VW - sz * 2 - gap) >> 1, y0 = 44;
        const panel = (x, lab, img) => { A.r(x - 5, y0 - 18, sz + 10, sz + 24, '#1a120c'); A.r(x - 4, y0 - 17, sz + 8, sz + 22, lab === 'REGISTER' ? '#e8dcbc' : '#8a7a68'); Txt.draw(g, lab, x, y0 - 15, { col: lab === 'REGISTER' ? '#2c5490' : '#fff4d8' }); g.imageSmoothingEnabled = false; g.drawImage(img, x, y0, sz, sz); };
        panel(x0, 'REGISTER', S.ref); panel(x0 + sz + gap, 'ON THE DOOR', S.door);
        const dx = x0 + sz + gap;
        S.els.forEach((e, i) => {                                           // your marks, and the one you're looking at (on both, so you can compare)
            const on = i === S.sel, mk2 = S.marks[e.el + e.i];
            for (const px of [x0, dx]) {
                if (on) { const bx = px + e.x * k - 2, by = y0 + e.y * k - 2, bw = e.w * k + 4, bh = e.h * k + 4; A.r(bx, by, bw, 1, '#ffe040'); A.r(bx, by + bh, bw, 1, '#ffe040'); A.r(bx, by, 1, bh, '#ffe040'); A.r(bx + bw, by, 1, bh + 1, '#ffe040'); }
            }
            if (mk2) { const cx = dx + (e.x + e.w / 2) * k, cy = y0 + (e.y + e.h / 2) * k, r = Math.max(e.w, e.h) * k / 2 + 3; for (let a = 0; a < 48; a++) for (const rr of [r, r + 1]) A.r(Math.round(cx + Math.cos(a / 48 * Math.PI * 2) * rr), Math.round(cy + Math.sin(a / 48 * Math.PI * 2) * rr), 2, 2, '#f04030'); }
        });
        const nm = Object.values(S.marks).filter(Boolean).length, lab = nm ? 'SIGN: SEAL FORGED (' + nm + ' marked)' : 'SIGN: SEAL INTACT', bw = Txt.width(lab) + 20, bx = (VW - bw) >> 1, by = y0 + sz + 14, on = S.sel === S.els.length;
        A.r(bx, by, bw, 16, on ? '#ffe040' : '#1a120c'); A.r(bx + 1, by + 1, bw - 2, 14, on ? '#c89020' : '#3a2c20'); Txt.draw(g, lab, VW >> 1, by + 2, { col: on ? '#1a120c' : '#e8dcbc', align: 'center' });
        const e = S.els[S.sel], name = !e ? 'Your signature on the inspection report.' : e.el === 'ring' ? 'A sign in the ring (' + (e.i + 1) + ' of 8).' : e.el === 'center' ? 'The emblem in the middle.' : 'A digit of the seal\'s number (' + (e.i + 1) + ' of 3).';
        Txt.draw(g, name, VW >> 1, Math.min(VH - 30, by + 24), { col: '#e8dcbc', align: 'center' });
    },
};

// ---- the seals on the beat ----
const SEALS_1B = {
    south: { name: 'south', ring: [0, 4, 2, 6, 1, 5, 3, 7], center: 0, num: '031', clay: 'dry', diffs: [], title: 'The South Tomb' },
    kagemni: { name: 'kagemni', ring: [5, 1, 7, 3, 0, 2, 6, 4], center: 6, num: '207', clay: 'old', diffs: [], title: 'The Mastaba of Kagemni' },
    service: { name: 'service', ring: [3, 7, 0, 4, 6, 1, 5, 2], center: 5, num: '114', clay: 'fresh', diffs: [{ el: 'ring', i: 5, to: 2 }, { el: 'num', i: 2, to: '7' }], title: 'The Serapeum Service Door' },
};
const sealDone = k => sflag('c1b_seal_' + k) === 'ok';
const roundDone = () => ['south', 'kagemni', 'service'].every(sealDone);
function sealCheck(key) {
    playMinigame('sealcheck', Object.assign({}, SEALS_1B[key]), r => {
        if (r.left) return;
        clockAdvance(10);
        if (!r.ok) { startDialogue('c1b_seal_again'); return; }
        sflag('c1b_seal_' + key, 'ok'); skillXP('investigation', r.forged ? 40 : 15, 'a seal');
        if (key === 'service') { storyNote('The Serapeum service door', 'The seal on the service door is forged: ring sign six and the last digit are wrong (114 in the register, 117 on the door), and the clay is still damp. Somebody opened this door in the last day or two and sealed it again with a stamp of their own.'); storyNotice('That seal was put on this week.'); }
        if (roundDone()) c1bRoundDone();
        else startDialogue('c1b_seal_logged');
    });
}
scene('c1b_seal_again', { speaker: 'System', text: 'You lower the register. It isn\'t right yet. Take it slowly: sign by sign, digit by digit.', choices: [{ text: 'Step back.' }] });
scene('c1b_seal_logged', { speaker: 'System', text: () => `Logged in the register: ${['south', 'kagemni', 'service'].filter(sealDone).length} of the three seals on your beat.`, choices: [{ text: 'On with the round.' }] });
const sealIntro = `Your job, every morning: the register in one hand, the seal in front of you. Every sealed tomb has its stamp in the book. Compare them part by part: the eight signs round the ring, the emblem, the three digits of the number. Mark anything on the door that isn't in the book, then sign.\n\nOld clay crumbles and cracks. That's weather, not forgery.`;
function sealScene(key, intro) {
    return {
        speaker: 'System',
        get text() { return sealDone(key) ? `${SEALS_1B[key].title}: the seal is checked and logged in today's register.` : intro + (sflag('c1b_seal_told') ? '' : '\n\n' + sealIntro); },
        get choices() {
            if (sealDone(key) || !sflag('c1b_fathi')) return [{ text: 'Move on.' }];
            return [{ text: 'Check the seal against the register.', onSelect: () => { sflag('c1b_seal_told', true); sealCheck(key); } }, { text: 'Later.' }];
        },
    };
}
scene('c1b_seal_south', sealScene('south', `The South Tomb's stairway, going down under the cobra wall: a wooden barrier across it, a rope through two iron staples, and on the knot a lump of dried clay stamped with the Ministry's seal.`));
scene('c1b_seal_kagemni', sealScene('kagemni', `The Mastaba of Kagemni, the vizier, closed for restoration: the painted rooms inside are the finest in the Teti cemetery, so the door is kept sealed. The clay on the rope is old, pale, crumbling at the edges. It's been there since the spring.`));
scene('c1b_seal_service', sealScene('service', `A steel service door in the cliff beside the Serapeum's steps: the way the Ministry's engineers go down to the galleries' pumps. It should be locked, and sealed, and nobody has any reason to use it.\n\nThe padlock is locked. The clay on the rope is dark and smells of the river, and something is trodden into the sand by the door.`));
STORY_SCRIPTS.c1b_southtomb = () => sflag('c1b_fathi') && !sealDone('south') ? 'c1b_seal_south' : null;
STORY_SCRIPTS.c1b_kagemni = 'c1b_seal_kagemni';
STORY_SCRIPTS.c1b_servicedoor = 'c1b_seal_service';
// Samy's cigarettes
STORY_SCRIPTS.c1b_cigs = 'c1b_cigs';
scene('c1b_cigs', {
    speaker: 'System',
    text: () => sflag('c1b_cigs') ? 'The cigarette ends are in your pocket, in a Ministry evidence bag.' : `By the service door, trodden into the sand: four cigarette ends, and a crushed packet. Cleopatra, the cheap ones. Samy smokes Cleopatra and always crushes the packet flat when it's empty, like a man stamping on a scorpion.\n\nThey're fresh. The dew hasn't touched them.`,
    get choices() { return sflag('c1b_cigs') ? [{ text: 'Move on.' }] : [{ text: 'Bag them.', onSelect: () => { sflag('c1b_cigs', true); AREAS.inspector.sync(); pocket('Cigarette ends (Cleopatra)'); storyNote('By the Serapeum service door', 'Four Cleopatra cigarette ends and a crushed packet, fresh, by the service door that should never be used. Samy smokes Cleopatra and crushes his packets flat.'); if (roundDone()) c1bRoundDone(); } }]; },
});
ITEM_INFO['Cigarette ends (Cleopatra)'] = { desc: 'Four Cleopatra cigarette ends and a crushed packet from beside the Serapeum service door, in a Ministry evidence bag. Samy\'s brand, Samy\'s habit.' };
function c1bRoundDone(quiet) {
    if (sflag('c1b_round_done') || !sflag('c1b_cigs')) { if (!sflag('c1b_cigs') && !quiet) startDialogue('c1b_seal_logged'); return; }
    sflag('c1b_round_done', true); taskDone('c1b_round');
    task('c1b_samy_watch', 'The service door was opened and sealed again with a forged stamp, and Samy\'s cigarettes were beside it. Find Samy.');
    if (!quiet) startDialogue('c1b_round_end');
}
scene('c1b_round_end', { speaker: 'System', text: `Three seals checked. Two honest. One forged, on a door nobody should use, with Samy's cigarette ends beside it.\n\nSamy Ragab stayed late last night. Samy has a new motorbike. Samy's round handwriting is on the label of an empty shelf.`, choices: [{ text: 'Go and find Samy.' }] });

// ---- the people, now that there's a round ----
STORY_SCRIPTS.c1b_ghaffir = 'c1b_ghaffir2';
scene('c1b_ghaffir2', {
    speaker: 'The Ghaffir',
    text: () => sealDone('service')
        ? `"The service door?" The ghaffir scratches his beard. "Only the engineers use that. And the inspectors. The engineers haven't come since Ramadan." He looks at the sand, and then at you. "Last night a motorbike came up the road without its light. I heard it. I didn't see it. At my age, Inspector, you hear a lot and see very little."`
        : `The Serapeum's ghaffir takes his time getting up, and more time pointing at the gate. "Locked, Inspector. Locked since the last tour. I locked it myself." A pause. "Mostly I lock it myself."`,
    choices: [{ text: 'Move on.', onSelect: () => { if (sealDone('service') && !sflag('c1b_ghaffir_bike')) { sflag('c1b_ghaffir_bike', true); storyNote('The ghaffir', 'A motorbike came up the Serapeum road last night with its light off. He heard it. He didn\'t see it.'); } } }],
});
STORY_SCRIPTS.c1b_samy = () => sflag('c1b_round_done') ? 'c1b_samy_round' : 'c1b_samy';
scene('c1b_samy_round', {
    speaker: 'Samy Ragab',
    text: () => sflag('c1b_samy_bolted') ? `Samy's motorbike is gone from the yard. The helmet is gone. The shade where it stood is still cool.` : `Samy is on his phone by the motorbike and hangs up the moment he sees you. "Ya salaam, the round is done already? Good, good, very efficient."\n\nYou hold up the evidence bag with the cigarette ends in it. He looks at it for exactly one second too long.\n\n"Cleopatra. Everybody smokes Cleopatra. Half of Egypt." He's already putting on the helmet. "I have to go to Mit Rahina. My cousin's shop, the insurance. Tell the Director. Two hours."`,
    get choices() {
        if (sflag('c1b_samy_bolted')) return [{ text: 'Move on.' }];
        return [{ text: 'Let him go, and watch which way he rides.', onSelect: () => {
            sflag('c1b_samy_bolted', true); taskDone('c1b_samy_watch');
            const m = Game.maps.ch1, s = m.ents.find(e => e.id === 'c1b_samy'), bk = m.ents.find(e => e.id === 'c1b_bike'); if (s) s.gone = true; if (bk) World.removeEnt(m, bk);
            storyNote('Samy Ragab', '"Cleopatra. Everybody smokes Cleopatra." He left on the motorbike for Mit Rahina, "my cousin\'s shop", the moment he saw the evidence bag.');
            task('c1b_tail', 'Samy rode down to Mit Rahina. Find him there and follow him, without being seen.');
        } }];
    },
});
STORY_SCRIPTS.c1b_fathi = () => sflag('c1b_round_done') && !sflag('c1b_fathi_round') ? 'c1b_fathi_round' : 'c1b_fathi';
scene('c1b_fathi_round', {
    speaker: 'Director Fathi',
    text: `You tell the Director: a forged seal on the Serapeum service door, the clay still damp.\n\nThe newspaper stays up. "A forged seal." A long pause. "Write it up. In triplicate. File it." The newspaper doesn't move. "Today is Tuesday, Inspector. Tuesdays are busy. Go home early."`,
    choices: [{ text: '"Yes, Director."', onSelect: () => { sflag('c1b_fathi_round', true); storyNote('Director Fathi Mansour', 'A forged seal on the Serapeum: "Write it up. In triplicate. File it." He told me to go home early. Tuesdays, he says, are busy.'); } }],
});
// where the round takes you (the compass)
TASK_TARGETS.c1b_round = () => !sealDone('south') ? 'c1b_southtomb' : !sealDone('kagemni') ? 'c1b_kagemni' : !sealDone('service') ? 'c1b_servicedoor' : 'c1b_cigs';
TASK_TARGETS.c1b_samy_watch = () => 'c1b_samy';

// ---- the map: the three sealed doors, the cigarettes ----
POKE_MAP_1B.objects.push(
    { id: 'c1b_kagemni', label: 'Mastaba of Kagemni', model: 'mastaba', say: null },
    { id: 'c1b_servicedoor', label: 'Service Door', model: 'service door', say: null },
    { id: 'c1b_cigs', label: 'Cigarette Ends', model: 'cigarette ends', say: null });
function tombSeal(A, x, y) {                                               // a rope through two staples, a lump of clay on the knot, the stamp's ring
    A.line(x - 10, y - 2, x - 3, y + 1, '#c8b888'); A.line(x + 10, y - 2, x + 3, y + 1, '#c8b888'); A.r(x - 12, y - 4, 3, 3, '#5a6272'); A.r(x + 10, y - 4, 3, 3, '#5a6272');
    A.ell(x, y + 2, 4, 4, '#1c1410'); A.ell(x, y + 2, 3, 3, '#b07a48'); A.ell(x - 1, y + 1, 1, 1, '#d8a870'); A.px(x + 1, y + 3, '#6a4020');
}
SPR.c1b_southtomb = (w, d, o) => { const sp = SPR_L['south tomb'](w, d, o), A = pa(sp.c.getContext('2d')); A.r(52, 36, 20, 3, '#8e5e32'); A.hl(52, 36, 20, '#b8844c'); tombSeal(A, 62, 42); return sp; };
SPR.c1b_kagemni = (w, d, o) => { const sp = SPR_L['mastaba'](w, d, o), A = pa(sp.c.getContext('2d')), dx = 1 + Math.round(w * 0.35) + 10, fy = 7 + d - 10; tombSeal(A, dx, fy + 14); return sp; };
SPR_L['service door'] = (w, d) => {                                        // a steel door in the rock, a padlock, a rope and seal across the hasp
    const st = propStage(w, d, 30, 40), { A } = st, x = st.x, y = st.y;
    A.r(x + 1, y, 28, 40, '#8e7658'); A.r(x + 3, y + 2, 24, 38, '#5a6272'); A.vl(x + 4, y + 2, 38, '#86949e'); A.vl(x + 26, y + 2, 38, '#3e4650');
    for (let j = y + 8; j < y + 40; j += 10) A.hl(x + 5, j, 20, '#4a525c');
    A.r(x + 20, y + 18, 5, 6, '#c89020'); A.px(x + 21, y + 18, '#ffe890');
    tombSeal(A, x + 15, y + 22);
    A.r(x + 1, y, 28, 3, '#bca47e'); A.hl(x + 1, y + 39, 28, '#3e4650');
    return propFit(st, w, d, { solid: [(w - 28) / 2, d - 6, 28, 6] });
};
SPR_L['cigarette ends'] = (w, d) => {
    const st = propStage(w, d, 16, 8), { A } = st, x = st.x, y = st.y;
    for (const [a, b] of [[1, 5], [5, 3], [9, 6], [12, 4]]) { A.r(x + a, y + b, 3, 1, '#f4f0e4'); A.px(x + a + 3, y + b, '#d8a060'); }
    A.poly([[x + 4, y], [x + 11, y + 1], [x + 10, y + 3], [x + 3, y + 2]], '#e8dcc0'); A.r(x + 5, y + 1, 4, 1, '#c83828');
    return Object.assign(propFit(st, w, d, { flat: true }), { sparkle: true });
};

// ---- the world matching the story (after a load) ----
AREAS.inspector.sync = function () {
    const m = Game.maps.ch1; if (!m) return;
    if (sflag('c1b_samy_bolted')) { const s = m.ents.find(e => e.id === 'c1b_samy'), bk = m.ents.find(e => e.id === 'c1b_bike'); if (s) s.gone = true; if (bk && !bk.gone) World.removeEnt(m, bk); }
    if (sflag('c1b_cigs')) { const c = m.ents.find(e => e.id === 'c1b_cigs'); if (c && !c.gone) World.removeEnt(m, c); }
};
