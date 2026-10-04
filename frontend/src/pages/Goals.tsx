
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle } from 'lucide-react';

export function Goals() {
  const { goals, toggleMilestone } = useStore();

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Goals</h1>
        <p className="text-textSecondary">Your high-level objectives and progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <Target size={14} />
                    {goal.category}
                  </div>
                  <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                </div>
                <div className="shrink-0">
                  <ProgressRing progress={goal.progress} size={60} strokeWidth={4} />
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-medium text-textSecondary mb-3">Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.map(milestone => (
                    <div 
                      key={milestone.id} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surfaceLight transition-colors cursor-pointer group"
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                    >
                      <button className="text-textMuted group-hover:text-primary transition-colors">
                        {milestone.completed ? <CheckCircle2 size={18} className="text-primary" /> : <Circle size={18} />}
                      </button>
                      <span className={`text-sm ${milestone.completed ? 'text-textMuted line-through' : 'text-white'}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-sm text-textSecondary">
                <span>{goal.progress === 100 ? 'Completed' : 'On Track'}</span>
                {goal.targetDate && <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
