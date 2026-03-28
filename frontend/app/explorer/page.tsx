"use client";

import { useEffect, useState } from "react";
import { FileTree } from "@/components/FileTree";
import { Spinner } from "@/components/Spinner";
import { useRepoTree } from "@/hooks/useRepoTree";
import { useRepoContext } from "@/context/RepoContext";
import { explainFile, askFile, ApiError } from "@/lib/api";
import type { TreeNode } from "@/lib/types";

export default function ExplorerPage() {
  const { mode } = useRepoContext();
  const { tree, files, loading, error, load } = useRepoTree();
  const [selected, setSelected] = useState<string | null>(null);
  const [explain, setExplain] = useState<string | null>(null);
  const [askQ, setAskQ] = useState("");
  const [askAns, setAskAns] = useState<string | null>(null);
  const [pending, setPending] = useState<"explain" | "ask" | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  async function runExplain() {
    if (!selected) return;
    setLocalError(null);
    setExplain(null);
    setAskAns(null);
    setPending("explain");
    try {
      const res = await explainFile(selected);
      setExplain(res.explanation);
    } catch (e) {
      setLocalError(e instanceof ApiError ? e.message : String(e));
    } finally {
      setPending(null);
    }
  }

  async function runAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !askQ.trim()) return;
    setLocalError(null);
    setAskAns(null);
    setPending("ask");
    try {
      const res = await askFile(askQ.trim(), selected);
      setAskAns(res.answer);
    } catch (err) {
      setLocalError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setPending(null);
    }
  }

  if (mode === "github") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
        File tree and per-file AI require a <strong>local</strong> index. Use
        Analyze with an absolute path on the API host, then return here.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner />
        Loading tree…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Index a repository from the Analyze page first.
        </p>
      </div>
    );
  }

  if (!tree || !files) {
    return <p className="text-zinc-600">No data.</p>;
  }

  const rootNode = tree.tree as TreeNode;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="text-xl font-bold">{tree.repo_name}</h1>
        <p className="text-sm text-zinc-500">{files.total} files indexed</p>
        <div className="mt-4 max-h-[min(70vh,560px)] overflow-y-auto rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <FileTree
            node={rootNode}
            onSelectFile={setSelected}
            selectedPath={selected}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">Selected file</h2>
        {selected ? (
          <code className="block rounded bg-zinc-100 px-2 py-1 text-sm dark:bg-zinc-800">
            {selected}
          </code>
        ) : (
          <p className="text-sm text-zinc-500">Click a file in the tree.</p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!selected || pending !== null}
            onClick={runExplain}
            className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-white"
          >
            {pending === "explain" ? <Spinner /> : null} Explain file
          </button>
        </div>

        {explain != null && (
          <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xs font-medium uppercase text-zinc-500">
              Explanation
            </h3>
            <p className="mt-2 whitespace-pre-wrap">{explain}</p>
          </div>
        )}

        <form onSubmit={runAsk} className="space-y-2">
          <label className="block text-sm">
            Ask about this file
            <textarea
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              rows={2}
              value={askQ}
              onChange={(e) => setAskQ(e.target.value)}
              placeholder="How is routing handled?"
              disabled={!selected}
            />
          </label>
          <button
            type="submit"
            disabled={!selected || !askQ.trim() || pending !== null}
            className="rounded-md bg-sky-600 px-3 py-1.5 text-sm text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {pending === "ask" ? <Spinner /> : null} Ask file
          </button>
        </form>

        {askAns != null && (
          <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="whitespace-pre-wrap">{askAns}</p>
          </div>
        )}

        {localError && (
          <p className="text-sm text-red-600 dark:text-red-400">{localError}</p>
        )}
      </div>
    </div>
  );
}
