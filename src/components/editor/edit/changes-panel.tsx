import { EditorContext } from "@/contexts/editor-provider";
import { useContext, useEffect, useRef } from "react";
import { Button } from "../../ui/button";
import { Check, CheckCheck, X } from "lucide-react";
import { ACCEPT_COLOR_STRONG, REJECT_COLOR_STRONG } from "@/lib/constants";
import { handleAcceptChange, handleReject } from "@/ai-actions/editor";
import { Change } from "@/lib/types";
import {
  acceptAllChanges,
  rejectAllChanges,
} from "@/ai-actions/document-changes";

export default function ChangesPanel() {
  const context = useContext(EditorContext);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!context.selectedChange) return;
    const element = document.getElementById(
      `change-${context.selectedChange.id}`
    );
    if (!element) return;
    containerRef.current?.scrollTo({
      top: element.offsetTop - 100,
      behavior: "smooth",
    });
  }, [context.selectedChange]);

  function handleDismiss() {
    context.setNoChanges(false);
    context.setEditorType("produce");
  }

  if (context.noChanges) {
    return (
      <div className="place-items-center grid h-full">
        <div className="flex flex-col items-center gap-2 w-4/5">
          <p className="font-semibold">No Changes</p>
          <p className="text-muted-foreground text-center">
            No changes have been made to this document
          </p>
          <Button
            variant="accent"
            className="mt-2 w-full"
            onClick={handleDismiss}
          >
            <X />
            <span>Dismiss</span>
          </Button>
        </div>
      </div>
    );
  }

  if (context.selectedChange === null)
    return (
      <div className="place-items-center grid h-full">
        <div className="flex flex-col items-center gap-2 w-4/5">
          <p className="font-semibold">No Change Selected</p>
          <p className="text-muted-foreground text-center">
            Select some portion of your text to see AI features
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto" ref={containerRef}>
      <div className="flex gap-4">
        <Button
          className="flex-1"
          style={{ backgroundColor: ACCEPT_COLOR_STRONG }}
          onClick={() => acceptAllChanges(context)}
        >
          <CheckCheck />
          <span className="font-semibold">Accept All</span>
        </Button>
        <Button
          className="flex-1"
          style={{ backgroundColor: REJECT_COLOR_STRONG }}
          onClick={() => rejectAllChanges(context)}
        >
          <X />
          <span className="font-semibold">Reject All</span>
        </Button>
      </div>
      {context.changes.map((change) => (
        <ChangeTab key={change.id} change={change} />
      ))}
    </div>
  );
}

type ChangeTabProps = {
  change: Change;
};

function ChangeTab({ change }: ChangeTabProps) {
  const context = useContext(EditorContext);

  if (context.selectedChange?.id !== change.id)
    return (
      <div
        id={`change-${change.id}`}
        className="bg-secondary px-4 py-2 border-2 border-border-secondary rounded-md cursor-pointer"
        onClick={() => context.setSelectedChange(change)}
      >
        {change.current.length > 0 ? (
          <p className="text-sm truncate">{change.current}</p>
        ) : (
          <p className="text-sm truncate">{change.incoming}</p>
        )}
      </div>
    );

  return (
    <div
      className="space-y-4 bg-secondary px-4 py-2 border-2 border-border-secondary rounded-md"
      id={`change-${change.id}`}
    >
      <div className="space-y-1">
        <p className="font-semibold text-sm">Current</p>
        {context.selectedChange.current.length === 0 ? (
          <p className="font-semibold text-sm text-center">No Current Text</p>
        ) : (
          <p className="text-sm">{context.selectedChange?.current}</p>
        )}
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-sm">Incoming</p>
        {context.selectedChange.incoming.length === 0 && (
          <p className="font-semibold text-sm text-center">No Incoming Text</p>
        )}
        {context.selectedChange.incoming.length > 0 &&
          context.selectedChange.incoming.trim().length === 0 && (
            <p className="text-sm italic">
              Whitespace: {`"${context.selectedChange?.incoming}"`}
            </p>
          )}
        {context.selectedChange.incoming.trim().length > 0 && (
          <p className="text-sm">{context.selectedChange?.incoming}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => handleAcceptChange(undefined, context)}
          className="flex flex-1 items-center gap-2"
          style={{ backgroundColor: ACCEPT_COLOR_STRONG }}
          size="sm"
        >
          <Check />
          <span className="font-semibold">Accept</span>
          <span className="text-xs">{"(Tab)"}</span>
        </Button>
        <Button
          onClick={() => handleReject(undefined, context)}
          className="flex flex-1 items-center gap-2"
          style={{ backgroundColor: REJECT_COLOR_STRONG }}
          size="sm"
        >
          <X />
          <span className="font-semibold">Reject</span>
          <span className="text-xs">{"(Esc)"}</span>
        </Button>
      </div>
    </div>
  );
}
