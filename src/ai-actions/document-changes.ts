import { EditorContextType } from "@/contexts/editor-provider";
import Gemini from "./gemini/functions";
import { Change } from "@/lib/types";
import { insertChanges, insertText } from "@/components/editor/extensions";

export async function checkFullPaperGrammar(context: EditorContextType) {
  if (!context.editor) return;
  const text = context.editor.getText();
  const results = await Gemini.checkFullPaperGrammar(text);
  const diff = buildDiff(text, results)
    .filter(
      (block) =>
        (block.type === "normal" && block.text.length !== 0) ||
        (block.type === "diff" &&
          (block.current.length !== 0 || block.incoming.length !== 0))
    )
    .map((block) => {
      switch (block.type) {
        case "normal":
          return { ...block, text: block.text + " " };
        case "diff":
          return {
            ...block,
            current: block.current.length > 0 ? block.current + " " : "",
            incoming: block.incoming.length > 0 ? block.incoming + " " : "",
          };
      }
    });
  showDiff(context, diff);
}

type DiffBlock =
  | {
      type: "normal";
      text: string;
    }
  | {
      type: "diff";
      current: string;
      incoming: string;
    };

function buildDiff(current: string, incoming: string): DiffBlock[] {
  const currentWords = current.split(/\s+/);
  const incomingWords = incoming.split(/\s+/);
  const m = currentWords.length;
  const n = incomingWords.length;

  // Build LCS table
  const lcs: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (currentWords[i] === incomingWords[j]) {
        lcs[i][j] = lcs[i + 1][j + 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1]);
      }
    }
  }

  // Walk through both word lists
  const result: DiffBlock[] = [];
  let i = 0,
    j = 0;

  while (i < m && j < n) {
    if (currentWords[i] === incomingWords[j]) {
      // Start or extend a "normal" block
      const startI = i;
      const startJ = j;
      while (i < m && j < n && currentWords[i] === incomingWords[j]) {
        i++;
        j++;
      }
      result.push({
        type: "normal",
        text: currentWords.slice(startI, i).join(" "),
      });
    } else {
      // Start a diff block
      const startI = i;
      const startJ = j;

      while (i < m && j < n && currentWords[i] !== incomingWords[j]) {
        if (lcs[i + 1][j] >= lcs[i][j + 1]) {
          i++;
        } else {
          j++;
        }
      }

      result.push({
        type: "diff",
        current: currentWords.slice(startI, i).join(" "),
        incoming: incomingWords.slice(startJ, j).join(" "),
      });
    }
  }

  // Handle remaining words
  if (i < m || j < n) {
    result.push({
      type: "diff",
      current: currentWords.slice(i).join(" "),
      incoming: incomingWords.slice(j).join(" "),
    });
  }

  return result;
}

function showDiff(context: EditorContextType, blocks: DiffBlock[]) {
  if (!context.editor) return;
  context.editor.commands.clearContent();

  const changes: Change[] = [];
  let pos = 0;

  for (const block of blocks) {
    switch (block.type) {
      case "normal":
        insertText(context.editor, block.text);
        pos += block.text.length;
        break;
      case "diff":
        const { currentId, incomingId } = insertChanges(
          context.editor,
          block.current,
          block.incoming
        );
        changes.push({
          current: {
            text: block.current,
            id: currentId,
          },
          incoming: {
            text: block.incoming,
            id: incomingId,
          },
          pos,
          reasoning: "",
        });
        break;
    }
  }

  context.setChanges(changes);
  context.setSelectedChange(changes.length > 0 ? changes[0] : null);
}
