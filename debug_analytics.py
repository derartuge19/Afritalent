import sys
import os

# Create a direct connection to backend
sys.path.append(os.path.abspath("backend"))

from app import crud, models, database
from app.database import SessionLocal

def debug_analytics():
    db = SessionLocal()
    try:
        print("Testing get_employer_metrics...")
        # Get an employer ID. Assuming user 2 is employer based on logs/previous context, or find one.
        employer_user = db.query(models.User).filter(models.User.role == "employer").first()
        if not employer_user:
            print("No employer found. Creating one...")
            # skipping creation for brevity, assuming one exists or using ID 1 if none found
            employer_id = 1 
        else:
            if not employer_user.employer_profile:
                profile = models.EmployerProfile(user_id=employer_user.id)
                db.add(profile)
                db.commit()
            employer_id = employer_user.employer_profile.id
            print(f"Using Employer ID: {employer_id}")

        metrics = crud.get_employer_metrics(db, employer_id)
        print(f"Metrics: {metrics}")

        print("\nTesting get_recent_applicants...")
        recent = crud.get_recent_applicants(db, employer_id)
        print(f"Recent Applicants: {recent}")

        print("\nTesting get_application_trends...")
        trends = crud.get_application_trends(db, employer_id)
        print(f"Trends: {trends}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_analytics()
