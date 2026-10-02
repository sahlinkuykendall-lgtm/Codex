// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MARSA TARFA'S SIDE QUESTS, PART 1 (poke/ch1c_side.js)
// The bible's side quests for Chapter 1-C (story/regions/ch01_opening_fixer.md):
//   SQ-01C-01 Rana's Reef: ghost nets on the north reef. Rana takes you out by day; the
//             DIVING minigame (new). → diving XP, Rana's dive card (a Ch3 dive kit discount)
//   SQ-01C-02 The Fort's Cannon: the old man's legend of the Turks' pay chest. His grandson's
//             metal detector on the old gun platform; the DETECTOR minigame (new). → an Ottoman
//             coin hoard (a Rare find)
// Side-quest tasks are written "(Name) ..." so the chapter end leaves them open (KEEP EXPLORING)
// and the leaving line counts them.
// ============================================================

Object.assign(ITEM_INFO, {
    "Rana's dive card": { key: 1, desc: 'A laminated card from Rana\'s dive shop, her signature across it: "Bearer cleared the north reef. Any shop that knows me: give this one a kit at cost." It will be worth something in Alexandria.' },
    "Metal detector": { key: 1, desc: 'The old man\'s grandson\'s metal detector, Chinese, yellow, bought for combing the beach for tourists\' rings. It beeps at everything. The trick is listening to how it beeps.' },
    'Ottoman coin hoard': { key: 1, desc: 'A rotted leather purse and, inside it, coins: silver paras and akçes, a few gold sultanis, the tughra of Sultan Selim III on the best of them. The Turks\' pay chest, or one soldier\'s share of it. A Rare find.' },
});

// the chapter's end ticks off its own tasks, but never a side quest's
(function () {
    const _end = c1cChapterEnd;
    c1cChapterEnd = function () {
        const side = Story.s.tasks.filter(t => !t.done && t.text[0] === '(');
        side.forEach(t => { t.id = '~' + t.id; });                                   // (hide them from its /^c1c_/ sweep)
        const r = _end.apply(this, arguments);
        side.forEach(t => { t.id = t.id.slice(1); });
        return r;
    };
})();

// ---- the map: the old gun platform on the fort's headland ----
(function () {
    const L0 = marsaLayout;
    marsaLayout = function () { const L = L0(); L.things.push(['c1c_gunstone', 62, 6, 2, 1]); return L; };
})();
POKE_MAP_1C.objects.push({ id: 'c1c_gunstone', label: 'Old Gun Platform', model: 'gun platform', say: ['System', 'A platform of big dressed stones at the edge of the headland, facing the sea, newer mortar between them than the fort\'s walls. An iron ring for a gun\'s tackle, rusted to a lump.'] });
SPR_L['gun platform'] = (w, d) => {
    const st = propStage(w, d, 60, 22), { A } = st, x = st.x, y = st.y;
    A.r(x, y + 6, 60, 14, '#a89070'); A.r(x, y + 6, 60, 3, '#c8b090');                            // the platform
    for (let i = 0; i < 5; i++) { A.vl(x + 12 * i, y + 6, 14, '#7a6448'); A.r(x + 12 * i + 2, y + 10 + (i % 2) * 3, 8, 1, '#8a7458'); }
    A.hl(x, y + 13, 60, '#7a6448');
    A.ell(x + 30, y + 10, 4, 3, '#5a3a24'); A.ell(x + 30, y + 10, 2, 1, '#a89070');               // the rusted ring
    A.r(x + 2, y + 2, 8, 5, '#b8a080'); A.r(x + 50, y + 3, 8, 4, '#b8a080');                      // stones heaved out of place
    return propFit(st, w, d, { solid: [0, d - 16, w, 14] });
};

