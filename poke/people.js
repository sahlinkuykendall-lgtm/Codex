// ============================================================
// THE CODEX OF GIZA — POKE STYLE: PEOPLE (poke/people.js)
// Every character is built from parts — skin, hair, headwear, face,
// clothes, shoes, an accessory — and drawn into a sheet of 32×32 frames:
// four directions × three frames (standing, left step, right step).
// Big head, small body, dark outline: the DS overworld look.
//
//   personSheet(look)  → { frames[dir][f] }   dir: 0 down, 1 left, 2 right, 3 up
//   lookFromChoices(c) → a look, from the character creator's choices
//
// The same parts dress the player (CREATOR lists every option, ten or
// more per category) and the cast (LOOKS).
// ============================================================

const DIR = { down: 0, left: 1, right: 2, up: 3 };

// ---- colours ----
// cloth: [light, mid, dark]
const CLOTH = {
    khaki: ['#c8c088', '#a8a068', '#80784c'], linen: ['#ffffff', '#ece8dc', '#c8c2b0'], sand: ['#f0dca8', '#d8bc80', '#b0945c'],
    olive: ['#94a060', '#707c44', '#50582e'], nile: ['#7cb0ec', '#4c80cc', '#3058a0'], indigo: ['#5864b8', '#384090', '#242a64'],
    faience: ['#70d8c8', '#38a89c', '#247870'], red: ['#f07860', '#d04838', '#a03028'], terracotta: ['#e8a070', '#c87848', '#9c5430'],
    purple: ['#b080d8', '#8050b0', '#583484'], black: ['#5c5660', '#3c3840', '#242228'], ochre: ['#ffd868', '#e8b030', '#b88418'],
    white: ['#ffffff', '#e8eaf0', '#c4c8d4'], pink: ['#f8c8d4', '#e8a0b4', '#c87c94'], grey: ['#c8d4dc', '#9cacb8', '#748490'], brown: ['#c89058', '#a86c3c', '#804c28'],
};
// skin: [base, shade]
const SKINS = [['#fbe0cc', '#e4bca4'], ['#f6d2b0', '#dcae8a'], ['#f0c8a0', '#d4a478'], ['#e6b88c', '#c89468'], ['#d8a878', '#b88458'],
    ['#c8935f', '#a87444'], ['#b88458', '#94643c'], ['#a06c44', '#7c5030'], ['#845432', '#643c22'], ['#5e3a24', '#442818']];
// hair: [base, dark]
const HAIRS = [['#2c2424', '#181414'], ['#2a2c44', '#181a2c'], ['#4a3020', '#301c10'], ['#70482c', '#4c2e18'], ['#8c5a34', '#64381c'],
    ['#a8502c', '#783418'], ['#c84a28', '#942c14'], ['#d8b870', '#b08c48'], ['#a8a8ac', '#78787e'], ['#f0f0f0', '#c0c0c8'], ['#2c60a8', '#183c74']];

