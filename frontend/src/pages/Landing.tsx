import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  ShieldCheck,
  ArrowRight,
  Zap,
  ScanSearch,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  Lock,
  Cpu,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCareerStore } from '../store/useCareerStore';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Landing() {
  const navigate = useNavigate();
  const { loadDemoProfile } = useCareerStore();

  const handleDemo = () => {
    loadDemoProfile();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">CareerBuddy</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-success/30 bg-success/10 text-success text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            LOCAL AI
          </div>
          <Button size="sm" onClick={handleDemo}>
            Try Demo
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <ShieldCheck size={14} />
            Your career data stays on your device
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            CareerBuddy
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-xl md:text-2xl text-textSecondary mb-4 leading-relaxed max-w-2xl mx-auto"
          >
            Your next move toward the job you want.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="text-base text-textMuted mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Private local AI that turns your resume, goals and job descriptions
            into a personalized career plan. Runs entirely on your device.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" onClick={handleDemo} className="gap-2 group">
              Build My Career Plan
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              See How It Works
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview Card */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="px-6 md:px-12 max-w-5xl mx-auto mb-32"
      >
        <div className="relative rounded-2xl border border-border overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="bg-surface/90 backdrop-blur p-6 md:p-8">
            {/* Mock dashboard */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-danger/60" />
              <div className="w-2 h-2 rounded-full bg-warning/60" />
              <div className="w-2 h-2 rounded-full bg-success/60" />
              <span className="ml-3 text-xs text-textMuted">CareerBuddy Dashboard</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2 bg-surfaceLight rounded-xl p-5 border border-primary/20">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  <Zap size={12} className="animate-pulse" />
                  Your Next Best Move
                </div>
                <p className="text-xl font-bold text-white mb-2">
                  Complete Docker Fundamentals
                </p>
                <p className="text-sm text-textSecondary mb-4">
                  Docker appears in 4 of your target jobs. 45 min closes this gap.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30">
                    45 min
                  </span>
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded border border-success/20">
                    Impact: HIGH
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-surfaceLight rounded-xl p-4 border border-border">
                  <p className="text-xs text-textMuted mb-1">Career Match</p>
                  <p className="text-3xl font-bold text-white">78%</p>
                </div>
                <div className="bg-surfaceLight rounded-xl p-4 border border-border">
                  <p className="text-xs text-textMuted mb-1">Applications</p>
                  <p className="text-3xl font-bold text-white">5</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {[
                { name: 'Python', pct: 88 },
                { name: 'SQL', pct: 72 },
                { name: 'React', pct: 61 },
                { name: 'Git', pct: 80 },
                { name: 'Docker', pct: 34 },
                { name: 'AWS', pct: 28 },
                { name: 'JS', pct: 68 },
                { name: 'APIs', pct: 75 },
              ].map((s) => (
                <div key={s.name} className="text-center">
                  <div className="text-xs text-textMuted mb-1 truncate">{s.name}</div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-textSecondary mt-1">{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
            Everything you need
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Job hunting shouldn't feel like guessing.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: ScanSearch,
              title: 'Career X-Ray',
              description:
                'Deep AI analysis of your resume vs. any job description. Understand where you stand in 60 seconds.',
              badge: 'Signature Feature',
            },
            {
              icon: Zap,
              title: 'Next Best Move',
              description:
                "The system answers one question: what's the ONE thing you should do right now to get closer to an offer?",
              badge: 'Core Feature',
            },
            {
              icon: MessageSquare,
              title: 'Interview Coach',
              description:
                'AI generates questions based on your resume and the job. Practice, get scored, improve.',
              badge: null,
            },
            {
              icon: Briefcase,
              title: 'Application Tracker',
              description:
                'Track every application from Saved to Offer. Never miss a follow-up or deadline.',
              badge: null,
            },
            {
              icon: TrendingUp,
              title: 'Skill Gap Engine',
              description:
                'Visual comparison of your skills vs. what target jobs actually require. Prioritized by relevance.',
              badge: null,
            },
            {
              icon: Target,
              title: 'Daily Career Plan',
              description:
                'AI builds a focused daily schedule based on your interviews, gaps, and available time.',
              badge: null,
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-surface/60 backdrop-blur border border-border rounded-2xl p-6 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <feature.icon size={20} className="text-primary" />
                </div>
                {feature.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    {feature.badge}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Privacy Section */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-surface/60 backdrop-blur p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6">
              <Lock size={28} className="text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Private by design.</h2>
            <p className="text-textSecondary text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              CareerBuddy uses Ollama to run AI models locally on your device.
              Your resume, job descriptions, and career data never leave your
              machine.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { icon: Cpu, title: 'Local Inference', desc: 'Runs on your device' },
                { icon: Lock, title: 'No Cloud', desc: 'Zero external API calls' },
                { icon: ShieldCheck, title: 'Open Source', desc: 'Transparent AI models' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surfaceLight/50 rounded-xl p-4 border border-border"
                >
                  <item.icon size={20} className="text-success mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-textMuted mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Know what to do next.</h2>
          <p className="text-textSecondary mt-4 max-w-xl mx-auto">
            CareerBuddy doesn't just tell you where you stand. It tells you
            what to do next.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-0">
          {[
            {
              step: '01',
              title: 'Upload Your Resume',
              desc: 'Paste your resume and CareerBuddy extracts your skills, experience, and strengths.',
            },
            {
              step: '02',
              title: 'Add Target Jobs',
              desc: 'Add job descriptions you\'re targeting. The AI identifies what each role actually needs.',
            },
            {
              step: '03',
              title: 'Get Your Next Move',
              desc: 'CareerBuddy analyzes gaps, urgency, and effort to recommend the single most impactful next action.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex-1 relative"
            >
              {i < 2 && (
                <div className="hidden md:block absolute top-8 right-0 w-px h-24 bg-gradient-to-b from-border to-transparent" />
              )}
              <div className="px-6 md:px-8 py-6">
                <div className="text-4xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-textSecondary leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-surface border border-primary/20 p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Turn uncertainty into your next move.
          </h2>
          <p className="text-textSecondary mb-10 max-w-lg mx-auto leading-relaxed">
            Load a demo profile instantly and see CareerBuddy analyze a full
            career situation in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleDemo} className="gap-2 group">
              <Zap size={18} />
              Load Demo Profile
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-textMuted">
            <CheckCircle2 size={12} className="text-success" />
            No signup needed — everything runs locally
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-md bg-primary/80 flex items-center justify-center">
            <Bot size={12} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">CareerBuddy</span>
        </div>
        <p className="text-xs text-textMuted">
          Built for Hacktoberfest Weekend Challenge · Open-source AI · Private by design
        </p>
      </footer>
    </div>
  );
}
