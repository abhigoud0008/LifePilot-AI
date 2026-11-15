import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  Compass,
  Play,
  ShieldAlert,
  Target,
  Timer,
  X,
} from "lucide-react";
import mayaImg from "../assets/images/testimonial_student_maya_1794749771226.jpg";
import liamImg from "../assets/images/testimonial_analyst_liam_1794749772005.jpg";
import priyaImg from "../assets/images/testimonial_designer_priya_1794749772915.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onLaunchDemo: () => void;
}

const FEATURES = [
  {
    index: "01",
    title: "AI Planner",
    description:
      "Turn messy exam dates, project deadlines, and personal routines into a prioritized daily plan with realistic effort estimates.",
    metric: "Auto-schedules in <3s",
    icon: Brain,
    span: "lg:col-span-2",
  },
  {
    index: "02",
    title: "Productivity Score",
    description:
      "Track real execution momentum from 0 to 100 across task completion, focus hours, and daily consistency.",
    metric: "Weighted 4-factor model",
    icon: Activity,
    span: "lg:col-span-1",
  },
  {
    index: "03",
    title: "Burnout Prediction",
    description:
      "Combine sleep hours, daily workload, and stress signals to flag overload early and rebalance before fatigue hits.",
    metric: "Balanced · Pacing · Recovery",
    icon: ShieldAlert,
    span: "lg:col-span-1",
  },
  {
    index: "04",
    title: "Smart Scheduling",
    description:
      "Eisenhower Matrix sorting paired with morning AI Day Optimization places deep work where cognitive energy peaks.",
    metric: "4-quadrant priority engine",
    icon: CalendarClock,
    span: "lg:col-span-2",
  },
  {
    index: "05",
    title: "Focus Coach",
    description:
      "Pomodoro focus timers paired with a Gemini-powered productivity mentor that adapts advice to your live workload.",
    metric: "25m focus · 5m recovery",
    icon: Timer,
    span: "lg:col-span-1",
  },
  {
    index: "06",
    title: "Goal Tracking",
    description:
      "Connect daily tasks directly to semester GPAs, internship milestones, and fitness consistency.",
    metric: "Milestone-linked progress",
    icon: Target,
    span: "lg:col-span-2",
  },
];

const STATS = [
  {
    value: "6.4 hrs",
    label: "Time Saved Weekly",
    context: "Reclaimed from manual re-scheduling and decision fatigue",
  },
  {
    value: "142,800+",
    label: "Tasks Completed",
    context: "Executed on time across university & early-career cohorts",
  },
  {
    value: "+38%",
    label: "Productivity Increase",
    context: "Measured improvement in 14-day deadline completion consistency",
  },
];

const TESTIMONIALS = [
  {
    name: "Maya Chen",
    role: "CS & Math Double Major · UC Berkeley",
    quote:
      "Before LifePilot AI, I kept rewriting to-do lists during midterms and still missed sleep. The AI Day Optimizer blocked my morning proofs and forced afternoon breaks—I finished finals week with a 3.94 GPA and zero all-nighters.",
    image: mayaImg,
  },
  {
    name: "Liam Carter",
    role: "Junior Equity Analyst · Meridian Capital",
    quote:
      "Most apps just hoard overdue tasks. LifePilot's Eisenhower Matrix and Burnout Prediction caught a 12-hour overload week early and re-ordered my deliverables so I hit every client deadline calmly.",
    image: liamImg,
  },
  {
    name: "Priya Nair",
    role: "Product Design Fellow · Studio North",
    quote:
      "Having my Pomodoro focus sessions directly feed my Productivity Score turned consistency into something tangible. The AI Coach talks me out of perfectionism whenever I over-scope a sprint.",
    image: priyaImg,
  },
];

