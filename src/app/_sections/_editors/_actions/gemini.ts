"use server";

import { promptFlash, promptFlashLite } from "@/lib/gemini";

const autocompletePrompt_ = (content: string, pos: number) =>
  `You are an academic writing assistant. Generate clear, concise and well-structured ` +
  `completions in the same tone as the input text. Prioritize coherence and logical flow. ` +
  `Respond only with the next sentence or phrase and nothing else.` +
  `The cursor is at position ${pos}` +
  `Here is the partial text of an academic paper. Predict the next sentence or phrase. ` +
  `${content}`;

export async function getAutocomplete(content: string, pos: number) {
  const prompt = autocompletePrompt_(content, pos);
  return await promptFlashLite(prompt);
}

const revisionPrompt = (context: string, selected: string) =>
  `You are an academic writing assistant. Generate clear, concise and well-structured text. ` +
  `I will provide you with the context of a paper and the selected text. ` +
  `Your task is to revise the selected text, checking spelling, grammar, and style. ` +
  `Respond only with the replacement text and nothing else. ` +
  `Context: ${context}\n\nSelection: ${selected}`;

export async function getRevision(context: string, selected: string) {
  const prompt = revisionPrompt(context, selected);
  return await promptFlash(prompt);
}
