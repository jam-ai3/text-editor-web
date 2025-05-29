"use server";

import db from "@/db/db";
import { getSession } from "@/lib/auth";

type GeminiAction =
  | "autocomplete"
  | "shorten"
  | "lengthen"
  | "grammar"
  | "reorder"
  | "paraphrase"
  | "grammar-full"
  | "synonyms"
  | "resize"
  | "fluidity";

export async function updateAnalytics(action: GeminiAction) {
  const session = await getSession();
  if (!session) return;
  await db.individualCall.create({
    data: {
      type: action,
      userId: session.id,
    },
  });
}
