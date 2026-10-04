import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Zap, Clock, ArrowRight, Play } from 'lucide-react';
import type { NextMoveRecommendation } from '../../lib/aiEngine';

interface NextMoveProps {
  recommendation: NextMoveRecommendation | null;
}

export function NextMove({ recommendation }: NextMoveProps) {
  if (!recommendation) {
    return (
      <Card className="bg-gradient-to-br from-surface to-surfaceLight border-surfaceLight p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-surfaceLight mx-auto flex items-center justify-center mb-4">
          <Zap className="text-primary" size={24} />
        </div>
        <h3 className="text-xl font-semibold mb-2">You're all caught up.</h3>
        <p className="text-textSecondary">Your system is clear. Enjoy the momentum.</p>
      </Card>
    );
  }

  const { task, priorityScore, reasoning } = recommendation;

  return (
    <Card className="border-primary/30 shadow-glow relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            <Zap size={14} className="animate-pulse" />
            Your Next Best Action
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{task.title}</h2>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-textSecondary mb-6">
            <div className="flex items-center gap-1.5 bg-surfaceLight px-2.5 py-1 rounded-md border border-border">
              <Clock size={14} />
              {task.estimatedMinutes} min
            </div>
            <div className="flex items-center gap-1.5 bg-surfaceLight px-2.5 py-1 rounded-md border border-border">
              Priority Score: {priorityScore}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-textMuted font-medium uppercase tracking-wider">Why now?</p>
            <ul className="space-y-1.5">
              {reasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-textSecondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-3 shrink-0">
          <Button size="lg" className="w-full md:w-auto gap-2 group">
            <Play size={18} className="fill-current" />
            Start Focus Session
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <button className="text-xs text-textMuted hover:text-textSecondary transition-colors">
            Suggest something else
          </button>
        </div>
      </div>
    </Card>
  );
}
