import { describe, expect, it } from "vitest";
import { toPersianDigits } from "./persian";

describe("toPersianDigits", () => {
  it("converts Latin digits to Persian", () => {
    expect(toPersianDigits("1404")).toBe("۱۴۰۴");
  });
  it("converts numbers", () => {
    expect(toPersianDigits(12)).toBe("۱۲");
  });
  it("leaves non-digit characters untouched", () => {
    expect(toPersianDigits("session 3 of 8")).toBe("session ۳ of ۸");
  });
  it("handles empty string", () => {
    expect(toPersianDigits("")).toBe("");
  });
});
