import { prisma } from "../lib/prisma";
import type { DashboardStats } from "../types/dashboard.types";

export async function getStats(): Promise<DashboardStats> {
  const [artistsCount, artworksCount, clientsCount, activeLeasesCount] = await Promise.all([
    prisma.artist.count(),
    prisma.artwork.count(),
    prisma.client.count(),
    prisma.lease.count({ where: { status: "ACTIVE" } }),
  ]);

  return { artistsCount, artworksCount, clientsCount, activeLeasesCount };
}
