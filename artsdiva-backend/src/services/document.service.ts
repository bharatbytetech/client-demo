import type { DocumentLog, DocumentRelatedType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { CreateDocumentInput, ListDocumentsQuery } from "../validators/document.validator";

export class DocumentNotFoundError extends Error {}
export class RelatedRecordNotFoundError extends Error {}

async function assertRelatedRecordExists(
  relatedToType: DocumentRelatedType,
  relatedToId: string
): Promise<void> {
  if (relatedToType === "ARTIST") {
    const artist = await prisma.artist.findUnique({ where: { id: relatedToId } });
    if (!artist) throw new RelatedRecordNotFoundError("Artist not found");
  } else {
    const client = await prisma.client.findUnique({ where: { id: relatedToId } });
    if (!client) throw new RelatedRecordNotFoundError("Client not found");
  }
}

export async function listDocuments(query: ListDocumentsQuery): Promise<DocumentLog[]> {
  return prisma.documentLog.findMany({
    where: {
      ...(query.relatedToType ? { relatedToType: query.relatedToType } : {}),
      ...(query.relatedToId ? { relatedToId: query.relatedToId } : {}),
    },
    orderBy: { uploadedAt: "desc" },
  });
}

export async function createDocument(
  input: CreateDocumentInput,
  fileUrl: string,
  uploadedBy: string
): Promise<DocumentLog> {
  await assertRelatedRecordExists(input.relatedToType, input.relatedToId);

  return prisma.documentLog.create({
    data: {
      relatedToType: input.relatedToType,
      relatedToId: input.relatedToId,
      fileUrl,
      fileType: input.fileType,
      uploadedBy,
    },
  });
}

export async function deleteDocument(id: string): Promise<void> {
  const document = await prisma.documentLog.findUnique({ where: { id } });
  if (!document) {
    throw new DocumentNotFoundError("Document not found");
  }
  await prisma.documentLog.delete({ where: { id } });
}
