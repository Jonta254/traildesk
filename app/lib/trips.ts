export type TripStatus = "planned" | "completed" | "draft";

export interface SavedTrip {
  id: string;
  name: string;
  region: string;
  date: string;
  duration: string;
  distance: string;
  type: string;
  notes: string;
  contactName: string;
  contactPhone: string;
  checkInPlan: string;
  gear: string[];
  coordinates: { lat: number; lng: number } | null;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

export const TRIPS_STORAGE_KEY = "traildesk_trips";
export const STORAGE_VERSION = 1;

export function readTrips(): SavedTrip[] {
  try {
    const value = window.localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((trip): trip is SavedTrip => Boolean(trip && typeof trip === "object" && "id" in trip && "name" in trip));
  } catch {
    return [];
  }
}

export function writeTrips(trips: SavedTrip[]) {
  window.localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  window.localStorage.setItem(`${TRIPS_STORAGE_KEY}_version`, String(STORAGE_VERSION));
}
