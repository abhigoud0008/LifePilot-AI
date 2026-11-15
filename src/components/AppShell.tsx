import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Bot,
  CheckSquare,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Target,
  Timer,
  X,
} from "lucide-react";
import type { DashboardSection, UserProfile } from "../types";

interface AppShellProps {
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  user: UserProfile;
  productivityScore: number;
  capybaraUnlocked: boolean;
  capybaraThemeActive: boolean;
  onOpenCapybara: () => void;
  onQuickOptimize: () => void;
  onLogout: () => void;
  children: ReactNode;
}

const NAV_ITEMS: Array<{
  id: DashboardSection;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "goals", label: "Goals", icon: Target },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "focus", label: "Focus Mode", icon: Timer },
  { id: "coach", label: "AI Coach", icon: Bot },
  { id: "settings", label: "Settings", icon: Settings },
];

const SECTION_TITLES: Record<DashboardSection, string> = {
  dashboard: "Executive Dashboard",
  tasks: "Tasks & AI Planner",
  goals: "Goal Tracking",
  analytics: "Analytics & Burnout",
  focus: "Focus Mode & Badges",
  coach: "AI Coach",
  settings: "Workspace Settings",
};

export function AppShell({
  activeSection,
  onSelectSection,
  user,
  productivityScore,
  capybaraUnlocked,
  capybaraThemeActive,
  onOpenCapybara,
  onQuickOptimize,
  onLogout,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: DashboardSection) => {
    onSelectSection(id);
    setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#0B101B] p-4">
      <div>
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2.5">
            <Compass
              className={`h-5 w-5 ${
                capybaraThemeActive ? "text-cyan-400" : "text-indigo-400"
              }`}
              aria-hidden="true"
            />
            <span className="font-display text-base font-bold tracking-tight text-white whitespace-nowrap">
              LifePilot AI
            </span>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Workspace navigation" className="mt-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? capybaraThemeActive
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "bg-indigo-500/15 text-indigo-300"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[140px]">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 truncate max-w-[140px]">
              {user.role}
            </p>
          </div>
          {/* Secret Capybara Easter Egg Icon */}
          <button
            type="button"
            onClick={onOpenCapybara}
            title={
              capybaraUnlocked
                ? "Capybara Mode Unlocked — Click to view mascot"
                : "Secret Capybara Sanctuary (Score 95+)"
            }
            aria-label="Secret Capybara Easter Egg"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-transform hover:scale-105 cursor-pointer ${
              capybaraUnlocked
                ? "border-cyan-400/50 bg-cyan-500/15 opacity-100"
                : "border-slate-800 bg-slate-900/60 opacity-45 hover:opacity-90"
            }`}
          >
            <span aria-hidden="true">🦫</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-[#090D16] text-slate-100 flex ${
        capybaraThemeActive ? "selection:bg-cyan-500/30" : ""
      }`}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:border-r lg:border-slate-800/80">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 w-64 border-r border-slate-800">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-800/80 bg-[#090D16]/85 px-4 py-3.5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-800 p-2 text-slate-300 hover:bg-slate-800 lg:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display text-base font-semibold text-white truncate sm:text-lg">
                {SECTION_TITLES[activeSection]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 tabular-nums">
              <span>Score</span>
              <span
                className={`font-mono text-sm font-semibold ${
                  capybaraUnlocked ? "text-cyan-400" : "text-white"
                }`}
              >
                {productivityScore}/100
              </span>
            </div>

            <button
              type="button"
              onClick={onQuickOptimize}
              className="rounded-lg bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer sm:text-sm"
            >
              Optimize My Day
            </button>
          </div>
        </header>

        {/* Secret Capybara Mode Banner when Score >= 95 */}
        {capybaraUnlocked && (
          <div className="border-b border-cyan-500/30 bg-cyan-950/35 px-4 py-2.5 sm:px-8">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium text-cyan-200 sm:text-sm">
                Capybara Mode Unlocked 🦫 — Productivity Score reached{" "}
                <span className="font-mono font-semibold tabular-nums">
                  {productivityScore}
                </span>
                /100. Peak calm execution achieved.
              </p>
              <button
                type="button"
                onClick={onOpenCapybara}
                className="text-xs font-semibold text-cyan-300 underline underline-offset-4 hover:text-white cursor-pointer"
              >
                Meet Sunglasses Capybara
              </button>
            </div>
          </div>
        )}

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
