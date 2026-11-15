import { AlertTriangle, HeartPulse, ShieldCheck } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  BurnoutAssessment,
  BurnoutInput,
  Goal,
  MonthlyPerformancePoint,
  Task,
  WeeklyAnalyticsPoint,
} from "../types";
import { calculateGoalProgress } from "../utils/productivity";

interface AnalyticsAndBurnoutViewProps {
  tasks: Task[];
  goals: Goal[];
  weeklyAnalytics: WeeklyAnalyticsPoint[];
  monthlyPerformance: MonthlyPerformancePoint[];
  burnoutInput: BurnoutInput;
  burnout: BurnoutAssessment;
  onUpdateBurnout: (next: BurnoutInput) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Study: "#6366F1",
  Work: "#8B5CF6",
  Health: "#06B6D4",
  Personal: "#10B981",
};

export function AnalyticsAndBurnoutView({
  tasks,
  goals,
  weeklyAnalytics,
  monthlyPerformance,
  burnoutInput,
  burnout,
  onUpdateBurnout,
}: AnalyticsAndBurnoutViewProps) {
  const goalChartData = goals.map((g) => ({
    name: g.title.length > 20 ? `${g.title.slice(0, 20)}...` : g.title,
    progress: calculateGoalProgress(g),
  }));

  const categoryTotals = tasks.reduce<Record<string, number>>((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + task.estimatedMinutes;
    return acc;
  }, {});

  const timeDistributionData = Object.entries(categoryTotals).map(
    ([name, mins]) => ({
      name,
      hours: Math.round((mins / 60) * 10) / 10,
      color: CATEGORY_COLORS[name] || "#6366F1",
    })
  );

  const riskColorClass =
    burnout.riskLevel === "High"
      ? "text-amber-300 border-amber-500/40 bg-amber-500/10"
      : burnout.riskLevel === "Moderate"
        ? "text-cyan-300 border-cyan-500/40 bg-cyan-500/10"
        : "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";

  return (
    <div className="space-y-8">
      {/* Burnout Prediction Interactive Section */}
      <section
        aria-labelledby="burnout-heading"
        className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
              <HeartPulse className="h-4 w-4" aria-hidden="true" />
              <span>Burnout Prediction &amp; Recovery Guide</span>
            </div>
            <h2
              id="burnout-heading"
              className="mt-1 font-display text-xl font-bold text-white"
            >
              Cognitive Load &amp; Recovery Analyzer
            </h2>
          </div>

          <div
            data-testid="burnout-risk-badge"
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-sm font-semibold tabular-nums ${riskColorClass}`}
          >
            {burnout.riskLevel === "Low" ? (
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            )}
            <span>
              {burnout.supportiveLabel} ({burnout.riskScore}/100)
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Interactive Sliders */}
          <div className="space-y-5 lg:col-span-5">
            <div>
              <div className="flex justify-between text-xs font-medium">
                <label htmlFor="sleep-slider" className="text-slate-300">
                  Sleep Hours (Last Night)
                </label>
                <span className="font-mono text-cyan-400 tabular-nums">
                  {burnoutInput.sleepHours.toFixed(1)} hrs
                </span>
              </div>
              <input
                id="sleep-slider"
                type="range"
                min={3}
                max={11}
                step={0.5}
                value={burnoutInput.sleepHours}
                onChange={(e) =>
                  onUpdateBurnout({
                    ...burnoutInput,
                    sleepHours: Number(e.target.value),
                  })
                }
                className="mt-2 w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium">
                <label htmlFor="workload-slider" className="text-slate-300">
                  Daily Workload
                </label>
                <span className="font-mono text-indigo-300 tabular-nums">
                  {burnoutInput.workloadHours.toFixed(1)} hrs
                </span>
              </div>
              <input
                id="workload-slider"
                type="range"
                min={2}
                max={15}
                step={0.5}
                value={burnoutInput.workloadHours}
                onChange={(e) =>
                  onUpdateBurnout({
                    ...burnoutInput,
                    workloadHours: Number(e.target.value),
                  })
                }
                className="mt-2 w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium">
                <label htmlFor="stress-slider" className="text-slate-300">
                  Current Stress Level
                </label>
                <span className="font-mono text-violet-300 tabular-nums">
                  {burnoutInput.stressLevel} / 10
                </span>
              </div>
              <input
                id="stress-slider"
                type="range"
                min={1}
                max={10}
                step={1}
                value={burnoutInput.stressLevel}
                onChange={(e) =>
                  onUpdateBurnout({
                    ...burnoutInput,
                    stressLevel: Number(e.target.value),
                  })
                }
                className="mt-2 w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Burnout Strain Meter</span>
                <span className="font-mono tabular-nums">{burnout.riskScore}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    burnout.riskLevel === "High"
                      ? "bg-rose-500"
                      : burnout.riskLevel === "Moderate"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${burnout.riskScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Warnings & Recommendations */}
          <div className="space-y-5 lg:col-span-7 lg:border-l lg:border-slate-800/80 lg:pl-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-300">
                  Warning Indicators
                </h3>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-300">
                  {burnout.warningIndicators.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-amber-400">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-300">
                  Actionable Recommendations
                </h3>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-300">
                  {burnout.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4">
              <h3 className="text-xs font-semibold text-slate-300">
                Wellness Insights
              </h3>
              <div className="mt-2 space-y-1 text-xs text-slate-300">
                {burnout.wellnessInsights.map((ins, i) => (
                  <p key={i}>{ins}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Productivity */}
        <section className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
          <h3 className="font-display text-base font-semibold text-white">
            Weekly Productivity Score
          </h3>
          <p className="text-xs text-slate-400">7-day consistency trajectory</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAnalytics}>
                <defs>
                  <linearGradient id="weeklyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis domain={[50, 100]} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fill="url(#weeklyFill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Monthly Performance */}
        <section className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
          <h3 className="font-display text-base font-semibold text-white">
            Monthly Performance vs Target
          </h3>
          <p className="text-xs text-slate-400">Weekly aggregate output score</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="week" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="productivity"
                  name="Actual Score"
                  fill="#6366F1"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="target"
                  name="Target"
                  fill="#334155"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Task Completion Trends */}
        <section className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
          <h3 className="font-display text-base font-semibold text-white">
            Task Completion &amp; Focus Trends
          </h3>
          <p className="text-xs text-slate-400">Daily tasks completed across week</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasksCompleted"
                  name="Tasks Completed"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#8B5CF6" }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Goal Progress & Time Distribution */}
        <section className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
          <h3 className="font-display text-base font-semibold text-white">
            Goal Progress &amp; Time Distribution
          </h3>
          <p className="text-xs text-slate-400">
            Active goal completion % and estimated hours by category
          </p>
          <div className="mt-4 grid h-64 grid-cols-1 gap-4 sm:grid-cols-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalChartData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={105}
                  tick={{ fill: "#CBD5E1", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="progress"
                  name="Progress %"
                  fill="#06B6D4"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex flex-col items-center justify-center">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeDistributionData}
                      dataKey="hours"
                      nameKey="name"
                      innerRadius={38}
                      outerRadius={62}
                      paddingAngle={3}
                    >
                      {timeDistributionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderColor: "#1E293B",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-[11px] text-slate-300">
                {timeDistributionData.map((item) => (
                  <span key={item.name} className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name} ({item.hours}h)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
