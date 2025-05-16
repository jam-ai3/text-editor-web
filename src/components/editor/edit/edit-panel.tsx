import { EditorContext } from "@/contexts/editor-provider";
import { EditType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import ChangesPanel from "./changes-panel";
import GrammarPanel from "./grammar-panel";
import ReorderPanel from "./reorder-panel";

export default function EditPanel() {
  const { editType } = useContext(EditorContext);

  function renderPanel() {
    switch (editType) {
      case "reorder":
        return <ReorderPanel />;
      case "changes":
        return <ChangesPanel />;
      case "grammar":
        return <GrammarPanel />;
    }
  }

  return (
    <div className="flex flex-col bg-secondary border-l-2 w-[400px] h-full">
      <div className="flex border-b-2">
        <EditOption text="Reorder" value="reorder" />
        <EditOption text="Grammar" value="grammar" />
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
