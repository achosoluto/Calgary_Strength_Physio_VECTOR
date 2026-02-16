# Project VECTOR — Icon Design Plan
# 아이콘 디자인 계획

**Date:** 2026-02-16  
**Author:** Principal Architect  
**Status:** PLAN — Awaiting Approval  
**Objective:** Create 4 distinct icon sets for A/B visual comparison  

---

## 1. Scope & Inventory
## 1. 범위 및 인벤토리

The TRAJECTORY dashboard currently uses **7 inline SVGs** defined in `frontend/js/trajectory.js`. Each icon set will provide a variant for all 7, ensuring a drop-in replacement.

| # | Icon Name | Current Shape | Where Used |
|:--|:----------|:--------------|:-----------|
| 1 | `target` | Radar crosshair | **Pike** — Terminal Goal header |
| 2 | `lock` | Padlock (closed) | **Phase Card** — Locked phase indicator |
| 3 | `unlock` | Padlock (open) | **Phase Card** — Unlocked (reserved) |
| 4 | `active` | Pulse/ECG line | **Phase Card** — Active phase indicator |
| 5 | `check` | Circle + checkmark | **Phase Card** — Completed phase / **Criterion** — Met |
| 6 | `pending` | Empty circle | **Criterion** — Pending |
| 7 | `locked_crit` | Dashed circle | **Criterion** — Locked |

**Bonus Icons (New for Phase 3):**

| # | Icon Name | Purpose |
|:--|:----------|:--------|
| 8 | `hd_badge` | High-Density tech marker (BFR, VBT, NMES) |
| 9 | `clinician` | Clinician Portal indicator |
| 10 | `record` | Metric recording action |

**Total deliverables: 10 icons × 4 styles = 40 SVG variants**

---

## 2. The Four Design Styles
## 2. 네 가지 디자인 스타일

### Style A: "Surgical Mechanic" (Jing Zhang)
> *Integrity — Show the internal mechanics*
> *무결성 — 내부 구조를 보여준다*

| Attribute | Specification |
|:----------|:-------------|
| **Line weight** | Thin, uniform 1.5px stroke |
| **Fill** | None (pure stroke) |
| **Concept** | "Cutaway" / "Blueprint" — icons feel like they've been disassembled to reveal inner workings |
| **Color** | Monochrome, uses `currentColor` inheritance from CSS |
| **Distinctive feature** | Internal detail lines. E.g., the `lock` icon shows the pin mechanism inside; the `target` shows concentric rings with measurement ticks like a technical sight |
| **Mood** | Precise, analytical, surgical. Like reading an X-ray. |

**Example — `target` icon concept:**
```
╭───────────╮
│  ┌─────┐  │   Outer ring with measurement ticks at 0°, 90°, 180°, 270°
│  │ ╺━╸ │  │   Inner ring with thin crosshair
│  └─────┘  │   Center: hollow dot (not solid) — the "null point"
╰───────────╯
```

**Example — `lock` icon concept:**
```
  ┌──┐
  │  │         Open shackle showing the pin
┌─┼──┼─┐
│ │  │ │       Body with internal "keyhole mechanism" detail:
│ └──┘ │       3 thin horizontal lines inside
│ ─ ─ ─│       representing tumbler pins
└──────┘
```

---

### Style B: "Geometric Precision" (DKNG Studios)
> *Clarity — Readability at any size*
> *명확성 — 어떤 크기에서도 가독성*

| Attribute | Specification |
|:----------|:-------------|
| **Line weight** | Thick, 2.5–3px stroke |
| **Fill** | Solid fills for key shapes; no fine detail |
| **Concept** | "Badge" / "Emblem" — every icon looks like a precision-stamped metal token |
| **Color** | Monochrome with optional single accent fill |
| **Distinctive feature** | Built from pure geometric primitives (circles, squares, triangles). No organic curves. E.g., the `check` is a perfect equilateral triangle pointing right, not a hand-drawn tick |
| **Mood** | Bold, authoritative, military-industrial. Like stamped helicopter switches. |

**Example — `target` icon concept:**
```
  ╱╲
 ╱  ╲        A perfect diamond (rotated square)
╱ ●  ╲       with a solid dot at center
╲    ╱       No crosshair — the silhouette IS the icon
 ╲  ╱
  ╲╱
```

**Example — `check` icon concept:**
```
┌──────────┐
│          │     A rounded square
│   ▶      │     containing a solid right-pointing
│          │     equilateral triangle (Play = "Go")
└──────────┘
```

---

### Style C: "Kinetic Rim-Lit" (Roger Deakins + Janusz Kamiński)
> *Tactility — Icons that glow and breathe*
> *촉각성 — 빛나고 숨쉬는 아이콘*

| Attribute | Specification |
|:----------|:-------------|
| **Line weight** | Medium 2px stroke |
| **Fill** | None, but uses SVG `<filter>` for glow/blur |
| **Concept** | "Cinematic Backlit" — icons feel like they're edge-lit or backlit by a strong source |
| **Color** | Uses CSS accent colors (`--accent-primary`, `--accent-success`) with glow effects |
| **Distinctive feature** | Animated CSS `filter: drop-shadow()` glow. Active icons pulse with a soft halo. Locked icons have zero glow (matte). An SVG `<feGaussianBlur>` filter is used for a "bokeh" rim effect |
| **Mood** | Cinematic, atmospheric. Like the HUD of a fighter jet at night. |

