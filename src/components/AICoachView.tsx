import { useState, type FormEvent } from "react";
import { Bot, Compass, Flame, HeartPulse, Send, Timer, User } from "lucide-react";
import { sendCoachMessage } from "../services/ai";
import type { ChatMessage, DashboardSection } from "../types";

interface AICoachViewProps {
  messages: ChatMessage[];
  userContext: {
    name: string;
    productivityScore: number;
    streakDays: number;
    pendingTasksCount: number;
    burnoutRisk: string;
  };
  onAppendMessages: (msgs: ChatMessage[]) => void;
  onNavigate?: (section: DashboardSection) => void;
}

const STARTER_CARDS = [
  {
    title: "Plan Today Calmly",
    prompt: "How should I sequence my remaining tasks today without burning out?",
    icon: Compass,
  },
  {
    title: "2-Hour Exam Protocol",
    prompt: "Give me a 2-hour study protocol for an upcoming math exam.",
    icon: Timer,
  },
  {
    title: "Beat Procrastination",
    prompt: "I keep procrastinating on my big project—how do I start in 5 minutes?",
    icon: Flame,
  },
  {
    title: "Balance Workload & Health",
    prompt: "Balance my workload so I still have time to exercise 4x this week.",
    icon: HeartPulse,
  },
];

export function AICoachView({
  messages,
  userContext,
  onAppendMessages,
  onNavigate,
}: AICoachViewProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nextHistory = [...messages, userMsg];
    onAppendMessages([userMsg]);
    setInput("");
    setSending(true);

    try {
      const { reply } = await sendCoachMessage({
        messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
        userContext,
      });
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: reply || "Keep focusing on one high-impact block at a time.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      onAppendMessages([assistantMsg]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reach AI Coach."
      );
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitMessage(input);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section
        aria-label="AI Coach conversation"
        className="flex h-[640px] flex-col rounded-2xl border border-slate-800/90 bg-slate-900/65 lg:col-span-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/40 bg-indigo-500/15">
              <Bot className="h-5 w-5 text-indigo-300" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-white">
                LifePilot AI Coach
              </h2>
              <p className="text-xs text-slate-400">
                Personal Chief of Staff · Live workload context
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-cyan-400 tabular-nums">
            Score {userContext.productivityScore}/100 · {userContext.streakDays}d streak
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 animate-fade-in-up ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs ${
                  msg.role === "user"
                    ? "border-indigo-400/50 bg-indigo-500 text-white"
                    : "border-slate-700 bg-slate-800 text-cyan-400"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Bot className="h-4 w-4" aria-hidden="true" />
                )}
              </div>

              <div
                className={`flex max-w-[82%] flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-indigo-500 text-white"
                      : "border border-slate-800 bg-slate-950/80 text-slate-200"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="mt-1 text-[11px] text-slate-500">
                  {msg.role === "user" ? "You" : "LifePilot Coach"} · {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-cyan-400">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Suggestions */}
        {onNavigate && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/60 px-6 py-2.5 text-xs">
            <span className="text-slate-500">Quick actions:</span>
            <button
              type="button"
              onClick={() => onNavigate("focus")}
              className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-slate-300 hover:border-indigo-500/50 hover:text-white cursor-pointer"
            >
              Launch Focus Timer
            </button>
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-slate-300 hover:border-indigo-500/50 hover:text-white cursor-pointer"
            >
              Open AI Planner
            </button>
            <button
              type="button"
              onClick={() => onNavigate("analytics")}
              className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-slate-300 hover:border-indigo-500/50 hover:text-white cursor-pointer"
            >
              Review Burnout Balance
            </button>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mx-6 mb-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-200"
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleFormSubmit}
          className="flex items-center gap-3 border-t border-slate-800/80 p-4"
        >
          <label htmlFor="coach-input" className="sr-only">
            Ask your AI Coach
          </label>
          <input
            id="coach-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for daily planning, study tactics, or motivation..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label="Send message to AI Coach"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>Send</span>
          </button>
        </form>
      </section>

      <aside className="space-y-4 lg:col-span-4">
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5">
          <h3 className="font-display text-sm font-semibold text-white">
            Starter Prompt Cards
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Select a scenario for instant tailored coaching.
          </p>
          <div className="mt-4 space-y-3">
            {STARTER_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.title}
                  type="button"
                  disabled={sending}
                  onClick={() => void submitMessage(card.prompt)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/65 p-3.5 text-left hover:border-indigo-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{card.title}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    {card.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
