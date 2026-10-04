import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Play,
  Loader2,
  ScanSearch,
  ShieldCheck,
  RefreshCw,
  Zap,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { runCareerXRay } from '../lib/apiClient';
import { useCareerStore } from '../store/useCareerStore';
import type { CareerXRayResult } from '../store/useCareerStore';

const ANALYSIS_STEPS = [
  'Reading resume...',
  'Extracting skills...',
  'Understanding job requirements...',
  'Comparing experience...',
  'Finding skill gaps...',
  'Calculating match score...',
  'Generating career recommendations...',
];

function SkillBar({ name, level, gap = false }: { name: string; level: number; gap?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className={`font-medium ${gap ? 'text-danger' : 'text-white'}`}>{name}</span>
        <span className="text-textSecondary">{level}%</span>
      </div>
      <div className="h-1.5 bg-surfaceLight rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: gap
              ? 'rgb(239,68,68)'
              : level >= 70
              ? 'rgb(16,185,129)'
              : level >= 50
              ? 'rgb(99,102,241)'
              : 'rgb(245,158,11)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function CareerXRay() {
  const { user, setXRayResult, lastXRayResult } = useCareerStore();

  const [resume, setResume] = useState(user?.resumeText ?? '');
  const [jobDesc, setJobDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<CareerXRayResult | null>(lastXRayResult);
  const [showResumeAnalysis, setShowResumeAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDesc.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    // Animate through steps
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalysisStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }

    try {
      const data = await runCareerXRay(resume, jobDesc);

      const normalized: CareerXRayResult = {
        matchScore: data.match_analysis?.match_score ?? data.matchScore ?? 65,
        strongMatches: data.match_analysis?.strong_matches ?? data.strongMatches ?? [],
        missingSkills: data.match_analysis?.missing_skills ?? data.missingSkills ?? [],
        biggestOpportunity:
          data.match_analysis?.missing_skills?.[0] ??
          data.biggestOpportunity ??
          'Review job requirements',
        opportunityReason:
          data.next_move?.reason ??
          data.opportunityReason ??
          'This skill appears frequently in target job descriptions.',
        nextMove: {
          title: data.next_move?.title ?? 'Improve key skill gaps',
          duration: data.next_move?.duration ?? '45 minutes',
          reason: data.next_move?.reason ?? '',
          impact: (data.next_move?.impact as 'HIGH' | 'MEDIUM' | 'LOW') ?? 'HIGH',
        },
        resumeAnalysis: {
          name: data.resume_analysis?.name ?? 'You',
          skills: data.resume_analysis?.skills ?? [],
          experience: data.resume_analysis?.experience ?? [],
          education: data.resume_analysis?.education ?? [],
          technologies: data.resume_analysis?.technologies ?? [],
        },
        usedAI: true,
      };

      setResult(normalized);
      setXRayResult(normalized);
    } catch {
      // Deterministic fallback — clearly labeled DEMO MODE
      const fallback: CareerXRayResult = {
        matchScore: 74,
        strongMatches: ['Python', 'SQL', 'REST APIs', 'Git', 'FastAPI'],
        missingSkills: ['Docker', 'AWS', 'React Testing', 'Kubernetes'],
        biggestOpportunity: 'Docker',
        opportunityReason:
          'Docker is required in multiple target jobs but is not demonstrated strongly in the resume.',
        nextMove: {
          title: 'Complete Docker Fundamentals',
          duration: '45 minutes',
          reason:
            'Docker appears in 4 of your target job descriptions. A 45-minute fundamentals session would close this gap meaningfully.',
          impact: 'HIGH',
        },
        resumeAnalysis: {
          name: 'Resume Owner',
          skills: ['Python', 'SQL', 'JavaScript', 'React', 'Git'],
          experience: ['Software Engineer', 'Intern'],
          education: ['B.E. Computer Science'],
          technologies: ['React', 'FastAPI', 'PostgreSQL'],
        },
        usedAI: false,
      };
      setResult(fallback);
      setXRayResult(fallback);
      setError(
        'Local AI is offline. Showing demo analysis. Start Ollama for real AI analysis.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const scoreColor =
    (result?.matchScore ?? 0) >= 80
      ? '#10b981'
      : (result?.matchScore ?? 0) >= 65
      ? '#818cf8'
      : '#f59e0b';

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mb-4">
          <ScanSearch size={13} />
          Signature Feature
        </div>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">Career X-Ray</h1>
        <p className="text-textSecondary text-lg max-w-xl mx-auto">
          Deep local AI analysis of your fit for a specific role. Paste your resume and
          any job description.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Input Step ── */}
        {!isAnalyzing && !result && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Your Resume
                    {user?.resumeAnalyzed && (
                      <span className="ml-2 text-xs text-success font-normal">
                        ✓ Pre-filled from profile
                      </span>
                    )}
                  </label>
                  <textarea
                    className="w-full h-40 bg-surfaceLight border border-border rounded-xl p-4 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Paste your resume text here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Target Job Description
                  </label>
                  <textarea
                    className="w-full h-40 bg-surfaceLight border border-border rounded-xl p-4 text-sm text-white placeholder-textMuted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Paste the job description you're targeting..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>
                <Button
                  size="lg"
                  className="w-full gap-2"
                  disabled={!resume.trim() || !jobDesc.trim()}
                  onClick={handleAnalyze}
                >
                  <ScanSearch size={18} />
                  Run Deep Analysis
                </Button>
                <p className="text-center text-xs text-textMuted flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} className="text-success" />
                  Processed locally · Your data never leaves this device
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── Analyzing ── */}
        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="w-20 h-20 rounded-full bg-surface border border-primary/40 flex items-center justify-center relative z-10">
                <Loader2 size={28} className="text-primary animate-spin" />
              </div>
            </div>
            <div className="h-9 overflow-hidden mb-3">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={analysisStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-semibold text-white text-center"
                >
                  {ANALYSIS_STEPS[analysisStep]}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-xs text-textMuted flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-success" />
              Analyzing with local AI
            </p>
            <div className="mt-6 flex gap-2">
              {ANALYSIS_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i <= analysisStep
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-surfaceLight'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {!isAnalyzing && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* AI/Demo mode indicator */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30 text-sm">
                <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-warning">DEMO MODE — Local AI Offline</p>
                  <p className="text-textSecondary mt-0.5">{error}</p>
                </div>
              </div>
            )}
            {!error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20 text-xs font-semibold text-success">
                <ShieldCheck size={14} />
                LOCAL AI · Analyzed by Ollama · Your data stayed on this device
              </div>
            )}

            {/* Match Score Hero */}
            <Card className="p-8 text-center border-primary/30 shadow-[0_0_40px_rgba(99,102,241,0.12)] relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-textMuted mb-6">
                  Career Match Score
                </h2>
                <div className="flex justify-center mb-4">
                  <ProgressRing
                    progress={result.matchScore}
                    size={160}
                    strokeWidth={12}
                    color={scoreColor}
                  />
                </div>
                <p className="text-textSecondary text-sm">
                  {result.matchScore >= 80
                    ? 'Strong match — you\'re well positioned for this role.'
                    : result.matchScore >= 65
                    ? 'Good match — a few targeted improvements will make you competitive.'
                    : 'Developing match — focus on the skill gaps identified below.'}
                </p>
              </div>
            </Card>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strong matches */}
              <Card className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-textSecondary mb-5 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-success" />
                  Strong Matches
                </h3>
                <div className="space-y-3">
                  {result.strongMatches.map((skill, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-success/10 border border-success/20"
                    >
                      <CheckCircle2 size={14} className="text-success shrink-0" />
                      <span className="text-sm font-medium text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Skill gaps */}
              <Card className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-textSecondary mb-5 flex items-center gap-2">
                  <AlertTriangle size={15} className="text-warning" />
                  Skill Gaps
                </h3>
                <div className="space-y-3">
                  {result.missingSkills.map((skill, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                        i === 0
                          ? 'bg-danger/10 border-danger/30'
                          : 'bg-warning/10 border-warning/20'
                      }`}
                    >
                      <AlertTriangle
                        size={14}
                        className={i === 0 ? 'text-danger shrink-0' : 'text-warning shrink-0'}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-white">{skill}</span>
                        {i === 0 && (
                          <span className="ml-2 text-xs bg-danger/20 text-danger px-1.5 py-0.5 rounded font-semibold">
                            Priority
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 rounded-xl bg-surface/80 border border-border">
                  <p className="text-xs text-textMuted uppercase tracking-wider mb-1.5">
                    Biggest Opportunity
                  </p>
                  <p className="text-white font-bold">{result.biggestOpportunity}</p>
                  <p className="text-xs text-textSecondary mt-1.5 leading-relaxed">
                    {result.opportunityReason}
                  </p>
                </div>
              </Card>
            </div>

            {/* Next Best Move */}
            <Card className="p-6 bg-gradient-to-r from-surface to-surfaceLight border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                <Zap size={13} className="animate-pulse" />
                Your Next Best Move
              </div>
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-white mb-2">{result.nextMove.title}</h4>
                  <p className="text-textSecondary text-sm mb-4 leading-relaxed max-w-lg">
                    {result.nextMove.reason}
                  </p>
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1.5 text-xs bg-surface px-2.5 py-1 rounded-lg border border-border text-textMuted">
                      <Clock size={12} />
                      {result.nextMove.duration}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                        result.nextMove.impact === 'HIGH'
                          ? 'bg-success/10 text-success border-success/20'
                          : result.nextMove.impact === 'MEDIUM'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : 'bg-surfaceLight text-textSecondary border-border'
                      }`}
                    >
                      Impact: {result.nextMove.impact}
                    </span>
                  </div>
                </div>
                <Button className="gap-2 group shrink-0">
                  <Play size={15} className="fill-current" />
                  Start Plan
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </Card>

            {/* Resume Analysis Accordion */}
            <Card className="p-6">
              <button
                className="w-full flex items-center justify-between"
                onClick={() => setShowResumeAnalysis((v) => !v)}
              >
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <TrendingUp size={15} className="text-primary" />
                  Resume Profile Analysis
                </div>
                {showResumeAnalysis ? (
                  <ChevronUp size={16} className="text-textMuted" />
                ) : (
                  <ChevronDown size={16} className="text-textMuted" />
                )}
              </button>

              <AnimatePresence>
                {showResumeAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 space-y-5 pt-5 border-t border-border">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Star size={13} className="text-primary" />
                          <p className="text-xs font-bold uppercase tracking-wider text-textMuted">
                            Extracted Skills
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.resumeAnalysis.skills.map((s, i) => (
                            <span
                              key={i}
                              className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg"
                            >
                              {s}
                            </span>
                          ))}
                          {result.resumeAnalysis.skills.length === 0 && (
                            <p className="text-xs text-textMuted">Not found in resume.</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3">
                          Experience
                        </p>
                        {result.resumeAnalysis.experience.length > 0 ? (
                          <ul className="space-y-2">
                            {result.resumeAnalysis.experience.map((e, i) => (
                              <li
                                key={i}
                                className="text-sm text-textSecondary flex items-start gap-2"
                              >
                                <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                                {e}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-textMuted">Not found in resume.</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-textMuted mb-3">
                          Education
                        </p>
                        {result.resumeAnalysis.education.length > 0 ? (
                          <ul className="space-y-1">
                            {result.resumeAnalysis.education.map((e, i) => (
                              <li key={i} className="text-sm text-textSecondary">
                                {e}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-textMuted">Not found in resume.</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Reset */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-white transition-colors"
              >
                <RefreshCw size={14} />
                Analyze another job
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
