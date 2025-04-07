"use client";

import { useContext, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorContext } from "@/contexts/editor-provider";
import { Textarea } from "@/components/ui/textarea";
import ChatSelection from "./_components/chat-selection";
import { ChatHandler } from "../_actions/chat";
import ChatHistory from "./_components/chat-history";

export default function ChatWindow() {
  const { isChatOpen, toggleIsChatOpen } = useContext(EditorContext);

  return (
    <section className="flex h-full">
      <div className="border-l-2 h-full">
        <Button onClick={() => toggleIsChatOpen()} variant="link">
          <ChevronLeft
            className={`${isChatOpen ? "rotate-180" : ""} transition-all`}
            onClick={() => toggleIsChatOpen()}
          />
        </Button>
      </div>
      {isChatOpen && <ChatBox />}
    </section>
  );
}

function ChatBox() {
  const context = useContext(EditorContext);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  async function handleChat() {
    if (!input) return;
    setIsChatLoading(true);
    await ChatHandler.handleChat(input, context);
    setInput("");
    setIsChatLoading(false);
  }

  return (
    <div className="h-full w-[320px] flex flex-col pb-4 relative">
      <ChatSelection />
      <ChatHistory />
      <div className="flex flex-col gap-2 pr-4">
        <Textarea
          placeholder="Ask a question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="resize-none"
        />
        <Button
          variant="accent"
          onClick={handleChat}
          disabled={isChatLoading || !input}
          className="w-full"
        >
          <span>{isChatLoading ? "Loading..." : "Send"}</span>
          {isChatLoading && <Loader2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
