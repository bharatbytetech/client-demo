export type DocumentRelatedType = "ARTIST" | "CLIENT";
export type DocumentFileType = "MOU" | "CONTRACT" | "CORRESPONDENCE" | "OTHER";

export interface DocumentLogEntry {
  id: string;
  relatedToType: DocumentRelatedType;
  relatedToId: string;
  fileUrl: string;
  fileType: DocumentFileType;
  uploadedAt: string;
  uploadedBy: string;
}
