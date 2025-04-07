"use client";

import {
  getAutocomplete,
  getGrammar,
  getLengthened,
  getShortened,
} from "./gemini";
import { EditorContextType } from "@/contexts/editor-provider";

export async function processKeydown(
  event: KeyboardEvent,
  context: EditorContextType
) {
  if (event.key === "Tab") {
    TabHandler.onKeydown(event, context);
  } else if (event.key === "Escape") {
    EscapeHandler.onKeydown(event, context);
  } else if (context.additions.diff || context.additions.suggestion) {
    event.preventDefault();
  } else if (event.metaKey) {
    await MetakeyHandler.onKeydown(event, context);
  }
}

const TabHandler = {
  onKeydown(event: KeyboardEvent, context: EditorContextType) {
    this.handleAcceptAutocomplete(event, context);
    this.handleAcceptDiff(event, context);
  },

  handleAcceptAutocomplete(event: KeyboardEvent, context: EditorContextType) {
    if (!context.editor || !context.additions.suggestion) return;
    event.preventDefault();
    const start = context.additions.suggestion.pos;
    const end = start + context.additions.suggestion.content.length;
    context.editor
      .chain()
      .focus()
      .setTextSelection({ from: start, to: end })
      .setColor("#000")
      .setTextSelection({ from: end, to: end })
      .run();
    context.setAdditions({ ...context.additions, suggestion: null });
  },

  handleAcceptDiff(event: KeyboardEvent, context: EditorContextType) {
    if (!context.editor || !context.additions.diff) return;
    event.preventDefault();
    const { current, incoming, pos: start } = context.additions.diff;
    const currentEnd = start + current.length;
    const incomingEnd = start + incoming.length;
    context.editor
      .chain()
      .focus()
      .deleteRange({ from: start, to: currentEnd })
      .setTextSelection({ from: start, to: incomingEnd })
      .setColor("#000")
      .setTextSelection({ from: incomingEnd, to: incomingEnd })
      .run();
    context.setAdditions({ ...context.additions, diff: null });
  },
};

const EscapeHandler = {
  onKeydown(event: KeyboardEvent, context: EditorContextType) {
    if (!context.editor) return;
    if (context.additions.diff) this.handleRejectDiff(event, context);
    if (context.additions.suggestion)
      this.handleRejectAutocomplete(event, context);
  },

  handleRejectAutocomplete(event: KeyboardEvent, context: EditorContextType) {
    if (!context.editor || !context.additions.suggestion) return;
    event.preventDefault();
    const start = context.additions.suggestion.pos;
    const end = start + context.additions.suggestion.content.length;
    context.editor.chain().focus().deleteRange({ from: start, to: end }).run();
    context.setAdditions({ ...context.additions, suggestion: null });
  },

  handleRejectDiff(event: KeyboardEvent, context: EditorContextType) {
    if (!context.editor || !context.additions.diff) return;
    event.preventDefault();
    const start = context.additions.diff.pos;
    const currentLength = context.additions.diff.current.length;
    const incomingLength = context.additions.diff.incoming.length;
    context.editor
      .chain()
      .focus()
      .deleteRange({
        from: start + currentLength,
        to: start + currentLength + incomingLength,
      })
      .setTextSelection({ from: start, to: start + currentLength })
      .setColor("#000")
      .setTextSelection({
        from: start + currentLength,
        to: start + currentLength,
      })
      .run();
    context.setAdditions({ ...context.additions, diff: null });
  },
};

export const MetakeyHandler = {
  MAX_TOKEN_COUNT: 100,

  async onKeydown(event: KeyboardEvent, context: EditorContextType) {
    switch (event.key) {
      case "k":
        event.preventDefault();
        await MetakeyHandler.handleAutocomplete(context);
        break;
    }
  },

  async handleAutocomplete(context: EditorContextType) {
    if (!context.editor) return;
    const position = context.editor.state.selection.from;
    const content = context.editor
      .getText()
      .substring(0, position)
      .split(" ")
      .slice(-this.MAX_TOKEN_COUNT)
      .join(" ");
    const value = await getAutocomplete(content, position);
    context.editor
      .chain()
      .focus()
      .insertContent(value)
      .setTextSelection({ from: position, to: position + value.length })
      .setColor("#777")
      .setTextSelection({ from: position, to: position })
      .deleteRange({
        from: position + value.length - 1,
        to: position + value.length,
      }) // removes newline
      .run();
    context.setAdditions((prev) => ({
      ...prev,
      suggestion: { content: value, pos: position },
    }));
  },

  async handleShorten(context: EditorContextType) {
    if (!context.editor) return;
    const { from, to } = context.editor.state.selection;
    const content = context.editor.getText().substring(from, to);
    const response = await getShortened("", content);
    showDiff(context, response);
    context.editor.chain().focus().setTextSelection({ from, to: from }).run();
  },

  async handleLengthen(context: EditorContextType) {
    if (!context.editor) return;
    const { from, to } = context.editor.state.selection;
    const content = context.editor.getText().substring(from, to);
    const response = await getLengthened("", content);
    showDiff(context, response);
    context.editor.chain().focus().setTextSelection({ from, to: from }).run();
  },

  async handleGrammar(context: EditorContextType) {
    if (!context.editor) return;
    const { from, to } = context.editor.state.selection;
    const content = context.editor.getText().substring(from, to);
    const response = await getGrammar("", content);
    showDiff(context, response);
    context.editor.chain().focus().setTextSelection({ from, to: from }).run();
  },
};

type GeminiOutput = {
  improved: string;
};

function parseGeminiOutput(output: string): GeminiOutput {
  try {
    return JSON.parse(
      output.replaceAll("```json", "").replaceAll("```", "")
    ) as GeminiOutput;
  } catch (error) {
    console.error("Failed to parse Gemini output:", error);
    return { improved: "" };
  }
}

function showDiff(context: EditorContextType, newText: string) {
  if (!context.editor) return;
  const incoming = parseGeminiOutput(newText).improved;
  const { from, to } = context.editor.state.selection;
  context.editor.chain().focus().setColor("#d00").run();
  context.editor
    .chain()
    .focus()
    .insertContentAt(to, incoming)
    .setTextSelection({ from: to, to: to + incoming.length })
    .setColor("#0b0")
    .setTextSelection({ from, to: from })
    .run();
  const current = context.editor.getText().substring(from, to);
  context.setAdditions((prev) => ({
    ...prev,
    diff: { current, incoming, pos: from },
  }));
}
