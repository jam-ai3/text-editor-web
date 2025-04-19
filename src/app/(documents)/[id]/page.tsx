import ChatWindow from "@/app/_sections/_chat/chat-window";
import Editor from "@/app/_sections/_editor/editor";
import LockSidebar from "@/app/_sections/lock-sidebar";
import Header from "@/components/header";
import { ExportButton } from "@/components/toolbar-components";
import EditorProvider from "@/contexts/editor-provider";
import db from "@/db/db";
import { getSession } from "@/lib/auth";

type DocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  const session = await getSession();
  const document = await db.document.findUnique({
    where: { id },
  });

  return (
    <>
      <Header ToolbarRight={ExportButton} />
      <main className="flex flex-1 overflow-hidden">
        <EditorProvider document={document}>
          <LockSidebar />
          <Editor userId={session?.id ?? ""} />
          <ChatWindow />
        </EditorProvider>
      </main>
    </>
  );
}