function personFrame(L, dir, f) {
    const [c, g] = mk(32, 32), A = pa(g);
    const SK = L.skinCol || SKINS[[2, 4, 6, 8][L.skin || 0]] || SKINS[2];
    const skin = SK[0], skinD = SK[1];
    const HR = L.hairCol || (L.hair ? [L.hair, L.hair] : HAIRS[0]), hair = HR[0], hairD = HR[1];
    const top = L.top || CLOTH.khaki, legs = L.legs || CLOTH.brown;
    const topKind = L.robe ? 'robe' : (L.topKind || 'shirt'), botKind = L.botKind || 'trousers';
    const cloth = L.robe || top;
    const longTop = topKind === 'robe' || topKind === 'kalasiris' || topKind === 'kaftan';
    const wide = L.wide ? 1 : 0, slim = L.slim ? 1 : 0, kid = L.kid ? 2 : 0;
    const step = f === 0 ? 0 : 1, bob = step ? -1 : 0;
    const side = dir === DIR.left || dir === DIR.right, s = dir === DIR.left ? -1 : dir === DIR.right ? 1 : 0;
    const base = 30, legY = 24;
    const shoeKind = L.shoeKind || 'boots', shoe = L.shoe || '#4c3020';
    const bare = shoeKind === 'barefoot' || shoeKind === 'sandals';

    // ---- legs and feet ----
    // one leg: cloth down to `cut` rows above the foot, skin below that (shorts, kilts)
    const leg = (x, w, lift, shade) => {
        const footY = base - 1 - lift, skinFrom = botKind === 'shorts' || botKind === 'kilt' || botKind === 'pleat' || botKind === 'wrap' ? legY + 2 : botKind === 'rolled' ? footY - 1 : 99;
        for (let y = legY; y < footY; y++) A.r(x, y, w, 1, y >= skinFrom ? (shade ? skinD : skin) : legs[shade ? 2 : 1]);
        if (botKind === 'cargo' && !shade) A.r(x, legY + 2, 2, 2, legs[2]);
        if (botKind === 'sirwal') { A.r(x - 1, legY, w + 1, footY - legY - 1, legs[shade ? 2 : 1]); A.r(x, footY - 1, w, 1, legs[2]); }
        // the foot
        if (shoeKind === 'barefoot') A.r(x, footY, w, 1, skinD);
        else if (shoeKind === 'sandals') { A.r(x, footY, w, 1, skin); A.px(x + (w >> 1), footY, shoe); }
        else if (shoeKind === 'sneakers') { A.r(x, footY, w, 1, '#ffffff'); A.px(x + w - 1, footY, shoe); }
        else { A.r(x, footY, w, 1, shoe); if (shoeKind === 'boots' || shoeKind === 'riding') A.r(x, footY - 1 - (shoeKind === 'riding' ? 1 : 0), w, 1 + (shoeKind === 'riding' ? 1 : 0), shoe); if (shoeKind === 'babouche') A.px(x + (s || 1) * (s ? w - 1 : 0) + (s < 0 ? -w + 1 : 0), footY - 1, shoe); }
    };
    const showLegs = !longTop && botKind !== 'skirt';
    if (!side) {
        const lift = [f === 1 ? 2 : 0, f === 2 ? 2 : 0];
        if (showLegs) { leg(12 - wide, 3, lift[0], false); leg(17 + wide, 3, lift[1], true); }
        else { for (const [x, i] of [[12 - wide, 0], [17 + wide, 1]]) { const fy = base - 1 - lift[i]; A.r(x, fy, 3, 1, bare ? skin : shoe); if (shoeKind === 'sandals') A.px(x + 1, fy, shoe); } }
    } else {
        if (f === 0) { if (showLegs) leg(14, 4, 0, false); else A.r(13, base - 1, 5, 1, bare ? skin : shoe); }
        else {
            const a = f === 1 ? [11, 17] : [17, 11];
            if (showLegs) { leg(a[0] + 1, 3, 1, true); leg(a[1], 3, 0, false); }
            else { A.r(a[0], base - 2, 4, 1, bare ? skinD : shoe); A.r(a[1] - 1, base - 1, 4, 1, bare ? skin : shoe); }
        }
    }
    // kilts and skirts hang over the legs
    const bwBase = (side ? 8 : 10) + wide * 2 - slim * (side ? 0 : 2);
    if (!longTop && (botKind === 'kilt' || botKind === 'pleat' || botKind === 'wrap' || botKind === 'skirt')) {
        const kx = 16 - (bwBase >> 1) - (botKind === 'skirt' ? 1 : 0), kw = bwBase + (botKind === 'skirt' ? 2 : 0), kh = botKind === 'skirt' ? base - 2 - legY : 4;
        A.r(kx, legY - 1, kw, kh + 1, legs[1]); A.vl(kx + kw - 1, legY - 1, kh + 1, legs[2]); A.hl(kx, legY + kh - 1, kw, legs[2]);
        if (botKind === 'pleat' || botKind === 'skirt') for (let i = 1; i < kw - 1; i += 2) A.vl(kx + i, legY, kh - 1, legs[2]);
        if (botKind === 'kilt' && !side) { A.poly([[15, legY - 1], [18, legY - 1], [16.5, legY + 4]], CLOTH.ochre[1]); }     // the shendyt's front tab
        if (botKind === 'pleat') A.hl(kx, legY - 1, kw, CLOTH.ochre[1]);
        if (botKind === 'wrap' && !side) A.line(kx + 1, legY - 1, kx + kw - 2, legY + 3, legs[2]);
    }

    // ---- body ----
    const by = 16 + bob + kid, bw = bwBase, bx = 16 - (bw >> 1);
    const bh = longTop ? base - 1 - by : topKind === 'tunic' ? 10 : 8;
    const sleeveless = topKind === 'tank', shortSl = topKind === 'tee' || topKind === 'football';
    A.r(bx, by, bw, bh, cloth[1]);
    A.vl(bx + bw - 1, by, bh, cloth[2]); A.vl(bx, by + 1, 3, cloth[0]);
    if (!side) {
        A.r(15, by, 2, 1, skin);                                   // the neck
        if (topKind === 'shirt' || topKind === 'jacket') { A.px(14, by, cloth[0]); A.px(17, by, cloth[0]); A.vl(16, by + 1, bh - 1, cloth[2]); }   // collar, buttons
        if (topKind === 'jacket') { A.r(bx + 1, by + 3, 2, 2, cloth[2]); A.r(bx + bw - 3, by + 3, 2, 2, cloth[2]); A.hl(bx, by + bh - 1, bw, '#4c3020'); A.px(16, by + bh - 1, CLOTH.ochre[1]); }
        if (topKind === 'vest') { A.r(bx + 3, by, bw - 6, bh, CLOTH.linen[1]); A.vl(bx + 2, by, bh, cloth[2]); A.vl(bx + bw - 3, by, bh, cloth[2]); }
        if (topKind === 'football') { A.r(bx, by + 3, bw, 2, '#ffffff'); A.r(15, by + 5, 2, 2, '#ffffff'); }
        if (topKind === 'tunic') { A.hl(bx, by + bh - 1, bw, CLOTH.ochre[1]); A.r(14, by, 4, 1, CLOTH.ochre[1]); A.vl(16, by + 1, 3, CLOTH.ochre[1]); }
        if (topKind === 'kaftan') { A.vl(15, by + 1, bh - 1, CLOTH.ochre[1]); A.vl(16, by + 1, bh - 1, CLOTH.ochre[2]); A.hl(bx, by + bh - 1, bw, CLOTH.ochre[1]); }
        if (topKind === 'kalasiris') { for (let i = 1; i < bw - 1; i += 2) A.vl(bx + i, by + 5, bh - 5, cloth[2]); A.r(bx, by + 5, bw, 1, CLOTH.ochre[1]); }
        if (topKind === 'robe' && L.stripes) for (let i = 1; i < bw - 1; i += 2) A.vl(bx + i, by + 1, bh - 1, L.stripes);
        if (topKind === 'robe') { A.vl(16, by + 6, bh - 7, cloth[2]); A.px(15, by + 1, cloth[2]); A.px(16, by + 2, cloth[2]); }
    } else if (topKind === 'jacket' || topKind === 'tunic') A.hl(bx, by + bh - 1, bw, topKind === 'jacket' ? '#4c3020' : CLOTH.ochre[1]);
    if (longTop) { A.hl(bx, base - 2, bw, cloth[2]); if (L.stripe) A.r(bx, by + 3, bw, 2, L.stripe); }
    else if (L.stripe && !side) A.r(bx, by + 3, bw, 2, L.stripe);

    // ---- accessories worn on the body ----
    const acc = L.acc || (L.strap ? 'satchel' : null), GOLD = CLOTH.ochre;
    if (acc === 'satchel') { if (!side) { A.line(bx + 1, by, bx + bw - 2, by + 7, '#5c3418'); A.r(bx + bw - 3, by + 6, 3, 3, '#804c28'); } else if (dir === DIR.left) A.r(bx + bw - 3, by + 4, 3, 5, '#804c28'); else A.r(bx, by + 4, 3, 5, '#804c28'); }
    if (acc === 'backpack') { if (dir === DIR.up) { A.r(bx + 1, by + 1, bw - 2, 7, CLOTH.olive[1]); A.r(bx + 1, by + 1, bw - 2, 2, CLOTH.olive[0]); A.r(bx + 3, by + 4, bw - 6, 2, CLOTH.olive[2]); } else if (side) A.r(s < 0 ? bx + bw - 1 : bx - 2, by + 1, 3, 7, CLOTH.olive[1]); else { A.vl(bx + 1, by, 5, CLOTH.olive[2]); A.vl(bx + bw - 2, by, 5, CLOTH.olive[2]); } }
    if (dir === DIR.down) {
        if (acc === 'camera') { A.line(bx + 1, by, 15, by + 4, '#242228'); A.line(bx + bw - 2, by, 17, by + 4, '#242228'); A.r(14, by + 4, 4, 3, '#3c3840'); A.px(15, by + 5, '#9cacb8'); }
        if (acc === 'binoculars') { A.line(bx + 1, by, 14, by + 4, '#242228'); A.line(bx + bw - 2, by, 17, by + 4, '#242228'); A.r(13, by + 4, 2, 3, '#242228'); A.r(16, by + 4, 2, 3, '#242228'); }
        if (acc === 'ankh') { A.vl(16, by + 1, 5, GOLD[1]); A.hl(15, by + 3, 3, GOLD[1]); A.px(15, by + 1, GOLD[1]); A.px(17, by + 1, GOLD[1]); A.px(16, by + 1, cloth[1]); }
        if (acc === 'scarab') { A.px(15, by + 1, GOLD[2]); A.px(17, by + 1, GOLD[2]); A.r(15, by + 2, 3, 2, CLOTH.faience[1]); A.px(16, by + 2, CLOTH.faience[0]); A.px(14, by + 3, GOLD[1]); A.px(18, by + 3, GOLD[1]); }
        if (acc === 'horus') { A.px(15, by + 1, GOLD[2]); A.px(17, by + 1, GOLD[2]); A.hl(14, by + 2, 5, CLOTH.nile[2]); A.px(16, by + 3, '#ffffff'); A.px(15, by + 4, GOLD[1]); A.px(17, by + 3, CLOTH.nile[2]); }
        if (acc === 'collar') { A.hl(bx + 1, by, bw - 2, GOLD[1]); A.hl(bx + 1, by + 1, bw - 2, CLOTH.nile[1]); A.hl(bx + 2, by + 2, bw - 4, CLOTH.red[1]); A.hl(bx + 3, by + 3, bw - 6, GOLD[1]); A.r(15, by, 2, 1, skin); }
        if (acc === 'canteen') { A.line(bx + bw - 2, by, bx + 1, by + 7, '#5c3418'); A.r(bx, by + 6, 3, 3, '#9cacb8'); A.px(bx + 1, by + 5, '#4c5a66'); }
    } else if (dir === DIR.up && acc === 'collar') { A.hl(bx + 1, by, bw - 2, GOLD[1]); A.hl(bx + 1, by + 1, bw - 2, CLOTH.nile[1]); }
    else if (side && acc === 'collar') { A.hl(bx, by, bw, GOLD[1]); A.hl(bx, by + 1, bw, CLOTH.nile[1]); }
    if (side && acc === 'canteen') A.r(s < 0 ? bx + bw - 3 : bx, by + 5, 3, 3, '#9cacb8');
    if (acc === 'scarf') { A.r(bx + (side ? 1 : 2), by - 1, bw - (side ? 2 : 4), 2, CLOTH.red[1]); if (dir === DIR.down) A.vl(bx + 3, by + 1, 4, CLOTH.red[2]); if (side) A.vl(s < 0 ? bx + bw - 2 : bx + 1, by + 1, 4, CLOTH.red[2]); }

    // ---- arms ----
    const armSkin = (y0) => sleeveless ? by + 1 : shortSl ? by + 3 : 99;
    const arm = (x, dy, shade) => {
        for (let y = 0; y < 6; y++) A.r(x, by + 1 + dy + y, 2, 1, by + 1 + y >= armSkin() ? (shade ? skinD : skin) : cloth[shade ? 2 : 1]);
        A.r(x, by + 7 + dy, 2, 1, skin);
        if (acc === 'bracelets') A.r(x, by + 6 + dy, 2, 1, GOLD[1]);
    };
    if (!side) {
        const sw = [0, 0]; if (f === 1) { sw[0] = 1; sw[1] = -1; } if (f === 2) { sw[0] = -1; sw[1] = 1; }
        arm(bx - 2, sw[0], false); arm(bx + bw, sw[1], true);
    } else arm(15 + (f === 1 ? -2 : f === 2 ? 2 : 0), 0, true);

    // ---- head ----
    const hx = 16, hy = 10 + bob + kid, rx = 6, ry = 6;
    const hs = L.hairStyle || (L.long ? 'long' : 'short'), hw = L.head || 'none';
    const rowW = (y) => { const k = 1 - (y * y) / ((ry + 0.5) * (ry + 0.5)); return Math.round((rx + 0.5) * Math.sqrt(Math.max(0, k)) - 0.5); };
    const cap = (col, rows, from) => { for (let y = -ry + (from || 0); y < -ry + rows; y++) { const w = rowW(y); A.r(hx - w, hy + y, w * 2 + 1, 1, col); } };
    // hair that hangs behind the head is drawn first
    if (hs === 'curls') { A.ell(hx, hy - 2, 8, 7, hair); for (let i = 0; i < 9; i++) A.px(hx - 8 + i * 2, hy - 8 + ((i * 3) % 3), hairD); }
    if ((hs === 'long' || hs === 'waves' || hs === 'braids' || hs === 'cleo') && dir !== DIR.up) { const len = hs === 'cleo' ? 7 : 9; A.r(hx - 7, hy - 2, 15, len, hair); if (hs === 'waves') { A.px(hx - 8, hy + 2, hair); A.px(hx + 8, hy + 4, hair); A.px(hx - 8, hy + 5, hair); } }
    A.ell(hx, hy, rx, ry, skin);
    if (dir !== DIR.up) { A.px(hx - 5, hy + 3, skinD); A.px(hx + 5, hy + 3, skinD); A.hl(hx - 3, hy + 6, 7, skinD); }
    // hair on the head
    const bald = hs === 'bald' || hs === 'sidelock';
    if (dir === DIR.up) {
        if (bald) cap(skinD, 3);
        else if (hs === 'mohawk') { cap(skinD, 4); A.r(hx - 1, hy - 8, 3, 12, hair); }
        else { A.ell(hx, hy, rx, ry, hs === 'buzz' ? hairD : hair); A.hl(hx - 3, hy + 6, 7, skin); if (hs === 'buzz') cap(hair, 5); }
        if (hs === 'long' || hs === 'waves' || hs === 'braids') { A.r(hx - 6, hy + 3, 13, 7, hair); if (hs === 'braids') for (let i = -5; i <= 5; i += 2) { A.vl(hx + i, hy + 4, 6, hairD); A.px(hx + i, hy + 10, GOLD[1]); } if (hs === 'waves') for (let i = -5; i <= 5; i += 3) A.px(hx + i, hy + 10, hair); }
        if (hs === 'cleo' || hs === 'bob') A.r(hx - 6, hy + 3, 13, hs === 'bob' ? 3 : 5, hair);
        if (hs === 'pony') { A.r(hx - 1, hy + 2, 3, 9, hair); A.r(hx - 2, hy + 3, 5, 2, CLOTH.red[1]); }
        if (hs === 'bun') A.ell(hx, hy - 7, 3, 2, hair);
        if (hs === 'sidelock') { A.r(hx + 4, hy - 4, 2, 11, hair); A.px(hx + 3, hy + 7, hair); }
        if (hs === 'curls') A.ell(hx, hy - 1, 8, 7, hair);
    } else if (!bald) {
        const rows = hs === 'buzz' ? 3 : side ? 5 : 4;
        if (hs === 'mohawk') { A.r(hx - 1 + s, hy - 8, 3, 5, hair); cap(skinD, 2); }
        else {
            cap(hs === 'buzz' ? hairD : hair, rows);
            if (side) { const back = -s; A.r(hx + back * 3 - (back < 0 ? 3 : 0), hy - 3, 4, hs === 'buzz' ? 3 : 6, hs === 'buzz' ? hairD : hair); }
            else if (hs !== 'buzz') { A.vl(hx - 6, hy - 2, 3, hair); A.vl(hx + 6, hy - 2, 3, hair); }
        }
        if (hs === 'cleo' && dir === DIR.down) { A.r(hx - 5, hy - 2, 11, 2, hair); A.hl(hx - 5, hy, 11, hairD); }                // the straight fringe
        if (hs === 'bob') { if (side) A.r(hx - s * 6 - (s > 0 ? 0 : 3), hy - 3, 4, 8, hair); else { A.r(hx - 7, hy - 2, 2, 7, hair); A.r(hx + 6, hy - 2, 2, 7, hair); } }
        if ((hs === 'long' || hs === 'waves' || hs === 'braids' || hs === 'cleo') && side) A.r(hx - s * 6 - (s > 0 ? 0 : 3), hy - 3, 4, hs === 'cleo' ? 9 : 11, hair);
        if ((hs === 'long' || hs === 'waves' || hs === 'braids' || hs === 'cleo') && !side) { A.r(hx - 7, hy - 2, 2, hs === 'cleo' ? 8 : 10, hair); A.r(hx + 6, hy - 2, 2, hs === 'cleo' ? 8 : 10, hair); }
        if (hs === 'braids') { if (side) { A.vl(hx - s * 5, hy + 1, 7, hairD); A.px(hx - s * 5, hy + 8, GOLD[1]); } else for (const bxx of [hx - 7, hx + 7]) { A.vl(bxx, hy + 1, 7, hairD); A.px(bxx, hy + 8, GOLD[1]); } }
        if (hs === 'pony' && side) { A.r(hx - s * 8 - (s > 0 ? 0 : 1), hy - 1, 3, 8, hair); A.px(hx - s * 7, hy - 1, CLOTH.red[1]); }
        if (hs === 'pony' && !side) A.r(hx + 5, hy - 5, 3, 3, hair);
        if (hs === 'bun') A.ell(hx - s * 2, hy - 7, 3, 2, hair);
        if (hs === 'curls') { cap(hair, 5); A.ell(hx, hy - 4, 8, 4, hair); if (!side) { A.r(hx - 8, hy - 3, 2, 6, hair); A.r(hx + 7, hy - 3, 2, 6, hair); } else A.r(hx - s * 8 - (s > 0 ? 0 : 2), hy - 4, 4, 8, hair); for (let i = 0; i < 7; i++) A.px(hx - 6 + i * 2, hy - 6 + (i & 1), hairD); }
    }
    if (hs === 'sidelock' && dir !== DIR.up) { if (side) { if (s > 0) { A.r(hx - 2, hy - 5, 2, 12, hair); A.px(hx - 3, hy + 7, hair); } } else { A.r(hx + 5, hy - 4, 2, 11, hair); A.px(hx + 4, hy + 7, hair); A.px(hx + 5, hy + 6, GOLD[1]); } }

    // ---- face ----
    const face = L.face || (L.glasses ? 'glasses' : L.beard ? 'beard' : L.tache ? 'tache' : null);
    const beardCol = L.beard && L.beard !== true ? L.beard : L.tache && L.tache !== true ? L.tache : hair;
    const eye = '#1c1814';
    if (dir === DIR.down) {
        A.r(hx - 3, hy + 1, 1, 2, eye); A.r(hx + 3, hy + 1, 1, 2, eye);
        if (face === 'kohl') { A.px(hx - 4, hy + 1, eye); A.px(hx - 5, hy + 2, eye); A.px(hx + 4, hy + 1, eye); A.px(hx + 5, hy + 2, eye); A.px(hx - 3, hy, CLOTH.faience[1]); A.px(hx + 3, hy, CLOTH.faience[1]); }
        if (face === 'glasses') { A.r(hx - 4, hy + 1, 3, 2, '#e8eaf0'); A.r(hx + 2, hy + 1, 3, 2, '#e8eaf0'); A.px(hx - 3, hy + 1, eye); A.px(hx + 3, hy + 1, eye); A.hl(hx - 1, hy + 1, 3, '#4c5a66'); }
        if (face === 'shades') { A.r(hx - 5, hy + 1, 4, 2, '#1c1814'); A.r(hx + 2, hy + 1, 4, 2, '#1c1814'); A.hl(hx - 1, hy + 1, 3, '#1c1814'); A.px(hx - 4, hy + 1, '#748490'); A.px(hx + 3, hy + 1, '#748490'); }
        if (face === 'monocle') { A.r(hx + 2, hy, 3, 4, GOLD[1]); A.r(hx + 3, hy + 1, 1, 2, '#e8eaf0'); A.px(hx + 3, hy + 1, eye); A.vl(hx + 5, hy + 4, 3, GOLD[2]); }
        if (face === 'beard') { A.r(hx - 3, hy + 4, 7, 3, beardCol); A.r(hx - 4, hy + 3, 1, 2, beardCol); A.r(hx + 4, hy + 3, 1, 2, beardCol); }
        if (face === 'tache') A.r(hx - 2, hy + 4, 5, 1, beardCol);
        if (face === 'goatee') { A.r(hx - 1, hy + 4, 3, 1, beardCol); A.r(hx - 1, hy + 5, 3, 2, beardCol); }
        if (face === 'stubble') { A.dith(hx - 4, hy + 4, 9, 3, skinD, 0); }
        if (face === 'freckles') { A.px(hx - 4, hy + 3, skinD); A.px(hx - 2, hy + 4, skinD); A.px(hx + 4, hy + 3, skinD); A.px(hx + 2, hy + 4, skinD); }
        if (face === 'scar') { A.px(hx + 4, hy, '#fbe0cc'); A.px(hx + 4, hy + 3, '#fbe0cc'); A.px(hx + 5, hy + 4, '#fbe0cc'); }
    } else if (side) {
        A.r(hx + s * 3, hy + 1, 1, 2, eye);
        if (face === 'kohl') { A.px(hx + s * 2, hy + 1, eye); A.px(hx + s * 3, hy, CLOTH.faience[1]); }
        if (face === 'glasses') { A.r(hx + s * 2 - (s < 0 ? 2 : 0), hy + 1, 3, 2, '#e8eaf0'); A.px(hx + s * 3, hy + 1, eye); }
        if (face === 'shades') A.r(hx + s * 2 - (s < 0 ? 3 : 0), hy + 1, 4, 2, '#1c1814');
        if (face === 'monocle' && s > 0) { A.r(hx + 2, hy, 3, 4, GOLD[1]); A.px(hx + 3, hy + 1, eye); }
        if (face === 'beard') A.r(hx + (s < 0 ? -5 : 1), hy + 4, 5, 3, beardCol);
        if (face === 'tache') A.r(hx + (s < 0 ? -5 : 3), hy + 4, 3, 1, beardCol);
        if (face === 'goatee') A.r(hx + (s < 0 ? -5 : 4), hy + 4, 2, 3, beardCol);
        if (face === 'stubble') A.dith(hx + (s < 0 ? -5 : 1), hy + 4, 5, 3, skinD, 0);
    }

    // ---- headwear, over the hair ----
    const T = L.headCol || null;
    if (hw === 'turban') { const C = T || CLOTH.white; A.ell(hx, hy - 4, 7, 4, C[1]); A.ell(hx - 1, hy - 5, 5, 2, C[0]); A.hl(hx - 6, hy - 2, 13, C[2]); A.line(hx - 4, hy - 6, hx + 3, hy - 3, C[2]); }
    else if (hw === 'hijab' || hw === 'keffiyeh') {
        const C = T || (hw === 'hijab' ? CLOTH.faience : CLOTH.white);
        if (dir === DIR.up) { A.ell(hx, hy, 7, 7, C[1]); A.r(hx - 6, hy + 5, 13, 4, C[1]); A.vl(hx + 5, hy - 2, 9, C[2]); }
        else { cap(C[1], 5); A.r(hx - 7, hy - 3, 2, 10, C[1]); A.r(hx + 6, hy - 3, 2, 10, C[2]); A.r(hx - 6, hy + 6, 13, 3, C[1]); A.hl(hx - 6, hy + 8, 13, C[2]); if (side) A.r(hx - s * 7 - (s > 0 ? 0 : 3), hy - 4, 4, 12, C[1]); A.px(hx - 3, hy - 3, C[0]); }
        if (hw === 'keffiyeh') { if (L.check) for (let y = -6; y < 9; y += 2) for (let x = -7; x <= 7; x += 2) { const col = g.getImageData(hx + x, hy + y, 1, 1).data; if (col[3] && col[0] > 200 && col[1] > 200) A.px(hx + x, hy + y, L.check); } A.hl(hx - 6, hy - 3, 13, '#1c1814'); }
    }
    else if (hw === 'cap' || hw === 'skullcap') { const C = T || (hw === 'cap' ? CLOTH.nile : CLOTH.white); A.ell(hx, hy - 4, 6, 3, C[1]); A.hl(hx - 5, hy - 6, 9, C[0]); if (hw === 'cap' && dir !== DIR.up) A.r(hx - 4 + s * 4, hy - 2, 9, 2, C[2]); if (hw === 'skullcap') A.hl(hx - 6, hy - 2, 13, C[2]); }
    else if (hw === 'hat') { const C = T || CLOTH.sand; A.ell(hx, hy - 2, 9, 2, C[2]); A.ell(hx, hy - 3, 9, 2, C[1]); A.r(hx - 5, hy - 8, 11, 5, C[1]); A.hl(hx - 4, hy - 8, 9, C[0]); A.hl(hx - 5, hy - 4, 11, '#5c3418'); }
    else if (hw === 'pith') { const C = T || CLOTH.linen; A.ell(hx, hy - 2, 8, 2, C[2]); A.ell(hx, hy - 3, 8, 2, C[1]); A.ell(hx, hy - 5, 6, 4, C[1]); A.ell(hx - 1, hy - 6, 4, 2, C[0]); A.hl(hx - 5, hy - 3, 11, CLOTH.khaki[2]); A.px(hx, hy - 9, C[2]); }
    else if (hw === 'straw') { const C = CLOTH.ochre; A.ell(hx, hy - 2, 10, 2, C[2]); A.ell(hx, hy - 3, 10, 2, C[0]); A.r(hx - 5, hy - 7, 11, 4, C[0]); A.hl(hx - 5, hy - 4, 11, CLOTH.red[1]); for (let i = -9; i <= 9; i += 3) A.px(hx + i, hy - 3, C[1]); }
    else if (hw === 'fez') { const C = CLOTH.red; A.r(hx - 4, hy - 10, 9, 6, C[1]); A.hl(hx - 4, hy - 10, 9, C[0]); A.vl(hx + 4, hy - 10, 6, C[2]); A.px(hx + 1, hy - 11, '#1c1814'); A.vl(hx + 2 + (s < 0 ? -4 : 0), hy - 10, 4, '#1c1814'); }
    else if (hw === 'bandana') { const C = T || CLOTH.red; cap(C[1], 4, 1); A.hl(hx - 6, hy - 2, 13, C[2]); A.px(hx - 3, hy - 4, '#ffffff'); A.px(hx + 2, hy - 3, '#ffffff'); if (dir === DIR.up) { A.r(hx - 1, hy - 1, 3, 4, C[1]); } else if (side) A.r(hx - s * 7, hy - 3, 2, 4, C[2]); else A.r(hx + 6, hy - 2, 2, 4, C[2]); }
    else if (hw === 'nemes') {                                       // the striped royal headcloth, a cobra at the brow
        const C = CLOTH.ochre, B = CLOTH.nile[2];
        if (dir === DIR.up) { A.ell(hx, hy, 7, 7, C[1]); A.r(hx - 7, hy + 2, 15, 8, C[1]); for (let y = -5; y < 10; y += 2) A.hl(hx - 7, hy + y, 15, B); A.r(hx - 1, hy + 6, 3, 5, C[1]); A.hl(hx - 1, hy + 8, 3, B); }
        else {
            cap(C[1], 5); for (let y = -5; y < -1; y += 2) { const w = rowW(y); A.hl(hx - w, hy + y, w * 2 + 1, B); }
            const lap = (x) => { A.r(x, hy - 3, 3, 12, C[1]); for (let y = -2; y < 9; y += 2) A.hl(x, hy + y, 3, B); };
            if (side) lap(hx - s * 6 - (s > 0 ? 0 : 2)); else { lap(hx - 8); lap(hx + 6); }
            A.hl(hx - 5, hy - 2, 11, C[0]); if (dir === DIR.down) { A.px(hx, hy - 3, CLOTH.red[1]); A.px(hx, hy - 4, C[0]); }
        }
    }
    else if (hw === 'circlet') { A.hl(hx - 6, hy - 2, 13, GOLD[1]); A.hl(hx - 5, hy - 3, 11, GOLD[0]); if (dir === DIR.down) { A.px(hx, hy - 3, CLOTH.nile[1]); A.px(hx, hy - 4, GOLD[0]); } }
    return outline(c);
}

