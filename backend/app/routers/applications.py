from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/", response_model=schemas.ApplicationResponse)
def apply_for_job(application: schemas.ApplicationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can apply for jobs")
        
    if not current_user.seeker_profile:
        raise HTTPException(status_code=400, detail="Seeker profile required. Please complete your profile first.")

    # Check if already applied
    existing_application = crud.get_application_by_seeker_and_job(db, seeker_id=current_user.seeker_profile.id, job_id=application.job_id)
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    return crud.create_application(db=db, application=application, seeker_id=current_user.seeker_profile.id)

from typing import List
@router.get("/me", response_model=List[schemas.ApplicationResponse])
def read_my_applications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can view their applications")
    
    if not current_user.seeker_profile:
        raise HTTPException(status_code=400, detail="Seeker profile required to view applications.")
        
    return crud.get_applications_by_seeker(db, seeker_id=current_user.seeker_profile.id)
