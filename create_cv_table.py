import sys
import os
from sqlalchemy import text

# Create a direct connection to backend
sys.path.append(os.path.abspath("backend"))

from app.database import SessionLocal, engine, Base
from app import models

def create_table():
    print("Creating tables...")
    # Base.metadata.create_all(bind=engine) should create missing tables (cvs).
    # But it won't add columns to existing tables (cv_id to applications).
    
    Base.metadata.create_all(bind=engine)
    print("Tables created (if missing).")
    
    db = SessionLocal()
    try:
        print("Adding cv_id column to applications...")
        try:
            # Check if column exists first to avoid error? Or just try/except
            # SQLite supports adding column but Foreign Key constraints might be tricky if not enabled.
            # But here we just add integer column.
            db.execute(text("ALTER TABLE applications ADD COLUMN cv_id INTEGER REFERENCES cvs(id)"))
            db.commit()
            print("Column added successfully.")
        except Exception as e:
            print(f"Error adding column (maybe it exists?): {e}")
            db.rollback()
            
    finally:
        db.close()

if __name__ == "__main__":
    create_table()
