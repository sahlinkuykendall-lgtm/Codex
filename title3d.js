// ============================================================
// THE CODEX OF GIZA — TITLE SCREEN & PROLOGUE (title3d.js)
//
// The 3D build's front end:
//   1. PRESS ANY KEY — the camp at night, letterboxed. The seal
//      emblem's core pings every eight seconds: the Codex's rhythm.
//   2. MAIN MENU — Continue (with where/when you saved), New
//      Excavation, Settings, Site Overview. Mouse or ↑ ↓ + Enter.
//   3. PROLOGUE — on a new game: place/time cards over black, then a
//      single establishing shot descending on the lamplit tent, then
//      the game's own opening (scene1_start) fades in. ESC skips.
// Behind all of it the menu camera cuts between slow cinematic shots
// of the camp (titleCamera(), called from engine3d.js).
// Loaded after engine3d.js.
// ============================================================

const TITLE = {
    phase: 'splash',   // splash | menu | confirm | intro
    sel: 0,
    shot: 0,
    shotStart: performance.now(),
    intro: null,       // { start, stage }
    lastPing: -1,
    audioOn: false,
};

const CHAPTER_NAMES = {
    1: 'Chapter I — The Dig Site', 2: 'Chapter II — The Descent', 3: 'Chapter III — Cairo',
    4: 'Chapter IV — The Buried City', 5: 'Chapter V — The Airfield', 6: 'Chapter VI — The Gate',
    7: 'Chapter VII — The Heart Chamber',
};

const titleEl = id => document.getElementById(id);

// ---- CINEMATIC SHOTS (behind the menu) ----
// Each: duration (s), from/to camera positions, from/to look targets.
// y values are heights above the ground at that point.
const TITLE_SHOTS = [
    { dur: 16, from: [1180, 3060, 70],  to: [1440, 2860, 64],  look0: [1570, 2330, 60],  look1: [1570, 2330, 50] },  // along the festoons to the lit tent
    { dur: 15, from: [1905, 1180, 70],  to: [1880, 930, 58],   look0: [1880, 560, 110],  look1: [1850, 620, 96] },   // the approach to the tunnel and its seal
    { dur: 15, from: [720, 2960, 190],  to: [560, 2820, 120],  look0: [380, 2590, 40],   look1: [380, 2600, 46] },   // down over the brazier and the dorm
    { dur: 16, from: [900, 1560, 110],  to: [760, 1480, 120],  look0: [-3000, -3600, 900], look1: [-3400, -3000, 800] }, // Giza on the horizon
    { dur: 15, from: [3200, 2980, 90],  to: [2960, 2780, 80],  look0: [2980, 2280, 0],   look1: [2980, 2200, 0] },   // the trench, planks across it
];

function _gy(x, z) { return (typeof ch1Height === 'function' && currentMapKey === 1) ? ch1Height(x, z) : 0; }
const _smooth = t => t * t * (3 - 2 * t);

// Called by engine3d.js every frame on the start screen.
function titleCamera() {
    const now = performance.now();
    if (TITLE.phase === 'intro' && TITLE.intro && TITLE.intro.stage === 'shot') return introCamera(now);
    let s = TITLE_SHOTS[TITLE.shot];
    let t = (now - TITLE.shotStart) / 1000;
    if (t > s.dur) {
        TITLE.shot = (TITLE.shot + 1) % TITLE_SHOTS.length;
        TITLE.shotStart = now;
        s = TITLE_SHOTS[TITLE.shot];
        t = 0;
    }
    const k = _smooth(Math.min(1, t / s.dur));
    const px = s.from[0] + (s.to[0] - s.from[0]) * k, pz = s.from[1] + (s.to[1] - s.from[1]) * k;
    const py = _gy(px, pz) + s.from[2] + (s.to[2] - s.from[2]) * k;
    const lx = s.look0[0] + (s.look1[0] - s.look0[0]) * k, lz = s.look0[1] + (s.look1[1] - s.look0[1]) * k;
    const ly = _gy(lx, lz) + s.look0[2] + (s.look1[2] - s.look0[2]) * k;
    cam3.position.set(px, py, pz);
    cam3.lookAt(lx, ly, lz);
    // fade through black at the cuts
    const edge = Math.min(t, s.dur - t);
    titleEl('menu-fade').style.opacity = Math.max(0, 1 - edge / 1.1).toFixed(3);
}

