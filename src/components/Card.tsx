"use client";

import type { Card as CardType } from "@/lib/types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2">
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
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
    <button
      onClick={onFlip}
      disabled={flipped}
      className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      {!flipped ? (
        <div className="flex min-h-48 items-center justify-center">
          <p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {card.front}
          </p>
        </div>
      ) : (
        <CardBack card={card} />
      )}
    </button>
  );
}
