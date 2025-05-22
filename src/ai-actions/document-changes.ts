import { EditorContextType } from "@/contexts/editor-provider";
import Gemini from "./gemini/functions";
import { Change } from "@/lib/types";
import {
  insertIncomingChain,
  insertChangesChain,
  acceptChangesChain,
  rejectChangesChain,
  acceptIncomingChain,
  rejectIncomingChain,
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

  console.log(diff);

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

  if (blocks.length === 0) return context.setNoChanges(true);

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

    if (
      block.current.trim().length === 0 &&
      block.incoming.trim().length === 0
    ) {
      pos += block.current.length;
      continue;
    }

    const id = v4();
    changes.push({
      id,
      current: block.current,
      incoming: block.incoming,
      pos,
      reasoning: "",
    });

    if (block.current.length === 0) {
      chain = insertIncomingChain(chain, block.incoming, id, pos);
      pos += block.incoming.length;
    } else {
      chain = insertChangesChain(chain, block.current, block.incoming, id, pos);
      pos += block.current.length;
    }
  }

  chain.run();

  context.setNoChanges(false);
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

export function acceptAllChanges(context: EditorContextType) {
  if (!context.editor) return;
  let chain = context.editor.chain().focus();
  let offset = 0;
  const contentSize = context.editor.getText().length + 1;

  for (const change of context.changes) {
    if (change.current.length === 0) {
      chain = acceptIncomingChain(chain, change.pos + offset, change.incoming);
    } else {
      const res = acceptChangesChain(
        chain,
        change.pos + offset,
        change.current,
        change.incoming,
        contentSize
      );
      chain = res.chain;
      offset += res.offset;
    }
  }

  chain.setTextSelection({ from: 0, to: 0 }).run();

  context.setChanges([]);
  context.setSelectedChange(null);
}

export function rejectAllChanges(context: EditorContextType) {
  if (!context.editor) return;
  let chain = context.editor.chain().focus();
  let offset = 0;

  for (const change of context.changes) {
    if (change.current.length === 0) {
      chain = rejectIncomingChain(chain, change.pos + offset, change.incoming);
      offset -= change.incoming.length;
    } else {
      chain = rejectChangesChain(chain, change.pos + offset, change.current);
    }
  }

  chain.setTextSelection({ from: 0, to: 0 }).run();

  context.setChanges([]);
  context.setSelectedChange(null);
}
