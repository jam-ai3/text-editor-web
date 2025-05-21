import { Extension } from "@tiptap/core";

type KeyhandlerArgs = {
  shouldPreventKeys: () => boolean;
};

export const Keyhandler = Extension.create<KeyhandlerArgs>({
  name: "preventEnter",

  addOptions() {
    return {
      shouldPreventKeys: () => false,
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.options.shouldPreventKeys(),
      "mod-z": () => this.options.shouldPreventKeys(),
      "mod-shift-z": () => this.options.shouldPreventKeys(),
    };
  },
});
