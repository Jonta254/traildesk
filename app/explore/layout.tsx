import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore African Treks",
  description:
    "Explore real, well-known trekking destinations across Africa — Kilimanjaro, Mount Kenya, Table Mountain, Toubkal, Fish River Canyon and more. Open each on Google Maps, get directions, and plan your trip.",
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
