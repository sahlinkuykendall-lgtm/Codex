// ============================================================
// THE CODEX OF GIZA — POKE STYLE: CHAPTER 1-C, BEAT 6: THE SHIP AND THE BETRAYAL (poke/ch1c_ship.js)
// story/regions/ch01_opening_fixer.md, beat 6: "At the offshore meet, the ship's crew plans
// to kill the courier (you) to cut loose ends. It's a boat chase and stealth escape, with Zaki
// at the wheel. Zaki is shot in the escape. Save him (first aid while the dhow drifts, and you
// lose the ship) or keep running (he survives, just, but won't forgive you) → ch1c_zaki_saved ★."
//   - alongside the ship: "Hamburg." Up the ladder, the case still in your bag
//   - the ship's deck at night (a room): two crewmen on their rounds with torches (view cones);
//     creep behind the containers and listen to the captain and the mate. Seen first, you hear
//     it shouted instead, and the chase starts with them already on your heels
//   - THE BOAT CHASE (minigame): Zaki at the wheel steering where you call (◄►), you on the lamp
//     (SPACE: light shows the reef, dark hides you from the searchlight) and the lines (▲: a net
//     astern to foul the launch's propeller). Lure the launch onto the reef
//   - Zaki is shot. FIRST AID (minigame): find the wound, press, bind; or keep running
//   - home: the harbour at half past one in the morning
// Nobody aboard is named: the captain, the mate, the man who says "Hamburg", two deckhands.
// ============================================================

Object.assign(LOOKS, {
    c1c_captain: { skinCol: SKINS[2], top: ['#3a4a5a', '#2a3a48', '#1c2834'], topKind: 'jacket', legs: CLOTH.black, head: 'cap', headCol: ['#f4f4f0', '#d8d8d0', '#b8b8b0'], face: 'beard', beard: '#8a7a6a', wide: true, shoe: '#1c1814' },
    c1c_mate: { skinCol: SKINS[3], top: ['#6a6a5a', '#4e4e40', '#38382c'], topKind: 'shirt', legs: ['#3a3e48', '#2a2e36', '#1c1e24'], hairStyle: 'buzz', hairCol: HAIRS[7], face: 'stubble', shoe: '#1c1814' },
    c1c_deckhand: { skinCol: SKINS[5], top: ['#d06030', '#a84820', '#803818'], topKind: 'jacket', legs: ['#3a3e48', '#2a2e36', '#1c1e24'], head: 'cap', headCol: CLOTH.black, face: 'stubble', wide: true, shoe: '#1c1814' },
    c1c_hamburg: { skinCol: SKINS[4], top: CLOTH.black, topKind: 'tee', legs: ['#3a3e48', '#2a2e36', '#1c1e24'], hairStyle: 'short', hairCol: HAIRS[0], face: 'tache', tache: '#2a2424', slim: true, shoe: '#1c1814' },
});

// ============================================================
// ALONGSIDE
// ============================================================
STORY_SCRIPTS.c1c_zaki_deck = () => sflag('c1c_ship_done') ? 'c1c_zaki_deck3' : sflag('c1c_opened') ? 'c1c_ship_alongside' : 'c1c_zaki_deck';
scene('c1c_ship_alongside', {
    speaker: 'Captain Zaki',
    text: `The green lamp grows into a ship: a rusty coaster riding high and empty, her name painted out on the bow, a flag nobody could tell you the country of. Zaki brings the Umm Kalthoum in under her side as gently as a man putting a baby down. A rope ladder hangs from her rail.\n\nA torch at the top. A voice, flat, in English: "Hamburg."\n\nZaki, very low: "I don't like it, habibi. Ships that paint out their names don't like witnesses."`,
    choices: [{ text: '"Hamburg." Climb the ladder, the case still in your bag.', onSelect: () => c1cBoard() }, { text: '"Not yet, Zaki."' }],
});
function c1cBoard() {
    Game.fadeTo(() => {
        const room = Game.maps.INT_SHIP = buildRoom('INT_SHIP', window.POKE_MAP, [0, 0]), p = Game.player;
        p.x = room.pw >> 1; p.y = room.ph - 34; p.dir = DIR.up;
        Game.enter(room); clockAdvance(5); if (Game.set.time === 5) Game.hour = storyHour();
        Ship.start(room); startDialogue('c1c_ship_deck');
    });
}
scene('c1c_ship_deck', {
    speaker: 'A Sailor',
    text: `The man with the torch is thin, in a black T-shirt, with the eyes of someone who hasn't slept since Suez. He looks at your bag, not at you. "The captain pays. The captain likes to see who he pays." He jerks his head at the wheelhouse. "Wait."\n\nHe goes. You're alone at the rail, on a steel deck under a couple of dim lamps, between rusting containers. Two deckhands with torches walk their rounds. And from somewhere past the containers, by the wheelhouse door, two men talking, low.`,
    choices: [{ text: 'Listen. (stay out of the torches)', onSelect: () => { task('c1c_listen', 'Get close enough to hear the captain and the mate by the wheelhouse. Stay out of the deckhands\' torches.'); taskDone('c1c_ship'); } }],
});

