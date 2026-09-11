import { describe, expect, it } from "vitest";
import { debriefSummary, parseDebriefs, type DebriefRecord } from "../app/lib/debriefs";
import type { SavedTrip } from "../app/lib/trips";

const trip = { schemaVersion: 2, id: "trip-1", name: "Mount Kenya plan", region: "Kenya", date: "2026-09-10", duration: "4 days", distance: "", type: "Multi-day", notes: "", contactName: "Amina", contactPhone: "+254700000000", checkInPlan: "Daily", gear: [], coordinates: null, status: "completed", createdAt: "2026-09-01T00:00:00.000Z", updatedAt: "2026-09-12T00:00:00.000Z" } satisfies SavedTrip;
const record = { schemaVersion: 1, tripId: "trip-1", outcome: "turned-back", actualDuration: "6 hours", conditions: "Heavy rain", routeChanges: "Turned at the pass", gearLessons: "Dry bags worked", nextTime: "Earlier start", contactClosedOut: true, updatedAt: "2026-09-12T00:00:00.000Z" } satisfies DebriefRecord;

describe("trip debriefs", () => {
  it("recovers valid records and rejects mismatched keys", () => {
    const parsed = parseDebriefs(JSON.stringify({ "trip-1": record, wrong: record, broken: null }));
    expect(Object.keys(parsed)).toEqual(["trip-1"]);
  });

  it("normalizes unknown outcomes and limits imported text", () => {
    const parsed = parseDebriefs(JSON.stringify({ "trip-1": { ...record, outcome: "unsafe-value", conditions: "x".repeat(900) } }));
    expect(parsed["trip-1"].outcome).toBe("completed");
    expect(parsed["trip-1"].conditions).toHaveLength(800);
  });

  it("creates an honest, useful summary", () => {
    const summary = debriefSummary(trip, record);
    expect(summary).toContain("Turned at the pass");
    expect(summary).toContain("close-out: recorded");
    expect(summary).toContain("not verified route or safety advice");
  });
});
