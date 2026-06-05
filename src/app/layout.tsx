import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Je bent uitgenodigd voor het Groep 8 Eindfeest! Summer Beach Party op 15 juli 2026 bij De Conckelaer, vanaf 19:00.";

export const metadata: Metadata = {
  metadataBase: new URL("https://groep-8-beets-summer-beach.vercel.app"),
  title: "Summer Beach Party | Groep 8 Eindfeest",
  description: DESCRIPTION,
  // Private kids' party: keep it out of search results.
  robots: { index: false, follow: false },
  applicationName: "Beach Party",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Beach Party",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Groep 8 Eindfeest",
    title: "Summer Beach Party | Groep 8 Eindfeest",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Summer Beach Party | Groep 8 Eindfeest",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#3D2817",
  colorScheme: "light",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="nl" className={`${display.variable} ${body.variable}`}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
