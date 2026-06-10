#!/usr/bin/env node
// Table display server for the S.V. Dross game night.
// Pure Node.js built-ins only (http + os). NO external packages, NO npm install.
//
// Channels:
//   server -> TV    : Server-Sent Events  (GET /events)
//   server -> app   : WebSocket            (GET /ws, RFC6455 — for native TV apps)
//   phone  -> server : plain HTTP POST     (POST /push)
//
// WebSocket protocol (for a native Android TV client):
//   connect ws://<host>:8899/ws  -> immediately receives the current state as one
//   JSON text frame, then one frame per push:
//     {"kind":"image"|"map"|"sound"|"clear","src":"../assets/...","title":"...","loop":bool,"version":n}
//   Resolve relative src against http://<host>:8866/table/. Client->server frames are
//   ignored (push via POST /push). Server answers ping with pong; idle pings every 20s.
//
// One-shot OVERLAY events (fire-and-forget; never persistent state):
//   POST /push {"kind":"sfx","src":"../assets/audio/sfx-klaxon.mp3"}
//   POST /push {"kind":"say","text":"...","voice":"Samantha","pitch":1.25,"rate":0.92}
//   broadcast separately as SSE `event: oneshot` and WS {"type":"oneshot",...} with
//   payload {overlay:"sfx",src} or {overlay:"say",text,voice,pitch,rate}. These do
//   NOT touch state/version, so a reconnecting display never replays an old klaxon.
//
// State is a single in-memory object broadcast to every connected display.
// This file binds 0.0.0.0:8899 and is meant to run on the LAN host that also
// serves docs/ statically on :8866.

import http from 'node:http';
import os from 'node:os';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT) || 8899;
const PING_MS = 20_000; // SSE keep-alive comment interval

// ---- display state ---------------------------------------------------------
// TWO INDEPENDENT CHANNELS so a map/image push never kills the ambience:
//   visual: {kind:"image"|"map", src, title} | null      audio: {src, title, loop} | null
// push kinds: image|map -> set visual; sound -> set audio; stopsound -> audio off;
//             clear -> visual off (audio keeps playing);
//             blackout -> visual off (audio keeps playing too — emergency SCREEN-off,
//               functionally identical to clear; the ONLY thing that stops ambience is stopsound).
// o2: persistent O₂ countdown clock (the adventure's core timer). The Warden
// drives it; the display shows it BIG. {pct:Number|null, running:Boolean, label:String}.
// pct===null hides the readout entirely.
const O2_DEFAULT = { pct: null, running: false, label: '' };
let state = { visual: null, audio: null, o2: { ...O2_DEFAULT } };
let version = 0; // bumps on every push; lets clients dedupe if they want

// ---- connected SSE clients -------------------------------------------------
/** @type {Set<import('node:http').ServerResponse>} */
const clients = new Set();

function sseSend(res, data) {
  // One SSE "message" event carrying the JSON state.
  res.write(`event: state\ndata: ${JSON.stringify(data)}\n\n`);
}

function broadcast() {
  const payload = { ...state, version };
  for (const res of clients) {
    try {
      sseSend(res, payload);
    } catch {
      clients.delete(res);
    }
  }
  const frame = wsTextFrame(JSON.stringify(payload));
  for (const sock of wsClients) {
    try {
      sock.write(frame);
    } catch {
      wsClients.delete(sock);
    }
  }
}

// ---- one-shot overlay events ----------------------------------------------
// FIRE-AND-FORGET overlays (SFX / NPC voice) that LAYER OVER the ambience and
// never become persistent state. They do NOT touch `state` or `version`, so a
// reconnecting display never replays an old klaxon. SSE uses a distinct
// `event: oneshot`; native WS clients get {type:"oneshot",...}.
function broadcastOneshot(payload) {
  for (const res of clients) {
    try {
      res.write(`event: oneshot\ndata: ${JSON.stringify(payload)}\n\n`);
    } catch {
      clients.delete(res);
    }
  }
  const frame = wsTextFrame(JSON.stringify({ type: 'oneshot', ...payload }));
  for (const sock of wsClients) {
    try {
      sock.write(frame);
    } catch {
      wsClients.delete(sock);
    }
  }
}

