"use client";

import PopupEditor from "@/components/editor/editor";
import { EditorContext } from "@/contexts/editor-provider";
import { useContext, useEffect } from "react";
import { processKeydown, MetakeyHandler } from "../../_actions/editor";
import { Edit, MessageCircle, Minus, Plus } from "lucide-react";
import { ChatHandler } from "../../_actions/chat";
import { MENU_BUTTON_SIZE } from "@/lib/constants";

// TODO: make sure selection isn't too long
export default function AllEditor() {
  const context = useContext(EditorContext);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      processKeydown(event, context);
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [context]);

  if (!context.editor) return null;

  return (
    <PopupEditor editor={context.editor} popupButtons={<PopupButtons />} />
  );
}

function PopupButtons() {
  const context = useContext(EditorContext);

  return (
    <>
      <span className="text-2xl">|</span>
      <button
        className="menu-button"
        onClick={() => MetakeyHandler.handleShorten(context)}
      >
        <Minus size={MENU_BUTTON_SIZE} />
      </button>
      <button
        className="menu-button"
        onClick={() => MetakeyHandler.handleLengthen(context)}
      >
        <Plus size={MENU_BUTTON_SIZE} />
      </button>
      <button
        className="menu-button"
        onClick={() => MetakeyHandler.handleGrammar(context)}
      >
        <Edit size={MENU_BUTTON_SIZE} />
      </button>
      <span className="text-2xl">|</span>
      <button
        className="menu-button"
        onClick={() => ChatHandler.chatWithSelection(context)}
      >
        <MessageCircle size={MENU_BUTTON_SIZE} />
      </button>
    </>
  );
}
