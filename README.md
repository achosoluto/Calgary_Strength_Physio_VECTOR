# Project VECTOR

**Sovereign Exercise Engine — Calgary Strength & Physio**

---

## Overview

Project VECTOR is a metric-driven rehabilitation programming system that maps specific injuries to phase-based performance outcomes using 2026 sports science protocols. It replaces time-based progression with **data-gated phases**, ensuring clients advance only when objective criteria are met.

The system is built around three core components:

| Component | Role | Description |
| :--- | :--- | :--- |
| **V-CORE** | Logic Engine | Maps pathology → phase → programming using strict logic gates (SQLite) |
| **BASE** | Living Library | Evidence-based clinical protocols seeded with 2026 high-density features (BFR, VBT, HSR) |
| **TRAJECTORY** | Visualization | Client-facing dashboard showing locked/unlocked phases and terminal goals |

## Directory Structure

```
Calgary_Strength_Physio_VECTOR/
├── README.md                          # This file
├── IMPLEMENTATION_STRATEGY.md         # Strategic architecture document
├── RESEARCH_LOG.md                    # Protocol update tracking
│
├── database/
│   ├── schema/
│   │   └── v_core.sql                 # Full relational schema
│   └── seeds/
│       └── base_seed.json             # Top 5 injury protocol data
│
├── frontend/
│   ├── trajectory.html                # TRAJECTORY dashboard (static MVP)
│   ├── css/
│   │   └── trajectory.css             # Dashboard styles
│   └── js/
│       └── trajectory.js              # Dashboard interaction logic
│
└── docs/
    └── trajectory_view.md             # UX wireframe & specification
```

## Getting Started

### 1. Initialize the Database

```bash
mkdir -p database/data
sqlite3 database/data/vector.db < database/schema/v_core.sql
```

### 2. Seed Protocol Data

The seed data is stored in `database/seeds/base_seed.json`. Use the provided Python script to load the Top 5 injury protocols into the database:

```bash
python3 scripts/load_base.py
```

This will:
- Load protocols for ACL, Rotator Cuff, Lumbar, Achilles, and Ankle
- Create a demo client ("Marcus D.")
- Populate initial metric recordings for testing

### 3. View TRAJECTORY Dashboard

Open `frontend/trajectory.html` in any modern browser. No build step required.

## Key Principles

1. **Metric-Driven Progression** — Phases unlock based on objective data, not arbitrary timelines
2. **Intent-Based Programming** — Exercises are coded by *intent* (e.g., "Quad Hypertrophy"), not by specific equipment
3. **Living Library** — Protocols are versioned and updated as new research emerges
4. **2026 High-Density Features** — BFR, VBT, Isometrics, and HSR are first-class citizens, not afterthoughts
5. **OSICS Integration** — Sports-specific injury coding for precise categorization

## Status

- **Phase:** Foundation (Phase 1)
- **MVP Scope:** Top 5 Injuries × 3-5 Phases × Intent-Based Programming
- **Next Milestone:** Pilot testing with 5 clients

---

*Project VECTOR — Calgary Strength & Physio © 2026*
