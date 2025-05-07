import { Editor, JSONContent } from "@tiptap/react";
import { rejectDiff, rejectSuggestion } from "./extensions";

export function getWordcount(text: string) {
  return text.trim().split(" ").length;
}

export function removeSuggestion(editor: Editor) {
  const json = editor.getJSON();

  function traverse(
    editor: Editor,
    node: JSONContent,
    offset = 0
  ): true | number {
    const length = node.text?.length ?? 0;

    if (node.marks && node.text) {
      for (const mark of node.marks) {
        if (mark.type === "textStyle" && mark.attrs?.suggestion === true) {
          rejectSuggestion(editor, offset, node.text);
          return true;
        }
      }
    }

    if (node.content && Array.isArray(node.content)) {
      let off = 0;
      for (const content of node.content) {
        const res = traverse(editor, content, offset + off);
        if (typeof res !== "number") return true;
        else off += res;
      }
    }

    return length;
  }

  traverse(editor, json);
}

export function removeDiff(editor: Editor) {
  const json = editor.getJSON();

  function traverse(
    editor: Editor,
    node: JSONContent,
    offset = 0,
    prevStart = 0
  ) {
    const length = node.text?.length ?? 0;

    if (node.marks && node.text) {
      for (const mark of node.marks) {
        if (mark.type === "textStyle" && mark.attrs?.diffType === "accept") {
          const current = editor.getText().substring(prevStart - 1, offset);
          const incoming = node.text;
          rejectDiff(editor, prevStart, current, incoming);
          return true;
        }
      }
    }

    if (node.content && Array.isArray(node.content)) {
      let off = 0;
      let lastOffset = 0;
      for (const content of node.content) {
        const res = traverse(
          editor,
          content,
          offset + off,
          offset + off - lastOffset
        );
        if (typeof res !== "number") return true;
        else {
          off += res;
          lastOffset = res;
        }
      }
    }

    return length;
  }

  traverse(editor, json);
}

export function suggestionExists(editor: Editor) {
  const json = editor.getJSON();

  function traverse(node: JSONContent): boolean {
    if (node.marks && node.text) {
      for (const mark of node.marks) {
        if (mark.type === "textStyle" && mark.attrs?.suggestion === true) {
          return true;
        }
      }
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(traverse).some((r) => r);
    }

    return false;
  }

  return traverse(json);
}

export function diffExists(editor: Editor) {
  const json = editor.getJSON();

  function traverse(node: JSONContent): boolean {
    if (node.marks && node.text) {
      for (const mark of node.marks) {
        if (mark.type === "textStyle" && mark.attrs?.diffType === "accept") {
          return true;
        }
      }
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(traverse).some((r) => r);
    }

    return false;
  }

  return traverse(json);
}