// ---- THE CODEX PING (every 8 s, like the artefact in Ellis's tent) ----
function titlePulse() {
    const now = performance.now() / 1000;
    const phase = now % 8;
    const ping = Math.exp(-(phase * phase) / 0.25);
    const root = titleEl('menu-overlay');
    root.style.setProperty('--ping', ping.toFixed(3));
    const beat = Math.floor(now / 8);
    if (beat !== TITLE.lastPing && phase < 0.1) {
        TITLE.lastPing = beat;
        if (TITLE.audioOn && typeof _tone === 'function') { _tone(98, 1.6, 'sine', 0.05); _tone(196, 0.9, 'sine', 0.018); }
    }
}

// ---- MENU ----
function titleButtons() {
    return [...document.querySelectorAll('#menu-buttons .menu-btn')].filter(b => !b.classList.contains('hidden'));
}

function titleSelect(i, fromMouse) {
    const btns = titleButtons();
    if (!btns.length) return;
    TITLE.sel = (i + btns.length) % btns.length;
    btns.forEach((b, k) => b.classList.toggle('sel', k === TITLE.sel));
    if (!fromMouse) uiHover();
}

function titleRefreshContinue() {
    const btn = titleEl('menu-continue');
    const info = titleEl('menu-continue-info');
    let data = null;
    try { data = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { data = null; }
    const ok = !!(data && data.gameState);
    btn.classList.toggle('hidden', !ok);
    if (ok) {
        const ch = CHAPTER_NAMES[data.gameState.chapter] || ('Chapter ' + data.gameState.chapter);
        const ago = data.savedAt ? formatAgo(Date.now() - data.savedAt) + ' ago' : '';
        info.textContent = ch + (ago ? '  ·  saved ' + ago : '');
    }
}

function titleShowMenu() {
    TITLE.phase = 'menu';
    const root = titleEl('menu-overlay');
    root.dataset.phase = 'menu';
    titleRefreshContinue();
    titleSelect(0, true);
}

function titleActivate(id) {
    uiClick();
    if (id === 'menu-continue') {
        if (gameState.currentScreen !== 'START_MENU') return;
        titleEl('menu-overlay').dataset.phase = 'leaving';
        setTimeout(() => { if (loadGame()) titleEl('menu-overlay').classList.add('hidden'); }, 450);
    } else if (id === 'menu-start') {
        if (hasSave()) {
            TITLE.phase = 'confirm';
            titleEl('menu-overlay').dataset.phase = 'confirm';
            titleEl('menu-confirm').classList.remove('hidden');
        } else {
            titleBeginIntro();
        }
    } else if (id === 'menu-settings') {
        titleEl('menu-overlay').dataset.phase = 'settings';
        openSettings(() => { titleEl('menu-overlay').dataset.phase = 'menu'; });
    } else if (id === 'menu-mapview') {
        setMapView(true);
    }
}

// ---- PROLOGUE ----
const INTRO_CARDS = [
    { text: 'GIZA PLATEAU, EGYPT', cls: 'place' },
    { text: 'AUTUMN, 2023', cls: 'time' },
    { text: 'The twenty-second night of the excavation.', cls: 'line' },
];

function titleBeginIntro() {
    TITLE.phase = 'intro';
    titleEl('menu-confirm').classList.add('hidden');
    const root = titleEl('menu-overlay');
    root.dataset.phase = 'intro';
    const intro = titleEl('intro');
    intro.classList.remove('hidden');
    intro.innerHTML = '<div class="intro-skip">ESC TO SKIP</div>';
    TITLE.intro = { start: performance.now(), stage: 'cards', timers: [] };
    const T = TITLE.intro.timers;
    INTRO_CARDS.forEach((c, i) => {
        T.push(setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'intro-card ' + c.cls;
            el.textContent = c.text;
            intro.appendChild(el);
            if (i < 2) uiClick();
        }, 900 + i * 1700));
    });
    // the cards fade, the world fades up for the establishing shot
    T.push(setTimeout(() => {
        intro.classList.add('fading');
        TITLE.intro.stage = 'shot';
        TITLE.intro.shotStart = performance.now();
    }, 900 + INTRO_CARDS.length * 1700 + 1400));
    T.push(setTimeout(() => titleFinishIntro(), 900 + INTRO_CARDS.length * 1700 + 1400 + 7600));
}

