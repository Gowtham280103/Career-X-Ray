import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppStage = 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Final Round' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  jobDescription: string;
  status: AppStage;
  appliedDate: string;
  deadline?: string;
  interviewDate?: string;
  nextAction: string;
  notes: string;
  matchScore?: number;
  salary?: string;
}

export interface Skill {
  name: string;
  level: number; // 0–100
  category: 'technical' | 'soft' | 'tool';
  jobRelevance: number; // 0–10 how often it appears in target jobs
}

export interface InterviewSession {
  id: string;
  applicationId: string;
  company: string;
  role: string;
  interviewDate: string;
  questions: InterviewQuestion[];
  overallScore?: number;
  notes: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Coding' | 'SQL' | 'Behavioral' | 'HR' | 'Project';
  userAnswer?: string;
  score?: number;
  feedback?: string;
  followUp?: string;
}

export interface CareerXRayResult {
  matchScore: number;
  strongMatches: string[];
  missingSkills: string[];
  biggestOpportunity: string;
  opportunityReason: string;
  nextMove: {
    title: string;
    duration: string;
    reason: string;
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  resumeAnalysis: {
    name: string;
    skills: string[];
    experience: string[];
    education: string[];
    technologies: string[];
  };
  usedAI: boolean;
}

export interface DailyPlanItem {
  task: string;
  minutes: number;
  category: 'skill' | 'resume' | 'apply' | 'interview' | 'research';
}

export interface UserProfile {
  name: string;
  targetRole: string;
  experienceLevel: string;
  availableTimePerDay: number; // minutes
  careerGoal: string;
  currentSkills: Skill[];
  resumeText: string;
  resumeAnalyzed: boolean;
}

interface CareerStore {
  // State
  user: UserProfile | null;
  applications: Application[];
  interviewSessions: InterviewSession[];
  lastXRayResult: CareerXRayResult | null;
  aiStatus: {
    provider: string;
    model: string;
    connected: boolean;
    inference: string;
    data: string;
  } | null;
  isDemoLoaded: boolean;

  // Actions
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  loadDemoProfile: () => void;
  clearProfile: () => void;

