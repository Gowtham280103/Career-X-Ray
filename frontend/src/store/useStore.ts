import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Goal, Project, UserState } from '../types';

interface AppState {
  user: UserState;
  tasks: Task[];
  goals: Goal[];
  projects: Project[];
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateUser: (updates: Partial<UserState>) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Complete React dashboard', status: 'TODO', estimatedMinutes: 120, energyRequired: 'HIGH', impact: 8, createdAt: new Date().toISOString(), deadline: new Date(Date.now() + 86400000).toISOString() },
  { id: '2', title: 'Practice SQL joins', status: 'IN_PROGRESS', estimatedMinutes: 45, energyRequired: 'MEDIUM', impact: 6, createdAt: new Date().toISOString() },
  { id: '3', title: 'Prepare interview questions', status: 'TODO', estimatedMinutes: 60, energyRequired: 'HIGH', impact: 9, createdAt: new Date().toISOString(), deadline: new Date(Date.now() + 43200000).toISOString() },
];

const initialGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Become a Full Stack Developer',
    category: 'CAREER',
    progress: 68,
    milestones: [
      { id: 'm1', title: 'HTML/CSS', completed: true },
      { id: 'm2', title: 'JavaScript', completed: true },
      { id: 'm3', title: 'React', completed: true },
      { id: 'm4', title: 'Backend', completed: false },
      { id: 'm5', title: 'Deployment', completed: false },
    ]
  }
];

const initialProjects: Project[] = [
  { id: 'p1', title: 'AI Voice Assistant', progress: 82, risk: 'LOW', nextAction: 'Deploy production API' },
  { id: 'p2', title: 'EcoFootprint', progress: 35, risk: 'MEDIUM', nextAction: 'Design DB schema' }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        name: 'Gowtham',
        focusScore: 7.8,
        energyLevel: 'MEDIUM',
        timeAvailableMinutes: 200,
      },
      tasks: initialTasks,
      goals: initialGoals,
      projects: initialProjects,

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),
      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),
      updateGoalProgress: (id, progress) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, progress } : g)
      })),
      toggleMilestone: (goalId, milestoneId) => set((state) => {
        const goals = state.goals.map(g => {
          if (g.id !== goalId) return g;
          const milestones = g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
          const completedCount = milestones.filter(m => m.completed).length;
          const progress = Math.round((completedCount / milestones.length) * 100);
          return { ...g, milestones, progress };
        });
        return { goals };
      })
    }),
    {
      name: 'lifeos-storage',
    }
  )
);
