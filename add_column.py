import sys
import os
from sqlalchemy import text

# Create a direct connection to backend
sys.path.append(os.path.abspath("backend"))

from app.database import SessionLocal

def add_column():
    db = SessionLocal()
    try:
        print("Adding cv_html column to seeker_profiles...")
        # Check if column exists first to avoid error? Or just try/except
        try:
            # Using specific SQLite syntax or standard SQL
            # SQLAlchemy text() allows raw SQL execution
            db.execute(text("ALTER TABLE seeker_profiles ADD COLUMN cv_html TEXT"))
            db.commit()
            print("Column added successfully.")
        except Exception as e:
            print(f"Error adding column (maybe it exists?): {e}")
            db.rollback()
            
    finally:
        db.close()

if __name__ == "__main__":
    add_column()
