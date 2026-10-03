// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE FIXER'S JOBS (poke/ch1c_jobs.js)
// Chapter 1-C, the bible's jobs (story/regions/ch01_opening_fixer.md §JOBS), and the debt:
//   - paying the debt down: the phone's BANK has a transfer to B. Nassar
//   - fishing: the island's far rocks and the north breakwater (poke/ch1c_island.js, ch1c_side2.js)
//   - DIVING SALVAGE on the Lady Haifa, a motor yacht sunk off the south point: Rana logs what you
//     bring up and the insurers pay a fifth of its value. The dive minigame, with a wreck (SALVAGE).
//     Rana offers it once you've cleared her reef. By day; a tank is 50.
//   - TRUCK-STOP LOADING: pack a lorry's trailer before the driver loses patience. Heavy at the
//     bottom, fragile on top (the LOADING minigame, new). By day, one lorry an hour.
//   - SMALL SMUGGLING RUNS for Bassem: cartons of cigarettes from the beach to the kiosk's back door
//     through the back lanes, past the police (the CARTONS minigame, new: a grid of lanes, patrols
//     with torches, doorways to hide in). Each run takes 1,000 off the debt; caught, police heat +1
//     and Bassem adds 500 for the cartons. From his gate man, until the night you cross him.
// ============================================================

// ============================================================
// THE DEBT, PAID DOWN FROM THE BANK APP
// ============================================================
(function () {
    const _rows = Phone.rows;
    Phone.rows = function () {
        const r = _rows.apply(this, arguments);
        if (this.TABS[this.tab] === 'BANK' && area() === AREAS.fixer && debt() > 0) r.splice(2, 0, ['➜ Transfer to B. Nassar', 'SPACE', 0, { scene: 'c1c_paydebt' }]);
        return r;
    };
})();
scene('c1c_paydebt', {
    speaker: 'Bank',
    text: () => `NATIONAL BANK OF EGYPT. Balance: ${money().toLocaleString('en')} EGP.\n\nOwed to B. NASSAR: ${debt().toLocaleString('en')} EGP.\n\nTransfer how much?`,
    get choices() {
        const c = [], m = money(), d = debt();
        for (const n of [500, 1000, 5000, 10000]) if (m >= n && d >= n) c.push({ text: n.toLocaleString('en') + ' EGP', onSelect: () => c1cPayDebt(n) });
        const all = Math.min(m, d); if (all > 0 && ![500, 1000, 5000, 10000].includes(all)) c.push({ text: 'Everything you can: ' + all.toLocaleString('en') + ' EGP', onSelect: () => c1cPayDebt(all) });
        c.push({ text: 'Cancel.' });
        return c;
    },
});
function c1cPayDebt(n) {
    storyPay(-n, 'Transfer to B. Nassar'); debtAdd(-n, 'Paid to B. Nassar');
    sflag('c1c_paid_total', (sflag('c1c_paid_total') || 0) + n);
    if (debt() <= 0) setTimeout(() => storyMessage('B. Nassar', 'Paid. All of it. I don\'t know whether to be proud of you or worried. Both. — B.'), 1500);
    else if (!sflag('c1c_paid_msg')) { sflag('c1c_paid_msg', true); setTimeout(() => storyMessage('B. Nassar', 'I see you paid something. Good. Only ' + debt().toLocaleString('en') + ' to go, habibi. — B.'), 1500); }
}

