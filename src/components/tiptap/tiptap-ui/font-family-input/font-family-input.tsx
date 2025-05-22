import { useContext, useEffect, useState } from "react";
import { Button } from "../../tiptap-ui-primitive/button";
import { EditorContext } from "@/contexts/editor-provider";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_FONT_FAMILY, FONT_FAMILIES } from "@/lib/fonts";

export default function FontFamilyInput() {
  const context = useContext(EditorContext);
  const editor = useTiptapEditor(context.editor);
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT_FAMILY);

  function handleFontChange(font: string) {
    setFontFamily(font);
    editor?.chain().focus().setFontFamily(font).run();
    if (editor?.state.selection.empty) {
      editor?.commands.setFontFamily(font);
    }
  }

  function formatName() {
    if (fontFamily.length <= 8) return fontFamily;
    return fontFamily.slice(0, 5) + "...";
  }

  useEffect(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    let fontFamily: string | undefined = undefined;
    let differentFamilies = false;

    editor.state.doc.nodesBetween(from - 1, to, (node) => {
      if (!node.marks) return;
      const mark = node.marks.find((mark) => mark.attrs.fontFamily);
      if (node.content.content.length > 0) return;
      if (!mark) {
        fontFamily = DEFAULT_FONT_FAMILY;
        return;
      }
      const family = mark.attrs.fontFamily ?? DEFAULT_FONT_FAMILY;
      if (fontFamily === undefined) fontFamily = family;
      else if (fontFamily !== family) differentFamilies = true;
    });

    if (differentFamilies) return;

    setFontFamily(fontFamily ?? DEFAULT_FONT_FAMILY);
  }, [editor?.state.selection, editor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          role="button"
          tabIndex={-1}
          aria-label="Font family"
          tooltip="Font Family"
        >
          <span className="w-[8ch] text-sm text-start">{formatName()}</span>
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="max-h-[400px] overflow-y-auto">
          <FontGroup
            label="Selected"
            fonts={[fontFamily]}
            onClick={handleFontChange}
            selected={fontFamily}
          />
          <FontGroup
            label="Sans Serif"
            fonts={FONT_FAMILIES.sansSerif}
            onClick={handleFontChange}
            selected={fontFamily}
          />
          <DropdownMenuSeparator />
          <FontGroup
            label="Serif"
            fonts={FONT_FAMILIES.serif}
            onClick={handleFontChange}
            selected={fontFamily}
          />
          <DropdownMenuSeparator />
          <FontGroup
            label="Monospace"
            fonts={FONT_FAMILIES.monospace}
            onClick={handleFontChange}
            selected={fontFamily}
          />
          <DropdownMenuSeparator />
          <FontGroup
            label="Decorative"
            fonts={FONT_FAMILIES.decorative}
            onClick={handleFontChange}
            selected={fontFamily}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type FontGroupProps = {
  label: string;
  fonts: string[];
  onClick: (font: string) => void;
  selected: string;
};

function FontGroup({ label, fonts, onClick, selected }: FontGroupProps) {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="w-full font-semibold text-sm text-start">
        {label}
      </DropdownMenuLabel>
      {fonts.map((font) => (
        <DropdownMenuItem key={font} asChild>
          <Button
            type="button"
            data-style="ghost"
            role="button"
            onClick={onClick.bind(null, font)}
            data-size="small"
            className="flex justify-between items-center w-full"
          >
            <span className="w-full text-start" style={{ fontFamily: font }}>
              {font}
            </span>
            {font === selected && <CheckIcon className="tiptap-button-icon" />}
          </Button>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
}
