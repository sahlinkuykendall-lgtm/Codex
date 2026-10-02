// ============================================================
// THE CODEX OF GIZA — POKE STYLE: MARSA TARFA'S SIDE QUESTS, PART 2 (poke/ch1c_side2.js)
// The rest of the bible's side quests for Chapter 1-C (story/regions/ch01_opening_fixer.md):
//   SQ-01C-03 Fish for the Hotel: the hotel cook wants three good fish (the big ones, off the
//             island's far rocks). → his rod for fishing off the north breakwater (fishing
//             unlocked in the harbour), and his kitchen at half price (the cook's discount)
//   SQ-01C-04 The Coast Guard's Cousin: the fisherman's cool box of insulin, which came in on a
//             boat that didn't stop at customs, to a man from the mountain villages at the head
//             of the wadi. → Bedouin rep, and a Bedouin contact (ch1c_bedouin, for Ch6)
//   SQ-01C-05 Bassem's Nephew: Bassem's sister wants her boy off Bassem's quay. Find him work
//             with Zaki or Rana, or talk him out of it. → Rana +, and Bassem takes 2,000 off
//             the debt, "for my sister"
// Everyone here is nameless (the bible's rule for Ch1-C). The sister and the boy are about by day.
// ============================================================

Object.assign(LOOKS, {
    c1c_cook: { skinCol: SKINS[5], top: ['#f8f8f4', '#e4e4dc', '#c4c4bc'], topKind: 'jacket', legs: ['#3a3e48', '#2a2e36', '#1c1e24'], head: 'skullcap', headCol: ['#f8f8f4', '#e4e4dc', '#c4c4bc'], face: 'tache', tache: '#2a2424', wide: true, shoe: '#1c1814' },
    c1c_sister: { skinCol: SKINS[4], robe: ['#2a5a5a', '#1e4646', '#143232'], head: 'hijab', headCol: ['#e8d8b0', '#c8b890', '#a89870'], shoeKind: 'babouche', shoe: '#1c1814', slim: true },
    c1c_nephew: { skinCol: SKINS[5], top: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], topKind: 'tee', legs: CLOTH.indigo, botKind: 'jeans', hairStyle: 'short', hairCol: HAIRS[0], face: 'shades', slim: true, shoeKind: 'sneakers', shoe: '#ffffff' },
    c1c_bedouin: { skinCol: SKINS[8], robe: ['#e8e0cc', '#ccc4ae', '#a8a08a'], head: 'turban', headCol: ['#f4f4f0', '#dcdcd4', '#b8b8b0'], face: 'beard', beard: '#2a2420', shoeKind: 'sandals', shoe: '#5c3418' },
});
Object.assign(CAST, { c1c_cook: 'c1c_cook', c1c_sister: 'c1c_sister', c1c_nephew: 'c1c_nephew', c1c_bedouin: 'c1c_bedouin' });
Object.assign(ITEM_INFO, {
    "The cook's rod": { key: 1, desc: 'The hotel cook\'s fishing rod: old cane, a new reel, a lure he swears by. "Bring it back with fish on it." Fish off the end of the north breakwater.' },
    'Cool box (insulin)': { key: 1, desc: 'A blue picnic cool box, taped shut, heavy with ice packs. Insulin, antibiotics, test strips: medicine for the mountain villages that the Ministry of Health hasn\'t sent up the wadi in two years. It came in on a boat that didn\'t stop at customs.' },
});
(function () {
    const L0 = marsaLayout;
    marsaLayout = function () {
        const L = L0();
        L.things.push(['c1c_cook', 43, 8, 1, 1], ['c1c_kitchendoor', 42, 7, 1, 1], ['c1c_quayfish', 63, 21, 1, 1], ['c1c_bedouin', 2, 12, 1, 1], ['c1c_sister', 25, 41, 1, 1], ['c1c_nephew', 56, 36, 1, 1]);
        return L;
    };
})();
POKE_MAP_1C.objects.push(
    { id: 'c1c_cook', label: 'Hotel Cook', model: 'person' }, { id: 'c1c_sister', label: 'Woman in Green', model: 'person' },
    { id: 'c1c_nephew', label: 'Boy on the Quay', model: 'person' }, { id: 'c1c_bedouin', label: 'Man from the Mountain', model: 'person' },
    { id: 'c1c_kitchendoor', label: 'Kitchen Door', model: 'kitchen door', say: ['System', 'The hotel kitchen\'s back door, propped open with a gas bottle, letting out heat and the smell of onions and cumin.'] },
    { id: 'c1c_quayfish', label: 'Fishing Spot', model: 'rod holder', say: ['System', 'The end of the north breakwater, where the old men fish: a pipe wedged between two blocks for a rod, a crate to sit on, fish scales dried silver on the concrete. The water goes deep and dark right off the edge.'] },
);
SPR_L['kitchen door'] = (w, d) => {
    const st = propStage(w, d, 24, 26), { A } = st, x = st.x, y = st.y;
    A.r(x + 4, y + 8, 12, 18, '#3a3020'); A.r(x + 4, y + 8, 12, 2, '#5a4a30');                     // the dark doorway
    A.r(x + 15, y + 16, 7, 10, '#c8ccd0'); A.r(x + 16, y + 14, 5, 3, '#86949e'); A.vl(x + 21, y + 16, 10, '#86949e');   // the gas bottle propping it
    for (let k = 0; k < 3; k++) A.r(x + 6 + k * 3, y + 2 - k * 2, 2, 2, 'rgba(240,240,240,0.6)');  // steam
    return propFit(st, w, d, { solid: [2, d - 8, w - 4, 8] });
};
SPR_L['rod holder'] = (w, d) => {
    const st = propStage(w, d, 26, 26), { A } = st, x = st.x, y = st.y;
    A.r(x + 2, y + 16, 12, 8, '#8e6a3e'); A.hl(x + 2, y + 16, 12, '#b08850'); A.vl(x + 8, y + 16, 8, '#6a4e2c');   // the crate
    A.r(x + 18, y + 6, 2, 18, '#86949e'); A.line(x + 19, y + 6, x + 25, y - 0, '#c8a060');                       // the pipe, a rod in it
    A.r(x + 3, y + 22, 2, 1, '#e8eaf0'); A.r(x + 12, y + 23, 2, 1, '#e8eaf0');
    return propFit(st, w, d, { solid: [2, d - 10, w - 4, 8] });
};
const DAY_ONLY_1C = { c1c_sister: 1, c1c_nephew: 1, c1c_bedouin: 1 };
(function () {
    const A = AREAS.fixer, _frame = A.frame;
    A.frame = function (dt) {
        _frame.call(this, dt);
        const m = Game.maps.ch1; if (!m || Game.map !== m) return;
        const night = dusk1C();
        for (const e of m.people) if (DAY_ONLY_1C[e.id]) e.gone = night || (e.id === 'c1c_nephew' && !!sflag('c1c_nephew_done'));
    };
})();

