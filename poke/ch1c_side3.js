// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MARSA TARFA'S SIDE QUESTS, PART 3 (poke/ch1c_side3.js)
// The four ADDITIONS to the Fixer's side quests (poke/FIXER_TODO.md §8: not in the bible, which
// gives Marsa Tarfa 5 against Giza's 11 and Saqqara's 9; nameless locals only, nothing that
// touches the main story):
//   SQ-01C-06 The One Guest: the hotel's only guest has jammed his room safe with his passport
//             in it. The lockpicking minigame, in the hotel lobby (a new room).
//   SQ-01C-07 Tawla at the Truck Stop: a long-haul driver who has never lost on this road.
//   SQ-01C-08 The Imam's Loudspeaker: up the minaret to fix the wiring, and find who has been
//             "borrowing" the amplifier's batteries.
//   SQ-01C-09 Goats in the Wadi: a boy's goats have strayed up the wadi. Herd them down to the
//             wadi mouth: goats run from you, so get behind them.
// Also here: the Fixer's full side-quest list (for the leaving line) and their end-card lines.
// ============================================================

Object.assign(LOOKS, {
    c1c_guest: { skinCol: SKINS[4], top: ['#f08a40', '#d06a28', '#a84e18'], topKind: 'shirt', legs: ['#d8c8a0', '#b8a880', '#988860'], botKind: 'shorts', hairStyle: 'bald', hairCol: HAIRS[0], face: 'glasses', wide: true, shoeKind: 'sandals', shoe: '#5c3418' },
    c1c_champ: { skinCol: SKINS[6], top: ['#3a5a8a', '#2c466e', '#1e3252'], topKind: 'shirt', legs: ['#4a4038', '#38302a', '#28221e'], head: 'cap', headCol: ['#c84830', '#a03420', '#782414'], face: 'tache', tache: '#d8d8d0', wide: true, shoe: '#1c1814' },
    c1c_goatboy: { skinCol: SKINS[7], robe: ['#a88a5a', '#8a6e44', '#6a5432'], hairCol: HAIRS[0], kid: true, shoeKind: 'barefoot', shoe: '' },
});
Object.assign(CAST, { c1c_champ: 'c1c_champ', c1c_goatboy: 'c1c_goatboy' });
Object.assign(ITEM_INFO, { 'Batteries': { desc: 'Four fat D-cell batteries, the kind that go in an amplifier, or a remote-control boat.' } });
(function () {
    const L0 = marsaLayout;
    marsaLayout = function () {
        const L = L0();
        L.things.push(['c1c_champ', 9, 42, 1, 1], ['c1c_goatboy', 10, 13, 1, 1]);
        L.doors.push(['c1c_hotel', 0.5, 'INT_HOTEL', 'The Beach Hotel']);
        return L;
    };
})();
POKE_MAP_1C.objects.push({ id: 'c1c_champ', label: 'Long-Haul Driver', model: 'person' }, { id: 'c1c_goatboy', label: 'Goat Boy', model: 'person' });

