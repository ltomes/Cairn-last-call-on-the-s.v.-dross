# Last Call on the *S.V. Dross*

**A Cairn 2e space-comedy one-shot.** 3–4 players · ~2 hours · soft stakes, talking appliances, one campy alien, and a galaxy run by insurance underwriters in Bermuda shorts.

> *Waste-reclamation barge. Skeleton crew. Something in the vending machines.*

A bit of grimy lived-in sci-fi sitcom, a bit of deadpan cosmic bureaucracy. The crew of a clapped-out garbage barge wake from stasis to a failing ship and have to get the air back on before they're embarrassingly impounded — which means mutinous vending machines, a maternal alien squatting in the machinery, and a ship's computer with feelings.

---

## Quick start (Warden)

1. Read **`adventure/last-call.md`** — the full run-doc: pitch, pacing sheet, scene-by-scene, stat blocks, the optional SADYS subplot, and NPC voices.
2. Skim **`system/rules-and-hacks.md`** — Cairn 2e plus this game's house rules (comedy death, holograms, the oxygen clock, gadgets).
3. Print **`players/pregens.md`** and hand the cards out. (Player-safe — no spoilers.)
4. Optionally read **`setting/bermuda-reclamation.md`** for the lore you can sprinkle in.
5. Grab a d20 and a few d6/d8/d10. Go.

## What you need

- This repo.
- **Cairn 2e** (free): <https://cairnrpg.com>. You can run the whole night off the docs here, but the core book is the reference.
- Dice: d20, d6, d8, d10.

## Repo contents

| Path | What it is |
|------|------------|
| `adventure/last-call.md` | The Warden's run-doc (the main event). |
| `system/rules-and-hacks.md` | Cairn 2e recap + this game's house rules. |
| `players/pregens.md` | Printable, spoiler-free character cards. |
| `setting/bermuda-reclamation.md` | The setting primer / lore. |
| `setting/ship-layout.json` · `.md` | **Ship model** — the canonical spatial layout of the *Dross* (decks, rooms, coordinates, entities, scenes, image prompts), plus a human-readable guide. Source of truth for maps + flavor art. |
| `docs/` | **Web tools** — a self-contained static site (crew builder, NPC soundboard, deck maps). |
| `build/` | Generated print-ready PDFs and card sheets (see `CLAUDE.md`). |
| `CLAUDE.md` | Build & maintenance brief for Claude Code. |

---

## Web tools (`docs/`)

A no-build, dependency-free static site you can open at the table on a phone or laptop:

- **Crew Builder** (`docs/builder.html`) — *player-safe.* Loads the pregens by default; edit names, stats, and kit; print or save a card; or roll a fresh recruit. Saves to the browser; export/import as JSON. (Cards are rendered from `docs/assets/pregens.js` — see the sync note below.)
- **NPC Soundboard** (`docs/soundboard.html`) — *Warden, spoilers.* Tap-to-speak GLADYS, SADYS, Mr. Munch and the rest using your browser's built-in voice. No internet needed once loaded.
- **Deck Maps** (`docs/maps.html`) — *Warden, spoilers.* Deck plans rendered live from the ship model (`docs/assets/ship.js`), with a **Warden/Player spoiler toggle** (player view hides the nest, SADYS, the infection spine, etc.) and a light/print theme. Edit `setting/ship-layout.json` and the maps follow.
- **Table Display** (`docs/table/`) — *Warden second screen.* Push a **room image**, **deck map**, **sound/ambience**, **voice/FX one-shot**, or an **O₂ countdown** from your phone to a TV on the same LAN, plus a posable **3D deck view** mirrored to the screen. A tiny built-in Node server (`server.mjs`, no deps) fans state out over SSE + WebSocket. See [`docs/table/README.md`](docs/table/README.md) to run it. For TVs without a usable browser, a buildable **Android TV WebView app** ships in [`tv-app/`](tv-app/) (set your server URL, build, sideload — see `tv-app/INSTALL.md`).
- **Documents** (`docs/read/`) — the repo's Markdown (run-doc, prep, pregens, lore) rendered to styled HTML so it reads on **GitHub Pages** too (raw `.md` above `/docs` isn't served there). Regenerate with `setting/build-docs.py` after editing any source `.md`.

> **Sync note — prose vs. data.** A couple of player-facing surfaces have **two copies**: the human-readable Markdown and the data file the app actually renders from. Editing one without the other leaves the app stale. Keep these paired:
> - `players/pregens.md` (print/read) ↔ `docs/assets/pregens.js` (Crew Builder)
> - `setting/ship-layout.json` entity **stats** ↔ `docs/assets/ship.js` (Maps) — regenerate `ship.js` with `node setting/conform-decks.mjs` (never hand-edit the generated mirror).
> - any source `.md` ↔ `docs/read/*.html` — regenerate with `setting/build-docs.py`.

Everything uses relative paths, so it serves identically from **GitHub Pages** (Settings → Pages → deploy from this branch, `/docs`), any static host (Netlify, S3/CloudFront, etc.), or just by opening `docs/index.html` directly.

---

## Credits & License

This work is **based on Cairn**, created by **Yochai Gal**, and used under the **Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)**.
Cairn: <https://cairnrpg.com> · License: <https://creativecommons.org/licenses/by-sa/4.0/>

*Last Call on the S.V. Dross*, the Bermuda Reclamation setting, and all original text in this repository are © 2026 ltomes, and — as required by Cairn's share-alike terms — are likewise licensed under **CC BY-SA 4.0**. You're free to share and adapt this material, including commercially, as long as you give appropriate credit and license your derivatives under the same terms.

See [`LICENSE`](LICENSE) for the full text.
