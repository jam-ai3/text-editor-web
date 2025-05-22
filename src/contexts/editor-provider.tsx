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
import {
  Autocomplete,
  Change,
  EditorType,
  EditType,
  Message,
} from "@/lib/types";
import { Document } from "@prisma/client";
import { saveDocument } from "@/ai-actions/document";
import editorConfig from "@/components/editor/editor-config";
import { SHOULD_SAVE } from "@/lib/constants";
import { findChangeBlockById } from "@/components/editor/helpers";

export type EditorContextType = {
  editor: Editor | null;
  editorType: EditorType;
  setEditorType: Dispatch<SetStateAction<EditorType>>;
  editType: EditType;
  setEditType: Dispatch<SetStateAction<EditType>>;
  aiResponseLoading: boolean;
  setAiResponseLoading: Dispatch<SetStateAction<boolean>>;
  autocomplete: Autocomplete | null;
  setAutocomplete: Dispatch<SetStateAction<Autocomplete | null>>;
  changes: Change[];
  setChanges: Dispatch<SetStateAction<Change[]>>;
  selectedChange: Change | null;
  setSelectedChange: Dispatch<SetStateAction<Change | null>>;
  document: Document;
  setDocument: Dispatch<SetStateAction<Document>>;
  saveStatus: SaveStatus;
  message: Message | null;
  setMessage: Dispatch<SetStateAction<Message | null>>;
};

export const defaultEditorContext: EditorContextType = {
  editor: null,
  editorType: "produce",
  setEditorType: () => {},
  editType: "grammar",
  setEditType: () => {},
  aiResponseLoading: false,
  setAiResponseLoading: () => {},
  autocomplete: null,
  setAutocomplete: () => {},
  changes: [],
  setChanges: () => {},
  selectedChange: null,
  setSelectedChange: () => {},
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
  message: null,
  setMessage: () => {},
};

export const EditorContext =
  createContext<EditorContextType>(defaultEditorContext);

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
  const [editType, setEditType] = useState<EditType>("grammar");
  const [autocomplete, setAutocomplete] = useState<Autocomplete | null>(null);
  const autocompleteRef = useRef(autocomplete);
  const [changes, setChanges] = useState<Change[]>([]);
  const changesRef = useRef(changes);
  const [selectedChange, setSelectedChange] = useState<Change | null>(null);
  const [doc, setDocument] = useState<Document>(document);
  const editor = useEditor(
    editorConfig(document.content, changesRef, autocompleteRef)
  );
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("success");
  const [aiResponseLoading, setAiResponseLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const html = editor?.getHTML();

  useEffect(() => {
    // update Ref
    changesRef.current = changes;

    // handle local changes storage
    const existingChanges: Change[] = JSON.parse(
      localStorage.getItem("changes") || "[]"
    );
    const joinedChanges = [...existingChanges, ...changes];
    const uniqueChanges = joinedChanges.filter(
      (change, index) =>
        joinedChanges.findIndex((c) => c.id === change.id) === index
    );
    localStorage.setItem("changes", JSON.stringify(uniqueChanges));
  }, [changes]);

  useEffect(() => {
    if (!selectedChange || !editor) return;
    const start = findChangeBlockById(editor, selectedChange.id);
    if (start !== selectedChange.pos) {
      setSelectedChange({ ...selectedChange, pos: start });
      editor.chain().focus().setTextSelection({ from: start, to: start }).run();
    }
  }, [selectedChange, editor]);

  useEffect(() => {
    // use debounce to save document after 2 seconds of no typing
    if (!SHOULD_SAVE) return setSaveStatus("error");

    if (saveTimer) clearTimeout(saveTimer);
    setSaveTimer(
      setTimeout(() => {
        if (!html) return;
        setSaveStatus("pending");
        saveDocument(document.id, doc.title, html, userId)
          .then(() => setSaveStatus("success"))
          .catch(() => setSaveStatus("error"));
      }, 2000)
    );
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [html, doc.title, document.id, userId]);

  useEffect(() => {
    // clear changes on refresh
    localStorage.setItem("changes", "[]");
  }, []);

  return (
    <EditorContext.Provider
      value={{
        editor,
        editorType,
        setEditorType,
        editType,
        setEditType,
        aiResponseLoading,
        setAiResponseLoading,
        autocomplete,
        setAutocomplete,
        changes,
        setChanges,
        selectedChange,
        setSelectedChange,
        document: doc,
        setDocument,
        saveStatus,
        message,
        setMessage,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
