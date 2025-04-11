import { ElementType, useCallback } from "react";
import classNames from "classnames";
import { EditorContent, Editor, BubbleMenu } from "@tiptap/react";

import {
  ArrowLeftCircle,
  ArrowRightCircle,
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react";
import { MENU_BUTTON_SIZE } from "@/lib/constants";

type EditorProps = {
  editor: Editor;
  PopupButtons?: ElementType;
};

export default function PopupEditor({ editor, PopupButtons }: EditorProps) {
  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full">
      <BubbleMenu
        pluginKey="bubbleMenuText"
        className="flex items-center gap-2 bg-secondary p-2 border-2 rounded-md max-w-max"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ from, to }) => {
          // only show if range is selected.
          // other args: editor, view, state, oldState
          return from !== to;
        }}
      >
        <button
          className="menu-button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <ArrowLeftCircle size={MENU_BUTTON_SIZE} />
        </button>
        <button
          className="menu-button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <ArrowRightCircle size={MENU_BUTTON_SIZE} />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("bold"),
          })}
          onClick={toggleBold}
        >
          <BoldIcon size={MENU_BUTTON_SIZE} />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("underline"),
          })}
          onClick={toggleUnderline}
        >
          <UnderlineIcon size={MENU_BUTTON_SIZE} />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("intalic"),
          })}
          onClick={toggleItalic}
        >
          <ItalicIcon size={MENU_BUTTON_SIZE} />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("strike"),
          })}
          onClick={toggleStrike}
        >
          <Strikethrough size={MENU_BUTTON_SIZE} />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("code"),
          })}
          onClick={toggleCode}
        >
          <CodeIcon size={MENU_BUTTON_SIZE} />
        </button>
        {PopupButtons && <PopupButtons />}
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
