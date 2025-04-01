import Header from "@/components/header";
import LockSidebar from "./_sections/lock-sidebar";
import ChatWindow from "./_sections/chat-window";
import EditorProvider from "@/contexts/editor-provider";
import Editor from "./_sections/editor";

export default function Home() {
  return (
    <>
      <Header />
      <main className="h-screen flex">
        <EditorProvider>
          <LockSidebar />
          <Editor />
          <ChatWindow />
        </EditorProvider>
      </main>
    </>
  );
}
