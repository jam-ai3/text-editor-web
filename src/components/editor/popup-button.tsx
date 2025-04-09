"use client";

import { EditorContext, EditorContextType } from "@/contexts/editor-provider";
import { MENU_BUTTON_SIZE } from "@/lib/constants";
import { ElementType, useContext } from "react";

type PopupButtonProps = {
  Component: ElementType;
  onClick: (context: EditorContextType) => void;
};

export default function PopupButton({ Component, onClick }: PopupButtonProps) {
  const context = useContext(EditorContext);

  return (
    <button className="menu-button" onClick={onClick.bind(null, context)}>
      <Component size={MENU_BUTTON_SIZE} />
    </button>
  );
}

export function PopupDivider() {
  return <span className="text-2xl">|</span>;
}
