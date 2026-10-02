// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-C, BEAT 3: PREP THE JOB (poke/ch1c_prep.js)
// story/regions/ch01_opening_fixer.md, beat 3, the player's choice of how:
//   - DIESEL for Zaki's dhow: pay the fuel man by day (the HAGGLING minigame),
//     or after dark pick the fuel store's padlock (the LOCKPICKING minigame)
//     while the night watchman walks his round (his view cone; the minigame
//     lasts only as long as his back is turned), or pay him to look away.
//   - A ROUTE past the coast guard: buy the patrol times from the fisherman
//     (haggling; his wife's cousin is on the patrol boat: the bible's
//     SQ-01C-04 giver), or watch the patrol boat from the fort's wall at
//     dusk (the SCOUTING minigame: mark the times it passes the marks).
//   - A DIVING KIT from Rana, "with a look".
// Nobody new is named: the fuel man and the night watchman are nameless.
// ============================================================

Object.assign(LOOKS, {
    c1c_fuelman: { skinCol: SKINS[6], top: ['#5a7a9a', '#46607c', '#324660'], topKind: 'shirt', legs: ['#3a3e48', '#2a2e36', '#1c1e24'], head: 'cap', headCol: ['#d04838', '#a83828', '#802818'], face: 'stubble', wide: true, shoe: '#1c1814' },
    c1c_watchman: { skinCol: SKINS[7], robe: ['#6a5040', '#503c30', '#3a2a20'], head: 'skullcap', headCol: ['#e8e0c8', '#c8c0a8', '#a8a088'], face: 'tache', tache: '#e0e0d8', shoeKind: 'sandals', shoe: '#3a2a20' },
});
Object.assign(ITEM_INFO, {
    'Diving kit': { key: 1, desc: 'Rana\'s spare kit in a mesh bag: mask, fins, a jacket, a regulator and a pony bottle, "enough to get you from the bottom to the top, and to here." Her initials on every piece in nail varnish. She wants it back. She said so twice.' },
});
const PREP = { fuel: 'c1c_fuel', route: 'c1c_route', kit: 'c1c_kit' };
const prepDone = k => !!sflag(PREP[k]);
const dusk1C = () => { const c = Story.s.clock; return c >= 18 * 60 || c < 6 * 60; };
const hourNow = () => { if (Game.set.time === 5) Game.hour = storyHour(); };

// ============================================================
// THE HAGGLING MINIGAME
// opts: { who, look, item, ask, floor, step, max (what you can pay), patience, lines }
// ◄► your price, ▲▼ OFFER / WALK AWAY, SPACE. He counters, loses patience, and if you
// walk away while he's still above his last price, he calls you back, once.
// → { deal, price } · { deal: false } · { left }
// ============================================================
const HAGGLE_LINES = {
    counter: [c => `"${c}. My children have to eat."`, c => `"${c}, and I'm losing money on it."`, c => `"You want me to give it away? ${c}."`, c => `"${c}. Only for you. Don't tell anyone."`, c => `"${c}. By God, that's what I paid."`],
    insult: [`"Are you trying to rob me? In front of everyone?"`, `"For that you can have the smell of it."`],
    last: c => `"${c}. That's my last price. I swear it on my mother."`,
    back: c => `"Wait! Wait. Come back. For you, ${c}. Only because I like your face."`,
    gone: `"Go, then. Go with God."`, angry: `"Enough! Go and buy it from Bassem!"`, deal: `"Fine! Fine. You're killing me. Shake."`,
};
MINIS.haggle = {
    title: 'HAGGLING', keys: '◄► your price    ▲▼ offer / walk away    SPACE: do it    ESC: leave',
    howto: [
        'Haggle a price down.',
        ['◄ ►', 'Set the price you\'ll offer.'],
        ['▲ ▼', 'Choose OFFER or WALK AWAY.'],
        ['SPACE', 'Do it. He counters with a new price.'],
        'Offer too low and he loses patience; run out and he won\'t deal. Walk away while he\'s still above his lowest price and he\'ll call you back, once.',
    ],
    start(o) {
        const step = o.step || 10, sk = skillLevel('haggling'), rs = v => Math.round(v / step) * step;
        return { o, step, sk, rs, ask: o.ask, floor: o.floor, counter: o.ask, offer: Math.min(o.max != null ? rs(o.max) : 1e9, rs(o.ask * 0.35)), pat: o.patience || 4, walked: false, sel: 0, rep: 0, line: (o.lines && o.lines.open) || `"${o.ask}. A fair price."`, mood: 0, n: 0, endIn: 0, end: null };
    },
    update(S, dt, I, keys) {
        if (S.end) { S.endIn -= dt; if (S.endIn <= 0) Mini.finish(S.end.r, S.end.line, S.end.big); return; }
        const dir = keys.left ? -1 : keys.right ? 1 : 0, hi = S.o.max != null ? Math.max(S.step, S.rs(Math.min(S.o.max, S.counter))) : S.counter;
        if (I.left || I.right) { S.rep = 0.32; S.offer += (I.left ? -1 : 1) * S.step; Sfx.move(); }
        else if (dir) { S.rep -= dt; if (S.rep <= 0) { S.rep = 0.06; S.offer += dir * S.step; } }
        S.offer = Math.max(S.step, Math.min(hi, S.offer));
        if (I.up || I.down) { S.sel = 1 - S.sel; Sfx.move(); }
        if (I.ok) { if (S.sel === 0) this.offer(S); else this.walk(S); }
        S.mood = Math.max(0, S.mood - dt);
    },
    say(S, line, mood) { S.line = line; S.mood = mood || 0.8; S.n++; },
    over(S, r, line, big) { S.end = { r, line: line || '', big }; S.endIn = 1.2; S.line = line || S.line; },
    deal(S, price) {
        const L = S.o.lines || {}; this.say(S, L.deal || HAGGLE_LINES.deal); Sfx.get();
        skillXP('haggling', Math.max(4, Math.round((S.ask - price) / S.ask * 40)), 'a good price');
        this.over(S, { deal: true, price }, (L.deal || HAGGLE_LINES.deal) + `\n\n${price} pounds, and he spits on his palm before he shakes on it.`, 'DEAL · ' + price + ' EGP');
    },
    offer(S) {
        const o = S.offer, L = S.o.lines || {};
        if (o >= S.counter) return this.deal(S, S.counter);
        if (o < S.floor * 0.55) { S.pat -= 2; this.say(S, HAGGLE_LINES.insult[S.n % 2], 1); Sfx.tone(150, 0.12, 'square', 0.05); }
        else {
            S.pat -= 1;
            if (o >= S.floor && S.counter - o <= Math.max(S.step, (S.counter - S.floor) * 0.3)) return this.deal(S, o);
            const nc = Math.max(S.floor, S.rs(S.counter - (S.counter - o) * (0.3 + 0.05 * S.sk)));
            if (nc >= S.counter) this.say(S, HAGGLE_LINES.last(S.counter));
            else { S.counter = nc; this.say(S, (L.counter || HAGGLE_LINES.counter)[S.n % (L.counter || HAGGLE_LINES.counter).length](nc)); }
            Sfx.tone(440, 0.06, 'triangle', 0.05);
        }
        if (S.pat <= 0) { this.say(S, L.angry || HAGGLE_LINES.angry, 1); this.over(S, { deal: false }, (L.angry || HAGGLE_LINES.angry) + ' He turns his back on you. No deal.', 'NO DEAL'); }
    },
    walk(S) {
        if (S.walked || S.counter <= S.floor) { this.say(S, HAGGLE_LINES.gone); this.over(S, { deal: false }, HAGGLE_LINES.gone + ' He means it. That was as low as he goes.', 'NO DEAL'); return; }
        S.walked = true; S.counter = Math.max(S.floor, S.rs((S.counter + S.floor) / 2)); S.pat = Math.max(2, S.pat);
        this.say(S, HAGGLE_LINES.back(S.counter)); Sfx.tone(660, 0.08, 'triangle', 0.05); S.sel = 0;
    },
    draw(S, g, A, VW, VH) {
        const sheet = S.sheet || (S.sheet = personSheet(LOOKS[S.o.look])), f = sheet.frames[0][0], px = (VW >> 1) - 150, py = 46;
        A.r(px - 6, py - 6, 108, 108, '#1c2442'); A.r(px - 4, py - 4, 104, 104, S.mood > 0.4 ? '#4a3040' : '#2a3456');
        bigSprite(g, f, px, py - 4 + (S.mood > 0.6 ? (S.t * 30 | 0) % 2 : 0), 3);
        Txt.draw(g, S.o.who.toUpperCase(), px + 48, py + 104, { col: '#ffe890', align: 'center' });
        // his patience: glasses of tea, drained one by one
        for (let i = 0; i < (S.o.patience || 4); i++) { const gx = px + 12 + i * 20, gy = py + 120, full = i < S.pat; A.r(gx, gy, 10, 13, '#c8d8e0'); A.r(gx + 1, gy + (full ? 3 : 10), 8, full ? 9 : 2, full ? '#b8501c' : '#5a3a20'); A.hl(gx, gy, 10, '#ffffff'); }
        Txt.draw(g, 'PATIENCE', px + 48, py + 138, { col: '#8898d0', align: 'center' });
        // the prices
        const bx = px + 120, bw = 200;
        frame(g, bx, py - 6, bw, 128);
        Txt.draw(g, S.o.item, bx + 12, py + 2, { col: UI.ink });
        Txt.draw(g, 'HE ASKS', bx + 12, py + 22, { col: '#6a6a78' }); Txt.draw(g, S.counter + ' EGP', bx + bw - 12, py + 22, { col: '#a83828', align: 'right' });
        Txt.draw(g, 'YOU OFFER', bx + 12, py + 40, { col: '#6a6a78' });
        const ot = S.offer + ' EGP', ow = Txt.width(ot), ox = bx + bw - 12 - ow;
        Txt.draw(g, ot, bx + bw - 12, py + 40, { col: '#2e6a3e', align: 'right' });
        A.poly([[ox - 10, py + 44], [ox - 5, py + 40], [ox - 5, py + 48]], '#d04838'); A.poly([[bx + bw - 6, py + 40], [bx + bw - 1, py + 44], [bx + bw - 6, py + 48]], '#d04838');
        if (S.o.max != null) Txt.draw(g, 'In your pocket: ' + S.o.max, bx + 12, py + 58, { col: '#6a6a78' });
        ['OFFER', 'WALK AWAY'].forEach((t, i) => { const yy = py + 78 + i * 16, on = S.sel === i; if (on) A.poly([[bx + 12, yy + 2], [bx + 12, yy + 10], [bx + 17, yy + 6]], '#d04838'); Txt.draw(g, t + (i === 1 && S.walked ? '  (he won\'t call you back twice)' : ''), bx + 22, yy, { col: on ? UI.ink : '#6a6a78' }); });
        // what he says
        const w = Math.min(VW - 24, 420), x = (VW - w) >> 1, lines = Txt.wrap(S.line, w - 24), y = py + 150;
        frame(g, x, y, w, 16 + lines.length * 12); lines.forEach((ln, i) => Txt.draw(g, ln, x + 12, y + 8 + i * 12, { col: UI.ink }));
        if (!S.end && S.sk >= 3 && S.counter - S.floor <= S.step * 2) Txt.draw(g, 'He\'s sweating. That\'s close to his last price.', VW >> 1, y + 22 + lines.length * 12, { col: '#ffe890', align: 'center' });
    },
};

