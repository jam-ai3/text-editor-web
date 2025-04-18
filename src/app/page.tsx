import Header from "@/components/header";
import LockSidebar from "./_sections/lock-sidebar";
import ChatWindow from "./_sections/_chat/chat-window";
import EditorProvider from "@/contexts/editor-provider";
import Editor from "./_sections/_editor/editor";
// import { getSession } from "@/lib/auth";

export default async function Home() {
  // const session = await getSession();

  // if (!session) {
  //   // TODO: redirect
  //   return null;
  // }

  return (
    <>
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <EditorProvider>
          <LockSidebar />
          <Editor />
          <ChatWindow />
        </EditorProvider>
      </main>
    </>
  );
}
