import { apiRequest, buildQueryString } from "@artsdiva/api/http";
import type { SearchResults } from "@artsdiva/types/search.types";

export function search(query: string): Promise<SearchResults> {
  return apiRequest<SearchResults>(`/api/search${buildQueryString({ q: query })}`);
}
