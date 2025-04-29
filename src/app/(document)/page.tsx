import db from "@/db/db";
import { getSession } from "@/lib/auth";
import DocumentCell from "./_components/document-cell";
import Header from "@/components/header";
import EmptyDocumentsView from "./_components/empty-documents";
import { Document } from "@prisma/client";
import { redirect } from "next/navigation";
import { UNAUTH_REDIRECT_PATH } from "@/lib/constants";
import CreateButton from "./_components/create-button";

export default async function DocumentsListPage() {
  const session = await getSession();
  const documents = await db.document.findMany({
    where: { userId: session?.id ?? "" },
  });

  if (!session) redirect(UNAUTH_REDIRECT_PATH);

  return (
    <>
      <Header ToolbarRight={<CreateButton userId={session.id} />} />
      {documents.length > 0 ? (
        <DocumentsView documents={documents} />
      ) : (
        <EmptyDocumentsView userId={session.id} />
      )}
    </>
  );
}

function DocumentsView({ documents }: { documents: Document[] }) {
  return (
    <main className="gap-4 grid grid-cols-3 p-4">
      {documents.map((document) => (
        <DocumentCell key={document.id} document={document} />
      ))}
    </main>
  );
}
