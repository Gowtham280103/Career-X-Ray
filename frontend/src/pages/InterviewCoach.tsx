import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Loader2,
  ChevronRight,
  Star,
  Send,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCareerStore, type InterviewQuestion } from '../store/useCareerStore';
import { generateInterviewQuestions, evaluateAnswer } from '../lib/apiClient';
import { cn } from '../lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  Technical: 'text-primary bg-primary/10 border-primary/20',
  Coding: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  SQL: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Behavioral: 'text-success bg-success/10 border-success/20',
  HR: 'text-warning bg-warning/10 border-warning/20',
  Project: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
};

const DEMO_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'dq1',
    question: 'Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN in SQL.',
    category: 'SQL',
  },
  {
    id: 'dq2',
    question: 'What are Python decorators? Give a practical example.',
    category: 'Technical',
  },
  {
    id: 'dq3',
    question: 'Design a simple REST API for a user authentication system.',
    category: 'Technical',
  },
  {
    id: 'dq4',
    question: 'Tell me about a time you faced a difficult technical challenge and how you solved it.',
    category: 'Behavioral',
  },
  {
    id: 'dq5',
    question: 'Write a Python function to find the second largest number in a list.',
    category: 'Coding',
  },
  {
    id: 'dq6',
    question: 'Where do you see yourself in 3 years?',
    category: 'HR',
  },
];

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-success' : score >= 60 ? 'bg-primary' : 'bg-warning';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surfaceLight rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-sm font-bold text-white w-12 text-right">{score}/100</span>
    </div>
  );
}

