import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface SessionSummaryRow extends Record<string, unknown> {
  id: number;
  started_at: string;
  ended_at: string | null;
  types: string[];
  status: string;
  total_answers: number;
  correct_count: number;
  wrong_count: number;
  distinct_words: number;
}

interface ProblematicWordRow extends Record<string, unknown> {
  word_type: string;
  word_id: number;
  word_label: string;
  wrong_count: number;
}

function formatDuration(startedAt: string, endedAt: string | null): string {
  if (!endedAt) return "—";
  const ms = new Date(endedAt).getTime() - new Date(startedAt).getTime();
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export default async function StatsPage() {
  const sessionSummaries = await db.execute<SessionSummaryRow>(sql`
    select
      s.id,
      s.started_at,
      s.ended_at,
      s.types,
      s.status,
      count(a.id)::int as total_answers,
      count(*) filter (where a.is_correct)::int as correct_count,
      count(*) filter (where not a.is_correct)::int as wrong_count,
      count(distinct (a.word_type, a.word_id)) filter (where a.id is not null)::int as distinct_words
    from sessions s
    left join answers a on a.session_id = s.id
    group by s.id
    order by s.started_at desc
    limit 50
  `);

  const problematicWords = await db.execute<ProblematicWordRow>(sql`
    select word_type, word_id, word_label,
      count(*) filter (where not is_correct)::int as wrong_count
    from answers
    group by word_type, word_id, word_label
    having count(*) filter (where not is_correct) > 0
    order by wrong_count desc
    limit 20
  `);

  const sessionRows = sessionSummaries.rows;
  const problematicRows = problematicWords.rows;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-10">
      <section>
        <h1 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Session history
        </h1>
        {sessionRows.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No sessions yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Types</th>
                  <th className="py-2 pr-4">Words</th>
                  <th className="py-2 pr-4">Correct</th>
                  <th className="py-2 pr-4">Wrong</th>
                  <th className="py-2 pr-4">Duration</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessionRows.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-neutral-100 dark:border-neutral-900"
                  >
                    <td className="py-2 pr-4">
                      {new Date(s.started_at).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4">{s.types.join(", ")}</td>
                    <td className="py-2 pr-4">{s.distinct_words}</td>
                    <td className="py-2 pr-4">{s.correct_count}</td>
                    <td className="py-2 pr-4">{s.wrong_count}</td>
                    <td className="py-2 pr-4">
                      {formatDuration(s.started_at, s.ended_at)}
                    </td>
                    <td className="py-2 pr-4">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Most problematic words
        </h2>
        {problematicRows.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No wrong answers recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <th className="py-2 pr-4">Word</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Wrong attempts</th>
                </tr>
              </thead>
              <tbody>
                {problematicRows.map((w) => (
                  <tr
                    key={`${w.word_type}-${w.word_id}`}
                    className="border-b border-neutral-100 dark:border-neutral-900"
                  >
                    <td className="py-2 pr-4">{w.word_label}</td>
                    <td className="py-2 pr-4">{w.word_type}</td>
                    <td className="py-2 pr-4">{w.wrong_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