// ============================================================
// THE LOCKPICKING MINIGAME
// opts: { pins, time (until the watchman comes back round), what }
// ◄► choose a pin, hold SPACE to lift it, let go when the gap is on the shear line (gold).
// Only the binding pin will set; the others spring back (Lockpicking 2+: you feel which one
// binds). Lift too far and it oversets, with a clank.  → { opened } · { caught } · { left }
// ============================================================
MINIS.lockpick = {
    title: 'LOCKPICKING', keys: '◄► pin    hold SPACE: lift    let go on the gold    ESC: leave',
    howto: [
        'Pick the lock before the watchman comes back round.',
        ['◄ ►', 'Choose a pin.'],
        ['HOLD', 'SPACE to lift the pin. Let go when the gap is on the gold line and it sets.'],
        'Only one pin binds at a time; the others spring back down. Lift too far and it oversets with a clank. Set them all and the lock opens.',
    ],
    start(o) {
        const n = o.pins || 4, R = rng('lock' + Math.floor(Story.s.clock) + n), sk = skillLevel('lockpicking');
        const pins = []; for (let i = 0; i < n; i++) pins.push({ key: 10 + Math.floor(R() * 16), p: 0, set: false, speed: 34 + R() * 30, flash: 0 });
        const order = pins.map((q, i) => i).sort(() => R() - 0.5);
        return { pins, order, sel: 0, sk, band: 4 + sk * 1.5, time: o.time || 30, t0: o.time || 30, noise: 0, msg: '', msgT: 0, fin: false };
    },
    binding(S) { return S.order.find(i => !S.pins[i].set); },
    update(S, dt, I, keys, pressed, released) {
        if (S.fin) return;
        S.time -= dt; S.msgT -= dt;
        if (S.time <= 0) { Sfx.tone(120, 0.3, 'square', 0.06); Mini.finish({ caught: true }, 'Footsteps on the concrete, and then a torch, right in your face.', 'CAUGHT'); S.fin = true; return; }
        if (I.left || I.right) { S.sel = (S.sel + (I.left ? S.pins.length - 1 : 1)) % S.pins.length; Sfx.move(); }
        const P = S.pins[S.sel], SH = 46;                                         // the shear line, in px above the plug's floor
        for (const q of S.pins) { q.flash = Math.max(0, q.flash - dt); if (!q.set && q !== P) q.p = Math.max(0, q.p - 90 * dt); }
        if (P.set) return;
        if (keys.act) {
            P.p += P.speed * dt;
            if (P.key + P.p > SH + S.band + 9) { P.p = 0; S.noise++; S.time -= 1.5; S.msg = 'Too far: it oversets with a clank.'; S.msgT = 1.6; Sfx.tone(180, 0.1, 'square', 0.06); }
        } else if (released) {
            const gap = P.key + P.p;
            if (Math.abs(gap - SH) <= S.band) {
                if (this.binding(S) === S.sel) { P.set = true; P.flash = 0.5; Sfx.tone(1200, 0.04, 'square', 0.05); S.msg = 'Click.'; S.msgT = 0.8; }
                else { S.msg = 'It springs back: that one isn\'t binding yet.'; S.msgT = 1.4; Sfx.tone(300, 0.05, 'triangle', 0.04); }
            }
        } else P.p = Math.max(0, P.p - 90 * dt);
        if (S.pins.every(q => q.set)) { S.fin = true; skillXP('lockpicking', 30, 'a padlock'); Sfx.get(); Mini.finish({ opened: true, noise: S.noise }, 'The shackle jumps with a soft clack. The padlock hangs open in your hand.', 'OPEN'); }
    },
    draw(S, g, A, VW, VH) {
        const n = S.pins.length, pw = 22, w = n * pw + 60, x0 = (VW - w) >> 1, y0 = 54, floor = y0 + 150, SH = 46, BIND = this.binding(S);
        // the padlock's brass body, cut away to show the pins
        A.r(x0 - 10, y0 - 34, w + 20, 214, '#5a4418'); A.r(x0 - 8, y0 - 32, w + 16, 210, '#c89020'); A.r(x0 - 8, y0 - 32, w + 16, 4, '#f0c040');
        A.r(x0 + 20, y0 - 70, 16, 40, '#9aa4ac'); A.r(x0 + w - 36, y0 - 70, 16, 40, '#9aa4ac'); A.r(x0 + 20, y0 - 80, w - 40, 16, '#9aa4ac'); A.r(x0 + 36, y0 - 64, w - 72, 34, '#101838');   // the shackle
        A.r(x0, y0, w, 160, '#2a2018'); A.r(x0, floor - 8, w, 18, '#e0b040'); A.hl(x0, floor - 8, w, '#ffe080');   // the plug
        A.r(x0, floor - SH - 1, w, 2, '#f0c040'); Txt.draw(g, 'SHEAR LINE', x0 + w + 14, floor - SH - 5, { col: '#f0c040' });
        S.pins.forEach((q, i) => {
            const cx = x0 + 30 + i * pw, gap = floor - (q.key + q.p);
            A.r(cx - 5, y0, 10, floor - y0 - 8, '#3a3028');                                                   // the pin's channel
            for (let yy = y0 + 2; yy < gap - 34; yy += 4) A.hl(cx - 3, yy, 7, '#9aa4ac');                     // the spring
            A.r(cx - 4, gap - 32, 9, 30, '#c8ccd0'); A.vl(cx - 4, gap - 32, 30, '#ffffff');                   // the driver pin
            A.r(cx - 4, gap + 1, 9, floor - gap - 9, '#e0b040'); A.vl(cx - 4, gap + 1, floor - gap - 9, '#ffe080'); A.poly([[cx - 4, floor - 8], [cx + 4, floor - 8], [cx, floor - 3]], '#e0b040');   // the key pin
            if (q.set) { A.r(cx - 5, gap - 1, 11, 2, '#60e080'); }
            if (q.flash > 0) A.r(cx - 6, gap - 2, 13, 4, '#ffffff');
            if (!q.set && i === BIND && S.sk >= 2 && (S.t * 3 | 0) % 2 === 0) A.r(cx - 6, y0 + 2, 13, 2, '#ffe890');   // the one that binds: you feel it
        });
        // the pick, and the tension wrench
        const sx = x0 + 30 + S.sel * pw; A.line(x0 - 60, floor + 2, sx, floor - 2, '#dfe6ea'); A.line(x0 - 60, floor + 3, sx, floor - 1, '#86949e'); A.r(sx - 1, floor - 6, 3, 4, '#dfe6ea');
        A.r(x0 - 60, floor + 10, 64, 3, '#86949e');
        // the time: his footsteps coming back round
        const bw = 200, bx = (VW - bw) >> 1, by = 18, f = Math.max(0, S.time / S.t0);
        Txt.draw(g, S.time < 6 ? 'FOOTSTEPS!' : 'HIS BACK IS TURNED', VW >> 1, by - 12 + 30, { col: S.time < 6 ? '#ff6050' : '#c8d0f0', align: 'center' });
        A.r(bx - 1, by + 32, bw + 2, 7, '#1c1814'); A.r(bx, by + 33, Math.round(bw * f), 5, f < 0.25 ? '#f04030' : '#60c060');
        if (S.msgT > 0) Txt.draw(g, S.msg, VW >> 1, floor + 26, { col: '#ffe890', align: 'center' });
    },
};

