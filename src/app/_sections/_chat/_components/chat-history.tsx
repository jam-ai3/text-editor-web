import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";

const chatHistory = [
  {
    content: "some text",
    role: "user",
  },
  {
    content: "some text",
    role: "ai",
  },
  {
    content: "some very long response that should be truncated",
  },
  {
    content: "some text",
    role: "user",
  },
  {
    content: "some text",
    role: "ai",
  },
  {
    content: "some very long response that should be truncated",
  },
  {
    content: "some text",
    role: "user",
  },
  {
    content: "some text",
    role: "ai",
  },
  {
    content: "some very long response that should be truncated",
  },
  {
    content: "some text",
    role: "user",
  },
  {
    content: "some text",
    role: "ai",
  },
  {
    content: "some very long response that should be truncated",
  },
  {
    content: "some text",
    role: "user",
  },
  {
    content: "some text",
    role: "ai",
  },
  {
    content: "some very long response that should be truncated",
  },
];

export default function ChatHistory() {
  // const { chatHistory } = useContext(EditorContext);

  return (
    <div className="overflow-y-auto flex-1 flex flex-col gap-2 pr-4 py-4">
      {chatHistory.map((chat, index) => (
        <div
          key={index}
          className={`border-2 rounded-md max-w-2/3 p-2 text-sm ${
            chat.role === "user" ? "ml-auto" : "mr-auto bg-secondary"
          }`}
        >
          {chat.content}
        </div>
      ))}
    </div>
  );
}
