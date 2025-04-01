"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function promptFlashLite(prompt: string): Promise<string> {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "Failed to generate response.";
  }
}

export async function promptFlash(prompt: string): Promise<string> {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "Failed to generate response.";
  }
}
