"use server";

import db from "@/db/db";
import { getSession } from "@/lib/auth";
import DocumentView from "./_components/document";
import Header from "@/components/header";
import { CreateDocumentButton } from "@/components/toolbar-components";

export default async function DocumentsPage() {
  const session = await getSession();
  const documents = await db.document.findMany({
    where: { userId: session?.id ?? "" },
  });

  return (
    <>
      <Header ToolbarRight={CreateDocumentButton} />
      <main className="gap-4 grid grid-cols-3 p-4">
        {documents.map((document) => (
          <DocumentView key={document.id} document={document} />
        ))}
      </main>
    </>
  );
}
