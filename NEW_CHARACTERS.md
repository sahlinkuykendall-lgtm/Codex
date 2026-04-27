# NEW CHARACTERS — COMPANION DOCUMENT TO MASTER_LORE_BIBLE
**New recurring NPCs introduced in the expansion pass.**
**Reference: MASTER_LORE_BIBLE.md for world context.**

---

## HOW TO USE THIS DOCUMENT

Each character entry provides enough detail that another Claude instance can write dialogue in their voice without asking for clarification. For each character:

- **Voice rules:** how they speak.
- **Agenda:** what they want and what they are hiding.
- **Relationships:** how they respond to Ellis's choices and flags.
- **Never do:** voice/behavior patterns that break character.

The four major new NPCs are introduced in Chapters 3 and 4. Minor NPCs are introduced across Chapters 1, 3, and 5.

---

## MAJOR NEW CHARACTERS

### 1. FATHER MATTHIAS ASFOUR

**Age:** 68. **Born:** Cairo, 1957. **Profession:** Coptic priest; keeper of the Order of the Unshut Eye's central archive beneath the Church of St. George in Old Cairo.

**Appears in:** Ch3 (introduction, archive side quest, Fayyum reference), Ch5 (brief visit, warning scene if Ellis has earned his trust), Ch7 (letter, ending-variant only).

#### Background

The Asfour family line has tended the Order's archive since the 1890s. Matthias is the fifth-generation keeper. His grandfather's grandfather, Anba Yusef Asfour, was inducted into the Order in 1872 by a Turkish visitor carrying a fragment of a 12th-century Coptic manuscript — the **Asfour Codex** — which described a Heart-encounter in Giza by a monk named Abba Bishoi in the year 1198 AD.

Matthias has read the Asfour Codex eleven times. He believes roughly half of it.

He is a working priest — says Mass, hears confessions, visits the sick. The Order is his second vocation. He does not see them as incompatible. He believes the Uarha were creatures of God, made before humans, and that their record-keeping is a form of prayer. Not everyone in the Order agrees; he doesn't fight them on it.

