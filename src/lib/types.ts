export type LockOption = "write" | "edit";

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

export type Reasoning = {
  text: string;
  yPos: number;
};
