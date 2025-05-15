"use client";

import * as React from "react";
import { EditorContent, EditorContext } from "@tiptap/react";
import { EditorContext as CustomEditorContext } from "@/contexts/editor-provider";
// --- UI Primitives ---
import { Toolbar } from "@/components/tiptap/tiptap-ui-primitive/toolbar";
// --- Tiptap Node ---
import "@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss";
import { useMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
// --- Styles ---
import "@/components/editor/simple-editor.scss";
import { processKeydown } from "@/_actions/editor";
import MobileToolbarContent from "./mobile-toolbar";
import MainToolbarContent from "./main-toolbar";
import Header from "./header";
import Image from "next/image";
import Link from "next/link";
import PopupMenu from "./bubble-menu";
import { removeAutocomplete, removeChanges, setActiveBlock } from "./helpers";
import EditPanel from "./edit/edit-panel";

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
      console.log(target);
      if (target.dataset?.diffType) {
        event.preventDefault();
        context.setEditType("changes");
        context.setSelectedChange(
          context.changes.find(
            (c) => c.current.id === target.id || c.incoming.id === target.id
          ) ?? null
        );
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
    setActiveBlock(context.editor, context.selectedChange);
  }, [context.selectedChange]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="flex items-center gap-4 px-4 border-b-2 w-full">
        <Link href="/">
          <Image src="/logo-no-bg.png" alt="Logo" width={64} height={64} />
        </Link>
        <div className="w-full">
          <Header />
          <Toolbar
            ref={toolbarRef}
            style={
              isMobile
                ? {
                    bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
                  }
                : {}
            }
          >
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                isMobile={isMobile}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>
        </div>
      </div>
      <div className="relative flex content-wrapper">
        <PopupMenu />
        <div className="flex-1 overflow-y-scroll">
          <EditorContent
            editor={editor}
            role="presentation"
            className="mx-auto my-8 border-2 w-full max-w-[720px] simple-editor-content"
          />
        </div>
        {context.editorType === "edit" && <EditPanel />}
      </div>
    </EditorContext.Provider>
  );
}
