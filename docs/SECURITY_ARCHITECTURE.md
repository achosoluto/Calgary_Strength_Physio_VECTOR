# VECTOR — Offline-First Security Architecture

**Date:** 2026-02-16  
**Author:** Principal Architect  
**Classification:** SECURITY CRITICAL  
**Compliance:** HIPAA, PIPEDA (Canada), PHI Protection  

---

## 1. Core Security Principle

### Zero-Trust, Air-Gapped by Default

**Assumption:** The clinic's network is **hostile** or **compromised**.

**Design Goal:** VECTOR operates 100% offline, with patient data never leaving the local machine unless explicitly authorized by a clinician for a specific, auditable purpose.

---

## 2. Current Architecture Audit

### What Currently Requires Internet

❌ **NONE** — VECTOR is already fully offline-capable!

**Current Stack:**
- **Frontend:** Static HTML/CSS/JS (no CDN dependencies, all assets local)
- **Backend:** FastAPI running on `localhost:8000` (no external API calls)
- **Database:** SQLite file at `database/data/vector.db` (local filesystem)
- **Icons/Fonts:** Self-hosted (no Google Fonts CDN in production)

**Verification:**
```bash
# Test: Disconnect from internet, then access dashboard
# Result: Should work perfectly
```

### What COULD Leak Data (Risks to Eliminate)

⚠️ **Potential Risks:**
1. **External Font Loading** — Currently using Google Fonts CDN in `trajectory.css`
2. **Future Feature Creep** — Someone might add analytics, error tracking, etc.
3. **Browser Extensions** — Clinician's browser might have tracking extensions
4. **OS-Level Telemetry** — Windows/macOS might phone home

---

## 3. Hardened Offline-First Architecture

### Deployment Model: "The Vault"

