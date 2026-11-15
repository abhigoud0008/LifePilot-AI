# LifePilot AI

> **Your Personal AI Chief of Staff** — AI-powered task prioritization, daily schedule optimization, burnout prediction, and focus coaching for students and young professionals.

LifePilot AI goes beyond static to-do lists by actively organizing your day with Gemini AI, prioritizing work through an automated Eisenhower Matrix, monitoring burnout risk from sleep and workload signals, and turning execution into measurable daily momentum.

---

## Key Features

- **AI Day Optimizer** — One-click morning blueprint (`/api/ai/optimize-day`) that organizes pending tasks, break timings, movement/exercise suggestions, and target completion times around your current sleep and burnout state.
- **AI Planner** — Converts natural-language goals and deadlines (e.g., exams, projects, fitness targets) into a structured daily schedule, priority ranking, effort estimates, and recommended Pomodoro sessions (`/api/ai/plan`).
- **Smart Prioritization Engine (Eisenhower Matrix)** — Automatically classifies tasks into *Urgent & Important*, *Important, Not Urgent*, *Urgent, Not Important*, and *Neither*, with search, status filtering, and quadrant reclassification.
- **Productivity Score (0–100)** — Real-time weighted score combining task completion, daily consistency, execution streak, and logged focus hours.
- **Burnout Prediction Engine** — Interactive cognitive load analyzer evaluating sleep hours, daily workload, and stress level to surface `Low`, `Moderate`, or `High` risk status, warning indicators, and recovery recommendations.
- **Focus Mode & Achievements** — Pomodoro deep-work timer (`25m Focus`, `5m Break`, `15m Rest`), task-linked session logging, motivational quotes, and 5 unlockable achievement badges (*Early Bird*, *Focus Master*, *Consistency King*, *Goal Crusher*, *Productivity Legend*).
- **AI Coach** — Context-aware personal productivity mentor powered by Gemini (`/api/ai/coach`) with starter prompts for daily planning, study strategies, procrastination, and workload balance.
- **Analytics Dashboard** — Interactive Recharts visualizations covering weekly productivity, monthly performance vs. target, task completion trends, goal progress, and category time distribution.
- **Goal Tracking** — Milestone-based goal cards with real-time progress calculation.
- **Secret Capybara Mode** — Reaching a **Productivity Score >= 95** unlocks *Capybara Mode* with an animated sunglasses capybara mascot and optional accent theme.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts
- **Backend / AI Proxy:** Express (`server.ts`), `@google/genai` (`gemini-4-hydrogen`)
- **Persistence:** Browser `localStorage` abstracted behind a `StorageAdapter` interface (`src/services/storage.ts`) for straightforward migration to Firebase or another backend
- **Testing:** Node.js built-in test runner (`node:test` + `tsx`)

---

## Project Structure

```text
├── server.ts                          # Express server + Vite dev middleware + Gemini API routes
├── index.html                         # HTML entry point & Google Fonts
├── package.json                       # Scripts & dependencies
├── .env.example                       # Required environment variable template
└── src/
    ├── App.tsx                        # Top-level view & workspace router
    ├── index.css                      # Tailwind v4 theme & animations
    ├── types/
    │   └── index.ts                   # Domain models & interfaces
    ├── hooks/
    │   └── useLifePilotState.ts       # Centralized workspace state & actions
    ├── services/
    │   ├── ai.ts                      # Client API layer for /api/ai/* endpoints
    │   └── storage.ts                 # StorageAdapter, LocalStorage persistence & demo seed data
    ├── utils/
    │   ├── productivity.ts            # Productivity score & Eisenhower logic (+ .test.ts)
    │   ├── burnout.ts                 # Burnout risk scoring & insights (+ .test.ts)
    │   └── achievements.ts            # Achievement badge evaluation (+ .test.ts)
    └── components/
        ├── LandingPage.tsx            # Marketing landing page & Watch Demo modal
        ├── AuthView.tsx               # Login, Register & 1-click Demo Workspace access
        ├── AppShell.tsx               # Responsive sidebar & top bar shell
        ├── DashboardOverview.tsx      # 6 KPIs, AI Day Optimizer, Score gauge & Today queue
        ├── TasksAndPlannerView.tsx    # AI Planner + Eisenhower Matrix + Task CRUD
        ├── GoalsView.tsx              # Milestone goal tracker
        ├── AnalyticsAndBurnoutView.tsx# Recharts analytics & Burnout Prediction sliders
        ├── FocusAndAchievementsView.tsx # Pomodoro timer, session logs & badges
        ├── AICoachView.tsx            # Gemini-powered AI Coach chat
        ├── SettingsView.tsx           # Profile preferences & demo data reset
        └── CapybaraModal.tsx          # Secret Capybara Mode celebration modal
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20`
- A **Gemini API key** from Google AI Studio

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd lifepilot-ai
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

> All Gemini API calls run server-side through Express (`/api/ai/*`) so the API key is never exposed to the browser.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts & Verification

```bash
# Run development server (Express + Vite middleware on port 3000)
npm run dev

# Build production client bundle
npm run build

# Typecheck TypeScript
npm run lint

# Run unit tests for scoring, burnout, and achievement logic
npx --yes tsx --test src/utils/productivity.test.ts src/utils/burnout.test.ts src/utils/achievements.test.ts
```

---

## 3-Minute Demo Flow

1. **Landing Page:** Open the app and click **Instant Judge Access: Open Live Workspace** (or append `?autostart=1` to the URL) to enter pre-seeded demo data immediately.
2. **AI Day Optimizer:** On the Dashboard, inspect the 6 KPIs and click **Optimize My Day** to generate a fresh Gemini daily schedule with breaks and movement blocks.
3. **Trigger Capybara Mode:** Check off the remaining two tasks in *Today's Prioritized Queue* to push the Productivity Score from `86` to `95+` and unlock **Capybara Mode Unlocked 🦫**.
4. **AI Planner & Eisenhower Matrix:** Open **Tasks**, load the sample prompt in **AI Planner**, generate a plan with Gemini, and import tasks into the 4-quadrant matrix.
5. **Burnout Prediction & Analytics:** Open **Analytics** and adjust the *Sleep Hours*, *Daily Workload*, and *Stress Level* sliders to watch the risk level shift across `Low`, `Moderate`, and `High`.
6. **Focus Mode & AI Coach:** Start a Pomodoro session in **Focus Mode** and chat with **AI Coach** for workload-aware guidance.

---

## License

Apache-2.0
