from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class UserRole(str, enum.Enum):
    SEEKER = "seeker"
    EMPLOYER = "employer"
    ADMIN = "admin"

class JobStatus(str, enum.Enum):
    OPEN = "open"
    PAUSED = "paused"
    CLOSED = "closed"

class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    SHORTLISTED = "shortlisted"
    INVITED = "invited"
    SCHEDULED = "scheduled"
    INTERVIEWED = "interviewed"
    OFFERED = "offered"
    HIRED = "hired"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.SEEKER) # Storing enum as string for simplicity
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    seeker_profile = relationship("SeekerProfile", back_populates="user", uselist=False)
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False)

class SeekerProfile(Base):
    __tablename__ = "seeker_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String)
    last_name = Column(String)
    headline = Column(String)
    bio = Column(Text)
    location = Column(String)
    phone = Column(String)
    cv_url = Column(String)
    cv_html = Column(Text) # Store generated CV HTML
    skills = Column(Text) # JSON or comma-separated string
    education = Column(Text) # JSON string
    experience = Column(Text) # JSON string
    
    # Job Preferences
    job_type = Column(String) # full-time, part-time, etc.
    work_mode = Column(String) # remote, onsite, hybrid
    experience_level = Column(String)
    min_salary = Column(String)
    preferred_locations = Column(Text) # Comma-separated or JSON
    
    user = relationship("User", back_populates="seeker_profile")
    applications = relationship("Application", back_populates="seeker")
    cvs = relationship("CV", back_populates="seeker")

class EmployerProfile(Base):
    __tablename__ = "employer_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    company_name = Column(String)
    description = Column(Text)
    industry = Column(String)
    website = Column(String)
    location = Column(String)
    logo_url = Column(String)
    
    user = relationship("User", back_populates="employer_profile")
    jobs = relationship("Job", back_populates="employer")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("employer_profiles.id"))
    title = Column(String, index=True)
    description = Column(Text)
    requirements = Column(Text)
    location = Column(String)
    salary_range = Column(String) # For display text
    salary_min = Column(Integer, default=0) # For filtering
    salary_max = Column(Integer, default=0) # For filtering
    job_type = Column(String) # Full-time, Internship, etc.
    experience_level = Column(String) # Entry Level, Mid Level, etc.
    status = Column(String, default=JobStatus.OPEN)
    views = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    employer = relationship("EmployerProfile", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    seeker_id = Column(Integer, ForeignKey("seeker_profiles.id"))
    status = Column(String, default=ApplicationStatus.APPLIED)
    match_score = Column(Float, default=0.0) # AI Match Score
    cv_snapshot_url = Column(String) # Link to CVS at time of application
    cover_letter = Column(Text)
    cv_id = Column(Integer, ForeignKey("cvs.id", ondelete="SET NULL"), nullable=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job = relationship("Job", back_populates="applications")
    seeker = relationship("SeekerProfile", back_populates="applications")
    cv = relationship("CV")
    interviews = relationship("Interview", back_populates="application")


class SavedJob(Base):
    __tablename__ = "saved_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    seeker_id = Column(Integer, ForeignKey("seeker_profiles.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job = relationship("Job")
    seeker = relationship("SeekerProfile")

class CV(Base):
    __tablename__ = "cvs"
    
    id = Column(Integer, primary_key=True, index=True)
    seeker_id = Column(Integer, ForeignKey("seeker_profiles.id"))
    title = Column(String) # e.g. "Software Engineer CV - v1"
    content_html = Column(Text) # For builder CVs
    content_json = Column(Text) # Store JSON state for builder
    file_url = Column(String) # For uploaded PDFs
    is_uploaded = Column(Boolean, default=False)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    seeker = relationship("SeekerProfile", back_populates="cvs")

class InterviewStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    RESCHEDULE_REQUESTED = "reschedule_requested"
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    employer_id = Column(Integer, ForeignKey("employer_profiles.id"))
    seeker_id = Column(Integer, ForeignKey("seeker_profiles.id"))
    title = Column(String)
    description = Column(Text)
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    location = Column(String) # Or meeting link
    seeker_notes = Column(Text) # Message from seeker when responding
    status = Column(String, default=InterviewStatus.SCHEDULED)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    application = relationship("Application", back_populates="interviews")
    employer = relationship("EmployerProfile")
    seeker = relationship("SeekerProfile")
    history = relationship("InterviewHistory", back_populates="interview", cascade="all, delete-orphan")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User")

class InterviewHistory(Base):
    __tablename__ = "interview_history"
    
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    status_at_time = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    interview = relationship("Interview", back_populates="history")
    user = relationship("User")

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Notifications
    email_job_alerts = Column(Boolean, default=True)
    email_application_updates = Column(Boolean, default=True)
    email_new_applicants = Column(Boolean, default=True) # Employer side
    email_interview_responses = Column(Boolean, default=True) # Employer side
    email_weekly_digest = Column(Boolean, default=False)
    push_job_alerts = Column(Boolean, default=True)
    push_messages = Column(Boolean, default=True)
    sms_interviews = Column(Boolean, default=True)
    
    # Privacy
    profile_visible = Column(Boolean, default=True)
    show_salary = Column(Boolean, default=False)
    allow_messages = Column(Boolean, default=True)
    show_activity = Column(Boolean, default=False)
    
    user = relationship("User")
