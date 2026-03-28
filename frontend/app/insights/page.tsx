"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Spinner } from "@/components/Spinner";
import { useRepoContext } from "@/context/RepoContext";
import { useRepoInsights } from "@/hooks/useRepoInsights";

export default function InsightsPage() {
  const { mode } = useRepoContext();
  const { data, loading, error, load, hasGithubFallback, githubSnapshot } =
    useRepoInsights();

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Spinner />
        <span>Loading insights…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link href="/analyze" className="text-sky-600 underline">
          Analyze a repository
        </Link>
      </div>
    );
  }

  if (data) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold">{data.repo_name}</h1>
          <p className="text-sm text-zinc-500">
            {data.total_files} files · {data.total_chunks} chunks ·{" "}
            {data.source}
          </p>
          {data.repo_root && (
            <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {data.repo_root}
            </p>
          )}
        </header>

        <section>
          <h2 className="text-lg font-semibold">Ingest</h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {data.ingest_message}
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
            <li>Skipped (too large): {data.skipped.too_large}</li>
            <li>Skipped (binary/decode): {data.skipped.binary_or_decode}</li>
            <li>Skipped (extension filter): {data.skipped.extension_filter}</li>
            <li>Truncated: {data.skipped.truncated ? "yes" : "no"}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Tech stack (by extension)</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(data.extensions).map(([ext, n]) => (
              <span
                key={ext}
                className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs dark:bg-zinc-800"
              >
                {ext} ({n})
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Architecture (top folders)</h2>
          <ul className="mt-2 list-inside list-disc text-sm">
            {Object.entries(data.top_level_directories).map(([dir, n]) => (
              <li key={dir}>
                <code>{dir}</code> — {n} files
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Project purpose</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Purpose is inferred by the AI on the Ask and Summary pages. This
            screen shows factual index stats only.
          </p>
        </section>

        <nav className="flex gap-4 text-sm">
          <Link href="/ask" className="text-sky-600 underline">
            Ask a question →
          </Link>
          <Link href="/explorer" className="text-sky-600 underline">
            File explorer →
          </Link>
        </nav>
      </div>
    );
  }

  if (hasGithubFallback && githubSnapshot) {
    const desc =
      typeof githubSnapshot.description === "string"
        ? githubSnapshot.description
        : null;
    const repo =
      typeof githubSnapshot.repo === "string" ? githubSnapshot.repo : "?";
    const hints = githubSnapshot.stack_hints;
    const important = githubSnapshot.important_files_found;

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">GitHub preview: {repo}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Remote analysis does not create the same in-server snapshot as local
          indexing. Below is data from{" "}
          <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
            POST /repo/github/analyze
          </code>
          . Use a <strong>local path</strong> on the Analyze page for full
          insights, tree, and RAG.
        </p>
        {desc && (
          <section>
            <h2 className="font-semibold">Description</h2>
            <p className="text-sm">{desc}</p>
          </section>
        )}
        {Array.isArray(important) && important.length > 0 && (
          <section>
            <h2 className="font-semibold">Important files (heuristic)</h2>
            <ul className="list-inside list-disc text-sm">
              {(important as string[]).slice(0, 20).map((p) => (
                <li key={p}>
                  <code>{p}</code>
                </li>
              ))}
            </ul>
          </section>
        )}
        {hints != null && (
          <section>
            <h2 className="font-semibold">Stack hints</h2>
            <pre className="overflow-x-auto rounded-md bg-zinc-100 p-3 text-xs dark:bg-zinc-900">
              {JSON.stringify(hints, null, 2)}
            </pre>
          </section>
        )}
        <Link href="/analyze" className="text-sky-600 underline">
          Index locally for full features →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-zinc-600 dark:text-zinc-400">
        {mode === "github"
          ? "No GitHub preview in session. Run GitHub analyze from the Analyze page."
          : "No insights yet. Run Analyze with a local absolute path on the API host."}
      </p>
      <Link href="/analyze" className="text-sky-600 underline">
        Go to Analyze
      </Link>
    </div>
  );
}