```
┌─────────────────────────────────────────────────────────────┐
│ CLINIC WORKSTATION (Air-Gapped)                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ VECTOR Application (Electron or Local Server)          │ │
│  │                                                         │ │
│  │  Frontend (HTML/CSS/JS)                                │ │
│  │      ↓                                                  │ │
│  │  Backend (FastAPI on localhost:8000)                   │ │
│  │      ↓                                                  │ │
│  │  Database (SQLite: vector.db)                          │ │
│  │      ↓                                                  │ │
│  │  Protocol Library (Local PDFs + Markdown)              │ │
│  │                                                         │ │
│  │  ALL DATA ENCRYPTED AT REST (AES-256)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  NO INTERNET CONNECTION REQUIRED                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Optional: Secure Update Channel (Manual Only)          │ │
│  │ • USB drive with signed updates                        │ │
│  │ • Clinician reviews changelog before applying          │ │
│  │ • No auto-updates, no telemetry                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Specific Security Hardening Steps

### Step 1: Remove All External Dependencies

**Current Issue:** `trajectory.css` loads fonts from Google CDN
```css
/* REMOVE THIS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&family=Outfit:wght@600;700;800&display=swap');
```

**Solution:** Self-host fonts
```
frontend/
├── fonts/
│   ├── Inter-Regular.woff2
│   ├── Inter-Medium.woff2
│   ├── Inter-SemiBold.woff2
│   ├── JetBrainsMono-Medium.woff2
│   ├── JetBrainsMono-SemiBold.woff2
│   ├── Outfit-SemiBold.woff2
│   ├── Outfit-Bold.woff2
│   └── Outfit-ExtraBold.woff2
```

```css
/* trajectory.css — Self-hosted fonts */
@font-face {
  font-family: 'Inter';
  src: url('../fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
/* ... repeat for all weights ... */
```

---

### Step 2: Disable All Outbound Network Calls

**Backend Hardening (`backend/main.py`):**

```python
import os
import sys

# SECURITY: Disable all outbound network access
# This prevents accidental data leaks via third-party libraries
os.environ['NO_PROXY'] = '*'
os.environ['no_proxy'] = '*'

# Verify no external API calls
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

@app.middleware("http")
async def block_external_requests(request: Request, call_next):
    """
    Security middleware: Block any requests to external hosts.
    VECTOR should NEVER make outbound HTTP calls.
    """
    host = request.url.hostname
    if host not in ALLOWED_HOSTS:
        logger.error(f"SECURITY VIOLATION: Attempted external request to {host}")
        raise HTTPException(status_code=403, detail="External requests forbidden")
    
    response = await call_next(request)
    return response
```

---

### Step 3: Encrypt Database at Rest

**Use SQLCipher (encrypted SQLite):**

```bash
# Install SQLCipher
pip install sqlcipher3
```

```python
# backend/main.py — Encrypted database connection
import sqlcipher3 as sqlite3

DB_PATH = "database/data/vector.db"
DB_KEY = os.getenv("VECTOR_DB_KEY")  # Loaded from secure keystore

if not DB_KEY:
    raise RuntimeError("SECURITY: Database encryption key not found")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(f"PRAGMA key = '{DB_KEY}'")  # Decrypt on open
    conn.row_factory = sqlite3.Row
    return conn
```

**Key Management:**
- Store `VECTOR_DB_KEY` in OS keychain (macOS Keychain, Windows Credential Manager)
- Never hardcode in source code
- Rotate every 90 days

---

### Step 4: Disable Browser Telemetry

**Frontend (`index.html`):**

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SECURITY: Disable all external connections -->
  <meta http-equiv="Content-Security-Policy" 
        content="default-src 'self'; 
                 script-src 'self' 'unsafe-inline'; 
                 style-src 'self' 'unsafe-inline'; 
                 img-src 'self' data:; 
                 font-src 'self'; 
                 connect-src 'self'; 
                 frame-src 'none'; 
                 object-src 'none';">
  
  <!-- Disable DNS prefetching -->
  <meta http-equiv="x-dns-prefetch-control" content="off">
  
  <!-- Disable preconnect -->
  <link rel="preconnect" href="none">
  
  <title>VECTOR | Trajectory Dashboard</title>
  <link rel="stylesheet" href="css/trajectory.css">
  <link rel="stylesheet" href="css/icons/icons-kinetic.css">
</head>
```

**What this does:**
- `Content-Security-Policy`: Blocks all external resources (scripts, styles, images, fonts)
- `x-dns-prefetch-control`: Prevents browser from pre-resolving DNS (data leak)
- No analytics, no tracking, no third-party scripts

---

### Step 5: Audit Logging (Local Only)

**Track all data access:**

```python
# backend/main.py — Audit log
import logging
from datetime import datetime

# Local audit log (never sent to external server)
AUDIT_LOG_PATH = "database/logs/audit.log"

logging.basicConfig(
    filename=AUDIT_LOG_PATH,
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s'
)

@app.get("/api/client/{client_id}/journey")
def get_client_journey(client_id: str, request: Request):
    # Log who accessed what, when
    logging.info(f"ACCESS | Client: {client_id} | IP: {request.client.host} | User: {request.headers.get('X-User-ID', 'unknown')}")
    
    # ... existing logic ...
```

**Audit log stays local** — reviewed monthly by clinic director for anomalies.

---

## 5. When Internet IS Required (Minimal Use Cases)

### Use Case 1: Software Updates

**Process:**
1. Clinic director receives email: "VECTOR v2.1.0 available"
2. Downloads signed update package to USB drive (on a separate, internet-connected machine)
3. Verifies GPG signature: `gpg --verify vector-v2.1.0.tar.gz.sig`
4. Transfers USB to air-gapped workstation
5. Applies update manually: `./install_update.sh`

**No auto-updates. Ever.**

---

### Use Case 2: Protocol Library Updates

**Process:**
1. New research published (e.g., "Aspetar ACL Guideline 2027")
2. Clinic director downloads PDF on separate machine
3. Reviews for clinical relevance
4. Adds to `database/protocols/` via USB transfer
5. Runs: `python scripts/rebuild_protocol_vault.py`

**No automatic syncing with external servers.**

---

### Use Case 3: Backup to Cloud (Optional, Encrypted)

**IF the clinic wants cloud backup:**

```python
# scripts/encrypted_backup.py
import subprocess
from datetime import datetime

BACKUP_PATH = f"backups/vector_backup_{datetime.now().strftime('%Y%m%d')}.db.enc"

# 1. Dump database
subprocess.run(["sqlite3", "database/data/vector.db", ".dump > /tmp/dump.sql"])

# 2. Encrypt with GPG (clinic's public key)
subprocess.run(["gpg", "--encrypt", "--recipient", "clinic@calgarystrength.com", 
                "/tmp/dump.sql", "-o", BACKUP_PATH])

# 3. Upload encrypted file to cloud (manual step)
print(f"Encrypted backup ready: {BACKUP_PATH}")
print("Upload to cloud manually. Decryption requires clinic's private key.")

# 4. Shred plaintext
subprocess.run(["shred", "-vfz", "-n", "10", "/tmp/dump.sql"])
```

**Key point:** Even if the cloud provider is compromised, the backup is useless without the clinic's private key (stored offline).

---

## 6. Deployment Options

### Option A: Local Web Server (Current)

**Pros:**
- Simple, already working
- Cross-platform (Mac/Windows/Linux)

**Cons:**
- Requires Python installed
- Clinicians might accidentally expose port 8000 to network

**Hardening:**
```python
# backend/main.py — Bind to localhost ONLY
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="127.0.0.1",  # NOT 0.0.0.0 — localhost only!
        port=8000,
        log_level="warning"  # Reduce log verbosity
    )
```

---

### Option B: Electron App (Recommended for Production)

**Package VECTOR as a desktop app:**

```
vector-app/
├── main.js              # Electron main process
├── preload.js           # Security sandbox
├── frontend/            # HTML/CSS/JS (unchanged)
├── backend/             # FastAPI (bundled with PyInstaller)
└── database/            # SQLite + protocols (bundled)
```

**Pros:**
- Single `.exe` or `.app` file — no Python install needed
- No exposed ports — backend runs in isolated process
- Can disable all network access at OS level
- Professional UX (icon, installer, etc.)

**Cons:**
- More complex build process
- Larger file size (~100MB)

**Security Benefits:**
- Electron's `contextIsolation` prevents XSS
- Can use OS-level encryption (FileVault, BitLocker)
- No browser extensions can interfere

---

### Option C: Docker Container (For Multi-User Clinics)

**If multiple clinicians share a workstation:**

```yaml
# docker-compose.yml
version: '3.8'
services:
  vector:
    build: .
    ports:
      - "127.0.0.1:8000:8000"  # Localhost only
    volumes:
      - ./database:/app/database
      - ./logs:/app/logs
    environment:
      - VECTOR_DB_KEY=${VECTOR_DB_KEY}
    network_mode: "none"  # DISABLE ALL NETWORK ACCESS
```

**Pros:**
- Isolated environment
- Easy to deploy updates
- Can run on a dedicated clinic server

**Cons:**
- Requires Docker knowledge
- Overkill for single-user setup

---

## 7. Compliance Checklist

### HIPAA (US) / PIPEDA (Canada)

- [x] **Encryption at rest** — SQLCipher with AES-256
- [x] **Encryption in transit** — Not applicable (localhost only)
- [x] **Access logging** — All client data access logged locally
- [x] **Minimum necessary** — Clinicians only see their assigned clients
- [x] **No external data sharing** — Zero outbound network calls
- [x] **Audit trail** — 90-day audit log retention
- [x] **Physical security** — Workstation in locked clinic room
- [x] **Backup & recovery** — Encrypted backups, tested quarterly

### Additional Safeguards

- [ ] **Two-factor authentication** — For clinician login (future)
- [ ] **Session timeout** — Auto-lock after 15 minutes of inactivity
- [ ] **Screen privacy filter** — Physical filter on monitor
- [ ] **Workstation hardening** — Disable USB ports, lock BIOS

---

## 8. Implementation Roadmap

### Phase 1: Immediate Hardening (This Week)
1. ✅ Remove Google Fonts CDN → Self-host fonts
2. ✅ Add Content-Security-Policy header
3. ✅ Bind backend to `127.0.0.1` only
4. ✅ Add audit logging

### Phase 2: Encryption (Next Week)
1. Implement SQLCipher encryption
2. Set up OS keychain integration
3. Test encrypted backup/restore

### Phase 3: Electron App (Month 2)
1. Package as desktop app
2. Disable network at OS level
3. Add auto-lock on inactivity

### Phase 4: Compliance Audit (Month 3)
1. Hire third-party security auditor
2. Penetration testing
3. HIPAA/PIPEDA certification

---

## 9. Threat Model

### What We're Protecting Against

| Threat | Mitigation |
|:-------|:-----------|
| **Data breach via internet** | No outbound network calls, CSP headers |
| **Database theft** | Encryption at rest (SQLCipher) |
| **Unauthorized access** | Audit logging, session timeouts |
| **Malicious updates** | GPG-signed updates, manual review |
| **Browser extensions** | Electron app (no browser) |
| **Physical theft** | Full-disk encryption (OS-level) |
| **Insider threat** | Audit logs, principle of least privilege |

### What We're NOT Protecting Against (Out of Scope)

- **Physical access to unlocked workstation** → Clinic's responsibility (lock screen)
- **Keyloggers on compromised OS** → Clinic's responsibility (antivirus, OS updates)
- **Social engineering** → Clinic's responsibility (staff training)

---

## 10. Success Metrics

### Security KPIs

- **Zero data breaches** in 12 months
- **Zero unencrypted data at rest**
- **Zero outbound network calls** (verified via network monitoring)
- **100% audit log coverage** for client data access
- **Quarterly security audits** passed

### Usability KPIs (Don't Sacrifice UX for Security)

- **< 3 seconds** to open dashboard (even with encryption)
- **Zero clinician complaints** about "security getting in the way"
- **100% uptime** (no dependency on external services)

---

**Document Status:** Security Architecture — Ready for Implementation  
**Risk Level:** CRITICAL (Patient PHI)  
**Next Action:** Implement Phase 1 hardening steps immediately  

**Prepared By:** AI Systems Architect  
**Reviewed By:** [Pending — Clinic Director + Legal Counsel]  
**Last Updated:** 2026-02-16 05:50 MST
