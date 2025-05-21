import { EditorContext } from "@/contexts/editor-provider";
import { ChangeEvent, useContext, useState } from "react";
import { UnresolvedChanges } from "./edit-panel";
import { ParaphraseLanguageType } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleParaphrase } from "@/ai-actions/editor";
import { Replace } from "lucide-react";

const MAX_CUSTOM_STYLE_LENGTH = 20;

export default function ParaphrasePanel() {
  const context = useContext(EditorContext);
  const [languageStyle, setLanguageStyle] =
    useState<ParaphraseLanguageType>("academic");
  const [customStyle, setCustomStyle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  if (context.changes.length !== 0) return <UnresolvedChanges />;
  if (!context.editor) return null;

  const { from, to } = context.editor.state.selection;
  const selected = context.editor
    .getText()
    .substring(from - 1, to - 1)
    .trim();

  if (selected.length === 0) return <EmptySelection />;

  function handleStyleChange(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;
    if (text.length < MAX_CUSTOM_STYLE_LENGTH) setCustomStyle(text);
  }

  async function handleParaphraseClick() {
    setIsLoading(true);
    await handleParaphrase(context, languageStyle);
    setIsLoading(false);
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <p className="font-semibold">Selected Text</p>
        <p className="text-sm">{selected}</p>
      </div>
      <div className="flex justify-between">
        <Label className="font-semibold">Language Style</Label>
        <Select
          value={languageStyle}
          onValueChange={(style) =>
            setLanguageStyle(style as ParaphraseLanguageType)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {languageStyle === "custom" && (
        <Input
          placeholder="Style"
          value={customStyle}
          onChange={handleStyleChange}
        />
      )}
      <Button
        variant="accent"
        className="w-full"
        disabled={isLoading || (languageStyle === "custom" && !customStyle)}
        onClick={handleParaphraseClick}
      >
        <span>Paraphrase</span>
        <Replace />
      </Button>
    </div>
  );
}

function EmptySelection() {
  return (
    <div className="place-items-center grid h-full">
      <div className="flex flex-col items-center gap-2 max-w-4/5">
        <p className="font-semibold">Paraphrase Your Text</p>
        <p className="text-muted-foreground text-center">
          Get started by highlighting some text in your document
        </p>
      </div>
    </div>
  );
}
