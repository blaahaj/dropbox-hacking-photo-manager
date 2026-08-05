// import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import { Outlet } from "react-router";

import ProvideContexts from "./provideContexts";
config.autoAddCss = false;

// Import icons individually to reduce bundle size
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import CssBaseline from "@mui/material/CssBaseline";

import ClientThemeProvider from "./clientThemeProvider";
library.add(faCoffee, faTwitter);

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProvideContexts>
      <ClientThemeProvider>
        <CssBaseline />
        {children}
      </ClientThemeProvider>
    </ProvideContexts>
  );
}

export default function Layout() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
