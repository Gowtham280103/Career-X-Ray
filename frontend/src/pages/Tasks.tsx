import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, MoreVertical, Plus } from 'lucide-react';

export function Tasks() {
  const { tasks, updateTask } = useStore();
  const [filter, setFilter] = useState<'ALL' | 'TODO' | 'DONE'>('ALL');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'TODO') return t.status !== 'DONE';
    if (filter === 'DONE') return t.status === 'DONE';
    return true;
  });

  const toggleTask = (id: string, currentStatus: string) => {
    updateTask(id, { status: currentStatus === 'DONE' ? 'TODO' : 'DONE' });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-textSecondary">Manage your actions and momentum.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} /> New Task
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-primary text-white' : 'bg-surfaceLight text-textSecondary hover:text-white'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('TODO')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'TODO' ? 'bg-primary text-white' : 'bg-surfaceLight text-textSecondary hover:text-white'}`}
        >
          To Do
        </button>
        <button 
          onClick={() => setFilter('DONE')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'DONE' ? 'bg-primary text-white' : 'bg-surfaceLight text-textSecondary hover:text-white'}`}
        >
          Completed
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                hoverEffect={false} 
                className={`p-4 flex items-center gap-4 group transition-colors hover:border-surfaceLight ${task.status === 'DONE' ? 'opacity-60' : ''}`}
              >
                <button 
                  onClick={() => toggleTask(task.id, task.status)}
                  className="text-textSecondary hover:text-primary transition-colors shrink-0"
                >
                  {task.status === 'DONE' ? <CheckCircle2 size={24} className="text-primary" /> : <Circle size={24} />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-base font-medium truncate transition-all ${task.status === 'DONE' ? 'line-through text-textSecondary' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-textMuted mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> {task.estimatedMinutes}m</span>
                    {task.energyRequired === 'HIGH' && <span className="text-warning">High Energy</span>}
                    {task.impact >= 8 && <span className="text-primary">High Impact</span>}
                  </div>
                </div>

                <button className="opacity-0 group-hover:opacity-100 p-2 text-textSecondary hover:text-white transition-all rounded-md hover:bg-surfaceLight shrink-0">
                  <MoreVertical size={18} />
                </button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-textSecondary">No tasks found. Enjoy the silence.</p>
          </div>
        )}
      </div>
    </div>
  );
}
