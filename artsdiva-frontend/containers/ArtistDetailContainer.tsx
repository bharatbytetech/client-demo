import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@artsdiva/hooks/useAuth";
import { useArtist } from "@artsdiva/hooks/useArtist";
import { useDocuments } from "@artsdiva/hooks/useDocuments";
import { ArtistDetail } from "@artsdiva/components/ArtistDetail";
import { DocumentLogSection } from "@artsdiva/components/DocumentLogSection";
import type { DocumentFileType } from "@artsdiva/types/document.types";

interface ArtistDetailContainerProps {
  artistId: string;
}

export function ArtistDetailContainer({ artistId }: ArtistDetailContainerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { artist, isLoading, error, deleteArtist } = useArtist(artistId);
  const documents = useDocuments("ARTIST", artistId);
  const [fileType, setFileType] = useState<DocumentFileType>("MOU");

  const handleDelete = (): void => {
    if (!window.confirm("Delete this artist?")) return;
    void deleteArtist().then((success) => {
      if (success) void router.push("/artists");
    });
  };

  if (isLoading) return <p className="text-sm">Loading...</p>;
  if (error || !artist)
    return (
      <p role="alert" className="text-sm">
        {error ?? "Artist not found"}
      </p>
    );

  return (
    <>
      <ArtistDetail
        artist={artist}
        canDelete={user?.role === "ADMIN"}
        onEdit={() => void router.push(`/artists/${artistId}/edit`)}
        onDelete={handleDelete}
        onArtworkClick={(artworkId) => void router.push(`/artworks/${artworkId}`)}
      />

      <div className="mt-6">
        <DocumentLogSection
          documents={documents.documents}
          isLoading={documents.isLoading}
          error={documents.error}
          canDelete={user?.role === "ADMIN"}
          fileType={fileType}
          onFileTypeChange={setFileType}
          onUpload={(file) => void documents.upload(fileType, file)}
          onDelete={(id) => void documents.remove(id)}
        />
      </div>
    </>
  );
}
