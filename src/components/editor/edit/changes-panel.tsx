import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";
import { Button } from "../../ui/button";
import { Check, X } from "lucide-react";
import { ACCEPT_COLOR_STRONG, REJECT_COLOR_STRONG } from "@/lib/constants";
import { handleAcceptChange, handleReject } from "@/ai-actions/editor";

export default function ChangesPanel() {
  const context = useContext(EditorContext);

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
    <div className="flex flex-col overflow-y-scroll">
      <div className="space-y-4 p-4">
        <div className="flex justify-end">
          <span className="text-muted-foreground text-xs">
            Total Changes Remaining: {context.changes.length}
          </span>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Current</p>
          {context.selectedChange.current.length === 0 ? (
            <p className="font-semibold text-sm text-center">No Current Text</p>
          ) : (
            <p className="text-sm">{context.selectedChange?.current}</p>
          )}
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Incoming</p>
          {context.selectedChange.incoming.length === 0 ? (
            <p className="font-semibold text-sm text-center">
              No Incoming Text
            </p>
          ) : (
            <p className="text-sm">{context.selectedChange?.incoming}</p>
          )}
        </div>
        {/* <div className="space-y-2"> TODO: add reasoning
          <p className="font-semibold">Reasoning</p>
          <p className="text-sm">{context.selectedChange?.reasoning}</p>
        </div> */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleAcceptChange(undefined, context)}
            className="flex flex-1 items-center gap-2"
            style={{ backgroundColor: ACCEPT_COLOR_STRONG }}
          >
            <Check />
            <span className="font-semibold">Accept</span>
            <span className="text-xs">{"(Tab)"}</span>
          </Button>
          <Button
            onClick={() => handleReject(undefined, context)}
            className="flex flex-1 items-center gap-2"
            style={{ backgroundColor: REJECT_COLOR_STRONG }}
          >
            <X />
            <span className="font-semibold">Reject</span>
            <span className="text-xs">{"(Esc)"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
