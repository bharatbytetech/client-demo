import { prisma } from "../lib/prisma";
import type { SearchQuery } from "../validators/search.validator";
import type { SearchResults } from "../types/search.types";

// Kept small — this powers a dropdown, not a full results page.
const SEARCH_RESULT_LIMIT = 10;

export async function search(query: SearchQuery): Promise<SearchResults> {
  const { q } = query;

  const [artworks, artists, clients] = await Promise.all([
    prisma.artwork.findMany({
      where: {
        OR: [{ title: { contains: q, mode: "insensitive" } }, { medium: { contains: q, mode: "insensitive" } }],
      },
      select: { id: true, title: true },
      take: SEARCH_RESULT_LIMIT,
    }),
    prisma.artist.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true },
      take: SEARCH_RESULT_LIMIT,
    }),
    prisma.client.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true },
      take: SEARCH_RESULT_LIMIT,
    }),
  ]);

  return {
    artworks: artworks.map((artwork) => ({ id: artwork.id, label: artwork.title, type: "artwork" as const })),
    artists: artists.map((artist) => ({ id: artist.id, label: artist.name, type: "artist" as const })),
    clients: clients.map((client) => ({ id: client.id, label: client.name, type: "client" as const })),
  };
}
