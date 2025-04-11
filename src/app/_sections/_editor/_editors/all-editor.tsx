"use client";

import PopupEditor from "@/components/editor/editor";
import { EditorContext } from "@/contexts/editor-provider";
import { useContext, useEffect } from "react";
import {
  handleGrammar,
  handleLengthen,
  handleReorder,
  handleShorten,
  processKeydown,
} from "../../_actions/editor";
import { ArrowUpDown, Edit, MessageCircle, Minus, Plus } from "lucide-react";
import { chatWithSelection } from "../../_actions/chat";
import PopupButton, { PopupDivider } from "@/components/editor/popup-button";

// TODO: make sure selection isn't too long
// TODO: add buttons to accept and reject autocomplete and diffs
export default function AllEditor() {
  const context = useContext(EditorContext);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      processKeydown(event, context);
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [context]);

  if (!context.editor) return null;

  return <PopupEditor editor={context.editor} PopupButtons={PopupButtons} />;
}

function PopupButtons() {
  return (
    <>
      <PopupDivider />
      <PopupButton Component={Minus} onClick={handleShorten} />
      <PopupButton Component={Plus} onClick={handleLengthen} />
      <PopupButton Component={Edit} onClick={handleGrammar} />
      <PopupButton Component={ArrowUpDown} onClick={handleReorder} />
      <PopupDivider />
      <PopupButton Component={MessageCircle} onClick={chatWithSelection} />
    </>
  );
}
