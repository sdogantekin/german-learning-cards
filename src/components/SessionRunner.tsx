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

    const remaining = queue.slice(1);
    const nextQueue = isCorrect ? remaining : requeueWrong(remaining, current);

    setQueue(nextQueue);
    setFlipped(false);

    if (nextQueue.length === 0) {
      endSession(sessionId, "completed").catch(console.error);
      setFinished(true);
    }
  }

  function handleEndEarly() {
    endSession(sessionId, "abandoned").catch(console.error);
    router.push("/");
  }

  if (finished || !current) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Session complete!
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          {totalWords} words practiced · {tally.correct} correct answers ·{" "}
          {tally.wrong} wrong attempts
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-md bg-neutral-900 px-4 py-2 text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Start a new session
        </button>
      </div>
    );
  }

  const remainingCount = queue.length;
  const doneCount = totalWords - remainingCount;

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6">
      <div className="flex w-full max-w-md items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>
          {doneCount} / {totalWords} done
        </span>
        <button onClick={handleEndEarly} className="underline">
          End session
        </button>
      </div>

      <Card card={current} flipped={flipped} onFlip={() => setFlipped(true)} />

      {!flipped ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Tap the card to reveal the answer
        </p>
      ) : (
        <div className="flex w-full max-w-md gap-4">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 rounded-md border border-red-500 px-4 py-3 font-medium text-red-600 dark:text-red-400"
          >
            Wrong
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 rounded-md bg-green-600 px-4 py-3 font-medium text-white"
          >
            Correct
          </button>
        </div>
      )}
    </div>
  );
}