// ============================================================
// THE SHIP'S DECK
// ============================================================
const FURNS = {
    container(w, h, P) { const st = stage(w, h, 26), { A } = st, x = st.x, y = st.y - 24; A.r(x, y, w, 24, P[0]); A.hl(x, y, w, shade(P[0], 0.25)); A.r(x, y + 24, w, h, P[1]); for (let i = 4; i < w; i += 5) A.vl(x + i, y + 25, h - 2, P[2]); A.hl(x, y + 24, w, P[2]); A.r(x + w - 14, y + 30, 3, h - 10, '#3a3e48'); A.r(x + w - 8, y + 30, 3, h - 10, '#3a3e48'); for (let k = 0; k < 4; k++) A.r(x + 6 + Math.floor(hash2(k, w) * (w - 20)), y + 26 + Math.floor(hash2(w, k) * (h - 8)), 3, 6, '#8a4a2c'); return fit(st, { solid: [0, 0, w, h] }); },
    hatch() { const st = stage(96, 40, 8), { A } = st, x = st.x, y = st.y - 6; A.r(x, y, 96, 44, '#3a5a4a'); A.hl(x, y, 96, '#5a7a6a'); for (let i = 0; i < 96; i += 24) A.vl(x + i, y, 44, '#2a4a3a'); A.r(x, y + 40, 96, 6, '#2a3a32'); return fit(st, { solid: [0, 0, 96, 40] }); },
    winch() { const st = stage(30, 20, 14), { A } = st, x = st.x, y = st.y - 12; A.r(x + 2, y + 16, 26, 14, '#3a3e48'); A.ell(x + 15, y + 12, 9, 9, '#5a6068'); A.ell(x + 15, y + 12, 6, 6, '#a8845c'); for (let k = 0; k < 4; k++) A.ell(x + 15, y + 12, 6 - k, 6 - k, k % 2 ? '#8e6a44' : '#a8845c'); return fit(st, { solid: [2, 4, 26, 16] }); },
    deckLamp() { const st = stage(10, 8, 40), { A } = st, x = st.x, y = st.y - 38; A.r(x + 4, y + 6, 2, 40, '#5a6068'); A.r(x, y, 10, 7, '#20242c'); A.r(x + 2, y + 2, 6, 4, '#fff0b0'); return fit(st, { solid: [2, 2, 6, 6], light: { x: 0, y: -36, r: 64, c: '#ffe8a0' } }); },
    ladder() { const st = stage(28, 8, 6), { A } = st, x = st.x, y = st.y - 4; A.r(x + 3, y, 3, 14, '#a8845c'); A.r(x + 22, y, 3, 14, '#a8845c'); for (let j = 2; j < 14; j += 4) A.r(x + 3, y + j, 22, 2, '#c8a070'); return fit(st); },
    raft() { const st = stage(36, 18, 10), { A } = st, x = st.x, y = st.y - 8; A.ell(x + 18, y + 12, 18, 9, '#f4f4f0'); A.ell(x + 18, y + 10, 16, 7, '#ffffff'); A.hl(x + 4, y + 12, 28, '#d04838'); A.r(x + 16, y + 4, 4, 14, '#c8ccd0'); return fit(st, { solid: [0, 2, 36, 16] }); },
};
ROOMS.INT_SHIP = {
    name: 'THE SHIP', tw: 15, th: 10, style: 'steel',
    build({ map, A, put, wall, pw, ph, W }) {
        map.dark = true;
        World.addSolid(map, 0, ph - 14, pw, 14);                         // (the rail: the only way off is the ladder)
        A.r(pw - 84, 18, 30, W - 18, '#5a6068'); A.r(pw - 81, 21, 24, W - 21, '#2a3448'); A.r(pw - 76, 30, 6, 4, '#ffd890');   // the wheelhouse door, ajar
        wall(pw - 90, 40, null, { label: 'The Wheelhouse', say: ['System', 'The wheelhouse door, standing open a hand\'s width, yellow light inside and the smell of cigarettes and instant coffee. Somebody in there is on a satellite phone, in a language you don\'t have.'] });
        wall(20, pw - 140, null, { label: 'The Superstructure', say: ['System', 'The ship\'s white superstructure, rust bleeding down it from every rivet. No name anywhere. Somebody has gone to a lot of trouble to make this ship nobody\'s.'] });
        put(30, W + 46, FURNS.container(100, 40, ['#b05030', '#903c24', '#702c18']), null, { label: 'A Container', say: ['System', 'A forty-foot container, red once, its doors chained and padlocked, its number ground off. Empty, by the sound when you lean on it.'] });
        put(250, W + 40, FURNS.container(96, 40, ['#3a6a9a', '#2a5480', '#1c3c60']), null, { label: 'A Container', say: ['System', 'A blue container, the doors welded shut. It\'s cold to touch, colder than the night. Something in it is refrigerated, or the steel is just honest.'] });
        put(110, W + 150, FURNS.container(84, 36, ['#7a8a4a', '#5e6e38', '#44522a']), null, { label: 'A Container', say: ['System', 'A green container, rust holes along the bottom. You can see the deck through them, and nothing else.'] });
        put(300, W + 160, FURNS.hatch(), null, { label: 'Cargo Hatch', say: ['System', 'The cargo hatch, battened down. The ship is riding high: whatever she carries, it isn\'t much, and it isn\'t in the hold.'] });
        put(22, ph - 70, FURNS.winch(), null, { label: 'Winch', say: ['System', 'A winch wound with wire hawser, greasy and cold.'] });
        put(pw - 60, ph - 64, FURNS.raft(), null, { label: 'Life Raft', say: ['System', 'A life raft canister on its cradle. The inspection date on it is eleven years ago.'] });
        put(200, W + 100, FURNS.deckLamp()); put(pw - 30, W + 70, FURNS.deckLamp());
        put((pw >> 1) - 14, ph - 22, FURNS.ladder(), 'c1c_ladder', { label: 'The Ladder', script: 'c1c_ladder' });
        // the captain and the mate, by the wheelhouse door
        Ship.capt = personAt(map, pw - 64, W + 30, 'c1c_captain', 'The Captain', 'c1c_captain', 1);
        Ship.mate = personAt(map, pw - 40, W + 34, 'c1c_mate', 'The Mate', 'c1c_mate', 1);
    },
};
const SHIP_ROUTES = [                                                   // [points (room px), pause at each end]
    { pts: [[44, 196], [236, 196]], pause: 2.4 },
    { pts: [[436, 296], [436, 240]], pause: 2.0 },
];
const Ship = {
    on: false, map: null, crew: [], capt: null, mate: null, listen: 0, sus: 0, seeing: false, phase: 'listen',
    start(map) {
        this.map = map; this.on = true; this.listen = 0; this.sus = 0; this.phase = 'listen'; this.crew = [];
        SHIP_ROUTES.forEach((R, k) => {
            const [x, y] = R.pts[0], e = personAt(map, x, y, 'c1c_deckhand' + k, 'A Deckhand', 'c1c_deckhand', 2);
            e.light = { x: 0, y: -8, r: 40, c: '#fff4c0' };
            this.crew.push({ e, R, i: 0, dir: 1, pause: 0, face: 0, t: 0 });
        });
    },
    sees(w, face, px, py) {
        const dx = px - w.x, dy = py - w.y, d = Math.hypot(dx, dy); if (d > 104 || d < 1) return d < 1;
        let da = Math.atan2(dy, dx) - face; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
        if (Math.abs(da) > 0.52) return false;
        for (let t = 8; t < d - 6; t += 5) if (World.blocked(this.map, w.x + dx * t / d - 2, w.y - 4 + dy * t / d - 2, 4, 4)) return false;
        return true;
    },
    frame(dt) {
        if (!this.on || Game.map !== this.map || Dlg.active || Game.state !== 'play') return;
        const p = Game.player;
        this.seeing = false;
        for (const c of this.crew) {
            const e = c.e;
            if (c.pause > 0) { c.pause -= dt; c.t += dt; c.face = (c.i === 0 ? 0 : Math.PI) + Math.sin(c.t * 1.8) * 0.9; e.person.frame = 0; }
            else {
                const j = c.i + c.dir, [tx, ty] = c.R.pts[j], dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy), v = 34 * dt;
                if (d <= v) { e.x = tx; e.y = ty; c.i = j; if (j === 0 || j === c.R.pts.length - 1) c.dir = -c.dir; c.pause = c.R.pause; c.t = 0; }
                else { e.x += dx / d * v; e.y += dy / d * v; c.face = Math.atan2(dy, dx); e.person.anim = (e.person.anim || 0) + v / 13; e.person.frame = [1, 0, 2, 0][Math.floor(e.person.anim) % 4]; }
            }
            e.sortY = e.y; const cs = Math.cos(c.face), sn = Math.sin(c.face); e.person.dir = Math.abs(cs) > Math.abs(sn) ? (cs > 0 ? DIR.right : DIR.left) : (sn > 0 ? DIR.down : DIR.up);
            if (this.sees(e, c.face, p.x, p.y - 4)) this.seeing = true;
        }
        this.sus = this.seeing ? Math.min(1, this.sus + 1.25 * dt) : Math.max(0, this.sus - 0.35 * dt);
        if (this.sus >= 1) { this.sus = 0; this.on = false; sflag('c1c_ship_seen', true); startDialogue(this.phase === 'listen' ? 'c1c_ship_seen1' : 'c1c_ship_seen2'); return; }
        if (this.phase === 'listen') {
            const mx = (this.capt.x + this.mate.x) / 2, my = (this.capt.y + this.mate.y) / 2, near = Math.hypot(p.x - mx, p.y - my) < 84;
            this.listen = near && !this.seeing ? Math.min(1, this.listen + dt / 3.5) : Math.max(0, this.listen - dt / 8);
            if (this.listen >= 1) { this.phase = 'back'; startDialogue('c1c_overhear'); }
        }
    },
    draw(g, cx, cy) {
        if (!this.on || Game.map !== this.map) return;
        const A = pa(g), m = this.map;
        for (const c of this.crew) {
            const w = c.e, a = c.face, pts = [[Math.round(w.x - cx), Math.round(w.y - 4 - cy)]];
            for (let k = 0; k <= 14; k++) { const b = a - 0.52 + 1.04 * k / 14, ux = Math.cos(b), uy = Math.sin(b); let t = 8; while (t < 104 && !World.blocked(m, w.x + ux * t - 2, w.y - 4 + uy * t - 2, 4, 4)) t += 5; pts.push([Math.round(w.x + ux * t - cx), Math.round(w.y - 4 + uy * t - cy)]); }
            const hot = this.seeing && this.sees(w, a, Game.player.x, Game.player.y - 4);
            g.globalCompositeOperation = 'lighter'; g.globalAlpha = hot ? 0.34 : 0.22; A.poly(pts, hot ? '#ff5040' : '#ffe880'); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        }
        const VW = Game.VW;
        Txt.draw(g, this.phase === 'listen' ? 'LISTEN IN' : 'BACK TO THE LADDER', VW >> 1, 6, { col: '#ffe890', shadow: '#1c1814', align: 'center' });
        Txt.draw(g, this.phase === 'listen' ? (this.listen > 0.02 ? 'Listening… keep still, keep hidden.' : 'Get close to the two men by the wheelhouse. Containers block the torches.') : 'Down the ladder, quietly. Zaki is waiting.', VW >> 1, 18, { col: '#ffffff', shadow: '#1c1814', align: 'center' });
        if (this.phase === 'listen') { const w = 70, x = (VW - w) >> 1; A.r(x - 1, 31, w + 2, 5, '#1c1814'); A.r(x, 32, Math.round(w * this.listen), 3, '#60c0f0'); }
        if (this.sus > 0.02) { const w = 70, x = (VW - w) >> 1; A.r(x - 1, 39, w + 2, 5, '#1c1814'); A.r(x, 40, Math.round(w * this.sus), 3, this.sus > 0.6 ? '#f04030' : '#f0c040'); Txt.draw(g, '?', (VW >> 1) + w / 2 + 8, 34, { col: '#ffe060', shadow: '#1c1814' }); }
    },
};
scene('c1c_overhear', {
    speaker: 'The Captain',
    text: `You press yourself against the cold side of the blue container. Two voices, in English, the common language of ships, one with Russian in it and one with something else.\n\n"…the old man and the courier. Both."\n"The Swiss said nothing about —"\n"The Swiss said no loose ends. A courier is a loose end with a mouth." A lighter clicks. "He hands it over, we give him a drink for the road. Then the old man, then the boat. The reef does the rest. Fishermen drown on this coast every week."\n\nThe mate laughs, not happily. "And Nassar?"\n"Nassar will be paid for one courier and won't ask about him."`,
    choices: [{ text: 'Back to the ladder. Now. Quietly.', onSelect: () => { taskDone('c1c_listen'); task('c1c_flee', 'Back down the ladder to Zaki, without being seen.'); storyNote('The ship', '"A courier is a loose end with a mouth." The captain means to kill you and Zaki once the package is handed over, and sink the dhow on the reef. Bassem will be paid for one courier and won\'t ask.'); } }],
});
scene('c1c_ship_seen1', {
    speaker: 'A Deckhand',
    text: `A torch swings round into your face. "Hey! What are you —"\n\nAnd from the wheelhouse door, the captain's voice, not even raised: "Him? Good. Saves time. Take the bag, then put him in the sea with the old man."\n\nThe deckhand's hand goes behind his back for something. You don't wait to see what.`,
    choices: [{ text: 'Run for the ladder.', onSelect: () => c1cShipFlee(true) }],
});
scene('c1c_ship_seen2', {
    speaker: 'A Deckhand',
    text: `A torch swings round into your face. "Hey! The courier —"\n\n"Then do it now," says the captain from the wheelhouse door, bored. "The bag, then the sea."\n\nYou're already moving.`,
    choices: [{ text: 'Run for the ladder.', onSelect: () => c1cShipFlee(true) }],
});
STORY_SCRIPTS.c1c_ladder = 'c1c_ladder';
scene('c1c_ladder', {
    speaker: 'System',
    text: () => Ship.phase === 'back' ? `The rope ladder down the ship's side, and at the bottom, in the dark, the Umm Kalthoum with her engine just ticking over, and Zaki looking up.` : `The rope ladder down to the Umm Kalthoum. The man said wait. The two voices by the wheelhouse are still talking.`,
    get choices() { return Ship.phase === 'back' ? [{ text: 'Down the ladder. "Go, Zaki. Go!"', onSelect: () => c1cShipFlee(false) }] : [{ text: 'Wait a little longer.' }]; },
});
function c1cShipFlee(seen) {
    Ship.on = false; taskDone('c1c_flee'); taskDone('c1c_listen');
    startDialogue(seen ? 'c1c_flee_seen' : 'c1c_flee_quiet');
}
scene('c1c_flee_quiet', {
    speaker: 'Captain Zaki',
    text: `You're down the ladder in three moves and onto the deck, and you don't have to say anything: Zaki sees your face and slams the throttle open. The Umm Kalthoum leaps away from the ship's side.\n\nBehind you, shouting. A searchlight on the bridge wing comes on and swings out over the water, looking for you. Then the sound you didn't want: an outboard, big, starting up. A launch.\n\n"Tell me where!" Zaki shouts. "She draws nothing, she'll go over the shallows. That launch won't, if they don't see them coming. Put the lamp out when we cross!"`,
    choices: [{ text: 'Get to the bow. (the chase)', onSelect: () => c1cChase() }],
});
scene('c1c_flee_seen', {
    speaker: 'Captain Zaki',
    text: `You go over the rail and half climb, half fall down the ladder, and Zaki already has the throttle open before your feet hit the deck. Something smacks into the ship's side above you and whines away.\n\nThe searchlight comes on. The launch is already in the water: they had it ready, for afterwards.\n\n"The reef!" Zaki shouts. "She'll go over the shallows, that launch won't, if they don't see them coming. Put the lamp out when we cross!"`,
    choices: [{ text: 'Get to the bow. (the chase)', onSelect: () => c1cChase() }],
});

