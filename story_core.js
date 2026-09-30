// ============================================================
// THE CODEX OF GIZA — NEW STORY CORE (story_core.js)
//
// The state the new story (story/ bible) runs on, shared by every
// chapter file:
//   - the player: name, gender → pronouns and forms of address,
//     background (Archaeologist / Inspector / Fixer / Journalist)
//   - relationships (rel) and faction reputation (rep), police heat,
//     and the optional "___ will remember that." notices
//   - the story clock (in-game time of night, shown on the HUD)
//   - New Game: the character-creation screen before the prologue
// Everything lives in gameState.story, so it saves and loads with the
// rest of gameState. See story/06_SYSTEMS.md and 03_CHOICES_AND_FLAGS.md.
// Loaded after title3d.js (last), so it can wrap anything before it.
// ============================================================

const STORY_BACKGROUNDS = [
    { id: 'archaeologist', name: 'THE ARCHAEOLOGIST', place: 'Giza dig camp', playable: true,
      blurb: 'A foreign field archaeologist, hired to take over a dig whose director has vanished. Good at the work. Bad at the politics.',
      starts: 'English · Hieroglyphs · Excavation · 8,000 EGP' },
    { id: 'inspector', name: 'THE INSPECTOR', place: 'Saqqara', playable: false,
      blurb: 'A junior Ministry inspector who noticed an entry scratched out of the evidence log.',
      starts: 'Arabic · Hieroglyphs · Investigation · 3,000 EGP' },
    { id: 'fixer', name: 'THE FIXER', place: 'Red Sea coast', playable: false,
      blurb: 'A smuggler with a debt, one night job to clear it, and a package nobody was meant to open.',
      starts: 'Street Arabic · Lockpicking · Haggling · 500 EGP and a debt' },
    { id: 'journalist', name: 'THE JOURNALIST', place: 'Port Said', playable: false,
      blurb: 'An investigative reporter with a three-day-old email from a woman who has stopped answering.',
      starts: 'English · French · Photography · 12,000 EGP' },
];

const STORY_GENDERS = {
    man:   { label: 'Male',   they: 'he',   them: 'him',  their: 'his',   honor: 'ya basha', title: 'Mister' },
    woman: { label: 'Female', they: 'she',  them: 'her',  their: 'her',   honor: 'ya hanem', title: 'Madame' },
};

// A fresh story record. `opts` comes from the character-creation screen.
function storyFresh(opts) {
    opts = opts || {};
    return {
        v: 2,
        name: (opts.name || 'Morgan Hale').trim() || 'Morgan Hale',
        gender: STORY_GENDERS[opts.gender] ? opts.gender : 'man',
        bg: opts.bg || 'archaeologist',
        notices: opts.notices !== false,
        rel: {}, rep: {}, heat: 0,
        clock: 20 * 60 + 30,          // minutes since midnight of the first day
        flags: {},
        c1_exit: null,
        journal: [],
    };
}

function S() { return gameState.story || (gameState.story = storyFresh()); }
function storyOn() { return !!(gameState.story && gameState.story.v === 2); }

// ---- the player character ----
const PC = {
    get name() { return S().name; },
    get surname() { const p = S().name.trim().split(/\s+/); return p[p.length - 1]; },
    get first() { return S().name.trim().split(/\s+/)[0]; },
    get g() { return STORY_GENDERS[S().gender] || STORY_GENDERS.man; },
    get they() { return this.g.they; }, get them() { return this.g.them; }, get their() { return this.g.their; },
    get honor() { return this.g.honor; },
    get doctor() { return 'Doctor ' + this.surname; },
};

// ---- relationships, reputation, heat ----
const REL_NAMES = {
    abdallah: 'Rais Abdallah', lindqvist: 'Dr. Lindqvist', hana: 'Hana', farouk: 'Uncle Farouk',
    saber: 'Saber', workmen: 'The workmen', amira: 'Dr. Amira Sayed', lena: 'Lena Brandt',
};
const REP_NAMES = { ministry: 'The Ministry', gebali: 'The Gebali network', vasse: 'The Vasse Foundation',
    keepers: 'The Keepers', bedouin: 'The Bedouin', nubian: 'The Nubian community' };

function relTier(v) {
    return v <= -50 ? 'Hostile' : v <= -10 ? 'Cold' : v < 20 ? 'Neutral' : v < 50 ? 'Warm' : v < 80 ? 'Trusted' : 'Bonded';
}
function relGet(who) { return S().rel[who] || 0; }
function rel(who, delta, quiet) {
    const s = S();
    s.rel[who] = Math.max(-100, Math.min(100, (s.rel[who] || 0) + delta));
    if (!quiet && Math.abs(delta) >= 10) storyNotice((REL_NAMES[who] || who) + (delta > 0 ? ' will remember that.' : ' won\'t forget that.'));
}
function repGet(f) { return S().rep[f] || 0; }
function rep(f, delta, quiet) {
    const s = S();
    s.rep[f] = Math.max(-100, Math.min(100, (s.rep[f] || 0) + delta));
    if (!quiet && Math.abs(delta) >= 10) storyNotice((REP_NAMES[f] || f) + ' took note.');
}
function sflag(k, v) { if (v === undefined) return S().flags[k]; S().flags[k] = v; }

