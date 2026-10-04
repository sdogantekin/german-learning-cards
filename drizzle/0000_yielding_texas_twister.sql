CREATE TABLE IF NOT EXISTS "adjectives" (
	"id" serial PRIMARY KEY NOT NULL,
	"adjective" text NOT NULL,
	"english_meaning" text NOT NULL,
	"turkish_meaning" text NOT NULL,
	"opposite_adjective" text NOT NULL,
	"comparative" text NOT NULL,
	"comparative_sentence" text NOT NULL,
	"comparative_translation" text NOT NULL,
	"superlative" text NOT NULL,
	"superlative_sentence" text NOT NULL,
	"superlative_translation" text NOT NULL,
	"sentence_1_de" text NOT NULL,
	"sentence_1_en" text NOT NULL,
	"sentence_1_article" text NOT NULL,
	"sentence_1_case" text NOT NULL,
	"sentence_2_de" text NOT NULL,
	"sentence_2_en" text NOT NULL,
	"sentence_2_article" text NOT NULL,
	"sentence_2_case" text NOT NULL,
	CONSTRAINT "adjectives_adjective_unique" UNIQUE("adjective")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"word_type" text NOT NULL,
	"word_id" integer NOT NULL,
	"word_label" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attempt_number" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nouns" (
	"id" serial PRIMARY KEY NOT NULL,
	"noun" text NOT NULL,
	"artikel" text NOT NULL,
	"plural" text NOT NULL,
	"english_meaning" text NOT NULL,
	"turkish_meaning" text NOT NULL,
	"sentence_1_de" text NOT NULL,
	"sentence_1_en" text NOT NULL,
	"sentence_1_case" text NOT NULL,
	"sentence_2_de" text NOT NULL,
	"sentence_2_en" text NOT NULL,
	"sentence_2_case" text NOT NULL,
	CONSTRAINT "nouns_noun_unique" UNIQUE("noun")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"types" text[] NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verbs" (
	"id" serial PRIMARY KEY NOT NULL,
	"infinitiv" text NOT NULL,
	"praeteritum" text NOT NULL,
	"partizip_ii" text NOT NULL,
	"english_meaning" text NOT NULL,
	"turkish_meaning" text NOT NULL,
	"ich_konjugation" text NOT NULL,
	"du_konjugation" text NOT NULL,
	"sentence_infinitiv" text NOT NULL,
	"sentence_infinitiv_en" text NOT NULL,
	"sentence_praeteritum" text NOT NULL,
	"sentence_praeteritum_en" text NOT NULL,
	"sentence_partizip_ii" text NOT NULL,
	"sentence_partizip_ii_en" text NOT NULL,
	CONSTRAINT "verbs_infinitiv_unique" UNIQUE("infinitiv")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answers_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