// ---- WebSocket (RFC6455, server->client text frames only) -------------------
/** @type {Set<import('node:net').Socket>} */
const wsClients = new Set();
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function wsTextFrame(str) {
  const data = Buffer.from(str, 'utf8');
  let header;
  if (data.length < 126) {
    header = Buffer.from([0x81, data.length]);
  } else if (data.length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81; header[1] = 126; header.writeUInt16BE(data.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81; header[1] = 127; header.writeBigUInt64BE(BigInt(data.length), 2);
  }
  return Buffer.concat([header, data]);
}

// ---- helpers ---------------------------------------------------------------
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function sendJSON(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    ...CORS,
  });
  res.end(body);
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const ALLOWED_KINDS = new Set([
  'image', 'map', 'sound', 'stopsound', 'clear', 'blackout',
  // O₂ countdown clock (persistent state.o2)
  'o2set', 'o2adjust', 'o2label', 'o2run', 'o2off',
  // posed 3D ship view cast to the TV (visual channel)
  'scene3d',
]);

const clampPct = (n) => Math.max(0, Math.min(100, n));

// Mutates the channel the push addresses; returns a log string.
function applyPush(obj) {
  const kind = ALLOWED_KINDS.has(obj?.kind) ? obj.kind : 'blackout';
  const src = typeof obj?.src === 'string' ? obj.src : null;
  const title = typeof obj?.title === 'string' ? obj.title : null;
  if (kind === 'image' || kind === 'map') state.visual = { kind, src, title };
  else if (kind === 'sound') state.audio = { src, title, loop: !!obj.loop };
  else if (kind === 'stopsound') state.audio = null;       // ONLY thing that silences ambience
  else if (kind === 'clear') state.visual = null;          // audio keeps playing
  // ---- O₂ countdown (persistent; independent of visual/audio) ----
  else if (kind === 'o2set') {
    const pct = typeof obj?.pct === 'number' && isFinite(obj.pct) ? clampPct(obj.pct) : state.o2.pct;
    state.o2 = { ...state.o2, pct };
  } else if (kind === 'o2adjust') {
    const delta = typeof obj?.delta === 'number' && isFinite(obj.delta) ? obj.delta : 0;
    const base = typeof state.o2.pct === 'number' ? state.o2.pct : 0;
    state.o2 = { ...state.o2, pct: clampPct(base + delta) };
  } else if (kind === 'o2label') {
    state.o2 = { ...state.o2, label: typeof obj?.label === 'string' ? obj.label : '' };
  } else if (kind === 'o2run') {
    state.o2 = { ...state.o2, running: !!obj?.running };
  } else if (kind === 'o2off') {
    state.o2 = { ...O2_DEFAULT };
  }
  // ---- posed 3D view (visual channel; replaces image/map) ----
  else if (kind === 'scene3d') {
    const cam = obj?.cam && typeof obj.cam === 'object' ? obj.cam : null;
    state.visual = { kind: 'scene3d', cam };
  } else state.visual = null;                              // blackout: screen off, audio keeps playing
  if (kind.startsWith('o2')) return `kind=${kind} o2=${JSON.stringify(state.o2)}`;
  if (kind === 'scene3d') return `kind=scene3d cam=${JSON.stringify(state.visual.cam)}`;
  return `kind=${kind} title=${title ?? '-'} src=${src ?? '-'}`;
}

// Builds the one-shot overlay payload broadcast on the 'oneshot' channel.
// Returns null if the payload is unusable (no src for sfx, no text for say).
function makeOneshot(obj) {
  if (obj.kind === 'sfx') {
    const src = typeof obj.src === 'string' ? obj.src : null;
    if (!src) return null;
    return { overlay: 'sfx', src };
  }
  // say
  const text = typeof obj.text === 'string' ? obj.text.trim() : '';
  if (!text) return null;
  const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);
  return {
    overlay: 'say',
    text,
    voice: typeof obj.voice === 'string' ? obj.voice : null,
    pitch: num(obj.pitch, 1),
    rate: num(obj.rate, 1),
  };
}

