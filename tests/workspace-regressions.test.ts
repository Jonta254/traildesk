import { describe, expect, it } from "vitest";
import { createWorkspaceBackup, GEAR_STORAGE_KEY, reviewKey, validateWorkspaceBackup } from "../app/lib/workspace";

describe("workspace portability regressions", () => {
  it("includes review drafts saved by the destination review form", () => {
    const key = "traildesk_review_draft_v1_kilimanjaro";
    const draft = { destinationId: "kilimanjaro", review: "My field notes" };
    const backup = createWorkspaceBackup({ getItem: name => name === key ? JSON.stringify(draft) : null });
    expect(reviewKey("kilimanjaro")).toBe(key);
    expect(backup.records[key]).toMatchObject(draft);
  });
  it("rejects gear that would break checklist rendering", () => {
    for (const packed of [{ "Short day hike": 42 }, { "Short day hike": [false] }, []]) {
      const result = validateWorkspaceBackup({ schemaVersion: 1, app: "TrailDesk", records: { [GEAR_STORAGE_KEY]: { schemaVersion: 2, packed } } });
      expect(result.records).not.toHaveProperty(GEAR_STORAGE_KEY);
      expect(result.errors).toContain(`${GEAR_STORAGE_KEY} was rejected.`);
    }
  });
  it("preserves usable gear selections during restore", () => {
    const gear = { schemaVersion: 2, packed: { "Short day hike": ["Navigation backup"] } };
    expect(validateWorkspaceBackup({ schemaVersion: 1, app: "TrailDesk", records: { [GEAR_STORAGE_KEY]: gear } }).records[GEAR_STORAGE_KEY]).toEqual(gear);
  });
});
