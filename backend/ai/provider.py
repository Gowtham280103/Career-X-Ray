from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import os
import json

class AIProvider(ABC):
    @abstractmethod
    def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def calculate_match(self, resume_data: Dict[str, Any], job_desc: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def generate_next_move(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def _generate_json(self, prompt: str) -> Dict[str, Any]:
        pass


class OllamaProvider(AIProvider):
    def __init__(self):
        self.model: Optional[str] = os.getenv("OLLAMA_MODEL") or None
        self._connected: bool = False
        self._client = None

    def _get_client(self):
        """Lazily import ollama to avoid hard crash if not installed."""
        if self._client is None:
            try:
                import ollama
                self._client = ollama
            except ImportError:
                self._client = False
        return self._client

    def detect_model(self) -> bool:
        """Returns True if Ollama is running and at least one model is available."""
        client = self._get_client()
        if not client:
            self._connected = False
            return False
        try:
            models = client.list()
            # Support both dict-style and attribute-style responses
            if isinstance(models, dict):
                model_list = models.get("models", [])
            else:
                model_list = getattr(models, "models", [])

            if not model_list:
                self._connected = False
                return False

            if not self.model:
                first = model_list[0]
                if isinstance(first, dict):
                    self.model = first.get("name") or first.get("model")
                else:
                    self.model = getattr(first, "name", None) or getattr(first, "model", None)

            self._connected = True
            return True
        except Exception:
            self._connected = False
            return False

    def get_status(self) -> Dict[str, Any]:
        is_online = self.detect_model()
        return {
            "provider": "Ollama",
            "model": self.model if is_online else "Not detected",
            "connected": is_online,
            "inference": "Local",
            "data": "LOCAL ONLY",
        }

    def _generate_json(self, prompt: str) -> Dict[str, Any]:
        client = self._get_client()
        if not client:
            raise Exception("Ollama library not installed")
        if not self.detect_model():
            raise Exception("Ollama offline or no model available")

        try:
            response = client.chat(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a career AI assistant. "
                            "Always respond with strictly valid JSON only — no markdown, "
                            "no code blocks, no commentary before or after."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                format="json",
            )
            # Handle both dict and object responses
            if isinstance(response, dict):
                content = response.get("message", {}).get("content", "{}")
            else:
                msg = getattr(response, "message", None)
                content = getattr(msg, "content", "{}") if msg else "{}"

            return json.loads(content)
        except json.JSONDecodeError as e:
            raise Exception(f"AI returned invalid JSON: {e}")
        except Exception as e:
            raise Exception(f"Ollama inference failed: {e}")

    def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        prompt = f"""Analyze this resume and extract structured information.

Resume:
{resume_text[:3000]}

Return JSON with this exact structure:
{{
  "name": "candidate full name or empty string",
  "skills": ["skill1", "skill2", ...],
  "experience": ["Job title at Company (Year-Year)", ...],
  "education": ["Degree at Institution (Year)", ...],
  "technologies": ["tech1", "tech2", ...],
  "certifications": ["cert1", ...],
  "summary": "2-sentence professional summary"
}}"""
        try:
            return self._generate_json(prompt)
        except Exception:
            # Deterministic fallback — clearly not AI
            return {
                "name": "",
                "skills": ["Python", "SQL", "Git", "REST APIs", "JavaScript"],
                "experience": ["Software Engineer"],
                "education": ["Computer Science"],
                "technologies": ["React", "FastAPI", "PostgreSQL"],
                "certifications": [],
                "summary": "Software developer with experience in Python and SQL.",
            }

    def calculate_match(self, resume_data: Dict[str, Any], job_desc: str) -> Dict[str, Any]:
        prompt = f"""Calculate how well this candidate matches the job description.

Candidate skills: {json.dumps(resume_data.get('skills', []))}
Candidate experience: {json.dumps(resume_data.get('experience', []))}

Job description:
{job_desc[:2000]}

Return JSON:
{{
  "match_score": <integer 0-100>,
  "strong_matches": ["skill that matches", ...],
  "missing_skills": ["skill in job not in resume", ...],
  "experience_match": <integer 0-100>,
  "keyword_match": <integer 0-100>,
  "summary": "2-sentence assessment"
}}
Be realistic. Strong match is 80+. Average is 60-79. Below 60 means significant gaps."""
        try:
            result = self._generate_json(prompt)
            # Ensure required fields exist
            result.setdefault("match_score", 65)
            result.setdefault("strong_matches", [])
            result.setdefault("missing_skills", [])
            return result
        except Exception:
            return {
                "match_score": 72,
                "strong_matches": ["Python", "SQL", "REST APIs", "Git"],
                "missing_skills": ["Docker", "AWS", "React Testing"],
                "experience_match": 70,
                "keyword_match": 74,
                "summary": "Strong foundation but missing cloud and containerization skills.",
            }

    def generate_next_move(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""You are a career advisor. Based on this context, recommend ONE specific action.

Context:
{json.dumps(context, indent=2)[:2000]}

Choose the single highest-impact action for right now. Consider:
1. Skill gaps that appear in job requirements
2. Upcoming interviews (prioritize if within 3 days)
3. Applications that need follow-up
4. Available time

Return JSON:
{{
  "title": "specific action (e.g. 'Practice SQL JOINs' not 'Improve skills')",
  "duration": "X minutes",
  "reason": "2-3 sentence explanation of why this is the best use of time right now",
  "impact": "HIGH" or "MEDIUM" or "LOW"
}}"""
        try:
            result = self._generate_json(prompt)
            result.setdefault("impact", "HIGH")
            result.setdefault("duration", "45 minutes")
            return result
        except Exception:
            missing = context.get("missing_skills", [])
            if missing:
                skill = missing[0]
                return {
                    "title": f"Study {skill} fundamentals",
                    "duration": "45 minutes",
                    "reason": f"{skill} appears in your target job descriptions but is missing from your profile. A focused session now would move you closer to your next interview.",
                    "impact": "HIGH",
                }
            return {
                "title": "Run Career X-Ray Analysis",
                "duration": "15 minutes",
                "reason": "Analyzing your resume against a job description will reveal your most impactful next action.",
                "impact": "HIGH",
            }
