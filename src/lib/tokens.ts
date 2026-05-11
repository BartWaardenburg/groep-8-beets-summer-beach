import { createHmac, timingSafeEqual } from "node:crypto";
import { KIDS, type Kid } from "./kids";

const SALT = process.env.RSVP_SALT ?? "beets-groep-8-summer-beach-2026-dev-salt";

const codeFor = (kid: Kid): string =>
  createHmac("sha256", SALT).update(kid).digest("hex").slice(0, 20);

export const kidFromCode = (code: string): Kid | null => {
  if (!/^[a-f0-9]{20}$/i.test(code)) return null;
  const probe = Buffer.from(code, "utf8");
  for (const kid of KIDS) {
    const expected = Buffer.from(codeFor(kid), "utf8");
    if (probe.length === expected.length && timingSafeEqual(probe, expected)) {
      return kid;
    }
  }
  return null;
};

export const allCodes = (): Record<Kid, string> => {
  const map = {} as Record<Kid, string>;
  for (const kid of KIDS) map[kid] = codeFor(kid);
  return map;
};
