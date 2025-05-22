import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

type KeyhandlerArgs = {
  shouldPreventKeys: () => boolean;
};

export const Keyhandler = Extension.create<KeyhandlerArgs>({
  name: "preventAllKeys",

  addOptions() {
    return {
      shouldPreventKeys: () => false,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("preventAllKeys"),
        props: {
          handleKeyDown: (_, event) => {
            if (this.options.shouldPreventKeys()) {
              event.preventDefault();
              return true; // prevent default behavior
            }
            return false;
          },
        },
      }),
    ];
  },
});
