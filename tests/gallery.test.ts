import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DESTINATION_GALLERY } from "../app/lib/photo-credits";

describe("destination photography", () => {
  it("keeps gallery images local, described, and attributed", () => {
    for (const photos of Object.values(DESTINATION_GALLERY)) for (const photo of photos) {
      expect(photo.src).toMatch(/^\/explore\/gallery\//);
      expect(existsSync(join(process.cwd(), "public", photo.src.slice(1)))).toBe(true);
      expect(photo.alt.length).toBeGreaterThan(30);
      expect(photo.caption.length).toBeGreaterThan(30);
      expect(photo.source).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(photo.licenseUrl).toMatch(/^https:\/\//);
    }
  });
});
