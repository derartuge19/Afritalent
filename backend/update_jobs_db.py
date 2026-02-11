from sqlalchemy import create_engine, text
import os
import sys

# Add backend directory to path so we can import from app
sys.path.append(os.path.join(os.getcwd(), "backend"))
from app.config import settings

print(f"Connecting to: {settings.DATABASE_URL}")

engine = create_engine(settings.DATABASE_URL)

columns_to_add = [
    ("salary_min", "INTEGER DEFAULT 0"),
    ("salary_max", "INTEGER DEFAULT 0"),
    ("experience_level", "VARCHAR")
]

with engine.connect() as conn:
    for col_name, col_type in columns_to_add:
        try:
            # Check if column exists first (Postgres specific check)
            check_sql = text(f"""
                SELECT COUNT(*) 
                FROM information_schema.columns 
                WHERE table_name='jobs' AND column_name='{col_name}';
            """)
            result = conn.execute(check_sql).scalar()
            
            if result == 0:
                print(f"Adding column {col_name}...")
                conn.execute(text(f"ALTER TABLE jobs ADD COLUMN {col_name} {col_type}"))
                print(f"Successfully added {col_name}.")
            else:
                print(f"Column {col_name} already exists.")
        except Exception as e:
            print(f"Error processing {col_name}: {e}")
    
    conn.commit()

print("Migration completed.")
