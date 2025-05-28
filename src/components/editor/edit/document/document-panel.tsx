import ChangesPanel from "./changes-tab";
import EditOptions from "./edit-options";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import useDocument from "@/hooks/useDocument";

export default function DocumentPanel() {
  const context = useDocument();

  if (!context.selectedChange) return <EditOptions />;

  if (context.selectedChange.isIndividual)
    return (
      <div className="place-items-center grid h-full">
        <div className="flex flex-col items-center gap-2 max-w-4/5">
          <p className="font-semibold">Unresolved Change</p>
          <p className="text-muted-foreground text-sm text-center">
            Please resolve all changes before continuing
          </p>
          <Button
            className="flex items-center gap-2"
            onClick={() => context.setEditType("individual")}
          >
            <span>Resolve</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    );

  return <ChangesPanel />;
}