// ============================================================
// SQ-01C-03: FISH FOR THE HOTEL
// ============================================================
const GOOD_FISH = ['Red snapper', 'Bluefin trevally', 'Coral grouper'];
const goodFishInBag = () => GOOD_FISH.filter(n => (Game.bag[n] || 0) > 0);
const cookPrice = n => FISH_1C[n][0] + 25;
STORY_SCRIPTS.c1c_cook = STORY_SCRIPTS.c1c_kitchendoor = 'c1c_cook';
scene('c1c_cook', {
    speaker: 'Hotel Cook',
    text: () => {
        const q = sflag('c1c_hotelfish'), n = sflag('c1c_hotelfish_n') || 0;
        if (q === 'done') return `The cook waves a ladle at you from the doorway. "My fisherman! Sit, eat. For you, half price, for life. Or at least until the Germans come."`;
        if (q === 'open') return `"${n} of three," the cook says. "The big ones: snapper, trevally, grouper. Off the far rocks of the island, where the ospreys dive. Not parrotfish. I am feeding a guest, not a cat."`;
        return `A big man in a cook's whites, sitting on an upturned crate by the kitchen door with a cigarette and a face like a funeral.\n\n"One guest," he says, to nobody. "Forty rooms, one guest, and he is my cousin, and he wants fish. Good fish. And the fishermen sell the good fish to the hotels in Quseir, where the Germans are." He looks at you. "You. You have a face like a man who needs money. Can you fish?"`;
    },
    get choices() {
        const q = sflag('c1c_hotelfish'), c = [];
        if (!q) { c.push({ text: '"I can fish."', onSelect: () => c1cHotelFishAccept() }); }
        if (q === 'open' && goodFishInBag().length) c.push({ text: 'Give him your big fish. (' + goodFishInBag().map(n => (Game.bag[n] > 1 ? Game.bag[n] + ' ' : '') + n.toLowerCase()).join(', ') + ')', onSelect: () => c1cHotelFishGive() });
        if (q === 'done') {
            if (!fed1C('c1c_cook_at', 180) && money() >= 15) c.push({ text: 'Fish soup, rice and salad, in the kitchen. (15 EGP, half price; 20 minutes)', onSelect: () => { storyPay(-15, 'The hotel kitchen'); sflag('c1c_cook_at', Story.s.clock); eat(80, 'Fish soup and rice'); drink(15); clockAdvance(20); } });
            c.push({ text: 'A glass of water from the kitchen tap.', onSelect: () => { const r = refill(); drink(40, 'Water from the hotel kitchen'); if (r) Notice.show(r.trim()); } });
        }
        c.push({ text: q ? 'Move on.' : '"Not today."' });
        return c;
    },
});
function c1cHotelFishAccept() {
    sflag('c1c_hotelfish', 'open'); sflag('c1c_hotelfish_n', 0);
    task('c1c_sq_hotel', '(Fish for the Hotel) Bring the hotel cook three big fish: snapper, trevally or grouper, off the far rocks of Lighthouse Island (the boatman on the quay takes you over).');
    storyNote('Fish for the Hotel (side quest)', 'The hotel cook wants three good fish for his one guest: red snapper, bluefin trevally or coral grouper. The big ones come off the far rocks of Lighthouse Island; the boatman takes you over by day. He pays better than the fish seller.');
    Dlg.open('Hotel Cook', '"Three. Big ones. I pay better than that woman on the quay, and I don\'t smell your fish first like she does."');
}
function c1cHotelFishGive() {
    let n = sflag('c1c_hotelfish_n') || 0, pay = 0;
    for (const f of goodFishInBag()) while (Game.bag[f] && n < 3) { dropItem(f); n++; pay += cookPrice(f); }
    sflag('c1c_hotelfish_n', n);
    storyPay(pay, 'The hotel cook, for your fish');
    if (n >= 3) {
        sflag('c1c_hotelfish', 'done'); taskDone('c1c_sq_hotel'); pocket("The cook's rod");
        storyNote('Fish for the Hotel (side quest)', 'Done. Three good fish for the hotel. The cook gave you his own rod for fishing off the end of the north breakwater, and his kitchen at half price.');
        startDialogue('c1c_cook_done');
    } else Dlg.open('Hotel Cook', `He holds the fish up to the light like a jeweller. "Good. Good. ${n} of three." He counts out the money. "More."`);
}
scene('c1c_cook_done', {
    speaker: 'Hotel Cook',
    text: `He lays the third fish on the steel table with the other two and stands back to look at them, and for a moment the funeral goes out of his face.\n\n"My cousin will eat like a pasha." He goes into the kitchen and comes back with a fishing rod: old cane, a new reel. "Mine. I don't have time to fish any more, I have one guest. Fish off the end of the north breakwater, where the old men go; the big ones come in at dusk." He points the ladle at you. "And you eat here. Half price. For life."`,
    choices: [{ text: '"Shukran, ya chef."' }],
});
STORY_SCRIPTS.c1c_quayfish = 'c1c_quayfish';
scene('c1c_quayfish', {
    speaker: 'System',
    text: () => hasItem("The cook's rod") ? `The end of the north breakwater, the water deep and dark right off the edge. Snapper and trevally come in here at dusk, the old men say, and grouper when God is feeling generous.` : `The end of the north breakwater, where the old men fish: a pipe wedged between two blocks for a rod, a crate to sit on. You haven't got a rod. The hotel cook has one, they say, that he never uses.`,
    get choices() { return hasItem("The cook's rod") ? [{ text: 'Fish. (minigame, about 10 minutes a cast)', onSelect: () => c1cFish() }, { text: 'Not now.' }] : [{ text: 'Move on.' }]; },
});
TASK_TARGETS.c1c_sq_hotel = () => goodFishInBag().length ? 'c1c_cook' : (Game.map.key === 'ch1' && Game.player.x > 68 * TILE ? 'c1c_fishrocks' : 'c1c_boatman');

