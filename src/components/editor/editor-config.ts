import { ImageUploadNode } from "@/components/tiptap/tiptap-node/image-upload-node";
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
// --- Custom Extensions ---
import { Link } from "@/components/tiptap/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap/tiptap-extension/trailing-node-extension";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import {
  DiffBlock,
  PreventEnter,
  PreventUndo,
  SuggestionBlock,
} from "./extensions";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { EditorAdditions } from "@/lib/types";
import { RefObject } from "react";

const editorConfig = (
  content: string,
  additions: RefObject<EditorAdditions>
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
    Underline,
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Image,
    Typography,
    Superscript,
    Subscript,
    Selection,
    ImageUploadNode.configure({
      accept: "image/*",
      maxSize: MAX_FILE_SIZE,
      limit: 3,
      upload: handleImageUpload,
      onError: (error) => console.error("Upload failed:", error),
    }),
    TrailingNode,
    Link.configure({ openOnClick: false }),
    Color,
    TextStyle,
    // Custom
    PreventEnter.configure({
      shouldPreventEnter: () =>
        additions.current.diff !== null ||
        additions.current.suggestion !== null,
    }),
    PreventUndo.configure({
      shouldPreventUndo: () =>
        additions.current.diff !== null ||
        additions.current.suggestion !== null,
    }),
    DiffBlock,
    SuggestionBlock,
  ],
  content,
});

export default editorConfig;
