"use client";

import { EditorContext } from "@/contexts/editor-provider";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useContext } from "react";
import { X } from "lucide-react";

export default function NoChangesPanel() {
  const context = useContext(EditorContext);

  function handleDismiss() {
    context.setNoChanges(null);
  }

  if (!context.noChanges) return null;

  return (
    <Card
      className="right-8 absolute w-1/3"
      style={{
        top: `calc(${context.noChanges}px + var(--header-height) + var(--tt-toolbar-height) - 64px)`,
      }}
    >
      <CardHeader>
        <CardTitle>No Changes Made</CardTitle>
        <CardDescription>
          The selected text is well written and does not require changes.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleDismiss}>
          <X />
          <span>Dismiss</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
