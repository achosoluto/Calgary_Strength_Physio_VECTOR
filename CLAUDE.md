# CLAUDE.md — Project VECTOR: AI Assistant Guide

**Project:** Calgary Strength & Physio — Sovereign Exercise Engine
**Last Updated:** 2026-03-01
**Status:** Phase 3 — Deployment & Pilot Testing Active

---

## 1. Project Overview

Project VECTOR is a **metric-driven rehabilitation programming system** for Calgary Strength & Physio. It replaces time-based clinical progression with **data-gated phases** — clients advance only when objective measurement criteria are met.

### Three Core Components

| Component | Role | Location |
|:----------|:-----|:---------|
| **V-CORE** | Logic Engine | `database/schema/v_core.sql` |
| **BASE** | Living Protocol Library | `database/seeds/base_seed.json` |
| **TRAJECTORY** | Patient-Facing Dashboard | `frontend/` |

### Key Terminology

- **The Pike** — A client's terminal goal (e.g., "Return to 315lb Squat")
- **Phase Lock/Unlock** — Phases are gated behind objective exit criteria
- **High-Density (HD) Options** — 2026 clinical techniques: BFR, VBT, HSR, NMES
- **Exit Criteria** — Specific metric thresholds that unlock the next phase
- **Intent-Based Programming** — Exercises coded by purpose (e.g., "Quad Hypertrophy"), not specific equipment

---

## 2. Repository Structure

```
Calgary_Strength_Physio_VECTOR/
├── CLAUDE.md                          # This file
├── README.md                          # Project overview
├── HANDOVER.md                        # Deployment handover notes
├── IMPLEMENTATION_STATUS_REPORT.md    # Detailed component status
├── IMPLEMENTATION_STRATEGY.md         # Strategic architecture
├── DEPLOYMENT_PLAN.md                 # Production deployment plan
├── RESEARCH_LOG.md                    # Protocol update tracking
├── render.yaml                        # Render.com deployment config
├── requirements.txt                   # Root-level Python deps (for Render)
├── run_dev_server.py                  # Local dev server (localhost ONLY)
│
├── backend/
│   ├── main.py                        # FastAPI application (all routes + middleware)
│   └── requirements.txt               # Backend Python deps
│
├── database/
│   ├── schema/
│   │   └── v_core.sql                 # Full relational schema (305 lines)
│   ├── seeds/
│   │   └── base_seed.json             # Top 5 injury protocol data
│   ├── protocols/
│   │   ├── PATH_ACL_01.md             # Protocol Vault: local offline documents
│   │   └── icons/                     # Icon assets
│   ├── data/                          # SQLite DB location (git-ignored)
│   └── logs/                          # Audit logs (git-ignored)
│
├── frontend/
│   ├── index.html                     # App entry point / nav hub
│   ├── trajectory.html                # TRAJECTORY patient dashboard
│   ├── clinician.html                 # Clinician metric recording portal
│   ├── icon-preview.html              # Icon design preview page
│   ├── css/
│   │   ├── trajectory.css             # Main dashboard styles
│   │   └── icons/                     # Icon CSS assets
│   └── js/
│       ├── trajectory.js              # Dashboard interaction logic (240 lines)
│       ├── clinician.js               # Clinician portal logic
│       └── icons/                     # Icon JS assets
│
├── scripts/
│   ├── deploy_init.py                 # One-shot DB init + seed (used in CI/deploy)
│   └── load_base.py                   # Seed data loader (idempotent, 173 lines)
│
└── docs/
    ├── ARCHITECTURAL_PATTERNS.md      # Critical design patterns (read before coding)
    ├── SECURITY_ARCHITECTURE.md       # Offline-first security design
    ├── CLINICAL_AUDITABILITY_SPEC.md  # Audit trail requirements
    ├── PHASE_1_SECURITY_IMPLEMENTATION.md
    ├── trajectory_view.md             # UX wireframe & spec
    ├── janeapp_integration.md         # JaneApp webhook specification
    ├── ICON_DESIGN_PLAN.md
    └── ICON_IMPLEMENTATION_SUMMARY.md
```

---

## 3. Tech Stack

| Layer | Technology | Version |
|:------|:-----------|:--------|
| Backend | Python + FastAPI | 3.11+ / latest |
| ASGI Server (dev) | Uvicorn | latest |
| ASGI Server (prod) | Gunicorn + Uvicorn workers | latest |
| Database | SQLite (WAL mode) | built-in |
| Frontend | Vanilla JavaScript (ES6+) | no build step |
| CSS | Pure CSS3 with CSS Grid | no preprocessor |
| Deployment | Render.com | `render.yaml` |

