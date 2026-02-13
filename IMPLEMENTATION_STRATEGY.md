# Project VECTOR: Implementation Strategy

**Subject:** Sovereign Logic & Critical MVP Architecture  
**Date:** 2026-02-12  
**Status:** DRAFT  
**Client:** Calgary Strength & Physio  

---

## 1. Strategic Pivot

*   **Old Identity:** "Mission: Sovereign Strength" (Romanticized, Vague)
*   **New Identity:** **Project VECTOR** (Industrial, Kinetic, Directional)
*   **Core Objective:** To build a "Sovereign Exercise Engine" that maps specific injuries to metric-based performance outcomes using 2026 sports science.

---

## 2. System Architecture

### Component A: V-CORE (The Logic Engine)

*   **Function:** Maps the "Is" (Pathology) to the "Vector" (Phase) using strict logic gates.
*   **Tech Stack:** SQLite (Relational Integrity).
*   **Schema Design:**
    *   `pathologies`: Stores OSICS-coded injuries.
    *   `phases`: Stores strict exit criteria (e.g., "Pain < 2/10").
    *   `programming_slots`: Stores the "intent" of an exercise (e.g., "Quad Loading") allowing for flexible "Production" based on available equipment.

### Component B: BASE (The Living Library)

*   **Function:** The "Source of Truth" for clinical protocols.
*   **Content Strategy:**
    *   **Seed:** Top 5 Injuries (ACL, Rotator Cuff, Lumbar, Achilles, Ankle).
    *   **Differentiation:** "High Density" fields that integrate 2026 tech (BFR, Isometrics, VBT) directly into the protocol.
*   **Update Mechanism:** `RESEARCH_LOG.md` tracks changes based on new literature.

### Component C: TRAJECTORY (The Visualization)

*   **Function:** The client-facing dashboard.
*   **UX Strategy:**
    *   **The "Pike":** Visualizes the terminal goal (e.g., 315lb Squat).
    *   **The Lock:** Phases remain "Locked" until specific data metrics are met.
    *   **The Identity:** Shifts user from "Patient" to "Sovereign Subject."

---

## 3. Critical MVP: The Top 5 Protocol Matrix

We will seed the **BASE** with the following high-density protocols:

| Injury (OSICS) | Protocol Source | 2026 High-Density Feature |
| :--- | :--- | :--- |
| **ACL (KJXX)** | Aspetar / Delaware | Early Open Kinetic Chain (OKC) + BFR for Quad Hypertrophy. |
| **Rotator Cuff (SSXX)** | BESS / MOON | Heavy Distinct Loading (Posterior Chain) vs. Banded ER. |
| **Lumbar Disc (Lxx)** | McGill / O'Sullivan | Cognitive Functional Therapy (CFT) + Flexion Tolerance. |
| **Achilles (TAxx)** | Silbernagel / Rio | Heavy Slow Resistance (HSR) > Eccentrics. |
| **Ankle Sprain (Axx)** | PAASS / ROAST | Dynamic Stability & Plyometric Landings (Week 2). |

---

## 4. Technical Specifications

### SQL Schema (`v_core.sql`)

```sql
-- Pathologies Table: The "Is" (Injury State)
CREATE TABLE pathologies (
    id TEXT PRIMARY KEY,       -- e.g., 'PATH_ACL_01'
    name TEXT NOT NULL,        -- 'ACL Reconstruction (Patellar Graft)'
    osics_code TEXT,           -- 'KJXX' (Standardized Sports Code)
    research_source TEXT,      -- 'Aspetar Clinical Guideline 2026'
    last_updated DATE          -- To track 'Living Library' freshness
);

-- Phases Table: The "Vector" (Progression State)
CREATE TABLE phases (
    id TEXT PRIMARY KEY,
    pathology_id TEXT,
    order_index INTEGER,       -- 1, 2, 3...
    name TEXT,                 -- 'Phase 1: Quiescence & Activation'
    exit_criteria JSON,        -- {"knee_extension": "0 deg", "pain": "<2/10"}
    FOREIGN KEY(pathology_id) REFERENCES pathologies(id)
);

-- Programming Slots Table: The "Syntax" (Exercise Logic)
-- Instead of hardcoding exercises, we code the INTENT.
CREATE TABLE programming_slots (
    id TEXT PRIMARY KEY,
    phase_id TEXT,
    slot_type TEXT,            -- 'Quad Hypertrophy' or 'Posterior Chain'
    standard_exercise TEXT,    -- 'Goblet Squat'
    regression TEXT,           -- 'Box Squat'
    progression TEXT,          -- 'Barbell Back Squat'
    high_density_option TEXT,  -- 'BFR Leg Extension' (The 2026 Tech Option)
    FOREIGN KEY(phase_id) REFERENCES phases(id)
);
```

### JSON Data Structure (`base_seed.json`)

```json
{
  "pathology": {
    "id": "PATH_ACL_01",
    "name": "ACL Reconstruction",
    "phases": [
      {
        "name": "Phase 1: Protection & Activation",
        "exit_criteria": ["Full Knee Extension", "No Quad Lag", "Pain < 2/10"],
        "programming": [
          {
            "intent": "Quad Activation (Non-Weight Bearing)",
            "standard": "Quad Set (Towel under knee)",
            "high_density": "Quad Set with NMES (Neuromuscular E-Stim)"
          },
          {
            "intent": "Posterior Chain Maintenance",
            "standard": "Prone Hamstring Curl (Active Range)",
            "high_density": "Isokinetic Hamstring Curl (0-90 deg)"
          },
          {
            "intent": "Hypertrophy (Load Sparing)",
            "standard": "Straight Leg Raise (4-way)",
            "high_density": "BFR Straight Leg Raise (30/15/15/15 reps)"
          }
        ]
      }
    ]
  }
}
```

---

## 5. Execution Roadmap

### Phase 1: Foundation
1.  **Initialize Directory**: `01_Active_Projects/Calgary_Strength_Physio_VECTOR`
2.  **Write Schema**: Create `v_core.sql`
3.  **Write Seed Data**: Create `base_seed.json` with the Top 5 protocols
4.  **Draft Frontend Template**: Create `trajectory_view.md`

### Phase 2: Integration
1.  **JaneApp Webhook**: Design how clinician notes trigger VECTOR updates
2.  **Research Pipeline**: Establish `RESEARCH_LOG.md` protocol
3.  **Client Portal**: Build TRAJECTORY visualization component

### Phase 3: Deployment
1.  **MVP Testing**: Top 5 protocols with 5 pilot clients
2.  **Feedback Loop**: Clinician input on exercise production
3.  **Scaling**: Expand to Top 25 injuries

---

## 6. Key Differentiators

1.  **OSICS Integration**: Sports-specific injury coding (not generic ICD-10)
2.  **2026 Protocols**: BFR, VBT, Isometrics baked into early phases
3.  **Exercise Production**: Intent-based slots allow equipment flexibility
4.  **Metric-Driven**: Phases unlock based on data, not time
5.  **Living Library**: Research updates tracked and versioned

---

**Document Status:** Phase 1 Executed  
**Next Action:** Begin Phase 2 (Integration)
