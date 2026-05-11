import type { Metadata } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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
  <html lang="nl" className={`${fredoka.variable} ${dmSans.variable}`}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