function personSheet(look) {
    const frames = [];
    for (const dir of [0, 1, 2, 3]) frames.push([0, 1, 2].map(f => personFrame(look, dir, f)));
    return { frames };
}

// ============================================================
// THE CHARACTER CREATOR'S OPTIONS (ten or more in every category)
// ============================================================
const CLOTH_LIST = [['Khaki', 'khaki'], ['Linen white', 'linen'], ['Sand', 'sand'], ['Olive', 'olive'], ['Nile blue', 'nile'], ['Indigo', 'indigo'], ['Faience green', 'faience'], ['Pomegranate', 'red'], ['Terracotta', 'terracotta'], ['Royal purple', 'purple'], ['Basalt black', 'black'], ['Ochre gold', 'ochre']];
const CREATOR = [
    { key: 'skin', label: 'Skin', opts: ['Alabaster', 'Ivory', 'Sand', 'Wheat', 'Honey', 'Amber', 'Bronze', 'Copper', 'Umber', 'Ebony'] },
    { key: 'hair', label: 'Hair', opts: ['Short', 'Cropped', 'Shaved', 'Long', 'Ponytail', 'Bob', 'Curls', 'Braids and beads', 'Sidelock of youth', 'Top knot', 'Waves', 'Crest', 'Cleopatra cut'],
      ids: ['short', 'buzz', 'bald', 'long', 'pony', 'bob', 'curls', 'braids', 'sidelock', 'bun', 'waves', 'mohawk', 'cleo'] },
    { key: 'hairCol', label: 'Hair colour', opts: ['Black', 'Blue-black', 'Dark brown', 'Brown', 'Chestnut', 'Auburn', 'Henna red', 'Sand blonde', 'Grey', 'White', 'Lapis blue'] },
    { key: 'head', label: 'Headwear', opts: ['None', 'Field hat', 'Pith helmet', 'Straw hat', 'Turban', 'Keffiyeh', 'Headscarf', 'Skullcap', 'Fez', 'Cap', 'Bandana', 'Nemes', 'Gold circlet'],
      ids: ['none', 'hat', 'pith', 'straw', 'turban', 'keffiyeh', 'hijab', 'skullcap', 'fez', 'cap', 'bandana', 'nemes', 'circlet'] },
    { key: 'face', label: 'Face', opts: ['Plain', 'Glasses', 'Sunglasses', 'Kohl eyes', 'Moustache', 'Beard', 'Goatee', 'Stubble', 'Freckles', 'Scar', 'Monocle'],
      ids: [null, 'glasses', 'shades', 'kohl', 'tache', 'beard', 'goatee', 'stubble', 'freckles', 'scar', 'monocle'] },
    { key: 'top', label: 'Top', opts: ['Field shirt', 'Safari jacket', 'T-shirt', 'Sleeveless', 'Waistcoat', 'Football shirt', 'Trimmed tunic', 'Galabeya', 'Striped galabeya', 'Kaftan', 'Pleated kalasiris'],
      ids: ['shirt', 'jacket', 'tee', 'tank', 'vest', 'football', 'tunic', 'robe', 'robeStripe', 'kaftan', 'kalasiris'] },
    { key: 'topCol', label: 'Top colour', opts: CLOTH_LIST.map(c => c[0]) },
    { key: 'bot', label: 'Bottoms', opts: ['Trousers', 'Cargo trousers', 'Rolled trousers', 'Shorts', 'Baggy sirwal', 'Shendyt kilt', 'Pleated kilt', 'Wrap skirt', 'Long skirt', 'Jeans'],
      ids: ['trousers', 'cargo', 'rolled', 'shorts', 'sirwal', 'kilt', 'pleat', 'wrap', 'skirt', 'jeans'] },
    { key: 'botCol', label: 'Bottoms colour', opts: CLOTH_LIST.map(c => c[0]) },
    { key: 'shoes', label: 'Shoes', opts: ['Brown boots', 'Black boots', 'Desert boots', 'Riding boots', 'Leather sandals', 'Gold sandals', 'White trainers', 'Red trainers', 'Yellow slippers', 'Barefoot'],
      ids: [['boots', '#4c3020'], ['boots', '#242228'], ['shoes', '#b0945c'], ['riding', '#301c10'], ['sandals', '#804c28'], ['sandals', '#e8b030'], ['sneakers', '#c4c8d4'], ['sneakers', '#d04838'], ['babouche', '#e8b030'], ['barefoot', '']] },
    { key: 'acc', label: 'Accessory', opts: ['None', 'Satchel', 'Backpack', 'Camera', 'Binoculars', 'Canteen', 'Ankh pendant', 'Scarab amulet', 'Eye of Horus', 'Broad collar', 'Neck scarf', 'Gold bracelets'],
      ids: [null, 'satchel', 'backpack', 'camera', 'binoculars', 'canteen', 'ankh', 'scarab', 'horus', 'collar', 'scarf', 'bracelets'] },
];
// the choices a new character starts with
const CHOICES_M = { skin: 4, hair: 0, hairCol: 2, head: 1, face: 0, top: 0, topCol: 0, bot: 0, botCol: 8, shoes: 0, acc: 1 };
const CHOICES_F = { skin: 4, hair: 4, hairCol: 2, head: 1, face: 0, top: 0, topCol: 0, bot: 0, botCol: 8, shoes: 0, acc: 1 };

