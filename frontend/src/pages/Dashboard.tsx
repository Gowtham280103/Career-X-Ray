import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  ArrowRight,
  Play,
  Briefcase,
  ScanSearch,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useCareerStore } from '../store/useCareerStore';
import { cn } from '../lib/utils';
import { STAGE_CONFIG } from '../types';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user, applications, lastXRayResult, loadDemoProfile } = useCareerStore();

  // Upcoming interviews
  const upcomingInterviews = useMemo(
    () =>
      applications
        .filter((a) => a.interviewDate && new Date(a.interviewDate) > new Date())
        .sort(
          (a, b) =>
            new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime()
        ),
    [applications]
  );

  // Active applications count
  const activeApps = applications.filter(
    (a) => a.status !== 'Rejected' && a.status !== 'Offer'
  ).length;

  // Attention-needed applications
  const needsAttention = applications.filter((a) =>
    ['Assessment', 'Interview'].includes(a.status)
  );

  // Top skill gaps
  const topSkillGaps = useMemo(() => {
    if (!user?.currentSkills) return [];
    return [...user.currentSkills]
      .filter((s) => s.level < 50 && s.jobRelevance >= 7)
      .sort((a, b) => b.jobRelevance * (100 - a.level) - a.jobRelevance * (100 - b.level))
      .slice(0, 4);
  }, [user]);

  const nextMove = lastXRayResult?.nextMove ?? {
    title: user
      ? topSkillGaps[0]
        ? `Practice ${topSkillGaps[0].name}`
        : 'Run Career X-Ray Analysis'
      : null,
    duration: '45 minutes',
    reason: user
      ? topSkillGaps[0]
        ? `${topSkillGaps[0].name} appears in multiple target jobs and your current level is low.`
        : 'Analyze your resume against a job description to get personalized recommendations.'
      : '',
    impact: 'HIGH' as const,
  };

  // ─── Empty state ────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Zap size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Welcome to CareerBuddy
          </h1>
          <p className="text-textSecondary mb-10 text-lg leading-relaxed">
            Your private local AI career companion. Let's get you closer to your
            next offer.
          </p>
          <Button size="lg" onClick={loadDemoProfile} className="w-full gap-2 mb-4">
            <Zap size={18} />
            Load Demo Profile
          </Button>
          <p className="text-xs text-textMuted">
            For judges: click above to instantly populate a complete career profile.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 pb-16"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold mb-1">
          {getGreeting()},{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">
            {user.name}
          </span>
          .
        </h1>
        <p className="text-textSecondary text-lg">Let's get you closer to your next offer.</p>
      </motion.div>

      {/* ── Signature: Next Best Move ── */}
      <motion.div variants={item}>
        <div className="relative rounded-2xl border border-primary/30 bg-surface overflow-hidden p-6 md:p-8 shadow-[0_0_40px_rgba(99,102,241,0.12)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                <Zap size={13} className="animate-pulse" />
                Your Next Best Move
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                {nextMove.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-textSecondary mb-5">
                <span className="flex items-center gap-1.5 bg-surfaceLight px-2.5 py-1 rounded-lg border border-border">
                  <Clock size={13} /> {nextMove.duration}
                </span>
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20 font-semibold text-xs">
                  Impact: {nextMove.impact}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-textMuted mb-2">
                  Why this was chosen
                </p>
                <ul className="space-y-1.5">
                  {[
                    nextMove.reason,
                    upcomingInterviews.length > 0
                      ? `Interview at ${upcomingInterviews[0].company} in ${daysUntil(upcomingInterviews[0].interviewDate!)} day(s).`
                      : null,
                    needsAttention.length > 0
                      ? `${needsAttention.length} application(s) need attention.`
                      : null,
                  ]
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-textSecondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="w-full md:w-52 flex flex-col gap-3 shrink-0">
              <Button
                size="lg"
                className="w-full gap-2 group"
                onClick={() => navigate('/xray')}
              >
                <Play size={17} className="fill-current" />
                Start Now
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Button>
              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={() => navigate('/xray')}
              >
                <ScanSearch size={15} />
                Run Career X-Ray
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Career Match',
            value: lastXRayResult ? `${lastXRayResult.matchScore}%` : '—',
            sub: lastXRayResult ? 'vs. latest job' : 'Run X-Ray first',
            icon: TrendingUp,
            color: 'text-primary',
          },
          {
            label: 'Applications',
            value: applications.length,
            sub: `${activeApps} active`,
            icon: Briefcase,
            color: 'text-blue-400',
          },
          {
            label: 'Interviews',
            value: upcomingInterviews.length,
            sub: upcomingInterviews.length > 0 ? `Next in ${daysUntil(upcomingInterviews[0].interviewDate!)}d` : 'None scheduled',
            icon: CalendarDays,
            color: 'text-success',
          },
          {
            label: 'Needs Attention',
            value: needsAttention.length,
            sub: needsAttention.length > 0 ? needsAttention[0].company : 'All clear',
            icon: AlertCircle,
            color: 'text-warning',
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            hoverEffect
            className="p-5 flex flex-col gap-1"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-textMuted">
                {stat.label}
              </p>
              <stat.icon size={15} className={stat.color} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-textSecondary">{stat.sub}</p>
          </Card>
        ))}
      </motion.div>

      {/* ── Lower grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Gap Overview */}
        <motion.div variants={item} className="lg:col-span-1">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-textMuted">
                Top Skill Gaps
              </h3>
              <button
                onClick={() => navigate('/xray')}
                className="text-xs text-primary hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                X-Ray <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-4">
              {topSkillGaps.length === 0 ? (
                <p className="text-sm text-textMuted">Run Career X-Ray to see gaps.</p>
              ) : (
                topSkillGaps.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-white">{skill.name}</span>
                      <span className="text-textSecondary">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-surfaceLight rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            skill.level < 40
                              ? 'rgb(239,68,68)'
                              : skill.level < 65
                              ? 'rgb(245,158,11)'
                              : 'rgb(99,102,241)',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Applications */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-textMuted">
                Recent Applications
              </h3>
              <button
                onClick={() => navigate('/applications')}
                className="text-xs text-primary hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => {
                const cfg = STAGE_CONFIG[app.status];
                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surfaceLight/50 border border-border hover:border-primary/20 transition-colors cursor-pointer"
                    onClick={() => navigate('/applications')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {app.company.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{app.company}</p>
                        <p className="text-xs text-textMuted">{app.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {app.matchScore && (
                        <span className="text-xs text-textMuted hidden md:block">
                          {app.matchScore}% match
                        </span>
                      )}
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded-full border',
                          cfg.color,
                          cfg.bg,
                          cfg.border
                        )}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              {applications.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-textMuted">No applications yet.</p>
                  <button
                    onClick={() => navigate('/applications')}
                    className="text-xs text-primary mt-2 hover:underline"
                  >
                    Add your first application
                  </button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <motion.div variants={item}>
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-surface">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                Upcoming Interviews
              </h3>
              <CalendarDays size={16} className="text-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingInterviews.slice(0, 2).map((app) => (
                <div
                  key={app.id}
                  className="bg-surface/60 rounded-xl p-4 border border-primary/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-white">{app.company}</p>
                      <p className="text-sm text-primary">{app.role}</p>
                    </div>
                    <ProgressRing progress={app.matchScore ?? 0} size={44} strokeWidth={3} />
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-textMuted">
                      {new Date(app.interviewDate!).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
