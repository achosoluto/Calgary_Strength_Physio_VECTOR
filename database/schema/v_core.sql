-- =============================================================================
-- PROJECT VECTOR: V-CORE Schema
-- Sovereign Exercise Engine — Calgary Strength & Physio
-- Version: 1.0.0
-- Date: 2026-02-12
-- =============================================================================
-- This schema implements the relational backbone of the V-CORE logic engine.
-- It maps Pathology (the "Is") → Phase (the "Vector") → Programming (the "Syntax").
--
-- Design Principles:
--   1. Intent-based programming: Exercises are coded by purpose, not equipment.
--   2. Metric-driven progression: Phases unlock via objective exit criteria.
--   3. Protocol versioning: Living Library protocols are tracked and versioned.
--   4. Audit trail: All records include creation and modification timestamps.
-- =============================================================================

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- =============================================================================
-- SECTION 1: CORE PROTOCOL TABLES (The V-CORE Engine)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1a. Pathologies — The "Is" (Injury State)
-- ---------------------------------------------------------------------------
-- Each row represents a specific injury classification.
-- Uses OSICS coding for sports-specific standardization.
-- Supports versioning: when a protocol is updated, the old version is
-- deactivated (is_active=FALSE) and a new row with an incremented version
-- is inserted.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pathologies (
    id                TEXT PRIMARY KEY,          -- e.g., 'PATH_ACL_01'
    name              TEXT NOT NULL,             -- 'ACL Reconstruction (Patellar Graft)'
    osics_code        TEXT,                      -- 'KJXX' (Standardized Sports Injury Code)
    body_region       TEXT,                      -- 'Knee', 'Shoulder', 'Lumbar Spine'
    injury_mechanism  TEXT,                      -- 'Traumatic', 'Overuse', 'Degenerative'
    research_source   TEXT,                      -- 'Aspetar Clinical Guideline 2026'
    research_doi      TEXT,                      -- DOI link for primary citation
    contraindications TEXT,                      -- JSON array of contraindications
    version           INTEGER DEFAULT 1,         -- Protocol version number
    is_active         BOOLEAN DEFAULT TRUE,      -- FALSE = superseded by newer version
    created_at        DATETIME DEFAULT (datetime('now')),
    updated_at        DATETIME DEFAULT (datetime('now')),
    updated_by        TEXT DEFAULT 'system'       -- Clinician who last updated
);

CREATE INDEX IF NOT EXISTS idx_pathologies_osics ON pathologies(osics_code);
CREATE INDEX IF NOT EXISTS idx_pathologies_active ON pathologies(is_active);

-- ---------------------------------------------------------------------------
-- 1b. Phases — The "Vector" (Progression State)
-- ---------------------------------------------------------------------------
-- Each pathology is divided into sequential phases.
-- A phase remains "locked" until ALL associated exit criteria are met.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS phases (
    id                TEXT PRIMARY KEY,          -- e.g., 'PHASE_ACL_01_P1'
    pathology_id      TEXT NOT NULL,
    order_index       INTEGER NOT NULL,          -- Sequential: 1, 2, 3...
    name              TEXT NOT NULL,             -- 'Phase 1: Protection & Activation'
    description       TEXT,                      -- Clinical narrative of phase goals
    typical_duration  TEXT,                      -- 'Weeks 0-2' (guidance only, NOT a gate)
    precautions       TEXT,                      -- Active precautions during this phase
    created_at        DATETIME DEFAULT (datetime('now')),
    updated_at        DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY(pathology_id) REFERENCES pathologies(id) ON DELETE CASCADE,
    UNIQUE(pathology_id, order_index)
);

CREATE INDEX IF NOT EXISTS idx_phases_pathology ON phases(pathology_id);

