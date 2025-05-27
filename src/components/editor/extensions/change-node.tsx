import { ACCEPT_COLOR, REJECT_COLOR } from "@/lib/constants";
import { Node, NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

export const IndividualChangeNode = Node.create({
  name: "changeNode",

  inline: false,
  group: "block",
  atom: false,
  content: "",

  parseHTML() {
    return [
      {
        tag: "div[data-change]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes];
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
    return ReactNodeViewRenderer((props: NodeViewProps) => {
      const { current, incoming } = props.node.attrs;

      return (
        <NodeViewWrapper as="div" data-change contentEditable={false}>
          <p style={{ backgroundColor: REJECT_COLOR }}>{current}</p>
          <p style={{ backgroundColor: ACCEPT_COLOR }}>{incoming}</p>
        </NodeViewWrapper>
      );
    });
  },
});
