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
};

export default Gemini;
