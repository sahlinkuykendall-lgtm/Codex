// ============================================================
// THE CODEX OF GIZA — POKE STYLE: BEFORE YOU LEAVE (poke/leaving.js)
// At the moment you choose to leave an opening area, the scene says how many
// main tasks and side quests are still open there. The chapter's end settles
// the main ones; the side quests wait for you (KEEP EXPLORING on the end card).
//   area().sideQuests   [{ name, done() }]: every side quest in the area,
//                       started or not (the Archaeologist's are below)
//   area().sideIds      the task ids that are side quests (the rest are main)
// Areas without them count open tasks, and a task whose text starts with
// "(" is a side quest (the Inspector's are written "(The Colossus) ...").
// ============================================================

AREAS.archaeologist.sideIds = new Set(['mina', 'hana_sherds', 'saber', 'relics', 'photo', 'hamid', 'detector', 'bosta', 'fossils']);
AREAS.archaeologist.sideQuests = [                                     // story/regions/ch01_opening_archaeologist.md, SQ-01A-01 to 11
    { name: "The Rais's Son", done: () => sflag('mina') === 'done' },
    { name: "Hana's Conservation", done: () => sflag('hana_q') === 'done' },
    { name: "The Tea Boy's Secret", done: () => !!sflag('lindqvist_papers') },
    { name: 'The Truck of 1926', done: () => !!sflag('relics_done') },
    { name: 'Supply Line Blues', done: () => sflag('hamid') === 'fixed' },
    { name: "Miriam's Caches", done: () => ['tin', 'phone', 'glasses', 'rucksack'].every(k => sflag('cache_' + k)) },
    { name: 'Darts Night', done: () => !!sflag('darts_won') },
    { name: 'Bosta', done: () => !!sflag('dog_follow') },
    { name: "Pharaoh's Lentils", done: () => !!sflag('fossils_done') },
    { name: 'The Lamp at the Tomb', done: () => hasItem('Painted tile: a lamp in a doorway') },
    { name: "The Looters' Pit", done: () => !!sflag('looterpit') },
];

// what's still open here; `skip` are task ids that leaving settles anyway
function areaLeft(skip) {
    const A = area(), isSide = t => A.sideIds ? A.sideIds.has(t.id) : t.text[0] === '(';
    const open = Story.s.tasks.filter(t => !t.done && !(skip || []).includes(t.id));
    return {
        main: open.filter(t => !isSide(t)).length,
        side: A.sideQuests ? A.sideQuests.filter(q => !q.done()).length : open.filter(isSide).length,
    };
}
function leftHereText(skip) {
    const { main, side } = areaLeft(skip);
    if (!main && !side) return `\n\n(Before you go: you've done everything there is to do here.)`;
    const n = (k, one, many) => k + ' ' + (k === 1 ? one : many);
    const what = [main && n(main, 'main task', 'main tasks'), side && n(side, 'side quest', 'side quests')].filter(Boolean).join(' and ');
    const after = !side ? `Leaving ends the chapter, and the story moves on without ${main === 1 ? 'it' : 'them'}.`
        : (main ? `Leaving ends the chapter and the story moves on, but the side quests will wait` : `Leaving ends the chapter, but ${side === 1 ? 'it' : 'they'} will wait`) + `: pick KEEP EXPLORING on the chapter-end card to come back here and finish ${side === 1 ? 'it' : 'them'}.`;
    return `\n\n(Before you go: ${what} still open here. ${after})`;
}
// add the line to a scene's text, whichever way the scene writes its text
function withLeftHere(key, skip, when) {
    const d = STORY[key]; if (!d) { console.warn('leaving: no scene', key); return; }
    const desc = Object.getOwnPropertyDescriptor(d, 'text'), base = () => { const v = desc.get ? desc.get.call(d) : desc.value; return typeof v === 'function' ? v() : v; };
    delete d.text;
    d.text = () => base() + (!when || when() ? leftHereText(skip) : '');
}
withLeftHere('c1a_headlights', ['midnight', 'lena', 'store']);
withLeftHere('c1b_exit', ['c1b_note', 'c1b_out']);
withLeftHere('c1c_lorry_leave', ['c1c_leave', 'c1c_exit'], () => !leaveBlock());
withLeftHere('c1c_bus_north', ['c1c_leave', 'c1c_exit'], () => !leaveBlock());
