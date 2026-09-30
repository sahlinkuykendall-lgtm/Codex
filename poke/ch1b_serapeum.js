// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE SERAPEUM AT NIGHT (poke/ch1b_serapeum.js)
// Chapter 1-B, beat 4. Karim said: "Out of your locker, into the service
// room. My man comes after midnight." So be there first.
//   - wait for night on the bench at the ghaffir's hut (the task says so)
//   - after eleven, the old ghaffir lets you in by the tourist gate and sees
//     nothing; his son does the night rounds inside, with a lantern and a big mouth
//   - the galleries: long, dark, the granite bull sarcophagi in their chambers.
//     Keep out of the night ghaffir's lantern (the view cones from the tail) and
//     get to the service room at the far end
//   - hide behind the pump or the bench: Samy comes in by the service door with a
//     torch, puts a cooler bag in the steel cabinet, looks round and goes
//   - in the bag: the Codex. Get out unseen. Outside, headlights: a black car at
//     the inspectorate, past midnight on a Tuesday (beat 5, the next step)
// ============================================================

LOOKS.nightghaf = { skin: 4, robe: ['#4a5060', '#363c4a', '#262a34'], head: 'keffiyeh', headCol: ['#e8e0cc', '#c8c0aa', '#a8a08a'], face: 'tache', tache: '#2a2020', shoeKind: 'sandals', shoe: '#5c3418' };
const SER = { CY0: 168, CY1: 252 };                          // the main gallery runs east–west between these
const serOn = () => Story.s.tasks.some(t => (t.id === 'c1b_night' || t.id === 'c1b_out') && !t.done);
const nightNow = () => Story.s.clock >= clockAt(23);

// ---- waiting for night ----
STORY_SCRIPTS.c1b_ghafhut = 'c1b_hut';
scene('c1b_hut', {
    speaker: 'System',
    text: () => `The ghaffir's hut: mud brick, a lean-to of palm fronds, a bench along the wall, a kettle. The man who guards the Serapeum has guarded it since before you were born. It is ${clockStr()}.` +
        (tailDoneNightTask() && !nightNow() ? `\n\nKarim's man comes after midnight, and Samy before him. This bench is as good a place as any to wait for the dark. (Eat and drink first: it's a long wait.)` : ''),
    get choices() {
        const c = [], s = Story.s;
        if (tailDoneNightTask() && !nightNow()) c.push({ text: 'Wait on the bench until eleven at night.', onSelect: () => c1aRest(clockAt(23) - s.clock, 'c1b_hut_dark') });
        if (s.clock < CLOCK_END) c.push({ text: 'Rest a while. (an hour passes)', onSelect: () => c1aRest(60, 'c1a_rested') });
        c.push({ text: 'Get up.' });
        return c;
    },
});
const tailDoneNightTask = () => Story.s.tasks.some(t => t.id === 'c1b_night' && !t.done);
scene('c1b_hut_dark', { speaker: 'System', text: () => `The ghaffir brings you tea without being asked and doesn't ask why you're here. The tourists go, the hawkers go, the sun goes down behind the desert and the Step Pyramid turns from gold to grey to black. Dogs start up in Mit Rahina. It is ${clockStr()}.`, choices: [{ text: 'Get up.' }] });

// ---- the gate ----
STORY_SCRIPTS.c1b_serapeum = () => !serOn() ? null : sflag('c1b_codex') ? 'c1b_ser_done' : nightNow() ? 'c1b_ser_gate' : 'c1b_ser_early';
scene('c1b_ser_early', {
    speaker: 'System',
    text: () => `The Serapeum's gate, at ${clockStr()}. Tourists are still coming up the steps, and the ghaffir is still pretending to be busy.\n\nSamy won't come in daylight, and Karim's man comes after midnight. Wait for the dark: the bench at the ghaffir's hut will do.`,
    choices: [{ text: 'Wait on the bench until eleven.', onSelect: () => c1aRest(clockAt(23) - Story.s.clock, 'c1b_hut_dark') }, { text: 'Not yet.' }],
});
scene('c1b_ser_gate', {
    speaker: 'The Ghaffir',
    text: `The old ghaffir is sitting by the gate in the dark, his radio off, listening. He sees your key ring and gets up slowly.\n\n"Inspector. At this hour." He doesn't ask. He unlocks the gate and swings it open on its greased hinges.\n\n"My son does the night rounds down there. He has good ears and a very big mouth." He sits down again and closes his eyes. "I, on the other hand, am old, and asleep."`,
    choices: [{ text: 'Go down the steps.', onSelect: () => serGoIn() }, { text: 'Not yet.' }],
});
scene('c1b_ser_done', { speaker: 'System', text: `The Serapeum's gate. You've been down there once tonight. Once is enough.`, choices: [{ text: 'Move on.' }] });
function serGoIn() {
    const e = Game.maps.ch1.ents.find(q => q.id === 'c1b_serapeum'); if (!e) return;
    Game.goInside({ x: e.x + e.w / 2 - 16, y: e.y + e.d + 4, w: 32, h: 14, to: 'INT_SERAPEUM', label: 'The Serapeum' });
}

