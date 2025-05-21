import { Editor } from "@tiptap/react";

export * from "./keyhandler";
export * from "./change-block";
export * from "./incoming-block";
export * from "./autocomplete-block";
export * from "./pagination";

// ------------------- PLAIN TEXT -------------------

export function insertText(editor: Editor, text: string) {
  editor
    .chain()
    .focus()
    .insertContent({
      type: "text",
      text: text,
      marks: [
        {
          type: "textStyle",
          attrs: {},
        },
      ],
    })
    .run();
}
