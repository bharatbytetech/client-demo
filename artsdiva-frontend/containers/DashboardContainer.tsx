import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import PaletteIcon from "@mui/icons-material/Palette";
import ImageIcon from "@mui/icons-material/Image";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { getDashboardStats } from "@artsdiva/api/dashboard.api";
import { useAuth } from "@artsdiva/hooks/useAuth";

// Same colors as StatusBadge's ARTWORK_STATUS_CONFIG, so this chart and the
// status chips used everywhere else in the app read as the same language.
const ARTWORK_STATUS_COLORS = { inCollection: "#16A34A", onLease: "#1D4ED8", sold: "#B45309" };

function greetingByHour(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STAT_CARDS = [
  { key: "artistsCount" as const,      label: "Artists",        icon: PaletteIcon,    href: "/artists", newThisMonthKey: undefined },
  { key: "artworksCount" as const,     label: "Artworks",       icon: ImageIcon,      href: "/artworks", newThisMonthKey: "artworks" as const },
  { key: "clientsCount" as const,      label: "Clients",        icon: PeopleIcon,     href: "/clients", newThisMonthKey: "clients" as const },
  { key: "activeLeasesCount" as const, label: "Active Leases",  icon: AssignmentIcon, href: "/artworks?status=ON_LEASE", newThisMonthKey: undefined },
];

function StatCardSkeleton() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="40%" height={44} />
        <Skeleton variant="text" width="60%" height={20} />
      </CardContent>
    </Card>
  );
}

export function DashboardContainer() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 60_000,
  });

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1100, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {greetingByHour()}{user ? `, ${user.name.split(" ")[0]}` : ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">{today}</Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Could not load stats — {error instanceof Error ? error.message : "please try again"}
        </Alert>
      )}

      {/* Quick actions */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 4, flexWrap: "wrap" }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => void router.push("/artists/new")}>
          Add Artist
        </Button>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => void router.push("/artworks/new")}>
          Add Artwork
        </Button>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => void router.push("/clients/new")}>
          Add Client
        </Button>
      </Box>

      {/* Stats */}
      <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
        Overview
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <StatCardSkeleton />
              </Grid>
            ))
          : STAT_CARDS.map((card) => {
              const IconCmp = card.icon;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.key}>
                  <Card variant="outlined">
                    <CardActionArea onClick={() => void router.push(card.href)}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(25, 118, 210, 0.08)",
                            color: "primary.main",
                            mb: 2,
                          }}
                        >
                          <IconCmp fontSize="small" />
                        </Box>
                        <Typography variant="h4" sx={{ lineHeight: 1, mb: 0.5 }}>
                          {stats ? stats[card.key] : 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.label}
                        </Typography>
                        {stats && card.newThisMonthKey && stats.newThisMonth[card.newThisMonthKey] > 0 && (
                          <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600, display: "block", mt: 0.25 }}>
                            +{stats.newThisMonth[card.newThisMonthKey]} this month
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
      </Grid>

      {/* Charts — inventory breakdown and 6-month growth trend */}
      {stats && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
            Insights
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Inventory by Status
                  </Typography>
                  <PieChart
                    series={[
                      {
                        data: [
                          { id: 0, value: stats.artworksByStatus.inCollection, label: "In Collection", color: ARTWORK_STATUS_COLORS.inCollection },
                          { id: 1, value: stats.artworksByStatus.onLease, label: "On Lease", color: ARTWORK_STATUS_COLORS.onLease },
                          { id: 2, value: stats.artworksByStatus.sold, label: "Sold", color: ARTWORK_STATUS_COLORS.sold },
                        ],
                        innerRadius: 40,
                        paddingAngle: 2,
                      },
                    ]}
                    height={220}
                    slotProps={{ legend: { direction: "vertical", position: { vertical: "middle", horizontal: "end" } } }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Growth — Last 6 Months
                  </Typography>
                  <LineChart
                    height={220}
                    xAxis={[{ scaleType: "band", data: stats.monthlyTrend.map((m) => m.month) }]}
                    series={[
                      { data: stats.monthlyTrend.map((m) => m.artworks), label: "New Artworks", color: "#1D4ED8" },
                      { data: stats.monthlyTrend.map((m) => m.clients), label: "New Clients", color: "#16A34A" },
                    ]}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Modules */}
      <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
        Modules
      </Typography>

      <Grid container spacing={2.5}>
        {[
          { icon: PaletteIcon, title: "Artists",  desc: "Manage artist profiles, commission terms, and MOU agreements.", viewHref: "/artists", addHref: "/artists/new" },
          { icon: ImageIcon,   title: "Artworks", desc: "Track the full collection — status, dimensions, acquisition dates, and images.", viewHref: "/artworks", addHref: "/artworks/new" },
          { icon: PeopleIcon,  title: "Clients",  desc: "Manage client relationships, contact info, and preferences.", viewHref: "/clients", addHref: "/clients/new" },
        ].map((mod) => {
          const IconCmp = mod.icon;
          return (
            <Grid size={{ xs: 12, md: 4 }} key={mod.title}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(25, 118, 210, 0.08)",
                      color: "primary.main",
                      mb: 2,
                    }}
                  >
                    <IconCmp fontSize="small" />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {mod.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mb: 2 }}>
                    {mod.desc}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => void router.push(mod.viewHref)} sx={{ flex: 1 }}>
                      View All
                    </Button>
                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => void router.push(mod.addHref)} sx={{ flex: 1 }}>
                      Add New
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

