/* ============================================================
   The crew of the S.V. Dross — player-safe pregen data.
   Source of truth: players/pregens.md  (keep in sync).
   Player-safe: secrets here ARE in the player pack. No Warden spoilers
   (no Brood Mama, SADYS, or Ascendance reveal) belong in this file.
   ============================================================ */

window.DROSS_PREGENS = [
  {
    id: "dusty",
    name: "Dusty McGrath",
    role: "Sanitation Officer, Third Class",
    blurb: "The only one who could be bothered to stay awake on shift. A slob, a survivor, an improviser.",
    str: 11, dex: 10, wil: 12, hp: 6, armor: 0,
    items: [
      "Multitool — light weapon (d6); also fixes things",
      "Grav-boots",
      "Half-eaten sandwich (1 Ration)",
      "A “lucky” mug",
      "A vape that may or may not be a vape"
    ],
    abilities: [
      { name: "Improviser (1/session)", desc: "Declare one mundane item was “in your pocket the whole time.” If the Warden allows it, it’s there." }
    ],
    secret: "You signed off on salvaging that derelict pod three weeks ago. You don’t remember doing it. You’d really rather that stayed quiet."
  },
  {
    id: "rim",
    name: "Rim",
    role: "Holographic Crewmate (Deceased)",
    blurb: "Died in “the incident.” Kept on as a light-projection, for morale apparently. Pompous, by-the-book, secretly a coward.",
    str: 7, dex: 13, wil: 14, hp: 4, armor: 0,
    items: [
      "Carries nothing — you’re made of light",
      "You know the ship’s history and trivia cold"
    ],
    abilities: [
      { name: "Intangible", desc: "Walk through walls, doors, and hazards freely. Nothing physical can hurt you — but you also can’t touch, carry, push, or fix anything. The perfect scout." },
      { name: "Hard Light (~10 min)", desc: "Flip to solid — now you can interact with the world, and be hurt, normally. To hold it longer, make a WIL save. Afterward, recharge a moment at a power point." }
    ],
    secret: "You saw something climb out of that salvaged pod before the nap. You’ve been too rattled to bring it up."
  },
  {
    id: "felix",
    name: "Felix Nine-Lives",
    role: "Evolved Feline, “Morale Officer”",
    blurb: "Descended from the ship’s cat over generations in the hold. Catastrophically vain. Allergic to labor. Lethal when motivated (rare).",
    str: 9, dex: 15, wil: 8, hp: 5, armor: 1,
    armorNote: "a jacket that is, you insist, “bulletproof, darling”",
    items: [
      "Retractable claws (d6)"
    ],
    abilities: [
      { name: "Nine Lives (1/session)", desc: "When you’d be taken down, make a DEX save instead — success means you twist away, take no STR damage, stay standing. “Wasn’t even close.”" },
      { name: "Nose for Trouble", desc: "You can smell danger before you see it. Ask the Warden." }
    ],
    secret: "Whatever’s been skulking around the ship has been doing it in your territory. Frankly, it’s an insult."
  },
  {
    id: "k7",
    name: "K-7 “Kay”",
    role: "Service Android (Sanitation & Repair Division)",
    blurb: "Anxious, literal, desperate to be useful and to follow protocol. Narrates its own compliance.",
    str: 13, dex: 9, wil: 10, hp: 5, armor: 1,
    armorNote: "chassis",
    items: [
      "Integrated repair kit",
      "A fire extinguisher (improvised weapon d6, or utility)"
    ],
    abilities: [
      { name: "Built for Repair", desc: "Auto-succeed on routine repairs given tools and a moment; do fiddly maintenance in half the time." },
      { name: "Vacuum-Rated", desc: "Cold, vacuum, and lack of air do nothing to you." },
      { name: "Mostly Cannot Lie", desc: "Protocol forbids it. You may attempt to “rephrase.” It rarely works." }
    ],
    secret: "Your maintenance logs from three weeks ago are corrupted — someone wiped them. You would very much like to file a report."
  },
  {
    id: "grease",
    name: "Grenn “Grease” Candlewick",
    role: "Reclaim-Chemist, Apprentice — optional 5th / swap-in",
    blurb: "Signed on as an apprentice, then the crew nap-cycled and forgot to log him. Talks in a flat drone, gregarious in a way that makes people take a small step back. Young. Stained. Regarded as dangerous — mostly secondhand. It’s the chemistry.",
    str: 8, dex: 10, wil: 12, hp: 3, armor: 3,
    armorNote: "hardsuit + visor + hatch-shield",
    items: [
      "Patched reclamation hardsuit (Armor 2, bulky)",
      "Welding visor (+1 Armor)",
      "A torn-off blast-hatch, carried as a shield (+1 Armor)",
      "Plasma cutter — solid weapon (d8); cuts bulkheads, slowly",
      "Bolt-sling — pneumatic nut-slinger (ranged, d6)",
      "Mag-jacks (magnetic caltrops — scatter to slow a chaser)",
      "A cracked hull-scope (monocular)",
      "A telescoping inspection mirror",
      "B$9, a hand-torch, three foil ration packs (regrettable)"
    ],
    abilities: [
      { name: "Suited Up", desc: "The small stuff — hurled cans, sparks, a stray sneeze of acid — just clatters off you. (That’s the Armor 3.)" },
      { name: "Reclaim-Chemist (1/session)", desc: "Brew a single one-use gadget from junk on hand. Tell the Warden what you’re bodging together." },
      { name: "Packrat (watch it)", desc: "You over-pack. If your inventory is ever truly full, you’re so weighed down you’re at 0 HP until you drop something." }
    ],
    secret: "They cycled the whole crew into stasis and never logged you — so the pods passed you by. You’ve been awake, alone, on a sleeping ship for longer than you’ll admit. You’re fine. You’re fine. You would just very much like to be on the crew roster. Officially. In writing."
  }
];