// ============================================================
// SQ-01C-01: RANA'S REEF
// ============================================================
const reefDay = () => { const c = Story.s.clock; return c >= 7 * 60 && c < 17 * 60 + 30; };
let RANA_PREV = null;
(function () {
    const prev = STORY_SCRIPTS.c1c_rana;
    STORY_SCRIPTS.c1c_rana = e => {
        const r = typeof prev === 'function' ? prev(e) : prev;
        if (r === 'c1c_rana' && sflag('c1c_rana') && sflag('c1c_reef') !== 'done') { RANA_PREV = r; return 'c1c_reef_ask'; }
        return r;
    };
})();
scene('c1c_reef_ask', {
    speaker: 'Rana Fouad',
    text: () => !sflag('c1c_reef')
        ? `Rana looks at you over the tank log for a long moment, deciding something.\n\n"A trawler lost a net on the north reef in the storm last week. A ghost net. It's wrapped round three of the big coral heads and it's killing everything that swims into it: parrotfish, a ray, there was a turtle in it on Sunday." She closes the log. "I can't cut it free alone, and the Germans don't come till winter."\n\n"You still remember how to dive?"`
        : `"The net's still down there," Rana says. "Every day it's down there, it kills something." She looks at the clock. "The boat's ready if you are."`,
    get choices() {
        const c = [];
        if (reefDay()) c.push({ text: '"Let\'s go." (the dive: about an hour and a half)', onSelect: () => c1cReefGo() });
        else c.push({ text: '"Tomorrow, then?" (Rana only dives by day)', onSelect: () => { if (!sflag('c1c_reef')) c1cReefAccept(); } });
        if (!sflag('c1c_reef')) c.push({ text: '"Not today, Rana."', onSelect: () => c1cReefAccept() });
        c.push({ text: '"Something else."', onSelect: () => setTimeout(() => startDialogue(RANA_PREV || 'c1c_rana'), 0) });
        return c;
    },
});
function c1cReefAccept() {
    if (sflag('c1c_reef')) return;
    sflag('c1c_reef', 'open');
    task('c1c_sq_reef', '(Rana\'s Reef) Dive the north reef with Rana and cut the ghost net off the coral heads. By day.');
    storyNote('Rana\'s Reef (side quest)', 'A trawler\'s lost net is wrapped round three coral heads on the north reef, killing everything that swims into it. Rana will take you out on her boat, by day, to cut it free.');
}
function c1cReefGo() {
    c1cReefAccept();
    Game.fadeTo(() => {
        Toast.show('Rana\'s boat, out on the north reef. She checks your air, twice.', 4);
        setTimeout(() => playMinigame('dive', { diving: skillLevel('diving') }, r => c1cReefResult(r)), 400);
    });
}
function c1cReefResult(r) {
    if (r.unstarted) { Toast.show('Rana takes the boat back in. "When you\'re ready."'); return; }
    clockAdvance(90); if (Game.set.time === 5) Game.hour = storyHour();
    const n = r.nets || 0;
    skillXP('diving', 25 + n * 25, 'the north reef');
    if (n >= 3) {
        sflag('c1c_reef', 'done'); taskDone('c1c_sq_reef'); rel('rana', 10, true); pocket("Rana's dive card");
        storyNote('Rana\'s Reef (side quest)', 'Done. You cut the ghost net off all three coral heads' + (r.turtle ? ' and freed the turtle caught in it' : '') + '. Rana gave you a card: any dive shop that knows her will give you a kit at cost.');
        startDialogue('c1c_reef_done');
    } else { sflag('c1c_reef_tries', (sflag('c1c_reef_tries') || 0) + 1); startDialogue(n ? 'c1c_reef_part' : 'c1c_reef_none'); }
}
scene('c1c_reef_done', {
    speaker: 'Rana Fouad',
    text: () => `On the boat, Rana pulls her mask up onto her forehead and looks at the heap of dripping net on the deck, then at you.\n\n"You haven't forgotten." ${sflag('c1c_reef_turtle') ? '"And the turtle. Did you see her go?" She is smiling, properly, for the first time in three years. ' : ''}She writes something on a laminated card, signs it across the corner, and holds it out.\n\n"Any shop that knows me. They'll give you a kit at cost." A pause. "Don't sell it."`,
    choices: [{ text: '"I won\'t."' }],
});
scene('c1c_reef_part', {
    speaker: 'Rana Fouad',
    text: `Rana hauls you over the side by your tank strap. "Some of it. Not all." She looks down through the water at what's left of the net, moving on the coral like weed. "We'll go again. Not today: your air's done, and so are you."`,
    choices: [{ text: '"Tomorrow."' }],
});
scene('c1c_reef_none', {
    speaker: 'Rana Fouad',
    text: `Rana hauls you over the side by your tank strap. "You came up too fast and with nothing." She isn't angry, which is worse. "Breathe slower. Go round the fire coral, not through it. We'll go again."`,
    choices: [{ text: '"We\'ll go again."' }],
});
TASK_TARGETS.c1c_sq_reef = () => ({ room: 'INT_DIVESHOP', id: 'c1c_rana', out: 'c1c_diveshop' });

