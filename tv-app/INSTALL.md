# Dross Table — Android TV sideload

A thin WebView app (package `net.userdevice.drosstable`) that loads
`…/table/display.html` fullscreen as a reliable TV "second screen". See the parent
`docs/table/README.md` for what it does and the server it talks to.

**Requirement:** the TV and the server must be on the same LAN.

## 0. Point it at your server (required)

Edit `app/src/main/res/values/strings.xml` → `display_url`, replacing `YOUR-SERVER`
with the LAN IP/hostname running `docs/table/server.mjs` (e.g. `http://<your-host>:8866/table/display.html`), then build.

## 1. Build the APK

No prebuilt APK ships in this repo — build a debug one with the Android SDK + Gradle
(Android Studio, or any container with the SDK):

```bash
./gradlew assembleDebug   # -> app/build/outputs/apk/debug/app-debug.apk
```

## 2. Install it

**Option A — adb over LAN:** On the TV enable Developer options (Settings > Device Preferences > About > click Build 7x) then Developer options > USB/Network debugging ON. From any machine with adb: `adb connect <tv-ip>:5555` (accept the prompt on the TV), then `adb install app/build/outputs/apk/debug/app-debug.apk`. (Reinstalling over a different debug key fails with `INSTALL_FAILED_UPDATE_INCOMPATIBLE` — `adb uninstall net.userdevice.drosstable` first.)

**Option B — Downloader app:** Install "Downloader" from the Play Store on the TV, allow it to install unknown apps (Settings > Apps > Security & Restrictions), serve the APK on the LAN (e.g. `docker run --rm -p 8088:80 -v $(pwd):/usr/share/nginx/html:ro nginx`), then enter `http://<server-ip>:8088/app-debug.apk` in Downloader and install.

The app appears as "Dross Table" in the TV launcher row (and the normal app drawer on phones).
