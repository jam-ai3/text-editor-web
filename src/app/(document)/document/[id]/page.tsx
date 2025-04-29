import { SimpleEditor } from "@/components/editor/simple-editor";
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
  const userId = (await getSession())?.id;
  const document = await db.document.findUnique({
    where: { id },
  });

  if (!document || !userId) {
    return (
      <div>
        <p>Document not found</p>
      </div>
    );
  }

  return (
    <EditorProvider document={document} userId={userId}>
      <SimpleEditor />
    </EditorProvider>
  );
}
