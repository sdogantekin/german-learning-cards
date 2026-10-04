import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { verbs, nouns, adjectives } from "../src/lib/schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const DATA_DIR = join(__dirname, "..", "data");

function readCsv(fileName: string): Record<string, string>[] {
  const content = readFileSync(join(DATA_DIR, fileName), "utf-8");
  return parse(content, { columns: true, skip_empty_lines: true, bom: true });
}

async function seedVerbs() {
  const rows = readCsv("telc_b1_verbs.csv");
  for (const row of rows) {
    await db
      .insert(verbs)
      .values({
        infinitiv: row["Infinitiv"],
        praeteritum: row["Präteritum"],
        partizipIi: row["Partizip_II"],
        englishMeaning: row["English_Meaning"],
        turkishMeaning: row["Turkish_Meaning"],
        ichKonjugation: row["Ich_Konjugation"],
        duKonjugation: row["Du_Konjugation"],
        sentenceInfinitiv: row["Sentence_Infinitiv"],
        sentenceInfinitivEn: row["Sentence_Infinitiv_EN"],
        sentencePraeteritum: row["Sentence_Praeteritum"],
        sentencePraeteritumEn: row["Sentence_Praeteritum_EN"],
        sentencePartizipIi: row["Sentence_PartizipII"],
        sentencePartizipIiEn: row["Sentence_PartizipII_EN"],
      })
      .onConflictDoUpdate({
        target: verbs.infinitiv,
        set: {
          praeteritum: row["Präteritum"],
          partizipIi: row["Partizip_II"],
          englishMeaning: row["English_Meaning"],
          turkishMeaning: row["Turkish_Meaning"],
          ichKonjugation: row["Ich_Konjugation"],
          duKonjugation: row["Du_Konjugation"],
          sentenceInfinitiv: row["Sentence_Infinitiv"],
          sentenceInfinitivEn: row["Sentence_Infinitiv_EN"],
          sentencePraeteritum: row["Sentence_Praeteritum"],
          sentencePraeteritumEn: row["Sentence_Praeteritum_EN"],
          sentencePartizipIi: row["Sentence_PartizipII"],
          sentencePartizipIiEn: row["Sentence_PartizipII_EN"],
        },
      });
  }
  console.log(`Seeded ${rows.length} verbs.`);
}

async function seedNouns() {
  const rows = readCsv("telc_b1_nouns.csv");
  for (const row of rows) {
    await db
      .insert(nouns)
      .values({
        noun: row["Noun"],
        artikel: row["Artikel"],
        plural: row["Plural"],
        englishMeaning: row["English Meaning"],
        turkishMeaning: row["Turkish Meaning"],
        sentence1De: row["Sentence 1 (German)"],
        sentence1En: row["Sentence 1 (Translation)"],
        sentence1Case: row["Case 1"],
        sentence2De: row["Sentence 2 (German)"],
        sentence2En: row["Sentence 2 (Translation)"],
        sentence2Case: row["Case 2"],
      })
      .onConflictDoUpdate({
        target: nouns.noun,
        set: {
          artikel: row["Artikel"],
          plural: row["Plural"],
          englishMeaning: row["English Meaning"],
          turkishMeaning: row["Turkish Meaning"],
          sentence1De: row["Sentence 1 (German)"],
          sentence1En: row["Sentence 1 (Translation)"],
          sentence1Case: row["Case 1"],
          sentence2De: row["Sentence 2 (German)"],
          sentence2En: row["Sentence 2 (Translation)"],
          sentence2Case: row["Case 2"],
        },
      });
  }
  console.log(`Seeded ${rows.length} nouns.`);
}

async function seedAdjectives() {
  const rows = readCsv("telc_b1_adjectives.csv");
  for (const row of rows) {
    await db
      .insert(adjectives)
      .values({
        adjective: row["Adjective"],
        englishMeaning: row["English Meaning"],
        turkishMeaning: row["Turkish Meaning"],
        oppositeAdjective: row["Opposite Adjective"],
        comparative: row["Comparative"],
        comparativeSentence: row["Comparative Sentence"],
        comparativeTranslation: row["Comparative Translation"],
        superlative: row["Superlative"],
        superlativeSentence: row["Superlative Sentence"],
        superlativeTranslation: row["Superlative Translation"],
        sentence1De: row["Sentence 1"],
        sentence1En: row["Sentence 1 Translation"],
        sentence1Article: row["Sentence 1 Article"],
        sentence1Case: row["Sentence 1 Case"],
        sentence2De: row["Sentence 2"],
        sentence2En: row["Sentence 2 Translation"],
        sentence2Article: row["Sentence 2 Article"],
        sentence2Case: row["Sentence 2 Case"],
      })
      .onConflictDoUpdate({
        target: adjectives.adjective,
        set: {
          englishMeaning: row["English Meaning"],
          turkishMeaning: row["Turkish Meaning"],
          oppositeAdjective: row["Opposite Adjective"],
          comparative: row["Comparative"],
          comparativeSentence: row["Comparative Sentence"],
          comparativeTranslation: row["Comparative Translation"],
          superlative: row["Superlative"],
          superlativeSentence: row["Superlative Sentence"],
          superlativeTranslation: row["Superlative Translation"],
          sentence1De: row["Sentence 1"],
          sentence1En: row["Sentence 1 Translation"],
          sentence1Article: row["Sentence 1 Article"],
          sentence1Case: row["Sentence 1 Case"],
          sentence2De: row["Sentence 2"],
          sentence2En: row["Sentence 2 Translation"],
          sentence2Article: row["Sentence 2 Article"],
          sentence2Case: row["Sentence 2 Case"],
        },
      });
  }
  console.log(`Seeded ${rows.length} adjectives.`);
}

async function main() {
  await seedVerbs();
  await seedNouns();
  await seedAdjectives();
}

main()
  .then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
