import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";

export default function ReorderPanel() {
  const context = useContext(EditorContext);

  return (
    <div>
      <p>Reorder</p>
    </div>
  );
}
