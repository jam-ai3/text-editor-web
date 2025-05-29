import { handleAcceptChange } from "@/ai-actions/editor";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDocument from "@/hooks/useDocument";
import { ACCEPT_COLOR_STRONG, REJECT_COLOR_STRONG } from "@/lib/constants";
import { Check, X } from "lucide-react";

export default function ChangeTab() {
  const context = useDocument();

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

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="flex-1"
              style={{ backgroundColor: ACCEPT_COLOR_STRONG }}
              onClick={() => handleAcceptChange(undefined, context)}
            >
              <Check />
              <span className="font-semibold">Accept</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{"Tab"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="flex-1"
              style={{ backgroundColor: REJECT_COLOR_STRONG }}
              // onClick={() => rejectAllChanges(context)}
            >
              <X />
              <span className="font-semibold">Reject</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{"Esc"}</TooltipContent>
        </Tooltip>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="font-semibold">Current</p>
          <p className="text-sm">{context.selectedChange?.current}</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Incoming</p>
          <p className="text-sm">{context.selectedChange?.incoming}</p>
        </div>
      </div>
    </div>
  );
}
