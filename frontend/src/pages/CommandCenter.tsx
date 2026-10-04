import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { NextMove } from '../components/features/NextMove';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { getNextMove } from '../lib/aiEngine';
import { formatTime } from '../lib/utils';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function CommandCenter() {
  const { user, tasks } = useStore();
  
  const recommendation = useMemo(() => getNextMove(tasks), [tasks]);
  
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {getGreeting()}, <span className="text-gradient-primary">{user.name}</span>.
        </h1>
        <p className="text-textSecondary text-lg">
          You have {tasks.filter(t => t.status !== 'DONE').length} important things today. One decision needs your attention.
        </p>
      </motion.div>

      {/* Signature Feature */}
      <motion.div variants={itemVariants}>
        <NextMove recommendation={recommendation} />
      </motion.div>

      {/* Momentum & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Momentum Card */}
        <motion.div variants={itemVariants} className="md:col-span-5 lg:col-span-4">
          <Card className="h-full flex flex-col items-center justify-center p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-textMuted mb-6 w-full text-left">
              Today's Momentum
            </h3>
            
            <div className="relative mb-6">
              <ProgressRing progress={completionRate} size={140} strokeWidth={10} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-surfaceLight rounded-xl p-3 text-center">
                <div className="text-xs text-textMuted mb-1">Focus Score</div>
                <div className="text-xl font-bold">{user.focusScore}<span className="text-sm text-textSecondary font-normal">/10</span></div>
              </div>
              <div className="bg-surfaceLight rounded-xl p-3 text-center">
                <div className="text-xs text-textMuted mb-1">Available</div>
                <div className="text-xl font-bold">{formatTime(user.timeAvailableMinutes)}</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Timeline (Simulated) */}
        <motion.div variants={itemVariants} className="md:col-span-7 lg:col-span-5">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-textMuted">Timeline</h3>
              <button className="text-xs text-primary hover:text-primaryHover">Edit Schedule</button>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border before:to-transparent">
              {[
                { time: '09:00', label: 'Deep Work Block', type: 'focus' },
                { time: '11:30', label: 'Team Standup', type: 'meeting' },
                { time: '14:00', label: 'Learning: React', type: 'learn' },
                { time: '18:00', label: 'Free Time', type: 'break' },
              ].map((event, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-surface bg-surfaceLight group-hover:bg-primary group-hover:border-primary/30 transition-colors z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm"></div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-xl border border-border bg-surfaceLight/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{event.time}</span>
                    </div>
                    <div className="text-sm text-textSecondary">{event.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* AI Insight & Upcoming */}
        <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-3 space-y-6">
          <Card className="bg-primary/10 border-primary/20">
            <div className="flex items-start gap-3">
              <SparklesIcon className="text-primary shrink-0 mt-1" size={18} />
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">AI Insight</h4>
                <p className="text-sm text-textSecondary leading-relaxed">
                  You are spending 34% more time on high-impact tasks this week compared to last week. Keep it up!
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-textMuted mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {tasks.filter(t => t.deadline).slice(0, 3).map(task => (
                <div key={task.id} className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center text-danger shrink-0">
                    <Target size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{task.title}</p>
                    <p className="text-xs text-textMuted mt-0.5">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