// ---- server ----------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  // SSE stream -> TV
  if (req.method === 'GET' && path === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      ...CORS,
    });
    res.write('retry: 2000\n\n'); // tell EventSource to retry every 2s on drop
    // Immediately hand the new client the current state.
    sseSend(res, { ...state, version });
    clients.add(res);

    const ping = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        /* cleaned up below */
      }
    }, PING_MS);

    req.on('close', () => {
      clearInterval(ping);
      clients.delete(res);
    });
    return;
  }

  // current state -> anyone
  if (req.method === 'GET' && path === '/state') {
    sendJSON(res, 200, { ...state, version });
    return;
  }

  // push new state <- phone
  if (req.method === 'POST' && path === '/push') {
    let parsed;
    try {
      const raw = await readBody(req);
      parsed = JSON.parse(raw || '{}');
    } catch (e) {
      sendJSON(res, 400, { ok: false, error: String(e.message || e) });
      return;
    }
    // Stop the overlay layer (cuts any playing SFX + NPC voice) — stateless, never touches ambience.
    if (parsed?.kind === 'stopfx') {
      broadcastOneshot({ overlay: 'stop' });
      console.log(`[oneshot] ${new Date().toISOString()}  stop overlay  -> ${clients.size + wsClients.size} display(s)`);
      sendJSON(res, 200, { ok: true, oneshot: { overlay: 'stop' } });
      return;
    }
    // One-shot overlay kinds (sfx / say) never modify persistent state/version.
    if (parsed?.kind === 'sfx' || parsed?.kind === 'say') {
      const overlay = makeOneshot(parsed);
      if (!overlay) {
        sendJSON(res, 400, { ok: false, error: 'bad overlay payload' });
        return;
      }
      broadcastOneshot(overlay);
      const desc = overlay.overlay === 'sfx'
        ? `sfx src=${overlay.src}`
        : `say "${(overlay.text || '').slice(0, 60)}" voice=${overlay.voice ?? '-'} pitch=${overlay.pitch} rate=${overlay.rate}`;
      console.log(`[oneshot] ${new Date().toISOString()}  ${desc}  -> ${clients.size + wsClients.size} display(s)`);
      sendJSON(res, 200, { ok: true, oneshot: overlay });
      return;
    }

    const logline = applyPush(parsed);
    version += 1;
    broadcast();
    console.log(`[push] ${new Date().toISOString()}  ${logline}  -> ${clients.size + wsClients.size} display(s)`);
    sendJSON(res, 200, { ok: true, state: { ...state, version } });
    return;
  }

  // tiny health root
  if (req.method === 'GET' && path === '/') {
    sendJSON(res, 200, { ok: true, service: 'dross-table', version, displays: clients.size });
    return;
  }

  sendJSON(res, 404, { ok: false, error: 'not found' });
});

// ---- WebSocket upgrade -------------------------------------------------------
server.on('upgrade', (req, socket) => {
  const url = new URL(req.url, 'http://localhost');
  const key = req.headers['sec-websocket-key'];
  if (url.pathname !== '/ws' || !key) {
    socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
    socket.destroy();
    return;
  }
  const accept = crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
      `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
  );
  socket.setNoDelay(true);
  wsClients.add(socket);
  socket.write(wsTextFrame(JSON.stringify({ ...state, version })));
  console.log(`[ws] client connected (${wsClients.size} ws client(s))`);

  // Minimal inbound handling: answer ping (0x9) with pong (0xA), honor close (0x8).
  socket.on('data', (buf) => {
    if (buf.length < 2) return;
    const opcode = buf[0] & 0x0f;
    if (opcode === 0x8) { try { socket.end(); } catch {} }
    else if (opcode === 0x9) { try { socket.write(Buffer.from([0x8a, 0x00])); } catch {} }
    // text/binary from clients is ignored — push via POST /push
  });
  const ping = setInterval(() => {
    try { socket.write(Buffer.from([0x89, 0x00])); } catch { /* cleanup below */ }
  }, PING_MS);
  const drop = () => { clearInterval(ping); wsClients.delete(socket); };
  socket.on('close', drop);
  socket.on('error', drop);
});

// ---- startup banner --------------------------------------------------------
function lanIPv4() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const ni of ifaces[name] || []) {
      if (ni.family === 'IPv4' && !ni.internal) return ni.address;
    }
  }
  return '127.0.0.1';
}

server.listen(PORT, '0.0.0.0', () => {
  const ip = lanIPv4();
  console.log('S.V. Dross — table display server');
  console.log(`  push/SSE API : http://${ip}:${PORT}  (POST /push, GET /events, GET /state)`);
  console.log(`  WebSocket    : ws://${ip}:${PORT}/ws  (native TV apps; same JSON per push)`);
  console.log('');
  console.log('  Open these (served by the existing docs/ static server on :8866):');
  console.log(`    TV / display : http://${ip}:8866/table/display.html`);
  console.log(`    phone control: http://${ip}:8866/table/control.html`);
  console.log('');
  console.log('  (Pages derive the API host from their own URL — no IP is baked in.)');
});
