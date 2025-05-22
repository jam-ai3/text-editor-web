import { Editor } from "@tiptap/react";
import { Mark, mergeAttributes } from "@tiptap/core";
import { AUTOCOMPLETE_COLOR } from "@/lib/constants";

export const AutocompleteMark = Mark.create({
  name: "autocomplete",

  addAttributes() {
    return {
      autocomplete: {
        default: true,
        parseHTML: (element) =>
          element.getAttribute("data-autocomplete") === "true",
        renderHTML: (attributes) => {
          if (!attributes.autocomplete) return {};
          return {
            "data-autocomplete": "true",
            style: `color: ${AUTOCOMPLETE_COLOR};`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-autocomplete="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
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
        type: "autocomplete",
        attrs: { autocomplete: true },
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
    .unsetMark("autocomplete")
    .setTextSelection(from + autocomplete.length)
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
