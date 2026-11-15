import { useState, type FormEvent } from "react";
import { RotateCcw, Save } from "lucide-react";
import type { UserProfile } from "../types";

interface SettingsViewProps {
  user: UserProfile;
  onUpdateSettings: (
    updates: Partial<Pick<UserProfile, "name" | "role" | "dailyFocusTargetHours">>
  ) => void;
  onResetDemo: () => void;
  onLogout: () => void;
}

export function SettingsView({
  user,
  onUpdateSettings,
  onResetDemo,
  onLogout,
}: SettingsViewProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [dailyFocusTargetHours, setDailyFocusTargetHours] = useState(
    user.dailyFocusTargetHours
  );
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateSettings({
      name: name.trim(),
      role: role.trim() || "Student",
      dailyFocusTargetHours: Math.max(1, Math.min(12, dailyFocusTargetHours)),
    });
    setSavedNotice("Workspace preferences saved locally.");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <section className="rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          Profile &amp; Preferences
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Stored in Local Storage via a modular StorageAdapter for seamless future
          Firebase sync.
        </p>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="settings-name"
              className="block text-xs font-medium text-slate-300"
            >
              Display Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label
              htmlFor="settings-role"
              className="block text-xs font-medium text-slate-300"
            >
              Academic / Career Track
            </label>
            <input
              id="settings-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label
              htmlFor="settings-target"
              className="block text-xs font-medium text-slate-300"
            >
              Daily Focus Target (Hours)
            </label>
            <input
              id="settings-target"
              type="number"
              min={1}
              max={12}
              value={dailyFocusTargetHours}
              onChange={(e) => setDailyFocusTargetHours(Number(e.target.value))}
              className="mt-1.5 w-32 rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2 text-sm text-white tabular-nums"
            />
          </div>

          {savedNotice && (
            <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-200">
              {savedNotice}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 cursor-pointer"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Preferences
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6">
        <h3 className="font-display text-base font-semibold text-white">
          Demo Data &amp; Session Controls
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Restore the default hackathon dataset or sign out to switch accounts.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onResetDemo();
              setSavedNotice("Demo workspace data restored to initial state.");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Demo Data
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </section>
    </div>
  );
}
