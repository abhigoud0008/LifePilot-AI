import type {
  StoredUserRecord,
  UserProfile,
  WorkspaceState,
} from "../types";

export interface StorageAdapter {
  getUsers(): StoredUserRecord[];
  saveUsers(users: StoredUserRecord[]): void;
  getCurrentUserId(): string | null;
  setCurrentUserId(userId: string | null): void;
  getWorkspace(userId: string): WorkspaceState;
  saveWorkspace(userId: string, state: WorkspaceState): void;
  resetWorkspace(userId: string): WorkspaceState;
}

const USERS_KEY = "lifepilot_users_v1";
const SESSION_KEY = "lifepilot_session_user_v1";
const WORKSPACE_PREFIX = "lifepilot_workspace_v1_";

export const DEMO_USER_ID = "demo-alex-rivera";

export const DEMO_USER_PROFILE: StoredUserRecord = {
  id: DEMO_USER_ID,
  name: "Alex Rivera",
  email: "alex@lifepilot.ai",
  passwordHash: "demo1234",
  role: "Computer Science Junior",
  dailyFocusTargetHours: 4,
  streakDays: 9,
  consistencyRate: 92,
  capybaraUnlockedOnce: false,
};

export function createSeedWorkspace(): WorkspaceState {
  return {
    tasks: [
      {
        id: "t-1",
        title: "Finalize Linear Algebra Exam Practice Set",
        dueLabel: "Today, 4:00 PM",
        estimatedMinutes: 60,
        priority: "high",
        quadrant: "urgent_important",
        category: "Study",
        completed: false,
        isToday: true,
        createdAt: "2026-11-15T08:00:00Z",
      },
      {
        id: "t-2",
        title: "Submit Organic Chemistry Lab Reflection",
        dueLabel: "Today, 8:00 PM",
        estimatedMinutes: 45,
        priority: "high",
        quadrant: "urgent_important",
        category: "Study",
        completed: false,
        isToday: true,
        createdAt: "2026-11-15T08:15:00Z",
      },
      {
        id: "t-3",
        title: "Outline Capstone Research Methodology",
        dueLabel: "Wednesday",
        estimatedMinutes: 90,
        priority: "medium",
        quadrant: "important_not_urgent",
        category: "Work",
        completed: true,
        isToday: true,
        createdAt: "2026-11-14T10:00:00Z",
        completedAt: "2026-11-15T09:10:00Z",
      },
      {
        id: "t-4",
        title: "40-Min Tempo Run & Mobility Stretch",
        dueLabel: "Today",
        estimatedMinutes: 40,
        priority: "medium",
        quadrant: "important_not_urgent",
        category: "Health",
        completed: true,
        isToday: true,
        createdAt: "2026-11-15T07:00:00Z",
        completedAt: "2026-11-15T07:45:00Z",
      },
      {
        id: "t-5",
        title: "Reply to Study Group Scheduling Thread",
        dueLabel: "Today",
        estimatedMinutes: 15,
        priority: "low",
        quadrant: "urgent_not_important",
        category: "Personal",
        completed: true,
        isToday: true,
        createdAt: "2026-11-15T08:30:00Z",
        completedAt: "2026-11-15T08:45:00Z",
      },
      {
        id: "t-6",
        title: "Review Algorithm Flashcards (Trees & DP)",
        dueLabel: "Friday",
        estimatedMinutes: 50,
        priority: "medium",
        quadrant: "important_not_urgent",
        category: "Study",
        completed: true,
        isToday: false,
        createdAt: "2026-11-13T11:00:00Z",
        completedAt: "2026-11-14T18:00:00Z",
      },
      {
        id: "t-7",
        title: "Renew Campus Transit Pass",
        dueLabel: "This Week",
        estimatedMinutes: 10,
        priority: "low",
        quadrant: "urgent_not_important",
        category: "Personal",
        completed: true,
        isToday: false,
        createdAt: "2026-11-13T14:00:00Z",
        completedAt: "2026-11-14T12:00:00Z",
      },
      {
        id: "t-8",
        title: "Prepare Internship Portfolio Case Study",
        dueLabel: "Next Monday",
        estimatedMinutes: 75,
        priority: "medium",
        quadrant: "important_not_urgent",
        category: "Work",
        completed: true,
        isToday: false,
        createdAt: "2026-11-12T09:00:00Z",
        completedAt: "2026-11-14T16:30:00Z",
      },
      {
        id: "t-9",
        title: "Sort Saved Research PDFs into Folders",
        dueLabel: "Weekend",
        estimatedMinutes: 20,
        priority: "low",
        quadrant: "neither",
        category: "Personal",
        completed: true,
        isToday: false,
        createdAt: "2026-11-12T15:00:00Z",
        completedAt: "2026-11-13T19:00:00Z",
      },
    ],
    goals: [
      {
        id: "g-1",
        title: "3.9+ GPA Fall Semester Finish",
        category: "Study",
        targetDate: "Dec 18",
        milestones: [
          { id: "gm-1", title: "Complete all midterm review packets", completed: true },
          { id: "gm-2", title: "Score 90%+ on Linear Algebra mock", completed: true },
          { id: "gm-3", title: "Submit Chemistry lab portfolio", completed: false },
          { id: "gm-4", title: "Attend 2 TA office hour sessions", completed: true },
        ],
      },
      {
        id: "g-2",
        title: "Summer Software Engineering Internship",
        category: "Work",
        targetDate: "Jan 15",
        milestones: [
          { id: "gm-5", title: "Ship 2 full-stack portfolio projects", completed: true },
          { id: "gm-6", title: "Complete 40 LeetCode medium problems", completed: true },
          { id: "gm-7", title: "Run 3 mock behavioral interviews", completed: false },
        ],
      },
      {
        id: "g-3",
        title: "Consistent Athletic Conditioning",
        category: "Health",
        targetDate: "Ongoing",
        milestones: [
          { id: "gm-8", title: "4 cardio sessions this week", completed: true },
          { id: "gm-9", title: "Average 7.5+ hours sleep", completed: true },
          { id: "gm-10", title: "Zero late-night caffeine after 3 PM", completed: false },
        ],
      },
    ],
    sessions: [
      {
        id: "s-1",
        taskTitle: "Outline Capstone Research Methodology",
        durationMinutes: 50,
        completedAt: "2026-11-15T09:10:00Z",
        hourOfDay: 8,
      },
      {
        id: "s-2",
        taskTitle: "Review Algorithm Flashcards (Trees & DP)",
        durationMinutes: 75,
        completedAt: "2026-11-14T17:30:00Z",
        hourOfDay: 16,
      },
      {
        id: "s-3",
        taskTitle: "Prepare Internship Portfolio Case Study",
        durationMinutes: 95,
        completedAt: "2026-11-14T15:00:00Z",
        hourOfDay: 14,
      },
      {
        id: "s-4",
        taskTitle: "Linear Algebra Eigenvalues Drill",
        durationMinutes: 50,
        completedAt: "2026-11-13T11:20:00Z",
        hourOfDay: 10,
      },
    ],
    burnoutInput: {
      sleepHours: 7.5,
      workloadHours: 6.5,
      stressLevel: 3,
    },
    weeklyAnalytics: [
      { day: "Mon", score: 78, tasksCompleted: 4, focusMinutes: 100 },
      { day: "Tue", score: 82, tasksCompleted: 5, focusMinutes: 125 },
      { day: "Wed", score: 80, tasksCompleted: 4, focusMinutes: 110 },
      { day: "Thu", score: 85, tasksCompleted: 6, focusMinutes: 150 },
      { day: "Fri", score: 87, tasksCompleted: 6, focusMinutes: 140 },
      { day: "Sat", score: 84, tasksCompleted: 5, focusMinutes: 120 },
      { day: "Sun", score: 86, tasksCompleted: 7, focusMinutes: 165 },
    ],
    monthlyPerformance: [
      { week: "Week 1", productivity: 74, target: 80 },
      { week: "Week 2", productivity: 81, target: 82 },
      { week: "Week 3", productivity: 85, target: 85 },
      { week: "Week 4", productivity: 89, target: 88 },
    ],
    lastPlan: {
      summary:
        "Front-load Wednesday's science project milestones early, pair daily math exam drills with spaced recall, and protect four 40-minute conditioning sessions.",
      totalEstimatedHours: 6.5,
      estimatedCompletionTime: "Friday, 4:30 PM",
      effortScore: 76,
      dailySchedule: [
        {
          day: "Today",
          timeBlock: "09:00 - 10:30",
          focusTitle: "Science Project Data Synthesis & Visuals",
          focusSessions: 3,
          category: "Study",
        },
        {
          day: "Tomorrow",
          timeBlock: "10:00 - 11:15",
          focusTitle: "Math Exam Practice Problems (Unit 4–5)",
          focusSessions: 3,
          category: "Study",
        },
        {
          day: "Wednesday",
          timeBlock: "17:00 - 17:45",
          focusTitle: "Zone-2 Conditioning Run + Mobility",
          focusSessions: 1,
          category: "Health",
        },
        {
          day: "Thursday",
          timeBlock: "14:00 - 15:30",
          focusTitle: "Timed Math Mock Exam & Error Review",
          focusSessions: 3,
          category: "Study",
        },
      ],
      tasks: [
        {
          title: "Complete Science Project Slide Deck & Citations",
          priorityRank: 1,
          estimatedMinutes: 90,
          recommendedSessions: 3,
          quadrant: "urgent_important",
          category: "Study",
          dueLabel: "Wednesday",
          rationale: "Earliest hard deadline with highest grade weight.",
        },
        {
          title: "Solve 25 Timed Math Exam Practice Questions",
          priorityRank: 2,
          estimatedMinutes: 75,
          recommendedSessions: 3,
          quadrant: "important_not_urgent",
          category: "Study",
          dueLabel: "Friday",
          rationale: "Spaced problem-solving prevents Thursday night cramming.",
        },
        {
          title: "Schedule 4x 40-Min Conditioning Workouts",
          priorityRank: 3,
          estimatedMinutes: 40,
          recommendedSessions: 1,
          quadrant: "important_not_urgent",
          category: "Health",
          dueLabel: "This Week",
          rationale: "Sustains mood and memory consolidation during exam prep.",
        },
      ],
    },
    lastDayOptimization: {
      headline: "Peak Focus Morning with Protected Afternoon Recovery",
      estimatedCompletionTime: "5:15 PM",
      exerciseSuggestion: "25-min brisk outdoor walk or light mobility circuit at 3:15 PM to reset prefrontal energy.",
      highPriorityTasks: [
        "Finalize Linear Algebra Exam Practice Set",
        "Submit Organic Chemistry Lab Reflection",
        "Review Algorithm Flashcards (Trees & DP)",
      ],
      schedule: [
        {
          time: "09:00 - 10:15",
          title: "Linear Algebra Exam Practice Set",
          type: "deep_work",
          note: "Highest cognitive load while morning focus is crisp.",
        },
        {
          time: "10:15 - 10:30",
          title: "Screen-Free Hydration Break",
          type: "break",
          note: "Step away from desk to consolidate problem patterns.",
        },
        {
          time: "10:30 - 11:30",
          title: "Organic Chemistry Lab Reflection",
          type: "deep_work",
          note: "Draft conclusions and double-check lab calculations.",
        },
        {
          time: "15:15 - 15:45",
          title: "Mid-Afternoon Movement & Sunlight",
          type: "exercise",
          note: "Prevents late-day slump before evening wrap-up.",
        },
      ],
      breakStrategy: "50m focus / 10m screen-free recovery blocks to keep burnout risk Low.",
    },
    coachMessages: [
      {
        id: "c-1",
        role: "assistant",
        content:
          "Welcome back, Alex. You have 2 high-leverage tasks remaining today and a 9-day execution streak. Finishing both today pushes your Productivity Score past 95. What should we tackle first?",
        timestamp: "08:55 AM",
      },
    ],
  };
}

