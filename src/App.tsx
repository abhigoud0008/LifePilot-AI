/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { AICoachView } from "./components/AICoachView";
import { AnalyticsAndBurnoutView } from "./components/AnalyticsAndBurnoutView";
import { AppShell } from "./components/AppShell";
import { AuthView } from "./components/AuthView";
import { CapybaraModal } from "./components/CapybaraModal";
import { DashboardOverview } from "./components/DashboardOverview";
import { FocusAndAchievementsView } from "./components/FocusAndAchievementsView";
import { GoalsView } from "./components/GoalsView";
import { LandingPage } from "./components/LandingPage";
import { SettingsView } from "./components/SettingsView";
import { TasksAndPlannerView } from "./components/TasksAndPlannerView";
import { useLifePilotState } from "./hooks/useLifePilotState";

export default function App() {
  const state = useLifePilotState();
  const [optimizeTrigger, setOptimizeTrigger] = useState(0);

  if (state.view === "landing") {
    return (
      <LandingPage
        onGetStarted={() => state.setView("register")}
        onLoginClick={() => state.setView("login")}
        onLaunchDemo={state.loginWithDemo}
      />
    );
  }

  if (state.view === "login" || state.view === "register" || !state.currentUser) {
    return (
      <AuthView
        mode={state.view === "register" ? "register" : "login"}
        onSwitchMode={(nextMode) => state.setView(nextMode)}
        onBackToLanding={() => state.setView("landing")}
        onLogin={state.login}
        onRegister={state.register}
        onDemoLogin={state.loginWithDemo}
      />
    );
  }

  const pendingTasksCount = state.workspace.tasks.filter((t) => !t.completed).length;

  return (
    <>
      <AppShell
        activeSection={state.section}
        onSelectSection={state.setSection}
        user={state.currentUser}
        productivityScore={state.metrics.productivityScore}
        capybaraUnlocked={state.metrics.capybaraModeUnlocked}
        capybaraThemeActive={state.capybaraThemeActive}
        onOpenCapybara={() => state.setCapybaraModalOpen(true)}
        onQuickOptimize={() => {
          state.setSection("dashboard");
          setOptimizeTrigger((c) => c + 1);
        }}
        onLogout={state.logout}
      >
        {state.section === "dashboard" && (
          <DashboardOverview
            userName={state.currentUser.name}
            metrics={state.metrics}
            tasks={state.workspace.tasks}
            burnout={state.burnoutAssessment}
            burnoutInput={state.workspace.burnoutInput}
            weeklyAnalytics={state.workspace.weeklyAnalytics}
            dayOptimization={state.workspace.lastDayOptimization}
            onSaveDayOptimization={state.setLastDayOptimization}
            onToggleTask={state.toggleTask}
            onNavigate={state.setSection}
            externalOptimizeTrigger={optimizeTrigger}
          />
        )}

        {state.section === "tasks" && (
          <TasksAndPlannerView
            tasks={state.workspace.tasks}
            userRole={state.currentUser.role}
            lastPlan={state.workspace.lastPlan}
            onSavePlan={state.setLastPlan}
            onApplyPlan={state.applyAIPlanToTasks}
            onToggleTask={state.toggleTask}
            onAddTask={state.addTask}
            onMoveQuadrant={state.moveTaskQuadrant}
            onDeleteTask={state.deleteTask}
          />
        )}

        {state.section === "goals" && (
          <GoalsView
            goals={state.workspace.goals}
            onToggleMilestone={state.toggleGoalMilestone}
            onAddGoal={state.addGoal}
          />
        )}

        {state.section === "analytics" && (
          <AnalyticsAndBurnoutView
            tasks={state.workspace.tasks}
            goals={state.workspace.goals}
            weeklyAnalytics={state.workspace.weeklyAnalytics}
            monthlyPerformance={state.workspace.monthlyPerformance}
            burnoutInput={state.workspace.burnoutInput}
            burnout={state.burnoutAssessment}
            onUpdateBurnout={state.updateBurnoutInput}
          />
        )}

        {state.section === "focus" && (
          <FocusAndAchievementsView
            tasks={state.workspace.tasks}
            sessions={state.workspace.sessions}
            achievements={state.achievements}
            onLogSession={state.logFocusSession}
          />
        )}

        {state.section === "coach" && (
          <AICoachView
            messages={state.workspace.coachMessages}
            userContext={{
              name: state.currentUser.name,
              productivityScore: state.metrics.productivityScore,
              streakDays: state.currentUser.streakDays,
              pendingTasksCount,
              burnoutRisk: state.burnoutAssessment.riskLevel,
            }}
            onAppendMessages={state.appendCoachMessages}
            onNavigate={state.setSection}
          />
        )}

        {state.section === "settings" && (
          <SettingsView
            user={state.currentUser}
            onUpdateSettings={state.updateUserSettings}
            onResetDemo={state.resetDemoWorkspace}
            onLogout={state.logout}
          />
        )}
      </AppShell>

      <CapybaraModal
        open={state.capybaraModalOpen}
        score={state.metrics.productivityScore}
        unlocked={state.metrics.capybaraModeUnlocked}
        themeActive={state.capybaraThemeActive}
        onToggleTheme={() => state.setCapybaraThemeActive((prev) => !prev)}
        onClose={() => state.setCapybaraModalOpen(false)}
      />
    </>
  );
}
