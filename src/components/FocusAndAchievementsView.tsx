import { useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
} from "lucide-react";
import type { Achievement, FocusSession, Task } from "../types";

interface FocusAndAchievementsViewProps {
  tasks: Task[];
  sessions: FocusSession[];
  achievements: Achievement[];
  onLogSession: (taskTitle: string, durationMinutes: number) => void;
}

type TimerMode = "focus" | "short_break" | "long_break";

const MODE_SECONDS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

const QUOTES = [
  "Clarity precedes mastery. Protect the next 25 minutes.",
  "Momentum is built in quiet, uninterrupted blocks—not frantic multitasking.",
  "Deep focus is your rarest advantage in a distracted semester.",
  "Small daily execution compounds faster than weekend cramming.",
];

export function FocusAndAchievementsView({
  tasks,
  sessions,
  achievements,
  onLogSession,
}: FocusAndAchievementsViewProps) {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const [selectedTask, setSelectedTask] = useState<string>(
    pendingTasks[0]?.title || tasks[0]?.title || "Deep Work Sprint"
  );
  const [mode, setMode] = useState<TimerMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState<number>(MODE_SECONDS.focus);
  const [running, setRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [sessionSuccessMsg, setSessionSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          if (mode === "focus") {
            onLogSession(selectedTask, 25);
            setSessionSuccessMsg("You completed a 25-minute focus session.");
            setQuoteIdx((q) => (q + 1) % QUOTES.length);
          } else {
            setSessionSuccessMsg("Recovery break complete. Ready for your next focus sprint.");
          }
          return MODE_SECONDS[mode];
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, mode, selectedTask, onLogSession]);

  const switchMode = (nextMode: TimerMode) => {
    setRunning(false);
    setMode(nextMode);
    setSecondsLeft(MODE_SECONDS[nextMode]);
    setSessionSuccessMsg(null);
  };

  const handleCompleteNow = () => {
    setRunning(false);
    const elapsedMinutes = Math.round((MODE_SECONDS.focus - secondsLeft) / 60);
    const loggedMinutes = elapsedMinutes >= 1 ? elapsedMinutes : 25;
    onLogSession(selectedTask, loggedMinutes);
    setSecondsLeft(MODE_SECONDS[mode]);
    setSessionSuccessMsg(
      loggedMinutes === 25
        ? "You completed a 25-minute focus session."
        : `You completed a ${loggedMinutes}-minute focus session.`
    );
    setQuoteIdx((q) => (q + 1) % QUOTES.length);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const totalSeconds = MODE_SECONDS[mode];
  const progressRatio = (totalSeconds - secondsLeft) / totalSeconds;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;
  const totalMinutesLogged = sessions.reduce((s, item) => s + item.durationMinutes, 0);

  const timerBody = (
    <div className="relative flex flex-col items-center">
      {/* Subtle calming ambient aura when active */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-6 h-64 w-64 rounded-full blur-3xl transition-opacity duration-700 ${
          running ? "opacity-35" : "opacity-15"
        } ${mode === "focus" ? "bg-indigo-500" : "bg-cyan-500"}`}
      />

      <div className="relative mt-2 h-56 w-56">
        <svg className="h-56 w-56 -rotate-90" viewBox="0 0 208 208">
          <defs>
            <linearGradient id="focusRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <circle
            cx="104"
            cy="104"
            r={radius}
            fill="none"
            stroke="rgba(30,41,59,0.9)"
            strokeWidth="10"
          />
          <circle
            cx="104"
            cy="104"
            r={radius}
            fill="none"
            stroke={mode === "focus" ? "url(#focusRingGrad)" : "#06B6D4"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            data-testid="focus-timer-display"
            className="font-mono text-5xl font-bold tracking-tight text-white tabular-nums"
          >
            {mins}:{secs}
          </span>
          <span className="mt-1.5 text-xs font-medium text-slate-400 capitalize">
            {running ? "In Deep Flow" : mode.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="mt-6 w-full max-w-md">
        <label
          htmlFor={fullscreen ? "focus-task-select-fs" : "focus-task-select"}
          className="block text-xs font-medium text-slate-400"
        >
          Focusing On
        </label>
        <select
          id={fullscreen ? "focus-task-select-fs" : "focus-task-select"}
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-white"
        >
          {tasks.map((t) => (
            <option key={t.id} value={t.title}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSessionSuccessMsg(null);
            setRunning((r) => !r);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 cursor-pointer"
        >
          {running ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" />
              Start Focus
            </>
          )}
        </button>

        <button
          type="button"
          aria-label="Reset timer"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(MODE_SECONDS[mode]);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>

        {mode === "focus" && (
          <button
            type="button"
            onClick={handleCompleteNow}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Complete Session
          </button>
        )}
      </div>

      {sessionSuccessMsg && (
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-xs font-medium text-emerald-200 animate-scale-in">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{sessionSuccessMsg}</span>
        </div>
      )}

      <p className="mt-6 max-w-md text-center text-xs italic text-slate-400">
        &ldquo;{QUOTES[quoteIdx]}&rdquo;
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Fullscreen Sanctuary Overlay */}
      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen Focus Mode"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060911] p-6"
        >
          <div className="absolute right-6 top-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              <Minimize2 className="h-4 w-4" aria-hidden="true" />
              Exit Fullscreen
            </button>
          </div>
          <p className="mb-4 text-xs font-medium tracking-wide text-cyan-400">
            Distraction-Free Focus Sanctuary
          </p>
          {timerBody}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Pomodoro Timer */}
        <section
          aria-labelledby="focus-timer-heading"
          className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 lg:col-span-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
                <Timer className="h-4 w-4" aria-hidden="true" />
                <span>Focus Mode</span>
              </div>
              <h2
                id="focus-timer-heading"
                className="mt-1 font-display text-xl font-bold text-white"
              >
                Pomodoro Deep-Work Timer
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1">
                {(
                  [
                    { id: "focus", label: "25m Focus" },
                    { id: "short_break", label: "5m Break" },
                    { id: "long_break", label: "15m Rest" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => switchMode(tab.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      mode === tab.id
                        ? "bg-indigo-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Enter fullscreen focus mode"
                onClick={() => setFullscreen(true)}
                className="rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-300 hover:border-slate-600 hover:text-white cursor-pointer"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4">{timerBody}</div>
        </section>

        {/* Session Log */}
        <section className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="font-display text-base font-semibold text-white">
                Session Tracking
              </h3>
              <p className="text-xs text-slate-400">Recent verified focus blocks</p>
            </div>
            <div className="text-right tabular-nums">
              <p className="text-base font-semibold text-cyan-400">
                <span className="font-mono">{sessions.length}</span>{" "}
                <span className="text-xs font-normal text-slate-300">sessions</span>
              </p>
              <p className="text-xs text-slate-400">{totalMinutesLogged} mins total</p>
            </div>
          </div>

          <div className="mt-4 max-h-80 space-y-2.5 overflow-y-auto pr-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 px-3.5 py-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">{session.taskTitle}</p>
                  <p className="text-slate-500">
                    Hour {String(session.hourOfDay).padStart(2, "0")}:00
                  </p>
                </div>
                <span className="font-mono font-semibold text-indigo-300 tabular-nums shrink-0">
                  +{session.durationMinutes}m
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Achievements System */}
      <section aria-labelledby="achievements-heading">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              <span>Achievements System</span>
            </div>
            <h2
              id="achievements-heading"
              className="mt-1 font-display text-lg font-semibold text-white"
            >
              Execution Badges ({achievements.filter((a) => a.unlocked).length}/
              {achievements.length} Unlocked)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {achievements.map((badge) => (
            <article
              key={badge.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
                badge.unlocked
                  ? "border-cyan-500/40 bg-slate-900/80"
                  : "border-slate-800/80 bg-slate-900/40 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <Award
                    className={`h-5 w-5 ${
                      badge.unlocked ? "text-cyan-400" : "text-slate-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-[11px] font-semibold ${
                      badge.unlocked ? "text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    {badge.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold text-white">
                  {badge.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-slate-400 tabular-nums">
                  <span>{badge.requirement}</span>
                  <span>{badge.progress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      badge.unlocked ? "bg-cyan-400" : "bg-indigo-500/60"
                    }`}
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
