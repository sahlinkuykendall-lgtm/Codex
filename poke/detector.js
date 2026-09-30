// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MIRIAM'S METAL DETECTOR (poke/detector.js)
// Pick it up at Hana's table, press Q to switch it on, and sweep:
//   - the coil swings in front of you and the tick quickens as you close in
//   - it reads loudest when you FACE the target, so turn to find the direction
//   - close in, and the screen reads the metal (IRON, FOIL, TIN, BRASS, COIN,
//     SILVER) and how deep it is. Iron and foil are nearly always junk, but not
//     quite always. Brass and silver are worth the dig.
//   - right on top of it: DIG HERE. SPACE digs (five story minutes) and leaves a hole.
// What's buried: the 16 finds from the 3D chapter (Miriam's four caches, the four
// relics of the 1926 truck and eight others) plus 24 more spots of junk and old
// treasure laid on free sand. Everything dug is a story flag (dug_<id>), so it saves.
// ============================================================

// what the 16 3D finds are, in camp.js's ow_cache order: [metal, depth (inches), reward]
const BURIED_3D = [
    ['TIN', 6, () => { storyPay(1200, 'Miriam\'s emergency tin'); c1aCache('tin'); }],
    ['COIN', 3, () => storyPay(80, 'Old coins')],
    ['IRON', 5, () => pocket('Thermos of karkadeh')],
    ['BRASS', 4, () => storyPay(60, 'Scrap brass')],
    ['TIN', 3, () => pocket('Tin compass')],
    ['ALLOY', 7, () => { pocket("Miriam's spare phone"); storyPay(150, 'In the phone case'); sflag('spare_phone', true); c1aCache('phone'); }],
    ['IRON', 4, () => { pocket("Hamid's multitool"); }],
    ['TIN', 4, () => pocket('Tin of dried mint')],
    ['BRASS', 8, () => { pocket('Field glasses'); sflag('field_glasses', true); c1aCache('glasses'); }],
    ['ALLOY', 5, () => pocket('Signal mirror')],
    ['TIN', 6, () => { pocket('Dates', 4); pocket("Miriam's old rucksack"); sflag('big_rucksack', true); c1aCache('rucksack'); }],
    ['COIN', 4, () => storyPay(90, 'A purse of coins')],
    ['ALLOY', 9, () => { pocket('Folding Kodak camera'); c1aRelic(); }],
    ['IRON', 7, () => { pocket('Harvard trowel'); c1aRelic(); }],
    ['BRASS', 6, () => { pocket('Brass find tag, 1926'); c1aRelic(); }],
    ['TIN', 10, () => { pocket('Glass plate photograph'); sflag('plate_photo', true); c1aRelic(); }],
];
// 24 more: most of it rubbish, some of it history. [metal, depth, text, EGP (scrap or the register's finder's fee), item?]
const BURIED_MORE = [
    ['FOIL', 2, 'A ring-pull from a can of Stella beer. The eighties were here.', 0],
    ['IRON', 3, 'A bent nail as long as your hand, square-cut. Old, but only nail-old.', 5],
    ['COIN', 4, 'A silver tetradrachm of Ptolemy II, his mother Arsinoe on the back, black with age. The register pays a finder\'s fee and it goes to the Ministry store in the morning.', 400, null, 'SILVER'],
    ['FOIL', 1, 'A crumpled cigarette packet, Cleopatra brand, the foil lining still shining. Somebody\'s break.', 0],
    ['IRON', 5, 'A horseshoe, worn to a crescent. Somebody\'s luck, lost.', 10],
    ['BRASS', 5, 'A brass uniform button: an eagle and a crown and FRANÇAIS. Napoleon\'s savants surveyed this plateau in 1799. One of them lost a button.', 250, 'Napoleonic button'],
    ['TIN', 3, 'A sardine tin, opened with a knife, long ago. Nothing else.', 0],
    ['COIN', 3, 'A copper fals, the Mamluk kind, stamped in Arabic, the size of your little fingernail. The register takes it.', 120],
    ['IRON', 2, 'A bottle cap. Coca-Cola, the Arabic logo. Nothing.', 0],
    ['BRASS', 6, 'A British Army cap badge, the Camel Corps, 1916. The pin has rusted away.', 180, 'Camel Corps badge'],
    ['FOIL', 2, 'A foil sweet wrapper, turned up by the wind and buried again by it.', 0],
    ['IRON', 6, 'A rifle cartridge case, brass gone green, the base stamped 1942. The war came close to Giza.', 30],
    ['BRASS', 7, 'A bronze arrowhead, three-bladed, the kind the Persians shot twenty-five centuries ago. The register pays well for it.', 300, null, 'BRASS'],
    ['TIN', 4, 'A rusted tobacco tin. Inside, three pebbles someone thought were special. They are, a little: they\'re all perfectly round.', 5],
    ['IRON', 4, 'A key that fits nothing on the site, on a ring with a plastic Sphinx.', 0],
    ['COIN', 2, 'A one-piastre coin from 1938, King Farouk young on the front. Worth a piastre.', 1],
    ['FOIL', 3, 'A pull tab. Another pull tab. The detector loves pull tabs.', 0],
    ['IRON', 5, 'A tent peg, iron, one of Miriam\'s by the orange paint. Not treasure, but you smile.', 0],
    ['SILVER', 8, 'A silver finger ring, plain, worn thin on one side. No stone, no name. You hand it to the register with care.', 350, null, 'SILVER'],
    ['TIN', 3, 'A spoon, tin, bent double. Somebody was very angry with their lentils.', 0],
    ['IRON', 7, 'A chisel of old iron, flattened at the head by a hammer. A quarryman\'s. The register takes it.', 60],
    ['BRASS', 4, 'A brass tap from a water barrel. The camp will want that back.', 20],
    ['COIN', 5, 'A handful of coins from four different decades, rusted into one lump. Somebody\'s pocket, emptied.', 40],
    ['FOIL', 2, 'Foil from a camera film box, silver on one side. Nothing else.', 0],
];
Object.assign(ITEM_INFO, {
    'Metal detector': { key: 1, desc: 'Miriam\'s detector: tape round the handle, "M.H." scratched in the housing. Press Q to switch it on outdoors. Face the signal, follow the tick, and read the metal before you dig.' },
    "Miriam's spare phone": { key: 1, desc: 'A cheap phone from Miriam\'s emergency cache, charged. One number saved: "A.S."' },
    'Field glasses': { key: 1, desc: 'Brass-bound field glasses in a cracked leather case. Miriam\'s note: "For watching the road."' },
    "Miriam's old rucksack": { key: 1, desc: 'Miriam\'s old field pack, bigger than yours.' },
    'Folding Kodak camera': { desc: 'A 1920s folding Kodak, leather cracked to the metal. Stamped inside the lid: H.U.–M.F.A. EXPEDITION.' },
    'Harvard trowel': { desc: 'A mason\'s trowel worn to a crescent, HARVARD CAMP burned into the handle.' },
    'Brass find tag, 1926': { desc: 'A brass tag stamped with a find number and a date: 14.III.1926.' },
    'Glass plate photograph': { key: 1, desc: 'Forty workmen and a foreman in a white turban on the steps of a tomb, 1926, and in front, a boy who has exactly the Rais\'s face.' },
    'Thermos of karkadeh': { desc: 'Hibiscus tea, sour and cold, in a thermos somebody buried with their lunch.' },
    'Tin compass': { desc: 'A child\'s tin compass. North is still north.' },
    "Hamid's multitool": { desc: 'A multitool with HAMID scratched in the grip. Uncle Hamid will want it back.' },
    'Tin of dried mint': { desc: 'Dried mint and a blackened pot. Enough for a week of proper tea.' },
    'Signal mirror': { desc: 'A soldier\'s signalling mirror in a canvas sleeve. It throws the moon back at you.' },
    'Dates': { desc: 'Dates packed in their own sugar.' },
    'Napoleonic button': { desc: 'A brass button, an eagle and FRANÇAIS: one of Napoleon\'s savants, 1799. The register let you keep it.' },
    'Camel Corps badge': { desc: 'A British Army cap badge, the Imperial Camel Corps, 1916.' },
});
function c1aCache(what) {
    const n = ['tin', 'phone', 'glasses', 'rucksack'].filter(k => sflag('cache_' + k) || k === what).length;
    sflag('cache_' + what, true);
    storyNote('Miriam\'s caches (side quest)', 'Miriam buried emergency caches round the camp, wrapped in her orange survey tape. Found ' + n + ' of 4.' + (n === 4 ? ' That\'s all of them.' : ''));
    storyNotice('Miriam\'s cache ' + n + ' of 4.');
}
function c1aRelic() {
    const n = (sflag('relics_1926') || 0) + 1; sflag('relics_1926', n);
    storyNote('The truck of 1926 (side quest)', 'Relics of the 1926 Harvard–Boston expedition, dug up round the camp: ' + n + ' of 4.' + (sflag('plate_photo') ? ' One is a glass plate of the 1926 workmen, and the boy in front has the Rais\'s face.' : ''));
    storyNotice('1926 relic ' + n + ' of 4.');
}

