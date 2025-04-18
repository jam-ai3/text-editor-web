"use client";

import PopupEditor from "@/components/editor/editor";
import { EditorContext } from "@/contexts/editor-provider";
import { useContext, useEffect } from "react";
import {
  handleAcceptAutocomplete,
  handleAcceptDiff,
  handleGrammar,
  handleLengthen,
  handleRejectAutocomplete,
  handleRejectDiff,
  handleReorder,
  handleShorten,
  processKeydown,
} from "../../_actions/editor";
import {
  ArrowUpDown,
  CheckCheck,
  Edit,
  MessageCircle,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { chatWithSelection } from "../../_actions/chat";
import PopupButton, { PopupDivider } from "@/components/editor/popup-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="relative">
      <div className="flex justify-between gap-4 p-2">
        <Input
          placeholder="Title"
          value={context.title}
          onChange={(e) => context.setTitle(e.target.value)}
        />
        <AcceptRejectButtons />
      </div>
      <PopupEditor editor={context.editor} PopupButtons={PopupButtons} />
    </div>
  );
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

function AcceptRejectButtons() {
  const context = useContext(EditorContext);

  if (context.additions.diff) {
    return (
      <div className="flex gap-2">
        <Button
          variant="accent"
          onClick={() => handleAcceptDiff(undefined, context)}
        >
          <CheckCheck />
          <span>Accept</span>
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleRejectDiff(undefined, context)}
        >
          <X />
          <span>Reject</span>
        </Button>
      </div>
    );
  }

  if (context.additions.suggestion) {
    return (
      <div className="flex gap-2">
        <Button
          variant="accent"
          onClick={() => handleAcceptAutocomplete(undefined, context)}
        >
          <CheckCheck />
          <span>Accept</span>
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleRejectAutocomplete(undefined, context)}
        >
          <X />
          <span>Reject</span>
        </Button>
      </div>
    );
  }

  return null;
}