// the creator's choices (an index per category) → a look
function lookFromChoices(c, gender) {
    const opt = (key) => { const cat = CREATOR.find(k => k.key === key); return cat.ids ? cat.ids[c[key] % cat.ids.length] : c[key]; };
    const topId = opt('top'), topCol = CLOTH[CLOTH_LIST[c.topCol % CLOTH_LIST.length][1]], botCol = CLOTH[CLOTH_LIST[c.botCol % CLOTH_LIST.length][1]], sh = opt('shoes');
    const L = { skinCol: SKINS[c.skin % SKINS.length], hairStyle: opt('hair'), hairCol: HAIRS[c.hairCol % HAIRS.length], head: opt('head'), face: opt('face'), acc: opt('acc'),
        top: topCol, legs: botCol, botKind: opt('bot') === 'jeans' ? 'trousers' : opt('bot'), shoeKind: sh[0], shoe: sh[1], slim: gender === 'f' };
    if (opt('bot') === 'jeans') L.legs = CLOTH.indigo;
    if (topId === 'robe' || topId === 'robeStripe') { L.robe = topCol; if (topId === 'robeStripe') L.stripes = topCol[2]; }
    else L.topKind = topId;
    if (L.head === 'keffiyeh') L.check = CLOTH.red[1];
    return L;
}
function randomChoices() { const c = {}; for (const k of CREATOR) c[k.key] = Math.floor(Math.random() * k.opts.length); return c; }

