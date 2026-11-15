import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  HeartPulse,
  Loader2,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { optimizeDayWithAI } from "../services/ai";
import type {
  AIDayOptimization,
  BurnoutAssessment,
  BurnoutInput,
  DashboardSection,
  Task,
  WeeklyAnalyticsPoint,
} from "../types";
import {
  getPositiveReinforcementMessage,
  type DashboardMetrics,
} from "../utils/productivity";

interface DashboardOverviewProps {
  userName: string;
  metrics: DashboardMetrics;
  tasks: Task[];
  burnout: BurnoutAssessment;
  burnoutInput: BurnoutInput;
  weeklyAnalytics: WeeklyAnalyticsPoint[];
  dayOptimization: AIDayOptimization | null;
  onSaveDayOptimization: (opt: AIDayOptimization) => void;
  onToggleTask: (taskId: string) => void;
  onNavigate: (section: DashboardSection) => void;
  externalOptimizeTrigger: number;
}

const QUADRANT_LABELS: Record<Task["quadrant"], string> = {
  urgent_important: "Urgent & Important",
  important_not_urgent: "Important, Not Urgent",
  urgent_not_important: "Urgent, Not Important",
  neither: "Neither",
};

export function DashboardOverview({
  userName,
  metrics,
  tasks,
  burnout,
  burnoutInput,
  weeklyAnalytics,
  dayOptimization,
  onSaveDayOptimization,
  onToggleTask,
  onNavigate,
  externalOptimizeTrigger,
}: DashboardOverviewProps) {
  const [optimizing, setOptimizing] = useState(false);
  const [optError, setOptError] = useState<string | null>(null);
  const lastTriggerRef = useRef(externalOptimizeTrigger);

  const handleOptimizeDay = async () => {
    setOptimizing(true);
    setOptError(null);
    try {
      const result = await optimizeDayWithAI({
        tasks,
        burnoutRisk: burnout.riskLevel,
        energyLevel: burnoutInput.sleepHours >= 7 ? "High" : "Moderate",
        sleepHours: burnoutInput.sleepHours,
      });
      onSaveDayOptimization(result);
    } catch (err) {
      setOptError(
        err instanceof Error ? err.message : "Could not optimize day right now."
      );
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    if (externalOptimizeTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = externalOptimizeTrigger;
      void handleOptimizeDay();
    }
  });

  const todayTasks = tasks.filter((t) => t.isToday);
  const topPriorityTask =
    todayTasks.find((t) => !t.completed && t.quadrant === "urgent_important") ||
    todayTasks.find((t) => !t.completed) ||
    tasks.find((t) => !t.completed) ||
    todayTasks[0];

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (metrics.productivityScore / 100) * circumference;

  const firstScore = weeklyAnalytics[0]?.score ?? 78;
  const scoreDelta = metrics.productivityScore - firstScore;
  const reinforcement = getPositiveReinforcementMessage(
    metrics.productivityScore,
    metrics.streakDays,
    metrics.focusHours
  );

  const burnoutAccent =
    burnout.riskLevel === "High"
      ? "text-amber-300"
      : burnout.riskLevel === "Moderate"
        ? "text-cyan-300"
        : "text-emerald-400";

  const burnoutBarColor =
    burnout.riskLevel === "High"
      ? "bg-amber-400"
      : burnout.riskLevel === "Moderate"
        ? "bg-cyan-400"
        : "bg-emerald-400";

  return (
    <div className="space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium text-cyan-400">
            Personal AI Chief of Staff
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Good morning, {userName.split(" ")[0]}.
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {reinforcement.headline} {reinforcement.detail}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate("tasks")}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-500 transition-colors cursor-pointer sm:text-sm whitespace-nowrap"
          >
            Open AI Planner
          </button>
          <button
            type="button"
            disabled={optimizing}
            onClick={handleOptimizeDay}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400 disabled:opacity-60 transition-colors cursor-pointer sm:text-sm whitespace-nowrap"
          >
            {optimizing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            )}
            {optimizing ? "Optimizing Schedule..." : "Optimize My Day"}
          </button>
        </div>
      </div>

      {/* 4 Dominant Executive Cards (5-Second Visual Hierarchy) */}
      <section aria-label="Executive spotlight metrics">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12">
          {/* 1. Today's Top Priority */}
          <div className="flex flex-col justify-between rounded-2xl border border-indigo-500/35 bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-900/80 p-6 xl:col-span-4 animate-fade-in-up">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-300">
                  Today&apos;s Top Priority
                </span>
                <span className="font-mono text-slate-400 tabular-nums">
                  {topPriorityTask ? `${topPriorityTask.estimatedMinutes}m` : "Clear"}
                </span>
              </div>

              {topPriorityTask ? (
                <>
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white">
                    {topPriorityTask.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-300">
                    {QUADRANT_LABELS[topPriorityTask.quadrant]} · {topPriorityTask.dueLabel}
                  </p>
                </>
              ) : (
                <h3 className="mt-3 font-display text-lg font-bold text-white">
                  All priority tasks completed today.
                </h3>
              )}
            </div>

            {topPriorityTask && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-slate-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => onToggleTask(topPriorityTask.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-400 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {topPriorityTask.completed ? "Completed" : "Mark Complete"}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("focus")}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Start 25m Focus
                </button>
              </div>
            )}
          </div>

          {/* 2. Productivity Score Dominant Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/75 p-6 xl:col-span-4 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-cyan-400">
                  Productivity Score
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Completion · Consistency · Focus
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 tabular-nums">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts this week
              </span>
            </div>

            <div className="mt-4 flex items-center gap-5">
              <div className="relative h-24 w-24 shrink-0">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 104 104">
                  <defs>
                    <linearGradient id="scoreRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="52"
                    cy="52"
                    r={radius}
                    fill="none"
                    stroke="rgba(30,41,59,0.9)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="52"
                    cy="52"
                    r={radius}
                    fill="none"
                    stroke="url(#scoreRingGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center tabular-nums">
                  <span className="font-mono text-2xl font-bold text-white">
                    {metrics.productivityScore}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="h-24 flex-1 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyAnalytics}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "#94A3B8", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderColor: "#1E293B",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      fill="url(#scoreGrad)"
                      animationDuration={450}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="mt-3 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
              {metrics.productivityScore >= 95
                ? "Capybara Mode Unlocked 🦫 — Calm peak performance."
                : `${reinforcement.headline} ${95 - metrics.productivityScore} pts to Capybara Mode.`}
            </p>
          </div>

          {/* 3. Burnout Risk Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/75 p-6 xl:col-span-2 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <HeartPulse className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span>Burnout Check</span>
              </div>
              <p className={`mt-3 font-display text-lg font-bold ${burnoutAccent}`}>
                {burnout.supportiveLabel}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-400 tabular-nums">
                Strain {burnout.riskScore}/100 · Sleep {burnoutInput.sleepHours}h
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${burnoutBarColor}`}
                  style={{ width: `${burnout.riskScore}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("analytics")}
              className="mt-5 inline-flex items-center gap-1 border-t border-slate-800/80 pt-3 text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Recovery Actions
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* 4. Goal Progress Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/75 p-6 xl:col-span-2 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Target className="h-4 w-4 text-violet-400" aria-hidden="true" />
                <span>Goal Progress</span>
              </div>
              <p className="mt-3 font-mono text-3xl font-bold text-white tabular-nums">
                {metrics.goalProgressPercent}%
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Semester &amp; career milestones
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-500"
                  style={{ width: `${metrics.goalProgressPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("goals")}
              className="mt-5 inline-flex items-center gap-1 border-t border-slate-800/80 pt-3 text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Open Milestones
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Secondary Metrics Strip (Compact 4-Column Row) */}
      <section aria-label="Supporting telemetry">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 px-4 py-3.5">
            <p className="text-xs text-slate-400">Today&apos;s Tasks</p>
            <p className="mt-1 font-mono text-xl font-bold text-white tabular-nums">
              {metrics.todayTasksCount}{" "}
              <span className="font-sans text-xs font-normal text-slate-400">
                ({metrics.todayTasksCount - metrics.todayCompletedCount} left)
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 px-4 py-3.5">
            <p className="text-xs text-slate-400">Tasks Completed</p>
            <p className="mt-1 font-mono text-xl font-bold text-white tabular-nums">
              {metrics.totalCompletedCount}/{metrics.totalTasksCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 px-4 py-3.5">
            <p className="text-xs text-slate-400">Focus Hours</p>
            <p className="mt-1 font-mono text-xl font-bold text-cyan-400 tabular-nums">
              {metrics.focusHours}h
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 px-4 py-3.5">
            <p className="text-xs text-slate-400">Streak Count</p>
            <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-xl font-bold text-amber-300 tabular-nums">
              <Flame className="h-4 w-4 text-amber-400" aria-hidden="true" />
              {metrics.streakDays}d
            </p>
          </div>
        </div>
      </section>

      {/* AI Day Optimizer & Today's Queue Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section
          aria-labelledby="day-optimizer-heading"
          className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 lg:col-span-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
                <Sun className="h-4 w-4" aria-hidden="true" />
                <span>AI Day Optimizer</span>
              </div>
              <h3
                id="day-optimizer-heading"
                className="mt-1 font-display text-lg font-semibold text-white"
              >
                {dayOptimization?.headline || "Generate Today's Blueprint"}
              </h3>
            </div>

            {dayOptimization && (
              <div className="text-right tabular-nums">
                <span className="text-xs text-slate-400">Est. Finish</span>
                <p className="font-mono text-sm font-semibold text-cyan-400">
                  {dayOptimization.estimatedCompletionTime}
                </p>
              </div>
            )}
          </div>

          {optError && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs text-rose-200"
            >
              {optError}
            </div>
          )}

          {optimizing ? (
            <div className="mt-6 space-y-3" aria-busy="true">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-800" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-800/70" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-800/70" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-800/70" />
            </div>
          ) : dayOptimization ? (
            <div className="mt-5 space-y-6">
              <div className="grid grid-cols-1 gap-6 border-b border-slate-800/80 pb-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    High-Priority Focus
                  </p>
                  <ul className="mt-2.5 space-y-2 text-xs text-slate-200">
                    {dayOptimization.highPriorityTasks.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-indigo-400">0{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sm:border-l sm:border-slate-800/80 sm:pl-6">
                  <p className="text-xs font-medium text-slate-400">
                    Exercise &amp; Break Strategy
                  </p>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-200">
                    {dayOptimization.exerciseSuggestion}
                  </p>
                  <p className="mt-2 text-xs text-cyan-400">
                    {dayOptimization.breakStrategy}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-800/70">
                {dayOptimization.schedule.map((slot, idx) => (
                  <div
                    key={`${slot.time}-${idx}`}
                    className="flex flex-col justify-between gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="font-mono text-xs font-medium text-indigo-300 tabular-nums shrink-0">
                        {slot.time}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {slot.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{slot.note}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 capitalize shrink-0">
                      {slot.type.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-800 p-8 text-center">
              <p className="text-sm text-slate-300">
                Click Optimize My Day to generate your morning-to-evening plan with
                Gemini.
              </p>
            </div>
          )}
        </section>

        {/* Today's Execution Queue */}
        <section
          aria-labelledby="today-queue-heading"
          className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 lg:col-span-5"
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h3
                id="today-queue-heading"
                className="font-display text-base font-semibold text-white"
              >
                Today&apos;s Prioritized Queue
              </h3>
              <p className="text-xs text-slate-400">
                Check off items to update your score live.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer whitespace-nowrap"
            >
              Matrix
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-800/70">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    aria-label={
                      task.completed
                        ? `Mark "${task.title}" incomplete`
                        : `Complete "${task.title}"`
                    }
                    className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.completed ? "text-slate-500 line-through" : "text-white"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {QUADRANT_LABELS[task.quadrant]} · {task.dueLabel}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs text-slate-400 tabular-nums shrink-0">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {task.estimatedMinutes}m
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