// ============================================================
// DIVING SALVAGE: THE LADY HAIFA
// ============================================================
const SALVAGE = [   // [name, what the insurers pay you, x along the dive, depth]
    ['Brass porthole', 300, 560, 0.74], ['Ship\'s bell', 600, 700, 0.66], ['Outboard propeller', 450, 820, 0.88], ['Dive computer', 250, 640, 0.9], ['Binoculars', 200, 760, 0.8],
];
const salvGot = () => sflag('c1c_salv') || [];
const salvLeft = () => SALVAGE.filter(s => !salvGot().includes(s[0]));
(function () {
    const prev = STORY_SCRIPTS.c1c_rana;
    STORY_SCRIPTS.c1c_rana = e => { const r = typeof prev === 'function' ? prev(e) : prev; return r === 'c1c_rana' && sflag('c1c_reef') === 'done' && salvLeft().length ? 'c1c_salvage_ask' : r; };
})();
scene('c1c_salvage_ask', {
    speaker: 'Rana Fouad',
    text: () => !sflag('c1c_salv_told')
        ? `"You haven't forgotten how to dive," Rana says, "so here's some work that pays. The Lady Haifa: a motor yacht that went down off the south point in the spring storm. A Cairo lawyer's toy." She taps a form on the counter. "The insurers pay a fifth of the value of anything brought up, and I'm the one who logs it. The bell, the brass, the electronics. Fifty for a tank. Two things a dive: it's deep, and some of it's heavy."`
        : `"The Lady Haifa's still down there with ${salvLeft().length} ${salvLeft().length === 1 ? 'thing' : 'things'} worth bringing up," Rana says. "Fifty for a tank."`,
    get choices() {
        const c = [];
        if (reefDay() && money() >= 50) c.push({ text: 'Dive the Lady Haifa. (50 EGP for the tank; about an hour)', onSelect: () => c1cSalvageGo() });
        else if (!reefDay()) c.push({ text: '"Tomorrow." (Rana only dives by day)' });
        else c.push({ text: '"I haven\'t got fifty."' });
        c.push({ text: '"Something else."', onSelect: () => setTimeout(() => startDialogue('c1c_rana'), 0) });
        return c;
    },
});
function c1cSalvageGo() {
    sflag('c1c_salv_told', true); storyPay(-50, 'A tank, Rana\'s dive shop');
    Game.fadeTo(() => { Toast.show('Off the south point, over the Lady Haifa. Rana holds the boat on the anchor line.', 4); setTimeout(() => playMinigame('salvage', { diving: skillLevel('diving'), left: salvLeft() }, r => c1cSalvageResult(r)), 400); });
}
function c1cSalvageResult(r) {
    if (r.unstarted) { storyPay(50, 'The tank, back'); return; }
    clockAdvance(60); if (Game.set.time === 5) Game.hour = storyHour();
    const got = r.got || [];
    skillXP('diving', 15 + got.length * 20, 'the Lady Haifa');
    if (!got.length) { Dlg.open('Rana Fouad', '"Nothing?" Rana coils the line. "Deep water takes air. Go straight for one thing, bring it up, go down again."'); return; }
    sflag('c1c_salv', salvGot().concat(got));
    const pay = got.reduce((a, n) => a + SALVAGE.find(s => s[0] === n)[1], 0);
    storyPay(pay, 'Salvage from the Lady Haifa (the insurers\' fifth)');
    Dlg.open('Rana Fouad', `Rana writes it all down on the insurers' form, item by item, and photographs each one on the deck: ${got.map(n => n.toLowerCase()).join(' and ')}. "${pay.toLocaleString('en')} pounds, when the lawyer's people pay. I'll front it." She counts it out from the dive-shop tin.` + (salvLeft().length ? '' : ` "And that's the Lady Haifa done. The fish can have the rest."`));
}
MINIS.salvage = Object.assign({}, MINIS.dive, {
    title: 'THE LADY HAIFA', keys: '◄►▲▼ swim    hold SPACE: work it loose    ESC: surface',
    howto: [
        'Bring up what you can from the sunk yacht, then swim back up to the boat\'s ladder.',
        ['◄►▲▼', 'Swim. Water drifts: you glide on after you let go.'],
        ['SPACE', 'Hold it beside something glinting on the wreck to work it loose. You can carry two things a dive.'],
        ['AIR', 'Runs down all the time, faster the deeper you go. Out of air and Rana hauls you up, and you drop what you\'re carrying.'],
        'Lionfish stings (it costs air). A moray lives in the yacht\'s cabin door.',
    ],
    start(o) {
        const items = (o.left || SALVAGE).map(([name, val, x, y]) => ({ name, val, x, y, cut: 0, done: false }));
        return { salvage: true, x: 70, y: 0.12, vx: 0, vy: 0, air: DIVE_AIR + (o.diving || 0) * 6, heads: [], items, bag: [], cap: 2, fire: [{ x: 430, y: 0.88, w: 40 }, { x: 900, y: 0.84, w: 46 }], moray: { x: 690, y: 0.82, lunge: 0 }, sting: 0, face: 1, bubbles: [], msg: 'Down the anchor line. The wreck is east, on the sand.', msgT: 3, freed: [] };
    },
    salvageUpdate(S, dt, keys, ay) {
        let near = null;
        if (S.bag.length < S.cap) for (const it of S.items) if (!it.done && Math.abs(S.x - it.x) < 30 && Math.abs(S.y - it.y) < 0.1) near = it;
        S.near = near;
        if (near && keys.act) {
            S.vx *= Math.pow(0.02, dt); S.vy *= Math.pow(0.02, dt);
            near.cut += dt / 1.8;
            if ((S.t * 6 | 0) !== ((S.t - dt) * 6 | 0)) Sfx.tone(300 + Math.random() * 100, 0.03, 'square', 0.02);
            if (near.cut >= 1) { near.done = true; S.bag.push(near.name); S.msg = near.name + ' comes free.' + (S.bag.length >= S.cap ? ' That\'s all you can carry: up to the ladder.' : ''); S.msgT = 3; Sfx.get(); }
        }
        if (S.bag.length) S.air -= dt * 0.15 * S.bag.length;                              // (heavy things cost breath)
        if (S.y < 0.1 && S.x < 110 && S.t > 4 && ay < 0) { Sfx.save(); Mini.finish({ got: S.bag.slice() }, S.bag.length ? 'Up the ladder with ' + S.bag.map(n => n.toLowerCase()).join(' and ') + '.' : 'Up the ladder empty-handed.', S.bag.length ? 'SALVAGE' : 'BACK UP'); return; }
        if (S.air <= 0) { Sfx.back(); Mini.finish({ got: [] }, 'The needle hits red. You let go of everything and signal, and Rana comes down for you.', 'OUT OF AIR'); }
    },
    drawWreck(S, g, A, X, Y) {
        const wx = X(520), wy = Y(0.7);                                                    // the Lady Haifa on her side on the sand
        A.poly([[wx, wy + 40], [wx + 40, wy], [wx + 360, wy + 6], [wx + 400, wy + 46], [wx + 380, wy + 64], [wx + 20, wy + 64]], '#d8dcd8');
        A.poly([[wx + 40, wy], [wx + 360, wy + 6], [wx + 356, wy + 14], [wx + 44, wy + 10]], '#f4f4f0');
        A.r(wx + 60, wy + 24, 300, 4, '#3a70c8'); A.r(wx + 120, wy - 30, 140, 32, '#c8ccc8'); A.r(wx + 130, wy - 22, 120, 10, '#2a3a4a');   // the blue stripe, the cabin and its windows
        for (let k = 0; k < 6; k++) A.ell(wx + 90 + k * 46, wy + 40, 5, 5, '#2a3a4a');
        g.globalAlpha = 0.25; A.r(wx, wy - 30, 400, 94, '#3a8a6a'); g.globalAlpha = 1;    // weed and growth
        A.r(wx + 166, wy + 30, 14, 20, '#101820');                                         // the cabin door (the moray's)
        for (const it of S.items) {
            if (it.done) continue;
            const ix = X(it.x), iy = Y(it.y), tw = (S.t * 3 + it.x) % 2 < 0.25;
            A.r(ix - 4, iy - 3, 8, 6, '#c8a040'); A.px(ix - 2, iy - 2, '#fff0a0'); if (tw) { A.px(ix + 5, iy - 6, '#ffffff'); A.px(ix + 6, iy - 7, '#ffffff'); }
            if (it.cut > 0) { A.r(ix - 14, iy - 14, 28, 4, '#102030'); A.r(ix - 13, iy - 13, Math.round(26 * it.cut), 2, '#f0f0e0'); }
        }
    },
});

