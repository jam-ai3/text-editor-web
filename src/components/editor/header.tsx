"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditorContext } from "@/contexts/editor-provider";
import {
  CheckCircle,
  Computer,
  Loader2,
  Pencil,
  Share,
  XCircle,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { getWordcount } from "./helpers";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ACCENT_COLOR } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { Toolbar } from "../tiptap/tiptap-ui-primitive/toolbar/toolbar";
import MainToolbarContent from "./main-toolbar";

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
    <div className="px-4 border-b-2 w-full">
      <div className="flex justify-between items-center p-4 h-[var(--header-height)]">
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
          {/* TODO: add tools dropdown for export etc */}
        </div>
        <div className="flex items-center gap-4">
          <EditorToggle />
          {/* <Button
            onClick={() =>
              handleExport(document.title, editor?.getHTML() ?? "")
            }
          >
            <span>Export</span>
            <Share />
          </Button> */}
        </div>
      </div>
      <Toolbar ref={toolbarRef}>
        <MainToolbarContent />
      </Toolbar>
    </div>
  );
}

async function handleExport(title: string, html: string) {
  console.log(html);
  const serverUrl = process.env.NEXT_PUBLIC_PYTHON_SERVER_URL;
  if (!serverUrl) return;
  try {
    const res = await fetch(`${serverUrl}/pdf`, {
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
    a.download = title + ".pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
}

export function EditorToggle() {
  const { editorType, setEditorType } = useContext(EditorContext);
  const b1Ref = useRef<HTMLButtonElement>(null);
  const b2Ref = useRef<HTMLButtonElement>(null);
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);
  useEffect(() => {
    if (!b1Ref.current || !b2Ref.current) return;
    const b1Info = b1Ref.current.getBoundingClientRect();
    const b2Info = b2Ref.current.getBoundingClientRect();
    if (editorType === "produce") {
      setPillLeft(b1Ref.current.offsetLeft);
      setPillWidth(b1Info.width);
      return;
    }
    if (editorType === "edit") {
      setPillLeft(b2Ref.current.offsetLeft);
      setPillWidth(b2Info.width);
      return;
    }
  }, [editorType]);

  return (
    <div className="relative flex items-center bg-white shadow-sm p-0.5 border border-gray-200 rounded-lg">
      <motion.div
        transition={{ type: "easeInOut", duration: 0.2 }}
        animate={{
          left: pillLeft,
          width: pillWidth,
        }}
        style={{
          background: ACCENT_COLOR,
        }}
        className="top-0.5 bottom-0.5 z-0 absolute rounded-md"
      ></motion.div>
      <p className="text-background"></p>
      <Button
        ref={b1Ref}
        onClick={() => setEditorType("produce")}
        variant="ghost"
        className={cn(
          "hover:bg-transparent text-gray-500 flex items-center gap-2 transition z-10",
          editorType === "produce" && "text-background hover:text-background"
        )}
      >
        <span>Produce</span>
        <Computer />
      </Button>
      <Button
        ref={b2Ref}
        onClick={() => setEditorType("edit")}
        variant="ghost"
        className={cn(
          "hover:bg-transparent text-gray-600 flex items-center gap-2 transition z-10",
          editorType === "edit" && "text-background hover:text-background"
        )}
      >
        <span>AI Edit</span>
        <Pencil />
      </Button>
    </div>
  );
}
