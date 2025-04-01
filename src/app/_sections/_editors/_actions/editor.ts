"use client";

import { Editor } from "@tiptap/core";
import { getAutocomplete } from "./gemini";

export async function processKeydown(event: KeyboardEvent, editor: Editor) {
  if (event.key === "Tab") {
    handleAcceptAutocomplete(event, editor);
  } else if (event.metaKey) {
    switch (event.key) {
      case "k":
        await handleAutocomplete(editor);
        break;
    }
  }
}

function handleAcceptAutocomplete(event: KeyboardEvent, editor: Editor) {
  const autocomplete = localStorage.getItem("autocomplete");
  if (!autocomplete) return;
  event.preventDefault();
  const { from } = editor.state.selection;
  const to = from + autocomplete.length;
  editor
    .chain()
    .focus()
    .setTextSelection({ from, to })
    .setColor("#000")
    .setTextSelection({ from: to, to })
    .run();
  localStorage.setItem("autocomplete", "");
}

const MAX_TOKEN_COUNT = 100;

async function handleAutocomplete(editor: Editor) {
  const position = editor.state.selection.from;
  const context = editor
    .getText()
    .substring(0, position)
    .split(" ")
    .slice(-MAX_TOKEN_COUNT)
    .join(" ");
  const value = await getAutocomplete(context, position);
  localStorage.setItem("autocomplete", value);
  editor
    .chain()
    .focus()
    .insertContent(value)
    .setTextSelection({ from: position, to: position + value.length })
    .setColor("#777")
    .setTextSelection({ from: position, to: position })
    .deleteRange({
      from: position + value.length - 1,
      to: position + value.length,
    })
    .run();
}

type Revise = "lengthen" | "shorten" | "grammar";

async function handleRevision(editor: Editor) {}
