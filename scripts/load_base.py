
import json
import sqlite3
import os
import sys

DB_PATH = "database/data/vector.db"
SEED_PATH = "database/seeds/base_seed.json"

def load_seed_data():
    """
    Loads base_seed.json into the SQLite database.
    This script wipes existing data for the protocols being loaded to ensure idempotency.
    """
    
    if not os.path.exists(SEED_PATH):
        print(f"Error: Seed file not found at {SEED_PATH}")
        sys.exit(1)
        
    print(f"Loading seed data from {SEED_PATH}...")
    
    try:
        with open(SEED_PATH, 'r') as f:
            data = json.load(f)
            protocols = data.get("protocols", [])
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("BEGIN TRANSACTION;")

        for proto in protocols:
            pathology_id = proto["id"]
            print(f"  - Integrating: {proto['name']} ({proto['osics_code']})...")

            # 1. Upsert Pathology
            cursor.execute("""
                INSERT OR REPLACE INTO pathologies (
                    id, name, osics_code, body_region, injury_mechanism, 
                    research_source, research_doi, contraindications, 
                    version, is_active, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            """, (
                pathology_id,
                proto["name"],
                proto["osics_code"],
                proto["body_region"],
                proto["injury_mechanism"],
                proto["research_source"],
                proto["research_doi"],
                json.dumps(proto.get("contraindications", [])),
                1,  # Initial version
                1   # active = true
            ))

            # Delete existing phases/criteria/slots for this pathology to ensure fresh load
            # Due to cascading deletes, deleting phases handles everything else
            cursor.execute("DELETE FROM phases WHERE pathology_id = ?", (pathology_id,))

            # 2. Insert Phases
            for phase in proto.get("phases", []):
                phase_id = phase["id"]
                
                cursor.execute("""
                    INSERT INTO phases (
                        id, pathology_id, order_index, name, description, 
                        typical_duration, precautions, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
                """, (
                    phase_id,
                    pathology_id,
                    phase["order_index"],
                    phase["name"],
                    phase["description"],
                    phase["typical_duration"],
                    phase["precautions"]
                ))
                
                # 3. Insert Exit Criteria
                for crit in phase.get("exit_criteria", []):
                    cursor.execute("""
                        INSERT INTO exit_criteria (
                            id, phase_id, metric_name, target_operator, target_value,
                            measurement_unit, measurement_tool, description
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        crit["id"],
                        phase_id,
                        crit["metric_name"],
                        crit["target_operator"],
                        crit["target_value"],
                        crit["measurement_unit"],
                        crit["measurement_tool"],
                        crit["description"]
                    ))

                # 4. Insert Programming Slots
                for slot in phase.get("programming", []):
                    cursor.execute("""
                        INSERT INTO programming_slots (
                            id, phase_id, order_index, slot_type, intent_description,
                            standard_exercise, regression, progression, 
                            high_density_option, high_density_rationale,
                            sets_reps_guidance, frequency, equipment_required,
                            updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                    """, (
                        slot["id"],
                        phase_id,
                        slot["order_index"],
                        slot["slot_type"],
                        slot["intent_description"],
                        slot["standard_exercise"],
                        slot.get("regression"),
                        slot.get("progression"),
                        slot.get("high_density_option"),
                        slot.get("high_density_rationale"),
                        slot.get("sets_reps_guidance"),
                        slot.get("frequency"),
                        json.dumps(slot.get("equipment_required", []))
                    ))

        # 5. Create a Mock Client Journey (Marcus D.) for Demo
        print("  - Creating Demo Client: Marcus D...")
        
        # Client
        cursor.execute("""
            INSERT OR REPLACE INTO clients (id, display_name, intake_date, terminal_goal, sport_activity)
            VALUES ('CLT_DEMO_01', 'Marcus D.', '2026-01-15', 'Return to 315lb Squat', 'Powerlifting')
        """)
        
        # ACTIVE Journey: ACL Reconstruction
        cursor.execute("DELETE FROM client_journeys WHERE client_id = 'CLT_DEMO_01'") # clear old
        cursor.execute("""
            INSERT INTO client_journeys (id, client_id, pathology_id, current_phase_id, status, started_at)
            VALUES ('JRN_DEMO_ACL', 'CLT_DEMO_01', 'PATH_ACL_01', 'PHASE_ACL_01_P1', 'active', '2026-01-15')
        """)

        # Add some mock completions for Phase 1 criteria (3/4 met)
        # We need the Exit Criteria IDs for Phase 1 of ACL
        # EC_ACL_P1_02 (Quad Lag) -> Met
        # EC_ACL_P1_03 (Pain) -> Met
        # EC_ACL_P1_04 (Effusion) -> Met
        # EC_ACL_P1_01 (Extension) -> Not Met (3 deg)
        
        cursor.execute("""
            INSERT INTO metric_recordings (id, journey_id, phase_id, criterion_id, metric_name, recorded_value, measurement_unit, recorded_at)
            VALUES 
            ('REC_01', 'JRN_DEMO_ACL', 'PHASE_ACL_01_P1', 'EC_ACL_P1_02', 'quad_lag', '0', 'degrees', datetime('now', '-1 day')),
            ('REC_02', 'JRN_DEMO_ACL', 'PHASE_ACL_01_P1', 'EC_ACL_P1_03', 'pain_level', '1', 'VAS (0-10)', datetime('now', '-1 day')),
            ('REC_03', 'JRN_DEMO_ACL', 'PHASE_ACL_01_P1', 'EC_ACL_P1_04', 'effusion', '1', 'grade (0-3)', datetime('now', '-1 day')),
            ('REC_04', 'JRN_DEMO_ACL', 'PHASE_ACL_01_P1', 'EC_ACL_P1_01', 'knee_extension', '3', 'degrees', datetime('now', '-1 day'))
        """)

        conn.commit()
        print("Success: V-CORE Logic Engine successfully seeded.")
        print(f"  - Protocols Loaded: {len(protocols)}")
        print("  - Demo Client Created: Marcus D.")
        
    except sqlite3.Error as e:
        conn.rollback()
        print(f"Database Error: {e}")
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    load_seed_data()
