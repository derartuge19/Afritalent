from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- User CRUD ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_seeker_profile(db: Session, profile: schemas.SeekerProfileCreate, user_id: int):
    db_profile = models.SeekerProfile(**profile.dict(), user_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def create_employer_profile(db: Session, profile: schemas.EmployerProfileCreate, user_id: int):
    db_profile = models.EmployerProfile(**profile.dict(), user_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# --- Job CRUD ---
def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()

def get_job(db: Session, job_id: int):
    return db.query(models.Job).filter(models.Job.id == job_id).first()

def create_job(db: Session, job: schemas.JobCreate, employer_id: int):
    db_job = models.Job(**job.dict(), employer_id=employer_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

# --- Application CRUD ---
def create_application(db: Session, application: schemas.ApplicationCreate, seeker_id: int):
    # Mock AI Match Score logic
    import random
    match_score = round(random.uniform(60.0, 95.0), 1)
    
    db_application = models.Application(
        job_id=application.job_id,
        seeker_id=seeker_id,
        match_score=match_score
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def get_application_by_seeker_and_job(db: Session, seeker_id: int, job_id: int):
    return db.query(models.Application).filter(
        models.Application.seeker_id == seeker_id,
        models.Application.job_id == job_id
    ).first()

def get_applications_by_seeker(db: Session, seeker_id: int):
    return db.query(models.Application).filter(models.Application.seeker_id == seeker_id).all()

# --- Saved Job CRUD ---
def create_saved_job(db: Session, saved_job: schemas.SavedJobCreate, seeker_id: int):
    db_saved_job = models.SavedJob(**saved_job.dict(), seeker_id=seeker_id)
    db.add(db_saved_job)
    db.commit()
    db.refresh(db_saved_job)
    return db_saved_job

def get_saved_jobs_by_seeker(db: Session, seeker_id: int):
    return db.query(models.SavedJob).filter(models.SavedJob.seeker_id == seeker_id).all()

def get_saved_job_by_seeker_and_job(db: Session, seeker_id: int, job_id: int):
    return db.query(models.SavedJob).filter(
        models.SavedJob.seeker_id == seeker_id,
        models.SavedJob.job_id == job_id
    ).first()

def delete_saved_job(db: Session, saved_job_id: int):
    db_saved_job = db.query(models.SavedJob).filter(models.SavedJob.id == saved_job_id).first()
    if db_saved_job:
        db.delete(db_saved_job)
        db.commit()
    return db_saved_job
