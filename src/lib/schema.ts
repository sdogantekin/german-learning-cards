import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const verbs = pgTable("verbs", {
  id: serial("id").primaryKey(),
  infinitiv: text("infinitiv").notNull().unique(),
  praeteritum: text("praeteritum").notNull(),
  partizipIi: text("partizip_ii").notNull(),
  englishMeaning: text("english_meaning").notNull(),
  turkishMeaning: text("turkish_meaning").notNull(),
  ichKonjugation: text("ich_konjugation").notNull(),
  duKonjugation: text("du_konjugation").notNull(),
  sentenceInfinitiv: text("sentence_infinitiv").notNull(),
  sentenceInfinitivEn: text("sentence_infinitiv_en").notNull(),
  sentencePraeteritum: text("sentence_praeteritum").notNull(),
  sentencePraeteritumEn: text("sentence_praeteritum_en").notNull(),
  sentencePartizipIi: text("sentence_partizip_ii").notNull(),
  sentencePartizipIiEn: text("sentence_partizip_ii_en").notNull(),
});

export const nouns = pgTable("nouns", {
  id: serial("id").primaryKey(),
  noun: text("noun").notNull().unique(),
  artikel: text("artikel").notNull(),
  plural: text("plural").notNull(),
  englishMeaning: text("english_meaning").notNull(),
  turkishMeaning: text("turkish_meaning").notNull(),
  sentence1De: text("sentence_1_de").notNull(),
  sentence1En: text("sentence_1_en").notNull(),
  sentence1Case: text("sentence_1_case").notNull(),
  sentence2De: text("sentence_2_de").notNull(),
  sentence2En: text("sentence_2_en").notNull(),
  sentence2Case: text("sentence_2_case").notNull(),
});

export const adjectives = pgTable("adjectives", {
  id: serial("id").primaryKey(),
  adjective: text("adjective").notNull().unique(),
  englishMeaning: text("english_meaning").notNull(),
  turkishMeaning: text("turkish_meaning").notNull(),
  oppositeAdjective: text("opposite_adjective").notNull(),
  comparative: text("comparative").notNull(),
  comparativeSentence: text("comparative_sentence").notNull(),
  comparativeTranslation: text("comparative_translation").notNull(),
  superlative: text("superlative").notNull(),
  superlativeSentence: text("superlative_sentence").notNull(),
  superlativeTranslation: text("superlative_translation").notNull(),
  sentence1De: text("sentence_1_de").notNull(),
  sentence1En: text("sentence_1_en").notNull(),
  sentence1Article: text("sentence_1_article").notNull(),
  sentence1Case: text("sentence_1_case").notNull(),
  sentence2De: text("sentence_2_de").notNull(),
  sentence2En: text("sentence_2_en").notNull(),
  sentence2Article: text("sentence_2_article").notNull(),
  sentence2Case: text("sentence_2_case").notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  types: text("types").array().notNull(),
  status: text("status").notNull().default("active"), // 'active' | 'completed' | 'abandoned'
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => sessions.id),
  wordType: text("word_type").notNull(), // 'verb' | 'noun' | 'adjective'
  wordId: integer("word_id").notNull(),
  wordLabel: text("word_label").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  answeredAt: timestamp("answered_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  attemptNumber: integer("attempt_number").notNull(),
});