// ============================================================
// SQ-01C-06: THE ONE GUEST (and the hotel lobby)
// ============================================================
STORY_SCRIPTS.c1c_hotelman = 'c1c_porter';
scene('c1c_porter', {
    speaker: 'Hotel Porter',
    text: () => {
        const q = sflag('c1c_guest');
        if (q === 'done') return `The porter straightens his waistcoat. "Our guest is a happy man. His bus is tomorrow, his passport is in his pocket, and he tells everyone a criminal opened his safe." He beams. "It's the best review we've had all year."`;
        if (q === 'open') return `"He's in the lobby with it," the porter says. "He carried it down himself. Forty kilos. He wouldn't let me help." He looks at the door with dread. "Please."`;
        return `"Rooms? We have forty. Guests? We have one, and he is the cook's cousin." He straightens his waistcoat, and then his face falls. "And today he has locked his passport in his room safe, and the safe has forgotten the number, and his bus to Cairo is tomorrow morning."\n\nHe lowers his voice. "Everybody in Marsa Tarfa knows what you can do with a lock. Would you...? For the hotel's honour?"`;
    },
    get choices() {
        if (!sflag('c1c_guest')) return [{ text: '"Show me the safe."', onSelect: () => c1cGuestAccept() }, { text: '"Not today."' }];
        return [{ text: 'Move on.' }];
    },
});
function c1cGuestAccept() {
    sflag('c1c_guest', 'open');
    task('c1c_sq_guest', '(The One Guest) The hotel\'s only guest has jammed his safe with his passport inside. It\'s in the hotel lobby. Bring your lockpicks.');
    storyNote('The One Guest (side quest)', 'The Beach Hotel\'s only guest, the cook\'s cousin, has locked his passport in his room safe and it won\'t open. His bus to Cairo is tomorrow. He has carried the safe down to the lobby.');
}
ROOMS.INT_HOTEL = {
    name: 'THE BEACH HOTEL', tw: 14, th: 8, style: 'villa',
    enter: ['System', 'The lobby of the Beach Hotel: cool marble, a ceiling fan turning with great dignity, a reception desk with forty keys on hooks behind it and thirty-nine of them there, and the smell of the sea and floor polish.'],
    build({ map, A, put, wall, pw, ph, W }) {
        // the key board, and the photograph of the English on the cannon
        A.r(pw - 120, 12, 64, 34, '#6a4a2c'); for (let i = 0; i < 20; i++) { const kx = pw - 116 + (i % 10) * 6, ky = 16 + Math.floor(i / 10) * 14; A.r(kx, ky, 2, 3, '#c8a040'); if (i !== 11) A.r(kx, ky + 3, 2, 6, '#e8e0c8'); }
        wall(pw - 122, 48, null, { label: 'Key Board', say: ['System', 'Forty keys on forty hooks, each on a brass fob as big as a fist so the Germans don\'t take them to the beach. Thirty-nine are there. Room 12 is out: the cook\'s cousin.'] });
        A.r(40, 12, 40, 30, '#c8a040'); A.r(42, 14, 36, 26, '#d8c8a0'); A.r(46, 30, 28, 6, '#8a7a5a'); A.r(52, 24, 14, 6, '#5a4a3a'); for (let k = 0; k < 4; k++) A.r(48 + k * 7, 20, 3, 8, '#3a3a3a');
        wall(38, 44, null, { label: 'An Old Photograph', say: ['System', 'A brown photograph in a gilt frame: four English officers in shorts and pith helmets sitting astride a cannon by the fort gate, grinning. Written underneath in ink: Marsa Tarfa, 1924. "We moved it for the picture."\n\nThe old man at the fort would like this.'] });
        put((pw >> 1) - 50, W + 6, FURN.desk(100, false), null, { label: 'Reception', say: ['System', 'The reception desk: a brass bell, a guest book open at a page with one name on it in February, a calendar from a fish wholesaler in Suez, and a sign: CHECK-OUT 12:00, CHECK-IN WHENEVER, GOD WILLING.'] });
        put(18, W + 50, FURN.plant()); put(pw - 40, W + 50, FURN.plant()); put(pw - 36, ph - 78, FURN.cooler(), null, { label: 'Water Cooler', script: 'c1c_cooler' });
        put(16, ph - 66, FURN.fan()); put((pw >> 1) - 56, W + 70, FURN.rug(112, 44, PAL.red));
        put((pw >> 1) + 30, W + 86, FURN.safe(), 'c1c_hotelsafe', { label: 'The Room Safe', script: 'c1c_hotelsafe' });
        personAt(map, (pw >> 1) + 10, W + 104, 'c1c_guest', 'The One Guest', 'c1c_guest', 0);
    },
};
STORY_SCRIPTS.c1c_guest = STORY_SCRIPTS.c1c_hotelsafe = 'c1c_hotelsafe';
scene('c1c_hotelsafe', {
    speaker: 'The One Guest',
    text: () => sflag('c1c_guest') === 'done'
        ? `The cook's cousin is reading a newspaper on the sofa with his passport tucked in his shirt pocket where he can feel it. He lowers the paper. "My friend! Sit, sit. Have you eaten? My cousin feeds you for nothing now, I hear."`
        : sflag('c1c_guest') === 'open'
            ? `A round man in an orange holiday shirt and glasses is standing over a grey steel room safe in the middle of the lobby, as if it might run away. "Four digits," he says. "My wife's birthday. I have tried my wife's birthday, my birthday, the children's birthdays, and the day Zamalek won the cup." He wipes his forehead. "It beeps at me. Like it's laughing."`
            : `A round man in an orange holiday shirt, sitting next to a steel safe in the middle of the lobby, looking at it with deep personal hurt.`,
    get choices() {
        if (sflag('c1c_guest') !== 'open') return [{ text: 'Move on.' }];
        return [{ text: 'Pick the lock on the override keyhole. (minigame)', onSelect: () => playMinigame('lockpick', { pins: 5, time: 50, outLine: '"Leave it!" the guest cries. "I\'ll call a locksmith from Safaga!" He needs a while to calm down before you try again.', outBig: 'TOO SLOW' }, r => c1cGuestResult(r)) }, { text: '"In a minute."' }];
    },
});
function c1cGuestResult(r) {
    if (!r.opened) return;
    sflag('c1c_guest', 'done'); taskDone('c1c_sq_guest'); storyPay(250, 'The One Guest, for his passport'); skillXP('lockpicking', 40, 'the hotel safe');
    storyNote('The One Guest (side quest)', 'Done. You opened the hotel guest\'s safe with your picks in front of the whole staff. Passport, a wad of money, and his wife\'s birthday written on a card. He paid you 250 and tells everyone a criminal did it.');
    Dlg.open('The One Guest', `The door swings open. Inside: a passport, a wad of banknotes, and a card on which someone has written a date. He picks up the card, reads it, and goes pale. "My wife's birthday is in March," he says faintly. "Not May." He presses money into your hand. "You never saw this card."`);
}
TASK_TARGETS.c1c_sq_guest = () => ({ room: 'INT_HOTEL', id: 'c1c_guest', out: 'c1c_hotel' });