// ============================================================
// THE SCOUTING MINIGAME: the patrol boat from the fort's wall at dusk
// The boat goes out of the harbour mouth, north up the reef to the buoy line, back south
// outside the reef and in again. Press SPACE as its lights pass each mark, in order, to
// note the time.  → { marks (0–4) } · { left }
// ============================================================
const SCOUT_PATH = [[0.30, 0.84], [0.40, 0.66], [0.52, 0.46], [0.66, 0.30], [0.80, 0.16], [0.90, 0.24], [0.88, 0.44], [0.76, 0.66], [0.56, 0.86], [0.36, 0.90], [0.30, 0.84]];
const SCOUT_MARKS = [['THE HARBOUR MOUTH', 0.06, 'out'], ['THE NORTH REEF', 0.26, 'north reef'], ['THE BUOY LINE', 0.44, 'buoy line, turns'], ['THE HARBOUR MOUTH', 0.97, 'back in']];
const SCOUT_T0 = 18 * 60 + 30, SCOUT_LEN = 70;                                // out at half past six, in by twenty to eight
function scoutAt(u) {                                                            // a point along the path, 0..1 by length
    const P = SCOUT_PATH, L = []; let tot = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(d); tot += d; }
    let d = Math.max(0, Math.min(1, u)) * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i]) { const k = d / L[i]; return [P[i][0] + (P[i + 1][0] - P[i][0]) * k, P[i][1] + (P[i + 1][1] - P[i][1]) * k, Math.atan2(P[i + 1][1] - P[i][1], P[i + 1][0] - P[i][0])]; } d -= L[i]; }
    return [P[P.length - 1][0], P[P.length - 1][1], 0];
}
MINIS.scout = {
    title: 'THE PATROL BOAT', keys: 'SPACE as its lights pass the next mark    ESC: climb down',
    howto: [
        'Watch the patrol boat\'s round from the fort wall and note the times.',
        ['SPACE', 'Press as its lights pass the next mark: the harbour mouth, the north reef, the buoy line, and the harbour mouth again.'],
        'Too early does nothing: wait for the lights to reach the mark. Too late and that mark is missed. Get all four for exact times.',
    ],
    start(o) { const u0 = o.u0 || 0; return { u: u0, u0, dur: 34, noted: SCOUT_MARKS.map((m, i) => m[1] < u0 - 0.02 ? 'missed' : null), next: SCOUT_MARKS.findIndex(m => m[1] >= u0 - 0.02), flash: 0, msg: '', msgT: 0, fin: false }; },
    clock(S) { return SCOUT_T0 + Math.round(S.u * SCOUT_LEN); },
    update(S, dt, I) {
        if (S.fin) return;
        S.u += dt / S.dur; S.msgT -= dt; S.flash = Math.max(0, S.flash - dt);
        while (S.next >= 0 && S.next < SCOUT_MARKS.length && S.u > SCOUT_MARKS[S.next][1] + 0.06) { S.noted[S.next] = 'missed'; S.next++; S.msg = 'Gone past. You missed that one.'; S.msgT = 1.4; }
        if (I.ok) {
            const m = SCOUT_MARKS[S.next];
            if (m && Math.abs(S.u - m[1]) <= 0.05) { S.noted[S.next] = clockStr(this.clock(S)); S.next++; S.flash = 0.5; Sfx.tone(990, 0.06, 'triangle', 0.05); S.msg = 'Noted.'; S.msgT = 0.8; }
            else { S.msg = m ? 'Not yet: watch the lights, wait for them to reach the mark.' : ''; S.msgT = 1.2; Sfx.tone(220, 0.05, 'triangle', 0.03); }
        }
        if (S.u >= 1.04) { S.fin = true; const marks = S.noted.filter(v => v && v !== 'missed').length; skillXP('stealth', marks * 8, 'watching the patrol'); Mini.finish({ marks }, marks >= 3 ? 'The patrol boat ties up at the coast guard post with its lights still on and the crew go in to eat. You have their whole run in your notebook.' : marks >= 2 ? 'Enough to go on, just: out, north to the buoys, back in. The times are rough.' : 'Dark, and the lights went everywhere. You lost them over the reef.', marks + ' OF 4 TIMES'); }
    },
    draw(S, g, A, VW, VH) {
        const w = Math.min(VW - 30, 440), h = Math.min(VH - 60, 250), x0 = (VW - w) >> 1, y0 = 30, k = Math.min(1, S.u);
        const sky = k < 0.35 ? ['#f0a060', '#d06850'] : k < 0.7 ? ['#8a5a8a', '#5a3a6a'] : ['#2a2a5a', '#1c1c40'];
        A.r(x0, y0, w, 22, sky[0]); A.r(x0, y0 + 22, w, 10, sky[1]);                                              // the sky over the sea
        const sea = k < 0.5 ? '#2a5a8a' : '#1a3a64'; A.r(x0, y0 + 32, w, h - 32, sea);
        const P = (fx, fy) => [x0 + fx * w, y0 + 32 + fy * (h - 32)];
        // the coast on the left: the town's lights, the quays, the coast guard post
        A.poly([P(0, 0), P(0.24, 0), P(0.2, 0.3), P(0.26, 0.6), P(0.22, 1), P(0, 1)].map(([a, b]) => [Math.round(a), Math.round(b)]), k < 0.5 ? '#c8a878' : '#5a4a3a');
        for (let i = 0; i < 14; i++) { const [lx, ly] = P(0.02 + hash2(i, 3) * 0.16, 0.1 + hash2(3, i) * 0.85); A.px(lx, ly, k > 0.3 ? '#ffe890' : '#e8dcc0'); }
        // the reef: paler water in a long band
        const reef = []; for (let j = 0; j <= 12; j++) reef.push(P(0.58 + Math.sin(j * 0.9) * 0.025, 0.04 + j * 0.055)); for (let j = 12; j >= 0; j--) reef.push(P(0.69 + Math.cos(j * 0.8) * 0.025, 0.04 + j * 0.055));
        A.poly(reef.map(([a, b]) => [Math.round(a), Math.round(b)]), k < 0.5 ? '#3a8ab0' : '#2a5a84');
        for (let i = 0; i < 16; i++) { const [cx, cy] = P(0.6 + hash2(i, 9) * 0.07, 0.07 + hash2(9, i) * 0.6); A.r(cx, cy, 2, 2, k < 0.5 ? '#5aa8c8' : '#34688e'); }
        // the buoy line, blinking red
        for (let i = 0; i < 4; i++) { const [bx, by] = P(0.74 + i * 0.05, 0.12 + i * 0.02); A.r(bx - 1, by - 1, 3, 3, (S.t * 2 | 0) % 2 ? '#ff4030' : '#802018'); }
        // the marks
        SCOUT_MARKS.forEach((m, i) => { const [mx, my] = scoutAt(m[1]), [px, py] = P(mx, my), on = i === S.next, st = S.noted[i]; if (i === 3 && S.next < 3) return;
            A.ell(px, py, 9, 6, st && st !== 'missed' ? '#60c060' : st === 'missed' ? '#a04030' : on ? '#ffe890' : '#8898d0'); A.ell(px, py, 7, 4, sea);
            if (on) Txt.draw(g, m[0], px, py + 10, { col: '#ffe890', shadow: '#101838', align: 'center' }); });
        // the patrol boat: a hull, its lights, a searchlight sweeping
        const [bx, by, ba] = scoutAt(k), [px, py] = P(bx, by);
        const sa = ba + Math.sin(S.t * 1.7) * 0.7; g.globalAlpha = 0.22; A.poly([[px, py], [px + Math.cos(sa - 0.18) * 60, py + Math.sin(sa - 0.18) * 60], [px + Math.cos(sa + 0.18) * 60, py + Math.sin(sa + 0.18) * 60]].map(([a, b]) => [Math.round(a), Math.round(b)]), '#fff8d0'); g.globalAlpha = 1;
        A.r(px - 4, py - 2, 9, 5, '#e8ecef'); A.px(px - 4, py, '#ff3020'); A.px(px + 4, py, '#30ff60'); A.r(px - 1, py - 4, 3, 3, '#ffffff');
        // the notebook
        const nx = x0 + w - 150, ny = y0 + h - 70; frame(g, nx, ny, 146, 66);
        SCOUT_MARKS.forEach((m, i) => Txt.draw(g, (S.noted[i] && S.noted[i] !== 'missed' ? S.noted[i] : S.noted[i] === 'missed' ? '  ?  ' : ' --:-- ') + '  ' + m[2], nx + 8, ny + 6 + i * 13, { col: S.noted[i] === 'missed' ? '#a04030' : UI.ink }));
        Txt.draw(g, clockStr(this.clock(S)), x0 + 8, y0 + 6, { col: '#ffffff', shadow: '#101838' });
        if (S.msgT > 0) Txt.draw(g, S.msg, VW >> 1, y0 + h + 4, { col: '#ffe890', align: 'center' });
    },
};

