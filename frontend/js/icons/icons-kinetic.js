/**
 * VECTOR Icon Set C: "Kinetic Rim-Lit"
 * Inspiration: Roger Deakins / Janusz Kamiński — Icons designed for CSS glow/halo effects.
 * Characteristics: 2px stroke, shapes optimized for drop-shadow filters, cinematic atmosphere.
 * REQUIRES: icons-kinetic.css for glow animations.
 */

const ICONS_KINETIC = {
    // Target: Double-ring crosshair with center pip — designed for outer glow
    target: `<svg viewBox="0 0 24 24" class="icon icon-lg kinetic" role="img" aria-label="Terminal Objective">
    <circle cx="12" cy="12" r="10" stroke-width="2"/>
    <circle cx="12" cy="12" r="5.5" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
    <line x1="12" y1="1" x2="12" y2="5" stroke-width="2"/>
    <line x1="12" y1="19" x2="12" y2="23" stroke-width="2"/>
    <line x1="1" y1="12" x2="5" y2="12" stroke-width="2"/>
    <line x1="19" y1="12" x2="23" y2="12" stroke-width="2"/>
  </svg>`,

    // Lock: Clean padlock silhouette — glow outlines the entire form
    lock: `<svg viewBox="0 0 24 24" class="icon kinetic" role="img" aria-label="Locked Phase">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-width="2"/>
    <circle cx="12" cy="16" r="1.5" stroke-width="1.5"/>
    <line x1="12" y1="17.5" x2="12" y2="19.5" stroke-width="1.5"/>
  </svg>`,

    // Unlock: Open shackle — the gap in the shackle catches the glow
    unlock: `<svg viewBox="0 0 24 24" class="icon kinetic" role="img" aria-label="Unlocked Phase">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1" stroke-width="2"/>
    <circle cx="12" cy="16" r="1.5" stroke-width="1.5"/>
    <line x1="12" y1="17.5" x2="12" y2="19.5" stroke-width="1.5"/>
  </svg>`,

    // Active: Pulse/heartbeat line — designed for pulsing glow animation
    active: `<svg viewBox="0 0 24 24" class="icon kinetic" role="img" aria-label="Active Phase">
    <polyline points="1 12, 5 12, 7.5 6, 10 18, 12.5 6, 15 18, 17.5 12, 23 12" stroke-width="2"/>
  </svg>`,

    // Check: Circle + checkmark — clean shape, glow wraps around circle
    check: `<svg viewBox="0 0 24 24" class="icon icon-sm met kinetic" role="img" aria-label="Criterion Met">
    <circle cx="12" cy="12" r="10" stroke-width="2"/>
    <polyline points="7 12.5, 10.5 16, 17 9" stroke-width="2"/>
  </svg>`,

    // Pending: Circle with clock hands — suggests "waiting" in the glow
    pending: `<svg viewBox="0 0 24 24" class="icon icon-sm kinetic" role="img" aria-label="Criterion Pending">
    <circle cx="12" cy="12" r="10" stroke-width="2"/>
    <polyline points="12 7, 12 12, 15.5 14" stroke-width="2"/>
  </svg>`,

    // Locked Criterion: Dashed circle — broken glow effect
    locked_crit: `<svg viewBox="0 0 24 24" class="icon icon-sm locked kinetic" role="img" aria-label="Criterion Locked">
    <circle cx="12" cy="12" r="10" stroke-dasharray="4 3" stroke-width="2"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke-width="2" opacity="0.4"/>
  </svg>`,

    // HD Badge: Lightning bolt — natural shape for "electric" glow
    hd_badge: `<svg viewBox="0 0 24 24" class="icon icon-sm kinetic" role="img" aria-label="High Density">
    <polygon points="13 2, 3 14, 12 14, 11 22, 21 10, 12 10" stroke-width="2" fill="none"/>
  </svg>`,

    // Clinician: Shield with cross — medical authority + protective glow
    clinician: `<svg viewBox="0 0 24 24" class="icon kinetic" role="img" aria-label="Clinician">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke-width="2"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke-width="2"/>
  </svg>`,

    // Record: Pen nib — clean, simple, glows well
    record: `<svg viewBox="0 0 24 24" class="icon kinetic" role="img" aria-label="Record Metric">
    <path d="M12 20h9" stroke-width="2"/>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke-width="2"/>
  </svg>`
};

if (typeof window !== 'undefined') window.ICONS_KINETIC = ICONS_KINETIC;
