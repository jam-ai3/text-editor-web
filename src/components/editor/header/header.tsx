"use client";

import { Input } from "@/components/ui/input";
import { EditorContext } from "@/contexts/editor-provider";
import { CheckCircle, Info, Loader2, XCircle } from "lucide-react";
import { useContext } from "react";
import Image from "next/image";
import { Toolbar } from "../../tiptap/tiptap-ui-primitive/toolbar/toolbar";
import MainToolbarContent from "./main-toolbar";
import EditorToggle from "./editor-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Tools from "./tools";

type HeaderProps = {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
};

const LOGO_SIZE = 48;

export default function Header({ toolbarRef }: HeaderProps) {
  const { document, setDocument, saveStatus } = useContext(EditorContext);

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

  return (
    <div className="border-b-2 w-full">
      <div className="flex justify-between items-center px-8 h-[var(--header-height)]">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Image
                  src="/logo-no-bg.png"
                  alt="Logo"
                  width={LOGO_SIZE}
                  height={LOGO_SIZE}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Documents</TooltipContent>
          </Tooltip>
          {renderSaveStatus()}
          <Input
            className="w-[256px]"
            value={document.title}
            onChange={(e) =>
              setDocument((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Info size={12} />
                <span>Info</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Tools />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <EditorToggle />
      </div>
      <Toolbar ref={toolbarRef} className="px-8">
        <MainToolbarContent />
      </Toolbar>
    </div>
  );
}
