import type { Task } from '../types';

export interface NextMoveRecommendation {
  task: Task;
  priorityScore: number;
  reasoning: string[];
}

export function calculatePriority(task: Task): number {
  let score = task.impact * 10;
  
  // Urgency factor
  if (task.deadline) {
    const hoursUntilDeadline = (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilDeadline < 24) score *= 1.5;
    else if (hoursUntilDeadline < 72) score *= 1.2;
  }

  // Effort factor (lower effort can be slightly prioritized for quick wins)
  const effortScore = task.estimatedMinutes > 120 ? 0.8 : (task.estimatedMinutes < 30 ? 1.2 : 1.0);
  score *= effortScore;

  // Energy alignment
  if (task.energyRequired === 'HIGH') score *= 0.9; 

  return Math.round(score);
}

export function getNextMove(tasks: Task[]): NextMoveRecommendation | null {
  const pendingTasks = tasks.filter(t => t.status !== 'DONE');
  if (pendingTasks.length === 0) return null;

  let highestScore = -1;
  let bestTask: Task | null = null;

  for (const task of pendingTasks) {
    const score = calculatePriority(task);
    if (score > highestScore) {
      highestScore = score;
      bestTask = task;
    }
  }

  if (!bestTask) return null;

  const reasoning: string[] = [];
  if (bestTask.impact >= 8) reasoning.push('High impact');
  if (bestTask.deadline && (new Date(bestTask.deadline).getTime() - Date.now()) < 86400000) reasoning.push('Deadline approaching soon');
  if (bestTask.estimatedMinutes <= 30) reasoning.push('Quick win');
  
  if (reasoning.length === 0) reasoning.push('Best alignment with current goals');

  return {
    task: bestTask,
    priorityScore: highestScore,
    reasoning
  };
}
