import { STRUCTURED_GEAR_TEMPLATES } from "./gear";
import { DIFFICULTIES, type Difficulty } from "./destinations";

export const GEAR_STORAGE_KEY = "traildesk_gear_v1";
export const reviewKey = (id: string) => `traildesk_review_draft_v1_${id}`;
export type PackedState = Record<string, string[]>;
export interface ReviewDraft {
  destinationId: string; displayName: string; visitMonth: string; rating: string;
  difficulty: Difficulty; conditions: string; review: string; tip: string;
  experience: boolean; consent: boolean; updatedAt: string;
}
const object = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

export function parseGearProgress(value: unknown): { packed: PackedState; error: string | null } {
  if (!object(value) || value.schemaVersion !== 2 || !object(value.packed)) {
    return { packed: {}, error: "Saved gear progress has an unsupported format. No checklist was overwritten." };
  }
  const packed: PackedState = {};
  let rejected = false;
  for (const [template, items] of Object.entries(value.packed)) {
    if (!Object.hasOwn(STRUCTURED_GEAR_TEMPLATES, template) || !Array.isArray(items) || !items.every(item => typeof item === "string")) {
      rejected = true;
      continue;
    }
    const allowed = STRUCTURED_GEAR_TEMPLATES[template as keyof typeof STRUCTURED_GEAR_TEMPLATES];
    packed[template] = [...new Set(items)].filter(item => allowed.some(gear => gear.name === item));
  }
  return { packed, error: rejected ? "Some saved gear entries could not be read. Valid checklist selections were recovered." : null };
}

export function emptyReviewDraft(destinationId: string): ReviewDraft {
  return { destinationId, displayName: "", visitMonth: "", rating: "", difficulty: "Moderate", conditions: "", review: "", tip: "", experience: false, consent: false, updatedAt: "" };
}

export function parseReviewDraft(value: unknown, destinationId: string): ReviewDraft | null {
  if (!object(value) || value.destinationId !== destinationId) return null;
  const limits = { displayName: 60, visitMonth: 7, rating: 1, conditions: 160, review: 1200, tip: 400, updatedAt: 40 };
  const draft = emptyReviewDraft(destinationId);
  for (const [field, limit] of Object.entries(limits)) {
    const key = field as keyof typeof limits;
    if (value[key] !== undefined && typeof value[key] !== "string") return null;
    draft[key] = typeof value[key] === "string" ? value[key].slice(0, limit) : "";
  }
  if (typeof value.visitMonth === "string" && value.visitMonth && !/^\d{4}-(0[1-9]|1[0-2])$/.test(value.visitMonth)) return null;
  if (typeof value.rating === "string" && value.rating && !/^[1-5]$/.test(value.rating)) return null;
  if (value.difficulty !== undefined && !DIFFICULTIES.includes(value.difficulty as Difficulty)) return null;
  draft.difficulty = value.difficulty as Difficulty ?? "Moderate";
  for (const flag of ["experience", "consent"] as const) {
    if (value[flag] !== undefined && typeof value[flag] !== "boolean") return null;
    draft[flag] = value[flag] === true;
  }
  return draft;
}
