import { Award, Sparkles, X } from "lucide-react";
import capybaraMascotImg from "../assets/images/capybara_sunglasses_mascot_1794749770647.jpg";

interface CapybaraModalProps {
  open: boolean;
  score: number;
  unlocked: boolean;
  themeActive: boolean;
  onToggleTheme: () => void;
  onClose: () => void;
}

export function CapybaraModal({
  open,
  score,
  unlocked,
  themeActive,
  onToggleTheme,
  onClose,
}: CapybaraModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="capybara-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/45 bg-slate-900 p-6 text-center shadow-2xl animate-scale-in">
        {/* Subtle celebratory radial glow */}
        {unlocked && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"
          />
        )}

        <button
          type="button"
          aria-label="Close Capybara Mode dialog"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {unlocked ? (
          <>
            <div className="relative mx-auto mt-3 h-44 w-44">
              <div className="h-44 w-44 overflow-hidden rounded-2xl border border-cyan-400/50 bg-[#0F172A] animate-capybara-float flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <img
                  src={capybaraMascotImg}
                  alt="Animated capybara mascot wearing sleek sunglasses"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <span
                aria-hidden="true"
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900 text-cyan-300"
              >
                <Sparkles className="h-4 w-4" />
              </span>
            </div>

            <h2
              id="capybara-modal-title"
              className="mt-5 font-display text-2xl font-bold text-white"
            >
              Capybara Mode Unlocked 🦫
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              You crossed a{" "}
              <span className="font-mono font-semibold text-cyan-400 tabular-nums">
                {score}/100
              </span>{" "}
              Productivity Score. Unbothered, hydrated, and effortlessly ahead of
              schedule.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onToggleTheme}
                className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer"
              >
                {themeActive
                  ? "Capybara Chill Accent Active"
                  : "Activate Capybara Chill Accent"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Return to Workspace
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mt-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-2xl">
              <Award className="h-7 w-7 text-cyan-400" aria-hidden="true" />
            </div>
            <h2
              id="capybara-modal-title"
              className="mt-4 font-display text-xl font-bold text-white"
            >
              Secret Capybara Sanctuary
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Reach a Productivity Score of{" "}
              <span className="font-mono font-semibold text-cyan-400 tabular-nums">
                95
              </span>{" "}
              or higher to unlock Capybara Mode. You are currently at{" "}
              <span className="font-mono font-semibold text-white tabular-nums">
                {score}/100
              </span>
              .
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Tip: Check off remaining Today tasks or complete a Focus session to push
              your score past 95.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 cursor-pointer"
            >
              Got it
            </button>
          </>
        )}
      </div>
    </div>
  );
}
