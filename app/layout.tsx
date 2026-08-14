import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://traildesk.vercel.app"),
  title: { default: "TrailDesk — Plan African treks with clarity", template: "%s · TrailDesk" },
  description: "A practical browser-based workspace for researching African trekking destinations, building trip plans, and preparing gear lists.",
  applicationName: "TrailDesk",
  keywords: ["African trekking", "trip planner", "hiking gear checklist", "trek research"],
  openGraph: { title: "TrailDesk", description: "Research destinations. Build a practical trek plan. Keep it on this device.", type: "website", locale: "en" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "dark", themeColor: "#0b0e0c" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
