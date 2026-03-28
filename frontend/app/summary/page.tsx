"use client";

import { useEffect } from "react";
import { Spinner } from "@/components/Spinner";
import { useRepoSummary } from "@/hooks/useRepoSummary";
import { useRepoContext } from "@/context/RepoContext";

export default function SummaryPage() {
  const { mode, repoName } = useRepoContext();
  const { data, loading, error, load } = useRepoSummary();

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Repository summary</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Generated from the indexed vector store (GET /ai/summary).
          {repoName && mode === "local" && (
            <span className="text-zinc-500"> Current: {repoName}</span>
          )}
        </p>
        {mode === "github" && (
          <p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-400">
            GitHub preview did not index the repo. Run <strong>Analyze</strong>{" "}
            with a local path for a real summary.
          </p>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2">
          <Spinner />
          Loading…
        </div>
      )}

      {error && (
        <div
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {data && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}
    </div>
  );
}