// ---- THE DIVING MINIGAME ----
// A side view of the reef. Swim (◄►▲▼, with the drift water has), find the three coral heads with
// the net on them, hold SPACE beside one to cut it free. Air runs down, faster the deeper you are
// and when fire coral stings you; the moray in its hole lunges if you go too close. Come back up
// to the boat's ladder to finish. Out of air, Rana hauls you up.  → { nets, turtle } · { left }
const DIVE_W = 1100, DIVE_AIR = 75;
MINIS.dive = {
    title: 'THE NORTH REEF', keys: '◄►▲▼ swim    hold SPACE: cut the net    ESC: surface',
    howto: [
        'Cut the ghost net off three coral heads, and come back up to the boat\'s ladder.',
        ['◄►▲▼', 'Swim. Water drifts: you glide on after you let go.'],
        ['SPACE', 'Hold it beside a coral head with the grey net on it to cut it free.'],
        ['AIR', 'Runs down all the time, faster the deeper you go. Out of air and Rana hauls you up.'],
        'Orange fire coral stings (it costs air). The moray in its hole bites if you swim too close. Swim back to the ladder at the top left to finish.',
    ],
    start(o) {
        const heads = [{ x: 330, y: 0.72 }, { x: 640, y: 0.86 }, { x: 930, y: 0.64 }].map((h, i) => ({ ...h, cut: 0, done: false, turtle: i === 1 }));
        return { x: 70, y: 0.12, vx: 0, vy: 0, air: DIVE_AIR + (o.diving || 0) * 6, heads, fire: [{ x: 470, y: 0.9, w: 70 }, { x: 790, y: 0.8, w: 50 }, { x: 1010, y: 0.86, w: 60 }], moray: { x: 560, y: 0.78, lunge: 0 }, sting: 0, face: 1, bubbles: [], msg: 'Down you go. Follow the reef east.', msgT: 3, freed: [] };
    },
    update(S, dt, I, keys) {
        const ax = (keys.right ? 1 : 0) - (keys.left ? 1 : 0), ay = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
        S.vx += ax * 160 * dt; S.vy += ay * 0.42 * dt; S.vx *= Math.pow(0.35, dt); S.vy *= Math.pow(0.3, dt);
        S.vx = Math.max(-110, Math.min(110, S.vx)); S.vy = Math.max(-0.3, Math.min(0.3, S.vy));
        if (ax) S.face = ax;
        S.x = Math.max(20, Math.min(DIVE_W - 20, S.x + S.vx * dt)); S.y = Math.max(0.06, Math.min(0.93, S.y + S.vy * dt));
        S.msgT -= dt; S.sting = Math.max(0, S.sting - dt);
        // air: deeper costs more
        S.air -= dt * (0.7 + S.y * 0.9);
        if (Math.random() < dt * 3) S.bubbles.push({ x: S.x + S.face * 6, y: S.y, t: 0 });
        S.bubbles = S.bubbles.filter(b => (b.t += dt) < 2.5);
        for (const f of S.freed) f.t += dt;
        // fire coral
        for (const f of S.fire) if (Math.abs(S.x - f.x) < f.w / 2 && S.y > f.y - 0.05 && S.sting <= 0) { S.air -= 4; S.sting = 1; S.vy = -0.25; S.msg = 'Fire coral! It burns like a nettle, and you gasp air.'; S.msgT = 2; Sfx.tone(160, 0.15, 'sawtooth', 0.05); }
        // the moray
        const M = S.moray, md = Math.hypot((S.x - M.x) / 300, S.y - M.y);
        if (M.lunge > 0) M.lunge -= dt; else if (md < 0.12 && S.sting <= 0) { M.lunge = 1; S.air -= 5; S.sting = 1.2; S.vx = (S.x < M.x ? -1 : 1) * 90; S.msg = 'The moray lunges out of its hole! You kick away.'; S.msgT = 2; Sfx.tone(120, 0.2, 'square', 0.05); }
        // cutting the net
        let near = null;
        for (const h of S.heads) if (!h.done && Math.abs(S.x - h.x) < 54 && Math.abs(S.y - (h.y - 0.08)) < 0.18) near = h;
        S.near = near;
        if (near && keys.act) {
            S.vx *= Math.pow(0.02, dt); S.vy *= Math.pow(0.02, dt);                       // (one hand on the net: you hold still while you cut)
            near.cut += dt / 2.2;
            if ((S.t * 8 | 0) !== ((S.t - dt) * 8 | 0)) Sfx.tone(700 + Math.random() * 200, 0.02, 'triangle', 0.02);
            if (near.cut >= 1) { near.done = true; S.freed.push({ x: near.x, y: near.y - 0.1, t: 0, turtle: near.turtle }); S.msg = near.turtle ? 'The net falls away, and a green turtle shoulders free and flies off into the blue.' : 'The net falls away. Fish scatter out of it like sparks.'; S.msgT = 3; Sfx.get(); }
        }
        const nets = S.heads.filter(h => h.done).length, turtle = S.heads.some(h => h.done && h.turtle);
        if (S.y < 0.1 && S.x < 110 && S.t > 4 && ay < 0) { Sfx.save(); Mini.finish({ nets, turtle }, nets >= 3 ? 'Up the ladder with the last of the net over your shoulder.' : nets ? 'Up the ladder with ' + nets + ' of the three heads cleared.' : 'Up the ladder with nothing cut.', nets >= 3 ? 'THE REEF IS CLEAR' : nets ? 'PART OF IT' : 'BACK UP'); return; }
        if (S.air <= 0) { Sfx.back(); Mini.finish({ nets, turtle }, 'The needle hits red. You signal, and Rana comes down for you and takes you up slowly, one hand on your tank strap.' + (nets ? ' You cleared ' + nets + ' of three.' : ''), 'OUT OF AIR'); }
        if (turtle) sflag('c1c_reef_turtle', true);
    },
    draw(S, g, A, VW, VH) {
        const top = 26, H = VH - top - 18, cam = Math.max(0, Math.min(DIVE_W - VW, S.x - VW / 2)), Y = y => Math.round(top + y * H);
        for (let i = 0; i < H; i += 4) A.r(0, top + i, VW, 4, mix('#3ab0d8', '#0c3a68', i / H));                         // the water, darker as it deepens
        A.r(0, top, VW, 3, '#bfeaf8');                                                                                     // the surface
        g.globalAlpha = 0.08; for (let k = 0; k < 6; k++) { const x = ((k * 190 - cam * 0.4) % (VW + 200) + VW + 200) % (VW + 200) - 100; A.poly([[x, top], [x + 30, top], [x + 90, top + H], [x + 40, top + H]], '#ffffff'); } g.globalAlpha = 1;
        const X = x => Math.round(x - cam);
        // the sand and the reef
        for (let x = 0; x < VW; x += 2) { const wx = x + cam, h = 0.95 - Math.sin(wx * 0.013) * 0.02; A.r(x, Y(h), 2, top + H - Y(h) + 18, '#d8c8a0'); }
        // the boat and its ladder
        A.r(X(40), top - 10, 90, 10, '#f4f4f0'); A.r(X(40), top - 2, 90, 3, '#3a70c8'); A.r(X(70), top - 18, 30, 8, '#dcdcd4');
        for (let k = 0; k < 4; k++) A.r(X(92), top + k * 5, 10, 1, '#86949e'); A.vl(X(92), top, 18, '#86949e'); A.vl(X(102), top, 18, '#86949e');
        // fire coral
        for (const f of S.fire) for (let k = 0; k < 4; k++) {                                                              // fire coral: stubby orange branching fans
            const fx = X(f.x - f.w / 2 + 8 + k * (f.w - 16) / 3), base = Y(0.95), top = Y(f.y) + (k % 2) * 4;
            A.line(fx, base, fx, top + 6, '#d85a18'); A.line(fx, top + 12, fx - 6, top + 2, '#e86a20'); A.line(fx, top + 10, fx + 6, top, '#e86a20'); A.line(fx - 6, top + 2, fx - 8, top - 3, '#f8a040'); A.line(fx + 6, top, fx + 7, top - 5, '#f8a040');
            A.px(fx - 8, top - 4, '#fff0a0'); A.px(fx + 7, top - 6, '#fff0a0'); A.px(fx, top + 5, '#fff0a0');
        }
        // the coral heads, the net on them
        for (const h of S.heads) {
            const cx = X(h.x), cy = Y(h.y);
            A.ell(cx, cy, 34, 22, '#b85a8a'); A.ell(cx - 8, cy - 6, 20, 13, '#d07aa8'); A.ell(cx + 14, cy + 2, 14, 10, '#8a4a7a');
            for (let k = 0; k < 6; k++) A.r(cx - 26 + k * 10, cy - 20 - (k % 3) * 4, 3, 12, ['#f0c040', '#e86a8a', '#7ac8a0'][k % 3]);
            if (!h.done) {
                g.globalAlpha = 0.85 - h.cut * 0.6;
                for (let k = -4; k <= 4; k++) { A.line(cx + k * 8 - 12, cy - 24, cx + k * 8 + 12, cy + 18, '#6a7a70'); A.line(cx + k * 8 + 12, cy - 24, cx + k * 8 - 12, cy + 18, '#6a7a70'); }
                g.globalAlpha = 1;
                A.ell(cx + 6, cy - 4, 4, 2, '#f08030');                                                                     // a fish caught in it
                if (h.turtle) { A.ell(cx - 10, cy + 4, 9, 6, '#5a7a3a'); A.ell(cx - 10, cy + 4, 7, 4, '#7a9a4a'); A.r(cx - 2, cy + 2, 5, 3, '#6a8a4a'); }
                if (h.cut > 0) { A.r(cx - 20, cy - 34, 40, 4, '#102030'); A.r(cx - 19, cy - 33, Math.round(38 * h.cut), 2, '#f0f0e0'); }
            }
        }
        for (const f of S.freed) {                                                                                         // a turtle swimming off, fish scattering
            if (f.turtle) { const tx = X(f.x + f.t * 70), ty = Y(f.y - f.t * 0.12); if (f.t < 5) { A.ell(tx, ty, 9, 6, '#5a7a3a'); A.ell(tx, ty, 7, 4, '#7a9a4a'); A.r(tx + 8, ty - 2, 5, 3, '#6a8a4a'); A.r(tx - 4, ty + 5 + ((S.t * 4 | 0) % 2), 4, 2, '#6a8a4a'); } }
            else if (f.t < 2) for (let k = 0; k < 6; k++) A.r(X(f.x) + Math.cos(k) * f.t * 60, Y(f.y) + Math.sin(k * 2) * f.t * 30, 3, 2, '#f08030');
        }
        // the moray in its hole
        const M = S.moray, mx = X(M.x), my = Y(M.y), out = M.lunge > 0 ? Math.sin(Math.min(1, M.lunge) * Math.PI) * 18 : 2 + Math.sin(S.t * 2) * 2;
        A.ell(mx, my + 4, 14, 9, '#5a4a3a'); A.ell(mx, my + 4, 7, 5, '#1a1410');
        A.r(mx - 3, my - out, 7, out + 4, '#6a7a2a'); A.r(mx - 3, my - out, 7, 3, '#8a9a3a'); A.px(mx + 2, my - out + 1, '#f0f040');
        // bubbles
        for (const b of S.bubbles) A.r(X(b.x + Math.sin(b.t * 4) * 3), Y(b.y - b.t * 0.12), 2, 2, '#e8f8ff');
        // you
        const dx = X(S.x), dy = Y(S.y), f = S.face, kick = (S.t * 6 | 0) % 2;
        A.r(dx - 9, dy - 2, 18, 5, '#20242c'); A.r(dx - 6 * f - 3, dy - 5, 8, 3, '#f0c040');                                // body, tank
        A.r(dx + 8 * f - 2, dy - 3, 5, 5, '#20242c'); A.r(dx + 9 * f - 1, dy - 2, 3, 2, '#9ed2f4');                          // head, mask
        A.r(dx - 12 * f - 3, dy - 1 + (kick ? -2 : 2), 6, 2, '#3aa8c8');                                                      // fins
        if (S.sting > 0 && (S.t * 10 | 0) % 2) A.r(dx - 10, dy - 6, 20, 12, 'rgba(255,80,40,0.3)');
        // air, nets
        miniBar(g, A, 12, VH - 30, 160, 'AIR', S.air / DIVE_AIR, null, S.air < 15);
        Txt.draw(g, 'NETS ' + S.heads.filter(h => h.done).length + '/3', VW - 70, VH - 30, { col: '#ffffff', shadow: '#0c1830' });
        if (S.near) Txt.draw(g, 'Hold SPACE to cut', X(S.near.x), Y(S.near.y) - 46, { col: '#ffffff', align: 'center', shadow: '#0c1830' });
        if (S.msgT > 0) Txt.wrap(S.msg, VW - 40).forEach((ln, i) => Txt.draw(g, ln, VW >> 1, top + 8 + i * 12, { col: '#ffffff', align: 'center', shadow: '#0c1830' }));
    },
};

