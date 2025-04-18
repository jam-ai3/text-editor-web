"use server";

import db from "@/db/db";

export async function saveDocument(
  id: string,
  content: string,
  title: string,
  userId: string
) {
  await db.document.upsert({
    where: { id },
    update: { content },
    create: { content, title, userId },
  });
}
