export interface DashboardStats {
  artistsCount: number;
  artworksCount: number;
  clientsCount: number;
  activeLeasesCount: number;
  artworksByStatus: { inCollection: number; onLease: number; sold: number };
  newThisMonth: { artworks: number; clients: number };
  monthlyTrend: { month: string; artworks: number; clients: number }[];
}
