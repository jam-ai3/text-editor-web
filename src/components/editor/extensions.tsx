import { SUGGESTION_COLOR } from "@/lib/constants";
import { Editor, Extension } from "@tiptap/core";
import { v4 } from "uuid";

type PreventEnterMethods = {
  shouldPreventEnter: () => boolean;
};

export const PreventEnter = Extension.create<PreventEnterMethods>({
  name: "preventEnter",

  addOptions() {
    return {
      shouldPreventEnter: () => false,
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.options.shouldPreventEnter(),
    };
  },
});

type PreventUndoMethods = {
  shouldPreventUndo: () => boolean;
};

export const PreventUndo = Extension.create<PreventUndoMethods>({
  name: "preventUndo",

  addOptions() {
    return {
      shouldPreventUndo: () => false,
    };
  },

  addKeyboardShortcuts() {
    return {
      "mod-z": () => this.options.shouldPreventUndo(),
    };
  },
});

// ------------------- CHANGE BLOCK -------------------

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

// ------------------- INCOMING BLOCK -------------------

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

// ------------------- AUTOCOMPLETE -------------------

export const AutocompleteBlock = Extension.create({
  name: "suggestionBlock",

  addOptions() {
    return {
      suggestionColor: SUGGESTION_COLOR,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          suggestion: {
            default: false,
            parseHTML: (element) =>
              element.getAttribute("data-suggestion") === "true",
            renderHTML: (attributes) =>
              attributes.suggestion
                ? {
                    "data-suggestion": "true",
                    style: `color: ${this.options.suggestionColor};`,
                  }
                : {},
          },
        },
      },
    ];
  },
});

export function insertAutocomplete(
  editor: Editor,
  autocomplete: string,
  at?: number
) {
  const { from } = editor.state.selection;
  editor.commands.insertContentAt(at ?? from, {
    type: "text",
    text: autocomplete,
    marks: [
      {
        changeBlock: true,
        type: "textStyle",
        attrs: { suggestion: true },
      },
    ],
  });
}

export function acceptAutocomplete(
  editor: Editor,
  from: number,
  autocomplete: string
) {
  editor
    .chain()
    .setTextSelection({ from: from - 1, to: from + autocomplete.length })
    .setMark("textStyle", { suggestion: false })
    .setTextSelection({
      from: from + autocomplete.length,
      to: from + autocomplete.length,
    })
    .run();
}

export function rejectAutocomplete(
  editor: Editor,
  from: number,
  autocomplete: string
) {
  editor
    .chain()
    .focus()
    .deleteRange({ from, to: from + autocomplete.length })
    .run();
}

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