// A choice that matters later (★ in 03_CHOICES_AND_FLAGS.md): a quiet
// line in the corner. Never says how.
function storyNotice(text) {
    if (!storyOn() || !S().notices) return;
    let el = document.getElementById('story-notice');
    if (!el) {
        el = document.createElement('div');
        el.id = 'story-notice';
        document.getElementById('game-container').appendChild(el);
    }
    const line = document.createElement('div');
    line.className = 'sn-line';
    line.textContent = text;
    el.appendChild(line);
    setTimeout(() => line.classList.add('out'), 4200);
    setTimeout(() => line.remove(), 5200);
}

// money with a small floating note
function storyPay(amount, why) {
    gameState.funds += amount;
    updateHUD();
    if (typeof owToast === 'function' && why) owToast((amount >= 0 ? '+' : '−') + Math.abs(amount).toLocaleString() + ' EGP', why);
}

// ---- journal (TAB shows the HUD; J opens the notes) ----
function storyNote(title, text) {
    const j = S().journal;
    const old = j.find(n => n.title === title);
    if (old) old.text = text; else j.push({ title, text });
}

// ---- the story clock ----
// Runs only while you're actually playing: an in-game minute every two
// real seconds (arrival 20:30 → midnight is about seven minutes of play).
// Resting/waiting skips it forward. It stops at 04:40 — the story has
// you gone before dawn.
const CLOCK_RATE = 1 / 2;          // game minutes per real second
const CLOCK_END = 24 * 60 + 4 * 60 + 40;
let _clockLast = 0;
function clockTick() {
    if (!storyOn() || gameState.currentScreen !== 'GAME') { _clockLast = 0; return; }
    const now = performance.now();
    const live = !gameState.isDialogueActive && !gameState.isPaused && !activePuzzle && !(typeof bpOpen !== 'undefined' && bpOpen);
    if (_clockLast && live) {
        const dt = Math.min(0.25, (now - _clockLast) / 1000);
        clockAdvance(dt * CLOCK_RATE);
    }
    _clockLast = now;
}
function clockAdvance(mins) {
    const s = S();
    const before = s.clock;
    // Chapter 1 is one night (it stops before dawn); once it's over, days turn
    s.clock = s.flags.ch1_complete ? s.clock + mins : Math.min(CLOCK_END, s.clock + mins);
    if (typeof onClockPassed === 'function') onClockPassed(before, s.clock);
    const el = document.getElementById('stat-clock');
    if (el) el.textContent = clockStr();
}
function clockStr(m) {
    m = Math.floor(m === undefined ? S().clock : m) % (24 * 60);
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}
function clockAt(h, min) { return (h < 12 ? 24 * 60 : 0) + h * 60 + (min || 0); } // hours before noon count as "after midnight"

// ---- HUD: the clock replaces the old sanity readout ----
(function wrapHud() {
    const _updateHUD = updateHUD;
    updateHUD = function () {
        _updateHUD();
        const row = document.getElementById('hud-sanity-row');
        if (row) row.style.display = storyOn() ? 'none' : '';
        const crow = document.getElementById('hud-clock-row');
        if (crow) crow.style.display = storyOn() ? '' : 'none';
        const el = document.getElementById('stat-clock');
        if (el && storyOn()) el.textContent = clockStr();
    };
})();

// ---- new game / reset / load ----
let STORY_PENDING = null; // choices from the creation screen, applied on startGame

(function wrapLifecycle() {
    const _reset = resetGameState;
    resetGameState = function () {
        _reset();
        gameState.story = null;
    };
    const _start = startGame;
    startGame = function () {
        _start();
        gameState.story = storyFresh(STORY_PENDING || {});
        STORY_PENDING = null;
        if (typeof storyChapterStart === 'function') storyChapterStart();
        updateHUD();
    };
    const _load = loadGame;
    loadGame = function () {
        const ok = _load();
        if (ok && !gameState.story) gameState.story = storyFresh();
        if (ok) updateHUD();
        return ok;
    };
})();

// ---- the character-creation screen (New Game) ----
const CREATE = { gender: 'man', bg: 'archaeologist', notices: true };

