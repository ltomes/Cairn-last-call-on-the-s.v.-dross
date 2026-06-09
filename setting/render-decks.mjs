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
  deck.rooms.forEach(r => {
    const hidden = roomHidden(r);
    const fill = hidden ? "#161d22" : (mode === "warden" && r.spoiler) ? "#2a1416" : "#16242a";
    const stroke = hidden ? "#39474c" : (mode === "warden" && r.spoiler) ? "#ff7a6b" : "#4a6b73";
    const poly = r.poly ? r.poly : (deck.hull ? clipRoomToHull(r.rect, deck.hull) : null);
    if (poly && poly.length >= 3) out += `<polygon points="${poly.map(M).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
    else out += `<rect x="${RX(r.rect)}" y="${RY(r.rect)}" width="${RW(r.rect)}" height="${RH(r.rect)}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
    const name = hidden ? "Unexplored" : roomLabel(r);
    out += `<text x="${RX(r.rect) + 6}" y="${RY(r.rect) + 15}" font-family="sans-serif" font-size="11" fill="${hidden ? "#6b7d84" : "#d7e2e6"}">${esc(name)}</text>`;
  });
  // wayfinding
  const WP = p => ({ x: PAD + p[1] * S, y: PAD + p[0] * S });
  ((SHIP.wayfinding && SHIP.wayfinding.routes) || []).filter(rt => rt.deck === deck.id).forEach(rt => {
    if (mode === "player" && (rt.spoiler || rt.reveal === "warden")) return;
    const col = ((SHIP.wayfinding.deck_colors) || {})[deck.id] || "#6fb6ac";
    const pts = (rt.path || []).map(WP); if (pts.length < 2) return;
    const dash = rt.role === "secondary" ? ' stroke-dasharray="7 5"' : "";
    out += `<path d="M${pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L")}" fill="none" stroke="${col}" stroke-width="3"${dash}/>`;
  });
  // entities
  (SHIP.entities || []).filter(e => e.deck === deck.id).forEach(e => {
    if (mode === "player" && e.spoiler) return;
    const home = byId[e.room]; if (home && roomHidden(home)) return;
    const cx = PX(e.pos), cy = PY(e.pos), col = kindColor(e.kind);
    out += `<circle cx="${cx}" cy="${cy}" r="4" fill="${col}"/><text x="${cx + 7}" y="${cy + 3}" font-family="sans-serif" font-size="9" fill="${col}">${esc(entLabel(e))}</text>`;
  });
  return out + "</svg>";
}

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
