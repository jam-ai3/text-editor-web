"use client";

import { createDocument } from "@/_actions/document";
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
import { Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateButtonProps = {
  userId: string;
};

export default function CreateButton({ userId }: CreateButtonProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    await createDocument(title, userId);
    setLoading(false);
    router.refresh();
  }

  return (
    <Dialog>
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
              <ArrowLeft />
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
