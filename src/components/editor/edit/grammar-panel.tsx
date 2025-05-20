import { checkFullPaperGrammar } from "@/ai-actions/document-changes";
import { Button } from "@/components/ui/button";
import { EditorContext } from "@/contexts/editor-provider";
import { Loader2, Search } from "lucide-react";
import { useContext, useState } from "react";
import { UnresolvedChanges } from "./edit-panel";

export default function GrammarPanel() {
  const context = useContext(EditorContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckGrammar() {
    setIsLoading(true);
    await checkFullPaperGrammar(context);
    setIsLoading(false);
  }

  if (context.changes.length !== 0) return <UnresolvedChanges />;

  return (
    <div className="place-items-center grid h-full">
      <div className="flex flex-col items-center gap-4 max-w-4/5">
        <p className="font-semibold text-lg">Grammar + Spelling</p>
        <p className="text-muted-foreground text-center">
          Check the grammar and spelling of your entire document for errors
        </p>
        <Button
          onClick={handleCheckGrammar}
          className="flex items-center gap-2"
        >
          <span>{isLoading ? "Checking..." : "Check"}</span>
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Search />
          )}
        </Button>
      </div>
    </div>
  );
}
