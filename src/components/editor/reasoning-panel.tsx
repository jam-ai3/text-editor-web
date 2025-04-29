import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { ACCEPT_COLOR_STRONG, REJECT_COLOR_STRONG } from "@/lib/constants";
import { handleAcceptChanges, handleRejectChanges } from "@/_actions/editor";

export default function ReasoningPanel() {
  const context = useContext(EditorContext);

  if (!context.reasoning) return null;

  return (
    <Card
      className="right-8 absolute w-1/3"
      style={{
        top: `calc(${context.reasoning.yPos}px + var(--header-height) + var(--tt-toolbar-height) - 64px)`,
      }}
    >
      <CardHeader>
        <CardTitle>Reasoning</CardTitle>
        <CardDescription>{context.reasoning.text}</CardDescription>
      </CardHeader>
      <CardFooter className="flex gap-4">
        <Button
          style={{ backgroundColor: REJECT_COLOR_STRONG }}
          onClick={() => handleRejectChanges(undefined, context)}
        >
          <X />
          <span>Reject</span>
        </Button>
        <Button
          style={{ backgroundColor: ACCEPT_COLOR_STRONG }}
          onClick={() => handleAcceptChanges(undefined, context)}
        >
          <Check />
          <span>Accept</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
