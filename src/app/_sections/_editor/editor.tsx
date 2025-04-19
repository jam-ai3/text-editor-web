"use client";

import { useContext, useEffect, useState } from "react";
import { EditorContext } from "@/contexts/editor-provider";
import AllEditor from "./_editors/all-editor";
import ProduceEditor from "./_editors/produce-editor";
import ReviseEditor from "./_editors/revise-editor";
import ReorderEditor from "./_editors/reorder-editor";
import { saveDocument } from "@/app/_actions/document";

type EditorProps = {
  userId: string;
};

export default function Editor({ userId }: EditorProps) {
  const { lock, editor, title, documentId } = useContext(EditorContext);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // use debounce to save document after 3 seconds of no typing
    if (saveTimer) clearTimeout(saveTimer);
    setSaveTimer(
      setTimeout(() => {
        if (editor) {
          saveDocument(documentId, editor.getHTML(), title, userId);
        }
      }, 3000)
    );
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [editor?.getHTML()]);

  function renderEditor() {
    switch (lock) {
      case "all":
        return <AllEditor />;
      case "produce":
        return <ProduceEditor />;
      case "revise":
        return <ReviseEditor />;
      case "reorder":
        return <ReorderEditor />;
    }
  }

  return (
    <section className="flex-1 h-full overflow-auto">{renderEditor()}</section>
  );
}
