"use client";

import { useCallback, useState } from "react";
import { ApiError, getRepoFiles, getRepoTree } from "@/lib/api";
import type { RepoFilesResponse, RepoTreeResponse } from "@/lib/types";

export function useRepoTree() {
  const [tree, setTree] = useState<RepoTreeResponse | null>(null);
  const [files, setFiles] = useState<RepoFilesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, f] = await Promise.all([getRepoTree(), getRepoFiles()]);
      setTree(t);
      setFiles(f);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      setError(msg);
      setTree(null);
      setFiles(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { tree, files, loading, error, load };
}
