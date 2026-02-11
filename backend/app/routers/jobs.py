from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user
from ..utils.notification_logic import trigger_job_alerts

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("/", response_model=List[schemas.JobResponse])
def read_jobs(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None, 
    location: Optional[str] = None, 
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    salary_min: Optional[int] = None,
    db: Session = Depends(get_db)
):
    jobs = crud.get_jobs(db, skip=skip, limit=limit, search=search, location=location, job_type=job_type, experience_level=experience_level, salary_min=salary_min)
    return jobs

@router.get("/my-jobs", response_model=List[schemas.JobResponse])
def read_my_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.EMPLOYER or not current_user.employer_profile:
        raise HTTPException(status_code=403, detail="Only employers can view their jobs")
    return crud.get_employer_jobs(db, employer_id=current_user.employer_profile.id)

@router.post("/", response_model=schemas.JobResponse)
def create_job(
    job: schemas.JobCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can post jobs")
    
    # Ensure employer profile exists
    if not current_user.employer_profile:
        employer_profile = models.EmployerProfile(user_id=current_user.id)
        db.add(employer_profile)
        db.commit()
        db.refresh(employer_profile)
        db.refresh(current_user)
    
    db_job = crud.create_job(db=db, job=job, employer_id=current_user.employer_profile.id)
    
    # Trigger background notifications
    background_tasks.add_task(trigger_job_alerts, db, db_job.id)
    
    return db_job

@router.get("/{job_id}", response_model=schemas.JobResponse)
def read_job(job_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_job = crud.get_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Increment view count in background
    background_tasks.add_task(crud.increment_job_view, db, job_id)
    
    # Refresh model to get current views (even if slightly behind, it's fine for the immediate return)
    # or just return the current cached value.
    
    # Attach applicant count for response consistency
    db_job.applicants_count = len(db_job.applications)
    
    return db_job

@router.put("/{job_id}", response_model=schemas.JobResponse)
def update_job(job_id: int, job_update: schemas.JobBase, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_job = crud.get_job(db, job_id=job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    if db_job.employer_id != current_user.employer_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    return crud.update_job(db, job_id=job_id, update_data=job_update.dict(exclude_unset=True))

@router.patch("/{job_id}/status", response_model=schemas.JobResponse)
def update_job_status(job_id: int, status_update: dict, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_job = crud.get_job(db, job_id=job_id)
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    if db_job.employer_id != current_user.employer_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    new_status = status_update.get("status")
    if new_status not in [s.value for s in models.JobStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    return crud.update_job(db, job_id=job_id, update_data={"status": new_status})
