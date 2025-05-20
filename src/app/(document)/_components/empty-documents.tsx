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
import { useEffect, useState } from "react";

type EmptyDocumentsViewProps = {
  userId: string;
};

export default function EmptyDocumentsView({
  userId,
}: EmptyDocumentsViewProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    if (loading || !title) return;
    setLoading(true);
    await createDocument(title, userId);
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

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
  }, [title, loading]);

  return (
    <main
      className="place-items-center grid"
      style={{ height: "calc(100vh - var(--header-height))" }}
    >
      <div className="flex flex-col items-center gap-4">
        <p className="font-semibold text-xl">No Existing Documents</p>
        <p className="text-muted-foreground">
          Create a document to get started
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <span>Create Document</span>
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
      </div>
    </main>
  );
}
