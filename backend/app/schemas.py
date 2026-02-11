from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import UserRole, JobStatus, ApplicationStatus

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.SEEKER

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Profile Schemas ---
class SeekerProfileCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[str] = None
    cv_html: Optional[str] = None
    # Job Preferences
    job_type: Optional[str] = None
    work_mode: Optional[str] = None
    experience_level: Optional[str] = None
    min_salary: Optional[str] = None
    preferred_locations: Optional[str] = None

class SeekerProfileResponse(SeekerProfileCreate):
    id: int
    user_id: int
    cv_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class EmployerProfileCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None

class EmployerProfileResponse(EmployerProfileCreate):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# --- CV Schemas ---
class CVBase(BaseModel):
    title: str
    content_html: Optional[str] = None
    content_json: Optional[str] = None
    file_url: Optional[str] = None
    is_uploaded: bool = False
    is_primary: bool = False

class CVCreate(CVBase):
    pass

class CVUpdate(BaseModel):
    title: Optional[str] = None
    is_primary: Optional[bool] = None
    content_json: Optional[str] = None
    content_html: Optional[str] = None

class CVResponse(CVBase):
    id: int
    seeker_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Job Schemas ---
class JobBase(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    salary_min: Optional[int] = 0
    salary_max: Optional[int] = 0
    job_type: Optional[str] = None
    experience_level: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    employer_id: int
    status: JobStatus
    views: int = 0
    applicants_count: int = 0
    created_at: datetime
    employer: Optional[EmployerProfileResponse] = None # Include employer details
    
    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None
    cv_id: Optional[int] = None

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    seeker_id: int
    status: ApplicationStatus
    match_score: float
    applied_at: datetime
    cover_letter: Optional[str] = None
    cv_id: Optional[int] = None
    job: Optional[JobResponse] = None
    seeker: Optional[SeekerProfileResponse] = None
    cv: Optional[CVResponse] = None
    
    class Config:
        from_attributes = True

# --- Saved Job Schemas ---
class SavedJobBase(BaseModel):
    job_id: int

class SavedJobCreate(SavedJobBase):
    pass

class SavedJobResponse(SavedJobBase):
    id: int
    seeker_id: int
    created_at: datetime
    job: Optional[JobResponse] = None
    
    class Config:
        from_attributes = True
# --- Analytics Schemas ---
class RecentApplicant(BaseModel):
    name: str
    role: str
    match: str
    date: str

class ApplicationTrend(BaseModel):
    name: str
    value: int

class EmployerAnalyticsResponse(BaseModel):
    active_jobs: int
    total_applicants: int
    interviews: int
    job_views: int
    application_trends: List[ApplicationTrend]
    recent_applicants: List[RecentApplicant]

    class Config:
        from_attributes = True

# --- Interview Schemas ---
class InterviewBase(BaseModel):
    application_id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None

class InterviewCreate(InterviewBase):
    pass

class InterviewUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    seeker_notes: Optional[str] = None
    status: Optional[str] = None

class InterviewHistoryResponse(BaseModel):
    id: int
    user_id: int
    message: Optional[str] = None
    status_at_time: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class InterviewResponse(InterviewBase):
    id: int
    employer_id: int
    seeker_id: int
    status: str
    seeker_notes: Optional[str] = None
    created_at: datetime
    history: List[InterviewHistoryResponse] = []
    application: Optional[ApplicationResponse] = None
    
    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- User Settings Schemas ---
class UserSettingsBase(BaseModel):
    email_job_alerts: bool = True
    email_application_updates: bool = True
    email_new_applicants: bool = True
    email_interview_responses: bool = True
    email_weekly_digest: bool = False
    push_job_alerts: bool = True
    push_messages: bool = True
    sms_interviews: bool = True
    profile_visible: bool = True
    show_salary: bool = False
    allow_messages: bool = True
    show_activity: bool = False

class UserSettingsUpdate(BaseModel):
    email_job_alerts: Optional[bool] = None
    email_application_updates: Optional[bool] = None
    email_new_applicants: Optional[bool] = None
    email_interview_responses: Optional[bool] = None
    email_weekly_digest: Optional[bool] = None
    push_job_alerts: Optional[bool] = None
    push_messages: Optional[bool] = None
    sms_interviews: Optional[bool] = None
    profile_visible: Optional[bool] = None
    show_salary: Optional[bool] = None
    allow_messages: Optional[bool] = None
    show_activity: Optional[bool] = None

class UserSettingsResponse(UserSettingsBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True
