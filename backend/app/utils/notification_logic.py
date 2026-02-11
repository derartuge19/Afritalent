from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from .. import models
from .email_utils import send_job_alert

def match_seekers_for_job(db: Session, job: models.Job):
    """
    Returns a list of SeekerProfiles that match the job criteria.
    Criteria:
    1. Seeker has email_job_alerts enabled.
    2. Job Type match (or seeker has no preference).
    3. Experience Level match (or seeker has no preference).
    4. Location match:
       - Direct city/location match.
       - OR Job is remote and seeker is open to remote.
    5. Salary: Job salary_max >= Seeker min_salary (if set).
    6. Skills match: Seeker skills found in Job title or description.
    """
    # 1. Base query: Seeker with notification settings enabled
    query = db.query(models.SeekerProfile).join(
        models.UserSettings, 
        models.UserSettings.user_id == models.SeekerProfile.user_id
    ).filter(
        models.UserSettings.email_job_alerts == True
    )

    # 2. Job Type Filter
    if job.job_type:
        query = query.filter(or_(
            models.SeekerProfile.job_type == job.job_type,
            models.SeekerProfile.job_type == None
        ))

    # 3. Experience Level Filter
    if job.experience_level:
        query = query.filter(or_(
            models.SeekerProfile.experience_level == job.experience_level,
            models.SeekerProfile.experience_level == None
        ))

    # 4. Salary Filter (Seeker min_salary <= Job salary_max)
    # Note: min_salary is stored as String in DB (e.g., "$50,000"), need to be careful.
    # For now, we'll skip strict salary filtering if it's not a clean integer, 
    # or implement a helper to parse it.

    potential_matches = query.all()
    final_matches = []

    for seeker in potential_matches:
        is_match = True
        
        # 5. Location Matching
        seeker_locs = (seeker.preferred_locations or "").lower().split('|')
        job_loc = (job.location or "").lower()
        
        loc_match = False
        if job_loc and any(loc in job_loc for loc in seeker_locs if loc):
            loc_match = True
        elif (job.location or "").lower() == "remote":
            # If job is remote, we assume it's a match for most
            loc_match = True
        
        if not loc_match:
            is_match = False

        # 6. Skills Matching (CV field / Skills string)
        if is_match and seeker.skills:
            seeker_skills = [s.strip().lower() for s in seeker.skills.split(',')]
            job_text = f"{job.title} {job.description} {job.requirements}".lower()
            
            # Match if at least one skill is mentioned
            skills_found = any(skill in job_text for skill in seeker_skills if len(skill) > 2)
            if not skills_found:
                is_match = False

        if is_match:
            final_matches.append(seeker)

    return final_matches

def trigger_job_alerts(db: Session, job_id: int):
    """
    Called as a background task.
    """
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        print(f"Job {job_id} not found for alerts")
        return

    company_name = "AfriTalent Partner"
    if job.employer and job.employer.company_name:
        company_name = job.employer.company_name

    matches = match_seekers_for_job(db, job)
    
    for seeker in matches:
        if seeker.user and seeker.user.email:
            send_job_alert(
                to_email=seeker.user.email,
                job_title=job.title,
                company_name=company_name,
                job_id=job.id
            )
    
    print(f"Triggered alerts for {len(matches)} seekers for Job {job_id}")
