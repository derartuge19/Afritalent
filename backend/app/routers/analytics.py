from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user
import re

def extract_skills_from_text(text: str):
    if not text:
        return []
    
    # Comprehensive skill keywords across multiple domains
    skill_keywords = [
        # Tech & Development
        "python", "javascript", "typescript", "react", "node.js", "next.js", 
        "html", "css", "tailwind", "sql", "postgresql", "mongodb", 
        "docker", "kubernetes", "aws", "azure", "google cloud", "ci/cd",
        "git", "java", "c++", "go", "rust", "flutter", "react native",
        # Design & Creative
        "figma", "ui/ux", "adobe xd", "photoshop", "illustrator", "branding", 
        "graphic design", "product design", "user research", "prototyping",
        # Marketing & Growth
        "marketing", "digital marketing", "seo", "sem", "content writing", 
        "copywriting", "social media", "email marketing", "google analytics",
        "growth hacking", "public relations", "advertising",
        # Business & Management
        "agile", "scrum", "project management", "product management", "leadership",
        "strategy", "business development", "sales", "crm", "operations",
        "stakeholder management", "strategic planning", "financial analysis",
        # Data & AI
        "analytics", "data science", "machine learning", "tensorflow", "pytorch", 
        "pandas", "numpy", "powerbi", "tableau", "big data", "r", "nlp",
        # HR & Professional
        "recruitment", "human resources", "talent acquisition", "training",
        "coaching", "soft skills", "communication", "negotiation", "customer success"
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in skill_keywords:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill)
            
    return found_skills

def extract_certifications(text: str):
    if not text:
        return []
    
    # Look for common certification markers
    cert_patterns = [
        r'certified\s+[\w\s]+',
        r'[\w\s]+\s+certification',
        r'[\w\s]+\s+certified',
        r'aws\s+[\w\s]+',
        r'google\s+[\w\s]+\s+certified',
        r'microsoft\s+[\w\s]+'
    ]
    
    certs = []
    text_lower = text.lower()
    for pattern in cert_patterns:
        matches = re.finditer(pattern, text_lower)
        for match in matches:
            certs.append(match.group().title())
            
    return list(set(certs))[:5] # Limit to top 5

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/seeker", response_model=dict)
def get_seeker_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can access this data")
    
    if not current_user.seeker_profile:
         raise HTTPException(status_code=400, detail="Profile required")

    # Real data
    applications = crud.get_applications_by_seeker(db, seeker_id=current_user.seeker_profile.id)
    applications_count = len(applications)

    # Mixed/Mock data for other metrics not yet fully implemented
    # 'interviews' could be determined by application status if we had that detail
    interviews_count = sum(1 for app in applications if app.status == models.ApplicationStatus.INTERVIEWED) 
    
    # Mocking profile views for engagement
    import random
    profile_views = 145 + random.randint(0, 5) # Slight variation to show liveliness
    
    # Real data for saved jobs
    saved_jobs = crud.get_saved_jobs_by_seeker(db, seeker_id=current_user.seeker_profile.id)
    saved_jobs_count = len(saved_jobs)
    
    return {
        "applications": applications_count,
        "interviews": interviews_count, 
        "profile_views": profile_views,
        "saved_jobs": saved_jobs_count
    }

