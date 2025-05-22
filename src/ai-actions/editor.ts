"use client";

import Gemini, {
  parseGeminiImproved,
  parseGeminiParaphrase,
} from "./gemini/functions";
import { EditorContextType } from "@/contexts/editor-provider";
import { Editor } from "@tiptap/core";
import { v4 } from "uuid";
import {
  acceptAutocomplete,
  acceptChanges,
  acceptIncoming,
  insertAutocomplete,
  insertChangesAt,
  rejectAutocomplete,
  rejectChanges,
  rejectIncoming,
} from "@/components/editor/extensions";
import { updateChanges } from "@/components/editor/helpers";
import { MAX_CONTEXT_LENGTH } from "@/lib/constants";
import { ParaphraseLanguageType } from "@/lib/types";
import { isError } from "@/lib/utils";

export async function processKeydown(
  event: KeyboardEvent,
  context: EditorContextType
) {
  if (event.key === "Tab") {
    tabOnKeydown(event, context);
  } else if (event.key === "Escape") {
    escapeOnKeydown(event, context);
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
  const index = context.changes.findIndex((change) => change.id === id);
  if (index === -1 || newChanges.length === 0)
    return context.setSelectedChange(null);
  if (index === newChanges.length)
    return context.setSelectedChange(newChanges[0]);
  context.setSelectedChange(newChanges[index]);
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
  const index = context.changes.findIndex((change) => change.id === id);
  if (index === -1 || newChanges.length === 0)
    return context.setSelectedChange(null);
  if (index === newChanges.length)
    return context.setSelectedChange(newChanges[0]);
  context.setSelectedChange(newChanges[index]);
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

export async function handleAutocomplete(context: EditorContextType) {
  if (
    !context.editor ||
    context.changes.length !== 0 ||
    context.autocomplete !== null
  )
    return;
  try {
    context.setAutocompleteLoading(true);
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
    const { improved } = parseGeminiImproved(value);
    insertAutocomplete(context.editor, improved, position);
    context.setAutocomplete({ text: improved, pos: position });
  } catch (error) {
    console.error(error);
  } finally {
    context.setAutocompleteLoading(false);
  }
}

export async function handleShorten(context: EditorContextType) {
  if (!context.editor) return;
  try {
    context.setAiResponseLoading(true);
    const { selected, before, after, from } = getContext(context.editor);
    const response = await Gemini.getShortened(before, after, selected);
    const { improved } = parseGeminiImproved(response);
    showDiff(context, selected, improved, from);
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
    const { improved } = parseGeminiImproved(response);
    showDiff(context, selected, improved, from);
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
    const { improved } = parseGeminiImproved(response);
    showDiff(context, selected, improved, from);
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
    const { selected, from } = getContext(context.editor);
    const response = await Gemini.reorderSentences(selected);
    const { improved } = parseGeminiImproved(response);
    showDiff(context, selected, improved, from);
  } catch (error) {
    console.error(error);
  } finally {
    context.setAiResponseLoading(false);
  }
}

export async function handleParaphrase(
  context: EditorContextType,
  style: ParaphraseLanguageType,
  customTone?: string
) {
  if (!context.editor) return;
  try {
    context.setAiResponseLoading(true);
    const { selected, from } = getContext(context.editor);
    const res = await Gemini.paraphrase(selected, style, customTone);
    if (isError(res)) return; // TODO: handle error
    const { paraphrased } = parseGeminiParaphrase(res);
    showDiff(context, selected, paraphrased, from);
  } catch (error) {
    console.error(error);
  } finally {
    context.setAiResponseLoading(false);
  }
}

function handleUndo(context: EditorContextType) {
  updateChanges(context);
}

function showDiff(
  context: EditorContextType,
  current: string,
  incoming: string,
  pos: number
) {
  if (!context.editor) return;
  context.setEditorType("edit");

  // If incoming is empty or no reasoning, show no changes
  if (incoming.trim().length === 0) return context.setNoChanges(true);

  // Otherwise, show diff
  const id = v4();
  insertChangesAt(context.editor, current, incoming, id, pos);
  const newChange = {
    id,
    current,
    incoming,
    pos,
    reasoning: "",
  };

  context.setNoChanges(false);
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
