import { Editor } from "@tiptap/react";
import { Button, ButtonProps } from "../../tiptap-ui-primitive/button";
import { useEffect, useState } from "react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { Minus, Plus } from "lucide-react";

interface FontSizeDropdownProps extends Omit<ButtonProps, "type"> {
  editor: Editor | null;
}

const BUTTON_SIZE = "16";
const DEFAULT_FONT_SIZE = "12";

export default function FontSizeInput({
  editor: providedEditor,
}: FontSizeDropdownProps) {
  const editor = useTiptapEditor(providedEditor);
  const [inputSize, setInputSize] = useState(DEFAULT_FONT_SIZE);
  const [trueSize, setTrueSize] = useState(DEFAULT_FONT_SIZE);

  function handleInput() {
    if (!editor) return;
    try {
      const newSize = parseInt(inputSize);
      if (isNaN(newSize)) return setInputSize(trueSize);
      setTrueSize(newSize.toString());
    } catch {
      setInputSize(trueSize);
    }
  }

  function handleDecrease() {
    try {
      const newSize = parseInt(trueSize) - 1;
      setInputSize(newSize.toString());
      setTrueSize(newSize.toString());
    } catch {
      setInputSize(trueSize);
    }
  }

  function handleIncrease() {
    try {
      const newSize = parseInt(trueSize) + 1;
      setInputSize(newSize.toString());
      setTrueSize(newSize.toString());
    } catch {
      setInputSize(trueSize);
    }
  }

  useEffect(() => {
    editor?.chain().focus().setFontSize(`${trueSize}pt`).run();
    // don't set mark if only changing size of selected text
    if (editor?.state.selection.empty) {
      editor?.commands.setMark("textStyle", { fontSize: `${trueSize}pt` });
    }
  }, [trueSize, editor]);

  useEffect(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    let fontSize: string | undefined = undefined;
    let differentSizes = false;

    editor.state.doc.nodesBetween(from - 1, to, (node) => {
      if (!node.marks) return;
      const mark = node.marks.find((mark) => mark.attrs.fontSize);
      if (node.content.content.length > 0) return;
      if (!mark) {
        fontSize = DEFAULT_FONT_SIZE;
        return;
      }
      const size = mark.attrs.fontSize.replace("pt", "") ?? DEFAULT_FONT_SIZE;
      if (fontSize === undefined) fontSize = size;
      else if (fontSize !== size) differentSizes = true;
    });

    if (differentSizes) return;

    setInputSize(fontSize ?? DEFAULT_FONT_SIZE);
    setTrueSize(fontSize ?? DEFAULT_FONT_SIZE);
  }, [editor?.state.selection, editor]);

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleDecrease} data-style="ghost">
        <Minus size={BUTTON_SIZE} className="tiptap-button-icon" />
      </Button>
      <input
        type="text"
        className="py-0.5 border-1 rounded-md w-[5ch] text-sm text-center"
        inputMode="numeric"
        value={inputSize}
        onChange={(e) => setInputSize(e.target.value)}
        onBlur={handleInput}
      />
      <Button onClick={handleIncrease} data-style="ghost">
        <Plus size={BUTTON_SIZE} className="tiptap-button-icon" />
      </Button>
    </div>
  );
}