// ============================================================
// THE QUAY BY NIGHT: the watchman's round (dusk to dawn) and the fuel man (by day)
// ============================================================
const WATCH_ROUTE = [[56.5, 30.5, 3, 'look'], [56.5, 36], [53.5, 39.7, 2.5, 'lock'], [57.2, 41.6], [63.4, 43.3, 5, 'sea']];   // tile x, y, [pause s, what]
const Watch = {
    e: null, fm: null, i: 0, dir: 1, pause: 0, face: Math.PI / 2, sus: 0, seeing: false, map: null,
    store() { return Game.maps.ch1.ents.find(e => e.id === 'c1c_fuelstore'); },
    doorPt() { const s = this.store(); return [s.x + s.w / 2, s.y + s.d + 10]; },
    on() { return dusk1C() && !!sflag('c1c_summoned'); },
    alert() { const a = sflag('c1c_watch_alert'); return a != null && Story.s.clock - a < 30; },
    range() { return (this.alert() ? 6.5 : 5) * TILE; },
    ensure(m) {
        if (this.map !== m) { this.map = m; this.e = m.people.find(q => q.id === 'c1c_watchman') || null; this.fm = m.people.find(q => q.id === 'c1c_fuelman') || null; }
        if (!this.e) { const [x, y] = WATCH_ROUTE[0]; this.e = World.addEnt(m, { x: x * TILE, y: y * TILE, w: 0, d: 0, id: 'c1c_watchman', label: 'Night Watchman', person: { sheet: personSheet(LOOKS.c1c_watchman), dir: 0, frame: 0 }, sortY: y * TILE, light: { x: 0, y: -10, r: 46, c: '#fff0c0' } }); m.people.push(this.e); this.i = 0; this.dir = 1; this.pause = 0; }
        if (!this.fm) { const s = this.store(); this.fm = World.addEnt(m, { x: s.x + s.w + 18, y: s.y + s.d + 12, w: 0, d: 0, id: 'c1c_fuelman', label: 'Fuel Man', person: { sheet: personSheet(LOOKS.c1c_fuelman), dir: 0, frame: 0 }, sortY: s.y + s.d + 12 }); m.people.push(this.fm); }
    },
    // one step of the round (used for the real thing and for looking ahead)
    step(st, dt) {
        if (st.pause > 0) { st.pause -= dt; const R = WATCH_ROUTE[st.i]; st.face = R[3] === 'lock' ? -Math.PI / 2 : R[3] === 'sea' ? 0.2 + Math.sin(st.t * 1.3) * 0.5 : Math.PI / 2 + Math.sin(st.t * 1.6) * 1.1; st.t += dt; return; }
        const j = st.i + st.dir, [tx, ty] = WATCH_ROUTE[j], dx = tx * TILE - st.x, dy = ty * TILE - st.y, d = Math.hypot(dx, dy), v = 30 * dt;
        if (d <= v) { st.x = tx * TILE; st.y = ty * TILE; st.i = j; if (j === 0 || j === WATCH_ROUTE.length - 1) st.dir = -st.dir; st.pause = WATCH_ROUTE[j][2] || 0; st.t = 0; }
        else { st.x += dx / d * v; st.y += dy / d * v; st.face = Math.atan2(dy, dx); st.moved = v; }
    },
    sees(w, face, px, py, range) {
        const dx = px - w.x, dy = py - w.y, d = Math.hypot(dx, dy), m = Game.maps.ch1;
        if (d > range || d < 1) return d < 1;
        let da = Math.atan2(dy, dx) - face; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
        if (Math.abs(da) > 0.55) return false;
        for (let t = 10; t < d - 8; t += 6) if (World.blocked(m, w.x + dx * t / d - 2, w.y - 4 + dy * t / d - 2, 4, 4)) return false;
        return true;
    },
    // how long until he'd see someone at the fuel store's door (the lockpicking's clock)
    timeUntil() {
        const st = { x: this.e.x, y: this.e.y, i: this.i, dir: this.dir, pause: this.pause, face: this.face, t: 0 }, [px, py] = this.doorPt();
        for (let t = 0; t < 60; t += 0.1) { this.step(st, 0.1); if (this.sees(st, st.face, px, py, this.range())) return Math.max(3, t); }
        return 60;
    },
    frame(dt) {
        const m = Game.maps.ch1; if (!m || Game.map !== m) return;
        const night = this.on(), day = !dusk1C() && Story.s.clock >= 7 * 60;
        if (night || day || this.e || this.fm) this.ensure(m);
        if (this.fm) { this.fm.gone = !day; this.fm.person.dir = 0; }
        const w = this.e; if (!w) return;
        w.gone = !night; if (!night) return;
        if (Dlg.active || Game.state !== 'play') return;
        const st = { x: w.x, y: w.y, i: this.i, dir: this.dir, pause: this.pause, face: this.face, t: this.t || 0 };
        this.step(st, dt); Object.assign(this, { i: st.i, dir: st.dir, pause: st.pause, face: st.face, t: st.t }); w.x = st.x; w.y = st.y; w.sortY = w.y;
        w.person.dir = this.dirOf(this.face);
        if (st.moved) { w.person.anim = (w.person.anim || 0) + st.moved / 13; w.person.frame = [1, 0, 2, 0][Math.floor(w.person.anim) % 4]; } else w.person.frame = 0;
        // nobody has any business by the fuel store at night
        const p = Game.player, [dx, dy] = this.doorPt(), near = Math.hypot(p.x - dx, p.y - dy) < 3.5 * TILE;
        this.seeing = this.cone() && near && this.sees(w, this.face, p.x, p.y, this.range());
        this.sus = this.seeing ? Math.min(1, this.sus + 1.5 * dt) : Math.max(0, this.sus - 0.4 * dt);
        if (this.sus >= 1) { this.sus = 0; this.caught(); }
    },
    cone() { return this.on() && !prepDone('fuel') && this.e && !this.e.gone; },
    dirOf(a) { const c = Math.cos(a), s = Math.sin(a); return Math.abs(c) > Math.abs(s) ? (c > 0 ? DIR.right : DIR.left) : (s > 0 ? DIR.down : DIR.up); },
    caught() { const p = Game.player; this.e.x = p.x + 20; this.e.y = p.y + 4; this.e.person.dir = DIR.left; this.pause = 4; startDialogue('c1c_watch_caught'); },
    draw(g, cx, cy) {
        const m = Game.maps.ch1; if (Game.map !== m || !this.cone()) return;
        const p = Game.player, w = this.e; if (Math.hypot(p.x - w.x, p.y - w.y) > 16 * TILE) return;
        const A = pa(g), a = this.face, r = this.range(), h = 0.55, pts = [[Math.round(w.x - cx), Math.round(w.y - 4 - cy)]], N = 16;
        for (let k = 0; k <= N; k++) { const b = a - h + 2 * h * k / N, ux = Math.cos(b), uy = Math.sin(b); let t = 10; while (t < r && !World.blocked(m, w.x + ux * t - 2, w.y - 4 + uy * t - 2, 4, 4)) t += 6; pts.push([Math.round(w.x + ux * t - cx), Math.round(w.y - 4 + uy * t - cy)]); }
        g.globalAlpha = this.seeing ? 0.36 : 0.26; A.poly(pts, this.seeing ? '#ff5040' : '#ffe060'); g.globalAlpha = 1;
        if (this.sus > 0.02) { const bx = Math.round(w.x - cx) - 10, by = Math.round(w.y - cy) - 44; A.r(bx - 1, by - 1, 22, 5, '#1c1814'); A.r(bx, by, Math.round(20 * this.sus), 3, this.sus > 0.6 ? '#f04030' : '#f0c040'); Txt.draw(g, '?', bx + 10, by - 13, { col: '#ffe060', shadow: '#1c1814', align: 'center' }); }
        const [dx, dy] = this.doorPt(); if (Math.hypot(p.x - dx, p.y - dy) < 6 * TILE) { const VW = Game.VW; Txt.draw(g, 'THE FUEL STORE', VW >> 1, 6, { col: '#ffe890', shadow: '#1c1814', align: 'center' }); Txt.draw(g, 'Keep out of the watchman\'s light. Pick the lock while his back is turned.', VW >> 1, 18, { col: '#ffffff', shadow: '#1c1814', align: 'center' }); }
    },
};

