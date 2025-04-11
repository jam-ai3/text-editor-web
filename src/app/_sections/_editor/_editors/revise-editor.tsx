"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EditorContext } from "@/contexts/editor-provider";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ChangeEvent, useContext, useEffect, useState } from "react";

export default function ReviseEditor() {
  const context = useContext(EditorContext);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [edit, setEdit] = useState("");
  const sentences = context.editor?.getText().split(/\.\s/) ?? [];
  const values = getEditorValues(sentences, sentenceIndex);

  function handleEdit(event: ChangeEvent<HTMLTextAreaElement>) {
    setEdit(event.target.value);
    // TODO: update editor
  }

  useEffect(() => {
    setEdit(values.edit);
    context.setChatSelection(values.edit);
  }, [values]);

  return (
    <div className="p-4 h-full">
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">{values.preEdit}</p>
        <div className="flex gap-4">
          <Textarea
            value={edit}
            onChange={handleEdit}
            className="resize-none"
          />
          <div className="flex flex-col gap-2">
            <Button
              disabled={sentenceIndex === 0}
              onClick={() => setSentenceIndex((prev) => prev - 1)}
            >
              <ArrowUp />
            </Button>
            <Button
              disabled={sentenceIndex === sentences.length - 1}
              onClick={() => setSentenceIndex((prev) => prev + 1)}
            >
              <ArrowDown />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">{values.postEdit}</p>
      </div>
    </div>
  );
}

type EditorValues = {
  preEdit: string;
  edit: string;
  postEdit: string;
};

function getEditorValues(
  sentences: string[],
  sentenceIndex: number
): EditorValues {
  return {
    preEdit: sentences.slice(0, sentenceIndex).join(". "),
    edit: sentences[sentenceIndex].trim(),
    postEdit: sentences.slice(sentenceIndex + 1).join(". "),
  };
}
