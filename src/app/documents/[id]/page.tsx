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
    where: { id, userId: session?.id ?? "" },
  });

  return <div>{document?.title}</div>;
}
