"use client";

import { useState, useTransition } from "react";
import { createSessionAndRedirect } from "@/app/actions/session";
import type { WordType } from "@/lib/types";

const TYPE_INFO: Record<WordType, { label: string; badge: string; hint: string }> = {
  verb: {
    label: "Verbs",
    badge: "V",
    hint: "Infinitiv, Präteritum, Partizip II",
  },
  noun: {
    label: "Nouns",
    badge: "N",
    hint: "Artikel, plural, sample sentences",
  },
  adjective: {
    label: "Adjectives",
    badge: "A",
    hint: "Opposites, comparative, superlative",
  },
};

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

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
        {(Object.keys(TYPE_INFO) as WordType[]).map((type) => {
          const isSelected = selected.has(type);
          const info = TYPE_INFO[type];
          return (
            <label
              key={type}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-base transition-colors ${
                isSelected
                  ? "border-accent bg-accent-soft"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(type)}
                className="sr-only"
              />
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {info.badge}
              </span>
              <span className="flex-1">
                <span className="block font-medium text-neutral-900 dark:text-neutral-100">
                  {info.label}
                </span>
                <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                  {info.hint}
                </span>
              </span>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-neutral-300 text-transparent dark:border-neutral-700"
                }`}
              >
                <CheckIcon />
              </span>
            </label>
          );
        })}
      </div>

      <button
        onClick={handleStart}
        disabled={selected.size === 0 || isPending}
        className="w-full rounded-md bg-accent px-4 py-3 text-base font-medium text-accent-foreground transition-transform active:scale-95 disabled:opacity-50"
      >
        {isPending ? "Starting..." : "Start session"}
      </button>
    </div>
  );
}
