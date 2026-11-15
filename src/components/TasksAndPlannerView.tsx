import { useState, type FormEvent } from "react";
import {
  Brain,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { generateAIPlan } from "../services/ai";
import type {
  AIPlanResult,
  EisenhowerQuadrant,
  Task,
  TaskCategory,
  TaskPriority,
} from "../types";

interface TasksAndPlannerViewProps {
  tasks: Task[];
  userRole: string;
  lastPlan: AIPlanResult | null;
  onSavePlan: (plan: AIPlanResult) => void;
  onApplyPlan: (plan: AIPlanResult) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (input: {
    title: string;
    dueLabel: string;
    estimatedMinutes: number;
    priority: TaskPriority;
    category: TaskCategory;
    isToday: boolean;
  }) => void;
  onMoveQuadrant: (taskId: string, quadrant: EisenhowerQuadrant) => void;
  onDeleteTask: (taskId: string) => void;
}

const SAMPLE_PLAN_PROMPT =
  "I have a math exam next Friday, a science project due Wednesday, and I want to exercise 4 times this week.";

const QUADRANTS: Array<{
  id: EisenhowerQuadrant;
  title: string;
  subtitle: string;
  accent: string;
}> = [
  {
    id: "urgent_important",
    title: "Urgent & Important",
    subtitle: "Do First",
    accent: "text-rose-400",
  },
  {
    id: "important_not_urgent",
    title: "Important, Not Urgent",
    subtitle: "Schedule Deep Work",
    accent: "text-cyan-400",
  },
  {
    id: "urgent_not_important",
    title: "Urgent, Not Important",
    subtitle: "Batch or Delegate",
    accent: "text-amber-400",
  },
  {
    id: "neither",
    title: "Neither",
    subtitle: "Defer / Low Priority",
    accent: "text-slate-400",
  },
];

export function TasksAndPlannerView({
  tasks,
  userRole,
  lastPlan,
  onSavePlan,
  onApplyPlan,
  onToggleTask,
  onAddTask,
  onMoveQuadrant,
  onDeleteTask,
}: TasksAndPlannerViewProps) {
  const [plannerPrompt, setPlannerPrompt] = useState("");
  const [planning, setPlanning] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [planAddedMessage, setPlanAddedMessage] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDue, setNewDue] = useState("Today");
  const [newMinutes, setNewMinutes] = useState(45);
  const [newPriority, setNewPriority] = useState<TaskPriority>("high");
  const [newCategory, setNewCategory] = useState<TaskCategory>("Study");
  const [taskError, setTaskError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

  const handleGeneratePlan = async (e: FormEvent) => {
    e.preventDefault();
    setPlanError(null);
    setPlanAddedMessage(null);
    if (plannerPrompt.trim().length < 5) {
      setPlanError("Describe your goals, deadlines, or priorities first.");
      return;
    }
    setPlanning(true);
    try {
      const result = await generateAIPlan(plannerPrompt, userRole);
      onSavePlan(result);
    } catch (err) {
      setPlanError(
        err instanceof Error ? err.message : "Could not generate AI plan."
      );
    } finally {
      setPlanning(false);
    }
  };

  const handleAddTaskSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTaskError(null);
    if (!newTitle.trim()) {
      setTaskError("Task title cannot be empty.");
      return;
    }
    onAddTask({
      title: newTitle,
      dueLabel: newDue,
      estimatedMinutes: newMinutes,
      priority: newPriority,
      category: newCategory,
      isToday: true,
    });
    setNewTitle("");
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !t.completed) ||
      (statusFilter === "completed" && t.completed);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* AI Planner Section */}
      <section
        aria-labelledby="ai-planner-title"
        className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
              <Brain className="h-4 w-4" aria-hidden="true" />
              <span>AI Planner · Powered by Gemini</span>
            </div>
            <h2
              id="ai-planner-title"
              className="mt-1 font-display text-xl font-bold text-white"
            >
              Convert Goals &amp; Deadlines Into a Structured Schedule
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setPlannerPrompt(SAMPLE_PLAN_PROMPT)}
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:border-indigo-500/50 cursor-pointer"
          >
            Load Sample Prompt
          </button>
        </div>

        <form onSubmit={handleGeneratePlan} className="mt-4 space-y-3">
          <label htmlFor="ai-planner-input" className="sr-only">
            Describe your goals, deadlines, and priorities
          </label>
          <textarea
            id="ai-planner-input"
            rows={3}
            value={plannerPrompt}
            onChange={(e) => setPlannerPrompt(e.target.value)}
            placeholder={SAMPLE_PLAN_PROMPT}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {planError && (
            <p
              role="alert"
              className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-200"
            >
              {planError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Generates timeline blocks, priority ranking, effort score, and completion
              estimate.
            </p>
            <button
              type="submit"
              disabled={planning}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {planning && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {planning ? "Crafting Your Plan..." : "Generate AI Plan"}
            </button>
          </div>
        </form>

        {planning && (
          <div
            aria-busy="true"
            className="mt-6 space-y-3 border-t border-slate-800/80 pt-6"
          >
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              <span>Gemini is ranking deadlines and building focus blocks...</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="h-16 animate-pulse rounded-xl bg-slate-800/70" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-800/70" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-800/70" />
            </div>
            <div className="h-24 animate-pulse rounded-xl bg-slate-800/50" />
          </div>
        )}

        {!planning && lastPlan && (
          <div className="mt-6 border-t border-slate-800/80 pt-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-sm font-medium leading-relaxed text-white">
                  {lastPlan.summary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onApplyPlan(lastPlan);
                  setPlanAddedMessage(
                    `Imported ${lastPlan.tasks.length} prioritized tasks into your Eisenhower Matrix.`
                  );
                }}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Import All Tasks ({lastPlan.tasks.length})
              </button>
            </div>

            {/* Plan Summary Metrics */}
            <div className="grid grid-cols-1 gap-3 border-y border-slate-800/80 py-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">Estimated Completion Time</p>
                <p className="mt-1 font-mono text-base font-semibold text-cyan-400 tabular-nums">
                  {lastPlan.estimatedCompletionTime || "Friday, 4:30 PM"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Focus Effort</p>
                <p className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                  {lastPlan.totalEstimatedHours} hrs
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Effort Score</p>
                <p className="mt-1 font-mono text-base font-semibold text-indigo-300 tabular-nums">
                  {lastPlan.effortScore ?? 72} / 100
                </p>
              </div>
            </div>

            {planAddedMessage && (
              <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-200">
                {planAddedMessage}
              </p>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Modern Timeline Cards */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300">
                  Execution Timeline
                </h3>
                <div className="mt-3 relative space-y-3 pl-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                  {lastPlan.dailySchedule.map((block, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl border border-slate-800/90 bg-slate-950/60 p-3.5"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -left-[18px] top-4 h-2.5 w-2.5 rounded-full border-2 border-[#090D16] bg-indigo-400"
                      />
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-indigo-300 tabular-nums">
                          {block.day} · {block.timeBlock}
                        </span>
                        <span className="font-mono text-cyan-400 tabular-nums">
                          {block.focusSessions}x25m
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-white">
                        {block.focusTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{block.category}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ranked Action Items */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300">
                  Priority Ranking &amp; Rationale
                </h3>
                <div className="mt-3 space-y-2.5">
                  {lastPlan.tasks.map((pt, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-3.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white">
                          #{pt.priorityRank} {pt.title}
                        </span>
                        <span className="font-mono text-cyan-400 tabular-nums shrink-0">
                          {pt.estimatedMinutes}m
                        </span>
                      </div>
                      <p className="mt-1 text-slate-400">{pt.rationale}</p>
                      <p className="mt-1.5 font-mono text-[11px] text-slate-500">
                        Due {pt.dueLabel} · {pt.recommendedSessions} focus sessions
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Add Task + Filter Toolbar */}
      <section
        aria-label="Add and filter tasks"
        className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6"
      >
        <h2 className="font-display text-lg font-semibold text-white">
          Quick Add Task (Auto-Sorted via Smart Prioritization)
        </h2>

        <form
          onSubmit={handleAddTaskSubmit}
          className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12"
        >
          <div className="md:col-span-5">
            <label htmlFor="new-task-title" className="sr-only">
              Task title
            </label>
            <input
              id="new-task-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Practice Calculus Derivatives Problem Set"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="new-task-due" className="sr-only">
              Due label
            </label>
            <input
              id="new-task-due"
              type="text"
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              placeholder="Today"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="new-task-priority" className="sr-only">
              Priority
            </label>
            <select
              id="new-task-priority"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label htmlFor="new-task-minutes" className="sr-only">
              Estimated minutes
            </label>
            <input
              id="new-task-minutes"
              type="number"
              min={5}
              max={300}
              value={newMinutes}
              onChange={(e) => setNewMinutes(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-2.5 py-2 text-sm text-white tabular-nums focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 cursor-pointer"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Task
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="new-task-category" className="text-xs text-slate-400">
              Category:
            </label>
            <select
              id="new-task-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-200"
            >
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
          {taskError && (
            <p role="alert" className="text-xs text-rose-300">
              {taskError}
            </p>
          )}
        </div>

        {/* Search & Filter */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950/70 py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1">
            {(["all", "pending", "completed"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors cursor-pointer ${
                  statusFilter === status
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Eisenhower Matrix 4-Quadrant Layout */}
      <section aria-labelledby="matrix-heading">
        <div className="mb-4">
          <h2
            id="matrix-heading"
            className="font-display text-lg font-semibold text-white"
          >
            Smart Prioritization Engine · Eisenhower Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Reclassify any task across quadrants or check items off to raise your
            Productivity Score.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {QUADRANTS.map((quad) => {
            const qTasks = filteredTasks.filter((t) => t.quadrant === quad.id);
            return (
              <div
                key={quad.id}
                className="flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/55 p-5"
              >
                <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className={`font-display text-base font-semibold ${quad.accent}`}>
                      {quad.title}
                    </h3>
                    <p className="text-xs text-slate-400">{quad.subtitle}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {qTasks.length} tasks
                  </span>
                </div>

                {qTasks.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-500">
                    No tasks matching filter in this quadrant.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2.5">
                    {qTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => onToggleTask(task.id)}
                            aria-label={
                              task.completed
                                ? `Mark "${task.title}" incomplete`
                                : `Complete "${task.title}"`
                            }
                            className="mt-0.5 text-slate-400 hover:text-cyan-400 cursor-pointer shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                task.completed
                                  ? "text-slate-500 line-through"
                                  : "text-white"
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 tabular-nums">
                              <span>{task.dueLabel}</span>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" aria-hidden="true" />
                                {task.estimatedMinutes}m
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{task.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <select
                            aria-label={`Move "${task.title}" to quadrant`}
                            value={task.quadrant}
                            onChange={(e) =>
                              onMoveQuadrant(
                                task.id,
                                e.target.value as EisenhowerQuadrant
                              )
                            }
                            className="rounded border border-slate-800 bg-slate-900 px-1.5 py-1 text-[11px] text-slate-300"
                          >
                            <option value="urgent_important">Do First</option>
                            <option value="important_not_urgent">Schedule</option>
                            <option value="urgent_not_important">Batch</option>
                            <option value="neither">Defer</option>
                          </select>
                          <button
                            type="button"
                            aria-label={`Delete "${task.title}"`}
                            onClick={() => onDeleteTask(task.id)}
                            className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
