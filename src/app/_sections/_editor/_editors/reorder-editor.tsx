"use client";

import Editor from "@/components/editor/editor";
import { EditorContext } from "@/contexts/editor-provider";
import { MARKS, TOOLS } from "@/lib/constants";
import { YooptaContentValue, YooptaOnChangeOptions } from "@yoopta/editor";
import { useContext } from "react";

export default function ReorderEditor() {
  const { editor, value, setValue } = useContext(EditorContext);

  function handleChange(
    value: YooptaContentValue,
    options: YooptaOnChangeOptions
  ) {
    setValue(value, options);
  }

  if (!editor) return null;

  return (
    <Editor
      editor={editor}
      value={value}
      onChange={handleChange}
      tools={TOOLS}
      marks={MARKS}
    />
  );
}
