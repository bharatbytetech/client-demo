import { z } from "zod";
import { paginationQuerySchema } from "./common.validator";

export const createLeaseSchema = z.object({
  artworkId: z.string().min(1, "artworkId is required"),
  clientId: z.string().min(1, "clientId is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  terms: z.string().optional(),
});

export const listLeasesQuerySchema = paginationQuerySchema.extend({
  artworkId: z.string().optional(),
  clientId: z.string().optional(),
});

export type CreateLeaseInput = z.infer<typeof createLeaseSchema>;
export type ListLeasesQuery = z.infer<typeof listLeasesQuerySchema>;
