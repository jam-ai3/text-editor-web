"use server";

import db from "@/db/db";

export async function saveDocument(
  id: string,
  title: string,
  content: string,
  userId: string
) {
  await db.document.upsert({
    create: {
      content,
      title,
      userId,
    },
    update: {
      content,
      title,
    },
    where: { id },
  });
}

export async function deleteDocument(id: string) {
  await db.document.delete({ where: { id } });
}

export async function createDocument(title: string, userId: string) {
  await db.document.create({
    data: {
      content: "",
      title,
      userId,
    },
  });
}
