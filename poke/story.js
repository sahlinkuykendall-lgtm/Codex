// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE STORY ENGINE (poke/story.js)
// Everything the story runs on, kept in Game.story so it saves and loads
// with the game:
//   flags        sflag('payroll', 'paid') · sflag('payroll')
//   affinity     rel('abdallah', 10)   (-100…100, "… will remember that.")
//   reputation   rep('ministry', 10)
//   money        storyPay(-6000, 'The men\'s wages') · money()
//   key items    pocket('Miriam\'s keys') · hasItem() · dropItem()  (they live in Game.bag)
//   tasks        task('payroll', 'Talk to the Rais about the wages') · taskDone('payroll')
//   the clock    Game.story.clock, minutes since midnight of the first day (see step 2)
//
// Conversations are scenes in the same shape as the 3D build's
// (ch1a_story.js), so they port across nearly as they are:
//   scene('key', { speaker, text, choices: [{ text, onSelect, nextScene, when }] })
//   speaker / text / a choice's text can be functions; `get choices()` works too.
//   startDialogue('key') runs one. A choice runs onSelect, then nextScene if it
//   has one; with neither, the conversation ends. end() is there for the 3D
//   code that calls it (the box is already closed by then).
// A person or thing runs a scene instead of its single line when its id is in
// STORY_SCRIPTS (see Game.examine).
// ============================================================

const STORY_START = {
    archaeologist: { money: 8000, rep: { ministry: 10, gebali: -10 }, rel: { amira: 10 } },
    inspector: { money: 3000, rep: { ministry: 20 }, rel: {} },
    fixer: { money: 500, rep: { gebali: 10, ministry: -10 }, rel: {} },
    journalist: { money: 12000, rep: {}, rel: {} },
};
const REL_NAMES = {
    abdallah: 'Rais Abdallah', lindqvist: 'Dr. Lindqvist', hana: 'Hana', farouk: 'Uncle Farouk',
    saber: 'Saber', hamid: 'Uncle Hamid', workmen: 'The workmen', amira: 'Dr. Amira Sayed', lena: 'Lena Brandt', bosta: 'Bosta',
};
const REP_NAMES = {
    ministry: 'The Ministry', gebali: 'The Gebali network', vasse: 'The Vasse Foundation',
    keepers: 'The Keepers', bedouin: 'The Bedouin', nubian: 'The Nubian community',
};
// what the story's items are (the bag shows key items first, with a star)
const ITEM_INFO = {
    "Miriam's keys": { key: 1, desc: 'Miriam\'s key ring: the dig gate, the trenches, the shaft. Not the find store: she kept that key on her.' },
    "Miriam's notebook page": { key: 1, desc: '"Osiris Shaft, level 3. The niche was behind the plaster. I have put it somewhere safer. The find store key is in B, under the red stake. Owl, eye, serpent, lion. I opened it once. I closed it again. Don\'t."' },
    'Find-store key (MAG)': { key: 1, desc: 'A small brass key on a cardboard tag marked MAG: magazine, the find store.' },
    'The Codex': { key: 1, desc: 'A leather-bound papyrus codex, Late Antique, in Miriam\'s green scarf. Greek, with hieroglyph-like marks beside some lines.' },
    "Miriam's note": { key: 1, desc: '"Whoever finds this: don\'t give it to Vasse. Take it to Father Bishoy, Café El-Fishawy, Cairo, Thursday. M."' },
    'Bronze seal of Petamun': { key: 1, desc: 'A bronze seal the size of your palm, green with age: ΠΕΤΑΜΟΥΝ in Greek, and an ibis.' },
    'Conservation wax': { key: 1, desc: 'Hana\'s dark wax. "For anything you need to close again without anyone knowing."' },
    'Coupling pin': { desc: 'A greased coupling pin wrapped in newspaper. Uncle Hamid\'s supply line needs one.' },
    'Photos: the midnight visitors': { key: 1, desc: 'Eleven frames on your phone: the woman in charge, her two men, and the car\'s plate, diplomatic green.' },
    "Lena Brandt's card": { key: 1, desc: 'LENA BRANDT · SECURITY · VASSE FOUNDATION, GENEVA. A phone number, nothing else.' },
    "Vasse's card": { key: 1, desc: 'CONRAD VASSE, WITH COMPLIMENTS. It came with five thousand pounds.' },
    'Half-burned papers': { key: 1, desc: 'From Lindqvist\'s burn bin: Vasse Foundation transfer slips, and an email. "Dr. Hale\'s cooperation is no longer required."' },
    'Mint Tea': { desc: 'A glass of mint tea, poured from a height, with foam on it. Saber would approve.' },
};

