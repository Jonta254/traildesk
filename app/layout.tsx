import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./stage.css";
import "./product.css";
import "./fixes.css";
import "./touch.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://traildesk.vercel.app"),
  title: { default: "TrailDesk — International trail research and trip planning", template: "%s · TrailDesk" },
  description: "A practical international trail discovery and trip-preparation workspace with official references and browser-local planning.",
  applicationName: "TrailDesk",
  keywords: ["international trekking", "trail research", "trip planner", "hiking gear checklist"],
  openGraph: { title: "TrailDesk", description: "Research destinations. Build a practical trek plan. Keep it on this device.", type: "website", locale: "en" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "dark", themeColor: "#0b0e0c" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
