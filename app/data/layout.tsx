import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace backup",
  description: "Download or restore your TrailDesk trip records, departure checks, debriefs, gear progress and private review drafts.",
};

export default function DataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
