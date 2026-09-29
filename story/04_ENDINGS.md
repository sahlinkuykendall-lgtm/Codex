# ENDINGS

There are seven ending **families**. Each one plays as:

1. **The final scene** (a cinematic in the Library, then one location).
2. **The epilogue**: slides with narration, one per thread, each chosen from variations.
3. **The last shot**: a single image that sums up the ending family.

Big Choice 2 picks the **track** (sealed or opened). Big Choice 3 picks the **family**.
Everything else picks the **variations**.

---

## 1. SEALED TRACK (the Book never opened)

### ENDING 1 — THE DISCOVERY (`bc3_library` = `reveal`)
**The scene:** you call it in. Floodlights at Giza at dawn, Ministry trucks, and the world's
press. You walk out of the Osiris Shaft carrying the first scroll into daylight.
**The theme:** the Library comes home, to Egypt and to everyone.
**The last shot:** a museum gallery years later. A schoolgirl reads a lost Sophocles play
off a screen, and on the wall behind her there's a photograph of you.

| Variation | Decided by |
|---|---|
| **Who stands beside you at the press conference** | Amira (if `rel_amira` ≥ Warm), Mahrous (if saved in Ch4), Dr. Rania (if her student was saved), Nour (if Bonded), Youssef (unless `jailed`). An empty stage if nobody qualifies |
| **Vasse's fate** | `radwan_path` = honest → arrested on camera. Corrupt → he flies out that night and the epilogue shows him dying abroad, untouched. If the Journalist published the medical file → the world knows why he did it |
| **Credit** | `miriam_state` = saved → Miriam stands next to you and shares the credit. Keeper → an empty chair with her name on it. Dead → the Library's first hall is named for her |
| **The Library's size** | The number of Houses found (5–7 plus 6b) decides how much was saved, and the narration names the lost works it contains |
| **Alexander** | If `ch7_alexander` = announce → the epilogue opens with the "double discovery" and world fame |
| **The Keepers** | Keepers ≥ Warm → Sitt Meret watches the broadcast and smiles. Hostile → a final Keeper warning note on your pillow: *"You will see what you've let out."* (It's a bluff. Sealed track) |

### ENDING 2 — THE SALE (`bc3_library` = `sell`)
**The scene:** the scrolls go into climate-controlled crates, and a jet waits at a desert
airstrip. The money reaches your account.
**The theme:** you got rich, and the world lost it again.
**The last shot:** you, alone on a balcony somewhere expensive, with a scroll case on the
table you never opened.

| Variation | Decided by |
|---|---|
| **The buyer** | Vasse (if free) or the Gebali (Karim's line if `ch9_gebali_heir` = Karim, Hagg Mahmoud's if Hagg Mahmoud, who **refuses the Book box** and lets you keep only the scrolls) |
| **The twist** | Last-second betrayal. You can double-cross the buyer at the airstrip (needs Lena defected **or** Gebali Sworn), which turns into *"The Sale (Double-Cross)"*: you take the money **and** tip off Radwan (if honest) |
| **Lena** | Defected and Bonded → she's on the balcony with you. Neutral → a postcard from Bavaria. Betrayed → she's Vasse's new head of security in the epilogue, and she's looking for you |
| **Amira** | Always gone. The epilogue shows her testifying at a UNESCO hearing about looted heritage, and your name comes up |
| **Money** | The final figure depends on Houses found (4M–25M EGP), plus Alexander if sold |

### ENDING 3 — THE BURIAL (`bc3_library` = `reseal`)
**The scene:** the Keepers arrive with oil lamps. You help them carry the scrolls back into
the dark. Sitt Meret seals the door with Petamun's own seal, and you walk up into Giza at
night, where tourists are photographing the pyramids and nobody knows.
**The theme:** some things are safer lost.
**The last shot:** you, years later, at a café in Cairo. A stranger slides a painted Keeper
shrine tile across the table. You're one of them now, or you refuse it (your choice in
the last line).

