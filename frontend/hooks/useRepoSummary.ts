"use client";

import { useCallback, useState } from "react";
import { ApiError, getRepoSummary } from "@/lib/api";
import type { SummaryResponse } from "@/lib/types";

export function useRepoSummary() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRepoSummary();
      setData(res);
      return res;
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : String(e);
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, load };
}
