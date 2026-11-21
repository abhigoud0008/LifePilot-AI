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
}
