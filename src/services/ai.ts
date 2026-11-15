import type {
  AIDayOptimization,
  AIPlanResult,
  Task,
} from "../types";

async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : `Request failed with status ${response.status}`
    );
  }
  return data as TResponse;
}

export async function generateAIPlan(
  prompt: string,
  currentRole?: string
): Promise<AIPlanResult> {
  return postJson<AIPlanResult>("/api/ai/plan", { prompt, currentRole });
}

export async function optimizeDayWithAI(params: {
  tasks: Task[];
  burnoutRisk: string;
  energyLevel: string;
  sleepHours: number;
}): Promise<AIDayOptimization> {
  return postJson<AIDayOptimization>("/api/ai/optimize-day", params);
}

export async function sendCoachMessage(params: {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  userContext: {
    name: string;
    productivityScore: number;
    streakDays: number;
    pendingTasksCount: number;
    burnoutRisk: string;
  };
}): Promise<{ reply: string }> {
  return postJson<{ reply: string }>("/api/ai/coach", params);
}
