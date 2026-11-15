import type {
  EisenhowerQuadrant,
  FocusSession,
  Goal,
  Task,
  TaskPriority,
} from "../types";

export interface ScoreInput {
  tasksCompleted: number;
  totalTasks: number;
  focusHours: number;
  streakDays: number;
  consistencyRate: number;
}

export interface DashboardMetrics {
  todayTasksCount: number;
  todayCompletedCount: number;
  totalTasksCount: number;
  totalCompletedCount: number;
  productivityScore: number;
  focusHours: number;
  goalProgressPercent: number;
  streakDays: number;
  capybaraModeUnlocked: boolean;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function classifyEisenhowerQuadrant(
  urgent: boolean,
  important: boolean
): EisenhowerQuadrant {
  if (urgent && important) return "urgent_important";
  if (!urgent && important) return "important_not_urgent";
  if (urgent && !important) return "urgent_not_important";
  return "neither";
}

export function inferUrgencyAndImportance(
  dueLabel: string,
  priority: TaskPriority
): { urgent: boolean; important: boolean } {
  const normalized = dueLabel.toLowerCase();
  const urgentKeywords = ["today", "tonight", "tomorrow", "asap", "urgent", "now", "due"];
  const isUrgent =
    urgentKeywords.some((k) => normalized.includes(k)) || priority === "high";
  const isImportant = priority === "high" || priority === "medium";
  return { urgent: isUrgent, important: isImportant };
}

export function calculateProductivityScore(input: ScoreInput): number {
  const completionRatio =
    input.totalTasks > 0 ? clamp(input.tasksCompleted / input.totalTasks, 0, 1) : 0;
  const completionPoints = completionRatio * 40;
  const consistencyPoints = (clamp(input.consistencyRate, 0, 100) / 100) * 25;
  const streakPoints = clamp(input.streakDays / 10, 0, 1) * 15;
  const focusPoints = clamp(input.focusHours / 5, 0, 1) * 20;

  return Math.round(
    clamp(completionPoints + consistencyPoints + streakPoints + focusPoints, 0, 100)
  );
}

export function calculateGoalProgress(goal: Goal): number {
  if (goal.milestones.length === 0) return 0;
  const completed = goal.milestones.filter((m) => m.completed).length;
  return Math.round((completed / goal.milestones.length) * 100);
}

export function computeDashboardMetrics(
  tasks: Task[],
  goals: Goal[],
  sessions: FocusSession[],
  streakDays: number,
  consistencyRate: number
): DashboardMetrics {
  const todayTasks = tasks.filter((t) => t.isToday);
  const todayCompletedCount = todayTasks.filter((t) => t.completed).length;
  const totalCompletedCount = tasks.filter((t) => t.completed).length;

  const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const focusHours = Math.round((totalFocusMinutes / 60) * 10) / 10;

  const goalProgressPercent =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, g) => sum + calculateGoalProgress(g), 0) / goals.length
        )
      : 0;

  const productivityScore = calculateProductivityScore({
    tasksCompleted: totalCompletedCount,
    totalTasks: tasks.length,
    focusHours,
    streakDays,
    consistencyRate,
  });

  return {
    todayTasksCount: todayTasks.length,
    todayCompletedCount,
    totalTasksCount: tasks.length,
    totalCompletedCount,
    productivityScore,
    focusHours,
    goalProgressPercent,
    streakDays,
    capybaraModeUnlocked: productivityScore >= 95,
  };
}

export function getPositiveReinforcementMessage(
  score: number,
  streakDays: number,
  focusHours: number
): { headline: string; detail: string } {
  if (score >= 95) {
    return {
      headline: "Peak rhythm achieved this week.",
      detail: `Your ${streakDays}-day streak and ${focusHours}h of deep focus put you in the top execution tier.`,
    };
  }
  if (score >= 80) {
    return {
      headline: "Excellent consistency this week.",
      detail: "Your focus time increased by 18% compared to last week's baseline.",
    };
  }
  if (score >= 60) {
    return {
      headline: "Steady upward momentum.",
      detail: "Every completed priority block builds lasting clarity—keep protecting your pace.",
    };
  }
  return {
    headline: "Fresh runway ahead today.",
    detail: "Start with one 25-minute focus block to build effortless momentum.",
  };
}
