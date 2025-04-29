"use client";

import {
  getAutocomplete,
  getGrammar,
  getLengthened,
  getShortened,
  reorderSentences,
} from "./gemini";
import { EditorContextType } from "@/contexts/editor-provider";
import { ACCEPT_COLOR, REJECT_COLOR } from "@/lib/constants";
import { Editor } from "@tiptap/core";

export async function processKeydown(
  event: KeyboardEvent,
  context: EditorContextType
) {
  if (event.key === "Tab") {
    tabOnKeydown(event, context);
  } else if (event.key === "Escape") {
    escapeOnKeydown(event, context);
  } else if (context.additions.diff || context.additions.suggestion) {
    event.preventDefault();
  } else if (event.metaKey) {
    await metakeyOnKeydown(event, context);
  }
}

// Tab handlers

function tabOnKeydown(event: KeyboardEvent, context: EditorContextType) {
  if (context.additions.suggestion) {
    handleAcceptAutocomplete(event, context);
  } else if (context.additions.diff) {
    handleAcceptDiff(event, context);
  } else {
    event.preventDefault();
    context.editor?.commands.insertContent("\t");
  }
}

export function handleAcceptChanges(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  handleAcceptAutocomplete(event, context);
  handleAcceptDiff(event, context);
}

export function handleAcceptAutocomplete(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  if (!context.editor || !context.additions.suggestion) return;
  event?.preventDefault();
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
  context.setReasoning(null);
}

export function handleAcceptDiff(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  if (!context.editor || !context.additions.diff) return;
  event?.preventDefault();
  const { current, incoming, pos: start } = context.additions.diff;
  const currentEnd = start + current.length;
  const incomingEnd = start + incoming.length;
  context.editor
    .chain()
    .focus()
    .deleteRange({ from: start, to: currentEnd })
    .setTextSelection({ from: start, to: incomingEnd })
    .unsetHighlight()
    .setTextSelection({ from: incomingEnd + 1, to: incomingEnd + 1 })
    .run();
  context.setAdditions({ ...context.additions, diff: null });
  context.setReasoning(null);
}

// Escape handlers

function escapeOnKeydown(event: KeyboardEvent, context: EditorContextType) {
  if (!context.editor) return;
  if (context.additions.diff) handleRejectDiff(event, context);
  if (context.additions.suggestion) handleRejectAutocomplete(event, context);
}

export function handleRejectChanges(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  handleRejectAutocomplete(event, context);
  handleRejectDiff(event, context);
}

export function handleRejectAutocomplete(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  if (!context.editor || !context.additions.suggestion) return;
  event?.preventDefault();
  const start = context.additions.suggestion.pos;
  const end = start + context.additions.suggestion.content.length;
  context.editor.chain().focus().deleteRange({ from: start, to: end }).run();
  context.setAdditions({ ...context.additions, suggestion: null });
  context.setReasoning(null);
}

export function handleRejectDiff(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  if (!context.editor || !context.additions.diff) return;
  event?.preventDefault();
  const start = context.additions.diff.pos;
  const currentLength = context.additions.diff.current.length;
  const incomingLength = context.additions.diff.incoming.length;
  context.editor
    .chain()
    .focus()
    .deleteRange({
      from: start + currentLength,
      to: start + currentLength + incomingLength + 1,
    })
    .setTextSelection({ from: start, to: start + currentLength })
    .unsetHighlight()
    .setTextSelection({
      from: start + currentLength,
      to: start + currentLength,
    })
    .run();
  context.setAdditions({ ...context.additions, diff: null });
  context.setReasoning(null);
}

// Metakey handlers

async function metakeyOnKeydown(
  event: KeyboardEvent,
  context: EditorContextType
) {
  switch (event.key) {
    case "k":
      event.preventDefault();
      await handleAutocomplete(context);
      break;
  }
}

