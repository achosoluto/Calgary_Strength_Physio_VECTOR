# VECTOR Architectural Patterns & Insights

**Date:** 2026-02-16
**Status:** Living Document
**Purpose:** Formalize architectural decisions derived from implementation challenges to ensure system resilience and stability.

---

## 1. The "Triangulated Reference" Pattern (Clinical Integrity)

**Context:**
In an evidence-based clinical system, reliance on external URLs for protocols or research papers poses a significant risk. "Link Rot" (content moving or disappearing) can undermine clinician trust or, worse, compromise patient safety if critical contraindications are inaccessible.

**The Insight:**
We cannot rely on the "Live Web" as the single source of truth for clinical data.

**The Pattern:**
Every critical clinical reference must be triangulated across three layers of persistence:

1.  **Leg 1: Immutable Metadata (The Pointer)**
    *   **What:** Full citation text (Author, Year, Title, Journal) stored in the database.
    *   **Role:** Human-readable verification that persists even if all links fail.
    *   **Implementation:** `client_journey.researchSource` field.

2.  **Leg 2: The Resolvable Object (The Bridge)**
    *   **What:** Digital Object Identifier (DOI) URL (e.g., `https://doi.org/...`).
    *   **Role:** A persistent link that redirects to the current publisher.
    *   **Implementation:** `client_journey.researchDoi` field + UI Hyperlink.

3.  **Leg 3: The Local Artifact (The Truth)**
    *   **What:** A local copy of the content (Markdown/PDF) stored in the **Protocol Vault**.
    *   **Role:** The system's "Offline Truth." Guaranteed to load 100% of the time.
    *   **Implementation:** `database/protocols/{id}.md` served via `/api/protocol/{id}`.

**Mechanism (The "Safety Guard"):**
*   **Link Interceptor:** Frontend JS detects clicks on external links.
*   **Offline Check:** Blocks navigation if `navigator.onLine` is false.
*   **Feedback Loop:** "Report Issue" button allows clinicians to flag when Leg 2 (DOI) breaks, triggering a human review of Leg 3 (Vault).

---

## 2. The "Sanitized Environment" Pattern (Tooling Stability)

**Context:**
A failed `npm init playwright` command revealed that modern development tools (NPM, Vite, Playwright) often fail when executed in paths containing special characters (e.g., `My Drive (user@email.com)`). This creates "Heisenbugs" where tools fail only for specific users.

**The Insight:**
Development tooling assumes a POSIX-compliant environment. Cloud drive synchronization paths often violate this assumption.

**The Pattern:**
*   **Constraint:** Project root directories MUST NOT contain parentheses, spaces, or non-ASCII characters.
*   **Best Practice:** Develop in a dedicated, local "Code" directory (e.g., `~/Code/vector`) and use Git for synchronization/backup, rather than a live Cloud Drive sync folder.

**Mechanism:**
*   **Path Validation:** Future startup scripts (`run_dev_server.py`) should check `os.getcwd()` and emit a warning if "unsafe" characters are detected in the path.

---

## 3. "Offline First" Auditability (System Design)

**Context:**
Clinicians operate in environments with unreliable connectivity (hospitals, gyms). Regulatory audits (HIPAA/PIPEDA) require proof of access to protocols *at the time of care*.

**The Insight:**
"Cloud-First" architectures fail the auditability test if the internet cuts out.

**The Pattern:**
*   **Localhost API:** The backend API (`FastAPI`) serves as a local data pump, not just a gateway to the cloud.
*   **Self-Contained Logic:** The Protocol Vault logic (markdown rendering) is implemented in vanilla JS on the client, zero external dependencies.

---

## 4. Agent Directives (MANDATORY)

**For any AI Agent or Developer working on this repository, the following rules are non-negotiable:**

### 🛡️ Rule 1: The "No Dead Links" Policy
*   **Constraint:** You MUST NOT generate a user-facing hyperlink to an external clinical resource (DOI, PDF, Video) unless you have also verified a **Local Fallback** exists or have explicitly marked it as `[Unverified/Network Dependent]`.
*   **Action:** When adding a new protocol, you MUST verify the DOI resolves. If it fails, report it immediately rather than hallucinating a working link.

### 🛡️ Rule 2: The "Path Safety" Check
*   **Constraint:** You MUST NOT execute shell commands (e.g., `npm init`, `npx`) without first verifying the Current Working Directory (CWD).
*   **Action:** If the CWD contains special characters (parentheses, spaces), you MUST explicitly warn the user or attempt to run the command in a sanitized subdirectory.

### 🛡️ Rule 3: The "Offline-First" Mindset
*   **Main Condition:** Assume `navigator.onLine` is `false` by default.
*   **Action:** Every UI interaction that fetches data MUST have a `try/catch` block that handles network failure gracefully (e.g., "Toast Warning" instead of "console error").

---
