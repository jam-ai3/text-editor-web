import { Editor, Extension } from "@tiptap/react";

export const IncomingBlock = Extension.create({
  name: "incomingBlock",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          incomingBlock: {
            parseHTML: (element) =>
              element.getAttribute("data-incoming-block") === "true",
            renderHTML: (attributes) => {
              if (!attributes.incomingBlock) return {};
              return {
                "data-incoming-block": "true",
                class: "incoming-block",
              };
            },
          },
        },
      },
    ];
  },
});

export function insertIncoming(
  editor: Editor,
  text: string,
  id: string,
  pos: number
) {
  editor
    .chain()
    .focus()
    .insertContentAt(pos, {
      type: "text",
      text,
      marks: [
        {
          type: "textStyle",
          attrs: {
            incomingBlock: true,
            id,
          },
        },
      ],
    })
    .run();
}

export function acceptIncoming(editor: Editor, from: number, text: string) {
  editor
    .chain()
    .focus()
    .setTextSelection({ from, to: from + text.length })
    .unsetMark("textStyle")
    .setTextSelection({ from: from + text.length, to: from + text.length })
    .run();
}

export function rejectIncoming(editor: Editor, from: number, text: string) {
  editor
    .chain()
    .focus()
    .deleteRange({ from, to: from + text.length })
    .run();
}