@router.get("/skills", response_model=dict)
def get_skills_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can access this data")
    
    if not current_user.seeker_profile:
         raise HTTPException(status_code=400, detail="Profile required")

    seeker_profile = current_user.seeker_profile
    
    # Get user skills from profile
    user_skills_raw = seeker_profile.skills or ""
    user_skills = set([s.strip().lower() for s in user_skills_raw.split(',') if s.strip()])
    
    # Try to extract more skills from the Primary (Starred) CV
    primary_cv = crud.get_primary_cv(db, seeker_id=seeker_profile.id)
    if primary_cv:
        if primary_cv.content_html:
            cv_skills = extract_skills_from_text(primary_cv.content_html)
            user_skills.update(cv_skills)
        elif primary_cv.title:
            cv_skills = extract_skills_from_text(primary_cv.title)
            user_skills.update(cv_skills)
    else:
        # Fallback to latest CV if no primary is set (optional, but keeps data from vanishing)
        latest_cv = crud.get_latest_cv(db, seeker_id=seeker_profile.id)
        if latest_cv:
            if latest_cv.content_html:
                cv_skills = extract_skills_from_text(latest_cv.content_html)
                user_skills.update(cv_skills)
            elif latest_cv.title:
                cv_skills = extract_skills_from_text(latest_cv.title)
                user_skills.update(cv_skills)
            
    user_skills = list(user_skills)
    
    # Predefined market demand and categories (In a real app, these would be in DB)
    market_skills = {
        "react": {"demand": 95, "category": "Frontend"},
        "typescript": {"demand": 90, "category": "Frontend"},
        "node.js": {"demand": 85, "category": "Backend"},
        "python": {"demand": 88, "category": "Backend"},
        "aws": {"demand": 82, "category": "DevOps"},
        "sql": {"demand": 78, "category": "Backend"},
        "docker": {"demand": 75, "category": "DevOps"},
        "figma": {"demand": 70, "category": "Design"},
        "tailwind": {"demand": 65, "category": "Frontend"}
    }
    
    categories = {
        "Frontend": ["react", "typescript", "javascript", "html", "css", "tailwind", "vue", "angular", "next.js"],
        "Backend": ["node.js", "python", "sql", "postgresql", "mongodb", "java", "go", "rust", "ruby", "php"],
        "DevOps": ["aws", "docker", "kubernetes", "ci/cd", "terraform", "cloud", "azure", "google cloud"],
        "Data": ["pandas", "numpy", "tensorflow", "pytorch", "powerbi", "tableau", "data science", "machine learning"],
        "Mobile": ["react native", "flutter", "swift", "kotlin"],
        "Design": ["figma", "adobe xd", "ui/ux"],
        "Business": ["strategy", "leadership", "analytics", "project management", "agile", "scrum"]
    }

    # Calculate Skills Data
    # Instead of fixed list, we show skills the user ACTUALLY has or is gap-compared to
    skills_data = []
    
    # Map user skills to their demand info
    for skill in user_skills:
        info = market_skills.get(skill, {"demand": 65, "category": "General"})
        skills_data.append({
            "skill": skill.capitalize(),
            "level": 85, # Base level for having it
            "demand": info["demand"]
        })
    
    # Add a few highly relevant gaps if list is short
    if len(skills_data) < 5:
        for skill, info in market_skills.items():
            if skill not in user_skills and info["category"] in [market_skills.get(s, {}).get("category") for s in user_skills]:
                skills_data.append({
                    "skill": skill.capitalize(),
                    "level": 0,
                    "demand": info["demand"]
                })
                if len(skills_data) >= 8: break

    skills_data = skills_data[:8] # Keep it clean

    # Calculate Radar Data
    radar_data = []
    for cat, cat_skills in categories.items():
        count = sum(1 for s in user_skills if s in cat_skills)
        score = min(100, (count / 2) * 100) if count > 0 else 0
        radar_data.append({"subject": cat, "A": score, "fullMark": 100})

    # Metrics
    skill_count = len(user_skills)
    skill_score = min(100, (skill_count / 10) * 100)
    market_fit = int(sum(market_skills.get(s, {"demand": 60})["demand"] for s in user_skills) / max(1, len(user_skills))) if user_skills else 0
    
    # Extract certifications from primary CV
    certs_found = []
    if primary_cv and primary_cv.content_html:
        certs_found = extract_certifications(primary_cv.content_html)
    
    # Determine dominant category for trends
    dominant_cat = "Tech"
    for cat, cat_skills in categories.items():
        if any(s in cat_skills for s in user_skills):
            dominant_cat = cat
            break
            
    # Dynamic Market Trends based on category
    trends_map = {
        "Frontend": [{"skill": "Next.js", "trend": 42}, {"skill": "Tailwind", "trend": 35}, {"skill": "Vue 3", "trend": 12}, {"skill": "jQuery", "trend": -25}],
        "Backend": [{"skill": "FastAPI", "trend": 48}, {"skill": "Go", "trend": 30}, {"skill": "Node", "trend": 22}, {"skill": "PHP 5", "trend": -40}],
        "Design": [{"skill": "Figma AI", "trend": 55}, {"skill": "ProtoPie", "trend": 28}, {"skill": "Lottie", "trend": 15}, {"skill": "Flash", "trend": -95}],
        "Marketing": [{"skill": "Growth AI", "trend": 50}, {"skill": "SEO", "trend": 22}, {"skill": "Ads", "trend": 18}, {"skill": "Cold Email", "trend": -12}],
        "Business": [{"skill": "AI Strategy", "trend": 60}, {"skill": "Agile", "trend": 15}, {"skill": "Remote Ops", "trend": 25}, {"skill": "Waterfall", "trend": -35}]
    }
    
    # Recommended Courses (Market-aligned)
    course_pool = [
        {
            "id": "c1",
            "title": "React Full Course 2024",
            "provider": "FreeCodeCamp",
            "duration": "12 hours",
            "level": "Beginner",
            "relevance": 95,
            "link": "https://www.youtube.com/watch?v=bMknfKXIFA8",
            "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
            "related_skill": "react"
        },
        {
            "id": "c2",
            "title": "TypeScript Tutorial",
            "provider": "Programming with Mosh",
            "duration": "1 hour",
            "level": "Beginner",
            "relevance": 90,
            "link": "https://www.youtube.com/watch?v=d56mG7DezGs",
            "image": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
            "related_skill": "typescript"
        },
        {
            "id": "c3",
            "title": "Python for Everybody",
            "provider": "FreeCodeCamp",
            "duration": "13 hours",
            "level": "Beginner",
            "relevance": 88,
            "link": "https://www.youtube.com/watch?v=8DvywoWv6fI",
            "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
            "related_skill": "python"
        },
        {
            "id": "c4",
            "title": "AWS Cloud Essentials",
            "provider": "AWS Training",
            "duration": "6 hours",
            "level": "Beginner",
            "relevance": 82,
            "link": "https://explore.skillbuilder.aws/",
            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
            "related_skill": "aws"
        },
        {
            "id": "c5",
            "title": "Figma UI/UX Essentials",
            "provider": "YouTube",
            "duration": "10 hours",
            "level": "Beginner",
            "relevance": 75,
            "link": "https://www.youtube.com/watch?v=FTFaQWCPqcu",
            "image": "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?w=400&h=250&fit=crop",
            "related_skill": "figma"
        }
    ]

    # Filter recommendations
    recommended_courses = [c for c in course_pool if c["related_skill"] not in user_skills]
    if not recommended_courses:
        recommended_courses = course_pool[:3]

    cat_trends = trends_map.get(dominant_cat, trends_map["Business"])
    market_trends = []
    for t in cat_trends:
        market_trends.append({
            "skill": t["skill"],
            "trend": abs(t["trend"]),
            "direction": "up" if t["trend"] > 0 else "down"
        })

    return {
        "skills_data": skills_data,
        "radar_data": radar_data,
        "market_trends": market_trends,
        "recommended_courses": recommended_courses[:3],
        "metrics": [
            {"title": "Skill Score", "value": f"{int(skill_score)}/100", "trend": 5, "color": "primary"},
            {"title": "Market Fit", "value": f"{market_fit}%", "trend": 8, "color": "success"},
            {"title": "Skills Gap", "value": str(max(0, 10 - skill_count)), "trend": -2, "color": "accent"},
            {"title": "Certifications", "value": str(len(certs_found)), "trend": len(certs_found), "color": "blue"}
        ]
    }

