import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore African treks",
  description: "Research 12 established African trekking destinations and use them as starting points for a browser-local trip plan.",
};

export default function ExploreLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
