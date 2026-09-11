import type { SavedTrip } from "./trips";

export const DEBRIEFS_STORAGE_KEY = "traildesk_debriefs_v1";
export type TripOutcome = "completed" | "turned-back" | "changed-route" | "cancelled";

export interface DebriefRecord {
  schemaVersion: 1;
  tripId: string;
  outcome: TripOutcome;
  actualDuration: string;
  conditions: string;
  routeChanges: string;
  gearLessons: string;
  nextTime: string;
  contactClosedOut: boolean;
  updatedAt: string;
}

const outcomes: TripOutcome[] = ["completed", "turned-back", "changed-route", "cancelled"];
const text = (value: unknown, limit = 800) => typeof value === "string" ? value.trim().slice(0, limit) : "";

export function parseDebriefs(raw: string | null): Record<string, DebriefRecord> {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const result: Record<string, DebriefRecord> = {};
    for (const [tripId, row] of Object.entries(value as Record<string, unknown>)) {
      if (!row || typeof row !== "object") continue;
      const item = row as Record<string, unknown>;
      if (typeof item.tripId !== "string" || item.tripId !== tripId) continue;
      result[tripId] = {
        schemaVersion: 1,
        tripId,
        outcome: typeof item.outcome === "string" && outcomes.includes(item.outcome as TripOutcome) ? item.outcome as TripOutcome : "completed",
        actualDuration: text(item.actualDuration, 100),
        conditions: text(item.conditions),
        routeChanges: text(item.routeChanges),
        gearLessons: text(item.gearLessons),
        nextTime: text(item.nextTime),
        contactClosedOut: item.contactClosedOut === true,
        updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : "",
      };
    }
    return result;
  } catch {
    return {};
  }
}

export function debriefSummary(trip: SavedTrip, record: DebriefRecord) {
  return [
    `TRAILDESK TRIP DEBRIEF — ${trip.name}`,
    `${trip.region}${trip.date ? ` · departed ${trip.date}` : ""}`,
    `Outcome: ${record.outcome.replace("-", " ")}`,
    record.actualDuration ? `Actual duration: ${record.actualDuration}` : "",
    record.conditions ? `Conditions encountered: ${record.conditions}` : "",
    record.routeChanges ? `Route changes: ${record.routeChanges}` : "",
    record.gearLessons ? `Gear lessons: ${record.gearLessons}` : "",
    record.nextTime ? `For next time: ${record.nextTime}` : "",
    `Trusted contact close-out: ${record.contactClosedOut ? "recorded" : "not recorded"}`,
    "This is a personal trip record, not verified route or safety advice.",
  ].filter(Boolean).join("\n");
}
