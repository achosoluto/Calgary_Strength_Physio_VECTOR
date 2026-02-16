import os
import sqlite3
from pathlib import Path
import sys

# Add scripts dir to path to import load_base
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from load_base import load_seed_data
except ImportError:
    # Fallback if running from root and scripts is not a package
    sys.path.append('scripts')
    from load_base import load_seed_data

DB_DIR = Path("database/data")
DB_PATH = DB_DIR / "vector.db"
SCHEMA_PATH = Path("database/schema/v_core.sql")

def init_db():
    print("Initializing Database...")
    
    # 1. Ensure clean slate (Delete existing DB)
    if DB_PATH.exists():
        print(f"Removing existing database at {DB_PATH}...")
        try:
            os.remove(DB_PATH)
        except OSError as e:
            print(f"Error removing database: {e}")
            # Continue anyway, might be permission issue but we'll try to execute script
            
    # 2. Ensure directory exists
    if not DB_DIR.exists():
        print(f"Creating directory: {DB_DIR}")
        DB_DIR.mkdir(parents=True, exist_ok=True)
        
    # 3. Initialize Schema
    print(f"Applying schema from {SCHEMA_PATH}...")
    if not SCHEMA_PATH.exists():
        print(f"Error: Schema file not found at {SCHEMA_PATH}")
        sys.exit(1)
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    with open(SCHEMA_PATH, 'r') as f:
        schema_sql = f.read()
        cursor.executescript(schema_sql)
        
    conn.commit()
    conn.close()
    print("Schema applied successfully.")

    # 3. Load Seed Data
    print("Loading seed data...")
    load_seed_data()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
