"use client";

import { Input } from "@/components/ui/input";
import { EditorContext } from "@/contexts/editor-provider";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useContext } from "react";
import { getWordcount } from "../helpers";
import Link from "next/link";
import Image from "next/image";
import { Toolbar } from "../../tiptap/tiptap-ui-primitive/toolbar/toolbar";
import MainToolbarContent from "./main-toolbar";
import EditorToggle from "./editor-toggle";

type HeaderProps = {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
};

const LOGO_SIZE = 48;

export default function Header({ toolbarRef }: HeaderProps) {
  const { document, setDocument, saveStatus, editor } =
    useContext(EditorContext);

  function renderSaveStatus() {
    switch (saveStatus) {
      case "success":
        return <CheckCircle className="text-green-500" size={16} />;
      case "error":
        return <XCircle className="text-red-500" size={16} />;
      case "pending":
        return <Loader2 className="animate-spin" size={16} />;
    }
  }

  function showWordcount() {
    const selected = editor?.state.selection;
    if (!selected || selected.from === selected.to) {
      return getWordcount(editor?.getText() ?? "");
    }
    const selectedText = editor
      ?.getText()
      .substring(selected.from - 1, selected.to);
    return getWordcount(selectedText ?? "");
  }

  return (
    <div className="border-b-2 w-full">
      <div className="flex justify-between items-center px-8 h-[var(--header-height)]">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/logo-no-bg.png"
              alt="Logo"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
            />
          </Link>
          <Input
            className="w-[256px]"
            value={document.title}
            onChange={(e) =>
              setDocument((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          {renderSaveStatus()}
          <span className="text-muted-foreground text-sm">
            {showWordcount()} Words
          </span>
        </div>
        <EditorToggle />
      </div>
      <Toolbar ref={toolbarRef} className="px-8">
        <MainToolbarContent />
      </Toolbar>
    </div>
  );
}
