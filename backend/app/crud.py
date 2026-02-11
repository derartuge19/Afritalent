from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, cast, Date
from datetime import datetime, timedelta
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
def get_jobs(db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None, location: Optional[str] = None, job_type: Optional[str] = None, experience_level: Optional[str] = None, salary_min: Optional[int] = None):
    query = db.query(models.Job)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Job.title.ilike(search_filter)) | 
            (models.Job.description.ilike(search_filter))
        )
    
    if location:
        query = query.filter(models.Job.location.ilike(f"%{location}%"))
        
    if job_type:
        query = query.filter(models.Job.job_type == job_type)
        
    if experience_level:
        query = query.filter(models.Job.experience_level == experience_level)
        
    if salary_min:
        query = query.filter(models.Job.salary_min >= salary_min)
        
    return query.offset(skip).limit(limit).all()

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
    
    cv_id = application.cv_id
    if not cv_id:
        # Try to find primary CV
        primary_cv = get_primary_cv(db, seeker_id)
        if primary_cv:
            cv_id = primary_cv.id
    
    db_application = models.Application(
        job_id=application.job_id,
        seeker_id=seeker_id,
        match_score=match_score,
        cover_letter=application.cover_letter,
        cv_id=cv_id
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

# --- Employer Analytics ---
def get_employer_metrics(db: Session, employer_id: int):
    active_jobs = db.query(models.Job).filter(
        models.Job.employer_id == employer_id,
        models.Job.status == models.JobStatus.OPEN
    ).count()
    
    total_applicants = db.query(models.Application).join(models.Job).filter(
        models.Job.employer_id == employer_id
    ).count()
    
    interviews = db.query(models.Application).join(models.Job).filter(
        models.Job.employer_id == employer_id,
        models.Application.status == models.ApplicationStatus.INTERVIEWED
    ).count()
    
    # Real job views summed from the jobs table
    job_views = db.query(func.sum(models.Job.views)).filter(
        models.Job.employer_id == employer_id
    ).scalar() or 0
    
    return active_jobs, total_applicants, interviews, job_views

def get_recent_applicants(db: Session, employer_id: int, limit: int = 5):
    applications = db.query(models.Application).join(models.Job).join(models.SeekerProfile).filter(
        models.Job.employer_id == employer_id
    ).order_by(models.Application.applied_at.desc()).limit(limit).all()
    
    recent = []
    for app in applications:
        seeker = app.seeker
        first_name = seeker.first_name or "Candidate"
        last_initial = seeker.last_name[0] if seeker.last_name else ""
        name = f"{first_name} {last_initial}." if last_initial else first_name
        
        # Calculate time ago
        now = datetime.utcnow()
        delta = now - app.applied_at.replace(tzinfo=None)
        if delta.seconds < 86400 and delta.days == 0:
            date_str = f"{delta.seconds // 3600}h ago"
        else:
            date_str = app.applied_at.strftime("%d days ago")
            
        recent.append({
            "name": name,
            "role": app.job.title,
            "match": f"{int(app.match_score)}%",
            "date": date_str
        })
    return recent

def get_application_trends(db: Session, employer_id: int, days: int = 7):
    # Calculate the date range
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days-1)
    
    # Query real application counts grouped by date
    # We join with Job to filter by employer_id
    results = db.query(
        cast(models.Application.applied_at, Date).label('date'),
        func.count(models.Application.id).label('count')
    ).join(models.Job).filter(
        models.Job.employer_id == employer_id,
        models.Application.applied_at >= start_date
    ).group_by(cast(models.Application.applied_at, Date)).all()
    
    # Convert results to a dictionary for easy lookup
    data_map = {r.date: r.count for r in results}
    
    # Prepare the daily labels and values
    trends = []
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        trends.append({
            "name": current_date.strftime("%a"), # Mon, Tue, etc.
            "value": data_map.get(current_date, 0)
        })
        
    return trends

# --- Employer Profile CRUD ---
def get_employer_profile(db: Session, user_id: int):
    return db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == user_id).first()

def update_employer_profile(db: Session, profile: models.EmployerProfile, update_data: dict):
    for key, value in update_data.items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile

# --- Job CRUD (Extended) ---
def get_employer_jobs(db: Session, employer_id: int):
    # Get jobs with application counts
    results = db.query(
        models.Job,
        func.count(models.Application.id).label('applicants_count')
    ).outerjoin(models.Application).filter(
        models.Job.employer_id == employer_id
    ).group_by(models.Job.id).all()
    
    # Map back to models and attach the computed count
    jobs = []
    for job, count in results:
        job.applicants_count = count
        jobs.append(job)
        
    return jobs