// ============================================================
// THE CAST
// ============================================================
const LOOKS = {
    rais: { skin: 2, robe: CLOTH.white, head: 'turban', face: 'beard', beard: '#e8eaf0', shoeKind: 'sandals', shoe: '#804c28' },
    lindqvist: { skin: 0, top: ['#c4dcf0', '#a8c0d8', '#8098b0'], legs: CLOTH.sand, hairCol: HAIRS[7], hairStyle: 'buzz', face: 'glasses', shoe: '#5c3418' },
    hana: { skin: 1, top: CLOTH.pink, topKind: 'tunic', legs: CLOTH.grey, head: 'hijab', headCol: CLOTH.pink, shoeKind: 'sneakers', shoe: '#c4c8d4', slim: true },
    farouk: { skin: 2, robe: ['#3058a0', '#203c74', '#162a54'], head: 'keffiyeh', headCol: CLOTH.white, face: 'tache', tache: '#c4c8d4', shoe: '#1c1814' },
    saber: { skin: 2, top: CLOTH.red, topKind: 'football', legs: CLOTH.nile, botKind: 'shorts', hairCol: HAIRS[0], kid: true, shoeKind: 'sneakers', shoe: '#d04838' },
    hamid: { skin: 2, top: CLOTH.grey, topKind: 'jacket', legs: ['#748490', '#4c5a66', '#38424c'], head: 'cap', headCol: CLOTH.black, wide: true, face: 'tache', shoe: '#1c1814' },
    sayed: { skin: 2, robe: CLOTH.black, head: 'skullcap', headCol: CLOTH.white, wide: true, face: 'tache', shoeKind: 'babouche', shoe: '#e8b030' },
    oldwoman: { skin: 2, robe: ['#443c36', '#2e2824', '#1c1814'], head: 'hijab', headCol: ['#443c36', '#2e2824', '#1c1814'], shoe: '#1c1814', slim: true },
    lena: { skin: 0, top: CLOTH.black, topKind: 'jacket', legs: CLOTH.black, hairCol: HAIRS[7], hairStyle: 'buzz', shoe: '#1c1814', slim: true },
    guardman: { skin: 0, top: CLOTH.black, topKind: 'jacket', legs: CLOTH.black, hairCol: HAIRS[0], head: 'cap', headCol: CLOTH.black, shoe: '#1c1814' },
    worker1: { skin: 2, robe: ['#dccfa0', '#bfae7c', '#9a885c'], head: 'turban', face: 'tache', shoeKind: 'sandals', shoe: '#804c28' },
    worker2: { skin: 3, robe: ['#a8c0d8', '#88a0b8', '#687e96'], stripes: '#687e96', head: 'skullcap', headCol: CLOTH.white, shoeKind: 'sandals', shoe: '#804c28' },
    worker3: { skin: 2, top: CLOTH.olive, topKind: 'tee', legs: CLOTH.brown, botKind: 'sirwal', head: 'turban', headCol: CLOTH.sand, face: 'beard', shoe: '#1c1814' },
    // people who only appear in the opening
    petamun: { skin: 2, top: CLOTH.linen, topKind: 'kalasiris', hairStyle: 'bald', acc: 'collar', shoeKind: 'sandals', shoe: '#e8b030' },
    miriam: { skin: 1, top: CLOTH.khaki, topKind: 'jacket', legs: CLOTH.sand, hairCol: HAIRS[8], hairStyle: 'bob', acc: 'scarf', shoe: '#4c3020', slim: true },
};
// which look each person on the map wears (by the 3D object's id)
const CAST = {
    tariq_talk: 'rais', c1a_lindqvist: 'lindqvist', c1a_hana: 'hana', c1a_farouk: 'farouk', c1a_saber: 'saber',
    c1a_hamid: 'hamid', c1a_sayed: 'sayed', c1p_oldwoman: 'oldwoman', c1a_lena: 'lena', c1a_lenaman1: 'guardman', c1a_lenaman2: 'guardman',
};
