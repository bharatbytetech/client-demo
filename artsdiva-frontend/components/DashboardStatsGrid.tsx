import type { DashboardStats } from "@artsdiva/types/dashboard.types";

interface DashboardStatCard {
  label: string;
  value: number;
  href: string;
}

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const cards: DashboardStatCard[] = [
    { label: "Artists", value: stats.artistsCount, href: "/artists" },
    { label: "Artworks", value: stats.artworksCount, href: "/artworks" },
    { label: "Clients", value: stats.clientsCount, href: "/clients" },
    { label: "Active leases", value: stats.activeLeasesCount, href: "/artworks?status=ON_LEASE" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <a
          key={card.label}
          href={card.href}
          className="rounded border border-border bg-surface px-4 py-3 transition-colors hover:border-foreground"
        >
          <p className="text-2xl font-semibold">{card.value}</p>
          <p className="text-sm text-muted">{card.label}</p>
        </a>
      ))}
    </div>
  );
}
