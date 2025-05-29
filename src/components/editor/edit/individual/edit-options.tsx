import {
  handleFluidity,
  handleGrammar,
  handleParaphrase,
  handleResize,
} from "@/ai-actions/editor";
import HorizontalSeparator from "@/components/horizontal-separator";
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
import useDocument from "@/hooks/useDocument";
import { MAX_CUSTOM_STYLE_LENGTH, MAX_RESIZE_LENGTH } from "@/lib/constants";
import { ParaphraseLanguageType } from "@/lib/types";
import { FileCheck, MoveHorizontal, Replace, Waves } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

export default function EditOptions() {
  const context = useDocument();
  if (!context.editor) return null;
  const { from, to } = context.editor.state.selection;
  const selected = context.editor.getText().substring(from - 1, to - 1);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <SelectedText selected={selected} />
      <HorizontalSeparator />
      <GrammarOption />
      <HorizontalSeparator />
      <ParaphraseOption />
      <HorizontalSeparator />
      <ResizeOption />
      <HorizontalSeparator />
      <FluidityOption />
    </div>
  );
}

type EditOptionProps = {
  selected: string;
};

function SelectedText({ selected }: EditOptionProps) {
  if (selected.length === 0) {
    return (
      <div className="place-items-center grid h-full">
        <div className="flex flex-col items-center gap-2">
          <p className="font-semibold">No Text Selected</p>
          <p className="text-muted-foreground text-sm">
            Select some text in your document to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-4/5">
      <p className="font-semibold text-center">Selected Text</p>
      <p className="text-muted-foreground text-sm">{selected}</p>
    </div>
  );
}

function GrammarOption() {
  const context = useDocument();

  async function handleClick() {
    await handleGrammar(context);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-4/5">
      <p className="font-semibold">Grammar + Spelling</p>
      <p className="text-muted-foreground text-sm text-center">
        Scan the selected text for errors and potential enhancements in grammar
      </p>
      <Button
        onClick={handleClick}
        disabled={context.aiResponseLoading}
        className="flex items-center gap-2 w-full"
        variant="accent"
      >
        <span>Check</span>
        <FileCheck />
      </Button>
    </div>
  );
}

function ParaphraseOption() {
  const context = useDocument();
  const [style, setStyle] = useState<ParaphraseLanguageType>("academic");
  const [customStyle, setCustomStyle] = useState<string>("");

  async function handleClick() {
    await handleParaphrase(context, style, customStyle);
  }

  function handleStyleChange(event: ChangeEvent<HTMLInputElement>) {
    const text = event.target.value;
    if (text.length < MAX_CUSTOM_STYLE_LENGTH) setCustomStyle(text);
  }

  return (
    <div className="space-y-4 w-4/5">
      <p className="font-semibold text-center">Paraphrase</p>
      <p className="text-muted-foreground text-sm text-center">
        Change the tone and style of the selected text
      </p>
      <div className="flex justify-between">
        <Label className="font-semibold">Language Style</Label>
        <Select
          value={style}
          onValueChange={(value) => setStyle(value as ParaphraseLanguageType)}
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
      {style === "custom" && (
        <Input
          placeholder="Ex. 'funny', 'conversational', 'exciting'"
          value={customStyle}
          onChange={handleStyleChange}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
        />
      )}
      <Button
        className="flex items-center gap-2 w-full"
        variant="accent"
        disabled={context.aiResponseLoading}
        onClick={handleClick}
      >
        <span>Paraphrase</span>
        <Replace />
      </Button>
    </div>
  );
}

function ResizeOption() {
  const context = useDocument();
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    const minInt = minInput.current
      ? parseInt(minInput.current.value)
      : undefined;
    const maxInt = maxInput.current
      ? parseInt(maxInput.current.value)
      : undefined;
    const minLength = isNaN(minInt ?? NaN) ? undefined : minInt;
    const maxLength = isNaN(maxInt ?? NaN) ? undefined : maxInt;
    if (!minLength || !maxLength) return setError("Missing length range");
    if (minLength < 0 || maxLength > MAX_RESIZE_LENGTH) {
      return setError(
        `Length range must be between 0 and ${MAX_RESIZE_LENGTH}`
      );
    }
    await handleResize(context, minLength, maxLength);
  }

  return (
    <div className="space-y-4 w-4/5">
      <p className="font-semibold text-center">Resize</p>
      <p className="text-muted-foreground text-sm text-center">
        Rewrite the selected text to meet a specific length range
      </p>
      <div className="flex gap-4">
        <Input placeholder="Min Characters" type="number" ref={minInput} />
        <Input placeholder="Max Characters" type="number" ref={maxInput} />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button
        className="flex items-center gap-2 w-full"
        variant="accent"
        disabled={context.aiResponseLoading}
        onClick={handleClick}
      >
        <span>Resize</span>
        <MoveHorizontal />
      </Button>
    </div>
  );
}

function FluidityOption() {
  const context = useDocument();

  async function handleClick() {
    await handleFluidity(context);
  }

  return (
    <div className="space-y-4 w-4/5">
      <p className="font-semibold text-center">Fluidity</p>
      <p className="text-muted-foreground text-sm text-center">
        Improve the fluidity of the selected text
      </p>
      <Button
        className="flex items-center gap-2 w-full"
        variant="accent"
        disabled={context.aiResponseLoading}
        onClick={handleClick}
      >
        <span>Fluidity</span>
        <Waves />
      </Button>
    </div>
  );
}
