import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  CircleSlash2,
  Info,
  X,
} from "lucide-react";

type ToastProps = {
  message: Message;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  function renderIcon() {
    switch (message.variant) {
      case "info":
        return <Info size={16} />;
      case "success":
        return <CheckCircle size={16} />;
      case "warning":
        return <AlertTriangle size={16} />;
      case "danger":
        return <CircleSlash2 size={16} />;
    }
  }

  function renderColor() {
    switch (message.variant) {
      case "info":
        return "bg-blue-500 text-white";
      case "success":
        return "bg-green-500 text-primary";
      case "warning":
        return "bg-yellow-500 text-primary";
      case "danger":
        return "bg-red-500 text-white";
    }
  }

  return (
    <div
      className={cn(
        renderColor(),
        "flex items-center gap-4 px-4 py-2 rounded-md"
      )}
    >
      {renderIcon()}
      <p className="max-w-[160px] text-sm">{message.text}</p>
      <button onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
