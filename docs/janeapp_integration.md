# JaneApp Integration Specification

**Project:** VECTOR  
**Component:** Integration Layer (Phase 2)  
**Date:** 2026-02-13  
**Status:** Design Specification  

---

## 1. Executive Summary

This document defines how **Project VECTOR** integrates with **JaneApp**, the clinic's primary EMR/practice management system. The integration enables clinicians to update client progress through their existing workflow, with VECTOR automatically:
1. **Ingesting** metric measurements from treatment notes.
2. **Evaluating** exit criteria for phase progression.
3. **Updating** the TRAJECTORY dashboard in real-time.

---

## 2. JaneApp Context

### 2.1 What is JaneApp?
[JaneApp](https://jane.app) is a cloud-based practice management platform for allied health professionals. Calgary Strength & Physio uses it for:
- **Scheduling**: Appointment booking and calendar management.
- **Charting**: SOAP notes, treatment documentation, and progress tracking.
- **Billing**: Insurance claims and payment processing.

### 2.2 Relevant Features
- **Treatment Notes**: Clinicians document objective measurements (e.g., ROM, strength tests, pain levels).
- **Custom Fields**: JaneApp allows custom SOAP note templates with structured fields.
- **Webhooks**: JaneApp can send HTTP POST requests to external systems when specific events occur (e.g., "Treatment Note Created").

---

## 3. Integration Strategy

### 3.1 High-Level Architecture

```
┌──────────────┐
│   JaneApp    │  Clinician completes treatment note with measurements
│  (Cloud EMR) │  → Triggers webhook event
└──────┬───────┘
       │ HTTPS POST
       │ (JSON Payload)
       ▼
┌──────────────────┐
│ VECTOR Backend   │  POST /webhooks/janeapp
│  (FastAPI API)   │  → Validates payload
│                  │  → Extracts metrics
│                  │  → Writes to metric_recordings
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   SQLite DB      │  metric_recordings table updated
│  (vector.db)     │  → Criteria evaluation triggered
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ TRAJECTORY UI    │  Client dashboard refreshes
│  (Frontend)      │  → Phase status updates if criteria met
└──────────────────┘
```

### 3.2 Data Flow
1. **Clinician Action**: During or after a treatment session, the clinician fills out a SOAP note in JaneApp with structured measurements (e.g., "Knee Extension: 3°").
2. **Webhook Trigger**: JaneApp sends a webhook to `https://vector.calgarystrength.com/webhooks/janeapp` (or dev URL).
3. **Payload Processing**: VECTOR validates the webhook signature, extracts relevant metrics, and maps them to the client's journey.
4. **Database Update**: New records are inserted into `metric_recordings`.
5. **Criteria Evaluation**: VECTOR checks if the new metrics satisfy any pending exit criteria.
6. **UI Update**: If criteria are met, the phase status is updated, and the client sees the change on their next dashboard refresh.

---

## 4. Webhook Specification

### 4.1 Endpoint
```
POST /webhooks/janeapp
```

### 4.2 Authentication
JaneApp webhooks include a signature header:
```
X-Jane-Signature: sha256=<HMAC_SIGNATURE>
```

VECTOR must:
1. Retrieve the shared secret from environment variables (`JANEAPP_WEBHOOK_SECRET`).
2. Compute `HMAC-SHA256(request_body, secret)`.
3. Compare the computed signature to the header value.
4. Reject the request if they don't match (401 Unauthorized).

### 4.3 Expected Payload (Example)

When a treatment note is created or updated, JaneApp sends:

```json
{
  "event": "treatment_note.created",
  "timestamp": "2026-02-13T21:30:00Z",
  "patient": {
    "id": "jane_patient_12345",
    "external_id": "CLT_DEMO_01",  // Mapped to VECTOR client_id
    "name": "Marcus D."
  },
  "appointment": {
    "id": "jane_appt_67890",
    "date": "2026-02-13",
    "practitioner": "Dr. Sarah L."
  },
  "treatment_note": {
    "id": "jane_note_11111",
    "soap_template": "ACL Rehab Progress Check",
    "fields": [
      {
        "label": "Knee Extension (Passive)",
        "value": "3",
        "unit": "degrees"
      },
      {
        "label": "Quad Lag",
        "value": "0",
        "unit": "degrees"
      },
      {
        "label": "Pain Level (VAS)",
        "value": "1",
        "unit": "0-10"
      },
      {
        "label": "Effusion (Stroke Test)",
        "value": "1",
        "unit": "grade (0-3)"
      }
    ],
    "narrative": "Patient reports decreased morning stiffness. ROM slightly improved from last week."
  }
}
```

### 4.4 Payload Mapping to VECTOR Schema

| JaneApp Field | VECTOR Field | Notes |
|---|---|---|
| `patient.external_id` | `clients.id` | Must be pre-mapped (manually or via initial setup) |
| `treatment_note.fields[].label` | `exit_criteria.metric_name` | Requires fuzzy matching or exact template design |
| `treatment_note.fields[].value` | `metric_recordings.recorded_value` | Raw numeric or string value |
| `treatment_note.fields[].unit` | `metric_recordings.measurement_unit` | For display purposes |
| `appointment.date` | `metric_recordings.recorded_at` | Timestamp of measurement |

### 4.5 Field Matching Strategy

**Problem**: The `label` in JaneApp (e.g., "Knee Extension (Passive)") must map to a specific `criterion_id` in VECTOR.

**Solution Options**:
1. **Exact Match**: JaneApp templates use exact criterion labels from VECTOR.
   - **Pro**: Simple, reliable.
   - **Con**: Requires template customization in JaneApp.
2. **Fuzzy Matching**: Use string similarity (e.g., Levenshtein distance) to match labels.
   - **Pro**: Flexible for clinician input.
   - **Con**: Risk of incorrect matches.
3. **Hybrid**: Use a lookup table + fuzzy fallback.

**Recommended**: **Exact Match** with a standardized JaneApp SOAP template that clinicians use for VECTOR-enrolled clients.

---

## 5. Implementation Plan

### 5.1 Backend Changes (`backend/main.py`)

Add a new endpoint:

```python
from fastapi import Request, HTTPException
import hmac
import hashlib
import os
from datetime import datetime

JANEAPP_SECRET = os.getenv("JANEAPP_WEBHOOK_SECRET")

@app.post("/webhooks/janeapp")
async def janeapp_webhook(request: Request):
    # 1. Verify Signature
    signature = request.headers.get("X-Jane-Signature", "")
    body = await request.body()
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
    
    # 3. Extract Client ID
    client_id = data["patient"]["external_id"]
    if not client_id:
        raise HTTPException(status_code=400, detail="Missing external_id")
    
    # 4. Get Active Journey
    conn = get_db_connection()
    journey = conn.execute("""
        SELECT id, current_phase_id 
        FROM client_journeys 
        WHERE client_id = ? AND status = 'active'
    """, (client_id,)).fetchone()
    
    if not journey:
        return {"status": "ignored", "reason": "No active journey"}
    
    # 5. Process Metrics
    fields = data["treatment_note"]["fields"]
    recorded_at = data["appointment"]["date"]
    
    for field in fields:
        label = field["label"]
        value = field["value"]
        unit = field.get("unit", "")
        
        # Find matching criterion
        criterion = conn.execute("""
            SELECT ec.id, ec.metric_name
            FROM exit_criteria ec
            WHERE ec.phase_id = ? 
            AND (ec.metric_name = ? OR ec.description LIKE ?)
        """, (journey["current_phase_id"], label, f"%{label}%")).fetchone()
        
        if criterion:
            # Insert metric recording
            conn.execute("""
                INSERT INTO metric_recordings 
                (id, journey_id, phase_id, criterion_id, metric_name, 
                 recorded_value, measurement_unit, recorded_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f"REC_{datetime.now().timestamp()}",
                journey["id"],
                journey["current_phase_id"],
                criterion["id"],
                criterion["metric_name"],
                value,
                unit,
                recorded_at
            ))
    
    conn.commit()
    conn.close()
    
    return {"status": "success", "metrics_recorded": len(fields)}
```

### 5.2 JaneApp Configuration

1. **Create Custom SOAP Template**:
   - Template Name: "VECTOR Progress Check"
   - Fields (must match VECTOR `metric_name`):
     - `knee_extension` (numeric, degrees)
     - `quad_lag` (numeric, degrees)
     - `pain_level` (numeric, 0-10)
     - `effusion` (numeric, 0-3)

2. **Setup Webhook**:
   - Navigate to JaneApp Admin → Integrations → Webhooks.
   - Add new webhook:
     - **URL**: `https://vector.calgarystrength.com/webhooks/janeapp`
     - **Events**: `treatment_note.created`
     - **Secret**: Generate and store in VECTOR environment variables.

### 5.3 Testing Strategy

1. **Unit Tests**: Mock JaneApp payloads and verify:
   - Signature validation works.
   - Metrics are correctly extracted and stored.
2. **Integration Test**: Use JaneApp's webhook testing tool to send a real payload to the dev server.
3. **End-to-End Test**: Complete a treatment note in JaneApp and verify the TRAJECTORY dashboard updates.

---

## 6. Security Considerations

1. **HTTPS Only**: Webhook endpoint must use TLS.
2. **Signature Verification**: Always validate `X-Jane-Signature`.
3. **Rate Limiting**: Prevent abuse by limiting webhook requests (e.g., 100/hour per client).
4. **Idempotency**: Use `treatment_note.id` to prevent duplicate recordings if JaneApp retries.
5. **PHI Compliance**: Ensure all data handling complies with PIPEDA (Canada) or applicable regulations.

---

## 7. Future Enhancements

1. **Bi-Directional Sync**: Update JaneApp when a client completes a phase in VECTOR.
2. **NLP for Narrative Notes**: Extract metrics from unstructured clinician notes using GPT-4.
3. **Multi-Clinic Support**: Extend integration to other EMRs (SimplePractice, Cliniko).
4. **Automated Phase Unlocking**: Trigger email/SMS notifications when a client advances.

---

## 8. Acceptance Criteria

Phase 2 (Integration) is complete when:
- [x] Backend API serves dynamic journey data.
- [x] Frontend fetches and renders real-time data.
- [x] Audit layer (rationale + sources) is visible.
- [ ] JaneApp webhook endpoint implemented and tested.
- [ ] At least one real client journey updated via webhook.
- [ ] Documentation for clinicians on using the VECTOR SOAP template.

---

**Document Status:** Draft for Review  
**Next Action:** Implement `/webhooks/janeapp` endpoint and test with JaneApp staging environment.
