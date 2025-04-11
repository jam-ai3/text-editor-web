import { EditorContext } from "@/contexts/editor-provider";
import { useContext } from "react";

// const chatHistory = [
//   {
//     content: "some text",
//     role: "user",
//   },
//   {
//     content: "some text",
//     role: "ai",
//   },
//   {
//     content: "some very long response that should be truncated",
//   },
//   {
//     content: "some text",
//     role: "user",
//   },
//   {
//     content: "some text",
//     role: "ai",
//   },
//   {
//     content: "some very long response that should be truncated",
//   },
//   {
//     content: "some text",
//     role: "user",
//   },
//   {
//     content: "some text",
//     role: "ai",
//   },
//   {
//     content: "some very long response that should be truncated",
//   },
//   {
//     content: "some text",
//     role: "user",
//   },
//   {
//     content: "some text",
//     role: "ai",
//   },
//   {
//     content: "some very long response that should be truncated",
//   },
//   {
//     content: "some text",
//     role: "user",
//   },
//   {
//     content: "some text",
//     role: "ai",
//   },
//   {
//     content: "some very long response that should be truncated",
//   },
// ];

export default function ChatHistory() {
  const { chatHistory } = useContext(EditorContext);

  return (
    <div className="flex flex-col flex-1 gap-2 py-4 pr-4 overflow-y-auto">
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
