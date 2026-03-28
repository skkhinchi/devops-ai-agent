"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { useAskRepo } from "@/hooks/useAskRepo";
import { useRepoContext } from "@/context/RepoContext";

export default function AskPage() {
  const { mode, repoName } = useRepoContext();
  const { ask, loading, error, setError } = useAskRepo();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAnswer(null);
    setSources([]);
    try {
      const res = await ask(question);
      setAnswer(res.answer);
      setSources(res.sources ?? []);
    } catch {
      /* */
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ask the repository</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Uses the indexed embedding store on the API.{" "}
          {mode === "github" && (
            <span className="font-medium text-amber-700 dark:text-amber-400">
              GitHub-only preview did not index files locally — use a local path
              on Analyze for RAG answers.
            </span>
          )}
          {repoName && mode === "local" && (
            <span className="text-zinc-500"> Current: {repoName}</span>
          )}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Question</span>
          <textarea
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What does this API do?"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {loading && <Spinner />}
          Ask
        </button>
      </form>

      {error && (
        <div
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {answer != null && (
        <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold">Answer</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{answer}</p>
          {sources.length > 0 && (
            <div>
              <h3 className="text-xs font-medium uppercase text-zinc-500">
                Sources
              </h3>
              <ul className="mt-1 list-inside list-disc text-sm">
                {sources.map((s) => (
                  <li key={s}>
                    <code>{s}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