// ============================================================
// TRUCK-STOP LOADING
// ============================================================
const loadDay = () => { const c = Story.s.clock; return c >= 6 * 60 && c < 20 * 60; };
(function () {   // (the café man: the truck at ten comes first, when it's due; the lorries otherwise)
    const prev = STORY_SCRIPTS.c1c_truckman;
    STORY_SCRIPTS.c1c_truckman = e => { const r = typeof prev === 'function' ? prev(e) : prev; return r === 'c1c_ts_wait' ? r : 'c1c_loadjob'; };
})();
scene('c1c_loadjob', {
    speaker: 'Café Man',
    text: () => {
        const last = sflag('c1c_load_at'), wait = last != null ? 60 - (Story.s.clock - last) : 0;
        if (!loadDay()) return `"No lorries loading now. Tea, or food, or go home." He looks at you. "Go home."`;
        if (wait > 0) return `"The next lorry is in ${Math.ceil(wait)} minutes. Sit. Tea."`;
        return `The café man jerks his chin at a lorry backed up to the loading bay, its trailer doors open, a heap of sacks and crates and boxes beside it, and a driver drinking tea and looking at his watch. "Pack it so nothing breaks and the driver pays a hundred, more if it's tight. Heavy on the bottom. Watermelons and eggs on top." He shrugs. "Last boy put a fridge on the eggs."`;
    },
    get choices() {
        const c = [], last = sflag('c1c_load_at'), ready = loadDay() && (last == null || Story.s.clock - last >= 60);
        if (ready) c.push({ text: 'Load the lorry. (minigame; about half an hour)', onSelect: () => playMinigame('loading', {}, r => c1cLoadResult(r)) });
        c.push({ text: 'Something to eat.', onSelect: () => setTimeout(() => startDialogue('c1c_truckcafe'), 0) });
        c.push({ text: 'Move on.' });
        return c;
    },
});
function c1cLoadResult(r) {
    if (r.unstarted || r.left) return;
    sflag('c1c_load_at', Story.s.clock); clockAdvance(30); if (Game.set.time === 5) Game.hour = storyHour();
    sflag('c1c_loads', (sflag('c1c_loads') || 0) + 1);
    if (r.pay > 0) storyPay(r.pay, 'Loading a lorry, the truck stop');
}
const LOAD_W = 8, LOAD_H = 5, LOAD_CELL = 20, LOAD_TIME = 50;
const LOAD_KINDS = {   // w, h, heavy, fragile, colours, name
    sack: [1, 1, true, false, ['#a8a8a0', '#86867e'], 'cement'], crate: [2, 1, false, false, ['#b08850', '#8e6a3e'], 'crate'],
    fridge: [1, 2, true, false, ['#f4f4f0', '#c8ccd0'], 'fridge'], melons: [2, 1, false, true, ['#4a9a3a', '#2e7a28'], 'melons'], eggs: [1, 1, false, true, ['#f0d890', '#d0b060'], 'eggs'],
};
MINIS.loading = {
    title: 'LOADING THE LORRY', keys: '◄► move    ▲ turn it    SPACE: drop it in    ESC: walk off',
    howto: [
        'Pack the trailer as full as you can before the driver loses patience.',
        ['◄ ►', 'Move the load along the trailer.'],
        ['▲', 'Turn it round (a crate on its end, a fridge on its side).'],
        ['SPACE', 'Drop it in. It slides down until it rests on something.'],
        'Heavy things (grey cement sacks, white fridges) crush whatever fragile thing they land on: green watermelons and yellow eggs. Heavy on the bottom, fragile on top. The fuller and the fewer breakages, the better the pay.',
    ],
    start() {
        const bag = [], kinds = ['sack', 'sack', 'crate', 'crate', 'fridge', 'melons', 'eggs', 'sack', 'crate', 'melons', 'eggs', 'fridge'];
        for (let k = 0; k < 40; k++) bag.push(kinds[Math.floor(Math.random() * kinds.length)]);
        const S = { grid: Array.from({ length: LOAD_H }, () => Array(LOAD_W).fill(null)), queue: bag, cur: null, x: 3, rot: false, time: LOAD_TIME, broken: 0, placed: 0, msg: '', msgT: 0, fx: [] };
        this.next(S); return S;
    },
    dims(S) { const K = LOAD_KINDS[S.cur]; return S.rot ? [K[1], K[0]] : [K[0], K[1]]; },
    next(S) { S.cur = S.queue.shift() || null; S.rot = false; S.x = Math.min(S.x, LOAD_W - this.dims(S)[0]); },
    restRow(S, x, w, h) {                                                                  // the lowest row (counted from the top) it can drop to
        let y = -1;
        for (let ty = 0; ty + h <= LOAD_H; ty++) { let ok = true; for (let i = 0; i < w && ok; i++) for (let j = 0; j < h && ok; j++) if (S.grid[ty + j][x + i]) ok = false; if (!ok) break; y = ty; }
        return y;
    },
    update(S, dt, I) {
        S.time -= dt; S.msgT -= dt; S.fx = S.fx.filter(f => (f.t += dt) < 0.6);
        const finish = () => {
            let filled = 0; for (const row of S.grid) for (const c of row) if (c && !c.broken) filled++;
            const full = filled === LOAD_W * LOAD_H, pay = Math.max(0, filled * 3 + (S.broken ? 0 : 30) + (full ? 50 : 0) - S.broken * 10);
            Mini.finish({ pay, filled, broken: S.broken }, (full ? 'Packed to the roof. The driver walks round the trailer twice, and tips you.' : filled + ' of ' + LOAD_W * LOAD_H + ' spaces filled.') + (S.broken ? ' ' + S.broken + ' crushed: he takes it out of your pay.' : ' Nothing broken.') + '  ' + pay + ' EGP.', full && !S.broken ? 'PERFECT LOAD' : 'LOADED');
        };
        if (!S.cur || S.time <= 0) { if (S.time <= 0) { S.msg = 'The driver slams the doors.'; } finish(); return; }
        let [w, h] = this.dims(S);
        if (I.left && S.x > 0) S.x--; if (I.right && S.x + w < LOAD_W) S.x++;
        if (I.up) { S.rot = !S.rot; [w, h] = this.dims(S); if (S.x + w > LOAD_W) S.x = LOAD_W - w; Sfx.move(); }
        if (I.ok) {
            const y = this.restRow(S, S.x, w, h);
            if (y < 0) { S.msg = 'It won\'t fit there.'; S.msgT = 1.2; Sfx.back(); return; }
            const K = LOAD_KINDS[S.cur], piece = { kind: S.cur, heavy: K[2], fragile: K[3], id: S.placed };
            for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) S.grid[y + j][S.x + i] = piece;
            if (K[2] && y + h < LOAD_H) for (let i = 0; i < w; i++) { const below = S.grid[y + h][S.x + i]; if (below && below.fragile && !below.broken) { below.broken = true; S.broken++; S.msg = 'Crunch. The ' + LOAD_KINDS[below.kind][5] + ' underneath are ruined.'; S.msgT = 1.8; Sfx.tone(110, 0.15, 'sawtooth', 0.05); S.fx.push({ x: S.x + i, y: y + h, t: 0 }); } }
            S.placed++; Sfx.tone(160, 0.05, 'triangle', 0.05);
            this.next(S);
            if (S.cur) { const [w2, h2] = this.dims(S); let any = false; for (let x = 0; x + w2 <= LOAD_W && !any; x++) if (this.restRow(S, x, w2, h2) >= 0) any = true; for (let x = 0; x + h2 <= LOAD_W && !any; x++) if (this.restRow(S, x, h2, w2) >= 0) any = true; if (!any) { finish(); return; } }
        }
    },
    draw(S, g, A, VW, VH) {
        A.r(0, 26, VW, VH - 26, '#c8b090'); A.r(0, 26, VW, 40, '#9ed2f4');                       // the sky, the gravel lot
        const w = LOAD_W * LOAD_CELL, h = LOAD_H * LOAD_CELL, x0 = (VW - w) >> 1, y0 = 96;
        A.r(x0 - 8, y0 - 8, w + 16, h + 14, '#5a6068'); A.r(x0 - 4, y0 - 4, w + 8, h + 6, '#2a2e36');   // the trailer, open at the back
        A.r(x0 - 8, y0 + h + 6, w + 16, 6, '#3a3e48'); A.ell(x0 + 14, y0 + h + 14, 8, 8, '#20242c'); A.ell(x0 + w - 14, y0 + h + 14, 8, 8, '#20242c');
        for (let y = 0; y < LOAD_H; y++) for (let x = 0; x < LOAD_W; x++) {
            const c = S.grid[y][x], px = x0 + x * LOAD_CELL, py = y0 + y * LOAD_CELL;
            if (!c) { A.r(px, py, LOAD_CELL, LOAD_CELL, (x + y) % 2 ? '#30343c' : '#2c3038'); continue; }
            const K = LOAD_KINDS[c.kind]; A.r(px, py, LOAD_CELL, LOAD_CELL, c.broken ? '#6a3020' : K[4][0]); A.r(px, py + LOAD_CELL - 3, LOAD_CELL, 3, c.broken ? '#4a2014' : K[4][1]);
            const nb = (dx, dy) => { const q = S.grid[y + dy] && S.grid[y + dy][x + dx]; return q && q.id === c.id; };    // outline each piece, not each cell
            if (!nb(0, -1)) A.r(px, py, LOAD_CELL, 1, '#1c1814'); if (!nb(-1, 0)) A.r(px, py, 1, LOAD_CELL, '#1c1814'); if (!nb(1, 0)) A.r(px + LOAD_CELL - 1, py, 1, LOAD_CELL, '#1c1814');
            if (c.kind === 'melons' && !c.broken) { A.ell(px + 10, py + 9, 6, 5, '#2e7a28'); A.line(px + 6, py + 7, px + 14, py + 11, '#8ad070'); }
            if (c.kind === 'eggs' && !c.broken) for (let k = 0; k < 4; k++) A.ell(px + 5 + (k % 2) * 9, py + 6 + (k >> 1) * 8, 3, 3, '#fff8e0');
            if (c.kind === 'sack') A.r(px + 4, py + 6, 12, 2, '#6a6a62');
            if (c.broken) { A.line(px + 3, py + 4, px + 16, py + 15, '#f0d0a0'); A.line(px + 16, py + 4, px + 3, py + 15, '#f0d0a0'); }
        }
        for (const f of S.fx) A.r(x0 + f.x * LOAD_CELL + 4 + Math.round(f.t * 20), y0 + f.y * LOAD_CELL - Math.round(f.t * 20), 3, 3, '#f0d890');
        // the load in your hands, above the trailer, and where it will land
        if (S.cur) {
            const [w1, h1] = this.dims(S), K = LOAD_KINDS[S.cur], px = x0 + S.x * LOAD_CELL, py = y0 - 8 - h1 * LOAD_CELL, ry = this.restRow(S, S.x, w1, h1);
            A.r(px, py, w1 * LOAD_CELL, h1 * LOAD_CELL, K[4][0]); A.r(px, py, w1 * LOAD_CELL, 1, '#1c1814'); A.r(px, py + h1 * LOAD_CELL - 1, w1 * LOAD_CELL, 1, '#1c1814');
            Txt.draw(g, K[5] + (K[2] ? ' (heavy)' : K[3] ? ' (fragile)' : ''), px + w1 * LOAD_CELL + 6, py + 2, { col: K[2] ? '#c8c8c0' : K[3] ? '#f0e080' : '#ffffff', shadow: '#1c1814' });
            if (ry >= 0) { g.globalAlpha = 0.35; A.r(px, y0 + ry * LOAD_CELL, w1 * LOAD_CELL, h1 * LOAD_CELL, '#ffffff'); g.globalAlpha = 1; }
            const nx = S.queue[0]; if (nx) Txt.draw(g, 'NEXT: ' + LOAD_KINDS[nx][5], x0 + w + 16, y0, { col: '#1c1814' });
        }
        miniBar(g, A, x0 - 8, y0 + h + 26, 170, 'DRIVER', S.time / LOAD_TIME, null, S.time < 12);
        Txt.draw(g, 'CRUSHED ' + S.broken, x0 + w - 60, y0 + h + 26, { col: S.broken ? '#a03020' : '#1c1814' });
        if (S.msgT > 0) Txt.draw(g, S.msg, VW >> 1, 72, { col: '#1c1814', align: 'center' });
    },
};
TASK_TARGETS.c1c_job_load = () => 'c1c_truckman';

