/**
 * VECTOR Icon Set D: "Isometric Metaphor"
 * Inspiration: Andrew Nye — Flat-filled 3D objects at 30° tilt, SaaS-premium aesthetic.
 * Characteristics: 1.5px stroke, uses fill for 2-tone depth, isometric perspective.
 * REQUIRES: icons-isometric.css for fill color overrides.
 */

const ICONS_ISOMETRIC = {
    // Target: Isometric disc (tilted bullseye) with layered rings
    target: `<svg viewBox="0 0 24 24" class="icon icon-lg iso" role="img" aria-label="Terminal Objective">
    <ellipse cx="12" cy="14" rx="10" ry="5" stroke-width="1.5" class="iso-base"/>
    <ellipse cx="12" cy="13" rx="10" ry="5" stroke-width="1.5" class="iso-top"/>
    <ellipse cx="12" cy="13" rx="6" ry="3" stroke-width="1" class="iso-mid"/>
    <ellipse cx="12" cy="13" rx="2" ry="1" stroke-width="1" class="iso-center"/>
  </svg>`,

    // Lock: 3D padlock — top face + front face + side face
    lock: `<svg viewBox="0 0 24 24" class="icon iso" role="img" aria-label="Locked Phase">
    <path d="M5 11 L5 20 L12 23 L19 20 L19 11 L12 14 Z" stroke-width="1.5" class="iso-base"/>
    <path d="M5 11 L12 8 L19 11 L12 14 Z" stroke-width="1.5" class="iso-top"/>
    <path d="M12 14 L12 23 L19 20 L19 11 Z" stroke-width="1.5" class="iso-side"/>
    <path d="M8 11 L8 7 C8 3.5 16 3.5 16 7 L16 11" stroke-width="1.5" fill="none"/>
    <circle cx="12" cy="17" r="1" class="iso-dot"/>
  </svg>`,

    // Unlock: 3D padlock with raised shackle
    unlock: `<svg viewBox="0 0 24 24" class="icon iso" role="img" aria-label="Unlocked Phase">
    <path d="M5 11 L5 20 L12 23 L19 20 L19 11 L12 14 Z" stroke-width="1.5" class="iso-base"/>
    <path d="M5 11 L12 8 L19 11 L12 14 Z" stroke-width="1.5" class="iso-top"/>
    <path d="M12 14 L12 23 L19 20 L19 11 Z" stroke-width="1.5" class="iso-side"/>
    <path d="M8 11 L8 7 C8 3.5 14 3.5 14 5" stroke-width="1.5" fill="none"/>
    <circle cx="12" cy="17" r="1" class="iso-dot"/>
  </svg>`,

    // Active: Isometric arrow/chevron pointing forward-right
    active: `<svg viewBox="0 0 24 24" class="icon iso" role="img" aria-label="Active Phase">
    <path d="M4 8 L12 4 L20 8 L20 16 L12 20 L4 16 Z" stroke-width="1.5" class="iso-base"/>
    <path d="M4 8 L12 4 L20 8 L12 12 Z" stroke-width="1.5" class="iso-top"/>
    <path d="M12 12 L20 8 L20 16 L12 20 Z" stroke-width="1.5" class="iso-side"/>
    <polyline points="9 10, 13 12, 9 14" stroke-width="2" fill="none" class="iso-arrow"/>
  </svg>`,

    // Check: Isometric cube with checkmark on top face
    check: `<svg viewBox="0 0 24 24" class="icon icon-sm met iso" role="img" aria-label="Criterion Met">
    <path d="M4 8 L12 4 L20 8 L20 16 L12 20 L4 16 Z" stroke-width="1.5" class="iso-base"/>
    <path d="M4 8 L12 4 L20 8 L12 12 Z" stroke-width="1.5" class="iso-top"/>
    <path d="M12 12 L20 8 L20 16 L12 20 Z" stroke-width="1.5" class="iso-side"/>
    <polyline points="8 8, 11 10, 16 6" stroke-width="2" fill="none"/>
  </svg>`,

    // Pending: Isometric flat disc (coin on table)
    pending: `<svg viewBox="0 0 24 24" class="icon icon-sm iso" role="img" aria-label="Criterion Pending">
    <ellipse cx="12" cy="14" rx="9" ry="4.5" stroke-width="1.5" class="iso-base"/>
    <ellipse cx="12" cy="12.5" rx="9" ry="4.5" stroke-width="1.5" class="iso-top"/>
    <line x1="3" y1="12.5" x2="3" y2="14" stroke-width="1.5"/>
    <line x1="21" y1="12.5" x2="21" y2="14" stroke-width="1.5"/>
  </svg>`,

    // Locked Criterion: Isometric flat disc with X
    locked_crit: `<svg viewBox="0 0 24 24" class="icon icon-sm locked iso" role="img" aria-label="Criterion Locked">
    <ellipse cx="12" cy="14" rx="9" ry="4.5" stroke-width="1.5" stroke-dasharray="4 3" class="iso-base" opacity="0.5"/>
    <ellipse cx="12" cy="12.5" rx="9" ry="4.5" stroke-width="1.5" stroke-dasharray="4 3" class="iso-top" opacity="0.5"/>
    <line x1="9" y1="11" x2="15" y2="14" stroke-width="1.5" opacity="0.4"/>
    <line x1="15" y1="11" x2="9" y2="14" stroke-width="1.5" opacity="0.4"/>
  </svg>`,

    // HD Badge: Isometric upward lightning/bolt with 3D depth
    hd_badge: `<svg viewBox="0 0 24 24" class="icon icon-sm iso" role="img" aria-label="High Density">
    <path d="M4 8 L12 4 L20 8 L20 16 L12 20 L4 16 Z" stroke-width="1.5" class="iso-base"/>
    <path d="M4 8 L12 4 L20 8 L12 12 Z" stroke-width="1.5" class="iso-top"/>
    <polygon points="13 6, 10 12, 13 12, 11 18, 17 11, 13 11" stroke-width="1" fill="none"/>
  </svg>`,

    // Clinician: Isometric medical cross block
    clinician: `<svg viewBox="0 0 24 24" class="icon iso" role="img" aria-label="Clinician">
    <path d="M4 8 L12 4 L20 8 L20 16 L12 20 L4 16 Z" stroke-width="1.5" class="iso-base"/>
    <path d="M4 8 L12 4 L20 8 L12 12 Z" stroke-width="1.5" class="iso-top"/>
    <path d="M12 12 L20 8 L20 16 L12 20 Z" stroke-width="1.5" class="iso-side"/>
    <line x1="12" y1="7" x2="12" y2="13" stroke-width="2.5" fill="none"/>
    <line x1="9" y1="10" x2="15" y2="10" stroke-width="2.5" fill="none"/>
  </svg>`,

    // Record: Isometric clipboard
    record: `<svg viewBox="0 0 24 24" class="icon iso" role="img" aria-label="Record Metric">
    <path d="M5 5 L13 2 L19 5 L19 19 L13 22 L5 19 Z" stroke-width="1.5" class="iso-base"/>
    <path d="M5 5 L13 2 L19 5 L13 8 Z" stroke-width="1.5" class="iso-top"/>
    <path d="M13 8 L19 5 L19 19 L13 22 Z" stroke-width="1.5" class="iso-side"/>
    <line x1="8" y1="10" x2="13" y2="12" stroke-width="1" opacity="0.5"/>
    <line x1="8" y1="13" x2="13" y2="15" stroke-width="1" opacity="0.5"/>
    <line x1="8" y1="16" x2="11" y2="17" stroke-width="1" opacity="0.5"/>
  </svg>`
};

if (typeof window !== 'undefined') window.ICONS_ISOMETRIC = ICONS_ISOMETRIC;
