import { processSentences } from "@/_actions/document-changes";
import { Button } from "@/components/ui/button";
import { EditorContext } from "@/contexts/editor-provider";
import { Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import { UnresolvedChanges } from "./edit-panel";

export default function GrammarPanel() {
  const context = useContext(EditorContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckGrammar() {
    setIsLoading(true);
    await processSentences(context);
    setIsLoading(false);
  }

  if (context.changes.length !== 0) return <UnresolvedChanges />;

  return (
    <div>
      <Button onClick={handleCheckGrammar}>
        <span>{isLoading ? "Checking..." : "Check Grammar"}</span>
        {isLoading && <Loader2 className="animate-spin" size={16} />}
      </Button>
    </div>
  );
}
