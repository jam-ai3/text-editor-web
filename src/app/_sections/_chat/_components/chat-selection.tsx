import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditorContext } from "@/contexts/editor-provider";
import { Expand } from "lucide-react";
import { useContext } from "react";

const MAX_LENGTH = 100;

function formatText(text: string) {
  if (text.length <= MAX_LENGTH) return text;
  return text.slice(0, MAX_LENGTH).split(" ").slice(0, -1).join(" ") + "...";
}

export default function ChatSelection() {
  const { chatSelection, setChatSelection } = useContext(EditorContext);

  if (!chatSelection) return null;

  return (
    <div className="absolute top-6 left-2 right-6 flex flex-col gap-4 backdrop-blur-md p-4 rounded-md border-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Selected Text</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Expand />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selected Text</DialogTitle>
              <DialogDescription>{chatSelection}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm text-muted-foreground">
        {formatText(chatSelection)}
      </p>
      <Button
        size="sm"
        onClick={() => setChatSelection(null)}
        className="w-full"
      >
        Clear
      </Button>
    </div>
  );
}
