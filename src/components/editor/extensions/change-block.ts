import { Editor, Extension } from "@tiptap/react";
import { v4 } from "uuid";

export const ChangeBlock = Extension.create({
  name: "changeBlock",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
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
            parseHTML: (element) =>
              element.getAttribute("data-active") === "true",
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
        },
      },
    ];
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
          type: "textStyle",
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
    .setMark("textStyle", { changeBlock: true, id, incoming })
    .setTextSelection({ from: to, to })
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
    .setMark("textStyle", { changeBlock: true, id, incoming })
    .setTextSelection({ from: pos + current.length, to: pos + current.length })
    .run();
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

export function rejectChanges(editor: Editor, from: number, current: string) {
  editor
    .chain()
    .focus()
    .setTextSelection({ from, to: from + current.length })
    .unsetMark("textStyle")
    .setTextSelection({
      from: from + current.length,
      to: from + current.length,
    })
    .run();
}
