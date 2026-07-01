import { z } from "zod";

const relatedToTypeEnum = z.enum(["ARTIST", "CLIENT"]);
const fileTypeEnum = z.enum(["MOU", "CONTRACT", "CORRESPONDENCE", "OTHER"]);

export const createDocumentSchema = z.object({
  relatedToType: relatedToTypeEnum,
  relatedToId: z.string().min(1, "relatedToId is required"),
  fileType: fileTypeEnum,
});

export const listDocumentsQuerySchema = z.object({
  relatedToType: relatedToTypeEnum.optional(),
  relatedToId: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type ListDocumentsQuery = z.infer<typeof listDocumentsQuerySchema>;