// One slow descent from above the camp onto the lamplit tent
function introCamera(now) {
    const t = Math.min(1, (now - TITLE.intro.shotStart) / 7600);
    const k = _smooth(t);
    const from = [2300, 3500, 620], to = [1600, 2640, 70];
    const px = from[0] + (to[0] - from[0]) * k, pz = from[1] + (to[1] - from[1]) * k;
    const py = _gy(px, pz) + from[2] + (to[2] - from[2]) * k;
    cam3.position.set(px, py, pz);
    cam3.lookAt(1568, _gy(1568, 2330) + 60 - 30 * k, 2330);
    // fade in, then out to black at the very end
    const f = t < 0.12 ? 1 - t / 0.12 : t > 0.88 ? (t - 0.88) / 0.12 : 0;
    titleEl('menu-fade').style.opacity = f.toFixed(3);
    if (t > 0.86 && !TITLE.intro.pinged) {
        TITLE.intro.pinged = true;
        if (typeof _tone === 'function') { _tone(98, 2.2, 'sine', 0.07); _tone(147, 1.4, 'sine', 0.025); }
    }
}

function titleFinishIntro() {
    if (!TITLE.intro) return;
    for (const id of TITLE.intro.timers) clearTimeout(id);
    TITLE.intro = null;
    const intro = titleEl('intro');
    intro.classList.add('hidden');
    intro.classList.remove('fading');
    titleEl('menu-overlay').classList.add('hidden');
    titleEl('menu-fade').style.opacity = 0;
    TITLE.phase = 'menu';
    if (gameState.currentScreen === 'START_MENU') {
        resetGameState();
        startGame();
    }
}

// Back on the start screen (return to menu from the game): show the menu, not the splash
function titleOnMenuShown() {
    if (TITLE.phase === 'splash') return;
    titleShowMenu();
}

// ---- INPUT ----
window.addEventListener('keydown', e => {
    if (gameState.currentScreen !== 'START_MENU' || (typeof mapView !== 'undefined' && mapView.active)) return;
    if (typeof settingsOpen === 'function' && settingsOpen()) return;
    TITLE.audioOn = true;
    if (TITLE.phase === 'intro') {
        if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); titleFinishIntro(); }
        return;
    }
    if (TITLE.phase === 'splash') { e.preventDefault(); uiClick(); titleShowMenu(); return; }
    if (TITLE.phase === 'confirm') {
        if (e.key === 'Escape') { titleCancelConfirm(); }
        else if (e.key === 'Enter') { titleBeginIntro(); }
        return;
    }
    if (TITLE.phase !== 'menu') return;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); titleSelect(TITLE.sel + 1); }
    else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); titleSelect(TITLE.sel - 1); }
    else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const b = titleButtons()[TITLE.sel];
        if (b) titleActivate(b.id);
    }
});

function titleCancelConfirm() {
    uiClick();
    TITLE.phase = 'menu';
    titleEl('menu-confirm').classList.add('hidden');
    titleEl('menu-overlay').dataset.phase = 'menu';
}

titleEl('menu-overlay').addEventListener('pointerdown', e => {
    TITLE.audioOn = true;
    if (TITLE.phase === 'splash') { uiClick(); titleShowMenu(); }
});

titleButtons().concat([titleEl('menu-continue')]).forEach(b => {
    b.addEventListener('mouseenter', () => {
        const i = titleButtons().indexOf(b);
        if (i >= 0 && i !== TITLE.sel) { titleSelect(i, true); uiHover(); }
    });
    b.addEventListener('click', () => { if (TITLE.phase === 'menu') titleActivate(b.id); });
});
titleEl('confirm-yes').addEventListener('click', () => { uiClick(); titleBeginIntro(); });
titleEl('confirm-no').addEventListener('click', titleCancelConfirm);

// start on the splash
titleEl('menu-overlay').dataset.phase = 'splash';
titleEl('menu-version').textContent = `V${GAME_VERSION}`;
