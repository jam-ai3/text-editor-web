"use client";

import { ComponentType, useContext, useEffect, useState } from "react";
import { BubbleMenu } from "@tiptap/react";

import {
  ArrowLeftRight,
  ArrowUpDown,
  Edit,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { EditorContext } from "@/contexts/editor-provider";
import { MAX_CONTEXT_LENGTH, MENU_BUTTON_SIZE } from "@/lib/constants";
import {
  handleGrammar,
  handleLengthen,
  handleReorder,
  handleShorten,
} from "@/ai-actions/editor";
import Gemini, {
  parseGeminiSynonymOutput,
} from "@/ai-actions/gemini/functions";
import { capitalized, cn } from "@/lib/utils";

export default function PopupMenu() {
  const context = useContext(EditorContext);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [synonymsLoading, setSynonymsLoading] = useState(false);

  useEffect(() => {
    setSynonyms([]);
  }, [context.editor?.state.selection]);

  if (!context.editor) {
    return null;
  }

  const fullText = context.editor.getText();
  const { from, to } = context.editor.state.selection;
  const selected = fullText.substring(from - 1, to).trim();
  const isOneWord = selected.split(" ").length === 1;

  async function handleSynonyms() {
    setSynonymsLoading(true);
    try {
      const startIndex = Math.max(0, from - MAX_CONTEXT_LENGTH);
      const endIndex = Math.min(fullText.length, to + MAX_CONTEXT_LENGTH);
      const contextBefore = fullText.substring(startIndex, from - 1);
      const contextAfter = fullText.substring(to, endIndex);
      const output = await Gemini.getSynonyms(
        selected,
        contextBefore,
        contextAfter
      );
      const parsed = parseGeminiSynonymOutput(output);
      setSynonyms(parsed);
    } finally {
      setSynonymsLoading(false);
    }
  }

  function handleSelectSynonym(synonym: string) {
    context.editor
      ?.chain()
      .focus()
      .deleteSelection()
      .insertContent(synonym)
      .setTextSelection({
        from: from + synonym.length,
        to: from + synonym.length,
      })
      .run();
    setSynonyms([]);
  }

  return (
    <BubbleMenu
      pluginKey="bubbleMenuText"
      className="flex flex-col bg-secondary border-2 rounded-md max-w-max"
      tippyOptions={{ duration: 150 }}
      editor={context.editor}
      shouldShow={({ from, to }) => from !== to}
    >
      <div
        className={cn("flex items-center", synonyms.length > 0 && "border-b-2")}
      >
        {context.aiResponseLoading ? (
          <div className="flex items-center gap-2 px-2">
            <span className="text-muted-foreground text-sm">Generating</span>
            <Loader2 className="text-muted-foreground animate-spin" size={16} />
          </div>
        ) : (
          <>
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
            {isOneWord && (
              <MenuButton
                disabled={synonymsLoading || synonyms.length > 0}
                onClick={handleSynonyms}
                icon={ArrowLeftRight}
                description="Synonyms"
              />
            )}
          </>
        )}
      </div>
      <div className="flex flex-col max-h-[56px] overflow-y-auto">
        {synonyms.map((synonym, i) => (
          <button
            key={i}
            className={cn(
              i !== 0 && "border-t-2",
              "px-2 text-start hover:bg-border"
            )}
            onClick={handleSelectSynonym.bind(null, synonym)}
          >
            <span>{capitalized(synonym)}</span>
          </button>
        ))}
      </div>
    </BubbleMenu>
  );
}

type MenuButtonProps = {
  onClick: () => void;
  icon: ComponentType<{ size: number }>;
  description: string;
  disabled?: boolean;
};

function MenuButton({
  onClick,
  icon: Icon,
  description,
  disabled,
}: MenuButtonProps) {
  const { aiResponseLoading } = useContext(EditorContext);

  return (
    <div className="relative flex-1">
      <button
        disabled={aiResponseLoading || disabled}
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
