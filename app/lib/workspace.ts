import { DESTINATIONS } from "./destinations";
import { DEBRIEFS_STORAGE_KEY, parseDebriefs } from "./debriefs";
import { READINESS_STORAGE_KEY, parseReadiness } from "./readiness";
import { parseTrash, parseTrips, TRIPS_STORAGE_KEY, TRIPS_TRASH_KEY } from "./trips";

export const GEAR_STORAGE_KEY = "traildesk_gear_v1";
export const reviewKey = (id: string) => `traildesk_review_draft_v1_${id}`;
export const WORKSPACE_KEYS = [TRIPS_STORAGE_KEY, TRIPS_TRASH_KEY, READINESS_STORAGE_KEY, DEBRIEFS_STORAGE_KEY, GEAR_STORAGE_KEY] as const;
export interface WorkspaceBackup { schemaVersion: 1; exportedAt: string; app: "TrailDesk"; records: Record<string, unknown>; }

export function createWorkspaceBackup(storage: Pick<Storage, "getItem">, now = new Date().toISOString()): WorkspaceBackup {
  const records: Record<string, unknown> = {};
  for (const key of [...WORKSPACE_KEYS, ...DESTINATIONS.map((destination) => reviewKey(destination.id))]) {
    const raw = storage.getItem(key);
    if (!raw) continue;
    try { records[key] = JSON.parse(raw); } catch { /* Corrupt records are deliberately excluded. */ }
  }
  return { schemaVersion: 1, exportedAt: now, app: "TrailDesk", records };
}

function validObject(value: unknown, parser: (raw: string | null) => Record<string, unknown>) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.keys(parser(JSON.stringify(value))).length === Object.keys(value as object).length);
}

function validGear(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const gear = value as Record<string, unknown>;
  if (gear.schemaVersion !== 2 || !gear.packed || typeof gear.packed !== "object" || Array.isArray(gear.packed)) return false;
  return Object.values(gear.packed).every(items => Array.isArray(items) && items.every(item => typeof item === "string"));
}

export function validateWorkspaceBackup(value: unknown) {
  if (!value || typeof value !== "object") return { records: {}, errors: ["Backup must be a JSON object."] };
  const backup = value as Record<string, unknown>;
  if (backup.schemaVersion !== 1 || backup.app !== "TrailDesk" || !backup.records || typeof backup.records !== "object" || Array.isArray(backup.records)) return { records: {}, errors: ["This is not a supported TrailDesk workspace backup."] };
  const input = backup.records as Record<string, unknown>, records: Record<string, unknown> = {}, errors: string[] = [];
  const accept = (key: string, valid: boolean) => {
    if (!(key in input)) return;
    if (valid) records[key] = input[key];
    else errors.push(`${key} was rejected.`);
  };
  accept(TRIPS_STORAGE_KEY, parseTrips(JSON.stringify(input[TRIPS_STORAGE_KEY])).error === null);
  accept(TRIPS_TRASH_KEY, Array.isArray(input[TRIPS_TRASH_KEY]) && parseTrash(JSON.stringify(input[TRIPS_TRASH_KEY])).length === input[TRIPS_TRASH_KEY].length);
  accept(READINESS_STORAGE_KEY, validObject(input[READINESS_STORAGE_KEY], parseReadiness));
  accept(DEBRIEFS_STORAGE_KEY, validObject(input[DEBRIEFS_STORAGE_KEY], parseDebriefs));
  accept(GEAR_STORAGE_KEY, validGear(input[GEAR_STORAGE_KEY]));
  for (const destination of DESTINATIONS) { const key = reviewKey(destination.id); accept(key, Boolean(input[key] && typeof input[key] === "object" && !Array.isArray(input[key]))); }
  return { records, errors };
}
