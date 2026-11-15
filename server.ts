import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = "gemini-4-hydrogen";

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function getErrorStatus(err: unknown): { status: number; message: string } {
  const message = err instanceof Error ? err.message : "Unexpected AI service error.";
  if (message.includes("GEMINI_API_KEY")) {
    return { status: 503, message: "Gemini API key is missing in Settings > Secrets." };
  }
  if (message.includes("403") || message.includes("PERMISSION_DENIED") || message.includes("API_KEY_INVALID")) {
    return { status: 403, message: "Gemini API key is invalid or unauthorized. Please verify it in Settings > Secrets." };
  }
  if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
    return { status: 429, message: "Gemini API rate limit reached. Please retry in a moment." };
  }
  return { status: 500, message };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, model: MODEL_NAME });
  });

  // 1. AI Planner Endpoint
  app.post("/api/ai/plan", async (req, res) => {
    try {
      const { prompt, currentRole } = req.body as { prompt?: string; currentRole?: string };
      if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
        res.status(400).json({ error: "Please describe your goals, deadlines, or priorities (at least 5 characters)." });
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `User context: ${currentRole || "Student / Young Professional"}.\nUser goals and deadlines: "${prompt.trim()}"\n\nGenerate a structured action plan with a daily schedule, priority-ranked tasks, estimated effort, recommended Pomodoro focus sessions, and Eisenhower matrix classification.`,
        config: {
          systemInstruction:
            "You are LifePilot AI, an executive Chief of Staff for students and young professionals. Turn messy goals and deadlines into a crisp, realistic, actionable plan. Keep titles concise, durations realistic, and classifications accurate.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "One-sentence executive summary of the strategy." },
              totalEstimatedHours: { type: Type.NUMBER, description: "Total hours across the plan." },
              estimatedCompletionTime: {
                type: Type.STRING,
                description: "Target overall completion milestone, e.g. Friday, 4:30 PM",
              },
              effortScore: {
                type: Type.INTEGER,
                description: "Effort intensity score from 1 to 100 based on workload and deadlines",
              },
              dailySchedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING, description: "Day label such as Today, Tomorrow, Wednesday" },
                    timeBlock: { type: Type.STRING, description: "Time slot such as 09:00 - 10:30" },
                    focusTitle: { type: Type.STRING, description: "Concise activity title" },
                    focusSessions: { type: Type.INTEGER, description: "Recommended 25-min Pomodoro sessions" },
                    category: { type: Type.STRING, description: "Study, Deep Work, Health, or Admin" },
                  },
                  required: ["day", "timeBlock", "focusTitle", "focusSessions", "category"],
                },
              },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    priorityRank: { type: Type.INTEGER, description: "1 is highest priority" },
                    estimatedMinutes: { type: Type.INTEGER },
                    recommendedSessions: { type: Type.INTEGER },
                    quadrant: {
                      type: Type.STRING,
                      description: "One of: urgent_important, important_not_urgent, urgent_not_important, neither",
                    },
                    category: { type: Type.STRING, description: "Study, Work, Health, or Personal" },
                    dueLabel: { type: Type.STRING, description: "Relative deadline like Tomorrow, Wednesday, Friday" },
                    rationale: { type: Type.STRING, description: "Brief reason why this priority rank was assigned" },
                  },
                  required: [
                    "title",
                    "priorityRank",
                    "estimatedMinutes",
                    "recommendedSessions",
                    "quadrant",
                    "category",
                    "dueLabel",
                    "rationale",
                  ],
                },
              },
            },
            required: [
              "summary",
              "totalEstimatedHours",
              "estimatedCompletionTime",
              "effortScore",
              "dailySchedule",
              "tasks",
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      res.json(parsed);
    } catch (err) {
      const { status, message } = getErrorStatus(err);
      res.status(status).json({ error: message });
    }
  });

  // 2. AI Day Optimizer Endpoint (Hackathon differentiator)
  app.post("/api/ai/optimize-day", async (req, res) => {
    try {
      const { tasks, burnoutRisk, energyLevel, sleepHours } = req.body as {
        tasks?: Array<{ title: string; quadrant: string; estimatedMinutes: number; completed: boolean }>;
        burnoutRisk?: string;
        energyLevel?: string;
        sleepHours?: number;
      };

      const pendingTasks = (tasks || []).filter((t) => !t.completed).slice(0, 10);
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Pending tasks: ${JSON.stringify(pendingTasks)}\nCurrent burnout risk: ${burnoutRisk || "Low"}\nSleep last night: ${sleepHours ?? 7.5} hours\nEnergy level: ${energyLevel || "Balanced"}\n\nBuild an optimal morning-to-evening schedule for today with break timings, a tailored exercise/movement suggestion, top high-priority tasks, and estimated completion time.`,
        config: {
          systemInstruction:
            "You are LifePilot AI Day Optimizer. Design a realistic, burnout-safe daily schedule anchored around ultradian focus rhythms, explicit break timings, physical movement, and clear completion estimates.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING, description: "Short inspiring headline for today's game plan" },
              estimatedCompletionTime: { type: Type.STRING, description: "Target finish time e.g. 5:45 PM" },
              exerciseSuggestion: { type: Type.STRING, description: "Specific 20-40 min exercise/recovery recommendation" },
              highPriorityTasks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Top 3 tasks to conquer first",
              },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING, description: "e.g. 08:30 - 09:45" },
                    title: { type: Type.STRING },
                    type: { type: Type.STRING, description: "deep_work, break, exercise, or admin" },
                    note: { type: Type.STRING },
                  },
                  required: ["time", "title", "type", "note"],
                },
              },
              breakStrategy: { type: Type.STRING, description: "Summary of break cadence based on burnout risk" },
            },
            required: [
              "headline",
              "estimatedCompletionTime",
              "exerciseSuggestion",
              "highPriorityTasks",
              "schedule",
              "breakStrategy",
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      res.json(parsed);
    } catch (err) {
      const { status, message } = getErrorStatus(err);
      res.status(status).json({ error: message });
    }
  });

  // 3. AI Coach Chatbot Endpoint
  app.post("/api/ai/coach", async (req, res) => {
    try {
      const { messages, userContext } = req.body as {
        messages?: Array<{ role: "user" | "assistant"; content: string }>;
        userContext?: {
          name?: string;
          productivityScore?: number;
          streakDays?: number;
          pendingTasksCount?: number;
          burnoutRisk?: string;
        };
      };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Message history cannot be empty." });
        return;
      }

      const ai = getGeminiClient();
      const latestUserMessage = messages[messages.length - 1].content;
      const conversationSummary = messages
        .slice(-6, -1)
        .map((m) => `${m.role === "user" ? "User" : "Coach"}: ${m.content}`)
        .join("\n");

      const ctx = userContext || {};
      const systemInstruction = `You are LifePilot AI Coach, a calm, sharp, practical personal productivity mentor for students and young professionals.
User snapshot: Name=${ctx.name || "Alex"}, Productivity Score=${ctx.productivityScore ?? 91}/100, Streak=${ctx.streakDays ?? 9} days, Pending Tasks=${ctx.pendingTasksCount ?? 4}, Burnout Risk=${ctx.burnoutRisk || "Low"}.
Give concise, high-signal advice on daily planning, studying, beating procrastination, balancing workload, and preventing burnout. Use short paragraphs or crisp bullet points (no markdown tables).`;

      const prompt = conversationSummary
        ? `Previous conversation:\n${conversationSummary}\n\nUser's new message: ${latestUserMessage}`
        : latestUserMessage;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: { systemInstruction },
      });

      res.json({ reply: (response.text ?? "").trim() });
    } catch (err) {
      const { status, message } = getErrorStatus(err);
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LifePilot AI server listening on http://localhost:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
