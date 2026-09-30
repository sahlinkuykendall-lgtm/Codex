// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE SYSTEMS (poke/systems.js)
// story/06_SYSTEMS.md, ported from the 3D build (story_systems.js, ch1a_extras.js):
//   SKILLS & XP  learn by doing; levels 0–5 (100/250/450/700/1000 XP); each background
//                starts with its own levels; a notice when one goes up
//   NEEDS        thirst and hunger drain with the story clock. Slow, never deadly: at empty
//                you can't run. The well, the water barrels, your canteen, tea; lentils at
//                the cooking table, dates. (Water and food show on the menu card and phone.)
//   INJURY       the seal's dart, a knock on the head: you limp (slower, no running) until
//                Hana patches you up or you rest
//   THE PHONE    P: map & tasks, messages, contacts & calls, bank & ledger, skills, notes,
//                photos
//   THE CAMERA   C: photograph what you're facing. New subjects train Photography; some are
//                evidence (the midnight visitors, their car's plate).
// Everything lives in Game.story, so it saves.
// ============================================================

// ---- skills ----
const SKILLS = {
    excavation: 'Excavation', hieroglyphs: 'Hieroglyphs', greek: 'Greek', coptic: 'Coptic',
    arabic: 'Egyptian Arabic', arabicRead: 'Arabic reading', photography: 'Photography', stealth: 'Stealth',
    climbing: 'Climbing', riding: 'Riding', firstAid: 'First aid', lockpicking: 'Lockpicking',
    haggling: 'Haggling', diving: 'Diving', desert: 'Desert survival',
};
const SKILL_XP = [0, 100, 250, 450, 700, 1000];      // total XP for levels 0..5
const BG_SKILLS = {                                    // story/01_CHARACTERS.md
    archaeologist: { excavation: 3, hieroglyphs: 2, greek: 1, coptic: 1, photography: 1, firstAid: 1 },
    inspector: { arabic: 5, arabicRead: 5, hieroglyphs: 2, excavation: 1, stealth: 1 },
    fixer: { arabic: 3, lockpicking: 2, haggling: 3, diving: 1, stealth: 1 },
    journalist: { photography: 3, stealth: 1, haggling: 1, arabic: 1 },
};
function skillsState() {
    const s = Story.s;
    if (!s.skills) {                                   // (older saves kept bare XP in s.xp: fold it in)
        s.skills = {};
        const base = BG_SKILLS[Game.player.bg] || {};
        for (const k in SKILLS) s.skills[k] = SKILL_XP[base[k] || 0] + ((s.xp || {})[k] || 0);
    }
    return s.skills;
}
skillLevel = function (k) { const xp = skillsState()[k] || 0; let l = 0; while (l < 5 && xp >= SKILL_XP[l + 1]) l++; return l; };
skillXP = function (k, amount, why) {
    if (!SKILLS[k] || !amount) return;
    const st = skillsState(), before = skillLevel(k);
    st[k] = Math.min(SKILL_XP[5], (st[k] || 0) + amount);
    const after = skillLevel(k);
    if (after > before) { Notice.show(SKILLS[k] + ' ' + after + '!' + (why ? ' (' + why + ')' : '')); Sfx.save(); }
};
// learning by talking: a little Arabic from every real conversation with someone who speaks it
const ARABIC_SPEAKERS = /^(Rais Abdallah|Hana|Uncle Farouk|Saber|Uncle Hamid|Gamal|Hagg Sayed|An Old Woman)$/;
(function () {
    const _sd = startDialogue;
    startDialogue = function (key) {
        _sd(key);
        const sc = STORY[key]; if (!sc) return;
        const sp = typeof sc.speaker === 'function' ? sc.speaker() : sc.speaker;
        if (ARABIC_SPEAKERS.test(sp || '') && !sflag('ar_' + key)) { sflag('ar_' + key, true); skillXP('arabic', 6); }
    };
})();
// XP for doing things in the story: run fn after a scene's choice (the one whose text has `match`)
function afterChoice(key, match, fn) {
    const sc = STORY[key]; if (!sc) return;
    const d = Object.getOwnPropertyDescriptor(sc, 'choices'); if (!d) return;
    const wrap = list => list.map(c => typeof c.text === 'string' && c.text.includes(match)
        ? Object.assign({}, c, { onSelect() { fn(); if (c.onSelect) c.onSelect.apply(this, arguments); } }) : c);
    if (d.get) Object.defineProperty(sc, 'choices', { get() { return wrap(d.get.call(this)); }, configurable: true });   // (built when the scene opens)
    else sc.choices = wrap(d.value);
}
afterChoice('c1a_trenchA_find', 'Fold', () => skillXP('excavation', 45, 'a clean find'));
afterChoice('c1a_trenchC', 'Note', () => { if (!sflag('xp_stake')) { sflag('xp_stake', true); skillXP('coptic', 45, 'reading the stake'); } });
afterChoice('c1a_digshed', 'Photograph', () => { if (!sflag('xp_digshed')) { sflag('xp_digshed', true); skillXP('photography', 10); } });
afterChoice('puzzle_glyph_solved', 'bronze', () => { skillXP('hieroglyphs', 70, 'the old seal'); skillXP('greek', 20); });
afterChoice('c1a_codex', 'Wrap', () => skillXP('greek', 35, 'the Codex\'s first page'));
afterChoice('c1a_lena_photo', 'Check', () => skillXP('photography', 40, 'photographs in the dark'));
afterChoice('c1a_lena_listen', 'breath', () => skillXP('stealth', 45, 'unseen'));
afterChoice('c1a_hana_done', 'Pocket', () => skillXP('excavation', 25));
afterChoice('c1a_hana_aid', 'Long story', () => skillXP('firstAid', 20));