// ============================================================
// SQ-01C-07: TAWLA AT THE TRUCK STOP
// ============================================================
STORY_SCRIPTS.c1c_champ = 'c1c_champ';
scene('c1c_champ', {
    speaker: 'Long-Haul Driver',
    text: () => sflag('c1c_tawla') === 'won'
        ? `The long-haul driver lifts his tea glass to you. "The only one on this road who ever beat me." He grins under his moustache. "If you ever break down between here and Cairo, say my lorry's number on the radio. Every driver on the coast road knows it."`
        : `A big man in a trucker's cap at a plastic table outside the café, a tawla board open in front of him and nobody sitting opposite. "Nineteen years on this road, Suez to Port Sudan and back," he says, rattling the dice in his fist. "Every café, every driver. Nobody has beaten me. Not once." He looks at you. "Fifty pounds. You win, I pay you three hundred. You lose, you buy the tea."`,
    get choices() {
        if (sflag('c1c_tawla') === 'won') return [{ text: 'Move on.' }];
        if (!sflag('c1c_tawla')) { sflag('c1c_tawla', 'open'); task('c1c_sq_tawla', '(Tawla at the Truck Stop) Beat the long-haul driver at tawla outside the truck stop café. He has never lost on this road.'); }
        const c = [];
        if (money() >= 50) c.push({ text: 'Sit down and play. (50 EGP stake; tawla)', onSelect: () => { storyPay(-50, 'Tawla stake, the truck stop'); playMinigame('tawla', { name: 'the driver', skill: 0.8 }, r => c1cTawlaResult(r)); } });
        else c.push({ text: '"I haven\'t got fifty."' });
        c.push({ text: '"Another time."' });
        return c;
    },
});
function c1cTawlaResult(r) {
    if (r.unstarted || r.left) { if (r.unstarted) storyPay(50, 'Stake back'); return; }
    clockAdvance(20);
    if (r.won) {
        sflag('c1c_tawla', 'won'); taskDone('c1c_sq_tawla'); storyPay(300, 'Tawla winnings, the truck stop'); sflag('ch1c_truckers', true);
        storyNote('Tawla at the Truck Stop (side quest)', 'Done. You beat the long-haul driver who had never lost on the coast road. He paid three hundred, and gave you his lorry\'s number: say it on the radio and every driver on the road will help.');
        Dlg.open('Long-Haul Driver', `He stares at the board for a long time. Then he laughs, a huge laugh that turns heads inside the café, and slaps three hundred pounds on the table. "Nineteen years!" He writes a number on a paper napkin. "My lorry. Say it on the radio if you're ever stuck on this road."`);
    } else Dlg.open('Long-Haul Driver', `"Nineteen years," he says comfortably, sweeping the checkers back to the start. "Tea, two sugars. Again?"`);
}
TASK_TARGETS.c1c_sq_tawla = () => 'c1c_champ';

