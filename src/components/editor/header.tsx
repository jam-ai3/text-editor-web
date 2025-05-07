"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditorContext } from "@/contexts/editor-provider";
import { CheckCircle, Loader2, Share, XCircle } from "lucide-react";
import { useContext } from "react";
import { getWordcount } from "./helpers";

export default function Header() {
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
    <div className="flex justify-between items-center p-4 h-[var(--header-height)]">
      <div className="flex items-center gap-4">
        {renderSaveStatus()}
        <Input
          className="w-[256px]"
          value={document.title}
          onChange={(e) =>
            setDocument((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <span className="text-muted-foreground text-sm">
          {showWordcount()} Words
        </span>
      </div>
      <Button onClick={() => handleExport(document.title, document.content)}>
        <span>Export</span>
        <Share />
      </Button>
    </div>
  );
}

async function handleExport(title: string, html: string) {
  fetch("/api/pdf", {
    method: "POST",
    body: JSON.stringify({ title, html }),
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = title + ".pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    });
}
