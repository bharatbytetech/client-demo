import { z } from "zod";
import { contactInfoSchema, paginationQuerySchema } from "./common.validator";

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactInfo: contactInfoSchema.optional(),
  preferences: z.string().optional(),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const listClientsQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>;