// ============================================================
// SQ-01C-08: THE IMAM'S LOUDSPEAKER
// ============================================================
STORY_SCRIPTS.c1c_imam = 'c1c_imam_q';
scene('c1c_imam_q', {
    speaker: 'The Imam',
    text: () => {
        const q = sflag('c1c_speaker');
        if (q === 'done') return `The imam, sweeping the mosque step, stops to listen to the gulls. "At dusk the call reaches the end of the breakwater now. The fishermen say they can hear it at the reef." He smiles. "God bless your hands, my son, whatever else they do."`;
        if (q) return `"The minaret door is open," the imam says. "Mind the eleventh step. It's been loose since 1987."`;
        return `The imam, sweeping the mosque step. "Peace be upon you." He leans on the broom. "Pay your debts, my son." Then, in a different voice: "You're good with your hands. Everybody says so, usually unkindly. The loudspeaker on the minaret coughs and dies in the middle of the call. At dawn yesterday it said 'God is gr—' and stopped. The whole town waited." He sighs. "The electrician is in Safaga until God knows when."`;
    },
    get choices() {
        if (!sflag('c1c_speaker')) return [{ text: '"I\'ll take a look."', onSelect: () => { sflag('c1c_speaker', 'open'); task('c1c_sq_speaker', '(The Imam\'s Loudspeaker) Climb the minaret (the mosque) and find out why the loudspeaker keeps cutting out.'); storyNote('The Imam\'s Loudspeaker (side quest)', 'The loudspeaker on the minaret cuts out in the middle of the call to prayer. The imam has left the minaret door open for you.'); } }, { text: 'Move on.' }];
        return [{ text: 'Move on.' }];
    },
});
STORY_SCRIPTS.c1c_mosque = () => sflag('c1c_speaker') && sflag('c1c_speaker') !== 'done' ? 'c1c_minaret' : null;
scene('c1c_minaret', {
    speaker: 'System',
    text: () => sflag('c1c_speaker') === 'open'
        ? `Up the minaret's narrow spiral, eighty-one steps, the eleventh one loose, to the little balcony where the loudspeaker horns are strapped to the rail. The whole town is below you, and the harbour, and the sea going out to the edge of the world.\n\nThe amplifier is in a tin box at your feet. You open it. The red wire into the horns is green with corrosion where it meets the screw, and the black one hangs loose. And the battery box is empty.`
        : hasItem('Batteries') ? `Up the eighty-one steps again with four fat batteries in your pocket. The tin amplifier box is waiting, its battery box open and empty.` : `Up the minaret. The wires are fixed, but the amplifier's battery box is still empty. Somebody has had the batteries. Somebody small, probably.`,
    get choices() {
        const q = sflag('c1c_speaker');
        if (q === 'open') return [{ text: 'Scrape the wires bright with your knife, screw them down tight, and tape them.', onSelect: () => { sflag('c1c_speaker', 'wired'); skillXP('climbing', 15); task('c1c_sq_speaker', '(The Imam\'s Loudspeaker) The wires are fixed, but the amplifier\'s batteries are gone. Find four D batteries: the kiosk sells them, or find who took them.'); storyNotice('Somebody took the amplifier\'s batteries.'); } }];
        if (hasItem('Batteries')) return [{ text: 'Put the batteries in, and switch it on.', onSelect: () => c1cSpeakerDone() }];
        return [{ text: 'Climb back down.' }];
    },
});
// the boy who took them: the one in the green football shirt by the main street, with a boat to race
(function () {
    const prev = STORY_SCRIPTS.c1c_kid1;
    STORY_SCRIPTS.c1c_kid1 = e => sflag('c1c_speaker') === 'wired' && !hasItem('Batteries') && !sflag('c1c_kid_batt') ? 'c1c_kid_batt' : (typeof prev === 'function' ? prev(e) : prev);
})();
scene('c1c_kid_batt', {
    speaker: 'Boy',
    text: `The boy in the green football shirt is holding a remote control and staring very hard at nothing. At the end of the quay, a little red plastic boat is turning circles in the harbour by itself, very fast.\n\nYou look at the boat. You look at the remote. You look at him.\n\n"It's the fastest boat in Marsa Tarfa," he says, in a small voice. "It needed four big ones."`,
    choices: [
        { text: '"Give them back, and I\'ll buy you new ones." (10 EGP)', onSelect: () => { storyPay(-Math.min(10, money()), 'New batteries for the boy\'s boat'); sflag('c1c_kid_batt', 'bought'); pocket('Batteries'); storyNotice('He fishes the boat out and gives you the batteries.'); } },
        { text: '"Give them back, or the imam tells your mother."', onSelect: () => { sflag('c1c_kid_batt', 'threat'); pocket('Batteries'); storyNotice('He hands the batteries over, with the face of a ruined man.'); } },
    ],
});
(function () {
    const prev = STORY_SCRIPTS.c1c_kiosk;
    STORY_SCRIPTS.c1c_kiosk = STORY_SCRIPTS.c1c_kioskman = e => sflag('c1c_speaker') === 'wired' && !hasItem('Batteries') ? 'c1c_kiosk_batt' : (typeof prev === 'function' ? prev(e) : prev);
})();
scene('c1c_kiosk_batt', {
    speaker: 'Kiosk Man',
    text: `"D batteries? Four?" The kiosk man doesn't take his eyes off the match. "Twelve. I had eight, but a boy bought four last week with money he says he found."`,
    get choices() { const c = []; if (money() >= 12) c.push({ text: 'Buy four. (12 EGP)', onSelect: () => { storyPay(-12, 'Batteries, the kiosk'); pocket('Batteries'); } }); c.push({ text: 'Not now.' }); return c; },
});
function c1cSpeakerDone() {
    dropItem('Batteries'); sflag('c1c_speaker', 'done'); taskDone('c1c_sq_speaker'); skillXP('climbing', 15);
    storyNote('The Imam\'s Loudspeaker (side quest)', 'Done. Corroded wires, and the amplifier\'s batteries "borrowed" ' + (sflag('c1c_kid_batt') ? 'by a boy for his remote-control boat' : 'by somebody') + '. The minaret\'s loudspeaker works again, and the call carries to the end of the breakwater.');
    Dlg.open('System', `You click the switch. The amplifier hums. Far below, the imam, who has been waiting at the foot of the minaret with his face turned up, raises both hands.\n\nAt the next call, his voice goes out over the roofs and the harbour, whole and clear, all the way to the end of the breakwater. On the quay, an old fisherman stops mending his net and listens to the end of it.`);
}
TASK_TARGETS.c1c_sq_speaker = () => sflag('c1c_speaker') === 'wired' && !hasItem('Batteries') ? ['c1c_kid1', 'c1c_kiosk'] : 'c1c_mosque';

