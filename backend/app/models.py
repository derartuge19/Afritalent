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
    skills = Column(Text) # JSON or comma-separated string
    education = Column(Text) # JSON string
    experience = Column(Text) # JSON string
    
    user = relationship("User", back_populates="seeker_profile")
    applications = relationship("Application", back_populates="seeker")

class EmployerProfile(Base):
    __tablename__ = "employer_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
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
    salary_range = Column(String)
    job_type = Column(String) # Full-time, Internship, etc.
    status = Column(String, default=JobStatus.OPEN)
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
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job = relationship("Job", back_populates="applications")
    seeker = relationship("SeekerProfile", back_populates="applications")

class SavedJob(Base):
    __tablename__ = "saved_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    seeker_id = Column(Integer, ForeignKey("seeker_profiles.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job = relationship("Job")
    seeker = relationship("SeekerProfile")
