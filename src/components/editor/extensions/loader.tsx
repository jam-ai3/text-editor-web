import { Loader2 } from "lucide-react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

export const LoaderNode = Node.create({
  name: "loaderNode",

  inline: true,
  group: "inline",
  atom: true,

  parseHTML() {
    return [
      {
        tag: "span[data-loader]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-loader": "true",
        contenteditable: "false",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(() => (
      <NodeViewWrapper
        as="span"
        data-loader
        contentEditable={false}
        className="inline-flex justify-center items-center"
      >
        <Loader2 className="text-muted-foreground animate-spin" size={16} />
      </NodeViewWrapper>
    ));
  },
});
