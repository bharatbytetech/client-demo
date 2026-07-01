import type { SearchResultItem, SearchResults } from "@artsdiva/types/search.types";

interface SearchResultsDropdownProps {
  results: SearchResults;
  isLoading: boolean;
  onSelect: (item: SearchResultItem) => void;
}

const SECTIONS: Array<{ key: keyof SearchResults; label: string }> = [
  { key: "artworks", label: "Artworks" },
  { key: "artists", label: "Artists" },
  { key: "clients", label: "Clients" },
];

export function SearchResultsDropdown({ results, isLoading, onSelect }: SearchResultsDropdownProps) {
  const hasResults = SECTIONS.some((section) => results[section.key].length > 0);

  return (
    <div className="absolute right-0 z-10 mt-1 w-64 border bg-[var(--background)] text-sm shadow-sm">
      {isLoading && <p className="px-2 py-1">Searching...</p>}

      {!isLoading && !hasResults && <p className="px-2 py-1">No results.</p>}

      {!isLoading &&
        SECTIONS.map(
          (section) =>
            results[section.key].length > 0 && (
              <div key={section.key}>
                <p className="px-2 pt-2 text-xs font-medium">{section.label}</p>
                {results[section.key].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="block w-full px-2 py-1 text-left hover:underline"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )
        )}
    </div>
  );
}
