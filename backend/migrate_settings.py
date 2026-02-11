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
        print("Adding employer notification columns to user_settings...")
        try:
            conn.execute(text("ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS email_new_applicants BOOLEAN DEFAULT TRUE;"))
            conn.execute(text("ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS email_interview_responses BOOLEAN DEFAULT TRUE;"))
            conn.commit()
            print("Migration successful!")
        except Exception as e:
            print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
