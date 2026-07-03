import { useAuth } from "@artsdiva/hooks/useAuth";
import { useDashboardStats } from "@artsdiva/hooks/useDashboardStats";
import { DashboardStatsGrid } from "@artsdiva/components/DashboardStatsGrid";

export function DashboardContainer() {
  const { user } = useAuth();
  const { stats, isLoading, error } = useDashboardStats();

  return (
    <div>
      <h1 className="text-lg font-medium">Welcome{user ? `, ${user.name}` : ""}</h1>

      {isLoading && <p className="mt-4 text-sm text-muted">Loading...</p>}
      {error && (
        <p role="alert" className="mt-4 text-sm">
          {error}
        </p>
      )}

      {stats && (
        <div className="mt-4">
          <DashboardStatsGrid stats={stats} />
        </div>
      )}
    </div>
  );
}
