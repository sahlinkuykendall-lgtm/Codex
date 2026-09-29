// ============================================================
// THE CODEX OF GIZA — FIRST-STEPS TIPS (tips3d.js, 3D build)
//
// At the start of a new game, small tips appear one at a time in the
// bottom-left corner: each stays ~10 s, fades out, the corner rests for
// ~5 s, then the next. The clock only runs while you're actually
// playing (not in conversations, menus, minigames). Hold X on any tip
// to switch them off for this game.
// Loaded after engine.js, before engine3d.js.
// ============================================================

const TIPS = [
    { keys: ['W', 'A', 'S', 'D'], text: 'to walk · move the mouse to look (click the world to capture it)' },
    { keys: ['SPACE'], text: 'to jump · hold', keys2: ['SHIFT'], text2: 'to sprint (watch the stamina bar)' },
    { keys: ['SPACE'], text: 'or', keys2: ['F'], text2: 'to interact with whatever you\'re looking at' },
    { keys: ['I'], text: 'opens your backpack · space is limited — big things take more room than small ones' },
    { keys: ['G'], text: 'holds a tool, like a metal detector · ', keys2: ['Q'], text2: 'drinks from a canteen' },
    { keys: [], text: 'The compass at the top marks your open tasks. The lamp-lit tracks lead between places.' },
    { keys: ['E'], text: 'steadies your mind when the shadows crowd in · ', keys2: ['TAB'], text2: 'shows your stats' },
    { keys: ['ESC'], text: 'pauses · Settings (graphics, mouse, sound, text speed) are in the pause menu' },
];
const TIP_SHOW = 10, TIP_GAP = 5, TIP_FADE = 0.7;

const TIPSTATE = { running: false, idx: 0, t: 0, holdX: 0, last: 0 };

function tipsStart() {
    TIPSTATE.running = true; TIPSTATE.idx = 0; TIPSTATE.t = -2; TIPSTATE.holdX = 0;
    gameState.flags.tips_off = false;
}
function tipsStop(disabled) {
    TIPSTATE.running = false;
    const el = document.getElementById('tip-card');
    if (el) el.style.opacity = 0;
    if (disabled) gameState.flags.tips_off = true;
}

function tipsRender(tip) {
    const el = document.getElementById('tip-card');
    const k = (arr) => (arr || []).map(x => `<span class="key">${x}</span>`).join('');
    el.querySelector('.tip-text').innerHTML = `${k(tip.keys)} ${tip.text}${tip.keys2 ? ' ' + k(tip.keys2) + ' ' + tip.text2 : ''}`;
    el.querySelector('.tip-count').textContent = `TIP ${TIPSTATE.idx + 1} / ${TIPS.length}`;
}

// called once a frame from engine3d.js
function tipsUpdate() {
    const el = document.getElementById('tip-card');
    if (!el) return;
    const now = performance.now() / 1000;
    const dt = Math.min(0.1, now - (TIPSTATE.last || now));
    TIPSTATE.last = now;
    if (!TIPSTATE.running) return;
    if (gameState.flags.tips_off || gameState.currentScreen !== 'GAME') { tipsStop(false); return; }
    const playing = !gameState.isDialogueActive && !gameState.isPaused &&
        !(typeof activePuzzle !== 'undefined' && activePuzzle) && !(typeof bpOpen !== 'undefined' && bpOpen) &&
        !(typeof cineActive === 'function' && cineActive()) && !interiorState.pendingEnter && !interiorState.pendingExit;
    el.classList.toggle('paused', !playing);
    if (!playing) return;
    TIPSTATE.t += dt;
    const t = TIPSTATE.t;
    if (t < 0) { el.style.opacity = 0; return; }
    if (t < TIP_SHOW) {
        if (!el.dataset.shown || el.dataset.shown !== String(TIPSTATE.idx)) { tipsRender(TIPS[TIPSTATE.idx]); el.dataset.shown = String(TIPSTATE.idx); }
        const a = Math.min(1, t / TIP_FADE, (TIP_SHOW - t) / TIP_FADE);
        el.style.opacity = Math.max(0, a).toFixed(3);
        el.style.transform = `translateY(${(1 - Math.min(1, t / TIP_FADE)) * 10}px)`;
    } else {
        el.style.opacity = 0;
        if (t >= TIP_SHOW + TIP_GAP) {
            TIPSTATE.idx++;
            TIPSTATE.t = 0;
            if (TIPSTATE.idx >= TIPS.length) tipsStop(false);
        }
    }
    // hold X to turn them off
    const fill = el.querySelector('.tip-hold i');
    fill.style.width = Math.min(100, TIPSTATE.holdX * 100).toFixed(0) + '%';
    if (TIPSTATE.holdingX && t < TIP_SHOW) {
        TIPSTATE.holdX += dt;
        if (TIPSTATE.holdX >= 1) {
            tipsStop(true);
            if (typeof owToast === 'function') owToast('TIPS OFF', 'For this game');
        }
    } else TIPSTATE.holdX = Math.max(0, TIPSTATE.holdX - dt * 2);
}

window.addEventListener('keydown', e => { if (e.key === 'x' || e.key === 'X') TIPSTATE.holdingX = true; });
window.addEventListener('keyup', e => { if (e.key === 'x' || e.key === 'X') TIPSTATE.holdingX = false; });
window.addEventListener('blur', () => { TIPSTATE.holdingX = false; });

// tips belong to a NEW game (not to continuing one)
(function wrapStart() {
    const _start = startGame;
    startGame = function () { _start(); tipsStart(); };
    const _load = loadGame;
    loadGame = function () { const r = _load(); tipsStop(false); return r; };
})();
