import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";

export default function useDocument() {
  return useContext(EditorContext);
}
