import Header from "@/components/header";
import LockSidebar from "./_sections/lock-sidebar";
import ChatWindow from "./_sections/_chat/chat-window";
import EditorProvider from "@/contexts/editor-provider";
import Editor from "./_sections/_editor/editor";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <EditorProvider>
          <LockSidebar />
          <Editor />
          <ChatWindow />
        </EditorProvider>
      </main>
    </>
  );
}
