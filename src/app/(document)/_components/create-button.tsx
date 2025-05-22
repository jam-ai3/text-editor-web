"use client";

import { createDocument } from "@/ai-actions/document";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type CreateButtonProps = {
  userId: string;
};

export default function CreateButton({ userId }: CreateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = useCallback(async () => {
    if (loading || !title) return;
    setLoading(true);
    await createDocument(title, userId);
    setLoading(false);
    setOpen(false);
    router.refresh();
  }, [loading, title, userId, router]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "Enter") {
        handleCreate();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleCreate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span>Create</span>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Document</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-4">
          <DialogClose asChild className="flex-1">
            <Button>
              <X />
              <span>Cancel</span>
            </Button>
          </DialogClose>
          <Button
            className="flex-1"
            variant="accent"
            onClick={handleCreate}
            disabled={title.length === 0 || loading}
          >
            <Plus />
            <span>Create</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