// ---- needs: thirst and hunger ----
function needs() { const s = Story.s; if (!s.needs) s.needs = { water: 85, food: 80 }; return s.needs; }
const NEED_DRAIN = { water: 0.11, food: 0.06 };        // per story minute
(function () {
    const _adv = clockAdvance;
    clockAdvance = function (mins) {
        _adv(mins);
        const n = needs(), w0 = n.water, f0 = n.food;
        n.water = Math.max(0, n.water - NEED_DRAIN.water * mins); n.food = Math.max(0, n.food - NEED_DRAIN.food * mins);
        if (w0 > 20 && n.water <= 20) storyNotice('Thirsty. A well, the water jars, the barrels, your canteen (in the bag).');
        if (f0 > 20 && n.food <= 20) storyNotice('Hungry. The cooking table, the mess tent, or dates.');
        if (w0 > 0 && n.water <= 0) Notice.show('Parched. You can\'t run until you drink.');
        if (f0 > 0 && n.food <= 0) Notice.show('Starving. You can\'t run until you eat.');
    };
})();
function drink(amount, why) { const n = needs(); n.water = Math.min(100, n.water + amount); if (why) Toast.show(why + '   Water ' + Math.round(n.water) + '%'); }
function eat(amount, why) { const n = needs(); n.food = Math.min(100, n.food + amount); if (why) Toast.show(why + '   Food ' + Math.round(n.food) + '%'); }
function canRun() { const n = needs(); return !sflag('injured') && n.water > 0 && n.food > 0; }
function moveSpeed(run) { return sflag('injured') ? 66 : (run && canRun()) ? 168 : 96; }

