// render-decks.mjs — committed visual regression harness for the deck plans.
// Replicates docs/maps.html deckSVG() geometry (including the hull-clip that gives
// rooms angled exterior walls) and writes one SVG per deck per mode. Pipe through
// cairosvg for PNGs. Keep clipRoomToHull() IDENTICAL to the copy in docs/maps.html.
//   node setting/render-decks.mjs           -> writes ../cairn-review/decks/*.svg
import fs from "fs";
const SHIP = JSON.parse(fs.readFileSync(new URL("./ship-layout.json", import.meta.url)));
const OUT = new URL("../../cairn-review/decks/", import.meta.url);
fs.mkdirSync(OUT, { recursive: true });

const S = 14, PAD = 30;
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const stripParen = s => String(s || "").replace(/\s*\([^)]*\)\s*/g, " ").trim();

// ---- hull clip (Sutherland–Hodgman against a CONVEX hull, in grid coords) ----
// Subject = room rect corners; clip = deck.hull. Returns clipped polygon [[x,y],...]
// in grid coords (same frame as hull). Fully-interior rooms come back as the rect.
export function clipRoomToHull(rect, hull) {
  let out = [[rect.x, rect.y], [rect.x + rect.w, rect.y], [rect.x + rect.w, rect.y + rect.h], [rect.x, rect.y + rect.h]];
  if (!hull || hull.length < 3) return out;
  let area = 0; for (let i = 0; i < hull.length; i++) { const a = hull[i], b = hull[(i + 1) % hull.length]; area += a[0] * b[1] - b[0] * a[1]; }
  const ccw = area > 0;
  const inter = (P, Q, A, B) => {
    const den = (A[0] - B[0]) * (P[1] - Q[1]) - (A[1] - B[1]) * (P[0] - Q[0]);
    const t = ((A[0] - P[0]) * (P[1] - Q[1]) - (A[1] - P[1]) * (P[0] - Q[0])) / den;
    return [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
  };
  for (let i = 0; i < hull.length && out.length; i++) {
    const A = hull[i], B = hull[(i + 1) % hull.length], input = out; out = [];
    const inside = P => { const c = (B[0] - A[0]) * (P[1] - A[1]) - (B[1] - A[1]) * (P[0] - A[0]); return ccw ? c >= -1e-9 : c <= 1e-9; };
    for (let j = 0; j < input.length; j++) {
      const cur = input[j], prev = input[(j + input.length - 1) % input.length], ci = inside(cur), pi = inside(prev);
      if (ci) { if (!pi) out.push(inter(prev, cur, A, B)); out.push(cur); }
      else if (pi) out.push(inter(prev, cur, A, B));
    }
  }
  return out;
}

const kindColor = k => ["boss", "enemy", "alien_growth"].includes(k) ? "#ff7a6b"
  : ["appliance_npc", "ship_ai"].includes(k) ? "#4fd1c5"
  : ["plot_device", "fixture", "obstacle"].includes(k) ? "#f2b441" : "#8aa0a8";

// No DOM here, so estimate a text run's pixel width from its characters. Tuned to a
// generic sans-serif at the given size; used for room-label clipping and entity-label
// de-collision so the static PNGs match the runtime fitLabels() behaviour in maps.html.
const NARROW = new Set([..."ijl.,:;'!|()[]{} "]);
const WIDE = new Set([..."mwMW@"]);
const textW = (s, fs) => { let u = 0; for (const c of String(s)) u += NARROW.has(c) ? 0.30 : WIDE.has(c) ? 0.86 : 0.55; return u * fs; };
// Shrink a label to fit a pixel budget, ellipsising once it hits the size floor.
const fitText = (s, maxw, fs, floor = 7) => {
  let f = fs; while (f > floor && textW(s, f) > maxw) f -= 0.5;
  if (textW(s, f) <= maxw) return { text: s, fs: f };
  let t = s; while (t.length > 1 && textW(t + "…", f) > maxw) t = t.slice(0, -1);
  return { text: (t === s ? t : t + "…"), fs: f };
};

// Compact legend pinned to a corner. Rows: room fill, the three entity-dot colour
// classes, the waypoint guide line, and the player/warden orientation note.
function legendSVG(W, H, mode, deck) {
  const wfCol = ((SHIP.wayfinding && SHIP.wayfinding.deck_colors) || {})[deck.id] || "#b6ff00";
  const hasWf = ((SHIP.wayfinding && SHIP.wayfinding.routes) || [])
    .some(rt => rt.deck === deck.id && !(mode === "player" && (rt.spoiler || rt.reveal === "warden")));
  const rows = [
    { type: "box", fill: "#16242a", stroke: "#4a6b73", t: "Explored room" },
    { type: "dot", fill: "#ff7a6b", t: "Enemy / boss / growth" },
    { type: "dot", fill: "#4fd1c5", t: "Appliance / ship AI" },
    { type: "dot", fill: "#f2b441", t: "Plot / fixture" },
    { type: "dot", fill: "#8aa0a8", t: "Other" },
  ];
  if (hasWf) rows.push({ type: "line", fill: wfCol, t: "Waypoint — route down" });
  rows.push({ type: "note", fill: mode === "warden" ? "#ff7a6b" : "#6fb6ac", t: mode === "warden" ? "Warden view · spoilers" : "Player view" });
  const lh = 16, padIn = 9, swatchW = 16;
  const fs = 9.5;
  const bw = swatchW + 8 + Math.max(...rows.map(r => textW(r.t, fs))) + padIn * 2;
  const bh = rows.length * lh + padIn * 2;
  const bx = W - PAD - bw, by = H - PAD - bh + 6;
  let o = `<g>`;
  o += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="6" fill="#0e1418" fill-opacity="0.86" stroke="#2a3640" stroke-width="1.2"/>`;
  rows.forEach((r, i) => {
    const ry = by + padIn + i * lh, sx = bx + padIn, sy = ry + lh / 2 - 1;
    if (r.type === "box") o += `<rect x="${sx}" y="${(sy - 6).toFixed(1)}" width="${swatchW}" height="11" rx="2" fill="${r.fill}" stroke="${r.stroke}" stroke-width="1.4"/>`;
    else if (r.type === "dot") o += `<circle cx="${sx + swatchW / 2}" cy="${sy.toFixed(1)}" r="4" fill="${r.fill}" stroke="#0e1418" stroke-width="1"/>`;
    else if (r.type === "line") o += `<line x1="${sx}" y1="${sy.toFixed(1)}" x2="${sx + swatchW}" y2="${sy.toFixed(1)}" stroke="${r.fill}" stroke-width="3" stroke-linecap="round"/>`;
    else o += `<rect x="${sx}" y="${(sy - 5).toFixed(1)}" width="9" height="9" rx="2" fill="none" stroke="${r.fill}" stroke-width="1.4"/>`;
    o += `<text x="${(sx + swatchW + 8).toFixed(1)}" y="${(sy + 3).toFixed(1)}" font-family="sans-serif" font-size="${fs}" fill="#c4d0d6">${esc(r.t)}</text>`;
  });
  return o + `</g>`;
}

function deckSVG(deck, mode) {
  const g = deck.grid, W = g.h * S + PAD * 2, H = g.w * S + PAD * 2;
  const RX = r => PAD + r.y * S, RY = r => PAD + r.x * S, RW = r => r.h * S, RH = r => r.w * S;
  const PX = p => PAD + p.y * S, PY = p => PAD + p.x * S;
  const center = r => ({ x: RX(r.rect) + RW(r.rect) / 2, y: RY(r.rect) + RH(r.rect) / 2 });
  const M = ([gx, gy]) => `${(PAD + gy * S).toFixed(1)},${(PAD + gx * S).toFixed(1)}`;
  const roomHidden = r => mode === "player" && r.spoiler;
  const roomLabel = r => { const L = r.map_label || r.name; return mode === "player" ? stripParen(L) : L; };
  const entLabel = e => { const L = e.map_label || e.name; return mode === "player" ? stripParen(L) : L; };
  const byId = {}; deck.rooms.forEach(r => byId[r.id] = r);
  let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
  out += `<rect x="0" y="0" width="${W}" height="${H}" fill="#0e1418"/>`;
  out += `<rect x="${PAD - 8}" y="${PAD - 8}" width="${W - 2 * PAD + 16}" height="${H - 2 * PAD + 16}" rx="10" fill="none" stroke="#2a3640" stroke-width="2"/>`;
  const HO = deck.hull_outline || deck.hull;
  if (HO) out += `<polygon points="${HO.map(M).join(" ")}" fill="none" stroke="#6fb6ac" stroke-width="2.5" opacity="0.85"/>`;
  // doors
  const seen = {};
  deck.rooms.forEach(r => (r.doors || []).forEach(d => {
    const t = byId[d.to]; if (!t || roomHidden(r) || roomHidden(t)) return;
    const k = [r.id, d.to].sort().join("|"); if (seen[k]) return; seen[k] = 1;
    const bb = x => ({ x0: RX(x.rect), y0: RY(x.rect), x1: RX(x.rect) + RW(x.rect), y1: RY(x.rect) + RH(x.rect) });
    const cl = (p, b) => ({ x: Math.max(b.x0, Math.min(b.x1, p.x)), y: Math.max(b.y0, Math.min(b.y1, p.y)) });
    const a = cl(center(t), bb(r)), b = cl(center(r), bb(t));
    out += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#7d8c94" stroke-width="2"${d.kind === "duct" ? ' stroke-dasharray="3 3"' : ""}/>`;
  }));
  // rooms (clipped to hull -> angled exterior walls)
  const obstacles = [];   // fixed label boxes (room titles) the entity de-collide must avoid
  deck.rooms.forEach(r => {
    const hidden = roomHidden(r);
    const fill = hidden ? "#161d22" : (mode === "warden" && r.spoiler) ? "#2a1416" : "#16242a";
    const stroke = hidden ? "#39474c" : (mode === "warden" && r.spoiler) ? "#ff7a6b" : "#4a6b73";
    const poly = r.poly ? r.poly : (deck.hull ? clipRoomToHull(r.rect, deck.hull) : null);
    if (poly && poly.length >= 3) out += `<polygon points="${poly.map(M).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
    else out += `<rect x="${RX(r.rect)}" y="${RY(r.rect)}" width="${RW(r.rect)}" height="${RH(r.rect)}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
    const name = hidden ? "Unexplored" : roomLabel(r);
    // clip the room name to the room's width so it never overflows the walls
    const lx = RX(r.rect) + 6, ly = RY(r.rect) + 15, budget = Math.max(24, RW(r.rect) - 12);
    const fit = fitText(name, budget, 11);
    out += `<text x="${lx}" y="${ly}" font-family="sans-serif" font-size="${fit.fs}" fill="${hidden ? "#6b7d84" : "#d7e2e6"}">${esc(fit.text)}</text>`;
    obstacles.push({ x1: lx, x2: lx + textW(fit.text, fit.fs), y1: ly - fit.fs, y2: ly + 3 });
  });
  // wayfinding
  const WP = p => ({ x: PAD + p[1] * S, y: PAD + p[0] * S });
  ((SHIP.wayfinding && SHIP.wayfinding.routes) || []).filter(rt => rt.deck === deck.id).forEach(rt => {
    if (mode === "player" && (rt.spoiler || rt.reveal === "warden")) return;
    const col = ((SHIP.wayfinding.deck_colors) || {})[deck.id] || "#b6ff00";   // per-deck hi-vis guide colour
    const pts = (rt.path || []).map(WP); if (pts.length < 2) return;
    const dash = rt.role === "secondary" ? ' stroke-dasharray="7 5"' : "";
    out += `<path d="M${pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L")}" fill="none" stroke="${col}" stroke-width="3"${dash}/>`;
  });
  // entities — draw the marker dots first, then place de-collided labels with leaders
  const FS = 9, GAP = 2, FLIP = 7;       // label size, vertical clearance, dot->label gap
  const ents = (SHIP.entities || []).filter(e => e.deck === deck.id)
    .filter(e => !(mode === "player" && e.spoiler))
    .filter(e => { const home = byId[e.room]; return !(home && roomHidden(home)); });
  const labels = ents.map(e => {
    const cx = PX(e.pos), cy = PY(e.pos), col = kindColor(e.kind);
    out += `<circle cx="${cx}" cy="${cy}" r="4" fill="${col}" stroke="#0e1418" stroke-width="1.2"/>`;
    const text = entLabel(e), w = textW(text, FS);
    // default to the right of the dot; flip left near the right edge
    const right = cx + FLIP + w <= W - 6;
    return { text, col, cx, cy, w, x: right ? cx + FLIP : cx - FLIP, anchor: right ? "start" : "end", y: cy + 3 };
  });
  const hit = (a, b) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
  const boxOf = L => ({ x1: L.anchor === "end" ? L.x - L.w : L.x, x2: L.anchor === "end" ? L.x : L.x + L.w, y1: L.y - FS, y2: L.y + 3 });
  const placed = [...obstacles];        // room titles are fixed; nudge entity labels off them and each other
  labels.sort((a, b) => a.y - b.y || a.x - b.x).forEach(L => {
    let guard = 0;
    while (placed.some(p => hit(boxOf(L), p)) && guard < 24) {
      const ny = L.y + (FS + GAP);
      L.y = (ny + 3 > H - PAD) ? L.y - (FS + GAP) : ny;   // bounce upward near the bottom edge
      guard++;
    }
    placed.push(boxOf(L));
  });
  labels.forEach(L => {
    // leader line from the dot to a displaced label so the eye can reassociate them
    const dispY = Math.abs(L.y - (L.cy + 3)) > FS;
    if (dispY) out += `<line x1="${L.cx.toFixed(1)}" y1="${L.cy.toFixed(1)}" x2="${L.x.toFixed(1)}" y2="${(L.y - 3).toFixed(1)}" stroke="${L.col}" stroke-width="1" opacity="0.5"/>`;
    out += `<text x="${L.x.toFixed(1)}" y="${L.y.toFixed(1)}" text-anchor="${L.anchor}" font-family="sans-serif" font-size="${FS}" fill="${L.col}">${esc(L.text)}</text>`;
  });

  // deck title (top-left) on a dark pill so it stays legible over any room that pokes
  // above the grid origin (e.g. Deck C's Scrubber Ctrl at rect.x = -2)
  const tnum = deck.id.slice(-1).toUpperCase();
  const title = `Deck ${tnum} · ${deck.name || ""}`, tfs = 15, tw = textW(title, tfs);
  const tby = PAD - 24;
  out += `<rect x="${PAD - 4}" y="${tby}" width="${(tw + 16).toFixed(1)}" height="22" rx="6" fill="#0e1418" fill-opacity="0.9"/>`;
  out += `<text x="${PAD + 4}" y="${tby + 16}" font-family="sans-serif" font-weight="700" font-size="${tfs}" fill="#d7e2e6">${esc(title)}</text>`;
  out += `<text x="${PAD - 18}" y="${H / 2}" transform="rotate(-90 ${PAD - 18} ${H / 2})" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="#7d8c94" opacity="0.8">FORE</text>`;
  out += `<text x="${W - PAD + 18}" y="${H / 2}" transform="rotate(90 ${W - PAD + 18} ${H / 2})" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="2" fill="#7d8c94" opacity="0.8">AFT</text>`;

  // legend (bottom-right corner, over empty space)
  out += legendSVG(W, H, mode, deck);
  return out + "</svg>";
}

