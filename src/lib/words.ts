import { db } from "@/lib/db";
import { verbs, nouns, adjectives } from "@/lib/schema";
import { shuffle } from "@/lib/shuffle";
import type { Card, WordType } from "@/lib/types";

export async function getPool(types: WordType[]): Promise<Card[]> {
  const pool: Card[] = [];

  if (types.includes("verb")) {
    const rows = await db.select().from(verbs);
    for (const row of rows) {
      pool.push({
        wordType: "verb",
        wordId: row.id,
        front: row.infinitiv,
        attemptNumber: 1,
        detail: {
          infinitiv: row.infinitiv,
          praeteritum: row.praeteritum,
          partizipIi: row.partizipIi,
          englishMeaning: row.englishMeaning,
          turkishMeaning: row.turkishMeaning,
          ichKonjugation: row.ichKonjugation,
          duKonjugation: row.duKonjugation,
          sentenceInfinitiv: row.sentenceInfinitiv,
          sentenceInfinitivEn: row.sentenceInfinitivEn,
          sentencePraeteritum: row.sentencePraeteritum,
          sentencePraeteritumEn: row.sentencePraeteritumEn,
          sentencePartizipIi: row.sentencePartizipIi,
          sentencePartizipIiEn: row.sentencePartizipIiEn,
        },
      });
    }
  }

  if (types.includes("noun")) {
    const rows = await db.select().from(nouns);
    for (const row of rows) {
      pool.push({
        wordType: "noun",
        wordId: row.id,
        front: `${row.artikel} ${row.noun}`,
        attemptNumber: 1,
        detail: {
          noun: row.noun,
          artikel: row.artikel,
          plural: row.plural,
          englishMeaning: row.englishMeaning,
          turkishMeaning: row.turkishMeaning,
          sentence1De: row.sentence1De,
          sentence1En: row.sentence1En,
          sentence1Case: row.sentence1Case,
          sentence2De: row.sentence2De,
          sentence2En: row.sentence2En,
          sentence2Case: row.sentence2Case,
        },
      });
    }
  }

  if (types.includes("adjective")) {
    const rows = await db.select().from(adjectives);
    for (const row of rows) {
      pool.push({
        wordType: "adjective",
        wordId: row.id,
        front: row.adjective,
        attemptNumber: 1,
        detail: {
          adjective: row.adjective,
          englishMeaning: row.englishMeaning,
          turkishMeaning: row.turkishMeaning,
          oppositeAdjective: row.oppositeAdjective,
          comparative: row.comparative,
          comparativeSentence: row.comparativeSentence,
          comparativeTranslation: row.comparativeTranslation,
          superlative: row.superlative,
          superlativeSentence: row.superlativeSentence,
          superlativeTranslation: row.superlativeTranslation,
          sentence1De: row.sentence1De,
          sentence1En: row.sentence1En,
          sentence1Article: row.sentence1Article,
          sentence1Case: row.sentence1Case,
          sentence2De: row.sentence2De,
          sentence2En: row.sentence2En,
          sentence2Article: row.sentence2Article,
          sentence2Case: row.sentence2Case,
        },
      });
    }
  }

  return shuffle(pool);
}