// ============================================================
// SQ-01C-09: GOATS IN THE WADI (herding: goats run from you)
// ============================================================
const GOAT_START = [[3.0, 10.5], [5.2, 13.2], [3.4, 12.6]], GOAT_HOME_X = 9.4;
function goatSprite(flip) {
    const [c, g] = mk(20, 16), A = pa(g), X = x => flip ? 19 - x : x;
    A.ell(X(9), 8, 6, 3, '#e8e0d0'); A.ell(X(9), 7, 5, 2, '#f8f4ea');                                    // body
    A.r(X(15) - (flip ? 3 : 0), 3, 4, 4, '#e8e0d0'); A.px(X(17), 4, '#2a2420'); A.px(X(15), 2, '#8a7a6a'); A.px(X(16), 1, '#8a7a6a');   // head, eye, horns
    A.r(X(17) - (flip ? 1 : 0), 6, 2, 1, '#c8b8a0');                                                    // beard
    for (const lx of [5, 7, 11, 13]) A.r(X(lx), 10, 1, 4, '#5a4a3a');
    A.r(X(3), 6, 2, 2, '#e8e0d0');                                                                       // tail
    return { c: outline(c), ox: -10, oy: -15 };
}
const Goats = {
    list: [], map: null,
    on() { return Game.maps.ch1 && area() === AREAS.fixer && !!sflag('c1c_goats') && sflag('c1c_goats') !== 'no'; },   // (out once you've said yes; they stay with the boy after)
    ensure() {
        const m = Game.maps.ch1;
        if (this.map !== m) { this.map = m; this.list = []; }
        if (!this.on() || this.list.length) return;
        const L = goatSprite(false), R = goatSprite(true);
        const home = sflag('c1c_goats') === 'done' ? [0, 1, 2] : sflag('c1c_goats_home') || [];
        this.list = GOAT_START.map(([tx, ty], i) => {
            const e = World.addEnt(m, { x: tx * TILE, y: ty * TILE, w: 0, d: 0, id: 'c1c_goat' + i, label: 'Goat', spr: R, sprL: L, sprR: R, sortY: ty * TILE, say: ['Goat', '"Meh-eh-eh." It looks at you with its strange sideways pupils, and edges away.'] });
            e.wt = Math.random() * 2; e.home = home.includes(i); e.i = i;
            if (e.home) { e.x = (GOAT_HOME_X + 0.6 + i * 0.5) * TILE; e.y = (12.2 + (i % 2) * 0.8) * TILE; }
            return e;
        });
    },
    frame(dt) {
        if (!Game.maps.ch1) return;
        this.ensure();
        if (!this.on()) { if (this.list.length) { for (const e of this.list) World.removeEnt(this.map, e); this.list = []; } return; }
        if (Game.map !== this.map || Dlg.active || Game.state !== 'play') return;
        const p = Game.player, m = this.map;
        for (const e of this.list) {
            if (e.home) continue;
            const dx = e.x - p.x, dy = e.y - p.y, d = Math.hypot(dx, dy);
            let vx = 0, vy = 0;
            if (d < 2.4 * TILE) { const s = 64 * (1 - d / (2.4 * TILE) * 0.4); vx = dx / (d || 1) * s; vy = dy / (d || 1) * s; }   // shy: away from you
            else { e.wt -= dt; if (e.wt <= 0) { e.wt = 1.5 + Math.random() * 2; const a = Math.random() * Math.PI * 2; e.wx = Math.cos(a) * 10; e.wy = Math.sin(a) * 10; } vx = e.wx || 0; vy = e.wy || 0; }
            const nx = e.x + vx * dt, ny = e.y + vy * dt, free = (x, y) => !World.blocked(m, x - 5, y - 5, 10, 5) && x > 1.2 * TILE && y > 9.1 * TILE && y < 13.9 * TILE;
            if (free(nx, ny)) { e.x = nx; e.y = ny; } else if (free(nx, e.y)) e.x = nx; else if (free(e.x, ny)) e.y = ny;
            if (vx) e.spr = vx < 0 ? e.sprL : e.sprR;
            e.sortY = e.y;
            if (e.x >= GOAT_HOME_X * TILE) {                                                                   // down at the wadi mouth: the boy has it
                e.home = true; const home = sflag('c1c_goats_home') || []; home.push(e.i); sflag('c1c_goats_home', home);
                e.x = (GOAT_HOME_X + 0.6 + e.i * 0.5) * TILE; e.y = (12.2 + (e.i % 2) * 0.8) * TILE; e.spr = e.sprL; e.sortY = e.y;
                Sfx.tone(520, 0.08, 'triangle', 0.05);
                const n = this.list.filter(q => q.home).length;
                if (n >= this.list.length) c1cGoatsDone(); else storyNotice('A goat trots down to the boy. ' + n + ' of ' + this.list.length + '.');
            }
        }
    },
    clear() { if (this.map) for (const e of this.list) World.removeEnt(this.map, e); this.list = []; },
};
STORY_SCRIPTS.c1c_goatboy = 'c1c_goatboy';
scene('c1c_goatboy', {
    speaker: 'Goat Boy',
    text: () => {
        const q = sflag('c1c_goats');
        if (q === 'done') return `The goat boy is sitting on a rock at the wadi mouth with his three goats round him, eating something. "My father says you have the hands of a thief and the heart of a shepherd," he says. "He meant it nicely."`;
        if (q === 'open') return `"They won't come to me," the boy says miserably. "They come away from you. Go round behind them, up the wadi, and walk them down. Slowly. Goats hate slowly."`;
        return `A small boy in a brown galabeya at the mouth of the wadi, holding a stick and a rope and nothing on the end of the rope.\n\n"My father's goats went up the wadi," he says. "Three. I was supposed to watch them. I watched a lorry instead." He looks up the wadi, where something white moves between the rocks. "If they're not home before dark, my father will..." He doesn't finish. "They run away from me. Maybe they'll run away from you better."`;
    },
    get choices() {
        if (!sflag('c1c_goats')) return [{ text: '"I\'ll bring them down."', onSelect: () => { sflag('c1c_goats', 'open'); task('c1c_sq_goats', '(Goats in the Wadi) Three goats have strayed up the wadi. Goats run away from you: go round behind them and drive them down to the boy at the wadi mouth.'); storyNote('Goats in the Wadi (side quest)', 'A boy\'s three goats have strayed up the wadi, west of the highway. Goats run away from you, so get behind them and walk them down to the boy at the wadi mouth.'); } }, { text: '"Not my goats."' }];
        return [{ text: 'Move on.' }];
    },
});
function c1cGoatsDone() {
    sflag('c1c_goats', 'done'); taskDone('c1c_sq_goats'); skillXP('stealth', 15);
    storyNote('Goats in the Wadi (side quest)', 'Done. You walked three goats down the wadi to the boy at its mouth, which took more patience than anything Bassem has ever asked of you.');
    Dlg.open('Goat Boy', `The boy counts them three times, touching each goat on the head. Then he gives you, solemnly, the most valuable thing he has: half a packet of biscuits. "Don't tell my father about the lorry."`, () => eat(15, 'Half a packet of biscuits'));
    setTimeout(() => { for (const e of Goats.list) e.home = true; }, 0);
}
TASK_TARGETS.c1c_sq_goats = () => { const g = Goats.list.find(e => !e.home); return g ? g.id : 'c1c_goatboy'; };
(function () {
    const A = AREAS.fixer, _frame = A.frame, _sync = A.sync;
    A.frame = function (dt) { _frame.call(this, dt); Goats.frame(dt); };
    A.sync = function () { _sync.call(this); Goats.map = null; Goats.list = []; };
})();

