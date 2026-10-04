from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, Float, Text
from database.database import Base
from datetime import datetime

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    target_role = Column(String)
    experience_level = Column(String)
    available_time_mins = Column(Integer)
    career_goal = Column(Text)
    current_skills = Column(JSON)
    desired_skills = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    raw_text = Column(Text)
    extracted_skills = Column(JSON)
    extracted_experience = Column(JSON)
    extracted_education = Column(JSON)
    last_updated = Column(DateTime, default=datetime.utcnow)

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String)
    role = Column(String)
    description = Column(Text)
    status = Column(String)
    match_score = Column(Float, nullable=True)
    skill_gaps = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
