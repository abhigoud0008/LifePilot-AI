import type { BurnoutAssessment, BurnoutInput, BurnoutRiskLevel } from "../types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateBurnoutRisk(input: BurnoutInput): BurnoutAssessment {
  const sleepHours = clamp(input.sleepHours, 2, 12);
  const workloadHours = clamp(input.workloadHours, 0, 18);
  const stressLevel = clamp(input.stressLevel, 1, 10);

  // Sleep deficit contribution (0 - 38 pts)
  const sleepDeficit = Math.max(0, 8 - sleepHours);
  const sleepRisk = clamp((sleepDeficit / 4) * 38, 0, 38);

  // Workload strain contribution (0 - 32 pts)
  const excessWorkload = Math.max(0, workloadHours - 6);
  const workloadRisk = clamp((excessWorkload / 8) * 32, 0, 32);

  // Subjective stress contribution (0 - 30 pts)
  const stressRisk = clamp(((stressLevel - 1) / 9) * 30, 0, 30);

  const riskScore = Math.round(clamp(sleepRisk + workloadRisk + stressRisk, 0, 100));

  let riskLevel: BurnoutRiskLevel = "Low";
  let supportiveLabel = "Balanced Pace";
  if (riskScore >= 65) {
    riskLevel = "High";
    supportiveLabel = "Recovery Recommended";
  } else if (riskScore >= 35) {
    riskLevel = "Moderate";
    supportiveLabel = "Pacing Check-In";
  }

  const warningIndicators: string[] = [];
  if (sleepHours < 6.5) {
    warningIndicators.push(
      `Rest window is tight at ${sleepHours.toFixed(1)}h—aiming for 7.5h restores sharp recall.`
    );
  }
  if (workloadHours >= 10) {
    warningIndicators.push(
      `Heavy ${workloadHours.toFixed(1)}h workload today—protecting breaks keeps quality high.`
    );
  }
  if (stressLevel >= 7) {
    warningIndicators.push(
      `Stress is elevated (${stressLevel}/10)—lighter sprints and breathing space will help.`
    );
  }
  if (warningIndicators.length === 0) {
    warningIndicators.push("All recovery markers are currently within a healthy, sustainable zone.");
  }

  const recommendations: string[] = [];
  if (sleepHours < 7) {
    recommendations.push("Extra sleep tonight: wind down screens 45 minutes earlier to target 7.5–8h.");
  }
  if (workloadHours > 8) {
    recommendations.push("Reduce workload tomorrow by deferring 1–2 lower-priority items.");
  }
  if (stressLevel >= 6) {
    recommendations.push("Take a 20-minute outdoor walk between afternoon focus blocks.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Keep your 90-minute focus / 15-minute recovery cadence.");
    recommendations.push("Stay hydrated and take a 20-minute walk to lock in afternoon clarity.");
  }

  const wellnessInsights: string[] = [
    riskLevel === "High"
      ? "Prioritizing rest tonight will rebound your focus faster than pushing through fatigue."
      : riskLevel === "Moderate"
        ? "Your output is strong—structured micro-breaks will keep afternoon energy steady."
        : "Your sleep-to-workload balance supports peak memory retention and calm execution.",
    `Suggested Pomodoro rhythm today: ${
      riskLevel === "High" ? "20m focus / 10m rest" : riskLevel === "Moderate" ? "25m focus / 7m rest" : "25m focus / 5m rest"
    }.`,
  ];

  return {
    riskScore,
    riskLevel,
    supportiveLabel,
    warningIndicators,
    recommendations,
    wellnessInsights,
  };
}
