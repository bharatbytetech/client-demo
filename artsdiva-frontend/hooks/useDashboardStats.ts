import { useCallback, useEffect, useState } from "react";
import { getDashboardStats } from "@artsdiva/api/dashboard.api";
import { ApiError } from "@artsdiva/api/http";
import type { DashboardStats } from "@artsdiva/types/dashboard.types";

interface UseDashboardStatsResult {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardStats(): UseDashboardStatsResult {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboardStats();
      setStats(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error };
}
