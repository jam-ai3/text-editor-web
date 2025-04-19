"use client";

import { Plus, Share } from "lucide-react";
import { Button } from "./ui/button";

export function ExportButton() {
  return (
    <Button className="justify-self-end w-fit">
      <span>Export</span>
      <Share />
    </Button>
  );
}

export function CreateDocumentButton() {
  return (
    <Button className="justify-self-end w-fit">
      <span>Create</span>
      <Plus />
    </Button>
  );
}
