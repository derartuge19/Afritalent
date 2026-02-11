from sqlalchemy import create_engine, text
from app.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        print("Checking for 'views' column in 'jobs' table...")
        # Check if column exists
        check_query = text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='jobs' AND column_name='views';
        """)
        result = conn.execute(check_query).fetchone()
        
        if not result:
            print("Adding 'views' column...")
            conn.execute(text("ALTER TABLE jobs ADD COLUMN views INTEGER DEFAULT 0;"))
            conn.commit()
            print("Migration successful: 'views' column added.")
        else:
            print("Column 'views' already exists.")

if __name__ == "__main__":
    migrate()
