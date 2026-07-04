import React from "react";
import { useQuery } from "@tanstack/react-query";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { getClients, getClientById } from "@artsdiva/api/client.api";
import type { Client } from "@artsdiva/types/client.types";

interface ClientAutocompleteProps {
  value: string;
  onChange: (clientId: string) => void;
  error?: string;
  disabled?: boolean;
  redirectOnCreate?: string;
}

// Same pattern as ArtistAutocomplete: load the list once, filter
// client-side, and add new clients via an explicit button.
export function ClientAutocomplete({
  value,
  onChange,
  error,
  disabled,
  redirectOnCreate,
}: ClientAutocompleteProps) {
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

  const selected = options.find((c) => c.id === value) ?? null;

  const handleCreateNew = () => {
    const params = new URLSearchParams();
    if (redirectOnCreate) params.set("redirectTo", redirectOnCreate);
    window.location.href = `/clients/new?${params.toString()}`;
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <Autocomplete<Client>
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
          clients.length === 0
            ? "No clients yet — click New to add one"
            : "No matching clients"
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {option.name}
              </Typography>
              {option.contactInfo?.email && (
                <Typography variant="caption" color="text.secondary">
                  {option.contactInfo.email}
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
              placeholder="Select or search client"
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
