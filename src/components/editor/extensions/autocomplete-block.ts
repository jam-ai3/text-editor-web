import { SUGGESTION_COLOR } from "@/lib/constants";
import { Editor, Extension } from "@tiptap/react";

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
