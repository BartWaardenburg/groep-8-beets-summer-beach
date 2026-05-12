import { describe, expect, it } from "vitest";
import { KIDS } from "./kids";
import { allCodes, kidFromCode } from "./tokens";

describe("allCodes", () => {
  it("returns a code for every kid", () => {
    const codes = allCodes();
    expect(Object.keys(codes)).toHaveLength(KIDS.length);
    for (const kid of KIDS) {
      expect(codes[kid]).toMatch(/^[a-f0-9]{20}$/);
    }
  });

  it("produces unique codes across all kids", () => {
    const codes = allCodes();
    const values = Object.values(codes);
    expect(new Set(values).size).toBe(values.length);
  });

  it("is deterministic for the same salt", () => {
    const a = allCodes();
    const b = allCodes();
    for (const kid of KIDS) expect(a[kid]).toBe(b[kid]);
  });
});

describe("kidFromCode", () => {
  it("resolves each valid code back to its kid", () => {
    const codes = allCodes();
    for (const kid of KIDS) {
      expect(kidFromCode(codes[kid])).toBe(kid);
    }
  });

  it("rejects malformed codes", () => {
    expect(kidFromCode("")).toBeNull();
    expect(kidFromCode("not-hex")).toBeNull();
    expect(kidFromCode("abc")).toBeNull(); // too short
    expect(kidFromCode("a".repeat(20))).toBeNull(); // right length, wrong hash
    expect(kidFromCode("a".repeat(40))).toBeNull(); // too long
    expect(kidFromCode("ZZZZZZZZZZZZZZZZZZZZ")).toBeNull(); // non-hex chars
  });

  it("rejects a tampered code (one char flipped)", () => {
    const code = allCodes().Amelie;
    const flipped = `${code.slice(0, -1)}${code.endsWith("0") ? "1" : "0"}`;
    expect(kidFromCode(flipped)).toBeNull();
  });
});
