from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/seeker-profile", tags=["seeker-profile"])

class ProfileUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    headline: str | None = None
    bio: str | None = None
    location: str | None = None
    phone: str | None = None
    skills: str | None = None
    education: str | None = None
    experience: str | None = None

@router.get("/me")
def get_my_profile(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can access this endpoint")
    
    profile = current_user.seeker_profile
    
    # Lazy initialization: Create profile if it doesn't exist
    if not profile:
        profile = models.SeekerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Calculate profile completion percentage
    total_fields = 9 # Increased for education and experience
    completed_fields = 0
    
    if profile.first_name:
        completed_fields += 1
    if profile.last_name:
        completed_fields += 1
    if profile.headline:
        completed_fields += 1
    if profile.bio:
        completed_fields += 1
    if profile.location:
        completed_fields += 1
    if profile.skills:
        completed_fields += 1
    if profile.cv_url:
        completed_fields += 1
    if profile.education and profile.education != "[]":
        completed_fields += 1
    if profile.experience and profile.experience != "[]":
        completed_fields += 1
    
    completion_percentage = int((completed_fields / total_fields) * 100)
    
    # Determine completion status
    if completion_percentage >= 80:
        completion_status = "Strong"
    elif completion_percentage >= 50:
        completion_status = "Good"
    else:
        completion_status = "Weak"
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "email": current_user.email,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "headline": profile.headline,
        "bio": profile.bio,
        "location": profile.location,
        "phone": profile.phone,
        "cv_url": profile.cv_url,
        "skills": profile.skills,
        "education": profile.education,
        "experience": profile.experience,
        "completion_percentage": completion_percentage,
        "completion_status": completion_status,
        "has_cv": bool(profile.cv_url)
    }

@router.put("/me")
def update_my_profile(
    profile_update: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can access this endpoint")
    
    profile = current_user.seeker_profile
    
    # Lazy initialization: Create profile if it doesn't exist before update
    if not profile:
        profile = models.SeekerProfile(user_id=current_user.id)
        db.add(profile)
    
    # Update Email (if provided and different)
    if profile_update.email is not None and profile_update.email != current_user.email:
        # Check if email is already taken
        existing_user = db.query(models.User).filter(models.User.email == profile_update.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = profile_update.email

    # Update only provided fields
    if profile_update.first_name is not None:
        profile.first_name = profile_update.first_name
    if profile_update.last_name is not None:
        profile.last_name = profile_update.last_name
    if profile_update.headline is not None:
        profile.headline = profile_update.headline
    if profile_update.bio is not None:
        profile.bio = profile_update.bio
    if profile_update.location is not None:
        profile.location = profile_update.location
    if profile_update.phone is not None:
        profile.phone = profile_update.phone
    if profile_update.skills is not None:
        profile.skills = profile_update.skills
    if profile_update.education is not None:
        profile.education = profile_update.education
    if profile_update.experience is not None:
        profile.experience = profile_update.experience
    
    db.commit()
    db.refresh(profile)
    
    return {"message": "Profile updated successfully", "profile": profile}

@router.post("/upload-photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can upload photos")
    
    profile = current_user.seeker_profile
    
    # Lazy initialization: Create profile if it doesn't exist before upload
    if not profile:
        profile = models.SeekerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, PNG, and GIF are allowed.")
    
    # Validate file size (2MB max)
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:  # 2MB in bytes
        raise HTTPException(status_code=400, detail="File size exceeds 2MB limit.")
    
    # Create uploads directory if it doesn't exist
    import os
    upload_dir = "uploads/profile_photos"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    import uuid
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Update profile with photo URL
    profile.cv_url = f"/uploads/profile_photos/{unique_filename}"
    db.commit()
    db.refresh(profile)
    
    return {
        "message": "Photo uploaded successfully",
        "photo_url": profile.cv_url
    }

