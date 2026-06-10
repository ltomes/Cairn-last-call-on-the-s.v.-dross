#!/usr/bin/env python3
"""Render the repo's Markdown docs into styled HTML under docs/read/ so they're served by BOTH the local
static server (:8866) and GitHub Pages (which publishes the /docs folder) — the raw .md files live above
the published root and so are unreachable from index.html's Documents links. Re-run after editing any doc.
  cd <cairn repo> && uv run --no-project --with markdown python setting/build-docs.py
"""
import markdown, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "read")
DOCS = [
    ("players/pregens.md", "Pregens (player-safe)", False),
    ("adventure/last-call.md", "Run-doc — Last Call", True),
    ("adventure/WARDEN-PREP-TONIGHT.md", "Warden Prep — Tonight", True),
    ("adventure/PLOT-REVIEW.md", "Plot Review & Fixes", True),
    ("system/rules-and-hacks.md", "Rules & Hacks", True),
    ("setting/bermuda-reclamation.md", "Setting / Lore", True),
    ("setting/ship-layout.md", "Ship Layout", True),
]
CSS = """
<style>
:root{color-scheme:dark}
body{background:#0c1115;color:#dde6ea;font:16px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
 max-width:860px;margin:0 auto;padding:24px 20px 80px}
a{color:#4fd1c5} h1,h2,h3{color:#f2b441;line-height:1.25;margin:1.4em 0 .5em} h1{border-bottom:1px solid #2a343c;padding-bottom:.3em}
code{background:#161d23;padding:.1em .4em;border-radius:4px;font-family:ui-monospace,monospace;font-size:.92em}
pre{background:#161d23;padding:14px;border-radius:8px;overflow:auto;border:1px solid #2a343c} pre code{background:none;padding:0}
blockquote{border-left:3px solid #4fd1c5;margin:1em 0;padding:.2em 1em;color:#aebcc4;background:#11171c}
table{border-collapse:collapse;width:100%;margin:1em 0} th,td{border:1px solid #2a343c;padding:7px 10px;text-align:left}
th{background:#161d23;color:#f2b441} hr{border:0;border-top:1px solid #2a343c;margin:1.6em 0}
.nav{position:sticky;top:0;background:#0c1115ee;backdrop-filter:blur(6px);padding:10px 0;border-bottom:1px solid #2a343c;margin-bottom:18px}
.warn{color:#ff7a6b;font-weight:700}
</style>"""


def page(title, body, nav):
    return ("<!doctype html><html lang=en><head><meta charset=utf-8>"
            "<meta name=viewport content='width=device-width,initial-scale=1'>"
            f"<title>{html.escape(title)} — S.V. Dross</title>{CSS}</head>"
            f"<body><div class=nav>{nav}</div>{body}</body></html>")


def main():
    os.makedirs(OUT, exist_ok=True)
    nav = "<a href='index.html'>📚 all docs</a> &nbsp;·&nbsp; <a href='../index.html'>← hub</a>"
    md = markdown.Markdown(extensions=["tables", "fenced_code", "toc", "sane_lists"])
    items = []
    for path, title, spoiler in DOCS:
        src = os.path.join(ROOT, path)
        if not os.path.exists(src):
            print("SKIP missing", path); continue
        md.reset()
        body = md.convert(open(src, encoding="utf-8").read())
        out = os.path.join(OUT, os.path.basename(path).replace(".md", ".html"))
        warn = "<p class=warn>⚠ WARDEN — contains spoilers</p>" if spoiler else ""
        open(out, "w", encoding="utf-8").write(page(title, f"<h1>{html.escape(title)}</h1>{warn}{body}", nav))
        items.append((os.path.basename(out), title, spoiler))
        print("wrote", os.path.relpath(out, ROOT))
    idx = "<h1>S.V. Dross — documents</h1><ul>" + "".join(
        f"<li><a href='{f}'>{html.escape(t)}</a>{' <span class=warn>(spoilers)</span>' if sp else ' (player-safe)'}</li>"
        for f, t, sp in items) + "</ul>"
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page("Documents", idx, "<a href='../index.html'>← hub</a>"))
    print("wrote docs/read/index.html")


if __name__ == "__main__":
    main()