// things to drink and eat in the camp
STORY_SCRIPTS.water_barrels = 'c1a_barrels';
STORY_SCRIPTS.ow_well = 'c1a_well';
STORY_SCRIPTS.fl_cooking = STORY_SCRIPTS.d_cooking = 'c1a_cooking';
const refill = () => { if (Game.bag.Canteen != null && (sflag('canteen') ?? 3) < 3) { sflag('canteen', 3); return ' You fill your canteen.'; } return ''; };
scene('c1a_barrels', {
    speaker: 'System',
    text: `Water barrels, blue plastic, a tin cup on a string. Two workmen stop talking when you come close, then start again in a lower voice about their wages.`,
    choices: [{ text: 'Drink a cup or two.', onSelect: () => { const r = refill(); drink(45, 'A cup of water'); if (r) Notice.show(r.trim()); } }, { text: 'Move on.' }],
});
scene('c1a_well', {
    speaker: 'System',
    text: `A well older than the camp, stone-lined, the rope worn glassy where hands have hauled it for a hundred years. The bucket comes up cold.`,
    choices: [{ text: 'Haul up the bucket and drink.', onSelect: () => { const r = refill(); drink(70, 'Cold well water'); if (r) Notice.show(r.trim()); } }, { text: 'Leave it.' }],
});
scene('c1a_cooking', {
    speaker: 'System',
    text: () => sflag('ate_at') != null && Story.s.clock - sflag('ate_at') < 180
        ? `The cook sees you coming and laughs. "Again? You ate an hour ago. Come back later, habibi."`
        : `The cooking table: a gas ring, a vast pot of lentils, a crate of tomatoes, bread wrapped in cloth. The cook waves a ladle at you like a threat and a promise.\n\n"Sit. Eat. Nobody on this site goes hungry. Not even the Swiss."`,
    get choices() {
        const c = [];
        if (!(sflag('ate_at') != null && Story.s.clock - sflag('ate_at') < 180)) c.push({ text: 'Eat a bowl of lentils with bread. (15 minutes)', onSelect: () => { sflag('ate_at', Story.s.clock); eat(65, 'Lentils and bread'); rel('workmen', 2, true); clockAdvance(15); } });
        c.push({ text: 'Move on.' });
        return c;
    },
});
// water and food all over the map: every map has a well; jars wherever people work; dates in season.
// (these are poke-style additions, so their objects are added to the story's list here)
POKE_MAP.objects.push(
    { id: 'c1w_well2', label: 'Bedouin Well', model: 'well' }, { id: 'c1w_zeer_dig', label: 'Water Jars', model: 'water jars' },
    { id: 'c1w_zeer_trench', label: 'Water Jars', model: 'water jars' }, { id: 'c1w_zeer_post', label: 'Water Jars', model: 'water jars' },
    { id: 'c1w_sabil', label: 'Sabil', model: 'sabil' }, { id: 'c1f_datepalm', label: 'Date Palm', model: 'date palm' }, { id: 'c1f_datepalm2', label: 'Date Palm', model: 'date palm' });
