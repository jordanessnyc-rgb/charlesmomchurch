import { describe, expect, it } from "vitest";
import { paragraphs, slugify, youtubeId } from "@/lib/utils";

describe("utils", () => {
  it("slugify strips accents and punctuation", () => {
    expect(slugify("Noche de Adoración & Milagros!")).toBe("noche-de-adoracion-milagros");
  });
  it("paragraphs handles headings followed by text on the next line", () => {
    expect(paragraphs("## Who we are\nWe are a church.\n\nSecond paragraph.")).toEqual([
      { type: "h", text: "Who we are" },
      { type: "p", text: "We are a church." },
      { type: "p", text: "Second paragraph." },
    ]);
  });
  it("youtubeId accepts urls and bare ids", () => {
    expect(youtubeId("https://www.youtube.com/watch?v=abc123XYZ_-")).toBe("abc123XYZ_-");
    expect(youtubeId("abc123XYZ_-")).toBe("abc123XYZ_-");
  });
});