@router.get("/career", response_model=dict)
def get_career_guidance(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can access this data")
    
    if not current_user.seeker_profile:
         raise HTTPException(status_code=400, detail="Profile required")

    seeker_profile = current_user.seeker_profile
    headline = (seeker_profile.headline or "").lower()
    profile_skills = (seeker_profile.skills or "").lower()
    
    # Get user skills from profile + CV
    user_skills = set([s.strip().lower() for s in profile_skills.split(',') if s.strip()])
    
    cv_content = ""
    cv_title = ""
    # Prioritize Starred CV for career insights
    primary_cv = crud.get_primary_cv(db, seeker_id=seeker_profile.id)
    target_cv = primary_cv or crud.get_latest_cv(db, seeker_id=seeker_profile.id)
    
    if target_cv:
        cv_title = target_cv.title.lower() if target_cv.title else ""
        if target_cv.content_html:
            cv_content = target_cv.content_html.lower()
            cv_skills = extract_skills_from_text(cv_content)
            user_skills.update(cv_skills)
        elif cv_title:
             cv_skills = extract_skills_from_text(cv_title)
             user_skills.update(cv_skills)
             
    all_content = f"{headline} {' '.join(user_skills)} {cv_title} {cv_content}"
    
    # Enhanced Role Detection
    is_tech = any(x in all_content for x in ["software", "developer", "engineer", "react", "python", "tech", "coding", "web developer"])
    is_marketing = any(x in all_content for x in ["marketing", "social", "seo", "content", "copywriting", "digital marketing"])
    is_design = any(x in all_content for x in ["design", "ui/ux", "figma", "graphic", "product design"])
    is_data = any(x in all_content for x in ["data", "analytics", "data science", "machine learning", "tensorflow", "sql"])
    
    # Default is Tech if undeterminable
    base_role = "Professional"
    if is_tech: base_role = "Software Engineer"
    elif is_marketing: base_role = "Marketing Specialist"
    elif is_design: base_role = "UI/UX Designer"
    elif is_data: base_role = "Data Scientist"
    
    # Career Paths Logic
    career_paths = []
    # Dynamic Question Pool
    import random
    
    question_pool = [
        {
            "question": "Tell me about yourself and your journey.",
            "category": "Behavioral",
            "hint": "Focus on your recent experience and align it with the role."
        },
        {
            "question": "What is your greatest professional achievement?",
            "category": "Behavioral",
            "hint": "Use the STAR method: Situation, Task, Action, Result."
        },
        {
            "question": "How do you handle conflict in a team?",
            "category": "Situational",
            "hint": "Describe a specific instance where you remained objective and result-oriented."
        },
        {
            "question": "Where do you see your career in 5 years?",
            "category": "Career Growth",
            "hint": "Show ambition but keep it grounded in the role you're applying for."
        },
        {
            "question": "Why do you want to work at AfriTalent?",
            "category": "Culture",
            "hint": "Mention our focus on African talent and economic empowerment."
        },
        {
            "question": "Describe a time you failed and what you learned.",
            "category": "Self-Growth",
            "hint": "Show vulnerability and focus on the learning and subsequent success."
        },
        {
            "question": "How do you handle tight deadlines and pressure?",
            "category": "Management",
            "hint": "Talk about prioritization, communication, and maintaining quality."
        }
    ]
    
    # Comprehensive Resource Mapping
    skill_resources = {
        "System Design": "https://github.com/donnemartin/system-design-primer",
        "Leadership": "https://www.coursera.org/specializations/leadership-management",
        "Cloud Architecture": "https://aws.amazon.com/architecture/",
        "People Management": "https://rework.withgoogle.com/subjects/managers/",
        "Strategic Planning": "https://www.hbr.org/topic/strategic-planning",
        "Enterprise Patterns": "https://martinfowler.com/eaaCatalog/",
        "AWS/Azure": "https://explore.skillbuilder.aws/",
        "Security": "https://www.owasp.org/",
        "Strategy": "https://www.edx.org/course/strategic-management",
        "Analytics": "https://grow.google/certificates/data-analytics/",
        "Process Optimization": "https://www.lean.org/",
        "Risk Management": "https://www.pmi.org/learning/library/risk-management",
        "Project Management": "https://www.pmi.org/certifications/project-management-pmp",
        "Agile/Scrum": "https://www.scrum.org/resources/what-is-scrum",
        "Sales Strategy": "https://www.hubspot.com/sales/strategy",
        "CRM Mastery": "https://trailhead.salesforce.com/",
        "Financial Analysis": "https://www.corporatefinanceinstitute.com/",
        "Digital Marketing": "https://skillshop.withgoogle.com/"
    }

    if is_tech:
        question_pool.extend([
            {
                "question": "How do you keep up with new technology trends?",
                "category": "Technical",
                "hint": "Mention specific blogs, courses, or side projects you follow."
            },
            {
                "question": "Explain a complex technical concept to a non-technical person.",
                "category": "Communication",
                "hint": "Use analogies and avoid jargon to show cross-team empathy."
            },
            {
                "question": "How do you ensure code quality in your projects?",
                "category": "Technical",
                "hint": "Discuss unit testing, code reviews, and clean code principles."
            }
        ])
    # Enhanced Role Detection
    # Career Path Mappings
    user_skills_list = list(user_skills)
    top_skill = user_skills_list[0].capitalize() if user_skills_list else "your field"
    
    # Path generation based on base_role
    if is_tech:
        career_paths = [
            {
                "id": "1",
                "title": f"Senior {seeker_profile.headline or 'Software Engineer'}",
                "match": 92,
                "timeline": "1-2 years",
                "salary": "$60k - $90k",
                "ai_insight": f"Based on your expertise in {top_skill} found in your profile and CV, you're perfectly positioned for a senior role.",
                "skills": [
                    {"name": "System Design", "url": skill_resources["System Design"]},
                    {"name": "Leadership", "url": skill_resources["Leadership"]},
                    {"name": "Cloud Architecture", "url": skill_resources["Cloud Architecture"]}
                ],
                "description": "Lead technical projects and mentor junior developers"
            },
            {
                "id": "2",
                "title": "Engineering Manager",
                "match": 75,
                "timeline": "3-5 years",
                "salary": "$80k - $120k",
                "ai_insight": "Your technical depth is strong, but this path requires shifting focus toward people management and strategy.",
                "skills": [
                    {"name": "People Management", "url": skill_resources["People Management"]},
                    {"name": "Strategic Planning", "url": skill_resources["Strategic Planning"]},
                    {"name": "Agile/Scrum", "url": skill_resources["Agile/Scrum"]}
                ],
                "description": "Shift from coding to managing teams and delivery"
            },
            {
                "id": "3",
                "title": "Solutions Architect",
                "match": 82,
                "timeline": "2-3 years",
                "salary": "$75k - $110k",
                "ai_insight": f"Your work with {top_skill} shows a strong pattern-matching ability ideal for high-level system architecture.",
                "skills": [
                    {"name": "Enterprise Patterns", "url": skill_resources["Enterprise Patterns"]},
                    {"name": "AWS/Azure", "url": skill_resources["AWS/Azure"]},
                    {"name": "Security", "url": skill_resources["Security"]}
                ],
                "description": "Designing high-level systems for business needs"
            }
        ]
    elif is_design:
        career_paths = [
            {
                "id": "1",
                "title": "Senior Product Designer",
                "match": 88,
                "timeline": "1-2 years",
                "salary": "$55k - $85k",
                "ai_insight": f"Your design sensibilities and use of {top_skill} make you a great fit for senior product design roles.",
                "skills": [
                    {"name": "Strategy", "url": skill_resources["Strategy"]},
                    {"name": "Leadership", "url": skill_resources["Leadership"]},
                    {"name": "Strategic Planning", "url": skill_resources["Strategic Planning"]}
                ],
                "description": "Lead the design direction of complex products and systems"
            },
            {
                "id": "2",
                "title": "Design Systems Lead",
                "match": 85,
                "timeline": "2-3 years",
                "salary": "$65k - $95k",
                "ai_insight": "Your systematic approach to projects is ideal for building and maintaining enterprise-scale design systems.",
                "skills": [
                    {"name": "Process Optimization", "url": skill_resources["Process Optimization"]},
                    {"name": "Enterprise Patterns", "url": skill_resources["Enterprise Patterns"]},
                    {"name": "Strategic Planning", "url": skill_resources["Strategic Planning"]}
                ],
                "description": "Bridge the gap between design and engineering with scalable systems"
            }
        ]
    elif is_data:
        career_paths = [
            {
                "id": "1",
                "title": "Senior Data Scientist",
                "match": 90,
                "timeline": "1-2 years",
                "salary": "$70k - $110k",
                "ai_insight": f"Your analytical background and {top_skill} skills are highly sought after for senior research roles.",
                "skills": [
                    {"name": "Machine Learning", "url": "#"},
                    {"name": "Analytics", "url": skill_resources["Analytics"]},
                    {"name": "Strategic Planning", "url": skill_resources["Strategic Planning"]}
                ],
                "description": "Lead data-driven decision making and advanced modeling"
            }
        ]
    else:
        # Check for specific non-tech roles
        role_label = seeker_profile.headline or "Professional"
        career_paths = [
            {
                "id": "1",
                "title": f"Senior {role_label}",
                "match": 85,
                "timeline": "1-2 years",
                "salary": "$50k - $80k",
                "ai_insight": f"Your background in {top_skill} provides a solid foundation for specialized seniority in {role_label}.",
                "skills": [
                    {"name": "Project Management", "url": skill_resources["Project Management"]},
                    {"name": "Agile/Scrum", "url": skill_resources["Agile/Scrum"]},
                    {"name": "Leadership", "url": skill_resources["Leadership"]}
                ],
                "description": "Oversee large-scale operations and strategic project delivery"
            },
            {
                "id": "2",
                "title": "Operations & Strategy Director",
                "match": 72,
                "timeline": "4-6 years",
                "salary": "$70k - $110k",
                "ai_insight": "To reach this level, you should focus on cross-departmental impact beyond your current role.",
                "skills": [
                    {"name": "Strategic Planning", "url": skill_resources["Strategic Planning"]},
                    {"name": "Risk Management", "url": skill_resources["Risk Management"]},
                    {"name": "Financial Analysis", "url": skill_resources["Financial Analysis"]}
                ],
                "description": "Lead revenue growth and manage high-performing teams"
            }
        ]

    # Shuffle and select 10 questions
    random.shuffle(question_pool)
    selected_questions = question_pool[:10]

    return {
        "career_paths": career_paths,
        "interview_tips": [
            "Research the company's culture and values thoroughly.",
            "Use the STAR method for behavioral questions.",
            "Prepare 3 smart questions for the interviewer.",
            "Practice your 'Tell me about yourself' pitch.",
            "Follow up with a thank-you note within 24 hours."
        ],
        "common_questions": selected_questions,
        "interview_resources": [
            {
                "id": "1",
                "title": "Professional Leadership Skills" if not is_tech else "Technical Interview Preparation",
                "type": "Course",
                "duration": "8 hours",
                "icon": "Video",
                "color": "bg-blue-100 text-blue-600",
                "url": "https://www.coursera.org/specializations/leadership-management" if not is_tech else "https://www.freecodecamp.org/news/technical-interview-preparation/"
            },
            {
                "id": "2",
                "title": "Salary Negotiation Guide",
                "type": "Article",
                "duration": "15 min read",
                "icon": "FileText",
                "color": "bg-green-100 text-green-600",
                "url": "https://www.levels.fyi/blog/salary-negotiation-guide.html"
            },
            {
                "id": "3",
                "title": "Mastering the STAR Method",
                "type": "Guide",
                "duration": "20 min read",
                "icon": "BookOpen",
                "color": "bg-purple-100 text-purple-600",
                "url": "https://www.themuse.com/advice/behavioral-interview-questions-answers-examples"
            }
        ]
    }

@router.get("/employer", response_model=schemas.EmployerAnalyticsResponse)
def get_employer_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can access this data")
    
    # Lazy initialization: Create profile if it doesn't exist
    if not current_user.employer_profile:
        employer_profile = models.EmployerProfile(user_id=current_user.id)
        db.add(employer_profile)
        db.commit()
        db.refresh(employer_profile)
        # Update current_user in session to reflect the new profile
        db.refresh(current_user)
    
    employer_id = current_user.employer_profile.id
    active_jobs, total_applicants, interviews, job_views = crud.get_employer_metrics(db, employer_id)
    recent_applicants = crud.get_recent_applicants(db, employer_id)
    application_trends = crud.get_application_trends(db, employer_id)
    
    return {
        "active_jobs": active_jobs,
        "total_applicants": total_applicants,
        "interviews": interviews,
        "job_views": job_views,
        "application_trends": application_trends,
        "recent_applicants": recent_applicants
    }