// ============================================================
// DIESEL
// ============================================================
function c1cFuelDone(how, line) {
    sflag(PREP.fuel, how); taskDone('c1c_fuel');
    storyNote('Diesel', line);
    c1cPrepCheck();
}
STORY_SCRIPTS.c1c_fuelstore = 'c1c_fuelstore';
scene('c1c_fuelstore', {
    speaker: 'System',
    text: () => prepDone('fuel') ? `The fuel store: a breeze-block hut, a steel door, and the smell of diesel you can taste. The Umm Kalthoum's tanks are full. You don't need anything else from it tonight.`
        : !dusk1C() ? `The harbour fuel store: a breeze-block hut with a steel door, drums of diesel and two-stroke stacked inside, a hand pump, a chalkboard of prices nobody pays. The fuel man is in, and so is his radio.`
        : Watch.alert() ? `The fuel store's steel door, and the padlock on it the size of a fist. The watchman is still looking this way every few steps, his torch going over everything. Give him half an hour to forget you.`
        : `The fuel store's steel door, and a padlock on it the size of a fist: Chinese, heavy, older than it looks. Four pins, maybe five. Behind the door, two hundred litres of diesel that belong to the harbour, which is to say, to nobody in particular.\n\nThe watchman's torch is moving along the quay. He rattles this padlock every time he passes, and he passes twice a round. Pick it while his back is turned: the best time is just after he's walked on.`,
    get choices() {
        if (prepDone('fuel') || !sflag('c1c_offer')) return [{ text: 'Move on.' }];
        if (!dusk1C()) return [{ text: 'Talk to the fuel man.', nextScene: 'c1c_fuelman' }, { text: 'Move on.' }];
        if (Watch.alert()) return [{ text: 'Move on.' }];
        return [{ text: 'Pick the padlock. (Lockpicking)', onSelect: () => c1cPick() }, { text: 'Not yet.' }];
    },
});
function c1cPick() {
    const T = Watch.timeUntil();
    playMinigame('lockpick', { pins: 4, time: Math.min(40, T) }, r => {
        if (r.left) return;
        if (r.caught) { Watch.caught(); return; }
        Game.fadeTo(() => { clockAdvance(20); hourNow(); c1cFuelDone('stolen', 'Stolen from the harbour fuel store after dark: the padlock picked, two jerrycans at a time, eight trips down the quay to the Umm Kalthoum while the watchman smoked on the breakwater. The padlock is back on the door, locked. Nobody will know until the next count, and nobody ever counts.'); startDialogue('c1c_fuel_stolen'); });
    });
}
scene('c1c_fuel_stolen', { speaker: 'System', text: `Two jerrycans at a time, eight trips, keeping to the shadow of the fish market, freezing every time the watchman's torch swings round. Zaki is waiting on the dhow's deck in the dark. He takes each can without a word and pours it in.\n\nOn the last trip he says, very quietly, "You put the lock back?"\n\nYou put the lock back.`, choices: [{ text: '"Like it was never open."' }] });
// the fuel man (by day)
STORY_SCRIPTS.c1c_fuelman = 'c1c_fuelman';
const FUEL_ASK = 1200, fuelFloor = () => 750 - 70 * skillLevel('haggling');
scene('c1c_fuelman', {
    speaker: 'Fuel Man',
    text: () => prepDone('fuel') ? `"Zaki's tanks are full? Good. That boat drinks like a camel at a wedding."` : !sflag('c1c_offer') ? `The fuel man turns his radio down an inch. "Diesel, petrol, two-stroke, engine oil. Cash. No credit, not for anybody, not even for God." He turns it up again.`
        : `The fuel man turns his radio down an inch. "Diesel for Zaki's boat? The Umm Kalthoum." He whistles. "She drinks. Two hundred litres to get her out past the reef and back." He writes on the chalkboard with great ceremony. "Twelve hundred."\n\nHe knows exactly what you owe and to whom. Everybody does. It's in the price.`,
    get choices() {
        if (prepDone('fuel') || !sflag('c1c_offer')) return [{ text: 'Move on.' }];
        const c = [{ text: 'Haggle. (minigame)', onSelect: () => c1cHaggleFuel() }];
        if (money() >= FUEL_ASK) c.push({ text: 'Pay the twelve hundred.', onSelect: () => { storyPay(-FUEL_ASK, 'Diesel for the Umm Kalthoum'); c1cFuelPaid(FUEL_ASK); } });
        c.push({ text: '"Too much. I\'ll think about it."' });
        return c;
    },
});
function c1cHaggleFuel() {
    playMinigame('haggle', { who: 'Fuel Man', look: 'c1c_fuelman', item: '200 litres of diesel', ask: FUEL_ASK, floor: fuelFloor(), step: 50, max: money(), patience: 4, lines: { open: '"Twelve hundred. Diesel is not cheap. Nothing is cheap. Life is not cheap."' } }, r => {
        if (r.left || !r.deal) return;
        storyPay(-r.price, 'Diesel for the Umm Kalthoum (haggled)'); c1cFuelPaid(r.price);
    });
}
function c1cFuelPaid(price) {
    c1cFuelDone('paid', `Paid for: two hundred litres from the fuel man, ${price} pounds, all legal, the receipt in your pocket. His boy wheeled the drum down the quay to the Umm Kalthoum on a barrow, and Zaki watched it go in like a man watching his daughter get married.`);
    Dlg.open('Fuel Man', `"${price}." He counts it twice, the second time slowly, for your benefit. Then he shouts for his boy, who comes running with a barrow, and they roll a blue drum down the quay to Zaki's dhow. Zaki pumps it in by hand, singing.`);
}
// the night watchman
STORY_SCRIPTS.c1c_watchman = 'c1c_watchman';
scene('c1c_watchman', {
    speaker: 'Night Watchman',
    text: () => `An old man in a brown wool galabeya, a torch in one hand, a stick in the other, a whistle on a string round his neck. "Peace be upon you. Nobody walks on the quay at night but fishermen and thieves." He shines the torch at you. "And you're not a fisherman."`,
    get choices() {
        const c = [];
        if (sflag('c1c_offer') && !prepDone('fuel')) c.push({ text: '[Haggling] "Uncle. What would a long walk to the end of the breakwater cost?"', onSelect: () => c1cHaggleWatch() });
        c.push({ text: '"Good night, uncle."' });
        return c;
    },
});
function c1cHaggleWatch() {
    playMinigame('haggle', { who: 'Night Watchman', look: 'c1c_watchman', item: 'A long walk, and a short memory', ask: 400, floor: 260 - 20 * skillLevel('haggling'), step: 10, max: money(), patience: 3, lines: { open: '"A long walk? At my age?" He thinks. "My knees are worth four hundred. And I have the key, so you won\'t break my lock."', deal: '"Done. God sees everything." He sighs. "Luckily, God doesn\'t work for the harbour."' } }, r => {
        if (r.left || !r.deal) return;
        storyPay(-r.price, 'The watchman, for his knees');
        c1cWatchKey(r.price);
    });
}
function c1cWatchKey(price) {
    Game.fadeTo(() => { clockAdvance(20); hourNow(); c1cFuelDone('bribed', `The night watchman took ${price} pounds, gave you the key to the fuel store, and went for a long walk to the end of the breakwater. You filled the Umm Kalthoum two jerrycans at a time and hung the key back on its nail.`); });
    Dlg.open('Night Watchman', `He unhooks a key from the string with his whistle on it and hands it over without looking at you. "Hang it back on the nail inside the door." He sets off down the quay towards the breakwater with his torch, very slowly. "My knees," he says, to nobody.`);
}
scene('c1c_watch_caught', {
    speaker: 'Night Watchman',
    text: () => `A torch, right in your face. "Who's that? Who's there?" Then: "Oh. It's you." An old man with a stick and a whistle on a string, and he knows exactly who you are. "The whole harbour knows about Bassem."\n\nThe torch goes to the padlock, and back to your hands.`,
    get choices() {
        const c = [];
        if (money() >= 100) c.push({ text: '[Haggling] "For your tea, uncle. And for your eyes, which are very old."', onSelect: () => { storyPay(-100, 'The watchman\'s tea'); skillXP('haggling', 8); }, nextScene: 'c1c_watch_bribe' });
        c.push({ text: 'Run.', onSelect: () => c1cRun() });
        return c;
    },
});
scene('c1c_watch_bribe', {
    speaker: 'Night Watchman',
    text: () => `He takes the note and tucks it into his galabeya. He looks at the padlock for a long time.\n\n"My eyes are very old," he agrees. "Also, I have the key." He lets that sit. "For three hundred more, my eyes would go for a walk to the end of the breakwater, and the key would hang on its nail inside the door."`,
    get choices() {
        const c = [];
        if (money() >= 300) c.push({ text: 'Pay him the three hundred.', onSelect: () => { storyPay(-300, 'The watchman\'s walk'); c1cWatchKey(300); } });
        c.push({ text: '"Just the tea, uncle."', onSelect: () => { sflag('c1c_watch_alert', Story.s.clock); Toast.show('He\'ll be watching the fuel store for a while.'); } });
        return c;
    },
});
function c1cRun() {
    Story.s.heat = (Story.s.heat || 1) + 1; sflag('c1c_watch_alert', Story.s.clock);
    Game.player.x -= 3 * TILE; Sfx.tone(1800, 0.3, 'square', 0.05);
    Toast.show('Police heat ' + Story.s.heat + '. The whistle goes up and down the quay behind you.', 5);
    Notice.show('He\'ll be watching the fuel store for half an hour.');
}

