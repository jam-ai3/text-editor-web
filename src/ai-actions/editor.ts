"use client";

import Gemini, { parseGeminiOutput } from "./gemini/functions";
import { EditorContextType } from "@/contexts/editor-provider";
import { Editor } from "@tiptap/core";
import { v4 } from "uuid";
import {
  acceptAutocomplete,
  acceptChanges,
  acceptIncoming,
  insertAutocomplete,
  insertChangesAtSelection,
  rejectAutocomplete,
  rejectChanges,
  rejectIncoming,
} from "@/components/editor/extensions";
import {
  findAutocompleteBlock,
  findChangeBlock,
} from "@/components/editor/helpers";
import { MAX_CONTEXT_LENGTH } from "@/lib/constants";
import { ParaphraseLanguageType } from "@/lib/types";

export async function processKeydown(
  event: KeyboardEvent,
  context: EditorContextType
) {
  if (event.key === "Tab") {
    tabOnKeydown(event, context);
  } else if (event.key === "Escape") {
    escapeOnKeydown(event, context);
  } else if (
    context.selectedChange ||
    context.autocomplete ||
    context.aiResponseLoading
  ) {
    event.preventDefault();
  } else if (event.metaKey) {
    await metakeyOnKeydown(event, context);
  }
}

// Tab handlers

function tabOnKeydown(event: KeyboardEvent, context: EditorContextType) {
  if (context.autocomplete !== null) {
    handleAcceptAutocomplete(event, context);
  } else if (context.selectedChange !== null) {
    handleAcceptChange(event, context);
  } else {
    event.preventDefault();
    context.editor?.commands.insertContent("\t");
  }
}

export function handleAccept(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  handleAcceptAutocomplete(event, context);
  handleAcceptChange(event, context);
}

export function handleAcceptAutocomplete(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  if (!context.editor || context.autocomplete === null) return;
  event?.preventDefault();
  acceptAutocomplete(
    context.editor,
    context.autocomplete.pos,
    context.autocomplete.text
  );
  context.setAutocomplete(null);
}

export function handleAcceptChange(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  if (!context.editor || context.selectedChange === null) return;
  event?.preventDefault();
  const { current, incoming, pos, id } = context.selectedChange;
  if (current.length === 0) {
    acceptIncoming(context.editor, pos, incoming);
  } else {
    acceptChanges(context.editor, pos, current, incoming);
  }
  const newChanges = context.changes.filter((change) => change.id !== id);
  context.setChanges(newChanges);
  context.setSelectedChange(newChanges.length > 0 ? newChanges[0] : null);
}

// Escape handlers

function escapeOnKeydown(event: KeyboardEvent, context: EditorContextType) {
  if (!context.editor) return;
  if (context.selectedChange) handleRejectChange(event, context);
  if (context.autocomplete) handleRejectAutocomplete(event, context);
}

export function handleReject(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  handleRejectAutocomplete(event, context);
  handleRejectChange(event, context);
}

export function handleRejectAutocomplete(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  if (!context.editor || context.autocomplete === null) return;
  event?.preventDefault();
  rejectAutocomplete(
    context.editor,
    context.autocomplete.pos,
    context.autocomplete.text
  );
  context.setAutocomplete(null);
}

export function handleRejectChange(
  event: KeyboardEvent | undefined,
  context: EditorContextType
) {
  if (!context.editor || context.selectedChange === null) return;
  event?.preventDefault();
  const { current, incoming, pos, id } = context.selectedChange;
  if (current.length === 0) {
    rejectIncoming(context.editor, pos, incoming);
  } else {
    rejectChanges(context.editor, pos, current);
  }
  const newChanges = context.changes.filter((change) => change.id !== id);
  context.setChanges(newChanges);
  context.setSelectedChange(newChanges.length > 0 ? newChanges[0] : null);
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
    case "z":
      handleUndo(context);
      break;
  }
}