/* For the "roll a fresh recruit" mode — flavor only, all player-safe. */
window.DROSS_RECRUIT = {
  firstNames: ["Bex","Cobb","Vance","Nilsa","Orto","Pim","Greta","Sol","Marrow","Tibb","Quill","Dax","Hester","Rook","Juno","Pax","Wren","Bly","Cass","Odo"],
  surnames: ["Halloran","Voss","Okonkwo","Brandt","Sevigny","Pryce","Ndiaye","Calloway","Roe","Sandoval","Finch","Ableton","Krause","Mott","Yarrow","Deveau"],
  roles: [
    "Sanitation Officer, Fourth Class","Cargo Hand","Reclamation Tech","Galley Steward","Comms Apprentice","Hull Inspector",
    "Hydroponics Minder","Coolant Engineer","Bilge Diver","Manifest Clerk","Stasis Technician","Morale Auxiliary"
  ],
  bonds: [
    "You owe three months’ dock fees to a man named Pell. He has not forgotten.",
    "You signed the crew waiver without reading it. You assume it’s fine.",
    "You keep a single houseplant alive against all regulations.",
    "You are, technically, still on probation for “creative use of the airlock.”",
    "You can fix anything once and never the same way twice.",
    "You are the only one who reads GLADYS’s safety bulletins. Out loud. To everyone.",
    "You joined to see the galaxy. You have so far seen this ship.",
    "Someone aboard owes you a very specific apology."
  ],
  items: [
    "A foil ration pack (regrettable)","A glowstick / hand-torch","A roll of repair tape","A dented thermos",
    "A deck of bent playing cards","A company-issue mug","A photo of someone you won’t name","A multitool missing one tool",
    "Knee-high regulation socks (Bermudian, mandatory)","A spare fuse you’re weirdly proud of"
  ],
  // Gadgets from system/rules-and-hacks.md (Tech, Not Magic)
  gadgets: [
    { name: "Spanner-9000", desc: "Auto-fixes one simple mechanical problem per scene." },
    { name: "Pocket Holo-Decoy", desc: "Projects a convincing fake crewmate; enemies need a DEX save to ignore it." },
    { name: "Static Mop", desc: "Discharges to stun one appliance/machine, once per scene." },
    { name: "Emergency Re-Breather", desc: "10 minutes of air in vacuum or low-O₂." },
    { name: "Morale Klaxon", desc: "Once: the whole party rerolls one failed save (you blast the company anthem)." },
    { name: "Adhesive Foam Canister", desc: "Glues a door or foe in place; a STR save breaks free." }
  ]
};
