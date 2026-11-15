import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEMO_USER_ID,
  DEMO_USER_PROFILE,
  storageService,
  toPublicUserProfile,
} from "../services/storage";
import type {
  AIDayOptimization,
  AIPlanResult,
  AppView,
  BurnoutInput,
  ChatMessage,
  DashboardSection,
  EisenhowerQuadrant,
  FocusSession,
  Goal,
  Task,
  TaskCategory,
  TaskPriority,
  UserProfile,
  WorkspaceState,
} from "../types";
import { evaluateAchievements } from "../utils/achievements";
import { calculateBurnoutRisk } from "../utils/burnout";
import {
  computeDashboardMetrics,
  inferUrgencyAndImportance,
  classifyEisenhowerQuadrant,
} from "../utils/productivity";

export function useLifePilotState() {
  const [view, setView] = useState<AppView>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("autostart") === "1") {
        return "app";
      }
    }
    const existingId = storageService.getCurrentUserId();
    return existingId ? "app" : "landing";
  });

  const [section, setSection] = useState<DashboardSection>("dashboard");

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const users = storageService.getUsers();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("autostart") === "1") {
        const demo = users.find((u) => u.id === DEMO_USER_ID) ?? DEMO_USER_PROFILE;
        storageService.setCurrentUserId(demo.id);
        return toPublicUserProfile(demo);
      }
    }
    const currentId = storageService.getCurrentUserId();
    if (!currentId) return null;
    const found = users.find((u) => u.id === currentId);
    return found ? toPublicUserProfile(found) : null;
  });

  const [workspace, setWorkspace] = useState<WorkspaceState>(() => {
    const activeId = storageService.getCurrentUserId() ?? DEMO_USER_ID;
    return storageService.getWorkspace(activeId);
  });

  const [capybaraModalOpen, setCapybaraModalOpen] = useState(false);
  const [capybaraCelebrate, setCapybaraCelebrate] = useState(false);
  const [capybaraThemeActive, setCapybaraThemeActive] = useState(false);

  // Sync workspace changes to LocalStorage
  useEffect(() => {
    if (!currentUser) return;
    storageService.saveWorkspace(currentUser.id, workspace);
  }, [currentUser, workspace]);

  const metrics = useMemo(() => {
    const streak = currentUser?.streakDays ?? 9;
    const consistency = currentUser?.consistencyRate ?? 92;
    return computeDashboardMetrics(
      workspace.tasks,
      workspace.goals,
      workspace.sessions,
      streak,
      consistency
    );
  }, [workspace.tasks, workspace.goals, workspace.sessions, currentUser]);

  const burnoutAssessment = useMemo(
    () => calculateBurnoutRisk(workspace.burnoutInput),
    [workspace.burnoutInput]
  );

  const achievements = useMemo(
    () =>
      evaluateAchievements({
        tasks: workspace.tasks,
        goals: workspace.goals,
        sessions: workspace.sessions,
        streakDays: currentUser?.streakDays ?? 9,
        productivityScore: metrics.productivityScore,
      }),
    [workspace.tasks, workspace.goals, workspace.sessions, currentUser, metrics.productivityScore]
  );

  // Detect crossing Productivity Score >= 95 to trigger Capybara Mode celebration
  useEffect(() => {
    if (view !== "app" || !currentUser) return;
    if (metrics.productivityScore >= 95 && !currentUser.capybaraUnlockedOnce) {
      setCapybaraCelebrate(true);
      setCapybaraModalOpen(true);
      setCapybaraThemeActive(true);
      const users = storageService.getUsers().map((u) =>
        u.id === currentUser.id ? { ...u, capybaraUnlockedOnce: true } : u
      );
      storageService.saveUsers(users);
      setCurrentUser((prev) => (prev ? { ...prev, capybaraUnlockedOnce: true } : prev));
    }
  }, [metrics.productivityScore, view, currentUser]);

  const loginWithDemo = useCallback(() => {
    const users = storageService.getUsers();
    const demo = users.find((u) => u.id === DEMO_USER_ID) ?? DEMO_USER_PROFILE;
    storageService.setCurrentUserId(demo.id);
    setCurrentUser(toPublicUserProfile(demo));
    setWorkspace(storageService.getWorkspace(demo.id));
    setSection("dashboard");
    setView("app");
  }, []);

  const login = useCallback((email: string, password: string): { ok: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = storageService.getUsers();
    const match = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (!match || match.passwordHash !== password) {
      return { ok: false, error: "Invalid email or password. Try Demo Access or check your credentials." };
    }
    storageService.setCurrentUserId(match.id);
    setCurrentUser(toPublicUserProfile(match));
    setWorkspace(storageService.getWorkspace(match.id));
    setSection("dashboard");
    setView("app");
    return { ok: true };
  }, []);

  const register = useCallback(
    (name: string, email: string, password: string, role: string): { ok: boolean; error?: string } => {
      const trimmedEmail = email.trim().toLowerCase();
      const users = storageService.getUsers();
      if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const newId = `user-${Date.now()}`;
      const newRecord = {
        id: newId,
        name: name.trim(),
        email: trimmedEmail,
        passwordHash: password,
        role: role.trim() || "Student",
        dailyFocusTargetHours: 4,
        streakDays: 3,
        consistencyRate: 84,
        capybaraUnlockedOnce: false,
      };
      storageService.saveUsers([...users, newRecord]);
      storageService.setCurrentUserId(newId);
      setCurrentUser(toPublicUserProfile(newRecord));
      setWorkspace(storageService.getWorkspace(newId));
      setSection("dashboard");
      setView("app");
      return { ok: true };
    },
    []
  );

  const logout = useCallback(() => {
    storageService.setCurrentUserId(null);
    setCurrentUser(null);
    setView("landing");
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      ),
    }));
  }, []);

  const addTask = useCallback(
    (input: {
      title: string;
      dueLabel: string;
      estimatedMinutes: number;
      priority: TaskPriority;
      category: TaskCategory;
      quadrant?: EisenhowerQuadrant;
      isToday?: boolean;
    }) => {
      const inferred = inferUrgencyAndImportance(input.dueLabel, input.priority);
      const quadrant =
        input.quadrant ?? classifyEisenhowerQuadrant(inferred.urgent, inferred.important);
      const newTask: Task = {
        id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: input.title.trim(),
        dueLabel: input.dueLabel.trim() || "Today",
        estimatedMinutes: Math.max(5, input.estimatedMinutes || 30),
        priority: input.priority,
        quadrant,
        category: input.category,
        completed: false,
        isToday: input.isToday ?? true,
        createdAt: new Date().toISOString(),
      };
      setWorkspace((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
      }));
    },
    []
  );

  const moveTaskQuadrant = useCallback((taskId: string, quadrant: EisenhowerQuadrant) => {
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, quadrant } : t)),
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  }, []);

  const applyAIPlanToTasks = useCallback((plan: AIPlanResult) => {
    const validQuadrants: EisenhowerQuadrant[] = [
      "urgent_important",
      "important_not_urgent",
      "urgent_not_important",
      "neither",
    ];
    const generatedTasks: Task[] = plan.tasks.map((pt, index) => {
      const q = validQuadrants.includes(pt.quadrant) ? pt.quadrant : "important_not_urgent";
      const priority: TaskPriority =
        pt.priorityRank <= 2 ? "high" : pt.priorityRank <= 4 ? "medium" : "low";
      const validCategories: TaskCategory[] = ["Study", "Work", "Health", "Personal"];
      const cat = validCategories.includes(pt.category) ? pt.category : "Study";
      return {
        id: `ai-${Date.now()}-${index}`,
        title: pt.title,
        dueLabel: pt.dueLabel || "This Week",
        estimatedMinutes: pt.estimatedMinutes || 45,
        priority,
        quadrant: q,
        category: cat,
        completed: false,
        isToday: pt.priorityRank <= 2 || pt.dueLabel.toLowerCase().includes("today"),
        createdAt: new Date().toISOString(),
      };
    });
    setWorkspace((prev) => ({
      ...prev,
      lastPlan: plan,
      tasks: [...generatedTasks, ...prev.tasks],
    }));
  }, []);

  const setLastPlan = useCallback((plan: AIPlanResult) => {
    setWorkspace((prev) => ({ ...prev, lastPlan: plan }));
  }, []);

  const setLastDayOptimization = useCallback((opt: AIDayOptimization) => {
    setWorkspace((prev) => ({ ...prev, lastDayOptimization: opt }));
  }, []);

  const toggleGoalMilestone = useCallback((goalId: string, milestoneId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              milestones: g.milestones.map((m) =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
              ),
            }
          : g
      ),
    }));
  }, []);

  const addGoal = useCallback(
    (input: { title: string; category: TaskCategory; targetDate: string; milestones: string[] }) => {
      const newGoal: Goal = {
        id: `g-${Date.now()}`,
        title: input.title.trim(),
        category: input.category,
        targetDate: input.targetDate.trim() || "Next Month",
        milestones: input.milestones
          .map((m) => m.trim())
          .filter(Boolean)
          .map((m, i) => ({ id: `gm-${Date.now()}-${i}`, title: m, completed: false })),
      };
      setWorkspace((prev) => ({
        ...prev,
        goals: [newGoal, ...prev.goals],
      }));
    },
    []
  );

  const logFocusSession = useCallback((taskTitle: string, durationMinutes: number) => {
    const session: FocusSession = {
      id: `s-${Date.now()}`,
      taskTitle,
      durationMinutes: Math.max(1, durationMinutes),
      completedAt: new Date().toISOString(),
      hourOfDay: new Date().getHours(),
    };
    setWorkspace((prev) => ({
      ...prev,
      sessions: [session, ...prev.sessions],
    }));
  }, []);

  const updateBurnoutInput = useCallback((next: BurnoutInput) => {
    setWorkspace((prev) => ({
      ...prev,
      burnoutInput: next,
    }));
  }, []);

  const appendCoachMessages = useCallback((msgs: ChatMessage[]) => {
    setWorkspace((prev) => ({
      ...prev,
      coachMessages: [...prev.coachMessages, ...msgs],
    }));
  }, []);

  const updateUserSettings = useCallback(
    (updates: Partial<Pick<UserProfile, "name" | "role" | "dailyFocusTargetHours">>) => {
      if (!currentUser) return;
      const users = storageService.getUsers().map((u) =>
        u.id === currentUser.id ? { ...u, ...updates } : u
      );
      storageService.saveUsers(users);
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
    },
    [currentUser]
  );

  const resetDemoWorkspace = useCallback(() => {
    if (!currentUser) return;
    const reset = storageService.resetWorkspace(currentUser.id);
    setWorkspace(reset);
    setCapybaraThemeActive(false);
    const users = storageService.getUsers().map((u) =>
      u.id === currentUser.id ? { ...u, capybaraUnlockedOnce: false } : u
    );
    storageService.saveUsers(users);
    setCurrentUser((prev) => (prev ? { ...prev, capybaraUnlockedOnce: false } : prev));
  }, [currentUser]);

  return {
    view,
    setView,
    section,
    setSection,
    currentUser,
    workspace,
    metrics,
    burnoutAssessment,
    achievements,
    capybaraModalOpen,
    setCapybaraModalOpen,
    capybaraCelebrate,
    setCapybaraCelebrate,
    capybaraThemeActive,
    setCapybaraThemeActive,
    login,
    register,
    loginWithDemo,
    logout,
    toggleTask,
    addTask,
    moveTaskQuadrant,
    deleteTask,
    applyAIPlanToTasks,
    setLastPlan,
    setLastDayOptimization,
    toggleGoalMilestone,
    addGoal,
    logFocusSession,
    updateBurnoutInput,
    appendCoachMessages,
    updateUserSettings,
    resetDemoWorkspace,
  };
}
