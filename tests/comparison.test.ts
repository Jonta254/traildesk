import { describe, expect, it } from "vitest";
import { comparisonDestinations } from "../app/lib/comparison";

describe("comparison route selection", () => {
  it("uses an initial comparison when no routes are supplied", () => {
    expect(comparisonDestinations(undefined).map(d => d.id)).toEqual(["mount-kenya", "kilimanjaro"]);
  });
  it("ignores unknown IDs and duplicate selections while preserving order", () => {
    expect(comparisonDestinations(["rwenzori", "invalid", "rwenzori", "", "longonot"]).map(d => d.id)).toEqual(["rwenzori", "longonot"]);
  });
  it("limits shared links to three valid routes", () => {
    expect(comparisonDestinations(["longonot", "simien", "rwenzori", "mount-kenya"]).map(d => d.id)).toEqual(["longonot", "simien", "rwenzori"]);
  });
  it("handles a single route without inventing another selection", () => {
    expect(comparisonDestinations("simien").map(d => d.id)).toEqual(["simien"]);
    expect(comparisonDestinations("unknown")).toEqual([]);
  });
});