-- ---------------------------------------------------------------------------
-- 1c. Exit Criteria — The "Gate" (Normalized from phases.exit_criteria)
-- ---------------------------------------------------------------------------
-- Normalized exit criteria allow querying by metric across clients.
-- A phase is "unlocked" only when ALL criteria for that phase are met.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exit_criteria (
    id                TEXT PRIMARY KEY,          -- e.g., 'EC_ACL_01_P1_01'
    phase_id          TEXT NOT NULL,
    metric_name       TEXT NOT NULL,             -- 'knee_extension', 'pain_level', 'quad_strength'
    target_operator   TEXT NOT NULL DEFAULT '>=',-- '>=', '<=', '=', '<', '>'
    target_value      TEXT NOT NULL,             -- '0', '2', '80'
    measurement_unit  TEXT,                      -- 'degrees', 'VAS (0-10)', '% limb symmetry'
    measurement_tool  TEXT,                      -- 'Goniometer', 'Dynamometer', 'VAS Scale'
    description       TEXT,                      -- 'Full knee extension (0 degrees)'
    created_at        DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY(phase_id) REFERENCES phases(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_exit_criteria_phase ON exit_criteria(phase_id);

-- ---------------------------------------------------------------------------
-- 1d. Programming Slots — The "Syntax" (Exercise Logic)
-- ---------------------------------------------------------------------------
-- Instead of hardcoding exercises, we code the INTENT.
-- This allows "production" to be flexible based on available equipment.
--
-- Example:
--   slot_type = "Quad Hypertrophy"
--   standard  = "Goblet Squat"
--   high_density = "BFR Leg Extension"
--   → Clinician picks based on what's available in the clinic.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS programming_slots (
    id                    TEXT PRIMARY KEY,      -- e.g., 'SLOT_ACL_01_P1_01'
    phase_id              TEXT NOT NULL,
    order_index           INTEGER NOT NULL,      -- Display order within a phase
    slot_type             TEXT NOT NULL,          -- 'Quad Hypertrophy', 'Posterior Chain', 'Core Stability'
    intent_description    TEXT,                   -- Detailed clinical rationale
    standard_exercise     TEXT NOT NULL,          -- Default exercise
    regression            TEXT,                   -- Easier variant
    progression           TEXT,                   -- Harder variant
    high_density_option   TEXT,                   -- 2026 Tech: BFR, VBT, Isometrics, HSR
    high_density_rationale TEXT,                  -- Why the high-density option is superior
    sets_reps_guidance    TEXT,                   -- '3x10-15 @ RPE 6' or '30/15/15/15 (BFR)'
    frequency             TEXT,                   -- '3x/week', 'Daily'
    equipment_required    TEXT,                   -- JSON array: ["barbell", "rack"]
    created_at            DATETIME DEFAULT (datetime('now')),
    updated_at            DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY(phase_id) REFERENCES phases(id) ON DELETE CASCADE,
    UNIQUE(phase_id, order_index)
);

CREATE INDEX IF NOT EXISTS idx_slots_phase ON programming_slots(phase_id);
CREATE INDEX IF NOT EXISTS idx_slots_type ON programming_slots(slot_type);


-- =============================================================================
-- SECTION 2: CLIENT JOURNEY TABLES (The TRAJECTORY Tracker)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 2a. Clients — Subject Registry
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
    id                TEXT PRIMARY KEY,          -- e.g., 'CLT_001'
    display_name      TEXT NOT NULL,             -- 'John D.' (privacy-safe)
    intake_date       DATE,
    terminal_goal     TEXT,                      -- 'Return to 315lb Squat' (The "Pike")
    sport_activity    TEXT,                      -- 'Powerlifting', 'Soccer', 'General Fitness'
    notes             TEXT,
    is_active         BOOLEAN DEFAULT TRUE,
    created_at        DATETIME DEFAULT (datetime('now')),
    updated_at        DATETIME DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- 2b. Client Journeys — Active Rehabilitation Tracks
-- ---------------------------------------------------------------------------
-- A client can have multiple journeys (e.g., knee rehab + shoulder rehab).
-- Each journey is linked to one pathology and tracks the current phase.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS client_journeys (
    id                TEXT PRIMARY KEY,          -- e.g., 'JRN_001_ACL'
    client_id         TEXT NOT NULL,
    pathology_id      TEXT NOT NULL,
    current_phase_id  TEXT,                      -- Current active phase
    status            TEXT DEFAULT 'active',     -- 'active', 'completed', 'paused', 'discharged'
    started_at        DATE NOT NULL,
    completed_at      DATE,
    clinician_notes   TEXT,
    created_at        DATETIME DEFAULT (datetime('now')),
    updated_at        DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY(pathology_id) REFERENCES pathologies(id),
    FOREIGN KEY(current_phase_id) REFERENCES phases(id)
);

CREATE INDEX IF NOT EXISTS idx_journeys_client ON client_journeys(client_id);
CREATE INDEX IF NOT EXISTS idx_journeys_status ON client_journeys(status);

-- ---------------------------------------------------------------------------
-- 2c. Phase Completions — Audit Log of Phase Transitions
-- ---------------------------------------------------------------------------
-- Records when a client completes a phase and the actual metrics achieved.
-- This is the core data for the "Lock/Unlock" visualization in TRAJECTORY.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS phase_completions (
    id                TEXT PRIMARY KEY,          -- e.g., 'PC_001_ACL_P1'
    journey_id        TEXT NOT NULL,
    phase_id          TEXT NOT NULL,
    started_at        DATE,
    completed_at      DATE,
    duration_days     INTEGER,                   -- Computed: completed_at - started_at
    criteria_met      TEXT,                      -- JSON: {"knee_extension": "0 deg", "pain": "1/10"}
    clinician_sign_off TEXT,                     -- Name of clinician who approved transition
    notes             TEXT,
    created_at        DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY(journey_id) REFERENCES client_journeys(id) ON DELETE CASCADE,
    FOREIGN KEY(phase_id) REFERENCES phases(id)
);

CREATE INDEX IF NOT EXISTS idx_completions_journey ON phase_completions(journey_id);

-- ---------------------------------------------------------------------------
-- 2d. Metric Recordings — Individual Measurement Entries
-- ---------------------------------------------------------------------------
-- Stores actual measurements taken during sessions.
-- Used to evaluate exit criteria and power TRAJECTORY visualizations.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS metric_recordings (
    id                TEXT PRIMARY KEY,
    journey_id        TEXT NOT NULL,
    phase_id          TEXT NOT NULL,
    criterion_id      TEXT,                      -- Links to specific exit_criteria row
    metric_name       TEXT NOT NULL,             -- 'knee_extension', 'pain_level'
    recorded_value    TEXT NOT NULL,             -- The actual measured value
    measurement_unit  TEXT,
    recorded_at       DATETIME DEFAULT (datetime('now')),
    recorded_by       TEXT,                      -- Clinician name
    session_notes     TEXT,
    FOREIGN KEY(journey_id) REFERENCES client_journeys(id) ON DELETE CASCADE,
    FOREIGN KEY(phase_id) REFERENCES phases(id),
    FOREIGN KEY(criterion_id) REFERENCES exit_criteria(id)
);

CREATE INDEX IF NOT EXISTS idx_metrics_journey ON metric_recordings(journey_id);
CREATE INDEX IF NOT EXISTS idx_metrics_criterion ON metric_recordings(criterion_id);


-- =============================================================================
-- SECTION 3: UTILITY VIEWS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- View: Active Protocols Summary
-- Shows all active pathologies with their phase count.
-- ---------------------------------------------------------------------------
CREATE VIEW IF NOT EXISTS v_active_protocols AS
SELECT
    p.id,
    p.name,
    p.osics_code,
    p.body_region,
    p.research_source,
    p.version,
    COUNT(ph.id) AS phase_count,
    p.updated_at
FROM pathologies p
LEFT JOIN phases ph ON ph.pathology_id = p.id
WHERE p.is_active = TRUE
GROUP BY p.id;

-- ---------------------------------------------------------------------------
-- View: Client Journey Dashboard
-- Shows each active client's current position in their rehabilitation.
-- ---------------------------------------------------------------------------
CREATE VIEW IF NOT EXISTS v_client_dashboard AS
SELECT
    c.display_name,
    c.terminal_goal,
    c.sport_activity,
    p.name AS pathology_name,
    ph.name AS current_phase,
    ph.order_index AS phase_number,
    (SELECT COUNT(*) FROM phases WHERE pathology_id = p.id) AS total_phases,
    j.status,
    j.started_at
FROM client_journeys j
JOIN clients c ON c.id = j.client_id
JOIN pathologies p ON p.id = j.pathology_id
LEFT JOIN phases ph ON ph.id = j.current_phase_id
WHERE j.status = 'active';

-- ---------------------------------------------------------------------------
-- View: Exit Criteria Progress
-- For a given journey, shows how close each criterion is to being met.
-- ---------------------------------------------------------------------------
CREATE VIEW IF NOT EXISTS v_criteria_progress AS
SELECT
    j.id AS journey_id,
    c.display_name,
    ph.name AS phase_name,
    ec.metric_name,
    ec.target_operator || ' ' || ec.target_value || ' ' || COALESCE(ec.measurement_unit, '') AS target,
    (
        SELECT mr.recorded_value
        FROM metric_recordings mr
        WHERE mr.journey_id = j.id
          AND mr.criterion_id = ec.id
        ORDER BY mr.recorded_at DESC
        LIMIT 1
    ) AS latest_value,
    (
        SELECT mr.recorded_at
        FROM metric_recordings mr
        WHERE mr.journey_id = j.id
          AND mr.criterion_id = ec.id
        ORDER BY mr.recorded_at DESC
        LIMIT 1
    ) AS last_measured
FROM client_journeys j
JOIN clients c ON c.id = j.client_id
JOIN phases ph ON ph.id = j.current_phase_id
JOIN exit_criteria ec ON ec.phase_id = ph.id
WHERE j.status = 'active';


-- =============================================================================
-- End of V-CORE Schema
-- =============================================================================
