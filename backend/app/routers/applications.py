from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user
from ..utils.email_utils import send_application_status_alert, send_new_applicant_alert

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/", response_model=schemas.ApplicationResponse)
def apply_for_job(
    application: schemas.ApplicationCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can apply for jobs")
        
    if not current_user.seeker_profile:
        raise HTTPException(status_code=400, detail="Seeker profile required. Please complete your profile first.")

    # Check if already applied
    existing_application = crud.get_application_by_seeker_and_job(db, seeker_id=current_user.seeker_profile.id, job_id=application.job_id)
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    db_application = crud.create_application(db=db, application=application, seeker_id=current_user.seeker_profile.id)
    
    # Notify Employer (Email)
    job = db_application.job
    employer_user = job.employer.user
    employer_settings = crud.get_user_settings(db, employer_user.id)
    
    if employer_settings.email_new_applicants and employer_user.email:
        background_tasks.add_task(
            send_new_applicant_alert,
            to_email=employer_user.email,
            job_title=job.title,
            applicant_name=f"{current_user.seeker_profile.first_name} {current_user.seeker_profile.last_name}",
            applicant_id=current_user.seeker_profile.id
        )

    return db_application

@router.get("/me", response_model=List[schemas.ApplicationResponse])
def read_my_applications(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can view their applications")
    
    if not current_user.seeker_profile:
        raise HTTPException(status_code=400, detail="Seeker profile required to view applications.")
        
    return crud.get_applications_by_seeker(db, seeker_id=current_user.seeker_profile.id)

@router.get("/employer", response_model=List[schemas.ApplicationResponse])
def read_employer_applications(job_id: int = None, status: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.EMPLOYER or not current_user.employer_profile:
        raise HTTPException(status_code=403, detail="Only employers can view applications")
    
    return crud.get_employer_applications(db, employer_id=current_user.employer_profile.id, job_id=job_id, status=status)

@router.patch("/{application_id}/status", response_model=schemas.ApplicationResponse)
def update_app_status(
    application_id: int, 
    status_update: dict, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can update application status")
    
    new_status = status_update.get("status")
    if new_status not in [s.value for s in models.ApplicationStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    updated = crud.update_application_status(db, application_id=application_id, status=new_status)
    
    # Notify Seeker (Email)
    if updated.seeker.user.email:
        background_tasks.add_task(
            send_application_status_alert,
            to_email=updated.seeker.user.email,
            job_title=updated.job.title,
            company_name=updated.job.employer.company_name,
            status=new_status,
            reply_to=current_user.email # The employer who updated the status
        )
    
    return updated
