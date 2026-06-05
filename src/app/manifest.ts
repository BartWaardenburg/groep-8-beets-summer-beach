import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "Summer Beach Party | Groep 8 Eindfeest",
  short_name: "Beach Party",
  description: "Het Groep 8 Eindfeest: Summer Beach Party. 15 juli 2026, De Conckelaer.",
  lang: "nl",
  start_url: "/",
  display: "standalone",
  background_color: "#3D2817",
  theme_color: "#3D2817",
  icons: [
    { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    { src: "/apple-icon", sizes: "180x180", type: "image/png" },
  ],
});

export default manifest;
