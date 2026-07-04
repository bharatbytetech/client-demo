import React from "react";
import { useQuery } from "@tanstack/react-query";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { getClients, getClientById } from "@artsdiva/api/client.api";
import type { Client } from "@artsdiva/types/client.types";

interface ClientSelectProps {
  value: string;
  onChange: (clientId: string) => void;
  error?: string;
  disabled?: boolean;
  redirectOnCreate?: string;
}

// Plain dropdown listing every client, with a New button beside it —
// mirrors ArtistSelect.
export function ClientSelect({
  value,
  onChange,
  error,
  disabled,
  redirectOnCreate,
}: ClientSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["clients-options"],
    queryFn: () => getClients({ limit: 100 }),
    staleTime: 30_000,
  });

  const clients = data?.data ?? [];

  const inList = clients.some((c) => c.id === value);
  const { data: prefilled } = useQuery({
    queryKey: ["client-prefill", value],
    queryFn: () => getClientById(value),
    enabled: !!value && !isLoading && !inList,
    staleTime: 60_000,
  });

  const options: Client[] =
    prefilled && !inList ? [prefilled, ...clients] : clients;

  const safeValue = options.some((c) => c.id === value) ? value : "";

  const handleCreateNew = () => {
    const params = new URLSearchParams();
    if (redirectOnCreate) params.set("redirectTo", redirectOnCreate);
    window.location.href = `/clients/new?${params.toString()}`;
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
            ? "Loading clients…"
            : options.length === 0
              ? "No clients yet — click New to add one"
              : "Select a client"}
        </MenuItem>
        {options.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.name}
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
