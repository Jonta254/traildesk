import type { Metadata } from "next";
import "./explore.css";

export const metadata: Metadata = {
  title: "Explore international trails",
  description: "Search and compare researched hiking and trekking destinations across Africa, Europe, Asia, North America, South America, and Oceania.",
};

export default function ExploreLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
