"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Document } from "@prisma/client";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import * as cheerio from "cheerio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { deleteDocument } from "@/_actions/document";
import { useRouter } from "next/navigation";

type DocumentCellProps = {
  document: Document;
};

export default function DocumentCell({ document }: DocumentCellProps) {
  const router = useRouter();

  async function handleDelete() {
    await deleteDocument(document.id);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>{document.title}</CardTitle>
          <CardDescription>
            {document.updatedAt.toLocaleString()}
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete &quot;{document.title}&quot;?</DialogTitle>
              <DialogDescription>
                This action cannot be undone
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4">
              <DialogClose asChild className="flex-1">
                <Button>
                  <ArrowLeft />
                  <span>Cancel</span>
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
              >
                <Trash2 />
                <span>Delete</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>{getDocumentPreview(document.content)}</CardContent>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href={`/document/${document.id}`}>
            <span>Edit</span>
            <Edit />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function getDocumentPreview(content: string) {
  const contentText = cheerio.load(content)("body").text().trim();
  if (contentText.length === 0) return "Empty Document";
  if (contentText.length <= 100) return contentText;
  return contentText.slice(0, 100).split(" ").slice(0, -1).join(" ") + "...";
}
