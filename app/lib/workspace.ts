import { DESTINATIONS } from "./destinations";
import { DEBRIEFS_STORAGE_KEY, parseDebriefs } from "./debriefs";
import { READINESS_STORAGE_KEY, parseReadiness } from "./readiness";
import { parseTrash, parseTrips, TRIPS_STORAGE_KEY, TRIPS_TRASH_KEY } from "./trips";
import { GEAR_STORAGE_KEY, parseGearProgress, parseReviewDraft, reviewKey } from "./local-records";

export { GEAR_STORAGE_KEY, reviewKey } from "./local-records";
export const WORKSPACE_KEYS = [TRIPS_STORAGE_KEY, TRIPS_TRASH_KEY, READINESS_STORAGE_KEY, DEBRIEFS_STORAGE_KEY, GEAR_STORAGE_KEY] as const;
export interface WorkspaceBackup { schemaVersion: 1; exportedAt: string; app: "TrailDesk"; records: Record<string, unknown>; }

export function createWorkspaceBackup(storage: Pick<Storage, "getItem">, now = new Date().toISOString()): WorkspaceBackup {
  const records: Record<string, unknown> = {};
  for (const key of [...WORKSPACE_KEYS, ...DESTINATIONS.map((destination) => reviewKey(destination.id))]) {
    const raw = storage.getItem(key);
    if (!raw) continue;
    try { records[key] = JSON.parse(raw); } catch { /* Corrupt records are deliberately excluded. */ }
  }
  const checked = validateWorkspaceBackup({ schemaVersion: 1, exportedAt: now, app: "TrailDesk", records });
  return { schemaVersion: 1, exportedAt: now, app: "TrailDesk", records: checked.records };
}

function validObject(value: unknown, parser: (raw: string | null) => Record<string, unknown>) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.keys(parser(JSON.stringify(value))).length === Object.keys(value as object).length);
}

export function validateWorkspaceBackup(value: unknown) {
  if (!value || typeof value !== "object") return { records: {}, errors: ["Backup must be a JSON object."] };
  const backup = value as Record<string, unknown>;
  if (backup.schemaVersion !== 1 || backup.app !== "TrailDesk" || !backup.records || typeof backup.records !== "object" || Array.isArray(backup.records)) return { records: {}, errors: ["This is not a supported TrailDesk workspace backup."] };
  const input = backup.records as Record<string, unknown>, records: Record<string, unknown> = {}, errors: string[] = [];
  const accept = (key: string, valid: boolean, normalized: unknown = input[key]) => {
    if (!(key in input)) return;
    if (valid) records[key] = normalized;
    else errors.push(`${key} was rejected.`);
  };
  const trips = parseTrips(JSON.stringify(input[TRIPS_STORAGE_KEY]));
  accept(TRIPS_STORAGE_KEY, trips.error === null && trips.recovered === 0, trips.trips);
  const trash = parseTrash(JSON.stringify(input[TRIPS_TRASH_KEY]));
  accept(TRIPS_TRASH_KEY, Array.isArray(input[TRIPS_TRASH_KEY]) && trash.length === input[TRIPS_TRASH_KEY].length, trash);
  accept(READINESS_STORAGE_KEY, validObject(input[READINESS_STORAGE_KEY], parseReadiness), parseReadiness(JSON.stringify(input[READINESS_STORAGE_KEY])));
  accept(DEBRIEFS_STORAGE_KEY, validObject(input[DEBRIEFS_STORAGE_KEY], parseDebriefs), parseDebriefs(JSON.stringify(input[DEBRIEFS_STORAGE_KEY])));
  const gear = parseGearProgress(input[GEAR_STORAGE_KEY]);
  accept(GEAR_STORAGE_KEY, gear.error === null, { schemaVersion: 2, packed: gear.packed });
  for (const destination of DESTINATIONS) {
    const key = reviewKey(destination.id), draft = parseReviewDraft(input[key], destination.id);
    accept(key, draft !== null, draft);
  }
  return { records, errors };
}

export function restoreWorkspaceRecords(storage: Pick<Storage, "getItem" | "setItem" | "removeItem">, records: Record<string, unknown>) {
  const entries = Object.entries(records).map(([key, value]) => [key, JSON.stringify(value)] as const);
  const previous = entries.map(([key]) => [key, storage.getItem(key)] as const);
  const written: string[] = [];
  try {
    for (const [key, value] of entries) { storage.setItem(key, value); written.push(key); }
  } catch {
    try {
      for (const key of written) storage.removeItem(key);
      for (const [key, value] of previous) if (written.includes(key) && value !== null) storage.setItem(key, value);
    } catch {
      throw new Error("Restore failed and some earlier records could not be recovered. Keep your backup file and try again when browser storage is available.");
    }
    throw new Error("Restore failed because browser storage refused a write. Existing records were kept.");
  }
}