const WATER_JARS = {
    c1w_zeer_dig: `Two clay jars in the shade of the sieve, the kind every Egyptian village has: the water seeps through the clay and the desert air cools it. The workmen fill them from the barrels every morning.`,
    c1w_zeer_trench: `Water jars by the trench, a tin cup on a nail. Somebody has chalked on the stand in Arabic, and underneath, in English, in Lindqvist's hand: PLEASE DRINK. HEATSTROKE IS NOT A RESEARCH OUTCOME.`,
    c1w_zeer_post: `Farouk's water jars, under a scrap of awning. The water tastes of clay and is very cold. A fly drowns itself in the cup, happily.`,
    c1w_sabil: `A sabil: a little stone niche by the tomb with a jar of water in it, filled by somebody from the village for any stranger who passes. Nobody knows who fills it. It is always full.`,
};
for (const id in WATER_JARS) {
    STORY_SCRIPTS[id] = id;
    scene(id, { speaker: 'System', text: WATER_JARS[id], choices: [{ text: 'Drink.', onSelect: () => { const r = refill(); drink(40, 'Cool water from the jar'); if (r) Notice.show(r.trim()); } }, { text: 'Move on.' }] });
}
STORY_SCRIPTS.c1w_well2 = 'c1a_well2';
scene('c1a_well2', {
    speaker: 'System',
    text: `The Bedouin well: a ring of dressed stones, a pulley on two crooked posts, a leather bucket. It is older than the camp and older than the Ministry and, probably, older than the Bedouin.`,
    choices: [{ text: 'Haul up the bucket and drink.', onSelect: () => { const r = refill(); drink(70, 'Cold well water'); if (r) Notice.show(r.trim()); } }, { text: 'Leave it.' }],
});
STORY_SCRIPTS.c1f_datepalm = STORY_SCRIPTS.c1f_datepalm2 = 'c1a_datepalm';
const DATE_WAIT = 240;
const datesReady = id => sflag('dates_' + id) == null || Story.s.clock - sflag('dates_' + id) >= DATE_WAIT;
scene('c1a_datepalm', {
    speaker: 'System',
    get text() { return datesReady(Game.talkId) ? `A date palm in fruit, the bunches hanging heavy and amber under the crown. The low ones you can reach.` : `A date palm. You've had the low bunches; the rest are up where only the boys who climb palms for a living can get them. Later, maybe some will drop.`; },
    get choices() {
        const id = Game.talkId, c = [];
        if (datesReady(id)) c.push({ text: 'Pick a handful. (5 minutes)', onSelect: () => { sflag('dates_' + id, Story.s.clock); pocket('Dates', 3); eat(10, 'A fresh date'); clockAdvance(5); } });
        c.push({ text: 'Move on.' });
        return c;
    },
});
// things in the bag you can use (SPACE on them in the BAG)
const ITEM_USE = {
    Canteen: () => { const c = sflag('canteen') ?? 3; if (c <= 0) { Toast.show('The canteen is empty. Fill it at a well, the water jars or the barrels.'); return; } sflag('canteen', c - 1); drink(35, 'A swig from the canteen'); },
    Dates: () => { dropItem('Dates'); eat(14, 'A date'); },
    'Thermos of karkadeh': () => { dropItem('Thermos of karkadeh'); drink(50, 'Karkadeh, sour and cold'); },
    'Mint Tea': () => { dropItem('Mint Tea'); drink(18, 'Mint tea'); },
};
ITEM_INFO.Canteen = { key: 1, desc: 'Your canteen: three good swigs. SPACE here to drink. Fill it at a well, the water jars, the barrels or the mess tent urn.' };

// ---- injury ----
function setInjured(why) { sflag('injured', why || true); Notice.show('Injured: you\'re limping. Rest, or get it seen to.'); }
function healInjury(why) { if (!sflag('injured')) return; sflag('injured', null); Notice.show('Patched up' + (why ? ': ' + why : '.')); }

// ---- the money ledger (the phone's bank) ----
(function () {
    const _pay = storyPay;
    storyPay = function (amount, why) {
        _pay(amount, why);
        const L = Story.s.ledger || (Story.s.ledger = []);
        L.unshift({ t: clockStr(), a: amount, why: why || '' }); if (L.length > 40) L.pop();
    };
})();
// ---- messages ----
function storyMessage(from, text) {
    const M = Story.s.messages || (Story.s.messages = []);
    M.unshift({ from, text, t: clockStr(), unread: true });
    Notice.show('Message: ' + from + '. (P: phone)'); Sfx.tone(1320, 0.06, 'square', 0.04); setTimeout(() => Sfx.tone(1760, 0.08, 'square', 0.04), 90);
}
// ---- calls ----
const PHONE_CALLS = [
    { name: 'A.S. (Miriam\'s phone)', when: () => hasItem("Miriam's spare phone") && !sflag('called_amira') && !sflag('c1_exit'), scene: 'c1a_call_amira' },
];