class LocalStorageAdapter implements StorageAdapter {
  private safeRead<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private safeWrite<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota errors gracefully
    }
  }

  getUsers(): StoredUserRecord[] {
    const users = this.safeRead<StoredUserRecord[]>(USERS_KEY, []);
    if (users.length === 0) {
      const seeded = [DEMO_USER_PROFILE];
      this.saveUsers(seeded);
      return seeded;
    }
    if (!users.some((u) => u.id === DEMO_USER_ID)) {
      const updated = [DEMO_USER_PROFILE, ...users];
      this.saveUsers(updated);
      return updated;
    }
    return users;
  }

  saveUsers(users: StoredUserRecord[]): void {
    this.safeWrite(USERS_KEY, users);
  }

  getCurrentUserId(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(SESSION_KEY);
  }

  setCurrentUserId(userId: string | null): void {
    if (typeof window === "undefined") return;
    if (userId) {
      window.localStorage.setItem(SESSION_KEY, userId);
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }

  getWorkspace(userId: string): WorkspaceState {
    const key = `${WORKSPACE_PREFIX}${userId}`;
    const existing = this.safeRead<WorkspaceState | null>(key, null);
    if (existing) return existing;
    const seed = createSeedWorkspace();
    this.saveWorkspace(userId, seed);
    return seed;
  }

  saveWorkspace(userId: string, state: WorkspaceState): void {
    this.safeWrite(`${WORKSPACE_PREFIX}${userId}`, state);
  }

  resetWorkspace(userId: string): WorkspaceState {
    const seed = createSeedWorkspace();
    this.saveWorkspace(userId, seed);
    return seed;
  }
}

export const storageService: StorageAdapter = new LocalStorageAdapter();

export function toPublicUserProfile(record: StoredUserRecord): UserProfile {
  const { passwordHash: _ignored, ...profile } = record;
  return profile;
}
