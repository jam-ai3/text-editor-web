import { ParaphraseLanguageType } from "@/lib/types";
import { updateAnalytics } from "./analytics";
import { promptFlash, promptFlashLite } from "./gemini";
import GeminiPrompts from "./prompts";

const Gemini = {
  autocomplete: async (content: string) => {
    const { prompt, parser } = GeminiPrompts.autocomplete(content);
    updateAnalytics("autocomplete");
    const result = await promptFlashLite(prompt);
    return parser(result);
  },

  shorten: async (
    contextBefore: string,
    contextAfter: string,
    selected: string
  ) => {
    const { prompt, parser } = GeminiPrompts.shorten(
      contextBefore,
      contextAfter,
      selected
    );
    updateAnalytics("shorten");
    const result = await promptFlash(prompt);
    return parser(result);
  },

  lengthen: async (
    contextBefore: string,
    contextAfter: string,
    selected: string
  ) => {
    const { prompt, parser } = GeminiPrompts.lengthen(
      contextBefore,
      contextAfter,
      selected
    );
    updateAnalytics("lengthen");
    const result = await promptFlash(prompt);
    return parser(result);
  },

  grammar: async (selected: string) => {
    const { prompt, parser } = GeminiPrompts.grammar(selected);
    updateAnalytics("grammar");
    const result = await promptFlash(prompt);
    return parser(result);
  },

  fullGrammar: async (text: string) => {
    const { prompt, parser } = GeminiPrompts.fullGrammar(text);
    updateAnalytics("grammar-full");
    const result = await promptFlash(prompt);
    return parser(result);
  },

  synonyms: async (
    word: string,
    contextBefore: string,
    contextAfter: string
  ) => {
    const { prompt, parser } = GeminiPrompts.synonyms(
      word,
      contextBefore,
      contextAfter
    );
    updateAnalytics("synonyms");
    const result = await promptFlashLite(prompt);
    return parser(result);
  },

  paraphrase: async (
    selected: string,
    style: ParaphraseLanguageType,
    customTone?: string
  ) => {
    if (style === "custom") {
      if (!customTone) throw new Error("No custom tone provided");
      const { prompt: isValidPrompt, parser: isValidParser } =
        GeminiPrompts.validTone(customTone);
      const isValidResult = await promptFlash(isValidPrompt);
      const isValid = isValidParser(isValidResult);
      if (isValid === "0") throw new Error("Invalid tone provided");
      const { prompt, parser } = GeminiPrompts.paraphrase(selected, customTone);
      updateAnalytics("paraphrase");
      const result = await promptFlash(prompt);
      return parser(result);
    }
    const { prompt, parser } = GeminiPrompts.paraphrase(selected, style);
    updateAnalytics("paraphrase");
    const result = await promptFlash(prompt);
    return parser(result);
  },

  paraphraseParagraph: async (
    paragraph: string,
    style: ParaphraseLanguageType,
    customTone?: string
  ) => {
    if (style === "custom") {
      if (!customTone) throw new Error("No custom tone provided");
      const { prompt: isValidPrompt, parser: isValidParser } =
        GeminiPrompts.validTone(customTone);
      const isValidResult = await promptFlash(isValidPrompt);
      const isValid = isValidParser(isValidResult);
      if (isValid === "0") throw new Error("Invalid tone provided");
      const { prompt, parser } = GeminiPrompts.paraphraseParagraph(
        paragraph,
        customTone
      );
      updateAnalytics("paraphrase");
      const result = await promptFlash(prompt);
      return parser(result);
    }
    const { prompt, parser } = GeminiPrompts.paraphraseParagraph(
      paragraph,
      style
    );
    updateAnalytics("paraphrase");
    const result = await promptFlash(prompt);
    return parser(result);
  },

  resize: async (
    before: string,
    after: string,
    selected: string,
    minLength: number,
    maxLength: number
  ) => {
    const { prompt, parser } = GeminiPrompts.resize(
      before,
      after,
      selected,
      minLength,
      maxLength
    );
    updateAnalytics("resize");
    const result = await promptFlash(prompt);
    return parser(result);
  },

  fluidity: async (before: string, after: string, selected: string) => {
    const { prompt, parser } = GeminiPrompts.fluidity(before, after, selected);
    updateAnalytics("fluidity");
    const result = await promptFlash(prompt);
    return parser(result);
  },

  reorderSentences: async (selected: string) => {
    const { prompt, parser } = GeminiPrompts.reorderSentences(selected);
    updateAnalytics("reorder");
    const result = await promptFlash(prompt);
    return parser(result);
  },
};

export default Gemini;

export type GeminiImproved = {
  improved: string;
  reasoning: string | null;
};
