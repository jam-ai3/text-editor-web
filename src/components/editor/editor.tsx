import React, { useCallback } from "react";
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

type EditorProps = {
  editor: Editor;
};

export default function PopupEditor({ editor }: EditorProps) {
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
    <div className="editor editor-mini">
      <BubbleMenu
        pluginKey="bubbleMenuText"
        className="bubble-menu-dark"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ editor, view, state, oldState, from, to }) => {
          // only show if range is selected.
          return from !== to;
        }}
      >
        <button
          className="menu-button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <ArrowLeftCircle />
        </button>
        <button
          className="menu-button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <ArrowRightCircle />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("bold"),
          })}
          onClick={toggleBold}
        >
          <BoldIcon />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("underline"),
          })}
          onClick={toggleUnderline}
        >
          <UnderlineIcon />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("intalic"),
          })}
          onClick={toggleItalic}
        >
          <ItalicIcon />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("strike"),
          })}
          onClick={toggleStrike}
        >
          <Strikethrough />
        </button>
        <button
          className={classNames("menu-button", {
            "is-active": editor.isActive("code"),
          })}
          onClick={toggleCode}
        >
          <CodeIcon />
        </button>
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
