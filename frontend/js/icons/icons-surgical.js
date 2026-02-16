/**
 * VECTOR Icon Set A: "Surgical Mechanic"
 * Inspiration: Jing Zhang — Thin monolines, internal detail, cutaway/blueprint aesthetic.
 * Characteristics: 1.5px stroke, no fill, internal mechanism lines.
 */

const ICONS_SURGICAL = {
    // Target: Technical sight with measurement ticks and concentric rings
    target: `<svg viewBox="0 0 24 24" class="icon icon-lg" role="img" aria-label="Terminal Objective">
    <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="6" stroke-width="1" opacity="0.6"/>
    <circle cx="12" cy="12" r="2" stroke-width="1" opacity="0.4"/>
    <line x1="12" y1="1" x2="12" y2="4" stroke-width="1.5"/>
    <line x1="12" y1="20" x2="12" y2="23" stroke-width="1.5"/>
    <line x1="1" y1="12" x2="4" y2="12" stroke-width="1.5"/>
    <line x1="20" y1="12" x2="23" y2="12" stroke-width="1.5"/>
    <line x1="12" y1="6" x2="12" y2="7" stroke-width="0.75" opacity="0.4"/>
    <line x1="12" y1="17" x2="12" y2="18" stroke-width="0.75" opacity="0.4"/>
    <line x1="6" y1="12" x2="7" y2="12" stroke-width="0.75" opacity="0.4"/>
    <line x1="17" y1="12" x2="18" y2="12" stroke-width="0.75" opacity="0.4"/>
  </svg>`,

    // Lock: Padlock with exposed internal tumbler pins
    lock: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Locked Phase">
    <rect x="4" y="11" width="16" height="10" rx="1.5" stroke-width="1.5"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke-width="1.5"/>
    <line x1="8" y1="14" x2="10" y2="14" stroke-width="0.75" opacity="0.5"/>
    <line x1="8" y1="16" x2="11" y2="16" stroke-width="0.75" opacity="0.5"/>
    <line x1="8" y1="18" x2="9.5" y2="18" stroke-width="0.75" opacity="0.5"/>
    <circle cx="14" cy="16" r="1.5" stroke-width="1"/>
    <line x1="14" y1="17.5" x2="14" y2="19" stroke-width="1"/>
  </svg>`,

    // Unlock: Open shackle with exposed pin mechanism
    unlock: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Unlocked Phase">
    <rect x="4" y="11" width="16" height="10" rx="1.5" stroke-width="1.5"/>
    <path d="M8 11V7a4 4 0 0 1 7.874-.894" stroke-width="1.5"/>
    <line x1="8" y1="14" x2="10" y2="14" stroke-width="0.75" opacity="0.5"/>
    <line x1="8" y1="16" x2="11" y2="16" stroke-width="0.75" opacity="0.5"/>
    <circle cx="14" cy="16" r="1.5" stroke-width="1"/>
    <line x1="14" y1="17.5" x2="14" y2="19" stroke-width="1"/>
  </svg>`,

    // Active: ECG pulse line with internal grid marks
    active: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Active Phase">
    <line x1="1" y1="12" x2="5" y2="12" stroke-width="1.5"/>
    <polyline points="5 12, 8 12, 9.5 5, 11 19, 12.5 8, 14 15, 15.5 12, 19 12" stroke-width="1.5"/>
    <line x1="19" y1="12" x2="23" y2="12" stroke-width="1.5"/>
    <line x1="3" y1="8" x2="3" y2="8.5" stroke-width="0.5" opacity="0.3"/>
    <line x1="3" y1="16" x2="3" y2="16.5" stroke-width="0.5" opacity="0.3"/>
    <line x1="21" y1="8" x2="21" y2="8.5" stroke-width="0.5" opacity="0.3"/>
    <line x1="21" y1="16" x2="21" y2="16.5" stroke-width="0.5" opacity="0.3"/>
  </svg>`,

    // Check: Circle with internal checkmark and measurement hash marks
    check: `<svg viewBox="0 0 24 24" class="icon icon-sm met" role="img" aria-label="Criterion Met">
    <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
    <polyline points="8 12.5, 10.5 15, 16 9" stroke-width="1.5"/>
    <line x1="12" y1="2" x2="12" y2="3.5" stroke-width="0.75" opacity="0.3"/>
    <line x1="12" y1="20.5" x2="12" y2="22" stroke-width="0.75" opacity="0.3"/>
    <line x1="2" y1="12" x2="3.5" y2="12" stroke-width="0.75" opacity="0.3"/>
    <line x1="20.5" y1="12" x2="22" y2="12" stroke-width="0.75" opacity="0.3"/>
  </svg>`,

    // Pending: Circle with internal crosshair (awaiting data)
    pending: `<svg viewBox="0 0 24 24" class="icon icon-sm" role="img" aria-label="Criterion Pending">
    <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke-width="0.75" opacity="0.3"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke-width="0.75" opacity="0.3"/>
  </svg>`,

    // Locked Criterion: Dashed circle with internal hash pattern
    locked_crit: `<svg viewBox="0 0 24 24" class="icon icon-sm locked" role="img" aria-label="Criterion Locked">
    <circle cx="12" cy="12" r="10" stroke-dasharray="3 3" stroke-width="1.5"/>
    <line x1="9" y1="9" x2="15" y2="15" stroke-width="0.75" opacity="0.25"/>
    <line x1="15" y1="9" x2="9" y2="15" stroke-width="0.75" opacity="0.25"/>
  </svg>`,

    // HD Badge: Lightning bolt with circuit trace detail
    hd_badge: `<svg viewBox="0 0 24 24" class="icon icon-sm" role="img" aria-label="High Density">
    <polygon points="13 2, 3 14, 12 14, 11 22, 21 10, 12 10" stroke-width="1.5" fill="none"/>
    <line x1="10" y1="10" x2="7" y2="10" stroke-width="0.75" opacity="0.4"/>
    <line x1="14" y1="14" x2="17" y2="14" stroke-width="0.75" opacity="0.4"/>
  </svg>`,

    // Clinician: Stethoscope with internal detail
    clinician: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Clinician">
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" stroke-width="1.5"/>
    <circle cx="4" cy="17" r="2" stroke-width="1.5"/>
    <circle cx="20" cy="17" r="2" stroke-width="1.5"/>
    <line x1="4" y1="19" x2="4" y2="21" stroke-width="1"/>
    <circle cx="4" cy="22" r="0.75" stroke-width="0.75" opacity="0.5"/>
    <line x1="12" y1="4" x2="12" y2="5" stroke-width="0.5" opacity="0.3"/>
  </svg>`,

    // Record: Pen/stylus with measurement line
    record: `<svg viewBox="0 0 24 24" class="icon" role="img" aria-label="Record Metric">
    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke-width="1.5"/>
    <line x1="15" y1="5" x2="19" y2="9" stroke-width="1"/>
    <line x1="3" y1="19" x2="5" y2="21" stroke-width="0.75" opacity="0.4"/>
    <line x1="9" y1="15" x2="10" y2="15" stroke-width="0.5" opacity="0.3"/>
  </svg>`
};

// Make available globally
if (typeof window !== 'undefined') window.ICONS_SURGICAL = ICONS_SURGICAL;
