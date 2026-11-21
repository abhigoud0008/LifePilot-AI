// Vercel Node.js Function - no imports from the local Vite/Express startup file.
import { GoogleGenAI, Type } from "@google/genai";
import type { Request, Response } from "express";

const MODEL_NAME = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";

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
    return { status: 503, message: "Gemini API key is missing in Vercel Project Settings > Environment Variables." };
  }
  if (message.includes("403") || message.includes("PERMISSION_DENIED") || message.includes("API_KEY_INVALID")) {
    return { status: 403, message: "Gemini API key is invalid or unauthorized. Please verify it in Vercel Project Settings > Environment Variables." };
  }
  if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
    return { status: 429, message: "Gemini API rate limit reached. Please retry in a moment." };
  }
  return { status: 500, message };
}


export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Expected a JSON request body." });
  }

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
}
