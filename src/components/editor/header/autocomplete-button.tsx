import { handleAutocomplete } from "@/ai-actions/editor";
import { Button } from "@/components/tiptap/tiptap-ui-primitive/button";
import { EditorContext } from "@/contexts/editor-provider";
import { Loader2, Sparkles } from "lucide-react";
import { useContext } from "react";

export default function AutocompleteButton() {
  const context = useContext(EditorContext);

  return (
    <Button
      type="button"
      data-style="ghost"
      role="button"
      data-apperance="default"
      aria-label="test aria label"
      tooltip="Autocomplete"
      shortcutKeys="Ctrl-k"
      onClick={() => handleAutocomplete(context)}
      disabled={
        context.aiResponseLoading ||
        context.autocompleteLoading ||
        context.changes.length !== 0 ||
        context.autocomplete !== null
      }
    >
      <span>
        {context.autocompleteLoading ? "Generating..." : "Autocomplete"}
      </span>
      {context.autocompleteLoading ? (
        <Loader2 className="animate-spin tiptap-button-icon" />
      ) : (
        <Sparkles className="tiptap-button-icon" />
      )}
    </Button>
  );
}