**Zero external frontend dependencies** — no npm, no bundler, no CDN imports in production.

---

## 4. Local Development

### Prerequisites
- Python 3.11+
- Git

### Setup

```bash
# 1. Clone and enter project
git clone https://github.com/achosoluto/Calgary_Strength_Physio_VECTOR.git
cd Calgary_Strength_Physio_VECTOR

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r backend/requirements.txt

# 4. Initialize database and seed data (idempotent - safe to re-run)
python3 scripts/deploy_init.py

# 5. Start development server (localhost ONLY)
python3 run_dev_server.py
```

Available pages at `http://localhost:8000/`:
- `/` or `/index.html` — Navigation hub
- `/trajectory.html` — Patient TRAJECTORY dashboard
- `/clinician.html` — Clinician metric recording portal
- `/icon-preview.html` — Icon design preview

### Re-seeding the Database

```bash
# Reset and reload all protocol data
python3 scripts/load_base.py
```

### Demo Data

The seed script creates a single demo client for testing:
- **Client ID:** `CLT_DEMO_01`
- **Name:** Marcus D.
- **Sport:** Powerlifting
- **Terminal Goal:** Return to 315lb Squat
- **Pathology:** ACL Reconstruction (PATH_ACL_01)
- **Journey ID:** `JRN_DEMO_ACL`
- **Current Phase:** Phase 1 — Protection & Activation (3/4 criteria met)

---

## 5. API Endpoints

All routes defined in `backend/main.py`.

### GET `/api/client/{client_id}/journey`
Returns the full rehabilitation journey for a client.

**Response shape:**
```json
{
  "client": {
    "name": "Marcus D.",
    "sport": "Powerlifting",
    "terminalGoal": "Return to 315lb Squat",
    "pathology": "ACL Reconstruction",
    "protocolId": "PATH_ACL_01",
    "researchSource": "Aspetar Clinical Guideline 2026 / Delaware Protocol",
    "researchDoi": "10.1136/bjsports-2022-106543",
    "startDate": "2026-01-15",
    "currentPhaseIndex": 0
  },
  "phases": [
    {
      "name": "Phase 1: Protection & Activation",
      "status": "active",
      "description": "...",
      "typicalDuration": "Weeks 0-2",
      "criteria": [
        { "label": "knee_extension = 0 degrees", "target": "= 0", "current": "3 degrees", "met": false }
      ],
      "programming": [
        { "type": "Quad Activation", "exercise": "Quad Set", "hd": "Quad Set with NMES", "intent": "...", "rationale": "...", "detail": "10 reps x 10s hold, 3x/day" }
      ]
    }
  ]
}
```

### POST `/api/metric/record`
Records a metric measurement for a client's active phase.

**Request body:**
```json
{
  "client_id": "CLT_DEMO_01",
  "metric_name": "knee_extension",
  "value": "2",
  "unit": "degrees",
  "recorded_at": "2026-02-14T10:30:00"  // optional, defaults to now
}
```

### GET `/api/protocol/{protocol_id}`
Serves a local Markdown protocol document from the Protocol Vault (`database/protocols/`).
Path traversal is prevented — only filenames (no slashes) are accepted.

### POST `/webhooks/janeapp`
Webhook endpoint for JaneApp EHR integration. Validates `X-Jane-Signature` HMAC header and ingests treatment note metrics automatically. Set `JANEAPP_WEBHOOK_SECRET` environment variable for production.

### Static Files
Frontend files are served from the `frontend/` directory at the root path `/`.

---

## 6. Database Schema

Defined in `database/schema/v_core.sql`. SQLite with WAL mode and foreign keys enforced.

### Core Protocol Tables (V-CORE Engine)

| Table | Purpose | Key Fields |
|:------|:--------|:-----------|
| `pathologies` | Injury classification | `id`, `osics_code`, `research_doi`, `is_active`, `version` |
| `phases` | Sequential progression stages | `pathology_id`, `order_index`, `typical_duration` |
| `exit_criteria` | Phase gate metrics | `phase_id`, `metric_name`, `target_operator`, `target_value` |
| `programming_slots` | Intent-based exercises | `phase_id`, `slot_type`, `standard_exercise`, `high_density_option`, `intent_description` |

