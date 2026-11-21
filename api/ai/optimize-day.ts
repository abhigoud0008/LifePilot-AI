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
}
