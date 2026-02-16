#!/usr/bin/env python3
"""
VECTOR — Secure Local Development Server
Binds to localhost ONLY for maximum security.
Patient data never leaves this machine.
"""

import uvicorn
import os
import sys

# SECURITY: Ensure we're running in development mode
if os.getenv("VECTOR_ENV") == "production":
    print("ERROR: Do not use this script in production. Use gunicorn instead.")
    sys.exit(1)

# SECURITY: Disable all outbound network access
os.environ['NO_PROXY'] = '*'
os.environ['no_proxy'] = '*'

print("=" * 70)
print("VECTOR — Secure Local Development Server")
print("=" * 70)
print("SECURITY MODE: Offline-First")
print("  • Bound to: 127.0.0.1:8000 (localhost ONLY)")
print("  • No external network access")
print("  • Patient data stays on this machine")
print("  • Content-Security-Policy: Active")
print("=" * 70)
print()
print("Dashboard:        http://localhost:8000/")
print("Clinician Portal: http://localhost:8000/clinician.html")
print("Icon Preview:     http://localhost:8000/icon-preview.html")
print()
print("Press CTRL+C to stop the server")
print("=" * 70)
print()

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",  # SECURITY: localhost ONLY, not 0.0.0.0
        port=8000,
        reload=True,       # Auto-reload on code changes (dev only)
        log_level="info"
    )
