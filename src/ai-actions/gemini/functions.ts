import { ParaphraseLanguageType } from "@/lib/types";
import { updateAnalytics } from "./analytics";
import { promptFlash, promptFlashLite } from "./gemini";
import GeminiPrompts from "./prompts";

const Gemini = {
  getAutocomplete: async (content: string) => {
    const prompt = GeminiPrompts.autocompletePrompt(content);
    updateAnalytics("autocomplete");
    return await promptFlashLite(prompt);
  },

  getShortened: async (
    contextBefore: string,
    contextAfter: string,
    selected: string
  ) => {
    const prompt = GeminiPrompts.shortenPrompt(
      contextBefore,
      contextAfter,
      selected
    );
    updateAnalytics("shorten");
    return await promptFlash(prompt);
  },

  getLengthened: async (
    contextBefore: string,
    contextAfter: string,
    selected: string
  ) => {
    const prompt = GeminiPrompts.lengthenPrompt(
      contextBefore,
      contextAfter,
      selected
    );
    updateAnalytics("lengthen");
    return await promptFlash(prompt);
  },

  getGrammar: async (selected: string, fullDocument: boolean = false) => {
    const prompt = GeminiPrompts.grammarPrompt(selected);
    if (!fullDocument) updateAnalytics("grammar");
    return await promptFlash(prompt);
  },

  checkFullPaperGrammar: async (text: string) => {
    const prompt = GeminiPrompts.checkFullPaperGrammarPrompt(text);
    return await promptFlash(prompt);
  },

  reorderParagraph: async (selected: string) => {
    const prompt = GeminiPrompts.reorderParagraphPrompt(selected);
    updateAnalytics("reorder");
    return await promptFlash(prompt);
  },

  reorderSentences: async (selected: string) => {
    const prompt = GeminiPrompts.reorderSentencesPrompt(selected);
    updateAnalytics("reorder");
    return await promptFlash(prompt);
  },

  getSynonyms: async (
    word: string,
    contextBefore: string,
    contextAfter: string
  ) => {
    const prompt = GeminiPrompts.synonymsPrompt(
      word,
      contextBefore,
      contextAfter
    );
    return await promptFlashLite(prompt);
  },

  paraphrase: async (selected: string, style: ParaphraseLanguageType) => {
    const prompt = GeminiPrompts.paraphrase[style](selected);
    return await promptFlash(prompt);
  },
};

export default Gemini;

export type GeminiOutput = {
  improved: string;
  reasoning: string | null;
};

export function parseGeminiOutput(output: string): GeminiOutput {
  try {
    return JSON.parse(
      output.replaceAll("```json", "").replaceAll("```", "")
    ) as GeminiOutput;
  } catch (error) {
    console.error("Failed to parse Gemini output:", error);
    return { improved: "", reasoning: null };
  }
}

export function parseGeminiSynonymOutput(output: string): string[] {
  try {
    return JSON.parse(output);
  } catch (error) {
    console.error("Failed to parse Gemini output:", error);
    return [];
  }
}