// ============================================================
// THE ROUTE PAST THE COAST GUARD
// ============================================================
const ROUTE_NOTE = 'The coast guard\'s patrol boat goes out at half past six, at dusk: out of the harbour mouth, north inside the reef to the buoy line, back south outside it, and in again by twenty to eight, when the crew eat. Nobody goes out again till after midnight. Between, the sea is yours: go south, round the villa\'s point.';
function c1cRouteDone(how, good, line) {
    sflag(PREP.route, how); sflag('c1c_route_good', !!good); taskDone('c1c_route');
    storyNote('The coast guard', line + '\n\n' + ROUTE_NOTE);
    c1cPrepCheck();
}
STORY_SCRIPTS.c1c_fisherman = () => sflag('c1c_offer') && !prepDone('route') ? 'c1c_fish_route' : 'c1c_fisherman';
scene('c1c_fish_route', {
    speaker: 'Fisherman',
    text: `The old fisherman doesn't stop mending his net. "You want to know when the coast guard goes out." It isn't a question. "Everyone wants to know when the coast guard goes out."\n\nThe wooden needle goes in and out. "My wife's cousin is on that boat. He tells me when they go, so they don't cut my nets in the dark." He looks up for the first time. "It's family information. Five hundred."`,
    get choices() {
        const c = [{ text: 'Haggle. (minigame)', onSelect: () => c1cHaggleRoute() }];
        if (money() >= 500) c.push({ text: 'Pay the five hundred.', onSelect: () => { storyPay(-500, 'The patrol times'); c1cRouteBought(500); } });
        c.push({ text: '"I\'ll watch for myself." (from the fort wall, at dusk)' });
        return c;
    },
});
function c1cHaggleRoute() {
    playMinigame('haggle', { who: 'Fisherman', look: 'c1c_fisherman', item: 'The coast guard\'s patrol times', ask: 500, floor: 200 - 15 * skillLevel('haggling'), step: 10, max: money(), patience: 4, lines: { open: '"Five hundred. It\'s family information. My wife\'s family. Which costs me plenty."', deal: '"Done. But you didn\'t hear it from me. You heard it from the fish."' } }, r => {
        if (r.left || !r.deal) return;
        storyPay(-r.price, 'The patrol times (haggled)'); c1cRouteBought(r.price);
    });
}
function c1cRouteBought(price) {
    c1cRouteDone('bought', true, `Bought from the old fisherman on the quay for ${price} pounds: his wife's cousin is on the patrol boat.`);
    Dlg.open('Fisherman', `He leans close and speaks into his net. "They go out at half past six, when the sun goes. North, inside the reef, up to the buoys. Back outside it, and in by twenty to eight, because the cook on that boat is a good cook. Then nobody goes out till after midnight."\n\nThe needle goes in and out. "If I were a stupid man with a boat, I'd go south. Round the Shark's own point. They never look there." He almost smiles. "Who would?"`);
}
// the steps up the fort's wall
STORY_SCRIPTS.c1c_rampart = 'c1c_rampart';
scene('c1c_rampart', {
    speaker: 'System',
    text: () => {
        const c = Story.s.clock;
        const base = `Stone steps worn into a dip in the middle go up the outside of the fort's wall to the rampart, where the Ottoman gunners stood. From the top you can see the whole coast: the town, the harbour, the coast guard post at the harbour mouth, the reef, the buoys.`;
        if (!sflag('c1c_offer') || prepDone('route')) return base;
        if (c < 17 * 60) return base + `\n\nThe patrol boat is tied up at the coast guard post. It goes out at dusk; come back towards evening, and watch it.`;
        if (c < SCOUT_T0) return base + `\n\nThe sun is going down behind the mountains. The patrol boat's crew are on deck at the coast guard post, getting ready to go out.`;
        if (c < SCOUT_T0 + 50) return base + `\n\nThe patrol boat is already out: you can see its lights on the water.`;
        return base + `\n\nThe patrol boat is back at the coast guard post, its crew eating on deck. You've missed its run. The fisherman on the quay will know the times.`;
    },
    get choices() {
        const c = Story.s.clock;
        if (!sflag('c1c_offer') || prepDone('route')) return [{ text: 'Climb down.' }];
        if (c >= 17 * 60 && c < SCOUT_T0) return [{ text: 'Sit on the rampart and wait for the patrol boat to go out.', onSelect: () => Game.fadeTo(() => { clockAdvance(SCOUT_T0 - Story.s.clock); hourNow(); c1cScout(0); }) }, { text: 'Climb down.' }];
        if (c >= SCOUT_T0 && c < SCOUT_T0 + 50) return [{ text: 'Watch the patrol boat.', onSelect: () => c1cScout((c - SCOUT_T0) / SCOUT_LEN) }, { text: 'Climb down.' }];
        return [{ text: 'Climb down.' }];
    },
});
function c1cScout(u0) {
    playMinigame('scout', { u0 }, r => {
        if (r.left) return;
        clockAdvance(Math.max(0, SCOUT_T0 + SCOUT_LEN + 5 - Story.s.clock)); hourNow();
        if (r.marks >= 2) c1cRouteDone('scouted', r.marks >= 3, r.marks >= 3 ? 'Watched from the fort\'s rampart at dusk, every mark noted.' : 'Watched from the fort\'s rampart at dusk; the times are rough.');
        else Toast.show('You lost the patrol boat in the dark. The fisherman on the quay knows its times.', 6);
    });
}

