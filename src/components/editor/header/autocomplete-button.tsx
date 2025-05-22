import { handleAutocomplete } from "@/ai-actions/editor";
import { Button } from "@/components/tiptap/tiptap-ui-primitive/button";
import { EditorContext } from "@/contexts/editor-provider";
import { Sparkles } from "lucide-react";
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
        context.changes.length !== 0 ||
        context.autocomplete !== null
      }
    >
      <span>Autocomplete</span>
      <Sparkles className="tiptap-button-icon" />
    </Button>
  );
}
