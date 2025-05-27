import {
  checkFullPaperGrammar,
  paraphraseFullPaper,
} from "@/ai-actions/document-changes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditorContext } from "@/contexts/editor-provider";
import { ParaphraseLanguageType } from "@/lib/types";
import { FileCheck, Loader2, Replace } from "lucide-react";
import { ChangeEvent, useContext, useState } from "react";

const MAX_CUSTOM_STYLE_LENGTH = 20;

export default function EditOptions() {
  return (
    <div className="flex flex-col items-center gap-8 py-8 h-full">
      <GrammarOption />
      <OptionSeparator />
      <ParaphraseOption />
    </div>
  );
}

function OptionSeparator() {
  return <div className="bg-border-secondary w-full h-px" />;
}

function GrammarOption() {
  const context = useContext(EditorContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckGrammar() {
    setIsLoading(true);
    await checkFullPaperGrammar(context);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-2 max-w-4/5">
      <p className="font-semibold">Grammar + Spelling</p>
      <p className="text-muted-foreground text-sm text-center">
        Scan your document for errors and potential enhancements in grammar
      </p>
      <Button
        onClick={handleCheckGrammar}
        className="flex items-center gap-2 w-full"
        variant="accent"
      >
        <span>{isLoading ? "Checking..." : "Check"}</span>
        {isLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <FileCheck />
        )}
      </Button>
    </div>
  );
}

function ParaphraseOption() {
  const context = useContext(EditorContext);
  const [isLoading, setIsLoading] = useState(false);
  const [languageStyle, setLanguageStyle] =
    useState<ParaphraseLanguageType>("academic");
  const [customStyle, setCustomStyle] = useState<string>("");

  function handleStyleChange(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;
    if (text.length < MAX_CUSTOM_STYLE_LENGTH) setCustomStyle(text);
  }

  async function handleParaphraseClick() {
    setIsLoading(true);
    await paraphraseFullPaper(
      context,
      languageStyle,
      languageStyle === "custom" ? customStyle : undefined
    );
    setIsLoading(false);
  }

  return (
    <div className="space-y-4 w-4/5">
      <div className="space-y-2">
        <p className="font-semibold text-center">Paraphrase</p>
        <p className="text-muted-foreground text-sm text-center">
          Change the tone and style of your document
        </p>
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
          placeholder="Ex. 'funny', 'conversational', 'exciting'"
          value={customStyle}
          onChange={handleStyleChange}
          onKeyDown={(e) => e.key === "Enter" && handleParaphraseClick()}
        />
      )}
      <Button
        variant="accent"
        className="w-full"
        disabled={isLoading || (languageStyle === "custom" && !customStyle)}
        onClick={handleParaphraseClick}
      >
        <span>{isLoading ? "Paraphrasing..." : "Paraphrase"}</span>
        {isLoading ? <Loader2 className="animate-spin" /> : <Replace />}
      </Button>
    </div>
  );
}
