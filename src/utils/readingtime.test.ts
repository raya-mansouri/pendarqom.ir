import { describe, expect, it } from "vitest";
import { readingTimeMinutes } from "./readingtime";

describe("readingTimeMinutes", () => {
  it("returns at least 1 minute", () => {
    expect(readingTimeMinutes("سلام")).toBe(1);
  });
  it("scales with word count at ~200 wpm", () => {
    const text = Array(400).fill("کلمه").join(" ");
    expect(readingTimeMinutes(text)).toBe(2);
  });
  it("ignores whitespace-only text", () => {
    expect(readingTimeMinutes("   ")).toBe(1);
  });
});
