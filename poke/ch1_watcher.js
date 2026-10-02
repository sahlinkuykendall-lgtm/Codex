// ============================================================
// THE CODEX OF GIZA — POKE STYLE: THE MAN IN THE MINISTRY CAR (poke/ch1_watcher.js)
// (An addition, at the owner's request: story/regions/ch01_opening_archaeologist.md, "Additions".)
// The white Land Cruiser by the guard post has a man beside it all night: Sergeant Hamdi Tawfik,
// Tourist and Antiquities Police in a Ministry car, writing down who comes and goes from
// Miriam's tent for "a colonel in Cairo" (Radwan, never named here). Talk to him; bring him a
// glass of tea and he reads you his log of the night Miriam left (it backs up Hana and Farouk);
// photograph him (C) for later. Flags: c1a_watcher_met, c1a_watcher_log, c1a_watcher_photo.
// ============================================================

const WATCHER_LOOK = { skin: 5, top: ['#c8b07a', '#a8905c', '#7c6640'], topKind: 'jacket', legs: ['#b09864', '#8c7448', '#64522e'], head: 'cap', headCol: ['#4a5a3a', '#36442a', '#26301e'], face: 'tache', tache: '#2a2018', shoe: '#14100c' };
const Watcher = {
    ensure() {
        const m = Game.maps.ch1; if (!m || area() !== AREAS.archaeologist || m.people.some(e => e.id === 'c1a_watcher')) return;
        const car = m.ents.find(e => e.id === 'inspector'); if (!car) return;
        const x = car.x + car.w + 14, y = car.y + car.d - 10;
        const e = World.addEnt(m, { x, y, w: 0, d: 0, id: 'c1a_watcher', label: 'Man by the Ministry Car', person: { sheet: personSheet(WATCHER_LOOK), dir: DIR.left, frame: 0 }, sortY: y, light: { x: -4, y: -16, r: 14, c: '#ff9040' } });   // (the glow of his cigarette)
        m.people.push(e);
    },
};
const giza = () => area() === AREAS.archaeologist;
STORY_SCRIPTS.inspector = STORY_SCRIPTS.c1a_watcher = () => giza() ? 'c1a_watcher' : null;
PHOTO_SUBJECTS.c1a_watcher = PHOTO_SUBJECTS.inspector = 'The man in the Ministry car';
ITEM_INFO['Photo: the man in the Ministry car'] = { key: 1, desc: 'Sergeant Hamdi Tawfik by his Ministry car at night: police boots, a police radio, looking straight into the lens. Somebody\'s colonel would know him.' };

scene('c1a_watcher', {
    speaker: 'System',
    text: () => sflag('c1a_watcher_met')
        ? `Sergeant Tawfik, leaning on the Ministry car, a fresh cigarette going. He lifts it an inch. "Doctor."` + (sflag('c1a_watcher_log') ? ` The notebook is back in his breast pocket, buttoned in.` : '')
        : `A white Land Cruiser with Ministry plates, and a man in a pressed khaki uniform leaning on it, smoking, watching the camp. He's been there all evening.\n\nThe plates are the Ministry's. The boots aren't: black, polished, police issue. Neither is the radio on his belt.\n\nHe watches you come over and doesn't straighten up.`,
    get choices() {
        const c = [];
        if (!sflag('c1a_watcher_met')) c.push({ text: '"Can I help you, officer?"', nextScene: 'c1a_watcher_talk' });
        else if (!sflag('c1a_watcher_log')) c.push({ text: 'Bring him a glass of the Rais\'s tea from the fire. "Long night?"', nextScene: 'c1a_watcher_tea' });
        c.push({ text: 'Leave him to it.' });
        return c;
    },
});
scene('c1a_watcher_talk', {
    speaker: 'The Man by the Car',
    text: `"Sergeant Hamdi Tawfik. Ministry liaison." He doesn't offer a card, and you don't ask for one. "Routine."\n\n"Routine, at ten at night, outside a dig whose director has disappeared?"\n\nHe shrugs with one shoulder. "Somebody in Cairo wants to know who goes in and out of Dr. Hale's tent. I write it down. That's what I do, Doctor. I write things down."\n\n"Who in Cairo?"\n\n"A colonel. Colonels don't give sergeants reasons." He looks at the end of his cigarette. "He's not a bad man. He's a tired one."`,
    choices: [{ text: '"Then write me down too."', onSelect: () => {
        sflag('c1a_watcher_met', true);
        storyNote('The man in the Ministry car', 'Sergeant Hamdi Tawfik: Ministry plates, police boots. He writes down who goes in and out of Miriam\'s tent, for "a colonel in Cairo" who is "not a bad man, a tired one." Somebody in the police is watching this camp, and reporting it.');
    } }],
});
scene('c1a_watcher_tea', {
    speaker: 'Sergeant Tawfik',
    text: `He takes the glass and holds it a while for the warmth before he drinks. Then he unbuttons his breast pocket and opens a small notebook, and reads without looking at you.\n\n"Four nights ago. Twenty to midnight: Dr. Hale out of her tent, something in a green scarf, about so big. To the find store by the rock. Out again at eight minutes to, without it. Half past midnight: a black Land Cruiser, no lights, no plates I could read. A woman in the back. Dr. Hale got in by herself. Nobody made her."\n\nHe closes the notebook.\n\n"I sent it to Cairo. Cairo said: keep watching." He finishes the tea. "Nobody said: help her."`,
    choices: [{ text: '"Thank you, Sergeant."', onSelect: () => {
        sflag('c1a_watcher_log', true); skillXP('investigation', 20);
        storyNote('The man in the Ministry car', 'Sergeant Tawfik\'s log, the night Miriam left: 23:40, Miriam to the find store with something in a green scarf; 23:52, out without it; 00:30, a black Land Cruiser, no lights, a woman in the back. Miriam got in by herself. He reported it to "Cairo", and Cairo said keep watching.');
        if (!sflag('codex')) storyNotice('Whatever Miriam hid, it\'s still in the find store.');
    } }],
});

// photographing him: he sees you do it
(function () {
    const _photo = takePhoto;
    takePhoto = function () {
        const e = Game.target;
        if (e && (e.id === 'c1a_watcher' || e.id === 'inspector') && giza() && !sflag('c1a_watcher_photo')) {
            sflag('c1a_watcher_photo', true); pocket('Photo: the man in the Ministry car', 1, true);
            storyNote('The man in the Ministry car', 'You photographed him by his Ministry car: the police boots, the radio, the face. He looked straight into the lens and didn\'t smile. If you ever meet his colonel, this might be worth showing him.');
        }
        return _photo.apply(this, arguments);
    };
})();
(function () {
    const A = AREAS.archaeologist, _frame = A.frame, _sync = A.sync;
    A.frame = function (dt) { _frame.call(this, dt); Watcher.ensure(); };
    A.sync = function () { _sync.call(this); Watcher.ensure(); };
})();
