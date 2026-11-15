import type { Achievement, FocusSession, Goal, Task } from "../types";
import { calculateGoalProgress } from "./productivity";

export interface AchievementContext {
  tasks: Task[];
  goals: Goal[];
  sessions: FocusSession[];
  streakDays: number;
  productivityScore: number;
}

export function evaluateAchievements(ctx: AchievementContext): Achievement[] {
  const completedTasks = ctx.tasks.filter((t) => t.completed).length;
  const earlySessions = ctx.sessions.filter((s) => s.hourOfDay < 10).length;
  const totalFocusSessions = ctx.sessions.length;
  const completedGoals = ctx.goals.filter((g) => calculateGoalProgress(g) === 100).length;

  return [
    {
      id: "early_bird",
      title: "Early Bird",
      description: "Complete a focus session before 10:00 AM.",
      requirement: "1 morning session",
      unlocked: earlySessions >= 1,
      progress: Math.min(100, earlySessions * 100),
    },
    {
      id: "focus_master",
      title: "Focus Master",
      description: "Log 5 or more deep-work Pomodoro sessions.",
      requirement: `${Math.min(totalFocusSessions, 5)}/5 sessions`,
      unlocked: totalFocusSessions >= 5,
      progress: Math.min(100, Math.round((totalFocusSessions / 5) * 100)),
    },
    {
      id: "consistency_king",
      title: "Consistency King",
      description: "Maintain a 7-day execution streak without missing a day.",
      requirement: `${Math.min(ctx.streakDays, 7)}/7 day streak`,
      unlocked: ctx.streakDays >= 7,
      progress: Math.min(100, Math.round((ctx.streakDays / 7) * 100)),
    },
    {
      id: "goal_crusher",
      title: "Goal Crusher",
      description: "Reach 100% completion on at least one major goal.",
      requirement: `${Math.min(completedGoals, 1)}/1 goal completed`,
      unlocked: completedGoals >= 1,
      progress: completedGoals >= 1 ? 100 : Math.min(95, completedTasks * 10),
    },
    {
      id: "productivity_legend",
      title: "Productivity Legend",
      description: "Reach a Productivity Score of 95 or higher.",
      requirement: `${ctx.productivityScore}/95 score`,
      unlocked: ctx.productivityScore >= 95,
      progress: Math.min(100, Math.round((ctx.productivityScore / 95) * 100)),
    },
  ];
}
