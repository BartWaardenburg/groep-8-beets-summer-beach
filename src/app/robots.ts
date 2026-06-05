import type { MetadataRoute } from "next";

// Private invite: keep the whole site out of search crawlers. Paired with the
// `noindex, nofollow` robots meta in layout metadata.
const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", disallow: "/" },
});

export default robots;
