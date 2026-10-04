"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Card from "@/components/Card";
import { endSession, recordAnswer } from "@/app/actions/session";
import type { Card as CardType } from "@/lib/types";

function requeueWrong(remaining: CardType[], card: CardType): CardType[] {
  const updated = { ...card, attemptNumber: card.attemptNumber + 1 };
  if (remaining.length === 0) {
    return [updated];
  }
  const insertAt = Math.floor(Math.random() * remaining.length) + 1;
  const next = [...remaining];
  next.splice(Math.min(insertAt, next.length), 0, updated);
  return next;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
      {streak} in a row
    </span>
  );
}

export default function SessionRunner({
  sessionId,
  initialPool,
}: {
  sessionId: number;
  initialPool: CardType[];
}) {
  const router = useRouter();
  const [queue, setQueue] = useState<CardType[]>(initialPool);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [tally, setTally] = useState({ correct: 0, wrong: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  const totalWords = initialPool.length;
  const current = queue[0];

  function handleAnswer(isCorrect: boolean) {
    if (!current) return;

    recordAnswer(
      sessionId,
      current.wordType,
      current.wordId,
      current.front,
      isCorrect,
      current.attemptNumber
    ).catch(console.error);

    setTally((t) =>
      isCorrect ? { ...t, correct: t.correct + 1 } : { ...t, wrong: t.wrong + 1 }
    );

    setStreak((s) => {
      const next = isCorrect ? s + 1 : 0;
      setBestStreak((best) => Math.max(best, next));
      return next;
    });

    const remaining = queue.slice(1);
    const nextQueue = isCorrect ? remaining : requeueWrong(remaining, current);

    setQueue(nextQueue);
    setFlipped(false);

    if (nextQueue.length === 0) {
      endSession(sessionId, "completed").catch(console.error);
      setElapsedMs(Date.now() - startedAt);
      setFinished(true);
    }
  }

  function handleEndEarly() {
    endSession(sessionId, "abandoned").catch(console.error);
    router.push("/");
  }

  if (finished || !current) {
    const totalAnswers = tally.correct + tally.wrong;
    const accuracy =
      totalAnswers === 0 ? 100 : Math.round((tally.correct / totalAnswers) * 100);

    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-accent">
          <span className="text-3xl font-bold text-accent">{accuracy}%</span>
          <span className="text-xs text-stone-500">accuracy</span>
        </div>
        <div>
          <h2 className="mb-1 text-2xl font-semibold text-stone-900">
            Session complete!
          </h2>
          <p className="text-stone-600">
            {totalWords} words · {tally.correct} correct · {tally.wrong} wrong
            attempts · {formatElapsed(elapsedMs)}
          </p>
          {bestStreak >= 3 && (
            <p className="mt-1 text-sm font-medium text-accent">
              Best streak: {bestStreak} in a row
            </p>
          )}
        </div>
        <button
          onClick={() => router.push("/")}
          className="rounded-md bg-accent px-5 py-2.5 font-medium text-accent-foreground transition-transform active:scale-95"
        >
          Start a new session
        </button>
      </div>
    );
  }

  const remainingCount = queue.length;
  const doneCount = totalWords - remainingCount;
  const progressPct = totalWords === 0 ? 0 : Math.round((doneCount / totalWords) * 100);

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center justify-between text-sm text-stone-500">
          <span>
            {doneCount} / {totalWords} done
          </span>
          <button onClick={handleEndEarly} className="underline">
            End session
          </button>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <Card card={current} flipped={flipped} onFlip={() => setFlipped(true)} />

      <div className="flex h-9 items-center">
        <StreakBadge streak={streak} />
      </div>

      {flipped && (
        <div className="flex w-full max-w-md gap-4">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 rounded-md border border-rose-400 px-4 py-3 font-medium text-rose-600 transition-transform active:scale-95"
          >
            Wrong
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 rounded-md bg-emerald-600 px-4 py-3 font-medium text-white transition-transform active:scale-95"
          >
            Correct
          </button>
        </div>
      )}
    </div>
  );
}