// ---- photographs ----
// photographing what you face: new subjects train Photography; a few are evidence
const PHOTO_SUBJECTS = {
    c1a_lena: 'lena', c1a_lenaman1: 'lena', c1a_lenaman2: 'lena', c1a_mason: 'The mason\'s marks', c1p_falsedoor: 'The false door', fl_stake_sam: 'Miriam\'s red stake',
    fl_digshed: 'The dig shed clipboard', puzzle_glyph: 'Petamun\'s seal', ow_wreck: 'The 1926 truck', c1p_oldwoman: null,
};
function takePhoto() {
    if (!Game.map.outdoor && !Game.target) { Toast.show('Nothing to photograph here.'); return; }
    const e = Game.target, P = Story.s.photos || (Story.s.photos = []);
    Camera.flash = 0.35; Sfx.tone(2400, 0.03, 'square', 0.05); setTimeout(() => Sfx.tone(900, 0.05, 'triangle', 0.05), 60);
    if (e && PHOTO_SUBJECTS[e.id] === 'lena' && sflag('lena_event') === 'searching' && !sflag('lena_photos')) { startDialogue('c1a_lena_photo'); return; }
    if (e && e.id === 'c1p_oldwoman') { Toast.show('She lifts a hand in front of the lens. "No, my child."'); return; }
    const what = e ? (PHOTO_SUBJECTS[e.id] || e.label || 'Something') : (Game.nearPlace() ? Game.nearPlace().name.replace(/^THE /, '').toLowerCase().replace(/^\w/, c => c.toUpperCase()) : 'The desert at night');
    if (!P.some(p => p.what === what)) { skillXP('photography', e && PHOTO_SUBJECTS[e.id] ? 15 : 4); }
    P.unshift({ what, t: clockStr(), where: Game.placeName().replace(/^THE /, '') }); if (P.length > 30) P.pop();
    Toast.show('Photo: ' + what);
}
const Camera = { flash: 0, draw(g, dt) { if (this.flash <= 0) return; this.flash -= dt; g.fillStyle = 'rgba(255,255,255,' + Math.max(0, this.flash * 2).toFixed(2) + ')'; g.fillRect(0, 0, Game.VW, Game.VH); } };

