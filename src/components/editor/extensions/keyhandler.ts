import { isCtrlPressed } from "@/lib/utils";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

type KeyhandlerArgs = {
  shouldPreventKeys: () => boolean;
};

export const Keyhandler = Extension.create<KeyhandlerArgs>({
  name: "keyhandler",

  addOptions() {
    return {
      shouldPreventKeys: () => false,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("keyhandler"),
        props: {
          handleKeyDown: (_, event) => {
            if (
              isCtrlPressed(event) &&
              (event.key.toLowerCase() === "a" ||
                event.key.toLowerCase() === "c" ||
                event.key.toLowerCase() === "z" ||
                event.key.toLowerCase() === "y")
            )
              return false;

            if (this.options.shouldPreventKeys()) {
              event.preventDefault();
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
