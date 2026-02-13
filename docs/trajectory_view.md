# TRAJECTORY View — UX Wireframe & Specification

**Component:** TRAJECTORY (Client-Facing Dashboard)  
**Version:** 1.0 MVP  
**Date:** 2026-02-12

---

## 1. Design Philosophy

TRAJECTORY is the **client-facing representation** of their rehabilitation journey. It transforms a medical process into a **self-directed mission** — shifting the user from "Patient" to "Sovereign Subject."

### Core UX Metaphors

| Element | Metaphor | Function |
| :--- | :--- | :--- |
| **The Pike** | A terminal beacon at the top | Visualizes the end goal (e.g., "315lb Squat"). Always visible. Always pulling forward. |
| **The Lock** | A padlocked gate on each phase | Phases remain locked until ALL exit criteria are met. Creates urgency and clarity. |
| **The Vector** | A directional line connecting phases | Shows progression from current state to terminal goal. Linear but dense. |

### Design Principles

1. **No Ambiguity**: The client knows exactly where they are and what they need to do next.
2. **Data as Unlock Key**: Every locked gate shows the specific metrics required to open it.
3. **Identity Shift**: Language uses "you" and "your mission" — never "patient" or "treatment."
4. **Dark, Industrial Aesthetic**: Steel grays, electric accents, lock iconography. This is a control panel, not a hospital form.

---

## 2. Page Layout

```
┌─────────────────────────────────────────────────────┐
│  VECTOR TRAJECTORY              [Client Name]       │
│  ─────────────────────────────────────────────────── │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │              🎯 THE PIKE                        │ │
│  │         "Return to 315lb Squat"                 │ │
│  │         ─────────────────────                   │ │
│  └─────────────────────────────────────────────────┘ │
│                        │                             │
│                        ▼                             │
│  ┌─────────────────────────────────────────────────┐ │
│  │  🔒 PHASE 3: Power & Return to Sport           │ │
│  │  ├─ Quad LSI ≥ 90%        [current: --]        │ │
│  │  ├─ Hop Test LSI ≥ 90%    [current: --]        │ │
│  │  └─ ACL-RSI ≥ 56          [current: --]        │ │
│  └─────────────────────────────────────────────────┘ │
│                        │                             │
│                        ▼                             │
│  ┌─────────────────────────────────────────────────┐ │
│  │  🔒 PHASE 2: Strength Foundation               │ │
│  │  ├─ Knee Flexion ≥ 120°   [current: 95°]       │ │
│  │  ├─ Quad LSI ≥ 60%        [current: 42%]       │ │
│  │  └─ SL Balance ≥ 30s      [current: 12s]       │ │
│  └─────────────────────────────────────────────────┘ │
│                        │                             │
│                        ▼                             │
│  ┌─────────────────────────────────────────────────┐ │
│  │  🔓 PHASE 1: Protection & Activation  ✅ ACTIVE │ │
│  │  ├─ Knee Extension = 0°   [current: 3°]   ⬜   │ │
│  │  ├─ Quad Lag = 0°          [current: 0°]   ✅   │ │
│  │  ├─ Pain ≤ 2/10            [current: 1/10] ✅   │ │
│  │  └─ Effusion ≤ Grade 1     [current: 1]    ✅   │ │
│  │                                                  │ │
│  │  📋 YOUR PROGRAMMING:                           │ │
│  │  ┌──────────────────────────────────────────┐   │ │
│  │  │ Quad Activation: Quad Set + NMES         │   │ │
│  │  │ ROM Restoration: Prone Hang              │   │ │
│  │  │ Hypertrophy:     BFR Straight Leg Raise  │   │ │
│  │  └──────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ─────────────────────────────────────────────────── │
│  Last Updated: 2026-02-10  │  Next Session: Feb 14  │
└─────────────────────────────────────────────────────┘
```

---

## 3. State Definitions

| State | Icon | Visual Treatment |
| :--- | :--- | :--- |
| **Locked** | 🔒 | Dimmed card, steel border, criteria shown but values are `--` |
| **Active** | 🔓 | Bright card, electric accent border, criteria show live values with ✅/⬜ |
| **Completed** | ✅ | Collapsed card, green accent, shows completion date |

---

## 4. Color Palette

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--bg-primary` | `#0A0E17` | Page background (near-black) |
| `--bg-card` | `#111827` | Card background |
| `--bg-card-active` | `#1a2332` | Active phase card |
| `--accent-primary` | `#00D4FF` | Electric cyan — active elements, The Pike |
| `--accent-success` | `#10B981` | Criteria met, completed phases |
| `--accent-warning` | `#F59E0B` | Criteria in progress |
| `--accent-locked` | `#4B5563` | Locked phases, dimmed elements |
| `--text-primary` | `#F9FAFB` | Primary text |
| `--text-secondary` | `#9CA3AF` | Secondary/muted text |
| `--border-default` | `#1F2937` | Default card borders |
| `--border-active` | `#00D4FF` | Active phase border |

---

## 5. Typography

| Element | Font | Size | Weight |
| :--- | :--- | :--- | :--- |
| Page Title | `Outfit` | 28px | 700 |
| Phase Name | `Outfit` | 20px | 600 |
| Criteria Label | `Inter` | 14px | 500 |
| Criteria Value | `JetBrains Mono` | 14px | 600 |
| Body Text | `Inter` | 14px | 400 |
| Pike Goal | `Outfit` | 24px | 700 |

---

## 6. Interactions

1. **Phase Expansion**: Clicking a locked phase shows the exit criteria (read-only).
2. **Active Phase Detail**: The active phase is always expanded, showing criteria + programming.
3. **Metric Animation**: When a criterion changes from ⬜ to ✅, trigger a brief pulse animation.
4. **Pike Glow**: The Pike element has a subtle breathing glow animation (CSS keyframe).

---

*End of TRAJECTORY View Specification*
