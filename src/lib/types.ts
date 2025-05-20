export type EditorType = "produce" | "edit";

export type Reasoning = {
  text: string;
  yPos: number;
};

export type Autocomplete = {
  text: string;
  pos: number;
};

export type Change = {
  id: string;
  current: string;
  incoming: string;
  pos: number;
  reasoning: string;
};

export type EditType = "changes" | "grammar" | "reorder";