export function InterviewCoach() {
  const { user, applications, interviewSessions, updateInterviewSession, addInterviewSession } =
    useCareerStore();

  const [phase, setPhase] = useState<'setup' | 'practice' | 'session'>('setup');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQ, setActiveQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Pre-fill from upcoming interview
  const upcomingInterview = applications.find((a) => a.interviewDate && a.status === 'Interview');

  const handlePreFill = () => {
    if (upcomingInterview) {
      setCompany(upcomingInterview.company);
      setRole(upcomingInterview.role);
      setJobDesc(upcomingInterview.jobDescription || '');
    }
  };

  const handleGenerate = async () => {
    if (!company || !role) return;
    setGenerating(true);

    try {
      const data = await generateInterviewQuestions({
        company,
        role,
        resumeText: user?.resumeText ?? '',
        jobDescription: jobDesc,
        skillGaps:
          user?.currentSkills
            .filter((s) => s.level < 50)
            .map((s) => s.name) ?? [],
      });

      // Normalize response
      const qs: InterviewQuestion[] = (data.questions || []).map((q: any, i: number) => ({
        id: `q${i}`,
        question: typeof q === 'string' ? q : q.question,
        category: (typeof q === 'string' ? 'Technical' : q.category) ?? 'Technical',
      }));

      if (qs.length > 0) {
        setQuestions(qs);
        setDemoMode(false);
      } else {
        throw new Error('No questions returned');
      }
    } catch {
      setQuestions(DEMO_QUESTIONS);
      setDemoMode(true);
    } finally {
      setGenerating(false);
      setPhase('practice');
      setActiveQ(0);
    }
  };

  const currentQ = questions[activeQ];

  const handleEvaluate = async () => {
    if (!answer.trim() || !currentQ) return;
    setEvaluating(true);

    let feedback = '';
    let score = 0;
    let followUp = '';

    try {
      const data = await evaluateAnswer({
        question: currentQ.question,
        answer,
        role,
        category: currentQ.category,
      });
      score = data.score ?? 75;
      feedback = data.feedback ?? 'Good answer.';
      followUp = data.follow_up ?? data.followUp ?? '';
    } catch {
      // Deterministic fallback scoring
      const words = answer.trim().split(/\s+/).length;
      score = Math.min(95, Math.max(40, 55 + Math.floor(words / 3)));
      feedback =
        score >= 80
          ? 'Strong answer with good detail. Consider adding a concrete example to further strengthen it.'
          : score >= 65
          ? 'Decent answer. Add more specifics or a real-world example to improve your score.'
          : 'Your answer needs more depth. Try structuring it with the STAR method (Situation, Task, Action, Result).';
      followUp =
        currentQ.category === 'Technical'
          ? 'Can you explain a real situation where you applied this?'
          : currentQ.category === 'Behavioral'
          ? 'What would you do differently if you faced that situation again?'
          : undefined!;
    }

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === currentQ.id ? { ...q, userAnswer: answer, score, feedback, followUp } : q
      )
    );
    setEvaluating(false);
  };

  const overallScore =
    questions.filter((q) => q.score !== undefined).length > 0
      ? Math.round(
          questions
            .filter((q) => q.score !== undefined)
            .reduce((sum, q) => sum + (q.score ?? 0), 0) /
            questions.filter((q) => q.score !== undefined).length
        )
      : null;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Interview Coach</h1>
        <p className="text-textSecondary">
          AI-generated questions based on your resume, the role, and your skill gaps.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Setup Phase ── */}
        {phase === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {upcomingInterview && (
              <div
                className="p-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between cursor-pointer hover:bg-primary/15 transition-colors"
                onClick={handlePreFill}
              >
                <div className="flex items-center gap-3">
                  <Brain size={20} className="text-primary" />
                  <div>
                    <p className="text-sm font-bold text-white">
                      Upcoming: {upcomingInterview.company} — {upcomingInterview.role}
                    </p>
                    <p className="text-xs text-primary mt-0.5">
                      Click to pre-fill from this application
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-primary" />
              </div>
            )}

            <Card>
              <h3 className="text-base font-bold mb-5">Interview Setup</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-1.5 uppercase tracking-wider">
                      Company <span className="text-danger">*</span>
                    </label>
                    <input
                      className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all"
                      placeholder="e.g. TechNova"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-1.5 uppercase tracking-wider">
                      Role <span className="text-danger">*</span>
                    </label>
                    <input
                      className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all"
                      placeholder="e.g. Software Engineer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textMuted mb-1.5 uppercase tracking-wider">
                    Job Description (Optional — improves question quality)
                  </label>
                  <textarea
                    className="w-full bg-surfaceLight border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all resize-none h-28"
                    placeholder="Paste the job description for better question targeting..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>
                <Button
                  size="lg"
                  className="w-full gap-2"
                  disabled={!company || !role || generating}
                  onClick={handleGenerate}
                >
                  {generating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={18} />
                      Generate Interview Questions
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-textMuted flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} className="text-success" />
                  Questions generated locally with Ollama
                </p>
              </div>
            </Card>

            {/* Past sessions */}
            {interviewSessions.length > 0 && (
              <Card>
                <h3 className="text-sm font-bold uppercase tracking-wider text-textMuted mb-4">
                  Past Sessions
                </h3>
                <div className="space-y-3">
                  {interviewSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-surfaceLight/50 border border-border"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{session.company}</p>
                        <p className="text-xs text-textMuted">{session.role}</p>
                      </div>
                      <div className="text-right">
                        {session.overallScore !== undefined ? (
                          <p className="text-lg font-bold text-white">
                            {session.overallScore}
                            <span className="text-xs text-textMuted">/100</span>
                          </p>
                        ) : (
                          <p className="text-xs text-textMuted">In progress</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* ── Practice Phase ── */}
        {phase === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Mode indicator */}
            {demoMode ? (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/10 border border-warning/30 text-xs">
                <AlertTriangle size={14} className="text-warning shrink-0 mt-0.5" />
                <p className="text-textSecondary">
                  <span className="font-bold text-warning">DEMO MODE</span> — Showing preset questions. Start Ollama for AI-generated questions.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20 text-xs font-semibold text-success">
                <ShieldCheck size={13} />
                LOCAL AI · Questions generated for {company} — {role}
              </div>
            )}

            {/* Progress */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-textMuted">
                Question {activeQ + 1} of {questions.length}
              </span>
              {overallScore !== null && (
                <span className="text-white font-bold">
                  Current Score: {overallScore}/100
                </span>
              )}
            </div>
            <div className="h-1.5 bg-surfaceLight rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${((activeQ + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Question tabs */}
            <div className="flex gap-2 flex-wrap">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQ(i);
                    setAnswer(q.userAnswer || '');
                  }}
                  className={cn(
                    'w-9 h-9 rounded-lg text-sm font-bold border transition-colors',
                    i === activeQ
                      ? 'bg-primary text-white border-primary'
                      : q.score !== undefined
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-surfaceLight text-textMuted border-border hover:border-primary/30'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Current question */}
            {currentQ && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <Card className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span
                        className={cn(
                          'text-xs font-bold px-2.5 py-1 rounded-full border',
                          CATEGORY_COLORS[currentQ.category] || CATEGORY_COLORS.Technical
                        )}
                      >
                        {currentQ.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-relaxed">
                      {currentQ.question}
                    </h3>
                  </Card>

                  {/* Answer area */}
                  {!currentQ.score ? (
                    <Card className="p-6">
                      <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-3">
                        Your Answer
                      </label>
                      <textarea
                        className="w-full bg-surfaceLight border border-border rounded-xl p-4 text-sm text-white placeholder-textMuted focus:border-primary outline-none transition-all resize-none h-36"
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                      <div className="flex gap-3 mt-4">
                        <Button
                          className="gap-2"
                          disabled={!answer.trim() || evaluating}
                          onClick={handleEvaluate}
                        >
                          {evaluating ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Evaluating...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Submit Answer
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            if (activeQ < questions.length - 1) {
                              setActiveQ((v) => v + 1);
                              setAnswer(questions[activeQ + 1]?.userAnswer || '');
                            }
                          }}
                          disabled={activeQ === questions.length - 1}
                        >
                          Skip
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-6 space-y-5">
                      {/* Score */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-textMuted">
                            Score
                          </h4>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={
                                  star <= Math.round((currentQ.score! / 100) * 5)
                                    ? 'text-warning fill-warning'
                                    : 'text-border'
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <ScoreBar score={currentQ.score!} />
                      </div>

                      {/* Answer given */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-2">
                          Your Answer
                        </p>
                        <p className="text-sm text-textSecondary leading-relaxed bg-surfaceLight rounded-lg p-3 border border-border">
                          {currentQ.userAnswer}
                        </p>
                      </div>

                      {/* Feedback */}
                      {currentQ.feedback && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-2">
                            AI Feedback
                          </p>
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-textSecondary leading-relaxed">
                              {currentQ.feedback}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Follow-up */}
                      {currentQ.followUp && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-2">
                            Follow-up Question
                          </p>
                          <p className="text-sm text-primary italic">
                            "{currentQ.followUp}"
                          </p>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex gap-3">
                        {activeQ < questions.length - 1 && (
                          <Button
                            className="gap-2 group"
                            onClick={() => {
                              setActiveQ((v) => v + 1);
                              setAnswer(questions[activeQ + 1]?.userAnswer || '');
                            }}
                          >
                            Next Question
                            <ArrowRight
                              size={15}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </Button>
                        )}
                        {activeQ === questions.length - 1 && overallScore !== null && (
                          <div className="w-full p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-success mb-1">
                              Session Complete
                            </p>
                            <p className="text-3xl font-bold text-white">
                              {overallScore}
                              <span className="text-base text-textSecondary">/100</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Reset */}
            <div className="text-center">
              <button
                onClick={() => {
                  setPhase('setup');
                  setQuestions([]);
                  setAnswer('');
                  setActiveQ(0);
                }}
                className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors"
              >
                <RefreshCw size={14} />
                Start new session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
