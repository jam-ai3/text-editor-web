export type EditorType = "produce" | "edit";

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

export type EditorChanges = {
  autocomplete: {
    text: string;
    pos: number;
  } | null;
  diffs: {
    current: string;
    incoming: string;
    pos: number;
  }[];
};
