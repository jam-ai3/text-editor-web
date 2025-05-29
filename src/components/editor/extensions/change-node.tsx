import { ACCEPT_COLOR, REJECT_COLOR } from "@/lib/constants";
import { Editor, Node } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";

export const IndividualChangeNode = Node.create({
  name: "changeNode",

  group: "block",
  content: "currentBlock incomingBlock",

  parseHTML() {
    return [{ tag: "div[data-change]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-change": "true" }, 0];
  },

  addAttributes() {
    return {
      id: {
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          return { id: attributes.id };
        },
      },
      current: {
        parseHTML: (element) => element.getAttribute("data-current"),
        renderHTML: (attributes) => {
          if (!attributes.current) return {};
          return {
            "data-current": attributes.current,
          };
        },
      },
      incoming: {
        parseHTML: (element) => element.getAttribute("data-incoming"),
        renderHTML: (attributes) => {
          if (!attributes.incoming) return {};
          return {
            "data-incoming": attributes.incoming,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(() => (
      <NodeViewWrapper as="div" data-change>
        <NodeViewContent as="div" className="current" />
        <NodeViewContent as="div" className="incoming" />
      </NodeViewWrapper>
    ));
  },
});

export const CurrentBlock = Node.create({
  name: "currentBlock",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: "div[data-block='current']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        ...HTMLAttributes,
        "data-block": "current",
        style: `background-color: ${REJECT_COLOR}`,
      },
      0,
    ];
  },
});

export const IncomingBlock = Node.create({
  name: "incomingBlock",
  group: "block",
  content: "inline*",

  parseHTML() {
    return [{ tag: "div[data-block='incoming']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        ...HTMLAttributes,
        "data-block": "incoming",
        style: `background-color: ${ACCEPT_COLOR}`,
      },
      0,
    ];
  },
});

// TODO: maybe try to remove block element if empty after deleting change block

export function acceptIndividualChange(
  editor: Editor,
  from: number,
  current: string,
  incoming: string
) {
  const docLength = editor.getText().length + 1;
  const length = current.length + incoming.length + 4;
  const to = from + length > docLength ? docLength : from + length;
  editor
    .chain()
    .focus()
    .deleteRange({ from, to })
    .insertContentAt(from, { type: "text", text: incoming })
    .run();
}

export function rejectIndividualChange(
  editor: Editor,
  from: number,
  current: string,
  incoming: string
) {
  const docLength = editor.getText().length + 1;
  const length = current.length + incoming.length + 4;
  const to = from + length > docLength ? docLength : from + length;
  editor
    .chain()
    .focus()
    .deleteRange({ from, to })
    .insertContentAt(from, { type: "text", text: current })
    .run();
}
