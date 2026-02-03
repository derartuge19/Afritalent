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
    first_name: str
    last_name: str
    headline: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[str] = None

class SeekerProfileResponse(SeekerProfileCreate):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

class EmployerProfileCreate(BaseModel):
    company_name: str
    industry: Optional[str] = None
    location: Optional[str] = None

class EmployerProfileResponse(EmployerProfileCreate):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# --- Job Schemas ---
class JobBase(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    job_type: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    employer_id: int
    status: JobStatus
    created_at: datetime
    employer: Optional[EmployerProfileResponse] = None # Include employer details
    
    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    seeker_id: int
    status: ApplicationStatus
    match_score: float
    applied_at: datetime
    job: Optional[JobResponse] = None
    
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
