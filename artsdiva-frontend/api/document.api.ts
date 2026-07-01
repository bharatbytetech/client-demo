import { apiRequest, buildQueryString } from "@artsdiva/api/http";
import type { DocumentFileType, DocumentLogEntry, DocumentRelatedType } from "@artsdiva/types/document.types";

export async function getDocuments(
  relatedToType: DocumentRelatedType,
  relatedToId: string
): Promise<DocumentLogEntry[]> {
  const { documents } = await apiRequest<{ documents: DocumentLogEntry[] }>(
    `/api/documents${buildQueryString({ relatedToType, relatedToId })}`
  );
  return documents;
}

export async function uploadDocument(
  relatedToType: DocumentRelatedType,
  relatedToId: string,
  fileType: DocumentFileType,
  file: File
): Promise<DocumentLogEntry> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("relatedToType", relatedToType);
  formData.append("relatedToId", relatedToId);
  formData.append("fileType", fileType);

  const { document } = await apiRequest<{ document: DocumentLogEntry }>("/api/documents", {
    method: "POST",
    body: formData,
  });
  return document;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiRequest<void>(`/api/documents/${id}`, { method: "DELETE" });
}
