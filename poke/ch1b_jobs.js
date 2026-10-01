// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE INSPECTOR'S JOBS (poke/ch1b_jobs.js)
// Chapter 1-B, the bible's three jobs and the seal register:
//   - the seal register (the Inspector's answer to Miriam's metal detector):
//     eight sealed tomb shafts across the necropolis, each on the register.
//     Take a shift at the duty roster in the inspectorate; check each with the
//     seal minigame: 40 EGP a seal, 100 when the shift's done. Two are forged
//     with Samy's faulty stamp (they lead into The Forged Seal)
//   - guiding tourists round the Step Pyramid complex: the guide's quiz (new),
//     once Léo's father has vouched for you (SQ-01B-04)
//   - sieving at the Teti dig for Rais Gad (the sieve minigame), paid by the find
// ============================================================

// ---- the seal register ----
const REG_SEALS = [   // [id, tile x, tile y, register number, forged?]
    ['c1b_reg1', 18, 36, '312', false], ['c1b_reg2', 6, 30, '318', false], ['c1b_reg3', 41, 14, '325', true], ['c1b_reg4', 19, 12, '331', false],
    ['c1b_reg5', 27, 46, '340', false], ['c1b_reg6', 16, 50, '347', true], ['c1b_reg7', 40, 44, '352', false], ['c1b_reg8', 11, 24, '366', false],
];
REG_SEALS.forEach(([id, , , num, forged], k) => {
    const R = rng(id), ring = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => R() - 0.5); if (ring[5] === 2) { const j = ring.indexOf(6); ring[5] = 6; ring[j] = 2; }
    SEALS_1B[id] = { name: id, ring, center: Math.floor(R() * 8), num, clay: k % 3 === 0 ? 'old' : 'dry', diffs: forged ? [{ el: 'ring', i: 5, to: 2 }] : [], title: 'Sealed Shaft (register ' + num + ')' };
});
POKE_MAP_1B.objects.push(...REG_SEALS.map(([id, , , num]) => ({ id, label: 'Sealed Shaft', model: 'sealed shaft', say: ['System', 'A tomb shaft in the desert floor, capped with a slab of limestone. A rope through two iron staples, a lump of clay on the knot, and a tin tag: SAQ ' + num + '. It\'s on the seal register.'] })));
SPR_L['sealed shaft'] = (w, d) => {                       // a limestone slab over a shaft, the rope, the seal, the tin tag
    const st = propStage(w, d, 30, 20), { A } = st, x = st.x, y = st.y;
    A.ell(x + 15, y + 15, 14, 5, '#b8a47c'); A.r(x + 3, y + 5, 24, 11, '#d8cca8'); A.r(x + 3, y + 5, 24, 2, '#f0e8d0'); A.r(x + 3, y + 14, 24, 2, '#a8946c');
    for (let i = 0; i < 4; i++) A.px(x + 6 + i * 6, y + 9 + (i & 1), '#b8a884');
    tombSeal(A, x + 15, y + 9); A.r(x + 21, y + 13, 5, 4, '#c8ccd0'); A.px(x + 22, y + 14, '#5a6272');
    return propFit(st, w, d, { solid: [(w - 24) / 2, d - 10, 24, 10] });
};
const regDone = id => sflag('c1b_reg_' + id) === 'ok';
const regCount = () => REG_SEALS.filter(([id]) => regDone(id)).length;
const shiftOn = () => Story.s.tasks.some(t => t.id === 'c1b_sealshift' && !t.done);
for (const [id] of REG_SEALS) {
    STORY_SCRIPTS[id] = 'c1b_regseal';
}
scene('c1b_regseal', {
    speaker: 'System',
    get text() { const id = Game.talkId, S = SEALS_1B[id] || { title: 'A sealed shaft' }; return regDone(id) ? `${S.title}: checked and logged.` : shiftOn() ? `${S.title}. A slab over a tomb shaft, a rope, the clay seal. You open the register at its page.` : `${S.title}: on the register, waiting for an inspector with a shift. (The duty roster is in the inspectorate.)`; },
    get choices() { const id = Game.talkId; return SEALS_1B[id] && !regDone(id) && shiftOn() ? [{ text: 'Check the seal.', onSelect: () => regCheck(id) }, { text: 'Later.' }] : [{ text: 'Move on.' }]; },
});
function regCheck(id) {
    playMinigame('sealcheck', Object.assign({}, SEALS_1B[id]), r => {
        if (r.left) return;
        clockAdvance(10);
        if (!r.ok) { startDialogue('c1b_seal_again'); return; }
        sflag('c1b_reg_' + id, 'ok'); storyPay(40, 'Seal shift: ' + SEALS_1B[id].title); skillXP('investigation', r.forged ? 30 : 10, 'a seal');
        if (r.forged) { sflag('c1b_reg_forged', (sflag('c1b_reg_forged') || 0) + 1); storyPay(60, 'A forged seal, reported'); startDialogue('c1b_reg_forged'); return; }
        regAfter();
    });
}
function regAfter() {
    const n = regCount();
    if (n >= REG_SEALS.length && !sflag('c1b_shift_done')) { sflag('c1b_shift_done', true); taskDone('c1b_sealshift'); storyPay(100, 'Seal shift complete'); rep('ministry', 3, true); startDialogue('c1b_shift_done'); }
    else Toast.show('Logged: ' + n + ' of ' + REG_SEALS.length + ' on the register.');
}
scene('c1b_reg_forged', {
    speaker: 'System',
    text: `Forged. The clay is weeks old, dry, a good job, and the same mistake as on the Serapeum's service door: the sixth sign round the ring is the reed where the register has the loop.\n\nThe same faulty stamp. Somebody has been opening tombs all over your beat.`,
    choices: [{ text: 'Note it, and go on.', onSelect: () => {
        storyNote('The seal register', 'A forged seal on a registered tomb shaft, made with the same faulty stamp as the Serapeum service door (the sixth sign wrong). Someone has been opening tombs across the necropolis.');
        if (!sflag('c1b_fseal_asked') && !sflag('ch1b_forged_seals')) { sflag('c1b_fseal_asked', true); task('c1b_forgedseal', '(The Forged Seal) The same faulty stamp on the seal register: check the seals on the three registered mastabas in the mastaba field, quietly.'); }
        regAfter();
    } }],
});
scene('c1b_shift_done', { speaker: 'System', text: () => `Eight seals, eight pages, eight signatures. ${sflag('c1b_reg_forged') ? sflag('c1b_reg_forged') + ' forged, reported.' : 'Every one honest.'} The shift's done, and the Ministry pays for a done shift.`, choices: [{ text: 'Close the register.', onSelect: () => storyNote('The seal shift', 'Checked all eight sealed shafts on the register in one shift.' + (sflag('c1b_reg_forged') ? ' ' + sflag('c1b_reg_forged') + ' of them forged with the faulty stamp.' : '')) }] });
ITEM_INFO['Seal register'] = { key: 1, get desc() { return 'The seal register for your beat: every sealed tomb and shaft, its stamp, its number. Logged today: ' + regCount() + ' of ' + REG_SEALS.length + ' shafts.' + (sflag('c1b_reg_forged') ? ' Forged: ' + sflag('c1b_reg_forged') + '.' : ''); } };
ITEM_USE['Seal register'] = () => Toast.show('The register: ' + regCount() + ' of ' + REG_SEALS.length + ' shafts logged today.' + (sflag('c1b_reg_forged') ? ' ' + sflag('c1b_reg_forged') + ' forged.' : ''));
// the duty roster, on the wall of the inspectorate
(function () {
    const R = ROOMS.INT_INSPECTORATE, b = R.build;
    R.build = function (ctx) {
        b.call(this, ctx);
        const { A, wall } = ctx, x = 104, y = 14;
        A.r(x - 1, y - 1, 34, 28, PAL.wood[3]); A.r(x, y, 32, 26, '#c89a5c'); A.r(x + 3, y + 3, 26, 20, '#f4f0e4'); for (let j = 0; j < 6; j++) A.r(x + 5, y + 5 + j * 3, 14 + (j * 5) % 8, 1, '#3a4050'); A.r(x + 22, y + 6, 4, 4, '#d04838');
        wall(x - 2, 36, null, { label: 'Duty Roster', script: 'c1b_roster' });
    };
})();
scene('c1b_roster', {
    speaker: 'System',
    text: () => sflag('c1b_shift_done') ? `The duty roster: today's seal shift, your name, and a tick against it in the Director's green ink.` : shiftOn() ? `The duty roster: your name against today's seal shift. Logged so far: ${regCount()} of ${REG_SEALS.length}.` : `The duty roster, pinned to the wall: the inspectors' names, the beats, and today's seal shift with nobody's name against it.\n\nEight sealed tomb shafts across the necropolis, each on the register. Forty pounds a seal logged; a hundred more when the shift's done.`,
    get choices() { return sflag('c1b_shift_done') || shiftOn() ? [{ text: 'Move on.' }] : [{ text: 'Write your name against the shift.', onSelect: () => { pocket('Seal register', 1, true); task('c1b_sealshift', '(Seal shift) Check the eight sealed shafts on the register across the necropolis: 40 EGP a seal, 100 for the shift.'); Toast.show('The seal register is in your bag.'); } }, { text: 'Not today.' }]; },
});

