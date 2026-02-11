from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user
from ..utils.email_utils import send_interview_alert, send_interview_response_alert

router = APIRouter(prefix="/interviews", tags=["interviews"])

@router.post("/", response_model=schemas.InterviewResponse)
def schedule_interview(
    interview: schemas.InterviewCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can schedule interviews")
    
    # Verify application exists and belongs to employer
    application = db.query(models.Application).filter(models.Application.id == interview.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.job.employer_id != current_user.employer_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized for this application")
    
    # Check for overlap
    overlap = crud.check_interview_overlap(db, current_user.employer_profile.id, interview.start_time, interview.end_time)
    if overlap:
        raise HTTPException(
            status_code=400, 
            detail=f"Interview overlap detected with '{overlap.title}' ({overlap.start_time.strftime('%H:%M')} - {overlap.end_time.strftime('%H:%M')})"
        )

    db_interview = crud.create_interview(db, interview, current_user.employer_profile.id, application.seeker_id)
    
    # Notify Seeker (In-app)
    crud.create_notification(
        db, 
        application.seeker.user_id, 
        "New Interview Invitation", 
        f"{current_user.employer_profile.company_name} has invited you for an interview: {db_interview.title}"
    )
    
    # Notify Seeker (Email)
    if application.seeker.user.email:
        background_tasks.add_task(
            send_interview_alert,
            to_email=application.seeker.user.email,
            job_title=application.job.title,
            company_name=current_user.employer_profile.company_name,
            start_time=db_interview.start_time.strftime("%B %d, %Y at %H:%M"),
            location=db_interview.location,
            status="scheduled",
            reply_to=current_user.email
        )
    
    return db_interview

@router.get("/me", response_model=List[schemas.InterviewResponse])
def get_my_interviews(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role == models.UserRole.EMPLOYER:
        if not current_user.employer_profile:
            return []
        return crud.get_interviews_for_employer(db, current_user.employer_profile.id)
    else:
        if not current_user.seeker_profile:
            return []
        return crud.get_interviews_for_seeker(db, current_user.seeker_profile.id)

@router.put("/{interview_id}/respond", response_model=schemas.InterviewResponse)
def respond_to_invite(
    interview_id: int,
    status: str, # "accepted" or "declined"
    background_tasks: BackgroundTasks,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can respond to invites")
    
    if status not in [models.InterviewStatus.ACCEPTED, models.InterviewStatus.DECLINED, models.InterviewStatus.RESCHEDULE_REQUESTED]:
        raise HTTPException(status_code=400, detail="Invalid status. Use 'accepted', 'declined', or 'reschedule_requested'.")
        
    updated = crud.respond_to_interview(db, interview_id, status, current_user.seeker_profile.id, notes)
    if not updated:
        raise HTTPException(status_code=404, detail="Interview invite not found")
    
    # Notify Employer (Email)
    employer_user = updated.employer.user
    employer_settings = crud.get_user_settings(db, employer_user.id)
    
    if employer_settings.email_interview_responses and employer_user.email:
        background_tasks.add_task(
            send_interview_response_alert,
            to_email=employer_user.email,
            seeker_name=f"{current_user.seeker_profile.first_name} {current_user.seeker_profile.last_name}",
            job_title=updated.application.job.title,
            status=status,
            notes=notes
        )
    
    return updated

@router.put("/{interview_id}", response_model=schemas.InterviewResponse)
def update_interview(
    interview_id: int,
    interview_update: schemas.InterviewUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can update interviews")
    
    updated = crud.update_interview(db, interview_id, interview_update.dict(exclude_unset=True), current_user.employer_profile.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Notify Seeker (Email)
    if updated.application.seeker.user.email:
        background_tasks.add_task(
            send_interview_alert,
            to_email=updated.application.seeker.user.email,
            job_title=updated.application.job.title,
            company_name=current_user.employer_profile.company_name,
            start_time=updated.start_time.strftime("%B %d, %Y at %H:%M"),
            location=updated.location,
            status="updated",
            reply_to=current_user.email
        )
    
    return updated

@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can delete interviews")
    
    deleted = crud.delete_interview(db, interview_id, current_user.employer_profile.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    return None
