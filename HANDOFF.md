# HANDOFF — for the local Claude Code session

> You're picking up the **`claude/epic-euler-jeqolr`** branch to continue work on
> *Last Call on the S.V. Dross*. **Image and audio generation is yours** (you have
> local Stable Diffusion + audio set up). This file is your starting point.

**Read first:** `CLAUDE.md` (build brief + conventions) and `README.md` (front door).
The **tone is load-bearing** — grimy sci-fi sitcom × deadpan cosmic bureaucracy,
funny first, soft stakes. Keep the voice.

---

## What's already done (don't redo)

- **Repo + license.** Initialized; `LICENSE` is the full CC BY-SA 4.0 legal code.
- **Campaign text** in `adventure/` `system/` `players/` `setting/`.
- **Characters** — 4 pregens + an optional 5th. Final names (keep consistent):
  **Dusty McGrath**, **Bartleby "Feathers"** (hologram), **Crown & Whisker** (the
  cat, speaks in vending-machine slogans), **K-7 "Kay"** (android), and optional
  5th **Grenn "Grease" Candlewick** (reclaim-chemist tank).
- **Web tools** (static, in `docs/`, served via **GitHub Pages — live**):
  - `builder.html` — Crew Builder (player-safe), data in `assets/pregens.js`
  - `soundboard.html` — NPC voice soundboard (Warden), lines in `assets/npc-lines.js`
  - `maps.html` — Deck Maps, rendered from the ship model, Warden/Player toggle
  - `index.html` — hub
- **Ship model** — `setting/ship-layout.json` (canonical spatial layout **and** the
  image-prompt library), human guide `setting/ship-layout.md`, web mirror
  `docs/assets/ship.js` (regenerate after editing the JSON — command in the guide).

---

## Your job: generate flavor IMAGES + AUDIO

I removed a half-built image generator I should never have made (see *What I removed*
below) — **the generation approach is entirely yours.** Everything you need to feed
it is already in the repo.

### Images
The full prompt library lives in **`setting/ship-layout.json`**:

- `style` — shared art direction: `global_prefix`, `lighting`, `palette`
  (amber `#f2b441` ambient / teal `#4fd1c5` systems / coral `#ff7a6b` alien),
  `negative`, `aspect`, `references`, `signage_gag`, `consistency_anchor`.
- `decks[].rooms[].image_prompt` — per-location establishing shots.
- `image_events[]` — key beats (the wake-up, Mr. Munch, the egg reveal, Brood Mama,
  the airlock vent, the SADYS sag, the customs loss, the stinger). Each has
  `show_to: "players" | "warden"` and a `spoiler` flag.

There are **~24 prompts (15 player-safe, 9 Warden).** Build each full prompt as:
`global_prefix` + `lighting` + the specific `image_prompt` + `palette` + `aspect`,
with `style.negative` as your **negative prompt**.

**Player-safe boundary:** anything `show_to: "warden"` / `spoiler: true` (the nest,
Brood Mama, SADYS, the salvaged pod's origin, the infection spine) must **not** be
shown to players. Honor those flags if you build any display.

**Output location is your call.** A reasonable convention if you want a future
gallery to find them: `docs/assets/img/<id>.png` where `<id>` is the room id or
event id (e.g. `mess-hall.png`, `nest-broodmama.png`). But design the
storage/manifest/display however suits your pipeline — there's no contract to honor.
Committed PNGs are wanted (like the print PDFs).

### Audio
NPC lines + per-voice hints are in **`docs/assets/npc-lines.js`** (GLADYS, SADYS,
Mr. Munch, the coffee machine, Brood Mama, K-7), each with `rate`/`pitch` and a
voice persona note. The soundboard speaks them live via browser TTS; if you
pre-render clips with your local TTS, that's the source text. Same player-safe
rule: SADYS and Brood Mama lines are Warden-only.

---

## Conventions you must keep (from `CLAUDE.md`)

- **Player-safe vs Warden-only:** nothing player-facing spoils **Brood Mama**,
  **SADYS**, or the **Ascendance** reveal.
- **Don't rebalance** stat blocks / the oxygen clock / HP-damage tuning without
  flagging — it's tuned for a 2-hour comedy where combat is a last resort.
- **Names** stay consistent (list above): ship **S.V. Dross**; AI **GLADYS**→**SADYS**;
  alien **Brood Mama**; setting **the Bermuda Reclamation**; failed colony **Ascendance**.
- Markdown is prose-forward; the comic voice is intentional.

---

## Git workflow

- Develop on **`claude/epic-euler-jeqolr`**. Commit with clear messages; push there.
- **A second (web) session may also push to this branch.** Before pushing:
  `git pull --rebase origin claude/epic-euler-jeqolr`. To avoid collisions, keep
  your work to **generated assets and your own new files** (e.g. an images dir, an
  audio dir) rather than editing the same source files the other session is touching.
- GitHub Pages serves `docs/` and is already live.

---

## Parked / open tasks (take any if you like)

- **Print-ready PDFs → `build/`** (pandoc): Warden run-doc, a 1–2 page GM screen,
  and cut-out pregen cards. (Per `CLAUDE.md` task list.)
- **Lore documents** spun from `setting/bermuda-reclamation.md`.
- Optional **map label polish** in `docs/maps.html` (there's a measurement-based
  fit + declutter pass; a few labels may still crowd).

---

## What I removed (so you're not confused)

I mistakenly built an image-generation pipeline that's **your** job, then deleted it:
`tools/generate-images.mjs`, `tools/README.md`, `docs/prompts.html`,
`docs/gallery.html`, and `docs/assets/img/manifest.*`. **The prompts themselves were
never the problem and remain in `setting/ship-layout.json`** — that's the real
deliverable. Build generation and display your own way.

---

## Repo map

```
adventure/last-call.md          Warden run-doc (the main event)
system/rules-and-hacks.md       Cairn 2e recap + house rules
players/pregens.md              printable pregen cards (player-safe)
setting/bermuda-reclamation.md  setting/lore primer
setting/ship-layout.json        ship model + IMAGE PROMPT LIBRARY  ← your source
setting/ship-layout.md          ship model: human guide
docs/                           static web tools (GitHub Pages)
  index.html  builder.html  soundboard.html  maps.html
  assets/  pregens.js  npc-lines.js  ship.js  style.css
README.md  CLAUDE.md  LICENSE
```
