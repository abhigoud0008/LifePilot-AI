import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAchievements } from "./achievements";
import type { FocusSession, Goal, Task } from "../types";

test("evaluateAchievements unlocks badges when criteria are met", () => {
  const tasks: Task[] = [
    {
      id: "t1",
      title: "Study",
      dueLabel: "Today",
      estimatedMinutes: 30,
      priority: "high",
      quadrant: "urgent_important",
      category: "Study",
      completed: true,
      isToday: true,
      createdAt: "2026-11-15",
    },
  ];
  const goals: Goal[] = [
    {
      id: "g1",
      title: "Ship Hackathon",
      category: "Work",
      targetDate: "2026-11-20",
      milestones: [{ id: "m1", title: "Launch", completed: true }],
    },
  ];
  const sessions: FocusSession[] = Array.from({ length: 5 }, (_, idx) => ({
    id: `s${idx}`,
    taskTitle: "Study",
    durationMinutes: 25,
    completedAt: "2026-11-15",
    hourOfDay: idx === 0 ? 8 : 14,
  }));

  const badges = evaluateAchievements({
    tasks,
    goals,
    sessions,
    streakDays: 8,
    productivityScore: 96,
  });

  assert.equal(badges.length, 5);
  assert.ok(badges.every((b) => b.unlocked));
});
