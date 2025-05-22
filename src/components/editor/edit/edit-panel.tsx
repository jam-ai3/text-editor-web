import { EditorContext } from "@/contexts/editor-provider";
import { EditType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import ChangesPanel from "./changes-panel";
import GrammarPanel from "./grammar-panel";
// import ReorderPanel from "./reorder-panel";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ParaphrasePanel from "./paraphrase-panel";

export const EDIT_PANEL_WIDTH = 400;

export default function EditPanel() {
  const { editType } = useContext(EditorContext);

  function renderPanel() {
    switch (editType) {
      // case "reorder": // TODO: implement
      //   return <ReorderPanel />;
      case "changes":
        return <ChangesPanel />;
      case "grammar":
        return <GrammarPanel />;
      case "paraphrase":
        return <ParaphrasePanel />;
    }
  }

  return (
    <div
      className="flex flex-col bg-[var(--tertiary)] border-l-2 h-full"
      style={{ width: EDIT_PANEL_WIDTH }}
    >
      <div className="flex border-b-2">
        <EditOption text="Grammar" value="grammar" />
        <EditOption text="Paraphrase" value="paraphrase" />
        {/* <EditOption text="Reorder" value="reorder" /> */}
        <EditOption text="Changes" value="changes" isLast />
      </div>
      {renderPanel()}
    </div>
  );
}

type EditOptionProps = {
  text: string;
  value: EditType;
  isLast?: boolean;
};

function EditOption({ text, value, isLast = false }: EditOptionProps) {
  const { editType, setEditType } = useContext(EditorContext);

  return (
    <button
      className={cn(
        "flex-1 text-sm",
        editType === value && "bg-border font-semibold",
        !isLast && "border-r-2"
      )}
      onClick={() => setEditType(value)}
    >
      {text}
    </button>
  );
}

export function UnresolvedChanges() {
  const { changes, setEditType } = useContext(EditorContext);

  return (
    <div className="place-items-center grid h-full">
      <div className="flex flex-col items-center gap-2 w-4/5">
        <p className="font-semibold">
          {changes.length} Unresolved Change{changes.length === 1 ? "" : "s"}
        </p>
        <p className="text-muted-foreground text-center">
          Please resolve all existing changes before continuing
        </p>
        <Button
          variant="accent"
          className="mt-2"
          onClick={() => setEditType("changes")}
        >
          <span>Resolve Changes</span>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
