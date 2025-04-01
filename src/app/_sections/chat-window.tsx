"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHAT_LOCAL_STORAGE_KEY = "isChatOpen";

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(true);

  function handleToggle() {
    const newValue = !isOpen;
    setIsOpen(newValue);
    window.localStorage.setItem(
      CHAT_LOCAL_STORAGE_KEY,
      JSON.stringify(newValue)
    );
  }

  useEffect(() => {
    function checkIsOpen() {
      if (typeof window === "undefined") return setIsOpen(true);
      const localValue = window.localStorage.getItem(CHAT_LOCAL_STORAGE_KEY);
      if (localValue === null) return setIsOpen(true);
      return setIsOpen(JSON.parse(localValue));
    }
    checkIsOpen();
  }, []);

  return (
    <section className="flex h-full">
      <div className="border-l-2 h-full">
        <Button onClick={handleToggle} variant="link">
          <ChevronLeft
            className={`${isOpen ? "rotate-180" : ""} transition-all`}
            onClick={handleToggle}
          />
        </Button>
      </div>
      {isOpen && <div>Chat Window</div>}
    </section>
  );
}
