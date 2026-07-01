import type { DocumentFileType, DocumentLogEntry } from "@artsdiva/types/document.types";

const FILE_TYPE_LABELS: Record<DocumentFileType, string> = {
  MOU: "MOU",
  CONTRACT: "Contract",
  CORRESPONDENCE: "Correspondence",
  OTHER: "Other",
};

interface DocumentLogSectionProps {
  documents: DocumentLogEntry[];
  isLoading: boolean;
  error: string | null;
  canDelete: boolean;
  fileType: DocumentFileType;
  onFileTypeChange: (fileType: DocumentFileType) => void;
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}

export function DocumentLogSection({
  documents,
  isLoading,
  error,
  canDelete,
  fileType,
  onFileTypeChange,
  onUpload,
  onDelete,
}: DocumentLogSectionProps) {
  return (
    <div>
      <h2 className="text-sm font-medium">Documents</h2>

      <div className="mt-2 flex items-center gap-2">
        <select
          value={fileType}
          onChange={(e) => onFileTypeChange(e.target.value as DocumentFileType)}
          className="border px-2 py-1 text-sm"
        >
          {Object.entries(FILE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
          className="text-sm"
        />
      </div>

      {isLoading && <p className="mt-2 text-sm">Loading documents...</p>}
      {error && (
        <p role="alert" className="mt-2 text-sm">
          {error}
        </p>
      )}

      {!isLoading && (
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Type</th>
              <th className="py-2">Uploaded</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td className="py-2">{FILE_TYPE_LABELS[doc.fileType]}</td>
                <td className="py-2">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td className="py-2 text-right">
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="underline">
                    Download
                  </a>
                  {canDelete && (
                    <button onClick={() => onDelete(doc.id)} className="ml-2 underline">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center">
                  No documents yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
