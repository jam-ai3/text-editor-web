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
  | "synonyms";

export async function updateAnalytics(action: GeminiAction) {
  const session = await getSession();
  if (!session) return;
  const create = getAnalyticsCreate(action);
  const update = getAnalyticsUpdate(action);
  await Promise.all([
    db.analytics.upsert({
      create: { userId: session.id, ...create },
      update: { lastUpdated: new Date(), ...update },
      where: { userId: session.id },
    }),
    db.individualCall.create({
      data: {
        type: action,
        userId: session.id,
      },
    }),
  ]);
}

function getAnalyticsCreate(action: GeminiAction) {
  switch (action) {
    case "autocomplete":
      return { autocompleteCalls: 1 };
    case "shorten":
      return { shortenCalls: 1 };
    case "lengthen":
      return { lengthenCalls: 1 };
    case "grammar":
      return { grammarCalls: 1 };
    case "reorder":
      return { reorderCalls: 1 };
    case "paraphrase":
      return { paraphraseCalls: 1 };
    case "grammar-full":
      return { grammarFullCalls: 1 };
    case "synonyms":
      return { synonymsCalls: 1 };
  }
}

function getAnalyticsUpdate(action: GeminiAction) {
  switch (action) {
    case "autocomplete":
      return { autocompleteCalls: { increment: 1 } };
    case "shorten":
      return { shortenCalls: { increment: 1 } };
    case "lengthen":
      return { lengthenCalls: { increment: 1 } };
    case "grammar":
      return { grammarCalls: { increment: 1 } };
    case "reorder":
      return { reorderCalls: { increment: 1 } };
    case "paraphrase":
      return { paraphraseCalls: { increment: 1 } };
    case "grammar-full":
      return { grammarFullCalls: { increment: 1 } };
    case "synonyms":
      return { synonymsCalls: { increment: 1 } };
  }
}
