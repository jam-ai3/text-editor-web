import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";
import { UnresolvedChanges } from "./edit-panel";
import { Button } from "@/components/ui/button";

export default function ReorderPanel() {
  const context = useContext(EditorContext);

  if (context.changes.length !== 0) return <UnresolvedChanges />;

  function splitByParagraph() {
    return (
      context.editor
        ?.getText()
        .split("\n")
        .filter((p) => p.length > 0) ?? []
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <p>Reorder</p>
      {splitByParagraph().map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <Button onClick={splitByParagraph}>Split</Button>
    </div>
  );
}
