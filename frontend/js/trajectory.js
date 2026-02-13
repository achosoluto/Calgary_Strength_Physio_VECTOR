/**
 * PROJECT VECTOR — TRAJECTORY Dashboard Logic
 * Calgary Strength & Physio
 *
 * Renders the phase-locked rehabilitation journey from live API data.
 * Pure vanilla JS — no dependencies.
 */

const API_BASE_URL = window.location.origin; // Dynamically use the current host
const CLIENT_ID = "CLT_DEMO_01"; // Default for dev

// =============================================================================
// ICONS (SVG) — "Industrial/Kinetic" Theme
// =============================================================================
const ICONS = {
  // Target/Pike: A sharp radar crosshair
  target: `<svg viewBox="0 0 24 24" class="icon icon-lg"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>`,

  // Lock: Sturdy padlock
  lock: `<svg viewBox="0 0 24 24" class="icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,

  // Unlock: Open shackle
  unlock: `<svg viewBox="0 0 24 24" class="icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,

  // Active: Pulse/Activity line
  active: `<svg viewBox="0 0 24 24" class="icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,

  // Check: Circle with checkmark (Met)
  check: `<svg viewBox="0 0 24 24" class="icon icon-sm met"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,

  // Pending: Empty circle
  pending: `<svg viewBox="0 0 24 24" class="icon icon-sm"><circle cx="12" cy="12" r="10"></circle></svg>`,

  // Locked Criterion: Dashed circle
  locked_crit: `<svg viewBox="0 0 24 24" class="icon icon-sm locked"><circle cx="12" cy="12" r="10" stroke-dasharray="4 4"></circle></svg>`
};

// =============================================================================
// API FETCH
// =============================================================================

