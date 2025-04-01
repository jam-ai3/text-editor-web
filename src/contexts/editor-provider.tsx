"use client";

import { editorConfig } from "@/components/editor/config";
import { LockOption } from "@/types";
import { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { createContext, ReactNode, useState } from "react";

type EditorContextType = {
  editor: Editor | null;
  lock: LockOption;
  setLock: (lock: LockOption) => void;
};

export const EditorContext = createContext<EditorContextType>({
  editor: null,
  lock: "all",
  setLock: () => {},
});

type EditorProviderProps = {
  children: ReactNode;
};

export default function EditorProvider({ children }: EditorProviderProps) {
  const editor = useEditor(editorConfig);
  const [lock, setLock] = useState<LockOption>("all");

  return (
    <EditorContext.Provider value={{ editor, lock, setLock }}>
      {children}
    </EditorContext.Provider>
  );
}