def update_job(db: Session, job_id: int, update_data: dict):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if db_job:
        for key, value in update_data.items():
            setattr(db_job, key, value)
        db.commit()
        db.refresh(db_job)
    return db_job

def increment_job_view(db: Session, job_id: int):
    # This will be run as a background task
    db.query(models.Job).filter(models.Job.id == job_id).update(
        {models.Job.views: models.Job.views + 1}
    )
    db.commit()

# --- Application CRUD (Extended) ---
def get_employer_applications(db: Session, employer_id: int, job_id: int = None, status: str = None):
    query = db.query(models.Application).join(models.Job).options(
        joinedload(models.Application.seeker),
        joinedload(models.Application.job),
        joinedload(models.Application.cv)
    ).filter(models.Job.employer_id == employer_id)
    if job_id:
        query = query.filter(models.Application.job_id == job_id)
    if status:
        query = query.filter(models.Application.status == status)
    return query.all()

def update_application_status(db: Session, application_id: int, status: str):
    db_app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if db_app:
        db_app.status = status
        db.commit()
        db.refresh(db_app)
    return db_app

# --- CV CRUD ---
def create_cv(db: Session, cv: schemas.CVCreate, seeker_id: int):
    db_cv = models.CV(**cv.dict(), seeker_id=seeker_id)
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv

def get_cvs(db: Session, seeker_id: int):
    return db.query(models.CV).filter(models.CV.seeker_id == seeker_id).order_by(models.CV.created_at.desc()).all()

def get_cv(db: Session, cv_id: int):
    return db.query(models.CV).filter(models.CV.id == cv_id).first()

def delete_cv(db: Session, cv_id: int):
    db_cv = db.query(models.CV).filter(models.CV.id == cv_id).first()
    if db_cv:
        db.delete(db_cv)
        db.commit()
    return db_cv

def update_cv(db: Session, cv_id: int, update_data: dict):
    db_cv = db.query(models.CV).filter(models.CV.id == cv_id).first()
    if db_cv:
        for key, value in update_data.items():
            setattr(db_cv, key, value)
        db.commit()
        db.refresh(db_cv)
    return db_cv

def set_primary_cv(db: Session, seeker_id: int, cv_id: int):
    # Unset existing primary
    db.query(models.CV).filter(
        models.CV.seeker_id == seeker_id,
        models.CV.is_primary == True
    ).update({models.CV.is_primary: False})
    
    # Set new primary
    db_cv = db.query(models.CV).filter(models.CV.id == cv_id).first()
    if db_cv:
        db_cv.is_primary = True
        db.commit()
        db.refresh(db_cv)
    return db_cv


# --- CV Helper ---
def get_latest_cv(db: Session, seeker_id: int):
    return db.query(models.CV).filter(models.CV.seeker_id == seeker_id).order_by(models.CV.created_at.desc()).first()

def get_primary_cv(db: Session, seeker_id: int):
    return db.query(models.CV).filter(
        models.CV.seeker_id == seeker_id,
        models.CV.is_primary == True
    ).first()

# --- Interview CRUD ---
def check_interview_overlap(db: Session, employer_id: int, start_time: datetime, end_time: datetime):
    # Check if any interview for this employer overlaps with the requested range
    # Overlap occurs if (start1 < end2) AND (end1 > start2)
    return db.query(models.Interview).filter(
        models.Interview.employer_id == employer_id,
        models.Interview.start_time < end_time,
        models.Interview.end_time > start_time,
        models.Interview.status != models.InterviewStatus.CANCELLED
    ).first()

def create_interview(db: Session, interview: schemas.InterviewCreate, employer_id: int, seeker_id: int):
    # Double check overlap just in case
    overlap = check_interview_overlap(db, employer_id, interview.start_time, interview.end_time)
    if overlap:
        return None
    
    db_interview = models.Interview(
        **interview.dict(),
        employer_id=employer_id,
        seeker_id=seeker_id,
        status=models.InterviewStatus.PENDING
    )
    db.add(db_interview)
    
    # Also update application status to INVITED
    app = db.query(models.Application).filter(models.Application.id == interview.application_id).first()
    if app and app.status in [models.ApplicationStatus.APPLIED, models.ApplicationStatus.SHORTLISTED]:
        app.status = models.ApplicationStatus.INVITED
        
    db.commit()
    db.refresh(db_interview)
    return db_interview

def get_interviews_for_employer(db: Session, employer_id: int):
    return db.query(models.Interview).options(
        joinedload(models.Interview.application).joinedload(models.Application.seeker),
        joinedload(models.Interview.application).joinedload(models.Application.job)
    ).filter(
        models.Interview.employer_id == employer_id
    ).order_by(models.Interview.start_time.asc()).all()