| Variation | Decided by |
|---|---|
| **Do you keep one scroll?** | A final prompt. Keep it, and the epilogue shows you secretly translating it for decades (a lost play) |
| **Miriam** | Keeper → she carries the last scroll in beside Sitt Meret. Saved → she agreed, and teaches at Cairo University, never telling |
| **Amira** | ≥ Trusted → she's there and she agreed, and it breaks her heart. Otherwise she never forgives you (or never knows) |
| **Keeper membership** | Keepers Sworn → you're offered leadership after Sitt Meret. The final line depends on accept or refuse |

---

## 2. OPENED TRACK (the Book was opened)

### ENDING 4 — THE SCRIBE (`bc3_library` = `read`)
**The scene:** you sit at Petamun's table and read the Book to the end. The Library speaks,
and every scroll, every ibis in Egypt and every voice in every tomb is suddenly clear. The
second spell: you see the gods.
**The theme:** knowledge at any price.
**The last shot:** you in a Cairo flat, older, with walls covered in translations, and a
window full of birds.

| Variation | Decided by |
|---|---|
| **The price** | The Claimed is lost for good (`claimed` = X): a scene of them walking into the Nile at dawn. **Unless one of the two below applies** |
| **The Exchange** | Needs Keepers Sworn (Sitt Meret tells you how). You offer yourself instead: the Claimed is freed, and **you** become the Book's keeper, long-lived, bound to it, alone. The most bittersweet Scribe |
| **Nobody to lose** | If no eligible ally is ≥ Warm when the Book is finished, the Book finds nothing to take. The narration: *"It looked for someone you loved. It didn't find anyone."* The loneliest ending |
| **Vasse** | Present and desperate. He begs to read a single line. Refuse, and he dies at the Library's threshold. Let him, and he's Claimed himself (a dark coda) |

### ENDING 5 — THE RETURN (`bc3_library` = `return`) — requires `ch10_tomb_known`
**The scene:** you do what Prince Khaemwaset did 3,200 years ago. At night you carry the
Book to the tomb of Naneferkaptah at Saqqara, and set it down in the dead man's hands. The
tomb's painted wife and son seem to look up. **The Claimed wakes.** Then you go back to
Giza for the Library.
**The theme:** giving back what was taken, the oldest story in Egypt told right this time.
**The last shot:** dawn over Saqqara's Step Pyramid. The people you love are there, all of
them.

| Variation | Decided by |
|---|---|
| **The Library** | After the Return you still choose: reveal (a Discovery-style epilogue, with Amira) or reseal (a Burial-style epilogue, with the Keepers). One final choice, with no lock |
| **The Claimed** | **Always saved.** This is the only ending that guarantees it |
| **Inspector bonus** | If `bg` = inspector, the tomb is on your own old beat, and Director Fathi and Umm Sabry are there to help (a warm cameo) |
| **Sitt Meret** | Keepers ≥ Neutral → she's there and she weeps. It's the ending the Keepers waited 1,600 years for, and **the Keepers disband**. Hostile → she arrives too late and just watches |

### ENDING 6 — THE FIRE (`bc3_library` = `burn`)
**The scene:** you soak the room in lamp oil. You burn the Book first, and it screams, or it
doesn't: the game never says. Then the Library burns. **Alexandria burns twice.** You climb
out of the shaft with smoke rising behind you.
**The theme:** some knowledge is too dangerous, but at what cost?
**The last shot:** a single charred scroll fragment in your pocket, years later, with one
word still legible.

