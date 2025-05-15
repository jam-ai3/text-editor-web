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
  current: {
    id: string;
    text: string;
  };
  incoming: {
    id: string;
    text: string;
  };
  pos: number;
  reasoning: string;
};

export type EditType = "changes" | "grammar" | "reorder";
