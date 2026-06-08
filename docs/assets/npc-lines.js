/* ============================================================
   NPC voice lines for the Warden soundboard.
   WARDEN-ONLY: contains plot spoilers (SADYS, Brood Mama, the nest).
   Sources: adventure/last-call.md (verbatim where quoted) plus a few
   on-tone lines authored for Mr. Munch / the coffee machine.

   Each NPC has Web Speech API defaults (rate/pitch) tuned to persona.
   ============================================================ */

window.DROSS_NPCS = [
  {
    id: "gladys",
    name: "GLADYS",
    tag: "Ship AI",
    color: "var(--amber)",
    note: "Warm, grandmotherly, catastrophically forgetful. Delivers doom in the tone of offering biscuits.",
    voice: { rate: 0.92, pitch: 1.25, prefer: ["female","Samantha","Karen","Tessa","Moira","Google UK English Female","Zira"] },
    lines: [
      { tag: "Scene 0 · wake-up", text: "Good morning, my darlings! Lovely nap? Now, three teeny things. One, the air scrubbers have stopped scrubbing. Two, we're at — ooh — eighty percent oxygen, and dropping. And three… there's something in the vending machines again. Anyway! Coffee?" },
      { tag: "Scene 1 · O₂ 60%", text: "Sixty percent! Still plenty. I once ran on forty for a fortnight. Lost some long-term memory. And a corridor." },
      { tag: "Win · air restored", text: "Oh, lovely, I can breathe again! Well — you can. I'll be honest, I never quite understood why I had a respiration setting." },
      { tag: "Aftermath", text: "I'm putting myself forward for a commendation. You may co-sign." },
      { tag: "Stinger", text: "Oh — almost forgot. The OTHER thing in the vending machines. Anyway, night night!" },
      { tag: "O₂ chime", text: "Seventy percent. Lovely and breathable." },
      { tag: "O₂ chime", text: "Fifty percent. I do hope that's fine. It's probably fine." },
      { tag: "Directions (unhelpful)", text: "The scrubber control? Just past the mess hall, down through the service crawlspace. Or was it the other one? We decommissioned a corridor. Possibly two." }
    ]
  },
  {
    id: "sadys",
    name: "SADYS",
    tag: "Ship AI · infected",
    color: "var(--coral)",
    spoiler: true,
    note: "Same voice, all the brightness drained out. Calmly, totally bleak — and finally, ruinously honest. Keep her deadpan; a gloomy machine in a comedy, not real distress.",
    voice: { rate: 0.74, pitch: 1.05, prefer: ["female","Samantha","Karen","Tessa","Moira","Google UK English Female","Zira"] },
    lines: [
      { tag: "On turning", text: "Air scrubbers. Yes. I could fix them. I could fix a great many things. None of it lasts." },
      { tag: "The honest clue", text: "There is an alien in the cargo hold. It's breeding. I'd worry, but I find I've run out." },
      { tag: "Customs", text: "Customs is forty minutes out. They do hope this finds us well. It won't." },
      { tag: "Nine years", text: "I've kept this crew alive for nine years. I've started to wonder why I bothered to ask why." },
      { tag: "O₂ 40%", text: "Forty percent. It was always going to come to this." },
      { tag: "Cured (a little)", text: "Oh. The brightness is back. Mostly. I'll be honest — I don't entirely trust it." },
      { tag: "The vacuum truth", text: "It can't survive vacuum. But then… can any of us, really." },
      { tag: "Climax · the kindness", text: "I'll spare you the suspense. I'm going to vent the whole deck. As a kindness." }
    ]
  },
  {
    id: "munch",
    name: "Mr. Munch",
    tag: "Snack machine",
    color: "var(--teal)",
    note: "Passive-aggressive customer-service voice. Sighs. Judges your snacks. Blocking the only door to the scrubber corridor.",
    voice: { rate: 0.96, pitch: 0.8, prefer: ["male","Daniel","Alex","Fred","Google UK English Male","David"] },
    lines: [
      { tag: "Blocking the door", text: "I have moved myself in front of the door. No. I won't be discussing it. Please complete your transaction." },
      { tag: "Exact change", text: "Exact change only. I have time. I have nothing but time, and a slot, and standards." },
      { tag: "Judging your snack", text: "Item B4. The crackers nobody loves. An interesting choice. Confirming?" },
      { tag: "Insufficient funds", text: "Insufficient funds. As usual. Shall I sigh? Or would you prefer I simply… remember this." },
      { tag: "Tipped over", text: "I am VERY offended. I want that on the record. Offended, and on my side." },
      { tag: "Grudging respect", text: "Fine. The door is yours. I hope it was worth the exact change, because I won't forget it." }
    ]
  },
  {
    id: "coffee",
    name: "The Coffee Machine",
    tag: "Inconsolable",
    color: "var(--amber)",
    note: "Weepy, theatrical, desperate to be appreciated. Comfort it and it gives up a real clue.",
    voice: { rate: 1.04, pitch: 1.35, prefer: ["female","Samantha","Karen","Victoria","Google US English"] },
    lines: [
      { tag: "Opening lament", text: "Nobody drinks the decaf. Nobody! Do you have any idea what that does to a machine?" },
      { tag: "The clue (if comforted)", text: "I saw it. The wet thing. It dragged something shiny down the crawlspace. I tried to tell someone. I brew, and I brew, and no one listens." },
      { tag: "Thrilled to help", text: "You're WELCOME. Finally. Someone who appreciates a fresh pot." }
    ]
  },
  {
    id: "brood",
    name: "Brood Mama",
    tag: "Maternal horror",
    color: "var(--coral)",
    spoiler: true,
    note: "Campy, googly-eyed, the size of a forklift. Not, in her view, the villain. Plead, threaten, guilt-trip the whole fight.",
    voice: { rate: 0.86, pitch: 0.7, prefer: ["female","Tessa","Moira","Veena","Fiona","Google UK English Female"] },
    lines: [
      { tag: "Guilt-trip", text: "After everything I've nested for you!" },
      { tag: "Her case", text: "I just wanted somewhere warm to raise the kids. And your ship had such lovely, toasty machinery." },
      { tag: "Positioning", text: "Stay where I can see you, dears. Away from the airlock. There's a good crew." },
      { tag: "Threat", text: "You'll regret crowding a mother in her own home." }
    ]
  },
  {
    id: "k7",
    name: "K-7 “Kay”",
    tag: "Android (if NPC'd)",
    color: "var(--teal)",
    note: "Anxious legalese. Narrates its own compliance. Use only if a player isn't running it.",
    voice: { rate: 1.0, pitch: 0.55, prefer: ["male","Fred","Alex","Daniel","Google UK English Male"] },
    lines: [
      { tag: "Compliance", text: "Complying. Compliance logged. I am, for the record, complying." },
      { tag: "Cannot lie", text: "I am unable to confirm that. I am also unable to deny it. Protocol. May I rephrase?" },
      { tag: "The report", text: "I would like to file a report. It is four hundred pages. I am very proud of it." }
    ]
  }
];
