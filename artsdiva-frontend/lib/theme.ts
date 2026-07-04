import { createTheme } from "@mui/material/styles";

// Design language: clean and quiet. White surfaces on a soft grey page,
// hairline borders + one soft shadow level, generous whitespace, and a
// clear type scale. No decoration that doesn't earn its place.

const theme = createTheme({
  palette: {
    background: { default: "#F6F7F9", paper: "#FFFFFF" },
    divider: "#E7E9EE",
    text: {
      primary: "#1A2027",
      secondary: "#5B6472",
      disabled: "#98A1B0",
    },
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    overline: { fontWeight: 700, letterSpacing: "0.08em" },
    button: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#F6F7F9" },
      },
    },
    MuiButton: {
      defaultProps: { disableRipple: true, disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          paddingLeft: 16,
          paddingRight: 16,
          "&:hover": { filter: "none" },
          "&:active": { filter: "none" },
        },
        sizeSmall: { paddingLeft: 12, paddingRight: 12 },
      },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
    },
    MuiListItemButton: {
      defaultProps: { disableRipple: true },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: "1px solid #E7E9EE",
          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        // Soften every low elevation to the same quiet shadow.
        elevation1: { boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)" },
        elevation2: { boxShadow: "0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)" },
        elevation3: { boxShadow: "0 4px 12px rgba(16, 24, 40, 0.08)" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& th": {
            backgroundColor: "#FAFBFC",
            fontWeight: 700,
            fontSize: "0.72rem",
            color: "#5B6472",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            borderBottom: "1px solid #E7E9EE",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #F0F2F5",
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { borderBottom: 0 },
          "&.MuiTableRow-hover:hover": { backgroundColor: "#F8F9FB" },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: "1px solid #E7E9EE" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: "0.75rem", lineHeight: 1.5, padding: "8px 12px", maxWidth: 280 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
  },
});

export default theme;