// ============================================================
// SQ-01C-04: THE COAST GUARD'S COUSIN
// ============================================================
(function () {
    const prev = STORY_SCRIPTS.c1c_fisherman;
    STORY_SCRIPTS.c1c_fisherman = e => { const r = typeof prev === 'function' ? prev(e) : prev; return r === 'c1c_fisherman' && sflag('c1c_cousin') !== 'done' ? 'c1c_cousin' : r; };
})();
scene('c1c_cousin', {
    speaker: 'Fisherman',
    text: () => {
        const q = sflag('c1c_cousin');
        if (q === 'open') return `The old fisherman doesn't look up from his net. "The box is getting warm, habibi. The ice packs last until tonight. After that, it's water and good intentions."`;
        return `The old fisherman stops mending his net and looks up and down the quay before he says anything, which on this coast means it's something.\n\n"My wife's cousin is in the coast guard. Sometimes a boat comes in and he doesn't see it. Mostly cigarettes." He nudges a blue cool box under the nets with his foot. "This is not cigarettes. Insulin. Antibiotics. For the villages up in the mountains: the Ministry of Health hasn't sent anything up the wadi in two years, and there are children up there with sugar."\n\n"A man from the mountain comes down to the head of the wadi by day. Somebody has to carry it up to him. Somebody who knows how not to be seen carrying things." He looks at you. "Two hundred pounds."`;
    },
    get choices() {
        const q = sflag('c1c_cousin'), c = [];
        if (!q) {
            c.push({ text: '"I\'ll take it. Keep your two hundred."', onSelect: () => c1cCousinAccept(false) });
            c.push({ text: '"Two hundred. Fine."', onSelect: () => c1cCousinAccept(true) });
            c.push({ text: '[Lockpicking] Peel back the tape and look inside first.', nextScene: 'c1c_cousin_look' });
            c.push({ text: '"Not my business."' });
        } else c.push({ text: 'Move on.' });
        return c;
    },
});
scene('c1c_cousin_look', {
    speaker: 'Fisherman',
    text: `You lift the tape at one corner without tearing it, the way you'd lift a seal. Ice packs; rows of little glass vials with pharmaceutical labels in French; boxes of test strips; amoxicillin.\n\nThe fisherman watches you press the tape back down. "You were always careful," he says, not unkindly. "That's why I asked you."`,
    choices: [{ text: '"I\'ll take it. Keep your two hundred."', onSelect: () => { skillXP('lockpicking', 10); c1cCousinAccept(false); } }, { text: '"Two hundred. Fine."', onSelect: () => { skillXP('lockpicking', 10); c1cCousinAccept(true); } }],
});
function c1cCousinAccept(paid) {
    sflag('c1c_cousin', 'open'); sflag('c1c_cousin_paid', paid); pocket('Cool box (insulin)');
    if (paid) storyPay(200, 'The fisherman, for the carry');
    task('c1c_sq_cousin', '(The Coast Guard\'s Cousin) Carry the fisherman\'s cool box of insulin up the wadi to the man from the mountain, by day, before the ice melts.');
    storyNote('The Coast Guard\'s Cousin (side quest)', 'A cool box of insulin and antibiotics that came in on a boat that didn\'t stop at customs, for the mountain villages the Ministry of Health has forgotten. A man from the mountain waits at the head of the wadi, west of the highway, by day.');
}
STORY_SCRIPTS.c1c_bedouin = 'c1c_bedouin';
scene('c1c_bedouin', {
    speaker: 'Man from the Mountain',
    text: () => {
        const q = sflag('c1c_cousin');
        if (q === 'done') return `The man from the mountain lifts a hand from where he sits in the acacia's shade. "Peace upon you, carrier. The children send their thanks, though they don't know your name. It's better that way."`;
        if (q === 'open' && hasItem('Cool box (insulin)')) return `A lean man in a white robe and turban sitting in the thin shade of the acacia, a camel stick across his knees, as if he has been waiting a week and could wait a week more.\n\nHe sees the blue box and stands up.`;
        return `A lean man in a white robe and turban, sitting in the acacia's shade with a camel stick across his knees, looking at the road. He nods to you, and goes on looking at the road.`;
    },
    get choices() {
        if (sflag('c1c_cousin') === 'open' && hasItem('Cool box (insulin)')) return [{ text: 'Give him the cool box.', nextScene: 'c1c_bedouin_give' }];
        return [{ text: 'Move on.' }];
    },
});
scene('c1c_bedouin_give', {
    speaker: 'Man from the Mountain',
    text: () => `He opens the box right there, counts the vials with one finger, and closes it again, and his face does something complicated.\n\n"There's a girl in my village, nine years old, who has been rationing the last of hers for a month." He takes your hand in both of his, hard, a camel man's grip. "The mountain remembers. If you ever need the desert, the deep desert, not this little wadi: say you carried the box for the Ababda, and somebody will give you water and a road."` + (sflag('c1c_cousin_paid') ? '' : `\n\nHe tries to give you money. When you won't take it he looks at you for a long moment, and nods, as if you've told him something.`),
    choices: [{ text: '"Go safely."', onSelect: () => {
        dropItem('Cool box (insulin)'); sflag('c1c_cousin', 'done'); sflag('ch1c_bedouin', true); taskDone('c1c_sq_cousin');
        rep('bedouin', sflag('c1c_cousin_paid') ? 10 : 15); skillXP('stealth', 20);
        storyNote('The Coast Guard\'s Cousin (side quest)', 'Done. You carried the insulin up the wadi to the man from the mountain, for the Ababda villages. "If you ever need the deep desert, say you carried the box for the Ababda, and somebody will give you water and a road."');
    } }],
});
TASK_TARGETS.c1c_sq_cousin = () => 'c1c_bedouin';

