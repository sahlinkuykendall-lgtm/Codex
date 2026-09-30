// ============================================================
// THE CODEX OF GIZA — POKE STYLE: AREAS (poke/areas.js)
// Each background opens in its own place: the Archaeologist at the Giza
// dig camp (Chapter 1-A), the Inspector at Saqqara (1-B), and so on. An
// area says which tile map and which objects to build, when its story
// clock starts, what the place is called, and which story hooks run:
//   newGame()           a new game has just been built (the first scene)
//   frame(dt)           every frame you're free to walk about
//   sync()              make the world match the story (after a load)
//   clockPassed(a, b)   the story clock moved from a to b (minutes)
//   door(d)             walking up to a door: return true to stop you
//   onEnter(room)       you walked into a room
//   giza                the dig camp's own systems run (Bosta, the detector)
// The Archaeologist's hooks are the ones Chapter 1-A always had.
// Game.maps.ch1 is always the area's outdoor map, whichever area it is.
// ============================================================

const AREAS = {
    archaeologist: {
        name: 'THE GIZA PLATEAU', clock: 20 * 60 + 30, giza: true,
        layout: () => campLayout(), objects: () => window.POKE_MAP,
        newGame() { Detector.sync(); storySync(); systemsNewGame(); },
        frame: dt => storyFrame(dt), sync: () => { Detector.sync(); storySync(); },
        clockPassed: (a, b) => storyClockPassed(a, b), door: d => storyDoor(d), onEnter: r => storyOnEnter(r),
        watch() { return !sflag('ch1_complete') ? (Story.s.clock < 24 * 60 ? ' Midnight in ' + (l => (l >= 60 ? Math.floor(l / 60) + ' h ' : '') + Math.ceil(l % 60) + ' min.')(24 * 60 - Story.s.clock) : ' The night ends at 04:40.') : ''; },
    },
};
function area(bg) { return AREAS[bg || Game.player.bg] || AREAS.archaeologist; }
