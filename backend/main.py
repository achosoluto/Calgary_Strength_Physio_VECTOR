from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import json
import hmac
import hashlib
import os
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Optional

app = FastAPI(title="VECTOR API", version="0.1.0")

# SECURITY: Audit logging (local only, never sent to external server)
AUDIT_LOG_DIR = Path("database/logs")
AUDIT_LOG_DIR.mkdir(parents=True, exist_ok=True)
AUDIT_LOG_PATH = AUDIT_LOG_DIR / "audit.log"

logging.basicConfig(
    filename=str(AUDIT_LOG_PATH),
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
audit_logger = logging.getLogger("vector_audit")

# SECURITY: Middleware to log all client data access
@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    """Log all API requests for security audit trail."""
    client_ip = request.client.host if request.client else "unknown"
    path = request.url.path
    method = request.method
    
    # Log access to client data endpoints
    if "/api/client/" in path or "/api/metric/" in path:
        audit_logger.info(f"ACCESS | IP: {client_ip} | {method} {path}")
    
    response = await call_next(request)
    return response

# Enable CORS for local development (localhost only in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000"],  # SECURITY: Restrict origins
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # SECURITY: Only needed methods
    allow_headers=["*"],
)

DB_PATH = Path("database/data/vector.db")
JANEAPP_SECRET = os.getenv("JANEAPP_WEBHOOK_SECRET", "dev_secret_unsecure")

# --- Pydantic Models ---

class MetricRecord(BaseModel):
    client_id: str
    metric_name: str
    value: str
    unit: Optional[str] = ""
    recorded_at: Optional[str] = None # ISO format, defaults to now

# --- Database Helpers ---

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

# --- API Endpoints ---

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
        
    # Get extra pathology details
    pathology_details = cursor.execute("SELECT research_source, research_doi FROM pathologies WHERE id = ?", (journey["pathology_id"],)).fetchone()
    
    conn.close()

    return {
        "client": {
            "name": journey["display_name"],
            "sport": journey["sport_activity"],
            "terminalGoal": journey["terminal_goal"],
            "pathology": journey["pathology_name"],
            "protocolId": journey["pathology_id"],
            "researchSource": pathology_details["research_source"],
            "researchDoi": pathology_details["research_doi"],
            "startDate": journey["started_at"],
            "nextSession": "2026-02-14", 
            "currentPhaseIndex": current_phase_index
        },
        "phases": phases_data
    }

@app.post("/api/metric/record")
def record_metric(record: MetricRecord):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Get active journey
    journey = cursor.execute("""
        SELECT id, current_phase_id FROM client_journeys 
        WHERE client_id = ? AND status = 'active'
    """, (record.client_id,)).fetchone()

    if not journey:
        conn.close()
        raise HTTPException(status_code=404, detail="No active journey found for this client")

    # 2. Find matching criterion in current phase
    # We match by metric_name
    criterion = cursor.execute("""
        SELECT id FROM exit_criteria 
        WHERE phase_id = ? AND metric_name = ?
    """, (journey["current_phase_id"], record.metric_name)).fetchone()

    if not criterion:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Metric '{record.metric_name}' is not an exit criterion for current phase")

    # 3. Insert recording
    recorded_at = record.recorded_at or datetime.now().isoformat()
    recording_id = f"REC_{datetime.now().timestamp()}"
    
    cursor.execute("""
        INSERT INTO metric_recordings 
        (id, journey_id, phase_id, criterion_id, metric_name, recorded_value, measurement_unit, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        recording_id, 
        journey["id"], 
        journey["current_phase_id"], 
        criterion["id"], 
        record.metric_name, 
        record.value, 
        record.unit, 
        recorded_at
    ))

    conn.commit()
    conn.close()

    return {"status": "success", "recording_id": recording_id}

@app.get("/api/protocol/{protocol_id}")
async def get_protocol_content(protocol_id: str):
    """
    Serve secure, offline protocol documents from the Protocol Vault.
    """
    # SECURITY: Prevent path traversal
    safe_id = Path(protocol_id).name
    protocol_path = Path("database/protocols") / f"{safe_id}.md"
    
    if not protocol_path.exists():
        raise HTTPException(status_code=404, detail="Protocol document not found")
        
    try:
        content = protocol_path.read_text(encoding="utf-8")
        return {"id": safe_id, "content": content}
    except Exception as e:
        audit_logger.error(f"PROTOCOL ERROR: Failed to read {safe_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load protocol content")

@app.post("/webhooks/janeapp")
async def janeapp_webhook(request: Request):
    # 1. Verify Signature (based on docs/janeapp_integration.md)
    signature = request.headers.get("X-Jane-Signature", "")
    body = await request.body()
    
    if JANEAPP_SECRET != "dev_secret_unsecure":
        expected_sig = "sha256=" + hmac.new(
            JANEAPP_SECRET.encode(), 
            body, 
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_sig):
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    # 2. Parse Payload
    data = await request.json()
    event_type = data.get("event")
    
    if event_type != "treatment_note.created":
        return {"status": "ignored", "reason": "Unsupported event type"}
    
    # 3. Extract Client ID (from patient.external_id)
    client_id = data.get("patient", {}).get("external_id")
    if not client_id:
        raise HTTPException(status_code=400, detail="Missing external_id in patient data")
    
    # 4. Process metrics from fields
    fields = data.get("treatment_note", {}).get("fields", [])
    recorded_at = data.get("appointment", {}).get("date", datetime.now().isoformat())
    
    recorded_count = 0
    # Re-use record_metric logic via direct DB access for speed
    conn = get_db_connection()
    cursor = conn.cursor()
    
    journey = cursor.execute("""
        SELECT id, current_phase_id FROM client_journeys 
        WHERE client_id = ? AND status = 'active'
    """, (client_id,)).fetchone()
    
    if not journey:
        conn.close()
        return {"status": "ignored", "reason": "No active journey"}

    for field in fields:
        label = field.get("label")
        value = field.get("value")
        unit = field.get("unit", "")
        
        # Attempt to find matching criterion
        criterion = cursor.execute("""
            SELECT id, metric_name FROM exit_criteria 
            WHERE phase_id = ? AND (metric_name = ? OR description LIKE ?)
        """, (journey["current_phase_id"], label, f"%{label}%")).fetchone()
        
        if criterion:
            cursor.execute("""
                INSERT INTO metric_recordings 
                (id, journey_id, phase_id, criterion_id, metric_name, recorded_value, measurement_unit, recorded_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f"WH_{datetime.now().timestamp()}_{recorded_count}",
                journey["id"],
                journey["current_phase_id"],
                criterion["id"],
                criterion["metric_name"],
                str(value),
                unit,
                recorded_at
            ))
            recorded_count += 1
            
    conn.commit()
    conn.close()
    
    return {"status": "success", "metrics_recorded": recorded_count}

# Mount static files for frontend dev
# Fix: Move mount to after all routes to avoid path collisions
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
