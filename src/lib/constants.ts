import ActionMenu, { DefaultActionMenuRender } from "@yoopta/action-menu-list";
import Blockquote from "@yoopta/blockquote";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import {
  Bold,
  CodeMark,
  Italic,
  Strike,
  Highlight,
  Underline,
} from "@yoopta/marks";
import Paragraph from "@yoopta/paragraph";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";

export const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

// Tools should be defined outside component
export const TOOLS = {
  Toolbar: {
    tool: Toolbar,
    render: DefaultToolbarRender,
  },
  ActionMenu: {
    tool: ActionMenu,
    render: DefaultActionMenuRender,
  },
  LinkTool: {
    tool: LinkTool,
    render: DefaultLinkToolRender,
  },
};

export const PLUGINS = [Blockquote, Paragraph];

export const MENU_BUTTON_SIZE = 16;
