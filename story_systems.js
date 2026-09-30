// ============================================================
// THE CODEX OF GIZA — GAME SYSTEMS (story_systems.js)
// The systems from story/06_SYSTEMS.md that every chapter shares:
//   - SKILLS & XP: learn by doing (skillXP), levels 0–5, level-up toasts
//   - NEEDS: thirst and hunger — slow, never deadly; at empty you can't
//     sprint. Wells, water barrels, canteens, tea, food fix it.
//   - FAILURE STATES: injured (you limp until treated or rested) and
//     knocked out (you wake somewhere else, hours later, missing things)
//   - THE PHONE (P): map & tasks, messages, contacts (calls), bank,
//     skills, notes
// All state lives in gameState.story. Loaded after story_core.js.
// ============================================================

// ---- skills ----
const SKILLS = {
    excavation:  'Excavation',  hieroglyphs: 'Hieroglyphs', greek: 'Greek',      coptic: 'Coptic',
    arabic:      'Egyptian Arabic', arabicRead: 'Arabic reading', nubian: 'Nubian', stealth: 'Stealth',
    lockpicking: 'Lockpicking', climbing: 'Climbing',     diving: 'Diving',      haggling: 'Haggling',
    riding:      'Riding',      firstAid: 'First aid',    photography: 'Photography', desert: 'Desert survival',
};
const SKILL_XP = [0, 100, 250, 450, 700, 1000];   // total XP for levels 0..5
const BG_SKILLS = {
    archaeologist: { excavation: 3, hieroglyphs: 2, greek: 1, coptic: 1, photography: 1, firstAid: 1 },
    inspector:     { arabic: 5, arabicRead: 5, hieroglyphs: 2, excavation: 1, stealth: 1 },
    fixer:         { arabic: 3, lockpicking: 2, haggling: 3, diving: 1, stealth: 1 },
    journalist:    { photography: 3, stealth: 1, haggling: 1, arabic: 1 },
};
function skillsState() {
    const s = S();
    if (!s.skills) {
        s.skills = {};
        const base = BG_SKILLS[s.bg] || {};
        for (const k in SKILLS) s.skills[k] = SKILL_XP[base[k] || 0];
    }
    return s.skills;
}
function skillLevel(k) { const xp = skillsState()[k] || 0; let l = 0; while (l < 5 && xp >= SKILL_XP[l + 1]) l++; return l; }
function skillXP(k, amount, why) {
    if (!storyOn() || !SKILLS[k] || !amount) return;
    const st = skillsState(), before = skillLevel(k);
    st[k] = Math.min(SKILL_XP[5], (st[k] || 0) + amount);
    const after = skillLevel(k);
    if (after > before && typeof owToast === 'function') owToast(SKILLS[k].toUpperCase() + ' ' + after, 'Skill improved' + (why ? ' · ' + why : ''));
}
// learning by talking: a little Arabic every time you have a real conversation with someone who speaks it
const ARABIC_SPEAKERS = /^(Rais Abdallah|Hana|Uncle Farouk|Saber|Uncle Hamid|Gamal|Hagg Sayed)$/;
(function () {
    const _sd = startDialogue;
    startDialogue = function (id) {
        _sd(id);
        const sc = storyData[id];
        if (!sc || !storyOn()) return;
        const sp = typeof sc.speaker === 'function' ? sc.speaker() : sc.speaker;
        if (ARABIC_SPEAKERS.test(sp || '')) {
            const k = 'ar_' + id;
            if (!S().flags[k]) { S().flags[k] = true; skillXP('arabic', 6); }
        }
    };
})();

