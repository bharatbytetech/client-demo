import { prisma } from "../lib/prisma";
import type { DashboardStats } from "../types/dashboard.types";

const active = { isDeleted: false };

export async function getStats(): Promise<DashboardStats> {
  const [artistsCount, artworksCount, clientsCount, activeLeasesCount] = await Promise.all([
    prisma.artist.count({ where: active }),
    prisma.artwork.count({ where: active }),
    prisma.client.count({ where: active }),
    prisma.lease.count({ where: { status: "ACTIVE" } }),
  ]);

  return { artistsCount, artworksCount, clientsCount, activeLeasesCount };
}
