"use client";

import { editorConfig } from "@/components/editor/config";
import { ChatMessage, EditorAdditions, LockOption } from "@/lib/types";
import { Document } from "@prisma/client";
import { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export type EditorContextType = {
  editor: Editor | null;
  documentId: string;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  lock: LockOption;
  setLock: Dispatch<SetStateAction<LockOption>>;
  isChatOpen: boolean;
  toggleIsChatOpen: (value?: boolean) => void;
  chatSelection: string | null;
  setChatSelection: Dispatch<SetStateAction<string | null>>;
  chatHistory: ChatMessage[];
  setChatHistory: Dispatch<SetStateAction<ChatMessage[]>>;
  additions: EditorAdditions;
  setAdditions: Dispatch<SetStateAction<EditorAdditions>>;
};

export type CheckedEditorContextType = EditorContextType & {
  editor: Editor;
};

export const EditorContext = createContext<EditorContextType>({
  editor: null,
  documentId: "",
  title: "",
  setTitle: () => {},
  lock: "all",
  setLock: () => {},
  isChatOpen: false,
  toggleIsChatOpen: () => {},
  chatSelection: null,
  setChatSelection: () => {},
  chatHistory: [],
  setChatHistory: () => {},
  additions: { suggestion: null, diff: null },
  setAdditions: () => {},
});

type EditorProviderProps = {
  document?: Document | null;
  children: ReactNode;
};

const CHAT_LOCAL_STORAGE_KEY = "isChatOpen";

export default function EditorProvider({
  document,
  children,
}: EditorProviderProps) {
  const editor = useEditor(editorConfig(document?.content ?? ""));
  const [documentId] = useState(document?.id ?? crypto.randomUUID());
  const [title, setTitle] = useState(document?.title ?? "");
  const [lock, setLock] = useState<LockOption>("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSelection, setChatSelection] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [additions, setAdditions] = useState<EditorAdditions>({
    suggestion: null,
    diff: null,
  });

  useEffect(() => {
    function checkIsOpen() {
      if (typeof window === "undefined") return setIsChatOpen(true);
      const localValue = window.localStorage.getItem(CHAT_LOCAL_STORAGE_KEY);
      if (localValue === null) return setIsChatOpen(true);
      return setIsChatOpen(JSON.parse(localValue));
    }
    checkIsOpen();
  }, []);

  function toggleIsChatOpen(value?: boolean) {
    if (!value) value = !isChatOpen;
    setIsChatOpen(value);
    window.localStorage.setItem(CHAT_LOCAL_STORAGE_KEY, JSON.stringify(value));
  }

  return (
    <EditorContext.Provider
      value={{
        editor,
        documentId,
        title,
        setTitle,
        lock,
        setLock,
        isChatOpen,
        toggleIsChatOpen,
        chatSelection,
        setChatSelection,
        chatHistory,
        setChatHistory,
        additions,
        setAdditions,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
