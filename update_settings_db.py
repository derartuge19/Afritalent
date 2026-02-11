import sys
import os
from sqlalchemy import create_engine, text

# Add current directory to path so we can import backend
sys.path.append(os.getcwd())

from backend.app.config import settings

engine = create_engine(settings.DATABASE_URL)

def update_db():
    with engine.connect() as connection:
        # 1. Update seeker_profiles table
        print("Updating seeker_profiles table with job preference columns...")
        alter_profiles_query = text("""
            ALTER TABLE seeker_profiles 
            ADD COLUMN IF NOT EXISTS job_type VARCHAR,
            ADD COLUMN IF NOT EXISTS work_mode VARCHAR,
            ADD COLUMN IF NOT EXISTS experience_level VARCHAR,
            ADD COLUMN IF NOT EXISTS min_salary VARCHAR,
            ADD COLUMN IF NOT EXISTS preferred_locations TEXT;
        """)
        
        # 2. Create user_settings table
        print("Creating user_settings table...")
        create_settings_query = text("""
            CREATE TABLE IF NOT EXISTS user_settings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                email_job_alerts BOOLEAN DEFAULT TRUE,
                email_application_updates BOOLEAN DEFAULT TRUE,
                email_weekly_digest BOOLEAN DEFAULT FALSE,
                push_job_alerts BOOLEAN DEFAULT TRUE,
                push_messages BOOLEAN DEFAULT TRUE,
                sms_interviews BOOLEAN DEFAULT TRUE,
                profile_visible BOOLEAN DEFAULT TRUE,
                show_salary BOOLEAN DEFAULT FALSE,
                allow_messages BOOLEAN DEFAULT TRUE,
                show_activity BOOLEAN DEFAULT FALSE
            );
        """)
        
        try:
            connection.execute(alter_profiles_query)
            connection.execute(create_settings_query)
            connection.commit()
            print("Successfully updated database schema.")
        except Exception as e:
            print(f"Error updating database: {e}")

if __name__ == "__main__":
    try:
        update_db()
    except Exception as e:
        print(f"Failed to connect or update database: {e}")