  addApplication: (app: Omit<Application, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  moveApplicationStage: (id: string, status: AppStage) => void;

  addInterviewSession: (session: Omit<InterviewSession, 'id'>) => void;
  updateInterviewSession: (id: string, updates: Partial<InterviewSession>) => void;

  setXRayResult: (result: CareerXRayResult) => void;
  setAIStatus: (status: CareerStore['aiStatus']) => void;
  updateSkill: (name: string, updates: Partial<Skill>) => void;
}

// ─── DEMO DATA ───────────────────────────────────────────────────────────────

const demoSkills: Skill[] = [
  { name: 'Python', level: 88, category: 'technical', jobRelevance: 9 },
  { name: 'SQL', level: 72, category: 'technical', jobRelevance: 8 },
  { name: 'JavaScript', level: 68, category: 'technical', jobRelevance: 8 },
  { name: 'React', level: 61, category: 'technical', jobRelevance: 7 },
  { name: 'Git', level: 80, category: 'tool', jobRelevance: 9 },
  { name: 'REST APIs', level: 75, category: 'technical', jobRelevance: 8 },
  { name: 'Docker', level: 34, category: 'tool', jobRelevance: 9 },
  { name: 'AWS', level: 28, category: 'tool', jobRelevance: 8 },
  { name: 'React Testing', level: 22, category: 'technical', jobRelevance: 7 },
  { name: 'Communication', level: 85, category: 'soft', jobRelevance: 8 },
  { name: 'Problem Solving', level: 82, category: 'soft', jobRelevance: 9 },
];

const demoResumeText = `Arun Kumar
arun.kumar@email.com | linkedin.com/in/arunkumar | github.com/arunkumar

EDUCATION
Bachelor of Engineering – Computer Science
SRM Institute of Science and Technology, 2024
GPA: 8.4/10

TECHNICAL SKILLS
Languages: Python, JavaScript, SQL, HTML/CSS
Frameworks: React, FastAPI, Flask
Tools: Git, GitHub, VS Code, Postman
Databases: PostgreSQL, SQLite, MySQL

PROJECTS
CareerBuddy – AI Career Companion (2024)
• Built a full-stack application using React, FastAPI, and Ollama
• Integrated local LLM for resume analysis and career planning
• Designed SQLite database schema for user profiles and applications

Portfolio Website (2023)
• Created responsive personal portfolio using React and Tailwind CSS
• Deployed on Vercel with 99.9% uptime

SQL Analytics Dashboard (2023)
• Built data visualization dashboard using Python, Pandas, and Matplotlib
• Analyzed 50,000+ records for business insights

EXPERIENCE
Software Development Intern – TechStudio (June–August 2023)
• Developed REST APIs using FastAPI for internal tools
• Improved query performance by 40% through SQL optimization
• Collaborated in an Agile team of 8 developers

CERTIFICATIONS
• Python for Data Science – Coursera (2023)
• SQL for Analytics – Mode Analytics (2023)
• React Fundamentals – freeCodeCamp (2024)`;

const demoApplications: Application[] = [
  {
    id: 'app-1',
    company: 'TechNova',
    role: 'Junior Software Engineer',
    location: 'Bangalore, India (Hybrid)',
    jobDescription: 'We are looking for a junior engineer with Python, SQL, and REST API skills. Docker experience is a plus. Join our team to build scalable backend services.',
    status: 'Interview',
    appliedDate: new Date(Date.now() - 8 * 86400000).toISOString(),
    interviewDate: new Date(Date.now() + 86400000).toISOString(),
    nextAction: 'Prepare for technical round — review SQL JOINs and system design basics',
    notes: 'HR was responsive. Role aligns well with resume.',
    matchScore: 82,
    salary: '6–8 LPA',
  },
  {
    id: 'app-2',
    company: 'DataSystems Inc.',
    role: 'Backend Developer',
    location: 'Remote',
    jobDescription: 'Backend developer with Python, FastAPI, Docker and PostgreSQL. Experience with AWS is preferred. Agile development team.',
    status: 'Assessment',
    appliedDate: new Date(Date.now() - 14 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
    nextAction: 'Complete coding assessment — focus on algorithms and SQL queries',
    notes: 'Assessment due in 2 days. Focus on Python data structures.',
    matchScore: 74,
    salary: '8–12 LPA',
  },
  {
    id: 'app-3',
    company: 'CloudWorks',
    role: 'Cloud Engineer',
    location: 'Hyderabad, India',
    jobDescription: 'Cloud engineer with AWS, Docker, Kubernetes and Python. Strong DevOps background required.',
    status: 'Saved',
    appliedDate: new Date().toISOString(),
    nextAction: 'Learn Docker fundamentals before applying',
    notes: 'Great company culture. Need to improve AWS skills first.',
    matchScore: 58,
    salary: '10–15 LPA',
  },
  {
    id: 'app-4',
    company: 'Fintech Solutions',
    role: 'Full Stack Developer',
    location: 'Chennai, India (On-site)',
    jobDescription: 'Full stack developer with React, Node.js, Python and SQL. Experience with financial applications preferred.',
    status: 'Applied',
    appliedDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    nextAction: 'Follow up via LinkedIn if no response in 5 days',
    notes: 'Applied through company website directly.',
    matchScore: 78,
    salary: '7–10 LPA',
  },
  {
    id: 'app-5',
    company: 'StartupHub',
    role: 'Software Engineer',
    location: 'Remote',
    jobDescription: 'Generalist software engineer. Python, React, SQL basics. Startup mindset required.',
    status: 'Rejected',
    appliedDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    nextAction: 'Move on. Revisit in 6 months.',
    notes: 'Position filled internally. No feedback given.',
    matchScore: 71,
  },
];

const demoInterviewSessions: InterviewSession[] = [
  {
    id: 'int-1',
    applicationId: 'app-1',
    company: 'TechNova',
    role: 'Junior Software Engineer',
    interviewDate: new Date(Date.now() + 86400000).toISOString(),
    overallScore: undefined,
    notes: 'Technical round. Expect SQL, Python OOP, and REST API questions.',
    questions: [
      {
        id: 'q1',
        question: 'Explain the difference between INNER JOIN and LEFT JOIN in SQL.',
        category: 'SQL',
        userAnswer: 'INNER JOIN returns only rows where there is a match in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right table, with NULL for non-matching rows.',
        score: 85,
        feedback: 'Good answer! Consider adding a concrete example to strengthen.',
        followUp: 'Can you write a query to find all customers who have never placed an order?'
      },
      {
        id: 'q2',
        question: 'What are Python decorators and when would you use them?',
        category: 'Technical',
        userAnswer: '',
        score: undefined,
        feedback: undefined,
        followUp: undefined
      },
      {
        id: 'q3',
        question: 'Tell me about a challenging project you worked on.',
        category: 'Behavioral',
        userAnswer: '',
        score: undefined,
        feedback: undefined,
        followUp: undefined
      }
    ]
  }
];

// ─── STORE ───────────────────────────────────────────────────────────────────

export const useCareerStore = create<CareerStore>()(
  persist(
    (set) => ({
      user: null,
      applications: [],
      interviewSessions: [],
      lastXRayResult: null,
      aiStatus: null,
      isDemoLoaded: false,

      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      
      loadDemoProfile: () =>
        set({
          user: {
            name: 'Arun',
            targetRole: 'Junior Software Developer',
            experienceLevel: 'Entry Level (0–1 years)',
            availableTimePerDay: 150,
            careerGoal:
              'Land a full-stack or backend developer role at a product company within 3 months.',
            currentSkills: demoSkills,
            resumeText: demoResumeText,
            resumeAnalyzed: true,
          },
          applications: demoApplications,
          interviewSessions: demoInterviewSessions,
          isDemoLoaded: true,
          lastXRayResult: {
            matchScore: 78,
            strongMatches: ['Python', 'SQL', 'REST APIs', 'Git', 'FastAPI'],
            missingSkills: ['Docker', 'AWS', 'React Testing', 'Kubernetes'],
            biggestOpportunity: 'Docker',
            opportunityReason:
              'Docker is required in 4 of your 5 target jobs but is weak in your current profile. A 2-hour fundamentals session would meaningfully close this gap.',
            nextMove: {
              title: 'Complete Docker Fundamentals',
              duration: '45 minutes',
              reason:
                'Docker appears in 4 of your target job descriptions and your current level is 34%. Closing this gap has the highest return on your next 45 minutes.',
              impact: 'HIGH',
            },
            resumeAnalysis: {
              name: 'Arun Kumar',
              skills: ['Python', 'JavaScript', 'SQL', 'React', 'FastAPI', 'Git'],
              experience: ['Software Development Intern – TechStudio (2023)'],
              education: ['B.E. Computer Science – SRM Institute, 2024'],
              technologies: ['React', 'FastAPI', 'Flask', 'PostgreSQL', 'SQLite'],
            },
            usedAI: false,
          },
        }),

      clearProfile: () =>
        set({ user: null, applications: [], interviewSessions: [], lastXRayResult: null, isDemoLoaded: false }),

      addApplication: (app) =>
        set((state) => ({
          applications: [
            ...state.applications,
            { ...app, id: `app-${Date.now()}` },
          ],
        })),
      updateApplication: (id, updates) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      deleteApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((a) => a.id !== id),
        })),
      moveApplicationStage: (id, status) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      addInterviewSession: (session) =>
        set((state) => ({
          interviewSessions: [
            ...state.interviewSessions,
            { ...session, id: `int-${Date.now()}` },
          ],
        })),
      updateInterviewSession: (id, updates) =>
        set((state) => ({
          interviewSessions: state.interviewSessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      setXRayResult: (result) => set({ lastXRayResult: result }),
      setAIStatus: (status) => set({ aiStatus: status }),
      updateSkill: (name, updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                currentSkills: state.user.currentSkills.map((s) =>
                  s.name === name ? { ...s, ...updates } : s
                ),
              }
            : null,
        })),
    }),
    {
      name: 'careerbuddy-v2-storage',
    }
  )
);
