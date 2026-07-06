import { prisma } from "../lib/prisma";
import type { DashboardStats } from "../types/dashboard.types";

const active = { isDeleted: false };
const MONTHLY_TREND_MONTHS = 6;

function monthBounds(monthsAgo: number): { start: Date; end: Date; label: string } {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - monthsAgo);

  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  return { start, end, label: start.toLocaleDateString("en-GB", { month: "short" }) };
}

export async function getStats(): Promise<DashboardStats> {
  const currentMonth = monthBounds(0);

  const [
    artistsCount,
    artworksCount,
    clientsCount,
    activeLeasesCount,
    inCollectionCount,
    onLeaseCount,
    soldCount,
    newArtworksThisMonth,
    newClientsThisMonth,
  ] = await Promise.all([
    prisma.artist.count({ where: active }),
    prisma.artwork.count({ where: active }),
    prisma.client.count({ where: active }),
    prisma.lease.count({ where: { status: "ACTIVE" } }),
    prisma.artwork.count({ where: { ...active, status: "IN_COLLECTION" } }),
    prisma.artwork.count({ where: { ...active, status: "ON_LEASE" } }),
    prisma.artwork.count({ where: { ...active, status: "SOLD" } }),
    prisma.artwork.count({ where: { ...active, createdAt: { gte: currentMonth.start } } }),
    prisma.client.count({ where: { ...active, createdAt: { gte: currentMonth.start } } }),
  ]);

  // Last 6 months (oldest first) so the frontend can plot a real trend line
  // instead of a single "this month" number.
  const months = Array.from({ length: MONTHLY_TREND_MONTHS }, (_, i) => monthBounds(MONTHLY_TREND_MONTHS - 1 - i));
  const monthlyTrend = await Promise.all(
    months.map(async ({ start, end, label }) => {
      const [artworks, clients] = await Promise.all([
        prisma.artwork.count({ where: { ...active, createdAt: { gte: start, lt: end } } }),
        prisma.client.count({ where: { ...active, createdAt: { gte: start, lt: end } } }),
      ]);
      return { month: label, artworks, clients };
    })
  );

  return {
    artistsCount,
    artworksCount,
    clientsCount,
    activeLeasesCount,
    artworksByStatus: { inCollection: inCollectionCount, onLease: onLeaseCount, sold: soldCount },
    newThisMonth: { artworks: newArtworksThisMonth, clients: newClientsThisMonth },
    monthlyTrend,
  };
}
