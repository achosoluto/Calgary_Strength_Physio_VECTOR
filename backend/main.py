
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
from pathlib import Path

app = FastAPI(title="VECTOR API", version="0.1.0")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = Path("database/data/vector.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def check_criteria_met(operator, target_val, current_val):
    if current_val is None:
        return False
    
    try:
        # Simple numeric comparison if applicable
        t_num = float(target_val)
        c_num = float(current_val)
        if operator == "=": return c_num == t_num
        if operator == ">": return c_num > t_num
        if operator == ">=": return c_num >= t_num
        if operator == "<": return c_num < t_num
        if operator == "<=": return c_num <= t_num
    except ValueError:
        # String comparison fallback
        if operator == "=": return str(current_val).lower() == str(target_val).lower()
        if target_val.lower() == "pass" and str(current_val).lower() == "pass": return True
        
    return False

@app.get("/api/client/{client_id}/journey")
def get_client_journey(client_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Fetch Active Journey Details
    journey = cursor.execute("""
        SELECT 
            j.id as journey_id, j.current_phase_id, j.started_at,
            c.display_name, c.sport_activity, c.terminal_goal,
            p.id as pathology_id, p.name as pathology_name
        FROM client_journeys j
        JOIN clients c ON j.client_id = c.id
        JOIN pathologies p ON j.pathology_id = p.id
        WHERE c.id = ? AND j.status = 'active'
    """, (client_id,)).fetchone()

    if not journey:
        conn.close()
        raise HTTPException(status_code=404, detail="Active journey not found")

    # 2. Fetch All Phases for this Pathology
    phases_rows = cursor.execute("""
        SELECT * FROM phases WHERE pathology_id = ? ORDER BY order_index ASC
    """, (journey["pathology_id"],)).fetchall()

    phases_data = []
    current_phase_index = -1

    for idx, ph in enumerate(phases_rows):
        phase_id = ph["id"]
        
        # Determine Status
        if ph["id"] == journey["current_phase_id"]:
            status = "active"
            current_phase_index = idx
        elif current_phase_index == -1: 
            # We haven't hit the active phase yet, so this must be completed
            # (Logic assumes phases are returned in order)
            # Wait, if current_phase_index is -1, it means we haven't found active yet.
            # But the loop is sequential. So previous phases are completed.
            status = "completed"
        else:
            status = "locked"

        # Fetch Exit Criteria
        criteria_rows = cursor.execute("""
            SELECT * FROM exit_criteria WHERE phase_id = ?
        """, (phase_id,)).fetchall()

        criteria_list = []
        for crit in criteria_rows:
            # Fetch latest metric
            rec = cursor.execute("""
                SELECT recorded_value 
                FROM metric_recordings 
                WHERE journey_id = ? AND criterion_id = ? 
                ORDER BY recorded_at DESC LIMIT 1
            """, (journey["journey_id"], crit["id"])).fetchone()
            
            current_val = rec["recorded_value"] if rec else None
            is_met = check_criteria_met(
                crit["target_operator"], 
                crit["target_value"], 
                current_val
            )

            criteria_list.append({
                "label": f"{crit['metric_name']} {crit['target_operator']} {crit['target_value']} {crit['measurement_unit']}",
                "target": f"{crit['target_operator']} {crit['target_value']}",
                "current": f"{current_val} {crit['measurement_unit']}" if current_val else None,
                "met": is_met
            })

        # Fetch Programming
        prog_rows = cursor.execute("""
            SELECT * FROM programming_slots WHERE phase_id = ? ORDER BY order_index ASC
        """, (phase_id,)).fetchall()
        
        prog_list = []
        for prog in prog_rows:
            prog_list.append({
                "type": prog["slot_type"],
                "exercise": prog["standard_exercise"],
                "hd": prog["high_density_option"],
                "rationale": prog["high_density_rationale"], 
                "intent": prog["intent_description"],
                "detail": prog["sets_reps_guidance"] or "See clinician notes"
            })

        phases_data.append({
            "name": ph["name"],
            "status": status,
            "description": ph["description"],
            "typicalDuration": ph["typical_duration"],
            "criteria": criteria_list,
            "programming": prog_list
        })
        
    # Get extra pathology details efficiently
    pathology_details = cursor.execute("SELECT research_source, research_doi FROM pathologies WHERE id = ?", (journey["pathology_id"],)).fetchone()
    
    conn.close()

    return {
        "client": {
            "name": journey["display_name"],
            "sport": journey["sport_activity"],
            "terminalGoal": journey["terminal_goal"],
            "pathology": journey["pathology_name"],
            "researchSource": pathology_details["research_source"],
            "researchDoi": pathology_details["research_doi"],
            "startDate": journey["started_at"],
            "nextSession": "2026-02-14", 
            "currentPhaseIndex": current_phase_index
        },
        "phases": phases_data
    }

# Mount static files for frontend dev (optional, but convenient)
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
