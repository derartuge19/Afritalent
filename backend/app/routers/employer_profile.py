from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/employer-profile", tags=["employer-profile"])

@router.get("/me", response_model=schemas.EmployerProfileResponse)
def get_my_employer_profile(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can access this endpoint")
    
    # Lazy initialization
    if not current_user.employer_profile:
        profile = models.EmployerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        db.refresh(current_user)
        return profile
    
    return current_user.employer_profile

@router.put("/me", response_model=schemas.EmployerProfileResponse)
def update_my_employer_profile(
    profile_update: schemas.EmployerProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can access this endpoint")
    
    profile = current_user.employer_profile
    if not profile:
        profile = models.EmployerProfile(user_id=current_user.id)
        db.add(profile)
    
    return crud.update_employer_profile(db, profile, profile_update.dict(exclude_unset=True))
