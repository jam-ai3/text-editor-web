import { Editor } from "@tiptap/react";
import { ButtonProps } from "../../tiptap-ui-primitive/button";
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
      // editor.chain().focus().setFontSize(`${newSize}px`).run();
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
    editor?.chain().focus().setFontSize(`${trueSize}px`).run();
  }, [trueSize]);

  useEffect(() => {
    if (!editor) return;

    const { state } = editor;
    const { from, to } = state.selection;

    let fontSize = DEFAULT_FONT_SIZE;

    state.doc.nodesBetween(from, to, (node) => {
      if (node.marks) {
        const fontSizeMark = node.marks.find(
          (mark) => mark.type.name === "textStyle" && mark.attrs.fontSize
        );
        if (fontSizeMark) {
          fontSize =
            parseInt(fontSizeMark.attrs.fontSize)?.toString() ??
            DEFAULT_FONT_SIZE;
          return false; // stop early if found
        }
      }
      return true;
    });

    setInputSize(fontSize);
    setTrueSize(fontSize);
  }, [editor?.state.selection]);

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleDecrease}>
        <Minus size={BUTTON_SIZE} />
      </button>
      <input
        type="text"
        className="py-0.5 border-1 rounded-md w-[5ch] text-sm text-center"
        inputMode="numeric"
        value={inputSize}
        onChange={(e) => setInputSize(e.target.value)}
        onBlur={handleInput}
      />
      <button onClick={handleIncrease}>
        <Plus size={BUTTON_SIZE} />
      </button>
    </div>
  );
}
