"use client";

import { useCallback, useState } from "react";
import { analyzeGithubRepo, analyzeLocalRepo, ApiError } from "@/lib/api";
import { useRepoContext } from "@/context/RepoContext";

export function useAnalyzeRepo() {
  const { setLocalIndexed, setGithubPreview } = useRepoContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runLocal = useCallback(
    async (repoPath: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await analyzeLocalRepo(repoPath.trim());
        const root =
          typeof data.repo_root === "string"
            ? data.repo_root
            : repoPath.trim();
        const name = root.split("/").filter(Boolean).pop() ?? "repo";
        setLocalIndexed(name, root);
        return data;
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : String(e);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLocalIndexed]
  );

  const runGithub = useCallback(
    async (repoUrl: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await analyzeGithubRepo(repoUrl.trim());
        setGithubPreview(repoUrl.trim(), data as Record<string, unknown>);
        return data;
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : String(e);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setGithubPreview]
  );

  return { loading, error, setError, runLocal, runGithub };
}
