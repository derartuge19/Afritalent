from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user
import shutil
import os
import uuid

router = APIRouter(prefix="/cvs", tags=["cvs"])

@router.post("/", response_model=schemas.CVResponse)
def create_cv(
    cv: schemas.CVCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can create CVs")
    
    if not current_user.seeker_profile:
        raise HTTPException(status_code=400, detail="Profile required")
        
    return crud.create_cv(db, cv, current_user.seeker_profile.id)

@router.get("/", response_model=List[schemas.CVResponse])
def get_cvs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can access their CVs")
    
    if not current_user.seeker_profile:
        return []
        
    return crud.get_cvs(db, current_user.seeker_profile.id)

@router.post("/upload", response_model=schemas.CVResponse)
async def upload_cv(
    file: UploadFile = File(...),
    title: str = Form("Uploaded CV"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can upload CVs")
        
    if not current_user.seeker_profile:
        raise HTTPException(status_code=400, detail="Profile required")
    
    # Save file
    UPLOAD_DIR = "uploads/cvs"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_url = f"/uploads/cvs/{filename}"
    
    cv_data = schemas.CVCreate(
        title=title,
        file_url=file_url,
        is_uploaded=True,
        content_html=None
    )
    
    return crud.create_cv(db, cv_data, current_user.seeker_profile.id)
    
@router.get("/{cv_id}", response_model=schemas.CVBase) # Using Base to include content/url
def get_cv(
    cv_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    cv = crud.get_cv(db, cv_id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
        
    # Check ownership
    if current_user.role == models.UserRole.SEEKER:
         if not current_user.seeker_profile or cv.seeker_id != current_user.seeker_profile.id:
             raise HTTPException(status_code=403, detail="Not authorized")
    
    # Employers - simplistic check for now
    if current_user.role == models.UserRole.EMPLOYER:
        # TODO: verify application exists
        pass

from fastapi.responses import HTMLResponse, RedirectResponse

@router.delete("/{cv_id}")
def delete_cv(
    cv_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    cv = crud.get_cv(db, cv_id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    if cv.seeker_id != current_user.seeker_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Also delete physical file if uploaded? 
    # For now just DB delete.
    return crud.delete_cv(db, cv_id)

@router.patch("/{cv_id}", response_model=schemas.CVResponse)
def update_cv(
    cv_id: int,
    cv_update: schemas.CVUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    cv = crud.get_cv(db, cv_id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    if cv.seeker_id != current_user.seeker_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.update_cv(db, cv_id, cv_update.dict(exclude_unset=True))

@router.post("/{cv_id}/set-primary", response_model=schemas.CVResponse)
def set_primary_cv(
    cv_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    cv = crud.get_cv(db, cv_id)
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    if cv.seeker_id != current_user.seeker_profile.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.set_primary_cv(db, current_user.seeker_profile.id, cv_id)

@router.get("/{cv_id}/view", response_class=HTMLResponse)
def view_cv_html(
    cv_id: int,
    db: Session = Depends(get_db)
):
    cv = crud.get_cv(db, cv_id)
    if not cv:
        return HTMLResponse(content="<h1>CV not found</h1>", status_code=404)
        
    if cv.content_html:
        return HTMLResponse(content=cv.content_html)
    elif cv.file_url:
        # Assuming file_url is relative to domain root, redirect to it.
        # But if it's full URL, redirect.
        # Here we store e.g. /uploads/cvs/...
        return RedirectResponse(url=cv.file_url)
    else:
        return HTMLResponse(content="<h1>Empty CV</h1>")