// ============================================================
// SQ-01C-02: THE FORT'S CANNON
// ============================================================
STORY_SCRIPTS.c1c_oldman = 'c1c_oldman_q';
scene('c1c_oldman_q', {
    speaker: 'Old Man',
    text: () => {
        const q = sflag('c1c_cannon');
        if (q === 'done') return `The old man turns your Ottoman coin over and over in his fingers in the shade of the wall. "Selim the Third. My grandfather would have danced." He closes his eyes. "Every boy in Marsa Tarfa dug under the wrong cannon."`;
        if (q === 'open') return `"Well?" The old man doesn't open his eyes. "The machine beeps at everything. Bottle tops, nails, the English soldiers' bullets. Listen to how it beeps, not whether."`;
        return `An old man sitting in the shade of the fort wall with his eyes half shut. "My grandfather said the Turks hid their pay chest under the cannon when the French ships came. Every boy in Marsa Tarfa has dug under that cannon." He opens one eye. "Every boy found nothing. But they were looking in the wrong place."`;
    },
    get choices() {
        const q = sflag('c1c_cannon');
        if (!q) return [{ text: '"Where\'s the right place?"', nextScene: 'c1c_oldman_q2' }, { text: 'Move on.' }];
        return [{ text: 'Move on.' }];
    },
});
scene('c1c_oldman_q2', {
    speaker: 'Old Man',
    text: `"That cannon," he nods at it, "stood on the old gun platform at the edge, looking at the sea, looking at the French. In my grandfather's time the English dragged it up to the gate, so they could have their photographs taken sitting on it." He laughs without making a sound. "The boys dig where the cannon is. The Turks dug where the cannon was."\n\nHe reaches into his robe and brings out, of all things, a yellow plastic metal detector. "My grandson's. He bought it to find the Germans' rings on the beach. He found a spoon." He holds it out. "I'm too old to dig. You're too poor not to."`,
    choices: [{ text: 'Take the detector.', onSelect: () => {
        sflag('c1c_cannon', 'open'); pocket('Metal detector');
        task('c1c_sq_cannon', '(The Fort\'s Cannon) Sweep the old gun platform on the fort\'s headland with the old man\'s detector, and dig where the Turks dug.');
        storyNote('The Fort\'s Cannon (side quest)', 'The Turks\' pay chest was buried under the cannon "when the French ships came". But the cannon has been moved: it used to stand on the old gun platform at the edge of the headland. The old man lent you his grandson\'s metal detector.');
    } }],
});
STORY_SCRIPTS.c1c_gunstone = 'c1c_gunstone';
scene('c1c_gunstone', {
    speaker: 'System',
    text: () => sflag('c1c_cannon') === 'done' ? `The old gun platform, the hole you dug in its corner filled in again. Whatever the Turks left here, you have it.`
        : hasItem('Metal detector') ? `The old gun platform: big dressed stones at the headland's edge, the iron ring where a gun's tackle was made fast. Sand and gravel has blown in between the stones over two hundred years. Somewhere under it, if the old man is right.`
            : `A platform of big dressed stones at the edge of the headland, facing the sea, an iron ring rusted to a lump. Somebody has dug a few hopeful holes round the edges, a long time ago.`,
    get choices() {
        if (sflag('c1c_cannon') === 'done' || !hasItem('Metal detector')) return [{ text: 'Move on.' }];
        return [{ text: 'Sweep it with the detector. (minigame)', onSelect: () => playMinigame('detect', { tries: 6 }, r => c1cCannonResult(r)) }, { text: 'Not now.' }];
    },
});
function c1cCannonResult(r) {
    if (r.unstarted || r.left) return;
    clockAdvance(30);
    if (r.found) {
        sflag('c1c_cannon', 'done'); taskDone('c1c_sq_cannon'); pocket('Ottoman coin hoard'); dropItem('Metal detector'); skillXP('investigation', 40);
        storyNote('The Fort\'s Cannon (side quest)', 'Done. Under the old gun platform, two feet down: a rotted leather purse of Ottoman coins, silver and a few gold, the tughra of Selim III. A Rare find. You gave the old man back his grandson\'s detector, and one coin.');
        storyNotice('A Rare find: an Ottoman coin hoard.');
        startDialogue('c1c_cannon_found');
    } else storyNotice('Holes full of nails and bottle tops. Try again: listen to how it beeps.');
}
scene('c1c_cannon_found', {
    speaker: 'System',
    text: `The spade hits something that isn't stone. You go on with your hands: a crumbling lump of leather, black with age, and through a split in it the edge of a coin, silver under the green.\n\nYou carry it round to the old man in the shade of the wall and open it in his lap. He looks at the coins for a long time without touching them. Then he takes one, a silver one with a sultan's tughra on it, and closes his hand.\n\n"For my grandfather," he says. "Take the rest, and the machine back to my grandson, and tell nobody you found it here, or every boy in Marsa Tarfa will dig up the headland."`,
    choices: [{ text: '"Nobody."' }],
});
TASK_TARGETS.c1c_sq_cannon = () => 'c1c_gunstone';

