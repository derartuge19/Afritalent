from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/saved-jobs", tags=["saved-jobs"])

@router.post("/", response_model=schemas.SavedJobResponse)
def save_job(saved_job: schemas.SavedJobCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can save jobs")
        
    if not current_user.seeker_profile:
        raise HTTPException(status_code=400, detail="Seeker profile required.")

    # Check if already saved
    existing = crud.get_saved_job_by_seeker_and_job(db, seeker_id=current_user.seeker_profile.id, job_id=saved_job.job_id)
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")

    return crud.create_saved_job(db=db, saved_job=saved_job, seeker_id=current_user.seeker_profile.id)

@router.get("/", response_model=List[schemas.SavedJobResponse])
def get_saved_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can view saved jobs")
        
    if not current_user.seeker_profile:
        raise HTTPException(status_code=400, detail="Seeker profile required.")
        
    return crud.get_saved_jobs_by_seeker(db, seeker_id=current_user.seeker_profile.id)

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_job(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can unsave jobs")
        
    if not current_user.seeker_profile:
         raise HTTPException(status_code=400, detail="Seeker profile required.")
         
    # We need to find the saved_job entry first based on job_id and seeker_id
    # Note: The route parameter suggests job_id to unsave, but usually DELETE /{id} refers to the resource ID (SavedJob.id).
    # However, purely from UX, unsaving by Job ID is often more convenient if we don't have the SavedJob ID handy.
    # Let's support unsaving by Job ID for simplicity in frontend integration, OR find the SavedJob record first.
    
    saved_job = crud.get_saved_job_by_seeker_and_job(db, seeker_id=current_user.seeker_profile.id, job_id=job_id)
    if not saved_job:
        raise HTTPException(status_code=404, detail="Saved job not found")
        
    crud.delete_saved_job(db, saved_job_id=saved_job.id)
    return None
