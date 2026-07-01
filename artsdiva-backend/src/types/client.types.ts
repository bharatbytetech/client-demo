import type { Artwork, Client, Lease } from "@prisma/client";
import type { ContactInfoDTO } from "./common.types";

export interface CreateClientDTO {
  name: string;
  contactInfo?: ContactInfoDTO;
  preferences?: string;
  notes?: string;
}

export type UpdateClientDTO = Partial<CreateClientDTO>;

export type ClientResponse = Client;

export interface ClientWithLeaseHistory extends Client {
  leases: Array<Lease & { artwork: Pick<Artwork, "id" | "title" | "images" | "status"> }>;
}

export interface ListClientsQuery {
  search?: string;
  page?: number;
  limit?: number;
}