// ============================================================
// THE PHONE (P)
// ============================================================
const Phone = {
    open: false, tab: 0, sel: 0, t: 0,
    TABS: ['MAP', 'MESSAGES', 'CONTACTS', 'BANK', 'SKILLS', 'NOTES', 'PHOTOS'],
    toggle() { this.open = !this.open; this.sel = 0; Sfx.move(); if (this.open && this.TABS[this.tab] === 'MESSAGES') this.readAll(); },
    readAll() { for (const m of Story.s.messages || []) m.unread = false; },
    rows() {
        const s = Story.s, T = this.TABS[this.tab];
        if (T === 'MAP') {
            const m = Game.maps.ch1, [x, y] = Game.outdoorPos();
            const found = m.places.filter(p => Game.seen[p.id]).map(p => ['◆ ' + p.name.replace(/^THE /, ''), Math.round(Math.hypot(p.x - x, p.y - y) / 32) + ' m']);
            const tasks = s.tasks.filter(t => !t.done).map(t => ['☐ ' + t.text, '']);
            return [['TASKS', '', 1]].concat(tasks.length ? tasks : [['Nothing pressing. Explore.', '']], [['PLACES FOUND (' + found.length + '/' + m.places.length + ')', '', 1]], found);
        }
        if (T === 'MESSAGES') return (s.messages || []).map(m => [m.from + '  ' + m.t, m.text]).concat((s.messages || []).length ? [] : [['No messages. The signal out here is terrible anyway.', '']]);
        if (T === 'CONTACTS') {
            const people = Object.keys(REL_NAMES).filter(k => s.rel[k] !== undefined).map(k => [REL_NAMES[k], relTier(relGet(k))]);
            const calls = PHONE_CALLS.filter(c => c.when()).map(c => ['☎ Call ' + c.name, '', 0, c]);
            return calls.concat([['PEOPLE', '', 1]], people.length ? people : [['Nobody yet.', '']]);
        }
        if (T === 'BANK') return [[money().toLocaleString('en') + ' EGP', 'balance', 1]].concat((s.ledger || []).map(l => [l.why || 'Payment', (l.a > 0 ? '+' : '−') + Math.abs(l.a).toLocaleString('en') + '  ' + l.t]));
        if (T === 'SKILLS') return Object.keys(SKILLS).map(k => { const l = skillLevel(k); return [SKILLS[k], '●'.repeat(l) + '○'.repeat(5 - l), 0, null, k]; });
        if (T === 'NOTES') return Game.journal.map(j => [j.label, j.text]);
        return (s.photos || []).map(p => [p.what, p.where + '  ' + p.t]).concat((s.photos || []).length ? [] : [['No photos yet. Press C to take one of whatever you\'re facing.', '']]);
    },
    update(dt, I) {
        this.t += dt;
        if (I.back || I.menu || I.phone) { this.open = false; Sfx.back(); return; }
        const n = this.TABS.length;
        if (I.left) { this.tab = (this.tab + n - 1) % n; this.sel = 0; Sfx.move(); if (this.TABS[this.tab] === 'MESSAGES') this.readAll(); }
        if (I.right) { this.tab = (this.tab + 1) % n; this.sel = 0; Sfx.move(); if (this.TABS[this.tab] === 'MESSAGES') this.readAll(); }
        const rows = this.rows();
        if (I.up) { this.sel = Math.max(0, this.sel - 1); Sfx.tick(); }
        if (I.down) { this.sel = Math.min(rows.length - 1, this.sel + 1); Sfx.tick(); }
        const r = rows[this.sel];
        if (I.ok && r && r[3]) { this.open = false; startDialogue(r[3].scene); }
    },
    draw(g) {
        const VW = Game.VW, VH = Game.VH, A = pa(g), s = Story.s;
        g.fillStyle = 'rgba(8,10,28,0.55)'; g.fillRect(0, 0, VW, VH);
        const w = Math.min(VW - 20, 250), h = VH - 16, x = (VW - w) >> 1, y = 8;
        // the handset: dark bezel, lit screen
        A.r(x + 3, y, w - 6, h, '#101418'); A.r(x, y + 3, w, h - 6, '#101418'); A.r(x + 2, y + 2, w - 4, h - 4, '#2a3038');
        A.r(x + 1, y + 6, 1, h - 12, '#3a4450'); A.r(x + w / 2 - 10, y + 5, 20, 2, '#0a0c10');
        const sx = x + 8, sy = y + 12, sw = w - 16, sh = h - 30;
        A.r(sx, sy, sw, sh, '#e8eef0');
        // status bar: time, name, signal, water and food
        A.r(sx, sy, sw, 13, '#203c74');
        Txt.draw(g, clockStr(), sx + 4, sy, { col: '#ffffff' });
        const n = needs();
        Txt.draw(g, 'W ' + Math.round(n.water) + '%  F ' + Math.round(n.food) + '%', sx + sw - 4, sy, { col: n.water <= 20 || n.food <= 20 ? '#ffb0a0' : '#c8d8ff', align: 'right' });
        // tabs: the current one, and ◄ ► for the others
        const unread = (s.messages || []).filter(m => m.unread).length;
        A.r(sx, sy + 13, sw, 15, '#c8d8ec');
        const T = this.TABS[this.tab];
        Txt.draw(g, '◄  ' + T + (T !== 'MESSAGES' && unread ? '  •' + unread : '') + '  ►', sx + sw / 2, sy + 15, { col: UI.ink, align: 'center' });
        // the list
        const rows = this.rows(), top0 = sy + 32, maxY = sy + sh - 4, lw = sw - 12;
        g.save(); g.beginPath(); g.rect(sx, top0 - 2, sw, maxY - top0 + 2); g.clip();
        let yy = top0 - Math.max(0, this.scrollFor(rows, lw, maxY - top0));
        rows.forEach((r, i) => {
            const on = i === this.sel, head = r[2] === 1;
            const main = Txt.wrap(r[0], lw - (r[1] && T !== 'MESSAGES' && T !== 'NOTES' && r[1].length < 22 ? Txt.width(r[1]) + 8 : 0));
            const sub = (T === 'MESSAGES' || T === 'NOTES' || T === 'PHOTOS') && on ? Txt.wrap(r[1], lw) : [];
            const hgt = (main.length + sub.length) * 12 + 3;
            if (on && !head) A.r(sx + 2, yy - 1, sw - 4, hgt, '#d8ecff');
            main.forEach((ln, j) => Txt.draw(g, ln, sx + 6, yy + j * 12, { col: head ? UI.gold : on ? UI.ink : '#50505c' }));
            if (r[1] && !sub.length && T !== 'MESSAGES' && T !== 'NOTES') Txt.draw(g, r[1], sx + sw - 6, yy, { col: T === 'BANK' && r[1][0] === '−' ? '#b03828' : T === 'BANK' && r[1][0] === '+' ? '#3a7a30' : '#3058a0', align: 'right' });
            sub.forEach((ln, j) => Txt.draw(g, ln, sx + 6, yy + (main.length + j) * 12, { col: '#3058a0' }));
            if (T === 'SKILLS' && r[4]) {                              // progress to the next level
                const k = r[4], l = skillLevel(k), xp = skillsState()[k] || 0, lo = SKILL_XP[l], hi = SKILL_XP[Math.min(5, l + 1)];
                A.r(sx + 6, yy + 12, lw, 2, '#c8d0d8'); A.r(sx + 6, yy + 12, Math.round(lw * (l >= 5 ? 1 : (xp - lo) / (hi - lo))), 2, '#e0a030');
                yy += 3;
            }
            yy += hgt;
        });
        g.restore();
        Txt.draw(g, '◄► apps   ▲▼ scroll' + (rows[this.sel] && rows[this.sel][3] ? '   SPACE call' : '') + '   P back', x + w / 2, y + h - 16, { col: '#8898d0', align: 'center' });
    },
    // keep the selected row in view
    scrollFor(rows, lw, viewH) {
        let y = 0, selTop = 0, selBot = 0;
        rows.forEach((r, i) => { const hh = (Txt.wrap(r[0], lw).length + (i === this.sel && ['MESSAGES', 'NOTES', 'PHOTOS'].includes(this.TABS[this.tab]) ? Txt.wrap(r[1], lw).length : 0)) * 12 + 3 + (this.TABS[this.tab] === 'SKILLS' ? 3 : 0); if (i === this.sel) { selTop = y; selBot = y + hh; } y += hh; });
        return selBot > viewH ? selBot - viewH : 0;
    },
};

// ---- the first messages: the department at the start, an unknown number at midnight ----
(function () {
    const _arr = c1aLenaArrive;
    c1aLenaArrive = function () {
        const was = sflag('lena_event');
        _arr();
        if (!was && sflag('lena_event')) setTimeout(() => storyMessage('Unknown number', 'Go to bed, Doctor. She would want you to.'), 2500);
    };
})();
function systemsNewGame() {
    Game.bag.Canteen = 1; sflag('canteen', 3);
    Story.s.messages = [{ from: 'Dept. of Egyptology', t: '20:30', unread: true, text: 'Advance of 8,000 EGP paid into your account for the Giza Western Field Survey. The Ministry expects the season report by the 30th. Good luck, and do try to keep the Swiss happy.' }];
    Story.s.ledger = [{ t: '20:30', a: money(), why: 'Season advance (Dept. of Egyptology)' }];
    skillsState();
}
