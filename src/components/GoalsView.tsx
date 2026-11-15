import { useState, type FormEvent } from "react";
import { Award, CheckCircle2, Circle, Plus, Sparkles, Target } from "lucide-react";
import type { Goal, TaskCategory } from "../types";
import { calculateGoalProgress } from "../utils/productivity";

interface GoalsViewProps {
  goals: Goal[];
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddGoal: (input: {
    title: string;
    category: TaskCategory;
    targetDate: string;
    milestones: string[];
  }) => void;
}

function getGoalStatus(progress: number): { label: string; colorClass: string } {
  if (progress === 100) {
    return { label: "Goal Achieved", colorClass: "text-emerald-400" };
  }
  if (progress >= 65) {
    return { label: "Final Stretch", colorClass: "text-cyan-400" };
  }
  if (progress >= 30) {
    return { label: "On Track", colorClass: "text-indigo-400" };
  }
  return { label: "Getting Started", colorClass: "text-slate-400" };
}

export function GoalsView({
  goals,
  onToggleMilestone,
  onAddGoal,
}: GoalsViewProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Study");
  const [targetDate, setTargetDate] = useState("Dec 20");
  const [milestoneText, setMilestoneText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Please enter a goal title.");
      return;
    }
    const milestones = milestoneText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onAddGoal({
      title,
      category,
      targetDate,
      milestones:
        milestones.length > 0
          ? milestones
          : ["Define scope", "Complete first sprint", "Final review"],
    });
    setTitle("");
    setMilestoneText("");
  };

  const handleMilestoneClick = (goal: Goal, milestoneId: string, wasCompleted: boolean) => {
    onToggleMilestone(goal.id, milestoneId);
    if (!wasCompleted) {
      const completedAfter = goal.milestones.filter((m) => m.completed).length + 1;
      const pctAfter = Math.round((completedAfter / goal.milestones.length) * 100);
      if (pctAfter === 100) {
        setCelebrationMsg(`Goal Achieved: "${goal.title}" reached 100% completion!`);
      } else {
        setCelebrationMsg(`Milestone checked off — "${goal.title}" is now ${pctAfter}% complete.`);
      }
    }
  };

  return (
    <div className="space-y-8">
      {celebrationMsg && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3.5 text-sm text-emerald-200 animate-fade-in-up">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{celebrationMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setCelebrationMsg(null)}
            className="text-xs font-medium text-emerald-300 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
          <Target className="h-4 w-4" aria-hidden="true" />
          <span>Goal Architecture</span>
        </div>
        <h2 className="mt-1 font-display text-xl font-bold text-white">
          Create a Milestone-Tracked Goal
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12"
        >
          <div className="md:col-span-4">
            <label htmlFor="goal-title" className="sr-only">
              Goal title
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Win Fall Hackathon Track"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="goal-category" className="sr-only">
              Goal category
            </label>
            <select
              id="goal-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white"
            >
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="goal-date" className="sr-only">
              Target date
            </label>
            <input
              id="goal-date"
              type="text"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              placeholder="Target date"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="goal-milestones" className="sr-only">
              Comma-separated milestones
            </label>
            <input
              id="goal-milestones"
              type="text"
              value={milestoneText}
              onChange={(e) => setMilestoneText(e.target.value)}
              placeholder="Step 1, Step 2..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 cursor-pointer"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Goal
            </button>
          </div>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-xs text-rose-300">
            {error}
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal);
          const status = getGoalStatus(progress);
          const completedCount = goal.milestones.filter((m) => m.completed).length;

          return (
            <article
              key={goal.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-colors ${
                progress === 100
                  ? "border-emerald-500/40 bg-slate-900/80"
                  : "border-slate-800/90 bg-slate-900/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {goal.category} · Target {goal.targetDate}
                  </span>
                  <span className={`inline-flex items-center gap-1 font-semibold ${status.colorClass}`}>
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    {status.label}
                  </span>
                </div>

                <h3 className="mt-2.5 font-display text-lg font-semibold text-white">
                  {goal.title}
                </h3>

                <div className="mt-4 flex items-center justify-between text-xs tabular-nums">
                  <span className="text-slate-400">
                    {completedCount}/{goal.milestones.length} milestones
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    {progress}%
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress === 100
                        ? "bg-emerald-400"
                        : "bg-gradient-to-r from-indigo-500 to-cyan-400"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <ul className="mt-5 space-y-2.5">
                  {goal.milestones.map((ms) => (
                    <li key={ms.id} className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleMilestoneClick(goal, ms.id, ms.completed)}
                        aria-label={
                          ms.completed
                            ? `Uncheck milestone "${ms.title}"`
                            : `Complete milestone "${ms.title}"`
                        }
                        className="mt-0.5 text-slate-400 hover:text-cyan-400 cursor-pointer shrink-0"
                      >
                        {ms.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>
                      <span
                        className={`text-sm ${
                          ms.completed
                            ? "text-slate-500 line-through"
                            : "text-slate-200"
                        }`}
                      >
                        {ms.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