**CSS Enhancement Required:**
```css
/* Active icons get the "rim light" */
.phase-card.active .phase-icon .icon {
  filter: drop-shadow(0 0 6px var(--accent-primary))
          drop-shadow(0 0 12px rgba(0, 212, 255, 0.3));
  animation: rimPulse 2s ease-in-out infinite;
}

@keyframes rimPulse {
  0%, 100% { filter: drop-shadow(0 0 4px var(--accent-primary)); }
  50%      { filter: drop-shadow(0 0 10px var(--accent-primary)); }
}

/* Met criteria get a subtle "flash" */
.criterion-status .icon.met {
  filter: drop-shadow(0 0 4px var(--accent-success));
}

/* Locked = matte, no emission */
.phase-card.locked .phase-icon .icon {
  filter: none;
  opacity: 0.3;
}
```

**Example — `target` icon concept:**
```
Structurally identical to current crosshair, but:
- Outer ring has a subtle gradient stroke (brighter at top-right, simulating light direction)
- At rest: soft cyan glow
- On hover: glow intensifies (the "Deakins rack focus" effect)
```

---

### Style D: "Isometric Metaphor" (Andrew Nye)
> *Logic — Abstract concepts made visible*
> *논리 — 추상적 개념의 시각화*

| Attribute | Specification |
|:----------|:-------------|
| **Line weight** | 1.5px stroke |
| **Fill** | Flat color blocks (no gradients); uses 2–3 tones of same hue |
| **Concept** | "3D Object" — icons are tiny isometric objects that look like they exist in 3D space |
| **Color** | Each icon uses a 2-tone palette (e.g., light-cyan / dark-cyan for depth) |
| **Distinctive feature** | 30° isometric perspective. E.g., the `lock` is a 3D padlock drawn in iso view; the `target` is a 3D bullseye disc tilted toward the viewer |
| **Mood** | Corporate-premium, SaaS-polished. Like Stripe or Linear's icon systems. |

**Example — `target` icon concept:**
```
    ╱──╲         An isometric disc (like a coin)
   ╱ ●  ╲        with a slightly raised center dot
  ╱──────╲       3 concentric ellipses at 30° tilt
  ╲──────╱       Light face (top), dark face (side)
   ╲    ╱
    ╲──╱
```

**Example — `lock` icon concept:**
```
    ╱╲
   ╱  ╲           Isometric shackle
  ┌────┐╲
  │    │ │         3D box body — top face: light
  │  ○ │ │         Side face: darker shade
  │    │╱          Front face: medium shade
  └────┘           Keyhole as a simple circle
```

---

## 3. Implementation Architecture
## 3. 구현 아키텍처

### File Structure
```
frontend/
├── js/
│   ├── trajectory.js          # Main dashboard (imports active icon set)
│   ├── clinician.js           # Clinician portal
│   └── icons/
│       ├── icons-surgical.js   # Style A: Surgical Mechanic
│       ├── icons-geometric.js  # Style B: Geometric Precision
│       ├── icons-kinetic.js    # Style C: Kinetic Rim-Lit
│       ├── icons-isometric.js  # Style D: Isometric Metaphor
│       └── index.js            # Exports the active set
├── css/
│   ├── trajectory.css          # Base styles
│   └── icons/
│       ├── icons-surgical.css  # Style A specific CSS (if any)
│       ├── icons-kinetic.css   # Style C glow/animation CSS
│       └── icons-isometric.css # Style D fill overrides
└── icon-preview.html           # ★ Side-by-side comparison page
```

### Each Icon Module (`icons-*.js`)
Each file exports a single `ICONS` object with the same keys, making them interchangeable:

```javascript
// icons-surgical.js
export const ICONS = {
  target:      `<svg viewBox="0 0 24 24" class="icon icon-lg">...</svg>`,
  lock:        `<svg viewBox="0 0 24 24" class="icon">...</svg>`,
  unlock:      `<svg viewBox="0 0 24 24" class="icon">...</svg>`,
  active:      `<svg viewBox="0 0 24 24" class="icon">...</svg>`,
  check:       `<svg viewBox="0 0 24 24" class="icon icon-sm met">...</svg>`,
  pending:     `<svg viewBox="0 0 24 24" class="icon icon-sm">...</svg>`,
  locked_crit: `<svg viewBox="0 0 24 24" class="icon icon-sm locked">...</svg>`,
  hd_badge:    `<svg viewBox="0 0 24 24" class="icon icon-sm">...</svg>`,
  clinician:   `<svg viewBox="0 0 24 24" class="icon">...</svg>`,
  record:      `<svg viewBox="0 0 24 24" class="icon">...</svg>`,
};
```

### Switching Mechanism
`trajectory.js` will import from `icons/index.js`, which re-exports whichever set is active:

