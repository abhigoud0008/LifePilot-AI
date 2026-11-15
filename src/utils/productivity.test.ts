import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateProductivityScore,
  classifyEisenhowerQuadrant,
  computeDashboardMetrics,
  getPositiveReinforcementMessage,
  inferUrgencyAndImportance,
} from "./productivity";
import type { FocusSession, Goal, Task } from "../types";

test("classifyEisenhowerQuadrant sorts all 4 combinations accurately", () => {
  assert.equal(classifyEisenhowerQuadrant(true, true), "urgent_important");
  assert.equal(classifyEisenhowerQuadrant(false, true), "important_not_urgent");
  assert.equal(classifyEisenhowerQuadrant(true, false), "urgent_not_important");
  assert.equal(classifyEisenhowerQuadrant(false, false), "neither");
});

test("inferUrgencyAndImportance flags tomorrow high priority as urgent & important", () => {
  const res = inferUrgencyAndImportance("Tomorrow 5 PM", "high");
  assert.deepEqual(res, { urgent: true, important: true });
});

test("calculateProductivityScore respects 0-100 bounds and capybara 95+ threshold", () => {
  const low = calculateProductivityScore({
    tasksCompleted: 0,
    totalTasks: 5,
    focusHours: 0,
    streakDays: 0,
    consistencyRate: 0,
  });
  assert.equal(low, 0);

  const high = calculateProductivityScore({
    tasksCompleted: 9,
    totalTasks: 9,
    focusHours: 5,
    streakDays: 10,
    consistencyRate: 100,
  });
  assert.equal(high, 100);
});

test("computeDashboardMetrics triggers capybaraModeUnlocked at score >= 95", () => {
  const tasks: Task[] = [
    {
      id: "1",
      title: "A",
      dueLabel: "Today",
      estimatedMinutes: 30,
      priority: "high",
      quadrant: "urgent_important",
      category: "Study",
      completed: true,
      isToday: true,
      createdAt: "2026-11-15",
    },
    {
      id: "2",
      title: "B",
      dueLabel: "Today",
      estimatedMinutes: 30,
      priority: "medium",
      quadrant: "important_not_urgent",
      category: "Work",
      completed: true,
      isToday: true,
      createdAt: "2026-11-15",
    },
  ];
  const goals: Goal[] = [
    {
      id: "g1",
      title: "Ace Finals",
      category: "Study",
      targetDate: "2026-12-01",
      milestones: [
        { id: "m1", title: "Step 1", completed: true },
        { id: "m2", title: "Step 2", completed: false },
      ],
    },
  ];
  const sessions: FocusSession[] = [
    { id: "s1", taskTitle: "A", durationMinutes: 300, completedAt: "2026-11-15", hourOfDay: 9 },
  ];

  const metrics = computeDashboardMetrics(tasks, goals, sessions, 9, 92);
  assert.equal(metrics.todayTasksCount, 2);
  assert.equal(metrics.todayCompletedCount, 2);
  assert.equal(metrics.focusHours, 5);
  assert.equal(metrics.goalProgressPercent, 50);
  assert.ok(metrics.productivityScore >= 95);
  assert.equal(metrics.capybaraModeUnlocked, true);
});

test("getPositiveReinforcementMessage returns encouraging tier messages", () => {
  const peak = getPositiveReinforcementMessage(96, 9, 5);
  assert.ok(peak.headline.includes("Peak rhythm"));
  const strong = getPositiveReinforcementMessage(86, 9, 4.5);
  assert.ok(strong.headline.includes("Excellent consistency"));
});
