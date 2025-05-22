import { handleAutocomplete } from "@/ai-actions/editor";
import { Button } from "@/components/ui/button";
import { EditorContext } from "@/contexts/editor-provider";
import { Sparkles } from "lucide-react";
import { useContext } from "react";

export default function AutocompleteButton() {
  const context = useContext(EditorContext);

  return (
    <Button
      variant="ghost"
      onClick={() => handleAutocomplete(context)}
      disabled={
        context.aiResponseLoading ||
        context.changes.length !== 0 ||
        context.autocomplete !== null
      }
    >
      <span>Autocomplete</span>
      <Sparkles />
    </Button>
  );
}
