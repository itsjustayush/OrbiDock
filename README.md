# 🪐 ORBIDOCK

> **The missing top-center Dynamic Island and system control center for Windows.**

Orbidock is an ultra-fast, resident desktop overlay for Windows 10 & 11 built with **Tauri 2**, **Rust**, **React**, **TypeScript**, and **Tailwind CSS**. It stays quiet and unobtrusive at the top center of your active screen, provides a subtle preview when your cursor reaches the screen edge, and unfolds into a liquid, frosted-glass control center with live hardware gauges, media playback, focus timers, clipboard tools, and intelligent dynamic alerts.

Inspired by macOS Dynamic Island, iOS Control Center, [V-Notch](https://github.com/rainaku/V-Notch), and [L4-Windows-NotchBar](https://github.com/Linux5Real/L4-Windows-NotchBar).

---

## ✨ Features

- **Dynamic Island Pill**: Sits top-center with a live digital clock, battery status/charging icon, pulsing status dot, and music equalizer.
- **Top-Edge Dwell Activation**: Native Win32 cursor tracking detects when your pointer touches the top boundary with configurable dwell delay (default `120ms`) and leave hysteresis (`400ms`).
- **Click-Through When Idle**: Uses `set_ignore_cursor_events(true)` when hidden/idle so maximized window tabs and window controls remain fully clickable.
- **Always-on-Top & Frameless**: Transparent background, borderless, and exempt from the Windows taskbar (`skipTaskbar: true`).
- **Multi-Monitor Awareness**: Detects which monitor contains the cursor via Win32 `MonitorFromPoint` and centers the overlay on that display.
- **AI Command Bar**: Click or press `Ctrl + Space` to expand. Supports instant smart actions (Summarize clipboard, Polish tone, Start Pomodoro timer, Debug code).
- **Interactive Bento Dashboard**:
  - 🎵 **Media Player**: Live scrub bar, album glow, animated equalizer, play/pause, prev/next, and volume slider.
  - ⚡ **Hardware Gauges**: Real-time CPU % load, RAM usage (GB & %), and battery status.
  - ⛅ **Weather Card**: Live temperature, high/low, humidity, wind speed, precipitation, and hourly forecast.
  - ⏱️ **Focus Timer & Meetings**: Interactive 25-minute Pomodoro timer (Start/Pause/Reset) and upcoming meeting alert.
  - 📋 **Clipboard Assistant**: Detects URLs, code snippets, JSON, or plain text with one-click actions.
  - 🔔 **Dynamic Alerts**: Grouped notifications for website monitors, competitor changes, and automations.
- **Windows Autostart**: Seamless autostart on PC boot via `tauri-plugin-autostart`, configurable with a toggle in Settings.
- **Global Hotkey**: Press `Ctrl + Space` anywhere to toggle the dock; press `Esc` to collapse.
- **System Tray Residency**: Quiet tray icon with quick controls (Toggle, Settings, Quit).
- **Single-Click Setup (`.exe`)**: Built with Tauri NSIS `currentUser` mode — zero administrator UAC prompts and silent updates.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      RUST NATIVE CORE                       │
│  - Background cursor edge detection (Win32 GetCursorPos)    │
│  - Monitor resolution & DPI detection (MonitorFromPoint)    │
│  - Dock State Machine: Hidden ⇄ Preview ⇄ Opening ⇄ Open    │
│  - Window Management: Frameless, transparent, always-on-top │
│  - Non-blocking click-through (`set_ignore_cursor_events`)  │
│  - Hardware Metrics Collector (`sysinfo`: CPU, RAM, Battery)│
│  - Clipboard monitoring & capture                           │
│  - Global hotkeys (`tauri-plugin-global-shortcut`)          │
│  - System tray icon & menu                                  │
│  - Windows Autostart (`tauri-plugin-autostart`)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ IPC (Events & Typed Commands)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT + TS RENDERER                      │
│  - Sleek top-center Pill (Clock, Battery, Status dots)      │
│  - Liquid / Gooey expansion animations via Framer Motion    │
│  - AI Command Bar (Search, Summarize, Rewrite, Quick Run)   │
│  - Navigation Rail (Dashboard, Media, Stats, Weather, etc.) │
│  - Interactive Bento Dashboard (Media, CPU/RAM, Pomodoro)   │
│  - Clipboard Assistant with 1-click action triggers         │
│  - Settings UI (Sensitivity, Autostart, Accessibility)     │
│  - Dev Mode FPS & State Transition Overlay                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v18+ or v20+)
2. **Rust** (`stable-x86_64-pc-windows-msvc`) and Visual Studio C++ Build Tools (or use GitHub Actions for automated zero-install compiling).

### Running in Development

```powershell
# 1. Install frontend dependencies
npm install

# 2. Run Vite dev server (with interactive mock simulation in browser)
npm run dev

# 3. Or launch native Tauri desktop app
npx tauri dev
```

### Production Build

```powershell
# Build frontend bundle
npm run build

# Build Windows standalone installer (.exe & .msi)
npx tauri build
```

The resulting setup installer will be generated in:
`src-tauri/target/release/bundle/nsis/Orbidock_0.1.0_x64-setup.exe`

---

## 🤖 Automated GitHub Actions Release (Zero Local Compiling)

Every push to `main` triggers `.github/workflows/release.yml`, which automatically:
1. Spawns a clean `windows-latest` virtual machine.
2. Installs Node.js & Rust stable with MSVC toolchain.
3. Packages the standalone `Orbidock-setup.exe` and `.msi` installers.
4. Publishes them directly to your repository's **GitHub Releases** tab!

---

---

## 🎯 1-Click Installation for Users (Zero Coding Required)

OrbiDock is designed for everyone—you do **NOT** need to know how to code, install programming languages, or open terminal windows:

1. Go to the **Releases** tab of this GitHub repository.
2. Download **`Orbidock_0.1.0_x64-setup.exe`**.
3. Double-click the file to install:
   - **No Administrator Password (UAC) needed**: Installs cleanly for your current Windows user profile.
   - **Auto-starts on PC boot**: The notch will automatically be ready at the top of your screen every time you turn on your computer.
   - **Runs quietly**: Sits next to your Windows clock in the system tray with zero taskbar clutter.

### Installing the Browser Companion (Chrome / Edge)
1. Open your browser and go to `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode** (top right switch).
3. Click **Load unpacked** and select the `extension` folder from OrbiDock.
4. Click **Details** and enable **Allow in Incognito** so your focus agenda protection works everywhere.

---

## ⌨️ Shortcuts & Controls

| Shortcut / Action | Function |
|---|---|
| `Ctrl + Space` | Toggle OrbiDock open / closed |
| `Esc` | Collapse unfolded drawer back to pill |
| Top-edge hover (120ms) | Trigger preview and unfold drawer |
| Cursor leave (400ms) | Auto-collapse drawer when user moves away |
| Tray Icon (Left Click) | Toggle dock display |

---

## 📄 License & Attributions
This software is provided under open-source terms. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for licenses and copyright notices of V-Notch (Apache-2.0), bloom (GPL-3.0), and L4-Windows-NotchBar (GPL-3.0).
