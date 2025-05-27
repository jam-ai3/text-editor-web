import { useContext, useEffect, useState } from "react";
import { Button } from "../../tiptap-ui-primitive/button";
import { EditorContext } from "@/contexts/editor-provider";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_LINE_HEIGHT = "1.15";
type LineHeight = "1" | "1.15" | "1.5" | "2";

export default function LineHeightInput() {
  const context = useContext(EditorContext);
  const editor = useTiptapEditor(context.editor);
  const [lineHeight, setLineHeight] = useState<LineHeight>(DEFAULT_LINE_HEIGHT);

  function handleLineHeightChange(height: LineHeight) {
    setLineHeight(height);
    editor?.chain().focus().setLineHeight(height).run();
    if (editor?.state.selection.empty) {
      editor?.commands.setLineHeight(height);
    }
  }

  useEffect(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    let height: string | undefined = undefined;
    let differentHeights = false;

    editor.state.doc.nodesBetween(from, to, (node) => {
      // Only check block-level nodes like paragraph
      if (
        !editor.schema.nodes.paragraph?.name ||
        node.type.name !== "paragraph"
      )
        return;

      const nodeLineHeight = node.attrs?.lineHeight;

      if (height === undefined) {
        height = nodeLineHeight ?? DEFAULT_LINE_HEIGHT;
      } else if (height !== nodeLineHeight) {
        differentHeights = true;
      }
    });

    if (!differentHeights) {
      setLineHeight(height ?? DEFAULT_LINE_HEIGHT);
    }
  }, [editor?.state.selection, editor]);

  // useEffect(() => {
  //   if (!editor) return;
  //   const { from, to } = editor.state.selection;
  //   let height: string | undefined = undefined;
  //   let differentHeights = false;

  //   editor.state.doc.nodesBetween(from - 1, to, (node) => {
  //     if (!node.marks) return;
  //     const mark = node.marks.find((mark) => mark.attrs.lineHeight);
  //     if (node.content.content.length > 0) return;
  //     if (!mark) {
  //       height = DEFAULT_LINE_HEIGHT;
  //       return;
  //     }
  //     const lineHeight = mark.attrs.lineHeight ?? DEFAULT_LINE_HEIGHT;
  //     if (height === undefined) height = lineHeight;
  //     else if (height !== lineHeight) differentHeights = true;
  //   });

  //   if (differentHeights) return;

  //   setLineHeight(height ?? DEFAULT_LINE_HEIGHT);
  // }, [editor?.state.selection, editor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          role="button"
          tabIndex={-1}
          aria-label="Font family"
          tooltip="Font Family"
        >
          <span className="w-[4ch] text-sm text-start">{lineHeight}</span>
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <LineHeightOption
            label="Single"
            height="1"
            onClick={handleLineHeightChange}
            selected={lineHeight}
          />
          <LineHeightOption
            label="1.15"
            height="1.15"
            onClick={handleLineHeightChange}
            selected={lineHeight}
          />
          <LineHeightOption
            label="1.5"
            height="1.5"
            onClick={handleLineHeightChange}
            selected={lineHeight}
          />
          <LineHeightOption
            label="Double"
            height="2"
            onClick={handleLineHeightChange}
            selected={lineHeight}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type LineHeightOptionProps = {
  label: string;
  height: LineHeight;
  onClick: (height: LineHeight) => void;
  selected: LineHeight;
};

function LineHeightOption({
  label,
  height,
  onClick,
  selected,
}: LineHeightOptionProps) {
  return (
    <DropdownMenuItem asChild>
      <Button
        type="button"
        data-style="ghost"
        role="button"
        onClick={onClick.bind(null, height)}
        data-size="small"
        className="flex justify-between items-center w-full"
      >
        <span className="w-full text-start">{label}</span>
        {height === selected && <CheckIcon className="tiptap-button-icon" />}
      </Button>
    </DropdownMenuItem>
  );
}