def get_interviews_for_seeker(db: Session, seeker_id: int):
    return db.query(models.Interview).options(
        joinedload(models.Interview.application).joinedload(models.Application.job).joinedload(models.Job.employer),
        joinedload(models.Interview.employer)
    ).filter(
        models.Interview.seeker_id == seeker_id
    ).order_by(models.Interview.start_time.asc()).all()

# --- Notification CRUD ---
def create_notification(db: Session, user_id: int, title: str, message: str):
    db_notification = models.Notification(
        user_id=user_id,
        title=title,
        message=message
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_notifications(db: Session, user_id: int):
    return db.query(models.Notification).filter(
        models.Notification.user_id == user_id
    ).order_by(models.Notification.created_at.desc()).all()

def mark_notification_read(db: Session, notification_id: int, user_id: int):
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == user_id
    ).first()
    if notification:
        notification.is_read = True
        db.commit()
    return notification

def respond_to_interview(db: Session, interview_id: int, status: str, seeker_id: int, notes: str = None):
    interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id,
        models.Interview.seeker_id == seeker_id
    ).first()
    
    if not interview:
        return None
    
    interview.status = status
    
    # Save to History
    seeker = db.query(models.SeekerProfile).filter(models.SeekerProfile.id == seeker_id).first()
    if seeker:
        history_entry = models.InterviewHistory(
            interview_id=interview_id,
            user_id=seeker.user_id,
            message=notes if notes else f"Interview {status.replace('_', ' ')}",
            status_at_time=status
        )
        db.add(history_entry)
        
    if notes:
        interview.seeker_notes = notes
    
    # If accepted, also move application to SCHEDULED (not INTERVIEWED yet)
    if status == models.InterviewStatus.ACCEPTED:
        app = db.query(models.Application).filter(models.Application.id == interview.application_id).first()
        if app:
            app.status = models.ApplicationStatus.SCHEDULED
            
    # Notify Employer
    seeker = db.query(models.SeekerProfile).filter(models.SeekerProfile.id == seeker_id).first()
    seeker_name = f"{seeker.first_name} {seeker.last_name}" if seeker else "Candidate"
    
    notif_title = f"Interview {status.replace('_', ' ').title()}"
    notif_msg = f"{seeker_name} has {status.replace('_', ' ')} the interview: {interview.title}"
    
    if status == models.InterviewStatus.RESCHEDULE_REQUESTED:
        notif_msg = f"{seeker_name} has requested to reschedule the interview: {interview.title}. Please contact them."

    create_notification(
        db,
        interview.employer.user_id,
        notif_title,
        notif_msg
    )

    db.commit()
    db.refresh(interview)
    return interview

def update_interview(db: Session, interview_id: int, update_data: dict, employer_id: int):
    db_interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id,
        models.Interview.employer_id == employer_id
    ).first()
    
    if db_interview:
        time_changed = 'start_time' in update_data or 'end_time' in update_data
        
        for key, value in update_data.items():
            if value is not None:
                setattr(db_interview, key, value)
        
        # If time changed, set status to rescheduled so seeker can confirm
        if time_changed:
            db_interview.status = models.InterviewStatus.RESCHEDULED
            
            # Notify Seeker
            employer = db.query(models.EmployerProfile).filter(models.EmployerProfile.id == employer_id).first()
            company_name = employer.company_name if employer else "An employer"
            
            create_notification(
                db, 
                db_interview.seeker.user_id,
                "Interview Rescheduled",
                f"{company_name} has rescheduled your interview: {db_interview.title}. Please confirm the new time."
            )

            # Save to History
            if employer:
                history_entry = models.InterviewHistory(
                    interview_id=interview_id,
                    user_id=employer.user_id,
                    message=f"Time updated to {db_interview.start_time.strftime('%Y-%m-%d %H:%M')}",
                    status_at_time=models.InterviewStatus.RESCHEDULED
                )
                db.add(history_entry)
            
        db.commit()
        db.refresh(db_interview)
    return db_interview

def delete_interview(db: Session, interview_id: int, employer_id: int):
    db_interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id,
        models.Interview.employer_id == employer_id
    ).first()
    if db_interview:
        db.delete(db_interview)
        db.commit()
    return db_interview

# --- User Settings CRUD ---
def get_user_settings(db: Session, user_id: int):
    # Lazy init settings if they don't exist
    settings = db.query(models.UserSettings).filter(models.UserSettings.user_id == user_id).first()
    if not settings:
        settings = models.UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_user_settings(db: Session, user_id: int, settings_update: dict):
    db_settings = get_user_settings(db, user_id)
    if db_settings:
        for key, value in settings_update.items():
            if value is not None:
                setattr(db_settings, key, value)
        db.commit()
        db.refresh(db_settings)
    return db_settings