### Client Journey Tables

| Table | Purpose | Key Fields |
|:------|:--------|:-----------|
| `clients` | Client registry | `id`, `display_name`, `terminal_goal`, `sport_activity` |
| `client_journeys` | Active rehab tracks | `client_id`, `pathology_id`, `current_phase_id`, `status` |
| `phase_completions` | Phase transition audit log | `journey_id`, `phase_id`, `criteria_met`, `clinician_sign_off` |
| `metric_recordings` | Individual measurements | `journey_id`, `criterion_id`, `metric_name`, `recorded_value` |

### Utility Views

| View | Purpose |
|:-----|:--------|
| `v_active_protocols` | All active pathologies with phase counts |
| `v_client_dashboard` | Active clients with their current phase |
| `v_criteria_progress` | Per-journey exit criteria progress tracker |

### ID Conventions

- Pathologies: `PATH_ACL_01`, `PATH_RC_01`
- Phases: `PHASE_ACL_01_P1`, `PHASE_ACL_01_P2`
- Exit Criteria: `EC_ACL_01_P1_01`
- Programming Slots: `SLOT_ACL_01_P1_01`
- Clients: `CLT_001`, `CLT_DEMO_01`
- Journeys: `JRN_001_ACL`
- Metric Recordings: `REC_{timestamp}`

### Exit Criteria Operators

The `check_criteria_met()` function in `backend/main.py` supports: `=`, `>`, `>=`, `<`, `<=`
It tries numeric comparison first, then falls back to string comparison (case-insensitive).

---

## 7. Supported Injury Protocols (BASE Library)

| Injury | OSICS Code | Phases | Slots | Exit Criteria |
|:-------|:-----------|:-------|:------|:--------------|
| ACL Reconstruction | KJXX | 3 | 8 | 10 |
| Rotator Cuff Repair | SSXX | 2 | 4 | 4 |
| Lumbar Disc Herniation | Lxx | 2 | 5 | 4 |
| Achilles Tendinopathy | TAxx | 2 | 2 | 4 |
| Lateral Ankle Sprain | Axx | 2 | 4 | 4 |

**High-Density Features Integrated:** BFR, VBT, HSR, NMES, CFT, DNS

---

## 8. Deployment (Render.com)

Configured via `render.yaml`:

```yaml
buildCommand: pip install -r requirements.txt && python scripts/deploy_init.py
startCommand: gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app --bind 0.0.0.0:$PORT
```

**Important:** SQLite requires a persistent Render Disk mounted at `/database/data` — otherwise `deploy_init.py` resets the database on every deploy. The `PYTHON_VERSION` is locked to `3.11.0`.

**Environment Variables:**
- `JANEAPP_WEBHOOK_SECRET` — HMAC secret for JaneApp webhook signature verification
- `VECTOR_ENV` — Set to `production` to prevent `run_dev_server.py` from starting
- `PYTHON_VERSION` — `3.11.0` (set in `render.yaml`)

---

## 9. Security Architecture

This system handles Protected Health Information (PHI) — security is non-negotiable.

### Core Principle: Offline-First, Zero-Trust

- Backend binds to `127.0.0.1:8000` (localhost only) in development
- No external CDN or API calls — all assets are self-hosted
- All SQL queries use parameterized statements (no string interpolation)
- CORS restricted to `localhost:8000` and `127.0.0.1:8000`
- Audit log written to `database/logs/audit.log` for all `/api/client/` and `/api/metric/` access
- Path traversal prevention on the `/api/protocol/` endpoint

### Current Security Gaps (Phase 3 TODO)

- No authentication/authorization (MVP only)
- No HTTPS (HTTP only in current deployment)
- CORS allows all origins in older config — verify current state before production
- No database encryption at rest (SQLCipher planned)
- No rate limiting

### Content-Security-Policy

The `index.html` includes CSP headers blocking all external connections. When editing HTML files, maintain these headers.

---

## 10. Mandatory Agent Rules (From `docs/ARCHITECTURAL_PATTERNS.md`)

These rules are **non-negotiable** for any developer or AI agent working on this codebase:

### Rule 1: No Dead Links Policy
- **Never** generate a user-facing hyperlink to an external clinical resource (DOI, PDF, video) without verifying a local fallback exists in `database/protocols/`
- If a DOI fails to resolve, report it immediately — do not hallucinate a working URL
- Mark unverified external links as `[Unverified/Network Dependent]`

