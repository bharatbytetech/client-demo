import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StatusBadge } from "@artsdiva/components/ui/StatusBadge";
import type { LeaseWithRefs } from "@artsdiva/types/lease.types";

interface LeaseHistoryTableProps {
  leases: LeaseWithRefs[];
  isLoading?: boolean;
  /** Which side of the lease to show — the other side is the page we're on. */
  show: "artwork" | "client";
  onRowClick?: (lease: LeaseWithRefs) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function LeaseHistoryTable({ leases, isLoading, show, onRowClick }: LeaseHistoryTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{show === "artwork" ? "Artwork" : "Client"}</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">Loading lease history…</Typography>
              </TableCell>
            </TableRow>
          ) : leases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">No leases yet.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            leases.map((lease) => (
              <TableRow
                key={lease.id}
                hover={Boolean(onRowClick)}
                sx={onRowClick ? { cursor: "pointer" } : undefined}
                onClick={() => onRowClick?.(lease)}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {show === "artwork" ? lease.artwork.title : lease.client.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{formatDate(lease.startDate)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {lease.endDate ? formatDate(lease.endDate) : "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{lease.rateAmount ?? "—"}</Typography>
                </TableCell>
                <TableCell>
                  <StatusBadge type="lease" status={lease.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
