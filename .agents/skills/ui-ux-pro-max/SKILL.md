---
name: ui-ux-pro-max
description: AI-powered design intelligence with 79 UI styles, 192 color palettes, 74 font pairings, 119 UX guidelines, and spatial computing / iOS Dynamic Island optics.
---

# UI/UX Pro Max Skill

## Core Principles
1. **Design System Adherence**: Maintain consistent spatial hierarchy, optical boundaries, and high-contrast accessibility.
2. **Pitch-Black Glassmorphism & Liquid Optics**:
   - Canvas: Absolute Pitch Black `#000000` / OLED.
   - Glass Panels: `rgba(12, 14, 20, 0.72)` with `backdrop-filter: blur(28px) saturate(180%)`.
   - Optical Border: `1px solid rgba(255, 255, 255, 0.08)` with inner highlight `inset 0 1px 0 rgba(255, 255, 255, 0.12)`.
   - Liquid Spring Motion: Stiff spring with high damping (`stiffness: 450, damping: 32`) for crisp iOS-like fluid expansion.
3. **Ergonomic Window Real-Estate & Non-Intrusive Overlays**:
   - **Never block browser tabs or window controls.**
   - When a maximized application (e.g. Chrome, VS Code) is in focus, the pill must **NOT** cover the top tab bar. It should either:
     a) Hide completely until cursor touches the top edge or desktop is active.
     b) Or sit completely flush/collapsed into a 2px invisible trigger bar.
   - Size reduction: Compact, space-optimized dimensions (680px width max instead of 1120px; 25% of the bloated dimensions).