// ============================================================
// THE BOAT CHASE (minigame)
// ============================================================
MINIS.chase = {
    title: 'THE CHASE', keys: '◄► call the turns    SPACE: lamp on / off    ▲: net astern',
    howto: [
        'Get away from the ship\'s launch in the dark, through the reef.',
        ['◄ ►', 'Call the turns; Zaki steers. Keep off the coral heads, or the hull takes damage.'],
        ['SPACE', 'Your lamp on and off. On, you see the reef, but so do they, and the searchlight finds you faster. Off, you\'re harder to see, and they can hit the reef behind you.'],
        ['▲', 'Throw a net astern (three). If they run over it, it fouls their propeller.'],
        'Stay out of the searchlight beam: in it they gain on you and shoot. Last a minute and they give up.',
    ],
    start(o) {
        return { x: 0.5, tx: 0.5, hist: [], reefs: [], nets: [], netsLeft: 3, lamp: true, alarm: 0, hull: 1, gap: o.seen ? 100 : 130, stall: 0, spawn: 4, dist: 0, slow: 0, hit: 0, launch: { x: 0.5, dead: false }, deadT: 0, bursts: [], msg: o.seen ? 'They\'re close already! Lead them over the reef, with the lamp out.' : 'Lead them over the reef, with the lamp out, so they can\'t see it.', msgT: 4, fin: false, T: 0, flash: 0 };
    },
    update(S, dt, I, keys) {
        if (S.fin) return;
        const VW = Game.VW, VH = Game.VH; S.T += dt; S.msgT -= dt; S.flash = Math.max(0, S.flash - dt);
        if (keys.left) S.tx -= 0.55 * dt; if (keys.right) S.tx += 0.55 * dt; S.tx = Math.max(0.08, Math.min(0.92, S.tx));
        S.x += (S.tx - S.x) * Math.min(1, dt * 2.6);                                       // (Zaki follows your calls, a beat behind)
        if (I.ok) { S.lamp = !S.lamp; Sfx.tone(S.lamp ? 660 : 330, 0.05, 'square', 0.04); }
        if (I.up && S.netsLeft > 0) { S.netsLeft--; S.nets.push({ x: S.x, y: 0.62 }); Sfx.tone(240, 0.08, 'triangle', 0.05); }
        const v = (S.slow > 0 ? 0.11 : 0.19) * dt; S.slow -= dt; S.dist += v;                // the sea goes by (in screen heights)
        S.hist.push([S.T, S.x]); while (S.hist.length && S.hist[0][0] < S.T - 1.2) S.hist.shift();
        // the reef, coming at you out of the dark
        S.spawn -= dt;
        if (S.spawn <= 0) { const w = 0.16 + Math.random() * 0.22, h = 0.1 + Math.random() * 0.12, x = 0.08 + Math.random() * (0.84 - w), heads = []; for (let k = 0; k < 1 + (Math.random() * 3 | 0); k++) heads.push([x + 0.02 + Math.random() * (w - 0.04), Math.random() * h]); S.reefs.push({ x, w, y: -h, h, heads }); S.spawn = 1.1 + Math.random() * 1.1; }
        for (const r of S.reefs) r.y += v; S.reefs = S.reefs.filter(r => r.y < 1.2);
        for (const n of S.nets) n.y += v; S.nets = S.nets.filter(n => n.y < 1.4);
        // you, on the reef: a scrape over the shallows, a crash on a coral head
        const dy = 0.62; S.hit -= dt;
        const inReef = (r, x, y) => { const ex = (x - r.x - r.w / 2) / (r.w / 2), ey = (y - r.y - r.h / 2) / (r.h / 2); return ex * ex + ey * ey < 1; };
        for (const r of S.reefs) if (inReef(r, S.x, dy)) {
            S.slow = Math.max(S.slow, 0.25); S.hull -= 0.03 * dt;
            for (const [hx, hy] of r.heads) if (Math.abs(S.x - hx) < 0.025 && Math.abs(dy - (r.y + hy)) < 0.025 && S.hit <= 0) { S.hull -= 0.16; S.hit = 0.8; S.flash = 0.3; Sfx.tone(90, 0.2, 'square', 0.06); S.msg = 'Coral! The hull groans.'; S.msgT = 1.4; }
        }
        // the searchlight, from the ship astern
        const sa = -Math.PI / 2 + Math.sin(S.T * 0.75) * 0.55, bx = 0.5, by = 1.25, ang = Math.atan2(dy - by, S.x - bx);
        const inBeam = Math.abs(ang - sa) < (S.lamp ? 0.1 : 0.06);
        S.alarm = inBeam ? Math.min(1, S.alarm + (S.lamp ? 1.1 : 0.5) * dt) : Math.max(0, S.alarm - 0.25 * dt);
        S.beam = sa; S.inBeam = inBeam;
        // the launch, following your wake a second behind
        const L = S.launch;
        if (!L.dead) {
            const back = S.hist.length ? S.hist[0][1] : S.x; L.x += (back - L.x) * Math.min(1, dt * 3);
            if (S.stall > 0) { S.stall -= dt; S.gap += 26 * dt; } else S.gap -= (S.alarm > 0.3 ? 15 : 6) * dt;
            const ly = dy + S.gap / VH;
            for (const n of S.nets) if (!n.hit && Math.abs(n.x - L.x) < 0.05 && Math.abs(n.y - ly) < 0.03) { n.hit = true; S.stall = 3; S.msg = 'The net\'s round their propeller!'; S.msgT = 1.6; Sfx.get(); }
            for (const r of S.reefs) if (!r.dodged && inReef(r, L.x, ly)) {
                if (S.lamp) { r.dodged = true; S.gap += 12; S.msg = 'They see the reef in your lamplight, and swerve round it!'; S.msgT = 2; }   // (your lamp shows them the reef too)
                else { L.dead = true; S.deadT = 0; S.msg = 'In the dark, the launch hits the reef at full speed!'; S.msgT = 2.5; Sfx.tone(70, 0.4, 'sawtooth', 0.07); }
            }
            if (S.alarm > 0.45 && Math.random() < dt * 1.4) { S.bursts.push({ t: 0, x: L.x }); if (Math.random() < 0.5) { S.hull -= 0.05; S.flash = 0.2; } Sfx.tone(1200, 0.03, 'square', 0.03); }
            if (S.T > 60) { L.dead = true; S.deadT = 0; L.gaveUp = true; S.msg = 'Out of the searchlight\'s reach, into the dark. The launch slows, and turns back.'; S.msgT = 2.5; }
            if (S.gap < 22) { S.fin = true; Mini.finish({ lost: 'caught' }, 'The launch comes alongside out of the dark, and a man stands up in it with a rifle. Zaki throws the wheel over, too late.', 'CAUGHT'); return; }
        } else {
            S.deadT += dt;
            if (S.deadT > 1.6) { S.fin = true; Mini.finish({ won: true, hull: S.hull, gaveUp: !!L.gaveUp }, L.gaveUp ? 'The launch turns back towards the ship\'s lights. Someone in it stands up and empties a rifle after you into the dark, out of pure spite.' : 'Behind you the launch lies on the reef with its engine screaming and its propeller in the air. Someone in it stands up and empties a rifle after you into the dark, out of pure spite.', 'AWAY'); return; }
        }
        for (const b of S.bursts) b.t += dt; S.bursts = S.bursts.filter(b => b.t < 0.3);
        if (S.hull <= 0) { S.fin = true; Mini.finish({ lost: 'sunk' }, 'The Umm Kalthoum shudders and settles, the sea coming in over the coral\'s teeth. The searchlight finds you, and stays.', 'HOLED'); }
    },
    draw(S, g, A, VW, VH) {
        A.r(0, 0, VW, VH, '#0c1a34');
        for (let i = 0; i < 40; i++) { const x = Math.floor(hash2(i, 5) * VW), y = Math.floor(((hash2(5, i) + S.dist * 1.0) % 1) * VH); A.r(x, y, 3, 1, '#1c2c50'); }
        const dy = Math.round(0.62 * VH), dx = Math.round(S.x * VW), lit = (x, y) => S.lamp && Math.hypot(x - dx, y - dy) < 92;
        // the reef: plain to see in the lamp's light, a ghost of itself without it
        for (const r of S.reefs) {
            const rx = Math.round(r.x * VW), ry = Math.round(r.y * VH), rw = Math.round(r.w * VW), rh = Math.round(r.h * VH), near = lit(rx + rw / 2, ry + rh / 2);
            g.globalAlpha = near ? 0.95 : 0.32; const ecx = rx + (rw >> 1), ecy = ry + (rh >> 1);
            A.ell(ecx, ecy, rw >> 1, rh >> 1, '#1e6a7a'); A.ell(ecx, ecy, (rw >> 1) - 3, (rh >> 1) - 3, '#2a8a96'); A.ell(ecx - (rw >> 3), ecy - (rh >> 3), rw >> 3, rh >> 4, '#3a9aa6');
            for (const [hx, hy] of r.heads) { A.ell(Math.round(hx * VW), Math.round(ry + hy * VH), 4, 3, '#3a3e48'); A.px(Math.round(hx * VW) - 1, Math.round(ry + hy * VH) - 1, '#8a8a92'); }
            g.globalAlpha = 1;
        }
        for (const n of S.nets) { const x = Math.round(n.x * VW), y = Math.round(n.y * VH); g.globalAlpha = 0.8; for (let i = -6; i <= 6; i += 3) A.vl(x + i, y - 4, 8, '#3e8a58'); A.hl(x - 6, y, 13, '#3e8a58'); g.globalAlpha = 1; }
        // the lamp's pool of light
        if (S.lamp) { g.globalCompositeOperation = 'lighter'; for (const [r, a] of [[92, 0.06], [60, 0.08], [30, 0.1]]) { g.globalAlpha = a; A.ell(dx, dy, r, Math.round(r * 0.8), '#ffd890'); } g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
        // the dhow from above, her wake
        for (let k = 1; k < 6; k++) { A.r(dx - 3 - k * 2, dy + 14 + k * 5, 2, 2, '#4a6a90'); A.r(dx + 2 + k * 2, dy + 14 + k * 5, 2, 2, '#4a6a90'); }
        A.poly([[dx, dy - 16], [dx + 7, dy - 4], [dx + 6, dy + 13], [dx - 6, dy + 13], [dx - 7, dy - 4]], '#8e6a44'); A.poly([[dx, dy - 12], [dx + 5, dy - 3], [dx + 4, dy + 10], [dx - 4, dy + 10], [dx - 5, dy - 3]], '#c8a878');
        A.r(dx - 1, dy - 6, 3, 3, '#5a3e24'); A.r(dx - 3, dy + 4, 6, 4, '#3a3e48'); if (S.lamp) A.r(dx - 1, dy + 1, 2, 2, '#fff0b0');
        if (S.flash > 0) { g.globalAlpha = S.flash * 2; A.r(0, 0, VW, VH, '#ff4020'); g.globalAlpha = 1; }
        // the launch
        const L = S.launch, lx = Math.round(L.x * VW), ly = Math.round(dy + S.gap);
        if (ly < VH + 20) {
            if (!L.dead) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.12; A.poly([[lx, ly - 10], [lx - 24, ly - 70], [lx + 24, ly - 70]], '#fff8d0'); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; for (let k = 1; k < 5; k++) A.r(lx - 1, ly + 10 + k * 4, 3, 2, '#c8d8f0'); }
            A.poly([[lx, ly - 10], [lx + 6, ly], [lx + 5, ly + 10], [lx - 5, ly + 10], [lx - 6, ly]], L.dead ? '#5a6068' : '#c8ccd0'); A.r(lx - 2, ly - 1, 5, 4, '#3a3e48');
            for (const b of S.bursts) { A.r(lx - 1, ly - 14, 3, 3, '#fff0a0'); }
        }
        // the searchlight from the ship astern
        const bx = 0.5 * VW, by = 1.25 * VH, len = VH * 1.4;
        g.globalCompositeOperation = 'lighter'; g.globalAlpha = S.inBeam ? 0.26 : 0.14;
        A.poly([[bx, by], [bx + Math.cos(S.beam - 0.08) * len, by + Math.sin(S.beam - 0.08) * len], [bx + Math.cos(S.beam + 0.08) * len, by + Math.sin(S.beam + 0.08) * len]].map(q => [Math.round(q[0]), Math.round(q[1])]), S.inBeam ? '#ffb0a0' : '#f0f4ff');
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        // the meters
        const mx = 10, my = 30; miniBar(g, A, mx, my, 150, 'HULL', S.hull, null, S.hull < 0.35); miniBar(g, A, mx, my + 14, 150, 'SEEN', S.alarm, null, S.alarm > 0.45);
        miniBar(g, A, mx, my + 28, 150, 'LAUNCH', Math.max(0, Math.min(1, 1 - (S.gap - 22) / 120)), null, S.gap < 60);
        Txt.draw(g, 'NETS ' + S.netsLeft + '    LAMP ' + (S.lamp ? 'ON' : 'OFF'), mx, my + 44, { col: '#c8d0f0' });
        if (S.msgT > 0) Txt.draw(g, S.msg, VW >> 1, VH - 30, { col: '#ffe890', shadow: '#101838', align: 'center' });
    },
};
function c1cChase() {
    playMinigame('chase', { seen: !!sflag('c1c_ship_seen') }, r => {
        if (r.won) { sflag('c1c_chase_hull', Math.round((r.hull || 0) * 100)); c1cBackOnDeck('c1c_shot'); return; }
        startDialogue(r.left ? 'c1c_chase_again' : 'c1c_chase_again');
    });
}
scene('c1c_chase_again', { speaker: 'System', text: `No. Not like that. Again: the lamp, the reef, the light. Think like Zaki. Think like the reef.`, choices: [{ text: 'Try again.', onSelect: () => c1cChase() }] });
function c1cBackOnDeck(next) {
    Game.fadeTo(() => {
        const room = Game.maps.INT_DHOW || (Game.maps.INT_DHOW = buildRoom('INT_DHOW', window.POKE_MAP, [0, 0])), p = Game.player;
        p.x = room.pw * 0.55; p.y = room.ph - 60; p.dir = DIR.up; Game.enter(room); clockAdvance(15); if (Game.set.time === 5) Game.hour = storyHour();
        startDialogue(next);
    });
}

