"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sessions, answers } from "@/lib/schema";
import type { WordType } from "@/lib/types";

export async function createSessionAndRedirect(
  types: WordType[],
  poolSize: number | null
): Promise<void> {
  if (types.length === 0) {
    throw new Error("At least one word type must be selected.");
  }

  const [sessionRow] = await db
    .insert(sessions)
    .values({ types, status: "active", poolSize })
    .returning({ id: sessions.id });

  redirect(`/session/${sessionRow.id}`);
}

export async function recordAnswer(
  sessionId: number,
  wordType: WordType,
  wordId: number,
  wordLabel: string,
  isCorrect: boolean,
  attemptNumber: number
): Promise<void> {
  await db.insert(answers).values({
    sessionId,
    wordType,
    wordId,
    wordLabel,
    isCorrect,
    attemptNumber,
  });
}

export async function endSession(
  sessionId: number,
  status: "completed" | "abandoned"
): Promise<void> {
  await db
    .update(sessions)
    .set({ endedAt: new Date(), status })
    .where(eq(sessions.id, sessionId));
}
