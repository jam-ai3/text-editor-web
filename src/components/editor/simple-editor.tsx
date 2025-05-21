"use client";

import * as React from "react";
import { EditorContent, EditorContext } from "@tiptap/react";
import { EditorContext as CustomEditorContext } from "@/contexts/editor-provider";
// --- UI Primitives ---
// --- Tiptap Node ---
import "@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss";
import { useMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
// --- Styles ---
import "@/components/editor/simple-editor.scss";
import { processKeydown } from "@/ai-actions/editor";
import Header from "./header/header";
import PopupMenu from "./bubble-menu";
import { removeAutocomplete, removeChanges, setActiveBlock } from "./helpers";
import EditPanel from "./edit/edit-panel";
// framer motion
import { AnimatePresence, motion } from "framer-motion";

export function SimpleEditor() {
  const context = React.useContext(CustomEditorContext);
  const editor = context.editor;
  const isMobile = useMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const [rect, setRect] = React.useState<
    Pick<DOMRect, "x" | "y" | "width" | "height">
  >({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateRect = () => {
      setRect(document.body.getBoundingClientRect());
    };

    updateRect();

    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(document.body);

    window.addEventListener("scroll", updateRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  React.useEffect(() => {
    const checkCursorVisibility = () => {
      if (!editor || !toolbarRef.current) return;

      const { state, view } = editor;
      if (!view.hasFocus()) return;

      const { from } = state.selection;
      const cursorCoords = view.coordsAtPos(from);

      if (windowSize.height < rect.height) {
        if (cursorCoords && toolbarRef.current) {
          const toolbarHeight =
            toolbarRef.current.getBoundingClientRect().height;
          const isEnoughSpace =
            windowSize.height - cursorCoords.top - toolbarHeight > 0;

          // If not enough space, scroll until the cursor is the middle of the screen
          if (!isEnoughSpace) {
            const scrollY =
              cursorCoords.top - windowSize.height / 2 + toolbarHeight;
            window.scrollTo({
              top: scrollY,
              behavior: "smooth",
            });
          }
        }
      }
    };

    checkCursorVisibility();
  }, [editor, rect.height, windowSize.height]);

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  React.useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      processKeydown(event, context);
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.dataset.changeBlock || target.dataset.incomingBlock) {
        event.preventDefault();
        context.setEditType("changes");
        const change = context.changes.find((c) => c.id === target.id);
        context.setSelectedChange(change ?? null);
      }
    }

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleClick);
    };
  }, [context]);

  // check for diff / autocomplete blocks
  React.useEffect(() => {
    if (!editor) return;
    removeAutocomplete(editor);
    removeChanges(editor);
  }, [editor]);

  React.useEffect(() => {
    if (!context.selectedChange || !context.editor) return;
    context.setEditorType("edit");
    context.setEditType("changes");
    setActiveBlock(context.editor, context.selectedChange);
  }, [context.selectedChange]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <Header toolbarRef={toolbarRef} />
      <div className="relative flex bg-secondary content-wrapper">
        <PopupMenu />
        <div className="flex-1 overflow-y-scroll">
          <EditorContent
            editor={editor}
            role="presentation"
            className="bg-background shadow-sm mx-auto my-8 border-1 w-full max-w-[816px] simple-editor-content"
          />
        </div>
        <AnimatePresence>
          {context.editorType === "edit" && (
            <motion.div
              key="edit-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <EditPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </EditorContext.Provider>
  );
}
