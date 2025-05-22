import { Editor, JSONContent } from "@tiptap/react";
import { Mark } from "prosemirror-model";
import { rejectAutocomplete, rejectChanges } from "./extensions";
import { Change } from "@/lib/types";
import { EditorContextType } from "@/contexts/editor-provider";

export function getWordcount(text: string) {
  return text.trim().split(" ").length;
}

export function removeAutocomplete(editor: Editor) {
  const block = findAutocompleteBlock(editor);
  if (block) {
    rejectAutocomplete(editor, block.pos, block.text);
    removeAutocomplete(editor);
  }
}

export function removeChanges(editor: Editor) {
  const block = findChangeBlock(editor);
  if (block) {
    rejectChanges(editor, block.from, block.text);
    removeChanges(editor);
  }
}

type ChangeBlockInfo = {
  from: number;
  to: number;
  text: string;
};

export function findChangeBlock(editor: Editor): ChangeBlockInfo | null {
  let change: ChangeBlockInfo | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (!node.isText) return;
    node.marks.forEach((mark: Mark) => {
      if (mark.attrs?.changeBlock || mark.attrs?.incomingBlock) {
        const to = pos + node.nodeSize;
        change = { from: pos, to, text: node.text ?? "" };
      }
    });

    return;
  });

  return change;
}

export function findChangeBlockById(editor: Editor, id: string) {
  let pos = -1;

  editor.state.doc.descendants((node, p) => {
    if (!node.isText || pos !== -1) return;
    for (const mark of node.marks) {
      if (mark.attrs?.id === id) {
        pos = p;
        return;
      }
    }
  });

  return pos;
}

type AutocompleteInfo = {
  pos: number;
  text: string;
};

export function findAutocompleteBlock(editor: Editor): AutocompleteInfo | null {
  let result: AutocompleteInfo | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (!node.isText) return;
    node.marks.forEach((mark: Mark) => {
      if (mark.attrs?.suggestion) {
        result = { pos, text: node.text ?? "" };
      }
    });
  });

  return result;
}

export function setActiveBlock(editor: Editor, selectedChange: Change) {
  const { state, schema } = editor;
  const { tr, doc } = state;
  let transaction = tr;

  doc.descendants((node, pos) => {
    if (!node.isText) return;

    node.marks.forEach((mark) => {
      if (mark.attrs.changeBlock || mark.attrs.incomingBlock) {
        const oldId = mark.attrs.id;
        const isActive =
          oldId === selectedChange.id || oldId === selectedChange.id;

        // Only update if `active` is changing
        if (mark.attrs.active !== isActive) {
          const from = pos;
          const to = pos + node.nodeSize;

          const newAttrs = {
            ...mark.attrs,
            active: isActive,
          };

          const newMark = schema.marks.change.create(newAttrs);
          transaction = transaction.removeMark(from, to, mark);
          transaction = transaction.addMark(from, to, newMark);
        }
      }
    });
  });

  if (transaction.docChanged) {
    editor.view.dispatch(transaction);
  }
}

export type JSONContentWithText = JSONContent & { text: string };

export function getBlocks(node: JSONContent) {
  const blocks: JSONContentWithText[] = [];

  if (!Array.isArray(node.content)) {
    return node.text ? [node as JSONContentWithText] : [];
  }

  node.content.forEach((child) => blocks.push(...getBlocks(child)));

  return blocks;
}

export function updateChanges(context: EditorContextType) {
  const ids: string[] = [];

  if (!context.editor) return;
  context.editor.state.doc.descendants((node) => {
    if (!node.isText) return;
    node.marks.forEach((mark: Mark) => {
      if (mark.attrs?.changeBlock || mark.attrs?.incomingBlock) {
        ids.push(mark.attrs.id);
      }
    });
  });

  const existingChanges: Change[] = JSON.parse(
    localStorage.getItem("changes") || "[]"
  );

  const newChanges = existingChanges.filter((c) => ids.includes(c.id));

  context.setChanges(newChanges);
  if (context.selectedChange === null && newChanges.length > 0) {
    context.setSelectedChange(newChanges[0]);
  }
}
