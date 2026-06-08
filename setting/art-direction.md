# Art Direction — *Last Call on the S.V. Dross*

Visual bible for the generated flavor images so every render reads as **one ship,
one tone**. The canonical prompt *content* lives in `ship-layout.json` (`style` +
per-room `image_prompt` + `image_events`); this file records the **conventions a
renderer should layer on top** so scenes stay consistent across sessions.

> Tone is load-bearing: **grimy sci-fi sitcom — funny first, soft stakes, comic
> NOT grimdark.** Warm and inviting despite the grime. No horror, no shadow
> figures, no clean Star-Trek minimalism.

## Shared identity (every image)

- Used-future, lived-in **garbage barge** — worn riveted steel, exposed conduit,
  duct tape, hand-lettered labels, coffee rings, decades of grime.
- Core palette (keep in every frame so the ship reads as one place):
  amber `#f2b441` ambient · teal `#4fd1c5` systems/CRT · coral `#ff7a6b` alien
  hazard · slate `#1b262d` grime.
- Lighting: flickering amber emergency light, half-dead fluorescents, teal CRT
  glow, volumetric haze/steam.

## Per-deck colour themes + wayfinding

Each deck gets a **distinct accent colour** and a painted **wayfinding guide-stripe**
(the solid colour lines airports/hospitals paint on floors and walls) that runs
**toward the route DOWN to the next deck** — the party descends A → B → C → D.

| Deck | Name | Accent | Hex | Stripe leads… |
|------|------|--------|-----|----------------|
| **A** | Command & Habitation (Scene 0) | warm amber-gold | `#f2b441` | toward the forward-starboard ladderway down to Deck B |
| **B** | Mess & Commons (Scene 1) | teal | `#4fd1c5` | toward the forward-starboard ladderway down to Deck C |
| **C** | Service & Machinery (Scene 2) | violet-purple | `#a78bfa` | toward the central crawlspace + ladderway down to Deck D |
| **D** | Cargo & Reclamation Hold (Scene 3) | coral-red | `#ff7a6b` | toward the aft cargo airlock |

The accent rides **on top of** the shared palette (it's the painted stripe + a
faint ambient bias), not a recolour of the whole ship. The descent reads as
warm/home (amber) → communal (teal) → industrial (violet) → alien hazard (coral).

## Camera & geometry convention

- **Establishing shots look AFT** down the ship → **starboard = right of frame,
  port = left.** (Rooms whose defining feature faces forward — e.g. the bridge
  viewport — naturally face that feature; that's fine.)
- Exits are placed on their **real walls**, derived from each room's
  `rect:{x,y,w,h}` and `doors[]` in `ship-layout.json` (+X starboard, +Y aft,
  fore at top, 1 grid unit ≈ 2 m). So a door the model says is aft renders on the
  far wall, a ladder anchored forward-starboard renders front-right, etc. This
  keeps the establishing shots consistent with `maps.html`.

## Character sheet — Brood Mama (LOCKED)

Render her **identically in every scene** she appears (`nest-broodmama`,
`airlock-vent-win`, any future beats):

> A rotund **pastel sage-green** maternal alien about the size of a forklift.
> **Two huge mismatched googly cartoon eyes**, the larger one **glowing amber**.
> A small **downturned beak-mouth**. **Stubby little tentacle legs.** Soft,
> bulbous body. **Campy, maternal, and silly — not scary.** She is *not*, in her
> own view, the villain.

Hard negatives for her: forklift / vehicle / machine / submarine (the phrase
"size of a forklift" otherwise makes the model draw a literal forklift).

## Generation notes

- Default **16:9** establishing shots (1344×768); `style.negative` plus comic
  guards (no horror/ominous/shadow-figure/clean-scifi) as the negative prompt.
- **Deterministic seed per image id** so a given shot reproduces; bump the seed to
  re-roll a stubborn composition.
- **Player-safe vs Warden-only:** anything `show_to:"warden"` **or** `spoiler:true`
  is Warden-only (the nest, Brood Mama, SADYS, the pod's origin). Player images →
  `docs/assets/img/<id>.png`; Warden images → `docs/assets/img/warden/<id>.png`,
  gated behind Warden Mode (`assets/warden.js`).
