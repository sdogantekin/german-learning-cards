"use client";

import type { Card as CardType, WordType } from "@/lib/types";

const TYPE_LABELS: Record<WordType, string> = {
  verb: "Verb",
  noun: "Noun",
  adjective: "Adjective",
};

function TypeBadge({ wordType }: { wordType: WordType }) {
  return (
    <span className="inline-block rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
      {TYPE_LABELS[wordType]}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <span className="text-xs font-medium uppercase tracking-wide text-accent">
        {label}
      </span>
      <p className="text-base text-neutral-900 dark:text-neutral-100">{value}</p>
    </div>
  );
}

function SentencePair({
  label,
  de,
  en,
}: {
  label: string;
  de: string;
  en: string;
}) {
  return (
    <div className="mb-3 rounded-md bg-neutral-50 p-3 dark:bg-neutral-800">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="text-base text-neutral-900 dark:text-neutral-100">{de}</p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{en}</p>
    </div>
  );
}

function CardBack({ card }: { card: CardType }) {
  if (card.wordType === "verb") {
    const d = card.detail;
    return (
      <div>
        <DetailRow label="Infinitiv" value={d.infinitiv} />
        <DetailRow label="Präteritum" value={d.praeteritum} />
        <DetailRow label="Partizip II" value={d.partizipIi} />
        <DetailRow label="English" value={d.englishMeaning} />
        <DetailRow label="Turkish" value={d.turkishMeaning} />
        <DetailRow label="ich / du" value={`${d.ichKonjugation} / ${d.duKonjugation}`} />
        <SentencePair label="Infinitiv" de={d.sentenceInfinitiv} en={d.sentenceInfinitivEn} />
        <SentencePair label="Präteritum" de={d.sentencePraeteritum} en={d.sentencePraeteritumEn} />
        <SentencePair label="Partizip II" de={d.sentencePartizipIi} en={d.sentencePartizipIiEn} />
      </div>
    );
  }

  if (card.wordType === "noun") {
    const d = card.detail;
    return (
      <div>
        <DetailRow label="Noun" value={`${d.artikel} ${d.noun}`} />
        <DetailRow label="Plural" value={d.plural} />
        <DetailRow label="English" value={d.englishMeaning} />
        <DetailRow label="Turkish" value={d.turkishMeaning} />
        <SentencePair label={`Sentence 1 (${d.sentence1Case})`} de={d.sentence1De} en={d.sentence1En} />
        <SentencePair label={`Sentence 2 (${d.sentence2Case})`} de={d.sentence2De} en={d.sentence2En} />
      </div>
    );
  }

  const d = card.detail;
  return (
    <div>
      <DetailRow label="Adjective" value={d.adjective} />
      <DetailRow label="English" value={d.englishMeaning} />
      <DetailRow label="Turkish" value={d.turkishMeaning} />
      <DetailRow label="Opposite" value={d.oppositeAdjective} />
      <SentencePair
        label={`Comparative: ${d.comparative}`}
        de={d.comparativeSentence}
        en={d.comparativeTranslation}
      />
      <SentencePair
        label={`Superlative: ${d.superlative}`}
        de={d.superlativeSentence}
        en={d.superlativeTranslation}
      />
      <SentencePair
        label={`Sentence 1 (${d.sentence1Article}, ${d.sentence1Case})`}
        de={d.sentence1De}
        en={d.sentence1En}
      />
      <SentencePair
        label={`Sentence 2 (${d.sentence2Article}, ${d.sentence2Case})`}
        de={d.sentence2De}
        en={d.sentence2En}
      />
    </div>
  );
}

function FlipIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

export default function Card({
  card,
  flipped,
  onFlip,
}: {
  card: CardType;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="flip-card w-full max-w-md">
      <div
        role="button"
        tabIndex={flipped ? -1 : 0}
        aria-disabled={flipped}
        onClick={() => !flipped && onFlip()}
        onKeyDown={(e) => {
          if (!flipped && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onFlip();
          }
        }}
        className={`flip-card-inner h-[26rem] cursor-pointer outline-none ${flipped ? "is-flipped" : ""}`}
      >
        <div className="flip-card-face flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <TypeBadge wordType={card.wordType} />
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
              {card.front}
            </p>
            <span className="flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500">
              <FlipIcon />
              Tap to reveal
            </span>
          </div>
        </div>

        <div className="flip-card-face flip-card-back rounded-xl border border-accent bg-white p-6 shadow-sm dark:bg-neutral-900">
          <div className="mb-3">
            <TypeBadge wordType={card.wordType} />
          </div>
          <CardBack card={card} />
        </div>
      </div>
    </div>
  );
}
