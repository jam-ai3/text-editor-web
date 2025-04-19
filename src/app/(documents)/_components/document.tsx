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
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document } from "@prisma/client";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type DocumentProps = {
  document: Document;
};

export default function DocumentView({ document }: DocumentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
        <CardDescription>
          Last Edited: {document.updatedAt.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{getDocumentPreview(document.content)}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="w-full">
          <Link href={`/${document.id}`}>
            <Edit />
            <span>Edit</span>
          </Link>
        </Button>
      </CardFooter>

      {/* <DropdownMenu> */}

      <DropdownMenu>
        <DropdownMenuTrigger className="top-2 right-4 absolute">
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/${document.id}`}>
                <Edit />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDialogOpen(true)}
            >
              <Trash2 className="mr-2 w-4 h-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete "<i>{document.title}</i>"?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              document.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between gap-2">
            <DialogClose asChild className="flex-1">
              <Button>Cancel</Button>
            </DialogClose>
            <Button variant="destructive" className="flex-1">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function getDocumentPreview(content: string) {
  const parser = new DOMParser();
  if (content.length === 0) return "Empty Document";
  if (content.length <= 100)
    return parser.parseFromString(content, "text/html").body.innerText;
  const sliced = content.slice(0, 100).split(" ").slice(0, -1).join(" ");
  return parser.parseFromString(sliced, "text/html").body.innerText + "...";
}
