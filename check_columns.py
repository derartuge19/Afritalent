import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "dere2010")
POSTGRES_SERVER = os.getenv("POSTGRES_SERVER", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "AfriTalent")

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

try:
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns('seeker_profiles')]
    print(f"Columns in seeker_profiles: {columns}")
    
    if 'phone' in columns:
        print("Success: 'phone' column exists.")
    else:
        print("Error: 'phone' column is MISSING!")
        
except Exception as e:
    print(f"Failed to check schema: {e}")
