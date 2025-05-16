import { Editor, JSONContent } from "@tiptap/react";
import { Mark } from "prosemirror-model";
import { rejectAutocomplete, rejectChanges } from "./extensions";
import { Change } from "@/lib/types";

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
    rejectChanges(
      editor,
      block.current.from,
      block.current.text,
      block.incoming.text
    );
    removeChanges(editor);
  }
}

type ChangeBlockInfo = {
  from: number;
  to: number;
  text: string;
};

type ChangeBlockResult = {
  current: ChangeBlockInfo;
  incoming: ChangeBlockInfo;
};

export function findChangeBlock(editor: Editor): ChangeBlockResult | null {
  let current: ChangeBlockInfo | null = null;
  let incoming: ChangeBlockInfo | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (!node.isText) return;
    node.marks.forEach((mark: Mark) => {
      if (mark.type.name === "textStyle" && mark.attrs?.diffType) {
        const to = pos + node.nodeSize;
        if (mark.attrs.diffType === "reject") {
          current = { from: pos, to, text: node.text ?? "" };
        } else if (mark.attrs.diffType === "accept") {
          incoming = { from: pos, to, text: node.text ?? "" };
        }
      }
    });

    return;
  });

  return current === null || incoming === null ? null : { current, incoming };
}

export function findChangeBlockById(editor: Editor, id: string) {
  let pos = 0;

  editor.state.doc.descendants((node, p) => {
    if (!node.isText) return;
    node.marks.forEach((mark: Mark) => {
      if (mark.type.name === "textStyle" && mark.attrs?.id === id) {
        pos = p;
      }
    });
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
      if (mark.type.name === "textStyle" && mark.attrs?.suggestion === true) {
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
      if (mark.type.name === "textStyle" && mark.attrs.diffType) {
        const oldId = mark.attrs.id;
        const isActive =
          oldId === selectedChange.current.id ||
          oldId === selectedChange.incoming.id;

        // Only update if `active` is changing
        if (mark.attrs.active !== isActive) {
          const from = pos;
          const to = pos + node.nodeSize;

          const newAttrs = {
            ...mark.attrs,
            active: isActive,
          };

          const newMark = schema.marks.textStyle.create(newAttrs);
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