// ---- guiding: the quiz ----
const GUIDE_QS = [
    ['A man with a camera: "Who built this? The big one with the steps?"', ['King Djoser, the Third Dynasty', 'Khufu, who built Giza', 'Ramesses the Great'], 0],
    ['"And the architect? There was an architect?"', ['Imhotep, later worshipped as a god', 'Senenmut, Hatshepsut\'s man', 'Nobody knows'], 0],
    ['A child: "How many steps has it got?"', ['Six', 'Four', 'Twelve'], 0],
    ['"How old is it, really?"', ['About 4,650 years', 'About 2,000 years', 'About 10,000 years'], 0],
    ['At the serdab: "Why is there a statue in a box with holes in it?"', ['So the king\'s spirit can look out and receive offerings', 'To scare away robbers', 'The box is where they kept the grain'], 0],
    ['In the Heb-Sed court: "What happened here?"', ['The jubilee: the king proved he was still fit to rule', 'Royal weddings', 'A market for the builders'], 0],
    ['At the wall: "So many doors, and they\'re all fake?"', ['Fourteen are false. Only one is a real way in', 'They were bricked up by the Romans', 'All of them were real once'], 0],
    ['A man from Belgium: "Is it true that aliens built it?"', ['"No. Egyptians did, with copper tools and a great deal of bread."', '"Yes, obviously."', '"Ask the camel man."'], 0],
    ['"What\'s the Serapeum, that the guidebook talks about?"', ['The galleries where the sacred Apis bulls were buried', 'A Roman bathhouse', 'A temple for cats'], 0],
];
MINIS.guide = {
    title: 'GUIDING', keys: '▲▼: choose an answer    SPACE: say it    ESC: leave',
    start(o) { const R = rng('tour' + Math.floor(Story.s.clock)), qs = GUIDE_QS.map((q, i) => i).sort(() => R() - 0.5).slice(0, 6).map(i => { const [t, opts, right] = GUIDE_QS[i], order = [0, 1, 2].sort(() => R() - 0.5); return { t, opts: order.map(k => opts[k]), right: order.indexOf(right) }; }); return { qs, i: 0, sel: 0, mood: 0.6, right: 0, flash: 0, said: null }; },
    update(S, dt, I) {
        S.flash = Math.max(0, S.flash - dt);
        if (S.said) { if (S.flash <= 0) { S.said = null; S.i++; S.sel = 0; if (S.i >= S.qs.length) { const pay = 120 + S.right * 30; Mini.finish({ ok: true, right: S.right, pay }, S.right >= 5 ? 'The group applauds you at the coach park. Somebody wants a photo with you. The tips are generous.' : S.right >= 3 ? 'A decent tour. A few people look things up on their phones afterwards, which is a compliment of sorts.' : 'The group leaves politely, and a little confused about who built what.', S.right + ' OF ' + S.qs.length + ' · ' + pay + ' EGP'); } } return; }
        if (I.up) { S.sel = (S.sel + 2) % 3; Sfx.move(); } if (I.down) { S.sel = (S.sel + 1) % 3; Sfx.move(); }
        if (I.ok) { const q = S.qs[S.i], ok = S.sel === q.right; if (ok) { S.right++; S.mood = Math.min(1, S.mood + 0.12); Sfx.tone(880, 0.08, 'triangle', 0.06); } else { S.mood = Math.max(0, S.mood - 0.15); Sfx.tone(160, 0.12, 'square', 0.05); } S.said = ok ? 'right' : 'wrong'; S.flash = 1.1; }
    },
    draw(S, g, A, VW, VH) {
        const q = S.qs[Math.min(S.i, S.qs.length - 1)], w = Math.min(VW - 24, 420), x = (VW - w) >> 1;
        // the Step Pyramid behind, the group in front
        const py = 40; for (let k = 0; k < 6; k++) { const ww = 200 - k * 28, h = 14; A.r((VW - ww) >> 1, py + 84 - k * h, ww, h, k % 2 ? '#d8b878' : '#c8a868'); A.hl((VW - ww) >> 1, py + 84 - k * h, ww, '#f0d898'); }
        for (let i = 0; i < 7; i++) { const tx = (VW >> 1) - 84 + i * 28, ty = py + 104; A.ell(tx, ty + 12, 7, 3, 'rgba(0,0,0,0.25)'); A.r(tx - 4, ty - 2, 8, 12, ['#f07860', '#a8d8f0', '#f0d040', '#58a848', '#f4f0e4', '#c070c0', '#e09040'][i]); A.ell(tx, ty - 6, 4, 4, ['#f0c8a0', '#e8b890', '#c89070'][i % 3]); if (i % 3 === 0) A.r(tx - 5, ty - 11, 10, 3, '#e8d088'); }
        // the mood of the group
        const gx = (VW >> 1) - 70; Txt.draw(g, 'THE GROUP', gx, 8, { col: '#c8d0f0' }); A.r(gx + 64, 10, 102, 8, '#1c1814'); A.r(gx + 65, 11, Math.round(100 * S.mood), 6, S.mood > 0.6 ? '#60c060' : S.mood > 0.3 ? '#f0c040' : '#e05030');
        Txt.draw(g, 'QUESTION ' + Math.min(S.i + 1, S.qs.length) + ' OF ' + S.qs.length, x + w - 4, 8, { col: '#c8d0f0', align: 'right' });
        // the question, the answers
        const by = py + 128, lines = Txt.wrap(q.t, w - 24);
        frame(g, x, by, w, 22 + lines.length * 12 + 3 * 14);
        lines.forEach((ln, i) => Txt.draw(g, ln, x + 12, by + 8 + i * 12, { col: UI.ink }));
        q.opts.forEach((o, i) => { const yy = by + 14 + lines.length * 12 + i * 14, on = S.sel === i, col = S.said && i === q.right ? '#2e8a3e' : S.said && on && S.said === 'wrong' ? '#c83828' : on ? UI.ink : '#6a6a78'; if (on) A.poly([[x + 12, yy + 2], [x + 12, yy + 10], [x + 17, yy + 6]], '#d04838'); Txt.draw(g, o, x + 22, yy, { col }); });
    },
};
STORY_SCRIPTS.c1b_bus = () => sflag('c1b_guide_job') ? 'c1b_tour' : null;
const tourReady = () => sflag('c1b_tour_at') == null || Story.s.clock - sflag('c1b_tour_at') >= 120;
scene('c1b_tour', {
    speaker: 'Guide',
    text: () => !dayNow() ? `The tour bus, dark and empty, its driver asleep across the front seats. No tours at night.` : tourReady() ? `A group from Lyon spilling out of the bus, hats and cameras and a teacher with a clipboard. The licensed guide, hoarse, sees you and almost weeps with relief. "Inspector! Léo's father told everyone. Take this lot round the Step Pyramid? The office pays, and they tip."` : `"The next group isn't till later, Inspector," the guide says. "Even the pyramid needs a rest."`,
    get choices() { return dayNow() && tourReady() ? [{ text: 'Take the group round the complex. (about 45 minutes)', onSelect: () => { sflag('c1b_tour_at', Story.s.clock); playMinigame('guide', {}, r => { if (r.left) return; clockAdvance(45); storyPay(r.pay, 'Guiding a tour of the Step Pyramid'); skillXP('investigation', r.right * 4, 'the tour'); sflag('c1b_tours', (sflag('c1b_tours') || 0) + 1); if (r.right >= 5) rel('village', 2, true); }); } }, { text: 'Not now.' }] : [{ text: 'Move on.' }]; },
});
scene('c1b_guide_talk', { speaker: 'Guide', text: () => sflag('c1b_guide_job') ? `"The groups wait at the bus, at the coach park, Inspector. The Step Pyramid tour: you know it better than me, I think."` : `A licensed guide with a clipboard and a voice worn thin. "Memphis! Capital of Egypt for three thousand years! Please do not touch Memphis."\n\nHe looks at your Ministry card. "The office only lets inspectors guide when somebody vouches for them. A happy tourist. A grateful father." He shrugs. "Tourists lose things here all the time. Children, mostly."`, choices: [{ text: 'Move on.' }] });
STORY_SCRIPTS.c1b_guide = 'c1b_guide_talk';

