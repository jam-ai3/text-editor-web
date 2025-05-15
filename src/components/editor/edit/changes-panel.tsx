import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";
import { Button } from "../../ui/button";
import { Check, X } from "lucide-react";
import { ACCEPT_COLOR_STRONG, REJECT_COLOR_STRONG } from "@/lib/constants";
import { handleAcceptChange, handleReject } from "@/_actions/editor";
import { cn } from "@/lib/utils";
import { Change } from "@/lib/types";

export default function ChangesPanel() {
  const context = useContext(EditorContext);

  if (context.selectedChange === null)
    return (
      <div className="place-items-center grid h-full">
        <div className="flex flex-col items-center gap-2">
          <p className="font-semibold">No Change Selected</p>
          <p className="text-muted-foreground">
            Select some portion of your text to see AI features
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col overflow-y-scroll">
      <div className="flex border-b-2 w-full overflow-x-auto">
        {context.changes.length > 1 &&
          context.changes.map((change, i) => (
            <ChangeTab
              key={change.current.id}
              change={change}
              isLast={i === context.changes.length - 1}
            />
          ))}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="font-semibold">Current</p>
          <p className="text-sm">{context.selectedChange?.current.text}</p>
        </div>
        <div>
          <p className="font-semibold">Incoming</p>
          <p className="text-sm">{context.selectedChange?.incoming.text}</p>
        </div>
        <div>
          <p className="font-semibold">Reasoning</p>
          <p className="text-sm">{context.selectedChange?.reasoning}</p>
        </div>
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

type ChangeTabProps = {
  change: Change;
  isLast?: boolean;
};

function ChangeTab({ change, isLast }: ChangeTabProps) {
  const context = useContext(EditorContext);

  return (
    <button
      className={cn(
        "min-w-[100px] grow text-xs",
        !isLast && "border-r-2",
        context.selectedChange?.current.id === change.current.id &&
          "bg-border font-semibold"
      )}
      onClick={() => context.setSelectedChange(change)}
    >
      {change.current.text.slice(0, 10).split(" ").slice(0, -1).join(" ") +
        "..."}
    </button>
  );
}
