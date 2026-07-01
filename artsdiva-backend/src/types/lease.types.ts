import type { Artwork, Client, Lease, LeaseStatus } from "@prisma/client";

export interface CreateLeaseDTO {
  artworkId: string;
  clientId: string;
  startDate: Date;
  endDate?: Date;
  terms?: string;
}

export type LeaseResponse = Lease;

export interface LeaseWithRelations extends Lease {
  artwork: Artwork;
  client: Client;
}

export interface ListLeasesQuery {
  artworkId?: string;
  clientId?: string;
  page?: number;
  limit?: number;
}

export type LeaseStatusEnum = LeaseStatus;
