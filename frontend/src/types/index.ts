export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  projectId?: string;
  goalId?: string;
  deadline?: string;
  estimatedMinutes: number;
  energyRequired: 'LOW' | 'MEDIUM' | 'HIGH';
  status: TaskStatus;
  impact: number; // 1–10
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  category: 'CAREER' | 'EDUCATION' | 'BUSINESS' | 'HEALTH' | 'FINANCE' | 'PERSONAL';
  progress: number; // 0–100
  targetDate?: string;
  milestones: { id: string; title: string; completed: boolean }[];
}

export interface Project {
  id: string;
  title: string;
  progress: number;
  deadline?: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  nextAction?: string;
}

export interface UserState {
  name: string;
  focusScore: number;
  energyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeAvailableMinutes: number;
}

// Stage colors / labels for Application Tracker
export const STAGE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  Saved: {
    label: 'Saved',
    color: 'text-textSecondary',
    bg: 'bg-surfaceLight',
    border: 'border-border',
  },
  Applied: {
    label: 'Applied',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
  },
  Assessment: {
    label: 'Assessment',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
  },
  Interview: {
    label: 'Interview',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
  },
  'Final Round': {
    label: 'Final Round',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/30',
  },
  Offer: {
    label: 'Offer',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
  },
  Rejected: {
    label: 'Rejected',
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/30',
  },
};
