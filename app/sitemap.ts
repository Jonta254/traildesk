import type { MetadataRoute } from "next";
import { DESTINATIONS } from "@/app/lib/destinations";
export default function sitemap():MetadataRoute.Sitemap{const base="https://traildesk.vercel.app";return ["","/explore","/regions","/gear","/about","/readiness","/debrief"].map(path=>({url:`${base}${path}`,lastModified:new Date("2026-09-12"),changeFrequency:"monthly" as const,priority:path===""?1:.7})).concat(DESTINATIONS.map(d=>({url:`${base}/explore/${d.slug}`,lastModified:new Date(d.lastReviewedAt),changeFrequency:"monthly" as const,priority:.6})))}
