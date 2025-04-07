"use client";

import { useContext } from "react";
import { EditorContext } from "@/contexts/editor-provider";
import AllEditor from "./_editors/all-editor";
import ProduceEditor from "./_editors/produce-editor";
import ReviseEditor from "./_editors/revise-editor";
import ReorderEditor from "./_editors/reorder-editor";

export default function Editor() {
  const { lock } = useContext(EditorContext);

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
    <section className="h-full flex-1 overflow-auto">{renderEditor()}</section>
  );
}
