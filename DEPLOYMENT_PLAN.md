# Project VECTOR: Remote Deployment Strategy

To demo Project VECTOR to your client remotely, we have two primary options based on your timeline and professional requirements.

---

## Option 1: The "Immediate Tactical" Demo (5 Minutes)
**Best for:** A quick 1-on-1 walkthrough where you only need a temporary URL.
**Tool:** [Localtunnel](https://localtunnel.github.io/www/) (No installation required via `npx`).

### Steps:
1.  **Start your local server** (if not already running):
    ```bash
    source venv/bin/activate
    uvicorn backend.main:app --host 0.0.0.0 --port 8000
    ```
2.  **Open a new terminal** and run the tunnel:
    ```bash
    npx localtunnel --port 8000
    ```
3.  **Share the URL**: It will give you a link like `https://funny-lions-jump.loca.lt`.
    *   **Note:** When the client first opens it, they may see a "Friendly Reminder" page from Localtunnel. They just need to click "Click to Continue" to reach the dashboard.

---

## Option 2: The "Professional Sovereign" Deployment (15 Minutes)
**Best for:** A persistent URL that feels like a real product.
**Target:** [Render.com](https://render.com) (Free Tier).

### Why Render?
- It supports **FastAPI** natively.
- It can host our **Majestic Monolith** (Backend + Frontend together).
- It handles the **SQLite** file easily (though data resets on redeploy unless you use a persistent Disk, which is fine for a demo).

### Prerequisites:
1.  **Git Repository**: The project must be in a GitHub/GitLab repo.
2.  **Render Account**: Sign up at [render.com](https://render.com).

### Deployment Steps:
1.  **Create a New Web Service** on Render.
2.  **Connect your GitHub Repo**.
3.  **Configuration**:
    *   **Runtime**: `Python`
    *   **Build Command**: `pip install -r backend/requirements.txt`
    *   **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app --bind 0.0.0.0:$PORT`
4.  **Database Seeding**:
    *   The `vector.db` will be included if it's in your repo.
    *   For a fresh demo, run the seed script once via the Render "Shell":
        ```bash
        python scripts/load_base.py
        ```

---

## Architectural Adjustments Made
I have already updated the codebase to ensure it is "Deployment-Ready":
1.  ✅ **Refactored `frontend/js/trajectory.js`**: Changed `API_BASE_URL` from `localhost:8000` to `window.location.origin`. This allows the dashboard to correctly call the API regardless of whether it's on localhost, a tunnel, or a cloud server.
2.  ✅ **Updated `backend/requirements.txt`**: Added `gunicorn` for production-grade serving.

---

## Recommendation
For your demo **today**, use **Option 1 (Localtunnel)**. It requires zero configuration changes and leverages the server you already have running. 

For the **Pilot Phase**, we will move to **Option 2 (Render)** to provide the client with a persistent link they can share with their team.

**Next Step:** Would you like me to help you trigger the tunnel command or walk through the Git push for Render?
