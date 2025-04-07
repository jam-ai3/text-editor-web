export type LockOption = "all" | "revise" | "reorder" | "produce";

export type EditorAdditions = {
  suggestion: {
    content: string;
    pos: number;
  } | null;
  diff: {
    current: string;
    incoming: string;
    pos: number;
  } | null;
};

export type ChatMessage = {
  content: string;
  role: "user" | "ai";
};