async function fetchJourney(clientId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/client/${clientId}/journey`);
    if (!response.ok) throw new Error("Failed to load journey data");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    // Fallback to error UI
    document.getElementById("app").innerHTML = `<div class="error-state">System Offline. Check Connection.</div>`;
    return null;
  }
}

// =============================================================================
// RENDER FUNCTIONS
// =============================================================================

function renderPike(client) {
  return `
    <div class="pike">
      <div class="pike-icon">${ICONS.target}</div>
      <div class="pike-label">THE PIKE — TERMINAL OBJECTIVE</div>
      <div class="pike-goal">${client.terminalGoal}</div>
      <div class="pike-sport">${client.pathology} → ${client.sport}</div>
      <div class="pike-source">
        Protocol Source: ${client.researchSource} <br>
        <span class="doi">DOI: ${client.researchDoi}</span>
      </div>
    </div>
  `;
}

function renderVectorLine(status) {
  const cls = status === "completed" ? "completed" : status === "locked" ? "locked" : "";
  return `<div class="vector-line ${cls}"><div class="line"></div></div>`;
}

function renderCriterion(c, isLocked) {
  let statusHTML, valueCls;

  if (isLocked) {
    statusHTML = ICONS.locked_crit;
    valueCls = "locked";
  } else if (c.met) {
    statusHTML = ICONS.check;
    valueCls = "met";
  } else {
    statusHTML = ICONS.pending;
    valueCls = "pending";
  }

  const displayValue = isLocked ? "--" : (c.current || "--");
  return `
    <div class="criterion">
      <span class="criterion-status">${statusHTML}</span>
      <span class="criterion-label">${c.label}</span>
      <span class="criterion-value ${valueCls}">${displayValue}</span>
    </div>
  `;
}

function renderProgramming(slots) {
  if (!slots || slots.length === 0) return `<div class="slot-detail">No programming assigned.</div>`;

  return slots.map(s => `
    <div class="programming-slot">
      <span class="slot-type">${s.type}</span>
      <div>
        <span class="slot-exercise">${s.exercise}${s.hd ? `<span class="slot-hd-badge">${s.hd}</span>` : ""}</span>
        <div class="slot-detail">
            ${s.intent ? `<div class="slot-intent"><strong>Intent:</strong> ${s.intent}</div>` : ""}
            ${s.rationale ? `<div class="slot-rationale"><strong>Audit Rationale:</strong> ${s.rationale}</div>` : ""}
            <div class="slot-guidance">${s.detail}</div>
        </div>
      </div>
    </div>
  `).join("");
}

function renderPhaseCard(phase, index) {
  const isLocked = phase.status === "locked";
  const isActive = phase.status === "active";
  const isCompleted = phase.status === "completed";

  let iconHTML, badgeClass, badgeText;

  if (isCompleted) {
    iconHTML = ICONS.check;
    badgeClass = "completed-badge";
    badgeText = "Complete";
  } else if (isActive) {
    iconHTML = ICONS.active;
    badgeClass = "active-badge";
    badgeText = "Active";
  } else {
    iconHTML = ICONS.lock;
    badgeClass = "locked-badge";
    badgeText = "Locked";
  }

  const metCount = phase.criteria ? phase.criteria.filter(c => c.met).length : 0;
  const totalCount = phase.criteria ? phase.criteria.length : 0;

  return `
    <div class="phase-card ${phase.status}" data-phase="${index}" id="phase-${index}">
      <div class="phase-header" onclick="togglePhase(${index})">
        <span class="phase-icon">${iconHTML}</span>
        <span class="phase-title">${phase.name}</span>
        <span class="phase-badge ${badgeClass}">${isActive ? `${metCount}/${totalCount}` : badgeText}</span>
      </div>
      <div class="phase-body">
        <div class="phase-description">${phase.description} <span style="color:var(--text-muted);">— ${phase.typicalDuration}</span></div>
        <div class="criteria-section-title">Exit Criteria — The Gate</div>
        ${phase.criteria ? phase.criteria.map(c => renderCriterion(c, isLocked)).join("") : ""}
        ${isActive ? `
          <div class="programming-section">
            <div class="criteria-section-title">Your Programming</div>
            ${renderProgramming(phase.programming)}
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function renderFooter(client) {
  return `
    <div class="footer">
      <span>Started: ${formatDate(client.startDate)}</span>
      <span>Next Session: ${formatDate(client.nextSession)}</span>
    </div>
  `;
}

function formatDate(dateStr) {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

// =============================================================================
// INTERACTION
// =============================================================================

function togglePhase(index) {
  const card = document.getElementById(`phase-${index}`);
  if (!card || card.classList.contains("active")) return;
  card.classList.toggle("expanded");
}

function renderDashboard(data) {
  const app = document.getElementById("app");
  if (!data) return;

  const { client, phases } = data; // Assuming API returns { client: {}, phases: [] }

  // Reverse phases so terminal goal (Pike) is at top, Phase 1 at bottom
  // We need to clone the array to avoid mutating the original data reference
  const reversedPhases = [...phases].reverse();
  const totalPhases = phases.length;

  let html = `
    <div class="header">
      <div class="header-brand">
        <h1>VECTOR</h1>
        <div class="subtitle">Trajectory Dashboard</div>
      </div>
      <div class="header-client">
        <div class="client-name">${client.name}</div>
        <div class="client-meta">${client.pathology} — ${client.sport}</div>
      </div>
    </div>
    ${renderPike(client)}
  `;

  reversedPhases.forEach((phase, i) => {
    // Determine the original 0-indexed position
    const originalIndex = totalPhases - 1 - i;
    html += renderVectorLine(phase.status);
    html += renderPhaseCard(phase, originalIndex);
  });

  html += renderFooter(client);
  app.innerHTML = html;
}

// =============================================================================
// INIT
// =============================================================================

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Initializing VECTOR Dashboard...");
  const data = await fetchJourney(CLIENT_ID);
  if (data) {
    console.log("Journey Data Loaded:", data);
    renderDashboard(data);
  }
});