// ---- the galleries ----
function apisBox(k) {                                        // a granite box heavier than a house: polished lid, niched sides, one lid pushed aside by robbers
    const P = k % 2 ? ['#c8b4b0', '#a89090', '#806c70', '#56464c'] : ['#a0a0ae', '#80808e', '#62626e', '#40404a'];
    const st = stage(84, 44, 40), { A } = st, x = st.x, y = st.y - 38;
    A.r(x, y + 12, 84, 58, P[1]); A.r(x, y + 12, 84, 3, P[0]); A.vl(x + 83, y + 12, 58, P[3]);                                 // the box
    for (let i = 6; i < 80; i += 11) { A.r(x + i, y + 22, 7, 40, P[2]); A.vl(x + i, y + 22, 40, P[3]); A.vl(x + i + 6, y + 22, 40, P[0]); }   // the palace-facade niches
    if (k === 1) for (let i = 4; i < 80; i += 5) { A.r(x + i, y + 16, 3, 3, '#c8b890'); A.px(x + i + 1, y + 17, P[2]); }         // a band of hieroglyphs, picked out
    const lx = k === 2 ? 14 : 0, ly = k === 2 ? -4 : 0;
    A.r(x + lx, y + ly, 84, 14, P[0]); A.hl(x + lx, y + ly, 84, '#ffffff'); A.r(x + lx, y + ly + 12, 84, 2, P[2]);                 // the lid
    if (k === 2) { A.r(x, y + 12, 14, 6, '#0c0a0e'); A.r(x + 2, y + 13, 10, 4, '#1c1818'); }                                   // pushed aside: the black gap
    for (let i = 0; i < 12; i++) A.px(x + 4 + hash2(i, k) * 76 | 0, y + 3 + hash2(k, i) * 8 | 0, '#d8d4dc');                   // the granite's sparkle
    return fit(st, { solid: [0, 0, 84, 44] });
}
function serPump() {                                         // the pumps that keep the galleries dry: two green motors, pipes, a gauge
    const st = stage(64, 36, 34), { A } = st, x = st.x, y = st.y - 32;
    A.r(x, y + 44, 64, 24, '#5a6068'); A.hl(x, y + 44, 64, '#8a9098');                                                          // the plinth
    for (const mx of [x + 4, x + 34]) { A.r(mx, y + 18, 26, 26, '#3e7a58'); A.r(mx, y + 18, 26, 3, '#6cae84'); A.vl(mx + 25, y + 18, 26, '#2a5a3e'); A.ell(mx + 13, y + 31, 7, 7, '#2a5a3e'); A.ell(mx + 13, y + 31, 3, 3, '#8a9098'); }
    A.r(x + 10, y + 2, 5, 18, '#86949e'); A.r(x + 44, y + 2, 5, 18, '#86949e'); A.r(x + 10, y, 39, 5, '#86949e'); A.hl(x + 10, y, 39, '#c8ccd0');   // the pipes
    A.ell(x + 30, y + 10, 5, 5, '#f4f4f0'); A.ell(x + 30, y + 10, 4, 4, '#ffffff'); A.line(x + 30, y + 10, x + 32, y + 7, '#d04838');     // a gauge
    return fit(st, { solid: [0, 4, 64, 32] });
}
function serCabinet(open) {                                  // an engineers' steel cabinet, padlocked
    const st = stage(34, 16, 44), { A } = st, x = st.x, y = st.y - 42;
    A.r(x, y, 34, 10, '#8a9098'); A.r(x, y + 10, 34, 48, '#6a747e'); A.vl(x + 17, y + 10, 48, '#4a525c'); A.vl(x + 33, y + 10, 48, '#4a525c'); A.hl(x, y + 10, 34, '#a8b0b8');
    for (let j = 0; j < 3; j++) A.r(x + 4, y + 14 + j * 3, 9, 1, '#4a525c');
    A.r(x + 15, y + 30, 5, 6, '#c89020'); A.px(x + 16, y + 30, '#ffe890');
    A.r(x + 1, y + 58, 4, 2, '#2a2e36'); A.r(x + 29, y + 58, 4, 2, '#2a2e36');
    return fit(st, { solid: [0, 0, 34, 16] });
}
function serBench() {                                        // a workbench, a vice, a coil of hose under it: good to hide behind
    const st = stage(64, 20, 20), { A } = st, x = st.x, y = st.y - 18;
    A.r(x, y, 64, 8, '#8e5e32'); A.hl(x, y, 64, '#b8844c'); A.r(x + 2, y + 8, 4, 30, '#5e3620'); A.r(x + 58, y + 8, 4, 30, '#5e3620');
    A.r(x + 6, y + 18, 52, 20, '#2a2420'); A.ell(x + 24, y + 30, 12, 6, '#2a4a38'); A.ell(x + 24, y + 30, 7, 3, '#1c1814');       // the hose, in the dark underneath
    A.r(x + 46, y - 6, 10, 6, '#5a6272'); A.r(x + 50, y - 9, 2, 3, '#86949e'); A.r(x + 10, y - 2, 12, 2, '#c8ccd0'); A.r(x + 26, y - 3, 6, 3, '#d04838');
    return fit(st, { solid: [0, 0, 64, 20] });
}
ROOMS.INT_SERAPEUM = {
    name: 'THE SERAPEUM · THE GALLERIES', tw: 26, th: 12, style: 'rock',
    enter: ['System', 'Down the steps and through the gate, into the dark. The Serapeum: galleries cut into the rock of the desert, and off them, in chambers of their own, the great granite coffins of the Apis bulls, each heavier than a house. The air is cold and still and smells of stone.\n\nFar off down the gallery, a lantern swings. The night ghaffir, on his rounds.'],
    build({ map, A, put, pw, ph, W }) {
        const E = ROOM.EDGE, { CY0, CY1 } = SER, SX = pw - 160, R = PAL.rock;
        // the main gallery's floor, worn smooth down the middle
        A.r(E, CY0, SX - E, CY1 - CY0, R[1]); for (let x = E; x < SX; x += 40) A.vl(x, CY0, CY1 - CY0, R[2]); A.hl(E, CY0, SX - E, R[3]); A.hl(E, CY1 - 1, SX - E, R[3]);
        A.r(E, CY0 + 30, SX - E, 24, R[0]); for (let i = 0; i < 60; i++) A.px(E + hash2(i, 91) * (SX - E) | 0, CY0 + 30 + hash2(91, i) * 24 | 0, R[1]);
        // rock between the chambers, north and south of the gallery (solid)
        const mass = (x0, y0, x1, y1, north) => {
            A.r(x0, y0, x1 - x0, y1 - y0, R[3]); for (let j = y0 + 7; j < y1 - 4; j += 9) A.hl(x0, j, x1 - x0, R[4]);
            if (north) { A.r(x0, y1 - 12, x1 - x0, 12, R[1]); A.hl(x0, y1 - 12, x1 - x0, R[0]); A.hl(x0, y1 - 1, x1 - x0, R[4]); }  // its face, toward the gallery
            else { A.r(x0, y0, x1 - x0, 5, R[2]); A.hl(x0, y0, x1 - x0, R[4]); }
            World.addSolid(map, x0, y0, x1 - x0, y1 - y0);
        };
        const cols = [[E, 40], [152, 200], [312, 360], [472, 520], [632, SX]];
        for (const [x0, x1] of cols) { mass(x0, W, x1, CY0, true); mass(x0, CY1, x1, ph - E, false); }
        // the chambers: a bull's coffin in each (the south one in the middle is the way in)
        const SAYS = [
            'A granite sarcophagus in its chamber: one block, polished like glass, carved with the niched front of a palace. Sixty tonnes, seventy, nobody is sure. Nobody knows how they got it down here, either.',
            'This one is carved with a band of hieroglyphs round the lid: the name of a king, Amasis, and the words "for the living Apis". Mariette found the galleries in 1850 and every coffin but one already robbed.',
            'The lid of this one is pushed aside, just enough for a thin man with a lamp. Robbers, two thousand years ago. Inside, the dark goes down further than it should.',
            'A sarcophagus of black granite, plain, perfect. Your torch slides over it like water. The Apis bull inside was a god for twenty years and a mummy for two thousand, and then the robbers came.',
            'A granite coffin in a chamber cut just big enough for it. There\'s a thumb\'s width between the box and the rock on every side.',
            'The last coffin before the service room. Someone has stuck a Ministry inventory tag to its plinth with chewing gum: SER/24. Samy\'s round handwriting.',
        ];
        let k = 0;
        for (const [cx0, cx1] of [[40, 152], [200, 312], [360, 472], [520, 632]]) {
            const mx = (cx0 + cx1) >> 1;
            put(mx - 42, W + 40, apisBox(k % 3), null, { label: 'Apis Sarcophagus', say: ['System', SAYS[k]] }); k++;
            if (cx0 !== 360) { put(mx - 42, CY1 + 44, apisBox((k + 1) % 3), null, { label: 'Apis Sarcophagus', say: ['System', SAYS[k]] }); k++; }
        }
        // the way in: stone steps up to the gate, over the shell's ladder
        const dx = (pw >> 1) - 22; A.r(dx - 6, ph - E - 44, 56, 44 + E, R[2]); for (let j = ph - E - 40; j < ph; j += 7) { A.r(dx - 6, j, 56, 5, R[1]); A.hl(dx - 6, j, 56, R[0]); A.hl(dx - 6, j + 5, 56, R[3]); }
        A.poly([[dx + 22, ph - E - 50], [dx + 16, ph - E - 44], [dx + 28, ph - E - 44]], PAL.gold[0]);
        // the service room at the east end: concrete, a masonry wall with the gallery running into it
        A.r(SX + 16, W, pw - E - SX - 16, ph - E - W, '#8a8478'); for (let y = W + 40; y < ph; y += 48) A.hl(SX + 16, y, pw - E - SX - 16, '#6e6860');
        for (const [y0, y1] of [[W, CY0], [CY1, ph - E]]) { A.r(SX, y0, 16, y1 - y0, '#a89c88'); for (let j = y0 + 4; j < y1; j += 8) { A.hl(SX, j, 16, '#8a7e6a'); A.vl(SX + ((j >> 3) & 1) * 8, j, 8, '#8a7e6a'); } A.vl(SX + 15, y0, y1 - y0, '#6e6250'); World.addSolid(map, SX, y0, 16, y1 - y0); }
        // its back wall: pipes, and the steel service door up to the cliff (Samy's way in)
        A.r(SX + 16, 0, pw - E - SX - 16, W, '#9a9488'); A.r(SX + 16, 0, pw - E - SX - 16, 5, '#6e6860'); A.r(SX + 16, W - 6, pw - E - SX - 16, 6, '#5a5448');
        A.r(SX + 20, 14, pw - E - SX - 24, 4, '#86949e'); A.hl(SX + 20, 14, pw - E - SX - 24, '#c8ccd0'); A.r(SX + 20, 24, pw - E - SX - 24, 3, '#5a6272');
        const sdx = SX + 26; A.r(sdx - 2, 8, 32, W - 8, '#3e4650'); A.r(sdx, 10, 28, W - 10, '#5a6272'); A.vl(sdx + 1, 10, W - 10, '#86949e'); for (let j = 18; j < W; j += 10) A.hl(sdx + 2, j, 24, '#4a525c'); A.r(sdx + 22, 30, 3, 6, '#c89020');
        map.samyDoor = [sdx + 14, W + 6];
        put(SX + 50, W + 56, serPump(), null, { label: 'Pumps', say: ['System', 'The pumps that keep the galleries dry, humming to themselves in the dark. The water table has been rising under Saqqara for years. The engineers come once a month. The engineers haven\'t come since Ramadan.'] });
        put(SX + 42, ph - 92, serBench(), null, { label: 'Workbench', say: ['System', 'The engineers\' workbench: a vice, a coil of hose underneath, a spanner, a red torch with a dead battery. Room to crouch behind it, if you had to.'] });
        put(pw - 50, W + 4, serCabinet(), 'c1b_cabinet', { label: 'Steel Cabinet' });
        // emergency lights, dim and far apart
        for (const [lx, ly] of [[176, CY0 - 14], [496, CY0 - 14], [336, CY1 + 4], [SX + 60, 18]]) { A.r(lx - 3, ly - 3, 7, 5, '#3e4650'); A.r(lx - 2, ly - 2, 5, 3, '#ffb070'); map.ents.push({ x: lx, y: ly, w: 0, d: 0, sortY: 0, light: { x: 0, y: 0, r: 46, c: '#ff9a60' } }); }
        // the night ghaffir
        const g = World.addEnt(map, { x: 100, y: 214, w: 0, d: 0, id: 'c1b_nightghaf', label: 'Night Ghaffir', person: { sheet: personSheet(LOOKS.nightghaf), dir: DIR.right, frame: 0 }, sortY: 214, light: { x: 6, y: -14, r: 70, c: '#ffd080', flicker: true } });
        map.people.push(g);
    },
};

