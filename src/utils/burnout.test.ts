import test from "node:test";
import assert from "node:assert/strict";
import { calculateBurnoutRisk } from "./burnout";

test("calculateBurnoutRisk returns Low risk for healthy sleep, workload, and stress", () => {
  const result = calculateBurnoutRisk({
    sleepHours: 8,
    workloadHours: 6,
    stressLevel: 2,
  });
  assert.equal(result.riskLevel, "Low");
  assert.equal(result.supportiveLabel, "Balanced Pace");
  assert.ok(result.riskScore < 35);
  assert.ok(result.recommendations.length > 0);
});

test("calculateBurnoutRisk returns Moderate risk for medium strain", () => {
  const result = calculateBurnoutRisk({
    sleepHours: 6.5,
    workloadHours: 9,
    stressLevel: 6,
  });
  assert.equal(result.riskLevel, "Moderate");
  assert.equal(result.supportiveLabel, "Pacing Check-In");
  assert.ok(result.riskScore >= 35 && result.riskScore < 65);
});

test("calculateBurnoutRisk returns High risk with Recovery Recommended label and actionable suggestions", () => {
  const result = calculateBurnoutRisk({
    sleepHours: 4.5,
    workloadHours: 13,
    stressLevel: 9,
  });
  assert.equal(result.riskLevel, "High");
  assert.equal(result.supportiveLabel, "Recovery Recommended");
  assert.ok(result.riskScore >= 65);
  assert.ok(result.recommendations.some((r) => r.toLowerCase().includes("sleep")));
  assert.ok(result.recommendations.some((r) => r.toLowerCase().includes("20-minute") && r.toLowerCase().includes("walk")));
});
