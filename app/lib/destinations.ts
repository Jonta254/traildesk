/* ── Shared trekking-destination data ─────────────────────────────────
   Single source of truth used by both /explore (browse + live maps) and
   /plan (prefill "Save as trip"). Every entry is a genuine, publicly known
   place. `query` is an exact Google Maps search string — no invented
   places, coordinates, or statistics. ──────────────────────────────── */

export type Difficulty = "Moderate" | "Hard" | "Expert";

export interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  type: string;
  headline: string; // key figure (elevation / length)
  duration: string;
  difficulty: Difficulty;
  bestSeason: string;
  description: string;
  query: string; // exact Google Maps search string
}

export const DESTINATIONS: Destination[] = [
  {
    id: "kilimanjaro", name: "Mount Kilimanjaro", country: "Tanzania", flag: "🇹🇿",
    type: "Summit trek", headline: "5,895 m", duration: "5–9 days", difficulty: "Expert",
    bestSeason: "Jan–Mar · Jun–Oct",
    description: "Africa's highest point and the tallest free-standing mountain on Earth. The climb to Uhuru Peak is non-technical, but altitude is the real test — routes such as Machame and Marangu pass through five climate zones from rainforest to arctic summit.",
    query: "Mount Kilimanjaro, Tanzania",
  },
  {
    id: "mount-kenya", name: "Mount Kenya (Point Lenana)", country: "Kenya", flag: "🇰🇪",
    type: "Summit trek", headline: "4,985 m", duration: "4–5 days", difficulty: "Hard",
    bestSeason: "Jan–Feb · Aug–Sep",
    description: "The trekking summit Point Lenana sits at 4,985 m; the true peaks Batian and Nelion are technical rock climbs. A UNESCO World Heritage site of glaciers, tarns and Afro-alpine moorland.",
    query: "Mount Kenya National Park, Kenya",
  },
  {
    id: "table-mountain", name: "Table Mountain", country: "South Africa", flag: "🇿🇦",
    type: "Day hike", headline: "1,085 m", duration: "2–3 hr ascent", difficulty: "Moderate",
    bestSeason: "Year-round",
    description: "Cape Town's flat-topped landmark above the city. The Platteklip Gorge route is a steep, direct two-to-three-hour ascent; the cableway offers an easy descent when the wind picks up.",
    query: "Table Mountain, Cape Town, South Africa",
  },
  {
    id: "simien", name: "Simien Mountains (Ras Dashen)", country: "Ethiopia", flag: "🇪🇹",
    type: "Multi-day trek", headline: "4,543 m", duration: "4–10 days", difficulty: "Hard",
    bestSeason: "Oct–Mar",
    description: "Ethiopia's dramatic escarpment and its highest peak, Ras Dashen. Trekked with a local guide and scout, famous for troops of gelada and thousand-metre cliff edges.",
    query: "Simien Mountains National Park, Ethiopia",
  },
  {
    id: "toubkal", name: "Mount Toubkal", country: "Morocco", flag: "🇲🇦",
    type: "Summit trek", headline: "4,167 m", duration: "2 days", difficulty: "Hard",
    bestSeason: "Apr–Oct",
    description: "The highest peak in North Africa, reached from the village of Imlil in the High Atlas. A classic two-day trek via the mountain refuge; winter ascents require crampons and an ice axe.",
    query: "Mount Toubkal, Morocco",
  },
  {
    id: "drakensberg", name: "Drakensberg Amphitheatre", country: "South Africa", flag: "🇿🇦",
    type: "Day / multi-day", headline: "~3,000 m", duration: "1–2 days", difficulty: "Hard",
    bestSeason: "Mar–May · Sep–Nov",
    description: "The vast Amphitheatre escarpment and Tugela Falls, among the highest waterfalls in the world. The chain-ladder route tops out onto the summit plateau of the Northern Drakensberg.",
    query: "Amphitheatre, Drakensberg, South Africa",
  },
  {
    id: "rwenzori", name: "Rwenzori (Margherita Peak)", country: "Uganda", flag: "🇺🇬",
    type: "Expedition", headline: "5,109 m", duration: "7–9 days", difficulty: "Expert",
    bestSeason: "Jun–Aug · Dec–Feb",
    description: "The glaciated 'Mountains of the Moon' on the Uganda–DRC border. Reaching Margherita Peak is a full expedition through bog, montane rainforest and permanent ice.",
    query: "Rwenzori Mountains National Park, Uganda",
  },
  {
    id: "meru", name: "Mount Meru", country: "Tanzania", flag: "🇹🇿",
    type: "Summit trek", headline: "4,562 m", duration: "3–4 days", difficulty: "Hard",
    bestSeason: "Jun–Feb",
    description: "Tanzania's second-highest mountain and a superb acclimatisation trek before Kilimanjaro. A narrow summit ridge is walked in the dark to reach the crater rim at dawn.",
    query: "Mount Meru, Arusha, Tanzania",
  },
  {
    id: "fish-river", name: "Fish River Canyon", country: "Namibia", flag: "🇳🇦",
    type: "Multi-day trail", headline: "~85 km", duration: "4–5 days", difficulty: "Expert",
    bestSeason: "May–Sep (trail open)",
    description: "One of the largest canyons on Earth. The roughly 85 km trail is unsupported and permit-only, open in the cooler months — remote, self-sufficient desert trekking with no exit points.",
    query: "Fish River Canyon, Namibia",
  },
  {
    id: "longonot", name: "Mount Longonot", country: "Kenya", flag: "🇰🇪",
    type: "Day hike", headline: "2,776 m", duration: "4–5 hr loop", difficulty: "Moderate",
    bestSeason: "Jun–Feb",
    description: "A dormant volcano above Lake Naivasha with a full crater-rim circuit. A popular half-day loop, close to Nairobi, with panoramic views across the Great Rift Valley.",
    query: "Mount Longonot National Park, Kenya",
  },
  {
    id: "mulanje", name: "Mount Mulanje (Sapitwa)", country: "Malawi", flag: "🇲🇼",
    type: "Multi-day trek", headline: "3,002 m", duration: "2–4 days", difficulty: "Hard",
    bestSeason: "May–Oct",
    description: "The highest massif in Central Africa, rising sharply from the surrounding plains. Sapitwa Peak is reached over granite slabs, with basic mountain huts spaced along the routes.",
    query: "Mount Mulanje, Malawi",
  },
  {
    id: "hells-gate", name: "Hell's Gate National Park", country: "Kenya", flag: "🇰🇪",
    type: "Day walk / cycle", headline: "Gorges & geothermal", duration: "3–5 hr", difficulty: "Moderate",
    bestSeason: "Year-round",
    description: "One of the few Kenyan parks you can explore on foot or by bicycle, winding among red gorges, geothermal steam vents and grazing wildlife near Lake Naivasha.",
    query: "Hell's Gate National Park, Kenya",
  },
];