function storyBuildCreate() {
    if (document.getElementById('create-panel')) return;
    const p = document.createElement('div');
    p.id = 'create-panel';
    p.className = 'hidden';
    p.innerHTML = `
        <h2>WHO ARE YOU?</h2>
        <p class="cr-sub">Every story in Egypt starts with someone arriving.</p>
        <div class="cr-row">
            <label>NAME</label>
            <input id="cr-name" maxlength="28" spellcheck="false" autocomplete="off" placeholder="First and last name">
        </div>
        <div class="cr-row">
            <label>GENDER</label>
            <div class="cr-segs" id="cr-gender">
                ${Object.entries(STORY_GENDERS).map(([k, g]) => `<button class="seg" data-g="${k}">${g.label}</button>`).join('')}
            </div>
            <span class="cr-note" id="cr-pron"></span>
        </div>
        <div class="cr-row cr-bgs-row">
            <label>BACKGROUND</label>
            <div class="cr-bgs" id="cr-bgs">
                ${STORY_BACKGROUNDS.map(b => `
                <button class="cr-bg${b.playable ? '' : ' locked'}" data-bg="${b.id}">
                    <b>${b.name}</b><i>${b.place}</i>
                    <span>${b.blurb}</span>
                    <em>${b.playable ? b.starts : 'COMING IN A LATER UPDATE'}</em>
                </button>`).join('')}
            </div>
        </div>
        <div class="cr-row">
            <label>CHOICE NOTICES</label>
            <button class="toggle" id="cr-notices"><i></i><span></span></button>
            <span class="cr-note">A quiet line in the corner when someone will remember what you did. It never says how.</span>
        </div>
        <div class="mg-buttons cr-foot">
            <button id="cr-begin">BEGIN <span class="key">ENTER</span></button>
            <button id="cr-back">BACK <span class="key">ESC</span></button>
        </div>`;
    document.getElementById('menu-overlay').appendChild(p);
    const sync = () => {
        for (const b of p.querySelectorAll('#cr-gender .seg')) b.classList.toggle('on', b.dataset.g === CREATE.gender);
        for (const b of p.querySelectorAll('.cr-bg')) b.classList.toggle('on', b.dataset.bg === CREATE.bg);
        const g = STORY_GENDERS[CREATE.gender];
        document.getElementById('cr-pron').textContent = `${g.they}/${g.them} · people will call you "${g.honor}"`;
        const t = document.getElementById('cr-notices');
        t.classList.toggle('on', CREATE.notices);
        t.querySelector('span').textContent = CREATE.notices ? 'ON' : 'OFF';
    };
    for (const b of p.querySelectorAll('#cr-gender .seg')) b.onclick = () => { uiClick(); CREATE.gender = b.dataset.g; sync(); };
    for (const b of p.querySelectorAll('.cr-bg')) b.onclick = () => {
        const def = STORY_BACKGROUNDS.find(x => x.id === b.dataset.bg);
        if (!def.playable) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
        uiClick(); CREATE.bg = def.id; sync();
    };
    document.getElementById('cr-notices').onclick = () => { uiClick(); CREATE.notices = !CREATE.notices; sync(); };
    document.getElementById('cr-begin').onclick = storyCreateConfirm;
    document.getElementById('cr-back').onclick = storyCreateCancel;
    sync();
}

function storyCreateOpen() {
    storyBuildCreate();
    TITLE.phase = 'create';
    titleEl('menu-confirm').classList.add('hidden');
    titleEl('menu-overlay').dataset.phase = 'create';
    const p = document.getElementById('create-panel');
    p.classList.remove('hidden');
    const inp = document.getElementById('cr-name');
    setTimeout(() => inp.focus(), 50);
}
function storyCreateCancel() {
    uiClick();
    document.getElementById('create-panel').classList.add('hidden');
    TITLE.phase = 'menu';
    titleEl('menu-overlay').dataset.phase = 'menu';
}
function storyCreateConfirm() {
    const inp = document.getElementById('cr-name');
    const name = inp.value.replace(/\s+/g, ' ').trim();
    if (name.length < 2) { inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); inp.focus(); return; }
    uiClick();
    STORY_PENDING = { name, gender: CREATE.gender, bg: CREATE.bg, notices: CREATE.notices };
    document.getElementById('create-panel').classList.add('hidden');
    _titleBeginIntro();
}

// New Game → creation screen → the prologue cards → the game
const _titleBeginIntro = titleBeginIntro;
titleBeginIntro = function () { storyCreateOpen(); };

// creation-screen keys (the title's own key handler ignores the 'create' phase)
window.addEventListener('keydown', e => {
    if (gameState.currentScreen !== 'START_MENU' || TITLE.phase !== 'create') return;
    if (e.key === 'Enter') { e.preventDefault(); storyCreateConfirm(); }
    else if (e.key === 'Escape') { e.preventDefault(); storyCreateCancel(); }
    e.stopPropagation();
}, true);

// the prologue now tells the new story
INTRO_CARDS.length = 0;
INTRO_CARDS.push(
    { text: 'GIZA PLATEAU, EGYPT', cls: 'place' },
    { text: 'THE PRESENT DAY', cls: 'time' },
    { text: 'Four days ago, the director of the Western Field Survey left the dig. Nobody saw her go.', cls: 'line' },
);

// tick the clock every frame (owUpdateHud runs once a frame in the game loop)
(function wrapFrame() {
    const _ow = owUpdateHud;
    owUpdateHud = function () { clockTick(); _ow(); };
})();