// ---- who's watching: the night ghaffir's lantern, Samy's torch ----
const GHAF_ROUTE = [[100, 212], [256, 210, 'look', -1], [416, 212, 'look', 1], [576, 210, 'look', -1], [650, 212, 'turn'], [576, 214, 'look', 1], [416, 212, 'look', -1], [256, 214, 'look', 1], [100, 212, 'turn']];
const Ser = {
    map: null, ghaf: null, samy: null, gi: 1, gphase: 'walk', gt: 0, gface: 0, sface: 0, sstate: 'none', st: 0, sus: 0, seeing: null, told: false,
    sees(w, a, range, half) {                                    // (the same rules as the tail: poke/ch1b_tail.js)
        const p = Game.player, m = Game.map, dx = p.x - w.x, dy = p.y - w.y, d = Math.hypot(dx, dy);
        if (d > range) return 0; if (d < 6) return 1.2;
        let da = Math.atan2(dy, dx) - a; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
        if (Math.abs(da) > half) return 0;
        for (let t = 10; t < d - 8; t += 6) if (World.blocked(m, w.x + dx * t / d - 2, w.y - 4 + dy * t / d - 2, 4, 4)) return 0;
        return 1.25 - d / range * 0.75;
    },
    cones() {
        const c = [];
        if (this.ghaf && !this.ghaf.gone) c.push([this.ghaf, this.gface, 4.6 * TILE, 0.55, 'ghaf']);
        if (this.samy && !this.samy.gone && this.sstate !== 'wait') c.push([this.samy, this.sface, 5.2 * TILE, 0.5, 'samy']);
        return c;
    },
    dirOf(a) { const dx = Math.cos(a), dy = Math.sin(a); return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? DIR.left : DIR.right) : (dy < 0 ? DIR.up : DIR.down); },
    step(e, tx, ty, v, dt) { const dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy); if (d < 2) return true; const s = Math.min(d, v * dt); e.x += dx / d * s; e.y += dy / d * s; e.sortY = e.y; e.person.dir = this.dirOf(Math.atan2(dy, dx)); e.person.anim = (e.person.anim || 0) + s / 13; e.person.frame = [1, 0, 2, 0][Math.floor(e.person.anim) % 4]; return false; },
    // coming in: the patrol starts from the west end, Samy isn't here yet
    enter(m) {
        this.map = m; this.ghaf = m.ents.find(e => e.id === 'c1b_nightghaf'); this.resetGhaf();
        if (this.samy) this.samy.gone = true; this.sstate = sflag('c1b_bag_in') || sflag('c1b_codex') ? 'done' : 'none'; this.sus = 0; this.told = false;
    },
    resetGhaf() { const g = this.ghaf; if (!g) return; g.x = 100; g.y = 212; g.sortY = 212; this.gi = 1; this.gphase = 'walk'; this.gt = 0; this.gface = 0; },
    frame(dt) {
        const m = Game.map; if (m.key !== 'INT_SERAPEUM') return;
        if (this.map !== m) this.enter(m);
        const p = Game.player, SX = m.pw - 160, g = this.ghaf;
        // the patrol
        if (g) {
            const R = GHAF_ROUTE[this.gi];
            if (this.gphase === 'walk') { if (this.step(g, R[0], R[1], 34, dt)) { if (R[2]) { this.gphase = R[2]; this.gt = 0; g.person.frame = 0; } else this.gi = (this.gi + 1) % GHAF_ROUTE.length; } else this.gface = Math.atan2(R[1] - g.y, R[0] - g.x); }
            else { this.gt += dt; if (this.gphase === 'look') { this.gface = R[3] * Math.PI / 2 + Math.sin(this.gt * 1.8) * 0.4; g.person.dir = this.dirOf(this.gface); if (this.gt > 1.8) { this.gphase = 'walk'; this.gi = (this.gi + 1) % GHAF_ROUTE.length; } } else { g.person.dir = this.dirOf(this.gface + Math.PI); if (this.gt > 1.2) { this.gphase = 'walk'; this.gi = (this.gi + 1) % GHAF_ROUTE.length; } } }
            g.light.x = Math.round(Math.cos(this.gface) * 10); g.light.y = -14 + Math.round(Math.sin(this.gface) * 6);
        }
        // Samy: when you reach the service room, the motorbike on the road above; then the door
        if (this.sstate === 'none' && p.x > SX + 20 && !sflag('c1b_codex')) { this.sstate = 'wait'; this.st = 0; Notice.show('Up above: a motorbike, no light. It stops. Hide!'); }
        if (this.sstate !== 'none' && this.sstate !== 'done') this.samyStep(dt, m);
        // what they see
        let rate = 0, who = null;
        for (const [w, a, r, h, id] of this.cones()) { const v = this.sees(w, a, r, h); if (v) { rate += 1.3 * v; who = id; } }
        const run = ((Game.keys.run ? 1 : 0) ^ Game.set.run) && (Game.keys.left || Game.keys.right || Game.keys.up || Game.keys.down);
        for (const w of [g, this.samy]) if (w && !w.gone) { const d = Math.hypot(w.x - p.x, w.y - p.y); if (d < 30) { rate += 0.8; who = who || (w === g ? 'ghaf' : 'samy'); } if (run && d < 110) { rate += 0.6; who = who || (w === g ? 'ghaf' : 'samy'); } }
        this.seeing = who;
        this.sus = rate ? Math.min(1, this.sus + rate * dt) : Math.max(0, this.sus - 0.35 * dt);
        if (this.sus >= 1) { this.sus = 0; startDialogue(who === 'samy' ? 'c1b_ser_samyseen' : sflag('c1b_codex') ? 'c1b_ser_bluff' : 'c1b_ser_ghafseen'); }
    },
    samyStep(dt, m) {
        this.st += dt;
        const [dx0, dy0] = m.samyDoor, cab = m.ents.find(e => e.id === 'c1b_cabinet'), cx = cab.x + 16, cy = cab.y + 30;
        if (this.sstate === 'wait') {
            if (this.st < 7) return;
            if (!this.samy || !m.ents.includes(this.samy)) { this.samy = World.addEnt(m, { x: dx0, y: dy0, w: 0, d: 0, id: 'c1b_samy_ser', label: 'Samy Ragab', person: { sheet: personSheet(LOOKS.samy), dir: DIR.down, frame: 0 }, sortY: dy0, light: { x: 0, y: 10, r: 60, c: '#fff4d0' } }); m.people.push(this.samy); }
            const s = this.samy; s.gone = false; s.x = dx0; s.y = dy0; this.sstate = 'in'; this.st = 0; this.sface = Math.PI / 2; Sfx.door();
        }
        const s = this.samy;
        if (this.sstate === 'in') { if (this.step(s, cx - 24, cy + 4, 40, dt)) { this.sstate = 'stash'; this.st = 0; s.person.frame = 0; } else this.sface = Math.atan2(cy + 4 - s.y, cx - 24 - s.x); }
        else if (this.sstate === 'stash') { this.sface = 0; s.person.dir = DIR.right; if (this.st > 3) { this.sstate = 'sweep'; this.st = 0; sflag('c1b_bag_in', true); } }
        else if (this.sstate === 'sweep') { this.sface = Math.PI * 0.5 + Math.sin(this.st * 1.4) * 1.1; s.person.dir = this.dirOf(this.sface); if (this.st > 3.2) { this.sstate = 'out'; this.st = 0; } }         // the torch round the room
        else if (this.sstate === 'out') { if (this.step(s, dx0, dy0, 44, dt)) { s.gone = true; this.sstate = 'done'; Sfx.door(); Notice.show('The service door clangs shut. The motorbike goes away down the road.'); } else this.sface = Math.atan2(dy0 - s.y, dx0 - s.x); }
        if (s && !s.gone) { s.light.x = Math.round(Math.cos(this.sface) * 26); s.light.y = Math.round(Math.sin(this.sface) * 18) - 6; }
    },
    // cones and the meter, over the dark; a line at the top saying what to do
    draw(g, cx, cy) {
        const m = Game.map; if (m.key !== 'INT_SERAPEUM') return;
        const A = pa(g);
        for (const [w, a, r, h, id] of this.cones()) {
            const pts = [[Math.round(w.x - cx), Math.round(w.y - 4 - cy)]], N = 18;
            for (let k = 0; k <= N; k++) { const b = a - h + 2 * h * k / N, ux = Math.cos(b), uy = Math.sin(b); let t = 10; while (t < r && !World.blocked(m, w.x + ux * t - 2, w.y - 4 + uy * t - 2, 4, 4)) t += 6; pts.push([Math.round(w.x + ux * t - cx), Math.round(w.y - 4 + uy * t - cy)]); }
            const hot = this.seeing === id;
            g.globalAlpha = hot ? 0.34 : 0.2; A.poly(pts, hot ? '#ff5040' : '#ffe060'); g.globalAlpha = 1;
            for (let k = 1; k + 1 < pts.length; k++) A.line(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], hot ? '#ff8070' : '#fff0a0');
        }
        const w = this.seeing === 'samy' ? this.samy : this.ghaf;
        if (w && !w.gone && (this.sus > 0.02 || this.seeing)) { const bx = Math.round(w.x - cx) - 10, by = Math.round(w.y - cy) - 44; A.r(bx - 1, by - 1, 22, 5, '#1c1814'); A.r(bx, by, 20, 3, '#5a5040'); A.r(bx, by, Math.round(20 * this.sus), 3, this.sus > 0.66 ? '#f04030' : this.sus > 0.33 ? '#f0a030' : '#f0e040'); if (this.seeing) Txt.draw(g, '?', bx + 10, by - 13, { col: '#ffe060', shadow: '#1c1814', align: 'center' }); }
        const VW = Game.VW, S = this.sstate;
        const [line, sub] = sflag('c1b_codex') ? ['GET OUT', 'Back to the steps, out of the lantern light.'] : S === 'none' ? ['THE GALLERIES', 'Keep out of the lantern. The service room is at the far east end.'] : S === 'wait' ? ['HIDE', 'Behind the pumps or the workbench. Out of the torch.'] : S === 'done' ? ['HE\'S GONE', 'What did he leave in the cabinet?'] : ['STAY HIDDEN', 'Don\'t move. Don\'t breathe.'];
        Txt.draw(g, line, VW >> 1, 6, { col: '#ffe890', shadow: '#1c1814', align: 'center' });
        Txt.draw(g, sub, VW >> 1, 18, { col: '#ffffff', shadow: '#1c1814', align: 'center' });
    },
    // seen: back to where it started
    back(toSpawn) {
        const m = this.map, p = Game.player; this.sus = 0; this.resetGhaf();
        if (this.samy) this.samy.gone = true;
        if (this.sstate !== 'done') this.sstate = 'none';
        Game.fadeTo(() => { if (toSpawn) { p.x = m.spawn[0]; p.y = m.spawn[1]; p.dir = DIR.up; } else { p.x = m.pw - 196; p.y = 212; p.dir = DIR.left; } });
    },
};
STORY_SCRIPTS.c1b_nightghaf = () => sflag('c1b_codex') ? 'c1b_ser_bluff' : 'c1b_ser_ghafseen';
STORY_SCRIPTS.c1b_samy_ser = 'c1b_ser_samyseen';
scene('c1b_ser_ghafseen', {
    speaker: 'Night Ghaffir',
    text: `The lantern swings into your face. "Who's— Inspector? Inspector! At this hour! Ya salaam, you scared me to death!" His voice goes booming off down the galleries and comes back three times.\n\nIf Samy is anywhere within a kilometre, he heard that. You calm the young man down, send him back to his rounds, and wait a long time in the dark before you try again.\n\n(Back to the steps. Keep out of the lantern light this time.)`,
    choices: [{ text: 'Try again.', onSelect: () => { clockAdvance(10); Ser.back(true); } }],
});
scene('c1b_ser_samyseen', {
    speaker: 'System',
    text: `The torch swings round and stops on you.\n\nFor a second Samy just stares. Then he's gone, back up the steps and out through the service door, the cooler bag in his arms, and the motorbike screams away down the road with its light off.\n\nHe'll try again, somewhere else, if he's frightened enough. Better if he never knew you were here.\n\n(Try again: back to the gallery's end. Hide before he comes in.)`,
    choices: [{ text: 'Try again.', onSelect: () => { sflag('c1b_bag_in', false); Ser.back(false); } }],
});
scene('c1b_ser_bluff', {
    speaker: 'Night Ghaffir',
    text: `The lantern finds you. "Inspector! At this hour!"\n\n"Checking the seals," you say. "Go back to your rounds." The Codex is inside your jacket, against your ribs. He doesn't look at your jacket. He looks at your Ministry card, and nods, and goes.`,
    choices: [{ text: 'Keep walking.', onSelect: () => { sflag('c1b_ghaf_saw', true); Ser.sus = 0; } }],
});
// the cabinet
STORY_SCRIPTS.c1b_cabinet = () => sflag('c1b_codex') ? 'c1b_cab_empty' : sflag('c1b_bag_in') && Ser.sstate === 'done' ? 'c1b_codex_found' : 'c1b_cab_locked';
scene('c1b_cab_locked', { speaker: 'System', text: `An engineers' steel cabinet with a padlock. Your key ring has a key that fits it: one of the three nobody ever identified. Inside: rags, a tin of grease, a manual in Italian. Nothing else. Not yet.`, choices: [{ text: 'Close it.' }] });
scene('c1b_cab_empty', { speaker: 'System', text: `The steel cabinet. The red cooler bag is back inside it, zipped, with a brick from the workbench in it for the weight. Karim's man can have that.`, choices: [{ text: 'Close it.' }] });
scene('c1b_codex_found', {
    speaker: 'System',
    text: `The padlock is still warm from Samy's hand. Inside, on top of the rags: a red cooler bag, the kind families take to the Nile on a Friday.\n\nIn the bag, in a Ministry evidence envelope with the label torn half off, something the size of a paperback, wrapped in a supermarket carrier bag.\n\nA book. Not a scroll: a codex, leaves of papyrus stitched into a quire, in a cover of dark leather with a long flap and a thong to tie it. On the thong, a tag in your own office's hand: SAQ/EV/0419, SHELF 4B. The one the ledger says was never there.`,
    choices: [{ text: 'Take it. Leave the bag with a brick in it.', onSelect: () => {
        sflag('c1b_codex', true); pocket('The Codex'); taskDone('c1b_night');
        storyNote('The Codex', 'A leather-bound papyrus codex, Late Antique: the one from Shelf 4B, tag SAQ/EV/0419. Samy put it in a cooler bag in the Serapeum\'s service room for Karim\'s man. I took it, and left the bag with a brick in it.');
        task('c1b_out', 'Get out of the Serapeum with the Codex, and don\'t let the night ghaffir see you.');
    } }],
});
ITEM_INFO['The Codex'] = { key: 1, get desc() { return Game.player.bg === 'inspector' ? 'A leather-bound papyrus codex, Late Antique, from Shelf 4B of your own evidence store. Tag SAQ/EV/0419. Greek, with hieroglyph-like marks beside some lines.' : 'A leather-bound papyrus codex, Late Antique, in Miriam\'s green scarf. Greek, with hieroglyph-like marks beside some lines.'; } };

