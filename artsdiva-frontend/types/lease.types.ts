export type LeaseStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface Lease {
  id: string;
  artworkId: string;
  clientId: string;
  startDate: string;
  endDate?: string | null;
  rateAmount?: number | null;
  terms?: string | null;
  status: LeaseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaseDTO {
  artworkId: string;
  clientId: string;
  startDate: string;
  endDate?: string;
  rateAmount: number;
  terms?: string;
}

/** Lease as returned by the list endpoint — includes both related records. */
export interface LeaseWithRefs extends Lease {
  artwork: { id: string; title: string; images: string[] };
  client: { id: string; name: string };
}

export interface ListLeasesParams {
  artworkId?: string;
  clientId?: string;
  page?: number;
  limit?: number;
}