// ============================================================
// ZAKI
// ============================================================
scene('c1c_shot', {
    speaker: 'System',
    text: `You're clear. The searchlight is a pinprick behind you, the launch a dying scream on the reef. You turn round to laugh with Zaki.\n\nZaki is sitting down against the wheel, very carefully, the way old men sit. There's something black spreading on his shirt below the shoulder, shining in the moonlight. One of those last shots.\n\n"Habibi," he says, surprised. "I think they've made a hole in me."\n\nThe Umm Kalthoum runs on, untended, towards the dark.`,
    choices: [
        { text: 'Stop the boat. Save him. (first aid)', onSelect: () => c1cFirstAid() },
        { text: 'Take the wheel. Keep running: get as far as you can first.', nextScene: 'c1c_run' },
    ],
});
function c1cFirstAid() {
    playMinigame('firstaid', {}, r => {
        if (r.left || !r.ok) { startDialogue('c1c_aid_again'); return; }
        sflag('ch1c_zaki_saved', true); rel('zaki', 20); skillXP('firstAid', 60, 'Zaki');
        startDialogue('c1c_saved');
    });
}
scene('c1c_aid_again', { speaker: 'Captain Zaki', text: `Zaki's eyes are closing. "Habibi," he says, from a long way off. "Harder. Press harder."`, choices: [{ text: 'Again.', onSelect: () => c1cFirstAid() }] });
scene('c1c_saved', {
    speaker: 'Captain Zaki',
    text: `The dhow drifts, engine idling, while you work. When you look up at last, your hands black to the wrist, the ship has gone: her lights are nowhere on the whole flat sea. You've lost her. You don't care.\n\nZaki is grey, and breathing, and bandaged with the tin first-aid kit's last roll and a strip of your shirt. He opens his eyes.\n\n"You stopped," he says. "Fool." He finds your hand and holds it, hard. "Thank you, habibi. Now take me home before my wife hears about this from the fish."`,
    choices: [{ text: 'Take the wheel. Home.', onSelect: () => c1cHome() }],
});
scene('c1c_run', {
    speaker: 'Captain Zaki',
    text: `You pull him aside, take the wheel and open the throttle wide, and the Umm Kalthoum runs north along the reef with everything she has. You don't look back. You don't look down.\n\nWhen you finally ease off, an hour later, with the lights of Marsa Tarfa ahead, Zaki is still alive. He's tied his own shoulder up with his headscarf and his teeth. He's propped against the gunwale, grey as ash, watching you.\n\n"You kept going," he says. Not angry. Worse than angry. "I'd have stopped for you."`,
    choices: [{ text: '"They\'d have caught us, Zaki."', onSelect: () => { sflag('ch1c_zaki_saved', false); rel('zaki', -30); c1cHome(); } }],
});

