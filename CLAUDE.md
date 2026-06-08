# CLAUDE.md — Build & Maintenance Brief

This file orients Claude Code (or any contributor) to the project. Read it before making changes.

## What this is

A complete, ready-to-run **Cairn 2e** tabletop one-shot: *Last Call on the S.V. Dross*. A ~2-hour space comedy for 3–4 players. The writing is the product — keep the voice intact.

**Tone (load-bearing):** grimy, lived-in sci-fi sitcom (think a malfunctioning ship full of bickering misfits) crossed with deadpan, faintly menacing cosmic bureaucracy (Douglas Adams register). Funny first, soft stakes, no grimdark. When in doubt, make it dry and absurd rather than epic.

## File map & what's authoritative

- `adventure/last-call.md` — the Warden's run-doc. The main deliverable.
- `system/rules-and-hacks.md` — the rules. Cairn 2e recap + house rules ("HACK" entries).
- `players/pregens.md` — **player-facing.** Must stay spoiler-free.
- `setting/bermuda-reclamation.md` — lore/flavor.
- `README.md` — front door.
- `LICENSE` — see licensing task below.

## Conventions

- **Markdown, prose-forward.** Tables and short lists where they earn it; otherwise sentences. Em-dashes and a light comic touch are intentional, not noise.
- **Player-safe vs Warden-only:** anything in `players/` must contain **no plot spoilers** (no Brood Mama, no SADYS, no Ascendance reveal). GM secrets live only in `adventure/`. Preserve this boundary in any new player-facing output.
- **Don't rebalance the game** (stat blocks, the oxygen clock, HP/damage tuning) without flagging it — it's tuned for a 2-hour comedy where combat is a last resort.
- Keep names consistent: ship **S.V. Dross**; AI **GLADYS** (corrupts to **SADYS**); crew **Dusty, Bartleby "Feathers", Crown & Whisker, K-7** (plus optional 5th **Grease**); alien **Brood Mama**; setting **the Bermuda Reclamation**; failed billionaire colony **Ascendance**.

## Task list (priority order)

1. **Initialize the repo.** Commit the current files as-is. Sensible `.gitignore` (ignore OS cruft; **do** commit the `build/` PDFs once generated — they're the printables players want).
2. **Licensing — finish the LICENSE.** Fetch the canonical plain-text CC BY-SA 4.0 legal code from `https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt`, paste it verbatim where `LICENSE` marks `[[ INSERT OFFICIAL CC BY-SA 4.0 LEGAL CODE HERE ]]`, and remove the "NOTE FOR SETUP" block. Confirm GitHub's license detector recognizes it (Settings/sidebar should read "CC BY-SA 4.0"). Replace `ltomes` with the author's real name if they prefer.
3. **Print-ready PDFs → `build/`.** Use `pandoc` (with a clean print CSS or a LaTeX template). Generate:
   - `build/last-call-warden.pdf` — the run-doc.
   - `build/system-reference.pdf` — rules-and-hacks, ideally trimmed to a 1–2 page Warden screen (pacing table + O₂ clock + stat blocks + the hacks).
4. **Pregen cards → `build/`.** Lay out the four characters from `players/pregens.md` as **cut-out cards** (2×2 on a page, or 4 quarter-sheets) with the 60-second rules on the back. HTML+print-CSS → PDF is fine. Output `build/pregen-cards.pdf`.
5. **(Optional) GitHub Pages one-pager.** A single static `index.html` landing page: pitch, how-to-run, download links to the PDFs, credits. Keep it light; no framework needed.
6. **(Optional) One-page GM cheat-sheet** distilling the pacing sheet, the oxygen-clock thresholds, every stat block, and the SADYS trigger — the single page a Warden keeps open while running.

## Things to ask the human before doing

- Any change to tone, difficulty, or the player-safe boundary.
- Adding dependencies or a build toolchain heavier than pandoc + a CSS file.
- Renaming files or restructuring folders (the layout is deliberate).
