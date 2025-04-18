"use client";

import { useContext, useEffect } from "react";
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

  useEffect(() => {
    function handleSave(prevTitle: string, prevHtml: string) {
      if (editor && (prevHtml !== editor.getHTML() || prevTitle !== title)) {
        saveDocument(documentId, editor.getHTML(), title, userId);
      }
    }
  }, []);

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