const Story = {
    fresh(bg) {
        const st = STORY_START[bg] || STORY_START.archaeologist;
        return { v: 1, flags: {}, rel: Object.assign({}, st.rel), rep: Object.assign({}, st.rep), money: st.money, tasks: [], clock: 20 * 60 + 30 };
    },
    get s() { return Game.story || (Game.story = this.fresh(Game.player.bg)); },
    // load an old save (or one from before the story engine)
    restore(d) { const f = this.fresh(Game.player.bg); return d ? Object.assign(f, d, { flags: d.flags || {}, rel: d.rel || {}, rep: d.rep || {}, tasks: d.tasks || [] }) : f; },
};

// ---- the player, for the words people use ----
const PC = {
    get name() { return Game.player.name || 'Hale'; },
    get first() { return this.name.trim().split(/\s+/)[0]; },
    get surname() { const p = this.name.trim().split(/\s+/); return p[p.length - 1]; },
    get female() { return Game.player.gender === 'f'; },
    get they() { return this.female ? 'she' : 'he'; }, get them() { return this.female ? 'her' : 'him'; }, get their() { return this.female ? 'her' : 'his'; },
    get honor() { return this.female ? 'ya hanem' : 'ya basha'; },
    get title() { return this.female ? 'Madame' : 'Mister'; },
    get doctor() { return 'Doctor ' + this.surname; },
};

// ---- flags, affinity, reputation ----
function sflag(k, v) { const f = Story.s.flags; if (v === undefined) return f[k]; f[k] = v; return v; }
function relGet(who) { return Story.s.rel[who] || 0; }
function rel(who, delta, quiet) {
    const r = Story.s.rel;
    r[who] = Math.max(-100, Math.min(100, (r[who] || 0) + delta));
    if (!quiet && Math.abs(delta) >= 10) storyNotice((REL_NAMES[who] || who) + (delta > 0 ? ' will remember that.' : ' won\'t forget that.'));
}
function relTier(v) { return v <= -50 ? 'Hostile' : v <= -10 ? 'Cold' : v < 20 ? 'Neutral' : v < 50 ? 'Warm' : v < 80 ? 'Trusted' : 'Bonded'; }
function repGet(f) { return Story.s.rep[f] || 0; }
function rep(f, delta, quiet) {
    const r = Story.s.rep;
    r[f] = Math.max(-100, Math.min(100, (r[f] || 0) + delta));
    if (!quiet && Math.abs(delta) >= 10) storyNotice((REP_NAMES[f] || f) + ' took note.');
}

// ---- skills (step 6 builds skills and levels; until then XP is kept for them) ----
function skillXP(skill, n) { const x = Story.s.xp || (Story.s.xp = {}); x[skill] = (x[skill] || 0) + n; }
// a background's starting levels (story/01_CHARACTERS.md), plus a level per 100 XP until step 6 does it properly
const SKILL_START = {
    archaeologist: { english: 5, excavation: 3, hieroglyphs: 2, french: 1 },
    inspector: { arabic: 5, hieroglyphs: 2, investigation: 2 },
    fixer: { arabic: 3, lockpicking: 2, haggling: 3, diving: 1 },
    journalist: { english: 5, french: 2, photography: 3, investigation: 2 },
};
function skillLevel(skill) { return ((SKILL_START[Game.player.bg] || {})[skill] || 0) + Math.floor(((Story.s.xp || {})[skill] || 0) / 100); }

// ---- money ----
function money() { return Story.s.money; }
function storyPay(amount, why) {
    Story.s.money += amount;
    Toast.show((amount >= 0 ? '+' : '−') + Math.abs(amount).toLocaleString('en') + ' EGP' + (why ? '   ' + why : ''));
    if (amount > 0) Sfx.get();
}

// ---- items (the bag) ----
function hasItem(name, n) { return (Game.bag[name] || 0) >= (n || 1); }
function pocket(name, n, quiet) {
    Game.bag[name] = (Game.bag[name] || 0) + (n || 1);
    if (!quiet) { Toast.show((ITEM_INFO[name] && ITEM_INFO[name].key ? '★ ' : 'Got ') + name + (ITEM_INFO[name] && ITEM_INFO[name].key ? '' : '!')); Sfx.get(); }
}
function dropItem(name, n) {
    if (!Game.bag[name]) return;
    Game.bag[name] -= (n || 1);
    if (Game.bag[name] <= 0) delete Game.bag[name];
}

// ---- notes and tasks ----
function storyNote(title, text) { Game.note(title, text); }
function task(id, text) {
    const T = Story.s.tasks, t = T.find(q => q.id === id);
    if (t) { t.text = text; t.done = false; return; }
    T.unshift({ id, text, done: false });
    storyNotice('New task. (Esc → TASKS)');
}
function taskDone(id) {                   // ticked off, and moved below the open ones
    const T = Story.s.tasks, i = T.findIndex(q => q.id === id);
    if (i < 0 || T[i].done) return;
    const [t] = T.splice(i, 1); t.done = true; T.push(t);
}

