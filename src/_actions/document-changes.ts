import { EditorContextType } from "@/contexts/editor-provider";
import { getGrammar } from "./gemini";
import { GeminiOutput, parseGeminiOutput } from "./editor";
import { zip } from "@/lib/utils";
import { Change } from "@/lib/types";
import { v4 } from "uuid";

export async function processSentences(context: EditorContextType) {
  if (!context.editor) return;
  const sentences = context.editor
    .getText()
    .split(/\.\s+/) // split on period followed by any whitespace
    .map((s) => s.trim() + (s[s.length - 1] === "." ? "" : ". ")); // add period back to each sentence

  const timeBefore = Date.now();
  const results = (
    await Promise.all(sentences.map((s) => getGrammar(s, true)))
  ).map(parseGeminiOutput);
  const timeAfter = Date.now();

  const duration = (timeAfter - timeBefore) / 1000;
  console.log(
    `Took ${duration} seconds to process ${sentences.length} sentences.`
  );

  showChanges(context, sentences, results);
}

function showChanges(
  context: EditorContextType,
  sentences: string[],
  changes: GeminiOutput[]
) {
  if (!context.editor) return;
  context.editor.chain().focus().clearContent().run();

  const diffs = zip(sentences, changes);
  let offset = 1; // offset for the current sentence

  const batchChanges: Change[] = [];

  for (const diff of diffs) {
    const [sentence, { improved, reasoning }] = diff;

    // if improved is empty, skip
    if (improved.trim().length === 0 || sentence === improved) {
      context.editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: sentence,
          marks: [
            {
              type: "textStyle",
              attrs: {},
            },
          ],
        })
        .run();
      offset += sentence.length;
      continue;
    }

    // show diff and update offset
    const currentId = v4();
    const incomingId = v4();
    context.editor
      .chain()
      .focus()
      .insertContent({
        type: "text",
        text: sentence,
        marks: [
          {
            type: "textStyle",
            attrs: {
              diffType: "reject",
              id: currentId,
            },
          },
        ],
      })
      .insertContent({
        type: "text",
        text: improved + " ",
        marks: [
          {
            type: "textStyle",
            attrs: {
              diffType: "accept",
              id: incomingId,
            },
          },
        ],
      })
      .run();
    batchChanges.push({
      current: {
        id: currentId,
        text: sentence,
      },
      incoming: {
        id: incomingId,
        text: improved + " ",
      },
      pos: offset,
      reasoning: reasoning ?? "",
    });
    offset += sentence.length + improved.length;
  }

  context.setChanges(batchChanges);
  context.setSelectedChange(batchChanges.length > 0 ? batchChanges[0] : null);
  context.setEditType("changes");
}
