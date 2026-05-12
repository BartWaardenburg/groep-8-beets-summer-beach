import { describe, expect, it } from "vitest";
import { allCodes } from "@/lib/tokens";
import { GET } from "./route";

const get = async (code?: string) => {
  const url = code
    ? `http://localhost/api/me?code=${encodeURIComponent(code)}`
    : "http://localhost/api/me";
  return GET(new Request(url));
};

describe("GET /api/me", () => {
  it("requires a code query param", async () => {
    const res = await get();
    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown code", async () => {
    const res = await get("a".repeat(20));
    expect(res.status).toBe(404);
  });

  it("returns the kid for a valid code", async () => {
    const code = allCodes().Sepp;
    const res = await get(code);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { kid: string };
    expect(body.kid).toBe("Sepp");
  });
});
