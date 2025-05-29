import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";
import { getWordcount } from "../helpers";

export default function Tools() {
  const context = useContext(EditorContext);
  const text = context.editor?.getText();
  const chars = text?.length ?? 0;
  const charsNoSpace = text?.replace(/\s/g, "")?.length ?? 0;
  const words = getWordcount(text ?? "");

  return (
    <>
      <DropdownMenuItem asChild>
        <div className="flex justify-between gap-8">
          <span>Word Count</span>
          <span>{words}</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <div className="flex justify-between gap-8">
          <span>Characters</span>
          <span>{chars}</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <div className="flex justify-between gap-8">
          <span>Characters (No Space)</span>
          <span>{charsNoSpace}</span>
        </div>
      </DropdownMenuItem>
    </>
  );
}
