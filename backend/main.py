from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.database import engine, Base, get_db
from models import models
from ai.provider import OllamaProvider
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import json

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareerBuddy API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_provider = OllamaProvider()


# ─── HEALTH ──────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}


# ─── AI STATUS ───────────────────────────────────────────────────────────────

@app.get("/api/ai/status")
def get_ai_status():
    return ai_provider.get_status()


# ─── CAREER X-RAY ────────────────────────────────────────────────────────────

class CareerXRayRequest(BaseModel):
    resume_text: str
    job_desc: str

@app.post("/api/career-xray")
def career_xray(data: CareerXRayRequest):
    if not data.resume_text.strip() or not data.job_desc.strip():
        raise HTTPException(status_code=400, detail="Resume text and job description are required.")
    
    try:
        resume_analysis = ai_provider.analyze_resume(data.resume_text)
        match_analysis = ai_provider.calculate_match(resume_analysis, data.job_desc)
        context = {
            "match": match_analysis,
            "skills": resume_analysis.get("skills", []),
            "missing_skills": match_analysis.get("missing_skills", []),
        }
        next_move = ai_provider.generate_next_move(context)
        return {
            "resume_analysis": resume_analysis,
            "match_analysis": match_analysis,
            "next_move": next_move,
            "used_ai": True,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# ─── NEXT BEST MOVE ──────────────────────────────────────────────────────────

class NextMoveRequest(BaseModel):
    skills: List[Dict[str, Any]]
    applications: List[Dict[str, Any]]
    targetRole: str
    availableMinutes: int

@app.post("/api/next-move")
def get_next_move(data: NextMoveRequest):
    try:
        context = {
            "skills": data.skills,
            "applications": data.applications,
            "targetRole": data.targetRole,
            "availableMinutes": data.availableMinutes,
        }
        result = ai_provider.generate_next_move(context)
        return result
    except Exception:
        # Deterministic fallback
        weak_skills = sorted(
            [s for s in data.skills if s.get("level", 100) < 60],
            key=lambda s: s.get("jobRelevance", 0) * (100 - s.get("level", 100)),
            reverse=True,
        )
        if weak_skills:
            skill = weak_skills[0]["name"]
            return {
                "title": f"Practice {skill}",
                "duration": "45 minutes",
                "reason": f"{skill} is weak in your profile and appears frequently in target job descriptions.",
                "impact": "HIGH",
            }
        return {
            "title": "Run Career X-Ray Analysis",
            "duration": "15 minutes",
            "reason": "Analyzing your resume against a job description will reveal your most impactful next action.",
            "impact": "HIGH",
        }


# ─── INTERVIEW COACH ─────────────────────────────────────────────────────────

class GenerateQuestionsRequest(BaseModel):
    company: str
    role: str
    resumeText: str = ""
    jobDescription: str = ""
    skillGaps: List[str] = []

@app.post("/api/interview/generate-questions")
def generate_questions(data: GenerateQuestionsRequest):
    prompt = f"""
You are an expert technical interviewer. Generate 6 realistic interview questions for:
Company: {data.company}
Role: {data.role}
Skill gaps to probe: {', '.join(data.skillGaps) if data.skillGaps else 'general technical skills'}
Resume excerpt: {data.resumeText[:500] if data.resumeText else 'Not provided'}
Job description: {data.jobDescription[:500] if data.jobDescription else 'Not provided'}

Return JSON with this exact structure:
{{
  "questions": [
    {{"question": "...", "category": "Technical"}},
    {{"question": "...", "category": "SQL"}},
    {{"question": "...", "category": "Coding"}},
    {{"question": "...", "category": "Behavioral"}},
    {{"question": "...", "category": "Project"}},
    {{"question": "...", "category": "HR"}}
  ]
}}
Categories must be one of: Technical, SQL, Coding, Behavioral, HR, Project.
"""
    try:
        result = ai_provider._generate_json(prompt)
        if "questions" not in result or not result["questions"]:
            raise ValueError("No questions generated")
        return result
    except Exception:
        # Deterministic fallback questions
        return {
            "questions": [
                {"question": f"Explain your experience with the core technical stack for a {data.role} role.", "category": "Technical"},
                {"question": "Write a SQL query to find the top 3 most frequent values in a column.", "category": "SQL"},
                {"question": "Write a function to check if a string is a palindrome.", "category": "Coding"},
                {"question": "Describe a challenging project you worked on and how you handled obstacles.", "category": "Behavioral"},
                {"question": f"How does your background align with what {data.company} is looking for?", "category": "HR"},
                {"question": "Walk me through a project in your portfolio that best demonstrates your skills.", "category": "Project"},
            ]
        }


class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    role: str
    category: str = "Technical"

@app.post("/api/interview/evaluate-answer")
def evaluate_answer(data: EvaluateAnswerRequest):
    prompt = f"""
Evaluate this interview answer for a {data.role} candidate.

Category: {data.category}
Question: {data.question}
Answer: {data.answer}

Return JSON:
{{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentence specific feedback>",
  "strength": "<one key strength>",
  "improvement": "<one key improvement>",
  "follow_up": "<one follow-up question>"
}}
"""
    try:
        result = ai_provider._generate_json(prompt)
        if "score" not in result:
            raise ValueError("Invalid response")
        return result
    except Exception:
        # Deterministic scoring based on answer length and keywords
        words = len(data.answer.strip().split())
        score = min(90, max(40, 50 + min(40, words // 2)))
        return {
            "score": score,
            "feedback": (
                "Good answer with relevant detail. Consider adding a specific example to strengthen your response."
                if score >= 70
                else "Your answer needs more depth. Try using the STAR method to structure behavioral answers."
            ),
            "strength": "Shows awareness of the topic",
            "improvement": "Add a concrete, measurable example from your experience.",
            "follow_up": "Can you give a specific example of when you applied this?",
        }


# ─── DAILY PLAN ──────────────────────────────────────────────────────────────

class DailyPlanRequest(BaseModel):
    skills: List[Dict[str, Any]]
    applications: List[Dict[str, Any]]
    availableMinutes: int
    upcomingInterviews: List[Dict[str, Any]] = []

@app.post("/api/daily-plan")
def generate_daily_plan(data: DailyPlanRequest):
    try:
        context = data.dict()
        prompt = f"""
Generate a focused daily career plan for a job seeker.
Context: {json.dumps(context)}
Available time: {data.availableMinutes} minutes

Return JSON:
{{
  "items": [
    {{"task": "...", "minutes": 45, "category": "skill", "reason": "..."}},
    ...
  ],
  "totalMinutes": 120,
  "focus": "main theme for the day"
}}
Categories: skill, resume, apply, interview, research
Total time should not exceed {data.availableMinutes} minutes.
"""
        result = ai_provider._generate_json(prompt)
        if "items" not in result:
            raise ValueError("Invalid plan")
        return result
    except Exception:
        # Deterministic fallback plan
        weak = sorted(
            [s for s in data.skills if s.get("level", 100) < 70],
            key=lambda s: s.get("jobRelevance", 0),
            reverse=True,
        )
        items = []
        remaining = data.availableMinutes

        if data.upcomingInterviews and remaining >= 30:
            items.append({"task": "Mock interview practice", "minutes": 30, "category": "interview", "reason": "Interview coming up soon"})
            remaining -= 30

        for s in weak[:2]:
            if remaining >= 45:
                items.append({"task": f"Practice {s['name']}", "minutes": 45, "category": "skill", "reason": f"{s['name']} is a key skill gap"})
                remaining -= 45

        if remaining >= 20:
            items.append({"task": "Research and apply to new roles", "minutes": min(remaining, 30), "category": "apply", "reason": "Keep pipeline active"})

        return {
            "items": items,
            "totalMinutes": sum(i["minutes"] for i in items),
            "focus": "Skill development and interview prep",
        }


# ─── USER PROFILE ────────────────────────────────────────────────────────────

class UserProfileCreate(BaseModel):
    name: str
    target_role: str
    experience_level: str
    available_time_mins: int = 120
    career_goal: str = ""
    current_skills: list = []
    desired_skills: list = []

@app.post("/api/profile")
def create_profile(data: UserProfileCreate, db: Session = Depends(get_db)):
    profile = models.UserProfile(**data.dict())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@app.get("/api/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


# ─── JOBS ────────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    company: str
    role: str
    description: str
    status: str = "Saved"

@app.get("/api/jobs")
def list_jobs(db: Session = Depends(get_db)):
    return db.query(models.Job).all()

@app.post("/api/jobs")
def create_job(data: JobCreate, db: Session = Depends(get_db)):
    job = models.Job(**data.dict())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"status": "deleted"}
