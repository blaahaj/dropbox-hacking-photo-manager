"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const ClientThemeProvider = ({ children }: PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default ClientThemeProvider;
