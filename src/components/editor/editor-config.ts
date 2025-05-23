// import { ImageUploadNode } from "@/components/tiptap/tiptap-node/image-upload-node";
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { FontFamily } from "@tiptap/extension-font-family";
import { FontSize } from "tiptap-extension-font-size";
import { Link } from "@/components/tiptap/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap/tiptap-extension/trailing-node-extension";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
// --- Custom Extensions ---
import {
  IncomingMark,
  AutocompleteMark,
  Keyhandler,
  ChangeMark,
} from "./extensions";
import { Autocomplete, Change } from "@/lib/types";
import { RefObject } from "react";

const editorConfig = (
  content: string,
  changes: RefObject<Change[]>,
  autocomplete: RefObject<Autocomplete | null>
) => ({
  immediatelyRender: false,
  editorProps: {
    attributes: {
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "off",
      "aria-label": "Main content area, start typing to enter text.",
    },
  },
  extensions: [
    StarterKit,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    FontFamily.configure({ types: ["textStyle"] }),
    FontSize.configure({ types: ["textStyle"] }),
    Underline,
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Typography,
    Superscript,
    Subscript,
    Selection,
    TrailingNode,
    Color,
    Link.configure({ openOnClick: false }),
    TextStyle.configure({ mergeNestedSpanStyles: true }),
    // Custom
    Keyhandler.configure({
      shouldPreventKeys: () =>
        changes.current.length !== 0 || autocomplete.current !== null,
    }),
    ChangeMark,
    IncomingMark,
    AutocompleteMark,
  ],
  content,
});

export default editorConfig;
