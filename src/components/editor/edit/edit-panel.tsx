import { EditorContext } from "@/contexts/editor-provider";
import { EditType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import DocumentPanel from "./document/document-panel";
import IndividualPanel from "./individual/individual-panel";

export const EDIT_PANEL_WIDTH = 400;

export default function EditPanel() {
  const { editType } = useContext(EditorContext);

  function renderPanel() {
    switch (editType) {
      case "document":
        return <DocumentPanel />;
      case "individual":
        return <IndividualPanel />;
    }
  }

  return (
    <div
      className="flex flex-col bg-background border-l-2 h-full overflow-y-auto"
      style={{ width: EDIT_PANEL_WIDTH }}
    >
      <div className="flex border-b-2">
        <EditOption text="Document" value="document" />
        <EditOption text="Individual" value="individual" isLast />
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
        editType === value && "bg-tertiary font-semibold",
        !isLast && "border-r-2"
      )}
      onClick={() => setEditType(value)}
    >
      {text}
    </button>
  );
}