// ---- sieving at the Teti dig ----
STORY_SCRIPTS.c1b_tetisieve = 'c1b_tsieve';
const tsieveLeft = () => 3 - (sflag('c1b_tsieve_runs') || 0);
scene('c1b_tsieve', {
    speaker: 'Rais Gad',
    text: () => !dayNow() ? `The sieve on its trestles, a tarpaulin over the spoil. Rais Gad's men have gone home.` : tsieveLeft() > 0 ? `Rais Gad sees you eyeing the sieve. "An inspector who sieves! My cousin won't believe it." He waves at the spoil. "Go on. Whatever you find goes on the register and the Ministry pays the finder. Beads, mostly. Sometimes a scarab."` : `"Enough, Inspector, enough," says Rais Gad. "You'll put my men out of work."`,
    get choices() { return dayNow() && tsieveLeft() > 0 ? [{ text: 'Sift a heap. (' + tsieveLeft() + ' left today, about 20 minutes)', onSelect: () => playMinigame('sieve', {}, r => { if (r.left) return; sflag('c1b_tsieve_runs', (sflag('c1b_tsieve_runs') || 0) + 1); clockAdvance(20); if (r.bagged) skillXP('excavation', r.bagged.length * 10); if (r.earned) storyPay(r.earned, 'Sieve finds, the Teti dig'); rel('gad', 1, true); }) }, { text: 'Not now.' }] : [{ text: 'Move on.' }]; },
});

// ---- the compass; the end card ----
TASK_TARGETS.c1b_sealshift = () => REG_SEALS.map(r => r[0]).filter(id => !regDone(id));
(window.C1B_END_LINES = window.C1B_END_LINES || []).push(
    f => f.c1b_shift_done && 'You did a full seal shift: eight shafts on the register.',
    f => f.c1b_tours && 'You guided ' + f.c1b_tours + (f.c1b_tours > 1 ? ' tours' : ' tour') + ' round the Step Pyramid.',
);