// ============================================================
// THE FIRST AID MINIGAME
// Find the wound (◄►▲▼, SPACE), press on it (hold SPACE, keep the pressure in the band), bind it
// (the arrows, in order). His blood drains all the while.  → { ok, blood } · { ok: false } · { left }
// ============================================================
MINIS.firstaid = {
    title: 'FIRST AID', keys: 'find: ◄►▲▼, SPACE    press: hold SPACE    bind: the arrows',
    howto: [
        'Zaki is bleeding. Three steps, quickly: he loses blood the whole time.',
        ['FIND', '◄►▲▼ to move over him, SPACE where the wound is.'],
        ['PRESS', 'Hold SPACE to press. Keep the pressure inside the band, not too light and not too hard.'],
        ['BIND', 'Press the arrows in the order shown to tie the bandage.'],
    ],
    start() { const R = Math.random; return { ph: 'find', blood: 1, cx: 0.5, cy: 0.3, wx: 0.36 + R() * 0.08, wy: 0.42 + R() * 0.06, pr: 0, prog: 0, seq: [0, 1, 2, 3, 0, 2].map(() => Math.floor(R() * 4)), si: 0, msg: 'Find where it went in. Under the shirt, below the shoulder.', fin: false, wrong: 0 }; },
    update(S, dt, I, keys) {
        if (S.fin) return;
        S.blood -= 0.035 * dt; S.wrong = Math.max(0, S.wrong - dt);
        if (S.ph === 'find') {
            S.cx += ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * 0.35 * dt; S.cy += ((keys.down ? 1 : 0) - (keys.up ? 1 : 0)) * 0.35 * dt;
            S.cx = Math.max(0.1, Math.min(0.9, S.cx)); S.cy = Math.max(0.1, Math.min(0.9, S.cy));
            if (I.ok) { if (Math.hypot(S.cx - S.wx, S.cy - S.wy) < 0.06) { S.ph = 'press'; S.msg = 'Press. Hold SPACE: hard enough to stop it, not so hard he passes out.'; Sfx.tone(660, 0.05, 'triangle', 0.05); } else { S.blood -= 0.04; S.wrong = 0.4; S.msg = 'Not there. Where the shirt is wettest.'; } }
        } else if (S.ph === 'press') {
            S.pr += (keys.act ? 0.8 : -0.65) * dt; S.pr = Math.max(0, Math.min(1, S.pr));
            if (S.pr > 0.52 && S.pr < 0.8) S.prog += dt / 5; else S.blood -= 0.05 * dt;
            if (S.prog >= 1) { S.ph = 'bind'; S.msg = 'Bind it: round and round, tight. The arrows, in order.'; }
        } else if (S.ph === 'bind') {
            const k = I.left ? 0 : I.up ? 1 : I.right ? 2 : I.down ? 3 : -1;
            if (k >= 0) { if (k === S.seq[S.si]) { S.si++; Sfx.tone(520 + S.si * 60, 0.04, 'triangle', 0.05); } else { S.blood -= 0.05; S.wrong = 0.4; Sfx.tone(160, 0.06, 'square', 0.04); } }
            if (S.si >= S.seq.length) { S.fin = true; Mini.finish({ ok: true, blood: S.blood }, 'The bandage holds. The bleeding slows, and stops. Under your hand, his heart goes on, stubborn as his engine.', 'HE\'S BREATHING'); return; }
        }
        if (S.blood <= 0) { S.fin = true; Mini.finish({ ok: false }, 'His eyes roll up. No. No, not like this.', 'NOT YET'); }
    },
    draw(S, g, A, VW, VH) {
        const w = 240, h = 170, x0 = (VW - w) >> 1, y0 = 42;
        A.r(x0 - 4, y0 - 4, w + 8, h + 8, '#5a3e24'); A.r(x0, y0, w, h, '#a8845c'); for (let y = y0; y < y0 + h; y += 9) A.hl(x0, y, w, '#8e6a44');   // the deck
        // Zaki, lying on his back
        const zx = x0 + w / 2, zy = y0 + h / 2;
        A.soft(zx - 90, zy - 30, 190, 64, '#000000', 0.18);
        A.r(zx + 34, zy - 17, 58, 15, '#c8bc9c'); A.r(zx + 34, zy + 2, 58, 15, '#b8ac8c'); A.hl(zx + 34, zy - 17, 58, '#dcd0b0');               // his legs, in old linen trousers
        A.r(zx + 92, zy - 16, 9, 12, '#5c3418'); A.r(zx + 92, zy + 4, 9, 12, '#5c3418'); A.r(zx + 94, zy - 14, 6, 8, '#c08a5a'); A.r(zx + 94, zy + 6, 6, 8, '#c08a5a');   // sandals, feet
        A.ell(zx - 8, zy, 44, 26, '#5a7aa0'); A.ell(zx - 10, zy - 2, 42, 23, '#7a9ac0'); A.ell(zx - 18, zy - 8, 20, 9, '#9ab8d8');               // his chest, the blue shirt
        A.vl(zx - 8, zy - 20, 40, '#5a7aa0'); for (let k = 0; k < 4; k++) A.px(zx - 6, zy - 14 + k * 9, '#f4f4f0');                            // buttons
        A.r(zx - 40, zy - 40, 56, 11, '#7a9ac0'); A.r(zx - 40, zy + 29, 56, 11, '#6a8ab0'); A.ell(zx + 20, zy - 35, 6, 5, '#c08a5a'); A.ell(zx + 20, zy + 35, 6, 5, '#c08a5a');   // his arms, his hands
        A.ell(zx - 66, zy, 15, 14, '#c08a5a'); A.ell(zx - 70, zy - 3, 9, 4, '#a87048');                                                          // his head
        A.ell(zx - 76, zy, 9, 15, '#f4f4f0'); A.ell(zx - 77, zy - 2, 6, 11, '#ffffff');                                                          // the white cap, fallen back
        A.ell(zx - 54, zy, 8, 11, '#e8e8e0'); A.px(zx - 64, zy - 5, '#20242c'); A.px(zx - 64, zy + 5, '#20242c'); A.r(zx - 60, zy - 3, 2, 6, '#8a5a3a');   // the white beard, the closed eyes
        const sx = x0 + S.wx * w, sy = y0 + S.wy * h, stain = 6 + (1 - S.blood) * 16;
        A.ell(Math.round(sx), Math.round(sy), Math.round(stain), Math.round(stain * 0.8), '#3a1a1a'); A.ell(Math.round(sx), Math.round(sy), Math.round(stain * 0.6), Math.round(stain * 0.5), '#5a1a1a');
        if (S.ph === 'find') { const cx = Math.round(x0 + S.cx * w), cy = Math.round(y0 + S.cy * h); A.r(cx - 6, cy, 13, 1, S.wrong ? '#ff6050' : '#ffffff'); A.r(cx, cy - 6, 1, 13, S.wrong ? '#ff6050' : '#ffffff'); }
        else { A.ell(Math.round(sx), Math.round(sy), 9, 7, '#e8dcc0'); A.ell(Math.round(sx), Math.round(sy), 6, 4, '#d8c8a8'); }   // your hands, the pad
        if (S.ph === 'bind') for (let k = 0; k < S.si; k++) A.r(Math.round(sx) - 12, Math.round(sy) - 8 + k * 3, 24, 2, '#f4f4f0');
        // the meters
        miniBar(g, A, x0, y0 + h + 10, w, 'BLOOD', S.blood, null, S.blood < 0.35);
        if (S.ph === 'press') { miniBar(g, A, x0, y0 + h + 24, w, 'PRESS', S.pr, [0.52, 0.8]); miniBar(g, A, x0, y0 + h + 38, w, 'HOLDING', S.prog); }
        if (S.ph === 'bind') { const ar = ['◄', '▲', '►', '▼']; S.seq.forEach((k, i) => Txt.draw(g, ar[k], x0 + 40 + i * 28, y0 + h + 28, { col: i < S.si ? '#60c060' : i === S.si ? '#ffe890' : '#8898d0', align: 'center' })); }
        Txt.draw(g, S.msg, VW >> 1, 26, { col: '#ffe890', shadow: '#101838', align: 'center' });
    },
};

