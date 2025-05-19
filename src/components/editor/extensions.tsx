import { ACCEPT_COLOR, REJECT_COLOR, SUGGESTION_COLOR } from "@/lib/constants";
import { Editor, Extension } from "@tiptap/core";
import { v4 } from "uuid";

export const PreventEnter = Extension.create<{
  shouldPreventEnter: () => boolean;
}>({
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

export const PreventUndo = Extension.create<{
  shouldPreventUndo: () => boolean;
}>({
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
  name: "diffBlock",

  addOptions() {
    return {
      acceptColor: ACCEPT_COLOR,
      rejectColor: REJECT_COLOR,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          diffType: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-diff-type"),
            renderHTML: (attributes) => {
              const base: Record<string, string> = {};
              if (attributes.diffType === "accept") {
                base["data-diff-type"] = "accept";
                base["class"] = `accept`;
              } else if (attributes.diffType === "reject") {
                base["data-diff-type"] = "reject";
                base["class"] = `reject`;
              }
              return base;
            },
          },
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute("id"),
            renderHTML: (attributes) => {
              if (!attributes.id) return {};
              return { id: attributes.id };
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
                base["class"] = `change-block-active`;
              } else {
                base["data-active"] = "false";
              }
              return base;
            },
          },
          incoming: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-incoming"),
            renderHTML: (attributes) => {
              if (!attributes.incoming) return {};
              return { "data-incoming": attributes.incoming };
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
  const currentId = v4();
  const incomingId = v4();
  editor
    .chain()
    .focus()
    .insertContent({
      type: "text",
      text: current,
      marks: [
        {
          type: "textStyle",
          attrs: {
            diffType: "reject",
            id: currentId,
            incoming: "test",
          },
        },
      ],
    })
    .insertContent({
      type: "text",
      text: incoming,
      marks: [
        {
          type: "textStyle",
          attrs: {
            diffType: "accept",
            id: incomingId,
          },
        },
      ],
    })
    .run();
  return { currentId, incomingId };
}

export function insertChangesAtSelection(
  editor: Editor,
  incoming: string,
  currentId: string,
  incomingId: string
) {
  const { from, to } = editor.state.selection;
  const current = editor.state.doc.textBetween(from, to, "");
  editor.commands.deleteRange({ from, to });
  editor
    .chain()
    .focus()
    .insertContentAt(from, {
      type: "text",
      text: current.trim(),
      marks: [
        {
          type: "textStyle",
          attrs: {
            diffType: "reject",
            id: currentId,
          },
        },
      ],
    })
    .insertContentAt(from + current.trim().length, {
      type: "text",
      text: incoming.trim(),
      marks: [
        {
          type: "textStyle",
          attrs: {
            diffType: "accept",
            id: incomingId,
          },
        },
      ],
    })
    .run();
  return { current, from };
}

export function insertChangesAt(
  editor: Editor,
  current: string,
  incoming: string,
  currentId: string,
  incomingId: string,
  pos: number
) {
  editor.commands.deleteRange({ from: pos, to: pos + current.length });
  editor
    .chain()
    .focus()
    .insertContentAt(pos, {
      type: "text",
      text: current,
      marks: [
        {
          type: "textStyle",
          attrs: {
            diffType: "reject",
            id: currentId,
          },
        },
      ],
    })
    .insertContentAt(pos + current.length, {
      type: "text",
      text: incoming,
      marks: [
        {
          type: "textStyle",
          attrs: {
            diffType: "accept",
            id: incomingId,
          },
        },
      ],
    })
    .run();
}

export function acceptChanges(
  editor: Editor,
  from: number,
  current: string,
  incoming: string
) {
  editor
    .chain()
    .focus()
    .deleteRange({
      from,
      to: from + current.length + incoming.length,
    })
    .insertContentAt(from, {
      type: "text",
      text: incoming,
    })
    .run();
}

export function rejectChanges(
  editor: Editor,
  from: number,
  current: string,
  incoming: string
) {
  editor
    .chain()
    .focus()
    .deleteRange({
      from,
      to: from + current.length + incoming.length,
    })
    .insertContentAt(from, {
      type: "text",
      text: current,
    })
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
