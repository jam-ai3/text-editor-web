"use client";

import { Button } from "@/components/ui/button";
import { EditorContext } from "@/contexts/editor-provider";
import { LockOption } from "@/lib/types";
import { ArrowUpDown, Edit, RefreshCcw } from "lucide-react";
import { ReactNode, useContext } from "react";

export default function LockSidebar() {
  const { lock, setLock } = useContext(EditorContext);

  return (
    <ul className="flex flex-col gap-4 bg-secondary py-4 px-2 w-fit h-full">
      <li>
        <LockButton lock="produce" currentLock={lock} setLock={setLock}>
          <Edit />
        </LockButton>
      </li>
      <li>
        <LockButton lock="revise" currentLock={lock} setLock={setLock}>
          <RefreshCcw />
        </LockButton>
      </li>
      <li>
        <LockButton lock="reorder" currentLock={lock} setLock={setLock}>
          <ArrowUpDown />
        </LockButton>
      </li>
    </ul>
  );
}

type LockButtonProps = {
  lock: LockOption;
  currentLock: LockOption;
  setLock: (lock: LockOption) => void;
  children: ReactNode;
};

function LockButton({ lock, currentLock, setLock, children }: LockButtonProps) {
  function handleClick() {
    setLock(lock === currentLock ? "all" : lock);
  }

  return (
    <Button
      size="sm"
      onClick={handleClick}
      variant={lock === currentLock ? "default" : "outline"}
    >
      {children}
    </Button>
  );
}
