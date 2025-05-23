import { Spacer } from "@/components/tiptap/tiptap-ui-primitive/spacer";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap/tiptap-ui-primitive/toolbar";
import { HighlightPopover } from "@/components/tiptap/tiptap-ui/highlight-popover";
import { LinkPopover } from "@/components/tiptap/tiptap-ui/link-popover";
import { ListDropdownMenu } from "@/components/tiptap/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap/tiptap-ui/mark-button";
import { NodeButton } from "@/components/tiptap/tiptap-ui/node-button";
import { TextAlignButton } from "@/components/tiptap/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap/tiptap-ui/undo-redo-button";
import FontSizeInput from "../../tiptap/tiptap-ui/font-size-input/font-size-input";
import ExportButton from "./export-btn";
import AutocompleteButton from "./autocomplete-button";
import FontFamilyInput from "@/components/tiptap/tiptap-ui/font-family-input/font-family-input";

export default function MainToolbarContent() {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <NodeButton type="codeBlock" />
        <NodeButton type="blockquote" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <FontSizeInput />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <FontFamilyInput />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        <HighlightPopover />
        <LinkPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <Spacer />

      <ToolbarGroup>
        <AutocompleteButton />
        <ExportButton />
      </ToolbarGroup>
    </>
  );
}
