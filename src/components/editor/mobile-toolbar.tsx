import { Button } from "@/components/tiptap/tiptap-ui-primitive/button";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap/tiptap-ui-primitive/toolbar";
import { HighlightContent } from "@/components/tiptap/tiptap-ui/highlight-popover";
import { LinkContent } from "@/components/tiptap/tiptap-ui/link-popover";
import { ArrowLeftIcon, HighlighterIcon, LinkIcon } from "lucide-react";

export default function MobileToolbarContent({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) {
  return (
    <>
      <ToolbarGroup>
        <Button data-style="ghost" onClick={onBack}>
          <ArrowLeftIcon className="tiptap-button-icon" />
          {type === "highlighter" ? (
            <HighlighterIcon className="tiptap-button-icon" />
          ) : (
            <LinkIcon className="tiptap-button-icon" />
          )}
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      {type === "highlighter" ? <HighlightContent /> : <LinkContent />}
    </>
  );
}
