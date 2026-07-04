import React from "react";
import { useQuery } from "@tanstack/react-query";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { getArtists, getArtistById } from "@artsdiva/api/artist.api";
import type { Artist } from "@artsdiva/types/artist.types";

interface ArtistSelectProps {
  value: string;
  onChange: (artistId: string) => void;
  error?: string;
  disabled?: boolean;
  redirectOnCreate?: string;
}

// Plain dropdown listing every artist, with a New button beside it for
// creating one on the spot (returns here with the new artist selected).
export function ArtistSelect({
  value,
  onChange,
  error,
  disabled,
  redirectOnCreate,
}: ArtistSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["artists-options"],
    queryFn: () => getArtists({ limit: 100 }),
    staleTime: 30_000,
  });

  const artists = data?.data ?? [];

  // Edit mode: the saved artist may not be in the first page — fetch by ID
  // so the dropdown can still display it.
  const inList = artists.some((a) => a.id === value);
  const { data: prefilled } = useQuery({
    queryKey: ["artist-prefill", value],
    queryFn: () => getArtistById(value),
    enabled: !!value && !isLoading && !inList,
    staleTime: 60_000,
  });

  const options: Artist[] =
    prefilled && !inList ? [prefilled, ...artists] : artists;

  // Never pass a value the menu doesn't contain — MUI logs warnings and
  // renders an empty field.
  const safeValue = options.some((a) => a.id === value) ? value : "";

  const handleCreateNew = () => {
    const params = new URLSearchParams();
    if (redirectOnCreate) params.set("redirectTo", redirectOnCreate);
    window.location.href = `/artists/new?${params.toString()}`;
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <TextField
        select
        fullWidth
        size="small"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error}
        disabled={disabled || isLoading}
        sx={{ flex: 1 }}
        slotProps={{ select: { displayEmpty: true } }}
      >
        <MenuItem value="" disabled>
          {isLoading
            ? "Loading artists…"
            : options.length === 0
              ? "No artists yet — click New to add one"
              : "Select an artist"}
        </MenuItem>
        {options.map((artist) => (
          <MenuItem key={artist.id} value={artist.id}>
            {artist.name}
          </MenuItem>
        ))}
      </TextField>
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
