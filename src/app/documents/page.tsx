import db from "@/db/db";
import { getSession } from "@/lib/auth";

export default async function DocumentsPage() {
  const session = await getSession();
  const documents = await db.document.findMany({
    where: { userId: session?.id ?? "" },
  });

  return (
    <>
      <main>
        {documents.map((document) => (
          <div key={document.id}>{document.title}</div>
        ))}
      </main>
    </>
  );
}
