import { Manrope, Bebas_Neue } from "next/font/google";

// UI text — body, lowercase labels, supporting copy.
const ui = Manrope({
  variable: "--font-ui",
  subsets: ["latin"],
});

// Display — used for "VIP", names, and the page title. Condensed all-caps
// sans gives the backstage-pass feel.
const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const VisitekaartjesLayout = ({ children }: { children: React.ReactNode }) => (
  <div className={`${ui.variable} ${display.variable}`}>{children}</div>
);

export default VisitekaartjesLayout;
