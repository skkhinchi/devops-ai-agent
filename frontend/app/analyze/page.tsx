"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { useAnalyzeRepo } from "@/hooks/useAnalyzeRepo";

export default function AnalyzePage() {
  const router = useRouter();
  const { loading, error, setError, runLocal, runGithub } = useAnalyzeRepo();
  const [tab, setTab] = useState<"local" | "github">("local");
  const [localPath, setLocalPath] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  async function handleLocal(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await runLocal(localPath);
      router.push("/insights");
    } catch {
      /* error state in hook */
    }
  }

  async function handleGithub(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await runGithub(githubUrl);
      router.push("/insights");
    } catch {
      /* error state in hook */
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analyze repository</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <strong>Local</strong> paths must be absolute on the machine running
          the API. <strong>GitHub</strong> fetches metadata and samples via the
          GitHub API (does not build the same server-side index as local).
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("local")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "local"
              ? "bg-sky-600 text-white"
              : "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          }`}
        >
          Local path
        </button>
        <button
          type="button"
          onClick={() => setTab("github")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            tab === "github"
              ? "bg-sky-600 text-white"
              : "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          }`}
        >
          GitHub URL
        </button>
      </div>

      {tab === "local" ? (
        <form onSubmit={handleLocal} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Absolute path</span>
            <input
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="/Users/you/projects/my-app"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading && <Spinner />}
            Index & continue
          </button>
        </form>
      ) : (
        <form onSubmit={handleGithub} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Repository URL</span>
            <input
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="https://github.com/vercel/next.js"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading && <Spinner />}
            Analyze & continue
          </button>
        </form>
      )}

      {error && (
        <div
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
