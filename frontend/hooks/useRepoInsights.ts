"use client";

import { useCallback, useState } from "react";
import { ApiError, getRepoInsights } from "@/lib/api";
import type { RepoInsights } from "@/lib/types";
import { useRepoContext } from "@/context/RepoContext";

export function useRepoInsights() {
  const { mode, githubSnapshot } = useRepoContext();
  const [data, setData] = useState<RepoInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // GitHub preview does not update the server snapshot; avoid showing a stale local index.
      if (mode === "github") {
        setError(null);
        return;
      }
      const res = await getRepoInsights();
      setData(res);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  const hasGithubFallback = mode === "github" && !!githubSnapshot;

  return {
    data,
    loading,
    error,
    load,
    hasGithubFallback,
    githubSnapshot,
  };
}
