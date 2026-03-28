"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type RepoMode = "idle" | "local" | "github";

export type RepoContextValue = {
  mode: RepoMode;
  /** Display name (folder name or github org/repo) */
  repoName: string | null;
  /** Local absolute path (after successful /repo/analyze) */
  repoPath: string | null;
  githubUrl: string | null;
  /** Last GitHub analyze JSON (for insights UI when no server snapshot exists) */
  githubSnapshot: Record<string, unknown> | null;
  setLocalIndexed: (name: string, path: string) => void;
  setGithubPreview: (url: string, payload: Record<string, unknown>) => void;
  clear: () => void;
};

const RepoContext = createContext<RepoContextValue | null>(null);

export function RepoProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<RepoMode>("idle");
  const [repoName, setRepoName] = useState<string | null>(null);
  const [repoPath, setRepoPath] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);
  const [githubSnapshot, setGithubSnapshot] = useState<Record<
    string,
    unknown
  > | null>(null);

  const setLocalIndexed = useCallback((name: string, path: string) => {
    setMode("local");
    setRepoName(name);
    setRepoPath(path);
    setGithubUrl(null);
    setGithubSnapshot(null);
  }, []);

  const setGithubPreview = useCallback(
    (url: string, payload: Record<string, unknown>) => {
      setMode("github");
      setGithubUrl(url);
      setGithubSnapshot(payload);
      const repo = payload.repo;
      setRepoName(typeof repo === "string" ? repo : url);
      setRepoPath(null);
    },
    []
  );

  const clear = useCallback(() => {
    setMode("idle");
    setRepoName(null);
    setRepoPath(null);
    setGithubUrl(null);
    setGithubSnapshot(null);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      repoName,
      repoPath,
      githubUrl,
      githubSnapshot,
      setLocalIndexed,
      setGithubPreview,
      clear,
    }),
    [
      mode,
      repoName,
      repoPath,
      githubUrl,
      githubSnapshot,
      setLocalIndexed,
      setGithubPreview,
      clear,
    ]
  );

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}

export function useRepoContext() {
  const ctx = useContext(RepoContext);
  if (!ctx) {
    throw new Error("useRepoContext must be used within RepoProvider");
  }
  return ctx;
}