// ============================================================
// ALL NINE: the leaving line (poke/leaving.js) and the end card
// ============================================================
AREAS.fixer.sideQuests = [
    { name: "Rana's Reef", done: () => sflag('c1c_reef') === 'done', line: 'You cut the ghost net off the north reef with Rana.' },
    { name: "The Fort's Cannon", done: () => sflag('c1c_cannon') === 'done', line: 'You found the Turks\' coins under the old gun platform.' },
    { name: 'Fish for the Hotel', done: () => sflag('c1c_hotelfish') === 'done', line: 'You fed the hotel\'s one guest, and the cook gave you his rod.' },
    { name: "The Coast Guard's Cousin", done: () => sflag('c1c_cousin') === 'done', line: 'You carried insulin up the wadi for the Ababda. The mountain remembers.' },
    { name: "Bassem's Nephew", done: () => sflag('c1c_nephew') === 'done', line: 'You got Bassem\'s nephew off the quay.' },
    { name: 'The One Guest', done: () => sflag('c1c_guest') === 'done', line: 'You opened the hotel guest\'s safe. Wrong birthday.' },
    { name: 'Tawla at the Truck Stop', done: () => sflag('c1c_tawla') === 'won', line: 'You beat the driver who had never lost on the coast road.' },
    { name: "The Imam's Loudspeaker", done: () => sflag('c1c_speaker') === 'done', line: 'The call to prayer carries to the breakwater again.' },
    { name: 'Goats in the Wadi', done: () => sflag('c1c_goats') === 'done', line: 'You walked three goats down the wadi.' },
];
(function () {
    const _show = EndCard.show;
    EndCard.show = function (title, sub, lines, next) {
        if (area() === AREAS.fixer && Array.isArray(lines)) {
            const Q = AREAS.fixer.sideQuests, done = Q.filter(q => q.done());
            lines = lines.concat(done.map(q => q.line), ['Side quests: ' + done.length + ' of ' + Q.length + ' done.']);
        }
        return _show.call(this, title, sub, lines, next);
    };
})();