// ============================================================
// RANA'S DIVING KIT
// ============================================================
STORY_SCRIPTS.c1c_rana = () => !sflag('c1c_rana') ? 'c1c_rana' : sflag('c1c_offer') && !prepDone('kit') ? 'c1c_rana_kit' : 'c1c_rana';
scene('c1c_rana_kit', {
    speaker: 'Rana Fouad',
    text: `There's a mesh bag on the counter before you've said anything: a mask, fins, a jacket, a regulator, a little yellow pony bottle. Her initials on every piece in red nail varnish.\n\n"Enough to get you from the bottom to the top." She doesn't push it across. "And to here."\n\nShe looks at you, the long look, the one she used to give you on the dive boat before you went over the side. "What is it, the job?"`,
    choices: [
        { text: 'Tell her: a package, a ship offshore, tonight.', onSelect: () => rel('rana', 5, true), nextScene: 'c1c_rana_kit_told' },
        { text: '"Better you don\'t know."', onSelect: () => rel('rana', -2, true), nextScene: 'c1c_rana_kit_not' },
    ],
});
scene('c1c_rana_kit_told', { speaker: 'Rana Fouad', text: `She listens to all of it without moving. "A ship offshore. For Bassem." She pushes the bag across, slowly. "Bassem's ships don't always come back with the same crew they went out with. You know that."\n\nShe taps the pony bottle. "Five minutes of air. If you go in, you don't come up next to the ship. You go down, and you swim for the reef, and you come up where the coral is. Promise me."`, choices: [{ text: '"I promise."', nextScene: 'c1c_rana_kit_check' }] });
scene('c1c_rana_kit_not', { speaker: 'Rana Fouad', text: `"That's what you always say." She pushes the bag across anyway. "It's what you said about the Shahd."\n\nShe taps the pony bottle. "Five minutes of air. If you go in, swim for the reef. Not for the boat. The reef."`, choices: [{ text: '"The reef."', nextScene: 'c1c_rana_kit_check' }] });
scene('c1c_rana_kit_check', {
    speaker: 'Rana Fouad',
    text: `"Check it." She folds her arms. "Don't look at me like that. Check it in front of me, like I taught you."`,
    choices: [
        { text: '[Diving] Crack the valve, breathe through the regulator, check the seals and the gauge.', onSelect: () => { skillXP('diving', 20, 'Rana\'s kit'); rel('rana', 2, true); }, nextScene: 'c1c_rana_kit_ok' },
        { text: '"I trust you."', nextScene: 'c1c_rana_kit_trust' },
    ],
});
scene('c1c_rana_kit_ok', { speaker: 'Rana Fouad', text: `The valve hisses, the regulator breathes, the needle sits at two hundred. She watches every move, and nods once at the end, the nod she gave you when you got your instructor's card and she got hers.\n\n"Bring it back," she says. "Bring you back."`, choices: [{ text: 'Take the kit.', onSelect: () => c1cKitDone() }] });
scene('c1c_rana_kit_trust', { speaker: 'Rana Fouad', text: `"You never did check anything." But she checks it for you, quickly, hands she doesn't have to think about: the hiss, the breath, the needle. "Two hundred bar. Bring it back." A pause. "Bring you back."`, choices: [{ text: 'Take the kit.', onSelect: () => c1cKitDone() }] });
function c1cKitDone() {
    sflag(PREP.kit, true); taskDone('c1c_kit'); pocket('Diving kit');
    storyNote('Rana Fouad', 'She lent you her spare diving kit: a pony bottle, five minutes of air. "If you go in, swim for the reef. Not for the boat." She wants it back. She wants you back.');
    c1cPrepCheck();
}