// ============================================================
// SQ-01C-05: BASSEM'S NEPHEW
// ============================================================
STORY_SCRIPTS.c1c_sister = 'c1c_sister';
scene('c1c_sister', {
    speaker: 'Woman in Green',
    text: () => {
        const q = sflag('c1c_nephew');
        if (q === 'done') return `Bassem's sister is hanging washing on the roof of her house. She sees you and raises a wet shirt like a flag. "He comes home smelling of diesel and fish now, and he's happy." She pegs the shirt. "God keep you."`;
        if (q === 'open') return `"He's on the quay again, by the fuel store, watching the coast guard for my brother." She folds her arms. "Fifty pounds a day to sit and watch. At fifteen. And then what? Then my brother has a job for him, a small job, one night."`;
        return `A woman in a green dress, sweeping the step of her house with short, furious strokes. She stops when she sees you.\n\n"You're the one who owes my brother sixty thousand." Not an accusation; a fact, like the weather. "Bassem. I'm his sister. Don't look like that, I didn't choose him either."\n\nShe leans on the broom. "My boy works for him. Fifteen years old, and he sits on the quay all day in sunglasses, watching the coast guard for his uncle, and he thinks he's a big man. I know where that goes. So do you." She looks at you hard. "Get him out. I can't. He doesn't listen to his mother. Maybe he listens to a man who's already in the hole."`;
    },
    get choices() {
        const q = sflag('c1c_nephew');
        if (!q) return [{ text: '"I\'ll talk to him."', onSelect: () => c1cNephewAccept() }, { text: '"It\'s not my family."' }];
        return [{ text: 'Move on.' }];
    },
});
function c1cNephewAccept() {
    sflag('c1c_nephew', 'open');
    task('c1c_sq_nephew', '(Bassem\'s Nephew) Bassem\'s sister wants her boy off Bassem\'s quay. He sits by the fuel store by day, watching the coast guard. Find him something better.');
    storyNote('Bassem\'s Nephew (side quest)', 'Bassem\'s sister (the woman in green, south of the main street) wants her fifteen-year-old off the quay, where he watches the coast guard for his uncle at fifty pounds a day. "Get him out."');
}
STORY_SCRIPTS.c1c_nephew = 'c1c_nephew';
scene('c1c_nephew', {
    speaker: 'Boy on the Quay',
    text: () => sflag('c1c_nephew') !== 'open'
        ? `A boy of fifteen or so in a white T-shirt and mirror sunglasses, sitting on a bollard with his legs crossed, watching the coast guard post across the harbour. "Move, you're in my light." He's not in your light.`
        : `The boy on the bollard looks at you over his sunglasses. "My mother sent you." He snorts. "Fifty pounds a day, and my uncle says I'm going to be somebody. What've you got? Sixty thousand in the red, that's what you've got. Everybody knows."`,
    get choices() {
        if (sflag('c1c_nephew') !== 'open') return [{ text: 'Move on.' }];
        const c = [];
        if (sflag('c1c_zaki')) c.push({ text: '"Zaki needs a deckhand. Real work, on a real boat. He\'ll teach you the sea, not how to watch it."', onSelect: () => c1cNephewOut('zaki') });
        if (sflag('c1c_rana')) c.push({ text: '"Rana needs someone to fill tanks and wash wetsuits. She\'ll teach you to dive, if you\'re any good."', onSelect: () => c1cNephewOut('rana') });
        c.push({ text: '"Yes. Sixty thousand. That\'s where your uncle\'s small jobs go. Look at me."', nextScene: 'c1c_nephew_look' });
        c.push({ text: '"Never mind."' });
        return c;
    },
});
scene('c1c_nephew_look', {
    speaker: 'Boy on the Quay',
    text: `He looks. You let him: the shirt you've slept in, the hands, the eyes of a man who has to be at Bassem's villa at five.\n\nAfter a while he takes the sunglasses off. Without them he's a kid with a bad haircut.\n\n"So what do I do?"`,
    get choices() {
        const c = [];
        if (sflag('c1c_zaki')) c.push({ text: '"Go and see Captain Zaki. Tell him I sent you."', onSelect: () => c1cNephewOut('zaki') });
        if (sflag('c1c_rana')) c.push({ text: '"Go and see Rana at the dive shop. Tell her I sent you."', onSelect: () => c1cNephewOut('rana') });
        c.push({ text: '"Go home. Tell your mother you\'re done. Then find out what you\'re good at."', onSelect: () => c1cNephewOut('home') });
        return c;
    },
});
function c1cNephewOut(how) {
    sflag('c1c_nephew', 'done'); sflag('c1c_nephew_done', how); taskDone('c1c_sq_nephew');
    rel('rana', how === 'rana' ? 10 : 4, true); if (how === 'zaki') rel('zaki', 4, true);
    const where = { zaki: 'He went to Zaki, to learn the sea as a deckhand on the Umm Kalthoum.', rana: 'He went to Rana\'s dive shop, to fill tanks and wash wetsuits, and maybe learn to dive.', home: 'He went home to his mother.' }[how];
    storyNote('Bassem\'s Nephew (side quest)', 'Done. You talked Bassem\'s nephew off the quay. ' + where);
    Dlg.open('Boy on the Quay', how === 'home' ? `He gets off the bollard and stands there, and then, before he goes, hands you the sunglasses. "Keep them. They're fake anyway."` : `He gets off the bollard. "If he shouts at me, I'm coming back here." But he goes, hands in his pockets, not looking back, walking faster than he means to.`, () => {
        setTimeout(() => { storyMessage('B. Nassar', 'My sister says you took the boy off the quay. Good. I never wanted him there; she made me promise to give him work, and then she cried about it. 2,000 off. Tell nobody I am sentimental. — B.'); debtAdd(-2000, 'Bassem, "for my sister"'); }, 1500);
    });
}
TASK_TARGETS.c1c_sq_nephew = () => 'c1c_nephew';
