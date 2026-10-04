<div align="center">

<br/>

<img src="https://img.shields.io/badge/CareerBuddy-Local%20AI%20Career%20Companion-6366f1?style=for-the-badge&logo=robot&logoColor=white" alt="CareerBuddy"/>

<br/><br/>

# CareerBuddy

### *"CareerBuddy doesn't just tell you where you stand. It tells you what to do next."*

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-black?style=flat-square&logo=ollama&logoColor=white)](https://ollama.ai)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

**Built for the Hacktoberfest Weekend Challenge: Build for a Friend**

*A private local AI career companion for Arun — a CS student preparing to land his first developer job.*

<br/>

[🚀 Quick Start](#quick-start) · [✨ Features](#features) · [🎯 Demo](#demo-mode) · [🔧 Architecture](#architecture) · [🛡️ Privacy](#privacy-first)

<br/>

---

</div>

<br/>

## The Problem

Job hunting is overwhelming. You have a resume, a list of companies, a set of skills — and no idea what to focus on *today* to get closer to an offer.

Most tools tell you to "improve your skills" or "apply to more jobs." That's not useful.

**CareerBuddy asks a different question:**

> *"Given everything I know about your resume, your target jobs, your skill gaps, your upcoming interviews, and the time you have today — what is the single most impactful thing you should do right now?"*

And then it answers it. Specifically. With a plan.

<br/>

---

## Features

### ⚡ Career X-Ray — The Signature Feature

Paste your resume and any job description. CareerBuddy's local AI performs a deep analysis:

```
Resume → Extract Skills → Analyze Job Requirements → Compare Profiles
       → Find Skill Gaps → Calculate Match → Career Plan
```

**Output:**

| Section | Detail |
|---|---|
| **Career Match Score** | 0–100 realistic match against the job |
| **Strong Matches** | Skills that directly satisfy the job requirements |
| **Skill Gaps** | Missing skills ranked by job relevance |
| **Biggest Opportunity** | The one gap with the highest ROI to close |
| **Next Best Move** | One specific, time-boxed action to take now |

---

### 🎯 Next Best Move — Core Product Feature

Not 20 suggestions. One.

The system analyzes every signal it has:

- Skill gap magnitude × job frequency
- Upcoming interview proximity
- Application stages needing attention
- Available time today

And produces **one recommendation** — with reasoning:

```
NEXT BEST MOVE
──────────────────────────────────────────
Practice SQL JOINs                  45 min
Impact: HIGH

Why this was chosen:
• SQL appears in 7 of your target job descriptions
• Your latest SQL practice score is 58%
• Your TechNova interview is tomorrow
──────────────────────────────────────────
                              [START NOW →]
```

---

### 📋 Application Tracker

A full-pipeline tracker with stage management:

```
Saved → Applied → Assessment → Interview → Final Round → Offer
                                                       ↘ Rejected
```

Each application holds: company, role, location, salary, job description, interview dates, deadlines, notes, match score, and next action.

AI identifies applications needing immediate attention.

---

### 🎙️ Interview Coach

AI-generated questions tailored to the specific role, company, and your skill gaps. Not generic questions — questions that probe exactly where you're weak.

**Categories:** Technical · Coding · SQL · Behavioral · HR · Project

After you answer:
- **Score:** 0–100
- **Feedback:** What was strong, what to improve
- **Follow-up:** The next question an interviewer would ask

---

### 🧠 Skill Gap Engine

Visual comparison of your current skill levels versus what your target jobs actually require — sorted by relevance, not alphabetically.

```
Python        ████████████████░░░░  88%  ✓
SQL           ██████████████░░░░░░  72%  ✓
Docker        ██████░░░░░░░░░░░░░░  34%  ⚠ Priority
AWS           █████░░░░░░░░░░░░░░░  28%  ⚠ Priority
```

---

### 🔍 AI Settings & Privacy Panel

Live status of the local AI engine. Transparent about what's running and what's not.

```
AI ENGINE
─────────────────────────────────────
● LOCAL AI CONNECTED
Provider:    Ollama
Model:       llama3.2
Inference:   Local
Data:        LOCAL ONLY — never leaves your device
─────────────────────────────────────
```

<br/>

---

## Demo Mode

> **For judges and evaluators:** click one button, see everything.

The **"Load Demo Profile"** button instantly populates:

- ✅ **Arun Kumar's full profile** — CS final-year student
- ✅ **Complete resume** — Python, SQL, React, FastAPI experience
- ✅ **5 realistic applications** across all pipeline stages
- ✅ **2 upcoming interviews** (TechNova tomorrow, DataSystems assessment due)
- ✅ **10 skills** with realistic proficiency levels
- ✅ **Career X-Ray result** — 78% match with actionable gaps
- ✅ **1 Interview Coach session** — in progress with TechNova

No signup. No API keys. No configuration. Click once, demo everything.

<br/>

---

## Quick Start

### Prerequisites

| Tool | Version | Required |
|---|---|---|
| Node.js | 18+ | ✅ Yes |
| Python | 3.10+ | ✅ Yes |
| Ollama | Latest | ⚡ For real AI (optional) |

---

### 1. Clone the Repository

```bash
git clone https://github.com/Gowtham280103/Career-X-Ray.git
cd Career-X-Ray
```

---

### 2. Start the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
.\venv\Scripts\activate      # Windows
source venv/bin/activate     # Mac / Linux

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn main:app --reload --port 8000
```

Backend is live at `http://localhost:8000`  
Interactive API docs at `http://localhost:8000/docs`

---

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend is live at `http://localhost:5173`

---

### 4. (Optional) Start Ollama for Real AI

```bash
# Install Ollama from https://ollama.ai

# Pull an open-weight model
ollama pull llama3.2        # ~2 GB — fast, good quality
# or
ollama pull mistral         # ~4 GB — higher quality

# Start the Ollama server
ollama serve
```

CareerBuddy auto-detects the running model.  
To specify a model, create `backend/.env`:

```env
OLLAMA_MODEL=mistral
```

---

### 5. Open CareerBuddy

Go to `http://localhost:5173`

Click **"Load Demo Profile"** to instantly explore a complete career profile.

<br/>

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────┐
│                  React Frontend                  │
│  Landing · Dashboard · X-Ray · Apps · Interview  │
│           Zustand State · Framer Motion           │
└──────────────────────┬──────────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────────┐
│              FastAPI Backend                     │
│  /career-xray · /next-move · /interview          │
│  /daily-plan  · /profile   · /jobs               │
└──────────────────────┬──────────────────────────┘
                       │
         ┌─────────────▼──────────────┐
         │      AIProvider (abstract)  │
         │  analyze_resume()           │
         │  calculate_match()          │
         │  generate_next_move()       │
         │  _generate_json()           │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │      OllamaProvider         │
         │  Auto-detects model         │
         │  Structured JSON prompts    │
         │  Graceful offline fallback  │
         └─────────────┬──────────────┘
                       │ localhost:11434
         ┌─────────────▼──────────────┐
         │         Ollama Runtime      │
         │  llama3.2 / mistral / ...   │
         │  Fully local inference      │
         └────────────────────────────┘
                       │
         ┌─────────────▼──────────────┐
         │       SQLite Database       │
         │  UserProfile · Resume       │
         │  Jobs · Applications        │
         └────────────────────────────┘
```

### Tech Stack

**Frontend**

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 14 |
| State | Zustand 5 (with persistence) |
| Routing | React Router 7 |
| Icons | Lucide React |

**Backend**

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| Runtime | Python 3.10+ |
| Database | SQLite via SQLAlchemy |
| AI Runtime | Ollama (local) |
| Models | llama3.2, mistral, or any Ollama model |
| Config | Pydantic Settings |

### Project Structure

```
Career-X-Ray/
│
├── backend/
│   ├── main.py                  ← FastAPI app + all API routes
│   ├── config.py                ← Environment settings (OLLAMA_MODEL)
│   ├── requirements.txt
│   ├── ai/
│   │   └── provider.py          ← AIProvider abstract + OllamaProvider
│   ├── database/
│   │   └── database.py          ← SQLAlchemy SQLite engine
│   └── models/
│       └── models.py            ← UserProfile, Resume, Job ORM models
│
└── frontend/
    └── src/
        ├── App.tsx              ← Router (Landing + AppLayout)
        ├── index.css            ← Design tokens + global styles
        ├── pages/
        │   ├── Landing.tsx      ← Landing page with hero + features
        │   ├── Dashboard.tsx    ← Command center + next best move
        │   ├── CareerXRay.tsx   ← Signature feature with AI pipeline
        │   ├── Applications.tsx ← Full application pipeline tracker
        │   ├── InterviewCoach.tsx ← AI question generation + scoring
        │   └── AISettings.tsx   ← AI engine status + setup guide
        ├── components/
        │   ├── layout/
        │   │   ├── AppLayout.tsx  ← Layout with mobile nav
        │   │   ├── Sidebar.tsx    ← Desktop sidebar + AI status badge
        │   │   └── TopBar.tsx     ← Search + Cmd+K command palette
        │   └── ui/
        │       ├── Button.tsx     ← Animated button with variants
        │       ├── Card.tsx       ← Glass morphism card
        │       └── ProgressRing.tsx ← Animated SVG progress ring
        ├── store/
        │   └── useCareerStore.ts  ← Complete Zustand store + demo data
        ├── lib/
        │   ├── apiClient.ts       ← All backend API calls
        │   └── utils.ts           ← cn(), formatTime(), formatDate()
        └── types/
            └── index.ts           ← TypeScript types + STAGE_CONFIG
```

<br/>

---

## Privacy First

<table>
<tr>
<td width="50%">

**What happens with your data:**

- ✅ Resume text → analyzed locally by Ollama
- ✅ Job descriptions → processed locally
- ✅ Interview answers → evaluated locally
- ✅ Application data → stored in local SQLite
- ✅ Career goals → kept in browser localStorage

</td>
<td width="50%">

**What never happens:**

- ❌ No data sent to OpenAI
- ❌ No data sent to Gemini or Claude
- ❌ No cloud database
- ❌ No telemetry
- ❌ No account required

</td>
</tr>
</table>

> **"Your career data stays on your device."**  
> This is not a marketing claim. It is enforced by architecture.

<br/>

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/ai/status` | Ollama connection + model detection |
| `POST` | `/api/career-xray` | Deep resume × job description analysis |
| `POST` | `/api/next-move` | Generate one high-impact recommendation |
| `POST` | `/api/interview/generate-questions` | AI-tailored interview questions |
| `POST` | `/api/interview/evaluate-answer` | Score + feedback for an answer |
| `POST` | `/api/daily-plan` | Generate today's career schedule |
| `POST` | `/api/profile` | Create user profile |
| `GET` | `/api/profile/{id}` | Fetch user profile |
| `GET` | `/api/jobs` | List saved jobs |
| `POST` | `/api/jobs` | Save a job |

Full interactive documentation: `http://localhost:8000/docs`

<br/>

---

## The Friend This Was Built For

> **Arun Kumar** — Computer Science final year, SRM Institute  
> Skills: Python, SQL, React, FastAPI, Git  
> Goal: Land a junior developer role at a product company within 3 months  
> Biggest challenge: Knowing what to focus on each day

Arun had the skills. He had the resume. He had the applications.  
What he didn't have was a clear answer to: *"What should I do today?"*

CareerBuddy answers that question.

<br/>

---

## Hacktoberfest Challenge Requirements

| Requirement | How CareerBuddy satisfies it |
|---|---|
| **Build for a Friend** | Built specifically for Arun Kumar, addressing his real job search challenges with his actual skills and goals as demo data |
| **Open-Source AI at the Core** | Ollama + open-weight models (llama3.2, mistral) — no closed APIs. The entire AI pipeline is replaceable, configurable, and runs locally |

<br/>

---

## Roadmap

- [ ] PDF resume upload and parsing
- [ ] Weekly AI review with progress insights
- [ ] Focus Mode — distraction-free 45-minute sessions
- [ ] Skill learning resource suggestions
- [ ] LinkedIn job import
- [ ] Calendar integration for interview scheduling
- [ ] Offline PWA support

<br/>

---

## Contributing

Contributions are welcome. Please open an issue before submitting a large PR.

```bash
# Fork and clone
git clone https://github.com/Gowtham280103/Career-X-Ray.git
cd Career-X-Ray

# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes, commit, push
git push origin feature/your-feature-name

# Open a Pull Request
```

<br/>

---

## License

MIT © 2024 Gowtham M

<br/>

---

<div align="center">

**Built with care for a real friend.**  
**Powered by local AI. Private by design.**

<br/>

*Hacktoberfest Weekend Challenge 2024*

</div>