// ============================================================
// BASSEM'S CIGARETTE RUNS
// ============================================================
const runsOpen = () => sflag('c1c_summoned') && !sflag('c1c_ship_done') && !sflag('ch1c_bassem_hunts');
(function () {
    const prev = STORY_SCRIPTS.c1c_vguard;
    STORY_SCRIPTS.c1c_vguard = e => { const r = typeof prev === 'function' ? prev(e) : prev; return r === 'c1c_vguard' && runsOpen() && sflag('c1c_offer') ? 'c1c_runs' : r; };
})();
scene('c1c_runs', {
    speaker: "Bassem's Gate Man",
    text: () => {
        const last = sflag('c1c_run_at'), wait = last != null ? 60 - (Story.s.clock - last) : 0;
        if (wait > 0) return `The gate man doesn't move. "You just did one. Let the police get bored again. ${Math.ceil(wait)} minutes."`;
        return !sflag('c1c_runs_told')
            ? `The gate man looks you up and down. "Mr. Bassem says: while you wait for tonight, you can work. Small jobs." He nods towards the beach. "A boat leaves cartons of cigarettes under the parasols. You carry them through the back lanes to the kiosk's back door. A thousand off what you owe, every bag."\n\n"The police walk the lanes with torches. They don't like cartons." He shrugs. "If they catch you, the cartons are gone, and Mr. Bassem adds them to your bill."`
            : `"Another bag?" The gate man jerks his chin at the beach. "A thousand off. Don't get caught."`;
    },
    get choices() {
        const last = sflag('c1c_run_at'), ready = last == null || Story.s.clock - last >= 60, c = [];
        if (ready) c.push({ text: 'Carry a bag. (minigame; about forty minutes)', onSelect: () => { sflag('c1c_runs_told', true); playMinigame('cartons', { heat: Story.s.heat || 1 }, r => c1cRunResult(r)); } });
        c.push({ text: ready ? '"Not now."' : 'Move on.' });
        return c;
    },
});
function c1cRunResult(r) {
    if (r.unstarted || r.left) return;
    sflag('c1c_run_at', Story.s.clock); clockAdvance(40); if (Game.set.time === 5) Game.hour = storyHour();
    if (r.made) { sflag('c1c_runs_n', (sflag('c1c_runs_n') || 0) + 1); debtAdd(-1000, 'A bag of cartons, delivered'); skillXP('stealth', 25, 'the back lanes'); }
    else if (r.caught) {
        Story.s.heat = (Story.s.heat || 1) + 1; debtAdd(500, 'Bassem\'s cartons, lost to the police'); sflag('c1c_runs_caught', (sflag('c1c_runs_caught') || 0) + 1);
        Toast.show('Police heat ' + Story.s.heat + '.', 4);
        setTimeout(() => storyMessage('B. Nassar', 'The police have my cartons and your face. 500 on the bill. Be less stupid, habibi. — B.'), 1500);
    }
}
// ---- THE CARTONS MINIGAME ----
// The back lanes from above, in cells. Move a cell at a time from the beach (left) to the kiosk's back
// door (right). Police walk their beats with torches: the lit cells ahead of each one. Step into the
// light, or be standing in it when it swings onto you, and a meter fills; full, and you're caught.
// Doorways (dark) hide you completely. Heat makes more police.
const CARTON_MAPS = [
    { rows: [
        '################',
        '#S....#....D...#',
        '#.##..#.##.###.#',
        '#.#D.......#...#',
        '#.#.####.#.#.###',
        '#...#..D.#.....#',
        '###.#.##.#####.#',
        '#D.....#......G#',
        '################'], pats: [[[4, 3], [10, 3]], [[14, 1], [14, 3]], [[1, 7], [6, 7]], [[10, 5], [14, 5]]] },
    { rows: [
        '################',
        '#S.....D.......#',
        '#.###.####.###.#',
        '#...#....#...#.#',
        '###.#.##.###.#.#',
        '#D....#........#',
        '#.###.#.######.#',
        '#.....D....D..G#',
        '################'], pats: [[[6, 1], [13, 1]], [[1, 5], [5, 5]], [[7, 5], [14, 5]], [[1, 7], [9, 7]]] },
];
MINIS.cartons = {
    title: 'THE BACK LANES', keys: '◄►▲▼ one step    stand still to wait    ESC: drop the bag and walk',
    howto: [
        'Carry the bag of cartons from the beach (left) to the kiosk\'s back door (right) without being caught.',
        ['◄►▲▼', 'One step at a time. Standing still is fine: the police keep walking.'],
        ['TORCHES', 'Each policeman lights the cells ahead of him. In the light, a "!" meter fills; when it\'s full, you\'re caught.'],
        ['DOORWAYS', 'The dark doorways hide you completely, even in the light. Wait in one for a torch to pass.'],
        'The more the police already know your face (heat), the more of them are out.',
    ],
    start(o) {
        const M = CARTON_MAPS[Math.floor(Math.random() * CARTON_MAPS.length)], grid = M.rows.map(r => r.split(''));
        let sx = 1, sy = 1; grid.forEach((r, y) => r.forEach((c, x) => { if (c === 'S') { sx = x; sy = y; } }));
        const n = Math.min(M.pats.length, 2 + Math.max(0, (o.heat || 1) - 1));
        const cops = M.pats.slice(0, n).map(([a, b], i) => ({ a, b, x: a[0], y: a[1], dir: 1, face: [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])], wait: i * 0.3, step: 0.62 + i * 0.07 }));
        return { grid, px: sx, py: sy, cops, sus: 0, lit: new Set(), msg: '', msgT: 0, moves: 0 };
    },
    cell(S, x, y) { return (S.grid[y] || [])[x] || '#'; },
    light(S) {
        const L = new Set();
        for (const c of S.cops) { let x = c.x, y = c.y; L.add(x + ',' + y); for (let k = 0; k < 3; k++) { x += c.face[0]; y += c.face[1]; if (this.cell(S, x, y) === '#') break; L.add(x + ',' + y); } }
        return L;
    },
    update(S, dt, I) {
        S.msgT -= dt;
        // the police walk their beats
        for (const c of S.cops) {
            c.wait -= dt; if (c.wait > 0) continue; c.wait = c.step;
            const tgt = c.dir > 0 ? c.b : c.a;
            if (c.x === tgt[0] && c.y === tgt[1]) { c.dir = -c.dir; c.face = [-c.face[0], -c.face[1]]; c.wait = 1.1; continue; }   // (a pause at each end, turning round)
            c.x += Math.sign(tgt[0] - c.x); c.y += Math.sign(tgt[1] - c.y);
        }
        // you
        const d = I.left ? [-1, 0] : I.right ? [1, 0] : I.up ? [0, -1] : I.down ? [0, 1] : null;
        if (d) { const nx = S.px + d[0], ny = S.py + d[1]; if (this.cell(S, nx, ny) !== '#') { S.px = nx; S.py = ny; S.moves++; Sfx.tone(240, 0.02, 'triangle', 0.02); } }
        for (const c of S.cops) if (c.x === S.px && c.y === S.py && this.cell(S, S.px, S.py) !== 'D') { S.sus = 1; }
        S.lit = this.light(S);
        const seen = S.lit.has(S.px + ',' + S.py) && this.cell(S, S.px, S.py) !== 'D';
        S.sus = seen ? S.sus + dt * 2.2 : Math.max(0, S.sus - dt * 0.8);
        if (seen && S.sus < 0.15) { S.msg = 'A torch!'; S.msgT = 0.8; }
        if (S.sus >= 1) { Sfx.tone(1200, 0.3, 'square', 0.05); Mini.finish({ caught: true }, '"You! Stop! What\'s in the bag?" A hand on your collar, and the cartons spilling out onto the lane.', 'CAUGHT'); return; }
        if (this.cell(S, S.px, S.py) === 'G') { Sfx.save(); Mini.finish({ made: true }, 'The kiosk\'s back door opens a crack, a hand takes the bag, and the door closes. Nobody says anything. A thousand off.', 'DELIVERED'); }
    },
    draw(S, g, A, VW, VH) {
        const C = 22, W = S.grid[0].length, H = S.grid.length, x0 = (VW - W * C) >> 1, y0 = 34;
        A.r(0, 26, VW, VH - 26, '#141a2c');
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
            const c = S.grid[y][x], px = x0 + x * C, py = y0 + y * C;
            if (c === '#') { A.r(px, py, C, C, '#e8e0cc'); A.r(px, py, C, 3, '#fffaf0'); A.r(px, py + C - 4, C, 4, '#b8ae98'); continue; }   // whitewashed walls
            A.r(px, py, C, C, '#5a5244'); if ((x * 7 + y * 3) % 5 === 0) A.px(px + 6, py + 9, '#4a4236');
            if (c === 'D') { A.r(px + 3, py + 2, C - 6, C - 4, '#1a1410'); A.r(px + 3, py + 2, C - 6, 2, '#3a2e22'); }
            if (c === 'S') { A.r(px + 2, py + 2, C - 4, C - 4, '#c8b890'); Txt.draw(g, 'BEACH', px - 2, py - 12, { col: '#3a3020' }); }
            if (c === 'G') { A.r(px + 4, py + 2, C - 8, C - 4, '#3a70c8'); A.r(px + 6, py + 4, C - 12, 3, '#f0c040'); Txt.draw(g, 'KIOSK', px - 6, py - 11, { col: '#f0e8d0' }); }
            if (S.lit.has(x + ',' + y)) { g.globalAlpha = 0.38; A.r(px, py, C, C, '#ffe060'); g.globalAlpha = 1; }
        }
        for (const c of S.cops) {
            const px = x0 + c.x * C + C / 2, py = y0 + c.y * C + C / 2;
            A.ell(px, py, 7, 7, '#1a2a4a'); A.ell(px, py - 1, 5, 5, '#2a3a6a'); A.r(px - 4, py - 6, 8, 3, '#f8f8f4');    // a policeman in his white cap
            A.r(px + c.face[0] * 6 - 1, py + c.face[1] * 6 - 1, 3, 3, '#ffe060');
        }
        const yx = x0 + S.px * C + C / 2, yy = y0 + S.py * C + C / 2;
        A.ell(yx, yy, 6, 6, '#c8a878'); A.ell(yx, yy - 1, 4, 4, '#e8c898'); A.r(yx + 3, yy + 1, 6, 5, '#3a70c8');            // you, and the bag
        if (S.sus > 0.02) { A.r(yx - 11, yy - 18, 22, 5, '#1c1814'); A.r(yx - 10, yy - 17, Math.round(20 * Math.min(1, S.sus)), 3, S.sus > 0.6 ? '#f04030' : '#f0c040'); Txt.draw(g, '!', yx, yy - 30, { col: '#ffe060', shadow: '#1c1814', align: 'center' }); }
        if (S.msgT > 0) Txt.draw(g, S.msg, VW >> 1, y0 + H * C + 6, { col: '#ffe890', align: 'center' });
    },
};
