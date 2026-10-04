export type WordType = "verb" | "noun" | "adjective";

export const ALL_WORD_TYPES: WordType[] = ["verb", "noun", "adjective"];

export interface VerbDetail {
  infinitiv: string;
  praeteritum: string;
  partizipIi: string;
  englishMeaning: string;
  turkishMeaning: string;
  ichKonjugation: string;
  duKonjugation: string;
  sentenceInfinitiv: string;
  sentenceInfinitivEn: string;
  sentencePraeteritum: string;
  sentencePraeteritumEn: string;
  sentencePartizipIi: string;
  sentencePartizipIiEn: string;
}

export interface NounDetail {
  noun: string;
  artikel: string;
  plural: string;
  englishMeaning: string;
  turkishMeaning: string;
  sentence1De: string;
  sentence1En: string;
  sentence1Case: string;
  sentence2De: string;
  sentence2En: string;
  sentence2Case: string;
}

export interface AdjectiveDetail {
  adjective: string;
  englishMeaning: string;
  turkishMeaning: string;
  oppositeAdjective: string;
  comparative: string;
  comparativeSentence: string;
  comparativeTranslation: string;
  superlative: string;
  superlativeSentence: string;
  superlativeTranslation: string;
  sentence1De: string;
  sentence1En: string;
  sentence1Article: string;
  sentence1Case: string;
  sentence2De: string;
  sentence2En: string;
  sentence2Article: string;
  sentence2Case: string;
}

export interface CardBase {
  wordType: WordType;
  wordId: number;
  front: string;
  attemptNumber: number;
}

export type Card =
  | (CardBase & { wordType: "verb"; detail: VerbDetail })
  | (CardBase & { wordType: "noun"; detail: NounDetail })
  | (CardBase & { wordType: "adjective"; detail: AdjectiveDetail });
