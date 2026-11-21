import type { Request, Response } from "express";

export default function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  return res.status(200).json({
    ok: true,
    model: process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim())
  });
}
