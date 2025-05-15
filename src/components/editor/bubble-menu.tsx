"use client";

import { ComponentType, useContext } from "react";
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
// import { Button } from "../ui/button";

export default function PopupMenu() {
  const context = useContext(EditorContext);

  if (!context.editor) {
    return null;
  }

  return (
    <BubbleMenu
      pluginKey="bubbleMenuText"
      className="flex flex-col bg-secondary border-2 rounded-md max-w-max"
      tippyOptions={{ duration: 150 }}
      editor={context.editor}
      shouldShow={({ from, to }) => {
        // only show if range is selected.
        // other args: context.editor, view, state, oldState
        return from !== to;
      }}
    >
      <div className="flex items-center border-b-2">
        <MenuButton
          onClick={handleShorten.bind(null, context)}
          icon={Minus}
          description="Shorten"
        />
        <MenuButton
          onClick={handleLengthen.bind(null, context)}
          icon={Plus}
          description="Lengthen"
        />
        <MenuButton
          onClick={handleGrammar.bind(null, context)}
          icon={Edit}
          description="Grammar"
        />
        <MenuButton
          onClick={handleReorder.bind(null, context)}
          icon={ArrowUpDown}
          description="Reorder"
        />
      </div>
      {/* <div className="flex flex-col">
        <textarea
          placeholder="Custom Prompt"
          className="m-0 p-2 text-xs resize-none"
        />
        <Button size="sm">Submit</Button>
      </div> */}
    </BubbleMenu>
  );
}

type MenuButtonProps = {
  onClick: () => void;
  icon: ComponentType<{ size: number }>;
  description: string;
};

function MenuButton({ onClick, icon: Icon, description }: MenuButtonProps) {
  const { aiResponseLoading } = useContext(EditorContext);

  return (
    <div className="relative flex-1">
      <button
        disabled={aiResponseLoading}
        className="flex justify-center items-center disabled:opacity-50 p-2 hover:bg-border w-full disabled:cursor-not-allowed menu-btn"
        onClick={onClick}
      >
        <Icon size={MENU_BUTTON_SIZE} />
      </button>
      <div className="hidden top-[120%] left-[50%] absolute bg-primary px-2 border-2 rounded-md translate-x-[-50%] menu-btn-description">
        <span className="text-background text-sm">{description}</span>
      </div>
    </div>
  );
}
