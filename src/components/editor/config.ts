import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";

export const editorConfig = (content: string) => ({
  extensions: [
    Document,
    History,
    Paragraph,
    Text,
    Highlight.configure({ multicolor: true }),
    // Link.configure({
    //   openOnClick: false
    // }),
    Bold,
    Underline,
    Italic,
    Strike,
    Code,
    Color,
    TextStyle,
    // BulletList,
    // OrderedList,
    // ListItem,
  ],
  content,
});