// ---- THE DETECTOR MINIGAME ----
// The platform from above, in cells. Move the coil; the needle and the tone tell you what's under
// it: small shallow junk (nails, bottle tops, cartridge cases) gives a sharp, high chirp right on
// top of it; something big and deep gives a broad, low hum that grows as you come near. Six holes.
const DET_C = 12, DET_R = 9, DET_CELL = 16;
MINIS.detect = {
    title: 'THE OLD GUN PLATFORM', keys: '◄►▲▼ move the coil    SPACE: dig here    ESC: stop',
    howto: [
        'Find what the Turks buried under the old gun platform. You can dig six holes.',
        ['◄►▲▼', 'Move the detector\'s coil over the ground.'],
        ['THE NEEDLE', 'How strong the signal is. HIGH tone: something small, near the surface (junk). LOW tone: something big, deep down.'],
        ['SPACE', 'Dig where the coil is.'],
        'Junk only beeps when you\'re right on top of it. Something big hums from further off, louder as you get closer. Find the centre of the low hum, then dig.',
    ],
    start(o) {
        const R = Math.random, hoard = { x: 3 + Math.floor(R() * 8), y: 2 + Math.floor(R() * 5), big: true }, junk = [];
        const JUNK = ['a rusted nail', 'a bottle top', 'a brass cartridge case', 'a bent spoon', 'a ring pull', 'a horseshoe nail', 'a coin from 1987'];
        while (junk.length < 8) { const j = { x: Math.floor(R() * DET_C), y: Math.floor(R() * DET_R), name: JUNK[junk.length % JUNK.length] }; if (Math.abs(j.x - hoard.x) + Math.abs(j.y - hoard.y) > 2 && !junk.some(q => q.x === j.x && q.y === j.y)) junk.push(j); }
        return { cx: 0, cy: 0, hoard, junk, holes: [], tries: o.tries || 6, sig: 0, tone: 0, msg: '', msgT: 0 };
    },
    read(S) {
        const d = Math.hypot(S.cx - S.hoard.x, S.cy - S.hoard.y), deep = Math.exp(-(d * d) / 6.5);
        let shallow = 0; for (const j of S.junk) if (!j.dug && j.x === S.cx && j.y === S.cy) shallow = 1; else if (!j.dug && Math.abs(j.x - S.cx) + Math.abs(j.y - S.cy) === 1) shallow = Math.max(shallow, 0.25);
        return shallow > deep ? { sig: shallow, tone: 1 } : { sig: deep, tone: 0 };
    },
    update(S, dt, I) {
        if (I.left && S.cx > 0) S.cx--; if (I.right && S.cx < DET_C - 1) S.cx++; if (I.up && S.cy > 0) S.cy--; if (I.down && S.cy < DET_R - 1) S.cy++;
        const rd = this.read(S); S.sig += (rd.sig - S.sig) * Math.min(1, dt * 8); S.tone = rd.tone; S.msgT -= dt;
        const period = S.tone ? 0.5 - rd.sig * 0.35 : 0.9 - rd.sig * 0.6;                       // beeps closer together the stronger it is
        S.bt = (S.bt || 0) + dt; if (rd.sig > 0.06 && S.bt > period) { S.bt = 0; Sfx.tone(S.tone ? 1400 + rd.sig * 600 : 140 + rd.sig * 120, S.tone ? 0.03 : 0.12, S.tone ? 'square' : 'sine', 0.035); }
        if (I.ok) {
            if (S.holes.some(h => h.x === S.cx && h.y === S.cy)) { S.msg = 'You\'ve dug here already.'; S.msgT = 1.2; return; }
            S.tries--; S.holes.push({ x: S.cx, y: S.cy }); Sfx.tone(200, 0.08, 'triangle', 0.05);
            if (S.cx === S.hoard.x && S.cy === S.hoard.y) { Sfx.save(); Mini.finish({ found: true }, 'Two feet down, under two hundred years of blown sand: a lump of black leather, and the edge of a silver coin.', 'THE TURKS\' PURSE'); return; }
            const j = S.junk.find(q => !q.dug && q.x === S.cx && q.y === S.cy);
            if (j) { j.dug = true; S.msg = 'You dig up ' + j.name + '.'; } else S.msg = Math.hypot(S.cx - S.hoard.x, S.cy - S.hoard.y) <= 1.5 ? 'Nothing, but the hum is strong here. Close.' : 'Nothing but sand and gravel.';
            S.msgT = 2;
            if (S.tries <= 0) { Sfx.back(); Mini.finish({ found: false }, 'Six holes, and your back has had enough. The platform will still be here.', 'NOT TODAY'); }
        }
    },
    draw(S, g, A, VW, VH) {
        const w = DET_C * DET_CELL, h = DET_R * DET_CELL, x0 = Math.max(16, Math.min((VW - w) >> 1, VW - w - 116)), y0 = 40;
        A.r(0, 26, VW, VH - 26, '#2a5a88'); A.r(x0 - 10, y0 - 10, w + 20, h + 20, '#7a6448');
        for (let y = 0; y < DET_R; y++) for (let x = 0; x < DET_C; x++) {
            const px = x0 + x * DET_CELL, py = y0 + y * DET_CELL;
            A.r(px, py, DET_CELL, DET_CELL, (x + y) % 2 ? '#c8b090' : '#c0a888');
            for (let k = 0; k < 3; k++) A.px(px + Math.floor(hash2(x * 5 + k, y) * DET_CELL), py + Math.floor(hash2(x, y * 7 + k) * DET_CELL), '#9a8468');
            if (x % 3 === 0) A.vl(px, py, DET_CELL, '#a89070');
        }
        for (const hl of S.holes) { const px = x0 + hl.x * DET_CELL, py = y0 + hl.y * DET_CELL; A.ell(px + 8, py + 8, 6, 4, '#5a4430'); A.ell(px + 8, py + 9, 4, 2, '#3a2a1c'); }
        // the coil
        const cx = x0 + S.cx * DET_CELL + 8, cy = y0 + S.cy * DET_CELL + 8;
        A.ell(cx, cy, 9, 7, '#20242c'); A.ell(cx, cy, 7, 5, '#c8b090'); A.line(cx + 6, cy - 4, cx + 22, cy - 26, '#f0c040'); A.r(cx + 18, cy - 30, 8, 6, '#f0c040');
        // the meter
        const mx = VW - 70, my = y0 + 10;
        A.r(mx - 30, my - 6, 60, 46, '#20242c'); A.ell(mx, my + 30, 26, 26, '#e8e0c8');
        A.r(mx - 30, my + 30, 60, 10, '#20242c');
        const a = Math.PI + S.sig * Math.PI; A.line(mx, my + 30, mx + Math.cos(a) * 22, my + 30 + Math.sin(a) * 22, '#d04838');
        Txt.draw(g, S.sig < 0.06 ? 'quiet' : S.tone ? 'HIGH' : 'LOW', mx, my + 44, { col: S.tone ? '#f0e080' : '#80d0f0', align: 'center', shadow: '#101838' });
        Txt.draw(g, 'HOLES LEFT ' + S.tries, x0, y0 + h + 14, { col: '#ffffff', shadow: '#101838' });
        if (S.msgT > 0) Txt.draw(g, S.msg, VW >> 1, y0 + h + 28, { col: '#ffe890', align: 'center', shadow: '#101838' });
    },
};