// ============================================================
// HOME
// ============================================================
function c1cHome() {
    sflag('c1c_ship_done', true); taskDone('c1c_ship');
    storyNote('Captain Zaki', sflag('ch1c_zaki_saved') ? 'Shot below the shoulder in the escape. You stopped the boat and the bleeding, and lost the ship. "You stopped. Fool. Thank you, habibi."' : 'Shot below the shoulder in the escape. You kept running. He lived, just, and tied it up himself. "I\'d have stopped for you."');
    Game.fadeTo(() => {
        const m = Game.maps.ch1, d = m.ents.find(e => e.id === 'c1c_dhow'), z = m.ents.find(e => e.id === 'c1c_zaki'), p = Game.player;
        if (d && d.home) { d.x = d.home[0]; d.y = d.home[1]; }
        if (d) { d.gone = false; d.sortY = d.y + d.d; World.setSolid(m, d, true); }
        if (z) { z.gone = true; }                                        // (Zaki is below, on a mattress of nets)
        sflag('c1c_at_sea', false);
        p.x = (d ? d.x : 56 * TILE) - 20; p.y = (d ? d.y + d.d : 27 * TILE) + 10; p.dir = DIR.left;
        Game.enter(m); clockAdvance(Math.max(10, 25 * 60 + 30 - Story.s.clock)); if (Game.set.time === 5) Game.hour = storyHour();
        task('c1c_shore', 'Back in Marsa Tarfa, with the Codex, a tracker blinking in your pocket, and Bassem\'s debt. Think.');
        startDialogue('c1c_home');
    });
}
scene('c1c_home', {
    speaker: 'System',
    text: () => `Half past one in the morning. The Umm Kalthoum creeps back in past the breakwater with no lights and a hole in her hull above the waterline, and Zaki ${sflag('ch1c_zaki_saved') ? 'asleep below on a mattress of nets, breathing slow and even' : 'below on a mattress of nets, awake, saying nothing'}.\n\nThe harbour is asleep. The lighthouse turns. In your bag: a book older than anything you've ever touched, a note that says please, and a little green light, blinking, telling someone exactly where you are.`,
    choices: [{ text: 'Step onto the quay.' }],
});

// ---- the hooks ----
(function () {
    const A = AREAS.fixer, _frame = A.frame, _over = A.overlay;
    A.frame = function (dt) { _frame.call(this, dt); Ship.frame(dt); };
    A.overlay = function (g, cx, cy) { if (_over) _over.call(this, g, cx, cy); Ship.draw(g, cx, cy); };
    const _watch = A.watch; A.watch = function () { return sflag('c1c_ship_done') && !sflag('c1c_at_sea') ? ' Wednesday, very early. Back on shore.' : _watch.call(this); };
})();
scene('c1c_zaki_deck3', { speaker: 'Captain Zaki', text: `Zaki is below, on the nets.`, choices: [{ text: 'Let him sleep.' }] });
TASK_TARGETS.c1c_listen = () => ({ room: 'INT_SHIP', id: 'c1c_captain', out: 'c1c_dhow' });
TASK_TARGETS.c1c_flee = () => ({ room: 'INT_SHIP', id: 'c1c_ladder', out: 'c1c_dhow' });
TASK_TARGETS.c1c_shore = () => 'c1c_dhow';
