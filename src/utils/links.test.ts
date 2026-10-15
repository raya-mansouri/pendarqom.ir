import { describe, expect, it } from "vitest";
import { telHref, whatsappLink, workshopSignupMessage } from "./links";

describe("telHref", () => {
  it("strips spaces and dashes, keeps +", () => {
    expect(telHref("+98 25-3xxx")).toBe("tel:+98253xxx");
  });
  it("normalizes persian digits before building tel link", () => {
    expect(telHref("۰۲۵ ۳۳۳۳")).toBe("tel:0253333");
  });
});

describe("whatsappLink", () => {
  it("builds wa.me url from intl number", () => {
    expect(whatsappLink("+98 912 345 6789")).toBe("https://wa.me/989123456789");
  });
  it("appends encoded message", () => {
    const url = whatsappLink("989123456789", "سلام");
    expect(url).toBe(`https://wa.me/989123456789?text=${encodeURIComponent("سلام")}`);
  });
  it("normalizes persian digits before building wa.me url", () => {
    expect(whatsappLink("۹۸۹۱۲۳۴۵۶۷۸۹", "سلام")).toBe(
      `https://wa.me/989123456789?text=${encodeURIComponent("سلام")}`,
    );
  });
});

describe("workshopSignupMessage", () => {
  it("includes the workshop title", () => {
    expect(workshopSignupMessage("مهارت‌های فرزندپروری")).toContain("مهارت‌های فرزندپروری");
    expect(workshopSignupMessage("x")).toMatch(/^سلام/);
  });
});
