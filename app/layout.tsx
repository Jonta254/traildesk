import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TrailDesk", template: "%s · TrailDesk" },
  description: "Offline-first trip planning for people who take going outside seriously. Route mapping, gear checklists, emergency contacts, and trail archives — all available without signal.",
  keywords: ["offline trip planning", "hiking app", "trail planning", "backcountry navigation", "gear checklist", "emergency contacts"],
  openGraph: {
    title: "TrailDesk — Trip Planning That Works Without Signal",
    description: "Offline-first route mapping, gear checklists, and emergency planning for serious hikers and trail runners.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