const Detector = {
    on: false, spots: [], sig: 0, target: null, pin: null, beepAt: 0, dig: null, holes: [], sweep: 0, R: 176,
    TONE: { IRON: 170, FOIL: 380, TIN: 470, ALLOY: 560, BRASS: 660, COIN: 760, SILVER: 900 },

    // where everything is buried (built once per camp)
    build(m) {
        const L = m.camp, spots = [];
        (m.buried || []).forEach((b, i) => { const d = BURIED_3D[i]; if (d) spots.push({ id: b.id, x: b.x, y: b.y, metal: d[0], depth: d[1], text: b.say ? b.say[1].replace(/^The detector shrieks\. You dig with your hands\.\s*/, '').replace(/\s*\([^)]*\)\s*$/, '') : '', reward: d[2] }); });
        // the other 24, on open sand at least four tiles from anything else buried
        const cand = [];
        for (let ty = 3; ty < L.H - 3; ty++) for (let tx = 3; tx < L.W - 3; tx++) {
            if (L.get(tx, ty) !== T.SAND) continue;
            const x = tx * TILE + 16, y = ty * TILE + 20;
            if (World.blocked(m, x - 10, y - 8, 20, 14)) continue;
            cand.push({ tx, ty, x, y, h: hash2(tx * 17 + 5, ty * 31 + 9) });
        }
        cand.sort((a, b) => a.h - b.h);
        let k = 0;
        for (const c of cand) {
            if (k >= BURIED_MORE.length) break;
            if (spots.some(s => Math.hypot(s.x - c.x, s.y - c.y) < 4 * TILE)) continue;
            const [metal, depth, text, egp, item, shown] = BURIED_MORE[k];
            spots.push({ id: 'bur' + k, x: c.x, y: c.y, metal: shown || metal, depth, text, egp, item });
            k++;
        }
        this.spots = spots;
    },
    left() { return this.spots.filter(s => !sflag('dug_' + s.id)); },
    // after a load or a new game: holes where you've dug
    sync() {
        const m = Game.maps.ch1; if (!m) return;
        if (!this.spots.length || this.map !== m) { this.build(m); this.map = m; this.holes = []; }
        for (const s of this.spots) if (sflag('dug_' + s.id) && !this.holes.includes(s.id)) this.addHole(s);
        if (!hasItem('Metal detector')) this.on = false;
    },
    addHole(s) { this.holes.push(s.id); World.addEnt(Game.maps.ch1, { x: s.x, y: s.y, w: 0, d: 0, spr: Object.assign({}, dugHoleSprite(), {}), sortY: -1e9 + s.y }); },

    toggle() {
        if (!hasItem('Metal detector')) return false;
        if (!Game.map.outdoor) { Toast.show('Too much metal in here. Try outside.'); return true; }
        this.on = !this.on; Sfx.tone(this.on ? 880 : 440, 0.08, 'square', 0.05, this.on ? 1320 : 220);
        if (this.on && !sflag('detector_tip')) { sflag('detector_tip', true); Toast.show('Face the signal · the tick quickens · SPACE digs on the spot', 5); }
        return true;
    },

    update(dt) {
        this.sweep += dt;
        if (this.dig) { this.updateDig(dt); return; }
        this.sig = 0; this.target = null; this.pin = null;
        if (!this.on || !Game.map.outdoor) return;
        const p = Game.player, fx = [0, -1, 1, 0][p.dir], fy = [1, 0, 0, -1][p.dir];
        let best = 0, bt = null;
        for (const s of this.spots) {
            if (sflag('dug_' + s.id)) continue;
            const dx = s.x - p.x, dy = s.y - (p.y - 4), d = Math.hypot(dx, dy);
            if (d > this.R) continue;
            const near = 1 - d / this.R, face = d < 20 ? 1 : (dx * fx + dy * fy) / d;       // loudest straight ahead
            const v = near * near * (0.45 + 0.55 * Math.max(0, face)) * (1 - s.depth * 0.025);
            if (v > best) { best = v; bt = s; }
            if (d < 15) this.pin = s;
        }
        if (this.pin) { bt = this.pin; best = 1; }
        this.sig = best; this.target = bt;
        // the tick: faster and higher the closer; its note is the metal
        const now = Game.time;
        if (best > 0.02 && now > this.beepAt) {
            const f = this.TONE[bt.metal] || 500;
            Sfx.tone(f * (0.85 + best * 0.3), 0.035, bt.metal === 'IRON' ? 'sawtooth' : 'square', 0.012 + best * 0.03);
            this.beepAt = now + (this.pin ? 0.07 : 0.09 + (1 - best) * 0.9);
        }
    },

    // SPACE on the spot: kneel, dig for a moment, and see what it was
    startDig() {
        const s = this.pin; if (!s || this.dig) return false;
        this.dig = { s, t: 0, bits: [] }; Sfx.tone(140, 0.08, 'triangle', 0.08, 90);
        return true;
    },
    updateDig(dt) {
        const D = this.dig; D.t += dt;
        if ((D.t * 4 | 0) !== ((D.t - dt) * 4 | 0)) { Sfx.tone(120 + Math.random() * 40, 0.07, 'triangle', 0.08, 80); for (let i = 0; i < 5; i++) D.bits.push({ x: D.s.x, y: D.s.y - 2, vx: (Math.random() - 0.5) * 70, vy: -40 - Math.random() * 50, t: 0 }); }
        for (const b of D.bits) { b.t += dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vy += 220 * dt; }
        D.bits = D.bits.filter(b => b.t < 0.6);
        if (D.t < 1.3) return;
        const s = D.s; this.dig = null;
        sflag('dug_' + s.id, true); this.addHole(s); clockAdvance(5);
        const junk = !s.reward && !s.item && (s.egp || 0) < 50;
        Dlg.open('System', (junk ? 'You dig. ' : 'You dig, and your fingers find it. ') + s.text, () => {
            if (s.reward) s.reward();
            else { if (s.egp) storyPay(s.egp, s.egp >= 100 ? 'The register\'s finder\'s fee' : 'Scrap'); if (s.item) pocket(s.item); else if (!s.egp) { Toast.show('Junk. It goes in the spoil bucket.'); } }
            const n = this.spots.filter(q => sflag('dug_' + q.id)).length;
            Game.note('Detector finds', 'Dug ' + n + ' of the ' + this.spots.length + ' things the detector can hear round the camp.', 'detector_finds');
            if (!junk) Sfx.get();
        });
    },

    // ---- drawing ----
    // the coil in front of you, swinging side to side (drawn with the people, so it sorts)
    coil(p) {
        if (!this.on || !Game.map.outdoor) return null;
        const dir = p.dir, sw = this.dig ? 0 : Math.sin(this.sweep * 5) * (dir === 3 ? 11 : 6);   // facing away it swings wide, so it shows either side of you
        const off = [[sw, 10], [-15, -1 + sw * 0.4], [15, -1 + sw * 0.4], [sw, -12]][dir];
        const cx = p.x + off[0], cy = p.y + off[1];
        return { x: cx, y: cy, sortY: dir === 3 ? p.y - 1 : p.y + 1, custom: (g, camx, camy) => {
            const A = pa(g), hx = Math.round(p.x + [2, -5, 5, -2][dir] - camx), hy = Math.round(p.y - 12 - camy), x = Math.round(cx - camx), y = Math.round(cy - camy);
            A.line(hx, hy, x, y - 1, PAL.line); A.line(hx + 1, hy, x + 1, y - 1, '#748490');
            A.ell(x, y, 6, 3, PAL.line); A.ell(x, y, 5, 2, '#303a42'); A.ell(x, y, 3, 1, '#9aa8b0');
            if (this.sig > 0.5 && (Game.time * (4 + this.sig * 10) | 0) % 2 === 0) A.px(x, y - 1, this.pin ? '#f04030' : '#60f060');
        } };
    },
    // dirt flying while you dig, and the ring on the spot once you're on it
    drawWorld(g, camx, camy) {
        const A = pa(g);
        if (this.dig) for (const b of this.dig.bits) A.r(Math.round(b.x - camx), Math.round(b.y - camy), 2, 2, b.t < 0.3 ? '#a8804c' : '#7a5a34');
        if (this.on && this.pin && !this.dig) {
            // a pulsing ring round your feet, and a bouncing arrow over your head
            const p = Game.player, x = Math.round(p.x - camx), y = Math.round(p.y - camy), r = 12 + Math.round(Math.sin(Game.time * 8) * 2);
            for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; A.px(Math.round(x + Math.cos(t) * r), Math.round(y + Math.sin(t) * r * 0.42), a % 2 ? '#f04030' : '#ffd0a0'); }
            const ay = y - 44 + Math.round(Math.abs(Math.sin(Game.time * 6)) * -4);
            A.poly([[x - 5, ay], [x + 5, ay], [x, ay + 6]], PAL.line); A.poly([[x - 3, ay + 1], [x + 3, ay + 1], [x, ay + 4]], '#f04030');
        }
    },
    // the detector's own little screen, bottom left
    drawHud(g) {
        if (!this.on || !Game.map.outdoor || Dlg.active) return;
        const A = pa(g), VH = Game.VH, x = 6, w = 150, h = 44, y = VH - h - 6, rx = x + w - 9;
        A.r(x + 1, y, w - 2, h, PAL.line); A.r(x, y + 1, w, h - 2, PAL.line);
        A.r(x + 1, y + 1, w - 2, h - 2, '#4c5a66'); A.r(x + 1, y + 1, w - 2, 2, '#748490'); A.r(x + 1, y + h - 3, w - 2, 2, '#38424c');
        A.r(x + 5, y + 5, w - 10, h - 10, '#1c2a1c'); A.r(x + 5, y + 5, w - 10, 1, '#0c160c');
        // eight bars, green to red
        const n = Math.round(this.sig * 8);
        for (let i = 0; i < 8; i++) { const on = i < n, c = i < 4 ? '#60e060' : i < 6 ? '#e8d040' : '#f05030'; A.r(x + 9 + i * 7, y + 22 - i * 1.5, 5, 6 + i * 1.5, on ? c : '#2c3c2c'); }
        const t = this.target, lcd = '#90f090';
        if (this.dig) Txt.draw(g, 'DIGGING…', rx, y + 9, { col: lcd, align: 'right' });
        else if (this.pin) { if ((Game.time * 3 | 0) % 2 === 0) Txt.draw(g, 'DIG HERE', rx, y + 9, { col: '#f07060', align: 'right' }); }
        else Txt.draw(g, this.sig > 0.02 ? 'SIGNAL' : 'QUIET', rx, y + 9, { col: this.sig > 0.02 ? lcd : '#4c7a4c', align: 'right' });
        if (t && this.sig > 0.4) { Txt.draw(g, t.metal, x + 9, y + 29, { col: lcd }); Txt.draw(g, t.depth + ' in deep', rx, y + 29, { col: lcd, align: 'right' }); }
        else { Txt.draw(g, 'Q: off', x + 9, y + 29, { col: '#4c7a4c' }); Txt.draw(g, this.left().length + ' left', rx, y + 29, { col: '#4c7a4c', align: 'right' }); }
    },
};
// a dug hole: dark earth in a ring of thrown sand
function dugHoleSprite() {
    if (dugHoleSprite.c) return dugHoleSprite.c;
    const [c, g] = mk(18, 10), A = pa(g);
    A.ell(9, 5, 8, 4, PAL.sand[2]); A.ell(9, 5, 6, 3, '#7a5a34'); A.ell(9, 6, 4, 2, '#5a3e22'); A.px(3, 2, PAL.sand[1]); A.px(15, 7, PAL.sand[1]);
    return (dugHoleSprite.c = { c, ox: -9, oy: -5, flat: true });
}

// Miriam's detector at Hana's table
STORY_SCRIPTS.ow_detector = () => hasItem('Metal detector') ? null : 'c1a_detector';
scene('c1a_detector', {
    speaker: 'System',
    text: `A metal detector leaning on a crate, tape round the handle, "M.H." scratched into the housing. Miriam's. The battery light still comes on.\n\nSwitched on, it ticks faster near anything buried, and its little screen reads the metal: iron, foil, tin, brass, coin, silver. Miriam, the Rais says, buried things.`,
    choices: [
        { text: 'Take it.', onSelect: () => {
            pocket('Metal detector');
            const e = Game.maps.ch1.ents.find(q => q.id === 'ow_detector'); if (e) { World.removeEnt(Game.maps.ch1, e); Game.taken[e.id] = 1; }
            task('detector', 'Sweep the camp with Miriam\'s detector (Q). Some of what\'s buried is hers.');
            Toast.show('Metal detector: press Q to switch it on', 4.5);
        } },
        { text: 'Leave it.' },
    ],
});
