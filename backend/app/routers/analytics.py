from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db
from .auth import get_current_user

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
    interviews_count = sum(1 for app in applications if app.status == models.ApplicationStatus.INTERVIEW) 
    
    # Mocking profile views for engagement
    import random
    profile_views = 145 + random.randint(0, 5) # Slight variation to show liveliness
    
    return {
        "applications": applications_count,
        "interviews": interviews_count, 
        "profile_views": profile_views,
        "saved_jobs": 8 # Static for now
    }

@router.get("/skills", response_model=dict)
def get_skills_analytics(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can access this data")
    
    if not current_user.seeker_profile:
         raise HTTPException(status_code=400, detail="Profile required")

    # Get user skills
    user_skills_raw = current_user.seeker_profile.skills or ""
    user_skills = [s.strip().lower() for s in user_skills_raw.split(',') if s.strip()]
    
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
        "Frontend": ["react", "typescript", "javascript", "html", "css", "tailwind", "vue", "angular"],
        "Backend": ["node.js", "python", "sql", "postgresql", "mongodb", "java", "go", "ruby", "php"],
        "DevOps": ["aws", "docker", "kubernetes", "ci/cd", "terraform", "cloud"],
        "Data": ["pandas", "numpy", "tensorflow", "pytorch", "powerbi", "tableau"],
        "Mobile": ["react native", "flutter", "swift", "kotlin"],
        "Design": ["figma", "adobe xd", "ui/ux"]
    }

    # Calculate Skills Data
    skills_data = []
    for skill, info in market_skills.items():
        level = 85 if skill in user_skills else 0 # Mock level if they have it
        skills_data.append({
            "skill": skill.capitalize(),
            "level": level,
            "demand": info["demand"]
        })

    # Calculate Radar Data
    radar_data = []
    for cat, cat_skills in categories.items():
        count = sum(1 for s in user_skills if s in cat_skills)
        score = min(100, (count / 2) * 100) if count > 0 else 0 # 2 skills = 100% for that cat
        radar_data.append({"subject": cat, "A": score, "fullMark": 100})

    # Recommended Courses (Real free courses)
    course_pool = [
        {
            "id": "c1",
            "title": "React Full Course 2024",
            "provider": "FreeCodeCamp (YouTube)",
            "duration": "12 hours",
            "level": "Beginner",
            "relevance": 95,
            "link": "https://www.youtube.com/watch?v=bMknfKXIFA8",
            "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
            "related_skill": "react"
        },
        {
            "id": "c2",
            "title": "TypeScript Tutorial for Beginners",
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
            "title": "Python for Everybody Specialization",
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
            "title": "AWS Cloud Practitioner Essentials",
            "provider": "AWS Training (Free)",
            "duration": "6 hours",
            "level": "Beginner",
            "relevance": 82,
            "link": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials",
            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
            "related_skill": "aws"
        },
        {
            "id": "c5",
            "title": "Figma UI/UX Design Essentials",
            "provider": "YouTube",
            "duration": "10 hours",
            "level": "Beginner",
            "relevance": 75,
            "link": "https://www.youtube.com/watch?v=FTFaQWCPqcu",
            "image": "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?w=400&h=250&fit=crop",
            "related_skill": "figma"
        }
    ]

    # Filter recommendations for skills they DON'T have or are gaps
    recommended_courses = []
    for course in course_pool:
        if course["related_skill"] not in user_skills:
            recommended_courses.append(course)
    
    # Fallback to general if they have all
    if not recommended_courses:
        recommended_courses = course_pool[:3]

    # Metrics
    skill_count = len(user_skills)
    skill_score = min(100, (skill_count / 10) * 100)
    market_fit = int(sum(info["demand"] for s, info in market_skills.items() if s in user_skills) / max(1, len(user_skills))) if user_skills else 0

    return {
        "skills_data": skills_data,
        "radar_data": radar_data,
        "market_trends": [
             {"skill": "AI/ML", "trend": 45, "direction": "up"},
             {"skill": "Cloud", "trend": 38, "direction": "up"},
             {"skill": "Cybersecurity", "trend": 32, "direction": "up"},
             {"skill": "Web3", "trend": 15, "direction": "up"},
             {"skill": "PHP", "trend": -15, "direction": "down"},
             {"skill": "jQuery", "trend": -28, "direction": "down"}
        ],
        "recommended_courses": recommended_courses[:3],
        "metrics": [
            {"title": "Skill Score", "value": f"{int(skill_score)}/100", "trend": 5, "color": "primary"},
            {"title": "Market Fit", "value": f"{market_fit}%", "trend": 8, "color": "success"},
            {"title": "Skills Gap", "value": str(max(0, 10 - skill_count)), "trend": -2, "color": "accent"},
            {"title": "Certifications", "value": "0", "trend": 0, "color": "blue"}
        ]
    }

@router.get("/career", response_model=dict)
def get_career_guidance(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.SEEKER:
        raise HTTPException(status_code=403, detail="Only seekers can access this data")
    
    if not current_user.seeker_profile:
         raise HTTPException(status_code=400, detail="Profile required")

    profile = current_user.seeker_profile
    headline = (profile.headline or "").lower()
    skills = (profile.skills or "").lower()
    
    # Simple Role Detection
    is_tech = any(x in headline or x in skills for x in ["software", "developer", "engineer", "react", "python", "tech"])
    is_marketing = any(x in headline or x in skills for x in ["marketing", "social", "seo", "content"])
    
    # Default is Tech if undeterminable for this MVP
    base_role = "Software Engineer"
    if is_marketing: base_role = "Marketing Specialist"
    
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
    user_skills_list = [s.strip() for s in skills.split(",")]
    top_skill = user_skills_list[0] if user_skills_list else "your field"
    
    if is_tech:
        career_paths = [
            {
                "id": "1",
                "title": f"Senior {profile.headline or 'Developer'}",
                "match": 92,
                "timeline": "1-2 years",
                "salary": "$60k - $90k",
                "ai_insight": f"Based on your expertise in {top_skill}, you're perfectly positioned for a senior role. Your technical foundation is 90% ready.",
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
                "ai_insight": "You have the technical depth, but this path requires shifting focus toward people and strategy.",
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
                "ai_insight": f"Your work with {top_skill} shows a strong pattern-matching ability ideal for high-level architecture.",
                "skills": [
                    {"name": "Enterprise Patterns", "url": skill_resources["Enterprise Patterns"]},
                    {"name": "AWS/Azure", "url": skill_resources["AWS/Azure"]},
                    {"name": "Security", "url": skill_resources["Security"]}
                ],
                "description": "Designing high-level systems for business needs"
            }
        ]
    else:
        # Check for specific non-tech roles
        role_label = profile.headline or "Professional"
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
                "description": "Lead revenue growth and manage high-performing sales teams"
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