// ---- needs: thirst and hunger ----
function needs() { const s = S(); if (!s.needs) s.needs = { water: 85, food: 80 }; return s.needs; }
const NEED_DRAIN = { water: 0.11, food: 0.06 };   // per in-game minute
function needsDrain(mins) {
    if (!storyOn()) return;
    const n = needs();
    const w0 = n.water, f0 = n.food;
    n.water = Math.max(0, n.water - NEED_DRAIN.water * mins);
    n.food = Math.max(0, n.food - NEED_DRAIN.food * mins);
    if (w0 > 20 && n.water <= 20 && typeof owToast === 'function') owToast('THIRSTY', 'Drink at a well, the water barrels, or your canteen (Q)');
    if (f0 > 20 && n.food <= 20 && typeof owToast === 'function') owToast('HUNGRY', 'Eat something — dates, or the cooking table');
}
function drink(amount, why) { const n = needs(); n.water = Math.min(100, n.water + amount); needsHud(); if (why && typeof owToast === 'function') owToast(why, 'Thirst ' + Math.round(n.water) + '%'); }
function eat(amount, why) { const n = needs(); n.food = Math.min(100, n.food + amount); needsHud(); if (why && typeof owToast === 'function') owToast(why, 'Hunger ' + Math.round(n.food) + '%'); }
function needsHud() {
    let el = document.getElementById('hud-needs');
    if (!el) {
        el = document.createElement('div');
        el.id = 'hud-needs';
        el.innerHTML = '<div>Water <i><b id="need-water"></b></i></div><div>Food <i><b id="need-food"></b></i></div><div id="hud-status"></div>';
        document.getElementById('hud').appendChild(el);
    }
    if (!storyOn()) { el.style.display = 'none'; return; }
    el.style.display = '';
    const n = needs();
    const set = (id, v) => { const b = document.getElementById(id); b.style.width = v + '%'; b.className = v <= 20 ? 'low' : ''; };
    set('need-water', n.water); set('need-food', n.food);
    const st = [];
    if (S().injured) st.push('INJURED');
    if (n.water <= 0) st.push('PARCHED'); else if (n.water <= 20) st.push('THIRSTY');
    if (n.food <= 0) st.push('STARVING'); else if (n.food <= 20) st.push('HUNGRY');
    document.getElementById('hud-status').textContent = st.join(' · ');
}
// drain with the clock, and the effects of going without
(function () {
    const _adv = clockAdvance;
    clockAdvance = function (mins) { _adv(mins); needsDrain(mins); };
    const _upd = updateHUD;
    updateHUD = function () { _upd(); needsHud(); };
})();
// the canteen and dates feed the meters
(function () {
    const _use = bpUse;
    bpUse = function (id) {
        const it = bpFind(id), def = BP_ITEMS[id];
        const had = it && def && def.use === 'drink' ? (it.charges || 0) : null;
        _use(id);
        if (!storyOn() || !def) return;
        if (def.use === 'drink' && had > 0) drink(35);
        if (def.use === 'eat') eat(14);
        needsHud();
    };
})();

// ---- failure states ----
const BASE_SPEED = 2.6;
function setInjured(on, why) {
    S().injured = !!on;
    player.speed = on ? BASE_SPEED * 0.68 : BASE_SPEED;
    if (on && typeof owToast === 'function') owToast('INJURED', why || 'You\'re limping — rest, or get it seen to');
    if (!on && typeof owToast === 'function' && why) owToast('PATCHED UP', why);
    needsHud();
}
function statusFrame() {
    if (!storyOn() || gameState.currentScreen !== 'GAME') return;
    const ph = document.getElementById('phone');
    if (ph && !ph.classList.contains('hidden')) heldKeys.clear();   // no walking with your nose in the phone
    const n = needs();
    // no water or no food: no sprinting, slow recovery
    if (n.water <= 0 || n.food <= 0) {
        gameState.isSprinting = false;
        if (gameState.stamina > gameState.maxStamina * 0.35) gameState.stamina = gameState.maxStamina * 0.35;
    }
    const want = S().injured ? BASE_SPEED * 0.68 : BASE_SPEED;
    if (player.speed !== want) player.speed = want;
}
// Knocked out: a fade to black, and you come to somewhere else, later,
// missing whatever the people who did it wanted
function knockOut(opts) {
    opts = opts || {};
    closeDialogue();
    let fade = document.getElementById('ko-fade');
    if (!fade) { fade = document.createElement('div'); fade.id = 'ko-fade'; document.getElementById('game-container').appendChild(fade); }
    fade.classList.add('on');
    gameState.isDialogueActive = true;
    setTimeout(() => {
        if (opts.wakeAt) { const [x, z] = opts.wakeAt; player.x = x - 15; player.y = z - 15; }
        if (opts.hours) clockAdvance(opts.hours * 60);
        if (opts.take) for (const item of opts.take) { const i = gameState.inventory.indexOf(item); if (i >= 0) gameState.inventory.splice(i, 1); }
        if (opts.cash) { const lost = Math.round(gameState.funds * opts.cash); gameState.funds -= lost; S().lastLost = lost; }
        if (opts.injure) setInjured(true, 'Your head is ringing');
        if (opts.onWake) opts.onWake();
        updateHUD();
        fade.classList.remove('on');
        gameState.isDialogueActive = false;
        if (opts.scene) setTimeout(() => startDialogue(opts.scene), 900);
    }, 1800);
}

