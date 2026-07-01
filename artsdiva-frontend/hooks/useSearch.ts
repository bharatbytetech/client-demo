import { useEffect, useRef, useState } from "react";
import { search as searchRequest } from "@artsdiva/api/search.api";
import { ApiError } from "@artsdiva/api/http";
import type { SearchResults } from "@artsdiva/types/search.types";

const DEBOUNCE_MS = 300;
const EMPTY_RESULTS: SearchResults = { artworks: [], artists: [], clients: [] };

interface UseSearchResult {
  query: string;
  setQuery: (value: string) => void;
  results: SearchResults;
  isLoading: boolean;
  error: string | null;
}

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults(EMPTY_RESULTS);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      searchRequest(trimmed)
        .then((data) => {
          setResults(data);
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof ApiError ? err.message : "Search failed");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return { query, setQuery, results, isLoading, error };
}
