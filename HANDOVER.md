# Project VECTOR Handover Documentation

**Project Name**: Calgary Strength & Physio — VECTOR (Sovereign Exercise Engine)  
**Date**: 2026-02-16  
**Status**: Ready for Deployment  

---

## 1. Project Overview
VECTOR is a phase-locked rehabilitation dashboard designed to bridge the gap between clinical research and patient programming. It features a "Trajectory Dashboard" for patients to track progress and a "Clinician Portal" for recording metrics.

### Core Philosophy
- **Evidence-Based**: Every exercise is mapped to a research protocol (via DOI).
- **Metric-Driven**: Progression is locked behind objective exit criteria.
- **Privacy-First**: Designed for offline-secure storage and minimal data leakage.

## 2. Tech Stack
- **Backend**: Python (FastAPI), SQLite (v-core logic engine), Gunicorn/Uvicorn.
- **Frontend**: Vanilla JavaScript, CSS3 (No external dependencies/CDNs for security).
- **Deployment**: Configured for Render (Web Service).

## 3. Key Recent Improvements (Design Review Fixes)
Based on the February 2026 Design Review, the following critical issues were resolved:
- **Accessibility**: All form inputs in the Clinician Portal now have unique IDs, proper labels, and ARIA descriptions (Fixes Issue #2).
- **Clickable DOIs**: Research DOIs in the Pike section are now direct links to external verification databases (Fixes Issue #1).
- **Global Navigation**: Added a persistent header to switch between the Dashboard, Clinician Portal, and Icon Preview (Fixes Issue #6).
- **Improved UX**: Added input validation guidance (units and targets) and detailed client context in the clinician workflow (Fixes Issues #3 & #12).
- **Focus States**: Implemented high-contrast focus outlines for keyboard navigation (Fixes Issue #5).

## 4. Getting Started (Local Development)

### Prerequisites
- Python 3.11+
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/achosoluto/Calgary_Strength_Physio_VECTOR.git
   cd Calgary_Strength_Physio_VECTOR
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Initialize the database and seed data:
   ```bash
   python3 scripts/deploy_init.py
   ```
5. Run the development server:
   ```bash
   python3 run_dev_server.py
   ```
   The dashboard will be available at `http://localhost:8000`.

## 5. Deployment Instructions (Render.com)
The project is "Render-ready" with a `render.yaml` configuration.

1. **Connect GitHub**: Point Render to your repository.
2. **Environment**: Select "Python" as the environment.
3. **Build Command**: `pip install -r backend/requirements.txt && python scripts/deploy_init.py`
4. **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app --bind 0.0.0.0:$PORT`
5. **Disk**: *Important* — Since this uses SQLite, ensure you attach a "Render Disk" to `/database/data` if you need persistent data across restarts (otherwise, the `deploy_init.py` will reset the DB on every build).

## 6. Directory Structure
- `backend/`: FastAPI application and logic.
- `frontend/`: HTML/JS/CSS assets (Pure Vanilla).
- `database/`:
  - `schema/`: SQL definition of the V-CORE engine.
  - `seeds/`: JSON data for top-5 injury protocols.
  - `data/`: Location of the SQLite `.db` file (git-ignored).
- `scripts/`: Initialization and data loading automation.
- `docs/`: Security specs and architectural patterns.

## 7. Future Roadmap (Medium/Low Priority)
Items remaining from the design review:
- **Exercise Filtering**: Implement search/filter logic for specific techniques (BFR, VBT).
- **Historical Metrics**: Build a graph view for clinicians to track longitudinal progress.
- **Mobile Optimization**: Add responsive breakpoints for small-screen clinical use.
- **Breadcrumbs**: Enhance internal navigation for complex nested protocols.

---
**Handover Completed by**: Antigravity (AI Assistant)