/* ── Google Maps URL builders (real links, no API key) ──────────────── */
export function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
export function mapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
export function mapsEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=8&output=embed`;
}

/* ── Bridge into the planner ─────────────────────────────────────────
   The /plan wizard groups gear by trip type. These keys must match the
   GEAR_TEMPLATES keys defined in app/plan/page.tsx. ─────────────────── */
export type GearTemplateKey = "Day Hike" | "Overnight" | "Multi-day" | "Alpine / Technical";

/** Map a real destination to the closest planner gear template. */
export function gearTemplateForDestination(d: Destination): GearTemplateKey {
  const type = d.type.toLowerCase();
  const dur = d.duration.toLowerCase();
  // Glaciated / permanent-ice expeditions need technical gear.
  if (type.includes("expedition")) return "Alpine / Technical";
  const multiDay =
    dur.includes("day") ||
    type.includes("multi-day") ||
    type.includes("trek") ||
    type.includes("trail");
  const singleDay = (dur.includes("hr") || dur.includes("hour")) && !multiDay;
  if (singleDay) return "Day Hike";
  return "Multi-day";
}

export interface TripPrefill {
  name: string;
  region: string;
  type: GearTemplateKey;
  duration: string;
  distance: string;
  notes: string;
}

/** Find a destination by its id. */
export function findDestination(id: string | null | undefined): Destination | undefined {
  if (!id) return undefined;
  return DESTINATIONS.find((d) => d.id === id);
}

/** Extract a plain kilometre figure from a headline like "~85 km" ("" if none). */
function distanceFromHeadline(headline: string): string {
  const m = headline.match(/([\d,.]+)\s*km/i);
  return m ? m[1].replace(/,/g, "") : "";
}

/** Build the planner form prefill for a destination. No fabricated data —
    every field is copied or derived from the destination's own record. */
export function destinationPrefill(d: Destination): TripPrefill {
  return {
    name: d.name,
    region: d.country,
    type: gearTemplateForDestination(d),
    duration: d.duration,
    distance: distanceFromHeadline(d.headline),
    notes:
      `${d.description}\n\n` +
      `Best season: ${d.bestSeason}. Confirm current permits, guide requirements ` +
      `and conditions with the managing park authority before departure. ` +
      `Location: ${d.query}.`,
  };
}