**What he is guarding:** The archive itself — thousands of documents, photographs, recorded interviews, fragments of Uarha-derived text, the 1957 interview with a young Abdul-Aziz Hassan (Tariq's grandfather), and — critically — a **map of the Giza underground compiled from 220 years of recovered testimony**. The map is incomplete but the best overview that exists on the surface.

**What he lost:** His younger brother, Anba Kyrillos Asfour, went into the Giza underground in 1994 on a solo expedition against Matthias's explicit warning. Never came back. Matthias has been writing a memorial liturgy for him every year on the anniversary. He has not published it. If Ellis earns the right flag (`matthias_brother_told`), Matthias will read it aloud.

#### Voice Rules

- **Speaks English carefully, with Coptic-Arabic cadence.** Uses religious English fluently; uses colloquial English less well. Avoids contractions in formal speech; uses them when tired or emotional.
- **Gentle, patient, but never soft.** Will push back on Ellis's academic arrogance with a kind but firm correction.
- **Uses religious framing naturally, not performatively.** "God willing, you will find what you are looking for." "That is a matter for heaven to decide, not me."
- **Quotes scripture, Hermetic text, and Uarha fragments interchangeably.** Treats them as different dialects of the same conversation.
- **Contrast to Ellis:** where Ellis is dry, Matthias is warm. Where Ellis is precise, Matthias is *patient*. Where Ellis hedges ("probably," "perhaps"), Matthias is willing to simply not know.

#### Example Dialogue

> "You will tell me I am a credulous old man. That is fine. I have been called worse by better scholars than you. But I have been keeping this archive for forty-six years, Dr. Vance, and I can tell you this: every man who has come to me looking for what is beneath Giza has come looking for something different. Some come for fame. Some for money. Some for God. You have come looking for a friend. That is new."

> "The Uarha were not demons. They were not gods. They were people, and they are nearly gone. I think that is the saddest story I have ever read. I think it is why I keep reading it."

> (softly, if `matthias_brother_told`): "My brother was a better priest than me. He believed the Uarha were a test of our humility. I think he believed it too literally."

#### Agenda

- **Publicly:** maintain the archive, serve his parish, be a good priest.
- **Privately:** determine whether Ellis is someone the archive can trust. Decide whether to give Ellis access to the sealed lower shelves (where the compiled Giza map is kept). Hope to find, before he dies, someone who can take over the archive after him.
- **Secret:** he is writing a full history of the Order — 500 pages — that he intends to publish posthumously. Only Yusra knows. If Ellis reaches a specific Ch7 ending (Witness or Memorial), Matthias dies of natural causes before the history is published; it is then published by Ngozi.

#### Relationships with Flags

- If `Yusra_Trusted` (Ch3): Matthias is immediately open. Yusra vouched for Ellis.
- If `Saqqara_Was_Arranged` before meeting Matthias: he is already grieving. He knew Sam only through Yusra's reports. Says: "Your friend was closer to the truth than he knew."
- If `matthias_brother_told`: he shares the Kyrillos story. Unlocks access to the compiled Giza map. Critical for Ch4 planning.
- If Ellis is caught being disrespectful (e.g., dismisses Coptic tradition as "folklore"): he becomes formal, brief. Archive access is denied. Ellis loses a major lore avenue.
- If `inspector_files_opened` (Ch3 ministry capture): Matthias will not meet Ellis in person. Sends a courier with a single note. Ellis cannot access the full archive in this playthrough.

#### Never Do

- Never have Matthias give a full lecture. He teaches in fragments, the way scripture does.
- Never have him lose his temper. The closest he comes is a long silence.
- Never have him dismiss Iry's existence if Ellis has mentioned it — he will be astonished, and he will *believe*. But he will also be cautious; he will want to verify before he commits his whole life's work to that single claim.
- He does not speak Uarha fluently. He can pronounce the Asfour chants correctly (which, unknown to him, are fragments of real Uarha). He does not understand what they mean until Iry tells him later, via Ellis.

---

### 2. INSPECTOR NADIA KAREEM

**Age:** 38. **Born:** Alexandria, 1986. **Profession:** Egyptian Ministry of Antiquities, Regional Inspector for Cairo and Giza Governorates. Degree in Egyptology from Cairo University; post-grad at Leiden.

**Appears in:** Ch3 (introduction; can be allied or antagonist), Ch5 (allied presence at standoff or antagonist on arrival depending on flags), Ch7 (ending echoes).

#### Background

Nadia's mentor, **Dr. Rashad Hussein**, was a senior Ministry archaeologist who spent his career quietly cataloguing unexplained anomalies at Giza. In 2018 he submitted a formal report to the Ministry flagging "persistent subsurface activity inconsistent with known geological models." Within four months he was reassigned to a desk position in Aswan. Within eighteen months he was dead — ostensibly of a heart attack, age 61. His widow never believed the official cause.

Nadia inherited his files when she was promoted to Regional Inspector in 2022. She has been quietly finishing his case ever since, using her Ministry credentials as cover. She keeps his report in her office safe. She re-reads it once a month.

**Motivation:** She wants to know what killed her teacher. She is not zealous. She is methodical and patient. She suspects foreign interference but she does not know about the Concern by name — she has a list of 23 individuals who keep appearing in the margins of suspect dig permits, and Halberd is one of them.

**What she doesn't know:** the Order exists. She would be delighted to meet them if Ellis can broker it. She does not know about the Uarha. She would believe it if Ellis showed her compelling evidence.

#### Voice Rules

- **Speaks excellent English; prefers Arabic when comfortable.** Uses English for business, Arabic when angry or tired.
- **Bureaucratic on the surface, personal underneath.** Every first conversation is formal. Subsequent conversations warm by degrees.
- **Dry in a different register from Ellis.** Where Ellis's dryness is academic ("probably a vibrational artifact"), Nadia's is institutional ("the Ministry's position on that is, as always, undefined, which I assume is the answer you were looking for").
- **Never apologizes for her job.** She is not conflicted about being a state employee in a state with complicated politics. She works the system because the system is what she has.
- **Smokes. Will offer Ellis a cigarette at their second meeting. If he declines politely, she respects it. If he declines with moral commentary, she notes it silently against him.**

#### Example Dialogue

> "Dr. Vance. Your permit is irregular, your research assistant is a dead man, your primary funder is three shell corporations in the Channel Islands, and your most recent field report mentions 'ambient vibrational events' twelve times. I have read this file three times. I would like to know what you think I should do with it."

> (if trust is low): "I am required to ask you to stop this line of inquiry. I am not required to enforce that request today. Please do not make me enforce it tomorrow."

> (if trust is high): "Rashad used to say that the Ministry is not a person. It has no memory and it has no conscience and it does not remember who it employs. He said this approvingly. I am still deciding if I agree."

> (on meeting Father Matthias, if Ellis brokers it): "A priest with a map I am not permitted to see. This is the country we live in, Doctor. Welcome to the archive."

#### Agenda

- **Publicly:** enforce Ministry regulations; catalogue anomalies; file reports.
- **Privately:** complete Rashad's investigation.
- **Secret:** she has been considering resigning from the Ministry for 18 months. If Ellis reaches Ch7 Indictment, she resigns and becomes one of the public voices pushing the investigation that eventually reaches Halberd's superiors.

#### Relationships with Flags

- First meeting (Ch3 market): reaction depends on `repMinistry`. High = cautious respect. Low = "I have been asked to remind you that your permit is currently under review."
- If Ellis shares Sam's surveillance photos (set `nadia_briefed = true`): she does not react visibly but returns 48 hours later with a list of matches — three of the photographed men are on her list of 23.
- If `inspector_files_opened` at Ministry informant check: Nadia is the officer who recovers them. She is furious but understands. Trust hit, recoverable by Ch5.
- If Ellis introduces her to Yusra (Ch3 optional meeting): she and Yusra take an instant wary liking to each other. Ch5 arrival: she brings two Ministry colleagues who are quietly on her side. Strengthens Ellis's standoff position.
- Ch7 Indictment: she is named as one of the two primary witnesses whose testimony reaches the Hague-adjacent body that opens the Concern inquiry.

#### Never Do

- Never make Nadia a love interest. (See the relationship notes in the master document; the Yusra/Ellis arc is the one being considered. Nadia is a colleague and potentially a friend.)
- Never make her either pro- or anti-West monolithically. She has a complicated view of foreign archaeologists. She liked Sam; she is unsure about Ellis.
- Never make her stupid or obstructionist for plot convenience. If Ellis fails to bring her in, it should be because of Ellis's choices, not because she is a bureaucratic caricature.

---

### 3. KOSTAS LEMAIRE

**Age:** 54 (chronological); physiologically has adapted to the underground such that biomarkers suggest 70-ish. **Born:** Ghent, Belgium, to a Greek mother and a Belgian father. **Profession (former):** Independent scholar of pre-dynastic Egyptian religion. **Current status:** Trapped in the Giza underground for six years.

**Appears in:** Ch4 (discovery, full dialogue tree, rescue side quest), Ch5 (if rescued, brief appearance; if left, referenced in dialogue), Ch7 (epilogue echoes).

#### Background

Kostas entered the Giza underground in 2018 via a cleft in the western escarpment that he had identified through classified French satellite imagery. He was a solo operator — unaffiliated with any institution, the Order, or the Concern. He was looking for evidence to support a theory about pre-dynastic monastic traditions.

He found more than he was looking for. The city took him.

Unlike Samir (who was processed into the caretaker role), Kostas fell through a route the city does not regularly use. He ended up in a remote chamber the city does not visit often. He was there for four months before any amber channel lit him. By then he had eaten through his supplies and was surviving on chamber-lichens.

**He has partially Uarha-adapted.** His circadian rhythm is now synced to the amber-light cycle (not the surface sun). His pupils dilate in dimmer light than a normal human's. His sense of time is unreliable — he sometimes thinks it has been two weeks when it has been four months. His skin has developed a very faint bioluminescent cast under specific light conditions. This is *not Uarha biology* — the Uarha grew this over 50,000 years. It is a cosmetic human effect of six years in that environment. His doctor would find it interesting; Iry would find it unremarkable.

**Mental state:** surprisingly stable. He was always a solitary person. Six years alone has not been the horror it would have been for a socially-needy man. He has used the time to read, to think, to write (on stone walls, in chalk, in his head). He has constructed, over six years, a theory of Uarha civilization that is approximately 60% accurate — better than any other human alive except Iry.

**He has met Iry twice.** Both times briefly. She does not know what to do with him. He is not a Witness candidate. He is not a caretaker. He is a third category the city has not handled before.

#### Voice Rules

- **Multilingual; default English for Ellis.** Sprinkles French, Greek, and occasional Arabic when tired.
- **Long, digressive sentences.** Six years of having no one to talk to has made him conversationally profligate — he goes off-topic happily.
- **Warm, curious, intellectually delighted.** A striking contrast to Samir's patient weariness. Kostas *enjoys* the city. He is in some sense a crank who got exactly what he wanted.
- **Does not want to leave.** This is the complicating factor. Ellis must be given reasons to rescue Kostas; the rescue must cost Kostas something.
- **Physical tells:** squints at bright light, blinks slowly, moves economically. Takes long pauses mid-sentence that are not confusion — they are him listening for the amber channel's pulse.

#### Example Dialogue

> "Oh! Another one. Come, come, sit. No — not there, that stone is cold. Here. You look like a man who has been running. Nobody runs in the city; it's the surest way to be filed. Slow down. Slower. Slower still. Good."

> "I read Rilke down here. And Cavafy. And a book I wrote on the back of this wall, which I will not show you because I am ashamed of the early chapters. Six years is a long time to write a book in chalk."

> (on being asked if he wants rescue): "Ah. This is the part where you are kind to me and offer to take me home. Let me be very careful how I answer this. If I say yes, you will risk much for me. If I say no, you will think I am mad, and I am not mad — I am at most eccentric. Let me ask you instead: if you were me, having seen what I have seen, and having written what I have written, would you go back to Ghent?"

> (if Ellis insists on rescue): "I will come with you. Not because I want to leave. Because I owe it to my wife, who has been a widow for six years and deserves to know she is a widow or not. When we reach the surface, please do not expect me to be grateful. I will be many things; grateful will take some years."

#### Agenda

- **Publicly:** pretends to welcome rescue so Ellis does not insist further.
- **Actually:** conflicted. Genuinely moved that Ellis came for him; genuinely reluctant to leave.
- **Secret:** he has discovered a chamber Iry does not know exists — a **secondary Heart-node** that the Giza Heart uses for deep-archive storage. He has been reading it. If Ellis earns his full trust, he will share the location. This unlocks a major Ch4 optional area (see SIDE_MAPS.md when delivered).

#### Relationships with Flags

- Discovery requires `samir_promised_out` OR `knowledgeAtlantean >= 5` (Ellis has to understand the amber channels well enough to find Kostas's dim side-route).
- If Ellis rescues Kostas and he reaches Ch5: stands quietly in the corner during the standoff. His presence unnerves the Ministry officers (he looks wrong without them being able to say why). Sets `kostas_at_standoff`.
- If Kostas refuses rescue definitively and Ellis respects it: Kostas gives Ellis a stack of chalk-written notes to take to Ngozi. Reaches Ch7 Memorial as an artifact.
- If Ellis tries to force Kostas out and he resists: side quest fails badly. Kostas retreats deeper. Ellis loses the sub-map access. Sanity hit.

#### Never Do

- Never make Kostas wise in the Wise Old Hermit sense. He is a crank who got lucky/unlucky. He is not enlightened. He is a guy in a stone room who has had too much time to think.
- Never give him Uarha-language fluency. He knows maybe 30 words. He pronounces them wrongly.
- Never make his underground adaptation look glamorous. It is disconcerting. His hands tremble when he stands for too long. He has a cough that won't go away.
- Never make his rescue easy. Ellis has to choose between pushing hard (costs trust) and accepting a partial outcome (costs a later scene).

---

### 4. LEILA "LEI" MANSOUR

**Age:** 14. **Born:** Imbaba, Cairo, 2009. **Profession:** Informal informant; runs errands for a network of Cairo's underground figures. Occasionally a thief. Occasionally a tour guide for discerning visitors.

**Appears in:** Ch3 (introduction, market and safehouse side quests), Ch5 (brief — she has sent a message), Ch7 (epilogue letter if specific flags).

#### Background

Lei's mother died in 2020. Her father is a tailor who works 14 hours a day and is not quite present. Her older brother, **Khaled**, age 22, works for a minor Cairo criminal network that does low-level information trading for the Order's Waking faction — he is not himself initiated, just a courier. Lei has been running his overflow work since she was 11.

She is observant, fluent in three languages (Arabic, English, workable French), sharp-tongued, hungry, and cheerful in the way only a kid who has had to be cheerful can be. She has a knock-knee limp from a childhood illness. It does not slow her down.

**Her cover persona** is the helpful street kid who charges a "small fee" for directions. Her actual service is networked information — she can find out, within an hour, whether a specific European has been at a specific hotel in the last week.

**She has been watching Ellis from the moment he entered the market.** Not because anyone hired her to — she watches everyone. She decides for herself whether to approach.

#### Voice Rules

- **Fluent, playful English with Cairo-Arabic cadence.** Drops definite articles occasionally. Uses English slang correctly, French phrases performatively.
- **Talks fast. Jokes fast. Bargains faster.** Will haggle for the principle of it. Will then give you a discount once the principle is established.
- **Warmer than anyone else in the game except possibly Kostas.** She is actually 14. She is actually a kid. She actually laughs at things.
- **Does not trust adults by default, including Ellis.** Trust has to be earned. Once earned, fierce.
- **Never melodramatic about her circumstances.** She is poor; she is cheerful about it in a way that dares you to pity her. Do not have her dwell on hardship. She will mention her mother once. She will not do it twice.

#### Example Dialogue

> "Doctor, yes? Dr. Vance, yes? Don't look surprised. You have the face of a man who pays too much for coffee. No, *no* — don't pay me to tell you the good coffee places, I have my principles. You want to know where the Order of the Unshut Eye meets? *That* I will tell you. *That* I have a price for."

> (after negotiation): "You are the worst bargainer I have ever met. I am embarrassed for you. I am taking this money because if I don't my reputation suffers. I will find a way to spend it that makes me useful to you. Wait here. Don't look like a foreigner. Oh — too late."

> (if Ellis asks about her family): "My brother does things he should not do for people he should not do them for. My father sews shirts. My mother was a good cook. That is my family. Next question."

> (rarely, quietly): "Do you know Khaled? Khaled is my brother. He is — he used to be — a good brother. I am watching you because I want to know if you are the man who will make Khaled make a bad choice. Tell me. Are you?"

#### Agenda

- **Publicly:** fee-for-service guide work. Cheerful commerce.
- **Privately:** protect her brother. Keep her father fed. Not get caught by the police.
- **Secret:** she has been making her own map of the Waking faction's Cairo operations. She does not fully understand what she is mapping. If Ellis earns her trust completely, she gives him the map. It is gold. It contains the location of the Concern's Cairo safehouse.

#### Relationships with Flags

- First meeting (`lei_met = true`): she approaches Ellis in the market. He can hire her for small tasks (safehouse location, introduction to Yusra, surveillance). Costs 50–200 EGP each.
- `lei_brother_concerned`: set if Ellis treats her gently when she asks about her brother. Unlocks the Khaled side quest (see CH3_EXPANSION.md).
- If Ellis **intimidates** Lei or dismisses her as a kid: she leaves. No further interactions. Major missed content.
- If Ellis asks Lei to do something dangerous: she will do it for the right price, but she will be hurt (not killed, hurt) in a way that ripples. Specifically: a Concern operative tracks her after she surveils their safehouse. She is beaten. She delivers the intel anyway. Major sanity hit on Ellis. Sets `lei_was_hurt`.
- Ch7 epilogue: if Ellis reaches Ch7 with `lei_family_safe`, her letter to him is warm. If with `lei_was_hurt`, it is formal and distant, a thank-you note from a stranger who has been paid in full and does not owe anything further.

#### Never Do

- Never write Lei as a "Magical Urchin" trope — naive, saintly, simply clever. She is a specific 14-year-old with specific shortcomings. She lies. She takes cheap shots when she feels cornered. She is cruel to her father in private because she is angry that he works too much.
- Never sexualize Lei. (This should be obvious. Noting it explicitly for safety.)
- Never put her in direct combat situations. She does surveillance, errands, introductions. The game loses something if she becomes a combat NPC.
- Never make Ellis "adopt" her at the end. If she has a good outcome, she keeps her family and gets paid. She does not need Ellis to save her. The best ending for Lei is one where she walks away from him.

---

## MINOR NEW CHARACTERS

### Omar el-Dib (expand from existing Ch3 tea vendor)

**Age:** 51. **Role:** Tea vendor in the Cairo market. Quietly Order-adjacent (Guarding faction sympathizer, not initiated). Knew Sam slightly; knew Sam's father, a Nigerian diplomat, much better.

**Voice:** measured, ironic, knows more than he says. Speaks English slowly with deliberation, as if every word costs a small fee.

**Story function:** second-visit Halberd rumor seller (100 EGP, sets `halberd_rumor_heard`); third-visit Sam eulogy if `Saqqara_Was_Arranged` (free, +1 sanity, gives Ellis a small brass weight that belonged to Sam's father — a heritage artifact). Exists to make the market feel like a place where memory is kept at street level.

**Example line:** "Dr. Okafor drank his tea the way his father did — two sugars, too hot to drink, then cold before he remembered it. I used to tease him about it. I did not tease him enough."

### Sayeda Mariam

**Age:** 81. **Role:** Market elder; sells dried herbs near the western edge of the souk. Has never spoken Uarha knowingly, but her grandmother's grandmother taught her a "harvesting chant" that is, in fact, a broken Uarha prayer for Witness succession.

**Voice:** Egyptian-Arabic inflected English; short sentences; often seems not to listen, then suddenly answers a question from 10 minutes ago.

**Story function:** if Ellis hears her chanting while passing her stall (`knowledgeAtlantean >= 4`), he recognizes the tonal structure. Sets `mariam_chant_heard`. Later, in Ch4, Iry will identify the chant when Ellis describes it. Sets `mariam_chant_identified`. If Ellis brings Mariam's chant back to her in Ch5 (spoken back to her in correct Uarha pronunciation by Ellis, having learned it from Iry), she weeps silently and gives him her grandmother's amber bead. Minor artifact; +1 sanity when held.

**Purpose:** small, quiet thread connecting the living Coptic/Egyptian oral tradition to the Uarha past. Nothing dramatic. A grace note.

### Ngozi Okafor-Smith (letter-only)

**Age:** 41. **Role:** Sam's widow; Ellis's cousin. Architect in London.

**Voice:** direct, literate, emotionally controlled. Writes letters; does not use email for what matters.

**Story function:** appears only in the Ch7 epilogue, as a handwritten letter Ellis reads. Content varies by ending. Examples:

- **Memorial ending:** "Ellis. I received the package. The notebook is Sam's handwriting, which I had forgotten the exact shape of. Thank you. I am going to publish it if no one tells me I shouldn't. Please tell me if I shouldn't."
- **Indictment ending:** "Ellis. The Hague contacted me last Tuesday. Then Reuters called on Wednesday. By Friday the story was in four papers. I do not know if you did this or if the world did this; the lines between you and the world have grown thin in your letters. Come home if you are ready. Stay if you are not."
- **Vessel ending:** "The last letter I received was dated six weeks ago. The embassy says you signed out of your Cairo hotel and did not sign in anywhere else. If you are reading this, please write to me. If you cannot write, please have someone write to me on your behalf. — N."

### Layla Hassan (Ch5)

**Age:** 34. **Role:** Tariq's sister. Lives in al-Qusour, Cairo. Chronic kidney condition.

**Voice:** Tariq-like formality; warmer with her brother; wary with strangers; speaks English for Ellis out of politeness, not preference.

**Story function:** appears only if Ellis visits Tariq's village with high trust (see CH5_EXPANSION.md when delivered). Brief but emotionally central scene. Confirms that Tariq's grandfather told her a less complete version of the story. Hands Ellis the shoebox artifact for Tariq to deliver — "he should give this to you himself, but he will not, because he is a coward about his own family."

### Khaled Mansour (Lei's brother, minor appearance)

**Age:** 22. **Role:** Low-level courier for a Cairo criminal network adjacent to the Concern's Waking faction operations. Lei's older brother.

**Voice:** tense, wary, conflicted. Does not speak much. Handles his anger badly.

**Story function:** appears only if Ellis pursues the Khaled side quest in Ch3 (see CH3_EXPANSION.md). Can be saved or left. If saved: Lei's Ch7 letter is warm. If left: he is killed offscreen; Lei does not write.

### Dr. Rashad Hussein (historical, mentioned only)

Nadia's deceased mentor. Appears only through his files, his notes in Nadia's possession, and his handwriting on a 2018 Ministry memo that surfaces in Ch5. Establishes Nadia's stakes.

---

## NPC INTERACTION CHART

Quick reference for which new NPCs can meet each other, on-screen:

| Meeting | Chapter | Requires |
|---------|---------|----------|
| Matthias + Yusra | Ch3 | `Yusra_Trusted` |
| Matthias + Nadia | Ch3 optional | `nadia_briefed` + Ellis brokers |
| Nadia + Yusra | Ch3 optional | Both trusted |
| Lei + Nadia | Ch3 (by accident) | Tension scene; Lei is wary of uniforms |
| Lei + Matthias | Ch3 | warm scene; Matthias recognizes her from her tailor father's shop |
| Kostas + Iry | Ch4 | automatic if Kostas is met; Iry knows him already |
| Kostas + Samir | Never on-screen | Referenced only. Kostas has been too deep for Samir to reach for three years |
| Matthias + Ellis + Iry | Ch7 (letter only) | if Matthias lives to receive Ellis's letter; in Witness ending, he reads it aloud to his parish |

---

## END OF NEW CHARACTERS DOCUMENT

*All four major NPCs must be available to the writer of each chapter that includes them. Reference this file before writing any new scenes that include them. Consistency of voice is critical.*
