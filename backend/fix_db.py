from sqlalchemy import text
from app.database import engine
import os

def fix_db():
    print("Checking database schema...")
    with engine.connect() as conn:
        # Check columns in seeker_profiles
        try:
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='seeker_profiles'"))
            columns = [row[0] for row in result]
            print(f"Current columns: {columns}")
            
            missing = []
            if 'education' not in columns:
                missing.append('education')
            if 'experience' not in columns:
                missing.append('experience')
                
            if not missing:
                print("No columns missing.")
                return
                
            print(f"Missing columns: {missing}")
            for col in missing:
                print(f"Adding column {col}...")
                conn.execute(text(f"ALTER TABLE seeker_profiles ADD COLUMN {col} TEXT"))
                print(f"Added column {col}")
            
            conn.commit()
            print("Database schema updated successfully.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    fix_db()
