import { Button } from "@/components/ui/button";
import { EditorContext } from "@/contexts/editor-provider";
import { ACCENT_COLOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Computer, Pencil } from "lucide-react";
import { useContext, useRef, useState, useEffect } from "react";

export default function EditorToggle() {
  const { editorType, setEditorType } = useContext(EditorContext);
  const b1Ref = useRef<HTMLButtonElement>(null);
  const b2Ref = useRef<HTMLButtonElement>(null);
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);

  useEffect(() => {
    if (!b1Ref.current || !b2Ref.current) return;
    const b1Info = b1Ref.current.getBoundingClientRect();
    const b2Info = b2Ref.current.getBoundingClientRect();
    if (editorType === "produce") {
      setPillLeft(b1Ref.current.offsetLeft);
      setPillWidth(b1Info.width);
      return;
    }
    if (editorType === "edit") {
      setPillLeft(b2Ref.current.offsetLeft);
      setPillWidth(b2Info.width);
      return;
    }
  }, [editorType]);

  return (
    <div className="relative flex items-center bg-background shadow-sm p-0.5 rounded-lg">
      <motion.div
        transition={{ type: "easeInOut", duration: 0.2 }}
        animate={{
          left: pillLeft,
          width: pillWidth,
        }}
        style={{ background: ACCENT_COLOR }}
        className="top-0.5 bottom-0.5 z-0 absolute rounded-md"
      ></motion.div>
      <p className="text-background"></p>
      <Button
        ref={b1Ref}
        onClick={() => setEditorType("produce")}
        variant="ghost"
        className={cn(
          "hover:bg-transparent text-muted-foreground flex items-center gap-2 transition z-10",
          editorType === "produce" && "text-background hover:text-background"
        )}
      >
        <span>Produce</span>
        <Computer />
      </Button>
      <Button
        ref={b2Ref}
        onClick={() => setEditorType("edit")}
        variant="ghost"
        className={cn(
          "hover:bg-transparent text-muted-foreground flex items-center gap-2 transition z-10",
          editorType === "edit" && "text-background hover:text-background"
        )}
      >
        <span>AI Edit</span>
        <Pencil />
      </Button>
    </div>
  );
}
