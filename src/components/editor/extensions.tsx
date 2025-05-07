import { ACCEPT_COLOR, REJECT_COLOR, SUGGESTION_COLOR } from "@/lib/constants";
import { Editor, Extension } from "@tiptap/core";

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

export const DiffBlock = Extension.create({
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
              if (attributes.diffType === "accept") {
                return {
                  "data-diff-type": "accept",
                  style: `background-color: ${this.options.acceptColor};`,
                };
              } else if (attributes.diffType === "reject") {
                return {
                  "data-diff-type": "reject",
                  style: `background-color: ${this.options.rejectColor};`,
                };
              }
              return {};
            },
          },
        },
      },
    ];
  },
});

export const SuggestionBlock = Extension.create({
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

export function insertSuggestion(editor: Editor, suggestion: string) {
  const { from } = editor.state.selection;
  editor.commands.insertContentAt(from, {
    type: "text",
    text: suggestion,
    marks: [
      {
        type: "textStyle",
        attrs: { suggestion: true },
      },
    ],
  });
}

export function accpetSuggestion(
  editor: Editor,
  from: number,
  suggestion: string
) {
  editor
    .chain()
    .setTextSelection({ from: from - 1, to: from + suggestion.length })
    .setMark("textStyle", { suggestion: false })
    .setTextSelection({
      from: from + suggestion.length,
      to: from + suggestion.length,
    })
    .run();
}

export function rejectSuggestion(
  editor: Editor,
  from: number,
  suggestion: string
) {
  editor
    .chain()
    .focus()
    .deleteRange({ from, to: from + suggestion.length })
    .run();
}

export function insertDiff(editor: Editor, incoming: string) {
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
          attrs: { diffType: "reject" },
        },
      ],
    })
    .run();
  editor
    .chain()
    .focus()
    .insertContentAt(from + current.trim().length, {
      type: "text",
      text: incoming.trim(),
      marks: [
        {
          type: "textStyle",
          attrs: { diffType: "accept" },
        },
      ],
    })
    .run();
  return { current, from };
}

export function acceptDiff(
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
      to: from + current.trim().length + incoming.trim().length,
    })
    .insertContentAt(from, {
      type: "text",
      text: incoming.trim(),
    })
    .run();
}

export function rejectDiff(
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
      to: from + current.trim().length + incoming.trim().length,
    })
    .insertContentAt(from, {
      type: "text",
      text: current.trim(),
    })
    .run();
}
