import type { DocumentFileType, DocumentLog, DocumentRelatedType } from "@prisma/client";

export interface CreateDocumentDTO {
  relatedToType: DocumentRelatedType;
  relatedToId: string;
  fileType: DocumentFileType;
}

export type DocumentResponse = DocumentLog;

export interface ListDocumentsQuery {
  relatedToType?: DocumentRelatedType;
  relatedToId?: string;
}
