import { ChainedCommands, Editor } from "@tiptap/react";
import { Mark, mergeAttributes } from "@tiptap/core";
import { v4 } from "uuid";

export const ChangeMark = Mark.create({
  name: "change",

  addAttributes() {
    return {
      id: {
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          return { id: attributes.id };
        },
      },
      changeBlock: {
        parseHTML: (element) =>
          element.getAttribute("class") === "change-block",
        renderHTML: (attributes) => {
          if (!attributes.changeBlock) return {};
          return {
            "data-change-block": "true",
            class: "change-block",
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
      incoming: {
        parseHTML: (element) => element.getAttribute("data-incoming"),
        renderHTML: (attributes) => {
          if (!attributes.incoming) return {};
          return {
            "data-incoming": attributes.incoming,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[id][data-change-block="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
});

export function insertChanges(
  editor: Editor,
  current: string,
  incoming: string
) {
  const id = v4();
  editor
    .chain()
    .focus()
    .insertContent({
      type: "text",
      text: current,
      marks: [
        {
          changeBlock: true,
          type: "change",
          attrs: {
            id,
            incoming,
          },
        },
      ],
    })
    .run();
  return { id };
}

export function insertChangesAtSelection(
  editor: Editor,
  incoming: string,
  id: string
) {
  const { from, to } = editor.state.selection;
  const current = editor.state.doc.textBetween(from, to, "");
  editor
    .chain()
    .focus()
    .setMark("change", { changeBlock: true, id, incoming })
    .setTextSelection(to)
    .run();
  return { current, from };
}

export function insertChangesAt(
  editor: Editor,
  current: string,
  incoming: string,
  id: string,
  pos: number
) {
  editor
    .chain()
    .focus()
    .setTextSelection({ from: pos, to: pos + current.length })
    .setMark("change", { changeBlock: true, id, incoming })
    .setTextSelection(pos + current.length)
    .run();
}

export function insertChangesChain(
  chain: ChainedCommands,
  current: string,
  incoming: string,
  id: string,
  pos: number
) {
  return chain
    .setTextSelection({ from: pos, to: pos + current.length })
    .setMark("change", { changeBlock: true, id, incoming })
    .setTextSelection(pos + current.length);
}

export function acceptChanges(
  editor: Editor,
  from: number,
  current: string,
  incoming: string
) {
  const length = editor.getText().length + 1;
  const to = from + current.length > length ? length : from + current.length;
  editor
    .chain()
    .focus()
    .deleteRange({ from, to })
    .insertContentAt(from, { type: "text", text: incoming })
    .run();
}

export function acceptChangesChain(
  chain: ChainedCommands,
  from: number,
  current: string,
  incoming: string,
  contentSize: number
) {
  const to =
    from + current.length > contentSize ? contentSize : from + current.length;
  const newChain = chain
    .deleteRange({ from, to })
    .insertContentAt(from, { type: "text", text: incoming });
  const offset = incoming.length - current.length;
  return { chain: newChain, offset };
}

export function rejectChanges(editor: Editor, from: number, current: string) {
  editor
    .chain()
    .focus()
    .setTextSelection({ from, to: from + current.length })
    .unsetMark("change")
    .setTextSelection(from + current.length)
    .run();
}

export function rejectChangesChain(
  chain: ChainedCommands,
  from: number,
  current: string
) {
  return chain
    .setTextSelection({ from, to: from + current.length })
    .unsetMark("change");
}
