import { apiRequest } from "@artsdiva/api/http";
import type { DashboardStats } from "@artsdiva/types/dashboard.types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const { stats } = await apiRequest<{ stats: DashboardStats }>("/api/dashboard/stats");
  return stats;
}
