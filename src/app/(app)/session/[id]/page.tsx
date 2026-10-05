import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";
import { getPool } from "@/lib/words";
import SessionRunner from "@/components/SessionRunner";
import type { WordType } from "@/lib/types";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessionId = Number(id);
  if (!Number.isInteger(sessionId)) {
    notFound();
  }

  const [sessionRow] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId));

  if (!sessionRow) {
    notFound();
  }

  const fullPool = await getPool(sessionRow.types as WordType[]);
  const pool = sessionRow.poolSize
    ? fullPool.slice(0, sessionRow.poolSize)
    : fullPool;

  return (
    <SessionRunner sessionId={sessionId} initialPool={pool} />
  );
}
