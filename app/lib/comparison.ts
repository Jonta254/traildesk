import { DESTINATIONS } from "./destinations";

/** Resolve only known catalogue IDs, preserving the user's order and removing duplicates. */
export function comparisonDestinations(value: string | string[] | undefined) {
  const requested = typeof value === "string" ? [value] : value ?? ["mount-kenya", "kilimanjaro"];
  const ids = [...new Set(requested)].filter(id => DESTINATIONS.some(destination => destination.id === id)).slice(0, 3);
  return ids.flatMap(id => {
    const destination = DESTINATIONS.find(item => item.id === id);
    return destination ? [destination] : [];
  });
}