// side elevation (deck layers) — mirrors docs/profile.html, used here as a render check
function profileSVG() {
  const COL = { "deck-a": "#f2b441", "deck-b": "#4fd1c5", "deck-c": "#a78bfa", "deck-d": "#ff7a6b" };
  const gyExt = deck => { let lo = Infinity, hi = -Infinity; const eat = p => (p || []).forEach(q => { lo = Math.min(lo, q[1]); hi = Math.max(hi, q[1]); });
    eat(deck.hull_outline || deck.hull); (deck.rooms || []).forEach(r => eat(r.poly)); return [lo, hi]; };
  const decks = [...SHIP.decks].sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
  const ext = decks.map(gyExt), maxGy = Math.max(...ext.map(e => e[1]));
  const Sx = 22, PAD = 36, DH = 46, GAP = 10, X = gy => PAD + gy * Sx;
  const TOP = 50;   // headroom for the title + fore/aft axis row
  const W = maxGy * Sx + PAD * 2, H = decks.length * (DH + GAP) + PAD + TOP;
  let o = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#0e1418"/>`;
  // title + fore -> aft orientation hint across the top
  o += `<text x="${PAD}" y="24" fill="#d7e2e6" font-size="15" font-weight="700" font-family="sans-serif">S.V. Dross — side elevation</text>`;
  o += `<text x="${PAD}" y="42" fill="#7d8c94" font-size="11" font-family="monospace" letter-spacing="1">fore ◀ — — — — — — — — — — — — ▶ aft   (one deck down per scene)</text>`;
  decks.forEach((d, i) => {
    const [lo, hi] = ext[i], y = TOP + i * (DH + GAP), x0 = X(Math.max(0, lo)), x1 = X(hi), c = COL[d.id] || "#6fb6ac";
    // faint translucent body so the bright label reads against the dark backdrop (NOT 8-digit hex; cairosvg renders that opaque)
    o += `<rect x="${x0}" y="${y}" width="${Math.max(2, x1 - x0)}" height="${DH}" rx="5" fill="${c}" fill-opacity="0.14" stroke="${c}" stroke-width="2"/>`;
    const tnum = d.id.slice(-1).toUpperCase();
    o += `<text x="${x0 + 10}" y="${y + DH / 2 + 5}" fill="${c}" font-size="15" font-weight="700" font-family="sans-serif">Deck ${tnum} · ${esc(d.name || "")}</text>`;
  });
  return o + "</svg>";
}
fs.writeFileSync(new URL("deck-profile.svg", OUT), profileSVG());

let n = 0;
for (const deck of SHIP.decks) for (const mode of ["warden", "player"]) {
  const f = new URL(`${deck.id}-${mode}.svg`, OUT);
  fs.writeFileSync(f, deckSVG(deck, mode)); n++;
  // quick clip sanity: report how many rooms got angled (non-rect) walls
}
// report angled-wall coverage per deck (warden)
for (const deck of SHIP.decks) {
  let angled = 0;
  for (const r of deck.rooms) { const p = clipRoomToHull(r.rect, deck.hull); if (p.length !== 4 || p.some(q => q[0] % 1 || q[1] % 1)) angled++; }
  console.log(`${deck.id}: ${deck.rooms.length} rooms, ${angled} with hull-angled walls`);
}
console.log(`wrote ${n} SVGs to cairn-review/decks/`);
