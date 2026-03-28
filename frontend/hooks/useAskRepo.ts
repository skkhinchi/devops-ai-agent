"use client";

import { useCallback, useState } from "react";
import { ApiError, askRepo } from "@/lib/api";
import type { AskResponse } from "@/lib/types";

export function useAskRepo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(async (question: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await askRepo(question.trim());
      return res as AskResponse;
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { ask, loading, error, setError };
}
