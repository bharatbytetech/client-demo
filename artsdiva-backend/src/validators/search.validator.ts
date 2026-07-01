import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().min(1, "q is required"),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