// "Hana will remember that." — a quiet line in the corner that never says how
function storyNotice(text) { if (Game.set.notices !== 0) Notice.show(text); }
const Notice = {
    lines: [],
    show(text) { this.lines.push({ text, t: 0 }); if (this.lines.length > 4) this.lines.shift(); },
    draw(g, dt) {
        const A = pa(g), maxW = Math.max(150, Math.round(Game.VW * 0.42));
        let y = 58;                                                     // under the toast line
        this.lines = this.lines.filter(l => (l.t += dt) < 5);
        for (const l of this.lines) {
            const rows = Txt.wrap(l.text, maxW), h = rows.length * 12 + 4;
            const w = Math.max(...rows.map(r => Txt.width(r))) + 16, x = Game.VW - w - 6, slide = l.t < 0.25 ? l.t / 0.25 : l.t > 4.6 ? (5 - l.t) / 0.4 : 1;
            const xx = Math.round(x + (1 - slide) * (w + 8));
            A.r(xx, y, w, h, '#30302c'); A.r(xx + 1, y + 1, w - 2, h - 2, '#f8f0d8'); A.r(xx + 1, y + 1, 3, h - 2, '#c89020');
            rows.forEach((r, i) => Txt.draw(g, r, xx + 9, y + 2 + i * 12, { col: '#5c3418' }));
            y += h + 3;
        }
    },
};

// ---- the story clock ----
// Minutes since midnight of the first day. Chapter 1-A is one night: 20:30 to 04:40, one
// story minute for every 2 real seconds of play (arrival to midnight is about seven minutes).
// It only runs while you're walking about, not in a conversation or a menu. Resting skips it
// forward. It stops at 04:40 (the story has you gone before dawn); after the chapter-end card
// it runs free. When "Time of day" is on "Story clock" (the default), the light follows it.
// A chapter's scenes can define storyClockPassed(before, after) to fire things at set times.
const CLOCK_RATE = 1 / 2, CLOCK_END = 24 * 60 + 4 * 60 + 40;
function clockStr(m) { m = Math.floor(m === undefined ? Story.s.clock : m) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
function clockAt(h, min) { return (h < 12 ? 24 * 60 : 0) + h * 60 + (min || 0); }   // hours before noon count as "after midnight"
function storyHour() { return (Story.s.clock / 60) % 24; }
function clockAdvance(mins) {
    const s = Story.s, before = s.clock;
    s.clock = s.flags.ch1_complete ? s.clock + mins : Math.min(CLOCK_END, s.clock + mins);
    if (typeof storyClockPassed === 'function') storyClockPassed(before, s.clock);
}
function clockTick(dt) { clockAdvance(Math.min(0.25, dt) * CLOCK_RATE); }

// ---- minigames ----
// playMinigame(kind, opts, done): the real ones are in poke/minigames.js (sieve, tea, darts,
// the seal, the race). The fallback below only runs for a kind that has no minigame.
function playMinigame(kind, opts, done) {
    if (typeof Mini !== 'undefined' && MINIS[kind]) { Mini.open(kind, opts, done); return; }       // poke/minigames.js
    Sfx.ok();
    const r = Object.assign({ ok: true }, opts || {});
    if (kind === 'darts') r.score = 96 + Math.floor(Math.random() * 64);          // a stand-in round: beats the Rais's 132 about half the time
    done(r);
}

// ============================================================
// SCENES
// ============================================================
const STORY = {};          // every scene, by key
const STORY_SCRIPTS = {};  // entity id → scene key (or a function returning one, or null for its plain line)
function scene(key, def) { STORY[key] = def; }
function end() { }         // the box is closed before a choice runs; kept so ported 3D scenes read the same
const closeDialogue = end;
const _val = v => typeof v === 'function' ? v() : v;

function startDialogue(key) {
    const sc = STORY[key];
    if (!sc) { console.warn('startDialogue: no scene "' + key + '"'); return; }
    const ch = (sc.choices || []).filter(c => !c.when || c.when());
    Story.cur = key;
    Dlg.open(_val(sc.speaker), _val(sc.text), (i) => {
        Story.cur = null;
        const c = ch[i];
        if (!c) { if (sc.then) sc.then(); return; }
        if (c.onSelect) c.onSelect();
        if (c.nextScene) startDialogue(c.nextScene);
    }, ch.map(c => _val(c.text)));
}
// the scene an entity runs when you examine it, if any
function scriptFor(e) {
    if (e.script && STORY[e.script]) return e.script;                  // (things without an id can carry their own)
    if (!e.id || !(e.id in STORY_SCRIPTS)) return null;
    const s = STORY_SCRIPTS[e.id], k = typeof s === 'function' ? s(e) : s;
    return k && STORY[k] ? k : null;
}
