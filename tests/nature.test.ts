import { describe, expect, it } from "vitest";
import { NATURE_LESSONS } from "@/app/lib/nature";
describe("nature field notes",()=>{it("contains practical, sourced lessons",()=>{expect(NATURE_LESSONS.length).toBeGreaterThanOrEqual(4); for(const lesson of NATURE_LESSONS){expect(lesson.sourceUrl).toMatch(/^https:\/\//);expect(lesson.do.length).toBeGreaterThan(20)}})});
