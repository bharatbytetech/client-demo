import React from "react";
import { useQuery } from "@tanstack/react-query";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { getArtists, getArtistById } from "@artsdiva/api/artist.api";
import type { Artist } from "@artsdiva/types/artist.types";

interface ArtistAutocompleteProps {
  value: string;
  onChange: (artistId: string) => void;
  error?: string;
  disabled?: boolean;
  redirectOnCreate?: string;
}

// Simple and reliable: load the artist list once, let MUI filter it
// client-side as the user types, and keep "add a new artist" as a plain
// button next to the field instead of a fake option inside the dropdown.
export function ArtistAutocomplete({
  value,
  onChange,
  error,
  disabled,
  redirectOnCreate,
}: ArtistAutocompleteProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["artists-options"],
    queryFn: () => getArtists({ limit: 100 }),
    staleTime: 30_000,
  });

  const artists = data?.data ?? [];

  // Edit mode: the pre-selected artist may not be inside the first page of
  // options — fetch it by ID so the field can still display it.
  const inList = artists.some((a) => a.id === value);
  const { data: prefilled } = useQuery({
    queryKey: ["artist-prefill", value],
    queryFn: () => getArtistById(value),
    enabled: !!value && !isLoading && !inList,
    staleTime: 60_000,
  });

  const options: Artist[] =
    prefilled && !inList ? [prefilled, ...artists] : artists;

  const selected = options.find((a) => a.id === value) ?? null;

  const handleCreateNew = () => {
    const params = new URLSearchParams();
    if (redirectOnCreate) params.set("redirectTo", redirectOnCreate);
    window.location.href = `/artists/new?${params.toString()}`;
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <Autocomplete<Artist>
        sx={{ flex: 1 }}
        size="small"
        options={options}
        getOptionLabel={(opt) => opt.name}
        value={selected}
        onChange={(_, opt) => onChange(opt?.id ?? "")}
        isOptionEqualToValue={(opt, val) => opt.id === val.id}
        loading={isLoading}
        disabled={disabled}
        noOptionsText={
          artists.length === 0
            ? "No artists yet — click New to add one"
            : "No matching artists"
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {option.name}
              </Typography>
              {option.commissionTerms && (
                <Typography variant="caption" color="text.secondary">
                  {option.commissionTerms}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        renderInput={(params) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p = params as any;
          return (
            <TextField
              {...params}
              placeholder="Select or search artist"
              error={!!error}
              helperText={error}
              slotProps={{
                input: {
                  ...p.InputProps,
                  endAdornment: (
                    <>
                      {isLoading && <CircularProgress size={16} />}
                      {p.InputProps?.endAdornment}
                    </>
                  ),
                },
                htmlInput: p.inputProps,
              }}
            />
          );
        }}
      />
      <Button
        variant="outlined"
        onClick={handleCreateNew}
        disabled={disabled}
        startIcon={<AddIcon />}
        sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
      >
        New
      </Button>
    </Box>
  );
}
