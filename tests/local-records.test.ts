import { describe, expect, it } from "vitest";
import { parseGearProgress, parseReviewDraft } from "../app/lib/local-records";
import { isValidIsoDate, validateTripDates } from "../app/lib/trips";
import { restoreWorkspaceRecords, validateWorkspaceBackup } from "../app/lib/workspace";
import { TRIPS_STORAGE_KEY } from "../app/lib/trips";

describe("local record resilience", () => {
  it("recovers good checklist rows while rejecting malformed ones", () => {
    const result = parseGearProgress({ schemaVersion: 2, packed: { "Short day hike": ["Navigation backup", "Navigation backup", "Unknown item"], "Overnight trek": 1 } });
    expect(result.packed["Short day hike"]).toEqual(["Navigation backup"]);
    expect(result.packed["Overnight trek"]).toBeUndefined();
    expect(result.error).not.toBeNull();
    expect(parseGearProgress(null).packed).toEqual({});
  });
  it("rejects review values that would crash form fields", () => {
    expect(parseReviewDraft({ destinationId: "longonot", review: {} }, "longonot")).toBeNull();
    expect(parseReviewDraft({ destinationId: "simien", review: "Notes" }, "longonot")).toBeNull();
    expect(parseReviewDraft({ destinationId: "longonot", rating: "55" }, "longonot")).toBeNull();
    expect(parseReviewDraft({ destinationId: "longonot", visitMonth: "2026-13" }, "longonot")).toBeNull();
    expect(parseReviewDraft({ destinationId: "longonot", review: "A".repeat(1300) }, "longonot")?.review).toHaveLength(1200);
  });
  it("validates real calendar dates and expected return times", () => {
    expect(isValidIsoDate("2026-02-31")).toBe(false);
    expect(isValidIsoDate("2026-02-29")).toBe(false);
    expect(isValidIsoDate("2028-02-29")).toBe(true);
    expect(validateTripDates("2026-10-06", "not-a-date")).not.toBeNull();
    expect(validateTripDates("2026-10-06", "2026-10-06T24:00")).not.toBeNull();
    expect(validateTripDates("2026-10-06", "2026-10-06T00:00")).not.toBeNull();
    expect(validateTripDates("2026-10-06", "2026-10-07T16:30")).toBeNull();
  });
  it("rolls back earlier writes if restore runs out of storage", () => {
    const values: Record<string, string> = { first: "original", untouched: "keep" };
    const storage = {
      getItem: (key: string) => values[key] ?? null,
      setItem: (key: string, value: string) => { if (key === "third") throw new Error("quota"); values[key] = value; },
      removeItem: (key: string) => { delete values[key]; },
    };
    expect(() => restoreWorkspaceRecords(storage, { first: "new", second: "new", third: "new" })).toThrow("Existing records were kept.");
    expect(values).toEqual({ first: "original", untouched: "keep" });
  });
  it("keeps unrelated datasets during a successful restore", () => {
    const values: Record<string, string> = { untouched: "keep" };
    restoreWorkspaceRecords({ getItem: key => values[key] ?? null, setItem: (key, value) => { values[key] = value; }, removeItem: key => { delete values[key]; } }, { gear: { packed: {} } });
    expect(values.untouched).toBe("keep");
    expect(JSON.parse(values.gear)).toEqual({ packed: {} });
  });
  it("rejects a mixed trip batch instead of silently discarding bad records", () => {
    const result = validateWorkspaceBackup({ schemaVersion: 1, app: "TrailDesk", records: { [TRIPS_STORAGE_KEY]: [{ id: "one", name: "Valid" }, { broken: true }] } });
    expect(result.records).not.toHaveProperty(TRIPS_STORAGE_KEY);
    expect(result.errors).toHaveLength(1);
  });
});