export function LandingPage({
  onGetStarted,
  onLoginClick,
  onLaunchDemo,
}: LandingPageProps) {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090D16] text-slate-100">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090D16]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            LifePilot AI
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400"
          >
            <a
              href="#features"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Features
            </a>
            <a
              href="#workflow"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Workflow
            </a>
            <a
              href="#impact"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Impact
            </a>
            <a
              href="#testimonials"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Testimonials
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800/70">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(99,102,241,0.26),transparent)]"
          />

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-12 px-6 py-16 lg:grid-cols-12 lg:py-24">
            <div className="flex flex-col justify-center lg:col-span-6 animate-fade-in-up">
              <p className="text-sm font-medium tracking-wide text-cyan-400">
                Your Personal AI Chief of Staff · AI Productivity Operating System
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white [text-wrap:balance]">
                Stop Managing Tasks. Start Managing Life.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                This is an AI-powered productivity operating system, not another to-do
                app. LifePilot AI prioritizes work, optimizes your daily schedule,
                protects you from burnout, and keeps your goals on track.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                  Watch Demo
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={onLaunchDemo}
                  className="font-medium text-indigo-300 underline decoration-indigo-500/50 underline-offset-4 hover:text-indigo-200 cursor-pointer"
                >
                  Instant Judge Access: Open Live Workspace
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="hover:text-slate-200 cursor-pointer"
                >
                  Sign in to existing account
                </button>
              </div>
            </div>

            {/* Interactive Hero Command Preview Card */}
            <div className="flex flex-col justify-center lg:col-span-6 animate-fade-in-up">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Morning Briefing · AI Day Optimizer
                    </p>
                    <h2 className="mt-1 font-display text-lg font-semibold text-white">
                      Today&apos;s Optimized Execution Plan
                    </h2>
                  </div>
                  <div className="text-right tabular-nums">
                    <span className="text-xs text-slate-400">Productivity Score</span>
                    <p className="font-mono text-2xl font-semibold text-cyan-400">
                      86<span className="text-sm text-slate-500">/100</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
                    <div>
                      <p className="font-mono text-xs text-indigo-400">09:00 – 10:15</p>
                      <p className="mt-0.5 text-sm font-medium text-white">
                        Linear Algebra Exam Practice Set
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Urgent &amp; Important · 3 Focus Sessions
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-400 whitespace-nowrap">
                      Peak Focus
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
                    <div>
                      <p className="font-mono text-xs text-cyan-400">10:15 – 10:30</p>
                      <p className="mt-0.5 text-sm font-medium text-white">
                        Screen-Free Recovery Break
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Recommended to keep burnout risk Low
                      </p>
                    </div>
                    <span className="text-xs font-medium text-cyan-300 whitespace-nowrap">
                      Recovery
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 pb-1">
                    <div>
                      <p className="font-mono text-xs text-violet-400">15:15 – 15:45</p>
                      <p className="mt-0.5 text-sm font-medium text-white">
                        Outdoor Walk &amp; Mobility Reset
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Target completion time: 5:15 PM
                      </p>
                    </div>
                    <span className="text-xs font-medium text-violet-300 whitespace-nowrap">
                      Exercise
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                  <span>Burnout Status: Balanced Pace (13/100)</span>
                  <button
                    type="button"
                    onClick={onLaunchDemo}
                    className="inline-flex items-center gap-1.5 font-medium text-white hover:text-cyan-300 cursor-pointer"
                  >
                    Try interactive workspace
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section (Asymmetric Bento Grid) */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-indigo-400">Core Capabilities</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
              Built to guide your decisions, not just list your chores.
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Every surface inside LifePilot AI works together—from Eisenhower
              prioritization to sleep-aware burnout prevention.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <article
                  key={feat.title}
                  className={`flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/55 p-6 transition-colors hover:border-slate-700 ${feat.span}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-medium text-slate-400">
                        {feat.index}.
                      </span>
                      <Icon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-white">
                      {feat.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                      {feat.description}
                    </p>
                  </div>
                  <p className="mt-6 border-t border-slate-800/80 pt-4 text-xs font-medium text-cyan-400">
                    {feat.metric}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Workflow Spotlight: AI Day Optimizer */}
        <section
          id="workflow"
          className="border-y border-slate-800/80 bg-slate-950/60"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="text-sm font-medium text-cyan-400">
                Daily Morning Ritual
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance]">
                One click each morning with AI Day Optimizer.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Instead of staring at 18 overdue items, click{" "}
                <strong className="font-semibold text-white">Optimize My Day</strong>.
                Gemini evaluates your deadlines, sleep recovery, and focus capacity to
                generate an hour-by-hour execution blueprint.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" aria-hidden="true" />
                  <span>Peak-energy study and deep-work time blocks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" aria-hidden="true" />
                  <span>Adaptive break timings and movement suggestions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" aria-hidden="true" />
                  <span>Clear estimated completion time so evenings stay free</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={onLaunchDemo}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 transition-colors cursor-pointer"
              >
                Try AI Day Optimizer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs font-medium text-indigo-400">
                    Quadrant 1 · Do First
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-white">
                    Urgent &amp; Important
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Exam prep, lab submissions, and same-day client deliverables
                    automatically surface at the top of your morning.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs font-medium text-cyan-400">
                    Quadrant 2 · Schedule
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-white">
                    Important, Not Urgent
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Capstone research, portfolio building, and workouts get protected
                    calendar blocks before crises crowd them out.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs font-medium text-amber-400">
                    Quadrant 3 · Batch
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-white">
                    Urgent, Not Important
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Routine messages and admin errands are grouped into a single low-energy
                    15-minute afternoon slot.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs font-medium text-slate-400">
                    Quadrant 4 · Defer
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-white">
                    Neither
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Low-impact busywork is parked out of sight so your attention stays
                    locked on high-leverage milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics & Testimonials Section (Claim-to-Proof Adjacency) */}
        <section id="impact" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 gap-6 border-b border-slate-800/80 pb-16 md:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6"
              >
                <p className="font-mono text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 font-display text-base font-semibold text-indigo-300">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-sm text-slate-400">{stat.context}</p>
              </div>
            ))}
          </div>

          <div id="testimonials" className="pt-16">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-cyan-400">Student &amp; Pro Proof</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
                Trusted by ambitious students and early-career teams.
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <article
                  key={item.name}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/55 p-6"
                >
                  <p className="text-sm leading-relaxed text-slate-200">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3.5 border-t border-slate-800/80 pt-5">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Conversion Band */}
        <section className="border-t border-slate-800/80 bg-slate-950/70">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Ready to hand the busywork to your AI Chief of Staff?
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Explore the full dashboard immediately with pre-loaded demo data or create
                your own workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onLaunchDemo}
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                Launch Live Demo
              </button>
              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 transition-colors cursor-pointer whitespace-nowrap"
              >
                Create Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Startup Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070A12]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <Compass className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            <span className="font-display text-sm font-semibold text-white">
              LifePilot AI
            </span>
            <span className="text-xs text-slate-500">· Your Personal AI Chief of Staff</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-slate-200">
              Features
            </a>
            <a href="#workflow" className="hover:text-slate-200">
              AI Day Optimizer
            </a>
            <a href="#impact" className="hover:text-slate-200">
              Impact
            </a>
            <button type="button" onClick={onLoginClick} className="hover:text-slate-200 cursor-pointer">
              Sign In
            </button>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} LifePilot AI. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Watch Demo Interactive Modal */}
      {demoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-medium text-cyan-400">
                  30-Second Interactive Walkthrough
                </p>
                <h3
                  id="demo-modal-title"
                  className="mt-1 font-display text-xl font-bold text-white"
                >
                  Inside LifePilot AI
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close demo preview"
                onClick={() => setDemoModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="font-mono text-xs text-indigo-400">Step 01</p>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  Click Optimize My Day
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Gemini organizes your deadlines, breaks, and exercise into one clean timeline.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="font-mono text-xs text-violet-400">Step 02</p>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  Auto-Sort Priorities
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Tasks flow into the Eisenhower Matrix while Burnout Prediction monitors load.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="font-mono text-xs text-cyan-400">Step 03</p>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  Hit Score 95+
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Complete today&apos;s top tasks or focus blocks to unlock Secret Capybara Mode.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setDemoModalOpen(false);
                  onLaunchDemo();
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-400 cursor-pointer"
              >
                Launch Interactive Demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
