# Table Display — S.V. Dross second screen

A zero-dependency "second screen" for game night. The Warden pushes a **room
image**, a **deck map**, or a **sound** to a TV on the same LAN, live from a
phone. No npm install, no external CDNs, works fully offline.

## How it works

- **`server.mjs`** — pure Node.js (built-in `http` + `os` only) on **:8899**.
  Holds one display state and fans it out to every TV via **Server-Sent Events**.
  - `GET /events` — SSE stream (sends current state on connect, then every change; `: ping` every 20s).
  - `POST /push` — JSON `{kind,src,title,loop}` updates + broadcasts state.
  - `GET /state` — current state as JSON.
  - CORS `*` so the pages served from the existing `:8866` static server can call it.
- **`display.html`** — the TV page. Fullscreen black, crossfading images,
  audio with optional loop, auto-reconnecting SSE.
- **`control.html`** — the phone controller. Tabs for Rooms / Maps / Sounds,
  a big **Black Out** button, toasts confirming each push.

Pages derive the API host from `location.hostname` — **no IP or hostname is
hardcoded anywhere**, so this is safe to commit to a public repo.

## Run it (game night)

On the LAN host (the same box that serves `docs/`):

```bash
# 1. the existing static server for docs/ (port 8866), e.g.:
cd docs && uv run --no-project python -m http.server 8866 --bind 0.0.0.0

# 2. the push server (port 8899):
node docs/table/server.mjs
```

`server.mjs` prints the exact LAN URLs on startup. Then:

- **TV / display:**   `http://<host>:8866/table/display.html`  (in a desktop browser, F11 / fullscreen; the WebView app below runs fullscreen automatically)
- **Phone control:**  `http://<host>:8866/table/control.html`

`<host>` is the LAN IP printed by `server.mjs`.

## Assets

- Room art: `docs/assets/rooms/<deck.id>-<room.id>.png` (already present).
- Deck maps: `docs/assets/maps/deck-<x>-player.png` / `deck-<x>-warden.png`
  (rendered from the ship model; the Maps tab offers both per deck).
- Sounds: `docs/assets/audio/*.mp3` + `docs/assets/audio/index.json`
  (array of `{"file","title","loop"}`) — both present; ambiences loop, SFX don't.

## Native TV app (WebSocket)

For a native Android TV (or any) client, the server also speaks plain
**WebSocket** at `ws://<host>:8899/ws`:

1. Connect; you immediately receive the current state as one JSON text frame.
2. Every push then arrives as one JSON text frame:
   `{"kind":"image"|"map"|"sound"|"clear","src":"../assets/…","title":"…","loop":bool,"version":n}`
3. Resolve the relative `src` against `http://<host>:8866/table/` to get the
   media URL (e.g. `../assets/rooms/deck-a-bridge.png` →
   `http://<host>:8866/assets/rooms/deck-a-bridge.png`).
4. `kind:image|map` → show the picture; `kind:sound` → play the URL (loop if
   `loop`); `kind:clear` → black screen, stop audio.
5. The server pings every 20s and answers client pings; client→server frames
   are otherwise ignored — pushes go through `POST /push`.
6. Quickest possible "app": a WebView pointed at
   `http://<host>:8866/table/display.html` already does all of the above.

## Example: wrap `display.html` as an Android TV WebView app

Smart-TV browsers are inconsistent about autoplay, fullscreen, and cache, and
many TVs don't ship a browser at all. The most reliable kiosk is a thin
**WebView APK** that loads `display.html` on boot. This is an *example* — adapt
the package name and server URL to your setup. Nothing here needs the network
beyond your own LAN, and **no credentials or device IDs belong in the app**.

**Minimal `MainActivity`** (the WebView settings are the load-bearing part):

```java
WebView web = new WebView(this);
WebSettings s = web.getSettings();
s.setJavaScriptEnabled(true);                 // the page is all JS
s.setDomStorageEnabled(true);                 // Warden-mode flag, etc.
s.setMediaPlaybackRequiresUserGesture(false); // autoplay ambience/SFX without a tap
s.setCacheMode(WebSettings.LOAD_NO_CACHE);    // always pull the latest display state/art
web.clearCache(true);
getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
setContentView(web);
web.loadUrl("http://YOUR_SERVER_HOST:8866/table/display.html");  // <-- your LAN host
```

**Native voice (optional).** Android WebView does **not** implement the Web
Speech `speechSynthesis` API, so the soundboard's "say" one-shots are silent in a
bare WebView. Bridge to native TTS by exposing an `@JavascriptInterface` (e.g.
`window.AndroidTTS.speak(text)`) backed by `android.speech.tts.TextToSpeech`;
`display.html` already calls `window.AndroidTTS` when present and falls back to
`speechSynthesis` in a desktop browser.

**Build & install (generic):**

```bash
# Build a debug APK with the Android SDK / Gradle (Android Studio, or any
# containerized android-build image with the SDK + your project mounted):
./gradlew assembleDebug          # -> app/build/outputs/apk/debug/app-debug.apk

# Sideload to a TV with developer mode + ADB-over-network enabled:
adb connect <tv-ip>:5555
adb install -r app-debug.apk     # first install of a debug build: drop -r
# Reinstalling a debug build over a different signing key fails with
# INSTALL_FAILED_UPDATE_INCOMPATIBLE — `adb uninstall <your.package>` first.
```

> Pairing ADB to a TV requires that TV's own authorized key — **generate/keep
> those keys outside this repo** (they're credentials). This public repo
> deliberately `.gitignore`s `.android/` and `*.adbkey`.

## Notes

- Browser path is **SSE-based** (server→TV push) + plain HTTP POST
  (phone→server); native path is the WebSocket above. No extra deps either way.
- Display auto-reconnects every 2s if the server restarts or Wi-Fi blips.
- Desktop browsers block autoplay until a user gesture; the WebView app sets
  `setMediaPlaybackRequiresUserGesture(false)` so ambience/SFX start untouched.
