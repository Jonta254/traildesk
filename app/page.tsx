import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { DESTINATIONS } from "@/app/lib/destinations";
import { PHOTO_CREDITS } from "@/app/lib/photo-credits";
import "./home.css";

const highlightIds = ["mount-kenya", "kilimanjaro", "rwenzori", "simien", "fish-river", "longonot"];
const highlights = highlightIds.flatMap((id) => {
  const destination = DESTINATIONS.find((item) => item.id === id);
  return destination ? [destination] : [];
});
const countryCount = new Set(DESTINATIONS.map((destination) => destination.country)).size;

const currentCapabilities = [
  ["Research", "Compare established destinations using a shared catalogue of practical context."],
  ["Prepare", "Build route notes, a departure brief, and a trip-specific gear checklist."],
  ["Record", "Keep plans and reusable packing lists in the current browser profile."],
] as const;

export default function HomePage() {
  const heroCredit = PHOTO_CREDITS.kilimanjaro;

  return (
    <AppShell>
      <main id="main-content" className="home-page">
        <section className="home-hero" aria-labelledby="home-title">
          <Image
            className="home-hero-image"
            src="/explore/kilimanjaro.jpg"
            alt="Mount Kilimanjaro rising beyond the Amboseli landscape"
            fill
            priority
            quality={88}
            sizes="100vw"
          />
          <div className="home-hero-shade" aria-hidden="true" />
          <div className="home-hero-inner">
            <div className="home-hero-copy">
              <p className="eyebrow">African trek planning</p>
              <h1 id="home-title">Plan the trail before you leave signal.</h1>
              <p className="home-hero-lede">Research the route, prepare your gear, record the details your group needs, and keep a clear trip brief on your device.</p>
              <div className="home-actions">
                <Link className="button button-primary" href="/explore">Explore destinations <ArrowRight size={17} aria-hidden="true" /></Link>
                <Link className="button home-secondary-action" href="/plan">Build a trip plan</Link>
              </div>
              <p className="home-capability-line">{DESTINATIONS.length} researched destinations <span aria-hidden="true">/</span> {countryCount} African countries <span aria-hidden="true">/</span> Browser-local trip records</p>
            </div>
            <p className="home-hero-credit">Photo: {heroCredit.author} · <a href={heroCredit.source} target="_blank" rel="noopener noreferrer">{heroCredit.license}</a></p>
          </div>
        </section>

        <section className="home-status" aria-label="Product status">
          <div className="home-status-inner">
            <div><span>Available now</span><strong>Destination research, trip briefs, gear lists</strong></div>
            <div><span>Internet required</span><strong>Google Maps and external directions</strong></div>
            <div><span>Stored locally</span><strong>No account or cloud backup</strong></div>
          </div>
        </section>

        <section className="container home-section home-now" aria-labelledby="today-heading">
          <div className="home-section-intro">
            <p className="eyebrow">What works today</p>
            <h2 id="today-heading">A focused workspace for the work before departure.</h2>
            <p>TrailDesk helps hikers, group organisers, and first-time visitors turn early research into a practical brief. It does not replace official route information or field equipment.</p>
          </div>
          <ol className="home-capability-list">
            {currentCapabilities.map(([title, body], index) => (
              <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="home-destinations" aria-labelledby="destinations-heading">
          <div className="container home-section">
            <div className="home-section-heading">
              <div><p className="eyebrow">Destination field notes</p><h2 id="destinations-heading">Six routes. Very different preparation.</h2></div>
              <p>Use the catalogue to establish context, then verify the specific route, access rules, permits, conditions, and guide requirements.</p>
            </div>
            <div className="home-destination-list">
              {highlights.map((destination, index) => {
                const credit = PHOTO_CREDITS[destination.id];
                return (
                  <article className={`home-destination home-destination-${index + 1}`} key={destination.id}>
                    <Link className="home-destination-image" href={`/explore#${destination.id}`} aria-label={`Research ${destination.name}`}>
                      <Image src={`/explore/${destination.id}.jpg`} alt={`${destination.name}, ${destination.country}`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw" />
                    </Link>
                    <div className="home-destination-copy">
                      <div className="home-destination-topline"><span>{destination.country}</span><StatusBadge>{destination.difficulty}</StatusBadge></div>
                      <h3><Link href={`/explore#${destination.id}`}>{destination.name}</Link></h3>
                      <dl>
                        <div><dt>Type</dt><dd>{destination.type}</dd></div>
                        <div><dt>Elevation / distance</dt><dd>{destination.headline}</dd></div>
                        <div><dt>Typical duration</dt><dd>{destination.duration}</dd></div>
                        <div><dt>Common season</dt><dd>{destination.bestSeason}</dd></div>
                      </dl>
                      <p className="home-photo-credit">Photo: {credit.author} · <a href={credit.source} target="_blank" rel="noopener noreferrer">{credit.license}</a></p>
                    </div>
                  </article>
                );
              })}
            </div>
            <Link className="home-text-link" href="/explore">See all destinations <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="container home-section home-planning" aria-labelledby="planning-heading">
          <div className="home-planning-copy">
            <p className="eyebrow">Planning workflow</p>
            <h2 id="planning-heading">One brief, built in four deliberate steps.</h2>
            <p>Start with route context, adapt a gear template, record the contact plan you have agreed elsewhere, and review everything before saving it to this browser.</p>
            <ol>
              <li><span>1</span> Trip details</li><li><span>2</span> Gear checklist</li><li><span>3</span> Contact plan</li><li><span>4</span> Review and save</li>
            </ol>
            <Link className="button" href="/plan">Open the planner <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="home-plan-preview" aria-label="Sample TrailDesk planning preview">
            <div className="home-preview-header"><div><p>Sample preview</p><h3>Mount Kenya · Point Lenana</h3></div><StatusBadge tone="available">Local draft</StatusBadge></div>
            <dl className="home-preview-facts">
              <div><dt>Region</dt><dd>Kenya</dd></div><div><dt>Departure</dt><dd>18 September 2026</dd></div><div><dt>Duration</dt><dd>5 days</dd></div><div><dt>Trip type</dt><dd>Multi-day</dd></div>
            </dl>
            <div className="home-readiness">
              <div className="home-readiness-label"><span>Gear readiness</span><strong>9 of 12 reviewed</strong></div>
              <div className="home-progress" role="img" aria-label="Gear readiness: 9 of 12 items reviewed"><span /></div>
            </div>
            <div className="home-preview-checks">
              <p><Check size={16} aria-hidden="true" /><span><strong>Emergency contact recorded</strong><small>Share the plan manually before departure</small></span></p>
              <p><Check size={16} aria-hidden="true" /><span><strong>Manual check-in: every 4 hours</strong><small>TrailDesk does not monitor this interval</small></span></p>
              <p><Check size={16} aria-hidden="true" /><span><strong>Saved in this browser</strong><small>No cloud backup or device sync</small></span></p>
            </div>
          </div>
        </section>

        <section className="home-preparation" aria-labelledby="preparation-heading">
          <div className="container home-section">
            <div className="home-section-heading"><div><p className="eyebrow">Practical preparation</p><h2 id="preparation-heading">Details worth deciding early.</h2></div><p>The useful work is rarely glamorous: dates, water, route limits, equipment, local requirements, and a contact who knows the plan.</p></div>
            <div className="home-preparation-list">
              <article><span>01</span><h3>Route context</h3><p>Record the route, region, likely duration, current source notes, and useful reference coordinates.</p></article>
              <article><span>02</span><h3>Gear review</h3><p>Start from a general template, then adapt it to altitude, season, group experience, and local advice.</p></article>
              <article><span>03</span><h3>Contact agreement</h3><p>Write down who has the plan and the check-in arrangement you have agreed through another channel.</p></article>
              <article><span>04</span><h3>Local record</h3><p>Keep a working copy in the browser, then export important information to a more durable format yourself.</p></article>
            </div>
          </div>
        </section>

        <section className="container home-section home-safety" aria-labelledby="safety-heading">
          <div className="home-safety-mark" aria-hidden="true"><ShieldCheck size={34} /></div>
          <div><p className="eyebrow">Know before you rely on it</p><h2 id="safety-heading">TrailDesk prepares information. It does not protect you in the field.</h2></div>
          <div className="home-safety-copy"><p>There are no offline maps, live tracking, weather updates, automatic check-ins, or emergency alerts. Google Maps requires internet. Saved plans remain only in the current browser profile.</p><p>Confirm conditions, permits, access, and guide requirements with park authorities and qualified local operators. Carry appropriate navigation, communication, and emergency equipment.</p></div>
        </section>

        <section className="home-final-cta" aria-labelledby="start-heading">
          <div className="container"><p className="eyebrow">Start with the route</p><h2 id="start-heading">Research first. Then make the plan yours.</h2><div className="home-actions"><Link className="button button-primary" href="/explore">Explore destinations <ArrowRight size={17} aria-hidden="true" /></Link><Link className="button" href="/plan">Build a trip plan</Link></div></div>
        </section>
      </main>
    </AppShell>
  );
}
