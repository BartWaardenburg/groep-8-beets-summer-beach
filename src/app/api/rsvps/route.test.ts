import { beforeEach, describe, expect, it } from "vitest";
import { allCodes } from "@/lib/tokens";
import { GET, POST } from "./route";

const post = async (body: unknown) =>
  POST(
    new Request("http://localhost/api/rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

const reset = async () => {
  // Clear the in-memory store by importing the module and resetting via
  // a write-then-read cycle. There is no exported reset helper, so this
  // is mostly defensive: each module instance starts fresh.
};

describe("POST /api/rsvps", () => {
  beforeEach(reset);

  it("rejects invalid JSON", async () => {
    const res = await post("not json");
    expect(res.status).toBe(400);
  });

  it("requires code and emoji", async () => {
    const res = await post({ code: "abc" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/code en emoji/);
  });

  it("rejects an emoji that is not in the allowed set", async () => {
    const code = allCodes().Amelie;
    const res = await post({ code, emoji: "💩" });
    expect(res.status).toBe(400);
  });

  it("rejects an invalid code with 403", async () => {
    const res = await post({ code: "a".repeat(20), emoji: "🌴" });
    expect(res.status).toBe(403);
  });

  it("accepts a valid code + emoji and persists it", async () => {
    const code = allCodes().Daan;
    const res = await post({ code, emoji: "🌴" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      rsvps: Record<string, { emoji: string }>;
    };
    expect(body.ok).toBe(true);
    expect(body.rsvps.Daan?.emoji).toBe("🌴");
  });

  it("upserts on re-submission", async () => {
    const code = allCodes().Tijn;
    await post({ code, emoji: "🌴" });
    const res = await post({ code, emoji: "🍦" });
    const body = (await res.json()) as {
      rsvps: Record<string, { emoji: string }>;
    };
    expect(body.rsvps.Tijn?.emoji).toBe("🍦");
  });
});

describe("GET /api/rsvps", () => {
  it("returns the current map", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("rsvps");
    expect(typeof body.rsvps).toBe("object");
  });
});
