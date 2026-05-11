import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Summer Beach Party | Groep 8 Eindfeest",
  description:
    "Je bent uitgenodigd voor het Groep 8 Eindfeest! Summer Beach Party — een onvergetelijk afscheidsfeest.",
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
