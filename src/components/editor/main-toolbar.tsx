import { Spacer } from "@/components/tiptap/tiptap-ui-primitive/spacer";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap/tiptap-ui-primitive/toolbar";
import { HeadingDropdownMenu } from "@/components/tiptap/tiptap-ui/heading-dropdown-menu";
import { HighlightPopover } from "@/components/tiptap/tiptap-ui/highlight-popover";
// import { ImageUploadButton } from "@/components/tiptap/tiptap-ui/image-upload-button";
import { LinkPopover } from "@/components/tiptap/tiptap-ui/link-popover";
import { ListDropdownMenu } from "@/components/tiptap/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap/tiptap-ui/mark-button";
import { NodeButton } from "@/components/tiptap/tiptap-ui/node-button";
import { TextAlignButton } from "@/components/tiptap/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap/tiptap-ui/undo-redo-button";
import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";
import { EDIT_PANEL_WIDTH } from "./edit/edit-panel";
import FontSizeInput from "../tiptap/tiptap-ui/font-size-input/font-size-input";
// import { ThemeToggle } from "./theme-toggle";

export default function MainToolbarContent() {
  const { editorType, editor } = useContext(EditorContext);

  return (
    <>
      <Spacer />

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
        <FontSizeInput editor={editor} />
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

      {/* <ToolbarSeparator />
      <ToolbarGroup>
      <ImageUploadButton text="Add" />
      </ToolbarGroup> */}

      <Spacer />

      {editorType === "edit" && <div style={{ width: EDIT_PANEL_WIDTH }} />}
    </>
  );
}