| Variation | Decided by |
|---|---|
| **The Claimed** | Saved, but they remember something of where they went, and it haunts them (an epilogue line) |
| **Who helps you** | Sitt Meret (Keepers ≥ Trusted) lights the first lamp herself. Otherwise you're alone |
| **Who never forgives you** | Amira (always, if alive), Miriam (unless she's `lost`), Father Bishoy (unless `rel_bishoy` ≥ Bonded, when he says: *"I would have read it. I understand."*) |
| **Something saved?** | If `house_6b` was left in place (Ch12) → those Nubian scrolls survive, far from the fire. The last shot shows Hajja Fatma's village in a museum instead |

---

## 3. SECRET — THE USURPER (not a choice)

### ENDING 7 — THE USURPER
**The trigger:** `vasse_has_book` = true at Ch14's final confrontation, **and** you fail to
take it back. Vasse gets the Book in one of these ways:
- Lena betrayed you in Ch13.
- You sided with Vasse and never stole it back (SQ-10-M).
- You lost the "Monastery Road" chase.

Taking it back in Ch14 is possible with **any one** of these:
- Lena defected.
- Radwan honest (police backup).
- Gebali Sworn (Hagg Mahmoud's men).
- Miriam `saved` (she reads the warning line aloud and breaks his focus).
- Stealth 4 (you get to him first).

**The scene:** it plays from **Vasse's side**. He reads. The cancer is gone, and he sees the
gods, and they are not what he wanted. The final minutes are his, and you're a figure in
the background.
**The theme:** the collector gets what he wanted, and it's the worst thing that could
happen to him.
**The last shot:** Vasse in his Geneva vault, a hundred years later, alive, alone, and
surrounded by everything, unable to stop hearing it.

| Variation | Decided by |
|---|---|
| **You** | Stealth ≥ 3 or any ally present → you escape, and the epilogue shows you trying to warn a world that won't believe you. Otherwise you're found at the Library door, alive but silent (a closing shot) |
| **The Claimed** | Freed when Vasse reads (the Book takes from him now, and he has no one) |
| **Lena** | If she betrayed you, she's the one who finds Vasse at the end. Her last line decides her |

This is the only truly bad ending. A player who reaches it has missed several ways out,
and the game should make them feel it.

---

## 4. THE CLAIMED (opened track mechanics)

When the Book is opened (Ch9), `claimed` is set to the eligible ally with the highest
affinity (`01_CHARACTERS.md`). They fade in four stages:

| Chapter | Stage | What you see |
|---|---|---|
| Ch10 | **Dreams** | They tell you about a river dream. It's funny at first |
| Ch11 | **Sickness** | Cold hands, water on the floor where they sleep, they forget your name once |
| Ch12–13 | **Vanishing** | They disappear in Ch13 (walk into the Nile at night, or out into the Sinai). Their rescue quest is **"The Weighing"** (SQ-13-W): find them at a real place (the Nile bank at Aswan, or the Serabit temple) and bring them back. **Succeeding keeps them alive until Ch14, but doesn't break the claim** |
| Ch14 | **The claim resolves** | Return saves them. Fire saves them. The Scribe loses them (unless the Exchange). The Usurper frees them |

**How to learn what saves them:** from Sitt Meret (Keepers Sworn), from Petamun's letter in
House 6 (on the opened track his margin notes change), or from the dead at Coptos (Ch10
echo). If the player never learns, the Library choice is still there. They just choose
blind.

---

## 5. EPILOGUE SLIDE ORDER (every ending)

1. **The Library / the Book** (per ending)
2. **Egypt** (what the world learns, or doesn't)
3. **Miriam**
4. **Amira**
5. **Youssef and his family**
6. **Lena**
7. **Nour and Nubia**
8. **The Gebali family** (Hagg Mahmoud or Karim)
9. **Radwan and Omar**
10. **The Keepers / Sitt Meret**
11. **Ibrahim**
12. **Your background thread:**
    - Archaeologist: the dig and Rais Abdallah.
    - Inspector: Saqqara and your career.
    - Fixer: Bassem's debt and the Red Sea.
    - Journalist: the story you publish or bury.
13. **You** (the last shot)

Skip the slide for a character the player never met. Every slide has 3–5 variations,
chosen by that character's final flags.
