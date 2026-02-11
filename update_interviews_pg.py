import sys
import os
from sqlalchemy import create_engine, text

# Add current directory to path so we can import backend
sys.path.append(os.getcwd())

from backend.app.config import settings

engine = create_engine(settings.DATABASE_URL)

def update_db():
    with engine.connect() as connection:
        # Check if column exists
        check_query = text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='interviews' AND column_name='seeker_notes';
        """)
        result = connection.execute(check_query).fetchone()
        
        if not result:
            print("Adding seeker_notes column to interviews table...")
            try:
                connection.execute(text("ALTER TABLE interviews ADD COLUMN seeker_notes TEXT;"))
                connection.commit()
                print("Successfully added seeker_notes column.")
            except Exception as e:
                print(f"Error adding column: {e}")
        else:
            print("Column seeker_notes already exists.")

if __name__ == "__main__":
    try:
        update_db()
    except Exception as e:
        print(f"Failed to connect or update database: {e}")
