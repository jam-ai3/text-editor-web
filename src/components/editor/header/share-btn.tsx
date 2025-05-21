import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditorContext } from "@/contexts/editor-provider";
import { Share } from "lucide-react";
import React, { useContext } from "react";

export default function ShareButton() {
  const { document } = useContext(EditorContext);

  function handleExportClick(type: FileType) {
    handleExport(document.title, document.content, type);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <span>Share</span>
          <Share />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportClick.bind(null, "pdf")}>
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportClick.bind(null, "docx")}>
          docx
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type FileType = "pdf" | "docx";

async function handleExport(title: string, html: string, type: FileType) {
  const serverUrl = process.env.NEXT_PUBLIC_PYTHON_SERVER_URL;
  if (!serverUrl) return;
  try {
    const res = await fetch(`${serverUrl}/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, html }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.${type}`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
}
