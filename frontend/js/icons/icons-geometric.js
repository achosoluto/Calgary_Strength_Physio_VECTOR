/**
 * VECTOR Icon Set B: "Geometric Precision"
 * Inspiration: DKNG Studios — Bold silhouettes, pure geometric primitives, badge/emblem aesthetic.
 * Characteristics: 2.5px stroke, solid primitive shapes, minimal internal detail.
 */

const ICONS_GEOMETRIC = {
    // Target: Diamond (rotated square) with solid center dot
    target: `<svg viewBox="0 0 24 24" class="icon icon-lg" role="img" aria-label="Terminal Objective">
    <rect x="4.34" y="4.34" width="15.32" height="15.32" rx="2" transform="rotate(45 12 12)" stroke-width="2.5"/>
    <circle cx="12" cy="12" r="3" stroke-width="2.5"/>
    <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none"/>
  </svg>`,

    // Lock: Heavy geometric padlock — squared shackle, bold keyhole
    lock: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Locked Phase">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke-width="2.5"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-width="2.5"/>
    <circle cx="12" cy="16.5" r="2" fill="currentColor" stroke="none"/>
  </svg>`,

    // Unlock: Bold padlock with geometric open shackle
    unlock: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Unlocked Phase">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke-width="2.5"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1" stroke-width="2.5"/>
    <circle cx="12" cy="16.5" r="2" fill="currentColor" stroke="none"/>
  </svg>`,

    // Active: Bold arrow/chevron pointing right (Go / In-Motion)
    active: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Active Phase">
    <polygon points="6,4 20,12 6,20" stroke-width="2.5" fill="none"/>
    <line x1="10" y1="12" x2="16" y2="12" stroke-width="2.5"/>
  </svg>`,

    // Check: Solid hexagon with bold checkmark
    check: `<svg viewBox="0 0 24 24" class="icon icon-sm met" role="img" aria-label="Criterion Met">
    <polygon points="12,2 21.66,7 21.66,17 12,22 2.34,17 2.34,7" stroke-width="2"/>
    <polyline points="7.5 12.5, 10.5 15.5, 16.5 9" stroke-width="2.5"/>
  </svg>`,

    // Pending: Bold circle with centered horizontal line (pause/waiting)
    pending: `<svg viewBox="0 0 24 24" class="icon icon-sm" role="img" aria-label="Criterion Pending">
    <circle cx="12" cy="12" r="10" stroke-width="2.5"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke-width="2.5"/>
  </svg>`,

    // Locked Criterion: Solid square with X
    locked_crit: `<svg viewBox="0 0 24 24" class="icon icon-sm locked" role="img" aria-label="Criterion Locked">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2.5"/>
    <line x1="9" y1="9" x2="15" y2="15" stroke-width="2.5"/>
    <line x1="15" y1="9" x2="9" y2="15" stroke-width="2.5"/>
  </svg>`,

    // HD Badge: Bold octagon with upward arrow (upgrade/boost)
    hd_badge: `<svg viewBox="0 0 24 24" class="icon icon-sm" role="img" aria-label="High Density">
    <polygon points="7.86,2 16.14,2 22,7.86 22,16.14 16.14,22 7.86,22 2,16.14 2,7.86" stroke-width="2"/>
    <line x1="12" y1="16" x2="12" y2="8" stroke-width="2.5"/>
    <polyline points="8 12, 12 8, 16 12" stroke-width="2.5"/>
  </svg>`,

    // Clinician: Bold person silhouette with plus sign
    clinician: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Clinician">
    <circle cx="12" cy="7" r="4" stroke-width="2.5"/>
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" stroke-width="2.5"/>
    <line x1="19" y1="11" x2="19" y2="17" stroke-width="2.5"/>
    <line x1="16" y1="14" x2="22" y2="14" stroke-width="2.5"/>
  </svg>`,

    // Record: Bold clipboard with checkmark
    record: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Record Metric">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke-width="2.5"/>
    <line x1="8" y1="3" x2="8" y2="6" stroke-width="2.5"/>
    <line x1="16" y1="3" x2="16" y2="6" stroke-width="2.5"/>
    <polyline points="8.5 13.5, 11 16, 15.5 11" stroke-width="2.5"/>
  </svg>`
};

if (typeof window !== 'undefined') window.ICONS_GEOMETRIC = ICONS_GEOMETRIC;