// ---- money ledger (the phone's bank) ----
(function () {
    const _pay = storyPay;
    storyPay = function (amount, why) {
        _pay(amount, why);
        const s = S(); if (!s.ledger) s.ledger = [];
        s.ledger.unshift({ t: clockStr(), a: amount, why: why || '' });
        if (s.ledger.length > 40) s.ledger.pop();
    };
})();
function storyMessage(from, text) {
    const s = S(); if (!s.messages) s.messages = [];
    s.messages.unshift({ from, text, t: clockStr(), unread: true });
    if (typeof owToast === 'function') owToast('MESSAGE — ' + from.toUpperCase(), 'Press P for your phone');
}

// ---- the phone (P) ----
const PHONE = { tab: 'map', calls: [] };   // calls: { name, when(), scene }
function phoneAddCall(c) { PHONE.calls.push(c); }
function phoneOpen(open) {
    let el = document.getElementById('phone');
    if (!el) {
        el = document.createElement('div');
        el.id = 'phone'; el.className = 'hidden';
        document.getElementById('game-container').appendChild(el);
        el.addEventListener('click', e => {
            const t = e.target.closest('[data-tab]'); if (t) { PHONE.tab = t.dataset.tab; phoneRender(); return; }
            const c = e.target.closest('[data-call]');
            if (c) { const call = PHONE.calls.find(q => q.name === c.dataset.call); if (call) { phoneOpen(false); startDialogue(call.scene); } }
        });
    }
    const show = open === undefined ? el.classList.contains('hidden') : open;
    if (!show) { el.classList.add('hidden'); return; }
    if (document.pointerLockElement) document.exitPointerLock();
    phoneRender();
    el.classList.remove('hidden');
}
function phoneRender() {
    const el = document.getElementById('phone');
    const s = S();
    const tabs = [['map', 'Map'], ['msgs', 'Messages'], ['contacts', 'Contacts'], ['bank', 'Bank'], ['skills', 'Skills'], ['notes', 'Notes']];
    const unread = (s.messages || []).filter(m => m.unread).length;
    let body = '';
    if (PHONE.tab === 'map') {
        const f = gameState.flags;
        const places = (typeof OW !== 'undefined' ? OW.places : []).filter(p => f['ow_disc_' + p.id]).map(p => p.name);
        const px = player.x + player.size / 2, pz = player.y + player.size / 2;
        const tasks = (typeof OW_MISSIONS !== 'undefined' ? OW_MISSIONS : []).filter(m => m.when(f)).map(m => {
            const [x, z] = ch1At(m.obj); return `<li><b>${m.label}</b><span>${Math.round(Math.hypot(x - px, z - pz) / 32)} m</span></li>`;
        });
        body = `<h5>CURRENT TASKS</h5><ul class="ph-list">${tasks.join('') || '<li class="dim">Nothing pressing. Explore.</li>'}</ul>
            <h5>PLACES FOUND (${places.length})</h5><div class="ph-chips">${places.map(p => `<i>${p}</i>`).join('') || '<i class="dim">None yet</i>'}</div>`;
    } else if (PHONE.tab === 'msgs') {
        (s.messages || []).forEach(m => m.unread = false);
        body = (s.messages || []).map(m => `<div class="ph-msg"><b>${m.from}</b><em>${m.t}</em><p>${m.text}</p></div>`).join('') || '<p class="dim">No messages. The signal out here is terrible anyway.</p>';
    } else if (PHONE.tab === 'contacts') {
        const people = Object.keys(REL_NAMES).filter(k => s.rel[k] !== undefined);
        const calls = PHONE.calls.filter(c => c.when());
        body = `<h5>PEOPLE</h5><ul class="ph-list">${people.map(k => `<li><b>${REL_NAMES[k]}</b><span>${relTier(relGet(k))}</span></li>`).join('') || '<li class="dim">Nobody yet</li>'}</ul>` +
            (calls.length ? `<h5>CALL</h5>${calls.map(c => `<button class="ph-call" data-call="${c.name}">☎ ${c.name}</button>`).join('')}` : '');
    } else if (PHONE.tab === 'bank') {
        body = `<div class="ph-bal">${gameState.funds.toLocaleString()} <small>EGP</small></div><ul class="ph-list">${(s.ledger || []).map(l => `<li><b>${l.why || 'Payment'}</b><span class="${l.a < 0 ? 'neg' : 'pos'}">${l.a > 0 ? '+' : ''}${l.a.toLocaleString()}</span></li>`).join('') || '<li class="dim">No transactions yet</li>'}</ul>`;
    } else if (PHONE.tab === 'skills') {
        const st = skillsState();
        body = `<ul class="ph-skills">${Object.keys(SKILLS).map(k => {
            const l = skillLevel(k), xp = st[k] || 0, lo = SKILL_XP[l], hi = SKILL_XP[Math.min(5, l + 1)];
            const pct = l >= 5 ? 100 : Math.round((xp - lo) / (hi - lo) * 100);
            return `<li class="${l ? '' : 'zero'}"><b>${SKILLS[k]}</b><span>${'●'.repeat(l)}${'○'.repeat(5 - l)}</span><i><u style="width:${pct}%"></u></i></li>`;
        }).join('')}</ul><p class="dim">You learn by doing: dig, read, talk, sneak, climb.</p>`;
    } else {
        body = s.journal.slice().reverse().map(n => `<div class="ph-note"><b>${n.title}</b><p>${n.text}</p></div>`).join('');
    }
    el.innerHTML = `<div class="ph-top"><span>${clockStr()}</span><span>${s.name}</span><span>▮▮▯ · ${Math.round(needs().water)}%💧</span></div>
        <div class="ph-tabs">${tabs.map(([k, n]) => `<button data-tab="${k}" class="${PHONE.tab === k ? 'on' : ''}">${n}${k === 'msgs' && unread ? ' •' : ''}</button>`).join('')}</div>
        <div class="ph-body">${body}</div><div class="ph-foot">P OR ESC TO PUT IT AWAY</div>`;
}
window.addEventListener('keydown', e => {
    if (!storyOn() || gameState.currentScreen !== 'GAME') return;
    const el = document.getElementById('phone');
    const open = el && !el.classList.contains('hidden');
    if (e.code === 'KeyP' && !gameState.isDialogueActive && !activePuzzle) { e.preventDefault(); phoneOpen(); }
    else if (e.key === 'Escape' && open) { e.preventDefault(); e.stopImmediatePropagation(); phoneOpen(false); }
}, true);

// frame hook
(function () {
    const _ow = owUpdateHud;
    owUpdateHud = function () { _ow(); statusFrame(); };
})();