// ---- out: headlights at the inspectorate ----
scene('c1b_blackcar_seen', {
    speaker: 'System',
    text: () => `Up the steps, into the cold air. It is ${clockStr()}.\n\nAcross the desert, on the escarpment's edge, headlights: a big black car, coming slowly up the road from the village with no hurry about it at all, and turning in at the inspectorate's gate.\n\n${Story.s.clock >= 24 * 60 ? 'Past midnight' : 'Nearly midnight'}. On a Tuesday. "A black car comes for Fathi on Tuesdays," Samy said, and Karim told him to be quicker than it.`,
    choices: [{ text: 'Keep the Codex close, and go and see. Carefully.', onSelect: () => { sflag('c1b_saw_car', true); taskDone('c1b_out'); task('c1b_blackcar', 'A black car has turned in at the inspectorate, in the middle of the night. Go and see, without being seen. (Beat 5, the black car, comes in the next update.)'); } }],
});
TASK_TARGETS.c1b_night = () => Game.map.key === 'INT_SERAPEUM' ? { room: 'INT_SERAPEUM', id: 'c1b_cabinet', out: 'c1b_serapeum' } : nightNow() ? 'c1b_serapeum' : 'c1b_ghafhut';
TASK_TARGETS.c1b_out = () => 'c1b_serapeum';
TASK_TARGETS.c1b_blackcar = () => 'c1b_office';

// ---- the hooks ----
(function () {
    const Ar = AREAS.inspector, _frame = Ar.frame, _over = Ar.overlay, _enter = Ar.onEnter;
    Ar.onEnter = function (room) { _enter.call(this, room); if (room === 'INT_SERAPEUM') Ser.enter(Game.map); };   // (rooms are kept: start it fresh each time you go in)
    Ar.frame = function (dt) {
        _frame.call(this, dt);
        Ser.frame(dt);
        if (Game.map === Game.maps.ch1 && sflag('c1b_codex') && !sflag('c1b_saw_car')) startDialogue('c1b_blackcar_seen');
    };
    Ar.overlay = (g, cx, cy) => { if (_over) _over(g, cx, cy); Ser.draw(g, cx, cy); };
})();
