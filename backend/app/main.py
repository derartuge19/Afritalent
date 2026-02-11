from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from .database import engine, Base
from .routers import auth, jobs, applications, analytics, saved_jobs, seeker_profile, employer_profile, cv, interviews, notifications, settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AfriTalent API",
    description="Backend for AI-Powered Job & Internship Matching Platform",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*",  # Allow all origins for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Custom exception handler to ensure CORS headers are sent on errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc()  # Print the error to console for debugging
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Mount static files for uploads
import os
uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to AfriTalent API"}

# Include Routers (We will create these next)
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(analytics.router)
app.include_router(saved_jobs.router)
app.include_router(seeker_profile.router)
app.include_router(employer_profile.router)
app.include_router(cv.router)
app.include_router(interviews.router)
app.include_router(notifications.router)
app.include_router(settings.router)
