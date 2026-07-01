import { useCallback, useEffect, useState } from "react";
import {
  deleteDocument as deleteDocumentRequest,
  getDocuments,
  uploadDocument as uploadDocumentRequest,
} from "@artsdiva/api/document.api";
import { ApiError } from "@artsdiva/api/http";
import type { DocumentFileType, DocumentLogEntry, DocumentRelatedType } from "@artsdiva/types/document.types";

interface UseDocumentsResult {
  documents: DocumentLogEntry[];
  isLoading: boolean;
  error: string | null;
  upload: (fileType: DocumentFileType, file: File) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
}

export function useDocuments(
  relatedToType: DocumentRelatedType,
  relatedToId: string | undefined
): UseDocumentsResult {
  const [documents, setDocuments] = useState<DocumentLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (): Promise<void> => {
    if (!relatedToId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDocuments(relatedToType, relatedToId);
      setDocuments(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }, [relatedToType, relatedToId]);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  const upload = useCallback(
    async (fileType: DocumentFileType, file: File): Promise<boolean> => {
      if (!relatedToId) return false;
      try {
        await uploadDocumentRequest(relatedToType, relatedToId, fileType, file);
        await fetchDocuments();
        return true;
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to upload document");
        return false;
      }
    },
    [relatedToType, relatedToId, fetchDocuments]
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteDocumentRequest(id);
        await fetchDocuments();
        return true;
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to delete document");
        return false;
      }
    },
    [fetchDocuments]
  );

  return { documents, isLoading, error, upload, remove };
}
