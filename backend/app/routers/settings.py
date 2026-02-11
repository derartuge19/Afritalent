from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/", response_model=schemas.UserSettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_user_settings(db, current_user.id)

@router.put("/", response_model=schemas.UserSettingsResponse)
def update_settings(
    settings_update: schemas.UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.update_user_settings(
        db, 
        current_user.id, 
        settings_update.dict(exclude_unset=True)
    )

@router.post("/change-password")
def change_password(
    password_data: dict, # Using dict for simplicity, can be schema
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    current_password = password_data.get("current_password")
    new_password = password_data.get("new_password")
    
    if not current_password or not new_password:
        raise HTTPException(status_code=400, detail="Missing password data")
        
    if not crud.verify_password(current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    current_user.hashed_password = crud.get_password_hash(new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}
