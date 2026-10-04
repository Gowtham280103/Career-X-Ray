export const API_BASE_URL = 'http://localhost:8000/api';

// ─── AI / STATUS ─────────────────────────────────────────────────────────────

export async function fetchAIStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/status`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    return {
      provider: 'Ollama',
      model: 'Not detected',
      connected: false,
      inference: 'Offline',
      data: 'LOCAL ONLY',
    };
  }
}

// ─── CAREER X-RAY ────────────────────────────────────────────────────────────

export async function runCareerXRay(resumeText: string, jobDesc: string) {
  const res = await fetch(`${API_BASE_URL}/career-xray`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_text: resumeText, job_desc: jobDesc }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Career X-Ray failed');
  }
  return await res.json();
}

// ─── NEXT BEST MOVE ──────────────────────────────────────────────────────────

export async function fetchNextMove(context: {
  skills: Array<{ name: string; level: number; jobRelevance: number }>;
  applications: Array<{ company: string; status: string; interviewDate?: string }>;
  targetRole: string;
  availableMinutes: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/next-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });
    if (!res.ok) throw new Error('Next move failed');
    return await res.json();
  } catch {
    return null;
  }
}

// ─── INTERVIEW COACH ─────────────────────────────────────────────────────────

export async function generateInterviewQuestions(context: {
  company: string;
  role: string;
  resumeText: string;
  jobDescription: string;
  skillGaps: string[];
}) {
  const res = await fetch(`${API_BASE_URL}/interview/generate-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(context),
  });
  if (!res.ok) throw new Error('Failed to generate questions');
  return await res.json();
}

export async function evaluateAnswer(data: {
  question: string;
  answer: string;
  role: string;
  category: string;
}) {
  const res = await fetch(`${API_BASE_URL}/interview/evaluate-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to evaluate answer');
  return await res.json();
}

// ─── DAILY PLAN ──────────────────────────────────────────────────────────────

export async function generateDailyPlan(context: {
  skills: Array<{ name: string; level: number }>;
  applications: Array<{ company: string; status: string }>;
  availableMinutes: number;
  upcomingInterviews: Array<{ company: string; date: string }>;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/daily-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });
    if (!res.ok) throw new Error('Failed to generate plan');
    return await res.json();
  } catch {
    return null;
  }
}
