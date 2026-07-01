export type SearchResultType = "artwork" | "artist" | "client";

export interface SearchResultItem {
  id: string;
  label: string;
  type: SearchResultType;
}

export interface SearchResults {
  artworks: SearchResultItem[];
  artists: SearchResultItem[];
  clients: SearchResultItem[];
}
