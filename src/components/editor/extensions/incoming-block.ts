import { ChainedCommands, Editor } from "@tiptap/react";
import { Mark, mergeAttributes } from "@tiptap/core";

export const IncomingMark = Mark.create({
  name: "incoming",

  addAttributes() {
    return {
      id: {
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          return { id: attributes.id };
        },
      },
      incomingBlock: {
        parseHTML: (element) =>
          element.getAttribute("class") === "incoming-block",
        renderHTML: (attributes) => {
          if (!attributes.incomingBlock) return {};
          return {
            "data-incoming-block": "true",
            class: "incoming-block",
          };
        },
      },
      active: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-active") === "true",
        renderHTML: (attributes) => {
          const base: Record<string, string> = {};
          if (attributes.active) {
            base["data-active"] = "true";
            base["class"] = `active`;
          } else {
            base["data-active"] = "false";
          }
          return base;
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[id][data-incoming-block="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
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
          type: "incoming",
          attrs: {
            incomingBlock: true,
            id,
          },
        },
      ],
    })
    .run();
}

export function insertIncomingChain(
  chain: ChainedCommands,
  text: string,
  id: string,
  pos: number
) {
  return chain.insertContentAt(pos, {
    type: "text",
    text,
    marks: [
      {
        type: "incoming",
        attrs: {
          incomingBlock: true,
          id,
        },
      },
    ],
  });
}

export function acceptIncoming(editor: Editor, from: number, text: string) {
  editor
    .chain()
    .focus()
    .setTextSelection({ from, to: from + text.length })
    .unsetMark("incoming")
    .setTextSelection(from + text.length)
    .run();
}

export function acceptIncomingChain(
  chain: ChainedCommands,
  from: number,
  text: string
) {
  return chain
    .setTextSelection({ from, to: from + text.length })
    .unsetMark("incoming");
}

export function rejectIncoming(editor: Editor, from: number, text: string) {
  editor
    .chain()
    .focus()
    .deleteRange({ from, to: from + text.length })
    .run();
}

export function rejectIncomingChain(
  chain: ChainedCommands,
  from: number,
  text: string
) {
  return chain.deleteRange({ from, to: from + text.length });
}
