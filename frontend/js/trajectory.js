/**
 * PROJECT VECTOR — TRAJECTORY Dashboard Logic
 * Calgary Strength & Physio
 *
 * Renders the phase-locked rehabilitation journey from live API data.
 * Pure vanilla JS — no dependencies.
 */

const API_BASE_URL = window.location.origin;

// Extract Client ID from URL (?client=ID) or fallback to demo
const urlParams = new URLSearchParams(window.location.search);
const CLIENT_ID = urlParams.get('client') || "CLT_DEMO_01";

// =============================================================================
// ICONS (SVG) — "Kinetic Rim-Lit" Style (Deakins/Kamiński-inspired)
// Loaded from external module for easy style switching
// =============================================================================

// Kinetic Rim-Lit icon set with glow-optimized shapes
const ICONS = {
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
  </svg>`
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
        <a href="https://doi.org/${client.researchDoi}" target="_blank" rel="noopener noreferrer" class="doi-link" aria-label="View research paper on DOI.org">
          DOI: ${client.researchDoi}
        </a>
        <button class="view-source-btn" onclick="openProtocolModal('${client.protocolId || 'PAT_ACL_R_01'}')">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          View Source Protocol
        </button>
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
      <div class="phase-header" onclick="togglePhase(${index})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();togglePhase(${index});}" tabindex="0" role="button" aria-expanded="false">
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
    <header class="global-nav">
      <nav>
        <a href="index.html" class="nav-link active" aria-current="page">Dashboard</a>
        <a href="clinician.html" class="nav-link">Clinician Portal</a>
        <a href="icon-preview.html" class="nav-link">Icon Preview</a>
      </nav>
    </header>
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
  /* --- Protocol Viewer Logic --- */

  function renderMarkdown(text) {
    if (!text) return "";
    return text
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
      .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\n<ul>/gim, '')
      .replace(/^---$/gim, '<hr>')
      .replace(/\n\n/gim, '<br><br>');
  }

  // --- Link Safety & Reporting ---

  // Global handler for external links in markdown
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href.startsWith('http')) {
      if (!navigator.onLine) {
        e.preventDefault();
        alert("⚠️ OFFLINE MODE\n\nExternal resources cannot be accessed while offline. Please use the Local Copy.");
        return;
      }
      // Security best practice: open in new tab with noopener
      e.target.target = "_blank";
      e.target.rel = "noopener noreferrer";
    }
  });

  window.reportProtocolIssue = function () {
    const protocolId = document.querySelector('.modal-content').dataset.currentProtocol;
    const issue = prompt("Describe the issue (e.g., 'Broken link', 'Outdated info'):");
    if (issue) {
      // In a real app, this would POST to /api/flag
      console.log(`[AUDIT] FLAGGED_PROTOCOL: ${protocolId} | REASON: ${issue}`);
      alert("✅ Issue reported. The system admin will review this protocol.");
    }
  };

  window.openProtocolModal = async function (protocolId) {
    const modal = document.getElementById("protocol-modal");
    const content = document.getElementById("protocol-content");
    const loading = document.getElementById("protocol-loading");
    const footer = document.querySelector(".modal-footer");

    // Store ID for reporting
    if (document.querySelector('.modal-content')) {
      document.querySelector('.modal-content').dataset.currentProtocol = protocolId;
    }

    // Add Report Button if missing
    if (footer && !footer.querySelector('.report-btn')) {
      const reportBtn = document.createElement("button");
      reportBtn.className = "view-source-btn report-btn";
      reportBtn.innerHTML = "🚩 Report Issue";
      reportBtn.style.marginRight = "auto"; // Push to left
      reportBtn.style.border = "1px solid var(--accent-danger)";
      reportBtn.style.color = "var(--accent-danger)";
      reportBtn.onclick = window.reportProtocolIssue;
      footer.prepend(reportBtn);
    }

    if (modal) {
      modal.hidden = false;
      setTimeout(() => modal.classList.add("active"), 10);
    }

    if (content) content.innerHTML = "";
    if (loading) loading.style.display = "block";

    try {
      // Use API_BASE_URL if defined, else relative path
      const baseUrl = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : '';
      const response = await fetch(`${baseUrl}/api/protocol/${protocolId}`);
      if (!response.ok) throw new Error("Protocol not found");

      const data = await response.json();
      if (loading) loading.style.display = "none";
      if (content) content.innerHTML = renderMarkdown(data.content);
    } catch (error) {
      console.error("Protocol Error:", error);
      if (loading) loading.style.display = "none";
      if (content) content.innerHTML = `<div class="error-state">
        <strong>Error Loading Document</strong><br>
        Could not retrieve the protocol from secure storage.<br>
        ${error.message}
      </div>`;
    }
  };

  window.closeProtocolModal = function () {
    const modal = document.getElementById("protocol-modal");
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.hidden = true;
      }, 300);
    }
  };

  // Close on backdrop click
  const modalEl = document.getElementById("protocol-modal");
  if (modalEl) {
    modalEl.addEventListener("click", (e) => {
      if (e.target.id === "protocol-modal") {
        window.closeProtocolModal();
      }
    });
  }
});
