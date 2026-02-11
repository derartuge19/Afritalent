import sys
import os

# Add current directory to path so we can import backend
sys.path.append(os.getcwd())

from backend.app.database import SessionLocal
from backend.app import models, schemas

db = SessionLocal()

print("Checking Jobs...")
jobs = db.query(models.Job).all()
for j in jobs:
    print(f"Job ID: {j.id}, Title: {j.title}, Status: {j.status}")
    try:
        schemas.JobResponse.model_validate(j)
    except Exception as e:
        print(f"VALIDATION ERROR for Job {j.id}: {e}")

print("\nChecking Applications...")
apps = db.query(models.Application).all()
for a in apps:
    print(f"App ID: {a.id}, Status: '{a.status}', Seeker ID: {a.seeker_id}, Job ID: {a.job_id}")
    try:
        schemas.ApplicationResponse.model_validate(a)
    except Exception as e:
        print(f"VALIDATION ERROR for App {a.id}: {e}")
