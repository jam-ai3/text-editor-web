import { Extension } from "@tiptap/core";

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

// TODO: implement
export const DiffBlock = Extension.create({});

export const SuggestionBlock = Extension.create({});