async function handleAutocomplete(context: EditorContextType) {
  if (!context.editor) return;
  try {
    context.setAiResponseLoading(true);
    const position = context.editor.state.selection.from;
    const content =
      context.editor
        .getText()
        .substring(0, position)
        .split(" ")
        .slice(-MAX_CONTEXT_LENGTH)
        .join(" ") +
      "[ADD NEW CONTENT HERE]" +
      context.editor
        .getText()
        .substring(position)
        .split(" ")
        .slice(0, MAX_CONTEXT_LENGTH)
        .join(" ");
    const value = await Gemini.getAutocomplete(content);
    const { improved } = parseGeminiOutput(value);
    insertAutocomplete(context.editor, improved);
    context.setAutocomplete({ text: improved, pos: position });
  } catch (error) {
    console.error(error);
  } finally {
    context.setAiResponseLoading(false);
  }
}

export async function handleShorten(context: EditorContextType) {
  if (!context.editor) return;
  try {
    context.setAiResponseLoading(true);
    const { selected, before, after, from } = getContext(context.editor);
    const response = await Gemini.getShortened(before, after, selected);
    showDiff(context, response);
    context.editor.chain().focus().setTextSelection({ from, to: from }).run();
  } catch (error) {
    console.error(error);
  } finally {
    context.setAiResponseLoading(false);
  }
}

export async function handleLengthen(context: EditorContextType) {
  if (!context.editor) return;
  try {
    context.setAiResponseLoading(true);
    const { selected, before, after, from } = getContext(context.editor);
    const response = await Gemini.getLengthened(before, after, selected);
    showDiff(context, response);
    context.editor.chain().focus().setTextSelection({ from, to: from }).run();
  } catch (error) {
    console.error(error);
  } finally {
    context.setAiResponseLoading(false);
  }
}

export async function handleGrammar(context: EditorContextType) {
  if (!context.editor) return;
  try {
    context.setAiResponseLoading(true);
    const { selected, from } = getContext(context.editor);
    const response = await Gemini.getGrammar(selected);
    showDiff(context, response);
    context.editor.chain().focus().setTextSelection({ from, to: from }).run();
  } catch (error) {
    console.error(error);
  } finally {
    context.setAiResponseLoading(false);
  }
}

export async function handleReorder(context: EditorContextType) {
  if (!context.editor) return;
  try {
    context.setAiResponseLoading(true);
    const { selected } = getContext(context.editor);
    const response = await Gemini.reorderSentences(selected);
    showDiff(context, response);
  } catch (error) {
    console.error(error);
  } finally {
    context.setAiResponseLoading(false);
  }
}

export async function handleParaphrase(
  context: EditorContextType,
  style: ParaphraseLanguageType
) {
  if (!context.editor) return;
  try {
    context.setAiResponseLoading(true);
    const { selected } = getContext(context.editor);
    const response = await Gemini.paraphrase(selected, style);
    showDiff(context, response);
  } catch (error) {
    console.error(error);
  } finally {
    context.setAiResponseLoading(false);
  }
}

function handleUndo(context: EditorContextType) {
  if (!context.editor) return;
  const changeBlock = findChangeBlock(context.editor);
  const autocompleteBlock = findAutocompleteBlock(context.editor);
  if (changeBlock || autocompleteBlock) context.editor.commands.undo();
}

function showDiff(context: EditorContextType, newText: string) {
  if (!context.editor) return;
  const { improved: incoming, reasoning } = parseGeminiOutput(newText);
  context.setEditorType("edit");

  // If incoming is empty or no reasoning, show no changes
  if (incoming.trim().length === 0 || !reasoning) {
    context.setChanges([
      {
        id: "",
        current: "",
        incoming: "",
        pos: 0,
        reasoning: "No changes were made.",
      },
    ]);
    return;
  }

  // Otherwise, show diff
  const id = v4();
  const { current, from } = insertChangesAtSelection(
    context.editor,
    incoming,
    id
  );
  const newChange = {
    id,
    current,
    incoming,
    pos: from,
    reasoning,
  };
  context.setChanges((prev) => [...prev, newChange]);
  context.setSelectedChange(newChange);
}

// Generic Gemini and helper functions

export function getContext(editor: Editor) {
  const { from, to } = editor.state.selection;
  const selected = editor.getText().substring(from - 1, to);
  const before = editor
    .getText()
    .substring(0, from)
    .split(" ")
    .slice(-MAX_CONTEXT_LENGTH)
    .join(" ");
  const after = editor
    .getText()
    .substring(to)
    .split(" ")
    .slice(0, MAX_CONTEXT_LENGTH)
    .join(" ");
  return { selected, before, after, from, to };
}
