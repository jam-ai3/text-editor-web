"use client";

import Editor from "@/components/editor/editor";
import { EditorContext } from "@/contexts/editor-provider";
import { useContext, useEffect } from "react";
import { processKeydown } from "./_actions/editor";

export default function AllEditor() {
  const { editor } = useContext(EditorContext);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (editor) processKeydown(event, editor);
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [editor]);

  if (!editor) return null;

  return <Editor editor={editor} />;
}
