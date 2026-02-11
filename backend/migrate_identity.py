from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "dere2010")
POSTGRES_SERVER = os.getenv("POSTGRES_SERVER", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "AfriTalent")

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL)

def migrate():
    print(f"Connecting to {DATABASE_URL}...")
    with engine.connect() as conn:
        print("Adding identity columns to employer_profiles...")
        try:
            conn.execute(text("ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS first_name VARCHAR;"))
            conn.execute(text("ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS last_name VARCHAR;"))
            conn.execute(text("ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR;"))
            conn.commit()
            print("Migration successful!")
        except Exception as e:
            print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
