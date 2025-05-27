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
  isIndividual: boolean;
};

export type Message = {
  variant: "danger" | "warning" | "success" | "info";
  text: string;
};

export type EditType = "document" | "individual";

export type ParaphraseLanguageType =
  | "academic"
  | "persuasive"
  | "professional"
  | "simple"
  | "custom";
