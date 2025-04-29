"use client";

import { useContext } from "react";
import { BubbleMenu } from "@tiptap/react";

import { ArrowUpDown, Edit, Minus, Plus } from "lucide-react";
import { EditorContext } from "@/contexts/editor-provider";
import { MENU_BUTTON_SIZE } from "@/lib/constants";
import {
  handleGrammar,
  handleLengthen,
  handleReorder,
  handleShorten,
} from "@/_actions/editor";

export default function PopupMenu() {
  const context = useContext(EditorContext);

  if (!context.editor) {
    return null;
  }

  return (
    <BubbleMenu
      pluginKey="bubbleMenuText"
      className="flex items-center gap-2 bg-secondary p-2 border-2 rounded-md max-w-max"
      tippyOptions={{ duration: 150 }}
      editor={context.editor}
      shouldShow={({ from, to }) => {
        // only show if range is selected.
        // other args: context.editor, view, state, oldState
        return from !== to;
      }}
    >
      <button
        className="p-0 w-[24px]"
        onClick={handleLengthen.bind(null, context)}
      >
        <Plus size={MENU_BUTTON_SIZE} />
      </button>
      <button
        className="p-0 w-[24px]"
        onClick={handleShorten.bind(null, context)}
      >
        <Minus size={MENU_BUTTON_SIZE} />
      </button>
      <button
        className="p-0 w-[24px]"
        onClick={handleGrammar.bind(null, context)}
      >
        <Edit size={MENU_BUTTON_SIZE} />
      </button>
      <button
        className="p-0 w-[24px]"
        onClick={handleReorder.bind(null, context)}
      >
        <ArrowUpDown size={MENU_BUTTON_SIZE} />
      </button>
    </BubbleMenu>
  );
}
