export type AppView = "landing" | "login" | "register" | "app";

export type DashboardSection =
  | "dashboard"
  | "tasks"
  | "goals"
  | "analytics"
  | "focus"
  | "coach"
  | "settings";

export type EisenhowerQuadrant =
  | "urgent_important"
  | "important_not_urgent"
  | "urgent_not_important"
  | "neither";

export type TaskPriority = "high" | "medium" | "low";

export type TaskCategory = "Study" | "Work" | "Health" | "Personal";

export interface Task {
  id: string;
  title: string;
  dueLabel: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  quadrant: EisenhowerQuadrant;
  category: TaskCategory;
  completed: boolean;
  isToday: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: TaskCategory;
  targetDate: string;
  milestones: GoalMilestone[];
}

export interface FocusSession {
  id: string;
  taskTitle: string;
  durationMinutes: number;
  completedAt: string;
  hourOfDay: number;
}

export interface BurnoutInput {
  sleepHours: number;
  workloadHours: number;
  stressLevel: number;
}

export type BurnoutRiskLevel = "Low" | "Moderate" | "High";

export interface BurnoutAssessment {
  riskScore: number;
  riskLevel: BurnoutRiskLevel;
  supportiveLabel: string;
  warningIndicators: string[];
  recommendations: string[];
  wellnessInsights: string[];
}

export interface AIPlannedScheduleBlock {
  day: string;
  timeBlock: string;
  focusTitle: string;
  focusSessions: number;
  category: string;
}

export interface AIPlannedTask {
  title: string;
  priorityRank: number;
  estimatedMinutes: number;
  recommendedSessions: number;
  quadrant: EisenhowerQuadrant;
  category: TaskCategory;
  dueLabel: string;
  rationale: string;
}

export interface AIPlanResult {
  summary: string;
  totalEstimatedHours: number;
  estimatedCompletionTime: string;
  effortScore: number;
  dailySchedule: AIPlannedScheduleBlock[];
  tasks: AIPlannedTask[];
}

export interface AIDayScheduleItem {
  time: string;
  title: string;
  type: "deep_work" | "break" | "exercise" | "admin";
  note: string;
}

export interface AIDayOptimization {
  headline: string;
  estimatedCompletionTime: string;
  exerciseSuggestion: string;
  highPriorityTasks: string[];
  schedule: AIDayScheduleItem[];
  breakStrategy: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type AchievementId =
  | "early_bird"
  | "focus_master"
  | "consistency_king"
  | "goal_crusher"
  | "productivity_legend";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  requirement: string;
  unlocked: boolean;
  progress: number;
}

export interface WeeklyAnalyticsPoint {
  day: string;
  score: number;
  tasksCompleted: number;
  focusMinutes: number;
}

export interface MonthlyPerformancePoint {
  week: string;
  productivity: number;
  target: number;
}

export interface TimeDistributionPoint {
  name: string;
  hours: number;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  dailyFocusTargetHours: number;
  streakDays: number;
  consistencyRate: number;
  capybaraUnlockedOnce: boolean;
}

export interface StoredUserRecord extends UserProfile {
  passwordHash: string;
}

export interface WorkspaceState {
  tasks: Task[];
  goals: Goal[];
  sessions: FocusSession[];
  burnoutInput: BurnoutInput;
  weeklyAnalytics: WeeklyAnalyticsPoint[];
  monthlyPerformance: MonthlyPerformancePoint[];
  lastPlan: AIPlanResult | null;
  lastDayOptimization: AIDayOptimization | null;
  coachMessages: ChatMessage[];
}