// ---- Zaki, while you get ready ----
STORY_SCRIPTS.c1c_zaki = () => !sflag('c1c_zaki') ? 'c1c_zaki' : sflag('c1c_offer') ? 'c1c_zaki_prep' : 'c1c_zaki';
scene('c1c_zaki_prep', {
    speaker: 'Captain Zaki',
    text: () => {
        const f = sflag(PREP.fuel), r = sflag(PREP.route);
        const fuel = !f ? `"Diesel, habibi. She won't go on prayers. I tried."` : f === 'paid' ? `"Full tanks, and a receipt!" He shows you the receipt as if it were a photograph of his grandson. "I'll frame it."` : f === 'bribed' ? `"Full tanks. And the watchman went for a walk, they say." He laughs. "His knees must be killing him."` : `"Full tanks." He doesn't ask where from. He's careful not to ask where from.`;
        const route = !r ? `"And which way do we go? The coast guard has eyes."` : `"South, round the Shark's own point, after the patrol comes in." He nods slowly. "Yes. That's the way I'd go, if I were a stupid man with a boat."`;
        return `Zaki is on the dhow's deck, coiling a line.\n\n${fuel}\n\n${route}`;
    },
    choices: [{ text: '"Ten o\'clock, Zaki."' }],
});

// ---- all three done ----
function c1cPrepCheck() {
    if (prepDone('fuel') && prepDone('route') && prepDone('kit') && !sflag('c1c_prep')) {
        sflag('c1c_prep', true);
        storyNotice('Diesel, a route, a way out of the water. The truck at ten.');
        task('c1c_truck', 'Everything\'s ready. The truck stop on the highway, at ten. Be early.');
    }
}

// ---- the steps up the fort wall (on the map) ----
(function () {
    const L0 = marsaLayout;
    marsaLayout = function () { const L = L0(); L.things.push(['c1c_rampart', 62, 4, 2, 1]); return L; };
})();
POKE_MAP_1C.objects.push({ id: 'c1c_rampart', label: 'Steps up the Wall', model: 'fort steps', say: null });
SPR_L['fort steps'] = (w, d) => {                                  // stone steps up the fort's flank to the rampart, side-on: a sawtooth climbing west to the wall's top
    const S = ['#e8dcc4', '#d4c4a4', '#b8a684', '#948262', '#6e5e44'], H = 60, st = propStage(w, d, w, H), { A } = st, x = st.x, bot = st.y + H, n = 7, sw = Math.floor((w - 4) / n);
    for (let k = 0; k < n; k++) {                                  // k = 0 is the bottom step, on the east
        const sx = x + w - (k + 1) * sw, top = bot - 8 - (k + 1) * 6;
        A.r(sx, top + 5, sw, bot - top - 5, S[2]); A.vl(sx, top + 5, bot - top - 5, S[1]);                        // the flank, stone courses
        for (let yy = top + 11; yy < bot; yy += 6) A.hl(sx, yy, sw, S[3]);
        A.r(sx, top, sw, 5, S[1]); A.hl(sx, top, sw, S[0]); A.px(sx + (sw >> 1), top + 2, S[2]);                  // the tread, worn
        A.vl(sx + sw - 1, top, 5, S[3]);
    }
    A.r(x, bot - 8 - n * 6 - 4, 4, n * 6 + 12, S[3]);                                                          // against the tower
    A.hl(x, bot - 1, w, S[4]);
    return propFit(st, w, d, { solid: [0, 0, w, d] });
};

// ---- the hooks ----
(function () {
    const A = AREAS.fixer, _frame = A.frame, _sync = A.sync, _over = A.overlay;
    A.frame = function (dt) { _frame.call(this, dt); Watch.frame(dt); };
    A.overlay = function (g, cx, cy) { if (_over) _over.call(this, g, cx, cy); Watch.draw(g, cx, cy); };
    A.sync = function () { _sync.call(this); Watch.map = null; Watch.e = Watch.fm = null; };
})();

// ---- where the compass points ----
TASK_TARGETS.c1c_fuel = () => dusk1C() ? 'c1c_fuelstore' : 'c1c_fuelman';
TASK_TARGETS.c1c_route = () => { const c = Story.s.clock; return c >= 16 * 60 && c < SCOUT_T0 + 50 ? 'c1c_rampart' : 'c1c_fisherman'; };
TASK_TARGETS.c1c_kit = () => ({ room: 'INT_DIVESHOP', id: 'c1c_rana', out: 'c1c_diveshop' });
