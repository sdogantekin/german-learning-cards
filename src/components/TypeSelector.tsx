"use client";

import { useState, useTransition } from "react";
import { createSessionAndRedirect } from "@/app/actions/session";
import type { WordType } from "@/lib/types";

const TYPE_LABELS: Record<WordType, string> = {
  verb: "Verbs",
  noun: "Nouns",
  adjective: "Adjectives",
};

export default function TypeSelector() {
  const [selected, setSelected] = useState<Set<WordType>>(
    new Set(["verb", "noun", "adjective"])
  );
  const [isPending, startTransition] = useTransition();

  function toggle(type: WordType) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  function handleStart() {
    const types = Array.from(selected);
    startTransition(() => {
      createSessionAndRedirect(types);
    });
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col gap-3">
        {(Object.keys(TYPE_LABELS) as WordType[]).map((type) => (
          <label
            key={type}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-base dark:border-neutral-800"
          >
            <input
              type="checkbox"
              checked={selected.has(type)}
              onChange={() => toggle(type)}
              className="h-5 w-5"
            />
            {TYPE_LABELS[type]}
          </label>
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={selected.size === 0 || isPending}
        className="w-full rounded-md bg-neutral-900 px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {isPending ? "Starting..." : "Start session"}
      </button>
    </div>
  );
}