### Rule 2: Path Safety Check
- **Never** execute shell commands (npm, npx, pip) without first verifying the CWD does not contain special characters (parentheses, spaces, non-ASCII)
- If CWD is unsafe, warn the user explicitly

### Rule 3: Offline-First Mindset
- Assume `navigator.onLine === false` by default
- Every UI data fetch **must** have a `try/catch` that handles network failure gracefully (show toast/warning, not console error)
- Never introduce dependencies on external services

### Rule 4: Clinical Integrity (Triangulated Reference Pattern)
Every clinical reference must be stored in three layers:
1. **Immutable Metadata** — Full citation text in the database (`research_source` field)
2. **Resolvable Object** — DOI URL (`research_doi` field + UI hyperlink)
3. **Local Artifact** — Markdown copy in `database/protocols/{id}.md`

---

## 11. Frontend Conventions

- **Pure Vanilla JS** — No frameworks, no npm, no build step required
- **ES6+** syntax (async/await, template literals, destructuring)
- `CLIENT_ID` is currently hardcoded as `"CLT_DEMO_01"` in `trajectory.js` — Phase 3 will add URL param support
- Industrial/Kinetic design theme: dark background, vibrant accent colors, glassmorphism effects
- All form inputs require unique IDs and ARIA labels (accessibility requirement)
- Focus states must maintain high-contrast outlines for keyboard navigation
- API error states must display meaningful UI feedback (not raw console errors)

---

## 12. Python/Backend Conventions

- Use `conn.row_factory = sqlite3.Row` for dict-like row access
- Always close DB connections explicitly (`conn.close()`)
- Use `Path` objects from `pathlib` — not string concatenation — for file paths
- Audit log sensitive data access via `audit_logger.info()`
- The `check_criteria_met(operator, target_val, current_val)` function in `main.py` handles all exit criteria evaluation — extend it if new operators are needed

---

## 13. Testing

### Current State (Manual Only)
There are no automated tests. All verification has been manual.

**Manually verified:**
- Database schema creation and indexing
- Seed data loading (idempotent)
- `/api/client/{client_id}/journey` returns valid JSON
- Frontend renders phases with correct lock/active/completed states
- Exit criteria evaluation (all 5 operators)
- Metric recording via POST

### Planned Tests (Phase 3)
- Unit tests for `check_criteria_met()` logic
- Integration tests for all API endpoints
- End-to-end tests for dashboard rendering
- Performance benchmarks

To run the server for manual testing:
```bash
python3 run_dev_server.py
# Then open: http://localhost:8000/trajectory.html
```

---

## 14. Git Workflow

- Primary branch: `master`
- Feature development: use descriptive branch names
- The SQLite database (`database/data/*.db`) is git-ignored
- Audit logs (`database/logs/`) are git-ignored
- Python caches (`__pycache__/`, `*.pyc`, `venv/`) are git-ignored

---

## 15. Roadmap

### Active (Phase 3)
- Production deployment to Render.com with persistent disk
- Pilot testing with 5 real clients
- JaneApp webhook integration (staging test pending)

### Upcoming
- Clinician metric input UI (simple form with POST to `/api/metric/record`)
- URL parameter support for client ID (`/trajectory.html?client=CLT_001`)
- Historical metrics graph view
- Mobile responsive breakpoints
- Authentication/authorization (OAuth2 or JWT)
- Database encryption at rest (SQLCipher)

### Future Expansion
- Expand from Top 5 to Top 25 injury protocols
- Electron desktop app packaging for air-gapped clinic use
- PWA (Progressive Web App) support

---

## 16. Known Issues & Limitations

1. **`nextSession` is hardcoded** in `backend/main.py:206` — returns `"2026-02-14"` always
2. **Single demo client** — no multi-client UI navigation yet
3. **No auth** — any user who accesses the server can see all client data
4. **Google Fonts CDN** may still be referenced in `trajectory.css` — should be replaced with self-hosted fonts per `docs/SECURITY_ARCHITECTURE.md`
5. **JaneApp `hmac.new()`** in `backend/main.py:287` — should be `hmac.new()` called as `hmac.new(key, msg, digestmod)` — verify this is correct Python usage

---

*CLAUDE.md maintained for AI assistants working on Project VECTOR — Calgary Strength & Physio © 2026*
