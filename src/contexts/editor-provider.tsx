"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Editor, useEditor } from "@tiptap/react";
import { EditorAdditions, EditorType, Reasoning } from "@/lib/types";
import { Document } from "@prisma/client";
import { saveDocument } from "@/_actions/document";
import editorConfig from "@/components/editor/editor-config";

export type EditorContextType = {
  editor: Editor | null;
  editorType: EditorType;
  setEditorType: Dispatch<SetStateAction<EditorType>>;
  aiResponseLoading: boolean;
  setAiResponseLoading: Dispatch<SetStateAction<boolean>>;
  additions: EditorAdditions;
  setAdditions: Dispatch<SetStateAction<EditorAdditions>>;
  noChanges: number | null;
  setNoChanges: Dispatch<SetStateAction<number | null>>;
  reasoning: Reasoning | null;
  setReasoning: Dispatch<SetStateAction<Reasoning | null>>;
  document: Document;
  setDocument: Dispatch<SetStateAction<Document>>;
  saveStatus: SaveStatus;
};

export const EditorContext = createContext<EditorContextType>({
  editor: null,
  editorType: "produce",
  setEditorType: () => {},
  aiResponseLoading: false,
  setAiResponseLoading: () => {},
  additions: {
    diff: null,
    suggestion: null,
  },
  setAdditions: () => {},
  noChanges: null,
  setNoChanges: () => {},
  reasoning: null,
  setReasoning: () => {},
  document: {
    id: "",
    title: "",
    content: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "",
  },
  setDocument: () => {},
  saveStatus: "success",
});

type EditorProviderProps = {
  children: ReactNode;
  document: Document;
  userId: string;
};

type SaveStatus = "success" | "error" | "pending";

export default function EditorProvider({
  children,
  document,
  userId,
}: EditorProviderProps) {
  const [editorType, setEditorType] = useState<EditorType>("produce");
  const [additions, setAdditions] = useState<EditorAdditions>({
    diff: null,
    suggestion: null,
  });
  const additionsRef = useRef(additions);
  const [reasoning, setReasoning] = useState<Reasoning | null>(null);
  const [noChanges, setNoChanges] = useState<number | null>(null);
  const [doc, setDocument] = useState<Document>(document);
  const editor = useEditor(editorConfig(document.content, additionsRef));
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("success");
  const [aiResponseLoading, setAiResponseLoading] = useState(false);

  useEffect(() => {
    additionsRef.current = additions;
  }, [additions]);

  useEffect(() => {
    // use debounce to save document after 2 seconds of no typing
    if (saveTimer) clearTimeout(saveTimer);
    setSaveTimer(
      setTimeout(() => {
        if (!editor) return;
        setSaveStatus("pending");
        saveDocument(document.id, doc.title, editor.getHTML(), userId)
          .then(() => setSaveStatus("success"))
          .catch(() => setSaveStatus("error"));
      }, 2000)
    );
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [editor?.getHTML(), doc.title]);

  return (
    <EditorContext.Provider
      value={{
        editor,
        editorType,
        setEditorType,
        aiResponseLoading,
        setAiResponseLoading,
        additions,
        setAdditions,
        noChanges,
        setNoChanges,
        reasoning,
        setReasoning,
        document: doc,
        setDocument,
        saveStatus,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