async function handleAutocomplete(context: EditorContextType) {
  if (!context.editor) return;
  const position = context.editor.state.selection.from;
  const content =
    context.editor
      .getText()
      .substring(0, position)
      .split(" ")
      .slice(-MAX_CONTENT)
      .join(" ") +
    "[ADD NEW CONTENT HERE]" +
    context.editor
      .getText()
      .substring(position)
      .split(" ")
      .slice(0, MAX_CONTENT)
      .join(" ");

  const value = await getAutocomplete(content);
  const { improved, reasoning } = parseGeminiOutput(value);
  if (reasoning) {
    const yPos = getCaretYPosition(context.editor) ?? 0;
    context.setReasoning({ text: reasoning, yPos });
  }
  context.editor
    .chain()
    .focus()
    .insertContent(improved)
    .setTextSelection({ from: position, to: position + improved.length })
    .setColor("#777")
    .setTextSelection({ from: position, to: position })
    .deleteRange({
      from: position + improved.length - 1,
      to: position + improved.length,
    }) // removes newline
    .run();
  context.setAdditions((prev) => ({
    ...prev,
    suggestion: { content: improved, pos: position },
  }));
}

export async function handleShorten(context: EditorContextType) {
  if (!context.editor) return;
  const { selected, before, after, from } = getContext(context.editor);
  const response = await getShortened(before, after, selected);
  showDiff(context, response);
  context.editor.chain().focus().setTextSelection({ from, to: from }).run();
}

export async function handleLengthen(context: EditorContextType) {
  if (!context.editor) return;
  const { selected, before, after, from } = getContext(context.editor);
  const response = await getLengthened(before, after, selected);
  showDiff(context, response);
  context.editor.chain().focus().setTextSelection({ from, to: from }).run();
}

export async function handleGrammar(context: EditorContextType) {
  if (!context.editor) return;
  const { selected, from } = getContext(context.editor);
  const response = await getGrammar(selected);
  showDiff(context, response);
  context.editor.chain().focus().setTextSelection({ from, to: from }).run();
}

export async function handleReorder(context: EditorContextType) {
  if (!context.editor) return;
  const { selected } = getContext(context.editor);
  const response = await reorderSentences(selected);
  showDiff(context, response);
}

// Generic Gemini and helper functions

type GeminiOutput = {
  improved: string;
  reasoning: string | null;
};

function parseGeminiOutput(output: string): GeminiOutput {
  try {
    return JSON.parse(
      output.replaceAll("```json", "").replaceAll("```", "")
    ) as GeminiOutput;
  } catch (error) {
    console.error("Failed to parse Gemini output:", error);
    return { improved: "", reasoning: null };
  }
}

function showDiff(context: EditorContextType, newText: string) {
  if (!context.editor) return;
  const { improved: incoming, reasoning } = parseGeminiOutput(newText);
  if (reasoning) {
    const yPos = getCaretYPosition(context.editor) ?? 0;
    context.setReasoning({ text: reasoning, yPos });
  }
  const { from, to } = context.editor.state.selection;
  context.editor.chain().focus().toggleHighlight({ color: REJECT_COLOR }).run();
  context.editor
    .chain()
    .focus()
    .insertContentAt(to, incoming)
    .setTextSelection({ from: to, to: to + incoming.length })
    .toggleHighlight({ color: ACCEPT_COLOR })
    .setTextSelection({ from, to: from })
    .run();
  const current = context.editor.getText().substring(from, to);
  context.setAdditions((prev) => ({
    ...prev,
    diff: { current, incoming, pos: from },
  }));
}

const MAX_CONTENT = 100;

function getContext(editor: Editor) {
  const { from, to } = editor.state.selection;
  const selected = editor.getText().substring(from, to);
  const before = editor
    .getText()
    .substring(0, from)
    .split(" ")
    .slice(-MAX_CONTENT)
    .join(" ");
  const after = editor
    .getText()
    .substring(to)
    .split(" ")
    .slice(0, MAX_CONTENT)
    .join(" ");
  return { selected, before, after, from, to };
}

function getCaretYPosition(editor: Editor) {
  if (!editor) return null;
  const { state, view } = editor;
  const pos = state.selection.$anchor.pos;

  let coords;
  try {
    coords = view.coordsAtPos(pos);
  } catch (e) {
    console.error("Failed to get caret coordinates:", e);
    return null;
  }

  if (!coords) return null;
  const editorElement = view.dom;
  const editorRect = editorElement.getBoundingClientRect();
  const yInsideEditor = coords.top - editorRect.top + editorElement.scrollTop;
  return yInsideEditor;
}
