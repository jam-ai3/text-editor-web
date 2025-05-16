import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";
import { UnresolvedChanges } from "./edit-panel";

export default function ReorderPanel() {
  const context = useContext(EditorContext);

  if (context.changes.length !== 0) return <UnresolvedChanges />;

  return (
    <div>
      <p>Reorder</p>
    </div>
  );
}