```javascript
// icons/index.js — Change this one line to switch styles
export { ICONS } from './icons-geometric.js';
```

Since we're using vanilla JS (no bundler), we'll use a simpler approach: a `<script>` tag that sets `window.ICONS` and is swapped via the preview page.

---

## 4. Preview Page (`icon-preview.html`)
## 4. 프리뷰 페이지

A dedicated comparison page showing all 4 styles side-by-side:

```
┌──────────────────────────────────────────────────────────────┐
│                    VECTOR ICON PREVIEW                        │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐                          │
│   │  SURGICAL    │  │  GEOMETRIC  │                          │
│   ├─────────────┤  ├─────────────┤                          │
│   │ 🎯 target   │  │ 🎯 target   │                          │
│   │ 🔒 lock     │  │ 🔒 lock     │                          │
│   │ 🔓 unlock   │  │ 🔓 unlock   │                          │
│   │ 📈 active   │  │ 📈 active   │                          │
│   │ ✅ check    │  │ ✅ check    │                          │
│   │ ○ pending   │  │ ○ pending   │                          │
│   │ ⊗ locked    │  │ ⊗ locked    │                          │
│   │ ⚡ hd_badge │  │ ⚡ hd_badge │                          │
│   └─────────────┘  └─────────────┘                          │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐                          │
│   │  KINETIC     │  │  ISOMETRIC  │                          │
│   ├─────────────┤  ├─────────────┤                          │
│   │ 🎯 target   │  │ 🎯 target   │                          │
│   │ ...         │  │ ...         │                          │
│   └─────────────┘  └─────────────┘                          │
│                                                              │
│   [ TOGGLE DARK/LIGHT ] [ ZOOM 100% ▼ ]                    │
│                                                              │
│   ── IN CONTEXT ──────────────────────────                  │
│   Shows a mock Phase Card using each icon set               │
│   at actual dashboard scale                                  │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- All 4 styles rendered simultaneously in a 2×2 grid
- Each icon shown at 3 sizes: `icon-sm` (18px), `icon` (24px), `icon-lg` (48px)
- A "In Context" section renders a mock Phase Card for each style
- Dark background matches the production dashboard (`--bg-primary: #0A0E17`)
- Toggle to check contrast on a white background

---

## 5. Execution Plan
## 5. 실행 계획

### Phase 1: Foundation (Step 1)
| Task | Description | Output |
|:-----|:-----------|:-------|
| **1.1** | Create `frontend/js/icons/` directory | Directory |
| **1.2** | Create `icons-surgical.js` with all 10 SVGs | JS file |
| **1.3** | Create `icons-geometric.js` with all 10 SVGs | JS file |
| **1.4** | Create `icons-kinetic.js` with all 10 SVGs | JS file |
| **1.5** | Create `icons-isometric.js` with all 10 SVGs | JS file |

### Phase 2: CSS Enhancements (Step 2)
| Task | Description | Output |
|:-----|:-----------|:-------|
| **2.1** | Create `icons-kinetic.css` with glow/pulse animations | CSS file |
| **2.2** | Create `icons-isometric.css` with fill overrides | CSS file |
| **2.3** | Ensure base `trajectory.css` icon styles are compatible | CSS edit |

### Phase 3: Preview Page (Step 3)
| Task | Description | Output |
|:-----|:-----------|:-------|
| **3.1** | Build `icon-preview.html` with 2×2 grid layout | HTML file |
| **3.2** | Add "In Context" mock Phase Card rendering | JS logic |
| **3.3** | Add dark/light toggle and zoom controls | Interaction |

### Phase 4: Integration (Step 4)
| Task | Description | Output |
|:-----|:-----------|:-------|
| **4.1** | Refactor `trajectory.js` to consume icons from external module | JS edit |
| **4.2** | Test all 4 styles on the live dashboard | Verification |
| **4.3** | Pick a winner and commit | Decision |

---

## 6. Design Constraints
## 6. 설계 제약 조건

1. **All SVGs use a `0 0 24 24` viewBox** — consistency across sets.
2. **All icons use `stroke: currentColor`** — color is inherited from CSS, not hardcoded.
3. **No external dependencies** — pure inline SVG. No icon libraries (Feather, Lucide, etc.).
4. **Accessibility** — each SVG should include `role="img"` and `aria-label`.
5. **Performance** — all icons are inline strings, no network requests.
6. **Style D (Isometric) exception** — uses `fill` in addition to `stroke`, but still inherits palette from CSS custom properties.

---

## 7. Success Criteria
## 7. 성공 기준

- [ ] All 40 SVG variants render correctly at 18px, 24px, and 48px
- [ ] Preview page loads and displays all 4 styles simultaneously
- [ ] Kinetic style animations are smooth (60fps) and not distracting
- [ ] Each style is visually distinct and recognizable
- [ ] Switching styles in `trajectory.js` requires changing only 1 line
- [ ] Final chosen style is integrated into the production dashboard

---

**Document Status:** Plan Ready for Execution  
**Estimated Effort:** ~2 hours  
**Next Action:** Upon approval, begin Phase 1 — SVG authoring for all 4 styles  
