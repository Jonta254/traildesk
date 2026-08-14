import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Backpack, Compass, Database, Map, ShieldCheck, Wifi } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { DESTINATIONS } from "@/app/lib/destinations";

const capabilities = [
  { icon: Compass, status: "available" as const, label: "Available now", title: "Research real destinations", body: "Compare 12 established African trekking destinations, their typical duration, broad difficulty, and seasonal context." },
  { icon: Map, status: "online" as const, label: "Internet required", title: "Open maps and directions", body: "Inspect each destination with an embedded Google map or continue to Google Maps for directions. Maps are not downloaded by TrailDesk." },
  { icon: Backpack, status: "available" as const, label: "Available now", title: "Build a preparation plan", body: "Record route notes, dates, useful coordinates, a contact plan, and a gear checklist tailored to the type of trip." },
  { icon: Database, status: "available" as const, label: "This device only", title: "Keep plans in your browser", body: "Saved trips remain in this browser's local storage. There is currently no account, cloud backup, or cross-device sync." },
  { icon: ShieldCheck, status: "planned" as const, label: "Planning aid", title: "Prepare—do not delegate safety", body: "TrailDesk helps organise information. It does not monitor you, contact anyone, or replace a guide, park authority, map, beacon, or emergency service." },
  { icon: Wifi, status: "planned" as const, label: "Future phase", title: "Offline navigation is not included", body: "Downloaded maps, GPX tools, weather sync, live tracking, group sharing, and automated alerts require future production infrastructure." },
];

export default function HomePage() {
  const featured = [DESTINATIONS[0], DESTINATIONS[1], DESTINATIONS[6]];
  return (
    <AppShell>
      <main id="main-content">
        <section className="hero">
          <Image className="hero-media" src="/explore/kilimanjaro.jpg" alt="Mount Kilimanjaro above the Amboseli landscape" fill priority sizes="100vw" />
          <div className="hero-content">
            <p className="eyebrow">African trek research & preparation</p>
            <h1>Know the route before the trailhead.</h1>
            <p className="lede">TrailDesk is a practical workspace for researching African treks, organising route notes, and preparing the gear and contact details you need to verify before departure.</p>
            <div className="cluster"><Link className="button button-primary" href="/explore">Explore destinations <ArrowRight size={17} /></Link><Link className="button" href="/plan">Start a blank plan</Link></div>
            <dl className="fact-strip">
              <div><dt>Catalogue</dt><dd>12 African destinations</dd></div>
              <div><dt>Storage</dt><dd>Your browser only</dd></div>
              <div><dt>Maps</dt><dd>Google Maps · online</dd></div>
            </dl>
          </div>
        </section>

        <section className="container section" aria-labelledby="capabilities-heading">
          <div className="section-heading"><div><p className="eyebrow">Product reality</p><h2 id="capabilities-heading">Useful now. Explicit about its limits.</h2></div><p>Every capability below states whether it works today, needs internet, or belongs to a later production phase.</p></div>
          <div className="capability-grid">
            {capabilities.map(({ icon: Icon, ...item }) => <article className="capability" key={item.title}><Icon size={24} aria-hidden="true" /><StatusBadge tone={item.status}>{item.label}</StatusBadge><h3>{item.title}</h3><p>{item.body}</p></article>)}
          </div>
        </section>

        <section className="container section" aria-labelledby="field-notes-heading">
          <div className="section-heading"><div><p className="eyebrow">Starting points</p><h2 id="field-notes-heading">Three very different objectives.</h2></div><p>Browse the full catalogue for day walks, high-altitude summits, and longer expeditions across the continent.</p></div>
          <div className="editorial-grid">
            {featured.slice(0, 2).map((destination) => <article className="card destination-feature" key={destination.id}><Image src={`/explore/${destination.id}.jpg`} alt={`${destination.name}, ${destination.country}`} fill sizes="(max-width: 900px) 100vw, 55vw" /><div><StatusBadge>{destination.difficulty}</StatusBadge><h3>{destination.name}</h3><p>{destination.country} · {destination.duration} · {destination.headline}</p><Link href={`/explore#${destination.id}`}>View field note <ArrowRight size={14} /></Link></div></article>)}
          </div>
        </section>

        <section className="container section narrow" aria-labelledby="safety-heading">
          <p className="eyebrow">Before departure</p><h2 id="safety-heading">The plan is a working note, not clearance to proceed.</h2>
          <p className="lede">Conditions, access rules, permits, route status, transport, and guide requirements change. Confirm current information with official park authorities and qualified local operators. Carry appropriate navigation and emergency equipment.</p>
          <Link className="button button-primary" href="/explore">Research a destination <ArrowRight size={17} /></Link>
        </section>
      </main>
    </AppShell>
  );
}
