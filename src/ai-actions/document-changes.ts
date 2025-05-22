import { EditorContextType } from "@/contexts/editor-provider";
import Gemini from "./gemini/functions";
import { Change } from "@/lib/types";
import {
  insertIncoming,
  insertChangesAt,
  insertIncomingChain,
  insertChangesChain,
} from "@/components/editor/extensions";
import { v4 } from "uuid";

export async function checkFullPaperGrammar(context: EditorContextType) {
  if (!context.editor) return;
  const text = context.editor.getText();
  const results = await Gemini.checkFullPaperGrammar(text);
  const diff = buildDiff(text, results).filter(
    (block) =>
      (block.type === "normal" && block.text.length !== 0) ||
      (block.type === "diff" &&
        (block.current.length !== 0 || block.incoming.length !== 0))
  );

  showDiff(context, diff);
}

type DiffBlock =
  | { type: "normal"; text: string }
  | { type: "diff"; current: string; incoming: string };

// Tokenize into words + whitespace chunks (preserves formatting)
function tokenize(text: string): string[] {
  return Array.from(text.matchAll(/(\s+|\S+)/g)).map((m) => m[0]);
}

export function buildDiff(current: string, incoming: string): DiffBlock[] {
  const currentTokens = tokenize(current);
  const incomingTokens = tokenize(incoming);
  const m = currentTokens.length;
  const n = incomingTokens.length;

  // LCS table
  const lcs: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (currentTokens[i] === incomingTokens[j]) {
        lcs[i][j] = lcs[i + 1][j + 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1]);
      }
    }
  }

  const result: DiffBlock[] = [];
  let i = 0,
    j = 0;

  while (i < m && j < n) {
    if (currentTokens[i] === incomingTokens[j]) {
      const startI = i;
      while (i < m && j < n && currentTokens[i] === incomingTokens[j]) {
        i++;
        j++;
      }
      result.push({
        type: "normal",
        text: currentTokens.slice(startI, i).join(""),
      });
    } else {
      const curStart = i;
      const incStart = j;

      while (i < m && j < n && currentTokens[i] !== incomingTokens[j]) {
        if (lcs[i + 1][j] >= lcs[i][j + 1]) i++;
        else j++;
      }

      result.push({
        type: "diff",
        current: currentTokens.slice(curStart, i).join(""),
        incoming: incomingTokens.slice(incStart, j).join(""),
      });
    }
  }

  // Handle leftovers
  if (i < m || j < n) {
    result.push({
      type: "diff",
      current: currentTokens.slice(i).join(""),
      incoming: incomingTokens.slice(j).join(""),
    });
  }

  return result;
}

function showDiff(context: EditorContextType, blocks: DiffBlock[]) {
  if (!context.editor) return;

  const changes: Change[] = [];
  let pos = 1;
  let chain = context.editor.chain().focus();

  for (const block of blocks) {
    if (block.type === "normal") {
      pos += block.text.length;
      continue;
    }

    if (block.current.length === 0 && block.incoming.length === 0) {
      continue;
    }

    const id = v4();
    if (block.current.length === 0) {
      insertIncomingChain(chain, block.incoming, id, pos);
      pos += block.incoming.length;
    } else {
      insertChangesChain(chain, block.current, block.incoming, id, pos);
      pos += block.current.length;
    }
    changes.push({
      id,
      current: block.current,
      incoming: block.incoming,
      pos,
      reasoning: "",
    });
  }

  chain.run();

  context.setChanges(changes);
  if (changes.length > 0) {
    context.setSelectedChange(changes[0]);
    context.editor
      .chain()
      .focus()
      .setTextSelection({ from: changes[0].pos, to: changes[0].pos })
      .run();
  }
}

export function acceptAllChanges() {}

export function rejectAllChanges() {}
