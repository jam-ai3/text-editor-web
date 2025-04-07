"use client";

import { EditorContextType } from "@/contexts/editor-provider";
import { chatWithoutTextSelection, chatWithTextSelection } from "./gemini";

export function chatWithSelection(context: EditorContextType) {
  if (!context.editor) return;
  const { from, to } = context.editor.state.selection;
  const selection = context.editor.getText().substring(from - 1, to);
  context.toggleIsChatOpen(true);
  context.setChatSelection(selection);
  context.editor.chain().focus().setTextSelection({ from, to: from }).run();
}

export async function handleChat(message: string, context: EditorContextType) {
  if (!context.editor) return;
  context.setChatHistory((prev) => [
    ...prev,
    { content: message, role: "user" },
  ]);
  const chatSelection = context.chatSelection;
  if (chatSelection) {
    const res = await chatWithTextSelection(chatSelection, message);
    context.setChatHistory((prev) => [...prev, { content: res, role: "ai" }]);
  } else {
    const res = await chatWithoutTextSelection(message);
    context.setChatHistory((prev) => [...prev, { content: res, role: "ai" }]);
  }
}
